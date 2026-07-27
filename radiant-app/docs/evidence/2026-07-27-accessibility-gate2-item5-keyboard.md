# Gate 2 — item 5: navegação por teclado no build web — 2026-07-27

**Data da coleta:** 2026-07-27
**Escopo:** item 5 do checklist de release-candidate de
[`docs/ACCESSIBILITY_QA_V1.md`](../ACCESSIBILITY_QA_V1.md) — navegação por
teclado no preview web: ordem de foco, foco visível, ausência de armadilhas de
foco e tamanho de alvo dos controles nomeados (atalho da Home e ação de entrar).
**Build:** `npx expo export --platform web` (o `app.json` já usa
`web.output: "static"`), servido localmente e percorrido só com teclado.
**Classificação:** `passed`. O item 5 estava aberto por falta de build web; a
build foi gerada e o fluxo crítico foi percorrido por teclado.

## Método

Este item não foi conferido a olho. A build web estática foi servida e cada tela
do fluxo crítico foi percorrida com a tecla `Tab`. A cada passo, o
`document.activeElement` foi inspecionado programaticamente — o mesmo elemento
que recebe o foco do teclado — extraindo tag, `role`, nome acessível
(`aria-label`/texto), `tabindex`, tamanho do retângulo de foco (para o alvo de
44px) e o estilo de foco computado (`outline`, `box-shadow`, borda). A ordem de
foco é a sequência real de `Tab`; a ausência de armadilha é a observação de que o
foco fecha o ciclo e/ou fica contido na tela sobreposta. Screenshots ficam fora
do Git; os dados medidos abaixo são a evidência.

O fluxo crítico coberto é a Learning Road de produção
(`ENABLE_LEARNING_ROAD=true`, home oficial da v1.3): **Home da jornada → lição →
quiz → onboarding/entrar**.

## Mecanismo de foco visível

Todo controle focável recebe o anel de foco padrão do navegador aplicado pelo
`react-native-web` em `:focus-visible`: `outline: auto 1px rgb(229, 151, 0)`
(âmbar) — reproduzido em todos os controles medidos abaixo. Além disso, o
`AppButton` aplica um tratamento próprio de 3px (`borderWidth: 3`,
`light.borderFocus`/`galaxy.borderFocus`) via estado `onFocus`/`onBlur`, então o
CTA primário tem foco visível redundante (anel do navegador + borda semântica).

## Home da jornada (Learning Road) — ordem de foco por `Tab`

| # | Controle | Elemento | `role` | Tamanho (px) | Foco visível |
|---|---|---|---|---|---|
| 1 | Trilha "Fundamentos" | `<button>` | button | 250×224 | sim (âmbar) |
| 2 | Trilha "Tórax" | `<button>` | button | 250×224 | sim |
| 3 | Trilha "Abdome" | `<button>` | button | 250×224 | sim |
| 4 | Nó da jornada "Fundamentos de Radiologia · Disponível" | `<button>` | button | 522×96 | sim |
| 5 | CTA "Continuar jornada" (`AppButton`) | `<button>` | button | 1248×56 | sim (âmbar + borda 3px) |
| 6 | Tab "Home" | `<a href="/">` | tab | 312×47 | sim |
| 7 | Tab "Galáxia" | `<a href="/galaxy">` | tab | 312×47 | sim |
| 8 | Tab "Progresso" | `<a href="/progress">` | tab | 312×47 | sim |
| 9 | Tab "Missões" | `<a href="/missions">` | tab | 312×47 | sim |

A ordem é lógica: conteúdo de cima para baixo (trilhas → nó → CTA) e depois a
tab bar inferior. Um `Tab` após "Missões" **volta para o controle 1**, fechando o
ciclo — **sem armadilha de foco**. Os nós bloqueados do `JourneyMap` são
`disabled` e ficam corretamente **fora** da ordem de foco; só o nó elegível é
focável.

## Lição (`/learn`, rota empilhada) — contenção de foco

