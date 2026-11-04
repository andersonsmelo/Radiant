# T06 — pareceres independentes e limites

R5 aprovou o código FIX3; R6 aprovou a evidência no escopo medido: iOS live e Android normal/máxima inicial. Android live não validado; P3 real da cauda permanece para T17.


---

## Parecer R1 — SHA256 8db866bbaf952f1f4e13c90de148f6b6b282a75f2f1eb38f148f0e6bc928bba2

# Task8 / T06 — revisão R1

**Spec: FAIL — lacuna obrigatória de evidência causal, sem defeito funcional identificado no produto congelado.**

**Quality: CHANGES_REQUESTED — um achado P2, restrito à contraprova de não ativação com unidade ausente.**

## Escopo e integridade

- Revisão independente Spec e Quality do brief vinculante `docs/evidence/2026-10-27-medalhao-t06/task-brief.md`, SHA256 `0f779c73e495bc7b5b1895c0e06a0514287cbee0979248ab92b3df2faea481d4`.
- BASE_TASK/HEAD précommit informados pelo pacote: `d033433f268422020551ef3e4e20d2e121ec8ceb`. Não executei novos comandos Git.
- Diff de produto lido uma vez: `task-8-snapshot-r1/product-diff.md`, SHA256 medido `f3096381892e9155a08fa31843f9b27eb981483eaec4fe0d0bc15d0b59527c99`. Cinco arquivos alterados; consumidor `JourneyNodeCompletionGuard.test.tsx` nominal e intacto, corretamente sem alteração desnecessária.
- Conferi os seis hashes de produto diretamente no disco contra manifest/report: todos coincidem. RewardScreen SHA256 `727cc17bf1099af3218ce70ff1c3f8fd2f5a29a8a8a0c3dc2a9809444aa026e7`; teste `5f34ce4e62c27f433eb0d4fb6ab09e1b170a8a0d2d25e91a2363e3d1d1cfa5c9`; locked `5adc42a3333fa67930fd61ce5e4c31d78c02797ffe658516a3d81e4eebd84d53`; unlock `b4b9f90df9f8845b610b6c331df37ee755715ea21ce1fdade29770ee3096d0f7`; contrato `f93b517123dd7993ae97648fffab1685c5f37cc79038a2f5a5a83b62f72f5759`; consumidor intacto `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28`.
- Li report/audit/mutations, os resultados brutos pertinentes de RED/GREEN e os blocos de falha das 12 mutações. Os 12 arquivos de log existem e seus SHA256 coincidem com `mutations.json`.

## Spec — o que o produto atende

- Ausência conhecida valida nó/unidade antes de `setCurrentNode`, chama dismiss para a trilha e resolve render null: `radiant-app/src/features/rewards/screens/RewardScreen.tsx:146`, `:148`, `:151`, `:289`. Loading/erro têm tratamento distinto; casos observáveis em `RewardScreen.flow.test.tsx:239`, `:248`, `:258`, `:265`, `:273`, `:307`.
- Bloqueado e concluído continuam estados válidos com saída; concluído não reativa nem recolhe: `RewardScreen.tsx:209`, `:215`, `:459`, `:464`; `RewardScreen.flow.test.tsx:285`, `:349`, `:394`.
- `canCollectReward` mantém a tabela anterior; serviço mantém a autoridade. A UI só solicita avaliação após status completed confirmado, e refs protegem callback capturado durante a operação e após confirmação: `RewardScreen.tsx:79`, `:245`, `:256`, `:259`; testes `RewardScreen.flow.test.tsx:349`, `:361`, `:546`.
- Sem ID, o reward escolhido permanece fixo depois de completed mesmo com outro reward disponível: `RewardScreen.tsx:122`, `:155`, `:177`; caso `RewardScreen.flow.test.tsx:317`. Saída e reabertura por ID não recolhem.
- Origem usa snapshot do nó e `baseSnapshot.track`; celebração usa JourneyMedal/tema existentes, sem stars fictícias; Continuar conserva o destino computado e hint da ação: `RewardScreen.tsx:142`, `:159`, `:339`, `:341`, `:464`. Destinos lesson/review/checkpoint/reward/trilha cobertos em `RewardScreen.flow.test.tsx:376` e `:389`.
- Shadow/content version permanecem no diff e código de contexto, sem restore ativo: `RewardScreen.tsx:218`.
- Contrato novo inspeciona JSX vivo por AST e liga rótulo/onPress/flows; unlock preserva o percurso das sete aulas e acrescenta retorno final, locked acrescenta rota realmente inválida: `radiant-app/scripts/maestro-contract.test.mjs:1306`, `radiant-app/.maestro/reward-unlock.yaml:604`, `radiant-app/.maestro/reward-locked.yaml:107`.
- Sem mudança de economia/elegibilidade/serviços/API/SDK/política no produto apresentado.

## Quality — pontos sólidos

- As mutações redirect-concede, ausência de dismiss, callback inflight, callback pósconfirmação e recusa que solicita avaliação morrem nas respectivas asserções do comportamento: logs `task8-mutation-invalid-auto-grants.txt` (teste :243), `task8-mutation-invalid-no-dismiss.txt` (:241), `task8-mutation-duplicate-inflight.txt` (:368), `task8-mutation-duplicate-after-confirmed.txt` (:372) e `task8-mutation-refusal-prompts-review.txt` (:355). As duas barreiras de repetição foram removidas separadamente.
- Fallback confirmado e as quatro mutações do contrato também têm falhas reais observáveis. Não contei correção do wrapper SafeAreaProvider como vermelho do produto; `audit.md:9` distingue corretamente o harness, e o RED adicional registra ausência de auto-dismiss/medalha/Continuar.
- GREEN restaurado em Node20.20.2: 4 suítes/85 testes sob taskpolicy-b, mais 4/76 regressões; contrato39/39, tsc e lint finais exit0: `docs/evidence/2026-10-27-medalhao-t06/green.txt:392`, `:529`, `:537`, `:583`, `:591`, `:794`, `:803`, `:810`. `visual:qa:strict` registra463 arquivos/0 regressões em `green.txt:374`. Sem atribuir esses focais ao quality completo.

