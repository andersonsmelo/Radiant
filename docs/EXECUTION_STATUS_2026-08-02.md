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

**Exceção atualizada em 2026-08-03:** o estado do closed test Android foi
reverificado diretamente no Play Console e está registrado na seção própria
abaixo. Essa evidência mais recente substitui, somente para a contagem de contas
vinculadas e opt-ins, o estado herdado de 2026-07-29.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app
abre, oferece catálogo local, registra progresso e permite revisão mesmo
quando a API remota está ausente. A API pública em
`api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP 502) — estado
herdado do documento substituído, **não reverificado nesta sessão** — e não
está no caminho crítico do lançamento local-first.

## Atualização operacional de 2026-08-03 — closed test Android

O Play Console confirmou a faixa fechada `alpha` como ativa, com a versão
`1.3.0 (4)`. A lista selecionada foi medida com **14 contas vinculadas**, o que
confirma a margem operacional da task A6. O painel do app mostrou separadamente
**2 testadores participando no momento**.

Vínculo não equivale a opt-in. Portanto, **A6 está concluída, mas F2 permanece
aberta**: faltam pelo menos 10 opt-ins para atingir o piso de 12 e, a partir
desse piso, comprovar 14 dias consecutivos sem cair abaixo dele. Nenhum endereço
de testador foi persistido ou reproduzido no repositório.

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
| `store-capture.yaml` | **falhou** nesta data — corrigido e verde em 2026-08-03, ver adendo |

**Android não foi executado nesta sessão.** O estado `passed` de 2026-07-29
(`3/3 Flows Passed in 11m 48s`) é anterior à existência da apresentação e não
a cobre — a linha Android da matriz de sign-off precisa ser lida como **não
revalidada** contra este trabalho. *(Deixou de valer em 2026-08-03: o Android foi
medido contra a apresentação e fecha 5 de 5. Ver o adendo abaixo.)*

Evidência completa, receita reproduzível e detalhe da atribuição em
[`radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).
Matriz de sign-off atualizada em
[`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).

### Três defeitos achados pela execução em dispositivo, todos corrigidos

> **O terceiro foi acrescentado em 2026-08-03.** Ele foi achado e corrigido em
> 2026-08-02 (`90a1377`), dentro deste mesmo corpo de trabalho, mas não chegou a
> nenhum documento: existia apenas no comentário do código e no seu teste. Uma
> sessão de 2026-08-03 o encontrou num prompt de continuidade não versionado e
> constatou que essa era a única cópia narrativa. Como a correção já estava
> aplicada, o defeito não se reanunciava — este registro existe para que a razão
> dele sobreviva à perda daquele prompt.

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
3. **Onboarding sequestrado por `markSeen()` — defeito de produto.**
   `FirstRunService.markSeen()` chamava `OnboardingService.dismissIntro()` sem
   `init()` antes. O `dismissIntro()` grava o estado direto em disco, e sem o
   `init()` esse estado ainda é o default, com `startedAt: null`. Em instalação
   limpa — o caminho que a própria apresentação de primeiro uso criou — essa era
   a primeira gravação da vida do app na chave do onboarding, e ela matava
   `onboarding_start`, o estágio do coach (`getStage()` passa a responder
   `graduated` para sempre) e o encerramento de Dia 7. Como o defeito nº 1, era
   invisível para a suíte: o teste mockava o `OnboardingService` e só afirmava
   que `dismissIntro` fora chamado, sem afirmar ordem. Corrigido com
   `await OnboardingService.init()` antes do `dismissIntro()`, teste de ordem via
   `invocationCallOrder` e cobertura própria no `OnboardingService`. Commits
   `90a1377` e `dfa8bdb`. Detalhe em
   [`2026-08-02-e2e-primeiro-uso.md`](../radiant-app/docs/evidence/2026-08-02-e2e-primeiro-uso.md).

### ~~Pendência aberta~~ — `store-capture.yaml`, atribuída à guarda de visibilidade do primeiro quiz

> **Encerrada em 2026-08-03 (`da877b2`).** A atribuição abaixo estava correta e a
> guarda foi substituída pelo `scroll` fixo; o flow passa nas duas plataformas.
> O texto segue como registro datado do diagnóstico. Ver o adendo de 2026-08-03,
> mais abaixo.

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
que o evento sai; o gate só é avaliado no render. ~~Em perfis com
`EXPO_PUBLIC_ENABLE_BETA_GATE=true` — dois dos quatro do `eas.json` — quem é
barrado gera um `first_run_started` sem nenhum `first_run_step_viewed`
correspondente, e o funil de aquisição fica com um topo inflado.~~ A **ordem de
renderização está correta** (o gate precede a apresentação); é só a telemetria
que precede o gate. Não foi corrigido porque a correção muda a semântica de
`bootstrap()` e o teste que a afirma, e pertence a um desenho de telemetria
consciente do gate — não a uma onda de correção de fim de branch.

> **Impacto reclassificado em 2026-08-03: o defeito é latente, não ativo.** A
> frase riscada media a flag declarada, e não o gate aplicado. O valor que vale é
> `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS` (`src/app/_layout.tsx`), com
> `SHOW_DEV_TOOLS = __DEV__ || ENABLE_DEV_TOOLS` (`src/config.ts`): os dois
> perfis que ligam o gate (`development`, `preview`) ligam **também** o
> `ENABLE_DEV_TOOLS`, e os outros (`e2e-test`, `production`) declaram o gate
> `false`. **Nenhum dos cinco perfis do `eas.json` aplica o beta gate**, logo
> ninguém é barrado e nenhum funil está inflado hoje. O defeito acorda no dia em
> que existir um perfil com `ENABLE_BETA_GATE=true` e `ENABLE_DEV_TOOLS=false` —
> e é aí que ele custa. Mantido aberto por isso, com prioridade menor do que a
> redação anterior sugeria.

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

### Dois falsos positivos de configuração, verificados — não recarregar

Acrescentado em 2026-08-03. Uma sessão leu o `radiant-app/eas.json` enquanto
trabalhava na F2, apontou dois "defeitos" e reportou os dois **antes** de
procurar a razão deles na documentação. Ambos são deliberados e já estavam
registrados. Ficam aqui porque a leitura errada é natural — o `eas.json` não
carrega a razão dentro de si, e quem chega pela F2 não passa pelos runbooks de
loja no caminho.

1. **`submit.production.android.track` diz `internal`, e o closed test roda na
   faixa `alpha`.** Parece apontar para a faixa errada. **É deliberado:** o fluxo
   é subir em internal para validar o pipeline e **promover** para a faixa
   fechada no Console. Documentado em
   [`docs/store/RUNBOOK_PLAY_CONSOLE.md`](store/RUNBOOK_PLAY_CONSOLE.md), seção
   *"Parte 6 — O relógio de 14 dias só corre no track fechado"*, que diz na
   tabela que internal **não conta** para os 14 dias e afirma logo abaixo que
   *"os dois valores são deliberados"*; também em
   [`docs/store/EAS_SUBMIT_SETUP.md`](store/EAS_SUBMIT_SETUP.md) e na linha do
   *track de teste fechado* da tabela final de
   [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md).
   Mudar o `track` para `alpha` desfaria uma decisão tomada com contexto que o
   arquivo não expressa.
2. **O `versionCode`/`buildNumber` do `app.json` (hoje `3`) não é o que vai para
   a loja.** O `eas.json` declara `cli.appVersionSource: "remote"` e o perfil
   `production` usa `autoIncrement`: o contador vive no servidor do EAS, e o
   campo do `app.json` é **decorativo** — editá-lo não muda o AAB, e lê-lo para
   responder "qual é o versionCode" dá resposta errada. O valor real sai de
   `eas build:list`. Já registrado na linha *"`versionCode` — quem governa"* da
   tabela final de
   [`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md).
   O `3` **é** verdadeiro para as builds Release **locais**, que são as que
   geraram o E2E 5/5 — daí a confusão: o número é real, só não é o da loja.

