# Radiant — Plano de finalização Android → Closed Testing (2026-07-29)

> **Status:** plano ativo, focado. Complementa (não substitui) o
> [roadmap de lançamento 2026-07-27](2026-07-27-radiant-launch-roadmap.md) e o
> [status canônico](../EXECUTION_STATUS_2026-07-29.md). Este documento recorta a
> **fatia Android** do roadmap e a sequencia para um único objetivo: subir o
> primeiro build ao closed testing do Play e iniciar o relógio de 14 dias.

## 1. Objetivo e linha de chegada

**Gatilho:** o financeiro aprovou o pagamento do Google Play Console, o que
destrava a criação/verificação da conta Play (task A2 do roadmap) — o gate que
segurava toda a trilha de loja Android.

**Linha de chegada deste plano (decidida com Anderson em 2026-07-29):**

> AAB do perfil `production` publicado no **closed testing track** do Play, com
> **≥12 testadores opted-in** e o **dia-1 dos 14 dias consecutivos registrado**,
> tendo os gates de engenharia verdes antes desse AAB subir.

O **lançamento público** (rollout de produção) fica **fora** deste plano — ele só
pode começar depois dos 14 dias de closed test, e será tratado numa passada
seguinte (ondas F4–F5 do roadmap). O piso do caminho crítico é o closed test de
14 dias; por isso tudo aqui é sequenciado para **iniciar esse relógio o quanto
antes**.

## 2. Estado verificado (2026-07-29)

### Já feito (Android)

- Projeto nativo gerado (`expo prebuild --platform android --no-install`), **APK
  Release buildado e instalado** no emulador `Radiant_Pixel_9_API_36` (C1).
  Receita reprodutível em
  [`radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md`](../../radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md).
- Memória do Gradle resolvida de forma durável via config plugin
  `plugins/with-gradle-memory.js` (o prebuild regenera o `gradle.properties` já
  corrigido).
- Dois defeitos de ícone só-Android corrigidos e verificados em device
  (`IconSymbol`/`icon-symbol.tsx`: `satisfies Partial<Record<...>>` no lugar do
  cast que alargava as chaves; glifos fora do nome acessível).
- `app.json` Android completo: `package` `com.ascendcreative.radiant`,
  `versionCode 2`, adaptive icon (fore/back/mono), `edgeToEdgeEnabled`, target
  API 36 (Expo SDK 54 / RN 0.81), `runtimeVersion: appVersion`, EAS Updates.
- Fundações de release já prontas e reaproveitáveis no Android: contrato de
  telemetria/privacidade (D2 — destrava Data Safety), checklist de release +
  matriz real-device (D3), ADR de contas (A1: Play pessoal → closed test 12×14
  confirmado no caminho crítico), **rascunhos** de política de privacidade (A4) e
  textos de loja pt-BR (E2).

### Em fechamento nesta sessão

- **C3 — 3 flows Maestro no Android.** O seletor da aba `learning-critical-path`
  estava acoplado ao formato de acessibilidade do iOS. Corrigido para o seletor
  **ancorado** `^Progresso(, tab.*)?$` (um `.*Progresso.*` colidia com a legenda
  "Seu progresso fica salvo…" sob matching case-insensitive do Maestro, e
  quebrava as duas plataformas). Fix validado por probe nos dois devices e travado
  no contrato `maestro-contract.test.mjs`. Re-run sequencial das duas suítes em
  curso para registrar o **3/3 honesto por plataforma** — a promoção do runbook
  depende dele.

## 3. As três trilhas (executam em paralelo)

O gargalo deixou de ser o recrutamento e passou a ser **só o relógio**. Em
2026-08-01 o dono relatou o recrutamento concluído, com **≥14 contas vinculadas**
ao track `alpha` — margem de churn atingida, T1.1 fechada. **Sem opt-ins
comprovados**, e é o opt-in que inicia os 14 dias. As três trilhas continuam
convergindo em F2.

### Trilha 1 — Testadores (o maior gargalo) · dono: Anderson

