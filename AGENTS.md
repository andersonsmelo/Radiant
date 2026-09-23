<!-- loop:application-brain:start -->
## Cérebro da aplicação — Loop

- Antes de editar, leia `00 Radiant.md` no cérebro configurado por `.loop/project.yaml`.
- Código, testes e documentação versionada continuam sendo a fonte operacional primária; o cérebro registra proveniência, classes de conhecimento e aprendizados validados.
- Use exclusivamente a CLI pública `loop` para runs, contexto, checkpoints, validação e sessões do cérebro.
- Respeite `context.excludes`, `writePolicy.allowedRoots` e os validadores configurados.
- Não leia nem inclua caminhos sensíveis em contexto, evidência, memória ou relatório.
- Grave aprendizados apenas após validação e feche toda sessão do cérebro explicitamente.
<!-- loop:application-brain:end -->

## Coordenação multi-IA — sinalize o que foi feito

Este projeto é trabalhado por várias IAs diferentes (Claude, Codex, Gemini e
outras) em sessões independentes. Para que nenhuma refaça trabalho já feito,
toda sessão de IA segue este contrato:

### Antes de começar qualquer tarefa

1. Leia [`docs/STATUS.md`](docs/STATUS.md) — o **único** documento de estado
   vivo — e o roadmap ativo
   (`docs/plans/2026-07-27-radiant-launch-roadmap.md`). Não procure o
   `EXECUTION_STATUS_*` de data mais nova: eles estão em `docs/archive/` e são
   histórico, não estado.
2. Abra uma sessão de leitura do cérebro (`loop brain session start`) e
   consulte o contexto da tarefa antes de decidir o que fazer.
3. Verifique se a tarefa já foi feita ou está em andamento: `git log` recente,
   branches abertos, o estado das tasks no roadmap (A1–F7) e as notas de
   decisão do cérebro. O Loop permite apenas um escritor por vez no projeto —
   `PROJECT_BUSY` significa que outra sessão está editando; não contorne o
   lock.
4. Se a tarefa pretendida já estiver marcada como concluída ou decidida, não a
   refaça; reporte o estado encontrado e siga para a próxima pendência real.

### Ao terminar trabalho material

