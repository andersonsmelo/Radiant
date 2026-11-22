# Quatro figuras desenhadas trocadas por imagem real de exame (2026-11-22)

Decisão do dono, 2026-11-22: "Sim, as 4 boas". Quatro figuras desenhadas passam a imagem **real** de exame com licença aberta, pelo caminho `imageId` (cadastro `content-manifest/rtg-2026/imagens.json`, arquivo em `radiant-app/assets/content/rtg-2026/imagens/<unidade>/`), como já fazem a m08, a m25 e a m28. Nenhuma imagem é gerada. Os specs antigos (`radiografia-roteiro.ts`, `dxa-regioes-de-interesse.ts`, `dxa-interferencias.ts`, `corpo-inteiro-composicao.ts`) ficam no registro, sem uso nas aulas.

## 1. Imagens e licenças

Regra do dono: licença só CC0, domínio público declarado ou CC BY, de cada autor, lida na página inteira, na origem e no histórico. Nunca CC BY-SA, NC ou ND. Leituras de 2026-11-22, com User-Agent genérico.

| Figura que sai | Imagem real | Autor | Licença | Onde li |
|---|---|---|---|---|
| `radiografia-roteiro` (m23-01 i2, m23-05 i3) | "Chest Xray PA 3-8-2010.png" | Stillwaterising (obra própria) | CC0 1.0 | API do Commons: `LicenseShortName` CC0, `AttributionRequired` false, `Credit` "Own work"; sha1 do arquivo baixado igual ao da API (`f2625192...`). Histórico (12 revisões, upload de 2010-03-08 pelo autor, nenhuma troca de arquivo nem de licença): leitura da pesquisa de 2026-11-22, `pesquisa/radiografia-roteiro/candidatas.md`. |
| `dxa-regioes-de-interesse` (m30-02 i2 e i4, m30-06 i2) | Fig. 24 do artigo "Fabry disease" (Orphanet J Rare Dis 2010;5:30), cópia do Commons "Morbus Fabry DXA 01.jpg" | Dominique P. Germain; figura "Courtesy: Dr Caroline LEBRETON, CHU Raymond Poincaré" | CC BY 2.0 | Artigo inteiro em PMC3009617: "Copyright ©2010 Germain; licensee BioMed Central Ltd. ... Creative Commons Attribution License (creativecommons.org/licenses/by/2.0)". Procurei no texto inteiro "permission", "reproduced", "adapted from", "third party": nada além dessa frase. A legenda da Fig. 24 só traz o crédito "Courtesy". Europe PMC: `license` "cc by", `isOpenAccess` Y. Commons (API): CC BY 2.0, sha1 do arquivo igual ao da API (`898afc70...`). |
| `dxa-interferencias` (m30-04 i2) | Fig. 1 de Lin et al., PLoS One 2023, 10.1371/journal.pone.0285898 | Lin YH, Chou CS, Teng MMH | CC BY 4.0 | Página do artigo: "Copyright: © 2023 Lin et al. This is an open access article distributed under the terms of the Creative Commons Attribution License". Figura do próprio estudo, sem crédito de terceiro. O PNG baixado do PLOS (`size=large`) tem o mesmo sha256 do arquivo da pesquisa (`685d84cf...`). |
| `corpo-inteiro-composicao` (m30-05 i2 e visual) | Fig. 2 de Chaves et al., Radiologia Brasileira 2022, 10.1590/0100-3984.2021.0155-en | Chaves LGCM, Gonçalves TJM, Bitencourt AGV, Rstom RA, Pereira TR, Velludo SF | CC BY 4.0 | Página da SciELO (`doi.org` redireciona para ela): "Open Access article distributed under the terms of the Creative Commons Attribution License", ícone `by/4.0`. A Fig. 2 não traz linha `Source`: só a Tabela adaptada de Kelly et al. a traz. O arquivo (`9e3f33e2...png`, 1026 x 1418) tem o mesmo sha256 do da pesquisa (`6a4f7ce5...`). |

Resíduo da (b), dito para o dono: "Courtesy" é crédito de quem cedeu a figura, e não uma licença. A cessão à autora do artigo não está documentada na página, mas o artigo declara CC BY 2.0 inteiro, sem reserva de terceiro, e é essa a declaração que vale. Se o dono quiser margem maior, a figura sai e a desenhada volta (um `git revert` do commit das aulas).

## 2. Preparo de cada arquivo

