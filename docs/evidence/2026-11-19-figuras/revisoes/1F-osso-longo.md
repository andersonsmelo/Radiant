# Revisão independente da troca do `osso-longo` (lote 1F, 2026-11-20, tarde)

Revisão por IA, não por profissional de radiologia. Escopo: o commit 368029c3 sobre 7aa103c1, na branch `claude/figuras-fase-1`: a figura `osso-longo` passa a ser o fêmur inteiro do Servier, e a M18.02 `i3` foi adaptada. Li o diff pelo git e repeti as medidas e os gates numa worktree temporária destacada em 368029c3, já removida. Não rodei simulador, `loop` nem commit.

## Veredito

**`osso-longo`: aprovada com correções a fazer.** A arte, a licença, a receita e os alvos estão certos. A correção é de texto, no item `i3`: ele agora cobra que o aluno distinga a epífise proximal da distal, mas não nomeia o osso e não dá retorno para quem troca as duas (achado 1).

Contagem: Crítico 0, Importante 1, Menor 4.

## Gates (Node 20.20.2, worktree limpa em 368029c3)

- A receita reproduz a fonte e o spec byte a byte: `osso-longo.mjs` e depois `build-spec.mjs osso-longo` deixam `git status` limpo. A saída foi "caminhos 45 14.0 KiB" e "15.7 KiB; filtros removidos: 0".
- Conversor do pptx: rodei `femur-proximal-e-quadril.pptx2svg.py "Group 50"` sobre `ppt/slides/slide14.xml` do `original.pptx`. O sha256 do pptx é 48f38921…c566ee, o mesmo do registro. A saída é idêntica (`cmp`) ao `receitas/s14_Group_50.svg` versionado (sha256 d599565d…e84fe), sem recurso não suportado.
- O verificador (`rtg-lesson-lint.mjs`) passa nas 40 unidades.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam e 1 falha. A falha é a conhecida (`registerSource normalizes metadata for the pilot book`).
- `node --test scripts/content/figuras/*.test.mjs`: 18 testes, 17 passam e 1 é pulado.
- `build-rtg-batches.mjs --check` e `figuras-no-simulador.mjs --check` saem com 0.
- `npx jest src/ui/diagrams src/features/student-checkpoints src/features/settings`: 31 suítes e 922 testes, todos passam. Isso inclui "todo degradê tem id"; a arte nova não tem degradê.
- `test:copy-style-contract`: 65 de 65.

## 1. Licença

- A página de origem, https://smart.servier.com/smart_image/femur/, lida inteira em 2026-11-20 com User-Agent "Mozilla/5.0", diz: "Bones - Servier Medical Art is licensed under CC BY 4.0". O "Download the entire set" aponta para `SMART-Bones.pptx`, o mesmo arquivo do registro.
- A miniatura da página (`femur_01`) é o mesmo desenho do "Group 50", na mesma orientação e sem espelho.
- A página de termos (`/terms-of-use/`) diz que as imagens estão sob CC BY 4.0. Ela exige crédito à Servier Medical Art, link para a licença e indicação das mudanças.
- O crédito do app em `figuras.json` e `rtgImages.ts` nomeia "Servier Medical Art (Les Laboratoires Servier), kit SMART-Bones", a CC BY 4.0 com o link e a página do fêmur, e descreve as mudanças: giro, recolor e enquadramento. O autor é um só e a obra não é derivada de outra.
- As cópias CC BY-SA do Commons não foram usadas.
- O slide também tem um "Group 51". É o mesmo fêmur espelhado (`flipH="1"` no grupo) e não foi usado.

## 2. Fidelidade ao original

- Os 45 caminhos estão no original, na fonte e no spec. A receita troca só os valores de `fill` e `stroke` por um mapa fixo de 8 cores para 8 cores e envolve tudo em `rotate(-90)`. Os tons claros e escuros mantêm a ordem e a cartilagem continua ciano.
- O spec contra a fonte, renderizados a 960 x 720, diferem em **0 pixels** acima de 40/255 sobre #171920 e em 2 sobre branco. O app recebe o spec por `diagramSvgAt`.
- A forma do spec contra o original girado na mesma transformação, com as cores do autor e comparada pelo alfa: **5 de 67.281 pixels** de osso diferem, todos de serrilhado.
- Não há traço descartado, forma nova nem divisa inventada. O giro da figura inteira é permitido.

