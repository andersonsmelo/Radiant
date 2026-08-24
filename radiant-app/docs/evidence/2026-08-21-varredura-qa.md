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

### 2.3 Rotas sem caminho até elas

| Rota | Estado |
| --- | --- |
| `/learn`, `/checkpoint`, `/reward` | ✅ alcançáveis pela trilha, via `getJourneyNodeHref` |
| `/telemetry` | ✅ alcançável pelo console |
| `/dev-console` | ⚠️ só por deep link |
| `/quiz` | ❌ **nenhuma entrada** — o plano prevê aposentá-la (task 18) |
| `/review` | ❌ só de `HomeScreen` (inalcançável) e do runtime de checkpoint ativo (off em produção) |
| `/modal` | ❌ nenhuma entrada — resíduo do template Expo |

`HomeScreen` está morta: `(tabs)/index.tsx` só a renderiza com
`ENABLE_LEARNING_ROAD=false`, o padrão é `true` e **nenhum perfil do `eas.json`
desliga**. Ela carrega 3 dos 6 `TODO` de produção do repositório.

## 3. Órfãos — 13 módulos que nenhum código de produção importa

Uma **feature inteira**, sem rota e sem consumidor:

- `src/features/annotation/screens/AnnotationScreen.tsx`
- `src/features/annotation/components/CanvasOverlay.tsx`
- `src/features/annotation/services/annotationStorage.ts`
- `src/types/annotation.ts`

E mais nove:

- `src/features/mastery/services/CompetencyMasteryService.ts`
- `src/features/gamification/services/{badges,streak,xp}.ts`
- `src/features/spaced-repetition/models/sm2.ts`
- `src/features/quiz/services/quizStorage.ts`
- `src/features/telemetry/adapters/ProductAnalyticsAdapter.ts`
- `src/features/review/data/mockData.ts`
- `src/data/ai-catalog.ts`
- `src/ui/characters/CharacterSlot.tsx`

Não foram removidos nesta varredura: alguns podem ser intenção futura registrada,
e apagar código de domínio sem confirmar o propósito é pior que mantê-lo listado.

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
