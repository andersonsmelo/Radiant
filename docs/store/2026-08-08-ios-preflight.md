# Pré-voo do lançamento iOS — 2026-08-08

Folha para transcrever no App Store Connect, com a evidência de cada resposta.
Nada aqui é opinião: cada linha diz o comando ou o arquivo que a sustenta.

## O reenquadramento que abre este documento

**O caminho iOS não depende da F2.** A exigência de **12 testadores por 14 dias
corridos** é do **Google Play**, para conta pessoal, e a Apple não tem
equivalente. As tasks F3, F4 e F5 do roadmap misturam as duas lojas: o
questionário de acesso a produção e o rollout faseado são do Play e **não**
travam a App Store.

Enquanto o relógio do Android não começa, o iOS avançou por sua rota própria e
foi submetido à App Review em 2026-08-08.

## Gate de release, medido em 2026-08-08

```bash
cd radiant-app && npx tsc --noEmit && npx eslint . && npx jest
```

| Verificação | Resultado |
| --- | --- |
| `tsc --noEmit` | **exit 0** |
| `eslint .` | **0 erros**, 11 avisos (todos `react-hooks/exhaustive-deps`) |
| `jest` | **56 suítes, 330 testes, 0 falhas** |

Versionamento: `version 1.3.1`, `runtimeVersion: {policy: appVersion}`,
`bundleIdentifier com.ascendcreative.radiant`. `eas.json` declara
`appVersionSource: remote` com `autoIncrement`, então `ios.buildNumber: 3` no
`app.json` estar atrás do TestFlight é **esperado** — o contador vive no
servidor, não no arquivo.

## Privacy labels — a resposta é "Data Not Collected"

**A E3 do roadmap diz "declarar Sentry (crash data)". Medido, isso está errado
para o binário que embarca.** O Sentry está no `package.json` e no `app.json`,
mas **não roda em produção**.

`radiant-app/src/features/telemetry/bootstrap.ts:10` só inicializa com
**as duas** condições verdadeiras:

```ts
return AppConfig.ENABLE_CRASH_REPORTING && Boolean(AppConfig.SENTRY_DSN);
```

E nenhuma das duas é satisfeita pelo perfil `production` do `eas.json`:

| Variável | Como resolve | Onde está a evidência |
| --- | --- | --- |
| `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` | **ausente** no perfil → `readBooleanFlag(..., false)` → **false** | `src/config.ts:25`, `eas.json` perfil `production` |
| `EXPO_PUBLIC_SENTRY_DSN` | **ausente** no perfil → `?? ''` → vazio | `src/config.ts:23` |

`SENTRY_DISABLE_AUTO_UPLOAD` está no perfil, mas é flag de **build**, para
upload de source map — não é o DSN de runtime.

As outras superfícies, todas medidas:

| Superfície | Estado | Evidência |
| --- | --- | --- |
| API remota | não alcança nenhuma | `EXPO_PUBLIC_API_BASE_URL` ausente nos **cinco** perfis do `eas.json` |
| Sync remoto | desligado | `EXPO_PUBLIC_ENABLE_REMOTE_SYNC = false` |
| Push | **local apenas** | `PushService.ts` chama `requestPermissionsAsync`; **nunca** `getExpoPushTokenAsync` nem `getDevicePushTokenAsync` — nenhum token é obtido |
| Armazenamento | 25 escritas, todas no aparelho | `AsyncStorage.setItem` em `radiant-app/src` |
| Conta de usuário | não existe | `Início de sessão obrigatório` desmarcado na ficha em 2026-08-05 |

### O que responder no questionário

**Pergunta de entrada — "Do you or your third-party partners collect data from
this app?" → `No`.**

Isso encerra o questionário. Nenhuma categoria precisa ser detalhada, porque
nada é coletado: o binário não fala com servidor nenhum e não obtém
identificador nenhum.

### A única checagem que exige o console, e não o repositório

Variáveis `EXPO_PUBLIC_*` podem vir de **segredos do projeto no EAS**, que não
são legíveis daqui. Se um segredo definir `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`
**e** `EXPO_PUBLIC_SENTRY_DSN`, o Sentry passa a rodar e a resposta muda para:

- **Diagnostics → Crash Data**
- **Not linked to the user's identity** — `sendDefaultPii: false` em
  `bootstrap.ts:29`, e `setUserId` só é chamado com `user?.id ?? null`, que é
  sempre `null` num app sem conta
- **Not used for tracking**

Confirme com um comando antes de responder:

```bash
cd radiant-app && npx eas secret:list
```

Se as duas variáveis não aparecerem, `Data Not Collected` está certo.

## Execução no console em 2026-08-08

