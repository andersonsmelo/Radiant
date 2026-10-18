# Avaliação completa da trilha — 2026-10-16

**Pedido do dono:** avaliar a trilha (aba Estude) de ponta a ponta, com pontos
fortes e fracos, usando os melhores apps de aprendizagem como comparação. É o
ponto de partida do investimento na trilha.

**Método:**
- código e conteúdo do branch `codex/radiant-study-improvements` em `9b085d4`;
- decisões e pendências em `STATUS`, `FILA`, ADRs e na spec do currículo V3;
- percurso no simulador (iPhone 17, iOS 26.5, binário 1.4.0 (3), perfil V2 local);
- pesquisa pública sobre Duolingo, Brilliant, Khan Academy, Anki, AMBOSS,
  Clover Learning, Radiopaedia e IMAIOS;
- a lente de UX do `impeccable critique`.

> ⚠️ **Critique em modo degradado:** contexto único, sem os dois subagentes
> isolados que a skill pede, porque nesta sessão subagentes só rodam a pedido
> do dono. O detector automático rodou (`detect.mjs`) e devolveu `[]`. Ele foi
> feito para marcação web e não lê React Native, então o resultado vazio **não**
> atesta a interface.

**Grau de cada afirmação:** **[visto]** na tela do simulador; **[código]**
confirmado lendo o código; **[doc]** registrado em documento do projeto;
**[inferido]** conclusão do agente, ainda sem reprodução completa;
**[mercado]** fonte pública, com link no fim.

---

## 1. Veredito

A **estrutura** da trilha está à frente do **conteúdo** que ela entrega. Fazem
parte da estrutura:
- o percurso único;
- a recomendação do próximo passo;
- as regras de desbloqueio puras e testadas;
- a acessibilidade;
- a governança editorial.

A trilha que o aluno percorre hoje na 1.4 tem três problemas:
- **ensina pouco:** lições de 2 perguntas de múltipla escolha só em texto,
  abertas por frases geradas por modelo, sem nenhuma imagem radiológica;
- **às vezes informa errado:** três estrelas com 0 acertos e trilha trancada sem
  explicação;
- **não é medida:** não há analytics de produto saindo do aparelho.

A spec do V3 já diagnosticou isso em 2026-08-27: "o currículo embarcado não
sustenta a proposta do produto". O V3 continua fora do app do aluno.

O maior gargalo não é a tela. É **a vazão do conteúdo** e **a falta de
medição**. Os quatro problemas que mais custam confiança, P0-1 a P1-4 na seção
4, dão para atacar em dias.

---

## 2. O que está no ar — inventário medido

| Item | Medida | Grau |
| --- | --- | --- |
| Trilhas no percurso | 3: Fundamentos (7 lições), Radiação, Modalidades e Equipamento (6), Prática, Qualidade e Profissão (5) | [código] `src/data/catalog.ts` |
| Lições | 18. As 16 `ai-lesson` têm **2 perguntas** cada; as 2 legadas têm 3. **≈38 perguntas no catálogo inteiro** | [código] `src/data/ai-lessons.ts`, `lessons.ts` |
| Formato das perguntas | 100% múltipla escolha só com texto | [código] [visto] |
| Abertura e "ideia-chave" | geradas por modelo para toda lição: "Agora você entra em {título} dentro de {trilha}." e "O objetivo desta etapa é consolidar o conceito central de {título} antes do quiz." | [código] `JourneyDefinitionService.ts:71,89` · [visto] |
| Imagens radiológicas | **nenhuma**: `assets/images` só tem ícones e logos | [código] |
| Revisão | 3 passos: cartão genérico, **1 pergunta** e reforço | [visto] |
| Revisão espaçada | SM-2 com a agenda **por lição**, não por item | [código] `SpacedRepetitionService.ts` |
| Nós da trilha | cada lição tem um nó de revisão logo depois, mais as conquistas | [visto] |
| Currículo V3 (raciocínio espacial e imagem) | L1 aprovada, L2 reprovada em 6 revisões, piloto híbrido esperando revisão do dono (FILA 7b). **Desligado para o aluno** | [doc] STATUS, FILA |
| Lote V2 com proveniência (12 atividades) | cada afirmação com fonte, licença e hash. Hoje é 1 apresentação + 1 múltipla escolha + 1 síntese por atividade | [código] `EditorialCurriculumCandidate.ts` |
| Analytics de produto | `createNoopProductAnalyticsAdapter`: eventos só no `AsyncStorage` do aparelho. API pública em 502 | [código] · [doc] STATUS |
| Lembrete diário | o pedido de permissão só aparece na Home legada, que não se alcança com a trilha ligada, e na tela de revisão | [código] · [inferido] o efeito no aparelho |

