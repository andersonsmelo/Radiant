# Lote 2A: cenas isométricas da M17 e da M19 (fase 2, kit da skill `anatomy`)

Data: 2026-11-20. Branch `claude/figuras-fase-1`, sobre 842ac5a2. Decisões do controlador E0 a E8 (pedido do dono de 2026-11-20, "continue precisamos finalizar o planejamento sem interrupções").

## Resumo

Seis figuras entram, todas desenhadas em código com o kit isométrico da skill `anatomy` (`scripts/content/figuras/kit/`), sem arte de terceiros e sem imagem gerada por modelo. Cada uma tem a cena em `scripts/content/figuras/cenas/<id>.mjs`, a fonte versionada em `scripts/content/figuras/fontes/<id>.svg` (gerada pela cena; 6 de 6 regeneram byte a byte, teste `cenas.test.mjs`), o spec gerado por `build-spec.mjs`, os alvos em `content-manifest/rtg-2026/figuras/<id>.alvos.json` e a entrada em `figuras.json` (origem `anatomy`, autor "Radiant", sem licença de terceiro, com o caminho da receita). Prévias finais sobre #171920, com os marcadores do app da interação que usa a figura, em `lote-2A/<id>.png`. O que há sob cada área de toque, medido por cor: [`lote-2A/medidas.md`](lote-2A/medidas.md).

| id | unidade e uso | fonte (KiB) | spec (KiB) | caminhos |
|---|---|---|---|---|
| `tubo-raios-x` | m19-03 i2 (rotular), m19-06 i2 (hotspot) | 19,1 | 18,1 | 102 |
| `tubo-emitindo` | m19-03 (visual do conceito; sem item) | 20,6 | 19,6 | 112 |
| `anodo-giratorio` | m19-04 e m19-06 (visual do conceito; sem item) | 17,2 | 16,4 | 76 |
| `conferencia-de-identidade` | m17-01 i2 (rotular) | 62,5 | 59,5 | 377 |
| `pontos-de-contato-da-sala` | m17-04 i2 (hotspot) | 47,8 | 45,2 | 346 |
| `itens-de-emergencia-da-sala` | m17-05 i2 (rotular), m17-06 i2 (hotspot) | 32,5 | 30,7 | 233 |

Peso: o spec das seis soma 171,5 KiB (175.990 bytes); a soma de todas as 29 figuras importadas é 3.094.371 bytes contra o teto do teste do registro, 8.116.109 (folga de 5.021.738). Nenhuma passa do teto de 240 KiB por figura (a maior das seis, `conferencia-de-identidade`, tem 59,5 KiB).

## Decisões aplicadas

- **E11, selo e marcador fora do objeto (commits 4bd7adce, 12a22b42 e 8f463dc2, outro agente).** O selo de tocar (36 x 24 pt) fica fora da região; no rotular, o ponto virou um ponto de 12 pt sobre o alvo, e o número vai num selo ao lado. Os selos de um item são postos em conjunto (`badgeBoxes` e `labelBadgeBoxes`), com oito posições candidatas, sem selo sobre selo e evitando cobrir outra região. A área de toque de 44 pt não mudou. As asserções novas foram vistas falhando antes, cada uma com o defeito que nomeia (13 de 42 testes reprovaram em `hotspotTouch.test.ts`, `HotspotStepRenderer.test.tsx`, `LabelStepRenderer.test.tsx` e `RiskHuntStepRenderer.test.tsx` com a regra antiga): por exemplo, "o selo do número e a marca de selecionado ficam fora da região, inteiros no quadro" (selo dentro da região), "o marcador tem de 10 a 12 pt, centrado no ponto, e o número vai num selo fora do marcador" (o vermelho dessa asserção saiu por falta do `testID` e foi refeito na correção da revisão: ver abaixo, achado 5; o defeito "marcador grande" foi visto falhando no teste de `LABEL_DOT`, `Received: 28`) e, no `badgeBox`, "prefere ACIMA da região" (esperava a base do selo em 105 pt e veio 129), "sem espaço acima, vai ABAIXO", "à ESQUERDA" e "à DIREITA". As prévias e as medidas deste lote foram refeitas com a posição final (conjunto de selos); o efeito nas medidas está na seção "Itens alterados" e em `lote-2A/medidas.md`.
- **E9, geometria da skill sob MIT.** `iso-kit.mjs`, `lathe.mjs` e `tube.mjs` da skill `anatomy` (MIT, Copyright (c) 2026 Ryan) estão copiados sem alteração em `scripts/content/figuras/kit/vendor/anatomy/`, com o `LICENSE` e um `README.md` com origem, data e sha256; o kit e as cenas importam de lá e os testes rodam sem a skill.
- **E10, fixtures de conteúdo.** `rtg-formatos.test.mjs`, `rtg-lesson-lint.test.mjs` e `fixtures/unidade-formatos.json` usavam `tubo-raios-x` como figura de código; passaram a usar `sala-com-riscos`, sem mudar o que cada teste prova.

