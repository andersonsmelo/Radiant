# ADR — Meta diária em XP com quatro tiers (2026-08-13)

**Status:** aceita e implementada
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** refinamento visual e de motivação da Home

## Contexto

A meta diária usava contagem de lições. Esse passo é grosso demais para uma
escolha de quatro níveis: uma lição pode ter duração e recompensa muito
diferentes, e o usuário não consegue perceber uma progressão proporcional.
O fluxo de quiz e de conclusão já produz um recibo de XP único, que é a unidade
de progresso visível em todas as superfícies de gamificação.

## Decisão

Medir a meta diária em **XP ganho no dia local** e oferecer quatro escolhas:

| Tier | Meta |
| --- | --- |
| Começar | 10 XP |
| Ritmo | 20 XP |
| Foco | 35 XP |
| Desafio | 50 XP |

O tier padrão é Começar. A troca de tier mantém o XP já ganho, limitado à nova
meta. A configuração e o total diário continuam na chave local versionada v1;
os nomes internos legados (`goalPerDay` e `completedToday`) permanecem apenas
como compatibilidade de armazenamento, enquanto o contrato de tela expõe
`goalXp`, `earnedXpToday` e `tierId`.

## Consequências

- quiz e conclusão de lição registram o XP efetivamente concedido, em vez de
  incrementarem uma lição artificial;
- o anel e a missão diária usam a mesma unidade de XP;
- mudança futura de recompensa não exige redesenhar os tiers;
- não há migração destrutiva, sincronização remota nem alteração do gate de
  produção nesta decisão.

## Alternativa descartada

Manter lições/dia: simples, mas não oferece quatro degraus úteis e desconecta a
meta diária do feedback de XP que o produto já ensina ao usuário.
