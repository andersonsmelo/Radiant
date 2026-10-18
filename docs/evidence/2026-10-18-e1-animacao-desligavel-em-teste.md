# E1 — animação desligável em teste (FILA 49 e 57)

Medido em 2026-10-18 sobre a `main` em `cc67243`, no simulador
`Radiant E2E item 38` (`0A1B5AAA`, iOS 26.5), build Debug com o Metro desta
worktree em modo CI, Maestro 2.7.0, Node 20.20.2. O trabalho começou em
2026-10-16 sobre `2c1b5f0`. A FILA 57 o deixou parado para decisão do dono, e
em 2026-10-18 Anderson pediu para integrar. O run antigo foi fechado e o
trabalho refeito num branch novo a partir da `origin/main`.

## O que mudou

- **`src/ui/accessibility/motionLaunchArgument.ts`**: lê o argumento de
  lançamento `-radiantReduceMotion 1` pelo `Settings` do React Native. No iOS,
  ele expõe o `NSUserDefaults`, onde o sistema põe os argumentos `-chave valor`.
  Nenhuma dependência nova, porque o `React-RCTSettings` já está no binário
  (`Podfile.lock`). No Android o argumento não tem efeito: o Maestro o entrega
  como extra da intent, e lê-lo exige módulo nativo.
- **`useReducedMotionPreference.ts`**: com o argumento, a preferência nasce
  `{ reducedMotionEnabled: true, resolved: true }` e o sistema não é consultado
  nem escutado. É o mesmo caminho de "Reduzir movimento" que o
  `StarfieldBackground` e o `Confetti` já respeitavam. Todo o resto que respeita
  a preferência também para.
- **17 roteiros, 22 lançamentos**: cada `launchApp` passa
  `arguments: { radiantReduceMotion: '1' }`. Os `launchApp` pelados das
  reaberturas viraram mapa.
- **Contrato Maestro**, duas regras novas:
  - todo `launchApp`, em roteiro ou subroteiro, passa o argumento como texto
    `'1'`;
  - nenhum `openLink` abre o app parado.

### Por que o valor é texto

O `IOSLaunchArguments` do `maestro-ios-driver` 2.7 só escreve o `-` antes da
chave quando o valor **não** é booleano. Foi lido no bytecode: o ramo
`instanceof Boolean` põe a chave crua. Sem o `-`, o iOS não leva o argumento ao
`NSUserDefaults`, e um `radiantReduceMotion: true` seria ignorado em silêncio.

## Vermelho antes do conserto

Os testes novos rodaram contra o hook ainda sem o conserto, em `cc67243`
(saída integral em
[`jest-vermelho.txt`](2026-10-18-e1-animacao-desligavel-em-teste/jest-vermelho.txt)):
**4 falharam e 12 passaram**. Os quatro são os casos com argumento:

| Caso | Esperado | Recebido |
| --- | --- | --- |
| fundo estrelado não anima | 1 quadro distinto em ~12 s | **5** |
| confete não roda | 0 peças animadas | **40** |
| hook resolve na 1ª renderização | `{ true, resolved: true }` | `{ false, resolved: false }` |
| mudança do sistema não religa | `true` | `false` |

Os casos de validade passaram já no vermelho: sem argumento, o mesmo arnês vê
o fundo animar e o confete rodar. Depois do conserto: **34/34** em
`src/ui/accessibility` mais `StarfieldBackground.test.tsx`.

A revisão da PR #49 apontou o custo do caso de validade do confete: 40 peças
simuladas por 12 s. A revisão estimou o arquivo em 62 s, mas a medida aqui deu
13 s, dos quais 7 s eram esse caso. Ele passou a usar 8 peças e um passo de
700 ms, o bastante porque toda peça começa a cair em até 600 ms. Continua
vendo a animação. O arquivo caiu para 4,4 s.

## Contrato, visto falhando por injeção

[`injecoes.py`](2026-10-18-e1-animacao-desligavel-em-teste/injecoes.py), rodado
de dentro de `radiant-app/`, troca uma âncora única, roda
`npm run test:maestro-contract` e restaura o arquivo. Cada guarda reprovou
com o defeito que nomeia (saída em
[`contrato-injecoes.txt`](2026-10-18-e1-animacao-desligavel-em-teste/contrato-injecoes.txt)):