| Task | Descrição | Critério de saída |
| --- | --- | --- |
| **T1.1 (A6) — CONCLUÍDA em 2026-08-01** | ~~Recrutar **≥14** testadores (12 é o mínimo do Play; margem p/ churn). Pool pode se sobrepor à pesquisa da Task 12.~~ Relatado pelo dono: ≥14 contas vinculadas ao track, margem de churn atingida. Não medido no repositório, que não persiste endereços; a autoridade é a página da faixa no Console. | ✅ Lista de ≥14 contas vinculadas. **T1.3 permanece aberta** — vínculo não prova opt-in. |
| **T1.2** | Preparar o convite + instruções de opt-in (link do closed test, como aceitar, o que testar). **Eu preparo o texto e a planilha de acompanhamento; Anderson envia.** | Convite pronto e planilha de opt-in criada. |
| **T1.3 — EM ANDAMENTO desde 2026-08-02** | Convites com o link de opt-in **enviados em 2026-08-02** (relatado pelo dono); cobrança de quem não aceitou já prevista. Resta garantir 12+ opt-in efetivo e **monitorar diariamente** (queda abaixo de 12 zera a contagem de dias). **Anotar a data do dia-1** — o primeiro dia em que o Console mostrar 12 opted-in — porque é dela que os 14 dias contam, e ela não é recuperável depois. | 12+ opted-in por 14 dias consecutivos. |

> Começa **hoje**, antes e independentemente do código — é o item de maior
> latência do plano.

### Trilha 2 — Loja Play · dono: Anderson executa no console; eu preparo o material

| Task | Descrição | Quem | Critério de saída |
| --- | --- | --- | --- |
| **L2.1 (A2)** | Criar/verificar conta Play Console (pagamento aprovado); concluir verificação de identidade antes da janela BR de 30/09/2026. | Anderson | Conta ativa e verificada. |
| **L2.2 (A3)** | Criar o app no console com `com.ascendcreative.radiant`; reservar o nome "Radiant" (ter plano B de nome). | Anderson | App criado; nome reservado. |
| **L2.3 (A4)** | ~~Hospedar a política de privacidade~~ **CONCLUÍDA em 2026-07-29** — publicada e verificada de fora. Falta só colar a URL nos metadados do console. | Anderson (hospedagem); eu finalizei o texto | ✅ `https://saudediagnostica.com/radiant/privacidade/` → HTTP 200. Destrava L2.5. |
| **L2.4 (A5)** | ~~Configurar o bloco `submit.production.android` no `eas.json`~~ **CONCLUÍDO em 2026-07-29** (`serviceAccountKeyPath`, `track: internal`, `releaseStatus: draft` — os dois últimos deliberados; ver Parte 6 do runbook). **Resta Anderson gerar a service-account key** no console e salvá-la em `radiant-app/credentials/play-service-account.json` (diretório já existe, vazio e ignorado pelo `.gitignore` da raiz, linha 37). | Anderson | `eas submit --platform android` pronto para uso. |
| **L2.5 (E3)** | Data Safety no Play (derivado do contrato D2: hoje nada de telemetria sai do device; Sentry off em produção). | Eu preparo as respostas; Anderson preenche | Ficha Data Safety completa. |
| **L2.6 (E4)** | Classificação etária / questionário de conteúdo; categoria **Educação** (evita escrutínio de app médico). | Eu preparo as respostas; Anderson preenche | Rating emitido. |
| **L2.7 (E1)** | ~~Três assets gráficos obrigatórios da ficha do Play~~ **CONCLUÍDA em 2026-07-29** — ícone 512×512, feature graphic 1024×500 e 6 screenshots de telefone, todos gerados e travados. | Eu | ✅ Contrato de assets **11/11** àquela data, **14/14** desde 2026-07-30 (ganhou os buckets de screenshot de iPhone), rodando no `npm run quality`. Inventário em [`ASSETS_DE_LOJA.md`](../store/ASSETS_DE_LOJA.md). |
| **L2.8 (E5)** | ~~Página de suporte + e-mail de contato~~ **CONCLUÍDA em 2026-07-29** — publicada e verificada de fora. | Anderson (e-mail/entidade); eu preparei a página | ✅ `https://saudediagnostica.com/radiant/suporte/` → HTTP 200; contato `anderson.smelo94@gmail.com`. |

