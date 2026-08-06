# Radiant — Roadmap de Lançamento iOS e Android (2026-07-27)

> **Status:** plano ativo. Complementa (não substitui) o
> [roadmap de continuação](2026-07-23-radiant-continuation-roadmap.md) e o
> [status canônico](../EXECUTION_STATUS_2026-07-29.md). As Tasks 11–16 do
> roadmap anterior permanecem válidas; este documento as ordena dentro da
> trilha de lançamento e adiciona a trilha de lojas, que não existia.

## 1. Objetivo

Publicar o Radiant v1.3 nas lojas — App Store (iOS) e Google Play (Android) —
como aplicativo educacional de radiologia **local-first**, sem dependência da
API remota, com acessibilidade validada, fluxo crítico coberto por E2E nas duas
plataformas e beta com usuários reais antes da produção.

**Definição de lançado:** o app está disponível para download público nas duas
lojas, com crash-free sessions ≥ 99% no beta, zero perda de progresso em
relaunch offline, e metadados/privacidade aprovados na revisão das lojas sem
rejeição pendente.

## 2. Onde estamos hoje (verificado)

Fonte: [status canônico 2026-07-29](../EXECUTION_STATUS_2026-07-29.md) — o
snapshot de 07-27 permanece como histórico. A seção abaixo descreve o estado
verificado em 07-27; as entregas de 07-28 (identidade de design, versionamento
1.3.0, tipografia, lesson-flow, assets e gate) estão no status canônico.

**Sólido:**

- App local-first funcional; catálogo, progresso e revisão funcionam sem API.
- ~~v1.2.1~~ **1.3.1 (build 3)** em 2026-08-03, alinhada entre `package.json` e
  `app.json`; `runtimeVersion` por `appVersion`; nenhum build publicado ainda
  (mudanças de versão ainda livres).
- Qualidade: ~~27 suítes / 71 testes PASS~~ ~~48 suítes / 245 testes PASS~~
  **49 suítes / 267 testes PASS** em 2026-08-03 (terceira sessão do dia);
  `npm run quality` PASS; Gate 2 de acessibilidade parcial — ~~(3/5)~~ ~~(4/5)~~
  **(3/5) recontado em 2026-08-05**: aprovados os itens 3, 4 e 5; abertos o 1 e
  o 2. O item 1 (Reduce Motion) ganhou cobertura de código nas telas de galáxia
  em 2026-08-03 e, na mesma data, o critério manual passou a exigir percorrer
  essas telas — o que a passagem de 2026-07-26 não podia ter coberto. Ver item 1
  dos bloqueadores.
- ~~E2E iOS em device PASS (3/3 flows Maestro)~~ **E2E medido nas duas
  plataformas em 2026-08-03: iOS 5/5 e Android 5/5**, sobre builds Release locais
  da 1.3.1. Os dois vermelhos que apareceram no caminho — `offline-relaunch` no
  Android e `store-capture` nas duas — eram defeitos dos flows, anteriores a esse
  trabalho, e foram corrigidos e remedidos. A ressalva do item 3 dos bloqueadores continua valendo: a
  evidência foi colhida sob o perfil `e2e-test`, não sob configuração equivalente
  a produção.
  ~~**⚠️ Acrescentado em 2026-08-03 (terceira sessão): essa evidência agora precede
  o HEAD.**~~ **Resolvido em 2026-08-03 (quarta sessão): a suíte foi reexecutada
  no HEAD e sob configuração equivalente a produção — `6/6` no iOS e `6/6` no
  Android**, com um flow a mais que os cinco anteriores. Os 11 commits do
  refinamento de microinterações não regrediram nada, e o item 3 dos bloqueadores
  fechou na mesma rodada. Evidência em
  [`2026-08-03-e2e-producao-rating-prompt.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).
- EAS configurado (projeto, perfis `development`, `e2e-test`, `preview`,
  `production`); bundle id/package `com.ascendcreative.radiant` definidos.
- Expo SDK 54 / RN 0.81 → target Android API 36 por padrão, o que já atende o
  requisito do Play para novos apps (ver §4).

**Aberto (bloqueadores conhecidos):**

> **Reconciliado em 2026-08-03.** Esta lista é de 2026-07-27 e três dos nove
> itens tinham deixado de ser verdade sem que ninguém os riscasse — ela dizia
> "zero E2E Android" e "onboarding pendente de confirmação" para quem fosse
> decidir hoje. Os itens 2, 7 e 9 foram riscados com a correção datada, e os
> números do item 8 foram remedidos. Os itens **1, 3, 5 e 6 foram reverificados
> e continuam verdadeiros** — não estão aqui por inércia.
>
> O padrão é o do item 4: riscar o texto original e anexar a correção com data.
> O registro do que se acreditava em 2026-07-27 tem valor; sobrescrevê-lo não.

1. Gate 2 de acessibilidade: ~~resta o item 2~~ **restam os itens 1 e 2,
   recontagem de 2026-08-05**. O item 2 (anúncio único VoiceOver) exige humano
   com áudio, task B4. O item 5 (navegação por teclado) foi fechado em
   2026-07-27 com a build web (task B3).
   **O item 1 (Reduce Motion) voltou a aberto sem que nada regredisse:** sua
   passagem de 2026-07-26 mediu a animação de entrada no caminho da lição e
   dizia, na própria evidência, que shake, scale e press não foram medidos. Em
   2026-08-03 o critério cresceu para exigir a caminhada pela galáxia — e as
   quatro superfícies só passaram a honrar a preferência naquele mesmo dia. Uma
   passagem anterior não pode cobrir um critério posterior sobre código que
   ainda não existia; falta uma caminhada nova em device.
   **Reverificado em 2026-08-03: segue aberto** — o
   `radiant-app/docs/ACCESSIBILITY_QA_V1.md` continua marcando o gate como não
   aprovado por esse item. Vale reordenar a prioridade: em 2026-08-02 um defeito
   real de VoiceOver (a apresentação inteira colapsada num único nó, com o aviso
   legal da ficha da loja inalcançável por leitor de tela) foi encontrado por uma
   asserção de E2E falhando — não pelo gate, que existe para pegar exatamente
   isso e não rodou.
   **Avançou em iPhone físico em 2026-08-05, mas continua aberto:** nome,
   posição/função e estado desabilitado foram ouvidos uma vez em controles
   reais, sem repetição espontânea. Não foi transcrita uma dica nem ativado um
   estado ocupado real, então a amostra não promove o item inteiro. Evidência em
   [`2026-08-05-testflight-1.3.1-build-5-iphone.md`](../../radiant-app/docs/evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md).
2. ~~Android sem projeto nativo (`expo prebuild` nunca executado); zero E2E
   Android.~~ **Falso desde 2026-07-28, e medido de novo em 2026-08-03.** O
   projeto nativo é gerado por `expo prebuild --platform android --no-install` e
   a suíte roda em emulador: **5 de 5 flows verdes** sobre APK Release local da
   versão 1.3.1, incluindo a apresentação de primeiro uso. Evidência em
   [`2026-08-03-e2e-1.3.1-ios-android.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md).
