---
name: Radiant
description: Sistema visual do treinador diário de raciocínio radiológico — mundo Medalhão, com grafite liso, peças com relevo, ilustração em três tons e tipografia Sora
colors:
  graphite: "#13151c"
  graphite-alt: "#171920"
  surface: "#1b1e27"
  surface-active: "#232733"
  surface-muted: "#2a2e3a"
  border: "#323747"
  border-active: "#4a5166"
  text-primary: "#eef0f6"
  text-secondary: "#a3aabb"
  text-tertiary: "#8f97a9"
  tab-inactive: "#8a91a3"
  ink-on-accent: "#FFFFFF"
  action-primary: "#2559E6"
  action-primary-pressed: "#1846C9"
  contrast-blue: "#2155FF"
  nav-blue: "#4A9EFF"
  signal-cyan: "#3DCAE8"
  medal-gold-face: "#FFC21A"
  medal-gold-lip: "#C98A00"
  medal-gold-inner: "#F2AE00"
  medal-unit-face: "#2F6BFF"
  medal-unit-lip: "#1846C9"
  medal-unit-inner: "#275CEB"
  medal-locked-face: "#343947"
  medal-locked-lip: "#22252f"
  medal-locked-inner: "#2d313d"
  medal-locked-silhouette: "#4B5163"
  success-fill: "#2BD67B"
  success-lip: "#1A9E58"
  success-surface: "#14281f"
  success-on-fill: "#0b2a18"
  error-fill: "#FF8298"
  error-lip: "#C9566B"
  error-surface: "#2c1820"
  error-on-fill: "#3a0d17"
  xp-amber: "#F5A623"
  streak-ember: "#FF6B2C"
  heart-full: "#FF3B30"
  bolt-face: "#FFC21A"
  bolt-light: "#FFE07A"
  bolt-shade: "#E59A00"
  flame-core: "#FFC21A"
  heart-face: "#FF4B4B"
  heart-shade: "#D92F3A"
  heart-highlight: "#FFB3B3"
typography:
  display:
    fontFamily: "Sora-ExtraBold"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "46px"
    letterSpacing: "-1px"
  headline:
    fontFamily: "Sora-ExtraBold"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "38px"
    letterSpacing: "-0.6px"
  title:
    fontFamily: "Sora-Bold"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "30px"
    letterSpacing: "-0.4px"
  body:
    fontFamily: "Sora-SemiBold"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  label:
    fontFamily: "Sora-Bold"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: "14px"
    letterSpacing: "1px"
  button:
    fontFamily: "Sora-ExtraBold"
    fontSize: "16px"
    letterSpacing: "-0.1px"
rounded:
  rSm: "8px"
  rMd: "12px"
  rLg: "16px"
  rXl: "20px"
  button: "18px"
spacing:
  s0: "4px"
  s1: "8px"
  s2: "12px"
  s3: "16px"
  s4: "20px"
  s5: "24px"
  s6: "32px"
depth:
  lip: "5px"
  medal-lip: "8px"
components:
  button-galaxy:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.ink-on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 24px"
    height: "56px"
  button-galaxy-lip:
    backgroundColor: "{colors.medal-unit-lip}"
    rounded: "{rounded.button}"
    height: "{depth.lip}"
  button-primary:
    backgroundColor: "{colors.contrast-blue}"
    textColor: "{colors.ink-on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 24px"
    height: "56px"
  button-secondary-lip:
    backgroundColor: "{colors.graphite-alt}"
    rounded: "{rounded.button}"
    height: "{depth.lip}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.nav-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "8px 24px"
  button-success:
    backgroundColor: "{colors.success-fill}"
    textColor: "{colors.success-on-fill}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
  button-success-lip:
    backgroundColor: "{colors.success-lip}"
    height: "{depth.lip}"
  button-error:
    backgroundColor: "{colors.error-fill}"
    textColor: "{colors.error-on-fill}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
  button-error-lip:
    backgroundColor: "{colors.error-lip}"
    height: "{depth.lip}"
  feedback-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.success-fill}"
  feedback-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.error-fill}"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.rLg}"
    padding: "16px"
  card-elevated:
    backgroundColor: "{colors.surface-active}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.rLg}"
    padding: "16px"
  hud-pill:
    backgroundColor: "{colors.surface-active}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.rXl}"
    padding: "5px 10px"
  tab-bar:
    backgroundColor: "{colors.graphite-alt}"
    textColor: "{colors.tab-inactive}"
    rounded: "{rounded.rXl}"
    height: "72px"
  tab-bar-active:
    textColor: "{colors.text-primary}"
  medal-done:
    backgroundColor: "{colors.medal-gold-face}"
  medal-next:
    backgroundColor: "{colors.medal-unit-face}"
  medal-locked:
    backgroundColor: "{colors.medal-locked-face}"
    textColor: "{colors.medal-locked-silhouette}"
