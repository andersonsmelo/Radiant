# Lote 2B: cenas isométricas da M17, M21 e M25 (fase 2, kit da skill `anatomy`)

Data: 2026-11-20. Branch `claude/figuras-fase-1`, sobre 236b66cf. Decisões F1 a F5 do controlador (`decisoes-2B.md`), mais E0, E3, E4, E6, E7 e E12 a E13 do lote 2A. A arte vem de `.superpowers/sdd/2026-11-20-figuras-fases-2-6/lote-2B/<id>/`; o kit, o selo novo do app e as cenas do 2A já estavam no repositório.

## Resumo

Cinco figuras entram, todas desenhadas em código com o kit (`scripts/content/figuras/kit/`), sem arte de terceiros e sem imagem gerada por modelo. Cada uma tem a cena em `scripts/content/figuras/cenas/<id>.mjs` (peças em `<id>.pecas.mjs`; a maca nova em `cenas/comum/maca.mjs`), a fonte versionada em `fontes/<id>.svg` (5 de 5 regeneram byte a byte; 12 de 12 no `cenas.test.mjs`), o spec gerado por `build-spec.mjs` (0 pixel diferente da fonte sobre #171920, mesma contagem de caminhos), os alvos em `content-manifest/rtg-2026/figuras/<id>.alvos.json` e a entrada em `figuras.json` (origem `anatomy`, autor "Radiant", sem licença de terceiro). Prévias finais sobre #171920, com os marcadores do app de cada interação que usa a figura (um painel por interação), em `lote-2B/<id>.png` (menos de 300 KiB cada). O que há sob cada área, medido por cor com a posição nova do selo e do marcador: [`lote-2B/medidas.md`](lote-2B/medidas.md).

| id | unidade e uso | fonte (KiB) | spec (KiB, arquivo) | caminhos |
|---|---|---|---|---|
| `transferencia-maca-mesa` | m17-02 i4 (caça ao risco), m17-03 (visual do conceito e i3, tocar) | 57,0 | 57,5 | 359 |
| `raio-x-movel-no-leito` | m25-05 i4 (caça ao risco) | 127,9 | 127,7 | 801 |
| `trauma-raio-horizontal` | m25-06 i2 (tocar) | 69,7 | 70,1 | 358 |
| `dosimetro-no-corpo` | m21-03 i2 (rotular), m21-06 i2 (tocar) | 38,1 | 38,5 | 225 |
| `produto-dose-area` | m21-04 (visual do conceito; sem item) | 48,2 | 48,6 | 258 |

Peso (refeito em 2026-11-20, depois das correções da revisão): o SVG dos cinco soma 332.641 bytes (camadas dos specs); a soma das 34 figuras importadas é 3.427.012 bytes contra o teto do teste do registro, 8.116.109 (folga de 4.689.097). Nenhuma passa de 240 KiB por figura (a maior, `raio-x-movel-no-leito`, tem 121,7 KiB de SVG no spec).

## Decisões aplicadas

- **F1/F2, código das cenas.** Cada cena exporta `gerar()` e `FONTE` (rodar o arquivo escreve a fonte); o `produto-dose-area` exporta também `pecas()`, que a medida por cor usa. O que o construtor entregava num `build.mjs` com prévia, alvos e medida em Python ficou só como geração do SVG (as réguas do app seguem conferidas no `emitir`); variáveis de ambiente (`SID`, `NSH`, `LEX`, `BX`, `BY`, `DY`, `YB`, `XD`) viraram constantes com o valor que o construtor usou. O comum que as cenas do 2B pediam (`maca.mjs`) entrou em `cenas/comum/`; `sala.mjs` e `emitir.mjs` do 2A servem às cenas da M21 (a sala dos dois dosímetros é a mesma, azimute 68). `caixas.mjs` e `documentos.mjs`, que só geravam região e texto de relatório, não entraram: as regiões estão nos `alvos.json`, medidas.
- **F3, textos.** Quatro frases deixaram de ser verdadeiras (e a ajuda da m21-06 i2, "O anel está em volta de um dedo.", virou "O anel está na mão do braço estendido." na correção da revisão) e levaram a correção mínima, sem mudar pergunta nem resposta certa (antes e depois em `itens-alterados-2B.md`, na pasta de trabalho): feedback da prancha da m17-02 i4 ("fora do chão" saiu), `where` do anel da m21-03 i2 ("em volta de um dedo" virou "na mão do braço estendido", na correção da revisão; o 2B tinha posto "em volta da mão"), prompt da m25-06 i2 ("vista pela cabeceira, em corte" virou "deitado de costas na prancha, com o colar no pescoço") e o conceito da m25-06 ("encostado ao ombro" virou "junto ao ombro"; a figura em corte virou "deitado de costas, em perspectiva"). O `aria-label` do SVG do trauma também diz "junto ao ombro" (o construtor tinha "encostado"; é a única diferença de 4 bytes entre a fonte e o `figura.svg` entregue).
- **F4, objetos pequenos.** Maiores que o real, de propósito (o que o construtor mediu): rodas da maca com 26 cm de diâmetro (real de 15 a 20) e bloco do freio de 22 cm; cabeçote e colimador 1,3 vez e detector 1,27 vez (leito) e 52 x 56 cm (trauma; real cerca de 35 x 43); crachá do tronco 24 x 16 cm (real 3 x 4), do olho 13 x 11 (1,5 x 2), anel de 9 de raio externo e 5 de altura, com parede de 4,4 (era um disco de 10,4 de raio; a mão do kit é uma luva de raio 4,4), e referência 34 x 24 (5 x 3); câmara dose-área de 36 x 36 cm. Nenhum objeto cobrado fica mais de 50 % escondido pelo selo ou pelo ponto (ver abaixo e `medidas.md`).
- **E3, parada.** `raio-x-movel-no-leito` deixou de ser a cena em laço de acervo: o spec novo não tem `periodMs`, `posterAt` nem camada móvel. Guarda em `diagramRegistry.test.ts`: o teste "cena isométrica parada" passou a cobrir `raio-x-movel-no-leito`, e foi visto falhando com o defeito que nomeia: com `periodMs: 7000` posto no spec, o teste reprova com `Received: 7000` (1 reprovado, 2 aprovados); sem ele, passa.
- **E12/E13 (selo), conferido sobre as cinco.** Nas sete listas (seis interações e o visual), nenhum selo cai sobre a área de toque de outro alvo, sobre a região ou o ponto de outro alvo, nem sobre outro selo. O toque no selo seleciona o dono (teste do app, lote 2A); não rodei simulador.
- **Pontos do rotular do dosímetro escolhidos por medida.** O ponto do anel (0,4844; 0,5979, refeito com o anel novo) e o do olho (0,2953; 0,3083) ficam na borda do próprio dosímetro: no centro o ponto de 12 pt esconderia 61,5 % do anel e 71,3 % do olho, e na borda esconde 17,7 % e 34,7 %. O centro continua sobre o objeto e dentro da região declarada; o crachá do tronco e o de referência ficaram no centro.
- **Regiões = caixa justa do objeto no desenho**, com o mínimo de 0,08 por eixo (as duas rodas, a linha do soro e o detector do trauma crescem do centro até 0,08). Nenhuma região foi inflada para o fundo. `rotulos` em `figuras/transferencia-maca-mesa.alvos.json` e `dosimetro-no-corpo.alvos.json` ligam os textos que as aulas mostram ("Roda sob a cabeceira da maca", "Dosímetro de tronco" e os demais) ao nome declarado.
- **`build-spec.mjs`.** A entrada antiga do `raio-x-movel-no-leito` (a conversão da cena em laço da skill, com `LEITO_SPLIT` e a função `leito`) saiu, com os dois imports que só ela usava (`gradientMap`, `ownDefs`; o `convert.test.mjs` continua importando de `convert.mjs`); as cinco figuras usam o molde `importada`, como as do 2A. `alt` de cada spec com até 160 caracteres.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/itens-alterados-2B.md`)

Nenhuma pergunta, nenhuma ficha, nenhuma resposta certa e nenhum retorno de acerto mudou (E7), e nenhum item foi adaptado. O único enunciado que mudou foi o `prompt` da m25-06 i2, por F3 (o que se pergunta, "Toque na parte que recebe o feixe...", é o mesmo).

- m17-02 i4 (caça ao risco, transferência): a maca passou a ficar paralela à mesa (correção da revisão, G1) e as 4 regiões foram para a caixa dos objetos redesenhados (roda com o bloco pousado, roda com o bloco erguido, prancha, trecho da linha do soro); `alvo` nas 4; as duas de risco (roda solta e linha) seguem de risco; feedback da prancha corrigido.
- m17-03 i3 (tocar, transferência): as 4 regiões foram para a caixa dos objetos redesenhados (o vão é agora o trecho visível da faixa lateral entre maca e mesa); `alvo` nas 4; a roda dos pés (bloco erguido) segue como resposta certa.
- m25-05 i4 (caça ao risco, leito): as 5 regiões foram para a caixa dos objetos novos (a do detector, depois da correção, é a da parte visível, com o brilho no detector); `alvo` nas 5; pessoa sem avental e leito vizinho seguem de risco. A pessoa passou para o lado do espectador e o leito vizinho ficou mais longe e cortado pela borda esquerda (o construtor precisou separar as áreas de toque).
- m25-06 i2 (tocar, trauma): as 4 regiões foram para a caixa dos objetos novos; `alvo` nas 4; o detector segue certo; prompt e conceito corrigidos.
- m21-03 i2 (rotular, dosímetros): os 4 pontos foram para cima dos dosímetros (tronco, anel, olho, referência); `alvo` nos 4; a ficha "Dosímetro de pé" segue sem ponto; `where` do anel corrigido ("na mão do braço estendido"); o ponto do anel foi para (0,4844; 0,5979) com o anel redesenhado.
- m21-06 i2 (tocar, dosímetros): as 4 regiões foram para a caixa das peças novas (a do quadro de parede inclui a moldura toda); `alvo` nas 4; a mão estendida (anel) segue certa; a região da mão é (0,394; 0,454; 0,1786 x 0,1746), a do olho perdeu a altura que cobria o protetor de tireoide (0,135), e a ajuda diz "O anel está na mão do braço estendido."
- m21-04 (visual do conceito, produto dose-área): nenhuma interação; só os alvos declarados (câmara e paciente) ficam registrados para uso futuro.

## Selos e marcadores medidos (resumo; tabelas completas em `lote-2B/medidas.md`)

- Selo de tocar e de caça ao risco: com a posição nova cobre no máximo 5,9 % do objeto do próprio alvo; antes (selo dentro da região, medida do construtor) cobria 93,2 % da roda da cabeceira, 96 % do vão, 100 % da linha do soro, do tubo do leito e do colar, 61,5 % do detector do leito.
- Ponto de 12 pt do rotular do dosímetro: 27,9 % do crachá do tronco, 17,7 % do anel, 34,7 % do olho e 14 % da referência (antes, marcador de 28 pt: 100 %, 99,9 %, 100 % e 81,6 %); selo do número: no máximo 5,9 % do objeto.
- **Objetos que ficaram mais de 50 % escondidos: nenhum.**
- Resposta certa contra resposta errada: em nenhuma área de toque o objeto de uma resposta errada passa de 6,3 % (feixe sob o colar), e a própria estrutura aparece mais que isso em todos os alvos.

## Figuras fora do lote

Nenhuma das cinco ficou de fora.

## Roteiros do Maestro e fora da lista do run

`figuras-no-simulador.mjs` (todos os 34 ids, `--check` com e sem ids: ok) gerou 6 roteiros novos em `radiant-app/.maestro/figuras/`: `m17-aula-02`, `m17-aula-03`, `m21-aula-03`, `m21-aula-04`, `m21-aula-06` e `m25-aula-06`, e acrescentou os 4 ids novos a `indice.json`. A lista do run (`arquivos-do-run-2B.txt`) trazia `m17-aula-01`, `m17-aula-02`, `m21-aula-02`, `m21-aula-03`, `m21-aula-05`, `m25-aula-04` e `m25-aula-05` (numeração parece ter sido deduzida de outro modo): quatro dos seis roteiros que o gerador exige (`m17-aula-03`, `m21-aula-04`, `m21-aula-06`, `m25-aula-06`) estão fora dela, e cinco da lista o gerador não toca (`m17-aula-01`, `m21-aula-02`, `m21-aula-05`, `m25-aula-04` e `m25-aula-05`, estes dois últimos já versionados e inalterados). O controlador precisa reabrir o run com os quatro caminhos acrescentados, ou o `step finish` os acusa como fora de escopo. Os roteiros do `generate-rtg-maestro.mjs` (m17, m21, m25) não mudaram. Não rodei simulador: nenhum roteiro novo foi visto rodando.

## Números dos testes (Node 20.20.2, 2026-11-20; refeitos depois das correções da revisão)

- Verificador (`rtg-lesson-lint.mjs`) nas 40 unidades: 40 de 40 OK (m17, m21 e m25 com os alvos novos).
- `build-rtg-batches.mjs --check`: ok. `generate-rtg-maestro.mjs --check` m17, m21 e m25: ok. `figuras-no-simulador.mjs --check` com os 34 ids e sem ids: ok (39 roteiros).
- `node --test` em `scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`: 502 testes, 500 passam, 1 pulado (preexistente), 1 falha: a alheia conhecida (`registerSource normalizes metadata for the pilot book`). Só os de `scripts/content/figuras`, `kit` e `cenas`: 50 testes, 49 passam, 1 pulado (o que só vale sem Chrome); `cenas.test.mjs` sozinho: 12 de 12 (as 11 cenas e o teste das réguas). Visto falhando, a guarda de regeneração: com `stroke-width="1.4"` trocado por `9` na primeira ocorrência de `fontes/dosimetro-no-corpo.svg`, `cenas.test.mjs` reprova (11 passam e 1 falha, `dosimetro-no-corpo: regenera a fonte versionada byte a byte...`); restaurada a fonte, 12 de 12.
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65.
- `cd radiant-app && EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`: 66 suítes, 1608 testes, todos passam (inclui a guarda de figura parada com o `raio-x-movel-no-leito`).
- `npx tsc --noEmit`: saída 0. `npx eslint` nos 9 arquivos de `radiant-app` tocados (os 5 specs, `rtg-2026-m17.ts`, `m21.ts`, `m25.ts` e `diagramRegistry.test.ts`): saída 0. `npm run test:maestro-contract`: 13 de 13.
- Soma de peso das figuras importadas: 3.427.012 bytes (34 figuras) contra o teto do teste, 8.116.109: dentro.
- Não rodei o `npm run quality` inteiro nem o `visual:qa:strict` (o gate completo é do controlador).

## Correções da revisão independente (2026-11-20, noite)

Parecer em [`revisoes/2B.md`](revisoes/2B.md) (copiado sem edição); decisões G1 a G4 do controlador. Antes e depois dos itens em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/itens-alterados-2B.md`; uma linha por achado em `correcao-2B-relatorio.md` (mesma pasta).

- **1 (importante), maca na ponta da mesa:** a maca ficou paralela à mesa, do lado do espectador, na mesma altura (tampo a 80 cm, mesa a 78), com 28 cm de vão lateral e a maca deslocada 90 cm para a cabeceira (se sobrepõem em 110 cm dos 160 da mesa). O vão é a faixa escura entre os lados longos; a prancha passou para a face do pedestal do lado dos pés, que a maca não esconde; o soro ficou na cabeceira, do lado do espectador. Regiões, medidas e prévias refeitas (`medidas.md`).
- **2, rodas de trás sem bloco (G2):** `comum/maca.mjs` passou a desenhar o bloco pousado (e a haste) nas duas rodas de trás quando a cena pede `calcos`; só a roda dos pés da frente tem o bloco erguido. Desse ângulo o corpo da maca esconde esses blocos: o aluno vê o disco da roda.
- **3, `alt` entregava o estado:** o `alt` do spec e o `aria-label` da fonte passaram à forma neutra do parecer ("blocos do freio nas rodas da frente, em alturas diferentes"), com 159 caracteres.
- **4 e 5 (G3), anel e regiões:** a ajuda da m21-06 i2 e o `where` do anel agora são verdadeiros no desenho; o anel é uma banda de 5 cm de altura e 4,4 de parede (antes, um disco de 10,4 de raio); regiões da mão e do olho corrigidas; a região "Paciente deitado" do `produto-dose-area` foi para a caixa da peça (0,3859; 0,6771; 0,6141 x 0,2562), sem uso em item.
- **6, brilho do detector do leito:** o brilho foi para a peça do detector, pintada antes do paciente; some o retângulo claro na frente do tronco, e a caixa do detector passou a ser a da parte visível.
- **7, detector do trauma:** não aplicado (ver "O que fica incerto").
- **8, textos:** o enunciado da m25-06 i2 que mudou está dito acima, o roteiro conta 39 e a numeração das aulas no `cenas/README.md` foi corrigida.
- **9, `caixas.mjs` e `documentos.mjs`:** aceito como está; as regiões seguem declaradas nos `alvos.json`, medidas.
- **10, processo e prévias:** os quatro roteiros fora da lista original estão no registro; o `STATUS.md` e o plano de continuidade agora citam o 2B. As prévias de caça ao risco desenham selo numerado, que o app só mostra como marca depois do toque (nota em `medidas.md`).

## O que fica incerto

- **Detector do leito (m25-05, alvo 5):** com o brilho agora no detector, pintado antes do paciente, 23,1 % da região é detector visível (11,7 % antes; o resto fica atrás do paciente, como na vida); a área de toque mostra 8,7 % de detector contra 42,6 % da cama e 16,9 % do paciente, que não são alvo do item. Continua o alvo mais fraco do lote; as outras estruturas sob o toque não são resposta errada do item.
- **Linha do soro (m17-02 i4):** fina por natureza (3,3 % da região é a linha) e atravessa a figura na diagonal, do saco ao pulso; a região é um trecho dela fora do paciente, de 0,08 x 0,08, e a área de toque mostra 29,5 % de paciente, que não é alvo do item.
- **Vão entre maca e mesa:** a faixa escura entre os lados longos, vista por cima do tampo da mesa; a maca, mais perto do espectador, a esconde em parte, e a região é o trecho de 0,16 x 0,094 onde a faixa está à vista (40 % de faixa). As rodas de trás da maca têm o bloco pousado desenhado, mas o corpo da maca o esconde desse ângulo: o aluno vê só o disco da roda.
- **Feixe do trauma:** a região do feixe é um trecho de cerca de 30 cm entre o colar e o tubo, não o feixe todo (o feixe inteiro cai sobre o colar e o detector).
- **Trauma (m25-06):** o detector continua com o centro 18 cm para os pés do pescoço (achado 7 da revisão, opcional). Com 6 cm, as áreas de toque do colar e do detector se sobrepõem e o verificador reprova ("alvos muito próximos"); o menor deslocamento que passa (16 cm) não muda nada que se veja. Não aplicado.
- Nada disto foi visto no `react-native-svg` nem no aparelho; as pessoas do kit continuam sem rosto (aceite do dono pendente desde o 2A).

## Capturas no iPhone

Medido em 2026-11-20, simulador "Radiant F7" (iPhone, 402x874 pt), dev client com Metro no Node 20 (`EXPO_NO_TYPESCRIPT_SETUP=1`), ponta eeb1ebba, roteiros de `radiant-app/.maestro/figuras/` um por vez (`clearState`, animação reduzida). O app não abortou (nenhum relatório novo em `DiagnosticReports`). Passaram sem alteração: `m17-aula-03`, `m21-aula-03`, `m21-aula-04`, `m21-aula-06`, `m25-aula-06`. Reprovaram: `m25-aula-05` e `m17-aula-02` (ver abaixo). Carga da máquina alta durante a rodada (~28 no início).

- `ios-transferencia-maca-mesa-m17-aula03-passo2.jpg` (visual): maca com o paciente paralela à mesa, do lado do espectador, com a prancha na ponta da mesa e o soro na cabeceira; blocos azuis nas rodas da frente, o da direita erguido (haste à vista) e o da esquerda pousado, e os discos das rodas de trás sem bloco visível. A figura aparece inteira sem demora, mas as rodas ficam cortadas na base pela barra Continuar (precisa rolar).
- `ios-transferencia-maca-mesa-m17-aula03-passo5.jpg` (tocar, 4 regiões): selos 1 e 2 sobre as rodas da frente, acima e fora das regiões, 3 no vão entre maca e mesa, 4 sobre a prancha, sem cobrir um ao outro. Vê-se que o bloco da roda 2 está mais alto que o da roda 1. Preocupa: o selo 3 e a região do vão ficam sobre as pernas do paciente e o canto da mesa (o vão é uma faixa escura pequena); as alternativas ficam cortadas abaixo.
- `ios-dosimetro-no-corpo-m21-aula03-passo4.jpg` (rotular, 4 pontos): pontos pequenos sobre o tronco, a mão (anel), a cabeça e o dosímetro de parede, números em selo ao lado. O anel aparece como uma banda dourada na mão (a ponta da mão), não como disco. O selo 1 encosta no tronco ao lado da ficha, sem cobrir o ponto; o ponto 3 (olho) cai na ponta da haste junto à cabeça, pequeno.
- `ios-dosimetro-no-corpo-m21-aula06-passo4.jpg` (tocar, 4 regiões): regiões do peito, da mão, da cabeça e do quadro, com selos fora delas e legíveis (o 4 cai logo abaixo do quadro). Os selos escuros têm pouco contraste com o fundo; a região da mão cobre o antebraço e o anel.
- `ios-produto-dose-area-m21-aula04-passo2.jpg` (visual): tubo, colimador, câmara em azul e feixe amarelo até o paciente deitado na mesa; legível e aparece na hora. A parte de baixo (pernas do paciente e a mesa) fica sob a barra Continuar.
- `ios-trauma-raio-horizontal-m25-aula06-passo4.jpg` (tocar, 4 regiões): paciente deitado, feixe horizontal amarelo do tubo à direita ao detector à esquerda. Selos 1 a 4 fora das regiões e sem cobrir um ao outro; a região 3 (feixe) é um trecho de ~30 cm sobre o feixe, entre o colar e o tubo; o selo 1 (colar) fica sobre a cabeça do paciente e o 4 acima do detector, que fica cortado na borda esquerda da cena.
- `ios-raio-x-movel-no-leito-m25-aula05-passo6.jpg` (tocar, várias regiões, 0 marcadas): o leito com o paciente, o aparelho móvel e as pessoas; cinco regiões sem selo numerado (item de marcar várias). A região do detector (atrás do paciente) é pequena e sobreposta ao paciente; as regiões das pessoas à esquerda e à direita ficam encostadas nas bordas da cena. Captura tirada pelo Maestro na falha do último "Continuar" do roteiro (ver abaixo); é a tela do passo 6, a figura em si.

### Roteiros que reprovaram

- `m25-aula-05` (versionado): no passo 4 (categorizar), o último toque no grupo "Se afasta da área" não classifica a ficha "Visitante da família do paciente" ("Falta 1 ficha", "Conferir resposta" não aparece). Mesma classe do defeito conhecido: a ficha fica sob a barra fixa. Rodei uma cópia FORA do repositório (`$TMPDIR/rot/m25-aula-05.yaml`) com `centerElement: true` no último `scrollUntilVisible` de ficha e dois `swipe DOWN` antes de tocar no grupo: passou até o passo 6 e a captura saiu da falha do penúltimo "Continuar" (o app já estava no passo 6). O versionado não foi alterado.
- `m17-aula-02` (versionado): mesma falha no passo 4 (categorizar), "Falta 1 ficha" com "Conferir resposta" ausente; a cópia com o mesmo ajuste não resolveu (a ficha "Cadeira parada entre a maca e a mesa" continuou sem grupo). A figura desse roteiro é a mesma `transferencia-maca-mesa`, já capturada em `m17-aula-03`; não tirei captura de `m17-aula-02`.

Fora do que isto prova: "sem demora" é a figura já presente na captura do passo, sem tela em branco em nenhuma das 7; não medi tempo de carga. Pontos pequenos e selos foram vistos em tamanho de captura, não no aparelho. Metro parado, app encerrado, simulador desligado.
