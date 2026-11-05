# PC06-C — transição ao abrir conteúdo retirado

Medido em 03/11/2026, na worktree `trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810` com alterações locais
anteriores preservadas. Implementa a decisão de transição aprovada por Anderson
no PC03-A. Não há conteúdo novo promovido, build ou prova nativa nesta entrega.

## Entradas e comportamento

`ContentUpdatedScreen` apresenta “Este conteúdo foi atualizado”, informa que
dados e conquistas foram preservados e oferece “Ver a nova trilha”, destinada
a `/(tabs)`. Usa componentes existentes, texto escalável e área rolável.
O cabeçalho recebe foco/anúncio uma vez por montagem; a ação usa botão comum.
A revisão sem itens elegíveis explica esse estado, sem chamar a fila de “em dia”.

| Entrada | Tratamento |
|---|---|
| `/learn?blockId=...`, com/sem nó e com cursor antigo | Verifica conteúdo antes de montar a tentativa. Não grava nó, cursor, conclusão ou resposta. A validação no bootstrap também antecede qualquer escrita de entrada. |
| `/quiz` com ID retirado | Não cai na aula inicial. Uma lista de revisão considera somente os IDs explicitamente pedidos e disponíveis. Sem item elegível, apresenta o aviso. |
| `/licao-hibrida` | A rota antiga apresenta o mesmo aviso e destino. |
| `/review` sem conteúdo elegível | Explica a indisponibilidade, oferece a trilha e mantém os checkpoints de sessão desativados quando a fila está vazia. Não conclui revisão ou concede recompensa. |
| Retomada global | A disponibilidade é consultada antes da restauração de versão/cursor. Conteúdo ausente produz `content-updated`; não incrementa falhas de restauração nem altera o checkpoint antigo. |
| Botão da jornada com bloco indisponível | Exibe o aviso antes de escrever o nó. Na trilha sem aulas, informa “Nova trilha em preparação”. Um cursor antigo não vira posição da primeira aula nova. |

`ContentAvailability` consulta o catálogo atual. Na revisão, o item salvo deve
existir com sua própria identidade nas questões atuais, atividades promovidas
ou itens de checkpoint; a mera existência de outro item novo não basta.
First-run e o tratamento existente de cursor corrompido continuam com suas
regras próprias. O novo aviso não é uma tentativa de restauração fracassada.
O probe de primeiro frame o agrupa na categoria de apresentação `fallback`,
sem acionar o contador de falhas do coordenador.

## Histórico e revisão

A conferência encontrou duas escritas/contagens que precisavam acompanhar a UI:

- `JourneyProgressService.ensureProgress` hidratava e persistia o progresso
  mesmo quando os nós tinham desaparecido. Agora deriva a visão corrente sem
  regravar o armazenamento ao abrir trilha vazia ou histórico com IDs retirados.
  Em ações explícitas sobre nós atuais, a persistência conserva os IDs históricos
  de conclusão/revisão que não pertencem à definição corrente. Esses IDs não
  entram na recomendação nem completam competências novas.
- `ItemReviewCoordinator.dueCount` contava lições legadas indisponíveis, inclusive
  no fallback de armazenamento ilegível. A contagem agora exige definições
  atuais. A fila já filtrava esses itens; os testes confirmam que seus cartões
  e registros permanecem com os mesmos bytes, sem apagar ou resemear conteúdo.

Não foi executada migração, limpeza de AsyncStorage ou conversão de progresso.
As comparações de armazenamento usam portas de memória dos serviços reais.
Não são prova de atualização de um binário instalado no aparelho do usuário.

## Evidência focada

No Node 20.20.2, com `EXPO_NO_DOTENV=1 CI=1`, passaram **9 suítes / 297 testes**:
ContentTransition, ActiveCheckpointRuntime, JourneyProgressService,
JourneyHomeScreen, useReview, ReviewScreen, QuizScreen, LessonFlowScreen e
ItemReviewService. Uma checagem adicional cobre o cursor antigo com outro
catálogo já disponível; o total final e o gate configurado são registrados no
fechamento abaixo.

Os testes de rotas renderizam as entradas reais e o aviso, substituindo I/O,
catálogo indisponível e dependências externas. A revisão vazia usa uma porta de
estado para testar a UI; a elegibilidade e preservação dos cartões são medidas
separadamente no coordenador/repositório reais com armazenamento em memória.

Falhas específicas registradas no diretório local do run:

| Defeito exercitado | Resultado esperado observado |
|---|---|
| Implementação anterior tratava conteúdo retirado como falha de restauração | Dois casos, com/sem nó, receberam `fallback`/contador 1 em vez de `content-updated`; `resume-red.log`. |
| Forçar persistência automática na abertura com nós retirados | A serialização armazenada mudou e a comparação byte a byte reprovou; `history-count-red.log`. O merge de IDs históricos continuava ativo nesse ensaio. |
| Remover o filtro de disponibilidade do contador | Contagem recebeu 1 em vez de 0; mesmo recibo. |
| Remover a retenção das conclusões históricas na escrita explícita | O ID antigo desapareceu; `completions-red.log`. |

