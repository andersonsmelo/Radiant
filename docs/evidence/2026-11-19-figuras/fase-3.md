# Fase 3: 14 gráficos redesenhados em código (integração de 2026-11-21)

Aprovada pelo dono em 2026-11-21 ("Sim, produza") depois da amostra de 2026-11-20. Gramática: [`docs/content/2026-11-19-gramatica-de-graficos.md`](../../content/2026-11-19-gramatica-de-graficos.md). Cada gráfico substitui o spec de mesmo `id` em `radiant-app/src/ui/diagrams/specs/`, sem arte de terceiro: desenho próprio em código, só cores da paleta do app. Por isso nenhum autor, licença ou página, e nenhuma entrada em `figuras.json` (J1). Prévias com os marcadores do app a 280 pt, sobre #171920, em [`fase-3/`](fase-3/) (todas abaixo de 75 KiB; a de `ciclo-de-testes` empilha o item de rotular e o de tocar).

## Figuras que entraram

| Figura | Unidade (onde aparece) | Camadas | SVG | Movimento |
|---|---|---|---|---|
| `espectro-de-raios-x` | m19 aula 5 (rotular) | 5 | 3,75 KiB | parada |
| `circuito-do-gerador` | m19 aula 1 (rotular) | 6 | 3,10 KiB | parada |
| `retificacao-de-onda` | m19 aula 2 (conceito) | 5 | 8,89 KiB | laço, pôster 0,8 |
| `dano-ao-dna` | m21 aula 1 (rotular) | 5 | 2,74 KiB | parada |
| `grandezas-de-dose` | m21 aula 2 (conceito) | 6 | 4,72 KiB | laço, pôster 0,75 |
| `histograma-e-lut` | m22 aula 1 (conceito e rotular) | 4 | 2,84 KiB | parada |
| `realce-e-suavizacao` | m22 aula 2 (conceito) | 5 | 2,45 KiB | laço, pôster 0,8 |
| `compressao-de-imagem` | m22 aula 5 (conceito) | 5 | 17,18 KiB | parada |
| `fluoroscopia-pulsada` | m26 aula 3 (conceito) | 5 | 2,55 KiB | laço, pôster 0,8 |
| `relaxacao-t1-t2` | m29 aula 1 (conceito e rotular) | 7 | 4,99 KiB | laço, pôster 0,8 (parada no rotular) |
| `linha-do-tempo-tr-te` | m29 aula 2 (conceito) | 5 | 2,72 KiB | laço, pôster 0,8 |
| `ciclo-de-testes` | m32 aulas 1 (conceito e rotular) e 6 (tocar) | 5 | 1,21 KiB | parada |
| `coincidencia-de-campo` | m32 aula 3 (tocar) | 5 | 0,71 KiB | parada |
| `nivel-de-referencia` | m32 aula 5 (rotular) | 5 | 1,20 KiB | parada |

Peso: 59,05 KiB de SVG nas 14 (remedido em 2026-11-21, depois das correções da revisão) (o teto de 240 KiB vale por figura; a mais pesada tem 17,18 KiB). O teto total do teste do registro (8.116.109 bytes) é das figuras importadas e não muda: o teste passa. Medido em 2026-11-21 com o Node 20.20.2.