- `npx eas secret:list` voltou vazio; nenhuma das duas variáveis que ativariam
  Sentry apareceu.
- App Privacy foi publicada como **Dados não coletados**, com
  `https://saudediagnostica.com/radiant/privacidade/` como política de
  privacidade. O console confirmou o estado publicado.
- A build production `1.3.1 (7)` (`b240dcbf-2632-4dcc-9816-71427068dc2b`) foi
  concluída, enviada à Apple pela submission
  `8d0eb131-489d-4df3-a511-e3e820857be2`, processada como **Pronta para envio**
  e selecionada na versão `1.3.1`. O contador remoto `(6)` foi consumido por uma
  tentativa interrompida antes de existir registro de build; não há binário 6
  a escolher.
- O primeiro clique em **Adicionar para revisão** foi executado. O App Store
  Connect recusou por dois campos: direitos de conteúdo e faixa de preço. A
  manutenção programada, iniciada às 10:00 BRT, interrompeu o console antes do
  fechamento.
- Quando o console voltou, a faixa **gratuita** foi selecionada, confirmada para
  os 175 países ou regiões e salva. A declaração de direitos da primeira
  tentativa não havia persistido: foi refeita como conteúdo de terceiros com os
  direitos necessários, salva e conferida após recarregar a página.
- A versão `1.3.1`, com a build `1.3.1 (7)`, foi adicionada ao rascunho e
  **Enviada para revisão** às 12:05 BRT. O estado final observado no App Store
  Connect é **Aguardando revisão**; o lançamento permanece manual.

### Follow-up de 2026-08-09

O App Store Connect foi consultado novamente e continuava em **Aguardando
revisão**, com a build `1.3.1 (7)` e liberação manual. Nenhuma ação de loja foi
executada nessa leitura. Esta folha continua sendo o registro da submissão de
08/08; o estado corrente pertence ao
[`status canônico`](../archive/EXECUTION_STATUS_2026-08-09.md).

## O que falta para lançar no iOS, em ordem

1. **App Review** — a versão já está na fila; 24–48h são típicas na primeira
   submissão, sem garantia de prazo.
2. **Liberação manual** (F5), já configurada na ficha, depois da aprovação.

## A build atrasada foi substituída

A `1.3.1 (5)` é de 2026-08-04. Depois dela, **21 commits tocaram
`radiant-app/`**, e três deles mudam o que o usuário vê:

- `7a4d9a3` — o mapa de galáxias deixou de estar 80% vazio: 6 planetas com as 16
  lições, três galáxias `active`;
- `2e08443` — a trilha chamada "Abdome" parou de entregar preservação de
  alimentos por irradiação;
- `2e43353` — a heurística H3 media o próprio lançamento e nunca podia disparar.

Essa recomendação foi executada: a `1.3.1 (7)` contém o estado atual da branch,
está pronta no TestFlight e selecionada na versão. Assim, a App Review receberá
o mapa cheio e a correção das trilhas, não a build 5 atrasada.

```bash
cd radiant-app && npx eas build --platform ios --profile production
```

O contador iOS é remoto. A primeira tentativa consumiu `(6)` antes de ser
interrompida; a build válida saiu como `1.3.1 (7)`.

## O que já está pronto na ficha, e não precisa ser refeito

Persistido e conferido contra recarga em 2026-08-05, com as correções de estado
observadas em 2026-08-08:

- versão pública `1.3.1`, build, URL de suporte, categoria **Educação**,
  liberação manual;
- **seis screenshots 6,5"** na ordem `home → lição → quiz → checkpoint →
  conquista → progresso`, com reutilização declarada nos demais tamanhos;
- subtítulo, texto promocional, descrição longa e keywords — copy aprovada pelo
  dono em 2026-08-05;
- copyright e os quatro campos de contato do revisor;
- **classificação etária**: `13+` em 172 países, `12+` no Brasil e Coreia do Sul,
  calculada pelo console a partir de "informação médica — Pouco frequente";
- direitos sobre conteúdo de terceiros, reconfirmados e salvos em 2026-08-08
  depois de o primeiro envio revelar que o console ainda os exigia.

E a evidência de aparelho está fechada: smoke físico com sete cenários em
2026-08-05, e a B4 (VoiceOver) fechada em 2026-08-06, levando o Gate 2 a 5/5.

## Armadilha de ferramenta, registrada porque já custou tempo

`eas submission:list` **não existe** em versão nenhuma do `eas-cli` — quem
tentar verificar por ali vai ler um "command not found" como se fosse estado. O
caminho que funciona é `BuildQuery.withSubmissionsByIdAsync`, do próprio
`eas-cli`.
