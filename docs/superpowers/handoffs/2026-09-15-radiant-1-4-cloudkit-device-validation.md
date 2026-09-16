# Radiant 1.4 — validação física do CloudKit

Data: 2026-09-15
Branch: `feat/1-4-cloudkit-private-backup`
PR: #14

## Evidência externa confirmada

- Apple Developer: capability iCloud habilitada no App ID `com.ascendcreative.radiant` com CloudKit.
- Container associado: `iCloud.com.ascendcreative.radiant`.
- Provisioning profile Ad Hoc regenerado com o iPhone registrado.
- Build interno EAS instalado no iPhone: `45abf4fd-a765-4c1d-94d3-1de5bda3db4f`.
- CloudKit Console: schema `ProgressBackup` implantado em Production.
- Backup real gravado com sucesso no iPhone.

## Baseline antes do uninstall

Capturas do aparelho mostraram:

- XP total: 100
- sequência: 1 dia
- precisão: 83%
- revisões pendentes: 0
- Fundamentos de Radiologia: 83% / 6 lições
- trilha: 11 de 14
- próximo passo: checkpoint
- backup iCloud: ligado
- último backup observado inicialmente: 15/09/2026 18:11

## Teste de instalação limpa

Procedimento:

1. apagar o Radiant do iPhone;
2. reinstalar exatamente o mesmo build interno;
3. abrir sem fazer nova lição/checkpoint;
4. observar Estude e Perfil.

Resultado imediato após reinstalação:

- backup iCloud voltou desligado;
- XP: 0;
- trilha: 0/14;
- precisão: sem dados;
- nenhum restore automático ocorreu.

Conclusão: o opt-in local de backup é perdido no uninstall e o fluxo atual não tenta restaurar o remoto quando `state.enabled` volta ao default local.

## Teste de restore manual

Na mesma instalação limpa, o usuário ligou manualmente `Backup no iCloud` e aguardou.

Resultado:

- XP voltou para 100;
- sequência voltou para 1 dia;
- trilha voltou para 11/14;
- próximo passo voltou a ser o checkpoint;
- backup ficou ativo e passou a exibir novo horário de backup.

Conclusão: o registro remoto está íntegro; leitura, merge e aplicação do progresso principal funcionam. O defeito principal está no gatilho de restauração pós-reinstalação, não na existência do backup remoto.

## Gap adicional observado

Depois do restore manual:

- `Precisão` continuou sem dados;
- `Tópicos` continuou sem evidência suficiente.

Medição no código: `LocalProgressAdapter.snapshot()` inclui `completedNodesByTrack`, `reviewSchedule`, `totalXp`, `streakDays` e `lastRefillAt`, mas não inclui `reviewHistory`. Em instalação limpa, `applySchedule()` preserva `reviewHistory` local existente; como ele inexiste, fica vazio.

Hipótese a confirmar no código antes de editar: métricas de precisão e tópicos dependem total ou parcialmente desse histórico de tentativas/revisões. Não ampliar o payload por suposição; primeiro rastrear os consumidores reais dessas métricas.

## Estado → bloqueio → dono → próxima decisão

**Estado:** CloudKit nativo compila e roda em iPhone; Production schema existe; escrita real funciona; restore manual recupera XP, sequência e trilha.

**Bloqueio:** instalação limpa não tenta restore automático porque o opt-in é apenas local e desaparece no uninstall. Há também evidência de restauração incompleta das métricas históricas.

**Dono:** implementação.

**Próxima decisão:** corrigir o fluxo de instalação limpa para detectar backup remoto antes de qualquer upload local e restaurá-lo com segurança; rastrear e, se necessário, versionar/persistir os dados que alimentam precisão/tópicos; depois repetir o teste completo de uninstall/reinstall no mesmo iPhone.

## Gate

Não fazer merge do PR #14 enquanto o teste de instalação limpa não passar sem intervenção manual e sem perda das métricas que fazem parte do progresso esperado.
