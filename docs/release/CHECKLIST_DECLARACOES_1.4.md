# Checklist de declarações à loja — Radiant 1.4

**Origem:** §9 da [spec da 1.4](../superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md).
**Preparado em:** 2026-09-22 (Task 8, fatia 5 de 6).

A spec dá a tabela do que muda. Este documento faz a outra metade: **confere cada
declaração contra o que o código e a configuração de fato fazem**, e diz o que
remede a afirmação quando ela envelhecer. Declaração de loja que não sobrevive a
uma remedição não é declaração, é intenção.

> ⚠️ **Este checklist está incompleto de propósito.** As linhas de assinatura
> dependem do adaptador StoreKit real, que é a fatia 2 e ainda não existe
> (`expo-iap` não instalado). Elas estão marcadas ⏳ e **não devem ser
> preenchidas no App Store Connect** antes de a fatia 2 fechar.

---

## A medição que sustenta quase tudo

```bash
cd radiant-app && npx eas env:list --environment production
```

**Medido em 2026-09-22:** o ambiente `production` do EAS contém **uma única
variável** — `EXPO_PUBLIC_SENTRY_DSN`, marcada como sensível.

Isso é o que sustenta a declaração de privacidade, e sustenta por construção, não
por promessa:

| Porta de saída | Portão | Estado em produção |
| --- | --- | --- |
| Sentry | `ENABLE_CRASH_REPORTING && SENTRY_DSN` (`features/telemetry/bootstrap.ts`) | **fechado** — a flag não existe no ambiente e o default é `false`, então `Sentry.init` não roda |
| API (auth, sync, catálogo remoto) | `isApiConfigured()`, que exige `API_BASE_URL` (`lib/api.ts:33`) | **fechado** — a variável não existe no ambiente |
| Sync remoto | `ENABLE_REMOTE_SYNC`, default `false` (`config.ts:18`) | **fechado** |

**Conclusão medida: nenhum dado sai do aparelho num build de produção da 1.4 como
ela está configurada hoje.**

> 🔴 **Se essa saída mudar, a Privacy Label muda junto.** Qualquer variável nova
> que apareça naquele comando — em especial `EXPO_PUBLIC_API_BASE_URL` ou
> `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` — obriga a reavaliar a linha 2 abaixo
> **antes** de submeter. Rode o comando na mesma sessão em que preencher o
> formulário; não confie nesta página.

---

## As seis declarações

### 1. "Funciona offline, sem conta" — ✅ verdadeiro

Inalterado em relação à 1.3.1. O backup é iCloud e é **opcional**; a regra 7 da
[ADR do StoreKit](../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)
fixa que nenhuma tela de estudo depende de rede, conta ou assinatura, e a
validação física de 2026-09-16 mostrou restauro e opt-out funcionando.

**O que remede:** instalação limpa sem rede, percorrendo uma lição inteira.

### 2. Privacy Labels — ⚠️ depende de uma decisão sua, e a decisão muda a resposta

| Cenário | Declaração correta |
| --- | --- |
| **Como está hoje** (flag ausente) | **Dados não coletados** — verdadeiro e verificável |
| **Se você ligar `EXPO_PUBLIC_ENABLE_CRASH_REPORTING`** | **Dados de falha, não vinculados** — e nada mais |

A spec §9 antecipa o segundo cenário. **Ele ainda não é o caso.** Ligar a flag é
decisão de loja, não de engenharia, e precisa acontecer *antes* de preencher o
formulário, nunca depois.

Se ligar, o que sairia do aparelho está fixado e é auditável em
`buildSentryOptions` (`features/telemetry/bootstrap.ts`), com guarda por AST de
que o SDK só é inicializado por essa função:

- `sendDefaultPii: false`, `tracesSampleRate: 0`, `enableNativeFramesTracking: false`
- `beforeSend` remove `user`, `server_name` e nome de aparelho
- `beforeBreadcrumb` descarta migalhas `console`, `xhr` e `fetch` — as que
  carregariam resposta digitada em lição ou corpo de requisição
- `maxBreadcrumbs: 20`

Isso corresponde a **"Diagnóstico → Dados de falha", não vinculado à identidade e
não usado para rastreamento**. Nenhuma outra categoria se aplica.

