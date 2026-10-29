# T09 Perfil — pareceres independentes

## Código R1 — 29/10/2026

# T09 Perfil — revisão independente R1

29/10/2026. **Spec: PASS para o contrato de código do brief-r2. Qualidade: APPROVED.**

**Não encontrei achados materiais P1/P2 no snapshot revisado.** Este parecer libera a próxima etapa de prova nativa pelo controlador; não constitui aceite nativo, G5, validação Loop final ou autorização de release. A execução anterior interrompida não foi tomada como aprovação: o parecer foi concluído nesta retomada.

## Identidade e escopo

- Root: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
- BASE_TASK e HEAD medidos: `a72ddf246a85ecc5cc951ef340cd75632ab4d1dc`; branch `claude/trilha-medalhao-design`.
- Brief-r2 SHA-256: `79888c19e8ecdbd8655a1fd1bbbea518ac40ad38558249e1f4a0128ae921ff9e`.
- Manifesto SHA-256: `7a70c2c2e5576d74bbee729efc1d36c7c57de1e326fefdf753f944ec2ca6fc89`.
- Diff SHA-256: `e4ffd10708a666bf621edb9c69fa5ff77eb9c9afda6c9aa89c18d55328271fb4`.
- Comparei os 14 arquivos vivos com `snapshot-r1/files/` e cada entrada de `manifest.json`: todos iguais. Os seis arquivos novos constam do diff integral, contra `/dev/null`; não foram omitidos da revisão.
- Conferi também `final-freeze.json` (`880c0b94ae5aa4d756b7a8f24b565687e69eb4fefc67af41530422a19516d13a`) e `final-files.sha256` (`a514c424ca0918444957993e32a483689d1033faeb6aa484816fb091ea6e82b7`).

Li brief-r2, implementer-r1, contract-advisor, inventário subordinado ao r2, snapshot, estado canônico e os produtores/consumidores relevantes. Minha única escrita é este relatório local excluído. Não alterei produto/testes/docs canônicos, não rodei suítes repetidas, não abri Loop/sessão/escritor, não usei nativo, não fiz build/instalação/commit/push nem criei subagentes. Writer `run-1793270590053-a44fc62a` permanece exclusivamente do controlador.

## Conformidade verificada diretamente

