# Design — Primeiro uso (Pixel + tutorial) e o elo de conta da v1.4

**Data:** 2026-08-02
**Aprovado por:** Anderson (proprietário do projeto), nesta sessão
**Escopo desta sessão:** a Parte 1 é para implementar; a Parte 2 é especificação
sem código, a executar quando a cadeia da v1.4 destravar.

---

## Por que este documento existe

O pedido original era um fluxo único: primeira abertura → o mascote se apresenta
→ tutorial breve → tela de login, com cadastro por Google ou Apple. A exploração
do repositório mostrou que esse fluxo atravessa duas frentes com pré-requisitos
diferentes, e que a segunda metade reabre uma decisão já registrada.

| Parte | Depende de | Estado |
| --- | --- | --- |
| Apresentação + tutorial | nada além do app | **implementar agora** |
| Login, cadastro, Google/Apple | API pública de pé | **especificar agora, implementar na v1.4** |

A [`ADR-2026-07-31 — Conta de usuário e assinatura premium`](../../adr/ADR-2026-07-31-conta-e-premium.md)
decidiu que a v1.3 lança sem conta, e a
[`ADR-2026-08-01 — Modelo de entitlement do premium`](../../adr/ADR-2026-08-01-modelo-de-entitlement-premium.md)
fixou a ordem obrigatória da v1.4: **API de pé → conta (login, perfil, exclusão)
→ declarações de loja refeitas → billing**. Medição feita nesta sessão em
2026-08-02: `https://api.radiant.ascendcreative.com.br/` responde **502**. O
primeiro elo da cadeia continua caído, então a Parte 2 não tem como sair do papel
hoje — e isso é a razão da separação, não uma escolha de conveniência.

---

## Estado medido antes do design

Tudo abaixo foi lido no repositório nesta sessão, não herdado de documento.

| Peça | Estado |
| --- | --- |
| Mascote Pixel | `src/ui/characters/` — componentes prontos, usados em Home, Checkpoint, Quiz e Galaxy |
| Assets do Pixel | **um único arquivo** (`pixel_core.png`); os seis estados e três tiers caem todos nele por fallback |
| `AuthService` | completo para e-mail/senha (registro, login, refresh, reset, logout, migração de conta local) |
| API de auth | 7 endpoints, **todos e-mail/senha**; nenhum de provedor social |
| Google/Apple no app | **nenhuma dependência instalada**, nenhum código |
| `OnboardingService` | **não é tutorial de primeiro uso** — é coach de 7 dias (intro → quiz_guided → review_guided → habit_forming → closure) |
| Tela de apresentação, tutorial ou login | **não existem**; o bloco de login mora dentro do `ProgressScreen` |
| Fluxo de abertura hoje | splash → bootstrap → beta gate → Learning Road |
| Card Day-0 na Learning Road | diz "Bem-vindo ao Radiant / Aprenda radiologia com revisões inteligentes e progresso real" |
| Flows Maestro | **quatro**, todos com `clearState: true` (instalação limpa) |

Duas dessas linhas mudaram o design e merecem destaque, porque nenhuma delas
aparece em documento algum do projeto:

1. **O Pixel tem um desenho só.** A camada de tipos enumera seis estados
   emocionais e três tiers, o que sugere dezoito renders disponíveis. O registro
   que resolve a variante devolve o mesmo arquivo para todas as combinações. A
   apresentação não pode se apoiar em expressões diferentes do mascote;
   diferenciação entre telas vem de escala, posição, cópia e movimento.
2. **O card Day-0 já dá as boas-vindas.** É o mesmo trabalho que a apresentação
   nova faz, com quase a mesma frase. Sem tratamento, a pessoa é recebida duas
   vezes seguidas com o mesmo texto.

---

## Decisões tomadas nesta sessão

| # | Decisão | Alternativa descartada e por quê |
| --- | --- | --- |
| 1 | Escopo: client-side agora, conta vira spec | Fazer a cadeia inteira da v1.4 — bloqueada pela API 502 |
| 2 | Critério de sucesso: a pessoa **entende a proposta** | Critério comportamental (chegar à primeira lição) — não foi o escolhido; descarta o formato de tutorial interativo embutido na tela |
| 3 | **Pulável**, com "Pular" discreto em todas as telas | Obrigatória — atrito no primeiro uso é onde o funil de app educacional se perde, ponto que a própria ADR-2026-07-31 registra |
| 4 | Instalações **já existentes veem uma vez** | Só instalação limpa — os testadores do closed test não conseguiriam opinar sobre o próprio onboarding que está sendo validado |
| 5 | Gate no `_layout`, no padrão do `BetaGateScreen` | Rota `src/app/welcome.tsx` — a B6 removeu o wizard `src/app/onboarding/*` justamente por ser **rota inalcançável**; repetir a forma repete o risco. E modal sobre a home, que compromete a decisão 2 |