| Injeção | Reprova | Mensagem |
| --- | --- | --- |
| `radiantReduceMotion: true` | teste 32 | "as a quoted string — a boolean reaches iOS without the "-"" |
| `radiantReduceMotion: '0'` | teste 32 | "must pass radiantReduceMotion: '1'" |
| sem `arguments` | teste 32 | "must pass the radiantReduceMotion argument" |
| `- launchApp` pelado depois de `killApp` | teste 32 | "a bare launchApp starts the app without the … argument" |
| `killApp` antes do `openLink` | teste 33 | "openLink must follow a launchApp" |
| sem a volta do centramento (abaixo) | teste 7 | "center the native button bounds immediately before its semantic tap" |

Com tudo restaurado: **33/33**.

## `reward-unlock`, antes e depois

Mesmo roteiro (com o argumento) e mesmo aparelho. A única diferença é o hook:
no "antes", o código da `main` ignora o argumento. O bundle servido no "depois"
foi conferido: ele contém `isReduceMotionForcedByLaunchArgument`. Os tempos
saem do `maestro.log`, pelo `tempos.py` da mesma pasta. A tentativa é um
deslize mais as duas esperas de "animation to end" que o seguem.

| | Antes | Depois |
| --- | --- | --- |
| Resultado | passed | passed |
| Duração do roteiro | **18 min 10 s** | **3 min 48 s** |
| Tentativas de rolagem ao cabeçalho | 25 | 25 |
| Por tentativa | 8,1 a 11,1 s (média 9,4) | **2,3 a 3,7 s (média 3,3)** |
| Soma das 8 rolagens | 241,0 s | 87,6 s |
| Carga de 1 min (início → fim) | 46 → 13 | 3 → 4,6 |

| Rolagem | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Antes (s) | 0,3 | 9,5 | 18,1 | 27,6 | 35,2 | 38,6 | 48,4 | 63,3 |
| Depois (s) | 0,1 | 3,3 | 7,3 | 10,6 | 12,8 | 14,2 | 17,8 | 21,4 |

**Para onde foi o tempo.** No "antes", cada uma das duas esperas levava
~4,4 s, os 3 s do prazo de "animation to end" mais a captura. A tela nunca
assentava, e as duas estouravam o prazo. No "depois", a primeira espera leva
1,0 s e a segunda ~2,5 s, e as duas terminam antes do prazo. A carga do "antes"
foi maior, mas não explica a diferença: esperas que batem no prazo não dependem
de carga, e a parcial de 2026-10-16 sobre `2c1b5f0` deu 7,9 a 10,8 s por
tentativa.

### Divergência do critério do plano

O plano pedia **menos de 2 s por tentativa**. A medida foi **3,3 s em média**:
o critério **não foi atingido**. Os ~2,5 s da segunda espera são a
desaceleração da própria lista depois do deslize, que é movimento real e não o
fundo. O argumento não deve removê-la. Baixar disso exigiria mexer na rolagem,
por exemplo com o `waitToSettleTimeoutMs` do Maestro, com risco de ler a
posição antes de a lista parar, ou com `decelerationRate` no app. Fica para
decisão.

## A falha que o E1 revelou: o centramento passava do botão

A 1ª execução "depois" (`depois-1-reprovado-hud`) reprovou na 3ª lição. O
toque em "Continuar jornada" não navegou, e "Quiz: Energia e matéria" não
apareceu. O log mostra a causa:

- depois da rolagem ao cabeçalho, o botão parou em `y=588`. No "antes", parou
  em `y=568`, uma diferença de 20 pt;
- o `centerElement` do Maestro 2.7 considera centrado o elemento cujo centro
  fica a até 1/5 da altura do centro da tela (`isElementNearScreenCenter`, lido
  no bytecode). Fora disso, dá **um** deslize fixo e aceita onde ele parar:
  568 passava, 588 não;
- o deslize de ~505 pt levou o botão a `y=83`, **sob o HUD**. Ele continuava
  "visível" na árvore, e o toque em (201, 111) caiu no HUD.

