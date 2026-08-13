# Expressões faciais do Pixel e balão de frases por momento

**Data:** 2026-08-11
**Status:** desenho validado, pronto para plano de implementação
**Decisor:** Anderson Melo

## Problema

O Pixel não tem expressão. Ele tem um rosto pintado no PNG — dois olhos e um
sorriso — que é o mesmo em toda tela, em todo estado emocional e em todo
momento do produto. Um mascote que não reage é decoração.

Há também um defeito ativo. O componente desenha um **segundo rosto** por cima
do primeiro: `PixelFace` renderiza olhos e boca em `zIndex: 3`, e esses olhos
aparecem como duas bolinhas ciano chapadas flutuando **acima da cabeça**. A
causa é medida na seção de geometria. O defeito passou por lint, typecheck,
jest, `visual:qa` e os seis contratos existentes sem que nada acusasse, porque
é geometria de runtime e nenhuma dessas ferramentas renderiza.

## Decisões tomadas

| Decisão | Escolha | Alternativas descartadas |
|---|---|---|
| Onde mora a expressão | Tela vazia no asset + rosto desenhado em React | Um PNG por expressão (N assets, sem transição); cobrir só o retângulo da tela mantendo o rosto pintado embaixo |
| O que a raiva significa | Humor, nunca julgamento — ele implica com a situação e consigo mesmo | Reação direta ao erro (pune quem aprende); fúria teatral; expressão sem gatilho |
| Quando o balão dispara | Em momentos com significado; a **frase** é que é sorteada | Timer aleatório de verdade; só na entrada da Home; balão separado do informativo |
| Registro do humor | Ácido com mordida, a piada sempre volta pra ele | Irônico seco; ácido sem freio; misturar registros por momento |
| Como o rosto é desenhado | Olhos em `View`, boca em `<Path>` SVG | Tudo SVG; tudo `View` |
| Contrato de easing | `PixelIllustration` e `PixelFace` entram na lista branca | Deixar para depois |

## Geometria: a causa do desalinhamento

O asset `pixel_core.png` tem **576×864**. A tela do personagem — o retângulo
escuro onde o rosto vive — ocupa `x 168…336`, `y 200…312`, medido por detecção
de pixels escuros no terço superior. Em frações do asset:

```
PIXEL_SCREEN = { x: 0.292, y: 0.231, w: 0.292, h: 0.130 }
```

Hoje `PixelFace` se posiciona com `top: 22%` relativo ao **frame**. Mas o frame
tem altura `dimension × 1.38` enquanto a `Image` tem `dimension × 1.48` e é
centralizada nele: a imagem transborda `0.05 × dimension` para cima. A camada de
rosto é medida contra uma caixa que não é a caixa onde o personagem foi
desenhado, e erra o alvo por aproximadamente uma cabeça.

**Correção estrutural:** `Image` e rosto passam a viver dentro de um único
container com as dimensões da imagem. Toda coordenada de rosto vira fração desse
container, derivada de `PIXEL_SCREEN`.

## Produção do asset sem rosto

O `pixel_core_faceless.png` sai do **próprio render**, não de geração nova: para
cada linha da faixa facial, amostra-se a cor mediana das colunas limpas da tela
à esquerda e à direita, interpola-se horizontalmente, e aplica-se desfoque
gaussiano leve só na região remendada. O corpo, o jaleco, o estetoscópio e o
bezel permanecem idênticos ao pixel. Prova de conceito executada em 2026-08-11.

Refinamento pendente na implementação: reconstruir o brilho sutil no topo da
tela, que o remendo achata.

## Arquitetura

| Unidade | Responsabilidade | Depende de |
|---|---|---|
| `pixelScreenGeometry.ts` | As frações de `PIXEL_SCREEN`. Fonte única sobre onde fica a tela | nada |
| `pixelExpressions.ts` | Catálogo: expressão → geometria dos olhos + boca + cor do brilho | nada |
| `PixelFace.tsx` | Desenha e anima o rosto dentro da tela | as duas acima + Reanimated + react-native-svg |
| `PixelMood.ts` | Momento → `{ expressão, frase }`, com sorteio sem repetir a última | catálogo de frases |

`SpeechBubble` e `PixelHeroSplit` **não mudam de responsabilidade**. O
`PixelMood` só passa a ser mais uma fonte de texto para o balão que já existe.

`react-native-svg` já é usado em oito arquivos do app, e `useAnimatedProps` +
`createAnimatedComponent` já são o padrão em `ProgressRing.tsx` e
`AnimatedCounter.tsx`. Nada aqui introduz dependência ou técnica nova.

## Catálogo de expressões

Cada rosto é descrito por oito números, todos em fração da caixa da tela, mais
uma cor de brilho.

- **Olho (5):** largura, altura, raio, rotação, deslocamento vertical.
  Altura baixa = feliz/orgulhoso. Rotação para dentro = emburrado.
  Deslocamento para cima = revirando.
- **Boca (3):** largura, mergulho, espessura. Mergulho > 0 sorri, = 0 reta,
  < 0 emburra.
