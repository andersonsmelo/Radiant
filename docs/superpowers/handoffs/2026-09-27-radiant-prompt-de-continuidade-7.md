# Prompt de continuidade (7) — 2026-09-27

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono, que decide sobre loja, aparelho,
build de distribuição e merge.

**Uma frente por conversa.** Pegue a primeira pendência da §3 que for do agente
e estiver destravada, combine a condição de pronto com o dono antes de abrir
qualquer run e não misture outra frente na mesma conversa.

Este prompt substitui o
[prompt (6)](2026-09-25-radiant-prompt-de-continuidade-6.md). Os itens abertos
dele foram copiados para a §3. **Não execute itens do (6).**

## 0. O que foi concluído de 2026-09-25 a 2026-09-27

Tudo está em `feat/d4-decisoes-de-revisao`, enviado ao remoto e **sem PR**.

| Item | Estado | Onde |
|---|---|---|
| Aquecimento isolado no simulador | ✅ o custo é quase todo um piso por fundo animado; a aba visitada continua montada (~42 % → ~66 %) | [evidência](../../../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md) |
| Merge de #35, #36 e #37 | ✅ `main` em `e992686`, CI verde, feito pelo agente com autorização do dono | [STATUS](../../STATUS.md) |
| ADR do "Gerenciar", Ask to Buy e cancelamento | ✅ | [ADR](../../adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md) |
| ADR da amostra da L1, da D4 e dos planos | ✅ a D4 fechou como superada | [ADR](../../adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md) |
| Folha do "Gerenciar", preço da loja, ordem dos planos | ✅ `4afcd15`, 12 testes vistos vermelhos, gate 151 suítes / 1446 testes | [relatório](2026-09-26-radiant-gerenciar-e-loja-relatorio.md) |
| **No iPhone, build `c4eeeb44`:** folha, cancelamento e troca de plano | ✅ primeira build real do eas-cli 24.8.0 | [evidência](../../../radiant-app/docs/evidence/2026-09-27-storekit-gerenciar-iphone.md) |
| Preço que acompanha a loja, no aparelho | ⚪ não reproduzível: sem a conta de sandbox, os preços ficaram em R$. O dono decidiu não criar testador de outro país | idem |
| **VoiceOver** | ✅ encerrado pelo dono, com três achados (25, 26, 27) | [evidência](../../../radiant-app/docs/evidence/2026-09-27-voiceover-iphone.md) |

**Decidido pelo dono nesse período:**
- **push livre;** PR uma por dia, às 21 h, **só com o ok dele na conversa**;
- o merge, a build de distribuição e o envio à loja são dele;
- **o tempo dele é caro:** conferência no aparelho só quando for realmente
  necessária. Na dúvida, pergunte se vale o custo.

## 1. Meça antes de agir

```bash
git fetch origin --prune && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
git rev-list --count origin/main..origin/feat/d4-decisoes-de-revisao
git ls-remote --heads origin
```

**Esperado em 2026-09-27, às 18:50:**
- nenhuma PR aberta;
- a `origin/main` em `e992686`;
- o `feat/d4-decisoes-de-revisao` 17 commits à frente, contando o commit deste
  prompt;
- no remoto, além desses dois, os branches já mergeados das PRs #35 a #37, que
  não foram apagados. Apagá-los é do dono.

Se a PR do `feat/d4-decisoes-de-revisao` já tiver entrado, parta da `main`:

```bash
git switch --no-track -c <nova> origin/main
```

Se não tiver, continue no próprio `feat/d4-decisoes-de-revisao`.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar qualquer número.
3. `docs/FILA.md`, a seção "Ordem de prioridade".
4. A ADR, o relatório ou a evidência da frente que você pegar.

## 3. Pendências, por prioridade (2026-09-27)

A numeração é a mesma da FILA. Os números que faltam foram cumpridos ou
encerrados, e estão em `docs/archive/FILA_concluidos.md`.

