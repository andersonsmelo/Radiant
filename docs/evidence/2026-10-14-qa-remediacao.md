# Remediação dos achados de QA — 2026-10-14

Escopo: corrigir os defeitos locais medidos em [13/10](2026-10-13-qa-ampla-simulador.md), preservar regras de progresso/vidas e comprovar os fluxos no simulador descartável SE `AB503A5A-0941-41C5-8CFC-D714D532855E`. Checkout inicial `bb63212`, branch `codex/radiant-study-improvements`. Não houve publicação, integração à main, compra ou escrita em serviço externo.

## Correções implementadas

- **QA-06:** `ReviewCard` usa a superfície Galaxy, fluxo vertical sem `flex: 1` dentro de wrapper sem altura, espaçamento no conteúdo real e callbacks estáveis na dependência do efeito. A resposta permanece aberta até trocar de pergunta. A classificação bloqueia toques repetidos e cancela o timer ao desmontar. A tela ativa usa `ScrollView` com conteúdo natural (`flexGrow`) e identidade por pergunta/fase. O início da revisão fica antes dos blocos explicativos; texto ampliado empilha cabeçalho e classificação. Títulos/rótulos seguem o limite 2× já definido pelo projeto; explicações continuam sem teto.
- **QA-07:** a conclusão de lições legadas e atividades passa por `OnboardingService.markAction`. O tipo do nó decide entre aprendizado e revisão. A revisão direta grava seu marco antes de expor o resumo ao chamador de avaliação da loja. O serviço hidrata o armazenamento antes da ação, compartilha a leitura em curso e preserva a semântica de recarga explícita de `init()`. Se a leitura falha, não sobrescreve o registro com defaults. Nenhum evento foi injetado.
- **QA-08:** três ciclos reais, antes da mudança de navegação, deixaram quatro cópias de `(tabs)` na pilha (`nav-after-three.json`, consulta CDP somente leitura). Os retornos de lição, revisão, avaliação, conquista e quiz usam `dismissTo('/(tabs)')` para reutilizar a jornada existente. Depois de vinte ciclos, a pilha contém uma única Home; telas nativas permaneceram constantes (medição abaixo).
- **QA-01:** roteiros usam `Conferir resposta`, data de disponibilidade e CTA no header atual. O subflow trata também `CONNECTED TO`. O pedido de avaliação da loja percorre `/review` com fixture de cartão devido e três lançamentos reais, preservando a asserção do diálogo nativo. Os contratos foram atualizados para as pré-condições corretas.
- **QA-09:** checker de versão nativa e sincronização limitada aos dois campos do `Info.plist`, sem regenerar o projeto. Build e instalação confirmam **1.4.0 (3)**; SHA-256 da imagem nativa idêntico nos dois. Hashes do projeto e schemes foram preservados. O checker integra `ios:doctor`; seus testes integram `quality`.

## Evidências focadas

Artefatos locais: `radiant-app/.maestro/artifacts/qa-fix-2026-10-14/`.

- Cartão: vermelho **5 falhas/2 passes** com wrapper de animação novo em cada render; verde após corrigir efeito, superfície e timers. Uma tentativa intermediária de rerender descobriu que o helper removia o Provider; teste ajustado para manter a mesma árvore.
- Primeiro valor: vermelho **3 falhas/36 passes**; revisão pela jornada também vista falhando com `firstReviewAt: null`. Focado intermediário **52/52**, incluindo onboarding e RatingPromptService; a medição final de hidratação está descrita abaixo.
- Fluxos de tela: vermelho de retorno à Home registrado; verde **105/105** em cinco suítes.
- Contratos Maestro/versão nativa: **32/32**. Typecheck sem erros. Lint focado sem erros, com warning preexistente de dependência em `useReview`.
- Build Debug no Xcode 27: primeira tentativa reprovou pelos mínimos antigos de iOS em Pods. Repetição com `IPHONEOS_DEPLOYMENT_TARGET=15.1` e `SENTRY_DISABLE_AUTO_UPLOAD=true` passou. O ajuste é da invocação local; schemes/StoreKit não foram sobrescritos.
- Primeira revisão após corrigir o cartão: a resposta permaneceu aberta, mas a classificação ficou fora do viewport porque a tela ativa não rolava. Roteiro **FAIL** preservado; teste focado de contêiner também reprovou antes de acrescentar a rolagem. Captura `review-current.png` registra a sobreposição anterior.
- A revisão seguinte registrou resposta/XP e devolveu uma vida, mas o roteiro completo reprovou no título do resumo, que herdava a rolagem da sessão ativa. `ScrollView` separado por fase/pergunta resolve a continuidade indevida; teste de identidade visto falhando antes da mudança. A consulta paralela `maestro hierarchy` invalidou outra tentativa com `DeviceUnreachableException`; ela não mede o produto.
- A releitura do storage depois da revisão identificou hidratação ausente: `firstQuizAt` anterior desapareceu e o primeiro valor foi emitido duas vezes. Só Home legado, quiz e primeiro uso chamavam `init`; a jornada de usuário recorrente não o fazia. Testes de nova instância/hidratação e falha de leitura ficaram vermelhos **2/5**; a versão final focada passou **57/57** em seis suítes, incluindo os controles de recarga explícita existentes.
- O HUD do resumo também mantinha o XP anterior enquanto a linha da sessão confirmava +4. Teste de transição 80→84 visto falhando; o resumo agora relê o snapshot, com teste focado aprovado.

