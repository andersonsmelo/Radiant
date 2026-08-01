# ADR — Conta de usuário e assinatura premium (2026-07-31)

**Status:** aceita. A Decisão 1 segue vigente. A **Decisão 2 foi fechada em
2026-08-01** pela [`ADR-2026-08-01 — Modelo de entitlement do premium`](ADR-2026-08-01-modelo-de-entitlement-premium.md),
que adotou a **Opção B (conta própria + billing)**.
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** questionamento do dono ao revisar a cópia da ficha do Play,
que anuncia o app como "sem conta"

> **Leia isto antes da § Decisão 2.** A análise abaixo está preservada como foi
> escrita em 2026-07-31 e o **critério** que ela estabelece continua correto. O que
> mudou foi a premissa que alimentava a recomendação da Opção A: o escopo "só
> Android", decidido em 2026-07-31, foi revertido em 2026-08-01, quando o app iOS
> foi criado no App Store Connect e o build `1.3.0 (4)` chegou ao TestFlight.
> Aplicando o critério deste ADR ao estado de hoje, a resposta é a Opção B. Não
> use a recomendação da § Decisão 2 sem ler o ADR que a fechou.

## Contexto

Ao preencher a ficha da loja, o dono discordou do posicionamento "sem conta",
argumentando que **ter conta é importante para oferecer a assinatura premium**. O
argumento de produto está correto e não está em disputa aqui. O que este ADR separa
são três perguntas que a frase junta numa só.

### O que o binário da v1.3 realmente faz

Existe código de autenticação no app — `AuthService`, e um bloco de login/cadastro/
recuperação de senha dentro do `ProgressScreen`. Ele é **inerte no build
distribuído**: a interface é condicionada a `isApiConfigured()`
([`ProgressScreen.tsx`](../../radiant-app/src/features/progress/screens/ProgressScreen.tsx)),
nenhum perfil do [`eas.json`](../../radiant-app/eas.json) define
`EXPO_PUBLIC_API_BASE_URL`, e a API pública responde 502. A própria tela instrui a
definir a variável "para ativar auth e sync".

Portanto **o app que vai para a loja não tem conta**, e a afirmação "sem conta" na
ficha é literalmente verdadeira sobre o artefato distribuído.

### O que existe hoje em direção à monetização

| Peça | Estado medido em 2026-07-31 |
| --- | --- |
| `features/paywall/UpgradeInterestService` | existe; registra interesse de upgrade localmente |
| Flag `ENABLE_REVENUECAT` em `src/config.ts` | declarada, **zero consumidores** |
| SDK de cobrança (Play Billing, RevenueCat, IAP) | **nenhuma dependência instalada** |

Premium não está parcialmente pronto: é feature a construir do zero.

### O custo de trazer conta e premium para a v1.3

Auth funcional exige API de pé (hoje 502). Cobrança exige integração de billing.
Conta exige, pela política do Play, **caminho de exclusão de conta dentro do app e
URL pública de exclusão**. E as três declarações já preparadas passariam a ser
falsas: Data Safety ("não coleta nem compartilha dados"), a política de privacidade
já publicada, e o questionário de classificação. Todas teriam de ser refeitas.

Some-se a isso que o relógio de **14 dias consecutivos** do closed test só começa
depois de tudo isso — cada semana de construção é uma semana somada ao lançamento.

## Decisão 1 — a v1.3 lança sem conta

A cópia da ficha permanece descrevendo "sem conta e sem login", porque descreve o
binário. Conta e premium ficam para a **v1.4**.

Isso não fecha porta nenhuma: a cópia foi escrita desde 2026-07-27 para acomodar
freemium, com a decisão explícita de **não** prometer "grátis para sempre" nem citar
recursos premium inexistentes ([`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md)).
"Sem conta" também é vantagem de aquisição num primeiro lançamento: atrito no
primeiro uso é onde o funil de app educacional se perde.

## Decisão 2 — FECHADA em 2026-08-01: qual modelo sustenta o premium

> **Resolvida como Opção B (conta própria + billing)** em
> [`ADR-2026-08-01`](ADR-2026-08-01-modelo-de-entitlement-premium.md). O texto
> abaixo é o registro de 2026-07-31 e permanece intacto: o critério que ele fixa é
> o que produziu a decisão de 01/08.

Esta é a decisão que **precisa ser tomada antes do primeiro assinante**, não antes
da primeira linha de código. Migrar direito de acesso de quem já pagou é caro;
escolher agora é de graça.

**Opção A — Google Play Billing puro, sem conta própria.** A assinatura fica
amarrada à conta Google do usuário e o direito de acesso se restaura sozinho em
qualquer aparelho logado nela. Não exige e-mail, senha, backend, sessão nem
recuperação de senha. É o caminho curto, e ele é suficiente enquanto o produto for
só Android — que é o escopo decidido em 2026-07-31 (ver A2 do roadmap).

**Opção B — conta própria (auth) + billing.** Necessária quando se quer direito de
acesso **entre plataformas** (Android + iOS + web), conteúdo servido do servidor, ou
perfil sincronizado entre aparelhos. Exige a API de pé, a exclusão de conta exigida
pelo Play, e reabre as declarações de privacidade.

O critério de escolha não é preferência: é **se o direito de acesso precisa
atravessar plataforma ou servidor**. Enquanto a resposta for não, a Opção A entrega
o mesmo resultado comercial com uma fração da superfície.

## Consequências

- Nada muda na v1.3: nem código, nem cópia, nem declarações de loja.
- A ficha, o Data Safety e a política publicada permanecem coerentes entre si — e é
  essa coerência que a revisão da loja verifica.
- O `ENABLE_REVENUECAT` com zero consumidores fica como está: é sinal de intenção,
  não de implementação, e removê-lo ou ligá-lo pertence ao trabalho da v1.4.
- Quando a v1.4 começar, ela começa por **Decisão 2**, não por código.
  *(Cumprido: a Decisão 2 foi tomada em 2026-08-01, antes de qualquer linha de
  código de conta ou billing. A ordem de execução resultante está no
  [ADR que a fechou](ADR-2026-08-01-modelo-de-entitlement-premium.md).)*

## Aprendizado de método

A cópia de loja não é lugar de declarar intenção de produto: ela é lida pela revisão
da loja como descrição do artefato, e cada afirmação dela amarra uma declaração
correspondente (Data Safety, privacidade, classificação). Divergência entre o que a
ficha promete e o que o binário faz não é questão de marketing — é inconsistência
verificável entre documentos que a revisão compara entre si.
