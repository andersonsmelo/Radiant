# Trilha Medalhão — retomada do Plano 2

Medições de 2026-10-23 (America/Bahia), branch `claude/trilha-medalhao-design`,
[PR #66](https://github.com/andersonsmelo/Radiant/pull/66), a partir do WIP
`8ad10e8` da [pausa](2026-10-22-trilha-medalhao-final.md). `docs/STATUS.md`
continua sendo o único estado vivo; este registro guarda as medições.

## Proveniência e limites

- Writer `run-1792757625819-e00263ec`, aberto com 37 caminhos declarados depois
  de toda a coleta nativa; sessão de leitura do cérebro
  `brain-session-1792753779305-372f9f9d`. Nenhuma edição antes de `STEP_STARTED`.
- Dev clients **existentes** Debug 1.4.0 (3), com Skia. AVD
  `radiant-entrada-api34` (Android 14/API 34/arm64); simulador iOS reservado
  `5FD8C926` só lido. Sem build nativa, EAS, merge ou loja.
- Metro 8081 no Node 20.20.2, com `EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 CI=1`.
  As medições **sem instrumentação** foram servidas pela worktree da frente
  (`8ad10e8`, e depois o conserto). As **instrumentadas** saíram de uma cópia
  descartável no mesmo SHA, com os patches versionados aqui, e nunca da
  worktree da frente. Os quatro arquivos de produto da cópia sem patch tinham o
  mesmo SHA-256 da worktree.
- Emulador e Debug não provam aparelho físico, Release nem VoiceOver real.
  A tela do Mac estava desbloqueada: a chave `CGSSessionScreenIsLocked` não
  aparece no `ioreg` (ela só aparece com a tela bloqueada).

## 1. Segundo dia integral — Android PASS

Antes de qualquer coleta que limpasse dados, a trilha do AVD foi lida sem
tocar: às 08:12, ela recomendava "Revisar Fundamentos de Radiologia" com
"Fazer revisão", **vencida naturalmente**. O YAML corrigido da pausa
(`sha256 5eb056ae…`) rodou **inteiro**: `exit=0`, 36 passos `COMPLETED` e
nenhum `FAILED`, incluindo a última asserção, a que tinha falhado em
2026-10-22. O XP foi de 26 para 44, e a revisão seguinte ficou
"Disponível em 24/10/2026 às 08:14". Nenhum relógio, store ou snapshot foi
editado ([log](2026-10-23-trilha-medalhao-retomada/android-segundo-dia.txt),
[estado final](2026-10-23-trilha-medalhao-retomada/android-segundo-dia-final.png)).

O simulador iOS reservado `5FD8C926` foi ligado só para ler a data: revisão
"Disponível em 30/10/2026 às 14:07", ainda **não vencida**
([captura](2026-10-23-trilha-medalhao-retomada/ios-reservado-data.png)). O app
foi encerrado e o simulador desligado, sem nenhum toque. O segundo dia iOS
continua dependendo desse vencimento.

## 2. Momento Android — a lacuna era da gravação; o percurso existe

O vídeo de 2026-10-22 saiu do `adb shell screenrecord`, que só emite quadro
quando a tela muda e chegou a 7,25 quadros/s, com 1,79 s sem quadros. O
gravador do próprio emulador (`adb emu screenrecord start --fps 60`) deu de 306
a 620 quadros em ~11,2 s. Na janela da revelação, de +0,4 a +4 s do toque,
foram de 180 a 199 quadros, com lacuna máxima de 0,024 s. As lacunas maiores,
de até 0,21 s, ficam nos primeiros 0,3 s, com o resumo ainda parado
([detecção](2026-10-23-trilha-medalhao-retomada/android-momento-deteccao.txt)).

**Linha do tempo instrumentada**, com tempos relativos ao toque em "Continuar"
do resumo
([eventos](2026-10-23-trilha-medalhao-retomada/android-momento-eventos.txt),
[patch](2026-10-23-trilha-medalhao-retomada/instrumentacao-momento.patch)):

| s | evento |
| --- | --- |
| +0,133 | `useTrailMoment` decide L1 → L2, com L1 concluída |
| +0,331 | pedido de âncora (índice 2, `viewPosition` 0,5) |
| +0,358 | `playing`, `ready=false`, `holding=true`; rota de 12 pontos, ainda sem medida |
| +0,561 | encaixe medido em L2 (48 × 45,8 dp) |
| +0,610 | todas as linhas medidas; rota de 23 pontos; início da animação |
| +0,620 | rolagem aplicada (y = 287) |
| +0,636 | `holding=false` no React |
| +0,671 → +2,07 | 86 mudanças de valor no thread de UI: trecho, percurso, medalha e botão chegam a 1 |
| +2,022 | `onDone` pelo relógio do JS (`TRAIL_MOMENT_MS`) |

Nessa leitura, L1 fica acima da janela e o conjunto visível é revisão L1, L2
e revisão L2. Os quadros mostram a cabeça **inteira** entrando pelo topo,
descendo pelo corredor aceso e parando ao lado de L2, com "Continuar jornada"
no fim
([vídeo](2026-10-23-trilha-medalhao-retomada/android-momento-instrumentado.mp4),
[quadros](2026-10-23-trilha-medalhao-retomada/android-momento-instrumentado-quadros.png)).
Nenhuma hipótese de 2026-10-22 se confirmou: a âncora chega antes da partida,
nada é recortado e a coleta não atrasa.

### Defeito novo: um quadro do estado final antes do percurso (não resolvido)

Nas gravações **sem instrumentação**, aparece em 2 de 4 (rodadas 2 e 4) um
único quadro (~0,02 s) com o Pixel já no destino, o botão e o trecho aceso.
Depois o Pixel some e o percurso começa
([quadros](2026-10-23-trilha-medalhao-retomada/android-momento-limpo-quadro-final.png),
[vídeo](2026-10-23-trilha-medalhao-retomada/android-momento-limpo-2.mp4)).
No iOS normal de 2026-10-22, gravado a ~91 quadros/s, o mesmo detector não
encontra esse quadro: a cabeça chega a 6,107 s e o botão entra a 6,640 s.

**Primeira causa, pela linha do tempo e pelo código.** Enquanto o momento espera a
medição, `useTrailMomentStyles` chamava `settle()`, que deixa os valores
animados em 1, ou seja, no **estado final**, sob o `held`. Ao ficar pronto, o
efeito zera os valores no JS e, na mesma passada, troca o estado que tira o
`held`. O commit do React pode chegar à tela antes de o thread de UI aplicar o
zero. Na rodada instrumentada, essa janela foi de +0,636 a +0,671 s. A
espera sempre acontece, porque o encaixe do Pixel só existe na medalha
recomendada: no primeiro render do momento, `ready` é falso.

**Conserto parcial** (`radiant-app/src/ui/motion.ts`), sem mudar desenho,
tempos ou contrato:
- durante a espera, as camadas guardam o **começo** (trecho 0, percurso 0,
  botão 0, medalha 1), e não o fim;
- sem rota, o Pixel só aparece no fim do percurso (`travel >= 1`);
- a rota de um momento anterior é descartada fora da animação.

**Vermelho específico:** os dois testes novos de `JourneyTrail.test.tsx`,
rodados contra o `motion.ts` do HEAD, falham nas linhas do defeito. O botão
está com opacidade 1 sob o `held`, e no segundo momento o Pixel fica visível
com a rota anterior. As asserções de validade, que conferem que a camada está
escondida, passam ([vermelho](2026-10-23-trilha-medalhao-retomada/testes-vermelho.txt)).
Uma segunda variante, com o conserto inteiro menos a regra do Pixel sem rota,
falha na asserção do Pixel (linha 914), registrada no mesmo arquivo. A linha 953
(botão no segundo momento) vem depois da 952 e não tem como falhar sozinha. A
causa dela é a mesma da 913, que já foi vista falhando. No Jest, o Reanimated
copia o estilo inicial do hook (`style.initial`, em `AnimatedComponent`) para
uma vista que monta depois da mudança de valor, sem rodar o mapa. No aparelho,
o estilo inicial é recalculado com os valores atuais. Por isso o trecho não é
afirmado no Jest, e o comentário do teste diz isso.

**Verificação nativa do conserto: o sintoma continua**
([detecção](2026-10-23-trilha-medalhao-retomada/android-momento-corrigido-deteccao.txt),
[vídeo da rodada 4](2026-10-23-trilha-medalhao-retomada/android-momento-corrigido.mp4)).

| Código | Gravações sem instrumentação com o quadro | Com instrumentação |
| --- | --- | --- |
| antes do conserto | 2 de 4 | 0 de 1 |
| com o conserto | 1 de 4 (rodada 4, 3,456 s) | 0 de 10 (4 com logs pesados e 6 com logs leves) |

O conserto fecha um caminho real: a espera guardava o fim sob o `held`. O
revisor independente o aprovou no código, mas ele **não elimina o quadro no
aparelho**. Os logs, até os leves, escondem o defeito, então a causa restante
não foi observada. Nas três gravações com o quadro, ele cai de 0,63 a 0,71 s
antes da chegada da cabeça, ou seja, na partida, quando o `held` sai. A
instrumentação pesada também mostrou um fato novo: todas as linhas da lista
desmontam e remontam durante a espera. `TrailNodeRow` usa
`key={rowSignature(item)}`, e a assinatura inclui `rowBottom`, que depende da
altura do encaixe (46,18 em L1 e 45,82 em L2). A ligação disso com o quadro
**não foi demonstrada**. Fica como próximo passo rastrear o lado nativo sem log
JS (Perfetto ou systrace com FrameTimeline), antes de um segundo conserto.
Nenhum segundo conserto foi feito sem prova.

## 3. Revisão dos vídeos iOS e do texto máximo

- **Normal** (0–11,68 s do vídeo concatenado): o percurso e a chegada já
  estavam aprovados; o detector confirma que não há quadro final antecipado.
- **Reduzir movimento** (4,585 s, 47 quadros): o primeiro quadro da trilha já
  é o estado final, com o Pixel ao lado de L2, o botão e o caminho aceso, sem
  percurso. A transição da pilha de navegação continua animada; ela é do
  sistema, não do momento.
- **Texto máximo AX5** (11,68–23,66 s) **e Android a 200%**: a cabeça está
  inteira e sem sobreposição, mas o texto **quebra no meio da palavra**:
  - no iOS, "Princípio / s de / Tomograf" e a data "24/10/20 / 26 às 06:20";
    "Tomograf" sai cortado pela linha do lembrete, sem reticências;
  - no Android, "Tomografia Com / putadorizada";
  - também no Android a 200%, "Lembrete diário" aparece cortado em "Lem", e
    os rótulos das abas também ([captura de 2026-10-22](2026-10-22-trilha-medalhao-final/android-texto-maximo.png),
    [AX5](2026-10-22-trilha-medalhao-final/ios-texto-maximo.png)).

  O comentário da coluna em `JourneyTrail.tsx` diz que ela existe porque o
  zigue-zague "partia as palavras" (achado 2 do gate H4). Com os corredores
  laterais de 64 pt, a largura útil da coluna é a da lista menos 128 pt
  (`trailColumnContentWidth`), e no AX5 o defeito volta. **Não foi corrigido:** os corredores de 64 pt e a fonte
  integral são decisões que o prompt da retomada manda preservar. Escolher
  entre hifenização, outra reserva da cabeça na coluna ou aceitar o limite no
  AX5 é decisão do dono. O resumo da aula no AX5 também corta o título
  ("Marca cheia! Leitu…"), mas essa tela é do plano 5.

## 4. Quarenta concluídas: só as medalhas visíveis tocam

A story `Trilha/JourneyTrail/QuarentaConcluidas` foi aberta no AVD. Ela é
sintética e não lê nem grava progresso.

**Prova de reprodução**
([patch](2026-10-23-trilha-medalhao-retomada/instrumentacao-playback.patch),
[resultado](2026-10-23-trilha-medalhao-retomada/playback-40.txt)). Um contador
no thread de UI, sobre o relógio de cada ilustração, mostrou:
- em 74 s de rolagem de ponta a ponta e volta, as 40 medalhas avançaram
  quadros em algum momento, e **nenhuma** avançou fora do conjunto visível;
- paradas no meio (medalhas 16–20) e no fim (36–40): exatamente as 5
  visíveis avançam, com 61 quadros por leitura de 1 s do contador, e as outras 35 montadas ficam com
  `running=false` e zero quadros
  ([meio](2026-10-23-trilha-medalhao-retomada/storybook-40-meio.png)).

**Desempenho sem instrumentação**
([script](2026-10-23-trilha-medalhao-retomada/benchmark40.py),
[dados](2026-10-23-trilha-medalhao-retomada/benchmark40.json)): três rodadas
de 26 deslizes para baixo e 26 para cima, com `framestats` deduplicado por
`IntendedVsync` e carga do Mac entre 4,2 e 4,6.

| Rodada | quadros / s | gfxinfo "Janky" | p50 / p90 / p99 (gfxinfo) | pior quadro (`FrameCompleted − IntendedVsync`) |
| --- | --- | --- | --- | --- |
| 1 | 1803 / 30,2 | 9 (0,50%) | 16 / 22 / 27 ms | 50,3 ms |
| 2 | 1803 / 30,1 | 2 (0,11%) | 16 / 21 / 26 ms | 50,1 ms |
| 3 | 1805 / 30,2 | 5 (0,28%) | 20 / 22 / 27 ms | 50,1 ms |

São ≈59,7 quadros produzidos por segundo. A métrica de latência por quadro
inclui o encadeamento da GPU, então não equivale ao tempo de quadro. Os
números valem para emulador Debug. O passo 2 da tarefa 7 cita o medidor do G6
(PR #59), mas ele mede dados e primeiro quadro, não quadros contínuos com
rolagem. A medida veio do `gfxinfo framestats`, como na coleta de 2026-10-22.

**Achado à parte:** o bundle do Storybook não monta na branch nem na
`origin/main`. As stories `ComparisonStepRenderer` e `HotspotStepRenderer`
importam `../assets/lesson-xray-panel.png`, que não existe no repositório.
A medição usou um stub só na cópia descartável
([patch](2026-10-23-trilha-medalhao-retomada/storybook-asset-stub.patch)).

## 5. Gate e revisão

- **Focais** ([verde](2026-10-23-trilha-medalhao-retomada/testes-verde.txt)):
  os 3 testes do momento; 46 suítes e 617 testes de `src/features/journey` e
  `src/ui`; `tsc` e `eslint` com código 0, no Node 20.20.2.
- **Gate do app** `EXPO_NO_DOTENV=1 CI=1 npm run quality`
  ([saída](2026-10-23-trilha-medalhao-retomada/gate.txt)):
  - 1ª rodada: FAIL, 1 de 2163, em `JourneyHomeScreen.flow.test.tsx`, no teste
    "não toca de novo…", porque o momento não acabou dentro de
    `TRAIL_MOMENT_MS + 1000` em relógio real;
  - 2ª rodada: **PASS**, 190 suítes, 2163 testes, contratos e visual QA.

  **Achado:** esse teste é frágil sob carga e **anterior ao conserto**. Com a
  CPU limitada (`taskpolicy -b`), os mesmos três testes de fluxo do momento
  falham tanto com o `motion.ts` do HEAD quanto com o conserto. Isso é risco
  para o CI da PR #66. O arquivo ficou fora do escopo deste writer.
- **Loop:** `loop validate --run run-1792757625819-e00263ec` deu
  `VALIDATION_PASSED`, com os 15 validadores `passed`. Depois vieram
  `STEP_SUCCEEDED`, `MEMORY_WRITTEN` e `RUN_CLOSED`. O commit é o `60e034e`,
  enviado a `origin/claude/trilha-medalhao-design`.
- **Revisão independente:** aprovou o conserto no código com ressalvas e
  reprovou o aceite do Plano 2 agora. Os achados e o que se fez com eles estão
  [aqui](2026-10-23-trilha-medalhao-retomada/revisao-independente.md).

Integridade: [checksums.sha256](2026-10-23-trilha-medalhao-retomada/checksums.sha256).
