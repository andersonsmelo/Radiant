import { NextResponse } from "next/server";
import { getStatusCounts } from "@/lib/content-io";

export async function GET() {
  const counts = getStatusCounts();
  return NextResponse.json(counts);
}
