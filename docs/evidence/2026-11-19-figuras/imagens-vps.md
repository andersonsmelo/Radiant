# Cinco imagens reais do acervo do dono, anonimizadas (2026-11-22)

Troca de cinco figuras desenhadas por exames reais do acervo do próprio dono, pelo caminho `imageId`
(cadastro `content-manifest/rtg-2026/imagens.json`). Decisão do dono, em 2026-11-22: usar imagens reais de
ressonância e tomografia do acervo, puxar os arquivos e anonimizá-los; amostra "As 5"; crédito "CC BY 4.0, seu nome".
O dono, como titular, licencia as imagens anonimizadas em CC BY 4.0, com crédito no nome dele e "acervo próprio,
anonimizado", e declara ter o direito e o consentimento para uso educacional. Nenhuma imagem é gerada nem retocada.

## Origem e privacidade

- Origem: acervo do dono (ressonância do encéfalo e do abdome superior; tomografia do abdome, da pelve e do pescoço).
  A pasta e o nome de exame não entram no repositório, nem valor de cabeçalho.
- Antes de baixar, nas 15 séries conferidas, nenhum arquivo tinha nome, identificador ou data de nascimento preenchidos.
  Logo após a chegada, os 1567 arquivos foram anonimizados (grupo de paciente, instituição e pessoas, acesso, datas e horas,
  etiquetas privadas removidos, UIDs trocados), e a conferência final achou 0 de 1567 com identificador residual.
- Os JPEG são em tons de cinza, sem EXIF nem comentário (conferido nos marcadores do arquivo), e foram abertos no tamanho
  real: sem texto gravado nos pixels. Cada arquivo tem até 150 KiB.
- Não há original público: `sha256Original` é o do próprio JPEG da amostra, que entrou como está.

## Imagens, processamento e onde entram

| Id (`image:rtg-2026:...`) | Arquivo | Processamento | Entra em |
| --- | --- | --- | --- |
| `m28:tc-axial-abdome-superior-01` | `m28/tc-axial-abdome-superior-01.jpg` (1100 x 950) | TC com contraste, fase portal, corte de 2 mm; recorte, janela de partes moles (centro 40, largura 350 HU), ampliação de 2,5 vezes | m28-01 i2 (label), m28-06 i4 (hotspot) |
| `m28:tc-axial-pelve-01` | `m28/tc-axial-pelve-01.jpg` (1100 x 850) | TC no volume que cobre abdome e pelve, corte de 2 mm; mesma janela, ampliação de 2,5 vezes | m28-02 i2 (label) |
| `m28:tc-axial-pescoco-01` | `m28/tc-axial-pescoco-01.jpg` (1080 x 800) | TC com contraste, corte de 2 mm; mesma janela, ampliação de 4 vezes (pixel de origem de 0,52 mm) | m28-03 i2 (label) |
| `m29:rm-ponderacoes-encefalo-01` | `m29/rm-ponderacoes-encefalo-01.jpg` (1200 x 424) | RM do encéfalo; T2 axial nativo, T1 3D e FLAIR 3D com saturação de gordura reformatados (MPR, interpolação linear) no plano do T2; recorte por painel, janela por percentis 0,5 a 99,7 | m29-03 i2 (hotspot) |
| `m29:rm-supressao-gordura-01` | `m29/rm-supressao-gordura-01.jpg` (1200 x 434) | RM T2 axial do abdome superior em apneia, sem e com supressão de gordura, mesma fatia; janela de 0 ao percentil 99,5 | m29-04 i3 (hotspot) |

Orientação nas tomografias: vistas de baixo, frente no alto, lado direito do paciente à esquerda de quem vê (fígado à
esquerda da figura). Crédito de cada uma: "Anderson Melo, acervo próprio, anonimizado", CC BY 4.0. (A grafia pedida era
com parênteses; o teste `ImageCreditsScreen.test.tsx` usa o autor como expressão regular sem escapar, e os parênteses
viram grupo e reprovam. O teste está fora da lista do run; ver "Pendências".)

## O que mudou nas aulas

Lista completa, antes e depois, em `itens-alterados-vps.md` (pasta de trabalho). Resumo:

- Nos conceitos de m28-01, m28-02, m28-03, m28-06 e m29-03, o `visual` saiu (só aceita diagrama; o corpo passou a ter teto de 110 palavras).
- Todo texto de "esquema", "desenho", formas e cores do esquema foi reescrito para o corte real. No abdome, o estômago real é grande e
  passa da linha média, e o baço fica encostado na parede (não "preso ao estômago"); "o pâncreas inteiro cabe num só corte" virou "nem todo corte mostra o pâncreas inteiro".
- m28-02 i2: cinco pontos viraram quatro. A bexiga (neste nível só a base) e o reto (canal anal baixo, colapsado) não aparecem como no esquema, e entre eles há órgãos que dependem do sexo;
  os dois deixaram de ser cobrados na imagem e seguem no texto (cloze, certo e errado, checkpoints). O verdadeiro-ou-falso "o espaço entre bexiga e reto fica vazio" virou "entre a bexiga e o reto ficam órgãos que variam com o sexo", também verdadeiro.
