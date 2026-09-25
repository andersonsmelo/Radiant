# Prompt de continuidade — 2026-09-24 (2)

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele lê o resultado e decide loja,
aparelho, build de distribuição, push e merge.

**Uma frente por conversa.** A §3 lista todas as pendências em ordem de
criticidade. Pegue a primeira que for do agente e estiver destravada, defina a
condição de pronto com o dono e não misture outra na mesma conversa.

## 0. O que 2026-09-24 entregou

- **iOS 27** ([ADR](../../adr/ADR-2026-09-24-ios27-imagem-xcode-26.md)):
  - o EAS compila no Xcode 26.0, fixado nos perfis de iOS do `eas.json`;
  - o `UIScene` entra pela atualização do SDK, depois da 1.4 e antes de abril
    de 2027.
- **Verificação de desenvolvedor Android:** cumprida. As 4 chaves estão
  "Verificada", inclusive a do EAS. Não há prazo de relógio aberto.
- **Loop:**
  - `.claude/settings.local.json` e os subprodutos locais de
    `Conteúdo/extrações` saíram do guarda de escopo;
  - a lição de `context.excludes` foi corrigida no `AGENTS.md`: o guarda
    compara bytes, e o `.gitignore` não isenta nada.
- **E2E dos caminhos dourados, na PR #32, aberta:**
  - caminhos 1 e 3 `passed` no simulador iOS 26.5;
  - o caminho 2 tem o dia 1 feito e o dia 2 pendente, com relógio real;
  - o E2E expôs **três defeitos do app** (FILA, item 4 da Task 8);
  - [relatório](2026-09-24-radiant-e2e-caminhos-dourados-relatorio.md),
    [evidência](../../../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md).
- **Este prompt** vem na PR de documentação empilhada sobre a #32.

## 1. Meça antes de planejar

```bash
git fetch origin && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
```

- **Se a #32 ainda estiver aberta,** o E2E ainda não está na `main`: parta da
  branch dela, ou peça o merge ao dono.
- **Crie a branch sem upstream:**
  `git switch --no-track -c <nova> <base>`, e depois confira com
  `git branch --show-current`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar.
3. `docs/FILA.md`, o documento acionável.
4. O relatório do E2E, citado acima, antes de mexer em qualquer coisa do E2E
   ou dos defeitos.

## 3. Todas as pendências, por criticidade (2026-09-24)

| # | Tarefa | Dono | Estado e bloqueio |
|---|---|---|---|
| 1 | **Rotacionar a chave de API da Brevo** e passá-la ao `mcp-remote` por variável de ambiente, não por argumento | dono | Fora do projeto, mas urgente: a chave aparece na linha de comando dos processos `mcp-remote` e apareceu no transcrito da sessão do E2E. Nenhum arquivo do repositório a contém (varrido em 2026-09-24) |
| 2 | **Merge da #32 e da PR de documentação** | dono | Na #32, em 2026-09-24, o `content` passou e o `quality` ainda rodava: confira `gh pr checks 32` antes. De cima para baixo, como nos #28 a #30: o repositório não apaga a branch no merge, então a PR de cima não é retargetada sozinha |
| 3 | **Dia 2 do caminho 2** do E2E | agente | **A partir de 2026-09-25 11:55 (−03).** Detalhe na §4.1 |
| 4 | **Build `development` do StoreKit**: primeira compilação real do Swift, sandbox e o app abrindo num iPhone com **iOS 27** | dono | Bloqueia a 1.4. Roteiro na FILA, "o que fecha a fatia 2" |
| 5 | **Decidir o defeito 1:** lição concluída que o aluno reabre e abandona deve continuar "concluída", ou mostrar a retomada sem desfazer a contagem? | dono | É promessa ao usuário. Sem a decisão, o conserto do defeito 1 não começa |
| 6 | **Corrigir os três defeitos do E2E**, um run cada, com o teste vermelho antes | agente | Defeitos 2 (`Math.ceil` com 1 ms → "2 dias") e 3 (resumo de vidas cortado na trilha): destravados. Defeito 1: espera o item 5. Detalhe na FILA |
| 7 | **Gate H4 no simulador**: aprovação e reforço no checkpoint, retomada sem persistir respostas, texto grande e leitor de tela | agente | Destravado. Usa o build local do E2E. Marca a H4 na FILA e no roadmap |
| 8 | **Aprovar a amostra do piloto**: 20 itens e 3 perguntas (tórax sem número, "vista por trás" no decúbito, descrição acessível que entrega parte da resposta) | dono | `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap` |
| 9 | **Gravar a aprovação do piloto**: a impressão digital em `L1_TEMPLATE_APPROVAL`, com data e aprovador | agente | Depende do item 8. A L2 v7 segue pausada pela ADR, e não se retoma |
| 10 | **Remedir o F2** no Play Console: testadores **participando** no track `alpha` | dono | A última medição é de 2026-08-03. É o caminho crítico do Android, e não bloqueia a 1.4 no iOS |
| 11 | **Bump para `1.4.0`** | agente | Por último. Depende dos itens 3, 4, 6 e 7. Regra 8 da ADR de produtos: as assinaturas viajam com a versão |
| 12 | **D4, conteúdo editorial**: 19 `needs-review` em 2026-08-08, 12 para o agente e cerca de 7 para um revisor de domínio | agente + revisor | Mexe em `conteúdo/classificação`, que só abre por janela própria em `allowedRoots`, com run anterior e motivo escrito |
| 13 | **Atualizar o SDK para ter `UIScene`** (SDK 58 preferido) | agente | Depois da 1.4, com prazo em **abril de 2027**. FILA, primeiro item |
| 14 | **Apagar os branches remotos mergeados**: `docs/continuidade-2026-09-24`, `pesquisa/ios27-xcode-eas`, `docs/android-verificacao-chave-eas` e `docs/status-repositorio-e-prompt-e2e`. Decidir a worktree `zealous-shannon-01c8e3`, que tem 4 arquivos não salvos | dono | Só limpeza. Não descarte a worktree sem o dono |

