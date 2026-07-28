# Radiant — Execution Status (2026-07-28)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app abre,
oferece catálogo local, registra progresso e permite revisão mesmo quando a API
remota está ausente.

Este documento substitui [`EXECUTION_STATUS_2026-07-27.md`](EXECUTION_STATUS_2026-07-27.md)
como estado canônico; o snapshot anterior permanece histórico. Ele registra duas
mudanças de estado operacional que o de 07-27 não continha: (1) a entrega da
**identidade de design galaxy dark** em sete frentes, ainda não sinalizada em
status/roadmap, e (2) o **congelamento de versionamento na 1.3.0** (task D5 do
roadmap de lançamento).

A API pública em `api.radiant.ascendcreative.com.br` permanece **inativa** (HTTP
502). Esta execução não tocou VPS, DNS, proxy, banco, deploy ou serviço remoto —
foi trabalho de design de app, documentação e versionamento.

## O que mudou desde 2026-07-27

### 1. Identidade de design galaxy dark entregue em sete frentes

O trabalho de design que estabeleceu a identidade visual única do app foi
entregue em sete commits, todos com `npm run quality` verde (9/9 validadores) e
verificação visual no simulador iOS. Nenhum estava sinalizado no status ou no
roadmap de 07-27, então até aqui era tratado como não feito pelas próximas
sessões. A data de commit de cada frente está registrada abaixo com honestidade
(três landaram no fim de 07-27; quatro em 07-28), mas eles formam uma única
entrega de sistema de design.

| # | Commit | Data | Frente |
| --- | --- | --- | --- |
| 1 | `e6bcf9d` | 2026-07-27 | Identidade visual única galaxy dark — ver [ADR da identidade galaxy dark](adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md). |
| 2 | `fb1af1f` | 2026-07-27 | Gamificação com dados reais: fim das missões, do relógio e do XP fake — os números vêm do progresso real. |
| 3 | `94a28e4` | 2026-07-27 | Copy pt-BR unificada e voz humana em todo o app. |
| 4 | `fd00891` | 2026-07-28 | Escala tipográfica única na Sora + contraste WCAG AA, travado em `radiant-app/scripts/contrast-contract.test.mjs` (ligado ao `npm run quality`). |
| 5 | `a371641` | 2026-07-28 | Balão de fala quebrando só em limite de palavra + `ProgressRing` que renderizava vazio no hero. |
| 6 | `581c8e5` | 2026-07-28 | Haptics, Pixel reagindo a acerto/erro, celebração de fim de quiz, reduced motion em Confetti/Starfield/Pixel, `AnimatedProgressBar` e `AnimatedCounter`. |
| 7 | `44bda6f` | 2026-07-28 | Portar o loop central (fluxo de lição + card da pergunta) para galaxy — P0 da 2ª auditoria de design. |

Duas auditorias de design existem e devem ser lidas antes de propor trabalho
novo de UI: `.impeccable/critique/2026-07-27T22-57-41Z__radiant-app.md` (16/40)
e `.impeccable/critique/2026-07-28T12-42-20Z__radiant-app.md` (17/40, mais
profunda). A nota subiu pouco porque a 2ª rodada alcançou telas que a 1ª nunca
inspecionou; os P0 dela já foram corrigidos em `44bda6f`. O backlog restante das
auditorias está na seção "Próxima sequência sugerida".

### 2. Versionamento congelado na 1.3.0 (D5)

A [ADR da home de produção](adr/ADR-2026-07-27-learning-road-como-home.md) fixa a
Learning Road como home oficial da v1.3, e o trabalho de design acima justifica o
incremento de minor. `radiant-app/package.json` e `radiant-app/app.json`
passaram de **1.2.1 para 1.3.0**, alinhados entre si (a linha canônica de versão
segue sendo o par package.json/app.json, aprendizado validado de 2026-07-26).
`ios.buildNumber` foi de `"1"` para `"2"` e `android.versionCode` de `1` para
`2`.

A política de `runtimeVersion` continua `appVersion` — a runtime passa a ser
`1.3.0` junto com a versão. **Nenhum build foi publicado ainda**, então esta
mudança de versão ainda é livre; a partir do primeiro build de F1/F2 ela deixa de
ser (alerta de OTA/runtime do roadmap). Com isso a task **D5** do
[roadmap de lançamento](plans/2026-07-27-radiant-launch-roadmap.md) fica atendida
na parte de manifesto; a documentação da política de `runtimeVersion` já existia
no roadmap e no checklist de release.

