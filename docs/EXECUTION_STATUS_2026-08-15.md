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
| Links absolutos no README do app | **Confirmado.** 7 links de `radiant-app/README.md` são caminhos `/Users/anderson/…`. Os arquivos existem; os links só funcionam na máquina do dono e vazam o caminho da home num arquivo versionado. |
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

## Documentos desta passagem

- Spec: [`superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md`](superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md)
- Plano: [`superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md`](superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md)
