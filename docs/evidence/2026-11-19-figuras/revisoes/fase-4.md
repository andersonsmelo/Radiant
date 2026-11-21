# Revisão independente da fase 4: três fluxos com ícones do Lucide (2026-11-21)

Esta revisão foi feita por IA, e não por um profissional de radiologia nem por um advogado. Ela cobre os commits `e714a3a7` e `c338ee97`, sobre a base `502f445d`. Li tudo pelo git. Testei numa worktree destacada em `c338ee97`, com link simbólico de `radiant-app/node_modules`, removida ao fim.

Li o brief do revisor, a gramática (`docs/content/2026-11-19-gramatica-de-graficos.md`), o parecer da fase 3 como régua de rigor e as decisões L1 a L5 (`decisoes-f4.md`).

**Como medi:**
- Os renders são meus, pelo Chrome, a 840 x 630 px (o quadro de 280 x 210 pt a 3x), sobre #171920.
- Os selos, pontos e áreas de toque vêm das funções do próprio app (`labelBadgeBoxes`, `badgeBoxes`, `touchRect`, `LABEL_DOT` de `hotspotTouch.ts`), carregadas por `load-app-contract.cjs`.
- A tinta foi contada por cor da paleta: `P.line` e `P.beam` para o ícone, `P.accent` para a seta.
- Os scripts ficaram no meu rascunho, fora do repositório.

## Vereditos

| Figura | Veredito |
|---|---|
| `cadeia-de-custodia` (m31 aulas 3 e 4) | aprovada com correções a fazer (I1, I2, I3) |
| `fluxo-de-pesquisa` (m31 aula 5) | aprovada com correções a fazer (I1, I3 no texto do crédito) |
| `fluxo-ris-pacs` (m22 aulas 4 e 6) | aprovada com correções a fazer (I1, I3) |

Contagem: 0 Críticos, 3 Importantes, 6 Menores. Há mais um ponto, anterior à fase e fora do escopo dela.

## Gates (worktree em `c338ee97`, Node 20.20.2)

- `rtg-lesson-lint.mjs`, arquivo por arquivo, nas 40 unidades: 40 de 40 com saída 0 (m22 e m31: `OK`).
- `build-rtg-batches.mjs --check`: ok. `scripts/qa/figuras-no-simulador.mjs --check`: ok. `scripts/qa/generate-rtg-maestro.mjs --check` em m22 e m31: ok.
- `node --test scripts/content/figuras/fluxos/*.test.mjs scripts/content/rtg-figuras.test.mjs`: 24 de 24.
- Receita: rodei os três geradores (`node scripts/content/figuras/fluxos/<id>.mjs`) no checkout limpo. `git status` ficou limpo, então specs e alvos saem byte a byte.
- `EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/diagrams src/features/settings src/features/student-checkpoints src/features/lesson-flow`: 68 suítes e 1662 testes, todos passam.
- Não rodei o `npm run quality` inteiro, o `visual:qa:strict`, `tsc` nem `eslint`.

## Requisitos tardios L1 a L5

### L1: quase conforme

- `OPEN_LICENSE` (`scripts/content/rtg-figuras.mjs:12`) aceita `ISC`, ancorada, e só ela foi acrescentada.
- O vermelho em `vermelho-f4.txt` é do defeito certo: `ISC` reprovada com "licença fora de CC0, domínio público e CC BY: ISC".
- Conferi a outra metade: troquei a régua por uma versão sem âncora (`...)$|ISC`), e a asserção nova reprovou com `'ISC License'`. Depois restaurei o arquivo.
- As três entradas estão em `figuras.json` e em `RTG_FIGURE_CREDITS`. A tela de créditos (`ImageCreditsScreen.tsx`) as lista pelo caminho de sempre.
- Exceções: I3, M1 e M2.

### L2: conforme

- `vendor/lucide/` tem `LICENSE`, `README.md` e `icones.json`. Os geradores leem do repositório. Há `fluxos/README.md` e `fluxos/fluxos.test.mjs`.
- O teste compara os sha256 com o README do próprio vendor, não com o pacote. Fiz essa conferência contra o pacote (abaixo).

### L3: quase conforme

- Os pontos e as regiões estão sobre os cartões.
- As 15 frases `where` são verdadeiras sobre o desenho, e os `alt` não nomeiam respostas.
- Os três rótulos da m31 foram renomeados, e as certas continuam "Livro de registro" e "Armário trancado".
- O "Arquivo trancado" usa `folder-lock`.
- O selo do `hotspot` fica fora da região e não recebe toque (`pointerEvents="none"`).
- Exceção: no `label`, o selo e o ponto escondem justamente o detalhe que três `where` citam (I1).

