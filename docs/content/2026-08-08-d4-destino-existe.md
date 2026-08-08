# D4 — o destino passou a existir, e a população foi remedida

**Medido em 2026-08-08.** Sucede
[`2026-08-03-d4-medicao-cobertura-taxonomia.md`](2026-08-03-d4-medicao-cobertura-taxonomia.md),
que sucedeu [`2026-07-31-d4-triagem-editorial.md`](2026-07-31-d4-triagem-editorial.md).

## O que mudou desde a última medição

A medição de 2026-08-03 concluiu que estender o vocabulário do classificador
**pioraria** o dado, e a razão era precisa: *"os sete conceitos sinalizados não
têm nó de destino"*. Acrescentar palavra-chave moveria itens de `needs-review`
para "aprovado" **no endereço errado**, derrubando o único sinal de que eles não
tinham endereço nenhum.

Essa objeção **caiu em 2026-08-07**, quando a taxonomia recebeu o eixo técnico —
`galaxy-tecnologia` e seis planetas, com as 16 lições atribuídas
([desenho](../superpowers/specs/2026-08-07-taxonomia-eixo-tecnico-design.md)).
O destino existe. A pergunta que a D4 escalava ao dono foi respondida.

## A terceira cópia da taxonomia

Medido hoje, e é o que ainda segura a D4: **`scripts/content/classify-source.py`
carrega a taxonomia hardcoded em Python**, na versão `mvp-2026-04-04` — três
galáxias, seis planetas, seis estrelas, todos do eixo de interpretação. O
classificador **não conhece** `galaxy-tecnologia` nem nenhum dos seis planetas
novos.

Então o bloqueio registrado da D4 virou **falso na taxonomia e continua
verdadeiro no classificador**. Não é o mesmo bloqueio: antes o destino não
existia em lugar nenhum; agora ele existe e a ferramenta não o enxerga.

Vale nomear o padrão, porque é a terceira instância da mesma doença: a estrutura
de galáxias/planetas vive em **três cópias** — o JSON de governança, o catálogo
do app (desde 2026-08-08 com o vínculo gerado) e este dicionário Python. As duas
primeiras foram reconciliadas; esta não.

## A medição

Os 30 excertos `needs-review` de
`Conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/`, medidos
contra um vocabulário candidato para os seis planetas novos.

**O vocabulário candidato foi escrito a partir dos títulos e descrições dos
planetas, não do texto dos excertos.** Escrevê-lo olhando os excertos mediria a
capacidade de ajustar a regra ao gabarito, não a cobertura real do eixo.

| Resultado | Quantidade |
| --- | --- |
| **Sinal forte** — 2 ou mais termos do planeta | **19 de 30** |
| Sinal fraco — 1 termo | 8 |
| Sem sinal nenhum | 3 |

Distribuição dos 19, por planeta:

| Planeta | Excertos |
| --- | --- |
| `planet-fisica-da-radiacao` | 10 |
| `planet-equipamento` | 3 |
| `planet-producao-e-protecao` | 2 |
| `planet-imagem-na-pratica` | 2 |
| `planet-profissao-e-aplicacoes` | 2 |

## Os 4 defeitos de extração continuam no disco

A triagem de 2026-08-03 registrou, como achado lateral, que 4 dos 30 eram defeito
de extração e não de classificação — fragmentos abaixo de 80 caracteres, um deles
de **3 caracteres**.

O extrator foi corrigido em 2026-08-07: `chunk_text` emitia o resto da página
incondicionalmente, sem piso, e passou a reencostá-lo no pedaço anterior. Mas
**a extração desta fonte nunca foi regerada**, então os 4 fragmentos seguem
exatamente onde estavam. Confirmado hoje contando `charCount < 80` em
`Conteúdo/extrações/fundamentos-de-radiologia-everton-costa-pinto/excerpts.json`:
são 4, e o menor tem 3 caracteres.

