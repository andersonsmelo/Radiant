# Medalhão — execução por subagentes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` para executar os cartões abaixo, adaptada ao contrato Radiant. `writing-plans` orienta esta redação; não autoriza execução nem substitui os gates do dono.

**Goal:** Executar, quando autorizado, o plano integrador revisado por meio de entregas pequenas, com um implementador por tarefa, revisão independente e evidência verificável.

**Architecture:** O [integrador](2026-10-25-medalhao-pendencias-e-fechamento.md) continua canônico para arquivos de produto, requisitos, aceites e comandos técnicos. Este roteiro define despacho, recursos, revisão e recuperação; o controlador mantém um único writer Loop e preserva os gates humanos. O estado vivo permanece em [STATUS](../STATUS.md).

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19, TypeScript, Reanimated 4 pelos hooks de `src/ui/motion.ts`, Skia/Skottie 2.2.12; Node 20.20.2 para app/testes e Node 24.14.1 para Loop. Subagentes pela API `collaboration`; sem nova dependência pressuposta.

---

## 1. Autorização e fontes

Documento de **25/10/2026, America/Bahia**. O pedido “revisado pode escrever o plano de execução inclua skills plugins e mcps necessaario será feito por meio de subagentes” aceita o integrador como base para este roteiro. **A execução não começou; T00 não foi despachada.** Esse aceite não responde G1–G8 nem autoriza atos reservados.

