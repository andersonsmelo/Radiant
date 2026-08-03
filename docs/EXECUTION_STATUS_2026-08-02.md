# Radiant — Execution Status (2026-08-02)

Este documento **substitui [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md)**
como estado canônico. O snapshot anterior — estendido em 2026-07-30, 07-31 e
08-01 com todo o histórico de preparação de lançamento (loja, contas de
desenvolvedor, closed testing, entitlement de premium, currículo v2) —
**permanece histórico e não foi reverificado nesta sessão**. Esta sessão é uma
task de sinalização com escopo travado: registrar que a apresentação de
primeiro uso do Pixel foi entregue e validada em E2E, mover os ponteiros que
apontavam para o documento anterior, e nada além disso. Para o estado de
lançamento (Play Console, App Store Connect, testadores, entitlement,
currículo v2), o documento substituído continua sendo a fonte — nada ali foi
invalidado por este trabalho.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app
abre, oferece catálogo local, registra progresso e permite revisão mesmo
quando a API remota está ausente. A API pública em
`api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP 502) — estado
herdado do documento substituído, **não reverificado nesta sessão** — e não
está no caminho crítico do lançamento local-first.

## O que mudou nesta data — apresentação de primeiro uso do Pixel

A abertura do app mudou: **instalação limpa agora vê a apresentação do Pixel
antes da Learning Road.** A apresentação tem três telas puláveis, narradas
pelo mascote Pixel, explicando o método de estudo. O gatilho é a **ausência**
da chave `@radiant/first_run_v1` no `AsyncStorage`: uma instalação **já
existente**, que nunca teve essa chave, também vê a apresentação **uma vez**,
sem nenhum código de migração. A nova ordem de abertura é splash → bootstrap →
beta gate → apresentação → Learning Road.

A decisão de reintroduzir uma apresentação de primeiro uso — depois que a B6
do roadmap de lançamento havia recomendado ficar **sem** wizard de onboarding
— está registrada em
[`docs/adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md`](adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).
O ADR separa duas categorias que a B6 tratava como uma só: o wizard de setup
removido (que **coletava** preferências, não persistia e para o qual nenhuma
tela navegava — essa remoção segue valendo) e a apresentação de primeiro uso
(que apenas **explica** o produto, pulável em qualquer tela, sem coleta de
dados).

### E2E medido hoje

Execução em simulador iOS, commit `728ca8d`, build Release local (bundle
embutido, sem servidor de desenvolvimento), simulador `Radiant iPhone 17 Pro`
/ iOS 26.5, Maestro 2.7.0. Flows rodados sequencialmente, um por vez:

| Flow | Resultado |
| --- | --- |
| `first-run.yaml` | passou |
| `boot-to-home.yaml` | passou |
| `learning-critical-path.yaml` | passou |
| `offline-relaunch.yaml` | passou |
| `store-capture.yaml` | **falhou** — ver "Pendência" abaixo |

**Android não foi executado nesta sessão.** O estado `passed` de 2026-07-29
(`3/3 Flows Passed in 11m 48s`) é anterior à existência da apresentação e não
a cobre — a linha Android da matriz de sign-off precisa ser lida como **não
revalidada** contra este trabalho.

Evidência completa, receita reproduzível e detalhe da atribuição em
[`radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).
Matriz de sign-off atualizada em
[`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).

### Dois defeitos achados pela execução em dispositivo, ambos corrigidos

1. **Acessibilidade — defeito de produto.** `<View accessible
   accessibilityLabel={stepLabel}>` no `WelcomeSlide` colapsava a subárvore
   inteira num único nó de acessibilidade no iOS: título, corpo, rótulo da
   ilustração do Pixel e o aviso legal exigido pela ficha da loja não existiam
   para leitor de tela — só a posição (`Tela N de 3`) era falada. O
   `jest-expo` não modela esse colapso, então a suíte automatizada vinha
   passando havia três tasks sem detectar o problema. Corrigido compondo o
   rótulo do grupo com posição + título + corpo + footnote, sem duplicar
   pontuação. Commits `1a8fd59` e `b3f5684`.
2. **Seletor do Maestro.** O seletor é regex de correspondência **total**, não
   substring. Com o rótulo do grupo carregando a frase inteira, o padrão
   antigo do título isolado parou de casar. Corrigido ancorando os padrões na
   forma real do rótulo, com o contrato estático (`maestro-contract.test.mjs`)
   passando a exigir a forma ancorada **derivada de `SLIDES`** (lida direto de
   `WelcomeFlowScreen.tsx`) e a proibir a forma antiga. Commit `728ca8d`.

### Pendência aberta — `store-capture.yaml`, atribuída à guarda de visibilidade do primeiro quiz

`store-capture.yaml` falhou na seleção da alternativa do quiz. **Não é
regressão desta branch:** o diff desta branch nesse arquivo é uma linha (o
passo de dispensa da apresentação), e o ponto onde o flow de fato falhou — no
primeiro quiz, logo depois dos dois primeiros screenshots — usa o padrão
`runFlow when notVisible → scrollUntilVisible`, exatamente o padrão que o
commit `f7b602a` já havia **removido** do segundo quiz por ser cego a
oclusão: o Maestro não modela oclusão, o elemento fica "visível" para a
guarda mesmo por baixo do CTA flutuante, a guarda pula a rolagem e o toque
cai no botão errado — a assinatura exata do `0%` selecionado registrado na
falha. A rolagem fixa calibrada para iPhone 16 Plus e iPhone 11 Pro Max fica
no **segundo** quiz, passos depois do ponto onde o flow parou, e **nunca foi
alcançada** nesta execução. O flow irmão `learning-critical-path.yaml`, que
faz a mesma asserção, também usa `scrollUntilVisible`; a diferença real é que
o irmão não tem a guarda `runFlow when notVisible` e usa `centerElement: true`
em vez de `visibilityPercentage: 60`. Fica como pendência: revisar a guarda do
primeiro quiz em `store-capture.yaml` antes de depender dele para novos
screenshots a partir deste simulador.

### Outras pendências abertas, com a razão de cada uma ter ficado aberta

Acrescentado em 2026-08-03, ao encerrar a execução. Estes itens foram triados
pela revisão final da branch e **deliberadamente** não corrigidos; até aqui
existiam apenas no ledger de execução, que é `.gitignore`. Não são dívida
esquecida: cada um tem uma razão, e é a razão que decide se ainda vale quando
alguém reabrir o assunto.

**1. `first_run_started` é emitido antes de o beta gate ser avaliado.**
`FirstRunService.bootstrap()` roda dentro do `Promise.all` de abertura, e é ali
que o evento sai; o gate só é avaliado no render. Em perfis com
`EXPO_PUBLIC_ENABLE_BETA_GATE=true` — dois dos quatro do `eas.json` — quem é
barrado gera um `first_run_started` sem nenhum `first_run_step_viewed`
correspondente, e o funil de aquisição fica com um topo inflado. A **ordem de
renderização está correta** (o gate precede a apresentação); é só a telemetria
que precede o gate. Não foi corrigido porque a correção muda a semântica de
`bootstrap()` e o teste que a afirma, e pertence a um desenho de telemetria
consciente do gate — não a uma onda de correção de fim de branch.

**2. `onStepViewed` é uma arrow inline no call site do `_layout`.**
Uma função nova a cada render, e ela está nas dependências do `useEffect` que
emite `first_run_step_viewed`. Hoje é inócuo: o `RootLayout` não re-renderiza
enquanto a apresentação está montada, e o projeto não usa `StrictMode`
(verificado). Qualquer estado novo no `RootLayout` reemite o evento do mesmo
passo. É o mesmo risco de duplicata que o `useRef` do `bootstrap()` existe para
conter, deixado aberto no vizinho.

**3. O `accessibilityLabel` da ilustração do Pixel segue colapsado.**
A correção de acessibilidade compôs o rótulo do grupo com posição, título, corpo
e nota de rodapé — **não** com o rótulo da ilustração, que continua inalcançável
por leitor de tela por causa do agrupamento. Foi escolha consciente: incluí-lo
mudaria a string que `scripts/maestro-contract.test.mjs` ancora
(`Tela {i} de {N}. {título}`) e derrubaria o flow recém-validado em dispositivo.
A perda é pequena porque título e corpo já dizem o que a ilustração mostra.
Registrado também no [`E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).

