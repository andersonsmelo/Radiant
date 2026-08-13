# D4 — Medição de cobertura da taxonomia (2026-08-03)

> **O que este documento faz:** executa o passo que a
> [triagem de 2026-07-31](2026-07-31-d4-triagem-editorial.md) recomendou —
> *"medir quanto da população cai só com cobertura de taxonomia, e só então
> dimensionar a revisão humana"* — e chega a uma conclusão diferente da que
> aquele documento previa. A previsão era **lacuna de vocabulário**. A medição
> diz **lacuna de destino**: os itens sinalizados não estão mal rotulados, estão
> sem nó para onde ir.
>
> Isto **não** decide estender a taxonomia. A triagem reservou essa decisão ao
> dono e ela continua reservada; o que muda é a pergunta que ele precisa
> responder.

## O que foi medido

Sobre `Conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classifications.json`
(109 classificações, 30 `needs-review`, estratégia `deterministic-keyword-v1`,
taxonomia `mvp-2026-04-04`) e as três tabelas de regras de
`scripts/content/classify-source.py`.

## A previsão da triagem estava parcialmente certa

O vocabulário **é** pequeno: **111 palavras-chave** somando galáxias, planetas e
estrelas. E os termos que os excertos sinalizados de fato usam quase não existem
nele — de 21 termos de domínio sondados, **20 não têm nenhuma regra**:

| Ausentes | `spin`, `magnetização`, `relaxamento`, `reator`, `nuclear`, `prata`, `revelador`, `latente`, `mamografia`, `dístico`, `teleradiografia`, `processadora`, `chumbo`, `irradiação`, `alimento`, `densidade`, `superexposição`, `chassi`, `película`, `Angra` |
| --- | --- |
| Presentes | `ressonância` |

O detalhe que resume o problema: `ressonância` está coberto, mas `spin`,
`magnetização` e `relaxamento` — as palavras que os excertos de RM realmente
usam — não estão.

## Mas estender o vocabulário não resolveria

**Toda a população de 109 excertos cabe em 4 folhas de taxonomia**, e 103 delas
em apenas duas:

| Destino | Excertos |
| --- | ---: |
| `galaxy-fisica / planet-formacao-imagem / star-artefatos-basicos` | 67 |
| `galaxy-fisica / planet-radiopacidade / star-dose-radiacao` | 36 |
| `galaxy-anatomia / planet-torax / star-coluna` | 5 |
| `galaxy-patologias / planet-patologia-toracica / star-pneumotorax` | 1 |

A taxonomia `mvp-2026-04-04` tem **3 galáxias, 6 planetas e 6 estrelas**, e
**todos os planetas e estrelas estão com `status: planned`** — só as galáxias
estão `active`. Os nós existentes descrevem radiologia torácica e abdominal
(Tórax, Abdome, Padrões Pulmonares, Pneumotórax, Síndrome Alveolar).

A fonte classificada é um **módulo de curso técnico** cujos 16 conceitos
incluem reatores nucleares, preservação de alimentos por irradiação,
processamento radiográfico com química de prata, acessórios de sala
(dísticos, números de chumbo, suporte para teleradiografia), medicina nuclear e
física de RM.

**Nenhum desses conceitos tem nó de destino.** Os sete conceitos sinalizados pela
triagem são exatamente esses. Acrescentar `dístico` às regras não colocaria o
excerto no lugar certo — colocaria no menos errado dos quatro que existem, e o
tiraria da fila de revisão ao fazê-lo.

Ou seja: **estender o vocabulário reduziria a contagem de `needs-review` sem
melhorar uma única classificação.** Faria o indicador melhorar e o dado piorar,
porque hoje o `needs-review` é o único sinal de que aquele excerto não tem
endereço.

## O que o sinal de confiança está medindo

Medido por item, e não por frequência de termo:

- dos 79 aprovados, **68 casaram ao menos um termo discriminante** e **11 se
  apoiam somente em termos genéricos** (`radiação`, `raios x`, `imagem`,
  `energia`, que aparecem em quase todo excerto de um livro de radiologia);
- a mediana de comprimento dos sinalizados é **586 caracteres**, contra
  **1283** dos aprovados — menos da metade.

O classificador **não** é ruído: na maioria dos casos ele casa algo específico.
O que a confiança mede bem é *"este texto tem vocabulário que eu reconheço"*.
O que ela não mede — e não tem como medir, com quatro destinos — é *"este texto
está no nó certo"*.

## Quatro dos 30 não são classificáveis por nenhum caminho

Além do problema de destino, a extração deixou fragmentos que nenhum
classificador resolve. Entre os 13 que caíram em `fallback` nos três níveis:

- um excerto cujo texto inteiro é a palavra **`são`**;
- `"figuras abaixo são apresentados alguns exemplos desse uso."`;
- `"qualidade do alimento e não deixa resíduos tóxicos."`;
- `"superexposição (aumenta a densidade radiográfica)."`

São caudas de frase separadas do contexto — **4 dos 30**, com menos de 80
caracteres. Pertencem à qualidade da extração, não à taxonomia nem à revisão
editorial, e nenhuma das duas frentes vai fazê-los desaparecer.

## O que isto muda na D4

A triagem de 07-31 já havia corrigido a task uma vez: de "42 bundles" para
"30 excertos", e de "revisão clínica" para "posicionamento na taxonomia". Esta
medição corrige de novo, um nível acima:

| Camada | O que a D4 dizia | O que a medição diz |
| --- | --- | --- |
| Unidade | 42 bundles | 30 excertos (07-31) |
| Natureza | revisão clínica | posicionamento (07-31) |
| Causa | vocabulário faltando | **destino faltando** |
| Ação | estender palavras-chave | **decidir o escopo da taxonomia** |

Das três frentes que a população contém, **nenhuma é revisão editorial de
radiologia**:

1. **~4 excertos** — defeito de extração (fragmentos). Trabalho de pipeline.
2. **~26 excertos** — sem nó de destino. Bloqueado pela decisão de escopo da
   taxonomia, não por vocabulário.
3. **0** — texto clinicamente duvidoso. Nada na população aponta para isso.

## A decisão que continua sendo do dono

Não é mais *"estender as palavras-chave, e por quem?"*. É:

> **A taxonomia de lançamento deve receber nós para o material de curso técnico
> (processamento, acessórios, medicina nuclear, RM, aplicações não médicas), ou
> esta fonte fica fora do currículo de lançamento?**

As duas saídas são defensáveis e têm custos diferentes. O que **não** é
defensável é a terceira, que é para onde a redação anterior da task apontava:
estender o vocabulário contra a taxonomia atual, ver o `needs-review` cair, e
tratar isso como progresso.

Contexto que pesa na decisão: a task **G1** registra que o grafo das 30
competências (Task 4) **não começou**, e é ele que definiria esses nós. D4 e G1
são o mesmo buraco visto de dois lados — D4 encontra o sintoma na classificação,
G1 é onde o destino seria criado. O gate editorial **não bloqueia o closed
test**; bloqueia produção.

## Como reproduzir

```sh
node scripts/content/validate-foundation.mjs
```

Os contadores de controle (`109`, `30`, `96`, `42`) são afirmados por
`scripts/content/validate-foundation.test.mjs`; se o conteúdo mudar, esse teste
falha junto, e este documento precisa ser remedido no mesmo escopo.
