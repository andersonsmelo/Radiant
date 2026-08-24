# Varredura de QA — 2026-08-21

Ambiente: simulador `Radiant iPhone 17 Pro — iOS 26.5`, `main` em `f71bfe1`,
Metro com `--clear` e app relançado antes de cada leitura de estado.

Três varreduras: estática (órfãos e alcançabilidade), runtime (percorrer o app) e
uma checagem do que o gate não cobre.

## 1. Funciona — verificado percorrendo, não por teste

O ciclo crítico inteiro, sem um único erro de console:

`trilha → lição (4 passos) → alternativa correta → conclusão com estrelas →
volta à trilha com progresso atualizado → checkpoint → conquista → próxima lição`

Confirmado na tela: XP subiu de 72 para 90, o cabeçalho avançou, a linha da
trilha estendeu o preenchimento, o nó ficou marcado, e o nó seguinte virou
`PRÓXIMO`. A aba Perfil renderiza identidade, missões, progresso, conta e o
cartão legal — este último alcançável no fim da rolagem, que é requisito de
submissão.

**A conclusão de lição está alcançável.** Era a pendência que a spec do
sub-projeto 2 descrevia como "existe e ninguém pode ver": todo o fim de lição
vivia em `/quiz`, sem ponto de entrada. Hoje `/learn` a entrega.

## 2. Precisa de atenção

### 2.1 O script de homologação promete flags que não entrega

`npm run ios:v2` exporta `EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false` e
`EXPO_NO_DOTENV=1`, e imprime `Flags: … REMOTE_SYNC=false`. O app, aberto logo em
seguida, reporta **Sync remoto: ativado** e **API: `https://api.radiant.ascendcreative.com.br`**.

Não é cache: reproduzido com `--clear` e com o app terminado e relançado.

**Causa isolada por experimento controlado.** Tirando `radiant-app/.env` do
caminho e reiniciando o Metro limpo, o console passou a mostrar
`Sync remoto: desativado`, `API: não configurada` e `Beta Gate: desativado`. O
arquivo foi restaurado byte a byte em seguida. `.env` — que não é versionado —
declara `REMOTE_SYNC=true`, `BETA_GATE=true` e a URL de produção, e **vence tanto
o `export` do shell quanto o `EXPO_NO_DOTENV=1`**.

> **Correção de método.** Uma primeira leitura desta seção afirmou que
> `.env.local` declarava o oposto. Não declara: ele tem uma linha só,
> `EXPO_PUBLIC_APP_ENV=development`. As linhas atribuídas a ele vieram do
> `.env.example`, varrido junto por um `grep .env*`. O erro não mudou a
> conclusão, mas mudaria o remédio se tivesse sobrevivido — por isso fica
> registrado.
>
> Uma tentativa intermediária de diagnosticar lendo o bundle servido por
> `curl` deu resposta ERRADA: o bundle baixado por aquele endpoint declarava
> `REMOTE_SYNC="false"` e não continha a URL, contradizendo o que o app exibia.
> Só o experimento com o arquivo fora do caminho deu resposta confiável.

**Por que importa:** quem homologa com esse script acredita estar testando
local-first com sync desligado, enquanto o binário pode autenticar e sincronizar
contra a API de produção. Toda conclusão tirada de uma sessão dessas fica sob
suspeita.

**Corrigido em 2026-08-21.** `scripts/check-env-precedence.mjs` resolve, na mesma
ordem de precedência que o Expo usa, qual arquivo vence para cada chave que o
script declara — e `start-ios-v2.sh` o executa **antes** de imprimir qualquer
INFO. Divergência aborta a subida nomeando a chave, os dois valores e o arquivo.
Chave que só o script declara não é conflito; arquivo de precedência maior que
concorda com o script blinda o de menor. Os dois caminhos — reprovar e aprovar —
foram exercitados, e o contrato `test:env-precedence-contract` entrou no gate.

**Resolvido em 2026-08-24, com o dono.** O `.env` desta máquina passou a ter
`EXPO_PUBLIC_API_BASE_URL=` vazio, e as linhas de `ENABLE_REMOTE_SYNC` e
`ENABLE_BETA_GATE` foram removidas — o script de homologação é a autoridade
delas. Backup em `~/.radiant-env.backup-2026-08-24`.

Provado ponta a ponta: o script sobe, e o console de desenvolvimento reporta
`Sync remoto: desativado`, `Beta Gate: desativado`, `API: não configurada` e
`Learning Road: ativada` — exatamente o que ele imprime.

---

## O achado que a correção expôs — `ENABLE_REMOTE_SYNC` não desliga o Auth

**Estado:** aberto. **Registrado, não corrigido**, por decisão do dono em
2026-08-24: mexer no gate do `AuthService` afeta login, sync e o contrato de
telemetria, e merece passagem própria.

`AppConfig.ENABLE_REMOTE_SYNC` gateia **duas** coisas, e só elas:

- a exibição `remoteSyncAvailable`, em `ProgressScreen` e `DevConsoleScreen`;
- `SyncQueueService.flush`.

Ele **não** gateia o `AuthService`, que decide apenas por `isApiConfigured()` —
isto é, pela presença de `EXPO_PUBLIC_API_BASE_URL`. E `AuthService.bootstrap()`
é chamado em:

| Chamador | Quando |
| --- | --- |
| `src/app/_layout.tsx:158` | **startup do app** |
| `ProfileScreen` | ao abrir a aba Perfil |
| `ProgressScreen` | ao abrir a seção de progresso |
| `AppStoreOpsService` | verificação de operação de loja |
| `UpgradeInterestService` | interesse em upgrade |

`login` e `register` chamam `apiRequest` direto, sem consultar a flag.

**A consequência prática, que mudou a recomendação desta correção:** alinhar
`REMOTE_SYNC=false` no `.env` — que era um dos dois caminhos oferecidos — faria o
guarda **aprovar** enquanto o app continuaria autenticando contra produção no
startup. Teria trocado um aviso visível por uma falsa sensação de segurança, que
é a classe de erro que este guarda existe para impedir. Foi por isso que a URL
vazia entrou no perfil do script e no escopo do guarda.

**Por que ninguém tinha visto:** a flag se chama "remote sync" e é lida por todo
mundo como "o app não fala com a rede". Ela nunca prometeu isso. O nome sugere um
alcance que o código não tem.

**Se for corrigir:** decidir primeiro se auth e sync são eixos independentes por
desenho. Se forem, documentar a distinção onde a flag é declarada. Se não forem,
`AuthService` passa a exigir `ENABLE_REMOTE_SYNC` além de `isApiConfigured()`, e
os testes de login/register/bootstrap acompanham.

### 2.2 O console de desenvolvimento não tem entrada in-app

`/dev-console` está declarado em `_layout.tsx` e **nenhum código empurra para
ele**. Só abre por deep link (`radiantapp://dev-console` — verificado, funciona).

A extração do console para rota própria (sub-projeto 2) foi correta e destravou a
aba Perfil, mas não criou porta de entrada. O checklist de release registra que a
homologação em aparelho depende dessa tela.

**Corrigido em 2026-08-24.** O Perfil ganhou uma porta no fim da rolagem, atrás
de `SHOW_DEV_TOOLS` — que é `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, logo
inexistente no build do aluno. É uma **porta**, não os controles: Learning Road,
Beta Gate e reset de estado local continuam fora do perfil, e o caso que proíbe
esses controles ali segue verde ao lado do caso novo. Verificado no simulador:
a porta fica acima da tab bar flutuante e abre o console.

### 2.3 Rotas sem caminho até elas

| Rota | Estado |
| --- | --- |
| `/learn`, `/checkpoint`, `/reward` | ✅ alcançáveis pela trilha, via `getJourneyNodeHref` |
| `/telemetry` | ✅ alcançável pelo console |
| `/dev-console` | ✅ porta no fim do Perfil, atrás de `SHOW_DEV_TOOLS` (2026-08-24) |
| `/quiz` | ❌ **nenhuma entrada** — o plano prevê aposentá-la (task 18) |
| `/review` | ❌ só de `HomeScreen` (inalcançável) e do runtime de checkpoint ativo (off em produção) |
| ~~`/modal`~~ | ✅ removida em 2026-08-24 — era o modal literal do template Expo, "This is a modal" em inglês |

`HomeScreen` não é alcançável: `(tabs)/index.tsx` só a renderiza com
`ENABLE_LEARNING_ROAD=false`, o padrão é `true` e **nenhum perfil do `eas.json`
desliga**. Ela carrega 3 dos 6 `TODO` de produção do repositório.

**Não é órfã para apagar.** O comentário em `src/config.ts` declara que a flag
"permanece como kill switch" — então a `HomeScreen` é o alvo desse switch, e
removê-la desarmaria o mecanismo.

**O switch foi acionado e medido em 2026-08-24.** Ele funciona mecanicamente: o
app sobe, navega, sem crash e sem erro no console. Mas o fallback renderizava
**inteiramente no tema claro** — fundo branco num app cuja identidade é galaxy
dark, com a barra de status ilegível. Num incidente esse é o pior comportamento
possível para uma rede de segurança: o aluno vê uma tela branca estranha e
conclui que o app quebrou, que é o oposto do que o switch existe para transmitir.

**Corrigido.** `HomeScreen` passou a usar `semanticColors.galaxy`. Uma linha
remapeia as 52 referências; os únicos literais claros que precisaram mudar foram
dois verdes escuros (`#1A7A3A`) que sumiriam no fundo escuro. Os brancos ficaram:
todos vivem dentro do cartão de gradiente azul, onde estão corretos. `StatPill`
já tinha prop `dark` e `ProgressRing` já usa o contexto galaxy — **nenhum
componente compartilhado foi tocado**, que era a fronteira a não cruzar.

