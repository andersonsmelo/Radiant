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
| App Store | `1.3.1 (7)` | 🔴 **Rejeitado** — `2.1.0 App Completeness` | **2026-08-24** |
| Play — alpha fechado | `1.3.0 (4)` | Ativo · lista "Radiant Alpha" com 14 usuários · lançada 31/07 15:45 | **2026-08-24** |

> 🔴 **A rejeição chegou em 14/08 às 02:54 e ficou dez dias sem leitura.** Este
> documento afirmou "Aguardando revisão" o tempo todo, porque a leitura anterior
> era de 2026-08-09 e ninguém remediu. **A medição vencida não é um detalhe de
> higiene: ela sustentou uma afirmação falsa sobre o estado do lançamento.**
>
> **Não é defeito funcional.** É `Guideline 2.1 - Information Needed - New App
> Submission`: a Apple pede informação para conseguir avaliar. O plano de
> resposta, item a item, está em
> [`release/APP_REVIEW_REPLY_1.3.1.md`](release/APP_REVIEW_REPLY_1.3.1.md).
>
> ⛔ **Bloqueio anterior à resposta:** o contrato de licença do Apple Developer
> Program foi atualizado e **o titular da conta precisa aceitá-lo** antes de
> enviar qualquer atualização. Sem isso a resubmissão não sai, por melhor que
> seja a resposta.
>
> **Não medido:** o painel dos 12 testadores por 14 dias do Play não está exposto
> na visão geral da publicação nem na faixa; **não se sabe se o relógio começou**.

Git não substitui essa medição: a última tag é `v1.2.1`, de 2026-07-26, e `main`
está **392 commits à frente dela** (medido em 2026-08-24). Não existe tag
`v1.3.x` — o repositório não registra o que foi lançado. **O build em revisão é
anterior a toda a reformulação da trilha e do Perfil**; a próxima submissão
carrega o pacote inteiro.

## Bloqueios de lançamento, por latência

1. **iOS** — 🔴 **rejeitado, e a bola está do nosso lado.** Decidido em
   2026-08-24: **responder com um build novo do `main`, não com o `(7)`.** O
   binário em revisão saiu de `5b2c89e` e está **138 commits atrás**; ele ainda
   carrega `src/app/modal.tsx`, o template do Expo com o texto `This is a modal`
   em inglês — passivo direto sob `2.1.0 App Completeness`, que é o código da
   rejeição. A versão `1.3.1` está em estado editável, então o build novo é
   **anexado sem cancelar o envio**, e sai como `1.3.1 (8)` (EAS numera sozinho:
   `appVersionSource: remote` + `autoIncrement`).

   Sequência: titular aceita o contrato de licença → build de produção do `main`
   → instalar em iPhone físico e **verificar se abre** → anotar modelo e iOS →
   gravar o vídeo na mesma sessão → anexar o `(8)` e responder. Detalhe em
   [`release/APP_REVIEW_REPLY_1.3.1.md`](release/APP_REVIEW_REPLY_1.3.1.md).

   ⚠️ **`main` nunca passou por smoke físico** — a matriz real-device está no
   build `(5)` e nenhum passo do gate empacota o app. A sessão de gravação **é**
   o smoke.
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
| 3 | **Aba Perfil: Progresso + Missões + identidade** | ✅ em `main` (2026-08-21) — a barra tem duas abas |
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

- **A linha é contínua e vem preenchida** até a posição do aluno, com **uma**
  fronteira entre percorrido e pendente. Cada nó carrega o seu segmento, que
  transborda para a folga seguinte e costura no próximo — não há buraco nas
  alturas dos cartões. Duas versões erradas ficaram pelo caminho e as duas
  passavam nos testes: a listrada (cor por nó vizinho) e a picotada (segmento
  dentro de um `View` sem altura própria). Só o simulador pegou as duas.
- **Pílula `PRÓXIMO`** no nó atual, reconhecível sem ler rótulo.
- **Cabeçalho de estágio** no topo (nome, `N de M`, barra) no lugar do
  `JourneyHero`. Adendo registrado no `ADR-2026-08-13`: a fala esporádica do
  Pixel perdeu a única superfície.
