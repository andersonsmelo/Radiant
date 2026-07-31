# Radiant — Execution Status (2026-07-29, estendido em 2026-07-30)

> Este documento continua sendo o **status canônico**. Ele foi estendido em
> 2026-07-30 com o conserto do laço de gamificação (§4, ressalva 1) em vez de dar
> origem a um `EXECUTION_STATUS_2026-07-30.md`: oito arquivos apontam para este
> nome, incluindo `scripts/qa/docs-contract.mjs` e `.loop/project.yaml`, e um
> ponteiro canônico decai no instante em que o alvo é substituído. Trocar o nome
> exige varrer quem aponta para ele — trabalho que ainda não se justifica.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app abre,
oferece catálogo local, registra progresso e permite revisão mesmo quando a API
remota está ausente.

Este documento substitui [`EXECUTION_STATUS_2026-07-28.md`](EXECUTION_STATUS_2026-07-28.md)
como estado canônico; o snapshot anterior permanece histórico. Ele registra duas
mudanças de estado desta data: (1) o **E2E do fluxo crítico fechou nas duas
plataformas** (iOS 3/3 e Android 3/3), encerrando B0.1/C3/M2; e (2) uma **ofensiva
de aceleração de lançamento** que deixou toda a preparação de loja pronta até o
ponto em que só falta a ação do usuário (contas, hospedagem, testadores).

A API pública em `api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP
502) e **não está no caminho crítico** do lançamento — o produto lançável é
local-first. Esta execução não tocou VPS, DNS, proxy, banco ou serviço remoto.

## O que mudou desde 2026-07-28

### 1. E2E do fluxo crítico fechado nas duas plataformas

`3/3 Flows Passed` em **iOS (7m32s)** e **Android (11m48s)**, em execuções limpas e
isoladas sobre build local Release (bundle embutido, sem dev client, sem Metro).
Fechar o Android exigiu **dois defeitos reais de E2E** e a resolução de **uma causa
ambiental**:

- **Seletor de aba acoplado ao iOS.** `learning-critical-path` terminava em
  `tapOn: 'Progresso, tab.*'` (formato que só o iOS compõe). A correção prescrita
  na evidência anterior (`.*Progresso.*`) quebrava **as duas** plataformas: o
  Maestro casa texto *case-insensitive* e a legenda da home "Seu progresso fica
  salvo…" casava antes da aba. Seletor final ancorado: `^Progresso(, tab.*)?$`.
- **CTAs abaixo da dobra oclusos pela tab bar flutuante.** No emulador rápido, o
  `repeat while notVisible: scroll` para com o CTA sob a tab bar (medido: CTA em
  y2212–2277 vs barra y2198–2387), então o tap caía na barra. Correção: um
  `- scroll` de elevação antes de cada tap (`Abrir checkpoint`, `Concluir
  checkpoint`, `Abrir próxima lição`).
- **Host sem RAM.** Rodar o simulador iOS e o emulador Android juntos num host de
  16 GB esgotava a memória (swap thrashing), fazendo o emulador rastejar/travar.
  Regra: rodar E2E de **uma plataforma por vez**, com watchdog de timeout.

As duas regressões estão travadas em `radiant-app/scripts/maestro-contract.test.mjs`.
Detalhe e evidência em
[`docs/evidence/2026-07-29-android-e2e-close.md`](../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
O contrato de glifos de ícone também foi alargado para varrer `components/` e
`src/components/` (o ponto cego dos defeitos de ícone de 07-28), excluindo os
wrappers sancionados.

### 2. Aceleração de lançamento — preparação de loja pronta

Decisão do usuário: acelerar tudo que não depende de conta/testadores, deixando o
recrutamento de testadores como último ponto. Entregue nesta data:

- **iPad desligado na v1.3** (`supportsTablet: false`) — reduz screenshots/QA.
- **`eas submit` Android** configurado no `eas.json` (`submit.production.android`)
  + guia de setup em [`docs/store/EAS_SUBMIT_SETUP.md`](../docs/store/EAS_SUBMIT_SETUP.md).
- **Respostas de console prontas** em
  [`docs/store/DATA_SAFETY_E_CLASSIFICACAO.md`](../docs/store/DATA_SAFETY_E_CLASSIFICACAO.md):
  Data Safety e Privacy Labels = **nenhum dado coletado** (build local-first,
  Sentry off), categoria **Educação**, classificação esperada **Livre/4+**.
- **Kit de recrutamento de testadores** em
  [`docs/store/TESTER_INVITE_KIT.md`](../docs/store/TESTER_INVITE_KIT.md).
- **Política de privacidade e página de suporte finalizadas** (Markdown e HTML
  prontos para hospedar), usando o domínio do usuário **saudediagnostica.com**:
  `/radiant/privacidade` e `/radiant/suporte`.

### 3. Conta Play Console — estado descoberto

A conta de desenvolvedor existe: **tipo Pessoal**, nome de desenvolvedor "Saúde
Diagnóstica", proprietário `anderson.smelo94@gmail.com`. Por ser **pessoal**, o
**closed test de 12 testadores × 14 dias consecutivos** é obrigatório antes da
produção (a Apple não tem requisito equivalente — o gate dela é o App Review).
A **verificação de acesso a dispositivo Android** está pendente e exige um
**aparelho real** (o emulador local é imagem "Google APIs" sem Play Store, e a
verificação é antifraude para hardware real).

### 4. Ícone da marca — três defeitos encontrados e a decisão do Pixel

Preparar os assets gráficos da ficha do Play expôs que o **ícone atual não é
publicável**. Não são ajustes de gosto; são três defeitos verificados:

1. **Grade de construção embutida na arte** de `icon.png` **e** de
   `android-icon-background.png`. Como `app.json` não declara `ios.icon`,
   `icon.png` é o ícone da **App Store e da tela inicial do iPhone** — a grade
   iria para a loja. *Armadilha registrada:* inspecionar apenas a camada
   *foreground* (limpa) leva à conclusão errada de que o Android está ok. O
   adaptive icon é a **composição** das duas camadas, e a de fundo tinha o mesmo
   defeito. Evidência sobre uma camada só autoriza conclusão sobre aquela camada.
2. **`splash-icon.png` não é a marca** — é um placeholder de alvo em blueprint,
   exibido a 200 px sobre fundo **branco** em todo cold start, contra a
   [ADR de identidade galaxy dark](adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md).
3. **O "A" em chevron é da Ascend Creative**, não do Radiant.

**Decisão aprovada pelo dono:** o mascote **Pixel** vira a marca do Radiant —
corpo inteiro sobre gradiente galaxy elevado (`#0D1230` centro → `#07091c`
borda), com o rosto simplificado como forma reduzida na camada monocromática.
Spec aprovada em
[`docs/superpowers/specs/2026-07-29-icone-do-app-design.md`](superpowers/specs/2026-07-29-icone-do-app-design.md);
execução em 6 tasks no
[plano do ícone](superpowers/plans/2026-07-29-icone-do-app.md).