## Validações nativas e fechamento

Cinco roteiros anteriormente reprovados passaram nas execuções finais: primeira execução (43 s), L1 completa (89 s), vidas 5→0 (307 s), entrada na lição (36 s) e captura de loja (138 s). As falhas das tentativas anteriores permanecem nos JUnits, incluindo seletor incompleto de resultado e toque em nó coberto pela barra de abas.

Depois da correção de hidratação: L1 limpa passou novamente (85 s); revisão completa passou (105 s). Armazenamento depois de relançar preservou `startedAt`, `firstQuizAt` e `dismissedIntro`, registrou `firstReviewAt`, **1** primeiro valor, **1** revisão concluída e o bloqueio esperado `non_production_build`. Fixture alterou somente `cards.lesson-1.nextReviewAt`, com app parado, sem relógio falso ou telemetria injetada. A tentativa de abrir uma rota fria diretamente no dev client caiu no launcher; o roteiro explícito de launch/conexão resolveu essa pré-condição.

**AX5:** a revisão com classificação negativa chegou ao resumo. O roteiro completo manteve **FAIL** na última linha de resultado ainda fora do viewport (694 s); controle separado de resultado/retorno passou (157 s). Não converter esse JUnit em PASS nem certificar VoiceOver. As primeiras buscas de início/revelação também expiraram e permanecem nos artefatos. A ordem de ação, empilhamento e escala dos rótulos foram corrigidos a partir dessas capturas; corpo não foi reduzido. Categoria nativa confirmada e restaurada para `large` antes das medições seguintes.

**Pedido de avaliação:** o roteiro versionado agora alcança `/review` e não o quiz legado. Primeira execução manteve **FAIL** na asserção nativa: 9 aberturas reais, 1 primeiro valor, revisão concluída, mas `rating_prompt_blocked: non_production_build`. A verificação pública de precedência identificou `APP_ENV=development` vindo de `.env.local`, apesar do perfil solicitado. Nenhum arquivo de ambiente foi alterado/copiado. A projeção temporária isolada copia somente código/configuração públicos; as tentativas de resolver entrypoint/rotas foram diagnósticos de ambiente, não falhas do produto.

O roteiro nativo final **PASS (144 s)**, `rating-isolated-v3.xml`, confirmou
`Curtindo o app Radiant?`, recusou a avaliação e confirmou o resumo. Telemetria
read-back em `rating-isolated-events.json`: 12 aberturas reais, um primeiro valor,
`rating_prompt_eligible` e `rating_prompt_shown` com `build_channel=production`,
`trigger=review_complete`, `surface=review_summary`. A passagem positiva após
12 aberturas não prova o instante exato da terceira; controles de limiar são
unitários. A projeção copiou src/assets/components públicos e configurações,
com entrypoint temporário Expo Router; não copiou arquivos de ambiente. É
wrapper Debug com JS de produção, sem upload nem avaliação enviada.

### Memória após a correção de navegação

Mesmo PID **83262**, SE/iOS 26.5, Debug development/off, texto `large`, sem
sync remoto; dois ciclos de aquecimento e vinte ciclos completos L1→Home,
sem respostas/XP/vidas. Três memgraphs concluídos sem timeout; macros de
10+10 ciclos passaram. A consulta CDP somente leitura ocorreu **depois** da
última captura: `nav-after20.json` confirmou uma única `(tabs)` na pilha.

| Amostra | Footprint físico, unidade M do leaks | RNSScreenView | RCTViewComponentView | ViewShadowNodeProps | worklet objects | Leaks / bytes |
| --- | --- | --- | --- | --- | --- | --- |
| Aquecimento | 285,9 | 2 | 178 | 566 | 2.901 | 12 / 4.832 |
| Dez ciclos | 299,0 | 2 | 178 | 903 | 1.095 | 12 / 4.832 |
| Vinte ciclos | 309,5 | 2 | 178 | 430 | 1.867 | 12 / 4.832 |

