# Spec de design — Ícone do app Radiant

- **Data:** 2026-07-29
- **Decisor:** Anderson (product owner), em sessão de brainstorming assistida
- **Status:** aprovada; implementação pendente
- **Relacionados:** [ADR de identidade visual Galaxy Dark](../../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md),
  [plano de closed testing Android](../../plans/2026-07-29-android-closed-testing-plan.md) (task L2.7)

## 1. Problema

Os assets de ícone do app carregam três defeitos distintos, todos descobertos ao
preparar os assets da ficha do Play em 2026-07-29:

1. **Grade de construção embutida na arte.** `radiant-app/assets/images/icon.png`
   (1024×1024) tem linhas-guia tracejadas, círculos concêntricos e um marcador de
   âncora com "+". É artefato de template de exportação. O mesmo artefato está em
   `android-icon-background.png`, a camada de fundo do adaptive icon — ou seja, o
   defeito também alcança o launcher do Android, não só o iOS.
2. **Splash é um placeholder de blueprint.** `splash-icon.png` não é a marca: é um
   gráfico de alvo (círculos concêntricos sobre grade milimetrada), exibido a
   200 px em todo cold start sobre fundo branco (`#ffffff`, variante `#000000` no
   dark) — o que contradiz a identidade galaxy dark logo na primeira tela.
3. **A marca é da empresa, não do produto.** O "A" em chevron corresponde à Ascend
   Creative (o bundle id é `com.ascendcreative.radiant`), não ao Radiant, e sua
   paleta azul-sobre-claro é remanescente da identidade light que a
   [ADR de 2026-07-27](../../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md)
   aposentou.

Impacto: `app.json` não declara `ios.icon`, então o `icon` raiz é o ícone da App
Store e da tela inicial do iPhone. É também a única fonte 1024² para derivar o
ícone 512×512 que o Play **exige** para publicar a ficha.

## 2. Decisão

O **Pixel — o mascote do produto — passa a ser a marca do Radiant**, no
enquadramento de **corpo inteiro**, sobre fundo galaxy dark.

Abordagem escolhida: **derivar do render existente** (`Mascote.png`, 1024×1536,
com alpha), e não redesenhar vetorialmente nem gerar arte nova por IA. Razões:
é literalmente o mesmo Pixel que já aparece na home, no checkpoint e no feature
graphic — risco zero de divergir do personagem —, aproveita arte profissional
existente e não bloqueia o closed test.

### Alternativas consideradas

- **Marca vetorial derivada do Pixel:** escala melhor e envelhece melhor, mas
  seria desenho geométrico programático, com risco real de resultado amador ao
  lado de um render profissional. **Registrada como evolução pós-beta.**
- **Gerar arte nova com IA:** risco alto de produzir um robô *parecido* em vez do
  Pixel; a divergência apareceria na própria ficha, lado a lado com o feature
  graphic. Rejeitada.
- **Limpar o "A" existente:** rejeitada — poliria a marca errada.

### Fundo

Gradiente **galaxy elevado**: `#0D1230` (`galaxyBg3`, token existente) no centro
para `#07091c` (`galaxyBg2`) na borda.

Motivo: `#03030d` puro é quase preto e **perde a silhueta em papel de parede
escuro** — e o Play e a tela inicial exibem o ícone sobre fundos que não
controlamos. O gradiente resolve o contraste sem inventar token novo e sem
contradizer a ADR. A alternativa de fundo azul CTA (`#1535E8→#3060FF`) foi
rejeitada por abandonar a identidade única recém-fixada.

### Enquadramento

O Pixel ocupa ~62% da largura, centrado, com a cabeça acima do centro geométrico.
Verificado em 2026-07-29 que esse enquadramento sobrevive à máscara circular do
launcher (área visível de 72 de 108 dp), com a barra do jaleco raspando a borda
inferior — o reenquadramento fino é trabalho da implementação.

## 3. Arte-mestra e derivados

Uma **arte-mestra 1024×1024** é a fonte de verdade. Todos os demais formatos são
gerados dela por script determinístico, para que não voltem a existir dois
ícones divergentes no repositório.

| Arquivo | Tamanho | Alpha | Papel |
| --- | --- | --- | --- |
| `radiant-app/assets/images/icon.png` | 1024² | **não** | Ícone iOS (App Store + tela inicial) |
| `radiant-app/assets/images/android-icon-foreground.png` | 512² | sim | Camada de frente do adaptive icon |
| `radiant-app/assets/images/android-icon-background.png` | 512² | sim | Camada de fundo do adaptive icon |
| `radiant-app/assets/images/android-icon-monochrome.png` | 432² | sim | Tema dinâmico do Android 13+ |
| `radiant-app/assets/images/splash-icon.png` | 1024² | sim | Splash de abertura (exibido a 200 px) |
| `radiant-app/assets/images/favicon.png` | 48² | sim | Web |
| `docs/store/assets/play-icon-512.png` | 512² | sim (32-bit) | Ícone da ficha do Play (≤ 1024 KB) |

