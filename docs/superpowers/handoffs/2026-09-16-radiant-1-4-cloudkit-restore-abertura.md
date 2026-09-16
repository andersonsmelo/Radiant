# Radiant 1.4 — CloudKit: orquestração da abertura (diagnóstico e correção parcial)

Data: 2026-09-16 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14
Continua [a terceira validação física](2026-09-15-radiant-1-4-cloudkit-device-validation-3.md).

> ⚠️ **A causa histórica exata do que ocorreu no aparelho NÃO foi comprovada.**
> A Passagem 1 funcional posterior passou, mas a captura dos eventos internos
> ficou inconclusiva. Este documento separa esse resultado de um defeito de
> metadado determinístico encontrado depois da medição.

## 1. O que foi descartado, com medição

| Hipótese | Resultado |
| --- | --- |
| Update OTA antigo no canal | descartado pelo dono: `channel:view preview` devolveu tudo N/A |
| `StorageMigrationService` criando o estado | descartado: `PEDAGOGICAL_STORAGE_KEYS` não contém `PROGRESS_BACKUP` |
| Outro escritor da chave | descartado: `grep` no checkout mostra **um único** escritor, `ProgressSyncService.writeState` |
| O binário testado não tinha a correção | descartado: `4d0036e` é **ancestral** de `460b398`, de onde saiu o build `b86cb497` |
| Hidratação da jornada rejeitando | **testado e não se sustenta**: `getTrackDefinition` não lança com catálogo vazio, devolve jornada vazia |
| Defeito na camada de serviço | descartado por teste de integração com serviço real e storage vazio |

## 2. As duas explicações que sobram, e por que a tela não as separa

Depois da instalação limpa o aparelho mostrou: backup OFF, "Nenhum backup ainda",
XP 0, trilha 0/14, **sem mensagem de erro**.

1. **`restoreOnLaunch` não rodou.** O estado nunca é escrito e o cartão exibe o
   `INITIAL_STATE`.
2. **Rodou e o `pull` devolveu `absent`.** Esse caminho grava
   `{...state, decided:true, lastError:null}` — `enabled` falso, sem data, sem
   erro. **Cartão idêntico.**

O texto "Nenhum backup ainda" depende apenas de `lastBackupAt === null`, e
nenhum dos dois casos produz mensagem de erro. São indistinguíveis pela UI.

A segunda explicação exigiria o CloudKit responder `unknownItem` na abertura e
devolver o registro correto segundos depois, na mesma sessão — estranho, mas não
impossível, e não há como excluí-la daqui.

## 3. O defeito estrutural encontrado — real, corrigido, não provado como a causa

A orquestração no `RootLayout` era, em forma:

```
catalogBootstrap
  .then(() => JourneyProgressService.bootstrap())
  .then(() => progressSyncService.restoreOnLaunch(Date.now()))
  .catch(logar)
```

Um único `.catch` para três etapas. Qualquer rejeição antes do último `.then`
pula o restore **inteiro**, em silêncio, com o app abrindo normalmente — de
fora, indistinguível de "não havia backup".

Extraída para `restaurarBackupNaAbertura`, com **falhas isoladas por etapa**. A
espera do catálogo entrou como parte da hidratação, para que falha de catálogo
também não cancele o restore: XP, sequência e agenda não dependem do currículo
para voltar. A função nunca lança.

## 4. Por que os testes anteriores não capturaram nada disto

O único teste de startup **mockava `progressSyncService.restoreOnLaunch`**. Ele
provava que o *mock* seria chamado naquela árvore de teste — e nada sobre
`AsyncStorage` vazio, `parseState` real, serviço real, `pull` real ou early
return. Um teste assim não pode falhar por causa do defeito que existia.

O teste novo usa `ProgressSyncService` **real**, storage genuinamente vazio e
porta de nuvem falsa, sem mockar o restore. Ele prova que **a camada de serviço
está correta**: instalação limpa chega ao `cloud.pull`, aplica o remoto, termina
`enabled:true`/`decided:true`, e nunca envia snapshot vazio antes de ler.

## 5. Instrumentação

Ativa **apenas fora de produção**, para builds internos. Registra somente forma
e decisão:

- etapa (`inicio` / `hidratacao` / `restore`);
- se existe decisão local e se o backup está ligado;
- se a hidratação deu certo;
- se o restore terminou, e com que estado;
- se há data de backup.

**Nunca** payload, nó, trilha, XP, data de estudo ou identificador de iCloud. Há
teste afirmando essa ausência explicitamente.

Ela foi criada para separar as duas explicações da §2 numa captura física
íntegra. A captura da Passagem 1 descrita na §8.1 falhou no canal do
`devicectl`, portanto não produziu essa evidência interna.

## 6. Correção da própria instrumentação (2026-09-16, após revisão)