---

## 3. Pontos fortes

1. **Regras de jornada honestas e testáveis.**
   - Desbloqueio de trilha, próximo nó e motivo da recomendação são funções
     puras (`JourneyTrackUnlockService`, `NextNodeResolver`,
     `JourneyRecommendationService`), com comentários que explicam cada defeito
     que já mataram.
   - A gravação de conclusão é autorizada dentro do serviço, e não na tela, e
     isso fecha deep links que gravavam conquista indevida.
   - Poucos apps desse porte têm esse rigor. [código]
2. **Governança editorial acima do mercado.** O lote V2 aponta, para cada
   afirmação, a fonte, a licença, a data de acesso e o hash do material. A spec
   V3 traz:
   - regra de evidência, com tentativa inicial independente, prática assistida
     e recuperação posterior;
   - uma taxonomia de erros (`E-LAT-OBS`, `E-PLN-SEC`…);
   - remediação por concepção errada.

   Nem Duolingo nem Brilliant publicam algo comparável sobre domínio. É a base
   certa para um app de saúde. [código] [doc]
3. **Gamificação contida e coerente com o produto.**
   - não há liga entre alunos, por contrato de privacidade;
   - as vidas regeneram;
   - a assinatura promete só "vidas ilimitadas";
   - a perda de vida é anunciada no VoiceOver.

   O Duolingo, em 2025, trocou corações por energia, com críticas de que pune o
   uso. O Radiant está do lado certo dessa discussão. [doc] [mercado]
4. **Uma trilha só, com o próximo passo sempre visível.**
   - o nó PRÓXIMO;
   - o cartão de recomendação;
   - desde hoje, a abertura centralizada no ponto do aluno e a posição
     preservada (`f39ac9e`).

   Na volta da revisão, a trilha centralizou o novo PRÓXIMO sozinha. [visto]
5. **Acessibilidade e offline-first desde a base.** Texto grande até AX5 com
   cabeçalho dentro da rolagem, anúncios de VoiceOver e estudo sem rede. [doc]
6. **Disciplina de qualidade.** 14 validadores no gate, guardas vistas falhando
   antes de valer, e ADR para cada decisão. Isso reduz o custo de mexer forte na
   trilha. [doc]

---

## 4. Pontos fracos, por severidade

### P0-1 — A lição no ar não ensina o que o produto promete

O propósito no `PRODUCT.md` é "sustentar o hábito de **raciocinar sobre
imagem**". O que o aluno recebe:
- uma abertura gerada por modelo;
- uma "ideia-chave" que não diz ideia nenhuma;
- duas perguntas de múltipla escolha em texto.

Não há nenhuma radiografia, nenhum corte de TC, nenhuma interação de
localização. Os renderizadores ricos já existem no código, mas nenhuma lição
publicada os usa: `HotspotStepRenderer`, `MatchingStepRenderer`,
`OrderingStepRenderer` e `ComparisonStepRenderer`. [visto] [código]

