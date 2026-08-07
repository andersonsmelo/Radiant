// A cadeia de conteudo entrega AFIRMACAO COM PROVENIENCIA, nao citacao: a claim
// e escrita original e o excerto e a prova auditavel, que vive fora do
// versionamento. Ate 2026-08-07 essa garantia era um acidente de implementacao —
// `manifest_line` por acaso nao copiava o campo `text`, e nada impedia a proxima
// sessao de copiar. Este validador transforma o acidente em contrato.
//
// Tres checagens, e elas existem separadas porque pegam coisas diferentes:
//   1. chaves       — contrato estrutural, vale sem material bruto na maquina;
//   2. hash         — copia INTEGRAL, pega sem material bruto (o manifesto ja
//                     carrega o sha256 de cada excerto);
//   3. substring    — copia PARCIAL, so onde as extracoes existem.
// Nenhuma delas prova ausencia de parafrase proxima; isso e revisao humana.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export const CHAVES_DA_LINHA_DE_MANIFESTO = new Set([
  'id',
  'sourceSlug',
  'pageStart',
  'pageEnd',
  'hash',
  'rightsClass',
  'allowedUses',
]);

export const CHAVES_DA_CLAIM_ANCORADA = new Set(['claim', 'excerptId', 'hash']);

// Abaixo deste tamanho, coincidencia literal deixa de ser evidencia de copia e
// passa a ser vocabulario tecnico compartilhado ("resolucao espacial").
const MINIMO_PARA_ACUSAR_TRECHO = 40;

const normalizar = (texto) => texto.replace(/\s+/g, ' ').trim().toLowerCase();

export function chavesForaDoContrato({ manifesto, aulas }) {
  const erros = [];

  for (const linha of manifesto) {
    for (const chave of Object.keys(linha)) {
      if (!CHAVES_DA_LINHA_DE_MANIFESTO.has(chave)) {
        erros.push(`linha de manifesto ${linha.id}: chave fora do contrato: ${chave}`);
      }
    }
  }

  for (const { nome, dados } of aulas) {
    for (const claim of dados.claims ?? []) {
      for (const chave of Object.keys(claim)) {
        if (!CHAVES_DA_CLAIM_ANCORADA.has(chave)) {
          erros.push(`${nome}: claim com chave fora do contrato: ${chave}`);
        }
      }
    }
  }

  return erros;
}

export function excertosCopiadosPorHash({ manifesto, aulas }) {
  const porHash = new Map(manifesto.map((linha) => [linha.hash, linha.id]));
  const erros = [];

  for (const { nome, dados } of aulas) {
    for (const claim of dados.claims ?? []) {
      for (const valor of Object.values(claim)) {
        if (typeof valor !== 'string') continue;
        const id = porHash.get(createHash('sha256').update(valor, 'utf8').digest('hex'));
        if (id) {
          erros.push(`${nome}: valor identico ao texto do excerto ${id}`);
        }
      }
    }
  }

  return erros;
}

export function claimsCopiadasDaFonte({ aulas, textos }) {
  const corpus = textos.map(normalizar);
  const erros = [];

  for (const { nome, dados } of aulas) {
    for (const claim of dados.claims ?? []) {
      const texto = normalizar(claim.claim ?? '');
      if (texto.length < MINIMO_PARA_ACUSAR_TRECHO) continue;
      if (corpus.some((fonte) => fonte.includes(texto))) {
        erros.push(`${nome}: a claim "${claim.claim.slice(0, 60)}..." e trecho literal da fonte`);
      }
    }
  }

  return erros;
}

export function loadArtefatos(root) {
  const manifesto = readFileSync(
    path.join(root, 'content-manifest', 'excerpts', 'manifest.jsonl'),
    'utf8',
  )
    .split('\n')
    .filter((linha) => linha.trim())
    .map((linha) => JSON.parse(linha));

  const pasta = path.join(root, 'content-manifest', 'lessons');
  const aulas = existsSync(pasta)
    ? readdirSync(pasta)
        .filter((nome) => nome.endsWith('.anchored.json'))
        .map((nome) => ({ nome, dados: JSON.parse(readFileSync(path.join(pasta, nome), 'utf8')) }))
    : [];

  return { manifesto, aulas };
}

export function loadTextosDeExtracao(root) {
  const raiz = path.join(root, 'Conteúdo', 'extrações');
  if (!existsSync(raiz)) return null;

  const textos = [];
  for (const dir of readdirSync(raiz)) {
    const arquivo = path.join(raiz, dir, 'excerpts.json');
    if (!existsSync(arquivo)) continue;
    for (const excerpt of JSON.parse(readFileSync(arquivo, 'utf8')).excerpts) {
      textos.push(excerpt.text);
    }
  }
  return textos;
}

export function main(root = process.cwd()) {
  const { manifesto, aulas } = loadArtefatos(root);
  const textos = loadTextosDeExtracao(root);

  const erros = [
    ...chavesForaDoContrato({ manifesto, aulas }),
    ...excertosCopiadosPorHash({ manifesto, aulas }),
    ...(textos ? claimsCopiadasDaFonte({ aulas, textos }) : []),
  ];

  const relatorio = {
    aulas: aulas.length,
    excertos: manifesto.length,
    // Declarado sempre, inclusive quando vale zero: uma checagem que nao rodou
    // e indistinguivel de uma que passou se o relatorio nao disser qual foi.
    textosDeExtracaoLidos: textos === null ? 'ausentes: checagem de copia parcial NAO rodou' : textos.length,
    erros,
  };

  process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
  return erros.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