A versão anterior deste documento afirmava:

> `restore ok:true` + `ligado:false` → o `pull` respondeu `absent`.

**Isso não era demonstrável pelo código, e a revisão independente estava certa
em apontar.** Dois caminhos terminam com exatamente o mesmo estado local —
`enabled:false, decided:true, lastError:null` — e portanto com o mesmo evento
`restore`:

- `cloud.pull()` → `{ kind: 'absent' }`;
- `cloud.pull()` → `{ kind: 'usable' }` com `backup.backupEnabled === false`.

O próximo build teria voltado ambíguo. Era uma inferência vestida de leitura.

**Corrigido:** o resultado passou a ser observado **no ponto da chamada**, dentro
de `executarRestore`, imediatamente depois de `const remoto = await this.cloud.pull()`:

```
{ etapa: 'pull', operacao: 'restore',
  kind: 'absent' | 'usable' | 'incompatible',
  remoteBackupEnabled: boolean | null }
```

`remoteBackupEnabled` é `null` quando não há registro utilizável — e não `false`,
para não confundir "não há o que ler" com "o dono desligou". Há teste afirmando
que `absent` e opt-out remoto produzem o **mesmo** evento `restore` e eventos de
`pull` **diferentes**: é a prova de que a ambiguidade acabou.

**Também corrigido:** o campo `chaveLocalExiste` era preenchido com
`estado.decided`, que vem do **conteúdo** do estado e não prova existência da
chave — a chave pode existir com `decided:false`, que é o que uma falha
transitória grava. Agora há medição física (`temEstadoPersistido()`), e o campo
derivado do conteúdo chama-se `decisaoLocalRegistrada`, que é o que ele de fato
afirma.

## 7. Como ler os eventos no próximo build

> ⚠️ **A tabela anterior deste documento estava errada** e a segunda revisão
> independente pegou. Ela dizia: *"nenhuma linha `etapa:'pull'` → o pull não
> aconteceu, problema antes na orquestração"*. Falso: o evento único era emitido
> **depois** que `cloud.pull()` resolvia, então a ausência dele cobria dois
> diagnósticos **opostos** — o pull nunca foi chamado, ou foi chamado e
> **lançou**. O serviço captura a exceção e devolve um `BackupState` de todo
> jeito, de modo que o evento `restore` aparecia igual nos dois casos.
>
> O próprio teste da rodada anterior provava isso, e o nome dele — "falha antes
> do pull" — descrevia errado o que ele exercitava: o pull **é** chamado e lança.

O `pull` passou a ser observado em **três fases**, com `inicio` emitido **antes**
do `await`. Agora cada leitura tem significado único:

| O que aparecer | Conclusão |
| --- | --- |
| **nenhum** `pull/inicio` | a fronteira **não foi alcançada** — o problema está antes, na orquestração ou num early return |
| `pull/inicio` + `pull/erro` `cloud-unavailable` | a fronteira foi alcançada e falhou: conta iCloud indisponível, restrita, sem rede ou limite de taxa |
| `pull/inicio` + `pull/erro` `failed` | a fronteira foi alcançada e falhou de forma **não classificada** — erro nativo inesperado |
| `pull/resultado` `absent` | o CloudKit **respondeu ausência**: o container consultado não tem o registro |
| `pull/resultado` `usable`, `remoteBackupEnabled:true` | registro lido e ligado; se o progresso não voltou, o problema está no **apply** |
| `pull/resultado` `usable`, `remoteBackupEnabled:false` | há opt-out gravado no remoto — comportamento **correto**, não defeito |
| `pull/resultado` `incompatible` | o registro existe e este binário não o entende |

O evento final de `restore` também carrega `ultimoErro`, como redundância: ele
confirma qual ramo foi tomado sem depender de correlacionar com as fases.

## 8. Como capturar os eventos do iPhone

Verificado neste Mac em 2026-09-16: Xcode em `/Applications/Xcode.app`,
`xcrun devicectl` **disponível**, `Console.app` em
`/System/Applications/Utilities/`. O `log stream` do macOS **não** alcança
dispositivo iOS nesta versão — não tem a opção de device.

**Caminho principal — `devicectl`, que faz ponte do stdout do app.** É o único
que captura desde o **primeiro instante** da abertura, que é justamente onde o
evento acontece:

```bash
# 1. iPhone conectado por cabo, desbloqueado e confiando neste Mac
xcrun devicectl list devices        # confirmar State: available e pegar o UDID

# 2. instalar o build interno (link do EAS, ou:)
xcrun devicectl device install app --device <UDID> <caminho>.ipa

# 3. lançar COM console anexado, capturando desde a primeira linha
xcrun devicectl device process launch   --device <UDID> --console --terminate-existing   com.ascendcreative.radiant | tee /tmp/abertura.log

# 4. filtrar
grep '\[abertura:backup\]' /tmp/abertura.log
```