> **URLs canônicas para colar nos consoles — use a versão COM barra final.**
> `https://saudediagnostica.com/radiant/privacidade/` e
> `https://saudediagnostica.com/radiant/suporte/` devolvem **HTTP 200 direto, sem
> redirecionamento**. As mesmas URLs sem barra final funcionam, mas custam um
> `301`; colar a forma canônica evita que um revisor veja um salto desnecessário.
>
> **Verificação independente de 2026-07-29** (medida de fora, não relatada):
> ambas em 200 `text/html`; corpo servido **byte a byte idêntico** à fonte em
> `docs/legal/` (SHA-256 conferidos); UTF-8 válido com acentuação intacta e
> `<meta charset>` dentro dos primeiros 1024 bytes; **zero scripts e zero
> recursos externos**, logo não há consent wall escondendo o texto; sem
> `noindex` e sem bloqueio de `/radiant/` no `robots.txt`; sem barra final é
> exatamente **um** salto 301 para a canônica.
>
> **Risco aberto, não bloqueante:** o código que publica as páginas está na
> branch `codex/radiant-legal-pages` do repositório do site, na **PR #39 ainda
> sem merge**. As páginas estão no ar (subiram por FTPS), mas um redeploy a
> partir da branch principal pode removê-las — e a revisão das lojas pode
> acontecer semanas depois. **Mergear a PR #39** antes de submeter.

> **Correção de 2026-07-29 — L2.7 listava dois assets; o Play exige três.**
> A ficha da loja não fecha sem o **ícone 512×512** (PNG 32-bit **com** alpha,
> ≤ 1024 KB), além do **feature graphic 1024×500** (**sem** alpha) e de **≥ 2
> screenshots de telefone**. A versão anterior desta linha omitia o ícone, o que
> deixaria L2.7 "concluída" com a ficha ainda incompleta e F2 bloqueado no
> console.
>
> Duas restrições que já custaram retrabalho e ficam registradas aqui:
>
> - **Proporção máxima de screenshot é 2:1.** A resolução nativa do emulador
>   Pixel 9 é 1080×2424 = **2,24:1** e **seria recusada**. Capturar com
>   `adb shell wm size 1080x1920` (9:16 exato) e devolver com `wm size reset`.
> - **Alpha tem regras opostas no mesmo lote:** obrigatório no ícone 512,
>   proibido no feature graphic e nos screenshots.
>
> Os três assets são produzidos pelo
> [plano do ícone da marca](../superpowers/plans/2026-07-29-icone-do-app.md)
> (Tasks 3 e 5) e travados pelo contrato
> `radiant-app/scripts/icon-assets-contract.test.mjs`. **L2.7 depende desse
> plano** — não é trabalho independente de console.

### Trilha 3 — Engenharia (paridade Android) · dono: eu (C5 é humano)

| Task | Descrição | Critério de saída |
| --- | --- | --- |
| **E3.1 (C3)** | 3 flows Maestro **PASS** no emulador Android, em execução sequencial isolada. | 3/3 numa suíte; evidência datada; runbook promovido. |
| **E3.2 (C2)** | Smoke manual em emulador: navegação completa, edge-to-edge, **predictive back** (hoje `false` — validar a escolha sob target 36), teclado, fontes ampliadas. | Checklist com evidência (screenshots/nota). |
| **E3.3 (C4)** | 3 flows em **≥1 device Android físico** (Anderson tem device). | 3/3 em device físico; evidência datada. |
| **E3.4 (C5)** | **TalkBack**: repetir o checklist do Gate 2 no Android. **Sessão humana com áudio** (o roteiro atual é VoiceOver e não cobre TalkBack — precisa de um roteiro TalkBack). | Checklist TalkBack com evidência. |

> C4/C5 podem terminar **durante** os 14 dias do closed test se necessário — não
> precisam bloquear a subida do AAB, mas E3.1 (3/3 emulador) e E3.2 (smoke) sim.

