# ADR: lembrete personalizado e decorações do perfil (F6 da 1.6)

Data: 2026-11-15. Decisor: Claude, por delegação do dono para a atualização 1.6
([ADR de 2026-11-05](ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md) e pedido de
2026-11-13). Ligar as flags em produção é decisão do dono.

Plano: [`plans/2026-11-15-f6-notificacoes-e-decoracoes.md`](../plans/2026-11-15-f6-notificacoes-e-decoracoes.md).
Levantamento e vermelhos: [`evidence/2026-11-15-f6-notificacoes-decoracoes/`](../evidence/2026-11-15-f6-notificacoes-decoracoes/README.md).

## Contexto

O lembrete da 1.5.0 (ADR de 2026-10-16) escolhe entre dois textos genéricos ("revisões
pendentes" ou "meta do dia") e sorteia uma hora entre 18 h e 21 h. Não sabe o nome da próxima
aula, a sequência nem a hora em que o aluno estuda, e o toque só abre o app. Não há servidor
em produção, então tudo é local e agendado com o app aberto.

## Decisões

### Duas flags, desligadas

`ENABLE_PERSONALIZED_NOTIFICATIONS` e `ENABLE_DECORATIONS`, em `src/config.ts`, lidas de
`EXPO_PUBLIC_*` com padrão `false`. Desligadas, o lembrete, os Ajustes, o Perfil e o payload
do backup são os da 1.5.0, com contraprova em teste.

### Limites do lembrete

1. **No máximo um por dia e um pendente por vez.** Identificador fixo
   (`radiant.lembrete.personalizado`), cancelamento antes de cada agendamento e gatilho de
   data que não se repete. Um lembrete marcado para hoje que já passou do horário conta como
   enviado: o próximo é amanhã.
2. **Silêncio das 21 h 01 às 8 h 59.** A hora usual do aluno (a mais frequente nas últimas 40
   tentativas, com pelo menos 5) é presa entre 9 h e 21 h; sem dado, 19 h.
3. **Nada se o aluno já estudou hoje.** O lembrete vai para amanhã.
4. **Um único retorno.** Depois de 3 dias sem estudo o texto vira um convite de volta. Como só
   há um pendente e nada se reagenda sem o app aberto, quem some recebe no máximo um.
5. **Permissão e preferência mandam.** Sem aceite (`push.optin.v1`) ou sem permissão real do
   sistema, o pendente é cancelado no próximo foco. Cada tipo (sequência, revisão, aula e
   retorno, meta, liga) tem interruptor próprio nos Ajustes.
6. **Tom de convite.** Cada texto fala na voz de um personagem, conforme a bíblia da F7 (PR #73):
   Pixel na sequência e no retorno, Profa. Lia na revisão, Caio na aula, Duda na meta e na
   liga. Um teste reprova "perd", "acab", "última chance", "culpa", exclamação e "especialista".
7. **Toque abre a rota prometida,** só de uma lista (`/` e `/review`), e a resposta tratada
   é limpa para não repetir a navegação.
8. **O pendente se recalcula** no foco da Estude (como na 1.5.0), quando o app vai para o
   fundo e quando um tipo muda nos Ajustes. Assim quem estuda e fecha o app sem voltar à
   Estude não recebe à noite o convite da aula que já fez, e quem desliga um tipo às 18 h não
   recebe o das 19 h. Para amanhã, o título da revisão não cita a contagem de hoje.
9. **Liga:** porta `LeagueStandingSource` com adaptador vazio. Liga-se ao
   `LeagueService.getStanding()` depois do merge da PR #72; até lá, o tipo "liga" nunca sai.

### Regras de desbloqueio das decorações

Onze itens em três encaixes (moldura do avatar, selo ao lado do nome, cartão do perfil), só
com tokens do tema e SVG. Regras lidas do estado que já existe: aulas concluídas, unidades
concluídas (sem contar revisão, como a régua de `trackCompletion.ts`), sequência atual,
todas as missões do dia, nível por XP.

- O ganho é **gravado e não volta atrás**, porque a sequência zera e as missões só guardam o
  dia.
- O ganho é **silencioso**: não há evento de desbloqueio nem celebração. Quem atualiza para a
  1.6 com tudo cumprido encontra os itens liberados, sem chuva de comemorações.
- Uma regra só se avalia quando o Perfil ou a tela de decorações abre. Quem fecha as três
  missões e não abre o Perfil no mesmo dia não ganha a Estrela daquele dia.

### O que é exclusivo de assinante

Três itens, um por encaixe: moldura Ouro, selo Cometa e cartão Dourado. Decididos ao vivo
por `subscriptionService.getStatus` (`kind === 'unlimited'`), nunca gravados. Quem deixa de
assinar volta ao padrão no Perfil e a escolha fica guardada para quando voltar. O toque num
exclusivo bloqueado abre `/subscription`; esta frente não cria tela nem convite de assinatura
(é da F8).

### Storage, backup e reset

- `@radiant:notification_preferences_v1` (classe `preferencia`) e `@radiant:decorations_v1`
  (classe `economia`) no inventário.
- O backup do iCloud ganha o campo opcional `decorations`, que só existe quando o aparelho
  gravou alguma: ganhos se unem, o equipado do aparelho vence e o da nuvem só preenche um vazio.
  Um aparelho com a 1.5.0 lê o registro, mas, ao mesclar, regrava sem o campo.
- O reset local (`IosHomologationService`) apaga as decorações.

## Consequências

Da revisão independente (achados e tratamento na
[evidência](../evidence/2026-11-15-f6-notificacoes-decoracoes/README.md)), ficam para o dono:

- **Fuso nos testes (D4).** Os testes de data usam datas locais, mas o CI roda em UTC, onde
  dia local e dia UTC coincidem: trocar `formatLocalDateKey` por `toISOString` passaria lá.
  Fixar `TZ` dentro do arquivo de teste não funciona (o Jest dá uma cópia do ambiente). O
  conserto é `TZ` no `jest.config.cjs` ou no workflow, fora do escopo deste run.
- **"Já estudou hoje" conta aula, não revisão.** Quem só fez revisões ainda recebe convite à
  noite. É coerente com a sequência; mudar é decisão de produto.
- **Retorno segue a preferência "Próxima aula e retorno".** Desligada, quem sumiu há 3 dias ou
  mais não recebe nada, mesmo com revisão ligada.
- **Tipos visíveis com o lembrete geral desligado.** Os interruptores por tipo ficam nos
  Ajustes mesmo quando "Lembrete diário" está desligado; não têm efeito até ele ser ligado.
- **Toque durante uma aula** abre a rota por cima da aula. Não foi tratado.

- A entrega real de notificação em aparelho não foi vista; a lista agendada foi conferida em
  teste e no simulador.
- Com a flag de decorações ligada, o Perfil lê a trilha e a gamificação duas vezes por foco
  (as dele e as do serviço). O custo não foi medido; ficou assim para não mexer nas leituras
  do Perfil, que outras frentes também alteram.