3. E2E ainda não reexecutado sob o perfil `preview`~~, que passou a refletir
   produção em 2026-07-27 (task B0.1)~~.
   **Reverificado em 2026-08-03: segue aberto.** Toda a evidência de device,
   inclusive a das duas plataformas desta data, foi colhida sob `e2e-test`. A
   única menção a `preview` está em
   [`2026-07-28-boot-to-home-devclient.md`](../../radiant-app/docs/evidence/2026-07-28-boot-to-home-devclient.md),
   que é verificação em dev-client — e o `E2E_RUNBOOK` é explícito em que uma
   execução em dev-client **nunca** promove plataforma.
   ~~Item de maior peso agora: o `e2e-test` desliga o beta gate, então nenhum
   flow exercita o caminho em que `first_run_started` é emitido antes de o gate
   ser avaliado.~~

   > **Premissa corrigida em 2026-08-03 (segunda revisão do dia).** O
   > **predicado** deste item continua verdadeiro — o E2E de fato nunca rodou sob
   > `preview` —, mas as duas frases riscadas acima são falsas, e a segunda foi
   > acrescentada pela própria reverificação de mais cedo. Medido no `eas.json` e
   > no site de composição da flag:
   >
   > - O gate aplicado é `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`
   >   (`src/app/_layout.tsx`), com
   >   `SHOW_DEV_TOOLS = __DEV__ || ENABLE_DEV_TOOLS` (`src/config.ts`). O
   >   `preview` declara **as duas** ligadas, então ele **também não aplica o
   >   gate**; o `production` declara `ENABLE_BETA_GATE=false`. **Nenhum dos cinco
   >   perfis do `eas.json` aplica o beta gate.** Rodar sob `preview` não
   >   exercitaria o caminho barrado, e portanto não fecha o buraco que a frase
   >   riscada dizia fechar.
   > - "`preview` reflete produção" nasce em
   >   [`EXECUTION_STATUS_2026-07-27.md`](../EXECUTION_STATUS_2026-07-27.md),
   >   **escopada a uma flag**: naquele dia `ENABLE_LEARNING_ROAD` passou a ser
   >   declarada em `preview` e `production`. A frase viajou sem o escopo. Em
   >   `ENABLE_DEV_TOOLS`, `ENABLE_TELEMETRY_DEBUG_SCREEN` e `ENABLE_BETA_GATE`,
   >   quem coincide com `production` é o **`e2e-test`**, não o `preview`.
   >
   > **✅ ENCERRADO em 2026-08-03 (quarta sessão).** A suíte foi medida sob
   > `APP_ENV=production` e `ENABLE_PUSH=true` nas duas plataformas: **6/6 no iOS
   > e 6/6 no Android**, incluindo um flow novo (`rating-prompt`) que é o único a
   > alcançar `MIN_APP_OPENS`. Evidência em
   > [`2026-08-03-e2e-producao-rating-prompt.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).
   >
   > **A premissa do item também estava errada, e de um jeito que importa.** Ele
   > dizia que o prompt de avaliação "nunca foi exercitado em device". O motivo
   > não era falta de execução: `RatingPromptService` conta `app_open`, e esse
   > evento tinha um único emissor, na home legada, inalcançável desde que a
   > Learning Road virou a home oficial. **Nenhuma build o emitia**, então o
   > prompt era inalcançável, não apenas não medido. Corrigido em `f499714`.
   > Nenhuma rodada de device teria fechado este item sem essa correção — a lição
   > é que "nunca medido" e "impossível" produzem exatamente a mesma evidência.

   > **O eixo real deste item**, e o que ele deve pedir daqui em diante: o
   > `e2e-test` difere de `production` em `EXPO_PUBLIC_APP_ENV`
   > (`development` vs `production`) e `EXPO_PUBLIC_ENABLE_PUSH` (`false` vs
   > `true`). O `APP_ENV` não é cosmético: ele desliga o selo BETA da home
   > (`HomeScreen.tsx`) e é a única condição em que o `RatingPromptService` não
   > retorna cedo (`APP_ENV !== 'production'` → early return), ou seja, **o
   > prompt de avaliação só existe em produção e nunca foi exercitado em
   > device**. Fechar este item é rodar a suíte sob essa configuração — não sob
   > `preview`, que é um proxy pior que o já usado.
4. ~~`JourneyMap` renderiza tema claro em tela escura e quebra rótulos no meio da
   palavra (task B2).~~ Corrigido em 2026-07-27 (task B2): tema `galaxyColors` e
   rótulos quebrando só em limite de palavra. O defeito de folga da tab bar foi
   resolvido em todas as telas roláveis nesta data (task B1).
5. ~~Nó de reward sem cobertura E2E (track ativo tem 7 lições; conquista só no
   final).~~ **Fechado no escopo de deep link em 2026-08-04** pelo flow
   `reward-locked.yaml`, verde nas duas plataformas (iOS 82s, Android 81s).
   Escrever a cobertura achou um defeito real antes de existir flow: a tela
   mostrava conquista bloqueada como "Pronta para ser coletada" com 0 de 14
   marcos, e o botão gravava `markNodeCompleted` — alcançável por deep link, de
   fora do app. Corrigido primeiro, coberto depois, porque um flow escrito antes
   teria feito o contrato **defender** o defeito. Evidência em
   [`2026-08-04-b5-reward-deep-link.md`](../../radiant-app/docs/evidence/2026-08-04-b5-reward-deep-link.md).
   **A metade que continua aberta:** a regra de destravamento, que exigiria
   percorrer as sete lições, segue sem cobertura.
   ~~**Reverificado em 2026-08-03: segue aberto**~~ — nenhum flow do `.maestro`
   afirma o nó, e o `maestro-contract.test.mjs` **proíbe** afirmá-lo no caminho
   crítico, porque ali ele seria inalcançável. Fechar este item exige um caso que
   percorra as sete lições, não uma asserção a mais no flow existente.
6. API pública inativa (HTTP 502) — decisão de estratégia pendente (ADR da
   Task 15).
   **Reverificado em 2026-08-03: segue aberto** — o `scripts/qa/docs-contract.mjs`
   reprova qualquer documento que afirme a API disponível, o que trava o estado
   canônico em inativa até a decisão existir.
7. ~~Onboarding não aparece em instalação limpa — pendente de confirmação de
   intenção.~~ **Resolvido em 2026-08-02.** A confirmação veio e está em
   [`ADR-2026-08-02`](../adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md): o
   dono separou **wizard de setup** (segue removido) de **apresentação** (foi
   aprovada e construída). Instalação limpa agora vê três telas puláveis
   narradas pelo Pixel antes da Learning Road; o gatilho é a ausência da chave
   `@radiant/first_run_v1`, então instalação já existente vê uma vez. Detalhe no
   item B6 mais abaixo.
8. Dívidas rastreadas. ~~54 warnings de lint, 122 achados visuais no baseline,~~
   42 itens editoriais `formatNeedsReview`, ~~121 referências com caminho
   absoluto da máquina em docs.~~ **Remedido em 2026-08-03:** **11** warnings de
   lint (a B7 fechou em 2026-07-31), **83** achados visuais — dos quais 81 em
   baseline datada e 2 exceções de arquétipo, com **zero regressões** — e **59**
   ocorrências de caminho absoluto, em 13 arquivos. Os 42 itens editoriais
   **não** foram remedidos nesta data e seguem como o número herdado.
   **Atualizado em 2026-08-03 (segunda sessão):** das 59 ocorrências, as **5 que
   viviam em documentos operacionais foram corrigidas** (duas delas eram links
   markdown quebrados, não questão de estilo) e as **54 restantes ficam por
   decisão**: são blocos de comando de planos e evidências fechados, onde o
   caminho absoluto é registro do que foi executado. Ver a task D7. Os 42 itens
   editoriais são a D4, cuja triagem mostrou que a unidade real são 30 excertos.
9. ~~**Trilha de lojas inexistente:** sem conta Apple Developer/Play Console
   confirmada no plano, sem metadados, screenshots, política de privacidade
   hospedada, privacy labels, data safety, ou submissão de qualquer build.~~
   **Desatualizado desde 2026-07-30.** A preparação de loja foi feita: os doze
   screenshots publicáveis de iPhone existem em `docs/store/assets/`, com
   contrato de assets verificado por reversão, e há kit de convite de testadores.
   O que **continua aberto** neste item é a submissão em si — nenhum build foi
   enviado a nenhuma loja. Ver `EXECUTION_STATUS_2026-07-29.md` §2 para o que já
   está pronto, e trate este item como "submissão pendente", não como "trilha
   inexistente".

## 3. Estratégia

1. **Local-first é o produto lançável.** A API não entra no caminho crítico do
   lançamento; a decisão sobre ela (Task 15) só precisa acontecer antes do
   beta público para fixar flags e copy honesta (`ENABLE_REMOTE_SYNC=false` em
   produção enquanto a ADR não autorizar o contrário).
2. **A trilha de lojas começa agora, em paralelo à engenharia.** Os prazos
   administrativos (verificação de conta, D-U-N-S, teste fechado de 14 dias no
   Play) são os itens de maior latência do plano e não dependem de código.
3. **Android é o maior risco técnico.** Paridade Android (prebuild + E2E) vem
   antes de qualquer polimento novo.
4. **Beta antes de produção nas duas lojas.** TestFlight no iOS; closed
   testing no Play (obrigatório se a conta for pessoal e nova — ver §4).

## 4. Requisitos externos pesquisados (2026)

Datas e regras que moldam o cronograma:

| Requisito | Regra | Impacto no Radiant |
| --- | --- | --- |
| Play: target API | Novos apps devem mirar Android 16 (API 36) até 31/08/2026; extensão possível até 01/11/2026 | Atendido pelo Expo SDK 54 / RN 0.81 (target 36 por padrão; edge-to-edge obrigatório — já habilitado no `app.json`) |
| Play: teste fechado | Conta pessoal criada após 13/11/2023 só publica em produção após closed test com ≥ 12 testadores opted-in por 14 dias consecutivos | Se a conta for pessoal e nova, adiciona ~3–4 semanas ao caminho crítico Android → iniciar a trilha de conta imediatamente ou usar conta de organização (exige CNPJ + D-U-N-S) |
| Play: verificação de desenvolvedor | Começa no Brasil em 30/09/2026 | Concluir cadastro e verificação antes dessa janela reduz atrito |
| App Store: SDK mínimo | Desde 28/04/2026, builds devem usar SDK do iOS 26 (Xcode 26) | Garantir Xcode 26 na máquina de build ou usar EAS Build (imagens já compatíveis com SDK 54) |
| App Store: privacidade | Privacy nutrition labels detalhados, privacy manifests, política de privacidade com URL pública | Telemetria precisa de allowlist documentada (Task 16) antes de preencher os labels |
| App Store: conta | Exclusão de conta dentro do app é obrigatória se houver criação de conta | Local-first sem conta obrigatória evita a exigência; se auth entrar (ADR da API), a exclusão in-app vira requisito |
| Apps de saúde/educação | Disclaimers: app educacional, não substitui conselho médico | Adicionar disclaimer no onboarding/metadados das lojas |
| Custos de conta | Apple Developer Program US$ 99/ano; Play Console US$ 25 única vez | Orçamento mínimo de contas |

Fontes: ver §9.

## 5. Marcos (metas com critério de saída)

| Marco | Meta | Critério de saída | Alvo |
| --- | --- | --- | --- |
| **M0 — Contas e fundações de loja** | Contas ativas e verificadas nas duas lojas | Apple Developer + Play Console verificados; app criado nas duas consoles; decisão pessoal vs organização registrada | Semana 1–2 (até ~2026-08-10) |
| **M1 — Qualidade pendente fechada** | Gate 2 aprovado e defeitos conhecidos corrigidos | Itens 1, 2 e 5 do Gate 2 com evidência (o item 1 voltou ao critério em 2026-08-05, task B8); ProgressScreen/JourneyMap corrigidos; reward coberto por E2E | Semana 2–3 |
| **M2 — Paridade Android** | Fluxo crítico PASS em Android | `expo prebuild` + build local; 3 flows Maestro PASS em emulador e 1 device físico | Semana 3–5 |
| **M3 — Prontidão de release** | Contratos de privacidade, telemetria e release prontos | Task 16 concluída: matriz real-device, contrato de telemetria, checklist v1.3, Sentry configurado; ADR da API registrada (Task 15) | Semana 5–6 |
| **M4 — Beta nas duas lojas** | Builds de produção em TestFlight e closed testing | Build `production` submetido; ≥ 12 testadores opted-in no Play por 14 dias; feedback triado P0–P3; pesquisa com usuários (Task 12) iniciada | Semana 6–9 |
| **M5 — Lançamento público** | Aprovação e produção nas duas lojas | Revisões aprovadas; rollout faseado no Play (10→50→100%); release iOS; monitoramento ativo | Semana 9–11 (até ~2026-10-12) |

Os alvos assumem dedicação contínua e nenhuma rejeição de loja com retrabalho
grande; o teste fechado de 14 dias do Play é o piso do caminho crítico entre
M4 e M5.

## 6. Ondas e tasks

Convenção: **[P0]** bloqueia lançamento; **[P1]** bloqueia beta de qualidade;
**[P2]** desejável antes da produção. Cada task deve terminar com evidência
(commit, screenshot, log ou documento) e passar `npm run quality` quando tocar
código.

### Onda A — Contas e fundações de loja (M0) — pode começar hoje, sem código

- **A1 [P0]** ~~Decidir tipo de conta Play~~ **Decidida em 2026-07-27:** Play
  pessoal + Apple individual — ver
  [ADR de contas de loja](../adr/ADR-2026-07-27-store-account-strategy.md).
  O closed test 12×14 do Play fica confirmado no caminho crítico (F2–F3).
- **A2 [P0]** Criar/verificar conta Apple Developer (US$ 99/ano) e Play
  Console (US$ 25); concluir verificação de identidade antes da janela de
  30/09/2026 do Brasil.
  **Lado Play CONCLUÍDO em 2026-07-31:** a conta já era paga e a **verificação de
  acesso a dispositivo Android** — que exigia aparelho real e bloqueava a publicação
  por qualquer caminho — foi concluída nesta data.
  **Lado Apple CONCLUÍDO em 2026-08-01:** o dono reverteu explicitamente a pausa
  de iOS, aderiu ao Apple Developer Program individual e aceitou os termos do
  App Store Connect. A ativação foi comprovada de forma independente pelo acesso
  a Certificates, Identifiers & Profiles e ao App Store Connect; a confirmação
  de compra isolada não foi tratada como prova de ativação.
  **Histórico:** em 2026-07-31 o dono havia decidido focar só no Android e adiar,
  sem cancelar, o lado Apple; essa pausa terminou em 2026-08-01.
  *Estado da conta Apple, medido em 2026-07-31 e registrado porque nenhum documento
  registrava:* existe neste host uma sessão autenticada do portal Apple Developer
  (`~/.app-store/auth/`), de **2026-03-30**, sob um e-mail **diferente** do contato
  declarado na política de privacidade. Isso **não** estabelece membresia paga —
  Apple ID gratuito também loga no portal — e o chaveiro não ajuda a decidir, porque
  o EAS guarda credenciais no servidor. A varredura anterior concluiu "estado
  desconhecido" varrendo **documentos do repositório**, instrumento que mede a
  prática de documentar, não o estado de um sistema externo.
- **A3 [P0]** Criar o app nas consoles com `com.ascendcreative.radiant`.
  **Play: CONCLUÍDA em 2026-07-31** — app criado com o título
  `Radiant — Radiologia` (o valor da fonte
  [`textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md); o `Radiant` puro é o nome
  da App Store, e o runbook mandava digitá-lo por engano). O identificador de pacote
  é digitado **na criação** e é irreversível — conferir em Configurações → Detalhes
  do app antes do primeiro AAB.
  **App Store: CONCLUÍDA em 2026-08-01** — App ID explícito registrado com o mesmo
  bundle ID e registro iOS criado em pt-BR com o nome `Radiant — Radiologia`, o
  mesmo título público do Android, porque `Radiant` estava indisponível. O SKU
  interno é `RADIANT-IOS-001`; a versão inicial automática `1.0` foi corrigida e
  persistida como `1.3.0`, ainda em **Preparar para envio**.
