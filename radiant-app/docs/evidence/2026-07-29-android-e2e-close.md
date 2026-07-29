# E2E em device — Android `passed`, iOS reconfirmado — 2026-07-29

**Task:** B0.1 / Onda C (C3), linha Android da matriz.
**Resultado:** **Android `passed` — 3/3 Flows Passed in 11m 48s**; **iOS reconfirmado
`passed` — 3/3 Flows Passed in 7m 32s** sobre os mesmos flows corrigidos. Fecha o
E2E do fluxo crítico local-first nas duas plataformas.

Continuação de [`2026-07-28-android-e2e-first-run.md`](2026-07-28-android-e2e-first-run.md),
onde o Android ficou `app-failed` (2/3) e o iOS já era `passed` sob o mesmo commit.

## O que travava e o que foi corrigido

Fechar o Android exigiu **dois defeitos reais** de E2E e a resolução de **uma causa
ambiental**. Nenhum era o app quebrando o fluxo — os três flows exercitam o mesmo
loop local-first que já passava no iOS.

### 1. Seletor da aba acoplado ao formato do iOS (o defeito herdado)

`learning-critical-path.yaml` terminava com `tapOn: 'Progresso, tab.*'`, que afirma o
nome de acessibilidade que **só o iOS compõe** (`"Progresso, tab, 3 of 4"`); no Android
a aba expõe só `Progresso`. A correção prescrita na evidência anterior — alargar para
`.*Progresso.*` — **quebrava as duas plataformas**: o Maestro casa texto
*case-insensitive*, e a home tem a legenda **"Seu progresso fica salvo no aparelho…"**
(contém "progresso") acima da aba na árvore, então o `tapOn` caía na legenda e a tela de
Progresso nunca abria. Seletor final, **ancorado**: `^Progresso(, tab.*)?$` — casa só a
aba nas duas plataformas. Confirmado por probe em iOS e Android; travado no contrato.

### 2. CTAs abaixo da dobra oclusos pela tab bar flutuante (o defeito que só o Android rápido revela)

Os CTAs de rodapé (`Abrir checkpoint`, `Concluir checkpoint`, `Abrir próxima lição`)
ficam abaixo da dobra em telas que têm a tab bar flutuante (`position: absolute`). O
padrão `repeat while notVisible: scroll` para no instante em que o CTA entra na árvore —
que, num emulador **rápido**, o deixa parado **sob** a tab bar. Medição na home Android
(tela 1080×2424): CTA "Abrir checkpoint" em **y2212–2277**, tab bar em **y2198–2387** —
sobreposição total. O `tapOn` cai na barra e a navegação não acontece (`assertVisible:
Checkpoint` falha). O iOS e o emulador **lento** passavam por acaso, porque o timing do
scroll deixava o CTA mais alto. **Correção:** um `- scroll` extra (nível do flow, depois
do `repeat`) antes de cada `tapOn`, levantando o CTA acima da barra. Travado no contrato
(`maestro-contract.test.mjs` exige o lift-scroll antes de cada tap).

### 3. Causa ambiental: host sem RAM (o que fazia o emulador rastejar/travar)

Durante a investigação, o emulador Android chegou a **travar 8 horas** num retry e a
levar 33 min por flow. A causa não era o flow: o host tem **16 GB**, e rodar o
**simulador iOS** (186 processos) **junto** com o emulador Android esgotava a RAM
(~53 MB livres, >1 M swapouts — *swap thrashing*), fazendo o emulador rastejar. Desligar
o simulador iOS e dar cold-boot no emulador derrubou o boot de **5m42s para 12s**.
**Aprendizado operacional:** rodar E2E de **uma plataforma por vez** (nunca sim iOS +
emulador Android em paralelo neste host), e envolver toda suíte num *watchdog* de timeout.

## Execução (sequencial, emulador saudável, uma plataforma por vez)

| Flow | Android (emulador `Radiant_Pixel_9_API_36`) | iOS (`Radiant iPhone 17 Pro`, sim) |
| --- | --- | --- |
| `boot-to-home` | **passed** (24s) | **passed** (13s) |
| `learning-critical-path` | **passed** (10m) | **passed** (4m 56s) |
| `offline-relaunch` | **passed** (1m 24s) | **passed** (2m 23s) |
| **Total** | **3/3 em 11m 48s** | **3/3 em 7m 32s** |

Ambos sobre build local (APK Release Android com bundle embutido; build Release local do
simulador iOS), sem dev client e sem Metro — o equivalente ao perfil `e2e-test`.

## Estado por plataforma

- **iOS:** `passed` (reconfirmado com os flows corrigidos).
- **Android:** `passed` — build produzido e instalado, 3/3 flows verdes em execução
  isolada no emulador saudável.

**Responsável:** engenharia — 2026-07-29.
