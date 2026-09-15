# Relatório de execução — Radiant 1.4 · Task 8 · slice CloudKit

**Data:** 2026-09-15 · **Branch:** `feat/1-4-cloudkit-private-backup`, aberta de
`origin/main` em `b3b4c46` · **Escopo:** somente o slice CloudKit. StoreKit,
Sentry, Product IDs, preços, Currículo V3, build e submissão ficaram fora, como
o handoff determinou.

**HEAD da implementação, antes do commit deste relatório:** ver o PR — os SHAs desta rodada são posteriores a este parágrafo.
**HEAD publicado do PR:** o commit que grava este documento, consultável em
[PR #14](https://github.com/andersonsmelo/Radiant/pull/14) — um relatório não
pode conter o SHA do commit que o cria, e a versão anterior deste arquivo
afirmava `bba3ef6` como se pudesse. **Arquivos no PR: 24.**

> **Implementado, não validado nativamente.** Nenhuma linha de Swift deste
> trabalho foi compilada ou executada. A fatia só pode ser chamada de validada
> nativamente depois que um build assinado com os novos entitlements rodar num
> iPhone real e comprovar backup e restauração. Toda afirmação abaixo carrega a
> medição que a sustenta; onde não há medição, está dito que não há.

---

## 1. O que foi feito, por tarefa

### 1.1 Ordem de restore × hidratação no startup (§9)

**Arquivo:** `radiant-app/src/app/_layout.tsx` · **Commit:** `ace80ad` ·
**Run:** `run-1789479174683-f232e105` (14 evidências)

Reproduzi a ordem antes de mexer, como o handoff exige, e o defeito encontrado é
**pior que sobrescrita tardia: é descarte silencioso**.

`progressSyncService.restoreOnLaunch` corria solto no `Promise.all` do bootstrap.
`LocalProgressAdapter.applyJourney` tem uma saída antecipada quando
`JOURNEY_PROGRESS` ainda não existe no storage — guarda deliberada e comentada,
porque inventar a trilha corromperia o progresso. E
`JourneyProgressService.bootstrap()` só era chamado em `handleWelcomeFinish`,
isto é, ao terminar as boas-vindas — nunca na partida.

A composição dos três produz, **em instalação nova**, que é o único caso em que o
backup serve para alguma coisa: o restore chega na guarda, volta, e os nós
concluídos restaurados são descartados. Sem exceção, sem log, sem falhar o
bootstrap. XP, sequência e agenda voltavam pelos outros caminhos (`absorbBackup`
e `applySchedule`, que criam a chave quando ela falta), então o resultado era um
**estado restaurado pela metade com aparência de sucesso**. A promessa do próprio
comentário da guarda — "a mescla volta a ser aplicada no próximo backup" — também
era falsa nesse caminho, porque o backup seguinte relê o mesmo storage vazio.

**Correção:** a dependência real, não um atraso. O catálogo é resolvido uma vez e
compartilhado; a jornada hidrata a partir dele; o restore encadeia depois. Sem
`setTimeout`, sem `sleep`. Continua best-effort, com o `catch` no fim da cadeia,
porque falha de nuvem não pode bloquear a abertura.

**Teste:** `startup-gate.flow.test.tsx`, caso "só restaura o backup depois de a
jornada hidratar". A propriedade é de ordem, não de tempo: a hidratação é presa
numa promise controlada e o teste afirma que o restore **não** foi chamado antes
de ela resolver.

**Efeito colateral tratado sem enfraquecer nada:** três testes existentes usavam a
contagem global de `JourneyProgressService.bootstrap` como proxy para "a saída das
boas-vindas consultou a jornada". Com a partida passando a consultar também, o
proxy virou soma de duas origens independentes. Passaram a medir o **delta a
partir do toque**, que é exatamente o que sempre garantiram.

### 1.2 Caller de produção do `backupNow()` (§8)

**Arquivo:** `radiant-app/src/features/journey/services/JourneyProgressService.ts` ·
**Commit:** `ace80ad` · mesmo run

O funil é `markNodeCompleted`: lição, revisão, checkpoint e recompensa passam
todos por ele. Ligar o backup ali é o que torna "uma chamada por conclusão
lógica" afirmável de uma vez só, em vez de espalhada por quatro telas.

Propriedades entregues, na ordem do contrato:

1. conclui e persiste localmente **primeiro** (`persistAndHydrate`);
2. só então dispara o backup;
3. sem `await` — a conclusão não espera rede;
4. falha remota não desfaz a conclusão;
5. **conclusão lógica** definida como *a que muda o conjunto de concluídos*, então
   nó travado recusado pela guarda, nó inexistente e toque repetido **não** pagam
   backup;
6. a chamada em si é síncrona (é o `await` que não existe), para que a contagem
   seja afirmável sem depender de quando o agendador solta a microtask.

**Testes:** seis casos novos em `JourneyProgressService.test.ts`, incluindo
"conclui o nó mesmo quando o backup remoto falha" e "não espera a rede: a
conclusão resolve com o backup ainda pendente".

### 1.3 Entitlements (§4, §11)

**Arquivos:** `radiant-app/app.json`, `radiant-app/src/config/cloudkitEntitlements.test.ts` ·
**Commit:** `0a89b2c` · **Run:** `run-1789479616207-54db3c0c` (14 evidências)

```json
"entitlements": {
  "com.apple.developer.icloud-container-identifiers": ["iCloud.com.ascendcreative.radiant"],
  "com.apple.developer.icloud-services": ["CloudKit"]
}
```

`com.apple.developer.icloud-container-environment` **não** foi declarado, de
propósito: fixá-lo amarraria o binário a Development ou Production e faria o build
assinado apontar para o ambiente errado sem erro visível. O provisionamento
decide.

**Por que o contrato afirma sobre `app.json` e não sobre `ios/`:**
`radiant-app/ios` e `radiant-app/android` estão no `.gitignore` (linhas 42–43) e
**nenhum arquivo deles é rastreado** — `git ls-files` devolve 0 nos dois. São
saída de prebuild. Um teste apontado para `ios/Radiant/Radiant.entitlements`
certificaria um artefato que o próximo `expo prebuild` reescreve, e continuaria
verde depois de a fonte ter perdido a configuração.

**Prova do config resolvido**, medida em 2026-09-15 com
`npx expo config --type introspect`, lida **com controle na mesma invocação** —
porque uma ausência isolada não distingue configuração correta de busca quebrada:

| Chave | Ocorrências |
| --- | --- |
| `com.apple.developer.icloud-container-identifiers` | 2 |
| `com.apple.developer.icloud-services` (`CloudKit`) | 2 |
| `com.apple.developer.ubiquity-container-identifiers` | 0 |
| `com.apple.developer.icloud-container-environment` | 0 |

Repetida depois de o módulo nativo entrar: mesmo resultado, config resolve com
exit 0.

### 1.4 Adaptador do CloudKit privado (§5, §6, §10)

**Arquivos:** `CloudKitPrivateAdapter.ts`, `cloudkitBackup.types.ts`,
`ProgressSyncService.ts` · **Commit:** `2dea124` ·
**Run:** `run-1789479880524-c46d0caa` (14 evidências)

19 testes. Os sete estados de erro do §6 cobertos, com uma distinção que o cartão
de backup mostra diferente e que seria errado colapsar: `cloud-unavailable` é
**estado esperado** — sem conta iCloud, sem rede, limite de taxa — e passa
sozinho; qualquer outra coisa vira `failed` e merece aparecer. Colapsar as duas
esconderia defeito atrás de mensagem tranquilizadora.

Três casos de leitura que não constavam da lista do §12: envelope de versão
desconhecida, JSON corrompido e `schemaVersion` divergente. **A primeira versão
os devolvia como ausência, e isso estava errado** — ver §11, achado 1. Hoje eles
devolvem `incompatible`, um terceiro estado que o serviço é obrigado a tratar.

A seleção de adaptador é **preguiçosa e degradável**: sem módulo nativo — Expo
Go, Android, build anterior a esta versão — cai no
`UnavailablePrivateCloudAdapter`; nem exceção do carregador derruba a abertura.
Preguiçosa porque este módulo é importado na partida, e consultar o runtime
nativo no `import` faria toda abertura pagar por um adaptador que só é usado
quando o backup está ligado.

### 1.5 Módulo Expo local em Swift (§5, §6)

**Arquivos:** `radiant-app/modules/radiant-cloudkit/**` (5 arquivos, 220 linhas) ·
**Commit:** `66a45fb` · **Run:** `run-1789482574076-d5961d51`

**Não compilado, não executado.** O cabeçalho do arquivo Swift diz o mesmo. Os
comportamentos decididos ali estão na §2.

O caminho `radiant-app/modules` não constava de `writePolicy.allowedRoots` no
`.loop/project.yaml` — a política enumerava os tipos de artefato que existiam
quando foi escrita, e não podia conter caminho para o primeiro artefato de um
tipo novo. A tentativa de declarar os arquivos devolveu `INVALID_SCOPE` e deixou
um run vivo em `context_ready` segurando o lock de escritor; ele foi localizado e
fechado antes de qualquer outra coisa. A ampliação da política foi **aprovada
pelo dono nesta sessão** (commit `b4415e0`, run `run-1789482376121-39eae6f2`),
porque muda o que qualquer agente futuro pode gravar. Não foi contornada.

### 1.6 Cobertura do gate de typecheck

**Arquivo:** `radiant-app/tsconfig.json` · **Run:** `run-1789482873470-937acab1`

`tsconfig.include` enumera diretórios e `modules` não estava lá, então o
`tsc --noEmit` passava **sem nunca abrir** o arquivo novo, com exit code idêntico
ao de um gate que o tivesse lido e aprovado. Descoberto com
`tsc --noEmit --listFiles | grep modules/radiant-cloudkit` → 0 ocorrências.
Corrigido; agora o arquivo aparece na listagem e o gate o cobre de fato.

---

## 2. Solução nativa escolhida, e por quê

**Nenhuma dependência npm foi adicionada.** `git diff origin/main..HEAD` sobre
`package.json` e `package-lock.json` é vazio.

Avaliei as duas bibliotecas que existem nesse espaço, antes de decidir:

| Candidato | Tamanho real | Por que foi descartada |
| --- | --- | --- |
| `expo-cloudkit` | ~5 ★, 207 commits, projeto inicial | o config plugin injeta `UIBackgroundModes` (remote notifications e background sync) que o desenho aprovado não pediu |
| `react-native-icloud-kit` | ~5 ★, 16 commits | o plugin **não permite** só CloudKit: sempre adiciona identificadores de KVS, o que o §4 proíbe e quebraria o contrato estático desta própria branch |

Para um app já publicado, cujos entitlements estão sendo provisionados agora,
adotar um pacote de ~5 estrelas que **alarga silenciosamente a superfície de
entitlements** troca controle por conveniência no lugar errado. O §5 prevê
exatamente este caso: módulo local mínimo, superfície pequena, decisão
documentada.

**Superfície do módulo:** três funções assíncronas. Toda regra de produto —
mescla, versionamento, política de erro — permanece no TypeScript. O módulo
transporta uma **string JSON opaca** e não conhece o formato do progresso, o que
faz evoluir o schema ser mudança de TypeScript e não exigir build novo por campo
acrescentado.

**Comportamentos decididos no Swift:**

- `unknownItem` é lido como **ausência**, não falha — primeiro uso não pode
  parecer erro;
- `serverRecordChanged` **não** é resolvido no Swift: atravessa a fronteira como
  o código `conflict` e quem refaz o ciclo é o TypeScript. A primeira versão o
  resolvia aqui, escrevendo por cima do registro do servidor — ver §11, achado 2;
- `accountStatus` **nunca lança** — não saber o estado da conta *é* um estado de
  conta, vira `could-not-determine` e degrada para local;
- erro traduzido para os quatro códigos que o adaptador já testa
  (`not-authenticated`, `network-unavailable`, `transient`, `unrecoverable`),
  para que o domínio nunca precise conhecer `CKError`.

---

## 3. Schema CloudKit

| Item | Valor |
| --- | --- |
| Container | `iCloud.com.ascendcreative.radiant` |
| Database | **privada** (`privateCloudDatabase`) |
| Zona | padrão |
| Record Type | `ProgressBackup` |
| Record ID (`recordName`) | **fixo**: `progress-backup-v1` |
| Campos | `payloadVersion` (Int), `payload` (String, JSON), `savedAt` (String ISO 8601) |
| Versão do payload | `1` |
| Update/upsert | ler por ID → criar se `unknownItem` → preencher → salvar; `serverRecordChanged` volta ao TypeScript como `conflict`, que refaz `pull → merge → push` em até 3 tentativas |

O `recordName` fixo é **o que torna a escrita idempotente**: salvar de novo
atualiza o mesmo registro em vez de acumular histórico. Trocá-lo é migração de
schema, não detalhe de implementação.

**Nada identifica a pessoa.** Sem nome, sem e-mail, sem identificador de conta do
Radiant. O container privado do próprio usuário é a fronteira de identidade deste
recurso.

---

## 4. Ordem final de startup

```
migração 1.3.1 → 1.4
  └─ Promise.all
       ├─ AuthService.bootstrap()
       ├─ catalogBootstrap  ─────────────┐
       ├─ FirstRunService.bootstrap()    │
       ├─ warmNativeStorage()            │
       ├─ subscriptionService.refresh()  │  (dependência real)
       └─ catalogBootstrap ──────────────┘
            └─ JourneyProgressService.bootstrap()   (hidrata JOURNEY_PROGRESS)
                 └─ progressSyncService.restoreOnLaunch()   (aplica a mescla)
```

Depois do startup, o estado local contém a mescla determinística entre o
progresso válido do aparelho e o backup privado, e **nenhuma etapa posterior a
substitui**, porque a hidratação — que era a etapa posterior — agora acontece
antes, por dependência declarada.

---

## 5. Política de mescla — preservada, não reescrita

Continua idêntica: união dos nós concluídos por trilha, agenda de revisão mais
nova por nó, maior XP, maior sequência, `lastRefillAt` mais recente, e **nuvem
vazia nunca substitui progresso local válido**. `mergeProgressBackups` não foi
tocado; `git diff` sobre ele é vazio.

---

## 6. Evidência

| Medida | Baseline (2026-09-14) | Agora (2026-09-15) |
| --- | --- | --- |
| Suítes / testes (conjunto rastreado) | **117 / 916** | **119 / 1000** (+84) |
| `tsc --noEmit` | exit 0 | **exit 0** |
| ESLint | 0 erros / 24 avisos | **0 erros / 24 avisos** |

Os números são da **suíte inteira e apenas do conjunto rastreado**, medidos com o
comando do CI (`EXPO_NO_DOTENV=1`, `jest --runInBand`) no **Node 20**, que é o
que o `AGENTS.md` manda usar para o app.

> 🔴 **Correção das três rodadas anteriores.** Elas reportaram *127 suítes /
> 1021 testes*, e a "baseline 125 / 958" foi reproduzida com o mesmo vício. Os
> números estavam contaminados por **8 suítes / 42 testes** de arquivos de
> Currículo V3 **não commitados** de outra sessão, que existem só na árvore de
> trabalho e o CI nunca vê. Além disso, aquelas medições usaram `npx jest`
> direto — e não `npm run quality`, que é o gate real e inclui `--runInBand`
> mais 15 contratos — sob **Node 24** em vez do 20. Medido em worktrees limpas:
> `origin/main` = **117 / 916**; esta branch = **119 / 979**. Os avisos chegaram a
subir para 26 com dois imports duplicados meus; foram unificados em vez de
deixados passar.

**Runs do Loop**, todos fechados, cada um com `VALIDATION_PASSED` e 14 evidências,
pelo ritual `validate → step finish → [memory write] → run close`, com o código de
cada envelope lido separadamente e nenhum comando encadeado com `&&`:

| Run | Escopo | Memória |
| --- | --- | --- |
| `run-1789479174683-f232e105` | ordem de startup + caller do backup | gravada |
| `run-1789479616207-54db3c0c` | entitlements + contrato estático | gravada |
| `run-1789479880524-c46d0caa` | adaptador CloudKit | gravada |
| `run-1789480239381-d2b2aebb` | órfão do `INVALID_SCOPE`, fechado sem edição | — |
| `run-1789482376121-39eae6f2` | ampliação da `writePolicy` | — |
| `run-1789482574076-d5961d51` | módulo Expo local | — |
| `run-1789482873470-937acab1` | cobertura do typecheck | gravada |
| `run-1789483131265-80e087b1` | esta documentação | — |

---

## 7. Estado do EAS e do provisionamento

Não executei build, submit, nem revoguei credencial. `eas credentials` **não tem
interface não-interativa** — o único subcomando é `credentials:configure-build` —
então, como o §11 manda, paro aqui e nomeio a opção exata necessária.

---

## 8. Gates humanos restantes

### 8.1 Regenerar o provisioning profile — **bloqueia o primeiro build**

A Apple avisou, ao você habilitar a capability iCloud, que os perfis existentes
podem ter sido invalidados. O caminho exato:

`eas credentials -p ios` → escolher o perfil de build (`preview` ou
`development`) → **Build Credentials** → regerar o provisioning profile, para que
ele absorva a capability iCloud e os entitlements novos.

Na prática o próprio `eas build` costuma detectar a divergência e oferecer a
regeneração. De um jeito ou de outro é decisão sua: a escolha aparece num prompt
interativo e não a tomei.

### 8.2 **Deploy Schema to Production** — bloqueia a submissão da 1.4

**Sim, será necessário, e a ordem importa.** O CloudKit cria schema
automaticamente **apenas no ambiente Development**, na primeira escrita. O
ambiente Production não herda isso, e builds de TestFlight e App Store usam
Production.

Sequência obrigatória:

1. build assinado (Development) roda em aparelho e grava um backup → o record
   type `ProgressBackup` passa a existir no schema **Development**;
2. CloudKit Console → container `iCloud.com.ascendcreative.radiant` → **Deploy
   Schema Changes** → Production;
3. só então submeter a 1.4.

Pular o passo 2 produz um app aprovado que escreve num schema inexistente: a
falha aparece só em produção, para o usuário final, e degrada para "backup
indisponível" — silenciosa do ponto de vista de quem revisou. **Este gate não
pode ser fechado por mim e não deve ser fechado silenciosamente.**

### 8.3 Autorização de build interno

Não há autorização datada para `eas build --profile preview`. Sem ela, nada desta
branch pode sair do estado "implementado".

---

## 11. Rodada de integridade — achados da revisão independente do PR #14

A revisão encontrou **dois caminhos de perda de progresso dentro do próprio
mecanismo antiperda**. Ambos corrigidos no commit `1418a10`, com testes que os
reproduzem.

### Achado 1 — registro remoto incompatível era tratado como ausente

`pull()` devolvia `ProgressBackup | null`, e `null` significava duas situações
**opostas**: "não existe registro", em que gravar é seguro porque é o primeiro
backup, e "existe um registro que este binário não lê", em que gravar destrói.
Colapsadas num sentinela, a leitura natural do chamador é a permissiva — então o
comportamento padrão no caminho perigoso era o destrutivo. `backupNow` lia `null`
e dava `push` do snapshot local por cima de um backup feito por uma versão futura
do app.

A afirmação da versão anterior deste relatório — "o registro segue intacto na
nuvem para um binário que o entenda" — **era falsa no caminho de escrita**. Ela
valia para `restoreOnLaunch`, que só lê, e eu a generalizei sem percorrer o
consumidor que grava.

**Correção:** união discriminada de três estados — `absent`, `usable`,
`incompatible` com razão (`payload-version`, `corrupt`, `schema-version`). O
compilador passa a obrigar cada consumidor a decidir. `incompatible` não envia,
não aplica, preserva o local e registra estado próprio, distinto de `failed`,
com texto no cartão dizendo que o backup está guardado e intacto e que a ação
útil é atualizar o app.

### Achado 2 — `serverRecordChanged` sobrescrevia o servidor

O Swift pegava `error.serverRecord`, escrevia a entrada local por cima e salvava.
Como o módulo **não abre o payload**, ele não tem como saber que o registro do
servidor era mais novo: era last-write-wins cego por construção, e um backup
concorrente de outro aparelho podia ser substituído por um snapshot mais antigo.

**Correção:** o Swift perdeu a resolução de conflito e traduz
`CKError.serverRecordChanged` para o código estável `conflict`. O TypeScript
refaz `pull → merge → push` em **no máximo 3 tentativas** (constante explícita,
não laço). Conflito que não cede vira `failed` com o local intacto.

**Concorrência no mesmo aparelho:** uma fila mínima — corrente de promises, sem
biblioteca — serializa `backupNow` e `restoreOnLaunch`. Sem ela, duas conclusões
de nó em sequência rápida produziam `pull,pull,push,push`, e o segundo gravava
por cima do primeiro sem tê-lo lido. Não há debounce nem limitação de taxa nesta
rodada.

### Por que os testes anteriores não pegaram

Eles **afirmavam o defeito como comportamento correto**, com comentário
explicando por que era seguro, porque foram escritos a partir do mesmo modelo
mental da implementação, na mesma sessão, sobre a mesma fronteira. Um erro de
modelo é invisível para testes que codificam o modelo. A consequência só existia
um nível acima, no consumidor que decide gravar — por isso as provas novas são
**de serviço**, não apenas do adaptador, como a revisão exigiu.

Testes acrescentados nesta rodada (13): primeiro push com registro ausente; as
três razões de incompatibilidade não chamando `push` nem `apply`, em `backupNow`
e em `restoreOnLaunch`; conflito refazendo o pull e reenviando a união; remoto
mais novo não substituído; conflito repetido parando no limite; duas chamadas
concorrentes não interleiando; tradução do conflito no adaptador; cópia do estado
`incompatible` no cartão.

### Achado 3 — segunda revisão: registro existente ainda podia virar ausência

A correção do achado 1 criou a união `absent`/`usable`/`incompatible`, mas **o
produtor abaixo dela não foi auditado**. O Swift devolvia `nil` por um `guard`
quando o registro **existia** sem `payload` ou sem `savedAt`. Como `nil`
significa "registro inexistente", o adaptador mapeava para `absent` e o serviço
fazia o primeiro push por cima de um registro real: o mesmo defeito do achado 1,
um nível abaixo, com o tipo novo servindo de disfarce.

Nada apontava para lá. A união estava certa, os testes do consumidor estavam
certos, e o compilador estava satisfeito porque as formas batiam. A linha que
traduzia o sentinela antigo para o vocabulário novo — `registro === null ?
absent : ...` — type-checava perfeitamente enquanto afirmava exatamente a
equivalência que a correção existia para negar.

**Correção:** `nil` fica reservado ao `catch` de `CKError.unknownItem`, e há hoje
**um único `return nil` executável** no módulo. O Swift devolve um envelope cru
com os campos que encontrou, na forma em que os encontrou, e não julga — julgar
exigiria conhecer o formato do progresso, que é o que ele não faz.

A classificação estrutural passou para o TypeScript, e a razão é prática: o Swift
não é compilável nem executável nesta máquina, então manter a regra lá tornaria
"sem payload", "sem savedAt" e "tipo inválido" indistinguíveis em teste. No
TypeScript os três viram prova executada.

**19 testes:** seis no adaptador (ausência real, sem `payload`, sem `savedAt`, sem
`payloadVersion`, tipos inválidos, registro vazio) e treze no serviço — cinco
deles ligando o adaptador **real** ao serviço, provando a cadeia inteira, mais o
contraponto de que `unknownItem` real continua permitindo o primeiro backup. Sem
esse contraponto, "nunca grava" passaria trivialmente.

### Achado 5 — os dois P2, corrigidos na rodada final

Ambos vieram de comentários de linha do revisor automático e ficaram abertos por
duas rodadas antes de entrarem em escopo. Os dois eram reais.

**P2-1 — revisão recorrente não disparava backup.** O gancho só disparava quando
o nó **entrava** em `completedNodeIds`, e uma revisão que vence **de novo** já
está lá desde a primeira vez. Da segunda em diante, a revisão atualizava a agenda
SM-2 e concedia XP **sem backup**, deixando a nuvem velha indefinidamente.

O discriminador correto já existia no estado e apenas não era lido: a fila
`pendingReviewNodeIds`. Revisão legítima **sai** da fila — mudança real; toque
repetido não sai de nada, porque já saiu. A régua passou a ser *entrou em
concluídos **ou** saiu da fila de revisão*, e a conclusão continua sem `await`.

Duas notas sobre a prova, porque ambas quase produziram um teste falso. O
primeiro cenário que escrevi **passou de primeira**: concluir a lição não põe o
nó de *revisão* em `completedNodeIds` — são nós distintos —, e o defeito só
aparece a partir da segunda vez que a mesma revisão vence. E o caso de toque
duplo obrigou a corrigir o dublê: mockar "a lição vence para sempre" fazia a
hidratação repor o nó na fila, e o segundo toque parecia revisão nova — cenário
que o SM-2 real não produz, porque concluir a revisão reagenda o cartão.

**P2-2 — validação estrutural rasa.** `ehProgressBackup` aceitava qualquer objeto
não nulo em `completedNodesByTrack` e `reviewSchedule`, então um payload versão 1
corrompido passava como `usable` — e `usable` é justamente o estado que autoriza
mesclar sobre o progresso local.

Os dois piores casos: uma string em `completedNodesByTrack` é espalhada pelo
*spread* da mescla e vira nós inventados de um caractere marcados como
concluídos; e `NaN` em `interval` envenena o agendamento do SM-2 sem nunca
lançar. Ambos passam por qualquer checagem que só pergunte "é objeto?" — e
`typeof [] === 'object'`, então array também passava.

Agora cada trilha precisa ser array de IDs textuais não vazios, e cada cartão
precisa dos sete campos obrigatórios com os tipos certos e números finitos.
**12 casos corrompidos** cobertos e — o que importa tanto quanto — **6
contrapontos válidos** (backup completo, mapas vazios, trilha sem nós, várias
trilhas, cartão íntegro, `lastRefillAt` nulo). Sem os contrapontos, uma validação
que rejeitasse tudo passaria nos 12 primeiros e destruiria o backup de todos.

### Achado 4 — o CI reprovou, e a causa não era o CloudKit

Depois da terceira rodada o gate reprovou em
`LessonFlowScreen — assinante com contagem zero não é pausado`, **duas vezes no
mesmo SHA**, então não era instabilidade aleatória.

**Causa raiz, medida.** A asserção usa `waitFor` com o timeout padrão de 1000 ms.
Instrumentando cada tentativa: o `queryByText` custa **0–1 ms**, mas o intervalo
entre tentativas é de **~340 ms** — custo da maquinaria de espera, não de
trabalho —, e a tela precisa de **dois ciclos de flush** depois do "Continuar"
para estabilizar. A condição só vira verdadeira na 3ª tentativa, entre **714 e
1488 ms**. Contra 1000 ms, a folga é nenhuma, e numa das cinco execuções locais
ela já estourava.

**Comparação `main` vs PR, em worktrees limpas, mesmo comando, Node 20:**

| | mediana | máximo | tentativas |
| --- | --- | --- | --- |
| `origin/main` (`b3b4c46`) | 743 ms | **1488 ms** | sempre 3 |
| esta branch (`dc6d276`) | 764 ms | 968 ms | sempre 3 |

Indistinguíveis, e o pior caso é do `main`. **A fragilidade é anterior a esta
branch e independe do backup no iCloud** — `lesson-flow/` não tem nenhum arquivo
alterado aqui, e `JourneyProgressService`, `LessonOutcomeService` e
`GamificationService` estão todos mockados nessa suíte, então nada do slice
CloudKit entra no grafo de módulos dela. O runner do GitHub é ~7× mais lento
nesta suíte (3,2 s local contra 21,5–22,3 s), o que transforma "sem folga" em
"reprova sempre".

**Correção:** um `await act(async () => {})` antes do `waitFor`. Ele descarrega a
fila de microtasks e os efeitos pendentes de uma vez — **2 ms** — e o `waitFor`
passa na primeira checagem, permanecendo como tolerância. O teste cai de ~870 ms
para **60 ms**. Não foi aumentado nenhum timeout, nem o desta asserção nem o
global: aumentar esconderia o custo em vez de eliminá-lo.

**O que isto expôs sobre as três rodadas anteriores.** Eu media com `npx jest`,
no Node 24, contando arquivos não commitados de outra sessão. O gate real é
`EXPO_NO_DOTENV=1 npm run quality`, que roda `jest --runInBand` mais 15
contratos, no Node 20, sobre o conjunto rastreado. Três desvios independentes,
todos com a mesma assinatura: tratar a medição local como equivalente à do gate
sem verificar que eram o mesmo comando, no mesmo ambiente, sobre os mesmos
arquivos.

---

## 9. Riscos residuais

1. **O Swift não foi compilado.** É o risco dominante. Erro de compilação,
   assinatura de API ou comportamento de `ExpoModulesCore` só aparece no primeiro
   build. Em particular, o mapeamento de `Exception.code` para o campo `code` que
   o adaptador TypeScript lê é a junção mais frágil: se ele chegar ao JS com
   outro formato, todos os erros do CloudKit caem no ramo `unrecoverable` — o app
   continua funcionando e local-first, mas o cartão mostraria "falha" onde
   deveria mostrar "indisponível".
2. **O limite de 3 tentativas de conflito é uma escolha, não uma medição.** Não
   há dado de campo sobre frequência de conflito neste app; o número foi fixado
   pequeno de propósito, para não transformar conclusão de nó em laço de rede.
   Se conflitos legítimos forem comuns com vários aparelhos, o backup falhará
   mais do que o necessário — o local segue intacto em todos os casos.
3. **A fila serializa apenas dentro de uma instância do serviço.** Duas
   instâncias no mesmo processo, ou dois processos, não compartilham a fila. Hoje
   o app usa um único singleton exportado, então a propriedade vale; deixar de
   valer exigiria criar outra instância, o que nenhum caminho atual faz.
4. **Adicionar o módulo muda o build nativo.** `expo config --type introspect`
   resolve limpo, mas isso mede configuração, não compilação. O primeiro
   `prebuild`/`pod install` é o primeiro teste real.
5. **`aps-environment: development`** aparece no config resolvido, injetado por
   `expo-notifications`; é dependente de perfil e não foi tocado por este
   trabalho.
6. **A ampliação da `writePolicy`** (`radiant-app/modules`) é permanente e vale
   para qualquer agente futuro, não só para esta tarefa.
7. **Backup por conclusão de nó não tem limitação de taxa.** Uma sessão de estudo
   longa dispara um `push` por nó concluído. É best-effort e não bloqueia nada,
   mas o CloudKit tem limites de taxa e a política de agrupamento não foi
   definida — o handoff a deixou explicitamente fora da ADR.
8. **`ENABLE_REMOTE_SYNC=false` em todos os perfis** continua desligando o sync
   remoto legado, que é coisa distinta do backup iCloud. Não mexi.

---

## 10. Para o primeiro teste em aparelho

O mínimo necessário, em ordem:

1. **você** regenera o provisioning profile (§8.1);
2. **você** autoriza um build `preview` ou `development` datado;
3. o build precisa compilar `modules/radiant-cloudkit` — é o primeiro momento em
   que o Swift é exercitado;
4. no aparelho, com Apple ID ativo: ligar o backup no Perfil, concluir um nó,
   confirmar que o registro aparece no CloudKit Console (Development);
5. desinstalar, reinstalar, abrir e confirmar que os nós concluídos voltam — é
   este passo, e só ele, que prova a correção do §9 no mundo real;
6. repetir com iCloud desligado no aparelho e depois em modo avião, confirmando
   que o estudo segue normal e o cartão informa indisponibilidade;
7. só então §8.2.

Enquanto os passos 4 e 5 não acontecerem, o correto é dizer **implementado**.

