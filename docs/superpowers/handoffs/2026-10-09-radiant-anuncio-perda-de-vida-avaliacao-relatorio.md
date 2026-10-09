# Relatório — o anúncio da perda de vida nas avaliações da V2 (FILA, 35), 2026-10-09

**Branch:** `feat/d4-decisoes-de-revisao` (PR #38). **Run do Loop:**
`run-1791569456850-2f4ed8ac`.

## O defeito

Errar numa "Avaliação k de 5" debitava uma vida (`CheckpointScreen.tsx:326`,
`heartsRepository.spend`). Quem enxerga via o coração cair no HUD da tela, mas
o leitor de tela não ouvia nada. A lição anuncia desde o item 25, de
2026-09-28.

## Quem gasta vida (enumerado, não presumido)

`grep` por `heartsRepository.spend` fora dos testes deu três chamadores:
- a lição (`LessonFlowScreen.tsx`), que já anunciava;
- a avaliação (`CheckpointScreen.tsx`), consertada aqui;
- o quiz antigo (`useQuiz.ts:153`), que segue em silêncio. A rota `/quiz` não
  tem ponto de entrada no app: nenhum `router`, `href` ou `pathname` aponta para
  ela, e o comentário de `LessonFlowScreen.tsx:24` diz o mesmo. Fica fora.

## Conserto

- **A frase saiu da lição** para `src/features/hearts/heartLossAnnouncement.ts`,
  com a lógica copiada sem mudança: anuncia só se o contador cair, nunca ao
  assinante. A lição passou a usá-la, e os testes dela ficaram verdes sem
  edição.
- **A avaliação anuncia** a frase sozinha: "Você perdeu uma vida; restam N." ou
  "Você perdeu sua última vida.". **Sem "Resposta incorreta."**, porque a
  avaliação não diz por item se a resposta estava certa. O HUD que quem enxerga
  vê também mostra só a vida. O texto é o que o dono aprovou em 2026-09-28; o
  recorte, sem o prefixo, é inferência do agente, e muda se o dono quiser.
- A pergunta já cobrada na mesma tentativa não cobra de novo, e por isso não
  anuncia de novo: o anúncio segue a cobrança, não o erro.

## Testes e guardas

9 testes novos:
- `heartLossAnnouncement.test.ts`, 4: restam N; a última; o assinante, inclusive
  quem assinou com zero; o contador que não cai;
- `CheckpointScreen.flow.test.tsx`, 5: errar anuncia quantas restam; a última
  vida; o assinante não ouve; acertar não anuncia; a mesma pergunta errada de
  novo na mesma tentativa não anuncia de novo.

**Vermelho, observado antes do conserto:**
- a função: `Cannot find module './heartLossAnnouncement'`;
- a tela, 3 de 5 pelo defeito: a lista de anúncios de vida veio vazia. Os outros
  2 afirmam "não anuncia" e passavam, como deviam; foram provados por injeção.

**Injeção de defeito, uma por vez, com os arquivos restaurados e comparados
byte a byte no fim:**

| Defeito injetado | Guarda que falhou |
|---|---|
| g. trata o assinante como perda (sem olhar o status) | "não diz nada ao assinante" (função) |
| h. anuncia a chamada a `spend`, e não a queda | "a última vida" e "o assinante não ouve" (tela) |
| i. anuncia em toda resposta | "errar anuncia", "acertar não anuncia" e "a mesma pergunta" |
| j. anuncia o erro, e não a cobrança | "a mesma pergunta, errada de novo, não anuncia de novo" |
| k. sem o ramo da última vida | 3 testes, entre a função, a tela e a lição |

## Gate

`EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`, Node `v20.20.2`,
2026-10-09, às 15:14, com a árvore só com os arquivos do run: exit 0,
**156 suítes / 1499 testes** (1 suíte e 9 testes a mais que a medição
anterior, de 155 / 1490), lint com 0 erros e 26 avisos (os mesmos), visual QA
sem regressão.

## O que não foi verificado

- **O VoiceOver de verdade.** O Jest afirma a chamada a
  `announceForAccessibility`, não o que se ouve.
- **A última vida com a folha.** Ao zerar, a folha de vidas abre logo depois do
  anúncio, e o VoiceOver pode cortá-lo ao mudar o foco. A lição tem o mesmo
  comportamento desde o 25, e ele também não foi conferido no aparelho.

## Próximo

Pela FILA, o primeiro item do agente passa a ser o **16**: o caminho 3 do E2E
afirma o estado da L1.
