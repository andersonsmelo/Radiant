import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateLibraryCatalog } from './catalog-library-sources.mjs';
import { validateMediaManifestStructure } from './validate-media-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const contentRoot = path.join(repoRoot, 'conteúdo');
const wave1PriorityTracksPath = path.join(repoRoot, 'conteúdo', 'governança', 'wave-1-priority-tracks.json');

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

function pushMissingFile(errors, absolutePath, label) {
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Missing ${label} at ${path.relative(repoRoot, absolutePath)}`);
  }
}

export function validateFoundation() {
  const errors = [];
  const sourceIndex = readJson('fontes/index.json');
  const extractionIndex = readJson('extrações/index.json');
  const classificationIndex = readJson('classificação/index.json');
  const conceptIndex = readJsonIfExists('conceitos/index.json');
  const formatIndex = readJsonIfExists('formatos/index.json');
  const galaxias = readJson('taxonomia/galaxias.json');
  const planetas = readJson('taxonomia/planetas.json');
  const estrelas = readJson('taxonomia/estrelas.json');
  const wave1PriorityTracks = readJsonIfExists('governança/wave-1-priority-tracks.json');
  const libraryCatalog = readJsonIfExists('fontes/library-catalog.json');
  const mediaManifest = readJsonIfExists('mídia/manifest.json');
  const mediaManifestSchema = readJsonIfExists('governança/esquemas/media-manifest.schema.json');
  const schemaPaths = [
    'governança/esquemas/extraction-record.schema.json',
    'governança/esquemas/classification-record.schema.json',
    'governança/esquemas/concept.schema.json',
    'governança/esquemas/format-bundle.schema.json',
    'governança/esquemas/library-source.schema.json',
  ];
  const schemas = schemaPaths.map(readJson);

  if (!libraryCatalog) {
    errors.push('Missing governed library catalog at conteúdo/fontes/library-catalog.json');
  } else {
    const libraryValidation = validateLibraryCatalog(libraryCatalog);
    errors.push(...libraryValidation.errors.map((error) => `Library catalog: ${error}`));
  }

  if (!mediaManifestSchema) {
    errors.push('Missing media manifest schema');
  } else if (mediaManifestSchema.title !== 'Educational Media Manifest'
    || !Array.isArray(mediaManifestSchema.required)
    || mediaManifestSchema.required.length === 0) {
    errors.push('Media manifest schema is missing its required contract');
  }

  let mediaSummary = { status: 'missing', itemCount: 0, verifiedAnonymizationCount: 0, rejectedCandidateCount: 0 };
  if (!mediaManifest) {
    errors.push('Missing governed media manifest at conteúdo/mídia/manifest.json');
  } else {
    const mediaValidation = validateMediaManifestStructure(mediaManifest);
    mediaSummary = mediaValidation.summary;
    errors.push(...mediaValidation.errors.map((error) => `Media manifest: ${error.path} ${error.rule}`));
  }

  const galaxyIds = new Set(galaxias.map((item) => item.id));
  const planetIds = new Set(planetas.map((item) => item.id));
  const starIds = new Set(estrelas.map((item) => item.id));
  const taxonomySlugs = {
    galaxies: new Set(galaxias.map((item) => item.slug)),
    planets: new Set(planetas.map((item) => item.slug)),
    stars: new Set(estrelas.map((item) => item.slug)),
  };
  const planetsById = new Map(planetas.map((item) => [item.id, item]));
  const starsById = new Map(estrelas.map((item) => [item.id, item]));
  const supportedFormatTypes = new Set(['microlições', 'quizzes', 'reviews', 'casos', 'checkpoints', 'rewards']);
  const expectedBlockTypes = {
    'microlições': ['objective', 'summary', 'signals', 'evidence'],
    'reviews': ['prompt', 'recall', 'signals', 'evidence'],
    'casos': ['case', 'question', 'answer', 'evidence'],
    'checkpoints': ['checkpoint', 'criteria', 'signals', 'evidence'],
    'rewards': ['reward', 'reason', 'next-step', 'evidence'],
  };
  const sourceIds = new Set(sourceIndex.sources.map((item) => item.id));
  const extractionStatuses = extractionIndex.jobs.map((job) => job.status);
  const classificationStatuses = classificationIndex.jobs.map((job) => job.status);
  const conceptStatuses = conceptIndex ? conceptIndex.jobs.map((job) => job.status) : [];
  const formatStatuses = formatIndex ? formatIndex.jobs.map((job) => job.status) : [];
  let extractedJobCount = 0;
  let extractedPageCount = 0;
  let extractedExcerptCount = 0;
  let classifiedJobCount = 0;
  let classificationRecordCount = 0;
  let needsReviewCount = 0;
  let conceptJobCount = 0;
  let conceptRecordCount = 0;
  let conceptNeedsReviewCount = 0;
  let formatJobCount = 0;
  let formatBundleCount = 0;
  let formatNeedsReviewCount = 0;
  const classificationById = new Map();
  const conceptById = new Map();
  const excerptById = new Map();
  const extractionJobsBySourceId = new Map();
  const classificationJobsBySourceId = new Map();
  const conceptJobsBySourceId = new Map();
  const formatJobsBySourceId = new Map();

  for (const job of extractionIndex.jobs) {
    extractionJobsBySourceId.set(job.sourceId, job);
  }

  for (const job of classificationIndex.jobs) {
    classificationJobsBySourceId.set(job.sourceId, job);
  }

  for (const job of conceptIndex?.jobs ?? []) {
    conceptJobsBySourceId.set(job.sourceId, job);
  }

  for (const job of formatIndex?.jobs ?? []) {
    const jobs = formatJobsBySourceId.get(job.sourceId) ?? [];
    jobs.push(job);
    formatJobsBySourceId.set(job.sourceId, jobs);
  }

  for (const job of extractionIndex.jobs) {
    if (job.status === 'extracted') {
      const excerptsRecord = readJsonIfExists(path.join('extrações', job.sourceSlug, 'excerpts.json'));
      if (excerptsRecord) {
        for (const excerpt of excerptsRecord.excerpts) {
          excerptById.set(excerpt.id, excerpt);
        }
      }
    }
  }

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

  pushMissingFile(errors, wave1PriorityTracksPath, 'wave 1 priority track contract');

  if (wave1PriorityTracks) {
    if (wave1PriorityTracks.version !== 'wave-1-2026-04-09') {
      errors.push(`Wave 1 priority track contract has an unexpected version: ${wave1PriorityTracks.version}`);
    }

    if (!Array.isArray(wave1PriorityTracks.tracks) || wave1PriorityTracks.tracks.length < 3) {
      errors.push('Wave 1 priority track contract must expose at least three tracks');
    } else {
      const seenTrackIds = new Set();
      const seenTrackSlugs = new Set();

      for (const track of wave1PriorityTracks.tracks) {
        if (typeof track.id !== 'string' || track.id.length === 0) {
          errors.push('Wave 1 priority track contract includes a track without an id');
        }
        if (typeof track.slug !== 'string' || track.slug.length === 0) {
          errors.push(`Wave 1 track ${track.id ?? 'unknown'} is missing a slug`);
        }
        if (typeof track.title !== 'string' || track.title.length === 0) {
          errors.push(`Wave 1 track ${track.id ?? 'unknown'} is missing a title`);
        }
        if (typeof track.goal !== 'string' || track.goal.length === 0) {
          errors.push(`Wave 1 track ${track.id ?? 'unknown'} is missing a goal`);
        }
        if (typeof track.description !== 'string' || track.description.length === 0) {
          errors.push(`Wave 1 track ${track.id ?? 'unknown'} is missing a description`);
        }
        if (!Array.isArray(track.lessonIds) || track.lessonIds.length === 0) {
          errors.push(`Wave 1 track ${track.id ?? 'unknown'} must expose at least one lesson id`);
        }
        if (seenTrackIds.has(track.id)) {
          errors.push(`Wave 1 priority track contract duplicates track id ${track.id}`);
        }
        if (seenTrackSlugs.has(track.slug)) {
          errors.push(`Wave 1 priority track contract duplicates track slug ${track.slug}`);
        }

        seenTrackIds.add(track.id);
        seenTrackSlugs.add(track.slug);
      }

      if (!taxonomySlugs.galaxies.has('fundamentos')) {
        errors.push('Taxonomy galaxias.json is missing the fundamentos slug for wave 1');
      }
      if (!taxonomySlugs.planets.has('torax')) {
        errors.push('Taxonomy planetas.json is missing the torax slug for wave 1');
      }
      if (!taxonomySlugs.planets.has('abdome')) {
        errors.push('Taxonomy planetas.json is missing the abdome slug for wave 1');
      }
      if (!taxonomySlugs.stars.has('fundamentos')) {
        errors.push('Taxonomy estrelas.json is missing the fundamentos slug for wave 1');
      }
      if (!taxonomySlugs.stars.has('torax')) {
        errors.push('Taxonomy estrelas.json is missing the torax slug for wave 1');
      }
      if (!taxonomySlugs.stars.has('abdome')) {
        errors.push('Taxonomy estrelas.json is missing the abdome slug for wave 1');
      }
    }
  }

  for (const source of sourceIndex.sources) {
    const sourceRecord = readJsonIfExists(path.join('fontes', source.slug, 'source.json'));
    const extractionJob = extractionJobsBySourceId.get(source.id);
    const classificationJob = classificationJobsBySourceId.get(source.id);
    const conceptJob = conceptJobsBySourceId.get(source.id);
    const formatJobs = formatJobsBySourceId.get(source.id) ?? [];
    const expectedExtractionStatus = extractionJob?.status ?? 'pending';
    const expectedClassificationStatus = classificationJob?.status ?? 'pending';
    const expectedConceptStatus = conceptJob?.status ?? 'pending';
    const expectedFormatStatus = formatJobs.length > 0 && formatJobs.every((job) => job.status === 'generated')
      ? 'generated'
      : 'pending';

    if (!sourceRecord) {
      errors.push(`Source ${source.id} is missing fontes/${source.slug}/source.json`);
      continue;
    }

    for (const field of ['id', 'slug', 'title', 'sourceType', 'relativePath']) {
      if (sourceRecord[field] !== source[field]) {
        errors.push(`Source ${source.id} has a mismatched ${field} between index.json and source.json`);
      }
    }

    if (sourceRecord.ingestionStatus !== source.ingestionStatus) {
      errors.push(`Source ${source.id} has a mismatched ingestionStatus between index.json and source.json`);
    }
    if (sourceRecord.extractionStatus !== source.extractionStatus) {
      errors.push(`Source ${source.id} has a mismatched extractionStatus between index.json and source.json`);
    }
    if (sourceRecord.classificationStatus !== source.classificationStatus) {
      errors.push(`Source ${source.id} has a mismatched classificationStatus between index.json and source.json`);
    }
    if (sourceRecord.conceptStatus !== source.conceptStatus) {
      errors.push(`Source ${source.id} has a mismatched conceptStatus between index.json and source.json`);
    }
    if (sourceRecord.formatStatus !== source.formatStatus) {
      errors.push(`Source ${source.id} has a mismatched formatStatus between index.json and source.json`);
    }

    if (source.extractionStatus !== expectedExtractionStatus) {
      errors.push(`Source ${source.id} declares extractionStatus ${source.extractionStatus} but jobs resolve to ${expectedExtractionStatus}`);
    }
    if (source.classificationStatus !== expectedClassificationStatus) {
      errors.push(`Source ${source.id} declares classificationStatus ${source.classificationStatus} but jobs resolve to ${expectedClassificationStatus}`);
    }
    if (source.conceptStatus !== expectedConceptStatus) {
      errors.push(`Source ${source.id} declares conceptStatus ${source.conceptStatus} but jobs resolve to ${expectedConceptStatus}`);
    }
    if (source.formatStatus !== expectedFormatStatus) {
      errors.push(`Source ${source.id} declares formatStatus ${source.formatStatus} but jobs resolve to ${expectedFormatStatus}`);
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
          classificationById.set(record.id, record);
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

  if (conceptIndex) {
    for (const job of conceptIndex.jobs) {
      if (!sourceIds.has(job.sourceId)) {
        errors.push(`Concept job ${job.id} references unknown source ${job.sourceId}`);
      }
      if (job.status === 'normalized') {
        conceptJobCount += 1;
        const artifactDir = path.join('conceitos', job.sourceSlug);
        const jobRecord = readJsonIfExists(path.join(artifactDir, 'concept-job.json'));
        const conceptsRecord = readJsonIfExists(path.join(artifactDir, 'concepts.json'));
        const classificationsRecord = readJsonIfExists(path.join('classificação', job.sourceSlug, 'classifications.json'));

        if (!jobRecord) {
          errors.push(`Concept job ${job.id} is missing its job record`);
        } else if (jobRecord.status !== 'normalized') {
          errors.push(`Concept job ${job.id} record is not marked normalized`);
        } else if (job.artifacts) {
          if (jobRecord.artifacts?.conceptCount !== job.artifacts.conceptCount) {
            errors.push(`Concept job ${job.id} count does not match its record`);
          }
          if (jobRecord.artifacts?.needsReviewCount !== job.artifacts.needsReviewCount) {
            errors.push(`Concept job ${job.id} review count does not match its record`);
          }
        }

        if (!conceptsRecord) {
          errors.push(`Concept job ${job.id} is missing concepts.json`);
        } else if (!classificationsRecord) {
          errors.push(`Concept job ${job.id} is missing the classifications it should consolidate`);
        } else {
          const classifiedExcerptIds = new Set(classificationsRecord.classifications.map((item) => item.sourceExcerptId));
          const seenExcerptIds = new Set();
          const seenClassificationIds = new Set();
          conceptRecordCount += conceptsRecord.concepts.length;

          if (conceptsRecord.sourceSlug !== job.sourceSlug) {
            errors.push(`Concepts for ${job.id} reference the wrong source slug`);
          }
          if (job.artifacts?.conceptCount !== conceptsRecord.conceptCount) {
            errors.push(`Concepts for ${job.id} do not match the recorded concept count`);
          }
          if (conceptsRecord.conceptCount !== conceptsRecord.concepts.length) {
            errors.push(`Concepts for ${job.id} has a mismatched conceptCount`);
          }

          for (const record of conceptsRecord.concepts) {
            conceptById.set(record.id, record);
            if (record.sourceSlug !== job.sourceSlug) {
              errors.push(`Concept ${record.id} references the wrong source slug`);
            }
            if (!sourceIds.has(record.sourceId)) {
              errors.push(`Concept ${record.id} references unknown source ${record.sourceId}`);
            }
            if (!galaxyIds.has(record.galaxyId)) {
              errors.push(`Concept ${record.id} references unknown galaxy ${record.galaxyId}`);
            }
            if (!planetIds.has(record.planetId)) {
              errors.push(`Concept ${record.id} references unknown planet ${record.planetId}`);
            }
            if (!starIds.has(record.starId)) {
              errors.push(`Concept ${record.id} references unknown star ${record.starId}`);
            }
            const conceptPlanet = planetsById.get(record.planetId);
            const conceptStar = starsById.get(record.starId);
            if (conceptPlanet && conceptPlanet.galaxyId !== record.galaxyId) {
              errors.push(`Concept ${record.id} uses planet ${record.planetId} outside galaxy ${record.galaxyId}`);
            }
            if (conceptStar) {
              if (conceptStar.galaxyId !== record.galaxyId) {
                errors.push(`Concept ${record.id} uses star ${record.starId} outside galaxy ${record.galaxyId}`);
              }
              if (conceptStar.parentPlanetId !== record.planetId) {
                errors.push(`Concept ${record.id} uses star ${record.starId} outside planet ${record.planetId}`);
              }
            }
            if (!['approved', 'needs-review'].includes(record.reviewStatus)) {
              errors.push(`Concept ${record.id} has an invalid review status ${record.reviewStatus}`);
            }
            if (typeof record.confidence !== 'number' || record.confidence < 0 || record.confidence > 1) {
              errors.push(`Concept ${record.id} has an invalid confidence value`);
            }
            if ((record.sourceClassificationIds ?? []).length !== record.sourceExcerptIds.length) {
              errors.push(`Concept ${record.id} does not keep a 1:1 excerpt/classification provenance chain`);
            }
            for (const sourceExcerptId of record.sourceExcerptIds) {
              if (seenExcerptIds.has(sourceExcerptId)) {
                errors.push(`Concept ${record.id} duplicates excerpt ${sourceExcerptId}`);
              }
              if (!excerptById.has(sourceExcerptId)) {
                errors.push(`Concept ${record.id} references unknown extracted excerpt ${sourceExcerptId}`);
              }
              if (!classifiedExcerptIds.has(sourceExcerptId)) {
                errors.push(`Concept ${record.id} references unknown excerpt ${sourceExcerptId}`);
              }
              seenExcerptIds.add(sourceExcerptId);
            }
            for (const sourceClassificationId of record.sourceClassificationIds ?? []) {
              const classificationRecord = classificationById.get(sourceClassificationId);
              if (!classificationRecord) {
                errors.push(`Concept ${record.id} references unknown classification ${sourceClassificationId}`);
              } else if (classificationRecord.sourceSlug !== job.sourceSlug) {
                errors.push(`Concept ${record.id} references classification ${sourceClassificationId} from the wrong source`);
              } else if (!record.sourceExcerptIds.includes(classificationRecord.sourceExcerptId)) {
                errors.push(`Concept ${record.id} does not align classification ${sourceClassificationId} with its excerpt`);
              }
              if (seenClassificationIds.has(sourceClassificationId)) {
                errors.push(`Concept ${record.id} duplicates classification ${sourceClassificationId}`);
              }
              seenClassificationIds.add(sourceClassificationId);
            }
            if (record.reviewStatus === 'needs-review') {
              conceptNeedsReviewCount += 1;
            }
          }

          if (seenExcerptIds.size !== classifiedExcerptIds.size) {
            errors.push(`Concept job ${job.id} does not cover every classified excerpt`);
          }
        }
      }
    }
  }

  if (formatIndex) {
    const formatJobs = Array.isArray(formatIndex.jobs) ? formatIndex.jobs : [];
    const seenFormatBundleIds = new Set();

    for (const job of formatJobs) {
      if (!sourceIds.has(job.sourceId)) {
        errors.push(`Format job ${job.id} references unknown source ${job.sourceId}`);
      }
      if (job.status === 'generated') {
        formatJobCount += 1;
        if (!supportedFormatTypes.has(job.formatType)) {
          errors.push(`Format job ${job.id} references unknown format type ${job.formatType}`);
        }
        const artifactDir = path.join('formatos', job.formatType, job.sourceSlug);
        const jobRecord = readJsonIfExists(path.join(artifactDir, 'format-job.json'));
        const bundlesRecord = readJsonIfExists(path.join(artifactDir, 'bundles.json'));
        const conceptsRecord = readJsonIfExists(path.join('conceitos', job.sourceSlug, 'concepts.json'));
        const excerptsRecord = readJsonIfExists(path.join('extrações', job.sourceSlug, 'excerpts.json'));

        if (!jobRecord) {
          errors.push(`Format job ${job.id} is missing its job record`);
        } else if (jobRecord.status !== 'generated') {
          errors.push(`Format job ${job.id} record is not marked generated`);
        } else if (job.artifacts) {
          if (jobRecord.artifacts?.bundleCount !== job.artifacts.bundleCount) {
            errors.push(`Format job ${job.id} bundle count does not match its record`);
          }
          if (jobRecord.artifacts?.needsReviewCount !== job.artifacts.needsReviewCount) {
            errors.push(`Format job ${job.id} review count does not match its record`);
          }
        }

        if (!bundlesRecord) {
          errors.push(`Format job ${job.id} is missing bundles.json`);
        } else if (!conceptsRecord) {
          errors.push(`Format job ${job.id} is missing the concepts it should convert`);
        } else if (!excerptsRecord) {
          errors.push(`Format job ${job.id} is missing the excerpts it should trace back to`);
        } else {
          const conceptRecordsById = new Map(conceptsRecord.concepts.map((item) => [item.id, item]));
          const excerptRecordsById = new Map(excerptsRecord.excerpts.map((item) => [item.id, item]));

          if (bundlesRecord.sourceSlug !== job.sourceSlug) {
            errors.push(`Bundles for ${job.id} reference the wrong source slug`);
          }
          if (bundlesRecord.sourceId !== job.sourceId) {
            errors.push(`Bundles for ${job.id} reference the wrong source id`);
          }
          if (bundlesRecord.formatType !== job.formatType) {
            errors.push(`Bundles for ${job.id} reference the wrong format type`);
          }
          if (job.artifacts?.bundleCount !== bundlesRecord.bundleCount) {
            errors.push(`Bundles for ${job.id} do not match the recorded bundle count`);
          }
          if (bundlesRecord.bundleCount !== bundlesRecord.bundles.length) {
            errors.push(`Bundles for ${job.id} has a mismatched bundleCount`);
          }
          if (bundlesRecord.needsReviewCount !== bundlesRecord.bundles.filter((bundle) => bundle.reviewStatus === 'needs-review').length) {
            errors.push(`Bundles for ${job.id} has a mismatched needsReviewCount`);
          }

          const seenConceptIds = new Set();
          for (const bundle of bundlesRecord.bundles) {
            const conceptId = bundle.conceptIds?.[0];
            const concept = conceptId ? conceptRecordsById.get(conceptId) : null;
            const payload = bundle.payload ?? {};

            formatBundleCount += 1;
            seenFormatBundleIds.add(bundle.id);

            if (bundle.sourceId !== job.sourceId) {
              errors.push(`Format bundle ${bundle.id} references the wrong source id`);
            }
            if (bundle.sourceSlug !== job.sourceSlug) {
              errors.push(`Format bundle ${bundle.id} references the wrong source slug`);
            }
            if (bundle.formatType !== job.formatType) {
              errors.push(`Format bundle ${bundle.id} references the wrong format type`);
            }
            if (!['approved', 'needs-review'].includes(bundle.reviewStatus)) {
              errors.push(`Format bundle ${bundle.id} has an invalid review status ${bundle.reviewStatus}`);
            }
            if (!conceptId) {
              errors.push(`Format bundle ${bundle.id} is missing a concept reference`);
            } else if (!concept) {
              errors.push(`Format bundle ${bundle.id} references unknown concept ${conceptId}`);
            } else {
              if (seenConceptIds.has(conceptId)) {
                errors.push(`Format bundle ${bundle.id} duplicates concept ${conceptId}`);
              }
              seenConceptIds.add(conceptId);

              if (bundle.conceptIds.length !== 1) {
                errors.push(`Format bundle ${bundle.id} should reference exactly one concept`);
              }
              if (payload.conceptId !== conceptId) {
                errors.push(`Format bundle ${bundle.id} payload conceptId does not match its bundle concept`);
              }
              if (payload.conceptTitle !== concept.title) {
                errors.push(`Format bundle ${bundle.id} payload conceptTitle does not match concept ${conceptId}`);
              }
              if (JSON.stringify(bundle.sourceExcerptIds) !== JSON.stringify(concept.sourceExcerptIds)) {
                errors.push(`Format bundle ${bundle.id} does not preserve the concept excerpt provenance`);
              }
              for (const sourceExcerptId of bundle.sourceExcerptIds) {
                if (!excerptRecordsById.has(sourceExcerptId)) {
                  errors.push(`Format bundle ${bundle.id} references unknown excerpt ${sourceExcerptId}`);
                }
              }
            }

            if (bundle.reviewStatus === 'needs-review') {
              formatNeedsReviewCount += 1;
            }

            if (bundle.formatType === 'microlições') {
              if (!Array.isArray(payload.blocks) || payload.blocks.length !== 4) {
                errors.push(`Format bundle ${bundle.id} micro-lesson payload must have four blocks`);
              } else if (JSON.stringify(payload.blocks.map((block) => block.type)) !== JSON.stringify(expectedBlockTypes[bundle.formatType])) {
                errors.push(`Format bundle ${bundle.id} micro-lesson payload has an unexpected block structure`);
              }
            } else if (bundle.formatType === 'reviews') {
              if (typeof payload.reviewPrompt !== 'string' || payload.reviewPrompt.length === 0) {
                errors.push(`Format bundle ${bundle.id} review payload is missing a review prompt`);
              }
              if (!Array.isArray(payload.keySignals) || payload.keySignals.length === 0) {
                errors.push(`Format bundle ${bundle.id} review payload is missing key signals`);
              }
              if (!Array.isArray(payload.blocks) || payload.blocks.length !== 4) {
                errors.push(`Format bundle ${bundle.id} review payload must have four blocks`);
              } else if (JSON.stringify(payload.blocks.map((block) => block.type)) !== JSON.stringify(expectedBlockTypes[bundle.formatType])) {
                errors.push(`Format bundle ${bundle.id} review payload has an unexpected block structure`);
              }
            } else if (bundle.formatType === 'casos') {
              if (typeof payload.casePrompt !== 'string' || payload.casePrompt.length === 0) {
                errors.push(`Format bundle ${bundle.id} case payload is missing a case prompt`);
              }
              if (!Array.isArray(payload.keySignals) || payload.keySignals.length === 0) {
                errors.push(`Format bundle ${bundle.id} case payload is missing key signals`);
              }
              if (typeof payload.blocks?.[1]?.text !== 'string') {
                errors.push(`Format bundle ${bundle.id} case payload is missing the question block`);
              }
              if (!Array.isArray(payload.blocks) || payload.blocks.length !== 4) {
                errors.push(`Format bundle ${bundle.id} case payload must have four blocks`);
              } else if (JSON.stringify(payload.blocks.map((block) => block.type)) !== JSON.stringify(expectedBlockTypes[bundle.formatType])) {
                errors.push(`Format bundle ${bundle.id} case payload has an unexpected block structure`);
              }
            } else if (bundle.formatType === 'checkpoints') {
              if (typeof payload.checkpointPrompt !== 'string' || payload.checkpointPrompt.length === 0) {
                errors.push(`Format bundle ${bundle.id} checkpoint payload is missing a prompt`);
              }
              if (!Array.isArray(payload.completionCriteria) || payload.completionCriteria.length === 0) {
                errors.push(`Format bundle ${bundle.id} checkpoint payload is missing completion criteria`);
              }
              if (!Array.isArray(payload.keySignals) || payload.keySignals.length === 0) {
                errors.push(`Format bundle ${bundle.id} checkpoint payload is missing key signals`);
              }
              if (!Array.isArray(payload.blocks) || payload.blocks.length !== 4) {
                errors.push(`Format bundle ${bundle.id} checkpoint payload must have four blocks`);
              } else if (JSON.stringify(payload.blocks.map((block) => block.type)) !== JSON.stringify(expectedBlockTypes[bundle.formatType])) {
                errors.push(`Format bundle ${bundle.id} checkpoint payload has an unexpected block structure`);
              }
            } else if (bundle.formatType === 'rewards') {
              if (typeof payload.rewardLabel !== 'string' || payload.rewardLabel.length === 0) {
                errors.push(`Format bundle ${bundle.id} reward payload is missing a label`);
              }
              if (typeof payload.motivation !== 'string' || payload.motivation.length === 0) {
                errors.push(`Format bundle ${bundle.id} reward payload is missing motivation`);
              }
              if (typeof payload.nextStep !== 'string' || payload.nextStep.length === 0) {
                errors.push(`Format bundle ${bundle.id} reward payload is missing the next step`);
              }
              if (!Array.isArray(payload.blocks) || payload.blocks.length !== 4) {
                errors.push(`Format bundle ${bundle.id} reward payload must have four blocks`);
              } else if (JSON.stringify(payload.blocks.map((block) => block.type)) !== JSON.stringify(expectedBlockTypes[bundle.formatType])) {
                errors.push(`Format bundle ${bundle.id} reward payload has an unexpected block structure`);
              }
            } else if (bundle.formatType === 'quizzes') {
              if (!Array.isArray(payload.questions) || payload.questions.length !== 2) {
                errors.push(`Format bundle ${bundle.id} quiz payload must have two questions`);
              } else {
                for (const question of payload.questions) {
                  if (question.type !== 'multiple-choice') {
                    errors.push(`Format bundle ${bundle.id} has an unsupported question type`);
                  }
                  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
                    errors.push(`Format bundle ${bundle.id} has a quiz question without four choices`);
                  }
                  const choiceIds = new Set((question.choices ?? []).map((choice) => choice.id));
                  if (!choiceIds.has(question.correctChoiceId)) {
                    errors.push(`Format bundle ${bundle.id} has a quiz question with an invalid correctChoiceId`);
                  }
                }
              }
            }
          }

          if (seenConceptIds.size !== conceptsRecord.concepts.length) {
            errors.push(`Format job ${job.id} does not cover every normalized concept`);
          }
        }
      }
    }

    if (formatIndex.version !== 1) {
      errors.push('Format index has an unexpected version');
    }
    if (formatJobs.length !== 6) {
      errors.push('Format index should expose exactly six generated jobs for the pilot');
    }
    if (seenFormatBundleIds.size !== 96) {
      errors.push('Format index does not cover the expected bundle set for the pilot');
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
      sourceExtractionStatuses: sourceIndex.sources.map((item) => item.extractionStatus),
      sourceClassificationStatuses: sourceIndex.sources.map((item) => item.classificationStatus),
      sourceConceptStatuses: sourceIndex.sources.map((item) => item.conceptStatus),
      sourceFormatStatuses: sourceIndex.sources.map((item) => item.formatStatus),
      extractionStatuses,
      extractedJobCount,
      extractedPageCount,
      extractedExcerptCount,
      classificationJobCount: classificationIndex.jobs.length,
      classificationStatuses,
      classifiedJobCount,
      classificationRecordCount,
      needsReviewCount,
      conceptJobCount,
      conceptStatuses,
      conceptRecordCount,
      conceptNeedsReviewCount,
      formatJobCount,
      formatBundleCount,
      formatNeedsReviewCount,
      formatStatuses,
      formatTypes: formatIndex ? formatIndex.jobs.map((job) => job.formatType) : [],
      classificationSourceSlugs: classificationIndex.jobs.map((job) => job.sourceSlug),
      galaxyCount: galaxias.length,
      planetCount: planetas.length,
      starCount: estrelas.length,
      galaxyIds: galaxias.map((item) => item.id),
      wave1PriorityTrackIds: wave1PriorityTracks?.tracks?.map((track) => track.id) ?? [],
      libraryPdfFileCount: libraryCatalog?.summary?.pdfFileCount ?? 0,
      uniqueSourceCount: libraryCatalog?.summary?.uniqueSourceCount ?? 0,
      duplicateFileCount: libraryCatalog?.summary?.duplicateFileCount ?? 0,
      mediaManifestStatus: mediaSummary.status,
      mediaItemCount: mediaSummary.itemCount,
      verifiedMediaAnonymizationCount: mediaSummary.verifiedAnonymizationCount,
      rejectedMediaCandidateCount: mediaSummary.rejectedCandidateCount,
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
