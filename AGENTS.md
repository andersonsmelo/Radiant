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

1. Leia o status canônico mais recente (`docs/EXECUTION_STATUS_*.md` de data
   mais nova) e o roadmap ativo
   (`docs/plans/2026-07-27-radiant-launch-roadmap.md`).
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

   Seis armadilhas do fechamento, todas custaram registro perdido aqui:
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
3. Mudanças de estado operacional (gates, versões, bloqueios) pertencem ao
   status canônico: crie ou atualize `docs/EXECUTION_STATUS_<data>.md` quando
   um marco fechar, e diga qual documento ele substitui.
4. Decisões de produto/arquitetura viram ADR em `docs/adr/` com data e
   decisor; o cérebro recebe a decisão pelo canal de memória do run.
5. Ao encerrar a conversa, feche a sessão do cérebro
   (`loop brain session close`) e relate: arquivos alterados, evidência,
   estado do run e o que ficou pendente.

### O que nunca fazer

- Editar o vault do Obsidian diretamente (o cérebro só recebe conteúdo por
  memória validada de run).
- Repetir uma task do roadmap sem antes checar seu estado atual.
- Deixar trabalho concluído sem sinalização em roadmap/status/ADR — trabalho
  não sinalizado será tratado como não feito pelas próximas sessões.
