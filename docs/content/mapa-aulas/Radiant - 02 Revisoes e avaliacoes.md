# Revisões e avaliações — caminhos distintos

**Medido em 27/08/2026 · código `a05e94b` · inspeção estática.** Não certifica o comportamento de todas as telas no build do TestFlight nem aprovação clínica.

[[Radiant - 00 Comece aqui|Voltar ao atlas]]

## R1 — revisão na trilha

18 nós legados, um por aula. Cada bloco tem contexto, uma pergunta e reforço. Em geral usa a segunda questão; a aula base de TC configura outra seleção. É revisão curta no percurso, não prova de um calendário de repetição espaçada. Pode receber estado de revisão vencida no sistema de jornada; isso não a transforma nos 48 cartões editoriais.

## R2 — revisão espaçada legada

A rota `/review` usa `SpacedRepetitionService` para obter aulas vencidas. `useReview` pega apenas a primeira questão retornada por aula. `ReviewCard` mostra alternativas, permite **Mostrar resposta** e depois autoavaliação **Revisar depois / Acertei**. Não exige selecionar uma alternativa antes de revelar. A recompensa é de 4 XP por autoacerto.

Há uma ação para essa rota em `HomeScreen`, mas a aba Estude atual usa `JourneyHomeScreen`. **Acesso pela navegação principal não foi confirmado nesta inspeção**: rota existente não comprova que o aluno a encontre.

## R3 — quiz completo e modo revisão

A rota `/quiz` mantém o quiz legado, incluindo `mode=review`. O banco tem 38 questões; não somar novamente perguntas usadas por `/learn` ou `/review`. O percurso principal usa `/learn`. O gerador e os consumidores inspecionados preservam a ordem das alternativas.

## R4 — memória por competência

`CompetencyReviewService` implementa um modelo de revisão; `LessonOutcomeService` registra exposição. Não foram encontrados consumidores de produção para sua fila `getDue` e para `recordReview`. Portanto **motor disponível ≠ fila espaçada integrada ao percurso**. Os parâmetros do modelo não são evidência de retenção medida em alunos.

## R5 — reforço após avaliação

O lote registra recuperação guiada e nova tentativa em contexto diferente. A tela leva à atividade existente da primeira competência frágil. O contrato não comprova que existam duas novas aulas de recuperação autoradas. Revisar conteúdo de reforço e percurso completo após erro.

## A1 — checkpoints legados

15 nós entre aulas, distribuídos em 6 + 5 + 4 nas três trilhas. São posições de checkpoint na definição legada, não os 16 pacotes editoriais de checkpoint e não os cinco testes do lote promovido. Banco e comportamento de cada checkpoint legado precisam de caminhada dedicada; não foram contados como 15 provas completas nesta auditoria.

## A2 — avaliações por competência

Cinco etapas com dois itens cada; total de 10 itens. A meta configurada é 80%; com duas questões, exige acertar ambas. Revisar se esse tamanho oferece evidência suficiente para o objetivo pretendido.

**Problema confirmado de texto:** `CheckpointScreen.tsx:620` ainda diz “O checkpoint exige 8 acertos” no ramo de reprovação, embora as avaliações por etapa usem dois itens. É preciso derivar a mensagem do conjunto avaliado e testar reprovação/recuperação por estágio.

O feedback de avaliação é genérico e não explica o erro específico. A existência de aprovação de schema não avalia a qualidade desse feedback.

## Critérios para unificar a experiência — proposta

Distinguir **prática com ajuda**, **avaliação sem ajuda** e **revisão posterior**. Preservar identidade das questões e histórico ao mudar a apresentação. Não usar autoavaliação como única evidência de domínio de uma competência crítica. Definir pontos de entrada visíveis, estado vazio, offline, retomada e explicação de quando revisar novamente.
