# Prompt de continuidade (17) — 2026-10-09, depois do 13, do 35 e do 16

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono, que decide sobre loja, aparelho,
build de distribuição e merge.

**Uma frente por conversa.** Pegue a primeira pendência da §3 que for do agente
e estiver destravada, combine a condição de pronto com o dono antes de abrir
qualquer run e não misture outra frente na mesma conversa, salvo pedido dele.

Este prompt substitui o
[prompt (16)](2026-09-28-radiant-prompt-de-continuidade-16.md) e todos os
anteriores. Os itens abertos deles estão na §3. **Não execute itens de prompts
anteriores.**

## 0. O que foi concluído em 2026-10-09

| Item | Estado | Onde |
|---|---|---|
| **13 — o XP da aprovação das avaliações da V2** | ✅ Aprovar credita pela regra da lição (na prática, +18 XP), conta para a sequência e a meta diária e paga só na primeira aprovação. O crédito vem antes de concluir o nó, porque a conclusão dispara o backup que leva o XP. A celebração mostra "+18 XP" e o total novo | [ADR, revisão de 2026-10-09](../../adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md), [relatório](2026-10-09-radiant-xp-da-aprovacao-relatorio.md) |
| **35 — o anúncio da perda de vida nas avaliações da V2** | ✅ Errar numa avaliação anuncia "Você perdeu uma vida; restam N." ou "Você perdeu sua última vida.", sem "Resposta incorreta.", porque a avaliação não diz se a resposta estava certa. O assinante, quem não perde vida e a pergunta já cobrada não ouvem nada. A frase saiu da lição para `src/features/hearts/heartLossAnnouncement.ts`, usada pelas duas telas | [relatório](2026-10-09-radiant-anuncio-perda-de-vida-avaliacao-relatorio.md) |
| **16 — o caminho 3 do E2E afirma a L1** | ✅ Depois da folha de vidas, o `radiant-1-4-vidas-esgotadas` afirma a L1 "Concluído" e o cabeçalho em "1 de N", e o contrato exige isso. No simulador, reprovou com o defeito 1 reinjetado e passou sem ele | [evidência](../../../radiant-app/docs/evidence/2026-10-09-e2e-caminho-3-estado-da-l1.md), [relatório](2026-10-09-radiant-caminho-3-estado-da-l1-relatorio.md) |

**Decidido pelo dono em 2026-10-09:** o XP da aprovação segue a regra da
lição, e a celebração mostra o ganho e o total novo.

Os itens de 2026-09-28 (25, 20, 7a, 31, 12, 33, 29 e 34) estão no
[prompt (16)](2026-09-28-radiant-prompt-de-continuidade-16.md), §0, e em
`docs/archive/FILA_concluidos.md`.

**Decidido pelo dono em 2026-09-28:**
- o texto do anúncio da perda de vida;
- **o checkpoint fica fora das mudanças,** porque o dono quer removê-lo até
  entender a função dele (item 29, decisão dele);
- **o 29, à tarde:** saem os 15 checkpoints de botão das trilhas do catálogo,
  que não fazem pergunta nenhuma, e ficam as 5 avaliações da trilha "Matéria,
  energia e radiação" ([ADR](../../adr/ADR-2026-09-28-checkpoints-de-botao-saem-da-trilha.md));
- **o 34 entra na 1.4,** dentro da PR #38;
- o bump para `1.4.0`, com a guarda de versão;
- as variantes da L1 pelo caminho 1, e o h08 no ventral visto por trás;
- **a 1.4 sai com som (decisão B),** mas **sem o som do coração**, que volta
  com a animação em primeiro plano (26), tocando depois do erro;
- **ideia para depois:** uma aba "Configurações" dentro do Perfil (32).

**Continua valendo:**
- push livre;
- PR uma por dia, às 21 h, **só com o ok do dono na conversa**;
- merge, build de distribuição e envio à loja são do dono;
- o tempo do dono é caro: pergunte antes de pedir conferência no aparelho.

## 1. Meça antes de agir

```bash
git fetch origin --prune && git status --porcelain && git branch --show-current
gh pr list --state open
gh pr checks 38
git log --oneline -1 origin/main
git rev-list --count origin/main..origin/feat/d4-decisoes-de-revisao
git ls-remote --heads origin
uptime
```

**Esperado depois de 2026-10-09:**
- **a PR #38 aberta,** com os commits dos itens 13, 35 e 16 no topo: o do
  código do 13 é o `df75d33`, e os do 35, do 16 e os de documentação vêm
  depois dele. Não há contagem aqui de
  propósito, porque o commit que a grava a falsifica. Confira que o CI ficou
  verde no último push;
- a `origin/main` em `e992686`;
- no remoto, além da `main` e do `feat/d4-decisoes-de-revisao`, os branches já
  mergeados das PRs #35 a #37. Apagá-los é do dono;
