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
| **App Store** | **`1.4.0 (12)` aprovada e liberada em 2026-10-12, às 08:47 (America/Bahia), para o Brasil; "Pronto para distribuição" no App Store Connect.** Os dois produtos e o grupo "Radiant Ilimitado" também foram aprovados (submissão `a5e5a094`). Binário = `main` em `221e2ec`. A página pública brasileira já mostra **`1.4.0` às 08:50**, com mensal de R$ 19,90 e anual de R$ 149,90. [Evidência](evidence/2026-10-12-radiant-liberacao-1-4-0.md). | 2026-10-12 |
| **Atualização OTA** | Nenhuma no canal `production`: o que roda é exatamente o binário. | 2026-09-23 |
| **Google Play** | `1.3.0 (4)` em teste fechado (`alpha`), lista "Radiant Alpha". **Não está em produção.** | 2026-08-24 ⚠️ vencida |
| **API pública** | Inativa: HTTP 502 em `/health` e `/ready`, reconfirmado em 2026-10-14. DNS medido `143.95.208.237`; SSH no VPS histórico recusado, sem identificar origem atual nem mudar configuração. Sync remoto permanece desligado. [Remediação local](evidence/2026-10-14-qa-remediacao.md). | 2026-10-14 |

```bash
curl -s 'https://itunes.apple.com/lookup?id=6797078156&country=br' | python3 -c "import json,sys;print([(r['version'],r['currentVersionReleaseDate']) for r in json.load(sys.stdin)['results']])"
cd radiant-app && npx eas update:list --branch production --limit 3 --non-interactive
for p in health ready v1/content/catalog; do curl -s -o /dev/null -w "$p %{http_code}\n" https://api.radiant.ascendcreative.com.br/$p; done
```

O estado do Play só se mede abrindo o Play Console; não há comando.

## A 1.4 publicada

**A `1.4.0 (12)`, compilada do `221e2ec`, foi aprovada e liberada no
App Store Connect em 2026-10-12, às 08:47 (America/Bahia), para o Brasil.**
O console passou de "Liberação do desenvolvedor pendente" para
"Pronto para distribuição". A liberação foi autorizada pelo dono nesta
conversa e executada pelo agente. Os quatro itens da submissão `a5e5a094`
foram aprovados: versão, mensal, anual e grupo "Radiant Ilimitado".

A página pública da App Store brasileira já mostra **`1.4.0` às 08:50** de
2026-10-12, com mensal de R$ 19,90 e anual de R$ 149,90. A consulta pública
por `lookup` ainda devolvia `1.3.1` às 08:47, antes dessa propagação.
As novidades da build liberada incluem vidas, assinatura StoreKit, backup no
iCloud e sons nas lições. O currículo V3 continua fora do app do aluno.
[Evidência da liberação](evidence/2026-10-12-radiant-liberacao-1-4-0.md).

**Onde se lê o estado da revisão:** no App Store Connect, em Distribuição →
Revisão de apps, que é a fonte autoritativa. O e-mail é só aviso: vai para o
Outlook do contato da ficha, e o da reprovação de 2026-10-10 **caiu na pasta
Lixo**, não na Caixa de Entrada. "Nenhum e-mail" não prova que nada aconteceu.
Em 2026-10-10 e 2026-10-11, o App Store Connect foi lido pelo navegador
interno do Claude, com o login feito pelo dono, e a API interna da página
(`/iris/v1/...`, só leitura) deu o estado exato dos envios e dos itens.

```bash
git fetch origin && git rev-list --count v1.3.1..origin/main
```

