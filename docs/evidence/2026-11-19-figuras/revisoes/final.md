# Revisão final independente da troca das figuras: lote 1F, fase 2 e selo do app (2026-11-21)

Esta revisão foi feita por IA, não por um profissional de radiologia. Ela cobre o intervalo `6e3bd4e2..3d1ebfad` da branch `claude/figuras-fase-1` (36 commits): o lote 1F, os lotes 2A, 2B, 2C e 2D, com as 22 cenas isométricas, e a mudança do selo e do marcador em `hotspotTouch.ts`. Não repeti as revisões de lote. Procurei o que só aparece olhando o conjunto.

Durante a revisão, a worktree `trilha-dobrada` avançou para `63de0f9b` (documentação das fases 2 a 6, fora do intervalo). Conferi com `git diff --stat 3d1ebfad..63de0f9b`: o commit só muda documentos, nada em `content-manifest/`, `scripts/content/figuras/` nem `radiant-app/src/`. Por isso, as medidas e os renders que fiz sobre essa árvore valem para `3d1ebfad`. Os gates rodaram num checkout limpo de `3d1ebfad`.

## Veredito geral

**Pronto para o dono ver no aparelho, com uma correção recomendada antes de liberar a M18.01.** Os gates passam num checkout limpo, sem nenhuma falha (os números estão na seção 5). Todos os achados Críticos e Importantes dos sete pareceres de lote estão resolvidos no código atual, como as decisões do controlador mandaram (seção 1). As 22 cenas formam um conjunto coerente (seção 3).

O que só aparece olhando o conjunto é um efeito colateral da mudança do selo sobre uma figura antiga. Na M18.01 `i3` (lote 1B), o selo "3" cai exatamente sobre o osso do quadril do lado **direito** do paciente, numa pergunta sobre o lado **esquerdo**. Como tocar no selo seleciona o dono dele (E13), quem erra o lado ganha a questão (achado 1). Isso não impede o dono de ver o resto no aparelho, mas a M18.01 não deve chegar a aluno assim.

Contagem: 0 Crítico, 1 Importante, 7 Menores.

## Achados

### 1. Importante: na M18.01 `i3`, o selo "3" cobre o quadril do lado errado, e tocar nele dá a resposta certa

- **Onde:** `content-manifest/rtg-2026/aulas/m18.json` (m18-01 `i3`, figura `esqueleto-axial-apendicular`, lote 1B); `radiant-app/src/features/lesson-flow/renderers/hotspotTouch.ts` (`badgeBoxes`); `HotspotStepRenderer.tsx:82` (o selo chama `onSelect(region.id)` do dono).
- **O que acontece:** a pergunta é "Toque no osso que prende o membro inferior ao esqueleto axial, do lado esquerdo do paciente". A região certa é o quadril à direita da figura. O `pick` descarta a posição acima, que pisa na caixa torácica, e a posição abaixo, que pisa na área de toque do fêmur. Sobra a posição à esquerda da região, que é exatamente o osso do quadril do lado direito do paciente. Esse osso está declarado em `esqueleto-axial-apendicular.alvos.json` ("Osso do quadril direito"), mas não é região do item, então nenhuma regra o protege.
  - **Medida:** o selo cobre 85% da caixa declarada desse osso em 280 pt, 67% em 320 pt e 49% em 358 pt.
  - **Render:** `alvos-preview`, recortado. O "3" opaco ocupa o lugar do quadril direito, colado à região certa.
- **Cenário para o aluno:** a questão existe para testar lateralidade. Quem confunde o lado toca o quadril à esquerda da figura, ou seja, toca o selo "3". Pelo E13, isso seleciona a região 3, que é a certa, e a conferência diz "certo". Quem acerta também acerta. O item deixa de distinguir quem sabe o lado de quem não sabe, e o distrator natural, o outro quadril, fica escondido.
- **Antes da mudança:** o selo ficava dentro da própria região, e tocar no quadril direito não selecionava nada.
- **Correção sugerida, em ordem de custo:**
  1. **Conteúdo (a mais barata):** acrescentar ao `i3` a região "Osso do quadril direito" como distrator, com a caixa declarada que já existe. O `pick` passa a evitá-la, e o item cobra o lado de forma explícita. A resposta certa não muda, mas as opções mudam, então a decisão é do dono (D7).
  2. **Guarda de conteúdo (vale para todas as figuras):** nenhum selo de tocar ou de caça ao risco pode cobrir mais de ~30% de uma caixa declarada em `<id>.alvos.json` que não seja região do próprio item. Ela precisa ser vista falhando com a m18-01 de hoje. Hoje ela também pegaria a m20-05 `i2` (o selo 1 sobre 31% da medula espinal), que é benigna, porque a medula também é sistema nervoso central.
  3. **App:** sem a correção 1, fazer o `pick` preferir a candidata à direita da região. Ela fica livre em 280 pt, mas isso só desloca o problema.

