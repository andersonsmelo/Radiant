# Radiant — Execution Status (2026-08-10)

Este documento **substitui
[`EXECUTION_STATUS_2026-08-09.md`](EXECUTION_STATUS_2026-08-09.md)** como estado
canônico. O snapshot anterior continua sendo a evidência detalhada de 2026-08-09:
primeira vitória, quatro interações acessíveis, correção do agendador e as Ondas
1 a 4 do kernel de checkpoints.

## O que mudou hoje

O dia foi inteiro sobre o **gate operacional H3**, e produziu três coisas: a
descoberta de que o gate não era executável, o fechamento de um bloqueio P0 de
acessibilidade que ele revelou, e uma medição que ainda não conclui sobre cold
start. Nenhum build, OTA, submit, push ou publicação. Produção permanece `off` e
`1.3.1 (7)` está intocada.

Quatro correções entraram, cada uma em run próprio, todas com teste que morde
provado por mutação:

| run | entrega |
| --- | --- |
| `run-1786366083722-93ee4bf4` | tela de retomada rolável — bloqueio P0 |
| `run-1786366490575-a0a0c4cb` | limiar de delta consciente do ruído medido |
| `run-1786366830631-0755376c` | reexecução das coortes e prova em aparelho |
| `run-1786383400260-6ad60081` | terceiro desfecho do gate — `inconclusive` |

## Estado de H3

**Fechado:** persistência p95 **23,1 ms** (n=43, limite 75) e restauração p95
**9,0 ms** (n=20, limite 100); delta Home→Lição **+152 ms** contra 591
permitidos; retomada offline após kill/relaunch provada 20 vezes; e o CTA de
retomada alcançável em `accessibility-extra-extra-large` e
`accessibility-extra-extra-extra-large`, com o flow completo passando em AX5.

**Aberto:** o delta de cold start, e agora com o instrumento consertado. O
relatório fechava em `"passed": true` sobre um passe vazio — piso de ruído de
2863 ms contra um p95 de baseline de 5748 ms, porque o host estava em swap. Um
limite que tolera 2,9 s não distingue regressão de flutuação. O gate ganhou um
**terceiro desfecho** (`run-1786383400260-6ad60081`): `inconclusive`, falha
fechada com razão `measurement-too-noisy`, quando o piso de ruído passa de um
quinto do p95 do baseline — quatro vezes a sensibilidade de 5% que o desenho
pedia. Sob ele, aquela coorte sai `inconclusive` e o relatório sai
`passed: false`, então **o verde não existe mais para ser promovido por engano**.

**E então a métrica trocou** (`run-1786392781118-5b1f744b`, com
[desenho aprovado pelo dono](superpowers/specs/2026-08-10-marca-de-primeiro-frame-design.md)).
`cold_start` mede a duração do `launchApp` do Maestro, que num Dev Client termina no
launcher, antes de o bundle JS existir — o kernel é JavaScript e não vive nessa
janela, então nem um verde conclusivo diria muito sobre ele. Entrou **`first_frame`**:
do início da janela JS ao frame seguinte a `startupPhase` virar `ready`, que só
acontece depois de `inspectLaunch` do runtime de checkpoints, de modo que **o kernel
está dentro da janela por construção**. A marca é emitida nos **dois** modos — é o
que faz o delta existir — e o probe de checkpoint continua exigindo `active`.
`cold_start` segue calculado e reportado como **informativo**, fora do veredito.
"Off silencioso" virou asserção: métrica de checkpoint num log de baseline reprova o
relatório.

**E o piloto da métrica nova achou um custo real** (`run-1786394347211-12be1d79`,
6+6 amostras, sem veredito). A instrumentação funciona nos dois modos, e o **kernel
adiciona ~440 ms à partida**: mediana `off` **239,1 ms** contra `active`
**680,5 ms**, com o delta valendo 3× a amplitude interna das coortes — não é deriva
de host. É o **primeiro achado de produto** desta saga; a métrica antiga o escondia
porque `launchApp` termina antes de o kernel existir, e chegou a mostrar delta
*negativo* numa passagem.