## 3. Anatomia (render meu, sobre #171920)

O fêmur inteiro fica deitado e legível, ocupando 34,6% da altura do quadro (y de 0,325 a 0,671). A cabeça, com a capa ciano, fica embaixo e à esquerda, o trocanter maior em cima e à esquerda, o trocanter menor como saliência sob o colo, o corpo inclinado e os côndilos com a capa ciano à direita. O giro de 90 graus anti-horário sobre o desenho vertical do autor deixa o lado medial para baixo, e isso é coerente. A aula não cobra lado. O âmbar e o ciano se distinguem bem.

## 4. Alvos (medidos por mim, render de 960 x 720 sobre #171920, osso pelo alfa > 0,1)

As regiões declaradas são caixas justas, e eu repeti a conta. Em cada uma, a caixa declarada e o osso do trecho batem em até 0,002:

- Epífise proximal: x de 0,037 a 0,258.
- Diáfise: o trecho de x 0,40 a 0,60, com altura justa de 0,124, acima do mínimo de 0,08 do verificador. A integração disse isso, como pede a S3.
- Epífise distal: x de 0,829 a 0,969.
- Cartilagens: medidas pelo ciano.

| Ponto | Centro | Área de 44 pt | Marcador de 28 pt | Parte da epífise que o marcador esconde |
| --- | --- | --- | --- | --- |
| Epífise proximal (0,23; 0,41) | osso | âmbar 48,0%, fundo 49,4%, contorno 2,2% | âmbar 81,4%, fundo 15,9% | **26,4%** (proposta da arte, (0,165; 0,41): 35,2%) |
| Diáfise (0,50; 0,48) | osso | fundo 64,5%, âmbar 33,5% | âmbar 62,5%, fundo 34,2% | não se aplica |
| Epífise distal (0,85; 0,61) | osso | âmbar 52,1%, fundo 40,2%, ciano 6,2% | âmbar 63,1%, fundo 34,9% | **24,6%** (proposta da arte, (0,85; 0,56): 32,6%) |

Os números batem com os de `medidas.md` (26,1% e 24,8%; a diferença vem do serrilhado).

- Nenhuma área de 44 pt toca a caixa de outro alvo da aula.
- As capas ciano ficam inteiras à vista.
- Pelas ampliações, o marcador 1 cobre o trocanter menor e a região intertrocantérica, e deixa à vista a cabeça, o colo e quase todo o trocanter maior. O marcador 3 fica no lábio de baixo da ponta larga, antes da capa.
- Fiz uma busca em grade com uma restrição mais frouxa: centro na caixa e sobre o osso, e marcador com ao menos 50% sobre o osso. Ela acha pontos que escondem 12% a 13% da epífise, como (0,25; 0,46) e (0,83; 0,50), mas com o marcador avançando sobre o corpo. A restrição do integrador, de ao menos 55% do marcador sobre a própria caixa e o osso, é uma leitura defensável de "sem cair no fundo" e de não confundir com a diáfise. Aceito os pontos.
- A resposta é decidível pela figura só por quem reconhece o fêmur e sabe que a cabeça vai ao quadril. Ver o achado 1.

## Achados

**1. Importante: o `i3` passou a cobrar proximal contra distal sem nomear o osso e sem retorno para a troca.** Arquivo `content-manifest/rtg-2026/aulas/m18.json`, linhas 595, 624 e 625.

As fichas agora são Epífise proximal e Epífise distal, conforme a S4. O conceito da M18.02 só diz "as epífises são as pontas largas", e o `prompt` diz "um osso longo inteiro", sem dizer que é um fêmur. Para acertar, o aluno precisa:
- reconhecer o fêmur;
- lembrar que a cabeça encaixa no quadril, o que a M07 ensina;
- aplicar "proximal = perto do tronco", da M02.

Cenário: o aluno põe a Diáfise no meio e as duas epífises nas pontas, mas trocadas. Ele recebe "a diáfise é o trecho do meio, e as epífises, as pontas largas", o que ele já fez. O retorno não aponta o erro dele, e o `help` também não.

