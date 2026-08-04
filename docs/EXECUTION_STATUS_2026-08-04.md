# Radiant — Execution Status (2026-08-04)

Este documento **substitui [`EXECUTION_STATUS_2026-08-02.md`](EXECUTION_STATUS_2026-08-02.md)**
como estado canônico.

Aquele documento resistiu, com razão, a ganhar um sucessor em 2026-08-03: era o
mesmo corpo de trabalho, um dia depois, e criar um sucessor obriga a mover seis
ponteiros. O que mudou agora é que ele acumulou **quatro adendos** e o corpo de
trabalho é outro — uma varredura de defeitos aberta por smoke instrumentado, não
a continuação da apresentação de primeiro uso. Um quinto adendo tornaria o
documento ilegível para quem chega a triar. Os seis ponteiros foram movidos.

Tudo que o documento substituído registra continua valendo e **não foi
reverificado aqui**, exceto onde esta página diz o contrário.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. Abre,
oferece catálogo local, registra progresso e permite revisão sem API remota.

A API pública em `api.radiant.ascendcreative.com.br` responde **HTTP 502**,
**remedido em 2026-08-04**. A medição acrescenta um detalhe que o estado anterior
não tinha: ela responde em 0,27s, ou seja o domínio resolve e há gateway de pé —
o que está fora é o upstream, não a infraestrutura.

## O que mudou desde 2026-08-02

### E2E passou a ser medido sob configuração equivalente a produção

Pela primeira vez a suíte foi colhida com `APP_ENV=production` e
`ENABLE_PUSH=true` — as **únicas duas** diferenças de runtime entre `e2e-test` e
`production`. Resultado: **6 de 6 no iOS e 6 de 6 no Android**, versão 1.3.1 (3)
conferida nos binários instalados dos dois lados. Isso fechou o item 3 dos
bloqueadores e a defasagem de 11 commits entre a evidência e o HEAD.

Detalhe em
[`2026-08-03-e2e-producao-rating-prompt.md`](../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).

**A prova de que a build rodou sob produção não veio de `strings` no bundle** — ele
é Hermes e a tabela de literais não distingue a inlinada. Veio do aparelho:
`build_channel=production` em todo evento do prompt de avaliação.

### Três defeitos reais, achados e corrigidos

**1. O ciclo de vida de abertura não existia no app distribuído** (`f499714`).
`app_open` tinha um único emissor, na `HomeScreen` legada, que `(tabs)/index.tsx`
só renderiza com `ENABLE_LEARNING_ROAD=false` — e nenhum dos cinco perfis declara
isso. **Nenhuma build emitia o evento.** Com ele faltavam `markDayOpen()`, único
inicializador de `cohort.installDate`, e o reset de backoff de push.

Consequências medidas: `RatingPromptService` e `PaywallService` travados em
`insufficient_sessions`, o paywall somando `missing_install_date`, e retenção
D1/D7 sem base. Três documentos afirmavam o evento como emitido, inclusive o
[contrato legal de telemetria](legal/CONTRATO_TELEMETRIA.md) — a divergência foi
de **completude no sentido seguro**: coletou-se menos do que o anunciado, nunca
mais.

Migrado para o hook `useAppOpenLifecycle`, consumido pelas duas homes.
`checkHeuristics()` ficou **deliberadamente de fora** — renderiza nudges, é
decisão de produto.

**2. A barra de status era ilegível em todo o app** (`b62f529`). `_layout.tsx`
declarava `<StatusBar style="dark" />` nos cinco ramos; no `expo-status-bar`,
`dark` significa conteúdo **escuro**, o valor para fundo **claro**. O app pinta
`#03030d`. Contraste medido: **1,02:1**, contra 20,53:1 que o conteúdo claro
teria. Com `edgeToEdgeEnabled: true` o app desenha atrás da barra, então o estilo
é responsabilidade dele.

**3. Conquista bloqueada podia ser coletada por deep link** (`130d8ea`).
`radiantapp://reward?nodeId=…` — esquema invocável de fora do app — alcançava um
nó bloqueado, a tela dizia "Pronta para ser coletada" com 0 de 14 marcos, e o
botão gravava `markNodeCompleted`. A guarda existia em `loadSnapshot` e não havia
viajado para o caminho de coleta.

