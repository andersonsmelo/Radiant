# Lote 2B: medidas por cor sob as áreas do app

Data das medidas: 2026-11-20 (Node 20.20.2). Cinco figuras, sete usos (seis interações e um visual de conceito). Os percentuais são do render do spec, peça por peça, sobre #171920, com a posição NOVA do selo e do marcador do app (`badgeBoxes`, `labelBadgeBoxes`, `LABEL_DOT` de `hotspotTouch.ts`, quadro de 280 x 210 pt), refeitos na correção da revisão do 2B (2026-11-20, noite), com a transferência, o anel do dosímetro e o detector do leito redesenhados; os do construtor (selo dentro da região) estão na coluna "antes".

**Como ler.** *Região*: caixa declarada do alvo. *Área de toque*: a da conta do app (a região ou o ponto, ampliada em torno do centro até 44 pt por eixo). *Objeto*: pixels da(s) peça(s) do alvo (o desenho é medido peça por peça: cada peça sozinha contra o render completo; pixel misturado por transparência, como o feixe, não é de peça nenhuma). *Fundo*: pixel sem desenho (cor #171920) ou da sala. *Resposta errada*: o objeto de cada outro alvo do mesmo item sob a área de toque. *Selo cobre*: parte do objeto que o selo de 36 x 24 pt, ou o ponto de 12 pt do rotular, esconde.

**Regra do brief do integrador:** a área da resposta certa não pode mostrar mais da estrutura de uma resposta errada do que da própria estrutura. Resultado nas três interações de tocar e de caça ao risco: em nenhuma área de toque o objeto de uma resposta errada passa de 6,3 % (o feixe sob o colar, no trauma), e a estrutura própria aparece mais que isso em todas.

**Selos (E12).** Em todas as sete listas, nenhum selo cai sobre a área de toque de 44 pt de outro alvo, sobre a região ou o ponto de outro alvo, nem sobre outro selo (`selosSobre` vazio nas sete). Os 25 selos das seis interações também ficam dentro do quadro, fora da própria região e fora de toda área de toque, região, ponto e selo alheios nas larguras de 280, 320 e 358 pt (75 conferências, 0 fora da regra).

**Nas caça ao risco, as prévias mostram um estado que o aluno não vê.** O alvos-preview.mjs desenha selo numerado também nos itens de caça ao risco, mas o RiskHuntStepRenderer não mostra número: só a marca de selecionado, na mesma posição, e só depois do toque. As colunas de selo das duas interações de caça ao risco (m17-02 i4 e m25-05 i4) medem, portanto, o que a marca esconde depois que o aluno já marcou a região.


## m17-02 i4 risk-hunt: transferencia-maca-mesa

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto (antes: selo no canto da região) |
|---|---|---|---|---|---|---|---|---|
| 1 Roda da maca com o bloco pousado (sob a cabeceira) | não | 78,3 % | 15,6 % | 28,6 % | 55,9 % | nenhum | maca-tras 4,7; maca 2,4; soro 5,2 % | 0 % (antes 93,2 %) |
| 2 Roda da maca com o bloco erguido (do lado dos pés) | não | 58,2 % | 29,9 % | 30,3 % | 55 % | nenhum | maca-tras 8,5; maca 2 % | 0 % (antes 52,6 %) |
| 3 Prancha de transferência encostada no pedestal | não | 41,2 % | 12,5 % | 40,4 % | 13 % | nenhum | mesa 28,2 % | 0 % (antes 43,1 %) |
| 4 Linha do soro esticada até a paciente | não | 3,3 % | 68,7 % | 1,1 % | 56,3 % | nenhum | maca 4,1; paciente 29,5; soro 4,5 % | 0 % (antes 100 %) |

## m17-03 i3 hotspot: transferencia-maca-mesa

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto (antes: selo no canto da região) |
|---|---|---|---|---|---|---|---|---|
| 1 Roda da maca com o bloco pousado (sob a cabeceira) | não | 78,3 % | 15,6 % | 28,6 % | 55,9 % | nenhum | maca-tras 4,7; maca 2,4; soro 5,2 % | 0 % (antes 93,2 %) |
| 2 Roda da maca com o bloco erguido (do lado dos pés) | sim | 58,2 % | 29,9 % | 30,3 % | 55 % | nenhum | maca-tras 8,5; maca 2 % | 0 % (antes 52,6 %) |
| 3 Vão entre maca e mesa | não | 40 % | 0,1 % | 17,8 % | 0 % | nenhum | mesa 37,2; maca 12,5; paciente 28,5 % | 0 % (antes 96 %) |
| 4 Prancha de transferência encostada no pedestal | não | 41,2 % | 12,5 % | 40,4 % | 13 % | nenhum | mesa 28,2 % | 0 % (antes 43,1 %) |

## m25-05 i4 risk-hunt: raio-x-movel-no-leito

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto (antes: selo no canto da região) |
|---|---|---|---|---|---|---|---|---|
| 1 Tubo alinhado com o detector | não | 64,5 % | 23,3 % | 15,8 % | 58,4 % | nenhum | cama 5,7; paciente 5,1; braco 8,2; feixe 5,6 % | 0 % (antes 100 %) |
| 2 Pessoa sem avental junto à cabeceira | não | 56,4 % | 31,7 % | 35 % | 42,6 % | nenhum | cama 18,8; sombra-circulante 1,2 % | 0 % (antes 29 %) |
| 3 Operador de avental atrás do aparelho | não | 49,3 % | 31,5 % | 34,5 % | 43 % | nenhum | aparelho 21; sombra-operador 1,1 % | 0 % (antes 28,1 %) |
| 4 Leito vizinho, no sentido do feixe | não | 74,9 % | 24,7 % | 74,9 % | 24,7 % | nenhum | nenhum | 0 % (antes 23,2 %) |
| 5 Detector atrás do paciente | não | 23,1 % | 0 % | 8,7 % | 8 % | nenhum | cama 42,6; paciente 16,9; feixe 1,9 % | 0 % (antes 61,5 %) |

## m25-06 i2 hotspot: trauma-raio-horizontal

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto (antes: selo no canto da região) |
|---|---|---|---|---|---|---|---|---|
| 1 Colar cervical | não | 68,8 % | 0 % | 19,5 % | 12,6 % | Feixe horizontal 6,3 % | prancha 2,2; paciente 29,9; feixe 6,3 % | 0 % (antes 100 %) |
| 2 Tubo | não | 66,2 % | 23 % | 63,5 % | 25,1 % | Feixe horizontal 0,7 % | aparelho 4,1; feixe 0,7; braco 5,9 % | 0 % (antes 42,2 %) |
| 3 Feixe horizontal | não | 39,7 % | 33,3 % | 27,5 % | 49,9 % | nenhum | maca 5,8 % | 0 % (antes 49,7 %) |
| 4 Detector em pé | sim | 53,8 % | 19 % | 43,1 % | 28,6 % | Feixe horizontal 1,7 % | paciente 18,8; feixe 1,7 % | 0 % (antes 27,5 %) |

Selo sobre o objeto de OUTRO alvo: selo 1 cobre Feixe horizontal 3,5 %.

## m21-03 i2 label: dosimetro-no-corpo

| ponto (nome declarado) | objeto na área de 44 pt do ponto | fundo | outras peças | ponto de 12 pt cobre do objeto (antes: marcador de 28 pt) | selo do número cobre do objeto |
|---|---|---|---|---|---|
| L1 Peito (tronco, sobre o avental) | 21,4 % | 3 % | pessoa 72,4 % | 27,9 % (antes 100 %) | 4,2 % |
| L2 Mão estendida (anel) | 7 % | 78,7 % | pessoa 12,4 % | 17,7 % (antes 99,9 %) | 0 % |
| L3 Olho (haste dos óculos) | 2,6 % | 73,6 % | pessoa 16,3; oculos 4,6 % | 34,7 % (antes 100 %) | 0 % |
| L4 Quadro de parede (referência) | 41,8 % | 0 % | quadro 56 % | 14 % (antes 81,6 %) | 5,9 % |

## m21-06 i2 hotspot: dosimetro-no-corpo

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto (antes: selo no canto da região) |
|---|---|---|---|---|---|---|---|---|
| 1 Peito (tronco, sobre o avental) | não | 30,4 % | 0 % | 21,4 % | 1 % | nenhum | pessoa 74,5 % | 0 % (antes 56,8 %) |
| 2 Mão estendida (anel) | sim | 7,4 % | 73,9 % | 6,2 % | 78,1 % | nenhum | pessoa 13,7 % | 0 % (antes 0 %) |
| 3 Olho (haste dos óculos) | não | 6,8 % | 32,2 % | 2,6 % | 57,8 % | nenhum | pessoa 31,8; oculos 4,5 % | 0 % (antes 100 %) |
| 4 Quadro de parede (referência) | não | 84,6 % | 12,8 % | 84,6 % | 12,8 % | nenhum | nenhum | 0 % (antes 17,3 %) |

## sem interação (visual do conceito): produto-dose-area

| alvo (nome declarado) | certa | objeto na região | fundo na região | objeto na área de toque | fundo na área | resposta errada na área | outras peças na área | selo cobre do objeto |
|---|---|---|---|---|---|---|---|---|
| 1 Câmara de medição (placa) | não | 40,8 % | 23,2 % | 27,9 % | 26,8 % | nenhum | feixeBaixo 0,8; tubo 8,3 % | 3,7 % |
| 2 Paciente deitado | não | 41,9 % | 17,2 % | 41,9 % | 17,2 % | nenhum | mesa 25,9 % | 0 % |

## Objetos que ficam mais de 50 % escondidos

Nenhum. Maiores valores com a posição nova: ponto de 12 pt sobre o dosímetro do olho (34,7 %), sobre o anel (17,7 %), sobre o crachá do tronco (27,9 %) e sobre o crachá de referência (14 %); em tocar e caça ao risco o selo cobre no máximo 5,9 % do objeto do próprio alvo (a referência, no rotular, pelo selo do número) e 3,5 % do feixe sob o colar (selo do colar, trauma). Antes (selo dentro da região e marcador de 28 pt) o construtor media 93 % da roda da cabeceira, 100 % do tubo e do colar, 100 % do crachá do olho e 99,9 % do anel.

Duas escolhas, no rotular do dosímetro: o ponto do anel (0,4844; 0,5979) e o do olho (0,2953; 0,3083) ficam na borda do próprio dosímetro, onde o ponto de 12 pt esconde menos dele (a busca testou todo pixel do objeto; com o anel novo, mais fino: anel 15,6 % no melhor ponto contra 61,5 % no centro; olho 34,7 % contra 71,3 %); o ponto do anel está 4 px (em 640 x 480) para dentro do melhor ponto, para ficar sobre o anel, e esconde 17,7 %. O centro do ponto continua sobre o objeto e dentro da região declarada. Tronco e referência ficaram no centro (27,9 % e 14 %).

## Limites

- Medidas sobre o spec renderizado no Chrome, não no `react-native-svg`; o app mede o quadro em 280 pt (telas de 320 e 358 pt dão selos um pouco menores em proporção).
- No tocar do dosímetro, "objeto" é o dosímetro (crachá, anel, quadro com a referência); a parte do corpo que o alvo nomeia (peito, mão, olho) é a peça `pessoa`, listada em "outras peças". A área do anel (resposta certa) mostra 6,2 % de anel, 13,7 % de pessoa e 78,1 % de fundo, e nenhum dosímetro errado. A região do anel é a caixa do antebraço, da mão e do anel, como mediu o parecer: (0,394; 0,454; 0,1786 x 0,1746); com o anel novo, a caixa medida é (0,394; 0,4583; 0,1732 x 0,1688), e a declarada passa dela em no máximo 0,005.
- A região do leito vizinho, do operador e da pessoa sem avental é a caixa da peça; o detector do leito aparece só em parte (o resto fica atrás do paciente, como na vida): com o brilho agora pintado no detector, antes do paciente, 23,1 % da região é detector visível (11,7 % antes), e a caixa declarada é a da parte visível, com o mínimo de 0,08 de largura.
- Transferência (m17): a maca está paralela à mesa, do lado do espectador, e a maca esconde parte do vão, que é visto por cima do tampo da mesa: a região do vão é um trecho de 0,16 x 0,094 do quadro onde a faixa escura está inteira à vista (40 % de faixa, 0,1 % de fundo). A linha do soro cruza o quadro na diagonal, e a região é um trecho dela fora do paciente (3,3 % da região é linha); a área de toque da linha mostra 29,5 % de paciente, que não é alvo do item.
