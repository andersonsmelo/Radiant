# Brief Task14/T12 — Vidas, r1b

Objetivo único: implementar somente T12 na base f2dfbf33968414e7e5e6e0763de9398a92103371, branch claude/trilha-medalhao-design. T00–T11 não serão refeitas. Writer do controlador run-1793361707356-9d160e66 em editing, STEP_STARTED confirmado. Cérebro do objetivo brain-session-1793361533658-b36e155e CLOSED antes writer devido a brain-links.

## Autorização e ownership

Implementador novo cuida somente dos10 arquivos abaixo e de seus relatórios/logs dentro do workspace local excluído. Não está sozinho: preserve alterações alheias. Sem subagentes, writer/sessão própria, commit/push, dependências, build/install/EAS/OTA/loja/merge/físico, fixtures/storage privado, relógio ou simulador reservado. Controlador faz docs, revisão e gate final. Nenhuma edição de .loop/project.yaml ou radiant-app/expo-env.d.ts.

- radiant-app/src/features/hearts/components/HeartsSheet.tsx
- radiant-app/src/features/hearts/components/HeartsSheet.test.tsx
- radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx
- radiant-app/src/features/journey/screens/JourneyHomeScreen.flow.test.tsx
- radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx
- radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx
- radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx
- radiant-app/src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx
- radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml
- radiant-app/scripts/maestro-contract.test.mjs

## Constraints literais

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

## Cartão literal

### Task 14: T12 — Vidas

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, `rg`, nativo; Maestro integral só T18.
- **Pré-requisito:** T01; chamadores enumerados. **Saída:** ilimitado não abre folha, cinco estados e recarga/revisão preservados, texto máximo conferido.

## Integrador literal

### T12 — Folha de vidas

**Plano 5/tarefa 11. Modificar:**
`radiant-app/src/features/hearts/components/HeartsSheet.tsx`, `HeartsSheet.test.tsx`,
`radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml` e os chamadores reais da folha.

- [ ] Enumerar chamadores; testar ilimitado sem abrir a folha, não só aparência interna.
- [ ] Testar cinco estados de coração, tempo de recarga e ação Revisar agora.
- [ ] Usar assinatura como link; preservar economia e retorno à aula/revisão.
- [ ] Rodar focal e conferir texto máximo; deixar o E2E de vidas para T18.

## Spec operacional literal

### Tarefa 11: Sem vidas

**Arquivos:**
- Modificar: `radiant-app/src/features/hearts/components/HeartsSheet.tsx`
- Testar: `radiant-app/src/features/hearts/components/HeartsSheet.test.tsx`

**Interfaces:**
- Produz: a folha com os cinco corações de 40 pt (cheios e vazios), o título
  "Sem vidas" quando zeradas ou "Suas vidas" quando não, a linha "A próxima
  volta em N min." (de `nextRefillAt`), "Revisar agora" como ação principal
  quando `dueReviewCount > 0`, e "Vidas ilimitadas" como link quando
  `storeAvailable`. As props não mudam.

- [ ] **Passo 1: Escrever os testes que falham**

- 0 vidas e 2 revisões: cinco corações vazios, "Sem vidas", "Revisar agora" e o
  link;
- sem revisão devida: sem "Revisar agora", e "Voltar" como ação;
- `storeAvailable` falso: sem o link.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/features/hearts`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

- [ ] **Passo 4: Ver passar, com Maestro**

Run: `cd radiant-app && npx jest src/features/hearts && npm run test:maestro-contract`
Expected: PASS. O `radiant-1-4-vidas-esgotadas.yaml` muda junto se lê o texto
da folha.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/features/hearts .maestro
git commit -m "feat(vidas): os cinco corações e uma ação principal"
```

## Chamadores medidos antes do writer

Exatamente3 importadores/montagens: JourneyHomeScreen, LessonFlowScreen e CheckpointScreen. Journey monta visible protegido contra unlimited, mas HUD ativa flag sem guard. Aula/avaliação já condicionam gatilhos econômicos a empty, porém visible não protege a transição folha aberta→unlimited. Testar consumidores com dublê observável da folha, além de defesa interna.

Aula passa dueReviewCount={0}. Ler dado real por API existente getSnapshotForNode(nodeId), preservando caminho sem nó; não usar como cache de revisões a variável journeySnapshot que nasce só na conclusão. Journey já dispõe dueReviewCount e dueReviewNode; CTA só deve existir se destino executável. Checkpoint usa revisões da unidade ativa; preservar a política, não trocar por contagem global.

Reutilizar HeartIcon(size=40,filled) existente sem alterar HUD. Cinco corações representam count0–5; não confundir cinco ícones com um novo estado econômico. Props públicas da folha invariantes. Folha deve comportar texto máximo sem truncar/capar fonte; preferir ScrollView/safe area existentes e não inventar régua visual. Texto zerado Sem vidas; demais Suas vidas. Linha A próxima volta em N min. deriva nextRefillAt com ceil; full/null não fabrica prazo. Revisar principal quando devido, caso contrário Voltar principal. Vidas ilimitadas como link apenas se storeAvailable.

