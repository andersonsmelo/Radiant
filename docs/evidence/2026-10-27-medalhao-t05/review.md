# Revisões independentes T05

Estado mais recente: **R4 código, R5 iOS, R6 Android e R7 fixture — Spec PASS / Qualidade APPROVED. Gate1 falhou13/15; segundo gate configurado pendente após correção do mock.** Históricos e limites preservados abaixo.


---

Origem: task-7-review-r1.md; SHA256 `40bc5a801e8327651b9e33d84f77a2b7cdf685762f08ab1a234666b0f8dee1ee`.

# Task 7 / T05 — revisão independente R1

**Spec: PASS. Qualidade: APPROVED**, no escopo de implementação e evidência estática/Jest de T05. **CannotVerify: validação nativa permanece pendente do controlador.** Este parecer não aprova encaixe, timing percebido, rasterização, fps, build, release ou a branch inteira.

## Escopo e identidade conferidos

- Brief vinculante lido: `task-7-brief-r2.md`; template `subagent-driven-development/task-reviewer-prompt.md`. BASE_TASK/HEAD pré-commit do pacote: `ae2e769d89bac2a4de3b11e5a4fe602d86b31323`.
- `task-7-snapshot-r1/manifest.json`: SHA-256 `ae14f3ec432ad6edbb5473e26e80267e86837de84abee230b07f1b9d77df2179`; `review-package.md`: `48e4429a7f67818d88423859736786ebdb65f4b91d031985d0633847fb97c186`. Conferidos pelos bytes, incluindo a identificação dos 21 inputs e os novos arquivos.
- Li o diff de produto pelo suplemento `product-diff.md`, em passes de leitura por causa do truncamento da saída, sem recomputar o diff ou reler os arquivos alterados integralmente. SHA-256 `ed64524607c545fd85f0ce053f7d4f8fd2e66420760d9f2b0411e468e543265a`, **73920 bytes**. O número 73507 informado no despacho era uma divergência de metadado; o SHA confere.
- Os **15 caminhos de productFreeze** conferem com os hashes/ausência do manifest, incluindo o teste novo de HybridLessonCharacter, o fluxo HybridLessonScreen intacto e a story ausente/requires intacto. São 12 caminhos de produto/teste alterados; os três restantes são preservados/opcionais pelo brief.
- `red.txt`, `green.txt`, `audit.md`, `mutations.json`, `native-preflight.txt` e `task-brief.md` conferem com os hashes do manifest. A única errata do report atual contra o snapshot é `implementation-report.md:25`: “Primeira medição herdada nesta retomada” → “Primeira medição do produto herdado nesta retomada”. Extraí a versão congelada do pacote e reproduzi seu SHA `3a56969eb150f8edda5da32aebed63b02ca6c92632bc6d23f1eeb63475173a3d`; não há mudança de contagem, comando, produto ou alegação de gate. Parecer vinculado ao snapshot mais essa errata textual, reconhecida pelo controlador.

## Conformidade e pontos fortes

| Contrato T05 | Verificação de código e evidência |
| --- | --- |
| Contexto nos consumidores reais | Enumeração focal encontrou somente `QuizScreen.tsx:369` e `LessonFlowScreen.tsx:582` como consumidores de LessonSummary. Quiz resolve o tema do nó/unidade do catálogo (`QuizScreen.tsx:162`) e passa `lesson.title`; LessonFlow usa o nó, depois título de catálogo/bloco ou hook autoral e tema da atividade (`LessonFlowScreen.tsx:163`). Casos normal/review e sem nó em `QuizScreen.flow.test.tsx:413`, `LessonFlowScreen.flow.test.tsx:1150` e `:1992`; mutações quiz/flow-theme/title e no-node-hook-title falham na expectativa correspondente. |
| Zero neutro preserva conclusão | `LessonSummary.tsx:139` mantém `state="done"`, com aparência neutra separada; `JourneyMedal.tsx:170` altera só a paleta. A ilustração e a desabilitação continuam regidas pelo estado. `JourneyMedal.test.tsx:341` verifica cor, interação e tema/state da ilustração; `LessonSummary.test.tsx:318` verifica conclusão/régua/ausência de comemoração e as mutações neutral-palette/neutral-fake-state discriminam os dois defeitos. |
| Régua, recorde, XP e CTAs | `LessonSummary.tsx:69` mantém três estrelas, com preenchimento por contagem; `:175` separa o recorde maior e `:176` distingue XP null/zero/positivo sem valor inventado nem card. A nova composição conserva avaliação e callbacks. Matriz 0–3 em `LessonSummary.test.tsx:333`, estados null/zero nos testes preservados, XP grande/sem card em `:345`; callbacks reais de tela em `QuizScreen.flow.test.tsx:395` e `LessonFlowScreen.flow.test.tsx:1125`. As mutações de régua e dos dois fluxos de avaliação falham de modo comportamental. |
| Confete e revisão | Imports/montagens de Confetti foram retirados dos dois consumidores, preservando outras telas fora de T05. `LessonSummary.tsx:149` só monta Pixel em lesson; as telas repassam o kind de revisão. Testes de fluxo e componente verificam ausência; a mutação review-pixel também foi repetida contra a guarda final acessível de LessonFlow, com duas falhas específicas. |
| Movimento e hooks | `SummaryStar` chama seu hook no topo (`LessonSummary.tsx:56`); o map monta componentes. `ui/motion.ts:424` concentra a mola de cunhagem, com `played` por montagem; `:446` assenta estrelas por timing e atraso. `duration.ui` é 220 ms (`ui/motion.ts:37`), então a última estrela termina em 340 ms; a mola declarada usa 300 ms. Sem import Reanimated novo em tela de feature. Estado inicial/final 1 preserva preferência pendente/reduzida; rating/rerender não reiniciam ganho. `ui/__tests__/motion.test.ts:190` verifica estilo efetivo no quadro e `:220` testa ganho resolvido novamente; mutações mint-once/star-once falham no estilo real. |
| Pose reduzida | `HybridLessonCharacter.tsx:17` conserva celebrate. A verificação focal de `PixelIllustration.tsx:114` e `:166` confirma que preferência controla a flutuação e a pose chega separadamente a PixelBody. O teste novo `HybridLessonCharacter.test.tsx:11` inspeciona PixelBody real e o vermelho/mutação mostram “comemora” versus “acena”, sem espelho de props. |
| Texto ampliado e composição | Título/frase sem truncamento ou teto artificial; corpo rolável e rodapé existente preservados (`LessonSummary.tsx:136`, `:159`, `:227`). O teste de texto máximo em `LessonSummary.test.tsx:364` verifica essas propriedades. Encaixe efetivo no aparelho exige o gate nativo. |

