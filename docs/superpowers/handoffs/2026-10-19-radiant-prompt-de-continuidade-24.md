# Prompt de continuidade (24) — 2026-10-19, 14:30 (−03)

Você continua o Radiant com Anderson. **Uma frente por conversa.** Produto,
currículo, aprovação de conteúdo e imagens, distribuição e merge continuam com o
dono. Este prompt substitui o (22). O (23) circulou só colado numa conversa e
nunca entrou no repositório. Não execute pendências de prompts anteriores sem
reconciliar a FILA.

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
keychain (ver `AGENTS.md`, lições de 2026-10-19). Os números abaixo foram medidos
em 2026-10-19, até as 14:30, e envelhecem.

## 2. O que entrou na `main` em 2026-10-19

A `main` está em `2415de5`. Não havia PR aberta às 14:28. Todos os merges foram
feitos pelo Claude com autorização do dono, dada na conversa, e conferidos com
`gh pr view <n> --json state`.

| PR | Item | O que entrega |
| --- | --- | --- |
| #54 | FILA 54 | G4 no Android, anúncio do resultado na revisão, inventário G7 com guarda e as três decisões G7 |
| #55 | FILA 64 | o cartão da revisão não some mais no Android com "Remover animações" |
| #53 | FILA 63 | ids de tentativa em hexadecimal, que não compõem siglas do detector de dado sensível |
| #56 | FILA 65 | os glifos de ícone ficam fora da árvore que o leitor lê no Android; sem código |
| #52 | FILA 61 | limite do AsyncStorage no emulador, e as chaves `@radiant:bench:` no inventário |
| #57 | FILA 66 | a guarda dos glifos de ícone lê a AST |
| #58 | FILA 59 | dia 2 com relógio real; o nó da revisão é centrado antes do toque |
| #59 | G6 | p50 e p95 de abrir a revisão e confirmar resposta com 1.000 cartões, no emulador |

**Gate local** na `main` em `cb0bedc` (#52 a #56): 178 suítes e 1811 testes, mais
os contratos e o QA visual. Depois dele, o CI de cada PR seguinte passou.

**G6, caminho de dados**, no emulador `radiant-entrada-api34`, em Debug e com
1.000 cartões: abrir a revisão teve p95 de 371 a 386 ms a frio, e confirmar, de
74 a 81 ms. Não prova aparelho de entrada, Release nem o tempo da tela.

## 3. Em andamento

- **G7, continuação:** a sessão "G7: stores não gravam por cima de schema
  futuro" trabalha na branch `claude/g7-schema-desconhecido`. Ela enumera as
  stores de aprendizagem e economia e aplica a regra da jornada onde faltar.
  Antes de mexer em `FILA.md` ou `STATUS.md`, confira se a PR dela já abriu, e
  simule o merge.

## 4. Pendências

### Dono

1. **Republicar a política e o suporte** (pacote em
   `docs/legal/PROMPT_PUBLICACAO_PAGINAS.md`) **antes** da build que leva a
   chave de backup do iOS. A versão publicada ainda é a de 2026-07-29.
2. **Build e distribuição** da `main`: levam a chave de backup, o anúncio da
   revisão e os consertos de 2026-10-19. Uma atualização OTA não leva a mudança
   de `Info.plist`.
3. **Ouvir no aparelho:**
   - **VoiceOver no iPhone:** o anúncio do resultado da revisão;
   - **TalkBack num Android físico:**
     - se a alternativa escolhida soa "não marcado";
     - se os glifos de ícone ficam calados, como a árvore indica;
     - se o "5" do HUD é lido depois de "5 de 5 vidas".
4. **FILA 61, A2:** decidir o desenho do storage. O G6 acrescenta que o
   `loadQueue` relê o store inteiro três vezes por abertura (inferido do
   código). **Aumentar só a cota não resolve o limite por valor.**
5. FILA 60 (rolagem de 3,3 s no E1), 45 (currículo), 52 (15 imagens), 48
   (captura com o lembrete), 43 (analytics) e 6 (aceites Android).
6. **Autorizar a remoção das worktrees já integradas.** A `fila61-android`
   guarda o APK do dev client do Android: se for removida, ele precisa ser
   recompilado.

Percorra as decisões uma por vez.

### Agente

1. **Maestro no Android** (achados da FILA 54, sem conserto):
   - o subflow `dismiss-dev-client.yaml` só conhece `localhost:8081`;
   - o argumento do E1 (`radiantReduceMotion`) não chega ao app no Android, e,
     com animação, o Maestro não avança;
   - no G4, a rolagem até "Começar revisão" desce antes de a tela assentar.

   Proponha antes de mexer: pode exigir mudança nativa e build.
2. **G6 em aparelho e na tela inteira,** quando o dono tiver um Android de
   entrada. O medidor da #59 roda nele sem mudança.
3. **`useFadeInUp`:** tem o mesmo padrão do defeito da FILA 64 no código, sem
   falha medida. Falta também medir o resumo da revisão com escala 0.
4. FILA 50, que depende da 45.

Antes de abrir uma frente, diga o item, a condição de pronto e o que fica de
fora, e combine com Anderson.

## 5. Ambiente

- **Android:** SDK em `$HOME/Library/Android/sdk`; AVD `radiant-entrada-api34`
  (API 34, 2 GB, 2 núcleos). O APK do dev client está na worktree
  `.claude/worktrees/fila61-android`; reaproveite sem mexer nela.
  - **Abrir o dev client no Metro:** `adb reverse tcp:8081 tcp:8081` e
    `exp+radiant-app://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081`.
    Com `radiantapp://` e `10.0.2.2`, o app ficou em tela branca em 2026-10-19.
  - **Medidor do store e do G6:** Metro com `EXPO_PUBLIC_RADIANT_STORE_BENCH=1`,
    depois `radiantapp://dev-console`, e a linha `done` em
    `adb logcat -d | grep radiant-store-bench`.
  - **Remover animações:** as três escalas em 0. Restaure com
    `settings delete global animator_duration_scale` e as outras duas em 1.0.
  - **Árvore de acessibilidade:** o que o leitor percorre é o
    `uiautomator dump --compressed`, com as animações em 0. O
    `maestro hierarchy` e o dump completo listam também os nós ignorados.
- **iOS:** use o simulador descartável `E262D4C1`. O `5FD8C926` cumpriu o dia 2
  e ficou com a revisão feita, com a próxima disponível em 2026-10-22.
- **Antes de validar:** pare app, simulador ou emulador e Metro, e confira a
  carga com `sysctl -n vm.loadavg`.

## 6. Contrato de execução

- `using-loop` e `loop-development`. Loop usa Node 24; app, testes, builds e
  Metro usam Node 20. Confira `node --version`.
- Abra pelo `node scripts/loop/abrir.mjs`, declarando todos os caminhos. Se a
  frente puder mudar um arquivo que você não previu, como um roteiro do
  Maestro, declare-o também: fechar um run em `editing` e abrir outro é
  possível, mas gasta tempo.
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
  `gh pr merge <n> --merge`. Push direto na `main` é barrado.
- **Relatório final:** arquivos, provas, PR e checks, estado do run e da
  sessão, e pendências. Separe emulador, aparelho físico e produção.
