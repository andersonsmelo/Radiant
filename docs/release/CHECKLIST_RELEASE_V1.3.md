# Checklist de release — Radiant v1.3

> Lista única de **go/no-go** para submeter a v1.3 nas duas lojas. Cada item tem
> estado e dono; os detalhes vivem nas tasks do
> [roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md) e no
> [status canônico](../EXECUTION_STATUS_2026-07-27.md). Este documento **não
> substitui** o roadmap — ele é o checklist final que se percorre antes de cada
> submissão.
>
> Legenda: ✅ feito · ⏳ pendente · ⛔ bloqueado (dependência externa) ·
> 🔁 refazer sob perfil de produção.

**Última atualização:** 2026-07-27 · **Alvo:** v1.3.0

## 1. Qualidade e app (M1)

- [x] ✅ `npm run quality` verde (lint, typecheck, visual QA strict, contratos).
- [x] ✅ Suíte de testes verde (`npm test`).
- [x] ✅ Gate 2 de acessibilidade — item 5 (teclado no build web) fechado; folga
  da tab bar e `JourneyMap` corrigidos. Ver
  [`ACCESSIBILITY_QA_V1.md`](../../radiant-app/docs/ACCESSIBILITY_QA_V1.md).
- [ ] ⏳ Gate 2 — **item 2** (VoiceOver com áudio, task **B4**) — exige sessão
  humana. Único item do Gate 2 aberto.
- [ ] ⏳ Nó de reward coberto por E2E (task **B5**).
- [ ] ⏳ Onboarding em instalação limpa confirmado (task **B6**).

## 2. Versionamento e OTA (task D5)

Estado atual: `version` 1.2.1 · `ios.buildNumber` 1 · `android.versionCode` 1 ·
`runtimeVersion.policy` `appVersion`.

- [ ] ⏳ Definir `version` = **1.3.0** em `package.json` e `app.json` (alinhados).
- [ ] ⏳ Definir `ios.buildNumber` e `android.versionCode` para o primeiro build.
- [ ] ⏳ Congelar a política de `runtimeVersion` e documentar: **depois do
  primeiro build publicado, nunca alterar `runtimeVersion` sem novo build** (OTA
  só entrega JS compatível). Ver alerta do status 2026-07-26.

## 3. E2E e matriz real-device (task D3/16)

- [ ] 🔁 Reexecutar os 3 flows Maestro sob o perfil **`preview`** (que reflete
  produção) e registrar evidência (task **B0.1**). A evidência iOS atual foi
  colhida sob `e2e-test`.
- [ ] ⛔ Paridade Android: `expo prebuild` + build + 3 flows em emulador e 1
  device físico (Onda **C**). `radiant-app/android/` ainda não existe.
- Runbook e critérios: [`E2E_RUNBOOK.md`](../../radiant-app/docs/E2E_RUNBOOK.md).

### Matriz real-device

Testar o fluxo crítico (onboarding → trilha → lição → quiz → checkpoint →
progresso) e os itens de plataforma em cada linha marcada. Mínimo para
submeter: uma linha iOS e uma Android com PASS.

