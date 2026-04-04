# Radiant — Sistema de Geração Automática de Conteúdo

## 1. Objetivo

Definir o design do sistema que transforma a base editorial do Radiant (`conteúdo/`) em conteúdo pedagógico gerado automaticamente por IA, com curadoria humana seletiva, e entregue ao app via catálogo remoto.

O objetivo não é automatizar a escolha do que o aluno aprende. O objetivo é automatizar a transformação do que foi escolhido em formatos consumíveis — mantendo rastreabilidade, consistência pedagógica e qualidade auditável.

---

## 2. Escopo

Esta spec cobre:

- a arquitetura do Knowledge Graph de conceitos (grafo de dependências);
- o pipeline de detecção automática de dependências com validação humana seletiva;
- a geração de sequências de aprendizagem via ordenação topológica;
- o pipeline de geração pedagógica com templates versionados e LLM-as-judge;
- o painel editorial web local (separado do app);
- a promoção do conteúdo aprovado para o catálogo do app;
- a separação de responsabilidades entre modelos de IA.

Esta spec não cobre:

- implementação dos scripts individuais (tratada no plano de implementação);
- schema final dos arquivos JSON de artefatos;
- UI detalhada do painel editorial;
- integração de autenticação na API para promoção;
- política de licenciamento dos materiais de origem.

---

## 3. Contexto

O Radiant já possui o primeiro ciclo editorial completo:

- 1 fonte processada (`Fundamentos de Radiologia`);
- 109 excerpts extraídos e classificados;
- 16 conceitos canônicos normalizados;
- 96 bundles pedagógicos gerados em 6 formatos.

O gargalo atual não é a geração de conteúdo de um livro. É:

1. escalar para 30+ livros sem perder rastreabilidade;
2. garantir que o conteúdo gerado tem uma ordem de aprendizagem coerente;
3. evitar que o processo dependa de execução manual etapa por etapa;
4. garantir qualidade consistente entre gerações distintas ao longo do tempo.

A decisão central deste design: **a progressão do aluno não é gerada por IA de forma autônoma**. A IA sugere dependências entre conceitos com scores de confiança. O editor valida o que a IA não tem certeza. A sequência de aprendizagem emerge do grafo validado.

---

## 4. Princípios do sistema

### 4.1 Humano define o quê, IA define o como

O editor escolhe quais materiais entram no pipeline e cataloga as fontes. A IA transforma o conteúdo selecionado em formatos pedagógicos. A ordem de aprendizagem emerge do grafo de dependências validado pelo editor, não de uma decisão autônoma da IA.

### 4.2 Confiança como critério de intervenção humana

A IA opera autonomamente onde tem alta confiança (`>= 0.85`). Onde a confiança é baixa, o artefato vai para fila de revisão humana. O editor não revisa tudo — revisa o que importa.

### 4.3 Templates como memória de qualidade

A consistência pedagógica ao longo do tempo não depende de prompts ad-hoc. Depende de templates versionados por tipo de formato, com exemplos few-shot e restrições explícitas. Templates são artefatos do repositório, não strings hardcoded em scripts.

### 4.4 Promoção intencional, nunca automática

Nenhum conteúdo chega ao app sem passar pela ação explícita do editor no painel. A promoção é um ato deliberado, não um efeito colateral da geração.

### 4.5 Rastreabilidade até a fonte

Todo bundle aprovado e promovido ao catálogo deve conseguir responder: de qual livro veio, de quais excerpts nasceu, em qual posição da sequência de aprendizagem está, e com qual score de qualidade foi aprovado.

---

## 5. Arquitetura geral

O sistema é composto por três subsistemas com responsabilidades separadas:

```
[Pipeline Editorial]        [Painel Editorial Web]      [App Runtime]
  conteúdo/                   localhost:3001               radiant-api
  scripts/content/        →→→  revisão / aprovação    →→→  /v1/content/catalog
  grafo de conceitos           grafo + bundles              consumo no app
```

O pipeline editorial é o conjunto de scripts Python/Node existentes, estendido com novos scripts. O painel editorial é uma aplicação web Next.js que roda localmente, lê e escreve diretamente nos arquivos JSON de `conteúdo/`. O app runtime não muda — continua consumindo o catálogo via `LessonCatalogService` e `RemoteCatalogService`.

---

## 6. Knowledge Graph de Conceitos

### 6.1 O que é

