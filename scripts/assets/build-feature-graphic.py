#!/usr/bin/env python3
"""Gera o feature graphic 1024x500 da ficha do Google Play.

Fonte: radiant-app/assets/brand/pixel-master.png (a mesma arte-mestra dos icones).
Fonte tipografica: Sora, ja dependencia do app (@expo-google-fonts/sora).
Copy: docs/store/textos-loja-pt-BR.md — nao inventar claim aqui.

Uso:
    python3 scripts/assets/build-feature-graphic.py --out docs/store/assets
"""
import os
from PIL import Image, ImageDraw, ImageFont

import argparse

REPO = os.getcwd()
FONTS_REL = "radiant-app/node_modules/@expo-google-fonts/sora"

W, H = 1024, 500
BG_CENTER = (13, 18, 48)
BG_EDGE = (7, 9, 28)

# O Play recorta para 16:9 em algumas superficies: 500*16/9 = 888 de largura,
# comendo (1024-888)/2 = 68 px de cada lado. Tudo que importa fica dentro disso.
CROP_INSET = (W - int(H * 16 / 9)) // 2
TEXT_X = CROP_INSET + 48


def font(weight, size):
    return ImageFont.truetype(os.path.join(REPO, FONTS_REL, weight, f"Sora_{weight}.ttf"), size)


def gradient():
    im = Image.new("RGB", (W, H), BG_EDGE)
    d = ImageDraw.Draw(im)
    # elipse alongada, ancorada onde o Pixel fica, para o brilho nascer atras dele
    cx, cy = int(W * 0.72), int(H * 0.52)
    steps = 110
    for i in range(steps, 0, -1):
        t = i / steps
        rx, ry = int(W * 0.62 * t), int(H * 0.95 * t)
        col = tuple(
            int(round(BG_EDGE[k] + (BG_CENTER[k] - BG_EDGE[k]) * (1 - t) ** 1.6))
            for k in range(3)
        )
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=col)
    return im


def main():
    global REPO
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo-root", default=os.getcwd())
    ap.add_argument("--out", required=True, help="docs/store/assets")
    a = ap.parse_args()
    REPO = a.repo_root
    out = a.out
    os.makedirs(out, exist_ok=True)

    src = Image.open(os.path.join(REPO, "radiant-app/assets/brand/pixel-master.png")).convert("RGBA")
    body = src.crop(src.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox())

    im = gradient().convert("RGBA")

    th = int(H * 0.86)
    scale = th / body.height
    pixel = body.resize((int(body.width * scale), th), Image.LANCZOS)
    px_x = 620  # dentro da zona segura do recorte 16:9 (68..956)
    im.alpha_composite(pixel, (px_x, H - pixel.height - int(H * 0.03)))

    d = ImageDraw.Draw(im)
    d.text((TEXT_X, 158), "Radiant", font=font("700Bold", 92), fill=(255, 255, 255))
    d.text((TEXT_X, 266), "Radiologia com método", font=font("600SemiBold", 34),
           fill=(150, 196, 255))
    d.text((TEXT_X, 324), "Trilha guiada · quizzes · revisão espaçada",
           font=font("400Regular", 23), fill=(168, 175, 205))
    d.text((TEXT_X, 360), "Funciona offline, sem conta.",
           font=font("400Regular", 23), fill=(168, 175, 205))

    # O texto nao pode invadir o Pixel. Medido, nao conferido no olho: com 25px
    # a linha da trilha batia 509px e passava por cima do braco dele.
    limite = px_x - 28
    for txt, weight, size in [
        ("Radiant", "700Bold", 92),
        ("Radiologia com método", "600SemiBold", 34),
        ("Trilha guiada · quizzes · revisão espaçada", "400Regular", 23),
        ("Funciona offline, sem conta.", "400Regular", 23),
    ]:
        right = TEXT_X + d.textbbox((0, 0), txt, font=font(weight, size))[2]
        if right > limite:
            raise SystemExit(f"texto invade o Pixel: {txt!r} termina em {right}px, limite {limite}px")

    # RGB de proposito: o Play PROIBE alpha no feature graphic.
    im.convert("RGB").save(os.path.join(out, "feature-graphic.png"), "PNG", optimize=True)

    print(f"inset de recorte: {CROP_INSET}px | texto comeca em x={TEXT_X}")


if __name__ == "__main__":
    main()
