# Evidência em device — o laço de XP escreve em produção (2026-07-30)

- **Data/hora:** 2026-07-30, build às 11:41, instalação às 11:43:05, captura
  encerrada às 11:49 (`-03`)
- **Alvo:** `emulator-5554`, imagem Google APIs, Android 13+
- **Artefato:** `app-release.apk` (128 MB), perfil **production**, bundle JS
  embutido, sem dev client e sem Metro
- **Fecha:** a ressalva 1 da §4 do
  [status canônico](../../../docs/EXECUTION_STATUS_2026-07-29.md) e a linha
  "evidência em device do laço de XP — NÃO OBTIDA" da tabela de 2026-07-30
- **Spec:** [2026-07-29-laco-xp-revisoes-design.md](../../../docs/superpowers/specs/2026-07-29-laco-xp-revisoes-design.md) §8

## 1. O bloqueio declarado não existia

O status de 2026-07-30 registrou a evidência como bloqueada por **ausência de
JDK no host** (`java -version` falhando com "Unable to locate a Java Runtime",
sem Android Studio, sem `~/Library/Java/JavaVirtualMachines`, sem openjdk do
Homebrew). Remedido nesta data: **há um JDK 17 instalado desde 2026-04-22**, em
`~/.jdks/jdk-17.0.19+10/Contents/Home`, e `~/.zshrc` exporta `JAVA_HOME` e o
prefixa ao `PATH` **desde 2026-07-26** — quatro dias antes da sessão que
declarou o bloqueio.

As quatro checagens não eram independentes. O `/usr/bin/java` do macOS é um stub
que delega a `/usr/libexec/java_home`, e `java_home` consulta **apenas**
`/Library/Java/JavaVirtualMachines` e `~/Library/Java/JavaVirtualMachines`. Três
das quatro repetem a mesma lista de diretórios; a quarta acrescenta o Homebrew.
Nenhuma enxerga `~/.jdks`, que é onde o JetBrains Toolbox instala. O acordo entre
elas não era confirmação — era **uma medição repetida**.

O repositório já continha a contraprova:
[`2026-07-28-android-e2e-first-run.md`](2026-07-28-android-e2e-first-run.md)
registra, na linha do runner, **"Maestro 2.7.0; JDK 17"**, e um APK Release de
122 MB construído com ele dois dias antes.

Probe de consumidor, que encerra a questão em segundos:

```
$ ./gradlew -version
Launcher JVM:  17.0.19 (Eclipse Adoptium 17.0.19+10)
Daemon JVM:    /Users/anderson/.jdks/jdk-17.0.19+10/Contents/Home
```

`./gradlew assembleRelease` sai **BUILD SUCCESSFUL in 48s**.

## 2. Receita usada (reprodutível)

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$HOME/.jdks/jdk-17.0.19+10/Contents/Home"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
export SENTRY_DISABLE_AUTO_UPLOAD=true
# env do perfil production do eas.json — NÃO o de e2e-test, que usa APP_ENV=development
export EXPO_PUBLIC_APP_ENV=production
export EXPO_PUBLIC_ENABLE_DEV_TOOLS=false
export EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=false
export EXPO_PUBLIC_ENABLE_BETA_GATE=false
export EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true
export EXPO_PUBLIC_ENABLE_PUSH=true
export EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false