## Achado

### [P2 / Important] A contraprova de unidade ausente não isola a barreira de não ativação

**Locais:** `radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx:253` e `:255`; `docs/evidence/2026-10-27-medalhao-t06/mutations.json:45`; `docs/evidence/2026-10-27-medalhao-t06/audit.md:89` e `:95`; log `.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task8-mutation-invalid-unit-activated.txt:35`.

A injeção `invalid-unit-activated` falha primeiro em :253 porque dismiss não ocorreu. A asserção nominal de não chamar `setCurrentNode`, em :255, não é alcançada. O log comprova a regressão de retorno à trilha, mas não demonstra isoladamente que uma ativação indevida seria detectada se dismiss/null continuassem corretos. O audit chama todas as contraprovas de específicas/causais sem registrar essa limitação. Isso viola a exigência vinculante de caso negativo de cada barreira sem mascaramento (`task-brief.md:157`) e a regra de evidenciar a falha específica da nova asserção. A implementação atual valida a unidade antes de ativar; não estou alegando um bug funcional nesse código.

**Correção mínima:** acrescentar/substituir por injeção que execute indevidamente `setCurrentNode` para o reward com unidade ausente, preservando dismiss e render null. Demonstrar falha na asserção :255, restaurar o mesmo SHA e atualizar log/índice/audit/mutations/report. Mudar teste/produto só se essa demonstração revelar necessidade real; não ampliar escopo por inferência. A contraprova atual pode permanecer identificada como cobertura do retorno, sem afirmar que prova a barreira de ativação.

## Checagens focadas fora do diff

- **Risco nomeado: helper cortado pelo hunk permitir fallback errado ou destino indisponível.** Li somente `RewardScreen.tsx:38-114`: lookup explícito valida type reward, fallback somente available/active e destinos usam `canOpenJourneyNode`/href; canCollect preservado. Também li o trecho shadow/haptic `:195-237`, cortado entre hunks, para verificar continuidade do contrato exigido.
- **Risco nomeado: novo JourneyMedal pintar reward incorretamente ou inventar estrelas/tema.** Conferi `JourneyMedal.tsx:78-82`, `:153-177`, `:267` e `resolveNodeTheme.ts:18-24`: ouro reward/locked cinza, stars só quando fornecidas e tema vem do nó/unidade/fallback canônico.
- **Risco nomeado: Promise de serviço significar coleta mesmo quando recusa, ou alterar área de origem/idempotência.** Conferi apenas `JourneyProgressService.ts:148-224`: resolve a trilha do nó, pode retornar snapshot sem escrever em recusa, e repetição mantém timestamps/sync. A tela consulta status retornado sem mudar serviço.
- **Risco nomeado: warning do consumidor ser regressão T06.** Conferi `docs/evidence/2026-10-27-medalhao-t05/green.txt:2186-2193`: mesmo SHA do consumidor e mesmo getCardState ausente já registrados. O erro `storage unavailable` é explicitamente a rejeição esperada do teste existente no GREEN atual :545. Não pedi reparo desses avisos preexistentes nem os suprimi.

## Limites e gates do controlador

- Spec FAIL e Quality CHANGES_REQUESTED acima referem-se somente à lacuna causal identificada. Os comportamentos verificáveis no produto correspondem ao brief; nenhum outro achado Critical/Important foi identificado.
- Nativo/gesto/volta física, execução Maestro em dispositivo, rasterização/legibilidade em texto ampliado e demais cenários não alcançados permanecem pendentes do executor/controlador. Não operei dispositivo nem usei o reservado5FD8C926.
- Quality completo/Loop final, lifecycle do writer, atualização final do STATUS/roadmap/evidência principal, commit/push e CI do SHA efetivamente publicado pertencem ao controlador e ainda não são atestados por esta revisão. Checkpoints documentais do pacote continuam dizendo “produção na base/verde pendente”; devem ser reconciliados ao encerrar, sem tomá-los como estado técnico mais recente que o freeze.
- Não rodei testes, build, instalação, comandos Git ou Loop/brain; não abri agentes. Única escrita desta revisão: este parecer. Não houve escalonamento além de Tier1.


---

## Parecer R2 — SHA256 fdbf2448328ced9ddccda13793c3532a8fb4282e6a4ccfd7ff144673e605e03e

# Task8 / T06 — revisão R2

**Spec: PASS funcional — o P2 de evidência da R1 foi resolvido; mantidos os checks de produto da R1, sem reauditoria do código.**

**Quality: CHANGES_REQUESTED — novo P2 visual medido na troca de fonte ao vivo; P3 de sobreposição da cauda registrado separadamente.**

## Escopo e integridade

- R2 restrita ao delta de evidência FIX1 e à triagem das novas imagens iOS. BASE_TASK/HEAD précommit do pacote: `d033433f268422020551ef3e4e20d2e121ec8ceb`. Brief vinculante inalterado, SHA256 `0f779c73e495bc7b5b1895c0e06a0514287cbee0979248ab92b3df2faea481d4`.
- Conferi os seis hashes no disco contra `task-8-snapshot-r2/manifest.json`: iguais ao freeze R1. RewardScreen permanece `727cc17bf1099af3218ce70ff1c3f8fd2f5a29a8a8a0c3dc2a9809444aa026e7`. O product-diff R2 tem SHA256 `9d863678eff679f29ef1022e5644c407e46c59327e92648412504dc4a60ea8b8`; não relê/reconstituí o diff de produto nem repeti suites.
- Abri as cinco imagens reais por view_image, além dos companions UI, relatório nativo e proveniência temporal. Não operei dispositivo. Native report atual `task8-native-report.json:2` declara `PAUSED_AFTER_IOS`; Android não iniciado, app/Metro/simulador desligados pelo executor.

## P2 R1 resolvido — prova isolada da não ativação

