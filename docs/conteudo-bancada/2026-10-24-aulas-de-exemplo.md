# Aulas-bancada de exemplo: o texto para a revisão do dono

Escrito em 2026-10-24, na tarefa 6 do [plano 3](../superpowers/plans/2026-10-21-aula-bancada.md).
Revisão do dono: **pendente**.

São duas aulas: a de exposição (kV e mAs), da
[prancheta da aula](../design/2026-10-21-aula-bancada.html), e a de colimação,
a [segunda bancada](../evidence/2026-10-24-segunda-bancada.md). Elas ficam no
catálogo de exemplo (`radiant-app/src/features/bench/lessons/`), que só
responde em build de desenvolvimento. Nenhuma das duas vai para a trilha sem o
ok do dono em cada frase abaixo.

## Como revisar

- Cada tabela tem uma linha por frase que o aluno lê ou ouve, igual à do
  código, caractere por caractere. O teste `BenchLessonCatalog.test.ts` reprova
  quando uma frase muda só de um lado.
- Na coluna "Ok do dono", escreva ok, ou a frase como deve ficar.
- Algumas linhas dizem "não aparece". A frase existe no conteúdo, mas o alvo
  daquela bancada nunca a mostra, ou a tela de hoje não lê o rótulo do leitor de
  tela. Elas entram para a revisão ficar completa.
- O que a tela escreve por conta própria não está nas tabelas: "Resposta
  correta" e "Vamos reforçar" no retorno, "Referência" e "Sua imagem" sob as
  imagens, o valor do controle ("60 kV") e, na colimação, as linhas "Campo de
  18 × 24 cm, 432 cm²" e "Produto dose-área: 48% do campo todo".

## A física é a da radiografia digital

**Exposição.** A imagem simula um detector digital. O processamento ajusta o
brilho, então mais exposição não deixa a imagem mais escura: essa é a regra do
filme, e não vale aqui. O que as frases afirmam, e só isso, está no topo de
`radiant-app/src/features/bench/exposureModel.ts`:

- o kV controla a penetração do feixe. Com kV mais alto, o contraste entre osso
  e partes moles diminui;
- o mAs controla a quantidade de fótons. O ruído, o granulado (mosqueado
  quântico), cai com 1/√mAs: quadruplicar o mAs divide o ruído por dois;
- com processamento digital, o mAs não muda o brilho nem o contraste. Muda só o
  ruído.

O que é simplificação, e nenhuma frase afirma: o fantoma é um joelho
estilizado, nunca uma incidência real; o osso cai sempre no mesmo tom, em
qualquer kV; o ruído não muda com o kV, embora na prática mude um pouco; a
atenuação é monocromática, com coeficientes da prancheta, plausíveis e não
medidos.

**Colimação.** O que as frases afirmam está no topo de
`radiant-app/src/features/bench/collimationModel.ts`: o produto dose-área
cresce com a área irradiada (com kV e mAs fixos, metade da área dá metade do
produto dose-área); a dose num ponto dentro do campo não muda ao colimar; um
campo menor reduz a radiação espalhada; colimar até a região de interesse é
proteção radiológica.

O que é simplificação: o campo é um retângulo ideal, centrado e sem penumbra;
o produto dose-área é relativo e sem unidade; o espalhamento não aparece na
imagem; fora do campo a imagem fica clara.

Na aula de colimação, "dose" sozinha só aparece em "a dose num ponto", a frase
que diz que ela não muda. Em todo o resto a grandeza é o produto dose-área, a
mesma que a tela mostra.

## O que mudou em relação à prancheta

Para o dono decidir:

1. **Desafio, kV baixo.** A prancheta dizia "O osso ficou mais branco e as
   partes moles mais escuras que na referência". O modelo fixa o osso no mesmo
   tom, que é simplificação, então a dica diz só que o contraste ficou maior.
2. **Leitura crítica.** Saiu a alternativa "O paciente se mexeu": movimento não
   está no modelo, e a explicação dela seria física de fora dele. Entrou "O mAs
   ficou alto demais".
3. **A imagem granulada.** O passo de múltipla escolha não desenha a bancada,
   então a imagem é descrita no enunciado. Ela aparece de fato no passo
   seguinte, que começa em 2 mAs.
4. **Fechamento.** "Aula concluída" virou "O que cada controle faz". A
   conclusão, com XP e estrelas, é a tela que vem depois, e o item errado volta
   depois do fechamento.
5. **Desafio de exposição.** O kV anda de 5 em 5, e o desafio aceita 65, 70 e
   75 kV, como a prancheta aceitava 6 kV para cada lado.
