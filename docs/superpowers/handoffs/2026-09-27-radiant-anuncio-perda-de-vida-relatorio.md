# Relatório — anúncio da perda de vida ao leitor de tela (FILA, 25)

**Sessão:** de 2026-09-27, às 22:48, a 2026-09-28, por volta da 01:00 (−03),
a partir do [prompt (8)](2026-09-27-radiant-prompt-de-continuidade-8.md).
**Branch:** `feat/d4-decisoes-de-revisao`, que é o da PR
[#38](https://github.com/andersonsmelo/Radiant/pull/38), ainda aberta.
**Run do Loop:** `run-1790561932608-e64d97ea`.

## O que mudou

`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`: o
anúncio que a lição já fazia ao confirmar uma resposta passou a incluir a
vida, com o texto aprovado pelo dono nesta sessão:

- "Resposta incorreta. \<explicação\> Você perdeu uma vida; restam N.";
- na última vida: "Resposta incorreta. \<explicação\> Você perdeu sua última
  vida.".

O anúncio segue a **queda real do contador** que `spend` devolveu, e não o
fato de a cobrança ter sido chamada. Por isso:
- o assinante (∞) não ouve nada sobre vidas, mesmo quando a leitura das
  vidas ainda não chegou à tela;
- quem já está em 0 também não ouve nada;
- o segundo toque na mesma pergunta não debita
  ([ADR](../../adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md),
  decisão 2), e continua sem anunciar nada.

## Escopo: o checkpoint ficou fora, por decisão do dono

O prompt (8) dizia que "o checkpoint usa o mesmo fluxo". **O código mostra o
contrário.** A vida é debitada em quatro lugares:

| Tela | Alcançável pelo aluno | Anúncio hoje |
|---|---|---|
| lição (`LessonFlowScreen.tsx`) | sim | **consertado neste run** |
| checkpoint (`CheckpointScreen.tsx:324`) | sim | nenhum: nem do erro, nem da vida |
| quiz antigo (`useQuiz.ts:153`) | não se achou link para `/quiz` | nenhum, só vibração |
| piloto híbrido (`HybridLessonScreen.tsx:128`) | não: só em build de desenvolvimento | não conferido |

O dono quer **remover o checkpoint** até entender a função dele no app,
porque ele não parece importante para o usuário. Por isso o checkpoint não
entrou no conserto, e a remoção virou o item 29 da FILA, que é decisão dele.
Enquanto o checkpoint existir, o erro ali debita vida em silêncio para quem
usa VoiceOver.

## Evidência

**Medido:**
- **Vermelho antes do conserto**, na mesma sessão, no Node `v20.20.2`: 2 de 4
  testes novos reprovaram pelo motivo previsto. O anúncio chegava como
  "Resposta incorreta. A opacidade focal com broncograma aéreo sugere
  consolidação alveolar." e não tinha a vida.
- **Guardas vistas falhando pelo defeito que nomeiam**, com o defeito
  injetado no arquivo de produção e o Jest chamado sobre o arquivo de teste:
  - tirar a condição da queda do contador → "sem queda real do contador, não
    anuncia débito" reprova, e o anúncio sai com "restam 4";
  - tirar a condição do assinante → "assinante não perde vida…" reprova, e o
    anúncio sai com "Você perdeu sua última vida.";
  - fazer o segundo toque anunciar → "protege uma confirmação dupla…"
    reprova, com 2 chamadas em vez de 1.

  O arquivo foi restaurado e conferido com `cmp`.
- **Verde:** o arquivo da lição deu 26 de 26.
- **Gate** `EXPO_NO_DOTENV=1 npm run quality`, em 2026-09-28 às 00:56, Node
  `v20.20.2`: exit 0, **152 suítes / 1455 testes** (eram 1451, mais os 4
  novos), lint com 0 erros e 26 avisos, e visual QA com 0 regressões.

**Não verificado:**
- **O VoiceOver de verdade.** O Jest confere a chamada a
  `announceForAccessibility`, e não a fala. Não pedi conferência no aparelho:
  o VoiceOver já leu o anúncio desta tela no iPhone em 2026-09-27, e só o
  texto mudou.
- **A última vida fora do último passo.** O anúncio sai e, logo depois, a
  folha de vidas (um `Modal` com `accessibilityViewIsModal`) abre e recebe o
  foco. Não se sabe se o iOS corta o anúncio para ler a folha. Se cortar, o
  aluno ouve o título da folha, que também diz que as vidas acabaram.
- **Um caso de borda aceito:** se a tela tiver uma contagem mais baixa que a
  guardada (uma vida recarregou por tempo desde a última leitura), `spend`
  pode devolver o mesmo número que a tela já mostrava. Aí nada é anunciado, e
  o HUD também não muda.

## Arquivos

- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
  (4 testes novos e uma asserção a mais no da confirmação dupla)
- `docs/STATUS.md`, `docs/archive/STATUS_historico.md`
- `docs/FILA.md` (25 fora, 29 novo, 20 sem a dependência do 25),
  `docs/archive/FILA_concluidos.md`
- `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- este relatório e o
  [prompt (9)](2026-09-27-radiant-prompt-de-continuidade-9.md)

## O que fica

- **20, o bump para `1.4.0`:** o dono deu o ok em 2026-09-28, no fim desta
  conversa. Fica para a sessão seguinte, por uma frente por conversa.
- **29, remover o checkpoint:** decisão do dono. Antes dela, o agente pode
  levantar o que o checkpoint faz hoje.
- **28, o merge da #38:** do dono. Este commit entra nela e faz o CI rodar de
  novo.
