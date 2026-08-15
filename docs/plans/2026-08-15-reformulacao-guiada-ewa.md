# Radiant — Reformulação guiada pelo EWA (2026-08-15)

> **Status:** direção decidida pelo dono em sessão interativa de 2026-08-14/15.
> Decompõe-se em seis sub-projetos; **um** foi executado. Este documento é a fonte
> do raciocínio e do material de referência — o estado de execução vive no
> [status canônico](../EXECUTION_STATUS_2026-08-15.md).

## O que este documento é

O dono comparou o Radiant com o app **EWA** (aprendizado de idiomas) e enviou nove
referências em sequência, decidindo coisas ao longo do envio. Este documento registra
o que cada referência mostra, o que ele disse sobre ela, que decisão já existente do
repositório ela atravessa, e o que continua em aberto.

Existe porque sem ele o sub-projeto seguinte começa do zero: as referências são
imagens que não sobrevivem à sessão, e as decisões foram tomadas oralmente sobre elas.

**Isto não é um redesenho aprovado do produto.** É uma direção com um sub-projeto
entregue. `DESIGN.md` e `PRODUCT.md` descrevem o produto atual e permanecem válidos.

## Decomposição — seis sub-projetos

| # | Sub-projeto | Estado | Bloqueio |
| --- | --- | --- | --- |
| 1 | Atividade enxuta + conclusão de lição extraída | **Entregue**, em PR | — |
| 2 | Topologia de navegação: Estude + Perfil | **Decidido; spec pronta**, não implementado | — (pré-requisitos resolvidos em 2026-08-15) |
| 3 | Tela de Perfil do aluno | Não iniciado | Depende do 2 |
| 4 | Marca no topo com símbolo de radiação, cintilante | Não iniciado | A arte da marca precisa existir |
| 5 | Arte da trilha e ícones ilustrados de HUD | **Bloqueado** | Assets autorais do dono; o P4 (HUD em Rive) segue fechado |
| 6 | Liga, ranqueamento e social | Direção decidida; **não autorizado** | Precisa de spec própria; o contrato de privacidade deixou de bloquear |

Os dois pré-requisitos do sub-projeto 2 — o destino da Galáxia e a separação da
`ProgressScreen` — foram resolvidos em 2026-08-15. Ver
[`ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil`](../adr/ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md)
e a [spec do sub-projeto 2](../superpowers/specs/2026-08-15-topologia-navegacao-design.md).

A ordem não é arbitrária: 2 → 3 é cadeia estrutural, 4 depende de arte, e 5 e 6 só
reabrem por decisão explícita do dono sobre assets e sobre o contrato de privacidade.

## As referências

### R1 — Home do EWA

Fundo preto quase puro. Logo centralizada no topo; linha de stats horizontal (bandeira,
medalha, chama, moeda); percurso pontilhado serpenteando, cada nó com personagem
ilustrado em moldura circular, pílula de rótulo e três estrelas; CTA `Continuar`
flutuando na base; microfone e FAB de chat; tab bar de cinco itens.

**Dono:** "a página de home já é a página de estudos" — e pediu logo central "algo como
radiant e o símbolo da radiação de forma cintilante".

**Fato do repositório:** ~~a home **já é** a trilha desde `0ceff49` (2026-08-14).~~
**Corrigido em 2026-08-15 — esta afirmação era falsa.** `src/app/(tabs)/index.tsx` renderiza
`JourneyHomeScreen` com `ENABLE_LEARNING_ROAD` (padrão `true`), isso confere; mas
`JourneyHomeScreen` **não tem trilha**: renderiza HUD, `JourneyHero`, um card "Foco de hoje"
com três linhas de estatística e um botão "Continuar jornada". Quem renderiza `JourneyMap` é a
`GalaxyMapScreen` — a trilha mora na Galáxia.

**Dono decidiu em 2026-08-15:** *"no estude o que nós iremos fazer é uma trilha de forma
contínua"*. A trilha sobe para Estude, em rolagem contínua e com o currículo inteiro; a
Galáxia é absorvida. Ver
[ADR](../adr/ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md).

### R2 — Linha de stats

Ícones ilustrados e volumétricos, com brilho e badges de estado sobrepostos. O número
fica à esquerda do ícone, na cor do ícone.

**Dono:** "gostei muito dos emoitions deles." Leitura da sessão: refere-se a estes
ícones de HUD. **Não confirmado pelo dono** — pode significar as expressões dos
personagens.