- **E3, figuras paradas:** `tubo-emitindo` e `anodo-giratorio` deixaram de ser laço (sem `periodMs`, `posterAt` nem camada móvel). O giro do ânodo se lê pela seta, pelas marcas radiais e pelo trecho aquecido da pista. Guarda nova em `diagramRegistry.test.ts` (as duas, imported e sem laço), vista falhando com o defeito que ela nomeia: com `periodMs: 4800` posto no spec do `anodo-giratorio`, o teste reprova com `Expected: undefined / Received: 4800`; sem ele, passa.
- **E5, ângulo do alvo do ânodo exagerado para 22 graus** (o real vai de 7 a 17), para o bisel aparecer no tamanho do app; dimensões do tubo esquemáticas (ampola de 41 cm contra 30 a 35 reais; disco de 14,4 cm). Elétrons em linha reta e paralela ao eixo: simplificação. Registrado na entrada de `figuras.json` e no cabeçalho do spec.
- **E4, regiões declaradas e de aula = caixa justa do objeto**, com o mínimo de 0,08 por eixo; nunca do tamanho da área de toque, nunca esticadas. `conferencia-de-identidade`: a pulseira (caixa de 0,056 x 0,077) cresce, centrada, ao mínimo de 0,08 x 0,08; as demais caixas são as do desenho. Os pontos de rotular ficam sobre o objeto que nomeiam.
- **Objetos pequenos das cenas da m17 maiores que o real, de propósito** (decisão R12 do controlador), para o marcador do app (28 pt) e o selo (36 x 24 pt) esconderem menos:

| cena | objeto | antes (rodada 2 do construtor) | agora | real aproximado |
|---|---|---|---|---|
| conferência | pulseira | 10 cm de largura, raio 6,2 cm | 20 cm, raio 8 cm | 2,5 cm, raio 3 cm |
| conferência | folha do pedido | 28 x 36 cm, de perfil | 40 x 52 cm, virada para o espectador | A4: 21 x 30 cm |
| conferência | tela | 56 x 40 cm | 84 x 60 cm (pedestal junto) | cerca de 50 x 30 cm |
| contato | maçaneta | alavanca de 38 cm | 58 cm, espelho de 15 x 36 cm | 16 cm |
| contato | barra de apoio | 68 cm, 4 cm de diâmetro | 92 cm, 8,4 cm | cerca de 50 cm, 3 cm |
| contato | manopla do tubo | 26 x 23 cm, 4 cm | 36 x 36 cm, 9 cm | cerca de 14 cm |
| contato | teclado e mesa do comando | 72 x 30 cm; mesa de 108 cm | 88 x 36 cm; mesa de 124 cm | 45 x 15 cm |
| emergência | saída de oxigênio | placa de 65 x 68 cm | 84 x 88 cm | cerca de 10 cm |
| emergência | botão de chamada | placa de 51 x 58 cm; cordão de 70 cm | 75 x 85 cm; cordão de 42 cm | cerca de 8 cm |
| emergência | telefone | 54 x 78 cm | 64 x 92 cm | |

## Itens alterados (uma linha cada; antes e depois em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/itens-alterados-2A.md`)

Nenhuma pergunta, nenhum enunciado, nenhuma ficha, nenhuma resposta certa e nenhum retorno mudou (E7), e nenhum item foi adaptado: toda ficha e toda região continuam cobradas. Mudou a posição de cada alvo, o campo `alvo` que o prende à região declarada e duas frases de localização.

