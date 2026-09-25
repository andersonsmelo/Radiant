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

## 3. Todas as pendências, por criticidade (2026-09-25, 17:43)

| # | Tarefa | Dono | Estado e bloqueio |
|---|---|---|---|
| 1 | **Merge de #35 → #36 → #37** | dono | Depois vem o `feat/d4-decisoes-de-revisao`, pela PR diária |
| 2 | **VoiceOver no iPhone (4b)** | dono | **Bloqueia a 1.4.** O dono não quer fazer; a alternativa é uma ADR dele aceitando como evidência a árvore de acessibilidade da H4 |
| 3 | **Ask to Buy** no sandbox | dono | Precisa de grupo familiar no sandbox |
| 4 | **Cancelamento** no aparelho | dono | **Bloqueado:** os Ajustes do iOS 27.2 fecham ao gerenciar o sandbox |
| 5 | **Aprovar a amostra do piloto L1** (3 perguntas e o item 18) | dono | Destrava o 6 |
| 6 | **Gravar a aprovação** em `L1_TEMPLATE_APPROVAL` | agente | Depende do 5 |
| 7 | **D4, três decisões** | dono | Ele pediu mais informação sobre (a) e (b); as opções estão na §4.1 |
| 8 | **Aquecimento no aparelho** | dono, com o agente | 5 min fora do carregador, com e sem Reduzir Movimento, de preferência numa build `preview` |
| 9 | **Aquecimento: isolar estrelas de nebulosas** e medir se as abas visitadas continuam montadas | agente | **Destravado.** No simulador, com o método da evidência |
| 10 | **XP da aprovação do checkpoint** | agente | Visto e não investigado: a tela mostrou "XP total: 90", igual a antes. Conferir se o checkpoint devia dar XP |
| 11 | **Caminho 3 do E2E afirma o estado da L1** | agente | Depende do merge da #36; detalhe na §4.2 do [prompt (5)](2026-09-25-radiant-prompt-de-continuidade-5.md) |
| 12 | **Decisões do StoreKit:** "Gerenciar" e troca de plano, ordem dos planos, preço de outra loja | dono → agente | Achados 2 a 4 da FILA |
| 13 | **F2:** faltam 7 testadores aceitarem | dono | Caminho crítico do Android; não bloqueia a 1.4 no iOS |
| 14 | **Simulador `A5FA5443`** | dono | Ficou com o checkpoint aprovado e 2 vidas. Apagar ou manter |
| 15 | **Bump para `1.4.0`** | agente | **Por último.** Depende dos itens 1 a 4 |
| 16 | **SDK 58 com `UIScene`** | agente | Depois da 1.4, até abril de 2027 |

**Qual frente pegar agora:**
- se o dono já tiver respondido a D4 (item 7), aplique a resposta;
- se não, pegue o **item 9**, que é curto e só depende do simulador;
- o item 10 pode entrar numa conversa à parte.

## 4. Frentes em detalhe

### 4.1. D4 (item 7): as três perguntas do dono

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

### 4.2. Aquecimento (itens 8 e 9)

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
