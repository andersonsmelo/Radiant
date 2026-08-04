# EAS Submit — setup de submissão (Android + iOS)

> Preparado em 2026-07-29 na ofensiva de aceleração. Objetivo: deixar a submissão
> pronta para disparar assim que as contas de loja existirem. **Não roda nada
> aqui** — é o passo-a-passo do que configurar. O bloco `submit.production` do
> [`radiant-app/eas.json`](../../radiant-app/eas.json) já foi preenchido para as
> duas plataformas.

## Estado atual (o que já está no `eas.json`)

```json
"submit": {
  "production": {
    "ios": {},
    "android": {
      "serviceAccountKeyPath": "./credentials/play-service-account.json",
      "track": "internal",
      "releaseStatus": "draft"
    }
  }
}
```

- **`track: "internal"`** é de propósito para o **primeiro** upload: internal testing
  sobe na hora, sem revisão, e valida o pipeline. O closed test dos 12×14 dias usa um
  **track fechado** — ao submeter para ele, use `eas submit --platform android --track <nome-do-track-fechado>` (o nome é o que você criar no console).
- **`releaseStatus: "draft"`** deixa o build como rascunho no console (você promove
  manualmente), evitando publicação acidental.

## O upload de source maps do Sentry derrubava todo build limpo

**Descoberto em 2026-07-31, no primeiro build Android da história do projeto.** O
plugin Gradle do `@sentry/react-native` roda uma task de upload de source maps em
**todo build de release**, e ela falhava:

```
INFO   Loaded file referenced by SENTRY_PROPERTIES (android/sentry.properties)
error: An organization ID or slug is required (provide with --org)
```

A configuração que ela espera não existia em lugar nenhum: o `app.json` declara o
plugin como a string `"@sentry/react-native"`, sem `organization` nem `project`; o
`android/sentry.properties` gerado registra em comentários que cai em `SENTRY_ORG`,
`SENTRY_PROJECT` e `SENTRY_AUTH_TOKEN`; e nenhum perfil do `eas.json` definia
qualquer uma delas.

**Correção:** `SENTRY_DISABLE_AUTO_UPLOAD: "true"` nos perfis **`preview` e
`production`** — os que produzem release para distribuição. Verificado localmente:
com a variável, a task sai `SKIPPED` e o build sai `BUILD SUCCESSFUL`; sem ela,
falha. O teste foi feito **apagando antes**
`android/app/build/generated/assets/createBundleReleaseJsAndAssets`, para que o
bundle fosse regerado — sem isso, o Gradle reaproveita o cache e a task de upload
nem roda.

**Por que isso passou despercebido até o primeiro build na nuvem:** o
`BUILD SUCCESSFUL in 48s` registrado em 2026-07-30 era um build com o bundle em
cache, e a task de upload só roda quando o bundle é regerado. O EAS constrói sempre
do zero, então foi o primeiro a expor a falha. Um verde local com cache não é
evidência sobre um build limpo.

**Para builds locais de release**, exporte a variável na mesma invocação — ela não
está no `eas.json` local nem no `android/gradle.properties` (que é gerado pelo
prebuild e não sobrevive):

```sh
cd radiant-app/android && ANDROID_HOME="$HOME/Library/Android/sdk" \
  JAVA_HOME="$HOME/.jdks/jdk-17.0.19+10/Contents/Home" \
  SENTRY_DISABLE_AUTO_UPLOAD=true ./gradlew assembleRelease
```

**Por que o perfil `e2e-test` ficou de fora, de propósito:** o contrato
`scripts/maestro-contract.test.mjs` fixa o `env` desse perfil com `deepStrictEqual`,
para impedir que uma flag entre sem ser notada e invalide a evidência de E2E — foi
essa a classe de defeito que já obrigou a refazer o E2E antes. Acrescentar a
variável lá reprovaria o gate, e **enfraquecer o contrato para acomodar a mudança
seria o caminho errado**: a assertividade exaustiva é o valor dele. Além disso, o
`SENTRY_DISABLE_AUTO_UPLOAD` é variável de **build**, não de runtime, e o env desse
perfil descreve o que o app enxerga. Os builds de E2E são **locais**
(`./gradlew assembleRelease`) e não leem o `eas.json`, então nada fica quebrado.
*Ressalva registrada:* quem um dia rodar `eas build --profile e2e-test` na nuvem
baterá na mesma falha do Sentry — exporte a variável ou trate o contrato primeiro.

**Isto não desliga o Sentry em runtime** — ele já estava desligado
(`ENABLE_CRASH_REPORTING` tem default `false` e não é declarado em nenhum perfil).
O que a variável desliga é o **envio de source maps em tempo de build**, que só faz
sentido quando existe uma organização Sentry para recebê-los.

**Pendência que isto cria:** a task **F6** do roadmap prevê monitorar crash-free
≥99% pelo Sentry depois do lançamento. Para isso, alguém precisa criar organização e
projeto no Sentry e guardar o `SENTRY_AUTH_TOKEN` como segredo do EAS. É
pré-requisito do F6, não do closed test.

## O `versionCode` é governado pelo servidor, não pelo `app.json`

O `eas.json` declara `cli.appVersionSource: "remote"` e o perfil `production` usa
`autoIncrement: true`. Com isso o **EAS mantém o contador de `versionCode` no
servidor** e o incrementa a cada build.

Medido em 2026-07-31, no primeiro build Android da história do projeto: o
`app.json` dizia `versionCode: 2` e o build saiu com **`versionCode: 3`**.

Consequência prática: **o `android.versionCode` do `app.json` virou decorativo.**
Editá-lo não muda o que sai no AAB, e lê-lo para responder "qual é o versionCode
atual" dá a resposta errada. Para o valor real:

```sh
cd radiant-app && npx eas-cli build:list --platform android --limit 1 --json
```

O `version` (1.3.0) continua vindo do `app.json`, e com ele o `runtimeVersion`
pela política `appVersion`. Só o `versionCode` migrou para o servidor.

## Track fechado: `alpha`

O teste fechado criado em 2026-07-31 se chama **`alpha`** — nome que o próprio Play
Console atribui. É o valor de `--track`. O `track: "internal"` do `eas.json`
permanece deliberado para o primeiro upload de validação de pipeline.

**A key não bloqueia o primeiro upload:** o `.aab` pode ser enviado à mão pelo
console (Teste fechado → Versões → Criar nova versão). O `eas submit` é automação,
não pré-requisito — e essa distinção tira a geração da chave do caminho crítico.

## Android — o que Anderson precisa fazer

1. ~~**Criar o app** com o package `com.ascendcreative.radiant`.~~ **Concluído em
   2026-07-31** (task A3): o app existe como `Radiant — Radiologia`. A conta Play
   Console é tipo Pessoal, "Saúde Diagnóstica" — §3 do
   [status canônico](../EXECUTION_STATUS_2026-07-29.md). ~~O que continua pendente
   nela é a **verificação de acesso a dispositivo**, que exige aparelho Android
   real.~~ **Também concluída em 2026-07-31** (task A2); deixou de gatear a
   publicação. Este passo fica aqui como registro — não há nada a fazer nele.
2. **Gerar a service-account key** (JSON) para o `eas submit`:
   - Play Console → **Configurações → Acesso à API** → vincular/criar um projeto
     Google Cloud → criar uma **conta de serviço** → conceder acesso no Play Console
     (permissão de **release** nos tracks de teste) → gerar uma **chave JSON**.
3. **Colocar a chave** em `radiant-app/credentials/play-service-account.json`.
   - ⚠️ **Nunca commitar essa chave.** Antes de baixar o arquivo, confirme a
     proteção **perguntando ao git**, não lendo um arquivo:

     ```bash
     cd "$(git rev-parse --show-toplevel)" && git check-ignore -v radiant-app/credentials/play-service-account.json
     ```

     A saída esperada é `.gitignore:37:credentials/`. Se **nada for impresso**,
     pare e avise — a regra sumiu.
4. **Submeter** (depois de ter um AAB de `production` buildado via EAS):
   ```sh
   eas submit --platform android --profile production
   ```
   Para o track fechado do 12×14 — **o track deste app chama-se `alpha`**, medido
   no console em 2026-07-31; não é um nome a inventar:
   ```sh
   eas submit --platform android --profile production --track alpha
   ```

> **Estado em 2026-08-04:** `radiant-app/credentials/` existe e está **vazio** —
> a key nunca foi gerada, então o passo 2 é o único que resta e ele é seu. A
> proteção do `.gitignore` foi reverificada nesta data e responde exatamente
> `.gitignore:37:credentials/`, como o passo 3 espera.
>
> Nada disso bloqueia subir a build: o AAB pode ir pelo console. Há um
> `1.3.1 (6)` pronto, e ele é o primeiro que inclui a correção da barra de status
> — o `1.3.1 (5)` do mesmo dia **precede** essa correção e não deve ser usado.

## iOS — o que Anderson precisa fazer

1. **Conta Apple Developer** ativa; app criado no App Store Connect com o bundle id
   `com.ascendcreative.radiant`.
2. **App Store Connect API key** (Users and Access → Integrations → App Store Connect
   API → gerar key `.p8` + Key ID + Issuer ID). O `ios: {}` vazio faz o EAS pedir/usar
   as credenciais interativamente ou via `ascApiKeyPath`/env; documente a key onde o
   EAS Submit espera (ou preencha `ascApiKeyPath`, `ascApiKeyId`, `ascApiKeyIssuerId`).
3. **Submeter**:
   ```sh
   eas submit --platform ios --profile production
   ```
   (envia para o TestFlight; o beta review da Apple libera para os testadores.)

## Ordem sugerida (uma vez que as contas existam)

1. Build `production` das duas plataformas via EAS (`eas build --profile production
   --platform all`). **Isto trava a política de `runtimeVersion`** — só disparar quando
   for de fato submeter (ver alerta do roadmap/D5).
2. `eas submit` iOS → TestFlight (pode ir na frente: a Apple não exige cota de
   testadores, só App Review).
3. `eas submit` Android → internal testing (validar) → promover para o track fechado.
4. Recrutar os 12+ testadores no track fechado → 14 dias consecutivos → solicitar
   produção.

## Nota de segurança

`credentials/play-service-account.json` e qualquer `.p8`/`.json` de credencial de
loja são **segredos**. O scanner do Loop bloqueia commits de chaves, mas a primeira
linha de defesa é o `.gitignore`.

**A regra que protege a chave vive no `.gitignore` da RAIZ, linha 37 (`credentials/`),
não no `radiant-app/.gitignore`.** A redação anterior desta nota mandava conferir no
`radiant-app/.gitignore`, que tem `*.p8` mas **não** tem `credentials/` — quem
seguisse a instrução olharia o arquivo errado, não encontraria a regra e concluiria
que a proteção não existe, no exato momento anterior a baixar um segredo.

Por isso a verificação é `git check-ignore -v`, e não a leitura de um arquivo: ela
pergunta ao git qual regra de qual arquivo está de fato valendo, o que nenhuma
leitura de `.gitignore` isolado responde. Um `.gitignore` pode existir, ser lido,
parecer errado e ainda assim não ser o que decide.

A regra fica em **um** lugar de propósito. Duplicá-la no `radiant-app/.gitignore`
como "defesa em profundidade" cria duas fontes para o mesmo fato, que divergem no
primeiro dia em que alguém editar uma delas.
