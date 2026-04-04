import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const contentRoot = path.join(repoRoot, 'conteúdo');

function readJson(relativePath) {
  const absolutePath = path.join(contentRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function readJsonIfExists(relativePath) {
  const absolutePath = path.join(contentRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

export function validateFoundation() {
  const errors = [];
  const sourceIndex = readJson('fontes/index.json');
  const extractionIndex = readJson('extrações/index.json');
  const classificationIndex = readJson('classificação/index.json');
  const galaxias = readJson('taxonomia/galaxias.json');
  const planetas = readJson('taxonomia/planetas.json');
  const estrelas = readJson('taxonomia/estrelas.json');
  const schemaPaths = [
    'governança/esquemas/extraction-record.schema.json',
    'governança/esquemas/classification-record.schema.json',
    'governança/esquemas/concept.schema.json',
    'governança/esquemas/format-bundle.schema.json',
  ];
  const schemas = schemaPaths.map(readJson);

  const galaxyIds = new Set(galaxias.map((item) => item.id));
  const planetIds = new Set(planetas.map((item) => item.id));
  const starIds = new Set(estrelas.map((item) => item.id));
  const planetsById = new Map(planetas.map((item) => [item.id, item]));
  const starsById = new Map(estrelas.map((item) => [item.id, item]));
  const sourceIds = new Set(sourceIndex.sources.map((item) => item.id));
  const extractionStatuses = extractionIndex.jobs.map((job) => job.status);
  const classificationStatuses = classificationIndex.jobs.map((job) => job.status);
  let extractedJobCount = 0;
  let extractedPageCount = 0;
  let extractedExcerptCount = 0;
  let classifiedJobCount = 0;
  let classificationRecordCount = 0;
  let needsReviewCount = 0;

  for (const planeta of planetas) {
    if (!galaxyIds.has(planeta.galaxyId)) {
      errors.push(`Planet ${planeta.id} references unknown galaxy ${planeta.galaxyId}`);
    }
  }

  for (const estrela of estrelas) {
    if (!galaxyIds.has(estrela.galaxyId)) {
      errors.push(`Star ${estrela.id} references unknown galaxy ${estrela.galaxyId}`);
    }
    if (!planetIds.has(estrela.parentPlanetId)) {
      errors.push(`Star ${estrela.id} references unknown parent planet ${estrela.parentPlanetId}`);
    }
  }

  for (const job of extractionIndex.jobs) {
    if (!sourceIds.has(job.sourceId)) {
      errors.push(`Extraction job ${job.id} references unknown source ${job.sourceId}`);
    }
    if (job.status === 'extracted') {
      extractedJobCount += 1;
      const artifactDir = path.join('extrações', job.sourceSlug);
      const jobRecord = readJsonIfExists(path.join(artifactDir, 'extraction-job.json'));
      const pagesRecord = readJsonIfExists(path.join(artifactDir, 'pages.json'));
      const excerptsRecord = readJsonIfExists(path.join(artifactDir, 'excerpts.json'));

      if (!jobRecord) {
        errors.push(`Extraction job ${job.id} is missing its job record`);
      } else if (jobRecord.status !== 'extracted') {
        errors.push(`Extraction job ${job.id} record is not marked extracted`);
      } else if (job.artifacts) {
        if (jobRecord.artifacts?.pageCount !== job.artifacts.pageCount) {
          errors.push(`Extraction job ${job.id} page count does not match its record`);
        }
        if (jobRecord.artifacts?.excerptCount !== job.artifacts.excerptCount) {
          errors.push(`Extraction job ${job.id} excerpt count does not match its record`);
        }
      }

      if (!pagesRecord) {
        errors.push(`Extraction job ${job.id} is missing pages.json`);
      } else {
        extractedPageCount += pagesRecord.pages.length;
        if (pagesRecord.sourceSlug !== job.sourceSlug) {
          errors.push(`Extraction pages for ${job.id} reference the wrong source slug`);
        }
        if (job.artifacts?.pageCount !== pagesRecord.pages.length) {
          errors.push(`Extraction pages for ${job.id} do not match the recorded page count`);
        }
      }

      if (!excerptsRecord) {
        errors.push(`Extraction job ${job.id} is missing excerpts.json`);
      } else {
        extractedExcerptCount += excerptsRecord.excerpts.length;
        if (excerptsRecord.sourceSlug !== job.sourceSlug) {
          errors.push(`Extraction excerpts for ${job.id} reference the wrong source slug`);
        }
        if (job.artifacts?.excerptCount !== excerptsRecord.excerpts.length) {
          errors.push(`Extraction excerpts for ${job.id} do not match the recorded excerpt count`);
        }
      }
    }
  }

  for (const job of classificationIndex.jobs) {
    if (!sourceIds.has(job.sourceId)) {
      errors.push(`Classification job ${job.id} references unknown source ${job.sourceId}`);
    }
    if (job.status === 'classified') {
      classifiedJobCount += 1;
      const artifactDir = path.join('classificação', job.sourceSlug);
      const jobRecord = readJsonIfExists(path.join(artifactDir, 'classification-job.json'));
      const classificationsRecord = readJsonIfExists(path.join(artifactDir, 'classifications.json'));
      const excerptsRecord = readJsonIfExists(path.join('extrações', job.sourceSlug, 'excerpts.json'));

      if (!jobRecord) {
        errors.push(`Classification job ${job.id} is missing its job record`);
      } else if (jobRecord.status !== 'classified') {
        errors.push(`Classification job ${job.id} record is not marked classified`);
      } else if (job.artifacts) {
        if (jobRecord.artifacts?.classificationCount !== job.artifacts.classificationCount) {
          errors.push(`Classification job ${job.id} count does not match its record`);
        }
        if (jobRecord.artifacts?.needsReviewCount !== job.artifacts.needsReviewCount) {
          errors.push(`Classification job ${job.id} review count does not match its record`);
        }
      }

      if (!classificationsRecord) {
        errors.push(`Classification job ${job.id} is missing classifications.json`);
      } else if (!excerptsRecord) {
        errors.push(`Classification job ${job.id} is missing the extracted excerpts it should classify`);
      } else {
        const excerptIds = new Set(excerptsRecord.excerpts.map((item) => item.id));
        const seenExcerptIds = new Set();
        classificationRecordCount += classificationsRecord.classifications.length;

        if (classificationsRecord.sourceSlug !== job.sourceSlug) {
          errors.push(`Classifications for ${job.id} reference the wrong source slug`);
        }
        if (job.artifacts?.classificationCount !== classificationsRecord.classificationCount) {
          errors.push(`Classifications for ${job.id} do not match the recorded classification count`);
        }
        if (classificationsRecord.classificationCount !== classificationsRecord.classifications.length) {
          errors.push(`Classifications for ${job.id} has a mismatched classificationCount`);
        }

        for (const record of classificationsRecord.classifications) {
          if (!excerptIds.has(record.sourceExcerptId)) {
            errors.push(`Classification ${record.id} references unknown excerpt ${record.sourceExcerptId}`);
          }
          if (!galaxyIds.has(record.galaxyId)) {
            errors.push(`Classification ${record.id} references unknown galaxy ${record.galaxyId}`);
          }
          if (!planetIds.has(record.planetId)) {
            errors.push(`Classification ${record.id} references unknown planet ${record.planetId}`);
          }
          if (!starIds.has(record.starId)) {
            errors.push(`Classification ${record.id} references unknown star ${record.starId}`);
          }
          const classifiedPlanet = planetsById.get(record.planetId);
          const classifiedStar = starsById.get(record.starId);
          if (classifiedPlanet && classifiedPlanet.galaxyId !== record.galaxyId) {
            errors.push(`Classification ${record.id} uses planet ${record.planetId} outside galaxy ${record.galaxyId}`);
          }
          if (classifiedStar) {
            if (classifiedStar.galaxyId !== record.galaxyId) {
              errors.push(`Classification ${record.id} uses star ${record.starId} outside galaxy ${record.galaxyId}`);
            }
            if (classifiedStar.parentPlanetId !== record.planetId) {
              errors.push(`Classification ${record.id} uses star ${record.starId} outside planet ${record.planetId}`);
            }
          }
          if (record.sourceSlug !== job.sourceSlug) {
            errors.push(`Classification ${record.id} references the wrong source slug`);
          }
          if (!['approved', 'needs-review'].includes(record.reviewStatus)) {
            errors.push(`Classification ${record.id} has an invalid review status ${record.reviewStatus}`);
          }
          if (seenExcerptIds.has(record.sourceExcerptId)) {
            errors.push(`Classification ${record.id} duplicates excerpt ${record.sourceExcerptId}`);
          }
          seenExcerptIds.add(record.sourceExcerptId);
          if (record.reviewStatus === 'needs-review') {
            needsReviewCount += 1;
          }
        }

        if (seenExcerptIds.size !== excerptIds.size) {
          errors.push(`Classification job ${job.id} does not cover every extracted excerpt`);
        }
      }
    }
  }

  for (const schema of schemas) {
    if (!schema.title) {
      errors.push('Schema is missing title');
    }
    if (!Array.isArray(schema.required) || schema.required.length === 0) {
      errors.push(`Schema ${schema.title ?? 'unknown'} is missing required fields`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      sourceCount: sourceIndex.sources.length,
      extractionJobCount: extractionIndex.jobs.length,
      sourceSlugs: sourceIndex.sources.map((item) => item.slug),
      extractionStatuses,
      extractedJobCount,
      extractedPageCount,
      extractedExcerptCount,
      classificationJobCount: classificationIndex.jobs.length,
      classificationStatuses,
      classifiedJobCount,
      classificationRecordCount,
      needsReviewCount,
      classificationSourceSlugs: classificationIndex.jobs.map((job) => job.sourceSlug),
      galaxyCount: galaxias.length,
      planetCount: planetas.length,
      starCount: estrelas.length,
      galaxyIds: galaxias.map((item) => item.id),
      schemaTitles: schemas.map((schema) => schema.title),
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateFoundation();

  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}
