# Trilha Medalhão: o quadro antecipado, medido no nativo

Medições de 2026-10-23, das 14h às 20h (America/Bahia), branch
`claude/trilha-medalhao-design` em `c2b86e6`. O código de produto é o mesmo da
[retomada](2026-10-23-trilha-medalhao-retomada.md#defeito-novo-um-quadro-do-estado-final-antes-do-percurso-não-resolvido),
com o conserto parcial de `useTrailMomentStyles`. Mesmo AVD (`radiant-entrada-api34`), mesmo dev
client Debug com Skia, Metro no Node 20.20.2 com `EXPO_NO_DOTENV=1
EXPO_NO_TYPESCRIPT_SETUP=1 CI=1`, gravador do emulador a 60 fps e o
[detector](2026-10-23-trilha-medalhao-retomada/detectar.py) de antes.

## Resultado

**O quadro não apareceu em nenhuma das 13 rodadas válidas, e a causa continua
sem observação. Nenhum conserto foi feito.**

| Instrumento | Rodadas válidas | Com o quadro |
| --- | --- | --- |
| Perfetto (`gfx`, `view`, `input`, FrameTimeline) | 1 (r1) | 0 |
| `atrace` pesado (`gfx view input am sched`) | 1 (a1) | 0 |
| `atrace` leve (`view input` e as seções do app) | 7 (b1, c1 a c6) | 0 |
| sem instrumentação | 4 (l1, l2, l3, l6) | 0 |

Duas rodadas sem instrumentação, l4 e l5, não contam: a trilha ficou mais de
5 s no topo antes de centralizar em L2, e os 9 s de gravação acabaram antes do
momento. Os tempos de cada rodada estão em [deteccao.txt](2026-10-23-trilha-medalhao-quadro/deteccao.txt).

Com a taxa de antes (1 de 4 com o conserto), 13 rodadas limpas seguidas teriam
chance de 0,75¹³ ≈ 2%. A medida de antes vinha de 4 gravações, com uma
ocorrência, então a taxa real pode ser bem menor. Também pode depender de uma
condição que hoje não se repetiu. As duas leituras cabem nos dados, e nenhuma
foi provada.

## O que o rastreamento mostrou

No Android, sem build nova, o RN emite `IntBufferBatchMountItem::mountInstructions::<tipo>
numInstructions=N` em cada lote de montagem do Fabric. O Reanimated 4.1.6 não
emite `onAnimationFrame` aqui: as atualizações dele chegam como lotes só de
`UPDATE_PROPS`. Isso separa os commits do React, com `CREATE`, `INSERT` ou
`REMOVE`, dos quadros de animação ([linha.py](2026-10-23-trilha-medalhao-quadro/linha.py)).

Alinhando o vídeo pela chegada da cabeça (cerca de 0,75 s depois do primeiro
lote de animação), em todas as rodadas o último commit do React antes do
momento vem **de 24 a 101 ms antes do primeiro lote de animação**, de 1,5 a 6
quadros ([alinhamento.txt](2026-10-23-trilha-medalhao-quadro/alinhamento.txt)).
Nesse intervalo, a tela mostrou o começo do momento, e nunca o fim. Ou seja,
a janela entre o React e o Reanimated existe sempre. O estado final só vaza
nela em alguma condição que não se repetiu hoje. Que esse commit seja o que
tira o `held` é inferência, pela ordem dos lotes, e não leitura direta.

Duas hipóteses foram descartadas lendo o código do Reanimated 4.1.6:
- **vista nova presa no estado final:** o `ViewDescriptorsSet.add` roda o
  atualizador forçado (`updater?.(true)`) no thread de UI quando a vista se
  registra, então ela recebe os valores atuais;
- **objeto de estilo novo a cada dependência:** `useAnimatedStyle` guarda o
  objeto num `useRef`, e o `PropsFilter` não perde as props iniciais quando a
  rota muda.

Sobra uma hipótese sem prova: um commit do React reaplicando, sobre a vista, as
props iniciais do lado do JS, que foram calculadas quando os valores ainda
estavam em 1. Para ver isso no aparelho é preciso ler as props nativas de cada
vista quadro a quadro, e nem o `atrace` nem o Perfetto mostram valores.

## Outras observações

- **Sob carga, a trilha mostra o estado antigo por cerca de 1,5 s.** Nas
  rodadas l1 a l6, com a carga do Mac entre 3,9 e 5,9, a volta do resumo
  mostrou primeiro "Retomar lição" na L1 e "0 de 8". Depois veio o estado novo
  no topo, sem centralizar, e só então a centralização e o momento
  ([quadros da l1](2026-10-23-trilha-medalhao-quadro/l1-quadros.png), um quadro
  a cada 0,5 s). Nas rodadas rápidas, a volta leva 1,4 s do toque à cabeça.
  Não é o defeito procurado, mas aparece para o aluno num aparelho lento.
- **O roteiro salvo de preparo não abre o app no AVD.** Com `clearState`, o
  Maestro não segue o deep link do dev client (`radiantapp://` nem
  `exp+radiant-app://`). A cópia usada aqui, [preparar.yaml](2026-10-23-trilha-medalhao-quadro/preparar.yaml),
  toca no servidor listado no launcher, e só isso muda. O original,
  `radiant-app/.maestro/artifacts/final-android-preparar-momento-elegivel.yaml`,
  não foi alterado.
- **O `atrace` com `gfx` deixa o emulador lento demais.** Ele registra cada
  chamada de GL, e o momento passou a vir 5 s depois do toque. Use só `view` e
  `input` com `-a com.ascendcreative.radiant`.

## Como repetir

[rodada-atrace.sh](2026-10-23-trilha-medalhao-quadro/rodada-atrace.sh) e
[rodada-limpa.sh](2026-10-23-trilha-medalhao-quadro/rodada-limpa.sh) preparam o
momento elegível, gravam 9 s a 60 fps e tocam "Continuar" do resumo. O
primeiro também liga o `atrace`. Os dois esperam o AVD ligado, o Metro na 8081
e `adb reverse tcp:8081 tcp:8081`. Os caminhos de rascunho dentro deles são
locais; troque `S=` pela sua pasta. Depois:

```bash
MEDICAO_DIR=<pasta> python3 docs/evidence/2026-10-23-trilha-medalhao-retomada/detectar.py <rodada> 0 9
python3 docs/evidence/2026-10-23-trilha-medalhao-quadro/alinhar.py <pasta> <rodada> docs/evidence/2026-10-23-trilha-medalhao-retomada/detectar.py
```

Os vídeos e os rastreamentos (de 4 a 37 MB cada) ficaram fora do repositório.