A API de aparência é pequena e separa visual de progresso sem introduzir novo estado canônico. Nenhum diff de economia, primeira resposta, assinatura, SDK/runtimeVersion ou política foi introduzido; as guardas preservadas dos fluxos continuam no conjunto executado. Ausência de edição nesses serviços não equivale a uma auditoria global deles.

## Evidência auditada, sem reexecução

- Vermelho herdado conferido nos logs: composição antiga falha em `red.txt:3871` (cunhagem), `:3902` (medalha neutra), `:3916` (título/tema), `:5056` (XP), `:5341` (review), `:5766`/`:5782` (pose), e nos consumidores indexados em `audit.md:13`. São falhas do comportamento específico; a régua já existente isoladamente não foi usada como prova do layout novo. Não atribuo execução desse vermelho ao implementador substituto nem a esta revisão.
- `green.txt:7`: 7 suítes/236 testes antes da última limpeza só de testes; `:314`: Summary final 1/40; `:366`: três fluxos finais sob CPU limitada 3/131. **Fases independentes, sem somar contagens.** Comandos, CWD e Node20.20.2 registrados no cabeçalho/fases.
- `green.txt:669`: quatro contratos, 121/121 PASS; `:1289`/`:1294`: typecheck/lint sem diagnóstico; `:1299`: visual QA sem regressões, 49 baseline/3 exceções existentes.
- Conferi as 17 entradas de `mutations.json`: hashes das fontes restauradas iguais ao freeze, todas as âncoras únicas em reconstrução em memória, nomes/contagens causais e resumos nos logs integrais existentes. Os trechos mostram diferenças de cor/estado/tema/texto/contagem/pose/estilo ou callbacks, não sintaxe/ambiente/timeout. O recheck final review-pixel tem 2 falhas e restauração/hash correspondentes. Não injetei mutações nem rodei testes.
- Checks próprios foram somente leitura: SHA/bytes do pacote e produto; comparação da errata; enumeração de consumidores; inspeções focais abaixo; leitura do vermelho/verde/mutações. Nenhum comando git, build, instalação, quality completo, Loop ou nativo executado.

## Inspeções fora do diff por risco nomeado

1. **Regressão da API compartilhada de JourneyMedal:** conferi os únicos outros consumidores reais, `JourneyTrail.tsx:728` e abertura de `LessonFlowScreen.tsx:666`. Eles omitem appearance, logo permanecem no paletteFor anterior; geometria, progresso e pulso não mudam. A neutralização de T05 só é usada no resultado.
2. **Pose reduzida ser apenas uma prop de teste:** conferi `PixelIllustration.tsx:114`/`:166`; preferência interrompe o laço, e PixelBody recebe poseForState(state). O teste usa esse componente real.
3. **Fallback de tema fabricado pelo mock:** conferi `resolveNodeTheme.ts:24`; a resolução real é nó → unidade válida → radiacao, a mesma exigida nos testes e nos consumidores. Não se deriva tema de texto.
4. **Timing fora do DESIGN:** conferi `docs/DESIGN.md:515`, spec §11.1–11.3 e o token `duration.ui` em `ui/motion.ts:37`. As declarações de T05 respeitam 200–450 ms e reservam mola à cunhagem; percepção e execução nativa não são inferidas do Jest.

## Achados

- **P1/P2: nenhum encontrado no escopo T05.**
- **Minor M1 — ruído de teste preexistente:** `green.txt:14`, `:373` e `:1321` registram avisos de atualização fora de act. Medi 10 ocorrências tanto na fase normal quanto na CPU limitada e na baseline HEAD dos mesmos três fluxos (baseline 3/120 em `:1611`). O output não é pristine, mas não há aumento demonstrado por T05; registrar para manutenção dos testes sem ampliar esta entrega. Não suprimi nem tratei avisos como PASS limpo.

## CannotVerify e gates que continuam abertos

- **Nativo:** sem prova nesta revisão para encaixe em texto máximo/escala ampliada, zero estrelas no aparelho, leitura de tela efetiva, rasterização Skia, pose visual, sensação/assentamento da mola, fps ou shader. O controlador precisa consolidar a medição iOS/Android nos mesmos bytes; Jest cobre lógica/estilos/configurações, não substitui esse gate.
- **Validação final de projeto/CI/release:** não executei Loop validate, quality completo, CI, build, instalação, push, merge ou envio. Este parecer não consome esses gates nem G1–G8; simulador reservado e segundo dia permanecem fora do escopo.

**Avaliação:** implementação T05 aprovada para seguir ao gate nativo/final do controlador. Única escrita desta revisão: este relatório; produto, índice, branch e Loop preservados.


---

Origem: task-7-review-r2.md; SHA256 `49e3ba8a81ef7b510f37098a2daf65b0b560db4a698876a77d2b9a650fae3119`.

# Task 7 / T05 — revisão independente R2, fix round 1

**Spec do delta: PASS. Qualidade do código do delta: APPROVED. P2 estático: ADDRESSED. P2 nativo/aceite total: OPEN.** A remoção dos limites explícitos de parágrafo está implementada e discriminada pelos testes. A correção visual ainda depende da remedição nativa pass2 nos bytes freeze2; este parecer não declara os glifos corrigidos.

