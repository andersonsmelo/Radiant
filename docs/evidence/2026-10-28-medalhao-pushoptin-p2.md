# Medalhão — correção prioritária P2 PushOptIn

Iniciada em28/10/2026 e revisada em29/10/2026, America/Bahia, por pedido literal de Anderson:
“prossiga em ordem de criticidade”. Esta entrega antecipa a correção delimitada
R3-SHARED-01 de T17 antes da T09. Não encerra T17 nem libera o layout global.

## Identidade, fonte e supervisão

Root `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`,
branch `claude/trilha-medalhao-design`, BASE_TASK
`1b987c1981667328b66beb958ac6a42eb3535d75`, árvore limpa na abertura.
Writer `run-1793236644594-9bfe9664`, aberto pelo embrulho e STEP_STARTED;
24 caminhos declarados. Brain `brain-session-1793236397671-d8a211dc` fechado
antes do writer, após consulta focal e recuperação de00Radiant pela CLI.
Produto ownership: PushOptInCard.tsx e seu teste; controlador cuida das docs.
Implementador novo e revisor independente, sem correção de produto pelo controlador.

## Problema e prioridade

O P2 foi observado no resultado iOS de T07: título fragmentado e corpo cortado
em fonte máxima, apesar de copy integral na árvore acessível. Os raw originais
normais/máximos foram preservados e conferidos pelo executor. Causa candidata
atual: lineHeight fixo30/20 e ausência de invalidação dos Text por fontScale.
A reprodução atual precede a alteração; não é declaração de causa validada.

Ordem desta frente: P2 de legibilidade/uso comprovado primeiro; outros
bloqueios funcionais reais antes de P3 de acabamento; depois sequência T09–T12
e fechamento T17 conforme dependências. Não converter dívida estética em P1,
nem atribuir o erro de linking do dev client ao produto sem diagnóstico.
G1–G8, conteúdo/G2/T14 e segundo dia continuam decisões/etapas separadas.

## Escopo e prova

Preservar copy, comportamento de opt-in/agendamento/permissões/telemetria,
PrimaryButton/AppButton/lábio, Sora, fingerprint e economia. Sem mudança de
serviço, catálogo, política ou componente Card compartilhado. TDD focal sobre
Text reais e estados/callbacks; Jest não rasteriza clipping nativo.

Consumidores encontrados: HomeScreen e ReviewScreen. LessonSummary não
renderiza PushOptInCard; o mock de Quiz é residual. Nenhum YAML vivo ou baseline
copy/visual referencia o componente. Reprodução de Review exige fila naturalmente
devida; não fabricar dados. Perfil local com kill switch já existente pode
abrir Home legada, com meta diária real; se usado, declarar que não é reteste
do resultado Review. Nenhum controle de consentimento será acionado nativamente.

## Estado da execução

Reprodução vermelha congelada: fila real Review vazia; usado perfil local Home
legada com meta real já cumprida e opt-in nulo. Fonte normal mostrou convite
inteiro. Após troca ao vivo large→AX5 e expansão de detalhes, o cartão apresentou
título fragmentado/corpo ampliado cortado em captura parcialmente no viewport.
A montagem inicial AX5 separada mostrou wrapping íntegro; não é o mesmo cenário.
O corte original de T07 em viewport de resultado permanece como evidência histórica
componente fonte inalterado. Não afirmar uma reprodução atual completa de Review.
Código liberado ao implementador depois da pausa nativa e dos hashes base.
Código corrigido e congelado, dois arquivos próprios: altura natural das linhas
e identidade dos três Text ligada a fontScale; Card/estado/handlers preservados,
copy integral e sem teto de escala. Recusa ganhou papel acessível de botão.
Verde:4 suítes/53 testes; CPU limitada:11/11; tipos/lint PASS. Nove mutações
específicas rejeitadas/restauradas. O vermelho causal foi refeito com spy RN
corrigido; o primeiro vermelho incidental não prova remount.
[Parecer R1](2026-10-28-medalhao-pushoptin-p2-review.md): Spec PASS/Qualidade
APPROVED, sem achado material. Snapshot manifesto
`1a95c48caf535dfb1fa93d83ec40d63e59b0bec7cc961cb9c40d6d95acdf6e2a`;
diff `5777b601c0e590e44e78256bd52da5b9cbc145f9dd2005892aee094c607499c7`.
[Prova executada dos testes](2026-10-28-medalhao-pushoptin-p2-tests.md).
Prova verde nativa liberada após esse gate; validação final e publicação pendentes. Sem build,
instalação, reset, clearState, relógio, storage fixture, política ou uso do
simulador reservado5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3.
`expo-env.d.ts` já existe na baseline, hash6fc02634…; será preservado inalterado.

