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

## Quanto o selo e o marcador escondem, com a posição do selo depois da correção da revisão (E11 e E12)

Posições lidas de `badgeBoxes` e `labelBadgeBoxes` (`hotspotTouch.ts`), chamando as funções, na régua de 280 pt. "Antes" é a ponta `14a15897` (oito posições, sem olhar a área de toque dos outros alvos); "depois" é a posição de hoje, em que o selo de um alvo também não pisa na área de toque de 44 pt, nem na faixa de 4 pt em volta dela, de nenhum outro alvo do mesmo item, quando há posição livre (E12). O selo de tocar (36 x 24 pt) fica fora da região e é irmão dela no app (o toque nele seleciona a região dona, E13); o ponto do rotular tem 12 pt e o número vai num selo de 36 x 24 pt ao lado, também irmão. "Marcador (28 pt)" e "selo dentro da região" são os valores da versão original, só para comparar. Método desta tabela: cada peça da cena renderizada sozinha em 640 x 480 sobre fundo transparente (alfa maior que 8); o ponto de 12 pt é um círculo, o selo, a caixa de 36 x 24 pt; percentuais do objeto inteiro. "Outro objeto cobrado" é o objeto de outro alvo do mesmo item; "outras peças" é o resto da cena (porta, receptor etc.), só o que passa de 1 %, e não mudou com a correção salvo onde dito. A pulseira usa o ponto novo (0,3223; 0,5237), sobre a borda de baixo da faixa; antes, (0,3223; 0,4966).

### m17-01 i2 (rotular) conferencia-de-identidade

