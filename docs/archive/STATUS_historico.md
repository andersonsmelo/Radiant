# Status — histórico

O que o [`STATUS.md`](../STATUS.md) dizia antes de sair do documento vivo,
movido **sem edição** — só os links relativos foram reajustados ao novo
diretório. Serve como evidência citável; não descreve o presente.
Quando uma afirmação do `STATUS.md` deixar de ser atual, ela vem para o fim
deste arquivo no mesmo run que a substitui.

Os status datados anteriores continuam ao lado, em `EXECUTION_STATUS_*.md`.

---

## Lote de 2026-09-23 — o `STATUS.md` inteiro, em `78f96d0`

Estava com 1.319 linhas, das quais cerca de mil narravam a rejeição e a
aprovação da 1.3.1, encerradas em 2026-09-14. Os títulos abaixo foram rebaixados
dois níveis para caber neste arquivo; o texto é o original.

### Radiant — Status

**Este é o único documento de estado vivo do projeto.** O caminho
(`docs/STATUS.md`) não tem data no nome de propósito: qualquer configuração,
README ou skill que injete contexto automaticamente deve apontar para cá e para
mais nada.

O histórico datado está em [`archive/`](./) — 21 arquivos, de
`EXECUTION_STATUS_2026-04-05` a `EXECUTION_STATUS_2026-08-15`. Eles continuam
sendo a evidência de cada passagem e são citados pelos ADRs e planos. **Não
escreva um novo.** Edite este.

---

#### Como este documento envelhece

Toda afirmação abaixo tem uma **data de medição** e, quando existe, o **comando
que a remede**. Contagem escrita envelhece; comando não. Se você chegou aqui
para decidir alguma coisa, remeça antes de citar.

```bash
git rev-parse --short HEAD && git status --porcelain
git branch -a && gh pr list --state open
```

---

#### Publicação — o que está nas lojas

| Loja | Artefato | Estado | **Medido em** |
| --- | --- | --- | --- |
| App Store | `1.3.1 (11)` | 🟢 **Pronto para distribuição** — liberado pelo dono em 2026-09-14 após aprovação no mesmo dia; https://apps.apple.com/app/radiant-radiologia/id6797078156 (indexação da busca em até 24 h). Tag `v1.3.1` = `063770d` | **2026-09-14** |
| Play — alpha fechado | `1.3.0 (4)` | Ativo · lista "Radiant Alpha" com 14 usuários · lançada 31/07 15:45 | **2026-08-24** |

> 🔴 **A rejeição chegou em 14/08 às 02:54 e ficou dez dias sem leitura.** Este
> documento afirmou "Aguardando revisão" o tempo todo, porque a leitura anterior
> era de 2026-08-09 e ninguém remediu. **A medição vencida não é um detalhe de
> higiene: ela sustentou uma afirmação falsa sobre o estado do lançamento.**
>
> **A mensagem da Apple pede informações; não atesta ausência de defeitos.** É `Guideline 2.1 - Information Needed - New App
> Submission`: a Apple pede informação para conseguir avaliar. O plano de
> resposta, item a item, está em
> [`release/APP_REVIEW_REPLY_1.3.1.md`](../release/APP_REVIEW_REPLY_1.3.1.md).
>
> ✅ **O bloqueio do contrato caiu em 2026-08-24.** O titular aceitou o contrato
> de licença atualizado, e a faixa sumiu da lista de apps do App Store Connect —
> verificado onde o bloqueio se manifestava, não onde ele foi resolvido. Restam
> dois avisos, nenhum bloqueando o Brasil: **status de comerciante do DSA** (não
> informado) e as **perguntas novas de rede social** na classificação etária,
> cuja classificação já está preenchida.
>
> **Não medido:** o painel dos 12 testadores por 14 dias do Play não está exposto
> na visão geral da publicação nem na faixa; **não se sabe se o relógio começou**.

Git não substitui essa medição: a última tag é `v1.2.1`, de 2026-07-26, e `main`
está **392 commits à frente dela** (medido em 2026-08-24). Não existe tag
`v1.3.x` — o repositório não registra o que foi lançado. **O build em revisão é
anterior a toda a reformulação da trilha e do Perfil**; a próxima submissão
carrega o pacote inteiro.

#### Bloqueios de lançamento, por latência