Ruling técnico: a direção visual já está aprovada; aplicar skills UX a ela, sem brainstorm de identidade. Corrigir dueReviewCount fixo da Aula é parte do aceite Revisar agora quando devido, com dado do serviço existente. Guardar a montagem para unlimited preserva as regras econômicas existentes. Custo se errado: regressão de navegação/consulta assíncrona, coberta por testes de consumidor/retorno. Não alterar serviços/storage/economia.

O contrato Maestro possui expectativas de título e deve mudar junto com o YAML, preservando toda sequência econômica; novas guardas de código por AST, não regex. Não alargar política/baseline visual.

## Skills e execução

Aplicar TDD e verificação antes da conclusão; ler skills locais superpowers:test-driven-development e superpowers:verification-before-completion. Aplicar U (ui-ux-pro-max/impeccable/design-taste-frontend) somente às partes que ajudam hierarquia, estados reais, texto máximo/safe areas; direção Medalhão prevalece. Sem downloads. Ao carregar skill, busca OPEN limitada ao nome exato, não log inteiro. Specs/ADRs21/10 e DESIGN são canônicos; não mexer nas decisões da aula/currículo.

Node20.20.2 em TODOS testes, registrar node --version. Vermelho causal deve ser executado antes de produto e preservado em arquivo, não apenas relatado. Logs/JSON em workspace task14-t12-20261030; incluir cwd, comando, versão Node, exit, saída e hashes pré/pós. Focais: jest --runInBand src/features/hearts mais três suites de consumidor; executar HeartsService.test.ts e HeartsRepository.test.ts intactos; contrato Maestro e tipos/lint focais. Repetir uma vez sob taskpolicy -b os focais sensíveis após verde, sem aumentar timeout artificialmente. Não executar npm run quality/loop validate: controlador fará uma final configurada, sem runtime concorrente.

Mutações específicas: count/filled, título/recarga, presença/ausência de CTA e link, guards de cada chamador (incluindo transição aberto→unlimited), revisão real na Aula e segurança da rota/retomada. Cada mutação deve ser detectada pelo teste certo e fontes restauradas por hash; âncoras únicas. Não escrever testes espelho nem afirmar geometria rasterizada por Jest.

## Relatório

Gravar impl-report.md e tests.json no workspace task14-t12-20261030. DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED, requisitos, arquivos, vermelho/verde/CPU/mutações com saídas, self-review, limites e questões. Pare de escrever antes de pedir revisão; controlador congela snapshot integral contra BASE_TASK. Maestro integral fica T18. Prova nativa normal/texto máximo será do controlador em cliente compatível, sem build novo.

## Ruling r1a — limite herdado de AppButton

O implementador mediu cap global de fonte em AppButton, sem override público. Preservar esse componente e seu lábio; nenhum arquivo compartilhado novo entra no escopo. A regra sem cap/truncamento novo aplica-se à folha; não autoriza alterar o contrato global do botão. Título/corpo/link ficam livres, conteúdo rolável/safe area, enquanto CTAs mantêm o cap herdado. Conferir texto máximo e reportar esse limite, sem alegar fonte livre integral ou aceite G8. Custo se a decisão herdada precisar mudar: tarefa compartilhada específica e regressão dos consumidores, fora desta T12. Esta decisão foi entregue ao implementador antes de produto e será entregue ao revisor.

## Ruling r1b — consulta de revisões sem nova persistência

R1 confirmouP2: getSnapshotForNode no foco hidrata e persiste snapshot stale, podendo sobrescrever cursor/current mais recentes; alive só protege React. A referência a esse getter nas seções anteriores foi uma escolha técnica agora substituída por este ruling. Usar dueReviewCount do snapshot real que o setResumableNode existente já devolve, sequenciado no bootstrap antes de interações, elimina consulta/persistência extra. Não mudar serviços/storage/economia nem introduzir polling. Manter vidas relidas independentemente; explicitar que contagem vem do bootstrap e que o retorno real de revisão remonta a aula. Regressão deve exercitar efeitos reais do serviço sobre portas sintéticas e preservar cursor/current; reintrodução do lookup antigo deve falhar pelo overwrite específico. R1 foi SpecFAIL/CHANGES_REQUIRED até fix1 e re-revisão. Custo: se houver necessidade de atualização contínua de revisões durante a mesma montagem, será preciso um contrato de leitura sem escrita, fora desta escolha delimitada.

## Ambiente nativo medido em30/10

O cliente compatível existente abriu no E262; GUI Simulator.app está ausente na árvore ativa do Xcode e CUA retorna Invalid app. Sem instalação autorizada e sem injeção de estado, normal/AX5 da folha permanecem NOT_VERIFIED. Encerrar runtime/Metro/target e preservar reservado; não fabricar screenshot ou alegar prova nativa a partir de Jest.
