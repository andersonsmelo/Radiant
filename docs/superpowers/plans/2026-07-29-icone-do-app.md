# Ícone do app Radiant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o "A" da Ascend Creative pelo mascote Pixel como marca do Radiant em todos os assets de ícone, eliminando a grade de construção embutida na arte e o placeholder de blueprint do splash.

**Architecture:** Uma arte-mestra 1024×1024 gerada por script determinístico a partir de `radiant-app/assets/brand/pixel-master.png`; todos os sete derivados saem dela. Um contrato em Node puro lê o cabeçalho IHDR de cada PNG e trava dimensão, política de alpha e peso — sem dependência nova. A conformidade estrutural é verificada por teste; a adequação da arte, por evidência em emulador.

**Tech Stack:** Python 3 + Pillow (geração, operação rara e local), Node 20 + `node --test` (contrato, roda no `npm run quality`), Expo SDK 54 / `app.json`, Loop CLI como plano de controle.

**Spec:** [2026-07-29-icone-do-app-design.md](../specs/2026-07-29-icone-do-app-design.md)

## Global Constraints

- **Identidade:** galaxy dark é a identidade única ([ADR 2026-07-27](../../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md)). Nenhum asset pode introduzir paleta light.
- **Fundo do ícone:** gradiente radial `#0D1230` (centro) → `#07091c` (borda). Valores exatos, não aproximações.
- **`adaptiveIcon.backgroundColor`:** `#07091c`. **Splash `backgroundColor` e `dark.backgroundColor`:** ambos `#03030d`.
- **Enquadramento:** Pixel ocupa ~62% da largura, centrado, cabeça acima do centro geométrico.
- **Alpha — regras opostas no mesmo lote:** `icon.png` **sem** alpha (a Apple rejeita); `play-icon-512.png` **com** alpha 32-bit e ≤ 1024 KB; feature graphic **sem** alpha.
- **Loop:** toda alteração passa por `run start → context build → step begin → editar → validate → step finish → memory write → run close`. Nunca encadear `memory write && run close`. Summary do MemoryCandidateV1 ≤ 1000 chars.
- **Fonte da arte:** `radiant-app/assets/brand/pixel-master.png` (1024×1536, RGBA). Hoje o arquivo existe como `Mascote.png` na raiz do repo e está **untracked** — a Task 1 move e versiona. A raiz do repo não serve: `writePolicy.allowedRoots` enumera arquivos soltos de raiz um a um, e abrir uma exceção nova para arte é pior que guardá-la junto dos demais assets do app.
- **Gate:** nenhum commit pode deixar `npm run quality` vermelho (roadmap §10). O contrato da Task 2 é criado e observado vermelho **rodando o arquivo de teste direto**, e só é ligado ao `quality` na Task 5, quando todos os assets existem.

---

### Task 1: Alargar o writePolicy e versionar a arte-fonte

Transação própria e ordenada: a política é lida quando o escopo é checado, então widening não pode viver no mesmo run que ele autoriza. A arte-fonte entra junto porque é a fonte de verdade e hoje está fora do git — sem ela o gerador não é reprodutível.

**Files:**
- Modify: `.loop/project.yaml` (bloco `writePolicy.allowedRoots`)
- Create: `radiant-app/assets/brand/pixel-master.png` (movido de `Mascote.png` na raiz, hoje untracked)

**Interfaces:**
- Consumes: nada.
- Produces: permissão de escrita em `radiant-app/assets` para todas as tasks seguintes; a arte-fonte rastreada em `radiant-app/assets/brand/pixel-master.png`.

- [ ] **Step 1: Confirmar que a raiz está mesmo ausente**

```bash
cd /Users/anderson/Developer/Radiant
python3 -c "
import yaml
roots = yaml.safe_load(open('.loop/project.yaml'))['writePolicy']['allowedRoots']
print('assets permitido:', any(r.startswith('radiant-app/assets') for r in roots))
"
```

Expected: `assets permitido: False`

- [ ] **Step 2: Abrir o run do widening**

```bash
loop run start --task "Alargar writePolicy para radiant-app/assets e versionar a arte-fonte do mascote"
loop context build --run <run-id>
loop step begin --run <run-id> --files .loop/project.yaml
```

- [ ] **Step 3: Adicionar a raiz**

Em `.loop/project.yaml`, dentro de `writePolicy.allowedRoots`, logo após `- radiant-app/.rnstorybook`:

```yaml
    - radiant-app/assets
```

- [ ] **Step 4: Validar, finalizar e fechar**

```bash
loop validate --run <run-id>
loop step finish --run <run-id>
loop run close --run <run-id>
```

Expected: `VALIDATION_PASSED`. Sem memória durável aqui — é mudança de política, não aprendizado; feche o run bem-sucedido sem inventar uma.

- [ ] **Step 5: Mover a arte-fonte para dentro da raiz permitida**

O `git mv` não se aplica: o arquivo nunca esteve rastreado. Mover no disco e adicionar no destino.

```bash
cd /Users/anderson/Developer/Radiant
mkdir -p radiant-app/assets/brand
mv Mascote.png radiant-app/assets/brand/pixel-master.png
python3 -c "
from PIL import Image
im = Image.open('radiant-app/assets/brand/pixel-master.png')
print('arte-fonte:', im.size, im.mode)
assert im.size == (1024, 1536) and im.mode == 'RGBA', 'arte-fonte fora do esperado'
"
```

Expected: `arte-fonte: (1024, 1536) RGBA`

- [ ] **Step 6: Commitar**

```bash
git add .loop/project.yaml radiant-app/assets/brand/pixel-master.png
git commit -m "chore(loop): permite escrita em radiant-app/assets e versiona a arte-fonte do Pixel"
```

---

### Task 2: Contrato de assets (vermelho antes de existir arte nova)

O contrato vem antes dos assets: hoje `docs/store/assets/play-icon-512.png` não existe, então o teste nasce vermelho por um motivo real, não fabricado.

O contrato **não** é ligado ao `npm run quality` aqui: ele reprovaria, e nenhum commit pode deixar o gate vermelho (Global Constraints). A Task 5 faz a ligação quando todos os assets existem. O vermelho do TDD continua real — é observado rodando o arquivo de teste direto, que é exatamente o que o `loop-development` prescreve para vermelho planejado, e não gasta ciclo de `loop validate`.

**Files:**
- Create: `radiant-app/scripts/icon-assets-contract.test.mjs`

**Interfaces:**
- Consumes: nada.
- Produces: `readPngHeader(absPath) -> { width, height, colorType, hasAlpha, bytes }`, consumido por nenhuma outra task (o contrato é folha), mas as Tasks 3–6 precisam passar nele. A Task 5 liga este arquivo ao `quality`.

- [ ] **Step 1: Escrever o teste que falha**

Criar `radiant-app/scripts/icon-assets-contract.test.mjs`:

```javascript
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');

// PNG: assinatura de 8 bytes, depois IHDR. width em 16..19, height em 20..23,
// bit depth em 24, color type em 25 (tudo big-endian).
// Color types: 0 cinza, 2 RGB, 3 indexado, 4 cinza+alpha, 6 RGBA.
const ALPHA_TYPES = new Set([4, 6]);

export function readPngHeader(absPath) {
  const buf = fs.readFileSync(absPath);
  assert.equal(
    buf.subarray(0, 8).toString('hex'),
    '89504e470d0a1a0a',
    `${absPath}: nao e um PNG valido`
  );
  const colorType = buf.readUInt8(25);
  // tRNS da transparencia a um PNG sem canal alpha; conta como alpha.
  const hasTrns = buf.includes(Buffer.from('tRNS', 'ascii'));
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    colorType,
    hasAlpha: ALPHA_TYPES.has(colorType) || hasTrns,
    bytes: buf.length,
  };
}

const ASSETS = [
  { file: 'radiant-app/assets/images/icon.png', w: 1024, h: 1024, alpha: false },
  { file: 'radiant-app/assets/images/android-icon-foreground.png', w: 512, h: 512, alpha: true },
  { file: 'radiant-app/assets/images/android-icon-background.png', w: 512, h: 512, alpha: true },
  { file: 'radiant-app/assets/images/splash-icon.png', w: 1024, h: 1024, alpha: true },
  { file: 'radiant-app/assets/images/favicon.png', w: 48, h: 48, alpha: true },
  { file: 'docs/store/assets/play-icon-512.png', w: 512, h: 512, alpha: true, maxBytes: 1024 * 1024 },
  { file: 'docs/store/assets/feature-graphic.png', w: 1024, h: 500, alpha: false },
];

for (const asset of ASSETS) {
  test(`asset de loja: ${asset.file}`, () => {
    const abs = path.join(REPO_ROOT, asset.file);
    assert.ok(fs.existsSync(abs), `${asset.file}: ausente`);
    const h = readPngHeader(abs);
    assert.equal(h.width, asset.w, `${asset.file}: largura`);
    assert.equal(h.height, asset.h, `${asset.file}: altura`);
    assert.equal(
      h.hasAlpha,
      asset.alpha,
      `${asset.file}: alpha deveria ser ${asset.alpha}. A Apple rejeita icone com alpha; ` +
        `o Play exige alpha no icone 512 e proibe no feature graphic.`
    );
    if (asset.maxBytes) {
      assert.ok(h.bytes <= asset.maxBytes, `${asset.file}: ${h.bytes}B excede ${asset.maxBytes}B`);
    }
  });
}

test('camada monocromatica e estruturalmente monocromatica', () => {
  const abs = path.join(REPO_ROOT, 'radiant-app/assets/images/android-icon-monochrome.png');
  assert.ok(fs.existsSync(abs), 'android-icon-monochrome.png: ausente');
  const h = readPngHeader(abs);
  assert.equal(h.width, 432);
  assert.equal(h.height, 432);
  // color type 4 = cinza + alpha: garante monocromia pela estrutura do arquivo,
  // sem precisar decodificar pixel. Mais forte e mais barato que varrer R=G=B.
  assert.equal(h.colorType, 4, 'monochrome deve ser PNG cinza+alpha (color type 4)');
});

test('screenshots da loja respeitam o teto de proporcao do Play', () => {
  const dir = path.join(REPO_ROOT, 'docs/store/assets/screenshots');
  assert.ok(fs.existsSync(dir), 'docs/store/assets/screenshots: ausente');
  const shots = fs.readdirSync(dir).filter((f) => f.endsWith('.png'));
  assert.ok(shots.length >= 2, 'o Play exige no minimo 2 screenshots de telefone');
  for (const shot of shots) {
    const h = readPngHeader(path.join(dir, shot));
    const lo = Math.min(h.width, h.height);
    const hi = Math.max(h.width, h.height);
    assert.ok(lo >= 320 && hi <= 3840, `${shot}: lado fora da faixa 320-3840`);
    // "maximum dimension can't be more than twice as long as the minimum dimension".
    // O Pixel 9 nativo (1080x2424 = 2.244:1) seria RECUSADO; capturar em 1080x1920.
    assert.ok(hi <= 2 * lo, `${shot}: proporcao ${(hi / lo).toFixed(3)}:1 excede o teto de 2:1`);
    assert.equal(h.hasAlpha, false, `${shot}: o Play nao aceita alpha em screenshot`);
  }
});
```

- [ ] **Step 2: Rodar e confirmar o vermelho**

```bash
cd radiant-app && node --test scripts/icon-assets-contract.test.mjs
```

Expected: FAIL. Pelo menos `docs/store/assets/play-icon-512.png: ausente`, `docs/store/assets/feature-graphic.png: ausente` e `docs/store/assets/screenshots: ausente`.

- [ ] **Step 3: Confirmar que o gate continua verde**

O contrato existe mas ainda não está ligado, então o gate não pode ter mudado de estado.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality
```

Expected: PASS. Se reprovar, algo fora desta task quebrou — investigue antes de commitar.

- [ ] **Step 4: Commit**

```bash
git add radiant-app/scripts/icon-assets-contract.test.mjs
git commit -m "test(assets): contrato de icones e assets de loja, ainda fora do gate"
```

---

### Task 3: Gerador determinístico da arte-mestra e derivados

**Files:**
- Create: `scripts/assets/build-icons.py`
- Create: `scripts/assets/README.md`

**Interfaces:**
- Consumes: `radiant-app/assets/brand/pixel-master.png` (Task 1).
- Produces: os sete PNGs que a Task 2 verifica. CLI: `python3 scripts/assets/build-icons.py --out-app radiant-app/assets/images --out-store docs/store/assets`.

- [ ] **Step 1: Escrever o gerador**

Criar `scripts/assets/build-icons.py`:

```python
#!/usr/bin/env python3
"""Gera todos os assets de icone do Radiant a partir de uma unica arte-mestra.

Fonte: radiant-app/assets/brand/pixel-master.png.
Tokens: galaxyColors (radiant-app/src/ui/theme.ts).
Spec: docs/superpowers/specs/2026-07-29-icone-do-app-design.md
"""
import argparse
import os
from PIL import Image, ImageDraw, ImageFilter

