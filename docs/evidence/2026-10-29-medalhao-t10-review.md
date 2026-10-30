# T10 Ajustes — pareceres independentes

**Resultado final das revisões:** R1 FAIL histórica; FIX1 R2 SpecPASS/APPROVED
com dois P2 ADDRESSED; R3 nativo BOUNDED/PASS núcleo, APPROVED_CORE_BOUNDED.
Gesto iOS NOT PASS e P3 visual dos links legais encaminhado à T17, não resolvido.
Os pareceres integrais abaixo conservam a sequência sem transformar R1 em PASS.

## Código R1 — FAIL/CHANGES_REQUIRED

# T10 — revisão independente R1

Status: DONE — parecer congelado, 2026-10-29. Revisor não autor. Apenas este arquivo foi escrito pelo revisor.

**Spec: FAIL.** A meta transferida e a nova porta do lembrete não preservam coerência quando uma operação atravessa instâncias/telas.

**Qualidade: CHANGES_REQUIRED.** Dois achados P2 materiais abaixo. Os testes verdes demonstram o recorte executado, mas não cobrem os interleavings encontrados. Nenhum P1 identificado.

## Identidade e escopo conferidos

- Root: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`; branch `claude/trilha-medalhao-design`; BASE/HEAD `c879543c0223e9153380d217cd3ddd180735e1f8`.
- Brief r3 SHA256 `7f2d863845e93a8d06f0321967c64d2f03c74285a5b9f828a00a72f9138874b2`.
- Manifest SHA256 `c190d3bb10823ee779becc7b19263c289b702d378ec7ee3d28d5dfb45e78bacd`; diff SHA256 `cd95dafaacd8036cba2aa85b4ec5e3f62d9e7783a7e8e69447e16eeb81c2386b`.
- Os 23 caminhos conferidos têm hashes idênticos no disco, em `snapshot-r1/files/`, no manifest e em `final-freeze.json`. Revisão do diff TOTAL contra a BASE, incluindo as 22 fontes anteriores, o consumidor 23 e os dois arquivos GroupedList completos contra `/dev/null`.
- `.loop/project.yaml` e `radiant-app/expo-env.d.ts` correspondem aos hashes protegidos. Dos 35 contratos do inventário, somente cinco documentos do controlador divergem; as fontes de aplicação e a prancheta de leitura permanecem iguais. Não absorvi nem alterei documentos/trabalho alheio.
- Original `run-1793285025012-97f1822e`: fechamento abandonado diretamente de editing, zero validações finais/sucesso. Substituto `run-1793286563961-b906061e`: liberação STEP_STARTED, 57 caminhos, baseline já contendo o trabalho anterior. Não considero o segundo run supervisão retroativa. Nenhum comando Loop/sessão foi aberto pelo revisor.

## Achado 1 — P2: espera da meta desaparece no retorno ao Perfil

**Local:** `radiant-app/src/features/settings/screens/SettingsScreen.tsx:48–49,70,100–111,122`; consumidor `radiant-app/src/features/profile/screens/ProfileScreen.tsx:45–65`, especialmente linha 61.

`goalPending` e `goalSavingRef` pertencem à instância de Ajustes. A opção começa `setTier`, mas o botão de voltar continua ativo e não existe proteção de saída ou coordenação com o consumidor Perfil. Ao fazer pop, Ajustes desmonta; o Perfil refoca e executa `getSnapshot()` imediatamente. O serviço não serializa essa leitura com `setTier`. Se a gravação ainda estiver pendente, o Perfil publica a meta anterior. Quando a gravação conclui, o único continuador pertence à antiga instância de Ajustes, cuja geração foi invalidada. O Perfil permanece com a meta antiga até outro foco. Uma nova entrada em Ajustes também cria uma fila resolvida e uma guarda livre, embora a primeira gravação ainda exista.

Interleaving concreto: meta start/10 → selecionar focus/35 → `setItem` ainda pendente → voltar ao Perfil → Perfil lê start/10 → gravação conclui focus/35 → Perfil continua mostrando 10. Isto é novo no caminho transferido: o resumo consumidor agora está em outra tela/instância que o editor. Invalidar publicação da instância antiga não cancela I/O nem atualiza o novo consumidor.

**Evidência adicional executada pelo revisor:** ensaio isolado no Node v20.20.2, exit 0, sem escrita no filesystem e sem serviço/storage real. O código de `DailyGoalService.ts`, `constants/dailyGoal.ts` e `schemaVersionGuard.ts` foi lido sem modificação e transpilado em memória. Somente AsyncStorage foi substituído por memória, suspendendo o primeiro `setItem`. Resultado:

```json
{"node":"v20.20.2","profileReadWhileSavePending":{"tierId":"start","goalXp":10},"persistedAfterSave":{"tierId":"focus","goalXp":35},"filesystemWrites":0}
```

Comando do ensaio, executado no root acima:

```sh
/Users/anderson/.nvm/versions/node/v20.20.2/bin/node <<'JS'
const fs=require('fs'),vm=require('vm'),path=require('path'),ts=require('./radiant-app/node_modules/typescript');
let raw=JSON.stringify({dateKey:'2026-10-29',completedToday:7,goalPerDay:10,tierId:'start'});
let release, started; const gate=new Promise(r=>release=r), waiting=new Promise(r=>started=r);
const storage={getItem:async()=>raw,setItem:async(k,v)=>{started();await gate;raw=v;}};
const cache=new Map();
function load(file){ file=path.resolve(file); if(cache.has(file))return cache.get(file); const m={exports:{}};cache.set(file,m.exports);
const src=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const req=id=>id==='@react-native-async-storage/async-storage'?{default:storage}:load(path.resolve(path.dirname(file),id)+'.ts');
vm.runInThisContext('(function(require,module,exports){'+src+'\n})',{filename:file})(req,m,m.exports);return m.exports;}
(async()=>{const svc=load('radiant-app/src/features/daily-goal/services/DailyGoalService.ts').DailyGoalService;const now=new Date(2026,9,29,12);const save=svc.setTier('focus',now);await waiting;const profileRead=await svc.getSnapshot(now);release();await save;const persisted=await svc.getSnapshot(now);console.log(JSON.stringify({node:process.version,source:'unmodified real DailyGoalService.ts + constants/schemaVersionGuard, transpiled in memory',storage:'isolated memory mock; first setItem paused',profileReadWhileSavePending:{tierId:profileRead.tierId,goalXp:profileRead.goalXp},persistedAfterSave:{tierId:persisted.tierId,goalXp:persisted.goalXp},filesystemWrites:0}));})().catch(e=>{console.error(e);process.exitCode=1});
JS
```

O ensaio comprova a interleaving permitida pelo serviço; a consequência de UI decorre dos continuadores e lifetimes acima. Não é prova de navegação nativa.

**Lacuna das guardas atuais:** `SettingsScreen.flow.test.tsx` refoca a MESMA montagem em “refocar durante save”; o teste de Perfil troca seu mock por um snapshot já pronto. Nenhum faz editor com gravação suspensa → pop/desmontagem → consumidor real refocado/nova montagem.

**Aceite:** preservar coerência ao selecionar meta e sair antes da resolução. Exercitar sucesso e falha com I/O pendente, retorno ao Perfil e nova montagem de Ajustes, usando a fonte real com fronteira de storage controlada. O Perfil deve aguardar ou receber a conclusão válida; nova montagem não pode permitir escrita concorrente que invalide a escolha. Escolher a solução dentro da arquitetura autorizada, sem presumir cancelamento ou exigir mudança de serviço/política.

## Achado 2 — P2: o lembrete não coordena operações entre Ajustes e Jornada

**Local:** `radiant-app/src/features/push/components/ReminderRow.tsx:19–35,39–77`; nova porta em `radiant-app/src/features/settings/screens/SettingsScreen.tsx:133`; outro consumidor em `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx:267`.

Cada ReminderRow possui seu próprio `pending` e `busyRef`. A espera de refoco protege apenas a operação iniciada por aquela instância. Agora há duas portas reais: Ajustes e Jornada. Depois de iniciar uma decisão em Ajustes e sair enquanto a operação está pendente, a linha da Jornada pode refocar e ler uma decisão intermediária sem esperar pela operação da outra linha. A conclusão/rollback posterior só tenta publicar na instância antiga, invalidada pelo blur; não há releitura/notificação da Jornada.

Interleaving permitido pelo código real: Ajustes inicia ligar → `PushService.setOptIn(true)` persiste `true` antes de terminar a permissão (`PushService.ts:62–68`) → usuário sai enquanto há operação assíncrona pendente → Jornada lê `true` → o resultado final é negado e a antiga ReminderRow executa `setOptIn(false)` (`ReminderRow.ts:54–58`) → Jornada continua exibindo ligado até outro foco, embora a decisão persistida já seja `false`. Uma remontagem de Ajustes também perde a guarda contra operação ainda em andamento. Não é necessário que a navegação ocorra durante um prompt modal: a janela inclui chamadas assíncronas antes/depois dele e reconciliação/agendamento.

**Evidência:** ligação direta entre o novo consumidor, a linha compartilhada e a ordem de persistência/permissão do produtor real. Os testes verdes usam uma única ReminderRow; o caso Journey troca `getOptIn` por valor resolvido antes do refoco. Nenhum deixa uma operação da linha de Ajustes pendente enquanto refoca a outra instância. Este achado não depende de afirmar uma única chamada nativa de permissão: o serviço real já chama a permissão e a linha chama novamente, conforme contrato preservado.

**Aceite:** testar consumidores distintos com permissão/decisão/agendamento controlados na fronteira: iniciar em Ajustes, sair/desmontar com operação pendente, refocar Jornada e remontar Ajustes, então resolver grant/deny/erro. A preferência final e controles apresentados devem convergir e uma segunda porta não deve iniciar decisão concorrente indevida. Preservar gating de primeira aula da Jornada e porta manual em Ajustes, sem alterar política de push.

## Mesmo padrão em backup e preferências — classificação da BASE

`backupPending`/`backupBusyRef` (`SettingsScreen.tsx:38–39`) e `feedbackQueue`/`feedbackRevision` (42–43) também são locais à instância. Não oferecem serialização através de pop/remount: uma remontagem pode ler antes do término da escrita da montagem anterior e iniciar outra escrita. Conferi a BASE: esses caminhos já permitiam o cenário antes de T10, sem fila/guarda compartilhada. Portanto não os transformo em duas regressões novas nem aumento o número de achados. A correção dos achados deve verificar os consumidores afetados e manter os ganhos locais existentes; não se deve descrever as novas filas como coordenação global ou cancelamento.

## Contratos de código confirmados

- GroupedList preserva filhos interativos, não usa o slot decorativo de ListRow, tem superfície por `radius.rMd`/12, divisórias internas, cabeçalhos sem uppercase e tokens existentes. Switches permanecem irmãos dos textos. Não há teto de fonte/truncamento novo; as linhas podem crescer/empilhar e a tela tem rolagem única. Pixels e fala audível ainda exigem gate próprio.
- A meta usa os quatro tiers reais; `goalXp ?? goalPerDay` conserva precedência dos aliases; o resultado exibido vem do snapshot retornado. Falha mantém anterior, há guarda síncrona na montagem, geração de foco e espera de I/O na mesma instância. Perfil preserva Hoje, XP, revisões e leitura dos valores reais; G5/semana/economia intactos.
- `green-meta-before-profile` comprova oito casos verdes de Ajustes antes da remoção no Perfil; `red-transfer-profile` conserva a fase vermelha da retirada. Isso não cobre o achado entre instâncias.
- Backup consulta o resolver público real e `CloudKitPrivateAdapter`, sem rede/flag nova. Teste de Settings mantém resolver real e substitui somente `requireOptionalNativeModule`. Módulo presente mantém controle inclusive com `cloud-unavailable`; ausente/throw oferece Em breve sem opt-out no mount. Estados failed/incompatible/datas/busy continuam distintos e homologação não foi ocultada por flag inventada.
- Preferências usam read/write reais, queue local, patch independente e proteção de leitura atrasada. `null` bloqueia gravação e defaults são apenas visuais durante leitura. Serviço/defaults/storage intactos.
- Reminder mantém leitura sem conceder permissão e fluxos de grant/deny/erro/retry; Jornada mantém aula concluída como condição de visibilidade. A nova porta manual não alterou PushService/PushConfig.
- Assinatura conserva loading, none, pending/Ver, expired e unlimited com `willRenew` true/false/null. `formatShortDate` segue exportado e é usado por SubscriptionScreen; nenhum preço inventado.
- Privacy/support/terms mantêm constantes/destinos/hints reais; IconSymbol substitui o caractere textual e usa o caminho decorativo existente no fallback. ExternalLink permanece a fronteira real de abertura/erro. Não houve troca de links por callback fictício de produção.
- Replay continua Modal real, com `onRequestClose` e `onFinish` fechando; o consumidor 23 só mudou seis seletores. Safe area, marcador, FirstRunService/checkpoints e branches de replay foram preservados. `WelcomeFlowScreen` continua chamando `activeCheckpoint.finish()` em concluir/pular; não interpreto o replay como zero I/O.
- Console permanece em SHOW_DEV_TOOLS; AccountSyncCard usa ENABLE_REMOTE_SYNC e isApiConfigured. Rotas, dependências, runtimeVersion/fingerprint, SDK, adapters, serviços e políticas protegidos não mudaram. Copy baseline somente reduziu cinco tetos.

## Auditoria das evidências fornecidas

Recebi e li os recibos JSON com comando, cwd, Node v20.20.2, EXPO_NO_DOTENV e exit; conferi resumos dos logs. Não repeti suítes. Resultados fornecidos e auditados:

| Evidência | Resultado e alcance |
|---|---|
| final-focals | 11 suítes/142 testes PASS |
| r3-consumers-green | 10 suítes/156 testes PASS; caminhos disjuntos dos focais, total 298 |
| final-settings-cpu | 21 testes Settings PASS sob taskpolicy; reexecução, não soma ao total |
| r3-reentry-green | 3 testes PASS; subconjunto já incluído nos consumidores |
| final-typecheck | tsc --noEmit, exit 0 |
| final-lint | exit 0, zero erros e 24 warnings em fontes não próprias; não é lint sem warnings |
| final-visual | strict PASS, 473 arquivos, zero regressões/41 baselined/3 exceções existentes |
| final-contracts | 105 contratos PASS |

Vermelhos causais e respectivas fases verdes constam em red-settings-causal, red-components, red-reminder-specific, red-transfer-profile, red-refocus-pending e red-feedback-unknown. As tentativas com hoist/RangeError/bootstrap ausente não são prova causal aceita; sua existência não foi escondida. A validação configurada final do controlador continua pendente e não foi substituída por estes comandos.

`mutations.json` contém 25 registros históricos, mas 24 nomes distintos: feedback-stale-read aparece duas vezes e há somente um par JSON/log com esse nome. Logo há 24 defeitos com últimos logs causais verificáveis; não há prova de 25 logs independentes preservados. Conferi os 24 pares: exit 1, fragmento de falha esperado presente e ausência de TypeError/ReferenceError/SyntaxError como causa aceita. Os alvos incluem meta/retorno/tier/duplo/blur/refoco, preferências/loading/patch/leitura, backup/capacidade/transiente/duplo, lembrete/deny/duplo/leitura/erro/escala, grupos/raio/uppercase, legal/destinos/suporte e assinatura/pending/renovação desconhecida. Esses resultados não demonstram os dois cenários de lifetime acima.

## Limites e próximo passo

Não executei runtime/nativo, suítes novas/repetidas, build/install, Loop, compra, backup real, permissão, replay real, link externo, commit/push, ações externas ou subagentes. O único ensaio novo foi o serviço isolado em memória descrito no achado 1. Nenhuma ação foi dirigida ao reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`.

