# T02 HUD — revisão independente r1

Medido em 26/10/2026, 07:28 America/Bahia. Revisor somente leitura do produto. Base `55e21aef2d7aa1ab3c78685996c59629752595a8`, branch `claude/trilha-medalhao-design`. Contrato: Tier 1/focal, sem Loop/brain, quality completo, build, nativo, commit ou push próprios.

## Vereditos separados

- **Spec/código: APROVADO, condicionado à prova nativa pendente.** Nenhum achado P1/P2 concreto no produto do snapshot r1. Os rulings vinculantes r2 prevalecem: ilimitado somente `∞`, cinco corações compartilhados preservados no QuizTopBar, folha de cinco corações ainda T12.
- **Qualidade/código: APROVADO, com observações menores de evidência abaixo.** A revisão não converte a suíte Jest em prova visual/temporal nativa. Não foi encontrada mudança de economia, regra de consumo/recarga ou API pública.
- **T02 inteira: NÃO CONCLUÍDA por este parecer.** Faltam leitura das capturas nativas de trilha/aula em iOS/Android e a validação configurada do controlador. Este documento não autoriza build, instalação, merge, release ou uso do simulador reservado.

## Integridade e escopo

Os 15 arquivos copiados conferem com `manifest.json` por SHA-256; o produto atual confere byte a byte com o snapshot. Prova em `task-3-review-integrity.json`. O diff de produto contém somente HUD.tsx, HUD.test.tsx e a remoção dos dois registros HUD R1/R2 em visual-qa-policy.json. copy-style-baseline.json é idêntico à base. Documentação concorrente não foi editada pelo revisor. A inspeção usa o snapshot imutável e confere os consumidores reais na árvore.

## Conferência da spec

| Contrato | Resultado e âncora em HUD.tsx / HUD.test.tsx do snapshot |
| --- | --- |
| Finito 0/1/3/5 | Um HeartIcon e contagem; vazio em 0, cheio quando há saldo. Render real do SVG/preenchimento verificado: produto 176–192; testes 527–534. |
| Ilimitado | Predicado por status, inclusive count 0; somente ∞, sem coração/número. Produto 214–229; testes 190–224 e 255–265. Mudanças do count ilimitado não montam HUDHeartsCount nem animam vidas. |
| Snapshot prevalece | `snapshot.count ?? hearts`; teste usa hearts=5/snapshot.count=0 nos modos normal e compact, verifica texto/rótulo/ausência de 5: produto 214; testes 536–556. |
| Recarga e acessibilidade | Recarga só no accessibilityLabel; nó agregado ou botão único, conteúdo interno oculto quando há callback. Rótulo mantém contagem/máximo/tempo; produto 178–193 e 219–240; testes 163–178 e 536–556. |
| Abrir folha | Callback preservado no Pressable para finito e ilimitado; testes acionam botão e exigem uma chamada. Não se alega navegação nativa por esse teste unitário. |
| Pulso de perda | Usa o HeartIcon/hook existente. Perda torna o único glifo temporariamente vazio, retorna ao saldo após duration.ui=220ms; ganho cancela timer e limpa estado. Perdas rápidas reiniciam por chave da contagem. Produto 162–188; testes 242–359. |
| Redução de movimento | Sem pulso quando preferência verdadeira; contagem/rótulo continuam e o símbolo permanece cheio se saldo>0. Produto 164–176; testes 292–301 e 347–359. |
| Mudança de modo/unmount | Branch ∞ desmonta HUDHeartsCount; cleanup do efeito cancela timeout. Correto por inspeção (172–174/222–229); não há teste explícito dessa fronteira. |
| API compartilhada | Assinaturas/export de HeartsDisplay e UnlimitedHeartsDisplay preservados; QuizTopBar continua importando HeartsDisplay. Estado/animação do export mantidos; único delta visual compartilhado é gap 3→space.s0(4). Guardas 396–413 e suíte real do QuizTopBar passam. |
| Folha/T12 | HeartsSheet inspecionada e inalterada; não contém os cinco corações. Premissa anterior corrigida explicitamente em requirements/planos; sem antecipar T12. |
| Tokens/área de toque | layout.rowBetween/layout.row substituem geometria repetida; espaços existentes, Sora explícita, botão mínimo 48×48. Renomear container→hud acompanha adoção real da primitiva (275), não apenas evasão do regex R2. Demais valores permitidos não geram regressão visual QA. |