Correção sugerida, sem mudar nenhuma resposta certa:
- `prompt`: "Rotule três partes do osso longo, tocando na ficha e no ponto. A figura mostra um fêmur inteiro, deitado, com a cabeça, que encaixa no quadril, à esquerda."
- `feedbackIncorrect`: "Alguma ficha está no ponto errado: a diáfise é o trecho do meio; as epífises são as pontas largas, e a proximal é a da cabeça, mais perto do tronco."

O nome do fêmur não entrega resposta: o `alt` já diz "Fêmur", e o `i1` já fala do fêmur. Depois de trocar o texto, regenerar `rtg-2026-m18.ts`.

**2. Menor: a evidência atribui ao dono uma medida que ele não viu.** Arquivo `docs/evidence/2026-11-19-figuras/lote-1F.md`, linha 16.

O texto diz "O que ele viu e aceitou: … os marcadores 1 e 3 cobrem cerca de um quarto de cada epífise nos pontos escolhidos". Os pontos foram escolhidos depois da decisão, e a S1 registra que o dono viu os marcadores cobrindo "a maior parte de cada epífise", nos pontos da proposta. Correção: citar a S1 como está e pôr a medida em frase própria. Por exemplo: "Medido depois: 33% a 35% nos pontos da proposta, que o dono viu; cerca de 25% nos pontos escolhidos na integração." A ressalva do integrador sobre a definição de "epífise" já está no relatório dele.

**3. Menor: a fala da cena contradiz a figura.** Arquivo `m18.json`, linha 498.

O Caio diz "Cortei este fêmur de modelo ao meio para a turma ver por dentro", e a figura agora é um fêmur inteiro, sem corte. A cena não aponta para a figura e a S4 não a cobre. Como a S7 fecha o escopo, isso fica para o dono decidir. Sugestão: "Trouxe este fêmur de modelo para a turma ver as partes."

**4. Menor: os alvos das epífises avançam sobre o corpo não declarado.** Medida minha:
- Epífise proximal: 25,4% do osso sob a área de 44 pt e 16,0% do osso sob o marcador estão em x > 0,259, no corpo logo depois dos trocanteres.
- Epífise distal: 27,0% e 14,2% estão em x < 0,829.

Não é a estrutura de outra resposta, porque o autor não desenhou divisa e a caixa da Diáfise começa em 0,40 e termina em 0,60. O marcador fica na maior parte sobre a própria caixa. Não exige correção. Fica registrado porque "nenhuma área toca outro alvo" é verdade por construção das caixas.

**5. Menor: o crédito cita um arquivo da pasta de trabalho.** Arquivo `content-manifest/rtg-2026/figuras.json`, linha ~241, campo `modification`, e o mesmo texto em `rtgImages.ts`.

O texto cita "original.pptx", que é o nome do arquivo na pasta de trabalho. A receita citada é a versionada, e a S2 está cumprida. Correção opcional: tirar "original.pptx," da frase, porque o URL do pptx e o sha256 já identificam o arquivo.

## Requisitos tardios, conferidos no commit

- **S1**: cumprida. O fêmur inteiro, "Group 50", 45 caminhos, girado 90 graus com a cabeça à esquerda, recolorido e em 4:3. A arte da Pbroks13 saiu.
- **S2**: cumprida.
  - A receita lê `s14_Group_50.svg` e tem o sha256 dele no cabeçalho. O sha256 não é conferido em tempo de execução; a contagem de 45 caminhos é.
  - `osso-longo.original.svg` foi removido, e não sobrou referência a ele fora do parecer copiado.
  - `build-spec.mjs` e `figuras.json` descrevem o Servier, com o cabeçalho verdadeiro.
  - A guarda de degradê e a regeneração byte a byte continuam valendo.