Script em `.superpowers/sdd/2026-11-22-figuras-13/reais/prep.py` (fora do git). Abri cada JPEG final no tamanho real e li os quatro cantos.

| Arquivo | Origem e recorte | Final | Peso | Cantos lidos |
|---|---|---|---|---|
| `imagens/m23/torax-pa-roteiro-01.jpg` | PNG RGBA 2412 x 1956, cinza, redução para 1200 de largura, **sem recorte** | 1200 x 973 | 77,3 KiB | Só a tira de chumbo no alto à direita: letra L, letras ETB e um círculo. Sem nome, data nem número. |
| `imagens/m30/dxa-quadril-coluna-01.jpg` | JPEG 1200 x 763, recomprimido, **sem recorte**, em cor | 1200 x 763 | 103,6 KiB | Só as letras A e B dos painéis e L1 a L4 do aparelho. Em cor porque os contornos e caixas do aparelho são amarelos, e é neles que a aula mede. |
| `imagens/m30/dxa-coluna-cimento-01.jpg` | PNG 2100 x 1064 de três painéis; **recorte do painel da esquerda** (10,150)-(670,1040), cinza | 660 x 890 | 78,8 KiB | Só L1 a L4. O recorte tira a barra cinza da janela (até y ≈ 31 do original), as ~118 linhas de cima do painel e os painéis do meio e da direita. Sem nome nem data. |
| `imagens/m30/dxa-corpo-inteiro-01.jpg` | PNG 1026 x 1418 de dois painéis, redução para 1200 de altura, **sem recorte**, em cor | 868 x 1200 | 102,8 KiB | Nenhum texto. |

Por que o painel da esquerda na (c): é o painel com o cimento dentro da caixa de L2. O do meio exclui L2 da região (a decisão da equipe que a aula manda não tomar) e o da direita é o exame de um ano antes, sem cimento. Nas ~118 linhas cortadas há um segundo ponto muito claro, na borda esquerda do corpo vertebral de cima, acima da caixa de L1 (cerca de 2.500 pixels acima de 230 no original; aparece também no painel do meio e não no do ano anterior). **A frase "só tem um risco real" vale para o quadro recortado, não para o painel inteiro do autor**, e o objeto de cima não entra no item (a ajuda "o que não é osso e está sobre uma vértebra" passaria a valer para ele também, e o item ficaria ambíguo). O "L2" escuro do quadro é a marca da vértebra já excluída do cálculo, pela legenda da fonte ("the exclusion of affected vertebrae from the analysis of lumbar spine BMD"); a legenda inteira está agora no `descriptionFromSource`. Recorte só por enquadramento: nada foi apagado, pintado nem retocado em nenhuma imagem. Soma das 11 imagens do cadastro dentro do teto de 15 MiB.

Ressalva da (a), do dono decidir: as letras "ETB" estão no mesmo suporte radiopaco do "L" e do círculo (o contorno do suporte vai de y 0 a ~115 px), logo estavam sobre o detector na exposição e fazem parte da peça de chumbo do marcador; não são texto gravado depois, nem nome, data ou número. **De quem são as iniciais, nem o Commons nem o envio dizem.** Por isso nenhum texto da aula afirma de quem são as letras nem que "nenhum dado identifica a pessoa": a aula diz "sem nome nem número de paciente visíveis", e os retornos da M23.01 i2 dizem que as letras junto do "L" são da mesma peça de chumbo do marcador (correção N1 da revisão).

## 3. Cadastro

Quatro entradas novas em `content-manifest/rtg-2026/imagens.json`, com todos os campos, `retrievedAt` 2026-11-22, `sha256Original` do arquivo baixado e `sha256Asset` do JPEG, `usedIn`, e `alt` que descreve só o que se vê (sem nomear marcador, diafragma, campo pulmonar, mancha, regiões nem componentes):

| id | usedIn | sha256 do original / do JPEG (12 primeiros) |
|---|---|---|
| `image:rtg-2026:m23:torax-pa-roteiro-01` | m23-01, m23-05 | `a43431b089a6` / `b0275074a99a` |
| `image:rtg-2026:m30:dxa-quadril-coluna-01` | m30-02, m30-06 | `6905a26eb636` / `9213b16b0cd3` |
| `image:rtg-2026:m30:dxa-coluna-cimento-01` | m30-04 | `685d84cf7a0d` / `6bde2bb116a0` |
| `image:rtg-2026:m30:dxa-corpo-inteiro-01` | m30-05 | `6a4f7ce5084d` / `cb202b06f12f` |

