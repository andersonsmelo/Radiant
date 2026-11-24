# Lote 2CD: medidas por cor sob as áreas do app

Data das medidas: 2026-11-21 (Node 20.20.2), refeitas depois da correção da revisão independente (idoso, fluoroscopia, contenção e posicionamento do DXA redesenhados; as outras seis figuras não mudaram e as medidas delas são as de 2026-11-20). Onze figuras, dezesseis usos (quatorze interações e dois visuais de conceito, o da gestante e o do posicionamento do DXA, que a aula só mostra; só o da gestante tem tabela, porque o do DXA mostra a mesma figura da interação m30-03 i2). Os percentuais são do render do spec, peça por peça, sobre #171920, com a posição atual do selo e do marcador do app (`badgeBoxes`, `labelBadgeBoxes`, `LABEL_DOT` de `hotspotTouch.ts`, quadro de 280 x 210 pt), refeitos a partir das aulas já aplicadas; o construtor media sobre a fonte.

**Como ler.** *Região*: caixa declarada do alvo. *Área de toque*: a da conta do app (a região ou o ponto, ampliada em torno do centro até 44 pt por eixo). *Objeto*: pixels da(s) peça(s) do alvo DENTRO da região declarada dele (o corpo de uma pessoa é uma peça só e o alvo é um trecho dele: pernas, pescoço, mão; as peças translúcidas, como o campo de luz e o leque de espalhamento, contam pela pegada inteira). *Fundo*: pixel sem desenho (cor #171920), da sala ou do piso. *Resposta errada*: o objeto de cada outro alvo do mesmo item sob a área de toque. *Selo cobre*: parte do objeto que o selo de 36 x 24 pt, ou o ponto de 12 pt do rotular, esconde. Medido por peça: cada peça sozinha contra o render completo.

**Regra do brief do integrador:** a área da resposta certa não pode mostrar mais da estrutura de uma resposta errada do que da própria estrutura. Nos itens de tocar e de caça ao risco nenhuma área de toque mostra o objeto de outro alvo do mesmo item (maior valor medido: 0 %), e a estrutura própria aparece em todas. Nos rotulares a exceção é só o ponto do "Feixe" no rotular do DXA (m30-01 i2): o feixe é uma linha fina de 4 px que atravessa o tronco da paciente, e a área de 44 pt ao redor dele mostra 6 % de feixe e 60,9 % do corpo dela, que é o objeto de outro ponto do mesmo item (ver "Limites"). Nos itens de tocar e de caça ao risco, nenhuma área mostra mais de uma resposta errada do que da própria estrutura.

**Selos (E12).** Em todas as interações, nenhum selo cai sobre a área de toque de 44 pt de outro alvo, sobre a região ou o ponto de outro alvo, nem sobre outro selo (`selosSobre` vazio nas quatorze). Os três rotulares precisaram de uma busca: nos pontos do construtor um selo caía na área de toque de outro ponto (DXA: 1 caso; teste de feixe: 3 casos); os pontos foram movidos entre pixels do próprio objeto, o mais perto possível dos originais, até nenhum selo cair em área alheia (deslocamento máximo de 8 pt no teste de feixe; no DXA, 13 pt o do detector e 11 pt o do feixe). Só o visual de conceito da gestante tem um selo sobre a área de toque de outro alvo, porque as duas regiões declaradas se sobrepõem por construção (o campo ajustado está dentro do aberto) e nenhuma interação as usa.


## m26-02 i2 label: fluoroscopia-cadeia

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo | resposta errada na área | outras peças na área | ponto de 12 pt cobre do objeto | selo do número cobre do objeto |
|---|---|---|---|---|---|---|
| L1 Tubo de raios X (sob a mesa) | 43,3 % | 23,7 % | nenhum | arco 3,1; mesa 22,2 % | 13,7 % | 6,5 % |
| L2 Receptor de imagem (acima do paciente) | 89,7 % | 1,9 % | nenhum | arco 4,8; paciente 1,3 % | 5,3 % | 11,5 % |
| L3 Monitor (num suporte) | 93,9 % | 5,3 % | nenhum | nenhum | 4,5 % | 17,6 % |
| L4 Pedal (no chão) | 40,4 % | 50,2 % | nenhum | operador 4,5 % | 14,7 % | 5,7 % |

## m26-04 i3 risk-hunt: sala-de-fluoroscopia-espalhada

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Pernas do operador, atrás do saiote | não | 63,1 % | 24,7 % | 34,1 % | 40,2 % | nenhum | biombo 1,6; saiote 14,3 % | 0 % |
| 2 Abaixo da mesa, do lado do tubo | não | 32,4 % | 9,4 % | 25,3 % | 13,2 % | nenhum | mesa 11,1; tubo 15,1; paciente 0,6; saiote 29,7 % | 0 % |
| 3 Pessoa afastada, atrás do biombo | não | 44,5 % | 30,9 % | 35,7 % | 37,4 % | nenhum | biombo 24,3 % | 0 % |
| 4 Pescoço do operador | não | 75,5 % | 19,8 % | 14,7 % | 38,1 % | nenhum | biombo 7,3; mesa 2,1; paciente 3,2; oculos 2,4 % | 0 % |

## m27-01 i3 hotspot: contencao-pediatrica

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Acompanhante à cabeceira | não | 58,9 % | 34,9 % | 58,9 % | 34,9 % | nenhum | mesa 2,7; crianca 1,2 % | 0 % |
| 2 Faixa sobre as pernas | não | 61,1 % | 4,9 % | 30,8 % | 17,5 % | nenhum | mesa 28,1; crianca 20 % | 0 % |
| 3 Pessoa junto aos pés da mesa | sim | 64 % | 26,4 % | 64 % | 26,4 % | nenhum | mesa 3 % | 0 % |
| 4 Campo de luz | não | 75,5 % | 1,3 % | 38,7 % | 6,7 % | nenhum | mesa 11; crianca 24,8 % | 0 % |

## m27-02 i2 hotspot: contencao-pediatrica

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Mão do acompanhante | não | 31 % | 14,6 % | 24,6 % | 17,1 % | nenhum | mesa 22,5; crianca 22,7 % | 0 % |
| 2 Faixa sobre as pernas | sim | 61,1 % | 4,9 % | 30,8 % | 17,5 % | nenhum | mesa 28,1; crianca 20 % | 0 % |
| 3 Campo de luz | não | 75,5 % | 1,3 % | 38,7 % | 6,7 % | nenhum | mesa 11; crianca 24,8 % | 0 % |
| 4 Apoio de espuma | sim | 85,2 % | 4 % | 35 % | 20,2 % | nenhum | mesa 35,8; crianca 6 % | 0 % |
| 5 Pessoa junto aos pés da mesa | não | 64 % | 26,4 % | 64 % | 26,4 % | nenhum | mesa 3 % | 0 % |

## m27-03 i2 hotspot: colimacao-pediatrica

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Pernas da criança da esquerda | sim | 69,1 % | 0 % | 69,1 % | 0 % | nenhum | mesaB 6,4; mesaA 23,8 % | 0 % |
| 2 Cabeça da criança da esquerda | sim | 84,5 % | 6,8 % | 84,5 % | 6,8 % | nenhum | mesaA 7,7 % | 0 % |
| 3 Tórax da criança da direita | não | 100 % | 0 % | 20,1 % | 21,2 % | nenhum | mesaB 3,3 % | 0 % |
| 4 Abdome e pelve da criança da direita | não | 98,5 % | 0 % | 18,9 % | 21,2 % | nenhum | mesaB 0,8 % | 0 % |

## m27-04 i4 risk-hunt: idoso-apoios-e-riscos

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Barra de apoio junto ao receptor | não | 23,2 % | 46 % | 7,9 % | 72,9 % | nenhum | receptor 4,8; idosa 11,2 % | 0 % |
| 2 Degrau no chão | não | 74,1 % | 19 % | 42,1 % | 52,5 % | nenhum | nenhum | 0 % |
| 3 Banco ao lado | não | 53 % | 22,7 % | 36,8 % | 35,4 % | nenhum | receptor 2; idosa 5,5 % | 0 % |
| 4 Tapete com a ponta solta | não | 60,7 % | 35,1 % | 27,9 % | 70 % | nenhum | nenhum | 0 % |
| 5 Andador longe da pessoa | não | 30,6 % | 47,8 % | 30,6 % | 47,8 % | nenhum | nenhum | 0 % |

## m27-06 i3 hotspot: idoso-apoios-e-riscos

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Barra de apoio junto ao receptor | não | 23,2 % | 46 % | 7,9 % | 72,9 % | nenhum | receptor 4,8; idosa 11,2 % | 0 % |
| 2 Banco ao lado | não | 53 % | 22,7 % | 36,8 % | 35,4 % | nenhum | receptor 2; idosa 5,5 % | 0 % |
| 3 Degrau no chão | não | 74,1 % | 19 % | 42,1 % | 52,5 % | nenhum | nenhum | 0 % |
| 4 Tapete com a ponta solta | não | 60,7 % | 35,1 % | 27,9 % | 70 % | nenhum | nenhum | 0 % |
| 5 Andador longe da pessoa | sim | 30,6 % | 47,8 % | 30,6 % | 47,8 % | nenhum | nenhum | 0 % |

## sem interação (visual do conceito): gestante-campo-e-feixe

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Campo ajustado ao tórax | não | 71,4 % | 0,3 % | 35,7 % | 16,8 % | Campo aberto demais, tracejado 4,6 % | gestante 16,8; barriga 3,6 % | 0 % |
| 2 Campo aberto demais, tracejado | não | 10,5 % | 2,4 % | 5,3 % | 22,8 % | Campo ajustado ao tórax 20,6 % | gestante 19,2; barriga 16,7; campo-ajustado 1,4 % | 0 % |

## m30-01 i2 label: dxa-dois-feixes

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo | resposta errada na área | outras peças na área | ponto de 12 pt cobre do objeto | selo do número cobre do objeto |
|---|---|---|---|---|---|---|
| L1 Fonte de raios X (peça sob o tampo) | 17,7 % | 55,1 % | nenhum | mesa 25,1 % | 24,8 % | 0 % |
| L2 Detector (peça no alto do braço) | 53,6 % | 18,1 % | Feixe de duas energias 0,2 % | coluna 6,5; braco 18,9 % | 11 % | 0,5 % |
| L3 Feixe de duas energias | 6 % | 16 % | Paciente deitada de costas 60,9 % | coluna 7,8; mesa 2,1; paciente 60,9 % | 22,8 % | 0 % |
| L4 Paciente deitada de costas | 54,1 % | 33,7 % | nenhum | mesa 10 % | 2,2 % | 1 % |
| L5 Ponta da mesa | 49 % | 23,3 % | Paciente deitada de costas 14,5 % | pedestais 8; paciente 14,5 % | 11,4 % | 10,5 % |

Selo sobre o objeto de OUTRO alvo: selo 3 cobre Paciente deitada de costas 11,8 %.

## m30-01 i4 hotspot: dxa-dois-feixes

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Fonte de raios X (peça sob o tampo) | não | 48,2 % | 15,4 % | 17,7 % | 39,3 % | nenhum | mesa 39,3; paciente 1,3 % | 0 % |
| 2 Detector (peça no alto do braço) | sim | 68,9 % | 15,5 % | 54,2 % | 23,9 % | nenhum | coluna 4,9; feixeB 0,7; braco 13,1 % | 0 % |
| 3 Tronco da paciente | não | 72,7 % | 12,5 % | 61,5 % | 14,3 % | nenhum | mesa 14,6 % | 0 % |
| 4 Ponta da mesa | não | 57,6 % | 18,3 % | 49,6 % | 20,3 % | nenhum | pedestais 12,5; paciente 12,9 % | 0 % |

## m30-03 i2 hotspot: dxa-posicionamento

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Coluna reta sobre a mesa | não | 92,1 % | 0 % | 92,1 % | 0 % | nenhum | mesaA 6,4 % | 0 % |
| 2 Bloco sob as pernas | não | 57,2 % | 0 % | 57,2 % | 0 % | nenhum | mesaA 8,9; pacienteA 29,9 % | 0 % |
| 3 Posicionador entre os pés | não | 92,4 % | 0 % | 56,8 % | 0 % | nenhum | mesaB 37,7; faixa 1,8 % | 0 % |
| 4 Pé à esquerda do desenho (girado, preso) | sim | 66,5 % | 0 % | 16,2 % | 0 % | nenhum | mesaB 70,9; faixa 3,2 % | 0 % |
| 5 Pé à direita do desenho | não | 74,5 % | 0 % | 19,8 % | 0 % | nenhum | mesaB 69,9 % | 0 % |

## m31-01 i2 hotspot: radiografia-veterinaria

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Pessoa sem avental ao lado da mesa | não | 48 % | 26,6 % | 25 % | 43,9 % | nenhum | porta 13,8; mesa 4,1; cao 0,9; sacos 2,8 % | 0 % |
| 2 Mãos da pessoa de avental | não | 20 % | 13,5 % | 4 % | 13,1 % | nenhum | coluna 14; segura 38,7; mesa 10,7; cao 6,9; sacos 5,9 % | 0 % |
| 3 Calha de espuma | sim | 20,8 % | 6,4 % | 15,1 % | 16,2 % | nenhum | mesa 16,7; detector 2,1; cao 17,7 % | 0 % |
| 4 Tubo de raios X | não | 68,5 % | 26,1 % | 30,8 % | 57,1 % | nenhum | coluna 3,6; feixe 0,6; braco 1,5 % | 0 % |

## m31-02 i2 hotspot: radiografia-veterinaria

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Pessoa sem avental junto à porta | não | 55,4 % | 21,8 % | 42,3 % | 30,2 % | nenhum | porta 21,2 % | 0 % |
| 2 Pessoa sem avental ao lado da mesa | sim | 48 % | 26,6 % | 25 % | 43,9 % | nenhum | porta 13,8; mesa 4,1; cao 0,9; sacos 2,8 % | 0 % |
| 3 Mãos da pessoa de avental | não | 20 % | 13,5 % | 4 % | 13,1 % | nenhum | coluna 14; segura 38,7; mesa 10,7; cao 6,9; sacos 5,9 % | 0 % |
| 4 Calha de espuma | não | 20,8 % | 6,4 % | 15,1 % | 16,2 % | nenhum | mesa 16,7; detector 2,1; cao 17,7 % | 0 % |

## m31-06 i2 hotspot: radiografia-de-objeto

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Tubo de raios X | não | 71,6 % | 23,1 % | 31,6 % | 56,7 % | nenhum | aparelho 1,2; braco 7,6; feixe 2,6 % | 0 % |
| 2 Triângulo de aviso | sim | 17,3 % | 74,9 % | 5,4 % | 80 % | nenhum | aparelho 8,6; pesinal 1,1 % | 0 % |
| 3 Quadro no cavalete | não | 61,5 % | 17,7 % | 34,4 % | 31,7 % | nenhum | feixe 19,8; cavalete 11 % | 0 % |
| 4 Cordão entre os postes | sim | 17,7 % | 51,5 % | 11,3 % | 52,9 % | nenhum | aparelho 20,9; painel 4,3 % | 0 % |
| 5 Detector atrás do quadro | não | 31,6 % | 26,2 % | 19,6 % | 44 % | nenhum | suportedet 1,8; feixe 12,6 % | 0 % |
| 6 Pessoa ao lado do painel | não | 48,4 % | 44,8 % | 32,1 % | 55,4 % | nenhum | painel 7 % | 0 % |

## m32-02 i2 label: teste-de-feixe

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo | resposta errada na área | outras peças na área | ponto de 12 pt cobre do objeto | selo do número cobre do objeto |
|---|---|---|---|---|---|---|
| L1 Tubo de raios X | 55,2 % | 25,4 % | nenhum | coluna 19 % | 6,8 % | 0 % |
| L2 Colimador | 47,8 % | 25,5 % | Tubo de raios X 22,1; Lâminas de filtro 0,9 % | feixe 2,3; suporte 0,9; tubo 22,1 % | 12,5 % | 10,9 % |
| L3 Lâminas de filtro | 54,4 % | 33,5 % | nenhum | mesa 2,2; feixe 8 % | 5,1 % | 2,6 % |
| L4 Medidor | 26,5 % | 2,6 % | Lâminas de filtro 3,2 % | mesa 55,9; suporte 3,2 % | 9,4 % | 3 % |
| L5 Mostrador | 54,2 % | 9,6 % | Lâminas de filtro 17,1; Medidor 1,9 % | mesa 1,4; coluna 12,6; medidor 1,9; suporte 12,8; laminas 4,3 % | 3,6 % | 5,7 % |

Selo sobre o objeto de OUTRO alvo: selo 2 cobre Lâminas de filtro 0,6 %.

## Antes e depois da correção (cinco figuras redesenhadas)

Objeto na área de toque, selo e resposta errada na área, de 2026-11-20 (antes) para 2026-11-21 (depois). Por alvo; "-" quando o item não existia.

### m26-02 i2 label: fluoroscopia-cadeia

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Tubo de raios X (sob a mesa) | 32,2 % → 43,3 % | 1,4 % → 6,5 % | nenhum → nenhum |
| 2 Receptor de imagem (acima do paciente) | 58,6 % → 89,7 % | 11,6 % → 11,5 % | nenhum → nenhum |
| 3 Monitor (num suporte) | 83,8 % → 93,9 % | 11,2 % → 17,6 % | nenhum → nenhum |
| 4 Pedal (no chão) | 31,5 % → 40,4 % | 0,7 % → 5,7 % | nenhum → nenhum |

### m26-04 i3 risk-hunt: sala-de-fluoroscopia-espalhada

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Pernas do operador, atrás do saiote | 28 % → 34,1 % | 0 % → 0 % | nenhum → nenhum |
| 2 Abaixo da mesa, do lado do tubo | 22,3 % → 25,3 % | 0 % → 0 % | nenhum → nenhum |
| 3 Pessoa afastada, atrás do biombo | 25,4 % → 35,7 % | 0 % → 0 % | nenhum → nenhum |
| 4 Pescoço do operador | 11,7 % → 14,7 % | 0 % → 0 % | nenhum → nenhum |

### m27-01 i3 hotspot: contencao-pediatrica

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Acompanhante à cabeceira | 58,9 % → 58,9 % | 0 % → 0 % | nenhum → nenhum |
| 2 Faixa sobre as pernas | 30,8 % → 30,8 % | 0 % → 0 % | nenhum → nenhum |
| 3 Pessoa junto aos pés da mesa | 64 % → 64 % | 0 % → 0 % | nenhum → nenhum |
| 4 Campo de luz | 38,7 % → 38,7 % | 0 % → 0 % | nenhum → nenhum |

### m27-02 i2 hotspot: contencao-pediatrica

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Mão do acompanhante | 24,6 % → 24,6 % | 0 % → 0 % | nenhum → nenhum |
| 2 Faixa sobre as pernas | 30,8 % → 30,8 % | 0 % → 0 % | nenhum → nenhum |
| 3 Campo de luz | 38,7 % → 38,7 % | 0 % → 0 % | nenhum → nenhum |
| 4 Apoio de espuma | 39,4 % → 35 % | 0 % → 0 % | nenhum → nenhum |
| 5 Pessoa junto aos pés da mesa | 64 % → 64 % | 0 % → 0 % | nenhum → nenhum |

### m27-04 i4 risk-hunt: idoso-apoios-e-riscos

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Barra de apoio junto ao receptor | 9,6 % → 7,9 % | 0 % → 0 % | nenhum → nenhum |
| 2 Degrau no chão | 49,3 % → 42,1 % | 0 % → 0 % | nenhum → nenhum |
| 3 Banco ao lado | 44,5 % → 36,8 % | 0 % → 0 % | nenhum → nenhum |
| 4 Tapete com a ponta solta | 30,4 % → 27,9 % | 0 % → 0 % | nenhum → nenhum |
| 5 Andador longe da pessoa | 31,5 % → 30,6 % | 0 % → 0 % | nenhum → nenhum |

### m27-06 i3 hotspot: idoso-apoios-e-riscos

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Barra de apoio junto ao receptor | 9,6 % → 7,9 % | 0 % → 0 % | nenhum → nenhum |
| 2 Banco ao lado | 44,5 % → 36,8 % | 0 % → 0 % | nenhum → nenhum |
| 3 Degrau no chão | 49,3 % → 42,1 % | 0 % → 0 % | nenhum → nenhum |
| 4 Tapete com a ponta solta | 30,4 % → 27,9 % | 0 % → 0 % | nenhum → nenhum |
| 5 Andador longe da pessoa | 31,5 % → 30,6 % | 0 % → 0 % | nenhum → nenhum |

### m30-03 i2 hotspot: dxa-posicionamento

| alvo | objeto na área de toque | selo cobre do objeto | resposta errada na área |
|---|---|---|---|
| 1 Coluna reta sobre a mesa | 97,3 % → 92,1 % | 0 % → 0 % | nenhum → nenhum |
| 2 Bloco sob as pernas | 57,4 % → 57,2 % | 0 % → 0 % | nenhum → nenhum |
| 3 Posicionador entre os pés | 58 % → 56,8 % | 0 % → 0 % | nenhum → nenhum |
| 4 Pé à esquerda do desenho (girado, preso) | 20,4 % → 16,2 % | 0 % → 0 % | nenhum → nenhum |
| 5 Pé à direita do desenho | 16,9 % → 19,8 % | 0 % → 0 % | nenhum → nenhum |

## Objetos que ficam mais de 50 % escondidos

Nenhum. O maior valor medido é 24,8 % (dxa-dois-feixes m30-01 i2 label, Fonte de raios X (peça sob o tampo) (ponto de 12 pt)).

## Limites

- Medidas sobre o spec renderizado no Chrome, não no `react-native-svg`; o app mede o quadro em 280 pt (telas de 320 e 358 pt dão selos um pouco menores em proporção). O spec renderizado sobre #171920 é idêntico à fonte pixel a pixel nas onze figuras (0 pixels acima de 40/255; 0 pixels diferentes).
- Nas caças ao risco (m26-04 i3 e m27-04 i4) o app mostra só a marca de selecionado, na mesma posição do selo e só depois do toque; a coluna "selo cobre" mede o que essa marca esconde.
- **Rotular do DXA, "Feixe".** O feixe é uma linha fina por construção (4 px; duas linhas, amarela e ciano, a 5 cm uma da outra), e o ponto precisa ficar sobre ela e a 44 pt dos pontos do detector e do paciente: a área de toque mostra o corpo da paciente (60,9 %, objeto do ponto "Paciente"). O ponto não é uma escolha entre respostas, e as áreas de toque não se sobrepõem; fica registrado como a parte mais fraca do lote.
- **Alvos de trecho do corpo** (pernas, cabeça, pescoço, mão, tórax, abdome, pé): a região declarada é a caixa do trecho; fora dela, na área de toque, aparece o resto do mesmo corpo (coluna "outras peças"). No colimação pediátrica, tórax e abdome da criança da direita usam o núcleo mínimo (0,08 x 0,08) do trecho, porque as caixas inteiras ficariam a menos de 44 pt uma da outra.
- **Gestante** (só visual do conceito): sem marcadores; a tabela mostra o que as duas regiões declaradas teriam, se um item as usasse.