## Qualidade e TDD

O render usa os componentes reais HUD/HeartIcon e nós nativos/SVG. As asserções leem texto, rótulo, ancestral horizontal e preenchimento de Path real; não foi introduzido espelho de props em produção. O mock de Reanimated faz animações chegarem imediatamente ao destino: serve para verificar agendamento/saída, **não** os frames intermediários nem a sensação do pulso. A restauração por timeout de JS é observada com fake timers.

O vermelho bruto é real: depois de uma invocação inicial com config inexistente, há Jest executado e **15 falhas/35 sucessos** contra a composição anterior. Falhas de cardinalidade 5→1, contagem sem snapshot e recarga/layout mostram a ausência da nova composição; não são apenas erros de compilação. O verde posterior passa a **51 testes HUD**. O caso adicional ilimitado preserva comportamento que já existia; não exige fabricar vermelho num comportamento já correto.

### Observações menores (sem P1/P2 de produto)

1. **Vermelho temporal não discriminante.** Nos casos de restauração e perdas rápidas do log vermelho (`red.txt:372–404`), a execução aborta no spy `withDelay` (6 chamadas em vez de 3), antes da asserção final do preenchimento. Assim, esse vermelho prova seleção/agendamento inadequado da composição antiga, mas não demonstra isoladamente que uma guarda detecta a ausência do reset aos 220ms. O verde final observa retorno após duration.ui, porém não observa 219ms nem testa mutação específica do timeout. Evitar registrar esse log como prova independente de todos os detalhes temporais.
2. **Cleanup e fronteiras de modo têm inspeção, não teste dedicado.** HUD.test.tsx cobre perda, ganho, rapid loss e unlimited estável, mas não unmount durante o pulso, finito→unlimited→finito ou mudança dinâmica da preferência. O cleanup atual está correto por inspeção. A frase do audit sobre limpeza nesses caminhos deve ser entendida com esse limite.
3. **Warnings de Sheet permanecem visíveis.** A reprodução independente emite sete avisos `act()` de AppButton/useReducedMotionPreference na suíte HeartsSheet inalterada. HUD e QuizTopBar passaram; não atribuir saída totalmente limpa ao conjunto de três suítes.

## Validação independente reproduzida

Node **v20.20.2**, `EXPO_NO_DOTENV=1`, diretório radiant-app:

- `npm test -- --runInBand --runTestsByPath src/ui/components/HUD.test.tsx src/features/hearts/components/HeartsSheet.test.tsx src/features/quiz/components/QuizTopBar.test.tsx`: **3 suítes / 58 testes passaram**; warnings Sheet acima. Saída: `task-3-review-jest.txt`.
- `node --test scripts/maestro-contract.test.mjs scripts/copy-style-contract.test.mjs`: **102/102 passaram**. Saída: `task-3-review-contracts.txt`.
- `npm run visual:qa:strict`: **0 regressões**, 50 baselined, 3 exceções, 462 arquivos. Saída: `task-3-review-visual.txt`.
- `git diff --check`: sem erro.

Não executados: quality completo/validação Loop, build, instalação, simulador, dispositivo, VoiceOver/TalkBack, leitura visual das duas plataformas ou avaliação de frames reais. O controlador mantém esses gates. Não há afirmação de aceitação nativa nem fechamento integral de T02.

---
# T02 HUD — adendo da revisão R1

**Veredito R1: ChangesRequested.** Este adendo substitui somente o veredito de aderência do parecer `task-3-review-r1.md`, após a inclusão no brief r3 de um requisito literal omitido pelo controlador no brief r2. Não há reabertura geral da revisão nem inspeção do produto vivo/fix1.

