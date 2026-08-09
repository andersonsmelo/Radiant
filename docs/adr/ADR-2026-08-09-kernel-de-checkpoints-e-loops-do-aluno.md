# ADR — Kernel central de checkpoints e loops do aluno (2026-08-09)

**Status:** aceita; governança concluída, implementação pendente  
**Decisor:** Anderson (proprietário do projeto)  
**Contexto de origem:** revisão do workflow do aluno e da produção pedagógica

## Contexto

O Radiant já possui jornada, progresso, checkpoints de unidade, evidência,
domínio, revisão e pipeline editorial, mas cada domínio registra sua própria
parte do fluxo. A retomada de uma tela interrompida e a recuperação de um commit
parcial ainda não têm um contrato transversal. Resolver isso dentro de cada tela
duplicaria regras e acoplaria persistência à composição visual.

Ao mesmo tempo, o sistema por competências precisa ligar resultado pedagógico a
um ciclo editorial governado sem permitir que automação promova conteúdo
clínico, altere direitos ou publique parcialmente um lote.

## Decisão

Adotar um **kernel central de checkpoints**, com adaptadores por tela principal.
O checkpoint persiste somente estado mínimo retomável; serviços de jornada,
evidência, domínio, revisão, XP e catálogo continuam donos das suas regras.

O kernel tem três modos:

- `off`: inerte e fallback obrigatório para configuração inválida;
- `shadow`: store isolado, sem efeitos no comportamento;
- `active`: retomada somente nas superfícies liberadas por rollout.

Ativo e shadow nunca compartilham chave. Há um checkpoint atual por superfície,
um fluxo retomável, diário limitado a 30 dias/500 transições e quarentena para
payload inválido.

Adotar também uma **saga local recuperável**. `CommitOperationV1` e a intenção
imutável `CommitIntentV1` são persistidos juntos, na mesma escrita serializada e
atômica antes dos efeitos. A intenção guarda dados estruturados/referências
privacy-safe suficientes para replay; não contém respostas, texto ou PII e não
depende de outro store ainda não confirmado.

O intent é união fechada para lição, review e checkpoint de unidade. Tentativa,
evidência, domínio, revisão, XP, meta e jornada são autoridades separadas; a
operação persiste somente o subconjunto obrigatório aplicável. Cada serviço
grava o recibo de `operationId+effectKind` atomicamente com seu único efeito; só
depois a saga marca a etapa. Cancelamento só existe antes do primeiro
efeito; depois dele a saga reconcilia até `completed` exatamente uma vez.
Outbox tem estado auxiliar separado e aceita apenas `SyncEventV1` pedagógico;
`LocalCheckpointEventV1` é lifecycle/telemetria do beta offline. Falha de
enqueue preserva entrega pendente durável e nunca bloqueia estudo ou perde o
evento.

Após 20 falhas automáticas, a saga pausa com próximo passo intacto; retry
explícito abre nova época e zera o contador. Home nunca cancela efeito iniciado.

O produto continua **local-first**. A API e a sincronização futura são
aditivas, autenticadas e desligadas até que privacidade, conflitos e
observabilidade sejam validados.

Conectar dois loops:

1. pedagógico — checkpoint, evidência, domínio, reforço/revisão e recomendação;
2. editorial — lote, geração assistida, validação, revisões humanas, promoção e
   verificação.

Promoção editorial exige gates independentes clínico, direitos, acessibilidade,
validação automática e autorização explícita. IA produz rascunhos, nunca
aprovação final.

## Regras de ativação

- checkpoint existe por tela principal, não por microinteração;
- produção começa e permanece em `off`;
- `preview` pode usar `shadow` depois da fundação;
- `active` começa em build interna e com CTA de retomada;
- duas falhas de restauração invalidam o checkpoint e retornam à Home;
- desligar o modo não apaga progresso ou fatos pedagógicos;
- `support-required` só ocorre após tentativa inicial reprovada, dois ciclos
  completos cada qual seguidos de nova tentativa, e a terceira tentativa ainda
  não aprovada;
- nenhuma Onda autoriza OTA ou binário sobre `1.3.1 (7)` em revisão.

## Alternativas descartadas

### Checkpoint dentro de cada tela

É localmente simples, mas produz máquinas de estado incompatíveis, deduplicação
parcial e regras de restauração divergentes.

### Snapshot completo da UI

Permite reconstrução visual direta, mas acopla dados persistidos a componentes,
estilos e estrutura de navegação. Migrações de UI tornam snapshots frágeis.

### Evento analítico sem estado retomável

Ajuda a medir abandono, mas não recupera um fluxo nem protege commits
parcialmente aplicados.

### Backend como coordenador desde o início

Contraria o produto local-first, torna estudo dependente da API e antecipa
conta, privacidade e operação remota antes de serem necessárias.

### Uma única aprovação editorial

Mistura riscos clínicos, direitos e acessibilidade e não identifica qual decisão
foi invalidada por uma alteração material.

## Consequências

- surge um contrato transversal versionado e testável;
- serviços existentes precisam aceitar recibo idempotente atômico com o efeito
  sem perder compatibilidade;
- stores, journal e outbox aumentam a superfície de migração e testes;
- shadow fornece evidência antes de qualquer efeito de runtime;
- a Task 12 educacional passa a depender da fundação transacional;
- o painel editorial precisa de concorrência otimista e promoção atômica;
- sync terá um modelo-alvo de 10 mil alunos submetido a carga/soak; isso é
  premissa a validar, não capacidade atual;
- produção exige beta e autorização separados do desenvolvimento.

## Documentos normativos

- [spec de design](../superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md)
- [plano de implementação](../superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md)
- [contrato de privacidade](../STUDENT_CHECKPOINT_PRIVACY_CONTRACT.md)
- [runbook de rollout/rollback](../runbooks/student-checkpoint-rollout-rollback.md)
