import { NextResponse } from "next/server";
import { getPendingEdges } from "@/lib/content-io";

export async function GET() {
  const edges = getPendingEdges();
  return NextResponse.json({ edges, total: edges.length });
}
