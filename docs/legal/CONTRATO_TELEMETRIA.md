# Contrato de telemetria e privacidade — Radiant

> Insumo direto dos **privacy labels** (App Store) e do **data safety** (Google
> Play), e da [política de privacidade](politica-de-privacidade.md). Descreve o
> que o app pode registrar, o que é **proibido** registrar, e como isso é
> **imposto por teste** e **higienizado** antes de qualquer envio remoto.

**Última atualização:** 2026-07-27

## 1. Estado atual (verificado no código)

- A telemetria de uso fica **apenas no dispositivo** (`AsyncStorage`, chaves
  `telemetry.*.v1`). Não há adaptador de product analytics remoto registrado e
  `ENABLE_PRODUCT_ANALYTICS` é `false` — nenhum evento é enviado a um servidor de
  analytics.
- O **único** caminho pelo qual uma propriedade de evento pode sair do device é
  o **relatório de falhas (Sentry)**, que transforma cada evento em um breadcrumb.
  O Sentry está **desligado no perfil `production`** (sem `SENTRY_DSN` e com
  `ENABLE_CRASH_REPORTING=false`) e usa `sendDefaultPii=false`.
- Portanto, na build distribuída hoje, **nenhuma propriedade de telemetria sai do
  dispositivo**. Este contrato governa o comportamento correto para quando o
  relatório de falhas for habilitado (ex.: monitoramento crash-free no beta).

## 2. Allowlist de eventos

O **nome** de todo evento é restrito, em tempo de compilação, ao tipo
`TelemetryEventName` em
[`src/features/telemetry/telemetry.types.ts`](../../radiant-app/src/features/telemetry/telemetry.types.ts).
`TelemetryService.track(name, props)` só aceita nomes desse union — um nome novo
exige adicioná-lo ao tipo, o que torna a allowlist a fonte única e revisável.

Domínios de eventos hoje emitidos: ciclo de vida (`app_open`, `bootstrap_*`),
navegação (`screen_view`), aprendizado (`review_*`, `xp_awarded`,
`journey_track_selected`), onboarding (`onboarding_*`, `first_value_moment_reached`),
autenticação (`auth_*`), catálogo (`catalog_*`), sincronização (`sync_*`),
notificações (`push_*`), avaliação na loja (`rating_prompt_*`) e monetização
(`paywall_*`). Autenticação, sync, catálogo remoto e paywall correspondem a
recursos hoje **inativos** (sem API configurada / flags desligadas).

> **Correção datada de 2026-08-03 — `app_open` esteve declarado aqui sem ser
> emitido.** Este parágrafo afirmava o evento entre os "hoje emitidos", e a
> afirmação era falsa: o único ponto de emissão vivia na home legada
> (`HomeScreen`), que deixou de ser alcançável quando a Learning Road passou a
> ser a home oficial — `(tabs)/index.tsx` só renderiza a legada com
> `ENABLE_LEARNING_ROAD=false`, e nenhum perfil do `eas.json` declara isso.
> Nenhuma build emitiu `app_open` nessa janela. O evento voltou a ser emitido
> nesta data, agora pelo hook `useAppOpenLifecycle`, que ambas as homes
> consomem — a legada inclusive, para que desligar o kill switch não mova a
> responsabilidade de lugar outra vez.
>
> O que isso significa para o contrato com o titular dos dados: **menos** dado
> foi coletado do que este documento anunciava, nunca mais. Nenhuma promessa de
> minimização foi violada; a divergência era de completude, no sentido seguro.
> A janela não é datável com precisão porque o histórico do repositório está
> espremido no commit `847a12d`, que traz a troca de home e o ponto de emissão
> juntos.

## 3. Proibições de propriedades

As propriedades (`props`) de um evento só podem ser **enums/literais, contagens,
booleanos, durações e identificadores gerados pelo app**. É **proibido** passar:

- **PII**: nome, e-mail, telefone, CPF/documento, endereço.
- **Credenciais**: senha, token, secret, chave de API.
- **Conteúdo clínico ou livre**: texto de resposta de quiz, conteúdo de lição,
  dado de paciente, ou qualquer texto livre não auditável.

A lista de padrões de chave proibidos vive em
[`sanitizeTelemetryProps.ts`](../../radiant-app/src/features/telemetry/sanitizeTelemetryProps.ts)
(`PROHIBITED_KEY_PATTERNS`).

### Exceções revisadas

Chaves que casam com um padrão proibido por substring mas foram **auditadas** como
seguras ficam em `REVIEWED_SAFE_KEYS`, cada uma com justificativa. Hoje há uma:
`tokenPreviewAvailable` — um **booleano** que indica se um token de reset existe,
nunca o valor do token. Adicionar uma exceção é uma decisão explícita e rastreável.

## 4. Imposição (duas camadas)

1. **Prevenção — teste de contrato** que falha o build:
   [`telemetry-privacy-contract.test.ts`](../../radiant-app/src/features/telemetry/telemetry-privacy-contract.test.ts)
   varre todas as chamadas `TelemetryService.track(...)` do `src` e falha se
   qualquer chave de propriedade for proibida (respeitando as exceções revisadas).
   Roda no `npm test` / gate `app-test`, então nenhuma nova sessão consegue
   introduzir uma chave proibida sem quebrar o gate.
2. **Defesa em profundidade — scrub no Sentry**: o
   [adapter do Sentry](../../radiant-app/src/features/telemetry/adapters/SentryCrashReportingAdapter.ts)
   passa toda `data` de breadcrumb e todo `context` de captura por
   `sanitizeTelemetryProps`, que **remove chaves proibidas** e **descarta objetos e
   arrays aninhados** (risco de texto livre), mantendo só escalares seguros. O
   identificador de usuário enviado ao Sentry é apenas um `id` (sem e-mail), e
   `sendDefaultPii` fica desligado.

## 5. Mapeamento para as fichas das lojas

Com a configuração atual (Sentry desligado, sem analytics remoto, sem sync):

- **App Store — Privacy labels:** *Data Not Collected* pelo app. (A entrega de
  atualizações via Expo processa metadados técnicos de infraestrutura, não dados
  do usuário coletados pelo app.)
- **Google Play — Data safety:** nenhum dado coletado ou compartilhado.

Quando o **relatório de falhas (Sentry)** for habilitado:

- **App Store:** declarar **Diagnostics → Crash Data**, *não vinculado à
  identidade* e *não usado para rastreamento (tracking)*.
- **Google Play:** declarar **App info and performance → Crash logs**, coletados,
  não compartilhados, com trânsito criptografado; opcional para o usuário na
  medida em que o recurso puder ser desligado.

Se autenticação/sync forem ativados no futuro (ADR da API), este contrato e as
fichas precisam ser revistos para cobrir e-mail e progresso sincronizado.

## 6. Como evoluir com segurança

- **Novo evento:** adicione o nome a `TelemetryEventName`. Sem isso, `track` não
  compila.
- **Nova propriedade:** garanta que a chave e o valor sejam benignos (enum,
  contagem, booleano, duração, id). Se a chave casar com um padrão proibido mas
  for comprovadamente segura, adicione-a a `REVIEWED_SAFE_KEYS` com justificativa.
- **Nunca** passe texto livre, resposta de usuário, conteúdo clínico ou PII — o
  teste de contrato falha e o scrub removeria de qualquer forma.