### Convergência — F2 (o marco deste plano)

Quando as três trilhas atingem seus gates mínimos (T1: 12+ prontos para opt-in ·
L2: app criado + Data Safety + rating + listing mínima + `eas submit` configurado
· E3: 3/3 emulador + smoke): **build `production` (AAB) via EAS → `eas submit`
→ closed testing track → 12+ opted-in → dia-1 registrado.** Linha de chegada
atingida.

## 4. Caminho crítico e sequência

```
Hoje ─┬─ T1.1 recrutar testadores ───────────────► T1.3 opt-in (após F2) ─► [14 dias]
      ├─ L2.1 conta ─► L2.2 app ─► L2.4 eas submit ─┐
      │                L2.3 hospedar política ─► L2.5 Data Safety ─┤
      │                L2.6 rating · L2.7 assets · L2.8 suporte ───┼─► F2 (AAB → closed test)
      └─ E3.1 3/3 emulador ─► E3.2 smoke ──────────┘
                              E3.3 device físico · E3.4 TalkBack ── (podem correr durante os 14 dias)
```

**Gargalos, em ordem:** (1) recrutamento de testadores (não iniciado — começa
hoje); (2) verificação da conta Play (latência administrativa); (3) hospedagem da
política (destrava Data Safety). O código (E3.1/E3.2) está quase pronto.

## 5. Divisão de trabalho

**Só Anderson pode fazer** (fora do meu alcance por política): criar/verificar a
conta Play (L2.1), gerar a service-account key e fazer entradas no console
(L2.2/L2.5/L2.6/L2.8), hospedar a política (L2.3), ser o rosto do recrutamento
(T1), e a sessão humana de TalkBack (E3.4).

**Eu faço/preparo:** fechar C3 (E3.1), smoke em emulador (E3.2), flows no device
físico (E3.3, com o device conectado), config do `eas.json` submit (L2.4),
respostas de Data Safety e rating (L2.5/L2.6), screenshots e feature graphic
(L2.7), finalização do texto da política e da página de suporte, e o texto de
convite + planilha de opt-in (T1.2). **Não crio contas, não insiro credenciais,
não hospedo nada sob login.**

## 6. Fora de escopo desta passada

- **Lançamento público no Play** (F4–F5): só após os 14 dias; passada seguinte.
- **D4 — gate editorial** (42 `formatNeedsReview`): é qualidade de conteúdo, P0
  para o público, mas **não bloqueia** iniciar o closed test. Corre em paralelo.
- **C6** — baseline de performance Android (P2).
- **iOS** (TestFlight/F1) — plano à parte; aqui o foco é Android.

## 7. Riscos específicos Android

| Risco | Prob. | Mitigação |
| --- | --- | --- |
| Recrutamento não iniciado atrasa o relógio de 14 dias | **Alta** | T1.1 começa hoje; meta ≥14 para absorver churn; monitorar opt-in diário. |
| Verificação de conta Play travar (identidade/BR) | Média | Iniciar L2.1 já; concluir antes de 30/09/2026. |
| Queda abaixo de 12 testadores zera a contagem | Média | Margem de 14+; acompanhamento diário durante os 14 dias. |
| E2E/ícones exigirem mais ciclos que o previsto | Baixa (C3 quase fechado) | Seletores por accessibility label estáveis; contrato trava regressões. |
| Verificação de E2E em paralelo corromper evidência (contenção de host) | Confirmado nesta sessão | Rodar suítes **sequencialmente**, uma plataforma por vez, com watchdog de timeout. |

## 8. Como executar

1. Trilhas 1, 2 e 3 começam **em paralelo**; a Trilha 1 (testadores) não depende
   de código e é a de maior latência — arranca hoje.
2. Cada task de engenharia segue o fluxo do repo (branch, `npm run quality`
   verde, evidência em `radiant-app/docs/evidence/`), via Loop.
3. Atualizar o status canônico a cada gate fechado; **este plano não substitui o
   status nem o roadmap**.
