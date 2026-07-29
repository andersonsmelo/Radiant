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
de erro. **Este ajuste é perdido a cada `expo prebuild`**; torná-lo durável
exige declarar `expo-build-properties` no `app.json`, o que é decisão de
configuração do projeto e não foi feito aqui.

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
