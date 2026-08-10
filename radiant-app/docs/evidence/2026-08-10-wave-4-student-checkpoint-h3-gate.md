# Evidência — execução do gate operacional H3

**Data:** 2026-08-10
**Run Loop:** `run-1786354337237-662c1d8d`
**Escopo comprovado:** primeira execução real das coortes do gate H3
**Plataforma:** iOS Simulator apenas

## O que esta execução descobriu antes de medir qualquer coisa

O gate estava registrado como "preparado, faltando executar". Ele não estava
executável: **o runtime que o gate existe para medir nunca ligava**, e três
defeitos independentes do instrumento foram medidos nesta sessão, todos antes de
a primeira amostra válida existir.

### 1. A receita de Metro documentada não conseguia produzir `active`

`node_modules/expo/virtual/env.js` monta o env do cliente como

```js
{ ...process.env, ...('.env', '.env.development', '.env.local', ...) }
```

com os arquivos espalhados **depois** de `process.env` — o arquivo vence a linha
de comando, o inverso da precedência do próprio CLI, que registra no terminal
que não exportará variáveis já presentes no shell.

Como `radiant-app/.env` declara `EXPO_PUBLIC_APP_ENV=preview`, medido dentro do
processo em execução:

| leitura | valor |
| --- | --- |
| `process.env.EXPO_PUBLIC_APP_ENV` | `development` |
| `AppConfig.APP_ENV` | `preview` |
| `process.env.EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE` | `active` |
| `resolveStudentCheckpointRuntimeMode(APP_ENV, MODE)` | **`off`** |

`resolveStudentCheckpointRuntimeMode('preview','active')` devolve `off` por
contrato. O engano é seletivo e por isso convincente: `MODE` **não** está no
`.env`, então essa flag chegava certa, e só `APP_ENV` era sobrescrita.
`EXPO_NO_DOTENV=1` não corrige — ele governa o carregamento do CLI, não o módulo
virtual.

Consequência medida: com a receita documentada, o kernel não escrevia nada
(AsyncStorage sem chave de checkpoint), o probe resolvia `enabled: false` no
import, e o flow `student-checkpoint-active-resume.yaml` falhava na asserção do
CTA de retomada — o app reiniciava na Tela 1 de 3.

Correção: `radiant-app/.env.local` com `EXPO_PUBLIC_APP_ENV=development`, que é
espalhado depois de `.env`. É ignorado pelo git, mas **não** é isento do guarda
de escopo do Loop, então foi criado antes da abertura do run.

### 2. O canal de coleta não carregava o dado

O runbook mandava preservar o log do Metro. Medido: **nenhuma** saída de console
do app chega ao terminal do Metro neste Dev Client bridgeless — as linhas
`Require cycle` que parecem do app são do empacotador, em tempo de build — e o
log do sistema do simulador, com 12.084 linhas do processo, também não carrega
console JS.

O parser varre diretórios atrás do prefixo, então um canal vazio produz coorte
de tamanho zero, que o relatório reporta como **amostra insuficiente** — que se
lê como "faltou rodar", não como "o canal está quebrado".

Correção: coleta pelo inspector (CDP), filtrando pelo prefixo fechado, com
**controle positivo** executado antes de cada coorte (injetar uma linha
sintética e confirmar que ela chega ao arquivo que o parser lerá). O controle
foi o que separou "não emitiu" de "não capturei".

### 3. Replay de buffer do CDP inflaria as amostras

`Runtime.enable` reentrega as entradas de console bufferizadas do alvo, e o flow
reconecta o coletor a cada `killApp`/`launchApp` — 20 vezes por coorte. Sem
tratamento, cada reconexão duplicaria envelopes e corromperia o p95.

Isso foi observado concretamente: o log da coorte baseline recebeu duas linhas
com `"mode":"active"` — impossíveis num runtime `off` cujo probe está desligado —
que eram replay do buffer da instância anterior do app. As duas linhas foram
removidas e o coletor passou a deduplicar por `(timestamp do CDP, linha)`, chave
que é estável entre reentregas e distinta entre emissões verdadeiras. O parser
nunca leu logs do diretório baseline (`buildCheckpointPerformanceReport` só
analisa `activeLog`), então o relatório não foi afetado; o registro fica porque
a contaminação era real e teria enganado a leitura humana.

### 4. O primeiro flow depois de `--clear` é descartável

Com o bundler frio, os três guards `runFlow when visible` do topo dos flows são
avaliados antes de o dev menu aparecer, os três são pulados, e a falha se
manifesta três passos adiante — na primeira asserção obrigatória, com mensagem
de seletor errado. Cada coorte passou a rodar um aquecimento descartado.

## Prova de instrumento

Registrada como `instrument-proof.json` em cada diretório de coorte, lida
**dentro do processo** pelo inspector, antes de qualquer amostra:

| coorte | leitura |
| --- | --- |
| baseline | `{"APP_ENV":"development","modoResolvido":"off","probeEnabled":false,"probeMode":"off"}` |
| active | `{"APP_ENV":"development","modoResolvido":"active","probeEnabled":true,"probeMode":"active"}` |

O baseline silencioso é garantido por construção, não por log vazio: o probe
está desabilitado e não pode emitir.

## Aparelho, binário e perfil

- simulador `Radiant iPhone 17 Pro`, iOS 26.5, UDID
  `3DA4F77E-086B-4C6F-A0B5-FECEA0F4A164`;
- build EAS `2d718691-288d-498e-9825-a03b14411bd2`, perfil
  `checkpoint-internal-simulator`, Dev Client, distribuição interna;
- artefato `sha256 = 9f470284eccaf03d30b018cedac4004961dfbbe2356b160d16b256bfe05ec917`;
  binário Mach-O `sha256 = 1e5d423321c0688f66c313d479b6fb0f04780b9e97e854cc898995dd39a32576`;
- `CFBundleShortVersionString = 1.3.1`, **`CFBundleVersion = 3`**.

**O `(7)` que quatro documentos atribuíam a este build é o contador remoto do
EAS** (`appVersionSource: remote`), não o número embutido no binário. Como
`1.3.1 (7)` é a versão em revisão na App Store, o texto anterior fazia este
build interno de simulador parecer o artefato submetido. Corrigido em
2026-08-10 no status canônico, na fila, no roadmap e na evidência de 2026-08-09.

O mesmo binário, aparelho e perfil serviram às duas coortes; só as variáveis
`EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE` e
`EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE` mudaram entre elas.

## Coorte baseline (`off`)

20 execuções de `.maestro/student-checkpoint-performance-baseline.yaml`,
**20/20 verdes**, tempo de parede por execução entre 125 s e 130 s.

| métrica | n | mín | mediana | p95 | máx |
| --- | ---: | ---: | ---: | ---: | ---: |
| cold start | 20 | 2754 ms | 2989 ms | **3351 ms** | 3592 ms |
| Home→Lição | 20 | 7410 ms | 7586 ms | **8008 ms** | 8025 ms |

