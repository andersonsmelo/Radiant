# Fila de trabalho contínuo

Criada em 2026-08-08 porque o custo real não era a dificuldade das tarefas: era
cada sessão gastar o orçamento **se orientando** — relendo status, roadmap e
cérebro para redescobrir o que já estava decidido — em vez de trabalhando.

Este arquivo existe para ser consumido, não lido de ponta a ponta. Um agente
pega o primeiro item `AGENTE` não concluído, executa ponta a ponta, marca, e
para.

**Não é substituto do roadmap.** O roadmap é o registro completo do lançamento;
esta fila é só o que está **executável agora**, ordenado. Item que sai daqui vai
para o roadmap ou para o status, nunca some.

## Política de decisão

O agente **decide por padrão** e executa. Escalam ao dono apenas:

1. dinheiro, contas e consoles — submissão, formulários de loja, chaves;
2. promessa nova ao usuário — destravar galáxia sem conteúdo, ligar nudge que
   hoje está em shadow mode, mudar o que o app diz que entrega;
3. texto que vai para a loja;
4. qualquer ação irreversível.

Executar decisão **já tomada** não escala. Se a dúvida é "o dono aprovaria?",
a resposta padrão é executar e reportar — o run reverte se estiver errado.

## Como cada item é escrito

Todo item declara **estado**, **bloqueio** e **dono** como afirmações separadas,
porque são independentes e têm sistemas de registro diferentes — este projeto já
perdeu dias com item vivo por bloqueio morto. E declara o **comando que o
remede**, porque contagem escrita envelhece e comando não.

---

## PRIORIDADE — o lançamento iOS, que não espera o relógio do Android

Reordenado em 2026-08-08. O **12 testadores × 14 dias** é exigência do **Google
Play** para conta pessoal; a Apple não tem equivalente. F3, F4 e F5 do roadmap
misturam as duas lojas, e os itens do Play não travam a App Store.

Enquanto o relógio do Android não começa, o iOS avançou de forma independente e
**foi submetido à App Review em 2026-08-08**.
O console foi consultado novamente em **2026-08-09** e continuava em
**Aguardando revisão**, com liberação manual configurada; nenhuma ação de loja
foi executada nessa leitura.

| Passo | Dono | Estado |
| --- | --- | --- |
| Privacy labels no App Store Connect | dono | **concluído** — **Dados não coletados** publicado |
| Build nova (`1.3.1 (7)`) | dono | **concluído** — processada, selecionada e submetida |
| Preço e direitos de conteúdo | dono | **concluído** — gratuito; direitos persistidos após recarga |
| Envio à App Review | dono | **concluído** às 12:05 BRT — **Aguardando revisão** |
| App Review → liberação manual | Apple, depois dono | revisão externa em curso; dono libera após aprovação |

Folha de transcrição campo a campo, com a evidência de cada resposta:
[`store/2026-08-08-ios-preflight.md`](store/2026-08-08-ios-preflight.md).

Gate de release medido em 2026-08-08: `tsc` exit 0, `eslint` 0 erros, **jest 56
suítes / 330 testes**. Evidência de aparelho fechada — smoke em 2026-08-05, B4
em 2026-08-06, Gate 2 em 5/5.

**Não há trabalho de agente neste caminho.** Gate, ficha, build e submissão
estão fechados. O que resta é a decisão externa da Apple e, depois da aprovação,
a liberação manual pelo dono.

---

## CI da API — correção local concluída em 2026-08-09

**Estado:** concluído em 2026-08-09. **Bloqueio:** nenhum. **Dono:** agente.

O `Radiant API Quality` foi acionado pela alteração de `radiant-api/README.md`
e revelou uma dependência que já existia: a configuração do ESLint buscava o
parser não declarado no `node_modules` de `radiant-app`. O job da API instala
apenas o lockfile próprio, portanto falhava com `MODULE_NOT_FOUND`; não era
regressão documental e não deve ser ocultado retirando o README do diff.

O pacote agora declara `@typescript-eslint/parser` nas dependências de
desenvolvimento e a configuração usa somente essa cópia. Remedição local sob
Node 20: `npm ci`, resolução do parser pelo próprio pacote, `npm run lint`,
`npm run build` e `npm run test` (**13/13**). O push foi confirmado com
**Radiant App Quality** e **Radiant API Quality** verdes no PR #1.

---

## HISTÓRICO — Onda 2 concluída em 2026-08-09

**Estado:** concluída como fundação isolada em `off`. **Bloqueio:** nenhum.
**Dono:** agente.

O módulo `student-checkpoints` entrega schemas, store ativo e shadow separados,
coordenador, adaptadores ainda desconectados e
`CommitOperationV1 + CommitIntentV1` persistidos juntos antes dos efeitos. Cada
autoridade isolada grava o recibo de `operationId` no mesmo registro do efeito;
crash injection cobre antes do efeito e depois de efeito+recibo/antes do
marcador da saga. Com `off`, o teste prova zero leitura/escrita do kernel e a
suíte completa do app permanece verde.

Cobrir os três intents fechados — lição, review e checkpoint —, sete autoridades
separadas e pausa durável após 20 retries automáticos, com retry explícito por
época sem cancelar efeito anterior.

Evidência: **5 suítes/58 testes focados**, lint, typecheck e **71 suítes/472
testes** do app. Run Loop: `run-1786311202497-fd99173e`.

Fonte normativa:
[`2026-08-09-checkpoints-e-loops-do-aluno.md`](superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md).

---

## HISTÓRICO — Onda 3 concluída em 2026-08-09

