# Pixel no Medalhão — plano de implementação (plano 6)

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development
> (recomendada) ou superpowers:executing-plans, tarefa por tarefa. Os passos
> usam caixas (`- [ ]`) para acompanhamento.

**Objetivo:** trocar o render 3D do Pixel pelo desenho vetorial em três tons
aprovado em 2026-10-21, com poses e uma variante só de cabeça. O personagem, o
rosto e as sete expressões ficam como estão.

**Arquitetura:**
- **O corpo vira SVG** (`PixelBody`) desenhado numa caixa de 576 × 864, a mesma
  do PNG de hoje. Por isso `PIXEL_SCREEN`, `PixelFace` e os dois contratos de
  geometria continuam valendo, e só o que eles medem muda de fonte.
- **A cabeça é uma janela sobre a mesma caixa.** `PixelIllustration` com
  `variant="head"` recorta a caixa inteira em vez de redesenhar. O `PixelFace`
  recebe as mesmas `imageWidth` e `imageHeight` da caixa inteira e não muda.
- **Pose sai do estado.** Quem chama continua passando `state`; o mapa
  `poseForState` escolhe os braços.

**Pilha:** Expo SDK 54, React Native 0.81, `react-native-svg` 15.12 e
Reanimated 4.1, todos já no app. Nenhuma dependência nova.