### L4: conforme

- Os specs não têm `motion`, `keys` nem `poster`, e o teste dos fluxos barra isso.

### L5: conforme

- `git diff --name-only 502f445d c338ee97` não tem nenhum arquivo fora de `arquivos-do-run-f4-b.txt`.
- `docs/STATUS.md`, os planos e o ADR não foram tocados.
- As prévias, `fase-4.md` e o README das amostras estão atualizados.

## Licença

- **Página do Lucide.** Li https://lucide.dev/license. Ela traz:
  - a ISC com "Copyright (c) 2026 Lucide Icons and Contributors";
  - a lista dos ícones derivados do Feather;
  - a MIT de Cole Bemis para essa lista.
- **Pacote.** O `package.json` de `lucide-static@1.77.0` diz `"license": "ISC"` e `"version": "1.77.0"`. O `LICENSE` do pacote baixado é idêntico, byte a byte, a `vendor/lucide/LICENSE`.
- **sha256.** Baixei os 13 SVG de `unpkg.com/lucide-static@1.77.0/icons/`. Os 13 sha256 batem com o `vendor/lucide/README.md`, e os 13 textos são iguais aos de `icones.json`. Os três `sha256Original` (concatenação na ordem do fluxo) também batem.
- **Derivação do Feather.** Comparei com `feather-icons@4.29.2` (MIT, "Copyright (c) 2013-2023 Cole Bemis"). Quatro dos 13 ícones carregam desenho do Feather, embora não estejam nominalmente na lista (I3).

## Fidelidade dos ícones

- Os 13 grupos dos specs têm os mesmos elementos do original, com o texto de cada elemento idêntico (contagem e comparação de string, ícone a ícone).
- O grupo leva os atributos do `<svg>` do Lucide: `fill="none"`, traço 2, pontas e junções redondas. Leva também `translate(centro - 24) scale(2)`.
- Por render: os ícones originais, recoloridos e postos no mesmo lugar, contra a camada de ícones do spec, a 960 x 720. A diferença foi de 0 px nas três figuras (31.669, 28.935 e 29.113 px de tinta).
- Só cor, escala e posição mudaram. Nada foi acrescentado ao ícone.

## Achados

### I1 (Importante): no `label`, o selo e o ponto escondem o detalhe que o `where` manda procurar

- **Onde:** m22 aula 4 (`m22.json:1276-1311`), m31 aula 3 (`m31.json:910-945`) e m31 aula 5 (`m31.json:1658-1693`). Pontos no centro do ícone: x 0,175, 0,5 e 0,825; y 0,2917 e 0,7083.
- **O que está errado:** o ponto de 12 pt fica no centro do ícone. O selo opaco de 36 x 24 pt fica acima e à direita do ponto, encostado (`labelBadgeBoxes`), e cobre o quadrante superior direito do ícone.
- **Tinta de ícone sob selo e ponto, medida por cor:**

  | Figura | Cartão a cartão |
  |---|---|
  | `fluxo-ris-pacs` | 16,3%, 20,2%, 17,3%, 17,1% e 21,4% |
  | `cadeia-de-custodia` | 20,7%, 18,2%, 33,2%, 21,8% e 10,5% |
  | `fluxo-de-pesquisa` | 16,9%, 9,5%, 33,2%, 21,7% e 10,5% |

- **Detalhes nomeados pelo `where` que ficam cobertos** (fração geométrica, em unidades do ícone):
  - "o caderno com **uma caneta**" (Livro de registro): quase toda a caneta fica sob o selo 4, e a ponta fica sob o ponto.
  - "a tela com **um visto**" (Estação de visualização): cerca de 80% do visto fica sob o ponto. Sobra uma ponta de uns 3 pt.
  - "o quadro âmbar com **uma linha no meio**" (Aquisição da imagem, duas aulas): 69% da linha fica sob o ponto, e o canto superior direito do quadro fica sob o selo 3. É o cartão mais coberto (33,2%).
  - "a folha com um visto" (Aprovação do comitê): metade do visto e a dobra da folha ficam cobertas.