**Estado:** concluída em `shadow`. **Bloqueio:** nenhum. **Dono:** agente.

As 12 superfícies usam o store shadow isolado, com
`preview=shadow` e `production=off`. Nenhuma decisão shadow pode alimentar
navegação, progresso, XP, desbloqueio, recomendação ou serviço pedagógico. A
matriz cobre ciclo de vida, relaunch, deep link inválido, catálogo alterado,
storage indisponível e navegação repetida somente com ids/códigos allowlisted,
preservando as filas e autoridades legadas.

Evidência: **4 suítes/22 testes novos**, **9 suítes/80 testes** do módulo,
**10 suítes/47 testes** de telas, lint, typecheck e **75 suítes/494 testes** do
app. Run Loop: `run-1786314104218-908d111b`.

---

## AGENTE — Onda 4: runtime ativo somente interno

**Estado:** coortes executadas em 2026-08-10 (20/20 + 20/20); persistência e
restauração **conclusivas e dentro dos limites**; bloqueio P0 de acessibilidade
**fechado com prova em aparelho**; delta de cold start **`inconclusive`**.
**Bloqueio:** um só, e o instrumento foi corrigido **três vezes** no mesmo dia —
limiar consciente de ruído, desfecho `inconclusive`, e por fim a troca da métrica
de partida para `first_frame`, que mede a janela onde o kernel de fato vive
(`cold_start` ficou informativo). O piloto da métrica nova então achou ~440 ms de
custo de partida, e a fronteira medida mostrou que **quase nada disso é do kernel**:
a resolução do AsyncStorage por `await import()` responde por 177–622 ms e a leitura
em si por **menos de 2 ms**. O `expo export` de produção emite um único bundle, sem
chunk assíncrono, então o custo **não existe fora do Dev Client**. **O kernel custa
<2 ms na partida.** O que falta: tornar o delta de `first_frame` válido em dev
(aquecer a resolução nos dois modos) e **rodar as duas coortes**.
**Dono:** agente — as correções de instrumento estão feitas e a pergunta do custo
foi respondida sem precisar de build. A coorte ainda quer janela de host, e o dono
participa dos gates humanos.

Evidência: [`2026-08-10-wave-4-student-checkpoint-h3-gate.md`](../radiant-app/docs/evidence/2026-08-10-wave-4-student-checkpoint-h3-gate.md).
Run Loop `run-1786354337237-662c1d8d`.

Status canônico promovido em 2026-08-10 para
[`EXECUTION_STATUS_2026-08-10.md`](EXECUTION_STATUS_2026-08-10.md)
(run `run-1786380009304-c10fa573`), junto com a lista governada de
`scripts/qa/docs-contract.mjs` e os ponteiros dos seis documentos de estado
corrente — o acoplamento que impedia mintar o snapshot num run de escopo menor.

Persistência p95 **15,7 ms** (limite 75) e restauração p95 **10,6 ms** (limite
100) passaram folgadas, com 42 e 20 amostras reais — as primeiras que existem.
Home→Lição ficou **−174 ms**, ou seja o candidato é mais rápido que o baseline.

**Próximas ações executáveis, em ordem:**

1. ✅ **corrigir a tela de retomada** — feito em 2026-08-10, run
   `run-1786366083722-93ee4bf4`. `CheckpointResumeScreen` virou `ScrollView` com
   `flexGrow: 1` no contêiner de conteúdo (`flex: 1` ali recriaria o defeito).
   Teste novo vermelho antes da implementação e provado por mutação; **17/17** no
   arquivo. **Falta a prova em aparelho em AX4/AX5**, que roda junto da
   reexecução das coortes porque exige `radiant-app/.env.local`;
2. ✅ **corrigir o gate de cold start** — feito em 2026-08-10, run
   `run-1786366490575-a0a0c4cb`. O limite virou
   `max(0,05 × baseline_p95, 50 ms, baseline_p95 − baseline_p50)`; o terceiro
   termo é o piso de ruído medido. Dois casos novos, vermelhos antes da
   implementação, e o piso provado por mutação; **6/6** no arquivo. A rota de
   emitir do app uma marca de primeiro frame foi **descartada com motivo**: o
   probe só liga em `active`, então o baseline `off` — que precisa continuar
   silencioso — nunca produziria a coorte de comparação;
3. ✅ **reexecutar as coortes** — feito em 2026-08-10, run
   `run-1786366830631-0755376c`. 20/20 e 20/20 no mesmo binário/aparelho/perfil,
   com as duas coortes em sequência. **Persistência p95 23,1 ms** (n=43) e
   **restauração p95 9,0 ms** (n=20) passam com folga; Home→Lição +152 ms contra
   591 permitidos. **Bloqueio P0 fechado com prova em aparelho**: em AX4 e AX5 o
   CTA é alcançável rolando, e o flow completo de retomada passa em AX5;
4. ✅ **dar ao gate um terceiro desfecho** — feito em 2026-08-10, run
   `run-1786383400260-6ad60081`. Cada gate e o relatório passaram a expor
   `outcome` com três valores, e `inconclusive`/`measurement-too-noisy` é falha
   fechada quando `piso_de_ruído > 0,2 × baseline_p95` — quatro vezes a
   sensibilidade de 5% que o desenho pedia. `insufficient-samples` migrou para o
   mesmo desfecho: `fail` passa a significar "o produto regrediu" e
   `inconclusive`, "remedir o instrumento". Três casos novos, vermelhos antes da
   implementação, cinco mutações provadas, **9/9** no arquivo. Recalculado sobre
   as três passagens no disco: a de host ocioso segue conclusiva (razão 0,108), a
   que havia sido **descartada por julgamento humano** agora é recusada pelo
   próprio instrumento (0,246) e o passe vazio da terceira virou `inconclusive`
   (0,498). Uma fixture pré-existente foi trocada de propósito — ela afirmava que
   uma medição com 28,6% de ruído aprova, que é o passe vazio que o teto recusa;
