# Lote 1B de figuras importadas (2026-11-20, rodada 1 de correções em 2026-11-20)

Três figuras ficam no lote (a do fêmur e quadril saiu na rodada 1, abaixo). Prévias dos alvos, com os marcadores do app (marcador de 28 pt do rótulo e selo de 36 x 24 pt da região), em `lote-1B/<id>.png`. Lista dos itens alterados, com antes e depois: `.superpowers/sdd/2026-11-19-figuras-fase-1/1B/itens-alterados.md`.

## Figuras que entraram

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `coluna-regioes` | m18-03 (`i2`, `visual`) | erico (design); JSHG e DBCLS (edição), Togopic | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:202410_Vertebral_column_spine.svg e https://togotv.dbcls.jp/togopic.2024.239.html |
| `vertebra-tipica` | m24-05 (`i2`), m28-04 (`visual`) | Servier Medical Art (Les Laboratoires Servier), kit SMART-Bones | CC BY 4.0 | https://smart.servier.com/smart_image/vertebra-bone-view/ |
| `joelho-frente-e-perfil` | m24-02 (`i2`, `visual`), m24-06 (`i2`, `visual`) | Patrick J. Lynch, medical illustrator; C. Carl Jaffe, MD | CC BY 2.5 | https://commons.wikimedia.org/wiki/File:Knee_skeleton_lateral_anterior_views.svg |

Registro e crédito: as três entradas estão em `content-manifest/rtg-2026/figuras.json` (todos os autores no campo `author`) e saem na tela de créditos pelo gerador. Datas de consulta: 2026-11-20.

Licença da coluna, lida em 2026-11-20 no Togopic (togotv.dbcls.jp, sem dado pessoal): a página da figura traz "Designed by erico / Edited by JSHG & DBCLS" e, nos metadados schema.org (Dataset), `license` = https://creativecommons.org/licenses/by/4.0/ e criadores DBCLS e erico. O texto de termos do site (a página "TogoTV", cuja tela é montada por script; li a frase no pacote JavaScript do site, e não na página renderizada) diz que o conteúdo do TogoTV é CC-BY-4.0, reprodução e modificação livres, inclusive uso comercial, com crédito à fonte, link da licença e aviso de mudanças (exemplo de crédito: "DBCLS TogoTV, CC-BY-4.0"). Confirmada, portanto, CC BY 4.0, com o crédito completo de I5.

Pontos que o revisor julgou (rodada 1):
- `joelho-frente-e-perfil`: a página do Commons declara CC BY 2.5 e os metadados do SVG declaram CC BY 3.0; o registro usa a da página. As divisas de cor entre os ossos seguem só traços do próprio autor: de frente, o traço que contorna a tíbia (`path33`, escondido sob a silhueta no original) separa a cabeça da fíbula; de perfil, as bordas inferiores do fêmur (`path83`, `path81`) e o contorno da fíbula (`path145`, `path147`) cortam a silhueta em fêmur, patela, tíbia e fíbula (4 peças, conferidas pela receita). Não há polígono digitado. Medido na renderização: nenhuma cunha ciano na tíbia de frente, nenhuma faixa ciano sobre a tíbia de perfil, nenhuma lente âmbar entre o fêmur e o platô. A patela de frente é só o contorno sobre o fêmur (não é colorida). O original esconde cerca de 20 traços do autor sobre a tíbia e a fíbula de frente (pintados antes da silhueta); aqui eles aparecem, por cima dela.
- `coluna-regioes` (exceção provisória, a confirmar pelo dono): os quatro marcadores ficam AO LADO da coluna, como chamadas, e não sobre ela. Motivo medido pelo revisor: com a coluna de perfil ocupando 0,04 a 0,10 do quadro, o marcador de 28 pt cobria a largura inteira dela; sobre a arte, ficava 99% sobre o fundo (cervical), 51% (torácica), 80% (lombar) e 72% (sacro), e as regiões declaradas, com 0,16 de largura, eram cerca de 75% fundo e passavam por construção. Agora as regiões declaradas são a caixa da arte naquela altura mais o raio do marcador do lado da chamada (mais 0,01 de folga), e cada ponto fica na borda da arte, dentro da região. A outra saída era pôr os pontos sobre a arte e aceitar o marcador escondendo o trecho.

## Contagem de caminhos, fonte contra original

