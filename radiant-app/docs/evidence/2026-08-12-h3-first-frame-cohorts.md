# H3 — coortes de `first_frame`, 2026-08-12

Primeira execução completa das duas coortes **com a métrica que gateia desde
2026-08-10**. As coortes anteriores em disco
(`.maestro/artifacts/h3/`, de 2026-08-10) julgavam por `cold_start` e são
anteriores à troca de métrica; elas ficam preservadas como histórico.

**Desfecho: `inconclusive`.** O gate não reprovou o produto e não o aprovou —
recusou-se a concluir. O relatório está em
`.maestro/artifacts/h3-2026-08-12/report.json`.

## O que foi medido

| | baseline | active |
| --- | --- | --- |
| Modo do kernel | `off` | `active` |
| Flow | `student-checkpoint-performance-baseline.yaml` | `student-checkpoint-active-resume.yaml` |
| Amostras válidas | 20 | 20 |
| Retentativas | 0 | 1 |
| Janela | 18:33–18:58 | 19:03–19:46 |

Mesmo binário nos dois lados — `com.ascendcreative.radiant`, bundle
`com.ascendcreative.radiant-1786574828352.app`, executável SHA-256 começando em
`53ceffd879298c68581d1795` — no mesmo aparelho (`Radiant iPhone 17 Pro`, UDID
`3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`, iOS 26.5) e no mesmo perfil, com as duas
coortes em sequência imediata.

`radiant-app/.env.local` existia antes da janela, com
`EXPO_PUBLIC_APP_ENV=development`. Sem ele o runtime `active` é inalcançável e as
coortes sairiam vazias.

## Prova de instrumento

O canal foi provado **dentro do processo**, não por contrato estático — foi
exatamente essa prova que faltou em 2026-08-09, com tudo verde e o runtime
desligado.

- **Controle positivo**, nas duas coortes: a linha sintética atravessou o canal
  CDP e chegou ao arquivo que o parser lê.
- **Runtime `active` provado por emissão real**: `persistence` e `restoration`
  só são emitidos quando `runtimeMode === 'active'`, e ambos apareceram antes de
  a coorte começar. Isto é mais forte que ler variável de ambiente.
- **`off` silencioso, verificado e não assumido**: o log do baseline carrega
  20 `first_frame`, 20 `launch_inspection` e 20 `storage_module_resolution`,
  todos em `mode: off`, e **zero** métrica de checkpoint. O gate
  `baseline_isolation` passou com lista vazia.

## Resultado por gate

| gate | desfecho | números |
| --- | --- | --- |
| `persistence` | **pass** | p95 **16,8 ms** (limite 75), n=40 |
| `restoration` | **pass** | p95 **7,9 ms** (limite 100), n=21 |
| `first_frame_delta` | **inconclusive** | delta **−72 ms**; piso de ruído 132,6 ms contra teto de 117,1 ms |
| `home_to_lesson_delta` | **pass** | delta **+10 ms** contra 771 permitidos |
| `cold_start_delta` | pass *(advisory)* | delta −287 ms; fora do veredito |
| `baseline_isolation` | **pass** | nenhuma métrica de checkpoint no baseline |

Persistência e restauração passaram com folga e agora têm as amostras que o gate
exige. **Não há sinal de regressão em lugar nenhum**: todos os deltas medidos são
zero ou negativos, isto é, o candidato mede igual ou mais rápido que o baseline.

## Por que ficou inconclusivo

`first_frame` do baseline deu p95 585,3 ms e p50 452,7 ms, logo o piso de ruído
medido é **132,6 ms** — 22,7% do p95, acima do teto de 20% que o relatório impõe
desde 2026-08-10. O gate então recusa a comparação: quando a medida não tem
resolução, nem "dentro do limite" nem "excede" são afirmações sobre o produto.

A causa é o host, e ela está registrada no artefato. Durante a janela o macOS
**cresceu o arquivo de swap de 2048 MB para 4096 MB**, com uso subindo de
951 MB → 2441 MB → 2944 MB:

| ponta | baseline | active |
| --- | --- | --- |
| início | swap 951/2048 MB, load 4,23 | swap 2945/4096 MB, load 4,04 |
| fim | swap 2441/3072 MB, load 4,21 | swap 2913/4096 MB, load 4,19 |

