# Prompt de continuidade — 2026-09-24 (3)

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele lê o resultado e decide loja,
aparelho, build de distribuição, push e merge.

**Uma frente por conversa.** A §3 lista todas as pendências em ordem de
criticidade. Pegue a primeira que for do agente e estiver destravada, defina a
condição de pronto com o dono e não misture outra na mesma conversa.

Este prompt substitui o
[prompt (2)](2026-09-24-radiant-prompt-de-continuidade-2.md). As entregas
abaixo são todas de 2026-09-24.

## 0. O que a sessão de 2026-09-24 (tarde) entregou

Tudo está no branch local **`fix/e2e-defeitos-2-e-3`**, empilhado sobre
`docs/prompt-continuidade-2026-09-24-2`, que por sua vez está sobre a #32.
**Nada tem push.**

- **Defeitos 2 e 3 do E2E, corrigidos e conferidos na tela:**
  - `66cba85`: "Próxima revisão em 2 dias" para uma revisão de 24 h;
  - `9db6dc0`: resumo de vidas cortado na trilha;
  - [relatório](2026-09-24-radiant-defeitos-2-e-3-relatorio.md).
- **Gate H4, fechado no branch:**
  - percorrido num **segundo** simulador, `A5FA5443-…`, com o progresso das
    trilhas anteriores pré-montado por decisão do dono;
  - a primeira passagem achou dois defeitos, corrigidos com teste vermelho
    antes:
    - `6b76bc7`: o texto do checkpoint prometia "10 questões"/"8 acertos";
    - `de397b6` e `9ddea97`: os tamanhos de texto de acessibilidade quebravam
      a trilha e o checkpoint;
  - depois dos consertos, tudo foi conferido de novo no AX5, no AX1 e no
    tamanho padrão;
  - [ADR](../../adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md),
    [evidência](../../../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md),
    [relatório](2026-09-24-radiant-gate-h4-relatorio.md).
- **Gate do branch, em `9ddea97`, Node 20:** `EXPO_NO_DOTENV=1 npm run
  quality` terminou com exit 0, **150 suítes / 1415 testes**, lint com 0 erros
  e 26 avisos, e visual QA sem regressão.
- **Rotação da chave da Brevo:** o dono decidiu **não** fazer e assumiu o
  risco. Sai da lista.

## 1. Meça antes de planejar

```bash
git fetch origin && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
git log --oneline origin/main..fix/e2e-defeitos-2-e-3 | wc -l
```

**Como começar a branch:**
- **se a #32 e as duas branches locais ainda não estiverem na `main`,** parta
  de `fix/e2e-defeitos-2-e-3` e não da `main`. O trabalho de 2026-09-24 só
  existe ali;
- **crie a branch sem upstream:** `git switch --no-track -c <nova> <base>`, e
  confira com `git branch --show-current`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar.
3. `docs/FILA.md`, o documento acionável.
4. O relatório ou a ADR da frente que você pegar.

## 3. Todas as pendências, por criticidade (2026-09-24, fim do dia)

