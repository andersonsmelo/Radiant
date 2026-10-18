# FILA 61, passo 1 — AsyncStorage no emulador Android

Medido em **2026-10-18 às 18:57 (America/Bahia)**, na branch
`claude/fila61-android-medicao`, sobre a `main` em `d7bd696` mais este diff.

## Resultado medido

**O store de 5.000 cartões foi gravado, mas não pôde ser lido.** O problema
aparece antes de atingir a cota total de 6 MiB do banco: o valor único excede
a janela de leitura do SQLite neste Android.

| Caso | Bytes UTF-8 | Escrita | Leitura |
| --- | ---: | --- | --- |
| Valor de 1,0 MiB | 1.048.576 | Sim | Íntegra |
| Valor de 1,5 MiB | 1.572.864 | Sim | Íntegra |
| Valor de 1,9 MiB | 1.992.294 | Sim | Íntegra |
| Valor de 2,0 MiB | 2.097.152 | Sim | Falhou: CursorWindow |
| Valor de 2,1 MiB | 2.202.010 | Sim | Falhou: CursorWindow |
| Valor de 2,5 MiB | 2.621.440 | Sim | Falhou: CursorWindow |
| Valor de 3,0 MiB | 3.145.728 | Sim | Falhou: CursorWindow |
| Valor de 4,0 MiB | 4.194.304 | Sim | Falhou: CursorWindow |
| Store de 1.000 cartões | 1.143.057 | Sim | Íntegra, 1.000 cartões |
| Store de 5.000 cartões | 4.203.057 | Sim | Falhou: CursorWindow; `inspect().readable=false` |

Erro nativo: `Row too big to fit into CursorWindow requiredPos=0, totalRows=1`.
O maior valor legível testado foi 1,9 MiB; o primeiro que falhou foi 2,0 MiB.
Não se fez busca binária do limiar exato, nem ensaio de esgotamento do banco.

Com cinco repetições, para **1.000 cartões**, a mediana da leitura nativa foi
**9,1 ms** e a da leitura fria pelo repositório, incluindo parse, validação e
clonagem, foi **137,5 ms**. Instância e adaptador novos a cada leitura fria
impedem reaproveitar o snapshot validado. As amostras completas estão no log.
Para **5.000**, não existe tempo de leitura bem-sucedida: os **8,0 ms** de
`coldRead` são a mediana do caminho que reconhece a falha, com zero cartões
retornados e `readable=false`; não são desempenho de leitura do store.

[Logcat: 12 linhas JSON, até `done`, configuração e limpeza](2026-10-18-fila61-android-emulador/logcat.txt).

## Ambiente e limites

- **Emulador**, Android 14 / API 34 / `arm64-v8a`, imagem `google_apis`;
  AVD `radiant-entrada-api34`, perfil Pixel 4a, **2.048 MB de RAM e 2 núcleos**.
- Android Emulator **37.2.12.0**, build 16428233, num **Mac Apple M5** com
  macOS 27.2. A RAM configurada não transforma o host num aparelho de entrada.
- Dev client **Debug 1.4.0 (3)**, Hermes, Expo 54 / RN 0.81; Metro no Node
  **v20.20.2**. O build retomado terminou com `gradle exit=0`.
- O `BuildConfig.java` gerado do módulo AsyncStorage declara
  `AsyncStorage_db_size = 6L`; nenhum aumento de cota foi aplicado.
- O limite por valor foi observado no **AsyncStorage real do Android**. Sua
  causa é nativa e independe da potência do Mac; o limiar medido pertence a
  esta imagem/API, sem universalizar o valor exato para todos os Androids.
  **Os tempos não representam um aparelho de entrada nem uma build Release.**

O gerador é o mesmo do R6, extraído antes de alterar o medidor. A
[prova da extração](2026-10-18-fila61-android-emulador/extracao.txt) registra
46 linhas idênticas e os mesmos 1.143.057 e 4.203.057 bytes. A medição nativa
reproduziu esses tamanhos. Nenhum cartão real foi usado.

## Achado: erro silencioso em `getCards()`

`ItemReviewRepository.getCards()` captura qualquer erro de `load()` e devolve
`[]`; `inspect()` devolve `{ readable: false, cards: [] }`. Isso está no código
do repositório e foi exercitado nos testes com erro de leitura injetado.
No emulador, o medidor usou `inspect()` e observou `readable=false` com 5.000
cartões. **A chamada nativa a `getCards()` não foi medida separadamente**;
interpretar o erro como fila vazia é a consequência do código atual, não uma
nova observação visual da revisão. O tratamento desse contrato fica no A2.

O medidor verifica a leitura nativa e o estado do repositório mesmo quando a
primeira falha. Assim, erro nativo, store ilegível e revisão vazia não se
confundem no relatório.

## Implementação e provas das guardas

O console só chama o medidor com `__DEV__` e
`EXPO_PUBLIC_RADIANT_STORE_BENCH=1`. Sem a variável, ou fora de desenvolvimento,
a chamada é barrada. O gerador não importa APIs do Node.

Os dois testes receberam o mock oficial do AsyncStorage. Depois de superar
a falha de carregamento, apareceram dois defeitos reais no medidor inicial:
`readBooleanFlag` só reconhecia `true`, deixando `=1` desligado, e a falha
nativa interrompia a rodada antes do `inspect()`. Os casos foram vistos
vermelhos e corrigidos; **as duas suítes passaram, 11 testes**.