A hipótese de que a métrica dentro do app dispensaria host silencioso **não se
confirmou**: piso de ruído 92,5 ms sobre p95 de 331,6 ms, razão 0,279, acima do teto
de 0,20. A dispersão caiu em valor absoluto (101 ms contra ~835 ms) e não em
proporção.

**E o diagnóstico da fronteira mostrou que ~72% desse custo não é do kernel.**
`inspectLaunch` foi instrumentado como `launch_inspection` e medido nos dois modos:
**0,5–0,9 ms** em `off` contra **184–357 ms** em `active`. O mecanismo veio dos
próprios números — a primeira operação de storage do kernel custa ~240 ms e a
seguinte, no mesmo lançamento, 13–21 ms, que é assinatura de resolução de módulo e
não de I/O. O store resolve o AsyncStorage por `await import()`, e no Dev Client o
Metro serve `import()` como chunk buscado por HTTP; em `off` o `inspectLaunch`
retorna antes de tocar o store, então o baseline nunca paga.

Trocar por import estático foi tentado e **derrubou seis suítes** do kernel
(`jest-expo` não mocka AsyncStorage): a preguiça é obrigatória, e o custo dela ficou
registrado no ponto de chamada.

**A pendência mudou de ordem, e a pergunta anterior era prematura.** Antes de decidir
se 440 ms são aceitáveis, é preciso saber se eles existem fora do Dev Client:

1. **medir `launch_inspection` num build sem Dev Client** (`developmentClient: false`,
   como o perfil `e2e-test` já declara). Se cair para poucos ms, o custo morre como
   artefato de instrumento e não há o que otimizar. Exige build novo, portanto
   autorização do dono;
2. **rodar as duas coortes de 20** em janela de host — reboot para zerar swap, Metro
   pré-aquecido, coortes em sequência. Nota de receita: o baseline agora roda com
   `PERFORMANCE=true` e `MODE=off`;
3. se o custo persistir sem Dev Client, o remédio provável é **aquecer a resolução em
   paralelo no bootstrap** — nunca trocar o import, que já foi refutado.

**Sem evidência:** VoiceOver como serviço, TalkBack (exige Android), "segunda
falha invalida o checkpoint" e ausência de efeito duplicado após a retomada — o
flow prova a retomada, não a não-duplicação.

**Viewport curto fechado em simulador** (`run-1786385853053-960f7e28`). Criado
`Radiant SE 4.7` — `iPhone SE (3rd generation)`, `[0,0][375,667]`, 207 pt mais
curto que o aparelho das coortes — com o **mesmo binário nativo**
(`sha256 1e5d423…76`). O flow versionado
`.maestro/student-checkpoint-short-viewport.yaml` passou em `medium`, AX3, AX4 e
AX5: retomada offline após kill/relaunch, sem redirect automático, CTA alcançado
rolando e volta para a Tela 2 de 3. Contrato Maestro **21/21**. **Aparelho físico**
de tela baixa continua inexistente e o simulador não o substitui.

**Um bloqueio documentado não existia, e era ele que fechava o item acima.** Cinco documentos diziam, em seis lugares,
que o viewport curto ficava sem evidência porque "este host não tem device type
SE". Medido em 2026-08-10 com `xcrun simctl list runtimes --json`: o runtime
iOS 26.5 declara `iPhone SE (3rd generation)` (375 × 667 pt), `iPhone 13 mini` e
`iPhone 12 mini` entre os suportados. O teste em simulador curto está alcançável
neste host e apenas nunca foi executado — é hoje a fatia mais barata do item de
acessibilidade. O que de fato falta aqui é aparelho **físico** de tela baixa; as
duas condições estavam fundidas numa frase, e a mais forte era a errada
(`run-1786384165251-d65b7a00`).