1. **iOS** — 🔴 **rejeitado, e a bola está do nosso lado.** Decidido em
   2026-08-24: **responder com um build novo do `main`, não com o `(7)`.** O
   binário em revisão saiu de `5b2c89e` e está **138 commits atrás**; ele ainda
   carrega `src/app/modal.tsx`, o template do Expo com o texto `This is a modal`
   em inglês — passivo direto sob `2.1.0 App Completeness`, que é o código da
   rejeição. A versão `1.3.1` está em estado editável, então o build novo é
   **anexado sem cancelar o envio**. Saiu como **`1.3.1 (9)`** em 2026-08-24 — a
   primeira execução do build consumiu o `(8)` e a segunda, com `--auto-submit`,
   gerou o `(9)`, que é o que subiu (EAS numera sozinho:
   `appVersionSource: remote` + `autoIncrement`).

   **Atualizado em 2026-08-27:** o `(9)` está instalado no iPhone 16 com iOS
   27.0. A captura de uma lição comprova abertura, mas revelou um painel de
   tórax sem relação com o tema profissão. **Vídeo final e reenvio ficam
   pendentes da correção e da revisão das lições**, detalhadas na
   [auditoria de conteúdo e apresentação](../content/2026-08-27-revisao-licoes-ios.md).
   As 16 lições geradas do catálogo local também dependem de textos genéricos
   nas etapas de ensino; as 32 questões mantêm a resposta correta na primeira
   posição no percurso legado inspecionado. Não confundir esse conjunto com
   as atividades v2 promovidas.

   **Painel visual legado removido em 2026-09-08.** O primeiro achado da
   auditoria foi corrigido: `LessonVisualPanel` e o raster
   `lesson-xray-panel.png` saíram do repositório, junto das dicas globais
   `panelHint`/`panelCaption` de `LessonFlowScreen`. O painel não tinha modelo
   de mídia — era **uma** imagem fixa para toda lição —, o raster era um mockup
   com o texto em inglês `Lesson Flow: Variant 2 of 3` e `Tap to Learn`, e a
   lupa com "Toque para examinar" não tinha controle de toque atrás. Os dois
   testes que exercitavam a tela **mockavam o painel**, e foi isso que deixou a
   suíte verde com o defeito visível no `(9)`; o mock saiu e uma regressão
   afirma a ausência da afordância falsa. **Evidência medida em 2026-09-08:**
   25 suítes e 194 testes aprovados (`npx jest --runInBand src/features/lesson-flow
   src/features/journey`, em `radiant-app`), `npm run typecheck` aprovado,
   `npm run lint` com 0 erros e os mesmos 28 avisos preexistentes.
   **A lição legada fica sem elemento gráfico** até o Currículo V3 substituir
   esse caminho. **O `(9)` continua contendo o defeito** — ele é anterior a esta
   correção, então o vídeo para a App Review exige um build novo. Os demais
   achado da auditoria (texto genérico nas etapas de ensino) continua aberto.

   **Ordem das alternativas corrigida em 2026-09-08.** As 32 questões tinham a
   resposta correta na primeira posição — quem respondesse sempre "a" acertaria
   o catálogo inteiro sem ler o enunciado. O viés não estava no app: ele nasce
   em `scripts/content/generate-local-bundles.py`, atravessa
   `catalog-payload.json` intacto (32/32 com `correct: 0`) e é copiado
   fielmente por `mapQuizBundle`. A ordem passou a ser decidida em
   `scripts/content/catalog-runtime.mjs`, com permutação determinística semeada
   pelo id da questão — o ponto que **app e API compartilham**, então as duas
   cópias saem coerentes. **Distribuição medida depois:** `{0:12, 1:2, 2:11,
   3:7}` nas quatro posições, contra 32/32 antes. Três propriedades derivadas
   do payload (não de lista escrita à mão) guardam a correção: o rótulo correto
   é preservado pela permutação, as quatro posições são usadas, e a saída é
   idêntica entre execuções. Nenhuma tentativa persiste o índice escolhido
   (`LearningAttempt` guarda contagens), então não há histórico a migrar.

   **App Store Connect medido pelo dono em 2026-09-11**, com capturas de tela
   lidas nesta sessão — não presumido:
   - **Disponibilidade: 1 país (Brasil), 174 indisponíveis.** Os "172 países"
     citados em 24/08 eram a agrupação da **classificação etária**, não a
     disponibilidade; o app nunca esteve à venda fora do Brasil. Decisão do
     dono: lançar só no Brasil e expandir depois. **O aviso de comerciante do
     DSA perde o objeto** — é de conta, não do app, e só alcança quem
     distribui na UE. Se um dia entrar país da UE (Portugal incluído), a
     declaração passa a ser exigida.
   - **Classificação etária: os 7 passos percorridos, nenhuma pergunta em
     branco, `Salvar` desabilitado por ausência de mudança.** Calculada +13,
     Brasil A12, sem substituição. A única resposta fora de "nenhum" é
     *Informações médicas ou sobre tratamentos: pouco frequente* — coerente
     com o item 7 da resposta à Apple ("educacional, não diagnostica").
     *Competições: nenhum*, coerente com a decisão de 2026-08-15 de não
     comparar alunos. Recursos, UGC, redes sociais, web irrestrita: não.
   - **As 6 capturas da página do produto mostram o painel visual removido em
     2026-09-08** (raio-X de tórax, "Observe a cena com calma", "Compare
     densidade, borda e contexto anatômico"). Com o build novo, a página
     prometeria uma tela que o binário não tem — diretriz 2.3.3. **Trocar as
     capturas é pré-requisito do reenvio**, na mesma sessão de aparelho que
     grava o vídeo. 0 de 3 pré-visualizações; não é pendência.
   - **Direitos de conteúdo** em *Informações do app*: "Sim, este app tem os
     direitos necessários para os conteúdos de terceiros" — a declaração que
     a resposta ao item 7 precisa respeitar.

   Com isso a tarefa "serviços e privacidade" fecha: Sentry medido inerte em
   2026-09-08, disponibilidade e classificação confirmadas em 2026-09-11.

   **Configuração mínima do Sentry fixada em 2026-09-22** (Task 8, fatia 1 de 6).
   `buildSentryOptions` é função pura: sem PII, sem rastreamento de desempenho,
   sem quadros nativos, `maxBreadcrumbs: 20`, `beforeSend` removendo `user`,
   `server_name` e nome de aparelho, e `beforeBreadcrumb` descartando migalhas
   `console`/`xhr`/`fetch`. O contrato de privacidade passou a garantir por AST
   que o SDK é inicializado num ponto só e sempre por essa função.
   **Evidência medida em 2026-09-22:** 6 suítes e 41 testes de telemetria
   aprovados; guarda derrubada de propósito em duas formas (init por objeto
   literal e segundo init em outro arquivo) e verde de novo ao restaurar.

   **Checklist de declarações à loja preparado em 2026-09-22** (Task 8, fatia 5
   de 6): [`release/CHECKLIST_DECLARACOES_1.4.md`](../release/CHECKLIST_DECLARACOES_1.4.md).
   Medição que o sustenta: o ambiente `production` do EAS tem **uma única
   variável**, o DSN do Sentry — sem `EXPO_PUBLIC_API_BASE_URL` e sem
   `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`, as três portas de saída (Sentry, API,
   sync) estão fechadas por construção. **Nada sai do aparelho num build de
   produção da 1.4 como ela está hoje.** As linhas de assinatura do checklist
   estão bloqueadas até o adaptador StoreKit existir.

   **Caminho do adaptador StoreKit decidido pelo dono em 2026-09-23** (Task 8,
   fatia 2): **módulo Expo local em Swift, sem `expo-iap`**, registrado em
   [ADR](../adr/ADR-2026-09-23-storekit-modulo-expo-local.md), com a spec §6, o
   plano e o checklist emendados. O motivo é o da própria spec: nenhum terceiro
   no caminho da compra. Medido na data: `expo-iap` `5.6.3`, com 249 versões e 5
   majors, embarca o SDK OpenIAP. O `package.json` não muda com esta decisão.

   **Adaptador StoreKit implementado em 2026-09-23, sem build** (Task 8, fatia
   2): `StoreKit2Adapter` atrás da `StoreKitPort`, módulo Swift
   `radiant-app/modules/radiant-storekit/` e ligação no `SubscriptionService` e
   na abertura. **Medido em 2026-09-23:** `EXPO_NO_DOTENV=1 npm run quality` no
   Node 20.20.2 → exit 0, **132 suítes / 1163 testes**; 26 execuções vermelhas
   do Jest registradas, cada uma com o defeito específico reintroduzido; o
   Swift passou em `swiftc -typecheck` (modos 5 e 6) contra o SDK do iOS **com
   stub do ExpoModulesCore** — ou seja, **nunca compilou contra o Expo real**.
   Dois defeitos achados e corrigidos: os Product IDs do serviço eram os do
   `PaywallPlan` (`monthly_plus`/`annual_plus`), não os da ADR; e reembolso
   mantinha as vidas ilimitadas até o fim do período, porque
   `currentEntitlements` omite a transação reembolsada. **Aberto:**
   `willRenew` sem rede não está medido. O Ask to Buy recusado, que prendia o
   cartão e a tela no pendente, foi **corrigido em 2026-09-23** por decisão do
   dono: planos e Restaurar sempre visíveis, e aviso de pendente por 24 h.
   Gate medido na mesma data, Node `v20.20.2`: saiu 0, com 133 suítes e 1174
   testes, e Visual QA sem regressão. Vermelhos em
   [`2026-09-23-radiant-ask-to-buy-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-ask-to-buy-vermelhos.md). **Comitado em
   2026-09-23 (`000daef`)**, **empurrado no [PR #17](https://github.com/andersonsmelo/Radiant/pull/17)** e **mergeado na
   `main` em `18a2789`** na mesma data, junto
   dos kill switches, da privacidade do analytics e do Ask to Buy; **não
   construído**. **Gate reproduzido por outra sessão** em
   2026-09-23, numa worktree limpa em `000daef`, Node `v20.20.2`:
   `EXPO_NO_DOTENV=1 npm run quality` saiu 0, com 132 suítes e 1163 testes, e
   Visual QA sem regressão — os mesmos números do autor.
   [Relatório](../superpowers/handoffs/2026-09-23-radiant-1-4-storekit-fatia-2-relatorio.md).
   As fatias 3 e 4 estão destravadas no código; a validação da fatia 2 espera
   build interno e sandbox.

   **Fatia 3 implementada em 2026-09-23, sem build** (branch
   `feat/quiztopbar-infinito`, aberta de `0b0283e`; comitada em `647b2c3` na
   mesma data, com autorização do dono): o `QuizTopBar` troca os
   corações por ∞ quando `HeartsSnapshot.status === 'unlimited'`, e a
   `LessonFlowScreen` repassa esse estado. A fonte é o snapshot das vidas, não
   o `SubscriptionStatus`, por decisão do dono. **Medido em 2026-09-23**, Node
   `v20.20.2`: `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **133 suítes / 1178
   testes**, Visual QA sem regressão. Vermelhos, com três mutações, em
   [`2026-09-23-radiant-quiztopbar-infinito-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-quiztopbar-infinito-vermelhos.md).
   **Achado na mesma data:** a folha de vidas das três telas tinha
   `storeAvailable={false}` fixo, então nunca oferecia a assinatura. Ver
   [relatório](../superpowers/handoffs/2026-09-23-radiant-quiztopbar-infinito-relatorio.md).

   **Folha ligada à loja em 2026-09-23, sem build** (comitada na branch
   `feat/folha-vidas-loja`, aberta de `647b2c3`, e na `main` pelo PR #18 →
   `8972cbc`; o dono decidiu que entra na 1.4): Lição, Checkpoint e Jornada oferecem "Ver assinatura" quando
   `subscriptionService.storeAvailable()` diz que o binário tem o módulo da
   loja — pergunta local, sem StoreKit nem rede — e o botão abre
   `/subscription`. Lição e Checkpoint releem as vidas a cada foco: voltando da
   compra, ∞ e sem bloqueio. **Medido em 2026-09-23**, Node `v20.20.2`:
   `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **133 suítes / 1190 testes**,
   Visual QA sem regressão. Seis mutações vistas vermelhas em
   [`2026-09-23-radiant-folha-vidas-loja-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-folha-vidas-loja-vermelhos.md).
   Divergência da spec §98 (motivo do offline na folha) no
   [relatório](../superpowers/handoffs/2026-09-23-radiant-folha-vidas-loja-relatorio.md).

   **Duas fontes de vidas — o Perfil e a recompensa passaram para a fonte
   viva em 2026-09-23** (branch `claude/sharp-dijkstra-747d12`, sobre
   `feat/quiztopbar-infinito` em `0b0283e`; integrada localmente em
   `integ/vidas-1-4` na mesma data; **não construído**).
   Medido na data: a seção **Vidas** do Perfil (`MissionsScreen` embutida) e o
   HUD do `RewardScreen` (`/reward`, alcançável pelos nós de recompensa da
   trilha) liam o contador legado do `GamificationService`, que o caminho vivo
   nunca desconta — mostravam sempre 5 e nunca ∞. Agora os dois leem
   `heartsRepository.getSnapshot(Date.now())`: assinante vê **∞** e
   "Assinante: ilimitadas" sem corações, relógio nem aviso (spec §5.1
   ILIMITADA e §3.5 Perfil); o aviso de bloqueio segue o `status` `'empty'`, não
   a contagem; e nenhum coração é desenhado antes da leitura. **Gate medido em
   2026-09-23**, Node `v20.20.2`: `EXPO_NO_DOTENV=1 npm run quality` saiu 0,
   **134 suítes / 1181 testes**, lint 0 erros / 26 avisos, Visual QA sem
   regressão. Vermelhos em
   [`2026-09-23-radiant-perfil-vidas-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-perfil-vidas-vermelhos.md).
   O contador legado foi **aposentado na mesma data**, em run próprio, como o
   dono decidiu: ver o parágrafo do [PR #20](https://github.com/andersonsmelo/Radiant/pull/20) abaixo.
   Enumeração e o que a aposentadoria exige no
   [relatório](../superpowers/handoffs/2026-09-23-radiant-perfil-vidas-relatorio.md);
   backup no iCloud e migração 1.4 **não leem** os campos.

   **As quatro fatias de vidas integradas localmente em 2026-09-23** na branch
   `integ/vidas-1-4` (`b81a91d` + merges de `1ab8bc8` e `01ac4e7`; conflitos só
   em FILA e STATUS). **Medido na árvore combinada**, Node `v20.20.2`:
   `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **134 suítes / 1212 testes**,
   Visual QA sem regressão — a soma exata do que cada fatia mediu sozinha.
   O CI da PR #18 reprovou o **primeiro** teste de
   `LessonFlowScreen.flow.test.tsx` por custo de estreia (~450 ms) dentro do
   prazo de 1000 ms do `findByText` — fragilidade anterior, reproduzida 3/3
   com a CPU limitada (`taskpolicy -b`) e corrigida com um aquecimento em
   `beforeAll`; detalhes no relatório.
   **Não construído.** Mergeada na `main` na mesma data pelo
   [PR #18](https://github.com/andersonsmelo/Radiant/pull/18) → `8972cbc`,
   depois dos PRs #15, #16 e #17 (`9acd2f5`, `b77547f`, `18a2789`); CI
   `quality` verde no PR (no `b36a398`) e na `main` depois do merge (run
   35885988196).
   [Relatório](../superpowers/handoffs/2026-09-23-radiant-integracao-vidas-relatorio.md).

   **Contador legado de vidas aposentado em 2026-09-23, sem build** — na
   `main` pelo [PR #20](https://github.com/andersonsmelo/Radiant/pull/20) →
   `2e62fc9`, CI verde no PR e na `main` depois do merge (run
   35909283648); branch original `refactor/aposenta-vidas-legado`: a `/quiz` lê e gasta
   pelo `heartsRepository`, com ∞ para assinante; a Home e a Jornada deixaram
   de ler o `GamificationService` para vidas; o serviço e os tipos perderam
   os campos e métodos de vidas. O blob gravado pela 1.3.1 mantém os campos
   antigos, intocados. **Medido na data**, Node `v20.20.2`:
   `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **134 suítes / 1224
   testes**; com a CPU limitada (`taskpolicy -b`), os 13 arquivos de teste
   alterados passam. [Relatório](../superpowers/handoffs/2026-09-23-radiant-aposenta-vidas-legado-relatorio.md).

   📌 **O defeito aberto do `ENABLE_REMOTE_SYNC` é inerte em produção.** Ele não
   desliga o `AuthService`, que decide por `isApiConfigured()` — verdade, e sem
   efeito, porque `API_BASE_URL` não existe no ambiente submetido. Continua
   aberto; deixa de ser inerte no dia em que uma URL de API entrar lá.

   ✅ **O `HUD` não mostra mais corações ao lado do ∞** — achado da fatia 3,
   **corrigido em 2026-09-23, sem build** — na `main` pelo PR #18
   (`8972cbc`); originalmente no branch
   `fix/hud-infinito` (aberto de `0b0283e`). No estado `unlimited` o cabeçalho
   de Trilha, Checkpoint e Revisão mostra só o ∞, como pede a spec (§5.1,
   "corações somem"). **Defeito a mais, achado no caminho:** Checkpoint e
   Revisão não passam `onHeartsPress`, e ali o rótulo "Vidas ilimitadas" não
   existia — o leitor de tela anunciava "5 de 5 vidas" ao assinante. Agora o ∞
   carrega o rótulo com ou sem botão; a Trilha mantém o botão que abre a folha.
   **Medido em 2026-09-23**, Node `v20.20.2`, worktree limpa:
   `EXPO_NO_DOTENV=1 npm run quality` → exit 0, **133 suítes / 1189 testes**,
   Visual QA sem regressão. Vermelhos e sete mutações em
   [`2026-09-23-radiant-hud-infinito-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-hud-infinito-vermelhos.md);
   [relatório](../superpowers/handoffs/2026-09-23-radiant-hud-infinito-relatorio.md).

   ⚠️ **Isso não liga nada.** `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` continua sem
   valor e o `Sentry.init` não roda, então o rótulo "Dados não coletados" segue
   verdadeiro. A fatia fixa o que sairia do aparelho **se** a flag for ligada —
   é a base factual para revisar as Privacy Labels, e ligar continua sendo
   decisão do dono.

   > 🔴 **A primeira versão da guarda era vazia e passava com
   > `sendDefaultPii: true`.** Ela usava regex sobre o fonte e casava com a
   > menção da opção num **comentário**. Só apareceu porque a guarda foi
   > derrubada de propósito depois de escrita, e o arquivo que a recebeu já
   > dizia, desde antes, que o contrato usa AST justamente para ignorar
   > comentários e strings. **Guarda nunca vista falhar não é guarda.**

   **Item 7 (direitos e setor regulado) decidido pelo dono em 2026-09-11.** A
   única fonte dos 16 quizzes embarcados, *Fundamentos de Radiologia*, estava
   `blocked` desde 2026-07-31 "até revisão humana", sustentada por uma exceção
   datada que venceria em **2026-09-30** — e o vencimento faria
   `validate-source-rights` reprovar e nenhum run fechar. A revisão humana
   aconteceu: a obra passou a `reference-only` / `factual-reference` em
   `Conteúdo/fontes/library-catalog.json`, com base medida (zero sequências de
   8 palavras, nenhuma imagem de terceiro, redação original), e a exceção foi
   encerrada. O validador passa sem exceção. As 32 explicações foram lidas
   uma a uma: nenhuma linguagem de orientação clínica ao leitor. O texto final
   em inglês está no [plano de resposta](../release/APP_REVIEW_REPLY_1.3.1.md),
   item 7. **Nota de domínio, fora do escopo da Apple:** a explicação sobre
   proteção gonadal descreve a prática clássica; a recomendação internacional
   (AAPM, 2019) desaconselha a proteção rotineira — entra na revisão de
   conteúdo por tema.

   **Build `1.3.1 (10)` gerado, enviado e testado em 2026-09-11.** Saiu de
   `main` = `321ebec`, de um checkout limpo (`~/Developer/Radiant-release`),
   sem nada não-commitado; EAS `ca376ed8`, `--auto-submit`, aceito pela Apple.
   No iPhone 16 / iOS 27.0: abre, lição inteira concluída com 3 estrelas,
   progresso da unidade avançou (5 de 14). **Mas o `(10)` não é o binário do
   reenvio.** O primeiro quadro da gravação mostrou, no fim do Perfil, o
   cartão *Conta e sincronização* com o formulário de login inteiro — Email,
   Senha, Token, *Entrar para sincronizar*, *Criar conta*, *Solicitar reset* —
   **inerte**: `remoteSyncAvailable` travava os handlers, não a renderização, e
   a suíte da tela rodava inteira com sync ligado, então a configuração de
   produção nunca fora renderizada por teste. Contradiz o item 4 da resposta
   ("no account, login, or credentials") e é a hipótese mais forte para o
   "Information Needed" original. **Corrigido em 2026-09-11**: o cartão some
   quando o sync remoto não está disponível; teste com a configuração de
   produção afirma a ausência de todos os controles e a permanência da ajuda
   legal (4 suítes, 22 testes; `tsc` limpo; lint 0 erros). A gravação de
   17,8 s também não serve como vídeo do item 1 — começa dentro do app. **O
   reenvio sai do `(11)`**, com vídeo e capturas gravados dele.

   **Decisão de produto em 2026-09-11 (dono):** login e assinatura são feature
   da **1.4**, desenhada junto — backend em produção, conta de demonstração,
   exclusão de conta (5.1.1(v)), Privacy Labels refeitas e In-App Purchase se
   houver plano pago. Não entram no reenvio da 1.3.1. Merece ADR quando o
   desenho começar. Também decidido: **V3 vira 1.4**; o reenvio agora leva o
   app legado corrigido.

   **Build `1.3.1 (11)` verificado no aparelho em 2026-09-11, 19:14.** Saiu de
   `main` = `063770d`, do mesmo checkout limpo; EAS `7c18e187`, aceito pela
   Apple. No iPhone 16 / iOS 27.0, por captura: o Perfil vai de *Tópicos*
   direto a *Ajuda e informações* — **o cartão de conta sumiu**; o cabeçalho
   diz "Estudo local, sem conta". **A atualização `(10)` → `(11)` preservou o
   histórico local** (38 XP, 3 lições, 2 revisões, iguais aos do `(10)`) — a
   primeira medição de atualização entre builds neste projeto. **Este é o
   binário do reenvio.** O que falta é só de aparelho: o vídeo do item 1 numa
   tomada única a partir da tela inicial do iOS (os três clipes de hoje têm
   7–18 s e começam dentro do app) e as 6 capturas para a página do produto.

   **Reenviado à App Review em 2026-09-12, pelo dono.** Build **`1.3.1 (11)`**
   anexado à versão rejeitada (estado editável, sem cancelar o envio). Vídeo
   do item 1: gravação contínua de 32 s no iPhone 16 / iOS 27.0, da tela
   inicial do iOS à aba Perfil, passando por boas-vindas ("Funciona offline,
   sem conta" + aviso educacional), lição completa, três estrelas e trilha —
   quadros verificados em tempos exatos, não pela miniatura. Seis capturas
   novas na página do produto (trilha, conclusão, "sem conta", lição,
   checkpoint, perfil), sem painel e sem formulário; tiradas do `(11)` abertas
   pela tela inicial, sem o indicador do TestFlight na barra. Campo *Notes*
   com o bloco dos 7 itens (3.945 caracteres). Material consolidado em
   `~/Desktop/Radiant - reenvio 1.3.1 (11)/`, fora do repositório. **Próxima
   medição: o status da versão no App Store Connect** — não inferir de e-mail
   nem de TestFlight. Enquanto a revisão correr, não alterar disponibilidade,
   classificação etária ou Privacy Labels.

   **Correção em 2026-09-13: o parágrafo acima estava errado — em 12/09 houve a
   resposta ao revisor, não o reenvio.** No App Store Connect, responder à
   mensagem e reenviar para revisão são ações separadas, em páginas
   diferentes; o roteiro do agente as apresentou como uma sequência e o
   segundo passo não foi executado. A Apple respondeu em 13/09 às 07:34:
   *"unable to proceed … status is currently 'Prepare for Submission'. You
   will need to submit a new build for review"* — frase padrão; o `(11)` já
   estava vinculado e nenhum build novo foi necessário. O console mostrava
   *Envio do iOS · Problemas não resolvidos · build (11) · Pronto para
   revisão* e o botão **Reenviar para Revisão do app** ainda visível — isto
   é, preparado e não enviado. O dono clicou em **Reenviar para Revisão do
   app** em 2026-09-13 e o cabeçalho da versão passou a **Aguardando
   revisão**, medido na tela. Este é o momento em que a Apple recebeu o
   `(11)`. Evidência da coleta de 13/09 (relatório da sessão Codex) em
   `~/Desktop/Radiant - evidências Apple 2026-09-13/`, fora do repositório.

   **Aprovado em 2026-09-14.** Dois e-mails do App Store Connect, 17:40 e
   17:41 BRT: *"Review of your submission has been completed. It is now
   eligible for distribution"* (Submission ID
   `93758050-6a5b-42d5-957c-575224b14fbb`, item aceito *1.3.1 for iOS*) e
   *"Welcome to the App Store … approved for distribution"*. Link:
   https://apps.apple.com/app/radiant-radiologia/id6797078156. **A aprovação
   não é a publicação:** se a versão estiver em *Pendente de lançamento pelo
   desenvolvedor*, falta o botão *Lançar esta versão*; se estiver em *Pronto
   para venda*, a loja indexa em até 24 h. Medir no console antes de afirmar
   "no ar". Linha do tempo: rejeição 14/08 → correções 08–11/09 (painel,
   ordem das alternativas, cartão de login) → `(11)` 11/09 → resposta 12/09 →
   reenvio efetivo 13/09 → aprovação 14/09. O que a Apple aprovou é o app
   legado corrigido; **V3, login e assinatura são a 1.4**. Ao publicar,
   marcar `v1.3.1` no git — a última tag é `v1.2.1`, e o repositório não
   registra o que foi lançado desde então.

   **Liberado em 2026-09-14.** A versão estava em *Liberação do desenvolvedor
   pendente*; o dono clicou em *Liberar esta versão* e o console passou a
   **Pronto para distribuição** (captura lida nesta sessão). As 6 capturas
   novas e o texto promocional ("Funciona offline e sem login") conferidos na
   mesma tela. **Tag `v1.3.1` criada em `063770d`** — o commit de que o
   binário `(11)` foi construído, não o HEAD dos documentos. Primeira tag
   desde `v1.2.1` (2026-07-26). Sem push; a tag é local até alguém decidir.

   O bloqueio nº 1 desta lista — iOS — **fecha aqui**. O que segue é outra
   fase: revisão de conteúdo por tema, e a 1.4 (V3 + login/assinatura).

   **1.4 desenhada em 2026-09-14 — fluxo do usuário e padrão de robustez.**
   Spec aprovada seção a seção pelo dono:
   [`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](../superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md).
   Dez decisões, entre elas: freemium por **vidas** (5, +1 a cada 30 min,
   revisão nunca consome, assinante ilimitado); **trilha soberana** (o motor
   `NextNodeResolver` escolhe o nó: pausada > revisão devida > checkpoint >
   próxima lição); **assinatura por StoreKit 2 direto**, sem trial, sem
   terceiro; **backup no iCloud** em vez de conta própria; **Sentry ligado**
   com rótulo "Dados de falha, não vinculados". Regra de ouro: toda tela de
   estudo funciona sem rede, sem conta e sem assinatura — as frases aprovadas
   pela Apple continuam verdadeiras. Fora desta spec, com spec própria: V3 na
   tela (J3–J5), sistema de desenho. Do dono, fora do app: acordo de apps
   pagos no App Store Connect (obrigatório antes de submeter a 1.4) e o preço.
   **Planejamento iniciado em 2026-09-14.** O plano executável está em
   [`2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`](../superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md),
   medido contra a spec, o checkout `6e7f804` e a política de escrita do Loop.
   Serviços puros vêm primeiro; os adaptadores nativos de StoreKit/iCloud ficam
   atrás de build interno e ações do dono. Nenhum build, envio ou publicação foi
   autorizado por este plano.

   **Task 1 concluída localmente em 2026-09-14:** `NextNodeResolver` implementa
   os quatro degraus da spec com relógio injetado e nenhum IO. A suíte focada
   passou com 9/9 casos; a ligação ao snapshot da trilha permanece para a Task 3.

   **Task 2 concluída localmente em 2026-09-14:** a economia de vidas agora tem
   serviço puro e repositório serializado, com persistência restrita a `count`,
   `lastRefillAt` e `unlimitedUntil`. A matriz focada passou com 18/18 casos,
   incluindo relógio reverso, salto à frente, expiração e concorrência.

   **Task 3 concluída localmente em 2026-09-14:** o snapshot delega a escolha
   soberana ao resolver, preserva `nextRecommendedNode`, carrega o vencimento
   real do SM-2 e persiste o passo de retomada. Typecheck e 25/25 testes focados
   passaram. A ligação da rota resolvida às telas/notificações fica nas tarefas
   de superfície, sem ativar push nem currículo novo aqui.

   **Task 4 concluída localmente em 2026-09-14:** a abertura agora migra o
   progresso pedagógico v1.3.1 antes dos demais serviços, grava backup antes da
   primeira mutação, recupera interrupções e mantém autenticação fora do escopo
   migrado. Falha recuperável abre o modo local com aviso do Pixel; somente
   migrações acima de um segundo exibem progresso detalhado. Typecheck, lint e
   28/28 testes focados passaram; nenhum adaptador nativo foi ativado.

   **Task 5 concluída localmente em 2026-09-14:** a trilha soberana agora é uma
   `FlatList` de bandas e nós com chaves estáveis; revisão devida e retomada
   explicam o motivo do próximo nó. O HUD lê as vidas do repositório próprio,
   mostra recuperação ou infinito e abre uma folha modal com Esperar, Revisar e
   Assinar conforme disponibilidade. Carregamento, falha recuperável e fim do
   conteúdo têm estados explícitos. Typecheck, lint e 54/54 testes focados
   passaram; K4 permanece aberta até os fluxos de estudo da Task 6.

   **Task 6 concluída localmente em 2026-09-14:** respostas erradas debitam
   uma vida somente na confirmação, com proteção contra toque duplo; ao zerar,
   lição e checkpoint pausam sem perder o ponto seguro de retomada. Revisões
   continuam gratuitas e devolvem uma vida uma única vez por sessão concluída.
   O resumo informa a próxima revisão agendada, e as ofertas antigas foram
   retiradas das conclusões de checkpoint e conquista. Typecheck, lint e 50/50
   testes focados passaram; nenhuma compra, módulo nativo ou build foi ativado.

   **Task 7 concluída localmente em 2026-09-14:** a assinatura e o backup
   entraram como contratos atrás de portas injetáveis (`StoreKitPort`,
   `PrivateCloudPort`); o adaptador padrão de cada uma responde
   `store-unavailable`/`cloud-unavailable` e não finge integração nativa. O
   direito de uso vale offline pelo cache até a data; vencido, expirado ou
   reembolsado volta a CHEIA, nunca a VAZIA; Ask to Buy fica pendente; a
   restauração recupera o direito. O backup mescla sem apagar (união de
   concluídos por trilha, agenda mais recente por nó, maior XP e sequência,
   `lastRefillAt` mais recente) e nuvem vazia nunca substitui o local. A tela
   `/subscription` cobre carregando, loja indisponível, pendente, assinante,
   restaurada e cancelada, com preço e período só da porta, renovação,
   Restaurar compras, termos, privacidade e cancelamento nos Ajustes. O Perfil
   ganhou os cartões Assinatura e Backup no iCloud e deixou de receber e-mail
   de sessão. Medido em 2026-09-14 com `npx jest --runInBand` (9 suítes novas
   ou alteradas, 72 testes; lição 17/17 e checkpoint 23/23), `npx tsc --noEmit`
   e ESLint sem avisos nos arquivos de produção. Nenhuma compra, módulo
   nativo, iCloud, Sentry ou build foi ativado; `expo-iap` não foi instalado.

   **Correção pós-Task 7 e Task 8 bloqueada, em 2026-09-14:** `refresh` da
   assinatura deixou de tocar as vidas de quem não assina (chamava
   `setUnlimited(null)`, que devolve o estado cheio — a cada abertura, todo
   aluno grátis teria vidas cheias); a abertura passou a reler o direito de uso
   e a tentar restaurar o backup sem bloquear o Stack. Run
   `run-1789431458242-28d4efde`, 14/14, 68 testes nas suítes tocadas. A **Task 8
   não foi iniciada**: nenhum gate humano estava disponível (autorização de
   build interno, acordo de apps pagos, ids/preços, entitlement iCloud +
   credencial EAS, DSN Sentry); `expo-iap` não foi instalado e `package.json`,
   `app.json` e `eas.json` seguem em `1.3.1`, sem alteração (`git status`). O
   relatório da sessão, com pendências, suposições e achados, está em
   [`superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md`](../superpowers/handoffs/2026-09-14-radiant-1-4-relatorio-execucao.md).

   **Revisão independente do relatório em 2026-09-14 (sessão distinta da
   executora), no `HEAD` `569bdad` da branch `codex/radiant-1-4`.** Gates
   reproduzidos, não copiados: **125 suítes / 958 testes verdes** (a suíte
   inteira; o relatório citava só as tocadas), `tsc --noEmit` exit 0, ESLint
   0 erros / 24 avisos (eram 28 na 1.3.1). Regras do prompt cumpridas: branch
   própria, `main` intocada em `6e7f804`, sem push, sujeira do V3 intacta.
   Conferido no código: o motor decide a trilha
   (`JourneyProgressService.computeSnapshot` → `JourneyRecommendationService`
   → `NextNodeResolver`); vidas descontadas na lição e no checkpoint;
   `setUnlimited(null)` só em comentário; trilha virtualizada; folha de vidas
   nas três telas **sem saída para a loja**; `/subscription` só pelo Perfil;
   `backupNow` sem chamador; `expo-iap` ausente. **Nenhuma afirmação do
   relatório contradiz a medição.** Duas notas além dele: `GamificationService`
   ainda persiste `hearts` legados ao lado do `HeartsRepository` (duas fontes
   para o mesmo conceito — aposentar antes da migração seguinte; *resolvido:
   aposentado em 2026-09-23 pelo PR #20, `2e62fc9`, ver o bloco da 1.4
   acima*); e o cartão
   antigo de conta segue em `ProgressScreen`, condicionado e invisível em
   produção — código morto, não regressão. Estado prático: a 1.4 na branch tem
   motor, vidas, migração e telas; **não vende nem faz backup** até a Task 8,
   que depende dos quatro gates do dono (acordo de apps pagos → produto e
   preço → DSN do Sentry → entitlement do iCloud). Recomendado: fast-forward
   de `main` para `569bdad` e um build interno (`preview`) para ver vidas e
   motor no aparelho antes do trabalho nativo.

   **Slice CloudKit da Task 8 implementado em 2026-09-15**, na branch
   `feat/1-4-cloudkit-private-backup`, aberta de `origin/main` em `b3b4c46`.
   StoreKit e Sentry ficaram fora desta execução, de propósito. Relatório
   completo em
   [`superpowers/handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md`](../superpowers/handoffs/2026-09-15-radiant-1-4-relatorio-cloudkit.md).

   **Estado atual confirmado em 2026-09-16:** o
   [PR #14](https://github.com/andersonsmelo/Radiant/pull/14) foi mergeado pelo
   dono às 19:56:53 (−03). `origin/main` está no merge commit
   `f5d96019b4db4a41f3258360773bd7da35a657ed`, contendo o head documental
   `3494682229561e9e73ca4ef1711d3427fefd7a93` e a correção `lastBackupAt`
   de `45d465`. O [CI pós-merge da main](https://github.com/andersonsmelo/Radiant/actions/runs/35160079444)
   (`Radiant App Quality`, evento `push`, checkout limpo desse merge commit)
   concluiu com **SUCCESS**, incluindo o Quality gate. Passagens 1 e 2 seguem
   **PASS funcional** no build físico anterior; a correção de `lastBackupAt`
   segue coberta por testes/CI, mas não validada em aparelho. A causa histórica
   exata continua não comprovada. Merge não equivale a build, deploy ou submit:
   nenhum desses foi realizado nesta verificação. Os registros abaixo são
   evidência histórica das etapas anteriores, não o estado atual do PR.

   Gates medidos em **2026-09-15** (número corrigido depois; ver o bloco do CI
   adiante): **119 suítes / 979 testes verdes** no conjunto rastreado, contra
   **117/916** em `origin/main`, `tsc --noEmit` exit 0, ESLint 0 erros / 24 avisos — mesmo número de
   avisos da baseline. Remedir com:

   Remedir com o **gate real**, que é o mesmo comando que o CI executa — não
   `npx jest` solto, que roda em paralelo, ignora os 15 contratos e, na árvore
   suja, conta arquivos que o repositório remoto não tem:

   ```bash
   cd radiant-app && nvm use 20 && EXPO_NO_DOTENV=1 npm run quality
   ```

   O que entrou: entitlements do container `iCloud.com.ascendcreative.radiant`
   com serviço `CloudKit` em `expo.ios.entitlements`, guardados por contrato
   estático que também afirma as **ausências** (sem iCloud Documents, sem
   ubiquity, sem `icloud-container-environment` fixado);
   `CloudKitPrivateAdapter` atrás do `PrivateCloudPort` com os sete estados de
   erro degradando para local; módulo Expo local em Swift
   (`radiant-app/modules/radiant-cloudkit`), **sem nenhuma dependência npm
   nova**; `backupNow()` ligado à conclusão de nó em
   `JourneyProgressService.markNodeCompleted`.

   🔴 **Um defeito de perda silenciosa foi corrigido, e vale registrar porque
   não aparecia em teste nem em log.** `restoreOnLaunch` corria no `Promise.all`
   do bootstrap enquanto `LocalProgressAdapter.applyJourney` só mescla trilhas
   já presentes no storage, e `JourneyProgressService.bootstrap()` só era
   chamado ao terminar as boas-vindas. Em **instalação nova** — o único caso em
   que o backup serve — os nós concluídos restaurados eram descartados sem erro,
   enquanto XP, sequência e agenda voltavam: restauração pela metade com
   aparência de sucesso. Agora o restore encadeia depois da hidratação, por
   dependência real e não por atraso.

   **Três gates humanos seguem abertos e nenhum é meu:** (1) regenerar o
   provisioning profile, que a Apple invalidou ao habilitar a capability iCloud
   (`eas credentials -p ios` → perfil → Build Credentials); (2) autorização
   datada para um build interno; (3) **Deploy Schema to Production** no CloudKit
   Console, obrigatório antes da submissão da 1.4 — o CloudKit cria schema
   automaticamente só em Development, e pular isso produz um app aprovado que
   escreve num schema inexistente, falhando apenas em produção e de forma
   silenciosa.

   ⚠️ **Superado em 2026-09-15 pela validação física — ver o bloco adiante.** O
   texto original desta linha dizia que nenhuma linha do Swift havia sido
   compilada; isso deixou de valer quando o build interno rodou no iPhone.

   ✅ **VALIDADO NATIVAMENTE em 2026-09-15, com defeito encontrado.** Medido em
   iPhone físico pelo dono: capability iCloud habilitada no App ID
   `com.ascendcreative.radiant`, container `iCloud.com.ascendcreative.radiant`,
   provisioning Ad Hoc regenerado, iPhone registrado, build interno EAS
   `45abf4fd-a765-4c1d-94d3-1de5bda3db4f` instalado, schema `ProgressBackup`
   implantado em **Production**. O módulo Swift **compilou e executou**; escrita
   e leitura reais no CloudKit funcionaram.

   🔴 **O teste de instalação limpa reprovou.** Com XP 100, trilha 11/14 e
   backup ligado, apagar o app e reinstalar o mesmo build devolveu: backup
   desligado, XP 0, trilha 0/14, sem restauração automática. Ligar o interruptor
   à mão trouxe XP, sequência e trilha de volta — o que **prova que o registro
   remoto estava íntegro** e que `pull`, merge e `apply` funcionam. O defeito era
   o **gatilho**, não o backup.

   **Causa raiz:** `parseState(null)` devolvia `{enabled:false}`, idêntico ao
   estado de quem desligou de propósito, e `executarRestore` retornava antes do
   `pull` nos dois casos. A prova já estava no repositório e estava **verde**: o
   teste `desligado, não toca a nuvem nem o local` usava storage vazio — que é
   literalmente uma instalação limpa — e afirmava que a nuvem não é consultada.

   **Corrigido em 2026-09-15** (commit `4d0036e`): `BackupState` ganhou
   `decided`, e a decisão de opt-in passou a morar no **registro remoto**
   (`backupEnabled`), único lugar que sobrevive ao uninstall; ausente significa
   ligado, por compatibilidade. O campo viaja dentro do payload JSON, que o
   módulo nativo trata como string opaca — **zero mudança em Swift**. Desligar
   passa a marcar `false` remoto preservando o payload.

   🔴 **REPROVADO EM APARELHO em 2026-09-15, na segunda validação física.** O
   build interno `b86cb497-0a7c-4b12-9437-e5feaa3046a5`, gerado do commit
   `460b398` — que **continha** a correção do opt-in remoto —, falhou no mesmo
   ponto: apagar, reinstalar e abrir sem tocar em nada devolveu backup OFF,
   "Nenhum backup ainda", XP 0 e trilha 0/14. **Nenhum restore automático.**

   **O que a mesma sessão provou estar funcionando.** No mesmo app aberto, sem
   reinstalar e sem reiniciar, ligar o interruptor à mão restaurou tudo na hora:
   XP 100, sequência 1 dia, trilha 11/14, próximo passo checkpoint, backup às
   21:08. Portanto estão comprovados em aparelho: acesso ao container, CloudKit
   privado, registro remoto íntegro, módulo nativo, `pull`, merge, `apply` e
   atualização da UI. **O defeito restante está no caminho automático de
   abertura**, não no backup.

   **Descartado com medição:** não há update OTA publicado no canal `preview`
   (`channel:view` devolveu tudo N/A), e `StorageMigrationService` não escreve
   `STORAGE_KEYS.PROGRESS_BACKUP` — `PEDAGOGICAL_STORAGE_KEYS` não a contém.

   ⚠️ **Estado: REPROVADO EM APARELHO · CloudKit funcional · restore manual
   confirmado · restore automático de instalação limpa ainda falha · causa raiz
   em investigação.** A correção anterior do opt-in remoto continua válida e
   necessária, mas **não era suficiente**.

   **O que a investigação de 2026-09-16 encontrou — e o que NÃO encontrou.**

   🔴 **A causa raiz do que ocorreu no aparelho continua NÃO COMPROVADA.** Duas
   explicações produzem exatamente a mesma tela e a tela não as distingue: (a) o
   restore não rodou, e o estado nunca foi escrito; (b) o restore rodou e o
   `pull` devolveu `absent`, caminho que grava `{decided:true, lastError:null}`
   e produz cartão idêntico — OFF, "Nenhum backup ainda", sem mensagem de erro.
   A hipótese de que a hidratação da jornada rejeitava foi **testada e não se
   sustenta**: `JourneyDefinitionService.getTrackDefinition` não lança com
   catálogo vazio, devolve uma jornada vazia.

   ✅ **Um defeito estrutural real foi encontrado e corrigido.** A orquestração
   no `RootLayout` encadeava catálogo → hidratação → restore sob **um único
   `.catch`**: qualquer rejeição antes do último `.then` pulava o restore
   inteiro, em silêncio, com o app abrindo normalmente. Extraída para
   `restaurarBackupNaAbertura`, com falhas isoladas por etapa — hidratação ou
   catálogo que falhem não cancelam mais o restore. Isso é necessário e correto,
   mas **não está provado que era o que acontecia no iPhone**.

   ✅ **A camada de serviço está provada correta**, por teste de integração com
   `ProgressSyncService` **real**, storage genuinamente vazio e porta de nuvem
   falsa, sem mockar `restoreOnLaunch`: instalação limpa chega ao `cloud.pull`,
   aplica o remoto, termina `enabled:true`/`decided:true`, e **nunca** envia
   snapshot vazio antes de ler. O teste anterior, que mockava `restoreOnLaunch`,
   provava apenas que o mock seria chamado.

   Seguem **não descartados** o caminho de startup/orquestração e o resultado
   real do `pull` na fronteira nativa. Por isso entrou instrumentação mínima na
   abertura, ativa apenas fora de produção, registrando **somente forma e
   decisão**. Nunca payload, nó, trilha, XP ou identificador de iCloud — há
   teste afirmando essa ausência.

   ⚠️ **Correção da própria instrumentação em 2026-09-16, após revisão
   independente.** A primeira versão afirmava que `restore ok:true` com
   `ligado:false` significaria `pull absent` — e isso **não era demonstrável**:
   registro ausente e registro com opt-out remoto terminam no mesmo estado
   local. O resultado passou a ser observado **no ponto da chamada** de
   `cloud.pull()`, com `kind` e `remoteBackupEnabled`, e há teste provando que
   os dois casos produzem eventos de `pull` distintos. O campo que dizia
   `chaveLocalExiste` era preenchido com `decided`, que vem do conteúdo e não
   prova existência da chave; agora há medição física, e o campo derivado do
   conteúdo chama-se `decisaoLocalRegistrada`.

   O procedimento de captura dos eventos no iPhone está documentado no handoff
   (`devicectl process launch --console`, com Console.app como alternativa),
   porque um build sem evidência recuperável não vale o custo.

   ⚠️ **Segunda correção da instrumentação, 2026-09-16.** A versão anterior
   emitia o evento de `pull` **depois** que a chamada resolvia, então "nenhum
   evento de pull" cobria dois diagnósticos opostos: o `pull` não foi chamado,
   ou foi chamado e **lançou** — o serviço captura a exceção e devolve
   `BackupState` de qualquer forma. A tabela de leitura afirmava só o primeiro.
   O `pull` passou a ser observado em **três fases** (`inicio` antes do `await`,
   depois `resultado` **ou** `erro` classificado), e o erro é relançado para não
   mudar a semântica. Numa captura íntegra, a ausência de `inicio` significa que
   a fronteira não foi alcançada; uma captura que falha não autoriza essa
   conclusão.

   ✅ **Passagem 1 funcional APROVADA no iPhone em 2026-09-16.** Foi usado o
   build interno `69d77f13-39bc-46f0-a925-29eb3e568330`, perfil `preview`, iOS,
   distribuição interna, concluído às 12:10 de 2026-09-16. O EAS confirma `Commit`
   `7c4a8419a71c2ebff8b6cd5468ae1287fae15b83` — gerado de worktree limpa, sem as
   alterações não commitadas de outra sessão que estão na árvore de trabalho.

   > ⚠️ Este build é `1.3.1 (11)`, **idêntico aos dois anteriores** na tela de
   > Ajustes. Só o `Commit` os separa. Instalar pelo link do EAS, nunca pela
   > versão, sob risco de medir o binário errado.

   A precondição foi confirmada pelo dono antes da desinstalação: backup ligado,
   último backup em 15/09/2026 às 21:08, XP 100, sequência de 1 dia, trilha
   11/14 e próximo passo checkpoint. Depois da instalação limpa, sem tocar no
   toggle e sem executar lição, revisão ou checkpoint, a primeira abertura
   restaurou automaticamente **backup ligado, XP 100, sequência de 1 dia,
   trilha 11/14 e próximo passo checkpoint**. Portanto o restore funcional da
   Passagem 1 passou.

   A captura JS interna por `devicectl process launch --console` ficou
   **inconclusiva**: o canal terminou com `CoreDeviceError 3 / Mercury 1001` e
   não forneceu a sequência obrigatória de eventos. Isso não invalida a medição
   visual, mas também não comprova a causa histórica exata; ela segue aberta.

   ⚠️ **Defeito separado e determinístico encontrado após a medição.** Num
   estado local limpo, o restore aplicava corretamente o payload remoto e
   gravava `enabled:true`/`decided:true`, mas deixava `lastBackupAt:null`. Por
   isso o cartão mostrava **“Nenhum backup ainda”** embora o progresso tivesse
   voltado. `ProgressSyncService` agora mescla
   `state.lastBackupAt` com `remoto.backup.savedAt` e preserva a data mais
   recente. Há cobertura para remoto utilizável em instalação limpa, datas
   local/remota em ambas as ordens e preservação nos ramos `absent`,
   `incompatible` e `cloud-unavailable`; o teste consumidor confirma que uma
   data presente renderiza **“Último backup em …”**. A correção está no commit
   `45d465` — o HEAD de código aprovado antes deste fechamento documental — e
   seus testes/CI estão verdes, mas ainda não foi validada no aparelho porque
   não foi colocada em novo build.

   ✅ **Passagem 2 física APROVADA no iPhone em 2026-09-16.** Foi reinstalado
   exclusivamente o mesmo build EAS
   `69d77f13-39bc-46f0-a925-29eb3e568330`, cujo commit confirmado pelo EAS é
   `7c4a8419a71c2ebff8b6cd5468ae1287fae15b83`; nenhum build novo foi gerado.
   Antes do opt-out, a medição visual mostrou backup ligado, cartão “Nenhum
   backup ainda”, XP 100, sequência de 1 dia e trilha 11/14. O próximo item
   efetivamente exibido era uma **revisão pendente**, divergindo do checkpoint
   registrado na Passagem 1. Após o dono desligar o toggle, uma reconexão do
   espelhamento confirmou o estado OFF. Não havia leitura segura do registro
   privado disponível; por isso foi usado o fallback autorizado de manter o
   app em foreground por 30 segundos (17:22:45–17:23:15, −03) antes do
   uninstall.

   A reinstalação completa e a primeira abertura por `devicectl` ocorreram às
   17:25:11 (−03). Sem tocar no toggle e sem iniciar lição, revisão ou
   checkpoint, o app permaneceu 30 segundos no onboarding de instalação limpa.
   Depois de pular o onboarding, exibiu **Backup no iCloud OFF, XP 0, trilha
   0/14 e “Fundamentos de Radiologia” como primeira lição/próximo passo**; o
   backup antigo 11/14 não voltou. A sequência continuou em 1 dia porque esse é
   o valor inicial do estado local novo (`GamificationService` inicializa
   `streakDays: 1`), não evidência de restore. Resultado conforme a tabela
   aprovada: **PASS**. O campo remoto `backupEnabled:false` não foi inspecionado
   diretamente no CloudKit Console; a evidência é funcional, pelo estado que
   sobreviveu ao uninstall/reinstall.

   **Divergência registrada, não implementada:** Precisão e Tópicos continuam
   vazios após reinstalação porque vêm de `STORAGE_KEYS.LEARNING_ATTEMPTS`, que
   a **spec §7 deixa deliberadamente fora** do payload de backup. A hipótese do
   handoff de validação — de que dependiam de `reviewHistory` — está **errada**;
   `LearningStatsService` lê `LearningAttemptsRepository`, um store separado.
   Incluí-lo é decisão de produto, não correção de defeito.

   Gates depois desta rodada, medidos em 2026-09-15 com o gate real
   (`npm run quality`, Node 20): os 16 passos, exit 0, `visual:qa:strict` com 0
   regressões; conjunto rastreado **119 suítes / 1015 testes**.

   🔴 **Revisão independente do PR #14, em 2026-09-15, achou dois caminhos de
   perda de progresso dentro do próprio mecanismo antiperda — ambos corrigidos.**
   (1) `pull()` devolvia `null` tanto para "não existe registro" quanto para
   "existe registro que este binário não lê", e `backupNow` lê `null` como
   permissão para gravar por cima: um backup de versão futura era destruído pelo
   snapshot local. Corrigido com união discriminada de três estados
   (`absent`/`usable`/`incompatible`), que faz o compilador obrigar cada
   consumidor a decidir. (2) O Swift resolvia `serverRecordChanged` escrevendo
   por cima do registro do servidor — last-write-wins cego sobre um JSON opaco,
   que apaga progresso mais novo de outro aparelho. Agora o conflito volta ao
   TypeScript, que refaz `pull → merge → push` em até 3 tentativas, com fila
   serializando as operações do aparelho.

   **Lição para as próximas revisões:** os testes anteriores *afirmavam o
   defeito como comportamento correto*, com comentário justificando, porque
   foram escritos a partir do mesmo modelo mental da implementação. Um erro de
   modelo é invisível para testes que codificam o modelo — a prova precisa ficar
   no nível do consumidor que age sobre o valor.

   🔴 **Segunda revisão, mesmo dia: o defeito reapareceu um nível abaixo.** A
   união de três estados estava certa, mas o produtor abaixo dela não foi
   auditado — o Swift devolvia `nil` quando o registro **existia** sem `payload`
   ou sem `savedAt`, e `nil` significa "não existe registro", então o serviço
   gravava do zero por cima de um registro real. Corrigido: `nil` reservado ao
   `catch` de `CKError.unknownItem`, com um único `return nil` executável no
   módulo; o Swift devolve envelope cru e a classificação estrutural passou para
   o TypeScript, onde é testável. **Lição:** apertar um contrato cria uma
   obrigação que todo produtor anterior antecede, e a linha que traduz o
   sentinela antigo para o vocabulário novo type-checa enquanto afirma a
   equivalência que a correção existia para negar.

   ✅ **Os dois achados P2 foram corrigidos na rodada final de 2026-09-15.**
   (1) `backupNow()` deixava de disparar na conclusão de revisão **recorrente**,
   porque o nó já estava em `completedNodeIds` desde a primeira vez — a partir da
   segunda, a revisão atualizava SM-2 e XP sem backup. O discriminador correto já
   existia no estado e não era lido: `pendingReviewNodeIds`, de onde a revisão
   legítima sai e o toque repetido não. (2) `ehProgressBackup` aceitava qualquer
   objeto não nulo nas coleções aninhadas, deixando payload corrompido passar como
   `usable` — o estado que autoriza mesclar sobre o local; uma string em
   `completedNodesByTrack` virava nós de um caractere no spread da mescla, e `NaN`
   em `interval` envenenava o agendamento sem lançar. Validação profunda com 12
   casos corrompidos e **6 contrapontos válidos**, para a correção não virar
   "rejeita tudo".

   🔴 **O gate do CI reprovou depois da terceira rodada, e isso corrigiu os
   números de todas elas.** A falha era
   `LessonFlowScreen — assinante com contagem zero não é pausado`, duas vezes no
   mesmo SHA. Causa medida: a asserção usa `waitFor` com timeout padrão de
   1000 ms, cada ciclo de polling custa ~340 ms e a tela precisa de dois flushes,
   então a condição só vira verdadeira entre 714 e 1488 ms. Em worktrees limpas,
   `origin/main` tem a **mesma** distribuição (pior caso 1488 ms, contra 968 ms
   desta branch): a fragilidade é anterior e independe do CloudKit. Corrigido com
   um `act` vazio antes do `waitFor` — 2 ms, sem mexer em timeout.

   ⚠️ **As contagens de teste reportadas nas três rodadas estavam contaminadas.**
   Elas incluíam 8 suítes / 42 testes de arquivos do Currículo V3 não commitados
   de outra sessão, e foram medidas com `npx jest` no Node 24 em vez de
   `npm run quality` no Node 20, que é o gate real. Números corretos do conjunto
   rastreado, medidos em worktrees limpas em 2026-09-15: `origin/main` =
   **117 suítes / 916 testes**; branch da 1.4 CloudKit = **119 suítes /
   1000 testes** depois da rodada final dos P2. Gate real completo
   (`npm run quality`, Node 20): os 16 passos, exit 0, `visual:qa:strict` com 0
   regressões.

   **Inventário ampliado em 2026-08-27:** o [atlas das aulas](../content/mapa-aulas/README.md)
   separa 18 aulas legadas, 12 atividades promovidas, 72 nós construídos na
   trilha e 96 pacotes editoriais. Os 48 cartões editoriais não alimentam a
   revisão atual. O Canvas e nove notas foram instalados, após autorização, em
   `Projetos/Radiant/Revisão das aulas`, fora do cérebro do projeto; abertura,
   enquadramento e navegação entre notas foram conferidos no Obsidian.
   Propostas de estética, dinâmica e dois pilotos estão explicitamente
   separadas do inventário; revisão de domínio e implementação continuam abertas.

   **Decisão curricular em 2026-08-27:** o dono aposentou a direção editorial
   anterior e aprovou o [Currículo V3](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md).
   A estrada passa a ser contínua: Fundamentos (anatomia, fisiologia e física) →
   Radiografia → Mamografia → Tomografia → Ressonância → Medicina Nuclear →
   Radioterapia → outras especializações. O Arco 1 de orientação espacial foi
   aprovado com correções por auditor independente, sem reprovação conceitual.
   **J2 implementada localmente em 2026-08-27:** a fundação versionada do
   [plano técnico](../superpowers/plans/2026-08-27-curriculum-v3-foundation.md)
   define IDs estáveis, chaves V3 isoladas e preparação explícita com fotografia
   imutável de quatro fontes do histórico. A inicialização do catálogo cria
   apenas o marcador de currículo legado; não chama a preparação nem ativa o V3.
   Estados desconhecidos/corrompidos não são regravados, erros de armazenamento
   permitem retomada e nenhum domínio anterior é convertido em domínio V3.
   A fotografia é **parcial**, não um backup integral nem o snapshot final do
   corte: SM2, checkpoints, XP e preferências continuam intocados, com inventário
   de consumidores e pausa dos escritores legados obrigatórios em J5.
   **Evidência medida em 2026-08-27:** cinco suítes focadas, 74 testes aprovados
   (`npm test -- --runInBand src/features/curriculum-v3/
   src/features/content/services/LessonCatalogService.test.ts
   src/features/journey/services/JourneyProgressService.test.ts`, em `radiant-app`);
   `npm run typecheck` aprovado; `npm run lint` sem erros e com 28 avisos em
   arquivos preexistentes fora desta mudança. Revisão independente do código sem
   achados críticos/importantes; sugestão de testar persistência seguida de erro
   incorporada. Fechamento registrado no commit local `320e10d`, na branch
   `codex/curriculum-v3-foundation`: os 14 validadores do run
   `run-1787851096220-d09a361b` passaram; o run e sua sessão de leitura foram
   encerrados. Sem push, build ou submissão nesta entrega.
   Nenhuma tela, conteúdo do catálogo, progresso ou binário foi
   alterado; a trilha anterior continua visível até J5.
   A [ADR do V3](../adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md) preserva o
   histórico anterior durante a migração e proíbe apagar o legado antes de
   testes de atualização e ausência de consumidores.

   **J3/L1 entregue localmente em 2026-08-27:** [O corpo como referência](../curriculum-v3/arco-1-l1-corpo-como-referencia.md)
   ganhou conteúdo original com fontes, mapa SVG 2.5D, controles alternativos,
   fluxo de erro/remediação/recuperação e prévia isolada. A auditoria independente
   aprovou a revisão estática v4 após três ciclos de correção. A L1 não está
   conectada a startup, rota, catálogo ou manifesto; `prepareV3()` não foi
   chamado. Testes focados, lint e typecheck foram executados localmente; isso
   não comprova qualidade científica nem acessibilidade real em VoiceOver ou
   aparelho.

   **J3/L2 entregue localmente em 2026-08-28, com auditoria ainda aberta:**
   [Cortando o espaço](../curriculum-v3/arco-1-l2-cortando-o-espaco.md) separa plano
   geométrico, região espacial, espessura nominal e imagem resultante, com mapa
   2.5D em SVG autoral, geometrias candidatas selecionáveis, controles textuais
   equivalentes e os erros `E-PLN-MED`, `E-PLN-OBL` e `E-PLN-SEC` com remediação
   e recuperação em região nova. As 4 suítes da lição passam (22 testes,
   remedido em 2026-09-22). **A auditoria independente não aprovou a L2:** os
   pareceres v1, v2 e **v3 foram todos reprovados** — diferente da L1, que fechou
   em v4 aprovado.

   **Parecer v3 (2026-09-22):** [registro completo](../content/2026-09-22-l2-parecer-v3.md).
   Seis achados críticos, seis importantes, seis menores. Três das quatro
   correções que a lição declarava ter feito para a v3 **não existem no código**:
   as geometrias candidatas não são numeradas nem tocáveis dentro do SVG (e o
   cabeçalho "Toque em um candidato no modelo" é afordância falsa); o movimento
   que antecede o volume é um overlay de texto fora do SVG; e a silhueta é
   deslocada duas vezes (`SlicingSpaceModel.tsx:69` e `:91`), o que põe a placa
   "mediana" fora do centro do corpo e torna **falsa no desenho** a resposta
   correta de dois itens. Dois defeitos de conteúdo se somam: o plano coronal é
   desenhado como linha horizontal numa vista frontal, e o seletor apresenta
   mediano e oblíquo como planos irmãos e exclusivos — `E-PLN-MED` e `E-PLN-OBL`
   codificados no controle que deveria remediá-los.

   ⚠️ **As 4 suítes verdes não detectam nenhum dos 18 achados.** Nenhuma asserção
   toca as geometrias candidatas; três incidem sobre um espelho das props
   embarcado no componente só para os testes; e o mock do hook de Reduce Motion
   oculta uma violação real. É a mesma classe de falha registrada em 2026-09-08 —
   teste verde sobre mock, defeito visível passando. **Suíte verde não é
   evidência de correção nesta lição.**

   Três achados foram reconferidos de forma independente antes do registro (o
   duplo deslocamento, a afordância falsa e o rótulo por identidade); os três
   procedem. Nada foi verificado em aparelho: o pedido da v2 de confirmar a
   semântica de rádio em VoiceOver **continua aberto** e nenhum teste desta suíte
   pode fechá-lo.

   **Os seis críticos foram corrigidos em 2026-09-22 e o parecer v4 os confirmou
   resolvidos no código** — [registro](../content/2026-09-22-l2-parecer-v4.md). O v4
   ainda assim **reprovou**, por motivo de outra natureza: dois críticos novos,
   ambos consequência da correção do C4. **N1** — a lição passou a terminar sem
   saída depois de um erro na recuperação, agora no caminho de todo aprendiz, com
   três objetivos por ver e o domínio daquele objetivo travado para sempre;
   confirmado por execução do motor real. **N2** — a recuperação que o C4 tornou
   porta única do domínio não era item novo: em três das quatro famílias a
   resposta correta ficava na mesma posição, e em duas a alternativa correta era
   o mesmo objeto, com o mesmo candidato desenhado.

   Some-se **N4**: as guardas de C1 e C3 paravam na fronteira do módulo puro.
   Reembutir a linha horizontal do coronal ou o deslocamento no caminho do corpo
   reintroduzia os dois defeitos **com a suíte verde** — o que tornava
   insustentável, para dois dos seis, a afirmação de que cada correção tinha
   teste que falhou antes.

   **N1, N2 e N4 corrigidos na mesma data (v5 submetida):** o apoio após
   recuperação falhada segue o percurso em vez de zerá-lo; a resposta correta
   mudou de posição nas três famílias, com guarda que percorre todas; os
   candidatos passaram a ser desenhados na região que o cenário nomeia; e três
   guardas novas atravessam o componente, asseverando sobre o `d` da placa, o
   caminho da silhueta e a matriz do candidato — as três derrubadas com o defeito
   específico de cada uma antes de serem aceitas. **Evidência: 5 suítes e 46
   testes da lição.**

   **Descoberta de método:** o desenho fica sob `accessibilityElementsHidden`, e
   as consultas padrão do RNTL pulam nós ocultos — é **por isso** que nunca houve
   teste sobre ele, não por esquecimento. Precisa de
   `{ includeHiddenElements: true }`.

   ⚠️ **Fora do escopo da L2:** o parecer v4 registrou que a **L1, já aprovada**,
   contém o defeito exato do C6 — `option.label` preso à identidade renderizado
   ao lado do número por posição. A correção da L2 não foi propagada.

   **Parecer v5 (2026-09-22): reprovado de novo** —
   [registro](../content/2026-09-22-l2-parecer-v5.md). Os seis críticos do v3 **e**
   os três achados do v4 foram confirmados resolvidos; o revisor enumerou 21.110
   percursos do motor e nenhum termina com objetivo por ver, concede domínio
   indevido ou forma laço. A reprovação veio de **um crítico que a correção do N2
   criou**: transladar os candidatos para a região do cenário empurrou nove
   figuras para fora do `viewBox`, entre elas as respostas corretas de duas das
   quatro recuperações. Em `l2-section-recovery` a alternativa correta nomeia
   "duas faces" e a segunda caía inteira fora do quadro — a condição pela qual o
   C3 foi reprovado, por outro mecanismo.

   🔴 **Três passagens seguidas, a correção produziu o achado seguinte, e a
   guarda escrita junto com ela foi cega justamente a ele.** O C4 gerou N1 e N2;
   a correção do N2 gerou P1. A guarda do candidato exigia apenas que as
   **matrizes diferissem** entre cenários, e uma translação para fora do quadro
   satisfaz isso com folga. **Guarda que só exige diferença autoriza o defeito
   que deveria barrar.**

   **P1 e o resíduo do N1 corrigidos em 2026-09-22 (`949a5f0`), v6 submetida.**
   A translação saiu: candidato de corpo inteiro não pertence a região nenhuma e
   não se move; só os ligados a nível acompanham a região, e são construídos na
   banda dela. A guarda nova afirma que todo candidato cabe inteiro no `viewBox`,
   em todo cenário. **Evidência: 5 suítes e 51 testes da lição, 129 em
   `curriculum-v3`.**

   ⚠️ **Crítica de método retida do v5, que vale para todo o projeto:** a frase
   "cada um com teste que falhou antes da correção" é **inauditável** por quem
   revisa, porque o commit é único e não preserva o passo vermelho. Não é falsa;
   é inconferível — a mesma classe de asserção que reprovou v1 a v3.

   **Seguem abertos na L2:** P2 a P9 do v5 (entre eles a legenda que atribui
   "alinhada" ao traço da resposta "inclinada", e `scenarioRegion` resolvendo
   região por prefixo de string), N3, N5, I4 agravado, N7–N10 e os
   importantes/menores do v3.

   **Parecer v6 (2026-09-22, sobre `949a5f0`): reprovado pela quarta vez no
   mesmo padrão** — [registro](../content/2026-09-22-l2-parecer-v6.md). O P1 está
   resolvido no quadro: todo candidato cabe no `viewBox`. O crítico novo, **Q1**,
   foi criado pela correção do P1: `candidatePathFor` soma `regionTop −
   thoraxTop` supondo base no tórax, mas três dos quatro candidatos ligados a
   nível já estão no abdome. A resposta correta de "separa superior e inferior
   **do abdome**" é desenhada na pelve (y 252..276 contra a banda 166..226), e em
   `l2-section-recovery`, porta única de domínio do objetivo 4, a segunda face do
   volume fica abaixo do tronco. Reconferido pelo controlador, com a aritmética,
   em 2026-09-22. Importantes: a "compressão" anunciada não existe (Q2); as
   guardas novas ficam **51/51 verdes** com `transform` no `<Path>`, caminho
   vazio ou tela revertida (Q3); o resíduo do N1 persiste nos objetivos 1 a 3
   (Q4); a congruência do N5 voltou em 4 itens (Q5). O N4 **regrediu** no
   candidato.

   🔴 **Quarta vez que a resposta correta sai falsa no desenho, cada vez por
   um mecanismo novo** (C3, P1, Q1), e quarta guarda de diferença no lugar de
   validade. O registro propõe **uma guarda única de validade semântica** para
   todos os itens: resposta correta com `d` não vazio, dentro da banda que o
   enunciado nomeia e do tronco, sem `transform` estranho e sem coincidir com o
   outro candidato. Ela deve ser vista falhando com o Q1 **antes** da correção.
   **Evidência do revisor, medida em 2026-09-22:** Node 20, 5 suítes/51 testes
   da lição e 12/129 em `curriculum-v3` aprovados; 11 mutações, 7 delas verdes.

   📌 **Mesmo um parecer aprovado não torna a L2 publicável:** J4 (acessibilidade
   sobre as lições implementadas) e J5 (corte seguro e fluxo completo no iPhone)
   continuam pendentes, mais a revisão técnica especializada da §8/§12.3, que
   nenhum parecer de agente fecha.
   Como a L1, a L2 não está conectada a startup, rota, catálogo ou manifesto, e
   `prepareV3()` não foi chamado.

   J3/J4/J5 continuam abertos. **A P1 não é a próxima produção:** o roteiro
   manda corrigir os achados e repetir a revisão antes de avançar de pacote, e a
   L2 acumula três reprovações. Próximo passo: corrigir os seis achados críticos
   do parecer v3 e submeter a revisão v4. O achado I2 (taxonomia `E-PLN-SEC`
   aplicada a confusão coronal×transversal) **não se resolve dentro da L2** —
   criar um código de erro novo é mudança de spec, decisão do dono.
   **Decidido em 2026-09-23** ([ADR](../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md)): código `E-PLN-ORT` na spec,
   aplicado na v7 da L2.

   Sequência atual: produzir e validar o Arco 1 sobre a fundação V3 →
   retirar a trilha anterior das superfícies sem
   apagar seu histórico → preparar novo build com
   autorização → instalar pelo TestFlight → testar fluxo completo e
   persistência → gravar vídeo desse mesmo build → selecionar o build validado
   e responder à Apple com autorização. **O `(9)` documenta o defeito, não uma
   correção futura.** O acompanhamento passa ao
   [Trello](https://trello.com/c/f9OYyCX5), conforme escolha do dono; sem novas
   ações no Todoist. Detalhe das perguntas da Apple em
   [`release/APP_REVIEW_REPLY_1.3.1.md`](../release/APP_REVIEW_REPLY_1.3.1.md).

   ⚠️ **Smoke físico completo do candidato ainda pendente** — a matriz
   real-device está no build `(5)`. A captura do `(9)` não comprova conclusão,
   persistência ou uso offline; testes automáticos não validam por si só a
   coerência pedagógica da tela.
2. **Play** — ≥12 testadores participando por 14 dias corridos (F2). O relógio
   não havia começado na última leitura. Exigência de conta pessoal; não há
   atalho de engenharia.
3. **Play** — questionário IARC (E4), aparelho Android físico (C4), TalkBack (C5).

O go/no-go item a item vive em
[`release/CHECKLIST_RELEASE_V1.3.md`](../release/CHECKLIST_RELEASE_V1.3.md); o que
está executável agora, em [`FILA.md`](../FILA.md).

#### Estado do repositório — medido em 2026-09-23

`origin/main` em `2e62fc9` (merge do PR #20). **Nenhum PR aberto.** No remoto
há 11 branches além da `main`, **todas já mergeadas nela** — apagá-las é
decisão do dono. Nesta máquina, além do checkout principal, há a worktree
`Radiant-release` (com a `main` local atrás da remota) e quatro worktrees de
sessões do Claude em `.claude/worktrees/`, cada uma com o próprio
`.loop/runs/` — por isso não foram removidas.

```bash
git fetch origin && gh pr list --state open
for b in $(git branch -r | grep -v HEAD | grep -v 'origin/main$'); do git merge-base --is-ancestor $b origin/main && echo "mergeada: $b" || echo "ABERTA: $b"; done
git worktree list
```

##### Medição anterior — 2026-08-21

Uma branch: `main`. Nenhum PR aberto. Nenhum worktree.

A unificação de 2026-08-21 fechou uma divergência de duas sessões paralelas de
IA que trabalharam o mesmo dia sem se ver:

- **PR #5** (`feat/atividade-fim-licao`, sub-projeto 1/6) — mergeado. Estava
  OPEN, MERGEABLE e com CI verde havia 4 dias.
- **`c7cba6a`** — bugfix da trilha que **nunca havia sido enviado ao remoto** e
  por isso ficou de fora do PR #5. Recuperado por cherry-pick.
- **PR #6** (sub-projeto 2/6) — resgate de uma branch órfã com 1.524 linhas de
  produto e nenhum PR: `JourneyCurriculumService` (percurso contínuo),
  `LessonFlowScreen` terminando em conclusão, `DevConsoleScreen` fora da tela do
  aluno, `ProgressScreen` enxugada.
- 7 branches mortos podados (local e remoto).

**A aba Galáxia deixou de existir em 2026-08-21.** A barra tem Estude, Progresso
e Missões. `JourneyCurriculumService`, que chegou no merge do sub-projeto 2 sem
nenhum consumidor, passou a alimentar a trilha contínua da aba Estude.

A verificação que autorizou a remoção achou algo mais forte que cobertura: o
único nó de lição da Galáxia apontava para um `lessonId` inexistente no catálogo
— **a cadeia já estava quebrada.** `TrailCoverage.test.ts` agora guarda a
invariante que passou a valer: toda lição do catálogo é alcançável pela trilha.

#### Reformulação guiada pelo EWA — 2 de 6

| # | Sub-projeto | Estado |
| --- | --- | --- |
| 1 | Atividade enxuta e conclusão de lição | ✅ em `main` |
| 2 | Percurso contínuo, conclusão, dev-console | ✅ em `main` |
| 2b | **Estude é a trilha; Galáxia absorvida** | ✅ em `main` (2026-08-21) — aba renomeada, Galáxia removida do app, trilha contínua ligada |
| 2c | **Caminho preenchido, cabeçalho de estágio, avaliação por competência** | ✅ em `main` (2026-08-21) |
| 3 | **Aba Perfil: Progresso + Missões + identidade** | ✅ em `main` (2026-08-21) — a barra tem duas abas |
| 4 | Marca no topo com símbolo de radiação | precisa da arte existir |
| 5 | Arte da trilha e ícones de HUD | assets autorais do dono; Rive fechado |
| 6 | Liga, ranqueamento e social | colide com o contrato de privacidade |

#### O ponto cego do gate — medido em 2026-08-21

O sub-projeto 2 chegou à `main` com `src/app/dev-console.test.tsx`. O
`require.context` do expo-router varre `src/app` inteiro para montar as rotas,
então esse arquivo entrava **no bundle** e arrastava
`@testing-library/react-native`, que pede o módulo `console` do Node. **O app
não abria** — tela vermelha na inicialização.

Os 16 passos do gate passaram todos. Não por descuido: **nenhum deles empacota o
app.** Lint, typecheck, 712 testes e visual QA strict são compatíveis com um
binário que não inicia.

Corrigido em `3dc3388`: o teste foi para `src/test/routes/` e a regra virou o
contrato `route-tree-purity-contract` (14º do gate), que falha se qualquer
`*.test.*` aparecer sob `src/app`. A falha foi provada com uma sonda.

**A lacuna continua aberta.** Só a abertura real do app pega essa classe de
defeito, e ela não está em nenhum passo automatizado. Até estar, subir o app no
simulador faz parte de verificar uma passagem.

#### A trilha, medida em 2026-08-21

- **A linha é contínua e vem preenchida** até a posição do aluno, com **uma**
  fronteira entre percorrido e pendente. Cada nó carrega o seu segmento, que
  transborda para a folga seguinte e costura no próximo — não há buraco nas
  alturas dos cartões. Duas versões erradas ficaram pelo caminho e as duas
  passavam nos testes: a listrada (cor por nó vizinho) e a picotada (segmento
  dentro de um `View` sem altura própria). Só o simulador pegou as duas.
- **Pílula `PRÓXIMO`** no nó atual, reconhecível sem ler rótulo.
- **Cabeçalho de estágio** no topo (nome, `N de M`, barra) no lugar do
  `JourneyHero`. Adendo registrado no `ADR-2026-08-13`: a fala esporádica do
  Pixel perdeu a única superfície.
- **Uma avaliação fecha cada estágio** nas quatro trilhas. Na trilha por
  competências, o estágio é a competência: as 12 atividades cobrem 5, e os 10
  itens da avaliação foram repartidos dois a dois, com o limiar de 80% intacto.

**Em aberto para o dono:** se o Pixel deve voltar a falar espontaneamente em
alguma superfície. Hoje ele só fala como reação a evento.

#### A barra, medida em 2026-08-21

Duas abas: **Estude** (a trilha) e **Perfil** (identidade + Missões + Progresso).
O console de desenvolvimento vive fora das abas, em `/dev-console`, atrás de
`SHOW_DEV_TOOLS` — a separação veio antes da agregação de propósito.

O que a referência do EWA tem e o Perfil não tem: seguidores, chats e liga entre
pessoas. O `STUDENT_CHECKPOINT_PRIVACY_CONTRACT` não admite comparação entre
alunos; a liga é métrica local, por decisão de 2026-08-15.

**Requisito de loja preservado:** o cartão **Ajuda e informações** — Política de
Privacidade e Central de Suporte — continua no app, agora no fim da rolagem do
Perfil. Verificado em simulador.

**Armadilha registrada:** os flows do Maestro **não rodam** no `npm run quality`;
só o contrato deles roda, e ele afirma estrutura, não copy contra tela. Em
2026-08-21 uma mudança de copy quebrou 20 asserções em 9 flows sem nenhum sinal.
Ao mudar texto de tela, greppe `.maestro/` no mesmo passo.

#### Varredura de QA — 2026-08-21, fechada em 2026-08-24

Relatório completo, com evidência de tela:
[`2026-08-21-varredura-qa.md`](../../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).

O ciclo crítico inteiro funciona percorrido no simulador, sem erro de console:
`trilha → lição → conclusão com estrelas → checkpoint → conquista → próxima`.

**Fechado em 2026-08-24:**

- **`npm run ios:v2` entregava flags diferentes das que imprimia.** Um `.env`
  local vencia o `export` do script e o `EXPO_NO_DOTENV=1` — isolado por
  experimento controlado, não por leitura de código. `check-env-precedence.mjs`
  passou a verificar o efeito **antes** de o script prometer qualquer coisa, e
  cobre também `API_BASE_URL`, que era a chave mais perigosa. O `.env` da máquina
  do dono foi alinhado, com backup em `~/.radiant-env.backup-2026-08-24`.
- **`/dev-console` ganhou porta** no fim da rolagem do Perfil, atrás de
  `SHOW_DEV_TOOLS`. É porta, não controle: os controles seguem proibidos ali, e
  a distinção está travada por teste nos dois sentidos.
- **`/modal` removida** — era o modal literal do template Expo. Arquivos de rota
  e `Stack.Screen` declarados agora batem 1:1.
- **O kill switch foi acionado pela primeira vez** — ver a seção abaixo.

**Os órfãos foram resolvidos em 2026-08-24.** A lista de 13 escondia três
estados com remédios opostos, e a triagem por **tamanho e origem** — não por
grafo de imports — separou os três. Seis arquivos tinham **0 byte** e entraram
vazios no bulk `847a12d`: a "feature `annotation` inteira" era tela, componente e
serviço vazios, e a doutrina que protegia conhecimento de domínio não tinha
objeto. Dois eram duplicata de implementação viva (`models/sm2.ts` contra o SM-2
próprio do `SpacedRepetitionService`; `services/xp.ts` contra `XP_RULES` do
`GamificationService`). Três estavam mortos sem irmão vivo. **Os 11 saíram**, com
gate verde nas duas redes.

**Três não eram andaime, e continuam por decisão do dono:**

- `src/data/ai-catalog.ts` é **gerado** por `scripts/content/sync-catalog-to-app.mjs`
  — apagar seria desfeito pelo produtor. É "emitido e não consumido", e o remédio
  fica a montante: ligar a um consumidor, ou parar de emitir.
- `CompetencyMasteryService` e `ProductAnalyticsAdapter` são a **metade leitora**
  de pares cuja escrita está viva — `LearningEvidenceRepository` grava a cada
  atividade concluída, e ninguém lê. Apagar o leitor não remove código morto:
  converte escrita viva em fluxo sem leitor.

**Continua aberto, por decisão do dono:** o nó `/quiz` + `/review` — ambas sem
entrada, e o plano condiciona aposentar a primeira a confirmar que a segunda
cobre revisão (a Task 15 já confirmou, em 2026-08-15) —, e os quatro falsos kill
switches. **Atenção ao aposentar `/quiz`:** ela é alcançada por deep link em
`.maestro/rating-prompt.yaml`, que não roda no gate; um teste de "nenhum import
remanescente" é cego para isso por construção.

#### O kill switch, medido em 2026-08-24

`ENABLE_LEARNING_ROAD` é o **único** kill switch real: `(tabs)/index.tsx`
renderiza `JourneyHomeScreen` quando ligado e `HomeScreen` quando desligado. É
lido em tempo de build, então só se aciona por novo build ou por OTA — que está
configurado (`updates.url`, canais `preview`/`production`).

Foi acionado e medido pela primeira vez. Funciona mecanicamente: sobe, navega,
sem crash. Mas a `HomeScreen` renderizava **inteiramente no tema claro**, e num
incidente isso é o pior comportamento possível — o aluno concluiria que o app
quebrou. Migrada para `semanticColors.galaxy`; nenhum componente compartilhado
foi tocado, porque `StatPill` já tinha prop `dark` e `ProgressRing` já usava o
contexto escuro.

**A guarda que deveria ter pego, e não pegava.** O `identity-palette-contract`
cobria a tela e passava verde: ela alcançava a paleta clara por
`semanticColors.light`, e `semanticColors` estava na lista de permitidos. O
contrato passou a proibir o **contexto** claro dentro das raízes de produto — e
a ignorar comentários, para não punir quem documenta a regra.

**Os outros quatro são rótulos, não interruptores.** `ENABLE_REVIEW`,
`ENABLE_GAMIFICATION`, `ENABLE_ONBOARDING` e `ENABLE_HEURISTICS` estão fixos em
`true` no código, sem leitura de env. Não são acionáveis nem por OTA. Ou viram
flags de verdade, ou mudam de nome — a pior hora de descobrir isso é durante um
incidente. **Decidido pelo dono em 2026-09-23** ([ADR](../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md)):
apagar `ENABLE_GAMIFICATION`, `ENABLE_HEURISTICS` e `ENABLE_ONBOARDING` (esta,
sem leitor em `AppConfig`, e a constante local do `OnboardingService`), e
tornar `ENABLE_REVIEW` real por `EXPO_PUBLIC_ENABLE_REVIEW`, padrão `true`.
**Implementado em 2026-09-23**, na branch `fix/kill-switches-reais`. Hoje há
**dois kill switches reais**: `ENABLE_LEARNING_ROAD` e `ENABLE_REVIEW`. A guarda
`src/config/killSwitches.contract.test.ts` lê a AST e barra quatro coisas: flag
`ENABLE_*` fixa, flag sem leitor, `ENABLE_*` local fixo em módulo, e
`ENABLE_REVIEW` fora do formato combinado. Vermelhos registrados em
[`2026-09-23-radiant-kill-switches-vermelhos.md`](../superpowers/handoffs/2026-09-23-radiant-kill-switches-vermelhos.md).
**Gate medido em 2026-09-23**, Node `v20.20.2`: `EXPO_NO_DOTENV=1 npm run quality`
saiu 0, com 133 suítes e 1170 testes, e Visual QA sem regressão (+1 suíte e +7
testes sobre a fatia 2).

A guarda achou mais duas flags sem leitor, `ENABLE_PRODUCT_ANALYTICS` e
`ENABLE_REVENUECAT`. **Apagadas em 2026-09-23 por decisão do dono**
([ADR](../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md), item 4). No
caminho apareceu um problema maior: os documentos de privacidade citavam
`ENABLE_PRODUCT_ANALYTICS=false` como o motivo de nenhum evento sair do
aparelho, e a flag não tinha leitor. O motivo real é que nenhum adaptador de
analytics é registrado, e **agora isso tem guarda**: o
`telemetry-privacy-contract.test.ts` reprova qualquer chamada de produção a
`registerProductAnalyticsAdapter`. Os dois documentos foram corrigidos.
📌 O `.env.example` ainda lista as duas variáveis: está fora de
`writePolicy.allowedRoots`, e as linhas são inertes.
**Gate depois do adendo, medido em 2026-09-23**, Node `v20.20.2`: saiu 0, com
133 suítes e 1171 testes, e Visual QA sem regressão.

#### Defeito aberto

**`ENABLE_REMOTE_SYNC` não desliga o `AuthService`.** A flag gateia só a exibição
e o `SyncQueueService.flush`; o auth decide por `isApiConfigured()`, e
`bootstrap()` roda no startup do app, no Perfil e no Progresso. Com uma URL de
API configurada, "sync desligado" ainda autentica contra ela. Medido em
2026-08-24; registrado por decisão do dono, não corrigido — mexer no gate afeta
login, sync e o contrato de telemetria. Detalhe em
[`2026-08-21-varredura-qa.md`](../../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).


**Resolvido junto com a trilha.** O CTA "Retomar etapa" renderizava atrás da tab
bar na Home de 2026-08-21; o painel que o continha foi substituído pela trilha, e
o botão deixou de existir como elemento fixo. A lição permanece: nenhum
validador estático enxerga tela.

#### Duas redes, e o que cada uma NÃO cobre

O `npm run quality` do app e o `loop validate` do Loop são **conjuntos
diferentes**, e nenhum é superconjunto do outro. Em 2026-08-24 o
`docs-contract` do Loop estava reprovando havia **três dias** — desde o
arquivamento dos status datados em 2026-08-21 — e nada avisou, porque ele não
roda no gate do app. Ao mexer em documentação governada, rode os dois.

#### Gate de qualidade

`npm run quality` em `radiant-app`: **19 passos** (lint, typecheck, 15
contratos `test:*`, a suíte Jest em banda única e o visual QA strict).
**Medido em 2026-09-23** em `b7aa165`, cuja árvore é a mesma de `2e62fc9`
(`main`), Node `v20.20.2`: exit 0, **134 suítes / 1224 testes**, lint 0
erros / 26 avisos, visual QA com 0 regressões. O CI (`.github/workflows/radiant-app-quality.yml`)
invoca **o comando inteiro**, não uma lista espelhada — desde 2026-08-15, quando
se descobriu que rodava 4 dos 16 passos.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```

---

## Lote de 2026-09-23 — a seção 2 do roadmap de lançamento, em `78f96d0`

Era um segundo documento de estado dentro do roadmap
([`2026-07-27-radiant-launch-roadmap.md`](../plans/2026-07-27-radiant-launch-roadmap.md)).
Títulos rebaixados um nível; texto original.

### 2. Onde estamos hoje (verificado)

Fonte atual: **[docs/STATUS.md](../STATUS.md)** — ponteiro reconciliado em
2026-08-27. Os snapshots em `docs/archive/` são históricos. A seção abaixo descreve o estado
verificado em 07-27; as entregas posteriores, inclusive a correção P0 de
contraste/composição, o HUD vetorial e o percurso único da jornada, estão no
status canônico.

> **Atenção para quem retoma:** o redesenho da jornada de 2026-08-14 foi
> publicado em `0ceff49`; a verificação iOS Release de seus dois caminhos de
> runtime foi registrada em `29126da`. A passagem foi encerrada para
> replanejamento. O handoff preserva P3 (decisão de produto sobre conclusão do
> percurso) e P4 (assets `.riv` do dono) como **insumos, não tarefas
> autorizadas**, em
> [`handoff/2026-08-14-brief-jornada-e-pendencias.md`](../handoff/2026-08-14-brief-jornada-e-pendencias.md).

**Onde o trabalho está (2026-08-13):** a `main` incorpora os PRs #1 e #2 e o
corte H4 pelo [PR #3](https://github.com/andersonsmelo/Radiant/pull/3), merge
`da638bb`. A engenharia H4 está integrada; produção continua `off` e o próximo
gate é a experiência completa em aparelho. Contagens e mergeabilidade devem ser
medidas no Git/GitHub, não copiadas para este roadmap.

**Sólido:**

- App local-first funcional; catálogo, progresso e revisão funcionam sem API.
- ~~v1.2.1~~ **1.3.1** em 2026-08-03, alinhada entre `package.json` e
  `app.json`; `runtimeVersion` por `appVersion`. ~~Nenhum build publicado ainda
  (mudanças de versão ainda livres).~~ **Falso desde 2026-08-04: mudanças de
  versão deixaram de ser livres.** A `1.3.1 (5)` está instalável no TestFlight e
  a Android `1.3.0 (4)` está no track fechado; mexer na versão agora quebra a
  continuidade das duas fichas e da contagem de opt-ins da F2. Cuidado ao ler o
  `app.json`: ele declara `buildNumber: 3`, e isso **não é o que está
  publicado** — o `eas.json` usa `appVersionSource: remote` com
  `autoIncrement`, então o contador vive no servidor do EAS e o arquivo local
  fica para trás por construção.
- Qualidade: ~~27 suítes / 71 testes PASS~~ ~~48 suítes / 245 testes PASS~~
  **49 suítes / 267 testes PASS** em 2026-08-03 (terceira sessão do dia);
  `npm run quality` PASS; Gate 2 de acessibilidade ~~parcial (3/5)~~ ~~(4/5)~~
  ~~(3/5) recontado em 2026-08-05~~ ~~(4/5) em 2026-08-06~~ **APROVADO (5/5) em
  2026-08-06**. O item 1 foi reaberto em 08-05 pela recontagem — o critério
  havia crescido em 08-03 e a passagem de 07-26 não podia cobri-lo — e fechado
  em 08-06 com nova caminhada em iPhone. O item 2 fechou no mesmo dia **com
  ressalva escrita**: o estado ocupado não é produzível nesta build e ficou
  coberto pelo contrato unitário, com gatilho de reabertura. Ver B4 e B8.
- ~~E2E iOS em device PASS (3/3 flows Maestro)~~ **E2E medido nas duas
  plataformas em 2026-08-03: iOS 5/5 e Android 5/5**, sobre builds Release locais
  da 1.3.1. Os dois vermelhos que apareceram no caminho — `offline-relaunch` no
  Android e `store-capture` nas duas — eram defeitos dos flows, anteriores a esse
  trabalho, e foram corrigidos e remedidos. A ressalva do item 3 dos bloqueadores continua valendo: a
  evidência foi colhida sob o perfil `e2e-test`, não sob configuração equivalente
  a produção.
  ~~**⚠️ Acrescentado em 2026-08-03 (terceira sessão): essa evidência agora precede
  o HEAD.**~~ **Resolvido em 2026-08-03 (quarta sessão): a suíte foi reexecutada
  no HEAD e sob configuração equivalente a produção — `6/6` no iOS e `6/6` no
  Android**, com um flow a mais que os cinco anteriores. Os 11 commits do
  refinamento de microinterações não regrediram nada, e o item 3 dos bloqueadores
  fechou na mesma rodada. Evidência em
  [`2026-08-03-e2e-producao-rating-prompt.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).
- EAS configurado (projeto, perfis `development`, `e2e-test`, `preview`,
  `production`); bundle id/package `com.ascendcreative.radiant` definidos.
- Expo SDK 54 / RN 0.81 → target Android API 36 por padrão, o que já atende o
  requisito do Play para novos apps (ver §4).

**Aberto (bloqueadores conhecidos):**

> **Reconciliado em 2026-08-03.** Esta lista é de 2026-07-27 e três dos nove
> itens tinham deixado de ser verdade sem que ninguém os riscasse — ela dizia
> "zero E2E Android" e "onboarding pendente de confirmação" para quem fosse
> decidir hoje. Os itens 2, 7 e 9 foram riscados com a correção datada, e os
> números do item 8 foram remedidos. Os itens **1, 3, 5 e 6 foram reverificados
> e continuam verdadeiros** — não estão aqui por inércia.
>
> O padrão é o do item 4: riscar o texto original e anexar a correção com data.
> O registro do que se acreditava em 2026-07-27 tem valor; sobrescrevê-lo não.

1. ~~Gate 2 de acessibilidade: resta o item 2~~ ~~restam os itens 1 e 2,
   recontagem de 2026-08-05~~ **DEIXOU DE SER BLOQUEADOR EM 2026-08-06: o Gate 2
   está aprovado, 5/5** — item 1 fechado por caminhada nova (B8) e item 2
   fechado com a ressalva do estado ocupado (B4). O item 5 (navegação por
   teclado) já estava fechado em 2026-07-27 com a build web (task B3).
   O item 1 (Reduce Motion) tinha voltado a aberto sem que nada regredisse — a
   passagem de 07-26 mediu só a animação de entrada no caminho da lição e o
   critério cresceu em 08-03 para exigir a galáxia. **A caminhada nova foi feita
   em 08-06 e passou:** nada se move, tocar abre sem animação, e a distinção
   entre planeta ativo, disponível e bloqueado sobrevive à preferência, medida
   contra uma captura de base tirada antes de ligá-la
   ([evidência](../../radiant-app/docs/evidence/2026-08-06-b8-reduce-motion-iphone.md)).
   **O item 2 é o único aberto, e não fecha caminhando** — ver B4: o estado
   ocupado não é produzível nesta build, e a saída é decisão do dono.
   **Reverificado em 2026-08-03: segue aberto** — o
   `radiant-app/docs/ACCESSIBILITY_QA_V1.md` continua marcando o gate como não
   aprovado por esse item. Vale reordenar a prioridade: em 2026-08-02 um defeito
   real de VoiceOver (a apresentação inteira colapsada num único nó, com o aviso
   legal da ficha da loja inalcançável por leitor de tela) foi encontrado por uma
   asserção de E2E falhando — não pelo gate, que existe para pegar exatamente
   isso e não rodou.
   **Avançou em iPhone físico em 2026-08-05, mas continua aberto:** nome,
   posição/função e estado desabilitado foram ouvidos uma vez em controles
   reais, sem repetição espontânea. Não foi transcrita uma dica nem ativado um
   estado ocupado real, então a amostra não promove o item inteiro. Evidência em
   [`2026-08-05-testflight-1.3.1-build-5-iphone.md`](../../radiant-app/docs/evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md).
2. ~~Android sem projeto nativo (`expo prebuild` nunca executado); zero E2E
   Android.~~ **Falso desde 2026-07-28, e medido de novo em 2026-08-03.** O
   projeto nativo é gerado por `expo prebuild --platform android --no-install` e
   a suíte roda em emulador: **5 de 5 flows verdes** sobre APK Release local da
   versão 1.3.1, incluindo a apresentação de primeiro uso. Evidência em
   [`2026-08-03-e2e-1.3.1-ios-android.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md).
3. E2E ainda não reexecutado sob o perfil `preview`~~, que passou a refletir
   produção em 2026-07-27 (task B0.1)~~.
   **Reverificado em 2026-08-03: segue aberto.** Toda a evidência de device,
   inclusive a das duas plataformas desta data, foi colhida sob `e2e-test`. A
   única menção a `preview` está em
   [`2026-07-28-boot-to-home-devclient.md`](../../radiant-app/docs/evidence/2026-07-28-boot-to-home-devclient.md),
   que é verificação em dev-client — e o `E2E_RUNBOOK` é explícito em que uma
   execução em dev-client **nunca** promove plataforma.
   ~~Item de maior peso agora: o `e2e-test` desliga o beta gate, então nenhum
   flow exercita o caminho em que `first_run_started` é emitido antes de o gate
   ser avaliado.~~

   > **Premissa corrigida em 2026-08-03 (segunda revisão do dia).** O
   > **predicado** deste item continua verdadeiro — o E2E de fato nunca rodou sob
   > `preview` —, mas as duas frases riscadas acima são falsas, e a segunda foi
   > acrescentada pela própria reverificação de mais cedo. Medido no `eas.json` e
   > no site de composição da flag:
   >
   > - O gate aplicado é `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`
   >   (`src/app/_layout.tsx`), com
   >   `SHOW_DEV_TOOLS = __DEV__ || ENABLE_DEV_TOOLS` (`src/config.ts`). O
   >   `preview` declara **as duas** ligadas, então ele **também não aplica o
   >   gate**; o `production` declara `ENABLE_BETA_GATE=false`. **Nenhum dos cinco
   >   perfis do `eas.json` aplica o beta gate.** Rodar sob `preview` não
   >   exercitaria o caminho barrado, e portanto não fecha o buraco que a frase
   >   riscada dizia fechar.
   > - "`preview` reflete produção" nasce em
   >   [`archive/EXECUTION_STATUS_2026-07-27.md`](EXECUTION_STATUS_2026-07-27.md),
   >   **escopada a uma flag**: naquele dia `ENABLE_LEARNING_ROAD` passou a ser
   >   declarada em `preview` e `production`. A frase viajou sem o escopo. Em
   >   `ENABLE_DEV_TOOLS`, `ENABLE_TELEMETRY_DEBUG_SCREEN` e `ENABLE_BETA_GATE`,
   >   quem coincide com `production` é o **`e2e-test`**, não o `preview`.
   >
   > **✅ ENCERRADO em 2026-08-03 (quarta sessão).** A suíte foi medida sob
   > `APP_ENV=production` e `ENABLE_PUSH=true` nas duas plataformas: **6/6 no iOS
   > e 6/6 no Android**, incluindo um flow novo (`rating-prompt`) que é o único a
   > alcançar `MIN_APP_OPENS`. Evidência em
   > [`2026-08-03-e2e-producao-rating-prompt.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).
   >
   > **A premissa do item também estava errada, e de um jeito que importa.** Ele
   > dizia que o prompt de avaliação "nunca foi exercitado em device". O motivo
   > não era falta de execução: `RatingPromptService` conta `app_open`, e esse
   > evento tinha um único emissor, na home legada, inalcançável desde que a
   > Learning Road virou a home oficial. **Nenhuma build o emitia**, então o
   > prompt era inalcançável, não apenas não medido. Corrigido em `f499714`.
   > Nenhuma rodada de device teria fechado este item sem essa correção — a lição
   > é que "nunca medido" e "impossível" produzem exatamente a mesma evidência.

   > **O eixo real deste item**, e o que ele deve pedir daqui em diante: o
   > `e2e-test` difere de `production` em `EXPO_PUBLIC_APP_ENV`
   > (`development` vs `production`) e `EXPO_PUBLIC_ENABLE_PUSH` (`false` vs
   > `true`). O `APP_ENV` não é cosmético: ele desliga o selo BETA da home
   > (`HomeScreen.tsx`) e é a única condição em que o `RatingPromptService` não
   > retorna cedo (`APP_ENV !== 'production'` → early return), ou seja, **o
   > prompt de avaliação só existe em produção e nunca foi exercitado em
   > device**. Fechar este item é rodar a suíte sob essa configuração — não sob
   > `preview`, que é um proxy pior que o já usado.
4. ~~`JourneyMap` renderiza tema claro em tela escura e quebra rótulos no meio da
   palavra (task B2).~~ Corrigido em 2026-07-27 (task B2): tema `galaxyColors` e
   rótulos quebrando só em limite de palavra. O defeito de folga da tab bar foi
   resolvido em todas as telas roláveis nesta data (task B1).
5. ~~Nó de reward sem cobertura E2E (track ativo tem 7 lições; conquista só no
   final).~~ **Fechado no escopo de deep link em 2026-08-04** pelo flow
   `reward-locked.yaml`, verde nas duas plataformas (iOS 82s, Android 81s).
   Escrever a cobertura achou um defeito real antes de existir flow: a tela
   mostrava conquista bloqueada como "Pronta para ser coletada" com 0 de 14
   marcos, e o botão gravava `markNodeCompleted` — alcançável por deep link, de
   fora do app. Corrigido primeiro, coberto depois, porque um flow escrito antes
   teria feito o contrato **defender** o defeito. Evidência em
   [`2026-08-04-b5-reward-deep-link.md`](../../radiant-app/docs/evidence/2026-08-04-b5-reward-deep-link.md).
   ~~**A metade que continuava aberta:** a regra de destravamento, que exigiria
   percorrer as sete lições, seguia sem cobertura.~~ O registro de 2026-08-03
   permanece como histórico: nenhum flow do `.maestro` afirmava o nó, e o
   `maestro-contract.test.mjs` proibia afirmá-lo no caminho crítico, onde seria
   inalcançável. **Atualização de 2026-08-08:** o percurso real das sete lições
   passou no iOS 26.5; a repetição integral no Android API 36 continua pendente.
6. API pública inativa (HTTP 502) — ~~decisão de estratégia pendente (ADR da
   Task 15)~~ **decisão assinada; implantação pendente**.
   O registro de 2026-08-03 permanece como histórico: o
   `scripts/qa/docs-contract.mjs` reprova qualquer documento que afirme a API
   disponível. **Atualização de 2026-08-07:** a opção B foi aprovada na ADR da
   Task 15, mas ainda não foi implantada; a API pública continua em HTTP 502.
7. ~~Onboarding não aparece em instalação limpa — pendente de confirmação de
   intenção.~~ **Resolvido em 2026-08-02.** A confirmação veio e está em
   [`ADR-2026-08-02`](../adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md): o
   dono separou **wizard de setup** (segue removido) de **apresentação** (foi
   aprovada e construída). Instalação limpa agora vê três telas puláveis
   narradas pelo Pixel antes da Learning Road; o gatilho é a ausência da chave
   `@radiant/first_run_v1`, então instalação já existente vê uma vez. Detalhe no
   item B6 mais abaixo.
8. Dívidas rastreadas. ~~54 warnings de lint, 122 achados visuais no baseline,~~
   42 itens editoriais `formatNeedsReview`, ~~121 referências com caminho
   absoluto da máquina em docs.~~ **Remedido em 2026-08-03:** **11** warnings de
   lint (a B7 fechou em 2026-07-31), **83** achados visuais — dos quais 81 em
   baseline datada e 2 exceções de arquétipo, com **zero regressões** — e **59**
   ocorrências de caminho absoluto, em 13 arquivos. Os 42 itens editoriais
   **não** foram remedidos nesta data e seguem como o número herdado.
   **Atualizado em 2026-08-03 (segunda sessão):** das 59 ocorrências, as **5 que
   viviam em documentos operacionais foram corrigidas** (duas delas eram links
   markdown quebrados, não questão de estilo) e as **54 restantes ficam por
   decisão**: são blocos de comando de planos e evidências fechados, onde o
   caminho absoluto é registro do que foi executado. Ver a task D7. Os 42 itens
   editoriais são a D4, cuja triagem mostrou que a unidade real são 30 excertos.
9. ~~**Trilha de lojas inexistente:** sem conta Apple Developer/Play Console
   confirmada no plano, sem metadados, screenshots, política de privacidade
   hospedada, privacy labels, data safety, ou submissão de qualquer build.~~
   **Desatualizado desde 2026-07-30.** A preparação de loja foi feita: os doze
   screenshots publicáveis de iPhone existem em `docs/store/assets/`, com
   contrato de assets verificado por reversão, e há kit de convite de testadores.
   O que **continua aberto** neste item é a submissão em si — nenhum build foi
   enviado a nenhuma loja. Ver `archive/EXECUTION_STATUS_2026-07-29.md` §2 para o que já
   está pronto, e trate este item como "submissão pendente", não como "trilha
   inexistente".

---

## Lote de 2026-09-23 — piloto da lição híbrida implementado no branch

Saiu da seção "Bloqueios abertos, por frente" do [`STATUS.md`](../STATUS.md)
quando o piloto foi implementado no branch `feat/licao-hibrida-piloto`. Texto
original; só os links relativos foram reajustados ao novo diretório.

- **Currículo V3** — L1 aprovada no parecer v4. **L2 reprovada nas seis
  revisões** (a v6 em 2026-09-22), e a v7 **pausada** em 2026-09-23. O próximo
  passo é o **piloto da lição híbrida na L1**
  ([spec](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
  [ADR](../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)): 10 a 15 itens
  curtos, som e vibração, exercícios gerados por regra e teste com 3 a 5
  pessoas antes de escalar. Nada implementado.

---

## Lote de 2026-09-23 — caixa de `conteúdo/` nos scripts (PR #25)

Escrito pelo PR #25 sobre o `STATUS.md` anterior à consolidação e movido para
cá, sem edição, ao integrá-lo à `main` consolidada: as medições são histórico;
o `STATUS.md` guarda só a regra em vigor.

**Os testes de `scripts/content` não rodam em CI nenhum** — só parte deles
entra no `loop validate`, que roda no macOS, indiferente a caixa. Por isso
ninguém viu que o índice do git soletra `conteúdo/` (minúsculo, NFC) e cinco
scripts — mais o `assetPath` do `conteúdo/mídia/manifest.json` — liam
`Conteúdo/`. Num clone limpo (sem os dados locais de extração, como num CI)
em sistema de arquivos sensível a caixa, `node --test
scripts/content/*.test.mjs` dava **94/105** contra 101/105 no macOS.
Corrigido em 2026-09-23 no código e no manifesto, não no índice — renomear o
índice para `Conteúdo/` foi medido e piorava para 89/104, porque a maioria
dos scripts já lê em minúscula. Medido num volume APFS case-sensitive, Node
`v20.20.2`, depois da correção: **101/105 nos dois sistemas** em clone limpo,
**102/105** com os dados locais de `extrações`. As falhas restantes
(`foundation-structure` ×2, `register-source`, e uma quarta que só aparece
sem os dados locais) são as mesmas nos dois sistemas e não são de caixa.
Caminho novo em código: **`conteúdo/` minúsculo, em NFC**, como
`git ls-files` o mostra. `conteúdo/fontes/library-catalog.json` continua
citando `Conteúdo/*.pdf` de propósito: aponta para o acervo local, que não é
versionado.

---

## Lote de 2026-09-23 — integração dos PRs #22 a #26

Trechos do `STATUS.md` substituídos quando os cinco PRs entraram na `main`, sem edição:

A `main` está **94 commits e 198 arquivos à frente** do que está na App Store
(medido em 2026-09-23, `v1.3.1..78f96d0`). Nada disso chegou ao usuário:
vidas, assinatura StoreKit (Radiant Ilimitado), backup no iCloud (CloudKit) e o
currículo V3 (L1 e L2, ainda não ligados ao app).

  [ADR](adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)) foi
  **implementado em 2026-09-23 no branch `feat/licao-hibrida-piloto`**, ainda
  fora da `main` e sem build de distribuição: 12 itens gerados por regra, som e
  vibração, custo de vida só no desafio, rota `/licao-hibrida` atrás de
  `SHOW_DEV_TOOLS`. O V3 segue desligado. Bloqueio: a aprovação dos modelos
  pelo dono ([FILA](FILA.md)); depois, o teste com 3 a 5 pessoas antes de
  escalar. Revisado pela sessão local em 2026-09-23: gate no Mac com exit 0,
  147 suítes / 1345 testes, medido no branch.

strict. **Última medição: 2026-09-23**, em `b7aa165` (mesma árvore do app que a
`main` atual), Node `v20.20.2`: exit 0, **134 suítes / 1224 testes**, lint com
0 erros e 26 avisos, visual QA sem regressão.

- **Os testes de `scripts/content` não rodam em CI:** só no `loop validate`, no
  macOS, que não diferencia caixa.

Medido em 2026-09-23: `origin/main` em `78f96d0` (merge do PR #21). Nenhum PR
aberto antes desta consolidação.

Os branches locais já mergeados foram apagados em 2026-09-23. **As quatro
worktrees em `.claude/worktrees/` ficam**: cada uma guarda de 1 a 3 runs do
Loop em `.loop/runs/`, que o git ignora, e remover a worktree apagaria essa
evidência.
