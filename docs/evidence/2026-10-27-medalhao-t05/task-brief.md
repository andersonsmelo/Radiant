# Task7 / T05 — brief vinculante R2

Worktree /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20; branch claude/trilha-medalhao-design. BASE_TASK=BASE_CONTINUACAO desta entrega `ae2e769d89bac2a4de3b11e5a4fe602d86b31323`. T04/T04a aprovadas, T04a CI244/149SUCCESS conferido na conversa atual. Writer único `run-1793116969213-81113b5b` editing/STEP_STARTED, checkpoint `checkpoint-1793116969893-42161f25`. Brain `brain-session-1793116720680-a2a011a9` consultado e CLOSED antes writer por brain-links.

## Cartão operacional literal

### Task 7: T05 — Resultado

- **Dono:** I/high; **revisão:** R. **Skills:** T, U, A; **recursos:** Jest, contratos de movimento, nativo.
- **Pré-requisito:** T04/T04a revisadas. **Saída:** tema/contexto em todos os consumidores, cunhagem sem prêmio duplicado, régua de estrelas e ausência de XP inventado; revisão sem Pixel.

## T05 literal e inteira

### T05 — Resultado: cunhagem, estrelas e contexto correto

**Plano 5/tarefa 4. Modificar:**
`radiant-app/src/features/quiz/components/LessonSummary.tsx`, `LessonSummary.test.tsx`,
`radiant-app/src/features/quiz/screens/QuizScreen.tsx`, `QuizScreen.flow.test.tsx`,
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`, `LessonFlowScreen.flow.test.tsx`,
`radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx`,
`radiant-app/src/ui/motion.ts` e os testes de movimento afetados.

- [ ] Enumerar todos os consumidores de `LessonSummary`; acrescentar contexto
  de tema/título por todos, incluindo o resumo de revisão e a aula sem nó.
- [ ] Escrever casos 0/1/2/3 estrelas, recorde anterior maior, repetição,
  revisão e XP nulo/zero/positivo. Ver o vermelho antes da composição nova.
- [ ] Definir medalha neutra para zero estrela sem alterar o estado canônico
  de aula concluída nem fingir bloqueio; a paleta visual não decide progresso.
- [ ] Retirar confete dos consumidores reais, inclusive `LessonFlowScreen`.
- [ ] Preservar pose sob reduzir movimento; parar movimento não vira comemorar→acenar.
- [ ] Implementar animação por componentes de estrela com hooks no topo;
  nunca chamar hooks em `map`, callback `star(index)` ou condição.
- [ ] Resolver a mola/duração do exemplo antigo a favor de `DESIGN.md`:
  mola apenas na cunhagem; crescimento/assentamento e outras entradas pelos
  hooks existentes, sem importar Reanimated em tela de feature.
- [ ] Rodar os três testes de componente/fluxo e os contratos de movimento.

**Exemplo de asserção a acrescentar ao teste existente** (usa os fixtures já presentes):

```tsx
it('mantém a régua ao mostrar zero estrelas', () => {
  render(<LessonSummary {...base} stars={0} correctAnswers={0} />);
  expect(screen.getByLabelText('0 de 3 estrelas')).toBeTruthy();
  expect(screen.queryByText(/quase/i)).toBeNull();
});
```

A asserção nova do layout deve falhar com a composição anterior; a régua
acima é proteção de comportamento, não prova isolada da cunhagem.

**Aceite:** primeira resposta continua valendo; sem XP inventado; revisão
sem Pixel; animação não repete prêmio; tema real acompanha todos os caminhos.

## Global Constraints literais

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

## Ownership fechado

- `radiant-app/src/features/quiz/components/LessonSummary.tsx`
- `radiant-app/src/features/quiz/components/LessonSummary.test.tsx`
- `radiant-app/src/features/quiz/screens/QuizScreen.tsx`
- `radiant-app/src/features/quiz/screens/QuizScreen.flow.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx`
- `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.test.tsx`
- `radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx`
- `radiant-app/src/ui/motion.ts`
- `radiant-app/src/ui/__tests__/motion.test.ts`
- `radiant-app/src/features/journey/components/JourneyMedal.tsx`
- `radiant-app/src/features/journey/components/JourneyMedal.test.tsx`
- `radiant-app/src/features/quiz/components/LessonSummary.stories.tsx`
- `radiant-app/.rnstorybook/storybook.requires.ts`

Implementador I/high Sol, não está sozinho: controlador altera só docs/evidências. Preserve trabalho alheio; sem revert/reset/stash/limpeza. Não crie subagentes/revisor próprio, writer/sessão Loop, commit/push ou instalação/build. Sem alterações de política/baseline/exceções. Os caminhos acima são união nominal: só tocar os necessários. Story é suporte opcional para matriz visual de estados; se criada, distinguir fixture nativa de fluxo real e manter requires gerado coerente. JourneyMedal/test foram incluídos caso a aparência neutra exija API sem fingir estado bloqueado. HybridCharacter.test é novo teste permitido; HybridScreenflow é consumidor a preservar. Se faltar caminho, pare somente a escrita dependente e avise antes.

## Leitura relevante e decisões já fechadas

- Spec aprovada docs/superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md §11.1–11.3 (Resultado), DESIGN.md regras Escala Única/Sem Cara de IA/movimento. Prancheta docs/design/2026-10-21-app-medalhao.html na seção Resultado. Plano5 original Tarefa4 (linhas256–301) é referência visual, mas seu contrato star(index) chamando hooks e700ms NÃO é autoridade frente ao integrador e DESIGN.
- Somente dois consumidores reais medidos: QuizScreen.tsx e LessonFlowScreen.tsx. Ambos têm revisão. QuizLesson tem title mas não theme; resolver tema pelo nó/unidade do catálogo canônico, sem inventar tema por título nem fonte paralela. LessonFlow já calcula lessonTheme via resolveNodeTheme; LearningActivityV2 NÃO tem title. Usar título real do nó/bloco existente quando disponível e, sem nó, presentation.payload.title autoral da abertura (hook), sem inventar activity.title nem derivar título do id. Deep link sem nó usa theme da atividade. Cobrir os caminhos reais, revisão e sem nó.
- JourneyMedal hoje tem state done/next/locked. Não usar locked/disabled/silhouette nem alterar progresso para neutralizar0estrelas. A cor de resultado é aparência separada do estado canônico concluído; implementar menor API/teste necessários.
- Resultado mostra medalha/tema, título real, régua0–3, XP grande sem card apenas quando real; xpAwarded null/0/positivo mantêm significados atuais. Recorde maior fica separado. Avaliação opcional e CTAs existentes continuam funcionais. Refazer não muda primeira resposta nem prêmio já atribuído.
- Sem confete nos2consumidores de LessonSummary, inclusive LessonFlowScreen. Confete de RewardScreen/CheckpointScreen pertence a tarefas futuras, não retirar fora do ownership. Revisão não monta Pixel. Zeroestrela não vira aprovação falsa nem bloqueio.
- Propósito do movimento: conquista/delight somente com ganho real; medalha cunhada, estrelas preenchidas assentam sem mola. DESIGN vence receitas genéricas: entradas200–450ms, mola só cunhagem, hooks no topo de componentes, nada de Reanimated importado em features. No movimento reduzido, estado final no primeiro quadro, mesma pose (HybridLessonCharacter hoje troca celebrate→happy; corrigir sem mudar sentido do momento). Rating/rerender não dispara cunhagem/prêmio de novo; testar efeitos reais, não espelho de props.
- Texto máximo sem truncar/cortar, conteúdo pode rolar, título sem teto artificial só para caber. Tokens Sora/medalColors/radius/space e ouro funcional; preservar geometria/progresso da trilha fora da nova API de aparência.

## Skills aplicáveis

Usar TDD e verification-before-completion instaladas em /Users/anderson/.codex/plugins/cache/claude-plugins-official/superpowers/7.0.0/skills/. Usar animate-expo /Users/anderson/.codex/skills/animate-expo/SKILL.md e impeccable /Users/anderson/.agents/skills/impeccable/SKILL.md para nativo/aplicável. Controlador já executou context.mjs uma vez com alvo LessonSummary.tsx; não rerodar nem criar design novo. Ler reference/craft-floor.md antes da UI; contexto é Operate, direção Medalhão existente obrigatória. Não sorteie estética, instale recursos ou aplique CSS/DOM em RN. Observação OPEN SDD139: mutação deve remover o comportamento da fronteira exata, mocks não podem fabricar o fallback que se pretende provar.

## Testes e evidência

App/testes em Node20.20.2: medir node --version. Em radiant-app: `EXPO_NO_DOTENV=1 npx --no-install jest --runInBand --no-cache src/features/quiz/components/LessonSummary.test.tsx src/features/quiz/screens/QuizScreen.flow.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/ui/__tests__/motion.test.ts src/features/journey/components/JourneyMedal.test.tsx src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.test.tsx src/features/curriculum-v3/hybrid-l1/HybridLessonScreen.flow.test.tsx`. Não passar teste novo ausente se optar por não criá-lo; necessidade da guarda de pose deve ficar coberta de qualquer modo. Repetir focal de telas sob /usr/sbin/taskpolicy -b, guardar ambas fases sem somar contagens. Contratos: `node --test scripts/reanimated-easing-contract.test.mjs scripts/contrast-contract.test.mjs scripts/copy-style-contract.test.mjs scripts/maestro-contract.test.mjs`; tipagem/lint focais e visual:qa:strict antes freeze se necessário. Não quality completo/Loop validate no agente.

Vermelho específico antes do layout: medalha/tema/título/XP sem card/Pixel review/pose reduzida/once-only conforme lacuna real. Preservar saídas reais e injeções que discriminem: neutral0semestadofake; tema dosconsumidores; confete removido; pose e ganho não repetido. Não chamar teste jáverde de vermelho do layout.

Relatório completo: docs/evidence/2026-10-27-medalhao-t05/implementation-report.md. Pode escrever nessa pasta somente red.txt,green.txt,audit.md,mutations.json além do report; logs auxiliares na pasta SDD exatamente excluída. Dono do nativo será o controlador/leitor específico após freeze; não iniciar Metro/simulador/AVD enquanto implementa. Devolva DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED com arquivos, comando/cwd/Node/saídas/red-green, self-review e riscos; congele produto para revisão. Nenhum ganho de desempenho ou shader nativo é provado por Jest.

## Hashes das fontes desta extração

docs/plans/2026-10-25-medalhao-execucao-subagentes.md: 5ec23787e1781dca25d51ff643d5de3a07ed985bb17256dca7df34156d3c11fe
docs/plans/2026-10-25-medalhao-pendencias-e-fechamento.md: 590d79def4df42fcd87400c7077cca5cf1bafbac6071bc14851956d270c71e4d
docs/DESIGN.md: 63092721008ca5d5353418bb5ecdb74020be853aca433b8677cb7fb702de43aa