- m17-01 i2 (rotular, conferência de identidade): os 4 pontos foram para cima da pulseira, da folha, da tela e da cabeça da arte nova; `alvo` nos 4.
- m17-04 i2 (hotspot, pontos de contato): as 5 regiões foram para a caixa dos objetos novos (maçaneta, apoio do receptor, mesa, manopla, teclado); `alvo` nas 5; as duas certas (apoio e mesa) seguem certas.
- m17-05 i2 (rotular, itens de emergência): os 5 pontos foram para porta, carrinho, oxigênio, botão e telefone da arte nova; `alvo` nos 5 (a ficha "Telefone" liga-se ao alvo "Telefone da parede" por `rotulos`).
- m17-06 i2 (hotspot, itens de emergência): as 5 regiões foram para a caixa dos objetos novos; `alvo` nas 5; as duas certas (botão e telefone) seguem certas.
- m19-03 i2 (rotular, tubo de raios X): os 4 pontos foram para a arte nova (cátodo 0,339; 0,372, ânodo 0,580; 0,200, janela 0,537; 0,508, ampola 0,350; 0,160); `alvo` nos 4; os dois `where` que descreviam a arte antiga foram corrigidos ("à direita, o bloco inclinado de borda branca" virou "à direita, o disco com a face inclinada, ligado a uma haste"; "embaixo à direita, a abertura no vidro" virou "embaixo, a abertura redonda no vidro, de onde sai o feixe").
- m19-06 i2 (hotspot, tubo de raios X): as 4 regiões foram para a caixa das peças novas (a do ânodo cresceu de 0,13 x 0,24 para 0,458 x 0,265, porque o ânodo agora é disco, rotor e haste); `alvo` nas 4; o ânodo segue como resposta certa.
- **Texto que não mudou e merece decisão do controlador:** m19-04 diz, na fala da Duda, "Vi no desenho que o disco gira"; a figura agora é parada e mostra o giro por uma seta. A frase segue verdadeira, mas a figura só se lê inteira com a explicação da seta e do trecho aquecido, que não coube no corpo do conceito (80 palavras, o máximo do verificador com `visual`).

## Figuras fora do lote

Nenhuma das seis ficou de fora. `radiografia-roteiro` saiu do lote 2A por decisão R13 do controlador (imagem raster não cabe no spec; troca de interação da m23): é outro lote.

## Registro de arquivos e réguas

- `figuras.json`: 6 entradas novas, origem `anatomy`, com `fonte`, `author: "Radiant"`, `license`, `receita` e `modification`. O teste do registro e o `rtg-figuras.test.mjs` aceitam a origem (a figura `art: 'imported'` registrada como `codigo` é barrada; as seis estão como `anatomy`).
- `diagramRegistry.ts` não mudou: os seis ids já estavam registrados e o spec gerado exporta o mesmo nome (`tuboRaiosX`, `tuboEmitindo`, `anodoGiratorio`, `conferenciaDeIdentidade`, `pontosDeContatoDaSala`, `itensDeEmergenciaDaSala`).
- `alt` de cada spec em até 160 caracteres (o teto do registro); os `alt` sugeridos pelo construtor passavam disso e foram encurtados.
- `.maestro/figuras/indice.json` ganhou os 6 ids; os roteiros novos são `m17-aula-01`, `m17-aula-04`, `m17-aula-05`, `m17-aula-06`, `m19-aula-03`, `m19-aula-04` e `m19-aula-06`; os de `generate-rtg-maestro` (m17 e m19) não mudaram. `radiant-app/scripts/copy-style-baseline.json` não mudou (nenhuma figura nova tem crédito de terceiro).

## Correções da revisão independente (2026-11-20, decisões E12 a E15)

Revisão: `.superpowers/sdd/2026-11-20-figuras-fases-2-6/revisao-2A.md`, sobre `14a15897`. Relatório linha a linha: `correcao-2A-relatorio.md` na mesma pasta. O vermelho de cada asserção nova está em `vermelho-selo.txt` (seções "Correção do 2A").