Quatro injeções independentes falharam pelo motivo previsto e foram desfeitas:

1. flag sempre ligada → `só liga em desenvolvimento e com a variável`;
2. efeito do console sem guarda → `não mede nada sem a variável`;
3. `getCards()` no lugar de `inspect()` → `registra a falha de leitura`;
4. erro de `getItem` engolido como `null` → o mesmo caso de falha de leitura.

[Log vermelho e comandos de cada injeção](2026-10-18-fila61-android-emulador/vermelho.txt).

Todas as chaves do medidor usam `@radiant:bench:`. Os testes verificam que
nenhuma chave sem o prefixo é tocada e que não sobra dado. Após `done` e
`am force-stop`, uma consulta SQLite à cópia do `RKStorage` confirmou **zero
chaves com esse prefixo**; só essa contagem foi registrada. O app foi encerrado,
o emulador desligado e o Metro parado antes da validação final.

## Reprodução

Na worktree, testes/builds/Metro usam Node 20. O Loop usa Node 24.

```bash
# Android/JDK já instalados; build local de desenvolvimento, sem envio.
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$HOME/.jdks/jdk-17.0.19+10/Contents/Home"
# Em radiant-app/android:
./gradlew :app:assembleDebug
# Inicie o AVD e espere sys.boot_completed=1 antes de instalar.
"$ANDROID_HOME/emulator/emulator" -avd radiant-entrada-api34 -no-snapshot
adb shell getprop sys.boot_completed
adb install -r app/build/outputs/apk/debug/app-debug.apk
# Em radiant-app, com Node 20:
EXPO_NO_TYPESCRIPT_SETUP=1 EXPO_NO_DOTENV=1 EXPO_PUBLIC_RADIANT_STORE_BENCH=1 npx expo start --dev-client --port 8081
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d 'radiantapp://expo-development-client/?url=http%3A%2F%2F10.0.2.2%3A8081' com.ascendcreative.radiant
# Na primeira instalação, conclua o menu do dev client e pule a apresentação.
adb shell am start -a android.intent.action.VIEW -d 'radiantapp://dev-console' com.ascendcreative.radiant
adb logcat -d | rg 'radiant-store-bench'
# Espere a linha done, preserve a captura e desligue antes do gate:
adb shell am force-stop com.ascendcreative.radiant
adb emu kill
# Pare também o processo Metro.
```

## Decisão que volta ao dono

**Passo 1 concluído no emulador. A2 continua aberto.** A recomendação continua
particionar por lição, aumentar a cota total no Android e migrar com cópia de
segurança, conferência e preservação da chave antiga. Aumentar apenas a cota
total não corrige a falha por valor observada. Essa recomendação é uma
inferência técnica a partir da medição; não é autorização para implementá-la.

Sem troca de storage, alteração da cota, migração, aparelho físico, iOS,
build de distribuição, envio ou merge nesta frente.

## Validação final

`EXPO_NO_DOTENV=1 npm run quality`, no Node v20.20.2, terminou com **exit=0**:
**175 suítes, 1.794 testes e 1 snapshot**; Visual QA estrito com zero regressões
não aprovadas (57 itens da baseline e 3 exceções de escopo).
As duas suítes focadas tinham passado com **11 testes**. A extração verbatim
foi reconferida no diff final: as mesmas 46 linhas do gerador anterior.

Comandos, resumos do gate completo e envelope final do Loop:
[gate.txt](2026-10-18-fila61-android-emulador/gate.txt).
O run informado no handoff, `run-1792359912932-f40607cb`, foi observado em
`editing` na leitura inicial, mas seus eventos registram fechamento concorrente
às **18:52:02**, sem validação (`validationCycles=0`). A tentativa de validá-lo
retornou `INVALID_TRANSITION` (`closed → validating`). Não se alterou seu estado.
Os testes, mutações e a medição nativa acima são execuções diretas desta sessão,
e não evidência validada daquele run.

A validação final usa **`run-1792360977572-2fb18e53`**, aberto pelo embrulho
oficial, com os **mesmos 15 arquivos** e sem recuperar ou contornar lock. Sua
baseline já contém a entrega preservada: o run valida esse estado existente,
sem atribuir retroativamente as edições ao run original. O resultado foi
**15/15 validadores aprovados em um ciclo**, seguido de `STEP_SUCCEEDED`,
`MEMORY_WRITTEN` e `RUN_CLOSED`. A sessão
`brain-session-1792360332452-ad9e1eeb` também foi fechada.

A entrega foi publicada na **[PR #52](https://github.com/andersonsmelo/Radiant/pull/52)**,
contra `main`, no commit `e6fab1203482098ed3311d0b5e7053c4f3ad88d6`.
Os checks `content` e `quality` desse SHA concluíram com `SUCCESS`, o último
às **19:10:16 de 2026-10-18 (America/Bahia)**. A PR estava aberta, sem auto-merge,
e a worktree limpa na conferência posterior. Essa prova pertence ao SHA
citado; confira novamente os checks se houver commit documental posterior.
A decisão A2 e o merge continuam com o dono.

O prompt de continuidade está [versionado aqui](../superpowers/handoffs/2026-10-18-radiant-prompt-de-continuidade-22.md).
