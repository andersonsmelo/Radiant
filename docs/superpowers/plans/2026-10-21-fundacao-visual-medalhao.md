# Fundação visual Medalhão — plano de implementação

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development
> (recomendada) ou superpowers:executing-plans, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** trocar o mundo visual do app do "céu navegável" pelo Medalhão.
Isso cobre tokens, relevo, fundo, ícones e o runtime das ilustrações animadas
com as cinco ilustrações de tema. É a base de que os planos 2, 3 e 5 dependem.

**Arquitetura:**
- **Os valores trocam, os nomes ficam.** Os 67 arquivos que leem `galaxyColors`
  não mudam. Os papéis novos (medalha, retorno, relevo) nascem em `theme.ts`
  e `semantic-colors.ts`, nunca num arquivo de tela.
- **As ilustrações são Lottie tocado pelo Skottie** do
  `@shopify/react-native-skia`, atrás de um componente que decide entre animar,
  ficar parado ou mostrar a silhueta.

**Pilha:**
- Expo SDK 54 e React Native 0.81;
- Reanimated 4.1;
- `@shopify/react-native-skia` 2.2.12, a versão empacotada pelo SDK 54;
- `react-native-svg` 15.12;
- as ilustrações saem da skill `diffusionstudio/lottie@text-to-lottie`.

