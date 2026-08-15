# Radiant — Execution Status (2026-08-15)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-14.md`](EXECUTION_STATUS_2026-08-14.md)** como estado
canônico. Ele cobre uma passagem só: o **sub-projeto 1 da reformulação guiada pelo app
de referência EWA** — enxugar a tela de atividade do quiz e extrair a conclusão de lição
para componente próprio. Não promove nenhum gate de release, não toca em publicação de
loja/OTA e não altera conteúdo curricular.

Em uma frase: a tela de atividade parou de declarar o mesmo progresso três vezes, a
conclusão da lição virou `LessonSummary` com estrelas de desempenho, frase variável e
avaliação da aula, e o `QuizScreen` encolheu de 707 para 488 linhas.

## Estado de publicação

**A passagem está publicada na branch, e não em `main`.** Medido em 2026-08-15
14:31: `feat/atividade-fim-licao` está em `e184be4`, **16 commits** à frente de
`f2156ad`, com upstream `origin/feat/atividade-fim-licao` e `0/0` contra ele — ou
seja, tudo enviado. `main` local e `origin/main` continuam idênticas em `f2156ad`,
então **nada desta passagem chegou à linha principal**; falta abrir o PR.

> **Correção de 2026-08-15 14:31.** Este parágrafo afirmava "nada desta passagem
> foi publicado", "14 commits" e "sem upstream configurado". As três coisas eram
> verdade quando foram escritas e deixaram de ser quando o push aconteceu, no
> mesmo dia. O registro fica porque a lição vale mais que o conserto: **estado de
> publicação envelhece entre a escrita e a leitura do documento.** Quem depender
> dele mede de novo, em vez de citar.

Isso importa porque este repositório é trabalhado por várias IAs em sessões
independentes. Como o push já aconteceu, outras sessões **enxergam** este trabalho
ao buscar a branch — mas não o veem em `main`. O estado deve continuar sendo
medido antes de uma alteração:

```bash
git rev-parse --short HEAD && git status --porcelain
git rev-list --left-right --count @{u}...HEAD
git rev-parse --short refs/heads/main refs/remotes/origin/main
```

## Escopo: 1 de 6

A reformulação inteira foi decomposta em seis sub-projetos. **Só o primeiro foi
executado.** Os outros cinco estão registrados e **não** são autorizados por este
documento:

| # | Sub-projeto | Bloqueio |
| --- | --- | --- |
| 2 | Topologia de navegação (Estude + Perfil, com Progresso e Missões dentro) | Destino da Galáxia indefinido; aba Perfil não existe |
| 3 | Tela de Perfil do aluno | Depende do 2 |
| 4 | Marca no topo com símbolo de radiação | Precisa da arte da marca existir |
| 5 | Arte da trilha e ícones ilustrados de HUD | Assets autorais do dono; P4/Rive segue fechado |
| 6 | Liga, ranqueamento e social | Colide com `STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md` |

## Entregas

Todas passaram os 13 validadores. Oito tarefas, cada uma com review próprio, mais um
review da branch inteira e duas ondas de correção.

| Entrega | Commit |
| --- | --- |
| Regra pura de estrelas por acurácia | `1bd71bb` |
| Banco de frases da conclusão por faixa | `f7d312c` |
| Token da faixa de celebração na paleta escura | `63c7ad4` |
| Avaliação da aula com evento na allowlist | `b91137c` + `522cf30` |
| Barra superior única da atividade | `d32edbe` |
| Topo da atividade com uma declaração de progresso | `07b67f7` |
| Componente `LessonSummary` | `adafca5` |
| Conclusão enxuta ligada, push e paywall fora | `86b3025` + `f74c3e8` + `94e0535` |
| Correções do review final da branch | `2a372d0` |
| Correções da verificação em simulador | `6ba6d25` |

## Decisões do dono registradas nesta passagem

1. A celebração inverte **só a faixa do topo**; o corpo continua escuro.
2. Push e paywall **saem da conclusão da lição** — seguem vivos nas outras superfícies.
3. Estrelas por **faixas de acurácia, pela melhor tentativa**: <70% → 0, ≥70% → 1,
   ≥85% → 2, 100% → 3.
