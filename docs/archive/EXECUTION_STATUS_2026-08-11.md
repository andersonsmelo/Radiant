# Radiant — Execution Status (2026-08-11)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-10.md`](EXECUTION_STATUS_2026-08-10.md)** como estado
canônico. O snapshot anterior continua sendo a evidência detalhada do gate
operacional H3 e da medição de partida do kernel.

## O que mudou hoje

O dia foi sobre o **mascote**. O Pixel ganhou rosto desenhado, animado e capaz
de mudar de expressão, mais o serviço que decide qual cara e qual frase ele usa
em cada momento do produto. Cinco das sete tasks do plano entraram; **as Tasks 6
e 7 — a fiação na Home e no quiz — não foram feitas**, então nada disso ainda
aparece para o usuário: hoje toda tela renderiza a expressão padrão `neutro`.

Nenhum build, OTA, submit, push ou publicação. Produção permanece `off` e
`1.3.1 (7)` está intocada.

### Dois defeitos que estavam em produção e saíram

**Os anéis orbitais e as bolinhas flutuantes.** O `PixelIllustration` desenhava
duas camadas decorativas sobre o PNG do mascote. Uma delas — os "olhos" do
`PixelFace` antigo — renderizava **acima da cabeça**, como dois círculos ciano
chapados soltos no ar, e uma barra de scan cruzava o rosto. A causa: a camada de
rosto se posicionava com `top: 22%` do **frame**, enquanto a imagem tem altura
`dimension × 1.48` dentro de um frame de `× 1.38` e transborda `0.05 × dimension`
para cima. Passou por lint, typecheck, jest, `visual:qa` e os seis contratos sem
que nada acusasse, porque é geometria de runtime.

**O rosto duplicado.** O `pixel_core.png` tinha rosto pintado e o componente
desenhava um segundo por cima. O asset agora é `pixel_core_faceless.png`, gerado
do próprio render por reconstrução 2D da tela a partir das margens limpas — o
corpo, o jaleco e o bezel permanecem idênticos ao pixel.

### O que entrou, run por run

| run | commit | entrega |
| --- | --- | --- |
| `run-1786465670426-f99a9e9b` | `73a542c` | remoção dos anéis orbitais |
| `run-1786469000539-7e8e5caa` | `e0314ce` | spec do desenho |
| `run-1786469428517-008c2837` | `e0314ce` | plano de implementação |
| `run-1786470337499-80ab4771` | `81d72f8` | asset sem rosto + `PIXEL_SCREEN` |
| `run-1786472313298-f5972648` | `b4d83e7` | catálogo de sete expressões |
| `run-1786472840244-338d0228` | `65b2eae` | `PixelFace` ancorado à imagem |
| `run-1786482791576-1351f78f` | `1437ca8` | animação, piscada, easing |
| `run-1786488659339-7a6b8981` | `4eca192` | serviço `PixelMood` |

Cada run fechou com `validate → step finish → [memory write] → run close`, 13
validadores, nenhum reprovado.

## Contratos novos, e por que dois deles nasceram cegos

Três contratos entraram ou mudaram, e **dois precisaram de uma segunda passada
porque a primeira versão não pegava o defeito que ela nomeava**:

- **`pixel-screen-geometry-contract`** — lê o PNG comitado e confere
  `PIXEL_SCREEN` contra a caixa escura real. Trocar o asset por um de
  enquadramento diferente falha aqui em vez de aparecer como olho flutuante.
- **`pixel-face-anchor-contract`** — a primeira versão proibia só
  `top: '22%'` em string. A linha que causou o defeito era
  `top: Math.round(dimension * 0.22)`, numérica: o guarda teria ficado verde
  sobre o próprio bug. Agora proíbe o identificador `dimension` dentro de
  `PixelFace.tsx`, e a proibição foi **provada vermelha** contra a linha
  original.
- **`reanimated-easing-contract`** — passou a cobrir os dois arquivos do
  mascote. A assertiva antiga só exigia que `easing:` aparecesse **uma vez** no
  arquivo; com 15 e 11 chamadas de `withTiming`, catorze poderiam perder a curva
  e ele continuaria verde. Agora percorre cada call site, conta constantes de
  spread como portadoras só se a própria constante tiver easing, e nomeia a
  chamada infratora. Provado vermelho com 1 de 15.

O `PixelIllustration` tinha **quinze** `withTiming` sem easing nenhum, todos
lineares. Todos ganharam curva.

## O que NÃO está feito

- **Task 6** — disparar os momentos na Home e a entrega de bastão do balão.
- **Task 7** — contadores de sessão no quiz e a frase no título do feedback.
- **Follow-up:** nenhum teste comportamental exercita o `PixelFace`. Piscada
  como multiplicador, cleanup do timer, bypass sob *reduced motion* e o
  crossfade arco/pílula são hoje verificados só por leitura de código. Exige
  arquivo novo, logo run próprio.
- **Backlog:** o *reduced motion* usa o hook booleano, e o docstring dele
  recomenda a variante com `resolved` para agendadores como `setTimeout`. A
  janela de corrida é real mas curta — no máximo uma animação de menos de um
  segundo logo após o mount, só para quem tem a preferência ligada. A correção é
  cross-cutting e atinge o `PixelIllustration` também.

## Duas limitações conhecidas, registradas onde foram descobertas

O teste de data malformada do `PixelMood` **não prova que a guarda
`Number.isNaN` é load-bearing**: removê-la não deixa o teste vermelho, porque
`NaN >= 3` é `false` e a aritmética cai no mesmo retorno por acidente. O teste
afirma o comportamento certo; não isola a guarda.

Remover o `.catch` da escrita no AsyncStorage **derruba o worker** com exceção
não capturada em vez de produzir um `it()` vermelho. Neste setup
jest-circus/Node 24 unhandled rejection mata o processo — o sinal existe, só não
é limpo.

## Uma observação sobre o processo

Das cinco revisões de task, **quatro acharam defeito no plano, não no código
entregue**: o contrato de âncora cego, o de easing que não escalava, um limite
de teste que não podia falhar, e duas guardas defensivas sem teste. Os
implementadores transcreveram fielmente o que o plano mandava. O elo fraco do
ciclo foi a autoria do plano, não a execução — e o que pegou os quatro foi
sempre a mesma pergunta feita à revisão: *essa assertiva consegue falhar?*

## Ambiente

O painel de simulador dentro do Claude Desktop está **desativado por rollout
flag** (`iosSimulator: unsupported` no manifesto do app). O fluxo que funciona é
entrada pelo MCP e captura por `xcrun simctl io <udid> screenshot`. Verificação
visual de mudança no mascote exige **recorte ampliado da região alterada** —
captura de tela inteira na escala do device já escondeu este exato defeito uma
vez.
