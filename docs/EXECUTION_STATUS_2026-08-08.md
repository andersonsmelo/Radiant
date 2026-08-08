# Radiant — Execution Status (2026-08-08)

Este documento **substitui [`EXECUTION_STATUS_2026-08-07.md`](EXECUTION_STATUS_2026-08-07.md)**
como estado canônico.

Ele nasce de um dia inteiro de execução em laço, e o que mais vale registrar não
é o que foi feito — é **o defeito que apareceu quatorze vezes**: o backlog
errava, sistematicamente, o campo **tamanho**.

"Não afeta o usuário" — afetava, e o usuário via. "Trabalho pequeno, sem decisão
pendente" — teria apagado progresso salvo no aparelho. "Some sem decisão de
ninguém" — quebrava a proveniência de quatro lições. "Precisa de motor de IA" —
precisava de um `grep`. Estado e bloqueio este projeto já sabia reverificar;
**tamanho é o único campo que pede ao leitor para verificar menos**, e por isso é
o que mais errou.

## O lançamento iOS não depende da F2, e isso reordena a prioridade

A exigência de **12 testadores por 14 dias corridos** é do **Google Play**, para
conta pessoal (A1). A Apple não tem equivalente. As tasks F3, F4 e F5 do roadmap
misturam as duas lojas — questionário de acesso a produção e rollout faseado são
do Play — e **não travam a App Store**.

Estado do iOS, medido em 2026-08-08:

| | |
| --- | --- |
| Build | `1.3.1 (5)` no TestFlight, **Pronta para envio** |
| Ficha | completa, menos privacy labels |
| Evidência de aparelho | fechada — smoke em 2026-08-05, B4/VoiceOver em 2026-08-06, Gate 2 em 5/5 |
| Gate de release | `tsc` exit 0, `eslint` 0 erros, **jest 56 suítes / 330 testes** |
| Falta | privacy labels, decidir a build, e acionar **Adicionar para revisão** |

Folha de transcrição campo a campo, com evidência por linha:
[`2026-08-08-ios-preflight.md`](store/2026-08-08-ios-preflight.md).

**A E3 estava errada sobre o que declarar.** Ela manda "declarar Sentry (crash
data)". Medido: o Sentry **não roda em produção**. `bootstrap.ts:10` exige
`ENABLE_CRASH_REPORTING && SENTRY_DSN`, e o perfil `production` do `eas.json`
não define nenhuma das duas — a primeira cai no default `false`, a segunda em
string vazia. Somado a `API_BASE_URL` ausente nos cinco perfis, sync desligado,
push **sem token** (só `requestPermissionsAsync`, nunca `getExpoPushTokenAsync`)
e armazenamento local, a resposta ao questionário é **"Data Not Collected"** —
não uma categoria detalhada.

A única checagem que o repositório não responde: variáveis `EXPO_PUBLIC_*` podem
vir de segredo do EAS. `npx eas secret:list` resolve antes de responder.

## O que fechou em 2026-08-08

### O mapa de galáxias deixou de estar vazio

Era a maior distância entre o produto e o conteúdo dele: **5 corpos celestes,
um só com conteúdo, duas galáxias travadas**, enquanto as 16 lições `ai-lesson:`
embarcavam numa trilha plana desconectada do mapa. Quem abria o app via mundos
vazios.

Agora são **6 corpos com as 16 lições**, três galáxias `active`, e só
`galaxy-casos` travada — corretamente, porque não tem conteúdo.

A causa foi tratada junto do sintoma. A divergência existia porque
`ai-catalog.ts` é **gerado** e `galaxy-catalog.ts` era escrito à mão, com o
vínculo lição→planeta mantido nos dois lugares. A linha de corte mudou: **fato
de governança é gerado** (`galaxy-nodes.ts`, do mapa de taxonomia), **decisão de
design é autoral** (cor, superfície, posição).

### A taxonomia ganhou o eixo técnico

`galaxy-tecnologia` e seis planetas; as 16 lições saíram de `taxonomyId: null`.
Nós de taxonomia: **15 → 22**, por soma explícita. O desenho aprovado corrigiu
de "21" para 22 — a conta somava os seis filhos e esquecia o pai.

`galaxy-tecnologia` não era id novo: já existia no app, travado e vazio, com
título *"Tecnologia em Imagem"*. Preencher o slot, herdando o título, converteu
uma divergência em convergência.

### A D4 encolheu de 30 para 19

Três passos, nesta ordem, e cada um destravou o seguinte:

1. **Contrato** — `starId` virou nulável no schema, no `validate-foundation`, no
   `classify_excerpt` **e na guarda irmã do `classify_source`**. Antes disso
   nenhum excerto conseguia pousar num planeta técnico: não era classificação
   ruim, era exceção antes de classificar, e a prova de mutação mostra na forma
   do vermelho — `ERROR`, não `FAILURE`. A confiança precisou renormalizar de
   `0.5/0.3/0.2` para `0.625/0.375`, senão planeta sem estrela cairia em revisão
   **por construção**.
