export function parseEnvelope(stdout) {
  let dados;
  try {
    dados = JSON.parse(stdout);
  } catch {
    throw new Error(`envelope ilegivel da CLI do Loop: ${stdout.slice(0, 200)}`);
  }
  return { code: dados.code, runId: dados.runId ?? null };
}

export function assertCode(envelope, expected) {
  if (envelope.code !== expected) {
    throw new Error(
      `esperado ${expected}, veio ${envelope.code} — a CLI reporta erro no corpo com saida zero`
    );
  }
}