## Verificações nesta data

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint, typecheck, contratos estruturais (Storybook, Maestro, easing, clearance, contraste, paleta), **suíte Jest** e visual QA estrito — 19,5s, gate completo num comando só desde o item 7 |
| testes do app (`npm test`) | PASS | suíte Jest; roda como validador `app-test` do Loop **e** dentro do `quality` |
| contrato de documentação | PASS | executado a cada run — desde 2026-07-28 o validador roda também `docs-contract.test.mjs`, a guarda que exige o status mais novo entre os documentos governados |
| validadores do Loop | PASS | 9 de 9 no run desta data |
| smoke público da API | FAIL esperado | `/health` e `/ready` em HTTP 502 (sem reexecução nesta data; estado inalterado) |
| E2E boot (dev-client, iOS sim) | PARCIAL | boot → "Foco de hoje" e `/onboarding` → Unmatched Route verificados em runtime no código atual via Expo Go. **Não** é pass de `preview` (build `preview` `environment-blocked`, task B0.1) — evidência em [`docs/evidence/2026-07-28-boot-to-home-devclient.md`](../radiant-app/docs/evidence/2026-07-28-boot-to-home-devclient.md) |

## Bloqueios do app (inalterados desde 07-27)

Os bloqueios de lançamento não mudaram nesta data; o detalhe de cada um está no
[status de 07-27](EXECUTION_STATUS_2026-07-27.md) e no
[roadmap de lançamento](plans/2026-07-27-radiant-launch-roadmap.md):

1. **Gate 2 sem aprovação.** Resta o item 2 (anúncio único no VoiceOver, exige
   sessão humana com áudio — task B4). Os itens 1, 3, 4 e 5 têm evidência.
2. **E2E não reexecutado sob perfil de produção** (task B0.1) — `environment-blocked`:
   o build `preview`/`e2e-test` do código atual não é produzível nesta máquina
   (sem CocoaPods; EAS cloud vedado). Em 2026-07-28 o código atual foi verificado
   sob **dev-client** (Expo Go): boot → "Foco de hoje" e `/onboarding` morto
   (Unmatched Route) — o que **não** promove a `passed`. Evidência em
   [`docs/evidence/2026-07-28-boot-to-home-devclient.md`](../radiant-app/docs/evidence/2026-07-28-boot-to-home-devclient.md).
3. **Android sem projeto nativo** (`expo prebuild` nunca executado).
4. **Nó de reward sem cobertura E2E** (task B5).
5. **API pública inativa** — ADR de estratégia da API pendente (decisão de
   produto).
6. **Contas de loja inexistentes** (Onda A).

## Próxima sequência sugerida

Em ordem de valor, do backlog da 2ª auditoria de design. Os itens 1 e 4 foram
entregues em 2026-07-28 (marcados abaixo); os demais seguem abertos.

1. ~~**Guarda anti-regressão de identidade:** proibir `import { colors }` (paleta
   clara) em `src/features/**` e `src/app/**`.~~ **Concluída em 2026-07-28**
   (commit `3b367db`). Teste de contrato estrutural
   `radiant-app/scripts/identity-palette-contract.test.mjs`, ligado ao
   `npm run quality`, falha se qualquer arquivo de `features/**` ou `app/**`
   importar a paleta clara `colors` de `ui/theme` (`galaxyColors`/`semanticColors`
   seguem permitidos). Fecha o ponto cego do contraste, que valida tokens
   **isolados**, não composições. Provado que morde: apontou os 2 únicos
   ofensores (`PaywallOfferCard` e o `StartupScreen` de `app/_layout`), ambos já
   em telas galaxy, que foram migrados para `galaxyColors` no mesmo commit.