- **O que a evidência mediu:** a evidência (`fase-4.md:36`) mediu selo contra cartão e seta ("75% do próprio cartão, 0% de outro cartão"). Não mediu selo contra ícone. O `relatorio.md` reconhece o ponto sobre o centro, mas não o selo.
- **Cenário:** o leitor de tela fala "Ponto 4, embaixo à direita, o caderno com uma caneta". Quem olha vê um caderno sem caneta sob um selo escuro. O ícone vira um palpite, e a ordem das setas é que decide.
- **Correção sugerida (medida por mim, só geometria):**
  - Pôr cada ponto no canto superior esquerdo do cartão, em (x+8, y+4) unidades do quadro: (0,0813; 0,1667), (0,4063; 0,1667), (0,7312; 0,1667), (0,7312; 0,5833) e (0,4063; 0,5833), nas três aulas.
  - O ponto fica sobre o cartão e fora do ícone. O ponto continua sobre a caixa do alvo.
  - Os selos do app vão para fora dos cartões: no alto, em y 5,7 a 33,2; embaixo, em y 105,7 a 133,1, no vão entre as fileiras. Nenhum toca um ícone.
  - A área de toque de 44 pt fica com uns 38% de cartão e o resto de fundo, sem tocar outro cartão.
  - O selo do cartão 4 passa a cruzar a seta vertical (x 240,8 a 282). Por isso essa correção vai junto com a de I2.
  - Meça de novo por pixel depois.

### I2 (Importante): no `hotspot` da m31 aula 4, o selo do "Livro de registro" esconde 91% da seta que sai da imagem

- **Onde:**
  - `m31.json:1270-1316`, regiões na ordem Invólucro, Livro, Aquisição, Armário e Entrega;
  - a seta em `scripts/content/figuras/fluxos/cadeia-de-custodia.mjs:20` (x = 264).
- **O que está errado:** `badgeBoxes` põe o selo 2 acima do cartão do Livro, alinhado à esquerda: x 197,8 a 233,8 pt e y 95 a 119 pt, ou x 226 a 267 e y 108,6 a 136 em unidades do quadro.
  - A seta vertical Aquisição → Livro está em x 258,5 a 269,5. Por cor, 662 dos 728 px dela ficam sob o selo (90,9%).
  - A evidência diz "16,1% da seta [...] que continua legível" (`fase-4.md:36`). Na minha captura sobra só uma lasca da ponta, à direita do selo.
- **Cenário:** o item pergunta pelos "dois passos que vêm depois da imagem". A seta que mostra que o Livro vem logo depois da Aquisição está escondida. O aluno ainda deduz pela serpentina, mas a figura deixa de mostrar a ligação que o item cobra.
- **Correção sugerida:**
  - Mover a seta vertical, no gerador comum, para x ≈ 288 (linha x1 = x2 = 288; ponta em 282,5 a 293,5).
  - Ela continua ligando o cartão 3 ao 4, que vão de 226 a 302, e sai de baixo do selo do hotspot (226 a 267) e do selo do ponto 4 de I1 (até 282).
  - Regenerar as três figuras e medir de novo.
  - No `fluxo-ris-pacs` não há região sobre o cartão 4, então hoje a seta aparece inteira. Mesmo assim, a grade é uma só.

### I3 (Importante): o crédito afirma "Nenhum dos ícones é derivado do Feather", e isso não se sustenta para quatro ícones

- **Onde:** `content-manifest/rtg-2026/figuras.json:462, 473, 484` e `rtgImages.ts:313, 322, 331`. A frase aparece ao aluno na tela de créditos, no campo "Modificação". Também em `fase-4.md:7` e `vendor/lucide/README.md:5`, de forma literal ("não está na lista").
- **O que está errado:** comparei com `feather-icons@4.29.2`. Três ícones vêm todos de `fluxo-ris-pacs`:
  - `clipboard-list` contém o `clipboard` do Feather idêntico: o mesmo `path` e o mesmo `rect` 8 x 4 em (8, 2). E `clipboard` está na lista MIT do `LICENSE`.
  - `monitor-check` contém o `monitor` do Feather idêntico: o `rect` 20 x 14 em (2, 3) e as duas linhas do pé. `monitor` também está na lista.
  - `hard-drive` tem o mesmo contorno do Feather, só com cantos arredondados.

  O quarto está na `cadeia-de-custodia`: `package` tem o contorno hexagonal do `package` do Feather, com o mesmo traçado a partir de outro ponto de início.