A rota de lição é empilhada sobre a tab bar. A ordem de `Tab` cicla apenas entre
os seus dois controles e **não vaza** para os controles da Home que continuam no
DOM por baixo:

| Controle | `role` | Tamanho (px) | Foco visível |
|---|---|---|---|
| "Continuar" | button | 1248×56 | sim |
| "Fechar lição" | button | 44×44 | sim |

`Continuar → Fechar lição → Continuar` — foco contido, sem vazamento e sem
armadilha (é possível sair da tela pela ação de fechar, que é keyboard-focável).

## Quiz embutido (passo 3/4 da lição)

As alternativas são focáveis e nomeadas, com anel de foco visível:

| Controle | `role` | Tamanho (px) | Foco visível |
|---|---|---|---|
| "Tratamento de tumores" | button | 1214×56 | sim |
| "Visualização de estruturas internas" | button | 1214×56 | sim |
| "Esterilização de equipamentos" | button | 1214×56 | sim |
| "Aquecimento de tecidos" | button | 1214×56 | sim |
| "Fechar lição" | button | 44×44 | sim |

O "Continuar" fica `disabled` (fora da ordem de foco) **até** uma alternativa ser
escolhida; depois da escolha, as alternativas passam a `aria-disabled="true"`
(travadas) e o "Continuar" entra na ordem de foco. Ou seja, o conjunto focável
acompanha o estado corretamente.

## Onboarding / ação de entrar

| Controle | `role` | Tamanho (px) | Foco visível |
|---|---|---|---|
| "Get started →" (atalho primário) | button | 1240×56 | sim |
| "Entrar" (ação de entrar / sign-in) | button | 209×44 | sim |

Os dois controles nomeados no item 5 satisfazem o mínimo de 44×44: o atalho da
Home ("Continuar jornada" / "Get started") tem 56px de altura e a ação de entrar
("Entrar") tem exatamente 44px.

## Operabilidade por teclado — o que foi confirmado e a ressalva de ferramenta

- **Links de tab (`<a href>`):** `Tab` + `Enter` **ativa** — foco em "Galáxia" e
  `Enter` navegou para `/galaxy` (verificado por mudança de rota). Operável por
  teclado.
- **Controles `Pressable`:** renderizam como `<button type="button"
  role="button" tabindex="0">` nativos, focáveis e nomeados. A ativação por
  ponteiro (`click`) dispara o handler em todos os casos verificados (card de
  trilha → `/learn`; alternativa do quiz → seleciona e trava; CTA → `/learn`).

Ressalva honesta de método: a ativação por `Enter` **injetada pela automação**
não disparou o `click` nativo desses `<button>`. Isso é limitação do injetor, não
do app — um controle de prova (um `<button>` nativo comum, com contador de
clique, focado e recebendo o mesmo `Enter` injetado) registrou o `keydown` mas
**zero cliques**. Em navegador real com teclado real, `<button>` nativo é ativado
por `Enter`/`Espaço` pelo próprio navegador. A ativação por teclado dos
`Pressable` deve ser confirmada em passo, junto da sessão humana de VoiceOver do
item 2 (B4). Foco, ordem, visibilidade e contenção — que são os critérios
literais do item 5 — foram verificados sem depender de eventos sintéticos.

## Resultado

Item 5 **aprovado** para os critérios declarados: ordem de foco lógica, foco
visível em todos os controles focáveis, ausência de armadilha de foco (Home
cicla e fecha; lição contém o foco) e alvos ≥ 44px (atalho da Home 56px, ação de
entrar 44px). Com o item 5 fechado, o Gate 2 passa a ter 4 de 5 itens aprovados;
resta apenas o item 2 (anúncio único no VoiceOver), que exige um humano com áudio
(task B4).

## Privacidade

Nenhum UUID de conta, token, resposta de usuário ou conteúdo clínico foi
incluído. O `dist/` do build web e quaisquer screenshots ficam fora do Git.
