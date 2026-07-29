# Fichas de loja — Data Safety, Privacy Labels e Classificação (respostas prontas)

> Preparado em 2026-07-29. Respostas **prontas para preencher** nas consoles,
> derivadas do [contrato de telemetria D2](../legal/CONTRATO_TELEMETRIA.md). Anderson
> copia isto para o Play Console e o App Store Connect. **Válido para a build de
> produção atual** (Sentry desligado, sem analytics remoto, sem sync). Se o
> relatório de falhas (Sentry) for ligado no beta, ver a seção "Se ligar o Sentry".

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

Respostas do questionário (IARC/Play e Apple) — todas **"Nenhum/Não"** exceto onde
indicado:

| Tema | Resposta |
| --- | --- |
| Violência (real/fantasia/gráfica) | Não |
| Conteúdo sexual / nudez | Não |
| Linguagem imprópria | Não |
| Drogas, álcool, tabaco | Não |
| Jogos de azar / apostas / loot boxes | Não |
| Conteúdo assustador / horror | Não |
| Interação entre usuários / chat | Não |
| Compartilhamento de localização | Não |
| Conteúdo gerado por usuário compartilhado | Não |
| **Referências médicas/de saúde** | **Sim, educacional** — conteúdo de radiologia com finalidade **educativa**, sem instrução de tratamento nem aconselhamento clínico. Incluir o **disclaimer** (abaixo). |
| Compras no app | Não (gratuito no lançamento; freemium é futuro) |

**Resultado esperado:** **Livre / 4+ (Everyone)**.

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
