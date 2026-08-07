# ADR — Estratégia da API do Radiant (2026-08-04)

**Status:** **aceita em 2026-08-07 — opção B.** Ficou em rascunho de 2026-08-04 a
2026-08-07 com a linha de decisão em branco de propósito: um ADR sem decisor é
uma nota técnica, e assinar por outra pessoa é o tipo de coisa que este
repositório trata como dívida, não como adiantamento.

**Fecha:** a Task 15 / item D1 do roadmap e o item 6 dos bloqueadores.
**Interage com:** [`ADR-2026-08-01`](ADR-2026-08-01-modelo-de-entitlement-premium.md)
(entitlement premium) e a task E3 (privacy labels e Data safety).

## O que foi medido, e quando

| Fato | Medição |
| --- | --- |
| `api.radiant.ascendcreative.com.br` | **HTTP 502** em `/health` e em `/`, medido em 2026-08-04 |
| Tempo de resposta | 0,27s — o domínio resolve e **há gateway de pé**; o que está fora é o upstream |
| `EXPO_PUBLIC_API_BASE_URL` | **não é declarada em nenhum dos cinco perfis** do `eas.json` |
| Efeito no app | inerte por construção: `SyncQueueService` e a tela de Progresso exigem `isApiConfigured()` **além** da flag |
| `radiant-api` no repositório | **escrito e testado** — 949 linhas de rotas, com suíte irmã por arquivo |

**A decisão não é "construir ou não".** O backend existe: Fastify + PostgreSQL,
JWT com refresh, bcrypt, Zod, rate limiting. A superfície declarada é:

```
/health   /ready
/v1/auth/register  /login  /refresh  /logout  /me
/v1/auth/password-reset/request  /confirm
/v1/content/catalog
/v1/sync/lesson-progress   /v1/sync/review-cards
```

A decisão é **subir, subir em parte, ou arquivar** algo que já está pronto.

## O que a indecisão custa hoje

1. **O estado canônico está travado.** `scripts/qa/docs-contract.mjs` reprova
   qualquer documento que afirme a API disponível. Isso é proteção correta — e é
   também o motivo de o item 6 não poder ser fechado por ninguém sem esta ADR.
2. **Um domínio público responde 502.** Não é neutro: um avaliador de loja, um
   testador curioso ou um buscador encontram um endpoint quebrado com o nome do
   produto.
3. **Nada disso bloqueia o lançamento.** O app é local-first e a evidência de
   2026-08-03 mostra 6/6 nas duas plataformas sem API alguma. Esta ADR não está
   no caminho crítico da F2 nem da submissão.

## A restrição que reduz o espaço de escolha

O [`ADR-2026-08-01`](ADR-2026-08-01-modelo-de-entitlement-premium.md) **já
decidiu conta própria + billing** para o premium, porque billing de loja sozinho
não resolve entitlement cross-platform. Conta própria exige servidor.

Portanto: **"local-first puro para sempre" não é uma opção livre** — ela
contradiz um ADR vigente. Escolhê-la significa reabrir o ADR-2026-08-01 e
redecidir o modelo de premium, não apenas arquivar um backend.

## Opções

### A — Arquivar a API, local-first puro em v1.x

Manter as flags falsas, **derrubar o domínio** ou apontá-lo para uma página
estática honesta, e mover `radiant-api` para um estado explicitamente não
distribuído.

- **Ganha:** zero custo operacional, zero superfície de segurança, zero PII.
  Fecha o item 6 com a resposta mais barata.
- **Perde:** exige reabrir o ADR-2026-08-01 e redecidir o premium da v1.4.
- **Arrasta:** a decisão de premium volta para a mesa.

### B — Só catálogo remoto

Subir apenas `/health`, `/ready` e `/v1/content/catalog`. Sem contas, sem sync.

- **Ganha:** conteúdo atualizável sem release de app — que é o gargalo real de um
  produto editorial como este. **Nenhuma PII**, então E3 e as declarações de loja
  não mudam.
- **Perde:** não destrava o premium; o ADR-2026-08-01 continua esperando.
- **Arrasta:** VPS, deploy, monitoramento e a promessa implícita de manter no ar
  um endpoint do qual o app passa a depender parcialmente.

### C — Catálogo + auth + sync (a superfície completa)

- **Ganha:** destrava multi-dispositivo, elo de conta e o entitlement premium da
  v1.4 exatamente como o ADR-2026-08-01 decidiu.