- **A4 [P0]** ~~Publicar política de privacidade em URL pública~~ **CONCLUÍDA em
  2026-07-29**: no ar em `https://saudediagnostica.com/radiant/privacidade/`
  (HTTP 200, corpo byte a byte idêntico à fonte, verificado de fora). Junto com
  ela subiu a página de suporte (**E5**) em
  `https://saudediagnostica.com/radiant/suporte/`. Detalhe da verificação e o
  risco da PR não mergeada no
  [plano de closed testing](2026-07-29-android-closed-testing-plan.md), L2.3/L2.8.
  Resta colar as duas URLs nos consoles — o que destrava privacy labels e data
  safety. O texto (pt-BR, com seção de dados locais, telemetria e contato) foi
  escrito em 2026-07-27 em
  [`docs/legal/politica-de-privacidade.md`](../legal/politica-de-privacidade.md),
  fundamentado num levantamento do que o app realmente coleta (insumo do D2):
  controlador Anderson Melo (pessoa física); local-first sem conta obrigatória;
  telemetria só no dispositivo; notificações locais sem push token; crash
  reporting (Sentry) coberto como opcional, hoje desligado no perfil
  `production`; Expo Updates como único terceiro ativo. **Resolvido desde
  então:** a hospedagem (URL acima) e o e-mail/entidade — o texto publicado
  declara Anderson Melo como controlador, contato `anderson.smelo94@gmail.com`.
  **Link interno concluído em 2026-08-01:** a aba Progresso agora oferece o cartão
  sempre visível **Ajuda e informações**, com Política de Privacidade e Central
  de Suporte em links acessíveis, URLs centralizadas e falha de abertura contida.
  As 4 suítes focadas passaram com 14 testes e os dois destinos foram remedidos
  em HTTP 200. **A abertura em iPhone físico passou em 2026-08-05**, nos dois
  destinos e com retorno ao app; VoiceOver avançou, mas B4 permanece aberta por
  amostragem auditiva incompleta. Evidência no relatório físico da F1.
  **Continua pendente:** revisão jurídica do texto, que é a única ressalva
  restante; ela não bloqueia E3, porque a URL já existe e o conteúdo publicado é
  o que foi declarado no Data Safety.
- **A5 [P1]** Configurar `eas submit`. **Reduzida a um único passo, e ele é
  humano (medido em 2026-08-04):** o procedimento está completo e executável em
  [`EAS_SUBMIT_SETUP.md`](../store/EAS_SUBMIT_SETUP.md), com o track correto
  (`alpha`) e a verificação de proteção do `.gitignore` reconferida. Falta apenas
  **gerar a service-account key** no Play Console e colocá-la em
  `radiant-app/credentials/` — a pasta existe e está vazia. Nada disso bloqueia
  publicar: o AAB vai pelo console à mão, e o `eas submit` é automação. **O bloco
  `submit.production.android` do
  `eas.json` foi preenchido em 2026-07-29** (`serviceAccountKeyPath`, `track`,
  `releaseStatus`) — a redação anterior desta task, "hoje só tem `ios: {}`",
  deixou de valer naquela data. `radiant-app/credentials/` existe, vazio e
  protegido pelo `.gitignore` da raiz. **Lado iOS concluído em 2026-08-01:**
  `submit.production.ios.ascAppId` foi configurado; certificado de distribuição,
  provisioning profile e App Store Connect API key foram criados pelo EAS; o
  build `1.3.0 (4)` foi submetido e ficou pronto no TestFlight. **Continua
  pendente apenas no lado da automação:** gerar a service-account key do Play.
- **A6 [P1]** ~~Recrutar ≥ 14 testadores (12 é o mínimo do Play; margem para
  churn) — alinhado ao recrutamento da Task 12 (5–8 participantes de pesquisa
  podem vir do mesmo pool).~~ **CONCLUÍDA e verificada em 2026-08-03:** a página
  da faixa no Play Console mostrou 14 contas vinculadas ao track `alpha`,
  confirmando a margem de churn. O repositório não persiste endereços por
  decisão de privacidade. **A6 fecha aqui; F2 não.** O painel mostrou apenas 2
  opt-ins, e é o opt-in que inicia o relógio de 14 dias.

### Onda B — Qualidade pendente (M1) — engenharia, já autorizada no status

- **B1 [P0]** ~~Corrigir `ProgressScreen`~~ **Concluída em 2026-07-27.** O
  escopo real era maior: a correção de 86d1867 aplicou `tabBarClearance` apenas
  ao `JourneyHomeScreen`, e o defeito seguia vivo em quatro telas —
  `HomeScreen` (32pt), `ProgressScreen` (24pt), `MissionsScreen` (120pt mágico)
  e `GalaxyMapScreen` (110pt mágico). As quatro passaram a usar a constante e o
  contrato virou teste estrutural em
  `radiant-app/scripts/tab-bar-clearance-contract.test.mjs`, ligado ao
  `npm run quality`.