O Knowledge Graph é a "esfera de conhecimento" do Radiant. Não substitui os arquivos de conceitos existentes em `conteúdo/conceitos/`. Adiciona uma camada de relacionamentos entre eles.

É um grafo dirigido acíclico (DAG) onde:

- **Nós** são os conceitos canônicos já normalizados;
- **Arestas** representam dependências: `A → B` significa "para entender B, o aluno precisa conhecer A";
- Cada aresta tem score de confiança e status de validação.

### 6.2 Armazenamento

```
conteúdo/
  governança/
    concept-graph.json        ← grafo de dependências
    embeddings/
      <concept-id>.json       ← vetor de embedding por conceito
    prompt-templates/
      microlição.md
      quiz.md
      review-card.md
      caso-clinico.md
      checkpoint.md
      reward.md
```

### 6.3 Schema de aresta

```json
{
  "from": "concept:atenuacao",
  "to": "concept:radiopacidade",
  "confidence": 0.92,
  "status": "auto-accepted",
  "reason": "radiopacidade é definida em termos de graus de atenuação diferencial"
}
```

Status possíveis: `auto-accepted`, `pending-review`, `human-validated`, `rejected`.

### 6.4 Embeddings para deduplicação cross-book

Cada conceito recebe um vetor de embedding gerado uma vez e armazenado localmente. Quando um novo livro é processado, o normalizador compara os conceitos candidatos com os embeddings existentes antes de criar novos conceitos. Similaridade coseno acima de `0.88` indica conceito duplicado — o novo trecho é associado ao conceito existente em vez de criar um novo nó.

Isso resolve o problema de escala: `janela pulmonar`, `janela para pulmão` e `windowing pulmonar` convergem para o mesmo conceito canônico.

---

## 7. Pipeline de detecção de dependências

### 7.1 Script: `suggest-dependencies.py`

Novo script responsável por:

1. ler todos os conceitos normalizados de `conteúdo/conceitos/`;
2. enviar batches de conceitos ao LLM com prompt de detecção de dependências;
3. receber arestas sugeridas com scores de confiança;
4. aplicar threshold:
   - `>= 0.85` → status `auto-accepted`, gravado diretamente no grafo;
   - `< 0.85` → status `pending-review`, vai para fila no painel editorial.

### 7.2 Modelo

Claude Haiku 4.5 — raciocínio semântico com bom custo-benefício para tarefa estruturada e repetitiva.

### 7.3 Prompt de detecção

O prompt instrui o modelo a analisar pares de conceitos e responder:

- se existe relação de dependência;
- em qual direção;
- com qual grau de confiança;
- com uma justificativa em uma linha.

O prompt é versionado como template em `conteúdo/governança/prompt-templates/`.

### 7.4 Rodando incrementalmente

O script deve rodar de forma incremental: ao adicionar um novo livro e novos conceitos, roda apenas os pares envolvendo os novos conceitos, não o grafo completo.

---

## 8. Ordenação topológica e sequência de aprendizagem

### 8.1 Script: `build-learning-sequence.py`

Após o grafo ter arestas suficientes validadas, este script:

1. lê `concept-graph.json`;
2. executa ordenação topológica (algoritmo de Kahn) dentro de cada trilha (`galáxia → planeta → estrela`);
3. produz `learning-sequence.json` com a ordem canônica dos conceitos;
4. detecta e reporta lacunas: conceitos referenciados como pré-requisito mas ausentes da base.

### 8.2 Output

```json
{
  "galaxy": "anatomia",
  "planet": "torax",
  "sequence": [
    "concept:anatomia-torax-basica",
    "concept:estruturas-mediastino",
    "concept:janela-pulmonar",
    "concept:padrao-intersticial"
  ],
  "gaps": []
}
```

### 8.3 Geração direciona conteúdo

O gerador pedagógico (`generate-formats.py`) consome `learning-sequence.json` para gerar bundles na ordem em que o aluno vai estudar. Isso garante que microlições, quizzes e reviews estejam alinhados com a progressão curricular, não com a ordem aleatória em que os conceitos foram extraídos dos livros.

---

## 9. Pipeline de geração pedagógica

### 9.1 Templates versionados

Cada tipo de formato tem seu próprio template de prompt em `conteúdo/governança/prompt-templates/`. Os templates definem:

- tom e registro linguístico adequado ao público (estudantes e técnicos de radiologia);
- estrutura esperada do output (ex: quiz com 4 alternativas, 1 correta, 1 distratora plausível);
- restrições explícitas (ex: "não mencione o nome do livro de origem");
- exemplos few-shot de bundles de alta qualidade.

Templates são versionados no repositório. Mudanças em templates devem ser registradas como decisão editorial.

### 9.2 Modelo

Claude Sonnet 4.6 — qualidade narrativa e pedagógica para o conteúdo que o aluno vai consumir.

### 9.3 LLM-as-judge

Após a geração de cada bundle, um passo automático de avaliação de qualidade:

- **Modelo:** GPT-4o-mini (tarefa estruturada de scoring, não precisa de geração criativa)
- **Critérios avaliados:**
  - clareza pedagógica (0.0–1.0)
  - coerência com o conceito fonte (0.0–1.0)
  - adequação ao formato (0.0–1.0)
- **Score médio `>= 0.70`** → bundle recebe status `approved`, disponível para promoção
- **Score médio `< 0.70`** → bundle recebe status `needs-review`, vai para fila no painel

O score e os critérios individuais são gravados junto ao bundle para auditoria.

---

## 10. Painel editorial web local

### 10.1 Stack

Aplicação Next.js rodando em `localhost:3001`. Sem banco de dados, sem servidor remoto. Lê e escreve diretamente nos arquivos JSON de `conteúdo/` via API routes locais do Next.js.

### 10.2 Três áreas principais

#### A. Revisão do grafo de dependências

- Visualização do grafo com conceitos e arestas
- Lista filtrada de arestas `pending-review`
- Para cada aresta: conceito origem, conceito destino, justificativa da IA, score de confiança
- Ações: **Aprovar** (→ `human-validated`) / **Rejeitar** (→ `rejected`) / **Editar** (ajustar direção ou justificativa)

#### B. Revisão de bundles pedagógicos

- Lista de bundles filtrada por status `needs-review` ou score de qualidade baixo
- Para cada bundle: formato, conceito de origem, trecho-fonte, livro, score do LLM-judge, preview do conteúdo
- Ações: **Aprovar** / **Rejeitar** / **Editar inline** (corrigir texto antes de aprovar)

#### C. Promoção para catálogo

- Painel de status: conceitos aprovados, bundles aprovados, última promoção
- Botão **Promover para catálogo** — executa `promote-to-catalog.js`
- Histórico de promoções com versão semântica e timestamp

### 10.3 Persistência

Todas as decisões tomadas no painel (aprovações, rejeições, edições) são gravadas diretamente nos arquivos JSON de `conteúdo/`. O painel não tem estado próprio — o estado é sempre os arquivos.

---

## 11. Promoção para o catálogo do app

### 11.1 Script: `promote-to-catalog.js`

Executado pelo painel editorial via botão de promoção:

1. lê todos os bundles com status `approved` de `conteúdo/formatos/`;
2. lê `learning-sequence.json` para ordenar os bundles na sequência curricular;
3. constrói o payload no formato esperado por `/v1/content/catalog`;
4. incrementa a versão do catálogo;
5. faz POST autenticado para a API ou salva localmente para deploy manual.

### 11.2 Regras de promoção

- Nunca substituir catálogo existente por payload inválido;
- Todo bundle promovido deve ter `conceptIds` e `sourceExcerptIds` preenchidos;
- A sequência de aprendizagem deve estar presente e sem ciclos;
- O catálogo promovido deve passar pela validação de `validate-foundation.mjs` antes do POST.

---

## 12. Separação de responsabilidades por modelo de IA

| Etapa | Modelo | Justificativa |
|---|---|---|
| Extração de texto / OCR de PDF | Gemini 2.0 Flash | Contexto longo nativo, lê PDF diretamente, custo muito baixo |
| Classificação taxonômica | GPT-4o-mini | Tarefa estruturada repetitiva, não precisa de raciocínio profundo |
| Geração de embeddings | text-embedding-3-small (OpenAI) | Custo mínimo, qualidade suficiente para similaridade semântica |
| Sugestão de dependências entre conceitos | Claude Haiku 4.5 | Raciocínio semântico com bom custo-benefício |
| Geração pedagógica (formatos) | Claude Sonnet 4.6 | Melhor qualidade narrativa e pedagógica |
| Avaliação de qualidade (LLM-as-judge) | GPT-4o-mini | Tarefa estruturada de scoring, sem necessidade de geração |

---

