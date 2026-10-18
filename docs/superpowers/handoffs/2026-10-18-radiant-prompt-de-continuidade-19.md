# Prompt de continuidade (19) — 2026-10-18: o Claude planeja e executa

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81, local-first). Você trabalha com o dono, Anderson. **Desde
2026-10-18 você é planejador e executor**
([ADR](../../adr/ADR-2026-10-18-claude-planejador-e-executor.md)):
- você escolhe o próximo item;
- combina a condição de pronto com o dono;
- implementa, verifica e registra.

Codex e Argon estão em pausa: não escreva prompts para eles.

**Continuam com o dono:** produto e currículo, aprovação de conteúdo e de
imagens, loja, build de distribuição e merge.

**Uma frente por conversa.** Pegue a primeira pendência da §4 que for do agente
e estiver destravada. Diga ao dono, numa mensagem curta, qual é o item e qual é
a condição de pronto, e só abra o run depois do ok dele. Não misture outra
frente na mesma conversa, salvo pedido dele.

Este prompt substitui o
[prompt (18)](2026-10-10-radiant-prompt-de-continuidade-18.md), o
[prompt para outras IAs](../../trilha/PROMPT-PARA-IAS.md) e o
[prompt do Codex](../../trilha/PROMPT-CODEX-2026-10-18.md). **Não execute itens
de prompts anteriores.**

## 0. O que foi concluído de 2026-10-11 a 2026-10-18

- **2026-10-12:** a `1.4.0 (12)` foi aprovada e liberada na App Store, para o
  Brasil. O binário é a `main` em `221e2ec`, e a loja continua nele.
- **2026-10-12 a 16:** melhorias locais (itens 36, 39 e 27), evolução visual,
  remediação de QA, a Estude abrindo no nó PRÓXIMO e a Configuração saindo do
  Perfil. Tudo entrou na `main` pela PR #39.
