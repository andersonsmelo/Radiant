# Painel Editorial Web e Script de Promoção — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um painel web local (Next.js, `localhost:3001`) para revisar dependências do grafo e bundles pedagógicos, e um script de promoção que publica o conteúdo aprovado no catálogo da API.

**Architecture:** Aplicação Next.js mínima em `tools/editorial-panel/` sem banco de dados — lê e escreve diretamente nos arquivos JSON de `conteúdo/` via API routes. O script `scripts/content/promote-to-catalog.mjs` lê bundles aprovados, ordena por `learning-sequence.json` e gera o payload de catálogo. A promoção é disparada pelo painel, mas pode ser executada standalone.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Node.js 20+.

> Este é o **Plano 3 de 3**. Requer os artefatos dos Planos 1 e 2 (`concept-graph.json`, `learning-sequence.json`, `ai-bundles.json`).

---

## Mapa de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `tools/editorial-panel/package.json` | Criar | Dependências do painel |
| `tools/editorial-panel/next.config.ts` | Criar | Config Next.js |
| `tools/editorial-panel/tailwind.config.ts` | Criar | Config Tailwind |
| `tools/editorial-panel/app/layout.tsx` | Criar | Layout root com nav |
| `tools/editorial-panel/app/page.tsx` | Criar | Status overview |
| `tools/editorial-panel/app/bundles/page.tsx` | Criar | Lista de bundles para revisão |
| `tools/editorial-panel/app/graph/page.tsx` | Criar | Arestas do grafo para validação |
| `tools/editorial-panel/app/promote/page.tsx` | Criar | Painel de promoção |
| `tools/editorial-panel/app/api/status/route.ts` | Criar | GET contagens por status |
| `tools/editorial-panel/app/api/bundles/route.ts` | Criar | GET lista de bundles |
| `tools/editorial-panel/app/api/bundles/[id]/route.ts` | Criar | PATCH approve/reject bundle |
| `tools/editorial-panel/app/api/graph/route.ts` | Criar | GET arestas pending-review |
| `tools/editorial-panel/app/api/graph/[edgeKey]/route.ts` | Criar | PATCH approve/reject aresta |
| `tools/editorial-panel/app/api/promote/route.ts` | Criar | POST disparar promoção |
| `tools/editorial-panel/lib/content-io.ts` | Criar | Leitura/escrita dos JSONs de conteúdo |
| `scripts/content/promote-to-catalog.mjs` | Criar | Script standalone de promoção |
| `scripts/content/promote-to-catalog.test.mjs` | Criar | Testes do script de promoção |

---

### Task 1: Script de promoção (`promote-to-catalog.mjs`)

Este task tem o maior valor isolado — pode ser executado sem o painel.

**Files:**
- Create: `scripts/content/promote-to-catalog.mjs`
- Create: `scripts/content/promote-to-catalog.test.mjs`

- [ ] **Step 1.1: Escrever o teste primeiro**

Criar `scripts/content/promote-to-catalog.test.mjs`:

```javascript
import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

// Dynamic import to pick up the module under test
const { buildCatalogPayload, collectApprovedBundles, sortBySequence } =
  await import("./promote-to-catalog.mjs");

describe("sortBySequence", () => {
  it("orders concepts matching sequence order", () => {
    const sequenceIds = ["concept:B", "concept:A", "concept:C"];
    const bundles = [
      { conceptIds: ["concept:A"] },
      { conceptIds: ["concept:B"] },
      { conceptIds: ["concept:C"] },
    ];
    const sorted = sortBySequence(bundles, sequenceIds);
    assert.equal(sorted[0].conceptIds[0], "concept:B");
    assert.equal(sorted[1].conceptIds[0], "concept:A");
    assert.equal(sorted[2].conceptIds[0], "concept:C");
  });

  it("appends bundles not in sequence at the end", () => {
    const sequenceIds = ["concept:A"];
    const bundles = [
      { conceptIds: ["concept:B"] },
      { conceptIds: ["concept:A"] },
    ];
    const sorted = sortBySequence(bundles, sequenceIds);
    assert.equal(sorted[0].conceptIds[0], "concept:A");
    assert.equal(sorted[1].conceptIds[0], "concept:B");
  });
});

describe("buildCatalogPayload", () => {
  it("includes version and generatedAt", () => {
    const bundles = [];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.ok(result.version);
    assert.ok(result.generatedAt);
  });

  it("sets version from argument", () => {
    const result = buildCatalogPayload([], "2.1.0");
    assert.equal(result.version, "2.1.0");
  });

  it("groups bundles by formatType", () => {
    const bundles = [
      { id: "b1", formatType: "microlições", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b2", formatType: "quizzes", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b3", formatType: "microlições", conceptIds: ["c2"], reviewStatus: "approved" },
    ];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.equal(result.tracks["microlições"].length, 2);
    assert.equal(result.tracks["quizzes"].length, 1);
  });

  it("excludes bundles that are not approved", () => {
    const bundles = [
      { id: "b1", formatType: "microlições", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b2", formatType: "microlições", conceptIds: ["c2"], reviewStatus: "needs-review" },
    ];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.equal(result.tracks["microlições"].length, 1);
  });
});

describe("collectApprovedBundles", () => {
  it("returns empty array when no ai-bundles files exist", async () => {
    const { mkdtemp, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const tmpDir = await mkdtemp(`${tmpdir()}/radiant-test-`);
    const result = await collectApprovedBundles(tmpDir);
    assert.deepEqual(result, []);
    await rm(tmpDir, { recursive: true });
  });

  it("returns only approved bundles", async () => {
    const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");

    const tmpDir = await mkdtemp(`${tmpdir()}/radiant-test-`);
    const dir = join(tmpDir, "microlições", "test-source");
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "ai-bundles.json"),
      JSON.stringify({
        version: 1,
        bundles: [
          { id: "b1", reviewStatus: "approved", formatType: "microlições" },
          { id: "b2", reviewStatus: "needs-review", formatType: "microlições" },
        ],
      })
    );

    const result = await collectApprovedBundles(tmpDir);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, "b1");

    await rm(tmpDir, { recursive: true });
  });
});
```

- [ ] **Step 1.2: Rodar e confirmar que falha**

```bash
node --test scripts/content/promote-to-catalog.test.mjs
```

Expected: FAIL — `promote-to-catalog.mjs` not found.

- [ ] **Step 1.3: Implementar `promote-to-catalog.mjs`**

Criar `scripts/content/promote-to-catalog.mjs`:

```javascript
import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const CONTENT_ROOT = join(REPO_ROOT, "conteúdo");
const FORMATS_ROOT = join(CONTENT_ROOT, "formatos");
const SEQUENCE_PATH = join(CONTENT_ROOT, "governança", "learning-sequence.json");
const OUTPUT_PATH = join(CONTENT_ROOT, "governança", "catalog-payload.json");

export async function collectApprovedBundles(formatsRoot = FORMATS_ROOT) {
  const approved = [];

  let formatTypes;
  try {
    formatTypes = await readdir(formatsRoot);
  } catch {
    return approved;
  }

  for (const formatType of formatTypes) {
    let sources;
    try {
      sources = await readdir(join(formatsRoot, formatType));
    } catch {
      continue;
    }

    for (const sourceSlug of sources) {
      const aiBundlesPath = join(formatsRoot, formatType, sourceSlug, "ai-bundles.json");
      if (!existsSync(aiBundlesPath)) continue;

      const data = JSON.parse(await readFile(aiBundlesPath, "utf-8"));
      for (const bundle of data.bundles ?? []) {
        if (bundle.reviewStatus === "approved") {
          approved.push(bundle);
        }
      }
    }
  }

  return approved;
}

export function sortBySequence(bundles, sequenceIds) {
  const indexMap = new Map(sequenceIds.map((id, i) => [id, i]));

  return [...bundles].sort((a, b) => {
    const aId = a.conceptIds?.[0] ?? "";
    const bId = b.conceptIds?.[0] ?? "";
    const aIdx = indexMap.has(aId) ? indexMap.get(aId) : Infinity;
    const bIdx = indexMap.has(bId) ? indexMap.get(bId) : Infinity;
    return aIdx - bIdx;
  });
}

export function buildCatalogPayload(bundles, version) {
  const approved = bundles.filter((b) => b.reviewStatus === "approved");
  const tracks = {};

  for (const bundle of approved) {
    const type = bundle.formatType;
    if (!tracks[type]) tracks[type] = [];
    tracks[type].push(bundle);
  }

  return {
    version,
    generatedAt: new Date().toISOString(),
    tracks,
  };
}

async function loadSequenceIds() {
  if (!existsSync(SEQUENCE_PATH)) return [];
  const data = JSON.parse(await readFile(SEQUENCE_PATH, "utf-8"));
  return (data.sequences ?? []).flatMap((s) => s.sequence ?? []);
}

async function bumpVersion(outputPath) {
  if (!existsSync(outputPath)) return "1.0.0";
  try {
    const existing = JSON.parse(await readFile(outputPath, "utf-8"));
    const [major, minor, patch] = (existing.version ?? "1.0.0").split(".").map(Number);
    return `${major}.${minor}.${patch + 1}`;
  } catch {
    return "1.0.0";
  }
}

async function run() {
  const bundles = await collectApprovedBundles();
  const sequenceIds = await loadSequenceIds();
  const sorted = sortBySequence(bundles, sequenceIds);
  const version = await bumpVersion(OUTPUT_PATH);
  const payload = buildCatalogPayload(sorted, version);

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf-8");

  const total = Object.values(payload.tracks).reduce((sum, arr) => sum + arr.length, 0);
  const types = Object.keys(payload.tracks).join(", ");
  console.log(`Promoted ${total} bundles (${types}) → version ${version}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

