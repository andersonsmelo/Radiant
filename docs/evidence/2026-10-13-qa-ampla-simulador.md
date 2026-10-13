# QA amplo do Radiant — 2026-10-13

**Resultado funcional local: o estudo principal passou nos cenários executados, mas a revisão direta apresentou um defeito bloqueante. A auditoria não aprova uma distribuição.** A matriz separa falha do produto, falha de automação e pré-requisito ausente.

Branch `codex/radiant-study-improvements`, HEAD inicial `757d711`, código do app até `c9169ee`. Run `run-1791911865200-18814983`, sessão `brain-session-1791911687601-beca3183`. Somente documentação versionada foi alterada; os ajustes de roteiros usados na investigação são locais.

## O que funcionou

| Cenário | Evidência nativa | Resultado |
| --- | --- | --- |
| Boot, welcome dispensado e Home | boot-to-home, 29 s JUnit | PASS |
| Duas lições e Perfil | learning-critical-path, 131 s | PASS |
| Persistência de progresso após relaunch | offline-relaunch, 102 s | PASS; modo avião do simulador não comprova isolamento de rede |
| Conquista bloqueada, coleta ausente | reward-locked, 69 s | PASS |
| Sete lições → coleta → 8/8 | reward-unlock, 370 s | PASS, sem deep link para coletar |
| Retomar explicação e pergunta no passo correto | qa-resume, 83 s | PASS |
| Rotas inexistentes de lição/conquista/checkpoint e revisão vazia | qa-invalid-and-empty, 98 s | PASS, XP/progresso/vidas preservados |
| Quiz legado com três respostas corretas e retorno à jornada | qa-legacy-quiz-v3, 137 s | PASS; rótulo acessível completo |
| Cinco erros 5→0 e recarga | comandos do qa-five-errors-v2 + qa-five-errors-tail, 3 s | Comportamento confirmado; o roteiro completo v2 manteve FAIL na checagem final de centralização |
| Retomada interna depois de relaunch | qa-student-checkpoint-active-resume, 81 s | PASS no modo active interno |
| Conclusão/relaunch sem reaplicar XP | qa-student-checkpoint-no-duplicate-effect, 98 s | PASS no modo active interno |
| Retomada no SE com texto AX5 | qa-student-checkpoint-short-viewport, 42 s | PASS; categoria nativa confirmada e restaurada para large |
| Perfil → assinatura → fechar | snapshots nativos seq. 21/26 | PASS para navegação e carregamento de dois planos; compra não executada |
| Sons e Vibração, desligar e relançar | snapshots seq. 28/29 + armazenamento depois do relaunch | PASS para controle e persistência; percepção sonora/vibração física não medida |

Tempos são do JUnit/Maestro, incluindo esperas de automação; não representam latência do app. Os três roteiros internos são derivados locais dos versionados, com ação de MC/posição de CTA atuais; isso não encerra o gate estatístico H3.

## Defeitos e lacunas prioritárias

### QA-06 — P1: revisão direta ilegível e sem classificação da resposta

Reprodução: completar L1 no percurso normal; com o app encerrado, preparar **somente** `cards.lesson-1.nextReviewAt` como devido no SE sintético; abrir `/review`; iniciar a revisão; tocar `Mostrar resposta`. O cartão ficou branco, com pergunta e opções ilegíveis/sobrepostas. A ação não manteve `Acertei` disponível, inclusive no controle com a tela parada. **A revisão não foi concluída.**

Evidência: `qa-review-stationary-tap` PASS (16 s) confirmou início; `qa-review-reveal-stationary` FAIL (25 s) não encontrou classificação. `review-standard-telemetry.json`: 1 `review_start`, 0 `review_item`, 0 `review_complete`, 0 `rating_prompt_*`. `review-native-bounds.json` mostra opções em y466–537 e botão em y462–518, sobrepostos. A captura `qa-standard-review-finish/.../step-006-scrollUntilVisible-Acertei.png` mostra o cartão branco e o botão de revelar.

Código: `ReviewCard.tsx` usa `SurfaceCard variant="elevated"`, que resolve para `#FFFFFF`, e texto `galaxyColors.textPrimary` também `#FFFFFF`. O `flex: 1` do conteúdo está dentro do wrapper interno da superfície, sem altura definida. O efeito que zera `revealed` depende do objeto inteiro `enterAnim`; `useCardEnter` retorna um objeto novo. Essa dependência é **causa provável** da resposta que não permanece aberta; não houve patch nem prova causal por alteração nesta auditoria. O teste unitário usa um objeto de animação estável e não reproduz essa identidade.

