# ADR — Modelo de entitlement do premium: conta própria + billing (2026-08-01)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto)
**Fecha:** a Decisão 2, deixada em aberto pela
[`ADR-2026-07-31 — Conta de usuário e assinatura premium`](ADR-2026-07-31-conta-e-premium.md)
**Não altera:** a Decisão 1 daquele ADR — a v1.3 continua lançando sem conta

## Contexto

A ADR de 2026-07-31 separou corretamente três perguntas que a frase "o app precisa
de conta para ter premium" junta numa só, decidiu que a v1.3 lança sem conta, e
deixou explicitamente em aberto **qual modelo sustenta o premium**, com duas opções
e um critério de escolha:

> o critério não é preferência: é **se o direito de acesso precisa atravessar
> plataforma ou servidor**.

O critério estava certo. A **conclusão** que ele produzia naquele dia, não.

### A premissa que sustentava a Opção A caiu no dia seguinte

A Opção A (Google Play Billing puro, sem conta própria) foi recomendada com uma
condição de validade embutida na própria frase:

> É o caminho curto, e ele é suficiente **enquanto o produto for só Android** — que
> é o escopo decidido em 2026-07-31 (ver A2 do roadmap).

Esse escopo foi revertido em **2026-08-01**, registrado no
[roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md) e no status
canônico:

| Evento de 2026-08-01 | Estado |
| --- | --- |
| adesão ao Apple Developer Program | ATIVA |
| App ID iOS `com.ascendcreative.radiant` | CRIADO |
| app no App Store Connect | CRIADO, versão `1.3.0` salva |
| build de produção iOS `1.3.0 (4)` | no TestFlight, **Pronta para envio** |
| instalação física no iPhone | CONFIRMADA |

O produto **não é mais só Android**. Aplicando o critério do próprio ADR anterior
ao estado de hoje: o direito de acesso passa a precisar atravessar plataforma, e a
Opção A deixa de ser suficiente — não porque estivesse errada, mas porque a
condição sob a qual ela era suficiente deixou de valer.

### Por que billing de loja não resolve cross-platform sozinho

Uma assinatura vendida pelo Google Play restaura sozinha em qualquer aparelho
logado na mesma conta Google, e uma vendida pela App Store restaura em qualquer
aparelho logado no mesmo Apple ID. As duas restaurações são **internas ao
ecossistema**. Não existe identidade compartilhada entre elas: quem assina no
Android e depois instala no iPhone é, para a App Store, um usuário novo sem
compra alguma.

Ligar as duas exige um identificador que seja do **Radiant**, e não da loja — ou
seja, uma conta própria. Isso vale inclusive usando um agregador de billing: o
identificador anônimo é por dispositivo/loja, e o entitlement só atravessa
plataforma quando existe um id de usuário próprio para ancorá-lo.

## Decisão

Adotar a **Opção B — conta própria (auth) + billing**.

O direito de acesso segue a **pessoa**, não o aparelho nem a loja. Quem assina em
qualquer plataforma tem acesso ao entrar com a mesma conta na outra.

Isso torna a conta de usuário **pré-requisito da monetização**, e não uma feature
paralela a ela. Login, perfil e premium deixam de ser três frentes e passam a ser
uma cadeia com ordem obrigatória.

## O que esta decisão arrasta

Nenhum destes itens é opcional sob a Opção B. Estão listados porque o custo da
opção é a soma deles, não o billing isolado.

1. **API pública de pé.** Hoje `api.radiant.ascendcreative.com.br` responde **502**.
   O `AuthService` e o bloco de login do `ProgressScreen` já existem no código, mas
   são inertes no build distribuído: a interface é condicionada a
   `isApiConfigured()` e nenhum perfil do `eas.json` define
   `EXPO_PUBLIC_API_BASE_URL`. Ligar conta é ligar a API primeiro.
