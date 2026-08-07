# Eixo técnico da taxonomia — design

**Status:** ✅ **APROVADO pelo dono em 2026-08-07.** Os dois julgamentos que
seguravam o documento foram decididos — ver *"Os dois julgamentos"* abaixo — e
uma premissa foi corrigida na medição que precedeu a aprovação: existem **dois
catálogos** deste universo, e este desenho raciocinava sobre um. Ver *"Os dois
catálogos"*. Implementação pelo
[plano de 2026-08-07](../plans/2026-08-07-taxonomia-eixo-tecnico.md).

Ele existe porque o desenho estava inteiro no contexto de uma sessão, que é o
armazenamento menos durável da pilha — a mesma lição que abriu o
[status canônico de 2026-08-07](../../EXECUTION_STATUS_2026-08-07.md).

**Fecha, quando aprovado:** o item "escopo da taxonomia" da lista do dono, o
**D4** (gate editorial, P0, bloqueia produção) e dá base à **Task 4 da G1**
(grafo das 30 competências, não iniciada).

## O problema, medido

Há **dois currículos** no repositório e eles não se encontram:

| | O que é |
| --- | --- |
| **Taxonomia** (15 nós) | Interpretação de imagem: tórax, abdômen, radiopacidade, padrões pulmonares, patologia torácica |
| **As 16 lições `ai-lesson:`** | Curso técnico: profissão, física da radiação, produção de raios X, equipamento, TC, RM, medicina nuclear, processamento, qualidade de imagem |

As lições ensinam *como a máquina funciona e como operá-la*; a taxonomia organiza
*como ler a imagem resultante*. Por isso **os 16 mapeavam para `null`**, e os
`rationale` do mapa diziam isso literalmente — *"nenhuma das 6 estrelas cobre o
domínio de acessórios/equipamento"*. Essa frase era o `rationale` de 2026-08-07;
a execução reescreveu todos os 16, e a string não existe mais em nenhum lugar do
repositório.

Medições que sustentam o desenho — **estado medido em 2026-08-07, antes deste
desenho ser executado**, salvo indicação em contrário. É o estado que
justificou a decisão, não o estado atual: a execução mudou os dois pontos
marcados abaixo. Para o estado corrente, rode
`node scripts/content/validate-taxonomy-map.mjs`.

- **Só 1 dos 16 era candidato real** a um nó existente:
  `interacao-das-radiacoes-e-protecao-radiologica` × `star-dose-radiacao`.
  Mantido `null` por princípio — a estrela é `status: planned`, e mapear ligaria
  catálogo a promessa de currículo.
- **Todos os planetas e estrelas estavam `planned`.** Só as 3 galáxias eram
  `active`. O eixo de interpretação era planejado e não construído. **Isto
  mudou com a execução:** a nova galáxia e os seis planetas novos nasceram
  `active` — ver "Decisões do dono" abaixo.
- **O eixo técnico é construído e não mapeado:** as 16 lições embarcam hoje, numa
  trilha só, `track-ai-fundamentos` — *"Fundamentos de Radiologia (IA)"* — em
  ordem pedagógica. Nada está quebrado para o usuário.
- A **D4** mediu o mesmo buraco pelo outro lado (2026-08-03): 109 excertos caem
  em 4 folhas, 103 em duas. Causa registrada: **"destino faltando"**. Ação
  registrada: **"decidir o escopo da taxonomia"**.
- `mapErrors` só exige que o `taxonomyId` exista no conjunto unido de
  galáxias + planetas + estrelas — não olha nível nem status — e exige que
  **todos** os 16 `ai-lesson:` tenham entrada no mapa.

## Decisões do dono, tomadas em 2026-08-07