**Validações e liberação da 1.4** — detalhe e dono de cada item na
[`FILA.md`](FILA.md#prioridade--a-14-desenhada-em-2026-09-14):

1. **Dono:** StoreKit no aparelho. **Em 2026-09-24, o build `development`
   compilou o Swift e abriu num iPhone com iOS 27.2.** No sandbox passaram:
   - preços, com R$ 19,90 e R$ 149,90;
   - compra mensal e, em 2026-09-25, compra anual;
   - renovação acelerada e expiração;
   - reinstalação.

   Falta, pela [ADR de 2026-09-25, às 21:20](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md):
   - ✅ **cancelamento: feito em 2026-09-27**, pela folha da Apple dentro do
     app, no iPhone com iOS 27.2 e na build `c4eeeb44`. A tela passou a
     "Cancelada" sozinha, e a folha também resolve a troca de plano. O preço
     que acompanha a troca de loja **não pôde ser reproduzido** no aparelho,
     porque sem a conta de sandbox os preços ficaram em R$
     ([evidência](../radiant-app/docs/evidence/2026-09-27-storekit-gerenciar-iphone.md));
   - ✅ **Ask to Buy: feito em 2026-09-27 pelo agente**, no StoreKit Testing
     do Xcode, num simulador iOS 26.5, com um `.storekit` local versionado em
     `radiant-app/modules/radiant-storekit/testing/`. O módulo Swift funciona
     ali. Pendente, recusado e aprovado foram vistos, e o aprovado chegou por
     `Transaction.updates` e virou ∞ sem reabrir o app. A tela da assinatura,
     se estivesse aberta, não atualizava com a aprovação, e o conserto entrou
     no mesmo run ([evidência](../radiant-app/docs/evidence/2026-09-27-ask-to-buy-storekit-testing.md));
   - ✅ **VoiceOver: encerrado pelo dono em 2026-09-27**, que assumiu a
     responsabilidade antes do reforço, da tela de aprovação e do HUD em
     recarga ([evidência](../radiant-app/docs/evidence/2026-09-27-voiceover-iphone.md)). Anúncios, ordem e estado das alternativas
     estão certos, e o HUD não lê número duplicado. **Achado:** a perda de vida
     não era anunciada ao leitor de tela. **Consertado na lição em
     2026-09-28:** o anúncio passou a dizer "Você perdeu uma vida; restam N."
     ou "Você perdeu sua última vida.", e o assinante não ouve nada sobre vidas
     ([relatório](superpowers/handoffs/2026-09-27-radiant-anuncio-perda-de-vida-relatorio.md)).
     **O checkpoint ficou fora.** Em 2026-09-28, o dono decidiu que saem os
     checkpoints de botão, que não cobram vida, e ficam as 5 avaliações da V2
     ([ADR](adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md)).
     **Nelas, o anúncio entrou em 2026-10-09** (FILA, 35), com a mesma frase,
     agora numa função compartilhada pelas duas telas
     ([relatório](superpowers/handoffs/2026-10-09-radiant-anuncio-perda-de-vida-avaliacao-relatorio.md)).

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
     **Desde 2026-10-09, o caminho 3 afirma esse estado** (FILA, 16): a L1
     concluída e o cabeçalho em "1 de N" depois da folha. No simulador, ele
     reprovou com o defeito reinjetado e passou sem ele
     ([evidência](../radiant-app/docs/evidence/2026-10-09-e2e-caminho-3-estado-da-l1.md)).
3. ✅ **Bump para `1.4.0`: feito em 2026-09-28 pelo agente**, com o ok do
   dono, no `feat/d4-decisoes-de-revisao`. A versão está no `app.json`, no
   `package.json` e nas duas raízes do `package-lock.json`, e uma guarda
   (`src/config/appVersion.contract.test.ts`) exige que os quatro concordem.
   O número de build fica com o EAS (`appVersionSource: remote`), e a
   `runtimeVersion` passa a `1.4.0`
   ([relatório](superpowers/handoffs/2026-09-28-radiant-bump-1-4-0-relatorio.md)).
   ✅ **Sons e vibração na lição do aluno: ligados em 2026-09-28 pelo agente,
   por decisão do dono** ([ADR](adr/ADR-2026-09-28-sons-na-licao-da-1-4.md)).
   Antes, os sons existiam só no piloto do V3, e a 1.4 sairia muda. O card
   "Sons e vibração" passou a aparecer no Perfil de produção. **O dono ouviu
   no iPhone**, e tudo funcionou, menos o som do coração, que o log mediu
   começando 2 ms depois do erro. **O som e a vibração do coração saíram da
   lição** por decisão do dono, e voltam com a animação em primeiro plano
   (FILA, 26)
   ([relatório](superpowers/handoffs/2026-09-28-radiant-sons-na-licao-relatorio.md)).
4. ✅ **Aprovação e liberação: confirmadas em 2026-10-12, às 08:47
   (America/Bahia).** A `1.4.0 (12)`, compilada de `221e2ec`, e os dois
   produtos e o grupo da assinatura foram aprovados na submissão `a5e5a094`.
   Com autorização do dono, o agente liberou a versão para o Brasil, e o
   App Store Connect passou a "Pronto para distribuição". A página pública
   brasileira já mostra `1.4.0` às 08:50; publicação pública confirmada
   ([evidência](evidence/2026-10-12-radiant-liberacao-1-4-0.md)).

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
**Passou pela primeira build real em 2026-09-27** (`c4eeeb44`), sem o falso
erro ([evidência](../radiant-app/docs/evidence/2026-09-27-storekit-gerenciar-iphone.md)).

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
- **Currículo e expansão da trilha — direção corrigida em 2026-10-16.**
  O código de migração mantém currículo ativo legado; V3 não foi ativado.
  A base híbrida/L1 e a dívida editorial da L2 continuam no repositório, mas
  revisar uma amostra de aula ou executar piloto deixou de ser condição de
  avanço da frente global, por [decisão do dono](adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md).
  O trabalho seguinte é generalizar catálogo/motor e produção por lotes
  (FILA 54); aprovação de conteúdo e distribuição continuam nos gates próprios.
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

**Na 1.4 publicada, a Estude nunca oferece a conquista** (medido em 2026-09-28, no E2E do item
34). O motor de recomendação da 1.4 exclui o nó de conquista
(`JourneyRecommendationService`, desde `75cc9da`, de 2026-09-14). Depois da
última lição de uma trilha, o botão diz "Aguardando nova etapa" e o card diz
"Você concluiu tudo que está disponível", com a conquista ainda por coletar.
Ela só se alcança achando o card na trilha. A correção local da recomendação
está nos itens 36/39/27 abaixo, por decisão do dono de 2026-10-12
([FILA](FILA.md);
[evidência](../radiant-app/docs/evidence/2026-09-28-e2e-sem-checkpoints-de-botao.md)).

**A trilha no ar ainda ensina pouco e não é medida** (medido em 2026-10-16,
no simulador e no código; [avaliação completa](trilha/avaliacoes/2026-10-16-avaliacao-completa-da-trilha.md)).
- **P0-1, conteúdo:** as 18 lições somam ≈38 perguntas de múltipla escolha só
  em texto, com abertura e "ideia-chave" geradas por modelo
  (`JourneyDefinitionService.ts`), e não há nenhuma imagem radiológica.
- **P1-4, medição:** o analytics de produto é um adaptador vazio. Fica com o
  dono (FILA 43).
- **Reavaliação da tarde, depois do pacote** (22/40 em Nielsen;
  [síntese](trilha/avaliacoes/2026-10-16-reavaliacao-da-trilha.md)): o teto passou para
  dentro da lição.
  - Cada lição mostra **uma** pergunta. A segunda vai para o nó de revisão.
  - O fim reprovado diz "Refazer agora" sem botão para refazer.
  - O erro é explicado com o mesmo texto do acerto.
  - A alternativa certa é a mais longa em 18 de 32 perguntas, e as alternativas
    não são embaralhadas.
  - Três textos de estado da trilha ficam abaixo do contraste AA.

  O [plano de melhoria da trilha](trilha/plano/2026-10-16-plano-de-melhoria-da-trilha.md)
  saiu dessa síntese e das pesquisas reunidas em [`trilha/`](trilha/README.md), com as
  escolhas do dono de 2026-10-16: consertar a lição legada em paralelo ao
  piloto híbrido, ter um item de imagem por trilha neste ciclo e abrir as quatro
  frentes de engenharia. A próxima é a FILA 49.

**Consertados localmente no mesmo dia, sem publicação**
([ADR](adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md),
[evidência](evidence/2026-10-16-pacote-de-confianca-da-trilha.md)):
- o resumo mostra as estrelas da tentativa, com o recorde à parte;
- a revisão não fecha trilha nem custa vida, e devolve uma vida quando vencida;
- a revisão de uma trilha anterior volta a registrar conclusão e XP;
- o lembrete diário saiu do modo sombra e agenda de verdade.

**E2E de volta ao verde** (medido em 2026-10-16, no simulador iOS, sem
Android): a trilha centralizada (`f39ac9e`) tirava da tela o cabeçalho que 12
roteiros usam como âncora. Eles agora rolam até ele. A bateria padrão passou
7 de 8 numa execução, e o `reward-unlock` passou sozinho depois, com o prazo de
rolagem ampliado.
`rating-prompt`, `store-capture` e os `student-checkpoint-*` não foram
executados ([evidência](evidence/2026-10-16-e2e-ancora-de-estude.md)).

## Kill switches reais

Dois, medidos em 2026-09-23: `ENABLE_LEARNING_ROAD` (trilha contra Home antiga)
e `ENABLE_REVIEW` (por `EXPO_PUBLIC_ENABLE_REVIEW`, padrão `true`). São lidos
em build, então só se acionam por build novo ou OTA. A guarda
`src/config/killSwitches.contract.test.ts` barra flag `ENABLE_*` fixa ou sem
leitor.

## Melhorias locais — itens 36, 39 e 27 (2026-10-12)

Implementados e commitados em **`a366295175a2ab77e4e2d8cc81cf725d0a37f29c`**,
no branch local `codex/radiant-study-improvements`: reforço persistente nas
avaliações V2, conquista recomendada na Estude e data/hora da revisão.
Validação da implementação: 14/14 validadores; E2E `reward-unlock` passed em
14m25s. Run `run-1791835753802-82105001` fechado, memória validada gravada e
sessões de leitura fechadas. O histórico de reforço é local, sem inclusão no
backup iCloud. **Ainda fora da versão publicada**, que continua em `221e2ec`;
nenhuma build de distribuição ou OTA foi enviada para estas melhorias.
[Evidência](evidence/2026-10-12-itens-36-39-27.md),
[ADR](adr/ADR-2026-10-12-reforco-conquista-e-disponibilidade.md),
[fluxo](CLIENT_FLOW.md) e [arquitetura](ARCHITECTURE_STATE.md).

Reconciliação documental em 2026-10-12, run `run-1791837586006-e2b3a012`:
fluxo, arquitetura, fila e roadmap vinculados ao commit da implementação;
`loop validate` passou 14/14 em um único ciclo. O E2E citado pertence à
implementação e não foi repetido por esta atualização documental.

## Evolução visual — implementada localmente (2026-10-13)

Direção aprovada por Anderson em 2026-10-12; código até `c9169ee`: recomendação
no header rolável de Estude, fundo focado, confirmação explícita de múltipla
escolha e conclusão compacta/factual. Serviços atuais continuam donos das regras.

Testes focados e revisões por tarefa aprovados. **Quatro flows nativos iOS
passaram:** duas lições, offline, conquista bloqueada e coleta após sete lições.
SE 375pt com texto AX2 passou; erros 5→0 abriram recarga mantendo 1/8; repetição
correta no iPhone 17 manteve 110 XP e 8/8. Nove capturas reais registradas.
Revisão integrada corrigiu a retomada defasada e o hint compartilhado da
conclusão; 254 testes focados e retomada nativa suplementar passaram.
Rerevisão aprovada: cursor e hint corrigidos, sem novos defeitos.
**Validação integral aprovada: 14/14**, no terceiro ciclo do mesmo run,
após corrigir causas específicas dos dois ciclos anteriores. QA visual estrito
com 0 regressões; nenhum guarda ou baseline foi flexibilizado.
[Evidência e limites](evidence/2026-10-12-study-experience-implementation.md),
[spec/plano](superpowers/plans/2026-10-12-study-experience-plan.md).

Sem publicação ou integração à main. Editorial/piloto L1, VoiceOver audível,
TalkBack/Android, aparelho físico, assinante real e desempenho comparativo
seguem nos gates próprios. Reduce Motion foi validado em código; tentativa de
controle nativo indisponível não recebeu PASS. Nenhuma mudança em V3,
voz/Rive, analytics, assinatura ou backend.

## Remediação de QA local — medida em 2026-10-14

Pacote local versionado em `13ee173`, branch `codex/radiant-study-improvements`.
Run de entrega fechado, memória validada gravada e sessão do cérebro encerrada.
[Evidência do fechamento](evidence/2026-10-14-qa-remediacao.md#proveniência-loop).

Revisão direta corrigida: superfície legível, resposta persistente, classificação
sem duplicidade, rolagem por pergunta/fase e HUD atualizado. Lição/revisão
hidratam e preservam os marcos de primeiro valor. Retornos à jornada reutilizam
a Home com `dismissTo`, evitando cópias acumuladas na pilha.

Cinco roteiros anteriormente reprovados passaram após manutenção; L1 e revisão
foram novamente aprovadas depois da correção de hidratação. Diálogo nativo de
avaliação da loja aprovado (144 s), com configuração JS de produção isolada,
12 aberturas reais e um primeiro valor. É wrapper Debug, sem prova de Release.
Versão local compilada/instalada reconciliada: **1.4.0 (3)**.

AX5 chegou ao resumo, mas o roteiro integral manteve FAIL na última busca de
resultado; controle separado de resultado/retorno passou. Não há aprovação
integral AX5/VoiceOver. Vinte ciclos no mesmo PID: footprint **285,9→299,0→309,5 M**
(~8,3%, antes ~90%); telas nativas **2→2→2**, componentes **178→178→178** e
uma única Home na pilha. Acúmulo de telas corrigido no cenário Debug medido;
12 leaks/4.832 bytes constantes, sem origem determinada. Gate final **14/14 aprovado, ciclo único**. [Evidências, falhas preservadas e limites](evidence/2026-10-14-qa-remediacao.md).
API pública continua em 502; aparelho físico, compras/CloudKit autenticados,
24 horas reais, Android e distribuição permanecem nos gates próprios.

## Estude abre no nó PRÓXIMO — medido em 2026-10-16

Local, no branch `codex/radiant-study-improvements`, sem publicação. A trilha
abre com o PRÓXIMO centralizado, e voltar à aba preserva a posição: a releitura
de foco deixou de trocar a lista pelo esqueleto. Título e cartão de
recomendação continuam no topo da rolagem. Conferido no simulador (iPhone 17,
1.4.0 (3)); a recentralização depois de concluir uma lição e o AX5 não foram
vistos na tela. [ADR](adr/ADR-2026-10-16-estude-abre-no-proximo-no.md),
[evidência](evidence/2026-10-16-trilha-ancorada-no-proximo.md).

## Configuração sai do Perfil — medido em 2026-10-16

Local, no mesmo branch, sem publicação; fecha o item 32 da FILA. Uma
engrenagem no cabeçalho do Perfil abre a tela Configuração (`/settings`), com
assinatura, backup no iCloud, sons e vibração, conta e sincronização (só com o
sync remoto ligado), ajuda com "Rever apresentação" e a porta do console (só
em desenvolvimento). O Perfil guarda identidade, missões e progresso. Conferido
no simulador (iPhone 17, 1.4.0 (3)); o cartão de conta com sync ligado e o AX5
não foram vistos na tela. [ADR](adr/ADR-2026-10-16-configuracao-no-perfil.md),
[evidência](evidence/2026-10-16-configuracao-no-perfil.md).

## Gate de qualidade

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```

**Remedido em 2026-10-14:** run `run-1791978395898-e847c951`, primeiro e único
ciclo final, **14/14 aprovados** (`VALIDATION_PASSED`). Inclui `app-quality`
íntegro, `app-test --runInBand --no-cache`, contratos/conteúdo, testes/lint/tipos
da API, documentos e links do cérebro. App/API no Node 20,
`EXPO_NO_DOTENV=1`/`CI=1`; Loop no Node 24. App/Metro encerrados e SE desligado.

Evidências principais: `app-quality` = `evidence-53076ae2-3874-4540-a43e-5f1905cfe982`;
`app-test` = `evidence-176e8c7f-13b0-4e8b-a253-e8b61a5f7836`.
A CLI retém hashes e prévias; contagens focadas são identificadas separadamente
no [relatório de remediação](evidence/2026-10-14-qa-remediacao.md).
É validação local; CI remoto, integração à main e publicação não executados.
Autoridade do comando de CI: `.github/workflows/radiant-app-quality.yml`.

Testes e builds do app rodam no **Node 20**; só a CLI `loop` usa o 24. Confira
com `node --version` antes de citar qualquer número.

**Consolidação documental validada em 2026-10-14:** run
`run-1792017443998-8ca34b51`, **14/14, ciclo único**, sobre o pacote `13ee173`.
Contrato documental = `evidence-8196312e-5a49-440e-9ea5-d39533b66434`;
app-quality = `evidence-99f1b011-f87d-45d8-ba2a-f6eff8facb72`.
Essa etapa não repetiu o QA nativo nem as medições externas; preserva a
proveniência e os limites registrados no relatório.

### O que o gate NÃO pega

- **Não empacota o app.** Um app que não abre passa nos 19 passos (aconteceu em
  2026-08-21). Subir no simulador faz parte de verificar uma entrega.
- **Os flows do Maestro não rodam no gate.** O contrato confere estrutura e,
  desde 2026-10-12, cruza os seletores da navegação com o rótulo acessível do
  cabeçalho por AST. Isso ainda não verifica renderização, toques nem diálogo
  da loja; estes exigem execução no simulador ou aparelho.
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

**Remedido em 2026-10-12:** `git ls-remote origin refs/heads/main` confirma
`221e2ecc3253266d5498090f4d7a4f51f875c1fe`; `gh pr list --state open` não lista
PR aberta. A implementação `a366295` está somente no branch local
`codex/radiant-study-improvements`, depois da base `376d8de`. Esta atualização
é documental, sem push, merge ou publicação.

Medido em 2026-10-10, às 09:55:
- **`origin/main` está em `221e2ec`,** o merge da #38, com o CI verde:
  `Content Scripts` e `Radiant App Quality`. Antes dela, as PRs
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
- **A [#38](https://github.com/andersonsmelo/Radiant/pull/38) entrou na `main`
  em 2026-10-09, às 16:18,** por merge commit (`221e2ec`), feito pelo agente
  com o ok do dono na conversa. Tinha 42 commits e o CI verde na `1522bda`:
  `content` e `quality`. O branch remoto `feat/d4-decisoes-de-revisao` não
  foi apagado; apagá-lo é do dono.
  - O CI também passou em cada push anterior do dia.
  - A revisão do Codex apontou dois defeitos, que foram consertados na
    `3db5f8d`, com as threads respondidas e resolvidas.

  O branch leva:
  - a D4, a guarda de sincronia, o eas-cli e as evidências da regra de vidas e
    do aquecimento;
  - as três ADRs de 2026-09-25;
  - o "Gerenciar", o preço da loja e a ordem dos planos (`4afcd15`);
  - o Ask to Buy no StoreKit Testing e o conserto da tela da assinatura, de
    2026-09-27, e os consertos da revisão da PR (`3db5f8d`);
  - de 2026-09-28, numa sessão só:
    - o anúncio da perda de vida na lição (FILA, 25);
    - o bump para `1.4.0` (FILA, 20);
    - as variantes da amostra da L1 (FILA, 7a);
    - os sons e a vibração na lição do aluno, já sem o som do coração
      (FILA, 31 e 26);
    - as lições de medição, de escopo e de simulador, no AGENTS.md;
  - de 2026-09-28, em outra sessão, o conserto do aquecimento (FILA, 12): o
    fundo animado para fora de foco
    ([evidência](../radiant-app/docs/evidence/2026-09-28-aquecimento-conserto-simulador.md));
  - de 2026-09-28, na mesma sessão, o ícone de sequência pausado fora de foco
    (FILA, 33), com o hook de foco compartilhado em `src/ui/useScreenFocused.ts`;
  - de 2026-09-28, na mesma sessão, **a trilha sem os checkpoints de botão**
    (FILA, 29 e 34): as trilhas do catálogo passam de lição a lição, e as 5
    avaliações da V2 ficam
    ([ADR](adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md),
    [relatório](superpowers/handoffs/2026-09-28-radiant-sem-checkpoints-de-botao-relatorio.md));
  - as conferências no iPhone de 2026-09-27. O aquecimento ganhou, às
  18:06, a segunda passagem no simulador: uma estrela só já custa 28 % de um
  núcleo, e a aba visitada continua montada e animando, o que leva a CPU de
  ~42 % para ~66 % ([evidência](../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md),
  [FILA](FILA.md), achado 5).
  - **Consertado em 2026-09-28:** com o fundo parado fora de foco, o Perfil
    depois da Estude foi de 63,6 % para 43,9 %, e a assinatura empilhada
    sobre as abas, de 65,3 % para 31,4 %, na mesma passagem. A tela em foco
    custa o mesmo, ~39 %.
  - **O resto, também consertado em 2026-09-28** (FILA, 33): era o ícone de
    sequência, que respirava fora de foco no HUD e no Perfil. Com ele
    pausado, a assinatura sobre as abas foi de 30,7 % para 0,1 %.
- **Push e PR, decidido pelo dono em 2026-09-25:** o push está autorizado; PR,
  **uma por dia, às 21 h**, com o acumulado. O merge continua sendo do dono.
  A de 2026-09-27 é a #38, que entrou em 2026-10-09. O branch
  `docs/envio-1-4-0`, com o registro do envio e a documentação de 2026-10-10,
  está no remoto e **aguarda PR**, que precisa do ok do dono.
- **O remoto tem a `main`, os quatro branches das PRs #35 a #38**, que já
  entraram e não foram apagados (`docs/estado-2026-09-25`,
  `fix/defeito-1-licao-concluida`, `fix/renovacao-desconhecida` e
  `feat/d4-decisoes-de-revisao`), **e o `docs/envio-1-4-0`**, ainda sem PR
  (medido em 2026-10-10, às 09:55). Apagar os mergeados é do dono. Os
  25 branches mergeados antes foram apagados em 2026-09-25, por decisão dele.
  A lista, com a ponta de cada um para restaurar, está em
  [`release/2026-09-25-branches-remotos-apagados.md`](release/2026-09-25-branches-remotos-apagados.md).
- **Prompt de continuidade:**
  [`2026-10-10-radiant-prompt-de-continuidade-18.md`](superpowers/handoffs/2026-10-10-radiant-prompt-de-continuidade-18.md).
  Ele substitui o (17).
- **Simuladores:**
  - o `A5FA5443-…`, do gate H4, já conferiu a regra de vidas na tela, em
    2026-09-25
    ([evidência](../radiant-app/docs/evidence/2026-09-25-regra-de-vidas-simulador.md)).
    Ficou com o checkpoint aprovado e 2 vidas. Se ele fica ou é apagado, o
    dono decide;
  - o `E3C547AE-…` ("iPhone 17 (iOS 26.5)") foi usado no StoreKit Testing em
    2026-09-27 e ficou com uma assinatura mensal de teste aprovada, ∞ no HUD.
    Em 2026-09-28, das 14:31 às 14:47, mediu o conserto do aquecimento, e
    terminou desligado, com Reduzir Movimento desligado. Das 15:28 às 15:40,
    mediu o ícone de sequência, e terminou do mesmo jeito. Nessa segunda
    passagem, as chaves de progresso ficaram byte-idênticas às do início.
    As transações se apagam no Transaction Manager do Xcode.
    `radiant-app/ios/` ficou com o `.storekit` e o esquema marcado; um
    `prebuild --clean` desfaz isso.

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

## Evolução global da trilha — medida em 2026-10-17

**Ponto de parada solicitado por Anderson em 2026-10-17:** implementação
encerrada por enquanto; nenhuma frente nova deve ser iniciada sem retomada
autorizada. [Índice consolidado das pesquisas/entregas](trilha/README.md) e
[prompt para a próxima IA](trilha/PROMPT-PARA-IAS.md) atualizados. O código da
trilha permanece local e não commitado na árvore compartilhada de
`codex/radiant-study-improvements`, HEAD `2c1b5f0`; preservar trabalho e renomes
staged de outras sessões. O run documental de consolidação é
`run-1792270280343-e58c9352`; seu gate/estado se consulta pela CLI.

**G4 — revisão com resposta antes do gabarito implementada localmente.** O aluno
seleciona uma alternativa e confirma; o serviço corrige pelo catálogo atual e
confirma a tentativa/agenda antes de mostrar feedback. Pedir a resposta com
ajuda registra `skipped`, ajuda e nenhum XP. Não existe mais autodeclaração de
acerto na tela ativa. Primeiro resultado, data e escolha em memória são estáveis
no retry; duplo envio não duplica confirmação. O aluno lê a explicação antes de
pressionar Continuar. Falha de storage mantém o gabarito oculto e oferece retry.

O journal registra `review-answer` e a referência temporal conferida contra o
cartão persistido. Uma revisão sem ajuda é `independent-recall` para conteúdo
promovido; legado conserva competência sintética e sua classificação legada.
O sinal operacional `after-interval` exige tentativa anterior confirmada,
vencimento alcançado e ao menos 24 h desde a confirmação anterior; cartões
apenas migrados são `unverified`. Isso não promove `delayed-retention`, não
ativa adaptação e não prova retenção, transferência ou eficácia clínica.

**Evidência local:** nove suítes/126 testes focados, atividade promovida real,
correção contra gabarito adulterado na UI, ajuda sem XP, retry estável e quatro
mutações discriminantes. [Entrega](evidence/2026-10-17-trilha-g4-resposta-antes-do-gabarito.md).
Gate/estado: `loop run status --run run-1792269695725-1c4f438c`.
Sessão `brain-session-1792269181556-0098c53e` fechada separadamente.

As camadas anteriores de [journal/fila por item](evidence/2026-10-17-trilha-g4-evidencia-e-revisao-por-item.md)
e [avaliações retomáveis](evidence/2026-10-17-trilha-g4-avaliacoes-no-journal.md)
permanecem: fila de 50, migração aditiva, histórico de reforço, catálogos G0–G3,
IDs e progresso preservados. Avaliação final aprovada libera a próxima unidade;
[conquista opcional](adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md).

**Ainda aberto:** critério pedagógico/revisão independente para promover evidência
retardada a domínio; QA nativo/VoiceOver/Android e desempenho G6; backup/reset,
limites de histórico e recuperação da janela de XP/jornada G7. Os tetos continuam
2 mil tentativas, 20 mil cartões e projeção de mil evidências. Store exclusivamente
local, fora dos snapshots/sync antigos. G3 requer produção/revisão real; acervo
G5 e mapa curricular amplo continuam no programa. Sem build, execução nativa,
conteúdo novo aprovado, V3, publicação, commit, push ou merge nesta etapa.

**Revisão independente — medida em 2026-10-17 pelo Claude Opus 5.5.**
Os 15 validadores passam na árvore atual: 173 suítes e 1.728 testes no app,
13 na API. A revisão achou três problemas:

- **A1:** uma `contentVersion` nova tira a lição da revisão para sempre
  ([FILA 55](FILA.md));
- **A2:** nos tetos declarados, o store de revisão ocupa cerca de 12 MiB,
  acima dos 6 MB padrão do AsyncStorage no Android;
- **A6:** o E1 tem 22 arquivos não commitados numa worktree e conflita com a
  árvore ([FILA 57](FILA.md)).

O trabalho G0–G4 continua não commitado ([FILA 56](FILA.md)). Desde 17/10, o
Claude revisa e coordena as IAs.
[Revisão](trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md) e
[protocolo](trilha/plano/2026-10-17-avancos-e-coordenacao-multi-ia.md).