A rota existe além do deep link: os callbacks de revisão da folha de vidas em `LessonFlowScreen` e `CheckpointScreen` navegam para `/review`, assim como a retomada interna. A abertura do callback da folha de vidas não foi executada neste caso; o destino foi testado diretamente. Próxima correção: paleta Galaxy, layout do conteúdo e dependências estáveis; repetir a revisão completa, incluindo recarga e XP.

### QA-07 — P2: marco de primeiro valor ausente após a L1 normal

A L1 foi concluída com 1/8 e agenda de revisão criada, mas o armazenamento continha 0 `first_value_moment_reached`; `firstQuizAt` e `firstReviewAt` ficaram null. A busca de chamadores encontra `OnboardingService.markAction` somente em `QuizScreen`, ausente de `LessonFlowScreen` e `ReviewScreen`. O quiz legado é um percurso distinto do estudo normal.

`RatingPromptService` exige esse marco; `PaywallService` também o consulta. O impacto sobre esses gates é **inferência do código**, não uma chamada observada ao SDK. A revisão bloqueada não chegou ao chamador do pedido de avaliação: nenhum evento de elegibilidade, bloqueio ou exibição foi emitido. Conectar os percursos relevantes ao marco e validar a ordem antes de testar o diálogo nativo; não reintroduzir o pedido no quiz nem injetar telemetria para esconder a lacuna.

### QA-08 — P2: crescimento de memória e telas retidas no cenário Debug

Três grafos do mesmo PID 2212, retornando à Home: footprint **291.1M → 442.9M → 553.0M** após aquecimento/dez/vinte ciclos completos. Aumento de cerca de 90%. Os nove mallocs sem raiz permaneceram iguais (4.720 bytes); **esse resultado não significa ausência de retenção**.

`RNSScreenView`: 6 → 28 → 48; `RCTViewComponentView`: 400 → 1.863 → 3.193. Trace trees de objetos novos mostram caminhos via registry de componentes, Hermes e worklets. O crescimento de telas é compatível com acúmulo de navegação, com `router.replace('/(tabs)')` como candidato; o estado do navegador e uma correção causal não foram demonstrados. A coleta usa deep links/Maestro em Debug; repetir pelo CTA e em Release/aparelho após reconciliar a configuração. [Medição e ownership](2026-10-13-qa-memoria-simulador.md).

### QA-01 — P2: roteiros versionados não acompanham a interface

Bateria original, sem alterações: **10 executados, 5 PASS / 5 FAIL**. Os cinco PASS são os cinco primeiros da tabela acima. Falhas:

| Roteiro original | JUnit | Causa observada |
| --- | --- | --- |
| first-run | FAIL, 32 s | Folha do dev client cobriu Welcome; guard antigo não fechou CONNECTED TO |
| radiant-1-4-primeira-execucao | FAIL, 80 s | Busca Continuar na MC, cuja ação atual é Conferir resposta |
| radiant-1-4-vidas-esgotadas | FAIL, 72 s | Mesmo consumidor antigo da ação de MC |
| student-checkpoint-performance-baseline | FAIL, 57 s | Rolagem extra tira o CTA atual do header da tela |
| store-capture | FAIL, 123 s | Premissa antiga de CTA fixo; roteiro também tem ação de MC antiga |

Na reprodução atualizada da primeira execução, welcome, L1, resumo, 1/8 e L1 concluída avançaram; o último assert `Revisar ... Bloqueado` permaneceu obsoleto: o produto aprovado mostra `Disponível em DD/MM/AAAA às HH:MM` (item 27). O roteiro completo v3 segue FAIL, registrado em `production-seeds-results.json`.

Os testes suplementares também tiveram erros próprios: valores visuais consultados sem o prefixo acessível `Respostas corretas:`, comando launchApp nulo, centralização impossível nas bordas e toque logo após rolagem. Permanecem nos artefatos, com reexecuções separadas; não são defeitos do produto nem foram convertidos em PASS retroativamente. Atualizar os roteiros em tarefa própria, preservar asserções de comportamento e executar os originais mantidos.

### QA-09 — P2: metadados nativos locais divergentes

`native-version-reconciliation.json` confirma wrapper compilado e instalado como **1.3.1 (3)**, com SHA-256 idêntico do executável e da imagem Radiant.debug.dylib (`0f14aeeaf0c87466ea5e834d8f39e205577c0a9c021187f4fc842b92d8943096`). `app.json` declara **1.4.0**, ios.buildNumber 3; o número 12 da distribuição é um estado externo distinto. O projeto iOS gerado localmente está fora do versionamento e não foi regenerado nesta auditoria. O JS servido é do checkout c9169ee, mas a configuração nativa não representa automaticamente a versão de distribuição. Reconciliar geração, entitlements e metadados antes de QA de Release/StoreKit/CloudKit; preservar personalizações locais.

### Ambiente e capacidades

