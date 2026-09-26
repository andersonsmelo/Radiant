# Prompt de continuidade (6) — 2026-09-25

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81). Você trabalha com o dono: ele decide loja, aparelho, build
de distribuição e merge.

**Uma frente por conversa.** Pegue a primeira pendência da §3 que for do agente
e estiver destravada, combine a condição de pronto com o dono e não misture
outra frente na mesma conversa.

Este prompt substitui o
[prompt (5)](2026-09-25-radiant-prompt-de-continuidade-5.md). Os itens dele
estão cumpridos ou foram copiados para a §3. **Não execute itens dele.**

## 0. O que foi concluído na sessão local de 2026-09-25

Tudo abaixo está no branch `feat/d4-decisoes-de-revisao`, empilhado sobre a #37
e enviado ao remoto. **Ainda não tem PR.**

| Item | Estado | Onde |
|---|---|---|
| **D4:** camada `review-decisions.json`, lida pelo classificador | ✅ proposta não aprova; aprovação exige revisor e data | [medição](../../content/2026-09-25-d4-propostas-e-cascata.md) |
| **D4:** 18 de 19 aprovadas pelo dono, e `planet-radioterapia` criado (`planned`, sem lição) | ✅ 104 `approved` e 1 `needs-review` (a capa) | idem |
| **D4:** guardas | ✅ `validate-foundation.test.mjs` e `classify-source.test.py` religados ao `loop validate`; guarda de sincronia entre decisões e classificação | `f39ec65`, `ed876b9` |
| **eas-cli** 16.32 → 24.8.0, com `cli.version >= 24.8.0` | ✅ o 16.32 é recusado; ainda sem build real | `82b1029`, FILA achado 6 |
| **Regra de vidas** conferida no simulador `A5FA5443` | ✅ cinco cenários, pela tela e pelo AsyncStorage | [evidência](../../../radiant-app/docs/evidence/2026-09-25-regra-de-vidas-simulador.md) |
| **Aquecimento**, medição indireta | ✅ ~94 % de um núcleo com animações, 0,4 % com Reduzir Movimento, reproduzido | [evidência](../../../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md) |
| Relatório da D4 | ✅ | [relatório](2026-09-25-radiant-d4-relatorio.md) |

**Decidido pelo dono nesta sessão:**
- **Push autorizado** a partir de 2026-09-25. **PR: uma por dia, às 21 h**, com o
  acumulado. A de 2026-09-25 não foi aberta, por decisão dele. **Pergunte
  antes de abrir a próxima.** O merge continua sendo dele.
- **D4:** quem aprova é o revisor, e o agente só propõe. O dono aprovou 18
  propostas e o nó de radioterapia. A cadeia de conceitos e bundles
  desatualizada fica **só registrada**.

## 1. Meça antes de agir

```bash
git fetch origin --prune && git status --porcelain && git branch --show-current
gh pr list --state open
git log --oneline -1 origin/main
git ls-remote --heads origin
```

**Esperado em 2026-09-25 às 17:43:**
- abertas, nesta ordem de merge: a #35, a #36 e a #37;
- a `origin/main` em `c9062da`;
- no remoto, além delas, o `feat/d4-decisoes-de-revisao`.

**Se a #35, a #36 e a #37 já estiverem na `main`:**
- traga o `feat/d4-decisoes-de-revisao` para cima dela;
- comece a branch nova por ele.

**Se não estiverem,** parta de `feat/d4-decisoes-de-revisao`, que é o topo da
pilha. Para branch nova a partir da `main`:

```bash
git switch --no-track -c <nova> origin/main
```

## 2. Leia, nesta ordem

1. `AGENTS.md`, inteiro.
2. `docs/STATUS.md`. Remeça antes de citar qualquer número.
3. `docs/FILA.md`.
4. O relatório, a medição ou a ADR da frente que você pegar.

## 3. Todas as pendências, em ordem de prioridade (2026-09-26)

