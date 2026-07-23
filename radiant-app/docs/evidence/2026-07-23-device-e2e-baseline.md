# Baseline de device E2E — 2026-07-23

**Data da coleta:** 2026-07-23
**Escopo:** inventário local e preparação dos destinos de automação.
**Classificação:** pré-condição de ambiente; esta coleta não aprova fluxos E2E
e não substitui a execução dos YAMLs em device. Os destinos estão prontos,
mas os flows ainda dependem de um build `e2e-test` instalado.

## Inventário local sanitizado

| Item | Resultado observado |
|---|---|
| macOS | 27.0 (build 26A5388g), arm64 |
| Xcode | 26.6 (build 17F113) em `/Applications/Xcode.app/Contents/Developer` |
| Maestro CLI | 2.7.0 em `/Users/anderson/.maestro/bin`; validado com `maestro --version` e `maestro test --help` |
| Java local para Maestro/Android | Temurin 17.0.19+10; usado apenas na sessão, sem alterar dotfiles |
| iOS runtime e destino | iOS 26.5 arm64, `Radiant iPhone 17 Pro - iOS 26.5`, boot confirmado por `simctl` |
| Android SDK e destino | Emulator 36.6.11, system image Google APIs ARM64 API 36, `Radiant_Pixel_9_API_36`, boot confirmado por `adb` |
| Espaço livre no volume de trabalho após downloads | 40 GiB em `/System/Volumes/Data` |

O inventário não contém UUIDs de simulador, nomes de conta, tokens, dados de
usuário ou conteúdo clínico.

## Matriz de execução por plataforma

| Plataforma | Device/runtime | Build | Onboarding | Critical path | Offline relaunch | Estado | Dono/data | Próxima ação |
|---|---|---|---|---|---|---|---|---|
| iOS | Radiant iPhone 17 Pro / iOS 26.5 | não instalado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-23 | gerar e instalar build local `e2e-test` |
| Android | Radiant Pixel 9 / Google APIs API 36 ARM64 | não instalado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-23 | gerar e instalar build local `e2e-test` |

## Convenção de resultado

- `environment-blocked`: requisito local indisponível antes da execução,
  incluindo build `e2e-test` ainda não instalado.
- `app-failed`: execução iniciada e falhou por comportamento do app.
- `passed`: os três fluxos concluíram no device/runtime e build registrados.

Os dois destinos foram reconhecidos pelas ferramentas nativas e estão em boot,
mas as duas plataformas permanecem `environment-blocked` até existir um build
`e2e-test` instalado. Nenhum fluxo foi executado em device.

## Observações de ambiente

- O emulador Android iniciou com renderização por software por pressão de
  memória. Isso não bloqueia a execução funcional, mas invalida qualquer
  conclusão de performance até que haja um baseline em ambiente com GPU/memória
  adequadas.
- Nenhum UUID, token, conta, resposta de usuário ou conteúdo clínico foi
  incluído neste registro.
