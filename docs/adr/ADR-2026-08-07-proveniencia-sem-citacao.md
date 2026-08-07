# ADR — A cadeia de conteúdo entrega proveniência, não citação (2026-08-07)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto), ao autorizar os quatro passos
desta correção em 2026-08-07
**Fecha:** o item "eixo comercial dos direitos", aberto em 2026-08-07 no
[status canônico](../EXECUTION_STATUS_2026-08-07.md) como a decisão de maior
alcance da lista
**Não é:** parecer jurídico. Ver "O que este ADR não decide".

## Contexto

O item pendente pedia uma decisão nestes termos: *decidir se excerto verbatim
pode ser embarcado num app com entitlement premium* — e avisava que uma resposta
negativa obrigaria a refazer a cadeia inteira com outras fontes. Ele ficou no
topo da lista do dono como o maior risco em aberto.

**A premissa era falsa, e ninguém a tinha verificado.** A cadeia não embarca
verbatim em lugar nenhum. Medido em 2026-08-07, contra os artefatos em disco:

| Artefato rastreado | O que carrega |
| --- | --- |
| `content-manifest/excerpts/manifest.jsonl` | `id`, `sourceSlug`, `pageStart`, `pageEnd`, `hash`, `rightsClass`, `allowedUses` |
| `content-manifest/lessons/*.anchored.json` | `claim` (escrita original), `excerptId`, `hash` |
| Texto das fontes | só em `Conteúdo/extrações/`, que está em `.git/info/exclude` |

O `hash` é **do** texto; o texto não viaja junto. O que chega ao produto é
afirmação factual escrita por humano, com ponteiro auditável para a prova.

Dois fatos adicionais, também medidos, que a frase "as 4 fontes `authorized` são
todas `commercialUse: false`" escondia por achatamento:

1. **Uma das quatro não tem cláusula não-comercial na licença.** A página de
   direitos do INCA *Mamografia: da prática ao controle* (`0250.pdf`, p. 3) diz
   apenas: *"É permitida a reprodução total ou parcial desta obra, desde que
   citada a fonte."* O `commercialUse: false` é **precaução nossa** — o próprio
   `decisionBasis` do catálogo registra isso: *commercial reuse remains disabled
   conservatively*. Conferido contra o PDF, não contra o catálogo.
2. **A fonte do piloto é a mais restritiva das quatro,** e por um eixo que
   ninguém tinha nomeado: CC BY-NC-**SA** 4.0 (p. 2: *"Atribuição – Não
   Comercial – Compartilha igual 4.0 Internacional"*). O *ShareAlike* obriga a
   adaptação a carregar a mesma licença — o que contaminaria material derivado.
   Ele não morde referência factual; morde **adaptação**.

## Decisão

**A cadeia de conteúdo entrega afirmação com proveniência, e não citação.** O
excerto é evidência auditável no repositório, não conteúdo do produto. Disso
decorrem três compromissos, e os três são executáveis, não declaratórios:

1. **O direito consultado é `allowedUses`, não `commercialUse`.** O booleano
   `commercialUse` achatava dois direitos independentes — *usar a fonte como
   referência para escrever uma afirmação própria* e *reproduzir o trecho na
   tela* — e não tinha um único leitor a jusante. O catálogo já separava os dois
   corretamente; quem não lia era o código. Ancorar exige `factual-reference`,
   checado nas duas pontas: no filtro de entrada do manifesto e em
   `anchoringErrors`.
2. **O não-vazamento é vigiado por gate, não prometido por documento.** O
   validador `content-no-verbatim` reprova artefato rastreado que carregue texto
   de fonte, por três caminhos: contrato de chaves, coincidência de hash (cópia
   integral) e substring contra o material bruto (cópia parcial). Antes disso a
   garantia existia por acidente — `manifest_line` por acaso não copiava o campo
   `text`.
3. **`rightsClass` e `allowedUses` são eixos independentes,** e nenhum se infere
   do outro. Uma fonte pode passar na classe e conceder outro direito.

## Consequências

- **A pergunta comercial deixa de bloquear.** Ela só passa a importar se algum
  dia a decisão for exibir excerto na tela — e aí é decisão nova, não herdada.
- **Exibir verbatim vira uma mudança com pré-requisitos nomeados:** exigiria
  `verbatim-excerpt` no `allowedUses` da fonte, um leitor desse direito na
  camada de apresentação, e a resposta jurídica sobre uso comercial. Nenhum
  desses três existe hoje, e é bom que não existam por omissão declarada.
- **Adaptar texto de fonte CC BY-NC-SA é o risco real e continua fora de
  escopo.** Claim escrita a partir de fato não é adaptação; um trecho
  reescrito ou resumido pode ser. A linha se desenha no pipeline.
- **Sobra uma verificação barata e de alto retorno:** confirmar os termos
  comerciais da única fonte cuja restrição é precaução nossa, e/ou pedir
  autorização escrita ao INCA. O rascunho do pedido está em
  [`docs/content/2026-08-07-pedido-de-autorizacao-inca.md`](../content/2026-08-07-pedido-de-autorizacao-inca.md).

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Trocar as fontes por material sem restrição comercial | Resolve um problema que não existe: a cadeia não exerce o direito restrito. Custo altíssimo, benefício zero hoje |
| Manter `commercialUse` e só documentar a política | Foi o estado até hoje, e produziu um campo validado na escrita e nunca lido — política sem leitor é política que não existe |
| Exibir verbatim só na camada gratuita | Não resolve: a análise de uso comercial pesa o produto, não a tela. E adicionaria a exibição que hoje não existe |

## O que este ADR não decide

**Se um app com camada paga configura "uso comercial" sob CC BY-NC.** A própria
Creative Commons define NonCommercial como *"não primariamente destinado a
vantagem comercial ou compensação monetária"* e declina de traçar a linha; é
análise caso a caso e é conversa de advogado. Este ADR não a substitui — ele
mostra que a pergunta **não é pré-requisito para nada que a cadeia faça hoje**,
e nomeia exatamente o que teria de mudar para ela voltar a importar.
