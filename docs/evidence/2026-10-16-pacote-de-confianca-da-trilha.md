# Pacote de confiança da trilha — 2026-10-16

Escopo: itens 41, 42 e 44 da FILA, com as decisões do dono registradas no
[ADR](../adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md). Branch
`codex/radiant-study-improvements`, base `8daa889`. Sem publicação nem
integração à `main`.

## Causa de cada defeito, antes do conserto

| Defeito visto | Causa no código |
| --- | --- |
| Revisão 0 de 1 com "Três estrelas. Nada passou despercebido." | `resolveBestLessonStars` devolvia a **melhor** nota, e a frase era escolhida por ela |
| Trilha 2 "BLOQUEADO" com 8 de 8 e conquista feitas | `isTrackCompleted` exigia revisões. Havia **duas** réguas divergentes: o status na tela e `completedNodeIds` no serviço |
| Errar a revisão custava vida, e vida zerada pausava | o `LessonFlowScreen` cobrava todo erro sem olhar o tipo do nó, contra o ADR de 2026-09-14 |
| A revisão da trilha não devolvia vida | só o `ReviewScreen` chamava `rewardReview` |
| Nenhum lembrete chegava | `PUSH_SHADOW_MODE: true` fixo, e o agendamento só era chamado pela Home legada, que não se alcança |

## Achados durante o trabalho

- **O lembrete, quando ligado, lançava.** O ramo real nunca tinha rodado. No
  simulador, o `expo-notifications` 0.32 recusou o `Date` cru ("needs to contain
  a `type` or `channelId` entry"), e o cartão ficou preso em "Ativando...". O
  primeiro teste não pegou o erro, porque o mock aceitava qualquer formato.
- **A revisão de uma trilha anterior não registrava nada.** Com a revisão fora da
  conclusão de trilha, o aluno avança antes. A revisão vencida da trilha 1, feita
  da trilha 2, deu `Nó desconhecido "node:review:…radioatividade…"` no log: sem
  conclusão, sem XP e sem vida. A conclusão passou a localizar a trilha do nó.
- **O agendamento não reavaliava.** Ele retornava cedo com lembrete pendente, e
  um lembrete de "meta aberta" chegaria depois de o aluno fechar a meta. Agora o
  motivo é decidido primeiro, e o pendente é cancelado quando não há mais
  motivo.
- **Regra antiga substituída:** "Avançar só com tudo concluído" virou "avançar
  com lições, conquista e avaliações".

## Testes

Cada guarda nova foi vista falhando pelo motivo previsto e voltou ao verde.
Algumas pelo vermelho natural do defeito, outras por injeção:

- **Conclusão de trilha:**
  - a tela voltou a exigir revisões → "abre a trilha seguinte com revisões
    vencidas ou futuras";
  - o serviço voltou a exigir revisões → "avança com lições e conquista
    concluídas…";
  - a régua sem o filtro de revisão, e a régua aceitando trilha vazia → os casos
    de `trackCompletion.test.ts`.
- **Faixa:** "Abre ao concluir…" não existia (vermelho natural).
- **Estrelas:**
  - `resolveAttemptStars` não existia;
  - o resumo não mostrava o recorde;
  - a revisão dizia "A lição foi concluída".
- **Revisão na lição:** o erro gastava vida (1 chamada contra 0); com vidas
  zeradas, a revisão pausava.
- **Vida devolvida:**
  - a revisão vencida não devolvia (0 chamadas);
  - devolver sempre → "revisão fora de prazo e lição não devolvem vida" caiu.
- **Trilha do nó:**
  - a revisão da trilha anterior não era gravada (`completedNodeIds` sem ela);
  - a conclusão voltou a usar `getSnapshot()` → "resolve a premiação pela
    trilha do nó…" caiu.
- **Lembrete:**
  - em modo sombra, nada era agendado;
  - o lembrete pendente não era cancelado;
  - o horário não estava no formato `{ type: 'date' }`;
  - o cartão travava quando o agendamento falhava;
  - Estude não chamava o agendamento;
  - o convite incondicional fez cair "antes de concluir uma lição, não convida".

As suítes de `journey`, `lesson-flow`, `quiz` e `push` passaram com
**39/39 suítes, 421/421 testes**, no Node 20.

A primeira `loop validate` reprovou no `app-quality`, sem mostrar saída. O
comando do gate rodado local (`EXPO_NO_DOTENV=1 npm run quality`, Node 20)
mostrou a causa: o contrato Maestro extrai do `LessonSummary` o subtítulo
**literal** da lição, e ele tinha virado uma expressão. Os dois subtítulos
voltaram a ser texto literal, com o da lição primeiro. Gate local depois disso:
**164/164 suítes, 1604/1604 testes**, 29/29 no contrato Maestro, 0 regressões
no QA visual e lint sem erros.

## No simulador

iPhone 17 `0A1B5AAA-…`, iOS 26.5, binário 1.4.0 (3), Metro no perfil V2:

- a trilha 2 abriu ("PRÓXIMO NÍVEL"), e o PRÓXIMO é a primeira lição dela;
- o convite apareceu no topo de Estude. "Ativar lembretes" levou ao pedido do
  iOS. Depois do conserto, o agendamento real ficou para 18:38 locais, com o log
  `real_schedule: scheduled_review_18:38:00`;
- revisão errada: vidas em 5/5, resumo com 0 estrela, "Revisão concluída", sem
  avaliação de aula;
- revisão certa de uma trilha anterior, depois do conserto da trilha do nó: 3
  estrelas, **+18 XP** e "8 de 8 etapas". Antes do conserto: "Sem XP".

## E2E — regressão encontrada, conserto no run seguinte

`learning-critical-path` reprovou (165 s). Depois da segunda lição, a âncora
`'^.+\. \d+ de \d+ etapas concluídas\.$'` não estava visível, porque a trilha
centraliza o PRÓXIMO, como o `f39ac9e` passou a fazer hoje, e o cabeçalho fica
acima da tela. O comportamento é o pedido pelo dono (opção A). Os roteiros
ficaram desatualizados: 36 asserções em 13 arquivos usam essa âncora. `.maestro/`
não estava declarado neste run, então o conserto vai num run próprio, logo em
seguida.

## Limites

- Não vistos na tela: a pausa por vidas na lição (só teste), AX5 e o SE.
- Ficam para depois:
  - a frase de 0 estrela ainda supõe um quase acerto, e o Pixel comemora mesmo
    com 0 estrela;
  - o `LearningAttemptRecorder` resolve o tópico pela trilha ativa;
  - o recuo do lembrete para quem o ignora segue sem efeito (ver ADR).