- **S3**: cumprida. Caixas justas, a Diáfise justa com 0,124 (a integração disse isso) e as cartilagens declaradas, sem uso em aula.
- **S4**: cumprida no que pede. Fichas e distrator certos, pontos sobre o osso e medidos. O `prompt` não diz mais "em corte" nem "a ponta". `where`, `help` e retornos são verdadeiros para a arte nova. O `closing.body` voltou a dizer "as epífises" e não promete apontar na figura a cavidade, a cartilagem e a placa. O retorno ficou incompleto para o erro novo que a própria S4 cria (achado 1).
- **S5**: cumprida. O `alt` tem 139 caracteres, descreve a forma e não nomeia epífise nem diáfise. Ele chama de "ponta larga" só a da direita e descreve a esquerda pela "cabeça arredondada", o que é aceitável.
- **S6**: cumprida, salvo o achado 2.
  - `lote-1F.md` registra S1 e a data e mantém o conserto do degradê como histórico.
  - `medidas.md` tem a seção nova sobre #171920.
  - A prévia `lote-1F/osso-longo.png` tem 960 x 720, fundo (23, 25, 32), os marcadores atuais e é igual à minha.
  - `revisoes/1F.md` é a cópia de `revisao.md` com uma linha de cabeçalho e uma linha em branco. A partir da linha 3, o corpo é idêntico (`cmp`).
- **S7**: cumprida no commit. Os 14 arquivos estão todos em `arquivos-do-run-3.txt`. `STATUS.md`, o plano, a captura e `revisoes/1F-osso-longo.md` não foram tocados. Não conferi o run do Loop.
- **D5**: cumprida. Regiões justas, e os percentuais de área e marcador estão em `medidas.md`. Nenhuma estrutura de resposta errada fica sob as áreas.
- **D7**: nenhuma pergunta de escolha teve a resposta certa trocada. O `i3` mudou de fichas por S1 e S4, que são decisão do dono e do controlador.
- **C2 e C3**: para o `osso-longo`, a conta de spec contra fonte sobre #171920 dá 0, e as medidas são sobre #171920. Não remedi as outras três figuras, que este commit não toca.

## Itens alterados

**M18.02 `i3` (rótulo), recomendação: aprovar com a correção do achado 1.**
- O item continua válido. Cada ficha tem um ponto, e a resposta certa é defensável: a ponta da cabeça é a proximal, o meio é a diáfise e a ponta dos côndilos é a distal.
- A competência "nomear as partes de um osso longo" continua avaliada, agora no osso inteiro, o que é mais fiel ao conceito "pontas largas e tubo do meio" do que a versão em corte.
- O que o aluno deixa de praticar na figura: apontar a cavidade medular, que estava na versão da manhã, e ver o osso esponjoso por dentro. As duas seguem no conceito, no `i4` e na recuperação, e a placa de crescimento segue no checkpoint.
- O que ele passa a praticar: localizar as duas epífises e distinguir a proximal da distal. A segunda parte é nova e precisa do achado 1.

**M18.02 `closing.body`: aprovar.** Não promete apontar na figura o que ela não mostra.

## Para o dono olhar no simulador

- M18.02, passo do `i3`: o osso ocupa uma faixa fina, e o corpo é mais estreito que o marcador 2. Os três marcadores leem bem? As capas ciano ficam à vista?
- O marcador 1 sobre o trocanter menor: parece estar na ponta, e não no começo do corpo?
- Com o VoiceOver, ouvir as frases de `where`: "na região dos trocanteres", "no meio, o corpo longo e estreito do osso" e "na ponta larga, antes da capa ciano".
- A captura de iPhone em `lote-1F.md` é da arte anterior. Falta uma captura nova.

## Não consegui verificar

- O app com a arte nova, no simulador ou no aparelho, e a leitura do VoiceOver: fora do meu papel.
- `npm run quality`, `tsc`, `eslint` e o contrato do Maestro: não rodei. Rodei só os gates do brief e o `copy-style-contract`.
- O run do Loop e o que ele declarou.
- Não baixei de novo o pptx do Servier. Conferi que o sha256 da cópia da pasta de trabalho bate com o registro, e que a página e a miniatura atuais mostram o mesmo fêmur.
- Os termos de uso do Servier têm uma frase sobre uso comercial ("unless stated otherwise in the Creative Commons licence"). Não é novidade deste commit e vale para todas as figuras do Servier. Não a reavaliei aqui.