**4. Minors de qualidade das tasks de implementação.** Nenhum bloqueia o merge;
a revisão final triou cada um como "segue aberto":

- `bootstrap()` do `FirstRunService` não tem guarda de reentrância própria — está
  mitigado no único call site, pelo `useRef` do `_layout`;
- `shouldShowWelcome()` chamado antes de `bootstrap()` devolve `true` por padrão
  seguro, sem comentário que documente a escolha;
- falha de `setItem` dentro de `markSeen()` não tem teste cobrindo (o erro já é
  engolido e o pior caso é a apresentação voltar uma vez);
- `dot`/`dotActive` do indicador de passo usam literais em vez de tokens — vem do
  próprio plano, e está coberto por baseline datada em
  `radiant-app/scripts/visual-qa-policy.json`;
- falta caso de teste para pular a partir da **segunda** tela (a primeira e a
  terceira estão cobertas; o passo é `index + 1`, sem ramo próprio);
- a combinação `ENABLE_BETA_GATE=true` com `SHOW_DEV_TOOLS=true` não tem teste (é
  um `&&`, e os dois lados já têm caso);
- concorrência real de dois `bootstrap()` paralelos segue sem teste, por não haver
  gatilho no app hoje;
- duas linhas em branco consecutivas sobrando em `OnboardingService.ts`.

**Item encerrado por premissa falsa**, registrado para ninguém recarregá-lo: a
suspeita de que o `<Modal>` do React Native montaria a subárvore do
`WelcomeFlowScreen` mesmo com `visible={false}`. A fonte do RN foi lida:
`render()` devolve `null` quando o modal não deve aparecer. O componente **não**
monta a cada render do `ProgressScreen`.

## Herdado do documento substituído (não reverificado nesta sessão)

Todo o estado de preparação de lançamento — contas de desenvolvedor Play
Console e App Store Connect, closed test Android, TestFlight iOS,
entitlement de premium (ADR-2026-08-01), currículo por competências v2 (Tasks
4 a 9) — está descrito em
[`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md) e não foi
tocado, medido ou invalidado por este trabalho. Este documento não o repete
para não arriscar divergir dele por transcrição; quem precisar desse estado
deve ler o documento substituído.

## Ponteiros

- Decisão de produto: [`ADR-2026-08-02`](adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).
- Evidência E2E de hoje: [`radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).
- Runbook Maestro atualizado: [`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).
- Plano de implementação: [`docs/superpowers/plans/2026-08-02-primeiro-uso-pixel.md`](superpowers/plans/2026-08-02-primeiro-uso-pixel.md).
- Item B6 do roadmap de lançamento, com a confirmação do dono:
  [`docs/plans/2026-07-27-radiant-launch-roadmap.md`](plans/2026-07-27-radiant-launch-roadmap.md).
