# E2E dos três caminhos dourados da 1.4 — 2026-09-24

Spec 1.4 (2026-09-14), §8, item 6: primeira execução até a conclusão da L1;
segundo dia com revisão devida; vidas acabando no meio da lição até a folha.
Antes desta data nenhum dos três flows existia.

## Estado por caminho

| Caminho | Flow | iOS 26.5 | Android |
| --- | --- | --- | --- |
| 1. Primeira execução até a L1 concluída | `radiant-1-4-primeira-execucao.yaml` | `passed` — 130,9 s, 36 passos (execução final, 11:53) | não executado |
| 2. Segundo dia com revisão devida | `radiant-1-4-segundo-dia.yaml` | **pendente de relógio real**: o dia 1 é o fim do caminho 1 (`passed`); o dia 2 só pode rodar a partir de **2026-09-25 11:54:53 (−03)** | não executado |
| 3. Vidas acabando no meio da lição até a folha | `radiant-1-4-vidas-esgotadas.yaml` | `passed` — 495,9 s, 93 passos | não executado |

Nenhum dos três foi rodado em Android nem em aparelho físico. O caminho 2 não
tem `passed`: o dia 2 existe como flow e como contrato, e a única execução dele
foi a vermelha pretendida (abaixo).

## Ambiente

- Simulador `iPhone 17 (iOS 26.5)`, UDID
  `E3C547AE-4D2B-4C2D-9E0A-43AC36BBD1AD`. Nesta máquina só há o Xcode 27
  (`27.0`, `27A266a`), e o binário que ele produz fecha na abertura no iOS 27
  (STATUS, "Risco de build").
- Build **Debug** local sobre `ab121ad` (`origin/main`), pelo procedimento do
  STATUS: `npx expo prebuild --platform ios`; `pod install` com
  `RUBYOPT=-rlogger LANG=en_US.UTF-8`; `xcodebuild` com
  `IPHONEOS_DEPLOYMENT_TARGET=15.1 SENTRY_DISABLE_AUTO_UPLOAD=true`. Binário
  instalado com carimbo `Sep 24 11:01:25 2026`, conferido com
  `xcrun simctl get_app_container`. Versão no binário: `1.3.1` (o bump para
  `1.4.0` vem por último, FILA).
- Metro pelo `scripts/start-ios-v2.sh`, **com um desvio**: o script termina em
  `exec npx expo start --ios`, e o `--ios` falha nesta máquina com
  `CommandError: Can't determine id of Simulator app` — a mesma consulta ao
  Simulador que trava o `expo run:ios`. Rodou-se uma cópia do script idêntica
  exceto por `SCRIPT_DIR` fixo e `npx expo start` sem `--ios`; a verificação
  de precedência de ambiente (`check-env-precedence.mjs`) rodou e passou.
- Maestro `2.7.0`. Testes e Maestro no Node `v20.20.2`.

## Execuções, em ordem

| Hora | Flow | Resultado | Causa |
| --- | --- | --- | --- |
| 11:04 | `first-run.yaml` (smoke do ambiente) | falhou | corrida do dev client: a folha dele subiu depois do `runFlow when` e cobriu a apresentação |
| 11:15 | caminho 1 | falhou | a instalação limpa parou no launcher do dev client ("DEVELOPMENT SERVERS"), segundo estado da mesma corrida |
| 11:17 | caminho 1 | `passed` (131,6 s) | com o subflow `dismiss-dev-client.yaml` |
| 11:19 | caminho 2 (dia 2, antes das 24 h) | **vermelho pretendido** | reprovou na primeira asserção; a trilha mostrava `Revisar Fundamentos de Radiologia. Bloqueado.` |
| 11:20 | caminho 3 | falhou | asserção do flow: com a folha modal aberta, o HUD de trás sai da árvore |
| 11:29 | caminho 3 | falhou | asserção do flow: na trilha o rótulo do HUD é `0 de 5 vidas; próxima em 24 minutos` |
| 11:40 | caminho 3 | `passed` (495,9 s) | — |
| 11:49 | caminho 1 | falhou | **defeito do app**: `Próxima revisão em 2 dias` para uma revisão a 24 h (abaixo) |
| 11:53 | caminho 1 | `passed` (130,9 s) | asserção sem o número de dias; é a execução que deixa o estado do dia 1 |

O caminho 1 das 11:53 é o último flow que tocou o simulador. O cartão SM-2
gravado por ele vence em `2026-09-25T14:54:53.672Z`.

## Defeitos do app que a execução expôs

Nenhum foi corrigido aqui: a frente é E2E, e `src/` não entrou no escopo.
Todos estão na FILA.

1. **Lição concluída volta como "Continuar de onde parou".** Reabrir a L1 já
   concluída e sair pela folha de vidas deixa a trilha com `Fundamentos de
   Radiologia. Continuar de onde parou.`, o cabeçalho em `0 de 14 etapas
   concluídas` (era 1) e o CTA `Retomar etapa`. Causa:
   `resolveNodeStatus` (`JourneyRecommendationService.ts:46`) testa
   `resumableNodeId` antes de `completed`. `completedNodeIds` continua
   intacto: é derivação, não perda de dado. Reproduz com o próprio caminho 3.
2. **"Próxima revisão em 2 dias" para uma revisão a 24 h.** Na execução das
   11:49, `answeredAt` = `14:51:01.049Z`, o cartão SM-2 carimbou
   `14:51:01.050Z` e venceu +24 h; `Math.ceil((24 h + 1 ms) / DAY_MS)` = 2
   (`LessonFlowScreen.tsx:346`). A execução das 11:53 teve a mesma diferença
   de 1 ms (`.671Z` × `.672Z`).
3. **Resumo de vidas cortado na borda direita.** Na trilha, com vidas em
   recarga, o texto `0 · +1 em 24 min` sai da tela no iPhone 17: o nó do HUD
   vai até x=443 numa largura de 402 pt (hierarquia do Maestro), e a captura
   mostra o texto cortado em "+1 em 24".

## Contrato

`scripts/maestro-contract.test.mjs` ganhou o teste
`ties the three 1.4 golden paths to the rules and copy they exist to exercise`
e os três flows entraram nas listas de rolagem. Resultado: 22/22. As 15
mutações que provam cada asserção nova falhando pelo defeito que ela nomeia
estão no
[relatório de vermelhos](../../../docs/superpowers/handoffs/2026-09-24-radiant-e2e-caminhos-dourados-vermelhos.md).

## O que não foi verificado

- O dia 2 do caminho 2 (relógio real, a partir de 2026-09-25 11:55).
- Android, aparelho físico, build Release e configuração de produção.
- A folha de vidas com "Revisar agora": a lição passa `dueReviewCount={0}` à
  folha, então o botão nunca aparece nela; não foi investigado se é intencional.
- "Ver assinatura" apareceu na folha (StoreKit disponível no simulador); a
  compra não foi tocada (fora do escopo, é do dono).

Capturas e saídas do Maestro ficaram fora do Git, como manda o
[README](README.md).