Raiz operacional: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`; branch esperada: `claude/trilha-medalhao-design`. A base documental de referência é `5bc9aae`; remedir HEAD/ref remoto/checks ao executar, sem atribuir a esse SHA o CI de outro. Não trocar de checkout por conveniência nem absorver sujeira alheia.

O controlador lê, nesta ordem: `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md`, `docs/plans/2026-07-27-radiant-launch-roadmap.md`, o integrador inteiro e `docs/superpowers/plans/2026-10-21-trilha-medalhao-indice.md`. Depois consulta a spec `docs/superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md`, ADRs de 21/10 e 24/10, `docs/PRODUCT.md`, `docs/DESIGN.md`, pranchetas e registros finais dos planos 2/3/5/6 conforme a tarefa. Registro corrigido vence exemplo antigo do plano; código medido vence descrição desatualizada, sem revogar decisão de produto.

**Global Constraints — copiar literalmente ao brief e ao revisor:**

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

## 2. Papéis, modelos e capacidade

Revalidar ferramentas e modelos disponíveis no início da execução, sem instalar plugins, pacotes ou baixar CLIs automaticamente. Há **quatro slots, incluindo o controlador**, nesta sessão de planejamento; disponibilidade futura é entrada de preflight.

| Papel/perfil | Modelo e esforço previstos | Uso e limite |
| --- | --- | --- |
| Controlador | Modelo da sessão | Fontes, dependências, gates, Loop, briefs, snapshots, ledger, docs e comandos finais |
| M — mecânico | `gpt-6-luna`, `low`/`medium` | Só mudança de um arquivo com código completo e contrato fechado; não presumir esse perfil para prosa complexa |
| I — integração | `gpt-6.1-sol`, `medium`/`high` | Implementações, inventários e evidência que exigem entendimento da prosa e integração |
| A — arquitetura | `gpt-6-astra`, `high` | Contratos de restauração, política, desenho técnico e decisões de alto impacto |
| R — revisor de tarefa | `gpt-6.1-sol`, `high` | Dois vereditos separados: conformidade com a spec e qualidade |
| RF — revisor final | `gpt-6-astra`, `high` | Revisão ampla independente por plano, com evidência nativa e gates pendentes |

Cada tarefa recebe **implementador novo**; correções 1–3 retomam esse agente por `collaboration.followup_task`. Rodadas 4–5 usam agente novo e perfil superior ao que travou; se já estava no mais forte, manter o teto, fornecer diagnóstico novo e registrar a limitação, sem inventar modelo. Revisores nunca são o autor do diff. O controlador não delega a um trabalhador a escolha/abertura de seu revisor.

`collaboration.spawn_agent` com modelo/esforço explícitos exige `fork_turns: "none"`. Enviar caminhos de artefatos e contexto mínimo, não histórico da conversa. Usar `send_message` para esclarecimento ao agente ativo, `followup_task` para nova rodada, `list_agents` para reconciliação e `wait_agent` em espera limitada, com atualização ao usuário em até 60 segundos. As ferramentas `collaboration.*` são chamadas diretas, fora de `functions.exec`; não existem como `tools.*` nesse executor. `functions.exec` orquestra `exec_command` e MCPs. Não criar chats pelo `create_thread` para estas subtarefas.

No máximo um implementador altera produto. Leitores podem pesquisar em paralelo **escopos distintos**, usando os slots restantes; fechar seus relatórios antes de modificar o objeto que mediram. O revisor recebe snapshot congelado após o implementador parar de escrever. Não paralelizar implementação e revisão do mesmo arquivo.

## 3. Skills, plugins, MCPs e CLIs

Carregar apenas as skills aplicáveis e fazer busca limitada de observações OPEN por nome exato. A disponibilidade de um catálogo não autoriza instalar nada. Se recurso essencial faltar, registrar impedimento específico e avançar nos independentes; recurso opcional admite ferramenta equivalente já disponível.

| Código | Skill/recurso | Quando e como aplicar |
| --- | --- | --- |
| C | `lean-task-start`, `using-loop`, `loop-development`, `task-observer`, `superpowers:subagent-driven-development` | Controlador: objetivo concreto, tier proporcional, evidência de conclusão; memória/contexto e escrita supervisionada. Observer só Tier 2/3/sinal reutilizável, busca focada e regras de log |
| P | `writing-plans` | Somente replanejamento delimitado se fato novo invalidar um passo; não reabrir design aprovado |
| T | `superpowers:test-driven-development`, `superpowers:verification-before-completion` | Produto: vermelho específico preservado, mínimo verde, evidência antes de conclusão. Resolver a instalação local das skills antes do uso; documentos usam contrato documental, não TDD artificial |
| U | `ui-ux-pro-max`, `impeccable`, `design-taste-frontend` | Hierarquia, estados reais, texto máximo, safe areas; spec/tokens Medalhão prevalecem. Confirmar skill instalada; não bloquear execução por catálogo opcional ausente |
| A | `animate-expo` em `/Users/anderson/.codex/skills/animate-expo/SKILL.md` | Só animações nativas necessárias, pelos hooks existentes; hooks no topo e pose preservada ao reduzir movimento |
| L | `text-to-lottie` | Só correção comprovadamente necessária de asset existente; confirmar disponibilidade e Skottie oficial, sem nova direção artística |
| N | Build iOS Apps / XcodeBuildMCP | Inspeção e captura de app existente compatível, com UDID explícito; não construir ou instalar por automatismo |
| G | GitHub | Consulta de PR e checks vinculados ao SHA medido; não concede merge/push |
| D | Context7 | Só dúvida real de API; consultar documentação da versão instalada, nunca migrar para a versão mais recente por sugestão da skill |

`C` aplica-se à coordenação de todas as entregas, sem recriar sessão/run por trabalhador. Uma sessão de cérebro ativa e no máximo um writer para o objetivo corrente; fechá-los explicitamente e separadamente. Entregas posteriores abrem sua própria transação após a anterior fechar. Para consultar cérebro, usar exclusivamente CLI Loop e ler `00 Radiant.md` pelo mecanismo configurado.

| Necessidade | Ferramenta disponível/prevista | Limite de prova |
| --- | --- | --- |
| Shell local | `functions.exec` → `tools.exec_command` | Git, Loop, Node, `rg`, Maestro, `adb`; executar no diretório e versão de Node declarados |
| iOS existente | `mcp__xcodebuildmcp__session_show_defaults`, `snapshot_ui`, `screenshot`, `launch_app_sim`, `record_sim_video`, `stop_app_sim` | Redescobrir nomes/esquemas completos; defaults não substituem confirmar destino. Não chamar build/install por tag de plugin |
| Android | CLI `adb`, Maestro e `dumpsys gfxinfo ... framestats` | Nenhum MCP Android nativo confirmado; confirmar AVD/serial e binário antes de medir |
| PR/CI | `mcp__codex_apps__github_fetch_pr`, `mcp__codex_apps__github_fetch_commit_workflow_runs` | Consultas; `gh` já instalado pode ser fallback. Check de SHA anterior não comprova HEAD |
| Documentação API | `mcp__context7__resolve_library_id`, `mcp__context7__query_docs` | Consulta condicional, versão explícita SDK 54/RN 0.81.5/Skia 2.2.12 |
| Mostrar resultado | `mcp__codex_app__open_in_codex`, `mcp__codex_app__attach_artifact` | Painel/PR real; anexar PR trabalhada quando aplicável, sem criar PR fictícia |
| Web/prancheta/Storybook | Browser/CUA/DevTools, se necessário | Comparação web ou fallback justificado; screenshot web não prova renderização nativa |

O Instalador de Apps para iOS só entra numa futura instalação especificamente autorizada com binário conhecido. HyperFrames, GSAP/animate DOM, threejs-loaders e expo-ui de SDK posterior não são runtime nem requisitos desta execução. Não usar `npx` para obter ferramenta faltante: os comandos do integrador pressupõem binário local instalado.

## 4. Preflight, ledger e briefs

Antes de executar, confirmar instrução de execução posterior, raiz/branch/HEAD, Git status, histórico recente, autores paralelos, contrato atual e gates existentes. Produzir a tabela SDD: uma linha por tarefa verificando coerência interna, e uma por par que compartilhe arquivo/interface, com produtor/consumidor, conflito e resolução. Isso é parte de T00, não foi feito por este documento.

Casos obrigatórios: T04/T04a/T05 compartilham player/registro; T09/T10 transferem entrada de meta; T01/T17 compartilham baseline; T11 pode exceder binário existente; T18/T20/T21 compartilham pressupostos de catálogo. Ruling resolve detalhe técnico reversível, com motivo/custo de erro; nunca substitui decisão clínica, de produto ou autorização G1–G8.

Workspace previsto deste roteiro: `.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/`. O controlador verifica `sdd-workspace` e a política antes de gerá-lo. Declarar cada ledger, brief, relatório, snapshot, log e documentação na abertura do run quando não houver exclusão exata comprovada; não criar artefatos ignorados fora do escopo por suposição. Não apagar este workspace automaticamente ao terminar.

Primeira linha do ledger: `# SDD ledger — plan: docs/plans/2026-10-25-medalhao-execucao-subagentes.md`. Campos por entrega: Task N/Txx, estado, gate, HEAD/BASE_TASK/BASE_CONTINUACAO e mapa BASE_PLAN, arquivos próprios, identidade do agente, brief/hash, snapshot/hash, testes e saídas, vereditos, rodadas, rulings, evidência nativa, run/sessão e commit final. Conservar minutas e evidências materiais em documentação versionada apropriada; o ledger local não é novo STATUS.

