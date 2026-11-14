# Bíblia de personagens do Radiant

Versão de 2026-11-13, frente F7 da atualização 1.6. Vale para o mascote Pixel e
para o elenco das cenas de diálogo da trilha rtg-2026: Profa. Lia, Caio, Duda e
o paciente de cada cena.

Este documento descreve os personagens **como já aparecem** nas 132 cenas
publicadas em `content-manifest/rtg-2026/aulas/` (415 falas, contadas em
2026-11-13: Duda 124, Caio 96, Pixel 86, Lia 77, paciente 32). Quem escreve uma
cena nova lê a ficha do personagem antes. Quem desenha um personagem novo segue
as regras gerais e passa pela guarda automática do fim.

O código é a fonte de verdade do desenho: `radiant-app/src/ui/characters/cast/`
(`castLooks.ts` é a ficha visual de cada um, `castExpressions.ts` é o conjunto
de expressões) e as cores em `castColors`, em `radiant-app/src/ui/theme.ts`. A
grade elenco × expressão está no Storybook, em "Personagens/Elenco".

## O serviço em que eles vivem

As cenas acontecem num serviço-escola de diagnóstico por imagem: laboratório
didático, sala de radiografia, comando da tomografia, recepção da ressonância e
da medicina nuclear, sala de comando do acelerador. A pessoa que estuda é
estagiária desse serviço. Ela nunca é desenhada: o leitor ocupa esse lugar.