4. Avaliação da aula entra como **evento `lesson_rated` na allowlist**, em fila local.
5. Segundo card de placar é **acertos, não cronômetro** — em radiologia, velocidade de
   leitura de imagem não é virtude a premiar.
6. Corações entram na **barra do topo** da atividade.

A decisão 1 não virou exceção ao ADR da identidade: o `identity-palette-contract`
proíbe a **importação** da paleta clara, não cor clara. A faixa usa
`galaxyColors.celebrationBand`, token dentro da paleta escura, e o ADR recebeu adendo de
registro.

## Evidência de runtime — simulador iOS

Em 2026-08-15, no simulador `Radiant iPhone 17 Pro — iOS 26.5`, o bundle JS da branch
foi regerado, compilado para bytecode Hermes e carregado no app instalado (a passagem
não tem alteração nativa). Percorrida uma lição inteira até a conclusão.

Confirmado na tela: topo da atividade com uma linha só; contagem discreta de questões;
sinalização de estado da alternativa preservada; faixa invertida sem texto com corpo
escuro; três estrelas; frase variando entre execuções; `+18 XP nesta tentativa` e
`3 de 3 corretas`; progresso da unidade correto; avaliação gravando e virando a nota
dada.

A verificação em simulador encontrou **três defeitos que 691 testes não pegaram** —
card exibindo `0 de 0 lições`, linha cortada pelo CTA fixo, e cinco estrelas sem rótulo
visível. Dois foram corrigidos em `6ba6d25`. Nenhum validador estático enxerga tela.

## Segunda passagem do dia: o gate de CI

Descoberto ao reconciliar a documentação com o repositório, e corrigido no mesmo
dia. **O CI rodava 4 dos 16 passos de `npm run quality`** — `lint`, `typecheck`,
`test` e `visual:qa`. Ficavam de fora os **doze contratos** e a variante estrita do
visual QA.

A consequência é maior do que a aritmética sugere: os testes que existem
exatamente para impedir regressão **não rodavam em pull request nenhum**. Só
rodavam para quem passasse pelo validador `app-quality` do Loop, localmente. Dois
defeitos reais fechados em 14/08 tinham sido pegos por contratos dessa lista — o
`Easing` do `react-native` dentro de um worklet Reanimated, e o contraste de texto.

O workflow passou a invocar `EXPO_NO_DOTENV=1 npm run quality`, um comando só. Não
foram acrescentados os doze passos: duas listas divergem no dia em que alguém
adicionar o décimo terceiro contrato e esquecer de espelhar, e um comando não tem
como divergir de si mesmo.

`ci-gate-parity-contract` impede a volta, com três casos: o workflow tem que
invocar o gate completo; rodar etapas soltas sem o gate reprova, que é a forma
exata como a divergência nasceu; e o próprio gate precisa manter ao menos 12
contratos e o `visual:qa:strict` — **paridade com um gate esvaziado não é
paridade**. O contrato ignora comentários ao ler o YAML, senão a prosa que o
explica o satisfaria. Verificado por mutação: com o workflow antigo restaurado,
dois dos três casos reprovam.

Gate agora: **17 passos, 13 contratos**. Commits `eaedd35` e `29fc168`.

> **Consequência a antecipar:** o PR desta branch será **o primeiro a rodar o gate
> completo no CI**, sobre 18 commits que nunca passaram pelos contratos em pull
> request. Se algo entrou quebrado, aparece ali. É o mecanismo funcionando, mas
> convém saber antes de abrir.

## Pendências abertas

**Decisão de produto, com o dono:** o prompt nativo de avaliação da App Store
(`RatingPromptService`) dispara na tela de conclusão, que agora também pede avaliação da
aula. Duas perguntas de cinco estrelas no mesmo instante.

**Registrado, não corrigido:** a regra da melhor tentativa está **inerte pela rota
`/quiz`**, porque esse fluxo nunca grava tentativa em `LearningAttemptsRepository` — o
único escritor é alcançado por `/learn`. `/quiz` também não tem ponto de entrada in-app
hoje. Os dois caminhos de entrega de lição precisam convergir no sub-projeto 2, que é
quando a tela passa a receber tráfego real. Detalhe na seção 5.1 da spec.