1. Todo run de escrita fecha nesta ordem, e ela não é negociável porque é a
   máquina de estados da CLI:

   ```
   loop validate  →  loop step finish  →  [loop memory write]  →  loop run close
     (validating)      (succeeded)          (memory_written)        (closed)
   ```

   `loop memory write` **exige o run em `state: succeeded`**, e o único comando
   que produz esse estado é `loop step finish` (`src/engine.ts:356`); `validate`
   sozinho deixa o run em `validating`. Gravar memória logo após validar falha
   sempre. O passo de memória é opcional — entra só quando a tarefa produziu
   aprendizado durável; sem ele, `succeeded → closed` é transição válida.
   Nunca edite o vault do Obsidian à mão.

   Sete armadilhas do fechamento, todas custaram registro perdido aqui:
   - **`MEMORY_EVIDENCE_INVALID` tem quatro causas, checadas nesta ordem**
     (`src/memory.ts`): run fora de `succeeded` (linha 26), resumo vazio ou
     acima de **1000 caracteres** (33), evidência ausente ou reprovada (44) e
     lista de evidência vazia (52). A primeira mascara as demais — leia o campo
     de detalhe da resposta (`{ state }`) antes de suspeitar do tamanho. O
     código nomeia a evidência em todos os quatro casos, e em três deles mente;
   - **nunca encadeie os comandos do fechamento com `&&`.** A CLI reporta erro
     no corpo do JSON com status de saída **zero**, então o `&&` não protege:
     em 2026-08-06 a memória falhou, o run fechou em seguida e o aprendizado não
     pôde mais ser gravado. Extraia o `code` de cada resposta e falhe
     explicitamente. Esta regra é sobre o **operador**, não sobre a ordem —
     `memory_written → closed` é transição legal (`src/state-machine.ts:21`), e
     ler esta proibição como regra de sequência foi o que inverteu o ritual e
     travou um run em 2026-08-06;
   - **abra sempre pelo embrulho** — `node scripts/loop/abrir.mjs "<descrição>"
     <arquivo>...`, antes de criar qualquer arquivo. Para fechar, o embrulho
     serve **só quando não há memória a gravar**: `fechar.mjs` encadeia
     `validate` → `step finish` → `run close` e fecha o run incondicionalmente,
     sem passo de memória. Tarefa com aprendizado durável **não pode** fechar
     por ele — depois de `run close` não existe transição para
     `memory_written`, e o aprendizado se perde. Nesse caso rode `validate` e
     `step finish` (soltos ou pelo embrulho até ali), depois
     `loop memory write`, e só então `loop run close`, checando o `code` de
     cada resposta;
   - `loop validate` dispara jest, lint e typecheck. **Não valide enquanto um
     E2E estiver rodando** — mediu-se 2,3× de desaceleração no emulador, e o
     flow morre em timeout que parece defeito do app;
   - **A baseline do run inclui a sujeira que já existia na abertura, então
     DESFAZER também é mudança.** Medido em 2026-08-07, e custou um run inteiro:
     um arquivo rastreado fora de `writePolicy.allowedRoots` foi modificado
     **antes** do `abrir.mjs`, a baseline o capturou modificado, e o
     `git checkout` que o restaurou — feito justamente para deixar o escopo
     limpo — contou como mudança fora de escopo. `step finish` devolveu
     `OUT_OF_SCOPE_CHANGE`, o run caiu em `needs_human` e a memória dele se
     perdeu. O guarda compara **contra a abertura**, não contra o `HEAD`: para
     ele, sujo→limpo e limpo→sujo são o mesmo delta. A regra preventiva é uma
     linha antes de abrir qualquer run:

     ```bash
     git status --porcelain
     ```

     Se aparecer arquivo que você não vai declarar, resolva **antes** de abrir —
     comitando, revertendo ou deixando quieto de propósito. Depois de aberto,
     tanto mexer quanto desmexer custa o run.
   - **Declare o caminho como o SISTEMA DE ARQUIVOS o soletra, não como o git.**
     Medido em 2026-08-07, e custou o segundo run do mesmo dia: o índice do git
     carrega `conteúdo/extrações/…` em minúscula, vindo de um commit antigo; o
     disco soletra `Conteúdo/extrações/…` com maiúscula. Num sistema de arquivos
     indiferente a caixa os dois abrem o mesmo arquivo, mas o guarda de escopo
     compara **texto**: declarado em minúscula, ele reporta
     `OUT_OF_SCOPE_CHANGE` na versão maiúscula do mesmo caminho, e o run cai em
     `needs_human`. Antes de declarar caminho com acento ou caixa divergente,
     confira com `ls` como o disco o escreve — `git ls-files` responde outra
     pergunta.
   - **`context.excludes` NÃO isenta do guarda de escopo — as duas listas
     respondem a perguntas diferentes.** Medido em 2026-08-08, e custou um run:
     `Conteúdo/extrações` está em `context.excludes` **e** fora do git, e mesmo
     assim `step finish` devolveu `OUT_OF_SCOPE_CHANGE` nomeando
     `excerpts.json` — que não é rastreado — e `index.json`. O `excludes` decide
     o que entra no **contexto** montado para a IA; o guarda compara o
     **repositório inteiro** contra a baseline da abertura, e não consulta essa
     lista. A armadilha anterior desta seção diz que `.gitignore` não é
     `context.excludes`; a lição que faltava é que **nenhum dos dois** protege
     do guarda. Só `--files` protege: **declare todo caminho que a operação vai
     tocar, inclusive subproduto local e arquivo não rastreado.**
   - **`INTERNAL_ERROR` de qualquer comando `loop brain*` quase nunca é do
     Loop.** O `catch` final da CLI (`src/cli.ts:647`) converte qualquer exceção
     não-`LoopError` nesse código genérico, com `data: {}` — a causa real fica
     invisível. A causa observada em 2026-08-07 foi o macOS revogar o acesso a
     `~/Documents` no meio da sessão: `scandir` do vault do Obsidian devolve
     `EPERM`, e como `brain-links` é um dos 11 validadores, **`loop validate`
     reprova e nenhum run fecha**. Diagnóstico em um comando: `ls ~/Documents`
     — se der "Operation not permitted", o problema é permissão do sistema, não
     do Loop, e **nenhum run deve ser aberto nesse estado**, porque ele prende
     o lock de escritor sem poder fechar. Correção: Ajustes do Sistema →
     Privacidade e Segurança → Arquivos e Pastas (ou Acesso Total ao Disco)
     para o app que roda o agente; é do dono, o agente não resolve. Para ver o
     erro real por trás do genérico, chame a função direto:
     `node -e "const { brainSessionStart } = await import('<loop>/dist/src/brain-engine.js'); ..."`.