### 2. Menor: no osso longo (1F, M18.02 `i3`), o selo "3" esconde mais da epífise distal do que o marcador antigo

- **Onde:** `osso-longo`, ponto 3. Em 280 pt, o ponto mais o selo escondem 46% da caixa declarada "Epífise distal", contra 31% do círculo antigo de 28 pt. Em 320 pt, 40% contra 25%. O selo cobre também 57% da "Cartilagem do côndilo", declarada e sem uso.
- **Cenário:** o aluno precisa ver a ponta larga da direita para pôr a ficha. O "3" fica em cima dela, e não ao lado. O efeito vem da posição "acima e à direita", sem obstáculo, sobre o côndilo.
- **Correção:** a regra de `labelBadgeBoxes` não conhece a estrutura do próprio ponto. A saída mais barata é de conteúdo: mover o ponto 3 para a borda inferior esquerda da epífise, ainda dentro da caixa, para o selo cair sobre o fundo. Meça de novo depois.

### 3. Menor: resíduos do achado 2 da revisão do 2A, ainda abertos depois do E12

O E12 mandava "reduzir" esses casos, e o registro do controlador já os dá como parciais. Confirmo os números em 280 pt:
- na m20-04 `i2`, o selo 3 (bexiga) cobre 22% do "Ureter do lado esquerdo do paciente";
- na m25-02 `i2`, o selo 2 (linha interpupilar) fica sobre a linha do plano sagital mediano, cobrindo 25% dela. Olhando o render, o "2" se lê também como rótulo da linha vertical, que é o ponto 3.

Ficam como pendência visível ao dono, sem correção nova. Mudar exigiria que o `labelBadgeBoxes` recebesse as caixas declaradas, o que é decisão de arquitetura.

### 4. Menor: a placa de saída da `itens-de-emergencia-da-sala` é uma seta amarela

- **Onde:** `scripts/content/figuras/cenas/itens-de-emergencia-da-sala.pecas.mjs` e o `where` da m17-05 `i2` ("a abertura alta com seta amarela acima").
- **O problema:** pela mesma lógica que levou o oxigênio a verde (achado 8 do 2A), a sinalização de saída de emergência no Brasil tem fundo verde com pictograma claro (ABNT NBR 13434; cito de memória, a conferir na norma). Um aluno que conhece a placa real pode estranhar a seta amarela, porque amarelo, na sinalização de segurança, é alerta.
- **Correção:** placa verde com seta branca; `where` "a abertura alta com a placa verde acima"; regenerar a fonte, o spec e o batch.

### 5. Menor: a `dxa-dois-feixes` desenha dois feixes paralelos, e o conceito ensina um feixe com duas energias

- **Onde:** a fonte da cena; o `alt` ("dois feixes finos, amarelo e ciano"); o `where` do ponto "Feixe" na m30-01 `i2`.
- **O problema:** o conceito diz "O feixe é estreito e tem dois níveis de energia", e é isso que a técnica faz: as duas energias percorrem o mesmo caminho. Duas linhas separadas lado a lado sugerem duas fontes ou dois trajetos. O revisor do 2CD aceitou o desenho porque ele segue o título da aula ("Dois feixes, duas energias"). Eu leio a figura contra o conceito, que é mais preciso que o título.
- **Correção:** um feixe só, com duas faixas de cor encostadas (ou alternadas) no mesmo trajeto; `alt` "um feixe fino de duas cores"; `where` sem "duas linhas". O título e a fala da Dona Aurora podem ficar, porque o conceito responde a eles.

### 6. Menor: a gestante, a "Dona Aurora" e a idosa usam a mesma pessoa de cabelo curto castanho