Estados: `pending` → `ready` → `in_progress` → `implemented` → `reviewed` → `validated` → `closed`. `blocked(gate)` identifica a parte impedida; testes ou UI aprovados parcialmente ficam descritos, sem promover o todo. `closed` exige transação encerrada, evidência registrada e commit do escopo; não equivale a aceite humano, produção ou loja. Usar a linha SDD `Task N: complete` **só** quando o aceite técnico inteiro da tarefa for atendido; ler gates separadamente.

Antes de cada despacho registrar `BASE_TASK=$(git rev-parse HEAD)`. Fixar `BASE_CONTINUACAO` no começo desta execução; ela não é base suficiente para revisar planos já implementados. Em T00 construir o mapa `BASE_PLAN[2|3|4|5]`, com SHA anterior à primeira implementação pertinente de cada plano, fonte desse limite, commits esperados, arquivos cobertos e hashes dos pareceres/pacotes anteriores. Conferir `git merge-base --is-ancestor <base> HEAD` e que `git log <base>..HEAD` contém cada commit pertinente registrado no plano; cruzar a lista de arquivos com o escopo e os requisitos integrais. Se a base não alcançar toda a implementação, não despachar revisão ampla parcial: resolver a base ou usar o pacote integral descrito na seção 8. Registrar no ledger o mapa, critérios e resultados dessa conferência; não escolher `5bc9aae` automaticamente para planos 2/3. Arquivos próprios devem ter baseline conhecida e sem mudanças alheias. Se houver conflito, delimitar entrega/checkout antes do run, sem restaurar trabalho de outro. A lista de arquivos vem literalmente do integrador mais consumidores medidos e artefatos do controlador; nunca declarar pasta inteira por conveniência.

Os headings `### Task 1:` a `### Task 24:` abaixo são compatíveis com `scripts/task-brief`. O helper reconhece os números, mas só encerra a extração ao encontrar outro `Task N`: no último cartão pode carregar também as seções 7–9. Portanto, cortar a extração no próximo heading de nível igual/superior ao cartão, ignorando headings dentro de blocos de código; isso ainda não basta para um brief completo. O controlador deve:

1. Gerar em caminho temporário único pelo `task-brief PLAN_FILE N OUTFILE`, aplicar o corte de heading descrito acima e conferir início/fim do cartão, especialmente Task 24; nunca sobrescrever brief existente antes de validar resultado não vazio e ID correto.
2. Acrescentar a seção **literal e inteira** `### Txx — ...` do integrador até o próximo heading de nível igual/superior, incluindo T04a; validar exatamente uma ocorrência. Não extrair T04 quando solicitado T04a.
3. Acrescentar Global Constraints, rulings aplicáveis, recursos da tarefa e a linha de comandos focais de §9 do integrador, com diretório/Node/resultado esperado. Leitura adicional deve ser recorte necessário do plano original/serviço, não as 800 linhas do integrador.
4. Registrar hashes e referências das fontes, confirmar ausência de truncamento e então publicar `task-N-brief-r1.md`. O revisor recebe o **mesmo** brief; decisão posterior cria revisão identificada, entregue aos dois.

Template do despacho: “Você é o implementador de Txx. Leia primeiro `<brief>`: requisitos exatos. Ownership: `<lista fechada>`. Não está sozinho; preserve alterações alheias. Interfaces anteriores: `<somente as usadas>`. Run do controlador: `<id editing>`. Sem subagentes, writer, commit/push ou ações externas. Relatório completo em `<report>`; devolva DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED, arquivos, resumo dos testes e riscos.”

Relatório: requisitos atendidos/pendentes; arquivos alterados; comando/cwd/Node e evidências vermelho/verde; injeções específicas; self-review; evidência nativa e limites; preocupação/gate. Campos runtime (run ID, UDID, serial, SHA) vêm da ferramenta que os fornece, têm tipo/identidade conferidos e consumidor declarado; ausência ou divergência bloqueia só a ação dependente. Não inventar valor para preencher template.

## 5. Revisão antes do commit e correções

O helper `review-package PLAN BASE HEAD` exige commits. **Não usá-lo na primeira revisão pré-commit**, quando BASE e HEAD podem ser iguais: isso produziria pacote vazio. O integrador exige validação/fechamento antes do commit final; preservamos essa ordem e usamos snapshot de trabalho verificável.

O controlador pausa escrita, registra HEAD, status e lista exata própria. Gera pacote único por rodada com: brief/hash, BASE_TASK, diff completo dos arquivos rastreados (`git diff -U10 BASE_TASK -- <arquivos próprios>`), diff de cada arquivo novo (`git diff --no-index -U10 /dev/null <arquivo>`, código 1 significa diferença), deleções, renomes, stat e manifest de caminhos/tipo/tamanho/SHA-256. Binários precisam de hash e link/captura inspecionável. Novo arquivo não pode desaparecer porque `git diff` não mostra untracked.

Guardar cópia imutável dos arquivos de texto de cada snapshot, preservando caminhos relativos; deleção fica no manifest. Confirmar pacote não vazio quando há mudança, lista do manifest igual à união de mudanças próprias e hashes iguais aos arquivos revisados. Se já houver índice alheio, não mexer nele para montar pacote. Alternativa: staging pelo controlador **somente de arquivos/hunks próprios**, com manifest e `git diff --cached -U10`; jamais `git add -A` ou restauração para “limpar” a revisão.

