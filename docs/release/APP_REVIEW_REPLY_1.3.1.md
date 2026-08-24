# Resposta à App Review — `1.3.1 (7)`

**Estado medido em 2026-08-24, no App Store Connect.** A versão iOS `1.3.1` está
**Rejeitada**, com o envio em **"Problemas não resolvidos"**. Isto não é um
defeito funcional: é `Guideline 2.1 - Information Needed - New App Submission`.
A Apple não conseguiu avaliar o app e pede informação.

| | |
| --- | --- |
| Envio | 8 de ago. de 2026, 12:06 — por Anderson Melo |
| Mensagem da Apple | 14 de ago. de 2026, 02:54 |
| Status do item | Rejeitado — `2.1.0 Performance: App Completeness` |
| ID do envio | `93758050-6a5b-42d5-957c-575224b14fbb` |

A mensagem ficou **dez dias sem leitura**. O `STATUS.md` e o checklist afirmavam
"Aguardando revisão" desde 2026-08-09; os dois foram corrigidos junto com este
arquivo.

## 🟢 Decisão de 2026-08-24 — responder com um build novo, não com o `(7)`

**O binário que a Apple tem não é o app que existe hoje.** O `(7)` saiu de
`5b2c89e`, de 8/8 às 09:28, e **138 commits** o separam de `main`.

Dois fatos mediram a decisão:

- **O `(7)` carrega o template do Expo.** `src/app/modal.tsx` existe naquele
  build com o texto literal `This is a modal` / `Go to home screen` — inglês, num
  app inteiramente em português. O código da rejeição é `2.1.0 Performance:
  **App Completeness**`, a diretriz que trata de conteúdo de placeholder. A
  mensagem da Apple não cita essa tela, então **não é causa provada** — mas é
  passivo certo se o mesmo binário voltar para revisão. Removida em 2026-08-24,
  ou seja: corrigida só em `main`.
- **A cadeia da Galáxia não estava quebrada no `(7)`.** Os 16 `lessonId` daquele
  build resolvem todos contra o catálogo da época. O nó órfão que autorizou a
  remoção da Galáxia apareceu depois. Um susto a menos.

**Por que não gravar o vídeo de hoje contra o `(7)`:** o revisor roda o binário
que está lá. Um vídeo do `main` mostraria abas que não existem naquele build — a
Galáxia removida, Estude virou a trilha, Perfil nasceu. Não pareceria
desatualizado; pareceria **outro app**, e isso é material para uma segunda
rejeição em cima da primeira.

### O que isso implica na prática

A versão `1.3.1` está em **Rejeitado**, que é estado **editável**: dá para anexar
outro build e reenviar, **sem cancelar o envio**.

- **A numeração é automática.** `eas.json` tem `appVersionSource: "remote"` e
  `autoIncrement: true` no perfil `production`, então o próximo build sai como
  **`1.3.1 (9)`** sem bump manual — a primeira execução consumiu o `(8)` e a
  segunda, com `--auto-submit`, gerou o `(9)`. O `buildNumber: 3` do `app.json` é ignorado
  neste caminho.
- **A versão continua `1.3.1`** — ela nunca foi publicada, então não há motivo
  para queimar um número.
- `runtimeVersion` segue a política `appVersion`, então o canal `production`
  permanece coerente com `1.3.1`.

### ⚠️ O risco que este caminho carrega, dito por inteiro

**`main` nunca passou por smoke em aparelho físico.** A matriz real-device do
checklist está parada no build `1.3.1 (5)`, e **nenhum passo do gate empacota o
app** — 18 passos verdes são compatíveis com um binário que não abre, o que já
aconteceu neste repositório. A primeira coisa a verificar no aparelho é
literalmente **se o app sobe**.

O lado bom é que tudo converge numa sessão só: **a gravação do vídeo é o smoke
físico**. Um aparelho, uma passagem, e resolve o item 1 da Apple (vídeo), o item
2 (modelo e versão do iOS, que nunca foram anotados) e a lacuna da matriz
real-device do checklist.

---

## ✅ O bloqueio do contrato caiu — aceito em 2026-08-24

O contrato de licença do Apple Developer Program foi aceito pelo titular, e a
verificação foi feita **onde o bloqueio se manifestava**: a faixa desapareceu do
topo da lista de apps do App Store Connect, que agora abre direto no aviso do
DSA. Confirmado por leitura da página em 2026-08-24.

**Restam dois avisos no App Store Connect**, nenhum deles bloqueando o Brasil:

- **Status de comerciante (DSA / União Europeia)** — não informado. Não trava a
  submissão, mas remove o app da App Store na UE. Fica em App Store Connect →
  *Business*.
- **Perguntas novas sobre redes sociais na classificação etária** — a
  classificação em si **está preenchida** (+12 no Brasil, +13 em 172 países,
  global +12 com exceções regionais). O aviso pede revisão das perguntas
  **novas**. O Radiant não tem recurso social — o
  `STUDENT_CHECKPOINT_PRIVACY_CONTRACT` proíbe comparação entre alunos —, então
  as respostas são "não"; mas pergunta nova sem resposta pode barrar envio, e
  isso não dá para confirmar sem abrir o questionário.

