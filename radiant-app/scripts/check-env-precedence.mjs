#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Ordem em que o Expo lê os arquivos de ambiente no servidor de
 * desenvolvimento. O PRIMEIRO que declara uma chave é quem vale.
 *
 * https://docs.expo.dev/guides/environment-variables/
 */
export const DOTENV_PRECEDENCE = [
  '.env.development.local',
  '.env.local',
  '.env.development',
  '.env',
];

/** Lê `KEY=VALUE` de um arquivo de ambiente, ignorando comentários e linhas vazias. */
export function parseDotenv(text) {
  const out = new Map();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!out.has(key)) out.set(key, value);
  }
  return out;
}

/** Qual arquivo, e com que valor, vence para esta chave. */
export function resolveFromFiles(files, key) {
  for (const { name, vars } of files) {
    if (vars.has(key)) return { file: name, value: vars.get(key) };
  }
  return null;
}

/**
 * As divergências entre o que o script DECLARA e o que os arquivos de ambiente
 * vão realmente entregar.
 *
 * Chave que o script declara e nenhum arquivo declara não é conflito: o export
 * do shell vale. Conflito é o arquivo declarar OUTRO valor — porque aí o
 * arquivo vence, e o script mentiu ao imprimir a intenção dele.
 */
export function findConflicts(files, declared) {
  const conflicts = [];
  for (const [key, scriptValue] of Object.entries(declared)) {
    const fromFile = resolveFromFiles(files, key);
    if (!fromFile) continue;
    if (fromFile.value !== scriptValue) {
      conflicts.push({ key, scriptValue, fileValue: fromFile.value, file: fromFile.file });
    }
  }
  return conflicts;
}

export function loadProjectFiles(root) {
  return DOTENV_PRECEDENCE.map((name) => {
    const full = path.join(root, name);
    return existsSync(full)
      ? { name, vars: parseDotenv(readFileSync(full, 'utf8')) }
      : null;
  }).filter(Boolean);
}

// ── CLI ───────────────────────────────────────────────────────────
// Uso: node scripts/check-env-precedence.mjs KEY=VALUE [KEY=VALUE ...]
if (process.argv[1] && process.argv[1].endsWith('check-env-precedence.mjs')) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const declared = Object.fromEntries(
    process.argv.slice(2).map((pair) => {
      const eq = pair.indexOf('=');
      return [pair.slice(0, eq), pair.slice(eq + 1)];
    }),
  );

  const files = loadProjectFiles(root);
  const conflicts = findConflicts(files, declared);

  if (conflicts.length === 0) {
    process.exit(0);
  }

  console.error('\nERRO O ambiente que este script declara NÃO é o que o app vai receber.\n');
  console.error('     Arquivos de ambiente vencem o `export` do shell, e o');
  console.error('     `EXPO_NO_DOTENV=1` NÃO impede isso — medido em 2026-08-21.\n');
  for (const c of conflicts) {
    console.error(`     ${c.key}`);
    console.error(`       o script declara : ${c.scriptValue}`);
    console.error(`       o app vai receber: ${c.fileValue}   (de ${c.file})\n`);
  }
  console.error('     Homologar assim produz conclusões falsas: a sessão inteira');
  console.error('     mede um app diferente do que o roteiro descreve.\n');
  console.error('     Resolva escolhendo UMA autoridade:');
  console.error('       • alinhe o valor no arquivo de ambiente, ou');
  console.error('       • remova a chave do arquivo e deixe o script mandar.\n');
  process.exit(1);
}
