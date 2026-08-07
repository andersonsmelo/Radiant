# Eixo técnico da taxonomia — design

**Status:** ⚠️ **RASCUNHO — apresentado ao dono em 2026-08-07 e NÃO aprovado.**
A conversa terminou na pergunta de aprovação. Nada foi implementado, e nada deve
ser implementado antes que este documento seja aprovado.

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
*como ler a imagem resultante*. Por isso **os 16 mapeiam para `null`**, e os
`rationale` do mapa dizem isso literalmente — *"nenhuma das 6 estrelas cobre o
domínio de acessórios/equipamento"*.

Medições que sustentam o desenho, todas de 2026-08-07 salvo indicação:

- **Só 1 dos 16 era candidato real** a um nó existente:
  `interacao-das-radiacoes-e-protecao-radiologica` × `star-dose-radiacao`.
  Mantido `null` por princípio — a estrela é `status: planned`, e mapear ligaria
  catálogo a promessa de currículo.
- **Todos os planetas e estrelas estão `planned`.** Só as 3 galáxias são
  `active`. O eixo de interpretação é planejado e não construído.
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

galaxy-tecnologia  (ACTIVE, nova)
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

## Os dois julgamentos que precisam de aprovação explícita

**Estes são os pontos em que a conversa parou**, e são a razão de este documento
não estar aprovado:

1. **`preservacao-de-alimentos-por-irradicao` não é imagem nem equipamento.** É
   aplicação não-médica da radiação. Foi posta com `profissao` sob "profissão e
   aplicações", o rótulo mais honesto encontrado. A alternativa considerada era
   forçá-la na física.
2. **`galaxy-fisica` passa de 2 para 4 planetas**, quebrando o ritmo de 2 por
   galáxia que as três galáxias existentes seguem. A alternativa era criar uma
   segunda galáxia de física, recusada porque a fronteira entre "física da
   radiação" e "formação de imagem" seria sutil demais para o usuário.

## O que não muda

Nenhuma estrela é criada; as 6 existentes seguem `planned`; os 2 planetas de
interpretação seguem `planned`; o bundle do app não é tocado; nenhuma lição sai
do catálogo; `catalog-payload.json` não é alterado.

## Critério de saída

```bash
node scripts/content/validate-taxonomy-map.mjs
```

Sai de **16 `taxonomyId: null` para zero**, com `errors: []`, e `taxonomyIds`
sobe de **15 para 21**.

## Fora deste desenho

**`wave-1-priority-tracks.json` distribui as 16 lições em trilhas com nome de
anatomia onde elas não pertencem** — `track-abdomen-essentials` contém
`preservacao-de-alimentos-por-irradicao`, e `track-thorax-patterns` não tem nada
de tórax. É artefato de **planejamento**, não o que embarca: o bundle tem uma
trilha só e coerente. Mas é o arquivo que o validador de taxonomia lê como
catálogo, então vale corrigir — em trabalho próprio, não neste.