**P1 — o que segura a 1.4**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 5 | **Ask to Buy no StoreKit Testing do Xcode**, no simulador | agente | **Destravado.** Primeiro, conferir que o módulo Swift funciona ali; detalhe na §4.1 |
| 25 | **Anunciar a perda de vida ao leitor de tela** | agente | **Destravado.** Pequeno; o agente recomenda fazer antes do bump; detalhe na §4.2 |

**P2 — relógio longo**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 6 | F2: faltam 7 testadores aceitarem; os 14 dias só começam com 12 | dono | Caminho crítico do Android; não bloqueia a 1.4 no iOS |

**P3 — o piloto da L1, que destrava o V3**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 7a | Corrigir as variantes da amostra: o item 18 duplicado e o decúbito dorsal visto por trás | agente | **Destravado**; detalhe na §4.3 |
| 7b | Confirmar os itens alterados | dono | Depois do 7a |

**P4 — agente, destravado**

| # | Tarefa | Estado |
|---|---|---|
| 12 | Conserto do aquecimento: parar o fundo animado fora de foco e medir de novo | FILA, achado 5 do StoreKit |
| 13 | XP da aprovação do checkpoint: a tela mostrou "XP total" igual a antes | Conferir se o checkpoint devia dar XP |
| 16 | O caminho 3 do E2E afirma o estado da L1 | A #36 entrou; detalhe na §4.2 do [prompt (5)](2026-09-25-radiant-prompt-de-continuidade-5.md) |

**P5 — esperando outra coisa**

| # | Tarefa | Dono | Depende de |
|---|---|---|---|
| 14 | Aquecimento no aparelho | dono, com o agente | Do 12 |
| 15 | Gravar `L1_TEMPLATE_APPROVAL` | agente | Do 7b |
| 20 | **Bump para `1.4.0`** | agente | **Por último:** do 5 e, se o dono concordar, do 25. Regra 8 da [ADR de produtos](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md) |

**Decisões do dono, sem prazo:** 26, a animação visual da perda de vida; e 27,
o rótulo da revisão não devida, que hoje aparece como "Bloqueado".

**Depois da 1.4:** 21, o SDK 58 com `UIScene`, até abril de 2027; 22, a L2 v7;
23, o simulador `A5FA5443`; 24, as ações de um passo do dono.

**Qual frente pegar agora:** o **5**. Se ele travar num bloqueio de ambiente,
diga isso ao dono e pegue o **25**.

## 4. Frentes em detalhe

### 4.1. Ask to Buy no StoreKit Testing (item 5)

- **O que se confere:** o pedido pendente, um pedido aprovado e um recusado,
  dentro das 24 h do aviso. O comportamento já está implementado e testado na
  suíte ([ADR de 2026-09-23](../../adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md),
  item 5).
- **Primeiro passo, que não foi medido:** saber se o StoreKit Testing funciona
  com o módulo `radiant-storekit`.
  - A configuração `.storekit` só vale quando o app é lançado pelo Xcode, com a
    configuração no esquema. Lançado pelo `simctl`, não vale.
  - A pasta `radiant-app/ios/` é gerada e ignorada pelo git.
  - Um arquivo `.storekit` versionado precisa estar dentro de
    `writePolicy.allowedRoots`, por exemplo em `radiant-app/modules/radiant-storekit/`.
    Confira antes de declarar.
- **Se não funcionar,** o item volta ao dono, pelo grupo familiar no sandbox,
  como a ADR prevê.
- A mesma configuração também permitiria abrir a folha do "Gerenciar" no
  simulador. Isso já não é necessário, porque ela foi vista no iPhone.

### 4.2. Anunciar a perda de vida (item 25)

- **Hoje:**
  - `LessonFlowScreen.tsx:240-242` anuncia só
    `Resposta incorreta. <explicação>`;
  - a vida é debitada logo acima (`heartsRepository.spend`), e o checkpoint
    usa o mesmo fluxo.
- **O conserto:**
  - incluir a vida no anúncio quando ela for debitada, por exemplo "Você perdeu
    uma vida; restam 4.";
  - assinante (∞) não perde vida, então não deve ouvir isso;
  - com as vidas esgotadas, a folha de vidas já aparece. Confira o que é
    anunciado nesse caso.
