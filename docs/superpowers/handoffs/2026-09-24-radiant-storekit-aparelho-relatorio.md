# Relatório — StoreKit no aparelho, item 4 da 1.4 (2026-09-24, noite)

**Frente:** item 4 do [prompt de continuidade (3)](2026-09-24-radiant-prompt-de-continuidade-3.md),
que é do dono: build `development`, sandbox e iOS 27. O agente disparou as
builds com autorização do dono, subiu o Metro, conduziu o roteiro e registrou
o resultado.  
**Branch:** `fix/e2e-defeitos-2-e-3`, local, **sem push** (13 commits além da
`main`, medido em 2026-09-24).

## Entregue

- `fd0c630`: o perfil `development` do EAS desliga o upload de source maps do
  Sentry, e `development-simulator` e `e2e-test` herdam. Há um contrato que
  exige isso de todo perfil, com a herança resolvida. Ele foi visto vermelho
  nos três perfis e passou com o conserto.
- Build `development` `ac4b49df`: é a **primeira compilação real do Swift do
  StoreKit**, e foi instalada num iPhone com iOS 27.2.
- A [evidência](../../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)
  do roteiro no aparelho.
- Uma [ADR](../../adr/ADR-2026-09-24-storekit-roteiro-no-aparelho.md) com a
  decisão do dono de tirar o modo avião do roteiro.
- FILA, STATUS e roadmap (K6) atualizados.

## Medido e não verificado

Os dois estão na evidência. Em resumo:
- **passaram:** abertura no iOS 27.2, preços da Apple em reais, compra mensal,
  telas de assinante, ∞ no HUD, renovação acelerada, expiração sozinha e
  reinstalação;
- **faltam:** compra anual, cancelamento (os Ajustes do iOS 27.2 fecham),
  toque em Restaurar, Ask to Buy e VoiceOver;
- **reembolso:** depende de uma decisão do dono;
- **modo avião:** saiu do roteiro.

## Achados, na FILA e nenhum bloqueando

1. Um estado de renovação desconhecido aparece como "Cancelada". Foi lido no
   código, e o texto do conserto é decisão do dono.
2. Os preços ficam na loja de antes até o app recarregar. Foi medido.
3. "Gerenciar" não gerencia. É decisão de produto.
4. O aparelho esquentou com a build `development`. A hipótese é o fundo
   animado, sem medição.

## Erros do agente nesta sessão

- Passou ao dono o IP de uma interface que já não estava associada à rede, e
  isso custou uma tentativa de conexão.
- Sugeriu, como e-mail da conta de teste, um alias de um Gmail que não é do
  dono. O código de verificação foi para uma caixa que não é dele, e a conta
  foi recriada com um endereço do dono. A conta errada já não aparecia na
  lista de testadores às 19:40, que tinha só a conta nova.
- Levantou a hipótese de isolamento de rede antes de repetir a medição; uma
  reconexão resolveu.

## Próximo

- **Dono:**
  - push e merge, de cima para baixo;
  - VoiceOver (4b);
  - compra anual e Ask to Buy, na mesma build, que continua instalada;
  - decidir o reembolso e o texto do estado desconhecido.
- **Agente:** o dia 2 do E2E, a partir de 2026-09-25 às 11:55, numa conversa
  nova.
