# Histórico da frente da trilha

> **Anexo do [README](README.md).** É o texto do README até 2026-10-18, preservado
> como estava, com as seções por data. O estado vivo está no
> [STATUS](../STATUS.md) e na [FILA](../FILA.md); aqui nada é estado atual.


Esta pasta reúne o que se pesquisou, avaliou e planejou sobre a **trilha**, a
aba "Estude" do Radiant. Ela foi aberta em 2026-10-16 para que qualquer pessoa
ou IA que entre no projeto entenda o trabalho em poucos minutos e possa somar a
ele. **Contribuições são bem-vindas, inclusive as que discordam do que está
aqui.**

## A1 corrigido — 2026-10-18

A versão nova de conteúdo preserva a data de revisão do item (FILA 55):
[relatório](../evidence/2026-10-18-a1-preserva-data.md) ·
[ADR](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md).

## Revisão da PR #42 — 2026-10-18

O motor híbrido do Codex foi aprovado com ajustes:
[revisão](avaliacoes/2026-10-18-revisao-da-pr-42.md) ·
[ADR da régua e da última vida](../adr/ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md) ·
[relatório dos ajustes](../evidence/2026-10-18-pr42-ajustes.md).

## Próximo passo — 2026-10-18

Anderson decidiu três coisas, depois de avaliar no simulador o estado
integrado das PRs #39 e #40:
- o próximo pacote é o **motor da lição híbrida nas lições legadas** (FILA 58),
  executado pelo Codex com revisão do Claude;
- no A1, a versão nova **preserva a data** de revisão;
- nas lições com várias perguntas, **o primeiro contato não custa vida**.

[Plano do pacote](plano/2026-10-18-pacote-motor-hibrido-na-licao.md) ·
[prompt do Codex](PROMPT-CODEX-2026-10-18.md) ·
[ADR do motor](../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md) ·
[ADR do A1](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md).

## Revisão e coordenação — 2026-10-17, Claude Opus 5.5

A partir de 2026-10-17, o Claude revisa as entregas e coordena as IAs, a pedido
de Anderson. Leia estes dois documentos antes de escolher trabalho:

- [Revisão do trabalho do Codex](avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md):
  - os 15 validadores reproduzidos e verdes na árvore atual;
  - um defeito no G4: nova `contentVersion` tira a lição da revisão (A1);
  - o store de revisão não cabe no Android nos tetos declarados (A2);
  - trabalho do E1 parado numa worktree, em conflito com a árvore (A6);
  - nada commitado.
- [Avanços e protocolo entre IAs](plano/2026-10-17-avancos-e-coordenacao-multi-ia.md):
  a sequência R1–R8, quem faz o quê e as regras de reserva, entrega e revisão.
- [Prompt do Argon](PROMPT-ARGON.md): o norte, sem escopo fechado, para o
  Argon (Gemini) avaliar, pesquisar e implementar. Ele substitui o
  [brief do Gemini](PROMPT-GEMINI.md), que era só de pesquisa.
