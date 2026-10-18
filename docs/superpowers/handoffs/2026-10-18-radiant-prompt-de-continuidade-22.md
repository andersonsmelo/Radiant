# Prompt de continuidade (22) — 2026-10-18

Você continua o Radiant com Anderson. **Uma frente por conversa.** Produto,
currículo, aprovação de conteúdo/imagens, distribuição e merge continuam com o
dono. Este prompt substitui a entrada operacional do (20) e o (21) fornecido
no chat; não execute pendências de prompts anteriores sem reconciliar a FILA.
A continuação da FILA 61 pelo Codex foi solicitada pelo dono nesta conversa;
não deduza disso autorização para delegar outras frentes.

## 1. Leia e meça antes de agir

Repositório: `/Users/anderson/Developer/Radiant`.
Worktree da entrega: `.claude/worktrees/fila61-android`.

Leia nessa worktree:

1. `AGENTS.md` inteiro e `.loop/project.yaml`;
2. `docs/STATUS.md`, único estado vivo, e
   `docs/plans/2026-07-27-radiant-launch-roadmap.md`;
3. `docs/FILA.md`, especialmente 59, 61, 63 e 54;
4. [relatório da FILA 61](../../evidence/2026-10-18-fila61-android-emulador.md).

```bash
git fetch origin --prune
git status --porcelain
git branch --show-current
git log -3 --oneline origin/main
git worktree list
gh pr view 52 --json state,headRefOid,baseRefName,statusCheckRollup
sysctl -n vm.loadavg
```

O checkout principal permanece num branch antigo. Não implemente nele.
Confirme se a entrega já entrou na `main` antes de escolher a próxima frente;
para trabalho novo, parta da `origin/main`, com branch sem tracking da `main`.
Não remova worktrees nem descarte trabalho de outra sessão.

## 2. FILA 61, passo 1 — concluída

