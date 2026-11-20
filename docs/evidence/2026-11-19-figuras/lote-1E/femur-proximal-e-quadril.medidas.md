# Medidas da composição (femur-proximal-e-quadril)

> Os scripts citados em "Como repetir" estão em `scripts/content/figuras/receitas/femur-proximal-e-quadril.<nome>` (`partes.mjs`, `medir-final.py`, `render.sh`, `shenton.sh`); a fonte se regera com `receitas/femur-proximal-e-quadril.mjs`.

Todas em **unidades da fonte** (o `viewBox` da fonte é `2700 2300 1700 1275`; 1 un = 1 px nas renderizações de medida; o quadro 320 x 240 é a fonte inteira em escala 0,1882). Medidas por `medir-final.py` sobre `pelve.png` e `femur.png` (gerados por `partes.mjs` + Chrome, `render.sh`, origem do recorte em 3100,2300). Fêmur: `translate(3415 2610) scale(-1.05 1.05) translate(-2889 -396)`; o espelhamento e a escala são os já aprovados, só a translação mudou (de `translate(3540 2730)` para `translate(3415 2610)`, isto é, 125 un para fora e 120 un para cima).

## (a) Cabeça no lugar do acetábulo, fora do forame
- Cabeça: círculo ajustado por mínimos quadrados ao contorno externo (silhueta cheia da arte ciano) no arco livre, ângulos de -100° a +45° (a cabeça do autor é levemente oblonga e o lado do colo fica de fora do ajuste): **centro (3390,4; 2625,7), raio 209,8**.
- Borda medial da cabeça: x = centro + raio = **3600,3**.
- Forame obturado (componente de fundo fechado da pelve, medido sem o fêmur): borda lateral em **x = 3637** (y ≈ 2817,5), teto no ponto mais alto em y = 2700.
- **Distância da borda medial da cabeça à borda lateral do forame: 36,7 un** (0,087 do diâmetro da cabeça), a cabeça do lado de fora. Folga mínima, em linha reta, entre o círculo da cabeça e o forame: **71,1 un** (no canto lateral do teto).
- No arranjo reprovado (`translate(3540 2730)`) a borda medial da cabeça avançava cerca de 90 un sobre o forame.

## (b) Linha de Shenton contínua
Pontos (na fonte):
- **A** (púbis, canto lateral do teto do forame): (3662; 2711)
- **B** (púbis, teto do forame mais medial): (3862; 2740)
- **N** (colo, borda inferomedial da silhueta do fêmur, 1,5 raio abaixo do centro da cabeça, y = 2941): (3299; 2941)

Arco: círculo por A, B e N, **centro (3697,7; 3168,8), raio 459,2**. Desvio (distância radial) do contorno real em relação a ele:
- teto do forame entre A e B (passo de 4 un): **máximo 12,5 un**;
- borda inferomedial do colo, da base da cabeça até 30 un abaixo de N: **máximo 6,4 un**.
Na faixa entre a base da cabeça e o teto (a junta) o contorno do autor não existe: o arco atravessa a parte inferomedial da cabeça, como a linha de Shenton atravessa a junta na radiografia. Esse trecho não é contorno medido.
- No arranjo reprovado, a borda inferomedial do colo ficava cerca de 217 un abaixo da margem superior do forame.

## Como repetir
```
cd <WS>/femur-proximal-e-quadril
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
TX=3415 TY=2610 node partes.mjs                     # pelve.svg e femur.svg, só um fundo magenta
./render.sh pelve.svg pelve.png 900 700 ; ./render.sh femur.svg femur.png 900 700   # Chrome
uv run --with pillow --with numpy --with scipy python -I medir-final.py 3415 2610  # imprime e grava medidas.json
./shenton.sh                                         # shenton.png: a composição com o arco (rosa tracejado), os 3 pontos e o círculo da cabeça (branco tracejado)
```
(Os candidatos A e B são escolhidos por coluna x = 3662 e 3862; N por y = centro + 1,5 raio. Com outra translação os números mudam: foi o que se varreu, dx de -60 a +60 e dy de -120 a +40 em passos de 10 a 20; o desvio do colo sobe de ~6 para ~50 un com o fêmur 60 un mais baixo, e a cabeça passa sobre o forame com 60 un mais para dentro.)

## O que a medida não prova
- O centro do acetábulo: a arte da pelve não o desenha. A posição foi decidida pelo forame e por Shenton, não por um círculo do acetábulo.
- Vista (anterior ou posterior) do fêmur do autor: o desenho tem a fossa trocantérica e a linha intertrocantérica como traços finos; o espelhamento a trata como fêmur direito visto de frente.
- Anatomia por profissional: não houve; a conferência é por medida e por fontes abertas (LITFL, Radiology Masterclass para Shenton).
