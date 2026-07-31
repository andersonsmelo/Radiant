# D4 — Triagem do gate editorial (2026-07-31)

> **O que este documento faz:** mede a população real do gate editorial antes de
> alocar revisor. A task D4 do
> [roadmap](../plans/2026-07-27-radiant-launch-roadmap.md) diz "triar os **42**
> itens `formatNeedsReview`". Os 42 existem, o número está certo, e ainda assim ele
> descreve mal o trabalho — nas duas direções.

## Medição

Rodado em 2026-07-31 sobre `scripts/content/validate-foundation.mjs`, com os
contadores do contrato como controle (`109`, `30`, `96`, `42` — todos conferiram):

| Camada | Total | `needs-review` |
| --- | --- | --- |
| Excertos classificados | 109 | **30** |
| Conceitos normalizados | 16 | **7** |
| Format bundles | 96 | **42** |

## Os 42 são 7 × 6

Os 42 bundles sinalizados se distribuem **exatamente 7 de 16 em cada um dos seis
formatos** (casos, checkpoints, microlições, quizzes, reviews, rewards), e os seis
formatos marcam **o mesmo conjunto de conceitos**. O campo de motivo está **vazio
nos 42**.

Isso não é julgamento por item: é o estado do conceito projetado nos seis formatos
gerados a partir dele. Triar "os 42" faria o revisor ler **o mesmo conceito seis
vezes**.

## Os 7 conceitos também são derivados

Cruzando cada conceito com a proporção de excertos-fonte sinalizados:

| Estado | Excertos | Sinalizados | Conceito |
| --- | --- | --- | --- |
| **needs-review** | 4 | 3 (75%) | Energia e matéria |
| **needs-review** | 4 | 3 (75%) | Tomografia computadorizada |
| **needs-review** | 7 | 4 (57%) | Acessórios radiológicos |
| **needs-review** | 4 | 2 (50%) | Preservação de alimentos por irradiação |
| **needs-review** | 8 | 4 (50%) | Processamento radiográfico |
| **needs-review** | 8 | 3 (38%) | Radioatividade, partículas e atividade |
| **needs-review** | 9 | 3 (33%) | Ressonância magnética |
| ok | 4 | 1 (25%) | Estrutura da matéria e núcleo atômico |
| ok | 4 | 1 (25%) | Profissão e atuação do técnico em radiologia |
| ok | 10 | 2 (20%) | Interação das radiações e proteção radiológica |
| ok | 12 | 2 (17%) | Aplicações radioisotópicas e medicina nuclear |
| ok | 7 | 1 (14%) | Equipamentos de radiologia convencional |
| ok | 11 | 1 (9%) | Qualidade de imagem |
| ok | 5 | 0 | Componentes básicos do equipamento |
| ok | 7 | 0 | Produção dos raios X |
| ok | 5 | 0 | Raios X: descoberta e propriedades |

A separação é limpa: **todo conceito sinalizado tem ≥33% de excertos sinalizados;
todo conceito aprovado tem ≤25%.**

## O que a contagem de 42 esconde

**Oito excertos sinalizados moram em conceitos aprovados** (2+1+1+2+1+1 nas linhas
"ok" acima). Eles não projetam sombra nenhuma na camada dos bundles: uma triagem
feita sobre os 42 — ou mesmo sobre os 7 conceitos — **não os alcança**.

Ou seja, a contagem de 42 erra nas duas direções ao mesmo tempo: pede seis vezes
mais leitura do que o necessário e ainda deixa 8 itens de fora.

## E a dúvida não é editorial

O motivo registrado nos 30 excertos não fala de conteúdo. Todos vêm da estratégia
`deterministic-keyword-v1`, e o que os marcou foi o classificador **cair em
fallback** ao posicionar o excerto na taxonomia:

- **13 dos 30** têm `fallback` nos **três** níveis (galáxia, planeta, estrela) — ou
  seja, nenhuma palavra-chave casou e o item foi para o destino padrão.
- Os demais casaram em um nível e caíram em fallback nos outros.
- Confiança dos sinalizados: **0,35 a 0,85, média 0,52**. Dos aprovados: **0,77 a
  0,98, média 0,91**.

A pergunta que esses itens fazem é *"este excerto está na galáxia/planeta/estrela
certa?"* — posicionamento na taxonomia. Não é *"este texto está clinicamente
correto?"*.

## Consequência para o plano

D4 está descrita como gate editorial com revisor de domínio (radiologia). A medição
diz que o trabalho tem duas partes com naturezas diferentes:

1. **Cobertura da taxonomia** — trabalho de engenharia de conteúdo, não de revisor
   clínico. Treze excertos sem nenhum sinal indicam vocabulário faltando na
   taxonomia, não texto ruim. Estender as palavras-chave e reclassificar reduz a
   população antes de qualquer humano ler.
2. **O resíduo** — o que continuar em fallback ou com confiança baixa depois disso é
   a fila real do revisor de domínio, e ela se conta em **excertos**, não em
   bundles.

**Ordem recomendada:** medir quanto da população cai só com cobertura de taxonomia,
e só então dimensionar a revisão humana. Fazer o inverso aloca um revisor de
radiologia para consertar um dicionário de palavras-chave.

**Não decidido aqui:** se a taxonomia deve ser estendida, e por quem. Isso é decisão
do dono e depende de o gate editorial bloquear ou não o lançamento — hoje ele não
bloqueia o closed test, só a produção.

## Nota sobre os números deste documento

Os quatro contadores (109, 30, 16/7, 96/42) foram medidos nesta data e conferem com
as asserções de `scripts/content/validate-foundation.test.mjs`. Se o conteúdo mudar,
esse teste falha junto — é por isso que quem mexer em conteúdo precisa levá-lo no
mesmo escopo. Para o valor de agora:

```sh
node scripts/content/validate-foundation.mjs
```
