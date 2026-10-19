# G7 — as três decisões de recuperação, executadas — 2026-10-19

**Medido em:** 2026-10-19, das 09:40 às 09:50 (America/Bahia).
**Autoria:** Claude (Opus 5.5), na worktree `claude/fila54-g4-nativo`, sobre a
[PR #54](https://github.com/andersonsmelo/Radiant/pull/54).
**Decisão:** Anderson, em 2026-10-19
([ADR](../adr/ADR-2026-10-19-recuperacao-local-backup-schema-e-reset.md)), na
ordem de criticidade recomendada.

Marcação: **[medido]** foi executado e visto; **[código]** foi lido no código, sem
execução; **[não verificado]** ficou de fora, com o motivo.

## 1. A jornada não grava mais por cima de schema desconhecido

**O defeito [código].** Toda leitura da jornada passa por `ensureProgress`, que
grava o resultado. Diante de um `schemaVersion` que não conhece,
`normalizeStore` devolve `null`, e a gravação seguinte escreve um store novo.
Basta abrir a Home numa versão antiga para perder a jornada salva por uma
versão nova.

**O conserto [medido].** `writeStore`, por onde passa toda escrita, relê o que
está gravado e não escreve quando o `schemaVersion` não é `journey-progress.v1`
nem `v2`.

> **Errata de 2026-10-19, à tarde (G7, schema desconhecido):** "toda escrita"
> vale só dentro do `JourneyProgressService`. A mescla do backup do iCloud
> (`LocalProgressAdapter.applyJourney`) grava a mesma chave direto e não passava
> pela guarda. O conserto está na
> [evidência do schema desconhecido](2026-10-19-g7-schema-desconhecido.md). Duas situações continuam como antes:
- store sem `schemaVersion`, ou que nem é objeto, segue tratado como ausente;
- o `reset()` explícito apaga a chave antes de escrever, então continua
  funcionando.

**Teste novo** em `JourneyProgressService.test.ts`:
- **diferença:** um store `journey-progress.v3` passa por `bootstrap`,
  `setCurrentNode` e `markLessonNodeCompleted` e sai **byte a byte igual**, sem
  nenhum `setItem` na chave;
- **validade:** o snapshot devolvido continua utilizável, com trilha ativa e
  schema atual;
- **reset:** um segundo caso confirma que o reset explícito recomeça no schema
  atual.

**[medido] Vermelho, antes do conserto**
([jornada-vermelho.txt](2026-10-19-g7-decisoes-de-recuperacao/jornada-vermelho.txt)):
o store saiu como `journey-progress.v2` e perdeu o campo novo. Esse é o defeito
nomeado. Depois do conserto, as 21 suítes da jornada passam, com 211 testes.

## 2. O iOS passa a incluir o progresso no backup

**[código]** O RNCAsyncStorage marca a pasta `RCTAsyncLocalStorage_V1` como fora
do backup quando o `Info.plist` não tem `RCTAsyncStorageExcludeFromBackup`, e
reaplica o valor a cada abertura (`RNCAsyncStorage.mm`, linhas 37–57 e
519–527).

**A mudança:** `"RCTAsyncStorageExcludeFromBackup": false` em
`ios.infoPlist` do `app.json`.

**Provas:**
- **[medido] `app.json` → `Info.plist`:** `expo config --type introspect` mostra
  a chave com `false` também no `Info.plist` que o prebuild gera
  ([expo-config-infoplist.txt](2026-10-19-g7-decisoes-de-recuperacao/expo-config-infoplist.txt));
- **[medido] a chave controla a exclusão,** no simulador descartável `E262D4C1`
  ([backup-ios-simulador.txt](2026-10-19-g7-decisoes-de-recuperacao/backup-ios-simulador.txt)):

| Passo | Info.plist do app instalado | Atributo `com_apple_backup_excludeItem` na pasta |
| --- | --- | --- |
| hoje | sem a chave | presente: fora do backup |
| com a chave `false`, app relançado | chave `false` | ausente: entra no backup |
| original restaurado, app relançado | sem a chave | presente de novo |

O app abriu com o progresso intacto no passo 2, então mudar a chave não toca nos
dados. Como a biblioteca reaplica o valor a cada abertura, quem já tem o app
passa a ter backup na primeira abertura da build nova.

**[não verificado]**
- **Backup real:** backup e restauração reais do iCloud e do computador, que o
  simulador não faz;
- **Build com a chave:** ainda não foi gerada. O passo 2 editou o `Info.plist`
  de um app já instalado;
- **Transferência direta:** se a transferência entre iPhones respeita o mesmo
  atributo.

## 3. Reset: sem botão, com o caminho do sistema explicado

Não há mudança no app. Os textos mudaram em `docs/legal/`:
- **página de suporte:** ganhou "Troquei de celular. Meu progresso vem junto?" e
  uma resposta nova para "Como reinicio ou apago meu progresso?". No iPhone, a
  reinstalação zera. No Android, o caminho é "Limpar armazenamento", porque
  desinstalar pode não bastar quando o backup do Google devolve os dados;
- **política de privacidade:** deixou de dizer "apenas no seu dispositivo", o
  que já era impreciso no Android. Agora cita o backup da conta Apple ou Google
  e saiu a promessa de "opção de reinício dentro do app, quando disponível";
- **cópia de publicação:** as cópias embutidas em `PROMPT_PUBLICACAO_PAGINAS.md`
  e os checksums foram atualizados junto.

**[medido]** em 2026-10-19, as duas URLs publicadas respondem 200 e ainda mostram
a versão de 2026-07-29. **Republicar é do dono, e deve vir antes da build do
item 2.**

O documento de Data Safety (`docs/store/DATA_SAFETY_E_CLASSIFICACAO.md`) não
foi alterado: ele diz que os dados ficam no aparelho e não fala de backup. O
backup vai para a conta do aluno, não para o desenvolvedor, e no Android ele já
estava ligado.

## Gates

**[medido]** `EXPO_NO_DOTENV=1 npm run quality` no Node 20.20.2, nesta worktree
([log](2026-10-19-g7-decisoes-de-recuperacao/quality.log), `exit=0`): 175 suítes e
1.795 testes do Jest, todos os contratos verdes e o visual QA com 0 regressões.
O `loop validate` do run `run-1792413731160-490f5543` fica no
envelope do run.
