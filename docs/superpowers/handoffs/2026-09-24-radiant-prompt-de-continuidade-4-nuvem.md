# Prompt de continuidade (4) — sessão na nuvem, 2026-09-24

Você vai continuar o Radiant, um app iOS de treinamento em radiologia (Expo 54 /
React Native 0.81), numa **sessão de IA na nuvem**, sobre o repositório
`andersonsmelo/Radiant` no GitHub. Você trabalha com o dono: ele decide, e
você prepara, confere e executa só o que ele autorizar nesta conversa.

Este prompt **não substitui** o
[prompt (3)](2026-09-24-radiant-prompt-de-continuidade-3.md). O (3) continua
valendo para a sessão local, no Mac. Este (4) cobre só o que dá para fazer sem
o Mac.

## 0. O que você não tem, e o que isso proíbe

- **Não há Mac, simulador, Xcode, Maestro nem iPhone.** Nenhum teste de tela e
  nenhuma build.
- **Não há a CLI `loop` nem o cérebro do projeto.** Os dois ficam no Mac do
  dono. O `AGENTS.md` exige o Loop para toda escrita no repositório, então:
  - **não faça commit, não edite arquivo e não abra PR com mudança sua;**
  - as decisões e medições desta sessão saem **no relatório final** (§4), que
    o dono leva para uma sessão local, onde elas entram no STATUS, na FILA e
    nas ADRs por um run do Loop.
- **Nada irreversível sem um "sim" do dono nesta conversa, para aquela ação:**
  merge, apagar branch e fechar PR. Um "ok" dado em outra conversa não vale.
  Se aparecer um sim sem a pergunta correspondente, pergunte de novo.
- **Não mexa** na frente do dia 2 do E2E: ela roda no Mac a partir de
  2026-09-25 às 11:55 (−03).

## 1. Meça antes de agir

```bash
git fetch origin --prune
gh pr list --state open
git log --oneline -1 origin/main
git log --oneline origin/main..origin/fix/e2e-defeitos-2-e-3 | wc -l
git branch -r --merged origin/main | grep -v -e 'origin/main' -e HEAD | wc -l
```

**Esperado, medido no Mac em 2026-09-24 à noite:**
- **PRs abertas:** só a #32 (`test/e2e-caminhos-dourados-1-4`), com CI verde
  (2 de 2) e `MERGEABLE`, cabeça `b26d762`.
- **`origin/main`:** `ab121ad`.
- **`origin/docs/prompt-continuidade-2026-09-24-2`:** `de0c8be`, um commit
  acima da #32.
- **`origin/fix/e2e-defeitos-2-e-3`:** 13 commits acima da de documentação, e
  a ponta é o commit que acrescentou **este** prompt. Confira pela mensagem com
  `git log -1 origin/fix/e2e-defeitos-2-e-3`.
- **Branches remotos já mergeados na `main`:** 22.
- **Configuração do repositório:** `delete_branch_on_merge` é `false`, e o
  histórico da `main` usa **merge commit** ("Merge pull request #N").

Se algo divergir, pare e mostre a divergência ao dono antes de seguir.

## 2. As tarefas, nesta ordem

### 2.1. Merges, de cima para baixo e travando o SHA (item 2)

As três branches estão empilhadas: a #32 está dentro da de documentação, e a de
documentação está dentro da de fix. Como o repositório não apaga a branch no
merge, a PR de cima **não** é retargetada sozinha. Por isso, cada PR nova sai
**contra a `main`**, depois que a anterior entrou.

1. **#32:**
   - confira que o CI está verde e a cabeça continua `b26d762`;
   - peça o sim;
   - rode `gh pr merge 32 --merge --match-head-commit <sha completo>`.
2. **Documentação:**
   - rode `gh pr create --base main --head docs/prompt-continuidade-2026-09-24-2`;
   - o diff deve ter **um** commit, `de0c8be`, só em `docs/`. Por causa dos
     filtros de caminho, o CI do app não roda para ela, e isso é esperado;
   - peça o sim e faça o merge travando `de0c8be`.