**Spec:** [trilha Medalhão e aula-bancada](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
[ADR](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) ·
[prancheta da trilha](../../design/2026-10-21-trilha-medalhao.html) ·
[índice dos planos](2026-10-21-trilha-medalhao-indice.md).

## Restrições globais

- **Node:** testes e builds no Node 20. Só os comandos `loop` usam o 24.
  Confira com `node --version` antes de citar um número.
- **Gate:** `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, e nada menos.
- **Loop:**
  - um run por tarefa, aberto por `node scripts/loop/abrir.mjs`, declarando
    todos os caminhos da tarefa;
  - Metro com `EXPO_NO_TYPESCRIPT_SETUP=1`;
  - fechamento em `validate → step finish → [memory write] → run close`, uma
    chamada por comando, lendo o `code` de cada envelope.
- **Uma identidade só no app.** Nenhuma tela importa a paleta clara: continua
  valendo o `identity-palette-contract`.
- **Contraste AA medido na composição:** texto a 4,5:1 e elemento gráfico
  informativo a 3:1.
- **Sem emoji nem caractere de texto como ícone.** Ícone é SVG desenhado ou
  Lottie.
- **Toda animação tem alternativa sob "reduzir movimento":** quadro parado ou
  troca instantânea.
- **Sora continua** como a única família, nos papéis de `typography.*`.
- **Dependência nativa nova:** só `@shopify/react-native-skia@2.2.12`.
  Nenhuma build de loja sai deste plano. A build local do dev client para o
  simulador e para o AVD é permitida.

## Valores da paleta

Valores da prancheta, conferidos por contraste em 2026-10-21. Onde a prancheta
reprovou, vale a coluna "no app".

| Papel | Prancheta | No app | Contraste medido |
| --- | --- | --- | --- |
| `galaxyColors.background` | `#13151c` | `#13151c` | texto principal 16,0:1 |
| `galaxyColors.backgroundAlt` | `#171920` | `#171920` | — |
| `galaxyColors.surface` | `#1b1e27` | `#1b1e27` (opaca) | texto secundário 7,15:1 |
| `galaxyColors.surfaceMuted` | `#2a2e3a` | `#2a2e3a` | — |
| `galaxyColors.border` | `#323747` | `#323747` | — |
| `galaxyColors.textPrimary` | `#eef0f6` | `#eef0f6` | 14,6:1 na superfície |
| `galaxyColors.textSecondary` | `#a3aabb` | `#a3aabb` | 7,15:1 na superfície |
| `galaxyColors.textTertiary` | — | `#8f97a9` | 5,68:1 na superfície |
| `galaxyColors.tabBarSurface` | `#171920` | `#171920` | — |
| `galaxyColors.tabBarInactive` | `#6d7487` | **`#8a91a3`** | a prancheta dava 3,76:1 (reprova); 5,57:1 |
| ativo da aba | `#eef0f6` | `#eef0f6` | 15,4:1; separação de 2,77 do inativo |
| `semanticColors.galaxy.actionPrimary` | `#2F6BFF` | **`#2559E6`** | branco sobre `#2F6BFF` dá 4,50:1, no limite; sobre `#2559E6`, 5,75:1 |
| `semanticColors.galaxy.actionPrimaryPressed` | `#1846C9` | `#1846C9` | — |
| `medalColors.gold` (face / lábio / miolo) | `#FFC21A` / `#C98A00` / `#F2AE00` | igual | — |
| `medalColors.unit` (face / lábio / miolo) | `#2F6BFF` / `#1846C9` / `#275CEB` | igual (sem texto por cima) | — |
| `medalColors.locked` (face / lábio / miolo / silhueta) | `#343947` / `#22252f` / `#2d313d` / `#4B5163` | igual | — |
| `feedbackColors.success` (preenchimento / lábio / superfície) | `#2BD67B` / `#1A9E58` / `#14281f` | igual | texto escuro `#0b2a18` 8,1:1; título 8,14:1 na superfície |
| `feedbackColors.error` (preenchimento / lábio / superfície) | `#FF8298` / `#C9566B` / `#2c1820` | igual | texto escuro `#3a0d17` 7,12:1; título 7,07:1 na superfície |
| `depth` | lábio de 5 pt no botão e de 8 pt na medalha | `{ lip: 5, medalLip: 8 }` | — |

## Foco da revisão

As cinco situações que nenhum teste de tarefa cobre por acaso e que mais
provavelmente afetam o aluno. Cada uma tem teste na tarefa dona:

1. **Texto grande (Dynamic Type no máximo):** o rótulo de botão com relevo
   quebra linha sem que o lábio estoure ou corte o texto. Coberto na tarefa 2.
2. **"Reduzir movimento" ligado:** nenhuma ilustração anima, nem o lábio, e o
   quadro parado é o de pose principal, não o quadro 0, que pode estar vazio.
   Coberto nas tarefas 2 e 5.
3. **Leitor de tela:** ilustração e ícone são decorativos e não viram ruído; o
   HUD continua lendo "44 XP" como um nó só. Coberto nas tarefas 4 e 5.
4. **Arquivo Lottie ausente ou corrompido:** a tela não quebra; aparece a
   medalha sem ilustração e o erro vai para o log. Coberto na tarefa 5.
5. **Android de entrada:** cinco ilustrações visíveis ao mesmo tempo não derrubam
   a rolagem. Medido na tarefa 7, no AVD `radiant-entrada-api34`.

---

### Tarefa 1: Paleta Medalhão nos tokens

**Arquivos:**
- Modificar: `radiant-app/src/ui/theme.ts`, com os valores de `galaxyColors` da
  tabela e os exports novos `medalColors`, `feedbackColors` e `depth`
- Modificar: `radiant-app/src/ui/semantic-colors.ts`, no contexto `galaxy`:
  - `actionPrimary` `#2559E6` e `actionPrimaryPressed` `#1846C9`;
  - `statusSuccess` `feedbackColors.success.fill`;
  - `statusError` `feedbackColors.error.fill`
- Testar: `radiant-app/scripts/contrast-contract.test.mjs` e
  `radiant-app/src/ui/__tests__/semantic-colors.test.ts`

**Interfaces:**
- Produz:
  - `medalColors: Record<'gold' | 'unit' | 'locked', { face: string; lip: string; inner: string }>`;
    `locked` tem também `silhouette: string`;
  - `feedbackColors: Record<'success' | 'error', { fill: string; lip: string; surface: string; onFill: string }>`,
    com `onFill` `#0b2a18` e `#3a0d17`;
  - `depth: { lip: 5; medalLip: 8 }`.

- [ ] **Passo 1: escrever os testes que falham**, em `contrast-contract.test.mjs`:
  - `medalhão: o texto sobre a ação primária passa AA`, com
    `contrastRatio(galaxy.textOnAccent, galaxy.actionPrimary) >= 4.5`;
  - `medalhão: cada lábio é mais escuro que a face e a silhueta se distingue do
    bloqueado`, que exige para `gold`, `unit` e `locked`:
    - `luminance(lip) < luminance(face)`;
    - `contrastRatio(locked.silhouette, locked.face) >= 1.3`, que mede validade
      e não só diferença, como pede a lição de guardas de 2026-09-22;
  - `medalhão: o texto do retorno passa AA no preenchimento e na superfície`,
    com `onFill/fill >= 4.5` e `fill/surface >= 4.5` para `success` e `error`;
  - `medalhão: o fundo é o grafite`, que espera
    `galaxyColors.background === '#13151c'`.
- [ ] **Passo 2: ver falhar.** Rode
  `cd radiant-app && node --test scripts/contrast-contract.test.mjs`.
  Esperado: os 4 testes novos reprovam (`medalColors` indefinido e fundo
  `#03030d`), e os antigos passam.
- [ ] **Passo 3: aplicar a tabela** em `theme.ts` e `semantic-colors.ts`. Quem
  lia `surface` como transparência sobre o céu passa a ler a cor opaca.
- [ ] **Passo 4: ver passar** com `npm run test:contrast-contract && npx jest src/ui/__tests__/semantic-colors.test.ts`.
  Esperado: todos passam, inclusive os testes antigos da aba e do foco.
- [ ] **Passo 5: registrar.** Rode o gate, faça o fechamento do Loop e faça
  `git commit -m "feat(ui): paleta Medalhão nos tokens"`.

### Tarefa 2: Relevo nos botões

**Arquivos:**
- Modificar: `radiant-app/src/components/ui/AppButton.tsx` e
  `AppButton.stories.tsx`
- Testar: `radiant-app/src/components/ui/AppButton.test.tsx`

**Interfaces:**
- Consome `depth`, `medalColors` e `feedbackColors` da tarefa 1.
- Produz `AppButton` com `variant: 'primary' | 'galaxy' | 'secondary' | 'ghost' | 'success' | 'error'`.
  O lábio é um `View` com `testID="app-button-lip"`, e a face é
  `testID="app-button-face"`. O háptico continua só em `primary` e `galaxy`
  (Regra do Sinal Proporcional).

- [ ] **Passo 1: escrever os testes que falham:**
  - `desenha o lábio de 5 pt na cor do papel`: em `primary`, o lábio tem
    `backgroundColor === '#1846C9'` e a face fica 5 pt acima. Em `success` e
    `error`, o lábio usa `feedbackColors.*.lip`;
  - `pressionado, a face desce até o lábio`: depois de
    `fireEvent(button, 'pressIn')`, a face tem `transform[translateY] === 4`;
  - `ghost não tem lábio`: `queryByTestId('app-button-lip')` é nulo;
  - `com reduzir movimento, a pressão não anima`: com `useReducedMotion` mockado
    para `true`, a troca é instantânea, sem `withTiming`;
  - `rótulo longo com texto grande quebra dentro da face`: com
    `allowFontScaling` e um rótulo de 40 caracteres, `numberOfLines` fica
    indefinido e a altura do lábio não depende do texto.
- [ ] **Passo 2: ver falhar** com `cd radiant-app && npx jest src/components/ui/AppButton.test.tsx`.
  Esperado: os 5 novos reprovam.
- [ ] **Passo 3: implementar.** O lábio é um `View` com a cor de `lip` e
  `paddingBottom: depth.lip`. A face é `Animated.View` com `translateY` de 0 a
  `depth.lip - 1` na pressão. Nada de `shadow*` para simular o relevo.
- [ ] **Passo 4: ver passar** com o mesmo comando. Todos verdes, inclusive os
  testes antigos do `AppButton`.
- [ ] **Passo 5: registrar.** Gate, Loop e
  `git commit -m "feat(ui): botões com relevo do Medalhão"`.

### Tarefa 3: Fundo grafite sem estrelas

**Arquivos:**
- Modificar: `radiant-app/src/ui/components/StarfieldBackground.tsx`. O nome
  fica por enquanto, para não tocar as 9 telas que o usam; o plano 5 renomeia.
- Testar: `radiant-app/src/ui/components/StarfieldBackground.test.tsx`

- [ ] **Passo 1: reescrever o teste para o comportamento novo:**
  - `pinta o grafite e nenhuma estrela`: o contêiner tem
    `backgroundColor === galaxyColors.background`;
  - zero elementos de estrela, contados pelo mesmo seletor que o teste atual usa
    para contá-los.
- [ ] **Passo 2: ver falhar** com
  `npx jest src/ui/components/StarfieldBackground.test.tsx`. As estrelas
  continuam desenhadas.
- [ ] **Passo 3: implementar.** O componente devolve só o `View` de fundo com os
  filhos. Saem o laço de animação e o custo de CPU (FILA 12 e 33).
- [ ] **Passo 4: ver passar.**
- [ ] **Passo 5: registrar.** Gate, Loop e
  `git commit -m "feat(ui): fundo grafite sem céu estrelado"`.

### Tarefa 4: Ícones desenhados em três tons

**Arquivos:**
- Modificar: `radiant-app/src/ui/components/HudIcons.tsx`, com os traçados de
  raio, chama e coração copiados da prancheta da trilha, função `bolt`,
  `flame` e `heart` do script
- Criar: `radiant-app/src/ui/components/TabIcons.tsx`, com `StudyTabIcon` (o
  capelo da prancheta) e `ProfileTabIcon`
- Modificar: `radiant-app/src/app/(tabs)/_layout.tsx`, onde os dois
  `tabBarIcon` passam a usar `TabIcons`
- Testar: `radiant-app/src/ui/components/HUD.test.tsx`,
  `radiant-app/src/ui/components/TabIcons.test.tsx` (novo) e o contrato de
  glifos da FILA 66

**Interfaces:**
- Produz
  `StudyTabIcon({ focused, size }: { focused: boolean; size?: number })` e o
  mesmo para `ProfileTabIcon`, com `size` padrão 28. Ativo: três tons de
  `medalColors.unit`. Inativo: um tom, `galaxyColors.tabBarInactive`.
- Mantém as assinaturas de `XpIcon`, `StreakIcon`, `HeartIcon` e
  `hudIconTiming`.

- [ ] **Passo 1: escrever os testes que falham:**
  - em `TabIcons.test.tsx`:
    - `inativo pinta um só tom`: todo `Path` com
      `fill === galaxyColors.tabBarInactive`;
    - `ativo usa os tons da unidade`: conjunto de `fill` igual a
      `{ face, lip, inner }` de `medalColors.unit`;
    - `é decorativo`: `accessibilityElementsHidden` e
      `importantForAccessibility="no-hide-descendants"`;
  - em `HUD.test.tsx`: `o raio pinta os três tons da prancheta`. Os `fill` de
    `XpIcon` contêm `#FFC21A`, `#FFE07A` e `#E59A00`. O rótulo "44 XP" continua
    como nó único.
- [ ] **Passo 2: ver falhar** com
  `npx jest src/ui/components/TabIcons.test.tsx src/ui/components/HUD.test.tsx`.
- [ ] **Passo 3: implementar.** Copie os traçados da prancheta em
  `react-native-svg`, sem `@expo/vector-icons`, como exige a guarda AST da FILA
  66.
- [ ] **Passo 4: ver passar**, e também
  `npm run test:icon-assets-contract`.
- [ ] **Passo 5: registrar.** Gate, Loop e
  `git commit -m "feat(ui): HUD e abas com ícones desenhados do Medalhão"`.

### Tarefa 5: Skia, Skottie e a primeira ilustração (tubo)

**Arquivos:**
- Modificar: `radiant-app/package.json` e `package-lock.json`, via
  `npx expo install @shopify/react-native-skia`. Confira `2.2.12` no
  `package.json`.
- Criar:
  - `radiant-app/src/ui/illustrations/illustrationPlayback.ts`, com a decisão
    pura;
  - `radiant-app/src/ui/illustrations/ThemeIllustration.tsx`, com o
    componente;
  - `radiant-app/src/ui/illustrations/ThemeIllustration.stories.tsx`;
  - `radiant-app/assets/illustrations/src/tubo.svg` e
    `radiant-app/assets/illustrations/tubo.json`, o Lottie.
- Testar: `radiant-app/src/ui/illustrations/illustrationPlayback.test.ts` e
  `radiant-app/src/ui/illustrations/ThemeIllustration.test.tsx`

**Interfaces:**
- Produz:
  - `type IllustrationTheme = 'radiacao' | 'tubo' | 'tomografia' | 'protecao' | 'ressonancia'`;
  - `type IllustrationState = 'done' | 'next' | 'locked'`;
  - `resolvePlayback({ state, reducedMotion }: { state: IllustrationState; reducedMotion: boolean }): { mode: 'animate' | 'still' | 'silhouette'; frame: number | null }`;
  - `ThemeIllustration({ theme, state, size }: { theme: IllustrationTheme; state: IllustrationState; size: number })`;
  - `illustrationAssets: Partial<Record<IllustrationTheme, number>>`, os
    `require` dos JSON, que a tarefa 6 completa.

**Regras pinadas:**
- `locked` dá sempre `silhouette`, no quadro parado, pintado com
  `medalColors.locked.silhouette`;
- `reducedMotion` dá `still`;
- o quadro parado é o `posterFrame` declarado no JSON (`meta.posterFrame`),
  nunca 0;
- tema sem asset, ou JSON que o `Skia.Skottie.Make` não consegue montar, mostra
  só a medalha, sem ilustração, e registra `console.warn` uma vez.

- [ ] **Passo 1: instalar e ler a skill.** Rode
  `npx skills add diffusionstudio/lottie@text-to-lottie -g -y` e leia o
  `SKILL.md` instalado antes de usar.
- [ ] **Passo 2: escrever os testes que falham:**
  - em `illustrationPlayback.test.ts`, os quatro casos das regras pinadas, como
    tabela: `done` e `next` sem redução dão `animate`; `reducedMotion` dá
    `still`; `locked` dá `silhouette`; `frame` nunca é 0;
  - em `ThemeIllustration.test.tsx`, com `jest.mock('@shopify/react-native-skia')`
    expondo `Skia.Skottie.Make` controlável:
    - `asset ausente mostra só a medalha e avisa uma vez`;
    - `JSON inválido mostra só a medalha e avisa uma vez`;
    - `é decorativa para o leitor de tela`.
- [ ] **Passo 3: ver falhar** com
  `npx jest src/ui/illustrations`. Esperado: o módulo não existe.
- [ ] **Passo 4: implementar `resolvePlayback` e `ThemeIllustration`.**
  `Skia.Skottie.Make` roda em `useMemo` por tema. O quadro animado é um
  `useSharedValue` com `withRepeat(withTiming(...))`, que para quando o
  componente sai da tela (`useScreenFocused`).
- [ ] **Passo 5: produzir o tubo.** Desenhe o SVG a partir do `IL.tube` da
  prancheta, com as mesmas formas e cores. Gere o Lottie pela skill com estas
  medidas:
  - 120 × 120, 60 fps, laço de 144 quadros (2,4 s);
  - feixe pulsando de 18% a 85% de opacidade;
  - três fótons descendo;
  - anodo piscando;
  - `meta.posterFrame` 60;
  - no máximo 12 camadas e 30 KB.
- [ ] **Passo 6: ver passar** com `npx jest src/ui/illustrations`.
- [ ] **Passo 7: build local do dev client.** Rode `npx expo run:ios` no
  simulador `E262D4C1` e abra a história do tubo no Storybook. Confira os três
  estados e "reduzir movimento" (Ajustes → Acessibilidade). Guarde as capturas
  como evidência.
- [ ] **Passo 8: registrar.** Gate, Loop e
  `git commit -m "feat(ui): Skia com Skottie e a ilustração do tubo"`.

### Tarefa 6: As outras quatro ilustrações

**Arquivos:**
- Criar: `radiant-app/assets/illustrations/src/{radiacao,tomografia,protecao,ressonancia}.svg`
  e os JSON correspondentes
- Modificar: `illustrationAssets` em `ThemeIllustration.tsx` e a história

**Movimentos pinados**, da prancheta, com o mesmo formato da tarefa 5:

| Tema | Movimento |
| --- | --- |
| `radiacao` | três elétrons em órbitas a 0°, 60° e −60°, de 2,6, 3,1 e 2,8 s |
| `tomografia` | ponto de luz girando no túnel em 6 s, faixa de status piscando e leve flutuação de 2,5 pt |
| `protecao` | avental com o trevo; brilho que atravessa em diagonal a cada 3 s |
| `ressonancia` | luz de status piscando; anéis pulsando para fora do túnel |

- [ ] **Passo 1: escrever o teste que falha** em
  `ThemeIllustration.test.tsx`, `todo tema tem asset`: as cinco chaves de
  `IllustrationTheme` existem em `illustrationAssets`.
- [ ] **Passo 2: ver falhar.** Faltam quatro.
- [ ] **Passo 3: produzir as quatro** pela skill, a partir dos SVGs. Confira cada
  uma na história do Storybook nos três estados.
- [ ] **Passo 4: ver passar** e somar o tamanho dos cinco JSON. Esperado: no
  máximo 150 KB.
- [ ] **Passo 5: registrar.** Gate, Loop e
  `git commit -m "feat(ui): ilustrações de radiação, tomografia, proteção e ressonância"`.

### Tarefa 7: DESIGN.md novo, medição no aparelho e evidência

**Arquivos:**
- Reescrever: `docs/DESIGN.md`, com o mundo Medalhão no mesmo formato e no
  mesmo cabeçalho YAML de hoje (`colors`, `typography`), feito pelo comando
  `document` da skill impeccable a partir dos tokens novos. Sai o "céu
  navegável", e as regras que continuam são reescritas:
  - Regra do Azul que Não Brilha;
  - Regra da Cor Muda;
  - Regra do Sinal Proporcional.
- Modificar: o comentário de cabeçalho do
  `radiant-app/scripts/identity-palette-contract.test.mjs`, que passa a citar a
  ADR de 2026-10-21. A regra que o teste protege não muda.
- Criar: `docs/evidence/2026-10-XX-fundacao-medalhao.md`, com a data da medição
  no nome
- Modificar: `docs/FILA.md`, no item 67, com o estado do plano 1

- [ ] **Passo 1:** escreva o DESIGN.md e confira que nenhum valor dele difere
  da tabela "Valores da paleta". Compare o YAML com os tokens por script, não a
  olho.
- [ ] **Passo 2: medir no AVD `radiant-entrada-api34`.** Rode a Home e Estude
  com as cinco ilustrações visíveis, usando o medidor do G6 (PR #59). Esperado:
  rolagem sem quadro acima de 32 ms em mais de 5% do tempo. Se passar disso, a
  ilustração fora do centro da tela fica parada, e a evidência registra o
  número.
- [ ] **Passo 3: capturar no simulador iOS e no AVD** a Home, Estude, Perfil, o
  HUD e a barra de abas, com texto padrão e com o maior. Leia o contraste das
  composições na captura: texto sobre ouro, sobre azul e sobre as superfícies
  de retorno.
- [ ] **Passo 4: gate do dono.** Mostre as cinco ilustrações e as capturas ao
  dono e registre a resposta na evidência. Um "refazer" volta à tarefa 5 ou 6.
- [ ] **Passo 5: registrar.** Gate, Loop e
  `git commit -m "docs: DESIGN.md do Medalhão e evidência da fundação"`. Faça o
  push e abra a PR do plano 1 contra a `main`.

---

**Fora deste plano, de propósito:**
- trilha, aula, retirada e as demais telas, que são os planos 2 a 5;
- o renome de `StarfieldBackground` e de `galaxyColors`, que fica para o plano 5;
- qualquer build de loja.

Conferido em 2026-10-21: nenhum texto ao aluno promete o que fica de fora.
