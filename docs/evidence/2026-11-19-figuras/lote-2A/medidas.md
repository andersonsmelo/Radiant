# Lote 2A: medidas por cor sob as áreas do app

Data das medidas: 2026-11-20. Nove interações usam as seis figuras novas; todas estão abaixo. Método e limites no fim.

**Como ler.** Na seção da área de toque, cada percentual é da **área de toque** que o app usa (`hotspotTouch.ts`, quadro de 280 x 210 pt: a região ou o ponto, ampliada em torno do centro até 44 pt por eixo; o selo novo não a muda). Na seção do selo e do marcador, é do **objeto** inteiro. O "objeto" é a peça nomeada pelo alvo; "fundo" é o que não é peça nenhuma (nas cenas da m17, a parede e o piso da sala; no tubo, nada desenhado); "outras peças" são as demais peças da cena que aparecem na área. As peças são medidas uma a uma, então os percentuais podem somar mais de 100 % (o vidro do tubo é uma casca transparente sobre o conjunto todo).

**Regra do brief do integrador:** a área da resposta certa não pode mostrar mais da estrutura de uma resposta errada do que da própria estrutura. Resultado: em nenhuma das três interações de hotspot a área de uma resposta certa mostra o objeto de uma resposta errada (m17-04: apoio e mesa mostram só receptor e fundo; m17-06: botão e telefone, "nenhum"; m19-06: ânodo mostra só os terminais metálicos da própria haste e o vidro). O contrário existe e está dito: no m19-06, a área da **Janela de saída** (errada) mostra 20,8 % de ânodo (a borda baixa do disco), então tocar na ponta de baixo do disco cai na janela; as áreas de toque não se sobrepõem (o verificador confere) e a região do ânodo termina em y = 0,35, acima da área da janela.

## Área de toque (não mudou com o selo novo)

## m17-01 i2 (label) conferencia-de-identidade

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (sala) | o resto (maca, paciente, outras peças) |
|---|---|---|---|
| L1 Pulseira no punho (0.3223; 0.4966) | 7,7 % | 2,3 % | 90 % |
| L2 Pedido impresso (0.4862; 0.3921) | 30,4 % | 56,6 % | 13 % |
| L3 Registro na tela (0.8581; 0.3293) | 80,5 % | 17 % | 2,5 % |
| L4 Fala do paciente (cabeça) (0.1600; 0.3984) | 12,8 % | 30,4 % | 56,8 % |

## m17-04 i2 (hotspot) pontos-de-contato-da-sala

| alvo (nome declarado) | certa | objeto na área de toque | fundo (sala) na área | peças que não são o objeto, na área |
|---|---|---|---|---|
| 1 Maçaneta da porta | não | 16,8 % | 0 % | porta 80,2 % |
| 2 Apoio do receptor vertical | sim | 12 % | 52,4 % | receptor 32 % |
| 3 Mesa de exame | sim | 52 % | 44,9 % | receptor 0,5 % |
| 4 Manopla do tubo | não | 10,8 % | 69,2 % | tubo 17,1 % |
| 5 Teclado do comando | não | 24,5 % | 32,8 % | comando 37,9 % |

## m17-05 i2 (label) itens-de-emergencia-da-sala

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (sala) | o resto (maca, paciente, outras peças) |
|---|---|---|---|
| L1 Porta de saída (0.1253; 0.4532) | 99 % | 0 % | 1 % |
| L2 Carrinho de emergência (0.3229; 0.6993) | 95,5 % | 3,6 % | 0,9 % |
| L3 Saída de oxigênio (0.5245; 0.4698) | 96,6 % | 2,8 % | 0,6 % |
| L4 Botão de chamada (0.6952; 0.4311) | 90 % | 8,4 % | 1,6 % |
| L5 Telefone da parede (0.8670; 0.5641) | 83,6 % | 16,2 % | 0,2 % |

## m17-06 i2 (hotspot) itens-de-emergencia-da-sala

