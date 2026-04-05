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