---

# Design System: Radiant

Reescrito em 2026-10-21, no fim do plano 1 da trilha Medalhão. Substitui o
"céu navegável" de 2026-07-27, pela
[ADR de 2026-10-21](adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md).
Os valores do cabeçalho foram comparados por script com `src/ui/theme.ts`,
`src/ui/semantic-colors.ts`, `src/ui/styles.ts` e o `AppButton`
([evidência](evidence/2026-10-21-fundacao-medalhao.md)). A fonte operacional
continua sendo o código: se este arquivo e um token discordarem, o token vence,
e este arquivo está errado.

## 1. Overview

**Creative North Star: "O Medalhão"**

Cada passo do aluno é uma peça cunhada. A medalha tem face, lábio e miolo, e o
relevo vem de um lábio sólido por baixo, não de sombra. A luz vem sempre de
cima e da esquerda, na medalha, no botão e na ilustração. O fundo é um grafite
liso, como o veludo de uma vitrine: não compete com as peças e deixa o ouro e o
azul lerem como metal.

O que conta o progresso é o estado da peça. Ouro é concluída, azul da unidade é
a próxima, e grafite com silhueta é bloqueada. A ilustração do tema da aula
(tubo, radiação, tomografia, proteção, ressonância) vive dentro da medalha e só
se move nas peças desbloqueadas.

O sistema rejeita duas coisas por escrito:
- o **dashboard hospitalar**, com prontuário, tabela densa em cinza e densidade
  de software usado por obrigação. O Radiant é aberto por escolha, todo dia;
- o **template de IA**, com gradiente genérico, brilho sem fonte de luz e ícone
  de biblioteca. Foi esse o motivo de o dono rejeitar a primeira versão do
  Medalhão: "muita cara de IA".

**Key Characteristics:**
- Fundo grafite opaco (`#13151c`) e uma escada de cinco superfícies opacas
- Relevo por lábio sólido: 5 pt no botão e 8 pt na medalha
- Ilustração em três tons, com luz de cima à esquerda, em Lottie tocado pelo Skia
- Ícones desenhados em SVG, nunca emoji nem caractere de texto
- Uma família tipográfica (Sora) em cinco papéis, mais o rótulo de botão
- Movimento só nas peças desbloqueadas, sempre com quadro parado sob "reduzir movimento"

## 2. Colors

Grafite neutro, dois metais (ouro e azul da unidade), um azul de ação e dois
pares de retorno (acerto e erro). Cada cor de peça vem em três tons: face,
lábio e miolo.

### Primary
- **Azul de Ação** (`#2559E6`): a ação principal da tela, no `AppButton`
  `galaxy`. Texto branco sobre ele mede **5,75:1**. A prancheta pedia
  `#2F6BFF`, mas o branco ali dá 4,50:1, no limite, e o valor foi escurecido
  em 2026-10-21. O lábio é `#1846C9`, o mesmo do azul da unidade.
- **Azul de Contraste** (`#2155FF`): a variante `primary` do `AppButton`, que
  é a padrão. Branco sobre ele mede 5,51:1. É superfície, nunca texto: sobre o
  grafite mede **3,31:1** e reprova.

