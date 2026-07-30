# Evidência — E1 fechado nas duas plataformas (2026-07-30)

- **Data:** 2026-07-30, capturas entre 14:28 e 15:48 (`-03`)
- **Fecha:** o **lado iOS de E1** (screenshots 6,7" e 6,5") e o achado dos cards
  `PRECISÃO`/`TÓPICOS` levantado em
  [`2026-07-30-laco-xp-device.md`](2026-07-30-laco-xp-device.md) §5
- **Não fecha:** a prova do *themed icon* do Android 13+, que continua exigindo
  aparelho real

## 1. O que foi capturado

| Plataforma | Dispositivo | Resolução | Flow |
| --- | --- | --- | --- |
| Android | `emulator-5554`, `wm size 1080x1920` | 1080×2340 → **1080×1920** | `3/3`, `EXIT=0` |
| iOS 6,7" | iPhone 16 Plus (simulador, iOS 26.5) | **1290×2796** | `EXIT=0` |
| iOS 6,5" | iPhone 11 Pro Max (simulador, iOS 26.5) | **1242×2688** | `EXIT=0` |

Os seis screenshots do `store-capture.yaml` saíram em cada uma das três
execuções. `1242×2688` é exatamente o tamanho que a App Store pede no bucket
6,5"; `1290×2796` atende o 6,7".

**Build iOS:** `xcodebuild -workspace Radiant.xcworkspace -scheme Radiant
-configuration Release -sdk iphonesimulator -derivedDataPath build/DD
CODE_SIGNING_ALLOWED=NO build` → `** BUILD SUCCEEDED **`, zero `error:`.
**Com o env do perfil `production`**, não o do `e2e-test` — a receita registrada
em [`2026-07-28-e2e-local-release.md`](2026-07-28-e2e-local-release.md) usa
`APP_ENV=development`, que serve para E2E e invalidaria uma vitrine de loja.

Marcadores conferidos dentro do `main.jsbundle` do `.app`, com controle negativo
na mesma invocação: `LearningAttemptsRepository` ×4, `LessonOutcomeService` ×5,
`Sobre todas as tentativas avaliadas` ×1, `MARCADOR_INEXISTENTE_XYZ` ×0.

## 2. O defeito que bloqueava o iOS — oclusão, não visibilidade

A primeira execução no iOS falhou no fim da segunda lição:
`assertVisible: "Concluir e voltar"` reprovou, e a tela estava **parada no passo
3/4**, com o `Continuar` desabilitado e nenhuma alternativa selecionada.

O passo anterior — `tapOn: id: lesson-option-ct-q3:option:2` — havia reportado
**COMPLETED**. E a guarda que existia para protegê-lo,
`runFlow when notVisible: … scrollUntilVisible`, havia sido **SKIPPED**.

A árvore no instante da falha explica os dois:

```
lesson-option-ct-q3:option:0   [33,686][397,768]
lesson-option-ct-q3:option:1   [33,780][397,838]
lesson-option-ct-q3:option:2   [33,850][397,932]
```

A tela do iPhone 16 Plus tem **932 pontos** de altura. A alternativa alvo ocupa
`y850–932`: está na árvore, dentro da tela e, para qualquer predicado de
visibilidade, **visível** — mas fica **por baixo do CTA `Continuar` flutuante**.
A guarda concluiu "já está visível, não precisa rolar", o tap caiu no botão
desabilitado, e o flow seguiu como se tivesse respondido.

**O Maestro não modela oclusão.** `visible` responde "está na árvore e dentro do
viewport", nunca "recebe o toque". Uma guarda construída sobre visibilidade não
pode proteger contra oclusão — ela é cega exatamente para o caso que precisa
detectar, e o custo é um falso COMPLETED, que é pior que uma falha: o flow
continua e só quebra dois passos depois, longe da causa.

É o **mesmo defeito** que o projeto já havia corrigido no Android em 2026-07-29
para os CTAs abaixo da dobra oclusos pela tab bar flutuante, com o mesmo remédio.
A correção anterior tratou as três ocorrências então conhecidas; esta quarta
sobreviveu porque naquele momento o iOS não passava por ela.

**Correção:** trocar a guarda por um `- scroll` de elevação fixo, sem condição.

## 3. Por que um scroll fixo serve às duas plataformas — medido