| Dispositivo | Classe | iOS/Android | Status | Cobre |
| --- | --- | --- | --- | --- |
| iPhone 6,7" (ex.: 15/16 Pro Max) | grande | iOS | ⏳ | notch dinâmico, safe area, fontes ampliadas |
| iPhone 6,1"/6,5" (ex.: 15/16) | médio | iOS | ⏳ | tamanho mais comum |
| iPad 13" | tablet | iPadOS | ⏳ (decidir em E1) | só se `supportsTablet` ficar `true` |
| Android phone compacto (~5,8") | pequeno | Android | ⛔ | edge-to-edge, teclado, densidade |
| Android phone médio (~6,5") | médio | Android | ⛔ | predictive back (hoje off — validar) |

Checks por linha: fluxo crítico completo · relaunch offline sem perda de
progresso · edge-to-edge / safe area · teclado (foco visível, sem armadilha) ·
fontes ampliadas · sem vazamento de rota no header.

> Decisão pendente (E1): manter `supportsTablet: true` amplia QA e screenshots.
> Desligar tablet na v1.3 é aceitável e reduz escopo.

## 4. Privacidade e telemetria (M3)

- [x] ✅ Contrato de telemetria/privacidade (task **D2**) —
  [`CONTRATO_TELEMETRIA.md`](../legal/CONTRATO_TELEMETRIA.md): allowlist,
  proibições, teste de contrato e scrub no Sentry.
- [x] ✅ Verificado: na config de produção nenhuma propriedade de telemetria sai
  do device (analytics off, Sentry off, sync off).
- [ ] ⏳ Política de privacidade **hospedada em URL pública** (task **A4**;
  rascunho em [`politica-de-privacidade.md`](../legal/politica-de-privacidade.md)).
  Bloqueia E3.
- [ ] ⏳ Decidir se o **relatório de falhas (Sentry)** entra ligado no beta; se
  sim, declarar Crash Data nas fichas (ver mapeamento no contrato).
- [ ] ⏳ Snapshot de war room de homologação, se for usar sign-off estrito:
  `npm run app-store:ops-check:strict` exige
  `docs/release/APP_STORE_WAR_ROOM_LATEST.md`.

## 5. Metadados e assets de loja (Onda E)

- [x] ✅ Textos de loja pt-BR (task **E2**, rascunho) —
  [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md). Falta Anderson
  escolher variantes.
- [ ] ⏳ Screenshots por dispositivo + feature graphic 1024×500 (task **E1**).
- [ ] ⏳ Privacy labels (App Store) e Data safety (Play) (task **E3**) —
  derivados de D2; **bloqueados pela hospedagem da política (A4)**.
- [ ] ⛔ Classificação etária / questionários de conteúdo; categoria **Educação**
  (task **E4**) — feito nas consoles, exige conta.
- [ ] ⏳ Página de suporte + e-mail de contato (task **E5**).
- [ ] ⏳ Ícone 1024 sem alfa (iOS) revisado (task **E6**).

## 6. Contas e submissão (M0 → M4)

- [x] ✅ Tipo de conta decidido: Play pessoal + Apple individual (task **A1**).
- [ ] ⛔ Criar/verificar **Apple Developer** (US$ 99) e **Play Console** (US$ 25)
  e concluir verificação de identidade (task **A2**) — **maior latência**.
- [ ] ⛔ Criar o app nas duas consoles com `com.ascendcreative.radiant` e
  reservar o nome "Radiant" (task **A3**).
- [ ] ⛔ `eas submit` configurado (chaves de service account) (task **A5**).
- [ ] ⛔ Recrutar ≥ 14 testadores para o closed test do Play (task **A6**).
- [ ] ⛔ Build `production` iOS → TestFlight (task **F1**).
- [ ] ⛔ Build `production` Android (AAB) → closed testing, **12+ opted-in por 14
  dias consecutivos** (task **F2**) — piso do caminho crítico.

## 7. Lançamento e pós (M5)

- [ ] ⛔ Rollout faseado no Play (10% → 50% → 100%); liberação manual no iOS
  (task **F5**).
- [ ] ⛔ Monitorar Sentry crash-free ≥ 99%, reviews e funil de onboarding nas 2
  primeiras semanas (task **F6**).

## Resumo de bloqueios de submissão (o que ainda impede um build ir para revisão)

1. **Contas de loja** (A2/A3) — nada é submetido sem elas. Maior latência.
2. **Gate 2 item 2** (B4) — sessão humana de VoiceOver.
3. **Política hospedada** (A4) → destrava privacy labels / data safety (E3).
4. **Versionamento congelado** (D5) antes do primeiro build.
5. **E2E sob `preview`** (B0.1) e **paridade Android** (Onda C).
6. **Screenshots** (E1) e **classificação/consoles** (E4).