// Run when invoked directly
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) run().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 1.4: Rodar e confirmar que passa**

```bash
node --test scripts/content/promote-to-catalog.test.mjs
```

Expected: PASS — all tests passing.

- [ ] **Step 1.5: Testar execução real**

```bash
node scripts/content/promote-to-catalog.mjs
```

Expected output example (após Plano 2 executado):
```
Promoted 96 bundles (microlições, quizzes, reviews, casos, checkpoints, rewards) → version 1.0.0
Output: /path/to/conteúdo/governança/catalog-payload.json
```

Verificar o payload gerado:

```bash
node -e "
const p = JSON.parse(require('fs').readFileSync('conteúdo/governança/catalog-payload.json'));
console.log('version:', p.version);
Object.entries(p.tracks).forEach(([t, b]) => console.log(' ', t, ':', b.length, 'bundles'));
"
```

- [ ] **Step 1.6: Commit**

```bash
git add scripts/content/promote-to-catalog.mjs scripts/content/promote-to-catalog.test.mjs
git commit -m "feat: add promote-to-catalog script with version bumping and sequence ordering"
```

---

### Task 2: Scaffolding do painel editorial

**Files:**
- Create: `tools/editorial-panel/package.json`
- Create: `tools/editorial-panel/next.config.ts`
- Create: `tools/editorial-panel/tailwind.config.ts`
- Create: `tools/editorial-panel/tsconfig.json`
- Create: `tools/editorial-panel/postcss.config.mjs`

- [ ] **Step 2.1: Criar `tools/editorial-panel/package.json`**

```json
{
  "name": "radiant-editorial-panel",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  },
  "dependencies": {
    "next": "15.3.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "22.0.0",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "autoprefixer": "10.4.21",
    "postcss": "8.5.3",
    "tailwindcss": "3.4.17",
    "typescript": "5.8.3"
  }
}
```

- [ ] **Step 2.2: Criar `tools/editorial-panel/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
};

export default nextConfig;
```

- [ ] **Step 2.3: Criar `tools/editorial-panel/tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2.4: Criar `tools/editorial-panel/tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

- [ ] **Step 2.5: Criar `tools/editorial-panel/postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 2.6: Instalar dependências e verificar**

```bash
cd tools/editorial-panel && npm install
```

Expected: `node_modules/` criado sem erros.

- [ ] **Step 2.7: Commit do scaffolding**

```bash
cd ../..
git add tools/editorial-panel/
git commit -m "chore: scaffold editorial panel Next.js app"
```

---

### Task 3: Camada de I/O com o sistema de arquivos (`content-io.ts`)

**Files:**
- Create: `tools/editorial-panel/lib/content-io.ts`

- [ ] **Step 3.1: Criar `tools/editorial-panel/lib/content-io.ts`**

```typescript
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "conteúdo");
const FORMATS_ROOT = path.join(CONTENT_ROOT, "formatos");
const GRAPH_PATH = path.join(CONTENT_ROOT, "governança", "concept-graph.json");

