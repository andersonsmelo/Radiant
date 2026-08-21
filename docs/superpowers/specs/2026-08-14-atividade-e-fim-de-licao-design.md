# Design — Tela de atividade e fim de lição

**Data:** 2026-08-14
**Sub-projeto:** 1 de 6 da reformulação guiada pelo EWA
**Estado:** aprovado pelo dono em sessão interativa; pronto para virar plano de implementação
**Base:** `HEAD` de publicação `0ceff49`

## 1. Por que esta passagem existe

O dono comparou o Radiant com o app EWA e apontou, na tela de atividade, que a
referência é "bem clean". A comparação com o código mostrou que a diferença não é
estilo, é repetição: o `QuizScreen` declara o mesmo progresso três vezes — barra,
texto `5/5` e um `ProgressRing` — dentro de um card de cabeçalho que a referência não
tem. A tela de conclusão da lição, no mesmo arquivo, acumula resultado, meta diária,
leitura do hábito, pedido de notificação e oferta de assinatura.

Esta passagem enxuga as duas telas e extrai a conclusão para um componente próprio.

Não é a reformulação inteira. A reformulação foi decomposta em seis sub-projetos e
este é o único sem bloqueio — os outros dependem de assets autorais, de decisão sobre
o contrato de privacidade ou da criação da marca. Os cinco restantes estão listados na
seção 8 e **não** são autorizados por este documento.

## 2. Decisões do dono

Seis decisões foram tomadas em sessão interativa e são premissas fixas deste design:

| # | Decisão | Escolha |
| --- | --- | --- |
| 1 | Fundo da celebração | Só a faixa do topo inverte; o corpo continua escuro |
| 2 | O que sai da conclusão | Saem push e paywall; meta diária e hábito viram uma linha |
| 3 | Regra das estrelas | Faixas de acurácia, pela melhor tentativa |
| 4 | Avaliação da aula | Entra, como evento na allowlist, em fila local |
| 5 | Segundo card de placar | XP ganho + acertos; nada de cronômetro |
| 6 | HUD na atividade | Corações entram na barra do topo |

Decisão 5 tem uma razão de domínio que deve sobreviver a este documento: o EWA
cronometra porque em idioma velocidade é fluência. Em radiologia, velocidade de leitura
de imagem não é virtude a premiar, e um cronômetro na tela empurraria o aluno a decidir
rápido exatamente onde olhar com calma é o comportamento correto.

## 3. Tela da atividade

### 3.1 Topo

Uma linha, três elementos: botão `X` de fechar à esquerda, `AnimatedProgressBar` no
meio, corações à direita.

**Removidos:**
- a `headerRow` atual, com o rótulo "Quiz"/"Quiz de Revisão" e o texto `5/5`;
- o `activeHeroCard` inteiro — título da lição, frase de instrução e `ProgressRing`;
- o bloco `<HUD compact>` renderizado acima do layout.

**Preservados:** `AnimatedProgressBar`, `QuizQuestion`, `QuizFeedback`.

O saldo de corações passa a ser renderizado dentro da linha do topo, não como HUD
separado. A mecânica de vidas continua legível durante a questão, que é o requisito —
o aluno perde vida ao errar e precisa ver isso acontecer.

### 3.2 Contagem de questões

Acima do enunciado, em texto discreto: `Pergunta 3 de 5`.

A barra e o texto coexistem de propósito e não são redundância: a barra dá proporção
(quanto falta), o texto dá posição exata (onde estou). O que era excesso no Radiant
eram o anel e o card, e os dois saem.

**Acessibilidade — ponto de atenção obrigatório:** a `AnimatedProgressBar` carrega hoje
`accessibilityLabel="Questão X de Y"`. Com a contagem visível na tela, o mesmo conteúdo
seria anunciado duas vezes pelo leitor. A contagem visível assume o papel e a barra
perde o rótulo, passando a ser decorativa para a árvore de acessibilidade.

### 3.3 Respiro

O enunciado ganha espaço em volta e os cartões de resposta ocupam a largura, seguindo o
que a referência faz. Isso toca `QuizQuestion.tsx`, que hoje é dono do enunciado e das
alternativas.

## 4. Tela de conclusão — `LessonSummary`