---

## Parte 1 — Primeiro uso (implementar)

### Arquitetura

Domínio novo em `src/features/first-run/`, **separado** de
`src/features/onboarding/`. São dois problemas com ciclos de vida diferentes:
`first-run` é apresentação (uma vez, na abertura), `onboarding` é formação de
hábito (sete dias). Um serviço que decide as duas coisas passa a ter dois donos.

```
src/features/first-run/
  FirstRunService.ts              estado, persistência, telemetria
  first-run.types.ts
  screens/WelcomeFlowScreen.tsx   apresentação pura, sem rota
  components/WelcomeSlide.tsx     uma tela do carrossel
```

### O gate

`src/app/_layout.tsx` já curto-circuita o `<Stack>` para renderizar o
`BetaGateScreen`. A apresentação entra como o mesmo tipo de curto-circuito, nesta
ordem:

```
loading → error → beta gate → apresentação → <Stack>
```

O beta gate vem antes porque é controle de acesso: não se apresenta o produto a
quem ainda não foi liberado a entrar.

### Estado e gatilho

`FirstRunService.bootstrap()` entra no `Promise.all` que já roda
`AuthService.bootstrap()` e `LessonCatalogService.bootstrap()`.

Chave nova em AsyncStorage: `@radiant/first_run_v1`, guardando
`{ seenAt, exitedAt, exitReason: 'completed' | 'skipped' }`.

**A ausência da chave é o gatilho.** É isso que faz instalações já existentes
verem a apresentação uma única vez (decisão 4) sem nenhum código de migração:
elas simplesmente não têm a chave. Não usar `OnboardingService.startedAt` para
isso — ele já existe nas instalações antigas e as excluiria.

### Saída e reentrada

Concluir e pular escrevem a mesma chave, com `exitReason` diferente. **Os dois
também chamam `OnboardingService.dismissIntro()`**, resolvendo a duplicação do
card Day-0.

`WelcomeFlowScreen` é componente de apresentação puro com `onFinish(reason)`.
Isso dá dois pontos de montagem sem duplicar código:

- **gate** no `_layout` — `onFinish` grava a chave e libera o `<Stack>`;
- **"Rever apresentação"** em Progresso — `onFinish` só fecha o modal, sem tocar
  no estado persistido.

### As três telas

Cada tela faz um trabalho. A cópia repete o posicionamento já travado em
[`textos-loja-pt-BR.md`](../../store/textos-loja-pt-BR.md) — método de estudo
(trilha guiada + revisão espaçada), offline/sem conta como diferencial, categoria
Educação, sem alegações médicas. Quando ficha e app descrevem o mesmo binário com
o mesmo vocabulário, a revisão de loja não encontra divergência para apontar.

**1 — Quem é o Pixel.** Pixel grande, centralizado, `state="guide"`.

> **Oi, eu sou o Pixel.**
> Vou estudar radiologia com você, em sessões curtas e no seu ritmo.

**2 — Como funciona.** Pixel menor ao lado, reusando o `PixelHeroSplit` existente.
É a tela que carrega o critério de sucesso.

> **Trilha, quiz e revisão.**
> Você segue uma trilha guiada, responde quizzes curtos, e o que ainda não fixou
> volta na hora certa para revisar.

**3 — O que esperar.** Fecha com o CTA "Começar".

> **Funciona offline, sem conta.**
> Seu progresso fica no seu aparelho. Comece agora, sem cadastro.
>
> *Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta
> médica profissional.*

O disclaimer não é enfeite: o roadmap de lançamento registra que apps de
saúde/educação precisam dele **no onboarding e nos metadados das lojas**, e hoje
ele não existe em nenhuma tela do app. Esta é a primeira superfície onde ele cabe
sem ser interrupção.

#### Gatilho de reabertura desta cópia

> A frase **"sem conta"** da tela 3 vale **enquanto o app não criar contas**.
> Quando a Parte 2 for implementada, esta cópia se torna falsa e precisa ser
> reescrita no mesmo run que ligar a conta.

