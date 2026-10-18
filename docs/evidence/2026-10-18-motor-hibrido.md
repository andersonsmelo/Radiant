# FILA 58 — motor híbrido nas lições legadas

Medição: 2026-10-18 (America/Bahia). Executor: Codex (família GPT-6 informada pelo ambiente).
Base: `a4ae0c26c985b21722782327a7aa5757930cc99f`, branch
`claude/motor-hibrido-e-decisoes-2026-10-18`. Implementação na branch
`codex/motor-hibrido-licao`, em worktree própria. A entrega depende da revisão
do Claude; M7 depende da aprovação do Anderson na PR.

## Escopo e comportamento

[Especificação M1–M8](../trilha/plano/2026-10-18-pacote-motor-hibrido-na-licao.md).
As decisões das ADRs de [18/10](../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md)
e [23/09](../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md) foram mantidas.

| Item | Implementação e prova automatizada |
| --- | --- |
| M1 | `JourneyDefinitionService` monta todas as perguntas em ordem de catálogo, com IDs distintos. `LessonFlowService` aceita várias interações somente no modo híbrido; atividades promovidas continuam pelo caminho V2. |
| M2 | Conferir mantém pergunta e opção marcada, com resposta certa e explicação. O segundo toque avança. Opções conferidas ficam indisponíveis para seleção e anunciam esse estado. O feedback rola para a área visível e é anunciado com a resposta marcada e a certa. |
| M3 | `useLearningActivity` acrescenta o item errado no fim uma vez, com o mesmo ID. Conserva primeira e última resposta. O journal recebe uma tentativa por item; a repetição da conclusão não duplica recall, tentativa agregada ou recompensa no teste de integração. |
| M4 | Primeiro contato grátis nas lições do catálogo; erro no retorno cobra uma vida. Revisão segue grátis. O último débito deixa ler o feedback antes de a ação seguinte abrir a folha de vidas. |
| M5 | Sem `teachBody` autoral, há contexto e perguntas, sem passo de molde. As lições com texto autoral mantêm esse passo. |
| M6 | Resumo incompleto de lição oferece Refazer. A nova montagem limpa respostas, retornos, identificador da tentativa e cursor de retomada; a conclusão anterior permanece registrada. |
| M7 | Proposta abaixo. O placar híbrido usa a primeira resposta de cada item; a correção final fica no journal, sem inflar o número de perguntas nem o placar. O resumo parcial usa mensagem de reforço sem declarar aprovação ou domínio. |
| M8 | Nó de revisão usa as perguntas distintas uma vez e não enfileira retorno na mesma sessão. A revisão espaçada G4 não foi alterada. |

## Régua proposta, pendente do dono

Para N perguntas: 0 estrelas com zero acertos; 1 com algum acerto e menos de
2/3; 2 a partir de 2/3, sem perfeição; 3 só com N acertos. A função compartilhada
`resolveLessonStars` aplica essa proposta também aos consumidores existentes e
recalcula o recorde a partir das tentativas armazenadas. Não muda o corte de
70% de `QUIZ_THRESHOLDS.PASSING_SCORE` usado pelos demais gates de aprovação.

| N | 0 estrelas | 1 estrela | 2 estrelas | 3 estrelas |
| --- | --- | --- | --- | --- |
| 1 | 0 | — | — | 1 |
| 2 | 0 | 1 | — | 2 |
| 3 | 0 | 1 | 2 | 3 |
| 10 | 0 | 1–6 | 7–9 | 10 |
| 15 | 0 | 1–9 | 10–14 | 15 |

## Vermelhos registrados antes das respectivas correções

Node `v20.20.2`, `EXPO_NO_DOTENV=1`, Jest em banda única. Logs ao lado deste relatório:

- [M1/M2/M3/M5/M6/M7/M8](2026-10-18-motor-hibrido/red-M1-M2-M3-M5-M6-M7-M8.log): 11 falhas comportamentais previstas em quatro suítes.
- [M4 e M6 na tela](2026-10-18-motor-hibrido/red-M4-M6-screen.log): cobrança indevida no primeiro contato e ausência do feedback por item.
- [Serviço e journal](2026-10-18-motor-hibrido/red-service-journal.log): rejeição de várias perguntas e placar inflado pela correção final.
- [Oito roteiros](2026-10-18-motor-hibrido/red-eight-maestro.log): o roteiro seguia sem afirmar o feedback de cada item.
- [Checkpoint ativo](2026-10-18-motor-hibrido/red-M3-checkpoint.log): acrescentar retorno iniciava duas vezes o checkpoint da sessão. A capacidade de cursores agora é estável.
- [Contexto sem vidas](2026-10-18-motor-hibrido/red-M4-empty-context.log) e [sonda nativa](2026-10-18-motor-hibrido/red-M4-native-empty-context.log): a guarda antiga pausava antes do primeiro contato; o teste exige primeiro contato válido e pausa só no retorno.
- [Último coração](2026-10-18-motor-hibrido/red-M4-last-heart.log): concluía sem abrir a folha.
- [Título AX5](2026-10-18-motor-hibrido/red-M2-title-scale.log): título sem o limite dos rótulos; agora usa a escala máxima 2, preservando o corpo sem teto.
- [Rolagem AX5](2026-10-18-motor-hibrido/red-M2-native-AX5-scroll.log): a rolagem para o fim ocultava o título do feedback; a posição passou ao início do bloco.
- [Acessibilidade corrigido](2026-10-18-motor-hibrido/red-M2-accessibility-corrected.log): faltava o estado indisponível após conferir.
- [Copy parcial](2026-10-18-motor-hibrido/red-M7-partial-copy.log): o resumo dizia Passou com 1 acerto em 2.
- [Refazer após retomada](2026-10-18-motor-hibrido/red-M6-resumed-retry.log): reutilizava o cursor e não voltava ao contexto.

