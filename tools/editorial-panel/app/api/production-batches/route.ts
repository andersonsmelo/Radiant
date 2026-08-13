import { NextResponse } from "next/server";
import { getProductionBatchStatus } from "@/lib/production-batches";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, batches: getProductionBatchStatus() });
}
