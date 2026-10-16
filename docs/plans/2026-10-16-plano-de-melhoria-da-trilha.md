# Plano de melhoria da trilha — 2026-10-16

**Estado do documento:** programa aprovado em suas quatro escolhas pelo dono
em 2026-10-16. Cada pacote ainda abre o próprio run e, quando muda regra de
produto, a própria ADR. Este plano não autoriza publicação nem a ativação do
currículo V3 para o aluno.

**De onde parte:**
- a [reavaliação da trilha](../evidence/2026-10-16-reavaliacao-da-trilha.md),
  com 22/40 em Nielsen;
- o [benchmark de mercado](../research/2026-10-16-benchmark-trilhas-gamificadas.md);
- as [práticas com agentes](../research/2026-10-16-praticas-desenvolvimento-com-agentes.md);
- a [ADR da lição híbrida e do custo de vida](../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md),
  que já decide o formato da lição e quem paga vida;
- o [plano de evolução de 12/10](2026-10-12-radiant-evolution-plan.md), cujo
  foco era layout, Pixel e uma unidade piloto. Este plano o concretiza para a
  trilha.

**Escolhas do dono (2026-10-16):**
1. Atacar a lição **nos dois caminhos em paralelo**: consertar já a lição
   legada que está no ar e, ao mesmo tempo, destravar e escalar o piloto
   híbrido.
2. A imagem radiológica **entra neste ciclo**, com um item de toque na imagem
   por trilha.
3. Entram as quatro frentes de engenharia:
   - desligar a animação em teste;
   - enxugar o `AGENTS.md`;
   - proteger testes e skills;
   - analytics. Provedor e contrato continuam decisão do dono (FILA 43).
4. Três horizontes, com o primeiro pacote detalhado tarefa a tarefa.

---

## Princípios

- **Honestidade antes de enfeite.** Nenhuma tela comemora o que não aconteceu
  nem promete uma ação que ela não oferece.
- **A menor mudança que fecha mais distância primeiro.** O pacote 1 não exige
  conteúdo novo.
- **Imagem é o diferencial.** Nenhum concorrente junta trilha gamificada e
  exercício sobre imagem em radiologia, em português, para o técnico.
- **Medir antes de escalar.** Nenhum pacote do horizonte 3 começa sem as
  métricas mínimas ligadas.

---

## Horizonte 1 — dias: lição honesta e base de engenharia

| Pacote | O que entrega | Critério de saída | Dono das decisões |
| --- | --- | --- | --- |
| **P1. Lição legada honesta** ([plano tarefa a tarefa](../superpowers/plans/2026-10-16-licao-legada-honesta.md)) | Lição com todas as perguntas da lição, embaralhadas com semente; feedback na mesma tela da pergunta, com a escolhida e a certa marcadas; a errada volta no fim, sem custo de vida; sem telas de molde quando não há texto autoral; fim reprovado com "Refazer agora"; glossário sem "Quiz:" nem "UNIDADE N"; contraste AA nos textos de estado | Gate `EXPO_NO_DOTENV=1 npm run quality` verde; bateria Maestro padrão 8 de 8 com os roteiros ajustados; nenhuma lição com 1 pergunta; captura do fim reprovado com o botão "Refazer agora" | agente; o dono aprova a captura do fim reprovado |
| **E1. Animação desligável em teste** | Argumento de lançamento lido pelo app que desliga o fundo estrelado e o confete; flows Maestro passam o argumento | Rolagem até o cabeçalho cai de 8–11 s para menos de 2 s por tentativa, medido no `reward-unlock` antes e depois | agente |
| **E2. Proteger testes e enxugar skills** | Hook `PreToolUse` que barra a edição de teste existente sem uma flag explícita da tarefa; lista de skills e MCPs habilitados só no domínio do app neste projeto | O hook visto reprovando uma edição de teste e aceitando uma criação; sessão nova carrega menos skills, contadas antes e depois | agente propõe; o dono aprova a lista |

**Paralelismo:** P1, E1 e E2 tocam arquivos diferentes e podem correr em
sessões separadas. A exceção são os roteiros Maestro, que P1 e E1 editam.
Rode E1 primeiro: ele barateia o E2E que P1 vai precisar rodar.

## Horizonte 2 — semanas: estrutura, revisão e medição

