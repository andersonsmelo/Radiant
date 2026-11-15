# F8, convites de assinatura: plano

> Execução: nesta sessão (a delegação de 2026-11-13 decide o método), com revisão
> independente por subagente antes do gate final. Passos em `- [ ]`.

**Objetivo:** convidar o aluno gratuito a assinar nos momentos em que o valor da
assinatura é concreto, sem enganar, atrás de `ENABLE_CONVERSION_PROMPTS`, que
nasce desligada.

**Base:** [levantamento](../evidence/2026-11-15-f8-conversao/levantamento.md). O
assinante ganha uma coisa só, vidas ilimitadas; nada mais lê o direito.

## Abordagens consideradas

| | Abordagem | Troca | Decisão |
| --- | --- | --- | --- |
| A | Convite dentro das telas que já são pausa: a folha de vidas (sem vidas) e a comemoração de unidade. A tela de assinatura ganha a comparação. | Nenhuma interrupção nova; reaproveita a folha e o link que já existem. | **Escolhida.** |
| B | Modal próprio disparado por eventos (abertura, sequência em risco, metas). | Mais alcance, mas cria interrupção nova e um momento sem valor concreto. A sequência não depende da assinatura. | Rejeitada. |
| C | Só a comparação na tela de assinatura, sem convites. | Zero risco, mas não chega a quem nunca abre a tela. | Rejeitada: não cumpre a direção. |

Decisão sem pergunta ao dono, pela delegação; registrada na ADR
`ADR-2026-11-15-convites-de-assinatura.md`.

## Restrições globais

- `ENABLE_CONVERSION_PROMPTS = readBooleanFlag(process.env.EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS, false)`.
  Desligada, nada muda: nenhum texto novo, nenhuma escrita em disco.
- No máximo **um convite por dia local**, somando os momentos. Nunca para assinante
  (`unlimited`) nem para pedido pendente (`pending`), nunca sem loja (`storeAvailable()`).
- O convite só aparece em tela que já é pausa e nunca abre tela própria.
  "Voltar" e "Continuar" seguem como saída principal.
- Convite sem preço. Preço só na tela de assinatura, vindo da StoreKit.
- Proibido: urgência, contagem regressiva, desconto, culpa, recusa escondida.
- Amostra: uma vez por aparelho, `SAMPLE_MINUTES = 30` de vidas ilimitadas pelo
  `heartsRepository.setUnlimited` existente, só para quem nunca assinou (`none`).
  É a regra de fim de ilimitado que já existe: as vidas voltam cheias.
- Chave nova `@radiant:conversion_v1`, classe `controle`, com guarda de schema (G7).
- Inserções em `JourneyHomeScreen.tsx`, `LessonFlowScreen.tsx` e `CheckpointScreen.tsx`
  têm uma linha cada, longe das linhas que a F4, a F1 e a F2 mudam.

## Foco da revisão

1. Fuso: o "dia" do limite é o dia local, e não o UTC. Teste com `TZ` do Brasil às 22h.
2. Folha fechada e reaberta no mesmo dia: o link antigo, sem segundo convite.
3. Amostra tomada e depois expirada no meio da aula: a folha não pode reabrir sozinha.
4. Ex-assinante (`expired`): recebe convite, não recebe amostra, porque `refresh` a apagaria.
5. Store de versão mais nova: não grava por cima, não convida.

---

### Tarefa 1: interruptor, chave e serviço

**Arquivos:** `config.ts`, `config/killSwitches.contract.test.ts`,
`constants/storageKeys.ts` (`CONVERSION`), `storage/storageInventory.ts`,
`features/conversion/ConversionService.ts` e `.test.ts`.

**Produz:**

