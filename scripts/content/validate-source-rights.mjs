// Nenhuma fonte com direitos negados pode alimentar a geracao de conteudo.
//
// `validate-no-verbatim` garante que a cadeia entrega AFIRMACAO ORIGINAL e nao
// citacao. Ele responde "o texto foi copiado?" e nao responde "essa obra podia
// ter sido usada?". Sao perguntas independentes: e possivel escrever texto
// inteiramente original a partir de uma obra que a triagem mandava nao abrir.
//
// A triagem existe e e versionada — `conteúdo/fontes/library-catalog.json`
// classifica cada obra em `rightsClass` e registra `decisionBasis`. Em
// 2026-08-24 descobriu-se que ela nunca fora executada: a unica fonte que
// alimenta o catalogo embarcado esta marcada `blocked`, com a justificativa
// "Blocked until provenance, license scope, and editorial suitability are
// verified by a human reviewer". A regra estava escrita e nao valia. Este
// validador transforma a classificacao em contrato.
//
// A ponte entre os dois registros e por CAMINHO, nao por id: o payload de
// governanca referencia `source:<slug>`, o catalogo de biblioteca usa
// `library-source:<hash>`, e quem liga os dois e o `source.json` de cada slug.
// A comparacao normaliza caixa e forma Unicode porque este repositorio ja pagou
// por isso: o disco do macOS soletra `Conteúdo` em NFD e o indice do git em NFC,
// e uma comparacao byte a byte falha exatamente onde nao deveria.
//
// A excecao e datada de proposito. Uma divida de direitos que nao expira vira
// permissao silenciosa; o campo `expiresOn` faz o contrato voltar a reprovar
// sozinho se ninguem resolver.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export const CLASSES_QUE_IMPEDEM_GERACAO = new Set(['blocked']);

/** Caixa e acento fora, para comparar caminho do disco com caminho do indice. */
export function normalizarCaminho(valor) {
  return String(valor ?? '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '');
}

/** Todo `sourceId` citado em qualquer profundidade do payload de governanca. */
export function coletarFontesUsadas(payload) {
  const encontrados = new Set();
  const visitar = (no) => {
    if (Array.isArray(no)) return no.forEach(visitar);
    if (no && typeof no === 'object') {
      for (const [chave, valor] of Object.entries(no)) {
        if (chave === 'sourceId' && typeof valor === 'string') encontrados.add(valor);
        else visitar(valor);
      }
    }
  };
  visitar(payload);
  return encontrados;
}

/** `source:<slug>` -> caminho declarado no `source.json` daquele slug. */
export function indexarFontesDeclaradas(raizFontes) {
  const porId = new Map();
  if (!existsSync(raizFontes)) return porId;
  for (const entrada of readdirSync(raizFontes, { withFileTypes: true })) {
    if (!entrada.isDirectory()) continue;
    const arquivo = path.join(raizFontes, entrada.name, 'source.json');
    if (!existsSync(arquivo)) continue;
    const dados = JSON.parse(readFileSync(arquivo, 'utf8'));
    if (dados?.id) porId.set(dados.id, { slug: entrada.name, caminho: dados.relativePath ?? null });
  }
  return porId;
}

/** `caminho normalizado` -> entrada da triagem de direitos. */
export function indexarTriagem(catalogo) {
  const porCaminho = new Map();
  for (const obra of catalogo?.sources ?? []) {
    for (const caminho of [obra.primaryPath, ...(obra.paths ?? []), ...(obra.duplicatePaths ?? [])]) {
      if (caminho) porCaminho.set(normalizarCaminho(caminho), obra);
    }
  }
  return porCaminho;
}

export function excecaoAtiva(registro, agora) {
  if (!registro?.expiresOn) return false;
  const limite = new Date(`${registro.expiresOn}T23:59:59Z`);
  return !Number.isNaN(limite.valueOf()) && agora <= limite;
}

/**
 * Devolve as violacoes. Vazio = contrato satisfeito.
 * Cada violacao nomeia a fonte, a classe e por que a excecao nao a cobre.
 */
export function avaliar({ usadas, declaradas, triagem, politica, agora = new Date() }) {
  const violacoes = [];
  const excecoes = new Map((politica?.exceptions ?? []).map((e) => [e.sourceId, e]));

  for (const sourceId of [...usadas].sort()) {
    const declarada = declaradas.get(sourceId);
    if (!declarada) {
      violacoes.push({ sourceId, motivo: 'sem `source.json` — a fonte usada nao esta declarada' });
      continue;
    }
    if (!declarada.caminho) {
      violacoes.push({ sourceId, motivo: 'o `source.json` nao declara `relativePath`, entao a triagem nao pode ser localizada' });
      continue;
    }
    const obra = triagem.get(normalizarCaminho(declarada.caminho));
    if (!obra) {
      violacoes.push({ sourceId, motivo: `nao ha entrada na triagem para \`${declarada.caminho}\`` });
      continue;
    }
    const classe = obra.rightsClass ?? 'desconhecida';
    if (!CLASSES_QUE_IMPEDEM_GERACAO.has(classe)) continue;

    const excecao = excecoes.get(sourceId);
    if (!excecao) {
      violacoes.push({ sourceId, classe, titulo: obra.title, motivo: `classe \`${classe}\` alimenta geracao e nao ha excecao registrada` });
    } else if (!excecaoAtiva(excecao, agora)) {
      violacoes.push({ sourceId, classe, titulo: obra.title, motivo: `a excecao venceu em ${excecao.expiresOn}` });
    }
  }
  return violacoes;
}

export function carregar(raiz) {
  const ler = (p) => JSON.parse(readFileSync(path.join(raiz, p), 'utf8'));
  return {
    usadas: coletarFontesUsadas(ler('conteúdo/governança/catalog-payload.json')),
    declaradas: indexarFontesDeclaradas(path.join(raiz, 'conteúdo/fontes')),
    triagem: indexarTriagem(ler('conteúdo/fontes/library-catalog.json')),
    politica: ler('scripts/content/source-rights-policy.json'),
  };
}

function main() {
  const raiz = process.cwd();
  const entrada = carregar(raiz);
  const violacoes = avaliar(entrada);

  console.log(`Fontes que alimentam o catalogo: ${entrada.usadas.size}`);
  for (const [id, e] of (entrada.politica?.exceptions ?? []).map((e) => [e.sourceId, e])) {
    console.log(`  excecao ate ${e.expiresOn} — ${id} (${e.owner})`);
  }

  if (violacoes.length === 0) {
    console.log('OK: nenhuma fonte com direitos negados alimenta a geracao.');
    return;
  }
  console.error(`\nREPROVADO — ${violacoes.length} fonte(s) sem direito de alimentar geracao:`);
  for (const v of violacoes) {
    console.error(`  - ${v.sourceId}${v.titulo ? ` (${v.titulo})` : ''}`);
    console.error(`      ${v.motivo}`);
  }
  console.error('\nResolva a classificacao em `conteúdo/fontes/library-catalog.json`');
  console.error('ou registre excecao datada em `scripts/content/source-rights-policy.json`.');
  process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
