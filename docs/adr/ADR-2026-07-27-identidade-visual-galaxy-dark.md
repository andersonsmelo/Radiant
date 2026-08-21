# ADR — Identidade visual única: Galaxy Dark

- **Data:** 2026-07-27
- **Decisor:** Anderson (product owner), em sessão de crítica de design assistida
- **Status:** aceita

## Contexto

A crítica de design dual-agent de 2026-07-27 (snapshot em
`.impeccable/critique/2026-07-27T22-57-41Z__radiant-app.md`, score 16/40)
identificou como P0 a coexistência de duas identidades visuais no mesmo tab
bar: Home/Galáxia renderizam a identidade "galaxy dark" (`#03030d`, starfield,
HUD) enquanto Missões/Progresso renderizavam light mode (`#F5FAFF`), e a
celebração do Checkpoint saltava para um gradiente light no meio de um fluxo
dark. Evidência visual foi capturada no iOS Simulator (build de 2026-07-26).
O efeito é o de dois produtos costurados — a principal fonte da percepção de
"app gerado por IA" que o produto quer eliminar antes do lançamento v1.3.

## Decisão

A identidade **galaxy dark é a identidade visual única e oficial** do Radiant
a partir da v1.3:

1. Tokens canônicos: `galaxyColors` (`radiant-app/src/ui/theme.ts`) e
   `semanticColors.galaxy` (`radiant-app/src/ui/semantic-colors.ts`).
2. Toda tela de usuário final consome esses tokens; paletas locais por tela
   são proibidas (uma paleta local `D` pode existir apenas como *alias* de
   tokens, nunca com valores próprios).
3. O modo light (`colors` em `theme.ts`) fica reservado a superfícies fora do
   produto (ex.: Storybook, ferramentas internas) até decisão futura; não é
   um segundo tema do app.
4. Celebrações e estados especiais permanecem dark, com acentos (dourado XP,
   verde sucesso, gradiente CTA azul) sobre o fundo galaxy.

## Alternativas consideradas

- **Light única:** portaria o núcleo galáxia inteiro para light; mais trabalho
  e perde o diferencial visual já construído (starfield, glow, Pixel).
- **Dois temas alternáveis:** dobra o custo de manutenção e QA visual antes do
  lançamento; rejeitada para v1.3.

## Consequências

- Run `run-1785193600450-bc8101df` porta MissionsScreen, ProgressScreen,
  celebração do CheckpointScreen e o track de progresso do QuizScreen para os
  tokens galaxy.
- `textTertiary` do contexto galaxy (2.34:1) reprova contraste WCAG e será
  recalibrado no passe de tipografia; até lá, telas portadas usam
  `textSecondary` onde o terciário seria texto informativo.
- Passos seguintes registrados no plano da crítica: honestidade da
  gamificação (harden), idioma pt-BR (clarify), tipografia (typeset) e
  motion/celebração (animate).

## Adendo — 2026-08-14: faixa de celebração no fim de lição

A conclusão de lição inverte uma faixa no topo da tela, com fundo claro e a arte do
Pixel. Isso **não** é exceção a este ADR: a faixa usa `galaxyColors.celebrationBand`,
token que vive na paleta escura, e nenhuma tela passa a importar a paleta clara
`colors`. Nenhum texto de leitura é pintado sobre a faixa, então o contrato de
contraste também segue intacto. O corpo da tela continua escuro.