- **Onde:** `kit/pessoa.mjs` e as cenas `gestante-campo-e-feixe`, `dxa-dois-feixes`, `dxa-posicionamento` e `idoso-apoios-e-riscos`.
- **O problema:** a regra R1 (pessoa única, trocável num módulo) foi seguida, e a consistência é boa. O efeito no conjunto é que todo adulto tem o mesmo corte de cabelo masculino, inclusive as pacientes que o texto trata no feminino. Na gestante, isso pesa mais: a barriga, uma esfera presa ao quadril, se lê como bolsa. Nenhum parecer de lote tratou disso.
- **Correção:** um parâmetro de cabelo no módulo da pessoa (comprido ou preso), usado só nas pacientes que o texto chama no feminino. As outras 18 cenas continuam regenerando byte a byte, e o `cenas.test.mjs` prova isso. A decisão é estética e do dono, porque ele aceitou a pessoa do kit.

### 7. Menor: comentários de câmera desatualizados no código das cenas

- `cenas/comum/sala.mjs:1` diz "azimute 58", e o código usa `AZ = 68`.
- `cenas/comum/dxa.mjs:1` diz "azimute 55", e o código usa `AZ = 50`.
- `cenas/dxa-posicionamento.mjs:1` diz "azimute 20, elevação 40", e o código usa 6 e 50 (`dxa-posicionamento.pecas.mjs:14`), como a evidência do 2CD registra depois do I3.

Quem for regenerar ou criar uma cena nova da mesma unidade vai copiar o número errado. Correção: corrigir as três linhas.

### 8. Menor: as cenas de m17 e de m26 a m32 só têm a guarda de regeneração fora do CI

Isso não é novo: o achado 12 do 2A já registrou que o CI não roda `scripts/content/figuras/cenas/` nem `kit/`. Repito só porque agora são 22 cenas, mais o kit da pessoa fundido (H2). A regeneração byte a byte das 22 depende de alguém rodar `node --test scripts/content/figuras/cenas/*.test.mjs` numa máquina com Chrome. A decisão continua do dono.

## 1. Achados Críticos e Importantes dos pareceres de lote, no código atual

| Parecer | Achado | Decisão | No código de `3d1ebfad` |
|---|---|---|---|
| 1F (`revisoes/1F.md`) | 1 Crítico, degradê sem id no `osso-longo` | C1, depois S1/S2 (troca pelo fêmur do Servier) | Resolvido: o `osso-longo` é o fêmur do Servier, e o registro exige gradiente por id local (`diagramRegistry.test.ts:115`), verde |
| 1F | 2 Importante, m18-02 `i3` diverge de D3 | Substituído por S4 | Fichas Epífise proximal, Diáfise, Epífise distal e "Ligamento"; pontos dentro das caixas declaradas |
| 1F | 3 Importante, sínfise escondida na m24-04 `i2` | C5 | Resolvido: três fichas; `prompt` "Rotule três partes"; `help` e retornos sem a sínfise |
| 1F osso (`revisoes/1F-osso-longo.md`) | 1 Importante, `i3` sem nomear o osso | K1 | Resolvido: o `prompt` diz "um fêmur inteiro, deitado, com a cabeça, que encaixa no quadril, à esquerda"; o `feedbackIncorrect` diz "a proximal é a da cabeça, mais perto do tronco" |
| 2A | 1 Importante, selo do "5" colado ao ponto 4 (m17-05) | E12 | Resolvido: a área de toque alheia (mais 4 pt) é obstáculo no `pick`; guarda nos itens reais (`hotspotTouch.test.ts:288-312`). Minha medida em 280, 320 e 358 pt: nenhum selo de rotular fica mais perto de outro ponto que do próprio |
| 2A | 2 Importante, selo sobre a estrutura de outro alvo | E12 ("reduz") | Parcial, como o registro diz: restam a m20-04 e a m25-02 (achado 3) |
| 2B | 1 Importante, maca alinhada pela ponta | G1 | Resolvido no desenho (maca paralela, encostada ao lado), conferido no render |
| 2CD | 1 Importante, banco no caminho do idoso | I1 | Resolvido: banco à esquerda da paciente; degrau e tapete na rota até o andador |
| 2CD | 2 Importante, saiote na ponta e operador no pé | I2 | Resolvido: saiote na lateral e operador ao lado da mesa. As seis menções da m26 dizem "lateral" (a frase do H4 foi revertida). "Pés de quem opera" continua verdadeiro na `fluoroscopia-cadeia` |
| 2CD | 3 Importante, pernas em V no DXA do fêmur | I3 (revoga parte do H5) | Resolvido: pernas quase paralelas, pé girado e preso ao posicionador; o `prompt` da m30-03 `i2` diz "Na cena da direita" |

