import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, '..');
const reanimatedComponents = [
  'src/components/ui/AppButton.tsx',
  'src/components/ui/ProgressRing.tsx',
  // O mascote é o elemento mais animado do produto e estava fora deste
  // contrato: dez chamadas de withTiming sem easing nenhum, todas lineares.
  // Contrato que enumera seus alvos não diz nada sobre quem ele não nomeia.
  'src/ui/characters/PixelIllustration.tsx',
  'src/ui/characters/PixelFace.tsx',
  // O balão passou a animar em 2026-08-14 (nasce e recolhe a partir do
  // rabicho). Entra aqui no mesmo run que ganhou a animação, justamente pelo
  // motivo escrito acima: um contrato que enumera alvos não protege quem ele
  // não nomeia, e um componente animado fora da lista é uma regra que deixou
  // de valer sem ninguém decidir isso.
  'src/components/ui/SpeechBubble.tsx',
];

/**
 * Given the index of the '(' that opens a call's argument list, returns the
 * full `(...)` slice through the matching closing paren — respecting nested
 * parens (e.g. `Easing.out(Easing.quad)`) and string literals, so a paren
 * inside a string never miscounts the depth.
 */
function extractBalancedParens(source, openParenIndex) {
  let depth = 0;
  let inString = null;

  for (let i = openParenIndex; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (char === '\\') {
        i += 1;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openParenIndex, i + 1);
      }
    }
  }

  throw new Error('Unbalanced parentheses while scanning a withTiming(...) call');
}

/** Every individual `withTiming(...)` call site's full argument text. */
function findWithTimingCallSites(source) {
  const callSites = [];
  const callStart = /\bwithTiming\s*\(/g;
  let match;

  while ((match = callStart.exec(source))) {
    const openParenIndex = match.index + match[0].length - 1;
    callSites.push(extractBalancedParens(source, openParenIndex));
  }

  return callSites;
}

/**
 * Module-level `const NAME = { ... } as const;` objects whose body carries
 * a Reanimated worklet easing directly. A call site that spreads (`...NAME`)
 * or passes one of these by reference counts as carrying easing too — but
 * only because we verified the constant's own body, not just its name. If
 * a constant were ever emptied of its `easing: Easing....`, it drops out of
 * this set and every call site relying on it starts failing, same as if the
 * easing had been stripped from the call site itself.
 */
function findEasingCarryingConstants(source) {
  const carriers = new Set();
  const constDecl = /const\s+(\w+)\s*=\s*\{([^{}]*)\}\s*as const;/g;
  let match;

  while ((match = constDecl.exec(source))) {
    const [, name, body] = match;
    if (/easing:\s*Easing\./.test(body)) {
      carriers.add(name);
    }
  }

  return carriers;
}

/**
 * True when a single withTiming(...) call text carries a Reanimated worklet
 * easing — either a literal `easing: Easing....` in its options, or a
 * spread/bare reference to a constant already confirmed to carry one.
 */
function callSiteCarriesEasing(callText, easingConstants) {
  if (/easing:\s*Easing\./.test(callText)) {
    return true;
  }

  for (const name of easingConstants) {
    const reference = new RegExp(`(?:\\.\\.\\.|[(,]\\s*)${name}\\b`);
    if (reference.test(callText)) {
      return true;
    }
  }

  return false;
}

test('uses Reanimated worklet easings in Reanimated components', async () => {
  for (const relativePath of reanimatedComponents) {
    const source = await readFile(path.join(appDirectory, relativePath), 'utf8');
    const reanimatedImport = source.match(
      /import Animated, \{([\s\S]*?)\} from 'react-native-reanimated';/,
    );

    assert.ok(reanimatedImport, `${relativePath} imports its animation primitives from Reanimated`);
    assert.match(reanimatedImport[1], /\bEasing\b/, `${relativePath} imports Reanimated Easing`);
    assert.doesNotMatch(source, /easing:\s*easing\./, `${relativePath} does not pass React Native easing into a worklet`);

    const easingConstants = findEasingCarryingConstants(source);
    const callSites = findWithTimingCallSites(source);
    assert.ok(callSites.length > 0, `${relativePath} has at least one withTiming(...) call to check`);

    const missingEasing = callSites
      .map((callText, index) => ({ index, callText }))
      .filter(({ callText }) => !callSiteCarriesEasing(callText, easingConstants));

    assert.deepEqual(
      missingEasing.map(({ index }) => index),
      [],
      `${relativePath}: every withTiming(...) call must carry a Reanimated worklet easing ` +
        `(a literal \`easing: Easing....\` or a spread/reference to a constant whose own body ` +
        `contains one) — ${missingEasing.length} of ${callSites.length} call site(s) do not: ` +
        `${missingEasing.map(({ callText }) => callText.replace(/\s+/g, ' ').trim()).join(' | ')}`,
    );
  }
});