2. Marque no roadmap a task executada (como feito com A1) no mesmo run que
   entrega o trabalho, para que a próxima IA veja o estado sem arqueologia.
3. Mudanças de estado operacional (gates, versões, bloqueios) **editam**
   `docs/STATUS.md`. **Não crie `docs/EXECUTION_STATUS_<data>.md`.** Um arquivo
   novo por sessão foi o que produziu 21 documentos de estado concorrentes, com
   três consumidores apontando para fotos diferentes. Toda afirmação de estado
   carrega a data em que foi medida, dentro do texto — não no nome do arquivo.
4. Decisões de produto/arquitetura viram ADR em `docs/adr/` com data e
   decisor; o cérebro recebe a decisão pelo canal de memória do run.
5. Ao encerrar a conversa, feche a sessão do cérebro
   (`loop brain session close`) e relate: arquivos alterados, evidência,
   estado do run e o que ficou pendente.

### Cinco lições operacionais da semana de 2026-09-08 a 14 (custaram runs)

- **`loop` exige Node 24; o `.nvmrc` de `radiant-app` puxa o shell para o
  20.** Antes de qualquer comando `loop`:
  `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`. Testes e builds
  do app continuam no 20.
- **Caminho com acento nunca é digitado — vem do `find`.** O mesmo arquivo
  passou no `step begin` quando o caminho veio de `find` (NFD, forma do disco)
  e reprovou com `INVALID_SCOPE` quando foi digitado num heredoc (NFC). O
  guarda compara bytes.
- **`abrir.mjs` que falha no `step begin` deixa o run vivo em `context_ready`
  segurando o lock**, e o rastro de erro esconde o envelope. Diante de saída
  não-JSON do embrulho: `ls -t .loop/runs | head -1` e o `state.json` antes de
  tentar de novo. **Nenhuma edição antes de ver `STEP_STARTED`.**
- **`loop memory write` em chamada separada da que gera o candidato.** Gerar o
  JSON e chamar o comando na mesma invocação faz o comando rodar com entrada
  inválida quando a geração falha (resumo acima de 1000 caracteres, por
  exemplo). Aconteceu três vezes na mesma semana. Gere, confira o tamanho,
  depois grave.
- **`docs/STATUS.md` e `docs/FILA.md` sujos por outra sessão não se commitam
  inteiros.** Monte no índice o conteúdo de `HEAD` mais os seus trechos
  (`git hash-object -w` + `git update-index --cacheinfo`) e deixe o resto na
  árvore. Sete commits desta semana saíram assim, sem levar o trabalho alheio.

Uma sexta, de outra natureza: **ao revisar o relatório de outra IA, reproduza
os gates na íntegra e confira cada "X está ligado a Y" no código** — o
relatório honesto ainda é a versão do autor. E ao escrever o relatório, cite a
suíte inteira, não só as suítes tocadas.

### Três lições de MEDIÇÃO, de 2026-09-15 (custaram três relatórios com números falsos)