1. **Composição e retirada das telas antigas.** `ProfileScreen.tsx:96-110` monta identidade, MedalShelf, StreakWeek, TodayGoals e XP total ao fim, numa única ScrollView com folga inferior. MissionsScreen e ProgressScreen deixam de ser importados/montados e permanecem intactos. O cabeçalho conserva identidade local e a engrenagem com destino `/settings`, sem métricas duplicadas. A retirada das leituras antigas não retira a inicialização obrigatória do catálogo: `src/app/_layout.tsx` já aguarda `LessonCatalogService.bootstrap()` na partida.
2. **Efeitos retirados e shadow.** Conferi os corpos reais das duas telas: saem countdown/refill de apresentação, leituras duplicadas, estatísticas antigas, `screen_view(progress)` e suas chamadas `useShadowCheckpoint`. Não encontrei concessão de XP, desconto de vidas ou active restore dependente dessa montagem. A expressão “inertes” precisa manter seu alcance: em preview o hook shadow de fato pode gravar observações no store shadow; produção resolve `off` e essas superfícies não usam `useActiveCheckpoint`. A retirada deixa de produzir essas observações e o antigo screen_view, consequência compatível com a substituição autorizada; o contrato de integração residual só verifica os arquivos existentes e não prova que continuem alcançáveis pelo Perfil. Não contei esse contrato como prova de navegação ativa.
3. **Currículo → unidade → medalha.** `ProfileScreen.tsx:25-32,69,101` usa a unidade que contém o recommendedNodeId fornecido pelo currículo, com fallback do segmento aberto e última unidade concluída no percurso encerrado. Conferi como JourneyCurriculumService produz segmentos/recomendação e conserva conclusões de trilhas bloqueadas. `MedalShelf.tsx:20,28-34` filtra lessons e promove a ouro somente completed; available/active/resumable/due-review/locked permanecem silhuetas sem nova interpretação de bloqueio pedagógico. `resolveNodeTheme` recebe a unidade e preserva a exceção do nó. JourneyMedal sem onPress é imagem, não botão; pulsing=false não cria anel pulsante. O laço real de ilustração já pausa por foco/redução de movimento em `ui/motion.ts`.
4. **Recordes e ausência.** JourneyStarsService calcula o máximo entre tentativas retidas por lessonId. `MedalShelf.tsx:29-37` conserva 0 real e undefined distinto de 0, não expõe estrelas como conquista de aula incompleta e mantém ouro comprovado quando estrelas não estão disponíveis. Carregamento e indisponibilidade de estrelas têm mensagens diferentes.
5. **Semana e restauração.** GamificationService fornece apenas agregado e lastActiveDate; default1/null e absorbBackup por máximo foram conferidos no produtor. `StreakWeek.tsx` valida chave de calendário local, rejeita dia impossível e faz segunda–domingo por componentes locais. A prioridade de future impede positivo futuro. A única igualdade positiva é com lastActiveDate válida da própria semana; não há reconstrução pelo contador nem leitura de Attempts para esse calendário. Contador nominal uniforme e anúncio “Contador de sequência” conservam default/restaurado sem convertê-los em datas. Desconhecido é visível (“?”), tem anúncio próprio, legenda explícita e não vira falta; futuro é neutro e hoje recebe anel independente. Não há promessa de meia-noite nem nova regra de continuidade/expiração.
6. **Metas e pendências.** `TodayGoals.tsx:23-42,68-69` usa os aliases existentes com ??, preserva zero, rejeita valores não finitos/negativos e alvo não positivo, conserva contagem textual e limita só a barra visual de 6 pt. DueCount é linha de pendências sem target/progresso/conclusão inventados. XP total é lido de Gamification uma única vez na composição, validado, e não alimenta a meta diária.
7. **Única entrada de edição e ciclo de foco.** `TodayGoals.tsx:43-60` conserva linha expansível e quatro opções do catálogo real. `ProfileScreen.tsx:75-90` só publica o retorno bem-sucedido de setTier, mantém snapshot anterior na rejeição e libera retry; o ref bloqueia dois callbacks antes do render desabilitar controles. Leituras e continuadores de salvamento carregam geração; cleanup invalida publicação após blur/desmontagem e novo foco relê as fontes. Conferi setTier real: ele grava pelo produtor existente, não por storage paralelo. Essa proteção é visual; não cancela gravação já iniciada nem cria transação, limite já declarado pelo autor e fora do recorte de serviço desta entrega.
8. **Loading/falha por seção.** `Reading<T>` e os cinco reads independentes (`ProfileScreen.tsx:38-72`) impedem que uma rejeição derrube fatos carregados por outra fonte ou produza zero provisório. Não há calendário positivo durante loading. Rejeições mockadas demonstram o consumidor, e não inventam diagnóstico para os fallbacks engolidos nos produtores.
9. **Maestro e teto de copy.** Os dois YAMLs preservam `^Perfil(, tab.*)?$` e trocam a âncora removida por Medalhas, existente mesmo durante leitura. O contrato exige a âncora nos dois e rejeita Desafios de hoje no store-capture. O único delta da baseline é eyebrow do cabeçalho 2→1; nenhum teto aumentou. `profile-copy-findings.json` identifica a inicial do avatar `.toUpperCase()` como a ocorrência remanescente, sem alteração da regra AST para acomodá-la.

## Evidência de validação auditada

Conferi todos os hashes de `evidence-hashes.json`, os resumos e as falhas relevantes nos logs. Não reexecutei suítes sobre os mesmos bytes sem hipótese nova. Os resultados abaixo são as execuções preservadas do implementador, não comandos executados pelo revisor:

| Evidência | Resultado conferido no log |
|---|---|
| `focal-final.log` | 5 suítes, 60/60, 8.165 s |
| `focal-cpu-final.log` | 5 suítes, 60/60, 39.716 s |
| `consumers-final.log` | 12 suítes, 163/163, 9.553 s; inclui progress-sync pelo filtro progress |
| `contracts-final-r2.log` | 105/105; zero falhas |
| `typecheck-final.log`, `lint-final-r2.log` | logs vazios com hashes conferidos; exit0 reportado pelo implementador |

Os comandos/ambiente declarados são os cinco caminhos focais com Jest em banda única/no-cache, segunda execução sob taskpolicy, consumidores missions/progress/JourneyStars, contratos Maestro+copy, tsc e eslint, Node20.20.2/EXPO_NO_DOTENV=1. Os logs finais de Jest/contrato comprovam seus resultados; os arquivos vazios de tipos/lint, isoladamente, não codificam a linha de comando, versão de Node ou exit code. Não substituem o recibo da execução no histórico do controlador. Não tratei estes logs como quality completa ou validação Loop.

O conjunto de consumidores preservado é: ProgressSyncService, startupRestore, CloudKitPrivateAdapter, ProgressScreen.flow, LocalProgressAdapter, LearningAttemptsRepository, AccountSyncCard, MissionsScreen.flow, ICloudBackupCard, JourneyStarsService, LegalLinksCard e LearningStatsService. Não há base para reduzir esse resultado a duas suítes nem para promovê-lo à suíte global.

## Auditoria de causalidade

- `red-existing.log`: 14 falhas/1 controle passou, por composição nova ausente e métricas antigas presentes; não usei import ausente como prova comportamental.
- `red-components.log`: 29 falhas/8 passaram contra skeletons. As oito negativas que o skeleton satisfazia não foram contadas como vermelhas por essa execução.
- `red-header-scale.log` e `red-stars-loading.log` preservam os vermelhos dos ajustes adicionais. O primeiro vermelho de header por testID ausente sozinho seria insuficiente para demonstrar compressão; a mutação posterior de escala cobre o mecanismo de layout.
- Conferi `mutations-causal-final.json`: **22 aceitas e 3 descartadas**. Li as substituições em run-mutations.py/r2/r3 e mutate-maestro.py e as saídas de falha. As aceitas falham por asserção relacionada à mudança (quantidade/identidade dos dias, desconhecido, estado/estrelas, aliases/valores, publicação obsoleta, disposição em escala, chamada duplicada e âncoras), não por TypeError/ReferenceError/import ausente.
- As duas injeções parciais de data preservavam outra guarda e não reproduziam o defeito inteiro. A nova injeção da regra inteira produz exatamente um positivo indevido com dia impossível; fallback arbitrário para hoje derruba as sete negativas originais. A tentativa inicial de duplo envio caiu no TypeError do harness; r2 usa os dois fireEvent no mesmo lote e falha por Expected1/Received2. As três tentativas descartadas continuam fora da contagem aceita.
- Os scripts exigem âncora única e restauram bytes em finally; os hashes atuais conferem com o congelamento. Algumas mutações de MedalShelf/Profile foram executadas antes dos ajustes finais de loading/harness e registram outro hash-base: não são execuções dos 14 bytes finais. Comparei os predicados guardados com o código final; não encontrei mudança posterior que anulasse a causalidade desses casos. O verde focal final, por sua vez, cobre o congelamento entregue. Não afirmo “todas as mutações possíveis mortas” ou causalidade nativa.

## Requisitos não verificáveis neste parecer