A regra que os dois casos ensinam, e que vale além deles: **a ausência de
explicação onde você procurou não é evidência de escolha não considerada.** Antes
de classificar um valor de configuração como defeito, procure o valor literal na
prosa do repositório — é onde a intenção mora, e é a superfície que as
ferramentas de código nunca tocam.

## Adendo 2026-08-03 — versão 1.3.1 e E2E medido nas duas plataformas

Acrescentado a este documento em vez de criar um `EXECUTION_STATUS_2026-08-03`
de propósito: é o mesmo corpo de trabalho, com um dia de diferença, e criar um
sucessor obrigaria a mover de novo os seis ponteiros que apontam para o status
canônico — churn que já produziu um achado de revisão nesta mesma linha de
trabalho. Se o próximo marco for de outro assunto, aí sim ele merece documento
próprio.

### Versão

`1.3.0` → **`1.3.1`**, build/`versionCode` `2` → `3` (commit `68bd097`).

Escolhido `1.3.1` e não `1.4.0` deliberadamente: o roadmap de lançamento e o
`ADR-2026-08-02` reservam a **v1.4** para o elo de conta e o premium, que este
trabalho não entrega. Subir para `1.4.0` consumiria o número que aqueles
documentos usam para outro marco.

A versão foi conferida **no binário instalado**, não só no `app.json`: iOS
`CFBundleShortVersionString 1.3.1`, Android `versionName=1.3.1` via
`dumpsys package`.

### E2E — as duas plataformas, **5 de 5 cada**

| Plataforma | Resultado |
| --- | --- |
| iOS 26.5 (iPhone 17 Pro) | `first-run`, `boot-to-home`, `learning-critical-path`, `offline-relaunch`, `store-capture` — todos verdes |
| Android API 36 (Pixel 9) | os mesmos cinco, todos verdes |

**O Android deixou de estar não revalidado.** A linha anterior deste documento
dizia que o `passed` de 2026-07-29 era anterior à apresentação e não a
exercitava; agora foi medido contra ela.