## Verde nativo — medido em28/10; conferência retomada em29/10/2026

Consumidor Home legado, perfil local pelo kill switch já existente, com meta
real concluída e opt-in nulo. A fila real Review estava vazia; nenhum resultado
atual de revisão foi fabricado. O perfil existiu só no processo Metro encerrado.

No iOS, a troca large→AX5 atualizou os Text do próprio cartão antes do toque
em detalhes. O mesmo gatilho do vermelho foi repetido: capturas sobrepostas
cobrem título, corpo integral e ambos os controles. O título quebra dentro de
palavra, com glifos inteiros; o recorte no limite do viewport de uma captura
não representa clipping próprio do Text. O retorno AX5→large, na mesma
montagem, manteve o cartão inteiro. A abertura inicial AX5 foi medida separadamente.

No Android, cartão inteiro em fonte1.0 e em início2.0, por captura/XML.
Não foi produzido Android anterior ao conserto nem ensaio Android ao vivo;
o erro de linking anterior não foi declarado corrigido. Nove capturas copiadas
por hash com seus registros de UI constam no [JSON nativo](2026-10-28-medalhao-pushoptin-p2-native.json).

Nenhum controle de aceite/recusa/permissão foi acionado; os fluxos de serviço
foram preservados e têm prova automatizada. Fontes foram restauradas, apps,
E262, AVD e Metros próprios encerrados, reverse removido,8081 livre. Hashes
de produto/teste, expo-env e política iguais aos aprovados/à baseline.
O checkpoint anterior à final confirmou writer editing e0 ciclos; a medição
final de29/10 está registrada abaixo. O executor atingiu limite de uso após produzir relatório e
recibos; a revisão independente examina os artefatos, sem reabrir nativo.

Não se aprova o sistema global de fontes, Home inteira, resultado atual de
Review, fala audível, aparelho, FPS, produção, segundo dia ou gates do dono.

## Parecer nativo independente — 29/10/2026

**Spec BOUNDED / Qualidade APPROVED_CORE_BOUNDED.** R3-SHARED-01 foi corrigido
no componente e validado no consumidor Home legado local medido, sem achado
material remanescente. O revisor conferiu nove PNG/UI por hash, os complementos,
a integridade de fontes e a limpeza. [Parecer integral R2](2026-10-28-medalhao-pushoptin-p2-review.md).

O resultado atual Review permanece sem reteste nativo, Android ao vivo não foi
ensaiado e T17 global não recebeu aceite. Não se encerra a frente de acessibilidade
ou o plano inteiro por esta correção local. O P3 da cauda T06 permanece.
Validação final configurada aprovada em29/10:15/15 em um ciclo; nenhum teste nativo ativo.

## Validação final configurada — 29/10/2026

`loop validate --run run-1793236644594-9bfe9664` retornou
`VALIDATION_PASSED`, **15/15 PASS em um ciclo**, sem novo ensaio nativo.
Execução06:33:27–06:36:43 America/Bahia, sob caffeinate, Loop no Node24.14.1
e validadores do app no Node20.20.2; sem E2E/Metro ativo.
O gate do app executou `EXPO_NO_DOTENV=1 CI=1 npm run quality` e a suíte
completa `npm test -- --runInBand --no-cache`, conforme política inalterada.