3. **Fix:**
   - rode `gh pr create --base main --head fix/e2e-defeitos-2-e-3`;
   - espere o CI do app (`Radiant App Quality`) ficar verde, e não faça merge
     com check pendente ou vermelho;
   - peça o sim e faça o merge travando a ponta medida no passo 1.

Para o corpo de cada PR, resuma os commits a partir do `git log`. A de fix
contém:
- os defeitos 2 e 3 do E2E;
- o fechamento da H4, com o texto do checkpoint e o texto grande;
- a regra de uma vida por pergunta por tentativa;
- o conserto do perfil `development` do EAS;
- a evidência do StoreKit no iPhone com iOS 27.2;
- os prompts de continuidade.

Os relatórios estão em `docs/superpowers/handoffs/2026-09-24-*`.

**Se o CI de fix reprovar, não conserte na nuvem.** Traga o log do job que
falhou para o relatório. O conserto é local, no Loop.

### 2.2. Decisão do dono: o defeito 1 do E2E (item 5)

- **O defeito:** o aluno reabre a L1, que já está concluída, e sai no meio,
  pela folha de vidas. O cabeçalho cai de "1 de 14" para "0 de 14 etapas", e a
  trilha recomenda refazer a lição em vez do checkpoint.
- **A causa:** `resolveNodeStatus`, em
  `radiant-app/src/features/journey/services/JourneyRecommendationService.ts:46`,
  testa o retomável antes do concluído, e `completedNodeIds` segue intacto. A
  precedência vem do `847a12d`.
- **As duas opções que o dono escolhe:**
  - **A.** O concluído vence o retomável: a lição continua "concluída", e a
    retomada dela não aparece na trilha;
  - **B.** A retomada de uma lição concluída é mostrada sem desfazer a
    contagem, e o cabeçalho continua "1 de 14". Esta é a formulação da FILA.
    Como a trilha mostraria essa retomada fica para o dono detalhar.
- **O que você faz:** apresente as opções sem escolher por ele. Leia o código
  para dizer o que cada uma implica. A decisão vai para o relatório. A ADR e o
  conserto, com teste vermelho antes, são da sessão local.

### 2.3. O dono aprova a amostra do piloto (item 8)

- **O que é:** o snapshot
  `radiant-app/src/features/curriculum-v3/hybrid-l1/__snapshots__/l1TemplateApproval.test.ts.snap`,
  na `main`, com 20 itens e o gabarito marcado. As **3 perguntas** da aprovação
  estão na seção "Revisão local" de
  [`2026-09-23-radiant-licao-hibrida-relatorio.md`](2026-09-23-radiant-licao-hibrida-relatorio.md).
- **Como apresentar:** mostre ao dono os 20 itens, legíveis e numerados, e as
  3 perguntas.
- **O que registrar:**
  - aprovado, reprovado ou aprovado com ressalvas, com a data e o aprovador;
  - para cada item com problema, o número e o motivo.
- **O que não é seu:** gravar a aprovação em `L1_TEMPLATE_APPROVAL` é o item 9
  e é da sessão local.

### 2.4. O dono remede o F2 no Play Console (item 10)

- **O que falta:** a última medição é de 2026-08-03, com 14 contas vinculadas
  e 2 participando. Ela não serve para decidir nada.
- **Onde olhar:** Play Console → Teste → Teste fechado → track `alpha` →
  Testadores.
- **O que importa:** o número de **participando**. O Play exige 12
  participando por 14 dias corridos.
- **O que você faz:** você não acessa o Play Console. Guie o dono e registre no
  relatório os números que ele informar (vinculados, participando e, se
  aparecer, a data em que os 14 dias começaram), com a data da medição.

### 2.5. Apagar os branches remotos já mergeados (parte do item 14)