## Escopo e integridade

Revisão limitada ao P2 de texto cortado em AX5 e ao delta `LessonSummary.tsx`/`LessonSummary.test.tsx`, sob o mesmo brief R2. R1 foi preservada, sem nova auditoria dos contratos já revisados.

Hashes calculados pelos bytes:

- `task-7-snapshot-r2/manifest.json`: `588e915d9cb0d65bf041d29497b9bb41fca1ea715ebed4dd3e68e32408e150ea`.
- `review-package.md`: `c3755c07538cc1dabff3f6fa92294e712350155071f75f87f6c6894a9af177af`.
- `product-delta-r1-r2.diff`: `62e23c1511dfddb9443813d7acb777fe7df7eb29a3e57622ccdfef7601bee5a4`, 5690 bytes; lido uma vez.

Comparei os dois manifests: só os dois paths de Summary mudaram; os outros 13 caminhos do productFreeze preservam R1. Todos os 15 caminhos atuais conferem com freeze2. Os hashes atuais de report/audit/red/green/mutations e das duas PNGs AX5 R1 também conferem com o manifest R2. O prefixo vermelho original de 349443 bytes conserva SHA `dcbafa6836aaaf75f8e0edded2a5785ea40aed4b1dfa1e13e42db74a7536f408`.

## P2 e intervenção

**P2 nativo confirmado nas imagens R1:** inspecionei `docs/evidence/2026-10-27-medalhao-t05/ios-lesson-max-top.png` e `ios-lesson-max-bottom.png`. O topo mostra os textos centrais como faixas horizontais cortadas no conteúdo visível. O scroll/CTA disponíveis e a segunda captura não tornam esses glifos legíveis. Portanto, a lacuna CannotVerify de R1 recebeu depois uma falha nativa concreta; a aprovação estática R1 nunca foi prova de aceite visual.

**Estático ADDRESSED:** `LessonSummary.tsx:247`, `:277` e `:283` sobrescrevem somente o `lineHeight` herdado de title/phrase/subtitle com `undefined`. Os spreads de tipografia, Sora, pesos/tamanhos, copy, cores, escala livre e estrutura rolável são preservados. Não há teto artificial, truncamento, alteração global de fonte, mudança de prêmio/callback, movimento ou política. A altura passa a depender das métricas naturais da fonte.

**Checagem focal por risco causal:** li o conversor iOS instalado em `radiant-app/node_modules/react-native/ReactCommon/react/renderer/textlayoutmanager/platform/ios/react/renderer/textlayoutmanager/RCTAttributedTextUtils.mm:224`. O ramo de lineHeight explícito determina minimumLineHeight e maximumLineHeight do parágrafo, multiplicados pela escala efetiva. Retirar a restrição local é coerente com a hipótese do defeito. Isso sustenta a intervenção; não prova rasterização correta após a mudança.

**Guardas adequadas:** `LessonSummary.test.tsx:372` adiciona três casos; `:387` lê o estilo do Text renderizado, preserva família/tamanho/peso, exige ausência de lineHeight explícito e de limites de escala/truncamento. `:394` verifica ancestrais até ScrollView e contentContainer sem height/maxHeight/overflow oculto. É observação dos drivers enviados ao nativo, sem espelho criado no componente. O fixture fontScale 3.1 não simula rasterização, e o teste reconhece esse limite. Não encontrei regressão estática ou ampliação de escopo no delta.

## Evidência conferida, sem reexecução

- `red.txt:8934`, `:8950`, `:8966`: as três guardas falham em `toBeUndefined`, recebendo 38/24/24 antes da correção; `:8983`: três falhas, sem erro de harness.
- `green.txt:1624`: AX5 3/3 PASS; `:1679`: Summary+QuizFlow+LessonFlow, **3 suítes/164 testes PASS**, 21.503 s. Fases independentes; não somadas, sem apresentar 236 de R1 como resultado R2. Cabeçalho registra CWD e Node20.20.2.
- `green.txt:1774`/`:1779`: typecheck e lint dos dois paths, exit 0, sem diagnóstico.
- `mutations.json:893`: fixRound1 restaura exatamente a fonte R1, SHA `ee9523558726ffebf45b0152b3161d075d43bd3e09295466b967f446199ddfea`, mantendo os testes novos. Conferi o log integral `task7-fix1-mutation.txt:47`, `:63`, `:79`: mesmas três falhas causais 38/24/24; resumo `:95`/`:96`. Fonte fixa e teste atuais conferem com os hashes restaurados `de4be8c1d5a6743d39e0d4a0fb0b2c710a78141525ec6923165bfba05ae04227` e `0aa8274e8270ebf351e7412d4700209beb02d3f82c7d413b8b58baae0e30e94b`.
- Minor preexistente mantido: dois avisos act de LessonFlowAttempt em `green.txt:1686` e na atualização assíncrona posterior. São o subconjunto já evidenciado em R1; a suíte híbrida ficou fora desta focal, portanto não se compara 2 com 10 de outro conjunto como se fossem a mesma medida. Sem supressão.

## Parecer e limites

- **Novos achados P1/P2 no código do delta: nenhum.**
- **P2 visual ainda OPEN:** não há captura pass2 nesta revisão para confirmar glifos íntegros. O controlador deve medir iOS/Android nos hashes freeze2, com texto máximo, topo/fim do scroll e CTA acessível, além de conferir que o layout normal permaneceu utilizável. Só essa prova pode fechar o achado nativo e o aceite total.
- Demais limites nativos de R1 continuam: timing percebido, pose/rasterização e desempenho não são aprovados por Jest. Nenhum teste, nativo, build, instalação, quality completo, Loop, git, agente ou escrita de produto foi executado nesta revisão.

**Única escrita própria R2:** este relatório. Parecer R1 preservado. Código do fix aprovado para remedição nativa; sem declaração de conclusão total de T05.


