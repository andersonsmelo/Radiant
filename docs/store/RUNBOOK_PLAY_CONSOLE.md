# Runbook — criar o app no Play Console e gerar a service-account key

> **O que é:** a sequência de cliques no Play Console com os valores já decididos,
> prontos para colar. Cobre as tasks **L2.2 (A3)**, o preenchimento que depende de
> **L2.3/L2.8** (já publicadas) e a **service-account key** de **L2.4 (A5)**.
>
> **Quem executa:** Anderson. Tudo aqui é ação no console e manuseio de credencial —
> nenhum agente faz isso por você.
>
> **Pré-requisito já satisfeito:** conta Play Console paga. **Pendente à parte:** a
> verificação de identidade/acesso a dispositivo exige um **aparelho Android real**
> (o emulador é imagem "Google APIs" sem Play Store).

## Antes de começar — uma checagem de segurança que já foi feita

A chave da service account é um **segredo**. O diretório onde ela vai morar,
`radiant-app/credentials/`, **não estava no `.gitignore`** — foi corrigido nesta
data no `.gitignore` da raiz, junto de `*.p8` e dos nomes de arquivo de chave.
Antes de baixar a chave, confirme que a proteção está de pé:

```bash
cd /Users/anderson/Developer/Radiant && git check-ignore -v radiant-app/credentials/play-service-account.json
```

Se esse comando **não imprimir nada**, pare e avise — significa que a regra sumiu e
a chave ficaria rastreável pelo git.

---

## Parte 1 — Criar o app

Play Console → **Criar app**.

| Campo | Valor |
| --- | --- |
| Nome do app | `Radiant` |
| Idioma padrão | Português (Brasil) — `pt-BR` |
| App ou jogo | **App** |
| Gratuito ou pago | **Gratuito** |

> **Sobre o nome:** `Radiant` tem 13 caracteres e cabe no limite de 30. Se estiver
> indisponível, os planos B decididos são `Radiant: Radiologia` ou
> `Radiant Radiology` — **escolha um e me avise**, porque o nome aparece na copy da
> ficha e em `app.json`, e os dois precisam concordar.

**Package name:** `com.ascendcreative.radiant`

O package não é digitado na criação do app — ele é fixado no **primeiro upload de
AAB** e depois **não pode ser alterado nunca mais**. Confira que o build que você
subir foi feito com esse identificador (é o que está em
[`radiant-app/app.json`](../../radiant-app/app.json)).

---

## Parte 2 — Ficha da loja (Presença na loja → Configuração principal da loja)

Valores travados, prontos para colar. Fonte:
[`textos-loja-pt-BR.md`](textos-loja-pt-BR.md) — se divergir, a fonte manda.

| Campo | Limite | Valor a colar |
| --- | --- | --- |
| **Nome do app** | 30 | `Radiant — Radiologia` |
| **Descrição breve** | 80 | `Trilha guiada de radiologia com quizzes e revisão. Offline, sem conta.` |
| **Descrição completa** | 4000 | a seção "Descrição longa" de [`textos-loja-pt-BR.md`](textos-loja-pt-BR.md), inteira |

**Categoria:** `Educação`. Decisão travada — **não** escolher Medicina, que atrai
escrutínio de app clínico e exige justificativas que o Radiant não precisa dar.

**Tags:** as que o console oferecer dentro de Educação. Não invente claim médica.

**E-mail de contato:** `anderson.smelo94@gmail.com` (o mesmo declarado como contato
do controlador na política de privacidade — os dois precisam bater).

---

## Parte 3 — As duas URLs (colar exatamente assim, com barra final)

Publicadas e verificadas em 2026-07-29: HTTP 200 direto, sem redirecionamento.

| Campo do console | URL |
| --- | --- |
| **Política de Privacidade** | `https://saudediagnostica.com/radiant/privacidade/` |
| **Site / suporte** | `https://saudediagnostica.com/radiant/suporte/` |

As mesmas URLs **sem** a barra final funcionam, mas custam um `301`. Colar a forma
canônica evita que o revisor veja um salto desnecessário.

---

## Parte 4 — Data Safety e classificação etária

Não improvise: as respostas já estão decididas e justificadas em
[`DATA_SAFETY_E_CLASSIFICACAO.md`](DATA_SAFETY_E_CLASSIFICACAO.md).

Os dois pontos que mais confundem, resumidos:

- **"Coleta ou compartilha dados do usuário?" → NÃO.** O app é local-first e o
  Sentry está desligado no perfil `production`.
- **Expo Updates não é declarado como coleta.** Ele processa metadados técnicos de
  infraestrutura para entregar atualização, não dados do usuário coletados pelo app.
  A política publicada divulga isso na seção 4.1 — as duas peças concordam, e é essa
  concordância que a revisão checa.

**Classificação:** questionário de conteúdo → categoria Educação → esperado
**Livre/4+**.

---

## Parte 5 — Service-account key (L2.4 / A5)

