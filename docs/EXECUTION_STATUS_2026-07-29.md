# Radiant — Execution Status (2026-07-29)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app abre,
oferece catálogo local, registra progresso e permite revisão mesmo quando a API
remota está ausente.

Este documento substitui [`EXECUTION_STATUS_2026-07-28.md`](EXECUTION_STATUS_2026-07-28.md)
como estado canônico; o snapshot anterior permanece histórico. Ele registra duas
mudanças de estado desta data: (1) o **E2E do fluxo crítico fechou nas duas
plataformas** (iOS 3/3 e Android 3/3), encerrando B0.1/C3/M2; e (2) uma **ofensiva
de aceleração de lançamento** que deixou toda a preparação de loja pronta até o
ponto em que só falta a ação do usuário (contas, hospedagem, testadores).

A API pública em `api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP
502) e **não está no caminho crítico** do lançamento — o produto lançável é
local-first. Esta execução não tocou VPS, DNS, proxy, banco ou serviço remoto.

## O que mudou desde 2026-07-28

### 1. E2E do fluxo crítico fechado nas duas plataformas

`3/3 Flows Passed` em **iOS (7m32s)** e **Android (11m48s)**, em execuções limpas e
isoladas sobre build local Release (bundle embutido, sem dev client, sem Metro).
Fechar o Android exigiu **dois defeitos reais de E2E** e a resolução de **uma causa
ambiental**:

- **Seletor de aba acoplado ao iOS.** `learning-critical-path` terminava em
  `tapOn: 'Progresso, tab.*'` (formato que só o iOS compõe). A correção prescrita
  na evidência anterior (`.*Progresso.*`) quebrava **as duas** plataformas: o
  Maestro casa texto *case-insensitive* e a legenda da home "Seu progresso fica
  salvo…" casava antes da aba. Seletor final ancorado: `^Progresso(, tab.*)?$`.
- **CTAs abaixo da dobra oclusos pela tab bar flutuante.** No emulador rápido, o
  `repeat while notVisible: scroll` para com o CTA sob a tab bar (medido: CTA em
  y2212–2277 vs barra y2198–2387), então o tap caía na barra. Correção: um
  `- scroll` de elevação antes de cada tap (`Abrir checkpoint`, `Concluir
  checkpoint`, `Abrir próxima lição`).
- **Host sem RAM.** Rodar o simulador iOS e o emulador Android juntos num host de
  16 GB esgotava a memória (swap thrashing), fazendo o emulador rastejar/travar.
  Regra: rodar E2E de **uma plataforma por vez**, com watchdog de timeout.

As duas regressões estão travadas em `radiant-app/scripts/maestro-contract.test.mjs`.
Detalhe e evidência em
[`docs/evidence/2026-07-29-android-e2e-close.md`](../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
O contrato de glifos de ícone também foi alargado para varrer `components/` e
`src/components/` (o ponto cego dos defeitos de ícone de 07-28), excluindo os
wrappers sancionados.

### 2. Aceleração de lançamento — preparação de loja pronta

Decisão do usuário: acelerar tudo que não depende de conta/testadores, deixando o
recrutamento de testadores como último ponto. Entregue nesta data:

- **iPad desligado na v1.3** (`supportsTablet: false`) — reduz screenshots/QA.
- **`eas submit` Android** configurado no `eas.json` (`submit.production.android`)
  + guia de setup em [`docs/store/EAS_SUBMIT_SETUP.md`](../docs/store/EAS_SUBMIT_SETUP.md).
- **Respostas de console prontas** em
  [`docs/store/DATA_SAFETY_E_CLASSIFICACAO.md`](../docs/store/DATA_SAFETY_E_CLASSIFICACAO.md):
  Data Safety e Privacy Labels = **nenhum dado coletado** (build local-first,
  Sentry off), categoria **Educação**, classificação esperada **Livre/4+**.
- **Kit de recrutamento de testadores** em
  [`docs/store/TESTER_INVITE_KIT.md`](../docs/store/TESTER_INVITE_KIT.md).
- **Política de privacidade e página de suporte finalizadas** (Markdown e HTML
  prontos para hospedar), usando o domínio do usuário **saudediagnostica.com**:
  `/radiant/privacidade` e `/radiant/suporte`.

### 3. Conta Play Console — estado descoberto

A conta de desenvolvedor existe: **tipo Pessoal**, nome de desenvolvedor "Saúde
Diagnóstica", proprietário `anderson.smelo94@gmail.com`. Por ser **pessoal**, o
**closed test de 12 testadores × 14 dias consecutivos** é obrigatório antes da
produção (a Apple não tem requisito equivalente — o gate dela é o App Review).
A **verificação de acesso a dispositivo Android** está pendente e exige um
**aparelho real** (o emulador local é imagem "Google APIs" sem Play Store, e a
verificação é antifraude para hardware real).

## Verificações nesta data

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint, typecheck, contratos estruturais, suíte Jest e visual QA estrito — gate completo num comando |
| E2E em device — iOS (sim, Release local) | PASS | `3/3 Flows Passed in 7m 32s` (2026-07-29) |
| E2E em device — Android (emulador, APK Release) | PASS | `3/3 Flows Passed in 11m 48s` (2026-07-29) |
| smoke público da API | FAIL esperado | `/health` e `/ready` em HTTP 502 (estado inalterado; fora do caminho crítico) |

## Bloqueios do lançamento

O gargalo **deixou de ser engenharia** — o app está tecnicamente perto de
lançável. O caminho crítico agora é **administrativo/loja**, e é quase todo
ação do usuário:

1. **Verificação da conta Play** — precisa de um **aparelho Android real** (o
   emulador não serve).
2. **Hospedar** a política de privacidade e a página de suporte no domínio.
3. **Criar o app** no Play Console (`com.ascendcreative.radiant`) + preencher
   fichas com o material já preparado; gerar a **service-account key** do Play.
4. **Recrutar ≥12 testadores** para o closed test — o item de **maior latência**
   (relógio de 14 dias); kit de convite pronto.
5. **Sessões humanas de acessibilidade**: VoiceOver (B4) e TalkBack Android (C5).
6. **Builds de produção** (F1 iOS/TestFlight, F2 Android/AAB) — disparados quando
   as contas existirem (evita travar `runtimeVersion` antes da hora).
7. **API pública inativa** (502) — ADR de estratégia pendente (decisão de produto,
   fora do caminho crítico do lançamento local-first).

## Próxima sequência sugerida

Roadmap de lançamento vigente:
[2026-07-27](plans/2026-07-27-radiant-launch-roadmap.md), e o recorte focado
Android em
[2026-07-29 — plano de closed testing](plans/2026-07-29-android-closed-testing-plan.md).
Ordem de valor: (a) criar/verificar a conta Play e **iniciar o recrutamento de
testadores hoje**; (b) hospedar as duas páginas; (c) fechar as sessões humanas de
a11y; (d) disparar builds + `eas submit` quando as contas estiverem prontas.

## Coordenação entre múltiplas IAs

Contrato de sinalização em [`AGENTS.md`](../AGENTS.md): antes de começar, checar o
que já foi feito; ao terminar, sinalizar no mesmo run que entrega o trabalho.
Trabalho não sinalizado é tratado como não feito pelas próximas sessões.

## Árvore de trabalho

Seguem não commitadas de **outra sessão** as modificações em `AppButton.tsx`,
`config/push.ts`, `PushService.ts` e `JourneyHomeScreen.flow.test.tsx` — não
pertencem a esta execução e não foram tocadas por ela.