O preflight somente leitura não prova pixels, voz, Android Back ou gesto iOS. A ausência prevista desse ensaio não foi promovida a achado de código. Nativo finito posterior, final Loop, G1–G8/G2T14/P3T17/G5, segundo dia, aparelho, fala audível, FPS e produção permanecem gates separados.

Devolver os dois P2 ao autor para Fix1 e testes causais de pop/remount/consumidores distintos; controlador coordena e documenta, sem corrigir produto. Nova revisão deve receber novo freeze/diff contra a mesma BASE. Este parecer fica congelado ao DONE.

## R2 — FIX1 aprovada no código

Parecer local SHA `99e33808e4c9f9d8ac7d4e5f6378a87f1cc43732fb76a59e50e396fd9a69b1f8`; corpo abaixo preservado, exceto root local normalizado como `<worktree>`. R1 histórica permanece reprovada.

# T10 FIX1 — revisão independente R2, escopo focal

Status: DONE — parecer congelado em 2026-10-29. Mesmo revisor não autor de R1. Ownership de revisão: somente este arquivo; R1 preservada.

**Spec: PASS no recorte de código/contratos de T10 + FIX1.** Os dois P2 de R1 estão ADDRESSED.

**Qualidade: APPROVED no recorte revisado.** Nenhum novo achado P1/P2 material no delta. Isso libera o próximo gate nativo finito do controlador; não significa aprovação dos gates nativo, final Loop ou release.