---

Origem: task-7-review-r3-native.md; SHA256 `ee08b7e0b88bab47d290a75437ae38f3e91449976d3344780fa8e992c3e63f84`.

# Task 7 / T05 — revisão independente R3 nativa parcial

**Spec do aceite nativo: FAIL. Qualidade para fechamento: CHANGES_REQUIRED. P2 de glifos cortados: OPEN.** A aprovação estática do delta em R2 continua válida dentro de seu limite; a correção não demonstrou o resultado visual requerido. Esta revisão parcial libera diagnóstico do implementador sem esperar Android.

Medição em 27/10/2026, 20:29 UTC (17:29 America/Bahia). Worktree `Radiant/.claude/worktrees/trilha-2026-10-20`, BASE_TASK/HEAD `ae2e769d89bac2a4de3b11e5a4fe602d86b31323`. Brief R2 e parecer R2 lidos; não refiz a auditoria ampla nem os testes anteriores.

## Integridade

Conferi independentemente os 15 caminhos de `productFreeze` no começo da revisão e novamente após a captura R2: **15/15 iguais**, incluindo ausência da story. Manifest R2 SHA256 `588e915d9cb0d65bf041d29497b9bb41fca1ea715ebed4dd3e68e32408e150ea`. Summary fonte continua `de4be8c1d5a6743d39e0d4a0fb0b2c710a78141525ec6923165bfba05ae04227`; portanto o achado não é desvio de código posterior ao freeze2.

Conferi também as duas cópias imutáveis R1 em `task7-native-failure-r1-controller`: top `425dd5f555f24aaece34566d0e53e3f68fbb42479ef107eacdc30ff869273028`, bottom `17f3a90f8269a04167e16451645eb1eb51bfb06f6f0dda7bd70bdf29f76e87c3`; ambas iguais ao manifest original. A imagem top R1 foi vista diretamente para comparação.

## P2 observado em R2

Inspecionei diretamente a nova `docs/evidence/2026-10-27-medalhao-t05/ios-lesson-max-top.png`, **217546 bytes**, SHA256 `d7f9595b3b457be9cacda5ce0585c3d52ae27a8c90b3196c72744b0f210141ea`. O controlador a identificou como resultado real sem nó após mudar large para AX5 no mesmo resultado, no simulador principal iPhone17Pro/iOS26.5. O relatório local iOS ainda está RESUMED; a proveniência completa/limpeza será consolidada pelo executor, e não a presumo concluída aqui.

A medalha, Pixel, estrelas, “Sem XP nesta tentativa”, “Respostas corretas”, “4 de 4” e CTA Continuar aparecem. Entre estrelas e XP, **título, frase e subtítulo continuam cortados em faixas horizontais**. É perda dos glifos dentro do conteúdo atualmente visível, não conteúdo que apenas aguarda rolagem. O CTA visível não compensa a perda de leitura. A intervenção de retirar `lineHeight` explícito, embora discriminada estaticamente, não fecha este P2 no cenário já reproduzido.

Inspecionei também a captura normal R2 `ios-lesson-normal.png`, **221570 bytes**, SHA256 `858fd331b7036eb161610600b302baaaf7705af72f2d3854e9fe780de1cfd3cb`. Título “O kV e o contraste”, frase “Perfeito. Nenhum erro nesta lição.”, subtítulo, XP ausente informado, respostas, avaliação e Continuar estão legíveis. **Normal observado PASS** nesse resultado 4/4. Este PASS não é extensível a AX5.

## Próxima discriminação e limites

O executor está remontando o resultado com AX5 definido antes da montagem para distinguir defeito de relayout após mudança de Dynamic Type de defeito presente na primeira montagem. Esse resultado ainda não foi visto nesta revisão. Mesmo que a montagem inicial passe, o corte já observado após mudar a configuração mantém o cenário afetado aberto até correção ou decisão explícita de escopo; não reduzi o aceite por conta própria.

Android, revisão AX5, movimento reduzido, zero estrelas, aparelho físico, áudio de leitor de tela, FPS e segundo dia não são aprovados por esta revisão parcial. O timeout de manifest Android relatado pelo controlador ocorreu antes de React e não é classificado aqui como achado de UI/produto. Não operei simuladores, Android ou Metro; não executei testes, Loop, build, instalação, git writes ou alterações de produto.

**Parecer:** manter T05 em execução, P2 OPEN e fechamento bloqueado. Diagnóstico/fix deve mirar o corte concreto e voltar à revisão com prova nativa no mesmo cenário. Única escrita própria: este relatório local; R1/R2 preservados.


---

Origem: task-7-review-r4-fix2.md; SHA256 `c95ea30894682bfe8ebbb1193bb641f69aca294be9bb63485307ddea35f622b8`.

# Task 7 / T05 — revisão independente R4, fix2/freeze3

**Spec do delta: PASS. Qualidade do código do delta: APPROVED. P2 estático: ADDRESSED. P2 visual/aceite nativo: OPEN.** A nova fronteira de identidade dos Text cobre a hipótese discriminada na medição R2 sem remontar a conquista e os controles. Ainda não há prova nativa freeze3 revisada aqui; esta aprovação não fecha o achado visual de R3.

Revisão em 27/10/2026, limitada ao fix2 em Summary.tsx/test. Brief R2, diagnóstico fix2, report/audit/logs e pareceres R2/R3 lidos. Não repeti a auditoria geral de T05 ou os testes anteriores.

## Integridade

Calculado dos bytes:

- Manifest R3: `285372e73d96be0b965de707222a341be4e6698d5537663262dbdfe869f35473`.
- Review package R3: `968374135591ea49cb607d3428a9872e59b8876af23643b9bc8dbd6b8eb07e1d`.
- `product-delta-r2-r3.diff`: 16534 bytes, SHA `e98543a0716992caafa45413cb59cb2e52c2746c1ffec630a4af509a0fb16593`; delta lido integralmente uma vez.

