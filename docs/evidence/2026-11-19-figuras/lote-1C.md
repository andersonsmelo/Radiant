# Lote 1C de figuras importadas (2026-11-20)

Três figuras entram no lote. `sistema-urinario` fica de fora (abaixo); `respiracao-diafragma` e `circulacao-dupla` não fazem parte desta integração por decisão do controlador e seguem com a arte atual. Prévias dos alvos com os marcadores do app (marcador de 28 pt do rótulo, selo de 36 x 24 pt da região) em `lote-1C/<id>.png` (todas as aulas juntas) e, onde a figura tem mais de uma interação, em `lote-1C/<id>--<aula>-<interação>.png` (uma interação por imagem, para os números não se misturarem). Lista dos itens alterados, com antes e depois: `.superpowers/sdd/2026-11-19-figuras-fase-1/1C/itens-alterados.md`.

## Figuras que entraram

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `ossos-do-pe` | m24-01 (`i2`) | erico (design); Hiromasa Ono e DBCLS (edição), Togopic | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:202110_Dorsal_view_of_bones_of_right_foot.svg e https://togotv.dbcls.jp/togopic.2021.124.html |
| `trato-digestivo` | m20-03 (`i2`), m20-06 (`i2`, `visual`), m26-05 (`i2`) | Servier Medical Art (Servier), kit SMART-Digestive-system | CC BY 4.0 | https://smart.servier.com/smart_image/complete-overview-digestive-apparatus/ |
| `marcos-de-superficie` | m18-05 (`i2`, `i3`, `visual`), m18-06 (`i2`) | LadyofHats (Mariana Ruiz Villarreal) | Domínio público | https://commons.wikimedia.org/wiki/File:Human_skeleton_front_no-text_no-color.svg |

Registro e crédito: as três entradas estão em `content-manifest/rtg-2026/figuras.json` e saem na tela de créditos pelo gerador. Datas de consulta: 2026-11-20. As três passaram para o `build-spec.mjs` (entradas em `FIGURES`) e a regeneração pela fonte devolve o spec entregue (teste de regeneração dos specs, 16 de 17 testes; o 17º pula só sem Chrome). Receitas históricas em `scripts/content/figuras/receitas/`.

## Contagem de caminhos, fonte contra original

- `ossos-do-pe`: original 132 caminhos, fonte 132. Nada descartado.
- `trato-digestivo`: grupo de 965 caminhos, fonte de 750. Os 221 que o agente de arte tirou foram conferidos um a um contra o quadro (altura do corte, y 290,5 a 859,5 no sistema de 244 x 899 da fonte): **6 estavam dentro do quadro e foram restaurados** (caminhos 90 a 94, traços escuros de vasos pintados antes dos órgãos, e o 133, uma peça rosada pequena; entram como apoio, em cinza escuro). Os 215 que saem são cabeça, boca, nariz, faringe e a ponta do reto, todos fora do quadro. O spec cresceu de 204,5 para 215,3 KiB.
- `marcos-de-superficie`: original 915 caminhos, fonte 520. Dos 513 que o agente de arte tirou, 118 eram antebraços e mãos que entram no quadro, nos cantos de baixo: **117 foram restaurados** (em cinza, como os braços; o 118º é o contorno do corpo, que já estava) e 395 saem por estar fora do recorte (cabeça, pernas, gradientes da cabeça). Para caber no teto de 240 KiB com as mãos, as coordenadas dos caminhos passam de duas casas decimais para uma (0,1 unidade da fonte por coordenada; nos caminhos relativos o erro se acumula e chega a 1,15 unidade da fonte, 0,78 pt no quadro, em 4 caminhos, quase todos sombras de dedos e do sacro; medido por revisão, 748 de 691.200 pixels diferem, todos em borda de antisserrilhado, então não é visível; precedente: `esqueleto-axial-apendicular`). O spec saiu de 209,7 para 229,4 KiB.

## Itens alterados (uma linha cada)

1. m18-05 `i2` (marcos, rótulo): **perde a ficha "Espinha ilíaca ântero-superior"**. A espinha, no ponto onde a arte a desenha (a ponta de cima do osso do quadril, logo acima da cabeça do fêmur, y 0,79), fica a 0,12 de x e 0,08 de y da sínfise: as áreas de toque de 44 pt se sobrepõem. O ponto que o agente de arte propôs (0,385; 0,665) cai na asa, junto à crista, e não na espinha. A espinha segue ensinada no `i4` da mesma aula (ligar a ponta da frente da crista ilíaca). Prompt de "seis" para "cinco" marcos, `feedbackIncorrect` sem "espinha" e fechamento dizendo que a espinha se liga à crista (em vez de localizada na figura). Coordenadas novas com `alvo`.
2. m18-06 `i2` (marcos, hotspot): **perde a região distratora "Margem costal inferior"**. Posta sobre as costelas inferiores, ela fica a 0,13 em y do processo xifoide, e a régua de 44 pt pede 0,21; a resposta certa (incisura jugular e xifoide) não muda, restam cinco regiões.
3. m18-05 `i3` (marcos, hotspot): a "Margem costal inferior" (resposta certa) sai do vazio abaixo das costelas e passa para a borda de baixo da caixa torácica, do lado direito do paciente: região (0,34; 0,40; 0,135 x 0,17), com o selo no alto e as pontas das costelas de baixo à vista. As demais regiões só mudam de coordenada.
4. m18-05, cena, fala da Duda: antes "Nessa figura há pontos amarelos, mas eu só enxergo o contorno do corpo e uns ossos fracos." / depois "Nessa figura eu só enxergo os ossos do tronco e da pelve, e nenhuma legenda." (a arte nova não tem pontos amarelos nem ossos fracos).
5. m20-03 `i2` (trato digestivo, rótulo): `where` do Pâncreas de "faixa azul sob a bolsa curva" para "massa ciano sob a bolsa curva" (o pâncreas da arte é uma massa ciano; o azul é do estômago e do delgado). Coordenadas novas com `alvo`, sem perder ficha. Nenhum item cobra estômago ou delgado pela cor: os `where` falam de forma e lugar.
6. m20-06 `i2` e m26-05 `i2` (trato digestivo, hotspot): só coordenadas. As regiões encolhem para a estrutura (o fígado deixa de cobrir a ponta do estômago; a região do intestino grosso passa a 0,08 de largura, o mínimo do verificador).
7. m24-01 `i2` (pé, rótulo): `where` do Cuboide de "peça quase quadrada em branco" para "peça quase quadrada, em cinza claro" (na arte o cuboide é cinza claro, para se distinguir do calcâneo e do navicular, brancos) e `where` das Falanges de "na ponta do quarto dedo" para "nas pontas dos dedos" (o ponto cai no terceiro dedo, e a arte abre os dedos em leque). Coordenadas novas com `alvo`.

