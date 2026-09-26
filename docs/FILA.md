# Fila de trabalho contínuo

Criada em 2026-08-08 porque o custo real não era a dificuldade das tarefas: era
cada sessão gastar o orçamento **se orientando** — relendo status, roadmap e
cérebro para redescobrir o que já estava decidido — em vez de trabalhando.

Este arquivo existe para ser consumido, não lido de ponta a ponta. Um agente
pega o primeiro item `AGENTE` não concluído, executa ponta a ponta, marca, e
para.

**Não é substituto do roadmap.** O roadmap é o registro completo do lançamento;
esta fila é só o que está **executável agora**, ordenado.

**Só entra aqui o que está aberto.** Item concluído, caduco ou que virou só
histórico sai **no mesmo run que o fecha** e vai, sem edição, para o fim de
[`archive/FILA_concluidos.md`](archive/FILA_concluidos.md). Esta fila cresceu até
1.327 linhas porque nada saía; em 2026-09-23 ela voltou a caber numa leitura.
Todo run do Loop que edita esta fila declara também esse arquivo no
`abrir.mjs`: depois de aberto, o escopo não se amplia.

## Política de decisão

O agente **decide por padrão** e executa. Escalam ao dono apenas:

1. dinheiro, contas e consoles — submissão, formulários de loja, chaves;
2. promessa nova ao usuário — destravar galáxia sem conteúdo, ligar nudge que
   hoje está em shadow mode, mudar o que o app diz que entrega;
3. texto que vai para a loja;
4. qualquer ação irreversível.

Executar decisão **já tomada** não escala. Se a dúvida é "o dono aprovaria?",
a resposta padrão é executar e reportar — o run reverte se estiver errado.

## Como cada item é escrito

Todo item declara **estado**, **bloqueio** e **dono** como afirmações separadas,
porque são independentes e têm sistemas de registro diferentes — este projeto já
perdeu dias com item vivo por bloqueio morto. E declara o **comando que o
remede**, porque contagem escrita envelhece e comando não.

---

## Ordem de prioridade, combinada em 2026-09-25

Combinada com o dono em 2026-09-25, às 21:10, e **atualizada às 22:00**,
depois do merge de #35 a #37 e de duas ADRs do mesmo dia:
- a [do "Gerenciar", do Ask to Buy e do cancelamento](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md);
- a [da amostra da L1, da D4 e dos planos](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md).

O critério é o que cada item destrava; no empate, vence o relógio mais longo. A
numeração é a mesma da §3 do
[prompt (6)](superpowers/handoffs/2026-09-25-radiant-prompt-de-continuidade-6.md),
que traz o detalhe de cada linha. **Um agente pega o primeiro item `agente`
destravado**, hoje o **19a**.

**Cumpridos ou encerrados em 2026-09-25,** e movidos para
[`archive/FILA_concluidos.md`](archive/FILA_concluidos.md):
- o 1 (merge) e o 2 (decisão do "Gerenciar");
- o 8, o 9 e o 10 e o 17 e o 18, porque a D4 fechou como superada;
- o 11, porque as decisões do StoreKit foram tomadas.

- **P1 — o que segura a 1.4:**
  - **19a.** agente: a folha de gerenciamento da Apple no "Gerenciar"
    (`showManageSubscriptions`) **e o preço que acompanha a troca de loja**
    (`Storefront.updates`), no mesmo módulo, com teste vermelho antes.
    **Destrava o 4** e pede uma build `development` nova ao dono;
  - **5.** agente: Ask to Buy no StoreKit Testing do Xcode, no simulador.
    Primeiro, conferir que o módulo Swift funciona ali; se não funcionar,
    volta ao dono, pelo grupo familiar no sandbox;
  - **3.** dono: VoiceOver num iPhone físico, que ele decidiu fazer;
  - **4.** dono: cancelamento pela folha, no aparelho, depois do 19a e da build
    nova. Se a folha também fechar no iOS 27.2, passa ao agente, no StoreKit
    Testing.
- **P2 — relógio longo:**
  - **6.** dono: F2, faltam 7 aceites. Os 14 dias só começam com 12.
- **P3 — o piloto da L1, que destrava o V3:**
  - **7a.** agente: corrigir as variantes da amostra, o item 18 duplicado e o
    decúbito dorsal visto por trás, e mostrar ao dono só os itens que mudaram;
  - **7b.** dono: confirmar os itens alterados. Destrava o 15.
- **P4 — agente, destravado:**
  - **19b.** ordem fixa dos planos, com o mensal primeiro. É só JavaScript;
  - **12.** conserto do aquecimento (achado 5 do StoreKit, abaixo);
  - **13.** XP da aprovação do checkpoint;
  - **16.** o caminho 3 do E2E afirma a L1. A #36 entrou.
- **P5 — esperando outra coisa:**
  - **14.** dono, com o agente: aquecimento no aparelho, depois do 12;
  - **15.** agente: gravar `L1_TEMPLATE_APPROVAL`, depois do 7b;
  - **20.** agente: bump para `1.4.0`, **por último**, depois do 3, 4 e 5.