## Pacote e integridade

Root `<worktree>`; BASE/HEAD `c879543c0223e9153380d217cd3ddd180735e1f8`; branch `claude/trilha-medalhao-design`.

Hashes medidos e iguais aos fornecidos:

| Artefato | SHA256 |
|---|---|
| brief-r4.md | `41520f6968ec9f98eb6385ee4e758188d8526c250afc4bd517dcfc55829c62f5` |
| fix1.md | `3d29477931edda393d025ef318c27119ebbc2bd35a85026330db4b1a834f8bd7` |
| final-freeze-r2.json | `40f211bdd567fcc04a0fee17aac33b42ebd5c7a491d6f83e84eac546bf6f34cb` |
| snapshot-r2/manifest.json | `33f034206a63bc1ba14279d59d277c9e6984bd215bc828d527f953b71893a9e9` |
| snapshot-r2/full.diff | `caf41112bc2bb35134db648675e467f150e8a9b8f0aca09ee562e57968a24638` |
| snapshot-r2/delta-from-previous.diff | `48bcb242c5d057c8bb9c07b3a3c60687f9f5b345ff0fc55bab0ae3e885370273` |

Os 27 arquivos correspondem ao manifest/snapshot/freeze. Dos 23 de R1, 20 mantêm os mesmos bytes; somente SettingsScreen.flow.test.tsx, ReminderRow.tsx e ReminderRow.test.tsx mudaram. Os quatro serviços/testes adicionais já existiam no Git e entram no full diff contra BASE; sua aparição integral como adição no delta de snapshots decorre de não constarem no snapshot R1. Não confundi essas duas bases.

