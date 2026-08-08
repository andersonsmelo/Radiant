# Pré-voo do lançamento iOS — 2026-08-08

Folha para transcrever no App Store Connect, com a evidência de cada resposta.
Nada aqui é opinião: cada linha diz o comando ou o arquivo que a sustenta.

## O reenquadramento que abre este documento

**O caminho iOS não depende da F2.** A exigência de **12 testadores por 14 dias
corridos** é do **Google Play**, para conta pessoal, e a Apple não tem
equivalente. As tasks F3, F4 e F5 do roadmap misturam as duas lojas: o
questionário de acesso a produção e o rollout faseado são do Play e **não**
travam a App Store.

Enquanto o relógio do Android não começa, o iOS pode ser submetido.

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

## O que falta para submeter, em ordem

1. **Privacy labels** — preencher com a folha acima. É o último item de conteúdo
   da ficha.
2. **Decidir qual build submeter** — ver a seção seguinte.
3. **Acionar `Adicionar para revisão`** no App Store Connect. O botão está
   disponível desde 2026-08-05 e nunca foi acionado.
4. **App Review** — 24–48h típicas na primeira submissão.
5. **Liberação manual** (F5), já configurada na ficha.

## A build no TestFlight está 21 commits de app atrás

A `1.3.1 (5)` é de 2026-08-04. Desde então, **21 commits tocaram
`radiant-app/`**, e três deles mudam o que o usuário vê:

- `7a4d9a3` — o mapa de galáxias deixou de estar 80% vazio: 6 planetas com as 16
  lições, três galáxias `active`;
- `2e08443` — a trilha chamada "Abdome" parou de entregar preservação de
  alimentos por irradiação;
- `2e43353` — a heurística H3 media o próprio lançamento e nunca podia disparar.

**Recomendação: buildar de novo antes de submeter.** A revisão da Apple vem de
qualquer jeito; entrar nela com o mapa cheio custa uma espera de build e evita
gastar um ciclo de revisão inteiro mostrando a versão vazia.

```bash
cd radiant-app && npx eas build --platform ios --profile production
```

O contador iOS é remoto e sai `1.3.1 (6)`.

## O que já está pronto na ficha, e não precisa ser refeito

Persistido e conferido contra recarga em 2026-08-05:

- versão pública `1.3.1`, build, URL de suporte, categoria **Educação**,
  liberação manual;
- **seis screenshots 6,5"** na ordem `home → lição → quiz → checkpoint →
  conquista → progresso`, com reutilização declarada nos demais tamanhos;
- subtítulo, texto promocional, descrição longa e keywords — copy aprovada pelo
  dono em 2026-08-05;
- copyright e os quatro campos de contato do revisor;
- **classificação etária**: `13+` em 172 países, `12+` no Brasil e Coreia do Sul,
  calculada pelo console a partir de "informação médica — Pouco frequente";
- direitos sobre conteúdo de terceiros, declarados.

E a evidência de aparelho está fechada: smoke físico com sete cenários em
2026-08-05, e a B4 (VoiceOver) fechada em 2026-08-06, levando o Gate 2 a 5/5.

## Armadilha de ferramenta, registrada porque já custou tempo

`eas submission:list` **não existe** em versão nenhuma do `eas-cli` — quem
tentar verificar por ali vai ler um "command not found" como se fosse estado. O
caminho que funciona é `BuildQuery.withSubmissionsByIdAsync`, do próprio
`eas-cli`.