- `task8-fix1-mutation-invalid-unit-activation-preserves-dismiss.txt`: SHA256 medido `45344207c2b62664941b5fb3d747cc8137a7ec6e159fae13b6831b503da169ba`, igual ao índice. A injeção acrescenta `setCurrentNode` no ramo de unidade ausente e conserva dismiss/null. O log mostra que o teste alcança :255 e falha por 1 chamada indevida quando esperava 0; as asserções :253 e :254 passam antes.
- `docs/evidence/2026-10-27-medalhao-t06/mutations.json:227` registra a injeção exata, comportamento preservado, log e restauração. A mutação anterior está corretamente limitada a cobertura do retorno em `mutations.json:65`; o audit corrige a alegação histórica em `audit.md:132`.
- GREEN restaurado mínimo real em `green.txt:817`: Node20.20.2, 1 passou/30 skipped/31 total,6.862s,exit0. Freeze6 final igual. O P2 não exige nova mudança em produto ou teste; considero encerrado.

## Novo achado [P2 / Important] — texto da recompensa é cortado na troca de Dynamic Type com a tela aberta

**Local de integração afetado:** `radiant-app/src/features/rewards/screens/RewardScreen.tsx:347` (PixelHeroSplit) e texto fornecido em :349; hosts correspondentes em `radiant-app/src/components/ui/PixelHeroSplit.tsx:105` e `radiant-app/src/components/ui/SpeechBubble.tsx:161`. Estes são pontos de localização do comportamento, não atribuição demonstrada de causa.

**Evidência visual:** `.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task8-native-ios-locked-max-live.png`. Ao mudar a fonte da tela já aberta para accessibility-extra-extra-extra-large, a imagem mostra o eyebrow encerrado em “JORNADA DE RA” e a fala reduzida a uma linha cortada “Você cheg”, com o restante ausente dentro de um balão que termina na própria captura. Não é apenas texto abaixo do viewport. O companion UI contém a mensagem inteira, o que não contradiz a perda visual: a árvore semântica não prova rasterização correta.

**Proveniência e limite temporal:** `task8-native-ios-font-provenance.json` registra content_size concluído06:16:51.822 e screenshot live concluído06:16:54.147, intervalo2.324819s. Isso comprova o frame ilegível nessa captura, não sua duração/persistência. Não houve uma segunda captura tardia da mesma montagem antes de scroll/restart. `task8-native-report.json:16` agora preserva esse limite corretamente.

**Por que as outras capturas não encerram o achado:** houve terminate06:17:12.315, relaunch06:17:13.160 e deep link06:17:26.408. `locked-max.png`06:17:29.080 e `locked-max-settled.png`06:17:33.985 são ambas de nova montagem, screenHash08tg7qd. Nelas o eyebrow reflui e a fala começa “Você”/“chegou” em linhas distintas, continuando abaixo do viewport. `locked-max-exit.png` comprova CTA legível alcançado por scroll na abertura inicial máxima; não prova que a troca ao vivo recuperou. Não atribuo recuperação espontânea nem persistência indefinida.

**Impacto/julgamento:** o caminho ao vivo medido perde conteúdo legível da tela entregue. É um defeito de qualidade T06 observado em nativo, não apenas uma limitação do Jest; a verificação geral T17 pode ampliar cobertura, mas não substitui a resolução deste caso conhecido. Não há prova para chamá-lo regressão causada pela nova medalha, nem prova visual anterior para dispensá-lo como preexistente só porque PixelHeroSplit/SpeechBubble não mudaram.

**Objetivo mínimo de correção:** fazer a integração local de RewardScreen refletir mudança de fonte sem perder o layout da fala/eyebrow e sem resetar snapshot, coleta em andamento, estado confirmado, shadow, controles ou economia. Investigar/validar no ownership atual antes de decidir mecanismo; não alterar fonte compartilhada, currículo ou política por inferência. Se um conserto compartilhado se mostrar indispensável, solicitar ao controlador o escopo explícito correspondente. O padrão T05 de renovar Text por fontScale é uma referência de diagnóstico, não prova automática de causa ou receita obrigatória para este host.

**Evidência mínima de aceite:** teste focal causal do mecanismo escolhido e retorno ao source final; nova prova nativa na mesma montagem normal→máxima→normal, com capturas pareadas após intervalos registrados antes de qualquer relaunch, incluindo mensagem inteira por scroll, eyebrow e saída. Separar isso de abertura inicial máxima; não declarar resolução com base apenas no reinício. Repetir o caso afetado, sem ampliar a suíte por hábito.

## Novo achado [P3 / Minor] — cauda do balão encobre o início de “antes” na fonte normal

**Local afetado:** integração `RewardScreen.tsx:347`; geometria compartilhada localizada em `SpeechBubble.tsx:160-165`, `:204-218`. **Prova:** `task8-native-ios-locked-normal.png`, fonte normal, bloqueado1/8. A cauda e sua superfície sobrepõem o início da palavra “antes” na frase “antes de seguir”; a fala continua dedutível, mas a decoração encobre glifo real.

**Correção mínima:** reservar espaço suficiente/separar a cauda da região ocupada pelo texto nessa integração, usando o contrato existente se viável, e conferir a mesma mensagem em fonte normal e máxima. Não redesenhar o Pixel/balão nem mexer no compartilhado sem necessidade/scope. A causa exata e a preexistência visual não foram demonstradas. Isoladamente é P3; não é o motivo do bloqueio P2 acima.

## Checagens focadas adicionais e limites