### Secondary
- **Ouro da Medalha** (face `#FFC21A`, lábio `#C98A00`, miolo `#F2AE00`): a
  peça concluída. O raio do XP usa a mesma face. Nenhum texto é pintado sobre o
  ouro hoje; se um dia for, o texto é grafite (`#13151c` sobre `#FFC21A` dá
  11,27:1), nunca branco.
- **Azul da Unidade** (face `#2F6BFF`, lábio `#1846C9`, miolo `#275CEB`): a
  peça seguinte e o ícone da aba ativa. Não recebe texto por cima.

### Tertiary
- **Âmbar de XP** (`#F5A623`), **Brasa de Sequência** (`#FF6B2C`) e
  **Vermelho de Vida** (`#FF3B30`): as moedas do HUD, sempre com ícone e número.
  Sobre a pílula do HUD (`#232733`), o âmbar mede 7,35:1 e a brasa 5,24:1.
- **Tons dos ícones do HUD** (`hudIconTones`): raio `#FFC21A` / `#FFE07A` /
  `#E59A00`, miolo da chama `#FFC21A`, coração `#FF4B4B` / `#D92F3A` /
  `#FFB3B3`. São desenho, não texto.
- **Verde de Acerto** (preenchimento `#2BD67B`, lábio `#1A9E58`, superfície
  `#14281f`) e **Rosa de Erro** (`#FF8298`, `#C9566B`, `#2c1820`): o retorno da
  resposta. O texto sobre o preenchimento é escuro, `#0b2a18` (8,10:1) e
  `#3a0d17` (7,12:1). O título na superfície usa o próprio preenchimento:
  8,14:1 e 7,07:1.

### Neutral
- **Grafite** (`#13151c`): o fundo de todas as telas. Texto principal sobre ele
  mede 16,00:1.
- **Escada de superfície**, do fundo para cima: `#171920` (fundo alternativo e
  barra de abas), `#1b1e27` (cartão), `#232733` (pílula do HUD, cartão
  destacado e estado pressionado), `#2a2e3a` (superfície apagada). Todas são
  **opacas**: quem lê uma delas lê a cor final, sem conta de transparência.
- **Bordas**: `#323747`, e `#4a5166` quando ativa.
- **Texto**: principal `#eef0f6`, secundário `#a3aabb` (7,15:1 no cartão) e
  terciário `#8f97a9` (5,68:1 no cartão).
- **Aba inativa** (`#8a91a3`): 5,57:1 sobre a barra. A prancheta dava
  `#6d7487`, que mede 3,76:1 e reprova no rótulo de 11 px.
- **Bloqueado** (face `#343947`, lábio `#22252f`, miolo `#2d313d`, silhueta
  `#4B5163`): a peça que ainda não abriu.
- **Azul de Navegação** (`#4A9EFF`): o foco (`borderFocus`). Mede 6,62:1 sobre
  o grafite.
- **Ciano de Sinal** (`#3DCAE8`): `statusInformation`, raro.

### Named Rules

**A Regra do Azul que Não Brilha.** Azul saturado é uma cor escura: quase todo
o seu brilho está no canal azul, que pesa 7,22% na luminância. Sobre o grafite,
o Azul de Contraste mede 3,31:1 e o Azul de Ação 3,17:1. Por isso o azul do
Medalhão é **superfície com texto branco por cima**, nunca texto nem estado
ativo pequeno sobre o grafite. A aba ativa usa o texto principal (`#eef0f6`,
15,41:1) contra o inativo (5,57:1), uma separação de 2,77 vezes, e o ícone dela
ganha os três tons da unidade. O foco usa o Azul de Navegação. Teste de um
segundo: se ativo e inativo tiverem contraste parecido, não existe estado ativo.

**A Regra das Duas Paletas.** O app tem **uma** identidade, e as telas consomem
só o contexto galaxy, por `galaxyColors`, `medalColors`, `feedbackColors` e
`semanticColors.galaxy`. A paleta clara `colors` vive em `src/ui` e em
`src/components/ui` para superfícies fora do produto. Importá-la em
`src/features/**` ou `src/app/**` é defeito: foi assim que texto pedagógico já
renderizou a 1,21:1. O `identity-palette-contract` barra as duas portas, o
`colors` e o `semanticColors.light`.