Revisor recebe caminhos do brief, relatório e pacote, mais constraints literais. Deve devolver `Spec: PASS/FAIL` e `Qualidade: APPROVED/CHANGES_REQUIRED`, achados com prioridade/arquivo/linha/evidência e requisitos não verificáveis. Não repetir testes sobre os mesmos bytes sem hipótese concreta; conferir evidência do autor e pedir reprodução focal quando insuficiente. “Cannot verify from diff” precisa de resolução explícita do controlador antes de completar.

Cada correção gera **snapshot completo novo** contra BASE_TASK e delta verificável contra o snapshot visto antes (`git diff --no-index` entre cópias dos arquivos, incluindo adições/deleções). Revisor recebe ambos e a lista literal dos achados: re-revisão verifica correções e regressões introduzidas pelo delta, sem reiniciar auditoria ampla. Registrar hashes anterior/novo e rodada; não usar `HEAD~1` como atalho.

Rodadas 1–3: `followup_task` no implementador original, achados literais e testes que cobrem a mudança. Rodadas 4–5: implementador novo, perfil escalado, breve com tentativas anteriores pelo caminho do relatório. Controlador nunca corrige produto. Após cinco rodadas, parar esse ciclo e adjudicar com justificativa; seguir apenas tarefas independentes.

Achado real P1/P2 que sustenta comportamento/segurança/dependência não vira `complete` por ser “parked”. Mantê-lo bloqueando o aceite e os consumidores; registrar menor correção necessária ou decisão que falta. Observação realmente menor pode ficar adiada com responsável, custo e revisão final. Ruling técnico não apaga falha real nem consome gate humano.

## 6. Cartões de despacho

Cada cartão herda `C`, constraints e ritual acima. Revisor `R` é independente; `RF` aplica-se onde indicado. Arquivos/aceite/comandos de produto são os da seção Txx do integrador incorporada ao brief, sem duplicação neste roteiro. “Nativo” significa `N`/ADB/Maestro somente com app compatível e cenário permitido.

### Task 1: T00 — Reconciliar a base

- **Dono:** I; **revisão:** R. **Skills:** C, P se divergência; **recursos:** Git, Loop, G, CLI local.
- **Pré-requisito:** autorização posterior para executar. **Saída:** base/checks do mesmo SHA, contratos/prazo/dependências conferidos, scan SDD e ledger; zero execução de produto ou acesso ao reservado.

### Task 2: T01 — Guarda AST e vocabulário

- **Dono:** I; **revisão:** R. **Skills:** T; **recursos:** Node 20, AST helpers, contratos locais, `rg`.
- **Pré-requisito:** T00. **Saída:** domínio/exclusões explícitos, fixtures vermelhas específicas, guarda no quality e consumidores Maestro coerentes; baseline por arquivo para T17.

### Task 3: T02 — HUD

- **Dono:** I; **revisão:** R. **Skills:** T, U, A se pulso afetado; **recursos:** Jest, nativo.
- **Pré-requisito:** T00/T01. **Saída:** coração+número e infinito sem mudar economia; estados reais e prova visual nos dois sistemas.

### Task 4: T03 — Boas-vindas

- **Dono:** I/high; **revisão:** R. **Skills:** T, U; **recursos:** Jest, `taskpolicy`, nativo; D só dúvida de API.
- **Pré-requisito:** T01 e modelos existentes reconciliados. **Saída:** primeira interação com bancada, saída/replay/retomada e conclusão única preservados.

### Task 5: T04 — Abertura, explicação e retorno da aula

- **Dono:** I/high; **revisão:** R. **Skills:** T, U, A se necessário; **recursos:** Jest, `rg`, nativo.
- **Pré-requisito:** T01; consumidores atuais enumerados. **Saída:** medalha/Pixel/feedback e imagem crítica conforme integrador; nenhum renderizador novo por suposição, sem XP por deep link sem nó.

Registro da entrega T04 em 27/10/2026: [evidência e limites](../evidence/2026-10-26-medalhao-t04.md),
commit `e522984`, revisões R2/R4 e Loop15/15. CI do SHA aprovado; writer e
sessão encerrados. Continuação: Task 6/T04a. O [STATUS](../STATUS.md)
permanece a referência de estado vivo; gates humanos não foram consumidos.

### Task 6: T04a — Dublê global Skia e import estático

- **Dono:** I/high; **revisão:** R. **Skills:** T; **recursos:** Jest/contratos, D condicional.
- **Pré-requisito:** T04 estabilizada no registro. **Saída:** seis testes consumidores e dublê cobertos; falha de compilação/uniformes/fallback exercitada; sem alegar prova de shader real.

Registro T04a em 27/10/2026: implementação I/high e revisão independente R/high
R1 aprovadas (Spec PASS/Qualidade APPROVED), 7 suítes/184 testes e sete
mutações detectadas; validação final configurada **15/15** em ciclo único,
run `run-1793114254111-2eade8f7`.
[Evidência](../evidence/2026-10-27-medalhao-t04a.md). Próximo cartão: Task7/T05
com os pré-requisitos técnicos T04/T04a satisfeitos, sem consumir G1–G8.

### Task 7: T05 — Resultado

- **Dono:** I/high; **revisão:** R. **Skills:** T, U, A; **recursos:** Jest, contratos de movimento, nativo.
- **Pré-requisito:** T04/T04a revisadas. **Saída:** tema/contexto em todos os consumidores, cunhagem sem prêmio duplicado, régua de estrelas e ausência de XP inventado; revisão sem Pixel.