- **Mercado:**
  - o Brilliant monta cada lição como sequência de problemas interativos, com
    pista sem entregar a resposta, segundo resenha de terceiros;
  - Clover Learning e Radiopaedia ensinam radiologia **pela imagem**:
    identificação em radiografia e casos com várias perguntas por caso;
  - o IMAIOS e-Anatomy cobre mais de 8.900 estruturas rotuladas em
    TC/RM/raio X. [mercado]
- **Efeito:** um aluno de radiologia percebe em minutos que o app é um quiz
  raso. Os 38 itens acabam numa tarde, e a constância do hábito não tem com o
  que se sustentar.

### P0-2 — O resumo comemora o erro

Revisão respondida errado: **"0 de 1 corretas"**, e mesmo assim a tela mostra
três estrelas, **"Três estrelas. Nada passou despercebido."**, "A lição foi
concluída" e **+10 XP**. [visto]

A causa é `resolveBestLessonStars`: o resumo exibe a **melhor nota já obtida**
naquela lição e escolhe a frase por essas estrelas. Como a revisão compartilha o
`lessonId` com a lição, a frase escrita para a tentativa atual descreve uma
tentativa antiga. [código] `LessonFlowScreen.tsx:379`

Isso viola o princípio "Rigor primeiro, calor depois" e o "Erro é informação" do
próprio produto. Num app de saúde, mentir sobre acerto é o pior tipo de
defeito.

### P0-3 — A trilha seguinte trava depois de "8 de 8", sem dizer por quê

[visto] Com as 7 lições e a conquista concluídas ("8 DE 8"), a trilha 2 aparece
como "BLOQUEADO · Radiação, Modalidades e Equipamento". Nada diz o que falta nem
quando abre.

[código] `isTrackCompleted` exige **todo nó** concluído, **inclusive as
revisões**. O status de uma revisão é calculado assim:
- revisão ainda não feita e agendada para o futuro conta como `locked`;
- revisão que venceu de novo conta como `due-review`.

Por isso:
- o aluno que terminou tudo hoje fica parado até a revisão de 21/10 liberar
  (visto: "Disponível em 21/10/2026") e ser feita;
- **[inferido, precisa de teste]** cada revisão antiga que vence de novo faz a
  trilha anterior voltar a "não concluída", e `lockUnreachedUnits` rebaixa a
  `locked` os nós ainda não concluídos da trilha seguinte. O aluno veria o
  avanço se fechar por ter revisões em dia.

**Mercado:** no Duolingo, a revisão é prática paralela (prática personalizada,
"Legendary") e não portão do caminho. No Khan Academy, revisão e desafio de curso
**aceleram** o domínio, não o bloqueiam. [mercado]

### P1-4 — A trilha não é medida fora do aparelho

O analytics de produto é um adaptador vazio, e a API pública está em 502.
Ninguém consegue responder, com dado de produção:
- quantos alunos voltam no D1 e no D7;
- em que lição abandonam;
- qual item todos erram;
- quanto dura uma sessão. [código] [doc]

**Mercado:** a equipe de retenção do Duolingo diz ter rodado mais de 600
experimentos só em streaks em quatro anos, segundo podcast resumido por
terceiros. [mercado]

**Efeito:** sem medição, "investir na trilha" vira opinião. Esta avaliação
inteira é qualitativa por esse motivo.

### P1-5 — O conteúdo sai devagar demais para o tamanho do pedido

A spec V3 é de 27/08. Em sete semanas saíram:
- a L1, aprovada;
- a L2, reprovada em seis revisões e pausada;
- o piloto híbrido, que espera revisão do dono desde 23/09 (FILA 7b).

Nenhuma lição V3 chegou ao aluno. [doc]

Para comparação de escala, a Clover anuncia 250+ vídeo-aulas e 1.000+ questões
só em radiografia. [mercado]

A qualidade editorial é um ativo, mas o processo atual entrega quase nada por
semana ao aluno. Sem um processo que produza lições em série, cada melhoria de
tela enfeita o mesmo punhado de perguntas.

### P1-6 — A revisão é rasa e o erro custa caro

