# Radiant 1.4 — CloudKit: segunda validação física da instalação limpa

Data: 2026-09-15 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14

Continua [`2026-09-15-radiant-1-4-cloudkit-device-validation-2.md`](2026-09-15-radiant-1-4-cloudkit-device-validation-2.md).

## Estado

> **REPROVADO EM APARELHO / NÃO FAZER MERGE.**

A correção dos commits `4d0036e` / `460b398` foi exercitada em um novo build interno EAS gerado exatamente do HEAD autorizado `460b3986d79fd69c39c908c4fd8655bc4a9a45d5`.

Build físico testado:

- EAS build ID: `b86cb497-0a7c-4b12-9437-e5feaa3046a5`
- perfil: `preview`
- iOS, distribuição interna
- commit do binário: `460b3986d79fd69c39c908c4fd8655bc4a9a45d5`

## Passagem 1 — restore automático após reinstalação

Procedimento executado pelo dono:

1. backup remoto existente e previamente validado;
2. app apagado completamente;
3. build interno novo instalado;
4. app aberto sem tocar no interruptor do iCloud e sem iniciar lição/checkpoint.

Resultado observado no iPhone:

- Backup no iCloud: **OFF**;
- texto: **“Nenhum backup ainda”**;
- XP: **0**;
- trilha Fundamentos de Radiologia: **0/14**;
- progresso não restaurado automaticamente;
- sequência exibida: 1 dia;
- vidas: 5.

Conclusão: a correção da instalação limpa **não passou no aparelho**. O comportamento esperado era restaurar automaticamente o remoto utilizável e reativar o backup. Isso não aconteceu.

A Passagem 2 (opt-out explícito → reinstalação → nada volta) **não deve ser executada ainda**, porque a Passagem 1 já reprova o gate principal.

## Diagnóstico seguinte — toggle manual no mesmo build

Sem reinstalar novamente, sem iniciar lição/checkpoint e mantendo conectividade, o dono ligou manualmente `Backup no iCloud`.

Resultado observado imediatamente, sem precisar fechar/reabrir o app:

- Backup no iCloud: **ON**;
- cartão passou a mostrar `Último backup em 15/09/2026 às 21:08`;
- XP voltou para **100**;
- sequência: **1 dia**;
- trilha Fundamentos de Radiologia voltou para **11/14**;
- próximo passo voltou ao **checkpoint**.

Conclusão medida:

- o registro remoto continua íntegro;
- conta/container/ambiente do CloudKit estão funcionais;
- módulo nativo, `pull`, merge, `apply` e atualização da interface funcionam quando o restore é disparado;
- o defeito restante está **especificamente no caminho de startup / decisão de restore automático em instalação limpa**.

## Hipótese EAS Update descartada

Foi medido no terminal:

```bash
cd /Users/anderson/Developer/Radiant/radiant-app
nvm use 20
npx eas-cli@latest channel:view preview
```

O canal `preview` está ativo e aponta para a branch `preview`, porém o grupo mais recente apresenta:

- Platforms: `N/A`;
- Runtime Version: `N/A`;
- Message: `N/A`;
- Group ID: `N/A`.

Logo, não há update OTA publicado no canal `preview`. A hipótese de um EAS Update antigo substituir o JavaScript embutido no build novo foi descartada.

## Próximo diagnóstico técnico

Antes de qualquer nova implementação, medir todos os escritores de `STORAGE_KEYS.PROGRESS_BACKUP` e a ordem real do startup. A hipótese prioritária a testar, **não assumir**, é que algum caminho de bootstrap/migração crie uma chave local `v1` com `enabled:false` antes de `restoreOnLaunch()`. Como `parseState()` trata uma chave antiga existente como decisão (`decided !== false`), isso transformaria uma instalação limpa em `decided:true / enabled:false` e faria o restore retornar antes do `pull`.

A prova precisa usar o serviço real, não apenas um mock de `progressSyncService.restoreOnLaunch`: instalação limpa com AsyncStorage vazio → bootstrap real → confirmar o estado imediatamente antes do restore → confirmar se `cloud.pull()` é chamado.

Investigar em particular:

1. `StorageMigrationService` no caminho de instalação limpa;
2. todo `setItem`/writer de `STORAGE_KEYS.PROGRESS_BACKUP`;
3. `RootLayout` e a cadeia `JourneyProgressService.bootstrap() → restoreOnLaunch()`;
4. qualquer normalização/default que persista `enabled:false` antes do restore;
5. diferença entre o teste atual de ordem do startup e o runtime real.

Não criar novo build, não fazer submit, não fazer merge e não executar ainda a Passagem 2 até fechar a causa raiz e ter nova correção automatizada.

## Divergência documental

`docs/STATUS.md` na branch ainda afirma `IMPLEMENTADO / AGUARDANDO NOVA VALIDAÇÃO FÍSICA`. Isso está obsoleto. O estado correto após esta rodada é:

> **REPROVADO EM APARELHO / CloudKit funcional / restore manual confirmado / causa do restore automático no startup ainda aberta.**

`docs/STATUS.md` deve ser corrigido antes da próxima implementação.

## Fora do escopo confirmado

`Precisão` e `Tópicos` continuam fora do payload aprovado da 1.4 porque dependem de `STORAGE_KEYS.LEARNING_ATTEMPTS`. A decisão do dono permanece: registrar a divergência, não ampliar o payload nesta rodada.