- **Risco nomeado: layout live usar medição antiga ou não reservar texto/cauda.** Li somente PixelHeroSplit e SpeechBubble: o primeiro observa dimensões/largeText e recebe bubbleStyle; o segundo mede naturalHeight e usa wrapperClipped. Esses fatos ajudam a localizar a investigação, mas não demonstram a causa sem reprodução/contraprova.
- **Risco nomeado: copiar solução T05 reiniciar estado/controles.** Conferi `LessonSummary.tsx:120` e :160-169: fontScale renova Text locais; comentário preserva scroll/controles/efeitos. Não prescrevo remount indiscriminado de RewardScreen ou de fluxos de coleta.
- Fonte máxima inicial e saída por scroll têm evidência visual positiva; disponível/coletado nativos não foram alcançados. Maestro em dispositivo, VoiceOver falado, Android, gesto global, FPS, aparelho físico, produção e segundo dia continuam sem prova nesta rodada. Swipe da borda permaneceu na recompensa nessa apresentação por deep link, sem conclusão global de navegação (`task8-native-report.json:14`).
- Gates Loop/quality completo, lifecycle, documentação operacional final, commit/push/CI do SHA publicado continuam do controlador. Spec PASS funcional não equivale a aprovação de qualidade ou conclusão integral T06.
- Nenhum teste, source write, comando Git/Loop/brain, instalação/build ou operação nativa executado por mim. Única escrita R2: este parecer. P2 R1 encerrado; P2 visual exige correção/validação focal antes de Quality APPROVED.

## Identidade das imagens examinadas

- locked-normal: `23c3631fae134c1deb395ee69f0467eccdae8bc505e56c7fa79b806f64f6dd7f`.
- locked-max-live: `1aa9fd1ee692340aabe63711fea65913fb4273a86d089b52e1adf0b0a3ea1dda`.
- locked-max-settled: `519430bc2498a568b6dcb94937f3409453afac73d343a380bd8c2ef065415c82`.
- locked-max: `c52bf67cb0a52231704cde9361a5ea6fe4cb30cf91afb86a5ef1661905e405a2`.
- locked-max-exit: `b11189985069d60970544b83e0c88d162353236bae2ddfb18088436a5003107f`.


---

## Parecer R3 — SHA256 b6101b15cc03d00e8b9bdbcc91d9032c128ad814cab0f9b3673a437bccf2edd4

# Task8 / T06 — revisão R3, delta FIX2

**Spec: PASS — delta local implementa renovação por fontScale exato sem alterar regras de recompensa.**

**Code Quality: APPROVED — nenhum novo achado bloqueante no delta FIX2.**

**Aceite visual T06: PENDENTE — o P2 nativo da R2 não está encerrado por esta revisão; depende de R4 com a nova medição do source congelado.**

## Escopo e integridade

- Revisei uma vez somente `task-8-snapshot-r3/fix2-diff.md`: dois paths, RewardScreen e seu teste, R2→R3. Não repeti auditoria dos demais fluxos/produto nem suites.
- Manifest SHA256 medido `cf548a9135a3d9c4d0bdc3f6ffd58b58684e01eb2b11b20e6b4e3f3703ff44ba`; delta SHA256 `88ca1c3b0e9a5869e9ba66108eda54e3d90c9a9ef6a2225a24a4e6df3f7e4d85`; implementation-report SHA256 `75657172608470dd3ac77cc9820a76365e8db225a6f736b2f121a05306579a41`. Coincidem com o dispatch.
- Freeze6 conferido diretamente contra manifest: source `55f8d535692d9acebff733def9c32e225488b63a8d40629b1f95cc5cebc95344`, teste `19956acd8ee00996dc450025aece0be321faff58df3b43b958c6e3cc9101b4da`; os quatro outros paths mantêm os hashes R1/R2. Nenhum serviço, shared component, flow, contrato ou política mudou neste delta.

## Spec e qualidade do mecanismo

- `radiant-app/src/features/rewards/screens/RewardScreen.tsx:120` passa a ler fontScale e o host PixelHeroSplit recebe key derivada da escala exata em :351. A mudança fica na subárvore do hero. RewardScreen/estado/refs, shadow, ScrollView, JourneyMedal e AppButtons permanecem fora dela.
- A chave usa o valor exato, portanto cobre mudança dentro da categoria de fonte grande, além de normal↔grande. Não existe teto novo de escala, substituição da copy ou reinício do estado de recompensa.
- Props de state/tier/message do Pixel permanecem as anteriores. O hero é remontado, incluindo suas medidas locais e ilustração; não se promete preservar a instância animada desse subtree. Seus estados/momentos por props permanecem, sem remontar medalha, scroll ou controles. Nenhum efeito de prêmio/serviço foi transferido para o hero.
- `RewardScreen.flow.test.tsx:272` observa host/eyebrow/fala novos em1→3.1,3.1→2.5 e3.1→1; os asserts seguintes observam scroll/medalha/close/exit preservados e nenhuma chamada nova de leitura/ativação/coleta/RatingPrompt. Rerender com a mesma escala conserva o host.
- O caso inflight (`RewardScreen.flow.test.tsx:308`) renova o hero durante uma Promise pendente, mantém o mesmo botão desabilitado e refs da coleta, confirma o snapshot e troca de volta sem nova coleta/avaliação. Continuar permanece e funciona. Esses checks verificam o risco concreto de remount excessivo, em vez de apenas espelhar props da implementação.
- O mock do hero mede identidade dos hosts fornecidos pelo caller. Não simula naturalHeight, animação ou rasterização. O report/audit delimitam isso corretamente; a hipótese de medição antiga segue hipótese até a prova nativa do conserto.

## Evidência causal conferida

- RED anterior ao produto: `docs/evidence/2026-10-27-medalhao-t06/red.txt:10990`, Node20.20.2,4 falhas/31 skipped/35total. Falhas por identidade antiga do hero/fala/eyebrow.
- GREEN recompensa completo: `green.txt:869`,35/35,9.079s,exit0. Após restaurar as duas injeções: `green.txt:921`,4pass/31skipped/35total,7.437s,exit0.
- Li as falhas brutas de `task8-mutation-fix2-font-host-not-renewed.txt`: remover a key derruba os quatro casos, em :272 ou :308. SHA256 confere com mutations.json (`cb2780b9748da886389c2db05b0f74381707f6ca0a53948a7191369767deeb7c`).
- Li a falha bruta de `task8-mutation-fix2-font-host-coarse-threshold.txt`: uma key normal/grande deixa exatamente3.1→2.5 com host antigo;1falha/3pass/31skipped. SHA256 confere (`7148476a473767f7c78066800138ab66fe2fb3ba8cf1b40f136b2ebe25a24cbb`). As duas mutações registram restauração no SHA atual do source.
- Contrato completo39/39,tsc/lint e visual strict exit0 estão no apêndice `green.txt:973-1215`. UIstrict:463 arquivos,0regressões,49baseline+3exceções. Não atribuo esses resultados ao quality completo nem a execução Maestro/dispositivo.

