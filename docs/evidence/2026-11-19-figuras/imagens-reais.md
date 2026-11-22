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
| `imagens/m30/dxa-coluna-cimento-01.jpg` | PNG 2100 x 1064 de três painéis; **recorte do painel da esquerda** (10,150)-(670,1040), cinza | 660 x 890 | 78,8 KiB | Só L1 a L4. O recorte corta a barra cinza da janela no alto e os painéis do meio e da direita. Sem nome nem data. |
| `imagens/m30/dxa-corpo-inteiro-01.jpg` | PNG 1026 x 1418 de dois painéis, redução para 1200 de altura, **sem recorte**, em cor | 868 x 1200 | 102,8 KiB | Nenhum texto. |

Por que o painel da esquerda na (c): é o painel com o cimento dentro da caixa de L2. O do meio exclui L2 da região (a decisão da equipe que a aula manda não tomar) e o da direita é o exame de um ano antes, sem cimento. Recorte só por enquadramento: nada foi apagado, pintado nem retocado em nenhuma imagem. Soma das 11 imagens do cadastro dentro do teto de 15 MiB.

Ressalva da (a), do dono decidir: "ETB" é lido aqui como letras do marcador de chumbo (iniciais de quem fez o exame), mas a página do Commons não diz. Por isso a aula diz "sem nome nem número de paciente visíveis", e não "sem identificação".

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
| m23-01 i2 (label) | A imagem real não tem "Etiqueta de identificação" nem "Borda de colimação". | Os dois alvos saíram dos pontos. A etiqueta vira distrator (ficha sem ponto) junto de "Eletrodo com fio". Os 3 pontos que ficam (marcador de lado, campo pulmonar, diafragma) são o mínimo do formato. O marcador está no alto à direita de quem olha (a figura antiga o punha à esquerda); o texto não afirma lado anatômico. |
| m23-01 i3, i4, i5 e texto | "Esquema", "desenho, não imagem de paciente", "quadrado branco", "objeto no meio" ficariam falsos. | Reescritos: imagem real, sem nome nem número de paciente visíveis; a margem clara passa a "quando há" (a radiografia não a mostra). A conversa da Duda deixou de falar em "objeto", que a imagem normal não tem. |
| m23-05 i3 (hotspot) | Sem etiqueta. | A região "Etiqueta de identificação" vira "Marcador de lado". Diafragma continua certa. |
| m30-02 i2 (label) | **L1 a L4 estão impressos na imagem e entregam a resposta** de "Vértebra L1" e "Vértebra L4". | Saíram os pontos da coluna: o item rotula as 3 regiões do fêmur no painel A (colo, trocânter, quadril total) e mantém "Cabeça do fêmur" como distrator. A prática de contar a coluna fica no i4 (L1 e L4 como respostas erradas) e no checkpoint. |
| m30-02 i4 (hotspot) | "Asa do osso do quadril" não existe na imagem. | Saiu. Ficam L1, colo, trocânter (certa) e L4. |
| m30-04 i2 | A imagem não tem zíper, e só tem **um** risco real (o cimento em L2). O `risk-hunt` exige de 2 a n-1 riscos. | O item vira `hotspot`: "toque no que pode estragar a medida", uma resposta certa (o ponto muito claro) e três erradas (caixas de L1, L3 e L4). É a menor mudança que mantém o item válido, mas **muda o que se mede**: de "marcar todos os riscos" para "achar o risco". O dono pode preferir manter o `risk-hunt` com outra figura. |
| m30-05 (conceito) | `concept.visual` só aceita diagrama; o texto falava das "três faixas". | `visual` saiu; a frase das faixas virou "Na imagem desta aula, as linhas azuis também isolam a pelve" (a imagem tem a pelve com linhas próprias, e a aula diz quatro regiões; ver seção 7). |
| m30-05 i4, closing, checkpoint, recuperação | Cinco trechos tratavam "as faixas de cor" da figura antiga. | Reescritos sobre as linhas azuis (que a legenda da fonte confirma como linhas de referência das regiões). No checkpoint 2, a pergunta virou "o que as linhas azuis representam?" (certa: os cortes que dividem o corpo em regiões). Não afirmei o que as cores do mapa significam: a fonte não diz. |
| m30-06 i2 (hotspot) | Rótulos sobre a figura antiga. | Rótulos novos sobre a imagem; a certa é o contorno amarelo na haste. |

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
| m30-02 i4, trocânter | 44 x 44 pt | 41% | L1, colo, L4: 0%; o polígono real do colo ocupa 4% da área |
| m30-04 i2, ponto claro | 78 x 46 pt | 100% | caixas de L1, L3 e L4: 0% |
| m30-06 i2, contorno na haste | 44 x 44 pt | 28% | saliência, caixa inclinada, caixas de L1 e L4: 0%; polígono do colo 0% |