O detalhe que inverte a leitura habitual: **a degradação caiu sobre o baseline**,
que rodou durante a fase de crescimento, enquanto o candidato rodou num host já
degradado porém estável. A deriva de host costuma penalizar quem roda depois; aqui
ela alargou a dispersão de quem rodou antes. Por isso o −72 ms **não deve ser lido
como ganho do candidato**, e o desfecho correto é remedir, não promover.

## Achado novo: as duas coortes não medem a mesma população

O flow de `active` lança o app **duas vezes** por amostra — o lançamento inicial e
o relançamento que prova a retomada offline —, enquanto o baseline lança uma vez.
O resultado é `first_frame` com **n=42 no candidato contra n=20 no baseline**, e as
duas metades do candidato têm distribuições diferentes:

| população | n | p50 | p95 |
| --- | --- | --- | --- |
| baseline (frio, `clearState`) | 20 | 450,6 ms | 585,3 ms |
| active, 1º lançamento (frio, `clearState`) | 21 | 380,9 ms | 522,8 ms |
| active, 2º lançamento (retomada) | 21 | **288,3 ms** | **360,3 ms** |
| active, como o gate agrega hoje | 42 | 361,0 ms | 513,3 ms |

O relançamento é sistematicamente mais rápido, e misturá-lo puxa o p95 do
candidato para baixo. Comparando como com como — frio contra frio — o delta é
**−62,5 ms** em vez de −72 ms.

Neste caso a assimetria **não inverte a conclusão**, porque os dois cálculos dão
delta negativo e o desfecho já é inconclusivo por outro motivo. Mas ela invalida
qualquer verde futuro: um gate que compara 20 lançamentos frios com uma mistura de
21 frios e 21 quentes não está medindo a mesma coisa dos dois lados, e o número
que ele produzir será uma média de duas populações — exatamente a classe de erro
que já custou a esta saga a troca de `cold_start` por `first_frame`.

Isto nunca apareceu antes porque `first_frame` jamais tinha rodado como coorte
cheia: o piloto de 2026-08-10 usou 6+6 amostras e ninguém comparou as contagens.
`baselineCount` e `activeCount` sempre estiveram no relatório; faltou lê-los.

## Defeito de instrumento corrigido nesta janela

Na amostra 13 da coorte `active` o maestro **falhou e não saiu**: registrou a
falha no próprio log, começou a captura de diagnóstico e ficou dez minutos com
processo vivo a 0% de CPU. O orquestrador espera o filho encerrar para decidir se
repete, então a política de retentativa nunca foi consultada e a coorte parou —
sem sinal de erro, com todos os processos aparentemente saudáveis. Foi destravado
à mão, a tentativa virou `tentativa-2` e a coorte fechou.

O orquestrador passou a ter **limite por tentativa** (`--attempt-timeout-ms`,
padrão 600 s, ~3× a tentativa mais lenta observada), aplicado nos dois lugares que
importam: um `Promise.race` que libera a coorte e o `timeout` do próprio
`execFile`, que é o que mata o processo pendurado. O motivo de cada tentativa
(`ok`, `failed`, `timeout`) entra no manifesto, porque ferramenta travada e
produto defeituoso pedem ações opostas.

A captura preservada de `tentativa-1` também desfez uma leitura errada minha: eu
li nela o CTA "Continuar jornada" desenhado atrás da tab bar e cheguei a tratar
isso como defeito de produto. A fonte diz o contrário — `JourneyHomeScreen`
reserva `paddingBottom: tabBarClearance` no contêiner rolável. A captura é um
quadro no meio do scroll, e conteúdo passando sob uma tab bar flutuante é o
comportamento projetado.

## O que falta para fechar H3

1. **Repetir as duas coortes em host silencioso** — reinício para zerar o swap,
   Metro pré-aquecido, coortes em sequência. É a única forma de sair de
   `inconclusive`, e depende de janela do dono;
2. **Tornar as coortes comparáveis** antes de qualquer veredito: ou o gate passa a
   comparar apenas o lançamento frio dos dois lados, ou o flow de `active` para de
   contribuir com o relançamento para `first_frame`. É mudança de desenho do gate
   e está proposta, não executada;
3. seguem sem evidência, e nenhuma delas foi tocada nesta janela: **VoiceOver como
   serviço**, **TalkBack** (exige Android), **aparelho físico de tela baixa**,
   **"segunda falha invalida o checkpoint e volta à Home"** e **ausência de efeito
   duplicado após a retomada**.

Nada aqui promove gate de release. Produção segue `off` e o iOS continua em
`1.3.1 (7)`.
