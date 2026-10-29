# Prompt de continuidade — Medalhão: T11 Assinatura

Registro de passagem em29/10/2026, America/Bahia. Este é um prompt de execução,
não outro documento de estado vivo. Reconciliar sempre com `docs/STATUS.md`.

## Pedido para a próxima IA

Continue a frente “trilha Medalhão” do Radiant **por subagentes**, começando
pela **Task13/T11 — Assinatura**, ainda não iniciada nesta passagem.
Execute apenas esse objetivo nesta conversa. Você coordena Loop, escopo,
evidências e documentação; um implementador novo altera produto e um revisor
independente confere a entrega. Não refaça T00–T10 ou P2 PushOptIn concluídos.
Não dependa do histórico da conversa anterior nem tome relatórios como prova.

## Checkout e leitura obrigatória

Use explicitamente a worktree existente:
`/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
Branch `claude/trilha-medalhao-design`, PR[#66](https://github.com/andersonsmelo/Radiant/pull/66).
O checkout principal não é o local de implementação desta frente.

Antes de qualquer edição:

1. Leia `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md` e
   `docs/plans/2026-07-27-radiant-launch-roadmap.md`.
2. Leia a Task13/T11 em `docs/plans/2026-10-25-medalhao-execucao-subagentes.md`,
   T11 em `docs/plans/2026-10-25-medalhao-pendencias-e-fechamento.md` e tarefa10
   de `docs/superpowers/plans/2026-10-21-demais-telas-medalhao.md`.
   O integrador prevalece sobre exemplos antigos conflitantes.
3. Confira gitstatus, branch, HEAD, histórico recente, branches e trabalho de
   outra sessão. Preserve alterações alheias. Remeça remoto/PR/CI quando usar
   esses estados para decidir; não assuma que continuam iguais a este registro.
4. Aplique lean-task-start, using-loop e o fluxo de desenvolvimento por
   subagentes. Abra uma sessão de cérebro para T11 e consulte contexto/00Radiant
   exclusivamente pela CLI pública. Não edite o vault diretamente.

Comandos iniciais de leitura, a partir da worktree:

```bash
git status --short
git branch --show-current
git log -4 --oneline
git ls-remote origin refs/heads/claude/trilha-medalhao-design
gh pr view 66 --json state,headRefOid,url
git worktree list
```

## Estado de partida comprovado da T10

Commit funcional `6266495908ec1f0b1da1c267b036f700ad53c5d6`, pai
`c879543c0223e9153380d217cd3ddd180735e1f8`:61arquivos próprios publicados,
árvore limpa e remoto igual na medição. Este prompt entra em commit documental
posterior; confira o HEAD atual e não o reverta ao commit funcional.

CI no SHA funcional: [App Quality252](https://github.com/andersonsmelo/Radiant/actions/runs/40919553938)
e [Content157](https://github.com/andersonsmelo/Radiant/actions/runs/40919553845),
ambos SUCCESS; check-runs123608755546 e123608754643 também SUCCESS.
Reconsultados em29/10,14:27 America/Bahia. Nenhum merge foi autorizado.

T10 entregou lista agrupada, meta em Ajustes após prova equivalente, flags
reais do backup, destinos e replay preservados. R1 encontrou dois P2 durante
operações pendentes entre telas; FIX1/R2 os resolveu com filas nos serviços
DailyGoal/Push existentes e operação composta do lembrete até rollback ou
agendamento. Fórmulas, tiers, cap, esquemaG7, consentimento e janela preservados.
Back continua livre. Não reabra essas decisões para substituir por locks de UI.
As filas duram o processo JS, não cancelam I/O nem garantem transação durável;
I/O indefinido pode manter novo leitor carregando.

Evidência:374testes focais/consumidores em25suítes;40repetidos sob CPU limitada;
105contratos/tipos/strict PASS; lint0erros/24avisos fora do ownership.
17mutações causais aceitas e1tentativa descartada. R2 código PASS/APPROVED.
R3 nativo BOUNDED/PASS núcleo, APPROVED_CORE_BOUNDED; não aceite global.

Consulte os arquivos versionados:

- `docs/evidence/2026-10-29-medalhao-t10.md`;
- `docs/evidence/2026-10-29-medalhao-t10-review.md`;
- `docs/evidence/2026-10-29-medalhao-t10-tests.md`;
- `docs/evidence/2026-10-29-medalhao-t10-native.json` e assets relacionados.

A área local `.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/`
contém ledger/progress.md e recibos detalhados em task12-t10, mas não é exigida
para entender o estado publicado. Não apague a área nem copie estado velho dela
sobre a documentação canônica.

## Limites que não viraram PASS

- Gesto iOS permaneceu em Ajustes em duas tentativas; NOT PASS, sem causa de
  produto demonstrada. BotãoVoltar iOS e BackAndroid retornaram ao Perfil.
- Normal e máxima inicial separada (iOSAX5/Android2.0), quatro opções de meta
  sem seleção e nova montagem normal têm prova delimitada. Não são prova de
  troca de fonte ao vivo, saveMeta ou fala audível de leitores.
- P3 visual: três chevrons dos links legais ficam abaixo/esquerda dos rótulos;
  encaminhado a T17/revisão ampla, ainda não resolvido. AX5 iOS exige muita
  rolagem pelo cabeçalho grande, sem corte persistente nas vistas revisadas.
- G1–G8, G2/T14, G5, P3/T17, segundo dia, aparelho, fala audível, FPS e produção
  continuam separados. G6 limita especialmente a prova nativa da T11.

## T11: objetivo, escopo e aceites

Inventarie primeiro o caminho real **StoreKit/Swift → módulo → tipos JS →
adaptador → tela** e todos os consumidores afetados. Liste a união nominal
completa antes de abrir writer. Use os arquivos enumerados no plano como
ponto de partida, não como prova de que nenhum consumidor adicional existe.

Entregue preço/moeda numéricos explícitos do produto anual no bridge/adaptador,
com formatação correta da equivalência mensal. **Não divida displayPrice** nem
faça parsing da string localizada. Preserve os valores reais da loja, planos,
estados e elegibilidade. Quando indisponível, não invente preço/produto.

Desenhe dois planos conforme Medalhão, anual em ouro, texto legal inteiro e
um botão de compra. Cubra assinante/Gerenciar, carregamento, loja indisponível,
falha, compra pendente, cancelamento, restauração e voltar. Preserve economia,
XP/vidas/sequência/primeira resposta e contratos de assinatura existentes.
Não crie currículo nem altere armazenamento, política ou SDK por conveniência.

Implementador novo I/high, revisor RF para o contrato nativo, conforme plano.
O controlador não faz correção de produto. Vermelho causal antes de código,
testes sobre produtores/consumidores reais com fronteiras controladas;
mutações específicas vistas falhar. Revisão recebe diff integral, adições e
recibos de comandos/cwd/Node/exit, depois correções e revisão focal do delta.

## Loop, validação e autorização

T10 já encerrou: writer `run-1793287644499-ac7eb003` passou15/15 no primeiro
ciclo final do objetivo, STEP_SUCCEEDED → RUN_CLOSED; cérebro
`brain-session-1793274829208-8cca2b02` CLOSED. Originais56/57 foram abandonados
em edição com zero finais por escopo nominal incompleto; sem sucesso retroativo.
Não reutilize nenhum desses runs/sessões. Abra os de T11 somente após preflight.

Use Node24.14.1 para Loop, Node20.20.2 para app/testes. Antes de declarar fontes,
confira allowedRoots, bytes/caixa reais e subprodutos. Abra pelo
`node scripts/loop/abrir.mjs`, aguarde STEP_STARTED e mantenha um escritor.
PROJECT_BUSY é bloqueio real; não contorne lock. Preserve `.loop/project.yaml`
e `radiant-app/expo-env.d.ts`; necessidade de ampliar política é decisão do dono.

Execute focais durante edição, strict/contratos e testes de fluxo sob CPU
limitada quando pertinentes; uma final configurada `loop validate` após revisão,
sem Metro/E2E concorrente, carga baixa e sob caffeinate. O gate de qualidade do
app é `EXPO_NO_DOTENV=1 npm run quality` no Node20; Jest isolado não o substitui.
Não repita a suíte completa sem falha real que justifique nova tentativa.
Feche validate → step finish → [memória validada opcional] → run close,
comandos separados e code JSON conferido mesmo que o exit seja zero.
Feche a sessão do cérebro independentemente; não fabrique aprendizado novo.

A autorização existente cobre implementação local, documentação, commit/push
próprios nesta branch/PR e acompanhamento de CI no SHA exato. Não cobre merge,
build, instalação, EAS, OTA, submissão/loja, alterações de política, dependências,
remoção de conteúdo, reset/clean/stash, relógio, fixtures ou storage privado.
Decisões de produto/currículo/storage/M7/A2 continuam com Anderson.

**Bridge alterado exige binário novo para prova real.** Clientes existentes
1.4.0(3) não demonstram código Swift novo. Contratos/testesJS são evidência
estática; não fazer build/install sem autorização específica. Concluir o
recorte estático com G6 explicitamente pendente é admitido pelo plano.

Não usar, limpar, reinstalar ou alterar o reservado
`5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3`: segundo dia fica no fechamento.
Se houver ensaio nativo autorizado, únicos destinos usuais são
`E262D4C1-99BE-496B-8567-0291C14E6533` e AVD`radiant-entrada-api34`, com serial
novamente associado ao nome. Não usar alvo implícito booted.
Última limpezaT10:CLEAN; apps/Metro/AVD/E262 encerrados,8081livre, fontes
largeiOS/1.0Android restauradas e relidas, animaçõesAndroid1/1/null preservadas,
reverse próprio removido e daemonADB22919 anterior preservado. Remeça antesuso.

Não criar tarefas/mensagens externas ou sincronizar Trello/Todoist/Obsidian/
GoogleDocs automaticamente. Nenhuma ação pessoal nova foi solicitada aqui.

## Relatório final esperado

Diga o que mudou, arquivos/commit/branch, vermelho/verde/mutações, revisão,
validação completa, CI no mesmo SHA quando publicado, limites G6/binário,
gates pendentes, processos e estados separados de writer/cérebro. Atualize
STATUS e tarefas dos planos no mesmo escopo, sem novo documento de estado.
Deixe o próximo objetivo e prompt autossuficiente antes de encerrar.
