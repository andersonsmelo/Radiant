# Radiant — implementação do primeiro pacote visual

**Goal:** aplicar a direção aprovada às três telas existentes, preservando o
motor de estudo. **Spec:** [contrato visual](../specs/2026-10-12-study-experience-design.md).
**Baseline da preparação:** `bb450a5`; execução partiu de `3fc25af`.
**Medido em 2026-10-13:** tarefas 1–4 implementadas/revisadas; pacote de código
até `c9169ee`. Tarefa 5: matriz iOS registrada; revisão final aprovada; gate integral 14/14.
**Architecture:** React Native/Expo; serviços atuais continuam donos de estado,
elegibilidade, vidas, XP e persistência. Componentes só apresentam e encaminham
ações. **Tech stack:** Expo 54, RN 0.81.5, Reanimated existente, Node 20 no app;
Node 24 só no Loop. Sem nova dependência nativa.

## Preflight e escopo

- [x] Ler STATUS/FILA/roadmap/spec e reconciliar branch/diff, preservando outras
  sessões. Não refazer itens 36/39/27. Confirmar ausência de writer concorrente.
- [x] Abrir sessão Loop com objetivo deste pacote e consultar contexto.
- [x] Provisionar dependências/runtimes/fixtures antes de abrir run; distinguir
  testes indisponíveis por ambiente de falhas do app. Usar simulador dedicado
  sintético para flows que limpam estado, sem apagar o app usado na avaliação.
- [x] Inspecionar chamadores do registry/renderers e efeitos de confirmar antes
  de mudar labels. Reproduzir sintomas reais nas regressões comportamentais.
- [x] Declarar a união de arquivos abaixo no `abrir.mjs`. Se a solução precisar
  de outro arquivo, resolver escopo antes de abrir; não alargar silenciosamente.

Arquivos candidatos, todos dentro da política atual:

| Área | Modificar/criar |
| --- | --- |
| Estude | `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx` e `.flow.test.tsx`; `components/JourneyTrail.tsx`, `.test.tsx`, `JourneyStageHeader.tsx`; novos `components/JourneyRecommendationCard.tsx` e `.test.tsx`. |
| Fundo | `radiant-app/src/ui/components/StarfieldBackground.tsx` e `.test.tsx`. |
| Atividade | `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx` e `.flow.test.tsx`; `renderers/MultipleChoiceStepRenderer.tsx`, `ActivityRendererRegistry.tsx` e `.test.tsx`. |
| Conclusão | `radiant-app/src/features/quiz/components/LessonSummary.tsx` e `.test.tsx`. |
| Guardas | `radiant-app/scripts/maestro-contract.test.mjs`, consumidores de labels e alcance nativo por YAML/AST. |
| E2E | `radiant-app/.maestro/learning-critical-path.yaml`, `offline-relaunch.yaml`, `reward-locked.yaml`, `reward-unlock.yaml`, somente seletores/copy afetados. |
| Registro | Esta spec/plano, docs/STATUS.md + docs/archive/STATUS_historico.md, docs/FILA.md, roadmap ativo e evidência datada do pacote; declarar também capturas/logs versionados antes da execução. |

Paths abreviados da tabela usam o diretório da primeira linha da área; expandir
para caminhos completos no comando de abertura. Não editar catálogo/conteúdo,
repos de progresso, regras de avaliação, StoreKit ou backup para adequar o
layout. Arquivos gerados e outputs de browser também precisam de escopo ou
destino excluído já previsto; `.gitignore` sozinho não isenta do Loop.

## Task 1 — fundo focado, sem alterar as outras telas

- [x] Introduzir `variant?: 'galaxy' | 'focused'` em `StarfieldBackground`,
  default `galaxy`. Na variante focada, retirar nebulosas da área de leitura
  e reduzir estrelas; manter controle de foco/redução de movimento existente.
- [x] Verificar default preservado e ausência real das camadas decorativas na
  variante focada. Testar render/comportamento, não espelho de props.
- [x] Usar a variante somente nas telas deste pacote. Reusar tokens existentes;
  sem mudança global de paleta ou loop novo.

## Task 2 — recomendação e trilha em Estude

- [x] Criar card apresentacional a partir do nó/reason existentes e callback
  de abertura; sem novo resolver, cache de catálogo ou efeito persistente.
- [x] Montar contexto/card no header rolável de `JourneyTrail`, preservando
  chaves/virtualização/layout de texto grande. Remover CTA fixo duplicado.
- [x] Reusar helpers de rota/eligibilidade; data futura vem dos nós. Sem nó
  elegível, mensagem factual e nenhuma ação principal inerte.
- [x] Testar no `JourneyHomeScreen.flow.test.tsx`: retomada por tipo, revisão
  devida, avaliação, conquista disponível/coletada, próxima lição + revisão
  futura, sem próxima etapa, erro/carregamento e abertura de folha de vidas.
  Medir callbacks/rotas efetivos; não aceitar snapshots como única prova.