rm -rf android/app/build/generated/assets/createBundleReleaseJsAndAssets
cd android && ./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
adb shell wm size 1080x1920      # o nativo 1080x2424 estoura o teto 2:1 do Play
maestro --platform android test .maestro/store-capture.yaml
adb shell wm size reset
```

O `rm -rf` do bundle gerado é obrigatório: **o Gradle não invalida cache por
variável de ambiente**, então sem apagar o diretório o APK sairia com o bundle do
build anterior e a medição seria do código velho.

## 3. O artefato medido contém a mudança

Antes de capturar, o bundle foi extraído **de dentro do APK** e verificado:

| Marcador | Ocorrências |
| --- | --- |
| `LessonOutcomeService` | 4 |
| `Falha ao registrar XP` | 1 |
| `Falha ao resolver elegibilidade` | 1 |
| `LessonOutcomeServiceXYZ` (controle negativo) | 0 |
| `stringQueNaoExiste123` (controle negativo) | 0 |

Os controles negativos vão na **mesma invocação** de propósito. Na primeira
tentativa o `grep` tratou o bundle como binário e suprimiu a contagem: todos os
marcadores saíram em branco, o que se lê como zero e apontaria para "o APK não
tem a mudança". Foram os controles saindo **igualmente em branco** — quando
deveriam sair `0` — que revelaram que o instrumento é que estava quebrado, não o
artefato. Repetido com `grep -a`, os números acima.

Complementos: árvore rastreada limpa (`git status --porcelain -uno` vazio), logo
o build é do código commitado, não da árvore de trabalho; `lastUpdateTime` do
pacote instalado = **2026-07-30 11:43:05**, posterior a todos os commits
`ab40bb1..621b3a7`.

## 4. Resultado

`3/3` — o flow `store-capture.yaml` completou todos os passos, `EXIT=0`.

| Superfície | Antes (APK de 2026-07-29 18:56) | Agora | Arquivo |
| --- | --- | --- | --- |
| Celebração do checkpoint | `XP total: 0` | **`XP total: 18`** | [`05-conquista.png`](2026-07-30-laco-xp/05-conquista.png) |
| Cabeçalho da home | `⚡ 0` · `🔥 0` | **`⚡ 36`** · **`🔥 1d`** | [`01-home.png`](2026-07-30-laco-xp/01-home.png) |
| Aba Progresso — TOTAL XP | `0` | **`36`** | [`06-progresso.png`](2026-07-30-laco-xp/06-progresso.png) |
| Aba Progresso — SEQUÊNCIA | — | **`🔥 1 dia`** | idem |
| Aba Progresso — REVISÕES | `0` | `0` | idem |

**18 XP por lição é o valor previsto, não um número solto.** A spec (§5) derivou
que `validateBlock` exige exatamente um passo interativo por bloco, logo
`totalQuestions` é sempre 1 e a acurácia é 0 ou 100%; a 100% o prêmio é
`XP_BASE (10) + BONUS_XP_90PCT (8) = 18`. Duas lições concluídas no flow → **36**.
O valor medido bate com a regra derivada antes da medição.

**`REVISÕES 0` continua correto e não é regressão.** O contador conta cards
*vencidos*, e o SM-2 só vence o primeiro card depois do intervalo inicial. Zero
logo após a conclusão é o estado esperado; o que a mudança garante é que o card
agora **nasce**, não que ele já esteja vencido.

## 5. Achado novo, fora do escopo da spec — dois cards sem dado

O mesmo screenshot que prova o conserto expõe, na mesma tela, dois cards com o
defeito da **mesma classe** que a spec descreve:

`06-progresso.png` mostra **`TOTAL XP ⚡ 36`** ao lado de
**`PRECISÃO — / Sem tentativas avaliadas ainda.`**, e abaixo
**`TÓPICOS / Ainda não há evidência suficiente para indicar domínio por tópico.`**

Verificado no código, três camadas mortas:

1. **O leitor ignora dado.** `AccuracyChartCard()` e `TopicsMasteredList()`
   (`src/features/progress/screens/ProgressScreen.tsx:126` e `:150`) não recebem
   props. Renderizam a cópia de estado-vazio **incondicionalmente** — nenhum
   valor as faria mudar.
2. **A fiação não existe.** `LearningStatsService`
   (`src/features/progress/services/LearningStatsService.ts`) implementa
   `accuracyPercent`, `recentAccuracyPercent` e `topicMastery`, tem teste
   unitário, e **zero consumidores** no app: a única ocorrência do nome fora do
   próprio arquivo está no teste dele.
3. **O escritor não existe.** Varredura em todo o `src/`: `LearningAttempt` e
   `getAttempts` aparecem **apenas** no próprio serviço e no seu teste. A única
   implementação de `getAttempts` no repositório está dentro do arquivo de teste.

**Consequência imediata:** `06-progresso.png` é candidato a screenshot de loja, e
nele o app afirma 36 XP acumulados e "sem tentativas avaliadas ainda" lado a
lado. Contradição visível na vitrine.

**RESOLVIDO ainda em 2026-07-30**, depois desta captura. `LearningAttemptsRepository`
passou a persistir as tentativas, o `LessonOutcomeService` grava a tentativa
**mesmo quando não premia** (refazer lição não paga XP, mas continua sendo
informação sobre memória), e o `ProgressScreen` consome o `LearningStatsService`
que já existia. `topicId` é o `unitId` do nó: `QuizLesson` não carrega tópico, e
a unidade é o único agrupador que o domínio realmente tem — qualquer outra coisa
seria inventar taxonomia sem dono. Recapturado nas três resoluções: os cards
agora mostram `PRECISÃO 100%` e `TÓPICOS Fundamentos — 100% · 2 lições` ao lado
dos `36 XP`. Ver [`2026-07-30-e1-store-capture.md`](2026-07-30-e1-store-capture.md) §4.

Os screenshots deste diretório (`2026-07-30-laco-xp/`) são, portanto, o estado
**anterior** a essa correção — ficam como registro do defeito, não como vitrine.

## 6. Limites desta evidência

- **Emulador, não aparelho real.** Vale para o laço de XP, que é lógica de
  domínio e armazenamento local. **Não** substitui o aparelho real exigido pela
  verificação de conta do Play nem pela prova do *themed icon* do Android 13+.
- **Sequência de 1 dia não distingue** "a sequência avança" de "a sequência está
  travada em 1": num único dia de uso os dois estados produzem o mesmo número. O
  que a mudança prova aqui é que `updateStreak` passou a rodar; a progressão
  entre dias exige captura em dias distintos.
- **Progresso pré-existente não é pago retroativamente.** Estado limpo
  (`clearState: true`) é o caso favorável. Quem já tinha nós em `completedNodeIds`
  antes desta mudança nunca receberá por eles — pendência sem decisão.
- **Só Android.** O lado iOS não foi recapturado nesta execução.