**As 6 tasks do plano foram concluídas nesta data.** O contrato de assets fechou
em **11/11** nesta data e roda dentro do `npm run quality`; o bloqueio de
engenharia do lançamento foi encerrado. *(O contrato cresceu depois: em
2026-07-30 foi para **14/14**, ao travar os dois buckets de screenshot de iPhone.
O `11/11` acima fica como o valor medido em 07-29.)* Evidência em device em
[`2026-07-29-icone-marca-pixel.md`](../radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md),
inventário dos assets em [`ASSETS_DE_LOJA.md`](store/ASSETS_DE_LOJA.md).

Três correções ao plano apareceram durante a execução, cada uma achada **medindo
ou renderizando**, não lendo:

- **Enquadramento: a spec estava certa, a primeira implementação não.** O Pixel é
  retrato (L/A = 0,725), então os "~62% da largura" da spec projetam **85,6% de
  altura** — a altura é a dimensão que restringe. O gerador chegou a usar 78% de
  altura, escolha feita olhando a comparação a 360px; renderizando nos tamanhos
  reais (1024, 180 sob a squircle, 120, 80 e 48px), o enquadramento menor perde a
  legibilidade do rosto, que é a parte reconhecível da marca. **Resolvido a favor
  da spec.** O gerador agora expressa `BODY_WIDTH_FRAC = 0.62` e **deriva** a
  altura do aspecto real: dois números para o mesmo enquadramento divergem no
  primeiro dia em que a arte mudar de proporção, que foi como isto começou.
- **A camada monocromática derivada só do alpha sairia como blob sem rosto.** No
  master, olhos e sorriso são pixels ciano **opacos** sobre a tela escura, não
  furos no alpha. Os glifos são extraídos por cor e subtraídos da silhueta.
- **O splash com tile de gradiente desenha um quadrado mais claro** sobre o fundo
  `#03030d`. Trocado por Pixel sobre transparente.

**Uma quarta superfície de ícone estava fora do escopo do plano:** o plugin
`expo-notifications` cabeava `icon.png`, que é **sem alpha** por exigência da
Apple — e o Android usa apenas o canal alpha do ícone pequeno como máscara. Os
requisitos das duas superfícies são **mutuamente exclusivos**, então a correção
exigiu um oitavo asset (`notification-icon.png`). A hipótese de que o arquivo
antigo renderizaria como retângulo sólido foi **confirmada em device**, com
antes/depois. O levantamento original falhou porque enumerou defeitos **por
asset**, e essa superfície não é um asset — é uma referência no `app.json`.

**O que entrou antes (Tasks 1 e 2, revisadas e limpas):**

- **`writePolicy.allowedRoots` alargado** com `radiant-app/assets` em
  `.loop/project.yaml` (commit `38f59b8`). O widening foi transação própria e
  anterior à mudança que ele autoriza — a política é lida quando o escopo é
  checado, então embuti-la no mesmo run seria auto-autorização. A arte-fonte foi
  versionada como `radiant-app/assets/brand/pixel-master.png`, em vez de ficar
  solta na raiz, para não abrir uma segunda exceção de política.
- **Contrato de assets** em `radiant-app/scripts/icon-assets-contract.test.mjs`
  (commits `1864a47`, `0f7b764`): lê o cabeçalho IHDR e percorre a cadeia real
  de chunks PNG, travando dimensão, política de alpha, peso do ícone 512 e o
  teto de proporção 2:1 dos screenshots. **Ligado ao `npm run quality` na Task 5**,
  quando todos os assets passaram a existir — nenhum commit deixou o gate vermelho
  (roadmap §10). Hoje trava **oito** assets — contados rodando o próprio
  contrato em 2026-07-31 — e roda **14/14**, depois de ganhar em 07-30 as três
  asserções dos buckets de iPhone.

**Limite explícito do contrato:** ele pega violação de especificação, não arte
inadequada — **não** teria pego a grade de construção, que passa em qualquer
verificação geométrica. O que pega arte errada é evidência em device somada a
revisão humana.

**A ficha do Play exige três assets gráficos, não dois.** A task **L2.7** do
[plano de closed testing](plans/2026-07-29-android-closed-testing-plan.md)
listava apenas screenshots e feature graphic; faltava o **ícone 512×512** (PNG
32-bit com alpha, ≤ 1024 KB). Corrigido no plano e **os três existem** desde esta
data — L2.7 concluída.

**Duas ressalvas — a 1 fechada no Android em 2026-07-30, a 2 ainda aberta:**