- Pixels, Sora efetivamente rasterizada, medalhas/tema Skottie, corte/colisão, rolagem inteira, anel e “?” em iOS normal→AX5→normal/inicial máxima e Android1/2. Asserções de estrutura/props de Jest são evidência de código; não são medição de geometria nativa.
- Toque/interação nativa da seleção e retry, anúncios audíveis VoiceOver/TalkBack e FPS/desempenho real. Os avisos Skottie dos mocks não provam defeito do produto nem aparência correta.
- Calendário completo, faltas confirmadas, união de tentativas, significado ampliado de estudo/proteção e promessa de meia-noite continuam G5/dono. O recorte conservador implementado não aprova esses itens.
- Diagnóstico de erros que Gamification, LearningAttempts/Stars, dueCount ou DailyGoal engolem continua indisponível no consumidor. Currículo também pode omitir segmento ilegível. O código não pode distinguir esses fallbacks de dados legítimos; o autor delimitou isso corretamente.
- Nenhum E2E Maestro real, gate global/Loop final, produção, build, instalação, loja, EAS ou OTA foi comprovado por esta revisão. Reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` não foi usado pelo revisor.

Essas ausências de prova, previstas para depois do codePASS, não foram transformadas em defeitos de código. Próximo passo: controlador conduzir a inspeção nativa autorizada e seus gates; qualquer achado de produto volta ao autor. **Relatório congelado na devolução.**

## Nativo R2 — 29/10/2026

# T09 Perfil — revisão independente R2 de evidência nativa

29/10/2026. **Spec: BOUNDED. Qualidade: APPROVED_CORE_BOUNDED.**

O núcleo de apresentação está observado em iOS normal/AX5 e Android normal/inicial2.0, com os limites abaixo. **Não encontrei novo achado material P1/P2 atribuível à implementação T09 nas imagens e recibos revisados.** Android máximo ao vivo e retorno da mesma montagem **não recebem PASS**. Esta aprovação delimitada não encerra esses ensaios, não transforma erro do dev client em diagnóstico de código e não aprova G5 ou release. R1 de código permanece separado e congelado.

## Escopo e identidade auditados

Root `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch `claude/trilha-medalhao-design`, BASE_TASK/HEAD `a72ddf246a85ecc5cc951ef340cd75632ab4d1dc`.

Li `native-report.md`, `native-provenance.json`, `cleanup.json`, `native-DONE-freeze.json`, `native-versioning.json`, os eventos de `native-runtime.jsonl`, trechos do log Metro e o payload versionado `docs/evidence/2026-10-29-medalhao-t09-native.json`. Seu SHA-256 é **`cf7e0a817acd8bf2b0ffd95d07285b5271e4787a9d76495e0bc379ffcfa92a01`**, conferido. O campo verdict do payload ainda é `PENDING_INDEPENDENT_NATIVE_REVIEW`, compatível com ter sido produzido antes deste parecer; este relatório é a decisão R2, não uma mutação retroativa daquele recibo.

Conferi os oito hashes do freeze local; os 22 PNG locais e 29 arquivos UI/raw associados; os 20 PNG versionados por seu mapping; o conteúdo literal dos 29 UI/raw embutidos e do nativeReport contra os arquivos locais. Todos correspondem. Os 14 arquivos de produto continuam com os hashes da R1; policy, expo-env e cinco TTF Sora também correspondem à proveniência. Isso verifica identidade dos artefatos e preservação das fontes; não equivale à inspeção visual, que fiz separadamente abaixo.

Não foi coletado hash do payload JSbundle retornado pelo Metro. A cadeia disponível é root/cwd/Node/ambiente do Metro, log de bundle, clientes existentes, dados apresentados e fontes congeladas. Não afirmo vínculo forense do payload de rede com cada PNG nem família tipográfica provada apenas por aparência. O executor declarou clientes1.4.0(3), iOS E262D4C1-99BE-496B-8567-0291C14E6533/iOS26.5 e AVD radiant-entrada-api34/API34, serial5554 conferido; não houve build ou instalação neste ensaio.

## PNGs efetivamente vistos

Abri diretamente os **22 PNGs** da lista de proveniência usando visualização de imagem. Os grupos abaixo identificam os stems locais; as quatro renomeações versionadas não alteram a interpretação:

| Grupo visto | Stems locais |
|---|---|
| iOS normal e opções | ios-profile-normal-top; ios-profile-normal-bottom; ios-profile-goal-options-visible |
| iOS AX5 ao vivo | ios-profile-max-live-header; ios-profile-max-live-medals; ios-profile-max-live-week; ios-profile-max-live-legend-goals; ios-profile-max-live-goals-bottom |
| iOS retorno normal | ios-profile-normal-return-top; ios-profile-normal-return-bottom |
| iOS inicial AX5 separado | ios-profile-max-initial-header; ios-profile-max-initial-medals; ios-profile-max-initial-week; ios-profile-max-initial-goals-bottom |
| Android normal | android-profile-normal-top; android-profile-normal-bottom |
| Android inicial2.0 pronto | android-profile-max-initial-ready; android-profile-max-initial-week; android-profile-max-initial-goals-bottom |
| Android limites | android-profile-max-live-header; android-profile-normal-return-reentered; android-profile-normal-return-bottom |

Mapping conferido: versionado ios-profile-normal-bottom é o local goal-options-visible; versionado ios-profile-max-live-week é legend-goals; versionado android-profile-max-initial-header é ready; versionado android-profile-normal-return-top é reentered. Os locais ios normal-bottom original e max-live-week original são os dois suplementos sem PNG versionado próprio, mas com hashes e UI/raw referenciados no payload. Não tomei a captura transitória Android anterior ao ready como estante pronta. Nenhum nome contendo “profile” transformou a imagem da Home em prova de Perfil.

## Resultado visual por cenário

### iOS normal → AX5 → normal

As capturas complementares são consistentes com a sequência na mesma montagem descrita pelo executor. Vejo identidade local, engrenagem, uma medalha em ouro com ilustração de átomo e três estrelas, seis silhuetas, contador nominal1, calendário, legenda, meta, pendências e XP ao fim. Normal e retorno normal conservam composição e dados; não vejo lacunas geométricas residuais semelhantes às de Android.

Na série ao vivo AX5, o cabeçalho reflui para coluna e “Estudante” quebra em Estudan/te com glifos íntegros. Medalhas/estrelas não colidem com texto; a semana fica em duas linhas completas4+3, com letras, “?”, positivo e futuro visíveis. A quarta-feira é positiva; quinta/hoje tem “?” com anel, e os três dias futuros têm traço neutro. O agregado “Sequência registrada:1” permanece separado dessas marcas. A legenda inteira é legível por sobreposição das capturas week original e legend-goals. Hoje, Ganhe10XP,0de10, Revisões pendentes:0, Meta diária/Começar e138XP aparecem íntegros ao percorrer a série até o fim.

Cortes no início/fim do viewport e conteúdo passando atrás da barra durante rolagem não são, sozinhos, truncamento permanente: os trechos relevantes reaparecem inteiros em outras posições. Não observei sobreposição de medalhas/texto ou corte horizontal material no núcleo mostrado.

### iOS abertura inicial em AX5

A série separada confirma cabeçalho, estante pronta, semana4+3, metas e138XP. A soma das quatro imagens **não cobre inteiramente “Sem registro”**, as duas primeiras palavras da legenda: em medals elas ficam parcialmente junto ao limite inferior/barra e week já começa em “disponível”. Portanto esta série não recebe cobertura pixel integral da legenda, embora o mesmo texto inteiro esteja visível na série ao vivo. Essa é uma lacuna de captura preservada, não evidência suficiente de defeito de layout.

### Android normal e abertura inicial2.0

Normal mostra os mesmos tipos de fatos com os dados próprios deste cliente: uma medalha de ouro/três estrelas, seis silhuetas, contador1, positivo na terça27, hoje29 desconhecido com anel, futuros neutros, legenda,0de10,3pendências e54XP. Top e bottom se complementam, com conteúdo legível e final acessível por rolagem.

