# Lote 2B: cenas isométricas da M17, M21 e M25 (fase 2, kit da skill `anatomy`)

Data: 2026-11-20. Branch `claude/figuras-fase-1`, sobre 236b66cf. Decisões F1 a F5 do controlador (`decisoes-2B.md`), mais E0, E3, E4, E6, E7 e E12 a E13 do lote 2A. A arte vem de `.superpowers/sdd/2026-11-20-figuras-fases-2-6/lote-2B/<id>/`; o kit, o selo novo do app e as cenas do 2A já estavam no repositório.

## Resumo

Cinco figuras entram, todas desenhadas em código com o kit (`scripts/content/figuras/kit/`), sem arte de terceiros e sem imagem gerada por modelo. Cada uma tem a cena em `scripts/content/figuras/cenas/<id>.mjs` (peças em `<id>.pecas.mjs`; a maca nova em `cenas/comum/maca.mjs`), a fonte versionada em `fontes/<id>.svg` (5 de 5 regeneram byte a byte; 12 de 12 no `cenas.test.mjs`), o spec gerado por `build-spec.mjs` (0 pixel diferente da fonte sobre #171920, mesma contagem de caminhos), os alvos em `content-manifest/rtg-2026/figuras/<id>.alvos.json` e a entrada em `figuras.json` (origem `anatomy`, autor "Radiant", sem licença de terceiro). Prévias finais sobre #171920, com os marcadores do app de cada interação que usa a figura (um painel por interação), em `lote-2B/<id>.png` (menos de 300 KiB cada). O que há sob cada área, medido por cor com a posição nova do selo e do marcador: [`lote-2B/medidas.md`](lote-2B/medidas.md).

| id | unidade e uso | fonte (KiB) | spec (KiB, arquivo) | caminhos |
|---|---|---|---|---|
| `transferencia-maca-mesa` | m17-02 i4 (caça ao risco), m17-03 (visual do conceito e i3, tocar) | 50,7 | 51,1 | 327 |
| `raio-x-movel-no-leito` | m25-05 i4 (caça ao risco) | 127,9 | 127,7 | 801 |
| `trauma-raio-horizontal` | m25-06 i2 (tocar) | 69,7 | 70,1 | 358 |
| `dosimetro-no-corpo` | m21-03 i2 (rotular), m21-06 i2 (tocar) | 38,1 | 38,4 | 224 |
| `produto-dose-area` | m21-04 (visual do conceito; sem item) | 48,2 | 48,6 | 258 |

Peso: o SVG dos cinco soma 326.262 bytes (os specs); a soma das 34 figuras importadas é 3.420.633 bytes contra o teto do teste do registro, 8.116.109 (folga de 4.695.476). Nenhuma passa de 240 KiB por figura (a maior, `raio-x-movel-no-leito`, tem 121,7 KiB de SVG no spec).

## Decisões aplicadas

- **F1/F2, código das cenas.** Cada cena exporta `gerar()` e `FONTE` (rodar o arquivo escreve a fonte); o `produto-dose-area` exporta também `pecas()`, que a medida por cor usa. O que o construtor entregava num `build.mjs` com prévia, alvos e medida em Python ficou só como geração do SVG (as réguas do app seguem conferidas no `emitir`); variáveis de ambiente (`SID`, `NSH`, `LEX`, `BX`, `BY`, `DY`, `YB`, `XD`) viraram constantes com o valor que o construtor usou. O comum que as cenas do 2B pediam (`maca.mjs`) entrou em `cenas/comum/`; `sala.mjs` e `emitir.mjs` do 2A servem às cenas da M21 (a sala dos dois dosímetros é a mesma, azimute 68). `caixas.mjs` e `documentos.mjs`, que só geravam região e texto de relatório, não entraram: as regiões estão nos `alvos.json`, medidas.
- **F3, textos.** Quatro frases deixaram de ser verdadeiras e levaram a correção mínima, sem mudar pergunta nem resposta certa (antes e depois em `itens-alterados-2B.md`, na pasta de trabalho): feedback da prancha da m17-02 i4 ("fora do chão" saiu), `where` do anel da m21-03 i2 ("em volta de um dedo" virou "em volta da mão"), prompt da m25-06 i2 ("vista pela cabeceira, em corte" virou "deitado de costas na prancha, com o colar no pescoço") e o conceito da m25-06 ("encostado ao ombro" virou "junto ao ombro"; a figura em corte virou "deitado de costas, em perspectiva"). O `aria-label` do SVG do trauma também diz "junto ao ombro" (o construtor tinha "encostado"; é a única diferença de 4 bytes entre a fonte e o `figura.svg` entregue).
- **F4, objetos pequenos.** Maiores que o real, de propósito (o que o construtor mediu): rodas da maca com 26 cm de diâmetro (real de 15 a 20) e bloco do freio de 22 cm; cabeçote e colimador 1,3 vez e detector 1,27 vez (leito) e 52 x 56 cm (trauma; real cerca de 35 x 43); crachá do tronco 24 x 16 cm (real 3 x 4), do olho 13 x 11 (1,5 x 2), anel de 10,4 de raio e referência 34 x 24 (5 x 3); câmara dose-área de 36 x 36 cm. Nenhum objeto cobrado fica mais de 50 % escondido pelo selo ou pelo ponto (ver abaixo e `medidas.md`).
- **E3, parada.** `raio-x-movel-no-leito` deixou de ser a cena em laço de acervo: o spec novo não tem `periodMs`, `posterAt` nem camada móvel. Guarda em `diagramRegistry.test.ts`: o teste "cena isométrica parada" passou a cobrir `raio-x-movel-no-leito`, e foi visto falhando com o defeito que nomeia: com `periodMs: 7000` posto no spec, o teste reprova com `Received: 7000` (1 reprovado, 2 aprovados); sem ele, passa.
- **E12/E13 (selo), conferido sobre as cinco.** Nas sete listas (seis interações e o visual), nenhum selo cai sobre a área de toque de outro alvo, sobre a região ou o ponto de outro alvo, nem sobre outro selo. O toque no selo seleciona o dono (teste do app, lote 2A); não rodei simulador.
- **Pontos do rotular do dosímetro escolhidos por medida.** O ponto do anel (0,4813; 0,6) e o do olho (0,2953; 0,3083) ficam na borda do próprio dosímetro: no centro o ponto de 12 pt esconderia 55,8 % do anel e 71,3 % do olho, e na borda esconde 16,1 % e 34,7 %. O centro continua sobre o objeto e dentro da região declarada; o crachá do tronco e o de referência ficaram no centro.
- **Regiões = caixa justa do objeto no desenho**, com o mínimo de 0,08 por eixo (as duas rodas, a linha do soro e o detector do trauma crescem do centro até 0,08). Nenhuma região foi inflada para o fundo. `rotulos` em `figuras/transferencia-maca-mesa.alvos.json` e `dosimetro-no-corpo.alvos.json` ligam os textos que as aulas mostram ("Roda sob a cabeceira da maca", "Dosímetro de tronco" e os demais) ao nome declarado.
- **`build-spec.mjs`.** A entrada antiga do `raio-x-movel-no-leito` (a conversão da cena em laço da skill, com `LEITO_SPLIT` e a função `leito`) saiu, com os dois imports que só ela usava (`gradientMap`, `ownDefs`; o `convert.test.mjs` continua importando de `convert.mjs`); as cinco figuras usam o molde `importada`, como as do 2A. `alt` de cada spec com até 160 caracteres.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/itens-alterados-2B.md`)

Nenhuma pergunta, nenhum enunciado de pergunta, nenhuma ficha, nenhuma resposta certa e nenhum retorno de acerto mudou (E7), e nenhum item foi adaptado.

- m17-02 i4 (caça ao risco, transferência): as 4 regiões foram para a caixa dos objetos novos (roda com o bloco pousado, roda com o bloco erguido, prancha, linha do soro); `alvo` nas 4; as duas de risco (roda solta e linha) seguem de risco; feedback da prancha corrigido.
- m17-03 i3 (tocar, transferência): as 4 regiões foram para a caixa dos objetos novos; `alvo` nas 4; a roda dos pés (bloco erguido) segue como resposta certa.
- m25-05 i4 (caça ao risco, leito): as 5 regiões foram para a caixa dos objetos novos; `alvo` nas 5; pessoa sem avental e leito vizinho seguem de risco. A pessoa passou para o lado do espectador e o leito vizinho ficou mais longe e cortado pela borda esquerda (o construtor precisou separar as áreas de toque).
- m25-06 i2 (tocar, trauma): as 4 regiões foram para a caixa dos objetos novos; `alvo` nas 4; o detector segue certo; prompt e conceito corrigidos.
- m21-03 i2 (rotular, dosímetros): os 4 pontos foram para cima dos dosímetros (tronco, anel, olho, referência); `alvo` nos 4; a ficha "Dosímetro de pé" segue sem ponto; `where` do anel corrigido.
- m21-06 i2 (tocar, dosímetros): as 4 regiões foram para a caixa das peças novas (a do quadro de parede inclui a moldura toda); `alvo` nas 4; a mão estendida (anel) segue certa.
- m21-04 (visual do conceito, produto dose-área): nenhuma interação; só os alvos declarados (câmara e paciente) ficam registrados para uso futuro.

## Selos e marcadores medidos (resumo; tabelas completas em `lote-2B/medidas.md`)

- Selo de tocar e de caça ao risco: com a posição nova cobre no máximo 5,9 % do objeto do próprio alvo; antes (selo dentro da região, medida do construtor) cobria 93,2 % da roda da cabeceira, 96 % do vão, 100 % da linha do soro, do tubo do leito e do colar, 61,5 % do detector do leito.
- Ponto de 12 pt do rotular do dosímetro: 27,9 % do crachá do tronco, 16,1 % do anel, 34,7 % do olho e 14 % da referência (antes, marcador de 28 pt: 100 %, 99,9 %, 100 % e 81,6 %); selo do número: no máximo 5,9 % do objeto.
- **Objetos que ficaram mais de 50 % escondidos: nenhum.**
- Resposta certa contra resposta errada: em nenhuma área de toque o objeto de uma resposta errada passa de 6,3 % (feixe sob o colar), e a própria estrutura aparece mais que isso em todos os alvos.

## Figuras fora do lote

Nenhuma das cinco ficou de fora.

## Roteiros do Maestro e fora da lista do run

`figuras-no-simulador.mjs` (todos os 34 ids, `--check` com e sem ids: ok) gerou 6 roteiros novos em `radiant-app/.maestro/figuras/`: `m17-aula-02`, `m17-aula-03`, `m21-aula-03`, `m21-aula-04`, `m21-aula-06` e `m25-aula-06`, e acrescentou os 4 ids novos a `indice.json`. A lista do run (`arquivos-do-run-2B.txt`) trazia `m17-aula-01`, `m17-aula-02`, `m21-aula-02`, `m21-aula-03`, `m21-aula-05`, `m25-aula-04` e `m25-aula-05` (numeração parece ter sido deduzida de outro modo): quatro dos seis roteiros que o gerador exige (`m17-aula-03`, `m21-aula-04`, `m21-aula-06`, `m25-aula-06`) estão fora dela, e cinco da lista o gerador não toca (`m17-aula-01`, `m21-aula-02`, `m21-aula-05`, `m25-aula-04` e `m25-aula-05`, estes dois últimos já versionados e inalterados). O controlador precisa reabrir o run com os quatro caminhos acrescentados, ou o `step finish` os acusa como fora de escopo. Os roteiros do `generate-rtg-maestro.mjs` (m17, m21, m25) não mudaram. Não rodei simulador: nenhum roteiro novo foi visto rodando.

## Números dos testes (Node 20.20.2, 2026-11-20)

- Verificador (`rtg-lesson-lint.mjs`) nas 40 unidades: 40 de 40 OK (m17, m21 e m25 com os alvos novos).
- `build-rtg-batches.mjs --check`: ok. `generate-rtg-maestro.mjs --check` m17, m21 e m25: ok. `figuras-no-simulador.mjs --check` com os 34 ids e sem ids: ok (40 roteiros).
- `node --test` em `scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`: 502 testes, 500 passam, 1 pulado (preexistente), 1 falha: a alheia conhecida (`registerSource normalizes metadata for the pilot book`). Só os de `scripts/content/figuras`, `kit` e `cenas`: 50 testes, 49 passam, 1 pulado (o que só vale sem Chrome); `cenas.test.mjs` sozinho: 12 de 12 (as 11 cenas e o teste das réguas). Visto falhando, a guarda de regeneração: com `stroke-width="1.4"` trocado por `9` na primeira ocorrência de `fontes/dosimetro-no-corpo.svg`, `cenas.test.mjs` reprova (11 passam e 1 falha, `dosimetro-no-corpo: regenera a fonte versionada byte a byte...`); restaurada a fonte, 12 de 12.
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65.
- `cd radiant-app && EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`: 66 suítes, 1607 testes, todos passam (inclui a guarda de figura parada com o `raio-x-movel-no-leito`).
- `npx tsc --noEmit`: saída 0. `npx eslint` nos 9 arquivos de `radiant-app` tocados (os 5 specs, `rtg-2026-m17.ts`, `m21.ts`, `m25.ts` e `diagramRegistry.test.ts`): saída 0. `npm run test:maestro-contract`: 13 de 13.
- Soma de peso das figuras importadas: 3.420.633 bytes (34 figuras) contra o teto do teste, 8.116.109: dentro.
- Não rodei o `npm run quality` inteiro nem o `visual:qa:strict` (o gate completo é do controlador).

## O que fica incerto

- **Detector do leito (m25-05, alvo 5):** só 11,7 % da região é detector visível (o resto fica atrás do paciente, como na vida); a área de toque mostra 5,7 % de detector contra 35 % da cama e 17 % do paciente, que não são alvo do item. É o alvo mais fraco do lote; as outras estruturas sob o toque não são resposta errada do item.
- **Linha do soro (m17-02 i4):** fina por natureza (2 % da região é a linha). O aluno a vê, mas ela é discreta; a região tem o mínimo de 0,08.
- **Vão entre maca e mesa:** a figura mais abstrata do conjunto (uma tira escura entre o colchão e o tampo).
- **Feixe do trauma:** a região do feixe é um trecho de cerca de 30 cm entre o colar e o tubo, não o feixe todo (o feixe inteiro cai sobre o colar e o detector).
- **`help` da m21-06 i2** ainda diz "O anel está em volta de um dedo." (a mão do kit é uma luva); não estava na lista de correções.
- Nada disto foi visto no `react-native-svg` nem no aparelho; as pessoas do kit continuam sem rosto (aceite do dono pendente desde o 2A).
