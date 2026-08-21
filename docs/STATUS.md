# Radiant — Status

**Este é o único documento de estado vivo do projeto.** O caminho
(`docs/STATUS.md`) não tem data no nome de propósito: qualquer configuração,
README ou skill que injete contexto automaticamente deve apontar para cá e para
mais nada.

O histórico datado está em [`archive/`](archive/) — 21 arquivos, de
`EXECUTION_STATUS_2026-04-05` a `EXECUTION_STATUS_2026-08-15`. Eles continuam
sendo a evidência de cada passagem e são citados pelos ADRs e planos. **Não
escreva um novo.** Edite este.

---

## Como este documento envelhece

Toda afirmação abaixo tem uma **data de medição** e, quando existe, o **comando
que a remede**. Contagem escrita envelhece; comando não. Se você chegou aqui
para decidir alguma coisa, remeça antes de citar.

```bash
git rev-parse --short HEAD && git status --porcelain
git branch -a && gh pr list --state open
```

---

## Publicação — o que está nas lojas

| Loja | Artefato | Estado | **Medido em** |
| --- | --- | --- | --- |
| App Store | `1.3.1 (7)` | Aguardando revisão | **2026-08-09** |
| Play — alpha fechado | `1.3.0 (4)` | Ativo · 14 vinculados, 2 opt-ins | **2026-08-03** |

> ⚠️ **As duas leituras estão vencidas.** Em 2026-08-21 a App Review estava sem
> medição havia 12 dias e os opt-ins havia 18. Nenhum agente consegue medir isso:
> os dois números vivem em console, não em Git. **É a primeira coisa que o dono
> deve fazer ao abrir o projeto.**

Git não substitui essa medição: a última tag é `v1.2.1`, de 2026-07-26. Não
existe tag `v1.3.x` — o repositório não registra o que foi lançado.

## Bloqueios de lançamento, por latência

1. **iOS** — decisão da App Review, depois liberação manual (F5). Sem ação de
   engenharia no intervalo.
2. **Play** — ≥12 testadores participando por 14 dias corridos (F2). O relógio
   não havia começado na última leitura. Exigência de conta pessoal; não há
   atalho de engenharia.
3. **Play** — questionário IARC (E4), aparelho Android físico (C4), TalkBack (C5).

O go/no-go item a item vive em
[`release/CHECKLIST_RELEASE_V1.3.md`](release/CHECKLIST_RELEASE_V1.3.md); o que
está executável agora, em [`FILA.md`](FILA.md).

## Estado do repositório — medido em 2026-08-21

Uma branch: `main`. Nenhum PR aberto. Nenhum worktree.

A unificação de 2026-08-21 fechou uma divergência de duas sessões paralelas de
IA que trabalharam o mesmo dia sem se ver:

- **PR #5** (`feat/atividade-fim-licao`, sub-projeto 1/6) — mergeado. Estava
  OPEN, MERGEABLE e com CI verde havia 4 dias.
- **`c7cba6a`** — bugfix da trilha que **nunca havia sido enviado ao remoto** e
  por isso ficou de fora do PR #5. Recuperado por cherry-pick.
- **PR #6** (sub-projeto 2/6) — resgate de uma branch órfã com 1.524 linhas de
  produto e nenhum PR: `JourneyCurriculumService` (percurso contínuo),
  `LessonFlowScreen` terminando em conclusão, `DevConsoleScreen` fora da tela do
  aluno, `ProgressScreen` enxugada.
- 7 branches mortos podados (local e remoto).

**A aba Galáxia deixou de existir em 2026-08-21.** A barra tem Estude, Progresso
e Missões. `JourneyCurriculumService`, que chegou no merge do sub-projeto 2 sem
nenhum consumidor, passou a alimentar a trilha contínua da aba Estude.