**Colisão:** o P4 (HUD em Rive) está fechado com instrução explícita de **não**
substituir os SVG/Reanimated atuais por aproximação em código, reabrindo só quando os
`.riv` autorados pelo dono existirem.

### R3 — Nós da trilha

Personagem temático por aula, ilustração cheia sangrando para fora da moldura circular.

**Dono:** "imagens animadas em cada aula trilha fica muito mais atrativo."

**Custo a levantar:** uma ilustração animada por aula escala com o catálogo, não com o
código. Quem autora, em que formato, e o que a trilha mostra enquanto o asset de uma
aula não existe.

### R4 — Tab bar

Cinco itens com ícone ilustrado cheio e rótulo: Estude, Leia, Jogue, Tutor de IA,
Perfil. Barra rente à borda, fundo preto sólido, sem cartão flutuante.

**Dono decidiu:** "vamos manter Estude e Perfil, vamos agregar progressos e missão
dentro da aba perfil."

**Consequências:** a aba Perfil **não existe** hoje. `progress.tsx` e `missions.tsx`
deixam de ser rotas de aba. `tab-bar-clearance-contract.test.mjs` lista cinco telas de
aba e precisa ser reescrito com a nova topologia, não desligado. A barra do Radiant é
hoje um cartão flutuante (`position: absolute`, cantos arredondados, sombra); a do EWA é
rente e reta. **Não decidido:** o destino da Galáxia.

### R5 e R6 — Perfil do EWA

Cabeçalho de identidade (avatar editável, nome, pílula Premium, handle, seguidores);
CTA "Encontre novos amigos"; card POSIÇÃO com personagem colecionável e nível; cards
SEQUÊNCIA e LIGA lado a lado; TREINO DE PALAVRAS; CONQUISTAS em badges hexagonais com
data ou progresso; CHATS; e uma linha de totais (palavras, aulas concluídas, minutos).

**Dono:** "o aluno tem nome, nivel mostra a sequencia dos dias que ele esta estudando de
forma continua, a liga o que supoe que a um ranqueamento" e "as conquistas e uns
historicos de aulas tambem e interessante".

**O que já existe:** `streakDays`, `totalXp` e corações no `GamificationStore`;
`LearningAttemptsRepository` guarda até 500 tentativas com `lessonId`, acertos e total —
substrato pronto para o histórico de aulas.

**O que não existe:** nível, liga, ranqueamento, conquistas colecionáveis e identidade
social.

**Distinção a não perder:** o EWA mostra um **contador** de aulas concluídas (`279`),
não histórico. O que o dono pediu é uma lista do que foi estudado e quando — coisa
diferente, sem equivalente na referência.

**Colisões:** liga e ranqueamento pressupõem comparar alunos, logo identidade
persistente e coleta remota — o contrato de privacidade declara allowlist fechada, sem
PII, sem identificador persistente de aparelho, coleta remota desligada. Seguidores e
handle público ampliam o problema. Premium é monetização, fora de escopo visual.

**Achado que afeta o sub-projeto 2:** a `ProgressScreen` de hoje é metade tela do aluno,
metade console de desenvolvimento — tem `Learning Road`, `Beta Gate`, `Sync remoto`,
`Telemetry Debug`, `Modo`, `API` e badge de auth. Agregar Progresso dentro do Perfil,
como está, arrasta esse console para dentro do perfil do aluno. **A separação vem antes
da agregação.**

### R7 — Trilha com aulas bloqueadas

Ilustração dessaturada em cinza, pílula cinza com texto ainda branco e legível, cadeado
abaixo. Último nó do trecho é um teste. Rodapé fixo "🔒 PRÓXIMO NÍVEL".

**Dono:** "as aulas que ainda não estão liberadas ficam escuras e no final da trilha tem
um teste se o aluno passar ele ta habilitado para a proxima trilha".

**Quase tudo já existe:** `JourneyNodeCard` trata `locked` com cadeado, borda tracejada
e cor; o teste de fim de trilha é o tipo de nó `checkpoint`; `JourneyTrackUnlockService`
é a regra de destravamento sequencial, já ligada.

**Delta real:** dessaturar a **ilustração** do nó bloqueado, e a faixa "PRÓXIMO NÍVEL".

**Duas capturas enviadas em 2026-08-15** mostram o que a descrição não dizia, e acrescentam
delta:

- **o rótulo codifica estado por cor** — pílula cinza no bloqueado, verde no concluído, azul
  no próximo/disponível;