Comparei os manifests R2/R3 e as fontes atuais: **15/15 productFreeze iguais ao R3**, apenas Summary.tsx e seu teste diferem de R2; os demais 13 caminhos nominais (incluindo story ausente) permanecem iguais. Fonte `68a7f89960af099900fad1cae570d54f848339a35e5d85cd658cc5090514a9cd`; teste `3149cfd38cb230ca7c85c7a3a91862b62384feac0381bc2ab4448451ee9a11b6`. Report/audit/red/green/mutations atuais também conferem com os cinco hashes do manifest R3. Conferi preservação byte a byte dos prefixos de red/green/audit/report contra backups fix2, sem atribuir a mim a execução anterior.

## Spec e mecanismo

Em `LessonSummary.tsx:120`, uma única leitura de useWindowDimensions fornece fontScale. `isLargeTextScale(fontScale)` conserva exatamente o limiar anterior; li a função existente e o hook RN instalado, que reage também à mudança de fontScale. Não se acrescenta fonte paralela de escala nem dependência nova.

Em `:93`, `:163` e seguintes, keys variam com o número fontScale nos Text próprios: título, frase, subtítulo, recorde, XP, ambas partes das linhas de resultados, hábito, agenda e avaliação. Duas escalas já grandes produzem identidades distintas. Em escala igual, a key é estável. O subtítulo usa Fragment keyed contendo apenas seu Text, preservando os dois literais consumidos pelo contrato Maestro.

A key não envolve Summary, ScrollView, MotionView, medalha, estrelas ou Pressable. ResultRow recebe fontScale e renova apenas seus Text; seu View acessível permanece. Nenhum callback, gravação de XP/conclusão, hook de conquista ou prop que decide prêmio mudou no delta. Não há teto de escala, truncamento, redução de fonte, alteração de Sora/copy ou política. Recriar exclusivamente parágrafos simples quando a preferência de fonte muda é uma intervenção local coerente com o fato discriminado: R2 inicial AX5 legível versus warm large→AX5 cortado. A hipótese sobre cache/invalidação do RN não é promovida a diagnóstico upstream definitivo.

AppButton e seu Text compartilhado continuam fora desta intervenção. Isso não é apresentado como correção global do Dynamic Type: a verificação de CTA e demais componentes permanece uma fronteira nativa explícita, com avaliação transversal em T17 conforme registro do controlador. Nenhum defeito adicional de AppButton foi inferido apenas da exclusão do ownership.

## Guardas e evidência causal

`LessonSummary.test.tsx:457` cobre 1→3.1 e3.1→2.5 e observa identidade pública dos hosts encontrados pelos textos. Os 13 parágrafos não são um espelho acrescentado à produção, e o teste não lê fiber/key privado. `:492` exercita subtítulo de revisão e XP null/zero/positivo, sem Pixel. `:513` conserva identidade de scroll, medalha, régua, CTA e rating control, exige uma só cunhagem/duas entradas das estrelas, preserva callbacks funcionais e avalia mesma escala e avaliação já dada. A comparação booleana evita o formatter de nó desmontado mascarar a asserção. Essas guardas provam fronteira de montagem, **não rasterização**.

Conferi logs e JSON existentes, sem executá-los novamente:

- RED fix2: seis falhas causais; os hosts permaneciam antigos, inclusive entre duas escalas grandes. Nenhum erro de harness contado como vermelho do produto.
- Três suítes Summary/QuizFlow/LessonFlow: **170/170 PASS**,48.845s, antes da alteração apenas no comparador do teste. Dois avisos act de LessonFlowAttempt mantidos, já classificados anteriormente.
- Summary final sob CPU limitada: **49/49 PASS**,38.343s, fonte/teste finais identificados no cabeçalho, Node20.20.2. Contagens não somadas.
- Maestro38/38, typecheck e lint focal finais: PASS/exit0.
- Keys constantes: **6 falhas**; keys só pelo boolean largeText: **4 falhas** (fronteira3.1→2.5); key indevida no ScrollView: **1 falha Expectedtrue/Receivedfalse na identidade do scroll**. JSONs finais têm zero runtime-error suites e nenhum testExecError. A tentativa inicial de formatter não foi contada. Os registros de restauração e os hashes atuais conferem com freeze3.

Não encontrei P1/P2 estático novo nem ampliação do produto além dos dois caminhos da rodada. A complexidade acrescentada é local e serve a uma falha real reproduzida; uma refatoração de tipografia global seria outro escopo.

## Gate seguinte

**Código aprovado para remedição nativa, não aceite total.** R3 visual continua OPEN até inspeção de freeze3 na troca de Dynamic Type com resultado aberto, montagem inicial AX5, legibilidade normal e scroll/CTA, com prova de fonte entregue e limites Android/revisão explicitados. Se a nova medição falhar, deve voltar ao implementador; os verdes de identidade não podem resolver um corte de glifos em prosa.

Não executei teste, operação nativa, Loop, sessão, build, instalação, git write ou escrita de produto. Única escrita própria: este relatório local. R1–R3 preservados.


---

Origem: task-7-review-r5-native.md; SHA256 `c177edd384074adc1c3d758a88bc35ad8c14f4c29f1f8f5e94ca444b5dc892b0`.

# Task 7 / T05 — revisão independente R5 nativa iOS/freeze3

**Spec iOS do cenário medido: PASS. Qualidade para esse cenário: APPROVED. P2 iOS de glifos cortados após large→AX5: RESOLVED no cliente/simulador medido.** Android e fechamento integral de T05 não recebem aprovação neste parecer. R4 estático continua sendo o parecer do fix2; aqui a conclusão vem das capturas reais posteriores.

Revisão em 27/10/2026, após relatório final iOS das 23:09 UTC (20:09 America/Bahia). Cliente existente 1.4.0(3), iPhone17Pro/iOS26.5, simulador principal `E262D4C1-99BE-496B-8567-0291C14E6533`. Não operei UI/nativo nem executei testes.

