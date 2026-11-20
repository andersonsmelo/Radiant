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

- **E11, selo e marcador fora do objeto (commit 4bd7adce, outro agente).** O selo de tocar (36 x 24 pt) fica fora da região (acima, senão abaixo, à esquerda, à direita); no rotular, o ponto virou um ponto de 12 pt sobre o alvo, e o número vai num selo acima e à direita. A área de toque de 44 pt não mudou. As asserções novas foram vistas falhando antes, cada uma com o defeito que nomeia (13 de 42 testes reprovaram em `hotspotTouch.test.ts`, `HotspotStepRenderer.test.tsx`, `LabelStepRenderer.test.tsx` e `RiskHuntStepRenderer.test.tsx` com a regra antiga): por exemplo, "o selo do número e a marca de selecionado ficam fora da região, inteiros no quadro" (selo dentro da região), "o marcador tem de 10 a 12 pt, centrado no ponto, e o número vai num selo fora do marcador" (marcador de 28 pt sobre o alvo) e, no `badgeBox`, "prefere ACIMA da região" (esperava a base do selo em 105 pt e veio 129), "sem espaço acima, vai ABAIXO", "à ESQUERDA" e "à DIREITA". As prévias e as medidas deste lote foram refeitas com a posição nova; o efeito nas medidas está na seção "Itens alterados" e em `lote-2A/medidas.md`.
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

## O que fica incerto

- A geometria da skill `anatomy` (`iso-kit.mjs`, `lathe.mjs`, `tube.mjs`, MIT) está copiada sem alteração em `scripts/content/figuras/kit/vendor/anatomy/`, com `LICENSE` e `README.md` (origem, data, sha256).
- **Não rodei simulador nem aparelho.** O spec passa nos testes do registro (réguas, paleta, degradê com id) e é idêntico à fonte em pixels; a leitura no tamanho do app e o toque no aparelho não foram vistos.
- **Selo e marcador do app (E11):** com a posição nova, nenhum selo de tocar esconde o próprio objeto, mas alguns caem sobre vizinhos cobrados. No m19-06 o selo do ânodo (certa) cobre 44,4 % da janela, e os selos 1 e 2 ficam atrás dos 4 e 3 (números ilegíveis); no m17-01 o selo da pulseira cobre 20,5 % da cabeça; no m17-05 os selos do oxigênio e do telefone cobrem cerca de 19 % do botão. Números em `lote-2A/medidas.md`.
- As cenas foram desenhadas por modelo, em código, com o kit; o dono reprovou antes figuras de anatomia desenhadas por modelo (2026-11-19). Estas são equipamento e salas, e a pessoa é o módulo único do kit (aceito pelo controlador, R1 e R8), mas o aceite visual final é dele.