Nenhum traço foi descartado na preparação, salvo o dito:
- `coluna-regioes`: original 322 `<path>` = 149 (perfil) + 173 (frente). A fonte tem os 149 do perfil; os 173 da vista de frente foram retirados de propósito (a aula usa só o perfil).
- `vertebra-tipica`: 82 no grupo "Group 139" e 82 na fonte.
- `joelho-frente-e-perfil`: original 76 (3 silhuetas `#414142` e 73 traços `#D1D3D4`), fonte 8: as silhuetas viram 7 preenchimentos por osso (divididos pelos traços do autor, sem polígono digitado) e os 73 traços viram um caminho composto. Nada do original ficou fora do recorte em altura (y 110 a 440) e nenhuma peça do traço foi descartada pela simplificação.

Regeneração: `node scripts/content/figuras/build-spec.mjs <id>` a partir de `fontes/<id>.svg` devolve o spec entregue sem diferença no desenho (só mudou o estilo das aspas do `alt`, que o molde do `build-spec` fixa). Receitas históricas de cada fonte em `scripts/content/figuras/receitas/`.

## Itens alterados (uma linha cada)

1. m24-05 `i2` (vértebra): perde a ficha "Forame vertebral" (marcador cobre quase todo o furo e a área de toque se sobrepõe à do pedículo); prompt "quatro partes", `where` do pedículo e `feedbackCorrect` ajustados. O pedículo fica em (0,37; 0,45), no meio do pedículo e fora das áreas de toque do corpo, do transverso e do espinhoso; o forame segue cobrado no `i4` da lição (e o fechamento da m24-05 passa a dizer "reconhecer o forame", porque a figura já não o pede por nome). O motivo de afastar o ponto é o pedículo ficar na borda do osso, e não o limite de 0,157 da sobreposição de áreas de toque.
2. m24-02 `i2` (joelho, rótulo): sem perder ficha; `where` da patela ("peça azul, estreita"); coordenadas novas com `alvo` (cabeça da fíbula em 0,085; 0,57, para o marcador cobrir mais osso da fíbula e menos tíbia).
3. m24-06 `i2` (joelho, hotspot): só coordenadas; região do côndilo lateral com altura 0,24; a região correta, "Cabeça da fíbula, de frente", passa a (0,046; 0,52; 0,084 x 0,20), cabeça e colo da fíbula, porque a anterior (0,10 x 0,194 a partir de 0,464) tinha cerca de 26% de tíbia e deixava o erro típico (tocar a borda da tíbia) valer como acerto; a região declarada em `joelho-frente-e-perfil.alvos.json` vai até y 0,72. Medido na arte: a região nova tem cerca de 6% de tíbia e a área de toque de 44 pt, 16%. O selo de 36 x 24 pt cobre a faixa do meio da cabeça (de y 0,52 a 0,634); o alto da cabeça, a saliência do lado de fora e o colo seguem visíveis.
4. m18-03 `i2` (coluna): só coordenadas, e agora os quatro marcadores ficam ao lado da coluna (exceção provisória descrita acima): cervical (0,576; 0,135), torácica (0,612; 0,41), lombar (0,576; 0,665) e sacro (0,598; 0,875); as regiões declaradas encolhem para a caixa da arte naquela altura mais o raio do marcador.

## Fora do lote

- `femur-proximal-e-quadril` (saiu na rodada 1 de correções, 2026-11-20): o revisor mediu a cabeça do fêmur sobre o forame obturado, e não no acetábulo (Crítico), e o alvo "Acetábulo" nomeava um osso que a arte não desenha. Nenhuma posição do fêmur sobre a pelve vem do kit: qualquer uma é escolha do projeto, e a regra do dono é nunca colar peça em posição inventada. A figura volta ao estado de antes do lote (spec, aula m24-03 e registro restaurados); a fonte, as receitas e a prévia ficam guardadas fora do repositório para o dono retomar. Decisão do dono: autorizar o projeto a posicionar o fêmur (com a posição dada pelo revisor como ponto de partida), mudar a aula ou mandar para a fase 3.
- `pelve-de-frente`: nenhuma arte aberta aceita separa ílio, ísquio e púbis, e a aula m24 ("A pelve por partes") os cobra pela cor. As candidatas: DBCLS (CC BY 4.0, "Anterior view of female pelvis" e a masculina) traz o osso do quadril numa forma só, sem sutura nem cor própria por parte; Servier (CC BY 4.0) só tem PNG de 521 x 340 e 488 x 377 ou o pptx, também com o osso numa peça só; Blausen 0723 (CC BY 3.0) tem as três partes em cores, mas é render 3D em PNG (cerca de 1.300 x 1.080 px na vista anterior), com linhas de chamada sobre a arte, e não é vetor nem tem a paleta do app; as vetoriais com as três partes separadas (Fred the Oyster, NCI, D.renard) são CC BY-SA ou de licença fora da lista. Dividir à mão o osso do DBCLS foi vedado pelo brief sem autorização do dono. Nenhum arquivo da figura entrou; o spec segue o do git. Decisão do dono: autorizar a divisão a mão, mudar a aula ou mandar para a fase 3.
- `coluna-sagital-e-axial`: nenhuma arte de licença aceita traz as duas vistas (corte sagital da coluna lombar, com canal, e corte axial, com disco e canal). Servier tem só peças soltas; Gurch tem só a sagital; DBCLS e CC0 não têm canal nem axial. Compor duas obras de autores diferentes foi vedado pelo brief, e redesenhar ou gerar também. Nenhum arquivo da figura entrou; o spec segue o do git.