Li brief r4 e a exceção mínima, R1/aceites, advisory e Fix1; revisei o delta de sete arquivos e confrontei os serviços diretamente com a BASE. Não reabri auditoria geral da UI inalterada nem ampliei correção para backup/preferências.

## P2-1 de R1: meta após pop/desmontagem — ADDRESSED

`radiant-app/src/features/daily-goal/services/DailyGoalService.ts:41–65` mantém uma cauda privada no singleton. Cada chamada de getSnapshot, setTier, recordXp e reset se inscreve na ordem antes de executar I/O. Assim, o Perfil ou Ajustes B que leem depois do início do save de A aguardam sua conclusão e consultam a fonte. A barreira sobrevive à desmontagem; não depende de importar Settings ou de suas refs.

`getSnapshotUnlocked` continua incluindo rollover na mesma operação; reset e recordXp não escapam da ordenação. `recordQuizCompletion` delega uma única vez a recordXp (`DailyGoalService.ts:209–211`), sem se enfileirar e aguardar uma API pública atrás de si. Internos de load/save não reenfileiram. Não há ciclo inverso deste serviço para Push que introduza deadlock entre domínios.

Date default é criado na chamada e os três argumentos Date são copiados por valor na entrada (`49–61`), antes da espera. Os corpos antigos mantêm tiers, cap, fórmula, defaults, sincronização de data, fallback e G7. `ordered` devolve `result` ao chamador e recupera apenas a cauda, portanto falha pública continua rejeitada sem envenenar a próxima operação.