Branch: `claude/fila61-android-medicao`.
Base: `d7bd696`, merge da PR #51, posterior ao merge da #50 em `2304c94`.
Commit da medição: `e6fab1203482098ed3311d0b5e7053c4f3ad88d6`.
[PR #52](https://github.com/andersonsmelo/Radiant/pull/52), contra `main`.

**Medido em 2026-10-18:** a PR estava OPEN, sem auto-merge. Os checks `content`
e `quality` do `e6fab12` concluíram SUCCESS; o último às 19:10:16 (America/Bahia).
A passagem documental deste prompt é posterior: **remeça o HEAD e os checks**.
O merge não foi autorizado nem executado nesta conversa.

O medidor usa o gerador do R6 extraído verbatim (46 linhas), só é acionado no
console com `__DEV__` e `EXPO_PUBLIC_RADIANT_STORE_BENCH=1` e usa chaves
`@radiant:bench:`. O erro de leitura não é mascarado como store vazio.

**Resultado no emulador Android 14/API 34/arm64, 2.048 MB de RAM, 2 núcleos,
num Mac Apple M5:**

- Valor de 1,9 MiB: leitura íntegra. De 2,0 a 4,0 MiB: grava, mas a leitura
  falha com `Row too big to fit into CursorWindow`.
- 1.000 cartões: 1.143.057 bytes; mediana fria 137,5 ms, com leitura íntegra.
- 5.000 cartões: 4.203.057 bytes; grava, mas não lê; `inspect().readable=false`.
- Os 8 ms do caso de 5.000 medem reconhecimento da falha, não leitura bem-sucedida.
- `getCards()` captura erro e devolve `[]`; `inspect()` distingue ilegibilidade.
- O banco manteve 6 MiB. Não houve troca de storage, migração nem aumento de cota.
- Zero chaves de benchmark restantes após a execução. Nenhum cartão real foi usado.
- **Os tempos são de emulador, sem equivalência com aparelho de entrada ou Release.**

Provas versionadas no relatório e em sua pasta de logs:

- Duas suítes focadas: 11 testes verdes; quatro mutações reprovaram nos casos previstos.
- `EXPO_NO_DOTENV=1 npm run quality`, Node 20: 175 suítes, 1.794 testes,
  1 snapshot, exit 0; Visual QA estrito aprovado.
- `loop validate`: 15/15 em um ciclo.
- FILA, STATUS, históricos e relatório atualizados.

Não refaça essa medição ou extração. A pendência passou a ser a decisão A2.

## 3. Runs e ambiente

O run do handoff, `run-1792359912932-f40607cb`, foi fechado concorrentemente
às 18:52:02 de 2026-10-18, sem validar. **Não tente retomá-lo.**

O substituto `run-1792360977572-2fb18e53` foi aberto normalmente, com os mesmos
15 arquivos. Sua baseline já continha a entrega preservada: não atribua
retroativamente as edições ao run original. Fechamento confirmado:
`VALIDATION_PASSED → STEP_SUCCEEDED → MEMORY_WRITTEN → RUN_CLOSED`.
Sessão `brain-session-1792360332452-ad9e1eeb`: CLOSED.

Este prompt e a reconciliação documental usam o run
`run-1792361508608-772caf66`, com seis documentos declarados. O resultado e o
fechamento devem ser confirmados pela CLI antes de iniciar outro escritor;
não confunda esse run documental com a prova nativa anterior.

App, emulador e Metro da medição foram encerrados. O link temporário
`radiant-api/node_modules` foi removido após a validação da medição e pode ser
provisionado novamente durante a validação documental; não o commite e use
`unlink` sem barra final no fechamento. SDK, JDK, APK e worktree foram preservados.
Task Observer registrou a observação 262 sobre transferência de controle de runs.

SDK: `$HOME/Library/Android/sdk`.
AVD: `radiant-entrada-api34`.
JDK: `$HOME/.jdks/jdk-17.0.19+10/Contents/Home`.

## 4. Pendências, por prioridade

### Dono — o que precisa de decisão

1. Revisar/autorizar o merge da PR #52; confirme HEAD e checks antes de agir.
2. **FILA 61, A2:** escolher o desenho do storage. Recomendação: particionar
   por lição no AsyncStorage, aumentar a cota total no Android e migrar com
   backup, conferência e preservação da chave antiga. **Aumentar só a cota não
   resolve o limite por valor.** SQLite fica para depois, se ainda necessário.
3. FILA 60: aceitar 3,3 s por rolagem do E1 ou buscar menos de 2 s.
4. FILA 45: currículo e governança; FILA 52: seleção das 15 imagens.
5. FILA 48: captura de loja com convite do lembrete.
6. FILA 43: provedor de analytics; FILA 6: sete aceites Android restantes.
7. Autorizar build/distribuição da trilha nova e remoção das worktrees integradas.

Percorra as decisões uma por vez. Nenhuma implementação do A2 está autorizada.

### Agente — próximas execuções

1. **FILA 59, dia 2**, somente a partir de **2026-10-19 às 12:45
   (America/Bahia, UTC−03)**, no simulador iOS `5FD8C926`. **Não use clearState**.
   Siga a receita da FILA 59, com run próprio. Não substitua relógio real por fixture.
2. **FILA 63:** instabilidade de `CheckpointScreen.flow.test.tsx`.
   Uma falha anterior no CI não reproduziu em 3/3 locais com `taskpolicy -b`.
   Meça a cadeia no CI antes de aumentar prazo. O CI verde da #52 não encerra esse item.
3. **FILA 54:** G4 no Android e VoiceOver, G6 e G7. A medição do emulador
   não fecha G6 inteiro nem prova aparelho físico.
4. **FILA 50**, dependente da FILA 45.

Antes de abrir uma frente nova, diga o item, a condição de pronto e o que fica
fora, e combine isso com Anderson. Uma frente não autoriza executar todas as demais.

## 5. Contrato de execução

- Use `lean-task-start` e `using-loop`; leia as skills atuais. Loop usa Node 24;
  app, testes, builds, Metro e EAS usam Node 20. Confira `node --version`.
- Faça uma consulta focada ao cérebro pela CLI pública. Não edite o vault.
- Confira Git, trabalho concorrente e estado do run imediatamente antes da
  primeira escrita. Transferir um id não transfere controle exclusivo do run.
- `PROJECT_BUSY` não se contorna. Não recupere lock nem altere estado manualmente.
- Abra pelo `node scripts/loop/abrir.mjs`, declarando a união dos arquivos,
  inclusive evidências. Nenhuma edição antes de `STEP_STARTED`.
- Ao atualizar STATUS/FILA, declare os históricos e preserve sem edição os
  trechos substituídos. Não crie outro arquivo de estado vivo.
- Use testes focados durante as alterações e uma validação final configurada.
  O gate do app é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app` no Node 20.
- Worktree precisa das dependências e das extrações locais antes de validar.
  Provisione antes do run e não commite links ou subprodutos.
- Metro: `EXPO_NO_TYPESCRIPT_SETUP=1`. Não gere `expo-env.d.ts` fora do escopo.
- Pare app, simulador/emulador e Metro antes do gate; confira carga do Mac.
- Feche com `validate → step finish → [memory write] → run close`, uma chamada
  por comando, lendo o `code` de cada envelope. Memória só após `succeeded`.
  Feche a sessão de leitura separadamente.
- Push está autorizado; PR quando a frente estiver pronta. Merge, distribuição,
  envio à loja e mudanças de produto/storage exigem a autorização correspondente.
- Termine com arquivos, provas, PR/checks, estados do run/sessão e pendências.
  Separe emulador, aparelho físico e produção. Não crie tarefas pessoais automaticamente.
