# Verificação de runtime — boot-to-home (dev-client) — 2026-07-28

> **Conclusão corrigida no mesmo dia.** Este documento classificou iOS como
> `environment-blocked`, e a classificação estava errada: um build local **era**
> produzível. O registro válido de B0.1 é
> [`2026-07-28-e2e-local-release.md`](2026-07-28-e2e-local-release.md) — iOS
> `passed`, `3/3 Flows Passed in 6m 52s`. O que segue permanece como o que de
> fato se observou sob dev-client, mais o erro de leitura que produziu a
> classificação errada.

**Task:** B0.1 (reexecutar os três flows Maestro sob o perfil `preview`).
**Resultado do dia (superado):** iOS `environment-blocked`; verificação de
runtime **dev-client** do código atual anexada como suplemento — **não** promove
a `passed` (ver "Estados permitidos" no [README](README.md)).

## Por que a classificação estava errada

`pod` ausente quebra `expo run:ios`, e daí concluiu-se que nenhum build local era
possível. A conclusão não foi verificada: o projeto nativo em `ios/` estava
completo, com `Podfile.lock` idêntico a `Pods/Manifest.lock`, e `xcodebuild`
sobre Pods já instalados não precisa de `pod`. Uma pré-condição foi checada (a
CLI ausente) e tratada como se fosse a única; o build saiu na mesma máquina, no
mesmo dia, sem instalar nada. `environment-blocked` exige que a pré-condição
faltante seja real — verifique o caminho alternativo antes de declarar o
bloqueio.

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

## Estado por plataforma (superado no mesmo dia)

- **iOS:** ~~`environment-blocked`~~ → **`passed`**. Ver
  [`2026-07-28-e2e-local-release.md`](2026-07-28-e2e-local-release.md): build
  Release local do commit atual, `3/3 Flows Passed in 6m 52s`.
- **Android:** `environment-blocked` — sem projeto nativo / build (inalterado
  desde 2026-07-26).

**Responsável:** engenharia — 2026-07-28.
**Próxima ação:** cumprida nesta data — o build local foi produzido com
`xcodebuild` sobre os Pods instalados e a suíte rodou; a receita está no registro
que substitui este.