Limites de delta que isso fixa, pela fórmula `max(0,05 × baseline, 50 ms)`:
cold start **167,6 ms**; Home→Lição **400,4 ms**.

## Limite de leitura do cold start

`cold_start` é a duração do comando `launchApp` do Maestro. Num Dev Client esse
comando termina no *launcher* do cliente de desenvolvimento, antes de o bundle
JS ser buscado e avaliado — o kernel de checkpoints não está vivo nessa janela.
A métrica mede lançamento nativo, não o cold start percebido pelo usuário, e o
gate de delta sobre ela é estruturalmente quase cego ao que pretende proteger.
`home_to_lesson` não tem esse problema: mede trabalho real do app com o kernel
ativo.

Isto não invalida as amostras; delimita o que elas provam. Fechar essa lacuna
exige uma marca de tempo emitida pelo app no primeiro frame útil, que não existe
hoje e não foi criada nesta sessão.

## Coorte active

20 execuções de `.maestro/student-checkpoint-active-resume.yaml`, **20/20
verdes**, 142 s a 163 s por execução. O flow cobre instalação limpa, abandono no
segundo slide, modo avião, kill/relaunch, ausência de redirect antes do CTA,
retomada explícita e retorno à Home.

**62 envelopes** coletados, todos com `"mode":"active"`: 42 de persistência e 20
de restauração. Dois dos 42 de persistência podem vir do aquecimento descartado,
reentregues pelo buffer do CDP quando o coletor conectou; excluí-los não muda
nenhum veredito.

| métrica | n | p95 | limite | resultado |
| --- | ---: | ---: | ---: | --- |
| persistência | 42 | **15,7 ms** | 75 ms | dentro |
| restauração | 20 | **10,6 ms** | 100 ms | dentro |

| delta | baseline p95 | active p95 | delta | permitido | resultado |
| --- | ---: | ---: | ---: | ---: | --- |
| Home→Lição | 8008 ms | 7834 ms | **−174 ms** | 400,4 ms | dentro |
| cold start | 3351 ms | 3618 ms | **+267 ms** | 167,6 ms | **excede** |

`report.json`: `"passed": false`.

## O gate falha, e a falha é do instrumento

O relatório reprova no delta de cold start. A causa não é atribuível ao kernel,
e isto é medição, não alegação:

- a amplitude interna do cold start é **838 ms** no baseline e **833 ms** no
  active. O delta permitido — 5 % do p95, ou **167,6 ms** — é **cinco vezes
  menor que a dispersão da própria medida**. O gate exige uma resolução que o
  instrumento não tem;
- p95 sobre 20 amostras é o 19º valor ordenado, isto é, um ponto da cauda; as
  duas caudas se sobrepõem (baseline 3191/3351/3592, active 3476/3559/3618);
- a mediana move 2989 → 3094 ms, +105 ms, também abaixo do ruído;
- estruturalmente, o kernel é JavaScript e não existe durante a janela medida:
  `launchApp` num Dev Client termina no launcher, antes de o bundle ser buscado.
  A métrica não pode observar o que o gate quer proteger;
- onde o kernel **pode** aparecer — Home→Lição, com o app carregado — o delta é
  **negativo**.

**Isso não promove H3.** O gate falha como especificado, e um gate cujo limite
está abaixo do ruído do próprio instrumento precisa ser corrigido antes de poder
aprovar ou reprovar qualquer coisa. Duas correções possíveis, nenhuma executada
aqui: emitir do app uma marca de primeiro frame útil, que o kernel possa de fato
influenciar; ou derivar o limite da dispersão medida em vez de um 5 % fixo.

## Acessibilidade — um bloqueio real encontrado

**Árvore de acessibilidade da tela de retomada, em tamanho padrão:** título,
corpo e os dois botões aparecem como nós separados e rotulados
(`Continuar de onde você parou?`, `Há uma etapa salva neste aparelho…`,
`Retomar estudo`, `Ir para a jornada`). Não há o colapso de grupo que já afeta a
ilustração do `WelcomeSlide`.

**Com Dynamic Type grande, a tela vira um beco sem saída.** Medido variando
`simctl ui <UDID> content_size`:

| tamanho | `Retomar estudo` na árvore |
| --- | --- |
| `medium` … `extra-extra-extra-large` | presente |
| `accessibility-medium` (AX1) … `accessibility-extra-large` (AX3) | presente |
| `accessibility-extra-extra-large` (AX4) | **ausente** |
| `accessibility-extra-extra-extra-large` (AX5) | **ausente** |

Em AX5 os limites medidos são: tela `[0,0][402,874]`, título
`[33,-257][369,278]` — começando **acima** do topo — e corpo `[33,294][369,1066]`
— terminando **abaixo** do fim. Os dois botões não são renderizados.
`CheckpointResumeScreen` (`src/app/_layout.tsx`) monta
`SafeAreaView > View(center) > SurfaceCard` **sem `ScrollView`**, então não há
como rolar até eles.

Consequência: um usuário nos dois maiores tamanhos de acessibilidade que tenha
um checkpoint salvo abre o app numa tela **sem nenhum controle** — não retoma e
não vai para a jornada. É o oposto do que o item "viewport curto sem bloqueio"
exige, e é o motivo mais forte para H3 continuar aberta.

O defeito **não foi corrigido nesta sessão**: é código de produto, fora do
escopo declarado deste run, e a correção é uma decisão de desenho (tornar o
cartão rolável, limitar a escala do texto, ou as duas) que merece TDD próprio.

## O que esta sessão não fez

- **VoiceOver como serviço** não foi executado; o que existe é a auditoria da
  árvore de acessibilidade acima, que é evidência sobre exposição, não sobre
  navegação real com o leitor ligado;
- **TalkBack** exige Android, e nenhuma coorte Android foi executada;
- **viewport curto** não foi testado. A razão registrada aqui — "este host não tem
  device type SE" — foi **medida como falsa em 2026-08-10** e está corrigida na
  seção *O bloqueio de viewport curto não existia* ao fim deste documento: o
  runtime iOS 26.5 instalado suporta `iPhone SE (3rd generation)`, `iPhone 13 mini`
  e `iPhone 12 mini`. O que continua verdadeiro é que **aparelho físico** baixo não
  existe aqui, e que o teste de Dynamic Type acima, embora seja a condição de
  layout mais dura já exercitada, não substitui nem o simulador curto nem o
  aparelho;
- **"segunda falha invalida o checkpoint e volta à Home"** não é exercitado por
  nenhum dos dois flows; continua sem evidência de aparelho;
- **kill/relaunch sem duplicação**: o flow prova que a retomada funciona offline
  após kill/relaunch, 20 vezes. Ele **não** afirma ausência de efeito duplicado —
  não há asserção sobre progresso, XP ou tentativa depois da retomada;
- nenhum build, OTA, submit, push, publicação ou alteração de arquivo de versão.
  Produção permanece `off` e `1.3.1 (7)` intocada.

## Correção do bloqueio P0 — run `run-1786366083722-93ee4bf4`