**Prova causal e consumidor:** `SettingsScreen.flow.test.tsx:234–270` mantém SettingsScreen e DailyGoalService reais, suspende AsyncStorage.setItem, aciona Back, desmonta A e monta ProfileScreen ou SettingsScreen B. A nova tela continua carregando, não publica start/10, e recebe focus/35 depois da liberação, sem outro foco. O caso de falha real de storage preserva a fonte anterior, não publica erro tardio de A e permite nova escolha de 50. O teste chama router.back mockado e desmonta/monta componentes reais: comprova lifetime React e produtor, não navegação nativa.

`fix1-red-goal` registra sete falhas causais antes do fix; testes finais e mutações de leitor/escritor fora da fila atingem o sintoma original. Casos adicionais cobrem XP/cap, reset, rollover, alias e rejeição seguida de nova operação. `fix1-red-date-argument` tem três falhas específicas; o verde posterior tem 13 testes de serviço aprovados.

## P2-2 de R1: lembrete entre instâncias — ADDRESSED

`radiant-app/src/features/push/services/PushService.ts:52–111` põe a operação composta inteira na fila do singleton: setOptIn legado/primeira permissão, segunda consulta/permissão preservada, deny → false/cancelamento ou grant → evento/agendamento e leitura final. Retornar a Promise da leitura final mantém a fila até seu término. Não há liberação entre o true provisório e o rollback/agendamento.

getOptIn, setOptIn, requestPermissionIfNeeded, scheduleDailyIfEligible, cancelAll, onAppOpen, simulateIgnoredPush e getDebugState públicos participam da mesma ordem. As chamadas internas usam Unlocked; conferi os vínculos no código. Scheduler/getDebug não aguardam o leitor público atrás de si. A mesma forma de cauda recuperável preserva rejeição pública e permite a próxima decisão após falha.

`setOptInUnlocked` (`PushService.ts:124–131`) mantém o comportamento legado: true grava e consulta permissão, sem herdar rollback novo. O rollback pertence somente à operação composta da linha. As duas consultas/permissões anteriores da linha foram conservadas; o scheduler ainda verifica permissão conforme seu contrato. A equivalência dos corpos antigos e os testes de legacy deny confirmam que este fix não aproveitou a serialização para decidir nova política de consentimento/agendamento.

`ReminderRow.tsx:46–64` delega à transação e publica somente a decisão final enquanto sua geração ainda vale. Loading/busy, guarda síncrona contra duplo callback, leitura inicial sem permissão e reconciliação depois da falha continuam presentes. As refs locais agora são proteções de UI; a garantia entre consumidores é do serviço.

**Prova causal e consumidor:** `ReminderRow.test.tsx:127–140` usa ReminderRow/PushService reais e somente fronteiras AsyncStorage/Notifications controladas. A persiste true, fica parada na segunda consulta e é realmente desmontada; B nova não oferece switch confirmado enquanto o resultado está pendente. Liberar grant, deny ou erro nativo leva B ao valor final persistido sem refoco. Testes do serviço suspendem também rollback e scheduler e demonstram que leitor, scheduler externo e setOptIn legado não intercalam efeitos. Erro de gravação/agendamento continua público e uma próxima operação termina.

O teste focal usa duas montagens reais da linha compartilhada, sem montar toda a navegação Settings→Journey. Isso é suficiente para a fronteira causadora do P2, pois ambas as portas continuam usando a mesma classe/componente e singleton. O consumidor Journey existente passou no conjunto final, mantém o gating de aula concluída e não teve código de produto alterado. Não promovo essa composição de evidências a prova de rota nativa.

`fix1-red-reminder-lifetime` conserva três falhas antes do fix; as mutações de leitor fora da fila e transação partida falham pelo switch/true intermediário, sem producer mockado retornando uma decisão já coordenada.

## Preservação do contrato e evidências

Verifiquei independentemente a comparação dos 12 corpos antigos com a BASE usando a lógica AST de `fix1-equivalence.cjs`, executada em memória com sua instrução de escrita removida. Exit 0 no Node v20.20.2: quatro corpos DailyGoal e oito Push iguais, exceto nomes de chamadas internas Unlocked. O arquivo de evidência fornecido não foi regravado. Revisei separadamente wrappers, composição, cópias Date e alias, que essa comparação não pretende provar.

Sem mudança no produto Settings/Profile/Back, nem bloqueio de saída/gesto, timeout de produção, cancelamento, schema, política, dependência ou persistência adicional. A fila dura o processo JS. Uma operação de I/O que nunca termina pode manter leitores posteriores em carregamento; esta é a limitação explicitamente aceita do desenho, com Back livre. Não garante atualização reativa para uma tela que leu antes do começo da mutação e nunca relê. Backup/prefs permanecem limites preexistentes fora de Fix1.

Auditei recibos JSON e resumos de logs, todos com comando literal, cwd radiant-app, Node v20.20.2, EXPO_NO_DOTENV=1 e exit. Não repeti suítes sem hipótese nem executei qualityfull:

| Gate fornecido | Resultado conferido |
|---|---|
| fix1-final-focals | 14 suítes / 170 testes PASS |
| fix1-final-consumers | 11 suítes / 204 testes PASS |
| Conjuntos normais | 374 testes em 25 suítes; caminhos disjuntos |
| fix1-final-cpu | 40 testes (Settings 24 + Reminder 16), duas suítes PASS; 56,01 s de processo; reexecução, não soma |
| fix1-final-typecheck | tsc --noEmit, exit 0 |
| fix1-final-lint | exit 0, zero erros / 24 warnings fora dos arquivos próprios |
| fix1-final-visual | 473 arquivos, zero regressões, 41 baselined / 3 exceções existentes |
| fix1-final-contracts | 105 contratos PASS |