## P2 visual anterior — aberto para a prova R4

O delta apresenta um mecanismo local coerente com o risco e boas guardas de preservação de estado; isso não demonstra que o frame cortado na troca de fonte foi corrigido. O P2 da R2 permanece até examinar nova evidência do source55f8d535 na mesma montagem, normal→máxima→normal, com intervalos e pares de capturas antes de qualquer relaunch, incluindo mensagem inteira por scroll, eyebrow e saída. A abertura inicial máxima deve ser reportada separadamente. O executor já autorizado faz essa medição; esta revisão não operou dispositivo nem leu resultados ainda não entregues.

## P3 cauda — resíduo real, severidade mantida

- Mantido **P3/Minor**, sem rebaixamento nem afirmação de preexistência: a imagem normal da R2 mostra a cauda encobrindo o início de “antes”. O custo permanece um glifo real parcialmente oculto na fala; a tela normal não está visualmente limpa.
- O diagnóstico de ownership é consistente com o código já inspecionado em R2: texto e cauda são irmãos dentro de SpeechBubble.content; bubbleStyle é aplicado ao wrapper ancestral. Não há evidência de que padding nesse ancestral separaria esses irmãos, portanto foi correto não apresentar um ajuste placebo/copy como solução.
- A decisão do controlador de manter esse P3 compartilhado para T17/revisão ampla é compatível com sua severidade e com o ownership atual. É aceitação explícita de resíduo conhecido, não encerramento técnico. Não considero o P3 isoladamente bloqueante para o delta FIX2. Não autoriza alteração de shared components/política nem substitui a correção futura e sua prova visual.

## Limites

P2 de evidência R1 continua encerrado conforme R2. Não há novo finding Critical/Important de código em FIX2. Qualidade de código aprovada neste escopo; aprovação visual final continua dependente da R4 e os gates finais/Loop/quality completo/commit/CI permanecem com o controlador. Nenhum comando Git/Loop/brain, teste, source/docs write, operação nativa, build, instalação ou agente foi executado por esta revisão. Única escrita: este parecer R3.


---

## Parecer R4 — SHA256 da7f41ae73138e0accac447c97fca73839c870cb1a560627b32caaabc8491823

# Task8 / T06 — revisão R4, prova visual FIX2

**Spec funcional: PASS, mantido da R3; sem reauditoria de código.**

**Quality: CHANGES_REQUESTED — FIX2 atende o hero, mas o P2 de clipping ao vivo continua nos textos fora dele.**

## Evidência e identidade

- Source medido `55f8d535692d9acebff733def9c32e225488b63a8d40629b1f95cc5cebc95344`, igual ao freeze FIX2 aprovado em código na R3.
- Abri com view_image as imagens reais `task8-native-r2-ios-locked-max-live-3s.png`, `-10s.png`, `task8-native-r2-ios-live-scroll-0.png`, `-1.png` e `-2.png`, todas no SDD desta tarefa. Não operei dispositivo nem repeti testes.
- `task8-native-r2-runtime.jsonl:23-27` registra troca para fonte máxima em1793180359.132241 e screenshots em1793180363.6242402 e1793180370.546031: **4.492s e11.414s** após conclusão da mudança. Os nomes3s/10s são rótulos aproximados. Entre a mudança e as duas capturas existem apenas snapshots/capturas, sem scroll/restart. Os timestamps são de conclusão dos comandos; não são medida do início da renderização.

## Hero: tratado no cenário medido

Nas capturas3s/10s o eyebrow “JORNADA DE RADIOLOGIA” reflui em duas linhas completas e a fala começa em linhas completas “Você”/“chegou”, continuando abaixo do viewport. A imagem `live-scroll-1.png` mostra o final legível “conquista antes de seguir.” dentro do balão. Isso é progresso visual real frente ao hero cortado da R2. Não conto a parte abaixo do viewport como clipping e não exijo nova alteração do hero por inferência.

A evidência desta rodada resolve a observação de clipping do **hero no percurso iOS bloqueado medido**; não representa aprovação de todos os textos/estados da tela ou Android.

## [P2 / Important] Fora do hero, textos continuam cortados na mesma montagem

**Locais afetados:** `radiant-app/src/features/rewards/screens/RewardScreen.tsx:335` (header), :370/:371 (título/descrição), :376/:387/:392 (linhas de status/progresso/revisão), :448/:455 (título/corpo da ação).

**Prova:** em `locked-max-live-3s.png` e `locked-max-live-10s.png`, “Conquista” no cabeçalho aparece apenas como uma faixa superior de glifos, ilegível. O problema é observado em ambas as capturas separadas por6.922s e ainda está presente no frame11.414s após mudança. Não afirmo persistência além do intervalo observado.

Depois, `live-scroll-2.png` mostra título/descrição/linhas do cartão intermediário reduzidos a faixas isoladas e o título/corpo da ação severamente cortados horizontal/verticalmente. Eles ocupam regiões próprias visíveis da tela; isso não é mera continuação abaixo do viewport. O botão “Voltar para jornada” permanece legível. Uma saída disponível não torna o conteúdo do estado bloqueado legível.

**Julgamento:** P2 da tela **NOT ADDRESSED fora do hero**. A R3 aprovou o mecanismo do delta e preservou o gate visual; esta prova não autoriza chamar o clipping T06 resolvido nem liberar o gate final como limpo. Não atribuo o defeito ao novo medalhão nem presumo preexistência pela ausência de diff nesses Text. P3 cauda continua separado.

## Objetivo mínimo FIX3 e limite de escopo

