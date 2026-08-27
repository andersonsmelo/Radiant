# Auditoria das lições exibidas no iOS — 2026-08-27

## Escopo e evidência

Pedido de Anderson após encontrar uma imagem de tórax na lição **Quiz:
Profissão e atuação do técnico em radiologia**. Capturas fornecidas pelo dono:
iPhone 16, iOS 27.0, Radiant 1.3.1 (9) instalado pelo TestFlight; a captura das
10:28 mostra o passo 1 de 4. Não copiar número de série nem anexar a captura
de informações do aparelho a serviços externos.

Inspeção estática do código em `a05e94b`, do raster local e dos dados de
`AI_LESSONS`. Não houve execução do app pelo agente nesta auditoria, nem
revisão clínica ou jurídica do texto. Uma tela aberta não comprova conclusão,
persistência ou funcionamento offline.

O estado operacional permanece exclusivamente em [STATUS](../STATUS.md).
Acompanhamento: [cartão de revisão no Trello](https://trello.com/c/f9OYyCX5).

## Achados confirmados

| Achado | Evidência no código | Alcance confirmado |
| --- | --- | --- |
| Imagem de tórax sem vínculo com o assunto | `LessonVisualPanel.tsx` carrega somente `lesson-xray-panel.png`; recebe `hint` e `caption`, não tema/mídia | `LessonFlowScreen.tsx` mostra o painel sempre que existe um bloco legado |
| Mockup aparece como conteúdo e promete ação inexistente | Raster contém “Lesson Flow: Variant 2 of 3” e “Tap to Learn”; painel sobrepõe lupa e “Toque para examinar”, sem controle de toque | Painel decorativo compartilhado; não equivale ao renderer de hotspot real |
| Orientação visual não corresponde a perguntas conceituais | Dica global “Compare densidade, borda e contexto anatômico antes de responder” | Passos de interação do painel legado, independentemente do tema |
| Ensino substituído por texto genérico | 16 lições em `ai-lessons.ts`, nenhuma com `journey`; `buildIntroBlock` preenche “Ideia-chave” com o objetivo genérico de consolidar o conceito | Catálogo local gerado, não uma afirmação sobre todo payload remoto ou atividade v2 |
| Resposta correta previsível pela posição | As 32 questões geradas têm `correctAnswerIndex: 0`; gerador, adaptador e renderer preservam a ordem | Percurso legado local inspecionado; não houve medição de todas as superfícies em aparelho |
| Cobertura do fluxo oculta a mídia real | `LessonFlowScreen.flow.test.tsx` substitui o painel por `PAINEL_VISUAL_LEGADO` | O teste não avalia pertinência do raster nem a ação sugerida pelo texto |

Caminhos relativos à raiz, para reproduzir o rastreamento:

- `radiant-app/src/features/lesson-flow/components/LessonVisualPanel.tsx`
- `radiant-app/src/features/lesson-flow/assets/lesson-xray-panel.png`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `radiant-app/src/features/journey/services/JourneyDefinitionService.ts`
- `radiant-app/src/features/lesson-flow/services/LegacyLessonAdapter.ts`
- `radiant-app/src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/features/content/services/LessonCatalogService.ts`
- `radiant-app/src/data/ai-lessons.ts`

`buildIntroBlock` usa a questão 0; `buildReviewBlock` usa a questão 1 quando
existe. Portanto, as duas questões não foram perdidas: estão distribuídas entre
lição e revisão. O problema identificado é a ausência de ensino próprio e a
ordem das alternativas, não uma suposta perda da segunda pergunta.

## Limites da conclusão

O catálogo legado e as atividades v2 promovidas coexistem. O painel depende de
`block`, enquanto a atividade promovida pode existir sem um bloco legado.
Não generalizar este resultado para o lote por competências nem descartá-lo
sem inspeção própria. Também não afirmar origem licenciada ou não licenciada
da imagem apenas por sua aparência de mockup: a procedência ainda precisa ser
verificada se houver intenção de reutilização.

As 16 lições geradas cobrem profissão, energia/matéria, estrutura atômica,
radioatividade, raios X, proteção, medicina nuclear, TC, RM, irradiação de
alimentos, equipamento, componentes, acessórios, processamento, produção dos
raios X e qualidade de imagem. A presença no catálogo local foi medida;
adequação clínica de cada enunciado não foi certificada nesta passagem.

## Correção proposta e critérios de aceite

1. **Painel:** retirar o raster e as dicas globais dos blocos sem mídia
   pertinente. Não escolher outra imagem genérica como substituta. Se houver
   ação “examinar”, ela precisa existir e funcionar com acessibilidade.
2. **Lições:** revisar objetivo, explicação, exemplo, pergunta e feedback por
   tema, começando por profissão/atuação. A etapa “Ideia-chave” precisa ensinar
   algo específico antes de avaliar. Redação de atribuições profissionais
   exige fontes oficiais e revisão de domínio; não aprovar por teste técnico.
3. **Fonte:** `ai-lessons.ts` é gerado por
   `scripts/content/sync-catalog-to-app.mjs`; corrigir o conteúdo governado na
   fonte do pipeline, sem editar o artefato gerado à mão. Definir a cobertura
   editorial antes de regenerar todo o catálogo.
4. **Alternativas:** distribuir ou embaralhar sem perder identidade da resposta
   correta, estabilidade durante o passo e navegação acessível.
5. **Verificação:** regressão com o componente real para tema sem imagem,
   perguntas e feedback coerentes, seguida de inspeção das lições no iPhone.
   Revalidar progresso, retomada e uso offline. Testes de estrutura não são
   aprovação pedagógica nem inspeção visual.
6. **Release:** depois das correções e da autorização, preparar candidato
   atualizado, testar e gravar vídeo desse mesmo build. O `(9)` não pode ser
   apresentado como evidência de uma correção posterior. Nenhum build, upload
   ou reenvio foi executado por esta auditoria.

## Resultado desta passagem

Diagnóstico inicial documentado; implementação e revisão editorial pendentes.
Somente este relatório, STATUS e roadmap foram alterados. Nenhuma mudança no
código, nos dados das aulas ou no App Store Connect. Run documental declarado:
`run-1787837745255-53e81b62`; consultar seu resultado de validação e fechamento
pela CLI Loop antes de alegar aprovação dos verificadores. Essa validação não
converte os defeitos diagnosticados em correções.