2. **Vocabulário** — o classificador aprendeu o eixo técnico. Aqui houve uma
   armadilha que quase passou: um vocabulário mais agressivo levava a fila de 30
   para **17**, manchete melhor, mas **12 dos 20 resgates pousavam em
   `planet-profissao-e-aplicacoes`** numa fonte onde profissão é uma lição só. A
   causa era `"técnico em radiologia"`, presente em **77 dos 109 excertos**
   porque é o **cabeçalho de página**. A métrica de contagem premiava a
   colocação errada.
3. **Regeneração** — classificação no disco de 79/30 para 87/22, e depois os
   quatro fragmentos de extração saíram: **105 excertos, zero abaixo de 80
   caracteres, `needs-review` em 19**.

O revisor de domínio passa a receber **19 itens em vez de 30**, e depois do
dicionário consertado — que é exatamente o que a triagem de 2026-07-31 pedia
para não fazer ao contrário.

### As trilhas pararam de mentir

`LessonCatalogService.getTracks` alimenta ProgressScreen, JourneyHomeScreen, home
e quiz, e entregava uma trilha chamada **"Abdome" contendo preservação de
alimentos por irradiação**. O backlog dizia que isso "não afeta o usuário".
Afetava.

Corrigido só em `title`, `goal` e `description`. `id`, `slug` e `lessonIds`
ficaram intactos de propósito: `JourneyDefinitionService` deriva
`node:checkpoint:<slug>` e `node:reward:<slug>` **da contagem de lições da
trilha**, e esses ids ficam em `completedNodeIds` no aparelho. Reagrupar
apagaria checkpoints e recompensas já concluídos, sem erro nenhum.

### Três dívidas de teste declaradas

A mordida da trava do `eyebrow` estava registrada como "exige pôr um teto em
`SpeechBubble.tsx`". Não exigia: a mutação roda em segundos **fora de qualquer
run**, dá 1 vermelho no caso certo e reverte. O adjetivo "geométrica" da claim
`:5` saiu — medido nos dois excertos, ele vinha do vizinho `p53:c1`, não do
ancorado `p54:c1`, que carrega os números inteiros.

## Aberto

**Esta lista é um recorte: a frente viva do lançamento iOS mais o que espera
decisão do dono.** Não é o inventário. O registro completo é o roadmap:

```bash
grep -n '^- \*\*[A-F][0-9]' docs/plans/2026-07-27-radiant-launch-roadmap.md
```

### Caminho iOS — a frente prioritária

1. **Privacy labels** — folha pronta em
   [`2026-08-08-ios-preflight.md`](store/2026-08-08-ios-preflight.md). Console.
2. **Build nova** — a `1.3.1 (5)` está **21 commits de app atrás** e não tem o
   mapa cheio nem a correção das trilhas. Recomendado buildar antes de submeter.
3. **Adicionar para revisão** (F4) — botão disponível desde 2026-08-05, nunca
   acionado. Depois, App Review de 24–48h e liberação manual (F5).

### Caminho Android — represado pelo relógio

**F2** é o caminho crítico e é humano: 12 testadores participando por 14 dias, e
o relógio **não começou**. Na última leitura do Console (2026-08-03), 2
participavam de 14 vinculados. Só o dono mede o número atual.
**E4/IARC** segue pendente do lado Play; o lado Apple fechou em 2026-08-05.

### Ações de um passo, do dono

Enviar os commits da branch — conte com
`git log --oneline '@{upstream}..HEAD'`; o upstream é
`origin/codex/wave1-hardening-api-smoke`, **não** `main`, que não existe como ref
local. **A5**, a service-account key do Play. O pedido ao INCA, com rascunho
pronto. Apagar `~/.lmstudio` e instalar o Ollama — **já não bloqueia a D4**,
destrava só a Task 3. E a decisão de produto do `checkHeuristics`, agora sobre
nudges que fazem o que dizem.

### Engenharia aberta, fora do caminho crítico

**D1** decidida e não implantada, domínio em 502 — endpoint morto degrada para o
catálogo da release. **B5 Android**, **C4**, **C5**, **C6** exigem aparelho ou
janela de host. O reagrupamento das trilhas do wave-1 exige migração de
progresso, descrita na fila. Os slugs `torax`/`abdome` seguem incoerentes com os
títulos novos, e são load-bearing para id de nó.

## Uma armadilha nova de fechamento, a oitava

`context.excludes` **não isenta do guarda de escopo**. Custou um run em
`needs_human` e está registrada no [`AGENTS.md`](../AGENTS.md): o `excludes`
decide o que entra no **contexto**; o guarda compara o **repositório inteiro**
contra a baseline. Nem ele nem o `.gitignore` protegem. Só `--files` protege —
declare até subproduto local fora do índice.
