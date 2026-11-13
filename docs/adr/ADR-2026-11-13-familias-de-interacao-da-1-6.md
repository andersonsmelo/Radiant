# ADR 2026-11-13 — Famílias de interação da 1.6

**Data:** 2026-11-13 (America/Bahia). **Decisor:** Claude controlador, por delegação
do dono (Anderson Melo) em 2026-11-13. **Executor:** sessão da frente F2, com dois
subagentes Sonnet para a conversão de conteúdo e um revisor independente.

## Contexto

Na 1.5.0 toda aula da trilha `rtg-2026` usa as mesmas quatro famílias:
`multiple-choice`, `case-decision`, `ordering` e `matching`, mais a comparação de
imagem piloto. A frente F2 da 1.6 pediu ao menos quatro famílias novas, escolhidas
de uma lista de cinco, no contrato, no verificador, no gerador e no tocador, e
aplicadas a M01, M02 e M03.

## Decisão 1 — as quatro famílias, nesta ordem de valor

1. **`true-false`**: o aluno julga de 3 a 4 afirmações, uma por vez, e recebe o
   retorno de cada uma na hora. É a conversão mais honesta de uma múltipla escolha:
   as alternativas já escritas viram afirmações julgáveis, e o distrator deixa de
   ser descartado por eliminação. Também é a mais rápida de responder, o que
   alterna o ritmo da aula.
2. **`cloze`**: completar a frase com palavras de um banco (1 ou 2 lacunas, 2 a 4
   distratores). Treina recordação do termo exato, que é o vocabulário que o
   tecnólogo precisa dizer e escrever (marcador, plano, unidade).
3. **`categorize`**: distribuir de 4 a 6 itens em 2 ou 3 grupos, tocando no item e
   depois no grupo. Substitui associações cujos lados direitos já eram classes,
   sem depender de arrastar.
4. **`multi-select`**: marcar todas as corretas; o retorno diz quais faltaram e
   quais sobraram. Serve quando o conceito lista várias condutas certas.

**`slider-estimate` ficou de fora.** A tarefa só o admitia com uma visualização
honesta e autoral em SVG ou Skia. A bancada de exposição (`bench`) já cobre kV e mAs
com o modelo de `exposureModel`; um segundo controle com visualização própria
pediria um modelo físico novo (distância, por exemplo) que nenhuma fonte da trilha
sustenta ainda. Fica para quando houver conteúdo que o peça.

## Decisão 2 — as garantias de cada família

As famílias novas recebem as mesmas garantias da múltipla escolha, no contrato
(`EditorialWideContract.ts`, `newFamilyIssues`) e no verificador da aula-fonte
(`scripts/content/rtg-lesson-lint.mjs`):

| Garantia | cloze | true-false | categorize | multi-select |
|---|---|---|---|---|
| Resposta constante | — | ao menos uma certa e uma errada | todo grupo com item | de 2 a n−1 corretas |
| Viés de posição | as respostas não abrem o banco na ordem das lacunas (o gerador embaralha) | — | os itens nunca ficam em blocos por grupo (o gerador intercala) | as corretas não ocupam todas as primeiras posições |
| A certa não é a mais longa | resposta até 1,2× o maior distrator | afirmação certa até 1,2× a errada mais longa | o rótulo do item não contém o nome do grupo | correta até 1,2× a maior errada |
| Erro com explicação própria | `feedback.incorrect` ≠ `feedback.correct` | idem, mais explicação por afirmação | idem | idem, mais explicação por alternativa |

Proveniência por afirmação: palavra-resposta, afirmação, item e alternativa correta
citam a fonte; palavra que sobra no banco e alternativa errada são distratores
autorais (`authorial-distractor`), como na múltipla escolha.

## Decisão 3 — o tocador

