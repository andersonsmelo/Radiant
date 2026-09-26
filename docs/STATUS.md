# Radiant — Status

**Único documento de estado vivo do projeto.** Diz o que é verdade **agora** e
nada mais. O que está executável fica na [`FILA.md`](FILA.md); o plano, no
[roadmap](plans/2026-07-27-radiant-launch-roadmap.md); as decisões, em
[`adr/`](adr/).

**Regra que mantém este arquivo curto:** quando uma afirmação deixa de ser
atual, ela sai daqui **no mesmo run** e vai, sem edição, para o fim de
[`archive/STATUS_historico.md`](archive/STATUS_historico.md). Nada de narrar o
passado aqui. Por isso, **todo run do Loop que edita este arquivo declara
também o histórico** no `abrir.mjs`: depois de aberto, o escopo não se amplia. Em 2026-09-23 este arquivo tinha 1.319 linhas e se contradizia:
dizia que a 1.3.1 estava no ar e, logo abaixo, que tinha sido rejeitada.

Toda afirmação traz **a data da medição** e, quando existe, **o comando que a
remede**. Contagem envelhece e comando não: remeça antes de decidir.

---

## Produção — o que o usuário tem hoje

| Frente | Estado | Medido em |
| --- | --- | --- |
| **App Store** | `1.3.1 (11)` publicado desde 2026-09-14. Binário = tag `v1.3.1` (`063770d`). | 2026-09-23 |
| **Atualização OTA** | Nenhuma no canal `production`: o que roda é exatamente o binário. | 2026-09-23 |
| **Google Play** | `1.3.0 (4)` em teste fechado (`alpha`), lista "Radiant Alpha". **Não está em produção.** | 2026-08-24 ⚠️ vencida |
| **API pública** | Inativa: HTTP 502 em `/health`, `/ready` e `/v1/content/catalog`. O app não depende dela: o sync remoto está desligado em todos os perfis do EAS. | 2026-09-23 |

```bash
curl -s 'https://itunes.apple.com/lookup?id=6797078156&country=br' | python3 -c "import json,sys;print([(r['version'],r['currentVersionReleaseDate']) for r in json.load(sys.stdin)['results']])"
cd radiant-app && npx eas update:list --branch production --limit 3 --non-interactive
for p in health ready v1/content/catalog; do curl -s -o /dev/null -w "$p %{http_code}\n" https://api.radiant.ascendcreative.com.br/$p; done
```

O estado do Play só se mede abrindo o Play Console; não há comando.

## Entre produção e `main` — a 1.4

A `main` está **168 commits e 333 arquivos à frente** do que está na App Store
(medido em 2026-09-25, às 21:24, `v1.3.1..e992686`). Nada disso chegou ao
usuário: vidas, assinatura StoreKit (Radiant Ilimitado), backup no iCloud
(CloudKit) e o currículo V3 (L1, L2 e o piloto da lição híbrida, nenhum ligado
ao app do aluno).

```bash
git fetch origin && git rev-list --count v1.3.1..origin/main
```

