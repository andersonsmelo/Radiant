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

**A aba Galáxia continua existindo.** Os documentos do sub-projeto 2 registram a
decisão de absorvê-la na trilha contínua, mas nenhum código implementa isso ainda.

## Reformulação guiada pelo EWA — 2 de 6

| # | Sub-projeto | Estado |
| --- | --- | --- |
| 1 | Atividade enxuta e conclusão de lição | ✅ em `main` |
| 2 | Percurso contínuo, conclusão, dev-console | ✅ em `main` — topologia de navegação **decidida, não implementada** |
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

## Defeito aberto

**CTA "Retomar etapa" renderiza atrás da tab bar na Home.** Observado em
2026-08-21 no simulador `Radiant iPhone 17 Pro — iOS 26.5`, com o app rodando
`main`. O botão fica inalcançável ao toque. Nenhum dos 712 testes pega isso —
validador estático não enxerga tela.

## Gate de qualidade

`npm run quality` em `radiant-app`: 17 passos (14 contratos), 712 testes / 102 suítes, visual QA
strict com 0 regressões. O CI (`.github/workflows/radiant-app-quality.yml`)
invoca **o comando inteiro**, não uma lista espelhada — desde 2026-08-15, quando
se descobriu que rodava 4 dos 16 passos.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```