Isso é trabalho de pipeline — reexecutar o extrator sobre a fonte —, não de
taxonomia nem de revisor, e some sem decisão de ninguém.

## O que a D4 virou

A medição decompõe a D4 em três fatias com donos diferentes, o que ela nunca teve:

| Fatia | Tamanho | Quem resolve |
| --- | --- | --- |
| Achariam destino com o classificador enxergando o eixo técnico | **19** | agente — estender `classify-source.py` |
| Defeito de extração | **4** | agente — reexecutar o extrator sobre a fonte |
| Resíduo real, sinal fraco ou nenhum | **~7** | revisor de domínio, e só aqui |

Antes disso, a D4 inteira estava escalada como "alocar revisor de radiologia" —
que a triagem de 2026-07-31 já dizia ser usá-lo para consertar dicionário. Agora
o revisor recebe **7 itens**, não 30, e recebe depois de o dicionário estar
consertado.

## O que trava a fatia de 19, medido depois

A fatia de 19 não é "estender o vocabulário". Medido em 2026-08-08, na segunda
passada, há **uma incompatibilidade de contrato** entre o classificador e a
taxonomia aprovada:

| Onde | O que diz |
| --- | --- |
| `Conteúdo/governança/esquemas/classification-record.schema.json` | `starId` é **obrigatório** e do tipo `string` — não aceita nulo |
| `validate-foundation.mjs:409` | reprova classificação cujo `starId` não exista na taxonomia |
| `classify-source.py:classify_excerpt` | indexa `PLANET_STAR_IDS[planet_id]` e `star_ids_for_planet[0]` **sem fallback** |
| Decisão do dono, 2026-08-07 | *"Os planetas novos ganham estrela? **Não.**"* |

Um excerto **não consegue pousar num planeta técnico**: o contrato exige que ele
chegue a uma estrela, e por decisão não existe estrela ali. As duas saídas são:

1. **tornar `starId` nulável** — muda schema, validador e a forma dos 109
   registros. É engenharia, não decisão de produto;
2. **criar estrelas para os seis planetas** — contradiz uma decisão aprovada, e
   pela razão que a própria decisão dá: estrela é trilha curta complementar, e
   não há nenhuma produzida. Criá-las seria criar promessa de currículo.

A saída 1 é a única compatível com o que foi decidido.

Há ainda um detalhe numérico que morde junto: a confiança combinada é
`0.5·galáxia + 0.3·planeta + 0.2·estrela`. Sem a parcela da estrela, planeta
sem estrela ficaria **sistematicamente abaixo** do limiar de 0,7 e cairia em
`needs-review` por construção — o oposto do objetivo. A fórmula precisa
renormalizar para `0.625·galáxia + 0.375·planeta` quando não há camada de
estrela, e isso precisa de teste próprio.

## O que este documento deliberadamente não faz

**Não estende o classificador nem reclassifica.** A medição precede a
implementação de propósito: a D4 já teve um "próximo passo" riscado em 2026-08-03
porque a medição mostrou que ele pioraria o dado, e repetir o padrão de decidir
antes de medir seria ignorar a própria lição do item.

Um obstáculo operacional a registrar para quem executar: `Conteúdo/classificação`
existe em `writePolicy.allowedRoots` **apenas na grafia minúscula do índice do
git**, e o disco soletra com maiúscula em NFD. Regerar a classificação exige
alargar a policy em run próprio e anterior, como foi feito para
`Conteúdo/taxonomia` em 2026-08-08.

## Como reproduzir

```bash
python3 -c "
import json
c=json.load(open('Conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/classifications.json'))
r=c['classifications'] if isinstance(c,dict) else c
print('needs-review:', sum(1 for x in r if x['reviewStatus']=='needs-review'), 'de', len(r))
e=json.load(open('Conteúdo/extrações/fundamentos-de-radiologia-everton-costa-pinto/excerpts.json'))['excerpts']
print('fragmentos <80 chars:', sum(1 for x in e if x['charCount']<80))
"
```
