#!/usr/bin/env python3
"""Converte as capturas cruas do Maestro para a especificacao de screenshot da loja alvo.

O Maestro grava em ~/.maestro/tests/<run>/<flow>/takeScreenshot/shots/, nao no cwd.
Este script normaliza para um diretorio publicavel e RECUSA qualquer arquivo fora da
especificacao, em vez de gravar e deixar o erro para a revisao da loja.

As duas lojas medem coisas diferentes, e por isso `--spec` e obrigatorio:

  play     teto de PROPORCAO (2:1) e faixa de lado — o Play aceita qualquer tamanho
           dentro disso. O Pixel 9 nativo (1080x2424 = 2,244:1) SERIA RECUSADO;
           capturar com `adb shell wm size 1080x1920` (9:16 exato) antes do flow.
  ios-67   TAMANHO EXATO do bucket 6,7" do App Store Connect.
  ios-65   TAMANHO EXATO do bucket 6,5" do App Store Connect.

A diferenca importa: o teto de 2:1 do Play REPROVA os dois buckets de iPhone
(1290x2796 = 2,167:1 e 1242x2688 = 2,164:1). Rodar o spec errado nao degrada a
saida — ele recusa tudo. Foi por isso que a regra virou parametro, e nao um
`if` implicito sobre as dimensoes.

Uso:
    python3 scripts/assets/normalize-screenshots.py --spec play \
        --src "$(ls -td ~/.maestro/tests/*/ | head -1)Store screenshot capture/takeScreenshot/shots" \
        --out docs/store/assets/screenshots

    python3 scripts/assets/normalize-screenshots.py --spec ios-67 \
        --src "$HOME/.maestro/tests/<run-do-iphone-16-plus>/Store screenshot capture/takeScreenshot/shots" \
        --out docs/store/assets/screenshots-ios-67
"""
import argparse
import os
import shutil

from PIL import Image

MIN_SIDE = 320
MAX_SIDE = 3840

# Os tamanhos exatos abaixo sao os que ESTE projeto captura e verificou em
# 2026-07-30 (iPhone 16 Plus e iPhone 11 Pro Max, simulador iOS 26.5). O App
# Store Connect aceita mais tamanhos por bucket e a tabela dele muda entre
# versoes — revalidar na vespera da submissao, como manda a §4 do roadmap de
# lancamento. Acrescentar tamanho aqui exige te-lo medido, nao lembrado.
SPECS = {
    "play": {
        "kind": "ratio",
        "max_ratio": 2.0,
        "min_files": 2,
        "descricao": "Play: teto de proporcao 2:1, minimo de 2 screenshots de telefone",
    },
    "ios-67": {
        "kind": "exact",
        "sizes": {(1290, 2796)},
        "min_files": 1,
        "descricao": 'App Store, bucket 6,7" (iPhone 16 Plus)',
    },
    "ios-65": {
        "kind": "exact",
        "sizes": {(1242, 2688)},
        "min_files": 1,
        "descricao": 'App Store, bucket 6,5" (iPhone 11 Pro Max)',
    },
}


def avaliar(spec, nome, size):
    """Devolve None se o arquivo passa, ou a string do motivo da recusa."""
    w, h = size
    lo, hi = min(size), max(size)
    if lo < MIN_SIDE or hi > MAX_SIDE:
        return f"{nome}: lado fora da faixa {MIN_SIDE}-{MAX_SIDE}"
    if spec["kind"] == "ratio":
        if hi > spec["max_ratio"] * lo:
            return (
                f"{nome}: proporcao {hi / lo:.3f}:1 excede o teto de "
                f"{spec['max_ratio']:.0f}:1 do Play"
            )
        return None
    if (w, h) not in spec["sizes"]:
        aceitos = ", ".join(f"{a}x{b}" for a, b in sorted(spec["sizes"]))
        return f"{nome}: {w}x{h} nao e um tamanho aceito do bucket (aceitos: {aceitos})"
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--spec", required=True, choices=sorted(SPECS), help="loja/bucket alvo")
    ap.add_argument("--src", required=True, help="diretorio com os PNGs crus do Maestro")
    ap.add_argument("--out", required=True, help="diretorio publicavel de destino")
    a = ap.parse_args()

    spec = SPECS[a.spec]
    if not os.path.isdir(a.src):
        raise SystemExit(f"origem inexistente: {a.src}")

    # Avaliar TUDO antes de tocar no destino. A versao anterior apagava o
    # diretorio de saida antes de validar, entao um `--spec` errado destruia a
    # saida boa que ja estava la e so depois falhava.
    candidatos, falhas = [], []
    for name in sorted(os.listdir(a.src)):
        if not name.endswith(".png"):
            continue
        caminho = os.path.join(a.src, name)
        # RGB de proposito: nenhuma das duas lojas aceita alpha em screenshot.
        im = Image.open(caminho).convert("RGB")
        motivo = avaliar(spec, name, im.size)
        if motivo:
            falhas.append(motivo)
        else:
            candidatos.append((name, im))

    if len(candidatos) < spec["min_files"]:
        falhas.append(
            f"{a.spec}: minimo de {spec['min_files']} screenshot(s); aprovados: {len(candidatos)}"
        )

    if falhas:
        raise SystemExit("\n".join(falhas))

    if os.path.isdir(a.out):
        shutil.rmtree(a.out)
    os.makedirs(a.out, exist_ok=True)

    print(f"spec {a.spec} — {spec['descricao']}")
    for name, im in candidatos:
        im.save(os.path.join(a.out, name), "PNG", optimize=True)
        lo, hi = min(im.size), max(im.size)
        print(f"ok {name} {im.size[0]}x{im.size[1]} ({hi / lo:.3f}:1)")


if __name__ == "__main__":
    main()
