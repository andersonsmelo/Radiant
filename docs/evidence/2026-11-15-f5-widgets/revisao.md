# Revisão independente — F5, widgets (2026-11-15)

Revisor: subagente `code-reviewer` que não escreveu o código. Recebeu os requisitos e
o diff, não as conclusões do autor. Rodou a pasta de testes em cinco fusos (26 de 26)
e `swiftc -typecheck` no Swift do widget (saída 0). Veredito: **pede mudanças**.

| # | Achado | Gravidade | Tratamento |
| --- | --- | --- | --- |
| 1 | A ponte rodava em `LessonOutcomeService.recordReward`, antes de `LessonFlowScreen` marcar o nó: o widget médio mostraria e reabriria a aula recém-concluída. | Importante | **Consertado.** `_layout` atualiza o widget quando o app vai para o fundo e quando volta: o widget só é visto com o app fora da tela, e nesse momento a jornada já está gravada. As chamadas nos pontos de mudança ficaram, agora em fila (item 3), e a do fundo é sempre a última. |
| 2 | Checkpoint, recompensa e fim da revisão mudam a próxima aula sem chamar a ponte. | Importante | **Consertado** pelo mesmo mecanismo do item 1, sem tocar nessas telas. |
| 3 | Chamadas concorrentes: uma leitura velha e lenta podia gravar por último. | Menor | **Consertado.** Fila em `createWidgetBridge`; cada execução lê o estado quando roda. Teste novo, visto vermelho (`vermelho-ponte.txt`). |
| 4 | O lockfile subiu `@expo/image-utils` 0.8.8 → 0.8.17 e outros para todas as builds; "chave desligada = main" não valia como escrito. | Importante | **Medido e registrado.** Prebuild da `main` com o próprio lockfile contra a branch: idêntico, PNGs incluídos, salvo o identificador aleatório do Sentry (`prebuild-chave-desligada.txt`). A ADR diz agora que as versões das ferramentas mudam e a saída não. |
| 5 | Último estudo "no futuro" (viagem para oeste, relógio atrasado) mostrava 0. | Menor | **Consertado.** `lastActiveDate >= dia` conta como hoje. Teste visto vermelho. |
| 6 | Troca de fuso depois da gravação: meias-noites no fuso antigo. | Menor | **Consertado** pela atualização ao voltar ao primeiro plano (item 1). Sem o app abrir, continua no fuso da gravação; limite aceito. |
| 7 | O widget mostra 0 quando a sequência quebrou e a home ainda mostra o número gravado. | Menor | **Registrado** na ADR (Consequências) e no runbook. Alinhar a home é decisão do dono. |
| 8 | Teste da meia-noite era espelho da implementação; nenhum teste nos pontos de chamada. | Menor | **Parcial.** Teste novo verifica hora local 00:00 no dia de 25 h de Nova York, visto vermelho contra implementação defeituosa temporária. Os pontos de chamada seguem sem teste próprio: são uma linha cada, e o mecanismo que garante o dado final é a atualização no fundo. |
| 9 | Reinício pelo console de desenvolvimento deixava o widget velho. | Menor | **Consertado** pela atualização no fundo. |

Sem verificação do revisor nem do autor: o link frio de `/learn` com a tela de
boas-vindas ou um checkpoint na abertura, e a assinatura com App Group no EAS.

## O que o gate achou depois da revisão (primeira execução, 2026-11-15, ~15h)

`EXPO_NO_DOTENV=1 npm run quality` no Node 20.20.2 saiu com 1: 235 suítes, 2 reprovadas, 3087 de 3088 testes. As duas falhas eram desta mudança:

- `startup-gate.flow.test.tsx` não carregava: o `_layout` passou a importar a ponte, que importava o retrato, que importa o `StreakFreezeService`, que importa o `AsyncStorage` nativo. **Consertado:** a ponte carrega o retrato sob demanda, como já fazia com os serviços.
- `storageInventory.test.ts` (G7) achou a constante `WIDGET_SNAPSHOT_KEY` e cobrou entrada no inventário. O inventário é do AsyncStorage, e essa chave é do `UserDefaults` do App Group. **Consertado pelo desenho:** a chave passou a morar só no Swift (o módulo grava, o widget lê), e o JS não a conhece mais. O inventário não foi tocado.

## Achado do Codex na PR #77 (2026-11-15, ~16h)

| # | Achado | Gravidade | Tratamento |
| --- | --- | --- | --- |
| 10 | Com o último estudo um dia "no futuro" e uma proteção guardada, os quatro dias fixos da linha do tempo não alcançavam a quebra. Exemplo: retrato em 15/11, `lastActiveDate: '2026-11-16'`, `streakDays: 7`, `freezes: 1`. A quebra de 19/11 ficava de fora, e com a política `.never` o widget mostraria 7 até o app abrir. | P2 | **Consertado.** O horizonte para na quebra real: a linha do tempo segue até o primeiro dia em que a regra do `StreakFreezeService` zera a sequência e a meta já venceu. O teto de sete viradas só segura um `lastActiveDate` absurdo. Teste do caso exato visto vermelho contra `e4e895f` (vermelho 5). Guarda do teto vista vermelha contra uma implementação temporária sem teto (vermelho 6). Limite aceito: estudo mais de ~4 dias no futuro deixa a quebra fora do teto. |

Gate depois do conserto: `EXPO_NO_DOTENV=1 npm run quality` no Node 20.20.2, saída 0, 235 suítes e 3116 testes (os dois novos incluídos).