Cada alteração temporária foi restaurada. As verificações restauradas constam
de `history-count-green.log` e `guards-green.log`. Erros iniciais de infraestrutura
do teste novo (AsyncStorage sem porta de teste) não contam como prova vermelha.

## Limites e continuação

Os testes conferem navegação solicitada, árvore de UI, anúncio solicitado,
ausência de tentativas/recompensas e comportamento dos serviços. Não medem foco
real do VoiceOver/TalkBack, layout em fonte máxima ou reabertura de um binário
atualizado. Essas provas, junto com integridade offline, continuam na saída do
PC06. Q6 (`case-decision`) ainda precisa de renderer e integração próprios.

Nenhum reset, conversão de conquistas, aula sintética, aprovação por hash,
registro no catálogo, instalação, Metro, build, commit, push ou publicação.
Os seis aceites de promoção continuam obrigatórios; quatro aulas do piloto
permanecem briefs sem checkpoint completo.

Writer inicial: `run-1793747264755-f7cc7eee`, fechado após reprovação 13/15.
Writer substituto: `run-1793748470812-ae4f23ac`, aberto pelo embrulho público
com os mesmos caminhos e dois testes adicionais. A CLI não permite ampliar
o escopo de um step em edição. A implementação anterior já faz parte da
baseline do substituto; o run inicial registra sua supervisão, os testes e a
reprovação. Não houve edição fora de escopo ou alteração da política. Sessão do cérebro
`brain-session-1793747034811-08638d86`, consultada e fechada antes do writer
para evitar disputa com o validador `brain-links`. A baseline inclui o trabalho
PC03–PC06-B anterior, preservado.

Validação final configurada: **VALIDATION_PASSED, 15/15 no writer substituto,
um ciclo nele**; a primeira execução do objetivo foi 13/15 no writer inicial.
Comando: `PYTHONDONTWRITEBYTECODE=1 caffeinate -i loop validate --run
run-1793748470812-ae4f23ac`, CLI Node 24.14.1 e app/API Node 20.20.2. O gate
inclui `EXPO_NO_DOTENV=1 CI=1 npm run quality`, toda a suíte do app sem cache,
API lint/typecheck/test, conteúdo, documentação e links do cérebro. A medição
cobre a árvore local com alterações anteriores não commitadas; não é CI de SHA
publicado. Typecheck e lint focado passaram sem avisos. Depois dos dois ajustes
de testes, passaram quatro suítes/33 testes focados; as quatro suítes de guardas
também passaram em 71 testes. Os conjuntos se sobrepõem e não devem ser somados.

| Validador | Resultado | Evidência |
|---|---|---|
| docs-contract | passou | `evidence-8b8b25ea-830e-4c6c-83c4-ea05c7c2a756` |
| content-foundation | passou | `evidence-667dab5e-565e-4fd5-b2ca-957da9b03c5b` |
| content-wave1 | passou | `evidence-6b316cd4-aa7e-43ab-a0f3-59c22e43b17d` |
| content-production | passou | `evidence-576ad44a-13d6-4aab-bb81-c0f0d47ffab5` |
| content-anchoring | passou | `evidence-6e7c53e6-ab16-41dd-be33-0771a037d196` |
| content-anchoring-data | passou | `evidence-06b3fe96-2277-4874-9231-5b34c5fddc72` |
| content-no-verbatim | passou | `evidence-35277923-76b0-408e-8225-c446502699a7` |
| content-source-rights | passou | `evidence-0b2adc81-5760-4231-9b58-713c2101b4d7` |
| content-python | passou | `evidence-ff2aec8d-d4df-471a-a21a-66ca12fdf4ab` |
| app-quality | passou | `evidence-3c8e73d1-cf98-473f-b5e9-0b6d89222cb5` |
| app-test | passou | `evidence-c9e6b9d8-fba7-437a-a11e-16461282dce7` |
| api-lint | passou | `evidence-ce82c509-ed32-4a91-b2a8-34f2087f2740` |
| api-typecheck | passou | `evidence-fdd75b0d-bcd6-4bba-b954-8575f9578432` |
| api-test | passou | `evidence-7c1c2a29-ef74-4824-b041-61f174789573` |
| brain-links | passou | `evidence-539c5740-c6f8-48f7-b37f-72d5cc3c88e8` |

## Primeira validação e correção de expectativas

O primeiro gate configurado passou em 13/15 e reprovou em `app-quality` e
`app-test`. A suíte inteira foi reproduzida no Node 20.20.2, em banda única,
sem cache e com relatório JSON: 211 suítes passaram e duas reprovaram;
2865 testes passaram e três reprovaram. Recibos no run inicial:
`app-diagnostic.json` e `app-diagnostic.log`.

As duas suítes ainda esperavam o comportamento anterior: a rota híbrida
procurava “Conteúdo em preparação” nos dois estados de ferramentas de
desenvolvimento; o teste de relógio contava três cartões sem definição atual.
O teste da rota agora exige o aviso aprovado e seu botão e continua recusando
“Começar”. O teste de relógio conserva a expectativa de três vencimentos e
recebe definições sintéticas elegíveis para seus quatro cartões; o teste de
item promovido continua usando o lote sintético real. Não foi removida guarda
de conteúdo nem alterado o relógio para satisfazer os testes.
