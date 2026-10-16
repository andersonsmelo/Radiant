# ADR — Revisão como prática paralela, resumo honesto e lembrete diário ligado

Data: 2026-10-16. Decisor: Anderson Melo. Executa os itens 41, 42 e 44 da FILA,
abertos pela [avaliação completa da trilha](../evidence/2026-10-16-avaliacao-completa-da-trilha.md).
Substitui a regra de estrelas da [spec de 2026-08-14](../superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md),
que mostrava a melhor tentativa.

## Decisões do dono, nesta conversa

1. **Confiança primeiro:** corrigir o resumo, a progressão e o lembrete antes
   de atacar o conteúdo.
2. **A revisão não é portão:** ela vira prática paralela e não tranca a trilha
   seguinte.
3. **Errar na revisão não custa vida.**
4. **O lembrete diário é ligado de verdade:** sai do modo sombra.

## O que muda

- **Conclusão de trilha.** Há uma régua única, `trackCompletion.ts`, usada pela
  tela e pela trilha ativa. Lições, conquistas e avaliações são obrigatórias;
  revisões não contam. As duas réguas antigas divergiam: a tela trancava de
  novo a trilha seguinte a cada revisão vencida, enquanto a recomendação já
  estava nela.
- **Faixa entre trilhas.** Quando fechada, diz "Abre ao concluir {trilha
  anterior}".
- **Revisão na lição.** O erro não gasta vida e vidas zeradas não pausam. Isso
  cumpre o ADR de 2026-09-14 ("Revisão nunca consome vida"; vidas "não bloqueiam
  revisão"), que a revisão da trilha descumpria. A revisão vencida concluída
  devolve uma vida, como a tela `/review` já fazia.
- **Conclusão pela trilha do nó.** `markNodeCompleted` e a premiação acham a
  trilha que contém o nó, e não só a ativa. Sem isso, a revisão de uma trilha
  anterior era "nó desconhecido": não gravava conclusão, XP nem vida. O defeito
  já existia para revisões que venciam de novo; a decisão 2 o tornou o caminho
  de todo aluno que avança.
- **Resumo honesto.**
  - As estrelas e a frase são **desta tentativa**, e o recorde aparece à parte
    ("Seu recorde nesta lição: N estrelas").
  - A revisão diz "Revisão concluída" e não pede avaliação de aula.
  - O XP continua sendo o de participação. Ele já era "nesta tentativa" e não
    vinha do acerto.
- **Lembrete diário.**
  - `PUSH_SHADOW_MODE` passa a `false`.
  - Estude reavalia o lembrete a cada foco, porque a Home legada, a única que
    agendava, não se alcança com a trilha.
  - O convite aparece uma vez no topo de Estude, depois da primeira lição
    concluída. Ele não entra no resumo, que segue limpo pela decisão de
    2026-08-14.
  - Com a meta fechada e nenhuma revisão vencida, o lembrete pendente é
    cancelado, porque o texto dele ("sua meta do dia segue disponível") chegaria
    mentindo.

## O que continua igual

- Lições e avaliações custam vida no erro.
- O lembrete é no máximo 1 por dia, entre 18h e 21h, e só com aceite e
  permissão.
- A lógica de recuo para quem ignora o lembrete continua sem efeito: só roda
  quando o app abre, e cada abertura a zera. O teto real é que o lembrete só se
  agenda com o app aberto, e há no máximo um pendente. Quem some recebe no
  máximo um.

## Consequências

- O ramo de agendamento real nunca tinha rodado. Na primeira execução no
  simulador, ele lançou: o `expo-notifications` 0.32 recusa um `Date` cru como
  horário. Foi corrigido para `{ type: DATE, date }`, e o cartão de convite não
  trava mais se o agendamento falhar.
- Fica para depois:
  - a frase de 0 estrela ainda supõe um quase acerto ("Faltou pouco", "pela
    metade"), e o Pixel comemora mesmo com 0 estrela;
  - o `LearningAttemptRecorder` resolve o tópico pela trilha ativa;
  - o analytics de produto (FILA 43) e o conteúdo (FILA 45) seguem abertos.
- Evidência: [`evidence/2026-10-16-pacote-de-confianca-da-trilha.md`](../evidence/2026-10-16-pacote-de-confianca-da-trilha.md).
