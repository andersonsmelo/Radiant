# Trilha Medalhão e aula-bancada — índice dos planos

**Spec:** [desenho aprovado em 2026-10-21](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
[ADR](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) · FILA 67.
**Autoria:** Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21.

A spec cobre cinco subsistemas independentes, e o adendo de 2026-10-21 à noite
acrescentou um sexto, o Pixel. Cada plano entrega software que funciona e pode ser testado sozinho, e cada um é escrito quando o anterior de que
depende termina. Um plano escrito antes disso descreveria interfaces que ainda
não existem.

| # | Plano | Depende de | Gate do dono | Estado em 2026-10-21 |
| --- | --- | --- | --- | --- |
| 1 | [Fundação visual Medalhão](2026-10-21-fundacao-visual-medalhao.md): tokens, relevo, fundo, ícones, Skia com Skottie, as cinco ilustrações e o DESIGN.md | — | olhar as ilustrações no simulador (tarefa 7) | executado e revisado, PR #66 |
| 6 | [Pixel no Medalhão](2026-10-21-pixel-medalhao.md): corpo vetorial em três tons, poses e a variante cabeça, com o mesmo rosto | 1 | — | **concluído e revisado** (2026-10-22), ver o registro de execução no plano |
| 2 | [Trilha Medalhão](2026-10-21-trilha-medalhao.md): medalhas, caminho, estrelas, cabeçalho, linhas de revisão e de lembrete, e o momento do Pixel, sobre o `JourneyProgressService` | 1; 6 na tarefa 6 | **política de versão nativa** (tarefa 0), antes de o Skia entrar numa rota (feito: `fingerprint`) | **tarefas 0-6 concluídas e revisadas** em 2026-10-22; gate da 6 aprovado em 15/15 no segundo run; faltam a 7 e a revisão final do plano |
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
2. Plano 2, tarefa 7.
3. Revisão final do plano 2, com a onda de correção dela.
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