**Importantes (achados 1 a 7)**
- **Achados 1 e 2, E12.** `pick` de `hotspotTouch.ts` escolhe a posição pela ordem de gravidade: selo já posto, o que os outros alvos mostram (região ou ponto) e a área de toque de 44 pt dos outros alvos, com 4 pt de margem. A primeira posição livre das três ganha; sem livre, a de menor área nessa ordem. Na régua de 280 pt, nos 89 itens e 396 selos das 40 unidades: **selos sobre a área de toque de outro alvo 66 → 12 (itens com isso 19 → 6); selos "tão perto de outro ponto quanto do próprio" 11 → 0; selos sobre ponto ou região de outro alvo 0 → 0.** Em 320 pt: 30 → 0 e 8 → 0; em 358 pt: 20 → 0 (e 0 → 0). Os 12 selos que sobram não têm posição livre entre as oito (itens de pontos muito juntos) e valem a de menor área. Guarda de conteúdo em `hotspotTouch.test.ts`: percorre os 89 itens e exige que nenhum selo de rotular fique a menos de 8 pt de outro ponto além da distância ao próprio, que nenhum selo de tocar encoste (3 pt) em outra região e que o "5" do m17-05 fique fora da área do botão.
- **Achado 2, antes e depois** (fração da caixa declarada do alvo do OUTRO ponto coberta pelo selo, em 280 pt; `figuras/<id>.alvos.json`):

| item (figura) | selo e alvo coberto | antes (`14a15897`) | depois |
|---|---|---|---|
| m24-03 i2 (`femur-proximal-e-quadril`) | selo 2 (colo) sobre a cabeça do fêmur | 33,3 % | 0 % |
| m18-03 i2 (`coluna-regioes`) | selo 4 (sacro) sobre a região lombar | 29,2 % | 0 % |
| m20-03 i2 (`trato-digestivo`) | selo 2 (fígado) sobre o estômago | 27,7 % | 0 % |
| m25-02 i2 (`linhas-do-cranio`) | selo 2 sobre o plano sagital mediano | 24,6 % | **24,6 %** |
| m20-04 i2 (`sistema-urinario`) | selo 3 (bexiga) sobre o ureter esquerdo | 22,2 % | **22,2 %** |
| m20-03 i2 | selo 6 (intestino grosso) sobre o intestino delgado | 15,8 % | 0 % |
| m20-03 i2 | selo 4 sobre o intestino delgado | 14 % | **14 %** |
| m18-05 i2 (`marcos-de-superficie`) | selo 4 (sínfise) sobre o trocânter maior | 14,2 % | 0 % |
| m24 i2 (`joelho-frente-e-perfil`) | selo 3 sobre os côndilos da tíbia | 11,5 % | 0 % |
| m17-05 i2 (`itens-de-emergencia-da-sala`) | selo 5 (telefone) sobre o botão de chamada | 10,5 % (18,7 % do objeto) | 9,8 % da caixa (0 % da área de toque dele) |
| m18-03 i2 | selo 3 sobre a região torácica | 0 % | **14,9 %** (custo novo) |

  O que não resolveu: o app só recebe os pontos do rotular, não a caixa do alvo (`alvo` só existe no conteúdo), então o selo evita a área de 44 pt dos vizinhos e não a estrutura deles. Linhas em negrito: caem em estrutura que não está perto de ponto nenhum (plano sagital, ureter, delgado). Fechar isso pede levar a caixa do alvo ao payload do rotular (`learningActivity.ts`, o gerador de lotes): arquivo fora do run, fica para o dono. A m18-03 (coluna), que tinha a exceção provisória dos marcadores ao lado, deve ser revista no simulador.