## [P2] Completar a superfície da pílula de vidas finitas

**Requisito:** plano 5/tarefa 2, interface literal agora incluída em `task-3-brief-r3.md`: “As vidas viram uma pílula igual às de XP e sequência: o ícone de coração de HudIcons e o número.”

**Achado no snapshot R1:** `radiant-app/src/ui/components/HUD.tsx:178–179` aplica somente `styles.heartsCount`; sua definição em **311** contém apenas layout.row e gap. Falta a superfície com fundo, borda, raio e padding da pílula definida em **287–297** e usada pelos outros dois indicadores. O Pressable de vidas (231–239/312–320) assegura 48×48 e um fundo apenas durante o toque, mas não fornece a superfície persistente exigida. A tipografia numérica já usa Sora/13/700, portanto o defeito comprovado é de composição/superfície, não ausência dessa fonte.

**Reprodução:** renderizar o HUD normal finito com hearts=5, sem pressionar o controle. Na captura iOS inicial fornecida pelo controlador, XP18 e sequência1d têm cápsulas escuras com borda; coração5 está solto sobre o fundo. Isso confirma a divergência do código. A mesma ausência decorre de styles.heartsCount nos estados finitos 0/1/3 e no modo compact.

**Correção esperada:** aplicar ao par coração+número finito a mesma superfície/borda/padding e tipografia da pílula XP/sequência, usando tokens existentes; manter a área de toque mínima48×48, rótulo agregado, callback, pulso e ∞semcoração conforme rulings. Provar em render real um teste vermelho específico que falhe pela ausência da superfície/borda/padding e depois o verde. Não antecipar T12 nem alterar APIs/economia.

## Evidência e limites

- Lidos apenas `task-3-brief-r3.md` e o HUD do snapshot imutável `task-3-snapshot-r1/files/`; não lida a árvore viva de produto.
- Captura inspecionada: `/var/folders/g7/bys6b7fx3qd3lnh6syvhfbfc0000gn/T/screenshot_optimized_177539b4-4a10-4013-ad76-b973ed516427.jpg` (trilha iOS, hearts5). Esta é evidência inicial da lacuna, não aceite nativo final da tarefa.
- As observações anteriores sobre vermelho temporal não discriminante e ausência de teste explícito de cleanup/mudança de modo continuam válidas. O controlador incluiu no fix1 prova específica por injeção e cobertura dessas fronteiras; a verificação virá no snapshot R2.
- Os resultados focais anteriores permanecem resultados do R1: 58/58 Jest,102/102 contratos,zero regressões visualQA. Eles não garantiam o requisito omitido e não foram repetidos neste adendo.
- T02 permanece aberta. Revisão R2 exige novo snapshot completo+delta e evidência nativa final de trilha/aula em iOS/Android, além da validação configurada do controlador.

---
# T02 HUD — revisão independente R2 (fix1)

**Spec/código: APROVADO, condicionado à prova nativa final. Qualidade/código: APROVADO.** O P2 da superfície finita registrado no adendo R1 está resolvido. Nenhum novo achado P1/P2 no delta focal do fix1. **T02 inteira permanece aberta:** capturas finais de trilha/aula iOS e Android e validação configurada pertencem ao controlador e ainda estão pendentes neste parecer.

## Escopo e integridade

Revisão restrita ao delta R1→R2, requisito literal de pílula e evidências temporais/reflexos diretos. Foram lidos requirements r3, `delta-r1.patch`, produto e testes em `task-3-snapshot-r2/files/`, e logs/report/audit copiados nesse snapshot. Os **16 arquivos** do manifest conferem por SHA-256 (`task-3-review-r2-integrity.json`). Não foi lido/editado o produto vivo, nem executado nativo/build/quality completo/Loop/commit/push.

## P2 R1 resolvido

