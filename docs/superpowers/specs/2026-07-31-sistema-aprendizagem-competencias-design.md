# Spec de design — Sistema de aprendizagem por competências

- **Data:** 2026-07-31
- **Decisor:** Anderson (proprietário do produto), em brainstorming assistido
- **Status:** aprovada; fundações editoriais em execução
- **Plano:**
  [2026-07-31-sistema-aprendizagem-competencias.md](../plans/2026-07-31-sistema-aprendizagem-competencias.md)
- **ADR:**
  [ADR-2026-07-31](../../adr/ADR-2026-07-31-aprendizagem-por-competencias.md)

## 1. Resultado pretendido

Transformar o Radiant de uma trilha baseada principalmente em quizzes de
múltipla escolha em um sistema de microaprendizagem visual que desenvolve e
mede competências reais de estudantes iniciantes de técnico em radiologia.

O primeiro produto dessa arquitetura é a trilha **Fundamentos e Segurança
Radiológica**. A sessão principal cabe em **3 a 5 minutos**. O sucesso é medido
por domínio em checkpoints e retenção em revisões posteriores; frequência, XP
e sequência são mecanismos auxiliares.

## 2. Decisões aprovadas

| Dimensão | Decisão |
| --- | --- |
| Público inicial | estudante iniciante de técnico em radiologia |
| Primeira competência ampla | fundamentos, formação da imagem, equipamentos, parâmetros básicos e proteção radiológica |
| Duração principal | 3–5 minutos por sessão |
| Métrica primária | aprendizagem: domínio em checkpoint e retenção posterior |
| Modelo curricular | trilha espiral por competências |
| Revisão especializada | uma unidade completa por lote |
| Imagens | acervo próprio, autorizado, documentado e já anonimizado |
| Gamificação | não punitiva; erro não bloqueia estudo |
| Ranking global | fora da primeira fase |
| Vidas | não bloqueiam novas lições |

## 3. Estado atual verificado

### 3.1 O que deve ser preservado

- catálogo local-first e fallback remoto;
- jornada sequencial, desbloqueio, checkpoints e recompensas;
- registro de progresso, XP, sequência e meta diária;
- repetição espaçada SM-2;
- `LessonOutcomeService` e tentativas persistidas;
- pipeline editorial com proveniência até conceito, trecho e página;
- seis famílias editoriais: microlições, quizzes, revisões, casos,
  checkpoints e recompensas;
- funcionamento offline e sincronização tolerante à indisponibilidade da API.

### 3.2 Limitações que motivam a mudança

- a Wave 1 expõe 18 atividades: 2 lições manuais e 16 quizzes gerados a partir
  de uma única fonte;
- cada quiz gerado tem duas questões, mas o player usa uma interação por bloco;
- `LessonFlowService` exige de 2 a 4 passos e exatamente um passo
  `multiple-choice`;
- o domínio de conteúdo do app ainda é `QuizLesson`, mesmo quando a experiência
  desejada não é um quiz;
- a Galáxia usa `galaxy-catalog.ts`, com nós e status estáticos separados da
  jornada canônica;
- a taxonomia da Wave 1 associa conteúdos de física e equipamento a trilhas
  chamadas Tórax e Abdome;
- a validação editorial ainda encontra 42 marcações `needs-review`, originadas
  por 7 conceitos repetidos nos 6 formatos;
- a biblioteca contém 41 PDFs, mas apenas 36 arquivos únicos após a remoção
  lógica de cinco pares idênticos;
- licenças variam de Creative Commons e uso não comercial a livros comerciais
  com reprodução proibida.

### 3.3 Fundação implementada em 2026-07-31

- raízes de fontes e mídia autorizadas pela política de escrita do Loop;
- catálogo determinístico concluído: 41 PDFs, 36 fontes únicas e 5 duplicatas;
- direitos classificados: 4 `authorized`, 15 `reference-only`, 17 `blocked`;
- schema, manifesto e validadores de mídia entregues;
- primeiro lote ainda `awaiting-authorized-assets`, com 0 ativos aprovados e 5
  candidatos rejeitados;