| ponto | marcador (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto, antes → depois | selo cobre OUTRO objeto cobrado, antes → depois | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Pulseira no punho | 100 % | 64,5 % → **33,0 %** | 0 % → 0 % | Fala do paciente 0,8 % → 3,6 % | maca 7,9 % |
| L2 Pedido impresso | 39,6 % | 11 % | 0 % → 0 % | nenhum | profissional 9,3 % |
| L3 Registro na tela | 43,8 % | 6,2 % | 16,3 % → 16,3 % | nenhum | nenhum |
| L4 Fala do paciente (cabeça) | 9,3 % | 1,2 % | 0 % → 0 % | nenhum | nenhum |

### m17-04 i2 (hotspot) pontos-de-contato-da-sala

| alvo | certa | selo dentro da região (original) | selo esconde do próprio objeto, antes → depois | cobre OUTRO objeto cobrado | cobre outras peças da cena, depois |
|---|---|---|---|---|---|
| 1 Maçaneta da porta | não | 100 % | 0 % → 0 % | nenhum | porta 19,8 % |
| 2 Apoio do receptor vertical | sim | 62,2 % | 2,4 % → 0 % | nenhum | receptor 25,7 % (antes 16,7 %) |
| 3 Mesa de exame | sim | 21,3 % | 0 % → **13,3 %** (o selo foi para baixo, sobre o pedestal) | nenhum | nenhum |
| 4 Manopla do tubo | não | 100 % | 0 % → 0 % | nenhum | tubo 42,9 % (antes 42,9 %) |
| 5 Teclado do comando | não | 73 % | 0,2 % → 0,2 % | nenhum | comando 12,2 % |

### m17-05 i2 (rotular) itens-de-emergencia-da-sala

| ponto | marcador (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto, antes → depois | selo cobre OUTRO objeto cobrado, antes → depois | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Porta de saída | 15,4 % | 2,2 % | 7,8 % → 7,8 % | nenhum | nenhum |
| L2 Carrinho de emergência | 30,6 % | 3,8 % | 9,8 % → 12,5 % | Oxigênio 0,5 % → nenhum | mesa 2,5 % (depois) |
| L3 Saída de oxigênio | 37,6 % | 5,2 % | 16,4 % → 16 % | Botão 3,8 % → nenhum | nenhum |
| L4 Botão de chamada | 42,6 % | 5,8 % | 11,1 % → 11,1 % | Telefone 0,1 % | nenhum |
| L5 Telefone da parede | 34,5 % | 4,8 % | 14,7 % → 11,1 % | Botão de chamada **18,7 % → nenhum** (a área de toque do botão agora fica livre; o selo 5 cobre 9,8 % da caixa declarada do botão, que inclui o cordão) | nenhum |

### m17-06 i2 (hotspot) itens-de-emergencia-da-sala

| alvo | certa | selo dentro da região (original) | selo esconde do próprio objeto, antes → depois | cobre OUTRO objeto cobrado | cobre outras peças da cena |
|---|---|---|---|---|---|
| 1 Porta de saída | não | 10,2 % | 0 % → 0 % | nenhum | nenhum |
| 2 Carrinho de emergência | não | 14,5 % | 0 % → 0 % | nenhum | nenhum |
| 3 Saída de oxigênio | não | 35,1 % | 0 % → 0 % | nenhum | nenhum |
| 4 Botão de chamada | sim | 40,3 % | 0 % → 0 % | nenhum | nenhum |
| 5 Telefone da parede | sim | 29,6 % | 0 % → 0 % | nenhum | nenhum |

### m19-03 i2 (rotular) tubo-raios-x

| ponto | marcador (28 pt) | ponto de 12 pt esconde do objeto | selo do número esconde do objeto, antes → depois | selo cobre OUTRO objeto cobrado, antes → depois | selo cobre outras peças |
|---|---|---|---|---|---|
| L1 Cátodo com filamento | 22,4 % | 4,7 % | 0 % → **25,3 %** | Ampola 5,4 % → 4,8 % | nenhum |
| L2 Ânodo | 15,8 % | 2,6 % | 2,7 % → 2,7 % | Ampola 5,4 % | nenhum |
| L3 Janela de saída | 39,9 % | 9,4 % | 29,6 % → 29,6 % | Ânodo 7,9 % | nenhum |
| L4 Ampola de vidro | 29,6 % | 0,7 % | 2,1 % → 0,5 % | nenhum | nenhum |

### m19-06 i2 (hotspot) tubo-raios-x

| alvo | certa | selo dentro da região (original) | selo esconde do próprio objeto, antes → depois | cobre OUTRO objeto cobrado | cobre outras peças da cena |
|---|---|---|---|---|---|
| 1 Cátodo com filamento | não | 44,8 % | 0 % → 0 % | nenhum | nenhum |
| 2 Ânodo | sim | 15,2 % | 0 % → 0 % | Ampola 0 % | nenhum |
| 3 Janela de saída | não | 91,9 % | 0,2 % → 0,2 % | nenhum | feixe 11,7 % |
| 4 Ampola de vidro | não | 29,9 % | 0,9 % → 0,9 % | nenhum | nenhum |

## Limitações e vizinhos (posição do selo depois da correção da revisão, E12)

**Tocar:** nenhum selo cobre outro objeto cobrado (0 % nas 14 regiões, antes e depois) e nenhum esconde mais de 0,2 % do próprio objeto, com uma exceção nova: o selo da mesa de exame (m17-04) foi para baixo e cobre 13,3 % do objeto "mesa", que é o pedestal, não o tampo, onde fica a área de toque.

**Rotular:** o ponto de 12 pt esconde de 0,7 % a 11 % dos objetos, e a pulseira, que escondia 64,5 % (81,8 % pela medida do integrador, que contava o contorno e a caixa do ponto), esconde 33 % com o ponto na borda de baixo da faixa, o mínimo que cabe com os pontos vizinhos a 44 pt: mover mais para a esquerda ou para a direita faz a área de 44 pt tocar a do ponto da cabeça ou a do pedido. O selo do número esconde de 0 a 30 % do próprio objeto; o pior segue sendo a janela do tubo (29,6 %). A correção trouxe o custo do E12: no m19-03, o selo do cátodo foi para baixo e à esquerda e passou a cobrir 25,3 % do cátodo (antes 0 %), porque acima e à direita caíam na área de toque da ampola e da janela. O selo de rotular não conhece a caixa do próprio alvo (o app só recebe os pontos), então a escolha trocou "cobrir a área de toque do vizinho" por "cobrir parte do próprio objeto".

Cruzamentos com vizinhos, no rotular: o selo do telefone (m17-05) deixou de cobrir 18,7 % do botão de chamada e deixou de pisar na área de toque dele; o do oxigênio deixou de cobrir o botão (3,8 % → 0 %); no m19-03, o selo do cátodo cobre 4,8 % da ampola (antes 5,4 %) e o da janela, 7,9 % do ânodo. Nos hotspots do m17-04, os selos caem sobre peças que não são alvo (porta 19,8 %, receptor 25,7 %, tubo 42,9 %, comando 12,2 %); no m19-06, o selo da janela cobre 11,7 % do feixe. O selo da manopla (m17-04) cobria 48,4 % do tubo de teto pela medida do integrador (42,9 % pela desta tabela, que usa a peça sozinha): é o mesmo selo, na mesma posição; a correção do achado 10 não mudou o desenho (ver a evidência do lote).

## Spec contra fonte

Spec (como o app o recebe, `diagramSvgAt`) e fonte (`scripts/content/figuras/fontes/<id>.svg`) renderizados em 640 x 480 sobre #171920, na mesma transformação (fonte com `width`/`height` 640 x 480; spec em quadro 320 x 240 ampliado 2x). Pixels em que algum canal difere em mais de 40 de 255, de 307.200 cada: `tubo-raios-x` 0, `tubo-emitindo` 0, `anodo-giratorio` 0, `conferencia-de-identidade` 0, `pontos-de-contato-da-sala` 0, `itens-de-emergencia-da-sala` 0 (e 0 em qualquer nível de diferença). Caminhos (`<path`) na fonte e no spec: 102, 112, 76, 377, 346 e 233, iguais aos do `figura.svg` entregue pelo construtor; nenhum traço saiu na conversão.

## Método

- Cenas: cada fonte foi regenerada pela cena versionada (`scripts/content/figuras/cenas/<id>.mjs`) e comparada byte a byte com o `figura.svg` entregue (6 de 6 iguais); as medidas da m17 foram reproduzidas do zero pelo `build.mjs` do construtor (`medidas.json`, `alvos.json` e `figura.svg` idênticos aos entregues, 3 de 3) e lidas de lá; as do tubo foram feitas de novo sobre as peças do código versionado: cada peça renderizada sozinha em 640 x 480 pelo Chrome headless (alfa maior que 8), e a área e o objeto contados pixel a pixel.
- Áreas do app: lidas do `m17.json` e do `m19.json` finais (não das tabelas do construtor), com as contas de `hotspotTouch.ts`, incluindo `badgeBox`, `labelBadgeBox` e `LABEL_DOT` do commit 4bd7adce (selo fora da região, ponto de 12 pt, selo do número ao lado). Os selos e o ponto foram posicionados chamando essas funções, não copiando a regra. O ponto é medido como quadrado de 12 pt nas cenas da m17 e como círculo no tubo.
- Pontos do m19-03 (rotular): escolhidos entre os pontos que ficam SOBRE a própria peça, dentro da região declarada, com o marcador pelo menos 50 % sobre a peça e as áreas de 44 pt sem se tocar, pelos que escondem menos da peça: cátodo (0,339; 0,372), ânodo (0,580; 0,200), janela (0,537; 0,508), ampola (0,350; 0,160); cátodo e ampola subiram e desceram um pouco depois do selo novo, para os selos de número não se sobreporem. O ponto do ânodo ficou no meio do disco (esconde 15,8 %): os pontos que escondem menos (8 %) caem na borda do disco, com o marcador meio fora dele.
- O que esta medida não prova: se a cena é legível e agradável no aparelho é do dono; não rodei simulador nem `react-native-svg` (a conversão do spec passou nos testes do registro).