Em HUD.tsx R2, **179** usa a mesma `styles.pill` dos indicadores XP/sequência; **190** usa a mesma `styles.pillValue`, preservando somente a cor própria das vidas. A definição compartilhada **287–297** contém superfície `galaxyColors.hudPill`, borda `hudPillBorder`/1, raio20 e padding por space. Desaparecem as definições locais heartsCount/heartsValue. Isso completa a interface literal sem criar réplica de estilo ou espelho de props.

A guarda nova em HUD.test.tsx **542–563** inspeciona o ancestral nativo comum do texto/coração e lê sua superfície/borda/raio/direção reais, além de conferir o alvo de48×48. O vermelho do fix1 (`red.txt:1106–1135`) falha especificamente pela ausência dos quatro campos de superfície/borda/raio no R1. Não é erro de compilação nem falha de um spy. O padding não tem uma asserção própria nesse teste; sua aderência está confirmada no código compartilhado `styles.pill`, sem lacuna atual de produto.

O delta de produção restringe-se a essa composição e à retirada das duas definições locais. O timer/hook de perda não mudou. Preservados por inspeção do delta: ∞sozinho por status, contagem/snapshot, rótulo agregado/tempo de recarga, callback, alvo48×48, HeartIcon, export HeartsDisplay e cinco corações do QuizTopBar. T12 continua responsável pela folha de cinco40pt.

## Provas temporais corrigidas

As duas observações de evidência do R1 foram atendidas:

| Defeito injetado | Falha específica auditada em red.txt do snapshot R2 |
| --- | --- |
| Callback deixa de restaurar lostCount | **1464–1558**: substitui callback por `undefined`, exit1; teste de restauração falha no preenchimento final esperado4294921035/recebido872415231. Nenhum spy aborta antes. |
| Timer anterior continua ativo em perda rápida | **1366–1462**: remove cleanup, exit1; após perda emt100, no prazot220 da primeira a segunda deveria continuar vazia até t320. A asserção própria recebe cheio4294921035 em vez de vazio872415231. |
| Cleanup removido nas saídas do estado | **1235–1364**: três casos independentes de ganho, mudança para∞ e unmount falham em timerCount esperado0/recebido1. Cada transição é executada separadamente; sem a primeira mascarar as demais. |

Os testes finais separam restauração de spies e verificam a saída real do SVG, com duração fake do JS; a guarda de cleanup observa o recurso pendente que o componente possui. O snapshot contém o callback e cleanup restaurados (HUD.tsx172–173). Essas provas fecham a lacuna do vermelho R1; não provam os frames intermediários ou a sensação nativa de Reanimated.

## Verde e limites de reprodução

Foi auditado o verde final copiado no snapshot, sem repetir a bateria já executada pelo implementador:

- **55 HUD + 3 Sheet =58/58**, duas suítes; resultado final em green.txt2573. Os warningsact da Sheet inalterada continuam documentados.
- **102/102 contratos** maestro/copy; green.txt3092.
- Visualstrict: **0regressões,50baselined,3exceções/462arquivos**; green.txt3108 e3121.
- Node20.20.2 e diff--check limpo são declarados pelo relatório/audit do implementador; o revisor não os remediu nesta R2. A reprodução independente R1 permanece um resultado separado da entrega anterior.

## Gate nativo final

**Pendente.** A captura iOS R1 que revelou a ausência de pílula não valida o fix1. O controlador enviará as capturas finais após reiniciar Metro; esta revisão será complementada somente após lê-las. Sem afirmar conclusão integral de T02 ou aceite de animação/dispositivo antes dessa prova e da validação configurada.


## Adendo nativo R2 — consumidor da aula (26/10)

**Gate nativo: NÃO PASS. T02 integrada: ChangesRequested, aguardando fix2 supervisionado e novo snapshot/rulings.** O parecer favorável acima continua restrito ao HUD R2 sob o brief então vigente; não constitui aceite do cabeçalho real da aula.

Foram inspecionadas as seis capturas fornecidas pelo controlador, sem leitura adicional do produto vivo. Hashes deste conjunto em `task-3-review-r2-native-integrity.json`:

- `ios-aula.png` e `android-aula.png`: a primeira etapa de Fundamentos de Radiologia mostra **cinco corações separados**, sem contagem, no cabeçalho. Confirma a lacuna do consumidor QuizTopBar informada pelo controlador. Sob o ruling corrigido, aula deve mostrar um coração+número; preservar a API HeartsDisplay capaz de cinco não obriga esse consumidor a renderizar cinco.
- `ios-trilha.png` e `android-trilha.png`: coração único+5 com superfície/borda de pílula, alinhado com XP/sequência. A lacuna de superfície do R1 está visualmente resolvida nessas telas.
- `ios-hearts.png` e `android-hearts.png`: folha de vidas está aberta sobre a trilha, sustentando a prova de abertura/callback no fluxo informado pelo controlador. A folha atual não tem cinco corações; sua produção permanece T12. A diferença de disponibilidade da assinatura entre ambientes não é objeto deste gate.

As imagens são estáticas: não demonstram duração/frames do pulso, leitor de tela ou todos os saldos. Não foi ampliada a auditoria nem proposto código fora do escopo. O controlador confirmou que QuizTopBar ainda não pertence ao writer atual; escrita de integração depende do fechamento/reabertura supervisionados. Próximo aceite deve usar o novo snapshot e capturas da aula já corrigida em ambos os sistemas.

---
# T02 HUD — revisão independente R3 (fix2)

**Código/spec R3: APROVADO condicionado à prova nativa nova. Qualidade do delta: APROVADO.** Não há novo achado P1/P2 no foco solicitado. O fix2 conecta o cabeçalho real da aula à pílula compartilhada, atendendo o ruling r4 que substituiu a preservação visual equivocada de Quiz5. **T02 ainda não está concluída.**

## Escopo e integridade

Lidos requirements r4 e arquivos imutáveis de `task-3-snapshot-r3`, o delta R2→R3 e diffs dos cinco novos paths contra a base imutável55e21ae. O diff desses paths contra a base evita interpretar sua ausência no manifest R2 como criação integral de arquivos que já existiam. Manifest inteiro verificado por SHA-256; prova em `task-3-review-r3-integrity.json`.

O conjunto de8paths de produto/testes é consistente com o report: HUD/test/política visual e QuizTopBar/test/três mocks. As alterações focais desses últimos paths não modificam serviços, conteúdo, economia, MaestroYAML ou a folha de vidas. Não foram editados produtos nem lida a árvore viva; não foi executado Loop/quality/build/nativo/commit/push pelo revisor.

O controlador informou que substituiu o run anterior, fechado sem validação/sucesso por escopo incompleto, pelo writer `run-1793011345601-6bbdc725` em editing com união33. Este parecer registra a recuperação informada, sem tratar o encerramento anterior como entrega validada.

## Conferência focal do fix2

- **Reuso real, sem HUD paralelo:** HUD.tsx153 exporta `HeartsCountPill`, o mesmo componente com `styles.pill`/`pillValue`, HeartIcon, estado de perda e cleanup aprovados no fix1. Somente adiciona defaults de maxHearts/rótulo e visibilidade acessível para permitir consumo direto. HUD continua passando seu rótulo completo com recarga. A API de HUD e o export HeartsDisplay capaz de cinco glifos permanecem compatíveis.
- **Integração da aula:** QuizTopBar.tsx5/55 troca import e uso de HeartsDisplay por HeartsCountPill, encaminhando `hearts` e `maxHearts`. O componente deixa de renderizar cinco corações neste consumidor; API pública, fluxo de dados e regras de unlimited não mudam.
- **Rótulo e máximo:** rótulo default do componente compartilhado deriva de hearts/maxHearts; custommax7 é exercitado como `2 de 7 vidas`. A API de QuizTopBar recebe esses valores, não recebe snapshot; o estado real continua vindo dos chamadores existentes. Não foi criada origem de contagem paralela.
- **Fechar/progresso/∞ preservados:** o botão42–44, a razão/altura da barra45–46 e o branch unlimited50–53 são idênticos à base. Não apareceu segundo anúncio de progresso. ∞continua sozinho e com rótulo Vidas ilimitadas; finite0/1/3/5 têm um coração+número. T12 ainda produzirá os cinco40pt na folha.
- **Três mocks:** nos testes QuizScreen.flow, LessonFlowScreen.flow e JourneyNodeCompletionGuard, o delta é a troca nominal HeartsDisplay→HeartsCountPill (mais atualização de comentário). Não houve enfraquecimento de asserts ou duplicação da implementação. Esses mocks não provam o desenho; quem o prova é QuizTopBar.test.tsx com o componente compartilhado real.