## 13. Onde o editor toca no processo

| Ponto de intervenção | O que o editor faz | Frequência esperada |
|---|---|---|
| Cadastrar fonte | Registrar livro e metadados em `conteúdo/fontes/` | Por livro novo |
| Validar dependências | Aprovar/rejeitar arestas `< 0.85` no painel | Por batch de conceitos novos |
| Spot-check de qualidade | Revisar bundles com score `< 0.70` no painel | Por ciclo de geração |
| Promover para catálogo | Clicar "Promover" no painel após revisão | Quando quiser publicar |

Tudo fora desses quatro pontos é automático.

---

## 14. Fluxo completo ponta a ponta

```
[Editor]
  1. Registra livro em conteúdo/fontes/
  2. Dispara pipeline de ingestão

[Pipeline automático]
  3. Gemini Flash extrai páginas e excerpts
  4. GPT-4o-mini classifica excerpts em galáxia → planeta → estrela
  5. Normalizador compara embeddings e deduplica conceitos
  6. Claude Haiku sugere dependências entre conceitos
     → confiança >= 0.85: auto-aceito no grafo
     → confiança < 0.85: fila de revisão no painel

[Editor]
  7. Revisa arestas pendentes no painel (área A)

[Pipeline automático]
  8. build-learning-sequence.py gera sequência topológica
  9. Claude Sonnet gera formatos pedagógicos na ordem da sequência
  10. GPT-4o-mini avalia qualidade de cada bundle
      → score >= 0.70: status approved
      → score < 0.70: fila de revisão no painel

[Editor]
  11. Revisa bundles com qualidade baixa no painel (área B)
  12. Clica "Promover" quando o catálogo estiver pronto (área C)

[Pipeline automático]
  13. promote-to-catalog.js valida e publica no radiant-api

[App]
  14. App consome catálogo via RemoteCatalogService
```

---

## 15. Critérios de sucesso

Este design será considerado bem implementado quando:

- um livro novo puder ser ingerido e gerar bundles aprovados sem intervenção manual além dos 4 pontos definidos;
- a sequência de aprendizagem gerada pelo grafo for coerente com a progressão curricular esperada;
- bundles de livros diferentes sobre o mesmo conceito convergissem para o mesmo nó do grafo;
- o painel editorial permitir revisão e promoção sem edição manual de arquivos JSON;
- todo bundle promovido ao app tiver proveniência rastreável até a fonte original.

---

## 16. Decomposição para implementação

A implementação deve ser planejada nas seguintes frentes independentes:

1. **Knowledge Graph e embeddings** — `concept-graph.json`, armazenamento de embeddings, deduplicação semântica no normalizador
2. **Pipeline de dependências** — `suggest-dependencies.py`, threshold de confiança, fila de revisão
3. **Ordenação topológica** — `build-learning-sequence.py`, detecção de lacunas
4. **Templates de geração** — arquivos de template por formato em `governança/prompt-templates/`
5. **LLM-as-judge** — passo de avaliação no `generate-formats.py`
6. **Painel editorial web** — aplicação Next.js local com as três áreas
7. **Script de promoção** — `promote-to-catalog.js` com validação e versionamento

Cada frente pode ser planejada e implementada independentemente. A ordem recomendada segue a numeração acima, pois cada frente depende das anteriores.

---

## 17. Decisões validadas nesta spec

- O Knowledge Graph usa DAG com arestas de dependência direcionadas.
- Threshold de confiança para auto-aceitação: `0.85`.
- Threshold de qualidade para auto-aprovação de bundles: `0.70`.
- Templates de prompt são versionados no repositório como arquivos Markdown.
- O painel editorial é uma aplicação Next.js local, sem banco próprio.
- A promoção ao catálogo do app é sempre um ato intencional do editor.
- A separação de modelos por etapa é obrigatória para controle de custo.
- Embeddings usam `text-embedding-3-small` da OpenAI por custo mínimo e qualidade suficiente.

---

## 18. Questões empurradas para o plano de implementação

- Schema JSON definitivo de cada artefato novo (`concept-graph.json`, embeddings, `learning-sequence.json`);
- Tamanho de batch para chamadas ao LLM de dependências;
- Estratégia de chunking semântico no extrator (tamanho e overlap);
- UI detalhada do painel editorial (componentes, layout, interações);
- Estratégia de autenticação para o POST de promoção na API;
- Política de versionamento semântico do catálogo promovido.