### 4.1 Faixa de celebração

Faixa superior com fundo invertido e o **Pixel** animado em expressão de celebração,
reaproveitando `pixelExpressions` e o que já existe em `pixel-mood`. **Nenhum asset
novo é necessário** — condição deliberada, porque arte autoral é justamente o que
bloqueia os outros sub-projetos.

Nenhum texto de leitura sobre a faixa. Ela carrega só a arte.

### 4.2 Corpo, sobre fundo escuro

Na ordem:

1. Estrelas ganhas (0 a 3), conforme a regra da seção 5.
2. Frase de parabéns variável, sorteada de um banco **por faixa de estrelas** — o que se
   diz a quem fez 3 estrelas não serve para quem fez 1. O banco é um módulo de
   constantes, com no mínimo três frases por faixa, e o sorteio não repete a frase
   imediatamente anterior. Faixa 0 não celebra: reconhece a tentativa e aponta a
   repetição como caminho.
3. Subtítulo fixo: "A lição foi concluída".
4. Dois cards de placar lado a lado: `+N XP nesta tentativa` e `N de M corretas`. Quando
   a conclusão não concede XP, o primeiro diz `Progresso registrado`; nunca `+0 XP`.
5. Progresso da unidade: rótulo, contagem `N de M lições` e barra. O cálculo reaproveita
   o que o `RewardScreen` já faz sobre o `JourneySnapshot` para a unidade ativa.
6. Avaliação da aula, em 5 estrelas. Uma lição é avaliada **uma vez**: dada a nota, a
   linha passa a exibi-la e o pedido não reaparece em repetições futuras daquela lição.
   Sem nota, a linha continua convidando. Não há como desfazer pela interface.
7. CTA `Continuar`, largura cheia, fixo na base.

### 4.3 O que sai da conclusão

- `PushOptInCard` — continua vivo na Home e na tela de Revisão.
- `PaywallOfferCard` — continua vivo no `CheckpointScreen` e no `RewardScreen`, que
  também satisfazem o gatilho `after_value_delivered` do plano de paywall.
- Os cards separados de meta diária e de "Leitura do hábito" viram **uma linha**.

Nada é removido do produto; os dois componentes saem **desta tela**, não do app.

## 5. Regra das estrelas

Função pura, sem I/O, testável com dois argumentos:

```
resolveLessonStars(correctAnswers, totalQuestions) -> 0 | 1 | 2 | 3
```

| Acurácia | Estrelas |
| --- | --- |
| `< 70%` | 0 |
| `>= 70%` | 1 |
| `>= 85%` | 2 |
| `100%` | 3 |

O piso de 1 estrela é `QUIZ_THRESHOLDS.PASSING_SCORE`, que já vale 70 em
`src/constants/quiz.ts`. A regra lê a constante em vez de repetir o número.

**Melhor tentativa:** a estrela exibida vem da melhor acurácia registrada para a lição,
comparando as tentativas persistidas em `LearningAttemptsRepository` (que guarda
`lessonId`, `correctAnswers` e `totalQuestions`, com teto de 500 registros) contra a
tentativa recém-encerrada. Repetir a lição melhora a marca — o aluno é convidado a
voltar, não punido por ter errado na primeira.

A função é pura de propósito: a trilha vai precisar da mesma regra para as estrelas sob
cada nó, no sub-projeto 5, e mover uma função sem I/O é barato.

**Estrelas e placar medem coisas diferentes, e a tela precisa deixar isso claro.** As
estrelas pertencem à **lição** e refletem a melhor tentativa; os dois cards de placar
pertencem à **tentativa que acabou de terminar**. Um aluno que fez 100% antes e 70%
agora vê três estrelas e um placar de 70% na mesma tela — o que é correto, e por isso os
cards são rotulados "nesta tentativa". Quando a tentativa atual melhora a marca, a
transição das estrelas é animada; quando não melhora, elas entram já no estado final,
sem sugerir ganho que não houve.

## 6. Avaliação da aula

Novo evento na allowlist tipada `TelemetryEventName`:

```
'lesson_rated'
```

Propriedades: `lessonId` e nota escalar de 1 a 5. **Sem texto livre, sem PII.** O evento
passa pela sanitização existente e fica na fila local; só sai do aparelho quando
`ENABLE_REMOTE_SYNC` for ligado, o que hoje tem `false` como padrão.

