# Evidência — "Gerenciar", cancelamento e preço da loja no iPhone com iOS 27.2 (2026-09-27)

**Itens:** 19a e 4 da ordem de prioridade da [FILA](../../../docs/FILA.md), pelas
ADRs [do "Gerenciar"](../../../docs/adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)
e [dos planos e do preço](../../../docs/adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md).

**Quem executou:** o dono, no aparelho, das 17:40 às 18:07 (−03). O agente
conduziu o roteiro, subiu o Metro e conferiu a rede pelo Mac. Tudo o que está
marcado como visto foi visto em prints do dono.

**Aparelho:** o mesmo iPhone 16 (`iPhone17,3`) com iOS 27.2 da
[evidência de 2026-09-24](2026-09-24-storekit-development-iphone.md), com a
conta de teste do sandbox do Brasil e renovação a cada 5 minutos.

## A build

| Id no EAS | Commit | Perfil | Resultado |
|---|---|---|---|
| `c4eeeb44-9d45-446c-b6dd-7b4e9e67472a` | `4afcd15` | `development` | `finished`, das 17:40:37 às 17:45:41 |

- **É a primeira build real com o eas-cli 24.8.0** (achado 6 da FILA). Desta
  vez não apareceu o falso "Build request failed" que o 16.32 imprimia.
- O eas-cli pediu login na conta Apple. O dono entrou e escolheu o provider
  `ANDERSON MELO (129252270)`, da mesma equipe (`6M6L7MMMU6`) das credenciais
  de 2026-09-24. Depois reusou o provisioning profile, que já tinha o iPhone.

## Metro

- Node `v20.20.2`, com as variáveis e a checagem de precedência de ambiente do
  `scripts/start-ios-v2.sh`, e `npx expo start --dev-client`.
- O endereço `192.168.3.43:8081`, no Wi-Fi "Work", respondeu
  `packager-status:running` no Mac.
- **A primeira tentativa do iPhone falhou.** O iPhone estava na mesma rede
  (`192.168.3.15`), e o ping do Mac para ele respondia. O que resolveu foi
  **ligar a permissão de Rede Local do Radiant**, em Ajustes → Privacidade e
  Segurança → Rede Local. Uma instalação nova pode deixá-la desligada.

## Medido

| O que | Resultado | Detalhe |
|---|---|---|
| Compra mensal no sandbox | ✅ | ∞ no HUD, "Assinante · vidas ilimitadas" e "Renova em 27/09/2026" no cartão |
| **"Gerenciar assinatura" abre a folha da Apple** | ✅ | "Editar assinatura", `[Sandbox]`, "Radiant Ilimitado Mensal", "R$ 19,90 por mês", "Data de renovação: 27/09" |
| **Cancelar pela folha** (item 4) | ✅ | "Confirme o cancelamento" e, em seguida, "Você cancelou sua assinatura · Sua assinatura expira em 27/09" |
| **A tela atualiza sozinha** | ✅ | Pelo relato do dono: a tela interna passou a "Cancelada" sem ele sair dela. O cartão do Perfil mostrou "Cancelada · válida até 27/09/2026". O momento exato, ao confirmar ou ao tocar em "Concluído", não foi separado |
| **Troca de plano** (achado 3) | ✅ | A folha oferece "Ver todos os planos", o caminho que faltava para quem já assina |
| **Expiração depois do cancelamento** | ✅ | Às 18:07, o cartão voltou a "Conhecer", com as 5 vidas, depois de o período de 5 minutos do sandbox vencer |
| Ordem dos planos | ✅ | Mensal primeiro. É uma amostra só: quem prova a ordem é o teste |
| Ajustes → Desenvolvedor → conta de sandbox | ✅ abriu | Em 2026-09-24, o gerenciamento dessa conta fechava os Ajustes. Desta vez a tela "Ajustes da conta" abriu, e "Finalizar sessão" funcionou |

## Não reproduzível neste aparelho

**O preço que acompanha a troca de loja.** Com a sessão de sandbox encerrada,
a tela de planos continuou em **R$ 19,90 e R$ 149,90**, e não em dólar. Por
isso a troca de moeda não pôde ser provocada.

- **Leitura do agente, não medida:** sem a conta de sandbox, o StoreKit usa a
  loja da conta real da App Store do aparelho, que é brasileira. O US$ de
  2026-09-24 veio de um estado que não se sabe refazer.
- **Exercitar exigiria um testador de sandbox de outro país.** O dono decidiu
  não criar agora:
  - ninguém é cobrado errado, porque a folha da Apple sempre mostra e cobra o
    preço certo;
  - o conserto está coberto por teste, visto vermelho;
  - o caso é raro.
- **Consequência:** a conferência "basta reabrir a tela", pedida pela ADR,
  também não foi feita.

## Não verificado

- Ask to Buy. Passou ao agente, no StoreKit Testing do Xcode.
- VoiceOver. Continua com o dono.
- Tocar em "Restaurar compras".
