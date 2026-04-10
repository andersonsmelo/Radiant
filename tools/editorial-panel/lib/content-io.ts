import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd(), "..", "..");
const CONTENT_ROOT = path.join(REPO_ROOT, "conteúdo");
const FORMATS_ROOT = path.join(CONTENT_ROOT, "formatos");
const GRAPH_PATH = path.join(CONTENT_ROOT, "governança", "concept-graph.json");
const WAVE1_STATUS_PATH = path.join(CONTENT_ROOT, "governança", "wave-1-bundle-status.json");
const WAVE1_PRIORITY_TRACKS_PATH = path.join(CONTENT_ROOT, "governança", "wave-1-priority-tracks.json");

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

export interface Wave1BundleTrackStatus {
  trackId: string;
  bundlesReady: number;
  bundlesInReview: number;
  bundlesBlocked: number;
}

export interface Wave1BundleStatus {
  version: string;
  tracks: Wave1BundleTrackStatus[];
}

export interface Wave1PriorityTrack {
  id: string;
  slug: string;
  title: string;
  priority: number;
  goal: string;
  description: string;
  lessonIds: string[];
}

export interface Wave1PriorityTracks {
  version: string;
  tracks: Wave1PriorityTrack[];
}

export interface Wave1TrackReadiness {
  trackId: string;
  slug: string;
  title: string;
  priority: number;
  goal: string;
  lessonCount: number;
  bundlesReady: number;
  bundlesInReview: number;
  bundlesBlocked: number;
  readinessPercent: number;
  state: "ready" | "in-review" | "blocked" | "not-started";
}

export interface Wave1Readiness {
  version: string;
  tracks: Wave1TrackReadiness[];
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

export function getWave1BundleStatus(): Wave1BundleStatus {
  const priorityTracks = getWave1PriorityTracks();

  if (priorityTracks.version === "missing") {
    return { version: "missing", tracks: [] };
  }

  const bundles = getAllAiBundles();
  const approvedQuizSlugs = getQuizBundleSlugsByStatus(bundles, "approved");
  const reviewQuizSlugs = new Set([
    ...getQuizBundleSlugsByStatus(bundles, "pending"),
    ...getQuizBundleSlugsByStatus(bundles, "needs-review"),
  ]);

  return {
    version: priorityTracks.version,
    tracks: priorityTracks.tracks.map((track) => {
      const status = track.lessonIds.reduce(
        (accumulator, lessonId) => {
          const slug = slugFromLessonId(lessonId);

          if (isLocalSeedLesson(lessonId) || approvedQuizSlugs.has(slug)) {
            accumulator.bundlesReady += 1;
          } else if (reviewQuizSlugs.has(slug)) {
            accumulator.bundlesInReview += 1;
          } else {
            accumulator.bundlesBlocked += 1;
          }

          return accumulator;
        },
        { bundlesReady: 0, bundlesInReview: 0, bundlesBlocked: 0 }
      );

      return {
        trackId: track.id,
        ...status,
      };
    }),
  };
}

export function getWave1PriorityTracks(): Wave1PriorityTracks {
  if (!fs.existsSync(WAVE1_PRIORITY_TRACKS_PATH)) {
    return { version: "missing", tracks: [] };
  }

  return JSON.parse(fs.readFileSync(WAVE1_PRIORITY_TRACKS_PATH, "utf-8"));
}

export function getWave1TrackReadiness(): Wave1Readiness {
  const priorityTracks = getWave1PriorityTracks();
  const bundleStatus = getWave1BundleStatus();
  const statusByTrackId = new Map(bundleStatus.tracks.map((track) => [track.trackId, track] as const));

  return {
    version: priorityTracks.version,
    tracks: priorityTracks.tracks
      .slice()
      .sort((left, right) => left.priority - right.priority)
      .map((track) => {
        const status = statusByTrackId.get(track.id) ?? {
          bundlesReady: 0,
          bundlesInReview: 0,
          bundlesBlocked: 0,
        };
        const lessonCount = track.lessonIds.length;
        const readinessPercent = lessonCount === 0 ? 0 : Math.round((status.bundlesReady / lessonCount) * 100);
        const state =
          status.bundlesBlocked > 0
            ? "blocked"
            : status.bundlesReady >= lessonCount && lessonCount > 0
              ? "ready"
              : status.bundlesInReview > 0
                ? "in-review"
                : "not-started";

        return {
          trackId: track.id,
          slug: track.slug,
          title: track.title,
          priority: track.priority,
          goal: track.goal,
          lessonCount,
          bundlesReady: status.bundlesReady,
          bundlesInReview: status.bundlesInReview,
          bundlesBlocked: status.bundlesBlocked,
          readinessPercent,
          state,
        };
      }),
  };
}

export function getContentHealth() {
  return {
    contentRootExists: fs.existsSync(CONTENT_ROOT),
    formatsRootExists: fs.existsSync(FORMATS_ROOT),
    graphExists: fs.existsSync(GRAPH_PATH),
    wave1StatusExists: fs.existsSync(WAVE1_STATUS_PATH),
    wave1PriorityTracksExists: fs.existsSync(WAVE1_PRIORITY_TRACKS_PATH),
  };
}

function getQuizBundleSlugsByStatus(bundles: AiBundle[], status: AiBundle["reviewStatus"]): Set<string> {
  return new Set(
    bundles
      .filter((bundle) => bundle.formatType === "quizzes" && bundle.reviewStatus === status)
      .map((bundle) => slugFromBundleId(bundle.id))
      .filter((slug): slug is string => Boolean(slug))
  );
}

function slugFromBundleId(bundleId: string): string | null {
  return bundleId.split(":")[3] ?? null;
}

function slugFromLessonId(lessonId: string): string {
  return lessonId.replace(/^ai-lesson:/, "");
}

function isLocalSeedLesson(lessonId: string): boolean {
  return lessonId === "lesson-1" || lessonId === "lesson-2";
}