- **Achado 3 (menor, aplicado).** A margem de 4 pt em volta da área de toque dos outros alvos vale também para tocar; guarda de conteúdo acima (nenhum selo a menos de 3 pt de outra região, 14 antes, 0 depois).
- **Achado 4, E13 e o selo do rotular.** Os selos de tocar, da marca de selecionado, da caça ao risco e do rotular deixaram de ser filhos da região ou do ponto: o selo fica fora da caixa dela, onde o toque nativo do filho não chega. Agora são irmãos desenhados depois de todas as regiões, cada um com o próprio `onPress` do dono, fora da árvore de acessibilidade (a região, o ponto e a lista continuam sendo o caminho do leitor de tela). Testes: o selo não é descendente de nenhuma região ou ponto e o toque nele seleciona o dono e só ele; depois de conferir não seleciona nada. No rotular, depois da conferência o ícone de veredito caiu de 16 para 14 pt e o vão de 8 para 2 pt (um dígito de 12 pt, 4 pt de borda, 2 de vão e 14 de ícone cabem nos 36 pt); como o selo agora é absoluto no quadro, o desconto da borda de 2 pt contra 3 pt da região selecionada deixou de existir. **Não visto no aparelho:** o toque real no selo fora do pai (iOS e Android) e o encaixe do número com o ícone.
- **Achado 5, E14.** O teste do renderer de rotular "o marcador tem de 10 a 12 pt" tinha falhado por falta de `testID`, e esta evidência dizia o contrário. Refeito: com `label-point-marker-N` já no componente e `LABEL_DOT = 28` posto de volta só para a execução, ele reprova com `Expected: <= 12 / Received: 28`. A frase da seção "Decisões aplicadas" sobre o vermelho foi corrigida.
- **Achado 6.** O teste-espelho ("um item de uma região só dá o mesmo selo que o de antes") foi removido; o de `offset` virou o do estilo absoluto do selo.
- **Achado 7.** A guarda de conteúdo dos 89 itens (achado 1) cobre os achados 1 e 2 até onde o app enxerga; foi vista falhando com os selos de `14a15897` (m17-05 selo 5 perto do ponto 4, m18, m20, m23, m24, m28, m32).

**Menores (achados 8 a 13)**
- **8, oxigênio verde (aplicado).** `itens-de-emergencia-da-sala`: anel e encaixe da saída de oxigênio em verde (`#3FA66A`, borda `#A6E3BC`, registrados em `paleta.mjs` e `sala.mjs`); o `where` do m17-05 passou a "um círculo verde no meio"; fonte, spec e lote regerados. A norma ABNT de cores não foi aberta (a cor segue a revisão, "a conferir").
- **9, pulseira (aplicado, sem mudar o desenho).** O ponto 1 do m17-01 desceu de y 0,4966 para 0,5237, para a borda de baixo da faixa: o ponto de 12 pt esconde 33 % da faixa (antes 64,5 %, pela mesma medida), sempre sobre ela. Mover para os lados não cabe: a área de 44 pt tocaria a do ponto da cabeça ou a do pedido.
- **10, tubo do teto (não aplicado).** Com a nova posição, o selo da manopla cobre 42,9 % da peça do tubo (48,4 % pela medida anterior). Tentei um cabeçote 1,45 vez maior: ele fica atrás da manopla e do próprio selo, quase todo escondido, e o desenho piorou; desfeito.
- **11, cátodo na frente do feixe (não aplicado).** A própria revisão chama de opcional; afastar o cátodo mexe na geometria compartilhada pelas três cenas do tubo e quebraria a trajetória dos elétrons igual à do `tubo-raios-x`.
- **12 (aplicado).** `kit/base.mjs` usa `findChrome()` (respeita `CHROME_PATH`) em vez do caminho fixo; sem Chrome, `cenas.test.mjs` pula e o kit falha dizendo por quê. Não pus `cenas/` e `kit/` no CI: decisão do dono (o Chrome do runner pode serializar cor de outro jeito).
- **13 (aplicado).** `briefs/cena.md`, `cenas/README.md` e `kit/vendor/anatomy/README.md` (origem pública e commit `1482e846`) corrigidos; `docs/STATUS.md` e o plano de continuidade sinalizam o lote 2A e o selo novo.

Prévias refeitas (`lote-2A/<id>.png`, abertas uma a uma) e as linhas de selo de `lote-2A/medidas.md` refeitas pela peça sozinha (alfa maior que 8), com antes e depois: o ponto da pulseira esconde 33 %; o selo do telefone (m17-05) deixou de cobrir 18,7 % do botão; custos novos, ditos lá: o selo do cátodo (m19-03) cobre 25,3 % do cátodo (antes 0 %), o da mesa (m17-04) cobre 13,3 % do pedestal.

## Números dos testes (Node 20.20.2, 2026-11-20)

