# Radiant 1.4 — CloudKit: correção da instalação limpa (continuação)

Data: 2026-09-15 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14
Continua [a validação física](2026-09-15-radiant-1-4-cloudkit-device-validation.md),
que encontrou o defeito. Este documento registra a **correção**, ainda **não
provada em aparelho**.

> **Estado: IMPLEMENTADO / AGUARDANDO NOVA VALIDAÇÃO FÍSICA.**
> Nada aqui foi exercitado num iPhone. A fatia só passa a "corrigida" quando um
> **novo build** repetir o ciclo apagar → reinstalar → abrir e o progresso
> voltar **sem intervenção manual**.

## 1. Causa raiz

`ProgressSyncService.getState()` lê `STORAGE_KEYS.PROGRESS_BACKUP`. Numa
instalação limpa a chave não existe, e `parseState(null)` devolve
`INITIAL_STATE = {enabled:false}` — **idêntico** ao estado de quem desligou o
backup de propósito. `executarRestore` abria com `if (!state.enabled) return`,
e portanto devolvia antes de consultar o CloudKit nos **dois** casos.

Um sentinela de dois estados carregando duas situações que pedem ações opostas:
"não existe decisão, leia a nuvem" e "houve decisão negativa, não toque nela".
É a mesma família dos achados 1 e 3 deste PR, agora no estado local em vez do
remoto.

### A prova já estava no repositório, verde

```
it('desligado, não toca a nuvem nem o local', async () => {
    const service = new ProgressSyncService({ cloud, local, storage: memoria() });
    ...
    expect(cloud.pull).not.toHaveBeenCalled();
```

`memoria()` é um storage **vazio** — literalmente o que sobra depois de um
uninstall. O teste afirmava que a nuvem não é consultada numa instalação limpa,
e passava. Quem o escreveu acreditava estar testando opt-out; os dois estados
eram indistinguíveis, então o teste travava o defeito em vez de o pegar.

Renomeado para `desligado POR DECISÃO do dono`, com storage de decisão
explícita — que é o que ele sempre quis afirmar.

## 2. Decisão de produto

A semântica necessária para separar "desligou" de "reinstalou" **não estava**
nas fontes canônicas: a spec §3.6 exige *"Reinstalação com iCloud ativo → desce
o progresso na abertura"*, mas nada define como distinguir os dois quando o
estado local desapareceu, e desligar preserva o registro remoto.

Levado ao dono, que decidiu: **o estado remoto decide**.

## 3. Correção

**`BackupState.decided`** — `false` enquanto nenhuma decisão local existir.
Registro de build anterior não tem o campo, e a chave existir já prova decisão,
por isso `decided !== false`.

**`ProgressBackup.backupEnabled`** — a decisão de opt-in passa a viajar no
registro remoto, único lugar que sobrevive ao uninstall. **Ausente significa
ligado**, por compatibilidade com o que os builds anteriores gravaram.

O campo viaja **dentro do payload JSON**, que o módulo nativo trata como string
opaca. Isso é deliberado: **zero mudança em Swift**, e nenhuma parte desta
correção depende de revalidar o módulo nativo.

### Comportamento na abertura

| estado local | registro remoto | ação |
| --- | --- | --- |
| decidiu desligar | qualquer | não consulta a nuvem |
| indeciso | utilizável, `backupEnabled ≠ false` | **restaura e religa a proteção** |
| indeciso | utilizável, `backupEnabled = false` | não aplica; respeita e marca decidido |
| indeciso | ausente | nada; marca decidido, para não consultar a rede a cada abertura de quem nunca optou |
| indeciso | incompatível | não aplica e **segue indeciso** — um binário mais novo pode entender o registro |
| indeciso | CloudKit fora | segue indeciso; tenta na próxima abertura |

Falha de rede não é decisão.

Desligar passa a marcar `backupEnabled:false` no remoto **preservando o
payload** — desligar continua não apagando nada.

## 4. Divergência registrada, não implementada

Precisão e Tópicos continuaram vazios após o restore manual. **A hipótese do
documento anterior estava errada**: não dependem de `reviewHistory`.

Medido: `ProgressScreen` → `LearningStatsService` → `LearningAttemptsRepository.getAll()`
→ `STORAGE_KEYS.LEARNING_ATTEMPTS` (`@radiant:learning_attempts_v1`), um store
separado que o `LocalProgressAdapter` **não** fotografa.

A spec §7 lista o payload aprovado — *"nós concluídos, agenda do SM-2, XP,
sequência, `lastRefillAt`"* — e essa chave está **deliberadamente fora**. A
`StorageMigrationService` a preserva em upgrade, mas nada sobrevive a um
uninstall.

Decisão do dono: **registrar a divergência, não implementar**. Incluí-la é
mudança de produto (payload maior, `schemaVersion` novo, mais dado do estudo
trafegando), não correção de defeito.

## 5. Evidência

- Gate real, Node 20, `EXPO_NO_DOTENV=1 npm run quality`: **os 16 passos,
  exit 0**, `visual:qa:strict` com 0 regressões em 323 arquivos.
- Conjunto **rastreado**: **119 suítes / 1015 testes** (eram 119/1000).
- 16 testes novos no nível do serviço, entre eles a invariante que mais importa:
  *instalação limpa nunca sobe snapshot vazio por cima de backup válido*.

## 6. O que ainda depende do dono

1. **Autorizar um novo build interno** — sem ele a correção não sai de
   "implementada".
2. **Repetir o teste no iPhone**: apagar → reinstalar → abrir **sem tocar no
   interruptor**. O progresso tem de voltar sozinho.
3. Conferir também o caminho oposto: desligar o backup, reinstalar, e confirmar
   que **nada** é restaurado — é a metade da decisão que o teste anterior não
   exercitou.

## 7. Riscos residuais

1. **Nada disto foi exercitado em aparelho.** É o risco dominante.
2. **Desligar com a nuvem fora deixa o registro remoto dizendo "ligado".** O
   opt-out é best-effort, porque desligar é ação local e não pode falhar por
   causa de rede. Consequência: reinstalar depois disso restauraria. Mitigação
   possível numa próxima rodada: reenviar o opt-out na abertura seguinte.
3. **Precisão e Tópicos seguem vazios após reinstalação**, por decisão de
   escopo, não por defeito.
4. A baseline do run do Loop capturou edições já feitas: o typecheck revelou que
   `ProfileScreen.tsx` também constrói `BackupState`, e ele não estava declarado;
   o Loop recusa acrescentar arquivo a run em `editing`, então o run foi fechado
   e reaberto com o conjunto completo.
