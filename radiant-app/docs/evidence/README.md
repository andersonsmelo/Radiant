# Evidências de validação em device

Esta pasta guarda registros datados e sanitizados de execução em device. Ela
não é um destino para dados de usuários, tokens, respostas clínicas ou logs de
conta. Screenshots e artefatos de Maestro permanecem fora do Git em
`.maestro/artifacts/`, salvo autorização explícita e revisão de privacidade.

## Estados permitidos

- `environment-blocked`: a validação não iniciou porque falta uma
  pré-condição local, como CLI, runtime, simulador/emulador ou build instalado.
- `app-failed`: a validação iniciou no destino registrado, mas o fluxo falhou
  por comportamento observável do aplicativo. O registro deve trazer comando,
  runtime, build e causa reproduzível.
- `passed`: todos os passos do fluxo terminaram no destino registrado. Esse
  estado exige comando, runtime, build, data e evidência sanitizada.

Nunca converta `environment-blocked` em `passed` por causa de um contrato
estático, build local ou inspeção de YAML. Cada evidência deve manter linhas
separadas para iOS e Android e identificar o responsável e a próxima ação.

## Registros

- [Baseline de device E2E — 2026-07-23](2026-07-23-device-e2e-baseline.md)
- [Follow-up de device E2E — 2026-07-26](2026-07-26-device-e2e-followup.md)
  — iOS `passed` (3/3 flows na mesma execução); Android `environment-blocked`.
- [Gate 2 de acessibilidade — 2026-07-26](2026-07-26-accessibility-gate2.md)
  — `app-failed`: 3 de 5 itens passaram; D1 e D2 corrigidos e reverificados em
  device; itens 2 e 5 seguem abertos.
- [boot-to-home (dev-client) — 2026-07-28](2026-07-28-boot-to-home-devclient.md)
  — suplemento de runtime sob dev-client (boot → "Foco de hoje"; `/onboarding` →
  Unmatched Route). **Sua conclusão de `environment-blocked` foi corrigida no
  mesmo dia**; mantido pelo trilho de correção.
- [E2E em device, Android, primeira execução — 2026-07-28](2026-07-28-android-e2e-first-run.md)
  — Android `app-failed`: 2/3 flows passaram em emulador com APK Release; o
  `learning-critical-path` falhou por seletor de aba acoplado ao formato de
  acessibilidade do iOS. Traz a receita de build Android e dois defeitos de
  ícone que só o Android revela.
- [E2E em device, build Release local — 2026-07-28](2026-07-28-e2e-local-release.md)
  — B0.1 fechada para iOS: `passed`, `3/3 Flows Passed in 6m 52s` sobre build
  Release local com bundle embutido, com receita de build reprodutível. Android
  segue `environment-blocked`. Registra também a deriva EN→pt-BR que fez
  `learning-critical-path` falhar na primeira execução do dia.
- [E2E da apresentação de primeiro uso — 2026-08-02](2026-08-02-e2e-primeiro-uso.md)
  — iOS 4/5 sobre build Release local da 1.3.0; `store-capture` vermelho por
  guarda cega a oclusão, anterior àquele trabalho. Registra os três defeitos que
  só a execução em dispositivo expôs, incluindo o colapso de acessibilidade do
  `WelcomeSlide`. **Indexado retroativamente em 2026-08-03.**
- [B8 — Reduce Motion em iPhone físico — 2026-08-06](2026-08-06-b8-reduce-motion-iphone.md)
  — item 1 do Gate 2 `passed` no escopo ampliado: nada se move e a distinção
  entre planeta ativo, disponível e bloqueado sobrevive à preferência.
- [B5 — `reward-unlock` no iOS — 2026-08-06](2026-08-06-b5-reward-unlock-ios.md)
  — 170 passos, 0 falhas, sobre build local Release `e2e-test` no simulador. A
  regra de destravamento provada pelo caminho do produto; Android pendente.
- [TestFlight 1.3.1 (5) em iPhone físico — 2026-08-05](2026-08-05-testflight-1.3.1-build-5-iphone.md)
  — smoke funcional `passed`; VoiceOver parcial, com B4 ainda aberta.
- [E2E da 1.3.1 nas duas plataformas — 2026-08-03](2026-08-03-e2e-1.3.1-ios-android.md)
  — iOS e Android `passed` 5/5 sobre builds Release locais da 1.3.1, sob o perfil
  `e2e-test`. Traz o orçamento de host (16 GB é marginal para Android) e a
  armadilha do emulador voltar ao APK anterior. **Indexado retroativamente em
  2026-08-03.**
- [E2E sob configuração de produção — 2026-08-03](2026-08-03-e2e-producao-rating-prompt.md)
  — iOS e Android `passed` **6/6**, primeira evidência colhida com
  `APP_ENV=production` e `ENABLE_PUSH=true`. Fecha o item 3 dos bloqueadores e a
  defasagem entre a evidência e o HEAD. Traz o flow `rating-prompt`, a leitura da
  telemetria do próprio aparelho como método de verificação, e a correção de uma
  previsão errada sobre por que o Android não mostra o diálogo.
- [Smoke instrumentado da C2, Android — 2026-08-03](2026-08-03-c2-smoke-android.md)
  — `app-failed` na medição: a barra de status do sistema era conteúdo escuro
  sobre fundo escuro (1,02:1) em todas as telas e nas duas plataformas, defeito
  também assado nos seis screenshots publicáveis do Play. Corrigido na mesma
  data. Registra o item "teclado" como **não aplicável**, com a razão, e valida a
  escolha de `predictiveBackGestureEnabled: false` por medição.
- [B5 — cobertura do nó de reward por deep link — 2026-08-04](2026-08-04-b5-reward-deep-link.md)
  — iOS e Android `passed` com `reward-locked.yaml`. Escrever a cobertura achou
  um defeito de integridade antes de existir flow: conquista bloqueada exibida
  como coletável, com o botão gravando `markNodeCompleted` por deep link.
  Corrigido primeiro, coberto depois. Registra que a **regra de destravamento
  segue sem cobertura** e duas armadilhas de seletor da tela.
