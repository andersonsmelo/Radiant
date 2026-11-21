# Guia de autoria — aulas do Radiant (formato aula-fonte, schemaVersion 1)

**Criado em 2026-11-05** sob a [ADR da delegação](../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md). O verificador citado no fim entra no repositório com a frente A do [plano](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md); até lá, os autores usam uma cópia fora do repositório.

O Radiant é um app de estudo para **estudantes de Tecnologia em Radiologia, no Brasil e fora dele**, no espírito do Duolingo: aulas curtas (4 a 7 minutos), muita prática, retorno imediato, personagens e diálogo. Cada **unidade** (módulo) tem 6 ou mais **aulas**. Você escreve UMA unidade inteira num único arquivo JSON.

## 1. Regras que não se negociam

1. **Texto original.** Fatos conferidos em fontes gratuitas na web; a redação é sua. Nunca copie nem parafraseie de perto frase de livro, apostila, site, banco de questões ou concurso. Não leia PDFs locais do repositório nem nada em `Conteúdo/` ou `conteúdo/`.
2. **Fonte por afirmação.** Todo item cita em `sourceIds` a fonte que sustenta o fato. Confira os fatos com WebSearch/WebFetch antes de escrever. Se não achar fonte gratuita confiável para um fato, não use o fato.
3. **Limites profissionais.** O aluno é estudante numa **simulação supervisionada**. Nenhum item pede diagnóstico, laudo, escolha de exame, conduta clínica, prescrição, cálculo de dose para paciente ou liberação de implante. Diante de dúvida ou divergência, a ação certa é **parar, descrever e pedir apoio à equipe**. Nunca "corrija o registro por conta própria".
4. **Base internacional (desde 2026-11-18).** Não cite lei, decreto, portaria, resolução, norma, órgão ou conselho de nenhum país, nem "no Brasil". Proteção radiológica: ICRP (publicação 103) e IAEA (GSR Part 3 e SSG-46). Cuidado e segurança do paciente: OMS. Quando a regra muda de um país para outro, diga "o serviço e as regras locais definem" e ensine o princípio. Consentimento, sigilo e privacidade são cuidado com o paciente, não artigo de lei. A fonte precisa abrir de graça na web; documento pago não serve. O verificador barra os termos (`scripts/content/rtg-national-terms.mjs`). Continuam valendo: unidades do SI, vírgula decimal e os termos correntes em português (tomografia computadorizada, ressonância magnética, colimação, tecnólogo em radiologia).
5. **Sem paciente real.** Só personagens e fichas fictícias. Nenhum dado pessoal real.
6. **Tom.** Português do Brasil, direto, acolhedor, sem culpa e sem infantilizar. Frases curtas. Nada de "Parabéns!!!" vazio: o retorno diz o que a escolha faz e por quê. No erro: diga o que aquela alternativa faz e redirecione ("Retome…", "Confira de novo…"). Nunca use o mesmo texto de retorno para duas alternativas.
7. **Higiene de texto.** Sem travessão com espaços (use vírgula, ponto ou dois-pontos). Sem palavras em caixa alta para ênfase. Sem notas de produção, sem "Quiz:", sem "Ideia-chave:". Não use "todas as anteriores" nem "nenhuma das anteriores".
8. **Qualidade das questões.**
   - Tarefa, não definição: prefira "o que você confere agora?" a "o que é X?".
   - 4 alternativas plausíveis, de tamanho parecido. A correta **não** pode ser a mais longa (máx. 1,2× o maior distrator).
   - Varie a posição da correta ao longo da unidade (nenhuma posição acima de 40%).
   - Os dois itens de conferência de uma aula têm respostas corretas diferentes e não repetem enunciado da prática.
   - Itens de segurança (`role: "safety"`) levam `criticalSafety: true`.
   - Números só quando a fonte os sustenta; em modelos simplificados, diga o limite ("vale só para este esquema").

## 2. Elenco (use nos diálogos)

| speaker | Quem é | Voz |
| --- | --- | --- |
| `pixel` | Mascote do app, guia de estudo | Curioso, encoraja, faz a pergunta que organiza o raciocínio |
| `lia` | Profa. Lia, supervisora de estágio | Calma e precisa; devolve a pergunta ao aluno |
| `caio` | Caio, tecnólogo veterano do plantão | Prático, bem-humorado, conta "como é na sala" |
| `duda` | Duda, colega de turma | Aprende junto, verbaliza a dúvida comum |
| `paciente` | Paciente simulado (sempre com `name` fictício, ex.: "Seu Jorge", "Dona Marta") | Fala simples, traz a situação humana |

Falas de até 200 caracteres. A cena de abertura cria a situação concreta da aula em 2 a 4 falas. Personagens não dão o gabarito.

## 3. Estrutura de cada aula

1. `objective`: "Hoje você vai conseguir …" (uma frase, ação observável).
2. `scene`: abertura em diálogo (2 a 4 falas) num cenário (`setting`).
3. `concept`: título + corpo de até 110 palavras + 2 ou 3 `keyPoints` curtos. Ensina antes de cobrar. Opcional: `visual`, o id de um diagrama do catálogo (seção 3b); em unidade nova, o corpo com `visual` tem até 80 palavras.
4. `interactions`: **exatamente 5**, com **ao menos 3 tipos diferentes**, nesta progressão:
   - i1 `role: "prerequisite"`: recupera algo de aula anterior (na primeira aula da trilha, um conhecimento do cotidiano).
   - i2 `prediction` ou `practice`; i3 `practice`; i4 `practice` ou `safety`; i5 `transfer` (situação nova, sem dica).
5. `closing`: título + corpo ("o que você consegue fazer agora") + uma fala final opcional (`line`).
6. `checkpoint`: **exatamente 2** itens de múltipla escolha, inéditos, sem ajuda.
7. `recovery`: `guided` (frase-gancho + item mais guiado) e `transfer` (item em outro contexto).

Tipos de interação:

- `multiple-choice`: `prompt`, `options[4]` (`label`, `correct`, `feedback`), `help`.
- `case-decision`: igual, mais `context` (o minicaso, 60 a 520 caracteres). Use para decisões em situação: o que fazer, o que conferir, quando parar.
- `ordering`: `prompt`, `items` (4 ou 5 textos **já na ordem correta**), `feedbackCorrect`, `feedbackIncorrect`, `help`.
- `matching`: `prompt`, `pairs[4]` (`left`, `right`), `feedbackCorrect`, `feedbackIncorrect`, `help`.
- `comparison`: `prompt`, `options[2 a 4]` (`label` neutro, `imageId`, `correct`, `feedback`), `help`. Cada `imageId` existe em `content-manifest/rtg-2026/imagens.json`, com licença CC0 ou CC BY conferida. O item só afirma o que a descrição da imagem no acervo sustenta.

- `cloze`, `true-false`, `categorize`, `multi-select`: famílias da 1.6, descritas na seção 3a.
- `hotspot`, `label`, `risk-hunt`, `conversation`, `blitz`, `bench`, `parameter-lab`: formatos da trilha dobrada, descritos na seção 3b, com a regra de figura e o catálogo de diagramas.

`help` é uma pista que orienta o raciocínio sem entregar a resposta.

## 3a. Famílias da 1.6 (ADR-2026-11-13)

Decisão e garantias em `docs/adr/ADR-2026-11-13-familias-de-interacao-da-1-6.md`. As
quatro têm `prompt` (20 a 300 caracteres), `help`, `sourceIds`, `feedbackCorrect` e
`feedbackIncorrect` (25 a 260 cada). **O retorno de erro é diferente do de acerto**: ele
explica o raciocínio, não repete o parabéns. Nenhuma tem posição de resposta para
distribuir na unidade; a régua de 10% a 40% continua valendo para as escolhas que
sobram. Ao converter uma interação existente, mantenha `id`, `role`, `help`,
`sourceIds` e `criticalSafety`, e não acrescente fato que não estava na aula.

### `cloze` (completar a frase)

**Use** quando a aula ensina um termo que o aluno precisa dizer exato: nome de plano,
unidade, marcador, sigla com palavra. **Não use** para ideia que se diz de vários jeitos
(duas palavras do banco serviriam), nem para frase copiada do conceito que a resposta
completa por gramática ("o"/"a" já denunciam o gênero).

Regras: `text` com `{{1}}` e, se houver, `{{2}}`, em ordem (20 a 200 caracteres);
`answers` com 1 ou 2 palavras ou expressões curtas (até 40); `distractors` de 2 a 4;
nada repetido no banco; nenhuma resposta mais longa que 1,2× o maior distrator. O
gerador embaralha o banco e nunca o abre com as respostas na ordem das lacunas.

```json
{ "id": "i3", "type": "cloze", "role": "practice", "prompt": "Complete a frase com as palavras do banco.",
  "text": "O plano {{1}} divide o corpo em direita e esquerda.", "answers": ["sagital"], "distractors": ["coronal", "axial", "oblíquo"],
  "feedbackCorrect": "Isso: o plano sagital separa direita e esquerda.",
  "feedbackIncorrect": "Pense no que o plano separa: o coronal separa frente e trás, o axial separa cima e baixo.",
  "help": "Qual plano corta o corpo de frente para trás?", "sourceIds": ["…"] }
```

Reprovado: `"text": "O plano {{1}} divide o corpo."` com `"answers": ["sagital", "mediano"]`
(duas respostas, uma lacuna: "o texto precisa de uma lacuna {{1}}, {{2}} por resposta");
`"distractors": ["coronal"]` ("de 2 a 4 distratores no banco").