A janela já existia com a animação ligada, para o centro do botão entre ~611 e
~690 pt. O E1 só deslocou a 3ª lição para dentro dela. **Conserto:** logo
depois de cada rolagem centrada para baixo até `journey-recommendation-action`
vem um `assertVisible` do botão e uma rolagem centrada **para cima**. Ela nada
faz quando o botão já está na faixa, e desfaz o excesso fora dela. São 9 pontos:
7 no `reward-unlock`, 1 no `learning-critical-path` e 1 no `offline-relaunch`.
O contrato passou a exigir a sequência. Na 2ª execução "depois", ela agiu
exatamente uma vez: na 3ª lição, o botão foi a `y=92` e voltou a `y=603`.

## Bateria padrão com o argumento

Rodada em 2026-10-18 por uma sessão à parte, no mesmo simulador e com o código
desta branch (`8114401`). O Metro rodou em modo CI e serviu as 7 variáveis do
perfil e2e-test. Os 7 roteiros passaram, sem nenhum `FAILED` nos logs, e todo
lançamento registra `-radiantReduceMotion`, inclusive a reabertura do
`offline-relaunch`.

Os logs estão em `2026-10-18-e1-animacao-desligavel-em-teste/`: um
`bateria-<roteiro>.log` por roteiro, com a carga, a duração e a saída do
Maestro, e o `bateria-metro.log`, que mostra o Metro servindo da worktree da
bateria. Foram copiados em 2026-10-18 da pasta ignorada
`radiant-app/.maestro/artifacts/e1-bateria/` dessa worktree, que esteve no
`8114401` das 14:40 às 14:50, como mostra o reflog dela.

| Roteiro | Resultado | Duração |
| --- | --- | --- |
| `learning-critical-path` | passed | 88 s |
| `offline-relaunch` | passed | 74 s |
| `first-run` | passed | 22 s |
| `boot-to-home` | passed | 19 s |
| `reward-locked` | passed | 40 s |
| `radiant-1-4-vidas-esgotadas` | passed | 125 s (o runbook estimava ~8 min) |
| `radiant-1-4-primeira-execucao` | passed | 38 s |

A volta do centramento passou nos dois roteiros novos, mas não precisou mover
o botão. No `learning-critical-path`, ele parou dentro da faixa central. No
`offline-relaunch`, já estava visível, e o roteiro não toca nele. O excesso
para baixo do HUD continua visto só no `reward-unlock`.

## Processo: o run que caiu em `needs_human`

O run `run-1792339168008-ef5804f3` validou 15/15 e reprovou no `step finish`
com `OUT_OF_SCOPE_CHANGE` sobre os 17 roteiros. Eles estavam entre os arquivos
pretendidos, mas não entre os declarados. A causa foi a forma de declarar:
`$FLOWS`, sem aspas, **não se divide por linha no zsh**, e os 17 caminhos
entraram no `abrir.mjs` como um argumento só, com quebras de linha dentro. O
`state.json` mostrava 12 arquivos declarados, e não 28. O mesmo erro estava no
run de 2026-10-16, que nunca chegou ao `step finish`.

Antes de reabrir, conferiu-se que o `git status` tinha exatamente os 28
arquivos pretendidos. Nos roteiros, as únicas linhas removidas eram os 8
`- launchApp` pelados. O run foi fechado, e o `run-1792342178131-6739ffe0` foi
aberto a partir de uma lista explícita, com a contagem (28) e a igualdade com o
`git status` asseridas antes da chamada.

## Limites

- Antes e depois, só o `reward-unlock` foi medido. Da bateria padrão, sete
  roteiros passaram com o argumento (acima).
- Não rodaram com o argumento:
  - o `radiant-1-4-segundo-dia`, que precisa de 24 h de relógio desde o
    `primeira-execucao` (das 14:49 de 2026-10-18);
  - `rating-prompt`, `review-due`, os `student-checkpoint-*`, `store-capture`
    e `hybrid-native-evidence`, que exigem preparo prévio dos dados ou outro
    ambiente.
- **Android não foi executado.** Lá o argumento não chega ao app, e o E2E
  continua com a animação.
- Com o argumento, o E2E roda no ramo de "Reduzir movimento" de todo o app, e
  não só do fundo e do confete. Os testes do ramo animado continuam no Jest.
