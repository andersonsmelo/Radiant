# E2E em device — Android, primeira execução — 2026-07-28

**Task:** B0.1, linha Android da matriz.
**Resultado:** Android **`app-failed`** — 2 de 3 flows passaram; o
`learning-critical-path` falhou no último passo por um seletor acoplado ao
formato de acessibilidade do iOS. O app rodou; o defeito não é de ambiente.

Esta é a **primeira vez que o app foi executado em Android**. O estado anterior
(`environment-blocked`, "sem projeto nativo") era verdadeiro na letra — `expo
prebuild` nunca havia rodado — e falso na conclusão: a toolchain estava
instalada e o projeto foi gerado, buildado e instalado nesta mesma máquina, sem
instalar nada de novo.

## Contexto

- **Código:** branch `codex/wave1-hardening-api-smoke`, commit `9dcd752`.
- **Alvo:** emulador `Radiant_Pixel_9_API_36` (o AVD já existia, nunca usado).
- **Runtime:** APK **Release** (122 MB) com bundle JS embutido, assinado com a
  keystore de debug (`signingConfig signingConfigs.debug` no `buildType release`
  do template) — sem dev client e sem Metro, o equivalente Android do que o
  RUNBOOK aceita para esta validação.
- **Runner:** Maestro 2.7.0; JDK 17; SDK com NDK 27.1.12297006 e CMake 3.22.1
  baixados pelo próprio Gradle nesta execução.

## Receita de build (reprodutível)

```sh
cd radiant-app
CI=1 npx expo prebuild --platform android --no-install
```

`--no-install` é obrigatório: sem ele o `prebuild` roda o gerenciador de pacotes
e mexe no `package-lock.json`, que é rastreado. Com ele, nenhum arquivo
rastreado muda — `/android` já está no `.gitignore`, como `/ios`.

Antes de buildar, aumentar a memória do Gradle em `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1536m
```

O valor gerado pelo prebuild (`-Xmx2048m -XX:MaxMetaspaceSize=512m`) **não
basta**: `:expo-updates:kspReleaseKotlin` morre com
`java.lang.OutOfMemoryError: Metaspace`, e o Gradle então trava no shutdown em
vez de encerrar — o sintoma é um build parado com CPU zerada, não uma mensagem
de erro.

**Isso deixou de ser um ajuste manual em 2026-07-28.** O valor agora vem do
config plugin `plugins/with-gradle-memory.js`, registrado no `app.json`, então o
`expo prebuild` regenera o `gradle.properties` **com** ele — verificado rodando
o prebuild de novo e conferindo o arquivo gerado. Editar o arquivo à mão não
funcionava como solução: ele é gerado, e todo prebuild restaurava em silêncio o
valor que quebra o build.

`expo-build-properties` **não** resolve isto e não foi instalado: o schema das
opções Android da linha SDK 54 (0.14.8) é um conjunto fixo e tipado, sem
`gradleProperties` nem `jvmargs`. Seria uma dependência nova sem efeito. O
`withGradleProperties` do `@expo/config-plugins`, já dependência do Expo, faz o
trabalho sem adicionar pacote.

```sh
cd radiant-app/android
export ANDROID_HOME=~/Library/Android/sdk ANDROID_SDK_ROOT=$ANDROID_HOME
export JAVA_HOME=<jdk-17>
export EXPO_NO_DOTENV=1 EXPO_PUBLIC_APP_ENV=development \
  EXPO_PUBLIC_ENABLE_DEV_TOOLS=false EXPO_PUBLIC_ENABLE_TELEMETRY_DEBUG_SCREEN=false \
  EXPO_PUBLIC_ENABLE_BETA_GATE=false EXPO_PUBLIC_ENABLE_LEARNING_ROAD=true \
  EXPO_PUBLIC_ENABLE_PUSH=false EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false
export SENTRY_DISABLE_AUTO_UPLOAD=true
./gradlew assembleRelease --console=plain
adb install -r app/build/outputs/apk/release/app-release.apk
```

Com um simulador iOS e um emulador Android ligados ao mesmo tempo, o Maestro
exige desambiguação: `maestro --platform android test .maestro`.

## Execução

`maestro test .maestro`:

| Flow | Resultado | Tempo |
| --- | --- | --- |
| `boot-to-home` | **PASSED** | 1m 13s |
| `learning-critical-path` | **FAILED** | 22m 34s |
| `offline-relaunch` | **PASSED** | 6m 39s |

`Element not found: Text matching regex: Progresso, tab.*`

Os tempos são ~5× os do iOS (12s / 4m19s / 2m21s) — emulador arm64, cada
`assertVisible` custando ~4s contra ~0,1s no simulador.

## Causa da falha: o seletor afirma o formato do iOS

`maestro hierarchy` nas duas plataformas, com o app na home:

| Aba | iOS (`accessibilityText`) | Android (`accessibilityText` do nó clicável) |
| --- | --- | --- |
| Home | `Home, tab, 1 of 4` | `<U+E88A>, Home` |
| Galáxia | `Galáxia, tab, 2 of 4` | `Galáxia` |
| Progresso | `Progresso, tab, 3 of 4` | `<U+E26B>, Progresso` |
| Missões | `Missões, tab, 4 of 4` | `Missões` |