Conferi também os itens de decisão que um lote podia ter desfeito sem querer:
- E3: nenhuma das 22 cenas tem `periodMs` nem camada com movimento;
- E4: em todas as regiões das 22 cenas, a região da aula é igual à caixa declarada, com diferença ≤ 0,002, e todo ponto de rotular fica dentro da caixa do alvo dele;
- H4: as frases da m31 e da m26 estão no texto novo;
- G3: a ajuda da m21-06 `i2` não fala mais de dedo;
- os menores 8, 12 e 13 do 2A: oxigênio verde, `findChrome` em `kit/base.mjs` e o README do vendor com o repositório público.

Nas figuras de acervo dos lotes 1A a 1E, 32 regiões de aula diferem da caixa declarada em 0,01 a 0,27, nas m18, m20, m24, m25 e m26. É anterior ao intervalo e não volta nesta revisão.

## 2. Efeito do selo e do marcador sobre todas as figuras importadas

**Método.**
- Percorri as 40 unidades e achei 54 itens de tocar, rotular ou caça ao risco sobre as 39 figuras importadas que têm alvo: 22 de rotular, 28 de tocar e 4 de caça ao risco, com 228 alvos.
- Para cada alvo, em 280, 320 e 358 pt, calculei a posição com `badgeBoxes` e `labelBadgeBoxes` lidos do próprio `hotspotTouch.ts`. Medi:
  - se o selo sai do quadro;
  - a distância ao próprio alvo e ao alheio;
  - a parte da área de toque alheia que fica sob o selo;
  - quanto da caixa declarada de cada estrutura (`alvos.json`) o selo cobre agora e quanto o selo ou o marcador antigo cobria (36 x 24 pt no canto da região; círculo de 28 pt no ponto).
- Renderizei os 54 itens com `previewHtml` de `alvos-preview.mjs`, um PNG por item, e olhei todos em folhas de contato.

**Resultado geral.**
- Nenhum selo sai do quadro, em nenhuma largura.
- Nenhum selo fica longe do dono: todos encostam na própria região ou no próprio ponto.
- Nenhum selo de rotular fica mais perto de outro ponto que do próprio.
- Nos rotulares de estrutura pequena, o ganho é grande. Na m18-05 `i2`, por exemplo, a parte escondida caiu de 100% para 46% a 97%; na m24-01 (calcâneo), de 93% para 43%.

**Os que ficaram piores:**

| Item (lote de origem) | Selo | O que piorou | 280 / 320 / 358 pt | Gravidade |
|---|---|---|---|---|
| m18-01 `i3` (1B) | 3, Osso do quadril | Cobre o quadril do lado direito do paciente numa pergunta sobre o esquerdo, e tocar nele dá certo | 85% / 67% / 49% | Achado 1 |
| m18-01 `i3` (1B) | 2, Caixa torácica | Cobre o úmero direito (fora da pergunta) | 61% / 52% / 45% | cosmético |
| m18-02 `i3` (1F) | 3, Epífise distal | Esconde a própria epífise (antes 31%) e 57% da cartilagem do côndilo | 46% / 40% / – | Achado 2 |
| m20-04 `i2` (1C) | 3, Bexiga | Cobre o ureter do ponto 2 (antes 4%) | 22% / 20% / 18% | Achado 3 |
| m25-02 `i2` (1D) | 2, Linha interpupilar | Fica sobre a linha do plano sagital, que é o ponto 3 (antes 0%) | 25% / 17% / – | Achado 3 |
| m20-03 `i2` (1C) | 1, Esôfago | 26% do selo sobre a área de toque de outro ponto | 26% / – / – | menor, medido no E12 |
| m20-03 `i2` (1C) | 4, Pâncreas | Cobre o estômago do ponto 3 (antes 5%) | – / – / 22% | menor |
| m24-01 `i2` (1D) | 3, Cuboide | Cobre os cuneiformes, declarados, que não são ficha | 72–75% / 47–55% / 33–59% | menor: o ponto do cuboide continua à vista |
| m24-05 `i2` (1D) | 2, Pedículo | Cobre o forame vertebral, que não é ficha | 32% / – / – | cosmético |
| m25-01 `i2` (1D) | 5, Maxila | Cobre o zigomático, que não é ficha | 31% / – / – | cosmético |
| m18-04 `i2` (1B) | 3, Cavidade articular | Cobre a cartilagem articular declarada | 34% / 31% / – | cosmético |
| m20-05 `i2` (1C) | 1, Encéfalo | Cobre a medula espinal (também SNC, então o toque nela dá "certo" com razão) | 31% / – / – | benigno |
| m24-04 `i3` (1F) | 3, Sínfise | Cobre o cóccix | 34% / – / – | cosmético |
| m32-02 `i2` (2D) | 2, Colimador | Cobre o tubo do ponto 1 (antes 9%) | – / – / 17% | menor |