Registro T05 em 27/10/2026: implementação e revisões de código/nativo
aprovadas; P2 de texto ampliado corrigido e medido em iOS/Android. R7 aprovou
uma linha de compatibilidade do mock consumidor após gate inicial13/15.
Gate final15/15 no writer substituto, primeira validação dele/segunda do
objetivo; produto/nativo freeze3 preservados. Checkpoint pré-fechamentoCLI/Git;
confirmações finais no ledger e relatório da entrega.
[Evidência e limites](../evidence/2026-10-27-medalhao-t05.md). PróximaTask8/T06.

### Task 8: T06 — Recompensa

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, contrato Maestro, nativo.
- **Pré-requisito:** T01. **Saída:** estados inválido/bloqueado/coletado com saída, sem alterar elegibilidade ou idempotência.

Registro T06 em 28/10/2026: implementação congelada, R5 código e R6 nativo
aprovados no escopo medido; focal final4/100 e Maestro contrato39/39. iOS live
mais máxima inicial e Android normal/máxima inicial legíveis. Android live
não validado; P3 da cauda permanece para T17. Loop final15/15 aprovado em
ciclo único. Fechamento/brainCLOSED e commitc694f95/CI246151SUCCESS confirmados no preflightT07; Task9 encerrada no núcleo em `85ebf01`; CI247/152 SUCCESS confirmado em28/10.
[Evidência](../evidence/2026-10-27-medalhao-t06.md).

### Task 9: T07 — Fila de revisão

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, inspeção nativa.
- **Pré-requisito:** T01 e `useReview` atual lido. **Saída:** fila/origens verdadeiras, sem Pixel, vida única e resposta persistida preservadas.

Registro28/10: T07 implementada, R2 código e R3 nativo aprovados para o núcleo;
focal4/52, contrato40/40, filareal/resultado/vazio em iOS/Android. P2 compartilhado
PushOptIn máxima iOS bloqueia aceite global e segueT17; Androidlive/resultmax
não validados. Loop final15/15 em ciclo único, writer/cérebro CLOSED e commit
`85ebf0153840d503e6fcd70532529896e8bcc29f` publicado, com CI247/152 SUCCESS
no mesmo SHA. Reconciliação documental em28/10; Task10/T08 retomada posteriormente
na mesma data, conforme registro abaixo. Os aceites humanos e de layout global permanecem pendentes.
[Evidência](../evidence/2026-10-28-medalhao-t07.md).

### Task 10: T08 — Avaliação

**Núcleo implementado/revisado/validado em 28/10/2026:** implementador I/high, R1 apontou P2 de identidade e a R2 SpecPASS/QualidadeAPPROVED confirmou a correção pelo autor;61 focais/45 sob CPU limitada. Fluxo real iOS/Android medido; R3 aprovou o núcleo medido (BOUNDED); Loop final15/15 em um ciclo. Nenhum gate humano consumido.

- **Dono:** I/high; **revisão:** R. **Skills:** T, U; **recursos:** Jest, scripts de checkpoint, Maestro/nativo.
- **Pré-requisito:** T01 e catálogo vigente. **Saída:** estados e contagem reais, commit único, erro deliberado; scripts de checkpoint não apresentados como FPS da bancada.

**Fechamento:** o run original validou15/15, mas `step finish` reprovou pelo
arquivo gerado `expo-env.d.ts` fora do escopo. Run original encerrado sem sucesso.
Regularização autorizada em28/10, no run `run-1793222933625-71a18c69`, com as31
alterações próprias já na baseline, sem alteração de produto ou política.
Resultados dos dois runs e limites constam na evidência T08. Não atribuir
supervisão retroativa nem usar o15/15 antigo como gate do novo run.

### Task 11: T09 — Perfil

**Núcleo implementado/revisado em29/10:**14 arquivos; código R1 PASS,60 focais normal/CPU,163 consumidores/105 contratos. Nativo R2 BOUNDED/APPROVED_CORE_BOUNDED no escopo medido; Android ao vivo/retorno e gravação nativa de meta sem aceite. Semana positiva só lastActiveDate válida, contador separado e G5 preservado; editor até T10. Writer `run-1793270590053-a44fc62a`; final configurada15/15 após fix1, dois ciclos no mesmo writer. [Evidência T09](../evidence/2026-10-29-medalhao-t09.md).

- **Dono:** I/high, consultar A se contrato técnico complexo; **revisão:** R. **Skills:** T, U; **recursos:** serviços locais/Jest, nativo.
- **Pré-requisito:** T01; G5 para alteração do significado da semana. **Saída:** conquistas reais e desconhecido distinto de ausência; manter entrada de meta até T10 substituí-la.

### Task 12: T10 — Ajustes

**Núcleo implementado/revisado em29/10:** R1 reprovada por dois P2 de operações pendentes entre telas; FIX1 aprovada em R2, com ordenação nos serviços existentes sem mudar fórmulas, esquema, consentimento ou política.374testes normais/25suítes,40repetidos sob CPU limitada e105contratos PASS;17mutações causais aceitas. Nativo R3 BOUNDED/APPROVED_CORE_BOUNDED: normal/máxima inicial e Back observados nos dois sistemas; gesto iOS NOT PASS, leitor audível e save nativo sem aceite. P3 dos chevrons legais encaminhado à T17/revisão ampla, não resolvido. T10 publicada em `6266495`, CI252/157 e check-runs SUCCESS no mesmo SHA; writer `run-1793287644499-ac7eb003` e cérebro CLOSED, final configurada15/15 PASS em um ciclo.61nominais/27produto; nenhum merge/release inferido. Janelas56/57 abandonadas em edição, zero finais; sem supervisão retroativa. [Evidência](../evidence/2026-10-29-medalhao-t10.md).

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, nativo; controles já instalados.
- **Pré-requisito:** interface T09 combinada. **Saída:** lista agrupada, entrada de meta acessível, flags reais de backup e destinos preservados; sem instalar expo-ui.