### `true-false` (certo ou errado)

**Use** para separar ideias que o aluno confunde: o que mede e o que protege, o lado do
paciente e o da tela. Boa conversão de uma múltipla escolha cujas alternativas erradas
são equívocos comuns. **Não use** quando a afirmação errada só é errada por um detalhe de
redação, nem com afirmação que a fonte não sustenta como certa ou como errada.

Regras: 3 ou 4 `statements` (`text` de 15 a 160, `correct` booleano, `feedback` próprio
de 25 a 260), ao menos uma certa e uma errada, sem repetir texto nem retorno; a certa
mais longa não passa de 1,2× a errada mais longa. O aluno julga uma por vez e vê o
retorno daquela afirmação na hora; o julgamento não volta atrás.

```json
{ "id": "i5", "type": "true-false", "role": "transfer", "prompt": "Julgue cada afirmação sobre o dosímetro.",
  "statements": [
    { "text": "O dosímetro registra a dose que você recebeu.", "correct": true, "feedback": "Certo: ele mede a dose acumulada no período." },
    { "text": "O dosímetro diminui a dose que você recebe.", "correct": false, "feedback": "Errado: ele só mede; quem reduz é distância, tempo e blindagem." },
    { "text": "O dosímetro é de uso individual.", "correct": true, "feedback": "Certo: cada pessoa usa o próprio, para a leitura ser dela." } ],
  "feedbackCorrect": "Você separou medir de proteger.", "feedbackIncorrect": "Releia o conceito: medir a dose não é o mesmo que reduzi-la.",
  "help": "Ele mede ou protege?", "sourceIds": ["…"] }
```

