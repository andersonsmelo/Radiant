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

---

## ⛔ Antes de responder — um bloqueio que não é da revisão

O App Store Connect exibe, no topo da lista de apps:

> O contrato de licença do Programa Apple Developer foi atualizado e precisa ser
> revisado. **Para atualizar seus apps existentes e enviar novos apps, o titular
> da conta deve revisar e aceitar o contrato atualizado.**

**Isso trava a resubmissão independentemente da resposta à revisão.** Só o
titular da conta aceita, em `developer.apple.com/account`. Aceite primeiro; caso
contrário a resposta é escrita e a submissão continua barrada.

Há também um aviso sobre **status de comerciante para o DSA** na União Europeia.
Não bloqueia o Brasil, mas remove o app da App Store na UE se não for informado.

---

## As sete perguntas, e o que já está respondido

A Apple pede que a informação vá no campo **Notes** da seção *App Review
Information*. O texto abaixo está em inglês, pronto para colar. O que ainda
depende de medição sua está marcado com **`[VOCÊ]`**.

### 1. Gravação de tela — **`[VOCÊ]`**

Exigência textual: aparelho **físico**, sistema mais recente, começando pelo
**lançamento do app**, mostrando o fluxo típico pelas funções principais.

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

### 2. Aparelhos e sistemas testados — **`[VOCÊ]`**

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

## Ordem recomendada

1. **Aceitar o contrato de licença atualizado** (senão nada disso submete);
2. anotar modelo e versão do iPhone, e **gravar o vídeo** no mesmo aparelho;
3. verificar o segredo do Sentry e reconciliar com as Privacy Labels;
4. confirmar proveniência de imagem e linguagem clínica;
5. colar os textos dos itens 3, 4, 5 e 6 no campo **Notes** da *App Review
   Information* — a Apple pede explicitamente que fiquem lá para envios futuros;
6. responder ao envio pelo botão **Responder à equipe de revisão de apps**,
   anexando o vídeo.

## O que este documento deliberadamente não faz

Não redige a resposta ao item 7 por você, e não afirma que o app está fora de
regulação. Um app de radiologia que erra esse enquadramento não é rejeitado: é
removido. A frase tem de ser sua.