- m28-03 i2: seis pontos viraram quatro (traqueia, carótida, jugular interna, vértebra). A tireoide e o esôfago ficam coladas à traqueia, e a área de toque de 44 pt (170 px na figura) de um não cabe sem se sobrepor à do outro; o solucionador testou todos os pontos possíveis e só esse conjunto de quatro cabe. O conceito diz que na imagem aparecem as duas asas da tireoide e que o istmo fica mais abaixo.
- m28-06 i4: o rim direito do paciente saiu das regiões, porque a caixa justa do fígado o contém e as áreas de toque se sobreporiam.
- m29-03 i2: de cinco regiões a três (ventrículos de cada imagem). O anel de gordura do T1 é fino demais para uma região de 0,08, e a região de substância branca ficaria sobre as outras.
- m29-04: a aula falava de coxa, medula e faixa clara junto ao metal; a imagem é de abdome, sem metal nem falha. O item i3, que pedia "o lugar onde a supressão não funcionou", virou "a gordura sob a pele da imagem em que a supressão foi usada" (a certa é a faixa da imagem da direita; distratores: a faixa da esquerda e a coluna de cada lado). O que a imagem não mostra (medula, objeto, falha) deixou de ser cobrado nela; o conceito e os itens de texto sobre metal continuam como descrição. O conceito não diz qual imagem tem a supressão (o item perguntaria o que o texto já deu). A ajuda de m29-05 i1, que citava a faixa do esquema, foi reescrita.
- Resposta certa dos outros itens: nenhuma mudou.

## Medidas

Todas as regiões e pontos foram medidos sobre o JPEG final (pixels) e abertos na prévia com os marcadores do app
(`imagens-vps/<id>.png`). Os selos do número ficam fora da região.

- Régua de toque (280 pt de largura): nenhum alvo sai da figura e nenhuma área de toque se sobrepõe a outra (verificador de conteúdo OK nas 40 unidades).
- m29-03 i2: a certa (ventrículos do FLAIR, 104 x 145 px) tem área de toque de 189 x 189 px; 42% dela é a própria região e 0% cai sobre os ventrículos das outras duas imagens (a mais próxima está a mais de 240 px).
- m29-04 i3: a certa é a faixa de gordura sob a pele da direita (290 x 35 px). Ela foi deslocada 8 px para baixo para a área de toque caber dentro do quadro de 101 pt de altura (centro a 94 px do topo); a caixa tem 66% de pixels claros na imagem da esquerda e 0% na da direita (faixa de 33 px de espessura mais a camada logo abaixo). A área de toque cobre 0% de qualquer outra região.
- m28-06 i4: a certa (baço, 185 x 270 px) tem área de toque de 185 x 270 px, igual à região (maior que 44 pt); 0% cai sobre o rim esquerdo, o fígado ou a vértebra (o rim termina 5 px antes do baço).
- Pontos (label), em pixels: abdome, fígado (190, 430), estômago (810, 430), baço (985, 670), pâncreas (600, 450), rim direito do paciente (335, 690); pelve, sínfise (537, 272), cabeça do fêmur (200, 415), acetábulo (738, 470), cóccix (540, 700); pescoço, traqueia (455, 195), carótida (630, 263), jugular interna (278, 268), vértebra (452, 380). Os centros distam 170 px ou mais em x ou y (44 pt).
- A "região de toque sobre a estrutura, e a certa não cobre o erro típico" vale nos três hotspots: o erro típico de cada um (a imagem vizinha, a faixa clara da esquerda, o rim) fica fora da área de toque da certa.

## Registro e orçamento

16 imagens no cadastro; o `build-rtg-batches --check` confere cada arquivo pelo hash e o teto de 150 KiB por arquivo.
`rtgImages.ts` e as aulas geradas foram regenerados; o teto de maiúsculas da licença em `rtgImages.ts` (`copy-style-baseline.json`) subiu de 23 para 28 ("CC BY 4.0" nas cinco entradas novas).
`hotspotTouch.test.ts` conta agora 90 itens de figura (76 de desenho e 14 de imagem real, antes 82 e 8; o total não muda, porque seis itens trocaram de origem).

## Números dos testes (2026-11-22, Node 20.20.2)

- Verificador de aula nas 40 unidades: 40 OK.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 453 passam, 2 falham. Uma é a conhecida (`registerSource normalizes metadata for the pilot book`). A outra é `o índice versionado lista as figuras com roteiro...`: o roteiro `m26-aula-04.yaml` está defasado (falta `centerElement: true`), por causa de um commit de Maestro anterior a este trabalho (m26 não foi tocada).
- `npx jest` em `student-checkpoints`, `settings`, `lesson-flow` e `ui/diagrams`: 68 suítes, 1663 testes, todos passam. `npx tsc --noEmit` e `npx eslint` nos arquivos tocados: sem erro.
- `npm run test:maestro-contract`: 13 passam. `npm run test:copy-style-contract`: 65 passam. `generate-rtg-maestro --check m28 m29`: ok.