- Verificador (`rtg-lesson-lint.mjs`) nas 40 unidades: 40 de 40 OK (m17 e m19 com os alvos novos).
- `build-rtg-batches.mjs --check`: ok. `generate-rtg-maestro.mjs --check` m17 e m19: ok (os roteiros dessas duas não mudaram). `figuras-no-simulador.mjs --check` com os 30 ids (24 antigos mais os 6 novos) e sem ids: ok; 7 roteiros novos em `.maestro/figuras/`.
- `node --test scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`: 44 testes, 43 passam, 0 falham, 1 pulado (o que só vale sem Chrome, `sem Chrome o aviso diz o que fazer`). Dentro dele, `cenas.test.mjs`: 7 de 7, e o `kit.test.mjs`: 19 de 19. Vista falhando, a guarda de regeneração: com uma espessura de traço mudada na `fontes/tubo-emitindo.svg`, `cenas.test.mjs` reprova (`tubo-emitindo: regenera a fonte versionada byte a byte...`, 6 passam e 1 falha); restaurada a fonte, 7 de 7.
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65.
- `cd radiant-app && npx jest --runInBand src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`: 66 suítes, 1573 testes, todos passam (inclui `diagramRegistry.test.ts` com as duas guardas novas de figura parada).
- `npx tsc --noEmit`: saída 0. `npx eslint` nos 9 arquivos de `radiant-app` tocados (`diagramRegistry.test.ts`, os 6 specs e `rtg-2026-m17.ts` e `rtg-2026-m19.ts`): saída 0. `npm run test:maestro-contract`: 13 de 13.
- Soma de peso das figuras importadas: 3.094.371 bytes (29 figuras) contra o teto do teste, 8.116.109: dentro.
- `node --test` em `scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs` (2026-11-20, depois do E11): 496 testes, 494 passam, 1 pulado (preexistente), 1 falha alheia. Antes, só `scripts/content` e `scripts/qa`: 452 testes, 451 passam, 1 falha: a alheia conhecida (`registerSource normalizes metadata for the pilot book`). As fixtures que usavam `tubo-raios-x` como figura de código (`rtg-formatos.test.mjs`, `rtg-lesson-lint.test.mjs`, `fixtures/unidade-formatos.json`) passaram a usar `sala-com-riscos` (E10; 38 testes que reprovavam voltaram a passar).
- Kit e cenas sem a skill (E9): `kit.test.mjs` e `cenas.test.mjs` 26 de 26, 0 pulados; as 6 fontes seguem idênticas byte a byte.