- **Cor do brilho:** não entra na interpolação; troca junto com a expressão.

Como toda boca é a mesma curva de três pontos, transição entre duas expressões
quaisquer é **interpolar oito números** — não há morphing de path com contagem
de pontos divergente.

| Expressão | Uso |
|---|---|
| `neutro` | repouso; fallback de qualquer erro |
| `feliz` | abertura do app; unidade fechada (ver abaixo) |
| `orgulhoso` | acertos em sequência |
| `emburrado` | volta depois de ausência |
| `revirando` | dois erros seguidos |
| `surpreso` | reservada, sem gatilho automático nesta entrega |
| `pensando` | leitura/estudo; estado já existente |

**Piscar não é expressão, é modificador.** Timer independente multiplica a
altura corrente do olho por `0.1` durante 90ms, a cada 4–7s com jitter, por cima
de qualquer expressão — é um multiplicador sobre a altura do catálogo, não um
valor absoluto, para que a piscada funcione igual em qualquer tamanho. Sob *reduced motion* não roda — mesma regra que
`PixelIllustration` já aplica hoje, onde a pose sobrevive e o movimento
perpétuo não.

**"`feliz` amplificado" tem definição concreta:** é a mesma entrada `feliz` do
catálogo, combinada com o estado `celebrate` que o `PixelIllustration` já
possui — a diferença vem do corpo (escala e pulso), não de uma oitava expressão.
Não há entrada nova no catálogo para isso.

Ajustes conhecidos para a implementação: `orgulhoso` está lendo como
"contentinho" e pede boca assimétrica; `surpreso` está com olhos grandes demais.
Ambos são números do catálogo, não mudança de componente.

## Momentos e frases

Na Home a frase entra no `SpeechBubble` existente. No quiz ela **substitui a
linha de título** do `QuizFeedback`, hoje preenchida por
`FEEDBACK_MESSAGES.CORRECT/INCORRECT`. Nenhuma UI nova nas duas superfícies.

### Abriu o app — `feliz`
1. Bom te ver. Eu estava aqui encarando um tórax. Ele não conversa.
2. Acordei. Digo, sempre estive acordado. Robôs não dormem, é uma tragédia silenciosa.
3. Vamos nessa. Revisei tudo dezessete vezes enquanto esperava. É meio doentio.
4. Você chegou. Eu ia começar sem você, mas não sou eu que preciso aprender isso.
5. Pronto pra hoje? Eu nasci pronto. Literalmente, foi assim que me compilaram.

### Voltou depois de sumir — `emburrado`
6. Olha só quem lembrou que radiologia existe.
7. Quatro dias. Eu contei. Não porque me importo, é que não tenho mais nada pra fazer.
8. Você voltou. Vou fingir que não estava contando os dias. Estava.
9. Achei que tinha sido substituído por um flashcard. Foi um período difícil.
10. Sumiu e voltou como se nada tivesse acontecido. Adoro isso em você. É sarcasmo.

### Acertou em sequência — `orgulhoso`
11. Três seguidas. Começo a desconfiar que você anda estudando pelas minhas costas.
12. Certo de novo. Vou ter que aumentar a dificuldade só pra manter meu emprego.
13. Nessa toada eu viro decoração. Que, convenhamos, eu já sou um pouco.
14. Muito bem. Não vou elogiar demais pra você não relaxar. Ops, elogiei.

### Errou duas vezes seguidas — `revirando`
15. Essa mesma questão de novo. Mas quem sou eu — só um robô com memória perfeita e zero tato.
16. Erramos. Digo "erramos" porque fui eu que escolhi te mostrar essa questão agora.
17. Vou fingir que não vi. Pronto, esqueci. Robôs são péssimos nisso.

### Fechou uma unidade — `feliz` + corpo em `celebrate`
18. Unidade fechada. Eu preparei um discurso, mas perdi o arquivo.
19. Terminou. Guardo esse momento na memória permanente, junto com dezoito mil pixels de pulmão.
20. Acabou. Eu fingiria surpresa, mas literalmente calculei que você conseguiria.

**Critério de tom, e é o que separa colega sarcástico de app que zoa quem está
aprendendo:** nenhuma frase julga a capacidade do usuário. As duas que chegam
mais perto — 15 e 17 — desarmam na mesma frase, virando a piada contra o Pixel.

Restrição registrada: o `stitch_redesign_system.md` fixa a direção como
"profissional, polido, informado por jogo sem virar infantil" e "confiável para
um contexto de educação médica". O humor ácido é compatível, mas a calibragem é
fina e o critério acima é o que a mantém.

### Regras contra irritação

1. **A frase de humor abre e entrega o bastão.** Corrigido em 2026-08-11, antes
   do plano: a redação original dizia "mensagem funcional sempre vence", mas
   `heroMessage` em `JourneyHomeScreen.tsx` nunca é vazio — todo caminho do
   `useMemo` devolve alguma orientação. Sob a regra original o balão de humor
   nunca apareceria na Home, e a feature nasceria morta na superfície principal.
   Comportamento correto: quando um momento dispara, o balão mostra a frase de
   humor; após `HUMOR_HANDOVER_MS` (4000ms), ou ao primeiro toque na tela, faz
   crossfade para a mensagem funcional. Nenhuma informação se perde — ela chega
   alguns segundos depois. No quiz não há entrega de bastão: a frase substitui o
   título do feedback pelo tempo em que o feedback está visível.