Ordem combinada com o dono em 2026-09-25, às 21:10, juntando a lista dele com a
do agente. **Ela substitui a numeração anterior desta seção:** o 9 antigo
(isolar o aquecimento) foi feito às 18:06
([relatório](2026-09-25-radiant-aquecimento-isolado-relatorio.md)) e saiu.

O critério é o que cada item destrava. No empate, vence o que tem relógio mais
longo. A mesma ordem está na [FILA](../../FILA.md#ordem-de-prioridade-combinada-em-2026-09-25).

**Atualizada às 21:30.** O 1 e o 2 foram cumpridos: as PRs #35, #36 e #37
entraram na `main` (`e992686`), e o dono decidiu o "Gerenciar", o Ask to Buy e
o cancelamento ([ADR](../../adr/ADR-2026-09-25-storekit-gerenciar-ask-to-buy-e-cancelamento.md)). Com isso, a folha do "Gerenciar" (19a) subiu
para a P1, porque destrava o 4, e o 5 e o 16 passaram ao agente.

**Atualizada às 22:00**, pela [ADR da amostra da L1, da D4 e dos planos](../../adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md):
- a D4 fechou como superada, e com ela saíram o 8, o 9, o 10, o 17 e o 18;
- a amostra da L1 vai ser corrigida antes de aprovar (7a e 7b);
- os planos terão o mensal primeiro (19b);
- o preço passa a acompanhar a troca de loja, dentro do 19a.

**P1 — o que segura a 1.4**

| # | Tarefa | Dono | Destrava / depende |
|---|---|---|---|
| ~~1~~ | ~~**Merge de #35 → #36 → #37**~~ | dono | ✅ Feito em 2026-09-25, pelo agente, com autorização do dono |
| ~~2~~ | ~~**StoreKit: decidir o "Gerenciar"**~~ | dono | ✅ Decidido: opção A, a folha da Apple |
| 19a | **Build `development` nova no EAS** com este branch, e no iPhone: abrir "Gerenciar assinatura", fazer o 4 e trocar de conta de sandbox com os planos na tela | dono | O código do agente está pronto desde 2026-09-26 ([relatório](2026-09-26-radiant-gerenciar-e-loja-relatorio.md)). Destrava o 4 |
| 5 | **Ask to Buy no StoreKit Testing do Xcode**, no simulador | agente | Primeiro, conferir que o módulo Swift funciona ali; se não funcionar, volta ao dono, pelo grupo familiar no sandbox |
| 3 | **VoiceOver num iPhone físico** (checkpoint e HUD com vidas em recarga) | dono | Ele decidiu fazer. Bloqueia a 1.4 |
| 4 | **Cancelamento pela folha, no aparelho** | dono | Depois do 19a e da build nova. Se a folha também fechar no iOS 27.2, passa ao agente, no StoreKit Testing |

**P2 — relógio longo: começar cedo**

| # | Tarefa | Dono | Por quê |
|---|---|---|---|
| 6 | **F2:** faltam 7 testadores aceitarem | dono | Não bloqueia a 1.4 no iOS, mas os 14 dias só começam com 12. Cada dia parado é um dia a mais no Android |

**P3 — o piloto da L1, que destrava o V3**

| # | Tarefa | Dono | Destrava |
|---|---|---|---|
| 7a | **Corrigir as variantes da amostra:** o item 18, que duplica o 1, e as do decúbito dorsal visto por trás. Mostrar ao dono só os itens que mudaram | agente | O 7b |
| 7b | **Confirmar os itens alterados da amostra** | dono | O 15, depois o teste com 3 a 5 pessoas e a L2 v7 |

**P4 — agente, destravado agora**

| # | Tarefa | Dono | Observação |
|---|---|---|---|
| ~~19b~~ | ~~**Ordem fixa dos planos, com o mensal primeiro**~~ | agente | ✅ Feito em 2026-09-26, junto com o 19a |
| 12 | **Conserto do aquecimento:** parar o fundo animado fora de foco e medir de novo M1 e M4 | agente | FILA, achado 5. Antes do 14, para o aparelho medir a versão consertada |
| 13 | **XP da aprovação do checkpoint** | agente | A tela mostrou "XP total: 90", igual a antes. Conferir se o checkpoint devia dar XP |
| 16 | **Caminho 3 do E2E afirma o estado da L1** | agente | Destravado: a #36 entrou. Detalhe na §4.2 do [prompt (5)](2026-09-25-radiant-prompt-de-continuidade-5.md) |

**P5 — esperando outra coisa**

| # | Tarefa | Dono | Depende de |
|---|---|---|---|
| 14 | **Aquecimento no aparelho:** 5 min fora do carregador, com e sem Reduzir Movimento, anotando as telas visitadas antes | dono, com o agente | Idealmente do 12, numa build `preview` |
| 15 | **Gravar a aprovação** em `L1_TEMPLATE_APPROVAL` | agente | 7b |
| 20 | **Bump para `1.4.0`** | agente | **Por último:** 3, 4 e 5 |

**Depois da 1.4, ou sem prazo**

| # | Tarefa | Dono |
|---|---|---|
| 21 | **SDK 58 com `UIScene`**, até abril de 2027 | agente |
| 22 | **L2 do V3, a v7:** depende do teste do piloto | agente |
| 23 | **Simulador `A5FA5443`:** apagar ou manter. Está com o checkpoint aprovado e 2 vidas | dono |
| 24 | **Ações de um passo:** E3 e IARC, chave do Play (A5), pedido ao INCA, `~/.lmstudio` e Ollama, `checkHeuristics` | dono |

**Qual frente pegar agora:**
- se o dono já tiver confirmado os itens alterados da amostra (7b), grave a
  aprovação (15);
- se não, pegue o **5** (Ask to Buy no StoreKit Testing), que está na P1. A
  mesma configuração deve permitir abrir a folha do 19a no simulador. Depois,
  o **7a** (variantes da amostra); o 12, o 13 e o 16 vêm em seguida. O 19a e
  o 19b ficaram prontos em 2026-09-26, e falta a build do dono. Um por
  conversa.

## 4. Frentes em detalhe

### 4.1. D4: **resolvida em 2026-09-25, às 21:50 — fechada como superada** ([ADR](../../adr/ADR-2026-09-25-amostra-l1-d4-e-planos.md), item 2). O texto abaixo é o registro das opções

**(a) Como representar a exclusão da capa (p1).** O contrato só conhece
`approved` e `needs-review`, e o classificador recusa exclusão aprovada.
- **A. Estado `excluded`**, recomendado. Muda o esquema, o `validate-foundation`,
  o classificador e o `normalize-concepts`, que passa a ignorar excerto
  excluído. O texto continua no disco, com a proveniência intacta.
- **B.** Filtrar na extração. Muda as fronteiras e invalida a classificação.
- **C.** Deixar como está: 1 `needs-review` para sempre.

**(b) O que a D4 ainda bloqueia.** O catálogo do app sai de `ai-bundles.json`,
96 de 96 `approved`, e já leva os 16 conceitos. O V3 não usa essa
classificação.
- **A.** Fechar a D4 como superada pelo V3 e pela auditoria de 2026-08-27.
- **B.** Redefini-la como revisão clínica das 16 lições que estão no ar.
- **C.** Manter como está.

**(c) Vocabulário de radioterapia e quatro excertos.**
- O vocabulário foi medido e não aplicado.
- A medição achou **p31:c1, p31:c2 e p32:c2**, de radioterapia, aprovados pela
  máquina em planetas de física; o **p29:c1** é misto.
- Recomendação: propor destino para os quatro no `review-decisions.json`.
- Detalhe na [medição](../../content/2026-09-25-d4-propostas-e-cascata.md).

**Qualquer mudança na classificação reabre a janela de `Conteúdo/classificação`:**
- num run próprio e anterior;
- na grafia do disco (`Conteúdo` em NFD), conferida com `find`;
- com o motivo escrito no `.loop/project.yaml`;
- e ela fecha em outro run, no fim.

O histórico das aberturas e fechamentos está em comentários no próprio
`project.yaml`.

### 4.2. Aquecimento (itens 12 e 14 da §3)

- **Método que funcionou no simulador:**
  - ficar parado na trilha;
  - medir com `top -l 31 -s 2 -pid <pid> -stats pid,cpu`;
  - trocar Reduzir Movimento ao vivo:
    `xcrun simctl spawn <udid> defaults write com.apple.Accessibility ReduceMotionEnabled -bool <true|false>`,
    seguido de `notifyutil -p com.apple.accessibility.reduce.motion.status`.
- **Para isolar:** meça com `starCount` menor ou sem nebulosas. Faça isso numa
  mudança local de medição, **revertida antes de qualquer run**, ou declarada
  num run próprio.
- **No aparelho, com o dono:**
  - build `preview`, se possível;
  - 5 minutos por condição, fora do carregador;
  - anotar a bateria gasta e a sensação térmica.

## 5. Regras que valem sempre

- **O Loop é o contrato:**
  - rode `git status --porcelain` antes de abrir;
  - abra com `node scripts/loop/abrir.mjs "<descrição>" "${files[@]}"`, com a
    lista em **array** no zsh;
  - confira no `state.json` quantos arquivos foram declarados;
  - feche com `validate` → `step finish` → [`memory write`] → `run close`, uma
    invocação por comando, lendo o `code` de cada envelope.
- **O STATUS tem regra própria:** todo run que o edita **declara também**
  `docs/archive/STATUS_historico.md` e move para lá, **sem edição**, o trecho
  que deixou de valer. Só os links são reajustados.
- **Arquivo novo em `Conteúdo/` não aparece no `git status`:** o
  `.git/info/exclude` local ignora `Conteúdo/`. Os rastreados estão no índice
  como `conteúdo/…`, em minúscula. Adicione com
  `git add -f "conteúdo/<caminho>"`, na grafia do índice, e **não** mexa no
  exclude.
- **Node:** o `loop` roda no 24
  (`export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`); testes,
  builds, Maestro e `eas`, no 20. Confira `node --version`.
- **O gate** é `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`.
  - Cite a suíte inteira.
  - O último número citado no STATUS é **151 suítes / 1434 testes**, no branch
    da #37.
  - Nesta sessão ele só rodou dentro do `loop validate`, que não guarda a
    contagem. **Remeça.**
- **Toda guarda nova precisa ser vista falhando** pelo defeito que nomeia:
  - injete o defeito específico;
  - restaure e confira com `cmp` ou `shasum`.
- **Conferir comportamento no simulador:**
  - toque pelo texto, com flows do Maestro, e **não por coordenada**. Nesta
    sessão a tela rolava entre a captura e o toque, e um toque respondeu uma
    questão sem querer;
  - leia o AsyncStorage do app (`RCTAsyncLocalStorage_V1/manifest.json` no
    contêiner de dados) entre os passos.
- **Metro:**
  - use `preview_start` com um `.claude/launch.json` temporário;
  - apague esse arquivo antes de abrir um run;
  - pare o Metro antes do `loop validate`.
- **Processos:** não liste com a linha de comando inteira (`pgrep -fl`,
  `ps aux`), porque o `mcp-remote` da Brevo carrega a chave como argumento.
  Para achar o PID, use `pgrep -x <nome>`.
- **Push liberado.** Para PR, merge, build de distribuição ou envio à loja,
  pergunte ao dono na própria conversa.

## 6. O relatório

Termine com um relatório curto em `docs/superpowers/handoffs/` e atualize o
STATUS e a FILA na mesma passagem. Separe o medido do inferido, e diga o que
não foi verificado.
