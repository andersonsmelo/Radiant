# Prompt de continuidade (20) — 2026-10-18, noite

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81, local-first). Você trabalha com o dono, Anderson. Desde
2026-10-18 você é planejador e executor
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
[prompt (19)](2026-10-18-radiant-prompt-de-continuidade-19.md). **Não execute
itens de prompts anteriores.**

## 0. O que foi concluído em 2026-10-18

A trilha de 16 a 18/10 está no
[levantamento](../../trilha/2026-10-18-levantamento-do-que-foi-feito.md), com
as §5, §6 e §7 atualizadas às 17 h. **Na `main`:**
- **G0–G4** (#39), **lição honesta** (#40), **motor híbrido** (#42 e #43) e
  **A1** (#45);
- **E2E sem animação** (#49, FILA 49 e 57). O argumento `-radiantReduceMotion 1`
  desliga o movimento decorativo nos 18 roteiros Maestro, e o contrato exige
  isso;
- **`main` pronta para build** (#48, FILA 59). Seis dos 7 roteiros passaram
  nativamente, e as capturas do G4 estão versionadas com hash. Falta o dia 2;
- **levantamento, ADR e prompt (19)** (#47).

**Na branch `claude/r6-store-revisao`, com PR aberta contra a `main`:** cada
entrega tem a sua evidência em `docs/evidence/2026-10-18-*`.
- **R6:** o store de revisão foi medido com 1.000 cartões (1,09 MiB) e 5.000
  (4,01 MiB, 67% dos 6 MB do Android). Um registro inválido agora vai para a
  quarentena `@radiant:item_review_quarantine_v1`, em vez de travar a revisão
  inteira (A3).
- **A4:** o cartão legado da lição avança uma vez por sessão, no último item
  dela na fila, com o resultado agregado.
- **R8:** o README da trilha tem 877 palavras, com o mapa completo e o texto
  antigo em `docs/trilha/historico.md`. O `docs-contract` reprova arquivo da
  pasta fora do mapa.
- **C1:** `questionIndex` e `reinforceBody` saíram do contrato de conteúdo, na
  API e no app juntos.
- Esta documentação e este prompt.

**Decidido pelo dono em 2026-10-18:**
- a régua de estrelas, a última vida concluindo a lição e o primeiro contato
  grátis com 0 vidas (ADRs da PR #42);
- no A1, a versão nova **preserva a data**;
- o registro inválido vai para uma chave própria, e o cartão em quarentena sai
  da agenda;
- o cartão legado avança no último item da lição na fila;
- o roteiro do G4 fica fora da lista da espera por `assertVisible`;
- **PR quando a frente estiver pronta.** A regra antiga de uma PR por dia às
  21 h caiu;
- o Claude planeja e executa;
- o merge continua sendo dele. Em 2026-10-18 ele pediu, na conversa, os merges
  das PRs #48 e #47, e só por isso foram feitos.

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
- a `origin/main` no merge da PR da branch `claude/r6-store-revisao`, ou em
  `94c383d` (PR #47) se ela ainda não entrou, com o CI verde;
- a App Store em `1.4.0`;
- **o checkout principal na branch velha `feat/trilha-evolucao-global-g0-g4`**,
  em `69e6532`. Não trabalhe nele: crie uma worktree ou uma branch a partir da
  `origin/main`;
- as worktrees de `.claude/worktrees/` limpas, e as já integradas listadas no
  STATUS. Removê-las é decisão do dono;
- Metro desligado, nenhum simulador ligado e carga baixa.

**Parta da `main`:**

```bash
git switch --no-track -c <nova> origin/main
```

Se o CI da `main` estiver vermelho, conserte isso antes de qualquer frente.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro. As lições de 2026-10-18 ficam logo antes de "O que
   nunca fazer".
2. `docs/STATUS.md`: as seções "Trilha — estado em 2026-10-18" e "Store de
   revisão — R6". Remeça antes de citar qualquer número.
3. `docs/FILA.md`: "Direção da trilha" e os itens 59 a 62.
4. A ADR, o relatório ou a evidência da frente que você pegar.

## 3. Como planejar e executar sem revisor externo

Sem segunda IA, quem garante a qualidade é o processo. Para cada frente:

1. **Plano curto ao dono:** o item, a condição de pronto e o que fica de fora.
   Decisão de produto vira pergunta com opções e a sua recomendação.
2. **Confira as premissas do próprio plano antes de mandar.** Contagens, "sem
   leitor", "não depende de X": cada uma com `grep` ou medida. Em 2026-10-18,
   "22 `launchApp` em 17 roteiros" estava escrito na FILA, e o YAML tinha 23.
3. **Enumere quem é afetado:** `grep -rl`, sem `head`, no app, na API e nos
   scripts. Onde houver tipo, estreite o tipo e leia os erros do `tsc`.
4. **Teste visto falhando** pelo motivo previsto, com o log vermelho guardado na
   evidência. Uma guarda escrita depois do conserto se vê falhar por injeção.
   Uma injeção que não reprova pode ser a injeção errada; confira antes de
   concluir que a guarda é cega.
5. **Gate completo** e `loop validate`. Prova nativa quando houver tela, com
   capturas versionadas e hash.
6. **Audite o próprio relatório:** cada arquivo, linha, número e link precisa
   existir.
7. **PR contra a `main` assim que a frente fechar.** Com outras PRs abertas,
   simule o merge com cada uma e rode os contratos na árvore resultante. O merge
   só acontece com o pedido do dono.

## 4. Pendências, por prioridade (2026-10-18, noite)

**Do agente:**

1. **A PR da branch `claude/r6-store-revisao`.** Se ela ainda estiver aberta,
   não há o que fazer além de manter o CI verde. O merge é do dono.
2. **Dia 2 da FILA 59:** rodar o `radiant-1-4-segundo-dia` a partir de
   **2026-10-19 às 12:45 (−03)**, no simulador `5FD8C926`, sem `clearState`
   antes, num run próprio. A receita está na FILA 59. É o que falta para a
   `main` ficar pronta para build.
3. **FILA 62:** pôr o `review-due.yaml` e o `hybrid-native-evidence.yaml` nas
   duas listas de rolagem do contrato do Maestro, e ver cada guarda falhar com o
   defeito que nomeia.
4. **FILA 61, passo 1:** medir num Android de entrada o limite de leitura de um
   valor único e o tempo de leitura do store com 1.000 e 5.000 cartões (G6). Se
   só houver emulador, diga isso no relatório. A medição decide a urgência do
   A2.
5. Depois, a **FILA 54** (G4 no Android e no VoiceOver, G6 e G7) e a **FILA 50**
   (D1 e viés de comprimento, que dependem da FILA 45).

**Do dono, o que destrava:**
- **FILA 61, o storage da revisão (A2).** A recomendação do agente é particionar
  o store por lição no AsyncStorage, aumentar o limite do banco no Android
  (exige build nova) e migrar com cópia de segurança. SQLite fica para depois,
  e só se a medição mostrar que ainda falta;
- **o merge da PR da branch `claude/r6-store-revisao`;**
- **FILA 60:** aceitar os 3,3 s por tentativa de rolagem do E1 ou buscar menos
  de 2 s;
- **FILA 45:** currículo e governança, que libera os 10 a 15 itens por lição;
- **FILA 52:** as 15 imagens;
- **FILA 48:** a captura de loja com o convite do lembrete;
- **FILA 43:** o analytics;
- **FILA 6:** os opt-ins Android;
- **build e envio** de uma versão com a trilha nova;
- a remoção das worktrees já integradas.

## 5. Regras que valem sempre

- **O Loop é o contrato:**
  - `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" "${files[@]}"`, com
    todos os arquivos que vai tocar, inclusive evidências, montados num array;
  - feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope;
  - `validate` não roda de novo a partir de `validating`. Termine as edições
    antes de validar.
- **O shell é zsh:** array para listas, `"${VAR}:caminho"` com chaves e heredoc
  com aspas (`<<'EOF'`). Releia o que um script escreveu.
- **O STATUS e a FILA:**
  - todo run que edita o STATUS declara `docs/archive/STATUS_historico.md` e move
    para lá, sem edição, o que deixou de valer;
  - todo run que tira item da FILA declara `docs/archive/FILA_concluidos.md`;
  - arquivo novo em `docs/trilha/` entra no mapa do README no mesmo run.
- **Node:** `loop` no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds, Metro e `eas` no 20. Confira com `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`. Última
  medição, em 2026-10-18 na branch `claude/r6-store-revisao`: `loop validate`
  15/15, e **174 suítes e 1.787 testes** no `jest --runInBand`.
  - **Leia o `exit=` do log, não o código do comando em segundo plano:** um
    `echo` no fim mascara a falha.
  - Teste vermelho que não reproduz: compare na branch e na `main` com
    `/usr/sbin/taskpolicy -b npx jest --runInBand --no-cache <arquivo>` e repita
    o gate inteiro.
- **Worktree nova** precisa, antes de abrir o run:
  - de `radiant-app/node_modules`, instalado com `npm ci` no Node 20;
  - de `radiant-api/node_modules`, como link para o do checkout principal,
    desfeito com `unlink` no fim, sem barra final;
  - dos `excerpts.json` e `pages.json` de `Conteúdo/extrações/*`.

  O link aparece como não rastreado: não o commite.
- **O store de revisão por item** (`ItemReviewRepository`) agora escreve numa
  leitura quando acha registro inválido: grava a quarentena e depois o store
  limpo.
- **Metro na worktree do run:**
  - suba com `EXPO_NO_TYPESCRIPT_SETUP=1`. Sem isso, nasce
    `radiant-app/expo-env.d.ts`, e o `step finish` devolve `OUT_OF_SCOPE_CHANGE`
    sem volta;
  - o `preview_start` lê o `.claude/launch.json` do **checkout principal**, fora
    do run. Crie, suba o Metro e apague.
- **E2E no simulador:**
  - Maestro precisa de Java:
    `export JAVA_HOME=$HOME/.jdks/jdk-17.0.19+10/Contents/Home`;
  - todo `launchApp` passa `radiantReduceMotion: '1'`, ou o contrato reprova;
  - pré-aqueça o bundle com um `curl` no
    `entry.bundle?platform=ios&dev=true...` antes do roteiro;
  - guarde os logs que sustentam uma afirmação em `docs/evidence/`, e não só em
    `.maestro/artifacts/`, que o git ignora;
  - no fim, encerre o app, desligue o simulador e pare o Metro **antes** do
    `loop validate`.
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`). Use `ps -Ao pcpu,comm`.
- **Push liberado, PR quando a frente fechar.** Merge, build de distribuição e
  envio à loja só com o pedido do dono na conversa. Antes de agir sobre "fiz o
  merge", confira com `gh pr view <n> --json state`.

## 6. O relatório

Termine cada frente com:
- um relatório em `docs/evidence/` ou `docs/superpowers/handoffs/`;
- o STATUS e a FILA atualizados no mesmo run.

Separe o medido do inferido e diga o que não foi verificado. Se a conversa
acabar com algo pela metade, escreva o prompt (21).