## Proveniência e integridade

Li o relatório local `task7-native-ios-r3-report.json`, estado final `PASS_SCOPED_IOS_DYNAMIC_TYPE_FIX2`, SHA256 `6d31cc4da1db4e11c8cf4bc0ce1b4b320be0348638760e6e8e9f4bfdbd387b77`. Seus mapas before/after são exatamente os15 paths do manifest freeze3 e **15/15 fontes atuais conferem**. O manifest R3 conserva SHA `285372e73d96be0b965de707222a341be4e6698d5537663262dbdfe869f35473`.

Conferi existência, tamanho e SHA dos **11/11 artefatos** indexados no relatório (PNGs e snapshots). O registro do sourcemap servido `task7-ios-r3-served-source-check.json`, SHA `19eed755d5820ef2adf72304a76cc4e6b0d378e359ad9ea1876e76b6eb4d618d`, identifica Summary `68a7f89960af099900fad1cae570d54f848339a35e5d85cd658cc5090514a9cd` e12 ocorrências de keys fontScale. Isso vincula os bytes servidos ao freeze3; não usei apenas a hash do arquivo no disco como prova do servidor.

O executor registra uso dos fluxos reais, sem fixture/reset/seeding, e a troca large→accessibility-extra-extra-extra-large **com o mesmo resultado aberto**, sem navegar/remontar o Summary por ação externa. Esse é o gatilho que falhava em R2. As falhas históricas R1/R2 ficam preservadas separadamente; as imagens finais não são apresentadas como se sempre tivessem passado.

## Inspeção visual direta

### Aula real sem nó

Rota `radiantapp://learn?blockId=bancada%3Aexposicao`:6 passos,4/4 corretas,3estrelas,5/5vidas, “Sem XP nesta tentativa”. Inspecionei normal, máximo topo/médio e duas capturas inferiores.

- Normal: título “O kV e o contraste”, frase “Perfeito. Nenhum erro nesta lição.”, subtítulo, XP ausente informado, respostas e avaliação legíveis; CTA presente.
- Warm large→AX5: título, frase e subtítulo possuem glifos íntegros e várias linhas. Há quebra de palavras e necessidade de rolagem devido à escala livre; não vi as faixas horizontais internas que sustentaram P2 em R2.
- As capturas inferiores mostram “Sem XP nesta tentativa”,4de4corretas e avaliação alcançados pela rolagem. Continuar permanece fixo e legível. Conteúdo fora do viewport em uma captura reaparece inteiro na seguinte: isso distingue rolagem legítima de corte permanente dos glifos.

Hashes finais principais: normal `7da0648bdfbbd8e6590f99e2650f7a80826c9cbe886785bd8be6eaf4509f51bb`; max-top `73bfa3d5d47c2d8ae5239fdad5daffb3771a1a73b7c2e1697e44a7500045bb09`; max-bottom `f345179caf37dfa3e710f9d8fa1302510cb9d8ee8adbe71d43d7fdf8be2f9902`. Lower/end locais `a4f4a17b9df938ec4685db37819591855a964674f0f08037d1d63c1ef6d0713d` e `d56d105ff142a59d60a767bbedb2d8c6b88d6caf7ef2d562c2c075f98c71f887`.

### Revisão real

Rota `radiantapp://quiz?mode=review&lessonIds=lesson-1`:3respostas,3/3corretas,3estrelas,+18XP,1de8etapas. Inspecionei normal, máximo topo e três capturas intermediárias/estatísticas locais. Medalha do átomo e título “Fundamentos de Radiologia” visíveis; Pixel ausente na área da medalha. A revisão não inclui a seção de avaliação da aula.

Depois da troca large→AX5 com a revisão aberta, título, frase “Três estrelas. Nada passou despercebido.”, “Revisão concluída”,+18XP e estatísticas estão íntegros ao rolar. CTA legível nas capturas. O+18XP é observado no fluxo ordinário; não prova persistência, nuvem ou ausência de prêmio duplicado por si só.

Normal SHA `c5cc05128aa1ebfa4aef3bf7772c347073b8f501cfb2233f62250394ad967c99`; max-top `5c86f59e47ff69eb6d22e553783f6abb3e2ca2d70e5576fd65c8bbb60e75b19c`. Mid1 `3e38be4f0dd44ccd0aae2318aa881081264e179a8734f1c79df6c7ad2c186e37`; mid2 `0e00cc78891124356434129464c7cd5a3ec28ed7b2ea056ed1e1eb64eb079ddd`; stats `27435c95fcd1741fe81abcbc8bec5936becbfbe0e0327dac3c85b6d8ac174fa5`.

## Encerramento operacional e limites

O relatório final registra contentSize original/final **large**, medido antes do shutdown, stop_app_sim com sucesso, principal Shutdown e listagem de booted vazia. Metro pertence ao controlador e foi deixado ativo; Android e reservado não foram operados por esse executor. Li o registro final de cleanup; não repeti operações nativas para revalidá-lo nesta revisão.

**P2 concreto iOS fechado no gatilho reproduzido**, sem novo P1/P2 observado nestas imagens. Não generalizar para todos os componentes RN, aparelhos ou versões. A primeira montagem já AX5 foi uma discriminação R2 histórica; não a renomeio como uma execução cold-AX5 adicional de freeze3. As provas finais aqui são normal e troca dinâmica na aula/revisão.

Android ainda aguarda sua própria prova. Também permanecem NOT_TESTED nativos: reduzir movimento, zero estrelas, aparelhos físicos, fala audível do leitor de tela, FPS/sensação/once-only, persistência de economia, revisão naturalmente devida e segundo dia. Jest e as capturas não fecham esses limites. Loop final, commit e CI pertencem ao controlador e não foram executados por mim.