**Importante:** o teste de instalação limpa exige que a **primeira abertura**
após reinstalar seja a observada. Abrir o app tocando no ícone e só depois
anexar o console perde exatamente o evento que interessa — por isso o `launch`
com `--console`, e não anexar depois.

**Caminho alternativo — Console.app.** Abrir `/System/Applications/Utilities/Console.app`,
selecionar o iPhone na barra lateral, iniciar a transmissão, filtrar por
`abertura:backup`, e só então abrir o app. Serve se o `devicectl` falhar, mas
depende de iniciar a captura antes do toque.

> ⚠️ Não verifiquei nenhum dos dois **com o aparelho conectado** — no momento
> desta escrita o iPhone aparece como `unavailable` em `devicectl list devices`.
> O que está verificado é que as ferramentas existem neste Mac e que
> `devicectl process launch` oferece `--console`. Se o passo 3 falhar com o
> aparelho ligado, o caminho alternativo existe para isso.

## 8.1 Passagem 1 funcional aprovada; captura interna inconclusiva (2026-09-16)

Autorizado pelo dono para **exatamente um** build, e gerado:

| | |
| --- | --- |
| EAS Build ID | `69d77f13-39bc-46f0-a925-29eb3e568330` |
| Commit confirmado pelo EAS | `7c4a8419a71c2ebff8b6cd5468ae1287fae15b83` |
| Perfil | `preview` · iOS · distribuição interna |
| Concluído | 2026-09-16, 12:10 (−03) |

Gerado de **worktree limpa** no SHA exato: a árvore de trabalho tinha alterações
não commitadas de outra sessão, incluindo `radiant-app/src/ui/motion.ts`, que é
código do app. O campo `Commit` do EAS é a prova independente de que elas não
entraram.

> ⚠️ `1.3.1 (11)` — **idêntico** aos builds `45abf4fd` e `b86cb497` na tela de
> Ajustes. Só o `Commit` os distingue. Instalar pelo link do EAS.

O dono confirmou a precondição antes da desinstalação: **Backup no iCloud
ligado**, último backup em **15/09/2026 às 21:08**, XP **100**, sequência de
**1 dia**, trilha **11/14** e próximo passo **checkpoint**.

Depois da desinstalação completa e instalação exclusiva desse build, sem tocar
no toggle, fazer lição, revisão ou checkpoint, a primeira abertura apresentou:

- Backup no iCloud ligado;
- XP 100;
- sequência de 1 dia;
- trilha 11/14;
- próximo passo checkpoint.

O progresso foi restaurado automaticamente. Portanto, **o restore funcional da
Passagem 1 passou**.

A tentativa de capturar `startup`, `pull/inicio`, `pull/resultado` ou
`pull/erro`, `restore` final e `ultimoErro` por
`xcrun devicectl device process launch --console` terminou com
`CoreDeviceError 3 / Mercury 1001`. Os logs JS internos ficaram
**inconclusivos**. A evidência visual prova o resultado funcional, mas não
autoriza escolher uma causa histórica entre as hipóteses da §2.

### Defeito separado: `lastBackupAt` após restore utilizável

Apesar do payload restaurado, o cartão passou de “Último backup em 15/09/2026
às 21:08” para **“Nenhum backup ainda”**. A causa desse texto é determinística e
separada da causa histórica: `executarRestore()` aplicava o remoto e gravava
`enabled:true`/`decided:true`, mas não preenchia `lastBackupAt`. Em instalação
limpa o campo permanecia `null`.

Corrigido para preservar a data mais recente entre o estado local e
`remoto.backup.savedAt`:

```ts
lastBackupAt: laterIso(state.lastBackupAt, remoto.backup.savedAt)
```

A cobertura inclui instalação limpa com remoto utilizável, data local mais
recente, data remota mais recente e ausência de alteração indevida nos ramos
`absent`, `incompatible` e `cloud-unavailable`. O teste consumidor do cartão
confirma que uma data presente produz “Último backup em …”, não “Nenhum backup
ainda”. A correção está no commit `45d465` — o HEAD de código aprovado antes
deste fechamento documental — com testes e CI verdes. Ela não foi instalada no
aparelho: nenhum novo build foi gerado e a Passagem 2 abaixo usou
deliberadamente o build anterior, pois este defeito de metadado/UI é separado
da semântica de opt-out.

## 8.2 Passagem 2 do opt-out aprovada no aparelho (2026-09-16)

Foi usado **exclusivamente** o mesmo build da Passagem 1:

| | |
| --- | --- |
| EAS Build ID | `69d77f13-39bc-46f0-a925-29eb3e568330` |
| Commit confirmado pelo EAS | `7c4a8419a71c2ebff8b6cd5468ae1287fae15b83` |
| Bundle | `com.ascendcreative.radiant` · `1.3.1 (11)` |
| SHA-256 do IPA baixado | `9852e7a53818fd1480531b59dce14faa0797505375aa059365283e6ebd3f17da` |

### Baseline e opt-out

A medição visual antes de desligar mostrou:

- Backup no iCloud **ON** e cartão “Nenhum backup ainda” — texto esperado neste
  build anterior à correção separada de `lastBackupAt`;
- XP 100;
- sequência de 1 dia;
- trilha 11/14;
- próximo item efetivamente exibido: **revisão pendente**, não o checkpoint
  registrado na Passagem 1.

O dono desligou o toggle uma única vez. Como o QuickTime havia mantido um frame
antigo, o espelhamento foi fechado e reaberto; a imagem fresca confirmou o
toggle cinza/OFF. O estado foi confirmado às 17:22 (−03). Não havia uma forma
segura disponível de ler o registro privado de Production sem entrar no
CloudKit Console, então o campo `backupEnabled:false` **não foi observado
diretamente**. Aplicou-se o fallback autorizado: app aberto em foreground e
rede disponível por 30 segundos, de 17:22:45 a 17:23:15 (−03), antes da
remoção.

### Clean install e resultado

O uninstall e a instalação do IPA terminaram sem erro. A primeira abertura foi
lançada por `xcrun devicectl device process launch` às 17:25:11 (−03). Sem
tocar no toggle e sem iniciar lição, revisão ou checkpoint:

1. a imagem fresca mostrou o onboarding de instalação limpa;
2. após 30 segundos (17:25:40–17:26:10, −03), o progresso antigo ainda não
   havia reaparecido;
3. após pular o onboarding, a aba Estude mostrou XP 0, trilha 0/14 e
   “Fundamentos de Radiologia” como primeira lição/próximo passo;
4. o Perfil mostrou Backup no iCloud **OFF** e “Nenhum backup ainda”.

A sequência exibida permaneceu em 1 dia, mas esse é o default local de uma
instalação nova (`GamificationService` inicia com `streakDays: 1`). Com XP 0,
trilha 0/14, primeira lição e onboarding novo, não há evidência de restauração
parcial do backup anterior.

**Resultado segundo a tabela aprovada: PASS.** O opt-out permaneceu OFF após
uninstall/reinstall e o backup antigo de XP 100/trilha 11/14 não foi aplicado.
A persistência foi comprovada pelo comportamento final; o payload privado não
foi inspecionado diretamente. O único erro operacional foi do espelhamento do
QuickTime (`SCStreamErrorDomain -3811`), recuperado por reconexão e sem efeito
no app. Não houve novo build, alteração de produto, lição, revisão, checkpoint,
merge ou submit.

---

## 8.3 Integração e verificação pós-merge (2026-09-16)

O [PR #14](https://github.com/andersonsmelo/Radiant/pull/14) foi mergeado pelo
dono às 19:56:53 (−03). A verificação posterior confirmou:

- `origin/main`: `f5d96019b4db4a41f3258360773bd7da35a657ed`;
- head do PR `3494682229561e9e73ca4ef1711d3427fefd7a93` contido na `main`;
- correção `lastBackupAt: laterIso(...)` de `45d465` presente na `main`;
- [CI pós-merge](https://github.com/andersonsmelo/Radiant/actions/runs/35160079444)
  `Radiant App Quality`: **SUCCESS**, evento `push`, checkout limpo do merge
  commit; instalação de dependências e Quality gate concluídos com sucesso.

Não foi necessário executar um segundo merge: o PR já estava integrado quando
o agente consultou o estado remoto. As alterações locais paralelas foram
preservadas. Não houve novo build, deploy ou submit. As Passagens 1 e 2 são
PASS funcional no build anterior; o CI do merge não substitui a validação
física ainda pendente de `lastBackupAt`, nem comprova a causa histórica exata.

## 9. Riscos residuais

1. **A causa histórica exata segue aberta.** A captura interna da Passagem 1
   falhou com `CoreDeviceError 3 / Mercury 1001`; o resultado funcional positivo
   não permite reconstruir qual ramo interno foi tomado.
2. **A correção de `lastBackupAt` só tem validação automatizada.** Não houve novo
   build; a Passagem 2 usou o build anterior e não mede essa correção de UI.
3. A Passagem 2 passou funcionalmente, mas o payload privado não foi lido no
   CloudKit Console antes do uninstall. Desligar com a nuvem fora ainda pode
   deixar o registro remoto dizendo "ligado"; esse risco best-effort permanece.
4. Precisão e Tópicos seguem fora do payload, por decisão de escopo.