Trato digestivo: o grupo do pptx tem 972 formas, e não 965; as 7 que faltam são `prstGeom line` de 1 x 1 (pontos de cerca de 0,6 pt no quadro, uma delas no hilo hepático) que o extrator não lê. Não é perda visível.

Rodada de correções de 2026-11-20 (revisão do lote): crédito do pé com todos os autores da página de origem; `marcos-de-superficie` recolorido por caminho sem mexer em forma (escápulas, os caminhos 214, 215, 219 e 220 do original, agora cinza; primeiras costelas, 426 a 428 e 433 a 435, agora azuis); vesícula descrita como verde-petróleo; fala do Pixel da m18-05 com "marcos".

## Figura fora do lote

- `sistema-urinario` (m20-04 `i2`, m26-06 `i3`): a arte de acervo cobre os seis alvos (domínio público, SEER/NCI), mas **não entra**. Por decisão do controlador, no m20 o rótulo ficaria com três pontos (rim direito, ureter esquerdo, bexiga) e no m26 a Uretra seguiria como resposta certa, sem a Bexiga. O m20 cabe. O m26 não: (a) a uretra desenhada mede cerca de 0,013 x 0,045 do quadro e fica logo abaixo da bexiga; a área de toque de 44 pt da região da uretra (0,157 x 0,21 do quadro, com o centro no máximo em y 0,895 para caber na figura) cobre **59% da bexiga**, que é o erro típico da pergunta ("o contraste sai da bexiga"), então tocar na bexiga acertaria; (b) o selo de 36 x 24 pt parte do canto da região e, com o centro dentro da região declarada da uretra, cobre o tubo inteiro. A uretra só ficaria visível e distinta da bexiga com regiões que nenhuma régua aceita. Os arquivos da figura ficam em `.superpowers/sdd/2026-11-19-figuras-fase-1/1C/sistema-urinario/fora-do-repo/` e o spec, o registro e as duas aulas seguem como estavam. A saída que cabe na régua, mas muda a resposta e por isso é do controlador ou do dono: na m26-06, a resposta certa passar a ser o ureter (rim direito, ureter esquerdo e bexiga como regiões; o contraste da urografia desce pelo ureter até a bexiga), com a fonte da urografia no lugar da cistouretrografia.

## Números (2026-11-20, Node 20.20.2, árvore com só este lote)

- Verificador de aulas nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check m18 m20 m24 m26`: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0, com 11 ids no índice e 16 roteiros.
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 6 para 7 em `scripts/copy-style-baseline.json` (número medido com as três entradas novas).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`: 88 suítes, 1646 testes, todos passam. `npx tsc --noEmit`: saída 0.
- `npx eslint` nos oito arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Peso: soma do SVG das 10 figuras importadas, 1343,2 KiB (1.375.433 bytes), contra o teto de 8.116.109 bytes do teste do registro (o teste passa, sem subir o teto). Maiores: `esqueleto-axial-apendicular` 237,8; `marcos-de-superficie` 228,1; `trato-digestivo` 214,1 KiB (linha do SVG de cada spec) (teto de 240 por figura).

## Para o dono olhar no simulador

- `m20-03`, interação 2: o marcador 4 cobre cerca de metade da massa ciano da cabeça do pâncreas. Dá para ver a massa? Não há ponto melhor que respeite as distâncias de 44 pt (M3 da revisão).
- `m18-05` (região 3) e `m18-06` (região 2): o selo de 36 x 24 pt cobre inteiros a incisura jugular, o processo xifoide, a crista ilíaca e a sínfise (M6).
- `m18-05`: as escápulas, agora cinza, junto das costelas azuis.
- `m24-01`: o cuboide fica cerca de três quartos sob o marcador 3 e se decide pela posição e por exclusão.
- `m18-03`: a exceção provisória da coluna, com os marcadores ao lado, espera o dono.
- `m26-05`: a área de toque do intestino grosso (região de 0,08 de largura) cobre alças do delgado, que são distratores com o mesmo retorno (M4).

Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.
