# Verificação de runtime — boot-to-home (dev-client) — 2026-07-28

**Task:** B0.1 (reexecutar os três flows Maestro sob o perfil `preview`).
**Resultado do dia:** iOS `environment-blocked` para o build `preview`; verificação
de runtime **dev-client** do código atual anexada como suplemento — **não** promove
a `passed` (ver "Estados permitidos" no [README](README.md)).

## Contexto

- **Código:** branch `codex/wave1-hardening-api-smoke`, commit `3d2f77f` (remoção
  do wizard de onboarding + `boot-to-home.yaml`).
- **Alvo:** simulador `Radiant iPhone 17 Pro`, iOS 26.5
  (UDID `3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`).
- **Runtime:** Expo Go 54.0.6 servido por Metro em `CI=1 npx expo start --go
  --port 8081 --clear`. Isto é um **dev-client**, não um build `preview`.

## Por que o `preview` está `environment-blocked`

Os três flows Maestro declaram `appId: com.ascendcreative.radiant` + `launchApp`;
foram escritos para um build **standalone** `e2e-test`/`preview` (o preâmbulo
`localhost:8081`/dev-menu é no-op defensivo). Produzir esse build aqui está
bloqueado:

- **CocoaPods ausente** (`pod` não encontrado) → `npx expo run:ios` falha; instalar
  CocoaPods exige senha do operador humano.
- O RUNBOOK proíbe EAS cloud para esta validação.
- O único build nativo instalado no simulador é de **~2026-07-26**
  (`com.ascendcreative.radiant-1785091015412.app`), anterior ao design galaxy de
  07-27 e às mudanças de 07-28 — ele ainda **contém** o onboarding removido, então
  rodar Maestro contra ele testaria código velho, não o `preview` atual.

Falta uma pré-condição local (build `preview` instalado) → estado
`environment-blocked` por definição.

## Verificação dev-client executada (suplemento, não é pass)

Pelo fluxo Expo Go mapeado (`simctl openurl` + `simctl io screenshot`), contra o
código atual:

| # | Comando | Observado |
| --- | --- | --- |
| 1 | `simctl openurl <UDID> exp://127.0.0.1:8081` (rota inicial) | App sobe direto na home galaxy da Learning Road, com **"Foco de hoje"** visível. É a premissa que o `boot-to-home.yaml` afirma; nunca havia sido exercida em runtime. |
| 2 | `simctl openurl <UDID> exp://127.0.0.1:8081/--/onboarding` | **"Unmatched Route — Page could not be found"** (`exp://127.0.0.1:8081/--/onboarding`). O deep link do wizard está morto, como a remoção previa. |

Screenshots capturados e entregues ao operador; cópias locais fora do Git em
`.maestro/artifacts/2026-07-28-boot-to-home.png` e
`.maestro/artifacts/2026-07-28-onboarding-unmatched.png` (política: screenshots
não entram no Git).

**Limite honesto:** dev-client (Expo Go, dev mode, bundle servido por Metro) não é
o perfil `preview`. Esta verificação confirma que a remoção do onboarding e a
premissa do novo flow valem no código atual; **não** substitui o pass de device
sob `preview` que B0.1 exige.

## Estado por plataforma

- **iOS:** `environment-blocked` — build `preview`/`e2e-test` do código atual não
  instalável nesta sessão (sem CocoaPods; EAS cloud vedado). Runtime do código
  atual verificado sob dev-client (acima), sem promoção a `passed`.
- **Android:** `environment-blocked` — sem projeto nativo / build (inalterado
  desde 2026-07-26).

**Responsável:** engenharia — 2026-07-28.
**Próxima ação:** produzir um build `e2e-test`/`preview` do commit atual (CocoaPods
local **ou** máquina com toolchain nativa **ou** EAS mediante revisão de
custo/privacidade), instalar no simulador e rodar `.maestro/boot-to-home.yaml`,
`.maestro/learning-critical-path.yaml` e `.maestro/offline-relaunch.yaml`,
registrando o resultado datado.
