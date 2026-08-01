import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(__dirname, '..', '..');
const defaultLibraryRoot = path.join(defaultRepoRoot, 'Conteúdo');
const defaultOutputPath = path.join(defaultRepoRoot, 'conteúdo', 'fontes', 'library-catalog.json');
const RIGHTS_CLASSES = new Set(['authorized', 'reference-only', 'blocked']);
const LICENSE_STATUSES = new Set(['verified', 'restricted', 'uncertain', 'conflicting']);
const ALLOWED_USES = new Set(['factual-reference', 'adaptation', 'verbatim-excerpt', 'image-reuse']);

function license(status, label, url = null) {
  return { status, label, url };
}

function authorized(title, contributors, edition, publicationDate, licenseValue, allowedUses, decisionBasis, commercialUse = false) {
  return {
    title,
    contributors,
    edition,
    publicationDate,
    license: licenseValue,
    rightsClass: 'authorized',
    commercialUse,
    allowedUses,
    decisionBasis,
  };
}

function referenceOnly(title, contributors, edition, publicationDate, label, decisionBasis) {
  return {
    title,
    contributors,
    edition,
    publicationDate,
    license: license('restricted', label),
    rightsClass: 'reference-only',
    commercialUse: false,
    allowedUses: ['factual-reference'],
    decisionBasis,
  };
}

function blocked(title, contributors, edition = 'unknown', publicationDate = 'unknown', label = 'No explicit reusable license verified') {
  return {
    title,
    contributors,
    edition,
    publicationDate,
    license: license('uncertain', label),
    rightsClass: 'blocked',
    commercialUse: false,
    allowedUses: [],
    decisionBasis: 'Blocked until provenance, license scope, and editorial suitability are verified by a human reviewer.',
  };
}

