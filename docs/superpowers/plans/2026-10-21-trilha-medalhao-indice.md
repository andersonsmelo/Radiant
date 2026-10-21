# Trilha Medalhão e aula-bancada — índice dos planos

**Spec:** [desenho aprovado em 2026-10-21](../specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
[ADR](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) · FILA 67.
**Autoria:** Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-21.

A spec cobre cinco subsistemas independentes. Cada plano entrega software que
funciona e pode ser testado sozinho, e cada um é escrito quando o anterior de que
depende termina. Um plano escrito antes disso descreveria interfaces que ainda
não existem.

| # | Plano | Depende de | Gate do dono | Estado em 2026-10-21 |
| --- | --- | --- | --- | --- |
| 1 | [Fundação visual Medalhão](2026-10-21-fundacao-visual-medalhao.md): tokens, relevo, fundo, ícones, Skia com Skottie, as cinco ilustrações e o DESIGN.md | — | olhar as ilustrações no simulador (tarefa 7) | escrito |
| 2 | Trilha Medalhão: medalhas, caminho, estados, estrelas, cabeçalho da unidade e o momento do Pixel, sobre o `JourneyProgressService` | 1 | — | a escrever |
| 3 | Aula-bancada: o passo de bancada no `ActivityRendererRegistry`, o shader da radiografia simulada e as aulas de exemplo | 1 | **revisão do conteúdo** das aulas de exemplo | a escrever |
| 4 | Retirada e recomeço: inventário, remoção do conteúdo e dos validadores, recomeço dos stores, Maestro e testes | inventário: nenhum; remoção: 3 | **aprovação do inventário** antes de apagar, e mudança do `.loop/project.yaml` | a escrever |
| 5 | Demais telas no mundo Medalhão: Perfil, assinatura, revisão, onboarding e resultados | 1 | — | a escrever |

**Paralelismo:**
- o inventário do plano 4 só lê o repositório e pode correr junto com o plano 1;
- os planos 2, 3 e 5 dependem só do 1 e não tocam os mesmos arquivos, então
  podem correr em sessões separadas, um escritor do Loop por vez.

**Saída para a loja:** nenhuma build de loja antes de os cinco planos estarem na
`main` **e** existir o primeiro lote do currículo novo, que é o projeto seguinte,
com o dono. Build e distribuição continuam com o dono.
