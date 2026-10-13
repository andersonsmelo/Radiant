# Radiant — implementação da experiência de estudo

Objetivo aprovado em 2026-10-12; execução retomada e medida em **2026-10-13**.
Referência: [spec aprovada](../superpowers/specs/2026-10-12-study-experience-design.md).
Base do pacote: `3fc25af`, branch `codex/radiant-study-improvements`.
Código local; nenhuma publicação, OTA, push, merge ou build de distribuição.

## Resultado implementado

- Estude: contexto/progresso e uma recomendação no header rolável da FlatList.
  Próximo nó e rotas continuam nos serviços existentes. Retomada distingue
  lição/revisão/avaliação; conquista coletada e revisão futura ficam inelegíveis;
  revisão futura não bloqueia outra lição. Sem próximo nó, informação factual
  sem botão inerte. Pixel pequeno/decorativo e fundo focado.
- Atividade: superfície opaca e seleção visível. Somente múltipla escolha usa
  “Conferir resposta”; hint acompanha o label. Registry mantém default
  “Continuar”. Player continua dono de confirmação, cobrança e feedback.
- Conclusão: Pixel/estrelas compactos e roláveis, resultados em linhas, avaliação
  “É opcional”. XP positivo/zero/null, estrelas sem melhora, total zero,
  ausência de revisão e nota prévia preservados. Nenhum ganho inventado.

## Evidência estática e revisão

| Recorte | Commit | Resultado no Node 20.20.2 |
| --- | --- | --- |
| Fundo focado | `9028247` | 11/11 testes; vermelho 4 falhas comportamentais de render/frame |
| Estude | `fe456d7`, `bec35a4`, `418c419` | 38/38 Home/Trail; vermelho 3 regressões de header/retomada/estado vazio |
| Atividade | `bd866f3` | 12 suítes / 138 testes; vermelho 28 falhas de label/hints/fluxo |
| Conclusão | `b578481`, `db3f0ae` | 7 suítes / 73 testes; vermelho 4 regressões de scroll/avaliação opcional/callbacks |
| Seletores/contratos nativos | `4a6b13f`, `8f5b4f2` | 29/29; centering/confirmação e alcance dos estados de conquista vistos falhar com defeitos específicos |

Testes focados usaram `EXPO_NO_DOTENV=1`, `--runInBand`, no Node 20; ESLint e
`git diff --check` dos arquivos alterados passaram. Revisores independentes
aprovaram cada tarefa e as correções de título. Logs completos do trabalho
estão temporariamente no workspace SDD local; esta evidência versionada conserva
comandos, sintomas, resultados e limites. Validação integral ainda pendente.

Comandos focados: `npx jest --runInBand --runTestsByPath` para background,
Home/Trail; `npx jest --runInBand src/features/lesson-flow` e
`src/features/quiz`; `node --test scripts/maestro-contract.test.mjs`, no
`radiant-app`, com o PATH do Node 20 e `EXPO_NO_DOTENV=1`.

## Matriz nativa medida em 2026-10-13

Binário Debug existente + Metro atual, iOS 26.5. Nenhum módulo nativo novo.
SE3 dedicado (375×667pt) para estado sintético/clearState. iPhone 17 do dono tem
seus dados preservados. Metro sem dotenv, ambiente development, beta gate off,
paywall on e checkpoints off (default; não é prova dos checkpoints ativos).

Verificado no SE: inicialização padrão, Estude nova, seleção 0→1 sem confirmação
retendo 5/5 vidas, conclusão real com 18 XP / 1 de 8 e revisão real de 1 dia. Texto AX2
(`accessibility-large`) inspecionado nativamente. Títulos ultrapassavam a largura
antes das correções; estágio voltou ao cap compartilhado 2, card/frase usam
limite local 1.75. Corpo continua sem teto. A avaliação opcional e os cinco
controles ficaram acessíveis por swipe dentro do scroll, acima do rodapé.

O percurso AX2 final passou após bootstrap padrão e montagem nova, incluindo
títulos corrigidos, seleção, conclusão, avaliação opcional e retorno.
Critical-path passou 1/1 em 2m03s; offline1/1 em 1m38s; conquista bloqueada1/1
em 1m21s após corrigir a suposição de viewport do flow.

Falhas de automação registradas: diálogo iOS preso foi resolvido reiniciando só
SE; `scrollUntilVisible.element.text` não encontrou caption cujo atributo iOS
é `accessibilityText` (swipe direcionado confirmou alcance); bootstrap em AX2
não avançou a apresentação inicial depois do toque. Não atribuído ao redesign:
a apresentação não mudou. Validar as três telas após bootstrap padrão.