O `author` da (b) não leva parênteses, porque o teste da tela de créditos monta uma expressão regular com o texto cru (`ImageCreditsScreen.test.tsx`, linha 19). O crédito da (b) cita o artigo e a autora da figura; o `modification` diz que a cópia veio do Commons e foi conferida contra o artigo.

## 4. Itens e textos alterados

Antes e depois, item a item, em `.superpowers/sdd/2026-11-22-figuras-13/itens-alterados-reais.md` (fora do git, mesma tabela da seção 4.2). A resposta certa de nenhum item mudou, salvo onde a seção 4.1 diz que o alvo deixou de existir.

### 4.1 O que a imagem real não tem, ou entrega, e o que se fez

| Item | Problema | Adaptação |
|---|---|---|
| m23-01 i2 (label) | A imagem real não tem "Etiqueta de identificação" nem "Borda de colimação". | Os dois alvos saíram dos pontos. A etiqueta vira distrator (ficha sem ponto) junto de "Eletrodo com fio". Os 3 pontos que ficam (marcador de lado, campo pulmonar, diafragma) são o mínimo do formato. **Revisão (ETB):** o retorno de erro, o de acerto e a ajuda dizem que as letras junto do "L" fazem parte da mesma peça de chumbo do marcador e que não há etiqueta de identificação à parte (explica por que quem põe a ficha "Etiqueta de identificação" sobre a tira erra); a afirmação 3 do i4 passou a "a imagem é real e não mostra nome nem número da pessoa". O marcador está no alto à direita de quem olha (a figura antiga o punha à esquerda); o texto não afirma lado anatômico. |
| m23-01 i3, i4, i5 e texto | "Esquema", "desenho, não imagem de paciente", "quadrado branco", "objeto no meio" ficariam falsos. | Reescritos: imagem real, sem nome nem número de paciente visíveis; a margem clara passa a "quando há" (a radiografia não a mostra). A conversa da Duda deixou de falar em "objeto", que a imagem normal não tem. |
| m23-05 i3 (hotspot) | Sem etiqueta. | A região "Etiqueta de identificação" vira "Marcador de lado". Diafragma continua certa. **Revisão:** a fala da Lia na cena afirmava "uma margem clara em volta", que a radiografia real não tem; passou a "Quando a imagem tem uma margem clara em volta, ela conta uma história sobre o feixe." |
| m30-02 i2 (label) (e a competência) | **L1 a L4 estão impressos na imagem e entregam a resposta** de "Vértebra L1" e "Vértebra L4". | Saíram os pontos da coluna: o item rotula as 3 regiões do fêmur no painel A (colo, trocânter, quadril total) e mantém "Cabeça do fêmur" como distrator. A prática de contar a coluna fica no i4 (L1 como resposta errada) e no checkpoint. A competência passou a "Reconhecer, numa imagem de exame, as caixas de L1 a L4 e localizar as regiões do fêmur proximal". |
| m30-02 i4 (hotspot) | "Asa do osso do quadril" não existe na imagem. | Saiu. Ficam L1, colo, trocânter (certa) e, depois da revisão, "Cabeça do fêmur" no lugar de L4 (vizinha do colo e sem região própria, distrator plausível; a certa não mudou). A região do trocânter desceu a x 0,045, y 0,35, 0,11 x 0,21 para o selo não cobrir a ponta da saliência. |
| m30-04 i2 | A imagem não tem zíper, e só tem **um** risco real (o cimento em L2). O `risk-hunt` exige de 2 a n-1 riscos. | O item vira `hotspot`: "toque no que pode estragar a medida", uma resposta certa (o ponto muito claro) e três erradas (caixas de L1, L3 e L4). É a menor mudança que mantém o item válido, mas **muda o que se mede**: de "marcar todos os riscos" para "achar o risco". O dono pode preferir manter o `risk-hunt` com outra figura. **Revisão:** a competência e o fecho deixaram de prometer o que a imagem não pratica: agora dizem "achar, numa imagem de exame, material denso sobre a vértebra e reconhecer, nos casos descritos, zíper, coluna torta e caixa fora do lugar" (zíper, coluna torta e caixa fora do lugar ficam em texto: i4 de classificar, i5, checkpoint 2). Nenhum item novo foi criado sobre o esquema antigo. |
| m30-05 (conceito) | `concept.visual` só aceita diagrama; o texto falava das "três faixas". | `visual` saiu; a frase das faixas virou "Na imagem da próxima atividade, as linhas de corte também isolam a pelve, que fica dentro do tronco" (a pelve é sub-região do tronco na divisão padrão do DXA de corpo inteiro; a aula segue em quatro regiões; ver seção 7). Nenhum texto afirma a cor das linhas: medidas, são turquesa escuro (RGB ≈ 73, 107, 108), e o painel colorido tem também linhas vermelho-magenta que a aula não explica. O `alt` do cadastro deixou de dizer "azul-claro". |
| m30-05 i4, closing, checkpoint, recuperação | Cinco trechos tratavam "as faixas de cor" da figura antiga. | Reescritos sobre as "linhas de corte" (que a legenda da fonte confirma como linhas de referência das regiões), sem cor afirmada. **Checkpoint 2, revisado**: a primeira versão perguntava "o que as linhas representam?", e a resposta certa mudava de construto (antes, "a figura não tem proporção"). Agora a pergunta é "o que cada região do corpo recebe?", que o conceito ensina sem a figura; certa: "Os três valores: osso, massa magra e gordura", e três distratores plausíveis (só o osso; um valor único de massa; valores só do tronco). A afirmação 2 do i4 segue falsa ("as linhas de corte mostram quanto de cada componente"). Não afirmei o que as cores do mapa significam: a fonte não diz. |
| m30-06 i2 (hotspot) | Rótulos sobre a figura antiga. | Rótulos novos sobre a imagem; a certa é o contorno amarelo na haste ("Contorno amarelo do osso, na haste": todas as caixas da imagem são amarelas, então só a posição e a palavra "contorno" separam a certa). A região da saliência (trocânter) desceu a x 0,045, y 0,35, 0,11 x 0,21, e o selo deixou de cobrir a ponta do osso. |

