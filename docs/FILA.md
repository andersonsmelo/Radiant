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

## PRIORIDADE — a 1.4, desenhada em 2026-09-14

**Estado:** spec aprovada pelo dono
([`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md)).
**Bloqueio:** nenhum para planejar e implementar localmente; build, envio e
push ficam com o dono. **Dono:** IA executora, pelo prompt de continuidade
atual em
[`superpowers/handoffs/2026-09-24-radiant-prompt-de-continuidade-3.md`](superpowers/handoffs/2026-09-24-radiant-prompt-de-continuidade-3.md), que traz todas as pendências em ordem de criticidade;
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
       gerenciamento do sandbox, então é preciso outro aparelho ou outra versão
       do iOS;
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
   um aprovado dentro das 24 h. **Continua aberto em 2026-09-24:** precisa de
   um grupo familiar no sandbox (App Store Connect → Sandbox →
   Compartilhamento Familiar).
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
   corrigido em 2026-09-25, na PR #37 (`fix/renovacao-desconhecida`), à espera de merge, e
   sem build, pela opção 2A da
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
2. **Preço de outra loja até o app recarregar** (medido):
   - os preços carregados antes do login ficaram em dólar, enquanto a Apple
     cobrava em reais;
   - o módulo não observa a troca de loja (`Storefront.updates`);
   - afeta só quem troca a conta da App Store com o app aberto.
3. **"Gerenciar" não gerencia** (decisão de produto do dono): o botão do
   cartão do Perfil abre a tela interna, que só manda o aluno aos Ajustes. A
   alternativa é a folha da Apple dentro do app, `showManageSubscriptions`.
   **Medido em 2026-09-24:** quem já assina **não consegue trocar de plano**
   dentro do app, porque a tela de assinante não mostra os planos. A troca
   pela Apple passa pelos Ajustes, que fecham no iOS 27.2. A mesma folha
   resolveria a troca e o cancelamento.
4. **A ordem dos planos muda de um dia para o outro** (medido em 2026-09-24 e
   2026-09-25): num dia o mensal veio primeiro, e no outro, o anual. O app não
   ordena a lista e usa a ordem em que `Product.products(for:)` devolve os
   produtos, que a Apple não garante (`RadiantStoreKitModule.swift:65`). O
   conserto candidato é uma ordem fixa no adaptador, com teste. A ordem certa
   é decisão do dono.
5. **Aquecimento com a build `development`** (relatado, não medido):
   - **hipótese:** o `StarfieldBackground` mantém de 90 a 120 animações
     infinitas, e as abas visitadas continuam montadas;
   - **medir antes de mexer:** fora do carregador, 5 minutos com e sem
     Reduzir Movimento, idealmente numa build `preview`.
6. **O eas-cli do projeto está velho** (medido em 2026-09-24): o fixado é o
   16.32, e o atual é o 24.7.
   - **O que aconteceu:** ele imprimiu "Build request failed" com a build já
     criada no EAS.
   - **Para o próximo que disparar uma build:** confira o `eas build:list`
     antes de tentar de novo.
   - **Conserto candidato:** atualizar a dependência e fixar a versão em
     `cli.version` no `eas.json`, num run próprio.

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
     em 2026-09-25, na PR #36 (`fix/defeito-1-licao-concluida`), à espera de merge, sem
     build, pela opção A da
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
   **Ainda sem decisão em 2026-09-25.** O dono pulou o item na sessão na
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
   depois de aprovar. **Não conferido no simulador**, por decisão do dono
   sobre a condição de pronto
   ([relatório](superpowers/handoffs/2026-09-24-radiant-vida-por-tentativa-relatorio.md)).

**Decidido pelo dono em 2026-09-24 ([ADR](adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md)):** a H4 fecha
com os defeitos 1 e 2 corrigidos e o checkpoint conferido de novo no simulador.
O defeito 3 é a regra de vidas da mesma ADR. O **VoiceOver num iPhone físico**
sai da H4 e vira item próprio da 1.4, junto com o build `development` no
aparelho.

---

### 3. D4 — 18 de 19 aprovadas pelo dono em 2026-09-25; falta a capa

> **Atualizado em 2026-09-25, no branch `feat/d4-decisoes-de-revisao`. O bloco
> "Remedida em 2026-09-25" e o texto de 2026-08-08, abaixo, estão vencidos.**
> Detalhe e medição em [`2026-09-25-d4-propostas-e-cascata.md`](content/2026-09-25-d4-propostas-e-cascata.md).
>
> - **Feito:** o classificador lê as decisões de
>   `conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/review-decisions.json`.
>   O agente propôs destino para os 19, e **o dono aprovou 18** na conversa.
>   São 105 registros: **104 `approved` e 1 `needs-review`**.
> - **Radioterapia:** o `planet-radioterapia` entrou em `galaxy-tecnologia`,
>   `planned` e sem lição, por decisão do dono. Recebeu o p30 e o p32.
> - **Achado:** dos 9 "com sinal fraco", a proposta confirmou 4 e moveu 5. O p32
>   é radioterapia e estava em pneumotórax.
> - **DONO — o que falta, e ele pediu mais informação:**
>   1. como representar a exclusão da capa (p1), que hoje o classificador
>      recusa aprovar;
>   2. o que a D4 ainda bloqueia, com o V3 como direção.
> - **Cadeia desatualizada, só registrada, por decisão do dono:** conceitos e
>   bundles determinísticos não foram regerados desde 2026-08-08. Regerados
>   hoje, aprovariam os 16 conceitos. **Isso não governa o app:** o catálogo é
>   promovido de `ai-bundles.json`, que está 96 de 96 `approved`, e já leva os
>   16 conceitos.
> - **Guardas religadas:** `validate-foundation.test.mjs`, vermelho desde
>   2026-08-08, e `classify-source.test.py` agora rodam no `loop validate`.
> - **Guarda de sincronia (2026-09-25):** o `classify-source.test.py` regera a
>   classificação num diretório temporário e compara com o disco, byte a byte.
>   Uma decisão editada, ou uma regra de vocabulário mudada, sem regerar passa a
>   reprovar o `loop validate`. Vista falhando pelos dois defeitos.
> - **Janela:** `Conteúdo/classificação` foi aberta em `f39ec65`, fechada em
>   `b108651`, reaberta em `d152863` para as aprovações e fechada no run
>   seguinte.
>
> **Remedida em 2026-09-25. O texto abaixo, de 2026-08-08, está vencido.**
> Medido em `Conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classifications.json`:
> - **105 registros:** 86 `approved` e **19 `needs-review`**, e não 30;
> - **a estrela já é opcional:** 44 registros estão sem `starId`, e o
>   `validate-foundation.mjs:414` aceita `null`. O "bloqueio de contrato"
>   abaixo foi resolvido;
> - **os 4 fragmentos foram resolvidos** por remapeamento, e não por
>   reextração, que se provou impossível. Detalhe nos comentários de
>   `writePolicy` do `.loop/project.yaml`, janelas de 2026-08-08.
>
> **Os 19 restantes:**
> - **10 sem nenhum sinal:** `matches ['fallback']`, seis deles com confiança
>   de 0,35;
> - **9 com sinal fraco:** confiança entre 0,48 e 0,82.
>
> A maior concentração (9 dos 19) está em `planet-formacao-imagem`.
>
> **O que falta decidir:** ler a governança do conteúdo para saber se o agente
> pode aprovar os 9 com sinal ou só propor. Mudar qualquer registro reabre a
> janela de `Conteúdo/classificação` em `allowedRoots`, num run próprio e
> anterior, com a grafia do disco. O dono autorizou essa janela em
> 2026-09-25.

**Estado:** aberto, P0, bloqueia produção — mas decomposta.
**Bloqueio:** trocou de lugar, não morreu. **Dono:** agente nas duas primeiras
fatias; revisor de domínio só na terceira.

Medição: [`2026-08-08-d4-destino-existe.md`](content/2026-08-08-d4-destino-existe.md).

O bloqueio registrado era "os sete conceitos não têm nó de destino", e ele caiu
em 2026-08-07 com o eixo técnico. Mas **`scripts/content/classify-source.py`
carrega a taxonomia hardcoded em Python**, versão `mvp-2026-04-04`, e não conhece
`galaxy-tecnologia` nem os seis planetas novos. É a **terceira cópia** da mesma
estrutura; as outras duas já foram reconciliadas. O bloqueio não morreu — mudou
de lugar, e agora é ferramenta que não enxerga o destino, não destino ausente.

Os 30 `needs-review` medidos contra o eixo técnico:

| Fatia | Tamanho | Quem resolve |
| --- | --- | --- |
| Achariam destino com o classificador enxergando o eixo técnico | **19** | agente |
| Fragmento de extração abaixo de 80 caracteres, o menor com 3 | **4** | agente |
| Resíduo real, sinal fraco ou nenhum | **~7** | revisor de domínio |

Os 4 fragmentos seguem no disco porque **a extração desta fonte nunca foi
regerada** depois da correção do extrator em 2026-08-07. Reexecutar o extrator os
elimina sem decisão de ninguém.

**A ordem que este item declarava estava errada, e eu a escrevi.** Dizia
"reexecutar o extrator primeiro, porque é o mais barato". Medido em 2026-08-08:
não é. `excerpts.json` e `pages.json` não são rastreados, mas
`extraction-job.json` é, e `Conteúdo/extrações` foi **deliberadamente removido**
de `allowedRoots` com motivo escrito no próprio `project.yaml`. Reextrair também
muda as fronteiras de excerto, o que invalida `classifications.json` — rastreado,
e sob a mesma armadilha de grafia. As duas fatias de agente **compartilham a
parte cara**, então fazer a extração primeiro reclassifica duas vezes.

É a Observação #195 mordendo o texto de quem a escreveu: estimei "barato" sem
medir, uma iteração depois de registrar que o campo tamanho é o que convida a
verificar menos.

**A fatia de 19 tem um bloqueio de contrato, achado em 2026-08-08.** Não é
vocabulário:

- o schema `classification-record` exige `starId` como `string`, **não nulável**;
- `validate-foundation.mjs:409` reprova `starId` que não exista na taxonomia;
- `classify_excerpt` indexa `PLANET_STAR_IDS[planet_id]` e `[0]` sem fallback;
- e o dono decidiu que **os planetas novos não ganham estrela**.

Um excerto não consegue pousar num planeta técnico. A única saída compatível com
a decisão aprovada é **tornar `starId` nulável** — schema, validador,
classificador e a forma dos 109 registros. Criar estrelas resolveria o contrato
contradizendo a decisão, e pela razão que a decisão dá: estrela é trilha curta e
não há nenhuma produzida.

Detalhe numérico que morde junto: a confiança é
`0.5·galáxia + 0.3·planeta + 0.2·estrela`. Sem a parcela da estrela, planeta sem
estrela cai abaixo do limiar de 0,7 **por construção** e vira `needs-review` —
o oposto do objetivo. Precisa renormalizar para `0.625·galáxia + 0.375·planeta`,
com teste próprio.

**Ordem corrigida:**

1. ✅ **contrato** — `starId` nulável no schema, no `validate-foundation`, no
   `classify_excerpt` **e na guarda irmã do `classify_source`**, que eu não
   varri na primeira passada e o teste do bundle pegou. Confiança renormalizada
   para `0.625/0.375`. Feito em `af7b202`;
2. ✅ **vocabulário** — `galaxy-tecnologia` e os seis planetas em
   `classify-source.py`, `TAXONOMY_VERSION` em `eixo-tecnico-2026-08-07`.
   Medido contra os 109 excertos reais: **`needs-review` cai de 30 para 22**, e
   **45 registros passam a ter `starId` nulo** — os planetas sem estrela ficaram
   alcançáveis;
3. ✅ **regeneração da classificação** — feita em 2026-08-08.
   `classifications.json` no disco passou de **79/30 para 87/22**, com 45
   registros no eixo técnico e 45 com `starId` nulo. `validate-foundation` em 0.

4. ✅ **a reextração FOI feita em 2026-08-08**, depois que a conclusão abaixo
   caiu na medição. **105 excertos, zero fragmentos abaixo de 80 caracteres,
   `needs-review` em 19.** O texto abaixo fica como registro do erro.

   **O que eu concluí, e por que estava errado.** Vendo os 18 erros do
   `validate-foundation`, inferi que remover os fragmentos exigiria re-derivar
   conceitos e formatos — as lições geradas — e portanto motor de IA local.
   **Inferi, não medi.** O conserto do extrator **funde** o órfão no pedaço
   anterior da mesma página; não o descarta. Medido nos quatro: o texto do órfão
   está **contido** no `c1` da extração nova, e as contagens fecham
   (1392 + 51 → 1444). E nas **76 ocorrências em lista, em 17 arquivos
   rastreados, todas** vinham acompanhadas do irmão `c1`.

   Então remover o id órfão não perdeu proveniência nenhuma: o texto segue
   citado, dentro do irmão. Era **remapeamento de referência**, não regeneração
   de conteúdo — e não precisou de Ollama nem de motor nenhum.

   Duas armadilhas do remapeamento, ambas achadas pelo gate e não pela revisão:
   os conceitos citam o mesmo excerto em **duas formas de id** — `excerpt:…` e
   `classification:excerpt:…` —, e limpar só a primeira deixa a cadeia de
   proveniência 1:1 quebrada; e `Conteúdo/extrações/index.json` carrega uma
   **cópia** do `extraction-job`, então atualizar só o job deixa os dois em
   desacordo.

   *Registro do erro original:*

   A triagem da D4 registrou os 4 fragmentos abaixo de 80 caracteres como
   "defeito de extração, trabalho de pipeline, some sem decisão de ninguém". Eu
   repeti isso na medição da manhã. **É falso, e foi medido executando.**

   Reextrair leva 109 excertos a 105 e zera os fragmentos — o conserto do
   extrator funciona. Mas `validate-foundation` reprovou com 18 erros, porque
   `conteúdo/conceitos/` e `conteúdo/formatos/` **citam nominalmente** os
   excertos que sumiram: `p41:c2` e `p42:c2` sustentam o conceito de preservação
   de alimentos, `p71:c2` o de qualidade de imagem, `p33:c2` o de tomografia. Os
   órfãos são **load-bearing**: sustentam a proveniência de lições que já
   embarcam.

   Restaurado rodando o extrator com `MIN_CHARS = 0` num rascunho fora do
   repositório, o que reproduz exatamente a forma anterior — 109 excertos, os
   quatro ids de volta.

   **Isto não é uma limpeza de pipeline; é regeneração de conteúdo.** Tirar os
   fragmentos exige re-derivar conceitos e bundles de formato, que são as lições
   geradas. Fica como item próprio, com esse escopo declarado, e **não** como
   "trabalho pequeno".

**Pendência operacional:** a janela de escrita aberta em `4b28bd5` para
`Conteúdo/extrações` e `Conteúdo/classificação` **precisa ser fechada** em run
próprio, como o comentário no `project.yaml` promete.

**O achado que vale mais que o número, e quase me fez enviar a versão errada.**
Um primeiro vocabulário, mais agressivo, levava `needs-review` de 30 para **17** —
melhor manchete. Mas **12 dos 20 resgates pousavam em
`planet-profissao-e-aplicacoes`**, numa fonte onde profissão é uma lição só. A
causa: `tecnico em radiologia` aparece em **77 dos 109 excertos** porque é o
cabeçalho de página do módulo. O termo de maior aparência semântica era o do
rodapé, e a métrica de manchete **premiava a colocação errada** — exatamente o
risco que a medição de 2026-08-03 nomeou, chegando por outra porta. A versão
podada resgata 12 com 4 regressões, e resgata para lugares plausíveis.

O revisor de domínio passa a receber **7 itens em vez de 30**, e só depois de o
dicionário estar consertado — que é exatamente o que a triagem de 2026-07-31
pedia para não fazer ao contrário.

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