| Percurso | Resultado |
| --- | --- |
| `learning-critical-path` exato | PASS 1/1, 2m03s, duas lições e Perfil |
| `offline-relaunch` exato | PASS 1/1, 1m38s, progresso após kill/relaunch |
| `reward-locked` exato | PASS 1/1, 1m21s, depois da guarda de alcance; 0/8 sem coleta |
| `reward-unlock` exato | PASS 1/1, 6m24s; 7 lições→coleta→8/8 |
| SE AX2 final | PASS, header/alternativas/conclusão/avaliação/retorno; corpo ampliável |
| Zero vidas, legado | 5 erros reais, 5→0, folha e retorno com 1/8; último trecho PASS 1/1,2m23s |
| Repetição correta, iPhone 17 | PASS; resumo sem XP e retorno conservou 110 XP e 8/8; nenhum clearState |

A sequência de zero vidas foi contínua em duas execuções: a primeira parou na
expectativa incorreta de XP zero. A UI e a árvore exibiam **XP null, Sem XP nesta
tentativa** na repetição com erro. Corrigido só o teste auxiliar; os três erros
restantes zeraram as vidas. A conclusão 1/8 permaneceu, sem nova etapa.
Para captura pequena da atividade, a ficha sintética foi reiniciada depois desse
teste: com 0 vidas, o guard existente abre a folha antes da continuação legada.
Os dados do simulador principal foram preservados.

Capturas finais reais: iPhone 17 402×874pt ([Estude](study-experience/home.png),
[atividade](study-experience/activity.png), [conclusão](study-experience/summary.png));
SE 375×667pt ([Estude/zero vidas](study-experience/small-home.png),
[atividade](study-experience/small-activity.png), [conclusão/XP null](study-experience/small-summary.png));
SE AX2 ([Estude](study-experience/large-home.png),
[atividade](study-experience/large-activity.png), [conclusão](study-experience/large-summary.png)).
As cenas são posições do scroll; o percurso verificou também a ação do header e
os controles no fim da conclusão. Galeria da prancheta não foi usada como prova.
Reduce Motion: testes de frame passaram 11/11; tentativa de abrir ajuste nativo
não navegou pelo controle de acessibilidade. Nenhuma preferência mudou;
verificação nativa de toggle/frame é NOT_TESTED. VoiceOver audível/TalkBack, aparelho físico,
StoreKit real e comparação de desempenho não foram executados neste pacote.
Não há alegação de ganho de bateria, FPS, retenção ou conversão.

## Decisões operacionais e limites

- Ruling: reuse this clean feature branch/workspace under the single Loop writer — it holds the approved app and simulator setup; main is not edited.
- Ruling: run implementers sequentially; controller owns final validation and docs. Focused tests plus owned local task commits enable review packages; one configured full validation after all tasks, per project instructions.
- Ruling: no mandatory extra style tests; behavior changes use meaningful red/green; existing domain edge cases are preserved without duplicate tests.
- Ruling: brain-links is read-only and previously passed with active read sessions; retain the project-mandated brain session and close independently.
- Ruling: maestro-contract pins old footer/source-text structure; add that guard to root scope and adapt it to real header actions and AST. Empty/incomplete initial run closed; replacement run retains owned Task 1 changes and includes guard. Final review compares whole branch to 3fc25af.
- Ruling: target a native View around the recommendation button with journey-recommendation-action; scrollUntilVisible centers its bounds and then taps the semantic label — old unconditional lift-scroll would move the header action away; if wrong, native QA exposes unreachable CTA and needs selector rework.
- Ruling: keep the existing exact 'Avalie a aula' label and add a separate 'É opcional' caption — unowned Quiz integration pins the label; preserve that guard without widening scope or hiding optionality; cost if wrong is a small copy adjustment.

O piloto editorial da L1, V3, Rive/voz, analytics, monetização e distribuição
continuam nos gates próprios. Estado vivo: [STATUS](../STATUS.md); esta página
é evidência de implementação, não outro status. Validação integral, revisão final e encerramento do run/sessão ainda pendentes.

## Execuções vermelhas preservadas

### task-1-red.log

SHA256 original `996bd0bed92c692b1e5b9dbf2cfcb0b7137dc803a3195c577b28e2c43cc2d22a`.

```text

Test Suites: 1 failed, 1 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Time:        7.214 s

Test Suites: 1 failed, 1 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Time:        7.214 s
```

### task-2-red.log

SHA256 original `1d73da457d662e4b1280eb174960fd156acff534e0342a1feb85179b0a421ef2`.