No Android a 1080×1920 a lista não rola mais nesse ponto, então o scroll extra é
no-op e a alternativa continua em `y1382–1534`. Isso estava **escrito** no
comentário do flow desde 07-29; nesta data foi **medido**: a execução Android
com o flow já corrigido saiu `EXIT=0`, com os seis screenshots.

A ordem importa e foi seguida: a mudança altera um flow compartilhado, então
alegar "serve às duas plataformas" sem reexecutar a plataforma que já passava
seria trocar uma medição por uma expectativa. Android foi reexecutado **depois**
da correção, não antes.

## 4. Os cards PRECISÃO e TÓPICOS — achado de §5 resolvido

O achado registrado hoje de manhã era: `06-progresso.png` mostrava
`TOTAL XP ⚡ 36` ao lado de `PRECISÃO — / Sem tentativas avaliadas ainda.`,
porque os dois cards eram hardcoded, o `LearningStatsService` não tinha
consumidor e nada gravava `LearningAttempt`.

Depois da correção, as três capturas mostram o mesmo estado coerente:

| Campo | Valor |
| --- | --- |
| `SEQUÊNCIA ATUAL` | `🔥 1 dia` |
| `PRECISÃO` | **`100%`** — "Sobre todas as tentativas avaliadas." |
| `TOTAL XP` | `⚡ 36` |
| `REVISÕES` | `0` — correto, o SM-2 ainda não venceu card |
| `TÓPICOS` | **`Fundamentos — 100% · 2 lições`** |

Arquivos: [`android-06-progresso.png`](2026-07-30-e1-store/android-06-progresso.png),
[`ios-67-06-progresso.png`](2026-07-30-e1-store/ios-67-06-progresso.png),
[`ios-65-06-progresso.png`](2026-07-30-e1-store/ios-65-06-progresso.png),
[`ios-67-05-conquista.png`](2026-07-30-e1-store/ios-67-05-conquista.png).

O `100%` é consistente com o resto por construção: o flow acerta as duas
questões, e é a mesma acurácia que rendeu `18 XP` por lição. O rótulo
`Fundamentos` vem do **título da unidade** na trilha — `QuizLesson` não carrega
tópico, e a unidade é o único agrupador que o domínio realmente tem.

## 5. Limites

- **Simulador e emulador, não aparelhos reais.** Suficiente para vitrine e para
  o laço de XP; **não** substitui o aparelho real exigido pela verificação de
  conta do Play nem pela prova do *themed icon*.
- **iPad segue desligado** na v1.3 (`supportsTablet: false`).
- **A sequência de 1 dia não distingue** "avança" de "travada em 1" — um único
  dia de uso produz o mesmo número nos dois casos.
- **Progresso pré-existente não é pago retroativamente**; todas as capturas
  partem de `clearState: true`, que é o caso favorável.
- Os assets aqui são **evidência**, não os arquivos finais da ficha: o recorte e
  a seleção dos seis por bucket continuam sendo passo de publicação.

## 6. Normalização para a App Store — feita em 2026-07-30, depois desta captura

As capturas cruas dos dois buckets foram normalizadas para assets publicáveis em
`docs/store/assets/screenshots-ios-67/` (1290×2796) e `screenshots-ios-65/`
(1242×2688), seis telas cada, RGB sem alpha.

O bloqueio registrado como "o `normalize-screenshots.py` só conhece as regras do
Play" estava **mais brando que a medição**: o script não era neutro em relação ao
iOS — seu `MAX_RATIO = 2.0`, que é regra do Google, **reprovava** os doze
arquivos, já que 1290×2796 = 2,167:1 e 1242×2688 = 2,164:1. Medido rodando o
`--spec play` contra a captura de 6,7": as seis linhas saem como recusa explícita
de proporção, e o diretório de destino **não é criado**.

As duas lojas medem coisas diferentes — o Play mede *proporção*, a App Store mede
*tamanho exato* —, então a regra virou parâmetro `--spec` em vez de um `if`
implícito sobre as dimensões. Um segundo defeito apareceu no mesmo arquivo: ele
apagava o diretório de saída **antes** de validar qualquer arquivo, de modo que um
`--spec` errado destruía a saída boa e só depois falhava. Corrigido para avaliar
todo o conjunto primeiro; provado por reversão — destino com 6 arquivos sobrevive
intacto a uma execução que falha.

Os três testes novos do contrato de assets (11 → 14) travam tamanho exato por
bucket e **paridade de telas entre os dois buckets**, porque a verificação de
tamanho passa num bucket que tenha telas a menos: tamanho não enxerga ausência.