1. **Screenshots com progresso zerado — causa investigada em 2026-07-29, e não é
   vitrine fraca: é defeito.** Primeiro, uma precisão: os dois zeros não vêm da
   home. `XP total:` é a celebração do `CheckpointScreen` e `REVISÕES` é a aba de
   progresso — a mitigação do flow (percorrer a trilha antes de fotografar a
   home) não podia afetar o shot do checkpoint, capturado no meio da trilha por
   construção.

   **Em produção o laço de gamificação não tem escritor alcançável.** Os três
   escritores de estado vivem no hook `useQuiz`, que só roda em `QuizScreen`,
   servida pela rota `/quiz` — e **nada no app navega para `/quiz`**. O player que
   os usuários percorrem (`LessonFlowScreen`) conclui chamando apenas
   `JourneyProgressService`; não há uma referência a gamificação, repetição
   espaçada ou meta diária em todo `src/features/lesson-flow/`. São quatro
   contadores parados pelo mesmo buraco: **XP**, **sequência** (`updateStreak` só
   roda dentro de `recordQuizCompletion`), **revisões pendentes** (nenhum card
   nasce, então nenhum nó de revisão vence) e **meta diária** (lida por
   `MissionsScreen`, `JourneyHomeScreen` e `PushService`). Contra isso há doze
   call sites de `getSnapshot()`, três deles em código inalcançável — **nove
   leitores em telas alcançáveis**, e é essa assimetria que faz a feature parecer
   viva com dados vazios.

   A porta da revisão **já existe** na própria trilha (nós `node:review:<lessonId>`
   com conteúdo real em `defaultBlocks.ts`, status `due-review` derivado do
   agendador, conclusão idempotente). O laço inteiro está construído e parado numa
   chamada que ninguém faz. Spec aprovada pelo dono em
   [`2026-07-29-laco-xp-revisoes-design.md`](superpowers/specs/2026-07-29-laco-xp-revisoes-design.md),
   plano em [`2026-07-30-laco-xp-revisoes.md`](superpowers/plans/2026-07-30-laco-xp-revisoes.md).
   Corações ficam **fora** desse escopo por decisão do dono: `canStartLesson()`
   tem zero call sites, então hoje eles não bloqueiam nada.

   **Implementado em 2026-07-30**, commits `ab40bb1..056ffe1` — `LessonOutcomeService`
   em `src/features/lesson-flow/services/`, paridade de sincronização, e o
   `LessonFlowScreen` chamando o serviço **antes** de `markNodeCompleted` (a ordem
   importa: a elegibilidade lê `completedNodeIds` e `pendingReviewNodeIds`, que a
   marcação altera). Prêmio por tipo de nó: lição paga na primeira conclusão,
   revisão paga quando estava vencida, e o card do SM-2 é reavaliado nos dois
   casos. `npm run quality` verde em cada commit, mais os nove validadores do Loop.

   **A evidência em device foi OBTIDA em 2026-07-30 e a ressalva de vitrine está
   FECHADA no lado Android.** `XP total: 18` na celebração do checkpoint, `⚡ 36`
   e `🔥 1d` no cabeçalho da home, `TOTAL XP 36` na aba de progresso — medidos
   sobre APK Release do perfil **production** construído às 11:41 e instalado às
   11:43:05, portanto posterior a todos os commits da mudança. Evidência completa,
   receita reproduzível e limites em
   [`2026-07-30-laco-xp-device.md`](../radiant-app/docs/evidence/2026-07-30-laco-xp-device.md).
   Os 18 XP por lição são o valor **previsto** pela §5 da spec (uma questão por
   bloco → acurácia 0 ou 100% → `10 + 8`), não um número solto; duas lições no
   flow dão 36. `REVISÕES` continua em `0` e isso **está correto**: o contador
   conta cards *vencidos*, e o SM-2 só vence o primeiro depois do intervalo
   inicial — a mudança garante que o card **nasce**, não que já esteja vencido.

   **A redação anterior desta ressalva estava errada e a correção importa mais que
   o conserto.** Ela afirmava que a captura estava bloqueada porque **"não há JDK
   neste host"**. Há: um **JDK 17.0.19 instalado desde 2026-04-22** em
   `~/.jdks/jdk-17.0.19+10`, com `~/.zshrc` exportando `JAVA_HOME` e prefixando o
   `PATH` **desde 2026-07-26** — quatro dias antes da sessão que declarou o
   bloqueio. `./gradlew assembleRelease` sai `BUILD SUCCESSFUL in 48s`. As quatro
   checagens que sustentavam a conclusão não eram independentes: o `/usr/bin/java`
   do macOS delega a `/usr/libexec/java_home`, que consulta **apenas**
   `/Library/Java/JavaVirtualMachines` e `~/Library/Java/JavaVirtualMachines` —
   três das quatro repetem a mesma lista, a quarta acrescenta o Homebrew, e
   nenhuma enxerga `~/.jdks`. O acordo entre elas era uma medição repetida, não
   uma confirmação. O repositório já continha a contraprova desde 2026-07-28:
   [`2026-07-28-android-e2e-first-run.md`](../radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md)
   registra "Maestro 2.7.0; **JDK 17**" e um APK Release de 122 MB construído com
   ele. **Regra que fica:** um bloqueio que suspende trabalho planejado se
   estabelece por probe positivo no consumidor (`./gradlew -version`), nunca por
   acúmulo de negativas da mesma família — e negativas não corroboram umas às
   outras quando compartilham o mecanismo de resolução.

   **Achado novo na mesma tela, e RESOLVIDO na mesma data:** o screenshot que
   provou o conserto mostrava `TOTAL XP ⚡ 36` ao lado de `PRECISÃO — / Sem
   tentativas avaliadas ainda.` e de `TÓPICOS / Ainda não há evidência
   suficiente…`. Era a **mesma classe de defeito**, em três camadas:
   `AccuracyChartCard()` e `TopicsMasteredList()` não recebiam props e
   renderizavam o estado-vazio incondicionalmente; `LearningStatsService`, que
   computa exatamente esses valores e tem teste unitário, tinha **zero
   consumidores**; e `LearningAttempt`/`getAttempts` apareciam, em todo o `src/`,
   apenas no próprio serviço e no seu teste.

   **Corrigido:** novo `LearningAttemptsRepository` persiste as tentativas em
   `AsyncStorage` (teto de 500); o `LessonOutcomeService` grava a tentativa
   **mesmo quando não premia** — refazer lição não paga XP, mas continua sendo
   informação sobre memória — e resolve elegibilidade e unidade numa única
   leitura do snapshot; o `ProgressScreen` consome o serviço que já existia.
   `topicId` é o `unitId` do nó: `QuizLesson` não carrega tópico, e a unidade é o
   único agrupador que o domínio tem — o rótulo exibido é o **título** da
   unidade. O teste novo foi verificado **por reversão**: devolvendo o card ao
   hardcoded, só ele falha e os outros seis seguem verdes.
2. **A prova do *themed icon* do Android 13+ não foi obtida.** O toggle existe na
   árvore e não alterna nesta imagem de emulador (Google APIs, sem o launcher
   completo do Pixel). Fecha com um aparelho real; uma captura basta.

### 5. Páginas legais publicadas — L2.3 (A4) e L2.8 (E5) fechadas

As duas páginas legais obrigatórias estavam prontas em `docs/legal/` desde
2026-07-29 e **nunca haviam sido publicadas** — medido no mesmo dia, as URLs
retornavam HTTP 404. Artefato pronto no repositório não é artefato entregue: o
estado dessas tasks só se conhece medindo a URL pública.