**O que falta para a 1.4 sair** — detalhe e dono de cada item na
[`FILA.md`](FILA.md#prioridade--a-14-desenhada-em-2026-09-14):

1. **Dono:** StoreKit no aparelho. **Em 2026-09-24, o build `development`
   compilou o Swift e abriu num iPhone com iOS 27.2.** No sandbox passaram:
   - preços, com R$ 19,90 e R$ 149,90;
   - compra mensal e, em 2026-09-25, compra anual;
   - renovação acelerada e expiração;
   - reinstalação.

   Falta, pela [ADR de 2026-09-25, às 21:20](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md):
   - **cancelamento:** pela folha de gerenciamento da Apple dentro do app,
     que o agente vai implementar, numa build `development` nova. Se a folha
     também fechar no iOS 27.2, ele passa ao StoreKit Testing do Xcode;
   - **Ask to Buy:** saiu do aparelho e passou ao agente, no StoreKit Testing
     do Xcode. Falta conferir que o módulo Swift funciona ali;
   - **o VoiceOver** no checkpoint e na trilha, no mesmo build, com o dono,
     que decidiu fazê-lo. Ele saiu da H4 pela
     [ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md).

   O modo avião e o reembolso saíram do roteiro no aparelho
   ([ADR de 2026-09-24](adr/ADR-2026-09-24-storekit-roteiro-no-aparelho.md),
   [ADR de 2026-09-25](adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md),
   [evidência](../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)).
   A renovação desconhecida passou a mostrar "Ativa · acesso até DD/MM/AAAA",
   corrigida em 2026-09-25 e **na `main` desde a mesma data**
   ([PR #37](https://github.com/andersonsmelo/Radiant/pull/37), merge
   `e992686`), com o gate em 151 suítes / 1434 testes
   ([relatório](superpowers/handoffs/2026-09-25-radiant-renovacao-desconhecida-relatorio.md)).
2. **Agente:** E2E dos três caminhos dourados — **os três estão `passed` no
   simulador iOS 26.5 desde 2026-09-25.** O dia 2 do caminho 2 rodou às 13:20,
   com relógio real
   ([evidência](../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md)).
   Android e aparelho físico não foram executados. O E2E expôs três defeitos
   do app ([FILA](FILA.md), item 4 da Task 8):
   - **os defeitos 2 e 3** foram corrigidos e **estão na `main`** desde
     2026-09-25 (PR #34, com o CI verde);
   - **o defeito 1** foi corrigido em 2026-09-25, pela opção A da
     [ADR](adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md),
     e **está na `main`** desde a mesma data
     ([PR #36](https://github.com/andersonsmelo/Radiant/pull/36), merge
     `cab01c0`). Foi visto na tela, e o gate deu 151 suítes / 1430 testes
     ([relatório](superpowers/handoffs/2026-09-25-radiant-defeito-1-relatorio.md)).
3. **Agente, por último:** bump para `1.4.0` — os produtos de assinatura só
   sobem junto com a versão (regra 8 da
   [ADR](adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)).

Já fechado para a 1.4 (2026-09-23): acordo de apps pagos **Ativo** no App Store
Connect, com banco e formulários fiscais ativos; Ask to Buy decidido e
implementado.

## Risco de build — iOS 27 (medido em 2026-09-23)

**Compilado com o Xcode 27 (SDK do iOS 27), o app fecha na abertura no iOS 27.**
O iOS 27 exige o ciclo de vida por cenas (`UIScene`), e o `AppDelegate` do Expo
54 / RN 0.81 não o adota: o processo para em
`_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption` (SIGTRAP). No iOS
26.5 é só aviso. O app publicado não é afetado, porque foi compilado com um SDK
anterior.

**O EAS compila com o Xcode 26** (medido em 2026-09-24). Até essa data o
`eas.json` não fixava imagem e valia o padrão do SDK 54,
`macos-sequoia-15.6-xcode-26.0`, a imagem de onde saiu a build de produção da
1.3.1, com o `iPhoneOS26.0.sdk`. Desde 2026-09-24 essa mesma imagem está
fixada nos perfis (abaixo). Então o risco é **local**:
só esta máquina, que tem apenas o Xcode 27, produz o binário que fecha. O prazo
real é **abril de 2027**, quando a Apple passa a exigir o SDK do iOS 27 em todo
envio. O SDK 54 não tem suporte oficial a `UIScene`: a Expo o trouxe no SDK 58 e
como opção no 57.0.23. **Decidido pelo dono em 2026-09-24**
([ADR](adr/ADR-2026-09-24-ios27-imagem-xcode-26.md)):
- os perfis de iOS do `eas.json` fixam `macos-sequoia-15.6-xcode-26.0`. Os 7
  perfis resolvem para ela, conferido com `npx eas config --profile <perfil>
  --platform ios`;
- o `UIScene` entra pela atualização do SDK, depois da 1.4 e antes de abril de
  2027.

**O eas-cli do projeto é o 24.8.0** desde 2026-09-25, no branch
`feat/d4-decisoes-de-revisao`, e o `cli.version` do `eas.json` exige
`>= 24.8.0`. O 16.32 imprimia "Build request failed" com a build já criada.
**Ainda não passou por uma build real** ([FILA](FILA.md), achado 6).

**A primeira build `development` da 1.4 no EAS reprovou** em 2026-09-24
(`0a545c74-…`, commit `c4be0c8`), com `XCODE_BUILD_ERROR`. A causa não foi o
Swift do StoreKit: foi o `sentry-cli`, que tentou enviar os source maps sem
organização configurada. Só `preview`, `production` e `checkpoint-internal`
desligavam o envio. Desde então o `development` também o desliga, e
`development-simulator` e `e2e-test` herdam. Há um contrato
(`scripts/maestro-contract.test.mjs`) que exige isso de todo perfil,
com a herança resolvida. **A segunda build (`ac4b49df`, commit `fd0c630`)
compilou** e abriu num iPhone com iOS 27.2 em 2026-09-24. É a primeira build
com a imagem fixada que chega a um aparelho com iOS 27.

Medições, custo e risco em
[`release/2026-09-24-ios27-decisao-xcode-uiscene.md`](release/2026-09-24-ios27-decisao-xcode-uiscene.md).

Compilar localmente nesta máquina (Xcode 27) precisou, na mesma data, de
contornos que não mudam arquivo versionado: `RUBYOPT=-rlogger` para o CocoaPods
com o Ruby do sistema; `IPHONEOS_DEPLOYMENT_TARGET=15.1` no `xcodebuild`, porque
o Xcode 27 recusa pods abaixo de 15; `npx expo prebuild --platform ios` para
regenerar a `ios/` (estava sem a permissão de iCloud, e o CloudKit derrubava o
app); e `SENTRY_DISABLE_AUTO_UPLOAD=true`. O `expo run:ios` também trava ao
consultar o Simulador por AppleScript: compile com `xcodebuild` e instale com
`xcrun simctl`.

## Prazos de relógio

Nenhum aberto (medido em 2026-09-24). **A verificação de desenvolvedor Android
de 30/09/2026 está cumprida.** No Play Console, `com.ascendcreative.radiant`
aparece "Registrado" com 4 chaves "Verificada", entre elas a chave de
assinatura do Play (`5F:CE:13:…`) e o keystore Default do EAS (`49:CB:9C:2A:…`),
que assina os builds de distribuição interna. Essa última foi adicionada em
2026-09-24 e verificada no mesmo dia. Onde remedir: Play Console → Verificação
de desenvolvedor Android → `com.ascendcreative.radiant`.

## Bloqueios abertos, por frente

- **Android em produção** — exige 12 testadores **participando** por 14 dias
  (F2). **Remedido em 2026-09-25:** 5 participando de 14 vinculados, e os 14
  dias não começaram. Faltam 7 aceites, e a margem máxima é de 2
  ([FILA](FILA.md)). Só o dono mede, no Play Console. Também abertos:
  questionário IARC (E4), aparelho Android físico (C4) e TalkBack (C5).
- **Currículo V3** — L1 aprovada no parecer v4. **L2 reprovada nas seis
  revisões** (a v6 em 2026-09-22), e a v7 **pausada** em 2026-09-23. O
  **piloto da lição híbrida na L1**
  ([spec](superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
  [ADR](adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md)) está **na `main`
  desde 2026-09-23 (PR #24)**, sem build de distribuição: 12 itens gerados por
  regra, som e vibração, custo de vida só no desafio, rota `/licao-hibrida`
  atrás de `SHOW_DEV_TOOLS`. O V3 segue desligado. **A amostra foi decidida em
  2026-09-25** ([ADR](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 1): o agente corrige o item 18, que duplica
  o 1, e as variantes do decúbito dorsal visto por trás, e o dono confirma os
  itens alterados antes de a aprovação ser gravada ([FILA](FILA.md), 7a e 7b).
  Depois, o teste com 3 a 5 pessoas antes de escalar.
- **Conteúdo editorial (D4)** — **fechada como superada** em 2026-09-25, pela
  [ADR](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 2. A classificação da apostila não alimenta o app nem o
  V3, e o conteúdo que ela devia liberar está no ar desde a 1.3.1. O risco do
  catálogo que está no ar segue na auditoria de 2026-08-27 e na migração para o
  V3. **Risco aberto:** não se sabe quem marcou os `ai-bundles.json`, de onde
  sai o catálogo, como `approved`, nem com que critério.
- **Gate H4** (checkpoint, reforço, retomada e acessibilidade) — **fechado e
  na `main`** (PR #34, mergeada em 2026-09-25), conforme a
  [ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md):
  - os dois defeitos da primeira passagem foram corrigidos (texto do checkpoint
    e texto grande) e reconferidos no simulador
    ([relatório](superpowers/handoffs/2026-09-24-radiant-gate-h4-relatorio.md));
  - a regra de uma vida por pergunta por tentativa (decisão 2 da ADR) está na
    mesma PR
    ([relatório](superpowers/handoffs/2026-09-24-radiant-vida-por-tentativa-relatorio.md))
    e foi **conferida no simulador em 2026-09-25**, em cinco cenários, pela tela
    e pelo AsyncStorage
    ([evidência](../radiant-app/docs/evidence/2026-09-25-regra-de-vidas-simulador.md));
  - o VoiceOver em aparelho segue aberto na [FILA](FILA.md).

## Defeito conhecido

**`ENABLE_REMOTE_SYNC` não desliga o `AuthService`.** A flag controla só a
exibição e o envio da fila de sync; o auth decide por `isApiConfigured()`.
**É inerte em produção**, porque nenhum perfil do EAS define
`EXPO_PUBLIC_API_BASE_URL` (medido em 2026-09-23). Aberto por decisão do dono:
mexer nisso afeta login, sync e o contrato de telemetria. Detalhe em
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).

## Kill switches reais

Dois, medidos em 2026-09-23: `ENABLE_LEARNING_ROAD` (trilha contra Home antiga)
e `ENABLE_REVIEW` (por `EXPO_PUBLIC_ENABLE_REVIEW`, padrão `true`). São lidos
em build, então só se acionam por build novo ou OTA. A guarda
`src/config/killSwitches.contract.test.ts` barra flag `ENABLE_*` fixa ou sem
leitor.

## Gate de qualidade

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```

19 passos: lint, typecheck, 15 contratos, Jest em banda única e visual QA
strict. **Última medição: 2026-09-23**, no Mac, em `757f43f` — mesma árvore do
app que a `main` atual (`3343eca`), conferido com `git diff --stat 757f43f
3343eca -- radiant-app` vazio —, Node `v20.20.2`: exit 0, **147 suítes / 1374
testes**, lint com 0 erros e 26 avisos, visual QA sem regressão. O CI roda o mesmo comando inteiro
(`.github/workflows/radiant-app-quality.yml`).

Testes e builds do app rodam no **Node 20**; só a CLI `loop` usa o 24. Confira
com `node --version` antes de citar qualquer número.

### O que o gate NÃO pega

- **Não empacota o app.** Um app que não abre passa nos 19 passos (aconteceu em
  2026-08-21). Subir no simulador faz parte de verificar uma entrega.
- **Os flows do Maestro não rodam no gate**; só o contrato deles, que confere
  estrutura e não texto de tela. Ao mudar texto, procure em `.maestro/` no
  mesmo passo.
- **`npm run quality` e `loop validate` são conjuntos diferentes.** Ao mexer em
  documentação governada, rode os dois.
- **Os testes de `scripts/content` rodam no CI desde 2026-09-23**, em
  `ubuntu-latest`, que diferencia caixa (`.github/workflows/content-scripts.yml`,
  com 6 exclusões nomeadas no próprio arquivo — falhas anteriores, que não são
  de caixa). Antes, rodavam só no `loop validate`, no macOS. Nos scripts, o caminho é `conteúdo/`,
  minúsculo e em NFC, como o `git ls-files` mostra (corrigido em 2026-09-23;
  medições no [histórico](archive/STATUS_historico.md)). A exceção é
  `conteúdo/fontes/library-catalog.json`, que cita `Conteúdo/*.pdf` de
  propósito, porque aponta para o acervo local.

## Repositório

Medido em 2026-09-25, às 21:24:
- **`origin/main` está em `e992686`.** As PRs
  [#35](https://github.com/andersonsmelo/Radiant/pull/35) (estado do dia,
  relatório da nuvem, ADR e E2E completo),
  [#36](https://github.com/andersonsmelo/Radiant/pull/36) (defeito 1) e
  [#37](https://github.com/andersonsmelo/Radiant/pull/37) (renovação
  desconhecida e prompt (5)) entraram na noite de 2026-09-25, nessa ordem e
  por merge commit. Quem fez o merge foi o agente, com autorização do dono na
  conversa. O CI de cada PR estava verde, e **o da `main` passou nos três
  merges**: `Content Scripts` e `Radiant App Quality` verdes no `15e0257`, no
  `cab01c0` e no `e992686`, este às 21:24.

  ```bash
  gh run list --branch main --limit 6
  ```
- **Antes delas,** as PRs #32, #33 e #34 entraram em 2026-09-25, por uma
  sessão na nuvem
  ([prompt (4)](superpowers/handoffs/2026-09-24-radiant-prompt-de-continuidade-4-nuvem.md),
  [relatório](superpowers/handoffs/2026-09-25-radiant-relatorio-sessao-nuvem.md)).
- **Branch sem PR:** `feat/d4-decisoes-de-revisao`, 12 commits à frente da
  `main` (medido às 21:24) e enviado ao remoto. Leva a D4, a guarda de sincronia, o eas-cli
  e as evidências da regra de vidas e do aquecimento. O aquecimento ganhou, às
  18:06, a segunda passagem no simulador: uma estrela só já custa 28 % de um
  núcleo, e a aba visitada continua montada e animando, o que leva a CPU de
  ~42 % para ~66 % ([evidência](../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md),
  [FILA](FILA.md), achado 5).
- **Push e PR, decidido pelo dono em 2026-09-25:** o push está autorizado; PR,
  **uma por dia, às 21 h**, com o acumulado. O merge continua sendo do dono. A
  PR de 2026-09-25 ainda não foi aberta, por decisão dele.
- **O remoto tem a `main`, o branch da D4 e os três das PRs #35 a #37**, que
  já entraram e não foram apagados (medido às 21:24). Apagá-los é do dono. Os
  25 branches mergeados antes foram apagados em 2026-09-25, por decisão dele.
  A lista, com a ponta de cada um para restaurar, está em
  [`release/2026-09-25-branches-remotos-apagados.md`](release/2026-09-25-branches-remotos-apagados.md).
- **Prompt de continuidade:**
  [`2026-09-25-radiant-prompt-de-continuidade-6.md`](superpowers/handoffs/2026-09-25-radiant-prompt-de-continuidade-6.md).
  Ele substitui o (5).
- **Simuladores:**
  - o `A5FA5443-…`, do gate H4, já conferiu a regra de vidas na tela, em
    2026-09-25
    ([evidência](../radiant-app/docs/evidence/2026-09-25-regra-de-vidas-simulador.md)).
    Ficou com o checkpoint aprovado e 2 vidas. Se ele fica ou é apagado, o
    dono decide;
  - o `E3C547AE-…` já cumpriu o dia 2 e está livre.

**Worktrees:** a `zealous-shannon-01c8e3` foi removida em 2026-09-24. Continuam
em `.claude/worktrees/` a `dazzling-ishizaka-883871`, a `sharp-dijkstra-747d12`
e a `trusting-mestorf-a5ca83`, cada uma com runs do Loop que o git ignora. A
`Radiant-release` está numa `main` local antiga (`21c42b6`), e quem for usá-la
começa por `git pull`.

```bash
git fetch origin && gh pr list --state open
git worktree list
for w in .claude/worktrees/*/; do echo "$w $(git -C $w status --porcelain | wc -l)"; done
```

## Cérebro do projeto (Obsidian)

Medido em 2026-09-23: das 10 notas, as 8 de base não mudam desde 2026-07-24 e
têm fatos vencidos. A `05 Aprendizados validados` tem 319 entradas, porque
`loop memory write` só acrescenta nessa nota. **Para estado, vale este
arquivo, não o cérebro.** Reprojetar as notas exige um comando novo no Loop,
decidido pelo dono em 2026-09-23 e ainda não construído.