**Parecer iOS scoped PASS/APPROVED; aceite total T05 ainda pendente de Android/gates finais.** Única escrita própria nesta rodada: este relatório local. Nenhuma fonte, teste, evidência versionada, política ou configuração alterada.


---

Origem: task-7-review-r6-android.md; SHA256 `3e19e9a06e343406275df0475e5f3189718b603da171fd61fe12f31cac3c7778`.

# Task 7 / T05 — revisão independente R6 nativa Android/freeze3

**Spec Android dos cenários medidos: PASS. Qualidade desses cenários: APPROVED.** Não encontrei novo P1/P2 nas imagens Android finais. Este parecer fecha a revisão da prova Android descrita abaixo; não converte cenários NOT_TESTED em aprovação nem substitui o fechamento do controlador. R4 de código e R5 de iOS permanecem preservados, sem nova auditoria dessas frentes.

Revisão em 27/10/2026 America/Bahia, sobre relatório Android concluído às 23:19 UTC e cleanup posterior do controlador às 01:42 UTC de 28/10. Worktree `trilha-2026-10-20`, branch `claude/trilha-medalhao-design`, HEAD `ae2e769d89bac2a4de3b11e5a4fe602d86b31323`. Cliente existente 1.4.0(3), `radiant-entrada-api34`, `emulator-5554`, Android API34. Não executei produto, testes, UI nativa, build, instalação, Loop ou escrita Git. Única escrita própria: este relatório local; alterações das outras sessões preservadas.

## Integridade e proveniência

Li brief R2, R4 fix2, R5 nativa e o relatório Android final. Calculei dos bytes:

- Manifest freeze3: `285372e73d96be0b965de707222a341be4e6698d5537663262dbdfe869f35473`.
- `task7-native-android-r3-report.json`: `380ca8b3bfa7174ccb6fc276a142f61795be82002b37f32f7d5dfb61ecc751dd`.
- **15/15** caminhos nominais coincidem entre manifest, fontes atuais e mapas before/after do relatório; story ausente continua `null`. Summary `68a7f89960af099900fad1cae570d54f848339a35e5d85cd658cc5090514a9cd`; teste `3149cfd38cb230ca7c85c7a3a91862b62384feac0381bc2ab4448451ee9a11b6`.
- **5/5** artefatos de implementação (`implementation-report.md`, `audit.md`, `red.txt`, `green.txt`, `mutations.json`) coincidem com o manifest. Não atribuo a mim suas execuções.
- **5/5** artefatos Android finais conferem em tamanho e SHA com o relatório: quatro PNGs e `android-review-ui.xml`.

Os probes HEAD/GET registram HTTP200 e manifesto JSON com runtimeVersion e launchAsset. Os ~12s incluem espera artificial do probe e **não medem latência**. O vínculo Android usado aqui é o conjunto de fontes before/after congelado, cliente existente e execução registrada pelo executor; não reivindico uma conferência independente do sourcemap Android servido.

## Inspeção visual direta

Abri e inspecionei os quatro PNGs versionados e a captura inferior auxiliar real da revisão; não me baseei apenas no texto PASS do executor.

**Aula real sem nó, fonte 2.0.** Rota `radiantapp://learn?blockId=bancada%3Aexposicao`, seis passos concluídos segundo o registro. O topo mostra medalha de exposição, Pixel celebrando, três estrelas, título “O kV e o contraste”, frase “Marca cheia! Leitura impecável.” e subtítulo “A lição foi concluída”. Todos têm glifos íntegros; não vejo faixas horizontais cortando letras. “Sem XP nesta tentativa” e “4 de 4 corretas” aparecem integralmente. A captura inferior revela “Avalie a aula”, “É opcional” e as cinco estrelas de avaliação, mantendo “Continuar” inteiro e fixo. O deslocamento entre as capturas demonstra acesso ao conteúdo por rolagem. Não há prova de aula Android em fonte normal nesta rodada, e o dump da aula não foi capturado por falha de idle da animação.

**Revisão real, fonte 2.0.** Rota `radiantapp://quiz?mode=review&lessonIds=lesson-1`. A medalha do átomo aparece sem Pixel; régua de três estrelas, título “Fundamentos de Radiologia” em duas linhas, frase “Perfeito. Nenhum erro nesta lição.”, subtítulo “Revisão concluída” e `+18 XP` são legíveis. A captura inferior auxiliar mostra “3 de 3 corretas”, “1 de 8 etapas”, mensagem da meta e “Continuar” integralmente após rolar. SHA da auxiliar: `83fcb52f01948bd526553e008e2b5dacadc37076d0de85a3c235f99753fc47b8` (180122 bytes); ela é suporte local SDD, distinto dos cinco artefatos versionados indexados.

O XML máximo confirma título, régua acessível “3 de 3 estrelas”, subtítulo, XP e CTA clicável. Seus bounds dos textos abaixo do viewport são recortados/invertidos; não os trato como prova visual de corte de glifos ou como validação de leitor de tela. A captura inferior é a prova de que esses textos se tornam visíveis ao rolar.

**Revisão real, fonte 1.0.** Nova revisão de três perguntas segundo o executor, após cold launch necessário para a mudança de escala. Título, frase, subtítulo, `+18 XP`, “3 de 3 corretas”, “1 de 8 etapas”, mensagem da meta e CTA estão legíveis no PNG normal, sem Pixel. Isso não é prova Android de troca dinâmica com o mesmo Summary aberto, nem de deduplicação de prêmio: `+18 XP` é o valor observado na conclusão ordinária.

## Encerramento e limites do aceite

Comparei o baseline de `native-settings-before-after.json` ao cleanup final: `font_scale=null`, `transition_animation_scale=1.0`, `window_animation_scale=1.0`, `animator_duration_scale=null`, exatamente, preservando ausência como ausência. O relatório registra force-stop do app com code0, `emu kill` code0/OK e `adb devices` vazio. O `controllerCleanup` de `native-state.json` registra sessão Metro69783 encerrada com exit0, porta8081 sem listener, nenhum simulador iOS booted e nenhum Android conectado. Confirmei localmente a ausência de listener8081; não repeti comandos nativos nem atribuí a mim a medição anterior de adb/settings. O número69783 é o identificador da sessão exec, não uma prova de PID.