As capturas **ready**, week e goals-bottom mostram o Perfil pronto em inicial2.0. Identidade e engrenagem permanecem reconhecíveis, medalhas/estrelas desenhadas, dias4+3, anel e estados distintos, legenda integral, meta,3pendências, entrada de edição e54XP. Não vejo corte de letra ou colisão material nessas posições prontas. O PNG inicial transitório que ainda carregava as medalhas não é a prova usada nesta aprovação.

### Android ao vivo e retorno: não aprovados

`android-profile-max-live-header.png` mostra **Home**, botão Fazer revisão e toast truncado “Looks like you have co...”; não mostra Perfil máximo ao vivo. O XML/raw dessa tentativa não obteve idle. O relançamento separado em2.0 não conserta nem satisfaz esse ensaio. Os eventos preservam a alteração font_scale2.0 seguida de falha de observação na rota esperada, depois force-stop/relaunch separado.

O retorno font_scale1.0 também perdeu a rota, conforme relato/eventos. A reentrada pelo Perfil produz as duas imagens return: fonte normal, dados legíveis e conteúdo ainda alcançável, mas espaços verticais maiores no cabeçalho/entre seções do que no normal original. Assim, reentered e bottom **não provam retorno da mesma montagem nem restauração integral da geometria**. Não aprovei esses espaços como geometria correta de retorno.

O sintoma de perda da rota é concreto; sua causa não está diagnosticada neste conjunto. A presença do toast de dev client, sem mensagem completa/stack causal, não autoriza dizer que é apenas ferramenta nem atribuí-lo a um trecho da T09. As lacunas residuais também não foram isoladas entre recriação da Activity/runtime e layout do produto. Sem perda de conteúdo, colisão ou inacessibilidade demonstrada nessas duas imagens, não encontrei base para elevar o espaçamento isolado a P1/P2 de código; permanece limite explícito do gate. Um P1/P2 futuro reproduzido não está pré-aprovado por este parecer e deve voltar ao autor antes de novo aceite.

## Interação, semântica e limites

- A lista de meta diária foi aberta/rolada/fechada no iOS. Vejo as quatro opções reais Começar10/Ritmo20/Foco35/Desafio50 e XP total no PNG options-visible. Não houve seleção: **gravação, falha de gravação e retry não estão validados nativamente**. Android só mostra a entrada; não prova abertura das opções.
- Os rótulos UI/XML distinguem contador nominal, datas positivas e desconhecidas. Conferi quarta28 no iOS e terça27 no Android; as diferenças de XP138/54 e due0/3 são preservadas, não conciliadas por dado sintético. Screenshot sozinha não comprova a data por trás da inicial; os rótulos complementam essa leitura. Não há prova de fala audível VoiceOver/TalkBack.
- A semana observada é a última data registrada, sem faltas inferidas nem promessa de proteção/expiração. Histórico completo/união de tentativas/novo significado de estudo e G5 continuam separados. A revisão nativa não consome esse gate.
- Aluno novo real, falha real dos produtores, recorde0/undefined alternativo, restauração específica, segundo dia, leitor audível, FPS, dispositivo físico e produção não foram medidos. Os testes R1 desses estados não viram prova nativa retroativa.
- O conjunto demonstra aparência de medalhas/estrelas no runtime capturado; PNGs não medem fluidez ou todos os quadros das animações. Não reexecutei testes, E2E ou quality para preencher ausência de prova visual.

## Limpeza e preservação

O recibo congelado cleanup.json está **CLEAN** e contém: font_scaleAndroid1.0 lido; animações atuais1.0/1.0/null lidas e preservadas; app sem PID; reverse próprio removido/lista vazia; AVD encerrado; PIDs Metro21155/launchAVD22108 ausentes; porta8081sem listener; nenhum simulador bootado; ADB sem dispositivos. DaemonADB22919preexistente preservado.

