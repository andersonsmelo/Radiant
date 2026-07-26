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
