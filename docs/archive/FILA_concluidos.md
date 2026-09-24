# Fila — itens concluídos e histórico

Itens que saíram de [`FILA.md`](../FILA.md) por estarem concluídos, caducos ou
serem só histórico. Movidos **sem edição** — só os links relativos foram
reajustados ao novo diretório: o texto é o que a fila dizia no dia em que o
item saiu. Novos itens concluídos entram no fim deste arquivo, no mesmo run que
os fecha.

---

## Lote de 2026-09-23 — consolidação (fila em `78f96d0`)

### DONO — CONCLUÍDO em 2026-09-23: os três PRs empilhados foram mergeados

**Medido em 2026-09-23:** mergeados na `main`, nessa ordem e por merge commit,
com autorização do dono na conversa:

1. [PR #15](https://github.com/andersonsmelo/Radiant/pull/15) — L2 v3→v6 e as fatias
   1 e 5 da Task 8 → `9acd2f5`.
2. [PR #16](https://github.com/andersonsmelo/Radiant/pull/16) — decisão do StoreKit
   por módulo local; só documentação, por isso sem CI → `b77547f`.
3. [PR #17](https://github.com/andersonsmelo/Radiant/pull/17) — adaptador StoreKit,
   kill switches reais, privacidade do analytics e Ask to Buy, mais o commit de
   docs `0b0283e`, que antes só existia localmente → `18a2789`. CI `quality`
   verde no `0b0283e` (run 35881990350, disparado pelo push, ainda com a base
   anterior); a árvore de `18a2789` é **idêntica** à de `0b0283e`, porque cada
   PR continha o anterior — o que o CI testou é o que está na `main`.

⚠️ **A `main` agora carrega o módulo Swift `radiant-storekit`, que nunca
compilou contra o Expo real.** O build interno `development` (item do dono
abaixo) é o que fecha isso; até lá, um build nativo a partir da `main` pode
falhar nesse módulo.

As quatro fatias de vidas (itens 3, 3b, 3c e a nota do 4) entraram na `main`
na mesma data pelo [PR #18](https://github.com/andersonsmelo/Radiant/pull/18)
→ `8972cbc`, com o CI `quality` verde no PR e na `main` depois do merge
(run 35885988196). **Não construídas.**

```bash
gh pr list --state open
```

### CONCLUÍDO — 1.4: Tasks 1–7 e a fatia CloudKit da Task 8

Tasks 1–7 entregues e revisadas em 2026-09-14. A **fatia CloudKit da Task 8**
foi implementada em 2026-09-15 e está no
[PR #14](https://github.com/andersonsmelo/Radiant/pull/14), **mergeado pelo
dono em 2026-09-16 às 19:56:53 (−03)**, com CI verde e as três threads de
revisão resolvidas. `origin/main` está no merge commit `f5d9601`, e o CI
pós-merge `Radiant App Quality` concluiu com SUCCESS. Relatório em
[`superpowers/handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md`](../superpowers/handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md).

**Implementado ≠ validado nativamente:** nenhuma linha do Swift foi compilada.

### DONO — CONCLUÍDO em 2026-09-16; nada aqui está aberto

> 🔴 **Esta seção listou quatro pendências até 2026-09-16, e duas delas estavam
> feitas desde 15/09.** O dono pediu para "resolver" provisioning e Deploy
> Schema, e a investigação mostrou que ambos já constavam como concluídos no
> `STATUS.md` — só esta fila não sabia. **Segunda ocorrência da mesma falha no
> mesmo arquivo no mesmo dia**, depois da seção J3. Atualizar o estado sem
> atualizar a fila faz o dono refazer trabalho pronto, não só o agente.

1. ✅ **Provisioning profile regenerado** — concluído em **2026-09-15**. Medido
   em iPhone físico: capability iCloud habilitada no App ID
   `com.ascendcreative.radiant`, provisioning Ad Hoc regenerado, iPhone
   registrado, build `45abf4fd` instalado e o módulo Swift compilando e
   executando. Evidência em [`STATUS.md`](../STATUS.md), bloco "VALIDADO
   NATIVAMENTE em 2026-09-15".
2. ✅ **Build interno autorizado e gerado em 2026-09-16** —
   `69d77f13-39bc-46f0-a925-29eb3e568330`, perfil `preview`, do commit
   `7c4a841`. Instalar **pelo link do EAS**: ele é `1.3.1 (11)`, idêntico aos
   anteriores na tela de Ajustes.

   ✅ **A medição foi feita e passou.** A precondição foi confirmada pelo dono
   antes de desinstalar — Backup no iCloud ligado, último backup em **15/09 às
   21:08**, XP 100, trilha 11/14. Depois da desinstalação completa e instalação
   exclusiva desse build, a primeira abertura devolveu XP 100, sequência de 1
   dia, trilha 11/14 e próximo passo checkpoint, **sem tocar no toggle**. O
   restore funcional da **Passagem 1** passou, e a **Passagem 2** (opt-out)
   passou no mesmo build. Detalhes em
   [`superpowers/handoffs/2026-09-16-radiant-1-4-cloudkit-restore-abertura.md`](../superpowers/handoffs/2026-09-16-radiant-1-4-cloudkit-restore-abertura.md),
   §§8.1 e 8.2.

   **O que passou não foi tudo.** A captura dos eventos internos falhou
   (`CoreDeviceError 3 / Mercury 1001`), então **a causa histórica exata segue
   sem prova** — a evidência é visual e demonstra o resultado, não o mecanismo.
   E a correção de `lastBackupAt` (`45d465`) é **posterior a este build**:
   está coberta por teste e CI, nunca validada em aparelho.
3. ✅ **Deploy Schema to Production concluído** — em **2026-09-15**, junto da
   validação física: schema `ProgressBackup` implantado em **Production**, com
   escrita e leitura reais funcionando. **Não precisa refazer:** o registro tem
   três campos — `payloadVersion`, `payload` e `savedAt` — e o `payload` é
   string JSON opaca, então evoluir o progresso é mudança de TypeScript, não de
   schema (ver o cabeçalho de `cloudkitBackup.types.ts`). Confirmado em
   2026-09-16 que nem `cloudkitBackup.types.ts` nem o módulo Swift foram
   tocados desde o deploy.

   ```bash
   git log --since=2026-09-15 --oneline main -- radiant-app/src/features/progress-sync/cloudkitBackup.types.ts radiant-app/modules/radiant-cloudkit
   ```

   Saída vazia = schema intacto desde o deploy. Se algum dia esse comando
   devolver commit, o Deploy Schema **volta a ser obrigatório** antes de submeter.
4. ✅ **DSN do Sentry gravado** — em **2026-09-16**, no ambiente `production`
   do EAS, como `EXPO_PUBLIC_SENTRY_DSN` com visibilidade `sensitive`. Org
   `ascend-creative-xj`, projeto `react-native`, região **US**.

   ⚠️ **O portão continua fechado de propósito.** `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`
   **não** foi gravada, e o portão exige as duas (`bootstrap.ts:10`). O
   `Sentry.init` não roda e nada sai do aparelho — é isso que mantém o rótulo
   **"Dados não coletados"** verdadeiro na App Store. **Ligar a flag é decisão
   de loja, não de engenharia:** exige revisar as Privacy Labels antes da
   submissão da 1.4.

   ```bash
   cd radiant-app && npx eas env:list --environment production
   ```


3. ✅ **Acordo de apps pagos *Ativo*** — **medido em 2026-09-23** no App Store
   Connect (Negócios → Contratos): vigente de 15/09/2026 a 01/08/2027, todos os
   países; conta bancária *Ativa*; formulário fiscal do Brasil, Certificate of
   Foreign Status e W-8BEN *Ativos*. Leitura feita na tela, sem clicar em nada.

1. ✅ **Sentry com configuração mínima, sem IP e sem identificador** — concluído
   em **2026-09-22**. `buildSentryOptions` é função pura e auditável:
   `sendDefaultPii: false`, `tracesSampleRate: 0`,
   `enableNativeFramesTracking: false`, `maxBreadcrumbs: 20`, `beforeSend` que
   remove `user`, `server_name` e nome de aparelho, e `beforeBreadcrumb` que
   descarta migalhas `console`/`xhr`/`fetch` — as que carregariam resposta
   digitada em lição ou corpo de requisição. O contrato de privacidade ganhou
   guarda por **AST** de que o SDK é inicializado num ponto só e sempre por essa
   função.

   > ⚠️ A primeira versão da guarda usava regex sobre o fonte e **passava com
   > `sendDefaultPii: true`**, porque casava com a menção da opção num
   > comentário. Só apareceu porque a guarda foi derrubada de propósito depois
   > de escrita. O próprio arquivo já dizia, desde antes, que o contrato usa AST
   > para ignorar comentários e strings.

   **O portão continua fechado.** `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` não foi
   gravada e `Sentry.init` não roda. Esta fatia não liga nada — ela fixa o que
   sairia do aparelho **se** você ligar, que é a base factual para revisar as
   Privacy Labels. Ligar segue sendo decisão sua.

2. ✅ **Adaptador StoreKit real** — implementado em **2026-09-23**, **sem
   build** ([ADR](../adr/ADR-2026-09-23-storekit-modulo-expo-local.md),
   [plano](../superpowers/plans/2026-09-23-radiant-1-4-storekit-fatia-2.md),
   [relatório](../superpowers/handoffs/2026-09-23-radiant-1-4-storekit-fatia-2-relatorio.md),
   [vermelhos](../superpowers/handoffs/2026-09-23-radiant-1-4-storekit-fatia-2-vermelhos.md)).
   `StoreKit2Adapter` atrás da `StoreKitPort`, módulo Swift
   `modules/radiant-storekit/` só StoreKit 2 e sem dependência, ligado no
   `SubscriptionService` e na abertura. Gate medido: `quality` exit 0, 132
   suítes / 1163 testes, Node 20.20.2 — reproduzido por outra sessão numa
   worktree limpa. Comitado em `000daef`, no [PR #17](https://github.com/andersonsmelo/Radiant/pull/17). Corrigiu os Product IDs (eram os do
   `PaywallPlan`) e o reembolso que mantinha as vidas ilimitadas. **O Swift
   nunca compilou contra o Expo real** — o fechamento de verdade é do dono,
   abaixo.
3. ✅ **`QuizTopBar` mostrando ∞ para assinante** — implementado em
   **2026-09-23**, **sem build**, na branch `feat/quiztopbar-infinito`,
   comitado em `647b2c3` com autorização do dono na mesma data
   ([relatório](../superpowers/handoffs/2026-09-23-radiant-quiztopbar-infinito-relatorio.md),
   [vermelhos](../superpowers/handoffs/2026-09-23-radiant-quiztopbar-infinito-vermelhos.md)).
   O topo da lição troca os corações por ∞ quando
   `HeartsSnapshot.status === 'unlimited'` — o mesmo predicado que faz o erro
   não custar. **Não** lê o `SubscriptionStatus`, por decisão do dono na mesma
   data: o cache da assinatura só vira vidas ilimitadas quando `applyToHearts`
   roda. `pending` e `expired` seguem vendo vidas. Gate medido, Node
   `v20.20.2`: `quality` exit 0, **133 suítes / 1178 testes**. A `QuizScreen`
   (`/quiz`, sem entrada no app, vidas pelo contador legado) ficou sem ∞ de
   propósito nesta fatia; ganhou ∞ na 3d, quando passou ao
   `heartsRepository`. **Falta:** a validação visual com assinante real, que espera o
   sandbox.

   Três achados desta fatia, fora dela, viraram tarefas próprias:
   - ✅ **Perfil lia o contador legado de vidas** — resolvido na mesma data,
     item 3c.
   - ✅ **O `HUD` mostrava ∞ ao lado dos corações** — resolvido na mesma data,
     nota do item 4.
   - ✅ **A folha de vidas nunca oferecia a assinatura.** O dono decidiu que
     entra na 1.4, e foi resolvido na mesma data — item 3b.
3b. ✅ **Folha de vidas oferece a assinatura** — implementado em
   **2026-09-23**, **sem build**, na branch `feat/folha-vidas-loja`, aberta de
   `647b2c3`
   ([relatório](../superpowers/handoffs/2026-09-23-radiant-folha-vidas-loja-relatorio.md),
   [vermelhos](../superpowers/handoffs/2026-09-23-radiant-folha-vidas-loja-vermelhos.md)).
   Lição, Checkpoint e Jornada perguntam `subscriptionService.storeAvailable()`
   — o binário tem o módulo da loja? —, sem tocar a StoreKit nem a rede;
   "Ver assinatura" fecha a folha e abre `/subscription`; Lição e Checkpoint
   passaram a reler as vidas a cada foco, então quem volta assinante vê ∞ e
   não fica bloqueado. Gate, Node `v20.20.2`: `quality` exit 0, **133 suítes /
   1190 testes**. **Para o dono decidir:** offline com binário capaz de vender,
   o motivo aparece na tela da assinatura e não na folha, ao contrário da spec
   §98 — mostrá-lo na folha exigiria uma dependência de rede no estudo.
   **Falta:** a volta de `/subscription` no navegador real, que espera build.
3c. ✅ **Perfil e recompensa leem as vidas da fonte viva** — concluído em
   **2026-09-23**, na branch `claude/sharp-dijkstra-747d12` (sobre
   `0b0283e`), integrada localmente em `integ/vidas-1-4` na mesma data. A
   seção Vidas do Perfil e o HUD do `RewardScreen` liam o contador legado do `GamificationService`
   (sempre 5, nunca ∞); agora leem `heartsRepository`, com ∞ para assinante.
   Gate: 134 suítes / 1181 testes, Node 20.20.2.
   [Relatório](../superpowers/handoffs/2026-09-23-radiant-perfil-vidas-relatorio.md).
3d. ✅ **Contador legado de vidas do `GamificationService` aposentado** —
   concluído em **2026-09-23**, **sem build**, e na `main` pelo
   [PR #20](https://github.com/andersonsmelo/Radiant/pull/20) → `2e62fc9`
   ([relatório](../superpowers/handoffs/2026-09-23-radiant-aposenta-vidas-legado-relatorio.md),
   [vermelhos](../superpowers/handoffs/2026-09-23-radiant-aposenta-vidas-legado-vermelhos.md)).
   Por decisão do dono na mesma data, a `/quiz` lê e gasta pelo
   `heartsRepository`, e o assinante vê ∞ lá também. A Home ganhou
   `getHearts`, com ∞, e a Jornada deixou de usar o legado como reserva. Os
   campos e métodos de vidas saíram do serviço e dos tipos. **Os campos já
   gravados no blob `radiant:gami:v1` continuam no disco, intocados**:
   voltar à 1.3.1 não perde nada, e um teste guarda isso. A `/quiz` segue sem
   bloquear com zero vidas, como antes. Gate, Node `v20.20.2`: `quality`
   exit 0, **134 suítes / 1224 testes**. A guarda contra um leitor novo do
   legado é o próprio typecheck:

   ```bash
   cd radiant-app && npx tsc --noEmit
   ```


5. ✅ **Checklist de declarações à loja** — preparado em **2026-09-22** em
   [`CHECKLIST_DECLARACOES_1.4.md`](../release/CHECKLIST_DECLARACOES_1.4.md), com as
   linhas de assinatura marcadas ⏳ e **explicitamente não preenchíveis** até (2)
   fechar. Confere cada declaração da §9 contra o código, não contra a intenção.

   **Medição que sustenta a linha de privacidade:** o ambiente `production` do
   EAS tem **uma única variável**, o DSN do Sentry. Sem `EXPO_PUBLIC_API_BASE_URL`
   e sem `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`, as três portas de saída — Sentry,
   API e sync — estão fechadas por construção. **Nada sai do aparelho hoje**, e
   "Dados não coletados" é verdadeiro e verificável.

   ```bash
   cd radiant-app && npx eas env:list --environment production
   ```

   📌 O defeito aberto do `ENABLE_REMOTE_SYNC` (que não desliga o `AuthService`)
   **é inerte em produção** porque `API_BASE_URL` não existe naquele ambiente.
   Continua aberto; só não é alcançável na configuração submetida.

## HISTÓRICO — o lançamento iOS (concluído em 2026-09-14)

Reordenado em 2026-08-08. O **12 testadores × 14 dias** é exigência do **Google
Play** para conta pessoal; a Apple não tem equivalente. F3, F4 e F5 do roadmap
misturam as duas lojas, e os itens do Play não travam a App Store.

> 🔴 **Esta seção afirmou "Aguardando revisão" de 2026-08-09 a 2026-08-25.** A
> rejeição chegou em **14/08 às 02:54** e ficou dez dias sem leitura. Quando foi
> lida, em 24/08, o `STATUS.md` foi corrigido e **esta fila não** — e ela é o
> arquivo que instrui o agente a pegar o primeiro item e executar. Quem
> obedecesse a tabela antiga leria, na última linha, que não havia trabalho
> neste caminho. Ressincronizada em **2026-08-25**.

**Estado:** `1.3.1 (11)` **na App Store** — aprovada e liberada em 2026-09-14,
console em *Pronto para distribuição*; tag `v1.3.1` = `063770d`. **Esta seção
está concluída.** Nada abaixo é executável; é o histórico de como se chegou
aqui. O que
segue abaixo é o histórico de como se chegou aqui. A instalação do
`(9)` também revelou um defeito de conteúdo/apresentação. A parte de
**apresentação** foi corrigida em 2026-09-08 — o painel visual legado saiu, com
regressão que o impede de voltar (ver [STATUS](../STATUS.md)) —, mas a correção é
**posterior ao `(9)`**: o binário no TestFlight ainda contém o defeito. A parte
de **conteúdo** teve a ordem das alternativas corrigida em 2026-09-08 (ver
[STATUS](../STATUS.md)); o texto genérico nas etapas de ensino continua aberto.
**Bloqueio:** produção e auditoria do Arco 1, corte seguro, smoke físico e
resposta à Apple. **Dono:** agente para J3 e implementação local; auditor para
revisão dos pacotes; dono para aparelho e ações de loja que exijam autorização.

**Ressincronização documental em 2026-08-27:** esta fila deriva do status
canônico; nenhuma nova consulta à Apple foi feita nesta atualização.

Decidido em 24/08: **responder com um build novo do `main`, não com o `(7)`.** O
binário em revisão está 138 commits atrás e ainda carrega `src/app/modal.tsx`, o
template do Expo em inglês — passivo direto sob o código da rejeição. O
`1.3.1 (9)` foi gerado e submetido com `--auto-submit` em 24/08.

| Passo | Dono | Estado |
| --- | --- | --- |
| Contrato de licença atualizado | titular | **concluído** em 24/08 — a faixa sumiu da lista de apps |
| Build `1.3.1 (9)` a partir de `main` | dono | **concluído** em 24/08 — o EAS numera sozinho |
| Disponibilidade do `(9)` no TestFlight | dono | **confirmada** em 27/08 pela instalação e captura; não é a correção do V3 |
| Instalar e **verificar se o app abre** | dono | **abertura confirmada** no `(9)`; smoke completo, persistência e offline continuam pendentes |
| Anotar modelo e versão do iOS | dono | **concluído** — iPhone 16 / iOS 27.0, informados em 27/08 |
| Fundação técnica V3 — J2 | agente | **concluída localmente** — `320e10d`; sem troca de telas |
| Produção do Arco 1 — J3 | agente + auditor | **em andamento** — L1 aprovada; L2 reprovada no parecer v6 (2026-09-22); ver a seção J3 abaixo |
| Auditoria/QA de acessibilidade — J4 | auditor + executor dos testes manuais | **pendente** sobre as lições implementadas, não sobre o desenho |
| Corte seguro e fluxo completo no iPhone — J5 | agente + dono | **pendente** — preservar histórico e validar instalação limpa/atualização |
| Remover o painel visual legado | agente | **concluído** em 2026-09-08 — componente, raster e dicas globais fora; regressão no lugar do mock |
| Permutar a ordem das alternativas | agente | **concluído** em 2026-09-08 — determinística no gerador compartilhado; app e API regenerados |
| Build `(10)` de `main`=`321ebec`, smoke no iPhone | dono + agente | **concluído** em 2026-09-11 — abre, lição completa, progresso persiste. **Revelou o formulário de login inerte no Perfil**; não é o binário do reenvio |
| Esconder o cartão de conta sem sync remoto | agente | **concluído** em 2026-09-11 — condicional em `ProgressScreen`; teste com configuração de produção |
| Build `(11)` verificado no iPhone | dono | **concluído** em 2026-09-11 — cartão de conta ausente, "Estudo local, sem conta", progresso preservado na atualização |
| Vídeo do item 1 + 6 capturas, do `(11)` | dono | **concluído** em 2026-09-11 — gravação contínua de 32 s a partir da tela inicial; 6 capturas sem painel/formulário, barra limpa |
| Trocar as 6 capturas da página do produto | dono | **concluído** em 2026-09-12 |
| Responder à Apple (vídeo + mensagem) | dono | **concluído** em 2026-09-12 — não reenvia por si só |
| Reenviar para Revisão do app | dono | **concluído** em 2026-09-13 — botão na página *Envio do iOS*; cabeçalho passou a **Aguardando revisão** |
| Revisão da Apple | Apple | **aprovada** em 2026-09-14 — "eligible for distribution" |
| Liberar a versão | dono | **concluído** em 2026-09-14 — *Liberar esta versão* → *Pronto para distribuição* |
| Tag `v1.3.1` | agente | **concluído** em 2026-09-14 — em `063770d`, o commit do binário; no remoto, conferido em 2026-09-23 (`git ls-remote origin 'refs/tags/v1.3.1^{}'` → `063770d`) |
| Conferir o segredo do Sentry contra as Privacy Labels | agente | **concluído** em 2026-09-08 — `eas env:list` sem variáveis em `production`; e o portão tem duas chaves (`ENABLE_CRASH_REPORTING && SENTRY_DSN`), ambas ausentes. Rótulo "Dados não coletados" coerente |
| Disponibilidade e classificação etária no App Store Connect | dono | **concluído** em 2026-09-11 — 1 país (Brasil); 7 passos da classificação sem pergunta em branco, +13/A12 inalterado. DSA sem objeto enquanto não houver UE |
| Responder ao item 7 — direitos e área regulada | dono | **concluído** em 2026-09-11 — fonte reclassificada `reference-only`, exceção encerrada, texto final no plano de resposta |

**Estado da revisão:** usar a data de medição e os bloqueios de
[STATUS.md](../STATUS.md). Uma nova conferência exige App Store Connect
autenticado; não inferir aprovação da Apple a partir de TestFlight ou CI.

Plano de resposta item a item, com os textos em inglês prontos para colar:
[`release/APP_REVIEW_REPLY_1.3.1.md`](../release/APP_REVIEW_REPLY_1.3.1.md).
Folha de transcrição do envio original:
[`store/2026-08-08-ios-preflight.md`](../store/2026-08-08-ios-preflight.md).

Gate de release medido em 2026-08-08: `tsc` exit 0, `eslint` 0 erros, **jest 56
suítes / 330 testes**. Essa contagem é histórica. A evidência J2 de 27/08 está
no status: 74 testes focados e 14 validadores Loop aprovados, sem prova de
funcionamento do V3 no aparelho. Remedir o escopo atual com os comandos do plano
e `loop validate` no run correspondente.


### Histórico — os seis críticos do parecer v3, todos corrigidos em 2026-09-22

O roteiro manda corrigir os achados e repetir a revisão antes de avançar de
pacote. Ficam registrados aqui, na ordem em que foram atacados (os dois primeiros
são de conteúdo e mudam o desenho; os quatro seguintes são de mecânica):

1. **C1** — `planePaths.coronal` é uma linha horizontal numa vista frontal,
   indistinguível do transversal. O próprio arquivo já tem a forma certa em
   `candidatePaths.coronal`.
2. **C2** — o seletor de exploração põe coronal/sagital/mediano/transversal/
   oblíquo como cinco opções mutuamente exclusivas, ensinando `E-PLN-MED` e
   `E-PLN-OBL` no controle que deveria remediá-los.
3. **C3** — a silhueta é deslocada duas vezes (`SlicingSpaceModel.tsx:69` e
   `:91`); a placa "mediana" não coincide com o centro do corpo desenhado, o que
   torna falsa a resposta correta de `l2-initial-median` e `l2-median-recovery`.
4. **C4** — `additionalRecoveryChallengeId` nunca é lido pelo motor da L2 (a L1
   lê), então quem acerta nunca recebe item de recuperação independente.
5. **C5** — Reduce Motion é violado na primeira renderização; usar
   `useReducedMotionPreferenceState` e esperar `resolved`.
6. **C6** — `option.label` é token de identidade ("Opção 1" para `median`,
   `coronal` e `oblique`), contradiz o número por posição ao lado dele e permite
   acertar a recuperação lendo o rótulo.

✅ **I2 decidido pelo dono em 2026-09-23** ([ADR](../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md)): criar
`E-PLN-ORT` (confunde os planos ortogonais entre si) na spec V3 §5.2 e
reclassificar os quatro pontos da L2. **Entra na v7**, no mesmo run do Q1,
porque muda a remediação que o motor seleciona.

📌 **Na fila logo depois da v7 — C6 na L1**, decidido na mesma ADR: copiar a
correção da L2 (rótulo pela posição) para `BodyReferenceLessonPreview.tsx`, com
auditoria independente curta só dessa mudança.

Ao corrigir, **escrever primeiro o teste que falha** contra o defeito real: um
teste que asseverasse sobre o espelho das props ou sobre o hook mockado
reproduziria exatamente a cegueira que deixou os três ciclos passarem verdes.
Continua sem verificação em aparelho o pedido da v2 sobre a semântica de rádio no
VoiceOver, que nenhum teste desta suíte pode fechar.

```bash
git log --oneline -1 -- radiant-app/src/features/curriculum-v3/l2-slicing-space
cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/curriculum-v3
```

Seguir o [roteiro de continuidade](../runbooks/curriculum-v3-arco-1.md): ~~L1~~ →
**L2 (reprovada em v3, corrigir)** → P1 → L3 → C1-A/C1-B → R1/R2. O desenho já
foi aprovado; não pedir ao dono para aprovar cada lição. Não repetir J2, ativar V3, apagar o legado ou iniciar build
nesta tarefa. Registrar evidência específica do conteúdo e das interações,
além dos testes de engenharia. Acompanhar no
[cartão existente do Trello](https://trello.com/c/f9OYyCX5), sem criar tarefas
no Todoist.

---

## CI da API — correção local concluída em 2026-08-09

**Estado:** concluído em 2026-08-09. **Bloqueio:** nenhum. **Dono:** agente.

O `Radiant API Quality` foi acionado pela alteração de `radiant-api/README.md`
e revelou uma dependência que já existia: a configuração do ESLint buscava o
parser não declarado no `node_modules` de `radiant-app`. O job da API instala
apenas o lockfile próprio, portanto falhava com `MODULE_NOT_FOUND`; não era
regressão documental e não deve ser ocultado retirando o README do diff.

O pacote agora declara `@typescript-eslint/parser` nas dependências de
desenvolvimento e a configuração usa somente essa cópia. Remedição local sob
Node 20: `npm ci`, resolução do parser pelo próprio pacote, `npm run lint`,
`npm run build` e `npm run test` (**13/13**). O push foi confirmado com
**Radiant App Quality** e **Radiant API Quality** verdes no PR #1.

---

## HISTÓRICO — Onda 2 concluída em 2026-08-09

**Estado:** concluída como fundação isolada em `off`. **Bloqueio:** nenhum.
**Dono:** agente.

O módulo `student-checkpoints` entrega schemas, store ativo e shadow separados,
coordenador, adaptadores ainda desconectados e
`CommitOperationV1 + CommitIntentV1` persistidos juntos antes dos efeitos. Cada
autoridade isolada grava o recibo de `operationId` no mesmo registro do efeito;
crash injection cobre antes do efeito e depois de efeito+recibo/antes do
marcador da saga. Com `off`, o teste prova zero leitura/escrita do kernel e a
suíte completa do app permanece verde.

Cobrir os três intents fechados — lição, review e checkpoint —, sete autoridades
separadas e pausa durável após 20 retries automáticos, com retry explícito por
época sem cancelar efeito anterior.

Evidência: **5 suítes/58 testes focados**, lint, typecheck e **71 suítes/472
testes** do app. Run Loop: `run-1786311202497-fd99173e`.

Fonte normativa:
[`2026-08-09-checkpoints-e-loops-do-aluno.md`](../superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md).

---

## HISTÓRICO — Onda 3 concluída em 2026-08-09

**Estado:** concluída em `shadow`. **Bloqueio:** nenhum. **Dono:** agente.

As 12 superfícies usam o store shadow isolado, com
`preview=shadow` e `production=off`. Nenhuma decisão shadow pode alimentar
navegação, progresso, XP, desbloqueio, recomendação ou serviço pedagógico. A
matriz cobre ciclo de vida, relaunch, deep link inválido, catálogo alterado,
storage indisponível e navegação repetida somente com ids/códigos allowlisted,
preservando as filas e autoridades legadas.

Evidência: **4 suítes/22 testes novos**, **9 suítes/80 testes** do módulo,
**10 suítes/47 testes** de telas, lint, typecheck e **75 suítes/494 testes** do
app. Run Loop: `run-1786314104218-908d111b`.

---

## HISTÓRICO — Onda 4: runtime ativo somente interno

**Estado atual (2026-08-13):** encerrada por aceitação explícita do dono. As
coortes de `first_frame` permanecem registradas como `inconclusive` por ruído do
host, sem regressão encontrada; não há bloqueio H3 executável.

**Registro histórico:** o instrumento foi corrigido **três vezes** no mesmo dia —
limiar consciente de ruído, desfecho `inconclusive`, e por fim a troca da métrica
de partida para `first_frame`, que mede a janela onde o kernel de fato vive
(`cold_start` ficou informativo). O piloto da métrica nova então achou ~440 ms de
custo de partida, e a fronteira medida mostrou que **quase nada disso é do kernel**:
a resolução do AsyncStorage por `await import()` responde por 177–622 ms e a leitura
em si por **menos de 2 ms**. O `expo export` de produção emite um único bundle, sem
chunk assíncrono, então o custo **não existe fora do Dev Client**. **O kernel custa
<2 ms na partida.** O que falta: tornar o delta de `first_frame` válido em dev
(aquecer a resolução nos dois modos) e **rodar as duas coortes**.
**Dono:** agente — as correções de instrumento estão feitas e a pergunta do custo
foi respondida sem precisar de build. A coorte ainda quer janela de host, e o dono
participa dos gates humanos.

Evidência: [`2026-08-10-wave-4-student-checkpoint-h3-gate.md`](../../radiant-app/docs/evidence/2026-08-10-wave-4-student-checkpoint-h3-gate.md).
Run Loop `run-1786354337237-662c1d8d`.

Status canônico promovido em 2026-08-10 para
[`archive/EXECUTION_STATUS_2026-08-10.md`](EXECUTION_STATUS_2026-08-10.md)
(run `run-1786380009304-c10fa573`), junto com a lista governada de
`scripts/qa/docs-contract.mjs` e os ponteiros dos seis documentos de estado
corrente — o acoplamento que impedia mintar o snapshot num run de escopo menor.

Persistência p95 **15,7 ms** (limite 75) e restauração p95 **10,6 ms** (limite
100) passaram folgadas, com 42 e 20 amostras reais — as primeiras que existem.
Home→Lição ficou **−174 ms**, ou seja o candidato é mais rápido que o baseline.

**Próximas ações executáveis, em ordem:**

1. ✅ **corrigir a tela de retomada** — feito em 2026-08-10, run
   `run-1786366083722-93ee4bf4`. `CheckpointResumeScreen` virou `ScrollView` com
   `flexGrow: 1` no contêiner de conteúdo (`flex: 1` ali recriaria o defeito).
   Teste novo vermelho antes da implementação e provado por mutação; **17/17** no
   arquivo. **Falta a prova em aparelho em AX4/AX5**, que roda junto da
   reexecução das coortes porque exige `radiant-app/.env.local`;
2. ✅ **corrigir o gate de cold start** — feito em 2026-08-10, run
   `run-1786366490575-a0a0c4cb`. O limite virou
   `max(0,05 × baseline_p95, 50 ms, baseline_p95 − baseline_p50)`; o terceiro
   termo é o piso de ruído medido. Dois casos novos, vermelhos antes da
   implementação, e o piso provado por mutação; **6/6** no arquivo. A rota de
   emitir do app uma marca de primeiro frame foi **descartada com motivo**: o
   probe só liga em `active`, então o baseline `off` — que precisa continuar
   silencioso — nunca produziria a coorte de comparação;
3. ✅ **reexecutar as coortes** — feito em 2026-08-10, run
   `run-1786366830631-0755376c`. 20/20 e 20/20 no mesmo binário/aparelho/perfil,
   com as duas coortes em sequência. **Persistência p95 23,1 ms** (n=43) e
   **restauração p95 9,0 ms** (n=20) passam com folga; Home→Lição +152 ms contra
   591 permitidos. **Bloqueio P0 fechado com prova em aparelho**: em AX4 e AX5 o
   CTA é alcançável rolando, e o flow completo de retomada passa em AX5;
4. ✅ **dar ao gate um terceiro desfecho** — feito em 2026-08-10, run
   `run-1786383400260-6ad60081`. Cada gate e o relatório passaram a expor
   `outcome` com três valores, e `inconclusive`/`measurement-too-noisy` é falha
   fechada quando `piso_de_ruído > 0,2 × baseline_p95` — quatro vezes a
   sensibilidade de 5% que o desenho pedia. `insufficient-samples` migrou para o
   mesmo desfecho: `fail` passa a significar "o produto regrediu" e
   `inconclusive`, "remedir o instrumento". Três casos novos, vermelhos antes da
   implementação, cinco mutações provadas, **9/9** no arquivo. Recalculado sobre
   as três passagens no disco: a de host ocioso segue conclusiva (razão 0,108), a
   que havia sido **descartada por julgamento humano** agora é recusada pelo
   próprio instrumento (0,246) e o passe vazio da terceira virou `inconclusive`
   (0,498). Uma fixture pré-existente foi trocada de propósito — ela afirmava que
   uma medição com 28,6% de ruído aprova, que é o passe vazio que o teto recusa;
5. ✅ **trocar a métrica de partida do gate** — feito em 2026-08-10, run
   `run-1786392781118-5b1f744b`, com [desenho aprovado pelo dono](../superpowers/specs/2026-08-10-marca-de-primeiro-frame-design.md).
   `cold_start` media a duração do `launchApp`, que num Dev Client termina no
   launcher, antes de o bundle JS existir — o kernel é JS e não vivia na janela.
   Entrou `first_frame`: início da janela JS até o frame seguinte a `startupPhase`
   virar `ready`, que só acontece depois de `inspectLaunch` do runtime de
   checkpoints, então **o kernel está dentro da janela por construção**. Emitida nos
   dois modos, o que faz o delta existir; o probe de checkpoint continua exigindo
   `active`. `cold_start` fica informativo (`advisory: true`), fora do veredito, e
   reverter é tirar o nome de `ADVISORY_GATES`. "Off silencioso" virou asserção: o
   gate `baseline_isolation` reprova se um log de baseline carregar métrica de
   checkpoint. Emissor **9/9**, relatório **14/14**, cinco mutações provadas, sem
   dependência nova e **sem binário novo**;
6. ⏳ **as duas coortes de `first_frame` RODARAM em 2026-08-12, e o desfecho é
   `inconclusive`.** 20+20 amostras no mesmo binário, aparelho e perfil, em
   sequência imediata, run `run-1786575077447-6b656968`. Evidência:
   [`2026-08-12-h3-first-frame-cohorts.md`](../../radiant-app/docs/evidence/2026-08-12-h3-first-frame-cohorts.md).
   **Persistência p95 16,8 ms** (n=40, limite 75) e **restauração p95 7,9 ms**
   (n=21, limite 100) passam com folga; Home→Lição **+10 ms** contra 771
   permitidos; `baseline_isolation` limpo — o log de `off` carrega só a marca de
   partida. **Nenhum delta medido é positivo**, isto é, não há sinal de regressão
   em lugar nenhum.
   O que impede o verde é o instrumento, não o produto: o piso de ruído do
   baseline deu **132,6 ms contra um teto de 117,1 ms** (22,7% do p95), e o gate
   recusa concluir quando a medida não tem resolução. A causa está registrada no
   artefato — durante a janela o macOS **cresceu o swap de 2048 MB para 4096 MB**,
   com uso indo de 951 a 2944 MB. A degradação caiu sobre o **baseline**, que
   rodou na fase de crescimento, então o −72 ms do candidato **não é ganho**: é
   dispersão de quem rodou antes. Remedir, não promover.
   **Achado de comparabilidade, corrigido em 2026-08-13:** o flow de `active`
   continua com lançamento inicial e relançamento de retomada, mas `first_frame`
   agora declara a fase. O gate só lê os 20 `cold` de cada lado e exige 20
   `resume` no active como evidência separada; ausência, excesso ou envelope sem
   fase falha fechado como `inconclusive`. O relançamento mais rápido (p95 360,3
   contra 522,8 do frio) não entra mais no p95 de partida. Decisão:
   [`ADR-2026-08-13-h3-first-frame-populacao-fria.md`](../adr/ADR-2026-08-13-h3-first-frame-populacao-fria.md).
   **Encerramento por aceitação explícita do dono em 2026-08-13:** o dono confirmou
   que repetiu as coortes em host silencioso e fez a passagem no aparelho físico de
   tela baixa. Os números e artefatos novos não foram fornecidos ao repositório; por
   isso o registro histórico permanece `inconclusive`, sem ser reclassificado como
   `pass` e sem promover produção.
   *Registro do estado anterior deste item, preservado porque é a proveniência dos
   números acima:* Um
   **piloto** de 6+6 amostras foi rodado em 2026-08-10 (`run-1786394347211-12be1d79`)
   e mudou a natureza da pendência. A instrumentação funciona nos dois modos, e o
   **kernel adiciona ~440 ms à partida** (mediana `off` 239,1 ms contra `active`
   680,5 ms) — o primeiro achado de **produto** desta saga, que a métrica antiga
   escondia porque `launchApp` termina antes de o kernel existir. O delta é 3× a
   amplitude interna das coortes, então não é deriva de host.
   **A hipótese do desenho não se confirmou:** o piso de ruído deu 92,5 ms sobre
   p95 de 331,6 ms, razão 0,279, acima do teto de 0,20 — a dispersão caiu em valor
   absoluto mas não em proporção, e a **janela de host continua necessária** (reboot
   para zerar swap, Metro pré-aquecido, coortes em sequência). Com baseline apertado
   o veredito esperado seria `fail` — **mas o item 7 mostrou que esse `fail` seria
   por artefato de dev, não por regressão**, então a coorte só vale depois de o
   delta virar comparável. Lembrete de receita: o baseline agora roda com
   `PERFORMANCE=true` e `MODE=off`;
7. ✅ **a pergunta do custo de partida está FECHADA — era artefato do Dev Client**
   (runs `run-1786403538585-d2745992` e `run-1786404098148-d873b589`). Não exigiu
   build: `storage_module_resolution` mede a resolução do módulo sozinha, e a
   subtração dá a leitura — **menos de 2 ms** em todos os seis lançamentos, contra
   177–622 ms de resolução. E o `expo export` de produção emite **um único** bundle
   JS, sem nenhum chunk assíncrono, então num build embarcado o `import()` não tem o
   que buscar. **O kernel custa <2 ms na partida.** Consequência: o delta de
   `first_frame` medido em Dev Client **não pode julgar esta onda**, porque só um
   lado percorre o caminho de chunk. Saída preferida: aquecer a resolução no
   bootstrap nos dois modos, o que restaura a validade da medição e ainda tira
   ~200 ms por lançamento do desenvolvedor. **Registro do erro:** eu havia escalado
   isso como "exige autorização do dono para build sem Dev Client" — não exigia, e um
   export de bundle respondeu;
8. ✅ **aquecimento do módulo no bootstrap** — feito e medido em 2026-08-10 (runs
   `run-1786404557489-333ee8ae` e `run-1786405737946-c7d970f3`).
   `warmNativeStorage()` entrou no `Promise.all`, independente do modo e sem tocar
   chave alguma. **A assimetria caiu:** `launch_inspection` em `active` foi de
   184–357 ms para **1,0–1,9 ms**, e o delta de medianas de `first_frame` de +344/+441
   para **−28,7 ms** — o candidato ficou marginalmente mais rápido, que é o esperado
   de um kernel de <2 ms. Duas guardas com mutação provada, uma delas **estrutural**
   porque `import()` dinâmico não executa sob Jest e o teste de runtime seria vazio.
   **Predição minha refutada:** eu disse que a busca se esconderia no bootstrap e que
   isso tiraria ~200 ms do desenvolvedor; o `Promise.all` espera o mais lento, então
   ela passou a dominar e o `first_frame` em `off` subiu de ~232 para ~580 ms. O ganho
   é simetria, não velocidade; em produção o custo é ~0 (bundle único);
9. ⏳ **antiga pendência 7, agora reduzida:** O diagnóstico da fronteira (runs
   `run-1786395295145-4412f2f2` e `run-1786396152130-5d9cdc0b`) mostrou que **~72%
   dos 440 ms não são custo do kernel**: `launch_inspection` custa 0,5–0,9 ms em
   `off` e 184–357 ms em `active`, e o mecanismo é resolução de módulo, não I/O — a
   primeira operação de storage do kernel resolve o AsyncStorage por `await
   import()`, que o Metro serve como chunk buscado por HTTP no Dev Client, enquanto a
   operação seguinte no mesmo lançamento custa 13–21 ms. Em `off` o `inspectLaunch`
   retorna antes de tocar o store, então o baseline nunca paga.
   **Se o custo não existir fora do Dev Client, não há o que otimizar** e a pergunta
   "440 ms são aceitáveis?" cai. Exige build com `developmentClient: false` (o perfil
   `e2e-test` já declara isso), portanto **autorização do dono**. Se persistir, o
   remédio provável é aquecer a resolução em paralelo no bootstrap — **não** trocar o
   import, que foi tentado e derrubou seis suítes do kernel;
10. ✅ **viewport curto em simulador** — feito em 2026-08-10, run
   `run-1786385853053-960f7e28`. A razão que bloqueava este item era falsa: o
   runtime iOS 26.5 suporta `iPhone SE (3rd generation)`. Criado o simulador
   `Radiant SE 4.7` (`[0,0][375,667]`, 207 pt mais curto que o das coortes), com o
   **mesmo binário nativo** (`sha256 1e5d423…76`), o flow versionado
   `.maestro/student-checkpoint-short-viewport.yaml` passou em `medium`, AX3, AX4
   e AX5 — retomada offline após kill/relaunch, sem redirect automático, CTA
   alcançado rolando e volta para a Tela 2 de 3. Contrato Maestro **21/21** com o
   flow registrado. **Aparelho físico** de tela baixa continua inexistente e o
   simulador não o substitui;
11. ✅ **VoiceOver como serviço e TalkBack foram declarados concluídos pelo dono
   em 2026-08-13.** O Maestro não dirige leitor de tela e o runbook recusa presença
   na árvore de acessibilidade como critério; por isso a proveniência é confirmação
   manual do dono, não uma alegação de automação. Isto fecha os dois checks de
   acessibilidade do H3.
12. ✅ **ausência de efeito duplicado após o relançamento** — fechada em
   2026-08-13, run `run-1786622015450-e1943354`, flow
   `.maestro/student-checkpoint-no-duplicate-effect.yaml`. O flow conclui a lição
   (o efeito comita XP, progresso e recibo no mesmo journal), **captura** o valor
   do medidor com `copyTextFrom`, mata o app, relança e afirma o mesmo valor. O
   valor é capturado e não fixado porque XP é base mais bônus — a execução real
   deu 18 XP. Guarda provada por mutação: afirmando o dobro (`36 XP`), que é o que
   se veria se o efeito fosse reaplicado, o flow reprova. Cobre o caminho que o
   usuário percorre; injeção de crash no meio do commit continua sendo dos testes
   da Onda 2. Evidência:
   [`2026-08-13-h3-efeito-duplicado.md`](../../radiant-app/docs/evidence/2026-08-13-h3-efeito-duplicado.md);
   ✅ **"segunda falha invalida o checkpoint e volta à Home"** foi aceita pelo dono
   em 2026-08-13 com a cobertura unitária existente, sem criar um flow artificial.
   A razão medida permanece: **não é alcançável por E2E neste binário.**
   `inspectLaunch` só cai no caminho de falha quando o `contentVersion` do
   checkpoint difere do atual — e ele é `LESSON_CATALOG.version`, embutido no
   bundle — ou quando `routeTarget` devolve `null`, estado que os fluxos limpos
   não produzem, porque concluir e pular a apresentação chamam `finish()` e
   encerram o checkpoint. Há cobertura unitária em `ActiveCheckpointRuntime.test.ts`
   (`restoreFailureCount: 2`, fase `invalidated`). Fechar em E2E exige **decisão de
   desenho**: simular a atualização de conteúdo mutando a versão do catálogo entre
   dois carregamentos do Dev Client, orquestrado fora do Maestro, ou aceitar a
   cobertura unitária. Proposta, não tomada.

Antes de qualquer reexecução, ler a seção **Gate H3** do
[`E2E_RUNBOOK`](../../radiant-app/docs/E2E_RUNBOOK.md): sem `radiant-app/.env.local`
o runtime `active` não liga, e sem o coletor CDP as coortes saem vazias.

Promover `active` somente em build interna para apresentação, Lição, Revisão e
checkpoint de unidade. Entregar CTA explícito de retomada, nunca redirect
automático, e fallback canônico para Home quando catálogo, cursor ou rota forem
incompatíveis.

O profile `checkpoint-internal` e o flow Maestro de kill/relaunch offline estão
versionados. A instrumentação do gate mudou em 2026-08-10 e a descrição antiga
("o app mede só persistência/restauração em `active`") não vale mais: o app emite
**cinco** métricas, e a diferença entre elas é o que o gate pode concluir —
`persistence`/`restoration` dentro do app e só em `active`; `first_frame`,
`launch_inspection` e `storage_module_resolution` dentro do app e **em todos os
modos**, porque delta exige as duas coortes; e `cold_start`/`home_to_lesson` do
`commands.json` do Maestro, com `cold_start` fora do veredito. `off` continua
silencioso no que importa — nenhuma leitura ou escrita do kernel —, e isso passou de
afirmação a asserção: métrica de checkpoint num log de baseline reprova o relatório.
O relatório falha fechado sem 20 amostras por coorte. Quality medida no encerramento
de 2026-08-10: **544 testes** verdes, contratos Maestro **21/21** e parser **4/4**. O EAS CLI resolveu o profile e a
variante de simulador como `development+active`, distribuição interna e sync
remoto `false`.

Builds disponíveis: iOS Simulator `2d718691-288d-498e-9825-a03b14411bd2`
(`appBuildVersion = 7` no registro do EAS, mas `CFBundleVersion = 3` no binário —
contador remoto, corrigido em 2026-08-10, e **não** é a `1.3.1 (7)` da App
Review) e Android `62d44f3f-30d0-4e12-b262-21b86ea6326c`
(`1.3.1 (6)` remoto; não promover). O primeiro iOS falhou no auto-upload
Sentry; o profile interno agora desliga esse upload. O APK foi instalado no AVD
após remover a cópia antiga de assinatura incompatível, mas nenhum flow foi
medido.

H3 foi encerrada por aceitação explícita do dono em 2026-08-13. A engenharia
H4/Task 12 foi integrada à `main` pelo PR #3 (`da638bb`); resta apenas o gate
operacional em aparelho. Produção permanece `off`, e sync remoto, build/OTA de
produção e publicação continuam fora desta onda.

---


## HISTÓRICO — Task 10 concluída em 2026-08-09

O registry agora cobre múltipla escolha, hotspot, comparação, associação e
ordenação. Hotspot tem alternativa textual; comparação marca seleção também por
texto; associação funciona em sequência sem drag; ordenação usa subir/descer.
Os alvos têm ao menos 44 pt, respostas compostas permanecem controladas pelo
player e o feedback é anunciado uma vez ao confirmar.

Evidência: **8 suítes/35 testes focados**, lint, typecheck, Storybook config e
visual QA sem regressões; a suíte completa passou com **66 suítes/414 testes**.
Quatro stories de feature entram no Storybook. Aparelho físico e leitor de tela
real continuam como validação posterior, e nenhum novo binário foi publicado.

---

## HISTÓRICO — duas pendências técnicas isoladas concluídas

### A. ~~Varrer `jest.spyOn` sobre mocks oficiais~~ — concluída em 2026-08-09

**Estado:** concluída. **Bloqueio:** nenhum. **Dono:** agente.

O caso de `CompetencyReviewService.test.ts` já era a única ocorrência nociva:
aplicar `jest.spyOn` sobre uma função que já é mock devolve o próprio mock, e
`mockRestore()` pode apagar a implementação oficial. A varredura das demais
suítes não encontrou outro alvo que combinasse mock de módulo e restauração
destrutiva. Os `mockRestore()` ativos atingem apenas `console` ou `Intl`
reais; o teste de `AccessibilityInfo` restaura espiões reais e reinstala o
comportamento necessário por teste.

As sete suítes candidatas passaram em uma única execução focada, isolada e sem
cache: **7/7 suítes, 89/89 testes**. Nenhuma mudança de código de produção ou
teste foi necessária; a próxima pendência técnica é a barreira explícita de
ativação do agendador.

Comando usado:

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache \
  src/ui/accessibility/useReducedMotionPreference.test.ts \
  src/features/lesson-flow/services/LessonOutcomeService.test.ts \
  src/features/journey/services/JourneyNodeCompletionGuard.test.tsx \
  src/features/spaced-repetition/services/CompetencyReviewService.test.ts \
  src/features/first-run/startup-gate.flow.test.tsx \
  src/features/telemetry/appStoreProps.test.ts \
  src/features/progress/screens/ProgressScreen.flow.test.tsx
```

### B. ~~Tornar explícita a ativação do agendador por competência~~ — concluída em 2026-08-09

**Estado:** concluída. **Bloqueio:** ativação de leitura continua esperando
conteúdo v2. **Dono:** agente.

`JourneyRecommendationService.resolveReason` agora falha fechado quando o nó
recomendado resolve apenas competências sintéticas legadas (`legacyOnly`): mesmo
que uma vencida `competency:legacy:*` seja passada a `computeSnapshot`, o motivo
permanece `next-new`. A barreira fica no ponto de decisão, antes de comparar
vencidas, e não altera as regras de desbloqueio.

`getDue` continua sem chamador de produção e os snapshots ainda omitem a lista
de vencidas. A futura ativação só poderá recomendar revisão quando o resolver
ligar um nó a competência curricular real do conteúdo v2; a mídia autorizada em
2026-08-09 destravou a Task 10, mas o conteúdo v2 ainda precisa ser construído.

Teste de regressão e verificações focadas: **6/6 testes**, lint e typecheck
passaram.

Comandos usados:

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache \
  src/features/journey/services/JourneyRecommendationService.test.ts
npm run lint -- --quiet
npm run typecheck
```

---

## HISTÓRICO — os quatro itens agentáveis de 2026-08-08 fecharam

Os quatro itens abaixo fecharam em 2026-08-08. O que sobra de forma agentável
está listado acima; os registros abaixo permanecem para proveniência.

### 1. ~~O mapa de galáxias está vazio~~ — CONCLUÍDA em 2026-08-08

**Estado:** concluída. **Bloqueio:** nunca houve. **Dono:** agente.

As 16 lições entraram no mapa, em 6 planetas sob 2 galáxias. `galaxy-fisica` e
`galaxy-tecnologia` saíram de `available`/`locked` para `active` — antes eram
cascas vazias.

**A causa foi tratada, não só o sintoma.** A divergência entre os dois catálogos
existia porque `ai-catalog.ts` é **gerado** e `galaxy-catalog.ts` era escrito à
mão, com o vínculo lição→planeta mantido nos dois lugares. Agora a linha está em
outro lugar: **fato de governança é gerado, decisão de design é escrita à mão.**
`sync-catalog-to-app.mjs` passou a emitir `galaxy-nodes.ts` a partir do mapa de
taxonomia; cor, superfície e posição continuam autorais em `galaxy-catalog.ts`.

Sete testes em `galaxy-nodes.test.ts`, e dois deles mordem de verdade — provado
por mutação: com `nodesOf` devolvendo `[]`, os cinco restantes seguem verdes
**vaziamente**, porque um mapa sem conteúdo satisfaz toda asserção sobre o
conteúdo dele. Quem pega o módulo gerado deixar de ser consumido é só o par que
compara gerado × mapa.

Ordem dentro do planeta vem da sequência pedagógica da trilha, não do mapa, que
é alfabético por id. Nós nascem `available` de propósito: as 16 já eram
alcançáveis pela trilha plana, e nascer `locked` **reduziria** o acesso — o mapa
acrescenta caminho, não fecha o que existe.

**Continua do dono:** destravar `galaxy-casos`, que segue sem conteúdo nenhum.

Medido em 2026-08-08:

```bash
node -e "const s=require('fs').readFileSync('radiant-app/src/data/galaxy-catalog.ts','utf8');console.log('corpos com nodes vazios:',(s.match(/nodes: \[\]/g)||[]).length)"
```

O app tem 4 galáxias e 5 corpos celestes. **Só `planet-torax` tem conteúdo**
(8 nós); os outros quatro estão vazios, e duas galáxias estão `locked`. As 16
lições `ai-lesson:` embarcam numa trilha plana, `track-ai-fundamentos`, em
`radiant-app/src/data/ai-catalog.ts`, **desconectada do mapa**.

A metáfora central do produto está ~80% vazia enquanto o conteúdo que a encheria
viaja num paralelo. Quem abre o app vê mundos travados e vazios.

A ligação foi construída em 2026-08-07 e mora onde nada a lê:
`content-manifest/taxonomy-catalog-map.json` atribui as 16 lições a 6 planetas em
2 galáxias, e `Conteúdo/taxonomia/` descreve os nós. Ver o
[desenho aprovado](../superpowers/specs/2026-08-07-taxonomia-eixo-tecnico-design.md).

**Isto não é decisão nova.** O dono já decidiu, em 2026-08-07, que nó `active`
significa currículo entregue e que as 16 lições pertencem àqueles planetas.
Preencher o mapa é executar aquela decisão, não tomar outra. Nenhum conteúdo
novo é criado e nenhuma promessa nova é feita.

**Fora deste item, e continua do dono:** destravar `galaxy-casos`, que não tem
conteúdo nenhum.

### 2. Trilhas com nome de anatomia entregando curso técnico — MENTIRA CORRIGIDA em 2026-08-08, reagrupamento ADIADO

**Estado:** a parte visível está corrigida; o reagrupamento continua aberto.
**Bloqueio:** migração de progresso — descrito abaixo. **Dono:** agente para a
migração; dono se quiser rever a redação dos títulos.

**Duas afirmações da versão anterior deste item estavam erradas, e as duas
importam.**

*"Não afeta o usuário — o bundle embarca uma trilha só."* Falso. `AI_TRACK` só é
lido pelo próprio `ai-catalog.ts`; o app lê `LESSON_CATALOG`, gerado a partir
deste arquivo, e `LessonCatalogService.getTracks` alimenta ProgressScreen,
JourneyHomeScreen, home e quiz. O usuário via uma trilha chamada **"Abdome"
contendo preservação de alimentos por irradiação**.

*"Trabalho pequeno, sem decisão pendente."* Falso, e perigoso.
`JourneyDefinitionService` deriva ids de nó assim:

```
node:checkpoint:<track.slug>[:<lessonId>]   // a forma muda se lessonCount deixa de ser 2
node:reward:<track.slug>[:final]            // a forma muda se lessonCount passa de 2
```

Esses ids ficam salvos em `completedNodeIds`. **Reagrupar as lições muda a
contagem por trilha e portanto muda os ids**, órfãnando checkpoints e
recompensas já concluídos de quem já usa o app. E o `id` da primeira trilha é a
chave do progresso de jornada
(`DEFAULT_JOURNEY_TRACK_DEFINITION.id = LESSON_CATALOG.tracks[0]?.id`).

**O que foi feito:** só `title`, `goal` e `description` — display puro. `id`,
`slug`, `priority` e `lessonIds` ficaram **byte a byte intactos**, então nenhum
id de nó mudou. As trilhas passaram a se chamar *Fundamentos de Radiologia*,
*Radiação, Modalidades e Equipamento* e *Prática, Qualidade e Profissão*.

**Dívida declarada, de propósito:** os slugs seguem `fundamentos`/`torax`/
`abdome` — pinados pelo contrato em `wave-1-priority-tracks.test.mjs` e
load-bearing para id de nó. Um slug `torax` sob o título *"Radiação, Modalidades
e Equipamento"* é incoerente para quem lê o código, e invisível para o usuário.
Corrigir exige migração de progresso, que é trabalho próprio.

**Texto de produto:** os três títulos são meus, não seus. Se a redação não for a
que você quer, é troca de uma linha em `Conteúdo/governança/wave-1-priority-tracks.json`
seguida de `node scripts/content/sync-catalog-to-app.mjs`.


### 4. ~~Dívidas de teste declaradas~~ — TODAS FECHADAS em 2026-08-08

**Estado:** concluída. **Dono:** agente.

**A mordida do `eyebrow` está provada.** O segundo caso de
`PixelHeroSplit.test.tsx` afirma que a mensagem do balão **não** carrega teto de
escala, e ninguém tinha verificado que ele morde — um teste de guarda não provado
é indistinguível de um teste vazio. A mutação rodou fora de qualquer run:
`maxFontSizeMultiplier={1.5}` na mensagem do `SpeechBubble`, **1 vermelho** no
caso da mensagem e o caso do eyebrow **segue verde**, revertido em seguida. Não
exigiu mudar o produto — a dívida era a prova, não um teto.

**O número vencido caiu.** `archive/EXECUTION_STATUS_2026-08-07.md` dizia "15 ids de
taxonomia"; são **22** desde a execução do eixo técnico.

**O adjetivo sem âncora saiu.** A claim `:5` dizia "ampliação **geométrica**".
Medido nos dois excertos: o ancorado, `p54:c1`, diz apenas *"A ampliação"* e
carrega os números inteiros — 0,1 mm contra 0,3 mm, e a razão. *"Ampliação
geométrica"* aparece só em `p53:c1`, o vizinho. O núcleo se sustentava, o
adjetivo não. Removido e reancorado: 8 claims, `unanchored: 0`.

---


- ~~**autorizar o envio dos commits locais da `main`.**~~ **Caducou em
  2026-09-23:** medido na data, a `main` local não tem nenhum commit fora de
  `origin/main` (está 31 atrás, nenhum à frente); os PRs #15–#18 levaram o
  trabalho ao remoto.

  ```bash
  git fetch origin && git rev-list --count origin/main..main
  ```

---

## Lote de 2026-09-23 — piloto da lição híbrida implementado localmente

Saiu da fila quando o piloto foi implementado no branch
`feat/licao-hibrida-piloto`. Texto original; só os links relativos foram
reajustados ao novo diretório.

### AGENTE — Piloto da lição híbrida na L1 (novo em 2026-09-23)

**Estado:** desenho aprovado pelo dono em 2026-09-23
([spec](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
[ADR](../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)); nada implementado.
**Bloqueio:** nenhum. **Dono:** agente de IA em nuvem para a implementação,
pelo [prompt de handoff](../superpowers/handoffs/2026-09-23-radiant-licao-hibrida-prompt-nuvem.md)
entregue ao dono em 2026-09-23; a sessão local revisa o retorno, valida no Loop
e integra. O dono autoriza o build de teste e recruta de 3 a 5 pessoas quando
decidir. Os seis sons já foram escolhidos pelo dono em
2026-09-23 e estão em
[`radiant-app/assets/sounds/`](../../radiant-app/assets/sounds/README.md).

Próximo passo: executar o
[plano de implementação](../superpowers/plans/2026-09-23-licao-hibrida-piloto.md),
escrito em 2026-09-23, em oito tarefas: geometria do mapa, modelos com gabarito
calculado, sessão e aprovação por impressão digital, som e vibração,
interruptores no Perfil, tela e rota `/licao-hibrida` (só com
`SHOW_DEV_TOOLS`), medidas locais, e gate. O build de teste continua fora, por
decisão do dono em 2026-09-23. O critério para escalar está na §5.4 da spec.
**Substitui a v7 da L2 como próximo item de conteúdo.**

## Lote de 2026-09-23 — revisão local do piloto da lição híbrida

Item concluído pela sessão local, removido da lista de pendências do piloto:

1. **Sessão local:** revisar o retorno da nuvem, rodar `loop validate` e fechar
   o run (o Loop não existe no ambiente em nuvem).

## Lote de 2026-09-23 — piloto da lição híbrida entra na `main`

Trecho do item do piloto substituído quando o PR #24 foi mergeado, sem edição:

distribuição**, no branch `feat/licao-hibrida-piloto` (PR em rascunho contra
`docs/licao-hibrida-piloto`, não mergeado), pelo

---

## Lote de 2026-09-24 — FILA depois do PR #27

Trechos substituídos, sem edição (só os links relativos reajustados ao novo diretório):

[`superpowers/handoffs/2026-09-23-radiant-prompt-de-continuidade-2.md`](../superpowers/handoffs/2026-09-23-radiant-prompt-de-continuidade-2.md);

4. **E2E dos três caminhos dourados** — **destravado no código em 2026-09-23**;
   precisa de aparelho/simulador.
