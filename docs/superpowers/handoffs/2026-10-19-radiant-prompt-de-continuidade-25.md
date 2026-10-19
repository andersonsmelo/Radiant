# Prompt de continuidade (25) — 2026-10-19, 19:15 (−03)

Você continua o Radiant com Anderson. **Uma frente por conversa.** Produto,
currículo, aprovação de conteúdo e imagens, distribuição e merge continuam com o
dono. Este prompt substitui o (24). Não execute pendências de prompts anteriores
sem reconciliar a FILA.

## 1. Leia e meça antes de agir

Repositório: `/Users/anderson/Developer/Radiant`. O checkout principal está num
branch antigo: não implemente nele. Para trabalho novo, use
`git worktree add --no-track -b <branch> <caminho> origin/main`.

Leia na worktree:
1. `AGENTS.md` inteiro e `.loop/project.yaml`;
2. `docs/STATUS.md`, o único estado vivo;
3. `docs/FILA.md`, o item da frente escolhida.

Remeça o estado antes de citar qualquer número:

```bash
git fetch origin --prune
git log -3 --oneline origin/main
gh pr list --state open --json number,title,headRefOid,mergeable
git worktree list
sysctl -n vm.loadavg
```

O `gh` precisa rodar **fora do sandbox** do Bash, porque o token mora no
keychain (`AGENTS.md`, lições de 2026-10-19). Os números abaixo foram medidos em
2026-10-19, até as 19:15, e envelhecem.

## 2. Estado em 2026-10-19, 19:15

**A `main` contém a #63, e não havia PR aberta às 19:41.** O hash da `main` não
fica aqui: este arquivo entra na `main` pelo próprio commit e o deixaria velho.
Remeça com `git log -1 origin/main`. Em 2026-10-19 entraram as
PRs #52 a #62, todas integradas pelo Claude com autorização do dono, dada na
conversa, e conferidas com `gh pr view <n> --json state`. O resumo de cada uma está no
[prompt (24)](2026-10-19-radiant-prompt-de-continuidade-24.md), §2. A #60 trouxe
o (24), as lições do dia no `AGENTS.md` e o STATUS e a FILA reconciliados. A
#62 trouxe este prompt.

