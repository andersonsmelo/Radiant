# Prompt de continuidade (5) — 2026-09-25

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele decide loja, aparelho, build
de distribuição, push e merge.

**Uma frente por conversa.** Pegue a primeira pendência da §3 que for do agente
e estiver destravada, combine a condição de pronto com o dono e não misture
outra frente na mesma conversa.

Este prompt substitui o
[prompt (3)](2026-09-24-radiant-prompt-de-continuidade-3.md) e o
[prompt (4), da nuvem](2026-09-24-radiant-prompt-de-continuidade-4-nuvem.md).
Os dois estão cumpridos ou superados. **Não execute itens deles.**

## 0. O que foi concluído em 2026-09-24 e 2026-09-25

| Item | Estado | Onde |
|---|---|---|
| Merge da #32 (E2E), da #33 (prompt 2) e da #34 (defeitos 2 e 3, H4, vida por tentativa) | ✅ na `main` `c9062da`, CI verde | sessão na nuvem, com a cabeça travada |
| Dia 2 do caminho 2 do E2E | ✅ `passed` em 2026-09-25 às 13:20, com relógio real. **Os três caminhos dourados estão verdes no iOS 26.5** | [evidência](../../../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md) |
| Regra de uma vida por pergunta por tentativa | ✅ na `main` (PR #34) | [relatório](2026-09-24-radiant-vida-por-tentativa-relatorio.md) |
| Decisões do dono: defeito 1 → A; reembolso → fora do roteiro; renovação desconhecida → "Ativa · acesso até" | ✅ | [ADR](../../adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md) |
| Conserto do defeito 1 | ✅ na **PR #36**, à espera de merge. Visto na tela | [relatório](2026-09-25-radiant-defeito-1-relatorio.md) |
| Conserto da renovação desconhecida | ✅ na **PR #37**, à espera de merge | [relatório](2026-09-25-radiant-renovacao-desconhecida-relatorio.md) |
| StoreKit no iPhone com iOS 27.2 | ✅ em parte: compilou, preços em reais, compra mensal e anual, renovação acelerada, expiração e reinstalação | [evidência](../../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md) |
| Perfil `development` do EAS sem upload de source maps | ✅ na `main` (PR #34), com contrato | — |
| F2 remedido | ✅ medido: 5 participando de 14, e os 14 dias não começaram | FILA |
| D4 remedida | ✅ medido: 19 `needs-review` de 105; a estrela já era opcional | FILA |
| Limpeza: 25 branches remotos e a worktree `zealous-shannon` | ✅ | [registro dos branches](../../release/2026-09-25-branches-remotos-apagados.md) |

## 1. Meça antes de agir

```bash
git fetch origin --prune && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
git branch -r
```

**Esperado em 2026-09-25 às 14:51:**
- abertas, nesta ordem de merge: a #35 (docs), a #36 (defeito 1) e a #37
  (renovação desconhecida e este prompt);
- a `origin/main` em `c9062da`.

**Se as três já estiverem na `main`,** comece a branch por ela:

```bash
git switch --no-track -c <nova> origin/main
```

**Se não estiverem,** parta de `fix/renovacao-desconhecida`, que é o topo da
pilha.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar qualquer número.
3. `docs/FILA.md`.
4. O relatório ou a ADR da frente que você pegar.

## 3. Todas as pendências, por criticidade (2026-09-25)

| # | Tarefa | Dono | Estado e bloqueio |
|---|---|---|---|
| 1 | **Merge de #35 → #36 → #37**, nesta ordem e com o CI verde | dono | A #36 tem o Auto-fix do app ligado. A revisão do Codex já foi respondida |
| 2 | **VoiceOver no iPhone (4b):** uma avaliação do checkpoint e o HUD da trilha com vidas em recarga | dono | **Bloqueia a 1.4.** O dono não quer fazer. A alternativa é uma decisão dele, por ADR, de aceitar a árvore de acessibilidade medida na H4 como evidência |
| 3 | **Ask to Buy** no sandbox | dono | Precisa de um grupo familiar no sandbox: App Store Connect → Sandbox → Compartilhamento Familiar |
| 4 | **Cancelamento** no aparelho | dono | **Bloqueado:** os Ajustes do iOS 27.2 (`24B5089g`) fecham ao gerenciar o sandbox. Precisa de outro aparelho ou de outra versão do iOS. O texto "Cancelada" tem teste |
| 5 | **Aprovar a amostra do piloto:** as 3 perguntas e o item 18, que parece idêntico ao item 1 | dono | Snapshot em `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`. Perguntas no [relatório do piloto](2026-09-23-radiant-licao-hibrida-relatorio.md) |
| 6 | **Gravar a aprovação** em `L1_TEMPLATE_APPROVAL` | agente | Depende do 5 |
| 7 | **D4:** 19 `needs-review` (10 sem sinal, 9 com sinal fraco) | agente + revisor | **Destravada.** A janela de `Conteúdo/classificação` foi autorizada pelo dono em 2026-09-25. Detalhe na §4.1 |
| 8 | **Caminho 3 do E2E afirma o estado da L1** | agente | Depende do merge da #36. Detalhe na §4.2 |
| 9 | **Conferir a regra de vidas na tela**, no simulador `A5FA5443` | agente | Destravado. Depois disso o dono decide se apaga o simulador |
| 10 | **Decisões de produto do StoreKit:** "Gerenciar" e troca de plano (`showManageSubscriptions`), ordem dos planos, preço de outra loja até recarregar | dono → agente | Achados 2 a 4 da FILA, na seção "AGENTE — achados do StoreKit" |
| 11 | **Medir o aquecimento** da build | agente, com o dono | Hipótese: o fundo animado de estrelas. Teste: fora do carregador, com e sem Reduzir Movimento |
| 12 | **Atualizar o eas-cli** do projeto (16.32 → 24.7) e fixá-lo em `cli.version` | agente | Achado 6 da FILA |
| 13 | **F2:** faltam 7 testadores aceitarem o convite, e depois correm os 14 dias | dono | Caminho crítico do Android. Não bloqueia a 1.4 no iOS |
| 14 | **Bump para `1.4.0`** | agente | **Por último.** Depende dos itens 1 a 4. Regra 8 da ADR de produtos: as assinaturas viajam com a versão |
| 15 | **SDK 58 com `UIScene`** | agente | Depois da 1.4, até **abril de 2027** |

**Qual frente pegar agora:** a **D4 (item 7)**. É P0 na FILA, está
destravada e não depende de aparelho. A 9 é curta e pode entrar numa conversa
à parte.

## 4. Frentes do agente, em detalhe

### 4.1. D4 (item 7)

- **O texto antigo da FILA está vencido.** A seção da D4 abre com um bloco
  "Remedida em 2026-09-25", que é o que vale.
- **Comece lendo a governança do conteúdo**, em `conteúdo/governança` e
  `docs/content/`, para responder: o agente pode **aprovar** os 9 com sinal,
  ou só **propor** para um revisor? Os 10 sem sinal vão para o revisor de
  domínio.
- **A janela de escrita:**
  - reabra `Conteúdo/classificação` em `allowedRoots` **num run próprio e
    anterior**, com a grafia do **disco** (`Conteúdo` em NFD, com C
    maiúsculo), conferida com `find`, e nunca digitada;
  - a política hoje tem só a grafia do git, e o guarda compara bytes;
  - o motivo, a data e o autorizador vão num comentário no próprio
    `.loop/project.yaml`, como nas janelas de 2026-08-08;
  - feche a janela ao terminar.
- **O arquivo:**
  `Conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classifications.json`.

### 4.2. Caminho 3 afirma o estado da L1 (item 8)

- **O que muda:** o `radiant-1-4-vidas-esgotadas.yaml` não afirma a L1 de
  propósito, por causa do defeito 1 (há um comentário no fim do flow). Com a
  #36 na `main`, ele passa a afirmar `^Fundamentos de Radiologia\. Concluído\.$`
  e o cabeçalho em `1 de`.
- **Toda asserção nova precisa ser vista falhando:** rode o flow contra o JS
  de antes do conserto, ou injete o defeito.
- **O contrato:** `scripts/maestro-contract.test.mjs` pode fixar a asserção.

## 5. Regras que valem sempre

- **O Loop é o contrato:**
  - rode `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" "${files[@]}"`, com a
    lista em **array** no zsh;
  - confira no `state.json` quantos arquivos foram declarados;
  - feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope.
- **O STATUS tem regra própria:** todo run que o edita **declara também**
  `docs/archive/STATUS_historico.md`, e move para lá, **sem edição**, o trecho
  que deixou de valer (só os links são reajustados). Em 2026-09-24 isso foi
  esquecido três vezes.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds e Maestro, no 20. Confira `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`. Cite a
  suíte inteira: o número de hoje é **151 suítes / 1434 testes**.
- **Toda guarda nova precisa ser vista falhando** pelo defeito que nomeia.
  - **Se ela passar de primeira,** confira se o cenário do teste consegue
    expressar o defeito. Uma trilha de uma unidade só não move o foco.
  - **Uma linha do conserto que nenhum teste derruba** sai, ou ganha um teste.
- **Metro para um iPhone físico:** passe o IP da **interface da rota padrão**
  (`route -n get default`), conferido com `curl <ip>:8081/status`. Na sessão de
  2026-09-24 o IP velho do Wi-Fi custou uma tentativa.
- **Não rode `loop validate` com o Metro ou um flow rodando.**
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`), porque o `mcp-remote` da Brevo carrega a chave como argumento.
- **Coordenação:** um item delegado a outra sessão sai da lista desta. Antes
  de executar um item que aparece em dois prompts vivos, pergunte ao dono se a
  outra sessão ainda está ativa.
- **Nada de build de distribuição, envio, push ou merge** sem a autorização do
  dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize o
STATUS e a FILA na mesma passagem. Separe o medido do inferido, e diga o que
não foi verificado.