2. **Exclusão de conta dentro do app e URL pública de exclusão.** Exigência da
   política do Google Play para qualquer app que crie contas. Não é entregável de
   backend apenas: tem superfície de UI e uma página pública a hospedar, no mesmo
   domínio das outras duas páginas legais.
3. **Refazer três declarações já entregues nas duas lojas.** Hoje elas declaram,
   de forma coerente entre si e verdadeira sobre o binário, que o app **não coleta
   dados**:
   - Data Safety (Play) e Privacy Labels (App Store);
   - a política de privacidade **já publicada** em
     `https://saudediagnostica.com/radiant/privacidade/`;
   - o questionário de classificação.

   Conta e assinatura tornam as três falsas. A revisão das lojas compara esses
   documentos entre si, então as três mudam juntas ou nenhuma muda.
4. **Billing nas duas lojas.** Play Billing e StoreKit, mais a reconciliação de
   entitlement do lado do servidor. Estado atual medido: **nenhuma** dependência de
   billing instalada; `ENABLE_REVENUECAT` declarada em `src/config.ts` com **zero
   consumidores**; `UpgradeInterestService` apenas registra interesse localmente.
   Premium é construção do zero.

## Consequências

- **A v1.3 não muda.** Nem código, nem cópia de loja, nem declarações. A Decisão 1
  do ADR anterior segue valendo, e a ficha continua descrevendo corretamente um
  binário sem conta.
- **Todo o trabalho desta decisão é v1.4**, e nasce fora do caminho da v1.3
  enquanto o relógio de 14 dias do closed test estiver correndo.
- **A ordem da v1.4 fica determinada:** API de pé → conta (login, perfil, exclusão)
  → declarações refeitas → billing. Billing é o último elo, não o primeiro.
- **A frente educacional (atividades, jogos, competências) não depende desta
  decisão** e pode avançar em paralelo. É a única das três frentes que não está
  atrás da API.
- **O `ENABLE_REVENUECAT` com zero consumidores continua como está** — sinal de
  intenção, não de implementação. Ligá-lo ou removê-lo pertence ao trabalho de
  billing.

## Alternativa descartada

**Opção A estendida às duas lojas** — Play Billing no Android e StoreKit no iOS,
cada um no seu silo, sem conta própria. Superfície muito menor: nenhuma declaração
de loja precisaria mudar, nenhuma API precisaria subir, e a restauração funcionaria
dentro de cada ecossistema.

Descartada porque o custo dela não aparece no lançamento e sim depois: quem assina
no Android e troca para iPhone perde o acesso pago, e migrar direito de acesso de
quem **já pagou** é a operação cara que a decisão antecipada existe para evitar. O
ADR anterior já havia registrado esse ponto: escolher agora é de graça, migrar
depois não é.

## Aprendizado de método

Este ADR não corrige um erro de raciocínio do anterior — corrige uma **conclusão
que envelheceu sem sinalizar**. O ADR de 31/07 tinha o critério certo e citava a
premissa em prosa de contexto ("enquanto o produto for só Android"), o que não cria
gatilho de reabertura. Um dia depois a premissa era falsa, o documento continuava
lido como orientação vigente, e a recomendação que ele carregava já não era
sustentada pelo seu próprio critério.

**Regra que fica:** todo registro de decisão deve separar o **critério** — que é
durável — da **conclusão** — que é derivada do estado do mundo na data. Quando uma
opção for recomendada sob condição, a condição vira campo próprio e verificável, ao
lado da decisão, na forma "esta recomendação vale enquanto `<premissa>`; se
`<premissa>` mudar, reavaliar antes de executar". Premissa citada em prosa não
protege ninguém: ela é lida como justificativa e a conclusão ganha autoridade pela
idade do documento.

Corolário operacional, e é como este ADR nasceu: ao abrir uma sessão de
planejamento, checar as premissas dos ADRs em aberto contra o estado atual **antes**
de tratá-los como orientação vigente.
