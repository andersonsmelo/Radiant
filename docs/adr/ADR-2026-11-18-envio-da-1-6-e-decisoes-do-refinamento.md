# ADR 2026-11-18 — Envio da 1.6 e decisões do refinamento visual

- **Data:** 2026-11-18 (decisões tomadas entre 2026-11-17 e 2026-11-18)
- **Decisor:** Anderson Melo (dono), em conversa com o Claude; cada decisão abaixo foi
  uma resposta dele a uma pergunta do agente
- **Estado:** aceita

## Contexto

As oito frentes da 1.6 estavam na `main` desde 2026-11-15. O refinamento visual
([spec](../superpowers/specs/2026-11-16-refinamento-visual-1-6-design.md)) deixou duas
decisões em aberto, e o envio às lojas pediu outras. Elas estão juntas aqui porque
foram tomadas na mesma conversa e saíram na mesma build.

## Decisão

1. **Relevo.** A peça de resposta com lábio vale nas quatro superfícies que o aluno
   alcança: múltipla escolha, parear, comparação e cartão de revisão. O quiz antigo
   fica fora, porque nenhuma rota chega a ele.
2. **Sequência parada mostra 0.** Quando estudar hoje não estenderia a sequência, as
   telas mostram 0, como o widget já mostrava. A contagem guardada não muda, e
   sincronização, decorações e lembretes continuam lendo a guardada.
3. **"Selecionar esta ordem" é botão,** e não um texto tocável.
4. **Texto da apresentação inicial:** "Aqui você treina o dia a dia do tecnólogo em
   radiologia: aulas curtas, situações de sala e revisão no tempo certo.", no lugar de
   "Conteúdo em preparação.".
5. **Código sem uso sai:** `PixelHeroSplit`, `AnimatedCounter` e `GalaxyStatRow`.
6. **App Store.** A `1.6.0 (18)` foi à revisão com o placar da liga no mesmo envio e
   com lançamento automático depois da aprovação. O envio saiu sem a build ter sido
   vista em aparelho e sem compra em sandbox.
7. **Play.** A `1.6.0 (7)` foi ao teste fechado, e não à produção, que a conta ainda
   não pode pedir. O aviso de `android.hardware.screen.portrait` foi dispensado com
   "Vou resolver esse problema em breve".
8. **Ficha da loja.** A descrição passou a dizer que a assinatura dá vidas ilimitadas
   e três decorações exclusivas. A frase anterior, "único benefício", ficou falsa na
   1.6.

## Consequências

- A Apple aprovou a 1.6.0 em 2026-11-18. A chegada à loja não foi confirmada por
  consulta pública nesse dia.
- O risco do item 6 é do dono e está aberto: um defeito que só aparece em aparelho, ou
  na compra, chega aos alunos antes de ser visto. A conferência está na
  [FILA](../FILA.md), item 8.
- O item 7 deixa uma dívida com prazo: o recurso de retrato precisa virar opcional
  antes da build que for à produção do Play.
- A tela de assinatura do app ainda não cita as decorações exclusivas que a ficha da
  loja cita. Decidir isso está na FILA, item 8.
- Quem ler `streakDays` para mostrar ao aluno mostra o número errado num dia parado: a
  tela usa `shownStreakDays`.

Estado medido: [`STATUS.md`](../STATUS.md). Como foi feito:
[preparo do envio](../store/2026-11-17-preparo-envio-1-6.md) e
[evidência do refinamento](../evidence/2026-11-refinamento/README.md).