- **Depois da 1.4, ou sem prazo:**
  - **21.** agente: SDK 58 com `UIScene`, até abril de 2027;
  - **22.** agente: L2 v7, depois do teste do piloto;
  - **23.** dono: o simulador `A5FA5443`, apagar ou manter;
  - **24.** dono: as ações de um passo da seção 7, abaixo.

## PRIORIDADE — a 1.4, desenhada em 2026-09-14

**Estado:** spec aprovada pelo dono
([`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md)).
**Bloqueio:** nenhum para planejar e implementar localmente; build, envio e
push ficam com o dono. **Dono:** IA executora, pelo prompt de continuidade
atual em
[`superpowers/handoffs/2026-09-25-radiant-prompt-de-continuidade-6.md`](superpowers/handoffs/2026-09-25-radiant-prompt-de-continuidade-6.md), que traz todas as pendências na ordem abaixo;
o dono lê o relatório no fim.

### AGENTE — depois da 1.4: atualizar o SDK para adotar `UIScene` (prazo: abril de 2027)

**Estado:** decidido pelo dono em 2026-09-24
([ADR](adr/ADR-2026-09-24-ios27-imagem-xcode-26.md)). A 1.4 compila no Xcode
26.0, fixado nos perfis de iOS do `eas.json`. **Bloqueio:** a 1.4 sair
primeiro. **Dono:** agente, com build e E2E autorizados pelo dono.

A partir de abril de 2027, a Apple só aceita envio compilado com o SDK do iOS
27, e nesse SDK o app sem `UIScene` fecha na abertura. O SDK 54 não tem
`UIScene` oficial. O destino preferido é o **SDK 58**, onde o `UIScene` é o
padrão; o 57.0.23+ só o traz como opção (`ios.enableSceneSupport`). A frente
inclui:
- o salto do React Native 0.81 para 0.88, com os módulos Swift próprios, o
  Sentry, o `expo-audio` e o `expo-notifications`;
- o E2E de deep link, notificação, splash e retorno do segundo plano no iOS 26
  e no 27;
- tirar a linha `image` do `eas.json`.

Custo e risco em
[`release/2026-09-24-ios27-decisao-xcode-uiscene.md`](release/2026-09-24-ios27-decisao-xcode-uiscene.md).

**Falta medir antes, sem esperar esta frente:** o primeiro build `development`
da 1.4 (StoreKit) abrindo num iPhone com iOS 27.

### DONO — aberto em 2026-09-23: o que fecha a fatia 2 (StoreKit)

O código está pronto e testado; **nenhum teste da suíte fecha estes itens**.

1. ✅ **Build interno `development`** com `modules/radiant-storekit` —
   **compilado e aberto num iPhone com iOS 27.2 em 2026-09-24**
   (build `ac4b49df`, commit `fd0c630`, imagem do Xcode 26). É a primeira
   compilação real do Swift. A primeira tentativa reprovou no `sentry-cli`,
   e não no Swift, e foi corrigida no `eas.json`, com contrato
   ([evidência](../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)).
2. **Sandbox, parcial em 2026-09-24,** com uma conta de testador do Brasil e
   renovação a cada 5 minutos
   ([evidência](../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)):
   - **medido:**
     - planos e preços da Apple (R$ 19,90 e R$ 149,90);
     - compra mensal, tela e cartão de assinante, e ∞ no HUD;
     - renovação acelerada e expiração sozinha, voltando a 5 vidas;
     - reinstalar o app e reconhecer a assinatura sem Restaurar;
     - **compra anual, em 2026-09-25**: a folha dizia "R$ 149,90 por ano", e
       depois apareceram o ∞ e o cartão de assinante.
   - **falta:**
     - **cancelamento**: os Ajustes do iOS 27.2 (`24B5089g`) fecham ao abrir o
       gerenciamento do sandbox. **Decidido em 2026-09-25** ([ADR](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)):
       testar pela folha da Apple dentro do app, depois do item 19a; se ela
       também fechar, passa ao StoreKit Testing do Xcode;
     - tocar em **Restaurar compras**, que importa para quem troca de
       aparelho.
   - **reembolso:** o app não tem a entrada `beginRefundRequest`, que é a
     única forma de pedir reembolso no sandbox. **Decidido pelo dono em
     2026-09-25: o reembolso sai do roteiro no aparelho**, e o app não ganha
     o botão. A perda de acesso depois de um reembolso passa a ser testada pelo
     StoreKit Testing do Xcode
     ([ADR](adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md)).
   - **modo avião:** saiu do roteiro por decisão do dono em 2026-09-24
     ([ADR](adr/ADR-2026-09-24-storekit-roteiro-no-aparelho.md)).
4. ✅ **Ask to Buy pendente: decidido e implementado em 2026-09-23**
   ([ADR](adr/ADR-2026-09-23-decisoes-l2-l1-kill-switches.md), item 5). Planos e
   Restaurar ficam sempre visíveis; o aviso de pedido pendente dura **24 h**,
   o prazo oficial da Apple, e some sozinho; o cartão do Perfil nunca fica sem
   botão. Falta só o que o aparelho mede: ver no sandbox um pedido recusado e
   um aprovado dentro das 24 h. **Decidido em 2026-09-25** ([ADR](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)): sai
   do aparelho e passa ao **agente, no StoreKit Testing do Xcode**, no
   simulador (item 5 da ordem de prioridade). Se o módulo Swift não funcionar
   ali, volta ao dono, pelo grupo familiar no sandbox (App Store Connect →
   Sandbox → Compartilhamento Familiar).
5. **VoiceOver no aparelho, no mesmo build** (decidido em 2026-09-24,
   [ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md)): percorrer
   com o leitor de tela uma avaliação do checkpoint (alternativas, envio,
   reforço, aprovação) e o HUD da trilha com vidas em recarga. Saiu da H4 porque
   o simulador não roda VoiceOver; a árvore medida está na
   [evidência da H4](../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md).

### AGENTE — achados do StoreKit no aparelho (2026-09-24)

Nenhum bloqueia a 1.4. Os detalhes estão na
[evidência](../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md).
Cada conserto é um run, com teste vermelho antes.

1. ✅ **Estado de renovação desconhecido aparecia como "Cancelada"** —
   corrigido em 2026-09-25, na PR #37 (`fix/renovacao-desconhecida`), **na `main`
   desde a mesma data** (merge `e992686`), e sem build, pela opção 2A da
   [ADR](adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md)
   ([relatório](superpowers/handoffs/2026-09-25-radiant-renovacao-desconhecida-relatorio.md)).
   - **O estado:** `willRenew` passou a ser `boolean | null`. O adaptador e a
     releitura do armazenamento preservam o desconhecido, inclusive quando o
     Swift omite a chave.
   - **O que o aluno vê:** "Ativa · acesso até DD/MM/AAAA" no cartão e
     "Ativa — acesso até …" na tela, nunca "Cancelada".
   - **Testes:** 5 novos, todos vistos vermelhos.
   - **Não visto na tela,** porque o sandbox não produz a renovação
     desconhecida sob comando.
2. **Preço de outra loja até o app recarregar** (medido) — **decidido em
   2026-09-25: consertar com `Storefront.updates`, junto com o 19a**
   ([ADR](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 4):
   - os preços carregados antes do login ficaram em dólar, enquanto a Apple
     cobrava em reais;
   - o módulo não observa a troca de loja (`Storefront.updates`);
   - afeta só quem troca a conta da App Store com o app aberto.
3. **"Gerenciar" não gerencia** — **decidido em 2026-09-25: opção A, a folha
   da Apple dentro do app** ([ADR](adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)). É o item 19a da ordem de
   prioridade, acima. O texto abaixo é o achado original: o botão do
   cartão do Perfil abre a tela interna, que só manda o aluno aos Ajustes. A
   alternativa é a folha da Apple dentro do app, `showManageSubscriptions`.
   **Medido em 2026-09-24:** quem já assina **não consegue trocar de plano**
   dentro do app, porque a tela de assinante não mostra os planos. A troca
   pela Apple passa pelos Ajustes, que fecham no iOS 27.2. A mesma folha
   resolveria a troca e o cancelamento.
4. **A ordem dos planos muda de um dia para o outro** — **decidido em
   2026-09-25: o mensal primeiro, numa ordem fixa com teste (19b)**
   ([ADR](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 3). Medido em 2026-09-24 e
   2026-09-25): num dia o mensal veio primeiro, e no outro, o anual. O app não
   ordena a lista e usa a ordem em que `Product.products(for:)` devolve os
   produtos, que a Apple não garante (`RadiantStoreKitModule.swift:65`). O
   conserto candidato é uma ordem fixa no adaptador, com teste. A ordem certa
   é decisão do dono.
5. **Aquecimento com a build `development`** (relatado; medido só de forma
   indireta em 2026-09-25):
   - **no simulador, com a trilha parada:** ~94 % de um núcleo com as
     animações e **0,4 %** com Reduzir Movimento. Voltou a ~95 % ao desligar de
     novo. Na trilha, só o `StarfieldBackground` tem animação infinita que
     obedece a essa preferência
     ([medição](../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md));
   - **isolado no simulador em 2026-09-25, às 18:06** (segunda passagem da
     [medição](../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md)):
     - uma estrela só já custa 28 %; as 120 estrelas custam 39 %, e as 3
       nebulosas, 30 %. O custo é quase todo um **piso por fundo animado**, e
       não o número de estrelas;
     - **a aba visitada continua montada e animando.** O log mostrou o
       segundo fundo montar e nenhum desmontar, e a CPU foi de ~42 % para
       ~66 % depois de passar pelo Perfil;
     - a primeira passagem deu ~94 % e esta ~42 %, na mesma tela. Compare só
       dentro da mesma passagem;
   - **falta, com o dono:** o aparelho, fora do carregador, 5 minutos com e
     sem Reduzir Movimento, idealmente numa build `preview`, anotando por
     quais abas e telas passou antes;
   - **AGENTE, conserto (aberto em 2026-09-25):** parar a animação do fundo
     quando a tela sai de foco e medir de novo, M1 e M4, na mesma passagem.
     Candidatos: `freezeOnBlur` nas abas, que não alcança as abas cobertas
     por uma tela empilhada, ou o `StarfieldBackground` pausar com
     `useIsFocused`, que alcançaria as duas situações (inferido; as telas
     empilhadas não foram medidas). Um run, com teste vermelho antes. Ficou
     fora da medição por decisão do dono.
6. ✅ **eas-cli atualizado em 2026-09-25**, de 16.32 para **24.8.0**, no
   branch `feat/d4-decisoes-de-revisao`. Em 2026-09-24 ele tinha impresso
   "Build request failed" com a build já criada no EAS.
   - **A trava:** `cli.version` no `eas.json` passou a `>= 24.8.0`. Conferido:
     o 16.32.0 é recusado com saída 1.
   - **Conferido com o 24.8.0:** o `eas config` do perfil `production` lê o
     `eas.json` e as variáveis do EAS sem erro.
   - **O lock também moveu cinco pacotes que não são só de desenvolvimento,**
     por deduplicação e dentro das faixas declaradas:
     `@babel/helper-validator-identifier` 7.28.5 → 7.29.7, `tar`, `tinyglobby`,
     `picomatch` e `node-forge`.
   - **Das mudanças incompatíveis de 16 a 24,** só uma encosta no uso daqui: o
     `--json` de `eas build:list` e `build:view` troca `project`, `channel` e
     `runtimeVersion` por `app`, `updateChannel` e `runtime`. Nenhum script do
     repositório lê esse formato.
   - **Ainda não verificado numa build real.** Para o próximo que disparar uma:
     confira o `eas build:list` antes de tentar de novo.

### AGENTE — o que sobrou da Task 8

**Um por run.** Ordem por dependência, não pela ordem em que foram escritas:

4. ✅ **E2E dos três caminhos dourados** — **escritos, no contrato e rodados em
   2026-09-24** no simulador iOS 26.5, build Debug local sobre `ab121ad`
   ([evidência](../radiant-app/docs/evidence/2026-09-24-e2e-caminhos-dourados-1-4.md),
   [relatório](superpowers/handoffs/2026-09-24-radiant-e2e-caminhos-dourados-relatorio.md)).
   **Os três caminhos estão `passed` no iOS 26.5 desde 2026-09-25.** O dia 2
   do caminho 2 rodou às 13:20 de 2026-09-25, com relógio real, no simulador
   `E3C547AE`, sem `clearState` desde o dia 1, e com o JS da `main` `c9062da`.
   Terminou com exit 0. Android não foi executado. Rodar o dia 2 de novo exige
   repetir o `radiant-1-4-primeira-execucao.yaml` e esperar 24 h. Não validar
   durante um flow E2E: a desaceleração medida é de 2,3×.

   **Defeitos do app que o E2E expôs (2026-09-24)** — um run cada, com teste
   vermelho antes:
   - ✅ **Lição concluída volta como "Continuar de onde parou"** — corrigido
     em 2026-09-25, na PR #36 (`fix/defeito-1-licao-concluida`), **na `main` desde a
     mesma data** (merge `cab01c0`), sem build, pela opção A da
     [ADR](adr/ADR-2026-09-25-defeito-1-reembolso-e-renovacao-desconhecida.md)
     ([relatório](superpowers/handoffs/2026-09-25-radiant-defeito-1-relatorio.md)).
     - **Na leitura:** um nó concluído e sem pendência
       (`isSettledCompletion`) vence o retomável e o atual, no status, na
       recomendação e na unidade em foco. Uma revisão devida de novo não está
       assentada e continua retomável.
     - **Na escrita:** `setResumableNode` não grava a retomada de um nó
       assentado, e com isso não apaga a de outra lição em andamento.
     - **Testes:** 7 novos, cada um visto vermelho pelo defeito que nomeia.
     - **Na tela:** o caminho 3 e um flow avulso no simulador `E3C547AE`
       mostraram `Concluído`, o cabeçalho em "1 de N" e nenhum "Continuar de
       onde parou".
     - **Pendente:** o `radiant-1-4-vidas-esgotadas.yaml` pode passar a
       afirmar o estado da L1. Hoje ele não afirma de propósito, por causa
       deste defeito. Fica para um run próprio.
   - ✅ **"Próxima revisão em 2 dias" para revisão a 24 h** — corrigido em
     2026-09-24, no branch `fix/e2e-defeitos-2-e-3`, que está na `main` desde 2026-09-25 (PR #34), sem build: a contagem
     parte do carimbo do cartão quando esta resposta o carimbou
     (`lesson-flow/services/nextReviewInDays.ts`). Teste visto vermelho pelo
     defeito (esperado 1, recebido 2). Conferido na tela em 2026-09-24, num
     segundo simulador, durante o gate H4: "Próxima revisão em 1 dia"
     ([evidência](../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md)).
   - ✅ **Resumo de vidas cortado na trilha** — corrigido em 2026-09-24, no
     branch `fix/e2e-defeitos-2-e-3`, que está na `main` desde 2026-09-25 (PR #34), sem build: o resumo vai sob os corações,
     não ao lado (`HUD.tsx`, `heartsControlContent` em coluna). Teste visto
     vermelho pelo defeito (esperado `column`, recebido `row`). Conferido na
     tela em 2026-09-24, num segundo simulador, durante o gate H4: o botão de
     vidas vai de x 206 a 382 em 402 pt ([evidência](../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md)). **Vale até o
     AX1; no AX5 o HUD volta a sair da tela** (achado 2 da H4, abaixo).

   ✅ **Achado da fatia 3 (item 3): o `HUD` mostrava ∞ ao lado dos
   corações** — corrigido em **2026-09-23**, **sem build**, na `main` pelo
   PR #18 (`8972cbc`); originalmente no branch
   `fix/hud-infinito` (sobre `0b0283e`)
   ([relatório](superpowers/handoffs/2026-09-23-radiant-hud-infinito-relatorio.md),
   [vermelhos](superpowers/handoffs/2026-09-23-radiant-hud-infinito-vermelhos.md)).
   No estado `unlimited` o cabeçalho mostra só o ∞, rotulado "Vidas
   ilimitadas" com ou sem botão — Checkpoint e Revisão, que não têm botão,
   anunciavam "5 de 5 vidas" ao assinante. Gate `quality` exit 0, **133
   suítes / 1189 testes**, Node `v20.20.2`. **Falta:** olhar o ∞ num aparelho
   com assinante real, que espera o sandbox.
6. **Bump para `1.4.0`** — por último, quando as outras fecharem. Regra 8 da
   ADR: os produtos de assinatura não sobem sozinhos, viajam com a versão.

Não faz build, envio nem push sem autorização datada.

---

## AGENTE — conteúdo e pipeline

### DONO — Piloto da lição híbrida na L1: revisar a amostra (implementado em 2026-09-23)

**Estado:** implementado localmente em 2026-09-23, **sem build de
distribuição**, na `main` desde 2026-09-23 (PR #24), pelo
[plano](superpowers/plans/2026-09-23-licao-hibrida-piloto.md). Gate e desvios no
[relatório](superpowers/handoffs/2026-09-23-radiant-licao-hibrida-relatorio.md);
execuções vermelhas das guardas nos
[vermelhos](superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md).
Só existe na rota `/licao-hibrida`, atrás de `SHOW_DEV_TOOLS`; o V3 segue
desligado. **Visto rodando no simulador em 2026-09-23** (iPhone 17, iOS 26.5):
quatro defeitos de tela corrigidos no mesmo dia — retorno fora da tela, números
espelhados na vista de costas, marcadores fora do desenho e textos técnicos
demais. **O boneco do mapa é ilustração de piloto** (decisão do dono em
2026-09-24): desenho esquemático feito em código, aceito para o piloto e o
teste com pessoas; antes de a lição chegar ao aluno, precisa de arte
definitiva, com as posições em `LANDMARK_POSITIONS` reajustadas e as guardas de
geometria verdes. **Revisado e validado no Loop pela sessão local em 2026-09-23:**
gate no Mac com exit 0 (147 suítes / 1345 testes), e um defeito corrigido — a
descrição acessível aparecia no botão e entregava a resposta. Detalhe na seção
"Revisão local" do relatório, que também traz três perguntas para a aprovação. **Bloqueio:** aprovação dos modelos pelo dono. **Dono:** dono, depois
a sessão local.

Pendente, nesta ordem:

1. **Dono:** revisar a amostra
   `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`
   — 20 itens, com o gabarito marcado. Aprovando, o agente grava a impressão
   digital em `l1TemplateApproval.ts`, e a tela deixa de mostrar "Prévia".
   **Decidido em 2026-09-25, às 21:40** ([ADR](adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 1): o item 18 e
   as variantes do decúbito dorsal visto por trás são corrigidos antes; a
   aprovação vale para a amostra corrigida, depois que o dono confirmar os
   itens alterados (7a e 7b da ordem de prioridade). As descrições do tórax
   ficam, e o leitor de tela que entrega parte da resposta é aceito no piloto,
   com pendência antes de chegar ao aluno. O texto abaixo é o registro de
   antes da decisão. **Ainda sem decisão em 2026-09-25, até as 21:40.** O dono pulou o item na sessão na
   nuvem. A leitura do snapshot na nuvem achou um ponto para levar à
   aprovação: o **item 18** (`h10-lat-ventral-v`) é idêntico ao **item 1**
   (`h01`), com a mesma postura, a mesma pergunta, as mesmas opções e o mesmo
   gabarito, embora o nome diga "ventral". A sessão local não reconferiu isso
   ([relatório](superpowers/handoffs/2026-09-25-radiant-relatorio-sessao-nuvem.md),
   §2.3).
2. **Dono, quando quiser ver:** recompilar o cliente de desenvolvimento, por
   causa do `expo-audio` (módulo nativo novo). Nesta máquina (Xcode 27) o
   `npx expo run:ios` trava; o caminho que funcionou em 2026-09-23 está na seção
   "Risco de build" do [STATUS](STATUS.md): `xcodebuild` com os contornos, num
   simulador com **iOS 26.5**, porque no iOS 27 o app fecha na abertura.
3. **Dono, quando decidir:** build de teste e teste com 3 a 5 pessoas, pelo
   critério da §5.4 da
   [spec](superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md).

**Substitui a v7 da L2 como próximo item de conteúdo.**

### AGENTE — J3: produzir o Arco 1 — corrigir a L2, que reprovou em v6

> ⏸️ **v7 pausada em 2026-09-23** pela
> [ADR da lição híbrida](adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md),
> item 6, até o resultado do piloto acima. Se o formato híbrido passar, a L2 é
> refeita com modelos de exercício; o roteiro da v7 abaixo fica como registro.

**Estado:** em andamento; L1 e L2 entregues localmente e versionadas em
2026-09-16. **Bloqueio:** a **L2 reprovou nas seis revisões** — v1 a v6, a
última em 2026-09-22; publicação continua dependendo de J4/J5.
**Dono:** agente, com subagente auditor independente por pacote.

> **Esta seção afirmou "pendente de produção, começar pela L1" até 2026-09-16,
> com L1 e L2 já prontas em disco e não commitadas.** O `STATUS.md` e o roadmap
> haviam sido atualizados; esta fila não — e ela é o arquivo que manda o agente
> pegar o primeiro item. Quem obedecesse ao texto antigo refaria a L1. É a
> mesma falha de 2026-08-25, registrada mais abaixo nesta fila: **atualizar o
> estado sem atualizar a fila deixa o documento acionável mentindo.**

**L1 — O corpo como referência:** entregue, com auditoria independente
**aprovada no parecer v4**. **L2 — Cortando o espaço:** entregue, 4 suítes da
lição verdes, e **reprovada no parecer v3** em 2026-09-22
([registro](content/2026-09-22-l2-parecer-v3.md)). Nenhuma das duas está ligada a
startup, rota, catálogo ou manifesto, e `prepareV3()` não é chamado.

> ⚠️ **Não use a suíte verde como sinal de pronto nesta lição.** Os 22 testes
> passam e não detectam nenhum dos 18 achados do parecer v3: nenhuma asserção
> toca as geometrias candidatas, três incidem sobre um espelho das props
> embarcado no componente só para os testes, e o mock do hook de Reduce Motion
> esconde uma violação real. Mesma classe de falha de 2026-09-08.

> ✅ **Os seis críticos foram corrigidos em 2026-09-22 e o parecer v4 confirmou
> os seis resolvidos no código.** O v4 reprovou por dois críticos **novos**
> (N1, N2), ambos consequência da correção do C4, mais o N4 — guardas que não
> observavam o componente. Os três foram corrigidos na mesma data e a **revisão
> v5 está pendente**. Registro em
> [`2026-09-22-l2-parecer-v4.md`](content/2026-09-22-l2-parecer-v4.md).

~~Obter o parecer v6~~ — **concluído em 2026-09-22: reprovado**
([registro](content/2026-09-22-l2-parecer-v6.md)). O P1 do v5 está resolvido no
quadro; o crítico novo, **Q1**, foi criado pela correção dele: os candidatos
ligados a nível são desenhados **uma banda abaixo** da região que o enunciado
nomeia, porque `candidatePathFor` supõe base no tórax e três dos quatro já estão
no abdome. Mais quatro importantes (Q2–Q5) e o N4 regredido no candidato.

**Próximo item executável: a v7, nesta ordem — e não em outra.**

1. **Escrever primeiro a guarda única de validade semântica** proposta no
   registro do v6: para **todo** item, a resposta correta tem `d` não vazio,
   bounding box dentro da banda da região que o enunciado nomeia e dentro do
   tronco, nenhum `transform` em ancestral além do grupo declarado, e não
   coincide com o outro candidato. Rodá-la **contra `949a5f0` sem mexer em
   nada** e **registrar a execução vermelha em arquivo versionado**: ela tem que
   falhar com o Q1. Se passar, a guarda está errada, não o código.
2. Só então corrigir **Q1 e Q2** (e o `index` morto), enumerando antes e depois
   os oito pares candidato × região — a mudança na conta do delta mexe em todo
   cenário, inclusive nos de tórax, que hoje não se movem.
3. Na mesma passagem, **Q3** (restaurar a asserção sobre a `matrix` e cobrir o
   caminho vazio) e **Q4** (a frase depende de o próximo item ser novo para o
   objetivo, com guarda sobre a **tela**, não sobre a função).
4. Obter o parecer v7 com o mesmo brief do v6: descrição do autor como hipótese,
   e as mutações reaplicadas pelo revisor.

> 🔴 **Pare e leia antes de abrir o próximo run desta lição.** São **três
> passagens seguidas** em que a correção produziu o achado seguinte, e em que a
> guarda escrita junto com a correção foi cega justamente a ele. Antes de
> corrigir qualquer achado aqui, responda por escrito: **que regra ou invariante
> passa a ser encontrada por uma população que não a encontrava antes?** Foi a
> pergunta não feita que gerou N1, N2 e P1.
>
> E toda guarda nova precisa afirmar **validade**, não só diferença. A guarda que
> autorizou o P1 exigia que duas matrizes diferissem — o que uma translação para
> fora do quadro satisfaz com folga.

Q5 (congruência do N5 de volta em 4 itens) e Q6 (desenho da recuperação igual
ao do inicial) **não** entram na v7: Q5 é da mesma família de P2/N5 e Q6 é
decisão editorial junto do P4. Quando um parecer aprovar, os importantes e
menores ainda abertos (P2–P9, N3, N5, Q5, Q6, I1, I3, I4, I5.3, N7–N10, M4–M6)
entram num run próprio, e só então a P1 do currículo.

📌 **Aprovação do parecer não é autorização de publicação.** J4 e J5 continuam
pendentes, mais a revisão técnica especializada da §8/§12.3.

⚠️ **Item novo para o dono, achado pelo v4 fora do escopo da L2:** a **L1, já
aprovada**, carrega o defeito exato do C6 — rótulo preso à identidade da
alternativa renderizado ao lado do número por posição. A correção da L2 não foi
propagada, e quem decorar o rótulo acerta a recuperação da L1 sem ler o mapa.

### AGENTE — Gate operacional H4: checkpoint, reforço, retomada e acessibilidade

✅ **Estado (2026-09-24): fechado**, conforme a
[ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md). Os defeitos 1
e 2 foram corrigidos e reconferidos no simulador no mesmo dia (seção
"Reconferência" da evidência). Na `main`, o fechamento só vale depois do merge
do branch `fix/e2e-defeitos-2-e-3`. **Primeira passagem:** a engenharia
está na `main` desde o PR #3 (2026-08-13). O gate foi percorrido num segundo
iPhone 17 (iOS 26.5), com o progresso das trilhas anteriores pré-montado por
decisão do dono ([evidência](../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md)):

- **Aprovação e reforço:** medidos. A tentativa com 1 de 2 certas abre o reforço
  do ciclo 1; depois dele, 2 de 2 aprova ("Conquista desbloqueada").
- **Retomada sem persistir respostas:** medida no modo `off` (o de produção).
  Nenhuma resposta fica no armazenamento, e a avaliação recomeça do zero. O
  kernel de retomada no ponto (`active`) não foi exercitado.
- **Texto grande:** reprovado na primeira passagem (achado 2) e corrigido; a
  reconferência passou em AX5, AX1 e no padrão.
- **Leitor de tela:** árvore de acessibilidade medida. O VoiceOver real
  **não** foi exercitado, porque o simulador não o roda.

`UnitCheckpointService` calcula tentativa imutável, plano e intent: aprovação com
pelo menos 80% e zero erro crítico, reforço somente de competências frágeis e
desbloqueio independente de XP. O runtime ativo encaminha o intent pelo
`CheckpointCoordinator` ao commit recuperável, sem segunda transação na tela.
Conteúdo `legacy` e `competency:legacy:*` falham fechado.

`ProductionBatchV1` promove as 12 atividades v2, checkpoint 2×5/80% e reforços
sob hash material, seis decisões independentes e publicação atômica com lock
exclusivo. O player e a jornada consomem o lote nativo; a primeira atividade já
passou no smoke local.

`support-required` só ocorre depois de tentativa inicial reprovada, ciclo 1,
nova tentativa reprovada, ciclo 2 e terceira tentativa ainda não aprovada.

**Defeitos abertos pela H4, um run cada, com teste vermelho antes:**
1. ✅ **O texto do checkpoint prometia a avaliação antiga** — corrigido em
   2026-09-24, no branch `fix/e2e-defeitos-2-e-3`, que está na `main` desde 2026-09-25 (PR #34), sem build. O texto sai dos
   itens e do limiar reais (`checkpoint/checkpointRuleCopy.ts`, com a mesma
   conta de `UnitCheckpointService`): "Responda as 2 questões. Para avançar,
   acerte todas." e "A aprovação exige 2 acertos." Teste de tela visto vermelho
   pelo defeito: a árvore mostrava "Responda 10 questões" e "exige 8 acertos".
2. ✅ **Tamanhos de acessibilidade quebravam a trilha e o checkpoint** —
   corrigido em 2026-09-24, no branch `fix/e2e-defeitos-2-e-3`, que está na `main` desde 2026-09-25 (PR #34), sem build.
   Acima de `fontScale` 1,3 (`ui/accessibility/useLargeTextLayout.ts`):
   - a trilha vira uma coluna, com a linha à esquerda e os cartões a 85%, sem
     limite de linhas;
   - o título do estágio fica com a contagem embaixo e sem corte;
   - o balão do Pixel vai para baixo do personagem;
   - o botão tem altura mínima, e não fixa;
   - os textos do HUD param no XXXL (1,35), porque são cromo.

   Sete testes vistos vermelhos pelo defeito.

   **Segunda parte, achada ao conferir no AX5:**
   - o título fixo acima da trilha tomava a tela, e o CTA ia para baixo da
     barra de abas. Agora, com texto grande, o cabeçalho rola dentro da
     trilha (`ListHeaderComponent`);
   - o título do estágio e o rótulo de botão crescem até 2×
     (`LABEL_MAX_FONT_SCALE`).

   Quatro testes vistos vermelhos. **Conferido no simulador em 2026-09-24**
   no AX5, no AX1 e no padrão:
   - o HUD fica em x 206–382;
   - o CTA fica acima das abas;
   - o checkpoint mostra o balão sob o Pixel e o "Iniciar checkpoint"
     alcançável.

   **Resíduo:** no AX4/AX5, uma palavra mais larga que o cartão ainda se
   parte ("Fundame / ntos"), como no texto nativo do iOS.

3. ✅ **Pergunta cobrada duas vezes na mesma tentativa** — corrigido em
   2026-09-24, no branch `fix/e2e-defeitos-2-e-3`, que está na `main` desde 2026-09-25 (PR #34), sem build, depois do ok do
   dono na ADR dado na própria conversa. O `Set` em memória da tela virou
   `checkpoint/checkpointChargeLedger.ts`:
   - grava, por nó de checkpoint, só os ids das perguntas já cobradas, na chave
     `@radiant:checkpoint_charged_items_v1`, e nunca a alternativa;
   - a reserva é gravada antes da cobrança;
   - a lista se apaga quando o envio é registrado, com aprovação ou
     reprovação.

   Três testes de tela vistos vermelhos pelo defeito: 2 cobranças em vez de 1
   ao remontar; 2 em vez de 3 depois de reprovar; e a lista ainda gravada
   depois de aprovar. Na entrega não foi conferido no simulador, por decisão
   do dono sobre a condição de pronto
   ([relatório](superpowers/handoffs/2026-09-24-radiant-vida-por-tentativa-relatorio.md)).
   **Conferido no simulador em 2026-09-25**, nos cinco cenários, pela tela e
   pelo AsyncStorage
   ([evidência](../radiant-app/docs/evidence/2026-09-25-regra-de-vidas-simulador.md)).

**Decidido pelo dono em 2026-09-24 ([ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md)):** a H4 fecha
com os defeitos 1 e 2 corrigidos e o checkpoint conferido de novo no simulador.
O defeito 3 é a regra de vidas da mesma ADR. O **VoiceOver num iPhone físico**
sai da H4 e vira item próprio da 1.4, junto com o build `development` no
aparelho.

---

## DONO — nada que o agente faça encurta

### 5. F2 — os opt-ins do closed test. **É o caminho crítico inteiro.**

**Estado:** release `Ativo` no track `alpha`, build `1.3.0 (4)`. **Bloqueio:**
humano. **Dono:** dono.

> **Remedido em 2026-09-25**, por capturas do Play Console, pelo dono na
> sessão na nuvem
> ([relatório](superpowers/handoffs/2026-09-25-radiant-relatorio-sessao-nuvem.md),
> §2.4):
> - **5 participando** e **14 vinculados**, na lista de e-mails "Radiant
>   Alpha" do Teste fechado · Alpha;
> - a track está ativa, com a versão 1.3.0 (4);
> - **os 14 dias não começaram**, inferido da tela;
> - **faltam 7 aceites** para chegar a 12, e mesmo com os 14 vinculados a
>   margem é de só 2.
>
> Na medição anterior, de 2026-08-03, eram 2 participando.
>
> **Este item continua sem comando que o remeça**: depende de abrir o Play
> Console. Onde olhar: **Play Console → Teste → Teste fechado → track `alpha`
> → Testadores**. O que importa é o número de **participando**.

O Play exige **12 testadores participando por 14 dias corridos**. Vincular não
é participar — falta cada pessoa aceitar o convite e instalar, e só quem
participa conta para o relógio.

Na medição de 2026-09-25, o relógio **ainda não começou** (ver o aviso
acima).

**A premissa foi reconferida em 2026-08-08 e o bloqueio é real:** a A1 decidiu
conta Play **pessoal** ([ADR](adr/ADR-2026-07-27-store-account-strategy.md)), e
a exigência 12×14 vale para conta pessoal. Numa conta de organização não
valeria. Não há atalho de engenharia.

Enquanto isso não fecha, **F3**, **F4** e **F5** não podem começar. Só o dono
mede o número atual, no Console.

### 6. E3 e E4/IARC — dois formulários, e o bloqueio de um deles morreu

**Estado:** E3 aberta; E4 com o lado Apple concluído em 2026-08-05 e **IARC/Play
pendente**. **Bloqueio:** *morto*. **Dono:** dono.

A E3 estava registrada como dependente da D1. Medido em 2026-08-08:

```bash
grep -n "EXPO_PUBLIC_API_BASE_URL" radiant-app/eas.json || echo "ausente nos 5 perfis"
```

A variável **não existe em nenhum dos cinco perfis**, então o binário da v1.3 não
alcança API alguma e as labels são "não coleta" sob qualquer desfecho da D1. O
único coletor é o Sentry, que independe dessa decisão. **A E3 pode ser
respondida hoje.**

### 7. Ações de um passo, todas do dono

- **A5** — gerar a service-account key no Play Console e pôr em
  `radiant-app/credentials/`; não bloqueia publicar, o AAB sobe à mão;
- enviar o pedido ao INCA — rascunho pronto, destinatário em branco de propósito;
- apagar `~/.lmstudio` (8,7 GB órfãos) e instalar o Ollama — destrava a Task 3;
- **`checkHeuristics`** — ligar os nudges ou manter shadow mode. A decisão ficou
  decidível em 2026-08-07, quando a H3 parou de medir o próprio lançamento.

---

## Precisa de aparelho ou janela de host

**B5 Android**, **C4** (flows em device físico), **C5** (TalkBack no Android),
**C6** (baseline de performance). **Não valide nem gere durante um flow E2E** —
2,3× de desaceleração medida no emulador, e o flow morre em timeout que parece
defeito do app.

## Decidido e não implantado

**D1** — opção B assinada em 2026-08-07, catálogo remoto. Nada implantado, o
domínio segue em 502. Endpoint morto degrada para o conteúdo da última release,
porque o fallback já existe em `RemoteCatalogService`. Não está no caminho
crítico da F2 nem da submissão.
