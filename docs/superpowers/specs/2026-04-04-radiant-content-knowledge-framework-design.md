# Radiant — Arcabouço de Conhecimento e Pipeline Editorial

## 1. Objetivo

Definir o desenho do sistema editorial do Radiant para transformar livros e materiais de estudo em uma base de conhecimento cumulativa, classificada e reaproveitável.

O objetivo não é apenas armazenar fontes. O objetivo é permitir que o projeto:

- processe um livro por vez;
- extraia conhecimento de forma rastreável;
- organize esse conhecimento em uma taxonomia coerente do produto;
- gere formatos pedagógicos dinâmicos com apoio de IA;
- escale produção de conteúdo sem depender de autoria manual tela por tela.

---

## 2. Escopo desta spec

Esta spec cobre:

- a taxonomia editorial de alto nível do conteúdo;
- a função de `galáxias`, `planetas` e `estrelas`;
- a estrutura da nova pasta [`conteúdo/`](/Users/anderson/Documents/Radiant/conteúdo);
- as camadas editoriais entre fonte bruta e formato pedagógico;
- a arquitetura conceitual do pipeline de automação;
- as regras de governança, rastreabilidade e risco;
- o recorte inicial do MVP curricular.

Esta spec não cobre:

- implementação de scripts específicos;
- escolha final de modelos, provedores ou APIs de IA;
- schema definitivo de banco ou contrato final de API;
- rollout de UX dentro do app;
- política legal detalhada de direitos autorais ou licenciamento.

Esses pontos devem ser tratados em planos e specs complementares posteriores.

---

## 3. Contexto

O Radiant já possui:

- app mobile local-first;
- catálogo local inicial;
- Learning Road em evolução;
- runtime preparado para catálogo remoto;
- necessidade clara de expandir o conteúdo de forma muito mais rápida.

O gargalo atual não é apenas técnico. É editorial.

Hoje o produto ainda depende de sementes manuais e de conteúdo pequeno para alimentar quiz, review e jornada. Para crescer com consistência, o Radiant precisa de um arcabouço que trate materiais brutos como matéria-prima e converta isso em conhecimento estruturado do produto.

O usuário definiu a direção editorial desejada como:

- construir uma grande esfera de conhecimento;
- processando um livro por vez;
- extraindo o conteúdo por etapas;
- classificando esse conteúdo numa estrutura curricular comum;
- usando IA de forma quase autônoma para acelerar produção.

---

## 4. Princípios do sistema

### 4.1 Fonte real antes de derivação

O conhecimento do Radiant nasce dos livros e materiais. A taxonomia não existe como enciclopédia abstrata desconectada das fontes; ela existe como estrutura de classificação do que foi extraído.

### 4.2 Um livro por vez, uma esfera cumulativa

O processamento acontece por obra, mas o destino final é sempre uma base comum do Radiant. Cada novo material enriquece a mesma esfera editorial.

### 4.3 Taxonomia antes de publicação

Mesmo quando a extração parte de um livro, nada deve ser publicado como conteúdo solto. Todo trecho precisa ser classificado em `galáxia → planeta → estrela` antes de virar conceito ou formato.

### 4.4 Conceito como unidade canônica

Trechos de livros são matéria-prima. O ativo pedagógico canônico é o `conceito` consolidado, porque ele pode alimentar múltiplos formatos.

### 4.5 IA quase autônoma, mas auditável

A IA pode extrair, classificar, consolidar e gerar formatos, mas cada etapa deve deixar rastros claros:

- origem;
- confiança;
- conflitos;
- decisão tomada.

### 4.6 Rastreabilidade obrigatória

Todo formato pedagógico gerado deve conseguir responder:

- de qual material veio;
- de quais trechos nasceu;
- em que galáxia, planeta e estrela foi classificado;
- qual conceito fundamenta sua existência.

---

## 5. Modelo conceitual

### 5.1 Hierarquia editorial

O sistema editorial do Radiant terá quatro níveis principais:

- `Galáxia`: grande domínio curricular;
- `Planeta`: trilha longa principal dentro de uma galáxia;
- `Estrela`: trilha curta complementar, satélite ou especializada;
- `Conceito`: unidade canônica de conhecimento derivada de materiais.

### 5.2 Significado dos níveis

### Galáxia

Representa a divisão maior do conhecimento.

Exemplos previstos no MVP:

- Anatomia
- Física
- Patologias

### Planeta

Representa uma trilha longa principal. É um subtema robusto, recorrente e pedagogicamente central.

Exemplos possíveis:

- Tórax
- Abdome
- Bases físicas da formação da imagem
- Radiopacidade e densidade
- Padrões pulmonares

### Estrela