`CheckpointResumeScreen` passou a montar o conteúdo num `ScrollView` cujo
contêiner usa `flexGrow: 1` em vez de `flex: 1`. A troca é o ponto da correção,
não um detalhe: num `contentContainerStyle`, `flex: 1` prende a altura ao
viewport e a rolagem nunca acontece — usá-lo aqui recriaria o defeito com a
aparência de tê-lo corrigido. `flexGrow: 1` centraliza enquanto o cartão cabe e
deixa crescer quando não cabe.

`StartupScreen`, que compartilhava o mesmo estilo `content`, ficou intocada: a
correção usa um estilo próprio (`resumeScrollContent`).

**Prova de que o teste morde.** O caso novo em `startup-gate.flow.test.tsx` foi
vermelho antes da implementação (o `testID` do contêiner não existia) e a
asserção que guarda o mecanismo foi verificada por mutação: trocando
`flexGrow: 1` por `flex: 1` no contêiner, o caso fica **vermelho**; revertido,
volta a verde. Suíte do arquivo: **17/17**.

**Limite declarado desta prova.** O ambiente de teste não calcula layout, então
nenhum caso observa o transbordo em si. O que está fixado é o mecanismo que
torna os botões alcançáveis quando o transbordo acontece. **A prova em aparelho
nos tamanhos AX4/AX5 ainda não foi feita** e está registrada como parte da
reexecução das coortes: ela exige `radiant-app/.env.local`, que não está em
`context.excludes` e portanto não pode ser criado dentro de um run já aberto sem
custar o run.

## Correção do gate de cold start — run `run-1786366490575-a0a0c4cb`

O limite de delta ganhou um terceiro termo:

```
max(0,05 × baseline_p95, 50 ms, baseline_p95 − baseline_p50)
```

O terceiro é o piso de ruído medido do próprio baseline. A justificativa está na
seção anterior: um limiar de 167,6 ms sobre uma medida cuja amplitude interna é
~835 ms reprova por ruído, qualquer que seja a mudança sob teste. O relatório
passou a reportar `baselineP50Ms` e `noiseFloorMs` em cada gate de delta, para o
leitor ver qual dos três termos mandou.

**A correção não afrouxa o gate onde ele já era significativo:** com baseline sem
dispersão o terceiro termo é zero e os dois originais continuam mandando. Isso
está fixado por um segundo caso de teste, que reprova um delta de 60 ms contra
um baseline plano.

**Prova de mutação:** removido `noiseFloorMs` do `Math.max`, o caso do piso de
ruído fica **vermelho**; revertido, a suíte fecha em **6/6**. Os dois casos novos
estavam vermelhos antes da implementação.

**Efeito declarado sobre o veredito já registrado.** Recalculando o relatório
sobre as coortes de hoje, sem recoletar nada:

| gate | delta | permitido (5 % / fixo / ruído) | antes | agora |
| --- | ---: | --- | --- | --- |
| cold start | +267 ms | 362 ms (167,6 / 50 / **362**) | reprovava | passa |
| Home→Lição | −174 ms | 422 ms (400,4 / 50 / **422**) | passava | passa |

Guardado como `report-recalculado-limiar-consciente-de-ruido.json`, ao lado do
`report.json` original, que **não foi sobrescrito** — ele é o registro da
primeira execução e está citado acima.

Isto inverte o veredito que esta mesma evidência registrou horas antes, e é
preciso dizê-lo sem rodeio. O que sustenta a inversão não é o resultado ser mais
conveniente: é que o limiar anterior estava abaixo da resolução do instrumento,
o que foi medido antes de a correção existir. Mesmo assim, **este recálculo não
promove H3**: ele roda sobre coortes coletadas antes da correção da tela de
retomada, e a medição que vale é a reexecução no build corrigido.

## Reexecução no build corrigido — run `run-1786366830631-0755376c`

As duas correções entraram antes desta medição. O binário nativo é o mesmo
(`CFBundleVersion = 3`); o JS corrigido vem do Metro, que é como um Dev Client
carrega código — a exigência de "mesmo binário" vale para o artefato nativo, e
as duas coortes usaram exatamente o mesmo.

### Três passagens, e por que só a terceira conta

| passagem | condição | destino |
| --- | --- | --- |
| 1ª (manhã) | host ocioso, swap 0 | `h3-2026-08-10-primeira-execucao` |
| 2ª | coortes separadas por ~1 h, swap 0 → 2781 MB | `h3-2026-08-10-segunda-execucao-host-degradado` |
| 3ª | coortes **em sequência**, no mesmo script | `h3` |

A 2ª passagem foi **descartada por método, não por resultado**: baseline e
candidato foram medidos com uma hora de intervalo e cargas de host diferentes, e
o delta de cold start saiu em **+6021 ms** — impossível de vir da mudança, já
que num Dev Client a janela do `launchApp` é lançamento nativo e o `ScrollView`
só existe no JS. O que a explicava era o host: swap em 2781 MB de 3072 MB e load
5,58, contra swap zero pela manhã. Nenhuma das duas primeiras passagens foi
apagada.

### Terceira passagem — 20/20 e 20/20

Uma execução da coorte `active` falhou e foi repetida automaticamente
(`retentativas=1`). **A assinatura dessa falha não foi preservada**: o runner
grava cada tentativa no mesmo arquivo e apaga o diretório antes de repetir, então
o log da tentativa perdida foi sobrescrito. É defeito da instrumentação desta
sessão, não do app, e impede afirmar que foi a mesma corrida de guard das outras.

Trajetória do host, registrada pelo próprio script:

| momento | swap usado | load 1 min |
| --- | ---: | ---: |
| início do baseline | 1698 MB | 34,31 (pico do Metro compilando) |
| fim do baseline | 3274 MB | — |
| início do active | 3274 MB | 5,92 |
| fim do active | 2227 MB | — |

### Resultado do gate

| gate | medido | limite | veredito |
| --- | ---: | ---: | --- |
| persistência p95 | **23,1 ms** (n=43) | 75 ms | passa |
| restauração p95 | **9,0 ms** (n=20) | 100 ms | passa |
| delta Home→Lição p95 | **+152 ms** | 591 ms | passa |
| delta cold start p95 | **+918 ms** | **2863 ms** | passa, **e o passe é vazio** |

`report.json`: `"passed": true`.

**O verde do cold start não prova nada, e isso precisa ficar escrito ao lado do
verde.** O piso de ruído desta coorte é 2863 ms — metade do próprio p95 do
baseline (5748 ms), porque o host estava em swap. Um limite que tolera 2,9
segundos não distingue regressão de flutuação; ele apenas declara que a medição
não tem resolução. Comparado com a coorte da manhã, o piso saltou de **362 ms**
para 2863 ms.

**Correção de atribuição, feita em 2026-08-10 lendo os `report.json` em vez desta
prosa.** Uma versão anterior deste parágrafo dava 883 ms como o piso da coorte da
manhã. Os 883 ms existem, mas pertencem à **segunda passagem** — a que esta mesma
evidência descarta por método —, e o piso da manhã é 362 ms sobre um p95 de
3351 ms. O erro importava além da aritmética: 883/3591 = 24,6% e 362/3351 = 10,8%
caem em lados opostos de qualquer teto candidato, e era esse número que motivava a
escolha do teto. Passagens irmãs da mesma métrica produzem valores de magnitude
parecida e se trocam sem deixar rastro na prosa; o número que decide vai lido do
artefato que o produziu.