Detalhe completo, com tempos, as três rodadas do Android e as atribuições, em
[`radiant-app/docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md`](../radiant-app/docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md).

### Um defeito de flow corrigido, que só o Android expôs

`offline-relaunch` dava dois `tapOn: Continuar` seguidos e emendava direto num
`scrollUntilVisible`. No Maestro, `assertVisible` **é** a espera: sem ela a
rolagem começava antes de o passo do quiz existir na árvore e estourava o
timeout. No iOS nunca apareceu — a tela monta em ~0,1s. No Android, ~5× mais
lento, falhou 2 de 2, enquanto o flow irmão, que já intercalava as asserções,
passou no mesmo emulador e na mesma execução.

Corrigido em `970ffb6`, com um contrato novo que exige `assertVisible` antes de
todo `scrollUntilVisible` nesses flows. O contrato prende a **espera**, não o
tempo: subir o timeout esconderia o defeito e manteria uma corrida que o iOS
ganha e o Android perde.

### O `store-capture` também fechou, ainda em 2026-08-03

Ele era o último vermelho, nas duas plataformas, pela mesma causa e por defeito
**anterior** a este trabalho: a guarda `runFlow when notVisible` do primeiro quiz
é cega a oclusão. Corrigido em `da877b2` e medido verde nos dois lados — iOS
416s, Android 557s.

A guarda **não era descuido**, e isso é o que vale carregar adiante: ela existia
porque a 1080×1920 a alternativa já nasce visível e a lista não rola, e ali um
`scrollUntilVisible` com `centerElement` falha por não conseguir centralizar.
Copiar o padrão do flow irmão teria reintroduzido esse defeito. A saída estava
dentro do próprio arquivo — o commit `f7b602a` já resolvera o mesmo problema no
**segundo** quiz com um `scroll` fixo, que é no-op onde não há para onde rolar e
levanta o elemento onde ele está ocluso. O contrato agora exige
`scrollUntilVisible` como passo de topo, nunca sob condicional.

Com isso, **a pendência da seção anterior está encerrada** — ela descreve o
estado de 2026-08-02 e permanece como registro datado, não como item aberto.

### Achado de infraestrutura

Com **apenas** o emulador Android rodando, este host de 16 GB fica com ~130 MB de
RAM livre e 3,6 GB dos 4 GB de swap em uso. Três falhas da primeira rodada Android
eram timeouts que sumiram ao liberar memória. A regra "não rode as duas
plataformas juntas" virou, no `E2E_RUNBOOK`, um orçamento explícito de host — com
o corolário de que **num host sob pressão, um timeout não prova defeito**:
compare o tempo do flow com a linha de base antes de atribuir causa.

## Adendo 2026-08-03 (segunda sessão) — o beta gate não é aplicado por nenhum perfil

Achado ao reler os bloqueadores para escolher o próximo trabalho. Três documentos
raciocinavam sobre `EXPO_PUBLIC_ENABLE_BETA_GATE` pelo **valor declarado** no
`eas.json`, inclusive contando perfis. O valor que vale é composto:

```
shouldEnforceBetaGate = ENABLE_BETA_GATE && !SHOW_DEV_TOOLS   // src/app/_layout.tsx
SHOW_DEV_TOOLS        = __DEV__ || ENABLE_DEV_TOOLS           // src/config.ts
```

| Perfil | `BETA_GATE` | `DEV_TOOLS` | Gate aplicado? |
| --- | --- | --- | --- |
| `development` | `true` | `true` | **não** |
| `development-simulator` | herda | herda | **não** |
| `e2e-test` | `false` | `false` | **não** |
| `preview` | `true` | `true` | **não** |
| `production` | `false` | `false` | **não** |

**Nenhum dos cinco aplica o gate.** Consequências já propagadas: o item 1 de
"Outras pendências abertas" foi reclassificado como latente, e a premissa do item
3 dos bloqueadores do roadmap foi corrigida — rodar E2E sob `preview` não
exercita o caminho barrado, porque `preview` também não aplica o gate.

Corrigido nesta data um defeito real que caía da mesma leitura: o painel de
homologação do `ProgressScreen` exibia `Beta Gate: ativo` a partir da flag crua.
Como o painel só renderiza sob `SHOW_DEV_TOOLS` e o gate só é aplicado sem ele,
**"ativo" era inalcançável por construção** — a linha anunciava o contrário do que
a build fazia, exatamente para quem abria o painel em busca de evidência. É a
mesma classe de defeito de honestidade corrigida em 2026-07-27 para o `Sync
remoto`, que é a linha **imediatamente abaixo** dela e já mostrava o estado
efetivo. Agora exibe três estados (`ativo` / `ligado, bypass por dev tools` /
`desativado`), com teste irmão do que cobre o sync.

A regra que este caso acrescenta à da seção anterior: **um valor declarado só é o
comportamento quando nada o compõe.** Onde há composição, contar declarações mede
a intenção de quem escreveu a configuração, não o que o programa faz — e a tela
que exibe a declaração como se fosse o estado mente com a autoridade de um
instrumento.

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