- **Uma pergunta decide a agenda SM-2 da lição inteira**, que é agendada por
  lição e não por item. [código] [visto]
- **Errar na revisão custou 1 vida** (5 → 4), em tensão com o princípio "Erro não
  pune. Vidas não bloqueiam estudo". [visto]
- **O reforço explica a resposta certa, mas não o distrator escolhido**, e não
  oferece nova tentativa nem item isomórfico. A própria spec V3 pede "prática
  isomórfica assistida" e "item novo posterior". [visto] [doc]
- **Mercado:**
  - o Duolingo usa o Birdbrain para prever o acerto por exercício e montar a
    lição no ponto de dificuldade certo, segundo o blog da empresa;
  - o Anki oferece o FSRS, que modela a memória por cartão; benchmarks de
    terceiros estimam 20–30% menos revisões para a mesma retenção;
  - o Khan Academy rebaixa o domínio quando o desempenho cai. [mercado]

### P2-7 — A trilha é longa, monótona e pouco legível

[visto]
- **Densidade baixa:** cabem cerca de 2,5 nós por tela. Cada lição tem um
  "Revisar …" idêntico logo depois, então a trilha dobra de comprimento sem
  dobrar de conteúdo.
- **Títulos truncados e repetitivos:** "Revisar Quiz: En…", "Revisar Quiz:
  Estrutura da matéria e núcle…". O prefixo "Quiz:" vaza do catálogo, e a
  revisão herda "Revisar Quiz:".
- **Sem marcos de unidade:** não há guia da unidade, baú, nível lendário nem
  checkpoint visual. A única quebra é a faixa entre trilhas. O Duolingo agrupa o
  caminho em unidades com níveis e marcos. [mercado]
- **Primeiro quadro:** título e cartão de recomendação ocupam cerca de 60% da
  primeira tela. O cartão repete o nó PRÓXIMO que está logo abaixo.
- **Rótulos que não batem com o conteúdo:** o id `track-thorax-patterns` nomeia
  "Radiação, Modalidades e Equipamento" [código], e "UNIDADE 4" aparece no topo
  da lição.

### P2-8 — O laço de volta diária é fraco

[código] O pedido de permissão de notificação só existe na Home legada e na
tela de revisão. O agendamento diário (`scheduleDailyIfEligible`) só é chamado
na Home legada e no opt-in. **[inferido]** Um aluno novo que estuda pela trilha
pode nunca ser convidado a receber o lembrete. A sequência existe, mas sem o
cutucão que a sustenta. O Duolingo trata o streak como alavanca central de
retenção. [mercado]

### P2-9 — Não há adaptação nem atalho

A sequência é a mesma para todos:
- não há diagnóstico inicial;
- não há "teste para pular" (o Khan tem o Course Challenge);
- não há prática livre por fraqueza (o Duolingo tem prática personalizada).

O técnico formado e o calouro fazem o mesmo caminho. [código] [mercado]

### P3 — Polimento

- "Avalie a aula" e "A lição foi concluída" aparecem numa revisão.
- As setas "↗" da Ajuda aparecem como emoji em caixa.
- A abertura da revisão diz "Faça uma verificação rápida do conceito mais
  importante desta etapa", texto genérico.

---

## 5. Comparação com o mercado