| # | Tarefa | Dono | Estado e bloqueio |
|---|---|---|---|
| 1 | **Push e merge, de cima para baixo e travando o SHA:** #32 (E2E) → PR de `docs/prompt-continuidade-2026-09-24-2` → PR de `fix/e2e-defeitos-2-e-3` | dono | Na #32, o CI está verde. As outras duas branches **não têm push**. O repositório não apaga a branch no merge, então a PR de cima não é retargetada sozinha. Push só com autorização do dono na conversa |
| 2 | **Dia 2 do caminho 2** do E2E | agente | **A partir de 2026-09-25 11:55 (−03).** Detalhe na §4.1 |
| 3 | **Build `development` do StoreKit**: primeira compilação real do Swift, sandbox e o app abrindo num iPhone com **iOS 27** | dono | Bloqueia a 1.4. Roteiro na FILA, "o que fecha a fatia 2" |
| 4 | **VoiceOver no iPhone**, no mesmo build do item 3: uma avaliação do checkpoint (alternativas, envio, reforço, aprovação) e o HUD da trilha com vidas em recarga | dono | Saiu da H4 pela ADR de 2026-09-24. A árvore de acessibilidade medida está na evidência da H4 |
| 5 | **Decidir o defeito 1 do E2E:** uma lição concluída que o aluno reabre e abandona deve continuar "concluída", ou mostrar a retomada sem desfazer a contagem? | dono | É promessa ao usuário. Sem a decisão, o conserto não começa |
| 6 | **Corrigir o defeito 1 do E2E**, com o teste vermelho antes | agente | Espera o item 5. Detalhe na §4.2 |
| 7 | **Uma vida por pergunta por tentativa no checkpoint** (regra 2B da ADR da H4) | agente | **Espera o dono ler a ADR e dar o ok**: é a única decisão que muda algo que o aluno sente. Detalhe na §4.3 |
| 8 | **Bump para `1.4.0`** | agente | Por último. Depende dos itens 2, 3, 4 e 6. Regra 8 da ADR de produtos: as assinaturas viajam com a versão |
| 9 | **Aprovar a amostra do piloto**: 20 itens e 3 perguntas | dono | `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap` |
| 10 | **Gravar a aprovação do piloto** em `L1_TEMPLATE_APPROVAL`, com data e aprovador | agente | Depende do item 9 |
| 11 | **D4, conteúdo editorial**: 12 itens para o agente e cerca de 7 para um revisor de domínio | agente + revisor | Mexe em `conteúdo/classificação`, que só abre por janela própria em `allowedRoots` |
| 12 | **Remedir o F2** no Play Console: testadores **participando** no `alpha` | dono | Última medição em 2026-08-03. É o caminho crítico do Android, e não bloqueia a 1.4 no iOS |
| 13 | **Atualizar o SDK para ter `UIScene`** (SDK 58 preferido) | agente | Depois da 1.4, até **abril de 2027**. FILA, primeiro item |
| 14 | **Limpeza:** apagar os **22 branches remotos já mergeados** na `main` (medido em 2026-09-24; o único não mergeado é o da #32); decidir a worktree `zealous-shannon-01c8e3`, que tem 4 arquivos não salvos; apagar ou manter o simulador da H4 (`A5FA5443-…`) | dono | Só limpeza. Não descarte a worktree sem o dono |

**Qual frente pegar:**
- **antes das 11:55 de 2026-09-25,** a única frente do agente que pode ficar
  destravada é a **7**, e só depois do ok do dono na ADR;
- **a partir das 11:55,** a frente é a **2**.

## 4. Frentes do agente, em detalhe

### 4.1. Dia 2 do caminho 2 (item 2)

- **Quando e onde:** a partir de **2026-09-25 11:55 (−03)**, no simulador
  **iPhone 17 (iOS 26.5)**, UDID `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`.
  **Não use o `A5FA5443-…`**: ele é o da H4, e o estado dele foi pré-montado.
- **O binário:** o instalado às 11:01 de 2026-09-24. **Não reinstale.**
- **Metro, no Node 20:** use `radiant-app/scripts/start-ios-v2.sh` **sem o
  `--ios`**, porque nesta máquina o `--ios` falha com "Can't determine id of
  Simulator app". Uma cópia do script com `SCRIPT_DIR` fixo e
  `npx expo start` sem a flag funciona, e a verificação de ambiente continua
  rodando.
  - **Qual JS o Metro serve:** o dia 1 rodou com o JS de `ab121ad`. O branch
    `fix/e2e-defeitos-2-e-3` muda o resumo ("1 dia") e o HUD, mas o flow do
    dia 2 não verifica nenhum dos dois (conferido em 2026-09-24), e no tamanho
    padrão a trilha continua em zigue-zague. Qualquer um dos dois JS serve.
    Escreva no relatório qual foi usado.
- **O comando:** `maestro test .maestro/radiant-1-4-segundo-dia.yaml`.
- **Antes dele, nenhum flow com `clearState`.** Se o estado se perder, rode de
  novo `radiant-1-4-primeira-execucao.yaml` e espere mais 24 h.
- **Pronto quando:** o flow estiver `passed`, e estiverem atualizados a
  evidência, a matriz do runbook, a FILA (item 4 da Task 8), o STATUS e o
  relatório do E2E.

### 4.2. Defeito 1 do E2E (item 6)

- **Onde está:** `resolveNodeStatus`, em
  `radiant-app/src/features/journey/services/JourneyRecommendationService.ts:46`.
  O `resumable` vence o `completed`, e isso vem do `847a12d`.
- **Cuidado ao mexer em roteamento** (lição 2 dos guardas, no `AGENTS.md`):
  enumere as regras do estado de destino e pergunte que população passa a
  encontrá-las.

### 4.3. Uma vida por pergunta por tentativa (item 7)

- **A regra** está na
  [ADR](../../adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md),
  decisão 2:
  - a tentativa vai do "Iniciar checkpoint" até o envio;
  - persistem-se só os ids das perguntas já cobradas, por nó de checkpoint,
    **nunca a resposta**;
  - a lista se apaga no envio;
  - a vida gasta não é devolvida.
- **Onde:** hoje é o `Set` em memória `chargedCheckpointItems`, em
  `radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`.
- **Teste vermelho do defeito específico:** errar, remontar a tela e errar a
  mesma pergunta deve cobrar **uma** vida, não duas.

## 5. Regras que valem sempre

- **Loop é o contrato:**
  - rode `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`;
  - no zsh, passe a lista de arquivos como **array**
    (`files+=(...)` e `"${files[@]}"`), nunca como string separada por
    espaços, porque o zsh não separa e o escopo vira um caminho só;
  - confira no `state.json` quantos arquivos foram declarados;
  - para fechar: `validate` → `step finish` → [`memory write`] → `run close`,
    uma invocação por comando, lendo o `code` de cada envelope.
- **Metro e validação:**
  - **não rode `loop validate` com Metro ou flow rodando**;
  - o Metro com `CI=1` não relê arquivos alterados, então reinicie-o antes de
    conferir uma mudança;
  - `radiant-app/.expo` está em `context.excludes`.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds e Maestro, no 20. Confira `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`. Cite a
  suíte inteira.
- **Toda guarda nova precisa ser vista falhando** pelo defeito que nomeia.
- **Conserto de layout só está pronto depois de visto na tela** no tamanho
  extremo. Teste de propriedade não cobre a composição da tela: o primeiro
  conserto de texto grande passou em 7 testes e reprovou no AX5.
- **Texto grande:** a regra está em
  `radiant-app/src/ui/accessibility/useLargeTextLayout.ts`. Para conferir, use
  `xcrun simctl ui <udid> content_size <tamanho>`. **O app só aplica o tamanho
  ao ser reaberto.**
- **Processos:** não liste processos com a linha de comando inteira
  (`pgrep -fl`, `ps aux`), porque o `mcp-remote` da Brevo carrega a chave como
  argumento. Use `pgrep -x <nome>` ou `lsof -ti`.
- **Nada de build de distribuição, envio, push ou merge** sem autorização do
  dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize
STATUS e FILA na mesma passagem. Separe o medido do inferido e diga o que não
foi verificado.
