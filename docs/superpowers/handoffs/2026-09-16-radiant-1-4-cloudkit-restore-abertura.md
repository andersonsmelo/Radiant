# Radiant 1.4 — CloudKit: orquestração da abertura (diagnóstico e correção parcial)

Data: 2026-09-16 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14
Continua [a terceira validação física](2026-09-15-radiant-1-4-cloudkit-device-validation-3.md).

> ⚠️ **A causa raiz do que ocorreu no aparelho NÃO foi comprovada.**
> Este documento registra um defeito estrutural real, encontrado e corrigido, e
> a instrumentação que deve responder a pergunta no próximo build. Não declara
> o problema físico resolvido.

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

É ela que deve separar as duas explicações da §2 no próximo build físico.

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

## 8.1 Build gerado, medição pendente (2026-09-16)

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

**A medição não foi executada.** O passo de apagar a instalação destrói o
progresso local, e a recuperação depende de existir backup remoto válido — uma
precondição que o executor não consegue verificar, e que o próprio defeito sob
investigação pode impedir de cumprir. Antes da desinstalação, o dono confirma o
registro (cartão com data recente, ou `progress-backup-v1` no CloudKit Console,
ambiente Production).

Com o iPhone `available (paired)`, a captura roda inteira por `devicectl`:
`uninstall app` → `install app` → `process launch --console`, que pega a
primeira abertura desde o primeiro instante.

Nenhum evento de `pull`, estado visual ou conclusão foi observado nesta rodada.

---

## 9. Riscos residuais

1. **A causa raiz segue aberta.** A correção desta rodada pode não mudar o
   comportamento em aparelho. Seguem não descartados o caminho de
   startup/orquestração e o resultado real do `pull` na fronteira nativa.
2. **O procedimento de captura não foi exercitado com o aparelho conectado.** Se
   ele falhar, o build seguinte não produz evidência — e era esse o motivo de
   documentá-lo antes de gastar outro build.
2. Desligar com a nuvem fora deixa o registro remoto dizendo "ligado" — risco
   registrado na rodada anterior, sem mudança aqui.
3. Precisão e Tópicos seguem fora do payload, por decisão de escopo.