```ts
type ConversionMoment = 'hearts-empty' | 'unit-complete';
type FunnelEvent = 'invite_seen_hearts_empty' | 'invite_seen_unit_complete'
  | 'screen_opened' | 'purchase_started' | 'purchase_completed' | 'sample_taken';
type ConversionStateV1 = { schemaVersion: 1; lastInviteDay: string | null;
  sampleTakenAt: string | null; counts: Record<FunnelEvent, number> };
class ConversionService {
  constructor(deps?: { storage?; subscription?: { getStatus(nowMs): Promise<SubscriptionStatus>; storeAvailable(): boolean };
    hearts?: { setUnlimited(until: string | null, nowMs: number): Promise<HeartsSnapshot> }; enabled?: () => boolean });
  enabled(): boolean;
  takeInvite(moment, nowMs): Promise<{ sampleAvailable: boolean } | null>; // marca o dia e conta
  takeSample(nowMs): Promise<HeartsSnapshot | null>;
  record(event: FunnelEvent): Promise<void>; // nada com a chave desligada
  read(): Promise<ConversionStateV1>;
}
export const conversionService: ConversionService;
```

- [ ] Vermelho: `killSwitches` exige `ENABLE_CONVERSION_PROMPTS` com padrão `false`.
- [ ] Vermelho: serviço desligado devolve `null` e não grava; ligado, convida uma vez
  por dia local e conta; recusa assinante, pendente e sem loja; amostra uma vez, só
  para `none`; store de versão nova não é sobrescrita.
- [ ] Verde, e inventário com a chave nova.

### Tarefa 2: comparação verdadeira e tela de assinatura

**Arquivos:** `features/conversion/planComparison.ts` e `.test.ts`,
`features/conversion/components/PlanComparison.tsx`,
`features/subscription/screens/SubscriptionScreen.tsx`,
`SubscriptionScreen.conversion.test.tsx`.

`planComparison(): { label: string; free: string; plus: string }[]` monta as linhas
de `MAX_HEARTS`, `REFILL_MIN` e `REVIEW_REWARD`. A linha das aulas é igual nos dois
planos, de propósito.

- [ ] Vermelho: as linhas citam as constantes (validade); a de vidas difere entre os
  planos (diferença); a de aulas é igual (honestidade).
- [ ] Vermelho: ligada, a tela mostra a comparação e conta `screen_opened`,
  `purchase_started` e `purchase_completed`. Desligada (contraprova), mostra o texto
  da `main` e não escreve a chave.

### Tarefa 3: convite na folha de vidas e na comemoração

**Arquivos:** `features/conversion/useConversionInvite.ts`,
`features/conversion/components/ConversionInvite.tsx` e `.test.tsx`,
`HeartsSheet.tsx` e `.test.tsx`, `UnitCompleteCelebration.tsx` e `.test.tsx`, e
uma linha em cada uma das três telas que montam a folha.

`useConversionInvite(moment, active): { invite: { sampleAvailable: boolean } | null; takeSample(): Promise<HeartsSnapshot | null> }`
chama `takeInvite` uma vez a cada ativação. A folha ganha a prop opcional
`onHeartsChanged(snapshot)`: sem ela, não há botão de amostra. As telas passam
`(s) => { setHearts(s); setHeartsSheetVisible(false); }`.

- [ ] Vermelho: folha sem vidas e chave ligada mostra o convite, com "Conhecer o
  Ilimitado" (44 pt, rótulo), a amostra e "Voltar". Folha com vidas não convida.
  Desligada: o link "Vidas ilimitadas" da `main` e nenhuma escrita.
- [ ] Vermelho: comemoração ligada mostra a linha e o link, e "Continuar" segue
  primário. Desligada, nada novo.

### Tarefa 4: leitura do funil

`features/dev-console/components/ConversionFunnelCard.tsx` e `.test.tsx`, montado
em `DevConsoleScreen.tsx`. Mostra as seis contagens, o último dia de convite e a amostra.

### Tarefa 5: ver, revisar, fechar

Simulador "Radiant F2" com `EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS=true`, lido por
`maestro hierarchy`; revisão independente; gate; ADR; STATUS; PR em rascunho.
