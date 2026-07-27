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

1. Todo run de escrita fecha com evidência de validação (`loop validate`) e
   `loop run close`; aprendizado durável vira memória validada via
   `loop memory write` — nunca edição manual do vault do Obsidian.
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
