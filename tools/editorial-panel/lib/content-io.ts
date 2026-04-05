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