- **Perde:** é a opção mais cara em operação e em risco.
- **Arrasta, e isto é o ponto de sequenciamento mais importante deste
  documento:** contas significam **coletar e-mail**, o que muda as respostas de
  **privacy labels (App Store) e Data safety (Play)** — que são a task **E3**,
  hoje aberta. Responder a E3 antes desta ADR significa provavelmente
  **respondê-la duas vezes**, e questionário de loja respondido errado é
  retrabalho com revisão no meio.

## Recomendação da engenharia (não é a decisão)

**B**, se a intenção é lançar e iterar conteúdo; **C**, se a v1.4 com premium
está mesmo no horizonte próximo. **A** só com a consciência de que reabre o
premium.

O que **não** recomendo é deixar aberto: a indecisão já custa um 502 público e
trava o estado canônico, e ela vai custar mais caro depois da E3 do que antes.

## Sequenciamento que esta ADR sugere

1. Decidir **esta** ADR.
2. Só então responder a **E3** — porque a resposta depende de haver conta.
3. A F2 e a submissão seguem em paralelo, sem depender de nenhuma das duas.

## Três medições feitas em 2026-08-07, que reduziram o espaço de escolha

Levantadas ao instruir a decisão, e **duas delas corrigem o peso que este próprio
documento dava às opções**:

1. **O custo que assustava em B já tem rede de segurança em código.**
   `RemoteCatalogService.fetchManifest` devolve `null` em qualquer falha — não
   configurado, payload inválido, erro de rede — e o chamador cai no catálogo
   embarcado, gerado de `catalog-payload.json`. Endpoint morto vira **conteúdo da
   última release**, não app quebrado. A "promessa implícita de manter no ar",
   listada acima como custo de B, é menor do que a redação sugeria.
2. **A superfície de B não exige VPS.** `/v1/content/catalog` é um `app.get` que
   devolve um JSON injetado mais um `meta` com timestamp — **sem banco, sem
   estado, sem auth**. Com `/health` e `/ready`, são três GETs essencialmente
   estáticos, servíveis por deploy estático atrás do gateway que já responde.
3. **A dependência da E3 vale para a v1.4, não para a v1.3.**
   `EXPO_PUBLIC_API_BASE_URL` não aparece em nenhum perfil do `eas.json` e as
   telas exigem `isApiConfigured()`: o binário que será submetido **não alcança
   API nenhuma**. As privacy labels da v1.3 são "não coleta" sob A, B ou C. O
   risco de "responder a E3 duas vezes", que a seção de sequenciamento acima
   apresenta como argumento geral, **não se aplica à submissão em curso** — ele
   volta quando a v1.4 introduzir contas. A E3 segue com conteúdo próprio, porque
   o Sentry coleta dados de crash independentemente desta decisão.

## Decisão

**Opção B — só catálogo remoto.** Sobem `/health`, `/ready` e
`/v1/content/catalog`. Não sobem contas nem sync.

**Decisor:** Anderson (proprietário do projeto)
**Data:** 2026-08-07
**Opção escolhida:** **B**
**Razão:** o ganho que compõe neste produto é **conteúdo atualizável sem release
de app** — a cadeia de conteúdo fechou em 2026-08-07 e B é a única opção que a
entrega ao usuário sem passar por revisão de loja. Zero PII, então nada muda nas
declarações de loja, agora ou depois. O custo operacional caiu para perto de zero
com a medição 2 acima, e o risco de indisponibilidade está coberto pela medição 1.
**B não fecha porta nenhuma:** auth e sync entram depois, aditivamente, no mesmo
deploy. **C** foi recusada por pedir operação de auth, reset de senha e refresh de
JWT durante meses antes de existir comprador de premium, enquanto o gargalo real
são 12 opt-ins humanos da F2 — e por ser alcançável a partir de B. **A** foi
recusada por trocar um custo operacional pequeno por reabrir o
[`ADR-2026-08-01`](ADR-2026-08-01-modelo-de-entitlement-premium.md), sendo que
premium cross-platform sem servidor não tem caminho conhecido.

**O que reabriria esta decisão:** a v1.4 com premium entrar no horizonte de
semanas em vez de meses. Aí vale construir a superfície de conta uma vez só,
junto com a E3, em vez de duas.

## O que esta decisão NÃO faz

Ela não sobe nada. **A implantação é trabalho separado e ainda não feito** — o
domínio segue respondendo 502 até que aconteça, e nenhum documento deste
repositório deve afirmar a API disponível antes disso (`scripts/qa/docs-contract.mjs`
reprova quem afirmar).