### 4.2 Lista dos itens e textos tocados

- `unit.summary` da m23 (e, por consequência, `entries.ts`).
- M23.01: objective, competency, 2 falas da cena, corpo do conceito e 1 ponto-chave, i2, i3 (prompt, 2 pares, retorno de erro), i4 (prompt, 3 afirmações, 1 retorno), i5 (prompt, 1 fala, 2 alternativas), closing, checkpoint 2, recuperação guiada.
- M23.05: objective, competency, corpo do conceito, i3, prompt do i4, closing.
- M30.02: competency, 1 fala da cena, corpo do conceito, i2, i3 (prompt e retorno), i4, closing, checkpoint 1 (prompt e 1 retorno).
- M30.04: competency, i2 (de `risk-hunt` para `hotspot`), closing.
- M30.05: conceito (sem `visual`), i2, i4, closing, checkpoint 1 (1 alternativa: "cinco" vira "quatro", porque a imagem mostra cinco linhas de região e a aula diz quatro; ver seção 7), checkpoint 2, recuperação de transferência (1 alternativa).
- M30.06: i2.

## 5. Coordenadas e o que há sob cada área certa

Todas medidas sobre o JPEG final, na régua de 280 pt do app (`hotspotTouch.ts`). Prévias com o marcador, o selo e a área de toque de 44 pt (tracejada), geradas com uma cópia adaptada de `alvos-preview.mjs` que desenha a imagem no lugar do spec (`.superpowers/sdd/2026-11-22-figuras-13/reais/previa.mjs`, fora do git; o original não foi alterado). Abri cada prévia. Prévias finais, painéis lado a lado na ordem dos itens (menos de 300 KiB cada):

- `imagens-reais/radiografia-roteiro.png`: m23-01 i2, m23-05 i3.
- `imagens-reais/dxa-regioes-de-interesse.png`: m30-02 i2, m30-02 i4, m30-06 i2.
- `imagens-reais/dxa-interferencias.png`: m30-04 i2.
- `imagens-reais/corpo-inteiro-composicao.png`: m30-05 i2.

As prévias foram reduzidas e quantizadas para caber no teto; as coordenadas valem para os JPEG, não para as prévias.

**Regiões sobre a estrutura, caixa justa.** O mínimo de 0,08 do verificador obriga o marcador de lado da (a) a uma região de 96 px de largura sobre uma tira de 45 px: a região é mais larga que o objeto (cerca de um quarto dela é a tira), e eu não a estiquei além do mínimo. Nenhuma outra região foi inflada: vértebras, cimento, trocânter e colo seguem o contorno que o autor desenhou (o colo é um retângulo inclinado, e a região é a parte baixa dele).