export const RIGHTS_DECISIONS_BY_SHA256 = Object.freeze({
  '40a4062ebff20fc9af93b8b89710d44a7b8ef556ab5c534e3e0bc03eb42e9bda': blocked(
    'Radiodiagnóstico e Procedimentos Radiológicos', ['Atena Editora'], 'unknown', '2019', 'Copyright notice only; no reusable license found in the PDF',
  ),
  'f375049d4e936d05122eb68919b034b4178e2fbb77ba9c86190c66f671b59af5': blocked(
    'Fundamentos de Radiologia', ['Everton Costa Pinto'], 'unknown', 'unknown', 'No rights or license notice found in the PDF',
  ),
  '8c602d3d35767ee1c81943c202cf9f720e68913b982071b91a2bc411c02cef0c': authorized(
    'Mamografia: da prática ao controle', ['Ministério da Saúde', 'Instituto Nacional de Câncer'], '1a edição', '2007',
    license('verified', 'Reprodução total ou parcial permitida com citação da fonte'),
    ['factual-reference', 'verbatim-excerpt'],
    'The copyright page explicitly permits total or partial reproduction when the source is cited; commercial reuse remains disabled conservatively.',
  ),
  '54cfbf652832d2beaef7f2e6aadde40baa2d4183e8de6ed15e6e6909827dc6b8': authorized(
    'Princípios de interpretação radiográfica odontológica', ['UNA-SUS/UFMA'], 'unknown', '2014',
    license('verified', 'Reprodução parcial ou total com citação, vedados venda e fins comerciais'),
    ['factual-reference', 'verbatim-excerpt'],
    'The copyright page explicitly permits partial or total noncommercial reproduction with attribution.',
  ),
  '23709ef5715b479896c9dfb2d9b8823c86983a4f579c20cc9c5a07c481ea903b': blocked(
    'Manual de Boas Práticas da Especialidade de Radiologia', ['Sociedade Portuguesa de Radiologia e Medicina Nuclear'], 'unknown', '2009',
  ),
  '683c4aa963286e984634e66c4bcd139f0a80f69ac108b5cd5bad699d74306a3b': blocked(
    'Apostila Completa de Técnicas Radiológicas', ['Unicless'], 'unknown', 'unknown',
  ),
  '6834fe39680a9126ebd42806ddaca6a40c956f0f50964940890d9bd95ba8361a': blocked(
    'O básico que todo generalista deve saber sobre Radiologia', ['Radiologia com Didática'], 'unknown', '2016',
  ),
  '97d584a97d4b3d34bb3a91868210d68a21d3e0104b375e877ed277f488ef2fcb': {
    ...referenceOnly(
      'Guia Básico de Mamografia: passo a passo para interpretação do exame',
      ['Yuri Costa Anjos', 'Diego Dias Freire Carvalho', 'Helder Castelo Branco Diniz Magalhães', 'Mauro Marques Lopes'],
      '1a edição', '2024', 'CC BY-NC-ND 4.0',
      'The verified license forbids derivatives and commercial use, so the work may only support factual consultation.',
    ),
    license: license('verified', 'CC BY-NC-ND 4.0', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  },
  '13061c0646359ce570142c5d26c1f8f06067c7da26686d0b3e4f940bdad4203a': {
    ...blocked('Anatomia Radiológica Básica Ilustrada: Tórax - Campos Pleuropulmonares', ['Luigi Ferreira e Silva', 'Gabriel Iury Sousa Barros de Souza', 'Alexandre Ferreira da Silva'], '1a edição', '2020', 'Conflicting CC BY 4.0 label and no-derivatives/noncommercial notice in the same PDF'),
    license: license('conflicting', 'Conflicting CC BY 4.0 and restrictive notice'),
    decisionBasis: 'Blocked because the PDF simultaneously labels the work CC BY 4.0 and states that alteration and commercial use are forbidden.',
  },
  'e6d818b4f59db3b87ccb95a76a63c7c11c027f3a2b7f6a4fc043c9269f340bee': blocked(
    'Anatomia em Radiologia', ['Fernando Henrique'], 'unknown', '2019',
  ),
  '874706db504b06fd22f7e6d046d95c5024a1a374995cf31152f0ca81d484da84': referenceOnly(
    'Atlas Radiográfico Ilustrado', ['Editora Caminhar'], 'unknown', '2022', 'All rights reserved',
    'The book is expressly all-rights-reserved; embedded third-party Creative Commons images do not license the compilation.',
  ),
  'bcee6864a2125f88e1a40293f02149d802b8a9cde6dc98dd0d4ca3404c1b9504': blocked(
    'Princípios de Física em Radiodiagnóstico', ['Júlio César de A. C. R. Soares'], 'unknown', '2008',
  ),
  '1ef342c4e0a34d4d91843cc100510a49b93373d2ee77309212d52e91a3b5d2d6': blocked(
    'Atlas de Anatomia Radiográfica', [], 'unknown', '2014',
  ),
  'ed36a480d512d69a88762ffb878d12eee1abc70503e42bb261648161e222487a': authorized(
    'Atualização em Mamografia para Técnicos em Radiologia', ['Ministério da Saúde', 'INCA'], '2a edição revista e atualizada', '2019',
    license('verified', 'CC BY-NC-SA 4.0', 'https://creativecommons.org/licenses/by-nc-sa/4.0/'),
    ['factual-reference', 'adaptation', 'verbatim-excerpt'],
    'The copyright page explicitly publishes the work under CC BY-NC-SA 4.0 and permits partial or total reproduction with attribution.',
  ),
  '738310926ce7902a95c85ff8dc88b42a9f6e38afd0b9905b4684c6d931c6a6f6': referenceOnly(
    'Caderno de apoio ao estudo de anatomia humana', [], 'unknown', '2024', 'All rights reserved',
    'The PDF expressly reserves all rights and provides no reusable license.',
  ),
  'ae2ad0132ee5dad9d471c838c238ceb4e32b2a36de4ffb5d553024ba6842d793': referenceOnly(
    'Fisiologia Humana', ['UNIPAC'], 'unknown', '2021', 'Reproduction prohibited',
    'The PDF expressly prohibits total or partial reproduction.',
  ),
  'dbab0597e125ea3fd1547b57e183e027f6b02d76cae864ae872f8cfa8f8092f9': blocked(
    'Fisiologia Humana', [], 'unknown', '2014',
  ),
  'a5300e7c0232cdb02921fa100b33939aa186114134702a3b07d8bc3e3bfeafb6': blocked(
    'Livro de Anatomia', [], 'unknown', '2014',
  ),
  'b88bc9b2f449ae00c16bf2d94e342d2124fb744da7d6471912dd380467348f38': blocked(
    'Manual Prático de Pós-processamento de Imagens', [], 'unknown', '2024',
  ),
  '3c9c04605d56622e64d91d69ae8231746e05834ef81d9360bb0fcbc607d525e5': authorized(
    'Noções Básicas do Estudo da Anatomia Humana', ['André Luiz Fidelis Lima', 'Isabel Comassetto'], '1a edição', '2022',
    license('verified', 'CC BY-NC 4.0', 'https://creativecommons.org/licenses/by-nc/4.0/'),
    ['factual-reference', 'adaptation', 'verbatim-excerpt'],
    'The copyright page explicitly permits noncommercial use, distribution, and reproduction with attribution under CC BY-NC 4.0.',
  ),
  '4e4b0508bd01fd839315218c51d50c0fc1d797d134c40879e15230c70e873455': {
    ...referenceOnly('Radiologia Convencional', ['European Society of Radiology'], 'unknown', '2024', 'CC BY-NC-ND 4.0', 'The verified license forbids derivatives and commercial use.'),
    license: license('verified', 'CC BY-NC-ND 4.0', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  },
  '7d41001450d87b25bb410b520cee96729ccd5d01be0a7b62cc11eb3581a9e755': {
    ...referenceOnly('Ressonância Magnética', ['European Society of Radiology'], 'unknown', '2024', 'CC BY-NC-ND 4.0', 'The verified license forbids derivatives and commercial use.'),
    license: license('verified', 'CC BY-NC-ND 4.0', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  },
  'c76eca66f1426df9c3f6453c13ad650a1565b7f5c88821c03c5e6d9324ed456e': referenceOnly(
    'Radiologia Básica', ['Michael Y. M. Chen', 'Thomas L. Pope', 'David J. Ott'], '2a edição', '2012', 'All rights reserved; reproduction prohibited',
    'Commercial textbook with an explicit prohibition on duplication or reproduction.',
  ),
  '72d5c73d355392d8b4baa60dea1785118759ca801fb0fc902250a1bcfe5ab155': referenceOnly(
    'Ressonância Magnética: Aplicações Práticas', ['Catherine Westbrook'], '4a edição', '2015', 'All rights reserved; reproduction prohibited',
    'Commercial textbook with an explicit prohibition on duplication or reproduction.',
  ),
  '0025e96f41e63e506160cd3209e3232119e80ee3e5d6a91c0031e8658187b632': {
    ...referenceOnly('Tomografia Computadorizada', ['European Society of Radiology'], 'unknown', '2024', 'CC BY-NC-ND 4.0', 'The verified compilation license forbids derivatives and commercial use.'),
    license: license('verified', 'CC BY-NC-ND 4.0', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  },
  '5e4b116bfb0a62c623744d3ebab92d9317230ddf7e4c24680c243dc499220269': referenceOnly(
    'Atlas de Anatomia Humana Sobotta - Volume 2', ['Johannes Sobotta'], 'unknown', 'unknown', 'Commercial work; no reusable license verified',
    'Commercial anatomy atlas retained only for factual consultation with original wording.',
  ),
  'f41b86153a9e6571968ab5d72a196c8873cec1514bf8f27e8aad54a1aa33fd97': referenceOnly(
    'Ciência Radiológica para Tecnólogos: Física, Biologia e Proteção', ['Stewart Carlyle Bushong'], '9a edição', '2016', 'All rights reserved',
    'Commercial textbook whose copyright page expressly reserves all rights.',
  ),
  '6536355f1edb8943bc173ef6d9d2d7ac6fccae8f2acfeabc6ec98b6986ce77d4': {
    ...referenceOnly('Imagem da Mama', ['European Society of Radiology'], 'unknown', '2025', 'CC BY-NC-ND 4.0', 'The verified license forbids derivatives and commercial use.'),
    license: license('verified', 'CC BY-NC-ND 4.0', 'https://creativecommons.org/licenses/by-nc-nd/4.0/'),
  },
  '4bf522f57b8348f5286c1d4f5a7cf6f1585d03ab913abe9bab4bd401578fd801': blocked(
    'Evolução e importância da radiologia', [], 'unknown', '2020',
  ),
  '6768d33d814e6b40f37223756273bb796b9f0b2cabbb3852faa4aac7493c1ccb': referenceOnly(
    'Guyton e Hall: Tratado de Fisiologia Médica', ['John E. Hall'], '13a edição', '2016', 'All rights reserved',
    'Commercial textbook whose copyright page expressly reserves all rights.',
  ),
  'f6f724ccb0ceccd6192f8285ffec4f0a9318e0984d0a3b3eebb19ce150905180': blocked(
    'Material identificado pelo arquivo mmPL6rMp5vmPCRpmYH84Kbm', [], 'unknown', '2009',
  ),
  '5dfdd69295e9fa327d1af7e1f92726cb519537f1986baaba77fbc1e86d264fed': blocked(
    'Radiologia Caso a Caso', ['Ricardo Mell'], 'unknown', '2015',
  ),
  '084308fab0fdd614d97ec0a24256108467096fdc95b904a955793304c2c0db52': blocked(
    'Radiologia', ['Ananda Amaral Santos', 'Carolina Cintra Gomes', 'Ismar Nery Neto'], 'unknown', '2018',
  ),
  '2c3abf0530f3efaddf761f8e4603cb8b2e3cca2abee1664b22a8da487b2f046d': blocked(
    'Radiologia', ['Alexandre T.'], 'unknown', '2015',
  ),
  '66c82ace8c7040c9da74cc6e8a0467b72ead90d04364bea9e1d4aad82132fc99': referenceOnly(
    'Radiologia Básica', [], 'unknown', '2014', 'All rights reserved; reproduction prohibited',
    'The PDF expressly reserves all rights and prohibits reproduction.',
  ),
  '7ce99f1679346fe54496e17b795dc2048fec9bffc7b302b8577e13aaef194a69': referenceOnly(
    'Tratado de Posicionamento Radiográfico e Anatomia Associada', ['Kenneth L. Bontrager', 'John P. Lampignano'], '8a edição', '2016', 'All rights reserved',
    'Commercial textbook whose copyright page expressly reserves all rights.',
  ),
});

function lexicalSort(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function catalogPath(repoRoot, absolutePath) {
  return path.relative(repoRoot, absolutePath).split(path.sep).join('/').normalize('NFC');
}

async function sha256File(absolutePath) {
  const buffer = await fs.promises.readFile(absolutePath);
  return createHash('sha256').update(buffer).digest('hex');
}

export function validateLibraryCatalog(catalog) {
  const errors = [];
  const sources = Array.isArray(catalog?.sources) ? catalog.sources : [];
  const requiredRootFields = ['schemaVersion', 'decisionRevision', 'summary', 'sources'];

  for (const field of requiredRootFields) {
    if (!Object.hasOwn(catalog ?? {}, field)) {
      errors.push(`Catalog is missing ${field}`);
    }
  }

  const seenHashes = new Set();
  let pathCount = 0;

  for (const [index, source] of sources.entries()) {
    const label = source?.id ?? `source[${index}]`;
    const requiredFields = [
      'id', 'sha256', 'primaryPath', 'paths', 'duplicatePaths', 'fileSizeBytes',
      'title', 'contributors', 'edition', 'publicationDate', 'license',
      'rightsClass', 'commercialUse', 'allowedUses', 'decisionBasis',
    ];

    for (const field of requiredFields) {
      if (!Object.hasOwn(source ?? {}, field)) {
        errors.push(`${label} is missing ${field}`);
      }
    }

    if (!/^[a-f0-9]{64}$/.test(source?.sha256 ?? '')) {
      errors.push(`${label} has an invalid sha256`);
    } else if (seenHashes.has(source.sha256)) {
      errors.push(`${label} duplicates sha256 ${source.sha256}`);
    } else {
      seenHashes.add(source.sha256);
    }

    if (!RIGHTS_CLASSES.has(source?.rightsClass)) {
      errors.push(`${label} has an invalid rightsClass`);
    }
    if (!LICENSE_STATUSES.has(source?.license?.status)) {
      errors.push(`${label} has an invalid license status`);
    }
    if (typeof source?.license?.label !== 'string' || source.license.label.length === 0) {
      errors.push(`${label} is missing license label`);
    }
    if (typeof source?.edition !== 'string' || source.edition.length === 0) {
      errors.push(`${label} is missing edition metadata`);
    }
    if (typeof source?.publicationDate !== 'string' || source.publicationDate.length === 0) {
      errors.push(`${label} is missing publicationDate metadata`);
    }
    if (!Array.isArray(source?.contributors)) {
      errors.push(`${label} contributors must be an array`);
    }
    if (!Array.isArray(source?.paths) || source.paths.length === 0) {
      errors.push(`${label} paths must be a non-empty array`);
    } else {
      pathCount += source.paths.length;
      const sortedPaths = [...source.paths].sort(lexicalSort);
      if (JSON.stringify(source.paths) !== JSON.stringify(sortedPaths)) {
        errors.push(`${label} paths must be sorted`);
      }
      if (source.primaryPath !== source.paths[0]) {
        errors.push(`${label} primaryPath must be the first sorted path`);
      }
      if (JSON.stringify(source.duplicatePaths) !== JSON.stringify(source.paths.slice(1))) {
        errors.push(`${label} duplicatePaths must contain every non-primary path`);
      }
    }

    if (!Array.isArray(source?.allowedUses) || source.allowedUses.some((item) => !ALLOWED_USES.has(item))) {
      errors.push(`${label} has invalid allowedUses`);
    }
    if (source?.rightsClass === 'blocked' && (source.commercialUse !== false || source.allowedUses?.length !== 0)) {
      errors.push(`${label} blocked sources cannot allow reuse or commercial use`);
    }
    const isNoncommercial = /(?:BY-?NC|NonCommercial|não comercial|fins comerciais)/i.test(source?.license?.label ?? '');
    if (isNoncommercial && source?.commercialUse !== false) {
      errors.push(`${label} cannot enable commercial use for a noncommercial license`);
    }
  }

  const duplicateFileCount = Math.max(0, pathCount - sources.length);
  if (catalog?.summary?.pdfFileCount !== pathCount) {
    errors.push('Catalog summary pdfFileCount does not match source paths');
  }
  if (catalog?.summary?.uniqueSourceCount !== sources.length) {
    errors.push('Catalog summary uniqueSourceCount does not match sources');
  }
  if (catalog?.summary?.duplicateFileCount !== duplicateFileCount) {
    errors.push('Catalog summary duplicateFileCount does not match duplicate paths');
  }

  return { ok: errors.length === 0, errors };
}

export async function buildLibraryCatalog({
  libraryRoot = defaultLibraryRoot,
  repoRoot = defaultRepoRoot,
  rightsDecisions = RIGHTS_DECISIONS_BY_SHA256,
} = {}) {
  const entries = await readdir(libraryRoot, { withFileTypes: true });
  const pdfPaths = entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.pdf')
    .map((entry) => path.join(libraryRoot, entry.name))
    .sort((left, right) => lexicalSort(catalogPath(repoRoot, left), catalogPath(repoRoot, right)));
  const groups = new Map();

  for (const absolutePath of pdfPaths) {
    const [sha256, fileStats] = await Promise.all([sha256File(absolutePath), stat(absolutePath)]);
    const paths = groups.get(sha256)?.paths ?? [];
    paths.push(catalogPath(repoRoot, absolutePath));
    groups.set(sha256, { sha256, fileSizeBytes: fileStats.size, paths });
  }

  const sources = [];
  for (const group of groups.values()) {
    group.paths.sort(lexicalSort);
    const decision = rightsDecisions[group.sha256];
    if (!decision) {
      throw new Error(`Missing human rights decision for SHA-256 ${group.sha256} (${group.paths.join(', ')})`);
    }
    sources.push({
      id: `library-source:${group.sha256.slice(0, 16)}`,
      sha256: group.sha256,
      primaryPath: group.paths[0],
      paths: group.paths,
      duplicatePaths: group.paths.slice(1),
      fileSizeBytes: group.fileSizeBytes,
      ...decision,
    });
  }
  sources.sort((left, right) => lexicalSort(left.primaryPath, right.primaryPath));

  const catalog = {
    schemaVersion: 1,
    decisionRevision: '2026-07-31',
    summary: {
      pdfFileCount: pdfPaths.length,
      uniqueSourceCount: sources.length,
      duplicateFileCount: pdfPaths.length - sources.length,
    },
    sources,
  };
  const validation = validateLibraryCatalog(catalog);
  if (!validation.ok) {
    throw new Error(`Generated library catalog is invalid:\n${validation.errors.join('\n')}`);
  }
  return catalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = await buildLibraryCatalog();
  await writeFile(defaultOutputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(catalog.summary));
}