- **Depois das correções da revisão (2026-11-20, Node 20.20.2):** `npx jest --runInBand src/features/lesson-flow src/ui/diagrams src/features/student-checkpoints`: 66 suítes, 1607 testes, todos passam; `tsc --noEmit` saída 0; `eslint` nos 10 arquivos tocados do app, saída 0 e sem aviso; `EXPO_NO_DOTENV=1 npm run visual:qa:strict`: 0 regressões; `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`: 497 testes, 495 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`), 1 pulado; verificador nas 40 unidades: 40 de 40; `build-rtg-batches.mjs --check` e `generate-rtg-maestro.mjs --check` (m17 e m19): ok. Não rodei o `npm run quality` inteiro.

## O que fica incerto

- A geometria da skill `anatomy` (`iso-kit.mjs`, `lathe.mjs`, `tube.mjs`, MIT) está copiada sem alteração em `scripts/content/figuras/kit/vendor/anatomy/`, com `LICENSE` e `README.md` (origem, data, sha256).
- **Não rodei simulador nem aparelho.** O spec passa nos testes do registro (réguas, paleta, degradê com id) e é idêntico à fonte em pixels; a leitura no tamanho do app e o toque no aparelho não foram vistos.
- **Selo e marcador do app (E11), números finais:** nenhum selo de tocar esconde mais de 2 % do próprio objeto nem cobre outro objeto cobrado (0 % nas 14 regiões; no m19-06 o selo do ânodo deixou de cobrir 44 % da janela). O ponto de 12 pt do rotular esconde de 2 a 9 %, exceto a pulseira (81,8 %). O selo do número esconde de 0 a 30 % do próprio objeto (pior: janela do tubo, 29,7 %). Sobra um selo sobre vizinho acima de 10 %: m17-05, o selo do telefone cobre 19,5 % do botão de chamada. Detalhe em `lote-2A/medidas.md`.
- As cenas foram desenhadas por modelo, em código, com o kit; o dono reprovou antes figuras de anatomia desenhadas por modelo (2026-11-19). Estas são equipamento e salas, e a pessoa é o módulo único do kit (aceito pelo controlador, R1 e R8), mas o aceite visual final é dele.

## Capturas no iPhone

Medido em 2026-11-20, simulador "Radiant F7" (iPhone, 402x874 pt, iOS 26.5), dev client com Metro no Node 20 (`EXPO_NO_TYPESCRIPT_SETUP=1`), ponta 666b8479, com os 7 roteiros versionados de `radiant-app/.maestro/figuras/` e o `m24-aula-04.yaml`, um por vez (`clearState`, animação reduzida). Os 8 roteiros passaram, sem cópia nem alteração, e o app não abortou. Arquivos em `capturas/`.

- `ios-conferencia-de-identidade-m17-aula01-passo4.jpg` (rotular, 4 pontos): cena inteira e legível. Pontos de 12 pt sobre a cabeça, a ficha, a pulseira e a tela; número em selo ao lado. O selo 3 cobre o canto de cima da tela, o 1 fica sobre o colchão perto da pulseira. A lista de baixo mostra só "1 a 3 sem rótulo" (a rolagem corta o resto).
- `ios-pontos-de-contato-da-sala-m17-aula04-passo4.jpg` (tocar, 5 regiões): cena inteira; cada selo fica fora e acima da região que nomeia, sem cobrir outro selo. O selo 5 encosta no monitor da mesa e o 3 fica em cima do canto da maca, sem tapar outra região.
- `ios-itens-de-emergencia-da-sala-m17-aula05-passo4.jpg` (rotular, 5 pontos): pontos pequenos sobre porta, carrinho, anel verde, disco amarelo e painel; números ao lado. O selo 2 cobre a alça do carrinho, o 4 morde a borda do disco amarelo e o 5 o topo do painel de furos: nenhum esconde o objeto, mas encostam.
- `ios-itens-de-emergencia-da-sala-m17-aula06-passo4.jpg` (tocar, 5 regiões): os 5 objetos visíveis, cada selo acima da própria região e fora dela. O selo 1 fica no topo da cena, sem cobrir a seta de saída.
- `ios-tubo-emitindo-m19-aula03-passo2.jpg` (visual, passo 2): tubo com feixe de elétrons pontilhado e cone dourado; a figura aparece na hora. Embaixo, a ponta do cone fica sob a barra Continuar: precisa rolar.
- `ios-tubo-raios-x-m19-aula03-passo4.jpg` (rotular, 4 pontos): tubo inteiro. O ponto 4 (carcaça) cai no vidro vazio e o selo 4 acima; o selo 2 cobre a borda do ânodo e o 3 fica ao lado da janela, sem cobrir o ponto focal.
- `ios-anodo-giratorio-m19-aula04-passo2.jpg` e `ios-anodo-giratorio-m19-aula06-passo2.jpg` (visual): disco com seta de giro, pista em anel e ponto focal legíveis. A m19-04 corta a parte de baixo (cátodo e cone) sob a barra Continuar; a m19-06 mostra a figura inteira.
- `ios-tubo-raios-x-m19-aula06-passo4.jpg` (tocar, 4 regiões): o selo 2 (ânodo) fica abaixo e à direita da região e o 3 abaixo da janela, sem cobrir a janela (antes 44 %). O selo 4 (carcaça) e o 1 ficam fora das regiões; os selos de fundo escuro têm pouco contraste com o fundo da figura.
- `ios-pelve-de-frente-m24-aula04-passo4-selo-novo.jpg` e `ios-pelve-de-frente-recorte-m24-aula04-passo5-selo-novo.jpg` (figura antiga, selo novo; as capturas de mesmo nome sem `-selo-novo` são anteriores): no rotular, ponto de 12 pt sobre o osso e número ao lado; no tocar, selos 2, 1 e 3 acima das regiões, fora delas.
- `ios-pelve-de-frente-recorte-m24-aula04-passo5-selo-novo-toque.jpg`: toque no selo "1" (não na região), com toque de 0,15 s no ponto (275, 377) pt. Resultado: selecionou o alvo dono do selo (forame obturado à direita da figura): a região ficou verde, o selo virou marca de verificação, a alternativa 1 ficou "Selecionada" e "Conferir resposta" foi habilitado. Uma vez, num item de tocar.

Fora do que isto prova: não ouvi nem medi tempo de carga; "sem demora" é a captura já pronta no passo, sem figura em branco em nenhuma das 11 telas. Não repeti o toque no selo nas cenas m17 e m19.
