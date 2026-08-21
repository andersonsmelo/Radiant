import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The tab bar in src/app/(tabs)/_layout.tsx is position:absolute, so it floats
// over scrollable content instead of insetting it. Every screen reachable from a
// tab must reserve `tabBarClearance` at the bottom of its scroll container, or
// its last element renders under the bar and can never be fully seen or tapped.
// This defect shipped once already (the Home CTA, fixed in 86d1867); a per-screen
// review did not prevent it from surviving on the other tab screens, so the rule
// is enforced structurally here.
async function readAppFile(relativePath) {
  return readFile(path.join(appRoot, relativePath), 'utf8');
}

/**
 * A lista é DERIVADA da barra, não repetida à mão.
 *
 * A versão anterior enumerava cinco caminhos, e a lista já mentia quando foi
 * lida em 2026-08-21: incluía `HomeScreen`, que não era tela de aba —
 * `(tabs)/index.tsx` renderiza `JourneyHomeScreen` sempre que
 * `ENABLE_LEARNING_ROAD` é verdadeira, e o padrão é verdadeira. Uma lista
 * escrita à mão envelhece em silêncio: a topologia muda, o contrato continua
 * verde, e ele passa a proteger telas que ninguém alcança enquanto ignora as
 * que existem.
 *
 * Derivar tem um efeito que enumerar não tem: acrescentar uma aba passa a
 * arrastar a obrigação de clearance junto, sem ninguém precisar lembrar.
 */
async function resolveTabScreens() {
  const layout = await readAppFile('src/app/(tabs)/_layout.tsx');
  const routeNames = [...layout.matchAll(/<Tabs\.Screen\s+name="([^"]+)"/g)].map((m) => m[1]);

  assert.ok(routeNames.length > 0, 'não foi possível ler nenhuma aba de (tabs)/_layout.tsx');

  const screens = [];
  for (const routeName of routeNames) {
    const route = await readAppFile(`src/app/(tabs)/${routeName}.tsx`);
    // A rota é um reexport fino: `import X from '@/src/features/.../X'`.
    for (const match of route.matchAll(/from '@\/(src\/features\/[^']+)'/g)) {
      screens.push(`${match[1]}.tsx`);
    }
  }

  assert.ok(screens.length > 0, 'nenhuma tela de aba foi resolvida a partir das rotas');
  return screens;
}

test('derives the clearance from the real tab bar measurements', async () => {
  const styles = await readAppFile('src/ui/styles.ts');

  assert.match(styles, /export const tabBar = \{/);
  assert.match(styles, /export const tabBarClearance = tabBar\.height \+ tabBar\.bottomOffset \+ space\.s3;/);
});

test('reserves the shared clearance on every scrollable tab screen', async () => {
  for (const relativePath of await resolveTabScreens()) {
    const source = await readAppFile(relativePath);

    // A screen that never scrolls cannot hide content under the bar.
    const scrolls = /contentContainerStyle=\{/.test(source);
    if (!scrolls) {
      continue;
    }

    assert.match(
      source,
      /paddingBottom: tabBarClearance/,
      `${relativePath} scrolls but does not reserve tabBarClearance`,
    );
    assert.match(
      source,
      /import \{[^}]*tabBarClearance[^}]*\} from/,
      `${relativePath} must import tabBarClearance instead of redefining it`,
    );
  }
});

test('keeps the scroll container of each tab screen free of hardcoded bottom padding', async () => {
  // A literal value here is how the defect returns: it looks deliberate, matches
  // no token, and silently drifts from the bar's real height.
  for (const relativePath of await resolveTabScreens()) {
    const source = await readAppFile(relativePath);
    const contentStyle = source.match(
      /(?:content|scrollContent):\s*\{[^}]*\}/,
    );

    if (!contentStyle) {
      continue;
    }

    assert.doesNotMatch(
      contentStyle[0],
      /paddingBottom:\s*\d/,
      `${relativePath} hardcodes the scroll bottom padding instead of using tabBarClearance`,
    );
  }
});