**Nota de coerência para o item 7:** a seção *Informações do app* já declara
"Sim, este app tem os direitos necessários para os conteúdos de terceiros". A
declaração existe; o que a Apple pede agora é a **documentação por trás dela**.

---

## As sete perguntas, e o que já está respondido

A Apple pede que a informação vá no campo **Notes** da seção *App Review
Information*. O texto abaixo está em inglês, pronto para colar. O que ainda
depende de medição sua está marcado com **`[VOCÊ]`**.

### 1. Gravação de tela — **`[VOCÊ]`**, do build `(9)`

Exigência textual: aparelho **físico**, sistema mais recente, começando pelo
**lançamento do app**, mostrando o fluxo típico pelas funções principais.

**Grave do `1.3.1 (9)`, nunca do `(7)`** — ver a decisão no topo. O roteiro
abaixo descreve o app de `main`, que é o que o `(9)` contém.

O roteiro é curto, porque o app não tem conta, compra nem conteúdo de usuário:

1. abrir o app a partir da tela inicial do iOS (a gravação precisa começar aqui);
2. primeira execução — o fluxo de boas-vindas do Pixel;
3. aba **Estude**: a trilha contínua, com o nó `PRÓXIMO` visível;
4. tocar o nó atual → lição de 4 passos → escolher a alternativa correta;
5. tela de conclusão com estrelas → voltar à trilha com o progresso atualizado;
6. seguir até um **checkpoint** e a **conquista**;
7. aba **Perfil**: identidade, missões, progresso e, ao fim da rolagem, o cartão
   **Ajuda e informações** (Política de Privacidade e Central de Suporte);
8. encerrar mostrando que **nenhuma tela pediu login, pagamento ou permissão**
   além da notificação.

Nada nos itens que a Apple lista como "inclua se houver" existe neste app:
registro/login/exclusão de conta, conteúdo pago, conteúdo gerado por usuário. O
único prompt de permissão é o de **notificações**.

### 2. Aparelhos e sistemas testados — **`[VOCÊ]`**, no build `(9)`

**Esta é a lacuna real.** O checklist de release registra, na matriz real-device:

> `iPhone físico; modelo/iOS não registrados` — smoke de 7 cenários, relaunch
> offline, links legais e VoiceOver; build `1.3.1 (5)`

Dois problemas, e os dois são seus para resolver:

- **o modelo e a versão do iOS nunca foram anotados** — e é exatamente o que a
  Apple pede;
- **o smoke físico foi no build `1.3.1 (5)`**, e o enviado é o `(7)`.

Anote o modelo e a versão antes de gravar o vídeo do item 1: a mesma sessão
resolve os dois.

### 3. Funções e público-alvo — pronto

> Radiant is an educational app for radiology learning. It is aimed at radiology
> students and practising professionals who want to review imaging concepts in
> short sessions. The app addresses a specific problem: radiology knowledge
> decays without repeated exposure, and traditional study material is not
> structured for short, repeated review. Radiant structures the material as a
> continuous learning track of micro-lessons, each ending in a short assessment,
> with a spaced-repetition scheduler (SM-2) that brings lessons back for review
> at increasing intervals. Progress is shown as a track the learner advances
> along, with discrete gamification (experience points, stages, achievements).
> The app is in Brazilian Portuguese.

### 4. Instruções de acesso e credenciais — pronto

> **No account, login, or credentials are required.** The submitted build is
> fully local-first: all content ships inside the binary and all progress is
> stored on the device. Every feature is reachable from first launch with no
> sign-up and no paywall.
>
> This is enforced at build time, not merely by configuration: the app only
> contacts a backend when `EXPO_PUBLIC_API_BASE_URL` is set, and that variable
> is **not** defined in the `production` build profile, so authentication and
> remote sync are inert in the submitted binary.
>
> To reach the main features: launch the app, complete the short welcome flow,
> and tap the highlighted node on the **Estude** tab. The **Perfil** tab holds
> identity, missions, progress, and the Privacy Policy and Support links at the
> bottom of the scroll.

### 5. Serviços externos — pronto, com uma verificação

> - **No AI service is called at runtime.** Lesson content is generated offline,
>   before the build, by scripts in the repository, and is compiled into the
>   binary as static data. The shipped app performs no inference and no content
>   requests.
> - **No backend, no authentication provider, and no payment processor** are
>   reachable in the submitted build (see item 4).
> - **Crash reporting:** Sentry (`@sentry/react-native`), which initialises only
>   when a DSN is provided at build time.
> - **Notifications:** Apple Push Notification service via `expo-notifications`,
>   used for study reminders. The purpose string shown to the user is
>   `NSUserNotificationUsageDescription`.
> - **Over-the-air updates:** Expo Updates, on the `production` channel.

**`[VERIFICAR]` — risco de segunda rejeição.** As *Apple Privacy Labels* deste
app estão publicadas como **"Dados não coletados"** (checklist, task E2). Se o
DSN do Sentry estiver definido como segredo do EAS, o build **coleta dados de
diagnóstico**, e o rótulo passa a estar errado — o que a Apple verifica e é
motivo próprio de rejeição. Eu não enxergo segredos do EAS. Confira em
`expo.dev` → projeto → *Secrets* se `EXPO_PUBLIC_SENTRY_DSN` existe:

- **se existir:** ou corrija o rótulo para declarar *Crash Data*, ou remova o DSN
  do perfil de produção;
- **se não existir:** o rótulo está correto, e o Sentry está inerte — mas então a
  task de monitorar *crash-free ≥ 99%* do checklist não vai medir nada.

### 6. Diferenças regionais — pronto

> The app behaves identically in every region. It ships a single content
> catalogue in Brazilian Portuguese, with no region-gated features, no
> region-specific content, and no server-side configuration that could vary by
> territory.

### 7. Setor regulado e material de terceiros — **`[VOCÊ]`**

Este é o item que exige julgamento seu, e o mais delicado: radiologia **é** área
regulada, e a pergunta da Apple é se você está autorizado a fornecer o serviço ou
o material protegido.

O enquadramento defensável, e que o app sustenta, é:

> Radiant is an **educational** product. It does not provide diagnosis, does not
> process patient data, does not connect to any clinical system, and is not a
> medical device. It contains no patient images: all imaging material is
> illustrative and authored for teaching.

**`[VOCÊ]` precisa confirmar duas coisas antes de mandar isso:**

- **a origem de cada imagem radiológica no catálogo** — se alguma vier de banco
  de terceiros, a licença precisa acompanhar a resposta;
- **se há afirmação clínica** no texto das lições que possa ser lida como
  orientação diagnóstica.

Não posso responder nenhuma das duas a partir do repositório: a primeira depende
de proveniência que não está versionada, e a segunda é julgamento editorial.

---

## Ordem recomendada — caminho B

1. ~~**Aceitar o contrato de licença atualizado.**~~ ✅ Feito em 2026-08-24.
2. **Gerar o build a partir de `main`.** O `eas` **não está no PATH global**
   desta máquina, mas `eas-cli` é devDependency do projeto — então roda por
   `npx`, de dentro de `radiant-app`. E a máquina está em Node v24 enquanto o
   `.nvmrc` pede **20.20.2**, que é também o que o CI usa:

   ```bash
   nvm use
   cd radiant-app && npx eas whoami          # se "Not logged in": npx eas login
   npx eas build --platform ios --profile production
   ```

   Saiu como `1.3.1 (9)` em 2026-08-24 — o EAS numera sozinho. O primeiro uso pode pedir
   credenciais de assinatura, então é interativo.

3. **Subir para o TestFlight — o build de produção NÃO se instala direto.** O
   perfil `production` do `eas.json` não declara `distribution: internal`, então
   o padrão é `store`: o `.ipa` sai assinado para distribuição na App Store e
   **não pode ser sideloadado**. O aparelho físico só recebe esse binário via
   TestFlight.

   ```bash
   npx eas submit --platform ios --profile production
   ```

   `submit.production.ios.ascAppId` já está configurado (`6797078156`). Dá para
   encadear as duas etapas com `npx eas build --platform ios --profile production
   --auto-submit`.

   **Não troque para o perfil `preview` para instalar mais rápido.** Ele tem
   `ENABLE_DEV_TOOLS=true` e `BETA_GATE=true`: o vídeo mostraria ferramentas de
   desenvolvimento que a Apple não vai ver no binário revisado, que é exatamente
   a incoerência entre vídeo e binário que este caminho existe para evitar.

4. **Instalar pelo TestFlight e verificar primeiro se o app abre.** Este é o
   passo que nenhum gate cobre.
5. **Anotar modelo e versão do iOS** — item 2 da Apple e lacuna do checklist.
6. **Gravar o vídeo** na mesma sessão, seguindo o roteiro do item 1.
7. **Verificar o segredo do Sentry** e reconciliar com as Privacy Labels.
8. **Confirmar proveniência de imagem e linguagem clínica** (item 7).
9. **Anexar o `(9)`** à versão `1.3.1`, que está em Rejeitado e é editável.
10. **Colar os textos dos itens 3, 4, 5 e 6** no campo **Notes** da *App Review
    Information* — a Apple pede explicitamente que fiquem lá para envios futuros.
11. **Reenviar**, respondendo à equipe de revisão com o vídeo anexado.

Os passos 7 e 8 não dependem dos anteriores: dá para adiantá-los enquanto o build
roda.

### Uma verificação que sustenta o item 4

O `.gitignore` de `radiant-app` só traz `.env*.local`, que **não casa com `.env`
puro** — se o `.env` chegasse ao build, a `EXPO_PUBLIC_API_BASE_URL` iria junto e
a resposta "não há login no build enviado" seria falsa. Não chega: o
`.gitignore` da **raiz** traz `.env` na linha 20, e `git check-ignore` confirma
que `radiant-app/.env` é ignorado e não rastreado. Verificado em 2026-08-24.

## O que este documento deliberadamente não faz

Não redige a resposta ao item 7 por você, e não afirma que o app está fora de
regulação. Um app de radiologia que erra esse enquadramento não é rejeitado: é
removido. A frase tem de ser sua.
