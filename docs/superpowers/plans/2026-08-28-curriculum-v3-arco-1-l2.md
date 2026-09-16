# Currículo V3 — L2: Cortando o espaço — plano de implementação

> **Para execução:** o desenho curricular já foi aprovado na spec e o roteiro autorizou a produção lição a lição. Esta implementação usa TDD e será revisada por auditor independente antes de L2 ser sinalizada como entregue.

**Objetivo:** Entregar uma lição V3 local e não publicada que ensine como planos anatômicos se relacionam com região espacial, espessura e imagem seccional.

**Arquitetura:** Conteúdo e proveniência ficam em módulo declarativo; um motor puro separa tentativa inicial, prática assistida e recuperação nova. Uma prévia isolada combina o motor com um mapa corporal vetorial 2.5D que torna observáveis plano, região e espessura, sem rota, catálogo ou startup.

**Stack:** TypeScript, React Native, `react-native-svg`, Jest e React Native Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md` §§5–12.

## Restrições globais

- Não chamar `prepareV3()`, mudar o currículo ativo, modificar catálogo/rotas, nem publicar manifesto V3.
- Cobrir `E-PLN-MED`, `E-PLN-OBL` e `E-PLN-SEC`; eixos, movimento articular, orientação DICOM, `Patient Position`, projeção e incidência ficam fora da L2.
- Registrar `initial_independent`, `assisted_practice` e `later_independent_retrieval` separadamente; ajuda, repetição imediata e XP não comprovam domínio.
- Usar somente SVG original no código, sem imagens externas; registrar TA2 2019 e Apple HIG com URL, seção e data de consulta.
- Fornecer toque no modelo e controles nomeados equivalentes, texto que descreve dados sem dizer qual opção é correta, estado além de cor e alternativa estática para Reduce Motion. Testes locais não atestam VoiceOver nem aparelho.

### Task 1: Conteúdo e contrato

**Files:**
- Create: `docs/curriculum-v3/arco-1-l2-cortando-o-espaco.md`
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpace.types.ts`
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.ts`
- Test: `radiant-app/src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.test.ts`

- [ ] Escrever teste vermelho para IDs estáveis, fontes fixadas, objetivos L2, plano mediano como caso de sagital, itens novos pós-ajuda e separação entre plano, região, espessura e imagem.
- [ ] Executar `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/curriculum-v3/l2-slicing-space/l2SlicingSpaceContent.test.ts --runInBand`; confirmar falha por módulo inexistente.
- [ ] Implementar os tipos e conteúdo original, com cenário, feedback causal, remediação, transferência, síntese e revisão.
- [ ] Reexecutar até verde.

### Task 2: Motor de evidência e remediação

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonSession.ts`
- Test: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonSession.test.ts`

- [ ] Escrever teste vermelho para erro mediano, oblíquo e plano-versus-região; exigir prática assistida e recuperação com item diferente, sem XP como domínio.
- [ ] Executar a suíte isolada e confirmar falha pelo módulo inexistente.
- [ ] Implementar `createSlicingSpaceLessonSession()` com `answer()`, `snapshot()` e registro imutável em memória, sem storage ou integração legada.
- [ ] Reexecutar conteúdo e motor até verde.

### Task 3: Modelo vetorial 2.5D funcional

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceModel.tsx`
- Test: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceModel.test.tsx`

- [ ] Escrever teste vermelho para seleção de plano, deslocamento da região, espessura e alvo no mapa; testar estado textual não revelador, redundância e estado estático com Reduce Motion.
- [ ] Executar a suíte e confirmar falha pelo componente inexistente.
- [ ] Implementar SVG 2.5D autoral com silhueta, placas de planos, volume de região e lâminas de espessura; as ações precisam alterar geometria e texto observável.
- [ ] Reexecutar até verde.

### Task 4: Prévia isolada e fluxo de aprendizagem

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.tsx`
- Create: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.stories.tsx`
- Test: `radiant-app/src/features/curriculum-v3/l2-slicing-space/SlicingSpaceLessonPreview.test.tsx`

- [ ] Escrever teste vermelho para fluxo independente → erro → apoio → recuperação, controles equivalentes, cenário restaurável e ausência de resposta nas descrições avaliativas.
- [ ] Executar a suíte e confirmar falha pelo componente inexistente.
- [ ] Implementar composição isolada com feedback causal e `useReducedMotionPreference`; não ligar a navegação, catálogo ou V3 runtime.
- [ ] Reexecutar todas as suítes L2 e `npm run typecheck`.

### Task 5: Auditoria, rastreio e encerramento

**Files:**
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

- [ ] Encaminhar a versão exata e as fontes ao auditor independente; corrigir os achados e obter novo parecer.
- [ ] Atualizar somente o estado sustentado: L2 entregue localmente, J3/J4/J5 seguem abertos; atualizar o cartão Trello existente.
- [ ] Ler o diff, rodar as validações proporcionais e `loop validate`; finalizar e fechar o run e a sessão do cérebro em separado.

## Fora desta entrega

P1, L3, C1-A/C1-B e R1/R2 continuam na sequência aprovada. QA científico especializado, equivalência em VoiceOver/controle alternativo, Reduce Motion e validação em aparelho permanecem gates reais de J4/J5.