A publicação foi feita pela equipe do site `saudediagnostica.com` a partir de
[`docs/legal/PROMPT_PUBLICACAO_PAGINAS.md`](legal/PROMPT_PUBLICACAO_PAGINAS.md),
um handoff autocontido com o HTML embutido e os SHA-256 das fontes.

**URLs canônicas — usar a forma COM barra final nos consoles:**

| Página | URL | Estado |
| --- | --- | --- |
| Política de Privacidade | `https://saudediagnostica.com/radiant/privacidade/` | HTTP 200 direto |
| Suporte | `https://saudediagnostica.com/radiant/suporte/` | HTTP 200 direto |

**Verificação independente (medida de fora, não relatada):** ambas em 200
`text/html`; corpo servido **byte a byte idêntico** à fonte, com os SHA-256
batendo (`0f309c05…` e `668a8b39…`); UTF-8 válido, acentuação intacta e
`<meta charset>` dentro dos primeiros 1024 bytes; **zero scripts e zero recursos
externos**, portanto nenhum consent wall pode esconder o texto; sem `noindex` e
sem bloqueio de `/radiant/` no `robots.txt`; as URLs sem barra final fazem
exatamente **um** salto 301 para a canônica.

**Risco aberto, não bloqueante:** o código que publica as páginas vive na branch
`codex/radiant-legal-pages` do repositório do site, em uma **PR ainda sem merge**
(#39). As páginas estão no ar porque subiram por FTPS, mas um redeploy a partir
da branch principal pode removê-las — e a revisão das lojas pode ocorrer semanas
depois. **Mergear a PR antes de submeter**, e remedir as duas URLs na véspera.

## Verificações nesta data

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint, typecheck, contratos estruturais, suíte Jest e visual QA estrito — gate completo num comando |
| E2E em device — iOS (sim, Release local) | PASS | `3/3 Flows Passed in 7m 32s` (2026-07-29) |
| E2E em device — Android (emulador, APK Release) | PASS | `3/3 Flows Passed in 11m 48s` (2026-07-29) |
| smoke público da API | FAIL esperado | `/health` e `/ready` em HTTP 502 (estado inalterado; fora do caminho crítico) |
| páginas legais públicas (§5) | PASS | `/radiant/privacidade/` e `/radiant/suporte/` em HTTP 200, corpo byte a byte idêntico à fonte (SHA-256 conferidos), sem consent wall e sem `noindex` |
| contrato de assets de ícone | **PASS — 11/11** | Ciclo TDD fechado: nasceu vermelho na Task 2 (4/9 falhando por motivo real) e fechou na Task 5, quando os oito assets passaram a existir. Agora roda dentro do `npm run quality` |
| evidência em device do ícone | **PASS parcial — 3 de 4 provas** | Launcher, splash e ícone de notificação verificados no aparelho. A prova do *themed icon* do Android 13+ não foi obtida nesta imagem de emulador |

### Verificações de 2026-07-30

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | rodado em cada um dos **nove** commits do dia, e ao final **sobre o estado commitado** — 0 arquivos rastreados modificados, 32 suites, 110 testes |
| gate transacional do Loop | PASS | nove validadores verdes em cada um dos seis runs; cada run fechou com memória validada |
| suíte de `lesson-flow` | PASS | 16/16 — 11 do `LessonOutcomeService`, 5 do `LessonFlowScreen` |
| cobertura da corrida de estado | PASS | verificada por reversão: trocando o valor local pelo estado, o teste novo falha com `{}` contra `{ 'step-final-choice': true }` |
| evidência em device do laço de XP | **PASS** | `XP total: 18` no checkpoint, `⚡ 36`/`🔥 1d` na home, `TOTAL XP 36` no progresso, sobre APK Release **production** instalado às 11:43:05 — posterior a todos os commits. Ver §4, ressalva 1 e [a evidência](../radiant-app/docs/evidence/2026-07-30-laco-xp-device.md) |
| build release Android local | **PASS** | `BUILD SUCCESSFUL in 48s` com o JDK 17.0.19 em `~/.jdks` — o "não há JDK neste host" registrado antes nesta mesma tabela era falso; ver §4, ressalva 1 |
| bundle do APK contém a mudança | **PASS** | `LessonOutcomeService` ×4 no bundle extraído de dentro do APK, com dois controles negativos em `0` na mesma invocação |
| cards PRECISÃO e TÓPICOS (achado novo) | **PASS — corrigido** | `PRECISÃO 100%` e `TÓPICOS Fundamentos — 100% · 2 lições` nas três resoluções; teste novo verificado por reversão; gate completo verde (110 testes) |
| E1 — lado iOS (6,7" e 6,5") | **PASS** | `EXIT=0` no iPhone 16 Plus (**1290×2796**) e no iPhone 11 Pro Max (**1242×2688**), sobre build Release com env **production**. Ver [a evidência](../radiant-app/docs/evidence/2026-07-30-e1-store-capture.md) |
| `store-capture.yaml` — oclusão do CTA | **corrigido** | guarda `notVisible` trocada por scroll fixo: no iPhone a alternativa ficava em `y850–932` de 932pt, visível para o predicado e por baixo do CTA flutuante, e o tap caía no botão desabilitado |
| Android após a correção do flow | **PASS** | reexecutado **depois** da mudança no flow compartilhado, `EXIT=0`, seis screenshots — sem regressão |
| screenshots publicáveis do Play | **regerados** | os seis em `docs/store/assets/screenshots/` eram de 2026-07-29 18:00 e mostravam o estado defeituoso; regerados da captura pós-correção, 6 × 1080×1920 (1,778:1). A ressalva de vitrine em `ASSETS_DE_LOJA.md` está fechada |
| instrução de segurança da service-account key | **corrigida (07-31)** | `EAS_SUBMIT_SETUP.md` mandava conferir a proteção da chave no `radiant-app/.gitignore`. Esse arquivo tem `*.p8` mas **não** `credentials/`; quem ignora a chave JSON é o `.gitignore` da **raiz, linha 37**. Seguir a instrução levaria a olhar o arquivo errado e concluir que a proteção sumiu, no instante anterior a baixar um segredo. Trocado por `git check-ignore -v`, que interroga o resolvedor em vez de ler uma das fontes que ele consulta |
| documentação varrida por função (07-31) | **atualizada** | O `11/11` do contrato estava repetido em **quatro** documentos e o checklist de release seguia parado em 07-27, com quinze itens marcados pendentes que já tinham fechado. Corrigidas só as afirmações em **presente** — tabelas datadas registram o que foi medido naquele dia e alterá-las falsificaria histórico |
| screenshots de iPhone para a App Store | **PASS — fechado** | os doze PNGs publicáveis existem em `docs/store/assets/screenshots-ios-67/` (1290×2796) e `screenshots-ios-65/` (1242×2688). O `normalize-screenshots.py` não "só conhecia" as regras do Play — seu `MAX_RATIO = 2.0` **reprovava** os doze arquivos (2,167:1 e 2,164:1); virou `--spec` obrigatório com validação de tamanho exato por bucket. Contrato de assets de 11 → **14 testes**, verificados por reversão |
| `RUNBOOK_PLAY_CONSOLE.md` — bloqueios obsoletos | **corrigido** | a seção "o que este runbook NÃO destrava" afirmava `docs/store/assets/` vazio e `adaptiveIcon.backgroundColor` = `#E6F4FE`; medidos em `98261a4`: **oito arquivos** e **`#07091c`**. Os dois bloqueios fecharam em 07-29, mas o runbook — que é o documento que **manda o dono agir** — seguiu mandando adiar o upload do AAB, gatilho do relógio de 14 dias. Fechar um bloqueio precisa varrer os documentos de instrução, não só os de estado |

### Verificações de 2026-07-31

| Verificação | Estado | Resultado |
| --- | --- | --- |
| app criado no Play Console (L2.2 / A3) | **FEITO** | criado nesta data pelo dono, com o título **`Radiant — Radiologia`** — confirmado na barra do console. O identificador de pacote foi fixado nesse ato e é **irreversível**; conferir em Configurações → Detalhes do app que ele é `com.ascendcreative.radiant` antes do primeiro upload de AAB |
| `RUNBOOK_PLAY_CONSOLE.md` — campo de pacote | **corrigido** | o runbook afirmava que o identificador de pacote **não é digitado na criação do app**. É — o campo está na tela de criação, com "Ver disponibilidade", e é o único campo irreversível dela. Nenhuma varredura deste repositório poderia ter pego isso: é afirmação sobre a UI de um terceiro, que muda sem emitir sinal do lado de cá. O runbook passou a marcar esse gênero de afirmação como "confira na tela" e a nunca afirmar a **ausência** de um campo |
| `RUNBOOK_PLAY_CONSOLE.md` — nome do app | **corrigido** | Parte 1 mandava digitar `Radiant` e Parte 2 mandava `Radiant — Radiologia` **no mesmo campo do console**, desde o dia em que o arquivo foi escrito. O dono seguiu a Parte 1 e digitou o valor errado. A varredura de 07-30, feita **por função** de documento, não pega esta classe: as duas seções são instrução, as duas estão em presente e as duas parecem certas isoladas. Agora há uma tabela única de campos, referenciada pelas demais seções |
| `TESTER_INVITE_KIT.md` — sequência do opt-in | **corrigido** | o passo a passo mandava criar o track, adicionar e-mails e "copiar o link de opt-in". Esse link **só existe depois que uma release está ativa no track fechado** — seguir o kit levaria a procurar um link inexistente e concluir que algo quebrou. Separado no que dá para adiantar sem build (levantar pessoas, criar track, criar Grupo do Google) e o que exige a release promovida |
| `TESTER_INVITE_KIT.md` — conta do aparelho | **corrigido** | o kit dizia "basta a conta Google deles" sem dizer **qual**: o e-mail cadastrado precisa ser a conta logada na Play Store **do aparelho**. Aceitar numa conta com o celular logado em outra faz a ficha não aparecer, sem erro nem aviso — e some da contagem de opted-in igual a uma desistência |
| progresso anterior não pago retroativamente | **decidido — sem código** | A pendência vinha redigida em termos de população ("quem já concluiu lições nunca receberá XP"). A regra foi confirmada no código, o que prova o **mecanismo** e nada sobre existir alguém excluído. O registro de builds do EAS mostra **um único build em toda a história do projeto** (2026-03-30, iOS simulador, perfil de desenvolvimento, distribuição interna, do commit `128d70b`): nenhuma distribuição, nenhum usuário. A população afetada é o aparelho do dono. Decisão em [ADR-2026-07-31](adr/ADR-2026-07-31-progresso-anterior-nao-retroativo.md): sem backfill; o risco real é a primeira mudança de regra de gamificação **depois** de haver testadores com progresso |
| conta de usuário e premium | **decidido — sem código** | O dono questionou o posicionamento "sem conta" da ficha, por conta da assinatura premium. Medido: o `AuthService` e o bloco de login do `ProgressScreen` são **inertes no build distribuído** (condicionados a `isApiConfigured()`, e nenhum perfil define `EXPO_PUBLIC_API_BASE_URL`), há `UpgradeInterestService`, uma flag `ENABLE_REVENUECAT` com **zero consumidores** e **nenhuma dependência de billing** instalada. Decisão em [ADR-2026-07-31](adr/ADR-2026-07-31-conta-e-premium.md): v1.3 lança sem conta, premium na v1.4. **Fica em aberto e precisa ser decidido antes do primeiro assinante:** Play Billing puro (sem conta própria, suficiente enquanto for só Android) ou conta própria + billing |
| cópia de loja — recontagem dos limites | **corrigido** | Três contagens de caracteres estavam erradas na fonte: `Radiant` marcado **13** quando são **7**, `Radiant — Radiologia` marcado **21** quando são **20**, `Radiant: Estudar Radiologia` marcado **28** quando são **27**. As demais (27, 29, 28, 70, 74, 95) conferiram. O `21` chegou a ser propagado para o runbook na correção da manhã desta data e foi consertado no mesmo run — número em documento não decai como estado: nasce errado e ganha autoridade por repetição |
| descrição longa em Markdown num campo que não renderiza | **corrigido** | a fonte está em Markdown e o runbook mandava colar "a seção inteira" no campo do Play, que **não renderiza Markdown** — a ficha pública sairia com os `**` literais. Fonte e runbook passaram a exigir a conversão para texto limpo (1605 caracteres) |
| ficha da loja preenchida | **FEITO** | nome, descrição breve (70/80), descrição completa (1605/4000), ícone 512, feature graphic e os seis screenshots enviados. A descrição precisou ser **convertida de Markdown para texto limpo** — o campo do Play não renderiza Markdown |
| Conteúdo do app (Data Safety, classificação, público-alvo) | **relatado FEITO pelo dono** | "totalmente classificado no console, não tem bloqueios" (2026-07-31). Não medido por mim — a autoridade é a seção "Visão geral da publicação" do console |
| track de teste fechado | **criado — chama `alpha`** | nome atribuído pelo próprio Play Console ("Teste fechado - Alpha"). É o valor real de `--track`; o `eas.json` mantém `track: "internal"`, deliberado para o primeiro upload de validação de pipeline |
| primeiro build Android da história | **FALHOU, causa raiz encontrada e corrigida** | `eas build --platform android --profile production` (build `fdd29bec`), do commit `f2fddcb`. O EAS reportou `EAS_BUILD_UNKNOWN_GRADLE_ERROR` — fronteira da ferramenta, não a causa. Reproduzido localmente: a task de upload de source maps do `@sentry/react-native` falha com `error: An organization ID or slug is required`, porque o `app.json` declara o plugin sem `organization`/`project`, o `sentry.properties` gerado cai em variáveis de ambiente, e **nenhum perfil do `eas.json` as definia**. Corrigido com `SENTRY_DISABLE_AUTO_UPLOAD: "true"` em `e2e-test`, `preview` e `production`; verificado: task `SKIPPED`, `BUILD SUCCESSFUL`. Ver [`EAS_SUBMIT_SETUP.md`](store/EAS_SUBMIT_SETUP.md) |
| por que o gate local não pegou | **explicado** | o `BUILD SUCCESSFUL in 48s` de 2026-07-30 foi feito com o bundle **em cache**, e a task de upload do Sentry só roda quando o bundle é regerado. O EAS constrói sempre do zero, então foi o primeiro a expor a falha. **Um verde local com cache não é evidência sobre um build limpo** — a armadilha do cache do Gradle já estava registrada neste repositório e cobrava aqui |
| keystore de assinatura Android | **criada** | gerada pelo EAS no build que falhou e **persiste no servidor** — é ela que assinará todas as atualizações do app. Não se refaz no próximo build |
| tamanho do archive enviado ao EAS | **anomalia aberta** | 856 MB, 4m09s de upload, contra **24 MB em 557 arquivos** de conteúdo não ignorado em todo o repositório. Não existe `.easignore`. **Não foi estabelecido** que isso causou a falha — a causa é o Sentry — mas é custo real por build e permanece a investigar |
| `versionCode` — quem governa | **descoberto** | `cli.appVersionSource: "remote"` + `autoIncrement` fazem o **EAS manter o contador no servidor**. O `app.json` dizia `2` e o build saiu `3`. O `android.versionCode` do `app.json` **virou decorativo**: editá-lo não muda o AAB, e lê-lo para responder "qual é o versionCode" dá resposta errada. O valor real sai de `eas build:list` |
| service-account key no caminho crítico | **corrigido** | ela **não** é pré-requisito do primeiro upload: o `.aab` pode ser arrastado direto no console. O `eas submit` é automação. Isso tira a chave do caminho crítico do relógio de 14 dias |
| passivo de lint (B7) | **65 → 11, meta era ≤20** | Os **62** de 30/07 já não valiam: recontados, eram **65**. Medindo por regra **e por arquivo**, **40 não eram dívida** — 37 `no-require-imports` dentro de fábricas `jest.mock()`, onde `require()` é obrigatório pela içagem do Jest, e 3 em arquivos que se declaram gerados (`storybook.requires.ts`, `.expo/types/router.d.ts`). Corrigidos os 16 mecânicos; o `eslint.config.js` passou a ignorar os gerados e a desligar a regra **só em `**/*.test.ts(x)`**, com a razão no próprio arquivo — a regra segue valendo em produção. Restam **9** `exhaustive-deps` (exigem julgamento por caso) e **2** diretivas `eslint-disable` órfãs. Alargar `writePolicy` para o `eslint.config.js` foi transação própria e anterior |
| PR #39 do site (páginas legais) | **ainda draft** | terceira remedição nesta data, sem alteração desde 2026-07-29 17:42Z. Segue como o maior risco por unidade de esforço: as URLs já estão coladas na ficha do Play e sobrevivem apenas por FTPS |
| D4 — gate editorial, triado | **medido** | Os **42** `formatNeedsReview` são **7 conceitos × 6 formatos** (mesmo conjunto nos seis, motivo vazio nos 42 — estado herdado, não julgado por item). Os 7 conceitos derivam da proporção de excertos sinalizados (todos ≥33%; todos os 9 aprovados ≤25%). A unidade atômica são **30 excertos**, e **8 moram em conceitos aprovados**, invisíveis a uma triagem na camada dos bundles. A dúvida **não é editorial**: vem do classificador `deterministic-keyword-v1` caindo em *fallback* — 13 dos 30 sem sinal nos três níveis da taxonomia, confiança média 0,52 contra 0,91 dos aprovados. Triagem completa em [`docs/content/2026-07-31-d4-triagem-editorial.md`](content/2026-07-31-d4-triagem-editorial.md) |
| verificação de acesso a dispositivo da conta Play | **CONCLUÍDA** | relatada pelo dono em 2026-07-31. Exigia aparelho Android real (o emulador local é imagem "Google APIs" sem Play Store) e era o bloqueio que impedia a publicação por qualquer caminho. Com ela fechada, o que separa o app da produção é o closed test: AAB no track `alpha`, ≥12 testadores opted-in e 14 dias consecutivos |
| prova do *themed icon* do Android 13+ | **segue pendente** | mesma exigência de aparelho real, e o aparelho usado na verificação já não está disponível. **Não bloqueia o closed test** — é ressalva de qualidade. Fecha com uma captura da gaveta de apps com ícones temáticos ligados, sobre o APK de release instalado por `adb` |
| smoke público da API | FAIL esperado | `/health` e `/ready` seguem em **502**, remedidos nesta data. Inalterado, fora do caminho crítico |
| PR #39 do site (páginas legais) | **ainda draft** | remedida nesta data: `OPEN`, `MERGEABLE`, `mergeStateStatus CLEAN`, **`isDraft true`**, sem alteração desde 2026-07-29 17:42Z. Draft bloqueia merge independentemente de `mergeable`. As páginas seguem no ar por FTPS; um redeploy da branch principal do site pode removê-las |

## Bloqueios do lançamento

O caminho crítico é **administrativo/loja** e quase todo ação do usuário — mas
**resta um bloqueio de engenharia**, descoberto depois da primeira redação desta
seção: os **assets de ícone e de loja** (§4). Sem eles a ficha do Play não fecha,
e `icon.png` como está iria para a App Store com a grade de construção visível.
É trabalho meu, em execução, e não depende de conta nem de testadores:

1. ~~**Verificação da conta Play** — precisa de um **aparelho Android real**.~~
   **CONCLUÍDA em 2026-07-31**, relatada pelo dono. Era o item que bloqueava a
   publicação independentemente de qualquer teste: sem ela, nenhum caminho levava à
   produção. Deixa de ser bloqueio.
2. ~~**Hospedar** a política de privacidade e a página de suporte no domínio.~~
   **RESOLVIDO em 2026-07-29** — ver §5. Sobra apenas colar as duas URLs nos
   consoles, o que faz parte do item 3.
3. **Criar o app** no Play Console (`com.ascendcreative.radiant`) + preencher
   fichas com o material já preparado; gerar a **service-account key** do Play.
4. **Recrutar ≥12 testadores** para o closed test — o item de **maior latência**
   (relógio de 14 dias); kit de convite pronto.
5. **Sessões humanas de acessibilidade**: VoiceOver (B4) e TalkBack Android (C5).
6. **Builds de produção** (F1 iOS/TestFlight, F2 Android/AAB) — disparados quando
   as contas existirem (evita travar `runtimeVersion` antes da hora).
7. **API pública inativa** (502) — ADR de estratégia pendente (decisão de produto,
   fora do caminho crítico do lançamento local-first).
8. ~~**Assets de ícone e de loja** — único bloqueio de engenharia restante.~~
   **RESOLVIDO em 2026-07-29** (§4): as 6 tasks do plano do ícone entregues,
   contrato em 11/11 àquela data (hoje **14/14**) dentro do `npm run quality`,
   L2.7/E1 fechadas no lado Android.
   **Não há mais bloqueio de engenharia no caminho crítico.** Em 2026-07-30
   fecharam: a ressalva dos screenshots com XP zerado (§4, ressalva 1), o **lado
   iOS de E1** nos dois buckets (6,7" e 6,5") e o achado dos cards
   `PRECISÃO`/`TÓPICOS`. A redação anterior dizia "resta uma única pendência de
   engenharia" e **se contradizia** com a linha "screenshots de iPhone para a App
   Store — PENDENTE" da tabela de verificações desta mesma data. Eram **duas**.
   A segunda foi **fechada em 2026-07-30**: os doze PNGs dos buckets 6,7" e 6,5"
   existem como assets e estão travados no contrato (11 → 14 testes).

   **Resta uma pendência de engenharia** — e agora o número foi obtido por
   varredura, não herdado: a **prova do *themed icon* do Android 13+**, que exige
   aparelho real e não pode ser fechada neste host.

   *Um quantificador ("única", "todas", "nenhuma") só se verifica por varredura;
   verificar cada fato citado não verifica a agregação sobre eles, e um
   superlativo errado custa mais que um fato errado porque encerra a busca.*

## Próxima sequência sugerida

Roadmap de lançamento vigente:
[2026-07-27](plans/2026-07-27-radiant-launch-roadmap.md), e o recorte focado
Android em
[2026-07-29 — plano de closed testing](plans/2026-07-29-android-closed-testing-plan.md).
Ordem de valor: (a) criar/verificar a conta Play e **iniciar o recrutamento de
testadores hoje**; (b) hospedar as duas páginas; (c) fechar as sessões humanas de
a11y; (d) disparar builds + `eas submit` quando as contas estiverem prontas.

## Coordenação entre múltiplas IAs

Contrato de sinalização em [`AGENTS.md`](../AGENTS.md): antes de começar, checar o
que já foi feito; ao terminar, sinalizar no mesmo run que entrega o trabalho.
Trabalho não sinalizado é tratado como não feito pelas próximas sessões.

### 6. Varredura de problemas — o que foi encontrado

Uma varredura fora do caminho crítico, em 2026-07-29, encontrou o seguinte.

**O `AppButton.tsx` commitado reprova um contrato que está no gate.** As três
asserções do `reanimated-easing-contract` — que roda dentro do `npm run quality`
— falham contra a versão em `HEAD`. O `npm run quality` só passa hoje porque a
correção **não commitada** está na árvore de trabalho. A causa é real:
`src/ui/motion.ts` importa `Easing` de **`react-native`**, então o `easing.out`
usado ali é um easing do RN sendo passado para um worklet do Reanimated —
exatamente o defeito que o contrato existe para impedir. A correção usa
`Easing.bezier(0.22, 1, 0.36, 1)`, valor **idêntico** ao token, sem mudança
visual. **Isto torna os arquivos não commitados obrigatórios, não descartáveis.**

**Os quatro arquivos parados desde 26–27/07 foram adotados** como trabalho
válido, após leitura do diff:

| Arquivo | O que faz | Veredito |
| --- | --- | --- |
| `AppButton.tsx` | easing do Reanimated no lugar do easing do RN | **obrigatório** — sem ele o gate fica vermelho |
| `PushService.ts` | `expo-notifications` vira import dinâmico preguiçoso, com guardas de `ENABLE_PUSH` | aprovado com ressalva |
| `config/push.ts` | `ENABLE_PUSH` passa a ler do ambiente (default `true`) | par do anterior |
| `JourneyHomeScreen.flow.test.tsx` | folga de 1000→4000 ms nas duas primeiras esperas | estabilidade de teste, custo ambiental documentado no próprio arquivo |

*Ressalva do `PushService`:* o `setNotificationHandler` saiu do carregamento do
módulo para a primeira chamada. Ele controla a apresentação em foreground; com
`PUSH_SHADOW_MODE: true` nada é agendado e isso é inócuo hoje, mas se o shadow
mode for desligado o handler só existirá se algum método de push tiver rodado
antes.

**`EXPO_PUBLIC_ENABLE_PUSH` não era declarado em nenhum perfil de distribuição.**
O valor vinha de um default implícito. **Corrigido:** declarado como `true` em
`production` e `preview` no `eas.json`, preservando o comportamento atual.
`e2e-test` declara `false`; os perfis de desenvolvimento seguem no default.

**Uma tela inteira viaja no bundle sem nunca renderizar em produção.** A aba Home
é `ENABLE_LEARNING_ROAD ? <JourneyHomeScreen /> : <HomeScreen />`, e a flag tem
default `true` e está ligada em produção. `HomeScreen` é o fallback morto — com
três TODOs de "ligar contadores reais" e sua própria suíte de testes sendo
mantida. **Decidido em 2026-07-31 (opção A), execução pós-beta.** Apagar a `HomeScreen` e a
flag `ENABLE_LEARNING_ROAD`, **mantendo `/review` viva**. Plano em
[`2026-07-31-remover-homescreen-morta.md`](superpowers/plans/2026-07-31-remover-homescreen-morta.md).

Duas premissas herdadas caíram na medição desta data: (a) `ReviewScreen` **não é
protótipo** — o `useReview` está ligado a `SpacedRepetitionService`,
`LessonCatalogService`, `GamificationService`, fila de sync e telemetria; é uma
implementação completa e inalcançável, e o `features/review/data/mockData.ts` é
órfão, sem referência na tela nem no hook; (b) o wizard `src/app/onboarding/*` que a
B6 manda remover junto **já não existe** — sobrou o `OnboardingService`, que tem um
segundo consumidor vivo em `IosHomologationService.ts:62` e não morre com a
`HomeScreen`.

Por isso `/review` fica. O gatilho para revisitar é explícito: se o feedback do beta
pedir revisão avulsa, ela vira candidata a **ativação**, não a deleção. E o valor
real da limpeza não é a tela — é a flag, declarada com o mesmo valor nos quatro
perfis do `eas.json` mais o default, fingindo uma configurabilidade que não existe.
A execução é pós-beta porque toca o binário e obriga a novo build e novo E2E, na
única janela em que a estabilidade é o requisito.

*Acoplamento a registrar antes de qualquer deleção* (descoberto em 2026-07-29, ao
investigar a ressalva 1 da §4): essa tela é hoje o **único** `router.push('/review')`
do código. Apagá-la remove a última rota para a tela dedicada de revisão — que já
era inalcançável em produção por esse mesmo motivo. A revisão que o usuário
alcança é outra implementação, a da trilha, e ela não passa por `/review`.

**Passivo de lint: 62 warnings, 0 erros.** 37 `no-require-imports`, 9
`exhaustive-deps`, 6 `array-type`, 5 `no-unused-vars`, 4 `import/first`. Só 10
são auto-corrigíveis. **Não corrigido.**

**`npm audit`: 52 vulnerabilidades, 2 críticas — nenhuma no app.** As duas
críticas foram rastreadas: `shell-quote` vem de `react-native → react-devtools-core`
e `tar` vem de `eas-cli` e `@expo/cli`. São ferramentas de build e
desenvolvimento; não entram no bundle distribuído.

## Árvore de trabalho

Todo o trabalho está **commitado** na branch `codex/wave1-hardening-api-smoke`.
Em 2026-07-29, sete commits (`297b2d4`, `ddb4d85`, `63b0dab`, `27302d9`,
`e02e158`, `d9529fe` e o de assets), com os quatro arquivos de 26–27/07
**adotados** no primeiro deles — ver §6.

Em **2026-07-30**, mais **nove** — cinco do laço de gamificação e quatro da
sessão da tarde, que obteve a evidência em device e fechou E1 (§4, ressalva 1):

| Commit | O quê |
| --- | --- |
| `ab40bb1` | `LessonOutcomeService` — premiação por tipo de nó e registro do recall |
| `df33be8` | paridade de sincronização, com falha de API não derrubando a conclusão |
| `91dfb5d` | `LessonFlowScreen` chama o serviço **antes** de `markNodeCompleted` |
| `056ffe1` | cobre a corrida de estado que os testes anteriores não pegavam |
| `f7f36e8` | spec, plano e este status |
| `621b3a7` | corrige o que a sessão da manhã tornou falso no status e no roadmap |
| `233f4b0` | `LearningAttemptsRepository` — liga `PRECISÃO` e `TÓPICOS` a dado real |
| `f7b602a` | captura de loja: guarda de visibilidade → scroll fixo (oclusão do CTA) |
| `873c81a` | E1 fechado nas duas plataformas e a correção do bloqueio de JDK inexistente |
| `5b7c6a0` | regenera os screenshots publicáveis e recontagem do que envelheceu |
| `98261a4` | ancora a contagem de commits a um hash em vez de deixá-la nua |
| `7f72973` | runbook do Play — remove os dois bloqueios que já não existiam |
| `6a9f9d6` | normalizador aprende as regras da App Store; para de apagar o destino antes de validar |
| `6f0009f` | doze screenshots de iPhone + contrato de assets de 11 para 14 testes |

E em **2026-07-31**:

| Commit | O quê |
| --- | --- |
| `2b2b85e` | instrução de segurança apontava o `.gitignore` errado antes de baixar a chave |

**Nada foi empurrado.** A branch estava **109 commits** à frente de `origin/main`
**medidos em `873c81a`** — ancorado num hash de propósito.

Uma contagem de commits escrita como fato solto **se auto-invalida no ato**: o
commit que a grava incrementa aquilo que ela mede. Foi o que aconteceu duas
vezes seguidas aqui — a redação anterior dizia 105 e já nascia errada, e a que a
corrigiu para 109 virou 110 no mesmo instante em que foi commitada. Ancorada a
um hash, a frase permanece verdadeira para sempre. Para o valor de agora:

```sh
git rev-list --count origin/main..HEAD
```

A regra vale para todo número derivado do próprio repositório: ou se ancora à
revisão em que foi medido, ou se troca pelo comando que o recalcula. O que não
serve é um número nu — ele não decai como estado, ele nasce errado e ganha
autoridade por repetição.

Os commits foram ordenados para que **nenhum estado intermediário deixe o gate
vermelho**: os órfãos primeiro, porque o `AppButton` corrige o contrato de easing;
o contrato de assets só entra no `quality` no commit seguinte, no mesmo commit em
que os oito assets passam a existir. O `npm run quality` foi rodado **depois** de
tudo commitado e sai `0` — o verde agora é propriedade do repositório, não da
árvore de trabalho de quem rodou.

Seguem não rastreados, **intocados e sem decisão**, por não pertencerem a esta
execução: `.impeccable/`, `New Layout/`, `docs/NOVO_VPS.md`, os dois planos
`2026-07-23-radiant-pending-resolution-*` e
`docs/superpowers/plans/2026-04-30-design-system-final.md`.