| Critério | Radiant hoje | Duolingo | Brilliant | Khan Academy | Anki/AMBOSS | Radiologia (Clover, Radiopaedia, IMAIOS) |
| --- | --- | --- | --- | --- | --- | --- |
| Unidade de estudo | lição de 2 perguntas | lição dinâmica montada por exercício, com níveis e unidades | lição de 10–25 problemas interativos* | exercício, quiz e teste de unidade | cartão | vídeo-aula, caso com várias perguntas, atlas |
| Interatividade | múltipla escolha em texto | tipos variados de exercício | manipulação e problema guiado | exercícios | lembrar e conferir | identificação em imagem |
| Imagem do domínio | nenhuma | n/a | diagramas interativos | figuras | imagens nos cartões (AMBOSS) | **núcleo do produto** |
| Revisão espaçada | SM-2 por lição, 1 item | ordenação do caminho por repetição espaçada e prática personalizada | checkpoints de prática | rebaixamento de domínio | SM-2 ou FSRS por cartão | qbank e simulados |
| Adaptação | nenhuma | Birdbrain (dificuldade por exercício) | pistas | Course Challenge acelera | por cartão | — |
| Modelo de domínio | desenhado no V3, não ligado | Legendary por unidade | — | Familiar → Proficiente → Domínio | intervalo | — |
| Motivação | XP, sequência, vidas, missões | streak, ligas, missões, energia | streak | pontos de domínio | — | certificação e créditos |
| Medição | só local | experimentação massiva | — | — | — | — |
| Volume | ≈38 perguntas | cursos inteiros | dezenas de cursos | currículos completos | decks enormes | 250+ aulas e 1.000+ questões (Clover) |

\* estimativa de resenha de terceiros, não número oficial.

**Leitura da tabela:** o Radiant já tem o que ninguém da lista tem junto —
rigor clínico rastreável e gamificação ética em português. Fica atrás em três
eixos que decidem retenção: **volume**, **interação com imagem** e
**adaptação**.

---

## 6. UX da trilha — heurísticas de Nielsen

| # | Heurística | Nota | Ponto principal |
| --- | --- | --- | --- |
| 1 | Visibilidade do estado | 2 | "8 DE 8" com a próxima trilha trancada; estrelas que não refletem a tentativa |
| 2 | Correspondência com o mundo real | 2 | "Quiz:" nos títulos, "UNIDADE 4", revisão chamada de "aula" e de "lição" |
| 3 | Controle e liberdade | 3 | sair a qualquer passo, posição preservada, volta ao PRÓXIMO |
| 4 | Consistência | 2 | lição, revisão e aula trocadas; o cartão do topo repete o nó |
| 5 | Prevenção de erro | 2 | nada avisa que a revisão custa vida antes de responder |
| 6 | Reconhecer em vez de lembrar | 3 | o PRÓXIMO e a recomendação estão sempre visíveis |
| 7 | Flexibilidade e eficiência | 1 | sem teste para pular, sem prática livre, sem escolha de foco |
| 8 | Estética e minimalismo | 3 | visual limpo e coerente; densidade baixa |
| 9 | Recuperação de erro | 1 | erro → explicação genérica, sem nova tentativa; trilha trancada sem diagnóstico |
| 10 | Ajuda e documentação | 1 | nada explica vidas, desbloqueio nem revisão dentro da trilha |
| | **Total** | **20/40** | **Aceitável, no limite inferior** |

**Carga cognitiva:** o checklist falha em 2 de 8 itens (cognição moderada):
- **hierarquia visual no primeiro quadro:** o cartão de recomendação e o nó
  PRÓXIMO disputam a atenção;
- **memória entre telas:** para entender por que a trilha 2 está fechada, o
  aluno precisa lembrar quais revisões estão pendentes.

### Personas

- **Jordan, primeira vez:**
  - não encontra o que a "ideia-chave" ensina;
  - recebe três estrelas depois de errar e conclui que o app não leva acerto a
    sério;
  - vê "BLOQUEADO" sem saber o que fazer.
- **Casey, no celular, entre plantões:** a sessão curta funciona. Duas perguntas
  terminam rápido demais para virar hábito, e sem lembrete não há volta amanhã.
