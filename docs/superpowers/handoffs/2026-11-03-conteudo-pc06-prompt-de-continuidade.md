# Continuidade — conteúdo Radiant após PC06-D

Handoff técnico medido em **03/11/2026, America/Bahia**. É uma fotografia para
retomada; o único estado vivo continua em `docs/STATUS.md`. Não é autorização de
release, aprovação clínica ou delegação de um run aberto.

## Prompt para a próxima conversa

Você vai continuar a execução do plano de conteúdo do Radiant. Trabalhe em:

- Worktree: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`.
- Branch: `claude/conteudo-reinicio-tecnologo`.
- HEAD medido: `dcb681072ddc95ab5e00aa9e8a34a770c9252ad0` (proposta 2).
- O checkout principal não tem o plano. Não troque de branch nem transfira os
  arquivos para ele por conveniência.

**Objetivo único da próxima task:** integrar as prévias locais para torná-las
exercitáveis em uma entrada de desenvolvimento isolada e produzir as provas
nativas/acessíveis/offline elegíveis do PC06. Chame esse recorte de **PC06-E**
para coordenação. Não avance para PC07/PC08/PC09 nesta tarefa.

### Leia e confira antes de editar

1. `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md`, o item de conteúdo da
   `docs/FILA.md` e `docs/plans/2026-07-27-radiant-launch-roadmap.md`.
2. `docs/plans/2026-11-02-planejamento-conteudo-radiant.md`, especialmente
   decisões da seção 0, famílias da seção 3 e execução da seção 13.
3. `docs/CONTENT_PIPELINE.md` e as ADRs
   `docs/adr/ADR-2026-11-02-reinicio-conteudo-e-foco-tecnologo.md` e
   `docs/adr/ADR-2026-11-03-pc05-contrato-piloto-e-identidades.md`.
4. `docs/evidence/2026-11-03-pc03b-revisao-claude.md`,
   `2026-11-03-pc04-pacote-piloto.md`, `2026-11-03-pc05-payloads.md` e os quatro
   relatos `2026-11-03-pc06a-previa-editorial.md`,
   `2026-11-03-pc06b-cena-e-ativos-locais.md`,
   `2026-11-03-pc06c-transicao-conteudo-retirado.md` e
   `2026-11-03-pc06d-renderer-case-decision.md`, todos em `docs/evidence/`.
5. Código atual em `radiant-app/src/features/editorial-preview/`, registro dos
   renderers, `CaseDecisionStepRenderer`, `LessonFlowScreen` e transição em
   `features/content/`. Leia o código; os relatos não substituem a conferência.

Use `lean-task-start` e `using-loop`. Consulte o cérebro pela CLI pública,
confira Git/concorrência e abra seu próprio writer pelo embrulho. Todos os runs
abaixo estão fechados; seus recibos locais não transferem controle de escrita.
Não contorne `PROJECT_BUSY`. Declare a união completa dos caminhos antes de editar.

### Estado comprovado e o que não refazer

A árvore está **suja**, com alterações e arquivos novos de várias etapas ainda
sem commit. HEAD sozinho não contém as entregas PC03–PC06. Preserve tudo que já
existe; não use reset, clean, stash, checkout de arquivos ou commit em bloco.
Não houve commit/push/merge/build/instalação/release dessas entregas.

- PC01/PC02: retirada e proposta 2 já registradas. Catálogo ativo vazio; não
  restaurar exemplos legados, aulas V3 ou amostras retiradas.
- PC03-A/PC04/PC03-B: decisões de produto aprovadas; cinco briefs e M01.01
  completa produzidos, quatro diagramas e revisão técnica/editorial por Claude
  executada. PC04 concluído nesse recorte; quatro aulas ainda precisam de
  autoria integral e checkpoint antes da promoção do lote inteiro.
- PC05: extensão editorial opt-in Q1–Q5, identidades `rtg-2026`, fontes, rubricas,
  alternativas acessíveis, variantes e metadados vinculados a hash. O lote
  continua recusado por quatro lacunas de checkpoint. M01.01 ainda não tem os
  seis aceites por hash. Payload único em
  `docs/evidence/2026-11-03-pc05-payloads.json`.
- PC06-A: `EditorialLessonPreview` e adaptador de material por injeção; ajuda,
  checkpoint, recuperação guiada e tentativa em outro contexto. Sem rota ou
  persistência; callbacks são efêmeros, sem XP, vidas ou aprovação.
- PC06-B: `EditorialPracticePreview`, cena abstrata de colimação e quatro
  diagramas por módulos estáticos. Hashes/dimensões/imports medidos no disco;
  isso não prova empacotamento nem funcionamento sem rede no binário.
- PC06-C: aviso nas entradas retiradas, revisão elegível e retomada protegida;
  histórico preservado sem convertê-lo em conclusões novas.
- PC06-D: sétimo renderer, `case-decision` textual. Contexto e fases opcionais
  decision/reason/support em capítulos explícitos; seleção por ID, confirmação,
  feedback e segundo toque antes da conclusão. Sem correção por palavras-chave
  ou ramificação adaptativa. Imagens em alternativas recusadas. A economia
  existente foi preservada. **O contrato editorial ainda recusa Q6**; o renderer
  não autoriza uma aula ou amplia o publisher.

Recibos locais principais, em `.loop/runs/`:

| Etapa | Writer fechado | Gate final |
|---|---|---|
| PC06-A | `run-1793733495523-85ad88f7` | 15/15, terceiro ciclo |
| PC06-B | `run-1793735875963-ef2cb665` | 15/15, um ciclo |
| PC06-C | `run-1793748470812-ae4f23ac` | 15/15, um ciclo substituto; anterior `run-1793747264755-f7cc7eee` fechado após 13/15 |
| PC06-D | `run-1793749103231-cbf042db` | 15/15, segundo ciclo após corrigir R2 com `layout.stackSm`; memória validada gravada |

PC06-D: 8 suítes/318 testes focados; o diagnóstico completo passou em
214 suítes/2879 testes, mas inicialmente reprovou o gate visual. Após a correção,
visual com zero regressões e gate completo 15/15. O lint global emitiu 22 avisos
em outros arquivos; os oito arquivos da entrega passaram sem avisos na checagem
focada. São números locais da árvore suja, não CI ou commit limpo.

### Decisões que não devem ser perguntadas novamente

- Público: graduação tecnológica em radiologia, depois especializações.
- Piloto vertical de cinco aulas; navegação alternada e manipulação inicial a
  testar; nivelamento para formados no PC08.
- Claude pode fazer a revisão por IA; PC03-B foi efetivamente aceito em 03/11,
  sem alegar qualificação humana ou aprovação clínica.
- Preservar dados/conquistas; aviso de retirada e acesso à nova trilha; nunca
  converter progresso antigo em conclusão nova.
- Separação PC03-A (autorização) / PC03-B (aceite editorial) já aprovada.
- Diagramas: crédito “Radiant — criado com assistência de IA (Codex), 2026” e
  CC BY 4.0 nos direitos que possam ser concedidos, sem autoria humana ou
  exclusividade presumida.
- Bancada: modelo qualitativo de detector 27×33 cm/área relativa, cena abstrata
  nova, alvo artificial de 18 cm e faixa didática 18–20 cm. Não apresentar
  cálculo de dose, espalhamento físico ou protocolo clínico.
- Retirada entra na main somente junto do primeiro lote aprovado; PC09 tem
  gates e autorização próprios.

### Execução e aceite do PC06-E

Primeiro verifique se alguém já implementou este recorte. Se existir, confira
e continue da pendência real. Integre uma entrada explícita de desenvolvimento
usando o material existente; mantenha-a isolada do catálogo/publicação e exclua
conteúdo de teste de rotas/fluxos de produção. Reuse as prévias e os controles.
Não faça uma cópia paralela das aulas nem afrouxe os contratos de promoção.

Cubra M01.01 (aula/ajuda/checkpoint/recuperações), práticas Q2–Q5, a cena abstrata,
transição de entradas retiradas e Q6 textual com cenário sintético separado do
lote editorial. Esse cenário prova o motor, não uma aula aprovada. Confira:

- seleção antes do retorno, confirmação explícita, bloqueio após confirmar,
  contexto/seleção limpos na próxima interação e feedback final antes da saída;
- hotspot por lista de regiões, comparação por nomes acessíveis, ordenação
  por botões, bancada por incremento e Q6 por decisões explícitas;
- texto grande, áreas de toque, rolagem, foco/anúncio do leitor e movimento
  reduzido, separando árvore de UI de experiência real de VoiceOver/TalkBack;
- diagramas sem corte/desalinhamento e recursos locais no binário executado;
- ausência de conversão de progresso ou recompensas na prévia; transição sem
  perda de histórico e sem completar aulas novas;
- offline em execução elegível. Metro servindo JS/imagens não comprova offline
  de um binário autônomo. Registre separadamente qualquer limite do ambiente.

Para testes nativos, inventarie alvo/UDID completo, binário, bridge e Metro antes
de usar. **Preserve o simulador reservado de prefixo `5FD8C926`**, seu container,
relógio e revisão naturalmente devida: não limpar, reinstalar ou usá-lo aqui.
Escolha outro alvo somente dentro da autorização vigente. Não mate processos
alheios. Uma captura ou comando sem erro não substitui a observação do cenário.

Este handoff não concede autorização nova de build, instalação em aparelho,
prebuild, EAS/OTA, App Store, merge ou release. Prepare a integração e o cenário
revisável primeiro; se a prova exigir uma ação ainda não autorizada, apresente
alvo e ação exatos para decisão. Não transforme a falta dessa autorização em
alegação de que a prova passou. Não apague dados reais para criar fixtures.

### Validação e fechamento

App/testes em Node 20.20.2; somente Loop em Node 24.14.1. Use PATH por comando,
confira `node --version` e não deixe o Node 24 vazar para o app.
Para a regressão inicial, no diretório `radiant-app`, execute com Node 20:

```sh
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --runTestsByPath \
  src/features/editorial-preview/EditorialLessonPreview.test.tsx \
  src/features/editorial-preview/EditorialPreviewMaterial.test.ts \
  src/features/editorial-preview/EditorialPracticePreview.test.tsx \
  src/features/editorial-preview/EditorialPracticeMaterial.test.ts \
  src/features/editorial-preview/EditorialLocalDiagrams.test.ts \
  src/features/editorial-preview/AbstractCollimationRenderer.test.tsx \
  src/features/editorial-preview/abstractCollimationScene.test.ts \
  src/features/lesson-flow/renderers/CaseDecisionStepRenderer.test.tsx \
  src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx \
  src/features/content/services/ContentTransition.test.tsx \
  src/features/student-checkpoints/EditorialPilotContract.test.ts