**Android scoped PASS / APPROVED.** Mantidos explicitamente NOT_TESTED: aula Android normal; zero estrelas; reduzir movimento; FPS, timing, sensação e once-only nativos; fala audível do leitor de tela; aparelho físico; segundo dia/revisão naturalmente devida; persistência de economia/nuvem. As imagens estáticas não provam animação sem prêmio duplicado, persistência ou produção. O gatilho iOS large→AX5 foi resolvido no parecer R5 e não foi reavaliado aqui.

O conjunto R4+R5+R6 permite ao controlador encerrar os gates de revisão de código e destas provas nativas de T05 **com esses limites explícitos**. Loop final, documentação operacional, commit/CI e qualquer aceite mais amplo permanecem responsabilidade do controlador; nenhuma autorização de merge, build, EAS, OTA, loja, segundo dia ou release decorre deste parecer.


---

Origem: task-7-review-r7-fixture.md; SHA256 `7e04820867ffb2c96a40764604927c105872a19eee3d700b9d3f8af1b0cb99c5`.

# Task 7 / T05 — revisão independente R7, compatibilidade da fixture

**Spec do delta: PASS. Qualidade do delta: APPROVED.** Sem novo achado P1/P2. O patch restaura a montagem do consumidor de teste sem enfraquecer a guarda de autorização. Aprovação limitada ao fix3, antes do segundo gate configurado; não é resultado desse gate nem novo aceite nativo.

Revisão em 27/10/2026 America/Bahia, baseada nos registros de 28/10 UTC. Li `task7-fix3-scope-ruling.md`, `task7-fix3-freeze.json`, o diff integral do único teste contra HEAD e os adendos/evidências da rodada. Não reavaliei produto ou os pareceres R4/R5/R6. Única escrita própria: este relatório SDD; sem testes, UI/nativo, Loop, agentes ou escrita Git.

## Delta e guardas preservadas

`radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx:59` acrescenta exatamente uma linha, `...jest.requireActual('../../../ui/motion')`, antes dos overrides existentes. Conferência byte a byte: retirar essa única linha do arquivo atual produz exatamente o arquivo de HEAD. SHA anterior `58a2cfeeadb45a62ffe4aabf736ca86d7a98380d7f55e5d0aa7b2e79ac57e97c`; final `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28`, ambos iguais ao freeze fix3.

O spread conserva os exports reais que o Summary agora consome, incluindo os omitidos pelo mock antigo. Os overrides posteriores continuam prevalecendo; não foram criados novos fakes, mocks de serviços, fallback de produto ou assertions para espelhar o harness. É um ajuste local suficiente, coerente com mock parcial, sem ampliar o escopo para uma refatoração global de mocks.

Li as seis guardas existentes. `JourneyProgressService` continua real; o caso de deep link espera o resultado renderizado antes de inspecionar o estado persistido e exige ausência do nó bloqueado e de `reward_awarded`. Permanecem também recusa direta do serviço, checkpoint bloqueado, link antigo sem conclusão, aceitação do nó legitimamente destravado e aceitação da revisão. Todas as assertions, fixtures de resultado, overrides e sincronização são bytes idênticos ao HEAD. Este delta não altera primeira resposta, XP ou persistência de produto, nem acrescenta prova nova dessas regras; as aprovações anteriores permanecem com seus limites.

## Evidência conferida, sem reexecução

Os JSONs de Jest registram o mesmo caso falho no RED e na reversão da fixture: **1 FAIL / 5 PASS**, erro de consulta em componente desmontado antes das assertions de persistência. O GREEN final registra **6/6 PASS**, zero runtime-error suites e nenhum testExecError; log final Node20.20.2, 8.454s, exit0, com SHA do teste restaurado. Fases não somadas. Typecheck e ESLint focais têm exit0; lint mantém um aviso preexistente de `router` sem uso. Executei apenas `git diff --check` focal nesta revisão: sem erro.

O console `getCardState is not a function` permanece no GREEN. Confirmei em HEAD tanto a chamada do player quanto o mock preexistente que só exporta `getTrackedLessonIds/getDueLessons`; o delta não o acrescenta ou silencia. Sua presença no verde não elimina a limitação do fallback da fixture, mas não impede as assertions de autorização efetivamente executadas. Não se inferiu regressão de produto desse console.

`mutations.json.fixRound3FixtureCompatibility` classifica corretamente a reversão como **compatibilidade do harness, excluída das mutações de produto**. Todos os campos anteriores de mutations permanecem semanticamente idênticos. Os prefixos integrais de report/audit/red/green coincidem com os backups anteriores ao append.

Recalculei **15/15** caminhos nominais originais de freeze3: intactos, inclusive ausência da story. Também conferi os artefatos indexados pelos relatórios nativos finais: **11/11 iOS e 5/5 Android** mantêm seus hashes. Esta é conferência de integridade, sem repetir inspeção visual ou aprovação nativa. O primeiro cálculo auxiliar de iOS usou um prefixo duplicado; corrigi a resolução pelos caminhos já completos no relatório e todos conferem.

O ruling documenta o run original substituído **13/15, sem sucesso**, e o writer substituto `run-1793152438847-57dea062` com STEP_STARTED antes da escrita, 61 caminhos e nenhuma alteração de política. Não auditei nem operei a máquina de estados Loop nesta revisão.

**Spec PASS / Quality APPROVED para o fix3.** O controlador pode seguir ao segundo gate configurado justificado pela falha real corrigida. Seu resultado integral, fechamento do writer e demais gates continuam pendentes; nenhum sucesso de validação integral, CI, merge ou release é reivindicado aqui.