Footprint cresceu **23,6 M (~8,3%)**, contra **261,9 M (~90%)** no diagnóstico
anterior; o valor final caiu de 553,0 M para 309,5 M. Contagens de telas e
componentes nativos ficaram estáveis. O estado do navegador e os grafos sustentam
a remoção do acúmulo de Home **neste cenário**. São runs Debug distintos; wrapper
anterior era 1.3.1 (3), atual 1.4.0 (3), sem mudança de dependência nativa.
A amostra antiga teve abertura parcial extra, conforme relatório histórico.
Não atribuir toda diferença de footprint a uma única chamada, nem afirmar
estabilização absoluta, zero leaks ou equivalência com iPhone/Release.

Os 12 leaks/4.832 bytes permaneceram constantes nas três capturas. O diagnóstico
anterior tinha 9/4.720 bytes; não foi demonstrada origem nem eliminação dos
mallocs pequenos. Artefatos: `memory/metrics.json`, `type-comparison.json`,
heap/summary/vmmap e hashes dos três grafos. Memgraph não certifica heap JS,
FPS, bateria ou outras rotas. App encerrado e SE desligado após a medição;
o simulador principal não foi alterado. Metro de teste encerrado.

### Gate final

`loop validate --run run-1791978395898-e847c951` retornou
**VALIDATION_PASSED, 14/14, ciclo 1**. App/API em Node 20, Loop em Node 24,
`EXPO_NO_DOTENV=1`/`CI=1`, sob caffeinate, após encerrar E2E/app/Metro e desligar
SE. `app-quality` íntegro inclui lint, tipos, contratos, Jest em banda única e
QA visual strict; `app-test` rodou separado em banda única, sem cache. Conteúdo,
API, documentos e links do cérebro aprovados. Não citar as contagens focadas
como tamanho da suíte inteira: a CLI guarda hashes e prévias truncadas.

| Validador | Evidência | Duração |
| --- | --- | --- |
| docs-contract | `evidence-f92e1a57-1c9a-4ca6-b4d0-0e4a011cd5b1` | 0.18 s |
| content-foundation | `evidence-448ba53f-52fd-4511-b0ba-797902075ad6` | 0.2 s |
| content-wave1 | `evidence-7f67b83f-6a69-4bd5-91d1-a9b8da5c7670` | 0.07 s |
| content-anchoring | `evidence-8d15ebbf-d10b-412d-a90e-d19d03472d99` | 0.12 s |
| content-anchoring-data | `evidence-9313a8d5-3ed3-498b-8028-0a5f0c603b10` | 0.04 s |
| content-no-verbatim | `evidence-f2cf7901-6ce2-43b9-81b6-03b172fff2fb` | 1.68 s |
| content-source-rights | `evidence-af010a54-227a-44f6-9623-cf876f55d7b9` | 0.11 s |
| content-python | `evidence-39e5e4b6-1435-4f84-8adf-bb9c8234b7e9` | 5.99 s |
| app-quality | `evidence-53076ae2-3874-4540-a43e-5f1905cfe982` | 86.84 s |
| app-test | `evidence-176e8c7f-13b0-4e8b-a253-e8b61a5f7836` | 72.24 s |
| api-lint | `evidence-cdc4bd45-ffd1-429a-8ca0-eab7a441c29f` | 1.12 s |
| api-typecheck | `evidence-31aae417-67d2-4d22-b23a-f92a2cae61da` | 2.02 s |
| api-test | `evidence-7b1b2a21-e4b6-4514-b6ca-ea7d62802633` | 1.28 s |
| brain-links | `evidence-b9985f68-5707-48ba-b8db-99be8fdd0f28` | 0.2 s |

Envelope local: `loop-validation.json`. Atualização documental posterior ao
resultado verificada por docs-contract e `git diff --check`; não houve segunda
validação integral, nem mudança de código após o gate.

## Limites e achados externos

API pública remensurada em 14/10: `/health` e `/ready` seguem HTTP 502. A consulta DNS retornou `143.95.208.237`; o runbook histórico registra VPS `69.6.222.219:22022`, cuja conexão SSH somente leitura foi recusada. Isso não identifica a origem atual atrás do endpoint; não houve alteração de DNS, reinício ou deploy. O app testado continua local-first, com URL vazia e sync remoto desligado. Compras/CloudKit autenticados, aparelho físico, Android, VoiceOver audível, 24 horas reais, Release sem Metro e distribuição permanecem nos gates próprios.

## Proveniência Loop

Sessão `brain-session-1791975409119-40678edb`. Runs `run-1791975548407-1c47f40b` e `run-1791975848642-4ce97b1a` encerrados sem validação: primeiro por omissão do contrato Maestro no escopo, depois pela descoberta de hidratação no serviço de onboarding durante o teste nativo. Alterações preservadas, sem rollback. Run de entrega `run-1791978395898-e847c951` inclui esses arquivos e herda a baseline das alterações anteriores. Os runs anteriores não são apresentados como validados ou concluídos.