Representa uma trilha curta complementar. Pode ser satélite, aplicação pontual, recorte específico, ponte entre temas ou aprofundamento leve.

Exemplos possíveis:

- coluna torácica como satélite de anatomia axial;
- artefatos básicos como satélite de física;
- síndrome alveolar como satélite de patologias torácicas.

### Conceito

Representa a menor unidade editorial consolidada.

Exemplos:

- radiopacidade;
- atenuação;
- padrão intersticial;
- mediastino;
- janela pulmonar.

Um conceito pode ser apoiado por múltiplas fontes e reaproveitado em múltiplos formatos.

---

## 6. Estratégia de construção da esfera

O Radiant não começa com uma esfera pronta e depois encaixa livros nela.

O Radiant começa com:

- uma taxonomia inicial proposta;
- materiais reais entrando no pipeline;
- classificação desses materiais nessa estrutura;
- consolidação progressiva da esfera editorial.

Portanto:

- a taxonomia inicial existe para orientar classificação;
- a esfera final emerge do acúmulo normalizado do acervo processado;
- o mapa deve poder ser refinado conforme novos livros revelem lacunas, redundâncias ou melhores recortes.

Isso implica que a taxonomia é:

- estável o suficiente para orientar o trabalho;
- flexível o suficiente para evoluir com o acervo.

---

## 7. Recorte do MVP curricular

O primeiro ciclo não tentará cobrir toda a radiologia.

O MVP curricular desta iniciativa cobre 3 galáxias:

- `Galáxia Anatomia`
- `Galáxia Física`
- `Galáxia Patologias`

### 7.1 Objetivo do recorte

O objetivo desse recorte é validar:

- o modelo taxonômico;
- a organização dos artefatos em `conteúdo/`;
- o pipeline de extração e consolidação;
- a geração automática de formatos pedagógicos;
- o fluxo editorial livro por livro.

### 7.2 O que este MVP precisa provar

- que a estrutura `galáxia → planeta → estrela` é operacional;
- que um livro pode ser ingerido e produzir conceitos úteis;
- que esses conceitos podem gerar múltiplos formatos;
- que o sistema tolera materiais heterogêneos;
- que a automação é rápida sem perder rastreabilidade.

---

## 8. Estrutura da pasta `conteúdo/`

A nova raiz editorial será:

- [`/Users/anderson/Documents/Radiant/conteúdo`](file:///Users/anderson/Documents/Radiant/conteúdo)

Ela deve ser organizada por estágios de transformação e por destino editorial, não por livro como unidade soberana.

### 8.1 Estrutura recomendada

```text
conteúdo/
  fontes/
    <obra>/
  extrações/
    <obra>/
  taxonomia/
  classificação/
    <obra>/
  conceitos/
    anatomia/
    fisica/
    patologias/
  formatos/
    microlições/
    quizzes/
    reviews/
    casos/
    checkpoints/
    rewards/
  governança/
```

### 8.2 Papel de cada pasta

#### `fontes/`

Guarda o material original:

- PDF;
- EPUB;
- imagens;
- apostilas;
- notas estruturadas;
- metadados da obra.

Cada fonte precisa ser identificável como unidade editorial de origem.

#### `extrações/`

Guarda o material derivado diretamente da fonte:

- trechos extraídos;
- OCR bruto e limpo;
- seções e capítulos detectados;
- páginas ou posições de origem;
- score de confiança da extração.

#### `taxonomia/`

Guarda o mapa curricular vigente do MVP:

- galáxias;
- planetas;
- estrelas;
- regras de evolução da taxonomia.

#### `classificação/`

Guarda o resultado da IA ou da curadoria ao decidir onde cada trecho entra:

- galáxia atribuída;
- planeta atribuído;
- estrela atribuída;
- confiança da classificação;
- conflito ou ambiguidade.

#### `conceitos/`

Guarda os conceitos já consolidados e normalizados.

É aqui que a esfera editorial realmente toma forma.

#### `formatos/`

Guarda os artefatos pedagógicos gerados a partir dos conceitos:

- microlições;
- quizzes;
- review cards;
- casos clínicos curtos;
- checkpoints;
- rewards;
- explicações adaptativas.

#### `governança/`

Guarda as regras editoriais:

- glossário;
- critérios de qualidade;
- regras de deduplicação;
- critérios de confiança;
- política de revisão seletiva;
- política de proveniência.

---

## 9. Camadas editoriais do pipeline

O pipeline do Radiant deve operar em camadas, e cada camada responde a uma pergunta diferente.

### Camada 1: Fonte

Pergunta: `de onde veio isso?`

Artefato: obra original e seus metadados.

### Camada 2: Extração

Pergunta: `o que foi retirado do material?`

Artefato: trechos recuperados da obra.

### Camada 3: Classificação

Pergunta: `onde isso entra no mapa curricular?`

Artefato: vínculo entre trecho e taxonomia.

### Camada 4: Consolidação conceitual

Pergunta: `qual unidade de conhecimento isso fortalece?`

Artefato: conceito canônico.

### Camada 5: Geração pedagógica

Pergunta: `como isso vira experiência de aprendizagem?`

Artefato: formatos consumíveis pelo app e pelo backend.

Essa separação é obrigatória para evitar dois erros:

- conteúdo gerado sem vínculo claro com fonte;
- conteúdo gerado diretamente do trecho, sem passar por conceito.

---

## 10. Unidade mínima de trabalho

O usuário escolheu um pipeline híbrido em 3 níveis:

- `trecho do livro`
- `conceito normalizado`
- `lição/bloco pedagógico`

Portanto, a menor unidade editorial operacional do sistema não será a lição pronta.

Será o `trecho classificado`, que depois alimenta:

- conceito;
- e só depois formatos pedagógicos.

Isso preserva flexibilidade, porque o mesmo trecho ou conjunto de trechos pode gerar:

- uma microlição;
- um quiz;
- um caso curto;
- um card de revisão;
- um checkpoint;
- uma reward explanation.

---

## 11. Formatos pedagógicos-alvo

O pacote de formatos desejado para o pipeline inicial é amplo.

O sistema deve ser desenhado para gerar:

- `microlições`
- `quizzes`
- `review cards`
- `casos clínicos curtos`
- `checkpoints`
- `rewards`
- `explicações adaptativas`

### 11.1 Papel de cada formato

#### Microlições

Explicam um conceito em blocos curtos e progressivos.

#### Quizzes

Testam retenção imediata e discriminam entendimento.

#### Review cards

Reforçam repetição espaçada.

#### Casos clínicos curtos

Traduzem conceito em aplicação prática.

#### Checkpoints

Marcam síntese e passagem entre partes maiores da jornada.

#### Rewards

Expressam fechamento de progresso e reforço motivacional coerente com aprendizagem.

#### Explicações adaptativas

Ajustam linguagem ou foco com base em acerto, erro, contexto ou nível.

---

## 12. Arquitetura de automação recomendada

O sistema não deve ser pensado como um script único de “converter livro em quiz”.

Ele deve ser um pipeline modular em etapas especialistas.

### 12.1 Etapas especialistas

#### 1. Extrator

Responsável por:

- ler o material;
- recuperar texto e estrutura;
- quebrar em trechos úteis;
- sinalizar baixa confiança.

#### 2. Classificador taxonômico

Responsável por:

- mapear trechos em galáxia, planeta e estrela;
- detectar ambiguidades;
- sugerir novas lacunas taxonômicas.

#### 3. Normalizador de conceitos

Responsável por:

- deduplicar conceitos equivalentes;
- consolidar terminologia;
- conectar múltiplos trechos ao mesmo conceito.

#### 4. Gerador pedagógico

Responsável por:

- transformar conceitos em formatos consumíveis;
- produzir versões coerentes por tipo de uso.

#### 5. Validador de risco

Responsável por:

- medir confiança;
- detectar inconsistências;
- sinalizar conflito entre fontes;
- impedir publicação silenciosa de conteúdo arriscado.

### 12.2 Estratégia recomendada

Para o MVP, a arquitetura deve seguir a lógica de `pipeline por especialistas`, mas já deixar seus artefatos organizados de forma compatível com uma futura `base de conhecimento cumulativa`.

Ou seja:

- a operação do início é modular e sequencial;
- o desenho dos dados já prepara o sistema para enriquecimento progressivo da esfera.

---

## 13. Nível de autonomia da IA

O nível alvo de autonomia escolhido é:

- `IA quase autônoma`

Isso significa:

- a IA pode extrair, classificar, consolidar e gerar formatos;
- a revisão humana não desaparece;
- a revisão humana é direcionada por risco, exceção e baixa confiança.

### 13.1 Regras para essa autonomia

A IA nunca deve ser uma caixa preta editorial.

Cada decisão automática precisa deixar pelo menos:

- motivo resumido;
- score de confiança;
- origem utilizada;
- vínculo com conceito;
- indicação se houve conflito.

### 13.2 Revisão humana seletiva

O sistema deve priorizar revisão quando houver:

- OCR ruim;
- classificação ambígua;
- conflito entre trechos ou fontes;
- conceito novo muito central;
- geração pedagógica com baixa confiança;
- material de origem indefinida ou potencialmente sensível do ponto de vista de uso.

---

## 14. Heterogeneidade dos materiais

O sistema precisa assumir desde o início que os materiais podem ser:

- PDFs digitais selecionáveis;
- PDFs escaneados;
- imagens;
- apostilas;
- materiais mistos e mal estruturados.

Portanto, o pipeline precisa tolerar:

- extração perfeita;
- OCR parcial;
- estrutura de capítulos incompleta;
- materiais com ruído.

Essa tolerância deve existir no desenho do pipeline, e não como exceção tratada depois.

---

## 15. Proveniência, risco e governança

O usuário informou que o acervo inicial pode ser misto em termos de origem.

Portanto, a governança editorial precisa nascer junto com o pipeline.

### 15.1 Proveniência obrigatória

Cada obra deve registrar, no mínimo:

- identificador interno;
- tipo de material;
- origem declarada;
- status editorial;
- observações de uso.

### 15.2 Regras de uso dentro do sistema

O pipeline não deve tratar todas as fontes como igualmente publicáveis.

Ele deve distinguir entre:

- material apto para uso editorial interno;
- material apto para inspiração e consolidação conceitual;
- material que exige revisão adicional antes de qualquer derivação publicada.

### 15.3 Governança mínima do MVP

Antes de escalar ingestão, o MVP precisa ter:

- glossário mínimo;
- taxonomia inicial;
- política de deduplicação;
- política de confiança;
- política de proveniência;
- política de revisão seletiva.

---

## 16. Impacto no produto

Esse arcabouço muda o Radiant em quatro frentes:

### 16.1 Produto

O Radiant deixa de depender de sementes estáticas pequenas e passa a ter uma fábrica editorial escalável.

### 16.2 Conteúdo

O conteúdo deixa de ser um conjunto manual de lições isoladas e passa a ser derivado de uma base de conhecimento comum.

### 16.3 Engenharia

O projeto ganha uma nova superfície estruturada, que futuramente poderá alimentar:

- catálogo local;
- catálogo remoto;
- sincronização com backend;
- tooling editorial;
- geração assistida de conteúdo.

### 16.4 Operação

O trabalho editorial passa a ser repetível:

- entra um livro;
- sai conhecimento classificado;
- saem formatos pedagógicos;
- e tudo permanece rastreável.

---

## 17. Critérios de sucesso da iniciativa

Esta iniciativa será considerada bem desenhada quando permitir:

- processar um livro do início ao fim sem colapsar em conteúdo solto;
- classificar trechos num mapa curricular utilizável;
- consolidar conceitos reaproveitáveis;
- gerar pelo menos os formatos pedagógicos centrais do produto;
- manter rastreabilidade até a fonte;
- operar de forma incremental, livro por livro.

No MVP, o sucesso não exige cobertura total da radiologia.

Exige provar que o sistema é editorialmente coerente e operacionalmente escalável.

---

## 18. Decomposição recomendada para planejamento posterior

Embora esta spec descreva um único sistema, a implementação deve ser planejada em frentes separadas.

A decomposição recomendada é:

1. taxonomia editorial do MVP;
2. estrutura física da pasta `conteúdo/` e contratos de artefato;
3. pipeline de ingestão e extração;
4. pipeline de classificação e consolidação conceitual;
5. pipeline de geração de formatos pedagógicos;
6. integração futura com catálogo do app/API.

Essa decomposição é importante para evitar que a implementação vire um bloco único grande demais.

---

## 19. Decisões validadas nesta spec

- A estrutura editorial será construída a partir de livros e materiais.
- O sistema trabalhará com `galáxias`, `planetas`, `estrelas` e `conceitos`.
- `Planeta` significa trilha longa principal.
- `Estrela` significa trilha curta complementar ou satélite.
- O MVP curricular inicial terá 3 galáxias: Anatomia, Física e Patologias.
- A pasta nova será [`conteúdo/`](/Users/anderson/Documents/Radiant/conteúdo).
- A organização será centrada em taxonomia e estágios editoriais, não em silo por livro.
- O pipeline trabalhará em camadas: fonte, extração, classificação, conceito e formato.
- A IA operará em modo quase autônomo, com revisão humana seletiva por risco.
- O sistema deve tolerar materiais heterogêneos e proveniência mista.

---

## 20. Perguntas deliberadamente deixadas para o plano

Estas questões não estão indefinidas; elas foram conscientemente empurradas para o plano de implementação:

- formato de arquivo de cada artefato;
- naming conventions finais;
- schema concreto de taxonomia;
- schema concreto de conceito;
- schema concreto de formatos pedagógicos;
- comandos, scripts e automações;
- integração com `radiant-app` e `radiant-api`;
- ferramentas concretas de OCR, classificação e geração.

Isso preserva esta spec como documento de desenho e evita misturar arquitetura conceitual com execução técnica detalhada.