5. ✅ **trocar a métrica de partida do gate** — feito em 2026-08-10, run
   `run-1786392781118-5b1f744b`, com [desenho aprovado pelo dono](superpowers/specs/2026-08-10-marca-de-primeiro-frame-design.md).
   `cold_start` media a duração do `launchApp`, que num Dev Client termina no
   launcher, antes de o bundle JS existir — o kernel é JS e não vivia na janela.
   Entrou `first_frame`: início da janela JS até o frame seguinte a `startupPhase`
   virar `ready`, que só acontece depois de `inspectLaunch` do runtime de
   checkpoints, então **o kernel está dentro da janela por construção**. Emitida nos
   dois modos, o que faz o delta existir; o probe de checkpoint continua exigindo
   `active`. `cold_start` fica informativo (`advisory: true`), fora do veredito, e
   reverter é tirar o nome de `ADVISORY_GATES`. "Off silencioso" virou asserção: o
   gate `baseline_isolation` reprova se um log de baseline carregar métrica de
   checkpoint. Emissor **9/9**, relatório **14/14**, cinco mutações provadas, sem
   dependência nova e **sem binário novo**;
6. ⏳ **rodar as duas coortes com `first_frame`, e decidir sobre ~440 ms.** Um
   **piloto** de 6+6 amostras foi rodado em 2026-08-10 (`run-1786394347211-12be1d79`)
   e mudou a natureza da pendência. A instrumentação funciona nos dois modos, e o
   **kernel adiciona ~440 ms à partida** (mediana `off` 239,1 ms contra `active`
   680,5 ms) — o primeiro achado de **produto** desta saga, que a métrica antiga
   escondia porque `launchApp` termina antes de o kernel existir. O delta é 3× a
   amplitude interna das coortes, então não é deriva de host.
   **A hipótese do desenho não se confirmou:** o piso de ruído deu 92,5 ms sobre
   p95 de 331,6 ms, razão 0,279, acima do teto de 0,20 — a dispersão caiu em valor
   absoluto mas não em proporção, e a **janela de host continua necessária** (reboot
   para zerar swap, Metro pré-aquecido, coortes em sequência). Com baseline apertado
   o veredito esperado seria `fail` — **mas o item 7 mostrou que esse `fail` seria
   por artefato de dev, não por regressão**, então a coorte só vale depois de o
   delta virar comparável. Lembrete de receita: o baseline agora roda com
   `PERFORMANCE=true` e `MODE=off`;
7. ✅ **a pergunta do custo de partida está FECHADA — era artefato do Dev Client**
   (runs `run-1786403538585-d2745992` e `run-1786404098148-d873b589`). Não exigiu
   build: `storage_module_resolution` mede a resolução do módulo sozinha, e a
   subtração dá a leitura — **menos de 2 ms** em todos os seis lançamentos, contra
   177–622 ms de resolução. E o `expo export` de produção emite **um único** bundle
   JS, sem nenhum chunk assíncrono, então num build embarcado o `import()` não tem o
   que buscar. **O kernel custa <2 ms na partida.** Consequência: o delta de
   `first_frame` medido em Dev Client **não pode julgar esta onda**, porque só um
   lado percorre o caminho de chunk. Saída preferida: aquecer a resolução no
   bootstrap nos dois modos, o que restaura a validade da medição e ainda tira
   ~200 ms por lançamento do desenvolvedor. **Registro do erro:** eu havia escalado
   isso como "exige autorização do dono para build sem Dev Client" — não exigia, e um
   export de bundle respondeu;
8. ✅ **aquecimento do módulo no bootstrap** — feito e medido em 2026-08-10 (runs
   `run-1786404557489-333ee8ae` e `run-1786405737946-c7d970f3`).
   `warmNativeStorage()` entrou no `Promise.all`, independente do modo e sem tocar
   chave alguma. **A assimetria caiu:** `launch_inspection` em `active` foi de
   184–357 ms para **1,0–1,9 ms**, e o delta de medianas de `first_frame` de +344/+441
   para **−28,7 ms** — o candidato ficou marginalmente mais rápido, que é o esperado
   de um kernel de <2 ms. Duas guardas com mutação provada, uma delas **estrutural**
   porque `import()` dinâmico não executa sob Jest e o teste de runtime seria vazio.
   **Predição minha refutada:** eu disse que a busca se esconderia no bootstrap e que
   isso tiraria ~200 ms do desenvolvedor; o `Promise.all` espera o mais lento, então
   ela passou a dominar e o `first_frame` em `off` subiu de ~232 para ~580 ms. O ganho
   é simetria, não velocidade; em produção o custo é ~0 (bundle único);