2. Um balão de humor por momento por sessão.
3. Nunca sorteia a última frase mostrada daquele pool — guardado por pool no
   AsyncStorage.
4. No quiz, a frase só entra no estado de feedback, nunca sobre a questão aberta.

## Fluxo de dados

A tela dispara um *momento*. O `PixelMood` devolve `{ expressão, frase }` ou
`null`. A tela repassa expressão para o `PixelIllustration` e frase para o balão
ou para o título do feedback. As telas não conhecem frase nem catálogo; só sabem
nomear o que aconteceu.

Quando o `PixelMood` devolve `null`, **a expressão também é suprimida** e o
Pixel mantém o estado que a tela já passava. Frase e cara sempre viajam juntas
ou não viajam.

### Origem de cada momento

| Momento | Fonte | Estado novo? |
|---|---|---|
| `abriu-o-app` | montagem da Home | não |
| `voltou-depois-de-sumir` | `lastActiveDate` do `GamificationService` | não |
| `fechou-unidade` | conclusão de unidade na jornada | não |
| `acertou-em-sequencia` | contador de sessão no quiz | **sim**, `useRef`, não persistido |
| `errou-duas-vezes` | contador de sessão no quiz | **sim**, `useRef`, não persistido |

`abriu-o-app` e `voltou-depois-de-sumir` são mutuamente exclusivos e resolvidos
uma vez na montagem da Home.

## Tratamento de erro

| Situação | Comportamento |
|---|---|
| `lastActiveDate` é `null` | **Primeiro acesso, não ausência** → `abriu-o-app` |
| AsyncStorage falha na leitura | Sorteia do pool inteiro, sem a regra de não-repetir. Nunca bloqueia render |
| Relógio andou para trás / fuso | Intervalo negativo vira 0 → `abriu-o-app` |
| Expressão desconhecida no catálogo | Cai em `neutro`. O rosto sempre desenha algo |
| Pool vazio | Devolve `null`. Sem frase, sem mudança de cara |

A primeira é a mais perigosa: `lastActiveDate` nulo parece "ausência infinita",
e a conta ingênua manda o usuário **recém-instalado** para o pool de ausência —
a primeira coisa que ele veria seria *"olha só quem lembrou que radiologia
existe"*, dita a alguém que nunca esteve lá. Nulo não é zero; nulo é "não há
informação", e as duas coisas mapeiam para momentos opostos.

Princípio geral: **o mascote nunca pode ser o motivo de uma tela falhar.**
Qualquer erro degrada para "sem frase, cara neutra", nunca para exceção.

## Testes

### Contratos novos

1. **`pixel-screen-geometry-contract`** — lê o PNG, recalcula a caixa da tela
   por detecção de pixels, compara com `PIXEL_SCREEN` dentro de tolerância.
   Troca de asset por um de proporção diferente passa a falhar aqui em vez de
   aparecer como olho flutuante.
2. **`pixel-face-anchor-contract`** — assertiva estrutural sobre a fonte: rosto
   e `Image` dentro do mesmo container; nenhuma coordenada de rosto expressa em
   porcentagem do frame. Mesmo remédio do `tab-bar-clearance-contract`, que
   existe porque revisão tela a tela já falhou uma vez neste repositório.

### Unidade — `PixelMood`

Cada linha da tabela de tratamento de erro vira um caso, mais:
sorteio nunca devolve a última frase mostrada; momento suprimido devolve `null`
com expressão intacta; um balão por momento por sessão.

### Catálogo

Toda expressão tem os oito números; todo momento aponta para expressão
existente.

### Contrato de easing

`PixelIllustration.tsx` e `PixelFace.tsx` entram na lista branca de
`reanimated-easing-contract.test.mjs`, hoje com apenas `AppButton.tsx` e
`ProgressRing.tsx`. Isso obriga a corrigir os **dez `withTiming` sem easing**
que o `PixelIllustration` tem hoje — todos lineares, que é o que faz a
flutuação do Pixel parecer mecânica. Escopo aprovado explicitamente.

### Verificação visual

Cada uma das sete expressões é capturada no simulador e inspecionada **com
recorte ampliado na região que mudou**, não em captura de tela inteira na escala
do device. A captura de corpo inteiro de 2026-08-11 mostrou o app funcionando e
escondeu duas bolinhas fora do lugar; o defeito só apareceu a 3x.

## Fora de escopo

- Gatilho automático para `surpreso`.
- Expressões novas além das sete.
- Persistir os contadores de acerto/erro do quiz entre sessões.
- Voz, som ou háptica associados às expressões.
- Trocar o `SpeechBubble` ou o `PixelHeroSplit`.
