# ADR — "Gerenciar" abre a folha da Apple; Ask to Buy e, se preciso, o cancelamento vão para o StoreKit Testing (2026-09-25)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-25, às 21:20, na
sessão local. Ele escolheu entre as opções que o agente apresentou: "A. Folha
da Apple" para o "Gerenciar" e "StoreKit Testing" para o Ask to Buy e, se
preciso, para o cancelamento.  
**Registro:** a mesma sessão registrou a decisão por um run do Loop. As razões
em "Alternativas descartadas" são leitura do agente, e não foram ditas pelo
dono.  
**Escopo:** Radiant 1.4 · assinatura (Radiant Ilimitado) · roteiro do StoreKit
no aparelho

## Contexto

1. **"Gerenciar" não gerencia.** No cartão do Perfil, o botão do assinante
   abre a tela interna da assinatura, que só manda o aluno aos Ajustes
   (`SubscriptionScreen.tsx:28`). O módulo Swift não tem função de
   gerenciamento. **Medido no aparelho em 2026-09-24:** quem já assina não
   consegue trocar de plano pelo app, porque a tela de assinante não mostra os
   planos ([evidência](../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)).
2. **O cancelamento está bloqueado no aparelho.** No iOS 27.2 (`24B5089g`), os
   Ajustes fecham ao abrir o gerenciamento do sandbox. A mesma evidência
   registra que as entradas por Desenvolvedor e por App Store foram tentadas.
3. **O Ask to Buy precisa de um grupo familiar no sandbox.** O comportamento
   já está decidido e implementado: o aviso de pedido pendente dura 24 h, e
   planos e Restaurar ficam sempre visíveis
   ([ADR de 2026-09-23](ADR-2026-09-23-decisoes-l2-l1-kill-switches.md),
   item 5). Faltava ver um pedido aprovado e um recusado.

## Decisão

1. **"Gerenciar", opção A:** o assinante gerencia a assinatura pela folha da
   Apple dentro do app, `AppStore.showManageSubscriptions(in:)`.
   - É uma função nova no módulo `radiant-storekit`, exposta pelo adaptador.
   - Onde fica o botão e o que o app faz se a folha falhar são decisões do
     agente na implementação. O texto que manda aos Ajustes continua como
     alternativa.
   - Um run, com teste vermelho antes. O Swift só se confere numa build
     `development` nova, no aparelho, e disparar essa build é do dono.
2. **Cancelamento:** é testado **pela folha do item 1**, na mesma build.
   - **Se a folha também fechar no iOS 27.2,** o cancelamento sai do roteiro no
     aparelho e passa ao StoreKit Testing do Xcode, sem nova decisão, como já
     foi feito com o reembolso
     ([ADR de 2026-09-25](ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md)).
3. **Ask to Buy:** sai do roteiro no aparelho e passa ao **StoreKit Testing do
   Xcode**, no simulador, feito pelo agente.
   - O que se confere: o pedido pendente, um pedido aprovado e um recusado,
     dentro das 24 h do aviso.
   - **Primeiro passo:** conferir que o módulo Swift do app funciona sob o
     StoreKit Testing. Isso não foi medido. Se não funcionar, o item volta ao
     dono, pelo grupo familiar no sandbox.

O **VoiceOver** num iPhone físico não muda: o dono decidiu fazê-lo ele mesmo,
na mesma data, e ele continua bloqueando a 1.4.

## Consequências

- **Saem da lista do dono** o Ask to Buy e a decisão do "Gerenciar". O
  cancelamento continua com ele, mas pela folha, e não pelos Ajustes.
- **Entram para o agente:**
  - implementar a folha, que é parte do item "implementar as decisões do
    StoreKit";
  - o Ask to Buy no StoreKit Testing.
- **O bump para a `1.4.0` passa a depender de:**
  - o VoiceOver, com o dono;
  - o cancelamento, pela folha ou pelo StoreKit Testing;
  - o Ask to Buy, com o agente;
  - uma build `development` nova com a folha.
- **O roteiro do StoreKit no aparelho fica menor:** depois do modo avião e do
  reembolso, sai o Ask to Buy.

## Alternativas descartadas

- **"Gerenciar", B:** um link para `apps.apple.com/account/subscriptions`.
  Funciona em produção, mas a assinatura de sandbox não aparece ali (leitura do
  agente, não medida), então não destrava o teste.
- **"Gerenciar", C:** manter a tela interna. A troca de plano continuaria sem
  caminho no app, e o cancelamento, sem caminho no aparelho.
- **Ask to Buy no sandbox, com grupo familiar:** exige trabalho do dono no App
  Store Connect e no aparelho para conferir um comportamento que já está
  implementado e testado na suíte.
