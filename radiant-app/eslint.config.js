// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      '**/* 2.*',
      // Gerados: não se editam à mão, e ambos se declaram assim no próprio
      // conteúdo. Lintá-los produz ruído que ninguém pode corrigir.
      '.expo/**',
      '.rnstorybook/storybook.requires.ts',
    ],
  },
  {
    // `require()` dentro de uma fábrica `jest.mock()` não é estilo: é
    // obrigatório. O Jest içia as chamadas `jest.mock` acima dos imports, e uma
    // fábrica que referencie um binding importado lança "the module factory of
    // jest.mock() is not allowed to reference any out-of-scope variables".
    // Converter para `import` quebraria os testes.
    //
    // Isto NÃO é supressão global: a regra continua valendo em todo o código de
    // produção, que é onde a proibição de `require()` tem sentido. Desligá-la
    // aqui é o que faz os warnings restantes significarem alguma coisa.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