Isto expõe um limite da correção feita hoje no gate: o limiar consciente de ruído
elimina o falso-negativo e, num host que degrada, **troca-o por um passe vazio**.
As duas falhas são do instrumento, não do produto, e a segunda é mais perigosa
porque tem cara de aprovação. A correção que falta é um terceiro desfecho
explícito — *inconclusivo* — quando o piso de ruído domina o próprio baseline.

**Persistência e restauração, ao contrário, são conclusivas.** São medidas dentro
do app, com 43 e 20 amostras, e ficam a um terço e a um décimo dos limites. São
elas que medem o custo do kernel, e ele é pequeno.

### Prova em aparelho da correção da tela de retomada

Executada no mesmo simulador, variando `simctl ui <UDID> content_size`:

| tamanho | `Retomar estudo` alcançável |
| --- | --- |
| `medium` | sim, sem rolar |
| `accessibility-extra-large` (AX3) | sim |
| `accessibility-extra-extra-large` (AX4) | **sim, rolando** |
| `accessibility-extra-extra-extra-large` (AX5) | **sim, rolando** |

Em AX5 o flow completo passou: chega à tela de retomada, rola até o CTA, toca e
volta para a Tela 2 de 3. Antes da correção, esse mesmo caminho terminava numa
tela sem controle nenhum. **O bloqueio P0 está fechado.**

**Um erro de leitura, registrado porque quase inverteu a conclusão.** A primeira
verificação usou presença na árvore de acessibilidade — o mesmo instrumento que
diagnosticou o defeito — e mostrou os botões ausentes em AX4/AX5, o que parecia
provar que a correção falhara. Não provava: depois do `ScrollView`, "ausente da
árvore" deixou de significar "não renderizado" e passou a significar "abaixo da
dobra". O instrumento mudou de sentido junto com a correção, e só o teste de
rolar-e-tocar responde à pergunta certa.

## Terceiro desfecho do gate — run `run-1786383400260-6ad60081`

O gate só sabia aprovar ou reprovar, e por isso aprovou vazio. Ele passou a ter
três desfechos, expostos em cada gate e no relatório como `outcome`:

| `outcome` | significado | próxima ação |
| --- | --- | --- |
| `pass` | mediu e está dentro do limite | seguir |
| `fail` | mediu e o candidato excedeu o limite | investigar o **produto** |
| `inconclusive` | não mediu — `insufficient-samples` ou `measurement-too-noisy` | remedir o **instrumento** |

`inconclusive` é falha fechada: `passed` continua `false`, então nenhum leitor
promove com ele. A distinção entre os dois desfechos negativos não é
terminológica — as ações que eles pedem são opostas, e `passed: false` sozinho
não as distinguia. `insufficient-samples` migrou para o mesmo desfecho pela mesma
razão: amostra faltando é a outra forma de não ter medido, e `fail` fica reservado
ao candidato que regrediu de fato.

### O teto, e por que é um quinto

`measurement-too-noisy` dispara quando `noiseFloorMs > maxNoiseFloorMs`, com o
teto em **0,2 × baseline_p95**. A fração não é escolhida por gosto: o desenho
original deste gate pedia resolução para detectar 5% de regressão, e o teto
permite que a medição perca no máximo **quatro vezes** essa sensibilidade. Acima
disso, "dentro do limite" tolera um quinto da métrica inteira e não carrega
informação sobre o produto.

O teto é checado **antes** da comparação de delta. Sem resolução, nem "dentro"
nem "excede" são afirmações sobre o software — foi literalmente o comportamento da
segunda passagem, cujo delta de +6021 ms esta evidência já atribui ao host.

As razões de ruído medidas em 2026-08-10 são a calibração, e o teto de 0,2 as
separa com folga nos dois lados:

| passagem | métrica | piso / p95 do baseline | razão | desfecho novo |
| --- | --- | ---: | ---: | --- |
| 1ª, host ocioso | cold start | 362 / 3351 | **0,108** | conclusiva |
| 2ª, descartada por método | cold start | 883 / 3591 | **0,246** | `inconclusive` |
| 3ª, host em swap | cold start | 2863 / 5748 | **0,498** | `inconclusive` |
| as três | Home→Lição | — | 0,053 · 0 · 0,073 | conclusivas |

A linha que mais sustenta o teto é a segunda: aquela passagem foi descartada por
**julgamento humano**, lendo a trajetória do swap. Sob o desfecho novo o próprio
instrumento a recusa, sem depender de alguém notar. Um gate que precisa de um
leitor atento para não aprovar vazio não é um gate.

### Efeito declarado sobre os vereditos já registrados

Recalculado sobre as três passagens no disco, sem recoletar nada e sem sobrescrever
nenhum `report.json`:

| passagem | antes | agora |
| --- | --- | --- |
| 1ª, host ocioso | `passed: false` (167,6 ms de limite, pré-correção do limiar) | `outcome: pass` nos quatro gates |
| 2ª, host degradado | `passed: false` por delta excedido | `outcome: inconclusive` — ruído e amostra |
| 3ª, host em swap | `passed: true`, **passe vazio** | `outcome: inconclusive` no cold start; `passed: false` |

**A primeira passagem agora fecha conclusiva e verde, e isso NÃO promove H3.** Ela
foi medida antes da correção da tela de retomada, ou seja no build que não é o
candidato. A medição que vale continua sendo uma passagem no build corrigido com
o host ocioso, e ela não existe: a terceira passagem é a do build correto e é
justamente a que sai `inconclusive`. As duas condições — build corrigido e host
ocioso — nunca coincidiram numa mesma execução.

**Persistência e restauração seguem conclusivas nas duas passagens válidas** —
23,1 ms (n=43) e 9,0 ms (n=20) na terceira, contra 75 ms e 100 ms. São elas que
medem o custo do kernel dentro do app, e nenhuma correção deste run as toca.

### Prova de que os testes mordem

Três casos novos, todos vermelhos antes da implementação, e cinco mutações
verificadas uma a uma:

| mutação | caso que fica vermelho |
| --- | --- |
| remover a guarda de ruído (`tooNoisy = false`) | o do piso dominante |
| trocar `>` por `>=` na fronteira | o da fronteira exata |
| afrouxar o teto de 4× para 2× a sensibilidade | o do host ocioso |
| remover `noiseFloorMs` do limite permitido | o da cauda superior |
| tirar `insufficient-samples` do desfecho inconclusivo | o de amostra insuficiente |

As três primeiras mordem um caso cada, o que é a forma forte: cada asserção nova
sustenta sozinha um pedaço distinto da regra. Suíte do arquivo: **9/9**.

