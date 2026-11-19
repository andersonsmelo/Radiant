# Trilha dobrada, fase B: formatos — plano de implementação

> **Para quem executa:** use `superpowers:subagent-driven-development`, uma tarefa por
> vez, na ordem. Os passos usam caixas (`- [ ]`).

**Objetivo:** a aula-fonte da trilha `rtg-2026` passa a aceitar oito formatos que hoje
não aceita (`hotspot`, `bench`, `label`, `risk-hunt`, `parameter-lab`, `conversation`,
`blitz` e o `visual` do conceito), com tela, regra de acerto, verificador, gerador,
roteiro do Maestro e uma biblioteca de diagramas e laços de animação em código.

**Arquitetura:** cada formato atravessa os quatro portões que já existem (verificador
`.mjs` → fábrica `rtgBatchFactory.ts` → contrato `wide` → tocador), e um teste novo
percorre todos os tipos para que nenhum fique pela metade. Diagrama e laço são a mesma
coisa: camadas de SVG escritas como texto num módulo puro, desenhadas por `SvgXml`; o
laço é um diagrama com movimento declarado por camada. A mesma descrição alimenta a
tela, o verificador (que só precisa dos nomes) e um script que grava `.svg` para a
revisão visual sem simulador.

**Pilha:** Expo/React Native, TypeScript, `react-native-svg` 15 (`SvgXml`),
`react-native-reanimated` 4 (só dentro de `ui/motion.ts`), Jest, Node 20.

**Especificação:** [`docs/superpowers/specs/2026-11-18-trilha-dobrada-design.md`](../specs/2026-11-18-trilha-dobrada-design.md),
seções 8.2, 8.3 e 10. Mapa do terreno com `caminho:linha`:
`.superpowers/sdd/fase-b-terreno.md` (fora do git; cada tarefa cita o que precisa).