```

Adicione testes focados da integração escolhida. Reproduza guardas novas com o
defeito específico e guarde o recibo vermelho. Antes do gate completo, confira
`visual:qa:strict` se editar UI. Não crie exceção visual para contornar regressão.
O gate é o configurado em `.loop/project.yaml`: app-quality usa
`EXPO_NO_DOTENV=1 CI=1 npm run quality`; `npx jest` sozinho não o substitui.
Não valide concorrendo com E2E. Confira carga (~5 ou menor) e use `caffeinate -i`.
Feche a leitura antes do writer quando necessário para `brain-links`.

Uma validação configurada final por entrega pronta, repetida apenas para corrigir
falha real. Feche via CLI, verificando cada envelope:
`validate → step finish → [memory write, se aprendizado durável] → run close`.
Feche a sessão do cérebro separadamente. Não entregue run aberto por omissão.

Atualize STATUS e referências na FILA/roadmap/plano no mesmo escopo. Informe:
arquivos, comandos, resultados, divergências, alvo/binário e limites de cada
prova, estado do run/sessão e próxima pendência. Não marque PC06 inteiro concluído
sem medir seus critérios; PC07 requer participantes e retenção posterior.

### Sistemas externos e produção editorial

Documento de produção canônico do piloto:
https://docs.google.com/document/d/1-OLHVS-QnG69Gm5EGwV_UslxBj3OP3g9W62GEUvAEUE

O pacote técnico aponta a ele; não copiar a aula completa para Trello/Obsidian.
Trello não foi atualizado neste fechamento e depende de autorização do fluxo.
Não foram criadas tarefas Todoist. Não há nova ação pessoal agendada.
Não editar o vault diretamente; cérebro somente via Loop. Não escrever em
Google Docs sem necessidade e autorização para mudar o documento de produção.

### Fechamento documental desta passagem

Writer documental `run-1793750532874-2b8afc6c`; gate **15/15**, um ciclo,
`VALIDATION_PASSED`. Recibo local `final-validation.json` nesse run.
Passaram 18 testes do contrato documental; 12 caminhos explícitos e links novos
em sete documentos foram conferidos. Código do app não foi alterado neste run.
A sessão de leitura `brain-session-1793750462280-17c3318d` já está fechada.
Nenhum Metro/build/E2E foi iniciado neste fechamento; a porta 8081 não tinha
listener no preflight. Ao reutilizar este prompt, remeça esses estados.