### Os 18 assets publicáveis foram regerados

O defeito nº 2 estava assado em **todos** os screenshots de loja: 6 do Play e 12
dos dois buckets de iPhone. **O contrato de assets os aprovava 14/14**, porque
mede dimensão, proporção, peso e presença — nunca legibilidade.

| Conjunto | Aparelho | Tamanho |
| --- | --- | --- |
| Play | emulador API 36 a `wm size 1080x1920` | 1080×1920 |
| App Store 6,7" | simulador iPhone 16 Plus | 1290×2796 |
| App Store 6,5" | simulador iPhone 11 Pro Max | 1242×2688 |

Os simuladores da receita anterior não existiam mais neste Xcode; foram recriados
como *device types* no runtime iOS 26.5. O `normalize-screenshots.py` é
**validador, não conversor** — tamanho exato ou recusa.

## Versão e builds — leia antes de submeter

`app.json` em **1.3.1**. O `versionCode` do arquivo (`3`) é **decorativo**:
`cli.appVersionSource: "remote"` e `autoIncrement` no perfil `production` colocam
o contador no servidor do EAS.

| Artefato | Estado |
| --- | --- |
| Lojas | `1.3.0 (4)` na faixa `alpha` |
| AAB `1.3.1 (5)` | **não usar** — precede a correção da barra de status |
| AAB `1.3.1 (6)` | **não usar** — inclui a barra de status, mas **precede** a correção da conquista |

**Nenhuma build existente serve para submissão.** A próxima sai como `(7)`.

## ⚠️ A matriz de sign-off precede o HEAD outra vez

Os 6 flows foram medidos em `b9c77f4`; o `reward-locked` em `130d8ea`. As
correções nº 2 e nº 3 landaram **depois** da rodada de 6 flows, e a nº 2 toca
`_layout.tsx`, que é a raiz de toda tela.

Nada indica regressão — `npm run quality` passa, os contratos passam, e a suíte
tem hoje **7 flows**. Mas pela regra deste projeto, contrato estático não promove
plataforma: **a suíte precisa ser reexecutada antes de o placar valer para
submissão.**

Esta é a terceira vez que essa defasagem aparece. O padrão não é descuido: toda
correção depois da medição a recria. A saída estrutural seria medir imediatamente
antes de submeter, e não tratar a matriz como estado durável.

## Aberto

1. **F2** — opt-ins do closed test. 14 vinculadas, 2 participando; faltam ≥10
   para o piso de 12, e só aí começam os 14 dias. **Vínculo não é adesão.**
   Caminho crítico; nenhum trabalho de engenharia o encurta.
2. **D1** — [`ADR-2026-08-04`](adr/ADR-2026-08-04-estrategia-da-api.md) escrito,
   aguardando a linha do decisor. Recomenda decidir **antes da E3**, porque
   contas mudam privacy labels e Data safety.
3. **A5** — resta gerar a service-account key. `radiant-app/credentials/` está
   vazia. Não bloqueia publicar: o AAB vai pelo console.
4. **B4**, **C4/C5**, **E3/E4** — exigem humano ou hardware.
5. **B5** — fechada só no escopo de deep link; a regra de destravamento (7
   lições) segue sem cobertura.
6. Menores registrados: `checkHeuristics()` sem fiação; `eyebrow` do
   `JourneyHero` quebrando no meio da palavra a 2× de escala; e o arquivo enviado
   ao EAS com 856 MB, que um `.easignore` resolveria — mas
   `radiant-app/.easignore` não está em `writePolicy.allowedRoots`, então widening
   da policy é run próprio e decisão do dono.

## Herdado, não reverificado

Todo o estado de preparação de lançamento — contas de desenvolvedor, TestFlight,
entitlement premium (ADR-2026-08-01), currículo v2 — está em
[`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md), com o
histórico de 08-02 no documento substituído. Nada ali foi tocado por este
trabalho.