Inventariar e tratar a renovação/medição dos hosts de texto locais fora do hero por **fontScale exato**, preservando a tela, estado/refs de recompensa, snapshot, coleta inflight/confirmada, shadow, medalha, scroll e identidade dos controles. Não remontar RewardScreen/serviços nem chavear todo cartão/tela/AppButton para corrigir parágrafos vizinhos.

O inventário local a conferir em todos os ramos inclui:

- erro inicial :299; header :335;
- rodapé “Unidade ativa”/título :364/:365;
- título/descrição :370/:371 e hosts das linhas em :376/:387/:392;
- labelXP :410, textos de sequência :429/:434 e o conteúdo textual animado adjacente, sem reiniciar contador/efeitos sem necessidade;
- erro de coleta :443; título/corpo da ação :448/:455.

Não estou afirmando que cada host inventariado está defeituoso: header e cartões têm prova direta; os outros precisam ser cobertos pela análise local para evitar repetir um conserto parcial. Para hosts internos de componentes de apresentação, usar a menor fronteira local segura disponível; não alterar shared fora do ownership nem presumir que todo componente precisa remontar. Preservar os contratos de fonte e os rótulos reais, sem truncar/capar fonte ou mudar copy como solução visual.

A prova de FIX3 deve distinguir: teste causal do mecanismo local com falha específica e preservação de estado/controles; medição nativa do source final na mesma montagem normal→máxima→normal, com pares após intervalos registrados e scroll por todos os textos afetados; abertura inicial máxima separada. Sem relaunch entre as capturas usadas para declarar recuperação ao vivo. Não usar somente Jest/AST para encerrar o P2 rasterizado.

## Resíduos e limites

- P3 da cauda normal permanece real, com um glifo parcialmente oculto; ruling do controlador para T17/revisão ampla mantido da R3. Não é motivo para reabrir shared neste FIX3 e não equivale a correção técnica.
- Android não foi executado nesta rodada. Nativo disponível/coletado, gesto global, VoiceOver falado, aparelho físico, FPS, produção/segundo dia e demais gates não são comprovados aqui. CTA legível na captura não é, sozinho, prova do toque; a operação e cleanup cabem ao executor.
- Não li resultados de relatório nativo ainda em finalização como se estivessem aprovados. O julgamento acima usa imagens e runtime bruto. Gate visual continua bloqueado até FIX3 + revisão da prova final; aprovação de código R3 não foi revogada por defeito novo no delta, mas tampouco encerra a qualidade T06.
- Sem source/docs/Git/Loop/brain/native/test/agents. Única escrita: este parecer R4.

## SHA256 das provas principais

- live3s: `e63521274b2f8f4bdce201e1d9349bd61ff73f06b889b932571fa2f4875e28a7`.
- live10s: `b72eda0fb895be38d215cfe171a0b4f0b3e0fa2c84e129966b1bb0c45fcfd0bf`.
- live-scroll1: `a502a3efbe84ce6b7972f65e1213cc50f31a5da50df3bfa04be524f95e646f86`.
- live-scroll2: `ba1727af5374f3367c9b3b712e7f85e7aa165e239c97e4e65148db6b4c441ce2`.


---

## Parecer R5 — SHA256 a5cd28882b7285847a4902cc39049fc2df3b8e421227dbf59e09bc9567ce0fe1

# Task8 / T06 — revisão R5, delta FIX3

**Spec: PASS — inventário de textos fora do hero atendido no delta.**

**Code Quality: APPROVED — sem novo achado bloqueante em FIX3.**

**Aceite visual T06: PENDENTE — P2 rasterizado da R4 continua aberto até a prova nativa R6 do source final.**

## Integridade e escopo

- Li uma vez somente `task-8-fix3-diff.md`, delta de dois paths R3→FIX3. SHA256 medido `6a6f7fc2b77900c2170e0c11f36af70cc45acafe774e163148ab121132430b7d`.
- Manifest `task-8-snapshot-r4/manifest.json` confere com SHA256 `302dc524c7a232b0cc84c21ce4520809a223b4950674f3f28b8a933b052641dc`.
- Freeze6 verificado no disco: source `2fc7517cc11e5fe0f494321cbfcfbbe2b8d8cc8a2d51dd22cf800c7e226d2038`, teste `5194883d9e612bbdbe680eff037bf0075da990524da0dbe8949595220d55910d`; outros quatro hashes iguais aos anteriores. Não repeti auditoria de produto/fluxos já revisados.

## Spec e qualidade do delta

- O source adiciona somente15 keys por **fontScale exato** e comentário:12 Text locais e3 GalaxyStatRow. Hero FIX2 continua intacto. Nenhuma alteração de copy/estilo/cap de fonte, API shared, elegibilidade, economia, serviço, state/ref, hearts ou shadow/version aparece no delta.
- Inventário atendido em `radiant-app/src/features/rewards/screens/RewardScreen.tsx`: erro inicial:299, header:336, rodapé:365/:366, título/descrição:371/:372, linhas:377/:389/:395, XP label:414, sequência:434/:439, erro coleta:448, título/corpo ação:453/:460. Cada key usa a escala exata, inclusive máximo→outro máximo.
- ScrollView, cartões, JourneyMedal, close, AppButtons e AnimatedCounter ficam fora das novas keys. Os textos dos três estados e dos dois erros renovam; controles e dados não são reiniciados. O contador mantém instância e valor real, sem reinício de efeito por mudança de fonte.
- **Checagem focada fora do diff, risco nomeado:** remontar GalaxyStatRow poderia reiniciar estado/controle oculto. Li somente `radiant-app/src/ui/components/GalaxyStatRow.tsx:16-28`: componente de apresentação puro, sem hooks/estado/controle, com dois Text internos e API icon/label/value. Key no caller é fronteira local proporcional sem mudar shared.
- Os nove casos de estados e dois de erro em `RewardScreen.flow.test.tsx:254-345` buscam os Text efetivamente renderizados e comparam instâncias antes/depois, não source regex/key-string ou espelho de props. GalaxyStatRow e AnimatedCounter permanecem reais. Same-scale mantém as novas instâncias. O mock do hero herdado não é usado como prova dos Text fora dele.
- Os asserts preservam identidade de scroll/medalha/close/AppButtons/contador e os totais de leitura/ativação/coleta/RatingPrompt; erro de leitura/coleta não repete pedido ao mudar fonte. Casos FIX2 de inflight/pósconfirmação continuam na suíte completa, preservando callback capturado e confirmação sem ganho/avaliação duplicados.

