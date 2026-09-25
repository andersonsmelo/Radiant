# ADR — O roteiro do StoreKit no aparelho deixa de medir o modo avião (2026-09-24)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-24, durante o teste
no aparelho ("pra mim não faz sentido funcionar offline, a maioria dos apps
que usamos como referência não funciona")  
**Escopo:** Radiant 1.4 · item 4 da lista de pendências · roteiro da fatia 2
(StoreKit)  
**Insumos:** [evidência do StoreKit no iPhone](../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)

## Contexto

O roteiro da fatia 2, na FILA, pedia para abrir o app em modo avião com a
assinatura ativa e ver se `willRenew` responde sem rede. Se o cartão dissesse
"Cancelada", a copy precisaria de decisão.

Na build `development`, abrir o app do zero sem rede é impossível, porque o
JavaScript vem do Metro. Só uma build `preview` mediria isso.

O Radiant é local-first: a trilha funciona sem rede. O risco, então, não é o
app parar offline, e sim o texto da assinatura. Pela leitura do código, um
estado de renovação desconhecido já vira "Cancelada", com ou sem rede (achado
2 da evidência). As vidas ilimitadas não dependem desse campo.

## Decisão

1. **O modo avião sai do roteiro do item 4.** O dono aceita o risco de um
   assinante sem rede ver o texto errado.
2. **Isso não encerra o achado 2 da evidência.** O estado desconhecido
   aparecer como "Cancelada" vale também com rede, e segue na FILA como defeito
   candidato do agente.

## Consequências

- O item 4 deixa de depender de uma build `preview` para esse ponto.
- Se o defeito candidato for corrigido, e o estado desconhecido deixar de
  virar "Cancelada", o cenário offline fica coberto pela mesma regra, sem teste
  no aparelho.

## Alternativas descartadas

- **Gerar uma build `preview` só para medir offline:** custa uma build e mede
  um cenário que o dono não considera parte do produto.
