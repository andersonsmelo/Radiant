# Contexto e continuidade para outra IA

**Consolidação:** 2026-10-17, America/Bahia.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Método:** inventário dos relatórios/pesquisas e conferência de Git/runs locais.
Este documento transmite contexto; o estado vivo é exclusivamente
[`docs/STATUS.md`](../STATUS.md), com execução na [`FILA`](../FILA.md).

Anderson pediu parar por enquanto e consolidar a documentação. O texto abaixo
serve para a próxima sessão **quando ele autorizar a retomada**; não é uma
ordem para iniciar implementação automaticamente.

```text
Você está no Radiant, em /Users/anderson/Developer/Radiant: React Native/Expo,
TypeScript, local-first, para estudantes/técnicos de radiologia no Brasil.
O objetivo desta frente é evolução GLOBAL da trilha Estude e produção escalável.
Não reduza o trabalho a aula piloto. Não confunda estrutura implementada com
currículo amplo produzido, validação clínica ou release distribuída.

Antes de escolher a ação:
1. Leia docs/trilha/README.md, AGENTS.md, .loop/project.yaml, docs/STATUS.md,
   docs/FILA.md (item 54) e docs/plans/2026-07-27-radiant-launch-roadmap.md.
2. Confira git status --porcelain, branch/HEAD, git log recente e branches.
   Abra contexto de leitura pelo Loop e verifique se há escritor concorrente.
   PROJECT_BUSY não autoriza contornar lock, encerrar run alheio ou recuperar lease.
3. Confira a implementação e reproduza os gates importantes. Relatório de outra
   IA não é prova suficiente; as contagens nos relatórios são datadas.

Ponto técnico medido em 2026-10-17:
- Branch codex/radiant-study-improvements; HEAD
  2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b.
- G0–G4 desta frente estão numa árvore compartilhada SUJA, com arquivos novos,
  alterações anteriores e renomes documentais staged de outra sessão. Não houve
  commit/push/merge/build/publicação destas entregas. HEAD sozinho NÃO contém o
  trabalho: inspecione o disco. Não limpe, reverta, stasheie ou comite tudo.
- Os rótulos G0–G8 são do programa global em
  docs/trilha/plano/2026-10-16-loop-global-de-evolucao-da-trilha.md; não são
  homônimos do roadmap antigo de lançamento.

O que já existe — não refaça:
- G0/G1: inventário/auditoria de alcance, registros de apresentação e composição
  de catálogo; contrato de cobertura/multiunidade e testes. As quatro trilhas/
  30 resumos e o lote histórico promovido não significam expansão nova entregue.
- G2: navegação e progressão multiunidade, régua compartilhada de conclusão,
  contadores e prioridade de estudo com conquista opcional. QA nativo separado.
- G3: contrato editorial genérico, validação/promoção de lotes, auditoria,
  integração com painel/CI. Material/fingerprint/revisores/gates têm de casar.
  Não existem aprovações novas nem produção editorial ampla concluída.
- G4: @radiant:item_review_v1 confirma tentativa/agenda por item e versão;
  serialização/deduplicação, primeira resposta/ajuda distintas, fila de até 50,
  migração aditiva de até 50 lições por abertura sem fabricar tentativas.
- G4: avaliações V2 projetam os itens em lote atômico, com recibo pendente/
  confirmado no histórico. Reabertura retoma pendência; aprovação salva pode
  ser concluída sem responder novamente. Histórico antigo não gera backfill.
- G4: revisão ativa seleciona/CONFIRMA antes do gabarito. recordAnswer corrige
  pelo catálogo, confirma journal antes do feedback e espera Continuar. Ajuda
  registra skipped/assistida, sem XP. Retry mantém escolha/data; escolha não é
  persistida no journal. As fachadas antigas de autoavaliação permanecem por
  compatibilidade, sem ligação ao cartão ativo.
- review-answer confere referências temporais contra o cartão. after-interval
  exige tentativa anterior confirmada, vencimento alcançado e >=24 h; é sinal
  operacional, NÃO promoção para delayed-retention nem prova de retenção.
- review-due.yaml e rating-prompt.yaml foram atualizados para selecionar por ID,
  confirmar e continuar. O diálogo Apple segue obrigatório no seu flow.
  Contrato dos roteiros aprovado NÃO é uma execução nativa aprovada.

Decisões de Anderson que NÃO devem ser perguntadas novamente:
- Foco global e escalável; aula piloto não é condição de avanço.
- Avaliação final aprovada libera a próxima unidade; conquista fica opcional.
- Preservar reforço obrigatório e regras decididas de revisão/lembrete.
- Currículo, governança, direitos e release continuam decisões/gates do dono.
ADRs: docs/adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md,
      docs/adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md,
      docs/adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md.

Mapa de pesquisas e provas (originais com autoria, método, graus e fontes):
- docs/trilha/pesquisas/: benchmark de 26 apps; práticas com agentes;
  exercícios de imagem no celular (cinco estudos); produção escalável/qualidade.
- docs/trilha/avaliacoes/: telas de 16/10, diagnóstico global e inventários JSON.
  A nota 22/40 é histórica; não foi recalculada após as mudanças.
- docs/trilha/plano/: programa global, horizontes/P1 e piloto antigo, este último
  preservado como história, superado como direção da frente.
- docs/evidence/2026-10-16-trilha-g0-g1-catalogo.md
- docs/evidence/2026-10-16-trilha-cobertura-e-multiunidade.md
- docs/evidence/2026-10-16-trilha-g2-progressao-e-unidades.md
- docs/evidence/2026-10-17-trilha-g3-contrato-editorial.md
- docs/evidence/2026-10-17-trilha-g4-evidencia-e-revisao-por-item.md
- docs/evidence/2026-10-17-trilha-g4-avaliacoes-no-journal.md
- docs/evidence/2026-10-17-trilha-g4-resposta-antes-do-gabarito.md
- Arquitetura e fluxo: docs/ARCHITECTURE_STATE.md, docs/CLIENT_FLOW.md.

Evidência na última implementação:
- 126 testes focados/9 suítes, quatro mutações detectadas, 29 contratos Maestro.
- Run final run-1792269695725-1c4f438c: 15 validadores aprovados, um ciclo,
  succeeded/memória/closed. Run intermediário run-1792269219490-0cb9aaad
  também fechado; o escopo foi redeclarado para incluir os consumidores Maestro.
- Sessão brain-session-1792269181556-0098c53e fechada. Runs/sessões anteriores
  das avaliações e journal também foram fechados e estão nos relatórios.
- Não some contagens de etapas: os conjuntos se sobrepõem. .loop/runs é local/
  ignorado; num clone novo reproduza, não presuma que os envelopes estão lá.
- Não houve execução do novo fluxo em simulador/aparelho, Android, VoiceOver ou
  produção. Não houve validação de eficácia, retenção ou transferência.

Pendências reais para escolher UM objetivo na retomada:
- QA nativo de G2/G4: seleção, confirmação, ajuda, feedback, erro/retry,
  reabertura, teclado/texto ampliado, VoiceOver e Android. Preservar prova do
  diálogo nativo de rating; /quiz continua fora do caminho desse prompt.
- G6: medir lista/agenda/memória/latência em aparelho, com orçamento e fixtures.
- G7: backup/reset/snapshots/compatibilidade do novo store; histórico limitado
  (2 mil tentativas, 20 mil cartões, projeção de mil evidências), política de
  arquivo da avaliação e recuperação da janela entre XP e jornada. Não há
  transação global. Evicção antes de confirmar recibo pode exigir recuperação.
- Critério pedagógico para promover evidência retardada ao domínio; G3 real,
  mapa curricular amplo e acervo com licença G5. P1/FILA 50 segue separado.
Não ative V3/adaptação, promova lote, use imagem sem direitos ou faça release
para fechar pendência por conveniência. Não adote FSRS como se já decidido.

Operação e validação:
- Loop usa Node 24; testes/builds do app usam Node 20. Confira node --version em
  cada ambiente; não exporte Node 24 para os testes por acidente.
- Para mudanças, confira allowedRoots e declare a união completa no embrulho
  node scripts/loop/abrir.mjs antes de editar. Um escritor por vez. Liste também
  consumidores/scripts/contratos/docs e arquivos de histórico que serão tocados.
- Leitura do cérebro só pelo mecanismo aprovado; nunca edite vault diretamente.
  brain-links reentra na CLI: feche a sessão de leitura quando respondida,
  antes da validação que pode disputar o harness.
- Focados: comandos de reprodução dos relatórios, Node 20. Da raiz:
  node scripts/qa/trilha-structural-inventory.cjs --check
- Gate do app: no diretório radiant-app, Node 20,
  EXPO_NO_DOTENV=1 npm run quality
  (Jest avulso não equivale ao quality/CI).
- Gate final de escrita: loop validate --run <id> (todos configurados).
  Não rode em paralelo com E2E. Confira carga/CPU; use caffeinate -i.
- Fechar separadamente, lendo cada code:
  validate → step finish → [memory write após succeeded] → run close.
  Feche também a sessão do cérebro; não encadeie com &&.

Critério de aceite da próxima entrega:
- Definir primeiro um objetivo autorizado e prova proporcional; preservar
  decisões e árvore alheia; verificar chamadores reais, não só testes espelho.
- Mudança nova tem evidência própria, com hashes/ambiente/limites; E2E exige
  fixture de item realmente vencido e prova datada por plataforma.
- Atualizar STATUS/FILA/roadmap e links de evidência no mesmo run; não criar
  outro documento de estado. Research novo soma aos originais, com fontes e
  graus; não reescreve conclusões de outra IA.
- Não há autorização de commit geral, push, merge, deploy, EAS/App Store,
  alteração de consoles, promoção clínica ou envio de mensagens nesta passagem.
- Ao encerrar, relatar arquivos, provas, limites e estado dos runs/sessões.
  Não criar Trello/Todoist/Google Docs/Obsidian paralelos a estes registros.
```