| Pergunta | Decisão |
| --- | --- |
| Qual é o currículo de lançamento? | **A taxonomia cresce para o eixo técnico.** O conteúdo que existe, está autorizado, foi extraído e já embarca é técnico; a taxonomia é aspiração com 12 de 15 nós `planned` |
| Um nó significa currículo entregue ou pretendido? | **Entregue.** Os nós do eixo técnico nascem `active` porque as lições existem; os de interpretação seguem `planned`. A regra "não mapear para promessa" continua valendo e passa a distinguir os dois eixos por si |
| Galáxia nova para tudo, ou estender a existente? | **Estender `galaxy-fisica` + uma galáxia nova.** Evita duas galáxias falando de física, ao custo de quebrar o ritmo de 2 planetas por galáxia |
| Os planetas novos ganham estrela? | **Não.** Estrela é trilha curta complementar, e não há nenhuma produzida — criá-las seria criar as promessas que a semântica de "entregue" acabou de recusar |

## Estrutura proposta

Seis planetas novos, **nenhuma estrela**, nenhuma galáxia removida:

```
galaxy-fisica  (active, existente)
  planet-formacao-imagem         planned   (existente, intocado)
  planet-radiopacidade           planned   (existente, intocado)
  planet-fisica-da-radiacao      ACTIVE    ← 4 lições
  planet-producao-e-protecao     ACTIVE    ← 2 lições

galaxy-tecnologia  (ACTIVE, id já reservado no app — título "Tecnologia em Imagem")
  planet-equipamento             ACTIVE    ← 3 lições
  planet-modalidades             ACTIVE    ← 3 lições
  planet-imagem-na-pratica       ACTIVE    ← 2 lições
  planet-profissao-e-aplicacoes  ACTIVE    ← 2 lições
```

Forma dos registros, seguindo o que já existe em `Conteúdo/taxonomia/`:
planeta tem `id`, `galaxyId`, `slug`, `title`, `description`, `trackKind:
"long-form"` e `status`.

## As 16 atribuições

| Planeta | Lições (`ai-lesson:` omitido) |
| --- | --- |
| `planet-fisica-da-radiacao` | `energia-e-materia` · `estrutura-da-materia-e-nucleo-atomico` · `radioatividade-particulas-e-atividade` · `raios-x-descoberta-e-propriedades` |
| `planet-producao-e-protecao` | `producao-dos-raios-x` · `interacao-das-radiacoes-e-protecao-radiologica` |
| `planet-equipamento` | `equipamentos-de-radiologia-convencional` · `componentes-basicos-do-equipamento` · `acessorios-radiologicos` |
| `planet-modalidades` | `tomografia-computadorizada` · `ressonancia-magnetica` · `aplicacoes-radioisotopicas-e-medicina-nuclear` |
| `planet-imagem-na-pratica` | `processamento-radiografico` · `qualidade-de-imagem` |
| `planet-profissao-e-aplicacoes` | `profissao-e-atuacao-do-tecnico-em-radiologia` · `preservacao-de-alimentos-por-irradicao` |

4 + 2 + 3 + 3 + 2 + 2 = **16**.

## Os dois catálogos — a premissa que a medição corrigiu

Medido em 2026-08-07, antes da aprovação. Há **duas** descrições deste universo,
e elas não se encontram:

| | `Conteúdo/taxonomia/*.json` | `radiant-app/src/data/galaxy-catalog.ts` |
| --- | --- | --- |
| Quem lê | só validadores (`validate-foundation`, `validate-taxonomy-map`, testes) | as três telas de galáxia — **é o que o usuário vê** |
| Galáxias | anatomia, fisica, patologias | anatomia, fisica, **casos**, **tecnologia** |
| Título de `galaxy-fisica` | "Fundamentos" | "Física Radiológica" |
| Planetas | 2 + 2 + 2 | 5 corpos em anatomia, **0 nas outras três** |

Três consequências, e as três entraram nas decisões abaixo:

1. **`galaxy-tecnologia` não é um id novo.** Já existe em
   `radiant-app/src/data/galaxy-catalog.ts:204`, com título *"Tecnologia em
   Imagem"*, emoji, cor, posição no mapa, `status: 'locked'` e `bodies: []` — um
   slot reservado esperando exatamente este conteúdo. O passo não é *criar*, é
   *preencher*.