Nas 22 cenas, a mudança não piorou nada além do que os pareceres 2A, 2B e 2CD já mediram. Em todas, os objetos foram desenhados já com o selo novo.

## 3. Consistência entre as 22 cenas

- **Pessoa.** Todas usam o módulo único `kit/pessoa.mjs`, depois da fusão do H2. As 22 regeneram byte a byte (`cenas.test.mjs`, 23 de 23).
  - Variações deliberadas: a criança escalada, a idosa de cabelo branco e tronco a 14°, a gestante com a barriga.
  - Ver o achado 6 sobre o cabelo único.
- **Paleta.** São 92 cores no conjunto. Só três aparecem numa cena só: a família de verde do oxigênio, em `itens-de-emergencia-da-sala`. O feixe é sempre âmbar. Equipamento e piso vêm da mesma família ardósia, e os destaques são azuis.
- **Traço.** Em todas as cenas, o traço dominante é 1,4 no `viewBox` 640 x 480, que é o mesmo nas 22. As espessuras maiores são feixes e setas de propósito, como a seta de giro do ânodo e o tracejado do espalhamento.
- **Ponto de vista por unidade.**

  | Unidade | Cenas | Câmera |
  |---|---|---|
  | m17 | 4 | `sala.mjs` (azimute 68) |
  | m19 | tubo e emitindo | azimute 105 |
  | m19 | ânodo | azimute 148, close do disco (aceito pelo revisor do 2A) |
  | m25 | 2 | azimute 58 |
  | m26 | 2 | câmera própria das duas (H5) |
  | m30 | `dxa-dois-feixes` | 50/40 |
  | m30 | `dxa-posicionamento` | 6/50, vista dos pés, registrada no H5 e na evidência do 2CD |
  | m31 e m32 | 3 | azimute 68 |

  Nenhum desvio fora dos registrados. Os comentários de três arquivos estão errados (achado 7).
- **Regra de região.** Nas 22 cenas, toda região de aula é igual à caixa declarada, e todo ponto fica sobre o objeto que nomeia. As exceções de caixa que a 2CD mediu estão registradas no README das cenas: lâminas com o suporte, acompanhante sem os braços, pedal sem o cabo.

## 4. Técnica radiológica: só o que os revisores de lote não pegaram

Os pareceres de lote leram cada cena contra a aula com cuidado: tubo e ânodo, sala, maca, leito, trauma, dosímetros, produto dose-área, fluoroscopia, pediatria, gestante, DXA, veterinária, objeto e teste de feixe. Não repito o que eles conferiram. O que acrescento:
- a placa de saída amarela (achado 4);
- os dois feixes separados do DXA, contra "o feixe ... tem dois níveis de energia" (achado 5).

Conferi e não achei problema novo em quatro pontos:
- o campo cheio da gestante fica do ombro ao meio das costas, sem entrar no rosto;
- o dosímetro de tronco fica no tronco, por fora do avental, como o rótulo "Peito (tronco, sobre o avental)" diz;
- o biombo esconde a pessoa afastada na ordem de profundidade certa;
- na `fluoroscopia-cadeia`, o operador está ao lado da mesa, coerente com a correção I2 da outra cena da m26.

## 5. Gates num checkout limpo

Worktree destacada em `$TMPDIR/rev-final` em `3d1ebfad`, com links de `radiant-app/node_modules` e `radiant-api/node_modules`. A raiz não tem `node_modules` no checkout principal, então não houve link para ela. `git status --porcelain` mostrou só os dois links. Depois, removi tudo com `unlink` sem barra final e `git worktree remove --force`, e `git worktree list` não mostra mais a worktree. Node v20.20.2, conferido com `node --version`.