9. ⏳ **antiga pendência 7, agora reduzida:** O diagnóstico da fronteira (runs
   `run-1786395295145-4412f2f2` e `run-1786396152130-5d9cdc0b`) mostrou que **~72%
   dos 440 ms não são custo do kernel**: `launch_inspection` custa 0,5–0,9 ms em
   `off` e 184–357 ms em `active`, e o mecanismo é resolução de módulo, não I/O — a
   primeira operação de storage do kernel resolve o AsyncStorage por `await
   import()`, que o Metro serve como chunk buscado por HTTP no Dev Client, enquanto a
   operação seguinte no mesmo lançamento custa 13–21 ms. Em `off` o `inspectLaunch`
   retorna antes de tocar o store, então o baseline nunca paga.
   **Se o custo não existir fora do Dev Client, não há o que otimizar** e a pergunta
   "440 ms são aceitáveis?" cai. Exige build com `developmentClient: false` (o perfil
   `e2e-test` já declara isso), portanto **autorização do dono**. Se persistir, o
   remédio provável é aquecer a resolução em paralelo no bootstrap — **não** trocar o
   import, que foi tentado e derrubou seis suítes do kernel;
10. ✅ **viewport curto em simulador** — feito em 2026-08-10, run
   `run-1786385853053-960f7e28`. A razão que bloqueava este item era falsa: o
   runtime iOS 26.5 suporta `iPhone SE (3rd generation)`. Criado o simulador
   `Radiant SE 4.7` (`[0,0][375,667]`, 207 pt mais curto que o das coortes), com o
   **mesmo binário nativo** (`sha256 1e5d423…76`), o flow versionado
   `.maestro/student-checkpoint-short-viewport.yaml` passou em `medium`, AX3, AX4
   e AX5 — retomada offline após kill/relaunch, sem redirect automático, CTA
   alcançado rolando e volta para a Tela 2 de 3. Contrato Maestro **21/21** com o
   flow registrado. **Aparelho físico** de tela baixa continua inexistente e o
   simulador não o substitui;
11. VoiceOver como serviço e TalkBack (exige Android) continuam sem evidência;
12. "segunda falha invalida o checkpoint e volta à Home" e ausência de efeito
   duplicado após a retomada continuam sem flow que os afirme.

Antes de qualquer reexecução, ler a seção **Gate H3** do
[`E2E_RUNBOOK`](../radiant-app/docs/E2E_RUNBOOK.md): sem `radiant-app/.env.local`
o runtime `active` não liga, e sem o coletor CDP as coortes saem vazias.

Promover `active` somente em build interna para apresentação, Lição, Revisão e
checkpoint de unidade. Entregar CTA explícito de retomada, nunca redirect
automático, e fallback canônico para Home quando catálogo, cursor ou rota forem
incompatíveis.

O profile `checkpoint-internal` e o flow Maestro de kill/relaunch offline estão
versionados. A instrumentação sanitizada do gate também está pronta: o app
mede só persistência/restauração em `active`; cold start e Home→Lição saem do
`commands.json` do Maestro, preservando `off` silencioso. O relatório falha
fechado sem 20 amostras por coorte. Quality completa: **78 suítes/527 testes**,
contratos Maestro **21/21** e parser **4/4**. O EAS CLI resolveu o profile e a
variante de simulador como `development+active`, distribuição interna e sync
remoto `false`.

Builds disponíveis: iOS Simulator `2d718691-288d-498e-9825-a03b14411bd2`
(`appBuildVersion = 7` no registro do EAS, mas `CFBundleVersion = 3` no binário —
contador remoto, corrigido em 2026-08-10, e **não** é a `1.3.1 (7)` da App
Review) e Android `62d44f3f-30d0-4e12-b262-21b86ea6326c`
(`1.3.1 (6)` remoto; não promover). O primeiro iOS falhou no auto-upload
Sentry; o profile interno agora desliga esse upload. O APK foi instalado no AVD
após remover a cópia antiga de assinatura incompatível, mas nenhum flow foi
medido.

Próxima ação executável: usar o mesmo binário/aparelho para as coortes
`.maestro/student-checkpoint-performance-baseline.yaml`
e `.maestro/student-checkpoint-active-resume.yaml`, coletar no mínimo 20
execuções e fechar p95, VoiceOver, TalkBack e viewport curto. Produção permanece
`off`; Task 12, sync remoto, build/OTA de produção e publicação continuam fora
desta onda.

---

## AGENTE — Task 12 educacional: checkpoint e reforço adaptativo

**Estado:** pendente depois das Ondas 2–4 (fundação, shadow e runtime interno).
**Bloqueio:** dependência arquitetural deliberada; não é decisão do dono.
**Dono:** agente.

O `UnitCheckpointService` continua definido: aprovação com pelo menos 80% e
zero erro crítico, reforço somente das competências frágeis, versão do lote e
desbloqueio independente de XP. Ele será integrado pelo commit recuperável,
sem criar uma segunda transação dentro da tela.

`support-required` só ocorre depois de tentativa inicial reprovada, ciclo 1,
nova tentativa reprovada, ciclo 2 e terceira tentativa ainda não aprovada.

---

## HISTÓRICO — Task 10 concluída em 2026-08-09

O registry agora cobre múltipla escolha, hotspot, comparação, associação e
ordenação. Hotspot tem alternativa textual; comparação marca seleção também por
texto; associação funciona em sequência sem drag; ordenação usa subir/descer.
Os alvos têm ao menos 44 pt, respostas compostas permanecem controladas pelo
player e o feedback é anunciado uma vez ao confirmar.

Evidência: **8 suítes/35 testes focados**, lint, typecheck, Storybook config e
visual QA sem regressões; a suíte completa passou com **66 suítes/414 testes**.
Quatro stories de feature entram no Storybook. Aparelho físico e leitor de tela
real continuam como validação posterior, e nenhum novo binário foi publicado.

---

## HISTÓRICO — duas pendências técnicas isoladas concluídas

