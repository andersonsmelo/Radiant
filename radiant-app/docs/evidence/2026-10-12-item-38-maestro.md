# Item 38 — manutenção dos fluxos Maestro e do checkpoint legado

Medição: **2026-10-12**, após a publicação da 1.4.0. Branch:
`codex/radiant-e2e-maintenance`, sobre `b5f3a50`.
Run: `run-1791806520699-6de83876`.

## Diagnóstico medido

- `JourneyStageHeader` agrupa título e contador em um único rótulo acessível:
  `Fundamentos de Radiologia. 0 de 8 etapas concluídas.`. Os seis fluxos
  continuavam exigindo apenas `0 de 8`; o contrato antigo pinava essa forma.
- Guardas `runFlow when` para o dev client eram avaliadas uma vez, sem esperar
  sua apresentação, inclusive em reaberturas.
- O fluxo de idempotência omitia o resumo da lição entre "Concluir e voltar"
  e a Estude.
- `CheckpointScreen` mantinha um botão "Concluir checkpoint" quando o nó
  não tinha lote de avaliação. A trilha atual não produz esses checkpoints,
  mas a tela e um teste antigo ainda exercitavam o caminho removido.

## Execuções vermelhas, antes da correção

Node `v20.20.2`, `EXPO_NO_DOTENV=1` e `CI=1` nos testes do app.

```bash
node --test radiant-app/scripts/maestro-contract.test.mjs
cd radiant-app
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
```

Contrato Maestro: **23 passaram / 2 falharam / 25 totais**. As falhas foram:

- `navigation flows match the accessible journey header, not its hidden count`:
  `boot-to-home.yaml: ^\d+ de \d+$ does not match the accessible header
  "Fundamentos de Radiologia. 0 de 8 etapas concluídas."`.
- `navigation flows wait for the dev client after every launch and relaunch`:
  `boot-to-home.yaml: wait for the dev client immediately after launch 0`.

Teste da tela: **22 passaram / 1 falhou / 23 totais**.
`a checkpoint without an assessment cannot be completed by a legacy button`
falhou porque "Checkpoint indisponível" não era exibido; a árvore renderizada
continha "Concluir checkpoint". Não foi erro de sintaxe nem falha do runner.

## Alteração e execuções verdes

- Seis fluxos agora usam o cabeçalho acessível; o sétimo, de viewport curta,
  recebeu a mesma correção de espera do dev client.
- Toda abertura e reabertura desses sete fluxos espera o dev client.
- O fluxo de idempotência atravessa o resumo antes de capturar o XP.
- A tela exibe "Checkpoint indisponível" para um nó sem lote de avaliação,
  permite voltar à jornada e remove o botão legado de conclusão.
- Contratos novos usam AST TypeScript para ler o rótulo real e parser YAML
  para ler comandos; incluem rótulos não relacionados como controles negativos.

Resultados focados:

- Maestro: **25/25 testes aprovados**.
- `CheckpointScreen.flow.test.tsx` e
  `JourneyNodeCompletionGuard.test.tsx`: **29/29 testes aprovados**, 2 suítes.
  O segundo arquivo emite um log de mock preexistente sobre
  `SpacedRepetitionService.getCardState`; os testes passaram, mas o log não
  foi tratado como evidência de funcionamento dessa dependência real.

## Ambiente e limites

- `xcodebuild -version`: Xcode 27.0, build `27A266a`.
- `xcrun simctl list runtimes -j`: `runtimes: []`.
- `xcrun simctl list devices -j`: `devices: {}`.
- Maestro instalado. Nenhum runtime baixado, simulador criado ou E2E real
  executado nesta medição.
- A configuração de `rating-prompt` continua exigindo produção; os testes
  internos de retomada/idempotência exigem `active`. A ausência de runtime
  bloqueia ambos. Um contrato estático não fecha esses gates.
- A 1.4.0 publicada continua no binário `221e2ec`; nenhuma build nem OTA nova.

O item 38 permanece **parcial: implementação local feita, E2E pendente**.
Validação final: **`VALIDATION_PASSED`, 14/14 validadores**, um ciclo,
no run `run-1791806520699-6de83876`. Incluiu o `app-quality` completo
(lint, typecheck, contratos, Jest em banda única e visual QA), `app-test`,
contratos de documentação/conteúdo, lint/typecheck/testes da API e
`brain-links`. Os validadores do app foram executados no Node 20, com
`EXPO_NO_DOTENV=1` e `CI=1`; o controle do Loop usou Node 24.
`docs-contract` e `git diff --check` passaram sobre a documentação final.
Nenhum desses validadores executa os fluxos do Maestro no simulador.
