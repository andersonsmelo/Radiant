# Fiação da cadeia de conteúdo — design

**Data:** 2026-08-07
**Estado:** desenho aprovado pelo dono (Seções 1 e 2), aguardando plano de implementação
**Antecede:** o plano de implementação a ser escrito por `superpowers:writing-plans`
**Relacionado:** [`2026-08-06-producao-continua-de-aulas-design.md`](2026-08-06-producao-continua-de-aulas-design.md)

## O problema, dito com precisão

As Tasks 1–8 entregaram oito funções puras de conteúdo — ancoragem, manifesto de
excertos, embeddings, relatório de calibração, estado de destino, fila de
amostragem e dois validadores. **Nenhuma tem ponto de entrada.** Todo o pipeline
anterior (`extract-source.py`, `generate-embeddings.py`, `promote-to-catalog.mjs`,
`validate-foundation.mjs`, `validate-media-manifest.mjs`) tem.

A linha divide exatamente onde o plano começou: o plano entregou uma
**biblioteca**; o que existia antes é **executável**. Não falta "um leitor aqui e
um produtor ali" — falta dar entrada. Nada precisa ser reescrito.

## O que o levantamento mediu, e não precisa ser refeito

Medido em 2026-08-07 contra o código e o disco, não contra documento herdado.

### As pontas são quatro, e a quarta não existe

**Ponta A — taxonomia.** Fiação real e pequena. `mapErrors` precisa de `map`,
`taxonomyIds` e `catalogIds`; os três estão em disco
(`content-manifest/taxonomy-catalog-map.json` com 16 entradas,
`Conteúdo/taxonomia/{estrelas,planetas,galaxias}.json`,
`Conteúdo/governança/catalog-payload.json`). Falta o ponto de entrada.

**Ponta B — manifesto de excertos.** O `rightsClass` **tem** produtor real:
`Conteúdo/fontes/library-catalog.json` classifica 36 fontes — 17 `blocked`,
15 `reference-only`, 4 `authorized`, todas as autorizadas com `verbatim-excerpt`
licenciado e arquivo presente em disco. O trabalho é dar entrada a
`build-manifest.py` e carregar a classe da fonte até o excerto.

**Ponta C — as `claims`.** Não é fiação: **não existe**. Os únicos lugares do
repositório que mencionam `claims` são os dois consumidores. `anchor_report`
recebe claims já com texto e vetor e atribui `excerptId` por similaridade — ele
ancora a afirmação, não a descobre. `ai-generate-formats.py` produz quizzes,
revisões e checkpoints, não afirmações ancoráveis. Sem produtor de claims, a
maquinaria de ancoragem não tem entrada, nunca. **É a ponta que sustenta as
outras duas.**

**Ponta D — o validador.** O validador `content-anchoring` do `project.yaml`
roda `node --test` sobre dois arquivos de teste. "11 validadores passaram"
significa "os testes unitários passam", **não** "o conteúdo está ancorado".

### O Ollama não bloqueia a cadeia

`generate-embeddings.py` usa `text-embedding-3-small` da OpenAI;
`ai-generate-formats.py` usa Claude para narrativa e `gpt-4o-mini` para formatos
estruturados. Ambos remotos. E `anchoringErrors` **não olha similaridade** — só
excerto presente, pertencimento ao manifesto, `rightsClass` e hash. Nenhum limiar
calibrado é necessário para fechar a cadeia. O motor local da Task 6 é economia e
privacidade, não pré-requisito.

### A única extração em disco é de fonte bloqueada

