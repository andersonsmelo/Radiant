---
name: Radiant
description: Sistema visual do treinador diário de raciocínio radiológico — céu escuro navegável, tipografia Sora, profundidade por luz acumulada
colors:
  void: "#03030d"
  void-alt: "#070718"
  contrast-blue: "#2155FF"
  phosphor-cyan: "#3DCAE8"
  nav-blue: "#4A9EFF"
  cta-start: "#1535E8"
  cta-end: "#3060FF"
  ink-on-dark: "#FFFFFF"
  xp-amber: "#F5A623"
  streak-ember: "#FF6B2C"
  heart-full: "#FF3B30"
  critical-rose: "#FF8298"
  paper: "#F5FAFF"
  ink: "#14233F"
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
rounded:
  rSm: "8px"
  rMd: "12px"
  rLg: "16px"
  rXl: "20px"
spacing:
  s0: "4px"
  s1: "8px"
  s2: "12px"
  s3: "16px"
  s4: "20px"
  s5: "24px"
  s6: "32px"
components:
  button-primary:
    backgroundColor: "{colors.cta-end}"
    textColor: "{colors.ink-on-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.rMd}"
    padding: "16px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.nav-blue}"
    typography: "{typography.body}"
    rounded: "{rounded.rMd}"
    padding: "16px 24px"
  card-surface:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.ink-on-dark}"
    rounded: "{rounded.rLg}"
    padding: "16px"
  hud-pill:
    backgroundColor: "rgba(255,255,255,0.07)"
    textColor: "{colors.ink-on-dark}"
    rounded: "{rounded.rXl}"
    padding: "5px 10px"
  tab-bar:
    backgroundColor: "rgba(10,10,30,0.92)"
    textColor: "{colors.nav-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.rXl}"
    height: "72px"
---

# Design System: Radiant

## 1. Overview

**Creative North Star: "O Céu Navegável"**

O Radiant é um céu escuro que a pessoa atravessa. Competências são pontos de luz,
trilhas são rotas entre eles, e o progresso é território que deixa de ser
desconhecido. A metáfora não é decorativa: ela decide densidade, luz e ritmo. Um
céu tem vazio — e o vazio é o que faz o ponto de luz significar alguma coisa.
Interface cheia é céu poluído.

A paleta empresta os nomes de onde a profissão tira sua própria luz. O azul é a
janela de contraste; o ciano é o brilho do fósforo no intensificador de imagem.
São cores de instrumento, não de tendência — e é por isso que o escuro aqui não é
moda de dark mode: é a condição real em que radiologia se lê.

O sistema rejeita explicitamente a estética de **dashboard hospitalar**:
prontuário eletrônico, tabela densa em cinza, densidade de software que se usa
por obrigação. O Radiant é aberto por escolha, todo dia, e cada tela precisa
merecer esse retorno. Rejeita também o oposto — enfeite que sugere mais certeza
do que a evidência sustenta. Conteúdo é médico; a interface nunca decora por cima
disso.