**Uma fixture pré-existente foi trocada, e a troca é substantiva.** O caso
`never demands a delta finer than the baseline own upper-tail spread`, escrito
horas antes, usava baseline p50=1000/p95=1400 — piso de 400 ms sobre 1400 ms,
razão de **28,6%**. Escrito antes de o teto existir, ele afirmava que uma medição
nesse nível de ruído **aprova**, que é exatamente o passe vazio que o teto passou
a recusar. Manter os números exigiria isentar aquele caso da regra nova, o que
anularia a regra. A fixture nova preserva o que o caso protege — quando a cauda
medida supera os dois termos originais, é ela que manda — dentro da faixa em que a
medição ainda conclui: piso de 600 ms sobre 4000 ms, razão de 15%, teto de 800 ms.
A mutação que remove o termo de ruído continua derrubando o caso.

### O que este run não fez

- **não remediu o cold start.** A remedição exige host ocioso e sem sessão de
  agente, e esta sessão é a carga que o runbook manda ausentar; ela pertence a uma
  janela de host, não a um run de código;
- não executou coorte nenhuma, não gerou build, OTA, submit, push ou publicação;
- não tocou os `report.json` no disco: os três seguem sendo o registro do que foi
  medido sob o gate vigente na hora, e o recálculo acima foi feito em memória;
- VoiceOver como serviço, TalkBack, viewport fisicamente curto, "segunda falha
  invalida o checkpoint" e ausência de efeito duplicado continuam sem evidência.

## O bloqueio de viewport curto não existia — run `run-1786384165251-d65b7a00`

