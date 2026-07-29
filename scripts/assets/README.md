# Geração dos assets de ícone e de loja

Três scripts, todos determinísticos e versionados junto com a saída que produzem —
eles existem para que a geração seja auditável e reproduzível, não para rodar no CI.

| Script | Produz |
| --- | --- |
| `build-icons.py` | os oito ícones do app, a partir da arte-mestra |
| `build-feature-graphic.py` | o feature graphic 1024×500 da ficha do Play |
| `normalize-screenshots.py` | os screenshots de loja, a partir das capturas cruas do Maestro |

Os dois últimos e o passo de captura estão documentados em
[`docs/store/ASSETS_DE_LOJA.md`](../../docs/store/ASSETS_DE_LOJA.md), com as
armadilhas de emulador medidas em 2026-07-29.

## build-icons.py

Produz **todos** os ícones do Radiant a partir de uma única arte-mestra.

## Pré-requisito

Python 3 com [Pillow](https://pillow.readthedocs.io/). Não há mais nenhuma
dependência, e nada de rede.

```bash
python3 -c "import PIL; print(PIL.__version__)"   # verificado com 11.3.0
```

Se faltar: `python3 -m pip install --user Pillow`.

## Rodar

Da raiz do repositório:

```bash
python3 scripts/assets/build-icons.py --out-app radiant-app/assets/images --out-store docs/store/assets
```

## O que sai

| Arquivo | Tamanho | Alpha | Superfície |
| --- | --- | --- | --- |
| `icon.png` | 1024² | **não** | App Store e tela inicial do iPhone |
| `android-icon-foreground.png` | 512² | sim | camada da frente do adaptive icon |
| `android-icon-background.png` | 512² | sim | camada de fundo do adaptive icon |
| `android-icon-monochrome.png` | 432² | sim | themed icon do Android 13+ |
| `notification-icon.png` | 96² | sim | ícone pequeno na barra de status |
| `splash-icon.png` | 1024² | sim | splash de abertura |
| `favicon.png` | 48² | sim | web |
| `play-icon-512.png` | 512² | sim | ficha do Google Play (≤ 1024 KB) |

O contrato `radiant-app/scripts/icon-assets-contract.test.mjs` trava dimensão,
política de alpha e peso de cada um.

## Decisões embutidas no script, e por quê

Cada uma foi tomada **medindo ou renderizando**, não por preferência. Se você
mudar um parâmetro, refaça a observação correspondente.

- **Enquadramento: 62% da largura, como a spec pede — com a altura derivada.**
  O Pixel é retrato (L/A = 0,725 medido), então 62% de largura projetam **85,6%
  de altura**. A altura é a dimensão que de fato restringe, mas ela é **calculada
  a partir da regra da spec** (`body_height_frac`), não escrita como um segundo
  número: dois números para o mesmo enquadramento divergem no primeiro dia em que
  a arte-fonte mudar de proporção — foi exatamente o que aconteceu aqui antes de
  ser corrigido.

  A escolha foi feita **renderizando as duas leituras nos tamanhos reais** — 1024,
  180 sob a squircle do iPhone, 120, 80 e 48px. Uma versão menor (78% de altura)
  respirava melhor a 360px e perdia legibilidade do rosto a 48px; 360px é um
  tamanho em que ninguém vê um ícone de app. A antena não é cortada pela máscara.
- **Foreground do adaptive icon limitado pela zona segura.** São 72dp visíveis de
  108dp, ou 66,7%. Qualquer coisa maior é ícone que o launcher corta — e o corte
  só aparece em device, depois que já parece pronto.
- **Alpha com regras opostas no mesmo lote.** `icon.png` sem alpha porque a Apple
  rejeita; `notification-icon.png` com o alpha *sendo* a forma, porque o Android
  usa só o canal alpha como máscara de silhueta. Os requisitos são mutuamente
  exclusivos: nenhum arquivo serve às duas superfícies.
- **Os glifos do rosto vêm da cor, não do alpha.** No master, olhos e sorriso são
  pixels ciano **opacos** sobre a tela escura — não são furos no alpha. Extrair a
  silhueta só do alpha produz um blob sem rosto. O limiar `GLYPH_THRESHOLD = 235`
  foi encontrado renderizando máscaras: abaixo disso ela captura o reflexo do
  bezel da tela junto com os glifos.
- **Limpeza morfológica na silhueta.** Sem o abre-fecha a silhueta sai granulada,
  porque o limiar de alpha pega pixels de realce semitransparentes espalhados
  pelo render. Comparado a 96px e 48px lado a lado antes de entrar aqui.
- **Splash sem tile de gradiente.** O fundo do splash já é `#03030d`; um tile do
  gradiente desenha um quadrado visivelmente mais claro sobre ele. Verificado
  renderizando as duas opções a 200px sobre o fundo real.

## O que este script não garante

Ele garante **conformidade de especificação**, não **adequação de arte**. Não
pegaria uma grade de construção embutida no render, que foi exatamente o defeito
que originou este pipeline. O que pega arte errada é evidência em device somada a
revisão humana — Task 6 do plano.
