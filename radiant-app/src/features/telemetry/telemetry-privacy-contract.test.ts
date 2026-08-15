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

// Propriedade abreviada de objeto — `{ lessonId, rating }` em vez de
// `{ lessonId: lessonId, rating: rating }`. `keyCandidateRegex` acima exige
// dois-pontos literal e por isso não enxerga nenhuma chave aqui: um
// identificador só conta como abreviação quando é precedido por `{` ou `,` E
// seguido por `,` ou `}` (ignorando espaço) — é isso que separa uma CHAVE
// abreviada (`{ lessonId, rating }`) de um VALOR à direita de dois-pontos
// (`{ foo: bar }`, onde "bar" é precedido por ":", não por "{"/",").
// Spread (`{ ...rest, lessonId }`) fica de fora de propósito: "rest" é
// precedido por "." (da reticência), não por "{"/",", e o conteúdo de um
// spread não é nomeável estaticamente por este scanner de qualquer forma —
// mesma limitação que já existia antes desta mudança.
const shorthandKeyCandidateRegex = /[{,]\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=[,}])/g;

// Achado do review final da branch feat/atividade-fim-licao (2026-08-15):
// `LessonRatingService.ts` chama `TelemetryService.track('lesson_rated',
// { lessonId, rating })` com propriedade abreviada, e a varredura original
// (só `keyCandidateRegex`) extraía ZERO chaves dessa chamada — o guarda
// nunca via o call site. Controller Ruling 10 autoriza este endurecimento:
// a regra proibida é AFROUXAR o contrato, não fortalecê-lo.
function extractPropertyKeyCandidates(call: string): string[] {
  const keys: string[] = [];
  for (const match of call.matchAll(keyCandidateRegex)) {
    keys.push(match[1]);
  }
  for (const match of call.matchAll(shorthandKeyCandidateRegex)) {
    keys.push(match[1]);
  }
  return keys;
}

describe('telemetry privacy contract', () => {
  it('never passes a PII/credential/clinical key to TelemetryService.track', () => {
    const offenders: string[] = [];

    for (const file of listSourceFiles()) {
      const source = readFileSync(file, 'utf8');
      for (const call of extractTrackCalls(source)) {
        for (const key of extractPropertyKeyCandidates(call)) {
          if (isProhibitedKey(key)) {
            offenders.push(`${path.relative(appSrc, file)} → chave proibida "${key}"`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('enxerga uma chave proibida passada como propriedade abreviada — regressão para o gap que deixou lesson_rated passar despercebido', () => {
    // Fixture sintética, não um arquivo real: prova que a varredura agora
    // extrai chaves de `{ identificador }` sem dois-pontos. Sem
    // `shorthandKeyCandidateRegex`, `keys` viria vazio e este teste falharia
    // — é exatamente essa lacuna que deixou `{ lessonId, rating }` invisível
    // ao guarda antes desta correção.
    const call = "TelemetryService.track('test_event', { email, source: 'quiz' })";
    const keys = extractPropertyKeyCandidates(call);

    expect(keys).toContain('email');
    expect(keys.filter((key) => isProhibitedKey(key))).toEqual(['email']);
  });

  it('continua sem falsos positivos em propriedade abreviada benigna, como o call site real de lesson_rated', () => {
    const call = "TelemetryService.track('lesson_rated', { lessonId, rating })";
    const keys = extractPropertyKeyCandidates(call);

    expect(keys).toEqual(expect.arrayContaining(['lessonId', 'rating']));
    expect(keys.filter((key) => isProhibitedKey(key))).toEqual([]);
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
