# Fichas de loja — Data Safety, Privacy Labels e Classificação

> Preparado em 2026-07-29 e **reconciliado em 2026-08-05**. As respostas de
> privacidade continuam prontas para preencher, derivadas do
> [contrato de telemetria D2](../legal/CONTRATO_TELEMETRIA.md) e válidas para a
> build de produção atual (Sentry desligado, sem analytics remoto, sem sync).
> A classificação etária Apple foi **atestada e persistida em 2026-08-05**:
> informação médica ou de tratamento `Pouco frequente`, com resultado `13+`
> global / `12+` no Brasil. O questionário IARC do Google Play continua sendo
> um contrato separado e não deve herdar essa resposta automaticamente.
> Se o relatório de falhas (Sentry) for ligado no beta, ver a seção "Se ligar o
> Sentry".

## 1. Google Play — Data safety

**Coleta ou compartilha algum dado do usuário?** → **NÃO.**

- O app é **local-first**: progresso, respostas e preferências ficam **no
  dispositivo** (AsyncStorage). Nada é enviado a servidor.
- Sem conta obrigatória, sem login para usar.
- Analytics remoto **desligado** (`ENABLE_PRODUCT_ANALYTICS=false`); nenhum evento
  sai do device.
- Notificações são **locais** (sem push token, sem servidor).
- Expo Updates entrega atualizações de código — processa metadados técnicos de
  infraestrutura, **não** dados do usuário coletados pelo app (não declarar como
  coleta).

**Preenchimento:** marcar **"No data collected"**. Segurança: pode declarar que os
dados ficam no dispositivo e que não há transmissão. **Account deletion:** não se
aplica (não há criação de conta / dados em servidor).

## 2. App Store — Privacy Nutrition Labels

**→ "Data Not Collected".**

- Mesma base: nada coletado pelo app. Sem tracking (sem IDFA, sem analytics de
  terceiros).
- `usesNonExemptEncryption: false` já declarado no `app.json` (sem criptografia não
  isenta → sem burocracia de exportação).

## 3. Classificação etária / questionário de conteúdo

**Categoria recomendada: Educação** (não "Medicina" — evita escrutínio de app
médico regulado). App educacional de radiologia; **sem** aconselhamento clínico,
diagnóstico ou dado de paciente.

### App Store — decisão humana persistida em 2026-08-05

A [taxonomia vigente da
Apple](https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions)
define **Medical or Treatment Information** como conteúdo que fornece diagnóstico
ou orientação sobre manejo de condições médicas, incluindo informação de
tratamento. Ela atribui `13+` global / `A12` no Brasil quando esse descritor é
**infrequente** e `16+` global / `A16` no Brasil quando é **frequente**.

O texto anterior dizia ao mesmo tempo "referências médicas: sim" e "resultado
esperado: 4+". Essa combinação não pode mais ser copiada. O binário é educacional,
mas contém conteúdo radiológico, referências diagnósticas e menções técnicas a
tratamento. Anderson atestou a frequência como **Pouco frequente**; a automação
apenas transportou a decisão humana para o console.

Respostas tecnicamente sustentadas pelo binário:

| Tema | Resposta |
| --- | --- |
| Controles parentais / garantia de idade | Não |
| Acesso irrestrito à web | Não — há apenas links fixos de suporte e privacidade, abertos fora do app |
| Conteúdo gerado por usuário / rede social / chat | Não |
| Publicidade | Não |
| Violência (real/fantasia/gráfica) | Não |
| Conteúdo sexual / nudez | Não |
| Linguagem imprópria | Não |
| Drogas, álcool, tabaco | Não |
| Jogos de azar / apostas / loot boxes | Não |
| Conteúdo assustador / horror | Não |
| Competições entre usuários | Não — XP, sequência e meta são progresso individual |
| Tópicos de saúde ou bem-estar | Não — o app não oferece autocuidado nem recomendações de estilo de vida |
| **Informações médicas ou de tratamento** | **Pouco frequente** — atestado pelo titular e persistido no App Store Connect em 2026-08-05 |

O console calculou `13+` para 172 países ou regiões e `12+` para Brasil e Coreia
do Sul. Para sistemas anteriores à versão 26, exibiu classificação global `12+`
com exceções regionais. Não foi aplicada substituição para uma faixa maior.

### Google Play

O questionário IARC deve ser respondido separadamente com as definições exibidas
no próprio Play Console. Não transportar automaticamente a frequência escolhida
na Apple: os rótulos e efeitos de classificação são contratos distintos.

### Direitos de conteúdo — declaração separada

**Atestação persistida em 2026-08-05:** o app contém, exibe ou acessa conteúdo
de terceiros e o titular confirmou deter os direitos necessários.

O App Store Connect pergunta se o app contém, exibe ou acessa conteúdo de
terceiros. O repositório registra fontes editoriais de terceiros e classes de
direitos, mas isso não substitui a atestação do titular para o subconjunto
publicado. Se houver conteúdo de terceiros no binário, selecionar "Sim" exige que
o titular confirme que detém os direitos necessários; sem essa confirmação, a
submissão fica bloqueada. Não selecionar "Não" apenas porque a experiência é
offline.

**Disclaimer educacional** (usar nos metadados e, idealmente, numa tela/rodapé):

> *Radiant é um aplicativo educacional de radiologia. O conteúdo tem finalidade de
> estudo e não substitui formação, julgamento clínico ou orientação médica
> profissional.*

## 4. Se/quando ligar o Sentry (crash reporting) no beta

Só então muda a ficha (hoje **não** ligar):

- **App Store:** declarar **Diagnostics → Crash Data**, *não vinculado à identidade*
  e *não usado para tracking*.
- **Google Play:** **App info and performance → Crash logs**, coletados, *não
  compartilhados*, com finalidade de *Analytics/estabilidade*. O adapter do Sentry já
  higieniza props (sem PII, `sendDefaultPii=false`, user só `id`).

## 5. Dependências

- **Política de privacidade** ([rascunho](../legal/politica-de-privacidade.md)) precisa
  estar **hospedada em URL pública** — é campo obrigatório das duas fichas. Bloqueia o
  envio final.
- E-mail de contato / página de suporte (ver punch-list).
