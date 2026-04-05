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