BG_CENTER = (13, 18, 48)   # galaxyBg3 #0D1230
BG_EDGE = (7, 9, 28)       # galaxyBg2 #07091c
MASTER = 1024
BODY_WIDTH_FRAC = 0.62     # o Pixel ocupa ~62% da largura
HEAD_FRAC = 0.42           # fracao superior do corpo que e a cabeca


SOURCE_ART = os.path.join("radiant-app", "assets", "brand", "pixel-master.png")


def load_body(repo_root):
    src = Image.open(os.path.join(repo_root, SOURCE_ART)).convert("RGBA")
    # recorta pelo alpha solido: o halo de alpha baixo alargaria o bbox
    solid = src.getchannel("A").point(lambda v: 255 if v > 40 else 0)
    return src.crop(solid.getbbox())


def gradient_bg(size):
    im = Image.new("RGB", (size, size), BG_EDGE)
    d = ImageDraw.Draw(im)
    steps = 96
    for i in range(steps, 0, -1):
        t = i / steps
        r = int(size * 0.80 * t)
        col = tuple(
            int(round(BG_EDGE[k] + (BG_CENTER[k] - BG_EDGE[k]) * (1 - t) ** 1.5))
            for k in range(3)
        )
        d.ellipse([size // 2 - r, size // 2 - r, size // 2 + r, size // 2 + r], fill=col)
    return im


def compose_master(body):
    bg = gradient_bg(MASTER)
    tw = int(MASTER * BODY_WIDTH_FRAC)
    scale = tw / body.width
    piece = body.resize((tw, int(body.height * scale)), Image.LANCZOS)
    x = (MASTER - piece.width) // 2
    # cabeca acima do centro geometrico: ancora o corpo em 52% da altura
    y = int(MASTER * 0.52 - piece.height / 2)
    out = bg.copy()
    out.paste(piece, (x, y), piece)
    return out, piece, (x, y)


def monochrome_layer(body, size=432):
    """Silhueta da cabeca em cinza+alpha, derivada do mesmo alpha da arte-mestra."""
    head = body.crop((0, 0, body.width, int(body.height * HEAD_FRAC)))
    tw = int(size * 0.72)
    scale = tw / head.width
    head = head.resize((tw, int(head.height * scale)), Image.LANCZOS)
    alpha = head.getchannel("A").point(lambda v: 255 if v > 90 else 0)
    layer = Image.new("LA", (size, size), (0, 0))
    silhouette = Image.new("LA", head.size, (255, 0))
    silhouette.putalpha(alpha)
    layer.paste(silhouette, ((size - head.width) // 2, (size - head.height) // 2), silhouette)
    return layer


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-root", default=os.getcwd())
    ap.add_argument("--out-app", required=True)
    ap.add_argument("--out-store", required=True)
    a = ap.parse_args()

    os.makedirs(a.out_app, exist_ok=True)
    os.makedirs(a.out_store, exist_ok=True)

    body = load_body(a.repo_root)
    master, _, _ = compose_master(body)

    # iOS + App Store: SEM alpha (a Apple rejeita) -> RGB, color type 2
    master.convert("RGB").save(os.path.join(a.out_app, "icon.png"), "PNG", optimize=True)

    # adaptive icon: frente com o Pixel, fundo com o gradiente
    fg = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    tw = int(512 * BODY_WIDTH_FRAC)
    scale = tw / body.width
    piece = body.resize((tw, int(body.height * scale)), Image.LANCZOS)
    fg.paste(piece, ((512 - piece.width) // 2, int(512 * 0.52 - piece.height / 2)), piece)
    fg.save(os.path.join(a.out_app, "android-icon-foreground.png"), "PNG", optimize=True)

    gradient_bg(512).convert("RGBA").save(
        os.path.join(a.out_app, "android-icon-background.png"), "PNG", optimize=True
    )

    monochrome_layer(body).save(
        os.path.join(a.out_app, "android-icon-monochrome.png"), "PNG", optimize=True
    )

    master.convert("RGBA").save(os.path.join(a.out_app, "splash-icon.png"), "PNG", optimize=True)
    master.convert("RGBA").resize((48, 48), Image.LANCZOS).save(
        os.path.join(a.out_app, "favicon.png"), "PNG", optimize=True
    )

    # ficha do Play: 32-bit COM alpha, <= 1024KB
    store_icon = os.path.join(a.out_store, "play-icon-512.png")
    master.convert("RGBA").resize((512, 512), Image.LANCZOS).save(
        store_icon, "PNG", optimize=True
    )
    kb = os.path.getsize(store_icon) / 1024
    if kb > 1024:
        raise SystemExit(f"play-icon-512.png tem {kb:.0f}KB, acima do teto de 1024KB do Play")

    print("assets gerados")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Documentar o pré-requisito de toolchain**

Criar `scripts/assets/README.md`:

```markdown
# Geração de assets de ícone

Operação rara e local — não roda no CI. Exige Python 3 com Pillow:

    python3 -m pip install --user Pillow

Uso, a partir da raiz do repositório:

    python3 scripts/assets/build-icons.py \
      --out-app radiant-app/assets/images \
      --out-store docs/store/assets

A conformidade do resultado é verificada por
`radiant-app/scripts/icon-assets-contract.test.mjs`, que roda no `npm run quality`
e não depende de Python.
```

- [ ] **Step 3: Rodar o gerador**

```bash
cd /Users/anderson/Developer/Radiant
python3 scripts/assets/build-icons.py --out-app radiant-app/assets/images --out-store docs/store/assets
```

Expected: `assets gerados`, sem exceção de peso.

- [ ] **Step 4: Rodar o contrato**

```bash
cd radiant-app && node --test scripts/icon-assets-contract.test.mjs
```

Expected: os testes de `icon.png`, adaptive, splash, favicon, monochrome e `play-icon-512.png` passam. `feature-graphic.png` e `screenshots` continuam vermelhos — a Task 5 os fecha.

- [ ] **Step 5: Commit**

```bash
git add scripts/assets/ radiant-app/assets/images/ docs/store/assets/play-icon-512.png
git commit -m "feat(marca): Pixel vira o icone do app, gerado de uma arte-mestra unica"
```

---

### Task 4: Alinhar `app.json` à identidade única

**Files:**
- Modify: `radiant-app/app.json`

**Interfaces:**
- Consumes: os assets da Task 3.
- Produces: nada consumido por tasks seguintes.

- [ ] **Step 1: Ler os valores atuais**

```bash
cd /Users/anderson/Developer/Radiant
python3 -c "
import json
d = json.load(open('radiant-app/app.json'))['expo']
print('adaptiveIcon.backgroundColor:', d['android']['adaptiveIcon']['backgroundColor'])
print('splash:', [p for p in d['plugins'] if isinstance(p, list) and p[0] == 'expo-splash-screen'])
"
```

Expected: `#E6F4FE` e `backgroundColor: "#ffffff"` com `dark.backgroundColor: "#000000"`.

- [ ] **Step 2: Trocar as três cores**

Em `radiant-app/app.json`:

- `expo.android.adaptiveIcon.backgroundColor`: `"#E6F4FE"` → `"#07091c"`
- no plugin `expo-splash-screen`: `"backgroundColor": "#ffffff"` → `"#03030d"`
- no mesmo plugin: `"dark": { "backgroundColor": "#000000" }` → `"dark": { "backgroundColor": "#03030d" }`

Os dois modos ficam iguais de propósito: a ADR fixou identidade única, o app não tem modo light.

- [ ] **Step 3: Rodar o gate**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality
```

Expected: PASS exceto os itens de loja que a Task 5 fecha.

- [ ] **Step 4: Commit**

```bash
git add radiant-app/app.json
git commit -m "fix(identidade): splash e adaptive icon param de contradizer o galaxy dark"
```

---

### Task 5: Fechar os assets de loja e recapturar os screenshots

Os screenshots de 2026-07-29 pararam em 7 de 11 telas: o flow falhou em `lesson-option-ct-q3:option:2` na segunda lição, provavelmente porque a resolução forçada para 1080×1920 tirou a alternativa da área rolável.

**Files:**
- Create: `docs/store/assets/feature-graphic.png`
- Create: `docs/store/assets/screenshots/*.png` (mínimo 2, alvo 6)
- Create: `docs/store/ASSETS_DE_LOJA.md`
- Create: `radiant-app/.maestro/store-capture.yaml`
- Create: `scripts/assets/normalize-screenshots.py`
- Modify: `radiant-app/package.json` (liga o contrato da Task 2 ao `quality`)

**Interfaces:**
- Consumes: o contrato da Task 2.
- Produces: a ficha do Play completa em assets gráficos, fechando L2.7/E1.

- [ ] **Step 1: Diagnosticar a falha do flow antes de mexer nele**

```bash
export PATH=~/Library/Android/sdk/platform-tools:$HOME/.maestro/bin:$PATH
adb shell wm size 1080x1920
maestro --platform android hierarchy > /tmp/hier.json
grep -c "lesson-option-ct-q3" /tmp/hier.json
```

"Element not found" é afirmação sobre o matcher, não sobre o elemento. Se o id existir na árvore, o problema é visibilidade/rolagem, não seletor.

- [ ] **Step 2: Versionar o flow de captura**

Criar `radiant-app/.maestro/store-capture.yaml`, derivado do `learning-critical-path.yaml` (mesmos seletores ancorados), trocando as asserções finais por `takeScreenshot` nos pontos de vitrine. Entra no repo porque a captura precisa ser reprodutível pela próxima sessão — o flow que gerou os assets não pode viver só no scratchpad.

Pontos de captura, na ordem de vitrine: home com progresso real, lição, quiz, conquista desbloqueada, progresso, galáxia. A home entra **depois** de completar a trilha, para que XP e sequência apareçam preenchidos em vez de zerados.

Entrada na trilha: `tapOn: Continuar jornada` após `repeat while notVisible` + um `scroll` de elevação. O deep link `radiantapp://learn?...` **não** navegou quando testado em 2026-07-29 — deixou o app na home. Dirigir pela UI é mais robusto aqui.

- [ ] **Step 3: Rodar a captura com watchdog**

```bash
export PATH=~/Library/Android/sdk/platform-tools:$HOME/.maestro/bin:$PATH
cd radiant-app
perl -e 'alarm 1800; exec @ARGV' maestro --platform android test .maestro/store-capture.yaml > /tmp/captura.log 2>&1
```

Uma plataforma por vez — nunca o simulador iOS junto (16 GB não comportam os dois; já causou travamento de horas). O macOS não tem `timeout`; o `perl -e 'alarm'` é o watchdog. Nunca canalizar para `| tail`, que bufferiza e cega. O Maestro grava as capturas em `~/.maestro/tests/<run>/.../takeScreenshot/`, não no cwd.

- [ ] **Step 4: Normalizar para a especificação do Play**

Criar `scripts/assets/normalize-screenshots.py`:

```python
#!/usr/bin/env python3
"""Converte as capturas cruas do Maestro para a especificacao de screenshot do Play."""
import argparse
import os
import shutil
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("--src", required=True, help="diretorio com os PNGs crus do Maestro")
ap.add_argument("--out", required=True, help="docs/store/assets/screenshots")
a = ap.parse_args()

if os.path.isdir(a.out):
    shutil.rmtree(a.out)
os.makedirs(a.out, exist_ok=True)

falhas = []
for name in sorted(os.listdir(a.src)):
    if not name.endswith(".png"):
        continue
    im = Image.open(os.path.join(a.src, name)).convert("RGB")  # 24-bit, sem alpha
    lo, hi = min(im.size), max(im.size)
    if hi > 2 * lo:
        falhas.append(f"{name}: proporcao {hi/lo:.3f}:1 excede o teto de 2:1 do Play")
        continue
    if lo < 320 or hi > 3840:
        falhas.append(f"{name}: lado fora da faixa 320-3840")
        continue
    im.save(os.path.join(a.out, name), "PNG", optimize=True)
    print(f"ok {name} {im.size[0]}x{im.size[1]}")

if falhas:
    raise SystemExit("\n".join(falhas))
```

Rodar:

```bash
python3 scripts/assets/normalize-screenshots.py \
  --src "$(ls -td ~/.maestro/tests/*/ | head -1)"'Store screenshot capture/takeScreenshot/shots' \
  --out docs/store/assets/screenshots
```

- [ ] **Step 5: Gerar o feature graphic**

O feature graphic reusa a arte-mestra e a fonte Sora que o app já carrega (`radiant-app/node_modules/@expo-google-fonts/sora`). 1024×500, RGB sem alpha. O bloco de texto começa em x=116, não x=68: algumas superfícies do Play recortam para 16:9, comendo 68 px de cada lado, e no recorte o wordmark encostava na borda.

- [ ] **Step 6: Ligar o contrato ao gate**

Agora que todos os assets existem, o contrato da Task 2 pode entrar no `quality` sem deixá-lo vermelho. Em `radiant-app/package.json`, adicionar em `scripts`, seguindo o padrão dos contratos vizinhos:

```json
"test:icon-assets-contract": "node --test scripts/icon-assets-contract.test.mjs"
```

E inserir a chamada no `quality`, logo após `test:identity-palette-contract` (agrupa com os contratos de identidade visual, antes da suíte Jest):

```
... && npm run test:identity-palette-contract && npm run test:icon-assets-contract && npm run test -- --runInBand && npm run visual:qa:strict
```

- [ ] **Step 7: Rodar o gate completo**

```bash
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality
```

Expected: PASS, agora incluindo o contrato de assets — `screenshots` e `feature-graphic.png` inclusive. Este é o passo que fecha o ciclo TDD aberto na Task 2.

- [ ] **Step 8: Commit**

```bash
git add docs/store/assets/ docs/store/ASSETS_DE_LOJA.md \
        radiant-app/.maestro/store-capture.yaml scripts/assets/normalize-screenshots.py \
        radiant-app/package.json
git commit -m "feat(loja): fecha os assets graficos da ficha e liga o contrato ao gate"
```

---

### Task 6: Evidência em device

O contrato pega violação de especificação, não arte inadequada — ele **não** teria pego a grade de construção. O que pega arte errada é isto.

**Files:**
- Create: `radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md`
- Modify: `docs/plans/2026-07-29-android-closed-testing-plan.md` (marcar L2.7)
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md` (marcar E1)

**Interfaces:**
- Consumes: os assets das Tasks 3–5.
- Produces: sinalização de task concluída, como exige o `AGENTS.md`.

- [ ] **Step 1: Reconstruir e instalar**

O ícone é recurso nativo: trocar o PNG não muda o app já instalado. É preciso regenerar o projeto nativo e buildar de novo.

```bash
export PATH=~/Library/Android/sdk/platform-tools:$PATH
cd radiant-app
npx expo prebuild --platform android --no-install
cd android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

O prebuild regenera `gradle.properties`; a memória da JVM já está travada pelo config plugin `plugins/with-gradle-memory.js`, então não é preciso editar nada à mão.

- [ ] **Step 2: Capturar as três provas de runtime**

```bash
# launcher: volta para a home e fotografa a gaveta
adb shell input keyevent KEYCODE_HOME
adb exec-out screencap -p > /tmp/evid-launcher.png

# splash: mata o app e refotografa logo apos o cold start
adb shell am force-stop com.ascendcreative.radiant
adb shell monkey -p com.ascendcreative.radiant -c android.intent.category.LAUNCHER 1
adb exec-out screencap -p > /tmp/evid-splash.png
```

A terceira prova — ícone no tema dinâmico do Android 13+ — é manual: Ajustes → Papel de parede e estilo → ícones temáticos, e então fotografar a home. É o único jeito de ver a camada monocromática renderizada de verdade.

- [ ] **Step 3: Escrever a evidência datada**

Registrar em `radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md`: os três screenshots, a receita de build acima, o `versionName`/`versionCode` do APK verificado, e o veredito por prova. Seguir o formato das evidências vizinhas em `radiant-app/docs/evidence/`.

- [ ] **Step 4: Sinalizar as tasks no roadmap e no plano**

Marcar L2.7 como concluída no plano de closed testing e E1 no roadmap, no mesmo commit que entrega o trabalho. Trabalho não sinalizado é tratado como não feito pelas próximas sessões.

- [ ] **Step 5: Commit**

```bash
git add radiant-app/docs/evidence/ docs/plans/
git commit -m "docs(evidence): icone da marca Pixel verificado em device; fecha L2.7/E1"
```

---

## Ordem e paralelismo

Task 1 bloqueia todas as demais (sem o widening, o Loop recusa a escrita). Task 2 pode correr junto da 1. Tasks 3 → 4 são sequenciais. Task 5 depende da 3 (o feature graphic reusa a arte-mestra). Task 6 fecha.

## Fora deste plano

- Marca vetorial definitiva (evolução pós-beta, exige designer).
- Assets e screenshots da App Store — passada iOS, separada.
- Qualquer redesenho do mascote Pixel em si.
