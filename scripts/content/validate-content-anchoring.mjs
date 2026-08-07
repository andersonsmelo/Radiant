import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export function anchoringErrors({ aula, manifesto }) {
  const porId = new Map(manifesto.map((linha) => [linha.id, linha]));
  const erros = [];

  for (const claim of aula.claims) {
    if (!claim.excerptId) {
      erros.push('afirmacao sem excerto de apoio');
      continue;
    }
    const linha = porId.get(claim.excerptId);
    if (!linha) {
      erros.push(`excerto fora do manifesto: ${claim.excerptId}`);
      continue;
    }
    if (linha.rightsClass !== 'authorized') {
      erros.push(`excerto sem autorizacao de direitos: ${claim.excerptId}`);
      continue;
    }
    if (linha.hash !== claim.hash) {
      erros.push(`hash divergente para ${claim.excerptId}: fonte mudou desde a ancoragem`);
    }
  }

  return erros;
}

export function loadManifest(caminho) {
  return readFileSync(caminho, 'utf8')
    .split('\n')
    .filter((linha) => linha.trim())
    .map((linha) => JSON.parse(linha));
}

export function loadLesson(caminho) {
  return JSON.parse(readFileSync(caminho, 'utf8'));
}

export function main(root = process.cwd()) {
  const pastaDeAulas = path.join(root, 'content-manifest', 'lessons');
  const manifesto = loadManifest(path.join(root, 'content-manifest', 'excerpts', 'manifest.jsonl'));

  const aulas = existsSync(pastaDeAulas)
    ? readdirSync(pastaDeAulas).filter((nome) => nome.endsWith('.anchored.json'))
    : [];

  const relatorio = { aulas: aulas.length, excertos: manifesto.length, porAula: {} };

  // Ausencia de dado reprova. Verde so pode significar "validei dados": um
  // validador que passa com zero aulas mente para o gate exatamente enquanto a
  // cadeia estiver quebrada, que e quando ele precisaria falar.
  if (aulas.length === 0) {
    relatorio.erro = 'nenhuma aula ancorada encontrada: verde so pode significar que validei dados';
    process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
    return 1;
  }

  let total = 0;
  for (const nome of aulas) {
    const aula = loadLesson(path.join(pastaDeAulas, nome));
    const erros = anchoringErrors({ aula, manifesto });
    relatorio.porAula[nome] = erros;
    total += erros.length;
  }

  process.stdout.write(JSON.stringify(relatorio, null, 2) + '\n');
  return total === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