## Evidência conferida

- RED anterior ao produto, `docs/evidence/2026-10-27-medalhao-t06/red.txt:11139`:11falhas/35skipped/46total. Falhas apontam hosts retidos por texto em :291 ou erro em :330. Prefixo histórico174024bytes confere SHA256 `556892c403911a80648065f7da5cd11c9b9865f75ef259da4307defb876d8615`.
- GREEN recompensa inteira em `green.txt:1217`:46/46,11.263s,exit0. GREEN final restaurado em `green.txt:1283`:Node20.20.2,caffeinate/taskpolicy-b,4suítes inteiras/100testes,46.197s,exit0. Conjunto:RewardScreen.flow,JourneyNodeCompletionGuard,JourneyProgressService,student-checkpoints/screen-integrations. Warnings preexistentes preservados, sem pedir escopo extra.
- Li falhas brutas e conferi hashes das três mutações: retirar somente15keys novas gera11falhas por identidade retida (`39718e3c4b5c08f34c7f5db43ef986a010a874ec7905e1e07ec430b3dee439c7`); key normal/grande gera5falhas/6passes, especificamente3.1→2.5 nos3estados e2erros (`8ef1c05606859b0201af527bc113ad5c1cbd7697c8d50db0bdf413534315196b`); key no contador gera3falhas/8passes em :297, instância real remontada (`c0d7cd883b8e46093579a8cb1b42c081d11caddb3248dcde3e77b3ae430820ea`). Restores registrados no SHA final e freeze medido coincide.
- Correção TS2322 foi somente a anotação `from as number` no harness; o log preserva erro e tscfinalexit0 (`green.txt:1430`,:1441). Não muda runtime. Lint final exit0(:1450), contrato39/39exit0(:1459), UIstrict463arquivos/0regressões/49baseline+3exceçõesexit0(:1673). A correção de classificação do agregador é distinguida das falhas de produto; os logs brutos sustentam a contagem final.

## P2 visual e P3 residual

- Os testes provam renovação dos hosts e preservação de estado, **não rasterização**. Não declaro o P2 de header/cartões resolvido. R6 deve examinar nova prova do source2fc7517 na mesma montagem normal→máxima→normal, pares temporizados sem restart e scroll pelos hosts afetados; abertura inicial máxima separada. O executor autorizado opera nativo, não este revisor.
- P3 cauda normal permanece real/Minor, deferido explicitamente pelo controlador aT17/revisão ampla. A aprovação deste delta não muda essa severidade nem chama a tela visualmente limpa.
- Os resultados nativos/Android, disponível/coletado nativos, gesto/VoiceOver falado/aparelho/FPS/produção/segundo dia e quality completo/Loop/commit/CI não são atestados nesta rodada. Aprovação de código FIX3 não libera esses gates nem substitui aceite visual.
- Nenhum teste, Git, Loop/brain, operação nativa/build/instalação, source/docs write ou agente executado. Única escrita R5: este parecer; leituras encerradas.


---

## Parecer R6 — SHA256 8a0aca22aeb19b4824cb0f85fdc3804ba4a7615971dca7feffd5b8b72729222f

# Task8 / T06 — revisão R6, evidência nativa final FIX3

**Spec: PASS no escopo funcional já revisado; sem nova auditoria de código.**

**Quality: APPROVED com limites explícitos — P2 iOS observado encerrado, Android inicial aprovado; troca ao vivo Android NÃO VALIDADA. P3 cauda continua real/Minor para T17.**

## Integridade

- Source final conferido no disco: `2fc7517cc11e5fe0f494321cbfcfbbe2b8d8cc8a2d51dd22cf800c7e226d2038`; teste `5194883d9e612bbdbe680eff037bf0075da990524da0dbe8949595220d55910d`. Freeze6 inteiro coincide com source-manifest/FIX3, antes/depois do nativo. Não houve nova mudança de produto nesta revisão.
- Report final `task8-native-r3-report.json` SHA256 `aa24f38b30b91706e09fe582fa263f4520eb93631802fb8858306d23e4386d65`, status DONE_WITH_LIMITATIONS. Source-manifest `6e1ceeae0314eb6b626714e677c81721f7adaadc71d00a702e856aae613494b3`; settings `66d707e58fa7a461d2ca0c90042200cda198b2078e7e28d3fd7bb4d4f25e0fd4`; provenance `0bf3502cbbee1e4a30a0e090b533c8042beacc652891226defb66ad6aae04821`.
- Candidates `995e49a7014eb3291e235be8887692bf60f595776f1d365b19bc71055dcef517`; artifact-manifest `116b1af6ff225c6234049b7aacd9cf5a6d482bc7a854a0570ea475e4ee76c894`. Conferi todos12candidate hashes e todos154artifact hashes: nenhuma divergência. O candidato ERROR não é contado como UI válida.
- Examinei por view_image capturas reais iOS/Android, além de runtime/proveniência/saídas e metadados de cleanup. Não operei dispositivos, não executei testes/Git/Loop/brain ou agentes. Única escrita: este parecer.

## P2 iOS — PASS no cenário bloqueado medido