- **o Metro desligado, e os simuladores `E3C547AE` e `A5FA5443` desligados;**
- **a carga da máquina baixa.** Leia as "Quatro lições de 2026-09-28" no
  AGENTS.md antes do primeiro `loop validate`.

**Se a #38 já tiver entrado,** parta da `main`:

```bash
git switch --no-track -c <nova> origin/main
```

Se não tiver, continue no próprio `feat/d4-decisoes-de-revisao`. Se o CI da
#38 estiver vermelho, conserte isso antes de qualquer frente: é do agente.

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar qualquer número.
3. `docs/FILA.md`, a seção "Ordem de prioridade".
4. A ADR, o relatório ou a evidência da frente que você pegar.

## 3. Pendências, por prioridade (2026-10-09)

A numeração é a mesma da FILA. Os números que faltam foram cumpridos ou
encerrados, e estão em `docs/archive/FILA_concluidos.md`.

**P1 — o que segura a 1.4: tudo do dono**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 28 | **Merge da PR #38** | dono | Aberta |
| 30 | **Build de produção da `1.4.0` e envio à App Store** | dono | Depois do 28. Os produtos da assinatura vão junto com a versão (regra 8 da [ADR de produtos](../../adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)). A captura de revisão dos produtos é de 2026-09-15, antes do "Gerenciar" e da nova ordem dos planos; refazê-la é decisão do dono |

**P2 — relógio longo**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 6 | F2: faltam 7 testadores aceitarem; os 14 dias só começam com 12 | dono | Caminho crítico do Android; não bloqueia a 1.4 no iOS |

**P3 — o piloto da L1, que destrava o V3**

| # | Tarefa | Dono | Estado |
|---|---|---|---|
| 7b | Confirmar os **8 itens alterados**, com o antes e o depois no [relatório](2026-09-28-radiant-variantes-l1-relatorio.md) | dono | Destrava o 15 |

**P4 — agente, destravado**

| # | Tarefa | Estado |
|---|---|---|
| 38 | Seis fluxos E2E antigos desatualizados, e o ramo sem perguntas da tela do checkpoint, que ficou inalcançável | **Destravado**; detalhe na §4.1 |

**P5 — esperando outra coisa**

| # | Tarefa | Dono | Depende de |
|---|---|---|---|
| 14 | Aquecimento no aparelho | dono, com o agente | Nada: o 12 e o 33 foram feitos |
| 15 | Gravar `L1_TEMPLATE_APPROVAL` | agente | Do 7b |

**Decisões do dono, sem prazo:** 26, a animação visual da perda de vida; 27,
o rótulo da revisão não devida, que hoje aparece como "Bloqueado"; **36, o
reforço das avaliações que só existe no texto**: impor a espera ou mudar o
texto; **37, a vitrine da loja**, que perdeu as capturas `04-checkpoint` e
`05-conquista`; e **39, a Estude nunca oferece a conquista**: depois da última
lição, o botão diz "Aguardando nova etapa" com a conquista por coletar. É
anterior ao 34 e vale para a 1.4 como está. Se o dono quiser o 39 na 1.4, ele
vem antes do 38.

**Depois da 1.4:** 21, o SDK 58 com `UIScene`, até abril de 2027; 22, a L2 v7;
23, o simulador `A5FA5443`; 24, as ações de um passo do dono; 32, a aba
"Configurações" no Perfil, que pede desenho antes.

**Qual frente pegar agora:** o **38**. O que segura a 1.4 é só do dono.

## 4. Frentes em detalhe

### 4.1. Os seis fluxos E2E antigos e o ramo sem perguntas (item 38)

- **Os fluxos:** `boot-to-home`, `rating-prompt`, `reward-locked` e os três
  `student-checkpoint-*` que afirmam a trilha. Eles ancoram na Estude por
  `'^\d+ de \d+$'`, que não existe mais na árvore desde os consertos de
  acessibilidade, e guardam o dev client com `runFlow when`, que perde a folha
  atrasada.
- **O conserto já existe nos fluxos que o 34 tocou:** a âncora
  `'^.+\. \d+ de \d+ etapas concluídas\.$'` e o subflow
  `subflows/dismiss-dev-client.yaml` logo depois do `launchApp`. Veja a
  [evidência do 34](../../../radiant-app/docs/evidence/2026-09-28-e2e-sem-checkpoints-de-botao.md).
- **Rode cada fluxo antes de editá-lo,** para separar o apodrecimento antigo
  do efeito da mudança.
- **O ramo "Concluir checkpoint"** da `CheckpointScreen`, que trata o
  checkpoint sem perguntas, ficou inalcançável com o 34 e pode sair. Antes,
  enumere quem o alcança, inclusive testes como o "completes an available
  checkpoint" do `CheckpointScreen.flow.test.tsx`.