- **Uma avaliação fecha cada estágio** nas quatro trilhas. Na trilha por
  competências, o estágio é a competência: as 12 atividades cobrem 5, e os 10
  itens da avaliação foram repartidos dois a dois, com o limiar de 80% intacto.

**Em aberto para o dono:** se o Pixel deve voltar a falar espontaneamente em
alguma superfície. Hoje ele só fala como reação a evento.

## A barra, medida em 2026-08-21

Duas abas: **Estude** (a trilha) e **Perfil** (identidade + Missões + Progresso).
O console de desenvolvimento vive fora das abas, em `/dev-console`, atrás de
`SHOW_DEV_TOOLS` — a separação veio antes da agregação de propósito.

O que a referência do EWA tem e o Perfil não tem: seguidores, chats e liga entre
pessoas. O `STUDENT_CHECKPOINT_PRIVACY_CONTRACT` não admite comparação entre
alunos; a liga é métrica local, por decisão de 2026-08-15.

**Requisito de loja preservado:** o cartão **Ajuda e informações** — Política de
Privacidade e Central de Suporte — continua no app, agora no fim da rolagem do
Perfil. Verificado em simulador.

**Armadilha registrada:** os flows do Maestro **não rodam** no `npm run quality`;
só o contrato deles roda, e ele afirma estrutura, não copy contra tela. Em
2026-08-21 uma mudança de copy quebrou 20 asserções em 9 flows sem nenhum sinal.
Ao mudar texto de tela, greppe `.maestro/` no mesmo passo.

## Varredura de QA — 2026-08-21, fechada em 2026-08-24

Relatório completo, com evidência de tela:
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).

O ciclo crítico inteiro funciona percorrido no simulador, sem erro de console:
`trilha → lição → conclusão com estrelas → checkpoint → conquista → próxima`.

**Fechado em 2026-08-24:**

- **`npm run ios:v2` entregava flags diferentes das que imprimia.** Um `.env`
  local vencia o `export` do script e o `EXPO_NO_DOTENV=1` — isolado por
  experimento controlado, não por leitura de código. `check-env-precedence.mjs`
  passou a verificar o efeito **antes** de o script prometer qualquer coisa, e
  cobre também `API_BASE_URL`, que era a chave mais perigosa. O `.env` da máquina
  do dono foi alinhado, com backup em `~/.radiant-env.backup-2026-08-24`.
- **`/dev-console` ganhou porta** no fim da rolagem do Perfil, atrás de
  `SHOW_DEV_TOOLS`. É porta, não controle: os controles seguem proibidos ali, e
  a distinção está travada por teste nos dois sentidos.
- **`/modal` removida** — era o modal literal do template Expo. Arquivos de rota
  e `Stack.Screen` declarados agora batem 1:1.
- **O kill switch foi acionado pela primeira vez** — ver a seção abaixo.

**Os órfãos foram resolvidos em 2026-08-24.** A lista de 13 escondia três
estados com remédios opostos, e a triagem por **tamanho e origem** — não por
grafo de imports — separou os três. Seis arquivos tinham **0 byte** e entraram
vazios no bulk `847a12d`: a "feature `annotation` inteira" era tela, componente e
serviço vazios, e a doutrina que protegia conhecimento de domínio não tinha
objeto. Dois eram duplicata de implementação viva (`models/sm2.ts` contra o SM-2
próprio do `SpacedRepetitionService`; `services/xp.ts` contra `XP_RULES` do
`GamificationService`). Três estavam mortos sem irmão vivo. **Os 11 saíram**, com
gate verde nas duas redes.

**Três não eram andaime, e continuam por decisão do dono:**

- `src/data/ai-catalog.ts` é **gerado** por `scripts/content/sync-catalog-to-app.mjs`
  — apagar seria desfeito pelo produtor. É "emitido e não consumido", e o remédio
  fica a montante: ligar a um consumidor, ou parar de emitir.
