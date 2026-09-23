# HUD sem corações ao lado do ∞ — relatório

**Data:** 2026-09-23 · **Branch:** `fix/hud-infinito`, aberto de `0b0283e`
(topo commitado de `feat/quiztopbar-infinito`) · **Sem build, sem push, sem
merge** · Vermelhos: [`2026-09-23-radiant-hud-infinito-vermelhos.md`](2026-09-23-radiant-hud-infinito-vermelhos.md)

## O defeito

Medido em 2026-09-23. No estado `HeartsSnapshot.status === 'unlimited'`, o
`HUD` mostrava o resumo "∞" **e** os cinco corações do `HeartsDisplay`. A spec
da 1.4 (§5.1, linha ILIMITADA) diz "corações somem", e a §3.6 diz que o
"cabeçalho troca corações por ∞". Consumidores com `heartsSnapshot`:
`JourneyHomeScreen` (com botão que abre a folha), `CheckpointScreen` e
`ReviewScreen` (três usos, um deles `compact`, todos sem botão).

**Defeito a mais, achado no caminho:** Checkpoint e Revisão não passam
`onHeartsPress`, e o rótulo "Vidas ilimitadas" só existia no botão. Sem botão, o
leitor de tela anunciava "5 de 5 vidas" (ou "0 de 5 vidas", para o assinante
que zerou) e depois "∞".

## O que mudou

- `radiant-app/src/ui/components/HUD.tsx`: no estado `unlimited`, o `HUD`
  renderiza só o ∞ (novo `UnlimitedHeartsDisplay`, exportado ao lado do
  `HeartsDisplay`) e não o `HeartsDisplay`. O ∞ carrega o rótulo "Vidas
  ilimitadas". Dentro do botão ele fica oculto da acessibilidade, e quem anuncia
  é o próprio botão, com o mesmo rótulo e o mesmo `onPress` de antes. A decisão
  sai do **status**, nunca do número: `{ count: 0, status: 'unlimited' }` também
  mostra só o ∞. O resumo "N · +1 em N min" dos outros estados não mudou.
- O ∞ ganhou o mesmo peso visual do ∞ do `QuizTopBar` (24 px, peso 800,
  `galaxyColors.heartFull`). O resumo antigo tinha 12 px e cor secundária,
  pensado para ficar **ao lado** dos corações; sozinho, no lugar de cinco
  corações de 28 px, ele sumiria.
- `radiant-app/src/ui/components/HUD.test.tsx`: novo bloco "estados das
  vidas", com full, recovering e empty (corações, resumo, sem ∞, botão com a
  contagem) e unlimited com `count` 5 e 0 (sem corações desenhados, ∞ visível,
  rótulo sem botão, nada de "N de 5 vidas", botão "Vidas ilimitadas" mantido e
  compact). Saiu o teste antigo "mostra infinito para assinante", que só
  conferia a presença do ∞ e passava com os corações ao lado.

## Reuso com a fatia 3 (QuizTopBar)

Conferido em 2026-09-23 no checkout principal: a sessão da fatia 3 **não**
extraiu componente de ∞. O `QuizTopBar` tem um `<Text>` inline e está **sem
commit** no checkout principal, com `QuizTopBar.tsx`, `LessonFlowScreen.tsx`,
os testes deles, `FILA.md` e `STATUS.md` modificados. Não toquei nesses
arquivos. O `UnlimitedHeartsDisplay` fica exportado de `HUD.tsx`, o mesmo
módulo de onde o `QuizTopBar` já importa o `HeartsDisplay`. Depois que a fatia 3
for commitada, o `QuizTopBar` pode trocar o `<Text>` inline por ele. A troca
exige uma decisão: hoje o ∞ do `QuizTopBar` é `accessibilityRole="text"` sem
`accessible` explícito, e o componente novo aceita `hiddenFromAccessibility`.

## Evidência

- Vermelho contra `0b0283e`: 8 falhas pelo motivo previsto e **um guarda
  cego**. "Sem corações dentro do botão" passava com os corações na tela,
  porque o RNTL 13 omite nós ocultos da acessibilidade. Depois da correção
  (`includeHiddenElements: true`) foram 10 falhas, cada uma na asserção
  prevista.
