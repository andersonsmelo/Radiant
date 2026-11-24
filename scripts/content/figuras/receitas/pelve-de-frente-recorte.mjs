// Fonte de pelve-de-frente-recorte: a MESMA fonte de pelve-de-frente (todos os 129 caminhos, mesmas cores), com outro viewBox:
// recorte ampliado da parte de baixo da pelve. Só enquadramento; o que sai do quadro sai pelo viewBox.
// Uso (da raiz do repositório): node scripts/content/figuras/receitas/pelve-de-frente-recorte.mjs   (depois de pelve-de-frente.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
// viewBox da fonte inteira: 2713 1137 2807 2105 (960 x 720 px de render). Recorte: px x 250..710, y 346..691.
const VB = '3444 2257 1345 1009';
const src = readFileSync(join(D, '..', 'fontes', 'pelve-de-frente.svg'), 'utf8');
writeFileSync(join(D, '..', 'fontes', 'pelve-de-frente-recorte.svg'), src.replace(/viewBox="[^"]*"/, `viewBox="${VB}"`));
