# ADR — A liga é métrica local, não ranqueamento entre alunos (2026-08-15)

**Status:** **aprovada pelo dono em 2026-08-15**; não implementada
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** sessão interativa de planejamento do sub-projeto 2 da reformulação
guiada pelo EWA

## Contexto

Nas referências R5 e R6 do EWA, o perfil traz um card **LIGA** ao lado de SEQUÊNCIA, além de
seguidores, handle público e um CTA "Encontre novos amigos". O dono observou que "a liga o que
supoe que a um ranqueamento".

Ranquear pressupõe comparar alunos entre si, e comparar alunos pressupõe identidade
persistente e coleta remota. O `STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md` declara allowlist
fechada de eventos, sem PII, sem identificador persistente de aparelho e coleta remota
desligada por padrão. Seguidores e handle público ampliam a colisão em vez de contorná-la.

Essa colisão bloqueava o sub-projeto 6 inteiro. A pergunta em aberto era binária: o contrato é
revisado para admitir ranqueamento, ou "liga" vira outra coisa?

## Decisão

**A liga vira métrica local: o aluno comparado com ele mesmo.**

- o `STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md` fica **intacto** — allowlist fechada, sem PII,
  sem identificador persistente, coleta remota desligada;
- a "liga" passa a comparar o desempenho do aluno com o próprio histórico — a semana corrente
  contra as semanas anteriores dele;
- ranqueamento entre alunos, seguidores e handle público **não entram** no produto por esta
  decisão.

## Consequências

- o sub-projeto 6 deixa de estar bloqueado pelo contrato de privacidade, e nenhuma revisão de
  contrato é necessária para ele avançar;
- **o sub-projeto 6 continua não autorizado.** Esta ADR fixa a direção; não autoriza a
  construção, que precisa de spec própria;
- o substrato já existe e não precisa de coleta nova: `streakDays` e `totalXp` no
  `GamificationStore`, e até 500 tentativas com `lessonId`, acertos e total no
  `LearningAttemptsRepository`;
- a parte social das referências R5 e R6 — seguidores, handle, "Encontre novos amigos" — sai
  do escopo do produto enquanto esta ADR valer, e não deve reaparecer em spec sem revogá-la;
- some a pressão para identidade persistente de aparelho, que era o vetor pelo qual o
  ranqueamento teria puxado o contrato inteiro.

## Alternativas descartadas

**Revisar o contrato para admitir ranqueamento:** exigiria identidade persistente e coleta
remota ligada, provavelmente ADR própria de privacidade, e abriria seguidores e handle
público. Trocaria uma garantia declarada do produto por uma mecânica de engajamento copiada de
um app de idiomas — num produto cujo aluno é profissional de saúde em formação.

**Deixar em aberto:** manteria o sub-projeto 6 congelado por tempo indeterminado, sem que
nenhum documento indicasse direção.