- O trabalho G0–G4 está na [PR #39](https://github.com/andersonsmelo/Radiant/pull/39),
  em cinco commits.

## Entrega do Argon — 2026-10-17, Gemini 4 Argon (High)

> Revisada pelo Claude em 2026-10-17: [revisão B1–B5](avaliacoes/2026-10-17-revisao-do-trabalho-do-argon.md), na branch `feat/trilha-evolucao-global-g0-g4`. As correções entraram na própria PR #40.

Na branch `argon/trilha-melhorias-e-avaliacao` (baseada em `origin/feat/trilha-evolucao-global-g0-g4`):

- [Avaliação técnica: lição legada honesta, revisão G4, contratos E2E e prova nativa](avaliacoes/2026-10-17-avaliacao-argon-licao-revisao-e-contratos.md):
  - mapeamento de 3 colisões entre o plano P1 e `scripts/maestro-contract.test.mjs` / `.maestro/reward-unlock.yaml`;
  - implementação da lição legada honesta (`FILA 50` / `FILA 47`): remoção de `"Quiz: "` nos títulos da trilha (`JourneyDefinitionService.ts`), resumo de 0 estrela sem celebração e com frases sem quase acerto (`LessonSummary.tsx` e `lessonSummaryPhrases.ts`); o subtítulo continua "A lição foi concluída", corrigido pelo Claude e recap de pergunta + gabarito no passo 4 (`ReinforceStepRenderer.tsx`);
  - correção de 2 defeitos da `ReviewScreen` (`G4`): instrução obsoleta de autoavaliação substituída e destaque de gabarito pós-erro/ajuda em `ReviewCard.tsx` diferenciado por cor (`statusError` / `statusWarning` em vez de sempre `statusSuccess` verde);
  - cache validado por snapshot em `ItemReviewRepository.ts`, que reduz CPU mas não resolve o tamanho do store (A2 segue aberto);
  - três telas vistas no simulador iOS (trilha, início da revisão e passo 1 da lição); as interações do G4 não foram exercitadas.
- [Pesquisa: fontes de imagens radiológicas com licença comercial (P6 / FILA 52) e mercado brasileiro](pesquisas/2026-10-17-fontes-imagens-comerciais-e-mercado-br.md):
  - auditoria jurídica de 9 repositórios de imagens médicas (com alerta de que o `MedPix` **não** autoriza uso comercial sem permissão do autor original, ao contrário de `NCI IDC`, `Open-i / PMC CC BY 4.0`, `Wikimedia Commons CC0/CC BY` e `NIH ChestX-ray14`) e proposta de 15 imagens iniciais;
  - cruzamento com provas brasileiras de Técnico em Radiologia (`EBSERH/IBFC`, `FGV`, `VUNESP`) e concorrentes nas lojas; os pesos por tema e as queixas de usuários não têm fonte aberta e valem como hipótese.
- [Evidência de código, ciclos TDD (RED → GREEN) e simulador](../evidence/2026-10-17-trilha-licao-honesta-e-revisao-g4.md).

## Direção atual — evolução global, 2026-10-16

**Anderson retirou o foco em aulas piloto.** A frente agora parte de pesquisas e
diagnóstico da trilha inteira para implementação compartilhada, currículo
organizado e produção de conteúdo em escala. A escolha anterior de qualidade
técnica não limita o programa a uma aula.

- [Diagnóstico estrutural atual](avaliacoes/2026-10-16-diagnostico-estrutural-global-da-trilha.md) e [inventário reproduzível](avaliacoes/2026-10-16-inventario-estrutural.json).
- [Pesquisa sobre produção escalável e qualidade](pesquisas/2026-10-16-producao-escalavel-e-qualidade-da-trilha.md).
- [Loop global de evolução e produção, com arquitetura e pacotes G0–G8](plano/2026-10-16-loop-global-de-evolucao-da-trilha.md).
- [ADR da direção global sem piloto como gate](../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md).

A leitura abaixo preserva o contexto anterior. O estado vivo permanece no
STATUS/FILA; diagnóstico e plano não significam expansão já implementada.

## Consolidação para continuidade — 2026-10-17

**Autoria desta consolidação:** OpenAI Codex, família GPT-6; variante exata não
exposta. **Método:** inventário dos arquivos, leitura dos relatórios, conferência
de Git e dos runs locais. [código] qualifica esse inventário; graus, fontes e
autoria de cada pesquisa permanecem no original. Não houve nova pesquisa externa
nem revalidação dos estudos de 16/10 nesta consolidação.

**Anderson pediu parar a implementação e deixar o contexto pronto para outra IA.**
O ponto de parada e a fila autorizativa estão no [STATUS](../STATUS.md) e na
[FILA, item 54](../FILA.md). Este README é índice de conhecimento e evidências;
não é um segundo documento de estado. O [prompt de continuidade](PROMPT-PARA-IAS.md)
foi atualizado para a árvore de 17/10. Não tratar o diagnóstico de 16/10 como
uma medição da implementação posterior.

### Todas as pesquisas desta frente

| Pesquisa preservada | Método e utilidade | Limite que não deve se perder |
| --- | --- | --- |
| [Benchmark de trilhas e saúde/radiologia](pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md) | 26 produtos; referências oficiais, terceiros e inferências com proveniência no original | Não prova ausência de concorrentes nem eficácia para o Radiant; conferência foi por amostragem |
| [Práticas com agentes](pesquisas/2026-10-16-praticas-desenvolvimento-com-agentes.md) | Literatura/documentação para trabalho com IAs e validação | Notas de correção/proveniência permanecem; Reddit não foi lido e alguns números não foram confirmados |
| [Exercícios com imagem no celular](pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md) | Cinco estudos primários, documentação e inspeção dos renderizadores; seleção guiada versus localização independente | Não é revisão sistemática, licença de imagens ou validação nativa; proposta de piloto foi superada como direção |
| [Produção escalável e qualidade](pesquisas/2026-10-16-producao-escalavel-e-qualidade-da-trilha.md) | CDC, NBME, QTI, JSON Schema, Anki/FSRS e Expo confrontados com o código | Schema não prova verdade clínica; FSRS não foi adotado; aprovação editorial e direitos continuam humanos |

As URLs, datas de acesso e graus de cada afirmação estão nesses documentos. Não
foram copiados para outra fonte concorrente. Pesquisa anterior complementar:
[RESEARCH_DECISIONS.md](../RESEARCH_DECISIONS.md), de 12/10.

### Diagnósticos e propostas preservados

- **Telas em 16/10:** [avaliação inicial](avaliacoes/2026-10-16-avaliacao-completa-da-trilha.md),
  [reavaliação](avaliacoes/2026-10-16-reavaliacao-da-trilha.md), anexos de
  [design](avaliacoes/2026-10-16-reavaliacao-da-trilha-design.md) e
  [mecânica](avaliacoes/2026-10-16-reavaliacao-da-trilha-mecanica.md).
  A nota Nielsen 22/40 é histórica; não houve nova nota após G4.
- **Diagnóstico global por código:** [análise estrutural](avaliacoes/2026-10-16-diagnostico-estrutural-global-da-trilha.md),
  [inventário inicial](avaliacoes/2026-10-16-inventario-estrutural.json),
  [alcançabilidade após G0/G1](avaliacoes/2026-10-16-alcancabilidade-apos-g0-g1.json),
  [cobertura/composição](avaliacoes/2026-10-16-cobertura-e-composicao-da-trilha.json)
  e [contrato de multiunidade](../evidence/2026-10-16-trilha-cobertura-e-multiunidade.md).
  São fotografias datadas; remedir com o instrumento indicado no relatório.
- **Direção executável:** [programa global G0–G8](plano/2026-10-16-loop-global-de-evolucao-da-trilha.md),
  [plano em três horizontes](plano/2026-10-16-plano-de-melhoria-da-trilha.md) e
  [P1, lição honesta](plano/2026-10-16-licao-legada-honesta.md).
  [Piloto de imagem](plano/2026-10-16-piloto-imagem-sem-pistas.md) preservado como
  histórico, sem gate de avanço do programa global.

### Entregas de código — mapa das evidências

[código] Implementação local relatada e validada na árvore compartilhada, não
release. Os pacotes G0–G8 abaixo são do programa da trilha; não confundir com
identificadores homônimos do roadmap antigo de lançamento.

| Pacote | O que já foi implementado/medido | Evidência e fronteira |
| --- | --- | --- |
| G0/G1 | Inventário reproduzível, catálogo por registros, composição e auditoria de alcance/grafo | [Catálogo](../evidence/2026-10-16-trilha-g0-g1-catalogo.md) e [cobertura/multiunidade](../evidence/2026-10-16-trilha-cobertura-e-multiunidade.md); fixtures não viraram conteúdo novo |
| G2 | Progressão e navegação multiunidade, contadores e conquista opcional | [Progressão/unidades](../evidence/2026-10-16-trilha-g2-progressao-e-unidades.md); QA nativo permanece separado |
| G3 | Contrato editorial genérico, validação/promoção e auditoria dos lotes, integração com painel/CI | [Contrato editorial](../evidence/2026-10-17-trilha-g3-contrato-editorial.md); produção/revisão real e currículo amplo ainda pendem |
| G4 — journal | Tentativa e agenda por item, deduplicação, primeira resposta/ajuda, migração aditiva e fila de até 50 | [Evidência/revisão por item](../evidence/2026-10-17-trilha-g4-evidencia-e-revisao-por-item.md); 187 testes focados/13 mutações na medição dessa etapa |
| G4 — avaliações | Itens de avaliação no journal, recibo persistente retomável e conclusão de aprovação salva | [Avaliações no journal](../evidence/2026-10-17-trilha-g4-avaliacoes-no-journal.md); 160 focados/5 mutações, com reprovação integral e correção documentadas |
| G4 — resposta | Seleção antes do gabarito, correção pelo catálogo, ajuda sem XP, feedback após persistência e sinal temporal | [Resposta antes do gabarito](../evidence/2026-10-17-trilha-g4-resposta-antes-do-gabarito.md); 126 focados/4 mutações, 29 contratos Maestro e 15 validadores finais |

As contagens acima são históricas por conjunto e **não se somam**. Cada relatório
traz método, fontes de código, comandos, IDs de run e limites. O último run de
implementação `run-1792269695725-1c4f438c` está fechado, com os 15 validadores
aprovados; a sessão de leitura foi fechada. `.loop/runs` é local/ignorado:
outra máquina deve reproduzir os gates, não presumir que recebeu os envelopes.

Também preservados: [pacote de confiança](../evidence/2026-10-16-pacote-de-confianca-da-trilha.md),
[âncora no próximo passo](../evidence/2026-10-16-trilha-ancorada-no-proximo.md) e
[E2E anterior da âncora](../evidence/2026-10-16-e2e-ancora-de-estude.md).
E2E antigo não valida a revisão nova.

**Não reabrir decisões já dadas:** [direção global sem piloto](../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md),
[aprovação libera próxima/conquista opcional](../adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md)
e [revisão paralela/lembrete](../adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md).

**Fronteiras para a retomada:** QA nativo/VoiceOver/Android, desempenho G6,
backup/reset e recuperação G7; critério pedagógico de retenção, conteúdo/revisão
real G3, acervo com licença G5 e mapa curricular amplo. `after-interval` é apenas
sinal operacional; não promove `delayed-retention`. O journal é local e limitado;
XP/jornada não têm transação conjunta. Nada disso é prova de publicação ou de
trilha ampla já produzida. Conferir estado vivo antes de escolher a próxima ação.

## O Radiant em cinco linhas

- App de estudo para estudantes e técnicos de radiologia no Brasil, com iOS
  publicado (1.4.0) e Android em teste fechado.
- Feito em React Native/Expo e TypeScript, local-first: estuda sem rede.
- A trilha é um caminho gamificado no formato do Duolingo: lições, revisões,
  conquistas, XP, sequência, 5 vidas que regeneram e assinatura que dá vidas
  ilimitadas.
- O propósito declarado em [`PRODUCT.md`](../PRODUCT.md) é "sustentar o hábito
  de raciocinar sobre imagem".
- O dono definiu a trilha como o investimento principal do produto.

## Fotografia histórica das avaliações e do plano (2026-10-16)

- **Avaliado:** duas avaliações no mesmo dia. A da tarde, feita depois de um
  pacote de correções, dá 22/40 nas heurísticas de Nielsen. O maior problema
  naquela avaliação estava **dentro da lição**:
  - uma pergunta por lição;
  - erro explicado longe da pergunta;
  - alternativa certa tende a ser a mais longa;
  - nenhuma imagem radiológica.
- **Pesquisado:**
  - 26 apps de trilha e de educação em saúde e radiologia. Nenhum junta trilha
    gamificada e exercício sobre imagem em radiologia, e o técnico brasileiro
    não tem produto desse formato;
  - práticas de desenvolvimento com agentes de IA.
- **Planejado:** três horizontes, escolhidos pelo dono. O estado de execução
  vive em [`STATUS.md`](../STATUS.md) e na [`FILA`](../FILA.md), a partir do
  item 49. Os horizontes são:
  - dias: lição honesta e base de engenharia;
  - semanas: estrutura da trilha, revisão por item e medição;
  - meses: imagem e adaptação.

## Mapa da pasta

| Pasta | O que tem |
| --- | --- |
| [`pesquisas/`](pesquisas/) | [benchmark de trilhas gamificadas e de educação em radiologia](pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md) · [práticas de desenvolvimento com agentes](pesquisas/2026-10-16-praticas-desenvolvimento-com-agentes.md) |
| [`avaliacoes/`](avaliacoes/) | [avaliação da manhã](avaliacoes/2026-10-16-avaliacao-completa-da-trilha.md) · [reavaliação da tarde](avaliacoes/2026-10-16-reavaliacao-da-trilha.md), com os anexos [de design](avaliacoes/2026-10-16-reavaliacao-da-trilha-design.md) e [mecânico](avaliacoes/2026-10-16-reavaliacao-da-trilha-mecanica.md) |
| [`plano/`](plano/) | [plano em três horizontes](plano/2026-10-16-plano-de-melhoria-da-trilha.md) · [pacote P1, lição legada honesta, tarefa a tarefa](plano/2026-10-16-licao-legada-honesta.md) |

**Fora da pasta, mas do mesmo assunto:**
- [`RESEARCH_DECISIONS.md`](../RESEARCH_DECISIONS.md): pesquisas de 2026-10-12;
- [plano de evolução de 12/10](../plans/2026-10-12-radiant-evolution-plan.md);
- [`PRODUCT.md`](../PRODUCT.md) e [`DESIGN.md`](../DESIGN.md);
- as decisões que já valem:
  - a [ADR da lição híbrida e do custo de vida](../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md);
  - a [ADR da revisão paralela e do lembrete](../adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md);
  - a [spec do currículo V3](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md);
- as evidências de execução:
  - [pacote de confiança](../evidence/2026-10-16-pacote-de-confianca-da-trilha.md);
  - [E2E da âncora de Estude](../evidence/2026-10-16-e2e-ancora-de-estude.md).

## Como contribuir

**Liberdade para pesquisar e propor.** O plano é ponto de partida, não
fronteira. Vale:
- pesquisar o que ninguém pesquisou;
- refazer uma avaliação com outro método;
- discordar de uma conclusão;
- trazer dado novo;
- propor outro caminho.

Ideias de frentes ainda abertas, sem esgotar o que vale pesquisar:
- licenças de imagem radiológica para uso comercial;
- quem é e quantos são os técnicos de radiologia no Brasil;
- formatos de exercício sobre imagem que funcionam no celular;
- revisão por item: FSRS ou o modelo de domínio do V3;
- analytics compatível com a LGPD;
- motivação sem ranking entre alunos;
- o que fóruns como o Reddit dizem. A pesquisa de 16/10 não conseguiu lê-los.

**Para o que você trouxer ser aproveitado:**
- **Uma pesquisa nova** vai em `pesquisas/AAAA-MM-DD-tema.md`, com:
  - quem fez (pessoa, ou IA e modelo);
  - a data;
  - a pergunta e o método;
  - o grau de cada afirmação: [oficial], [terceiro], [usuário], [estudo],
    [código], [visto] ou [inferido];
  - as fontes, com URL e data de acesso.
- **Uma avaliação nova** vai em `avaliacoes/`, com o estado medido: commit,
  aparelho e o que foi visto na tela.
- **Uma proposta de mudança no plano** vai num documento novo em `plano/`,
  dizendo o que muda e por quê. Não reescreva o plano de outra pessoa. Decisão
  de produto é do dono e vira ADR em [`../adr/`](../adr/).
- Ao concluir algo da FILA, marque na própria FILA e edite o `STATUS.md`. Não
  crie documentos de estado novos.

**Regras do repositório que continuam valendo:** estão em
[`AGENTS.md`](../../AGENTS.md). As essenciais:
- toda escrita passa por um run do Loop (`scripts/loop/abrir.mjs`), com cada
  arquivo declarado separado;
- há um só escritor por vez;
- veja o `git log` e as branches antes de começar, para não refazer o que outra
  sessão já fez.

## Contribuição complementar — 2026-10-16, OpenAI Codex (família GPT-6)

- [Exercícios sobre imagem no celular: evidência e limites do renderizador](pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md): cinco estudos primários, seleção guiada versus localização independente e riscos de geometria/pistas no código. Sem avaliação nativa nesta sessão.
- [Proposta de piloto com habilidade e pistas explícitas](plano/2026-10-16-piloto-imagem-sem-pistas.md): gates técnicos, teste de usabilidade e separação de casos para transferência. **Superada como direção desta frente pela decisão global acima.**
- [Decisão do foco em qualidade técnica da imagem](../adr/ADR-2026-10-16-foco-piloto-imagem-qualidade-tecnica.md), escolhida por Anderson nesta conversa em 2026-10-16. Não substitui o piloto híbrido da L1 nem conclui o levantamento de licenças P6/FILA 52.

Um [prompt de contexto](PROMPT-PARA-IAS.md) pronto para colar em outra IA está
nesta pasta.