6. **A região de interesse da colimação** é "os ossos, inclusive a patela", no
   fantoma estilizado. O alvo vai de 17 a 20 cm de largura: com menos de 16 cm o
   campo corta a patela, e com mais de 20 cm sobra campo só sobre partes moles.
   Pergunta ao dono: enquadrar os ossos é a referência certa, ou a região de
   interesse deveria incluir as partes moles em volta deles?

## Aula de exposição (`bancada:exposicao`)

| Passo | Frase | Ok do dono |
| --- | --- | --- |
| 1 · abertura, título | O kV e o contraste | |
| 1 · abertura, texto | Você vai operar o aparelho. Em quatro passos, descobre o que o kV e o mAs fazem com a imagem, mexendo neles. | |
| 2 · explorar, enunciado | Arraste o kV até 100 e observe a diferença entre o osso e as partes moles. | |
| 2 · explorar, rótulo do fantoma | Fantoma simulado | |
| 2 · explorar, nome do controle | Tensão do tubo | |
| 2 · explorar, unidade do controle | kV | |
| 2 · explorar, dica do erro para baixo | Ainda abaixo de 100 kV. Suba mais o kV e compare o tom do osso com o das partes moles. | |
| 2 · explorar, dica do erro para cima (não aparece: o alvo não tem máximo) | O kV já passou de 100. Compare o tom do osso com o das partes moles. | |
| 2 · explorar, retorno do acerto | Viu? Com kV alto o feixe atravessa mais, e osso e partes moles ficam com tons parecidos: menos contraste. | |
| 2 · explorar, retorno genérico do erro (não aparece: cada erro tem dica própria) | Suba o kV até 100 para ver o que acontece com o contraste. | |
| 2 · explorar, rótulo do leitor de tela (a tela ainda não o lê) | Bancada de exposição: suba o kV até 100 | |
| 3 · desafio, enunciado | Ajuste o kV até o contraste da sua imagem ficar igual ao da referência. | |
| 3 · desafio, rótulo do fantoma | Fantoma simulado | |
| 3 · desafio, nome do controle | Tensão do tubo | |
| 3 · desafio, unidade do controle | kV | |
| 3 · desafio, dica do erro para baixo | Sua imagem tem mais contraste que a referência: o kV está baixo. Suba o kV e compare de novo. | |
| 3 · desafio, dica do erro para cima | Sua imagem tem menos contraste que a referência: o kV está alto. Desça o kV e compare de novo. | |
| 3 · desafio, retorno do acerto | O contraste ficou como o da referência, que foi feita com 70 kV. | |
| 3 · desafio, retorno genérico do erro (não aparece: cada erro tem dica própria) | Compare o contraste entre osso e partes moles nas duas imagens e ajuste o kV. | |
| 3 · desafio, rótulo do leitor de tela (a tela ainda não o lê) | Bancada de exposição: iguale o contraste da referência | |
| 4 · leitura crítica, enunciado | Uma imagem do fantoma saiu granulada, com o mesmo kV da referência. O contraste entre osso e partes moles está igual ao dela, mas a imagem toda tem pontos claros e escuros espalhados. O que mudou? | |
| 4 · leitura crítica, alternativa certa | O mAs ficou baixo demais | |
| 4 · leitura crítica, alternativa errada | O mAs ficou alto demais | |
| 4 · leitura crítica, explicação de "O mAs ficou alto demais" | Com mAs alto, mais fótons formam a imagem, e o ruído cai. A imagem sairia mais limpa, e não granulada. | |
| 4 · leitura crítica, alternativa errada | O kV ficou alto demais | |
| 4 · leitura crítica, explicação de "O kV ficou alto demais" | O kV muda o contraste entre osso e partes moles, e o contraste aqui está igual ao da referência. O granulado vem de outra coisa. | |
| 4 · leitura crítica, retorno do acerto | Com mAs baixo, poucos fótons formam a imagem. O processamento ajusta o brilho, mas o ruído continua: é o granulado. | |
| 4 · leitura crítica, retorno genérico do erro (não aparece: cada erro tem explicação própria) | O contraste está igual ao da referência, e o que mudou foi o granulado. Pense na quantidade de fótons. | |
| 4 · leitura crítica, rótulo do leitor de tela (a tela ainda não o lê) | Leitura da imagem: o que deixou a imagem granulada? | |
| 5 · corrigir, enunciado | Agora corrija: suba o mAs até 16. O mAs define quantos fótons formam a imagem, e com poucos fótons sobra ruído, mesmo com o brilho ajustado pelo processamento. | |
| 5 · corrigir, rótulo do fantoma | Fantoma simulado | |
| 5 · corrigir, nome do controle | Corrente × tempo | |
| 5 · corrigir, unidade do controle | mAs | |
| 5 · corrigir, dica do erro para baixo | Ainda abaixo de 16 mAs, e o granulado continua. Suba mais o mAs. | |
| 5 · corrigir, dica do erro para cima (não aparece: o alvo não tem máximo) | O mAs já passou de 16. Compare o granulado com o do começo. | |
| 5 · corrigir, retorno do acerto | Com mais fótons, o ruído caiu, e o brilho continuou o mesmo. Quadruplicar o mAs divide o ruído por dois. | |
| 5 · corrigir, retorno genérico do erro (não aparece: cada erro tem dica própria) | Suba o mAs para formar a imagem com mais fótons. | |
| 5 · corrigir, rótulo do leitor de tela (a tela ainda não o lê) | Bancada de exposição: suba o mAs até 16 | |
| 6 · fechamento, título | O que cada controle faz | |
| 6 · fechamento, texto | O kV mexe no contraste. O mAs mexe na quantidade de fótons e no ruído. | |

