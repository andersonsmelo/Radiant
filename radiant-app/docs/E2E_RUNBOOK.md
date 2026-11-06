# Maestro local E2E runbook

## Checkout com conteúdo retirado — 02/11/2026

O catálogo local declara `retired`. Todas as aulas antigas, inclusive bancada e
protótipos, foram retiradas por decisão de Anderson. Esta é a receita atual do
checkout Medalhão; não altera evidência histórica nem o app já distribuído.
[ADR](../../docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md) e
[auditoria](../../docs/evidence/2026-11-02-retirada-conteudo-radiant.md).

### Cobertura disponível

- `.maestro/boot-to-home.yaml`: proposta de smoke da estrutura vazia. Inicia o
  app, dispensa dev client/primeiro uso e verifica `journey-trail`.
- `.maestro/subflows/dismiss-dev-client.yaml` e `dismiss-first-run.yaml`:
  auxiliares preservados; não são testes independentes de aulas.
- `.maestro/config.yaml` descobre somente `boot-to-home.yaml`.

**O smoke não foi executado nativamente nesta retirada.** Contratos estáticos
validam configuração/seletores; não provam renderização no aparelho. A presença
ou eventual sucesso do smoke não substitui testes de lição, revisão, conquista,
retomada, economia, diálogo de avaliação da loja ou segundo dia.

### Execução futura, somente em destino autorizado

Rodar com Node20/Java17, dotenv desativado, a partir de `radiant-app/`.
Primeiro conferir o UDID completo e o binário associado ao checkout. A receita
abaixo é documentação, não autorização para instalação, limpeza, fixtures ou build.
O flow usa `clearState`: jamais apontar ao simulador reservado
`5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` ou a um destino com dados a preservar.

```sh
maestro --device <dedicated-authorized-udid> test .maestro/boot-to-home.yaml
```

Se o app ainda não tiver binário compatível ou o destino não estiver autorizado,
registrar `environment-blocked`. Nunca criar aulas sintéticas no catálogo ativo
para fazer o roteiro passar. Testes de motores usam fixtures exclusivas de teste.

### Roteiros retirados e perda de cobertura operacional

Foram retirados17flows dependentes do corpus antigo:
`first-run`, `g4-native-evidence`, `hybrid-native-evidence`,
`learning-critical-path`, `offline-relaunch`, `radiant-1-4-primeira-execucao`,
`radiant-1-4-segundo-dia`, `radiant-1-4-vidas-esgotadas`, `rating-prompt`,
`review-due`, `reward-locked`, `reward-unlock`, `store-capture`,
`student-checkpoint-active-resume`, `student-checkpoint-no-duplicate-effect`,
`student-checkpoint-performance-baseline` e `student-checkpoint-short-viewport`.
Esses nomes não são comandos disponíveis neste checkout.

A cobertura nativa de aulas/retorno/vida/conquista e os golden paths devem ser
redesenhados para o lote futuro aprovado. O segundo dia preparado anteriormente
permanece evidência histórica e não valida conteúdo substituto. Não consumir o
container reservado nem alterar relógio/progresso para reproduzir a trilha removida.

### Evidência exigida

Antes de alegar PASS nativo: registrar SHA/binário, plataforma/UDID autorizado,
pré-condições, comando/resultado e artefatos reais. Separar `environment-blocked`,
`app-failed` e `passed`. Usar o modelo e os limites em
[docs/evidence/2026-07-23-device-e2e-baseline.md](evidence/2026-07-23-device-e2e-baseline.md).
O [índice de evidências](evidence/README.md) preserva a distinção. Para seletores,
conferir árvore acessível; não trocar asserção por coordenada. Manter
`arguments: { radiantReduceMotion: '1' }`; verificar separadamente a resposta
em cada plataforma. Artefatos ficam em `.maestro/artifacts`, ignorados pelo Git.

## Histórico preservado — não executar contra o catálogo retirado

O [runbook completo anterior no Git](https://github.com/andersonsmelo/Radiant/blob/34147e114de338a73a02ec68e8079c6bf3296c1d/radiant-app/docs/E2E_RUNBOOK.md)
registra as antigas receitas e medições. Relatórios datados abaixo continuam
válidos apenas para seus SHAs/ambientes; não são cobertura atual.

### Native run on `main` before a build, 2026-10-18

[Report](../../docs/evidence/2026-10-18-main-pronta-para-build.md), on `main` at
`cc67243`, with a Debug dev client built by Xcode 27.1 on iPhone 17 Pro / iOS 26.5:
- these flows passed natively: `learning-critical-path`, `offline-relaunch`,
  `student-checkpoint-no-duplicate-effect`, `store-capture`, `reward-unlock`
  and `radiant-1-4-primeira-execucao`;
- `radiant-1-4-segundo-dia` passed only as a same-day probe with a fixture. Its
  real-clock day 2 is FILA 59;
- two flows had gone stale against the app and were fixed:
  - `store-capture` now centres `journey-recommendation-action` before tapping
    it;
  - `segundo-dia` now asserts the 4-step review activity and the
    "Disponível em …" label that `a366295` gave to scheduled review nodes.


### QA de14/10/2026

[Relatório de remediação](../../docs/evidence/2026-10-14-qa-remediacao.md) e
[auditoria de13/10](../../docs/evidence/2026-10-13-qa-ampla-simulador.md) permanecem
históricos. Builds, fixtures e resultados ali descritos não foram repetidos nesta
retirada. As receitas antigas de aulas foram removidas da seção operacional atual.
