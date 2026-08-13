# Expressões faciais do Pixel e balão de frases — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar ao mascote Pixel um rosto desenhado e animado que reage a momentos do produto, e um balão que solta frases de humor ácido sorteadas por momento.

**Architecture:** O asset perde o rosto pintado; o rosto passa a ser desenhado em React sobre a "tela" do robô, ancorado à caixa da imagem em vez do frame externo. Um catálogo de dados descreve cada expressão em nove campos, e um serviço puro (`PixelMood`) traduz *momento do produto* em `{ expressão, frase }`.

**Tech Stack:** React Native + Expo, TypeScript, react-native-reanimated 4.1, react-native-svg 15.12, expo-image, AsyncStorage, Jest (`jest-expo`) e contratos em `node --test`.

## Global Constraints

- Espaçamento e raio só podem usar os tokens `space.*` e `radius.*`. `visual:qa` reprova número mágico em `margin/padding/gap/borderRadius`. Valores permitidos de espaçamento: `0,1,2,4,8,12,16,20,24,32,40,48,56,64`. Raio: `0,2,4,8,12,16,20,24,100,999`.
- Nenhuma cor hex crua em `StyleSheet.create()` — usar `galaxyColors`, `colors` ou `semanticColors`.
- Todo `withTiming` em `PixelIllustration.tsx` e `PixelFace.tsx` precisa de `easing: Easing.<algo>` importado de `react-native-reanimated`. Nunca o `Easing` do `react-native`.
- Toda animação precisa de caminho alternativo sob *reduced motion*, via o hook existente `useReducedMotionPreference`.
- Nenhuma frase pode julgar a capacidade do usuário. A piada é sempre o Pixel ou a situação.
- O mascote nunca pode ser o motivo de uma tela falhar: qualquer erro degrada para "sem frase, cara `neutro`".
- Rodar `npm run quality` antes de cada commit que toque em `src/`.
- Nunca criar arquivo sem antes abrir um run do Loop com `node scripts/loop/abrir.mjs "<descrição>" <arquivos...>` a partir da raiz do repositório, e fechar com `validate → step finish → [memory write] → run close`, checando o `code` de cada resposta e **nunca** encadeando com `&&`.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/ui/characters/assets/pixel/pixel_core_faceless.png` | **Criar.** O render sem rosto |
| `src/ui/characters/pixelScreenGeometry.ts` | **Criar.** Onde fica a tela dentro do asset |
| `src/ui/characters/pixelExpressions.ts` | **Criar.** Catálogo de expressões |
| `src/ui/characters/PixelFace.tsx` | **Criar.** Desenha e anima o rosto |
| `src/ui/characters/PixelIllustration.tsx` | **Modificar.** Ancorar rosto à imagem; easing; remover `PixelFace` inline |
| `src/ui/characters/pixelAssets.ts` | **Modificar.** Apontar para o asset sem rosto |
| `src/features/pixel-mood/pixelPhrases.ts` | **Criar.** As 20 frases por momento |
| `src/features/pixel-mood/PixelMood.ts` | **Criar.** Momento → `{ expressão, frase }` |
| `src/features/journey/screens/JourneyHomeScreen.tsx` | **Modificar.** Disparar momentos e a entrega de bastão |
| `src/features/quiz/screens/QuizScreen.tsx` | **Modificar.** Contadores de sessão |
| `src/features/quiz/components/QuizFeedback.tsx` | **Modificar.** Frase no título |
| `scripts/pixel-screen-geometry-contract.test.mjs` | **Criar.** Contrato de geometria |
| `scripts/pixel-face-anchor-contract.test.mjs` | **Criar.** Contrato estrutural de âncora |
| `scripts/reanimated-easing-contract.test.mjs` | **Modificar.** Matricular os dois componentes |
| `package.json` | **Modificar.** Novos contratos em `quality` |

---

### Task 1: Asset sem rosto e a geometria da tela

**Files:**
- Create: `radiant-app/src/ui/characters/assets/pixel/pixel_core_faceless.png`
- Create: `radiant-app/src/ui/characters/pixelScreenGeometry.ts`
- Create: `radiant-app/scripts/pixel-screen-geometry-contract.test.mjs`
- Modify: `radiant-app/src/ui/characters/pixelAssets.ts`
- Modify: `radiant-app/package.json`

**Interfaces:**
- Consumes: nada.
- Produces: `PIXEL_SCREEN: { x, y, w, h }` e `PIXEL_ASSET_ASPECT: number`, exportados de `pixelScreenGeometry.ts`.

- [ ] **Step 1: Gerar o asset sem rosto**

Rode este script uma única vez, a partir de `radiant-app/`. Ele apaga só o rosto: para cada linha da faixa facial, amostra a cor mediana das colunas limpas da tela à esquerda e à direita e interpola horizontalmente, preservando o gradiente vertical. Requer `python3` com Pillow (`python3 -m pip install --user Pillow`).

```python
from PIL import Image, ImageFilter
A = "src/ui/characters/assets/pixel/pixel_core.png"
im = Image.open(A).convert('RGBA'); px = im.load()
X0, X1, Y0, Y1 = 190, 312, 212, 300      # faixa dos olhos, boca e do brilho deles
LSAMP, RSAMP = range(170, 188), range(314, 330)   # colunas limpas da tela