### Task 13: T11 — Assinatura

**Recorte estático validado em29/10:** R3 SpecPASS/APPROVED após fix1 acessível e fix2 raios;48 fluxo final/17 mutações. Loop15/15 no segundo ciclo; primeiro14/15 falhou strict de raios. [G6 local confirmado em 30/10](../evidence/2026-10-30-medalhao-t11-g6.md): novo Debug do commit9a62bca no E262, preços numéricos/moeda recebidos pelo JS e anual/12 exibido. StoreKit Testing, sem compra real/aparelho ou aceite global. [Prompt estático original](../superpowers/handoffs/2026-10-29-medalhao-t11-prompt-de-continuidade.md).

- **Dono:** I/high; **revisão:** RF pelo contrato nativo. **Skills:** T, U; **recursos:** contratos Swift/JS, Jest, D condicional, N limitado.
- **Pré-requisito:** T01; G6 limita prova nativa. **Saída:** preço/moeda explícitos no bridge/adaptador, estados reais; separar implementação/teste estático de validação em binário novo ainda autorizável.

### Task 14: T12 — Vidas

**Núcleo implementado/revisado em30/10:** R2 SpecPASS/APPROVED, P2 de snapshot persistente resolvido por retorno do setter já sequenciado;229focais/7suítes normalCPU,5injeçõesfix1. Final Loop15/15 em um ciclo. [Evidência](../evidence/2026-10-30-medalhao-t12.md). Normal/AX5 NOT_VERIFIED por GUI Simulator.app ausente; texto máximo nativo/aceite global não encerrados. Não marcar Task14 complete integral nem transferir G6 para nova build.

- **Dono:** I; **revisão:** R. **Skills:** T, U; **recursos:** Jest, `rg`, nativo; Maestro integral só T18.
- **Pré-requisito:** T01; chamadores enumerados. **Saída:** ilimitado não abre folha, cinco estados e recarga/revisão preservados, texto máximo conferido.

### Task 15: T13 — Texto máximo e quadro antecipado

- **Dono:** I/high; **revisão:** RF. **Skills:** T, U, A se geometria animada afetada; **recursos:** evidências existentes, Jest, AX5/Android 200% nativos.
- **Pré-requisito:** G1 para aplicar alternativa; G3 para aceite do quadro. **Saída:** escolha documentada e validade geométrica provada; 0/13 não vira alegação de conserto; independentes continuam.

**Recorte preparatório medido em30/10:** dois agentes somente leitura (G1 geometria
e G3 evidência), controlador documental e revisão final independente.
[Pacote concreto](2026-10-30-medalhao-t13-pacote-de-decisao.md). Nenhum escritor
de produto; decisões G1/G3 abertas. Não usar `Task15 complete` integral: aplicação,
prova nativa e aceite seguem pendentes. [Recibos](../evidence/2026-10-30-medalhao-t13.md).

**Decisão posterior em30/10:** Anderson escolheu A+Q1 (“siga conforme
recomendação”). [decisão A/Q1](../adr/ADR-2026-10-30-t13-texto-maximo-e-risco-residual-do-quadro.md). AplicaçãoA entregue/revisada no recorte estático (336/7focais,tipos/lint,
43contratos e RF PASS/APPROVED); nativo0/7NOT_VERIFIED por shell/disco.
Risco residual do quadro aceito só no recorte, observaçãoT18 mantida, sem G3global.
Final configurada15/15 PASS em um ciclo. [Execução A](../evidence/2026-10-30-medalhao-t13-a.md). Sem avançoT14.

### Task 16: T14 — Conteúdo e decisões do player

- **Dono:** I/high; **revisão:** R técnico, dono no conteúdo. **Skills:** T; **recursos:** documentos/ADR, Jest/modelos e fluxos afetados.
- **Pré-requisito:** respostas G2 frase por frase para aplicar/promover conteúdo. **Saída:** código/documento equivalentes, física e repetição preservadas conforme decisão; sem aval, manter desenvolvimento.

### Task 17: T15 — Inventário do plano 4

- **Dono:** I/high; **revisão:** RF. **Skills:** P, revisão documental; **recursos:** `rg`, Git, metadados/consumidores/validadores locais.
- **Pré-requisito:** T00; não precisa de G4 para elaborar proposta. **Saída:** inventário sai/fica, substitutos e política por versão/hash para aprovação G4; nenhuma retirada ou leitura de PDFs.

### Task 18: T16 — Acessibilidade e desempenho

- **Dono:** I/high de evidências; **revisão:** RF. **Skills:** U, A quando pertinente; **recursos:** N, VoiceOver/TalkBack, ADB `gfxinfo`, AVD `radiant-entrada-api34`.
- **Pré-requisito:** componentes finais aplicáveis, binário compatível; G8 para aceite integral. **Saída:** árvore e fala separadas, três rodadas de quadros brutos; defeito abre entrega corretiva delimitada, sem editar produto no run só documental.

