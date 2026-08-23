import assert from 'node:assert/strict';
import test from 'node:test';

import { findConflicts, parseDotenv, resolveFromFiles, DOTENV_PRECEDENCE } from './check-env-precedence.mjs';

// O defeito que estes casos travam, medido em 2026-08-21: `start-ios-v2.sh`
// exportava EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false, imprimia "REMOTE_SYNC=false"
// e o app subia com sync ATIVADO contra a API de produção, porque `.env`
// declarava `true` e vence o export do shell. `EXPO_NO_DOTENV=1` não impede.
//
// Uma sessão de homologação inteira mediu um app diferente do que o roteiro
// descrevia, e nada avisou. Imprimir a intenção não é verificar o efeito.

const files = (entries) => entries.map(([name, text]) => ({ name, vars: parseDotenv(text) }));

test('a ordem de precedência é a que o Expo usa, e o primeiro arquivo vence', () => {
  assert.deepEqual(DOTENV_PRECEDENCE, [
    '.env.development.local',
    '.env.local',
    '.env.development',
    '.env',
  ]);

  const resolved = resolveFromFiles(
    files([
      ['.env.local', 'A=do-local'],
      ['.env', 'A=do-env\nB=so-no-env'],
    ]),
    'A',
  );

  assert.deepEqual(resolved, { file: '.env.local', value: 'do-local' });
});

test('acusa a divergência nomeando o arquivo e os dois valores', () => {
  const conflitos = findConflicts(
    files([['.env', 'EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true']]),
    { EXPO_PUBLIC_ENABLE_REMOTE_SYNC: 'false' },
  );

  assert.deepEqual(conflitos, [
    {
      key: 'EXPO_PUBLIC_ENABLE_REMOTE_SYNC',
      scriptValue: 'false',
      fileValue: 'true',
      file: '.env',
    },
  ]);
});

test('chave que só o script declara NÃO é conflito', () => {
  // Sem arquivo declarando, o export do shell vale e o script diz a verdade.
  assert.deepEqual(
    findConflicts(files([['.env', 'OUTRA=coisa']]), { EXPO_PUBLIC_ENABLE_DEV_TOOLS: 'true' }),
    [],
  );
});

test('valor igual em arquivo e script NÃO é conflito', () => {
  assert.deepEqual(
    findConflicts(files([['.env', 'X=false']]), { X: 'false' }),
    [],
  );
});

test('um arquivo de precedência maior blinda o de menor', () => {
  // `.env` diverge, mas `.env.local` concorda com o script e vence — logo o app
  // recebe o valor certo e não há o que acusar.
  assert.deepEqual(
    findConflicts(files([['.env.local', 'X=false'], ['.env', 'X=true']]), { X: 'false' }),
    [],
  );
});

test('ignora comentários, linhas vazias e aspas ao redor do valor', () => {
  const vars = parseDotenv('# comentário\n\nA="com aspas"\nB=\nC=sem\n');

  assert.equal(vars.get('A'), 'com aspas');
  assert.equal(vars.get('B'), '');
  assert.equal(vars.get('C'), 'sem');
});