| alvo (nome declarado) | certa | objeto na área de toque | fundo (sala) na área | peças que não são o objeto, na área |
|---|---|---|---|---|
| 1 Porta de saída | não | 87,3 % | 11,7 % | nenhum |
| 2 Carrinho de emergência | não | 59,6 % | 31,4 % | nenhum |
| 3 Saída de oxigênio | não | 83 % | 15,1 % | nenhum |
| 4 Botão de chamada | sim | 50,6 % | 47,3 % | nenhum |
| 5 Telefone da parede | sim | 69,5 % | 29,2 % | nenhum |

## m19-03 i2 (label) tubo-raios-x

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (nada desenhado) | outras peças na área |
|---|---|---|---|
| L1 Cátodo com filamento (0.339; 0.372) | 42,6 % | 0 % | elétrons 0,9 %; vidro 100 % |
| L2 Ânodo (0.580; 0.200) | 74,6 % | 0 % | vidro 100 % |
| L3 Janela de saída (0.537; 0.508) | 41,6 % | 4,8 % | ânodo 6,7 %; vidro 35,1 %; feixe 68,6 % |
| L4 Ampola de vidro (0.350; 0.160) | 77,5 % | 22,5 % | nenhuma |

## m19-06 i2 (hotspot) tubo-raios-x

| alvo (nome declarado) | certa | área de toque (px do quadro de 640) | objeto na área | fundo (nada desenhado) | outras peças na área |
|---|---|---|---|---|---|
| 1 Cátodo com filamento | não | 101 x 116 | 71 % | 8,3 % | vidro 83,8 % |
| 2 Ânodo | sim | 293 x 127 | 53,4 % | 16,2 % | terminais 4,4 %; vidro 77 % |
| 3 Janela de saída | não | 101 x 101 | 42,7 % | 6,4 % | ânodo 20,8 %; elétrons 2 %; vidro 58,2 %; feixe 44,2 % |
| 4 Ampola de vidro | não | 120 x 101 | 77,9 % | 22,1 % | nenhuma |

## Quanto o selo e o marcador escondem, com a posição nova (E11)

Posições lidas de `badgeBox` e `labelBadgeBox` (`hotspotTouch.ts`, commit 4bd7adce): o selo de tocar (36 x 24 pt) fica fora da região (acima, senão abaixo, à esquerda, à direita); o ponto do rotular tem 12 pt e o número vai num selo de 36 x 24 pt acima e à direita do ponto (ou na posição livre seguinte). "Antes" é a posição da versão anterior (selo dentro da região, marcador de 28 pt sobre o ponto). "Outro objeto cobrado" é o objeto de outro alvo do mesmo item; "outras peças", o resto da cena (porta, receptor, vidro etc., só o que passa de 1 %). Percentuais do objeto inteiro.

### m17-01 i2 (rotular) conferencia-de-identidade