O iOS compõe `"<rótulo>, tab, N of 4"`; o Android não compõe nada equivalente e
coloca o rótulo **depois** do ícone. O flow afirma `Progresso, tab.*`, que só
existe no iOS. Um seletor que resolva nos dois é `.*Progresso.*`.

Vale notar a inversão de atributos entre plataformas, que já está anotada no
flow como se fosse regra geral e é regra **do iOS**: no iOS o `AppButton`
colapsa a subárvore e expõe só `accessibilityText`, sem `text`; no Android o nó
expõe `text` preenchido e `accessibilityText` vazio. O `repeat`/`notVisible`
guardado funciona nos dois; `scrollUntilVisible` com `element.text`, não.

## Dois defeitos de produto que só o Android revela

A tabela acima mostra glifo em Home e Progresso e nenhum em Galáxia e Missões.
A causa é a mesma, em `components/ui/icon-symbol.tsx` — o fallback Android/web
do `IconSymbol`, que mapeia nomes de SF Symbol para Material Icons e só cobre
dois dos quatro ícones da tab bar (`house.fill` → `home`, `chart.bar.fill` →
`bar-chart`; `sparkles` e `bolt.fill` não estão no mapa).

1. **Duas abas sem ícone no Android.** `MAPPING[name]` é `undefined` para
   Galáxia e Missões, o `MaterialIcons` não renderiza nada, e as duas abas saem
   só com texto.
2. **Glifo de fonte de ícone no nome acessível.** `U+E88A` e `U+E26B` são
   codepoints de uso privado: o TalkBack anuncia um caractere ilegível antes do
   rótulo em Home e Progresso.

O contrato `keeps icon glyphs out of the accessibility tree` existe exatamente
para o defeito 2 e não o pegou: ele varre `src/features` e `src/app` atrás de
import direto de `MaterialIcons`, e esse arquivo está em `components/ui/`, fora
das duas pastas. A guarda tem ponto cego no componente compartilhado — que é
justamente onde um defeito de ícone atinge todas as telas de uma vez.

Ambos são de Android e não apareceriam no roteiro de VoiceOver da task B4.

### Correção — 2026-07-28, verificada em device

A causa do defeito 1 não era o mapa incompleto, e sim o cast que o acompanhava:
`const MAPPING = {...} as Record<SymbolViewProps['name'], ...>` alargava
`keyof typeof MAPPING` para **todos** os nomes de SF Symbol. O chamador pedia
`sparkles`, o typecheck passava, e em runtime `MAPPING[name]` era `undefined`.
O cast desligava exatamente a checagem que teria pego isso na compilação.

O cast virou `satisfies Partial<Record<...>>`: o objeto continua validado contra
os nomes de SF Symbol, mas `keyof` volta a ser só as chaves definidas. **A
guarda morde** — removendo o mapeamento de `sparkles`, o typecheck falha no
ponto de uso (`src/app/(tabs)/_layout.tsx(69,35): error TS2322`). Ícone sem
mapeamento passou de tela em branco a erro de compilação. Os dois mapeamentos
faltantes entraram (`sparkles` → `auto-awesome`, `bolt.fill` → `bolt`), e o
`IconSymbol` passou a renderizar via `DecorativeIcon`, que já existia e aplica
as props que tiram o glifo da árvore.

Rebuild e nova leitura da árvore no emulador:

| Aba | antes | depois |
| --- | --- | --- |
| Home | `<U+E88A>, Home` | `Home` |
| Galáxia | `Galáxia` (sem ícone) | `Galáxia` (com ícone) |
| Progresso | `<U+E26B>, Progresso` | `Progresso` |
| Missões | `Missões` (sem ícone) | `Missões` (com ícone) |

Os nós de glifo que restam na árvore estão todos com
`important-for-accessibility=false` — desenham, o TalkBack pula. E apareceram
dois codepoints novos exatamente onde antes não havia nada, que é a assinatura
dos dois ícones que voltaram a renderizar; confirmado também por screenshot da
tab bar.

**Pendente:** alargar o contrato de glifos para varrer `components/`, hoje fora
do alcance dele. `writePolicy.allowedRoots` foi ampliada nesta data com
`radiant-app/components` e `radiant-app/plugins`, que era o pré-requisito.

## Estado por plataforma

- **iOS:** `passed` — ver
  [`2026-07-28-e2e-local-release.md`](2026-07-28-e2e-local-release.md).
- **Android:** `app-failed` — build produzido e instalado, 2/3 flows passaram, o
  terceiro falhou por asserção acoplada ao iOS. Não é `environment-blocked`: a
  validação iniciou no destino registrado.

**Responsável:** engenharia — 2026-07-28.
**Próxima ação:** trocar o seletor da aba por um que resolva nas duas
plataformas (muda o flow **e** o contrato, que hoje exige o literal antigo),
reexecutar as duas suítes — não só a que estava vermelha — e decidir sobre os
dois defeitos de ícone.