- **2026-10-16 a 18:** a trilha. **Leia o
  [levantamento](../../trilha/2026-10-18-levantamento-do-que-foi-feito.md)**:
  ele traz as PRs #39 a #46, as decisões, o estado de cada achado (A1–A8,
  B1–B5, C1–C2) e o que ficou aberto. Em resumo:
  - **G0–G4** (#39): catálogo, unidades, contrato editorial e revisão por item
    com resposta antes do gabarito;
  - **lição honesta** (#40);
  - **motor híbrido** (#42 e #43): todas as perguntas, feedback por item,
    retorno do erro, vidas só no retorno, régua de estrelas para N perguntas e
    a última vida concluindo a lição;
  - **A1** (#45): a versão nova de conteúdo preserva a data de revisão.

**Decidido pelo dono em 2026-10-18:**
- a régua de estrelas: algum acerto vale 1, 2/3 valem 2, tudo vale 3, contando a
  primeira resposta;
- perder a última vida no último retorno **conclui** a lição;
- com 0 vidas, o primeiro contato continua grátis;
- no A1, a versão nova **preserva a data**;
- `gh pr merge` está liberado nas permissões, **mas o merge continua sendo
  decisão dele**: faça só quando ele pedir na conversa;
- o Claude planeja e executa.

## 1. Meça antes de agir

```bash
git fetch origin --prune && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
gh run list --branch main --limit 2
git worktree list
sysctl -n vm.loadavg
curl -s 'https://itunes.apple.com/lookup?id=6797078156&country=br' | python3 -c "import json,sys;print([(r['version'],r['currentVersionReleaseDate']) for r in json.load(sys.stdin)['results']])"
```

**Esperado depois de 2026-10-18:**
- a `origin/main` na PR desta documentação, ou em `cc67243` se ela ainda não
  entrou, com o CI verde;
- a App Store em `1.4.0`;
- **o checkout principal na branch velha `feat/trilha-evolucao-global-g0-g4`**,
  em `69e6532`. Não trabalhe nele: crie uma worktree ou uma branch a partir da
  `origin/main`;
- worktrees em `.claude/worktrees/`. Elas estão na §7 do levantamento.
  **`trusting-mestorf-a5ca83` tem 22 arquivos sujos da FILA 57: não mexa sem o
  dono;**
- Metro desligado, nenhum simulador ligado e carga baixa.

**Parta da `main`:**

```bash
git switch --no-track -c <nova> origin/main
```

Se o CI da `main` estiver vermelho, conserte isso antes de qualquer frente.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro. A lição de 2026-10-18 fica logo antes de "O que nunca fazer".
2. `docs/STATUS.md`, com a seção "Trilha — estado em 2026-10-18". Remeça antes
   de citar qualquer número.
3. O [levantamento](../../trilha/2026-10-18-levantamento-do-que-foi-feito.md),
   §5 e §6.
4. `docs/FILA.md`: "Direção da trilha" e "Ordem de prioridade".
5. A ADR, o relatório ou a evidência da frente que você pegar.

## 3. Como planejar e executar sem revisor externo

Sem segunda IA, quem garante a qualidade é o processo. Para cada frente:

1. **Plano curto ao dono:** o item, a condição de pronto e o que fica de fora.
   Decisão de produto vira pergunta com opções e a sua recomendação.
2. **Confira as premissas do próprio plano antes de mandar.** Contagens, "não
   precisa de conteúdo novo", "não depende de X": cada uma com `grep` ou
   medida. Em 2026-10-18, "3 a 5 perguntas com o que existe" era falso (as
   lições de IA têm 2), e duas decisões tiveram de ser refeitas.
3. **Enumere quem é afetado:** `grep -rl`, sem `head`, no app, na API e nos
   scripts. Onde houver tipo, estreite o tipo e leia os erros do `tsc`.
4. **Teste visto falhando** pelo motivo previsto, com o log vermelho guardado na
   evidência. Asserção de diferença vem com uma de validade.
5. **Gate completo** e `loop validate`. Prova nativa quando houver tela, com
   capturas versionadas e hash.
6. **Audite o próprio relatório:** cada arquivo, linha, número e link precisa
   existir.
7. **PR contra a `main`.** O merge só acontece com o pedido do dono.

## 4. Pendências, por prioridade (2026-10-18)

**Do agente, destravadas:**

1. **Preparar a `main` para uma build.** Ela tem 5 PRs de trilha que a loja não
   tem.
   - Rode nativamente os 7 roteiros Maestro que só passaram pelo contrato
     estático: `learning-critical-path`, `radiant-1-4-primeira-execucao`,
     `offline-relaunch`, `radiant-1-4-segundo-dia`, `reward-unlock`,
     `store-capture` e `student-checkpoint-no-duplicate-effect`.
   - Faça as capturas versionadas do G4.
   - **Pronto:** os 7 roteiros passam ou viram defeito registrado, e a evidência
     tem data e hash. A build e o envio são do dono.
2. **R6, capacidade do store de revisão (A2 e A3).**
   - Meça leitura e escrita com 1k e 5k cartões.
   - Coloque em quarentena o registro inválido, para ele não bloquear a revisão
     inteira.
   - Trocar o storage (particionar ou SQLite) é decisão do dono.
   - **Pronto:** números medidos e um teste de registro corrompido que não
     bloqueia, visto falhando antes.
3. **A4:** o agregado legado avança uma vez por item. A descrição está na
   [revisão do Codex](../../trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md).
4. **R8:** um README da trilha curto, que se lê em 5 minutos, com o histórico
   num anexo.
5. **C1:** tirar `questionIndex` e `reinforceBody` do contrato de conteúdo **na
   API e no app juntos**.

**Do dono, o que destrava:**
- **FILA 45:** currículo e governança. Libera os 10 a 15 itens por lição e a
  correção do viés de comprimento;
- **FILA 52:** as 15 imagens;
- **FILA 57:** o E1;
- **FILA 48:** a captura de loja;
- **FILA 43:** o analytics;
- **FILA 6:** os opt-ins Android;
- **build e envio** de uma versão com a trilha nova.

## 5. Regras que valem sempre

- **O Loop é o contrato:**
  - `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`, com todos
    os arquivos que vai tocar, inclusive evidências;
  - feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope;
  - `validate` não roda de novo a partir de `validating`. Termine as edições
    antes de validar.
- **O STATUS e a FILA:**
  - todo run que edita o STATUS declara `docs/archive/STATUS_historico.md` e move
    para lá, sem edição, o que deixou de valer;
  - todo run que tira item da FILA declara `docs/archive/FILA_concluidos.md`.
- **Node:** `loop` no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds, Metro e `eas` no 20. Confira com `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`. Última
  medição: **173 suítes e 1.763 testes**, em 2026-10-18.
  - **Leia o `exit=` do log, não o código do comando em segundo plano:** um
    `echo` no fim mascara a falha.
  - Teste vermelho que não reproduz: compare na branch e na `main` com
    `/usr/sbin/taskpolicy -b npx jest --runInBand --no-cache <arquivo>` e repita
    o gate inteiro.
- **Worktree nova** precisa de `radiant-app/node_modules` e
  `radiant-api/node_modules`, copiados com `cp -cR` a partir do checkout
  principal, e dos `excerpts.json` e `pages.json` de `Conteúdo/extrações/*`,
  antes de abrir o run.
- **Metro na worktree do run:**
  - suba com `EXPO_NO_TYPESCRIPT_SETUP=1`. Sem isso, nasce
    `radiant-app/expo-env.d.ts`, e o `step finish` devolve `OUT_OF_SCOPE_CHANGE`
    sem volta;
  - o `preview_start` lê o `.claude/launch.json` do **checkout principal**, fora
    do run. Crie, suba o Metro e apague.
- **E2E no simulador:**
  - Maestro precisa de Java:
    `export JAVA_HOME=$HOME/.jdks/jdk-17.0.19+10/Contents/Home`;
  - pré-aqueça o bundle com um `curl` no
    `entry.bundle?platform=ios&dev=true...` antes do roteiro;
  - tire duas capturas iguais antes de tocar, porque a captura vem atrasada;
  - no fim, encerre o app, desligue o simulador e pare o Metro **antes** do
    `loop validate`.
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`). Use `ps -Ao pcpu,comm`.
- **Push liberado.** PR quando a frente estiver pronta. Merge, build de
  distribuição e envio à loja só com o pedido do dono na conversa.

## 6. O relatório

Termine cada frente com:
- um relatório em `docs/evidence/` ou `docs/superpowers/handoffs/`;
- o STATUS e a FILA atualizados no mesmo run.

Separe o medido do inferido e diga o que não foi verificado. Se a conversa
acabar com algo pela metade, escreva o prompt (20).