- Sete mutações (M1–M7) cobrem todas as asserções que antes só tinham sido
  vistas verdes. O arquivo foi restaurado com o `shasum` idêntico. O mapa
  asserção → vermelho está no documento de vermelhos.
- Gate, **medido em 2026-09-23**, Node `v20.20.2`, worktree limpa:
  `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **133 suítes / 1189 testes**,
  Visual QA sem regressão (0 regressões, 61 na linha de base, 3 exceções). A
  contagem fecha com a base: 1174 − 1 + 16. O Jest avisou "did not exit one
  second after the test run", o que não é deste trabalho nem reprovou o gate.

## Loop — dois runs, e por quê

O trabalho rodou nesta worktree, com `.loop/` próprio e `node_modules`
clonados (`cp -c`) do checkout principal. Os lockfiles são idênticos aos de
`0b0283e`.

- `run-1790175878903-52ad31bf`: o `loop validate` passou em 13 de 14
  validadores, `app-quality` e `app-test` entre eles, e reprovou em
  **`content-foundation`**. O motivo é de ambiente: o
  `validate-foundation.mjs` lê `pages.json` e `excerpts.json` de
  `Conteúdo/extrações/<slug>/`, que não são rastreados (`.git/info/exclude`
  ignora `Conteúdo/`). **Nenhuma worktree limpa passa nesse validador**, com
  qualquer mudança. Copiar os dados com o run aberto seria mudança fora do
  escopo em relação à abertura. O run foi fechado de `editing` para `closed`.
- Antes do segundo run, os dois arquivos do trabalho
  `fundamentos-de-radiologia-everton-costa-pinto` foram clonados do checkout
  principal. Só esses dois bastaram para o validador sair 0. O git não os vê.
- `run-1790176495183-dd97e20b`: aberto com os mesmos seis arquivos, para
  fechar pelo ritual `validate → step finish → memory write → run close`. Este
  relatório é escrito antes do fechamento. O estado real do run está em
  `.loop/runs/run-1790176495183-dd97e20b/state.json`, na worktree, e não aqui.

## Integração — para quem juntar os branches

- Pilha: PR #17 (`fix/ask-to-buy-pendente`, `4788aa1`) → `0b0283e` (só local,
  em `feat/quiztopbar-infinito`) → `fix/hud-infinito`.
- `HUD.tsx` e `HUD.test.tsx` não são tocados pela fatia 3. Nos docs vivos,
  simulei com `git merge-file` a fusão das minhas edições com as da fatia 3,
  ainda não commitadas: **0 conflitos** em `FILA.md` e `STATUS.md`.
- Ao integrar: marque como ✅ o sub-item "O `HUD` mostra ∞ ao lado dos corações"
  do item 3 do FILA. Esse texto existe só na cópia não commitada da fatia 3, e
  por isso a entrada deste trabalho está numa linha própria, depois do item 4.

## Pendente

1. **Olhar o ∞ num aparelho** com assinante real, na Trilha, no Checkpoint e na
   Revisão. Espera o sandbox. Tamanho e cor foram escolhidos para bater com o
   `QuizTopBar`, e nenhum dos dois foi visto num aparelho.
2. **Decisão do dono, achado fora do escopo:** na Trilha, o assinante vê um
   botão "Vidas ilimitadas" que não faz nada visível. A `JourneyHomeScreen`
   suprime a folha com `visible={heartsSheetVisible && hearts.status !==
   'unlimited'}`, como pede a spec ("folha nunca aparece"), mas o toque ainda
   põe `heartsSheetVisible` em `true`. Consequências: (a) o leitor de tela
   anuncia um botão sem ação; (b) se a assinatura expirar com esse estado
   ligado, a folha abre sozinha. A tarefa pedia para manter o botão, e ele foi
   mantido. Tirar o `onHeartsPress` no estado ilimitado, ou ignorar o toque, é
   escolha de produto.
3. Build, push e merge: nenhum feito. Esperam autorização do dono.