## Aula de colimação (`bancada:colimacao`)

| Passo | Frase | Ok do dono |
| --- | --- | --- |
| 1 · abertura, título | O campo do tamanho certo | |
| 1 · abertura, texto | Você vai abrir e fechar o campo do feixe e ver o que muda na área irradiada e no produto dose-área. | |
| 2 · explorar, enunciado | Feche a altura do campo até 16 cm e acompanhe o produto dose-área. | |
| 2 · explorar, rótulo do fantoma | Fantoma simulado | |
| 2 · explorar, nome do controle | Altura do campo | |
| 2 · explorar, unidade do controle | cm | |
| 2 · explorar, dica do erro para baixo (não aparece: o alvo não tem mínimo) | A altura já está abaixo de 16 cm. Veja o produto dose-área. | |
| 2 · explorar, dica do erro para cima | O campo ainda passa de 16 cm de altura. Feche mais. | |
| 2 · explorar, retorno do acerto | A área do campo caiu, e o produto dose-área caiu na mesma proporção: ele cresce com a área irradiada. | |
| 2 · explorar, retorno genérico do erro (não aparece: cada erro tem dica própria) | Feche a altura do campo para ver o produto dose-área cair. | |
| 2 · explorar, rótulo do leitor de tela (a tela ainda não o lê) | Bancada de colimação: feche a altura do campo até 16 cm | |
| 3 · leitura crítica, enunciado | O campo ficou menor. O que diminuiu junto com a área? | |
| 3 · leitura crítica, alternativa certa | O produto dose-área | |
| 3 · leitura crítica, alternativa errada | A dose num ponto dentro do campo | |
| 3 · leitura crítica, explicação de "A dose num ponto dentro do campo" | A dose num ponto dentro do campo não muda ao colimar. O que cai é a área irradiada, e com ela o produto dose-área. | |
| 3 · leitura crítica, alternativa errada | O kV do aparelho | |
| 3 · leitura crítica, explicação de "O kV do aparelho" | Colimar não muda o kV nem o mAs. Muda só a área que o feixe cobre. | |
| 3 · leitura crítica, retorno do acerto | Com kV e mAs fixos, o produto dose-área é proporcional à área: metade da área, metade do produto dose-área. | |
| 3 · leitura crítica, retorno genérico do erro (não aparece: cada erro tem explicação própria) | Compare a área e o produto dose-área antes e depois de fechar o campo. | |
| 3 · leitura crítica, rótulo do leitor de tela (a tela ainda não o lê) | O campo ficou menor: o que diminuiu junto com a área? | |
| 4 · desafio, enquadrar, enunciado | Feche a largura do campo até ele cobrir os ossos, inclusive a patela, sem cortar nenhum. | |
| 4 · desafio, enquadrar, rótulo do fantoma | Fantoma simulado | |
| 4 · desafio, enquadrar, nome do controle | Largura do campo | |
| 4 · desafio, enquadrar, unidade do controle | cm | |
| 4 · desafio, enquadrar, dica do erro para baixo | O campo encosta na patela ou a corta. Abra um pouco a largura. | |
| 4 · desafio, enquadrar, dica do erro para cima | Ainda sobra campo dos lados dos ossos. Feche mais a largura. | |
| 4 · desafio, enquadrar, retorno do acerto | O campo cobre os ossos, inclusive a patela, e o que ficou fora dele não recebe o feixe direto. Colimar até a região de interesse é proteção radiológica. | |
| 4 · desafio, enquadrar, retorno genérico do erro (não aparece: cada erro tem dica própria) | Ajuste a largura até o campo cobrir os ossos, inclusive a patela, sem sobra dos lados. | |
| 4 · desafio, enquadrar, rótulo do leitor de tela (a tela ainda não o lê) | Bancada de colimação: enquadre os ossos pela largura do campo | |
| 5 · fechamento, título | O que a colimação muda | |
| 5 · fechamento, texto | O produto dose-área cresce com a área do campo. Fechar o campo até a região de interesse reduz a radiação espalhada e poupa do feixe direto o que fica fora dele. | |
