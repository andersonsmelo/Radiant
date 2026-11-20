# Lote 2A: medidas por cor sob as áreas do app

Data das medidas: 2026-11-20. Nove interações usam as seis figuras novas; todas estão abaixo. Método e limites no fim.

**Como ler.** Cada percentual é da **área de toque** que o app usa (`hotspotTouch.ts`, quadro de 280 x 210 pt: a região ou o ponto, ampliada em torno do centro até 44 pt por eixo), ou do **objeto** inteiro quando a coluna diz "cobre". Selo do hotspot: 36 x 24 pt no canto superior esquerdo da região, empurrado para dentro do quadro. Marcador do label: círculo de 28 pt centrado no ponto (nas cenas da m17 a medida usa a caixa quadrada de 28 pt em volta do ponto, que é um pouco mais conservadora que o círculo). O "objeto" é a peça nomeada pelo alvo; "fundo" é o que não é peça nenhuma (nas cenas da m17, a parede e o piso da sala; no tubo, nada desenhado); "outras peças" são as demais peças da cena que aparecem na área. As peças são medidas uma a uma, então os percentuais podem somar mais de 100 % (o vidro do tubo é uma casca transparente sobre o conjunto todo).

**Regra do brief do integrador:** a área da resposta certa não pode mostrar mais da estrutura de uma resposta errada do que da própria estrutura. Resultado: em nenhuma das três interações de hotspot a área de uma resposta certa mostra o objeto de uma resposta errada (m17-04: apoio e mesa mostram só receptor e fundo; m17-06: botão e telefone, "nenhum"; m19-06: ânodo mostra só os terminais metálicos da própria haste e o vidro). O contrário existe e está dito: no m19-06, a área da **Janela de saída** (errada) mostra 20,8 % de ânodo (a borda baixa do disco), então tocar na ponta de baixo do disco cai na janela; as áreas de toque não se sobrepõem (o verificador confere) e a região do ânodo termina em y = 0,35, acima da área da janela.

## m17-01 i2 (label) conferencia-de-identidade

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (sala) | o resto (maca, paciente, outras peças) | marcador (28 pt) cobre do objeto |
|---|---|---|---|---|
| L1 Pulseira no punho (0.3223; 0.4966) | 7,7 % | 2,3 % | 90 % | 100 % |
| L2 Pedido impresso (0.4862; 0.3921) | 30,4 % | 56,6 % | 13 % | 39,6 % |
| L3 Registro na tela (0.8581; 0.3293) | 80,5 % | 17 % | 2,5 % | 43,8 % |
| L4 Fala do paciente (cabeça) (0.1600; 0.3984) | 12,8 % | 30,4 % | 56,8 % | 9,3 % |

## m17-04 i2 (hotspot) pontos-de-contato-da-sala

| alvo (nome declarado) | certa | objeto na área de toque | fundo (sala) na área | peças que não são o objeto, na área | selo (36 x 24 pt) cobre do objeto |
|---|---|---|---|---|---|
| 1 Maçaneta da porta | não | 16,8 % | 0 % | porta 80,2 % | 100 % |
| 2 Apoio do receptor vertical | sim | 12 % | 52,4 % | receptor 32 % | 62,2 % |
| 3 Mesa de exame | sim | 52 % | 44,9 % | receptor 0,5 % | 21,3 % |
| 4 Manopla do tubo | não | 10,8 % | 69,2 % | tubo 17,1 % | 100 % |
| 5 Teclado do comando | não | 24,5 % | 32,8 % | comando 37,9 % | 73 % |

## m17-05 i2 (label) itens-de-emergencia-da-sala

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (sala) | o resto (maca, paciente, outras peças) | marcador (28 pt) cobre do objeto |
|---|---|---|---|---|
| L1 Porta de saída (0.1253; 0.4532) | 99 % | 0 % | 1 % | 15,4 % |
| L2 Carrinho de emergência (0.3229; 0.6993) | 95,5 % | 3,6 % | 0,9 % | 30,6 % |
| L3 Saída de oxigênio (0.5245; 0.4698) | 96,6 % | 2,8 % | 0,6 % | 37,6 % |
| L4 Botão de chamada (0.6952; 0.4311) | 90 % | 8,4 % | 1,6 % | 42,6 % |
| L5 Telefone da parede (0.8670; 0.5641) | 83,6 % | 16,2 % | 0,2 % | 34,5 % |

## m17-06 i2 (hotspot) itens-de-emergencia-da-sala

| alvo (nome declarado) | certa | objeto na área de toque | fundo (sala) na área | peças que não são o objeto, na área | selo (36 x 24 pt) cobre do objeto |
|---|---|---|---|---|---|
| 1 Porta de saída | não | 87,3 % | 11,7 % | nenhum | 10,2 % |
| 2 Carrinho de emergência | não | 59,6 % | 31,4 % | nenhum | 14,5 % |
| 3 Saída de oxigênio | não | 83 % | 15,1 % | nenhum | 35,1 % |
| 4 Botão de chamada | sim | 50,6 % | 47,3 % | nenhum | 40,3 % |
| 5 Telefone da parede | sim | 69,5 % | 29,2 % | nenhum | 29,6 % |

