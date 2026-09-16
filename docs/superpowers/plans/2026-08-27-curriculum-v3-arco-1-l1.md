# Currículo V3 — L1: O corpo como referência — plano de implementação

> **Para execução:** esta é a primeira entrega de J3. A execução já foi autorizada pelo dono no roteiro do Arco 1; o auditor independente revisa o pacote antes de a lição ser considerada concluída.

**Objetivo:** Entregar uma lição V3 local, original e não publicada que ensine referência anatômica, lateralidade e pares relacionais por meio de um mapa vetorial 2.5D funcional.

**Arquitetura:** O conteúdo declarativo e suas fontes ficam separados do motor puro da sessão. O motor classifica a evidência e exige recuperação independente após ajuda; a tela de demonstração isolada compõe esse motor com um SVG sem imagens externas. A Storybook story é a única superfície de inspeção local: o catálogo, o startup e `getPublishableManifest()` permanecem intocados.

**Stack:** TypeScript, React Native, `react-native-svg`, Jest e React Native Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md` §§5–12.

## Restrições globais

- Não chamar `prepareV3()` no startup, não alterar o currículo ativo e não publicar manifesto V3.
- Manter as três classes de evidência: `initial_independent`, `assisted_practice` e `later_independent_retrieval`; XP e repetição imediata não são domínio.
- Cobrir `E-LAT-OBS`, `E-GRV` e `E-REL` na L1; `E-POS` permanece restrito à L3. Cada erro recebe explicação e item independente novo após a ajuda.
- Todo ativo é vetorial original criado no código; não usar imagens nem copiar texto de fonte externa.
- Todo controle visual tem botão nomeado, estado textual, redundância sem cor e uma descrição que não revela a resposta de item avaliativo.
- Reduce Motion interrompe a transição e exibe o mesmo estado final estático. Testes automatizados e Storybook não são validação em aparelho.

---

### Task 1: Conteúdo, fontes e contrato da L1

**Files:**
- Create: `docs/curriculum-v3/arco-1-l1-corpo-como-referencia.md`
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReference.types.ts`
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.ts`
- Test: `radiant-app/src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.test.ts`

- [x] Escrever primeiro o teste que exige IDs estáveis, seis famílias relacionais, fontes fixadas, cenário inicial não pontuado e itens independentes que não repetem o exemplo guiado.
- [x] Rodar `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npx jest src/features/curriculum-v3/l1-body-reference/l1BodyReferenceContent.test.ts --runInBand` e observar falha pela ausência do módulo.
- [x] Implementar os tipos `L1EvidenceKind`, `L1Misconception`, `L1Challenge` e o conteúdo em português, com objetivo, exemplo, erro previsto, feedback causal, remediação, transferência, síntese, revisão e URL/edição/data das fontes.
- [x] Rodar o mesmo teste até passar.

### Task 2: Motor de decisão e remediação

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonSession.ts`
- Test: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonSession.test.ts`

**Interface produzida:** `createBodyReferenceLessonSession()` retorna `answer(challengeId, answerId)`, `requestHint(challengeId)` e `snapshot()`.

- [x] Escrever testes vermelhos para: diagnóstico sem XP/domínio; erro `E-LAT-OBS` encaminha para prática assistida; item auxiliado não fecha domínio; recuperação posterior só é contada com item novo; resposta sob mudança de postura mantém a referência anatômica.
- [x] Rodar a suíte isolada e confirmar falha pelo módulo inexistente.
- [x] Implementar o mínimo para classificar decisões, expor feedback causal e preservar uma trilha de evidência imutável em memória, sem AsyncStorage, XP ou integração ao legado.
- [x] Rodar as suítes de Tasks 1–2 até verde.

### Task 3: Mapa vetorial 2.5D e controles equivalentes

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.tsx`
- Test: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceMap.test.tsx`

**Interface produzida:** `BodyReferenceMap({ posture, perspective, selectedRelation, reduceMotion, onPostureChange, onPerspectiveChange })`.

- [x] Escrever testes vermelhos para os botões de perspectiva/postura, mapa selecionável, texto de estado, rótulo VoiceOver não revelador e transição estática quando `reduceMotion` é verdadeiro.
- [x] Rodar a suíte isolada e confirmar falha pelo componente inexistente.
- [x] Desenhar a silhueta 2.5D, linha mediana, camada superficial/profunda e ligação proximal/distal como SVG original; fazer as mudanças de perspectiva/postura alterarem o mapa e o estado observável. Usar forma, traço e texto além de cor.
- [x] Rodar o teste do mapa até verde.

### Task 4: Composição isolada e prova de integração local

**Files:**
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.tsx`
- Create: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.stories.tsx`
- Test: `radiant-app/src/features/curriculum-v3/l1-body-reference/BodyReferenceLessonPreview.test.tsx`

- [x] Escrever teste vermelho que percorra demonstração, desafio independente, erro, remediação e nova recuperação sem revelar resposta no texto acessível.
- [x] Implementar a composição local com `useReducedMotionPreference`, controles de teclado/VoiceOver via `Pressable`, feedback causal e uma story sem ligação a rotas ou catálogo.
- [x] Rodar a suíte L1 completa e `npm run typecheck`.

### Task 5: Auditoria, registro e fechamento

**Files:**
- Modify: `docs/STATUS.md`
- Modify: `docs/plans/2026-07-27-radiant-launch-roadmap.md`

- [x] Entregar os paths e as fontes ao auditor independente; registrar achados, correções e parecer final no registro da L1.
- [x] Atualizar somente o estado de L1/J3 que a evidência sustentar; J3, J4 e J5 continuam abertos.
- [ ] Verificar o diff, executar os validadores proporcionais e `loop validate`; somente então finalizar/registrar memória/fechar o run.

## Sequência posterior — não implementada neste plano

Após L1 aprovada: L2 → P1 → L3 → C1-A/C1-B → R1/R2. Nenhum nó futuro será criado ou publicado de forma vazia nesta entrega.