`fix1-mutations.json`: 18 tentativas, 17 aceitas distintas e uma descartada. Para cada aceita conferi par JSON/log próprio, exit 1 e fragmento de falha nomeado. O primeiro goal-tail-poison encerrou por rejeição não tratada e não conta; a versão observed acrescenta catch lateral apenas no mutante, sem recuperar sua cauda, e a asserção do consumidor seguinte efetivamente falha. Push observed tem o mesmo desenho. Alias/interno deadlock falham pelo timeout normal de 5000 ms do runner, após fronteiras liberadas; nenhum timeout foi acrescentado ao produto. As mutações antecedem a cópia defensiva final de Date: esta tem vermelho/verde próprio e os gates finais são posteriores. Não trato a contagem como 18 provas causais aceitas nem como prova nativa.

## Fechamento e limites

Escrito somente `reviewer-r2.md`. Nenhum produto/teste/doc canônico/PNG alterado; nenhum runtime, Loop/sessão, build/install, compra, permissão real, backup, replay, link externo, commit/push ou subagente. Nenhuma ação no reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`.

R1 FAIL permanece histórico e intacto; R2 aprova o código congelado identificado acima após Fix1. Nativo finito autorizado é o próximo passo do controlador. Final Loop configurada, G1–G8/G2T14/P3T17/G5, segundo dia, dispositivo, voz audível, FPS, produção e release seguem separados e pendentes. A aprovação focal não elimina esses gates.

Parecer congelado ao DONE; nenhuma correção de produto pelo revisor.

## R3 — prova nativa delimitada

Parecer local SHA `2dec5ee8bc664232d32ad36aa5e5ec9eef5b69e8a78f2331b162aecd6dab5d86`; corpo abaixo preservado, exceto root normalizado.

# T10 — R3, revisão independente da evidência nativa

Status: DONE — parecer congelado em 2026-10-29. Mesmo revisor de R1/R2, não autor nem executor nativo. Escrevi somente este parecer e mosaicos auxiliares locais `reviewer-r3-*`; não alterei produto ou evidência versionada.

**Spec: BOUNDED / PASS no núcleo observado.** Lista agrupada, conteúdo por rolagem, fontes normal/inicial máxima em montagens separadas, quatro tiers sem selecionar, botão Voltar iOS e Back Android têm evidência suficiente no recorte. **Gesto iOS: NOT PASS**; não há aceitação integral do requisito de retorno por gesto.

**Qualidade: APPROVED_CORE_BOUNDED**, com um P3 visual a encaminhar a T17/revisão ampla e os limites abaixo obrigatórios. Nenhum P1/P2 de produto confirmado por esta evidência. Não atribuo ao código a causa do gesto sem navegação. R2 permanece aprovação de código; R3 não executa nem substitui o gate final Loop/quality ou gates de release.

## Identidade e integridade conferidas

Root `<worktree>`; BASE `c879543c0223e9153380d217cd3ddd180735e1f8`. Freeze de código R2 `40f211bdd567fcc04a0fee17aac33b42ebd5c7a491d6f83e84eac546bf6f34cb`; parecer R2 `99e33808e4c9f9d8ac7d4e5f6378a87f1cc43732fb76a59e50e396fd9a69b1f8`.

| Artefato auditado | SHA256 medido |
|---|---|
| native-report.md | `1def534182d605bceda8ca7dd5d2d85aa12b3fa5e78a6d2b7e7c46091f5f7c99` |
| native-provenance.json | `7b54d5877a210d10672f97306e7e2f8de4e4ca655d2a70a053d890a8f3e076a9` |
| native-cleanup.json | `a7ebc54aa6c468204576722e54031c2559f923541025e67fe03b5f964c5df507` |
| native-DONE-freeze.json | `127d3159b9e2c011dd9dc63bf941f20dc4277876fb177d70c043a00f74cddc55` |
| docs/evidence/2026-10-29-medalhao-t10-native.json | `86ed4a4bbcbf2d00ffab68ac9bc604f3f8d2ff072fa2cf9b4f2317043b56202c` |

Todos correspondem aos hashes fornecidos. Conferi os 149 arquivos do freeze bruto no disco e os 149 objetos de rawFiles contra bytes/hash/rawManifest: sem divergência. Os 88 textos UTF-8, 37 PNG extras em base64 e 24 referências a PNG versionado preservam os bytes originais; as 24 referências apontam a 23 arquivos por deduplicação de bytes. Conferi os 23 pares controllerTarget/source e respectivos hashes: iguais. Os 61 PNG locais têm formato PNG, dimensões e hashes declarados. Não tratei JPEG convertido como PNG original.

Ao terminar, os 27 arquivos de produto e os dois protegidos continuam iguais ao freeze R2. Hashes before/after e hash do diff de produto do executor também coincidem. Nenhuma revisão geral do código R2 foi repetida.

## Inspeção visual efetiva

Olhei os PNG, além das árvores e relatos. Mosaicos locais apenas reduzem originais para comparação; capturas principais também foram abertas diretamente. A cobertura revisada inclui os 23 nominais selecionados e todos os complementos exigidos para a continuidade máxima:

- iOS normal: header, groups, bottom e opções normais; também botão de retorno, duas capturas de gesto e nova montagem normal após restauração.
- `completeCoverageSets.iosInitialAX5`: header + os 17 suplementos 01–17 + bottom, como uma sequência de rolagem. Não contei 17 suplementos como 17 cenários nem três nominais como toda a lista.
- `iosMaxGoalFour`: opções 01–04, mais `native-ios-max-goal-full-ax.json` e confirmação de expansão.
- Android normal: header, groups, bottom, opções e Perfil depois do Back; nova montagem normal após restauração.
- `androidInitial2`: header/groups + suplemento 01 + bottom/suplemento 02/bound. `androidMaxGoalFour`: imagem complete com as quatro opções inteiras, mais XML.

Em fonte normal os rótulos, notas e estados são legíveis, em grupos contínuos e divisórias, com hierarquia coerente. Sons/Vibração aparecem ligados e Lembrete desligado. iOS mostra backup com switch desligado, sem backup anterior e erro de acesso ao iCloud; Android mostra ausência de capacidade, Em breve e rodapé local. O console visível corresponde ao cliente de desenvolvimento observado, sem evidência de sua presença em build de aluno.

Em AX5 iOS, **o cabeçalho fixo ocupa aproximadamente metade da tela e o título quebra em “Ajust/es”**. Isso torna a leitura longa e exige muito mais rolagem. Os suplementos mostram as palavras restantes e todos os trechos da lista, inclusive a nota de sons, mensagem de iCloud e fim legal/replay/console. Não observei glifo permanentemente cortado, colisão horizontal ou conteúdo tornado inalcançável na sequência fornecida. Há conteúdo parcial no limite superior/inferior de cada viewport; isso não é, isoladamente, truncamento do componente. Registro o custo de rolagem sem chamar a composição ótima ou sem preocupação.

Android 2.0 empilha textos e switches; o conjunto suplementar alcança o rodapé e o console completos. As quatro opções ficam simultaneamente inteiras no PNG complete. iOS precisa de quatro vistas sobrepostas: Começar10, Ritmo20, Foco35 e Desafio50 são completos em alguma vista da sequência. Não exijo caberem simultaneamente no viewport máximo nem uso a nominal fechada como prova de expansão.

## P3 visual — chevrons dos três links legais abaixo dos rótulos

**Local de apresentação:** `radiant-app/src/features/progress/components/LegalLinksCard.tsx:16–22` (label/ícone dos links). Esta localização identifica o componente; não atribui a causa ao estilo, ao wrapper ou à biblioteca.

**Prova visual específica:**

- `docs/evidence/assets/2026-10-29-medalhao-t10-ajustes/ios-settings-normal-bottom.png`, SHA `260047ffa3a2e4d22fd05434fa4fe5fb9b303023ea0a5cdeb3c3d263fdd86452`;
- `docs/evidence/assets/2026-10-29-medalhao-t10-ajustes/android-settings-normal-bottom.png`, SHA `c767a9268995f66bc2b57b405a9b68da2ce35cc74d6686ab9cfda105f6ccc28d`;
- persistência em AX5: raw `native-ios-max-supplement-14.png`–17 e Android2.0 `native-android-max-supplement-02.png`/bound.

Privacidade, Termos de uso e Central de Suporte exibem chevron numa linha inferior, à esquerda, enquanto Rever a apresentação mantém chevron à direita do rótulo. A diferença já é visível na fonte normal e reduz a consistência da lista. Os três rótulos continuam íntegros; a hierarquia mantém os nomes/hints de link e nenhuma perda de destino foi demonstrada. Links não foram acionados neste ensaio. Portanto classifico como **P3 menor, não bloqueante do núcleo**, sem elevar alinhamento a falha de navegação/acessibilidade não medida.

**Encaminhamento:** preservar o achado para T17/revisão ampla; conferir a composição visual real dos três links antes de corrigir e provar o alinhamento nos dois sistemas. Não está resolvido. Este parecer não autoriza produto fix nem reabre o ciclo de P2 de lifetime já aprovado em R2.

## Matriz de evidência e limites

| Requisito/recorte | Resultado | Evidência/limite |
|---|---|---|
| Perfil → engrenagem → Ajustes | OBSERVED | Capturas, ações e árvores reais; sem deep link de Ajustes presumido |
| Normal iOS large / Android1.0 | PASS BOUNDED | Três vistas de lista e opções por plataforma; P3 legal registrado |
| Inicial máxima, montagem separada | PASS BOUNDED | iOS AX5 e Android2.0 relidos antes da abertura; conjuntos completos acima |
| Restaurar fonte e nova montagem normal | PASS BOUNDED | Stop/restauração/releitura/relaunch e capturas prontas; não prova troca ao vivo |
| Quatro tiers sem salvar | PASS BOUNDED | iOS opções01–04/fullAX; Android complete/XML; Começar10 permaneceu selecionado |
| Fechar meta sem seleção | OBSERVED | Normal pelo controle; máxima iOS fechada por POP, Android pelo controle; remount fechado |
| Botão Voltar iOS | PASS BOUNDED | `ios-settings-back-profile.png` mostra Perfil; também ação POP em máxima |
| Back Android | PASS BOUNDED | runtime linha240 KEYCODE_BACK; `android-settings-back-profile.png` e XML mostram Perfil |
| Gesto de borda iOS | **NOT PASS** | runtime linhas28/31, duas tentativas; ambas as capturas continuam Ajustes |
| Papéis/estados acessíveis | PASS BOUNDED estrutural | Switches e rádios/checked em AX/XML; não é VoiceOver/TalkBack audível |
| Backup real disponível vs ausente | OBSERVED | iOS switch + cloud-unavailable; Android disabled Em breve; nenhum toggle real |
| Save/meta, som/háptica, opt-in, compra, backup, links/replay | NÃO TESTADOS | Não inferir funcionamento efetivo pelo estado estático nem pela suíte automatizada |

O full AX iOS conserva `Meta diária: Começar` expanded e os quatro elementos com AXValue `radio button, checked/unchecked` — não são ausentes só porque a árvore compacta não os lista como botão. AndroidXML contém quatro `android.widget.RadioButton`, checked true somente em Começar, todos enabled; backup ausente tem enabled=false. Isso sustenta a estrutura, não leitura audível, foco percorrido pelo leitor ou adequação tátil efetivamente acionada.

## Gesto iOS e capturas que não podem ser promovidas

O comando da ferramenta retornar SUCCEEDED prova execução do gesto sintético, não navegação. O primeiro preset0.5 e a segunda tentativa com dimensões explícitas402×874/duração0.25/post0.4 deixaram a tela em Ajustes. `native-report.md:23,34`, PNG nominal `ios-settings-gesture-profile.png` e raw `native-ios-gesture-explicit-402x874.png` estão coerentes: **Perfil não foi alcançado**. Não atribuo causa ao produto nem alego gesto funcionando. O nome do arquivo permanece histórico, não é veredito.

O PNG local originalmente chamado `native-ios-settings-goal-options-max-initial.png` mostra editor fechado e não conta como opções; o mapping versionado seleciona opções01, com02–04/fullAX. O máximo Android nominal cortava Desafio; o mapping usa complete. Branco transitório de Android e a captura ainda Loading não contam como telas prontas. O pacote conserva essas tentativas e seus limites, sem apagá-las ou somá-las a PASS.

Não houve troca de fonte ao vivo na mesma montagem em nenhum sistema. Inicial máxima e remount normal não diagnosticam nem corrigem a perda histórica de rota Androidlive/return da T09. Nenhum runtime novo foi aberto para preencher essas lacunas.

## Proveniência do runtime e limpeza

Proveniência recebida: iOS `E262D4C1-99BE-496B-8567-0291C14E6533`, iOS26.5; AVD `radiant-entrada-api34`, emulator-5554/API34/arm64-v8a, novamente identificado por nome antes das ações. Clientes existentes1.4.0(3), sem build/install. Metro próprioPID/PG560, cwd absoluto deste root/radiant-app, Node20.20.2 e EXPO_NO_DOTENV=1/CI=1; log registra os bundles de entrada iOS2605 e Android2580 módulos. A CLI XcodeBuildMCP foi invocada com Node24 e simulatorId explícito; não confundo esse runtime de ferramenta com o Node20 do Metro.

Esses dados, fontes congeladas e tela nova observada sustentam o vínculo operacional. **Hash do payload JS bundle não foi coletado**; nenhuma prova de bundle de produção/loja. Os logs mostram I/O automático de bootstrap/restore e cloud-unavailable. Não existe alegação de zero I/O ou zero escrita automática decorrente de montar a aplicação.

`native-runtime.jsonl` contém comandos/exit e destinos; não há comando com o UDID reservado. Conferi as sequências de fonte/stop/reabertura/Back/gesto e os recibos finais. Cleanup **CLEAN como medido ao fim do executor**, sem reabrir emuladores para nova medição:

- iOS large restaurado e relido antes de terminate/shutdown; E262 Shutdown e cliente1.4.0(3) preservado;
- Android1.0 restaurado; animações1.0/1.0/null iguais à baseline atual, sem substituir por uma baseline antiga;
- aplicativo Android sem PID, reverse próprio8081 removido e lista vazia, AVD próprio encerrado;
- PIDs560/32529 ausentes e porta8081 sem listener; ADBdevices vazio; daemon22919 preexistente preservado;
- 27 hashes de produto + policy/expo-env e diff antes/depois idênticos. Nova conferência somente de arquivos pelo revisor confirma os mesmos 29 hashes.

## Fechamento

Sem produto/teste/doc canônico/PNG versionado alterado, sem suíte nova/repetida, runtime, build/install, Loop/sessão, ação externa, commit/push ou subagente pelo revisor. Mosaicos são auxiliares locais; a prova durável são os PNG/JSON originais verificados.

**Próximo:** controlador registra R3 BOUNDED, P3 legal para T17 e gesto NOT PASS, depois conduz somente o gate final configurado que lhe pertence. Não inferir aceite de G1–G8/G2T14/P3T17/G5, segundo dia, dispositivo, voz audível, FPS, produção, merge ou release. Parecer congelado ao DONE.