Abreviações: `LA` = `radiant-app/src/types/learningActivity.ts`; `FR` =
`radiant-app/src/features/lesson-flow/renderers`; `SC` =
`radiant-app/src/features/student-checkpoints`; `LFS` =
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`.

## Restrições globais

- Node 20 para tudo do app e dos scripts: `export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`; confira `node --version`.
- Nenhum identificador, tipo, papel ou marca de segurança das 157 aulas atuais muda. `node scripts/content/build-rtg-batches.mjs --check` continua saindo 0 ao fim de cada tarefa: os 24 lotes gerados não mudam nesta fase.
- Toda aula continua com exatamente 5 interações; cada formato novo ocupa uma.
- Nenhuma interação depende só de arrastar. Alvo de toque de 44 pt ou mais. Estado nunca só por cor. Todo controle com `accessibilityRole`, rótulo e estado. Cada tela tem caminho completo por leitor de tela.
- "Reduzir movimento": laço parado no quadro `posterAt`; `resolved=false` conta como sem animar.
- `react-native-reanimated` só é importado em `radiant-app/src/ui/motion.ts` (regra R4 do `visual:qa:strict`). Espaçamento e raio vêm dos tokens. Cor literal não entra em `src/features/`.
- Texto de interface: sem caixa alta, sem travessão com espaços, sem as palavras `jornada`, `elegível`, `nó`, `checkpoint`, `configuração` (`copy-style-contract`).
- Diagrama não tem texto dentro (`<text>` é proibido): rótulo vem do conteúdo, para o leitor de tela e para uma tradução futura.
- O módulo que o verificador e a fábrica consultam não importa pacote nenhum (`scripts/content/load-app-contract.cjs` só aceita `.ts` por caminho relativo).
- Jest não desenha SVG nem Skia: teste os valores que determinam o desenho, em função pura.
- Toda asserção nova é vista falhando com o defeito que ela nomeia; a saída vermelha vai para `docs/evidence/2026-11-19-formatos/vermelho-tarefa-N.txt`.
- O `blitz` nunca tira vida, e o tempo dele pode ser desligado e desliga sozinho com leitor de tela.
- Imagem real: até 150 KiB por arquivo e 15 MiB somados.
- Quem implementa faz commit só dos arquivos da própria tarefa, com `git add <caminhos>`. Não roda `loop`, `git push`, `git stash`, nem abre Metro ou simulador.

## Decisões deste plano

1. **Figura = imagem ou diagrama, pelo mesmo campo.** No lote, `imageRef` guarda o
   identificador da imagem licenciada ou `diagram:<id>`. Na aula-fonte o autor escreve
   `imageId` ou `diagramId`, exatamente um. Assim `hotspot`, `label` e `risk-hunt`
   não mudam de forma, e o contrato `wide` não ganha chave.
2. **Laço não usa Lottie.** A especificação deixou a técnica para o plano. Lottie
   escrito à mão não se revisa; SVG em camadas com movimento declarado se revisa por
   imagem estática e se testa por função pura.
3. **`parameter-lab` e `risk-hunt` mudam de forma no contrato.** Os tipos atuais não
   têm uso nem regra de acerto (`LA:151`, `LA:211`). O `parameter-lab` passa a ser um
   controle sobre um modelo registrado, com meta numérica, como a bancada. O
   `risk-hunt` passa a ser marcar todas as regiões de risco numa figura.
4. **Três modelos no `parameter-lab`:** distância (inverso do quadrado), blindagem
   (camadas semirredutoras) e decaimento (meias-vidas). kV, mAs e colimação já são da
   bancada. As leituras são relativas (porcentagem), nunca dose de paciente.
5. **O limite de 80 palavras do conceito com `visual` vale para unidade nova.** As 24
   unidades atuais mantêm 110; a fase D decide aula a aula.
6. **Catorze laços**, listados na tarefa 11.
7. **Sem simulador nesta fase.** O disco tem 2 GiB livres. Cada tela ganha história no
   Storybook e teste de componente; ver em aparelho fica para a fase E e para o dono.

## Foco da revisão

1. Tipo aceito num portão e esquecido em outro: a aula trava num passo sem saída
   (`FR/InteractionAnswerValue.ts:213`). A tarefa 1 cria o teste que percorre os tipos.
2. Campo novo escrito errado no JSON é descartado em silêncio (o verificador não
   recusa campo desconhecido). Cada tarefa recusa chave fora da lista no tipo que cria.
3. Figura que não resolve prende o aluno. O verificador confere `imageId` e
   `diagramId` contra os registros antes de a fábrica rodar.
4. Região ou ponto fora do quadro, ou dois alvos sobrepostos a menos de 44 pt numa tela
   de 320 pt de largura: o verificador mede a distância mínima entre alvos.
5. `blitz` com leitor de tela: tempo ligado esconderia a afirmação antes de ela ser
   lida. O teste do componente prova o tempo desligado nesse estado.

---

### Task 1: teste que percorre as famílias de interação

**Files:**
- Modify: `radiant-app/src/types/learningActivity.ts` (exporta `INTERACTION_TYPES`)
- Create: `radiant-app/src/test/fixtures/interactionFamilyFixtures.ts`
- Create: `radiant-app/src/features/lesson-flow/renderers/interactionFamilies.contract.test.ts`
- Create: `scripts/content/fixtures/unidade-formatos.json`, `scripts/content/rtg-formatos.test.mjs`
- Create: `docs/evidence/2026-11-19-formatos/README.md`

**Interfaces:**
- Produces: `INTERACTION_TYPES: readonly InteractionType[]`, com checagem em tempo de compilação de que nenhum membro da união falta.
- Produces: `INTERACTION_FAMILY_FIXTURES: Record<InteractionType, { interaction: LearningInteractionV2; correctValue: string; wrongValue: string } | 'pending'>`. `'pending'` só é aceito para os tipos da lista `PENDING_FAMILIES` do teste, que nasce com `parameter-lab` e `risk-hunt` e termina vazia na tarefa 9.
- Produces: `scripts/content/fixtures/unidade-formatos.json`: unidade sintética válida, com o `id` de uma unidade real e conteúdo próprio, duas aulas, só com os tipos que a aula-fonte aceita hoje. As tarefas 3 a 10 trocam uma interação dela pelo tipo que criam.

- [ ] **Passo 1:** escreva o teste. Para cada tipo fora de `PENDING_FAMILIES` ele exige: tela registrada (`REGISTERED_INTERACTION_TYPES`); `validateInteraction` sem erro no exemplo; `isCompleteInteractionValue` e `isCorrectInteractionValue` verdadeiros em `correctValue`; completo e incorreto em `wrongValue`; `feedbackFor` e `correctAnswerText` com texto não vazio; `generate-rtg-maestro` sem lançar. Para os tipos que a aula-fonte aceita, exige também entrada em `WIDE_ACTIVITY_FAMILIES` e em `FAMILY_LABEL`.
- [ ] **Passo 2:** veja falhar pelo motivo certo: tire `multi-select` de um dos `switch` numa cópia de trabalho, rode, guarde a saída em `vermelho-tarefa-1.txt` e desfaça.
- [ ] **Passo 3:** `rtg-formatos.test.mjs` passa a unidade sintética pelo verificador e pela fábrica (do jeito que `build-rtg-batches.mjs` carrega a fábrica) e afirma zero erros e os tipos esperados no lote.
- [ ] **Passo 4:** rode `npx jest src/features/lesson-flow/renderers/interactionFamilies.contract.test.ts --runInBand`, `npm run typecheck`, `npm run lint` em `radiant-app`, e os testes de `scripts/content` e `scripts/qa` como em `.github/workflows/content-scripts.yml`. Esperado: tudo verde.
- [ ] **Passo 5:** commit.

### Task 2: diagramas e laços em código

**Files:**
- Create: `radiant-app/src/ui/diagrams/diagramTypes.ts`, `diagramPalette.ts`, `diagramMotion.ts`, `diagramRegistry.ts`, `DiagramView.tsx`, `specs/tubo-raios-x.ts`, `specs/colimador-abrindo.ts`
- Create: `radiant-app/src/ui/diagrams/diagramRegistry.test.ts`, `diagramMotion.test.ts`, `DiagramView.test.tsx`, `DiagramView.stories.tsx`
- Create: `radiant-app/scripts/render-diagrams.mjs`
- Modify: `radiant-app/src/ui/motion.ts` (um gancho novo), `radiant-app/scripts/reanimated-easing-contract.test.mjs` se o gancho exigir

**Interfaces:**
- Produces (`diagramTypes.ts`, puro):
  ```ts
  export type LayerMotion =
    | { kind: 'translate'; dx: number; dy: number }
    | { kind: 'rotate'; degrees: number; cx: number; cy: number }
    | { kind: 'scale'; from: number; to: number; cx: number; cy: number }
    | { kind: 'fade'; from: number; to: number };
  export type DiagramLayer = { svg: string; motion?: LayerMotion & { mode: 'loop' | 'pingpong'; phase?: number } };
  export type DiagramSpec = { id: string; alt: string; width: number; height: number; layers: DiagramLayer[]; periodMs?: number; posterAt?: number };
  export type LayerState = { translateX: number; translateY: number; rotateDeg: number; scale: number; opacity: number };
  ```
  `svg` é o miolo de um `<svg>` nas coordenadas `0..width`, `0..height`. `dx`, `dy`, `cx`, `cy` estão nas mesmas unidades. `periodMs` presente quer dizer laço.
- Produces (`diagramMotion.ts`, puro): `layerStateAt(motion: DiagramLayer['motion'], progress: number): LayerState` e `diagramSvgAt(spec: DiagramSpec, progress: number): string` (o `<svg>` completo daquele instante, que o script e o modo parado usam).
- Produces (`diagramRegistry.ts`, puro): `DIAGRAMS: Record<string, DiagramSpec>`, `DIAGRAM_IDS: readonly string[]`, `diagramRef(id: string): string` (devolve `diagram:<id>`), `parseDiagramRef(ref: string): string | null`.
- Produces (`diagramPalette.ts`, puro): `P`, as cores nomeadas dos diagramas. Escolha-as dos tokens do app para o painel escuro em que o diagrama aparece e confira o contraste de traço contra o fundo (3:1 ou mais).
- Produces (`DiagramView.tsx`): `DiagramView(props: { id: string; progress?: number; decorative?: boolean })`. Sem `progress`, o laço roda no relógio; com `progress` (0 a 1), quem chama dirige. Com "reduzir movimento", fora de foco ou sem `periodMs`: quadro `posterAt ?? 0`, sem relógio. `accessibilityRole="image"` e `accessibilityLabel={spec.alt}`, salvo `decorative`.
- Produces (`ui/motion.ts`): `useLoopProgress(periodMs: number | undefined, playing: boolean)`, relógio linear de 0 a 1 que respeita "reduzir movimento" e foco de tela, como `useLottieFrameLoop`.
- Produces (`render-diagrams.mjs`): `node radiant-app/scripts/render-diagrams.mjs <pasta> [id...]` grava `<id>.svg` no quadro de pôster e, para laço, `<id>@0.svg`, `<id>@25.svg`, `<id>@50.svg`, `<id>@75.svg`. Carrega o registro como o gerador de conteúdo carrega a fábrica.

- [ ] **Passo 1: testes que falham.** `diagramMotion.test.ts`: `translate` em `loop` vai de 0 a `dx` e volta a 0 em `progress` 1; em `pingpong` passa por `dx` em 0,5 e volta; `phase` desloca; `rotate` dá `degrees × progress`; `fade` e `scale` interpolam; sem `motion`, identidade. `diagramRegistry.test.ts`: todo `id` é `kebab-case` e igual à chave; nenhum `svg` contém `<text`, `<image`, `<script`, `href`; toda cor literal dos `svg` pertence a `P`; `width` e `height` positivos; `alt` de 20 a 160 caracteres; `diagramSvgAt` devolve XML bem formado para 0, 0,5 e 1; `parseDiagramRef(diagramRef(id)) === id`.
- [ ] **Passo 2:** rode e veja falhar (módulo ausente); depois, com o módulo pronto, ponha um `<text>` num diagrama e guarde a falha em `vermelho-tarefa-2.txt`.
- [ ] **Passo 3:** implemente. Dois diagramas de semente: `tubo-raios-x` (parado: ampola, cátodo, ânodo, janela, feixe) e `colimador-abrindo` (laço: duas lâminas em `pingpong` e o campo de luz abrindo).
- [ ] **Passo 4:** `DiagramView.test.tsx`: com "reduzir movimento" o componente não inicia o relógio e desenha o pôster; `decorative` tira o nó da árvore de acessibilidade; `id` desconhecido não lança e desenha um quadro vazio com rótulo "Figura indisponível".
- [ ] **Passo 5:** rode os três testes, `npm run typecheck`, `npm run lint`, `npm run visual:qa:strict`, `npm run test:reanimated-easing-contract`, `npm run test:style-literal-contract`; rode o script numa pasta do `$TMPDIR` e confira que os arquivos abrem (`xmllint --noout`).
- [ ] **Passo 6:** commit.

### Task 3: figura compartilhada e `hotspot` na aula-fonte

**Files:**
- Create: `FR/InteractionFigure.tsx`, `FR/InteractionFigure.test.tsx`
- Modify: `FR/InteractionImageSource.ts`, `FR/HotspotStepRenderer.tsx`, `LFS` (`CHECKED_FAMILIES`), `SC/batches/rtgBatchFactory.ts`, `SC/EditorialWideContract.ts`, `scripts/content/rtg-lesson-lint.mjs`, `scripts/content/rtg-lesson-lint.test.mjs`, `scripts/content/build-rtg-batches.mjs`, `scripts/qa/generate-rtg-maestro.mjs` e seu teste, `scripts/content/fixtures/unidade-formatos.json`, os testes que o mapa lista em §1

**Interfaces:**
- Consumes: `DIAGRAMS`, `parseDiagramRef`, `DiagramView` (tarefa 2).
- Produces: `InteractionFigure(props: { imageRef: string; alt?: string; resolveImage?: InteractionImageResolver; children?: (frame: { width: number; height: number }) => ReactNode })`: desenha a imagem licenciada ou o diagrama na largura disponível, mantém a proporção e chama `children` com o tamanho em pontos, para a sobreposição em coordenadas 0 a 1. Sem figura: "Imagem indisponível".
- Produces (aula-fonte): `{ type: 'hotspot'; imageId?: string; diagramId?: string; regions: { label: string; x: number; y: number; width: number; height: number; correct?: true }[]; feedbackCorrect: string; feedbackIncorrect: string }`.
- Produces (verificador): função `figure(where, item)` reutilizada pelas tarefas 4 e 5: exatamente um de `imageId` e `diagramId`; o identificador existe em `imagens.json` ou em `DIAGRAM_IDS`. Função `targets(where, list)`: de 3 a 6 alvos; cada um dentro do quadro; rótulos únicos, de 2 a 40 caracteres; centros a 0,16 ou mais um do outro em cada par (44 pt numa figura de 280 pt); para região, largura e altura de 0,08 ou mais. Função `keys(where, value, allowed)`: recusa chave fora da lista.
- `hotspot`: uma ou duas regiões com `correct`, e ao menos duas sem.

- [ ] **Passo 1:** testes do verificador que falham, um por régua acima, mais "imagem licenciada usada por `hotspot` conta como usada" no contrato `wide` (hoje daria `unused-licensed-image`).
- [ ] **Passo 2:** veja falhar; guarde em `vermelho-tarefa-3.txt`.
- [ ] **Passo 3:** implemente verificador, ramo da fábrica (o `else` final deixa de ser `matching`: tipo sem ramo lança `rtg-batch-unknown-type:<tipo>`), `FAMILY_LABEL.hotspot = 'Toque na imagem'`, `WIDE_ACTIVITY_FAMILIES`, `PAYLOAD_KEYS.hotspot`, `wideResponseIds`, afirmações de proveniência, `CHECKED_FAMILIES`, Maestro (toque pelo rótulo acessível da região).
- [ ] **Passo 4:** `HotspotStepRenderer` passa a usar `InteractionFigure`; o comportamento visível dele não muda (os testes atuais dele continuam verdes sem edição).
- [ ] **Passo 5:** orçamento de imagem em `build-rtg-batches.mjs`: lança `rtg-image-too-large:<id>` acima de 150 KiB e `rtg-images-over-budget` acima de 15 MiB somados; teste com arquivo sintético.
- [ ] **Passo 6:** troque uma interação da unidade sintética por um `hotspot` sobre `diagramId: "tubo-raios-x"`; `rtg-formatos.test.mjs` afirma o tipo no lote e `imageRef === 'diagram:tubo-raios-x'`.
- [ ] **Passo 7:** rode os testes tocados, o teste das famílias, `typecheck`, `lint`, `visual:qa:strict`, os testes de `scripts/`, e `build-rtg-batches.mjs --check` (saída 0).
- [ ] **Passo 8:** commit.

### Task 4: `label` (rotular)

**Files:**
- Create: `FR/LabelStepRenderer.tsx`, `FR/LabelStepRenderer.test.tsx`, `FR/LabelStepRenderer.stories.tsx`
- Modify: os mesmos arquivos de contrato da tarefa 3, `FR/ActivityRendererRegistry.tsx` e seu teste, `FR/InteractionAnswerValue.ts`, `lesson-flow/services/feedbackFor.ts`, fixtures das famílias, unidade sintética

**Interfaces:**
- Produces (`LA`): `'label'` em `InteractionType`; `LabelPayload = { prompt: string; imageRef: string; points: { id: string; x: number; y: number; correctLabelId: string }[]; labels: { id: string; label: string }[] }`. `labels` vem na ordem de exibição, embaralhada pela semente, e pode ter até dois a mais que `points`.
- Produces (aula-fonte): `{ type: 'label'; imageId?; diagramId?; points: { label: string; x: number; y: number }[]; distractors?: string[]; feedbackCorrect; feedbackIncorrect }`; de 3 a 6 pontos, de 0 a 2 distratores, rótulos todos distintos.
- Resposta: objeto JSON `{ [pointId]: labelId }`, pelo mesmo codec do `categorize`. Completa com todo ponto rotulado e nenhum rótulo repetido. Certa com todos iguais a `correctLabelId`.
- Tela: pontos numerados sobre a figura (alvo de 44 pt) e fichas de rótulo embaixo (`TapChip`). Toca-se na ficha e depois no ponto, ou no ponto e depois na ficha; tocar num ponto rotulado devolve a ficha. Rótulo acessível do ponto: "Ponto 2, sem rótulo" ou "Ponto 2, rótulo Ânodo". Depois de conferir, cada ponto mostra certo ou errado com ícone, não só cor.
- Retorno no erro: `feedbackIncorrect` mais "Ponto N é <rótulo certo>." para o primeiro ponto errado. `correctAnswerText`: lista "N: rótulo".
- `FAMILY_LABEL.label = 'Rotular a imagem'`. Maestro: toca ficha e ponto pelos rótulos acessíveis.

- [ ] **Passo 1:** testes que falham: valor (completa, repetida, certa, errada), verificador (réguas e chaves), componente (as duas ordens de toque, devolver ficha, estado acessível, conferido), fábrica (ordem das fichas não entrega a resposta: nunca igual à ordem dos pontos).
- [ ] **Passo 2:** veja falhar; `vermelho-tarefa-4.txt`.
- [ ] **Passo 3:** implemente pelos quatro portões e registre a tela; atualize `REGISTERED_INTERACTION_TYPES` no teste do registro.
- [ ] **Passo 4:** exemplo nas fixtures das famílias e uma interação `label` na unidade sintética.
- [ ] **Passo 5:** rode como no passo 7 da tarefa 3, mais `npm run test:copy-style-contract`.
- [ ] **Passo 6:** commit.

### Task 5: `risk-hunt` (caça ao erro)

**Files:**
- Create: `FR/RiskHuntStepRenderer.tsx`, teste e história
- Create: `radiant-app/src/ui/diagrams/specs/sala-com-riscos.ts` (diagrama de uma sala de exame com quatro a seis situações marcáveis; entra no registro)
- Modify: como na tarefa 4

**Interfaces:**
- Produces (`LA`): `RiskHuntPayload = { prompt: string; imageRef: string; regions: (NormalizedRegion & { explanation: string })[]; riskRegionIds: string[] }` (substitui a forma atual, sem uso).
- Produces (aula-fonte): `{ type: 'risk-hunt'; imageId?; diagramId?; regions: { label; x; y; width; height; risk: boolean; feedback: string }[]; feedbackCorrect; feedbackIncorrect }`; de 4 a 6 regiões, de 2 a n−1 com `risk: true`.
- Resposta: lista JSON de ids marcados. Completa com ao menos um. Certa com o conjunto exato.
- Tela: regiões contornadas sobre a figura, cada uma um `checkbox` acessível com o rótulo; lista textual equivalente abaixo. Contador "2 marcadas".
- Retorno no erro, como no `multi-select`: "Faltou marcar: …" ou "Marcou a mais: …", com a explicação da primeira divergência.
- `FAMILY_LABEL['risk-hunt'] = 'Encontre os riscos'`. Sai de `PENDING_FAMILIES`.

- [ ] **Passos 1 a 6:** como na tarefa 4 (`vermelho-tarefa-5.txt`). O teste do registro deixa de afirmar tipos pendentes que esta tarefa registra.

### Task 6: `visual` no conceito

**Files:**
- Create: `radiant-app/src/features/lesson-flow/components/ConceptVisual.tsx` e teste
- Modify: `LA` (`PresentationPayload.visual?: string` e validação), `SC/batches/rtgBatchFactory.ts`, `scripts/content/rtg-lesson-lint.mjs` e teste, `LFS`, unidade sintética

**Interfaces:**
- Produces (aula-fonte): `concept.visual?: string`, um id de `DIAGRAM_IDS`. O verificador recusa id fora do registro e recusa chave do conceito fora de `title`, `body`, `keyPoints`, `visual`. Com `visual`, o corpo tem até 80 palavras nas unidades que não estão em `LEGACY_UNITS` (as 24 de hoje, constante do verificador) e até 110 nas demais.
- Produces (`LA`): `validateLearningActivity` recusa `visual` que não seja texto não vazio.
- Tela: `ConceptVisual` desenha `DiagramView` entre o corpo e os pontos-chave; id desconhecido não desenha nada e não trava o passo.

- [ ] **Passo 1:** testes que falham: verificador (id inexistente, chave desconhecida `visuall`, 81 palavras em unidade nova, 100 palavras em unidade antiga passa), fábrica (o campo chega ao passo de conceito e só a ele), tela.
- [ ] **Passo 2:** veja falhar; `vermelho-tarefa-6.txt`.
- [ ] **Passo 3:** implemente; ponha `visual: "colimador-abrindo"` numa aula da unidade sintética.
- [ ] **Passo 4:** rode como antes; `build-rtg-batches.mjs --check` sai 0.
- [ ] **Passo 5:** commit.

### Task 7: `conversation` (conversa)

**Files:**
- Create: `FR/ConversationStepRenderer.tsx`, teste e história
- Modify: como na tarefa 4

**Interfaces:**
- Produces (`LA`): `'conversation'`; `ConversationPayload = { prompt: string; speaker: LessonCastId; name?: string; turns: { id: string; line: string; options: { id: string; label: string; reply: string }[]; correctOptionId: string }[] }`.
- Produces (aula-fonte): `{ type: 'conversation'; speaker; name?; turns: { line: string; options: { label: string; correct: boolean; reply: string }[] }[]; feedbackCorrect; feedbackIncorrect }`; 2 ou 3 turnos; 2 ou 3 opções por turno, exatamente uma correta; `line` e `reply` até 200 caracteres, `label` até 120; `paciente` exige `name`; `speaker` não pode ser `pixel`; a correta não é a mais longa do turno; a posição da correta varia entre os turnos.
- Resposta: lista JSON com o id escolhido em cada turno. Completa com um id válido por turno. Certa com todos iguais a `correctOptionId`.
- Tela: fala do personagem com `CastAvatar` (expressão por `castExpressionFor`); o aluno escolhe uma resposta; a escolha fica registrada como fala do aluno, o personagem responde com o `reply` dela (expressão de retorno certo ou errado) e o turno seguinte aparece. Escolha feita não se desfaz. Cada fala é um nó acessível "Nome: texto", e a fala nova é anunciada.
- Retorno no erro: `feedbackIncorrect` mais a resposta que cabia no primeiro turno errado. `correctAnswerText`: as respostas certas, uma por turno.
- `FAMILY_LABEL.conversation = 'Conversa'`.

- [ ] **Passos 1 a 6:** como na tarefa 4 (`vermelho-tarefa-7.txt`).

### Task 8: `blitz` (rodada rápida)

**Files:**
- Create: `FR/BlitzStepRenderer.tsx`, teste e história
- Modify: como na tarefa 4, mais `LFS` (`costsHeart`)

**Interfaces:**
- Produces (`LA`): `'blitz'`; `BlitzPayload = { prompt: string; statements: { id: string; text: string; isTrue: boolean; explanation: string }[]; passCount: number }`.
- Produces (aula-fonte): `{ type: 'blitz'; statements: { text: string; correct: boolean; feedback: string }[]; feedbackCorrect; feedbackIncorrect }`; de 6 a 8 afirmações de até 110 caracteres; de 2 a n−2 verdadeiras; nunca três iguais seguidas no começo. A fábrica põe `passCount = n − 1`.
- Resposta: lista JSON de `true`, `false` ou `null` (tempo esgotado), na ordem. Completa com n posições. Certa com acertos ≥ `passCount`.
- Tela: uma afirmação por vez, botões "Verdadeiro" e "Falso", marca de certo ou errado logo após o toque, contagem "3 seguidas", avanço sozinho. Barra de tempo de 10 s por afirmação com o botão "Sem tempo"; o tempo já nasce desligado com leitor de tela ou "reduzir movimento". Tempo esgotado conta como não respondida.
- `LFS`: resposta errada em `blitz` não cobra vida.
- Retorno: quantas acertou e a explicação da primeira que errou.
- `FAMILY_LABEL.blitz = 'Rodada rápida'`.

- [ ] **Passos 1 a 6:** como na tarefa 4 (`vermelho-tarefa-8.txt`). Testes a mais: com leitor de tela ligado o relógio não existe; resposta errada em `blitz` não chama o gasto de vida, e a mesma resposta errada em `true-false` continua chamando.

### Task 9: `parameter-lab` (controle)

**Files:**
- Create: `radiant-app/src/features/parameter-lab/labModels.ts` e teste (puro), `FR/ParameterLabStepRenderer.tsx`, teste e história
- Create: `radiant-app/src/ui/diagrams/specs/inverso-do-quadrado.ts`, `blindagem-camadas.ts`, `decaimento-radioativo.ts`
- Modify: como na tarefa 4

**Interfaces:**
- Produces (`labModels.ts`): `LAB_MODEL_IDS = ['inverse-square', 'shielding', 'decay'] as const`; `LAB_MODELS: Record<LabModelId, { parameter: { label: string; unit: string; min: number; max: number; step: number }; diagramId: string; progress(value: number): number; readouts(value: number): { label: string; value: string }[] }>`.
  - `inverse-square`: distância de 1 a 4 m, passo 0,5; leitura "Intensidade relativa" = 100 / d² %.
  - `shielding`: de 0 a 5 camadas semirredutoras, passo 1; leitura "Radiação que passa" = 100 / 2ⁿ %.
  - `decay`: de 0 a 6 meias-vidas, passo 1; leitura "Atividade restante" = 100 / 2ⁿ %.
  Números com vírgula decimal e no máximo uma casa.
- Produces (`LA`): `ParameterLabPayload = { prompt: string; model: LabModelId; start: number; goal: { atLeast?: number; atMost?: number }; hints: { tooLow: string; tooHigh: string } }` (substitui a forma atual).
- Produces (aula-fonte): `{ type: 'parameter-lab'; model; start; goal; hints; feedbackCorrect; feedbackIncorrect }`; `start` e os limites de `goal` na grade do modelo; `start` fora da meta; ao menos um limite.
- Resposta: o valor do controle como texto. Completa com número na grade. Certa dentro da meta. Retorno no erro: `hints.tooLow` ou `hints.tooHigh`.
- Tela: `DiagramView` do modelo dirigido por `progress(value)`, as leituras, e o controle com botões de menos e mais além do deslizante (`accessibilityRole="adjustable"`, valor anunciado com unidade).
- `FAMILY_LABEL['parameter-lab'] = 'Ajuste o controle'`. `PENDING_FAMILIES` fica vazia e o teste passa a recusar `'pending'`.

- [ ] **Passos 1 a 6:** como na tarefa 4 (`vermelho-tarefa-9.txt`). Teste do modelo: os valores das três leituras nos extremos e no meio.

### Task 10: `bench` na aula-fonte

**Files:**
- Modify: `scripts/content/rtg-lesson-lint.mjs` e teste, `SC/batches/rtgBatchFactory.ts`, `SC/EditorialWideContract.ts` e teste, `LFS` se `CHECKED_FAMILIES` não o tiver, `scripts/qa/generate-rtg-maestro.mjs` e teste, unidade sintética

**Interfaces:**
- Produces (aula-fonte): `{ type: 'bench'; simulator; mode; controls; goal; phantomLabel; hints; feedbackCorrect; feedbackIncorrect }`, com os mesmos nomes e valores de `BenchPayload` (`LA:199`). O verificador confere a forma, os textos e as chaves; a validação fina é a de `validateInteraction`, que a fábrica já faz lançar.
- `FAMILY_LABEL.bench = 'Bancada'`. Maestro: move o controle até a meta pelos botões acessíveis que a bancada já tem.

- [ ] **Passos 1 a 5:** teste que falha, vermelho em `vermelho-tarefa-10.txt`, implementação, uma interação `bench` de exposição na unidade sintética, gates, commit.

### Task 11: os catorze laços

**Files:**
- Create: um arquivo por laço em `radiant-app/src/ui/diagrams/specs/`
- Modify: `radiant-app/src/ui/diagrams/diagramRegistry.ts`

Laços (os marcados com * já existem das tarefas 2 e 9): `tubo-emitindo`,
`colimador-abrindo`*, `feixe-atenuando`, `radiacao-espalhada`, `grade-antidifusora`,
`inverso-do-quadrado`*, `blindagem-camadas`*, `decaimento-radioativo`*,
`corte-tomografico-girando`, `precessao-rm`, `eco-ultrassom`, `detector-convertendo`,
`foco-e-penumbra`, `compressao-mama`.

Cada laço: de 3 a 8 camadas, `periodMs` de 2.400 a 6.000, `posterAt` no quadro que
melhor explica a ideia parado, `alt` que descreve o que se vê e o que se move. Três
autores em paralelo (arquivos disjuntos), o controlador acrescenta as linhas do
registro, roda `render-diagrams.mjs`, converte para PNG e olha cada quadro; laço que
desenha algo fisicamente errado volta ao autor.

- [ ] **Passo 1:** autores escrevem os dez arquivos novos.
- [ ] **Passo 2:** registro, `diagramRegistry.test.ts` verde, `render-diagrams.mjs` em todos.
- [ ] **Passo 3:** revisão visual do controlador, registrada em `docs/evidence/2026-11-19-formatos/README.md` com os quadros de pôster em PNG (até 40 KB cada).
- [ ] **Passo 4:** commit.

### Task 12: guia, inventário e sinalização

**Files:**
- Modify: `docs/content/2026-11-05-guia-de-autoria-rtg-2026.md`, `docs/CONTENT_PIPELINE.md`, `docs/ARCHITECTURE_STATE.md`, `radiant-app/README.md`, `radiant-app/docs/CHANGELOG.md`, `docs/STATUS.md`, `docs/plans/2026-07-27-radiant-launch-roadmap.md`
- Create: `docs/adr/ADR-2026-11-19-formatos-da-trilha-dobrada.md`
- Modify ou Create: o script de inventário da trilha (ache o existente em `scripts/content/`; se não houver, `scripts/content/rtg-inventory.mjs` com teste)

**Interfaces:**
- Produces: o guia ganha, para cada formato, a forma no JSON, um exemplo válido tirado da unidade sintética, quando usar e quando não usar, e a lista de diagramas e laços disponíveis.
- Produces: `node scripts/content/rtg-inventory.mjs --metas` imprime, para a trilha e por unidade: aulas, interações por família, passos de texto mais múltipla escolha mais decisão de caso sobre o total (meta 2), aulas com passo visual (meta 3), famílias além de múltipla escolha e decisão de caso (meta 4). Passo visual: conceito com `visual`, ou interação `hotspot`, `label`, `risk-hunt`, `comparison`, `bench`, `parameter-lab`. Teste do script sobre a unidade sintética com os números contados à mão.
- A ADR registra as sete decisões deste plano e o que a medição da revisão espaçada mostrou.

- [ ] **Passo 1:** teste do inventário que falha; implementação; números da trilha atual colados na evidência.
- [ ] **Passo 2:** documentos. Cada frase do guia sobre o que o verificador exige é conferida contra o verificador.
- [ ] **Passo 3:** `npm run quality` inteiro (`EXPO_NO_DOTENV=1 CI=1`, Node 20), testes de `scripts/`, `build-rtg-batches.mjs --check`, `docs-contract`. Commit.

### Medição à parte: revisão espaçada com a trilha dobrada

Roda em paralelo com a tarefa 1, só leitura mais um arquivo de medição
(`radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.doubledTrail.bench.ts`,
no padrão do `capacity.bench.ts`). Mede, pelos serviços reais, o tamanho do valor
gravado com 310 aulas concluídas em três casos: toda aula com ao menos uma múltipla
escolha; aula sem nenhuma (o caso dos cartões que não saem); e com recuperação. Compara
com o teto de leitura de 1,9 MiB medido no Android (`docs/STATUS.md`). O resultado vai
para a evidência e para o dono; mudar o armazenamento é decisão dele. Se o caso sem
múltipla escolha estourar, o verificador ganha a régua "toda aula tem ao menos uma
múltipla escolha" na tarefa 12.