// ── Types ────────────────────────────────────────────────────────────────────

export interface GraphEdge {
  from: string;
  to: string;
  confidence: number;
  status: "auto-accepted" | "pending-review" | "human-validated" | "rejected";
  reason: string;
}

export interface AiBundle {
  id: string;
  formatType: string;
  title: string;
  reviewStatus: "pending" | "approved" | "needs-review";
  qualityScore: number | null;
  qualityBreakdown?: Record<string, number>;
  conceptIds: string[];
  aiContent: Record<string, unknown>;
}

export interface StatusCounts {
  bundles: { approved: number; needsReview: number; pending: number };
  edges: { autoAccepted: number; pendingReview: number; humanValidated: number; rejected: number };
}

// ── Graph I/O ────────────────────────────────────────────────────────────────

export function readGraph(): { nodes: unknown[]; edges: GraphEdge[] } {
  return JSON.parse(fs.readFileSync(GRAPH_PATH, "utf-8"));
}

export function writeGraph(graph: { nodes: unknown[]; edges: GraphEdge[] }): void {
  fs.writeFileSync(GRAPH_PATH, JSON.stringify(graph, null, 2), "utf-8");
}

export function getPendingEdges(): GraphEdge[] {
  const graph = readGraph();
  return graph.edges.filter((e) => e.status === "pending-review");
}

export function updateEdgeStatus(
  fromId: string,
  toId: string,
  status: GraphEdge["status"]
): void {
  const graph = readGraph();
  const edge = graph.edges.find((e) => e.from === fromId && e.to === toId);
  if (!edge) throw new Error(`Edge not found: ${fromId} → ${toId}`);
  edge.status = status;
  writeGraph(graph);
}

// ── Bundle I/O ────────────────────────────────────────────────────────────────

export function getAllAiBundles(): AiBundle[] {
  const bundles: AiBundle[] = [];
  if (!fs.existsSync(FORMATS_ROOT)) return bundles;

  for (const formatType of fs.readdirSync(FORMATS_ROOT)) {
    const formatDir = path.join(FORMATS_ROOT, formatType);
    if (!fs.statSync(formatDir).isDirectory()) continue;

    for (const sourceSlug of fs.readdirSync(formatDir)) {
      const aiBundlesPath = path.join(formatDir, sourceSlug, "ai-bundles.json");
      if (!fs.existsSync(aiBundlesPath)) continue;

      const data = JSON.parse(fs.readFileSync(aiBundlesPath, "utf-8"));
      bundles.push(...(data.bundles ?? []));
    }
  }
  return bundles;
}

export function updateBundleStatus(
  bundleId: string,
  status: AiBundle["reviewStatus"]
): void {
  if (!fs.existsSync(FORMATS_ROOT)) throw new Error("Formats root not found");

  for (const formatType of fs.readdirSync(FORMATS_ROOT)) {
    const formatDir = path.join(FORMATS_ROOT, formatType);
    if (!fs.statSync(formatDir).isDirectory()) continue;

    for (const sourceSlug of fs.readdirSync(formatDir)) {
      const aiBundlesPath = path.join(formatDir, sourceSlug, "ai-bundles.json");
      if (!fs.existsSync(aiBundlesPath)) continue;

      const data = JSON.parse(fs.readFileSync(aiBundlesPath, "utf-8"));
      const bundle = data.bundles?.find((b: AiBundle) => b.id === bundleId);
      if (bundle) {
        bundle.reviewStatus = status;
        fs.writeFileSync(aiBundlesPath, JSON.stringify(data, null, 2), "utf-8");
        return;
      }
    }
  }
  throw new Error(`Bundle not found: ${bundleId}`);
}

// ── Status counts ─────────────────────────────────────────────────────────────

