# Baseline de device E2E — 2026-07-23

**Data da coleta:** 2026-07-23
**Escopo:** inventário local, preparação dos destinos e primeiras execuções
em device.
**Classificação:** este documento preserva o baseline de ambiente e registra o
estado operacional atual. Uma execução parcial, um build local ou o contrato
estático não aprovam uma plataforma; somente os três flows concluídos no mesmo
device/runtime podem receber `passed`.

## Estado atual — atualização após execução iOS

- O perfil `e2e-test` passou a usar `developmentClient: false`, beta gate e
  sync remoto desligados, learning road ligado e push desligado para o teste
  local. Isso evita depender do launcher de desenvolvimento, Metro ou de
  registro de notificações durante E2E.
- Um build local **Release** equivalente ao perfil `e2e-test` foi criado via
  `xcodebuild`, instalado no simulador iOS e executado sem publicação,
  submissão, EAS cloud ou dados de usuário.
- O flow `onboarding-to-home.yaml` concluiu no iOS. O flow
  `learning-critical-path.yaml` iniciou no mesmo build, passou pela primeira
  lição e falhou depois de responder ao primeiro quiz, ao não encontrar
  `Fixe este ponto`. Portanto o iOS está em `app-failed`, não em `passed`.
- O YAML do critical path também recebeu aspas no texto que termina em `:`;
  antes disso o Maestro recusava o arquivo na etapa de parsing. A execução
  subsequente confirmou que o parser aceita o flow e que a falha restante é
  de comportamento/estado apresentado pelo app.
- `offline-relaunch.yaml` ainda não foi executado no iOS. Android permanece
  sem build/execução neste ciclo.

## Inventário local sanitizado

Este inventário é a **pré-condição histórica** do device E2E; os resultados
atuais de execução estão registrados na matriz abaixo.

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
| iOS | Radiant iPhone 17 Pro / iOS 26.5 | Release local `e2e-test` equivalente, instalado | passed | app-failed | não executado | app-failed | engenharia / 2026-07-23 | inspecionar a tela pós-resposta que deveria expor `Fixe este ponto`; só então repetir critical path e offline |
| Android | Radiant Pixel 9 / Google APIs API 36 ARM64 | não instalado | não executado | não executado | não executado | environment-blocked | engenharia / 2026-07-23 | gerar e instalar build local `e2e-test` |

## Convenção de resultado

- `environment-blocked`: requisito local indisponível antes da execução,
  incluindo build `e2e-test` ainda não instalado.
- `app-failed`: execução iniciada e falhou por comportamento do app.
- `passed`: os três fluxos concluíram no device/runtime e build registrados.

Os dois destinos foram reconhecidos pelas ferramentas nativas. O iOS deixou de
ser um bloqueio de ambiente, mas não pode ser aprovado enquanto critical path e
offline relaunch não concluírem. O Android continua `environment-blocked` até
existir build e execução local documentada.

## Observações de ambiente

- O emulador Android iniciou com renderização por software por pressão de
  memória. Isso não bloqueia a execução funcional, mas invalida qualquer
  conclusão de performance até que haja um baseline em ambiente com GPU/memória
  adequadas.
- Nenhum UUID, token, conta, resposta de usuário ou conteúdo clínico foi
  incluído neste registro.
