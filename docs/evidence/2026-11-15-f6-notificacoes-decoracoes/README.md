# F6: evidência (2026-11-15)

Frente F6 da atualização 1.6: lembrete personalizado local e decorações do perfil, atrás de
`ENABLE_PERSONALIZED_NOTIFICATIONS` e `ENABLE_DECORATIONS`, as duas desligadas por padrão.
Decisões na [ADR](../../adr/ADR-2026-11-15-notificacoes-personalizadas-e-decoracoes.md); plano
em [`plans/2026-11-15-f6-notificacoes-e-decoracoes.md`](../../plans/2026-11-15-f6-notificacoes-e-decoracoes.md).

- [`levantamento.md`](levantamento.md): o que já existia, com caminho e linha.
- [`vermelho.md`](vermelho.md): cada asserção nova vista falhando com o defeito que nomeia,
  incluindo as guardas que passaram com o defeito na primeira tentativa e foram corrigidas.

## Revisão independente

Um subagente que não escreveu o código revisou `741c3e3..938e850` e pediu mudanças. Tratamento:

| Achado | O que era | Tratamento |
| --- | --- | --- |
| D1 | Gate vermelho com a flag desligada: o mock de `expo-router` do Perfil guardava um único foco, e o gancho das decorações tomava o lugar do Perfil | Corrigido: o mock guarda todos os focos e o gancho voltou para antes do efeito do Perfil (22/22 em banda única). Com a flag ligada, 2 testes antigos ainda reprovam porque `mockRejectedValueOnce` é consumido pela leitura das decorações: artefato de teste, não defeito |
| D2 | Quem estuda e fecha o app sem voltar à Estude recebia à noite o convite da aula feita | Corrigido: o lembrete se recalcula quando o app vai para o fundo |
| D3 | Desligar um tipo nos Ajustes não cancelava o pendente | Corrigido: a mudança de preferência recalcula o pendente |
| D4 | Teste de fuso cego no CI em UTC | **Pendente.** `process.env.TZ` no arquivo de teste não tem efeito (o Jest entrega uma cópia do ambiente; visto passar com o defeito sob `TZ=UTC`). O conserto exige `TZ` no `jest.config.cjs` ou no workflow, fora do escopo deste run |
| D5 | Título de revisão para amanhã citava a contagem de hoje | Corrigido: para amanhã, o título não cita número |
| D6 | Exclusivo gravado em `unlocked` (backup editado) ficava disponível sem assinar | Corrigido: exclusivo só pela assinatura, e nunca gravado |
| D7 | Reset no meio de um `sync` podia ser desfeito pela gravação atrasada | Corrigido: contador de geração |
| D8 | A guarda de tom não via uma das variantes de sequência | Corrigido: cada tipo nos dois dias, e um teste conta 12 textos distintos |
| M1 | Textos da tela sem `key` por `fontScale` | Aplicado |
| M2 | Chave do último agendamento em três literais | Uma constante para o agendador e o contexto; o `PushService` mantém a dele |
| M4 | Resposta guardada podia repetir a navegação | `clearLastNotificationResponse` depois de tratar |
| Codex (PR #75) | Unidade com recompensa opcional não coletada não contava como concluída nas decorações, embora a trilha a mostrasse concluída | Corrigido: `progressFromSources` usa `isRequiredProgressionNode`, a régua da trilha (seção 17 do `vermelho.md`) |
| Liga (pedido do controlador, depois do merge da #72) | A porta `LeagueStandingSource` estava vazia | Ligada ao `LeagueService.getStanding()` só com `ENABLE_LEAGUE`, por carga tardia; desligada, o módulo da liga não é carregado (seção 18 do `vermelho.md`) |
| M3, M5, M6, M7 | Tipos visíveis com o geral desligado; toque durante a aula; revisão não conta como estudo; retorno segue "aula" | Registrados na ADR como decisão do dono |

Durante a contraprova, achei também a fila do serviço de decorações presa por uma leitura que
nunca resolvia; as leituras saíram da fila (seção 14 do `vermelho.md`).

## Gates

Todos no Node 20.20.2 (`node --version` conferido), na worktree `f6-notificacoes-decoracoes-8fda11`:

- `EXPO_NO_DOTENV=1 npm run quality`, 1ª vez, sobre `938e850`: **saída 1**, 2 testes reprovados de
  3219 (seção 15 do `vermelho.md`).
- 2ª vez, sobre `f825c77`: **saída 0, 244 suítes e 3227 testes**, 21 avisos de lint, nenhum em
  arquivo desta frente. Carga de 1 minuto em 4,94 na largada.
- `loop validate` (Node 24.14.1, run `run-1794756566107-d8930530`): `VALIDATION_PASSED`, 15 de 15
  validadores, com `app-quality` em 132 s e `app-test` em 120 s.

- Depois do achado do Codex (`030d017`): `npm run quality` com saída 0, 244 suítes e 3228 testes;
  `loop validate` 15 de 15.
- Depois de mesclar a `main` duas vezes (F2 e F1 em `74d685b`, widgets em `fcd4a8e`; merge
  `bb41b3e`): `npm run quality` com saída 0, **253 suítes e 3345 testes**, depois de `npm ci`
  (a primeira rodada reprovou só `widgetsPlugin.test.ts`, porque a dependência nova dos widgets não
  estava instalada nesta worktree).

- Merge final da `main` (`25edf25`, depois de F8, F7, F3 e liga) mais a porta da liga:
  `npm run quality` com saída 0, **272 suítes e 3660 testes**, Node 20.20.2.

## No simulador

Simulador próprio "Radiant F6" (`84B8865C`, iPhone 17 Pro, iOS 26.5), com o cliente de
desenvolvimento 1.5.0 copiado do "Radiant F2" (esta frente não traz código nativo) e o Metro
na porta 8086 com as duas flags ligadas e `EXPO_NO_TYPESCRIPT_SETUP=1`. Lido por
`maestro hierarchy`; desligado ao terminar.

**Visto:**
- Perfil com a linha "Decorações. 0 de 11 disponíveis." num aluno novo.
- Tela de decorações com o estado escrito em cada item ("Bloqueada: Conclua sua primeira
  aula", "Exclusiva do Radiant Ilimitado. Toque para conhecer.").
- O toque na moldura Ouro abre a tela de assinatura que já existia.
- Ajustes com "Do que o lembrete pode falar" e os cinco interruptores, inclusive com o lembrete
  diário desligado (M3).
- Ao ligar o lembrete e permitir, o log registra `personalized_scheduled`. A lista pendente do
  próprio sistema (`PendingNotifications.plist`) tem um pedido, `radiant.lembrete.personalizado`,
  "Próxima aula: O trabalho do tecnólogo", corpo na voz do Caio, rota `/`. O app gravou
  `push.lastScheduled.v1 = 22:00Z`, isto é, 19 h locais (aluno sem hora usual).
- Dois focos da Estude e uma ida para o fundo (`journey_focus`, `journey_focus`,
  `app_background`): a lista continua com **um** pedido.
- Com o storage do app de teste semeado com três itens ganhos e equipados: anel duplo da Órbita
  no avatar, selo Faísca ao lado do nome ("Selo Faísca" na árvore) e cartão com borda, e a
  linha "3 de 11 disponíveis".

**Não visto:** a entrega da notificação e o toque nela (nem em aparelho); o desbloqueio por
estudo de verdade (o ganho foi semeado, não conquistado na tela); leitor de tela falando.