### Task 19: T17 — Fechamento visual/técnico

**Priorização de28/10, por Anderson:** correção delimitada do P2 PushOptIn
antecipada antes da T09, por criticidade. Escopo de dois arquivos de produto/teste. Em29/10, código R1 PASS e nativo R2
BOUNDED/APPROVED_CORE_BOUNDED: componente corrigido no Home local medido,53
focais/11 sob CPU limitada; Loop final15/15 em um ciclo em29/10. Review atual e Android
ao vivo não retestados; T17 e gates sem aceite. Evidência P2 datada28/10 conserva
as medições originais e o parecer de29/10.


- **Dono:** I/high; **revisão:** RF dos planos 3 e 5. **Skills:** T, U, A; L só defeito de asset; **recursos:** `rg`, contratos locais, nativo.
- **Pré-requisito:** entregas aplicáveis T01–T16 e suas decisões; gates faltantes impedem apenas aceite correspondente. **Saída:** renome completo, copy zero no domínio, exceções removidas por prova e lote visual corrigido/reconferido.

### Task 20: T18 — Conferência integrada e segundo dia

- **Dono:** I/high de evidências; **revisão:** RF do plano 2. **Skills:** verificação, U; **recursos:** Maestro/N/ADB, registros de binário/Metro e catálogo.
- **Pré-requisito:** layout implementado, compatibilidade medida, cenário naturalmente devido; G1/G3/G6/G8 delimitam aceite. **Saída:** roteiros separados, container reservado preservado e prova legado explicitada; sem relógio/clearState/reinstalação.

### Task 21: T19 — Política e validadores

- **Dono:** A; **revisão:** RF. **Skills:** P, verificação; **recursos:** Loop/Git/CI, inspeção de grafia real.
- **Pré-requisito:** G4 explícito da versão do inventário **e** mudança de política. **Saída:** transação própria validada/fechada antes da consumidora; CI/Loop coerentes e perdas de validação explícitas.

### Task 22: T20 — Recomeço/restauração

- **Dono:** A; **revisão:** RF. **Skills:** T; **recursos:** Jest, fixtures/falhas de persistência, serviços/backup locais.
- **Pré-requisito:** G4, contrato IDs/geração G7 e política adequada; não ativar no reservado antes T18. **Saída:** migração parcial recuperável/idempotente, sem ressuscitar IDs, economia preservada e stores futuros protegidos.

### Task 23: T21 — Retirada/troca

- **Dono:** I/high; **revisão:** RF. **Skills:** T; **recursos:** inventário aprovado, `rg`, contratos AST/catálogo/rotas, roteiros Maestro.
- **Pré-requisito:** G4/G7, T19/T20, conteúdo substituto aprovado e autorização exata de retirada. **Saída:** só dados aprovados retirados, biblioteca preservada, catálogo alcançável e par de roteiros atualizado; legado identificado como histórico.

### Task 24: T22 — Conferência após troca

- **Dono:** I/high de evidências; **revisão:** RF dos planos 2/3/4/5 afetados. **Skills:** verificação, U; **recursos:** Maestro/N/ADB, G e documentação canônica.
- **Pré-requisito:** T21; novo segundo dia naturalmente devido em container separado. **Saída:** aluno novo/migrado/restore/offline provados e revisões finais; pacote ao dono com limites e decisões de distribuição ainda próprias.

## 7. Gates, validação e fechamento

O controlador percorre a ordem do integrador; as pré-condições dos cartões permitem avançar no independente sem esperar decisão restrita. G1 texto/corredores, G2 conteúdo/ADR, G3 arte/quadro, G4 inventário/política, G5 semana, G6 binário, G7 currículo/lote e G8 leitura/desempenho permanecem individualizados. Nenhum timeout de ferramenta ou frase “revisado” é voto nesses gates.

Após cada implementação: vermelho/verde focal e self-review → revisão independente → correções/re-revisão → prova nativa aplicável → registros canônicos pelo controlador → uma validação final configurada → fechamento → commit. O controlador atualiza registro do plano original, índice, FILA 67 e STATUS só pelo delta de sua entrega, sem absorver trechos alheios. Roadmap é reconciliado quando a tarefa correspondente muda de estado.

Antes de abrir: `git status --porcelain`; medir política, caminhos com a grafia do disco, dependências e exclusões. Abrir pelo `node scripts/loop/abrir.mjs "<entrega>" <arquivos exatos>` no Node 24 e conferir `STEP_STARTED`. Em falha `context_ready`, inspecionar envelope/estado e encerrar run órfão pelo contrato público antes de tentar outro; nenhuma escrita enquanto não autorizado pelo estado.

Testes usam Node 20 e os comandos exatos do integrador §9. Tela nova repete focal sob `taskpolicy -b`. Não rodar o quality completo por subagente: ele integra o validador final. Medir `node --version`; guardar comando/cwd/saída, sem reciclar contagens antigas ou chamar suíte parcial de gate completo.

Antes da validação final, encerrar apenas app/Metro/AVD desta entrega, sem tocar processos de outras sessões nem limpar o reservado. Medir `sysctl -n vm.loadavg` e `ps -Ao pid,pcpu,comm -r | head -8`, sem argumentos sensíveis; aguardar carga de aproximadamente 5 ou menos. Não competir com E2E. Rodar no Node 24 sob `caffeinate -i`:

```text
loop validate --run <id>       → exigir VALIDATION_PASSED
loop step finish --run <id>    → exigir STEP_SUCCEEDED e state succeeded
[loop memory write ...]        → opcional, só aprendizado validado, candidato conferido separado
loop run close --run <id>      → conferir code e state closed
loop brain session close --session <session-id> → conferir code/state de sessão encerrada, independentemente do run
```

Executar **uma chamada por vez**, sem `&&`: a CLI pode retornar erro JSON com exit 0. Confirmar argumentos de `step finish`, memória e sessão pela CLI instalada antes de chamar. A configuração atual prevê 15 validadores; após T19 vale a configuração aprovada vigente. Repetir gate somente por falha real/correção; conter sessão de leitura antes da validação se `brain-links` disputar acesso. Memória não é obrigatória; `fechar.mjs` não serve se houver memória ainda a gravar.

Se validação revelar defeito, voltar ao implementador, registrar delta/revisão e repetir somente o necessário para validar os bytes finais. Não fechar como sucesso com gate reprovado. Depois de fechar o run, controlador stageia caminhos/hunks próprios, confere diff, commita e registra SHA; push somente na branch e no escopo de execução autorizado, nunca pelo subagente. Check remoto precisa corresponder ao commit publicado.

## 8. Revisões finais e limites da evidência

RF recebe pacote amplo de cada plano: entrada explícita do mapa `BASE_PLAN[2|3|4|5]`, sua prova de ancestralidade/cobertura, união de entregas/requisitos, ledger, rulings/minors/parked, gates e evidência nativa vinculada ao código/catálogo. Para commits existentes usar `review-package PLAN <BASE_PLAN do plano> HEAD`; acrescentar snapshot completo das mudanças ainda não commitadas, sem omitir arquivos novos. Nunca substituir essa base por `BASE_CONTINUACAO` ou `HEAD~1`.

Se o histórico não permitir um intervalo completo confiável, produzir pacote integral alternativo: conteúdo atual de todos os arquivos pertinentes (inclusive implementação anterior à continuação), manifest com caminhos e SHA-256, matriz requisito → arquivo → evidência, pareceres anteriores com hash, SHA/base e escopo coberto, mais todos os deltas posteriores. Demonstrar equivalência dos bytes ou interfaces/cenários relevantes de cada prova reaproveitada; divergência sem prova exige revisão/medição nova dessa parte. O pacote deve permitir revisar todo o plano sem depender apenas do relato anterior. Registrar no mapa qual método foi usado, caminhos/hashes do pacote e lacunas; lacuna não resolvida impede chamar a revisão de integral. Essa construção é prevista para execução futura, sem reauditoria de produto nesta entrega documental.

Planos 3/5 recebem revisão em T17; plano 2 em T18; plano 4 e planos afetados pela troca em T22. RF pode reutilizar parecer anterior apenas demonstrando que código, catálogo e pré-condições relevantes continuam equivalentes. Plano 6 já revisado não é refeito sem delta; alteração de suas interfaces entra no pacote afetado.

Achados finais entram em **uma onda de correção delegada** e uma re-revisão do delta. Resíduo real que sustenta aceite permanece pendente, mesmo no teto de rodadas; controlador registra a próxima entrega necessária ou decisão do dono. Não declarar revisão final limpa porque as oportunidades de correção se esgotaram.

Jest/dublê Skia comprovam contratos/uniformes/fallback, não rasterização, shader ou custo de GPU. Árvore acessível não prova fala ouvida de VoiceOver/TalkBack. Log de áudio pode provar disparo/ordem, não audibilidade/qualidade. Emulador Debug não prova Release/aparelho físico. Captura/vídeo devem identificar dispositivo, build/binário, SHA/bundle, estado de catálogo, data, cenário e hash do artefato; revisão humana aponta para esse mesmo artefato.

## 9. Retomada e entrega ao dono

Após interrupção/compaction: ler identidade do ledger, último snapshot, estados Loop, Git e relatórios; reconciliar agentes e rodadas. Concluir o passo atômico em curso antes de outro assunto. Nunca redisparar `complete` sem discrepância verificada. Preservar registros e não executar cleanup automático da skill SDD.

Handoff mínimo, preenchido pelo controlador com medidas atuais:

```text
Projeto/root/branch/HEAD, BASE_CONTINUACAO e BASE_TASK; objetivo único e autorização vigente.
Mapa BASE_PLAN[2|3|4|5]: bases, critérios, ancestralidade/cobertura e hashes dos pacotes/pareceres; método integral alternativo quando necessário.
Fontes: AGENTS, política Loop, STATUS, roadmap, integrador, este roteiro e índice.
Estado por Txx; último snapshot/brief/report; agentes e rodada; run e brain session.
Decisões preservadas: Medalhão/Pixel/fingerprint/economia; segundo dia no fechamento.
Escopo e arquivos próprios; mudanças alheias; próximos consumidores e pré-condições.
Evidências: comandos/Node/saídas, reviews, SHA/CI, nativo e limites não verificados.
G1–G8 com autorização literal/versionada; merge/build/EAS/OTA/loja/instalação/retirada/política pendentes quando não autorizados.
Próximo despacho: Task 1/T00 se nenhuma execução ocorreu; senão primeira entrega pronta do ledger.
Entrega esperada: arquivos, evidência, vereditos, gates humanos, estados finais de run/sessão.
```

Não criar agendamento/automação para o segundo dia. Não criar tarefas pessoais ou sincronizações externas por inferência. Layout implementado, layout aceito, transição concluída e pronto para loja são resultados distintos, conforme §8 do integrador. Este documento entrega somente o roteiro para execução futura.