2. **Migrar telas para `typography.*`:** ~55% do dimensionamento de texto ainda
   usava `fontSize` numérico (153 ocorrências contra 125 usos de token), então boa
   parte do app renderia em fonte de sistema, não em Sora. **Telas vivas
   concluídas em 2026-07-28:**
   - ✅ `MissionsScreen` (commit `8b974e5`) e ✅ `ProgressScreen` (commit
     `d6e9809`) migradas (12 e 18 estilos), **verificadas por screenshot no
     simulador** (antes/depois); zero `fontSize` numérico restante nelas.
   - ✅ `GalaxyMapScreen` (4), `GalaxyInteriorScreen` (6) e
     `PlanetInteriorScreen` (11) migradas nesta data, também **verificadas por
     screenshot antes/depois no simulador** (mapa, interior da galáxia e trilha
     do planeta). Snap de fora-de-escala: títulos de tela 20/22 → `h3` (24),
     rótulos uppercase 8/10/13 → `label` (11), textos de 10–12 em caixa normal →
     `micro`, 13 → `caption`, 16 → `bodyRegular`.
   - **Aprendizado:** o token `typography.label` tem `textTransform: 'uppercase'`
     — use-o só em rótulos maiúsculos; para 11–12px em caixa normal use
     `micro`/`caption` (senão o texto vira maiúscula indevida). Snap de tamanhos
     fora-de-escala documentado nos commits.
   - **Convenção fixada:** glifos de ícone (chevron `‹`, `✓`) e emojis **não**
     recebem token — são desenho, não texto, e a métrica da Sora deslocaria o
     alinhamento. São as únicas ocorrências de `fontSize` numérico que sobram nas
     telas migradas.
   - **Efeito colateral aceito:** a Sora é mais larga que a fonte de sistema no
     mesmo corpo, então rótulos curtos de nó (`maxWidth` 90–120) passaram a
     quebrar em duas linhas com mais frequência. O badge "EM ANDAMENTO" do mapa
     subiu de 8 para 11px: ganho real de legibilidade, ao custo de a hierarquia
     contra o nome da galáxia passar a ser por cor/borda, não por tamanho.
   - ⏳ **Resta** o texto de `HomeScreen` e do onboarding — ver o item 6, que
     corrige a leitura de "código morto".