- **B0 [P0 — RESOLVIDA em 2026-07-27; ponta B0.2 aberta]** ~~NOVO, bloqueia o
  beta.~~ *(Estado promovido ao cabeçalho em 2026-08-04, pela mesma razão da D1:
  a resolução já estava no corpo, mas o cabeçalho seguia dizendo "bloqueia o
  beta" para quem triasse a lista. É o cabeçalho que é lido.)*
  A flag `ENABLE_LEARNING_ROAD` tinha
  default `false` e **não é definida nos perfis `development`, `preview` nem
  `production`** do `eas.json`; só o perfil `e2e-test` a liga. Consequências
  verificadas em 2026-07-27:
  1. Um build de produção renderiza `HomeScreen`, não `JourneyHomeScreen`.
  2. Todo o E2E em device de 2026-07-26 rodou sob `e2e-test`, ou seja,
     validou a Home da trilha — uma tela que o usuário de produção não vê.
  3. O `.env` local também liga a flag, então o desenvolvimento manual observa
     a mesma tela do E2E, e não a de produção.
  > **O que fechar esta task custou, descoberto só em 2026-08-03.** Ligar a
  > Learning Road em todos os perfis é o que tornou a `HomeScreen` legada
  > inalcançável — e era nela que vivia o **único** emissor de `app_open`, junto
  > com `markDayOpen()` e o reset de backoff de push. A correção era certa e o
  > efeito colateral foi invisível por sete dias: nenhum teste falhou, nenhum
  > contrato reprovou, e três documentos seguiram afirmando o evento como
  > emitido. Corrigido em `f499714`. **A lição que vale além desta task:** quando
  > uma decisão torna uma tela inalcançável, o que morre com ela não é só a tela
  > — é todo comportamento que só existia ali, e nada no arnês avisa.

  **Decidida em 2026-07-27: a v1.3 lança com a Learning Road** — ver
  [ADR da home de produção](../adr/ADR-2026-07-27-learning-road-como-home.md).
  A flag passou a ser declarada em `development`, `preview` e `production`, e o
  default em `src/config.ts` virou `true` para que nenhum build divirja do que
  é distribuído. Com isso a evidência de E2E de 2026-07-26 volta a valer para o
  caminho de produção. Restam duas pontas:
  - **B0.1 [P0]** ~~reexecutar os três flows Maestro sob o perfil `preview`, que
    agora reflete produção, e registrar a evidência.~~ **Concluída para iOS em
    2026-07-28:** `3/3 Flows Passed in 6m 52s` sobre build Release local com
    bundle embutido (equivalente ao `e2e-test`: sem dev client, sem Metro). A
    execução anterior do mesmo dia falhou 1/3 — o `learning-critical-path` ainda
    afirmava a tarja em inglês da celebração de checkpoint, que o commit
    `fb1af1f` migrou para pt-BR junto com a troca do CTA fixo pelo rótulo do
    próximo nó. O flow foi repontado e o contrato ganhou uma guarda que extrai a
    string da própria `CheckpointScreen.tsx`, para que a mesma deriva não volte a
    passar verde. Evidência e receita de build em
    [`radiant-app/docs/evidence/2026-07-28-e2e-local-release.md`](../../radiant-app/docs/evidence/2026-07-28-e2e-local-release.md).
    **Android rodou pela primeira vez em 2026-07-28 e ficou `app-failed`**, não
    mais `environment-blocked`: `expo prebuild --platform android --no-install`,
    APK Release e emulador `Radiant_Pixel_9_API_36` produziram **2/3** —
    `boot-to-home` e `offline-relaunch` verdes, `learning-critical-path` vermelho
    em `tapOn: 'Progresso, tab.*'`, seletor que afirma o formato de
    acessibilidade que só o iOS compõe. A mesma execução revelou dois defeitos de
    ícone exclusivos do Android (ver bloqueio 4 do status canônico). Evidência em
    [`radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md`](../../radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md).
    **Fechado em 2026-07-29: Android `passed`, 3/3 (`11m 48s`); iOS reconfirmado 3/3.**
    Com isso **B0.1 fica concluída nas duas plataformas** — ver
    [`radiant-app/docs/evidence/2026-07-29-android-e2e-close.md`](../../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
  - **B0.2 [P1]** ~~atualizar a seção "Learning Road" do `radiant-app/README.md`~~
    **Concluída em 2026-07-27.** A seção deixou de descrever a Learning Road como
    redesign em andamento e passou a tratá-la como a home de produção entregue da
    v1.3 (sem o enquadramento "primeiro slice / rollout V2"), e ganhou um plano
    explícito de remoção da `HomeScreen` morta pós-beta (branch de flag em
    `(tabs)/index.tsx`, arquivos da `HomeScreen` e a flag `ENABLE_LEARNING_ROAD`).
- **B2 [P1]** ~~Corrigir `JourneyMap`: tema escuro correto e quebra de rótulos~~
  **Concluída em 2026-07-27.** Os dois defeitos tinham a mesma origem: os
  componentes do mapa (`JourneyMap`, `JourneyNodeCard`, `JourneyMapHeader`)
  usavam a paleta clara `colors` e o `SurfaceCard` claro, mas só renderizam
  dentro do `JourneyHomeScreen` escuro — saía um card branco no fundo escuro.
  Passaram a usar `galaxyColors` e um container próprio (padrão do `JourneyHero`,
  não o `SurfaceCard` compartilhado). A quebra no meio da palavra vinha do card
  do zig-zag com o ícone inline comendo a largura; o ícone foi empilhado acima do
  texto e o card alargado, dando largura para o texto quebrar só em limite de
  palavra. Guarda estrutural nova em
  `scripts/maestro-contract.test.mjs`: esses componentes devem usar
  `galaxyColors`, nunca a paleta clara. Verificado no build web a 375px.
- **B3 [P0]** ~~Gate 2 item 5: build web + navegação por teclado~~ **Concluída em
  2026-07-27.** Build web estática gerada (`npx expo export --platform web`; o
  `app.json` já usa `web.output: static`) e o fluxo crítico (Learning Road →
  lição → quiz → onboarding/entrar) percorrido só por teclado. Ordem de foco
  lógica, foco visível em todos os controles (anel `outline: auto` do navegador +
  borda 3px do `AppButton`), sem armadilhas de foco (a Home cicla e fecha; a rota
  de lição contém o foco) e alvos ≥ 44px (atalho da Home 56px, ação de entrar
  44px). Evidência:
  [`radiant-app/docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md`](../../radiant-app/docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md).
  ~~Com isso o Gate 2 fica em 4/5; resta só o item 2 (B4).~~ **Corrigido em
  2026-08-05: o gate fica em 3/5 (itens 3, 4 e 5), porque o item 1 teve seu
  critério ampliado em 2026-08-03 e precisa de nova passagem manual.** A
  entrega da B3 em si não mudou.
- **B4 [P0 — EM ANDAMENTO; AMOSTRA FÍSICA SEM DUPLICAÇÃO]** Gate 2 item 2:
  sessão humana de VoiceOver com áudio. Em 2026-08-05, abas e um `AppButton`
  desabilitado anunciaram nome, estrutura e estado uma vez; faltam uma dica e
  um estado ocupado real para fechar o roteiro em
  `radiant-app/docs/ACCESSIBILITY_QA_V1.md`.
- **B5 [P1 — ABERTA; O FLOW DA REGRA EXISTE, FALTA APARELHO]** Cobrir o nó de
  reward com E2E. O deep link cobre a tela e o estado bloqueado
  (`reward-locked.yaml`, medido em 2026-08-04).

  > **Escrito em 2026-08-04:** `reward-unlock.yaml` percorre as sete lições e os
  > seis checkpoints e coleta a conquista, e `scripts/maestro-contract.test.mjs`
  > o governa. **Não foi executado em aparelho** — por isso a task continua
  > aberta e não recebeu risco. Custo esperado da execução: ~16 min no iOS e
  > ~13 no Android, mais build e instalação, em janela exclusiva de host.
  >
  > **A escolha de rota foi medida, e a enumeração de 2026-07-27 tinha uma
  > lacuna.** Existia uma terceira via: a trilha `Abdome`, de 5 lições,
  > alcançável pela prateleira de trilhas (`selectTrack`), sem código de teste e
  > exercitando os mesmos ramos. Ela pouparia ~5 min por plataforma, mas
  > apontaria para outro nó — com as sete lições os dois flows ficam sobre o
  > **mesmo** `node:reward:fundamentos:final`, um provando bloqueado e o outro
  > destravado. A fixture ficou fora por um motivo mais forte que o registrado:
  > com 2 lições ela cai no ramo `lessonCount <= 2` de `rewardNodeId()`, que
  > constrói um id que produção nunca constrói; seriam necessárias **3** para os
  > ramos coincidirem, e ainda assim custaria uma flag de teste no binário.
  >
  > **Contrato mutado, duas guardas não mordiam.** Uma real: "Receber conquista"
  > é o rótulo do CTA da home **e** do botão de coleta, então uma asserção de
  > presença ficava verde mesmo removendo a chegada pela home — a única parte
  > que prova a regra. A outra foi um falso verde: a mutação nunca chegou a
  > aplicar por escape errado de shell. **Guarda não exercitada se parece com
  > guarda aprovada.** Detalhe e o achado sobre o `?` sem escape em
  > `reward-locked.yaml` estão em
  > [`E2E_RUNBOOK.md`](../../radiant-app/docs/E2E_RUNBOOK.md).
- **B6 [P1]** ~~Onboarding em instalação limpa~~ **Investigada em 2026-07-27.**
  Não é defeito de runtime: "instalação limpa → Home" é consequência correta da
  Learning Road ser a home (a home já recebe o usuário com o Pixel e destaca o
  próximo passo — casa com a copy "é só abrir e estudar"). A investigação revelou
  **código morto de onboarding**, não uma armadilha: (1) o wizard
  `src/app/onboarding/*` é protótipo inacabado — conteúdo em inglês que não bate
  com o catálogo pt-BR, especialidades falsas hardcoded, **não persiste nada**
  (escolhas descartadas no "Build my plan →") e **nenhuma tela de produção navega
  até ele** (só deep link); (2) o onboarding suave (`OnboardingService`
  intro/closure) está fiado só na `HomeScreen` clássica morta, então nunca aparece
  na Learning Road. **Recomendação (confirmar com Anderson):** manter o onboarding
  frictionless da Learning Road na v1.3 (sem wizard) e **remover o wizard + o
  onboarding suave junto com a `HomeScreen`** (ver plano estendido no
  `radiant-app/README.md`); se um setup guiado for desejado no futuro, o wizard
  precisa ser reconstruído (pt-BR, catálogo real, persistindo as escolhas).
  **Nenhuma correção de runtime é necessária para lançar.**
  **Confirmação do dono registrada em 2026-08-02 —
  [`ADR-2026-08-02`](../adr/ADR-2026-08-02-apresentacao-de-primeiro-uso.md).**
  A confirmação que este item pedia veio, e separou duas coisas que a
  recomendação acima juntava: **wizard de setup** (coleta preferências) e
  **apresentação** (explica o produto). A remoção do wizard segue valendo. A
  apresentação foi **aprovada e construída**: três telas puláveis narradas pelo
  Pixel, antes da Learning Road. Duas consequências para quem ler este item
  depois: (1) "instalação limpa → Home" **deixou de ser verdade** — agora é
  instalação limpa → apresentação → Home, e os flows Maestro precisam atravessá-la;
  (2) a parte da recomendação que manda **remover o onboarding suave
  (`OnboardingService`) junto com a `HomeScreen` clássica** continua em aberto e
  **não** foi decidida pelo ADR — mas o novo `FirstRunService` chama
  `OnboardingService.dismissIntro()`, então remover o serviço exige tratar essa
  chamada no mesmo run.
- **B7 [P2]** ~~Reduzir warnings de lint por domínio sem supressões globais~~
  **CONCLUÍDA em 2026-07-31: 65 → 11 warnings, 0 erros.** Meta era ≤ 20.

  A contagem herdada estava errada em toda parte (`54` nesta linha, de 07-27; `62`
  no status, de 07-30); recontada, eram **65**. E medindo **por regra e por
  arquivo**, 40 dos 65 **não eram dívida**:
  - **37** `no-require-imports` estavam dentro de fábricas `jest.mock()`, onde
    `require()` é **obrigatório** — o Jest içia `jest.mock` acima dos imports e a
    fábrica não pode referenciar binding de fora do escopo. Converter quebraria os
    testes.
  - **2** em `.rnstorybook/storybook.requires.ts`, que se declara
    `auto generated by storybook`.
  - **1** em `.expo/types/router.d.ts`, também gerado.

  **O que foi feito:** os 16 mecânicos corrigidos de fato (6 `array-type`, 5
  `no-unused-vars`, 4 `import/first`, 1 `no-empty-object-type`); e o
  `eslint.config.js` passou a ignorar os dois caminhos gerados e a desligar
  `no-require-imports` **apenas em `**/*.test.ts(x)`**, com a razão escrita no
  próprio arquivo. **Não é supressão global:** a regra segue valendo em todo o
  código de produção, que é onde proibir `require()` faz sentido. O ruído de 40
  warnings incorrigíveis era o que impedia alguém de olhar os que importam.

  Editar o `eslint.config.js` exigiu alargar `writePolicy.allowedRoots`, feito em
  **transação própria e anterior**, pelo mesmo padrão do alargamento para
  `radiant-app/assets` (commit `38f59b8`).

  **Restam 11**, e a natureza mudou: **9** `react-hooks/exhaustive-deps`, que
  exigem julgamento caso a caso porque mexer em dependências de hook altera
  comportamento, e **2** diretivas `eslint-disable` que ficaram órfãs — alguém já
  havia contornado a mesma regra arquivo a arquivo antes. Para o valor de agora,
  recontar em vez de citar qualquer número desta linha:
  `cd radiant-app && npx eslint . --format json`.

- **B8 [P1 — ABERTA; CRIADA EM 2026-08-05 PELA RECONTAGEM DO GATE]** Gate 2
  item 1: refazer a caminhada manual de Reduce Motion em device, agora no
  escopo ampliado — mapa da galáxia, interior de galáxia e interior de planeta,
  além de shake, scale e press, que a passagem de 2026-07-26 declarou não ter
  medido. O critério de aprovação inclui a distinção visual sob a preferência: o
  brilho deve repousar no valor de descanso do ciclo, não ir a zero; se todos os
  planetas ficarem iguais, a preferência apagou estado e isso é defeito. A
  cobertura de código existe desde 2026-08-03 (`PlanetBody.test.tsx`); o que
  falta é a passagem humana. Roteiro em
  [`radiant-app/docs/ACCESSIBILITY_QA_V1.md`](../../radiant-app/docs/ACCESSIBILITY_QA_V1.md).
  Pode ser executada junto da B4, no mesmo aparelho e na mesma sessão.

### Onda C — Paridade Android (M2)

- **C1 [P0]** ~~`expo prebuild` Android; build local com JDK/SDK documentados;
  registrar runbook em `radiant-app/docs/E2E_RUNBOOK.md`.~~
  **CONCLUÍDA em 2026-07-28, marcada só em 2026-08-03.** O `expo prebuild
  --platform android --no-install` rodou, o APK Release local foi construído e
  instalado em emulador, e a receita reproduzível ficou em
  [`2026-07-28-android-e2e-first-run.md`](../../radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md),
  com o `E2E_RUNBOOK` recebendo os pré-requisitos e o orçamento de host.
  *Por que ficou sem marca por seis dias:* o bloqueador 2 desta mesma página foi
  riscado em 2026-07-28 com a evidência correta, mas a task que o implementava
  não foi tocada no mesmo run — as duas afirmam o mesmo fato e só uma foi
  atualizada. É o modo de falha que o `AGENTS.md` descreve: trabalho não
  sinalizado é tratado como não feito pela próxima sessão, e três sessões
  releram este item como aberto.
- **C2 [P0]** ~~Smoke manual em emulador: navegação completa, edge-to-edge,
  predictive back (hoje `predictiveBackGestureEnabled: false` — validar a
  escolha sob target 36), teclado, fontes ampliadas.~~ **Executada em 2026-08-03**,
  instrumentada em vez de manual — quatro dos cinco itens são observáveis por
  Maestro + `adb`, e o quinto não tem objeto. Evidência em
  [`2026-08-03-c2-smoke-android.md`](../../radiant-app/docs/evidence/2026-08-03-c2-smoke-android.md).
  Achou **um defeito real**: a barra de status do sistema era conteúdo escuro
  sobre `#03030d` (1,02:1), em todas as telas e nas duas plataformas, e estava
  assado nos seis screenshots publicáveis do Play. Corrigido na mesma data, com
  contrato que deriva o valor exigido da luminância do fundo. **Teclado ficou
  como não aplicável**: nenhuma das quatro `TextInput` do código é alcançável na
  configuração distribuída. Segue aberto, fora desta task: o `eyebrow` do
  `JourneyHero` quebra no meio da palavra a 2× de escala.
- **C3 [P0]** ~~Os 3 flows Maestro PASS em emulador Android~~ **Concluída em
  2026-07-29:** `3/3 Flows Passed in 11m 48s` no emulador `Radiant_Pixel_9_API_36`
  (iOS reconfirmado 3/3). Exigiu dois defeitos de E2E (seletor de aba ancorado
  `^Progresso(, tab.*)?$`; lift-scroll nos CTAs oclusos pela tab bar flutuante) e a
  resolução de uma causa ambiental (RAM do host de 16GB). Evidência em
  [`radiant-app/docs/evidence/2026-07-29-android-e2e-close.md`](../../radiant-app/docs/evidence/2026-07-29-android-e2e-close.md).
  **Superada em 2026-08-03: são 5 flows, não 3, e as duas plataformas fecham
  5/5** sobre builds Release locais da 1.3.1 — a suíte ganhou `first-run` e
  `store-capture` desde esta marcação. Ver
  [`2026-08-03-e2e-1.3.1-ios-android.md`](../../radiant-app/docs/evidence/2026-08-03-e2e-1.3.1-ios-android.md).
  A ressalva do bloqueador 3 continua valendo: tudo foi colhido sob `e2e-test`.
- **C4 [P1]** Rodar os flows em ≥ 1 device Android físico (compacto ou médio,
  conforme matriz da Task 16).
- **C5 [P1]** TalkBack: repetir o checklist do Gate 2 no Android.
- **C6 [P2]** Baseline de performance Android (cold start, FPS; Flashlight
  opcional) para comparação pós-lançamento.

### Onda D — Prontidão de release (M3) — Tasks 15 e 16 do roadmap anterior

- **D1 [P0 — PARCIAL: configuração feita, ADR pendente]** ADR da estratégia de
  API (Task 15): auditoria read-only e
  decisão entre manter local-first puro, catálogo remoto, ou catálogo+auth+
  sync. *(Estado promovido ao cabeçalho em 2026-08-03: a prosa já dizia "resta a
  ADR" na última linha, mas o cabeçalho não dizia nada, e uma varredura deste
  documento classificou a task como concluída. A convenção da página é marcar o
  estado no cabeçalho — ver F1 e F2 —, porque é o cabeçalho que é lido ao
  triar.)* **Parte de configuração concluída em 2026-07-27**, com uma correção
  importante da premissa original deste plano: eu havia registrado que
  `ENABLE_REMOTE_SYNC=true` em produção geraria UX quebrada. Isso estava
  errado. `EXPO_PUBLIC_API_BASE_URL` não é definida em nenhum perfil do
  `eas.json`, e tanto o `SyncQueueService` quanto a tela de Progresso exigem
  `isApiConfigured()` além da flag — o sync já era inerte em todo build. O que
  existia de verdade era desonestidade de configuração: o painel de
  homologação anunciava "Sync remoto: ativado" enquanto nada sincronizava.
  Feito: os perfis `preview` e `production` passam a declarar
  `ENABLE_REMOTE_SYNC=false`, que é o estado real enquanto a API responde 502
  (reconfirmado por smoke público read-only em 2026-07-27), e o painel passa a
  exibir o estado efetivo (`ligado, sem API configurada` quando a flag está
  ligada sem API). Resta a ADR de estratégia da API, que é decisão de produto.
  **Rascunho pronto em 2026-08-04:**
  [`ADR-2026-08-04`](../adr/ADR-2026-08-04-estrategia-da-api.md) — estado medido
  (502 reconfirmado; gateway de pé, upstream fora), as três opções e o que cada
  uma arrasta. **Aguarda apenas a linha do decisor.** Dois achados que a redação
  desta task não continha: a API **já está escrita e testada** (949 linhas de
  rotas), então a decisão é subir ou arquivar, não construir; e "local-first puro"
  **não é opção livre**, porque contradiz o `ADR-2026-08-01`, que decidiu conta
  própria para o premium. O rascunho também recomenda **decidir isto antes da
  E3**: contas mudam as respostas de privacy labels e Data safety, e responder
  E3 antes significa provavelmente respondê-la duas vezes.
- **D2 [P0]** ~~Contrato de telemetria/privacidade (Task 16)~~ **Concluída em
  2026-07-27.** Contrato em
  [`docs/legal/CONTRATO_TELEMETRIA.md`](../legal/CONTRATO_TELEMETRIA.md), com:
  (a) allowlist de eventos já imposta em tempo de compilação pelo tipo
  `TelemetryEventName`; (b) proibições de propriedades (PII, credenciais,
  conteúdo clínico) em `sanitizeTelemetryProps.ts`, com mecanismo de exceção
  revisada (`REVIEWED_SAFE_KEYS`, hoje só `tokenPreviewAvailable`, um booleano);
  (c) imposição por teste de contrato (`telemetry-privacy-contract.test.ts`, no
  gate `app-test`) que varre as chamadas `track()` e falha em chave proibida;
  (d) scrub no adapter do Sentry (breadcrumb + context passam por
  `sanitizeTelemetryProps`; `sendDefaultPii=false`, user só `id`). Inclui o
  mapeamento para privacy labels (iOS) e data safety (Play). **Verificado:** hoje
  nenhuma propriedade de telemetria sai do device (analytics remoto off, Sentry
  off em `production`). Destrava **E3** (preencher as fichas das lojas).
- **D3 [P0]** ~~Checklist de release v1.3 + matriz real-device (Task 16)~~
  **Concluída em 2026-07-27.** Checklist go/no-go em
  [`docs/release/CHECKLIST_RELEASE_V1.3.md`](../release/CHECKLIST_RELEASE_V1.3.md),
  cobrindo qualidade/a11y, versionamento (D5), E2E + matriz real-device (iOS
  6,7"/6,1", iPad condicional, Android compacto/médio, com os checks por linha),
  privacidade/telemetria, metadados de loja, contas/submissão e pós-lançamento —
  cada item com estado (✅/⏳/⛔) e link para a task detalhada, mais um resumo dos
  bloqueios de submissão. É o checklist que se percorre antes de cada submissão,
  não uma reescrita do roadmap.
- **D4 [P0]** Gate editorial. **Triado em 2026-07-31 — a redação anterior, "triar
  os 42 itens `formatNeedsReview`", descrevia mal o trabalho nas duas direções.**
  Medição em [`docs/content/2026-07-31-d4-triagem-editorial.md`](../content/2026-07-31-d4-triagem-editorial.md):
  - os **42 bundles são 7 conceitos × 6 formatos** — os seis formatos marcam o mesmo
    conjunto, o campo de motivo está vazio nos 42, e o estado foi herdado do
    conceito. Triar "os 42" faz o revisor ler o mesmo conceito seis vezes;
  - os **7 conceitos** também são derivados: todos têm ≥33% de excertos-fonte
    sinalizados, contra ≤25% em todos os 9 aprovados;
  - a unidade atômica são **30 excertos**, e **8 deles moram em conceitos
    aprovados** — invisíveis para uma triagem feita na camada dos bundles;
  - a dúvida **não é editorial**: os 30 vêm do classificador `deterministic-keyword-v1`
    caindo em *fallback* (13 sem sinal nos três níveis), confiança média 0,52 contra
    0,91 dos aprovados. É posicionamento na taxonomia, não correção clínica.

  ~~**Próximo passo (não decidido):** estender a cobertura de palavras-chave da
  taxonomia e reclassificar, medindo quanto da população cai sem intervenção humana;
  só o resíduo vai para o revisor de domínio.~~ Alocar revisor de radiologia antes
  disso é usá-lo para consertar dicionário. O gate não bloqueia o closed test —
  bloqueia a produção.

  **Medido em 2026-08-03, e o passo riscado acima teria piorado o dado.** A
  medição está em
  [`2026-08-03-d4-medicao-cobertura-taxonomia.md`](../content/2026-08-03-d4-medicao-cobertura-taxonomia.md).
  O vocabulário **é** pequeno (111 palavras-chave; 20 de 21 termos de domínio
  sondados não têm regra), mas estendê-lo não resolveria: **os 109 excertos
  cabem em 4 folhas de taxonomia**, 103 deles em duas, e a `mvp-2026-04-04` tem
  6 planetas e 6 estrelas — todos `planned` — descrevendo tórax e abdome,
  enquanto a fonte é um módulo de curso técnico (processamento radiográfico,
  acessórios de sala, medicina nuclear, RM, irradiação de alimentos). **Os sete
  conceitos sinalizados não têm nó de destino.** Acrescentar palavras-chave
  moveria os itens de `needs-review` para "aprovado" **no endereço errado**,
  derrubando o único sinal de que eles não têm endereço.

  **A decisão do dono mudou de pergunta.** Não é mais "estender o vocabulário, e
  por quem"; é: *a taxonomia de lançamento recebe nós para o material de curso
  técnico, ou esta fonte fica fora do currículo de lançamento?* Isso liga a D4
  diretamente à **G1**, cujo grafo das 30 competências não começou e é onde esses
  nós existiriam — as duas são o mesmo buraco visto de dois lados.

  Achado lateral: **4 dos 30 são defeito de extração**, não de classificação
  (fragmentos com menos de 80 caracteres; um deles é a palavra `são` sozinha).
  Essa fatia é trabalho de pipeline e não sai nem por taxonomia nem por revisor.
- **D5 [P1]** ~~Congelar versionamento: definir `1.3.0`, alinhar
  `ios.buildNumber`/`android.versionCode` e documentar a política de
  `runtimeVersion`~~ **Concluída em 2026-07-28.** `radiant-app/package.json` e
  `radiant-app/app.json` foram de `1.2.1` para `1.3.0` (alinhados entre si),
  `ios.buildNumber` de `"1"` para `"2"` e `android.versionCode` de `1` para `2`.
  A política `runtimeVersion: appVersion` já estava documentada aqui e no
  checklist de release; a runtime passa a `1.3.0` junto com a versão. Nenhum
  build publicado ainda, então a mudança ainda é livre — depois do primeiro
  build de F1/F2 deixa de ser (alerta do status 2026-07-26). Registrado no
  [status canônico de 2026-07-29](../EXECUTION_STATUS_2026-07-29.md).
- **D6 [P1]** Pesquisa com usuários (Task 12) começa aqui e corre em paralelo
  ao beta (M4); P0/P1 de pesquisa bloqueiam M5.
- **D7 [P2]** ~~Converter as 121 referências absolutas de docs para caminhos
  relativos (limpeza mecânica; melhora o repo para colaboradores).~~
  **CONCLUÍDA em 2026-08-03, com o escopo medido em vez de contado.** A
  contagem virou 59 ocorrências em 13 arquivos, mas "converter todas" era a
  tarefa errada: **54 delas estão dentro de blocos de comando de planos e
  evidências já fechados** (`2026-04-16-galaxy-unification`,
  `2026-07-31-remover-homescreen-morta`, os planos de 2026-07-23, as evidências
  de device). Ali o caminho absoluto **é o registro do que foi de fato
  executado naquele host**; reescrevê-lo não melhora o repo, falsifica a
  memória — a mesma razão pela qual esta página risca e data em vez de
  sobrescrever.

  O trabalho real eram **5 ocorrências em 3 documentos vivos**, todas feitas
  nesta data:
  - `radiant-app/docs/release/APP_STORE_METADATA.md` — dois links markdown
    **quebrados**, apontando para `/Users/anderson/Documents/Radiant/...`, que é
    o caminho **anterior** do projeto. Não eram feiura de portabilidade: eram
    links mortos num documento de ficha de loja. Agora relativos ao diretório.
  - `docs/store/RUNBOOK_PLAY_CONSOLE.md` (2) e `docs/store/EAS_SUBMIT_SETUP.md`
    (1) — comandos de runbook vivo, agora `cd "$(git rev-parse --show-toplevel)"`,
    portátil e ainda explícito sobre o diretório.

  Fica **deliberadamente sem tocar**: `docs/NOVO_VPS.md:41`, que aponta para
  outro projeto (`Developer/Novo VPS`) e é uma referência cruzada legítima, não
  um caminho do Radiant.

  A regra que este item ensina: **um item de limpeza medido por `grep -c` conta
  ocorrências, não trabalho.** Antes de executar uma limpeza mecânica, separe as
  ocorrências que são estado vivo das que são registro histórico — só as
  primeiras são para mexer, e a diferença não aparece na contagem.

### Onda E — Assets e metadados de loja (paralela a C/D)

- **E1 [P0]** **Android CONCLUÍDO em 2026-07-29** — os três assets gráficos do Play
  existem, travados pelo contrato (11/11 àquela data, **14/14** hoje, dentro do
  `npm run quality`):
  [`docs/store/ASSETS_DE_LOJA.md`](../store/ASSETS_DE_LOJA.md). Evidência em device
  do ícone da marca em
  [`2026-07-29-icone-marca-pixel.md`](../../radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md).
  **Ressalva, FECHADA no Android em 2026-07-30:** os screenshots mostravam
  progresso zerado (XP 0), e a causa foi investigada — **não era vitrine fraca,
  era defeito**. Em produção o laço de gamificação não tinha escritor alcançável:
  XP, sequência, revisões e meta diária ficavam permanentemente em zero.
  **Corrigido** nos commits `ab40bb1..056ffe1`, com gate verde, e **recapturado em
  device em 2026-07-30**: `XP total: 18` no checkpoint, `⚡ 36`/`🔥 1d` na home,
  `TOTAL XP 36` no progresso — ver
  [a evidência](../../radiant-app/docs/evidence/2026-07-30-laco-xp-device.md).
  A recaptura estava registrada como bloqueada por falta de JDK no host; **isso
  era falso** — o JDK 17 está instalado desde 2026-04-22 e o build sai em 48s
  (§4 do [status canônico](../EXECUTION_STATUS_2026-07-29.md)).
  **O lado iOS também fechou em 2026-07-30**, nos dois buckets: iPhone 16 Plus
  (6,7", 1290×2796) e iPhone 11 Pro Max (6,5", 1242×2688), ambos `EXIT=0` sobre
  build Release com env **production**. A mesma captura expôs e resolveu, no
  mesmo dia, os cards `PRECISÃO` e `TÓPICOS` sem dado por trás, e um defeito de
  oclusão no `store-capture.yaml` que travava o iOS. Evidência em
  [`2026-07-30-e1-store-capture.md`](../../radiant-app/docs/evidence/2026-07-30-e1-store-capture.md).
  **E1 está fechado nas duas plataformas** (iPad segue desligado na v1.3).
  **Complemento de 2026-07-30:** as capturas de iPhone deixaram de ser só
  evidência e viraram **assets publicáveis** — `docs/store/assets/screenshots-ios-67/`
  (1290×2796) e `screenshots-ios-65/` (1242×2688), seis telas cada. O
  `normalize-screenshots.py` passou a exigir `--spec`, porque o teto de 2:1 do
  Play **reprovava** os doze arquivos; o contrato de assets foi de 11 para 14
  testes, travando tamanho exato por bucket e paridade de telas entre eles.
  Escopo
  original: Screenshots por dispositivo: iPhone 6,7"/6,5" (iPad **desligado**
  na v1.3 — `supportsTablet: false`, decidido em 2026-07-29, o que remove os
  screenshots de tablet do escopo), Android phone + os **três** assets gráficos
  obrigatórios do Play. **Correção de 2026-07-29:** são três, não dois — **ícone
  512×512** (PNG 32-bit **com** alpha, ≤ 1024 KB), **feature graphic 1024×500**
  (**sem** alpha) e **≥ 2 screenshots de telefone**. Screenshot tem teto de
  proporção **2:1**: o nativo do emulador Pixel 9 (1080×2424 = 2,24:1) **seria
  recusado**; capturar em 1080×1920.
- **E2 [P0]** ~~Textos de loja pt-BR~~ **Rascunho pronto em 2026-07-27** em
  [`docs/store/textos-loja-pt-BR.md`](../store/textos-loja-pt-BR.md): nome,
  subtítulo (App Store, 3 opções) / título (Play), descrição curta (Play),
  texto promocional, descrição longa, keywords e notas de release da v1.3, tudo
  dentro dos limites de caracteres, mais o disclaimer educacional. Decisões:
  categoria **Educação**, gratuito no lançamento (freemium futuro, sem prometer
  "grátis para sempre"), ângulo de método (trilha + revisão espaçada). Sem
  alegação médica/clínica e sem números inventados. **Pendente:** aprovação de
  Anderson (escolher variantes), reserva do nome (A3) e revisão de domínio.
  **Confirmado em 2026-07-31:** o posicionamento "sem conta" fica na v1.3 porque
  descreve o binário distribuído — o bloco de login existe no código mas é inerte
  sem `EXPO_PUBLIC_API_BASE_URL`. Conta e assinatura premium ficam para a **v1.4**:
  ver [ADR-2026-07-31 — conta e premium](../adr/ADR-2026-07-31-conta-e-premium.md).
  **Fechado em 2026-08-01:** o modelo de cobrança deixou de estar em aberto e é
  **conta própria + billing**, porque o produto passou a ter as duas plataformas e
  o direito de acesso precisa atravessá-las — ver
  [ADR-2026-08-01 — modelo de entitlement](../adr/ADR-2026-08-01-modelo-de-entitlement-premium.md).
  Nada disso muda a v1.3.
  Na mesma data, três contagens de caracteres da fonte foram recontadas e
  corrigidas, e ficou registrado que a descrição longa precisa ser **convertida de
  Markdown para texto limpo** antes de colar no console.
- **E3 [P0]** Privacy labels (App Store Connect) e Data safety (Play) — 
  derivados de D2; declarar Sentry (crash data) e o que mais a allowlist
  permitir.
- **E4 [P0]** Classificação etária/questionários de conteúdo nas duas
  consoles; categoria (Educação ou Medicina — recomendação: Educação, evita
  escrutínio de app médico). **Apple concluída em 2026-08-05; IARC/Play ainda
  separado.** O runbook antigo
  combinava "referências médicas: sim" com resultado `4+`, o que diverge da
  taxonomia Apple vigente. A Apple atribui `13+` global / `A12` no Brasil a
  informação médica ou de tratamento infrequente e `16+` / `A16` quando
  frequente. Anderson atestou **Pouco frequente** e confirmou deter os direitos
  necessários sobre o conteúdo de terceiros. O App Store Connect persistiu as
  duas declarações e calculou `13+` em 172 países ou regiões e `12+` no Brasil e
  na Coreia do Sul. Apple e IARC/Play permanecem contratos separados.
- **E5 [P1]** ~~Página de suporte + e-mail de contato~~ **CONCLUÍDA em
  2026-07-29**: no ar em `https://saudediagnostica.com/radiant/suporte/`
  (HTTP 200, verificado de fora), com contato `anderson.smelo94@gmail.com`.
  Resta colar a URL nos consoles. Ver A4 e L2.8.
- **E6 [~~P2~~ → P0] — CONCLUÍDA em 2026-07-29.** As 6 tasks do
  [plano do ícone](../superpowers/plans/2026-07-29-icone-do-app.md) foram
  entregues: gerador determinístico, oito derivados, `app.json` alinhado, assets
  de loja fechados e evidência em device (3 de 4 provas —
  [`2026-07-29-icone-marca-pixel.md`](../../radiant-app/docs/evidence/2026-07-29-icone-marca-pixel.md)).
  Contrato de assets em **11/11** àquela data — **14/14** desde 2026-07-30 —,
  dentro do `npm run quality`. O enquadramento
  foi resolvido a favor da spec (62% da largura), com o gerador derivando a altura
  do aspecto real. **Ressalva aberta:** a prova do *themed icon* do Android 13+
  precisa de aparelho real — uma captura da gaveta com o tema ligado basta.

  ~~Ícone e assets finais
  revisados~~ → **Ícone e assets finais refeitos.** A revisão preparatória da
  ficha do Play encontrou **três defeitos reais**, não ajustes cosméticos:
  1. A **grade de construção do design está embutida na arte** de `icon.png`
     **e** de `android-icon-background.png`. Como `app.json` não declara
     `ios.icon`, `icon.png` é o ícone da App Store e da tela inicial do iPhone.
     Armadilha registrada: inspecionar só a camada *foreground* (que está limpa)
     leva à conclusão errada de que o Android está ok — o adaptive icon é a
     **composição** das duas camadas, e a de fundo tinha o mesmo defeito.
  2. `splash-icon.png` **não é a marca**: é um placeholder de alvo em blueprint,
     exibido a 200 px sobre fundo **branco** em todo cold start, contra a
     [ADR de identidade galaxy dark](../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md).
  3. O **"A" em chevron é da Ascend Creative**, não do Radiant.

  **Decisão aprovada pelo dono (2026-07-29):** o mascote **Pixel** vira a marca —
  corpo inteiro sobre gradiente galaxy elevado (`#0D1230` centro → `#07091c`
  borda), com o rosto simplificado como forma reduzida na camada monocromática.
  Spec em
  [`2026-07-29-icone-do-app-design.md`](../superpowers/specs/2026-07-29-icone-do-app-design.md),
  execução em
  [`2026-07-29-icone-do-app.md`](../superpowers/plans/2026-07-29-icone-do-app.md)
  (6 tasks; 1 e 2 concluídas). E6 deixou de ser P2 porque **bloqueia E1/L2.7**:
  os assets de loja saem da mesma arte-mestra.

### Onda F — Beta, submissão e lançamento (M4 → M5)

- **F1 [P0 — EM ANDAMENTO; `1.3.1 (5)` NO TESTFLIGHT; FICHA iOS PERSISTIDA;
  SMOKE FÍSICO PASS; VOICEOVER PARCIAL]** Build `production` iOS via EAS →
  TestFlight (revisão beta da Apple); distribuir aos testadores.

  > **Desfecho da submissão, medido em 2026-08-04.** A submissão
  > `5218f0ac-dbc7-4fb6-895c-b70404a47ec3` fechou em `FINISHED`, `error: null`,
  > **~2h12 depois de disparada** — quase toda em `IN_QUEUE`, contra 6 minutos
  > de compilação e 8 segundos de fila de build. Quem for planejar uma
  > submissão: a espera cara está aqui, não no build.
  >
  > **Processamento Apple observado às 14:30 BRT de 2026-08-04.** O App Store
  > Connect mostrou a versão `1.3.1`, compilação `5`, como **Pronta para envio**,
  > com expiração em 90 dias e já vinculada ao grupo `Radiant Internal`.
  > É leitura da interface autenticada do App Store Connect — observada pelo
  > dono e reconfirmada nesta sessão —, não da API; reverificar exige abrir o
  > console novamente.
  > Cancelar ou redisparar foi descartado porque duplicaria uma entrega que já
  > concluiu corretamente. A F1 avançou pela submissão e pelo processamento;
  > naquele momento continuavam pendentes o smoke dos links no iPhone físico
  > pelo roteiro novo (cenário 5), a sessão de VoiceOver da B4 e a reconciliação
  > da metadata e das declarações da ficha.
  >
  > **Ficha parcialmente reconciliada às 15:40 BRT.** Versão pública `1.3.1`,
  > build `5`, URL de suporte, categoria Educação e liberação manual foram
  > persistidas. Os seis screenshots 6,5" também persistiram após recarga na
  > ordem `home -> lição -> quiz -> checkpoint -> conquista -> progresso`, com
  > reutilização declarada pelo console nos demais tamanhos/idiomas selecionados.
  > Continuam vazios subtítulo, texto promocional, descrição, keywords e
  > copyright. A fonte de copy ainda pede aprovação do dono; o bloco do revisor
  > voltou após recarga a login obrigatório marcado e notas vazias, com os quatro
  > campos de contato também vazios. Direitos de conteúdo e classificação etária
  > seguem sem configuração. O pré-voo encontrou zero iPhones com túnel CoreDevice
  > ativo, então smoke e VoiceOver continuam não executados.
  >
  > **Copy aprovada e persistida em 2026-08-05.** O dono aprovou
  > `Radiant — Radiologia`, o subtítulo opção 1 e a descrição curta Google Play
  > opção 1; a fonte foi reconciliada. Na ficha iOS, subtítulo, texto promocional,
  > descrição longa em texto limpo e keywords persistiram após recarga, sem mudar
  > a ordem dos seis screenshots. A descrição curta do Play está aprovada, mas
  > não foi declarada como preenchida no console. Continuam abertos copyright,
  > contato/notas da revisão, direitos de conteúdo e classificação etária. A
  > declaração de direitos foi aberta apenas para leitura e nenhuma opção foi
  > selecionada. O pré-voo repetido nesta data ainda encontrou zero iPhones com
  > túnel CoreDevice ativo.
  >
  > **Declarações, copyright e contato persistidos em 2026-08-05.** O dono
  > confirmou conteúdo de terceiros com os direitos necessários e classificou
  > informação médica/de tratamento como **Pouco frequente**; os demais itens
  > ficaram em `Nenhum`/`Não`. O console calculou `13+` em 172 países ou regiões
  > e `12+` no Brasil e na Coreia do Sul, sem substituição manual. Copyright e os
  > quatro campos de contato do revisor sobreviveram à recarga; os valores de
  > contato não foram copiados para este documento. `Início de sessão obrigatório`
  > foi desmarcado, coerente com o app sem conta. O botão **Adicionar para revisão**
  > ficou disponível, mas não foi acionado. Naquele momento restavam na F1 as
  > evidências em iPhone físico: smoke dos links e VoiceOver.
  >
  > **Smoke físico concluído em 2026-08-05; VoiceOver parcial.** Anderson leu
  > `1.3.1 (5)` no binário e os sete cenários funcionais passaram: primeira
  > abertura, barra de status, laço de estudo, relaunch totalmente offline,
  > links legais, ausência de prompt precoce e conquista bloqueada sem coleta.
  > O roteiro estava errado ao exigir `REVISÕES > 0` no mesmo dia: o contador
  > mostra cards vencidos, e o primeiro só vence após o intervalo inicial do
  > SM-2. `REVISÕES 0` não é regressão e não autoriza patch.
  >
  > No VoiceOver, nomes/posição/função das abas e o estado `escurecido` do reset
  > foram ouvidos uma vez. Como nenhuma dica foi transcrita e nenhum controle
  > realmente ocupado foi ativado, B4 — e portanto F1 — continua aberta por
  > evidência incompleta, não por falha do app. Relatório:
  > [`2026-08-05-testflight-1.3.1-build-5-iphone.md`](../../radiant-app/docs/evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md).
  > **Adicionar para revisão** continua reservado para F4 e não foi acionado.
  >
  > **Ferramenta:** `eas submission:list` **não existe**, em versão nenhuma do
  > `eas-cli` — quem tentar verificar por ali vai ler um "command not found"
  > como se fosse estado. O caminho que funciona é
  > `BuildQuery.withSubmissionsByIdAsync` do próprio `eas-cli`.

  > **Medido em 2026-08-04, e reordena o que falta.** A build no TestFlight é a
  > `1.3.0 (4)` (EAS `f8d1d949`, iniciada em 2026-08-01 18:04). Desde ela são
  > **54 commits, 35 de código**, e ela **precede a apresentação de primeiro uso
  > inteira** (`aaa88da` em diante, 2026-08-02 14:31), a correção da barra de
  > status (`b62f529`), a integridade da conquista (`130d8ea`) e o
  > `useAppOpenLifecycle` (`f499714`). Gastar a sessão humana de VoiceOver nela
  > mediria justamente a versão **sem** a tela onde o último defeito real de
  > VoiceOver apareceu. Nova build enfileirada nesta data:
  > `46bd86fd-7600-4b98-b60a-119658866279`.
  >
  > **O contador iOS está em 4, não em 6.** Os `(5)` e `(6)` citados no estado de
  > builds são **AABs Android**: o EAS mantém um contador por plataforma. A
  > próxima iOS sai `1.3.1 (5)`; a próxima Android, `(7)`.
  >
  > **Os documentos que esta task mandaria executar estavam vencidos desde
  > 2026-04-09** (`847a12d`) e foram reconciliados nesta data. O roteiro de smoke
  > mandava fazer login, inspecionar fila de sync, ligar um "perfil da jornada
  > V2" e completar até o nó de reward — quatro passos impossíveis no binário —,
  > e as notas para o revisor declaravam à App Review duas capacidades ausentes.
  > O `scripts/qa/docs-contract.mjs` passou a governar os quatro documentos de
  > `radiant-app/docs/release/`, derivando as capacidades do `eas.json` e do
  > `app.json`. **Por que sobreviveu quatro meses:** o contrato governava só os
  > cinco documentos de estado — ele aprovava o que media. O upload saiu de processamento, o build 4
  ficou **Pronta para envio** e foi ligado automaticamente ao grupo interno
  `Radiant Internal`, observado com 1 tester e 1 build. O pré-requisito dos
  links legais também está concluído: cartão interno testado na aba Progresso e
  destinos públicos remedidos em HTTP 200. **Instalação física confirmada em
  2026-08-01:** depois da instalação pelo TestFlight, o CoreDevice confirmou o
  bundle esperado, versão `1.3.0`, build `4`, e lançou o app com sucesso. **Restam**
  smoke dos links no iPhone físico, sessão humana de VoiceOver e reconciliação da
  metadata e das declarações da ficha. O Maestro não anexou ao aparelho físico.
  **Atualização de 2026-08-05:** metadata e smoke fecharam; F1 permanece aberta
  somente pela parte não amostrada do VoiceOver descrita acima.
- **F2 [P0] — RELEASE LIVE; 14 TESTADORES VINCULADOS; 2 OPT-INS OBSERVADOS;
  14 DIAS PENDENTES (2026-08-03).** Build
  `production` Android `1.3.0 (4)` publicado no track fechado `alpha`, que está
  `Ativo`. A lista `Radiant Alpha — 31/07/2026` foi substituída a partir da fonte
  completa e permanece selecionada no track. Em 2026-08-03, o Console confirmou
  14 contas vinculadas e o painel mostrou 2 testadores participando no momento.
  Nenhum dado pessoal foi persistido no repositório. **Com A6 fechada, faltam
  pelo menos 10 opt-ins para F2 atingir o piso:** a task só fecha quando houver
  ≥12 adesões efetivas e a contagem completar 14 dias consecutivos (conta
  pessoal).
- **F3 [P0]** Ciclo de triagem de feedback beta: P0/P1 corrigidos e novo build
  se necessário (cada novo ciclo de closed test não reinicia os 14 dias, mas
  quedas abaixo de 12 testadores sim — monitorar diariamente).
- **F4 [P0]** Solicitar acesso a produção no Play (questionário) e submeter
  revisão final na App Store (App Review; primeira revisão típica de 24–48h,
  planejar retrabalho).
- **F5 [P0]** Lançamento: rollout faseado no Play (10% → 50% → 100%);
  liberação manual no iOS após aprovação.
- **F6 [P1]** Pós-lançamento (2 primeiras semanas): monitorar Sentry
  crash-free ≥ 99%, reviews das lojas, funil de onboarding; hotfix por OTA
  (Expo Updates) apenas para JS compatível com `runtimeVersion`, senão novo
  build.
  **Pré-requisito descoberto em 2026-07-31:** não existe organização nem projeto
  Sentry configurado. O plugin Gradle tentava subir source maps em todo build de
  release e **derrubava o build** (`error: An organization ID or slug is required`),
  porque `app.json`, `sentry.properties` e `eas.json` não traziam
  `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN`. O upload foi **desligado** com
  `SENTRY_DISABLE_AUTO_UPLOAD: "true"` para destravar o lançamento — o Sentry já
  estava desligado em runtime (`ENABLE_CRASH_REPORTING` default `false`). Para o F6
  acontecer de verdade, alguém precisa criar a organização e o projeto no Sentry e
  guardar o auth token como segredo do EAS. Sem isso, "monitorar crash-free" não tem
  onde acontecer. Detalhe em [`EAS_SUBMIT_SETUP.md`](../store/EAS_SUBMIT_SETUP.md).
- **F7 [P2]** Retrospectiva + atualizar status canônico e brain (aprendizados
  validados de lançamento).

### Onda G — Sistema educacional por competências (em execução)

Esta onda é a continuação de produto aprovada em 2026-07-31. Ela não altera o
estado do closed test atual e não autoriza publicar novo binário. Spec:
[`2026-07-31-sistema-aprendizagem-competencias-design.md`](../superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md);
execução:
[`2026-07-31-sistema-aprendizagem-competencias.md`](../superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md).

- **G0 [CONCLUÍDA — planejamento]** Público, primeira trilha, duração, métrica,
  revisão por lote, direitos, arquitetura, domínio e gates aprovados pelo dono.
- **G1 [P0 — EM ANDAMENTO]** Governar fontes e mídia. Tasks 1 e 2 concluídas:
  raízes autorizadas, 36 PDFs únicos classificados (4 `authorized`, 15
  `reference-only`, 17 `blocked`). A infraestrutura da Task 3 está concluída,
  mas o lote segue `awaiting-authorized-assets`, com 0 imagens aprovadas e 5
  candidatas rejeitadas. O grafo das 30 competências (Task 4) não começou; G1
  fecha somente após mídia autorizada e currículo validados.
- **G2 [P0]** Construir o motor de atividades v2 preservando as 18 atividades
  legadas; registrar evidência e domínio por competência.
- **G3 [P0]** Tornar a Galáxia uma projeção da jornada canônica e remover o
  bloqueio de lições por vidas.
- **G4 [P0]** Entregar o corte vertical da Unidade 1: 5 competências, 10–12
  sessões de 3–5 minutos, quatro interações e checkpoint revisado.
- **G5 [P0]** Rodar beta pedagógico com checkpoint, revisão posterior,
  acessibilidade e P0/P1 zerados antes de expandir.
- **G6 [P1]** Produzir unidades 2–6 em lotes, com no máximo um novo tipo de jogo
  por unidade e promoção condicionada a revisão.

## 7. Recursos necessários

**Contas e serviços (custo direto):**

- Apple Developer Program — US$ 99/ano.
- Google Play Console — US$ 25 (única vez). Conta organização: + CNPJ ativo e
  número D-U-N-S (gratuito, mas com latência).
- Hospedagem da política de privacidade (pode ser página estática no domínio
  já existente).
- Sentry (plano free cobre o beta) — já integrado via `@sentry/react-native`.
- EAS Build/Submit — plano free tem fila/limites; avaliar plano pago
  (~US$ 19/mês) se a cadência de builds do beta apertar.

**Hardware/ambiente:**

- Mac com Xcode 26 (obrigatório para SDK iOS 26 se buildar localmente; EAS
  Build cobre isso na nuvem).
- 1 iPhone físico (já usado no E2E) + 1 device Android físico para C4.
- Emulador Android + JDK para C1–C3.

**Pessoas:**

- Anderson: decisões A1/E4, sessão VoiceOver (B4), aprovação de copy de loja.
- 12–14 testadores beta (Play) + 5–8 participantes de pesquisa (Task 12),
  com sobreposição possível.
- 1 revisor de domínio (radiologia) para o gate editorial D4 e o checklist
  clínico da Task 12.

## 8. Riscos e mitigações

| Risco | Prob. | Mitigação |
| --- | --- | --- |
| Closed test do Play atrasar M5 (testadores insuficientes/queda abaixo de 12) | Alta | A1 decidida já; A6 recruta 14+; monitorar opt-in diário durante os 14 dias |
| E2E Android exigir mais ciclos que o previsto (primeiro prebuild) | Alta | Janela de 2 semanas em C; seletores por accessibility label já estáveis no iOS |
| Rejeição na App Review (metadados/privacidade/disclaimer médico) | Média | E2–E4 revisados contra as guidelines; categoria Educação; disclaimer explícito; sem login obrigatório |
| ~~`ENABLE_REMOTE_SYNC=true` em produção com API 502 gerar UX quebrada~~ | Descartado | Premissa errada: sem `API_BASE_URL` em nenhum perfil, o sync já era inerte. O risco real era de configuração desonesta, corrigido em D1 |
| Evidência de E2E não cobrir o caminho de produção por divergência de feature flag | Confirmado | B0: decidir qual Home lança e reexecutar o E2E no perfil que reflete produção |
| Verificação de conta/D-U-N-S travar M0 | Média | Iniciar na semana 1; caminho pessoal como fallback aceitando o custo do closed test |
| Runtime version/OTA mal configurados após primeiro build | Média | D5 congela política antes de F1/F2; nunca alterar `runtimeVersion` sem novo build |
| Pesquisa (Task 12) achar P0/P1 tarde | Média | D6 começa junto do beta, não depois; gate de M5 inclui P0/P1 de pesquisa |
| Escopo iPad (`supportsTablet: true`) ampliar QA e screenshots | Baixa | Decidir em E1; desligar tablet no v1.3 é aceitável |

## 9. Fontes da pesquisa (2026-07-27)

- [Target API level — Play Console Help](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- [Meet Google Play's target API level requirement — Android Developers](https://developer.android.com/google/play/requirements/target-sdk)
- [Google Play closed testing: 12 testers / 14 days (guia 2026)](https://primetestlab.com/blog/google-play-publishing-requirements-2026)
- [React Native 0.81 — Android 16 (API 36) por padrão](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
- [Expo SDK 54 — changelog](https://expo.dev/changelog/sdk-54)
- [EAS Submit — Android](https://docs.expo.dev/submit/android/) e
  [introdução](https://docs.expo.dev/submit/introduction/)
- [Guia de revisão App Store 2026 (SDK iOS 26 a partir de 28/04/2026)](https://capgo.app/blog/first-time-app-review-guide/)
- [Exclusão de conta — guidelines Apple](https://capgo.app/blog/account-deletion-compliance-apple-guidelines/)

Regras de loja mudam com frequência; revalidar §4 nas datas de M0 e M4.

## 10. Como executar

1. Ondas A (contas) e B (qualidade) começam em paralelo — A não depende de
   código.
2. Cada task de engenharia segue o fluxo padrão do repo: branch a partir de
   `codex/wave1-hardening-api-smoke` (ou `main` após merge), TDD onde couber,
   `npm run quality` verde, evidência em `radiant-app/docs/evidence/` ou
   `docs/evidence/`.
3. Atualizar o status canônico (`docs/EXECUTION_STATUS_*.md`) a cada marco
   fechado; este roadmap não substitui o status.
4. Para as Tasks 12, 15 e 16 detalhadas, usar os blocos correspondentes do
   [roadmap de continuação](2026-07-23-radiant-continuation-roadmap.md).
