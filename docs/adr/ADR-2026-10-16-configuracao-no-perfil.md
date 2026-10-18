# ADR — Configuração vira tela própria, aberta pela engrenagem do Perfil

Data: 2026-10-16. Decisor: Anderson Melo. Fecha o item 32 da FILA (ideia do
dono em 2026-09-28) e complementa o
[ADR de 2026-08-15](ADR-2026-08-15-topologia-de-navegacao-estude-e-perfil.md),
que fez do Perfil a aba de identidade, missões e progresso.

## Contexto

Medido no código e no simulador em 2026-10-16: a aba Perfil empilhava numa
rolagem só a identidade, as missões, a assinatura, o backup no iCloud, sons e
vibração e o progresso. Dentro do progresso embutido vinham ainda a conta e
sincronização (só com o sync remoto ligado), a ajuda e informações com
"Rever apresentação" e, no build de desenvolvimento, a porta do console.

O pedido do dono: tudo o que for possível classificar como configuração vai
para uma subtela chamada Configuração.

## Decisão

- **Navegação:** uma engrenagem no cabeçalho do Perfil abre a tela
  Configuração (`/settings`), empilhada, com "‹ Perfil" para voltar. Foi a
  opção recomendada, escolhida pelo dono entre três: abas no topo do Perfil e
  uma linha no fim da rolagem foram descartadas.
- **Vão para a Configuração:** assinatura, backup no iCloud, sons e vibração,
  conta e sincronização, ajuda e informações com "Rever apresentação" e a porta
  do console de desenvolvimento, que segue atrás de `SHOW_DEV_TOOLS`.
- **Assinatura vai junto**, por decisão do dono: gerenciar o plano é
  configuração. A oferta de assinatura continua na folha de vidas da trilha.
- **Ficam no Perfil:** identidade, missões (com o cartão de vidas) e progresso.

## Consequências

- A conta e sincronização virou componente próprio (`AccountSyncCard`), com os
  mesmos handlers. Ela continua invisível em produção, onde o sync remoto e a
  API estão desligados. Os espaçamentos passaram aos tokens do design system,
  e a mudança visual só aparece nesse cartão de homologação.
- O Perfil deixou de chamar `AuthService.bootstrap()` pela `ProgressScreen`. O
  bootstrap continua no startup (`_layout.tsx`), e o cartão de conta o chama
  ao abrir a Configuração, quando o sync existe.
- Os roteiros Maestro não tocavam os cartões movidos. O `store-capture`
  continua achando "Desafios de hoje" no Perfil, e a captura `06-perfil` ganha
  a engrenagem no cabeçalho.
- Implementação e testes:
  [`evidence/2026-10-16-configuracao-no-perfil.md`](../evidence/2026-10-16-configuracao-no-perfil.md).