- **O que vale e o que falta:**
  - A lista do Lucide cita só o ícone base. Os compostos não aparecem nela, mas carregam o desenho base.
  - A MIT só pede o aviso de copyright e de permissão. O `vendor/lucide/LICENSE` já o versiona.
  - O app não mostra o aviso de Cole Bemis em lugar nenhum, e a frase do crédito é falsa para o aluno.
  - O risco jurídico é baixo: o próprio Lucide distribui esses ícones como ISC. Mas a afirmação foi feita como fato verificado.
- **Correção sugerida (decisão do dono):**
  - Tirar a frase em qualquer caso.
  - Depois, escolher uma de duas saídas:
    - (a) acrescentar ao crédito de `fluxo-ris-pacs` e de `cadeia-de-custodia` algo como "inclui desenho do Feather, Copyright (c) 2013-present Cole Bemis, MIT" (a `license` pode continuar `ISC`);
    - (b) trocar os quatro ícones por outros sem desenho do Feather.

  Pela régua de L1 ("só ISC a mais"), a saída (a) pede o aceite expresso da MIT pelo dono.

### M1 (Menor): a tela de créditos não traz o aviso de permissão da ISC nem o link da licença

- **Onde:** `ImageCreditsScreen.tsx:32-41`.
- **O que está errado:**
  - A ISC pede que "the above copyright notice and this permission notice appear in all copies".
  - A tela mostra "Autoria" e "Licença: ISC", e o único link vai para `sourcePage` (https://lucide.dev), não para `licenseUrl`.
  - Segue o caminho que L1 mandou usar, por isso é Menor.
- **Correção:** um link para `licenseUrl` (que já está no registro), ou o texto de `vendor/lucide/LICENSE` numa tela de licenças. Esse texto já inclui a MIT do Feather e resolve parte de I3.

### M2 (Menor): a régua aceita ISC para qualquer entrada `acervo`, não só para ícones

- **Onde:** `rtg-figuras.mjs:12`.
- **O que está errado:** L1 diz "só ela; a regra para arte continua CC0, domínio público ou CC BY". Uma arte de acervo declarada ISC passaria.
- **Correção:** exigir ISC junto de uma marca de conjunto de ícones, por exemplo `sourcePage` em `lucide.dev` ou um campo próprio, e acrescentar uma asserção que reprove arte ISC.

### M3 (Menor): a mensagem de erro perdeu o espaço

- **Onde:** `rtg-figuras.mjs:30`.
- **O que está errado:** `...CC BY e ISC:${entry.license}` sai como "ISC:CC BY-SA 4.0".
- **Correção:** `ISC: ${entry.license}`.

### M4 (Menor): o desvio do regex de cor é inofensivo, mas a justificativa exagera

- **Onde:** `diagramRegistry.test.ts:117-118`; `fase-4.md` ("sem aceitar cor fora da paleta").
- **O que está errado:** a régua das figuras importadas nunca conferiu a paleta, só o formato. Antes ela já aceitava qualquer `#rrggbb` em minúsculas, e o `/i` só acrescenta as maiúsculas. Não abre porta nova.
  - Quem barra cor fora da paleta nos fluxos é o `fluxos.test.mjs`: nenhum hexadecimal literal nas camadas, só `${P.*}`.
  - A régua das figuras desenhadas, que confere a paleta, não mudou.
- **Correção:** só a frase da evidência. Desvio aceito.

### M5 (Menor): três ícones e textos não casam bem com o nome do passo

- "Armário trancado" (cadeia) é desenhado como `folder-lock`. O `where` diz "a pasta com um cadeado". O aluno acha por eliminação, mas o desenho é uma pasta, não um armário.
- Na m31 aula 5, a explicação diz "Neste esquema, a ficha do dado leva o nome coberto" (`m31.json:1612`), e o esquema mostra um olho riscado.
- "o disco de armazenamento" descreve um gabinete de HD, sem disco à vista.

Nenhum desses erra a resposta. Sugestão: na m31 aula 5, "Neste esquema, o olho riscado marca a ficha do dado com o nome coberto". O resto fica opcional.

### M6 (Menor): as três figuras têm o mesmo `alt`, e na tela de créditos as três "Ilustração N" ficam indistinguíveis

- **Onde:** `cadeia-de-custodia.mjs:79`, `rtgImages.ts`.
- **O que está errado:** o `alt` não nomeia resposta, e isso está certo. Mas quem lê os créditos não sabe qual cartão é de qual figura.
- **Correção:** um `alt` por figura com o tema e sem os passos. Por exemplo, "Fluxo de cinco cartões com ícones, do pedido à tela de visualização, ligados por setas: ...". O tema já está no enunciado das aulas.

### Fora do escopo (anterior à fase)

- A m31 aula 4 pede "Toque nos **dois** passos" (`m31.json:1270`), mas o `hotspot` aceita uma só seleção. Qualquer uma das duas regiões certas fecha o item (`InteractionAnswerValue.ts:277-278`).
- O enunciado não mudou nesta fase. Registro aqui para quem cuidar da m31.

## Alvos e área de toque (medido por pixel)

- **Rotular (5 x 3 pontos):** a área de toque de 44 pt de cada ponto cai 100% no próprio cartão, com 0% de outro cartão, seta ou fundo. Cada ponto está sobre o cartão que o rótulo nomeia. O problema é o que fica sob selo e ponto (I1).
- **Tocar (m22 aula 6 e m31 aula 4):** a área de toque é o próprio cartão (76 x 68 é maior que 44 pt), com 100% do cartão nomeado e 0% de outro cartão, seta ou fundo. A região não foi inflada.
  - A área certa (Estação; Livro e Armário) não cobre cartão de resposta errada.
  - Na m22, o erro típico ("Arquivo de imagens", o que parou) não tem região, então não pode ser escolhido. Isso já era assim antes.
  - Nos dois itens de toque, o selo fica fora da região, com 0% de tinta de ícone sob ele. A exceção é a seta de I2.

## Itens alterados

- **m22 aula 4 (`label`):**
  - Continua válido. As cinco respostas são as mesmas e a ordem (cadastro, lista de trabalho, equipamento, arquivo e estação) é a ensinada na explicação da aula.
  - As cinco `where` são verdadeiras sobre o desenho e não nomeiam o passo.
  - O que muda para o aluno: os ícones são genéricos (sem tubo, mesa nem paisagem). O item passa a cobrar a leitura do ícone mais a ordem das setas.
  - **Recomendação:** manter, com a correção de I1.
- **m22 aula 6 (`hotspot`):**
  - Continua válido. A certa continua "Estação de visualização", e a ajuda "Siga a seta que sai do arquivo de imagens" bate com a seta 4 → 5.
  - **Recomendação:** manter como está.
- **m31 aula 3 (`label`):**
  - Continua válido, com as coordenadas iguais.
  - "o pacote fechado" perdeu "com uma etiqueta", e com razão: o ícone não tem etiqueta.
  - **Recomendação:** manter, com a correção de I1 (caneta e linha do meio).
- **m31 aula 4 (`hotspot`):**
  - Os três rótulos renomeados ("Aquisição da imagem", "Entrega assinada", "Armário trancado") são os nomes declarados e não mudam a resposta: as certas continuam Livro e Armário.
  - O retorno "Essa região vem antes ou durante a imagem" vale para as três erradas.
  - **Recomendação:** manter, com a correção de I2.
- **m31 aula 5 (`label`):**
  - Continua válido, com as coordenadas iguais.
  - **Recomendação:** manter, com a correção de I1 (a linha da aquisição e o visto da aprovação) e a frase de M5.
- **`alt` das três figuras:** não nomeia resposta. Ver M6.

## O que o dono deve olhar no simulador

1. m31 aula 3: dá para ver a caneta do "Livro de registro" e a linha da "Aquisição da imagem" com os selos 3 e 4 no lugar?
2. m22 aula 4: dá para ver o visto da "Estação de visualização" sob o ponto?
3. m31 aula 5: aparecem a linha da aquisição e o visto da aprovação?
4. m31 aula 4: a seta da Aquisição para o Livro aparece, ou some sob o selo 2?
5. Ajustes → Créditos das imagens: as três ilustrações novas, o texto "Nenhum dos ícones é derivado do Feather" (I3) e se o link leva à licença.

## O que não consegui verificar

- O `npm run quality` inteiro, o `visual:qa:strict`, `tsc` e `eslint`.
- O app rodando: não rodei simulador, e a fala do VoiceOver ficou sem conferir.
- A interpretação jurídica da ISC e da MIT sobre os ícones compostos: é leitura de IA, não parecer jurídico.
- O histórico de cada ícone no repositório do Lucide (autores e data de redesenho). Comparei só com o `feather-icons@4.29.2` publicado.
- As frações de caneta, visto e linha sob selo e ponto em I1 são geométricas, nas coordenadas do ícone. Os totais por cartão são contagem de pixel.
- A posição sugerida em I1 e I2 foi conferida só por geometria (`labelBadgeBoxes` e `touchRect` do app), sem render.