- **Técnica em radiologia formada (persona do projeto):** procura reconhecer
  incidência e anatomia na imagem e encontra perguntas de definição ("o que é um
  voxel?"). Não há como pular o que já domina. Abandona por falta de desafio.

---

## 7. Ponto de partida — o que fazer, em três horizontes

### Dias — consertar a confiança e ligar a medição

1. **P0-2:** o resumo passa a mostrar a nota **da tentativa** e a frase dela. A
   melhor nota vira detalhe ("seu recorde: ★★★"). A revisão ganha título e
   texto próprios, e o erro não recebe XP de acerto.
2. **P0-3:** revisão deixa de ser portão da trilha seguinte (exige ADR, porque
   muda regra de progressão). A faixa "BLOQUEADO" passa a dizer o que abre e
   quando. Antes, um teste reproduz a rebaixa da trilha seguinte inferida acima.
3. **P1-4:** ligar o analytics de produto. Escolher o provedor e o contrato de
   privacidade é decisão do dono. Métricas mínimas:
   - D1, D7 e D30;
   - lição iniciada → concluída;
   - acerto por item;
   - duração da sessão;
   - abandono por nó.
4. **P2-8:** o pedido de lembrete passa a sair do fim da primeira lição
   concluída na trilha, e não da Home legada.

### Semanas — conteúdo em escala

5. **Decidir o destino do piloto híbrido (FILA 7b).** É o formato de 10–15 itens
   curtos, com explicação no feedback e o item errado de volta no fim, que
   resolve P0-1 e P1-6 de uma vez.
6. **Montar o processo que produz lições em série:**
   - modelos de item;
   - geração assistida com revisão humana por amostragem;
   - metas de vazão (lições por semana);
   - um banco de **imagens licenciadas**. A licença de cada fonte precisa ser
     verificada antes do uso. Casos de comunidade costumam ter licença não
     comercial, e o Radiant é pago.

   A governança atual entra como **controle de qualidade**, não como porta
   única.
7. **Revisão por item** em vez de por lição, com FSRS ou o próprio modelo de
   domínio do V3, e prática personalizada por fraqueza como atividade paralela à
   trilha.

### Meses — diferenciação

8. **Imagem como núcleo:** hotspot em radiografia real, comparação de
   incidências e cortes de TC/RM, com os renderizadores que já existem.
9. **Adaptação:** diagnóstico inicial, teste para pular unidade e dificuldade
   por item.
10. **Trilha com unidades:**
    - guia da unidade;
    - marco visual a cada unidade;
    - revisões fora da linha principal, agrupadas;
    - títulos sem prefixo de catálogo.

---

## Fontes de mercado

- Duolingo — redesenho do caminho, ordenação por repetição espaçada e Legendary
  por unidade: <https://blog.duolingo.com/new-duolingo-home-screen-design/>
- Duolingo — Birdbrain: <https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain>
- Duolingo — energia no lugar de corações (2025):
  - <https://www.androidauthority.com/quitting-duolingo-energy-system-3599842/>
  - <https://uxdesign.cc/duolingos-small-ui-switch-that-changes-everything-fae257203633>
- Duolingo — streaks e experimentos, resumo de terceiros:
  <https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks>
- Brilliant — trilhas de aprendizagem: <https://brilliant.org/help/features/what-are-learning-paths>;
  resenha de terceiros: <https://skillscouter.com/brilliant-review-math-science-coding/>
- Khan Academy — domínio de curso e unidade:
  <https://support.khanacademy.org/hc/en-us/articles/115002552631>
- Anki — SM-2 e FSRS: <https://faqs.ankiweb.net/what-spaced-repetition-algorithm>
- AMBOSS — integração com Anki: <https://amboss.com/us/anki>
- Clover Learning — RadTechBootCamp: <https://cloverlearning.com/products/radtechbootcamp>
- Radiopaedia — apps para educadores (AARAD): <https://www.aarad.org/apps-for-radiology-educators>
- IMAIOS e-Anatomy, descrição institucional:
  <https://www.uni-muenster.de/MediBib/aktuelles/wiki/imaios-e-anatomy>

Os números de mercado vêm, em boa parte, de material da própria empresa ou de
terceiros. Eles orientam a ordem de grandeza e não servem como benchmark exato.