**A Regra da Cor Muda.** Cor nunca carrega informação sozinha. Cada estado tem
também forma, ícone ou texto:
- a peça concluída tem ouro **e** estrelas **e** a ilustração em movimento;
- a próxima tem o azul da unidade **e** o anel que pulsa;
- a bloqueada tem o grafite **e** a silhueta parada, sem luz;
- o retorno da resposta tem verde ou rosa **e** ícone **e** texto;
- vida, sequência e XP têm ícone desenhado **e** número.

## 3. Typography

**Display Font:** Sora (ExtraBold / Bold)
**Body Font:** Sora (SemiBold / Regular)
**Label Font:** Sora Bold em caixa alta

**Character:** uma família só. Sora é geométrica com terminações levemente
humanistas, técnica sem ser fria. A hierarquia vem de peso e corte, não de
troca de família: títulos grandes fecham o espacejamento (até −1 px), e o
rótulo em caixa alta abre para +1 px, porque maiúscula encosta.

### Hierarchy
- **Display** (ExtraBold, 40/46, −1): abertura de tela e número de celebração. Um por tela, no máximo.
- **Headline** (ExtraBold, 32/38, −0,6): título de seção maior e telas de resultado.
- **Title** (Bold, 24/30, −0,4): título de cartão e de bloco. É o papel mais usado.
- **Body** (SemiBold, 16/24): texto corrido, enunciado e alternativa. A variante Regular carrega parágrafo longo.
- **Label** (Bold, 11/14, +1, caixa alta): rótulo de métrica. Sempre ao lado do valor que nomeia.
- **Rótulo de botão** (ExtraBold, 16, −0,1): só no `AppButton`. Cresce com o texto do sistema até o teto de `LABEL_MAX_FONT_SCALE`, e o botão cresce junto.

### Named Rules

**A Regra da Escala Única.** Todo tamanho de texto vem de `typography.*`. Um
`fontSize` numérico literal em tela nova é defeito: ele costuma vir sem
`fontFamily`, e o texto sai em fonte de sistema sem ninguém perceber.

**A Regra do Rótulo Visível.** O rótulo de acessibilidade complementa o texto
visível, nunca o substitui. Se o significado de um número só existe em
`accessibilityLabel`, falta o rótulo visual.

## 4. Elevation & Depth

Profundidade é **relevo**, não sombra nem luz acumulada. Uma peça com relevo é
duas camadas: a face e, por baixo, um lábio sólido mais escuro que aparece só
na borda de baixo. O lábio mede 5 pt no botão e 8 pt na medalha
(`depth.lip` e `depth.medalLip`). Ao ser pressionada, a face desce 4 pt e
deixa 1 pt do lábio à vista, para o botão não parecer achatado.

As superfícies internas se separam por degrau da escada de grafite e por borda
de 1 px, nunca por sombra.

### Shadow Vocabulary
- **Flutuação** (`shadowRadius: 24`, `shadowOpacity: 0.5`, deslocamento 0/8,
  `elevation: 16`, cor `#000000`): a barra de abas, que flutua sobre o
  conteúdo. É o único uso de sombra.

### Named Rules

