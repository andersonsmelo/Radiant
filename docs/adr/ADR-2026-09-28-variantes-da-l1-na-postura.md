# ADR — Variantes da L1 na mesma postura, só com vistas reais, e o h08 no ventral visto por trás (2026-09-28)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-28, de manhã, na
conversa que executou o item 7a da FILA. O agente levou o conflito e duas
opções com recomendação, e o dono escolheu a recomendada nas duas perguntas.  
**Registro:** as razões são a leitura do agente apresentada ao dono, e não
palavras dele.  
**Escopo:** currículo V3, piloto da lição híbrida da L1
(`radiant-app/src/features/curriculum-v3/hybrid-l1/`).  
**Complementa:** a [ADR de 2026-09-25](ADR-2026-09-25-amostra-l1-d4-e-planos.md),
item 1, e a [spec do piloto](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md),
que dizia "variação: outra postura, outro par".

## Contexto

- **O desenho é uma figura só.** No decúbito, ela é girada (90° no dorsal,
  −90° no ventral), e na vista por trás é espelhada
  (`bodyMapGeometry.ts`). Por isso dois dos seis cenários só existiriam com o
  corpo visto por baixo da mesa:
  - **dorsal visto por trás**, que a ADR de 2026-09-25 (1b) já tirou das
    variantes;
  - **ventral visto de frente**, que a ADR não citou, e que o item-base
    **h08** usava.
- **Sobra uma vista real para cada decúbito:** o dorsal visto de frente e o
  ventral visto por trás.
- **Três regras não cabiam juntas:**
  - a variante de um item do ventral tem de cair no ventral (ADR de
    2026-09-25, 1a);
  - a variante volta "em outro cenário" (a regra do código);
  - só valem vistas reais (1b).

  Sem outra vista real no ventral, a variante do h10 repetiria o desenho e a
  resposta, e seria outra duplicata.

## Decisão

1. **Caminho 1: a variante fica na mesma postura,** porque ela retesta a
   confusão daquela postura, pela mesma razão da ADR de 2026-09-25 (1a).
   - Na anatômica, que tem duas vistas reais, a variante troca de vista e
     mantém a pergunta.
   - No dorsal e no ventral, a variante fica na única vista real e
     **pergunta o oposto**: a outra mão, ou o outro termo da relação. A
     resposta muda de lugar no desenho.

   A outra opção levada ao dono era um ciclo só de vistas reais. Nele, as
   variantes do dorsal pulariam para o ventral.
2. **O h08 passa ao ventral visto por trás.** É a vista real, e é nela que a
   frente do corpo fica virada para a mesa, que é o erro de usar a gravidade
   que o item treina.

## Consequências

- **Mudaram 8 dos 20 itens da amostra:** o h08 e as variantes do h05, do h07,
  do h08, do h09, do h10, do h11 e do h12. O antes e o depois estão no
  [relatório](../superpowers/handoffs/2026-09-28-radiant-variantes-l1-relatorio.md).
- **Há duas guardas novas na amostra:**
  - nenhuma pergunta se repete;
  - nenhum item usa as vistas por baixo da mesa.
- **A guarda dos modelos passou a exigir:** a mesma postura, uma vista real,
  a mesma regra e uma pergunta diferente da do item original.
- **Os modelos continuam capazes de gerar os seis cenários.** As guardas de
  geometria usam todos. Só o conteúdo da lição fica restrito às vistas reais.
- **Na variante do h08, que pergunta pela posterior,** o retorno e a dica
  continuam os da relação e falam da anterior ("Anterior é a frente do corpo,
  mesmo deitado"). Isso vale para os dois termos, mas fica à vista do dono na
  revisão.
- **A aprovação continua sendo do dono** (FILA, 7b), e só depois dela o agente
  grava `L1_TEMPLATE_APPROVAL` (FILA, 15).