- `task8-native-r3-runtime.jsonl:14-16`: troca AX5 concluída07:43:52.391857; screenshots live às07:43:57.183917 e07:44:04.136435, **4.792s e11.745s** depois. Apenas capturas entre esses pontos, sem scroll/restart. Os nomes3s/10s são aproximados.
- Abri `ios-locked-max-live-3s.png` e `-10s.png`: “CONQUISTA” inteiro, eyebrow refluído, fala iniciando em linhas completas. Não reaparecem as faixas ilegíveis da R4.
- Abri a série completa sobreposta `ios-live-scroll-1..10.png`: fala inteira, unidade, título/descrição, status/progresso/revisão e título/corpo da ação são legíveis por scroll. Fragmentos cortados na borda do viewport reaparecem inteiros nas capturas vizinhas; não os confundi com clipping de layout. CTA permanece legível. A escala extrema quebra algumas palavras e exige muito scroll, mas não omite os trechos antes defeituosos no percurso observado.
- `ios-ax4-live-top/bottom.png` e `ios-normal-restored-top.png` mostram AX5→AX4→normal na mesma tela legível, sem atribuir a AX4 uma série integral que não foi capturada. Estado real54XP/1dia/5vidas/1de8 preservado visualmente.
- Abertura inicial AX5 avaliada separadamente em `ios-locked-max-confirmed.png`, `ios-initial-confirmed-scroll-*` e `ios-initial-max-exit-confirmed.png`. As primeiras capturas cold-start que eram trilha foram excluídas corretamente; não as tratei como ausência de prova nem como recompensa. A captura posterior `ios-initial-max-return-home-confirmed.png` mostra retorno à trilha. Header/CTA normais também têm retorno reportado e capturado.
- Encerro o P2 rasterizado conhecido de iOS **para o estado bloqueado e escalas/caminhos medidos do cliente1.4.0(3), E262D4C1**. Isso não significa todos os estados nativos nem resolução universal de fonte.

## Android — inicial PASS; live NOT VALIDATED

- Abri `android-locked-max-confirmed.png`, `android-initial-max-scroll-1/3/5/6.png` e `android-initial-max-bottom.png`: header/hero/unidade/cartões/linhas/ação/CTA legíveis no início2.0. Abri também `android-locked-normal-final.png`: normal1.0 legível, conservando o P3 da cauda. Não há novo P2 de clipping nos cenários Android inicial/normal examinados.
- `android-locked-max-live-10s.png` é **trilha**, com toast de erro de linking, não recompensa. Proveniência registra que após1.0→2.0 os frames+3.225s/+10.154s perderam a rota. `task8-native-r3-metro.txt:112-115` contém erro de configuração de linking; a vida da Activity/montagem React não foi instrumentada.
- Portanto a troca de fonte ao vivo Android **não foi validada**. A abertura inicial2.0/reabertura não prova recuperação ao vivo. Não atribuo causa ao FIX3 nem declaro bug de produto/preexistência sem diagnóstico. É limitação concreta deste cliente/tentativa, que deve permanecer visível no estado da entrega e na revisão ampla. Não exige por inferência migração de framework, build ou instalação não autorizadas.
- Saídas Android normal por header/system-back/CTA e inicial2.0 por CTA são reportadas pelo executor; `android-return-home.png` mostra a trilha. `android-invalid-after-final.png` mostra retorno após ID inválido, sem aumento dos valores observados. Fallback semID também reportado como auto-return. PNG pósação confirma destino; isoladamente não substitui a sequência de comando/ação do executor.

## P3 residual e limites de cobertura

- A cauda continua cobrindo glifo real: iOS normal no início de “antes”; Android normal no início de “conquista” e inicial2.0 no início de “seguir”. Isso foi visto nas imagens, permanece **P3/Minor**, deferido explicitamente pelo controlador aT17/revisão ampla. A tela não é chamada visualmente limpa e o achado não foi rebaixado por relato.
- O estado real era bloqueado1/8. Disponível/coletado legítimos **não foram alcançados nativamente**; textos/erros condicionais desses ramos continuam com prova automatizada da R5, não prova rasterizada. Não declaro todos12Text/3estados/2erros nativamente aprovados.
- Não houve Maestro em dispositivo, VoiceOver/TalkBack falado, aparelho físico, FPS, produção ou segundo dia. Gesto iOS não foi repetido; tentativa R1 permaneceu na apresentação por deep link, sem prova global. Gates humanos/finais, quality completo/Loop/commit/CI continuam do controlador; este aceite não libera release/merge/build/loja.

## Cleanup e formato de UI

- Recibos finais em source-manifest.after/report.cleanup às07:56:47: sem simulador iOS bootado, adb vazio, porta8081livre, processos Radiant/qemu ausentes; Metro encerrado exit130. Settings comprovam iOS large restaurado e Android **valores atuais medidos**1.0/font,1.0/transition,1.0/window,animatornull exatamente restaurados. O histórico que dizia fonte null não substitui a medição atual1.0. Plugin defaults temporários restaurados.
- `android-invalid-ui.xml` contém33bytes de ERROR de idle, não árvore: excluir de UI XML válida; preservar erro/proveniência em JSON/raw. Nenhum placeholder fabricado é necessário.
- **Detalhe de formato identificado e avisado ao controlador:** `android-locked-normal-confirmed-ui.xml` contém árvore real completa seguida de `UI hierchary dumped to: /dev/tty`. Como arquivo bruto, um parser XML estrito acusa conteúdo após o elemento raiz. Hash/árvore conferem; ao empacotar como XML standalone, extrair documentadamente até `</hierarchy>` e manter raw/proveniência, ou rotular como saída bruta do UIAutomator. Não chamar esse bruto de documento XML parseável. Os dois candidatos JSON iOS parseiam normalmente. O controlador corrigiu o empacotamento antes do fechamento: extração declaration→</hierarchy> mais newline, raw preservado, sem editar nó; conferi `task-8-android-xml-extraction.json` e o XML versionado, que parseia e tem SHA256 `e7fa10c127bd83a3c2e22a26f541e08e5235c5448e27c415bd3c516d088664bb`. Android invalid XML foi omitido, com ERROR bruto em JSON. O detalhe de formato está resolvido, sem efeito em produto/rasterização.

**Conclusão de aceite delimitado:** P2 iOS tratado no percurso medido; Android normal/inicial2.0 PASS visual e saídas medidas; Android live NOT VALIDATED com erro real preservado. Nenhum novo defeito P2 de produto demonstrado nesta rodada. CodeQuality R5 mantido; P3 e demais limites permanecem no handoff do controlador.
