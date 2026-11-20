# Lote 1B de figuras importadas (2026-11-20)

Prévias dos alvos, com os marcadores do app (marcador de 28 pt do rótulo e selo de 36 x 24 pt da região), em `lote-1B/<id>.png`. Lista dos itens alterados, com antes e depois: `.superpowers/sdd/2026-11-19-figuras-fase-1/1B/itens-alterados.md`.

## Figuras que entraram

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `coluna-regioes` | m18-03 (`i2`, `visual`) | DataBase Center for Life Science (DBCLS) | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:202410_Vertebral_column_spine.svg |
| `vertebra-tipica` | m24-05 (`i2`), m28-04 (`visual`) | Servier Medical Art (Les Laboratoires Servier), kit SMART-Bones | CC BY 4.0 | https://smart.servier.com/smart_image/vertebra-bone-view/ |
| `femur-proximal-e-quadril` | m24-03 (`i2`) | Servier Medical Art, kit SMART-Bones | CC BY 4.0 | https://smart.servier.com/smart_image/male-pelvis/ e https://smart.servier.com/smart_image/femur/ |
| `joelho-frente-e-perfil` | m24-02 (`i2`, `visual`), m24-06 (`i2`, `visual`) | Patrick J. Lynch, medical illustrator; C. Carl Jaffe, MD | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Knee_skeleton_lateral_anterior_views.svg |

Registro e crédito: as quatro entradas estão em `content-manifest/rtg-2026/figuras.json` (todos os autores no campo `author`) e saem na tela de créditos pelo gerador. Datas de consulta: 2026-11-20.

Pontos que o revisor vai julgar (declarados aqui para não ficarem só no relatório):
- `femur-proximal-e-quadril` é uma composição de duas artes do mesmo kit (pelve de frente, "Group 308" do slide "Bones of pelvis", e fêmur, "Group 50" do slide "Femur"). O fêmur foi espelhado na horizontal e ampliado em 5%, e a posição e a escala relativas das duas peças foram escolhidas a olho pelo projeto: não vêm do kit. O `modification` do registro diz isso, com as duas páginas de origem. O acetábulo não é desenhado como encaixe: o alvo é o osso do quadril logo acima da cabeça.
- `joelho-frente-e-perfil`: a página do Commons declara CC BY 2.5 e os metadados do SVG declaram CC BY 3.0; o registro usa a da página. Os ossos foram coloridos por recortes poligonais do projeto sobre a arte a traço (as silhuetas do original são peças únicas); na vista de frente a divisa entre tíbia e fíbula é um corte reto sem linha no original. A patela de frente é só o contorno sobre o fêmur (não é colorida).

## Contagem de caminhos, fonte contra original

Nenhum traço foi descartado na preparação, salvo o dito:
- `coluna-regioes`: original 322 `<path>` = 149 (perfil) + 173 (frente). A fonte tem os 149 do perfil; os 173 da vista de frente foram retirados de propósito (a aula usa só o perfil).
- `vertebra-tipica`: 82 no grupo "Group 139" e 82 na fonte.
- `femur-proximal-e-quadril`: 129 ("Group 308") + 45 ("Group 50") = 174 no pptx, e 174 na fonte.
- `joelho-frente-e-perfil`: original 76 (3 silhuetas `#414142` e 73 traços `#D1D3D4`), fonte 8: as silhuetas viram 7 preenchimentos por osso (cortes do projeto) e os 73 traços viram um caminho composto. Nada do original ficou fora do recorte em altura (y 110 a 440) e nenhuma peça do traço foi descartada pela simplificação (medido: 0 de 69 peças abaixo de 0,05 de área).

Regeneração: `node scripts/content/figuras/build-spec.mjs <id>` a partir de `fontes/<id>.svg` devolve o spec entregue sem diferença no desenho (só mudou o estilo das aspas do `alt`, que o molde do `build-spec` fixa). Receitas históricas de cada fonte em `scripts/content/figuras/receitas/`.

## Itens alterados (uma linha cada)

1. m24-05 `i2` (vértebra): perde a ficha "Forame vertebral" (marcador cobre quase todo o furo e a área de toque se sobrepõe à do pedículo); prompt "quatro partes", `where` do pedículo e `feedbackCorrect` ajustados. O forame segue cobrado no `i4` da lição.
2. m24-03 `i2` (fêmur e quadril): sem perder ficha; `where` do acetábulo e da cabeça e `help` reescritos (a arte não tem "arco azul"); coordenadas refeitas.
3. m24-02 `i2` (joelho, rótulo): sem perder ficha; `where` da patela ("peça azul, estreita"); coordenadas novas com `alvo`.
4. m24-06 `i2` (joelho, hotspot): só coordenadas; região do côndilo lateral com altura 0,24.
5. m18-03 `i2` (coluna): só coordenadas (lombar 0,66 e sacro 0,87).

## Fora do lote

- `pelve-de-frente`: nenhuma arte aberta aceita separa ílio, ísquio e púbis, e a aula m24 ("A pelve por partes") os cobra pela cor. As candidatas: DBCLS (CC BY 4.0, "Anterior view of female pelvis" e a masculina) traz o osso do quadril numa forma só, sem sutura nem cor própria por parte; Servier (CC BY 4.0) só tem PNG de 521 x 340 e 488 x 377 ou o pptx, também com o osso numa peça só; Blausen 0723 (CC BY 3.0) tem as três partes em cores, mas é render 3D em PNG (cerca de 1.300 x 1.080 px na vista anterior), com linhas de chamada sobre a arte, e não é vetor nem tem a paleta do app; as vetoriais com as três partes separadas (Fred the Oyster, NCI, D.renard) são CC BY-SA ou de licença fora da lista. Dividir à mão o osso do DBCLS foi vedado pelo brief sem autorização do dono. Nenhum arquivo da figura entrou; o spec segue o do git. Decisão do dono: autorizar a divisão a mão, mudar a aula ou mandar para a fase 3.
- `coluna-sagital-e-axial`: nenhuma arte de licença aceita traz as duas vistas (corte sagital da coluna lombar, com canal, e corte axial, com disco e canal). Servier tem só peças soltas; Gurch tem só a sagital; DBCLS e CC0 não têm canal nem axial. Compor duas obras de autores diferentes foi vedado pelo brief, e redesenhar ou gerar também. Nenhum arquivo da figura entrou; o spec segue o do git.

## Números (2026-11-20, Node 20.20.2, árvore com só este lote)

- Verificador de aulas nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check m18 m24`: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0, com os 9 ids do índice.
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 2 para 6 em `scripts/copy-style-baseline.json` (a licença em maiúsculas das quatro entradas novas; número medido, 6).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`: 88 suítes, 1646 testes, todos passam.
- `npx tsc --noEmit`: saída 0. `npx eslint` nos sete arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Peso: soma do SVG das 8 figuras importadas 901.266 bytes (880,1 KiB) contra o teto de 8.116.109 bytes do teste do registro (passa, sem subir o teto): coluna 132,7 KiB, vértebra 22,6, fêmur e quadril 52,6, joelho 31,8, mais as quatro do lote 1A (esqueleto 237,8, articulação 173,6, crânio 73,4, linhas 155,6).

Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.
