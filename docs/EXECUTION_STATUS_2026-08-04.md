# Radiant — Execution Status (2026-08-04)

> **SUBSTITUÍDO.** O estado canônico agora é
> [`EXECUTION_STATUS_2026-08-06.md`](EXECUTION_STATUS_2026-08-06.md). Em
> particular, a seção "Produção contínua de aulas" abaixo está **desatualizada**:
> ela diz que a Task 4 está reprovada e que as tarefas 5 a 8 não começaram, e as
> nove tarefas fecharam no mesmo dia. Leia o sucessor antes de agir sobre esta
> página.

Este documento **substitui [`EXECUTION_STATUS_2026-08-02.md`](EXECUTION_STATUS_2026-08-02.md)**
como estado canônico.

Aquele documento resistiu, com razão, a ganhar um sucessor em 2026-08-03: era o
mesmo corpo de trabalho, um dia depois, e criar um sucessor obriga a mover seis
ponteiros. O que mudou agora é que ele acumulou **quatro adendos** e o corpo de
trabalho é outro — uma varredura de defeitos aberta por smoke instrumentado, não
a continuação da apresentação de primeiro uso. Um quinto adendo tornaria o
documento ilegível para quem chega a triar. Os seis ponteiros foram movidos.

Tudo que o documento substituído registra continua valendo e **não foi
reverificado aqui**, exceto onde esta página diz o contrário.

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. Abre,
oferece catálogo local, registra progresso e permite revisão sem API remota.

A API pública em `api.radiant.ascendcreative.com.br` responde **HTTP 502**,
**remedido em 2026-08-04**. A medição acrescenta um detalhe que o estado anterior
não tinha: ela responde em 0,27s, ou seja o domínio resolve e há gateway de pé —
o que está fora é o upstream, não a infraestrutura.

## O que mudou desde 2026-08-02

### E2E passou a ser medido sob configuração equivalente a produção

Pela primeira vez a suíte foi colhida com `APP_ENV=production` e
`ENABLE_PUSH=true` — as **únicas duas** diferenças de runtime entre `e2e-test` e
`production`. Resultado: **6 de 6 no iOS e 6 de 6 no Android**, versão 1.3.1 (3)
conferida nos binários instalados dos dois lados. Isso fechou o item 3 dos
bloqueadores e a defasagem de 11 commits entre a evidência e o HEAD.

Detalhe em
[`2026-08-03-e2e-producao-rating-prompt.md`](../radiant-app/docs/evidence/2026-08-03-e2e-producao-rating-prompt.md).

**A prova de que a build rodou sob produção não veio de `strings` no bundle** — ele
é Hermes e a tabela de literais não distingue a inlinada. Veio do aparelho:
`build_channel=production` em todo evento do prompt de avaliação.

### Três defeitos reais, achados e corrigidos

**1. O ciclo de vida de abertura não existia no app distribuído** (`f499714`).
`app_open` tinha um único emissor, na `HomeScreen` legada, que `(tabs)/index.tsx`
só renderiza com `ENABLE_LEARNING_ROAD=false` — e nenhum dos cinco perfis declara
isso. **Nenhuma build emitia o evento.** Com ele faltavam `markDayOpen()`, único
inicializador de `cohort.installDate`, e o reset de backoff de push.

Consequências medidas: `RatingPromptService` e `PaywallService` travados em
`insufficient_sessions`, o paywall somando `missing_install_date`, e retenção
D1/D7 sem base. Três documentos afirmavam o evento como emitido, inclusive o
[contrato legal de telemetria](legal/CONTRATO_TELEMETRIA.md) — a divergência foi
de **completude no sentido seguro**: coletou-se menos do que o anunciado, nunca
mais.

Migrado para o hook `useAppOpenLifecycle`, consumido pelas duas homes.
`checkHeuristics()` ficou **deliberadamente de fora** — renderiza nudges, é
decisão de produto.

**2. A barra de status era ilegível em todo o app** (`b62f529`). `_layout.tsx`
declarava `<StatusBar style="dark" />` nos cinco ramos; no `expo-status-bar`,
`dark` significa conteúdo **escuro**, o valor para fundo **claro**. O app pinta
`#03030d`. Contraste medido: **1,02:1**, contra 20,53:1 que o conteúdo claro
teria. Com `edgeToEdgeEnabled: true` o app desenha atrás da barra, então o estilo
é responsabilidade dele.