**Medida da área de toque da resposta certa** (`.superpowers/sdd/2026-11-22-figuras-13/reais/medir.mjs`: caixas declaradas e, no fêmur, o polígono real da caixa do colo):

| Item | Área de toque | Própria estrutura | Cada resposta errada |
|---|---|---|---|
| m23-05 i3, diafragma | 78 x 44 pt | 57% | marcador, campo pulmonar, coluna: 0%. Dos 43% sem região, cerca de um quinto é a base do pulmão logo acima e outro quinto é o abdome abaixo. |
| m30-02 i4, trocânter (região nova, x 0,045, y 0,35, 0,11 x 0,21) | 44 x 44 pt | 59% | L1, colo, cabeça do fêmur: 0%; o polígono real do colo ocupa 3% da área |
| m30-04 i2, ponto claro | 78 x 46 pt | 100% | caixas de L1, L3 e L4: 0% |
| m30-06 i2, contorno na haste | 44 x 44 pt | 28% | saliência, caixa inclinada, caixas de L1 e L4: 0%; polígono do colo 0% |

Nenhuma área certa mostra mais de uma resposta errada do que da própria estrutura. Nos itens de rótulo, as áreas de toque de 44 pt dos pontos não se sobrepõem e cabem na figura (o verificador confere), e cada ponto está sobre a estrutura na prévia.

## 6. Números dos testes (2026-11-22, Node 20.20.2)

