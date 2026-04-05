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