A primeira execução do teste de acessibilidade usou um matcher inexistente;
[esse erro de teste](2026-10-18-motor-hibrido/red-M2-accessibility.log) não é prova
vermelha do produto. O log corrigido acima é a execução comportamental válida.
O [primeiro teste de contexto sem vidas](2026-10-18-motor-hibrido/probe-M4-empty-context-initial-green.log)
passava sem aguardar o efeito assíncrono da folha. Ele foi fortalecido com `act`
assíncrono, visto falhando contra a guarda antiga e passando após a correção;
não é usado como prova vermelha.

Inventário completo dos [arquivos da entrega](2026-10-18-motor-hibrido/changed-files.txt).

## Consumidores conferidos

Antes de alterar os ramos de UI, foram pesquisados `Ideia-chave`, `Vamos reforçar`,
`Concluir e voltar`, `Conferir resposta`, a copy do resumo e `lesson-option-`
em `src/`, `.maestro/` e `scripts/`. Atualizados os oito roteiros da especificação:
`learning-critical-path`, `radiant-1-4-primeira-execucao`,
`radiant-1-4-vidas-esgotadas`, `offline-relaunch`, `radiant-1-4-segundo-dia`,
`reward-unlock`, `store-capture` e `student-checkpoint-no-duplicate-effect`.
O contrato executa a leitura dos módulos reais de perguntas e analisa os comandos
YAML dos oito caminhos, exigindo todas as perguntas e feedback por resposta.
O caminho de vidas erra a primeira pergunta no contato e no retorno, com as outras
corretas. O segundo dia continua exigindo o relógio real e agora diz Revisão concluída.

## Prova nativa e gates

Simulador próprio `Radiant FILA 58 Codex`, iPhone 17 Pro, iOS 26.5,
UDID `17D1EBE2-3F91-48C5-937D-8970B55CEE8D`. Binário Debug existente
1.4.0 (3), sem recompilação nesta tarefa; JavaScript servido pelo Metro da
worktree, com cache reiniciado após as correções.

- `hybrid-native-evidence.yaml`: conclui as duas primeiras lições manualmente,
  alcança a primeira lição de IA, erra um item e acerta o outro, observa o
  retorno, 5 vidas no primeiro erro e 4 no retorno, resumo de 1/2 e uma estrela,
  e abre Refazer. Sem injeção de progresso.
- `radiant-1-4-vidas-esgotadas.yaml`: cinco sessões reais, uma vida perdida em
  cada retorno, até a folha de vidas e o cabeçalho da trilha preservando a L1
  concluída. Repetido após a correção de rolagem.
- Texto ampliado: passagem curta de feedback na maior categoria de
  acessibilidade do iOS, com começo do feedback, rolagem e CTA. O teto do título
  foi ajustado por último e é conferido nessa passagem. Corpo sem teto de fonte.
  Isso não equivale a uma auditoria completa de usabilidade ou VoiceOver.

Capturas: [sem molde](2026-10-18-motor-hibrido/01-sem-molde.png),
[primeiro erro](2026-10-18-motor-hibrido/02-primeiro-erro-gratis.png),
[segundo item](2026-10-18-motor-hibrido/03-segundo-item.png),
[retorno](2026-10-18-motor-hibrido/04-retorno.png),
[débito](2026-10-18-motor-hibrido/05-debito-no-retorno.png),
[resumo](2026-10-18-motor-hibrido/06-resumo.png),
[Refazer](2026-10-18-motor-hibrido/07-refazer.png),
[feedback ampliado](2026-10-18-motor-hibrido/08-feedback-texto-ampliado.png) e
[rolagem ampliada](2026-10-18-motor-hibrido/09-rolagem-texto-ampliado.png).
As imagens são cópias dos artefatos nativos, com SHA-256 conferido em
`screenshots.json`. `source-manifest.json` identifica os arquivos de app da
entrega e o executável nativo utilizado; as capturas normais antecedem somente
os últimos ajustes de teto de fonte do título e de contexto com zero vidas,
ambos exercitados na passagem ampliada final.