def med(row, cols):
    vals = sorted((px[x, row] for x in cols), key=lambda c: c[0]+c[1]+c[2])
    return vals[len(vals)//2]

out = im.copy(); pp = out.load()
for y in range(Y0, Y1):
    l, r = med(y, LSAMP), med(y, RSAMP)
    for x in range(X0, X1):
        t = (x - X0) / (X1 - X0)
        pp[x, y] = tuple(int(l[i] + (r[i] - l[i]) * t) for i in range(4))
region = (X0-8, Y0-8, X1+8, Y1+8)
out.paste(out.crop(region).filter(ImageFilter.GaussianBlur(3.2)), region)
out.save("src/ui/characters/assets/pixel/pixel_core_faceless.png")
```

Abra o PNG gerado e confirme a olho: a tela ficou uniformemente escura, sem resto de olho e sem costura visível nas bordas do remendo.

- [ ] **Step 2: Escrever o contrato de geometria (vai falhar)**

Create `radiant-app/scripts/pixel-screen-geometry-contract.test.mjs`:

```javascript
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetPath = path.join(appRoot, 'src/ui/characters/assets/pixel/pixel_core_faceless.png');
const geometryPath = path.join(appRoot, 'src/ui/characters/pixelScreenGeometry.ts');

// As constantes de PIXEL_SCREEN descrevem ONDE fica a tela do Pixel dentro do
// asset. Se alguém trocar o render por um de proporção ou enquadramento
// diferente, o rosto desenhado passa a cair fora da tela — defeito que já
// aconteceu neste componente e que nenhum teste de unidade pega, porque é
// geometria de runtime. Aqui a constante é conferida contra o próprio PNG.
function readPng(absPath) {
  const buf = fs.readFileSync(absPath);
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${absPath}: não é PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function parseConstant(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*([0-9.]+)`));
  assert.ok(match, `pixelScreenGeometry.ts define ${key}`);
  return Number.parseFloat(match[1]);
}

test('PIXEL_SCREEN descreve o asset realmente comitado', () => {
  const { width, height } = readPng(assetPath);
  assert.equal(width, 576, 'largura do asset');
  assert.equal(height, 864, 'altura do asset');

  const source = fs.readFileSync(geometryPath, 'utf8');
  const x = parseConstant(source, 'x');
  const y = parseConstant(source, 'y');
  const w = parseConstant(source, 'w');
  const h = parseConstant(source, 'h');

  // Caixa medida em 2026-08-11: x 168..336, y 200..312.
  assert.ok(Math.abs(x * width - 168) <= 6, `x=${x} deve cair em 168±6px`);
  assert.ok(Math.abs(y * height - 200) <= 6, `y=${y} deve cair em 200±6px`);
  assert.ok(Math.abs(w * width - 168) <= 6, `w=${w} deve cair em 168±6px`);
  assert.ok(Math.abs(h * height - 112) <= 6, `h=${h} deve cair em 112±6px`);

  const aspect = parseConstant(source, 'PIXEL_ASSET_ASPECT') || width / height;
  assert.ok(Math.abs(aspect - width / height) < 0.01, 'PIXEL_ASSET_ASPECT bate com o PNG');
});
```

- [ ] **Step 3: Rodar o contrato e ver falhar**

Run: `cd radiant-app && node --test scripts/pixel-screen-geometry-contract.test.mjs`
Expected: FAIL — `pixelScreenGeometry.ts` ainda não existe (`ENOENT`).

- [ ] **Step 4: Criar as constantes**

Create `radiant-app/src/ui/characters/pixelScreenGeometry.ts`:

```typescript
/**
 * Onde fica a "tela" do Pixel — o retângulo escuro que faz as vezes de rosto —
 * dentro do asset, em fração da própria imagem.
 *
 * Medido em 2026-08-11 sobre pixel_core.png (576×864) por detecção dos pixels
 * escuros no terço superior: x 168…336, y 200…312.
 *
 * Estas frações descrevem a IMAGEM, não o frame do componente. É toda a
 * diferença: a versão anterior do rosto se posicionava com `top: 22%` do frame,
 * enquanto a imagem tem altura `dimension × 1.48` dentro de um frame de
 * `× 1.38` e transborda `0.05 × dimension` para cima. Os olhos desenhados
 * apareciam uma cabeça acima do lugar. Quem posicionar rosto mede contra a
 * caixa da imagem, nunca contra o container externo.
 */
export const PIXEL_SCREEN = {
  x: 0.292,
  y: 0.231,
  w: 0.292,
  h: 0.13,
} as const;

/** Proporção do asset (largura ÷ altura). */
export const PIXEL_ASSET_ASPECT = 576 / 864;
```

- [ ] **Step 5: Rodar o contrato e ver passar**

Run: `cd radiant-app && node --test scripts/pixel-screen-geometry-contract.test.mjs`
Expected: PASS, 1 test.

- [ ] **Step 6: Apontar o resolver para o asset sem rosto**

Modify `radiant-app/src/ui/characters/pixelAssets.ts`, linhas 6-8. Trocar as três entradas:

```typescript
const PIXEL_BASE_ASSETS: Record<CharacterSize, number> = {
  // O render base não tem rosto: o rosto é desenhado por PixelFace sobre a
  // "tela" do personagem, para que ele possa mudar de expressão. O render com
  // rosto pintado (pixel_core.png) segue no repositório como referência.
  sm: require('./assets/pixel/pixel_core_faceless.png'),
  md: require('./assets/pixel/pixel_core_faceless.png'),
  lg: require('./assets/pixel/pixel_core_faceless.png'),
};
```

- [ ] **Step 7: Registrar o contrato no `quality`**

Modify `radiant-app/package.json`. Adicionar o script e encaixá-lo na cadeia de `quality`, logo após `test:icon-assets-contract`:

```json
"test:pixel-screen-geometry-contract": "node --test scripts/pixel-screen-geometry-contract.test.mjs",
```

E dentro de `"quality"`, inserir ` && npm run test:pixel-screen-geometry-contract` depois de `npm run test:icon-assets-contract`.

- [ ] **Step 8: Rodar a bateria e commitar**

Run: `cd radiant-app && npm run test:pixel-screen-geometry-contract && npm run typecheck`
Expected: ambos PASS.

```bash
git add radiant-app/src/ui/characters/assets/pixel/pixel_core_faceless.png \
        radiant-app/src/ui/characters/pixelScreenGeometry.ts \
        radiant-app/scripts/pixel-screen-geometry-contract.test.mjs \
        radiant-app/src/ui/characters/pixelAssets.ts \
        radiant-app/package.json
git commit -m "feat(pixel): asset sem rosto e geometria da tela do mascote"
```

---

### Task 2: Catálogo de expressões

**Files:**
- Create: `radiant-app/src/ui/characters/pixelExpressions.ts`
- Create: `radiant-app/src/ui/characters/pixelExpressions.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `type PixelExpression`, `interface PixelFaceShape`, `PIXEL_EXPRESSIONS: Record<PixelExpression, PixelFaceShape>`.

- [ ] **Step 1: Escrever o teste do catálogo (vai falhar)**

Create `radiant-app/src/ui/characters/pixelExpressions.test.ts`:

```typescript
import { PIXEL_EXPRESSIONS, type PixelExpression } from './pixelExpressions';

const TODAS: PixelExpression[] = [
  'neutro', 'feliz', 'orgulhoso', 'emburrado', 'revirando', 'surpreso', 'pensando',
];

describe('catálogo de expressões do Pixel', () => {
  it('define todas as sete expressões', () => {
    expect(Object.keys(PIXEL_EXPRESSIONS).sort()).toEqual([...TODAS].sort());
  });

  it('mantém cada forma dentro da tela', () => {
    for (const nome of TODAS) {
      const f = PIXEL_EXPRESSIONS[nome];
      expect(f.eyeW).toBeGreaterThan(0);
      expect(f.eyeW).toBeLessThanOrEqual(0.4);
      expect(f.eyeH).toBeGreaterThan(0);
      expect(f.eyeH).toBeLessThanOrEqual(0.8);
      expect(f.mouthW).toBeGreaterThan(0);
      expect(f.mouthW).toBeLessThanOrEqual(0.6);
      // Mergulho fora desta faixa desenha boca saindo da tela.
      expect(Math.abs(f.mouthDip)).toBeLessThanOrEqual(0.5);
      expect(f.mouthThickness).toBeGreaterThan(0);
    }
  });

  it('só sorri quando a expressão é positiva', () => {
    expect(PIXEL_EXPRESSIONS.feliz.mouthDip).toBeGreaterThan(0);
    expect(PIXEL_EXPRESSIONS.orgulhoso.mouthDip).toBeGreaterThan(0);
    // O sinal já saiu invertido uma vez, num mockup: em coordenada de tela o y
    // cresce para baixo, então sorriso é mergulho POSITIVO. Este caso existe
    // para que a inversão volte a falhar aqui, e não na cara do usuário.
    expect(PIXEL_EXPRESSIONS.emburrado.mouthDip).toBeLessThan(0);
    expect(PIXEL_EXPRESSIONS.revirando.mouthDip).toBeLessThan(0);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/ui/characters/pixelExpressions.test.ts`
Expected: FAIL — `Cannot find module './pixelExpressions'`.

- [ ] **Step 3: Criar o catálogo**

Create `radiant-app/src/ui/characters/pixelExpressions.ts`:

```typescript
import { colors } from '../theme';

export type PixelExpression =
  | 'neutro'
  | 'feliz'
  | 'orgulhoso'
  | 'emburrado'
  | 'revirando'
  | 'surpreso'
  | 'pensando';

/**
 * Uma expressão são oito números — todos em fração da caixa da TELA, nunca em
 * pixels, para que a mesma expressão funcione em sm, md e lg — mais uma cor e
 * um formato de olho.
 *
 * Como toda boca é a mesma curva de três pontos, transição entre duas
 * expressões é interpolar números. Não há morphing de path com contagem de
 * pontos divergente.
 */
export interface PixelFaceShape {
  /** Largura do olho, fração da largura da tela. */
  eyeW: number;
  /** Altura do olho, fração da altura da tela. */
  eyeH: number;
  /** Raio do olho, fração da largura do olho. 0.5 = pílula. */
  eyeRadius: number;
  /** Rotação em graus. Positivo inclina a borda interna para baixo (bravo). */
  eyeRotate: number;
  /** Deslocamento vertical do olho, fração da altura da tela. */
  eyeOffsetY: number;
  /**
   * Olho em arco ∩ em vez de pílula. Arco é a forma que faz o rosto ler como
   * feliz — testado contra pílula achatada em 2026-08-11, e a pílula lê como
   * olho fechado ou sonolento. Arco é desenhado em SVG junto com a boca;
   * pílula é uma View. Transição entre os dois formatos faz crossfade de
   * opacidade, não interpolação de forma.
   */
  eyeArc: boolean;
  /** Largura da boca, fração da largura da tela. */
  mouthW: number;
  /** Mergulho: >0 sorri, 0 reta, <0 emburra. Fração da altura da tela. */
  mouthDip: number;
  /** Espessura do traço da boca, fração da altura da tela. */
  mouthThickness: number;
  /** Cor do brilho. Não interpola: troca junto com a expressão. */
  glow: string;
}

export const PIXEL_EXPRESSIONS: Record<PixelExpression, PixelFaceShape> = {
  neutro: {
    eyeW: 0.13, eyeH: 0.4, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.24, mouthDip: 0.06, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  feliz: {
    eyeW: 0.15, eyeH: 0.3, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0.02,
    eyeArc: true, mouthW: 0.34, mouthDip: 0.3, mouthThickness: 0.06,
    glow: colors.accentStrong,
  },
  orgulhoso: {
    eyeW: 0.14, eyeH: 0.16, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0.02,
    eyeArc: false, mouthW: 0.22, mouthDip: 0.2, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  emburrado: {
    eyeW: 0.14, eyeH: 0.34, eyeRadius: 0.35, eyeRotate: 16, eyeOffsetY: 0.03,
    eyeArc: false, mouthW: 0.22, mouthDip: -0.16, mouthThickness: 0.055,
    glow: colors.accentStrong,
  },
  revirando: {
    eyeW: 0.13, eyeH: 0.34, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: -0.12,
    eyeArc: false, mouthW: 0.24, mouthDip: -0.05, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
  surpreso: {
    eyeW: 0.14, eyeH: 0.44, eyeRadius: 0.5, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.11, mouthDip: 0.02, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
  pensando: {
    eyeW: 0.13, eyeH: 0.34, eyeRadius: 0.45, eyeRotate: 0, eyeOffsetY: 0,
    eyeArc: false, mouthW: 0.18, mouthDip: 0.04, mouthThickness: 0.05,
    glow: colors.accentStrong,
  },
};

/** Distância do centro da tela até o centro de cada olho, fração da largura. */
export const PIXEL_EYE_GAP = 0.19;
/** Deslocamento vertical da linha dos olhos, fração da altura da tela. */
export const PIXEL_EYE_BASELINE = -0.1;
/** Deslocamento vertical da boca, fração da altura da tela. */
export const PIXEL_MOUTH_BASELINE = 0.26;
```

- [ ] **Step 4: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/ui/characters/pixelExpressions.test.ts`
Expected: PASS, 3 testes.

- [ ] **Step 5: Commitar**

```bash
git add radiant-app/src/ui/characters/pixelExpressions.ts \
        radiant-app/src/ui/characters/pixelExpressions.test.ts
git commit -m "feat(pixel): catalogo de expressoes faciais"
```

---

### Task 3: `PixelFace` ancorado à imagem

**Files:**
- Create: `radiant-app/src/ui/characters/PixelFace.tsx`
- Create: `radiant-app/scripts/pixel-face-anchor-contract.test.mjs`
- Modify: `radiant-app/src/ui/characters/PixelIllustration.tsx`
- Modify: `radiant-app/package.json`

**Interfaces:**
- Consumes: `PIXEL_SCREEN` (Task 1); `PIXEL_EXPRESSIONS`, `PixelExpression`, `PixelFaceShape`, `PIXEL_EYE_GAP`, `PIXEL_EYE_BASELINE`, `PIXEL_MOUTH_BASELINE` (Task 2).
- Produces: `<PixelFace expression={PixelExpression} imageWidth={number} imageHeight={number} />`.

- [ ] **Step 1: Escrever o contrato de âncora (vai falhar)**

Create `radiant-app/scripts/pixel-face-anchor-contract.test.mjs`:

```javascript
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// O rosto do Pixel é desenhado por cima da imagem. Se ele for posicionado
// contra o frame do componente em vez da caixa da imagem, ele erra o alvo por
// uma cabeça inteira — foi exatamente o defeito que existiu até 2026-08-11, e
// nenhum lint, typecheck, jest ou visual:qa o pegou, porque é geometria de
// runtime. A regra é estrutural e por isso é verificada na fonte.
test('PixelFace mede contra a imagem, nunca contra o frame', async () => {
  const source = await readFile(path.join(appRoot, 'src/ui/characters/PixelFace.tsx'), 'utf8');

  assert.match(
    source,
    /PIXEL_SCREEN/,
    'PixelFace deriva sua posição de PIXEL_SCREEN',
  );
  assert.match(
    source,
    /imageWidth/,
    'PixelFace recebe a largura da imagem para converter fração em pixel',
  );
  // Percentual em string é sempre relativo ao PAI. Se aparecer aqui, alguém
  // voltou a medir contra o container e o rosto vai flutuar de novo.
  assert.doesNotMatch(
    source,
    /(top|left|right|bottom):\s*'[0-9]+%'/,
    'PixelFace não posiciona por percentual de container',
  );
});

test('PixelIllustration põe imagem e rosto na mesma caixa', async () => {
  const source = await readFile(
    path.join(appRoot, 'src/ui/characters/PixelIllustration.tsx'),
    'utf8',
  );
  assert.match(source, /<PixelFace/, 'PixelIllustration renderiza PixelFace');
  assert.match(
    source,
    /imageWidth=\{[^}]+\}[\s\S]{0,120}imageHeight=\{[^}]+\}/,
    'PixelFace recebe as MESMAS dimensões usadas pela Image',
  );
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && node --test scripts/pixel-face-anchor-contract.test.mjs`
Expected: FAIL — `PixelFace.tsx` não existe.

- [ ] **Step 3: Criar o `PixelFace` estático**

Create `radiant-app/src/ui/characters/PixelFace.tsx`. Nesta task ele ainda não anima — desenha a expressão recebida.

```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PIXEL_SCREEN } from './pixelScreenGeometry';
import {
  PIXEL_EXPRESSIONS,
  PIXEL_EYE_BASELINE,
  PIXEL_EYE_GAP,
  PIXEL_MOUTH_BASELINE,
  type PixelExpression,
  type PixelFaceShape,
} from './pixelExpressions';

interface PixelFaceProps {
  expression: PixelExpression;
  /** Largura da Image em pixels. NÃO a largura do frame. */
  imageWidth: number;
  /** Altura da Image em pixels. NÃO a altura do frame. */
  imageHeight: number;
}

/** Converte a forma (em fração da tela) para pixels absolutos da imagem. */
function resolveLayout(shape: PixelFaceShape, imageWidth: number, imageHeight: number) {
  const screenX = PIXEL_SCREEN.x * imageWidth;
  const screenY = PIXEL_SCREEN.y * imageHeight;
  const screenW = PIXEL_SCREEN.w * imageWidth;
  const screenH = PIXEL_SCREEN.h * imageHeight;

  return {
    screenX,
    screenY,
    screenW,
    screenH,
    eyeW: shape.eyeW * screenW,
    eyeH: shape.eyeH * screenH,
    eyeGap: PIXEL_EYE_GAP * screenW,
    eyeCenterY: screenH / 2 + (PIXEL_EYE_BASELINE + shape.eyeOffsetY) * screenH,
    mouthW: shape.mouthW * screenW,
    mouthDip: shape.mouthDip * screenH,
    mouthThickness: Math.max(1.5, shape.mouthThickness * screenH),
    mouthY: screenH / 2 + PIXEL_MOUTH_BASELINE * screenH,
  };
}

/** Curva de três pontos. Mergulho positivo desce no meio, ou seja, sorri. */
function mouthPath(centerX: number, y: number, width: number, dip: number) {
  const x0 = centerX - width / 2;
  const x1 = centerX + width / 2;
  // Num quadrático, o ponto de controle precisa do dobro do deslocamento
  // desejado para que a curva passe por `y + dip` no meio.
  return `M ${x0} ${y} Q ${centerX} ${y + dip * 2} ${x1} ${y}`;
}

export function PixelFace({ expression, imageWidth, imageHeight }: PixelFaceProps) {
  const shape = PIXEL_EXPRESSIONS[expression] ?? PIXEL_EXPRESSIONS.neutro;
  const l = resolveLayout(shape, imageWidth, imageHeight);
  const centerX = l.screenW / 2;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.layer,
        { left: l.screenX, top: l.screenY, width: l.screenW, height: l.screenH },
      ]}
    >
      {!shape.eyeArc
        ? [-1, 1].map((side) => (
            <View
              key={`eye-${side}`}
              style={{
                position: 'absolute',
                left: centerX + side * l.eyeGap - l.eyeW / 2,
                top: l.eyeCenterY - l.eyeH / 2,
                width: l.eyeW,
                height: l.eyeH,
                borderRadius: shape.eyeRadius * l.eyeW,
                backgroundColor: shape.glow,
                transform: [{ rotate: `${-side * shape.eyeRotate}deg` }],
              }}
            />
          ))
        : null}

      <Svg width={l.screenW} height={l.screenH} style={styles.svg}>
        {shape.eyeArc
          ? [-1, 1].map((side) => {
              const ex = centerX + side * l.eyeGap;
              const rx = l.eyeW * 0.95;
              return (
                <Path
                  key={`arc-${side}`}
                  d={`M ${ex - rx} ${l.eyeCenterY} Q ${ex} ${l.eyeCenterY - l.eyeH * 1.6} ${ex + rx} ${l.eyeCenterY}`}
                  stroke={shape.glow}
                  strokeWidth={l.mouthThickness}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })
          : null}
        <Path
          d={mouthPath(centerX, l.mouthY, l.mouthW, l.mouthDip)}
          stroke={shape.glow}
          strokeWidth={l.mouthThickness}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    zIndex: 3,
  },
  svg: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
```

- [ ] **Step 4: Ligar no `PixelIllustration`**

Modify `radiant-app/src/ui/characters/PixelIllustration.tsx`:

1. Apagar a função `PixelFace` local (linhas ~156-225 na versão atual) e o bloco `{shouldShowFace ? <PixelFace ... /> : null}`.
2. Apagar `shouldShowScan` e o bloco do `scanBeam`, mais os estilos `scanBeam`, `faceLayer`, `faceRow`, `eye`, `eyeLeft`, `eyeRight`, `mouth`. A barra de scan é o outro elemento chapado que cruzava o rosto.
3. Importar `import { PixelFace } from './PixelFace';` e `import type { PixelExpression } from './pixelExpressions';`.
4. Adicionar `expression?: PixelExpression` a `PixelIllustrationProps`, com default `'neutro'`.
5. Envolver `Image` e `PixelFace` num container de dimensões idênticas às da imagem:

```tsx
const imageWidth = dimension;
const imageHeight = Math.round(dimension * 1.48);

// Imagem e rosto compartilham UMA caixa. É isso que impede o rosto de
// flutuar: as duas coisas passam a ser medidas contra a mesma origem.
<View style={[styles.imageBox, { width: imageWidth, height: imageHeight }]}>
  <Image
    source={asset.source}
    contentFit="contain"
    accessibilityLabel={accessibilityLabel}
    style={[styles.image, { width: imageWidth, height: imageHeight }]}
  />
  {!asset.isDedicated ? (
    <PixelFace
      expression={expression}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
    />
  ) : null}
</View>
```

E no `StyleSheet`:

```typescript
imageBox: {
  position: 'relative',
},
```

- [ ] **Step 5: Rodar o contrato e o typecheck**

Run: `cd radiant-app && node --test scripts/pixel-face-anchor-contract.test.mjs`
Expected: PASS, 2 testes.

Run: `cd radiant-app && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Verificar na tela, com ampliação**

Suba o app e capture a Home. Depois **recorte a cabeça e amplie 3x** antes de julgar — a captura em escala de device já escondeu este exato defeito uma vez:

```bash
xcrun simctl io booted screenshot /tmp/pixel-check.png
python3 -c "
from PIL import Image
im = Image.open('/tmp/pixel-check.png'); b=(200,640,460,860)
im.crop(b).resize(((b[2]-b[0])*3,(b[3]-b[1])*3), Image.LANCZOS).save('/tmp/pixel-face.png')"
```

Expected: os olhos e a boca aparecem **dentro** da tela escura do robô, centralizados, sem nada flutuando acima da cabeça e sem barra cruzando o rosto.

- [ ] **Step 7: Registrar o contrato e commitar**

Modify `radiant-app/package.json`: adicionar `"test:pixel-face-anchor-contract": "node --test scripts/pixel-face-anchor-contract.test.mjs"` e encaixar ` && npm run test:pixel-face-anchor-contract` em `quality`, depois do contrato de geometria.

```bash
cd radiant-app && npm run quality
git add radiant-app/src/ui/characters/PixelFace.tsx \
        radiant-app/scripts/pixel-face-anchor-contract.test.mjs \
        radiant-app/src/ui/characters/PixelIllustration.tsx \
        radiant-app/package.json
git commit -m "feat(pixel): rosto desenhado ancorado a caixa da imagem"
```

---

### Task 4: Animação, piscada e matrícula no contrato de easing

**Files:**
- Modify: `radiant-app/src/ui/characters/PixelFace.tsx`
- Modify: `radiant-app/src/ui/characters/PixelIllustration.tsx`
- Modify: `radiant-app/scripts/reanimated-easing-contract.test.mjs`

**Interfaces:**
- Consumes: `PixelFace` (Task 3).
- Produces: `PixelFace` com transição entre expressões e piscada.

- [ ] **Step 1: Matricular os dois componentes no contrato (vai falhar)**

Modify `radiant-app/scripts/reanimated-easing-contract.test.mjs`, o array `reanimatedComponents`:

```javascript
const reanimatedComponents = [
  'src/components/ui/AppButton.tsx',
  'src/components/ui/ProgressRing.tsx',
  // O mascote é o elemento mais animado do produto e estava fora deste
  // contrato: dez chamadas de withTiming sem easing nenhum, todas lineares.
  // Contrato que enumera seus alvos não diz nada sobre quem ele não nomeia.
  'src/ui/characters/PixelIllustration.tsx',
  'src/ui/characters/PixelFace.tsx',
];
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && node --test scripts/reanimated-easing-contract.test.mjs`
Expected: FAIL — `PixelIllustration.tsx imports Reanimated Easing`.

- [ ] **Step 3: Dar easing às dez chamadas existentes**

Modify `radiant-app/src/ui/characters/PixelIllustration.tsx`. Adicionar `Easing` ao import de `react-native-reanimated` e dar curva a **todos** os `withTiming` do `useEffect` de estado. Movimento de respiração usa `Easing.inOut(Easing.quad)`; o pulso de `celebrate` e o tremor de `oops` usam `Easing.out(Easing.quad)`:

```typescript
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const RESPIRA = { easing: Easing.inOut(Easing.quad) } as const;
const REAGE = { easing: Easing.out(Easing.quad) } as const;
```

E em cada chamada, por exemplo:

```typescript
translateY.value = withRepeat(
  withSequence(
    withTiming(-8, { duration: 2250, ...RESPIRA }),
    withTiming(0, { duration: 2250, ...RESPIRA }),
  ), -1, false
);
```

Aplicar o mesmo em todas as ocorrências de `withTiming` do arquivo. `celebrate` e `oops` recebem `...REAGE`.

- [ ] **Step 4: Animar a transição entre expressões**

Modify `radiant-app/src/ui/characters/PixelFace.tsx`. Os oito números viram `useSharedValue` e a expressão nova os leva por `withTiming`. O olho vira `Animated.View`; a boca vira `AnimatedPath` com `useAnimatedProps`.

```typescript
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useReducedMotionPreference } from '../accessibility/useReducedMotionPreference';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const TROCA_MS = 260;
const TROCA = { duration: TROCA_MS, easing: Easing.out(Easing.quad) } as const;
const PISCADA_MS = 90;
```

Regras, e cada uma existe por um motivo:

1. Um `useSharedValue` por número interpolável (`eyeW`, `eyeH`, `eyeRadius`, `eyeRotate`, `eyeOffsetY`, `mouthW`, `mouthDip`, `mouthThickness`). Num `useEffect` disparado por `expression`, cada um recebe `withTiming(novoValor, TROCA)`.
2. `glow` e `eyeArc` **não** interpolam. `glow` troca direto. `eyeArc` faz crossfade: um `useSharedValue` `arcMix` vai de 0 a 1 em `TROCA_MS`, e as duas representações do olho — a `Animated.View` pílula e o `AnimatedPath` arco — recebem `opacity` `1 - arcMix` e `arcMix`.
3. Piscada: um `useSharedValue` `blink` em 1. Sob movimento normal, um `setTimeout` recorrente com intervalo `4000 + Math.random() * 3000` dispara `blink.value = withSequence(withTiming(0.1, { duration: PISCADA_MS, easing: Easing.out(Easing.quad) }), withTiming(1, { duration: PISCADA_MS, easing: Easing.out(Easing.quad) }))`. A altura efetiva do olho é `eyeH.value * blink.value` — **multiplicador**, não valor absoluto, para funcionar em qualquer tamanho. Limpar o timer no unmount.
4. Sob `useReducedMotionPreference()`: os valores são atribuídos **direto**, sem `withTiming`, e o timer de piscada não é criado. A expressão continua trocando, porque a pose é informação; o que some é a interpolação e o movimento perpétuo. É a mesma regra que `PixelIllustration` já aplica.

- [ ] **Step 5: Rodar contrato, typecheck e testes**

Run: `cd radiant-app && node --test scripts/reanimated-easing-contract.test.mjs`
Expected: PASS.

Run: `cd radiant-app && npm run typecheck && npx jest src/ui/characters`
Expected: PASS.

- [ ] **Step 6: Verificar cada expressão na tela**

Rode o Storybook (`npm run storybook:ios`) ou monte uma tela temporária que percorra as sete expressões. Capture **cada uma** com o recorte ampliado do Step 6 da Task 3. Confirme: `feliz` tem olhos em arco e sorriso amplo; `emburrado` tem olhos inclinados para dentro e boca para baixo; `revirando` tem olhos deslocados para cima; a transição entre duas quaisquer é contínua, sem salto; a piscada acontece e não trava.

- [ ] **Step 7: Commitar**

```bash
cd radiant-app && npm run quality
git add radiant-app/src/ui/characters/PixelFace.tsx \
        radiant-app/src/ui/characters/PixelIllustration.tsx \
        radiant-app/scripts/reanimated-easing-contract.test.mjs
git commit -m "feat(pixel): transicao entre expressoes, piscada e easing no mascote"
```

---

### Task 5: O serviço `PixelMood`

**Files:**
- Create: `radiant-app/src/features/pixel-mood/pixelPhrases.ts`
- Create: `radiant-app/src/features/pixel-mood/PixelMood.ts`
- Create: `radiant-app/src/features/pixel-mood/PixelMood.test.ts`

**Interfaces:**
- Consumes: `PixelExpression` (Task 2).
- Produces:
  - `type PixelMoment = 'abriu-o-app' | 'voltou-depois-de-sumir' | 'acertou-em-sequencia' | 'errou-duas-vezes' | 'fechou-unidade'`
  - `interface PixelMoodResult { expression: PixelExpression; phrase: string; phraseIndex: number }` — `phraseIndex` existe para o teste de não-repetição e para gravar a última frase mostrada; as Tasks 6 e 7 o ignoram
  - `PixelMood.resolve(moment: PixelMoment): Promise<PixelMoodResult | null>`
  - `PixelMood.resolveOpening(lastActiveDate: string | null, now: Date): PixelMoment`
  - `PixelMood.resetSession(): void`

- [ ] **Step 1: Escrever os testes (vão falhar)**

Create `radiant-app/src/features/pixel-mood/PixelMood.test.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PixelMood } from './PixelMood';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

beforeEach(() => {
  jest.clearAllMocks();
  storage.getItem.mockResolvedValue(null);
  PixelMood.resetSession();
});

describe('resolveOpening', () => {
  const hoje = new Date('2026-08-11T12:00:00Z');

  it('trata lastActiveDate nulo como primeiro acesso, nunca como ausência', () => {
    // Nulo não é zero: nulo é "não há informação". A conta ingênua manda o
    // usuário recém-instalado para o pool de ausência, e a primeira coisa que
    // ele veria seria "olha só quem lembrou que radiologia existe" — dito a
    // alguém que nunca esteve lá.
    expect(PixelMood.resolveOpening(null, hoje)).toBe('abriu-o-app');
  });

  it('reconhece ausência a partir de três dias', () => {
    expect(PixelMood.resolveOpening('2026-08-08', hoje)).toBe('voltou-depois-de-sumir');
  });

  it('não trata dois dias como ausência', () => {
    expect(PixelMood.resolveOpening('2026-08-09', hoje)).toBe('abriu-o-app');
  });

  it('trata data futura como abertura normal', () => {
    // Relógio do aparelho andou para trás, ou fuso. Intervalo negativo vira 0.
    expect(PixelMood.resolveOpening('2026-08-20', hoje)).toBe('abriu-o-app');
  });
});

describe('resolve', () => {
  it('devolve expressão e frase do pool do momento', async () => {
    const r = await PixelMood.resolve('voltou-depois-de-sumir');
    expect(r).not.toBeNull();
    expect(r!.expression).toBe('emburrado');
    expect(typeof r!.phrase).toBe('string');
    expect(r!.phrase.length).toBeGreaterThan(0);
  });

  it('nunca repete a última frase mostrada daquele pool', async () => {
    storage.getItem.mockResolvedValue('0');
    for (let i = 0; i < 20; i += 1) {
      PixelMood.resetSession();
      const r = await PixelMood.resolve('voltou-depois-de-sumir');
      expect(r!.phraseIndex).not.toBe(0);
    }
  });

  it('devolve null no segundo disparo do mesmo momento na sessão', async () => {
    expect(await PixelMood.resolve('abriu-o-app')).not.toBeNull();
    expect(await PixelMood.resolve('abriu-o-app')).toBeNull();
  });

  it('ainda devolve frase quando o AsyncStorage falha', async () => {
    // O mascote nunca pode ser o motivo de uma tela falhar.
    storage.getItem.mockRejectedValue(new Error('storage offline'));
    const r = await PixelMood.resolve('abriu-o-app');
    expect(r).not.toBeNull();
  });

  it('devolve null para pool vazio', async () => {
    const r = await PixelMood.resolve('momento-inexistente' as never);
    expect(r).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/pixel-mood`
Expected: FAIL — `Cannot find module './PixelMood'`.

- [ ] **Step 3: Criar o catálogo de frases**

Create `radiant-app/src/features/pixel-mood/pixelPhrases.ts` com as cinco listas na ordem exata do spec (frases 1-20), tipado como:

```typescript
import type { PixelExpression } from '../../ui/characters/pixelExpressions';

export type PixelMoment =
  | 'abriu-o-app'
  | 'voltou-depois-de-sumir'
  | 'acertou-em-sequencia'
  | 'errou-duas-vezes'
  | 'fechou-unidade';

export interface PixelMomentSpec {
  expression: PixelExpression;
  phrases: readonly string[];
}

/**
 * Critério de tom, e é o que separa colega sarcástico de app que zoa quem está
 * aprendendo: nenhuma frase julga a capacidade do usuário. A piada é sempre o
 * Pixel ou a situação. As duas que chegam mais perto — "zero tato" e "robôs são
 * péssimos nisso" — desarmam na mesma frase.
 */
export const PIXEL_MOMENTS: Record<PixelMoment, PixelMomentSpec> = {
  'abriu-o-app': {
    expression: 'feliz',
    phrases: [
      'Bom te ver. Eu estava aqui encarando um tórax. Ele não conversa.',
      'Acordei. Digo, sempre estive acordado. Robôs não dormem, é uma tragédia silenciosa.',
      'Vamos nessa. Revisei tudo dezessete vezes enquanto esperava. É meio doentio.',
      'Você chegou. Eu ia começar sem você, mas não sou eu que preciso aprender isso.',
      'Pronto pra hoje? Eu nasci pronto. Literalmente, foi assim que me compilaram.',
    ],
  },
  'voltou-depois-de-sumir': {
    expression: 'emburrado',
    phrases: [
      'Olha só quem lembrou que radiologia existe.',
      'Quatro dias. Eu contei. Não porque me importo, é que não tenho mais nada pra fazer.',
      'Você voltou. Vou fingir que não estava contando os dias. Estava.',
      'Achei que tinha sido substituído por um flashcard. Foi um período difícil.',
      'Sumiu e voltou como se nada tivesse acontecido. Adoro isso em você. É sarcasmo.',
    ],
  },
  'acertou-em-sequencia': {
    expression: 'orgulhoso',
    phrases: [
      'Três seguidas. Começo a desconfiar que você anda estudando pelas minhas costas.',
      'Certo de novo. Vou ter que aumentar a dificuldade só pra manter meu emprego.',
      'Nessa toada eu viro decoração. Que, convenhamos, eu já sou um pouco.',
      'Muito bem. Não vou elogiar demais pra você não relaxar. Ops, elogiei.',
    ],
  },
  'errou-duas-vezes': {
    expression: 'revirando',
    phrases: [
      'Essa mesma questão de novo. Mas quem sou eu — só um robô com memória perfeita e zero tato.',
      'Erramos. Digo "erramos" porque fui eu que escolhi te mostrar essa questão agora.',
      'Vou fingir que não vi. Pronto, esqueci. Robôs são péssimos nisso.',
    ],
  },
  'fechou-unidade': {
    expression: 'feliz',
    phrases: [
      'Unidade fechada. Eu preparei um discurso, mas perdi o arquivo.',
      'Terminou. Guardo esse momento na memória permanente, junto com dezoito mil pixels de pulmão.',
      'Acabou. Eu fingiria surpresa, mas literalmente calculei que você conseguiria.',
    ],
  },
};

/** Dias de silêncio a partir dos quais a volta vira "voltou depois de sumir". */
export const DIAS_PARA_AUSENCIA = 3;
```

- [ ] **Step 4: Criar o serviço**

Create `radiant-app/src/features/pixel-mood/PixelMood.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PixelExpression } from '../../ui/characters/pixelExpressions';
import { DIAS_PARA_AUSENCIA, PIXEL_MOMENTS, type PixelMoment } from './pixelPhrases';

export interface PixelMoodResult {
  expression: PixelExpression;
  phrase: string;
  phraseIndex: number;
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const chave = (moment: PixelMoment) => `pixel-mood:last:${moment}`;

/** Momentos já disparados nesta sessão. Módulo, não componente: a regra é
 *  "um por sessão", e uma tela remontada não pode zerar isso. */
const disparados = new Set<PixelMoment>();

function resolveOpening(lastActiveDate: string | null, now: Date): PixelMoment {
  // Nulo não é zero. Nulo é "não há informação" — primeiro acesso. A conta
  // ingênua trata como ausência infinita e recebe o usuário recém-instalado
  // com "olha só quem lembrou que radiologia existe".
  if (!lastActiveDate) return 'abriu-o-app';

  const anterior = new Date(`${lastActiveDate}T00:00:00`);
  if (Number.isNaN(anterior.getTime())) return 'abriu-o-app';

  // Negativo = relógio andou para trás, ou fuso. Vira 0.
  const dias = Math.max(0, Math.floor((now.getTime() - anterior.getTime()) / MS_POR_DIA));
  return dias >= DIAS_PARA_AUSENCIA ? 'voltou-depois-de-sumir' : 'abriu-o-app';
}

async function lerUltimoIndice(moment: PixelMoment): Promise<number | null> {
  try {
    const bruto = await AsyncStorage.getItem(chave(moment));
    if (bruto === null) return null;
    const n = Number.parseInt(bruto, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    // O mascote nunca pode ser o motivo de uma tela falhar. Sem o último
    // índice, perdemos só a regra de não-repetir.
    return null;
  }
}

function sortearDiferente(total: number, evitar: number | null): number {
  if (total <= 1) return 0;
  const candidatos = [];
  for (let i = 0; i < total; i += 1) if (i !== evitar) candidatos.push(i);
  return candidatos[Math.floor(Math.random() * candidatos.length)];
}

async function resolve(moment: PixelMoment): Promise<PixelMoodResult | null> {
  const spec = PIXEL_MOMENTS[moment];
  if (!spec || spec.phrases.length === 0) return null;
  if (disparados.has(moment)) return null;

  const ultimo = await lerUltimoIndice(moment);
  const phraseIndex = sortearDiferente(spec.phrases.length, ultimo);

  disparados.add(moment);
  void AsyncStorage.setItem(chave(moment), String(phraseIndex)).catch(() => {});

  return { expression: spec.expression, phrase: spec.phrases[phraseIndex], phraseIndex };
}

/** Zera os momentos da sessão. Usado no reinício de sessão e, obrigatoriamente,
 *  no `beforeEach` de todo teste que dispare momento — o Set é de módulo e
 *  sobrevive entre `it`s. */
function resetSession(): void {
  disparados.clear();
}

export const PixelMood = { resolveOpening, resolve, resetSession };
```

- [ ] **Step 5: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/pixel-mood`
Expected: PASS, 10 testes.

- [ ] **Step 6: Commitar**

```bash
git add radiant-app/src/features/pixel-mood/
git commit -m "feat(pixel): servico de momentos e frases do mascote"
```

---

### Task 6: Fiação da Home com entrega de bastão

**Files:**
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`
- Modify: `radiant-app/src/features/journey/components/JourneyHero.tsx`
- Modify: `radiant-app/src/components/ui/PixelHeroSplit.tsx`
- Modify: `radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `PixelMood.resolve`, `PixelMood.resolveOpening` (Task 5); prop `expression` do `PixelIllustration` (Task 3).
- Produces: nada para tasks seguintes.

- [ ] **Step 1: Escrever o teste de fluxo (vai falhar)**

Adicionar a `JourneyHomeScreen.flow.test.tsx`:

O arquivo já mocka `GamificationService` (linha ~62) e renderiza com `renderWithProviders(<JourneyHomeScreen />)`. Estenda o mock existente para devolver `lastActiveDate` e adicione:

```typescript
it('mostra a frase de humor e depois entrega o balão para a mensagem funcional', async () => {
  jest.useFakeTimers();
  PixelMood.resetSession();

  const { GamificationService } = jest.requireMock(
    '../../gamification/services/GamificationService',
  ) as { GamificationService: { getSnapshot: jest.Mock } };
  GamificationService.getSnapshot.mockResolvedValue({
    totalXp: 0,
    streakDays: 0,
    lastActiveDate: '2026-08-06',   // cinco dias antes -> voltou-depois-de-sumir
    hearts: 5,
    maxHearts: 5,
  });

  renderWithProviders(<JourneyHomeScreen />);

  const frases = PIXEL_MOMENTS['voltou-depois-de-sumir'].phrases;
  await waitFor(() => {
    expect(frases.some((f) => screen.queryByText(f) !== null)).toBe(true);
  });

  jest.advanceTimersByTime(4000);

  await waitFor(() => {
    expect(screen.queryByText(/fim do conteúdo disponível/)).not.toBeNull();
  });

  jest.useRealTimers();
});
```

Imports a adicionar no arquivo: `import { PIXEL_MOMENTS } from '../../pixel-mood/pixelPhrases';` e `import { PixelMood } from '../../pixel-mood/PixelMood';`.

Se `getSnapshot` não estiver entre os métodos já mockados na linha ~62, adicione-o ao objeto do mock — não substitua o mock inteiro, os outros `it` do arquivo dependem dele.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`
Expected: FAIL — a frase de humor nunca aparece.

- [ ] **Step 3: Propagar `expression` e `testID`**

Modify `PixelHeroSplit.tsx`: adicionar `expression?: PixelExpression` às props, repassar para `PixelIllustration`, e adicionar `testID="journey-hero-bubble"` ao `SpeechBubble`. Adicionar `testID?: string` a `SpeechBubbleProps` e aplicá-lo ao `<Text>` interno.

Modify `JourneyHero.tsx`: adicionar `expression?: PixelExpression` às props e repassar ao `PixelHeroSplit`.

- [ ] **Step 4: Disparar o momento na Home**

Modify `JourneyHomeScreen.tsx`. Depois do `heroMessage`, adicionar:

```typescript
const HUMOR_HANDOVER_MS = 4000;

const [humor, setHumor] = useState<{ expression: PixelExpression; phrase: string } | null>(null);

useEffect(() => {
  let cancelado = false;
  const momento = PixelMood.resolveOpening(snapshot?.lastActiveDate ?? null, new Date());
  PixelMood.resolve(momento)
    .then((r) => { if (!cancelado && r) setHumor(r); })
    .catch(() => {});          // o mascote nunca derruba a tela
  return () => { cancelado = true; };
}, [snapshot?.lastActiveDate]);

// A frase abre e entrega o bastão: a mensagem funcional chega alguns segundos
// depois. Sem isso a feature nasceria morta, porque heroMessage NUNCA é vazio
// e a regra "mensagem funcional sempre vence" suprimiria o humor para sempre.
useEffect(() => {
  if (!humor) return undefined;
  const t = setTimeout(() => setHumor(null), HUMOR_HANDOVER_MS);
  return () => clearTimeout(t);
}, [humor]);
```

E no JSX: `message={humor?.phrase ?? heroMessage}` e `expression={humor?.expression ?? 'neutro'}`.

- [ ] **Step 5: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/journey/screens/JourneyHomeScreen.flow.test.tsx`
Expected: PASS.

- [ ] **Step 6: Verificar na tela**

Abra o app com a Home. Expected: a frase de humor aparece primeiro, o Pixel está com a expressão correspondente, e após ~4s o balão passa para a mensagem funcional com o Pixel voltando a `neutro`.

- [ ] **Step 7: Commitar**

```bash
cd radiant-app && npm run quality
git add radiant-app/src/features/journey/ radiant-app/src/components/ui/PixelHeroSplit.tsx radiant-app/src/components/ui/SpeechBubble.tsx
git commit -m "feat(pixel): frase de humor na home com entrega de bastao"
```

---

### Task 7: Fiação do quiz

**Files:**
- Modify: `radiant-app/src/features/quiz/screens/QuizScreen.tsx`
- Modify: `radiant-app/src/features/quiz/components/QuizFeedback.tsx`
- Modify: `radiant-app/src/features/quiz/screens/QuizScreen.flow.test.tsx`

**Interfaces:**
- Consumes: `PixelMood.resolve` (Task 5); prop `expression` do `PixelIllustration` (Task 3).
- Produces: nada.

- [ ] **Step 1: Escrever o teste (vai falhar)**

O `lessonFixture` existente no arquivo tem **uma questão só** (`question-1`), então estes casos precisam de fixture própria. Adicionar a `QuizScreen.flow.test.tsx`, dentro do `describe('QuizScreen flow')`:

```typescript
const lessonTresQuestoes: QuizLesson = {
  id: 'lesson-3q',
  title: 'Sequência de três',
  difficulty: 'beginner',
  questions: [1, 2, 3].map((n) => ({
    id: `question-${n}`,
    type: 'multiple-choice',
    prompt: `Pergunta ${n}?`,
    options: [{ label: `Errada ${n}` }, { label: `Certa ${n}` }],
    correctAnswerIndex: 1,
    explanation: `Explicação ${n}.`,
  })),
};

function montarQuiz(lesson: QuizLesson) {
  const { LessonCatalogService } = jest.requireMock(
    '../../content/services/LessonCatalogService',
  ) as { LessonCatalogService: { getLessonById: jest.Mock; getInitialLesson: jest.Mock } };
  LessonCatalogService.getLessonById.mockReturnValue(lesson);
  LessonCatalogService.getInitialLesson.mockReturnValue(lesson);
  renderWithProviders(<QuizScreen mode="normal" lessonId={lesson.id} />);
}

it('solta frase de sequência após três acertos seguidos', async () => {
  montarQuiz(lessonTresQuestoes);

  for (const n of [1, 2, 3]) {
    expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
    fireEvent.press(screen.getByLabelText(`Certa ${n}`));
    if (n < 3) {
      fireEvent.press(await screen.findByText('Próxima'));
    }
  }

  const frases = PIXEL_MOMENTS['acertou-em-sequencia'].phrases;
  await waitFor(() => {
    const encontrada = frases.some((f) => screen.queryByText(f) !== null);
    expect(encontrada).toBe(true);
  });
});

it('solta frase de teimosia após dois erros seguidos', async () => {
  montarQuiz(lessonTresQuestoes);

  for (const n of [1, 2]) {
    expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
    fireEvent.press(screen.getByLabelText(`Errada ${n}`));
    if (n < 2) {
      fireEvent.press(await screen.findByText('Próxima'));
    }
  }

  const frases = PIXEL_MOMENTS['errou-duas-vezes'].phrases;
  await waitFor(() => {
    const encontrada = frases.some((f) => screen.queryByText(f) !== null);
    expect(encontrada).toBe(true);
  });
});
```

Adicionar ao topo do arquivo: `import { PIXEL_MOMENTS } from '../../pixel-mood/pixelPhrases';` e, no `beforeEach` do `describe`, `PixelMood.resetSession();` — sem isso o segundo `it` recebe `null`, porque o momento já disparou na sessão do primeiro.

- [ ] **Step 2: Rodar e ver falhar**

Run: `cd radiant-app && npx jest src/features/quiz/screens/QuizScreen.flow.test.tsx`
Expected: FAIL — o título continua vindo de `FEEDBACK_MESSAGES`.

- [ ] **Step 3: Contadores de sessão**

Modify `QuizScreen.tsx`: dois `useRef<number>(0)` — `acertosSeguidos` e `errosSeguidos`. A cada resposta, incrementa o próprio e **zera o outro**. Quando `acertosSeguidos.current === 3` ou `errosSeguidos.current === 2`, chama `PixelMood.resolve(...)` e guarda o resultado em estado, passando-o ao `QuizFeedback`. Os refs não são persistidos e zeram ao sair da tela — é o escopo aprovado.

- [ ] **Step 4: Frase no título do feedback**

Modify `QuizFeedback.tsx`: adicionar props opcionais `moodPhrase?: string` e `moodExpression?: PixelExpression`. O `<Text style={styles.title}>` passa a renderizar `moodPhrase ?? (isCorrect ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT)`. Passar `expression={moodExpression ?? (isCorrect ? 'feliz' : 'neutro')}` ao `PixelIllustration`.

Não há entrega de bastão aqui: a frase fica pelo tempo em que o feedback está visível.

- [ ] **Step 5: Rodar e ver passar**

Run: `cd radiant-app && npx jest src/features/quiz`
Expected: PASS.

- [ ] **Step 6: Verificar na tela e commitar**

Responda três questões certas seguidas e confirme a frase e a cara `orgulhoso`. Erre duas seguidas e confirme `revirando`.

```bash
cd radiant-app && npm run quality
git add radiant-app/src/features/quiz/
git commit -m "feat(pixel): frases de momento no feedback do quiz"
```

---

## Auto-revisão do plano

**Cobertura do spec.** Geometria → Task 1. Asset sem rosto → Task 1. Catálogo → Task 2. `PixelFace` ancorado → Task 3. Animação, piscada, reduced motion e easing → Task 4. `PixelMood`, as 20 frases, as regras contra irritação e todas as cinco linhas da tabela de erro → Task 5. Entrega de bastão e Home → Task 6. Momentos de quiz → Task 7. Contratos novos → Tasks 1 e 3. Matrícula no contrato de easing → Task 4.

**Lacuna assumida:** `surpreso` fica sem gatilho, como o spec declara em "Fora de escopo". Ela existe no catálogo e é coberta pelo teste do Step 1 da Task 2.

**Consistência de tipos.** `PixelExpression` é definido na Task 2 e consumido nas Tasks 3, 5, 6 e 7 com o mesmo nome. `PIXEL_SCREEN` é definido na Task 1 e consumido na Task 3. `PixelMood.resolve` devolve `{ expression, phrase, phraseIndex }` — o campo `phraseIndex` é usado pelo teste de não-repetição na Task 5 e ignorado pelas Tasks 6 e 7; está na interface por isso.

**Duas correções aplicadas nesta revisão.** A Task 7 dizia "siga o padrão dos outros `it`" em vez de mostrar o teste — placeholder proibido, e pior porque o `lessonFixture` do arquivo tem **uma questão só**, então quem fosse implementar travaria ao tentar acertar três seguidas com ele. Agora a task traz a fixture de três questões e o helper de montagem. A Task 6 tinha o mesmo defeito num helper `renderJourneyHome` que não existe no arquivo; agora usa `renderWithProviders` e o mock de `GamificationService` que o arquivo já tem.

**Armadilha registrada para quem executar:** `PixelMood` guarda os momentos já disparados num `Set` de módulo, que **sobrevive entre `it`s do mesmo arquivo**. Todo teste que dispare um momento precisa de `PixelMood.resetSession()` no `beforeEach`, senão o segundo teste recebe `null` e a falha parece defeito do componente.