| ponto | marcador antes (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto | selo cobre OUTRO objeto cobrado | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Pulseira no punho | 100 % | 81,8 % | 0 % | Fala do paciente (cabeça) 20,5 % | paciente 20,5 % |
| L2 Pedido impresso | 39,6 % | 12,1 % | 0 % | nenhum | profissional 10,4 % |
| L3 Registro na tela | 43,8 % | 8,4 % | 16 % | nenhum | nenhum |
| L4 Fala do paciente (cabeça) | 9,3 % | 2 % | 0 % | nenhum | nenhum |

### m17-04 i2 (hotspot) pontos-de-contato-da-sala

| alvo | certa | selo antes (dentro da região) | selo agora esconde do próprio objeto | cobre OUTRO objeto cobrado do item | cobre outras peças da cena |
|---|---|---|---|---|---|
| 1 Maçaneta da porta | não | 100 % | 0 % | nenhum | porta 22,4 % |
| 2 Apoio do receptor vertical | sim | 62,2 % | 2 % | nenhum | receptor 19,1 % |
| 3 Mesa de exame | sim | 21,3 % | 0 % | nenhum | nenhum |
| 4 Manopla do tubo | não | 100 % | 0 % | nenhum | tubo 48,4 % |
| 5 Teclado do comando | não | 73 % | 0 % | nenhum | comando 23,4 % |

### m17-05 i2 (rotular) itens-de-emergencia-da-sala

| ponto | marcador antes (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto | selo cobre OUTRO objeto cobrado | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Porta de saída | 15,4 % | 2,8 % | 7,9 % | nenhum | nenhum |
| L2 Carrinho de emergência | 30,6 % | 5,4 % | 10,8 % | nenhum | nenhum |
| L3 Saída de oxigênio | 37,6 % | 6,7 % | 11,5 % | Botão de chamada 18,9 % | botao 18,9 % |
| L4 Botão de chamada | 42,6 % | 8,2 % | 11,3 % | nenhum | nenhum |
| L5 Telefone da parede | 34,5 % | 6,4 % | 14,6 % | Botão de chamada 19,5 % | botao 19,5 % |

### m17-06 i2 (hotspot) itens-de-emergencia-da-sala

| alvo | certa | selo antes (dentro da região) | selo agora esconde do próprio objeto | cobre OUTRO objeto cobrado do item | cobre outras peças da cena |
|---|---|---|---|---|---|
| 1 Porta de saída | não | 10,2 % | 0 % | nenhum | nenhum |
| 2 Carrinho de emergência | não | 14,5 % | 0 % | nenhum | nenhum |
| 3 Saída de oxigênio | não | 35,1 % | 0 % | nenhum | nenhum |
| 4 Botão de chamada | sim | 40,3 % | 0 % | nenhum | nenhum |
| 5 Telefone da parede | sim | 29,6 % | 0 % | nenhum | nenhum |

### m19-03 i2 (rotular) tubo-raios-x

| ponto | marcador antes (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto | selo cobre OUTRO objeto cobrado | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Cátodo com filamento | 22,4 % | 6,4 % | 0 % | Ampola de vidro 8,9 % | vidro 5,4 % |
| L2 Ânodo | 15,8 % | 3 % | 3,4 % | nenhum | vidro 5,4 % |
| L3 Janela de saída | 39,9 % | 9 % | 29,7 % | nenhum | ânodo 7,6 %; vidro 4,5 % |
| L4 Ampola de vidro | 29,6 % | 6,5 % | 10,1 % | nenhum | nenhum |

### m19-06 i2 (hotspot) tubo-raios-x

| alvo | certa | selo antes (dentro da região) | selo agora esconde do próprio objeto | cobre OUTRO objeto cobrado do item | cobre outras peças da cena |
|---|---|---|---|---|---|
| 1 Cátodo com filamento | não | 44,8 % | 0 % | Ampola de vidro 19,8 % | vidro 5,3 % |
| 2 Ânodo | sim | 15,2 % | 0 % | Janela de saída 44,4 % | elétrons 40,3 %; vidro 5,4 %; janela 44,4 %; feixe 2,3 % |
| 3 Janela de saída | não | 91,9 % | 0 % | Ânodo 8,2 % | ânodo 11,7 %; elétrons 45,7 %; vidro 5,3 % |
| 4 Ampola de vidro | não | 29,9 % | 0 % | Cátodo com filamento 17,2 % | cátodo 12,5 % |

## Limitações e vizinhos (posição nova do selo, E11)

Com o selo fora da região, **nenhum selo de tocar esconde mais o próprio objeto** (0 % nas 14 regiões) e o ponto de 12 pt do rotular esconde de 2 % a 9 % dos objetos, exceto a pulseira (81,8 %: o objeto é uma faixa de 0,056 x 0,077 do quadro, menor que o ponto mais o seu contorno). O selo do número esconde de 0 a 30 % do próprio objeto (o pior é a janela do tubo, 29,7 %). O que o selo novo passou a fazer é cair sobre vizinhos; os que passam de 10 % de um OUTRO objeto cobrado do mesmo item:

- **m19-06 (hotspot, tubo):** o selo 2, do ânodo (a resposta certa), cai abaixo da região (não cabe acima) e cobre **44,4 %** da janela (e 40,3 % da fila de elétrons); o selo 4, da ampola, cobre 17,2 % do cátodo; o selo 1, do cátodo, cobre 19,8 % da ampola. Além disso, os selos se sobrepõem uns aos outros: o 1 fica atrás do 4 e o 2 atrás do 3 na prévia, e os números 1 e 2 ficam ilegíveis. A causa é a figura ser compacta (regiões vizinhas de 0,08 a 0,15 do quadro): é pendência de layout do app ou de região, não da arte.
- **m17-01 (rotular, conferência):** o selo 1, da pulseira, cobre 20,5 % da cabeça do paciente ("Fala do paciente").
- **m17-05 (rotular, emergência):** os selos 3 (oxigênio) e 5 (telefone) cobrem 18,9 % e 19,5 % do botão de chamada.

Nas demais interações nenhum selo cobre mais de 10 % de outro objeto cobrado: m17-04 e m17-06 têm 0 % em todos (os selos de m17-04 caem sobre peças que não são alvo: a porta, o receptor, o tubo e o comando, de 19 a 48 %).

## Spec contra fonte

Spec (como o app o recebe, `diagramSvgAt`) e fonte (`scripts/content/figuras/fontes/<id>.svg`) renderizados em 640 x 480 sobre #171920, na mesma transformação (fonte com `width`/`height` 640 x 480; spec em quadro 320 x 240 ampliado 2x). Pixels em que algum canal difere em mais de 40 de 255, de 307.200 cada: `tubo-raios-x` 0, `tubo-emitindo` 0, `anodo-giratorio` 0, `conferencia-de-identidade` 0, `pontos-de-contato-da-sala` 0, `itens-de-emergencia-da-sala` 0 (e 0 em qualquer nível de diferença). Caminhos (`<path`) na fonte e no spec: 102, 112, 76, 377, 346 e 233, iguais aos do `figura.svg` entregue pelo construtor; nenhum traço saiu na conversão.

## Método

- Cenas: cada fonte foi regenerada pela cena versionada (`scripts/content/figuras/cenas/<id>.mjs`) e comparada byte a byte com o `figura.svg` entregue (6 de 6 iguais); as medidas da m17 foram reproduzidas do zero pelo `build.mjs` do construtor (`medidas.json`, `alvos.json` e `figura.svg` idênticos aos entregues, 3 de 3) e lidas de lá; as do tubo foram feitas de novo sobre as peças do código versionado: cada peça renderizada sozinha em 640 x 480 pelo Chrome headless (alfa maior que 8), e a área e o objeto contados pixel a pixel.
- Áreas do app: lidas do `m17.json` e do `m19.json` finais (não das tabelas do construtor), com as contas de `hotspotTouch.ts`, incluindo `badgeBox`, `labelBadgeBox` e `LABEL_DOT` do commit 4bd7adce (selo fora da região, ponto de 12 pt, selo do número ao lado). Os selos e o ponto foram posicionados chamando essas funções, não copiando a regra. O ponto é medido como quadrado de 12 pt nas cenas da m17 e como círculo no tubo.
- Pontos do m19-03 (rotular): escolhidos entre os pontos que ficam SOBRE a própria peça, dentro da região declarada, com o marcador pelo menos 50 % sobre a peça e as áreas de 44 pt sem se tocar, pelos que escondem menos da peça: cátodo (0,339; 0,372), ânodo (0,580; 0,200), janela (0,537; 0,508), ampola (0,350; 0,160); cátodo e ampola subiram e desceram um pouco depois do selo novo, para os selos de número não se sobreporem. O ponto do ânodo ficou no meio do disco (esconde 15,8 %): os pontos que escondem menos (8 %) caem na borda do disco, com o marcador meio fora dele.
- O que esta medida não prova: se a cena é legível e agradável no aparelho é do dono; não rodei simulador nem `react-native-svg` (a conversão do spec passou nos testes do registro).