**A próxima frente do agente é a 3, que tem hora marcada.** Antes das 11:55 de
2026-09-25, a próxima destravada é a 6 (defeitos 2 e 3) ou a 7 (H4). Qualquer
uma das duas que use o simulador **não pode rodar flow com `clearState`** antes
do dia 2 (§4.1).

## 4. Frentes do agente, em detalhe

### 4.1. Dia 2 do caminho 2 (item 3)

- **Quando e onde:** a partir de **2026-09-25 11:55 (−03)**, no simulador
  **iPhone 17 (iOS 26.5)**, UDID `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`.
- **O binário:** o instalado às 11:01 de 2026-09-24. **Não reinstale.**
- **Metro, no Node 20:** `radiant-app/scripts/start-ios-v2.sh` **sem o
  `--ios`**. Nesta máquina, o `--ios` falha com "Can't determine id of
  Simulator app". A sessão do E2E rodou uma cópia do script com `SCRIPT_DIR`
  fixo e `npx expo start` sem a flag, e a verificação de ambiente continuou
  rodando.
- **O comando:** `maestro test .maestro/radiant-1-4-segundo-dia.yaml`.
- **Antes dele, nenhum flow com `clearState`.** Se o estado se perder, rode de
  novo `radiant-1-4-primeira-execucao.yaml` e espere mais 24 h.
- **Pronto quando:** o flow estiver `passed`, e a evidência, a matriz do
  runbook, a FILA (item 4 da Task 8), o STATUS e o relatório do E2E estiverem
  atualizados.

### 4.2. Os três defeitos (item 6)

Cada defeito tem seu run e seu teste vermelho, visto falhando pelo defeito
**específico**, com a saída registrada. Onde estão:
- **Defeito 1:** `resolveNodeStatus` em
  `radiant-app/src/features/journey/services/JourneyRecommendationService.ts:46`.
  O `resumable` vence o `completed`, e isso vem do `847a12d`, de 2026-04-09.
- **Defeito 2:**
  `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx:346`.
- **Defeito 3:** o HUD de vidas da trilha no iPhone 17. O nó chega a x=443 numa
  tela de 402 pt.

Ao mexer em roteamento (defeito 1), aplique a lição 2 dos guardas: enumere as
regras do estado de destino e pergunte que população passa a encontrá-las.

### 4.3. Gate H4 (item 7)

Estado na FILA, "Gate operacional H4". O `inspect` do simulador dá a árvore de
acessibilidade. **Pronto quando** houver evidência dos quatro pontos e a H4
estiver marcada na FILA e no roadmap.

## 5. Regras que valem sempre

- **Loop é o contrato:**
  - `git status --porcelain`;
  - depois `node scripts/loop/abrir.mjs "<descrição>" <arquivos>`, declarando
    todo caminho: novos, os arquivos de histórico se tocar em STATUS ou FILA,
    e subprodutos;
  - para fechar: `validate` → `step finish` → [`memory write`] → `run close`,
    uma invocação por comando, lendo o `code` de cada envelope;
  - a CLI não volta de `validating` para `editing`: edite antes de validar.
- **Não rode `loop validate` com flow E2E ou Metro rodando** (2,3× de
  desaceleração medida).
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds e Maestro, no 20. Confira `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`. Última
  medição, 2026-09-24, na revisão da #32: exit 0, **147 suítes / 1.374
  testes**, 26 avisos de lint, contrato do Maestro 22/22. Cite a suíte inteira.
- **Toda guarda nova precisa ser vista falhando** pelo defeito que nomeia. E
  guarda sobre código-fonte lê a estrutura, não o texto.
- **Ao integrar à `main`:** rode `git fetch` antes e confira onde cada trecho
  do STATUS caiu. Trave o merge no SHA (`gh pr merge --match-head-commit`).
- **Nada de build de distribuição, envio, push ou merge** sem autorização do
  dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize
STATUS e FILA na mesma passagem. Separe o medido do inferido e diga o que não
foi verificado.