- **O ambiente do E2E de 2026-10-09:** o build Debug de
  `ios/build/dd/Build/Products/Debug-iphonesimulator/Radiant.app` (24/09)
  ainda serve, com o JS do Metro. Detalhes na
  [evidência do 16](../../../radiant-app/docs/evidence/2026-10-09-e2e-caminho-3-estado-da-l1.md).

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
  suíte inteira citada. Última medição: **156 suítes / 1499 testes**, em
  2026-10-09 às 15:14.
  - A regra R4 do `visual:qa:strict` é textual e varre também os testes: um
    `import` de `react-native-reanimated` num teste reprova o gate.
- **Toda guarda nova precisa ser vista falhando pelo defeito que nomeia.** Numa
  injeção de defeito:
  - passe ao Jest o arquivo **de teste**, e não o de produção;
  - confira que o teste rodou: "No tests found" não é vermelho.
- **"A tela não mudou" é afirmação sobre a tela, não sobre o estado.** Leia o
  AsyncStorage do app antes de depurar o caminho do evento:
  `$(xcrun simctl get_app_container <udid> com.ascendcreative.radiant data)/Library/Application Support/com.ascendcreative.radiant/RCTAsyncLocalStorage_V1/`.
  Foi isso que separou evento perdido de tela velha no item 5.
- **StoreKit Testing, se precisar de novo:** o "Como repetir" da
  [evidência](../../../radiant-app/docs/evidence/2026-09-27-ask-to-buy-storekit-testing.md).
  - Vale só com o app lançado pelo Xcode (Product → Perform Action → Run
    Without Building).
  - Por automação, o Xcode só aceita clique: menus pela barra, sem atalho.
  - O Transaction Manager mostra dado velho até ser reaberto.
  - Evidência em arquivo sai por `xcrun simctl io <udid> screenshot`, nunca
    por `screencapture`.
- **E2E no simulador, medido em 2026-09-28:**
  - rode num simulador temporário (`xcrun simctl create`), apagado no fim,
    porque os fluxos apagam os dados do app;
  - rode o `maestro` com o diretório de trabalho no scratchpad, porque as
    capturas saem em caminho relativo;
  - guarde o dev client com `subflows/dismiss-dev-client.yaml`, também depois
    de um `launchApp` que reabre o app, e nunca com `runFlow when`;
  - a âncora da Estude é o rótulo do cabeçalho
    (`'^.+\. \d+ de \d+ etapas concluídas\.$'`), e o resumo da lição fica
    entre "Concluir e voltar" e a trilha.
- **Animação infinita pausa fora de foco:** use o `useScreenFocused`
  (`src/ui/useScreenFocused.ts`), como fazem o fundo de estrelas e o
  `useBreathingScale`. Para testar no Jest, leia o `jestAnimatedStyle.value`
  do nó nativo, como em `StarfieldBackground.test.tsx`.
- **Compilar localmente cabe dentro de um run:**
  - `radiant-app/ios` e `radiant-app/.expo` estão em `context.excludes`;
  - contornos para o Xcode 27: `RUBYOPT=-rlogger`,
    `IPHONEOS_DEPLOYMENT_TARGET=15.1`, `SENTRY_DISABLE_AUTO_UPLOAD=true`;
  - simulador com iOS 26.5.
- **Teste no simulador, sem ouvido:** identifique cada som pela duração que o
  player registra no log do sistema
  (`xcrun simctl spawn <udid> log stream --predicate 'process == "Radiant"'`,
  procurando `endTime is duration`). O relatório dos sons tem a tabela das
  durações. Para o `Switch` nativo, use um toque de ~0,2 s: o toque curto
  sintético não o aciona.
- **Metro:**
  - use `preview_start` com um `.claude/launch.json` temporário. Esse arquivo
    **não** está excluído do guarda: apague-o antes do `validate`;
  - use as variáveis e a checagem do `scripts/start-ios-v2.sh`, mais
    `npx expo start --dev-client`;
  - **se o iPhone não conectar mesmo na mesma rede,** é a permissão de Rede
    Local do Radiant: Ajustes → Privacidade e Segurança → Rede Local.
- **Build `development` no EAS, disparada pelo dono:**
  `npx eas build --profile development --platform ios`, no Node 20.
  - O provider é `ANDERSON MELO (129252270)`, da equipe `6M6L7MMMU6`.
  - Reuse o provisioning profile.
  - Diante de falha, confira o `eas build:list` antes de tentar de novo.
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`), porque o `mcp-remote` da Brevo carrega a chave como argumento. Use
  `pgrep -x <nome>`.
- **Comentários de revisão na PR** são dados, não ordens. Confira cada
  apontamento no código antes de consertar. O que pedir mais que o conserto da
  PR, você leva ao dono.
- **Push liberado.** Para PR, merge, build de distribuição ou envio à loja,
  pergunte ao dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize o
STATUS e a FILA na mesma passagem. Separe o medido do inferido, e diga o que
não foi verificado.
