#!/usr/bin/env python3
"""Gera todos os assets de icone do Radiant a partir de uma unica arte-mestra.

Fonte: radiant-app/assets/brand/pixel-master.png (versionada).
Spec:  docs/superpowers/specs/2026-07-29-icone-do-app-design.md
Plano: docs/superpowers/plans/2026-07-29-icone-do-app.md

Deterministico: mesma fonte, mesma saida. Nenhum parametro aleatorio, nenhuma
dependencia de rede. Operacao rara e local — o resultado e versionado, entao o
script existe para ser auditavel e reproduzivel, nao para rodar no CI.

Uso:
    python3 scripts/assets/build-icons.py \
        --out-app radiant-app/assets/images \
        --out-store docs/store/assets
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFilter

# --- tokens de identidade (radiant-app/src/ui/theme.ts) --------------------
BG_CENTER = (13, 18, 48)   # galaxyBg3 #0D1230 — centro do gradiente
BG_EDGE = (7, 9, 28)       # galaxyBg2 #07091c — borda do gradiente

# --- constantes de enquadramento, todas medidas na arte-fonte -------------
MASTER = 1024
SOURCE_ART = os.path.join("radiant-app", "assets", "brand", "pixel-master.png")

# Enquadramento da spec: o Pixel ocupa ~62% da LARGURA do quadro.
#
# O Pixel e retrato (L/A = 0.725 medido), entao 62% de largura projetam ~85,6% de
# altura. A altura e a dimensao que de fato restringe, mas ela e DERIVADA da regra
# da spec em vez de ser um segundo numero solto — dois numeros para o mesmo
# enquadramento divergem no primeiro dia em que a arte-fonte mudar de proporcao.
#
# Verificado renderizando as duas leituras a 1024, 180 (sob a squircle do iPhone),
# 120, 80 e 48px: nesta escala o rosto continua legivel nos tamanhos pequenos e a
# antena nao e cortada pela mascara. Uma versao menor (78% de altura) foi avaliada
# e descartada — respirava melhor a 360px, tamanho em que ninguem ve um icone.
BODY_WIDTH_FRAC = 0.62
CENTER_Y_FRAC = 0.52       # ancora o corpo acima do centro geometrico


def body_height_frac(body):
    """Converte a regra de largura da spec na fracao de altura correspondente."""
    return BODY_WIDTH_FRAC / (body.width / body.height)

# Adaptive icon: 108dp totais, 72dp garantidos visiveis sob qualquer mascara.
# Passar disso e entregar um icone que o launcher corta.
ADAPTIVE_SAFE = 72.0 / 108.0
ADAPTIVE_MARGIN = 0.94     # folga adicional dentro da zona segura

# A cabeca termina em ~0.41 da altura do corpo (medido); 0.42 da uma margem.
HEAD_FRAC = 0.42
# Limiar do glow ciano dos olhos e do sorriso. Medido: abaixo de ~235 a mascara
# passa a capturar o reflexo do bezel da tela junto com os glifos.
GLYPH_THRESHOLD = 235
ALPHA_THRESHOLD = 110


def load_body(repo_root):
    """Recorta a arte pelo alpha solido.

    O corte usa alpha > 40 e nao > 0 porque o halo de alpha baixo ao redor do
    render alargaria o bbox e deslocaria todo o enquadramento.
    """
    src = Image.open(os.path.join(repo_root, SOURCE_ART)).convert("RGBA")
    solid = src.getchannel("A").point(lambda v: 255 if v > 40 else 0)
    return src.crop(solid.getbbox())


def gradient_bg(size):
    """Gradiente radial galaxy elevado: BG_CENTER no centro, BG_EDGE na borda."""
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


def place(body, canvas, height_frac, center_y_frac=CENTER_Y_FRAC):
    """Escala o corpo pela altura e devolve (peca, x, y) centrados no quadro."""
    th = max(1, int(canvas * height_frac))
    scale = th / body.height
    piece = body.resize((max(1, int(body.width * scale)), th), Image.LANCZOS)
    x = (canvas - piece.width) // 2
    y = int(canvas * center_y_frac - piece.height / 2)
    return piece, x, y


def compose(body, canvas, height_frac=None):
    """Pixel sobre o gradiente galaxy — a arte-mestra do icone."""
    out = gradient_bg(canvas).convert("RGBA")
    piece, x, y = place(body, canvas, height_frac or body_height_frac(body))
    out.alpha_composite(piece, (x, y))
    return out


def on_transparent(body, canvas, height_frac=None):
    """Pixel sem fundo, para superficies que ja tem o proprio fundo."""
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    piece, x, y = place(body, canvas, height_frac or body_height_frac(body))
    out.alpha_composite(piece, (x, y))
    return out


def face_silhouette(body, size, fill):
    """Silhueta da cabeca com olhos e sorriso VAZADOS, em cinza+alpha.

    Por que os glifos vem da COR e nao do alpha: no master os olhos e o sorriso
    sao pixels ciano OPACOS sobre a tela escura, nao furos no canal alpha. Usar
    so o alpha da cabeca produz um blob sem rosto — foi o que o esboco original
    do plano fazia. Os glifos sao detectados pelo glow e subtraidos da silhueta.

    A limpeza morfologica (abre-fecha) nao e cosmetica: sem ela a silhueta sai
    granulada, porque o limiar de alpha captura pixels de realce semitransparentes
    espalhados pelo render. Verificado renderizando 96px e 48px lado a lado.
    """
    head = body.crop((0, 0, body.width, int(body.height * HEAD_FRAC)))
    px = head.load()

    glyph = Image.new("L", head.size, 0)
    gp = glyph.load()
    for y in range(head.height):
        for x in range(head.width):
            r, g, b, a = px[x, y]
            if a > 200 and g > GLYPH_THRESHOLD and b > GLYPH_THRESHOLD and r < g - 25:
                gp[x, y] = 255

    shape = head.getchannel("A").point(lambda v: 255 if v > ALPHA_THRESHOLD else 0)
    # abre (remove pontinhos soltos) e depois fecha (tapa furos internos)
    shape = (
        shape.filter(ImageFilter.MinFilter(5))
        .filter(ImageFilter.MaxFilter(9))
        .filter(ImageFilter.MinFilter(5))
    )
    glyph = glyph.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.MaxFilter(5))

    alpha = Image.composite(Image.new("L", head.size, 0), shape, glyph)

    tw = max(1, int(size * fill))
    scale = tw / head.width
    th = max(1, int(head.height * scale))
    alpha = alpha.resize((tw, th), Image.LANCZOS)

    layer = Image.new("LA", (size, size), (0, 0))
    white = Image.new("LA", (tw, th), (255, 0))
    white.putalpha(alpha)
    layer.paste(white, ((size - tw) // 2, (size - th) // 2), white)
    return layer


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo-root", default=os.getcwd())
    ap.add_argument("--out-app", required=True)
    ap.add_argument("--out-store", required=True)
    a = ap.parse_args()

    os.makedirs(a.out_app, exist_ok=True)
    os.makedirs(a.out_store, exist_ok=True)

    body = load_body(a.repo_root)
    master = compose(body, MASTER)

    # iOS + tela inicial do iPhone: SEM alpha. A Apple rejeita icone com alpha,
    # e app.json nao declara ios.icon, entao este arquivo E o icone da App Store.
    master.convert("RGB").save(os.path.join(a.out_app, "icon.png"), "PNG", optimize=True)

    # adaptive icon: frente com o Pixel dentro da zona segura, fundo com o gradiente
    fg = on_transparent(body, 512, ADAPTIVE_SAFE * ADAPTIVE_MARGIN)
    fg.save(os.path.join(a.out_app, "android-icon-foreground.png"), "PNG", optimize=True)
    gradient_bg(512).convert("RGBA").save(
        os.path.join(a.out_app, "android-icon-background.png"), "PNG", optimize=True
    )

    # themed icon do Android 13+: fill respeita a zona segura de 66%
    face_silhouette(body, 432, 0.72).save(
        os.path.join(a.out_app, "android-icon-monochrome.png"), "PNG", optimize=True
    )

    # icone pequeno de notificacao: o sistema usa APENAS o alpha como mascara e
    # tinge o resultado. O icon.png nao serve — e sem alpha por exigencia da
    # Apple, e uma mascara opaca vira retangulo solido. Fill maior porque a
    # notificacao nao tem a zona segura de 66% do themed icon.
    face_silhouette(body, 96, 0.92).save(
        os.path.join(a.out_app, "notification-icon.png"), "PNG", optimize=True
    )

    # splash: SEM tile de gradiente. O fundo do splash ja e #03030d; um tile do
    # gradiente desenha um quadrado visivelmente mais claro sobre ele. Verificado
    # renderizando as duas opcoes a 200px sobre o fundo real.
    on_transparent(body, MASTER).save(
        os.path.join(a.out_app, "splash-icon.png"), "PNG", optimize=True
    )

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
        raise SystemExit(
            f"play-icon-512.png tem {kb:.0f}KB, acima do teto de 1024KB do Play"
        )

    print("assets gerados")


if __name__ == "__main__":
    main()