**Key Characteristics:**
- Fundo quase preto (#03030d) com superfícies de luz acumulada, nunca de sombra
- Uma família tipográfica só (Sora) em cinco papéis, com hierarquia por peso e corte óptico
- Vazio deliberado: o ponto de luz depende do escuro em volta
- Movimento contido e sempre com alternativa sob movimento reduzido
- Cor carrega ênfase, nunca informação sozinha

## 2. Colors

Paleta de instrumento sobre vazio: um azul de ação, um ciano de sinal, e uma
escada de branco translúcido que constrói toda a profundidade.

### Primary
- **Azul de Contraste** (#2155FF): a cor da marca e do CTA de peso. Vive em
  superfície grande e em gradiente de botão — **nunca** como estado ativo pequeno
  sobre fundo escuro, onde mede 3,55:1 e some. Ver a Regra do Azul que Não Brilha.
- **Azul de Navegação** (#4A9EFF): o mesmo azul, clareado para sobreviver ao
  escuro. Mede 7,11:1 sobre a barra de navegação. É esta a cor de estado ativo,
  ícone selecionado, link e foco.

### Secondary
- **Ciano de Fósforo** (#3DCAE8): sinal e destaque pontual. Marca o que está vivo
  agora — brilho de nó ativo, borda de foco, acento de conquista. Sua raridade é
  o que o faz funcionar.

### Tertiary
- **Âmbar de XP** (#F5A623) e **Brasa de Sequência** (#FF6B2C): as duas moedas da
  gamificação. Sempre acompanhadas de ícone e número; a cor sozinha nunca diz que
  moeda é.
- **Vermelho de Vida** (#FF3B30) e **Rosa Crítico** (#FF8298): perda e erro. O
  rosa existe porque o vermelho puro reprova como texto sobre o vazio.

### Neutral
- **Vazio** (#03030d): o fundo de todas as telas do produto. Não é preto — tem
  azul suficiente para o starfield não parecer ruído sobre cinza.
- **Vazio Alternativo** (#070718): segundo plano de seções e do cartão da barra.
- **Branco Tinta** (#FFFFFF): texto primário sobre o escuro.
- **Escada de superfície** — branco a 3%, 5%, 8% e 9%: os quatro degraus de
  elevação. Bordas usam branco a 8%, e a 22% quando ativas.
- **Papel** (#F5FAFF) e **Tinta** (#14233F): o contexto claro. Existe para
  superfícies fora do produto; **não** pertence a nenhuma tela do app.

### Named Rules

**A Regra do Azul que Não Brilha.** Azul saturado é uma cor escura: quase todo o
seu brilho está no canal azul, que responde por 7,22% da luminância percebida.
`#2155FF` sobre o vazio mede 3,55:1 — praticamente o mesmo que o cinza inativo
(3,14:1), e por isso um item "ativo" pintado de azul de marca não parece ativo.
Estado ativo usa Azul de Navegação (#4A9EFF) ou Ciano de Fósforo. Teste de um
segundo: se ativo e inativo tiverem contraste parecido, não existe estado ativo.

**A Regra das Duas Paletas.** Existem dois contextos de cor e eles nunca se
misturam. Importar o contexto claro dentro de uma tela do produto é defeito, não
escolha — foi assim que texto pedagógico chegou a renderizar a 1,21:1. Telas do
app consomem exclusivamente o contexto galaxy, através de `semantic-colors`.

**A Regra da Cor Muda.** Cor nunca carrega informação sozinha. Todo estado
comunicado por cor traz também ícone, forma ou texto. Vale para vida, sequência,
acerto, erro e progresso.

## 3. Typography

**Display Font:** Sora (ExtraBold / Bold)
**Body Font:** Sora (SemiBold / Regular)
**Label Font:** Sora Bold em caixa alta

**Character:** uma família só, em cinco papéis. Sora é geométrica com terminações
levemente humanistas — técnica sem ser fria, o que é exatamente a tensão do
produto. A hierarquia vem de peso e corte óptico, não de troca de família: títulos
grandes fecham o espacejamento (até −1px) porque letras grandes já respiram
sozinhas; o rótulo em caixa alta abre para +1px porque maiúscula encosta.

### Hierarchy
- **Display** (ExtraBold, 40/46, −1): abertura de tela e número de celebração. Um por tela, no máximo.
- **Headline** (ExtraBold, 32/38, −0,6): título de seção maior e telas de resultado.
- **Title** (Bold, 24/30, −0,4): título de card e de bloco. É o papel mais usado do app.
- **Body** (SemiBold, 16/24): texto corrido, enunciado e alternativa de quiz. A variante Regular carrega parágrafo longo.
- **Label** (Bold, 11/14, +1, caixa alta): rótulo de métrica e de aba. Sempre acompanhado do valor que ele nomeia.

### Named Rules

**A Regra da Escala Única.** Todo tamanho de texto vem de `typography.*`. Um
`fontSize` numérico literal em tela nova é defeito: além de furar a escala, ele
costuma vir sem `fontFamily`, e o texto renderiza em fonte de sistema — a marca
desaparece sem ninguém perceber.

**A Regra do Rótulo Visível.** Rótulo de acessibilidade complementa o texto
visível, nunca o substitui. Se o significado de um número existe apenas em
`accessibilityLabel`, falta o rótulo visual.

## 4. Elevation

Profundidade é **luz acumulada, não sombra**. Cada nível de elevação acrescenta
branco translúcido sobre o vazio: 3% para superfície recuada, 5% para card
padrão, 8% para superfície destacada, 9% para estado ativo. Bordas de 1px a 8%
fecham a forma; a 22% marcam seleção. O resultado é um empilhamento que continua
legível num fundo quase preto, onde sombra — por definição escura — não teria
como se separar.

Sombra é reservada ao que literalmente flutua sobre o conteúdo.

### Shadow Vocabulary
- **Flutuação** (`shadowRadius: 24, shadowOpacity: 0.5, offset 0/8, elevation 16`): barra de abas destacada do fundo e folhas modais. Único uso legítimo de sombra no contexto galaxy.
- **Brilho** (`shadowRadius: 18, offset 0/0`, cor do próprio acento): halo difuso sob elemento de destaque. Enfatiza, não eleva.

### Named Rules

**A Regra do Empilhamento por Luz.** No escuro, profundidade sobe — não desce. Se
uma proposta pede sombra para separar duas superfícies internas, a resposta certa
é subir um degrau da escada de branco. Sombra dentro de card é sempre erro.

## 5. Components

### Buttons
- **Shape:** cantos suavemente curvos (12px)
- **Primary:** gradiente do Azul de Contraste (#1535E8 → #3060FF) com texto branco, preenchendo a largura por padrão; padding vertical de 16px
- **Hover / Focus:** não há hover em toque. Pressão encolhe a escala e o foco desenha borda em Azul de Navegação
- **Ghost / Secondary:** sem preenchimento, texto em Azul de Navegação; usado para alternativa e saída, nunca para a ação principal da tela

### Cards / Containers
- **Corner Style:** 16px; 20px quando o container flutua
- **Background:** branco a 5% sobre o vazio
- **Shadow Strategy:** nenhuma — ver Elevation
- **Border:** 1px de branco a 8%
- **Internal Padding:** 16px, com 12px entre itens internos

### Navigation
Barra de abas flutuante, destacada 14px do rodapé e 16px das laterais, com raio
de 20px e altura de 72px sobre `rgba(10,10,30,0.92)`. Ícone e rótulo compartilham
a cor do estado: **Azul de Navegação** quando ativo, branco a 35% quando inativo.
Por flutuar sobre o conteúdo, toda tela rolável reserva 102px de folga inferior
(`tabBarClearance`) — sem isso o último elemento fica embaixo da barra e nunca
pode ser tocado.

### HUD (componente de assinatura)
Trilho persistente de XP, sequência e vidas no topo das telas do produto. Pílulas
de branco a 7% com borda a 10%; ícone e valor lidos como um nó único pelo leitor
de tela ("1.234 XP"), nunca como ícone decorativo seguido de número solto. Vidas
são cinco marcas na horizontal; a que se esvazia recebe pulso de perda, e o
rótulo agregado ("3 de 5 vidas") continua informando quando o movimento está
reduzido. Após inspeção no aparelho pelo dono, XP e sequência renderizam a
**18pt** e as vidas a **22pt**: abaixo disso os glifos perdem presença contra o
texto e o céu da Home.

### Home e Galáxia (uma progressão)

A Home é uma superfície de retomada curta: hero, foco do dia e CTA para o
próximo nó. Não contém catálogo horizontal nem mapa. A Galáxia é a única
superfície exploratória: nela o aluno escolhe a trilha e percorre o
`JourneyMap`. As duas consomem o mesmo `JourneyProgressService`; um estado
visual vindo de `GALAXY_CATALOG` não pode competir com o progresso real.

### Fala ambiental do Pixel

O balão da Home não é permanente nem foi removido. Ele surge após 1,2–2,6s,
permanece por 6,5s e volta somente depois de 28–45s de silêncio. A frase vem do
pool de abertura do `PixelMood`, não repete a anterior e nunca contém informação
funcional. A entrada e a saída podem ser instantâneas; não há movimento
obrigatório a ser reproduzido quando “reduzir movimento” estiver ativo.

### Named Rules

**A Regra do Sinal Proporcional.** Retorno tátil pertence só à ação principal da
tela — as variantes `primary` e `galaxy`. Quando tudo vibra, a vibração para de
significar. Alternativa e saída respondem com cor e escala, sem háptico.

## 6. Do's and Don'ts

### Do:
- **Do** consumir cor por `semantic-colors`, que já mantém o mesmo papel nos dois contextos.
- **Do** usar **Azul de Navegação** (#4A9EFF) para estado ativo, seleção e foco no escuro.
- **Do** medir contraste de **composição**, não de token isolado: o par que importa é a cor final sobre a superfície final, depois de aplicada a transparência.
- **Do** dar a todo estado um segundo canal além da cor — ícone, forma ou texto.
- **Do** reservar 102px de folga inferior em toda tela rolável com barra de abas.
- **Do** oferecer alternativa sob movimento reduzido em toda animação, tipicamente crossfade ou transição instantânea.
- **Do** manter escolha de trilha e mapa exclusivamente na Galáxia, projetados da jornada canônica.
- **Do** tratar a fala do Pixel como conteúdo opcional, breve e espaçado.
- **Do** subir um degrau da escada de branco quando precisar separar superfícies.

### Don't:
- **Don't** parecer um **dashboard hospitalar** — prontuário, tabela densa em cinza, densidade de software de uso obrigatório. É a anti-referência declarada do produto.
- **Don't** pintar estado ativo com o Azul de Contraste (#2155FF) sobre o escuro: 3,55:1 contra 3,14:1 do inativo não produz estado ativo nenhum.
- **Don't** importar a paleta do contexto claro dentro de `src/features/**` ou `src/app/**`.
- **Don't** declarar paleta local dentro de um arquivo de tela. Se falta um papel, ele nasce em `semantic-colors`, não num objeto de constantes ao lado do componente.
- **Don't** usar emoji do sistema como ícone. Emoji ignora token de cor, renderiza ao gosto do sistema operacional e é lido um a um pelo leitor de tela.
- **Don't** escrever `fontSize` numérico em tela nova; o papel existe em `typography.*`.
- **Don't** deixar o significado de um dado apenas em `accessibilityLabel`.
- **Don't** manter uma trilha estática na Galáxia em paralelo à progressão real.
- **Don't** colocar instrução, erro ou próxima ação apenas no balão do Pixel.
- **Don't** usar sombra para separar superfícies internas; sombra só para o que flutua.
- **Don't** encher o céu. Vazio é o material que faz o ponto de luz significar.
