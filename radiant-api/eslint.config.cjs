const js = require('@eslint/js');

function loadTsParser() {
  try {
    return require('@typescript-eslint/parser');
  } catch {
    return require('../radiant-app/node_modules/@typescript-eslint/parser/dist/index.js');
  }
}

const tsParser = loadTsParser();

module.exports = [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/**/* 2.ts',
      'src/**/* 2.tsx',
      'src/**/* 2.js',
      'src/**/* 2.jsx',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