**A Regra do Lábio.** O relevo é um lábio sólido, nunca `shadow*` nem
`elevation`, que borram a borda e variam entre iOS e Android. **Na medalha**, o
lábio tem contraste mínimo de 1,2:1 com a face, e o `contrast-contract` cobra
esse piso só sobre `medalColors` (o ouro mede 1,82:1, a unidade 1,69:1 e o
bloqueado 1,33:1). **Nos botões, o piso não é cobrado.** Em 2026-10-21, os
lábios de `galaxy`, `primary`, `success` e `error` medem 1,32, 1,38, 1,81 e
1,77:1 [calculado]. O do `secondary` (`#171920` sob a face `#1b1e27`) mede
**1,05:1**, porque é o degrau seguinte da escada de neutros, e fica quase
invisível. Esse lábio está pendente de decisão do dono
([evidência, "Para o dono olhar"](evidence/2026-10-21-fundacao-medalhao.md#para-o-dono-olhar)).
O `ghost` não tem lábio, porque é texto sem superfície. Sob "reduzir
movimento", a face desce de uma vez, sem transição.

**A Regra da Luz de Cima à Esquerda.** Toda peça desenhada usa três tons: a
face, um tom claro no lado de cima e da esquerda, e um tom escuro no lado de
baixo e da direita. Vale para a medalha, os ícones do HUD, os ícones das abas e
as cinco ilustrações. Brilho sem fonte de luz é sinal de template.

## 5. Components

### Buttons
- **Forma:** raio de 18 px, altura mínima de 56 pt, padding de 8 × 24 pt e
  lábio de 5 pt por baixo. A altura é mínima, não fixa: com texto grande o
  rótulo quebra linha e o botão cresce.
- **`galaxy`:** Azul de Ação com rótulo branco e lábio `#1846C9`. É a ação
  principal das telas do produto.
- **`primary`** (padrão): Azul de Contraste com rótulo branco e o mesmo lábio.
- **`secondary`:** face `#1b1e27`, borda de 1 px em Azul de Navegação, rótulo no
  texto principal e lábio `#171920`. Alternativa da tela.
- **`ghost`:** sem face nem lábio; só o rótulo. Saída e "agora não".
- **`success` e `error`:** preenchimento de retorno com rótulo escuro e lábio
  do mesmo par.
- **Pressão:** a face desce 4 pt em `duration.micro`; sob "reduzir movimento",
  de uma vez.
- **Foco:** borda de 3 px em Azul de Navegação nas variantes escuras.
- **Desabilitado:** opacidade 0,45 no conjunto, face e lábio juntos. Na face
  sozinha, o lábio apareceria através dela.

### Cards / Containers
- **Cartão** (`SurfaceCard` `galaxy`): `#1b1e27`, borda de 1 px `#323747`,
  raio de 16 px e padding de 16 px.
- **Cartão destacado** (`galaxyElevated`): `#232733`, borda `#4a5166`.
- **Sem sombra:** ver Elevation & Depth.

### Navigation
Barra de abas flutuante, a 14 pt do rodapé e 16 pt das laterais, com raio de
20 px, altura de 72 pt e fundo `#171920`, com borda de cima `#323747`. São duas
abas, Estude e Perfil. A ativa pinta o rótulo no texto principal (`#eef0f6`) e
o ícone nos três tons da unidade; a inativa pinta os dois em `#8a91a3`. Toda
tela rolável reserva 102 pt de folga inferior (`tabBarClearance`).

### HUD (componente de assinatura)
Trilho de XP, sequência e vidas no topo das telas do produto. As pílulas são
`#232733` com borda `#323747` e raio de 20 px. Os ícones são desenhados em três
tons (raio, chama e coração), e cada pílula é lida pelo leitor de tela como um
nó só ("44 XP"). Vidas são cinco corações; o que se esvazia recebe o pulso de
perda, e o rótulo "3 de 5 vidas" continua informando sob "reduzir movimento".
Os ícones de XP e sequência medem 24 pt e os corações 28 pt.

### Medalha e ilustração de tema
- **Estados:** concluída em ouro, próxima no azul da unidade com anel que
  pulsa, bloqueada em grafite com a silhueta do tema.
- **Ilustração:** cinco temas, `tubo`, `radiacao`, `tomografia`, `protecao` e
  `ressonancia`. Cada um é um Lottie de 120 × 120 a 60 fps, tocado pelo Skottie
  do `@shopify/react-native-skia` 2.2.12, com laço de 2,4 s. O objeto pode
  passar da borda da medalha.
- **Bloqueada:** a mesma arte pintada inteira em `#4B5163` sobre `#343947`, e
  parada.
- **"Reduzir movimento":** a ilustração para no quadro de pose declarado em
  `meta.posterFrame` do JSON, e não no quadro 0, que pode estar vazio.
- **Arquivo ausente ou corrompido:** a medalha aparece sem ilustração e o erro
  vai para o log. A tela não quebra.
- **Leitor de tela:** a ilustração é decorativa; quem nomeia a peça é o nó.

Em 2026-10-21 a ilustração existe como componente (`ThemeIllustration`, com os
estados `done`, `next` e `locked`) e como história do Storybook [código]. A
trilha em zigue-zague que a usa, com o anel que pulsa, as estrelas e o caminho,
é o plano 2, desenhado na
[prancheta da trilha](design/2026-10-21-trilha-medalhao.html).

### Fundo
Grafite liso em toda tela, sem estrela, nebulosa nem gradiente. O componente
ainda se chama `StarfieldBackground` e aceita `starCount` e `variant` sem
efeito; o renome é do plano 5.

### Pixel
O Pixel continua mascote. A fala dele é opcional, breve e espaçada, e nunca
carrega instrução, erro ou próxima ação.

### Named Rules

**A Regra do Sinal Proporcional.** O sinal acompanha o peso do evento.
- Retorno tátil pertence só à ação principal da tela, as variantes `primary` e
  `galaxy`. Alternativa e saída respondem com o relevo, sem háptico. Quando
  tudo vibra, a vibração para de significar.
- Movimento pertence só ao que está aberto. A peça bloqueada fica parada, e só
  a próxima tem o anel que pulsa.

**A Regra da Silhueta.** O bloqueado mostra o que vem, e não o que é: só a
silhueta do tema, sem luz, sem cor da unidade e sem movimento. Opacidade global
no cartão é proibida, porque derruba junto o contraste do texto.

## 6. Do's and Don'ts

### Do:
- **Do** consumir cor por `galaxyColors`, `medalColors`, `feedbackColors`, `hudIconTones` e `semanticColors.galaxy`.
- **Do** pintar a aba ativa com o texto principal e o ícone com os três tons da unidade.
- **Do** medir contraste de **composição**: o par que importa é a cor final sobre a superfície final.
- **Do** dar a todo estado um segundo canal além da cor: ícone, forma ou texto.
- **Do** fazer relevo com lábio sólido de 5 pt no botão e 8 pt na medalha.
- **Do** desenhar peça e ícone em três tons, com a luz de cima à esquerda.
- **Do** parar a ilustração no quadro de pose sob "reduzir movimento".
- **Do** reservar 102 pt de folga inferior em toda tela rolável com barra de abas.
- **Do** separar superfícies internas por degrau da escada de grafite e borda de 1 px.

### Don't:
- **Don't** parecer um **dashboard hospitalar**: prontuário, tabela densa em cinza, densidade de software de uso obrigatório.
- **Don't** parecer **template de IA**: gradiente genérico, brilho sem fonte de luz, ícone de biblioteca.
- **Don't** pintar texto ou estado ativo pequeno com azul saturado sobre o grafite: `#2155FF` mede 3,31:1 e `#2559E6` mede 3,17:1.
- **Don't** pintar texto branco sobre o ouro ou sobre o azul da unidade.
- **Don't** importar a paleta clara dentro de `src/features/**` ou `src/app/**`.
- **Don't** declarar paleta local num arquivo de tela. Cor nova nasce em `src/ui/theme.ts` ou `semantic-colors.ts`.
- **Don't** usar emoji ou caractere de texto como ícone, nem `@expo/vector-icons` novo.
- **Don't** escrever `fontSize` numérico em tela nova; o papel existe em `typography.*`.
- **Don't** deixar o significado de um dado apenas em `accessibilityLabel`.
- **Don't** fazer relevo com `shadow*` ou `elevation`. Sombra só para a barra de abas.
- **Don't** animar a peça bloqueada, nem deixar animação sem quadro parado sob "reduzir movimento".
- **Don't** voltar ao céu: estrela, nebulosa e superfície translúcida saíram em 2026-10-21.