2. **O "ritmo de 2 planetas por galáxia" vale num arquivo e já está quebrado no
   outro** — e o custo é só estético: `GalaxyInteriorScreen.tsx:244` itera
   `galaxy.bodies` sem contagem fixa, e a única sensibilidade a tamanho é o
   `if (available.length < 2)` da linha 152, que só decide desenhar as linhas de
   conexão. Nenhum layout depende de serem dois.
3. **O argumento que recusou a segunda galáxia de física falava do usuário e se
   apoiava no id.** O usuário nunca vê `galaxy-fisica`; vê "Fundamentos" ou
   "Física Radiológica". Sob "Fundamentos", os quatro planetas cabem sem
   fronteira sutil nenhuma.

**Consequência boa para o risco de executar:** como o app lê o outro arquivo, nó
nascendo `active` aqui **não muda nada para o usuário hoje**. Este desenho move a
governança, não o produto. A reconciliação dos dois catálogos é trabalho próprio,
não escopado aqui.

## Os dois julgamentos — DECIDIDOS em 2026-08-07

**Estes eram os pontos em que a conversa parou.** Ambos aprovados pelo dono, com
a medição acima na mesa:

1. **`preservacao-de-alimentos-por-irradicao` fica em
   `planet-profissao-e-aplicacoes`.** É aplicação não-médica da radiação — nem
   imagem nem equipamento. O planeta já se chama "profissão e aplicações", então
   ela não é exceção escondida: o nome do planeta declara que ali cabe aplicação.
   A alternativa considerada, forçá-la na física, foi recusada.
2. **`galaxy-fisica` passa de 2 para 4 planetas.** O custo é estético e
   pedagógico, e nada mais — medido no renderizador, acima. A alternativa de uma
   segunda galáxia de física foi recusada: além da fronteira sutil, ela levaria o
   JSON a 5 galáxias contra 4 no app, **ampliando** a divergência entre os dois
   catálogos em vez de reduzi-la.
3. **`galaxy-tecnologia` preenche o slot existente e herda o título "Tecnologia
   em Imagem".** Decisão tomada junto, já com a descoberta do slot. Converte uma
   divergência em convergência de graça: no dia em que os catálogos forem
   unificados, esta galáxia já bate nos dois lados.

## O que não muda

Nenhuma estrela é criada; as 6 existentes seguem `planned`; os 2 planetas de
interpretação seguem `planned`; o bundle do app não é tocado; nenhuma lição sai
do catálogo; `catalog-payload.json` não é alterado.

## Critério de saída

```bash
node scripts/content/validate-taxonomy-map.mjs
```

Sai de **16 `taxonomyId: null` para zero**, com `errors: []`.

Linha de base medida em 2026-08-07, rodando o comando acima **antes** de
qualquer mudança:

```json
{ "mapEntries": 16, "taxonomyIds": 15, "catalogIds": 18, "errors": [] }
```

E `taxonomyIds` sobe por soma explícita: **15 hoje + 1 galáxia + 6 planetas =
22**. *(Correção de 2026-08-07: a primeira versão deste documento dizia "15 para
21" — a conta somou os seis filhos e esqueceu o pai. Um critério de saída parece
consequência mecânica do que ficou decidido acima, e por isso escapa da
conferência que o mesmo número receberia como premissa. `mapEntries` e
`catalogIds` não mudam: nenhuma lição entra ou sai.)*

## Fora deste desenho

**`wave-1-priority-tracks.json` distribui as 16 lições em trilhas com nome de
anatomia onde elas não pertencem** — `track-abdomen-essentials` contém
`preservacao-de-alimentos-por-irradicao`, e `track-thorax-patterns` não tem nada
de tórax. É artefato de **planejamento**, não o que embarca: o bundle tem uma
trilha só e coerente. Mas é o arquivo que o validador de taxonomia lê como
catálogo, então vale corrigir — em trabalho próprio, não neste.
