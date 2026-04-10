import fs from 'node:fs';
import path from 'node:path';

function toSlug(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferTitle(filename) {
  if (filename.includes('Fundamentos-de-radiologia')) {
    return 'Fundamentos de Radiologia';
  }

  return filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
}

function inferAuthor(filename) {
  if (filename.includes('Fundamentos-de-radiologia-Autor-Everton-Costa-Pinto')) {
    return 'Everton Costa Pinto';
  }

  return null;
}

export function registerSource({ inputPath }) {
  const filename = path.basename(inputPath);
  const extension = path.extname(filename).toLowerCase().replace('.', '');
  const fileExists = fs.existsSync(inputPath);
  const stats = fileExists ? fs.statSync(inputPath) : null;
  const slug = filename.includes('Fundamentos-de-radiologia')
    ? 'fundamentos-de-radiologia-everton-costa-pinto'
    : toSlug(filename.replace(/\.[^.]+$/, ''));

  return {
    id: `source:${slug}`,
    slug,
    title: inferTitle(filename),
    sourceType: extension,
    authorLabel: inferAuthor(filename),
    relativePath: path.join('conteúdo', filename),
    fileExists,
    fileSizeBytes: stats ? stats.size : 0,
    ingestionStatus: 'registered',
    extractionStatus: 'pending',
    classificationStatus: 'pending',
    conceptStatus: 'pending',
    formatStatus: 'pending',
  };
}
