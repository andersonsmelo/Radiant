// A cadeia de conteudo entrega AFIRMACAO COM PROVENIENCIA, nao citacao: a claim
// e escrita original e o excerto e a prova auditavel, que vive fora do
// versionamento. Ate 2026-08-07 essa garantia era um acidente de implementacao —
// `manifest_line` por acaso nao copiava o campo `text`, e nada impedia a proxima
// sessao de copiar. Este validador transforma o acidente em contrato.
//
// Quatro checagens, e elas existem separadas porque pegam coisas diferentes:
//   1. chaves       — contrato estrutural das linhas de manifesto e das claims
//                     ancoradas. Vale sem material bruto na maquina;
//   2. hash         — copia INTEGRAL numa claim, sem precisar de material bruto
//                     (o manifesto ja carrega o sha256 de cada excerto);
//   3. substring    — copia PARCIAL numa claim, so onde as extracoes existem;
//   4. arvore       — texto de fonte em QUALQUER arquivo rastreado, nao so em
//                     content-manifest.
//
// A quarta entrou em 2026-08-07 e nasceu de um defeito das outras tres: elas
// varriam `content-manifest/`, que e o que a cadeia produz, enquanto o ADR
// afirmava a garantia no nivel do REPOSITORIO. Havia 253 KB de texto de fonte
// `blocked` rastreado em `conteúdo/extrações/`, commitado antes da politica
// existir, e nenhuma delas o alcancava. Um verde prova a assercao no dominio em
// que rodou, e o dominio nao viaja junto com o resultado — a raiz da varredura
// passa a ser o proprio sistema de registro (`git ls-files`), e nao um caminho
// escolhido a mao, porque caminho escolhido a mao so encontra o que ja se
// esperava encontrar.
//
// Nenhuma das quatro prova ausencia de parafrase proxima; isso e revisao humana.

import { execFileSync } from 'node:child_process';
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

// A assinatura distintiva de um excerto: o comeco dele, normalizado. Curta o
// bastante para ser barata de procurar em centenas de arquivos, longa o bastante
// para que coincidencia seja copia e nao vocabulario compartilhado.
const TAMANHO_DA_ASSINATURA = 120;

// Piso para um excerto entrar na varredura. NAO e o mesmo numero da assinatura,
// e a diferenca importa: usar 120 nos dois lugares deixaria de fora todo excerto
// entre 80 e 120 caracteres, e 80 e exatamente o piso que o extrator passou a
// garantir em 2026-08-07. Um excerto curto e assinado por inteiro.
const MINIMO_PARA_VARRER = 80;

// Extensoes que nao carregam texto legivel. Varre-las custa memoria e nao acha
// nada — e um PDF de fonte, se estivesse rastreado, seria achado de outra
// natureza, que este validador nao pretende cobrir.
const BINARIOS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf',
  '.ttf', '.otf', '.woff', '.woff2', '.zip', '.mp4', '.mov',
]);

export function fontesEmArquivosRastreados({ arquivos, textos }) {
  const assinaturas = textos
    .map(normalizar)
    .filter((t) => t.length >= MINIMO_PARA_VARRER)
    .map((t) => t.slice(0, TAMANHO_DA_ASSINATURA));

  const erros = [];
  for (const { caminho, conteudo } of arquivos) {
    const normalizado = normalizar(conteudo);
    if (assinaturas.some((assinatura) => normalizado.includes(assinatura))) {
      erros.push(`arquivo rastreado carrega texto de fonte: ${caminho}`);
    }
  }
  return erros;
}

export function loadArquivosRastreados(root) {
  let saida;
  try {
    saida = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'buffer' });
  } catch {
    // Sem git nao ha "arvore rastreada" para varrer. Devolver null faz o runner
    // DECLARAR que a checagem nao rodou, em vez de aprova-la por vacuidade.
    return null;
  }

  const arquivos = [];
  for (const bruto of saida.toString('utf8').split('\0')) {
    if (!bruto) continue;
    if (BINARIOS.has(path.extname(bruto).toLowerCase())) continue;
    try {
      arquivos.push({ caminho: bruto, conteudo: readFileSync(path.join(root, bruto), 'utf8') });
    } catch {
      // Arquivo listado no indice e ausente do disco, ou binario sem extensao
      // conhecida. Nao e vazamento; e ruido.
    }
  }
  return arquivos;
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
  const rastreados = loadArquivosRastreados(root);

  const erros = [
    ...chavesForaDoContrato({ manifesto, aulas }),
    ...excertosCopiadosPorHash({ manifesto, aulas }),
    ...(textos ? claimsCopiadasDaFonte({ aulas, textos }) : []),
    ...(textos && rastreados ? fontesEmArquivosRastreados({ arquivos: rastreados, textos }) : []),
  ];

  const relatorio = {
    aulas: aulas.length,
    excertos: manifesto.length,
    // Declarados sempre, inclusive quando valem zero: uma checagem que nao rodou
    // e indistinguivel de uma que passou se o relatorio nao disser qual foi.
    textosDeExtracaoLidos:
      textos === null ? 'ausentes: as checagens de copia NAO rodaram' : textos.length,
    arquivosRastreadosVarridos:
      rastreados === null
        ? 'git indisponivel: a varredura da arvore rastreada NAO rodou'
        : rastreados.length,
    erros,
  };

  process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
  return erros.length === 0 ? 0 : 1;
}

// `process.argv[1]` e indefinido quando o modulo e importado por um contexto sem
// script de entrada (`node -e`, alguns runners). Sem a guarda, `pathToFileURL`
// lanca e o modulo fica impossivel de importar — medido em 2026-08-07.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