**Spec:** [seção 11 da spec](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#11-adendo-de-2026-10-21-à-noite-o-pixel-e-o-app-inteiro-sem-cara-de-ia) ·
[prancheta do Pixel](../../design/2026-10-21-pixel-medalhao.html) ·
[ADR, decisão 8](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md#adendo-de-2026-10-21-à-noite) ·
[DESIGN.md, seção Pixel](../../DESIGN.md) ·
[índice](2026-10-21-trilha-medalhao-indice.md).

**Depende de:** plano 1 (fundação), na branch `claude/trilha-medalhao-design`.

## Restrições globais

As do [plano 1](2026-10-21-fundacao-visual-medalhao.md#restrições-globais)
valem todas: Node 20 para app e testes, Node 24 só para o `loop`; gate
`EXPO_NO_DOTENV=1 npm run quality`; um run do Loop por tarefa; Sora; nenhuma
build de loja. E mais:

- **A geometria do rosto é contrato:** a tela fica em x 168, y 200, 168 × 112,
  numa caixa de 576 × 864, com tolerância de ±6 nas quatro medidas, como o
  `pixel-screen-geometry-contract` exige hoje.
- **Cores só por `pixelColors`**, criado em `src/ui/theme.ts` com os valores
  `pixel-*` do DESIGN.md. Nenhum hex no arquivo do desenho.
- **Sem halo, partícula, grade nem painel holográfico** (A Regra Sem Cara de
  IA).
- **Movimento:** flutuar 10 unidades da caixa em 3,2 s com `Easing.inOut(Easing.quad)`;
  acenar ±14° em 1,6 s em volta do ombro (360, 408). Com "reduzir movimento",
  nada se move e a pose fica.
- **A exceção R4 de `src/ui/characters/**` vencia em 2026-10-23** no
  `scripts/visual-qa-policy.json`, e a PR #67 a renova para 2026-11-30. Se ela já tiver vencido quando este plano
  rodar, o gate reprova em qualquer tarefa que toque `src/ui/characters/`.
  Ver o foco 5 abaixo.

## Valores de `pixelColors`

| Chave | Base | Sombra | Luz |
| --- | --- | --- | --- |
| `coat` | `#EEF2F9` | `#C3CDE0` | `#FFFFFF` |
| `blue` | `#6FB2FF` | `#3F86E8` | `#A9D2FF` |
| `visor` | `#0E1A3D` | — | `#24366B` |
| `metal` | `#D6DDEA` | `#9AA6BF` | — |
| `stethoscope` | `#1F2B57` | — | — |
| `glow` | `#5CF0FF` | — | — |

Os caminhos e coordenadas de cada peça estão no `<script>` da prancheta, nas
funções `pixel()`, `head()`, `sleeve()`, `hand()` e no objeto `ARMS`. São a
fonte do desenho: copie as coordenadas, não as redesenhe.

## Foco da revisão

1. **Rosto fora da tela.** Trocar a fonte do corpo é exatamente o tipo de
   mudança que já pôs os olhos uma cabeça acima (2026-08-11). O contrato de
   geometria passa a ler o SVG, e o rosto é conferido no simulador nos três
   tamanhos e na cabeça. Tarefas 1 e 3.
2. **Cabeça em tamanho pequeno.** A 48 pt ao lado da medalha, o rosto precisa
   continuar legível e dentro do recorte. Teste na tarefa 3, captura na tarefa 4.
3. **Leitor de tela.** O corpo é decorativo; o rótulo continua um só, no frame
   ("Mascote Pixel"), e o aceno não gera anúncio. Tarefa 3.
4. **"Reduzir movimento".** Nem flutuar, nem acenar, nem piscar; a pose do
   estado fica. Tarefas 2 e 3.
5. **Exceção R4 vencida.** Se o prazo do registro passou, a tarefa 0 renova o prazo com
   motivo e dono antes de qualquer outra coisa. Tarefa 0.

---

### Tarefa 0: Conferir o prazo da exceção R4

**Arquivos:**
- Modificar, só se o prazo tiver passado: `radiant-app/scripts/visual-qa-policy.json`

- [ ] **Passo 1: Ler a data de hoje e o prazo**

Run: `date +%F; grep -n -B2 -A3 '"src/ui/characters/\*\*"' radiant-app/scripts/visual-qa-policy.json`
Expected: a data de hoje e o registro R4 de `src/ui/characters/**` com o `expiresOn`.

- [ ] **Passo 2: Renovar só se venceu**

Se a data de hoje for posterior ao `expiresOn`, troque o prazo desse registro
para o fim do plano 5 mais 14 dias e o `reason` para "Primitivas de personagem
donas do próprio laço; revisitar no fim do plano 5 (FILA 67)". Não toque os
outros 22 registros: eles são do plano 5.

- [ ] **Passo 3: Rodar o visual QA**

Run: `cd radiant-app && npm run visual:qa:strict`
Expected: termina com código 0.

- [ ] **Passo 4: Commit, se mudou**

```bash
git add radiant-app/scripts/visual-qa-policy.json
git commit -m "chore(qa): renova a exceção R4 dos personagens até o fim do plano 5"
```

### Tarefa 1: `pixelColors` e o corpo vetorial

**Arquivos:**
- Modificar: `radiant-app/src/ui/theme.ts`, com o export `pixelColors`
- Criar: `radiant-app/src/ui/characters/pixelPoses.ts`
- Criar: `radiant-app/src/ui/characters/PixelBody.tsx`
- Criar: `radiant-app/src/ui/characters/PixelBody.test.tsx`
- Modificar: `radiant-app/scripts/pixel-screen-geometry-contract.test.mjs`, que
  passa a ler `PixelBody.tsx` em vez do PNG

**Interfaces:**
- Produz:
  - `pixelColors: { coat: { base: string; shade: string; light: string }; blue: { base: string; shade: string; light: string }; visor: { base: string; light: string }; metal: { base: string; shade: string }; stethoscope: string; glow: string }`;
  - `type PixelPose = 'acena' | 'aponta' | 'comemora' | 'pensa' | 'repouso'`;
  - `type PixelArm = { sleeve: [x1: number, y1: number, x2: number, y2: number]; hand: { x: number; y: number; rotate: number } }`;
  - `PIXEL_ARMS: Record<PixelPose, { left: PixelArm; right: PixelArm }>`, com os
    números de `ARMS` da prancheta;
  - `poseForState(state: CharacterState): PixelPose`, com `idle → repouso`,
    `guide → aponta`, `thinking → pensa`, `happy → acena`,
    `celebrate → comemora` e `oops → repouso`;
  - `PIXEL_VIEWBOX = { width: 576, height: 864 } as const`;
  - `PIXEL_SCREEN_RECT = { x: 168, y: 200, width: 168, height: 112 } as const`;
  - `PIXEL_HEAD_WINDOW = { x: 84, y: 56, width: 344, height: 330 } as const`;
  - `PixelBody(props: { pose: PixelPose; width: number; height: number; waving?: boolean }): React.ReactElement`,
    um `<Svg viewBox="0 0 576 864">` com sombra, base, braços, jaleco, camisa,
    lapelas, bolsos, estetoscópio, pescoço, antena, orelhas, cabeça e a tela
    escura com o crescente de luz. **Sem rosto:** o rosto continua com o
    `PixelFace`.

- [ ] **Passo 1: Escrever os testes que falham**

Em `PixelBody.test.tsx`:
- `poseForState` devolve as seis correspondências da interface;
- `PixelBody` renderiza um `Rect` com `x=168`, `y=200`, `width=168`,
  `height=112` e `fill=pixelColors.visor.base`;
- `PixelBody` com `pose="comemora"` e com `pose="repouso"` produzem braços
  diferentes: o atributo `d` do primeiro `Path` de manga difere;
- nenhum filho tem `fill` ou `stroke` fora dos valores de `pixelColors` e do
  preto da sombra (percorra a árvore com `UNSAFE_queryAllByType`).

No contrato `pixel-screen-geometry-contract.test.mjs`, troque a leitura do PNG
por: ler `PixelBody.tsx`, extrair `PIXEL_VIEWBOX` e `PIXEL_SCREEN_RECT` por AST
(o mesmo `resolveNode` usado em `contrast-contract.test.mjs`) e manter as
asserções de hoje: largura 576, altura 864 e cada fração de `PIXEL_SCREEN`
dentro de ±6 da medida do retângulo.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/ui/characters/PixelBody.test.tsx && npm run test:pixel-screen-geometry-contract`
Expected: o jest falha com "Cannot find module './PixelBody'"; o contrato falha
porque `PixelBody.tsx` não existe.

- [ ] **Passo 3: Implementar `pixelColors`, `pixelPoses.ts` e `PixelBody.tsx`**

Traduza as funções da prancheta para elementos de `react-native-svg`: cada
`<path>`, `<rect>`, `<circle>` e `<ellipse>` vira o componente do mesmo nome,
com as mesmas coordenadas. Cada manga são três `Path` com traço arredondado:
base, sombra deslocada (+10, +14) e luz deslocada (−12, −8). O braço direito
fica num `G` próprio, que a tarefa 2 anima.

- [ ] **Passo 4: Ver passar**

Run: `cd radiant-app && npx jest src/ui/characters/PixelBody.test.tsx && npm run test:pixel-screen-geometry-contract`
Expected: PASS nos dois.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/ui/theme.ts radiant-app/src/ui/characters/pixelPoses.ts radiant-app/src/ui/characters/PixelBody.tsx radiant-app/src/ui/characters/PixelBody.test.tsx radiant-app/scripts/pixel-screen-geometry-contract.test.mjs
git commit -m "feat(pixel): corpo vetorial em três tons, com poses"
```

### Tarefa 2: Aceno, flutuação e o brilho do rosto

**Arquivos:**
- Modificar: `radiant-app/src/ui/characters/PixelBody.tsx`
- Modificar: `radiant-app/src/ui/characters/pixelExpressions.ts`, com
  `glow: pixelColors.glow` nas sete expressões
- Testar: `radiant-app/src/ui/characters/PixelBody.test.tsx` e
  `radiant-app/src/ui/characters/pixelExpressions.test.ts`

**Interfaces:**
- Consome: `PixelBody` e `PIXEL_ARMS` da tarefa 1.
- Produz: `PixelBody` com `waving` animando o `G` do braço direito por
  `Animated.createAnimatedComponent(G)` e `useAnimatedProps`, com `rotation`
  entre 0 e −14, `originX: 360` e `originY: 408`.

- [ ] **Passo 1: Escrever os testes que falham**

- com `waving` e "reduzir movimento" ligado (o mock de
  `useReducedMotionPreference` que os testes de `PixelFace` já usam), o `G`
  do braço tem `rotation` 0 e nenhum `withRepeat` é agendado;
- com `waving` e o movimento ligado, `withRepeat` é chamado uma vez com
  duração total de 1600 ms (espione `withTiming`);
- as sete expressões têm `glow === pixelColors.glow`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/ui/characters`
Expected: FAIL nas três asserções novas.

- [ ] **Passo 3: Implementar**

O aceno só existe quando `pose === 'acena'` e `waving` é verdadeiro. A curva é
`Easing.inOut(Easing.quad)`, a mesma do respirar que `PixelIllustration` já
usa; o `reanimated-easing-contract` exige curva declarada.

- [ ] **Passo 4: Ver passar**

Run: `cd radiant-app && npx jest src/ui/characters && npm run test:reanimated-easing-contract`
Expected: PASS.

- [ ] **Passo 5: Commit**

```bash
git add radiant-app/src/ui/characters/PixelBody.tsx radiant-app/src/ui/characters/pixelExpressions.ts radiant-app/src/ui/characters/PixelBody.test.tsx radiant-app/src/ui/characters/pixelExpressions.test.ts
git commit -m "feat(pixel): aceno e rosto ciano, parados com reduzir movimento"
```

### Tarefa 3: `PixelIllustration` com o corpo novo e a variante cabeça

**Arquivos:**
- Modificar: `radiant-app/src/ui/characters/PixelIllustration.tsx`
- Remover: `radiant-app/src/ui/characters/pixelAssets.ts`
- Modificar: `radiant-app/src/ui/characters/assets/pixel/README.md`, dizendo
  que os PNGs ficam só como referência histórica e não entram no app
- Modificar: `radiant-app/src/ui/characters/pixelScreenGeometry.ts`, no
  comentário de origem da medida (o SVG, não mais o PNG)
- Modificar: `radiant-app/scripts/pixel-face-anchor-contract.test.mjs`, segundo
  teste
- Testar: `radiant-app/src/ui/characters/PixelIllustration.test.tsx` (criar)

**Interfaces:**
- Consome: `PixelBody`, `poseForState` e `PIXEL_HEAD_WINDOW`.
- Produz: `PixelIllustration` com a prop nova `variant?: 'full' | 'head'`
  (padrão `'full'`) e o export `PIXEL_HEAD_SIZE_MAP: Record<CharacterSize, number>`
  com `sm: 48`, `md: 64`, `lg: 96`. As props de hoje (`state`, `size`, `tier`,
  `accessibilityLabel`, `expression`) continuam com o mesmo significado; `tier`
  deixa de mudar o visual.

- [ ] **Passo 1: Escrever os testes que falham**

- não há `Image` do `expo-image` na árvore, e há um `PixelBody` com
  `pose="aponta"` quando `state="guide"`;
- não há halo, grade, painel nem partícula: nenhuma `View` com
  `borderRadius: 999` além do frame;
- `variant="head"` com `size="sm"`: o frame mede 48 × 46 (48 × 330 / 344,
  arredondado), tem `overflow: 'hidden'`, e o `PixelFace` recebe
  `imageWidth = 48 × 576 / 344` e `imageHeight = 48 × 864 / 344`, com a caixa
  deslocada em `left = −84 × 48 / 344` e `top = −56 × 48 / 344`;
- o rótulo de acessibilidade aparece uma vez, no frame, e o `PixelBody` tem
  `importantForAccessibility="no-hide-descendants"`.

No `pixel-face-anchor-contract`, o segundo teste passa a exigir
`<PixelBody` e `<PixelFace` recebendo as mesmas `width`/`imageWidth` e
`height`/`imageHeight`, e deixa de exigir `<Image`.

- [ ] **Passo 2: Ver falhar**

Run: `cd radiant-app && npx jest src/ui/characters/PixelIllustration.test.tsx && npm run test:pixel-face-anchor-contract`
Expected: FAIL.

- [ ] **Passo 3: Implementar**

Troque `Image` por `PixelBody` dentro da mesma `imageBox`. Apague
`STATE_SPECS`, os halos, a grade, o painel e as partículas. Mantenha os laços
de hoje por estado só como flutuação: amplitude `−10 × imageHeight / 864`,
3,2 s por volta, em todos os estados; `celebrate` e `oops` deixam de pulsar e
de tremer. `waving` vai verdadeiro quando `state === 'happy'`.

- [ ] **Passo 4: Ver passar, com o gate**

Run: `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`
Expected: código 0. Os testes de tela que montam o Pixel (`HomeScreen`,
`JourneyHomeScreen`, `ReviewScreen`, `QuizFeedback`, `LessonSummary`,
`WelcomeSlide`) continuam passando sem mudança, porque a API não mudou.

- [ ] **Passo 5: Commit**

```bash
git add -A radiant-app/src/ui/characters radiant-app/scripts/pixel-face-anchor-contract.test.mjs
git commit -m "feat(pixel): PixelIllustration desenha o corpo vetorial e ganha a variante cabeça"
```

### Tarefa 4: Conferência no simulador e evidência

**Arquivos:**
- Criar: `docs/evidence/2026-10-21-pixel-medalhao.md` (use a data do dia da
  execução no nome), com as capturas em `docs/evidence/2026-10-21-pixel-medalhao/`

- [ ] **Passo 1: Enumerar onde o Pixel aparece**

Objetivo: toda tela que monta `PixelIllustration` ou `PixelHeroSplit`.
Critério de completude: duas buscas por convenções diferentes (o nome do
componente e o import de `ui/characters`) e uma contagem que você consiga
defender. Em 2026-10-21 eram nove arquivos de produção:
`HomeScreen`, `CheckpointScreen`, `RewardScreen`, `QuizFeedback`,
`LessonSummary`, `JourneyHomeScreen`, `ReviewScreen`, `WelcomeSlide`,
`HybridLessonCharacter`, mais `PixelHeroSplit` e `SpeechBubble`.

- [ ] **Passo 2: Capturar cada uma no simulador iOS**

Cada captura mostra o rosto dentro da tela escura. Abra pelos deep links
`radiantapp://checkpoint`, `review` e `reward`, e pelo fluxo para o resto.
Capture também uma tela com "reduzir movimento" ligado.

- [ ] **Passo 3: Escrever a evidência**

Uma linha por tela: o arquivo, o tamanho, a pose que apareceu e o caminho da
captura. Liste à parte o que ficou estranho para o dono olhar, sem consertar
aqui o que for do plano 5 (por exemplo, o Pixel que ainda sobra na revisão).

- [ ] **Passo 4: Commit**

```bash
git add docs/evidence/
git commit -m "docs(pixel): evidência do Pixel vetorial no simulador"
```

---

## Registro de execução (2026-10-21 e 22)

**Estado: concluído e revisado.** Executado com subagentes: um implementador e
um revisor por tarefa, e uma revisão final do plano no modelo mais capaz.
Commits em `claude/trilha-medalhao-design`:

| Tarefa | Commits | Observação |
| --- | --- | --- |
| 0 | `4201ac4` | o mesmo conteúdo da PR #67 (prazos do visual QA até 2026-11-30), trazido para a branch; as duas PRs mergeiam sem conflito |
| 1 | `3390c99` | `pixelColors`, `PixelBody`, `pixelPoses`; os helpers de AST saíram do `contrast-contract` para `scripts/ast-helpers.mjs` |
| 2 | `f29d83b` | aceno e rosto ciano |
| 3 | `3fd2eb8` | `PixelIllustration` com o corpo vetorial e a variante cabeça; o escopo foi ampliado a `LessonSummary.test.tsx` e `JourneyHomeScreen.flow.test.tsx`, que esperavam o PNG |
| 4 | `9bfd734`, `79afc03` | [evidência](../../evidence/2026-10-21-pixel-medalhao.md), feita pelo controlador porque o simulador estava na sessão dele |
| correção da revisão final | `a294d97` | ver abaixo |

**Decisões que mudam o texto do plano:**
- O aceno anima a prop nativa `matrix` do grupo SVG, e não `rotation`,
  `originX` e `originY`. O `RNSVGGroup` nativo ignora as três, e no aparelho o
  braço ficava parado. A matriz é a rotação em torno de (360, 408). Os testes
  verificam a `matrix`, porque o mock do Reanimated esconde a diferença.
- A variante cabeça usa sempre a pose `repouso` e nunca acena. Com a pose do
  estado, apareciam pedaços de braço no recorte.
- A flutuação é do frame inteiro (corpo e rosto juntos), e não de um grupo do
  SVG. O `G testID="pixel-float"` saiu.
- `PixelBody.tsx` entrou na lista do `reanimated-easing-contract`.

**Pendências:**
- **Captura da cabeça a 48 pt:** passou para a tarefa 7 do plano 2, a primeira
  tela que usa a cabeça.
- **Para o plano 5:** o `HybridLessonCharacter` troca de pose sob "reduzir
  movimento" (resto da lógica antiga de pulsar).
- **Para o dono:** o Pixel agora é uma parada do VoiceOver (frame `accessible`,
  com papel de imagem); antes, provavelmente não era.
- **Menores que ficam:**
  - a sombra do chão usa `'black'` sem token e sobe junto com a flutuação (na
    prancheta, fica no chão e pulsa);
  - mangas sem `fill="none"` explícito;
  - literais repetidos nos testes;
  - o contrato de âncora compara só o nome das props;
  - três assinaturas de "reduzir movimento" por Pixel.
