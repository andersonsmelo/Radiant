# F6: notificações personalizadas e decorações (plano)

> Para agentes: execute tarefa a tarefa, com TDD (vermelho visto antes do verde, guardado em
> `docs/evidence/2026-11-15-f6-notificacoes-decoracoes/vermelho.md`).

**Objetivo:** lembrete local que fala do estudo real do aluno, na voz do elenco, com limites
duros; e decorações cosméticas ganhas por conquista verificável, equipadas no Perfil.

**Base:** levantamento em
[`evidence/2026-11-15-f6-notificacoes-decoracoes/levantamento.md`](../evidence/2026-11-15-f6-notificacoes-decoracoes/levantamento.md).
Brief do controlador da 1.6 (2026-11-15). Decisões delegadas: nenhuma pergunta ao dono.

## Restrições globais

- `ENABLE_PERSONALIZED_NOTIFICATIONS` e `ENABLE_DECORATIONS` em `src/config.ts`, lidas de
  `EXPO_PUBLIC_*`, padrão `false`. Desligadas, o app é o da `main` (teste com contraprova).
- Não tocar `features/league`, famílias de interação, `ui/characters/cast` nem a tela de
  assinatura. Em `ProfileScreen.tsx` e `docs/STATUS.md`, só inserções localizadas.
  `JourneyHomeScreen.tsx` fica intocado.
- Texto: convite, nunca culpa, ameaça de perda, "!" ou "revisado por especialista".
- Acessibilidade: rótulo em todo controle, alvo de 44 pt, estado escrito (não só cor),
  sem animação nova.

## Abordagens consideradas

**Notificações**

1. **Ramo personalizado dentro do `PushService` (escolhida).** Reaproveita aceite,
   permissão, recuo e os dois chamadores. Com a flag ligada, o conteúdo e o horário vêm de
   um compositor puro; o agendamento usa identificador fixo e um único gatilho de data.
2. Serviço novo com gatilho diário repetido. Recusada: um gatilho que se repete continua
   chegando a quem sumiu (fere o "único retorno") e congela o texto do dia em que foi criado.
3. Agendar vários dias à frente, um texto por dia. Recusada: texto envelhece (revisão que
   já foi feita, sequência que já mudou) e acumula pendências.

**Decorações**

1. **Desbloqueio gravado e monotônico, avaliado em silêncio (escolhida).** A sequência atual
   volta a 1 e as missões só guardam o dia corrente; se o item dependesse do estado vivo, ele
   trancaria de novo. Uma vez cumprida, a regra grava o item como ganho, sem celebração.
2. Avaliar sempre do estado vivo. Recusada pelo motivo acima.
3. Celebrar cada desbloqueio. Recusada: na atualização, quem já cumpriu receberia uma chuva
   de celebrações. Nenhum desbloqueio celebra; o item aparece liberado.

## Decisões

**Notificações (A)**

- Compositor puro `planReminder(ctx)` em `features/push/personalized/composeReminder.ts`.
  Devolve `{ kind, voice, title, body, route, fireAt }` ou `{ skip: motivo }`.
- Dia-alvo: hoje, se o aluno não estudou hoje, o horário de hoje ainda está 15 min à frente e
  nenhum lembrete de hoje já disparou; senão, amanhã. No máximo um por dia por construção.
- Horário: a hora em que mais estudou nas últimas 40 tentativas (mínimo 5), presa entre 9 h e
  21 h; sem dado, 19 h. Silêncio das 21 h 01 às 8 h 59.
- Tipo, nesta ordem, cada um só se a preferência dele está ligada:
  `retorno` (último estudo 3 dias ou mais antes do dia-alvo) → `sequencia` (sequência de 2
  dias ou mais, último estudo na véspera do dia-alvo) → `revisao` (revisões devidas) →
  `liga` (posição conhecida, até a 10ª) → `aula` (próxima aula pelo nome) → `meta` (meta
  aberta e dia-alvo hoje). Nada aplicável: não agenda e cancela o pendente.
- Vozes, pela bíblia da F7: sequência e retorno com o Pixel (pergunta, propõe o passo), revisão
  com a Profa. Lia (imperativo gentil), aula com o Caio (calmo, "a gente"), meta e liga com a
  Duda (primeira pessoa, estuda junto). O nome vai no início do corpo.