3. ~~**Passo "Verificar" antes de commitar a resposta do quiz:** hoje tocar numa
   alternativa já submete e já custa uma vida, sem confirmação nem desfazer
   (`useQuiz.ts:99-126`), e a perda do coração não produz sinal visual ou tátil
   (`HUD.tsx:32-48`).~~ **Redirecionado e entregue em 2026-07-28** — o achado era
   verdadeiro no código e irrelevante no app alcançável. Quatro fatos verificados
   antes de escrever qualquer linha:
   - **`/quiz` é inalcançável pela UI.** Nada no app navega para a rota; só
     `src/app/_layout.tsx` a declara, e um deep link a abriria. `QuizScreen` e
     `useQuiz` estão no mesmo estado do onboarding (ver item 6).
   - **O loop vivo já tinha o passo de confirmação.** As lições vão por `/learn`
     → `LessonFlowScreen` → `MultipleChoiceStepRenderer`, onde tocar numa opção
     só seleciona e o "Continuar" do rodapé é que avança — exatamente o padrão
     que a auditoria pedia. É o caminho que o Maestro exercita.
   - **O defeito real estava na outra metade da queixa:** `locked={Boolean(selectedOptionId)}`
     congelava a escolha no primeiro toque, então quem errasse o alvo não podia
     trocar antes de confirmar (a dica de a11y dizia "Resposta bloqueada após a
     seleção"). **Corrigido:** a alternativa é trocável enquanto o passo está na
     tela, o `locked` saiu do renderer e as dicas de a11y passaram a descrever o
     estado real ("Selecionada. Toque em outra alternativa para trocar antes de
     continuar"). O contrato do Maestro, que travava a assinatura antiga
     (`disabled: locked`), passou a proibir o oposto — reintroduzir `disabled`
     ali seria voltar a impedir a troca. Coberto por
     `LessonFlowScreen.flow.test.tsx` (novo, 2 casos: a troca é possível; o que
     vale é a última seleção) e verificado no simulador com Maestro: errar →
     corrigir → "Resposta correta".
   - **Nenhuma vida é perdida no app alcançável.** `GamificationService.loseHeart()`
     só é chamado em `useQuiz.ts:119`, então os corações do HUD nunca descem no
     caminho vivo. O sinal visual de perda de vida **não foi implementado** por
     isso: não haveria o que sinalizar. Levar a economia de vidas para o
     lesson-flow é decisão de produto em aberto.
4. ~~**A11y:** o HUD lê "coração vermelho" 5× em 5 telas; 21 componentes com zero
   props de a11y; nenhum `accessibilityRole="header"` no app inteiro.~~
   **Concluída em 2026-07-28** (commits `e8aec51`, `68d9196`, `7d9a374`):
   - **HUD** (`src/ui/components/HUD.tsx`, presente em 9 telas): vidas viram um
     rótulo único "`<n>` de `<m>` vidas" (antes 5× "coração vermelho"), pills de
     XP/streak rotulados e emoji decorativo suprimido; contrato travado em
     `HUD.test.tsx`.
   - **`accessibilityRole="header"`:** 13 no total, onde antes havia **zero** —
     2 headers compartilhados (`JourneyMapHeader`, `LessonFlowProgressHeader`) e
     11 títulos de tela (Progress, Missions, GalaxyInterior, GalaxyMap,
     PlanetInterior, Checkpoint, Reward, Quiz, 2× Review, JourneyHome).
   - **"21 componentes sem a11y":** survey por-ocorrência mostrou que o número
     estava superestimado — `DecorativeIcon` já se esconde do leitor, o mascote
     `PixelIllustration` já tem `accessibilityLabel`, e não há botão só-de-ícone
     sem label. A única `<Image>` sem descrição do app era o `LessonVisualPanel`,
     rotulada agora.
   - **Pendente:** o `TouchableOpacity` "Agora não" do `PushOptInCard` sem
     `accessibilityRole="button"` (não tocado por estar na área de push que outra
     sessão edita) e o item 2 do Gate 2 (sessão humana de VoiceOver, task B4).
5. ~~**Assets:** ~3,0 MB duplicados — os 6 estados do mascote são o mesmo arquivo
   (md5 idêntico), `pixel_core.png` tem 2,16 MB e serve sm/md/lg, e há cópia
   byte-a-byte em `Mascote.png` na raiz (untracked).~~ **Concluída em 2026-07-28**
   — **2,9 MB removidos** do bundle (3,2 MB → 268 KB na pasta de personagens):
   - **Os 6 "estados do mascote" não eram do mascote.** Eram `lux_*.png` em
     `src/ui/characters/assets/lux/`, cujo próprio README dizia "retained only as
     historical reference / no longer the active mascot source of truth", com
     **zero referências no código** — nenhum `require`, nenhum manifesto. 6
     arquivos idênticos de 172 KB (md5 `393f26ed…`) + README, ≈1,0 MB, apagados.
     O git preserva o histórico, que é o que "referência histórica" significa num
     repositório versionado.
   - **`pixel_core.png` reexportado de 1024×1536 (2,2 MB) para 576×864 (257 KB).**
     576 é o maior tamanho que o app consegue pintar: `PIXEL_SIZE_MAP.lg` = 176pt,
     o maior `imageScale` do `PixelIllustration` é 1,06, e 176 × 1,06 × 3 (@3x)
     ≈ 560px. O resto eram bytes que nenhuma tela renderiza. Verificado no
     simulador no maior render alcançável (`state="guide" size="lg"`): sem perda
     visível. A regra ficou escrita no README da pasta, junto do gatilho para
     revisá-la (só subir junto com `PIXEL_SIZE_MAP`).
   - **O seam da arte futura não foi tocado:** o registry `PIXEL_DEDICATED_ASSETS`
     em `pixelAssets.ts` e o contrato de nomes em `assets/pixel/README.md`
     continuam de pé — é ali que renders dedicados por estado/tier entram, não
     nos arquivos legados.
   - **Pendente (fora do escopo desta execução):** `Mascote.png` na raiz do
     repositório continua **untracked**; é arquivo do usuário, não do app, e não
     entra em bundle nenhum. Apagar é decisão dele.
6. **`HomeScreen`** é a única tela ainda 100% light (53 refs claras, 0 galaxy) —
   candidata a remoção junto com o código de rollback pós-beta.
   **Correção de leitura (2026-07-28):** ela **não é código morto**.
   `src/app/(tabs)/index.tsx` a entrega quando `AppConfig.ENABLE_LEARNING_ROAD`
   é falso, e o flag tem default `true` em `src/config.ts:36` — ou seja, é o
   caminho de rollback vivo da Learning Road, com teste dedicado
   (`HomeScreen.flow.test.tsx`, que roda com o flag desligado). Removê-la é
   remover o rollback: decisão de produto, prevista para depois do beta, não
   faxina de código.
   O onboarding (wizard) era outro caso e **foi removido em 2026-07-28** por
   decisão do usuário. `src/app/onboarding/{index,value,goal}.tsx` era um
   protótipo inacabado (não persistia escolhas; `Build my plan →` só fazia
   `router.replace('/(tabs)')`) que nenhuma tela navegava — só o deep link
   `radiantapp://onboarding` — e o `_layout` declarava um `Stack.Screen
   name="onboarding"` inexistente (a rota real era `onboarding/index`) que o
   Metro acusava a cada boot. Removidos: as três rotas, o `Stack.Screen`
   fantasma e 8 allowances órfãs do `visual-qa-policy.json`. O smoke
   `onboarding-to-home.yaml` — que dirigia o wizard e já afirmava strings em
   inglês obsoletas desde a migração pt-BR de 07-27 (logo, o "3/3 iOS" de 07-26 é
   anterior a essa deriva) — foi repontado para `boot-to-home.yaml` (instalação
   limpa → `Foco de hoje`, sem deep link), com o contrato do Maestro exigindo a
   nova forma; **o device run do novo flow pertence a B0.1**. `ENABLE_ONBOARDING`
   foi mantido de propósito: é kill switch do onboarding *suave*
   (`OnboardingService`), vivo atrás da `HomeScreen`. A `HomeScreen` em si **não
   foi tocada** — segue como rollback vivo, remoção prevista para pós-beta.
7. ~~**`npm test` fora de `npm run quality`:** hoje o `ios:preflight` não roda a
   suíte Jest. Decidir se entra no gate.~~ **Decidido e aplicado em 2026-07-28:**
   entra. A suíte Jest roda dentro do `npm run quality`
   (`npm run test -- --runInBand`, depois dos contratos estruturais e antes do
   visual QA estrito — os contratos são baratos e falham em menos de 1s cada, a
   suíte é o passo caro, então o gate ainda dá o retorno rápido primeiro).
   Motivo: o Loop já executava `app-test` como validador separado, ou seja a
   suíte já era obrigatória de fato; o que faltava era o `ios:preflight` — o
   caminho humano — enxergar a mesma barra. **Custo medido, não estimado:** o
   gate completo passou de ~12,5s para **19,5s**. O README da raiz descrevia o
   gate como "lint, typecheck e visual QA", desatualizado desde os testes de
   contrato; passou a listar o conteúdo real.

Além do backlog de design, a sequência de lançamento do roadmap segue válida:
B0.1 (reexecutar E2E sob `preview`), B4 (VoiceOver), B5 (reward E2E) e a Onda A
(contas de loja).

## Documentação alinhada ao estado real (2026-07-28)

Passagem de documentação depois das quatro entregas desta data. O achado que
justifica registrar isto em vez de tratar como faxina:

**O contrato de documentação estava validando o documento aposentado.**
`scripts/qa/docs-contract.mjs` governava `EXECUTION_STATUS_2026-07-27.md`, então
todas as regras que ele aplica (caminho de workspace legado, alegação de API
disponível, dívida editorial zerada) rodavam contra o snapshot histórico e nunca
contra o status canônico. Existia teste para exatamente essa classe de erro —
`scripts/qa/docs-contract.test.mjs`, *"governs the newest execution status as a
current-state document"* — e ele estava **vermelho**: nenhum script, gate ou
validador o executava. Guarda sem executor é documentação, não guarda. O
validador `docs-contract` do Loop passa a rodar o teste antes do contrato.

Além disso, três ponteiros canônicos ainda apontavam para 07-27 e passaram a
apontar para 07-28: `docs/README.md`, o cabeçalho e a seção "Onde estamos hoje"
do [roadmap de lançamento](plans/2026-07-27-radiant-launch-roadmap.md), e
`context.includes` do `.loop/project.yaml` — este último decidia que status as
próximas sessões de IA leriam como verdade.

As quatro entregas desta data também foram registradas no
[CHANGELOG do app](../radiant-app/docs/CHANGELOG.md), que não as tinha.

## Coordenação entre múltiplas IAs

Contrato de sinalização em [`AGENTS.md`](../AGENTS.md), seção "Coordenação
multi-IA": antes de começar, checar o que já foi feito; ao terminar, sinalizar no
mesmo run que entrega o trabalho. Trabalho não sinalizado é tratado como não
feito pelas próximas sessões.

## Árvore de trabalho

Há modificações não commitadas de **outra sessão** em `AppButton.tsx`,
`config/push.ts`, `PushService.ts` e `JourneyHomeScreen.flow.test.tsx`. Não
pertencem a esta execução e não foram tocadas nem commitadas por ela.