**3. Conquista bloqueada podia ser coletada por deep link** (`130d8ea`).
`radiantapp://reward?nodeId=…` — esquema invocável de fora do app — alcançava um
nó bloqueado, a tela dizia "Pronta para ser coletada" com 0 de 14 marcos, e o
botão gravava `markNodeCompleted`. A guarda existia em `loadSnapshot` e não havia
viajado para o caminho de coleta.

### Os 18 assets publicáveis foram regerados

O defeito nº 2 estava assado em **todos** os screenshots de loja: 6 do Play e 12
dos dois buckets de iPhone. **O contrato de assets os aprovava 14/14**, porque
mede dimensão, proporção, peso e presença — nunca legibilidade.

| Conjunto | Aparelho | Tamanho |
| --- | --- | --- |
| Play | emulador API 36 a `wm size 1080x1920` | 1080×1920 |
| App Store 6,7" | simulador iPhone 16 Plus | 1290×2796 |
| App Store 6,5" | simulador iPhone 11 Pro Max | 1242×2688 |

Os simuladores da receita anterior não existiam mais neste Xcode; foram recriados
como *device types* no runtime iOS 26.5. O `normalize-screenshots.py` é
**validador, não conversor** — tamanho exato ou recusa.

## Versão e builds — leia antes de submeter

`app.json` em **1.3.1**. O `versionCode` do arquivo (`3`) é **decorativo**:
`cli.appVersionSource: "remote"` e `autoIncrement` no perfil `production` colocam
o contador no servidor do EAS.

| Artefato | Estado |
| --- | --- |
| Lojas | `1.3.0 (4)` na faixa `alpha` |
| AAB `1.3.1 (5)` | **não usar** — precede a correção da barra de status |
| AAB `1.3.1 (6)` | **não usar** — inclui a barra de status, mas **precede** a correção da conquista |

**Nenhuma build existente serve para submissão.** A próxima sai como `(7)`.

## ⚠️ A matriz de sign-off precede o HEAD outra vez

Os 6 flows foram medidos em `b9c77f4`; o `reward-locked` em `130d8ea`. As
correções nº 2 e nº 3 landaram **depois** da rodada de 6 flows, e a nº 2 toca
`_layout.tsx`, que é a raiz de toda tela.

Nada indica regressão — `npm run quality` passa, os contratos passam, e a suíte
tem hoje **7 flows**. Mas pela regra deste projeto, contrato estático não promove
plataforma: **a suíte precisa ser reexecutada antes de o placar valer para
submissão.**

Esta é a terceira vez que essa defasagem aparece. O padrão não é descuido: toda
correção depois da medição a recria. A saída estrutural seria medir imediatamente
antes de submeter, e não tratar a matriz como estado durável.

### Quantificada em 2026-08-04 — a lacuna é de registro, não de cobertura

O aviso acima está certo como regra e vinha sendo lido como bloqueio. Medido:

| Mudou desde a matriz | Onde já foi exercitado em device |
| --- | --- |
| `b62f529` — `_layout.tsx`, 10 linhas, o estilo da barra de status | o `store-capture` rodou verde nas **duas** plataformas *depois* dele, para regerar os 18 assets de loja (iOS 448s no bucket 6,5"). Esse flow atravessa home → lição → quiz → checkpoint → tela de conquista → progresso |
| `130d8ea` — `RewardScreen.tsx`, 46 linhas, a guarda da conquista bloqueada | `reward-locked` verde nos dois lados **nesse commit** (iOS 82s, Android 81s) |
| `RewardScreen.flow.test.tsx` | só teste |

São os **únicos** arquivos do app tocados desde `b9c77f4`, e **o código do app em
HEAD é idêntico ao de `130d8ea`**: tudo depois dele é documentação
(`git diff 130d8ea..HEAD -- radiant-app/src radiant-app/components
radiant-app/app.json radiant-app/eas.json radiant-app/package.json` volta vazio).
Toda mudança posterior à matriz tem evidência de aparelho; o que não existe é um
placar colhido num commit só.

**A consequência prática é não reexecutar agora.** Reexecutar hoje recria a mesma
lacuna com o próximo commit — foi exatamente assim que o padrão se repetiu três
vezes. A janela de host se gasta imediatamente antes da submissão à loja (F4).
Distribuir no TestFlight não é bloqueado por isto.

## Adendo 2026-08-04 (segunda sessão) — a trilha iOS descrevia um app que não foi construído

### A build no TestFlight ficou para trás do produto

A build distribuída é a `1.3.0 (4)` (EAS `f8d1d949`, 2026-08-01 18:04). Desde ela
são **54 commits, 35 de código**, e ela **precede a apresentação de primeiro uso
inteira**, a correção da barra de status, a integridade da conquista e o
`useAppOpenLifecycle`. Os três itens que faltavam na F1 — smoke dos links no
iPhone físico, sessão de VoiceOver e reconciliação da ficha — dois exigem
aparelho, e fazê-los nessa build seria medir a versão **sem** a tela onde o
último defeito real de VoiceOver apareceu.

Build `1.3.1 (5)` criada nesta data: `46bd86fd-7600-4b98-b60a-119658866279`.

**Entregue às 13:50 de 2026-08-04.** A submissão `5218f0ac-dbc7-4fb6-895c-b70404a47ec3`
fechou em `FINISHED` com `error: null`, depois de **~2h12 disparada** — quase
tudo em `IN_QUEUE`, sem nenhum arquivo de log até o fim. O contraste vale
registrar: a build **compilou em 6 minutos** e esperou 8 segundos na fila de
build. A fila cara deste projeto não é a de compilação, é a de submissão.

**Processamento Apple confirmado às 14:30 BRT de 2026-08-04.** O App Store
Connect mostrou a versão `1.3.1`, compilação `5`, como **Pronta para envio**, com
expiração em 90 dias e já vinculada ao grupo interno `Radiant Internal`.

*Procedência, porque este projeto distingue o que foi medido do que foi visto:*
esta leitura veio da interface autenticada do App Store Connect — observada pelo
dono e reconfirmada nesta sessão —, não da API. Não há chave `.p8` da App Store
Connect no ambiente, e o `eas.json` declara apenas `ascAppId`; reverificar exige
abrir novamente a interface do console.
Cancelar ou redisparar foi descartado: produziria uma submissão duplicada depois
de a entrega original ter concluído corretamente. A dependência de processamento
da F1 está encerrada. A metadata e as declarações foram reconciliadas em
2026-08-05, conforme abaixo. Àquela altura ainda faltavam o smoke dos links no
iPhone físico e a sessão humana de VoiceOver; a coleta posterior da mesma data
está registrada abaixo.

**Ficha iOS parcialmente reconciliada às 15:40 BRT de 2026-08-04.** O registro
público passou de `1.3.0` para `1.3.1`, recebeu a build `5`, a URL de suporte, a
categoria **Educação** e liberação manual. Os seis screenshots de iPhone 6,5"
foram enviados um a um e persistiram, após recarga, na ordem narrativa
`home -> lição -> quiz -> checkpoint -> conquista -> progresso`; o console
declarou que reutilizará esse conjunto nos demais tamanhos e idiomas selecionados.

**Copy aprovada e persistida em 2026-08-05.** Anderson aprovou o nome público
`Radiant — Radiologia`, o subtítulo opção 1 e a descrição curta Google Play
opção 1. A fonte de copy foi reconciliada. No App Store Connect, o subtítulo
`Radiologia: estude e revise`, o texto promocional, a descrição longa convertida
para texto limpo e as keywords foram salvos e continuaram presentes após
recarga; os seis screenshots também conservaram a ordem aprovada. A descrição
curta do Play está aprovada, mas esta sessão não afirma que foi digitada naquele
console.

**Declarações e contato persistidos em 2026-08-05.** Anderson confirmou que o app
contém conteúdo de terceiros e que detém os direitos necessários. Na classificação
Apple, atestou `Informações médicas ou sobre tratamentos` como **Pouco frequente**;
todo o restante ficou em `Nenhum`/`Não`, coerente com o binário. O console calculou
`13+` em 172 países ou regiões e `12+` no Brasil e na Coreia do Sul, sem
substituição manual. Copyright `2026 Anderson Melo` e os quatro campos de contato
da revisão foram salvos e sobreviveram à recarga. O estado incorreto de login
obrigatório foi desmarcado, coerente com o app sem conta; notas do revisor seguem
vazias. Nenhum dado pessoal de contato foi copiado para a documentação.

O botão **Adicionar para revisão** está disponível, mas não foi acionado. O
pré-voo físico de 2026-08-05 encontrou **zero iPhones com túnel CoreDevice ativo**,
portanto naquele momento smoke e VoiceOver estavam sem execução — não
reprovados. A ausência de túnel neste host não impediu a execução humana
posterior diretamente no iPhone.

**Smoke físico do TestFlight concluído em 2026-08-05.** Anderson confirmou no
binário instalado `1.3.1 (5)` e executou os sete cenários do roteiro em iPhone
físico. Passaram: apresentação de primeiro uso sem repetição no relaunch, barra
de status legível, lição/checkpoint com conquista e `20 XP`, deep link da
conquista bloqueada sem botão de coleta, os dois links legais com retorno ao
app, e relaunch com modo avião e Wi-Fi desligado preservando `20 XP`, sequência
de `1 dia` e catálogo local. O prompt de avaliação não apareceu cedo; sua
ausência não reprova porque a Apple controla a exibição.

A coleta também encontrou um defeito **no critério**, não no app: o roteiro
exigia `REVISÕES > 0` logo após concluir. O contador mostra somente cards
vencidos, e **a verificação no código em 2026-08-05** fecha a questão:
`recordQuizResult` cria o card e aplica o SM-2 na mesma chamada, com todo ramo
terminando em intervalo ≥ 1 dia, então nenhum card é persistido vencido — nem
quando o aluno erra tudo. Portanto `REVISÕES 0` no mesmo dia é o resultado
correto. O roteiro foi reconciliado e nenhuma correção de código foi aplicada.

**VoiceOver avançou, mas B4 não fecha por amostragem incompleta.** Foram ouvidos
uma vez `Galáxia, aba 2 de 4, botão`, `Progresso, aba 3 de 4, botão` e
`Confirmar reset com token, escurecido`. Isso confirma nome, estrutura e estado
desabilitado e resolve a dúvida de duplicação nesses controles. Não foi
transcrita uma dica nem ativado um `AppButton` realmente ocupado, ambos pedidos
pelo item 2 do Gate 2. Àquela altura a F1 permanecia aberta somente por essa
evidência auditiva incompleta; não há falha nova do binário que justifique
cancelar ou redisparar. **Isso mudou em 2026-08-06: o item 2 fechou (B4) e a F1
perdeu o último bloqueio de evidência** — resta a ação humana no console,
`Adicionar para revisão`, que é a F4.
Relatório completo em
[`2026-08-05-testflight-1.3.1-build-5-iphone.md`](../radiant-app/docs/evidence/2026-08-05-testflight-1.3.1-build-5-iphone.md).

**Gate 2 APROVADO (5/5) em 2026-08-06, e a F1 perdeu o último bloqueio.** O
item 2 fechou no mesmo dia do item 1, **com ressalva escrita**: nome, função,
dica e desabilitado foram ouvidos em controles reais — o CTA da home anunciou
`Fazer revisão`, `botão` e a dica, cada um uma vez e nessa ordem —, mas o
**estado ocupado não é produzível nesta build** e ficou coberto pelo contrato
unitário do `AppButton`. É troca, não equivalência, e tem gatilho de
reabertura: se `EXPO_PUBLIC_ENABLE_PAYWALL` for declarada em algum perfil, ou
outro `AppButton` receber `loading`, o item volta à mesa
([evidência](../radiant-app/docs/evidence/2026-08-06-b4-voiceover-item2.md)).
**Consequência operacional:** o lado iOS não tem mais pendência de evidência; o
próximo passo da F1 é humano e é o `Adicionar para revisão` da F4.

**Item 1: como ele voltou a 4/5 antes disso, com evidência própria.** O item
1 foi reaberto na véspera pela recontagem abaixo e **fechado no dia seguinte com
uma caminhada nova em iPhone físico**: nada se move nas três telas da galáxia,
tocar num planeta abre sem animação, e a distinção entre planeta ativo,
disponível e bloqueado sobrevive à preferência — medida contra uma captura de
base tirada **antes** de ligá-la, porque uma tela sóbria parece correta sozinha.
Aprovados: itens 1, 3, 4 e 5. Aberto: só o item 2 (**B4**), que não fecha
caminhando. Evidência em
[`2026-08-06-b8-reduce-motion-iphone.md`](../radiant-app/docs/evidence/2026-08-06-b8-reduce-motion-iphone.md);
a **B8** está concluída. Resolver disputa de contabilidade medindo de novo saiu
mais barato do que discuti-la.

**A recontagem que provocou isso, registrada em 2026-08-05, sem regressão.** A revisão desta data
encontrou o roadmap dizendo `4/5` na mesma frase em que dizia que a passagem
manual do item 1 seguia pendente. Lendo a evidência do item 1: ela mediu a
animação de entrada no caminho da lição em 2026-07-26 e declarou que shake,
scale e press não foram medidos — e em 2026-08-03 o critério do item cresceu
para exigir a caminhada pelas quatro superfícies da galáxia, que só naquele dia
passaram a honrar a preferência. Uma passagem não pode cobrir um critério
posterior sobre código que ainda não existia. Aprovados: itens 3, 4 e 5.
Abertos: item 1 (nova task **B8**) e item 2 (**B4**). Nada que havia sido medido
deixou de valer; o que mudou foi a contabilidade. O critério do marco **M1**
passou a citar os três itens.

**O runbook de classificação deixou de prometer `4+` em 2026-08-05.** A
documentação oficial vigente da Apple define conteúdo médico/de tratamento por
diagnóstico ou orientação de manejo e transforma `Infrequente` em `13+` global /
`A12` no Brasil e `Frequente` em `16+` / `A16`. O binário contém conteúdo
radiológico e referências diagnósticas, embora não dê aconselhamento clínico.
Por isso a resposta e a declaração de direitos foram tratadas como atestações
humanas, não inferências da automação. Anderson as forneceu em 2026-08-05 e o
console persistiu ambas. O runbook foi corrigido para não transportar a resposta
entre Apple e IARC/Play.

*Nota de ferramenta, para quem for verificar isto de novo:* **não existe**
`eas submission:list`. Nem no `eas-cli` 16.32.0 que o projeto fixa, nem no 21.5.0
atual — o `submit` não tem subcomando de listagem em versão nenhuma, e o
`build:view` não traz submissões. O estado foi medido pela API que o próprio
`eas-cli` embute: `BuildQuery.withSubmissionsByIdAsync`, autenticada pelo
`SessionManager` dele, que lê a sessão já existente sem expor o segredo.

**Correção de contador, que a tabela de builds acima não deixa explícita:** os
`(5)` e `(6)` daquela tabela são **AABs Android**. O contador iOS está em **4** —
o EAS mantém um por plataforma. A próxima iOS é `1.3.1 (5)`; a próxima Android,
`(7)`.

*Medido de passagem:* o arquivo enviado ao EAS tem **856 MB**, confirmado no
upload desta build. O item do `.easignore` segue aberto e segue sendo decisão do
dono, por exigir alargar `writePolicy.allowedRoots`.

### Quatro documentos de release mandavam executar o impossível

`radiant-app/docs/release/` estava em 2026-04-09 (`847a12d`). O roteiro de smoke
do TestFlight mandava **fazer login** (bloco inerte sem `EXPO_PUBLIC_API_BASE_URL`,
que nenhum perfil declara), **inspecionar fila e status de sync**
(`ENABLE_REMOTE_SYNC=false` em produção), **ligar o perfil da jornada V2** (a
Learning Road é a home em todos os perfis desde o ADR de 2026-07-27) e **completar
até o nó de reward** (inalcançável sem as sete lições). O checklist de soft launch
pedia layout e smoke de tablet, com `supportsTablet: false` desde 2026-07-29.

E a ficha declarava à App Review duas capacidades ausentes — entrar com conta e
retomar sincronização —, além de um subtítulo pt-BR de **46 caracteres** contra o
teto de **30**, que nunca poderia ser digitado no console. Ninguém tinha medido o
comprimento.

**Por que sobreviveu quatro meses:** o `docs-contract` governava só os cinco
documentos de estado. É a terceira aparição da mesma regra neste projeto — o
contrato aprova o que ele mede, e o de assets já tinha aprovado 18 screenshots
ilegíveis por medir dimensão e presença.

Agora ele governa os quatro documentos de `release/`, com as capacidades
**derivadas** do `eas.json` e do `app.json`: quando login, sync ou tablet passarem
a existir, a guarda correspondente some sozinha em vez de virar literal
envelhecida. Um documento novo nessa pasta precisa ser classificado como
instrucional ou registro, senão o teste falha.

**Uma consequência que vale carregar:** a guarda casa com a afirmação onde quer
que ela apareça, e **não distingue citação histórica de declaração viva** — o
próprio cabeçalho que registrava as frases retiradas reprovou o contrato. As
frases passaram a ser descritas, não citadas. Abrir exceção para texto citado
seria abrir a porta que a guarda existe para fechar.

## Produção contínua de aulas — desenho, plano e execução parcial (2026-08-06)

Uma frente nova abriu nesta data e está **parcialmente executada**. O diagnóstico
que a motivou: a D4 não esperava decisão de currículo, esperava **um mapa entre
dois grafos que ninguém sabia que eram dois** — o catálogo wave-1 (o que embarca,
com nós `ai-lesson:` desde abril) e a taxonomia de competências (que o
classificador mira, com planetas e estrelas em `planned`).

- Desenho: [`specs/2026-08-06-producao-continua-de-aulas-design.md`](superpowers/specs/2026-08-06-producao-continua-de-aulas-design.md)
- Plano e **estado da execução tarefa a tarefa**:
  [`plans/2026-08-06-producao-continua-de-aulas.md`](superpowers/plans/2026-08-06-producao-continua-de-aulas.md)

Concluídas as tarefas 0 a 3 e a 2.5; a **Task 4 está reprovada na revisão** com
dois achados Críticos, e as tarefas 5 a 8 não começaram. Quem retomar deve ler a
seção "Estado da execução" no topo do plano — o ledger operacional é ignorado
pelo git e não sobrevive a um clone.

Decisões travadas no desenho: a IA gera a partir da taxonomia; **toda afirmação
ancora em excerto autorizado**, com amostragem humana; os dois grafos ficam
ligados por mapa versionado e validador; o motor de geração é **local**, sem
custo por token.

## Entrega: onde este trabalho está, em 2026-08-06

Toda a onda de 2026-08-03 a 2026-08-06 está commitada e empurrada em
`codex/wave1-hardening-api-smoke`, e aberta para a `main` no **PR #1**
(`https://github.com/andersonsmelo/Radiant/pull/1`): 30 commits, 84 arquivos,
`+4835/−336`. A `main` estava **30 commits atrás e zero à frente** — não há
divergência a resolver, só revisão e merge.

Os dois últimos commits fecham o dia: `94abbac` leva as fichas de loja
(classificação etária e copy) e `0ca60b0` leva o smoke físico, o relatório de
evidência da F1 e a recontagem do Gate 2. A narrativa da ficha viaja no segundo
porque ela e o texto da F1 ocupam o mesmo trecho do status e do roadmap — não há
como separá-las por hunk, e a mensagem do commit diz isso em vez de deixar a
divisão parecer mais limpa do que é.

**Vale registrar por que esta seção existe.** As três sessões de 2026-08-05 e
06 fecharam run com evidência validada e **nenhuma delas commitou**: a árvore
chegou à revisão desta data com sete arquivos modificados de três sessões
diferentes, e um `git status` sozinho teria atribuído todos à última. Foi o
`before/` do checkpoint de cada run que separou a autoria. É a **segunda
ocorrência** do mesmo padrão — a primeira está registrada em
[`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md) como
"trabalho validado porém não commitado", e é dela que vem a regra do `AGENTS.md`
de tratar trabalho não sinalizado como não feito. Run fechado e repositório são
dois relógios; só o segundo é lido pela próxima sessão.

## Aberto

1. **F2** — opt-ins do closed test. 14 vinculadas, 2 participando; faltam ≥10
   para o piso de 12, e só aí começam os 14 dias. **Vínculo não é adesão.**
   Caminho crítico; nenhum trabalho de engenharia o encurta.
2. **D1** — [`ADR-2026-08-04`](adr/ADR-2026-08-04-estrategia-da-api.md) escrito,
   aguardando a linha do decisor. Recomenda decidir **antes da E3**, porque
   contas mudam privacy labels e Data safety.
3. **A5** — resta gerar a service-account key. `radiant-app/credentials/` está
   vazia. Não bloqueia publicar: o AAB vai pelo console.
4. **B4** — avançou em iPhone físico, e em 2026-08-06 o que falta ficou medido
   antes de gastar aparelho: a **dica** tem um alvo único no produto (o CTA da
   home) e o **estado ocupado não é produzível nesta build** — o único
   `AppButton` com `loading` vive atrás de `ENABLE_PAYWALL`, que não é declarada
   em nenhum perfil do `eas.json`, e a janela ocupada duraria milissegundos
   antes de o botão desmontar. Mesma classe da B0. **Decisão pendente do dono**
   entre fechar o item pelo contrato unitário ou construir o harness na tela de
   dev-tools (recomendado); as três saídas estão em
   [`ACCESSIBILITY_QA_V1.md`](../radiant-app/docs/ACCESSIBILITY_QA_V1.md).
   **C4/C5**, **E3** e o lado Play de **E4** exigem humano ou hardware.
5. **B5** — **iOS executado e `passed` em 2026-08-06**: 170 passos, 0 falhas,
   build local Release `e2e-test` no simulador, com `13 de 14` → `14 de 14`
   marcos na coleta e chegada pelo caminho do produto
   ([evidência](../radiant-app/docs/evidence/2026-08-06-b5-reward-unlock-ios.md)).
   O deep link já cobria a tela e o estado bloqueado; o que faltava era a regra,
   e ela agora está provada num lado.

   **Resta o Android, com três tentativas frustradas em 2026-08-06 e nenhuma
   delas por defeito do produto:** (1) parou no passo 103 numa régua de
   visibilidade herdada do padrão do Maestro — diagnosticada, corrigida e pinada
   no contrato; (2) parou no passo 4 com o emulador sumindo do `adb`; (3) parou
   no passo 34 num timeout sob disputa de host **criada por mim**, ao rodar
   `loop validate` durante o flow. A terceira foi medida, não suposta: 2,47
   min/passo contra 1,07 com o host ocioso, 2,3× mais lento, e o passo que
   falhou havia passado na primeira corrida sob critério mais rígido. O runbook
   ganhou a regra que faltava — suíte de teste também é carga concorrente.

   **O custo estava errado por quase uma ordem de
   grandeza.** Medido neste host: ~1 min por passo no emulador — 103 passos
   consumiram ~110 minutos. Os 170 passos são **horas**, não os ~13 min que o
   roadmap prometia, e a janela exclusiva precisa ser planejada assim. Duas
   tentativas pararam por motivos diferentes e nenhum deles é o produto: a
   primeira numa régua de visibilidade herdada do padrão do Maestro (diagnosticada,
   corrigida e pinada no `test:maestro-contract`), a segunda com o emulador
   sumindo do `adb` depois de 4 passos, num host de 16 GB. A task não fecha
   antes de o Android rodar inteiro.
6. Menores registrados: `checkHeuristics()` sem fiação; `eyebrow` do
   `JourneyHero` quebrando no meio da palavra a 2× de escala; e o arquivo enviado
   ao EAS com 856 MB, que um `.easignore` resolveria — mas
   `radiant-app/.easignore` não está em `writePolicy.allowedRoots`, então widening
   da policy é run próprio e decisão do dono.

## Herdado, não reverificado

Todo o estado de preparação de lançamento — contas de desenvolvedor, TestFlight,
entitlement premium (ADR-2026-08-01), currículo v2 — está em
[`EXECUTION_STATUS_2026-07-29.md`](EXECUTION_STATUS_2026-07-29.md), com o
histórico de 08-02 no documento substituído. Nada ali foi tocado por este
trabalho.