export function getStatusCounts(): StatusCounts {
  const bundles = getAllAiBundles();
  const graph = readGraph();

  return {
    bundles: {
      approved: bundles.filter((b) => b.reviewStatus === "approved").length,
      needsReview: bundles.filter((b) => b.reviewStatus === "needs-review").length,
      pending: bundles.filter((b) => b.reviewStatus === "pending").length,
    },
    edges: {
      autoAccepted: graph.edges.filter((e) => e.status === "auto-accepted").length,
      pendingReview: graph.edges.filter((e) => e.status === "pending-review").length,
      humanValidated: graph.edges.filter((e) => e.status === "human-validated").length,
      rejected: graph.edges.filter((e) => e.status === "rejected").length,
    },
  };
}
```

- [ ] **Step 3.2: Verificar que TypeScript compila**

```bash
cd tools/editorial-panel && npx tsc --noEmit
```

Expected: sem erros. Se houver erros de tipo, corrigi-los antes de continuar.

- [ ] **Step 3.3: Commit**

```bash
cd ../..
git add tools/editorial-panel/lib/content-io.ts
git commit -m "feat: add content-io layer for reading and writing conteúdo/ JSON files"
```

---

### Task 4: API routes do painel

**Files:**
- Create: `tools/editorial-panel/app/api/status/route.ts`
- Create: `tools/editorial-panel/app/api/bundles/route.ts`
- Create: `tools/editorial-panel/app/api/bundles/[id]/route.ts`
- Create: `tools/editorial-panel/app/api/graph/route.ts`
- Create: `tools/editorial-panel/app/api/graph/[edgeKey]/route.ts`
- Create: `tools/editorial-panel/app/api/promote/route.ts`

- [ ] **Step 4.1: Criar `app/api/status/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getStatusCounts } from "@/lib/content-io";

export async function GET() {
  const counts = getStatusCounts();
  return NextResponse.json(counts);
}
```

- [ ] **Step 4.2: Criar `app/api/bundles/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAllAiBundles } from "@/lib/content-io";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const formatType = searchParams.get("formatType");

  let bundles = getAllAiBundles();
  if (status) bundles = bundles.filter((b) => b.reviewStatus === status);
  if (formatType) bundles = bundles.filter((b) => b.formatType === formatType);

  return NextResponse.json({ bundles, total: bundles.length });
}
```

- [ ] **Step 4.3: Criar `app/api/bundles/[id]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { updateBundleStatus } from "@/lib/content-io";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bundleId = decodeURIComponent(id);
  const body = await request.json();
  const { reviewStatus } = body as { reviewStatus: "approved" | "needs-review" };

  if (!["approved", "needs-review"].includes(reviewStatus)) {
    return NextResponse.json({ error: "Invalid reviewStatus" }, { status: 400 });
  }

  try {
    updateBundleStatus(bundleId, reviewStatus);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 });
  }
}
```

- [ ] **Step 4.4: Criar `app/api/graph/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getPendingEdges } from "@/lib/content-io";

export async function GET() {
  const edges = getPendingEdges();
  return NextResponse.json({ edges, total: edges.length });
}
```

- [ ] **Step 4.5: Criar `app/api/graph/[edgeKey]/route.ts`**

`edgeKey` é `<fromId>|<toId>` com `|` como separador (URL-encoded).

```typescript
import { NextRequest, NextResponse } from "next/server";
import { updateEdgeStatus } from "@/lib/content-io";
import type { GraphEdge } from "@/lib/content-io";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ edgeKey: string }> }
) {
  const { edgeKey } = await params;
  const decoded = decodeURIComponent(edgeKey);
  const [fromId, toId] = decoded.split("|");

  if (!fromId || !toId) {
    return NextResponse.json({ error: "Invalid edgeKey format. Use fromId|toId" }, { status: 400 });
  }

  const body = await request.json();
  const { status } = body as { status: GraphEdge["status"] };
  const validStatuses: GraphEdge["status"][] = ["human-validated", "rejected"];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "status must be human-validated or rejected" }, { status: 400 });
  }

  try {
    updateEdgeStatus(fromId, toId, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 });
  }
}
```

- [ ] **Step 4.6: Criar `app/api/promote/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