### A. ~~Varrer `jest.spyOn` sobre mocks oficiais~~ — concluída em 2026-08-09

**Estado:** concluída. **Bloqueio:** nenhum. **Dono:** agente.

O caso de `CompetencyReviewService.test.ts` já era a única ocorrência nociva:
aplicar `jest.spyOn` sobre uma função que já é mock devolve o próprio mock, e
`mockRestore()` pode apagar a implementação oficial. A varredura das demais
suítes não encontrou outro alvo que combinasse mock de módulo e restauração
destrutiva. Os `mockRestore()` ativos atingem apenas `console` ou `Intl`
reais; o teste de `AccessibilityInfo` restaura espiões reais e reinstala o
comportamento necessário por teste.

As sete suítes candidatas passaram em uma única execução focada, isolada e sem
cache: **7/7 suítes, 89/89 testes**. Nenhuma mudança de código de produção ou
teste foi necessária; a próxima pendência técnica é a barreira explícita de
ativação do agendador.

Comando usado:

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache \
  src/ui/accessibility/useReducedMotionPreference.test.ts \
  src/features/lesson-flow/services/LessonOutcomeService.test.ts \
  src/features/journey/services/JourneyNodeCompletionGuard.test.tsx \
  src/features/spaced-repetition/services/CompetencyReviewService.test.ts \
  src/features/first-run/startup-gate.flow.test.tsx \
  src/features/telemetry/appStoreProps.test.ts \
  src/features/progress/screens/ProgressScreen.flow.test.tsx
```

### B. ~~Tornar explícita a ativação do agendador por competência~~ — concluída em 2026-08-09

**Estado:** concluída. **Bloqueio:** ativação de leitura continua esperando
conteúdo v2. **Dono:** agente.

`JourneyRecommendationService.resolveReason` agora falha fechado quando o nó
recomendado resolve apenas competências sintéticas legadas (`legacyOnly`): mesmo
que uma vencida `competency:legacy:*` seja passada a `computeSnapshot`, o motivo
permanece `next-new`. A barreira fica no ponto de decisão, antes de comparar
vencidas, e não altera as regras de desbloqueio.

`getDue` continua sem chamador de produção e os snapshots ainda omitem a lista
de vencidas. A futura ativação só poderá recomendar revisão quando o resolver
ligar um nó a competência curricular real do conteúdo v2; a mídia autorizada em
2026-08-09 destravou a Task 10, mas o conteúdo v2 ainda precisa ser construído.

Teste de regressão e verificações focadas: **6/6 testes**, lint e typecheck
passaram.

Comandos usados:

```bash
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --no-cache \
  src/features/journey/services/JourneyRecommendationService.test.ts