## m19-03 i2 (label) tubo-raios-x

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo (nada desenhado) | outras peças na área | marcador (28 pt) cobre do objeto | marcador sobre o objeto |
|---|---|---|---|---|---|
| L1 Cátodo com filamento (0.339; 0.360) | 39,5 % | 0 % | elétrons 0,9 %; vidro 100 % | 22,4 % | 57 % |
| L2 Ânodo (0.580; 0.200) | 74,6 % | 0 % | vidro 100 % | 15,8 % | 97 % |
| L3 Janela de saída (0.537; 0.508) | 41,6 % | 4,8 % | ânodo 6,7 %; vidro 35,1 %; feixe 68,6 % | 39,9 % | 54 % |
| L4 Ampola de vidro (0.350; 0.140) | 67,5 % | 32,5 % | nenhuma | 29,6 % | 84 % |

## m19-06 i2 (hotspot) tubo-raios-x

| alvo (nome declarado) | certa | área de toque (px do quadro de 640) | objeto na área | fundo (nada desenhado) | outras peças na área | selo (36 x 24 pt) cobre do objeto |
|---|---|---|---|---|---|---|
| 1 Cátodo com filamento | não | 101 x 116 | 71 % | 8,3 % | vidro 83,8 % | 44,8 % |
| 2 Ânodo | sim | 293 x 127 | 53,4 % | 16,2 % | terminais 4,4 %; vidro 77 % | 15,2 % |
| 3 Janela de saída | não | 101 x 101 | 42,7 % | 6,4 % | ânodo 20,8 %; elétrons 2 %; vidro 58,2 %; feixe 44,2 % | 91,9 % |
| 4 Ampola de vidro | não | 120 x 101 | 77,9 % | 22,1 % | nenhuma | 29,9 % |


## Limitações aceitas (decisão E4 do controlador, registradas para o dono)

O selo ou o marcador do app ainda esconde **100 %** da pulseira (m17-01, marcador), da maçaneta (m17-04, selo) e da manopla do tubo (m17-04, selo); o teclado perde 73 % e o apoio do receptor 62 % para o selo. Os objetos foram aumentados no desenho, de propósito, e ainda assim não chegam a metade à vista: uma alavanca ou uma alça só ficaria 50 % à vista com mais de 1,25 m de largura na parede. Mudar a posição do selo no app (canto superior esquerdo da região) é pendência do dono, fora deste lote, e vale para todas as figuras. No m19-06, o selo esconde 91,9 % da janela (alvo errado, região pequena de 0,145 x 0,117) e 44,8 % do cátodo (errado); o ânodo, que é a resposta certa, fica 84,8 % à vista.

## Spec contra fonte

Spec (como o app o recebe, `diagramSvgAt`) e fonte (`scripts/content/figuras/fontes/<id>.svg`) renderizados em 640 x 480 sobre #171920, na mesma transformação (fonte com `width`/`height` 640 x 480; spec em quadro 320 x 240 ampliado 2x). Pixels em que algum canal difere em mais de 40 de 255, de 307.200 cada: `tubo-raios-x` 0, `tubo-emitindo` 0, `anodo-giratorio` 0, `conferencia-de-identidade` 0, `pontos-de-contato-da-sala` 0, `itens-de-emergencia-da-sala` 0 (e 0 em qualquer nível de diferença). Caminhos (`<path`) na fonte e no spec: 102, 112, 76, 377, 346 e 233, iguais aos do `figura.svg` entregue pelo construtor; nenhum traço saiu na conversão.

## Método

- Cenas: cada fonte foi regenerada pela cena versionada (`scripts/content/figuras/cenas/<id>.mjs`) e comparada byte a byte com o `figura.svg` entregue (6 de 6 iguais); as medidas da m17 foram reproduzidas do zero pelo `build.mjs` do construtor (`medidas.json`, `alvos.json` e `figura.svg` idênticos aos entregues, 3 de 3) e lidas de lá; as do tubo foram feitas de novo sobre as peças do código versionado: cada peça renderizada sozinha em 640 x 480 pelo Chrome headless (alfa maior que 8), e a área e o objeto contados pixel a pixel.
- Áreas do app: lidas do `m17.json` e do `m19.json` finais (não das tabelas do construtor), com as contas de `hotspotTouch.ts` e o `MARKER = 28` de `LabelStepRenderer.tsx`.
- Pontos do m19-03 (rotular): escolhidos entre os pontos que ficam SOBRE a própria peça, dentro da região declarada, com o marcador pelo menos 50 % sobre a peça e as áreas de 44 pt sem se tocar, pelos que escondem menos da peça: cátodo (0,339; 0,360), ânodo (0,580; 0,200), janela (0,537; 0,508), ampola (0,350; 0,140). O ponto do ânodo ficou no meio do disco (esconde 15,8 %): os pontos que escondem menos (8 %) caem na borda do disco, com o marcador meio fora dele.
- O que esta medida não prova: se a cena é legível e agradável no aparelho é do dono; não rodei simulador nem `react-native-svg` (a conversão do spec passou nos testes do registro).
