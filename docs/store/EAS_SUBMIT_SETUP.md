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

## Android — o que Anderson precisa fazer

1. **Criar a conta Play Console** (pagamento já aprovado) e o app com o package
   `com.ascendcreative.radiant`.
2. **Gerar a service-account key** (JSON) para o `eas submit`:
   - Play Console → **Configurações → Acesso à API** → vincular/criar um projeto
     Google Cloud → criar uma **conta de serviço** → conceder acesso no Play Console
     (permissão de **release** nos tracks de teste) → gerar uma **chave JSON**.
3. **Colocar a chave** em `radiant-app/credentials/play-service-account.json`.
   - ⚠️ **Nunca commitar essa chave.** Confirme que `credentials/` está no
     `radiant-app/.gitignore` antes de baixar o arquivo (ver nota abaixo).
4. **Submeter** (depois de ter um AAB de `production` buildado via EAS):
   ```sh
   eas submit --platform android --profile production
   ```
   Para o track fechado do 12×14:
   ```sh
   eas submit --platform android --profile production --track <track-fechado>
   ```

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

- `credentials/play-service-account.json` e qualquer `.p8`/`.json` de credencial de
  loja são **segredos**. Garanta que o diretório `credentials/` esteja ignorado no
  `radiant-app/.gitignore` antes de colocar os arquivos. O scanner de segredos do Loop
  bloqueia commits de chaves, mas a primeira linha de defesa é o `.gitignore`.
