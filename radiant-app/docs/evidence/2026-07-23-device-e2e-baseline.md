# Baseline de device E2E — 2026-07-23

**Data da coleta:** 2026-07-23
**Escopo:** inventário local antes de instalar Maestro ou baixar runtimes.
**Classificação:** pré-condição de ambiente; esta coleta não aprova fluxos E2E
e não substitui a execução dos YAMLs em device.

## Inventário local sanitizado

| Item | Resultado observado |
|---|---|
| macOS | 27.0 (build 26A5388g), arm64 |
| Xcode | 26.6 (build 17F113) em `/Applications/Xcode.app/Contents/Developer` |
| Devices iOS disponíveis | nenhum; somente runtime `com.apple.CoreSimulator.SimRuntime.iOS-26-4` indisponível |
| Maestro CLI | ausente do `PATH` |
| Android `sdkmanager` | ausente do `PATH` |
| Espaço livre no volume de trabalho | 62 GiB em `/System/Volumes/Data` |

O inventário não contém UUIDs de simulador, nomes de conta, tokens, dados de
usuário ou conteúdo clínico.

## Matriz de execução por plataforma

| Plataforma | Device/runtime | Build | Onboarding | Critical path | Offline relaunch | Estado | Dono/data | Próxima ação |
|---|---|---|---|---|---|---|---|---|
| iOS | nenhum disponível | não iniciado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-23 | instalar Maestro e baixar/criar um runtime iOS suportado |
| Android | SDK/emulador indisponível | não iniciado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-23 | instalar Maestro e preparar SDK, runtime e emulador Android suportados |

## Convenção de resultado

- `environment-blocked`: requisito local indisponível antes da execução.
- `app-failed`: execução iniciada e falhou por comportamento do app.
- `passed`: os três fluxos concluíram no device/runtime e build registrados.

Neste baseline, as duas plataformas permanecem `environment-blocked`; nenhum
fluxo foi executado em device.
