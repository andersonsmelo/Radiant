# PC06-D — renderer textual de minicasos Q6

Medido em 03/11/2026 na worktree `trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810`, com alterações anteriores
preservadas. Writer `run-1793749103231-cbf042db`, aberto pelo embrulho público.
O objetivo é implementar e conferir a base textual Q6; não publicar uma aula.

## Comportamento entregue

`CaseDecisionStepRenderer` está no registro dos sete renderers. Reutiliza os
botões de múltipla escolha existentes e exibe contexto e fase opcionais:
`decision` (Decisão), `reason` (Motivo) e `support` (Ação de apoio).
Cada capítulo é uma interação com identidade própria; o autor define uma
sequência linear. Não há ramificação adaptativa nem correção de texto livre.
O formato anterior, sem contexto/fase, permanece renderizável.

A resposta exige ID exato de alternativa. O aluno pode mudar a seleção até
confirmar; depois, o controle fica bloqueado e o retorno da alternativa errada
ou da interação aparece. O toque seguinte avança e limpa a seleção. Na última
interação, esse toque separado conclui a atividade. O histórico da primeira
resposta continua distinto da confirmação atual. A atividade com Q6 usa o modo
de feedback por item já existente, sem alterar `sessionMode` ou regras de repetição.
O teste de tela confirma zero gasto de vida no acerto e um gasto no erro,
sem nova cobrança no toque de conclusão.

A validação genérica recusa fase desconhecida, contexto fornecido vazio,
alternativas vazias/duplicadas e imagem em alternativa. Esta primeira versão
é textual: o registro também recusa imagem, evitando omitir evidência visual
silenciosamente quando chamado sem a validação prévia. Uma imagem futura
precisa de extensão e prova próprias.

## Evidência reproduzível

Ambiente de testes: Node 20.20.2, `EXPO_NO_DOTENV=1 CI=1`.
Os recibos abaixo estão no diretório local do writer em `.loop/runs/`.

| Verificação | Resultado observado |
|---|---|
| Registro e novas regras antes da implementação (`q6-red.log`) | 6 falhas específicas: Q6 não registrado e cinco regras ausentes. |
| Mesmos casos após implementação (`q6-green.log`) | 6 testes passaram, 96 omitidos pelo filtro. |
| Testes de UI e última decisão (`q6-ui.log`) | 6 testes passaram, 97 omitidos pelo filtro. |
| Remover apenas a recusa de imagens e trocar apenas a guarda de conclusão para `hybrid` (`q6-boundary-red.log`) | 3 falhas: imagem omitida e feedback final ausente no acerto e no erro. Ambas as mutações foram restauradas. |
| Regressão completa focada (`q6-regression.log`) | 8 suítes / 318 testes passaram. |
| Typecheck e ESLint dos oito arquivos de código/teste declarados | Sem erro ou aviso emitido. |

A primeira chamada da regressão tinha dois caminhos de teste inexistentes:
247 testes passaram e duas suítes falharam por ENOENT. Os caminhos foram
corrigidos antes do recibo final; isso não conta como evidência vermelha.

Comando da regressão, a partir de `radiant-app`, com o ambiente acima:

```sh
npm test -- --runInBand --runTestsByPath \
  src/features/lesson-flow/renderers/CaseDecisionStepRenderer.test.tsx \
  src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx \
  src/features/lesson-flow/services/LessonFlowService.test.ts \
  src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx \
  src/features/lesson-flow/hooks/useLearningActivity.test.ts \
  src/features/lesson-flow/services/feedbackFor.test.ts \
  src/features/lesson-flow/renderers/InteractionAnswerValue.test.ts \
  src/features/student-checkpoints/EditorialPilotContract.test.ts
```

Os testes usam casos sintéticos de treinamento, sem paciente/protocolo, e o
hook/registro reais. A tela usa portas de catálogo, vida e conclusão para
observar a ordem dos efeitos. O contrato editorial real ainda recusa
`case-decision` com `unsupported-activity-family`; o publisher e os seis
aceites vinculados ao hash não foram ampliados. Nenhum payload Q6 foi promovido.

## Limites e continuação

A evidência é local e inclui árvore de UI/serviços; não mede VoiceOver/TalkBack,
fonte máxima, apresentação em aparelho ou funcionamento offline de um binário.
Não demonstra revisão técnica de uma aula Q6. PC06 permanece aberto para
integração e prova nativa/acessível/offline do conjunto. Quatro aulas do piloto
continuam briefs sem checkpoint completo.

Não houve build, instalação, Metro, EAS/OTA, migração, alteração do armazenamento
real, commit, push, merge ou release. A árvore já estava suja na abertura;
números locais não representam CI nem o conjunto rastreado isoladamente.
A sessão de leitura `brain-session-1793748895817-6631edbb` foi fechada antes
da validação para permitir que `brain-links` consulte a CLI.

## Fechamento

Primeiro gate: **14/15**, com `app-quality` reprovado. O diagnóstico do comando
exato `EXPO_NO_DOTENV=1 CI=1 npm run quality` passou em **214 suítes / 2879 testes**,
mas `visual:qa:strict` apontou R2 no `container` local do renderer novo.
O componente passou a usar `layout.stackSm`, sem exceção ou mudança de baseline.
O lint completo emitiu 22 avisos em outros arquivos, com zero erros; os oito
arquivos desta entrega passaram na checagem focada sem avisos. Recibo:
`quality-diagnostic.log`. Depois da correção, os quatro testes do renderer
passaram (`layout-green.log`), e o gate visual passou com zero regressões
(`visual-green.log`).

Segundo gate configurado: **15/15**, `VALIDATION_PASSED`, no mesmo writer,
segundo ciclo. Recibo local `final-validation-fixed.json`. Validadores aprovados:
`docs-contract`, `content-foundation`, `content-wave1`, `content-production`,
`content-anchoring`, `content-anchoring-data`, `content-no-verbatim`,
`content-source-rights`, `content-python`, `app-quality`, `app-test`,
`api-lint`, `api-typecheck`, `api-test` e `brain-links`.
`git diff --check` passou. A validação inclui a árvore local completa, com
trabalho anterior preservado; não é uma execução de CI sobre commit limpo.

Fechamento conferido em 03/11/2026: `STEP_SUCCEEDED` → `MEMORY_WRITTEN` →
`RUN_CLOSED`. Os recibos `step-finish.json`, `memory-write.json` e
`run-close.json` estão no diretório local do writer. A sessão de leitura já
estava fechada. O próximo recorte está no
[prompt de continuidade](../superpowers/handoffs/2026-11-03-conteudo-pc06-prompt-de-continuidade.md);
este relato preserva os limites medidos no PC06-D.