**A guarda que deveria ter pego, e não pegava.** O `identity-palette-contract`
cobre `src/features` e `src/app`, inclui a `HomeScreen` e passava verde. Ela não
importava `colors`: fazia `const light = semanticColors.light`, e `semanticColors`
estava na lista de camadas permitidas. Era a mesma paleta clara por uma porta
autorizada. O contrato passou a proibir o **acesso ao contexto claro** dentro das
raízes de produto — mantendo `semanticColors.galaxy` permitido, que é o alvo
recomendado — e a ignorar comentários, para não punir quem documenta a regra.

**Continua aberto:** os três `TODO` da tela mostram travessão em vez de dado.
Mostrar nada é honesto; mostrar número errado seria pior. Não é urgente.

## 3. Órfãos — resolvido em 2026-08-24

A varredura listou 13 módulos que nenhum código de produção importa e não removeu
nenhum, com a justificativa de que apagar código de domínio sem confirmar o
propósito é pior que mantê-lo listado. A justificativa estava certa e **não se
aplicava à maior parte da lista**: "sem consumidor" é propriedade do grafo de
imports, e o grafo não distingue origem. Medindo **tamanho** e **commit de
entrada**, os 13 se separam em três grupos com remédios opostos.

### Removidos — 11 arquivos, 165 linhas

**Seis stubs vazios** (0 byte, entraram vazios no bulk `847a12d`, 473 arquivos,
2026-04-09, nunca preenchidos): `AnnotationScreen.tsx`, `CanvasOverlay.tsx`,
`annotationStorage.ts`, `badges.ts`, `streak.ts`, `quizStorage.ts`. A "feature
`annotation` inteira" era três arquivos vazios mais 13 linhas de tipos — não
havia domínio a proteger.

**Duas duplicatas de implementação viva:** `models/sm2.ts` (43 l) contra o SM-2
que o `SpacedRepetitionService` implementa por conta própria, e `services/xp.ts`
(14 l) contra o `XP_RULES` do `GamificationService`. Duas implementações do mesmo
algoritmo são risco ativo, não inventário.

**Três mortos sem irmão vivo:** `types/annotation.ts` (existia só para os stubs
vazios), `review/data/mockData.ts`, `ui/characters/CharacterSlot.tsx` — com este
último saíram `CharacterSlotProps` e `CharacterAlign`, que morriam junto, e
`CharacterSpec`, que já estava morto.

### Mantidos, por não serem andaime — decisão do dono

- **`src/data/ai-catalog.ts`** é **gerado**: a primeira linha diz
  `AUTO-GENERATED` e `scripts/content/sync-catalog-to-app.mjs` o escreve. Apagar
  seria desfeito na próxima execução do pipeline. É "emitido e não consumido", e
  o remédio fica a montante.
- **`CompetencyMasteryService`** é a metade **leitora** de um par cuja escrita
  está viva: `LessonOutcomeService` chama `LearningEvidenceRepository.append()`
  por interação, no caminho vivo da lição. O app grava evidência a cada atividade
  e ninguém lê.
- **`ProductAnalyticsAdapter`** é o mesmo padrão em miniatura: a interface e o
  `TelemetryService.registerProductAnalyticsAdapter` continuam vivos e sem
  nenhum chamador.

### O que a verificação exigiu, e o gate não daria

A conferência foi por **nome, no repositório inteiro** — não por import. Ela
pescou dois acoplamentos que nenhum grafo de imports enxerga: a regra `R5` do
`visual-qa.mjs` cita `CharacterSlot` por regex, e o `.rnstorybook` monta por
`require.context`. Nenhum dos dois quebra com a remoção, mas nenhum dos dois
apareceria numa busca por `import`.

Evidência: `npm run quality` com 100 suítes / 717 testes e 0 regressão visual;
`loop validate` com `VALIDATION_PASSED` e 13 evidências.

## 4. Corrigido durante a varredura

Percorrendo a lição, o aluno via **"2 de 21"** no cabeçalho e **"3 de 14 lições"**
na conclusão, para o mesmo currículo. Duas falhas somadas: o cabeçalho contava
todos os nós em vez de excluir revisões — uma terceira cópia de uma regra que já
morava em `computeUnitPrimaryProgress` —, e a conclusão chamava de "lições" um
total que inclui checkpoints e a conquista. Corrigido em `505409f`.

## 5. O que o gate não cobre, e continua não cobrindo

- **Os flows do Maestro não rodam no `npm run quality`.** Só o contrato deles
  roda, e ele afirma estrutura, não copy contra tela. Em 2026-08-21 uma mudança
  de copy quebrou 20 asserções em 9 flows sem nenhum sinal.
- **Nenhum passo empacota o app.** Um binário que não inicia é compatível com os
  17 passos verdes — já aconteceu neste repositório.
- **Nada aqui foi medido em Android nem em aparelho físico.**