export async function POST() {
  const scriptPath = path.resolve(
    process.cwd(),
    "..",
    "..",
    "scripts",
    "content",
    "promote-to-catalog.mjs"
  );

  try {
    const { stdout, stderr } = await execFileAsync("node", [scriptPath]);
    return NextResponse.json({ ok: true, output: stdout + stderr });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
```

- [ ] **Step 4.7: Verificar compilação**

```bash
cd tools/editorial-panel && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 4.8: Commit das API routes**

```bash
cd ../..
git add tools/editorial-panel/app/api/
git commit -m "feat: add editorial panel API routes for bundles, graph and promotion"
```

---

### Task 5: Páginas do painel

**Files:**
- Create: `tools/editorial-panel/app/globals.css`
- Create: `tools/editorial-panel/app/layout.tsx`
- Create: `tools/editorial-panel/app/page.tsx`
- Create: `tools/editorial-panel/app/bundles/page.tsx`
- Create: `tools/editorial-panel/app/graph/page.tsx`
- Create: `tools/editorial-panel/app/promote/page.tsx`

- [ ] **Step 5.1: Criar `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5.2: Criar `app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Radiant Editorial",
  description: "Painel editorial do Radiant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-mono">
        <nav className="border-b border-gray-800 px-6 py-3 flex gap-6 text-sm">
          <a href="/" className="text-indigo-400 hover:text-indigo-300">Status</a>
          <a href="/bundles" className="text-indigo-400 hover:text-indigo-300">Bundles</a>
          <a href="/graph" className="text-indigo-400 hover:text-indigo-300">Grafo</a>
          <a href="/promote" className="text-indigo-400 hover:text-indigo-300">Promover</a>
        </nav>
        <main className="px-6 py-6 max-w-5xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 5.3: Criar `app/page.tsx` (status overview)**

```typescript
import { getStatusCounts } from "@/lib/content-io";

export default function StatusPage() {
  const counts = getStatusCounts();

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Status Editorial</h1>
      <div className="grid grid-cols-2 gap-4">
        <section className="border border-gray-800 rounded p-4">
          <h2 className="text-sm text-gray-400 mb-3">Bundles Pedagógicos</h2>
          <Stat label="Aprovados" value={counts.bundles.approved} color="text-green-400" />
          <Stat label="Needs review" value={counts.bundles.needsReview} color="text-yellow-400" />
          <Stat label="Pendentes" value={counts.bundles.pending} color="text-gray-400" />
        </section>
        <section className="border border-gray-800 rounded p-4">
          <h2 className="text-sm text-gray-400 mb-3">Arestas do Grafo</h2>
          <Stat label="Auto-aceitas" value={counts.edges.autoAccepted} color="text-green-400" />
          <Stat label="Pendentes revisão" value={counts.edges.pendingReview} color="text-yellow-400" />
          <Stat label="Validadas" value={counts.edges.humanValidated} color="text-blue-400" />
          <Stat label="Rejeitadas" value={counts.edges.rejected} color="text-red-400" />
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-300 text-sm">{label}</span>
      <span className={`${color} font-bold text-sm`}>{value}</span>
    </div>
  );
}
```

- [ ] **Step 5.4: Criar `app/bundles/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";

interface Bundle {
  id: string;
  formatType: string;
  title: string;
  reviewStatus: string;
  qualityScore: number | null;
  aiContent: Record<string, unknown>;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [filter, setFilter] = useState("needs-review");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/bundles?status=${filter}`)
      .then((r) => r.json())
      .then((data) => setBundles(data.bundles))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: string, status: "approved" | "needs-review") {
    await fetch(`/api/bundles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewStatus: status }),
    });
    setBundles((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Bundles Pedagógicos</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option value="needs-review">Needs review</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>
      {loading && <p className="text-gray-400 text-sm">Carregando...</p>}
      {!loading && bundles.length === 0 && (
        <p className="text-gray-400 text-sm">Nenhum bundle com status "{filter}".</p>
      )}
      <ul className="space-y-3">
        {bundles.map((b) => (
          <li key={b.id} className="border border-gray-800 rounded p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{b.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {b.formatType} · score: {b.qualityScore ?? "—"}
                </p>
                <pre className="text-xs text-gray-300 mt-2 bg-gray-900 rounded p-2 overflow-auto max-h-40">
                  {JSON.stringify(b.aiContent, null, 2)}
                </pre>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => updateStatus(b.id, "approved")}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => updateStatus(b.id, "needs-review")}
                  className="px-3 py-1 bg-red-800 hover:bg-red-700 text-xs rounded"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5.5: Criar `app/graph/page.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";

interface Edge {
  from: string;
  to: string;
  confidence: number;
  status: string;
  reason: string;
}

export default function GraphPage() {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/graph")
      .then((r) => r.json())
      .then((data) => setEdges(data.edges))
      .finally(() => setLoading(false));
  }, []);

  async function updateEdge(from: string, to: string, status: "human-validated" | "rejected") {
    const edgeKey = encodeURIComponent(`${from}|${to}`);
    await fetch(`/api/graph/${edgeKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setEdges((prev) => prev.filter((e) => !(e.from === from && e.to === to)));
  }

  const shortId = (id: string) => id.split(":").pop() ?? id;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Grafo de Dependências — Revisão Pendente</h1>
      {loading && <p className="text-gray-400 text-sm">Carregando...</p>}
      {!loading && edges.length === 0 && (
        <p className="text-gray-400 text-sm">Nenhuma aresta pendente de revisão.</p>
      )}
      <ul className="space-y-3">
        {edges.map((e) => (
          <li key={`${e.from}|${e.to}`} className="border border-gray-800 rounded p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm">
                  <span className="text-blue-300">{shortId(e.from)}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-indigo-300">{shortId(e.to)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  confiança: {e.confidence.toFixed(2)} · {e.reason}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => updateEdge(e.from, e.to, "human-validated")}
                  className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs rounded"
                >
                  Validar
                </button>
                <button
                  onClick={() => updateEdge(e.from, e.to, "rejected")}
                  className="px-3 py-1 bg-red-800 hover:bg-red-700 text-xs rounded"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5.6: Criar `app/promote/page.tsx`**

```typescript
"use client";

import { useState } from "react";

export default function PromotePage() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runPromotion() {
    setLoading(true);
    setOutput(null);
    setError(null);
    try {
      const res = await fetch("/api/promote", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setOutput(data.output);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Promoção para Catálogo</h1>
      <p className="text-sm text-gray-400 mb-6">
        Gera <code className="bg-gray-900 px-1 rounded">conteúdo/governança/catalog-payload.json</code>{" "}
        com todos os bundles aprovados ordenados pela sequência de aprendizagem.
      </p>
      <button
        onClick={runPromotion}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm font-medium"
      >
        {loading ? "Executando..." : "Promover para Catálogo"}
      </button>
      {output && (
        <pre className="mt-4 bg-gray-900 border border-gray-800 rounded p-4 text-xs text-green-300 whitespace-pre-wrap">
          {output}
        </pre>
      )}
      {error && (
        <pre className="mt-4 bg-gray-900 border border-red-900 rounded p-4 text-xs text-red-300 whitespace-pre-wrap">
          {error}
        </pre>
      )}
    </div>
  );
}
```

- [ ] **Step 5.7: Iniciar o painel e verificar**

```bash
cd tools/editorial-panel && npm run dev
```

Abrir `http://localhost:3001` no navegador. Expected:
- Página de status mostra contagens de bundles e arestas
- Página `/bundles` lista bundles com status `needs-review` com botões de aprovar/rejeitar
- Página `/graph` lista arestas `pending-review` com botões de validar/rejeitar
- Página `/promote` tem o botão "Promover para Catálogo"

- [ ] **Step 5.8: Commit final**

```bash
cd ../..
git add tools/editorial-panel/app/ tools/editorial-panel/
git commit -m "feat: add editorial panel with bundle review, graph validation and promotion UI"
```

---

## Validação ponta a ponta do Plano 3

Pipeline completo dos 3 planos em sequência:

```bash
# Plano 1 — Knowledge Graph
OPENAI_API_KEY=<key> python scripts/content/generate-embeddings.py
ANTHROPIC_API_KEY=<key> python scripts/content/suggest-dependencies.py
python scripts/content/build-learning-sequence.py

# Plano 2 — Geração AI (split Claude/OpenAI)
ANTHROPIC_API_KEY=<key> OPENAI_API_KEY=<key> python3 scripts/content/ai-generate-formats.py

# Plano 3 — Painel + Promoção
node scripts/content/promote-to-catalog.mjs
cd tools/editorial-panel && npm run dev
```

Estado final esperado:

| Artefato | Verificação |
|---|---|
| `conteúdo/governança/concept-graph.json` | nodes e edges com status definidos |
| `conteúdo/governança/learning-sequence.json` | cycles: [], sequences por planeta |
| `formatos/*/*/ai-bundles.json` | bundles com reviewStatus e qualityScore |
| `conteúdo/governança/catalog-payload.json` | version, tracks com bundles aprovados |
| `localhost:3001` | painel acessível com as 4 páginas funcionais |
