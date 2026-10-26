# Trilha Medalhão e aula-bancada — índice dos planos

**Spec:** [desenho aprovado em 2026-10-21](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
[ADR](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) · FILA 67.
**Autoria:** Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21.

A spec cobre cinco subsistemas independentes, e o adendo de 2026-10-21 à noite
acrescentou um sexto, o Pixel. Cada plano entrega software que funciona e pode ser testado sozinho, e cada um é escrito quando o anterior de que
depende termina. Um plano escrito antes disso descreveria interfaces que ainda
não existem.

**Continuação, decidida em 2026-10-25:** o
[plano integrador de pendências e fechamento](../../plans/2026-10-25-medalhao-pendencias-e-fechamento.md)
organiza as tarefas restantes e detalha inventário/recomeço. Por decisão do
dono, a conferência de segundo dia fica no fechamento e não interrompe o
avanço das demais telas. A preparação é preservada; o teste não está aprovado
por adiamento. A entrega deste plano é apenas documental.

**Plano integrador revisado pelo dono em 25/10:** usar o
[roteiro de execução por subagentes](../../plans/2026-10-25-medalhao-execucao-subagentes.md)
para a operação de cada tarefa, com skills, plugins, MCPs e revisões definidos.
Nenhuma tarefa de implementação foi iniciada pela escrita desse roteiro.

| # | Plano | Depende de | Gate do dono | Estado medido em 2026-10-25 |
| --- | --- | --- | --- | --- |
| 1 | [Fundação visual Medalhão](2026-10-21-fundacao-visual-medalhao.md): tokens, relevo, fundo, ícones, Skia com Skottie, as cinco ilustrações e o DESIGN.md | — | olhar as ilustrações no simulador (tarefa 7) | executado e revisado, PR #66 |
| 6 | [Pixel no Medalhão](2026-10-21-pixel-medalhao.md): corpo vetorial em três tons, poses e a variante cabeça, com o mesmo rosto | 1 | — | **concluído e revisado** (2026-10-22), ver o registro de execução no plano |
| 2 | [Trilha Medalhão](2026-10-21-trilha-medalhao.md): medalhas, caminho, estrelas, cabeçalho, linhas de revisão e de lembrete, e o momento do Pixel, sobre o `JourneyProgressService` | 1; 6 na tarefa 6 | **política de versão nativa** (tarefa 0), antes de o Skia entrar numa rota (feito: `fingerprint`) | **tarefa 7 executada, menos o segundo dia iOS (conferir no fechamento, sem data fixa)** (retomada de 2026-10-23: dia 2 Android PASS, momento Android demonstrado, quadro final antecipado só parcialmente corrigido (1 de 4 gravações; 0 de 13 na remedição nativa da noite, causa não observada), 40 concluídas medidas); **aceite pendente** da decisão do dono sobre o texto máximo na coluna |
| 3 | [Aula-bancada](2026-10-21-aula-bancada.md): a interação `bench`, o modelo de exposição, o shader, a segunda bancada e as duas aulas de exemplo | 1; a tarefa 0 do 2 antes da tarefa 6 | **revisão do conteúdo** das aulas de exemplo | **tarefas 1 a 7 feitas e revisadas** (2026-10-24), menos o VoiceOver e o AVD de entrada; **aguarda a revisão do conteúdo pelo dono** ([documento](../../conteudo-bancada/2026-10-24-aulas-de-exemplo.md), [evidência](../../evidence/2026-10-24-aula-bancada.md)) |
| 4 | Retirada e recomeço: inventário, remoção do conteúdo e dos validadores, recomeço dos stores, Maestro e testes | inventário: nenhum; remoção: 3 | **aprovação do inventário** antes de apagar, e mudança do `.loop/project.yaml` | sequência detalhada em T15/T19–T22 do plano integrador; inventário sai/fica ainda não produzido nem aprovado |
| 5 | [Demais telas no Medalhão, sem cara de IA](2026-10-21-demais-telas-medalhao.md): HUD, boas-vindas, resultado, recompensa, revisão, avaliação, Perfil, Ajustes, assinatura e vidas, com a guarda de texto | 1; 6 nas tarefas 4 e 5; 3 na tarefa 3; a tarefa 3 do 2 | — | T01 guarda/vocabulário implementada, revisada e validada (15/15 Loop) em 25/10; T02 HUD implementada/revisada em26/10, Loop15/15 e prova visual finito5 iOS/Android; T03 boas-vindas implementada/revisada em26/10, Loop15/15 e prova de texto ampliado; próxima T04, demais tarefas pendentes |

O plano 6 nasceu do adendo de 2026-10-21 à noite (ADR, decisão 8), quando o dono
aprovou o Pixel redesenhado. O plano 5 cresceu com a decisão 9: além de pôr as
telas no Medalhão, ele aplica a Regra Sem Cara de IA e o glossário de texto
([prancheta do app](../../design/2026-10-21-app-medalhao.html)).

**Ordem sugerida:** 6, depois 2 e 3 em paralelo, depois 5, depois 4. O 4 é o
único que apaga coisa, e só depois do inventário aprovado.

**Prazo de relógio:** os 23 registros de `radiant-app/scripts/visual-qa-policy.json`
venciam em 2026-10-23. A [PR #67](https://github.com/andersonsmelo/Radiant/pull/67),
aberta em 2026-10-21 a pedido do dono, renova todos para **2026-11-30**,
amarrados ao fim do plano 5. Depois dessa data, o `npm run quality` reprova em
qualquer branch que ainda tenha esses arquivos. A tarefa 0 dos planos 5 e 6
confere o prazo antes de começar.

**Paralelismo:**
- o inventário do plano 4 só lê o repositório e pode correr junto com o plano 1;
- os planos 2 e 3 dependem só do 1 (o 2 também do 6 na última tarefa) e não
  tocam os mesmos arquivos, então podem correr em sessões separadas, um
  escritor do Loop por vez;
- o 5 toca o `LessonSummary` e o `LessonFlowScreen` depois do 3, e o `HUD`
  usado pela trilha do 2: rode-o depois dos dois.

**Saída para a loja:** nenhuma build de loja antes de os cinco planos estarem na
`main` **e** existir o primeiro lote do currículo novo, que é o projeto seguinte,
com o dono. Build e distribuição continuam com o dono.

## Como continuar (atualizado em 2026-10-25)

**Ordem atual:** seguir T00–T18 do plano integrador, avançando nas telas
independentes enquanto decisões específicas aguardam o dono. Segundo dia iOS
fica em T18, no fechamento visual. T19–T22 dependem do inventário aprovado e
do contrato do currículo substituto; prova legada não substitui a do conteúdo
novo. Não acessar o simulador reservado durante as tarefas anteriores.

**Pendências que essa ordem preserva:**
1. Plano 2: o dono decide o texto máximo da coluna. No AX5 e no Android a 200%,
   o texto quebra no meio da palavra, com os corredores de 64 pt preservados
   ([retomada](../../evidence/2026-10-23-trilha-medalhao-retomada.md), seção 3).
   Também faltam o quadro final antecipado no Android e o segundo
   dia iOS, a conferir no fechamento, sem data fixa por decisão de 25/10. O quadro estava em 1 de 4 gravações com o
   conserto parcial; remedido em 2026-10-23 à noite, ficou em **0 de 13**
   rodadas válidas, com rastreamento nativo e sem instrumentação, e a causa
   continua sem observação ([evidência](../../evidence/2026-10-23-trilha-medalhao-quadro.md)). Se isso
   basta, ou se o quadro ainda bloqueia o aceite, é decisão do dono. Com os
   três resolvidos, o Plano 2 fecha com uma revisão final curta.
2. Plano 3: feito em 2026-10-24, com revisão final; falta o dono revisar o
   conteúdo das duas aulas, e o agente fazer o VoiceOver e o AVD de entrada.
   Depois, o Plano 5, que também traz a medalha da abertura e o Pixel da aula
   (as entradas do plano 3 estão no fim do plano 5). As decisões de produto do
   plano 3 estão na [ADR de 2026-10-24](../../adr/ADR-2026-10-24-aula-bancada-fisica-digital-e-colimacao.md).
3. O plano integrador detalha a sequência do plano 4; produzir o inventário
   de arquivos sai/fica em T15 e obter aprovação antes da política/remoção.
4. À parte, **resolvido em 2026-10-23 na branch:** o bundle do Storybook não
   montava (`lesson-xray-panel.png`, removido em `b06c7eb`). As stories
   deixaram de usá-lo, com guarda AST
   ([evidência](../../evidence/2026-10-23-trilha-medalhao-storybook.md)).

**Antes de cada plano, a varredura do texto.** O plano é o argumento, e a spec
é a autoridade. Na execução dos planos 6 e 2, a varredura achou conflitos entre
o texto do plano e a spec, os roteiros Maestro ou a prancheta: o rótulo das
medalhas, o ciclo do zigue-zague, o cartão de recomendação e o brilho da barra.
Cada um foi decidido a favor da spec e registrado no "Registro de execução" do
plano. Leia esses registros antes de continuar.

**O que custou retrabalho e vale conferir sempre:**
- **Prop animada de SVG que o nativo não declara.** O mock do Reanimated
  esconde o defeito. Anime props nativas (`matrix`, `opacity`, `transform` de
  View) e teste essas props.
- **Arquivo fora do escopo do run.** O Loop não amplia o escopo de um run
  aberto: feche sem validar e reabra declarando tudo.
- **Pasta declarada no `abrir.mjs`.** O guarda só aceita arquivos: declare cada
  arquivo de captura.
- **O `maestro-contract`.** Ele lê fontes de copy por AST. Mudar de arquivo a
  copy que um roteiro lê exige reapontar o contrato.
- **O simulador.** Ver a tela pegou o que os testes não pegam: pontilhado
  solto, brilho com sombra, aceno parado.


## Prompt de continuidade — pausa de 2026-10-23

**Executado na retomada de 2026-10-23.** O que restou está em "Como continuar", acima, e a medição está na [evidência da retomada](../../evidence/2026-10-23-trilha-medalhao-retomada.md). O texto abaixo é histórico.

Copie a seção abaixo para a próxima IA. O STATUS é a fonte de estado vivo;
este prompt organiza a retomada e não substitui medições atuais.

> Continue a frente **trilha Medalhão** do Radiant. O dono pediu pausa em
> 2026-10-23 após implementar as correções do Plano 2. Retome primeiro as provas
> pendentes desse plano; não reinicie o desenho nem avance para outro objetivo
> antes de fechar ou registrar seu bloqueio real.

### Projeto e reconciliação obrigatória

- Repositório: `/Users/anderson/Developer/Radiant`.
- Worktree da frente: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
- Branch: `claude/trilha-medalhao-design`; PR66:
  <https://github.com/andersonsmelo/Radiant/pull/66>.
- Leia `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md`, roadmap ativo
  `docs/plans/2026-07-27-radiant-launch-roadmap.md`, `docs/FILA.md` item67,
  este índice, registro do Plano 2, spec de2026-10-21 §§4/8/11, ADR da mesma
  data, `docs/DESIGN.md` e
  `docs/evidence/2026-10-22-trilha-medalhao-final.md`.
- Meça Git/status/HEAD/remoto antes de editar. A última publicação anterior
  à onda era83de747; WIPs10754e8/082d86d foram apenas baselines locais de
  ampliação de escopo e devem ser lidos como histórico, não HEAD atual.
  Use `git log -5 --oneline` e os hashes de `ambiente.txt`/checksums.
  Preserve trabalho alheio e `.playwright-mcp/` do checkout principal.
- Confirme o SHA remoto da branch, separadamente do metadata/checks da PR:
  a API da PR havia permanecido com head453d7a4 apesar do ref remoto mais novo.
  Não atribua CI verde antigo ao commit atual.

### Estado e decisões que não reabrir

Plano 6 concluído/revisado. Plano 2 tarefas0–6 implementadas/revisadas, com
gate15/15 anterior da6. A onda final corrigiu encaixe48×46, ocupação da cabeça,
assinaturas/alturas atuais, rota L1→revisão futura→L2, visibilidade corporal,
data visível/limitada, contraste/token da faixa e lembrete após falha.
Fonte recebeu parecer forte favorável, sem novo P1/P2 confirmado; testes
focais8 suítes/260, lembrete13/13, contrato37/37, typecheck/lint passaram.
O gate de fechamento da última janela NÃO foi executado; writer57 fechado
sem validação pela pausa. A retomada deve validar o conjunto em nova janela.
**Plano 2/tarefa 7/revisão final continuam sem aceite integral.**

Preserve `runtimeVersion: fingerprint`, direção Medalhão, cabeça48×46,
corredores laterais permanentes64pt na coluna, reserva31pt no zigue-zague,
fonte integral semellipsis em texto grande e exceção de conexão apenas para
bandas/cabeçalhos. Spec/ADR e rulings registrados vencem exemplos antigos do
plano. Mantenha copy/testIDs, JourneyProgressService e conteúdo existente.
Primeira leitura da trilha não anima; não é falha de gravação ou produto.

### Pendências na ordem

1. **Momento Android: causa ainda não demonstrada.** O vídeo tem142quadros
   em19,5985s e uma lacuna1,785622s entrePTS17,055978 e18,841600. Não prova o
   trajeto. Obtenha captura mais densa e timeline de recommended, ready/holding,
   pedido de âncora, onScroll, slot/rota e onDone antes de decidir entre
   âncora tardia, clipping ou coleta/renderização atrasada. Não trate hipótese
   como P2 nem aumente a duração para fazer passar. Se houver defeito real,
   teste vermelho específico, patch mínimo dentro do Loop e revisão independente.
2. **Concluir a revisão nativa existente.** iOS normal já mostra cabeça inteira
   sobre área de outra célula, contorno visível e chegada/CTA; a origem está
   fora do viewport pela ancoragem aceita. Vídeo iOS concatenado contém normal
   0–11,681667s e AX5 depois; maior texto e reduzido aguardam revisão integral.
   Conferir títulos/data, caixa inteira, pausas e sem sobreposição. Android
   fonte200% foi capturada/restaurada. Não refazer evidência suficiente sem motivo.
3. **40 concluídas e playback.** Story `Trilha/JourneyTrail/QuarentaConcluidas`
   em `radiant-app/src/features/journey/components/JourneyTrail.stories.tsx`
   já existe; nunca foi medida. Usar entrada Storybook/Metro com
   `STORYBOOK_ENABLED=true`, binário Debug existente, sem alterar progresso.
   Três rodadas no AVD `radiant-entrada-api34`, Mac desbloqueado, rolagem de
   ponta a ponta/volta; gfxinfo com amostragem suficiente, linhas válidas e
   durações. Provar que só medalhas realmente visíveis tocam e que as demais
   param. Declarar cenário sintético/Debug e pior quadro capturado. Benchmark
   antigo com três desbloqueadas e G6 não substituem essa prova.
4. **Segundo dia completo.** Primeira execução e vidas iOS já passaram no código
   corrigido. Segundo dia Android anterior falhou só na assert final, após
   revisão3/3. YAML agora espera trilha e centraliza UP100%/500ms sem mudar
   regex completa. Contrato37/37 e checkpoint complementar passaram; falta
   rodar o YAML corrigido INTEIRO com revisão naturalmente devida. Não chamar
   checkpoint de fullPASS. A revisão devida do AVD foi consumida e depois houve
   preparação limpa de L1; os dados atuais têm data futura. Preserve o simulador
   reservado5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3, leia sua data real antes de
   decidir; não prometa janela sem medi-la. Principal iOS:E262D4C1-99BE-496B-8567-0291C14E6533.
   Não editar relógio, stores, respostas ou snapshots para fabricar vencimento.
5. **Revisão final forte do Plano 2.** Reconciliar os artefatos, reproduzir gates
   importantes, conferir o plano inteiro contra spec/ADR e concluir parecer.
   Só marcar tarefa 7/plano concluídos com evidência suficiente; update STATUS,
   FILA e registro do plano na mesma janela. Então próximo objetivo é Plano 3,
   depois5 conforme dependências. Plano 4 só é escrito após3 e não autoriza
   remoção sem inventário aprovado. Conteúdo de aulas-bancada é gate do dono.

### Execução, comandos e limites

- A pausa encerrou app/simulador iOS e Metro; restaurou iOSlarge e Android1,0.
  ADB estava sem dispositivos; o agente não removeu reverse explicitamente.
  Sessão de cérebro fechada; writer57 fecha sem validação a pedido do dono.
- Ative lean-task-start antes de processos; Tier2/using-loop/task-observer
  conforme regras atuais. Leia cérebro pela CLI pública, sem editar vault.
  Uma sessão/um writer por objetivo. Abra pelo `scripts/loop/abrir.mjs` com
  todos os caminhos exatos e só edite depois de `STEP_STARTED`. `PROJECT_BUSY`
  não é convite para contornar lock. Preserve o fluxo de implementador e revisor
  independentes por tarefa; reutilize subagentes se disponíveis.
- App/testes/Metro: Node20.20.2. Loop: Node24.14.1. Não misture os PATHs.
  Focais durante edição; um `loop validate --run <id>` final com15validadores,
  sem E2E concorrente e com carga baixa. O gate do app é
  `EXPO_NO_DOTENV=1 CI=1 npm run quality`, não somente `npx jest`.
- Cheque envelopes JSON, que podem sair0 com erro. Feche separadamente:
  `loop validate` → `loop step finish` → memória opcional validada →
  `loop run close`; feche cérebro independentemente. Nunca encadeie fechamento
  com `&&`. Não grave memória antes de `succeeded`.
- Para momento elegível: onboarding→introL1→`Fechar quiz`→Journey lê L1→ação
  real retomaL1→3/3→resumo→gravar antes de `Continuar`. Onboarding→L1 direto
  não prepara a leitura anterior. Gravações/scratch em `.maestro/artifacts` e
  relatórios em `.superpowers/sdd/2026-10-21-trilha-medalhao` são locais;
  evidência necessária à próxima IA deve ficar versionada.
- Push segue autorizado. **Sem merge, build nativa, EAS, deploy ou loja.**
  Usar somente dev clients existentes com Skia; não chamar `build_run_sim`
  por automatismo. Nenhuma remoção de conteúdo, currículo novo ou alteração
  de política externa. Nenhuma tarefa Todoist criada automaticamente.
- Saída esperada: SHA/arquivos próprios, evidência vermelha/verde e gate real,
  limites nativos explícitos, parecer independente, runs/sessões fechados e
  próximas pendências. Não substituir falta de prova por um relatório positivo.