Evidência completa:
[`2026-08-10-wave-4-student-checkpoint-h3-gate.md`](../radiant-app/docs/evidence/2026-08-10-wave-4-student-checkpoint-h3-gate.md).

## Correção de versão que atravessava quatro documentos

O build interno iOS `2d718691-288d-498e-9825-a03b14411bd2` era descrito como
`1.3.1 (7)`. Esse `(7)` é o contador remoto do EAS (`appVersionSource: remote`);
o `Info.plist` do artefato carrega **`CFBundleVersion = 3`**. Como `1.3.1 (7)` é
a versão em revisão na App Store, o texto fazia o build interno de simulador
parecer o artefato submetido. Corrigido no status, na fila, no roadmap e na
evidência de 2026-08-09.

## Lojas — sem mudança em 2026-08-10

iOS: `1.3.1 (7)` seguia em **Aguardando revisão** na última leitura autorizada,
de 2026-08-09, com liberação manual configurada. Nenhuma ação de loja foi
executada hoje.

Android: F2 continua represada por **12 ou mais participantes durante 14 dias
consecutivos**; a última leitura do Play Console é de 2026-08-03 e o número atual
pertence ao console, medido pelo dono. IARC/Play, aparelho físico e TalkBack
seguem pendentes.

## Outros bloqueios e pendências

- A API pública continua fora do caminho crítico e sua última condição
  registrada é **HTTP 502**; o app permanece local-first.
- D1 está decidida e não implantada.
- B5 Android, C4, C5 e C6 exigem aparelho ou janela de host.
- A instrumentação pós-lançamento espera aprovação e liberação manual do iOS.

## Ordem recomendada

1. ~~dar ao gate um desfecho *inconclusivo* explícito quando o ruído dominar~~ —
   feito em `run-1786383400260-6ad60081`. Resta **medir o cold start com o host
   ocioso, sem sessão de agente rodando**, que é janela de host e não trabalho de
   agente;
2. fechar VoiceOver, TalkBack e viewport curto;
3. Task 12 educacional, e então conteúdo v2, Galáxia e pipeline;
4. o dono consulta o App Store Connect e, se aprovado, faz a liberação manual;
5. continuar recrutamento Android até 12 opt-ins e então contar 14 dias.

## Primeira execução do gate H3 — coortes rodadas, gate reprovado

Run `run-1786354337237-662c1d8d`. Evidência completa:
[`2026-08-10-wave-4-student-checkpoint-h3-gate.md`](../radiant-app/docs/evidence/2026-08-10-wave-4-student-checkpoint-h3-gate.md).

**O gate não estava executável, e isso é a descoberta principal.** Três defeitos
do instrumento foram medidos antes de existir a primeira amostra válida:

1. a receita de Metro do runbook **não conseguia ligar `active`**.
   `expo/virtual/env.js` monta o env do cliente como
   `{ ...process.env, ...arquivos .env }` — o arquivo vence a linha de comando,
   ao contrário da precedência do CLI. Com `radiant-app/.env` declarando
   `EXPO_PUBLIC_APP_ENV=preview`, o app resolvia `preview` e
   `resolveStudentCheckpointRuntimeMode('preview','active')` devolvia `off`. O
   engano era seletivo: `MODE` não está no `.env` e chegava certo. Corrigido por
   `radiant-app/.env.local`;
2. **o canal de coleta não carregava o dado**: neste Dev Client bridgeless nem o
   terminal do Metro nem o log do simulador recebem console JS. A coleta passou
   a ser pelo inspector (CDP), com controle positivo antes de cada coorte;
3. `Runtime.enable` reentrega o buffer de console a cada reconexão, o que
   duplicaria amostras nas 20 relanças por coorte; o coletor passou a deduplicar
   por `(timestamp, linha)`.

