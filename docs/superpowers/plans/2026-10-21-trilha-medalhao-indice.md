# Trilha Medalhão e aula-bancada — índice dos planos

**Spec:** [desenho aprovado em 2026-10-21](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
[ADR](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) · FILA 67.
**Autoria:** Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21.

A spec cobre cinco subsistemas independentes, e o adendo de 2026-10-21 à noite
acrescentou um sexto, o Pixel. Cada plano entrega software que funciona e pode ser testado sozinho, e cada um é escrito quando o anterior de que
depende termina. Um plano escrito antes disso descreveria interfaces que ainda
não existem.

| # | Plano | Depende de | Gate do dono | Estado medido em 2026-10-22 |
| --- | --- | --- | --- | --- |
| 1 | [Fundação visual Medalhão](2026-10-21-fundacao-visual-medalhao.md): tokens, relevo, fundo, ícones, Skia com Skottie, as cinco ilustrações e o DESIGN.md | — | olhar as ilustrações no simulador (tarefa 7) | executado e revisado, PR #66 |
| 6 | [Pixel no Medalhão](2026-10-21-pixel-medalhao.md): corpo vetorial em três tons, poses e a variante cabeça, com o mesmo rosto | 1 | — | **concluído e revisado** (2026-10-22), ver o registro de execução no plano |
| 2 | [Trilha Medalhão](2026-10-21-trilha-medalhao.md): medalhas, caminho, estrelas, cabeçalho, linhas de revisão e de lembrete, e o momento do Pixel, sobre o `JourneyProgressService` | 1; 6 na tarefa 6 | **política de versão nativa** (tarefa 0), antes de o Skia entrar numa rota (feito: `fingerprint`) | **tarefas 0-6 implementadas e revisadas** em 2026-10-22; gate da 6 aprovado em 15/15; coleta da 7 executada com aceite pendente; correção e revisão final abertas |
| 3 | [Aula-bancada](2026-10-21-aula-bancada.md): a interação `bench`, o modelo de exposição, o shader, a segunda bancada e as duas aulas de exemplo | 1; a tarefa 0 do 2 antes da tarefa 6 | **revisão do conteúdo** das aulas de exemplo | escrito, não começado |
| 4 | Retirada e recomeço: inventário, remoção do conteúdo e dos validadores, recomeço dos stores, Maestro e testes | inventário: nenhum; remoção: 3 | **aprovação do inventário** antes de apagar, e mudança do `.loop/project.yaml` | a escrever, quando o 3 terminar |
| 5 | [Demais telas no Medalhão, sem cara de IA](2026-10-21-demais-telas-medalhao.md): HUD, boas-vindas, resultado, recompensa, revisão, avaliação, Perfil, Ajustes, assinatura e vidas, com a guarda de texto | 1; 6 nas tarefas 4 e 5; 3 na tarefa 3; a tarefa 3 do 2 | — | escrito, não começado; recebeu entradas da execução (fim do plano) |

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

## Como continuar (2026-10-22)

**Ordem:**
1. Plano 2, tarefa 6 concluída e revisada em 2026-10-22, com gate 15/15 no segundo run. A evidência e a proveniência dos dois runs estão no registro do plano.
2. Plano 2, tarefa 7: coleta executada; aceite pendente pelos achados nativos e um roteiro FAIL.
3. Onda única de correção dos achados medidos da tarefa 7 e da revisão forte preliminar, repetição da evidência e revisão independente final do plano 2.
4. Planos 3 e 5.
5. Plano 4.

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


## Continuação versionada após a coleta nativa — 2026-10-22

**Projeto:** `/Users/anderson/Developer/Radiant`. Worktree ativo da frente:
`/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`, branch
`claude/trilha-medalhao-design`, [PR #66](https://github.com/andersonsmelo/Radiant/pull/66).
Produto medido no commit `7615827`; a coleta posterior é documental. Reconciliar
HEAD/status remoto antes de editar. Não absorver `.playwright-mcp/` do checkout
principal nem trabalho de outras sessões.

**Leituras:** AGENTS; `.loop/project.yaml`; STATUS; roadmap ativo de
2026-07-27; este índice; spec aprovada §4/8/11; ADR de 2026-10-21; DESIGN;
registro do Plano 2; evidências de T6 e
[coleta nativa T7](../../evidence/2026-10-22-trilha-medalhao.md).
A spec e as decisões de execução vencem exemplos divergentes do plano.
`fingerprint`, direção Medalhão e cabeça de 48 pt foram decididos; não reabrir.

**Próximo objetivo:** fechar o Plano 2 com uma onda de correção e revisão
independente, antes de avançar para planos 3 e 5. Corrigir posição do Pixel
fora do viewport, ocupação inteira da cabeça na coluna, playback fora do
viewport, data futura visível e contraste/token da faixa. Conferir altura
antiga em cache antes de congelar a rota e clipping Android. Manter efeito,
copy/testIDs e regras do JourneyProgressService; não alterar conteúdo,
armazenamento ou relógio para fabricar pré-condição.

**Critério de aceite:** vermelho/verde específico de cada guarda; cabeça
48×46 dentro da tela no iOS e Android, percurso visível sem título coberto
em texto máximo, movimento reduzido instantâneo no retorno, só medalhas
visíveis tocando, data futura rasterizada, contraste ≥4,5:1; os três Maestro
reais alcançando seus cenários. Centralizar o alvo de replay no roteiro de
vidas com contrato adequado. Dia2 já passou após vencimento real no5FD8;
para repetir sobre a correção, preservar o estado de revisão devida do AVD
atual ou aguardar a próxima janela real do5FD8, sem relógio/data injetados. Remedir desempenho com o número efetivo de medalhas animadas e
relatar a cobertura, sem chamar o cenário atual de 40 desbloqueadas.

**Execução:** uma sessão de cérebro e um writer por objetivo; abrir pelo
`node scripts/loop/abrir.mjs` com todos os arquivos, apenas após baseline
reconciliada. Node 24.14.1 para Loop; Node 20.20.2 para o app. Primeiro testes
focais; final `EXPO_NO_DOTENV=1 npm run quality`, no ambiente do validador,
e `loop validate --run <id>` uma vez com os 15 validadores configurados,
sem E2E concorrente. Conferir envelope: validate → step finish → memória
opcional → run close. Fechar cérebro separadamente. Reusar os subagentes de
revisão quando disponíveis; ledger local em `.superpowers/sdd/2026-10-21-trilha-medalhao`.

**Limites:** push autorizado; sem merge, build nativa, EAS, deploy ou envio à
loja. Usar binário Debug existente para evidência. Não começar remoção do
Plano 4: depende do 3 e da aprovação do inventário. Planos 3 e 5 ainda não
começaram; o conteúdo de bancada permanece sob revisão do dono.

**Saída esperada:** SHA e arquivos próprios, evidência vermelha/verde,
15/15 ou falha explícita, prova nativa com limites, parecer independente e
estado dos runs/sessões. STATUS é o único estado vivo; FILA67 referencia a
frente. Nenhum Trello, Todoist ou documento externo foi alterado nesta coleta;
não há tarefa pessoal criada automaticamente. Esta passagem documenta a etapa
atômica de coleta após a primeira compactação; não significa aceite do plano.