A verificação que autorizou a remoção achou algo mais forte que cobertura: o
único nó de lição da Galáxia apontava para um `lessonId` inexistente no catálogo
— **a cadeia já estava quebrada.** `TrailCoverage.test.ts` agora guarda a
invariante que passou a valer: toda lição do catálogo é alcançável pela trilha.

## Reformulação guiada pelo EWA — 2 de 6

| # | Sub-projeto | Estado |
| --- | --- | --- |
| 1 | Atividade enxuta e conclusão de lição | ✅ em `main` |
| 2 | Percurso contínuo, conclusão, dev-console | ✅ em `main` |
| 2b | **Estude é a trilha; Galáxia absorvida** | ✅ em `main` (2026-08-21) — aba renomeada, Galáxia removida do app, trilha contínua ligada |
| 2c | **Caminho preenchido, cabeçalho de estágio, avaliação por competência** | ✅ em `main` (2026-08-21) |
| 3 | Tela de Perfil do aluno | depende do 2 |
| 4 | Marca no topo com símbolo de radiação | precisa da arte existir |
| 5 | Arte da trilha e ícones de HUD | assets autorais do dono; Rive fechado |
| 6 | Liga, ranqueamento e social | colide com o contrato de privacidade |

## O ponto cego do gate — medido em 2026-08-21

O sub-projeto 2 chegou à `main` com `src/app/dev-console.test.tsx`. O
`require.context` do expo-router varre `src/app` inteiro para montar as rotas,
então esse arquivo entrava **no bundle** e arrastava
`@testing-library/react-native`, que pede o módulo `console` do Node. **O app
não abria** — tela vermelha na inicialização.

Os 16 passos do gate passaram todos. Não por descuido: **nenhum deles empacota o
app.** Lint, typecheck, 712 testes e visual QA strict são compatíveis com um
binário que não inicia.

Corrigido em `3dc3388`: o teste foi para `src/test/routes/` e a regra virou o
contrato `route-tree-purity-contract` (14º do gate), que falha se qualquer
`*.test.*` aparecer sob `src/app`. A falha foi provada com uma sonda.

**A lacuna continua aberta.** Só a abertura real do app pega essa classe de
defeito, e ela não está em nenhum passo automatizado. Até estar, subir o app no
simulador faz parte de verificar uma passagem.

## A trilha, medida em 2026-08-21

- **O caminho existe e vem preenchido** até a posição do aluno, com **uma**
  fronteira entre percorrido e pendente. A primeira versão pintava trecho a
  trecho pelo estado do nó acima e saiu listrada no simulador — passou nos
  testes porque era coerente com a própria especificação.
- **Pílula `PRÓXIMO`** no nó atual, reconhecível sem ler rótulo.
- **Cabeçalho de estágio** no topo (nome, `N de M`, barra) no lugar do
  `JourneyHero`. Adendo registrado no `ADR-2026-08-13`: a fala esporádica do
  Pixel perdeu a única superfície.
- **Uma avaliação fecha cada estágio** nas quatro trilhas. Na trilha por
  competências, o estágio é a competência: as 12 atividades cobrem 5, e os 10
  itens da avaliação foram repartidos dois a dois, com o limiar de 80% intacto.

**Em aberto para o dono:** se o Pixel deve voltar a falar espontaneamente em
alguma superfície. Hoje ele só fala como reação a evento.

## Defeito aberto

**Resolvido junto com a trilha.** O CTA "Retomar etapa" renderizava atrás da tab
bar na Home de 2026-08-21; o painel que o continha foi substituído pela trilha, e
o botão deixou de existir como elemento fixo. A lição permanece: nenhum
validador estático enxerga tela.

## Gate de qualidade

`npm run quality` em `radiant-app`: 17 passos (14 contratos), 704 testes / 99 suítes, visual QA
strict com 0 regressões. O CI (`.github/workflows/radiant-app-quality.yml`)
invoca **o comando inteiro**, não uma lista espelhada — desde 2026-08-15, quando
se descobriu que rodava 4 dos 16 passos.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```