- grafo das 30 competências e motor de atividades ainda não iniciados.

O manifesto vazio e válido prova que o bloqueio funciona; não equivale a mídia
pronta para uso editorial.

## 4. Princípios pedagógicos

1. **Competência antes de cobertura.** Um tópico entra porque aproxima o aluno
   de uma capacidade observável, não apenas porque existe num livro.
2. **Recuperação antes de releitura.** O aluno precisa produzir uma resposta,
   distinguir opções ou agir sobre uma imagem.
3. **Concreto antes do abstrato.** Imagem, equipamento ou situação abre espaço
   para a explicação conceitual.
4. **Feedback causal.** O feedback explica por que uma decisão altera
   segurança, dose ou qualidade; não se limita a certo/errado.
5. **Espiral.** Conceitos reaparecem em contextos e dificuldades diferentes.
6. **Erro informativo.** Erros geram reforço direcionado e evidência de domínio;
   não retiram acesso ao estudo.
7. **Segurança como gate.** Erros críticos de proteção não podem ser compensados
   por acertos triviais no checkpoint.
8. **Proveniência e revisão humana.** IA pode acelerar rascunhos, nunca substituir
   fonte rastreável e revisor especializado.

## 5. Arquitetura curricular

### Unidade 1 — Profissão e cultura de segurança

1. reconhecer atribuições e limites do técnico em radiologia;
2. confirmar identificação, preparo e comunicação segura com o paciente;
3. aplicar checklist e reconhecer condições inseguras;
4. proteger confidencialidade e agir eticamente;
5. registrar, comunicar e escalar incidentes pelo canal adequado.

### Unidade 2 — Matéria, energia e radiação

1. relacionar estrutura atômica, ionização e estabilidade;
2. distinguir radiação ionizante de não ionizante;
3. relacionar frequência, comprimento de onda e energia do fóton;
4. reconhecer o lugar dos raios X no espectro eletromagnético;
5. usar atenuação como ponte para formação da imagem.

### Unidade 3 — Produção dos raios X

1. localizar e explicar os componentes essenciais do tubo;
2. ordenar emissão termiônica, aceleração e desaceleração de elétrons;
3. distinguir radiação de freamento e característica em nível introdutório;
4. relacionar kVp e mAs a energia, quantidade e exposição;
5. explicar as funções de filtração, colimação e gerador.

### Unidade 4 — Interação e formação da imagem

1. diferenciar efeito fotoelétrico e espalhamento Compton;
2. prever radiopacidade a partir de atenuação diferencial;
3. explicar como o detector transforma exposição em imagem;
4. reconhecer como espalhamento prejudica contraste;
5. interpretar relações básicas entre tecido, densidade e aparência.

### Unidade 5 — Parâmetros e qualidade

1. prever efeitos básicos de kVp, mAs e distância;
2. relacionar SID, OID e foco a magnificação e nitidez;
3. distinguir contraste, resolução, ruído e artefato;
4. aplicar um checklist de adequação da imagem;
5. equilibrar qualidade, repetição e exposição sem decorar uma receita fixa.

### Unidade 6 — Proteção radiológica

1. aplicar justificação, otimização e limites no nível apropriado ao iniciante;
2. usar tempo, distância e blindagem em cenários práticos;
3. relacionar colimação e filtração à redução de exposição desnecessária;
4. distinguir proteção do paciente, equipe e acompanhante;
5. reconhecer situações que exigem interrupção, monitoramento ou escalonamento.

As competências formam um grafo de pré-requisitos. A ordem acima é a rota
recomendada, mas revisões e reforços podem misturar unidades já apresentadas.

## 6. Anatomia de uma sessão

Uma sessão de 3–5 minutos contém de 3 a 6 etapas:

1. **gancho visual** — imagem, equipamento ou risco concreto;
2. **tentativa inicial** — resposta antes de uma explicação longa;
3. **conceito essencial** — uma única relação causal;
4. **prática guiada** — dica disponível e feedback imediato;
5. **recuperação independente** — nova representação do mesmo conceito;
6. **fechamento** — síntese e indicação do próximo passo.

Nem toda sessão precisa usar todas as etapas. O contrato exige ao menos uma
evidência ativa e limita texto e carga cognitiva para caber no tempo-alvo.

## 7. Biblioteca inicial de interações

| Tipo | Evidência produzida | Uso principal |
| --- | --- | --- |
| `multiple-choice` | seleção e justificativa | compatibilidade e conceitos discriminativos |
| `hotspot` | região tocada | estruturas, componentes e riscos |
| `comparison` | imagem escolhida + razão | qualidade, colimação, exposição |
| `matching` | pares formados | parâmetro–efeito, componente–função |
| `ordering` | sequência ordenada | procedimento e cadeia de produção |
| `parameter-lab` | ajustes + previsão | relações entre parâmetros e resultado |
| `risk-hunt` | riscos identificados | cultura de segurança e proteção |
| `case-decision` | decisão + raciocínio | aplicação integrada em minicasos |

Os jogos são renderizadores do mesmo motor de atividades, não aplicativos
paralelos. Cada interação deve ter demonstração, prática com apoio e execução
independente. Novos tipos só entram quando uma competência não puder ser bem
avaliada pelos tipos existentes.

## 8. Domínio e adaptação

Cada competência tem os estados:

`not-started → introduced → practicing → retained → mastered`

| Evidência | Papel |
| --- | --- |
| prática guiada | apresentada/em prática |
| acerto independente | compreensão |
| aplicação em imagem ou caso | transferência |
| recuperação após intervalo | retenção |

O checkpoint exige pelo menos 80% no lote avaliado e nenhum erro crítico de
segurança. Falha gera uma rota curta de reforço pelas competências frágeis, não
repetição integral da unidade.

A repetição espaçada migra gradualmente de cartão por lição para cartão por
competência. Durante a transição, lições antigas continuam usando o contrato
legado. Uso de dica, tipo de evidência e histórico recente influenciam a próxima
recomendação; nenhum algoritmo deve ocultar do aluno por que uma revisão apareceu.

## 9. Gamificação

- XP representa prática significativa, sem prêmio repetido para exploração;
- sequência é sustentada por uma sessão curta e não usa linguagem de culpa;
- missões vêm de revisões vencidas e competências frágeis;
- selos exigem domínio ou retenção, não apenas conclusão;
- a Galáxia reflete progresso real do catálogo canônico;
- vidas podem continuar visíveis durante a migração, mas não bloqueiam estudo;
- ranking global permanece fora do escopo inicial.

## 10. Conteúdo, imagens e direitos

Cada fonte recebe título, autor, edição, data, assunto, origem, licença,
permissão comercial, escopo autorizado e data de revisão. Classes:

1. **uso autorizado** — texto, exercício ou imagem conforme a licença;
2. **referência factual** — consulta e conferência, com redação original;
3. **bloqueada** — origem, licença, atualidade ou qualidade insuficiente.

O acervo próprio de imagens usa manifesto separado: id, modalidade, região,
descrição acessível, autorização, confirmação de anonimização, arquivo e regiões
interativas normalizadas. A aprovação declarada nesta spec não elimina o gate
automatizado: arquivo sem manifesto ou com metadado divergente é bloqueado.

O lote editorial é uma unidade completa:

`competências → fontes → extração → redação original → atividades → validação automática → revisão especializada → beta → promoção`

Conteúdo sobre dose, proteção, atribuições profissionais ou conduta recebe
classificação crítica e exige nova aprovação após qualquer alteração material.

## 11. Arquitetura técnica

### Contrato de atividade v2