Nenhuma área certa mostra mais de uma resposta errada do que da própria estrutura. Nos itens de rótulo, as áreas de toque de 44 pt dos pontos não se sobrepõem e cabem na figura (o verificador confere), e cada ponto está sobre a estrutura na prévia.

## 6. Números dos testes (2026-11-22, Node 20.20.2)

- Verificador, 40 unidades: 40 OK, 0 reprovadas.
- `node scripts/content/build-rtg-batches.mjs` e `--check`: ok. `generate-rtg-maestro.mjs m23` e `m30`, e `--check`: ok (`m23-aula-01` e `m23-avaliacao-01` regenerados; `m30` sem mudança). `figuras-no-simulador.mjs --check`: ok (nenhum roteiro de figuras existia para os 4 ids; nada a regenerar).
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 454 testes, 453 passam, 1 falha (a conhecida, alheia: `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings`: 68 suítes, 1663 testes, **1662 passam, 1 falha**: `hotspotTouch.test.ts`, "encontra os 89 itens de figura das 40 unidades", agora 82 (sete itens saíram do registro de figuras: m23-01 i2, m23-05 i3, m30-02 i2 e i4, m30-04 i2, m30-05 i2, m30-06 i2). O arquivo não estava na lista do run e **não foi tocado**; a correção é trocar 89 por 82 na linha 289.
- `npx tsc --noEmit`: 0 erros. `npx eslint` nos 4 arquivos gerados: 0. `npm run test:maestro-contract`: 13 de 13.
- `node --test scripts/copy-style-contract.test.mjs`: 65 de 65 depois de subir `copy-style-baseline.json`, `rtgImages.ts`, "eyebrow", de 20 para 23 (medido: "CC BY 2.0" e "CC BY 4.0" em maiúsculas nos créditos novos).
- Não rodei `loop validate` nem `EXPO_NO_DOTENV=1 npm run quality` (o controlador é dono do run).

## 7. O que ficou de fora ou pede decisão

- **A pelve.** A fonte da (d) lista cinco regiões (cabeça, tronco, pelve, braços, pernas), e a aula diz quatro. Acrescentei uma frase ao conceito e troquei "cinco" por "quatro" no distrator do checkpoint, mas a aula continua dizendo "quatro regiões". Decisão do dono: manter a aula em quatro ou passar a cinco.
- **m30-04 i2** deixou de ser `risk-hunt` (seção 4.1).
- **O Fabry (b)**: resíduo de licença da seção 1.
- **Colo do fêmur**: identifiquei a caixa do colo (retângulo perpendicular ao eixo do colo, com o quadrado do triângulo de Ward ao centro) e o trocânter (saliência de fora do osso) pela forma, não por legenda do aparelho. Merece uma leitura de quem conhece o relatório da Hologic.
- As 4 figuras desenhadas seguem no registro sem uso (D6); `figuras.json` e os arquivos de alvos delas não mudaram.
- Capturas no aparelho e Maestro de figuras: não fiz (sem simulador, sem Metro).