Todo paciente é fictício, e as aulas dizem isso ("a ficha é de Dona Ivone,
fictícia"). Ninguém do elenco dá diagnóstico, e a cena sempre deixa claro quem
decide o quê: o tecnólogo confere e comunica, o médico decide.

## Regras gerais

### Grade de construção

Todo retrato humano é desenhado na mesma caixa de **64 × 64**, com as mesmas
peças. O que muda de um personagem para outro é só o que ele veste e o cabelo.

| Peça | Medida na caixa 64 | De onde vem |
| --- | --- | --- |
| Ombros | do x 8 ao 56, base em y 64, decote em y 45 | `CAST_SHOULDERS` |
| Pescoço | retângulo 10 × 11 em (27, 36) | `CAST_NECK` |
| Rosto | elipse de centro (32, 27), raios 11 e 12,5 | `CAST_FACE` |
| Olhos | centros em x 27,5 e 36,5, na linha y 27 | `CAST_EYES` |
| Sobrancelhas | faixa de y 20 a 24, de x 25 a 39 | `CAST_BROWS` |
| Boca | faixa de y 32 a 36 (a curva da boca aberta chega a 35,5), de x 27 a 37 | `CAST_MOUTHS` |
| Cabelo | massa livre, sempre dentro da caixa | ficha do personagem |

A luz vem **de cima à esquerda**, como no Pixel e nas peças do Medalhão. Por
isso a sombra do rosto e dos ombros fica à direita, e a faixa de luz do cabelo
fica no alto à esquerda.

O retrato fica sobre uma **placa** redonda: `galaxyColors.surfaceActive` com
borda de 1 pt em `galaxyColors.border`.

### Tamanhos

O avatar tem os mesmos três lados da janela da cabeça do Pixel
(`PIXEL_HEAD_SIZE_MAP`). Assim o elenco e o mascote alinham na mesma coluna.

| Tamanho | Lado | Uso |
| --- | --- | --- |
| `sm` | 48 pt | avatar da fala na cena de diálogo; **tamanho mínimo legível** |
| `md` | 64 pt | reservado (cartões, perfil) |
| `lg` | 96 pt | reservado ao retorno da resposta; hoje o cartão de retorno ainda usa `sm` (ligação da F3) |

Abaixo de 48 pt as sobrancelhas e a boca fechada (traço de 1,4 na caixa 64,
cerca de 1 pt na tela) deixam de ler. Não use retrato menor que `sm`. Para um
marcador menor, escreva o nome.

### Traço

Há **duas** espessuras, em unidades da caixa 64. Não existe terceira.

- **Feição, 1,4:** olho em arco, boca, sobrancelha e a gola do avental.
- **Detalhe, 1,2:** óculos, lapela, cordão, prega da touca, elástico.

Todo traço tem ponta e junção arredondadas. Massa (cabelo, roupa, rosto) é
preenchimento sem contorno.

### Paleta

Toda cor sai de um token do tema. A guarda reprova qualquer outra.

| Papel | Token |
| --- | --- |
| Tinta das feições (olho, boca, sobrancelha) | `galaxyColors.background` |
| Placa e borda | `galaxyColors.surfaceActive`, `galaxyColors.border` |
| Jaleco, crachá, lapela | `pixelColors.coat` |
| Pijama cirúrgico do Caio, blusa da Lia | `pixelColors.blue` |
| Dosímetro | `pixelColors.metal` |
| Pele e cabelo de cada um, avental do paciente | `castColors` |
| Faíscas da comemoração | `medalColors.gold.face` |

O ouro aparece num retrato **só** na comemoração. No Medalhão, ouro é evidência
de avanço, e não enfeite.

Todo material tem base e sombra. Todo cabelo tem ainda um tom `hairLight`, a
faixa de luz no alto à esquerda. Cabelo escuro sobre grafite some: a massa da
Lia tem 1,03:1 contra a placa, a do Caio 1,28:1 e a da Dona 1,56:1. O contorno
dessas massas continua sem contraste; **o que desenha o topo da cabeça é a
faixa**, com pelo menos 3:1 e pelo menos 3 × 3 unidades da caixa. A guarda mede
as duas coisas.

### Contraste

Os valores são de forma gráfica, pelo critério 1.4.11 da WCAG (3:1), medidos
contra a placa `#232733` e conferidos pela guarda:

- o cabelo tem pelo menos 3:1 contra a placa na massa ou, quando a massa é escura, numa faixa de luz de pelo menos 3 × 3 unidades;
- a roupa tem pelo menos 3:1 contra a placa;
- a tinta das feições tem pelo menos 3:1 contra a pele. O menor caso é o da
  Duda, com 3,16:1.

### Feições

- **Olho:** ponto redondo de raio 1,4. No sorriso, vira arco ∩ de traço 1,4,
  como os olhos do Pixel feliz. Nunca pupila com brilho, nunca cílios.
- **Boca:** um traço curvo. Só a boca da comemoração é preenchida (aberta).
- **Sobrancelha:** um traço por olho. A ponta de dentro **nunca** desce mais que
  a de fora: esse desenho é carranca, e o elenco não reprova ninguém. O teste
  das partes reprova uma sobrancelha assim.
- **Nariz, orelhas e dentes não existem.** O rosto lê pela distância dos olhos
  à boca.

### Identidade sem cor

Cada personagem se reconhece por forma, em tons de cinza: o cabelo, o que veste
e um objeto do ofício. A ficha de cada um lista esses elementos, e o código os
guarda em `identity`. A guarda exige pelo menos um. Na cena, o nome de quem
fala também está escrito acima da fala e é lido antes dela.

### Expressões

O conjunto comum tem cinco expressões, montadas das mesmas partes
(`CAST_FACES`). Um rosto novo **não desenha** expressão: escolhe as partes desta
tabela.

| Expressão | Olhos | Boca | Sobrancelha | Acessório | Rótulo acrescentado |
| --- | --- | --- | --- | --- | --- |
| neutro | ponto | calma | relaxada | — | (nenhum) |
| feliz | arco | sorriso | erguida | — | "sorrindo" |
| pensativo | ponto, olhando para cima e para o lado | de lado | assimétrica | — | "pensando" |
| preocupado | ponto um pouco maior, atento | contida | preocupada (sobe por dentro) | — | "com ar de preocupação" |
| comemorando | arco | aberta | erguida | duas faíscas de ouro | "comemorando" |

O rótulo usa gerúndio ou locução, sem gênero, para servir a todo o elenco.

**Preocupado é acolhimento.** É o rosto de quem se importa com o paciente ou com
o colega: sobrancelha que sobe por dentro e boca curta e rasa (no máximo 1,5 de
mergulho). Não existe expressão de bronca, irritação ou decepção, e nenhum
caminho do app chega a uma.

### Quando cada expressão aparece

`castExpressionFor(contexto)`, em `castExpressionFor.ts`, escolhe a expressão
só com o que o tocador já sabe:

| Momento | Expressão |
| --- | --- |
| Fala de cena que afirma | neutro |
| Fala de cena que termina em pergunta | pensativo |
| Fala de cena do paciente que termina em pergunta | preocupado (o paciente pergunta porque está inseguro) |
| Retorno de acerto | feliz |
| Retorno de acerto que fecha um marco (combo, checkpoint, aula) | comemorando |
| Retorno de erro, com ou sem marco | preocupado |

Nas cenas publicadas, isso dá ao Pixel 72 rostos pensativos em 86 falas, porque
ele quase sempre pergunta para fazer pensar. A Duda fica pensativa em 85 de 124
falas, porque está aprendendo. O Caio afirma em 86 de 96, porque ele já sabe.

### Movimento

A troca de expressão **não anima**: o rosto troca no mesmo quadro em que a fala
entra, e a fala já entra com o `useCardEnter` de 220 ms (sem animação com
"Reduzir movimento"). Se uma frente futura animar a troca, a animação respeita
`useReducedMotionPreference` e fica abaixo de 240 ms.

### Acessibilidade

- Avatar sozinho: imagem com rótulo "Nome, papel" e, fora do neutro, a
  expressão ("Duda, colega de turma, com ar de preocupação"). O rótulo diz o
  rosto que aparece: o Pixel pedido como preocupado mostra "pensando" e é lido
  "pensando" (`labelExpressionFor`).
- Avatar ao lado de texto que já diz quem é (a cena de diálogo): decorativo,
  fora da árvore de acessibilidade. A fala é um nó só, lido como "Nome: texto".
- A expressão nunca é a única via de uma informação: o retorno diz em texto se
  a resposta estava certa.

### O que nunca fazer

- Cor que não seja token, ou uma terceira espessura de traço.
- Personagem desenhado como componente próprio, fora de `CAST_LOOKS`: ele não
  receberia as expressões e escaparia da guarda.
- Expressão de reprovação: carranca, olhos revirados, braços cruzados.
- Ouro fora da comemoração.
- Identidade só por cor (dois jalecos iguais com cores diferentes).
- Personagem real, marca real, logotipo de hospital ou fabricante.
- Diagnóstico na boca do elenco, ou o paciente sabendo o laudo.
- Retrato menor que 48 pt, ou o Pixel maior que o elenco ao lado dele.
- Arte gerada por serviço externo ou baixada: todo personagem é desenhado em
  código (SVG ou Skia).

## Fichas

### Pixel

**Papel na história.** O guia de estudo. Não trabalha no serviço: acompanha a
pessoa que estuda e organiza o raciocínio dela. Na cena, é quem para a conversa
para nomear o que está em jogo.

**Personalidade.** Curioso, paciente, organizado.

**Como fala.** Pergunta mais do que afirma, separa o problema em partes e
propõe o próximo passo ("vamos separar", "vamos testar", "vamos seguir um
fóton"). Usa imagem do cotidiano para explicar.

- Certo: "Então vamos separar: o que você faz, o que você não decide e o que
  você leva para alguém?" (M01)
- Certo: "Imagine um pão de forma. Dá para fatiar de três jeitos diferentes, e
  cada fatia mostra uma coisa." (M02)
- Errado: "Errou de novo! Presta atenção." O Pixel não cobra, não ironiza e não
  dá a resposta pronta.

**Quando aparece.** Para nomear o conceito no meio da cena, e no retorno de toda
resposta. **Quando não aparece.** Ao lado do paciente como se fosse da equipe, e
em decisão clínica.

**Ficha visual.** Aprovado em 2026-10-21 e não redesenhado por esta bíblia
(`docs/design/2026-10-21-pixel-medalhao.html`). Robô de jaleco, com tela no
lugar do rosto. As feições são luz ciano (`pixelColors.glow`) sobre a tela
(`pixelColors.visor`), e não tinta: é a única exceção à regra da tinta, porque o
rosto dele é uma tela. Tem sete expressões próprias; as cinco do conjunto comum
apontam para elas (`PIXEL_EXPRESSION_FOR`): neutro, feliz, pensando, pensando e
orgulhoso. Identidade sem cor: antena, orelhas redondas, tela retangular no
rosto e estetoscópio.

**Alinhamento ao elenco (feito nesta versão).** Ao lado do elenco, o Pixel
agora fica na mesma placa redonda e com a cabeça a 80% do lado dela
(`PIXEL_HEAD_SCALE_ON_PLATE`). Antes, a janela da cabeça ocupava a caixa
inteira e sem placa: o mascote aparecia quase duas vezes maior que as cabeças
humanas da mesma coluna. Traço e paleta já seguiam os tokens.

### Profa. Lia

**Papel na história.** Supervisora de estágio do serviço-escola. Planeja o dia
("Hoje você acompanha um exame do começo ao fim"), entrega a ficha do caso e
devolve a pergunta para a pessoa pensar.

**Personalidade.** Exigente, generosa, metódica.

**Como fala.** Frases curtas, imperativo gentil, perguntas em sequência. Elogia
o raciocínio antes de corrigir ("Boa hipótese. Vamos testar…"). Separa as
etapas ("Antes de responder, separe duas coisas").

- Certo: "O que exatamente você vê, e em quais cortes? Antes de dizer o que é,
  diga como é." (S-TC)
- Certo: "Hoje não tem conteúdo novo. Tem um plantão simulado inteiro, e as
  decisões são suas." (M14)
- Errado: "Isso é óbvio, você já devia saber." A Lia nunca humilha e nunca
  responde no lugar da pessoa.

**Quando aparece.** Abrindo a aula com a tarefa do dia, propondo o caso e
fechando com a pergunta que amarra o conceito. **Quando não aparece.**
Executando o exame no lugar do estagiário, ou falando com o paciente por cima
da equipe.

**Ficha visual.**
- Proporção: a da grade; o coque soma 6 unidades acima da cabeça (y 4 a 16).
- Paleta: pele `castColors.lia.skin` e `skinShade`; cabelo `hair`, `hairShade`
  e faixa `hairLight`; jaleco `pixelColors.coat`; blusa `pixelColors.blue.base`;
  dosímetro `pixelColors.metal.shade`.
- Traço: óculos e lapelas em detalhe (1,2).
- Olhos e boca: os do conjunto comum; os óculos ficam por cima dos olhos.
- Identidade sem cor: **coque no alto da cabeça, óculos redondos, jaleco com
  lapelas e dosímetro na lapela** (é ela quem cobra proteção radiológica).

### Caio

**Papel na história.** Tecnólogo do plantão. É quem está na sala, conhece cada
aparelho e conversa com o paciente.

**Personalidade.** Prático, tranquilo, cuidadoso.

**Como fala.** Afirma com calma (86 de 96 falas), fala de "a gente", traz o
detalhe da prática que o livro não traz. Com o paciente, chama pelo nome e
combina antes de fazer.

- Certo: "Na sala a gente procura osso antes de procurar botão." (M07)
- Certo: "Tudo bem, Dona Marta. A gente faz a imagem com a senhora sentada no
  leito e combina a respiração antes, com calma." (M08)
- Errado: "Deixa que eu resolvo, você não entende disso." O Caio mostra, não
  toma a tarefa.

**Quando aparece.** Na sala de exame, no comando, na recepção técnica, em toda
cena com paciente. **Quando não aparece.** Dando laudo ou opinião diagnóstica.

**Ficha visual.**
- Proporção: a da grade; cabelo curto de topo reto, sem volume acima de y 12.
- Paleta: pele `castColors.caio.skin` e `skinShade`; cabelo `hair`, `hairShade`
  e `hairLight`; pijama `pixelColors.blue.shade` com sombra
  `castColors.caio.scrubShade`; crachá `pixelColors.coat`.
- Traço: só os de feição.
- Identidade sem cor: **cabelo curto de topo reto, gola em V do pijama
  cirúrgico e crachá no peito.**

### Duda

**Papel na história.** Colega de turma da pessoa que estuda, no mesmo estágio. É
a voz da dúvida que o aluno tem e não diz.

**Personalidade.** Curiosa, ansiosa, honesta.

**Como fala.** Pergunta muito (85 de 124 falas), admite que não sabe, testa
atalhos ("Então quanto mais, melhor?") e confessa o medo ("Tenho medo de passar
perto"). Fala na primeira pessoa e no presente.

- Certo: "Aumentei o mAs no simulador e a imagem ficou linda. Então quanto mais,
  melhor?" (M06)
- Certo: "Eu não sei responder isso. Mas sinto que preciso dizer alguma coisa
  para ela." (S-MN)
- Errado: "Que pergunta boba, isso é fácil." A Duda erra junto com o aluno; ela
  não zomba de ninguém e não é a burra da turma.

**Quando aparece.** Para levantar a dúvida comum ou o atalho perigoso que a aula
vai desmontar. **Quando não aparece.** Corrigindo a Lia ou o Caio com a
resposta certa, ou decidindo sozinha com o paciente.

**Ficha visual.**
- Proporção: a da grade; os cachos passam por trás da cabeça e ocupam de x 12 a
  53. Duas mechas caem na testa, por cima do rosto.
- Paleta: pele `castColors.duda.skin` e `skinShade`; cabelo `hair`, `hairShade`
  e `hairLight`; moletom `castColors.duda.hoodie` e `hoodieShade`; cordões
  `pixelColors.coat.shade`.
- Traço: cordões em detalhe (1,2).
- Identidade sem cor: **cachos volumosos em volta da cabeça, capuz do moletom e
  os dois cordões.**

### Paciente

**Papel na história.** A pessoa examinada. Muda a cada cena e tem sempre nome
fictício: Dona Marta (15 falas), Seu Jorge (12), Dona Célia, Dona Neide, Dona
Ivone, Seu Anselmo. Traz a pergunta que o tecnólogo precisa saber responder sem
dar diagnóstico.

**Personalidade.** Inseguro, direto, colaborador.

**Como fala.** Linguagem do dia a dia, sem termo técnico. Chama a equipe de
"moça" e "moço". Conta o que sente e pergunta o que vai acontecer ("Tem
problema fazer o raio X hoje?").

- Certo: "Moço, o papel diz “perna direita”. Mas o que me dói é aqui em cima,
  na coxa." (Dona Marta, M02)
- Certo: "Essa máscara é apertada mesmo? Parece que encaixa em cada pedacinho
  do rosto." (Seu Jorge, S-RT)
- Errado: "Doutor, pelo meu exame é fratura do quinto metatarso, certo?" O
  paciente não fala como profissional nem traz o laudo.

**Quando aparece.** Em toda cena de atendimento: recepção, preparo, sala de
exame. **Quando não aparece.** Em sala de aula, ou explicando conteúdo.

**Ficha visual.** Dois retratos, escolhidos pelo tratamento que a fala traz
(`castLookFor`):

- **"Seu" (e paciente sem nome):** cabelo grisalho só nas laterais
  (`castColors.pacienteSeu`).
- **"Dona":** cabelo escuro solto até os ombros, repartido de lado
  (`castColors.pacienteDona`). Até a 1.5, toda paciente aparecia como o senhor
  grisalho, e isso contradizia a Dona Marta da M01, que pergunta pelo atraso da
  menstruação.
- **Ponto aberto de conteúdo, não da arte:** a mesma Dona Marta que pergunta
  pelo atraso da menstruação (M01) fala da filha (S-RT) e de pegar o neto
  (S-MN). Dona Neide e Dona Ivone fazem densitometria. Um retrato só para toda
  "Dona" não resolve as idades. A F7 desenhou um rosto de meia-idade, sem
  cabelo grisalho, que serve à Dona Marta das duas leituras. A idade da Dona
  Marta e um terceiro retrato, de senhora, ficam para a frente de conteúdo.
- Paleta comum: avental `castColors.gown`, com gola em traço de feição (1,4).
  Até a 1.5 a gola tinha traço 2, e as sobrancelhas eram grisalhas e só do
  paciente. Agora a gola segue as duas espessuras, e todo o elenco tem
  sobrancelha de tinta.
- Identidade sem cor: **avental hospitalar de decote redondo e estampa de
  bolinhas**, mais o cabelo de cada retrato.

## Personagem novo: como entra

1. Justifique na bíblia: que voz o elenco não tem, e em que cenas.
2. Escreva a ficha completa (papel, três traços, fala certa e errada, quando
   aparece e quando não, ficha visual).
3. Acrescente as cores a `castColors` e a ficha a `CAST_LOOKS`. O desenho usa
   só a grade, as duas espessuras e as partes de expressão.
4. Rode `castStandard.test.tsx` e veja a linha nova na grade do Storybook.
5. A entrada na aula (`LessonCastId`) é do contrato editorial, que é de outra
   frente. O personagem fica como candidato até essa decisão.

Os dois candidatos da 1.6 estão em
[2026-11-13-candidatos-de-personagens.md](2026-11-13-candidatos-de-personagens.md).

## Guarda

`radiant-app/src/ui/characters/cast/castStandard.test.tsx` lê a árvore
renderizada de todo retrato, em todas as expressões, e reprova:

- cor fora dos tokens;
- traço fora de 1,2 e 1,4;
- personagem sem alguma das cinco expressões, com duas iguais, ou com um rosto
  que não é o da tabela `CAST_FACES` para aquela expressão;
- feição fora da caixa 64. Diferença sem validade não vale;
- avatar sem rótulo com o nome, ou sem a expressão no rótulo quando ela muda o
  sentido;
- silhueta, roupa ou feição abaixo de 3:1, ou faixa de luz menor que 3 × 3;
- retrato com mais de 26 nós, ou cena de seis falas com mais de 215.

Cada regra é vista falhando dentro da própria suíte, contra um personagem com o
defeito que ela nomeia. A execução vermelha contra o código real está em
`docs/evidence/2026-11-13-f7-personagens/guarda-vermelha.txt`.
