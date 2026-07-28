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
| `npm run quality` | PASS | lint, typecheck, visual QA e contratos (Storybook, Maestro, easing, clearance, contraste) — reexecutado sob o run do Loop desta data |
| testes do app (`npm test`) | PASS | suíte Jest reexecutada sob o run do Loop |
| contrato de documentação | PASS | executado a cada run |
| validadores do Loop | PASS | 9 de 9 no run desta data |
| smoke público da API | FAIL esperado | `/health` e `/ready` em HTTP 502 (sem reexecução nesta data; estado inalterado) |

## Bloqueios do app (inalterados desde 07-27)

Os bloqueios de lançamento não mudaram nesta data; o detalhe de cada um está no
[status de 07-27](EXECUTION_STATUS_2026-07-27.md) e no
[roadmap de lançamento](plans/2026-07-27-radiant-launch-roadmap.md):

1. **Gate 2 sem aprovação.** Resta o item 2 (anúncio único no VoiceOver, exige
   sessão humana com áudio — task B4). Os itens 1, 3, 4 e 5 têm evidência.
2. **E2E não reexecutado sob perfil de produção** (task B0.1).
3. **Android sem projeto nativo** (`expo prebuild` nunca executado).
4. **Nó de reward sem cobertura E2E** (task B5).
5. **API pública inativa** — ADR de estratégia da API pendente (decisão de
   produto).
6. **Contas de loja inexistentes** (Onda A).

## Próxima sequência sugerida

Em ordem de valor, do backlog da 2ª auditoria de design (todas ainda não
sinalizadas como feitas):

1. **Guarda anti-regressão de identidade:** proibir `import { colors }` (paleta
   clara) em `src/features/**` e `src/app/**`. É o que teria pego os dois P0 de
   design desde o começo; o teste de contraste atual valida tokens **isolados**,
   não composições — esse é o ponto cego.
2. **Migrar telas para `typography.*`:** ~55% do dimensionamento de texto ainda
   usa `fontSize` numérico (153 ocorrências contra 125 usos de token), então boa
   parte do app renderiza em fonte de sistema, não em Sora. Piores: `HomeScreen`,
   `MissionsScreen`, `ProgressScreen`, `PlanetInteriorScreen`, onboarding.
3. **Passo "Verificar" antes de commitar a resposta do quiz:** hoje tocar numa
   alternativa já submete e já custa uma vida, sem confirmação nem desfazer
   (`useQuiz.ts:99-126`), e a perda do coração não produz sinal visual ou tátil
   (`HUD.tsx:32-48`).
4. **A11y:** o HUD lê "coração vermelho" 5× em 5 telas; 21 componentes com zero
   props de a11y; nenhum `accessibilityRole="header"` no app inteiro.
5. **Assets:** ~3,0 MB duplicados — os 6 estados do mascote são o mesmo arquivo
   (md5 idêntico), `pixel_core.png` tem 2,16 MB e serve sm/md/lg, e há cópia
   byte-a-byte em `Mascote.png` na raiz (untracked).
6. **`HomeScreen`** é a única tela ainda 100% light (53 refs claras, 0 galaxy) —
   candidata a remoção junto com o código de rollback pós-beta.
7. **`npm test` fora de `npm run quality`:** hoje o `ios:preflight` não roda a
   suíte Jest. Decidir se entra no gate.

Além do backlog de design, a sequência de lançamento do roadmap segue válida:
B0.1 (reexecutar E2E sob `preview`), B4 (VoiceOver), B5 (reward E2E) e a Onda A
(contas de loja).

## Coordenação entre múltiplas IAs

Contrato de sinalização em [`AGENTS.md`](../AGENTS.md), seção "Coordenação
multi-IA": antes de começar, checar o que já foi feito; ao terminar, sinalizar no
mesmo run que entrega o trabalho. Trabalho não sinalizado é tratado como não
feito pelas próximas sessões.

## Árvore de trabalho

Há modificações não commitadas de **outra sessão** em `AppButton.tsx`,
`config/push.ts`, `PushService.ts` e `JourneyHomeScreen.flow.test.tsx`. Não
pertencem a esta execução e não foram tocadas nem commitadas por ela.
