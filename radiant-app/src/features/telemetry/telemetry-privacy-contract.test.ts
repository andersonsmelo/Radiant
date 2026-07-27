import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { isProhibitedKey, sanitizeTelemetryProps } from './sanitizeTelemetryProps';

// Raiz do código do app (este arquivo vive em src/features/telemetry/).
const appSrc = path.resolve(__dirname, '../../');

function listSourceFiles(): string[] {
  return readdirSync(appSrc, { recursive: true })
    .map((entry) => String(entry))
    .filter((entry) => /\.(ts|tsx)$/.test(entry) && !/\.test\.(ts|tsx)$/.test(entry))
    .map((entry) => path.join(appSrc, entry));
}

// Extrai o texto de cada chamada TelemetryService.track(...) equilibrando
// parênteses, para inspecionar as chaves do objeto de propriedades inline.
function extractTrackCalls(source: string): string[] {
  const calls: string[] = [];
  const marker = 'TelemetryService.track(';
  let index = source.indexOf(marker);

  while (index !== -1) {
    let depth = 0;
    let end = index + marker.length - 1; // aponta para o '('
    for (let i = index + marker.length - 1; i < source.length; i += 1) {
      const char = source[i];
      if (char === '(') depth += 1;
      else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    calls.push(source.slice(index, end + 1));
    index = source.indexOf(marker, end + 1);
  }

  return calls;
}

// Nomes de propriedade candidatos dentro de uma chamada (identificador seguido
// de dois-pontos). Aproximação textual: erra para o lado de sinalizar.
const keyCandidateRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;

describe('telemetry privacy contract', () => {
  it('never passes a PII/credential/clinical key to TelemetryService.track', () => {
    const offenders: string[] = [];

    for (const file of listSourceFiles()) {
      const source = readFileSync(file, 'utf8');
      for (const call of extractTrackCalls(source)) {
        for (const match of call.matchAll(keyCandidateRegex)) {
          const key = match[1];
          if (isProhibitedKey(key)) {
            offenders.push(`${path.relative(appSrc, file)} → chave proibida "${key}"`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('drops prohibited keys and keeps benign scalars', () => {
    const result = sanitizeTelemetryProps({
      provider: 'email',
      source: 'quiz',
      amount: 10,
      configured: true,
      email: 'a@b.com',
      password: 'secret',
      patientName: 'Fulano',
      answer: 'Visualização de estruturas internas',
    });

    expect(result).toEqual({ provider: 'email', source: 'quiz', amount: 10, configured: true });
  });

  it('drops nested objects and arrays (free-text risk)', () => {
    const result = sanitizeTelemetryProps({
      screen: 'journey_home',
      nested: { foo: 'bar' },
      list: [1, 2, 3],
    });

    expect(result).toEqual({ screen: 'journey_home' });
  });

  it('treats prohibited keys case-insensitively and as substrings', () => {
    expect(isProhibitedKey('userEmail')).toBe(true);
    expect(isProhibitedKey('PatientId')).toBe(true);
    expect(isProhibitedKey('quizAnswer')).toBe(true);
    expect(isProhibitedKey('provider')).toBe(false);
    expect(isProhibitedKey('durationMs')).toBe(false);
  });

  it('passes undefined through unchanged', () => {
    expect(sanitizeTelemetryProps(undefined)).toBeUndefined();
  });
});