Cinco documentos declaravam, em seis lugares, que "este host não tem device type
SE (4,7\")" e que por isso o viewport curto ficava sem evidência. **É falso, e a
medição é de um comando:**

```sh
xcrun simctl list runtimes --json   # supportedDeviceTypes do runtime instalado
```

O runtime **iOS 26.5**, o mesmo que rodou as duas coortes, declara como suportados
`iPhone SE (3rd generation)` (375 × 667 pt), `iPhone 13 mini` e
`iPhone 12 mini` — além dos iPad mini. `xcrun simctl list devicetypes` também
lista SE de 1ª, 2ª e 3ª geração. Não há device type faltando, e nunca houve
tentativa registrada de criar um.

**O que isso muda e o que não muda.** O teste de viewport curto **em simulador**
está alcançável neste host e simplesmente não foi executado; a frase que o
bloqueava era um bloqueio inventado, do tipo que o protocolo multi-IA existe para
evitar, porque a próxima sessão o lê e pula trabalho que dá para fazer. O que
**continua** verdadeiro é que não há **aparelho físico** de tela baixa aqui — e
essa é a afirmação que a evidência deveria ter feito desde o começo. As duas
condições foram fundidas numa só frase, e a mais forte das duas ("não temos o
device type") era a errada.

Nada foi executado neste run além da correção do texto: criar o simulador,
instalar o Dev Client, subir o Metro com `radiant-app/.env.local` e rodar o flow
de retomada em AX4/AX5 numa tela de 667 pt é uma janela de host própria, com o
mesmo procedimento da seção **Gate H3** do `E2E_RUNBOOK`, e continua pendente.

## Viewport curto fechado em simulador — run `run-1786385853053-960f7e28`

O bloqueio inventado da seção anterior deixou o teste alcançável, e ele foi
executado. **A tela de retomada funciona na viewport mais curta que este host
oferece, nos quatro tamanhos exercitados**, incluindo os dois maiores de
acessibilidade.

### Aparelho e binário

- simulador `Radiant SE 4.7`, `iPhone SE (3rd generation)`, iOS 26.5, UDID
  `36CB3EC6-1EE9-4F60-AD4A-328AA2A55E45`;
- viewport medida na árvore: **`[0,0][375,667]`** — contra `[0,0][402,874]` do
  `iPhone 17 Pro` usado nas coortes. São **207 pt menos de altura**;
- **o mesmo binário nativo das coortes H3**, copiado do bundle instalado no
  simulador do gate: Mach-O
  `sha256 = 1e5d423321c0688f66c313d479b6fb0f04780b9e97e854cc898995dd39a32576`,
  `CFBundleShortVersionString = 1.3.1`, `CFBundleVersion = 3`;
- Metro em `active` pela receita do runbook, com `radiant-app/.env.local`.

### Flow versionado, e a identidade do que foi medido

`.maestro/student-checkpoint-short-viewport.yaml`,
`sha256 = b03efc9861897c35f747df3a05e86b9b0ad14aa20bca093e6496e986638b712e`. As
execuções rodaram de uma cópia **byte a byte idêntica** fora da árvore, com os
artefatos também fora dela, porque o Metro escreve em `.expo/` enquanto roda e um
run do Loop aberto sob essa escrita arrisca `OUT_OF_SCOPE_CHANGE`. O hash acima é
o do arquivo versionado e o do arquivo executado.

O flow cobre o caminho inteiro, não só o toque: instalação limpa, abandono no
segundo slide, modo avião, `killApp`/`launchApp`, presença do CTA, **ausência de
redirect automático** (`Tela 2 de 3` não visível antes do toque), rolagem até o
CTA, toque, e volta para `Tela 2 de 3`.

### Resultado

| `content_size` | desfecho |
| --- | --- |
| `medium` | passou |
| `accessibility-extra-large` (AX3) | passou |
| `accessibility-extra-extra-large` (AX4) | passou |
| `accessibility-extra-extra-extra-large` (AX5) | passou |

O aquecimento anterior à primeira medição foi descartado e trouxe a assinatura
documentada da corrida do bundler frio: o guard da URL executou e tocou, os dois
guards do dev menu saíram `SKIPPED`, e a falha apareceu três passos adiante, na
primeira asserção obrigatória.

### O que a viewport curta ensinou, e não foi o resultado

**Em AX5 numa tela de 667 pt nem o corpo do cartão cabe.** A primeira versão
deste flow ancorava a espera exigida pelo contrato — o `assertVisible`
imediatamente antes de `scrollUntilVisible` — no corpo do cartão
(`Há uma etapa salva neste aparelho…`). Ela **reprovou em AX5**, e passou nos
outros três, numa tela em que o CTA era alcançável e o produto funcionava. A
âncora, não a tela, era o defeito: numa viewport curta o único elemento
garantidamente visível antes de rolar é o **primeiro**. A regra do contrato pede
uma espera; a escolha de quem espera é o que a viewport curta restringe. Está
registrado no próprio flow e no comentário da lista do contrato.

Isso é uma medição sobre a régua do contrato, e ela agora cobre um caso que
nenhum flow anterior exercia: os cinco flows já listados rodam em telas de 6,1"
ou mais, onde qualquer elemento do primeiro cartão serve de âncora.

### Um instrumento que não serve, pela terceira vez

`maestro hierarchy`, invocado **como comando separado** depois de o flow parar na
tela de retomada, discordou da asserção que o próprio Maestro havia acabado de
completar: em **4 de 5 leituras** o nó do título não aparecia na árvore, embora
`assertVisible: 'Continuar de onde você parou?'` tivesse fechado `COMPLETED`
segundos antes. A leitura que populou trouxe, em AX5:

| nó | bounds |
| --- | --- |
| tela | `[0,0][375,667]` |
| `checkpoint-resume-scroll` (o `ScrollView` da correção) | `[0,20][375,667]` |
| título | `[33,53][342,589]` — **536 pt de 667** |
| `Retomar estudo` | ausente da árvore |
| `Ir para a jornada` | ausente da árvore |

Consistente com "abaixo da dobra, alcançável rolando", e o indicador de rolagem
aparecia em `[342,20][372,667]`. Mas **essa leitura não é o instrumento**: um
comando que discorda de si mesmo em 4 de 5 tentativas não prova nem presença nem
ausência. O instrumento é a asserção dentro do flow em execução, e a pergunta que
importa continua sendo rolar-e-tocar.

É a **terceira** vez neste mesmo documento que a árvore de acessibilidade é o
instrumento errado para esta pergunta: primeiro diagnosticou o defeito e depois
mudou de sentido junto com a correção; agora discorda de si mesma entre
invocações. A lição já registrada se mantém e ganha uma forma mais forte: para
"o usuário alcança o controle?", só rolar e tocar responde.

### Lacuna declarada do contrato

O bloco `scrollUntilVisible` deste flow usa a forma curta
(`element: 'Retomar estudo'`), e a regra de *uma régua de visibilidade por
seletor* casa apenas blocos com `id:`. O flow declara `visibilityPercentage: 100`
e é o único que rola até esse elemento, então não há divergência hoje; a lacuna
fica registrada em vez de ser fechada com uma edição não medida — trocar a forma
do bloco depois da medição invalidaria a identidade do arquivo executado.

### O que este run NÃO fecha

- **aparelho físico** de tela baixa continua inexistente aqui, e um simulador de
  375 × 667 pt não o substitui: não há toque real, densidade real nem pressão de
  memória real;
- **VoiceOver como serviço** e **TalkBack** seguem sem evidência;
- **"segunda falha invalida o checkpoint e volta à Home"** e **ausência de efeito
  duplicado após a retomada** seguem sem flow que os afirme;
- nenhum build, OTA, submit, push ou publicação. Produção segue `off`.

## Marca de primeiro frame — run `run-1786392781118-5b1f744b`

As duas correções anteriores do gate o tornaram **honesto**: o limiar consciente de
ruído removeu a reprovação espúria, e o desfecho `inconclusive` removeu o passe
vazio. Nenhuma o tornou **significativo**. Esta muda a métrica.

Desenho aprovado pelo dono:
[`2026-08-10-marca-de-primeiro-frame-design.md`](../../../docs/superpowers/specs/2026-08-10-marca-de-primeiro-frame-design.md).

### O que passa a ser medido

`first_frame`: do início da janela JS até o frame seguinte a `startupPhase` virar
`ready` em `RootLayout`. O ponto não é arbitrário — `ready` só acontece depois do
bootstrap e, decisivamente, depois de
`getNativeActiveCheckpointRuntime(checkpointMode).inspectLaunch(...)`, que é o
trabalho de partida do kernel. **O kernel está dentro da janela por construção.**
A leitura final vai num `requestAnimationFrame`, para medir o frame pintado e não o
commit do React — a armadilha de TTI de marcar quando montou em vez de quando está
utilizável.

**Emitida em todos os modos do kernel**, gated apenas em `APP_ENV === 'development'`
e `EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE`. É isso que faz a coorte de
comparação existir, e é o ponto que a justificativa do descarte anterior não
cobria: aquele motivo — "o probe só liga em `active`" — vale para o probe de
checkpoint e não para um timestamp de inicialização, que não é dado de checkpoint e
não toca store nenhum.

### Uma correção de unidade feita durante a implementação

O desenho dizia usar `global.__BUNDLE_START_TIME__` como origem. Foi **recusado**:
aquele valor vive numa base de tempo diferente de `performance.now()`, e subtrair as
duas daria um número com cara de duração e sem significado — bug de unidade, não de
precisão. A origem passou a ser lida com o **mesmo relógio** do fim da janela, na
avaliação do módulo emissor. Para um delta entre duas coortes no mesmo binário,
consistência da base vale mais que completude: o que se perde é a avaliação de
bundle anterior ao módulo, e se perde **igualmente nas duas coortes**.

### `cold_start` sai do veredito

Decisão do dono em 2026-08-10. Ele continua calculado e reportado, agora com
`advisory: true`, e **fora** de `report.passed`. A razão está no código: mede uma
janela em que o kernel não existe, e foi tentando gateá-lo que o relatório primeiro
reprovou por ruído e depois aprovou vazio. Fica reportado porque a série histórica
das três passagens deste dia vale como contexto, e porque uma regressão de
lançamento **nativo** só apareceria ali. Reverter é tirar o nome de
`ADVISORY_GATES`.

O relatório passou a declarar `advisory` em **todos** os gates, para que nenhum
leitor precise saber de cor quais entram no veredito.

### "Off silencioso" passou de afirmação a asserção

Era uma garantia sobre construção: o probe está desabilitado e não pode emitir. Com
o baseline passando a ser lido — o log dele **já era coletado** e era descartado —
virou asserção: o gate `baseline_isolation` **reprova o relatório** se um log de
baseline carregar `persistence` ou `restoration`.

Isso não é hipotético. Nesta mesma data, duas linhas `"mode":"active"` apareceram
num log de baseline por replay do buffer do CDP, e a seção correspondente desta
evidência registra que o relatório não foi afetado *porque o baseline não era lido*.
Agora seria.

### Provas

Emissor, **9/9** no arquivo, com os casos novos vermelhos antes da implementação:
emite nos dois modos (a asserção que sustenta a coorte), uma vez só por lançamento
mesmo com o gatilho repetindo, silencioso quando desabilitado e sem ler o relógio,
não emite duração negativa nem não finita, e emissor que lança não alcança o caminho
de aprendizagem. `startup-gate.flow.test.tsx` segue **17/17**; typecheck limpo.

Relatório, **14/14**, com cinco mutações verificadas:

| mutação | caso que fica vermelho |
| --- | --- |
| não ler o log do baseline | oito casos, entre eles os dois de isolamento |
| tornar `first_frame_delta` informativo | os três do `first_frame` |
| voltar a gatear `cold_start` | os três que documentam a semântica nova |
| isolamento do baseline sempre passa | **só** o da contaminação |
| `first_frame` deixa de ser métrica válida | sete casos |

**Três casos pré-existentes foram re-ancorados**, e é a terceira vez neste dia que o
mesmo padrão aparece: um teste escrito sob a semântica antiga afirma, no nível do
**relatório**, o que a decisão nova mudou. As asserções de **gate** deles continuam
idênticas — é o veredito que deixou de seguir o cold start. Cada um carrega a nota
explicando isso no lugar onde alguém se confundiria, e a guarda equivalente no nível
do relatório passou a morar nos casos do `first_frame`.

### O que este run NÃO fez

- **não rodou coorte nenhuma.** A medição continua pendente e continua precisando de
  janela de host, mas a expectativa é que dependa **muito menos** de host silencioso,
  porque a janela é medida dentro do app — a classe de dispersão das medidas que já
  são conclusivas (23,1 ms e 9,0 ms de p95 contra limites de 75 e 100). **Isso é
  hipótese até a coorte existir**, e está escrito como hipótese;
- nenhum build, OTA, submit, push ou publicação; nenhuma dependência nova e nenhum
  binário novo — a mudança é JS e o Dev Client a pega do Metro;
- VoiceOver, TalkBack, aparelho físico de tela baixa, "segunda falha invalida o
  checkpoint" e ausência de efeito duplicado continuam sem evidência.

## Piloto de `first_frame` — o kernel custa ~440 ms na partida

**Run:** `run-1786394347211-12be1d79`. **Isto é um piloto, não a coorte**: 6 amostras
por lado contra as 20 que o gate exige, então **não produz veredito**. Foi rodado
para responder uma pergunta antes de gastar 2 h de janela — a hipótese escrita no
desenho, de que a métrica nova dependeria muito menos de host silencioso.

### A instrumentação funciona ponta a ponta

Simulador `Radiant SE 4.7`, mesmo binário nativo, Metro pela receita nova. Controle
positivo antes de cada coorte. O envelope chega nos **dois** modos, que era o ponto
do desenho:

```
RADIANT_CHECKPOINT_PERF {"schemaVersion":1,"metric":"first_frame","mode":"off","durationMs":239.1}
RADIANT_CHECKPOINT_PERF {"schemaVersion":1,"metric":"first_frame","mode":"active","durationMs":680.5}
```

E o baseline emitiu **somente** `first_frame` — nenhuma métrica de checkpoint —, que
é o que o gate `baseline_isolation` passou a exigir.

### Os números

| coorte | n | mín | p50 | p95 | máx | amplitude |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| baseline (`off`) | 6 | 230,6 ms | **239,1 ms** | 331,6 ms | 331,6 ms | 101,0 ms |
| active | 6 | 569,1 ms | **680,5 ms** | 710,9 ms | 710,9 ms | 141,8 ms |

**Delta de medianas: +441,4 ms. Delta de p95: +379,3 ms.** Limite permitido pela
fórmula: 92,5 ms.

### O achado, e é sobre o produto, não sobre o instrumento

**O kernel adiciona cerca de 440 ms à partida do app**, medidos na janela em que ele
de fato vive. É o primeiro achado de produto desta saga inteira, e ele estava
escondido: na métrica antiga o cold start do candidato aparecia como delta
**negativo** numa passagem e como ruído nas outras, porque `launchApp` num Dev
Client termina antes de o kernel existir.

A discriminação que a métrica nova compra fica explícita na comparação com a
dispersão. Aqui o delta é **3 vezes maior** que a amplitude interna de qualquer das
duas coortes (101 e 142 ms), então deriva de host não o explica. No `cold_start` era
o oposto: o delta permitido era **cinco vezes menor** que a dispersão da própria
medida. A mesma aritmética que condenava a métrica antiga absolve esta.

A única diferença de ambiente entre as duas coortes foi
`EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE`. O caminho de partida do kernel —
`inspectLaunch` lendo o store — é o que ocupa a diferença.

### E a hipótese do desenho não se confirmou

O desenho registrou como **hipótese** que a métrica dentro do app dependeria muito
menos de host silencioso. O piloto diz que **não**, em termos relativos: o piso de
ruído do baseline foi 92,5 ms sobre um p95 de 331,6 ms, razão de **0,279** — acima do
teto de 0,20. A dispersão caiu em valor absoluto (101 ms contra ~835 ms), mas não em
proporção. **A janela de host continua necessária.**

Consequência formal: neste estado de host o gate devolveria
`inconclusive`/`measurement-too-noisy`, porque o teto é checado antes da comparação
de delta. Com um baseline apertado, o mesmo delta produziria **`fail`** — e é isso
que se espera da coorte de verdade.

Registro do host: swap subiu de 1002 MB para 1282 MB ao longo do piloto, e o uptime
era de ~9 h. Nenhum reboot foi feito.

### Uma calibração herdada que merece revisão

O termo fixo de 50 ms da fórmula foi calibrado para uma métrica na faixa de
3000–5000 ms, onde representa ~1,5%. Sobre `first_frame`, cuja escala é ~330 ms, ele
sozinho vale **15%** da métrica — quase todo o orçamento de ruído antes de o teto de
20% ser alcançado. Não afetou este piloto, porque o piso de ruído medido (92,5 ms)
dominou os três termos. Fica registrado como item de revisão, e **não** foi mexido:
mudar constante de gate depois de ver o resultado é exatamente o movimento que
invalida um gate.

### O que este piloto não é

- **não é a coorte**: 6 amostras por lado, contra 20 exigidas. Nenhum veredito;
- não usa build de produção: é Dev Client com Metro, então o número absoluto inclui
  trabalho de desenvolvimento. Ele vale como **delta** entre dois lados que têm esse
  trabalho igualmente, não como tempo de partida do app publicado;
- não fecha H3. A pendência mudou de natureza outra vez: deixou de ser "o
  instrumento não conclui" e passou a ser **"o instrumento mede, e o que ele mede é
  um custo de ~440 ms que precisa de decisão"**.

## Onde estão os 440 ms — fronteira medida, e não é o kernel

**Runs:** `run-1786395295145-4412f2f2` (instrumentação) e
`run-1786396152130-5d9cdc0b` (hipótese de correção). Este bloco **inverte a leitura**
da seção anterior, e a inversão é o ponto: o custo existe, mas atribuí-lo ao kernel
estava errado.

### A fronteira

`inspectLaunch` é a única etapa do bootstrap que se comporta de forma diferente entre
`off` e `active`, e era a única sem probe nenhum — por isso os 9,0 ms de restauração
nunca contradisseram os 440. Instrumentada como `launch_inspection` e medida **nos
dois modos**, 6 lançamentos cada, mesmo binário e mesmo aparelho:

| métrica | `off` | `active` |
| --- | ---: | ---: |
| `launch_inspection` | **0,5–0,9 ms** | **184–357 ms** (mediana ~239) |
| `first_frame` | 200–305 ms (mediana ~232) | 528–679 ms (mediana ~564) |

**~72% do delta de partida (332 ms) está dentro dessa fronteira.**

### O mecanismo, tirado dos próprios números

A **primeira** operação de storage do kernel custa ~240 ms; a **seguinte, no mesmo
lançamento** — a `persistence` que aparece logo depois — custa **13–21 ms**. Essa
razão é assinatura de **resolução de módulo**, não de I/O.

O store resolve o AsyncStorage por `await import(...)`, e no Dev Client o Metro do
Expo serve `import()` como **chunk assíncrono buscado por HTTP**: cada contexto JS
novo paga na primeira operação. Em `off`, `inspectLaunch` retorna antes de tocar o
store, então o baseline **nunca paga** — e a diferença apareceu no gate como se fosse
custo do kernel. O `launch_inspection` em `active` também **cai** ao longo dos
lançamentos (357 → 206), compatível com cache do lado do Metro e incompatível com
custo inerente por lançamento.

### Duas hipóteses mortas, e a segunda tinha cara de correção

**A primeira**, minha: "o custo é o carregamento preguiçoso do AsyncStorage em si".
Refutada lendo o código — `AuthService` e `FirstRunService` importam o módulo
estaticamente e rodam no `Promise.all` **antes** do `inspectLaunch`, nos dois modos.

**A segunda**, a correção óbvia: trocar por import estático no store. Aplicada, e
**derrubou seis suítes do kernel** com `[@RNC/AsyncStorage]: NativeModule:
AsyncStorage is null`. O preset `jest-expo` **não** mocka esse módulo, e o adaptador
em memória existe justamente para essas suítes não precisarem de mock. O comentário
que a troca ia apagar estava certo; ele só não registrava a consequência de
ignorá-lo, o que é o que o fazia parecer removível. O contra-argumento de que vinte
outros serviços importam estaticamente era verdadeiro e **irrelevante**: as suítes
deles declaram o mock.

A preguiça foi restaurada e o ponto de chamada passou a carregar os **dois** lados —
o que quebra sem ela e o que ela custa.

### A consequência que muda a decisão pendente

**A pergunta "440 ms são aceitáveis?" era prematura.** Se esse custo é artefato do
Dev Client, não há o que otimizar, e H3 volta a depender apenas da coorte. A medição
que decide **não** é a coorte de 20: é comparar `launch_inspection` num build **sem
Dev Client** (`developmentClient: false`, como o perfil `e2e-test` já declara). Se lá
ele cair para poucos milissegundos, o custo morre como artefato; se persistir, existe
custo de produto, e o remédio provável é **aquecer a resolução em paralelo no
bootstrap** — nunca mexer no import, que é o que a segunda hipótese provou.

Isso exige build novo, portanto autorização do dono.

### E isso afia um limite que o próprio desenho declarou

O desenho registrou que `first_frame` não mede lançamento nativo e que o número
absoluto não é número de produção, valendo como **delta**. Falta uma linha, e ela é
esta: **um delta também pode ser artefato de desenvolvimento quando um lado dispara
busca de chunk assíncrono e o outro não.** Igualdade de binário e de aparelho não
garante igualdade de caminho de módulo.

## Os 440 ms eram do instrumento — medido, e fechado

**Run:** `run-1786404098148-d873b589` (instrumentação em `run-1786403538585-d2745992`).
Este bloco **encerra** a pergunta que as duas seções anteriores deixaram aberta, e a
resposta inverte a leitura de novo: o custo de partida atribuído ao kernel é
artefato do Dev Client.

### Duas explicações com remédios opostos

`launch_inspection` mostrou 184–357 ms em `active` contra 0,5–0,9 ms em `off`. Duas
causas sobreviviam, e a escolha entre elas decidia tudo:

- **resolução de módulo** — o `await import()` do AsyncStorage servido como chunk
  assíncrono pelo Metro em dev. Artefato de desenvolvimento; nada a otimizar;
- **abertura do banco nativo** na primeira leitura. Real em produção; exigiria
  otimização.

`storage_module_resolution` mede a resolução sozinha. A subtração dá a leitura.

### O resultado não é ambíguo

Seis lançamentos, coorte `active`, mesmo binário:

| lançamento | `storage_module_resolution` | `launch_inspection` | diferença = a leitura |
| --- | ---: | ---: | ---: |
| 1 (Metro frio) | 622,1 ms | 624,2 ms | **2,1 ms** |
| 2 | 189,0 ms | 190,6 ms | **1,6 ms** |
| 3 | 266,2 ms | 268,1 ms | **1,9 ms** |
| 4 | 207,9 ms | 209,6 ms | **1,7 ms** |
| 5 | 177,4 ms | 179,1 ms | **1,7 ms** |
| 6 | 191,5 ms | 193,3 ms | **1,8 ms** |

**O trabalho de partida do kernel — ler uma chave inexistente — custa menos de
2 ms.** Praticamente 100% do `launch_inspection` é a resolução do módulo. E a
primeira medição custar 3× as seguintes é assinatura de cache de bundler, não de
inicialização nativa, que não teria por que se importar com o cache do Metro.

O argumento que fecha a hipótese nativa: mais de vinte serviços do app importam o
mesmo módulo **estaticamente**, então o corpo dele já foi avaliado na avaliação do
bundle, nos dois modos. Se o custo fosse avaliação de módulo ou aquisição do handle
nativo, o import dinâmico bateria no registro já populado e custaria ~0. Ele custa
190–620 ms, logo não está batendo no registro estático — está no caminho de
`asyncRequire` do Metro em dev.

### E a prova estática, que não exigiu build nenhum

```sh
npx expo export --platform ios --output-dir <dir>
```

O export de produção emite **um único artefato JS** —
`_expo/static/js/ios/entry-<hash>.hbc`, 6,4 MB — e o `metadata.json` declara um
bundle para iOS com 37 assets. **Zero chunks assíncronos.** Num build embarcado o
`import()` não tem o que buscar: o módulo está dentro do bundle já carregado.

Isso respondeu, por construção, a pergunta que eu havia escalado como "exige build
sem Dev Client": **não exigia**. Um export de bundle bastou, e ele não é ação de
loja nem produz artefato distribuível.

### O que isso faz com o gate que foi construído hoje

**O delta de `first_frame` medido num Dev Client não pode julgar esta onda.** Ele
compara duas coortes em que apenas uma dispara uma busca de chunk que só existe em
desenvolvimento, e essa busca domina o delta: dos ~344–441 ms medidos, ~190–620 ms
são o import. O gate reprovaria a onda por um custo que não existe em produção.

É um limite do instrumento, não do produto, e é o terceiro desta saga — depois da
janela cega do `cold_start` e do passe vazio por ruído. A diferença é que este é
fino: mesmo binário, mesmo aparelho, mesma coorte, e ainda assim os dois lados
percorrem caminhos de módulo diferentes.

Duas saídas, e a primeira é melhor:

1. **aquecer a resolução do módulo no bootstrap, nos dois modos.** Os dois lados
   passam a pagar igual, o delta volta a medir o kernel, e o desenvolvedor deixa de
   pagar 200 ms por lançamento. Justifica-se como **validade da medição**, não como
   otimização — o custo otimizado é de dev;
2. medir `first_frame` num build embarcado, onde o artefato não existe.

Nenhuma das duas foi executada aqui.

### O que fica provado sobre o produto

**O kernel de checkpoints custa menos de 2 ms na partida.** É a primeira afirmação
desta saga sobre o produto que se sustenta em medição direta da fronteira, e ela é
o oposto do que o piloto sugeriu. Persistência (23,1 ms) e restauração (9,0 ms)
sempre foram conclusivas; agora a partida também é, e é a mais baixa das três.
