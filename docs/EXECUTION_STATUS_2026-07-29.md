# Radiant — Execution Status (2026-07-29)

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

**As 6 tasks do plano foram concluídas nesta data.** O contrato de assets está em
**11/11** e roda dentro do `npm run quality`; o bloqueio de engenharia do
lançamento foi encerrado. Evidência em device em
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
  (roadmap §10). Hoje trava **oito** assets e roda **11/11**.

**Limite explícito do contrato:** ele pega violação de especificação, não arte
inadequada — **não** teria pego a grade de construção, que passa em qualquer
verificação geométrica. O que pega arte errada é evidência em device somada a
revisão humana.

**A ficha do Play exige três assets gráficos, não dois.** A task **L2.7** do
[plano de closed testing](plans/2026-07-29-android-closed-testing-plan.md)
listava apenas screenshots e feature graphic; faltava o **ícone 512×512** (PNG
32-bit com alpha, ≤ 1024 KB). Corrigido no plano e **os três existem** desde esta
data — L2.7 concluída.

**Duas ressalvas abertas, ambas decisão do dono:**

1. **Screenshots com progresso zerado.** O flow percorre lição, checkpoint e uma
   segunda lição antes de capturar a home, exatamente para não mostrar zeros — e
   ainda assim o resultado exibe `XP total: 0` e `REVISÕES 0`. São honestos,
   válidos e passam no contrato, mas são vitrine fraca. **A causa do XP não
   acumular não foi investigada.**
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

## Bloqueios do lançamento

O caminho crítico é **administrativo/loja** e quase todo ação do usuário — mas
**resta um bloqueio de engenharia**, descoberto depois da primeira redação desta
seção: os **assets de ícone e de loja** (§4). Sem eles a ficha do Play não fecha,
e `icon.png` como está iria para a App Store com a grade de construção visível.
É trabalho meu, em execução, e não depende de conta nem de testadores:

1. **Verificação da conta Play** — precisa de um **aparelho Android real** (o
   emulador não serve).
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
   contrato 11/11 dentro do `npm run quality`, L2.7/E1 fechadas no lado Android.
   **Não há mais bloqueio de engenharia no caminho crítico.** Restam duas
   ressalvas não bloqueantes (screenshots com XP zerado e a prova do themed icon)
   e o **lado iOS de E1**, que continua pendente.

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
mantida. **Não corrigido**, decisão pendente.

**Passivo de lint: 62 warnings, 0 erros.** 37 `no-require-imports`, 9
`exhaustive-deps`, 6 `array-type`, 5 `no-unused-vars`, 4 `import/first`. Só 10
são auto-corrigíveis. **Não corrigido.**

**`npm audit`: 52 vulnerabilidades, 2 críticas — nenhuma no app.** As duas
críticas foram rastreadas: `shell-quote` vem de `react-native → react-devtools-core`
e `tar` vem de `eas-cli` e `@expo/cli`. São ferramentas de build e
desenvolvimento; não entram no bundle distribuído.

## Árvore de trabalho

Todo o trabalho desta data está **commitado** na branch
`codex/wave1-hardening-api-smoke`, em cinco commits (`297b2d4`, `ddb4d85`,
`63b0dab`, `27302d9`, `e02e158`). Os quatro arquivos de 26–27/07 foram **adotados**
no primeiro deles — ver §6. **Nada foi empurrado**; a branch está 99 commits à
frente de `origin/main`.

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
