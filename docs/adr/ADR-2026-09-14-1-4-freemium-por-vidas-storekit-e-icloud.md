# ADR 2026-09-14 — 1.4: freemium por vidas, assinatura por StoreKit direto, backup no iCloud

**Data:** 2026-09-14 · **Decisor:** dono do projeto · **Estado:** aceita ·
**Spec:** [`superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](../superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md)

## Contexto

A 1.3.1 (11) foi aprovada e publicada em 2026-09-14. Tudo o que a Apple leu
afirma: funciona offline, sem conta, não coleta dados, é educacional. A 1.4 é
a primeira versão desenhada para ter clientes pagantes, e cada decisão abaixo
foi tomada para que essas frases continuem verdadeiras.

## Decisões

1. **Modelo: freemium.** Não há assinatura obrigatória nem trial na 1.4.
2. **Barreira gratuita: vidas.** Cinco vidas; errar em lição nova ou
   checkpoint consome uma; +1 a cada 30 minutos (constante `REFILL_MIN`);
   concluir uma revisão devida devolve uma. **Revisão nunca consome vida.**
   Assinante tem vidas ilimitadas. Assinatura expirada devolve a CHEIA, nunca
   a zero. A brecha do relógio do aparelho fica aberta de propósito: sem
   servidor não há arbitragem, e o custo de um aluno grátis burlar vidas é
   zero.
3. **Conta: opcional, só para guardar progresso.** Nunca é barreira, nunca é
   exigida para assinar.
4. **Primeiro uso: boas-vindas → primeira lição**, sem escolhas nem
   diagnóstico.
5. **A trilha decide o próximo nó** (`NextNodeResolver`): lição pausada >
   revisão devida > checkpoint destravado > próxima lição. Recomenda, não
   tranca.
6. **Forma do dia: trilha soberana.** Sem sessão guiada, sem aba de prática.
   Nenhuma superfície além das obrigatórias: folha de vidas, tela de
   assinatura, cartão de backup.
7. **Assinatura por StoreKit 2 direto**, sem SDK de terceiro. A transação fica
   entre o aparelho e a Apple; as Privacy Labels não mudam.
8. **Backup por iCloud (CloudKit, banco privado)**, sem backend próprio. Sem
   e-mail, sem conta a excluir, sem dado pessoal na mão do projeto. Não cobre
   Android e não cria relação com o cliente — motivos legítimos para uma
   conta própria numa versão futura, não nesta.
9. **Sentry ligado**, configuração mínima. Única mudança de rótulo: *Dados de
   falha, não vinculados a você*.
10. **Regra de ouro:** toda tela de estudo funciona sem rede, sem conta e sem
    assinatura.

## O que esta ADR substitui

- A regra de consistência "vidas não podem bloquear novas lições" em
  [`ARCHITECTURE_STATE.md`](../ARCHITECTURE_STATE.md) **deixa de valer**:
  vidas bloqueiam lição nova e checkpoint; **não bloqueiam revisão** — que é o
  que preserva o método para quem não paga.
- A decisão de 2026-09-11 "login e assinatura são feature da 1.4" é
  refinada: a assinatura entra; o *login* com conta própria **não** — o
  backup no iCloud o substitui.

## Consequências

- Do dono, fora do app: acordo de apps pagos no App Store Connect; produto de
  assinatura (grupo "Radiant Ilimitado", mensal e anual) e preço; DSN do
  Sentry no perfil `production` do EAS; entitlement do iCloud.
- Do código: `HeartsService`/`HeartsRepository`, `NextNodeResolver`,
  `SubscriptionService`, `ProgressSyncService`, migração de armazenamento
  1.3.1 → 1.4 com backup. Contratos entregues em 2026-09-14
  (Tasks 1–7); adaptadores nativos (StoreKit, iCloud, Sentry) pendentes dos
  gates do dono (Task 8).
- Da loja: a 1.4 vai à revisão com In-App Purchase; o revisor testa em
  sandbox; "sem conta, offline" continua verdadeiro.