Os quatro componentes seguem o contrato do registro (`interaction / value /
onChange`): o aluno responde, o botão do rodapé diz "Conferir resposta", e só a
confirmação conta. A exceção deliberada é o `true-false`, em que julgar uma
afirmação é a decisão dela: o retorno da afirmação aparece na hora e o julgamento
não volta atrás. O player confere o conjunto quando todas estão julgadas.

Vidas, XP, estrelas, combo, retomada e fila de revisão não mudaram. Cada efeito
tem um chamador na tela (`heartsRepository.spend`, `nextCombo` e
`LessonOutcomeService.recordActivityCompletion`), e todos decidem por
`isCorrectInteractionValue`, que agora conhece as quatro famílias. Os testes de
`LessonFlowScreen.flow.test.tsx` provam uma vida por erro, mesmo com toque duplo, e
uma conclusão só, inclusive depois da retomada.

Microinterações: pressionar 100 ms, confirmar 150 ms e entrada de etapa 200 ms
(`F2_MOTION`), pelos hooks de `ui/motion`, que trocam o movimento pelo estado final
quando o aluno pede menos movimento. Som e vibração continuam saindo só do
`lessonFeedback` do tocador.

## Decisão 4 — a meta de M01 a M03

"Pelo menos duas famílias diferentes de `multiple-choice`" foi lida como pelo menos
**duas famílias novas** por aula, porque toda aula já tinha duas famílias que não
são múltipla escolha. Junto: nenhuma família três vezes seguidas, e a primeira
interação continua `multiple-choice` (motivo na decisão 5). A regra da trinca **não**
entrou no verificador universal: seis aulas de outras unidades (m05-06, m10-06,
m11-06, s-ir-05, s-rm-08, s-tc-05) encadeiam três casos de propósito. Ela vale como
meta de M01 a M03, em `RtgCatalog.test.ts`.

Foram convertidas 36 interações (12 por unidade), sem fato novo: cada afirmação,
palavra e grupo saiu da interação original, do conceito da aula ou dos retornos já
escritos. Ids, papéis, pistas, fontes e marca de segurança foram mantidos.

## Decisão 5 — quem atualiza da 1.5.0

A `contentVersion` de M01 a M03 continua `-v1`. A versão entra na chave de todo
cartão de revisão (`itemKey`), inclusive dos itens de conferência e recuperação,
que não mudaram; subir o sufixo forçaria a reconciliação de todos eles por uma
mudança que só tocou a prática. Não foi medido o que a troca faria com a
conferência já aprovada, e por isso não se arriscou. Consequências medidas em
teste:

- **Aula em andamento.** As respostas no meio da aula não são guardadas; a
  retomada volta no máximo à primeira interação (`resumeStepIndex`). A estrutura
  da aula (abertura, conceito, cinco interações, fecho) não mudou, então o cursor
  continua válido e a interação aparece já na família nova, sem resposta antiga.
  Teste: "retomada no meio volta à primeira interação".
- **Fila de revisão.** A revisão só mostra múltipla escolha. O cartão de uma
  interação que virou família nova perde a definição e o coordenador o reconcilia
  (sai da fila); os outros cartões da aula ficam com a data que tinham, e fila e
  contagem concordam, então nenhuma tela de revisão abre vazia. Como toda aula de
  M01 a M03 mantém a `i1` em múltipla escolha, toda aula continua com questão de
  revisão. Teste: `familyChangeUpgrade.test.ts`.
- **Custo aceito.** Se o único cartão vencido de uma aula era o da interação
  convertida, aquela revisão do dia some. A evidência antiga da `i2` em `-v1`
  continua registrada como múltipla escolha; o mesmo id em `-v1` agora é outra
  família. Não há chave nova no AsyncStorage.

## Fora do escopo

Áudio novo (F3), liga (F4), widgets (F5), notificações (F6), personagens (F7) e
conversão para pago (F8). Revisão da tela de revisão para mostrar as famílias
novas fica como pendência: hoje ela só mostra múltipla escolha.