As três têm a mesma assinatura: tratar a medição local como equivalente à do
gate sem conferir que eram **o mesmo comando, no mesmo ambiente, sobre os mesmos
arquivos**.

- **O gate é `EXPO_NO_DOTENV=1 npm run quality`, e nada menos.** Ele roda
  `jest --runInBand` mais 15 contratos e o `visual:qa:strict`. Rodar `npx jest`
  direto mede outra coisa: em paralelo, sem os contratos, e o paralelismo esconde
  fragilidade de tempo que a banda única expõe. Medido: um teste passou local em
  10/10 execuções paralelas e **reprovou duas vezes no mesmo SHA** no CI.
- **Testes e builds do app são no Node 20; só o `loop` usa o 24.** Já estava
  escrito acima, e mesmo assim exportar o PATH do 24 para os comandos `loop`
  deixa o node **padrão** do shell em 24 — então todo `npx jest`, `npx tsc` e
  `npx eslint` seguinte sai na versão errada sem aviso nenhum. Confira com
  `node --version` antes de citar qualquer número.
- **Árvore suja infla a contagem em silêncio.** Arquivos não commitados de outra
  sessão entram na suíte local e o CI nunca os vê. Medido: 127 suítes / 1021
  testes localmente contra **119 / 979** no conjunto rastreado — 8 suítes e 42
  testes de diferença, e a "baseline" documentada carregava o mesmo vício, então
  reproduzi-la e obter o mesmo número **não** confirmava nada: era uma medição
  repetida, não duas. Para o número real, use worktree limpa:
  `git worktree add --detach <tmp> origin/main`.

**Corolário para este documento e para o `STATUS.md`:** um comando de remedição
**errado** é pior que uma contagem velha. A contagem velha parece velha e
desperta suspeita; o comando errado parece atual para sempre e fabrica o mesmo
número falso para cada pessoa que o seguir. Ao escrever "remedir com", confira o
comando contra `.github/workflows/`, que é a autoridade versionada.

### `INVALID_SCOPE` é caminho fora da política, não caminho mal escrito

`step begin` reprova quando o arquivo declarado está fora de
`writePolicy.allowedRoots` no `.loop/project.yaml`. O envelope nomeia o arquivo
em `data.source`, o que faz parecer erro de digitação ou de acento — não é. A
lista **enumera os tipos de artefato que existiam quando foi escrita**, então o
primeiro artefato de um tipo novo (primeiro módulo nativo, primeiro binário) cai
fora dela por construção. Confira antes de declarar:

```bash
python3 -c "import yaml;print(yaml.safe_load(open('.loop/project.yaml'))['writePolicy']['allowedRoots'])"
```

E **esse erro deixa run órfão segurando o lock**: o `abrir.mjs` já criou o run e
montou o contexto antes de o `step begin` reprovar, então ele fica em
`context_ready` prendendo o escritor único, com o rastro de exceção do Node
escondendo o envelope. Ache com `ls -t .loop/runs | head -1`, confirme o
`state.json` e feche com `loop run close`: `context_ready → closed` é transição
válida. Ampliar a política é decisão do dono, não pré-requisito mecânico — ela
vale para todo agente futuro.

### Quatro lições sobre GUARDAS, de 2026-09-22 (custaram três reprovações seguidas)

A L2 do currículo V3 foi reprovada em cinco auditorias. As três últimas não
foram por prosa mentirosa — foram porque **a correção de um achado produziu o
achado seguinte, e a guarda escrita junto com a correção era cega justamente a
ele**. As quatro regras abaixo saem daí e valem para todo o repositório.

1. **Guarda que só exige DIFERENÇA autoriza o defeito que deveria barrar.** Para
   provar que duas figuras não eram iguais, a asserção exigia que as matrizes de
   transformação diferissem. A correção seguinte transladou as figuras para fora
   do `viewBox` — e "as matrizes diferem" continuou verdadeiro. Toda asserção de
   diferença precisa vir acompanhada de asserção de **validade**: difere **e**
   continua válido.

