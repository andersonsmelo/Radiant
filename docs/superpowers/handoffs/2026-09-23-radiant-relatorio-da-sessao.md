# Relatório — sessão de 2026-09-22 (noite) a 2026-09-23

Sessão que começou do
[prompt de 2026-09-22](2026-09-22-radiant-prompt-de-continuidade.md) e passou
por oito entregas, cada uma num run próprio do Loop. O dono decidiu cada item em
aberto nesta conversa; as decisões estão nas ADRs citadas.

## O que foi entregue

| Entrega | Onde | Estado |
| --- | --- | --- |
| Parecer v6 da L2 — **reprovado** pelo Q1 | `b05c39e`, [registro](../../content/2026-09-22-l2-parecer-v6.md), [relatório](2026-09-22-radiant-l2-parecer-v6-relatorio.md) | no PR #15 |
| Decisão: StoreKit 2 por **módulo Expo local**, sem `expo-iap` | `78cf794`, [ADR](../../adr/ADR-2026-09-23-storekit-modulo-expo-local.md) | no PR #16 |
| Prompt da fatia 2 | `92a5035` | no PR #16, executado por outra sessão |
| Fatia 2 — `StoreKit2Adapter` e `modules/radiant-storekit` (autoria de outra sessão; commit e gate reproduzido por esta) | `000daef`, [relatório](2026-09-23-radiant-1-4-storekit-fatia-2-relatorio.md) | no PR #17 |
| Decisões do dono (I2, C6 na L1, kill switches) e acordo de apps pagos *Ativo* | `1fae7c6`, [ADR](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md) | no PR #17 |
| Kill switches reais | `14df588`, [vermelhos](2026-09-23-radiant-kill-switches-vermelhos.md) | no PR #17 |
| Flags de analytics apagadas e mecanismo real da privacidade travado | `71b3f92` | no PR #17 |
| Ask to Buy pendente nunca trava (24 h) | `4788aa1`, [vermelhos](2026-09-23-radiant-ask-to-buy-vermelhos.md) | no PR #17 |

Os três PRs estão abertos e empilhados (#15 → #16 → #17); o merge é do dono.

## Medido

- **Acordo de apps pagos *Ativo*** no App Store Connect, lido em 2026-09-23:
  vigente de 15/09/2026 a 01/08/2027; conta bancária e três formulários fiscais
  *Ativos*. Leitura sem clique.
- **Prazo do Ask to Buy: 24 h**, na página de suporte da Apple (105055,
  atualizada em 14/09/2026). A Apple **não avisa** o app de recusa nem de
  expiração, segundo um Frameworks Engineer no fórum de desenvolvedores
  (thread 685183).
- **Gates, sempre `EXPO_NO_DOTENV=1 npm run quality` no Node `v20.20.2`:**
  - `000daef`: 132 suítes / 1163 testes, reproduzido numa worktree limpa;
  - depois dos kill switches: 133 / 1170;
  - depois das flags de analytics: 133 / 1171;
  - depois do Ask to Buy: 133 / 1174.

  Todos saíram 0, com Visual QA sem regressão.
- **Q1 da L2 reconferido no código** pelo controlador, com a aritmética das
  bandas.
- **Toda guarda nova vista falhando** antes da correção e sob mutação, com as
  saídas versionadas.

## Inferido, não medido

- Que a causa comum das reprovações da L2 seja a falta de uma guarda de
  validade semântica escrita **antes** das correções.
- Que `willRenew` sem rede caia em `false` na prática. O código faz isso quando
  a informação não vem; se ela vem offline, ninguém mediu.

## Não verificado

- **Nada em aparelho.** O Swift do `radiant-storekit` nunca compilou contra o
  Expo real. Compra, Ask to Buy recusado ou aprovado, Restaurar, renovação,
  reembolso e `willRenew` em modo avião esperam build interno e sandbox.
- A L2 continua sem VoiceOver, Reduce Motion real e revisão especializada.
- `radiant-app/.env.example` ainda lista as duas variáveis apagadas. O arquivo
  fica fora do `writePolicy.allowedRoots`, e as linhas são inertes.
- A revisão automática do Codex no PR #17 não rodou: o bot ficou sem cota.

## Um achado que vale para o projeto inteiro

Dois documentos de privacidade citavam `ENABLE_PRODUCT_ANALYTICS=false` como o
motivo de nenhum evento sair do aparelho, e a flag não tinha leitor. A afirmação
era verdadeira por outro motivo (nenhum adaptador de analytics registrado), e
nada protegia esse motivo. **Antes de apagar configuração "morta", procure-a
nos documentos: ela pode ser a garantia declarada.**
