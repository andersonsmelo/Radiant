import { NextResponse } from "next/server";
import { getContentHealth, getStatusCounts, getWave1BundleStatus, getWave1TrackReadiness } from "@/lib/content-io";

export async function GET() {
  const counts = getStatusCounts();
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    counts,
    wave1: getWave1BundleStatus(),
    wave1Readiness: getWave1TrackReadiness(),
    health: getContentHealth(),
  });
}
