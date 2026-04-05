# Content Pipeline

## Goal

Keep lesson content versioned, reviewable, and safe to ship incrementally.

## Editorial Foundation

- The repository root `conteúdo/` is now the canonical editorial workspace for raw sources, extracted excerpts, taxonomy, concepts, generated formats, and governance contracts.
- `scripts/content/validate-foundation.mjs` is the zero-dependency integrity check for the editorial foundation.
- Future ingestion and generation steps must extend this foundation instead of bypassing it with ad-hoc lesson files.

## Current Editorial State

As of 2026-04-05, the first real source completes the full editorial-to-app flow:

- source: `Fundamentos de Radiologia` (`source:fundamentos-de-radiologia-everton-costa-pinto`)
- source status: `extracted -> classified -> normalized -> generated -> approved -> promoted -> synced`
- extracted artifacts: `75` pages and `109` excerpts
- classified artifacts: `109` records, `30` marked `needs-review`
- concept artifacts: `16` canonical concepts, `7` marked `needs-review`
- generated format types: `microlições`, `quizzes`, `reviews`, `casos`, `checkpoints`, `rewards`
- generated bundles: `96` total — all approved
- `conteúdo/governança/catalog-payload.json` v1.0.0 promoted
- `16` AI quiz lessons active in the app (`radiant-app/src/data/ai-lessons.ts`)

## Editorial Flow

1. Register a source in `conteúdo/fontes/`.
2. Extract machine-readable pages and excerpts into `conteúdo/extrações/`.
3. Classify every excerpt against `galáxia -> planeta -> estrela`.
4. Normalize classified excerpts into canonical concepts.
5. Generate pedagogical bundles from concepts into `conteúdo/formatos/**/ai-bundles.json`.
6. Review and approve bundles via the editorial panel (`tools/editorial-panel/`, port 3001).
7. Promote approved bundles: `node scripts/content/promote-to-catalog.mjs`
8. Sync catalog to app: `node scripts/content/sync-catalog-to-app.mjs`
9. Validate the editorial chain: `node scripts/content/validate-foundation.mjs`

Every generated artifact must preserve provenance back to `conceptIds` and `sourceExcerptIds`.

## Tools

| Script | Purpose |
|---|---|
| `scripts/content/validate-foundation.mjs` | Integrity check for the editorial foundation |
| `scripts/content/promote-to-catalog.mjs` | Collects approved bundles → `catalog-payload.json` |
| `scripts/content/sync-catalog-to-app.mjs` | Converts `catalog-payload.json` → `ai-lessons.ts` + `ai-catalog.ts` |
| `scripts/content/generate-local-bundles.py` | Generates `ai-bundles.json` for all 16 concepts × 6 formats |
| `tools/editorial-panel/` | Next.js web UI for bundle review, graph validation, and promotion |

## Source of Truth

- `conteúdo/governança/catalog-payload.json` is the promoted editorial catalog (versioned, format-grouped).
- `radiant-app/src/data/ai-lessons.ts` and `ai-catalog.ts` are auto-generated from it — do not edit by hand.
- `radiant-app/src/data/lessons.ts` and `catalog.ts` remain the seed content and manifest that merge both.
- `LessonCatalogService` is the runtime facade used by screens and lesson flows.
- `RemoteCatalogService` is the runtime path for server-driven catalog refreshes when the flag is enabled.

## Runtime Flow

1. The app boots with the local catalog (AI lessons + seed lessons merged in `catalog.ts`).
2. If remote content is enabled, the app attempts a non-blocking refresh against `/v1/content/catalog`.
3. If the remote payload is invalid or unavailable, the app falls back to local content.
4. Screens continue reading through `LessonCatalogService` regardless of source.

## Relationship Between Editorial And Runtime Catalogs

- `conteúdo/` is the canonical editorial build pipeline.
- `radiant-app/src/data/ai-*.ts` are the generated runtime artifacts from the editorial pipeline.
- `radiant-app/src/data/lessons.ts` and `catalog.ts` are the hand-authored seed layer.
- `/v1/content/catalog` is the remote runtime manifest path exposed by the API.
- Runtime promotion from `conteúdo/` into app/API catalogs should happen only after editorial validation and intentional QA.

## Publishing Rules

- Never replace local content with an invalid remote payload.
- Every catalog update should preserve a stable `version`.
- The initial lesson must always resolve to an existing lesson id.
- If a lesson ships custom Learning Road copy, include it under `payload.journey`.
- Remote content should be treated as additive until QA confirms the published set is intentional.
- Editorial changes should be considered publishable only when `scripts/content/validate-foundation.mjs` returns `ok: true`.
- After any bundle approval cycle, run `sync-catalog-to-app.mjs` before committing to keep `ai-lessons.ts` in sync.