`Conteúdo/extrações/` tem um único diretório,
`fundamentos-de-radiologia-everton-costa-pinto`, com 109 excertos. A fonte é
`library-source:f375049d4e936d05`, classificada **`blocked`** ("No rights or
license notice found in the PDF"). Com o filtro de direitos na entrada, esses
109 excertos geram zero linhas de manifesto.

**Consequência para o plano:** o primeiro passo da fiação não é escrever runner.
É rodar `extract-source.py` — que já tem ponto de entrada — sobre o PDF do
piloto, que nunca foi extraído.

## Decisões tomadas

| Pergunta | Decisão |
| --- | --- |
| O validador ligado a dado real leria zero aulas e passaria verde por vacuidade | **Reprovar até existir dado.** Verde passa a significar "validei dados", nunca "não achei dados" |
| Mas isso trava todo `loop validate` até o dado existir | **A fiação produz o primeiro dado real.** Só então o validador estrito entra no `project.yaml`, já com o que validar |
| As claims não têm produtor. Por onde começar? | **Piloto com claims escritas à mão.** Uma aula, fonte autorizada, 5–10 afirmações humanas contra excertos reais. Zero capacidade nova de IA. O extrator por LLM fica para um plano seguinte, já com a cadeia viva para medi-lo contra |
| Onde o `rightsClass` filtra o manifesto? | **Na entrada, com relatório de descarte** — Seção 1 abaixo |

A fonte do piloto é `library-source:ed36a480d512d69a` (INCA, *Atualização em
Mamografia para Técnicos em Radiologia*, 2ª ed., CC BY-NC-SA 4.0), com
`allowedUses` incluindo `verbatim-excerpt` e `adaptation`.

## Seção 1 — artefatos e o caminho dos direitos

Cada função pura ganha um runner fino que carrega dado real, chama a função e sai
não-zero em erro. Passam a existir, sob `content-manifest/`:

- `excerpts/manifest.jsonl` e `excerpts/descartes.json`
- `embeddings/*.json`
- `lessons/<aula>.claims.json` e `lessons/<aula>.anchored.json`

### O `rightsClass` viaja da fonte para o excerto, e nunca é recalculado

A classe é lida do catálogo no **nascimento** do excerto e gravada na linha do
manifesto. Nenhum consumidor a jusante recalcula.

**Fontes não-`authorized` não geram linha.** Filtrar na entrada, em vez de gerar
linha que o validador depois recusa. Duas medições sustentam a escolha:

1. **A proteção não some; ela troca de nome.** Com o manifesto contendo só linhas
   `authorized`, uma claim apontando para excerto de fonte restrita não alcança o
   ramo `rightsClass !== 'authorized'`
   ([`validate-content-anchoring.mjs:15`](../../../scripts/content/validate-content-anchoring.mjs)) —
   ela morre no ramo anterior, `excerto fora do manifesto`
   ([linha 11](../../../scripts/content/validate-content-anchoring.mjs)). A aula é
   recusada do mesmo jeito. O que se perde é a precisão da mensagem, não a
   guarda.
2. **O ramo continua provado por mutação.**
   [`validate-content-anchoring.test.mjs:30`](../../../scripts/content/validate-content-anchoring.test.mjs)
   monta um manifesto sintético com `reference-only` e casa a mensagem. "Morto no
   dado real" não é "sem cobertura" — a mutação continua mordendo
   independentemente do que o pipeline produza.

Contra não filtrar pesa ainda que `manifest_line` calcula o hash a partir do
texto do excerto: não filtrar exigiria **extrair excerto de fonte `blocked`** só
para recusá-lo depois.

### O descarte é registrado, não silencioso

A informação que o ramo do validador daria não desaparece: ela **muda de
momento**. `descartes.json` registra, por fonte descartada, o identificador, a
classe e o motivo. Sai na construção em vez da validação.

Sem esse registro, quem roda o builder não vê quais fontes ficaram de fora nem
por quê — e um manifesto curto seria indistinguível de um manifesto correto.

## Seção 2 — pontos de entrada, gate e prova de mutação

### 2.1 Os runners

Todos seguem o padrão já existente em `extract-source.py`: `argparse`, `main()`,
`if __name__ == "__main__"`, resumo em JSON no stdout, saída não-zero em erro.
**Nenhuma função pura muda.**

| # | Runner | Lê | Escreve |
| --- | --- | --- | --- |
| 1 | `extract-source.py` *(já tem entrada)* | PDF do piloto | `Conteúdo/extrações/<slug>/{pages,excerpts}.json` |
| 2 | `build-manifest.py` **+ `main()`** | excerpts + `library-catalog.json` | `content-manifest/excerpts/manifest.jsonl` + `descartes.json` |
| 3 | `embed-excerpts.py` **+ `main()`** | manifesto + textos | `content-manifest/embeddings/*.json` |
| 4 | *(à mão)* | — | `content-manifest/lessons/<aula>.claims.json` |
| 5 | `anchor-lesson.py` **+ `main()`** | claims + embeddings + manifesto | `content-manifest/lessons/<aula>.anchored.json` |
| 6 | `validate-content-anchoring.mjs` **+ `main()`** | aula ancorada + manifesto | nada; sai não-zero se houver erro |

O runner 2 é onde a decisão da Seção 1 mora. O runner 5 monta o `allowed` que
`anchor_report` exige, que é exatamente `{excerptId: hash}` lido do manifesto —
assim a autorização e o hash entram na ancoragem pela mesma porta, e não por
duas.

As claims do piloto precisam de vetor, então passam pelo mesmo embedder do
runner 3.

**Ponta A é independente.** `validate-taxonomy-map.mjs` ganha `main()` que carrega
os três arquivos que já estão em disco. Não depende do piloto e pode ir antes.

### 2.2 Quando o validador estrito entra no gate

A ordem não é negociável:

```
runners  →  piloto produz o primeiro dado  →  validador verde sobre dado real,
fora do project.yaml  →  só então entra como validador do Loop
```

Invertida, o validador reprova todo `loop validate` do projeto e trava todas as
IAs até o dado existir.

Ele **não substitui** o validador `content-anchoring` atual — aquele roda
`node --test` sobre os testes unitários e continua. O que entra é um **segundo**
comando, sobre o dado. Os dois medem coisas diferentes, e hoje só o primeiro
existe.

### 2.3 Prova de mutação

Cada runner é código com ramos, e ramo sem mutação é ramo não provado.

| Ramo neutralizado | Teste que deve ficar vermelho |
| --- | --- |
| Filtro de direitos no runner 2 | O que afirma que fonte `blocked` não gera linha |
| Escrita de `descartes.json` | O que afirma que o descarte foi registrado — senão o relatório é decorativo |
| `needs_embedding` no runner 3 | O que afirma que a segunda passada não chama a API |
| Saída não-zero do runner 6 | O que afirma a falha do processo diante de erro de ancoragem |

Três armadilhas conhecidas, todas já pagas nesta branch:

- **Um teste de reaproveitamento só mede reaproveitamento se a primeira passada
  TIVER chamado.** Afirme que a chamada existiu antes de afirmar que ela sumiu
  (a lição do `ad79def`).
- **Casar a mensagem, nunca a contagem.** O próprio
  `validate-content-anchoring.test.mjs` carrega, nos comentários das linhas
  14–19, o defeito de 2026-08-06 em que `erros.length === 1` seguia verde com a
  guarda morta.
- **Fixture de dublê é tipado, nunca `as any`** — sem o tipo, o caminho feliz
  passa pelo `catch` e o teste fica verde pelo motivo errado.

## O que este desenho não cobre

**O eixo comercial dos direitos.** O código consulta um único campo do registro
de direitos, `rightsClass`, e a mensagem de erro fala em "autorização de
direitos" — o assunto inteiro. O catálogo registra **dois** eixos: a classe
(posso citar?) e `commercialUse` (posso citar num produto pago?).

Medido em 2026-08-07: **as quatro fontes `authorized` têm todas
`commercialUse: false`** — CC BY-NC-SA 4.0, CC BY-NC 4.0, "vedados venda e fins
comerciais" e "reprodução total ou parcial permitida com citação da fonte". E
`commercialUse` **não tem um único leitor a jusante**: é validado na escrita do
catálogo (`catalog-library-sources.mjs`) e nunca mais lido.

Isso **não bloqueia** a fiação — a cadeia se constrói igual, e o piloto produz o
mesmo dado. Bloqueia *embarcar* excerto verbatim num app com entitlement premium
(ADR-2026-08-01). É decisão do dono, com contorno jurídico, e está registrada
aqui para não ser assumida como resolvida por quem ler o validador verde.

**O extrator de claims por LLM.** Fica para um plano seguinte, por decisão
tomada: o piloto usa claims humanas, e a cadeia viva passa a ser o instrumento
contra o qual medir o extrator.

## Riscos

| Risco | Mitigação |
| --- | --- |
| O PDF do piloto extrai mal e os excertos saem ruidosos | `extract-source.py` já roda e é inspecionável antes de qualquer runner novo; a extração é o passo 1 justamente por isso |
| O validador estrito entra no gate cedo e trava as outras IAs | A ordem da 2.2 é parte do plano, não recomendação |
| O manifesto sai vazio e ninguém percebe | `descartes.json` mais o resumo em JSON no stdout de cada runner |
| Uma fonte é reclassificada depois e o manifesto guarda a classe antiga | O `rightsClass` da linha é snapshot por desenho; a reconstrução do manifesto é o momento de reconciliar, e o hash já detecta mudança de conteúdo |
