# ADR — Lição híbrida e custo de vida por tipo de item (2026-09-23)

**Estado:** aceita
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-23
**Escopo:** formato de lição do currículo V3, gamificação e produção de conteúdo
**Spec:** [`2026-09-23-licao-hibrida-piloto-design.md`](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md)

## Contexto

Medido em 2026-09-23. As aulas publicadas têm 1 a 3 perguntas de múltipla
escolha e nenhum som. O contrato de lição V3 (oito passos) produziu uma lição
aprovada em quatro semanas, e a L2 foi reprovada em seis auditorias.

Duas decisões vigentes se contradizem:

- a [spec V3](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md),
  §5.2, de 2026-08-27, diz que **o erro não retira vidas**;
- a [ADR da 1.4](ADR-2026-09-14-1-4-freemium-por-vidas-storekit-e-icloud.md),
  item 2, de 2026-09-14, diz que **errar em lição nova ou checkpoint consome
  uma vida**.

O dono definiu como prioridade que a lição seja gostosa de fazer, com o
Duolingo como referência.

## Decisão

1. **Formato híbrido.** A lição tem de 3 a 5 minutos e de 10 a 15 itens curtos,
   uma ação por item. A explicação vem no feedback, e o item errado volta no
   fim com variação. O ciclo de oito passos do V3 continua como esqueleto,
   diluído nos itens.
2. **Custo de vida por tipo de item.** Itens de primeiro contato nunca custam
   vida. Itens de desafio e o checkpoint custam uma. Revisão continua sem custo.
   **Vale a partir das lições híbridas.** A 1.4 sai com a regra do item 2 da
   ADR de 2026-09-14, porque suas lições são as legadas.
3. **Som e vibração primeiro.** Uma camada independente do conteúdo, que
   respeita o modo silencioso e tem interruptores no Perfil. O Pixel em Rive a
   cada item fica para uma fase posterior.
4. **Produção por modelos.** Os itens são gerados por regras cujo gabarito é
   calculado pelo código. A IA escreve texto, nunca a resposta. O dono revisa
   a regra, o feedback e uma amostra por modelo. A auditoria independente passa
   a ser por arco e por amostra.
5. **Piloto na L1 do Arco 1**, validado com 3 a 5 pessoas pelos critérios da
   spec, antes de escalar.
6. **A v7 da L2 fica pausada** até o resultado do piloto.

## O que esta ADR substitui

- **Spec V3, §5.2**, a frase "o erro não retira vidas": passa a valer o item 2
  acima.
- **ADR 2026-09-14, item 2**, só para as lições híbridas: o erro em item de
  primeiro contato deixa de consumir vida.
- **Spec V3, §5**: o contrato de oito passos continua valendo como conteúdo,
  mas a forma de percorrer a lição é a do item 1.

## Consequências

- O serviço de vidas precisa conhecer o tipo do item.
- A spec V3 ganha avisos apontando para esta ADR nos trechos substituídos.
- O próximo item executável do currículo deixa de ser a v7 da L2 e passa a ser
  o piloto.
- Os sons precisam de licença para uso comercial; o piloto usa um pacote livre.

## Alternativas rejeitadas

- **Estilo Duolingo puro**: afasta-se do domínio medido e da remediação por
  código de erro, que são o diferencial do Radiant.
- **Ciclo V3 polido**: mantém o custo de produção que gerou uma lição por mês.
- **Todo erro custa vida**: trava o iniciante no meio de uma lição de 10 a 15
  itens.
- **Motor genérico antes do conteúdo**: constrói muito sem saber se o formato
  agrada.
- **Energia gasta por exercício**, como o Duolingo adotou em 2025: rejeitada
  pelos próprios usuários de lá e contrária à ideia de que praticar não deve
  custar.
