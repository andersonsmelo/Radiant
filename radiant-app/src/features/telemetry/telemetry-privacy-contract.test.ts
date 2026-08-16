import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import ts from 'typescript';
import { isProhibitedKey, sanitizeTelemetryProps } from './sanitizeTelemetryProps';

// Raiz do código do app (este arquivo vive em src/features/telemetry/).
const appSrc = path.resolve(__dirname, '../../');

function listSourceFiles(): string[] {
  return readdirSync(appSrc, { recursive: true })
    .map((entry) => String(entry))
    .filter((entry) => /\.(ts|tsx)$/.test(entry) && !/\.test\.(ts|tsx)$/.test(entry))
    .map((entry) => path.join(appSrc, entry));
}

// Usa a AST para ignorar comentários, strings e template literals: só chamadas
// executáveis de fato pertencem ao contrato.
function extractTrackCalls(source: string): string[] {
  const sourceFile = ts.createSourceFile('telemetry-source.ts', source, ts.ScriptTarget.Latest, true);
  const calls: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === 'TelemetryService' &&
      node.expression.name.text === 'track'
    ) {
      calls.push(node.getText(sourceFile));
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return calls;
}

function extractPropertyKeyCandidates(call: string): string[] {
  const sourceFile = ts.createSourceFile(
    'telemetry-call.ts',
    `const value = ${call};`,
    ts.ScriptTarget.Latest,
    true,
  );
  let properties: ts.ObjectLiteralExpression | undefined;

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node)) {
      const candidate = node.arguments[1];
      if (candidate && ts.isObjectLiteralExpression(candidate)) {
        properties = candidate;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return (properties?.properties ?? []).flatMap((property) => {
    if (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) {
      return ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? [property.name.text] : [];
    }
    return [];
  });
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

  it('ignora uma chamada textual dentro de template literal e inspeciona somente a chamada executável', () => {
    const source = [
      "const exemplo = `TelemetryService.track('copiado', { patientName: 'não executa' })`;",
      "TelemetryService.track('app_open', { source: 'home' });",
    ].join('\n');

    const calls = extractTrackCalls(source);
    expect(calls).toHaveLength(1);
    expect(extractPropertyKeyCandidates(calls[0])).toEqual(['source']);
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