**Menores, de acabamento:** a seção 5.1 da spec foi inserida no meio da seção 5; a
varredura do contrato de privacidade casa interpolação de template como se fosse chave;
`+0 XP nesta tentativa` aparece quando a premiação é genuinamente zero; e as estrelas de
placar da conclusão não são anunciadas por leitor de tela.

**Encontradas nesta sessão, de outras passagens:** quatro runs do Loop presos em
`validating` (três de 12/08, um de 14/08 às 20:34), quinze sessões de cérebro abertas
desde 28/07, e uma worktree órfã em `.claude/worktrees/trusting-swirles-02a99e` em HEAD
destacado. Nenhuma delas pertence a esta passagem e nenhuma foi tocada.

### Higiene do repositório, remedida em 2026-08-16 07:25

Os dois primeiros itens acima foram reconferidos e **continuam verdadeiros**: 4 runs
em `validating` contra 502 fechados, e 15 sessões de cérebro ativas de 28/07 a 14/08
(a décima sexta ativa é a sessão da própria medição). Nenhuma é resíduo das passagens
de 14/08 e 15/08 — todos os runs e sessões delas fecharam.

**Publicação, medida no mesmo instante:** `HEAD` em `29fc168`, branch
`feat/atividade-fim-licao`, **2 commits ainda não enviados** ao upstream e **18 à
frente de `origin/main`**. Working tree limpa. `main` local e `origin/main` seguem
em `f2156ad`. **O PR ainda não foi aberto** — é o passo que falta para esta
passagem sair da branch.

### Pendências fora do app, verificadas em 2026-08-16

Medidas contra o repositório e o ambiente, não copiadas de registro anterior:

| Pendência | Estado medido |
| --- | --- |
| API pública em 502 | **Confirmado.** `api.radiant.ascendcreative.com.br` responde 502 na raiz e em `/health`. Três semanas assim. Nenhum perfil de build configura `API_BASE_URL`, e nenhum habilita sync remoto — o app não depende dela hoje. |
| Links absolutos no README do app | **Confirmado.** 7 links de `radiant-app/README.md` apontavam para a home local do dono. Os arquivos existem; os links só funcionam naquela máquina e vazam seu caminho em arquivo versionado. |
| Duplicado de fonte | **1 real:** `radiant-app/tsconfig 2.json`. Os outros 8 casados por `**/* 2.*` são artefatos gerados do CocoaPods, não dívida de higiene. |
| Nota de pendências do cérebro | **Desatualizada.** `07 Pendencias e riscos` está em `last_verified: 2026-07-24`. Ver abaixo. |

### O cérebro precisa de decisão do dono

A nota `07 Pendencias e riscos` tem 13 afirmações. Nove foram remedidas em
2026-08-15: **4 estão resolvidas** (working tree limpa; versão do manifesto igual à
do pacote em 1.3.1; lint caiu de 54 para 17 warnings; nenhum perfil habilita sync
remoto), **3 continuam verdadeiras** (API em 502; gate de CI — agora corrigido;
duplicado de fonte) e **2 estavam mal caracterizadas** (os READMEs não apontam para
documentos ausentes, o defeito são links absolutos; o baseline visual tem 32 itens,
não 122). **Quatro não foram remedidas** e não devem ser tratadas nem como
confirmadas nem como resolvidas: divergência do status antigo com a evidência E2E,
estado `app-failed` do E2E iOS com offline pendente, validação manual de
acessibilidade, e dívida editorial de 30/7/42.

O resultado está registrado como candidato de triagem
(`brain-candidate-bb2ed6aa-a516-4cc4-8ff9-e723999c4359`, tipo `pending`, status
`observed`), **sem tocar o vault**.

**Por que a nota não foi atualizada direto:** o único caminho da CLI que escreve nas
notas estruturais é `loop brain bootstrap apply`, e ele **sempre reescreve
`.loop/project.yaml`**, serializando de volta o config recebido. Esse arquivo tem 34
linhas de comentário em 205, e elas carregam conhecimento caro — entre outras, a
armadilha de grafia NFC/NFD que já custou um run inteiro. Um round-trip pelo
serializador apagaria todas. **A atualização da nota depende de decisão do dono:**
promover o candidato, ou editar a nota à mão.

Vale registrar o problema de fundo, porque ele não é desta nota: o canal de memória
**só apensa** em `05 Aprendizados validados`. As outras nove notas estruturais estão
todas em `last_verified: 2026-07-24`. A base parece saudável porque a única parte que
cresce é a única que se olha.

