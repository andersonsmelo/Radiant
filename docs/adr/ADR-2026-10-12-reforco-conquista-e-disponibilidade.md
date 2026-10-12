# ADR — reforço persistente, conquista recomendada e disponibilidade da revisão

Data: 2026-10-12. Decisor: Anderson Melo. Itens 36, 39 e 27 da FILA.

Implementação local: commit `a366295`, branch
`codex/radiant-study-improvements`; run de implementação fechado.

As três decisões foram aprovadas pelo dono em 2026-10-12 e a implementação
conjunta foi autorizada nesta conversa. Valem para uma próxima entrega: o
binário publicado continua sendo `1.4.0 (12)`, em `221e2ec`.

## Reforço das avaliações V2

Após reprovação, a nova tentativa exige concluir novamente **todas as
atividades aprovadas que cobrem as competências frágeis**. Abrir a lição,
sair antes do fim, concluir apenas parte do conjunto ou já tê-lo concluído
antes da reprovação não libera a tentativa. A conclusão passa pelo player
real e pelo serviço de resultados; não existe botão que presume reforço feito.
O histórico local preserva tentativas, vínculo com a tentativa anterior,
atividades pendentes e ciclos. Após os dois ciclos sem aprovação, o estado de
apoio previsto pelo avaliador continua bloqueando novas tentativas.

O V2 reutiliza o conteúdo já aprovado. O campo `requiredActivities` do kernel
descreve um currículo mais rico, incluindo modalidades diferentes e variante
equivalente no ciclo 2. Repetir as atividades V2 **não prova que essas novas
modalidades foram produzidas**. O gate operacional desta entrega é a conclusão
integral do reforço V2 após cada reprovação; os vínculos de ciclo representam
histórico de tentativas, sem promover aprovação editorial de conteúdo novo.

O armazenamento é independente do modo `off`/`shadow`/`active` do kernel.
Falha de leitura ou gravação não presume reforço concluído. Esta entrega
persiste no dispositivo; não amplia o contrato de backup no iCloud para levar
o novo histórico. Nenhuma tentativa antiga é inventada ou reconstruída.

Reentrada bloqueado→liberado inicia uma tentativa com respostas vazias e
índice zero. Reentrada durante a nova tentativa conserva o progresso, inclusive
ao voltar da assinatura. IDs de operação/tentativa são opacos e curtos; a
definição curricular continua em seu campo próprio.

## Conquista na Estude

O motor recomenda a conquista desbloqueada e ainda não coletada, depois de
retomada, revisão devida e checkpoint, antes da próxima lição. O CTA existente
"Receber conquista" encaminha à tela de coleta. Os pré-requisitos e a
autorização de escrita permanecem no serviço da jornada. Coleta já gravada
retira a conquista da recomendação; recomendar não concede a conquista.

## Data da revisão

A trilha recebe a agenda completa do SM-2, inclusive instantes futuros.
Somente revisões com pré-requisitos satisfeitos recebem a disponibilidade.
O cartão mostra `Disponível em DD/MM/AAAA às HH:MM`, no fuso do aparelho,
também no rótulo acessível. A data é informativa: não antecipa a fila devida,
não altera intervalos e não libera pré-requisitos. No instante exato a revisão
passa a ser devida segundo a mesma comparação de timestamps do agendador.

## Evidência

[Testes e limites desta implementação](../evidence/2026-10-12-itens-36-39-27.md).