Estado de 2026-11-21 (depois dos commits `44275c68`, `641db855`, `54a57d4e`, `64419b25` e `7fee1bf8`): os dez roteiros Maestro que a primeira integração deixou de fora (seis `-laco` e quatro de `rtg-2026/`) estão no git desde `54a57d4e` e `64419b25`, e os gates que dependiam deles passam.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/.../itens-alterados-f3.md`, fora do git)

- m21 aula 1, `label` do DNA: cinco pontos novos; `where` do Radical passa de "ponto ciano" a "à direita, o halo no trilho tracejado" (o marcador do app cobre o ponto branco inteiro, então o `where` nomeia só o que fica visível). Depois da revisão, o rastro do radical chega à fita longe da quebra dupla e o ponto do Radical vai a (226; 127).
- m22 aula 1, `label` do histograma: cinco pontos novos; `where` da curva passa de "traço amarelo em S" a "traço em S, junto ao patamar alto".
- m22 aula 2: frase de eixos no corpo ("Eixo horizontal: posição na borda; vertical: valor do pixel.").
- m26 aula 3: o corpo troca "enquanto dura a aquisição" por "Tempo na horizontal; feixe ligado na vertical."
- m29 aula 2: o corpo ganha "Tempo na horizontal; intensidade na vertical." (a revisão notou que as barras de pulso não são sinal).
- m32 aula 1, `label` da linha do tempo: quatro pontos com ajuste de até 0,02.
- m32 aula 6, `hotspot` da linha do tempo: quatro regiões em caixa justa; "Círculo azul pequeno" passa a "Círculos azuis pequenos" e cobre a faixa dos três pontos.
- m32 aula 3, `hotspot` do campo: cinco regiões novas; a do centro foi encolhida 5 unidades de cada lado (ver abaixo).
- m32 aula 3, conversa: a fala e os retornos passam de "para baixo" a "para o lado", porque o deslocamento do desenho é só lateral.
- m32 aula 5, `label` do nível de referência: quatro pontos novos; o corpo ganha "cada barra é uma sala, e a altura é o valor típico".
- Correções da revisão de 2026-11-21 (`revisoes/fase-3.md`), sem mudar pergunta nem resposta certa:
  - m29 aula 1, `label` de relaxação: os pontos de T1 curto, T1 longo, T2 curto e T2 longo (o do patamar não mudou) continuam sobre a curva que nomeiam, mas foram movidos para onde os selos não cobrem a curva de T2 nem a marca de T (distância mínima entre pontos 55 unidades); o corpo ganha "Tempo na horizontal." (79 palavras, teto 80);
  - m19 aula 5, `label` do espectro: o ponto da radiação de freamento sai de cima da tracejada e fica sobre a curva real; o `where` da energia máxima passa a "onde a curva larga toca o eixo horizontal" e o da faixa filtrada, a "à esquerda, a faixa sombreada acima da curva"; o corpo ganha "No gráfico, a energia fica na horizontal e a quantidade de fótons, na vertical." (101 palavras, teto 110);
  - m19 aula 1, `label` do circuito: o ponto do transformador de alta tensão passa ao núcleo, embaixo (0,30; 0,45); o `where` continua descrevendo o bloco;
  - m22 aula 1: o corpo troca a primeira frase por "O histograma conta pixels por valor: a altura é quantos pixels; na horizontal, o valor." (80 palavras), que diz o que cada eixo mede, sem usar "brilho" para o eixo vertical da curva em S.
- Sem mudança de aula: `grandezas-de-dose`, `compressao-de-imagem`, `retificacao-de-onda`.

## Medidas de área de toque (itens de tocar, 44 pt a 280 pt)

Renderizado o spec no quadro de pôster e contados os pixels da área de toque da resposta certa, por categoria (fundo = as duas cores mais comuns do quadro):

- `ciclo-de-testes`, aula 6, certa "Círculo ciano médio": 23% estrutura própria, 75% fundo, 0% de qualquer outra resposta, 2% fora de região (traço do eixo). Nenhum marco errado entra na área.
- `coincidencia-de-campo`, aula 3, certa "Faixa amarelada à esquerda": 100% dentro da própria faixa (a região tem 45,5 pt de largura, acima dos 44 pt, e a área de toque é a própria região), 0% de outra resposta.

Selos (posição do app): nas rotulagens, nunca cobrem o ponto rotulado. A revisão de 2026-11-21 mediu mais do que o autor: em `relaxacao-t1-t2` dois selos escondiam 39% da curva azul de T2 (1389 de 3561 px). Depois da correção (pontos 1, 2, 4 e 5 movidos, ver "Itens alterados"), nenhuma amostra da curva de T2 nem da marca de T fica sob selo (busca com as funções do app, `labelBadgeBoxes`; o selo ainda cobre trechos da curva de T1, que é a estrutura do próprio ponto). Em `circuito-do-gerador` o ponto da alta tensão passou para o núcleo, embaixo, e o selo 2 deixou de cobrir a bobina secundária; `ciclo-de-testes`, `nivel-de-referencia` e `coincidencia-de-campo` ainda têm selo sobre arte vizinha (parecer, M12), sem cobrir o ponto rotulado.

## Guardas

`diagramRegistry.test.ts`:
- **Movimento (J4):** os 8 gráficos parados não têm `periodMs`, `posterAt` nem camada móvel; os 6 em laço têm `periodMs`, `posterAt` entre 0 e 1 e de 1 a 4 camadas móveis. Vista falhando com o defeito que ela nomeia: com o `posterAt` de `relaxacao-t1-t2` apagado, o teste reprovou ("Received has value: undefined") e voltou a passar com o spec restaurado.
- **Laço sem corte (revisão de 2026-11-21, M1 e M11):** em t = 0 a cortina de cada laço cobre as pontas redondas das curvas (esquerda e direita, com o meio traço de 1,75), e o cursor da cortina nasce exatamente sobre um eixo vertical. Vistas falhando com os defeitos que elas nomeiam, restaurando os cinco specs de `7fee1bf8` (execução em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/vermelho-lacos.txt`): reprovam a cortina curta de `relaxacao-t1-t2`, `realce-e-suavizacao` e `retificacao-de-onda`, e o cursor fora do eixo de `fluoroscopia-pulsada` e `linha-do-tempo-tr-te`; com os specs corrigidos, as 491 asserções do arquivo passam. Limite: a guarda confere a cortina só nos laços cujo sinal é desenhado em `polyline`/`polygon` (a fluoroscopia desenha o sinal em `path`, e nela só o cursor é conferido).
- **Laço fechado, medido por render (não é guarda):** pixels de azul, âmbar e branco-claro em t = 0, 0,06 e 0,999 dos seis laços. Depois da correção são iguais nos três quadros (antes, t = 0 tinha de 16 a 98 px de azul ou âmbar, e o cursor de dois deles, que t = 0,999 não tinha; contagem em 2x). Quadros do fim e do começo do ciclo lado a lado em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/f3-lacos/`.

## Números dos testes (2026-11-21, Node 20.20.2)

- Gate de `7fee1bf8`, informado pelo controlador: 297 suítes e 4.599 testes.
- Depois das correções: verificador (`rtg-lesson-lint.mjs`) 40 de 40 OK; `build-rtg-batches.mjs --check`, `generate-rtg-maestro.mjs --check` (m19, m21, m22, m26, m29, m32) e `figuras-no-simulador.mjs --check`: ok.
- Jest (`src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`, `--runInBand`): 66 suítes, 1635 testes, todos verdes. Com `src/features/settings` a revisão mediu 68 suítes e 1650 testes em `7fee1bf8`.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam; falha só `registerSource normalizes metadata for the pilot book` (alheia e conhecida).
- `tsc --noEmit` e `eslint` nos arquivos TypeScript tocados: saída 0. `npm run test:maestro-contract`: 13 de 13. `test:copy-style-contract`: 65 de 65. `docs-contract`: passou.

## O que ficou pendente (2026-11-21)

- Frase de eixos de `retificacao-de-onda` (m19 aula 2, corpo com 78 palavras, teto 80 com `visual`): só coube "Horizontal: tempo." sem o vertical, e para a frase inteira seria preciso cortar ensino. Os eixos ficam só no `alt` e na gramática; decisão do controlador (subir o teto, cortar texto ou aceitar).
- Menores do parecer não aplicados: M8 (margens da gramática em `relaxacao-t1-t2`, `fluoroscopia-pulsada` e `linha-do-tempo-tr-te`: mover as origens muda todas as coordenadas dos alvos da relaxação, e o parecer a chama de estética) e M10 (`scripts/content/figuras/alvos-preview.mjs` não serve a figura de código; o arquivo está fora da lista do run). M4 (selos 3 e 4 e a rede, no circuito) e M12 são observações sem correção sugerida.