Uma primeira execução de vidas foi bloqueada pela confirmação de abertura do
dev client ([log](2026-10-18-motor-hibrido/native-bootstrap-failure.log)). Uma
execução de IA parou ao salvar captura com caminho relativo para fora da pasta
de artefatos ([log](2026-10-18-motor-hibrido/native-ai-screenshot-path-failure.log));
uma repetição com o caminho antigo foi interrompida. O roteiro passou usando
nomes simples, e as imagens foram copiadas para o repositório com hashes
conferidos. A primeira passagem ampliada falhou no título fora da tela e levou
à correção registrada acima. As tentativas seguintes, depois de esgotar vidas,
expuseram a pausa indevida no contexto (incluindo a asserção de Ideia-chave
coberta pela folha); a guarda foi corrigida e a passagem final chegou ao
feedback com zero vidas. O teste ampliado não cobre todos os estados da lição.

Os oito roteiros passaram `maestro check-syntax`; o contrato tem 30 testes.
Dos oito roteiros da especificação, somente vidas-esgotadas foi executado
nativamente nesta tarefa. Os outros sete não foram executados, inclusive o
segundo dia com relógio real de 24 horas. A prova de IA usa o roteiro adicional
versionado; a passagem ampliada é reproduzível pelo `AX5-replay.yaml` na evidência.

O primeiro quality completo falhou em um teste de inventário:
`JourneyCatalogReachability.test.ts` ainda esperava 36 ocorrências legadas. O
inventário mediu 76, porque agora cada pergunta aparece na atividade
introdutória e na atividade de revisão. O contrato foi reconciliado sem conteúdo
novo; as demais 1.756 verificações Jest passaram nessa execução
([log completo](2026-10-18-motor-hibrido/quality-initial-failure.log)).

**Quality final:** Node `v20.20.2`, `EXPO_NO_DOTENV=1 CI=1 npm run quality`,
saída zero: 173 suítes, 1.757 testes e um snapshot. Visual QA: 411 arquivos,
60 achados (57 na baseline, 3 exceções de escopo), zero regressões não aprovadas.
[Log completo](2026-10-18-motor-hibrido/quality.log). Simulador desligado,
processo sob `caffeinate -i`.

**Loop:** validação final no run `run-1792326922046-8d387120`;
[envelope](2026-10-18-motor-hibrido/loop-validation.json): `VALIDATION_PASSED`,
15/15, no primeiro ciclo configurado desse run. Todos os validadores saíram com
código zero, incluindo app-quality, app-test, API e brain-links. Executado com
Node 24 na CLI, os comandos configurados de app/API no Node 20 e
`PYTHONDONTWRITEBYTECODE=1`, sob `caffeinate -i`, com simulador desligado.
Fechamento pela CLI na ordem validate → step finish → run close, sem memória
adicional; o estado final do run permanece consultável pela CLI.

## Processo e limites

Dependências do app/API copiadas com `cp -cR`; `pages.json` e `excerpts.json`
provisionados antes do run. Sem links simbólicos para o Metro.
Node 24 somente para Loop; Node 20 para app/testes. Metro iniciado com
`EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 EXPO_NO_TELEMETRY=1`.

O run inicial `run-1792324707082-dab80ed4` foi fechado em `context_ready`, após
`INVALID_SCOPE` ao declarar `expo-env.d.ts`. Não houve edição nesse run.
O run `run-1792324732418-8a4f9693` foi fechado em `editing`, sem validação Loop,
para incluir o consumidor de cobertura encontrado pelo quality. A abertura
`run-1792326864819-da231663` recusou o diretório de evidências já existente
(`INVALID_SCOPE`); foi fechada em `context_ready`, sem edição.
O run final é `run-1792326922046-8d387120`, com 72 arquivos explicitamente
declarados, incluindo todas as evidências e o teste adicional de cobertura.
Não houve mudança em `writePolicy.allowedRoots` nem recuperação de trava.
Sessão de leitura: `brain-session-1792324607492-006cc612`, fechada explicitamente
com `BRAIN_SESSION_CLOSED` antes da validação final. O validador brain-links
reentra na CLI, por isso não foi mantida uma leitura desnecessária durante o gate.

A revisão B1–B5 não existe na base remota deste pacote. Foi lida no checkout
principal, sem editá-lo. O arquivo de avaliação do Argon presente na base é
`2026-10-17-avaliacao-argon-licao-revisao-e-contratos.md`.

Não executados: aparelho físico, Android, VoiceOver auditivo, validação de som
por ouvido, Release, build de loja, publicação ou merge. Sem conteúdo novo,
variantes, imagens editoriais, currículo novo ou alteração de A1/G4. A FILA 55
fica para o pacote seguinte, preservando a data conforme a decisão existente.