A baseline Android atual1/1/null diverge do P2 histórico0/0/0: a medição atual prevalece e não foi “corrigida” para o histórico. iOSlarge foi restaurado por comando bem-sucedido segundo o recibo; **não houve leitura posterior ao shutdown**, de modo que não afirmo readback final inexistente. Esses são recibos da execução, não nova inspeção runtime feita pelo revisor. O reservado5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3 não recebeu ação minha.

Minha única escrita R2 é este arquivo local excluído. Nenhuma mudança em produto, docs versionados, runtime, Loop, fontes, política ou dependências; nenhum teste repetido, build, instalação, commit, push ou subagente. **Relatório congelado ao devolver.** Núcleo aprovado de forma delimitada; Androidlive/return, seleção/salvamento real de meta e demais limites acima permanecem sem PASS.

## Correção1 R3 — 29/10/2026

# T09 FIX1 — revisão independente R3, somente delta

29/10/2026. **Spec do FIX1: PASS. Qualidade do delta: APPROVED.**

**Sem novos achados materiais P1/P2 neste delta.** As três ocorrências do strict foram corrigidas sem mudança dos valores de estilo resolvidos, sem relaxar scanner/policy/baseline e sem alteração de comportamento. A equivalência mínima é suficiente para este escopo; **não exijo nova execução CPU ou nativa apenas para estas três substituições constantes**. A validação Loop final2 continua pendente do controlador e não foi executada por mim.

## Identidade

Root `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`; BASE_TASK `a72ddf246a85ecc5cc951ef340cd75632ab4d1dc`; snapshot-r2/final-freeze-r2.

O nome recebido “READMEfix1.md” corresponde ao arquivo efetivamente existente **fix1.md**, cujo hash esperado conferi: `635b15bb22783d768b7ba72f3e390336f4a3b04f659b4c9d1d54b3546a1fdf98`.

Conferi:

- Manifesto: `bd66b87e6681f13c9bbf7956945d406f136e1d53423de5a4aa5793c78abb8a7e`.
- Diff integral: `c88a27c3d2e5663fc1f288292bc63b878c7d80d478c01e175a3c332126739a2c`.
- Delta desde r1: `a1853ae06b34e6f430cd56f1a7a47f9851a610d42dbe6a65f791a7fa99a649a9`.
- Freeze r2: `2fc97d9fb50c8023ebcc52a6439be60698da8ab3452c91d5c19ada77d22548a5`.

Os 14 arquivos vivos correspondem aos arquivos copiados e aos hashes do manifesto r2. A comparação com freeze r1 tem **exatamente dois arquivos alterados e 12 hashes preservados**. Li o delta inteiro: StreakWeek muda apenas ring.padding; TodayGoals acrescenta radius ao import já existente de ui/styles e muda apenas os dois borderRadius. Não há alteração de teste, produtor, hooks, props dinâmicas, markup, copy, interação, estado ou dados. Tokens/scanner/policy não têm delta; a baseline de copy entre os 14 continua igual à R1.

## Decisão sobre as frações de tokens

Julguei as expressões, não apenas o resultado verde do scanner:

1. **StreakWeek.tsx:85 — padding: space.s2 / 4.** O token real `space.s2` vale12. O inset é uma subdivisão pequena de espaçamento, interna ao anel, e continua3pt. O anel já tem borda2 e circunferência dimensionada separadamente; trocar o inset para o menor token inteiro4 modificaria essa geometria observada. Dentro desta correção restrita, consumir a escala de espaço existente para conservar o inset é aceitável, sem criar um token global novo ou mudar o sistema.
2. **TodayGoals.tsx:68-69 — borderRadius: radius.rMd / 4.** O token real `radius.rMd` vale12, portanto ambos os raios continuam3pt. Track e fill têm altura fixa6pt:3 é precisamente sua meia altura, formando a cápsula coerente em ambos, sem mudar o clipping ou o progresso. Preservar esse raio é justificado pela geometria da barra, não pelo mero fato de a expressão escapar à detecção de literal.

