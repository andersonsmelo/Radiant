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
