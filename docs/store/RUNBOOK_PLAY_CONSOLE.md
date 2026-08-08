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
cd "$(git rev-parse --show-toplevel)" && git check-ignore -v radiant-app/credentials/play-service-account.json
```

Se esse comando **não imprimir nada**, pare e avise — significa que a regra sumiu e
a chave ficaria rastreável pelo git.

---

## Como ler este runbook

Ele mistura dois tipos de afirmação, e eles envelhecem de formas diferentes:

- **Valores nossos** (identificadores, URLs, textos) — vêm de um arquivo-fonte
  deste repositório, que é sempre quem manda. Se o runbook divergir da fonte,
  a fonte vence.
- **Descrições da tela do Play Console** — são de um produto de terceiros que muda
  sem nos avisar. Trate-as como **"confira na tela"**, nunca como fato. Onde este
  documento disser que um campo está em tal lugar, o que vale é o que você vê.

**Nunca confie neste documento sobre a *ausência* de um campo.** Em 2026-07-31 ele
afirmava que o identificador de pacote não era digitado na criação do app; era —
e é o único campo irreversível daquela tela.

---

## Parte 1 — Criar o app

Play Console → **Criar app**. Os valores dos campos, todos:

| Campo | Valor | Reversível? |
| --- | --- | --- |
| Nome do app | `Radiant — Radiologia` | sim, em Presença na loja |
| Nome do pacote | `com.ascendcreative.radiant` | **não, nunca mais** |
| Idioma padrão | Português (Brasil) — `pt-BR` | sim |
| App ou jogo | **App** | sim |
| Gratuito ou pago | **Gratuito** | só até a publicação |

Esta tabela é a **única** fonte destes valores dentro deste runbook; as seções
seguintes referenciam-na em vez de repetir os valores. Duas tabelas para o mesmo
campo divergem no primeiro dia em que alguém editar uma delas — foi exatamente o
que aconteceu aqui, e o valor errado chegou a ser digitado no console.

**Sobre o nome:** `Radiant — Radiologia` (20 caracteres, limite 30) é o **título
do Google Play** decidido em
[`textos-loja-pt-BR.md`](textos-loja-pt-BR.md#título-google-play-30). O `Radiant`
puro, que aparece na mesma fonte, é o nome da **App Store** — não é o valor desta
tela. Se o nome estiver indisponível, os planos B decididos são
`Radiant: Radiologia` ou `Radiant Radiology`; escolha um e avise, porque o nome
aparece na copy da ficha e em `app.json`, e os dois precisam concordar.

**Sobre o pacote:** `com.ascendcreative.radiant` é o que está em
[`radiant-app/app.json`](../../radiant-app/app.json). Use o **"Ver
disponibilidade"** ao lado do campo: o identificador é único globalmente no Play.
Depois de criado o app ele **não pode ser alterado nunca mais** — errar aqui só se
conserta criando outro app do zero. Confira também que o AAB que você subir foi
construído com esse mesmo identificador.

**Proteção automática:** a tela oferece adicionar uma verificação de instalador ao
código do app, ligada por padrão. **Deixe ligada** — não custa nada e não afeta
quem instala pela loja. Consequência a não esquecer: o artefato entregue pela Play
Store deixa de ser byte a byte o AAB que você subiu, então evidência colhida sobre
um APK local **não** vale automaticamente para o que o usuário recebe.

---

## Parte 2 — Ficha da loja (Presença na loja → Configuração principal da loja)

Valores travados, prontos para colar. Fonte:
[`textos-loja-pt-BR.md`](textos-loja-pt-BR.md) — se divergir, a fonte manda.

| Campo | Limite | Valor a colar |
| --- | --- | --- |
| **Nome do app** | 30 | já preenchido na criação — ver a tabela da Parte 1 |
| **Descrição breve** | 80 | `Trilha guiada de radiologia com quizzes e revisão. Offline, sem conta.` |
| **Descrição completa** | 4000 | a seção "Descrição longa" de [`textos-loja-pt-BR.md`](textos-loja-pt-BR.md), inteira — **convertida de Markdown para texto limpo**, porque o campo do Play não renderiza Markdown e publicaria os `**` literais. Instrução de conversão na própria fonte |

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

> **O track fechado deste app se chama `alpha`** — medido no console em 2026-07-31,
> quando o teste fechado foi criado. É esse o valor do `--track`, não um nome a
> inventar. O Google cria o track já nomeado; a tela mostra "Teste fechado - Alpha".

**Os dois valores são deliberados**, não descuido: internal testing sobe na hora e
sem revisão, então serve para validar o pipeline de submissão antes de qualquer
coisa contar. A sequência pretendida é subir no internal, confirmar que o `eas
submit` funciona, e só então promover para o track fechado.

O que **não** funciona é rodar `eas submit --profile production` uma vez e ficar
esperando o relógio: com esses dois valores, ele não começou.

Para o upload que de fato inicia a contagem:

```bash
cd "$(git rev-parse --show-toplevel)/radiant-app" && eas submit --platform android --profile production --track alpha
```

Depois do upload, ainda é preciso **promover a release** (o `releaseStatus: draft`
a deixa parada) e **adicionar os testadores**. O relógio começa quando a release
está live no track fechado com os testadores dentro — não no upload.

**A service-account key não é pré-requisito do primeiro upload.** Ela automatiza o
envio via `eas submit`; o `.aab` pode ser arrastado direto no console, em
**Teste fechado → Versões → Criar nova versão**. Se a chave estiver atrasada, ela
não segura o relógio — gere depois.

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
fecharam em 2026-07-29 e o contrato de assets roda **14/14** dentro do
`npm run quality`. **Não há mais motivo de engenharia para adiar o upload do AAB.**

**Não refaça a criação do app, a ficha, as URLs, a lista nem o upload do AAB.**
Essas etapas já foram executadas; o track fechado `alpha` está ativo com a
release `1.3.0 (4)`. Use este runbook como procedimento e o status canônico como
estado. A service-account key continua opcional para automação do `eas submit`,
não para a release que já está no console.

O que ainda gate a **publicação** não sai deste runbook e não é código:

1. ~~**Verificação de acesso a dispositivo da conta Play**~~ — **CONCLUÍDA em
   2026-07-31.** Deixou de gatear a publicação.
2. **≥ 12 testadores opted-in por 14 dias consecutivos** — o item de maior
   latência do caminho crítico. A última leitura, em 2026-08-03, mostrou 2
   participantes de 14 contas vinculadas; só o console atual confirma a contagem.
   Kit pronto em [`TESTER_INVITE_KIT.md`](TESTER_INVITE_KIT.md).
3. **Questionário IARC/Play (E4)** — continua pendente e deve seguir a taxonomia
   exibida pelo Play, sem copiar automaticamente a classificação da Apple.
4. **Depois de F2:** solicitar acesso à produção no Play (F4).

**Ressalva de qualidade, não bloqueio de ficha:** a prova do *themed icon* do
Android 13+ continua pendente e também exige aparelho real — uma captura da
gaveta com o tema ligado basta (§4 do
[status canônico](../EXECUTION_STATUS_2026-08-08.md)).

> **Por que esta seção envelheceu:** o bloqueio foi fechado no status canônico e
> no roadmap, que **descrevem** estado; ninguém varreu os documentos que
> **mandam um humano agir**. Um status desatualizado engana quem lê; um runbook
> desatualizado faz alguém não fazer o trabalho, e o custo aparece como latência,
> não como erro. Ao fechar um bloqueio, varra os dois gêneros de documento.