npm run lint -- --quiet
npm run typecheck
```

---

## HISTÓRICO — os quatro itens agentáveis de 2026-08-08 fecharam

Os quatro itens abaixo fecharam em 2026-08-08. O que sobra de forma agentável
está listado acima; os registros abaixo permanecem para proveniência.

### 1. ~~O mapa de galáxias está vazio~~ — CONCLUÍDA em 2026-08-08

**Estado:** concluída. **Bloqueio:** nunca houve. **Dono:** agente.

As 16 lições entraram no mapa, em 6 planetas sob 2 galáxias. `galaxy-fisica` e
`galaxy-tecnologia` saíram de `available`/`locked` para `active` — antes eram
cascas vazias.

**A causa foi tratada, não só o sintoma.** A divergência entre os dois catálogos
existia porque `ai-catalog.ts` é **gerado** e `galaxy-catalog.ts` era escrito à
mão, com o vínculo lição→planeta mantido nos dois lugares. Agora a linha está em
outro lugar: **fato de governança é gerado, decisão de design é escrita à mão.**
`sync-catalog-to-app.mjs` passou a emitir `galaxy-nodes.ts` a partir do mapa de
taxonomia; cor, superfície e posição continuam autorais em `galaxy-catalog.ts`.

Sete testes em `galaxy-nodes.test.ts`, e dois deles mordem de verdade — provado
por mutação: com `nodesOf` devolvendo `[]`, os cinco restantes seguem verdes
**vaziamente**, porque um mapa sem conteúdo satisfaz toda asserção sobre o
conteúdo dele. Quem pega o módulo gerado deixar de ser consumido é só o par que
compara gerado × mapa.

Ordem dentro do planeta vem da sequência pedagógica da trilha, não do mapa, que
é alfabético por id. Nós nascem `available` de propósito: as 16 já eram
alcançáveis pela trilha plana, e nascer `locked` **reduziria** o acesso — o mapa
acrescenta caminho, não fecha o que existe.

**Continua do dono:** destravar `galaxy-casos`, que segue sem conteúdo nenhum.

Medido em 2026-08-08:

```bash
node -e "const s=require('fs').readFileSync('radiant-app/src/data/galaxy-catalog.ts','utf8');console.log('corpos com nodes vazios:',(s.match(/nodes: \[\]/g)||[]).length)"
```

O app tem 4 galáxias e 5 corpos celestes. **Só `planet-torax` tem conteúdo**
(8 nós); os outros quatro estão vazios, e duas galáxias estão `locked`. As 16
lições `ai-lesson:` embarcam numa trilha plana, `track-ai-fundamentos`, em
`radiant-app/src/data/ai-catalog.ts`, **desconectada do mapa**.

A metáfora central do produto está ~80% vazia enquanto o conteúdo que a encheria
viaja num paralelo. Quem abre o app vê mundos travados e vazios.

A ligação foi construída em 2026-08-07 e mora onde nada a lê:
`content-manifest/taxonomy-catalog-map.json` atribui as 16 lições a 6 planetas em
2 galáxias, e `Conteúdo/taxonomia/` descreve os nós. Ver o
[desenho aprovado](superpowers/specs/2026-08-07-taxonomia-eixo-tecnico-design.md).

**Isto não é decisão nova.** O dono já decidiu, em 2026-08-07, que nó `active`
significa currículo entregue e que as 16 lições pertencem àqueles planetas.
Preencher o mapa é executar aquela decisão, não tomar outra. Nenhum conteúdo
novo é criado e nenhuma promessa nova é feita.

**Fora deste item, e continua do dono:** destravar `galaxy-casos`, que não tem
conteúdo nenhum.

### 2. Trilhas com nome de anatomia entregando curso técnico — MENTIRA CORRIGIDA em 2026-08-08, reagrupamento ADIADO

**Estado:** a parte visível está corrigida; o reagrupamento continua aberto.
**Bloqueio:** migração de progresso — descrito abaixo. **Dono:** agente para a
migração; dono se quiser rever a redação dos títulos.

**Duas afirmações da versão anterior deste item estavam erradas, e as duas
importam.**

*"Não afeta o usuário — o bundle embarca uma trilha só."* Falso. `AI_TRACK` só é
lido pelo próprio `ai-catalog.ts`; o app lê `LESSON_CATALOG`, gerado a partir
deste arquivo, e `LessonCatalogService.getTracks` alimenta ProgressScreen,
JourneyHomeScreen, home e quiz. O usuário via uma trilha chamada **"Abdome"
contendo preservação de alimentos por irradiação**.

*"Trabalho pequeno, sem decisão pendente."* Falso, e perigoso.
`JourneyDefinitionService` deriva ids de nó assim:

```
node:checkpoint:<track.slug>[:<lessonId>]   // a forma muda se lessonCount deixa de ser 2
node:reward:<track.slug>[:final]            // a forma muda se lessonCount passa de 2
```

Esses ids ficam salvos em `completedNodeIds`. **Reagrupar as lições muda a
contagem por trilha e portanto muda os ids**, órfãnando checkpoints e
recompensas já concluídos de quem já usa o app. E o `id` da primeira trilha é a
chave do progresso de jornada
(`DEFAULT_JOURNEY_TRACK_DEFINITION.id = LESSON_CATALOG.tracks[0]?.id`).

**O que foi feito:** só `title`, `goal` e `description` — display puro. `id`,
`slug`, `priority` e `lessonIds` ficaram **byte a byte intactos**, então nenhum
id de nó mudou. As trilhas passaram a se chamar *Fundamentos de Radiologia*,
*Radiação, Modalidades e Equipamento* e *Prática, Qualidade e Profissão*.

**Dívida declarada, de propósito:** os slugs seguem `fundamentos`/`torax`/
`abdome` — pinados pelo contrato em `wave-1-priority-tracks.test.mjs` e
load-bearing para id de nó. Um slug `torax` sob o título *"Radiação, Modalidades
e Equipamento"* é incoerente para quem lê o código, e invisível para o usuário.
Corrigir exige migração de progresso, que é trabalho próprio.

**Texto de produto:** os três títulos são meus, não seus. Se a redação não for a
que você quer, é troca de uma linha em `Conteúdo/governança/wave-1-priority-tracks.json`
seguida de `node scripts/content/sync-catalog-to-app.mjs`.

### 3. D4 — remedida em 2026-08-08, e agora são três fatias com donos diferentes

**Estado:** aberto, P0, bloqueia produção — mas decomposta.
**Bloqueio:** trocou de lugar, não morreu. **Dono:** agente nas duas primeiras
fatias; revisor de domínio só na terceira.

Medição: [`2026-08-08-d4-destino-existe.md`](content/2026-08-08-d4-destino-existe.md).

O bloqueio registrado era "os sete conceitos não têm nó de destino", e ele caiu
em 2026-08-07 com o eixo técnico. Mas **`scripts/content/classify-source.py`
carrega a taxonomia hardcoded em Python**, versão `mvp-2026-04-04`, e não conhece
`galaxy-tecnologia` nem os seis planetas novos. É a **terceira cópia** da mesma
estrutura; as outras duas já foram reconciliadas. O bloqueio não morreu — mudou
de lugar, e agora é ferramenta que não enxerga o destino, não destino ausente.

Os 30 `needs-review` medidos contra o eixo técnico:

| Fatia | Tamanho | Quem resolve |
| --- | --- | --- |
| Achariam destino com o classificador enxergando o eixo técnico | **19** | agente |
| Fragmento de extração abaixo de 80 caracteres, o menor com 3 | **4** | agente |
| Resíduo real, sinal fraco ou nenhum | **~7** | revisor de domínio |

Os 4 fragmentos seguem no disco porque **a extração desta fonte nunca foi
regerada** depois da correção do extrator em 2026-08-07. Reexecutar o extrator os
elimina sem decisão de ninguém.

**A ordem que este item declarava estava errada, e eu a escrevi.** Dizia
"reexecutar o extrator primeiro, porque é o mais barato". Medido em 2026-08-08:
não é. `excerpts.json` e `pages.json` não são rastreados, mas
`extraction-job.json` é, e `Conteúdo/extrações` foi **deliberadamente removido**
de `allowedRoots` com motivo escrito no próprio `project.yaml`. Reextrair também
muda as fronteiras de excerto, o que invalida `classifications.json` — rastreado,
e sob a mesma armadilha de grafia. As duas fatias de agente **compartilham a
parte cara**, então fazer a extração primeiro reclassifica duas vezes.

É a Observação #195 mordendo o texto de quem a escreveu: estimei "barato" sem
medir, uma iteração depois de registrar que o campo tamanho é o que convida a
verificar menos.

**A fatia de 19 tem um bloqueio de contrato, achado em 2026-08-08.** Não é
vocabulário:

- o schema `classification-record` exige `starId` como `string`, **não nulável**;
- `validate-foundation.mjs:409` reprova `starId` que não exista na taxonomia;
- `classify_excerpt` indexa `PLANET_STAR_IDS[planet_id]` e `[0]` sem fallback;
- e o dono decidiu que **os planetas novos não ganham estrela**.

Um excerto não consegue pousar num planeta técnico. A única saída compatível com
a decisão aprovada é **tornar `starId` nulável** — schema, validador,
classificador e a forma dos 109 registros. Criar estrelas resolveria o contrato
contradizendo a decisão, e pela razão que a decisão dá: estrela é trilha curta e
não há nenhuma produzida.

Detalhe numérico que morde junto: a confiança é
`0.5·galáxia + 0.3·planeta + 0.2·estrela`. Sem a parcela da estrela, planeta sem
estrela cai abaixo do limiar de 0,7 **por construção** e vira `needs-review` —
o oposto do objetivo. Precisa renormalizar para `0.625·galáxia + 0.375·planeta`,
com teste próprio.

**Ordem corrigida:**

1. ✅ **contrato** — `starId` nulável no schema, no `validate-foundation`, no
   `classify_excerpt` **e na guarda irmã do `classify_source`**, que eu não
   varri na primeira passada e o teste do bundle pegou. Confiança renormalizada
   para `0.625/0.375`. Feito em `af7b202`;
2. ✅ **vocabulário** — `galaxy-tecnologia` e os seis planetas em
   `classify-source.py`, `TAXONOMY_VERSION` em `eixo-tecnico-2026-08-07`.
   Medido contra os 109 excertos reais: **`needs-review` cai de 30 para 22**, e
   **45 registros passam a ter `starId` nulo** — os planetas sem estrela ficaram
   alcançáveis;
3. ✅ **regeneração da classificação** — feita em 2026-08-08.
   `classifications.json` no disco passou de **79/30 para 87/22**, com 45
   registros no eixo técnico e 45 com `starId` nulo. `validate-foundation` em 0.

4. ✅ **a reextração FOI feita em 2026-08-08**, depois que a conclusão abaixo
   caiu na medição. **105 excertos, zero fragmentos abaixo de 80 caracteres,
   `needs-review` em 19.** O texto abaixo fica como registro do erro.

   **O que eu concluí, e por que estava errado.** Vendo os 18 erros do
   `validate-foundation`, inferi que remover os fragmentos exigiria re-derivar
   conceitos e formatos — as lições geradas — e portanto motor de IA local.
   **Inferi, não medi.** O conserto do extrator **funde** o órfão no pedaço
   anterior da mesma página; não o descarta. Medido nos quatro: o texto do órfão
   está **contido** no `c1` da extração nova, e as contagens fecham
   (1392 + 51 → 1444). E nas **76 ocorrências em lista, em 17 arquivos
   rastreados, todas** vinham acompanhadas do irmão `c1`.

   Então remover o id órfão não perdeu proveniência nenhuma: o texto segue
   citado, dentro do irmão. Era **remapeamento de referência**, não regeneração
   de conteúdo — e não precisou de Ollama nem de motor nenhum.

   Duas armadilhas do remapeamento, ambas achadas pelo gate e não pela revisão:
   os conceitos citam o mesmo excerto em **duas formas de id** — `excerpt:…` e
   `classification:excerpt:…` —, e limpar só a primeira deixa a cadeia de
   proveniência 1:1 quebrada; e `Conteúdo/extrações/index.json` carrega uma
   **cópia** do `extraction-job`, então atualizar só o job deixa os dois em
   desacordo.

   *Registro do erro original:*

   A triagem da D4 registrou os 4 fragmentos abaixo de 80 caracteres como
   "defeito de extração, trabalho de pipeline, some sem decisão de ninguém". Eu
   repeti isso na medição da manhã. **É falso, e foi medido executando.**

   Reextrair leva 109 excertos a 105 e zera os fragmentos — o conserto do
   extrator funciona. Mas `validate-foundation` reprovou com 18 erros, porque
   `conteúdo/conceitos/` e `conteúdo/formatos/` **citam nominalmente** os
   excertos que sumiram: `p41:c2` e `p42:c2` sustentam o conceito de preservação
   de alimentos, `p71:c2` o de qualidade de imagem, `p33:c2` o de tomografia. Os
   órfãos são **load-bearing**: sustentam a proveniência de lições que já
   embarcam.

   Restaurado rodando o extrator com `MIN_CHARS = 0` num rascunho fora do
   repositório, o que reproduz exatamente a forma anterior — 109 excertos, os
   quatro ids de volta.

   **Isto não é uma limpeza de pipeline; é regeneração de conteúdo.** Tirar os
   fragmentos exige re-derivar conceitos e bundles de formato, que são as lições
   geradas. Fica como item próprio, com esse escopo declarado, e **não** como
   "trabalho pequeno".

**Pendência operacional:** a janela de escrita aberta em `4b28bd5` para
`Conteúdo/extrações` e `Conteúdo/classificação` **precisa ser fechada** em run
próprio, como o comentário no `project.yaml` promete.

**O achado que vale mais que o número, e quase me fez enviar a versão errada.**
Um primeiro vocabulário, mais agressivo, levava `needs-review` de 30 para **17** —
melhor manchete. Mas **12 dos 20 resgates pousavam em
`planet-profissao-e-aplicacoes`**, numa fonte onde profissão é uma lição só. A
causa: `tecnico em radiologia` aparece em **77 dos 109 excertos** porque é o
cabeçalho de página do módulo. O termo de maior aparência semântica era o do
rodapé, e a métrica de manchete **premiava a colocação errada** — exatamente o
risco que a medição de 2026-08-03 nomeou, chegando por outra porta. A versão
podada resgata 12 com 4 regressões, e resgata para lugares plausíveis.

O revisor de domínio passa a receber **7 itens em vez de 30**, e só depois de o
dicionário estar consertado — que é exatamente o que a triagem de 2026-07-31
pedia para não fazer ao contrário.

### 4. ~~Dívidas de teste declaradas~~ — TODAS FECHADAS em 2026-08-08

**Estado:** concluída. **Dono:** agente.

**A mordida do `eyebrow` está provada.** O segundo caso de
`PixelHeroSplit.test.tsx` afirma que a mensagem do balão **não** carrega teto de
escala, e ninguém tinha verificado que ele morde — um teste de guarda não provado
é indistinguível de um teste vazio. A mutação rodou fora de qualquer run:
`maxFontSizeMultiplier={1.5}` na mensagem do `SpeechBubble`, **1 vermelho** no
caso da mensagem e o caso do eyebrow **segue verde**, revertido em seguida. Não
exigiu mudar o produto — a dívida era a prova, não um teto.

**O número vencido caiu.** `EXECUTION_STATUS_2026-08-07.md` dizia "15 ids de
taxonomia"; são **22** desde a execução do eixo técnico.

**O adjetivo sem âncora saiu.** A claim `:5` dizia "ampliação **geométrica**".
Medido nos dois excertos: o ancorado, `p54:c1`, diz apenas *"A ampliação"* e
carrega os números inteiros — 0,1 mm contra 0,3 mm, e a razão. *"Ampliação
geométrica"* aparece só em `p53:c1`, o vizinho. O núcleo se sustentava, o
adjetivo não. Removido e reancorado: 8 claims, `unanchored: 0`.

---

## DONO — nada que o agente faça encurta

### 5. F2 — os opt-ins do closed test. **É o caminho crítico inteiro.**

**Estado:** release `Ativo` no track `alpha`, build `1.3.0 (4)`. Na leitura do
Console de 2026-08-03: 14 contas vinculadas, 2 participando. **Bloqueio:**
humano. **Dono:** dono.

O Play exige **12 testadores participando por 14 dias corridos**, e o relógio
**não começou**. Vincular não é participar — falta cada pessoa aceitar o convite
e instalar.

**A premissa foi reconferida em 2026-08-08 e o bloqueio é real:** a A1 decidiu
conta Play **pessoal** ([ADR](adr/ADR-2026-07-27-store-account-strategy.md)), e
a exigência 12×14 vale para conta pessoal. Numa conta de organização não
valeria. Não há atalho de engenharia.

Enquanto isso não fecha, **F3**, **F4** e **F5** não podem começar. Só o dono
mede o número atual, no Console.

### 6. E3 e E4/IARC — dois formulários, e o bloqueio de um deles morreu

**Estado:** E3 aberta; E4 com o lado Apple concluído em 2026-08-05 e **IARC/Play
pendente**. **Bloqueio:** *morto*. **Dono:** dono.

A E3 estava registrada como dependente da D1. Medido em 2026-08-08:

```bash
grep -n "EXPO_PUBLIC_API_BASE_URL" radiant-app/eas.json || echo "ausente nos 5 perfis"
```

A variável **não existe em nenhum dos cinco perfis**, então o binário da v1.3 não
alcança API alguma e as labels são "não coleta" sob qualquer desfecho da D1. O
único coletor é o Sentry, que independe dessa decisão. **A E3 pode ser
respondida hoje.**

### 7. Ações de um passo, todas do dono

- enviar os commits da branch — conte com
  `git log --oneline '@{upstream}..HEAD'`; o upstream é
  `origin/codex/wave1-hardening-api-smoke`, **não** `main`, que não existe como
  ref local e devolveria vazio com sucesso;
- **A5** — gerar a service-account key no Play Console e pôr em
  `radiant-app/credentials/`; não bloqueia publicar, o AAB sobe à mão;
- enviar o pedido ao INCA — rascunho pronto, destinatário em branco de propósito;
- apagar `~/.lmstudio` (8,7 GB órfãos) e instalar o Ollama — destrava a Task 3;
- **`checkHeuristics`** — ligar os nudges ou manter shadow mode. A decisão ficou
  decidível em 2026-08-07, quando a H3 parou de medir o próprio lançamento.

---

## Precisa de aparelho ou janela de host

**B5 Android**, **C4** (flows em device físico), **C5** (TalkBack no Android),
**C6** (baseline de performance). **Não valide nem gere durante um flow E2E** —
2,3× de desaceleração medida no emulador, e o flow morre em timeout que parece
defeito do app.

## Decidido e não implantado

**D1** — opção B assinada em 2026-08-07, catálogo remoto. Nada implantado, o
domínio segue em 502. Endpoint morto degrada para o conteúdo da última release,
porque o fallback já existe em `RemoteCatalogService`. Não está no caminho
crítico da F2 nem da submissão.