**Coortes executadas no mesmo binário, aparelho e perfil** — simulador
`Radiant iPhone 17 Pro`/iOS 26.5, build `2d718691-288d-498e-9825-a03b14411bd2`,
`checkpoint-internal-simulator`. Baseline **20/20 verdes**, active **20/20
verdes**, 62 envelopes (`42` persistência, `20` restauração), todos `active`.

| gate | medido | limite | resultado |
| --- | ---: | ---: | --- |
| persistência p95 | 15,7 ms | 75 ms | dentro |
| restauração p95 | 10,6 ms | 100 ms | dentro |
| delta Home→Lição p95 | −174 ms | 400,4 ms | dentro |
| delta cold start p95 | **+267 ms** | 167,6 ms | **excede** |

`report.json`: `"passed": false`. **H3 continua aberta.**

A reprovação não é atribuível ao kernel, e isso é medição: a amplitude interna
do cold start é 838 ms (baseline) e 833 ms (active), **cinco vezes** o delta
permitido de 167,6 ms; e `launchApp` num Dev Client termina no launcher, antes
de o bundle JS existir, então o kernel não vive na janela medida. Onde ele pode
aparecer — Home→Lição — o delta é negativo. O gate precisa de uma marca de
primeiro frame útil emitida pelo app, ou de um limite derivado da dispersão
medida, antes de poder aprovar ou reprovar.

**Bloqueio P0 de acessibilidade encontrado.** A partir de
`accessibility-extra-extra-large` (AX4, os dois maiores dos cinco tamanhos de
acessibilidade do iOS), a tela de retomada perde os dois botões: em AX5 o título
começa em `y = -257` e o corpo termina em `y = 1066` numa tela de 874 pt, e
`CheckpointResumeScreen` não tem `ScrollView`. Um usuário com texto grande e
checkpoint salvo abre o app numa tela **sem nenhum controle**. Não corrigido
nesta sessão: é código de produto fora do escopo declarado do run e a correção é
decisão de desenho com TDD próprio.

## Reexecução no build corrigido — bloqueio P0 fechado

Run `run-1786366830631-0755376c`. As duas correções entraram antes da medição:
a tela de retomada virou rolável (`run-1786366083722-93ee4bf4`) e o limiar de
delta ficou consciente do ruído (`run-1786366490575-a0a0c4cb`).

Coortes **20/20 e 20/20**, em sequência no mesmo script, mesmo binário nativo,
aparelho e perfil. **Persistência p95 23,1 ms** (n=43, limite 75) e
**restauração p95 9,0 ms** (n=20, limite 100); Home→Lição **+152 ms** contra
591 permitidos. `report.json` fecha em `"passed": true`.

**O bloqueio P0 de acessibilidade está fechado, com prova em aparelho:** em AX4 e
AX5 o CTA de retomada é alcançável rolando, e em AX5 o flow completo passa —
chega à tela, rola, toca e volta para a Tela 2 de 3.

**H3 continua aberta, e agora por um motivo diferente.** O gate de cold start
passou vazio: o piso de ruído desta coorte foi 2863 ms, metade do p95 do próprio
baseline, porque o host estava em swap (trajetória 1698 → 3274 → 2227 MB,
registrada na evidência). Um limite que tolera 2,9 s não distingue regressão de
flutuação. A correção do limiar eliminou o falso-negativo e, num host que
degrada, trocou-o por um passe vazio. Não promover H3 com base nesse verde.

**Fechado mais tarde no mesmo dia** (`run-1786383400260-6ad60081`): o terceiro
desfecho que este parágrafo pedia existe, e sob ele esta coorte sai
`inconclusive`/`measurement-too-noisy`, com o relatório em `passed: false`. Ver a
seção *Estado de H3* no topo deste documento.

Continuam sem evidência: VoiceOver como serviço, TalkBack (exige Android),
viewport curto — alcançável em simulador neste host, ver acima; o que falta é
aparelho físico —, "segunda falha invalida o checkpoint" e ausência de efeito
duplicado após retomada — o flow prova a retomada, não a não-duplicação. Nenhum
build, OTA, push ou publicação.