**Esta chave é um segredo. Nenhum agente deve gerá-la, abri-la, colá-la em conversa
ou lê-la.** O caminho é seu, do console até o disco.

1. Play Console → **Configurações → Acesso à API**.
2. Vincular ou criar um projeto no Google Cloud.
3. Criar uma **conta de serviço** nesse projeto.
4. De volta ao Play Console, conceder a ela permissão de **release nos tracks de
   teste** (não precisa de mais que isso para o `eas submit`).
5. Gerar uma **chave JSON** e salvar em:
   `radiant-app/credentials/play-service-account.json`
   — exatamente esse caminho, que é o que o `eas.json` já aponta.
6. Confirmar a proteção com o comando da seção de segurança no topo.

Detalhe do fluxo de submissão em [`EAS_SUBMIT_SETUP.md`](EAS_SUBMIT_SETUP.md).

---

## Parte 6 — O relógio de 14 dias só corre no track fechado

Este é o ponto onde é fácil perder duas semanas sem perceber, então ele fica aqui,
no documento que você executa, e não só no guia de submissão.

O requisito do Play para conta Pessoal é **≥12 testadores opted-in por 14 dias
consecutivos em CLOSED TESTING**. Duas configurações precisam estar certas para
esse relógio começar a andar:

| Configuração | Valor no `eas.json` hoje | O que isso faz |
| --- | --- | --- |
| `track` | `internal` | Internal testing — **não conta** para os 14 dias |
| `releaseStatus` | `draft` | Sobe como rascunho — **ninguém recebe** até você promover |

**Os dois valores são deliberados**, não descuido: internal testing sobe na hora e
sem revisão, então serve para validar o pipeline de submissão antes de qualquer
coisa contar. A sequência pretendida é subir no internal, confirmar que o `eas
submit` funciona, e só então promover para o track fechado.

O que **não** funciona é rodar `eas submit --profile production` uma vez e ficar
esperando o relógio: com esses dois valores, ele não começou.

Para o upload que de fato inicia a contagem:

```bash
cd /Users/anderson/Developer/Radiant/radiant-app && eas submit --platform android --profile production --track <nome-do-track-fechado>
```

O `<nome-do-track-fechado>` é o que você criar no console em **Teste → Teste
fechado**. Depois do upload, ainda é preciso **promover a release** (o
`releaseStatus: draft` a deixa parada) e **adicionar os testadores**. O relógio
começa quando a release está live no track fechado com os testadores dentro —
não no upload.

---

## O que este runbook NÃO destrava

> **Os dois bloqueios de engenharia que esta seção listava foram resolvidos em
> 2026-07-29, e a seção passou um dia mandando adiar o primeiro upload de AAB —
> que é o gatilho do relógio de 14 dias do closed test.** Corrigido em
> 2026-07-30. Estado medido em `98261a4`:

| O que esta seção afirmava | Estado medido |
| --- | --- |
| "os três assets gráficos obrigatórios não existem; `docs/store/assets/` está vazio" | **falso** — os três existem: [`play-icon-512.png`](assets/play-icon-512.png), [`feature-graphic.png`](assets/feature-graphic.png) e seis screenshots em `assets/screenshots/`, todos 1080×1920 (1,778:1, dentro do teto 2:1 do Play) |
| "`android.adaptiveIcon.backgroundColor` é `#E6F4FE`, herdado do template" | **falso** — é `#07091c`, o valor da spec ([`app.json`](../../radiant-app/app.json)) |

As 6 tasks do [plano do ícone](../superpowers/plans/2026-07-29-icone-do-app.md)
fecharam em 2026-07-29 e o contrato de assets roda **11/11** dentro do
`npm run quality`. **Não há mais motivo de engenharia para adiar o upload do AAB.**

Faça tudo deste runbook agora — criar o app, preencher a ficha textual, colar as
duas URLs, responder Data Safety e gerar a chave — e suba o AAB quando as contas
permitirem.

O que ainda gate a **publicação** não sai deste runbook e não é código:

1. **Verificação de acesso a dispositivo da conta Play** — exige **aparelho
   Android real**; o emulador é imagem "Google APIs" sem Play Store.
2. **≥ 12 testadores opted-in por 14 dias consecutivos** — o item de maior
   latência do caminho crítico. Kit pronto em
   [`TESTER_INVITE_KIT.md`](TESTER_INVITE_KIT.md).

**Ressalva de qualidade, não bloqueio de ficha:** a prova do *themed icon* do
Android 13+ continua pendente e também exige aparelho real — uma captura da
gaveta com o tema ligado basta (§4 do
[status canônico](../EXECUTION_STATUS_2026-07-29.md)).

> **Por que esta seção envelheceu:** o bloqueio foi fechado no status canônico e
> no roadmap, que **descrevem** estado; ninguém varreu os documentos que
> **mandam um humano agir**. Um status desatualizado engana quem lê; um runbook
> desatualizado faz alguém não fazer o trabalho, e o custo aparece como latência,
> não como erro. Ao fechar um bloqueio, varra os dois gêneros de documento.