Reprovado: as três afirmações com `"correct": true` ("ao menos uma afirmação certa e ao
menos uma errada"); `"correct": "false"` em texto ("correct deve ser true ou false").

### `categorize` (classificar em grupos)

**Use** quando os itens se dividem em 2 ou 3 classes que a aula ensina: técnico ou
clínico, antes ou depois do contato, aumenta ou reduz. Substitui a associação cujos
lados direitos já eram classes. **Não use** para pares um a um (isso é `matching`), nem
com grupo que tenha um item só por falta de material.

Regras: 2 ou 3 `categories` (até 40 caracteres), de 4 a 6 `items` (`label` até 60,
`category` igual ao texto de um grupo), todo grupo com item, e **o rótulo do item não
contém o nome do grupo**. O gerador intercala os itens para que nunca apareçam em blocos.

```json
{ "id": "i2", "type": "categorize", "role": "practice", "prompt": "Classifique cada ação no grupo certo.",
  "categories": ["Tarefa técnica", "Decisão clínica"],
  "items": [ { "label": "Posicionar o paciente", "category": "Tarefa técnica" }, { "label": "Ajustar o campo", "category": "Tarefa técnica" },
             { "label": "Escrever o laudo", "category": "Decisão clínica" }, { "label": "Indicar o exame", "category": "Decisão clínica" } ],
  "feedbackCorrect": "Você separou o que produz a imagem do que decide sobre ela.",
  "feedbackIncorrect": "Pergunte de cada ação: ela produz a imagem ou decide algo a partir dela?",
  "help": "Quem faz cada ação na sala?", "sourceIds": ["…"] }
```

Reprovado: `{ "label": "Escrever o laudo (decisão clínica)", … }` ("entrega o grupo no
próprio rótulo"); todos os itens em "Tarefa técnica" ("grupo sem item").

### `multi-select` (marque todas as corretas)

**Use** quando o conceito lista várias condutas certas e o erro típico é lembrar só de
uma. O enunciado diz "Marque todas…". **Não use** com uma correta só (é múltipla
escolha) nem com todas corretas (resposta constante).

Regras: de 4 a 6 `options` (`label` até 110, `correct` booleano, `feedback` próprio de 25
a 260), de 2 a n−1 corretas, as corretas não ocupam todas as primeiras posições, nenhuma
correta mais longa que 1,2× a maior errada. O retorno do erro diz o que faltou marcar e o
que foi marcado a mais, seguido da explicação da primeira divergência.

```json
{ "id": "i4", "type": "multi-select", "role": "practice", "prompt": "Marque todas as medidas que reduzem a dose.",
  "options": [ { "label": "Usar o dosímetro", "correct": false, "feedback": "O dosímetro mede a dose; não reduz." },
               { "label": "Aumentar a distância", "correct": true, "feedback": "A distância reduz a dose recebida." },
               { "label": "Apressar o paciente", "correct": false, "feedback": "Pressa não é medida de proteção." },
               { "label": "Vestir o avental", "correct": true, "feedback": "O avental reduz a dose no tronco." } ],
  "feedbackCorrect": "Você marcou as duas medidas e deixou de fora as outras.",
  "feedbackIncorrect": "Releia o conceito: proteção é o que diminui a dose, não o que a mede.",
  "help": "O que diminui a dose, e não só a registra?", "sourceIds": ["…"] }
```

Reprovado: as duas corretas nas posições 1 e 2 ("as corretas estão todas no topo da
lista"); só uma correta ("de 2 a 3 corretas").

### Composição da aula

Continua valendo: 5 interações, ao menos 3 tipos, i1 `prerequisite`. Em M01 a M03 a meta
da 1.6 é ao menos duas famílias novas por aula, nenhuma família três vezes seguidas e a
i1 em múltipla escolha, porque a tela de revisão só sabe mostrar múltipla escolha. Desde
2026-11-19 o verificador exige ao menos uma `multiple-choice` em toda aula (seção 3b).

## 3b. Formatos da trilha dobrada (ADR-2026-11-19)

Decisões e porquês em
[`docs/adr/ADR-2026-11-19-formatos-da-trilha-dobrada.md`](../adr/ADR-2026-11-19-formatos-da-trilha-dobrada.md).
São sete formatos de interação (`hotspot`, `label`, `risk-hunt`, `conversation`,
`blitz`, `bench`, `parameter-lab`) e o `visual` do conceito. **Cada um só entra se o
aluno recupera ou decide algo com ele.** Formato novo usado como enfeite, sem pedir
que o aluno lembre ou decida, é o fracasso que a especificação da trilha dobrada
nomeia: um `hotspot` para tocar numa parte que o conceito acabou de nomear, sem
pergunta que a localize, é exatamente isso. Antes de escolher, responda: o que o
aluno precisa lembrar ou decidir aqui, e este formato cobra isso melhor que uma
múltipla escolha?

As garantias abaixo são as do verificador (`scripts/content/rtg-lesson-lint.mjs`).
Onde o guia diz "o verificador exige", há uma linha lá que exige; o que depende do
autor e o verificador não confere vem marcado como **cuidado do autor**.

Valem para os sete: `prompt` de 20 a 300 caracteres, `help` de 15 a 200,
`feedbackCorrect` e `feedbackIncorrect` de 25 a 260 **e diferentes entre si**,
`sourceIds` com fonte da unidade, `role: "safety"` junto com `criticalSafety: true`
(e só nesse caso). Nos sete, chave que não está na lista de cada formato reprova
("campo desconhecido").

### Figura: imagem ou diagrama

`hotspot`, `label` e `risk-hunt` mostram uma figura. Use **exatamente um** de
`imageId` (imagem licenciada de `content-manifest/rtg-2026/imagens.json`, com licença
CC0 ou CC BY conferida) ou `diagramId` (um dos 51 diagramas da tabela abaixo). Os dois
juntos, ou nenhum, reprovam; id fora do acervo ou do catálogo também.

**Régua de toque.** Todo alvo (ponto ou região) tem uma área de toque de 44 pt:
o alvo é ampliado em torno do centro até 44 pt de lado, se for menor. O verificador
mede a figura com 280 pt de largura e exige duas coisas: a área de toque **cabe
inteira dentro da figura** (nenhum alvo colado na borda) e **não se sobrepõe à de
outro alvo** (dois alvos nunca ficam colados; encostar na borda não conta como
sobreposição). A régua antiga do plano, "0,16 entre centros", foi trocada por esta;
vale o verificador.

Numa figura 4:3, como os 51 diagramas (280 × 210 pt na régua), 44 pt são 0,157 da
largura e 0,21 da altura. Na prática:

- **ponto** (`label`): `x` de 0,08 a 0,92 e `y` de 0,11 a 0,89; dois pontos só ficam
  bem se os centros distam 0,16 ou mais em `x`, ou 0,21 ou mais em `y`;
- **região** (`hotspot`, `risk-hunt`): `width` e `height` de 0,08 ou mais, `x + width`
  e `y + height` até 1; numa região maior que 44 pt a área de toque é a própria
  região, então duas regiões vizinhas precisam de centros afastados por metade da
  soma dos tamanhos;
- imagem com outra proporção: o verificador usa `width` e `height` do cadastro dela.

Rótulo de alvo: de 2 a 40 caracteres, sem repetir dentro da interação.

**Cuidado do autor.** Em `hotspot`, `label` e `risk-hunt` a figura lê o rótulo da
própria interação, e não o `alt` do acervo nem o do catálogo, para a descrição não
entregar a resposta; a informação de posição chega ao leitor de tela pelos rótulos dos
alvos e pelo `where`, então escreva-os para serem entendidos sem ver a figura. Só o
`visual` do conceito lê o `alt` do catálogo: confira que ele não entrega a resposta de
nenhuma interação da aula. Em `hotspot`, `label` e `risk-hunt` um diagrama em laço aparece parado, no
quadro de pôster (desde 2026-11-19): escreva o item para esse quadro.

**Origem das figuras hoje (medido em 2026-11-21).** O catálogo abaixo mistura três
origens, e o `figuras.json` registra a de cada uma. **Acervo aberto** (anatomia, 23 figuras como crânio,
esqueleto, coluna, pelve, fêmur e trato digestivo, de Servier, LadyofHats,
DBCLS/Togopic e outros, em CC BY ou domínio público): arte do autor, recolorida sem redesenhar,
com crédito no app. **Kit `anatomy`** (equipamento e cena de sala, 22 figuras das
unidades m17, m19, m21, m25, m26, m27, m30, m31 e m32): cena isométrica desenhada em
código pelo kit do repositório, arte própria do projeto. **Código antigo** (gráficos,
fluxos e esquemas de radiografia, e as figuras das outras unidades): desenhos do primeiro
catálogo, ainda não trocados; as fases 3 a 5 do
[plano de troca](../superpowers/plans/2026-11-19-troca-das-figuras.md) decidem o destino.
Se você escreve item para uma figura do acervo ou do kit, a figura é a que está no app:
confira a prévia em `docs/evidence/2026-11-19-figuras/` antes de escrever o `where`.

**Região é a caixa justa do objeto, e o selo do app fica fora dele.** Declare a região
do tamanho do objeto no desenho, nunca do tamanho da área de toque de 44 pt nem esticada
até o fundo vazio: o verificador passa e a pergunta deixa de medir o que diz. O app
(desde 2026-11-20) põe o selo do número fora da região e fora da área de toque dos
outros alvos, e o ponto de rotular tem 12 pt, com o número num selo ao lado; por isso o
objeto pequeno não precisa ser inflado no item. Se o objeto ainda ficar escondido, o
item muda (adaptar o item), a região não cresce.

### Catálogo de diagramas

Texto do `alt` resumido. **Parado** não tem movimento. **Laço** repete sozinho; com
"reduzir movimento" o aluno vê um quadro só. **Dirigido** só se move por um controle
(`parameter-lab`); fora dele aparece parado, no quadro inicial. Nenhum diagrama tem
texto dentro: o rótulo vem do conteúdo.

| id | Tipo | O que mostra |
| --- | --- | --- |
| `tubo-raios-x` | parado | Tubo de raios X: o filamento do cátodo emite elétrons para o ânodo, e o feixe sai pela janela. |
| `sala-com-riscos` | parado | Sala de raios X de frente: porta aberta sob a lâmpada acesa, tubo com campo de luz sobre o paciente, acompanhante, operador atrás do biombo e avental. |
| `colimador-abrindo` | laço | Duas lâminas abaixo do tubo se afastam e o campo de luz sobre o receptor se alarga. |
| `tubo-emitindo` | laço | Elétrons correm do filamento ao alvo do ânodo e, do ponto de impacto, fótons saem pela janela. |
| `feixe-atenuando` | laço | Feixe atravessa tecido mole com um osso: atrás do osso chegam poucos fótons e o receptor fica menos exposto. |
| `radiacao-espalhada` | laço | O feixe primário atravessa o paciente até o receptor; dentro do corpo, fótons mudam de direção e saem para os lados, mais fracos. |
| `grade-antidifusora` | laço | Fótons primários retos passam entre as lâminas da grade; os espalhados, oblíquos, param nelas. |
| `foco-e-penumbra` | laço | O ponto focal alterna entre pequeno e grande, e a faixa borrada na borda da sombra alarga e estreita. |
| `corte-tomografico-girando` | laço | Tomógrafo de frente: o paciente fica parado no centro do anel, e o tubo e o arco de detectores giram juntos. |
| `precessao-rm` | laço | Próton com o eixo inclinado em relação ao campo B0; na vista de cima, a ponta do eixo gira em círculo. |
| `eco-ultrassom` | laço | O transdutor emite um pulso que desce; na interface entre dois tecidos, parte volta como eco e parte segue mais fraca. |
| `detector-convertendo` | laço | Detector digital indireto em corte: raios X descem ao cintilador, que os converte em luz; o fotodiodo a converte em carga, lida pela matriz. |
| `compressao-mama` | laço | Mamografia de perfil: a bandeja desce e achata a mama; as estruturas internas se separam. |
| `inverso-do-quadrado` | dirigido | Fonte emite um feixe em cone; o detector se afasta e a área iluminada por ele cresce. Modelo `inverse-square`. |
| `blindagem-camadas` | dirigido | Feixe atravessa placas de blindagem; a cada placa a intensidade cai à metade. Modelo `shielding`. |
| `decaimento-radioativo` | dirigido | Sessenta e quatro átomos; a cada meia-vida, metade dos que restavam apaga. Modelo `decay`. |
| `conferencia-de-identidade` | parado | Paciente deitado numa maca com pulseira no punho; um profissional de pé segura a folha do pedido, e ao lado há uma tela de computador. |
| `transferencia-maca-mesa` | parado | Vista lateral: maca ao lado da mesa de exame com um vão entre elas, paciente deitado, suporte de soro com a linha até o braço e uma prancha encostada. |
| `pontos-de-contato-da-sala` | parado | Sala de exame de frente: porta com maçaneta, receptor vertical com barra de apoio, mesa de exame, tubo de raios X no teto e a mesa do comando com teclado. |
| `itens-de-emergencia-da-sala` | parado | Parede de uma sala de exame: porta de saída com placa, carrinho de emergência com gavetas, saída de oxigênio, botão de chamada com cordão e telefone. |
| `circuito-do-gerador` | parado | Circuito do gerador: fonte alternada, transformador com secundário de mais espiras, ponte de diodos e tubo; abaixo, um transformador menor liga o filamento. |
| `retificacao-de-onda` | parado | Três traçados de tensão empilhados: onda alternada, onda retificada que cai a zero a cada meio ciclo e tensão quase constante com ondulação pequena. |
| `anodo-giratorio` | laço | Disco do ânodo girando visto de frente; o feixe de elétrons bate sempre no mesmo ponto da pista em anel, e dali sai o feixe de raios X. |
| `espectro-de-raios-x` | parado | Gráfico sem números: curva larga que sobe e cai até zero na energia máxima, dois picos estreitos sobre ela e, à esquerda, a parte baixa cortada. |
| `esqueleto-axial-apendicular` | parado | Esqueleto de frente, da cabeça ao meio das coxas: crânio, coluna, costelas e esterno numa cor; cinturas e membros em outra cor. |
| `osso-longo` | parado | Osso longo deitado, em corte: duas pontas largas de osso esponjoso, uma faixa clara perto de cada ponta e o tubo do meio com cavidade. |
| `coluna-regioes` | parado | Coluna vertebral de perfil, com a frente do corpo à esquerda: cinco regiões em cores alternadas e quatro curvas em S duplo. |
| `articulacao-sinovial` | parado | Articulação em corte: dois ossos com cartilagem nas pontas, espaço com líquido entre eles, cápsula envolvendo e um ligamento por fora. |
| `marcos-de-superficie` | parado | Tronco e pelve de frente: contorno do corpo, ossos em traço fraco por baixo e pontos sobre os relevos ósseos que se palpam pela pele. |
| `respiracao-diafragma` | laço | Tórax de frente com traqueia, dois pulmões, costelas e o diafragma em cúpula: os pulmões crescem enquanto o diafragma desce, e depois tudo volta. |
| `circulacao-dupla` | laço | Coração de quatro câmaras com uma volta pequena até os pulmões e outra grande até o corpo; pontos azuis e amarelos correm pelas voltas. |
| `trato-digestivo` | parado | Tronco de frente com esôfago, estômago, fígado, pâncreas, o intestino delgado enovelado no centro e o intestino grosso em moldura ao redor. |
| `sistema-urinario` | parado | Tronco de frente com os dois rins ao lado da coluna, os dois ureteres descendo até a bexiga na pelve e a uretra saindo da bexiga. |
| `sistema-nervoso` | parado | Corpo de frente até as coxas: o encéfalo e a medula espinal numa cor, e nervos de outra cor saindo da medula para os braços, o tronco e as pernas. |
| `dano-ao-dna` | parado | Trecho de DNA em escada: um fóton atinge a fita; outro atinge uma molécula de água, que lança um radical até a fita. A fita tem uma quebra simples e uma dupla. |
| `grandezas-de-dose` | parado | Três painéis: bloco de tecido sob um feixe; o bloco com um fóton fino e uma partícula grossa de dano maior; um corpo com órgãos de intensidades diferentes. |
| `dosimetro-no-corpo` | parado | Profissional de avental, de frente: crachá no tórax, anel no dedo da mão estendida, dosímetro junto ao olho; num canto, quadro de parede com um dosímetro. |
| `produto-dose-area` | parado | Tubo com colimador e uma placa fina na saída; dois feixes do mesmo foco, um estreito e um largo, chegam ao paciente deitado; o largo cobre mais da placa. |
| `histograma-e-lut` | parado | Histograma com um pico estreito em cada ponta e um grupo largo no meio, coberto por uma faixa azul; ao lado, uma curva em S de conversão. |
| `realce-e-suavizacao` | parado | Três perfis empilhados de uma mesma borda: degrau com rampa curta, degrau com ultrapassagem antes e depois da borda, e degrau com rampa larga e suave. |
| `monitor-e-padrao-de-teste` | parado | Monitor com padrão de teste: degraus de cinza, dois quadrados com quadradinhos, pares de linhas; janela ao lado e seu reflexo no canto da tela. |
| `fluxo-ris-pacs` | parado | Cinco blocos ligados por setas em serpentina: prancheta, lista, tubo de raios X com mesa, cilindro de armazenamento e monitor com imagem. |
| `compressao-de-imagem` | parado | Imagem de 8 por 8 pixels, um disco, três vezes: original, igual sem perda e em blocos grosseiros com perda; acima, barras longa, média e curta. |
| `radiografia-roteiro` | parado | Esquema de radiografia de tórax em PA: pulmões escuros, coluna, coração, costelas e diafragma, com etiqueta, marcador de lado e margens claras no filme. |
| `artefatos-de-objeto` | parado | Esquema de radiografia de tórax em PA com quatro objetos densos sobrepostos ao corpo, além de pulmões, coração, costelas e clavículas. |
| `artefatos-do-detector` | parado | Esquema de radiografia de tórax em PA com três marcas estranhas à anatomia sobre a imagem, além de pulmões, coração, costelas e diafragma. |
| `ossos-do-pe` | parado | Pé direito visto de cima e deitado: calcanhar à esquerda, dedos à direita, lado do hálux em cima. Tarso, metatarsos e falanges em três cores. |
| `joelho-frente-e-perfil` | parado | Joelho direito em duas vistas: de frente à esquerda, com o lado de fora do joelho à esquerda; de perfil à direita, com a frente para a direita. |
| `femur-proximal-e-quadril` | parado | Quadril direito de frente: osso do quadril em cima e à direita, cabeça do fêmur no encaixe, colo inclinado e a diáfise descendo; lado de fora à esquerda. |
| `pelve-de-frente` | parado | Pelve de frente, lado direito do paciente à esquerda: dois ossos do quadril com três partes em cores diferentes, o sacro no meio e a última lombar acima. |
| `vertebra-tipica` | parado | Vértebra lombar vista de cima, frente do corpo para o alto: corpo grande na frente, um anel de osso atrás em volta de um furo e três processos saindo do anel. |
| `cranio-de-perfil-ossos` | parado | Crânio de perfil com a face para a esquerda: cada osso da calota, da base lateral e da face pintado de uma cor, com as suturas entre eles. |
| `linhas-do-cranio` | parado | Cabeça de perfil com duas linhas que partem da orelha para o rosto, e cabeça de frente com uma linha horizontal pelos olhos e outra vertical no meio. |
| `seios-da-face` | parado | Face de frente e cabeça de perfil com as cavidades de ar dos ossos da face pintadas, cada grupo de uma cor, ao redor das órbitas e do nariz. |
| `raio-x-movel-no-leito` | parado | Raio X no leito visto de lado: paciente sentado, aparelho móvel apontado para o tórax, operador de avental longe, uma pessoa sem avental perto e outro leito. |
| `trauma-raio-horizontal` | parado | Paciente de costas na prancha sobre a maca, visto pela cabeceira, com colar no pescoço; o feixe sai do tubo paralelo ao piso e chega a um detector em pé. |
| `contraste-no-corpo` | parado | Dois troncos de frente: um com o tubo digestivo preenchido em amarelo, outro com rins, ureteres e bexiga preenchidos em azul. |
| `fluoroscopia-cadeia` | parado | Mesa de fluoroscopia de lado: paciente deitado, tubo sob a mesa apontando para cima, receptor acima, feixe entre eles, operador, pedal e monitor. |
| `fluoroscopia-pulsada` | laço | Duas linhas do tempo: feixe contínuo em barra cheia e feixe pulsado em blocos curtos com pausas; um cursor corre pelas duas e o monitor mantém a imagem. |
| `sala-de-fluoroscopia-espalhada` | parado | Sala de fluoroscopia de lado: do paciente sai radiação em leque, com raios mais grossos sob a mesa; operador de avental, saiote, biombo e outra pessoa. |
| `contencao-pediatrica` | parado | Criança pequena deitada na mesa sob o tubo, com faixa nas pernas e espuma ao lado; acompanhante de avental segura os braços e outra pessoa está sem avental. |
| `colimacao-pediatrica` | parado | Duas vezes a mesma criança deitada, vista de cima, cada uma com um retângulo de luz do colimador: um cobre o corpo todo e o outro só o tórax. |
| `idoso-apoios-e-riscos` | parado | Pessoa idosa em pé junto ao receptor vertical na parede, com a mão numa barra; há um banco ao lado, um degrau e um tapete solto no chão e o andador longe. |
| `gestante-campo-e-feixe` | parado | Gestante de perfil em pé diante do receptor vertical; o tubo, longe, emite um campo cheio só sobre o tórax e um campo tracejado maior que alcançaria o abdome. |
| `corte-abdome-superior` | parado | Corte axial do abdome superior visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: vísceras, vasos e vértebra. |
| `corte-pelve` | parado | Corte axial da pelve na altura dos quadris, visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: ossos e órgãos. |
| `corte-pescoco` | parado | Corte axial do pescoço na altura da tireoide, visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: vias, vasos e vértebra. |
| `coluna-sagital-e-axial` | parado | Coluna lombar em duas vistas: corte sagital com a frente do corpo à esquerda e, ao lado, corte axial com a frente no alto, na altura da linha tracejada. |
| `relaxacao-t1-t2` | parado | Dois gráficos de sinal no tempo: num, duas curvas sobem até o mesmo patamar, uma rápida e uma lenta; no outro, duas curvas caem rumo a zero, rápida e lenta. |
| `linha-do-tempo-tr-te` | laço | Linha do tempo com um pulso, um eco pouco depois e o pulso seguinte bem adiante; uma chave curta e uma longa marcam os intervalos, e um cursor corre por ela. |
| `ponderacoes-no-encefalo` | parado | Três vezes o mesmo corte axial da cabeça, com ventrículos em borboleta; o brilho do líquido, da gordura e das substâncias branca e cinzenta muda em cada um. |
| `supressao-de-gordura` | parado | O mesmo corte da coxa duas vezes: num, a gordura sob a pele e a medula brilham; no outro, estão apagadas, menos um trecho junto de um pequeno objeto metálico. |
| `artefatos-de-rm` | parado | Três cortes ovais: um com cópias fracas da estrutura central, um com buraco preto de borda clara e torta, um com uma parte de fora repetida dentro. |
| `dxa-dois-feixes` | parado | Densitômetro de lado: paciente deitado de costas na mesa, fonte sob o tampo, detector acima e um feixe estreito de duas cores subindo entre eles. |
| `dxa-regioes-de-interesse` | parado | Coluna lombar de frente com quatro caixas, uma por vértebra, e fêmur proximal com caixa no colo, região no trocanter e contorno do quadril total. |
| `dxa-posicionamento` | parado | Duas cenas: de lado, paciente com as pernas dobradas sobre um bloco; de cima, pernas estendidas, posicionador entre os pés e um pé girado preso por faixa. |
| `dxa-interferencias` | parado | Imagem de coluna lombar de frente, inclinada, com um ponto metálico muito claro, um zíper ao lado e caixas de vértebra, uma delas fora do lugar. |
| `corpo-inteiro-composicao` | parado | Corpo inteiro deitado visto de cima, com o esqueleto por dentro e linhas que o dividem em regiões; ao lado, três faixas de cores diferentes empilhadas. |
| `radiografia-veterinaria` | parado | Cão deitado de lado sobre a mesa, com sacos de areia nas patas e calha de espuma; tubo acima com campo de luz no tórax; três pessoas em posições diferentes. |
| `cadeia-de-custodia` | parado | Cinco blocos em serpentina ligados por setas: invólucro lacrado, prancheta entre mãos, aparelho de imagem, livro de registro e armário com cadeado. |
| `fluxo-de-pesquisa` | parado | Cinco blocos em serpentina ligados por setas: documento com selo, folha com caneta, aparelho de imagem, ficha com tarja e cilindro com cadeado. |
| `radiografia-de-objeto` | parado | Tubo num suporte, quadro num cavalete no feixe e detector atrás; área isolada por cordão com sinal de aviso e uma pessoa ao lado do painel de comando. |
| `ciclo-de-testes` | parado | Linha do tempo de um equipamento: um marco grande no início, marcos pequenos e regulares, uma chave de boca e, logo depois, um marco médio. |
| `teste-de-feixe` | parado | Vista de lado: tubo de raios X com colimador, feixe descendo por três lâminas finas até um medidor sobre a mesa, ligado por cabo a um mostrador de barras. |
| `coincidencia-de-campo` | parado | Vista de cima de um receptor: um retângulo de luz com marcadores nos cantos e no centro e um retângulo de radiação igual, deslocado de lado. |
| `nivel-de-referencia` | parado | Gráfico de doze barras crescentes e uma linha horizontal tracejada: as três barras mais altas passam da linha e têm cor de destaque. |

De `conferencia-de-identidade` a `sistema-nervoso` (18) entraram com o lote 1 da fase C (m17 a m20), os 17 seguintes com o lote 2 (m21 a m24) e os 17 últimos, de `cranio-de-perfil-ossos` a `coluna-sagital-e-axial`, com o lote 3 (m25 a m28), e os 18 de `relaxacao-t1-t2` a `nivel-de-referencia` com o lote 4 (m29 a m32), em 2026-11-19. Nos esquemas de ressonância as cores e o patamar comum das duas curvas de T1 são convenção do desenho; em `ponderacoes-no-encefalo` a terceira cabeça é de base T2 com o líquido suprimido. Nos de densitometria os limites das regiões são aproximados: escreva "neste esquema". Os cortes da m28 seguem a convenção da tomografia (lado direito do paciente à esquerda de quem vê, frente do corpo no alto) e simplificam: o pâncreas inteiro num corte, o púbis no corte das cabeças do fêmur, e o espaço entre bexiga e reto vazio, porque ali os órgãos variam com o sexo. Em `contraste-no-corpo` as duas cores são convenção do desenho, não a cor do contraste. `trauma-raio-horizontal` mostra o paciente pela cabeceira, em corte na altura do pescoço: o texto da aula tem de dizer isso. `radiografia-roteiro`, `artefatos-de-objeto` e `artefatos-do-detector` são esquemas desenhados de uma radiografia de tórax, não imagens reais: escreva "no esquema". Azul e amarelo em `circulacao-dupla` são sangue pobre e rico em oxigênio. Em `osso-longo` a figura não distingue a ponta proximal da distal.

### `hotspot` (tocar na região)

**O aluno** toca na região da figura que responde à pergunta.
**Use** quando a competência é localizar algo pela posição ou pela função: onde os
elétrons batem, qual parte recebe o feixe. **Não use** quando o conceito já deu a
localização em texto e a pergunta só a repete, nem para nomear partes (isso é `label`).

Verificador: de 3 a 6 regiões, todas com `width` e `height`; de 1 a 2 regiões com
`"correct": true` (o valor é sempre `true`, nunca `false`) e ao menos 2 sem a marca;
chaves aceitas: `label`, `x`, `y`, `width`, `height`, `correct`, mais as comuns,
`imageId`/`diagramId`; régua de toque acima.

**Cuidado do autor.** O app oferece uma lista textual com o rótulo de cada região
("Selecionar <rótulo> na lista"): é o que o leitor de tela ouve. O rótulo nomeia a
parte, sem julgar nem dizer o que ela faz na pergunta ("Ânodo", e não "Ânodo, onde o
feixe nasce").

```json
{
  "id": "i2",
  "type": "hotspot",
  "role": "practice",
  "prompt": "Toque na parte do tubo onde os elétrons batem e o feixe de raios X nasce.",
  "diagramId": "tubo-raios-x",
  "regions": [
    { "label": "Cátodo com filamento", "x": 0.24, "y": 0.32, "width": 0.15, "height": 0.23 },
    { "label": "Ânodo", "x": 0.66, "y": 0.32, "width": 0.13, "height": 0.24, "correct": true },
    { "label": "Janela de saída", "x": 0.61, "y": 0.66, "width": 0.15, "height": 0.09 },
    { "label": "Ampola de vidro", "x": 0.09, "y": 0.25, "width": 0.09, "height": 0.38 }
  ],
  "feedbackCorrect": "Isso mesmo: os elétrons batem no ânodo, e é dali que sai o feixe útil.",
  "feedbackIncorrect": "Essa parte não recebe o impacto: procure onde os elétrons do cátodo chegam.",
  "help": "Procure onde os elétrons chegam depois de saírem do filamento.",
  "sourceIds": ["iaea-ssg46-2018"]
}
```

### `label` (rotular pontos)

**O aluno** liga fichas de nome aos pontos da figura, tocando na ficha e no ponto.
**Use** para nomear as partes de um esquema que a aula ensinou. **Não use** com mais
de seis partes, nem quando os pontos só se distinguem por um detalhe que o aluno não
consegue ver.

Verificador: de 3 a 6 `points` com `label`, `x`, `y` e `where`; de 0 a 2 `distractors`
(fichas a mais, sem ponto); nenhum rótulo repetido entre pontos e distratores. `where`
tem de 8 a 60 caracteres, é único por ponto e **não pode conter o rótulo de nenhum
ponto** (a conferência ignora acento e caixa).

**Cuidado do autor.** Quem usa leitor de tela não vê a figura: ouve "Ponto N,
<where>, rótulo X". Por isso o `where` descreve **posição ou forma**, sem nomear a
parte ("à direita, o bloco inclinado atingido pelos elétrons", e não "o ânodo"), e
nenhum `where` julga a situação. O verificador só barra o rótulo escrito por inteiro dentro do `where`; uma descrição
que entrega a função por outro caminho passa, e é você quem a evita.

```json
{
  "id": "i3",
  "type": "label",
  "role": "practice",
  "prompt": "Rotule as quatro partes do tubo de raios X, tocando na ficha e no ponto.",
  "diagramId": "tubo-raios-x",
  "points": [
    {
      "label": "Cátodo com filamento",
      "x": 0.28,
      "y": 0.44,
      "where": "à esquerda, a espiral dentro da capa"
    },
    {
      "label": "Ânodo",
      "x": 0.72,
      "y": 0.44,
      "where": "à direita, o bloco inclinado atingido pelos elétrons"
    },
    {
      "label": "Janela de saída",
      "x": 0.68,
      "y": 0.71,
      "where": "embaixo à direita, a abertura no vidro"
    },
    {
      "label": "Ampola de vidro",
      "x": 0.375,
      "y": 0.71,
      "where": "a parede curva que envolve todo o conjunto"
    }
  ],
  "distractors": ["Fio de aterramento"],
  "feedbackCorrect": "Isso mesmo: cada parte do tubo tem uma função própria.",
  "feedbackIncorrect": "Alguma parte está no lugar errado: releia o que cada uma faz no tubo.",
  "help": "Comece pela parte que emite os elétrons.",
  "sourceIds": ["esr-efrs-seguranca-2019"]
}
```

### `risk-hunt` (caça ao erro)

**O aluno** marca **todas** as regiões de risco de uma cena e confere.
**Use** para reconhecer situação insegura numa cena de rotina (sala, preparo, uso de
material). Costuma ser `role: "safety"`, com `criticalSafety: true`. **Não use** se a
cena não tem pelo menos duas situações de risco distintas, nem para pedir conduta
clínica: o aluno reconhece o risco e, diante dele, avisa a equipe (regra 3).

Verificador: de 4 a 6 regiões com `label`, `x`, `y`, `width`, `height`, `risk`
(booleano) e `feedback`; de 2 a n−1 com `risk: true` (ao menos uma região sem risco,
senão marcar tudo acerta); **as primeiras regiões da lista não podem ser todas de
risco** (intercale); `feedback` de 25 a 260 caracteres e diferente em cada região.

**Cuidado do autor.** O rótulo descreve a situação sem julgar ("Porta da sala
aberta", e não "Porta aberta, perigo"). O `feedback` de cada região, com risco ou
sem, explica por que aquela situação é ou não um risco, pois o retorno diz ao aluno
o que faltou marcar e o que foi marcado a mais.

```json
{
  "id": "i4",
  "type": "risk-hunt",
  "role": "safety",
  "criticalSafety": true,
  "prompt": "Toque em todas as situações de risco que você vê na sala de raios X.",
  "diagramId": "sala-com-riscos",
  "regions": [
    {
      "label": "Porta da sala aberta",
      "x": 0.02,
      "y": 0.08,
      "width": 0.15,
      "height": 0.82,
      "risk": true,
      "feedback": "A porta aberta com a lâmpada acesa expõe o corredor à radiação espalhada: a porta fica fechada na exposição."
    },
    {
      "label": "Operador atrás do biombo",
      "x": 0.7,
      "y": 0.43,
      "width": 0.17,
      "height": 0.47,
      "risk": false,
      "feedback": "Atrás do biombo o operador fica protegido do espalhamento e acompanha o paciente pelo vidro."
    },
    {
      "label": "Campo de luz sobre o paciente inteiro",
      "x": 0.18,
      "y": 0.26,
      "width": 0.33,
      "height": 0.4,
      "risk": true,
      "feedback": "Um campo que cobre o paciente inteiro expõe tecido sem necessidade: o campo se fecha até a região de interesse."
    },
    {
      "label": "Acompanhante ao lado da mesa",
      "x": 0.56,
      "y": 0.45,
      "width": 0.1,
      "height": 0.45,
      "risk": true,
      "feedback": "Quem fica ao lado da mesa na exposição recebe radiação espalhada: sem necessidade, sai da sala ou se protege."
    },
    {
      "label": "Avental no suporte",
      "x": 0.85,
      "y": 0.17,
      "width": 0.11,
      "height": 0.24,
      "risk": false,
      "feedback": "O avental guardado no suporte não expõe ninguém: o cuidado é pendurá-lo para não dobrar nem rachar."
    }
  ],
  "feedbackCorrect": "Isso mesmo: você achou os riscos da sala e deixou de fora o que está certo.",
  "feedbackIncorrect": "Releia a cena: algum risco ficou de fora, ou uma situação correta foi marcada.",
  "help": "Procure quem ou o que fica ao alcance do feixe e do espalhamento durante a exposição.",
  "sourceIds": ["esr-efrs-seguranca-2019"]
}
```

### `conversation` (conduzir uma conversa)

**O aluno** responde a um personagem em 2 ou 3 turnos, escolhendo a fala certa em
cada um.
**Use** para situações de comunicação: orientar, pedir ajuda, avisar a supervisão,
tranquilizar sem prometer o que não cabe ao estudante. **Não use** para cobrar um
fato isolado (isso é múltipla escolha) nem para o personagem entregar o conteúdo em
fala: a resposta certa é uma decisão, não a repetição do conceito.

Verificador: `speaker` é `lia`, `caio`, `duda` ou `paciente` (o `pixel` é o guia, não
interlocutor); `name` é obrigatório se for `paciente` e leva nome fictício; de 2 a 3
`turns`, cada um com `line` (até 200 caracteres) e de 2 a 3 `options`, **exatamente
uma correta**, com `label` (até 120), `correct` e `reply` (até 200). Em cada turno:
rótulos diferentes, `reply` diferente em cada opção e a correta **não é a mais longa
do turno** (empate passa). A resposta correta não cai na mesma posição em todos os
turnos. Chaves do item: `speaker`, `name`, `turns`, mais as comuns.

**Cuidado do autor.** A `reply` é cena, e não veredito. O verificador barra
"certo", "errado", "correto", "incorreto", "acertou" e "errou" na reação, mas nada
impede "Perfeito, era isso!" ou "Hum, não sei". Escreva a reação como o personagem
reagiria sem saber a resposta: ele entende, hesita, pergunta de volta. O rosto do
personagem é igual para escolha certa e errada até a conferência (ADR, decisão 6);
a reação escrita precisa manter essa regra.

```json
{
  "id": "i2",
  "type": "conversation",
  "role": "practice",
  "speaker": "duda",
  "prompt": "Duda está no primeiro dia de estágio. Ajude-a a conduzir o turno com o dosímetro individual.",
  "turns": [
    {
      "line": "Cheguei na sala e não sei onde prender o meu dosímetro individual. Onde ele fica?",
      "options": [
        {
          "label": "Qualquer lugar serve, o importante é estar com você no turno.",
          "correct": false,
          "reply": "Então fico tranquila e deixo no bolso."
        },
        {
          "label": "Prenda na altura do tronco, como o plano do setor manda.",
          "correct": true,
          "reply": "Entendi, vou prender aí agora."
        },
        {
          "label": "Deixe guardado no armário durante todo o exame.",
          "correct": false,
          "reply": "Mas eu queria conferir a leitura depois."
        }
      ]
    },
    {
      "line": "E se eu esquecer o dosímetro em casa? Posso entrar na sala assim mesmo?",
      "options": [
        {
          "label": "Avise a supervisão antes: sem dosímetro, não entre.",
          "correct": true,
          "reply": "Combinado, falo com a supervisão agora."
        },
        {
          "label": "Entre sem ele e anote depois que esqueceu em casa.",
          "correct": false,
          "reply": "Tá, então eu anoto no fim do turno."
        },
        {
          "label": "Pegue o de um colega só por hoje, para não atrasar.",
          "correct": false,
          "reply": "Vou pedir emprestado, então."
        }
      ]
    }
  ],
  "feedbackCorrect": "Isso mesmo: o dosímetro fica no tronco, e sem ele você avisa antes de entrar.",
  "feedbackIncorrect": "Reveja o turno: o uso segue o plano do setor, e a falta do dosímetro se avisa antes.",
  "help": "Pense no que o plano de proteção do setor pede de cada pessoa.",
  "sourceIds": ["iaea-ssg46-2018"]
}
```

### `blitz` (rodada rápida)

**O aluno** responde verdadeiro ou falso a uma sequência de afirmações curtas, uma por
vez, com retorno logo após cada toque.
**Use** para recuperar com agilidade o que a aula já ensinou e separar ideias que se
confundem. **Não use** para conteúdo novo, nem com afirmação cujo valor "depende":
em tempo curto não há espaço para a nuance.

Verificador: de 6 a 8 `statements` com `text` (de 15 a 110 caracteres), `correct`
(booleano) e `feedback` (de 25 a 260); de 2 a n−2 verdadeiras; **as três primeiras não
podem ter a mesma resposta**; as respostas **não podem alternar do começo ao fim**;
afirmação e retorno sem repetir. Chaves: `statements`, mais as comuns.

**Cuidado do autor.** O relógio é do app: não se escreve tempo no JSON. Ele desliga
sozinho com leitor de tela e com "reduzir movimento", e o aluno pode desligá-lo; por
isso a afirmação precisa ser legível sem pressa. O `blitz` não cobra vida, mas é
barrado para quem está sem vidas, como os outros formatos.

```json
{
  "id": "i3",
  "type": "blitz",
  "role": "practice",
  "prompt": "Responda verdadeiro ou falso a cada afirmação sobre a proteção no turno.",
  "statements": [
    {
      "text": "Quanto maior a distância da fonte, menor é a dose recebida.",
      "correct": true,
      "feedback": "Longe da fonte a dose cai, porque a radiação se espalha por uma área maior."
    },
    {
      "text": "O dosímetro individual reduz a dose que a pessoa recebe.",
      "correct": false,
      "feedback": "O dosímetro só registra a dose; quem a reduz é a distância, o tempo e a blindagem."
    },
    {
      "text": "O avental de chumbo protege o tronco da radiação espalhada.",
      "correct": true,
      "feedback": "O avental cobre o tronco e atenua a radiação que se espalha na sala."
    },
    {
      "text": "Material com rachadura sai de uso e a supervisão é avisada.",
      "correct": true,
      "feedback": "Material danificado não protege direito e o aviso evita que o problema se esconda."
    },
    {
      "text": "Quanto mais tempo na sala durante a exposição, menor é a dose.",
      "correct": false,
      "feedback": "Mais tempo de exposição aumenta a dose; reduzir o tempo reduz a dose."
    },
    {
      "text": "Registrar o uso do dosímetro é opcional em turnos curtos.",
      "correct": false,
      "feedback": "O registro vale em todo turno, porque mostra o uso e o desgaste do material."
    }
  ],
  "feedbackCorrect": "Isso mesmo: você separou o que protege do que expõe, no ritmo da rodada.",
  "feedbackIncorrect": "Reveja as afirmações: cada uma tem a própria explicação no retorno.",
  "help": "Leia cada afirmação com calma antes de responder.",
  "sourceIds": ["esr-efrs-seguranca-2019"]
}
```

### `bench` (bancada)

**O aluno** move um ou dois controles de um simulador e vê o efeito na imagem do
fantoma, até cumprir a meta.
**Use** para a relação entre um ajuste e a imagem (tensão e contraste, tamanho do
campo e área exposta). **Não use** para o aluno escolher a técnica de um paciente: a
bancada é demonstração, e a regra 3 continua valendo.

Verificador:

- `simulator`: `exposure` (controles `kv` e `mas`) ou `collimation` (`fieldWidth` e
  `fieldHeight`); `mode`: `explore`, `challenge` ou `correct`;
- `phantomLabel` de 3 a 60 caracteres;
- de 1 a 2 `controls`, cada um com `id` do simulador escolhido, `label` (2 a 40),
  `unit` (até 12), `min` menor que `max`, `step` positivo e `initial` dentro da faixa;
  sem controle repetido;
- `hints.tooLow` e `hints.tooHigh`, de 25 a 260 caracteres e diferentes: cada lado do
  erro tem a dica própria;
- `goal` de um destes dois tipos. **`reach`**: `control`, e `atLeast` e/ou `atMost`,
  dentro da faixa do controle; a meta **não pode valer no ponto de partida** e algum
  passo do controle precisa cair dentro dela. **`match`**: só em `exposure` e só em
  `mode: "challenge"` (único que mostra a imagem de referência), com `reference`
  (`kv` e `mas`) e `tolerance` positiva; a referência não pode já ser igual ao ponto
  de partida.

```json
{
  "id": "i2",
  "type": "bench",
  "role": "practice",
  "prompt": "Suba a tensão do tubo até 90 kV e veja o contraste do fantoma mudar.",
  "simulator": "exposure",
  "mode": "challenge",
  "controls": [
    {
      "id": "kv",
      "label": "Tensão",
      "unit": "kV",
      "min": 40,
      "max": 120,
      "step": 10,
      "initial": 60
    }
  ],
  "goal": { "kind": "reach", "control": "kv", "atLeast": 90 },
  "phantomLabel": "Fantoma simulado",
  "hints": {
    "tooLow": "Ainda falta tensão: suba o kV até o contraste aparecer.",
    "tooHigh": "Passou do ponto: desça o kV até o alvo."
  },
  "feedbackCorrect": "Isso mesmo: com 90 kV o feixe atravessa o fantoma e o contraste aparece.",
  "feedbackIncorrect": "Ainda não chegou: observe a imagem enquanto muda o kV e compare com o alvo.",
  "help": "Veja se a medida acompanha a pessoa ou fica no lugar.",
  "sourceIds": ["iaea-ssg46-2018"]
}
```

O `help` deste exemplo e o do `parameter-lab` abaixo vêm da unidade sintética e não
falam do controle. No seu, o `help` orienta o raciocínio sobre o ajuste, sem dar o
valor.

### `parameter-lab` (laboratório de parâmetros)

**O aluno** move um controle e vê, no desenho e em leituras relativas, o efeito de um
modelo simplificado, até chegar à meta.
**Use** para uma relação contínua entre uma grandeza e seu efeito: distância e
intensidade, camadas de blindagem e radiação que passa, meias-vidas e atividade.
**Não use** para dose de paciente (nunca) nem para relação que o modelo não cobre.

Verificador: `model` é `inverse-square` (Distância, 1 a 4 m, de 0,5 em 0,5), `shielding`
(camadas semirredutoras, 0 a 5, de 1 em 1) ou `decay` (meias-vidas, 0 a 6, de 1 em 1).
`start` e os limites da `goal` precisam estar nessa grade. A `goal` tem `atLeast`
e/ou `atMost` (chaves só essas; `atLeast` não passa de `atMost`) e **não pode valer
no `start`**. `hints.tooLow` e `hints.tooHigh` como na bancada. Chaves: `model`, `start`,
`goal`, `hints`, mais as comuns.

**Cuidado do autor.** As leituras são porcentagens do modelo ("Intensidade relativa",
"Radiação que passa", "Atividade restante"): diga no conceito que **vale só para este
esquema** (regra 8). Combine o enunciado com a meta: com `atLeast: 2`, qualquer
distância de 2 m para cima vale; se o enunciado pede "um quarto", use `atLeast` e
`atMost` iguais a 2.

```json
{
  "id": "i3",
  "type": "parameter-lab",
  "role": "practice",
  "prompt": "Afaste a fonte até a intensidade cair a um quarto da inicial.",
  "model": "inverse-square",
  "start": 1,
  "goal": { "atLeast": 2 },
  "hints": {
    "tooLow": "Ainda perto demais: afaste mais a fonte do ponto de medida.",
    "tooHigh": "Afastou além do necessário: aproxime um pouco a fonte."
  },
  "feedbackCorrect": "Isso mesmo: dobrando a distância, a intensidade cai a um quarto.",
  "feedbackIncorrect": "Ainda não chegou: observe a leitura enquanto muda a distância.",
  "help": "Leia cada afirmação com calma antes de julgar.",
  "sourceIds": ["esr-efrs-seguranca-2019"]
}
```

### `visual` do conceito

`concept.visual` aceita o id de um diagrama do catálogo. O diagrama aparece no
conceito, e o verificador confere só que o id existe. **Use** quando o movimento ou a
disposição espacial explica o que o texto sozinho não explica, e o corpo diz o que o
diagrama mostra. **Não use** como ilustração solta: se tirar o diagrama e nada se
perde, ele era enfeite. Prefira o que explica a ideia também parado, porque com
"reduzir movimento" o aluno vê um quadro só.

**Em unidade nova, o corpo do conceito com `visual` tem até 80 palavras** (o
diagrama assume parte da explicação). Sem `visual`, ou nas 24 unidades de hoje
(lista `LEGACY_UNITS` no verificador), o limite segue 110. O `keyPoints` não muda.

```json
{
  "title": "Como cuidar do colimador",
  "body": "Cuidar do colimador começa por conferir o estado do material. Depois você compara com o plano de proteção do setor, anota o uso e guarda no lugar certo. Quando algo não bate, a atitude certa é avisar a supervisão, sem esconder o problema.",
  "keyPoints": ["Conferir vem antes de usar.", "Dano se avisa, não se esconde."],
  "visual": "colimador-abrindo"
}
```

### Réguas novas que valem para toda aula

- **Toda aula tem ao menos uma `multiple-choice`** (a `case-decision` não conta).
  A tela de revisão espaçada só sabe mostrar múltipla escolha, e a medição mostrou
  que uma aula sem nenhuma deixa cartas de revisão que nunca são limpas; a conta está
  em
  [`docs/evidence/2026-11-19-formatos/medicao-revisao-espacada.md`](../evidence/2026-11-19-formatos/medicao-revisao-espacada.md).
  Só a M05.06, já publicada assim, é isenta.
- **Conceito com `visual` em unidade nova: até 80 palavras** (acima).
- Figura com exatamente um de `imageId` e `diagramId`, e alvos que passam na régua de
  toque de 44 pt (acima).

### As metas da trilha dobrada e como você as ajuda a cumprir

Mede-se tudo com `node scripts/content/rtg-inventory.mjs` (com `--metas`, o comando
sai com erro se alguma meta falhar). O inventário lê `content-manifest/rtg-2026/aulas/`:
a unidade precisa estar lá. Os números abaixo foram medidos em 2026-11-19, antes de
qualquer unidade nova.

- **Meta 2, menos texto: texto e formatos antigos até 50% dos passos.** Cada aula
  tem 8 passos: abertura, conceito, fecho e 5 interações. Contam como texto a abertura,
  o fecho e o conceito sem `visual`, e como antigos a `multiple-choice` e a
  `case-decision`. Regra de bolso por aula: com `visual` no conceito, até 2 interações
  de múltipla escolha ou decisão de caso; sem ele, até 1. A meta é da trilha toda,
  então uma aula acima compensa-se com outra abaixo, mas a régua da múltipla escolha
  acima já fixa o piso de 1. Hoje: 77,4%.
- **Meta 3, algo para ver: toda aula de unidade nova tem um passo visual.** Passo
  visual é conceito com `visual` ou interação `hotspot`, `label`, `risk-hunt`,
  `comparison`, `bench` ou `parameter-lab`. `conversation` e `blitz` não contam. O
  inventário lista as unidades novas com aula sem visual. Hoje: 1 de 157 aulas.
- **Meta 4, variedade: 4 ou mais famílias além de múltipla escolha e decisão de caso
  por unidade.** Conta tipo diferente de interação na unidade inteira; `ordering`,
  `matching` e as famílias da 1.6 contam. Hoje: 17 unidades abaixo de 4.

A meta 1 (48 unidades, de 300 a 320 aulas) é da produção, não do autor de uma
unidade.

### O que ainda não foi visto

Nenhum dos formatos novos, nem os diagramas em movimento, foi visto em simulador ou
aparelho até 2026-11-19: as telas têm teste de componente e história no Storybook, e
os laços foram revisados em quadros parados. Som, toque real, VoiceOver e TalkBack
ficam para a fase E e para o dono. Quando o guia diz "o aluno vê", ele descreve o
que o código faz, e não o que alguém conferiu em aparelho.

## 4. Formato do arquivo

```json
{
  "schemaVersion": 1,
  "unit": { "id": "m04", "code": "M04", "title": "Radiação, interação e proteção", "summary": "Uma ou duas frases sobre o que a unidade desenvolve." },
  "sources": [
    { "id": "iaea-gsr-part-3", "title": "Radiation Protection and Safety of Radiation Sources: International Basic Safety Standards (GSR Part 3)", "publisher": "IAEA", "url": "https://…", "accessedAt": "2026-11-18", "use": "factual-reference", "licenseNote": "Padrão internacional; consultado para fatos, sem reprodução de texto." }
  ],
  "lessons": [
    {
      "id": "m04-01", "code": "M04.01", "title": "Produzir e detectar radiação",
      "objective": "Hoje você vai conseguir ordenar as etapas entre o tubo e o detector.",
      "competency": "Ordenar a cadeia física da produção à detecção num esquema validado.",
      "minutes": 5,
      "scene": { "setting": "Laboratório didático", "lines": [
        { "speaker": "duda", "text": "…" }, { "speaker": "caio", "text": "…" }, { "speaker": "pixel", "text": "…" } ] },
      "concept": { "title": "…", "body": "…", "keyPoints": ["…", "…"] },
      "interactions": [
        { "id": "i1", "type": "multiple-choice", "role": "prerequisite", "prompt": "…",
          "options": [ { "label": "…", "correct": false, "feedback": "…" }, { "label": "…", "correct": true, "feedback": "…" }, { "label": "…", "correct": false, "feedback": "…" }, { "label": "…", "correct": false, "feedback": "…" } ],
          "help": "…", "sourceIds": ["…"] },
        { "id": "i2", "type": "ordering", "role": "practice", "prompt": "…", "items": ["…", "…", "…", "…"],
          "feedbackCorrect": "…", "feedbackIncorrect": "…", "help": "…", "sourceIds": ["…"] },
        { "id": "i3", "type": "matching", "role": "practice", "prompt": "…", "pairs": [ { "left": "…", "right": "…" } ],
          "feedbackCorrect": "…", "feedbackIncorrect": "…", "help": "…", "sourceIds": ["…"] },
        { "id": "i4", "type": "case-decision", "role": "safety", "criticalSafety": true, "context": "…", "prompt": "…", "options": [ ], "help": "…", "sourceIds": ["…"] },
        { "id": "i5", "type": "multiple-choice", "role": "transfer", "prompt": "…", "options": [ ], "help": "…", "sourceIds": ["…"] }
      ],
      "closing": { "title": "…", "body": "…", "line": { "speaker": "lia", "text": "…" } },
      "checkpoint": [
        { "prompt": "…", "options": [ ], "sourceIds": ["…"] },
        { "prompt": "…", "options": [ ], "sourceIds": ["…"] }
      ],
      "recovery": {
        "guided": { "hook": "Complete a frase: …", "item": { "prompt": "…", "options": [ ], "sourceIds": ["…"] } },
        "transfer": { "item": { "prompt": "…", "options": [ ], "sourceIds": ["…"] } }
      }
    }
  ]
}
```

`concept` aceita ainda `visual` (seção 3b). Os formatos novos têm a forma própria descrita lá; os exemplos saem da unidade sintética `scripts/content/fixtures/unidade-formatos.json`, que passa no verificador.

`sources[].use`: `factual-reference` (consulta de fatos, redação própria; vale para normas, páginas institucionais e material com licença restrita) ou `cc-by-4.0` (material CC BY 4.0, com atribuição em `licenseNote`). Fontes preferidas: Anvisa, CNEN, CONTER, Planalto, INCA, Ministério da Saúde, IAEA (RPOP e Human Health Campus), ICRP, NIBIB/NIH, RadiologyInfo, Virginia Tech Applied Human Anatomy (CC BY 4.0), OpenStax University Physics (CC BY 4.0), artigos de acesso aberto. Não use a Wikipédia como fonte única de um fato de segurança.

## 5. Antes de entregar

Rode o verificador e corrija até passar:

```bash
node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/<unidade>.json
```

O verificador confere forma, não verdade. A exatidão dos fatos é sua responsabilidade: na dúvida, corte o fato.

Depois de a unidade entrar em `content-manifest/rtg-2026/aulas/`, confira as metas da trilha dobrada com `node scripts/content/rtg-inventory.mjs` (seção 3b).

## 6. Lições da primeira onda (M01 a M07), de 2026-11-06

Saíram das sete revisões independentes e dos gates do app. Valem como regra.

1. **Limite e princípio de proteção radiológica:** cite a ICRP (publicação 103) ou a IAEA (GSR Part 3), não a norma de um país. Regra revista em 2026-11-18; a anterior apontava a norma brasileira vigente.
2. **Sem ler o texto, não atribua nada à fonte.** Se o documento não abre, o fato fica sem fonte e sai.
3. **OpenStax é só consulta.** Os livros hoje declaram CC BY-NC-SA 4.0: use `factual-reference`, sem aproveitar frase nem figura.
4. **Fato de segurança com fonte única de tipo wiki** (Radiopaedia, por exemplo): busque uma segunda fonte institucional ou escreva "siga o protocolo do serviço e peça apoio à equipe".
5. **Não cobre o que a aula não ensinou.** Foi o achado mais comum: item de conferência fora da competência, termo usado sem definição, mecanismo cobrado sem estar no conceito.
6. **Sequência didática é declarada.** Se a ordem de um item `ordering` é uma convenção sua, o conceito a ensina e o enunciado diz "na ordem ensinada nesta aula".
7. **A pista não entrega a resposta.** Várias ajudas foram reescritas por isso.
8. **Erro que dois autores repetiram:** com pouco mAs, a imagem em filme fica mais clara, não mais escura. Confira o sentido de toda relação antes de escrever o distrator.
9. **Conferência usa as quatro posições.** Nos 12 itens de conferência da unidade, a resposta correta precisa aparecer em cada uma das quatro posições ao menos uma vez.
10. **Sem texto todo em maiúsculas.** Uma alternativa que é só uma sigla de quatro letras ou mais ("O PACS") reprova no contrato de texto do app: dê uma palavra à sigla ("O sistema PACS").
11. **Diga de quem é o lado.** "Lado esquerdo do paciente", nunca só "lado esquerdo".
12. **Índices de exposição variam por fabricante.** Escreva "neste sistema o índice sobe com a exposição", nunca como regra geral.
13. **Palavras reservadas do app.** O contrato de texto trata "jornada", "nó", "checkpoint", "configuração" e "elegível" como jargão de interface e reprova a unidade. Use "turno", "ajuste", "conferência" ou outra palavra.
14. **"Não verificado" não é destino de fato.** Fato que a revisão não confirmou em página lida sai da unidade ou vira o que a fonte sustenta. Listar no parecer e manter na aula não basta: em S-TC, o osso "perto de 800 HU" e o pulmão "perto de -600 HU" vinham de uma tabela lida desalinhada e foram contraditos por uma fonte já aberta. Inferência a partir de fonte também não é fonte, e parecer de outra unidade não conta como fonte.

## 7. Brief do revisor independente

O texto abaixo é o brief que cada revisor recebeu, em inglês, como foi usado. O
revisor é sempre um agente diferente do autor e não vê a conversa dele.

You are the independent reviewer of one unit of lessons (Brazilian Portuguese) for Radiant, a Duolingo-style study app for students of the Brazilian "Curso Superior de Tecnologia em Radiologia". Another agent wrote the unit; you did not see its work. Your review replaces a human editorial gate: be strict and concrete, and fix what you find in the unit file itself.

Rules the unit must obey: this guide, sections 1 to 6 (read them first).

### Review, in this order of priority

1. **Facts.** Check every safety, normative and numeric claim against a free reputable source on the web (WebFetch/WebSearch); sample the rest. Recompute every number. A claim you cannot support is rewritten to what the source supports, or cut. Prefer primary or institutional sources. If a safety fact rests on a single wiki-style source, add a second source or soften it to "siga o protocolo do serviço e peça apoio à equipe". The Brazilian sanitary norm is Anvisa RDC 611/2022 (compiled copy on cbr.org.br if in.gov.br does not open); the protection norm in force is "Norma ANSN 3.01" (Resolução CNEN 344/2025).
2. **Professional limits.** No item may reward diagnosis, choosing an exam or technique for a patient, clinical conduct, prescribing or administering anything, patient dose calculation, clearing an implant, correcting a record alone, or acting alone when in doubt.
3. **Item quality.** Exactly one defensible correct answer; distractors plausible but wrong for a stated reason; no clue in wording, length or grammar; each wrong option's feedback explains that option's error; the two conferência items of a lesson test that lesson's competency with different answers and do not repeat a practice item; help never gives the answer away; the transfer item is really a new context; check the direction of every stated relation (increase/decrease).
4. **Teaching.** The concept teaches what the items ask; nothing is asked before it is taught, except the i1 prerequisite. A didactic sequence used in an `ordering` item is taught in the concept and the prompt says "na ordem ensinada nesta aula".
5. **Language.** Natural pt-BR, terminology used in Brazil, no guilt, no filler, no spaced dashes, dialogue lines that sound like people; "lado esquerdo do paciente", never just "lado esquerdo".

Budget: tokens are scarce. At most 15 web fetches/searches. Do not rewrite what is fine.

### When done

- The unit must pass the repository linter (prints OK): `node scripts/content/rtg-lesson-lint.mjs <unit file>`
- Write your parecer in Portuguese to the path the orchestrator gives you: title "Parecer de revisão — <UNIT>", today's date, "Revisor: Claude (<the agent's real model>), agente independente do autor, sob a ADR-2026-11-05", a table of findings (aula/item, problema, correção aplicada, fonte consultada), the facts confirmed with their URLs, what you could NOT verify (each entry says what became of it: removed, softened, or kept only because it is not a factual claim; nothing factual stays in the unit unverified), and a final line "Resultado: aprovado com correções" or "Resultado: reprovado" with the reason. Be honest: this is an AI review, not a review by a radiology professional.

### Constraints

Write only the unit file and the parecer. Do not touch the git repository, do not run `loop`, git, tests, Metro or simulators, do not read PDFs or anything under `Conteúdo/` or `conteúdo/` in the repository, do not spawn agents.

Final reply (max 8 lines): the result line; number of findings fixed; the three most important corrections; anything still unverified.

## 8. Modelo de prompt do autor

Troque o que está entre `<>`. Inclua no prompt os limites próprios da unidade (por
exemplo, em contraste: o estudante nunca prescreve, escolhe nem administra).

```text
You are authoring one full unit of lessons (in Brazilian Portuguese) for Radiant, a
Duolingo-style study app for students of the Brazilian "Curso Superior de Tecnologia em
Radiologia".

UNIT: <código> — "<título>" (id `<id>`, lessons `<id>-01` … `<id>-NN`).

1. Read the authoring guide in full, including section 6, and follow it exactly:
   docs/content/2026-11-05-guia-de-autoria-rtg-2026.md
2. Read your unit's briefs in docs/plans/2026-11-02-planejamento-conteudo-radiant.md
   (section 6 for core units, the table of section 7 for branches). One lesson per row or
   position, same order. There are NO images: use only the four text-based interaction
   types of the guide. You may add "diagramIdeas" per lesson.
3. For style and depth, skim ONE lesson of a reviewed unit in
   content-manifest/rtg-2026/aulas/ that is a prerequisite of yours.
4. Write from what you know and verify on the web every safety, normative and numeric
   claim. Budget: at most 20 web fetches/searches. Record each source actually used.
   Do not read any PDF or anything under Conteúdo/ or conteúdo/ in the repository.
5. Write the unit to <pasta de rascunhos>/<id>.json and run the linter until it prints
   OK: node scripts/content/rtg-lesson-lint.mjs <file>

Constraints: write ONLY that one output file. Do not edit the git repository, do not
run loop, git, Metro, tests or simulators. Do not spawn other agents.

Final reply (max 8 lines): output path; number of lessons; linter result; number of
sources; any fact you were unsure about or cut; what a reviewer should check first.
```

O modelo acima é o da primeira onda, só com texto. Numa unidade da trilha dobrada, troque o item 2: diga quais formatos novos a unidade deve usar, em que aulas, e mande ler a seção 3b.

Os pontos que o autor pede para conferir entram no prompt do revisor. Os de M08 a M14
estão no [índice dos pareceres](../evidence/2026-11-06-rtg-2026-revisao/README.md).

## 9. Como rodar em lote sem estourar o limite de uso

- Um agente orquestrador lança autores e revisores, no máximo quatro por vez, e devolve
  só uma tabela por unidade. O controlador não lê as unidades.
- Antes de cada lote, o orquestrador mede o uso do plano e para de lançar em 70%.
- Rascunhos e pareceres ficam fora do repositório até a aprovação. Só entram em
  `content-manifest/rtg-2026/aulas/` e em `docs/evidence/2026-11-06-rtg-2026-revisao/`
  pela receita de admissão do
  [prompt de continuidade](../superpowers/handoffs/2026-11-06-trilha-ampla-prompt-de-continuidade.md).
- Agente interrompido por limite continua do ponto em que parou, pela mensagem ao
  mesmo agente; não se recomeça.