## Task 3 — espaço de atividade e confirmação explícita

- [x] Refatorar composição em `LessonFlowScreen` e estilo das alternativas,
  mantendo todos os tipos do registry e adaptações legadas.
- [x] Label “Conferir resposta” só na múltipla escolha. Passar label de
  confirmação ao registry/renderer por prop opcional, default “Continuar”,
  para manter outros chamadores. Atualizar hints para o mesmo label visível.
- [x] Preservar `player.setValue`, `player.confirm` e `handleContinue` como
  donos de seleção/confirmação; não cobrar vida ou marcar progresso no card.
- [x] Reusar Pixel e eventos atuais: render da reação não dispara outro som,
  haptic, XP ou cobrança. Não instalar runtime/animação de autoria externo.
- [x] Testar seleção/troca sem confirmar, botão bloqueado sem seleção,
  confirmação/cobrança única, erro/explicação, pausa/relaunch e retorno da
  assinatura. Preservar casos de V2 e outros tipos de interação.

## Task 4 — conclusão factual e compacta

- [x] Reduzir a faixa visual e organizar resultados em linhas, preservando
  Pixel/estrelas/reação já existentes e clearance do CTA/scroll.
- [x] Manter dados e callbacks de `LessonSummary`; não introduzir texto
  pedagógico novo ou números fixos da prancheta.
- [x] Ampliar `LessonSummary.test.tsx` com XP null/zero/positivo, estrelas sem
  melhora, total zero, revisão ausente, nota já dada e avaliação opcional.
- [x] Conferir uma repetição concluída sem XP no simulador; não exibir ganho
  novo de XP/progresso por causa da reorganização visual.

## Task 5 — validação e integração revisável

Testes focados, após cada alteração, no diretório `radiant-app`:

```bash
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH EXPO_NO_DOTENV=1 npx jest --runInBand --runTestsByPath src/ui/components/StarfieldBackground.test.tsx
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH EXPO_NO_DOTENV=1 npx jest --runInBand --runTestsByPath src/features/journey/screens/JourneyHomeScreen.flow.test.tsx src/features/journey/components/JourneyTrail.test.tsx
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH EXPO_NO_DOTENV=1 npx jest --runInBand --runTestsByPath src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx src/features/quiz/components/LessonSummary.test.tsx
```

- [ ] Registro vermelho auditável para mudanças de comportamento e verde
  após correção; não escrever testes triviais de espaçamento.
- [ ] Inspeção de Estude/atividade/conclusão em aparelho pequeno e alvo
  principal, incluindo fonte grande, movimento reduzido, seleção/erro,
  repetição sem XP, offline, zero vidas e assinante. Capturas do novo app
  vêm do simulador/aparelho, separadas da prancheta web.
- [ ] VoiceOver/TalkBack e gesto de voltar: registrar o que foi realmente
  executado e a plataforma; ausência de aparelho não vira PASS.
- [x] Atualizar flows apenas para copy/seletores reais, mantendo asserções
  de progresso e feedback. Executar critical-path/offline e recompensa
  conforme o recorte afetado, na build/fixture correta; flows que limpam
  estado ficam no simulador dedicado. Rating prompt segue pendente no item
  38 e não é consertado recolocando a chamada no quiz.
- [ ] Revisão independente de invariantes/diff. Comparar desempenho no mesmo
  device/tarefa/build-base; não alegar ganho de bateria a partir do simulador.
- [x] Sem E2E rodando, executar a validação final configurada do Loop,
  incluindo o gate `EXPO_NO_DOTENV=1 npm run quality` do Node 20: 14/14 no
  terceiro ciclo, após correções específicas documentadas. Repetir só
  após falha real corrigida. Fechar `validate → step finish → [memory] → close`
  e a sessão separadamente; atualizar STATUS/FILA/roadmap com evidência por SHA.

Saída: mudanças locais revisadas, gates estáticos e matriz nativa reportados;
commit próprio e pendências explícitas. Esta preparação não autoriza push,
merge, OTA, build de distribuição ou publicação. O gate editorial da L1 e
§5.4 continuam em E2/M2/M3; não bloqueiam este pacote visual do fluxo existente.

## Matriz executada e pendências explícitas — 2026-10-13

Quatro flows iOS configurados passaram, AX2 no SE, zero vidas e repetição sem XP.
Nove capturas reais e revisões por tarefa registradas na evidência. A conclusão
do pacote local distingue isso de prova em aparelho físico/Android, audível
VoiceOver/TalkBack, assinante real, toggle nativo de Reduce Motion e desempenho
comparativo: esses gates não receberam PASS. Piloto/editorial L1 e publicação
continuam separados. Checkboxes de inspeção integral permanecem abertos quando
alguém ainda precisa executar parte da matriz.
