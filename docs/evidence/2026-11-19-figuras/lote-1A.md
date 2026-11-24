# Lote 1A de figuras importadas (2026-11-19)

No lote, com prévia dos alvos em `lote-1A/`: `cranio-de-perfil-ossos`, `esqueleto-axial-apendicular`,
`articulacao-sinovial` e `linhas-do-cranio`.

## Fora do lote

- `seios-da-face` (perfil) e `seios-da-face-frente` (recorte da frente): saíram do app em 2026-11-19. A arte era
  "Paranasal sinuses" (https://commons.wikimedia.org/wiki/File:Paranasal_sinuses.svg). O campo de permissão da página
  diz CC BY 2.5, mas os seios foram desenhados por outro autor, que declara CC BY-SA 3.0 na mesma página; a obra
  derivada carrega a parte CC BY-SA, e a regra do projeto é nunca usar CC BY-SA. Conferido em 2026-11-19. A aula
  m25-04 voltou ao que era antes (diagrama de código `seios-da-face`, sem arte importada).
- `osso-longo`: não há arte vetorial completa com licença aceita que tenha a placa de crescimento; a única inteira
  é fraca. Continua o diagrama de código.

## Visto no simulador de iPhone

Simulador "Radiant F7" (iOS 26.5), dev client do Radiant com Metro local, em 2026-11-20 entre 00h44 e 00h48 (hora local do simulador). Roteiros de `radiant-app/.maestro/figuras/` com o Maestro, um por vez. Todas as imagens estão em `capturas/`.

- `ios-cranio-de-perfil-ossos-m25-aula01-passo4.jpg` (rotular): crânio de perfil inteiro, seis selos numerados inteiros, cada um sobre o osso (1 frontal, 2 parietal, 3 occipital, 4 temporal, 5 maxila, 6 mandíbula). Nada coberto além do osso sob o selo.
- `ios-cranio-de-perfil-ossos-m25-aula01-passo6.jpg` (tocar em regiões): figura inteira; os selos 3 (occipital) e 4 (mandíbula) aparecem inteiros. O corte do selo em região baixa, visto no 18h35, está resolvido neste passo. A região do occipital (3) mostra só o selo, sem retângulo visível.
- `ios-esqueleto-axial-apendicular-m18-aula01-passo2.jpg` (conceito, sem marcadores): esqueleto de frente, eixo em azul e membros e cinturas em âmbar, legível no fundo escuro. As pernas descem além da moldura visível e ficam cortadas pela barra "Continuar" (a figura pede rolagem).
- `ios-esqueleto-axial-apendicular-m18-aula01-passo5.jpg` (tocar na região): selos 1 a 4 inteiros. Os selos cobrem boa parte das regiões de 1, 3 e 4, e só um arco delas aparece. A moldura corta as pernas na altura dos joelhos.
- `ios-articulacao-sinovial-m18-aula04-passo4.jpg` (rotular): corte da articulação, selos 1 (osso), 2 (cápsula, na borda esquerda) e 3 (espaço entre as cartilagens) inteiros. A moldura corta as pontas dos dois ossos em cima e embaixo.
- `ios-linhas-do-cranio-m25-aula02-passo2.jpg` (conceito, sem marcadores): perfil com as linhas orbitomeatal e infraorbitomeatal e frente com a interpupilar e o plano sagital, legíveis; a metade de baixo das duas figuras fica sob a barra "Continuar" (pede rolagem).
- `ios-linhas-do-cranio-m25-aula02-passo4.jpg` (rotular): três selos inteiros: 1 no meato, 2 na ponta direita da interpupilar, 3 no plano sagital. O selo 2 cobre a pupila direita e o fim da linha.

Contorno de roteiro: o `m25-aula-01.yaml` reprova no passo 4 (rotular). O `scrollUntilVisible ... direction: UP` dos pontos 1 a 4 acha o ponto sob o cabeçalho fixo, não rola, e o toque cai fora da tela (só os pontos 5 e 6 recebem ficha). O passo 4 só passou com uma cópia fora do repositório (ficha primeiro, depois dois `swipe: DOWN` e toque por percentual do ponto). O mesmo defeito deve afetar os outros roteiros de rotular, que passaram porque os pontos já estavam visíveis. Nada foi editado no repositório.

Não visto: o leito (M25.05, fora do pedido); passos que não são os listados (m18-01 passo 5 e m25-02 passo 4 são os de alvos; os demais passos de rotular/tocar não foram abertos); Android; o som; resposta errada e feedback. As capturas são as do Maestro, sem segunda captura idêntica separada: o passo 4 do crânio saiu igual nas duas execuções.