Isso cabe no `STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md` como ele está escrito. **Este
documento não revisa aquele contrato.**

## 7. Contratos executáveis

### 7.1 Identidade — sem exceção necessária

O `identity-palette-contract` proíbe telas de importarem a paleta clara primitiva
`colors`. Ele não proíbe cor clara: proíbe *aquela importação*, porque foi ela que
produziu os dois P0 de card branco em fundo escuro.

Portanto a faixa de celebração **não precisa de exceção**. Ela ganha um token próprio
dentro de `galaxyColors`, a paleta escura, e o contrato passa sem alteração. O ADR
`2026-07-27-identidade-visual-galaxy-dark` recebe um adendo registrando que a celebração
de fim de lição inverte uma faixa usando token da paleta escura — registro, não dívida.

### 7.2 Contraste

Nenhum texto de leitura sobre a faixa invertida, o que mantém o
`contrast-contract` fora de risco. Os textos do corpo continuam sobre fundo escuro,
com os tokens já validados.

### 7.3 Clearance de tab bar

`tab-bar-clearance-contract` cobre telas alcançáveis por aba. O quiz não é tela de aba;
o contrato não se aplica e não muda.

### 7.4 Portão

`npm run quality` inteiro, com os 13 validadores, é o portão desta passagem. Nenhum
validador é desligado, afrouxado ou contornado.

## 8. Persistência de tentativas compartilhada

`LearningAttemptRecorder` é o único escritor de tentativas para os dois caminhos de
conclusão. `LessonOutcomeService` entrega o tópico já resolvido da trilha; `QuizScreen`
resolve a unidade no snapshot antes de renderizar a melhor marca. Assim, `/learn` e
`/quiz` acumulam o mesmo histórico e `resolveBestLessonStars` pode comparar a tentativa
atual com as anteriores em ambos os caminhos.

Um deep link que aponte para lição ausente do snapshot não inventa tópico e não grava
uma tentativa. É a falha segura: uma estatística sem classificação correta é pior que
uma amostra ausente.

## 9. Fora de escopo

Não são tocados nesta passagem, e nada aqui os autoriza:

- `CheckpointScreen` e `RewardScreen`, embora também celebrem e também hospedem paywall.
  A convergência visual das três telas é pergunta legítima, para depois.
- Sub-projeto 2 — topologia de navegação (Estude + Perfil).
- Sub-projeto 3 — tela de Perfil do aluno.
- Sub-projeto 4 — marca no topo com símbolo de radiação.
- Sub-projeto 5 — arte da trilha, ícones ilustrados de HUD, dessaturação do nó
  bloqueado. Bloqueado por assets autorais; o P4 (HUD em Rive) segue fechado.
- Sub-projeto 6 — liga, ranqueamento e social. Bloqueado pelo contrato de privacidade.

## 10. Estrutura de código

Caminho escolhido pelo dono entre três: **extrair a conclusão**.

- `LessonSummary` vira componente próprio, com teste próprio.
- `resolveLessonStars` vira módulo puro, com teste próprio.
- `QuizScreen` fica com a atividade e a orquestração, e **encolhe** — hoje tem 707
  linhas carregando as duas telas.

O caminho descartado que merece registro: criar já um pacote de celebração compartilhado
para quiz, checkpoint e recompensa. Foi recusado por projetar para requisito que ainda
não existe; volta à mesa quando o sub-projeto 5 trouxer necessidade real.

## 11. Testes

Novos:

- `resolveLessonStars.test.ts` — as quatro faixas, os limites exatos (69/70, 84/85,
  99/100) e a seleção pela melhor tentativa.
- `LessonSummary.test.tsx` — renderização das estrelas por faixa, presença dos dois
  cards de placar, ausência de push e de paywall, e emissão de `lesson_rated` ao avaliar.

Atualizado:

- `QuizScreen.flow.test.tsx` — o fluxo muda de forma quando o cabeçalho sai e a
  conclusão vira componente.

Sob TDD, o vermelho planejado é observado rodando o teste alvo direto contra a build,
não gastando ciclo de `loop validate` — o orçamento de ciclos existe para falha real.