- **QA-02 / build local:** primeira compilação parou no upload automático de símbolos do Sentry, por organização ausente. Retry Debug passou em 122.992 ms com `SENTRY_DISABLE_AUTO_UPLOAD=true` apenas na invocação. 770 warnings na compilação inicial versus 292 no retry incremental cobrem conjuntos diferentes; essa diferença não demonstra correção. Não houve upload de símbolos.
- **QA-03 / integração:** GET público `/health` e `/ready` retornou HTTP 502 em 2026-10-13; registro `api-public-readonly.json`. Sync remoto desligado no perfil medido; os resultados de estudo são locais.
- **QA-04 / App Intents:** nenhum `AppIntent`, `AppShortcutsProvider` ou `AppEntity` próprio no código versionado. Build log: `Metadata extraction skipped, no AppIntents.framework dependency found`. Ações próprias de estudo por Siri/Atalhos não estão implementadas; deep links têm evidência separada.
- **QA-05 / controlador:** snapshot semântico MCP retornou um único elemento após relaunch enquanto a PNG mostrava Home. Maestro conduziu os testes seguintes. Capturas nativas e árvores de falha foram mantidas.
- Assinatura exibiu `$2.99` / `$22.99` no contexto de loja do simulador. Preços brasileiros, transações, cancelamento, restauração e Ask to Buy não foram remedidos. Backup no iCloud mostrou indisponibilidade nesta configuração; restauração autenticada não executada.

## Ambiente, rastreabilidade e limites

Workspace `radiant-app/ios/Radiant.xcworkspace`, scheme Radiant, Debug; Node 20.20.2, Java 17, Maestro 2.7.0, iOS 26.5. SE `AB503A5A-0941-41C5-8CFC-D714D532855E`, 375×667 pt, dados sintéticos. `clearState` somente nele. iPhone 17 `0A1B5AAA-A517-484B-A386-0F48D3B229A1` preservado.

Perfis separados, servidores reiniciados com cache limpo: development/off; development/active com instrumentação; production-config/off em Debug. Beta gate false, paywall true, remote sync false, dotenv desabilitado. `__DEV__` permanece true no terceiro perfil; não comprova as restrições de Release.

Artefatos locais excluídos: `radiant-app/.maestro/artifacts/qa-2026-10-13/`. Incluem JUnit/XML, JSON de resultados, PNGs, hierarquias e logs. `native-profile-snapshots.json` preserva os controles observados. A fixture grava apenas a data do cartão, com hashes antes/depois; relógio e telemetria não foram injetados. CDP somente de leitura confirmou cartão devido, três perguntas e relógio real; também descartou a hipótese de rejeição de ISO com seis casas decimais.

Gates abertos: segundo dia com **24 h reais** e estado preservado; diálogo nativo de avaliação (bloqueado pela revisão incompleta/pré-requisitos); aparelho físico; Android/TalkBack; VoiceOver audível; StoreKit/CloudKit no contexto autenticado; Reduce Motion nativo; Release sem Metro; desempenho estatístico; binário distribuído. O YAML rating-prompt original continua na rota legada /quiz; os três roteiros active originais não foram executados literalmente nesta bateria, embora seus derivados tenham passado.

## Memória e gate final

[Relatório de memória](2026-10-13-qa-memoria-simulador.md) e [matriz funcional](2026-10-13-qa-matriz-funcional.csv). Três memgraphs analisados, mesmos nove leaks/4.720 bytes, crescimento de footprint e telas retidas registrado. O processo foi encerrado e o SE desligado depois dos vinte ciclos. Validação final **VALIDATION_PASSED**, 14/14, ciclo único, de 22:51:01 a 22:53:17 UTC. `app-quality` íntegro (68.090 ms), `app-test --runInBand --no-cache` (57.746 ms), API, conteúdo, documentos e links do cérebro aprovados. Node 20 nos validadores do app/API, dotenv desabilitado/CI=1, Node 24 no Loop. Nenhum E2E ou app de teste rodando durante esse gate.

IDs: app-quality `evidence-e676e9b9-c84f-4115-9770-ba492e71c2ec`; app-test `evidence-6a919cc8-9ea7-481e-84fa-899aa8cd94c8`. `loop-validation.json` / `validation-summary.json` guardam os 14 resultados, comandos e hashes. A CLI conserva somente prévias curtas de saída; contagens de testes do diagnóstico anterior não foram copiadas como medição desta auditoria. Os 63 registros da matriz incluem pré-requisitos, tentativas e falhas de definição, além dos cenários aprovados; não são 63 testes independentes aprovados.

O gate de repositório passou; revisão, retenção, integração do primeiro valor e metadados nativos permanecem com correção/investigação aberta. Nenhum código do app, roteiro versionado ou configuração de distribuição foi modificado.
