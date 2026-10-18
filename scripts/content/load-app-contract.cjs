'use strict';
// Executa somente módulos TypeScript locais confiáveis. JSON editorial é dado,
// nunca código. Dependências externas e caminhos fora de radiant-app/src falham.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = fs.realpathSync(path.resolve(__dirname, '../../radiant-app/src'));
// CI de conteúdo instala apenas o compilador fixado, sem dependências nativas.
let ts;
try { ts = require('../../radiant-app/node_modules/typescript'); }
catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  ts = require('typescript');
}
const cache = new Map();

function loadAppContract(relative) {
  const file = fs.realpathSync(path.resolve(root, relative));
  if (!file.startsWith(root + path.sep) || !file.endsWith('.ts')) throw Error('app-contract-source-outside-scope');
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  try {
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const requireLocal = id => {
      if (!id.startsWith('.')) throw Error('app-contract-external-import');
      return loadAppContract(path.relative(root, path.resolve(path.dirname(file), `${id}.ts`)));
    };
    vm.runInNewContext(compiled, { exports: module.exports, module, require: requireLocal, URL }, { filename: file, timeout: 5000 });
    return module.exports;
  } catch (error) { cache.delete(file); throw error; }
}
module.exports = { loadAppContract };