Este campo existe por causa da regra de método que a ADR-2026-08-01 fixou: uma
premissa citada em prosa não protege ninguém, porque é lida como justificativa
enquanto a conclusão ganha autoridade pela idade do documento. A condição vira
campo próprio e verificável.

### Forma

Carrossel horizontal, três pontos de progresso, **"Pular"** discreto no topo à
direita em todas as telas, botão primário avançando (`Continuar`, `Continuar`,
`Começar`).

### Acessibilidade

- Cada slide é região anunciada ("tela 2 de 3").
- O Pixel mantém `accessibilityLabel`, como nas telas que já existem.
- **"Pular" é botão real com alvo de toque de 44pt** — discreto no visual, nunca
  no alvo. Visibilidade não é tocabilidade.
- Transição do carrossel e qualquer movimento do mascote respeitam
  `useReducedMotion()`. O projeto tem aprendizado validado de que Reduce Motion
  se verifica por estabilidade de quadros (screenshots consecutivos
  byte-idênticos); uma tela que anima sempre quebraria essa verificação.
- A tela entra na ordem de foco por teclado que o roadmap já exercita.

### Telemetria

Eventos no padrão que o `OnboardingService` já usa:

| Evento | Propriedades |
| --- | --- |
| `first_run_started` | props padrão de loja |
| `first_run_step_viewed` | `step` (1..3) |
| `first_run_skipped` | `step` onde saiu |
| `first_run_completed` | props padrão de loja |

O passo em que a pessoa pula é o dado que mede a cópia: saída majoritária na tela
1 indica problema de apresentação; na tela 3, problema de comprimento.

**Melhoria pontual incluída:** `getAppStoreProps` (locale, market, entry_surface,
build_channel) é privado dentro do `OnboardingService` e é necessário aqui.
Extrair para um helper compartilhado de telemetria, em vez de copiar — a cópia
cria uma segunda lista que precisa concordar com a primeira e não tem dono
declarado.

### Testes (escritos antes da implementação)

**`FirstRunService.test.ts`**
- chave ausente → deve mostrar;
- após concluir → não mostra de novo, com `exitReason: 'completed'`;
- após pular → não mostra de novo, com `exitReason: 'skipped'` e o passo;
- **instalação antiga**: sem a chave nova, mas com estado de onboarding já
  gravado → mostra uma vez (decisão 4);
- falha de leitura do AsyncStorage → não trava a abertura; trata como não vista.

**`WelcomeFlowScreen.flow.test.tsx`**
- renderiza as três telas e avança entre elas;
- "Pular" em cada uma das três chama `onFinish('skipped')` com o passo correto;
- "Começar" na tela 3 chama `onFinish('completed')`;
- o disclaimer educacional está presente na tela 3.

**Integração no `_layout`**
- ordem beta gate → apresentação → `Stack`;
- concluir monta o `Stack`.

**Regressão**
- a Learning Road **não** mostra o card Day-0 para quem acabou de ver a
  apresentação.

### E2E Maestro — trabalho obrigatório

Os quatro flows rodam `clearState: true` e passam a bater no gate. Sem tratamento,
os quatro quebram na primeira asserção.

- Novo subflow `.maestro/subflows/dismiss-first-run.yaml`, incluído no topo dos
  quatro flows existentes.
- Novo flow `first-run.yaml` percorrendo as três telas até o fim.
- **`boot-to-home.yaml` muda de nome e de significado**: ele hoje afirma que
  instalação limpa vai direto para a home, e essa afirmação deixa de ser
  verdadeira sobre o binário.

**Alternativa descartada:** uma flag `EXPO_PUBLIC_SKIP_FIRST_RUN` ligada só no
perfil de teste. Desligar no E2E exatamente o que produção liga produz evidência
que não descreve o binário distribuído — o E2E deixaria de exercitar o caminho
real do primeiro usuário, que é justamente o que está sendo construído.

### Fora do escopo, explicitamente

- `store-capture.yaml` passa a poder capturar a apresentação como screenshot de
  ficha. É decisão de marketing, não de engenharia.
- Assets dedicados por estado/tier do Pixel. O design funciona com o asset único;
  renders dedicados melhoram, não destravam.

---

## Parte 2 — Conta, login e provedores sociais (especificação, sem código)

### Pré-requisitos herdados, em ordem obrigatória

Da ADR-2026-08-01, sem alteração:

1. **API pública de pé** — hoje 502, medido em 2026-08-02.
2. **Conta**: login, perfil, e exclusão de conta dentro do app **mais** URL
   pública de exclusão (exigência do Google Play para qualquer app que crie
   contas), hospedada no mesmo domínio das outras páginas legais.
3. **Refazer três declarações**, que só mudam juntas: Data Safety (Play) e
   Privacy Labels (App Store); a política de privacidade **já publicada**; e o
   questionário de classificação. Hoje as três declaram, de forma coerente e
   verdadeira sobre o binário, que o app não coleta dados.
4. **Billing** nas duas lojas — último elo, fora do escopo deste documento.

### Onde a conta entra no fluxo

**Não como gate de primeiro uso.** O roadmap de lançamento registra "sem login
obrigatório" como mitigação de risco de rejeição na App Review, e a decisão 3
desta sessão (apresentação pulável) existe pela mesma razão de funil. A conta
entra em dois lugares:

- **convite**, depois da apresentação e a qualquer momento em Progresso;
- **gate apenas do que exige servidor**: sincronização entre aparelhos e, quando
  existir, o premium.

O app permanece local-first para quem nunca criar conta.

### Telas

| Tela | Base já existente |
| --- | --- |
| Entrar | `AuthService.login` |
| Criar conta | `AuthService.register` |
| Recuperar senha | `AuthService.requestPasswordReset` / `confirmPasswordReset` |
| Perfil | `AuthService.hydrateUser` |
| Excluir conta | **não existe** — endpoint e tela a construir |

O bloco de login que hoje mora dentro do `ProgressScreen` sai de lá: ele é
condicionado a `isApiConfigured()` e nasceu como andaime de desenvolvimento, não
como fluxo de produto.

### Google e Apple — o que a decisão arrasta

**Dependências ausentes hoje:** `expo-apple-authentication` (iOS) e um cliente
Google (`@react-native-google-signin/google-signin` ou `expo-auth-session`).

**API:** endpoints novos que recebem o identity token do provedor, **verificam a
assinatura contra o JWKS do provedor** e conferem `aud`, `iss`, `exp` e `nonce`
antes de emitir a mesma `AuthSession` que o fluxo de e-mail emite. Confiar no
token sem verificar a assinatura é o modo de falha clássico deste fluxo: qualquer
pessoa pode construir um JSON que diz ser de qualquer usuário.

**Regra da App Store 4.8:** um app que oferece login social de terceiros **precisa
oferecer Sign in with Apple** no iOS. Google sozinho não é opção; se Google entra,
Apple entra junto. Isso não é preferência de produto — é condição de aprovação.

**"Hide My Email" da Apple:** o e-mail chega como endereço-relay, e pode não vir
em logins subsequentes. A identidade tem que ser ancorada no `sub` do provedor,
nunca no e-mail. Usar e-mail como chave de identidade quebra silenciosamente para
esses usuários.

**Vinculação de contas:** a mesma pessoa que criou conta por e-mail e depois entra
por Google precisa cair na mesma conta. A regra de merge (por e-mail verificado, e
o que fazer quando o provedor não devolve e-mail) é decisão a tomar antes do
primeiro usuário social, não depois.

**Migração do progresso local:** `LocalAccountMigrationService` já existe e é
chamado em `finalizeAuthenticatedSession`. O fluxo social precisa passar pelo
**mesmo** ponto, ou quem entra por Google perde o progresso local.

### Decisões ainda em aberto na Parte 2

Registradas para serem tomadas antes do código, não durante:

1. E-mail/senha continua existindo ao lado dos provedores sociais, ou os
   provedores substituem?
2. A conta é opcional para sempre, ou vira obrigatória quando o premium existir?
3. Qual o comportamento para quem já tem progresso local e cria conta em um
   aparelho onde já existe outra conta?

---

## Riscos

| Risco | Mitigação |
| --- | --- |
| Os quatro flows Maestro quebram na entrega | O subflow de dispensa faz parte da mesma entrega, não de trabalho posterior |
| A apresentação aumenta o abandono no primeiro uso | É pulável, e a telemetria por passo mede exatamente isso |
| A cópia "sem conta" envelhece sem sinalizar | Gatilho de reabertura declarado como campo próprio na Parte 1 |
| A Parte 2 ser tratada como aprovada para implementar | Este documento a marca como especificação; a ordem obrigatória da ADR-2026-08-01 continua valendo, e a API segue em 502 |