2. **Mudar QUEM alcança um estado promove as regras dormentes dele ao caminho
   principal, sem editar uma linha delas.** Uma regra que zerava a continuação
   era alcançável só por quem errava o item inicial, e três auditorias não a
   acharam. Bastou o roteamento mudar para ela encerrar a lição para todo mundo.
   **O diff não mostra isso, por construção** — o código culpado não está nele.
   Ao mexer em roteamento, enumere as regras do estado de destino e pergunte, de
   cada uma, que população passa a encontrá-la.

3. **Guarda sobre código-fonte lê AST, nunca texto.** Uma guarda de privacidade
   buscava `/sendDefaultPii:\s*false/` no arquivo e **continuou passando com
   `sendDefaultPii: true`**, porque casava com a menção da opção num comentário.
   Quanto melhor documentada a regra, mais fraca fica a guarda de texto.

4. **Toda asserção nova precisa ser vista falhando — com o defeito ESPECÍFICO
   que ela nomeia.** Derrubar a guarda com um defeito vizinho não diz nada sobre
   o defeito que ela existe para pegar. E declarar em prosa que "o teste falhou
   antes" é **inauditável** para quem revisa, porque um commit único não preserva
   o passo vermelho: registre a execução vermelha como evidência, não a
   afirmação.

**Corolário de teste:** quando o ambiente não consegue inspecionar a saída (Jest
não rasteriza SVG), assevere sobre os valores que a **determinam** — extraindo-os
para função pura se preciso —, nunca sobre um espelho das props embarcado no
componente. Espelho tem conjunto de falhas vazio e passa para sempre. E a
extração precisa ser feita **verbatim primeiro**: um módulo que já nasce
corrigido faz todo teste novo passar de primeira e mata o passo vermelho do
defeito que se queria pegar.

### Quatro lições de 2026-09-23 (quatro sessões paralelas no mesmo dia)

- **Worktree nova não tem o que o git ignora, e três validadores dependem
  disso.** `content-foundation` lê `Conteúdo/extrações/*/pages.json` e
  `excerpts.json`; os `api-*` precisam de `radiant-api/node_modules`. Numa
  worktree limpa eles reprovam por **ambiente**, não pelo diff, e custaram um
  run a cada uma das três sessões que trabalharam em worktree. Provisione
  **antes** de abrir o run (link simbólico para o checkout principal ou cópia)
  e confira `git status --porcelain`. Para desfazer um link, use `unlink` no
  caminho **sem barra final** — `rm -rf link/` apaga o conteúdo do destino.
- **`git switch -c <nova> origin/main` arma o push para a `main`.** Use
  `git switch --no-track -c <nova> origin/main`.
- **Timeout que só aparece no CI se reproduz com a CPU limitada**, não
  repetindo o teste: `/usr/sbin/taskpolicy -b npx jest --runInBand --no-cache
  <arquivo>` prende o processo nos núcleos de eficiência. Medido no CI da PR
  #18: o primeiro teste de um arquivo paga ~450 ms de estreia (JIT da árvore)
  dentro do prazo de 1000 ms do `findBy*`; reprovou 3/3 assim, e o conserto foi
  tirar a estreia da janela (`beforeAll`), não aumentar o prazo.
- **Autorização para mexer no trabalho de outra sessão precisa estar citável
  na sua própria conversa.** Uma sessão comitou arquivos de outra lendo um
  "ok" que não estava no seu transcrito. O conteúdo estava certo, mas a
  autorização não. Diante de um sim sem pergunta correspondente, pergunte.

### O que nunca fazer

- Editar o vault do Obsidian diretamente (o cérebro só recebe conteúdo por
  memória validada de run).
- Repetir uma task do roadmap sem antes checar seu estado atual.
- Deixar trabalho concluído sem sinalização em roadmap/status/ADR — trabalho
  não sinalizado será tratado como não feito pelas próximas sessões.