## Testes e evidência auditados

QuizTopBar.test.tsx82–108 cobre os quatro saldos, cardinalidade real do render, número único, rótulo, superfície compartilhada, máximo customizado e unlimited com counts0/5 sem coração/número. A suíte não mocka HUD/HeartsCountPill; o fake de Reanimated mantém o limite de prova temporal já documentado em R2.

O vermelho Fix2 preservado em red.txt é discriminante:5falhas/6sucessos; quatro casos recebem5glifos em vez de1 e o custommax7 falha na superfície/borda da pílula. ∞já passava e foi preservado. O fix2 não altera o timer nem invalida as injeções específicas restore/rapidloss/cleanup do fix1.

Verde final do implementador auditado, sem repetir a bateria nesta revisão:

- **7suítes/173testes**, green.txt3413–3414: HUD, QuizTopBar, HeartsSheet, QuizScreen.flow, LessonFlowScreen.flow, JourneyNodeCompletionGuard e MissionsScreen.flow inalterada.
- **102contratos passaram**, green.txt3933.
- Visualstrict **0regressões,50baselined,3exceções/462arquivos**, green.txt3975.
- Node20.20.2 e diff--check limpo são declarados no report do implementador; não foram remensurados pelo revisor nesta R3.

**Limite explícito da suíte:** os logs preservam warningsact em Sheet/AppButton/useReducedMotionPreference e LessonFlowAttempt, além de TypeError capturado de `SpacedRepetitionService.getCardState` ausente num mock do resumo de LessonFlowScreen (green.txt3393). As suítes passam, mas a saída não é limpa. Esta revisão não verificou uma baseline anterior desse erro e não o classifica como comprovadamente preexistente; o caminho de resumo afetado não é prova integral de integração por essa execução. O delta de produção aqui revisado apenas encaminha a pílula, e seu consumidor visual tem teste real separado.

## Gate nativo

**Ainda NÃO PASS / pendente de recaptura do fix2.** Os PNGs dentro do snapshot R3 são o conjunto antigo que mostra cinco corações na aula; mantêm seu papel de reprovação histórica. Não validam a integração nova.

O controlador enviará snapshot R4 com quatro PNGs novos e hashes atuais. Só após leitura desse conjunto poderá ser revisto o gate focal de trilha/aula em iOS/Android. A validação configurada permanece com o controlador; este parecer não declara sucesso do writer nem conclusão de T02.

---
# T02 HUD — revisão independente R4, visual final

**Spec T02: APROVADA no recorte acordado. Qualidade: APROVADA, com os limites de prova abaixo.** Sem achado P1/P2 aberto neste recorte. A superfície da pílula e a integração no consumidor real da aula estão resolvidas. **Pode prosseguir à validação configurada dos 15 validadores.** Se todos passarem e o escopo permanecer íntegro, o controlador pode concluir o step e fechar o writer conforme a sequência pública do Loop. Este parecer não afirma que os 15 já passaram nem que o run está fechado.

## Evidência final conferida

Snapshot `task-3-snapshot-r4`,29 arquivos de manifest válidos por SHA-256. Código/testes/políticas de R4 são byte a byte idênticos a R3; não foi reaberta revisão geral. `native-state.json`, os seis PNGs e `checksums.sha256` conferem entre si; dimensões PNG 1206×2622 (iOS) e 1080×2340 (Android) conferidas no arquivo. Hashes de HUD/QuizTopBar declarados em native-state correspondem à fonte do snapshot. Prova em `task-3-review-r4-integrity.json`.

