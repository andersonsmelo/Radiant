# Prompt de continuidade — Radiant, 2026-08-13

Cole o bloco abaixo numa sessão nova. Este handoff é autocontido, mas o
repositório e o Loop continuam sendo a fonte operacional; confira o estado vivo
antes de editar.

```text
Continue o Radiant em /Users/anderson/Developer/Radiant.

Use task-observer e using-loop. Leia integralmente AGENTS.md e, antes de editar:
1. confirme `git status --porcelain`, a branch e o HEAD;
2. abra uma sessão do cérebro e leia o contexto de "H3 first_frame e Task 12";
3. leia docs/EXECUTION_STATUS_2026-08-13.md, docs/FILA.md,
   docs/plans/2026-07-27-radiant-launch-roadmap.md e a seção Gate H3 de
   radiant-app/docs/E2E_RUNBOOK.md;
4. confira runs/branches recentes para não refazer trabalho já fechado.

Estado verificado no handoff:
- branch codex/wave1-hardening-api-smoke alinhada ao origin em 56779ea;
- passagem visual da Home concluída: PRODUCT/DESIGN confirmados, P0-A/P0-B,
  navBlue, HUD vetorial com fagulhas/rachadura e escala corrigida, rótulo visível
  da meta, JourneyMap exclusivo da Galáxia, fala ambiental esporádica do Pixel,
  cinco telas sem emoji de sistema, meta diária em XP com quatro tiers e
  Starfield com movimento/reduced motion;
- Home e Galáxia usam a mesma jornada canônica; não recrie seletor ou mapa na
  Home e não remova novamente o balão inteiro. Ele é ambiental, temporário e
  nunca pode carregar informação funcional;
- commits materiais: 3e6839d, 6e3c594, 1073cb2, 8f92723 e 56779ea;
- último run material: run-1786563770360-5c6c65ca, 13 validadores verdes,
  memória 74ed5300f1ab2ba7628760a6f27e39936ffacf8dc02cdab766a40b3fdc5d505d,
  run fechado;
- GitHub no SHA 56779ea: Radiant App Quality 31634995733 e Radiant API Quality
  31634995737, ambos success;
- nenhum OTA, TestFlight, App Store, submit ou bump de versão foi feito.
  Produção segue off; iOS continua 1.3.1 (7).

Próxima pendência real, na ordem canônica:
1. H3: executar as coortes baseline/active de first_frame com 20 amostras por
   modo, no mesmo binário/aparelho/perfil e em janela de host. Não rode
   `loop validate` junto do E2E. Use a receita do E2E_RUNBOOK, porque sem
   radiant-app/.env.local e o coletor CDP a medição é inválida.
2. Fechar também as evidências ainda abertas de H3 que forem executáveis na
   mesma janela: VoiceOver, TalkBack, segunda falha de checkpoint e ausência de
   efeito duplicado após retomada. Não alegue aparelho físico de tela baixa se
   só houver o simulador SE já validado.
3. Somente após H3, executar H4/Task 12 educacional de checkpoint e reforço.
4. Depois de H4, retomar G3 para remover o bloqueio de lições por vidas. A
   projeção canônica da Galáxia já está pronta; não a refaça.

Regras operacionais que não podem ser relaxadas:
- use `node scripts/loop/abrir.mjs` antes de criar/editar arquivos e declare
  todos os caminhos; git status vem antes do run;
- TDD: o vermelho deve reproduzir o defeito real;
- feche em comandos separados e cheque o `code` JSON: validate, step finish,
  memory write se houver aprendizado, run close. A CLI pode retornar exit 0 em
  erro; nunca encadeie;
- feche a sessão do cérebro separadamente;
- preserve mudanças de outras IAs e não toque produção/lojas sem autorização;
- ao concluir, atualize status e roadmap no mesmo run, faça commit/push e deixe
  a worktree limpa.

Pendência humana de ambiente registrada pelo dono: sudo gem pristine ffi
--version 1.15.5. Não execute sudo sem ele.
```