Não há convenção prévia local de fracionamento demonstrada; **esta aprovação não declara tal convenção nem autoriza divisões arbitrárias em futuros componentes**. Os tokens são de categorias corretas (space para inset, radius para raio), os resultados coincidem com a geometria pequena existente e o contrato do delta exige preservá-la. Essa combinação basta aqui. Uma mudança futura de space.s2/radius.rMd ou da altura da barra exige reavaliar o componente; a aprovação não antecipa equivalência com tokens futuros.

## Equivalência e risco de regressão

Li o helper `fix1-measure-styles.cjs`: transpila módulos com TypeScript, lê os tokens reais de styles.ts e captura os objetos enviados a StyleSheet.create. Stubs de ReactNative/tema não executam componentes, hooks ou render. Os JSONs before/after têm o mesmo SHA-256 **`7e9dceaef2d01eb95f6328109e4dcf700dc19b3b30c23b8eb4349d58cca62506`** e comparei seus bytes: iguais.

Essa medição é estática. Cores stubadas/valores undefined omitidos na serialização e ausência de render impedem usá-la como prova universal de pixels. Porém o próprio delta não toca cores nem outras propriedades, e a inspeção independente dos tokens resolve **12/4=3** nos três lugares. O novo import não carrega um módulo novo: TodayGoals já importava space e typography do mesmo módulo. Não há dependência de fontScale, data, dispositivo ou ordem assíncrona nessas três expressões. Assim, inspeção do delta, aritmética dos tokens, igualdade capturada e preservação dos outros12hashes dão evidência suficiente de ausência de mudança de geometria por este FIX1.

**Decisão explícita de remedição:** não é necessária nova medição nativa/CPU exclusivamente para o FIX1. A prova nativa revisada em R2 continua sendo **do snapshot r1 anterior**, não uma captura ou execução do snapshot r2. A equivalência permite conservar suas conclusões delimitadas para este delta; não cria prova nativa dos novos bytes nem resolve Androidlive/return, lacuna inicialAX5 da legenda, salvamento real de meta, fala audível, FPS, dispositivo ou produção. O estado nativo global continua BOUNDED/APPROVED_CORE_BOUNDED, separado deste PASS de código.

## Evidência focal conferida

Conferi todos os hashes de `fix1-evidence-hashes.json`, inclusive diagnóstico vermelho, logs finais e helper/JSONs. Não repeti comandos de teste sobre bytes iguais sem hipótese nova.

| Evidência preservada do implementador/controlador | Resultado auditado |
|---|---|
| diagnosis-visual-qa-strict.log | Exatamente3regressões: StreakWeek padding3 e TodayGoals borderRadius3 em track/fill |
| fix1-visual-strict.log | 471arquivos;0regressões;41baselined;3exceções existentes; PASS |
| fix1-focal.log | 5suítes;60/60;9.152s; PASS |
| fix1-types.log / fix1-lint.log | Sem saída, hashes conferidos; exit0 registrado pelo autor |

O diagnóstico strict vermelho é causal para o requisito de tokens e foi sucedido pelo verde no delta mínimo; não depende de uma guarda nova espelhando a grafia da implementação. Os arquivos vazios de tipos/lint não são, isoladamente, recibo de exit code/ambiente; o registro de execução do autor os complementa, como na revisão anterior. O primeiro Loop foi informado como14/15, falha somente app-quality, com app-test PASS; não o transformei em falha de teste do app nem em validação concluída. O preview incompleto daquele validador não substitui o diagnóstico focal preservado. Final2 segue por executar/avaliar pelo controlador.

Minha única escrita é este relatório local excluído. Não modifiquei produto ou documentos versionados, não executei runtime/testes/Loop/build/instalação, não fiz commit/push e não criei subagentes. Relatórios R1 e R2 permanecem intactos como proveniência anterior ao FIX1. **Parecer R3 congelado ao devolver.**
