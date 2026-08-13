# Prompt de continuidade — Radiant, 2026-08-13

Cole o bloco abaixo numa sessão nova. Este handoff é autocontido, mas o
repositório e o Loop continuam sendo a fonte operacional; confira o estado vivo
antes de editar.

```text
Continue o Radiant em /Users/anderson/Developer/Radiant.

Use task-observer e using-loop. Leia integralmente AGENTS.md e, antes de editar:
1. confirme `git status --porcelain`, a branch e o HEAD;
2. abra uma sessão do cérebro e leia o contexto de "H3, H4 e Task 12";
3. leia docs/EXECUTION_STATUS_2026-08-13.md, docs/FILA.md,
   docs/plans/2026-07-27-radiant-launch-roadmap.md e a seção Gate H3 de
   radiant-app/docs/E2E_RUNBOOK.md;
4. confira runs/branches recentes para não refazer trabalho já fechado.

Estado verificado no handoff:
- branch codex/wave1-hardening-api-smoke alinhada ao origin em 03e16c8;
- passagem visual da Home CONCLUÍDA e verificada. Home e Galáxia usam a mesma
  jornada canônica; JourneyMap e seleção de trilha vivem só na Galáxia; o balão
  do Pixel é ambiental, temporário e esporádico — não o remova e nunca ponha
  informação funcional nele. HUD vetorial, escala dos ícones, meta diária em XP,
  Starfield, rótulo do anel e substituição dos emojis estão fechados;
- H3 MEDIU e não achou regressão, mas NÃO fechou. As duas coortes de
  `first_frame` rodaram em 2026-08-12 (20+20, mesmo binário/aparelho/perfil, em
  sequência): persistência p95 16,8 ms (n=40, limite 75), restauração p95 7,9 ms
  (n=21, limite 100), Home→Lição +10 ms contra 771, `baseline_isolation` limpo e
  NENHUM delta positivo. O veredito é `inconclusive` por
  `measurement-too-noisy`: piso de ruído do baseline 132,6 ms contra teto de
  117,1 ms, porque o macOS cresceu o swap de 2048 para 4096 MB durante a janela e
  a degradação caiu sobre o BASELINE. Logo o delta negativo do candidato é
  dispersão de quem rodou antes, não ganho;
- o coletor CDP e o orquestrador de coortes agora são VERSIONADOS
  (`radiant-app/scripts/checkpoint-cdp-collector.mjs` e
  `checkpoint-cohort-runner.mjs`), com 25 testes e seis mutações provadas. Antes
  disso a receita existia só em prosa e o instrumento era reconstruído a cada
  sessão;
- "ausência de efeito duplicado após o relançamento" FECHOU, com
  `.maestro/student-checkpoint-no-duplicate-effect.yaml`. Contrato Maestro 21/21;
- commits materiais: d4d21de (instrumento), 8ca09af (coortes) e 03e16c8
  (idempotência). Runs Loop: run-1786569447281-441efcf9,
  run-1786575077447-6b656968 e run-1786622015450-e1943354, todos com 13
  validadores e memória validada;
- nenhum OTA, TestFlight, App Store, submit ou bump de versão foi feito.
  Produção segue off; iOS continua 1.3.1 (7).

Próxima pendência real, na ordem canônica:
1. **VoiceOver e TalkBack do H3 foram declarados concluídos pelo dono em
   2026-08-13.** Como o Maestro não dirige leitor de tela, esta é evidência manual
   confirmada pelo dono, não artefato automatizado. H3 ainda depende de duas ações
   do dono: (a) repetir as duas coortes em host silencioso — reinício para zerar o
   swap, Metro pré-aquecido, coortes em sequência; (b) evidência em aparelho físico
   de tela baixa, que o simulador SE não substitui.
2. A decisão de população de `first_frame` **fechou em 2026-08-13**: cada envelope
   declara `cold` ou `resume`; o gate compara exclusivamente 20 `cold` de cada
   coorte e exige 20 `resume` no active como evidência separada de recuperação.
   A segunda decisão ainda bloqueia o verde honesto de H3: "segunda falha invalida
   o checkpoint e volta à Home" NÃO é alcançável por
   E2E neste binário: `inspectLaunch` só cai no caminho de falha com
   `contentVersion` diferente — e ele é `LESSON_CATALOG.version`, embutido no
   bundle — ou com `routeTarget` nulo, estado que os fluxos limpos não produzem,
   porque concluir e pular a apresentação chamam `finish()`. Há cobertura
   unitária em ActiveCheckpointRuntime.test.ts. Decida entre simular a
   atualização de conteúdo (mutar a versão do catálogo entre dois carregamentos
   do Dev Client, orquestrado fora do Maestro) ou aceitar a cobertura unitária e
   tirar o item da lista de evidência executável.
3. Somente depois de H3, executar H4/Task 12 educacional de checkpoint e
   reforço.
4. Depois de H4, retomar G3 para remover o bloqueio de lições por vidas. A
   projeção canônica da Galáxia já está pronta; não a refaça.

Regras operacionais que não podem ser relaxadas:
- use `node scripts/loop/abrir.mjs` antes de criar/editar arquivos e declare
  todos os caminhos; `git status --porcelain` vem antes do run, porque a
  baseline inclui a sujeira que já existia e DESFAZER também conta como mudança;
- TDD: o vermelho deve reproduzir o defeito real, e guarda não provada por
  mutação é indistinguível de teste vazio;
- feche em comandos separados e cheque o `code` JSON: validate, step finish,
  memory write se houver aprendizado, run close. A CLI pode retornar exit 0 em
  erro; nunca encadeie. `loop <cmd> --help` devolve INTERNAL_ERROR — a interface
  real está no `nextActions` do comando anterior ou em dist/src/cli.js;
- não rode `loop validate` junto de um E2E;
- antes de coletar coorte, prove o canal com o controle positivo
  (`--control`) e lembre que ele usa a métrica `positive-control` de propósito:
  o coletor a grava e o parser a ignora, porque a linha reaparece pelo buffer do
  CDP em sessões seguintes e, como `first_frame` de duração zero, inflaria o
  piso de ruído;
- feche a sessão do cérebro separadamente;
- preserve mudanças de outras IAs e não toque produção/lojas sem autorização;
- ao concluir, atualize status e roadmap no mesmo run, faça commit/push e deixe
  a worktree limpa.

Pendência humana de ambiente registrada pelo dono: sudo gem pristine ffi
--version 1.15.5. Não execute sudo sem ele. (Não foi necessária em 2026-08-13:
Maestro, Java e o coletor rodaram sem ela.)
```

## O que mudou desde o handoff anterior

O handoff de 2026-08-12 pedia a execução das coortes de `first_frame`. Elas
foram executadas, e o resultado mudou a natureza da pendência: o problema
deixou de ser "falta medir" e passou a ser "falta uma janela de host silencioso e
duas decisões de desenho". Três coisas que aquele handoff não podia saber:

1. **o instrumento não existia versionado** — a receita descrevia o canal de
   coleta em prosa e a sessão anterior o reconstruíra de forma efêmera;
2. **o controle positivo podia contaminar a coorte que ele autoriza**, porque a
   linha sintética reaparece pelo buffer do CDP e imitava uma métrica real;
3. **as duas coortes não medem a mesma população**, o que invalidaria qualquer
   verde futuro mesmo com o host silencioso.

Evidência: [`2026-08-12-h3-first-frame-cohorts.md`](../radiant-app/docs/evidence/2026-08-12-h3-first-frame-cohorts.md)
e [`2026-08-13-h3-efeito-duplicado.md`](../radiant-app/docs/evidence/2026-08-13-h3-efeito-duplicado.md).
