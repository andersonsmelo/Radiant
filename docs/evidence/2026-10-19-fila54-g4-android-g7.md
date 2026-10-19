# FILA 54 — o G4 no Android, a árvore de acessibilidade e o inventário G7 — 2026-10-19

**Medido em:** 2026-10-19, das 08:44 às 09:08 (America/Bahia).
**Autoria:** Claude (Opus 5.5), na worktree `claude/fila54-g4-nativo`, cortada de
`origin/main` em `d7bd696`.
**Combinado com Anderson antes de abrir o run:** as partes 1 (G4 no Android), 2
(acessibilidade pela árvore, iOS e Android) e 3 (inventário G7). O G6 fica para
depois do merge da [PR #52](https://github.com/andersonsmelo/Radiant/pull/52),
porque reaproveita o medidor dela.

Marcação: **[medido]** foi executado e visto; **[código]** foi lido no código, sem
execução; **[não verificado]** ficou de fora, com o motivo.

## Resultado

1. **[medido] O G4 funciona no Android.** No emulador de entrada, a revisão passou
   por seleção, confirmação, acerto, erro, ajuda e resumo, com o mesmo resultado
   do iOS: "3 de 3" e "+4 XP confirmado".
   - **Seis capturas versionadas**, com hash em [`screenshots.json`](2026-10-19-fila54-g4-android-g7/screenshots.json).
   - **Como foi conduzido:** por `adb`, e não pelo roteiro Maestro. O motivo está
     no achado 2.
2. **[medido] Defeito novo no Android: com "Remover animações" ligado, o cartão da
   revisão não aparece.** A sessão abre e mostra "1/3" e "Sessão ativa", mas a
   pergunta, as alternativas e os botões não aparecem na tela nem na árvore de
   acessibilidade. Continuam ausentes 25 s depois. Com as animações no padrão,
   os mesmos passos mostram o cartão.
   - **Por que pesa:** "Remover animações" fica na tela de Acessibilidade do
     Android, então o defeito atinge justamente quem pediu menos movimento.
   - **Não foi consertado neste run** (ver a seção do defeito).
3. **[medido] O roteiro do G4, sem alteração e com o argumento do E1, passou no
   iOS.** Isso fecha a pendência "G4 com o argumento do E1, não reexecutado", da
   FILA 59 ([log](2026-10-19-fila54-g4-android-g7/g4-ios.log), `exit=0`).
4. **[medido] Árvore de acessibilidade do G4 nas duas plataformas.** Os rótulos, o
   papel de alternativa e o estado de selecionada estão certos. O "Confirmar
   resposta" fica desativado até haver escolha.
   - **Conserto:** o resultado da revisão não era anunciado no iOS. Agora é
     anunciado nas duas plataformas, como na lição, com o vermelho registrado.
   - **Achados sem conserto:** estão na seção de acessibilidade.
5. **[código] Inventário G7 de armazenamento: 65 chaves em 8 classes**, em
   [`storageInventory.ts`](../../radiant-app/src/storage/storageInventory.ts). Uma
   guarda nova lê a AST e reprova chave nova fora do inventário e entrada sem
   chave no código. Cada defeito que ela nomeia foi visto falhando.
6. **[código] Dois achados de recuperação para o dono:**
   - **iOS:** o histórico do aluno fica fora do backup do iCloud;
   - **jornada:** uma versão antiga do app grava por cima da jornada salva com
     schema mais novo.

## 1. O G4 no emulador Android

**Ambiente:**
- **Emulador:** AVD `radiant-entrada-api34` (Android 14, API 34, 2 GB de RAM, 2
  núcleos), no Mac M5;
- **App:** dev client Debug 1.4.0 (3), o APK da FILA 61, reaproveitado sem mexer
  naquela worktree (SHA-256 `2acba055…5d9ef0`);
- **JS:** servido pelo Metro desta worktree, no Node 20.20.2 e com
  `EXPO_NO_TYPESCRIPT_SETUP=1`. Ou seja, a `main` mais o diff deste run, que no
  app só muda o `ReviewCard`.

**Preparo:**
1. **[medido] A L1 foi concluída por um roteiro real.** Usei o
   `learning-critical-path`, numa cópia local cujo subflow do dev client também
   aceita `http://10.0.2.2:8081`, porque o launcher do Android não lista
   `localhost`.
   - **Primeira execução:** parou nesse launcher ([log](2026-10-19-fila54-g4-android-g7/licao-l1-android-falha-1.log)).
   - **Segunda:** viu "A lição foi concluída" e depois reprovou ao rolar a trilha
     até o cabeçalho ([log](2026-10-19-fila54-g4-android-g7/licao-l1-android.log)).
     Essa rolagem fica depois da L1, então não afeta o preparo.
2. **[medido] Os três cartões da L1 foram vencidos** por
   [`preparar-revisao-devida-android.py`](2026-10-19-fila54-g4-android-g7/preparar-revisao-devida-android.py),
   o equivalente Android do script de 2026-10-18. Ele usa `run-as` sobre o
   SQLite `RKStorage`, recusa aparelho que não seja emulador e relê o banco para
   conferir.
   - **Armadilha medida:** `adb exec-in` com `run-as` sai com zero sem gravar
     nada. O script usa `adb shell` com a linha inteira.
   - **Saída:** [fixture-android.txt](2026-10-19-fila54-g4-android-g7/fixture-android.txt).

**O roteiro `g4-native-evidence` não serve no Android hoje. Foram quatro tentativas:**

| Tentativa | Escalas de animação | Onde parou | Por quê |
| --- | --- | --- | --- |
| 1 | padrão | `openLink` da revisão, sem avançar por minutos | Com o fundo animado, a árvore não fica ociosa e o Maestro espera. O argumento do E1 não chega ao app no Android (FILA 49) ([log](2026-10-19-fila54-g4-android-g7/g4-android-falha-1.log)) |
| 2 e 3 | 0 | `scrollUntilVisible` de "Começar revisão" | A rolagem desceu e passou do botão, que estava no topo. Causa provável, não confirmada: o `assertVisible: Revisão` casou antes de a tela assentar ([log](2026-10-19-fila54-g4-android-g7/g4-android-falha-2.log)) |
| 4 | 0, mais uma espera explícita por "Começar revisão" na cópia local | a pergunta do item 1 | O cartão não aparece: é o defeito da seção 2 ([log](2026-10-19-fila54-g4-android-g7/g4-android.log)) |

A tentativa 1 mostra que o Maestro no Android precisa das animações desligadas.
A 4 mostra que, com elas desligadas, o app esconde o cartão. Por isso o caminho
foi conduzido à mão, com as escalas no padrão.

**[medido] Condução por `adb`, com captura e árvore a cada estado:**

| Estado | Captura | O que se vê |
| --- | --- | --- |
| Sessão ativa | [01](2026-10-19-fila54-g4-android-g7/g4-android-01-sessao-ativa.png) | Pergunta sem gabarito, quatro alternativas, "Confirmar resposta" desativado |
| Alternativa selecionada | [02](2026-10-19-fila54-g4-android-g7/g4-android-02-alternativa-selecionada.png) | Borda na escolhida, Confirmar ativo |
| Acerto | [03](2026-10-19-fila54-g4-android-g7/g4-android-03-resposta-correta.png) | "Resposta correta", resposta e explicação |
| Erro | [04](2026-10-19-fila54-g4-android-g7/g4-android-04-resposta-errada.png) | "Vamos revisar este ponto", em rosa, com "Osso" e a explicação |
| Ajuda | [05](2026-10-19-fila54-g4-android-g7/g4-android-05-resposta-com-ajuda.png) | "Resposta consultada" |
| Resumo | [06](2026-10-19-fila54-g4-android-g7/g4-android-06-sessao-concluida.png) | "3 de 3", "3 concluídos nesta rodada", "+4 XP confirmado"; o XP do topo foi de 18 a 22 |

## 2. Defeito: "Remover animações" esconde o cartão da revisão no Android

**Reprodução [medido]**, no emulador acima:
1. ligue as três escalas em 0: `animator_duration_scale`,
   `transition_animation_scale` e `window_animation_scale`. É o que o "Remover
   animações" faz;
2. com cartões vencidos, abra `radiantapp://review` e toque em "Começar revisão".

A árvore dos estados 12 e 13 de [a11y-android.txt](2026-10-19-fila54-g4-android-g7/a11y-android.txt)
não tem pergunta nem `review-option-*`, e o estado 13 foi lido 25 s depois do 12.
Voltando as escalas para 1, os mesmos passos mostram o cartão (estado 01).

**Causa provável [código], não confirmada:**
- o cartão entra pelo `useCardEnter` (`src/ui/motion.ts`), que começa com
  opacidade 0;
- a preferência de movimento chega de forma assíncrona
  (`useReducedMotionPreference`), então a primeira passada inicia a animação
  nativa e a segunda faz `setValue(1)`;
- com a escala do animador em 0, essa combinação deixa o cartão invisível.

O `useCardEnter` também é usado por `HomeScreen` e `QuizQuestion`, e **o efeito
neles não foi medido.** O iOS com o argumento do E1 não passa por esse caminho,
porque lá a preferência já é conhecida na primeira renderização.

**Por que não foi consertado aqui:** o conserto está em `src/ui/motion.ts`, fora
do escopo declarado deste run, e vale para três telas. Fica como próximo item,
com a reprodução acima como teste nativo.

## 3. Acessibilidade do G4 pela árvore

Lida com `maestro hierarchy`: [Android](2026-10-19-fila54-g4-android-g7/a11y-android.txt)
e [iOS](2026-10-19-fila54-g4-android-g7/a11y-ios.txt), no simulador descartável
`E262D4C1`. **Nada foi ouvido:**
- o simulador iOS não tem VoiceOver;
- a imagem `google_apis` não traz o TalkBack.

O teste audível continua com o dono, no iPhone.

| Elemento | iOS | Android |
| --- | --- | --- |
| Alternativa | rótulo = texto; papel "radio button"; `selected` true só na escolhida | `RadioButton`; rótulo = texto; `selected` true só na escolhida; `checked` false |
| Confirmar resposta | desativado até escolher; ativo depois | igual |
| Ver resposta com ajuda | ativo até confirmar | igual |
| Rótulo do feedback | "RESPOSTA CORRETA" e os outros dois, em caixa alta | igual |
| Botão Fechar | rótulo "Fechar revisão" | igual |
| Ícones de fonte (`` e outros) | não expostos | expostos como `TextView` com o glifo |

**Conserto [medido]: anúncio do resultado.**
- **O defeito:** o feedback só tinha `accessibilityLiveRegion`, que o React
  Native aplica apenas no Android, então o VoiceOver não ouvia o resultado. A
  lição anuncia o dela desde 2026-09-28.
- **O conserto:** o `ReviewCard` passa a anunciar, uma vez por item, o rótulo, a
  resposta certa e a explicação. A live region saiu, para o Android não ouvir em
  dobro.
- **O teste:** `ReviewCard.test.tsx` falhou com cada metade desfeita
  isoladamente: sem o anúncio, 0 chamadas; sem a trava por item, 2 chamadas. Os
  dois vermelhos estão no fim de [a11y-ios.txt](2026-10-19-fila54-g4-android-g7/a11y-ios.txt).

**Achados sem conserto, para triagem:**
- **[medido]** a alternativa escolhida tem `selected` true e `checked` false no
  Android. O `checkable` não foi lido: o `uiautomator dump` não responde com
  animação na tela, e o `maestro hierarchy` não o expõe. Se o nó for marcável, o
  TalkBack pode dizer "não marcado" na escolhida. Todo o app usa `selected` nas
  alternativas, e o VoiceOver da lição foi aprovado pelo dono assim;
- **[medido]** no Android, os glifos de ícone entram na árvore como texto, e o
  leitor pode lê-los;
- **[medido]** o rótulo do feedback chega ao leitor em caixa alta, por causa do
  `textTransform`. Não se sabe se algum leitor soletra;
- **[medido]** o subflow `dismiss-dev-client.yaml` só conhece
  `http://localhost:8081`. No Android, o servidor aparece como `10.0.2.2`.

## 4. Inventário G7 de armazenamento

**[código]** Todo estado do app mora no AsyncStorage: não há SecureStore,
SQLite próprio nem arquivo. O inventário lista **65 chaves em 8 classes**:

| Classe | Chaves |
| --- | ---: |
| aprendizagem | 17 |
| economia | 5 |
| quarentena | 6 |
| controle | 21 |
| sessao | 1 |
| preferencia | 4 |
| telemetria | 8 |
| legado | 3 |

Três delas são prefixos seguidos de um identificador: a autoridade do checkpoint,
a quarentena dela e o `pixel-mood:last:`.

**O que sobrevive a quê:**

| Situação | iOS | Android |
| --- | --- | --- |
| Backup do aparelho | **Nada.** O AsyncStorage se exclui do backup do iCloud por padrão (`RNCAsyncStorage.mm`, linhas 519–527), e nem o `app.json` nem o `Info.plist` gerado têm `RCTAsyncStorageExcludeFromBackup` | **Tudo**, em tese. O `AndroidManifest.xml` gerado tem `android:allowBackup="true"`, e o Auto Backup cobre `databases/RKStorage` até 25 MB |
| Reinstalar o app | apaga tudo | apaga tudo; o Auto Backup do Google pode devolver |
| Trocar de aparelho por backup | o aluno recomeça do zero | pode voltar com o backup do Google |
| Reset de progresso | não existe no app | não existe no app |

**[não verificado]** nenhuma dessas situações foi executada em aparelho. A
coluna do Android descreve o comportamento padrão do sistema, não um ensaio.

**Schema futuro (uma versão antiga do app lendo dado de versão mais nova),
lido no código das stores de aprendizagem:**

| Store | Comportamento | Dado salvo |
| --- | --- | --- |
| `@radiant:journey_progress_v1` (`JourneyProgressService`) | `normalizeStore` devolve `null` para versão desconhecida, e o `persistProgress` seguinte grava um store novo | **sobrescrito** |
| `@radiant:item_review_v1` | indisponível, sem escrita (R6) | preservado |
| `@radiant:learning_evidence_v1` | lança `evidence-store-unavailable`, sem escrita | preservado |
| checkpoints (`CheckpointStore`) | move para a quarentena `future-schema` e segue com envelope vazio | preservado na chave de quarentena |
| migração 1.4 (`StorageMigrationService`) | só compara com a versão-alvo; não reconhece versão maior | — |

As demais stores não foram avaliadas nesta frente.

**[medido] A guarda: [`storageInventory.test.ts`](../../radiant-app/src/storage/storageInventory.test.ts).**
Ela lê a AST de `src/` com o verificador de tipos do TypeScript, nunca o texto.
Junta as chaves por dois caminhos:
- toda chamada de leitura ou escrita, seguindo constantes, objetos de chaves,
  template literals e métodos que montam a chave;
- toda constante de chave declarada.

O resultado precisa ser igual ao inventário. Uma chamada sem chave resolvível
só é aceita nos 18 repasses listados. A varredura leva cerca de 3,5 s.

**[medido] O vermelho** está em [guarda-g7-vermelho.txt](2026-10-19-fila54-g4-android-g7/guarda-g7-vermelho.txt).
Foram cinco injeções, cada uma isolada, com âncora única e restaurada byte a
byte. Cada uma derrubou só o teste que nomeia o seu defeito:
- chave nova gravada direto na chamada;
- chave nova declarada como constante;
- entrada removida do inventário;
- entrada fantasma;
- chamada com chave não resolvível.

## Gates

**[medido]** `EXPO_NO_DOTENV=1 npm run quality` no Node 20.20.2, nesta worktree,
com todas as mudanças do run ([log](2026-10-19-fila54-g4-android-g7/quality.log), `exit=0`):
175 suítes e 1.793 testes do Jest, todos os contratos verdes e o visual QA com 0
regressões. O `loop validate` do run
`run-1792410162650-54b79f08` fica no envelope do run.

## O que não foi verificado

- **Leitores de tela:** VoiceOver e TalkBack audíveis, inclusive o anúncio novo;
- **G6:** desempenho no aparelho, que fica para depois do merge da #52;
- **Release e aparelho físico:** build Release, aparelho Android físico e backup
  e restauração executados;
- **Escopo do defeito de animação:** o efeito em `HomeScreen` e `QuizQuestion`;
- **Defeito da 1.4.0:** se o defeito existe na versão publicada. Não há build
  Android de produção; o Play tem a 1.3.0 em teste fechado.

## Reprodução

```bash
cd radiant-app && npx jest --runInBand src/storage/storageInventory.test.ts src/features/review
python3 -I docs/evidence/2026-10-19-fila54-g4-android-g7/preparar-revisao-devida-android.py emulator-5554
```

A reprodução do defeito de animação está na seção 2. As capturas e as árvores
saíram de `adb exec-out screencap -p` e de
`maestro --device emulator-5554 hierarchy`.