- **cada nó tem três estrelas abaixo do rótulo**, preenchidas por desempenho. O Radiant
  **não** tem estrelas no nó. E tem a regra pronta: `resolveLessonStars`, do sub-projeto 1,
  calcula essas três estrelas pela melhor tentativa, e hoje elas só aparecem na tela de
  conclusão. Ligá-las ao nó não precisa de asset nenhum;
- **a trilha é contínua e serpenteia** — os nós alternam entre esquerda, centro e direita,
  ligados por traçado pontilhado, direto sobre o fundo preto e sem moldura. O `JourneyMap` do
  Radiant é seccionado por unidade, com título quebrando entre os trechos, trilho reto central
  e tudo dentro de um card. Este é o delta maior, e virou decisão: ver a
  [spec do sub-projeto 2](../superpowers/specs/2026-08-15-topologia-navegacao-design.md).

**Armadilha:** "ficar escura" aplicado ao rótulo reprova o `contrast-contract` (WCAG
4.5:1). No EWA quem perde cor é a arte, não o texto. A leitura correta é dessaturação de
imagem, não opacidade de bloco — que é justamente a decisão já registrada em comentário
no `JourneyNodeCard`.

### R8 — Tela de atividade

`X`, barra de progresso, envelope. `Pergunta 5 de 5` discreto. Enunciado grande com
respiro. Três cartões de resposta largura cheia. Nada mais.

**Dono:** "dentro das aulas/atividades e bem clean o que eu acho muito interessante em
cima mostra quanto ainda falta pra ele terminar a atividade."

**Entregue no sub-projeto 1.**

### R9 — Fim de lição

Hero amarelo com mascote animado — única referência que abandona o preto, e só na faixa
do topo. Estrelas, frase variável, dois cards de placar, progresso da unidade, card de
conteúdo revisto com áudio, avaliação da aula, CTA.

**Dono:** "no final de cada lição aparece essa animação cada vez com uma frase diferente,
os pontos que ele ganhou. pedindo para ele avaliar a aula. tambem gosto bastante."

**Entregue no sub-projeto 1**, exceto o card de conteúdo revisto com áudio — que não tem
equivalente óbvio no domínio de radiologia e precisa de definição própria (rever a
imagem ou o achado da lição?).

## Perguntas abertas

1. ~~Destino da **Galáxia** na nova tab bar.~~ **Resolvida em 2026-08-15:** a Galáxia é
   **absorvida por Estude** e deixa de existir como superfície — a trilha, que morava nela,
   sobe para a aba. O `ADR-2026-08-13` é superado. Ver
   [ADR](../adr/ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md).
   *(Primeira resposta do mesmo dia — "vira superfície interna de Estude" — caiu junto com a
   premissa falsa de que a home já era a trilha.)*
2. A tab bar continua cartão flutuante ou vira barra rente? **Continua em aberto.** A spec do
   sub-projeto 2 mantém o cartão flutuante por não decidir isto — e enquanto ele flutuar,
   `tabBarClearance` continua sendo obrigação real de toda tela de aba.
3. O que "emoitions" designa em R2 — ícones de HUD ou expressões dos personagens.
4. Revogar ou não a decisão P4 (Rive/assets autorais), que R2 e R3 atravessam.
5. Autoria e formato dos assets animados por aula, e o que a trilha mostra sem eles.
6. Formato do "histórico de aulas": lista cronológica? por trilha? com desempenho?
7. ~~O contrato de privacidade é revisado para admitir ranqueamento, ou "liga" vira métrica
   local?~~ **Resolvida em 2026-08-15:** liga vira métrica local; o contrato fica intacto e a
   parte social (seguidores, handle) sai do escopo. Ver
   [ADR](../adr/ADR-2026-08-15-liga-como-metrica-local.md).
8. O prompt nativo de avaliação da App Store colide com a avaliação da aula na tela de
   conclusão — qual das duas sobrevive naquele momento?

## Fatos do repositório medidos durante o levantamento

- A home já é a trilha; o redesenho da jornada foi publicado em `0ceff49`.
- **Não existe** asset de logo, wordmark ou marca dentro de `radiant-app`.
- O topo da home tem três blocos antes da trilha (HUD, `JourneyHero`, header do mapa);
  o do EWA tem um.
- Contratos executáveis que a reformulação atravessa: `identity-palette-contract`,
  `contrast-contract`, `tab-bar-clearance-contract`, `pixel-screen-geometry-contract`,
  `pixel-face-anchor-contract` — todos dentro de `npm run quality`.
- `/quiz` **não tem ponto de entrada in-app**: só é alcançável por deep link. As telas
  do sub-projeto 1 só recebem tráfego real quando o sub-projeto 2 chegar.