## Correção de pendências (2026-08-16)

Esta correção substitui a classificação de pendências acima; ela preserva a auditoria
de 15/08 como proveniência, mas não mantém afirmações já remedidas como risco atual.

### Removidas da nota de pendências

- **Working tree:** limpa na medição de 16/08; não é pendência.
- **Versão:** `radiant-app/app.json` e `radiant-app/package.json` declaram `1.3.1`.
- **Sync remoto em builds distribuídas:** nenhum perfil declara
  `EXPO_PUBLIC_API_BASE_URL`; os perfis distribuídos mantêm
  `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`, e o runtime ainda exige
  `isApiConfigured()`. A API em 502 não quebra o fluxo local-first atual.
- **Paridade CI/local:** resolvida no commit `eaedd35` (`ci: roda o gate completo e
  trava a paridade por contrato`). O workflow chama o mesmo `npm run quality` do
  gate local e o contrato de paridade impede voltar a etapas avulsas.

### Corrigidas nesta passagem

- Os sete links com caminho local em `radiant-app/README.md` agora são relativos.
  O contrato de documentação passa a rejeitar prefixos de home local nos documentos
  de estado governados, para impedir novo vazamento de caminho da máquina.
- O único duplicado de fonte real, `radiant-app/tsconfig 2.json`, foi removido. Os
  oito matches restantes de `**/* 2.*` pertencem a artefatos gerados do CocoaPods.
- Os números de qualidade corretos são **17 warnings de lint**, **32 itens no
  baseline visual** e **duas exceções**. São medições de baseline, não critérios de
  aceite; novos limites devem viver em contratos executáveis, não em prosa.

### Decisões de conclusão aplicadas em 2026-08-16

- **Uma avaliação por conclusão:** `QuizScreen` não chama mais o prompt nativo da App
  Store; a única avaliação apresentada é a nota da aula em `LessonSummary`.
- **Tentativas unificadas:** `LearningAttemptRecorder` recebe as conclusões de `/learn`
  e `/quiz`, preservando o tópico resolvido pela trilha quando ele já existe. A regra da
  melhor tentativa deixa de ser inerte no quiz.
- **Spec refinada:** a explicação de persistência compartilhada saiu do meio da regra de
  estrelas e agora é a seção 8 da spec; o texto de XP zero passou a ser `Progresso
  registrado`.
- **Contrato de privacidade:** a inspeção usa AST de TypeScript, portanto ignora uma
  chamada que só aparece como texto em template literal sem perder a detecção de
  propriedades abreviadas.
- **Acessibilidade:** as estrelas já possuem um único rótulo acessível, por exemplo
  `3 de 3 estrelas`, e o teste específico cobre esse contrato. Não foi necessário
  duplicar uma implementação que já era efetiva.
- **Worktree órfã:** `.claude/worktrees/awesome-northcutt-976686` não era uma worktree
  registrada: apontava para o `.git` da raiz e só continha configuração local. Foi movida
  de forma recuperável para a Lixeira em `awesome-northcutt-976686-reconciled-20260816`.

### Reconciliação Loop pendente de inventário público

O CLI público permite fechar uma sessão ou run **quando o ID é conhecido**, mas não
expõe listagem de runs/sessões para reconciliar IDs históricos desconhecidos. A sessão
ativa desta passagem será fechada pelo CLI. Não editar `.loop/` manualmente nem forçar
locks é deliberado: para fechar os demais estados com segurança é preciso adicionar um
comando público de inventário no Loop ou obter os IDs de quem os abriu.

### Pendências verdadeiras e acionáveis

| Pendência | Risco atual | Próxima ação |
| --- | --- | --- |
| API pública responde 502 na raiz e em `/health` | Médio: risco de prazo para a futura trilha remota, não do app local-first distribuído | Decisão do dono: recuperar pelo runbook de VPS ou declarar adiamento com data. Não inferir estado de VPS, banco ou serviços sem diagnóstico autorizado. |
| E2E iOS em `app-failed`; relaunch offline iOS e Android sem nova evidência | Alto para lançamento: local-first exige preservar progresso sem rede | Rodar os flows Maestro na configuração de release e registrar evidência datada; falha vira P0. |
| VoiceOver e TalkBack nos fluxos críticos | `needs_human` | Preparar e executar roteiro em aparelho físico; contratos estáticos não comprovam navegação falada. |
| Divergência do status histórico com a evidência E2E | Dependente do E2E | Reavaliar somente após a nova execução de E2E. |
| Dívida editorial: 30 classificações, 7 conceitos e 42 bundles | Baixo operacional, com risco de direitos/conteúdo | Medir contra `content-manifest/` e priorizar por direitos antes de reclassificar. |