1. **Liste** os branches com
   `git branch -r --merged origin/main | grep -v -e 'origin/main' -e HEAD`.
   Em 2026-09-24 eram estes 22:
   - `ci/testes-de-conteudo`
   - `codex/curriculum-v3-foundation`, `codex/radiant-1-4`
   - `docs/android-verificacao-chave-eas`, `docs/atualiza-estado-2026-09-23`,
     `docs/consolida-estado-2026-09-23`, `docs/continuidade-2026-09-24`,
     `docs/fila-ressincronizada`, `docs/l2-parecer-v3`,
     `docs/licao-hibrida-piloto`, `docs/radiant-ilimitado-product-ids`,
     `docs/sincroniza-pr18`, `docs/status-repositorio-e-prompt-e2e`,
     `docs/storekit-modulo-local`
   - `feat/1-4-cloudkit-private-backup`, `feat/licao-hibrida-piloto`
   - `fix/ask-to-buy-pendente`, `fix/licao-hibrida-tela`,
     `fix/paridade-caixa-conteudo`
   - `integ/vidas-1-4`
   - `pesquisa/ios27-xcode-eas`
   - `refactor/aposenta-vidas-legado`
2. **Para cada um**, confira:
   - `git merge-base --is-ancestor origin/<branch> origin/main`;
   - que nenhuma PR aberta usa o branch.
3. **Mostre a lista final ao dono** e peça o sim para ela inteira.
4. **Apague** com `git push origin --delete <branch>`, um por vez, e guarde o
   SHA de cada um no relatório, para poder restaurar.
5. **As três branches do item 2.1** também ficam mergeadas depois dos merges.
   Pergunte ao dono se elas entram na limpeza.

A worktree `zealous-shannon-01c8e3` e o simulador `A5FA5443` existem só no Mac
e ficam fora desta sessão.

### 2.6. Decisões opcionais, se o dono quiser tomá-las agora

As duas saíram do teste do StoreKit no aparelho, em 2026-09-24
([evidência](../../../radiant-app/docs/evidence/2026-09-24-storekit-development-iphone.md)):

- **Reembolso:** no sandbox, o pedido só sai de dentro do app
  (`beginRefundRequest`), e o app não tem essa entrada. As opções são tirar o
  item do roteiro ou criar um "Pedir reembolso" no app.
- **O texto para o estado de renovação desconhecido:** hoje, o
  `willAutoRenew` desconhecido vira "Cancelada" para um assinante pagante. A
  pergunta é qual texto mostrar quando o iOS não informa a renovação.

## 3. Pronto quando

- **Merges:** as três PRs estão na `main`, com os SHAs travados e o CI de fix
  verde, **ou** o bloqueio está descrito.
- **Decisões:** as de 2.2 e 2.3, e as de 2.6 se o dono as tomou, estão no
  relatório com data e decisor.
- **F2:** o número de participando, com a data da medição, **ou** "não
  medido".
- **Branches:** os apagados estão listados com o SHA, e os mantidos com o
  motivo.

## 4. O relatório final

Termine com um bloco em Markdown pronto para colar numa sessão local. Separe o
medido do inferido, e diga o que não foi feito. Ele deve trazer:

- **Merges:** o número da PR, o SHA travado e o merge commit resultante.
- **Defeito 1:** a opção escolhida, a data, o decisor e as palavras do dono.
- **Piloto:** o veredito, a data, o aprovador e os itens com ressalva.
- **F2:** os números e a data.
- **Branches:** os apagados, com o SHA de cada um, e os mantidos.
- **Decisões de 2.6,** se houver.
- **Pendências** para a sessão local:
  - registrar tudo no STATUS, na FILA e nas ADRs, por um run do Loop;
  - gravar a aprovação do piloto (item 9);
  - o conserto do defeito 1, com teste vermelho antes;
  - o dia 2 do E2E.