| Gate | Resultado |
|---|---|
| `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality` | saída 0. `lint`: 0 erros, 23 avisos. `typecheck`: ok. Os 18 passos `test:*` de contrato: ok. Jest `--runInBand`: **297 suítes, 4584 testes, todos passam**. `visual:qa:strict`: 795 arquivos, 0 regressões, 3 exceções com escopo |
| `rtg-lesson-lint.mjs` nas 40 unidades | 40 de 40 OK, saída 0 |
| `build-rtg-batches.mjs --check` | saída 0, `"ok": true` |
| `scripts/qa/figuras-no-simulador.mjs --check` | saída 0, `ok: true`, 54 roteiros |
| `node --test scripts/content/figuras/cenas/*.test.mjs` | 23 testes, 23 passam, 0 pulados |
| `node --test scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/*.test.mjs` | 40 testes, 39 passam, 1 pulado ("sem Chrome", pulado porque o Chrome existe) |
| `node --test` em `scripts/content/*.test.mjs`, com as exclusões do CI (`foundation-structure`, `validate-foundation` e `register-source`, que lê PDF) | 22 suítes, 402 testes, todos passam |
| `node --test scripts/qa/*.test.mjs` | 46 testes, todos passam |

Os números do Jest batem com os do registro do controlador para o 2CD corrigido (297 e 4584).

## 6. Peso

O cálculo é o mesmo do teste `a soma do SVG de todas as figuras importadas` (`diagramRegistry.test.ts:124`), somando o `svg.length` das camadas.
- **Importadas:** 45 figuras somam **4.133.244 bytes**, contra o teto de 8.116.109. É 50,9% do teto, com folga de 3.982.865.
- **Por origem:** as 22 cenas somam 1.232.863; as 23 de acervo, 2.900.381.
- **A maior importada:** `respiracao-diafragma`, com 410.322, sob o teto próprio de 491.520 (lote 1E, fora do intervalo). Depois dela vêm `esqueleto-axial-apendicular` (243.474), `contraste-no-corpo` (233.716), `marcos-de-superficie` (230.937) e `trato-digestivo` (210.913).
- **A maior cena:** `raio-x-movel-no-leito`, com 124.671, metade do teto de 245.760 por figura.

## O que o dono deve olhar primeiro no simulador

1. **M18.01, aula 1, `i3` (esqueleto).** Veja o "3" em cima do quadril à esquerda da figura e toque nele. Se a conferência der "certo", o achado 1 está confirmado no aparelho.
2. **M26.04 (fluoroscopia, espalhamento).** O saiote na lateral e o operador ao lado da mesa, depois da correção I2, com os quatro selos.
3. **M30.03, `i2` (DXA do fêmur).** Pernas quase paralelas e pé girado. Confira se as áreas de toque dos dois pés ficam distinguíveis num celular estreito.
4. **M17.05 `i2` e M25.02 `i2`.** Os selos de rotular perto de outros pontos: o "5" do telefone e o "2" sobre a linha sagital (achado 3).
5. **M27.05 (conceito da gestante) e M30.01 (DXA).** A pessoa única nas pacientes (achado 6) e os dois feixes (achado 5).
6. **M18.02 `i3` (fêmur do Servier).** O "3" sobre a epífise distal (achado 2).

## Não consegui verificar

- **Comportamento no aparelho.** Não rodei simulador, por regra do dono. O toque no selo que seleciona o dono (E13) foi lido no código (`HotspotStepRenderer.tsx:82`) e nos testes, não tocado no aparelho. Os 54 itens foram vistos em render de prévia (`previewHtml`), que espelha as posições do app mas não a borda e a sombra exatas.
- **Medidas por caixa, não por cor.** "Quanto o selo cobre" é medido sobre a caixa declarada em `alvos.json`, não por cor no render. Isso superestima em estrutura não retangular, como o ureter, a linha sagital e o quadril.
- **Figuras de código.** Não medi as figuras desenhadas em código (não importadas). Elas também recebem o selo novo e não entram na pergunta 2, que pede as importadas. A guarda do achado 1 cobriria as duas.
- **Normas.** As NBR 13434 (sinalização de saída) e 12188 (gases medicinais) são citadas de memória, sem consulta à norma.
- **Testes não rodados.**
  - Os testes Python do conteúdo não rodaram, porque o `python3` está bloqueado nesta sessão.
  - As três suítes Node que o CI exclui não rodaram: uma delas lê PDF, o que é proibido pelo dono.
- **Regeneração fora desta máquina.** Não medi se as 22 cenas regeneram iguais num Chrome de Linux.
- **Revisão profissional.** Esta revisão é de IA: a técnica radiológica foi conferida contra o texto das aulas, não por um tecnólogo ou médico radiologista.
- **Documentação posterior.** O commit `63de0f9b`, com o STATUS, a ADR e os briefs das fases 3 a 6, ficou fora do intervalo e não foi revisado.
- **Observação da sessão.** Não registrei observação no log do task-observer, porque o pedido limitava a escrita a este arquivo.