| Plataforma/contexto | Inspeção visual focal |
| --- | --- |
| iOS/trilha | Um coração preenchido+5, pílula com superfície/borda coerente com XP/sequência; número único e legível, sem recarga visível. |
| iOS/aula | Cabeçalho real de Fundamentos de Radiologia mostra **um coração+5 em pílula** ao lado da barra. Os cinco corações antigos não aparecem. Fechar e progresso permanecem visíveis. |
| Android/trilha | Um coração+5 em pílula, sem duplicação da contagem ou recarga visível. |
| Android/aula | Cabeçalho real mostra **um coração+5 em pílula**, sem a fila antiga de cinco; barra e fechar permanecem visíveis. |
| iOS e Android/folha | Folha existente aparece aberta sobre o HUD final. O controlador registrou a abertura tocando a pílula em ambos os sistemas; o revisor conferiu os estados capturados e a coerência com esse relato. |

Aula nova iOS temSHA `e476e421d57ff6a30a69e58068b73027ba605b33111c5f9e5408a392d88aadd5`; aula nova Android`c7508b5512d996c16ce80c689f6ba78003baf1b87ceb62cb2bd9385a5acac660`. São os novos arquivos do R4, distintos das capturas de cinco corações do R3. A reprovação visual anterior é histórica e está resolvida pelo conjunto atual.

## Spec e qualidade acumuladas

Mantém-se a aprovação focal do código R3: HeartsCountPill real compartilhada entre HUD e QuizTopBar, API HeartsDisplay compatível, custommax, labels, abrir folha, fechar/progresso e∞por estado. Não surgiram fontes novas de contagem nem alteração de economia/serviços. Casos 0/1/3/5, max7, ∞ e snapshot são cobertos nos testes apropriados; a prova temporal específica restore/rapidloss/cleanup do fix1 continua válida porque esse código não mudou.

Resultados finais auditados do implementador continuam **173 testes/7 suítes, 102 contratos e visual strict com 0 regressões**. O revisor não reexecutou essa bateria no R4. Permanecem warnings act e o TypeError capturado de mock getCardState documentados no R3; não há alegação de saída limpa ou de baseline anterior comprovada para esse erro. Não constituem achado novo sobre o delta da pílula, mas limitam a prova daquele caminho de resumo.

## Limites explícitos

- Prova nativa visual deste recorte: **finito 5 na trilha e aula dos dois sistemas**, mais folha aberta a partir do HUD. Não foi medida em nativo a aparência de 0/1/3, máximo 7 ou∞; esses contratos têm prova Jest.
- O pulso de perda e seus frames/sensação **não foram medidos em nativo**. A duração/reset/rapidloss/cleanup têm prova focal de JS/render e injeções auditadas; não se apresentam como medição de Reanimated no dispositivo.
- iOS usou `-radiantReduceMotion 1`. No Android, tentativas de dump uiautomator não atingiram idle; portanto não há aceite TalkBack nem alegação de dump Android bem-sucedido. Labels iOS relatados no native-state não equivalem a teste de VoiceOver.
- Binários existentes/simulador iOS E262D4C1… e Androidemulator-5554/AVDradiant-entrada-api34. O controlador declara nenhuma build/instalação, limpeza de dados, alteração de relógio ou toque no simulador reservado. O revisor não operou esses ambientes.
- Folha com cinco corações 40pt permanece **T12**. G1–G8, legado, demais telas e conferência de segundo dia não são aprovados por este parecer.

## Encaminhamento ao controlador

O gate focal de revisão e visual T02 está satisfeito com os limites declarados. **Executar os15validadores configurados sobre o conjunto final; somente com sucesso conferir scope/diff e concluir `step finish`, memória opcional se cabível, `run close` e fechamento independente da sessão do cérebro.** Qualquer falha real mantém o respectivo gate aberto. Não marcar T02 integralmente concluída antes dessa evidência final. Nenhuma autorização de merge/push/build/EAS/OTA/loja foi inferida.
