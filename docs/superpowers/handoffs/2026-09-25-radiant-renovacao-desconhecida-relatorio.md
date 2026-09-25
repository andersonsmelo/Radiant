# Relatório — renovação desconhecida deixa de aparecer como "Cancelada" (2026-09-25)

**Decisão:** opção 2A da
[ADR de 2026-09-25](../../adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md).  
**Branch:** `fix/renovacao-desconhecida`, empilhado sobre
`fix/defeito-1-licao-concluida`, sem push e sem build.

## O defeito

Quando o iOS não informa se a assinatura vai renovar, o Swift devolve `nil` e
omite a chave `willAutoRenew` (`RadiantStoreKitModule.swift:168-178`).
- O adaptador convertia isso em `false` (`willAutoRenew === true`), e a
  releitura do armazenamento fazia o mesmo (`SubscriptionService.ts:58`).
- O resultado: o cartão e a tela diziam "Cancelada" a um assinante pagante.
- Isso não era descuido. Havia um teste com o nome "a porta não promete o que
  a Apple não confirmou", e a ADR 2A substitui essa decisão.

## O conserto

- **O tipo:** `willRenew: boolean | null`, em `SubscriptionEntitlement` e em
  `SubscriptionStatus`. O `null` quer dizer que a Apple não informou.
- **A leitura:** `StoreKit2Adapter` e `parseEntitlement` preservam o
  desconhecido, venha como `null` ou sem a chave.
- **O texto:**
  - no cartão, **"Ativa · acesso até DD/MM/AAAA"**, como diz a ADR;
  - na tela, **"Ativa — acesso até DD/MM/AAAA. Suas vidas são ilimitadas até
    lá."** A ADR fixou só o texto do cartão; o da tela é leitura da sessão
    local, no mesmo registro;
  - "Renova em" e "Cancelada" continuam como antes.
- **Continua valendo o princípio do teste antigo:** a porta não promete
  renovação, porque `null` não é `true`.

**A data sai como DD/MM/AAAA**, pelo mesmo `formatShortDate` dos outros
estados. A ADR escreve "DD/MM", e os outros textos da tela já usam o ano.

## Evidência medida

**Vermelhos antes do conserto,** no Node 20, com `--runInBand`. Os cinco
falharam, cada um pelo seu motivo:

| Teste | Recebido antes do conserto |
|---|---|
| adaptador: renovação `null` vira `willRenew: null` | `willRenew: false` |
| adaptador: chave ausente, como o Swift manda, vira `null` | `willRenew: false` |
| serviço: o desconhecido sobrevive ao armazenamento, offline | `willRenew: false` |
| cartão: "Ativa · acesso até 14/10/2026", sem "Cancelada" | texto não encontrado |
| tela: "Ativa — acesso até 14/10/2026", sem "Cancelada" | texto não encontrado |

**Gate:** `EXPO_NO_DOTENV=1 npm run quality`, no Node v20.20.2:
- exit 0;
- **151 suítes / 1434 testes**, contra 1430 antes: são 5 testes novos, e um
  deles substitui o da decisão antiga;
- lint com 0 erros e os mesmos 26 avisos;
- visual QA sem regressão;
- `tsc --noEmit` sem erro.

## Quem passa a ver o estado novo

Seguindo a lição 2 dos guardas:
- **passa a ver "Ativa":** o assinante cuja informação de renovação a Apple
  não entrega ou não verifica, e que antes lia "Cancelada";
- **não muda nada:** as vidas ilimitadas, que dependem de `expiresAt` e
  `revokedAt`, e não de `willRenew`;
- **o armazenamento antigo:** os valores já gravados como `false` continuam
  `false`. A assinatura só existe a partir da 1.4, e ela ainda não foi
  publicada, então nenhum aluno tem esse armazenamento.

## Não verificado

- **A tela no aparelho:** o sandbox não produz a renovação desconhecida sob
  comando. O texto é coberto pelos testes do cartão e da tela.
- **O caso offline no aparelho:** o modo avião saiu do roteiro pela
  [ADR de 2026-09-24](../../adr/ADR-2026-09-24-storekit-roteiro-no-aparelho.md).