**A última, às 19:09:** a [PR #61](https://github.com/andersonsmelo/Radiant/pull/61),
G7 (`d2ec52c`):
- **o que entrega:** a regra "uma versão antiga não grava por cima de um store
  com `schemaVersion` que não conhece" passa a valer em mais 5 stores, que
  gravavam por cima ou apagavam:
  - tentativas;
  - domínio;
  - assinatura;
  - checkpoints ativo e sombra;
  - a mescla do backup do iCloud.

  A migração 1.4 também deixou de zerar as vidas diante de um marcador de versão
  mais nova. O predicado mora em `radiant-app/src/storage/schemaVersionGuard.ts`;
- **provas:** os 8 testes do defeito foram vistos falhando, e o gate passou com
  179 suítes e 1.832 testes. Depois de a branch ser atualizada duas vezes com a
  `main`, com os conflitos de documentação resolvidos mantendo os dois lados,
  os checks `content` e `quality` passaram em `e5651d1`;
- **não verificado:** nenhuma volta de versão real com duas builds no mesmo
  aparelho. A proteção só chega ao aluno numa build nova.

## 3. Pendências

### Dono

1. **As 5 stores sem `schemaVersion`: decidido em 2026-10-19 à noite.** Saída
   1 nas vidas e na meta diária, saída 2 nas outras três, e o gasto de vidas
   da build antiga não é guardado. Falta o **merge** da branch
   `claude/g7-vidas-meta-diaria`
   ([evidência](../../evidence/2026-10-19-g7-vidas-e-meta-diaria.md)).
2. **Republicar a política e o suporte** (pacote em
   `docs/legal/PROMPT_PUBLICACAO_PAGINAS.md`) **antes** da build que leva a
   chave de backup do iOS. A versão publicada ainda é a de 2026-07-29.
3. **Build e distribuição** da `main`: levam a
   chave de backup, o anúncio da revisão, os consertos de 2026-10-19 e as
   guardas de schema. Uma atualização OTA não leva a mudança de `Info.plist`.
4. **Ouvir no aparelho:**
   - **VoiceOver no iPhone:** o anúncio do resultado da revisão;
   - **TalkBack num Android físico:**
     - se a alternativa escolhida soa "não marcado";
     - se os glifos de ícone ficam calados, como a árvore indica;
     - se o "5" do HUD é lido depois de "5 de 5 vidas".
5. **FILA 61, A2:** decidir o desenho do storage. O G6 acrescenta que o
   `loadQueue` relê o store inteiro três vezes por abertura (inferido do
   código). **Aumentar só a cota não resolve o limite por valor.**
6. FILA 60 (rolagem de 3,3 s no E1), 45 (currículo), 52 (15 imagens), 48
   (captura com o lembrete), 43 (analytics) e 6 (aceites Android).
7. **Autorizar a remoção das worktrees já integradas.** A `fila61-android`
   guarda o APK do dev client do Android: se for removida, ele precisa ser
   recompilado.

Percorra as decisões uma por vez.

### Agente

1. ~~Aplicar a decisão do dono sobre as 5 stores sem `schemaVersion`.~~ Feito
   em 2026-10-19 à noite, com 7 testes vistos falhando, na branch
   `claude/g7-vidas-meta-diaria`.
2. **Maestro no Android** (achados da FILA 54, sem conserto):
   - o subflow `dismiss-dev-client.yaml` só conhece `localhost:8081`;
   - o argumento do E1 (`radiantReduceMotion`) não chega ao app no Android, e,
     com animação, o Maestro não avança;
   - no G4, a rolagem até "Começar revisão" desce antes de a tela assentar.

   Proponha antes de mexer: pode exigir mudança nativa e build.
3. **G6 em aparelho e na tela inteira,** quando o dono tiver um Android de
   entrada. O medidor da #59 roda nele sem mudança.
4. **`useFadeInUp`:** tem no código o mesmo padrão do defeito da FILA 64, sem
   falha medida. Falta também medir o resumo da revisão com escala 0.
5. FILA 50, que depende da 45.

Antes de abrir uma frente, diga o item, a condição de pronto e o que fica de
fora, e combine com Anderson.

## 4. Ambiente

- **Android:** SDK em `$HOME/Library/Android/sdk`; AVD `radiant-entrada-api34`
  (API 34, 2 GB, 2 núcleos). O APK do dev client está na worktree
  `.claude/worktrees/fila61-android`; reaproveite sem mexer nela.
  - **Abrir o dev client no Metro:** `adb reverse tcp:8081 tcp:8081` e
    `exp+radiant-app://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`;
  - **Medidor do store e do G6:** Metro com `EXPO_PUBLIC_RADIANT_STORE_BENCH=1`,
    depois `radiantapp://dev-console`, e a linha `done` em
    `adb logcat -d | grep radiant-store-bench`;
  - **Remover animações:** as três escalas em 0. Restaure com
    `settings delete global animator_duration_scale` e as outras duas em 1.0;
  - **Árvore de acessibilidade do leitor:** `uiautomator dump --compressed`,
    com as animações em 0.
- **iOS:** use o simulador descartável `E262D4C1`. O `5FD8C926` cumpriu o dia 2
  da FILA 59, e a próxima revisão dele fica disponível em 2026-10-22.
- **Antes de validar:** pare app, simulador ou emulador e Metro, e confira a
  carga com `sysctl -n vm.loadavg`.

## 5. Contrato de execução

- `using-loop` e `loop-development`. Loop usa Node 24; app, testes, builds e
  Metro usam Node 20. Confira `node --version`.
- Abra pelo `node scripts/loop/abrir.mjs`, declarando todos os caminhos,
  inclusive os que a frente pode tocar sem estar prevista.
- Provisione a worktree antes do run: `npm ci` em `radiant-app` e em
  `radiant-api`, e copie `pages.json` e `excerpts.json` das extrações.
- Metro com `EXPO_NO_TYPESCRIPT_SETUP=1`. O gate é
  `EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`.
- **Ao editar FILA ou STATUS:** declare os históricos e mova para eles, sem
  edição, os trechos que saem.
- **Fechamento:** `validate → step finish → [memory write] → run close`, uma
  chamada por comando, lendo o `code` de cada envelope. Feche a sessão do
  cérebro separadamente.
- **Push e PR:** o push está autorizado, e a PR abre quando a frente fica
  pronta. Antes da PR, simule o merge com cada PR aberta e rode as guardas na
  árvore combinada.
- **Merge:** só com autorização do dono na conversa, sempre por
  `gh pr merge <n> --merge`, conferindo depois o estado no GitHub. Push direto
  na `main` é barrado. PR só de documentação tem apenas o check `content`.
- **Relatório final:** arquivos, provas, PR e checks, estado do run e da
  sessão, e pendências. Separe emulador, aparelho físico e produção.
