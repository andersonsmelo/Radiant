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

**Nada desta passagem foi publicado.** O trabalho vive na branch local
`feat/atividade-fim-licao`, 14 commits à frente de `f2156ad`, **sem upstream
configurado**. `main` local e `origin/main` continuam idênticas em `f2156ad`.

Isso importa porque este repositório é trabalhado por várias IAs em sessões
independentes: enquanto o push não acontecer, nenhuma outra sessão enxerga nada do que
está descrito aqui. O estado deve continuar sendo medido antes de uma alteração —
`git status --porcelain`, `git rev-parse --short HEAD` e a comparação com `origin/main`.

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

## Documentos desta passagem

- Spec: [`superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md`](superpowers/specs/2026-08-14-atividade-e-fim-de-licao-design.md)
- Plano: [`superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md`](superpowers/plans/2026-08-14-atividade-e-fim-de-licao.md)
