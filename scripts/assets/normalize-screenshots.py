#!/usr/bin/env python3
"""Converte as capturas cruas do Maestro para a especificacao de screenshot do Play.

O Maestro grava em ~/.maestro/tests/<run>/<flow>/takeScreenshot/shots/, nao no cwd.
Este script normaliza para docs/store/assets/screenshots e RECUSA qualquer arquivo
fora da especificacao, em vez de gravar e deixar o erro para a revisao da loja.

Uso:
    python3 scripts/assets/normalize-screenshots.py \
        --src "$(ls -td ~/.maestro/tests/*/ | head -1)Store screenshot capture/takeScreenshot/shots" \
        --out docs/store/assets/screenshots
"""
import argparse
import os
import shutil

from PIL import Image

# Teto do Play: "maximum dimension can't be more than twice as long as the minimum".
# A resolucao nativa do emulador Pixel 9 (1080x2424 = 2,244:1) SERIA RECUSADA —
# capturar com `adb shell wm size 1080x1920` (9:16 exato) antes de rodar o flow.
MAX_RATIO = 2.0
MIN_SIDE = 320
MAX_SIDE = 3840


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--src", required=True, help="diretorio com os PNGs crus do Maestro")
    ap.add_argument("--out", required=True, help="docs/store/assets/screenshots")
    a = ap.parse_args()

    if not os.path.isdir(a.src):
        raise SystemExit(f"origem inexistente: {a.src}")

    if os.path.isdir(a.out):
        shutil.rmtree(a.out)
    os.makedirs(a.out, exist_ok=True)

    falhas = []
    gravados = 0
    for name in sorted(os.listdir(a.src)):
        if not name.endswith(".png"):
            continue
        # RGB de proposito: o Play nao aceita alpha em screenshot.
        im = Image.open(os.path.join(a.src, name)).convert("RGB")
        lo, hi = min(im.size), max(im.size)
        if hi > MAX_RATIO * lo:
            falhas.append(f"{name}: proporcao {hi/lo:.3f}:1 excede o teto de {MAX_RATIO:.0f}:1 do Play")
            continue
        if lo < MIN_SIDE or hi > MAX_SIDE:
            falhas.append(f"{name}: lado fora da faixa {MIN_SIDE}-{MAX_SIDE}")
            continue
        im.save(os.path.join(a.out, name), "PNG", optimize=True)
        print(f"ok {name} {im.size[0]}x{im.size[1]} ({hi/lo:.3f}:1)")
        gravados += 1

    if gravados < 2:
        falhas.append(f"o Play exige no minimo 2 screenshots de telefone; gravados: {gravados}")

    if falhas:
        raise SystemExit("\n".join(falhas))


if __name__ == "__main__":
    main()