| Validador | Resultado | Evidência | Hash da saída |
|---|---|---|---|
| docs-contract | PASS | `evidence-6a6f1543-6be3-4075-94e3-495e958e5eb6` | `c24f301954486862c75131340542891f15559ac2c86b640a64c87177d37c59dc` |
| content-foundation | PASS | `evidence-4f84ab67-3c35-4420-a9e1-efc447a2d602` | `cf529863f21a5e4431de1c8345738d3140e0381d5ddda74b25f7f24d5ca4cdf5` |
| content-wave1 | PASS | `evidence-b5c34e9f-f678-410b-a27f-4ceaf6bdbfff` | `620387aa9c2b3cf09cb358e1ffd58f41f51a957b57311adb23f9df7864031c2d` |
| content-production | PASS | `evidence-564ec9aa-5c51-4b3d-abc4-c4f2c101cd5b` | `9b336437882e1876e253669c04176003b07b88b89ce42f6d27b32c1274144d62` |
| content-anchoring | PASS | `evidence-5bb09f73-0a15-4b62-bdc1-f545fcf8d02d` | `75215d314e7913c0d006c948a4f0faf122348da4403bb24b09dc5ba4f5ab608f` |
| content-anchoring-data | PASS | `evidence-5e471464-bcb3-446d-b581-d385130ea8e5` | `c19faf27141e71c3bd75b2287baddd34bdbbc106fcf099f0654e34b271f569f5` |
| content-no-verbatim | PASS | `evidence-acc0183d-c15e-4bb3-b07b-ab14b3c28e78` | `3905418d5f71a7ba92e71b563eeab36c51c610588aecb9d09ada68a35b2190a3` |
| content-source-rights | PASS | `evidence-86cb2207-5eb0-45c3-8c41-4615d75c0003` | `4e42255b84ed5636ba3d92753c5fa8c9765f049c699f091b6b3fbe5fd7b570b0` |
| content-python | PASS | `evidence-5a763138-cede-43a0-b2b9-b5deb58dd277` | `aba263b19a83de4da29e4e48a074ec2ac254ce86d048c7778b682430dd596cab` |
| app-quality | PASS | `evidence-a0924a6c-a664-4fdb-a54f-fcef5dbeeb12` | `76d7b860113544f351bb7546a9bdb1f23cdedae980b581646209404c39d3fbc5` |
| app-test | PASS | `evidence-fda40612-e8bc-4d5d-b8c8-20fb6c389dbe` | `2419626a8d52b6ef9062756c64d377064b5fcd6e619b113103080e1774f86cae` |
| api-lint | PASS | `evidence-1655f678-53c5-4151-89fe-4ed35c44f89b` | `907f957b2c9f6d6c6fd2ec67ed9b0c3e07599e9183aafa044fdf3677fe87d9a5` |
| api-typecheck | PASS | `evidence-a333a48d-4db5-4d05-b963-5eba048389f1` | `7c59e05b7d4f5d6e0931516b0d960bc141a1ef3d3b829791939b4e501f5e3de0` |
| api-test | PASS | `evidence-e7df212b-46e5-4e9b-8169-f51e27453872` | `7ed7489ceb75d38b538ee0e9064aa2e8f3d78974c6b158200d4520de92650603` |
| brain-links | PASS | `evidence-1ea4ba6e-0da0-4886-bb95-2846b34a3be3` | `ea5d3638131b710becc14dbed3dc0bda7181bcb5af67498a776be0a8563c1432` |

Envelope JSON da CLI arquivado na coordenação local; SHA-256
`cacc372bc0fec13d7041a185dec1a3830328aff8281668e112496a8237eb86e8`.
Código/teste e nove capturas permanecem nos hashes revisados. A confirmação
de publicação/CI usa o SHA real desta entrega no PR66; os recibos de
fechamento e CI ficam no handoff de coordenação, sem retroeditar a prova nativa.
