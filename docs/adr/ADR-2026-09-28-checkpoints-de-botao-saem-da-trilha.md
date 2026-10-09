# ADR — Os checkpoints de botão saem da trilha; as avaliações da V2 ficam (2026-09-28)

**Status:** aceita; implementada em 2026-09-28, na 1.4, a pedido do dono (FILA, 34;
[relatório](../superpowers/handoffs/2026-09-28-radiant-sem-checkpoints-de-botao-relatorio.md))  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-28, à tarde. O agente
levantou o que o checkpoint faz hoje e levou três opções. O dono escolheu a
recomendada (1).  
**Registro:** as razões são a leitura do agente apresentada ao dono, e não
palavras dele.  
**Fecha:** o item 29 da FILA ("remover o checkpoint até entender a função
dele").

## Contexto

O dono disse, em 2026-09-28, que o checkpoint não parecia importante para o
usuário. O levantamento, feito só lendo o código (`feat/d4-decisoes-de-revisao`,
`5400e16`), achou **dois tipos de checkpoint** na trilha. Nos dois, a lição
seguinte só abre com o checkpoint anterior concluído.

1. **Os das trilhas do catálogo:** Fundamentos de Radiologia (6), Radiação,
   Modalidades e Equipamento (5) e Prática, Qualidade e Profissão (4).
   - São 15 no total, criados em `JourneyDefinitionService.buildUnit`, um entre
     cada par de lições.
   - Nenhum tem lote de produção. A tela mostra um texto e o botão "Concluir
     checkpoint", **sem pergunta nenhuma** e sem custo de vida.
2. **Os da trilha "Matéria, energia e radiação",** a única com lote de
   produção (`ProductionCurriculumCatalog.journeyFor`).
   - São 5, chamados "Avaliação k de 5", um por competência.
   - Cada um faz **2 perguntas** e aprova com ≥ 80 % sem erro crítico, ou
     seja, acertando as duas. Cada erro custa 1 vida, uma vez por pergunta em
     cada tentativa ([ADR de 2026-09-24](ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md)).
   - Na reprovação, a tela mostra o reforço.

As trilhas não têm `order`, e cada uma só abre quando a anterior termina.
Assim, o aluno passa pelos 15 checkpoints de botão antes de chegar às 5
avaliações, que ficam na quarta trilha.

**O "kernel de checkpoints"** (`src/features/student-checkpoints`,
[ADR de 2026-08-09](ADR-2026-08-09-kernel-de-checkpoints-e-loops-do-aluno.md))
é outra coisa, apesar do nome: retomada de sessão, desligada em produção. Esta
decisão não o toca.

## As opções levadas ao dono

1. **Remover só os 15 checkpoints de botão.** As 5 avaliações ficam. É a
   recomendada.
2. **Remover todos.**
3. **Manter como está,** consertando o XP e o reforço.

## Decisão

**Opção 1.**
- Nas trilhas do catálogo, a lição seguinte passa a exigir só a lição anterior,
  sem nó de checkpoint entre elas.
- As 5 avaliações da trilha "Matéria, energia e radiação" continuam como
  estão: gate da competência seguinte, 2 perguntas, custo de vida e reforço.

**Por quê, na leitura do agente:**
- o checkpoint de botão não avalia nada. Para o aluno, é um toque a mais, que
  a trilha apresenta como etapa;
- as avaliações da V2 são a única verificação sem ajuda do currículo por
  competências (`evidenceKind: 'independent-recall'`), e são um dos dois lugares
  onde a regra de vidas vale.

## Consequências

- **Implementação (FILA, 34), em run próprio e com teste vermelho antes:**
  - `JourneyDefinitionService.buildUnit` deixa de criar o nó de checkpoint, e a
    `unlockRule` da lição seguinte aponta para a lição anterior;
  - a tela do checkpoint, a rota e a regra de vidas ficam, porque as
    avaliações usam as três;
  - os fluxos E2E que passam por um checkpoint de catálogo precisam mudar.
    Há 9 fluxos em `radiant-app/.maestro/` que citam "checkpoint", e nem
    todos são desse tipo: vários são do kernel de retomada. Enumere cada um
    antes.
- **Quem já usa o app:**
  - quem concluiu uma lição e não o checkpoint seguinte passa a ter a lição
    seguinte aberta;
  - os ids de checkpoints já concluídos continuam gravados no progresso, sem
    efeito. Isso precisa ser conferido no teste da migração, e não presumido.
- **O que continua valendo para as avaliações que ficam:**
  - **o XP da aprovação** (FILA, 13): aprovar não soma XP, e a tela mostra o
    total, igual ao de antes;
  - **o anúncio da perda de vida** (FILA, 35): o erro na avaliação debita
    vida sem avisar o leitor de tela (`CheckpointScreen.tsx:324`). Isso ficou
    fora do item 25 à espera desta decisão;
  - **o reforço que só existe no texto** (FILA, 36): a tela diz que a
    próxima tentativa só abre depois do reforço, mas nada impede tentar de
    novo ao sair e voltar. A avaliação é chamada sem a tentativa anterior
    (`prior`), então o 2º ciclo de reforço nunca é alcançado. Impor a espera ou
    mudar o texto é decisão do dono.
- **A spec da 1.4** continua certa. A tabela de vidas fala em "checkpoint", e
  agora isso quer dizer as avaliações da V2.
- **Se a remoção entra na 1.4 ou depois** era decisão do dono. Ele decidiu,
  em 2026-09-28, que entra na 1.4, dentro da PR #38.

## Revisão em 2026-10-09 — o XP da aprovação (FILA, 13)

**Decisor:** o dono, na conversa de 2026-10-09, entre três propostas: a regra
da lição, um valor fixo maior e nenhum XP.

- **Quanto:** aprovar uma avaliação da V2 rende XP pela **regra da lição**:
  10 de base, mais 5 com 80 % de acerto ou 8 com 90 % ou mais. A aprovação
  também conta para a sequência e para a meta diária, e paga **só na primeira
  aprovação** do nó, pela mesma régua de elegibilidade da lição.
- **A celebração** mostra o ganho ("+18 XP") e o total já com ele. Sem
  crédito, ela mostra só o total.
- **Na prática, toda aprovação rende 18 XP.** A avaliação do estágio 1 tem 2
  itens, e 80 % de 2 são os 2: aprovar exige 100 %. A contagem dos outros
  quatro estágios não foi conferida.

Implementado no mesmo dia
([relatório](../superpowers/handoffs/2026-10-09-radiant-xp-da-aprovacao-relatorio.md)).