- Rotas: revisão → `/review`; os demais → `/` (a Estude, que destaca a próxima aula).
- Retorno único: só existe um pendente por vez e só se agenda com o app aberto; quem não abre
  recebe no máximo um. O gatilho é sempre `DATE`, nunca repetido (asserido).
- Preferências por tipo (`sequencia`, `revisao`, `aula`, `meta`, `liga`; o retorno segue `aula`)
  em `@radiant:notification_preferences_v1`, linhas nos Ajustes sob "Lembrete", só com a flag.
  O liga-desliga geral continua o `push.optin.v1`.
- Liga: porta `LeagueStandingSource` com `getStanding(): Promise<{ rank; totalPlayers } | null>`
  e adaptador vazio padrão. A ligação ao `LeagueService` fica para depois do merge da #72.
- Toque: `useNotificationRouting()` montado no layout das abas (depois dos portões), lê
  `data.url` e só navega para rota da lista permitida.

**Decorações (B)**

- Catálogo em `features/decorations/catalog.ts`, 11 itens em três encaixes: moldura do avatar,
  selo ao lado do nome, tema do cartão do perfil. Cores só de tokens do tema; selo em SVG.
- Regras por estado existente: aulas concluídas, unidades concluídas (pela trilha), sequência
  atual, todas as missões do dia feitas, nível por XP. Três itens exclusivos de assinante,
  decididos por `subscriptionService.getStatus` (`kind === 'unlimited'`), avaliados ao vivo:
  quem deixa de assinar não os vê equipados, mas a escolha fica guardada.
- Store `@radiant:decorations_v1` `{ schemaVersion: 1, unlocked: string[], equipped: { moldura?, selo?, cartao? } }`,
  classe `economia`. Entra no backup do iCloud como campo opcional `decorations` (união dos
  ganhos; equipado local vence) e no reset do `IosHomologationService`.
- Tela `/decoracoes` com entrada no Perfil; item bloqueado diz como se ganha; exclusivo leva a
  `/subscription`. Com a flag desligada, a rota volta para `/`.

## Tarefas

1. **Flags** (`config.ts`, contrato): duas flags com padrão `false` e o teste do contrato.
2. **Compositor** (`composeReminder.ts` + tabela de casos): dia-alvo, silêncio, tipos, vozes,
   rotas, preferência, tom (lista de palavras proibidas).
3. **Contexto e preferências** (`reminderContext.ts`, `notificationPreferences.ts`,
   `LeagueStandingSource.ts`): hora usual, estudou hoje, próxima aula; leitura tolerante.
4. **Agendamento** (`scheduleReminder.ts`, ramo no `PushService`): identificador fixo,
   idempotência asserida sobre a lista agendada, permissão negada e aceite desligado.
5. **Toque e Ajustes** (`useNotificationRouting.ts`, `NotificationTypeRows.tsx`, layout das
   abas, Ajustes).
6. **Catálogo e regras** (`catalog.ts`, `unlocks.ts`): 11 itens, regras puras, silêncio.
7. **Serviço** (`DecorationsService.ts`): sync, equipar, exclusivo, inventário, backup, reset.
8. **Tela e Perfil** (`DecorationsScreen`, `DecorationsProfileRow`, `ProfileIdentityHeader`,
   rota): acessibilidade e flag desligada.
9. **Revisão independente, gate, simulador, ADR, STATUS, PR.**

## Foco da revisão

- Fuso: "hoje" é a data local (`formatLocalDateKey`), nunca `toISOString` (o defeito de UTC
  de 2026-11-06). Caso de teste às 23 h e às 0 h 30.
- Aluno que nunca estudou: sem sequência, sem hora usual, sem tentativa; o compositor cai na
  aula ou na meta às 19 h.
- Reabrir o app três vezes no mesmo dia: a lista agendada continua com um item.
- Permissão negada depois de agendada: o próximo foco cancela o pendente.
- Assinatura que expira com item exclusivo equipado: o Perfil volta ao padrão sem quebrar.