- Teste vermelho antes, pelo defeito específico.
- Nenhuma conferência no aparelho é necessária: o anúncio se verifica no Jest,
  pela chamada a `AccessibilityInfo.announceForAccessibility`.

### 4.3. Variantes da amostra da L1 (item 7a)

- **Decisão do dono** ([ADR](../../adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md),
  item 1):
  - o `h10-lat-ventral-v` sai como posição anatômica de frente, igual ao
    `h01`, e tem de cair numa vista do decúbito ventral;
  - `h05-v`, `h09-v` e `h11-v` usam o decúbito dorsal visto de baixo da mesa, e
    têm de usar vistas reais.
- **Onde:** a regra que gera as variantes está em
  `radiant-app/src/features/curriculum-v3/hybrid-l1/`, e a amostra no
  snapshot `l1TemplateApproval.test.ts.snap`. Não foi lida nesta sessão.
- **Cuidados:**
  - a guarda da duplicata tem de ser vista falhando pelo defeito;
  - as guardas de geometria e de lateralidade têm de continuar verdes;
  - mostre ao dono **só os itens que mudaram**, e não os 20.

## 5. Regras que valem sempre

- **O Loop é o contrato:**
  - `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" "${files[@]}"`, com a
    lista em array no zsh, e confira no `state.json` quantos arquivos foram
    declarados;
  - feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope.
- **O STATUS e a FILA têm regra própria:**
  - todo run que edita o STATUS declara também `docs/archive/STATUS_historico.md`
    e move para lá, sem edição, o trecho que deixou de valer;
  - todo run que tira item da FILA declara `docs/archive/FILA_concluidos.md`;
  - nos dois arquivos de arquivo, os links relativos ganham um `../` a mais.
- **Node:**
  - o `loop` roda no 24:
    `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`;
  - testes, builds, Metro e `eas`, no 20;
  - o shell padrão abre no 24. Confira com `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`, com a
  suíte inteira citada. Última medição: **151 suítes / 1446 testes**, em
  2026-09-26.
- **Toda guarda nova precisa ser vista falhando pelo defeito que nomeia.** Numa
  injeção de defeito:
  - passe ao Jest o arquivo **de teste**, e não o de produção;
  - confira que o teste rodou: "No tests found" não é vermelho.
- **Compilar localmente cabe dentro de um run:**
  - `radiant-app/ios` e `radiant-app/.expo` estão em `context.excludes`, e o
    DerivedData fica no scratchpad;
  - contornos para o Xcode 27: `RUBYOPT=-rlogger`,
    `IPHONEOS_DEPLOYMENT_TARGET=15.1`, `SENTRY_DISABLE_AUTO_UPLOAD=true`;
  - simulador com iOS 26.5.
- **Metro:**
  - use `preview_start` com um `.claude/launch.json` temporário. Esse arquivo
    **não** está excluído do guarda: apague-o antes do `validate`;
  - para o iPhone, use as variáveis e a checagem do `scripts/start-ios-v2.sh`,
    mais `npx expo start --dev-client`;
  - confira o `/status` no IP do Wi-Fi do Mac (`ipconfig getifaddr en0`);
  - **se o iPhone não conectar mesmo na mesma rede,** é a permissão de Rede
    Local do Radiant: Ajustes → Privacidade e Segurança → Rede Local.
- **Build `development` no EAS, disparada pelo dono:**
  `npx eas build --profile development --platform ios`, no Node 20.
  - O eas-cli pede login na conta Apple. O provider é
    `ANDERSON MELO (129252270)`, da equipe `6M6L7MMMU6`.
  - Reuse o provisioning profile.
  - Diante de falha, confira o `eas build:list` antes de tentar de novo.
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`), porque o `mcp-remote` da Brevo carrega a chave como argumento. Use
  `pgrep -x <nome>`.
- **Push liberado.** Para PR, merge, build de distribuição ou envio à loja,
  pergunte ao dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize o
STATUS e a FILA na mesma passagem. Separe o medido do inferido, e diga o que
não foi verificado.