**Regras opostas no mesmo lote, e é onde o erro humano mora:** a Apple **rejeita**
ícone com canal alpha e não aceita cantos arredondados embutidos (o sistema
aplica a máscara); o Play **exige** 32-bit *com* alpha no ícone 512² e proíbe
alpha no feature graphic e nos screenshots.

### A forma reduzida

A camada monocromática não aceita um render colorido — é silhueta de cor única, e
um Pixel de corpo inteiro nela vira mancha ilegível. Ali entra o **rosto
simplificado**: contorno da cabeça e os dois olhos, em uma cor.

Isso é deliberado, não concessão: o corpo inteiro é a marca principal e o rosto é
a forma reduzida da mesma marca — como sistemas de identidade reais funcionam.

A silhueta monocromática é derivada do canal alpha do recorte da cabeça, não
redesenhada à mão: assim ela permanece atada à mesma arte-mestra e não vira um
terceiro desenho divergente. Os olhos entram como recortes vazados na silhueta,
que é o que preserva a leitura do rosto em uma cor só.

### Mudanças em `app.json`

- `android.adaptiveIcon.backgroundColor`: `#E6F4FE` → **`#07091c`** (`galaxyBg2`).
  Esse campo aceita apenas uma cor sólida, não gradiente: ele é o *fallback* para
  quando o launcher não usa `backgroundImage`. O gradiente galaxy elevado vive em
  `android-icon-background.png`; o hex sólido é a borda do gradiente, para que as
  duas rotas de renderização não divirjam.
- Plugin `expo-splash-screen`: `backgroundColor` `#ffffff` → **`#03030d`**
  (`galaxyColors.background`) e `dark.backgroundColor` `#000000` → **`#03030d`**.
  Os dois modos passam a ser o mesmo fundo porque a ADR de 2026-07-27 fixou o
  galaxy dark como identidade **única** — o app não tem modo light.

## 4. Pré-requisito de escopo

`radiant-app/assets` **não está** em `writePolicy.allowedRoots` no
`.loop/project.yaml`. Sem alargá-lo, o Loop recusa a escrita dos ícones.

Alargar a política é **transação própria e ordenada**: um run anterior, separado,
que só amplia a política — não pode ser embutido no run que a política autoriza.
É o mesmo caminho que o run de 2026-07-28 seguiu ao adicionar
`radiant-app/components` e `radiant-app/plugins`.

## 5. Verificação

**Nível 1 — geométrico, por script.** Cada derivado conferido contra a
especificação da plataforma: dimensão exata, presença ou ausência de alpha, peso.

**Nível 2 — em device.** Instalar no emulador e capturar o que só existe em
runtime: ícone no launcher sob máscara real, splash de abertura, e ícone no tema
dinâmico do Android 13+. Evidência datada em `radiant-app/docs/evidence/`.

**Nível 3 — contrato.** Um `icon-assets-contract.test.mjs` ligado ao
`npm run quality`, travando:

- dimensões e política de alpha de cada um dos sete arquivos;
- o monocromático salvo como PNG cinza+alpha (color type 4) — invariante
  auto-imposta do nosso pipeline de geração, não requisito de Android ou Play (o
  sistema decodifica o PNG e usa o alpha como máscara de tint independente do
  encoding). Verificar a estrutura do arquivo é barato; confirmar R=G=B pixel a
  pixel em Node puro exigiria implementar inflate;
- o ícone da ficha do Play dentro de 1024 KB;
- o feature graphic em 1024×500 sem alpha;
- screenshots de loja com proporção máxima de 2:1 (o teto do Play — a resolução
  nativa do emulador Pixel 9, 1080×2424, é 2,24:1 e **seria recusada**).

**Limite explícito do contrato:** ele pega violação de especificação, não arte
inadequada. Ele **não** teria pego a grade de construção, que passa em qualquer
verificação geométrica. O que pega arte errada é a evidência em device somada à
revisão humana; o contrato garante que, uma vez correto, não volte a divergir.

## 6. Fora de escopo

- Marca vetorial definitiva (evolução pós-beta).
- Screenshots e assets da App Store (passada iOS, separada).
- Qualquer redesenho do mascote Pixel em si.

## 7. Consequências

- O "A" da Ascend Creative deixa de aparecer no produto. O adaptive icon do
  Android, que hoje funciona, é refeito — trocamos um ícone tecnicamente correto
  por um correto *e* da marca certa.
- O ícone é o primeiro contato do usuário na loja, e a janela é curta: publicar o
  primeiro build congela `runtimeVersion`. Esta spec deve virar implementação
  antes de F1/F2.
- A escolha do mascote como marca acopla a identidade ao render atual do Pixel.
  Se o mascote for redesenhado no futuro, o ícone o acompanha — é o custo aceito
  em troca do reconhecimento que o personagem já construiu.