> 📌 **O defeito aberto do `ENABLE_REMOTE_SYNC` não afeta esta declaração, e vale
> dizer por quê.** O [STATUS](../STATUS.md) registra que a flag não desliga o
> `AuthService`, que decide por `isApiConfigured()`. Isso é verdade — e é inerte
> em produção, porque `API_BASE_URL` não existe naquele ambiente. O defeito é
> real e continua aberto; ele só não é **alcançável** na configuração que é
> submetida. Se um dia uma URL de API entrar no ambiente de produção, ele deixa
> de ser inerte e esta linha muda.

### 3. Login necessário para revisão — ✅ não

Inalterado. Não há conta própria na 1.4 (§7 da spec adia com motivo), e a tela de
Perfil já teve o cartão de conta escondido em 2026-09-11 justamente porque não há
sync remoto.

### 4. In-App Purchase — ⏳ **bloqueado na fatia 2**

Assinatura auto-renovável, grupo **Radiant Ilimitado**, dois produtos fixados na
ADR:

| Plano | Product ID | Preço |
| --- | --- | --- |
| Mensal | `com.andersonmelo.radiant.ilimitado.mensal` | R$ 19,90/mês |
| Anual | `com.andersonmelo.radiant.ilimitado.anual` | R$ 149,90/ano |

**Não declare ainda.** Hoje o app embarca o `UnavailableStoreKitAdapter`, que
responde `store-unavailable` em toda operação — declarar IAP num binário que não
tem StoreKit é descrever uma tela que o revisor não vai encontrar, que é
exatamente a diretriz 2.3.3 que já custou capturas nesta conta.

Quando a fatia 2 fechar, esta linha precisa de:
- [ ] notas para a equipe de revisão explicando que o benefício pago é **vidas
      ilimitadas e somente isso** (regra 5 da ADR)
- [ ] conta sandbox testada no TestFlight, caminho dourado completo (risco
      declarado na §11 da spec)
- [ ] confirmação de que restauração de compras usa StoreKit (regra 6)
- [ ] Compartilhamento Familiar **desativado** (regra 9)

### 5. Acordo de apps pagos — ⏳ **obrigatório antes da submissão, e é seu**

A ADR registra em 2026-09-15: acordo aceito, formulário fiscal do Brasil ativo,
W-8BEN ativo, conta bancária **enviada, com processamento final a confirmar**.

> 🔴 **Aceitar os termos não ativa o acordo.** A ativação depende de dados
> bancários processados e formulários fiscais completos. Os três estados
> possíveis são *Ativo*, *Pendente* e *Ação necessária* — e só o primeiro permite
> vender. **Verifique o estado real antes de submeter**, em App Store Connect →
> Negócios → Acordos, Impostos e Bancos.

Sem acordo **Ativo**, os produtos de assinatura não podem ser enviados — e a
regra 8 da ADR diz que eles não sobem sozinhos: **viajam com a versão 1.4.0**.

### 6. Item 7 — educacional, não diagnostica — ✅ inalterado

Decidido pelo dono em 2026-09-11 e respondido à Apple em 2026-09-12. A
classificação etária já responde *Informações médicas ou sobre tratamentos:
pouco frequente*, coerente com esta posição. A declaração de direitos de conteúdo
em *Informações do app* continua "Sim, este app tem os direitos necessários".

---

## Ordem de execução

Nada aqui é preenchido antes da hora. A ordem importa porque três linhas dependem
de trabalho que ainda não existe:

1. **Fatia 2** (adaptador StoreKit) fecha → linha 4 fica preenchível
2. **Você decide** sobre `EXPO_PUBLIC_ENABLE_CRASH_REPORTING` → linha 2 fica
   decidida, num sentido ou no outro
3. **Você confirma** o acordo de apps pagos em *Ativo* → linha 5 fecha
4. **Remedir** `npx eas env:list --environment production` na mesma sessão do
   preenchimento → confirma a linha 2 contra o ambiente real
5. Só então **bump para 1.4.0** (fatia 6) e submissão, com os produtos junto

## Pendências que este checklist não cobre

- **Capturas da página do produto.** A 1.3.1 já teve as seis trocadas em
  2026-09-12. A 1.4 muda o fluxo do usuário; se as telas mudarem, as capturas
  precisam mudar **junto com o binário**, pela mesma diretriz 2.3.3.
- **Disponibilidade.** Segue em 1 país (Brasil). Se a 1.4 entrar em país da UE, a
  declaração de comerciante do DSA passa a ser exigida — hoje ela perde o objeto.