- união discriminada para os tipos da §7;
- metadados comuns: `id`, `competencyIds`, `completionRule`, `feedback`,
  `evidenceKind`, `criticalSafety`, `accessibility` e proveniência;
- registro de renderizadores por tipo;
- adaptador que converte o bloco legado em atividade v2 sem reescrever o
  catálogo inteiro numa única entrega;
- validação de schema antes da promoção editorial e novamente no app.

### Evidência e domínio

Uma tentativa registra apenas dados estruturados permitidos: atividade,
competência, resultado, dica, duração em faixa, versão de conteúdo e timestamp.
Não registra imagem clínica, resposta livre, identificador de paciente ou outro
texto com risco de dado sensível.

### Jornada e Galáxia

`LessonCatalogService`, `JourneyDefinitionService` e
`JourneyProgressService` continuam sendo fonte operacional. A Galáxia passa a
projetar esses dados; `galaxy-catalog.ts` deixa de governar conteúdo e status.

### Local-first

Catálogo essencial, mídia da unidade, progresso, domínio e revisões funcionam
offline. A sincronização usa eventos idempotentes e nunca bloqueia a conclusão.

## 12. Acessibilidade e segurança de uso

- nenhuma resposta depende só de cor;
- hotspots têm alvo mínimo e alternativa textual;
- matching e ordering oferecem controle acessível sem exigir arrastar;
- animações respeitam redução de movimento;
- imagens possuem descrição adequada ao objetivo sem revelar a resposta;
- feedback é anunciado uma única vez por leitor de tela;
- os fluxos críticos são validados em viewport curto e em dispositivo real;
- simulações são identificadas como didáticas, não como reprodução de um
  equipamento clínico específico.

## 13. Entrega e gates

1. **Fase 0 — fundações editoriais:** catálogo de fontes, mídia, competências e
   direitos.
2. **Fase 1 — motor educacional:** contrato v2, renderizadores, evidência,
   domínio e Galáxia canônica.
3. **Fase 2 — corte vertical:** Unidade 1 com 5 competências, 10–12 sessões,
   quatro tipos de interação e checkpoint.
4. **Fase 3 — beta pedagógico:** retenção posterior, acessibilidade e entrevista.
5. **Fase 4 — expansão:** outras cinco unidades em lotes revisados.
6. **Fase 5 — operação:** personalização, atualização de fontes e revalidação.

Cada fase tem gate próprio no plano de implementação. Nenhuma fase é declarada
concluída por quantidade de telas ou atividades; a evidência é contrato verde,
revisão registrada e, quando aplicável, resultado com aluno real.

## 14. Fora de escopo inicial

- laudo, diagnóstico médico ou substituição de treinamento supervisionado;
- upload de DICOM pelo usuário;
- reprodução de páginas ou imagens de livros comerciais;
- vídeos longos, comunidade, comentários ou ranking global;
- geração e publicação automática sem revisão;
- personalização por IA opaca;
- certificação profissional.

## 15. Referências de produto e aprendizagem

- [Duolingo Method](https://blog.duolingo.com/duolingo-teaching-method/) —
  prática ativa, sessões curtas e hábito;
- [Duolingo path e espaçamento](https://blog.duolingo.com/new-duolingo-home-screen-design/) —
  revisão distribuída dentro da rota;
- [Brilliant: abordagem](https://brilliant.org/about/) — interação visual,
  tentativa inicial e feedback progressivo;
- [Khan Academy Mastery](https://support.khanacademy.org/hc/en-us/articles/360007253831-What-is-self-paced-Mastery) —
  progressão por habilidade;
- [Karpicke e Roediger, 2008](https://doi.org/10.1126/science.1152408) —
  recuperação ativa e retenção;
- [Cepeda et al., 2008](https://doi.org/10.1111/j.1467-9280.2008.02209.x) —
  efeito do espaçamento;
- [Thompson e Hughes, 2023](https://pubmed.ncbi.nlm.nih.gov/37683816/) —
  revisão de espaçamento, intercalação e recuperação em educação radiológica.