- `CompetencyMasteryService` e `ProductAnalyticsAdapter` são a **metade leitora**
  de pares cuja escrita está viva — `LearningEvidenceRepository` grava a cada
  atividade concluída, e ninguém lê. Apagar o leitor não remove código morto:
  converte escrita viva em fluxo sem leitor.

**Continua aberto, por decisão do dono:** o nó `/quiz` + `/review` — ambas sem
entrada, e o plano condiciona aposentar a primeira a confirmar que a segunda
cobre revisão (a Task 15 já confirmou, em 2026-08-15) —, e os quatro falsos kill
switches. **Atenção ao aposentar `/quiz`:** ela é alcançada por deep link em
`.maestro/rating-prompt.yaml`, que não roda no gate; um teste de "nenhum import
remanescente" é cego para isso por construção.

## O kill switch, medido em 2026-08-24

`ENABLE_LEARNING_ROAD` é o **único** kill switch real: `(tabs)/index.tsx`
renderiza `JourneyHomeScreen` quando ligado e `HomeScreen` quando desligado. É
lido em tempo de build, então só se aciona por novo build ou por OTA — que está
configurado (`updates.url`, canais `preview`/`production`).

Foi acionado e medido pela primeira vez. Funciona mecanicamente: sobe, navega,
sem crash. Mas a `HomeScreen` renderizava **inteiramente no tema claro**, e num
incidente isso é o pior comportamento possível — o aluno concluiria que o app
quebrou. Migrada para `semanticColors.galaxy`; nenhum componente compartilhado
foi tocado, porque `StatPill` já tinha prop `dark` e `ProgressRing` já usava o
contexto escuro.

**A guarda que deveria ter pego, e não pegava.** O `identity-palette-contract`
cobria a tela e passava verde: ela alcançava a paleta clara por
`semanticColors.light`, e `semanticColors` estava na lista de permitidos. O
contrato passou a proibir o **contexto** claro dentro das raízes de produto — e
a ignorar comentários, para não punir quem documenta a regra.

**Os outros quatro são rótulos, não interruptores.** `ENABLE_REVIEW`,
`ENABLE_GAMIFICATION`, `ENABLE_ONBOARDING` e `ENABLE_HEURISTICS` estão fixos em
`true` no código, sem leitura de env. Não são acionáveis nem por OTA. Ou viram
flags de verdade, ou mudam de nome — a pior hora de descobrir isso é durante um
incidente. **Decisão do dono, não tomada.**

## Defeito aberto

**`ENABLE_REMOTE_SYNC` não desliga o `AuthService`.** A flag gateia só a exibição
e o `SyncQueueService.flush`; o auth decide por `isApiConfigured()`, e
`bootstrap()` roda no startup do app, no Perfil e no Progresso. Com uma URL de
API configurada, "sync desligado" ainda autentica contra ela. Medido em
2026-08-24; registrado por decisão do dono, não corrigido — mexer no gate afeta
login, sync e o contrato de telemetria. Detalhe em
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).


**Resolvido junto com a trilha.** O CTA "Retomar etapa" renderizava atrás da tab
bar na Home de 2026-08-21; o painel que o continha foi substituído pela trilha, e
o botão deixou de existir como elemento fixo. A lição permanece: nenhum
validador estático enxerga tela.

## Duas redes, e o que cada uma NÃO cobre

O `npm run quality` do app e o `loop validate` do Loop são **conjuntos
diferentes**, e nenhum é superconjunto do outro. Em 2026-08-24 o
`docs-contract` do Loop estava reprovando havia **três dias** — desde o
arquivamento dos status datados em 2026-08-21 — e nada avisou, porque ele não
roda no gate do app. Ao mexer em documentação governada, rode os dois.

## Gate de qualidade

`npm run quality` em `radiant-app`: 18 passos (15 contratos), 717 testes / 100 suítes, visual QA
strict com 0 regressões. O CI (`.github/workflows/radiant-app-quality.yml`)
invoca **o comando inteiro**, não uma lista espelhada — desde 2026-08-15, quando
se descobriu que rodava 4 dos 16 passos.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```