### Nota estrutural do cérebro

As notas estruturais continuam com `last_verified: 2026-07-24`; contexto vencido é
somente registro, não evidência atual. A atualização não edita o vault diretamente:
o candidato de triagem já existente deve ser promovido apenas por um caminho Loop que
preserve a configuração comentada, ou após decisão explícita do dono sobre essa
transação. Até então, toda sessão deve comparar a data de verificação com a data
corrente antes de usar uma dessas notas como contexto.

## Registro histórico de higiene operacional (2026-08-16)

Este bloco preserva o relato da passagem de higiene. Ele **não é inventário atual**:
o CLI público do Loop não lista runs ou sessões sem ID, portanto os fechamentos
históricos não podem ser rechecados hoje como conjunto. A fonte atual para esse limite
é [Reconciliação Loop pendente de inventário público](#reconciliação-loop-pendente-de-inventário-público).
Nada em `.loop/` foi editado manualmente.

| Item | Antes | Agora |
| --- | --- | --- |
| Runs em `validating` | 4 (três de 12/08, um de 14/08) | Relato de fechamento pela CLI; requer IDs para nova verificação individual |
| Sessões de cérebro abertas | 15, de 28/07 a 14/08 | Relato de fechamento; o CLI público não fornece inventário para confirmação agregada |
| Worktree registrada e abandonada | 1, em `HEAD` destacado | Removida na passagem histórica, sem alterações ou stash |
| Restos de worktree em disco | 3 diretórios de abril | Os 2 vazios foram removidos; `awesome-northcutt-976686` foi depois confirmado como diretório aninhado, não worktree Git, e movido recuperavelmente para a Lixeira |

### Candidatos de triagem: 10 parados, 3 descartados

O inventário encontrou **dez candidatos de triagem** acumulados entre 27/07 e
15/08, **nenhum promovido nem descartado**. Cada um foi revisto individualmente
contra o estado atual. Três foram descartados por já não descreverem a realidade:

- **Roadmap de lançamento (27/07):** conteúdo já vive na §4 do roadmap, e o risco
  que ele afirmava — `ENABLE_REMOTE_SYNC=true` em produção — é falso.
- **Gate H3 (10/08):** o P0 que ele registrava, a tela de retomada virando beco sem
  saída a partir de `accessibility-extra-extra-large`, **foi corrigido**. O
  `ScrollView` em `radiant-app/src/app/_layout.tsx` carrega a medição no comentário,
  que é lugar melhor que um candidato.
- **Reverificação das 13 pendências (15/08):** absorvida por este documento, e uma
  das afirmações dela já foi superada pela correção do gate de CI.

Os sete restantes foram mantidos por registrarem conhecimento durável que não
existe em outro lugar. **A remoção foi feita apagando os três `candidates.json` à
mão**, com backup, porque a CLI não alcança candidato de sessão fechada — a
triagem exige a sessão dona ativa, e não há comando de reabrir. Isso foi
autorizado explicitamente pelo dono depois do risco exposto. A lacuna da CLI é a
causa; o contorno é o sintoma.

### Correção ao inventário de duplicados

A seção anterior afirma que os oito matches restantes de `**/* 2.*` pertencem a
artefatos gerados do CocoaPods. **Não pertencem.** A busca que produziu essa
conclusão estava limitada a `radiant-app/`. Fora dela existe
`radiant-api/src/server 2.ts` — cópia de 26/03 com 10 KB contra os 19 KB do
`server.ts` atual, de 03/04.

Ela é inerte para build (`radiant-api/tsconfig.json` exclui `src/**/* 2.ts`) e não
é rastreada. **Mas a invisibilidade dela é o achado que importa:** o padrão
`* 2.*` está em `.git/info/exclude`, que é **local da máquina** e não do
repositório. Em outro clone, ou no CI, esses arquivos aparecem — e ninguém que
inspecione o `git status` desta máquina vai saber que existem.

## Atualização documental pós-commit (2026-08-16)

O commit `949f013` (`fix: reconcile lesson completion flows`) consolidou a conclusão
de lição; as decisões funcionais já estão registradas em `Decisões de conclusão
aplicadas em 2026-08-16`. Esta atualização torna o estado operacional explícito: após
o commit, a worktree estava limpa e nenhuma mudança foi enviada a remoto.

Evidência do conteúdo do commit: **70 testes focados**, `npm run typecheck`, contrato
de documentação e o gate completo do Loop aprovados em um ciclo; o run
`run-1786878638931-6c5d2378` foi fechado. O commit não substitui os gates humanos
pendentes (E2E offline e VoiceOver/TalkBack), listados acima.

## Publicação de 2026-08-17

O parágrafo acima descrevia um estado que durou até hoje: `949f013` existia apenas
nesta máquina. A divergência era mensurável e passou despercebida por dois dias —
o branch estava **20 commits à frente de `origin/main`** enquanto o PR #5 carregava
**19**. O commit ausente era exatamente o que reconcilia a conclusão de lição
(`LessonOutcomeService`, `LearningAttemptRecorder`, `QuizScreen` e o contrato de
privacidade de telemetria), de modo que o PR aberto descrevia um trabalho que o
GitHub não tinha.

**A contagem de commits do PR contra o `ahead` do branch é o teste mais barato para
essa classe de divergência**, e nenhum gate a executa hoje: o gate de CI valida o
conteúdo do que foi enviado, não se o que existe localmente foi enviado.

| Item | Estado após esta passagem |
| --- | --- |
| `949f013` | Enviado para `origin/feat/atividade-fim-licao` |
| PR #5 | Aberto, `MERGEABLE`, sem revisão — **não integrado** |
| Gates humanos | E2E offline e VoiceOver/TalkBack seguem pendentes e bloqueiam o merge |

A publicação do branch **não** antecipa o merge: os dois gates humanos acima
continuam sendo a condição de integração em `main`.

## Documentos desta passagem

- Spec: [`superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md`](superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md)
- Plano: [`superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md`](superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md)

---

# Segunda sessão de 2026-08-15 — planejamento do sub-projeto 2

Sessão de planejamento, **sem alteração de código**. Resolve os dois pré-requisitos que
travavam o sub-projeto 2 e mais duas decisões que a medição do repositório levantou.

## Decisões do dono

| # | Questão | Escolha |
| --- | --- | --- |
| 1 | O que é a aba Estude | **A trilha**, em rolagem contínua |
| 2 | Alcance da trilha | O currículo inteiro numa rolagem só |
| 3 | Destino da Galáxia | **Absorvida por Estude**; deixa de existir como superfície |
| 4 | Console de desenvolvimento | Sai para rota própria fora das abas, sob `SHOW_DEV_TOOLS` |
| 5 | Convergência de lição | `/learn` adota os componentes novos; `/quiz` é aposentada |
| 6 | Liga (sub-projeto 6) | Métrica local — o aluno comparado com ele mesmo |

**A decisão 3 foi revista dentro da própria sessão.** A primeira resposta foi "a Galáxia vira
superfície interna de Estude", e ela se apoiava numa afirmação do documento de direção — "a
home já é a trilha" — que **não confere com o código**. `JourneyHomeScreen` não tem trilha:
tem HUD, hero e um card "Foco de hoje". Quem renderiza `JourneyMap` é a `GalaxyMapScreen`. Com
a premissa corrigida e a direção da trilha contínua dada pelo dono, a Galáxia passou a ser
absorvida, e o `ADR-2026-08-13` foi superado.

Viraram duas ADRs:
[topologia](adr/ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md) e
[liga](adr/ADR-2026-08-15-liga-como-metrica-local.md). A spec do sub-projeto 2 está em
[`superpowers/specs/2026-08-15-topologia-navegacao-design.md`](superpowers/specs/2026-08-15-topologia-navegacao-design.md).

**Tudo isso foi aprovado pelo dono em 2026-08-15**, e a spec virou
[plano de implementação](superpowers/plans/2026-08-15-topologia-navegacao.md): 18 tarefas em
quatro fases, cada fase um PR.

## Execução — 6 das 18 tarefas

| Fase | Tarefas | Estado |
| --- | --- | --- |
| A — console fora da tela do aluno | 1–3 | **Entregue** |
| B — trilha contínua | 4 de 4–8 | Serviço do percurso entregue; a trilha em si, não |
| C — duas abas, Perfil, Galáxia absorvida | 9–14 | Não iniciada |
| D — convergência de `/learn` e `/quiz` | 15–17 de 15–18 | **Entregue**; falta só aposentar `/quiz` |

**O que passou a existir para o aluno:** a lição deixou de terminar em silêncio. `/learn`
adota `QuizTopBar` e `LessonSummary`, e a regra da melhor tentativa acordou sem uma linha de
persistência nova — `/learn` já era o escritor de `LearningAttemptsRepository`. É o que faz o
sub-projeto 1 existir de verdade.

**Portão em cada passagem:** `npm run quality` inteiro. Última medição: 102 suítes, 705
testes, visual QA sem regressões, saída zero. Nenhum validador desligado.

**Nada foi verificado em simulador.** O que falta das fases B e C é quase inteiramente visual —
a trilha contínua, a faixa de próximo nível, as estrelas no nó, o Perfil. Foi onde a execução
parou de propósito: é o que só uma tela responde.

Correção registrada: a Task 3 do plano mandava consertar um card claro na `ProgressScreen`. Ao
abrir o bloco de estilo, `whiteCard` sempre teve `galaxyColors.surface` de fundo — branco a 5%
sobre o escuro, igual ao `GlassCard`. Não havia defeito; havia um nome herdado da era clara. O
defeito tinha sido inferido de um identificador sem abrir o estilo.

## Achado que corrige o registro acima

A seção "Pendências abertas" registra que a regra da melhor tentativa está inerte pela rota
`/quiz`. Isso está certo, mas é a metade menor do problema. A metade maior não estava
registrada em lugar nenhum:

**O caminho vivo de lição não tem tela de conclusão.** O `LessonFlowScreen` (`/learn`),
terminada a última interação, chama `LessonOutcomeService`, marca o nó e executa
`router.replace('/(tabs)')`. O aluno acaba a lição e volta em silêncio para a aba — sem
estrelas, sem XP, sem frase, sem avaliação.

Ou seja: a tela que o aluno alcança não celebra, e a que celebra o aluno não alcança. Todo o
fim de lição do sub-projeto 1 está montado em `/quiz`, que não tem ponto de entrada in-app.

Isso reposiciona a prioridade. A convergência não é a dívida secundária que a spec do
sub-projeto 1 previu — é o que faz o sub-projeto 1 existir para o aluno. Ela é a parte mais
valiosa do sub-projeto 2, à frente do rearranjo da barra.

## Estado de publicação

`main` e `origin/main` continuam em `f2156ad`. O sub-projeto 1 continua no **PR #5**
(`feat/atividade-fim-licao`, 16 commits), aberto e não mergeado. O planejamento do
sub-projeto 2 é empilhado sobre ele, na branch `claude/task-observer-loop-superpowers-ybpyrt`.

## O que esta sessão não pôde fazer

Rodou num contêiner Linux remoto. Três itens do contrato do `AGENTS.md` não são executáveis
nele:

- **cérebro do Loop** — `brainPath` aponta para `/Users/anderson/Documents/obsidian/…`, que
  não existe aqui, e a CLI `loop` não está instalada. Nenhuma sessão de leitura foi aberta e
  nenhum run de escrita foi aberto ou fechado. **O aprendizado desta sessão ainda precisa ser
  gravado numa máquina com o vault;**
- **verificação em simulador** — é Linux, não há simulador iOS;
- por isso mesmo, **nenhuma linha de código de produto foi escrita**: a spec exige que a
  implementação feche em máquina com simulador, e a passagem anterior provou o porquê — a
  checagem visual achou três defeitos que 691 testes não pegaram.

Foi possível, e foi feito: `npm ci`, `npm run typecheck` limpo, e os contratos
`tab-bar-clearance`, `contrast`, `identity-palette` e `pixel-screen-geometry` passando na base
`e184be4`.