- Verificador, 40 unidades: 40 OK, 0 reprovadas (depois da correção da revisão).
- `node scripts/content/build-rtg-batches.mjs` e `--check`: ok. `generate-rtg-maestro.mjs m23` e `m30`, e `--check`: ok (`m23-aula-01` e `m23-avaliacao-01` regenerados; `m30` sem mudança). `figuras-no-simulador.mjs --check`: ok (nenhum roteiro de figuras existia para os 4 ids; nada a regenerar).
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 454 testes, 453 passam, 1 falha (a conhecida, alheia: `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && npx jest src/features/student-checkpoints src/features/settings src/features/lesson-flow` (depois da correção da revisão, 2026-11-22): **64 suítes, 1124 testes, todos passam**, com o `hotspotTouch.test.ts` (33) agora cobrindo 90 itens de figura (82 de desenho e 8 de imagem real). Antes da correção, a mesma guarda contava 82 e reprovava com 89 (sete itens saíram do registro de figuras).
- `npx tsc --noEmit`: 0 erros. `npx eslint` nos 4 arquivos gerados: 0. `npm run test:maestro-contract`: 13 de 13.
- `node --test scripts/copy-style-contract.test.mjs`: 65 de 65 depois de subir `copy-style-baseline.json`, `rtgImages.ts`, "eyebrow", de 20 para 23 (medido: "CC BY 2.0" e "CC BY 4.0" em maiúsculas nos créditos novos).
- Não rodei `loop validate` nem `EXPO_NO_DOTENV=1 npm run quality` (o controlador é dono do run).

## 7. O que ficou de fora ou pede decisão

- **A pelve.** A fonte da (d) lista cinco regiões (cabeça, tronco, pelve, braços, pernas), e a aula diz quatro. A revisão decidiu (N6): a pelve fica como sub-região do tronco, a divisão padrão do DXA de corpo inteiro, e o conceito diz que as linhas também a isolam dentro do tronco. Acrescentei uma frase ao conceito e troquei "cinco" por "quatro" no distrator do checkpoint, mas a aula continua dizendo "quatro regiões". Decisão do dono: manter a aula em quatro ou passar a cinco.
- **m30-04 i2** deixou de ser `risk-hunt` (seção 4.1); a conclusão e a competência foram corrigidas na revisão.
- **O Fabry (b)**: resíduo de licença da seção 1.
- **Colo do fêmur**: identifiquei a caixa do colo (retângulo perpendicular ao eixo do colo, com o quadrado do triângulo de Ward ao centro) e o trocânter (saliência de fora do osso) pela forma, não por legenda do aparelho. Merece uma leitura de quem conhece o relatório da Hologic.
- As 4 figuras desenhadas seguem no registro sem uso (D6); `figuras.json` e os arquivos de alvos delas não mudaram.
- Capturas no aparelho e Maestro de figuras: não fiz (sem simulador, sem Metro).

## 8. Correção da revisão independente (2026-11-22)

Parecer em [`revisoes/imagens-reais.md`](revisoes/imagens-reais.md), com a seção "Correções aplicadas" por achado. Resumo do que mudou depois do primeiro commit:

- Texto: retornos e ajuda da M23.01 i2 sobre as letras ETB (achado 1); cena da M23.05 sem margem clara afirmada (2); conclusão e competência da M30.04 (3); competência da M30.02 (9); checkpoint 2 da M30.05 (5); "linhas de corte" e a pelve dentro do tronco (10); rótulo "Contorno amarelo do osso, na haste" (12).
- Alvos: trocânter na M30.02 i4 e na M30.06 i2 para x 0,045, y 0,35, 0,11 x 0,21 (6); ponto "Perna" da M30.05 i2 para x 0,15, y 0,68 (7); "Cabeça do fêmur" no lugar de L4 na M30.02 i4 (9). Prévias refeitas e abertas: `imagens-reais/dxa-regioes-de-interesse.png` e `imagens-reais/corpo-inteiro-composicao.png` (as outras duas não mudaram).
- Cadastro: `descriptionFromSource` da (c) com a legenda inteira; `alt` da (d) sem "azul-claro" (4, 10). Isto muda o `rtgImages.ts` gerado (créditos).
- Guarda: `hotspotTouch.test.ts` passou a cobrir também os itens com `imageId` (quadro de 280 pt com a proporção do cadastro), 90 itens; vista falhando com o defeito específico (13).
- Não aplicado: achado 8 (opcional, "se o dono quiser a cúpula mais ao centro", mudaria a região do diafragma); 11 e 14 são registros para o controlador, sem mudança de arquivo.

## Capturas no iPhone (2026-11-22)

Medido em 2026-11-22 no simulador "Radiant F7" (iPhone, dev client), com o Metro no Node 20 e `EXPO_NO_TYPESCRIPT_SETUP=1`, na ponta `d60265c1`. Os roteiros foram gerados por uma cópia de trabalho do `figuras-no-simulador.mjs` adaptada a `imageId`, fora do git; nenhum roteiro versionado mudou. Resultado por roteiro:

- `ios-real-m23-aula01.jpg` (M23.01 i2, rotular): a radiografia real inteira, com o marcador "L" e as letras "ETB" no alto à direita de quem olha. Os pontos 1 (marcador), 2 (pulmão) e 3 (cúpula) caem sobre a estrutura, e os selos não cobrem o marcador.
- `ios-real-m30-aula02.jpg` (M30.02 i2, rotular): painéis A e B lado a lado. Os três pontos ficam no fêmur do painel A, e os selos não cobrem o colo. O roteiro reprovou depois desse passo, no toque em "Continuar" que vem depois de rotular. É o defeito conhecido dos roteiros no iPhone (plano de continuidade, seção 3.3), e o passo 6 (i4) não foi capturado.
- `ios-real-m30-aula04.jpg` (M30.04 i2, tocar): coluna lombar real com o cimento em L2 e quatro regiões sobre os corpos vertebrais. A região 1 cobre o cimento, e os selos ficam fora das regiões.
- `ios-real-m30-aula05.jpg` (M30.05 i2, rotular): DXA de corpo inteiro real, com o painel de osso e o mapa de composição. Os pontos ficam na cabeça, no tronco, no braço e na diáfise do fêmur, e o selo 4 deixa livre o vértice do V.
- `ios-real-m30-aula06.jpg` (M30.06 i2, tocar): o mesmo painel duplo, com as regiões do fêmur e da coluna.
- `ios-real-m23-aula05.jpg` (M23.05 i3, tocar): **capturada depois, em 2026-11-22**, quando o gerador de roteiros passou a centralizar o botão da bancada (`f88b41d1`). Antes, o roteiro parava no passo 4, a bancada do joelho, porque os toques em "Diminuir largura" caíam no rodapé fixo. A imagem mostra a radiografia real com as quatro regiões (marcador de lado, campo pulmonar, mediastino e base do pulmão), e os selos ficam fora delas.

Este documento não prova o seguinte:
- os pontos foram vistos no tamanho da captura, e não no aparelho;
- o Android e o VoiceOver não foram vistos.

Ao fim, o Metro estava parado, o simulador desligado e a porta 8081 livre, e `radiant-app/expo-env.d.ts` não existia.