```text

    Expected: true
    Received: false

    Expected: true
    Received: false

      593 |       await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

Test Suites: 1 failed, 1 total
Tests:       3 failed, 13 passed, 16 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       3 failed, 13 passed, 16 total
Snapshots:   0 total
Time:        3.855 s

Test Suites: 1 failed, 1 total
Tests:       3 failed, 13 passed, 16 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       3 failed, 13 passed, 16 total
Snapshots:   0 total
Time:        3.855 s
```

### task-3-red.log

SHA256 original `18b864f7313c538f9fc7589046058eb6eecca716d367b7b2c5fe0d9e9b8788aa`.

```text

Test Suites: 2 failed, 2 total
Tests:       28 failed, 13 passed, 41 total
Snapshots:   0 total
Test Suites: 2 failed, 2 total
Tests:       28 failed, 13 passed, 41 total
Snapshots:   0 total
Time:        11.597 s, estimated 13 s

Test Suites: 2 failed, 2 total
Tests:       28 failed, 13 passed, 41 total
Snapshots:   0 total
Test Suites: 2 failed, 2 total
Tests:       28 failed, 13 passed, 41 total
Snapshots:   0 total
Time:        11.597 s, estimated 13 s
```

### task-4-red.log

SHA256 original `8f9f09d83ce2c69215d5fc5e11d11c28010ee19615f178e5d91bf459bfcde347`.

```text

    Received: null

      128 |     let ancestor = pixel.parent;

Test Suites: 1 failed, 1 total
Tests:       4 failed, 20 passed, 24 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       4 failed, 20 passed, 24 total
Snapshots:   0 total
Time:        2.22 s

Test Suites: 1 failed, 1 total
Tests:       4 failed, 20 passed, 24 total
Snapshots:   0 total
Test Suites: 1 failed, 1 total
Tests:       4 failed, 20 passed, 24 total
Snapshots:   0 total
Time:        2.22 s
```

### task-5-mutation-centering-red.log

SHA256 original `fd1aade341defa3585f62400ca6b1ce36c357145c25da346ff24332ee8b90241`.

```text
# Subtest: centers the recommendation header action before each native tap
not ok 5 - centers the recommendation header action before each native tap
  ---
  duration_ms: 11.552542
  failureType: 'testCodeFailure'
  error: |-
    learning-critical-path.yaml: center the native button bounds immediately before its semantic tap
    + actual - expected ... Lines skipped
# pass 0
# fail 1
# cancelled 0
# skipped 26
  failureType: 'testCodeFailure'
  error: |-
    learning-critical-path.yaml: center the native button bounds immediately before its semantic tap
    + actual - expected ... Lines skipped
# pass 0
# fail 1
# cancelled 0
# skipped 26
```

### task-5-mutation-confirmation-red.log

SHA256 original `0d7faf0444d8493ab8ed41d7da1ecdeea7d54391ae027a5a003e15b89169c9fb`.

```text
# Subtest: native learning flows confirm selected multiple-choice answers with the explicit action
not ok 7 - native learning flows confirm selected multiple-choice answers with the explicit action
  ---
  duration_ms: 8.764959
  failureType: 'testCodeFailure'
  error: |-
    learning-critical-path.yaml: confirm the selected answer explicitly
    + actual - expected
# pass 0
# fail 1
# cancelled 0
# skipped 26
  failureType: 'testCodeFailure'
  error: |-
    learning-critical-path.yaml: confirm the selected answer explicitly
    + actual - expected
# pass 0
# fail 1
# cancelled 0
# skipped 26
```

### task-5-reward-guard-red.log

SHA256 original `169df8d4923577894b9782268883519f8a04cc093a66ce32183ef121132b77ae`.

```text
# Subtest: reward-locked.yaml reaches the reward status through a bounded accessibility-label scroll
not ok 1 - reward-locked.yaml reaches the reward status through a bounded accessibility-label scroll
  ---
  duration_ms: 11.353833
  failureType: 'testCodeFailure'
  error: |-
    reward-locked.yaml: reach the status label before asserting it on a short viewport
    + actual - expected
# Subtest: reward-unlock.yaml reaches the reward status through a bounded accessibility-label scroll
not ok 2 - reward-unlock.yaml reaches the reward status through a bounded accessibility-label scroll
  ---
  duration_ms: 6.658875
  failureType: 'testCodeFailure'
  error: |-
    reward-unlock.yaml: reach the status label before asserting it on a short viewport
    + actual - expected
# pass 27
# fail 2
# cancelled 0
# skipped 0
  failureType: 'testCodeFailure'
  error: |-
    reward-unlock.yaml: reach the status label before asserting it on a short viewport
    + actual - expected
# pass 27
# fail 2
# cancelled 0
# skipped 0
```