## Números (2026-11-20, Node 20.20.2, árvore com só este lote)

- Verificador de aulas nas 40 unidades: 40 de 40 OK (medido numa worktree limpa a partir do commit, com só o lote; na árvore de trabalho, figuras de outro lote ainda sem registro reprovam m18, m20, m24 e m26).
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check m18 m24`: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0, com 8 ids no índice e 10 roteiros (sem `m24-aula-03`).
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 2 para 6 (número medido com as quatro entradas; com três ele passa com folga) em `scripts/copy-style-baseline.json` (a licença em maiúsculas das quatro entradas novas; número medido, 6).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings`: 68 suítes, 1497 testes, todos passam. `npx tsc --noEmit`: saída 0.
- `npx eslint` nos cinco arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Peso: soma do SVG das 7 figuras importadas, cerca de 830 KiB (estimativa a partir da medida anterior, 880,1 KiB com as 8, sem o fêmur de 52,6 KiB e com o joelho de 35 KiB em vez de 31,8), contra o teto de 8.116.109 bytes do teste do registro (o teste passa, sem subir o teto).

Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.

## Capturas no iPhone

Simulador "Radiant F7" (iOS 26.5), dev client com Metro local, em 2026-11-20 entre 05h44 e 05h56 (hora do simulador). Roteiros de `radiant-app/.maestro/figuras/` com o Maestro, um por vez; nenhum foi editado. Imagens em `capturas/`.

- `capturas/ios-coluna-regioes-m18-aula03-passo2.jpg` (conceito): coluna de perfil inteira, cervical em ciano, torácica em azul, lombar em âmbar, sacro e cóccix em cinza, legível no fundo escuro; a moldura toca a ponta do cóccix.
- `capturas/ios-coluna-regioes-m18-aula03-passo4.jpg` (rotular): quatro selos (1 cervical, 2 torácica, 3 lombar, 4 sacro) ao lado direito da coluna, fora dela; nenhum cobre vértebra.
- `capturas/ios-vertebra-tipica-m24-aula05-passo4.jpg` (rotular): vértebra lombar vista de cima, inteira; selos 1 (corpo), 2 (na junção do corpo com o arco, à esquerda, sobre a borda do forame), 3 (processo transverso, na ponta) e 4 (processo espinhoso, na ponta) legíveis.
- `capturas/ios-joelho-frente-e-perfil-m24-aula02-passo2.jpg` (conceito): frente e perfil lado a lado; a moldura corta a tíbia e a fíbula embaixo (a figura pede rolagem ou ela já é recortada), patela azul separada no perfil.
- `capturas/ios-joelho-frente-e-perfil-m24-aula02-passo4.jpg` (rotular): quatro selos inteiros: 1 côndilo do fêmur (frente), 2 tuberosidade da tíbia, 3 cabeça da fíbula (borda esquerda, selo sobre o topo do osso), 4 patela (perfil). Tíbia e fíbula inteiras na moldura.
- `capturas/ios-joelho-frente-e-perfil-m24-aula06-passo4.jpg` (tocar numa região, com cinco regiões sombreadas): o selo 2 e a região da cabeça da fíbula cobrem a ponta superior do osso; a região 3 sombreia a tuberosidade da tíbia e a 5 sombreia boa parte da tíbia no perfil.

Roteiros: `m18-03`, `m24-02`, `m24-05` e `m24-06` passaram. Não visto: Android, som, resposta errada, os demais passos dessas aulas.
