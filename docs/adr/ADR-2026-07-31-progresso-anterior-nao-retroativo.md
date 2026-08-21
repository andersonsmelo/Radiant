# ADR — Progresso anterior à v1.3 não é pago retroativamente (2026-07-31)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** pendência herdada da sessão de 2026-07-30, levantada ao
fechar o laço de gamificação (§4, ressalva 1 do
[status canônico](../archive/EXECUTION_STATUS_2026-07-29.md))

## Contexto

Até 2026-07-30 o laço de gamificação não tinha escritor alcançável em produção:
concluir uma lição marcava o nó em `completedNodeIds` e mais nada. XP, sequência,
meta diária e cards de repetição espaçada ficavam parados em zero. Isso foi
corrigido pelo `LessonOutcomeService` (commits `ab40bb1..056ffe1`).

A correção deixou uma assimetria: a regra de elegibilidade paga uma lição apenas
na **primeira** conclusão
([`LessonOutcomeService.ts`](../../radiant-app/src/features/lesson-flow/services/LessonOutcomeService.ts),
`resolveNode`). Uma instalação que já tivesse nós em `completedNodeIds` antes da
correção nunca receberia XP por eles, nunca teria cards de SM-2 nascidos a partir
deles, e exibiria `PRECISÃO` vazia — porque não há tentativa registrada.

A pendência foi herdada redigida em termos de população: *"quem já concluiu lições
nunca receberá XP"*. Verificar a regra no código confirmava o **mecanismo**, e o
mecanismo de fato exclui conclusões anteriores. Isso não diz nada sobre existir
alguém excluído.

## A medição que reenquadrou a decisão

Consultado o registro de builds do EAS em 2026-07-31, o projeto tem **exatamente um
build em toda a sua história**:

| Data | Plataforma | Perfil | Distribuição | Versão | Commit |
| --- | --- | --- | --- | --- | --- |
| 2026-03-30 | iOS **simulador** | `development-simulator` | interna | 1.0.0 | `128d70b` |

Nenhum build Android, nenhuma submissão a loja, nenhuma distribuição a terceiros.
**A população afetada é o aparelho do próprio dono** — as instalações locais feitas
durante o E2E e as capturas de evidência. Os testadores do closed test instalarão
da Play Store com armazenamento vazio e nascem com o laço já corrigido.

*(O mesmo registro fecha dois fios soltos: esse build saiu do commit `128d70b`, o
"docs: add Radiant UI Kit" que falta nesta branch, e na mesma data da sessão do
portal Apple encontrada no host — eram o mesmo evento. Build de simulador iOS não
exige assinatura, então ele não é evidência de membresia paga no Apple Developer
Program.)*

## Decisão

**Conclusões anteriores à v1.3 não são pagas retroativamente. Nenhum código de
backfill será escrito.**

A regra publicada passa a ser: XP, sequência e cards de repetição espaçada existem
a partir do momento em que a conclusão é registrada pelo `LessonOutcomeService`. O
histórico anterior à correção não é reconstruído.

Para a única instância afetada — o aparelho do dono — a solução é apagar os dados
do app quando se quiser uma vitrine limpa, o que já é o procedimento usado nas
capturas de loja.

## Alternativas consideradas

**Backfill único na migração.** Percorrer `completedNodeIds`, pagar XP e criar os
cards de SM-2 com marcador de idempotência (o padrão que
`LocalAccountMigrationService` já usa para o estado de migração). **Recusada:** para
zero usuários, seria código sem cobertura real, e exigiria **inventar dois valores
que ninguém mediu** — quanto vale uma conclusão sem acurácia registrada (a spec paga
`10 + 8` só com 100% de acerto, e não há tentativa histórica para consultar) e com
que rating o card nasce. Inventar dado histórico é pior que não ter histórico.

**Projetar agora o mecanismo de versionamento/migração do progresso**, mirando a
primeira mudança de regra de gamificação depois que houver testadores com progresso
real. **Recusada por YAGNI**, mas ver o risco abaixo.

**Arquivar sem registro.** Recusada: pendência medida e descartada que não fica
escrita é reaberta pela próxima sessão como se fosse trabalho pendente.

## Consequências

- Nada muda no código. `LessonOutcomeService` mantém a regra de primeira conclusão,
  que também é a proteção contra farmar XP refazendo lição.
- Refazer uma lição continua **registrando a tentativa** sem premiar — a acurácia é
  informação sobre memória mesmo quando não paga.
- Encerra a pendência 4 do rol herdado.

**Risco que esta decisão não cobre, e que fica registrado aqui de propósito:** a
partir do momento em que houver ≥12 testadores com progresso real, qualquer mudança
nas regras de gamificação enfrenta exatamente este problema **com população não
nula**, e aí o backfill deixa de ser opcional. O momento de projetar o mecanismo é
quando a primeira mudança dessas for proposta — não antes, e não depois de já ter
mudado a regra.

## Aprendizado de método

A pendência foi herdada com a população embutida na redação. Uma verificação no
código prova o que o mecanismo faz, nunca sobre quem ele já fez: trabalho enquadrado
como "corrigir o estado de usuários existentes" carrega uma premissa de existência
que só o sistema de distribuição pode confirmar ou refutar. Medir isso custou um
comando e mudou a resposta de "projetar migração de dados" para "documentar e
seguir".