| Pacote | O que entrega | Critério de saída | Depende de |
| --- | --- | --- | --- |
| **P2. Piloto híbrido no aluno** | O dono revisa o piloto (FILA 7b). A L1 híbrida entra na trilha atrás de flag, com a regra de vida por tipo de item da ADR de 23/09 | Revisão do dono registrada; L1 híbrida jogável na trilha com a flag ligada; métrica de conclusão gravada pelo `HybridLessonMetricsRepository` | decisão do dono (7b) |
| **P3. Trilha com estrutura** | Trilha concluída recolhida num cartão-resumo; trilha bloqueada como faixa com "ver lições"; revisões fora da linha, num nó "Revisões de hoje (n)" por trilha; cabeçalho fixo da trilha visível | A trilha cabe em menos de 6 telas no estado de hoje; VoiceOver lê um cabeçalho por trilha | P1 (glossário) |
| **P4. Revisão por item** | Agendamento por pergunta, e não por lição (FSRS ou o modelo de domínio do V3, a decidir na spec); a revisão sorteia itens vencidos e devolve primeiro os errados | Teste de unidade com a agenda por item; uma revisão mistura itens de lições diferentes | spec + ADR, porque troca o SM-2 por lição |
| **P5. Analytics mínimo** | Os eventos da seção 7 da avaliação da manhã (D1/D7/D30, lição iniciada → concluída, acerto por item, duração, abandono por nó) saindo do aparelho | Painel com dados de um dia real; contrato de privacidade e cláusulas da ANPD registrados | decisão do dono (FILA 43) |
| **E3. AGENTS.md enxuto** | `AGENTS.md` com menos de 200 linhas: o contrato e os comandos. As lições operacionais vão para um runbook, consultado sob demanda | Contagem de linhas; um agente novo abre e fecha um run seguindo só o arquivo novo | o dono aprova o recorte |

## Horizonte 3 — meses: imagem e adaptação

| Pacote | O que entrega | Critério de saída | Depende de |
| --- | --- | --- | --- |
| **P6. Banco de imagens licenciadas** | Levantamento de fontes com licença comercial verificada (TCIA, que é em boa parte CC BY, e outras), proveniência e anonimização no padrão do lote V2 | Pelo menos 3 imagens por trilha com licença, fonte e hash registrados e aprovadas pelo dono | — (pode começar já, em paralelo) |
| **P7. Um item de imagem por trilha** | Item de toque na imagem com o `HotspotStepRenderer`, que já existe, em cada trilha | Um item por trilha jogável; teste do renderizador com a imagem real | P1, P6 |
| **P8. Produção em série** | Itens gerados por modelos, com gabarito calculado pelo código (ADR de 23/09); juiz LLM com rubrica calibrada num conjunto-ouro; o humano revisa o risco alto e uma amostra | Concordância do juiz com o conjunto-ouro medida; vazão de lições por semana registrada | P2, P5 |
| **P9. Adaptação** | Teste de 5 itens no topo de cada trilha para pular o que já se sabe; proteção de sequência ganha jogando | Aprovado no teste marca a trilha como concluída; o efeito sobre a retenção é medido | P4, P5 |

---

## Métricas que decidem o próximo passo

Elas só existem depois de P5. Até lá, cada pacote mede o que estiver no seu
critério de saída.
- Lição iniciada → concluída, por nó.
- Acerto na primeira tentativa por item, para achar itens ruins e o padrão da
  alternativa mais longa.
- D1 e D7 de quem concluiu a primeira lição.
- Taxa de "Refazer agora" depois de um fim reprovado.

## Riscos

- **E2E:** P1 muda a estrutura da lição, e 12 roteiros Maestro afirmam
  "Ideia-chave", "Passo N de M" e "Concluir e voltar". O plano do P1 inclui o
  ajuste desses roteiros e do contrato Maestro.
- **Conteúdo:** o padrão da alternativa mais longa (18 de 32 perguntas) não se
  resolve embaralhando. O P1 trava o número com uma guarda que só deixa
  diminuir. A reescrita dos itens vai para P8, com revisão do dono.
- **Escopo:** o horizonte 3 depende de licença de imagem. Se o P6 não achar
  imagens com licença comercial, o P7 espera; ele não usa imagem não licenciada.
