# Medidas das áreas de toque do lote 1F (2026-11-20, rodada 1 de correções)

Método (repetível): cada figura é o SPEC, como o app o recebe (`diagramSvgAt`), renderizado limpo, sem marcadores, em 960 x 720 px (Chrome headless), **sobre o fundo do app, #171920**, e uma segunda vez sobre branco. O "fundo" é o alfa menor que 0,1, calculado das duas renderizações (um pixel transparente aparece no fundo do app e no branco); a classe de cor de cada pixel vem da renderização sobre branco. Medir sobre branco, como o primeiro passe fez, confunde o periósteo claro do osso longo com o fundo e escondeu a falha dos degradês. Para cada ponto de `label` e cada região de `hotspot` das aulas m18-02, m24-04 e m28-04 contam-se os pixels da **área de toque de 44 pt** (0,157 x 0,21 do quadro; região maior que 44 pt usa a própria região) por classe de cor, e, nos pontos, também os pixels sob o **marcador** de 28 pt (disco). A sobreposição da área com as caixas declaradas em `content-manifest/rtg-2026/figuras/<id>.alvos.json` separa estruturas de mesma cor (a pelve inteira é azul). Classes: pelve = fundo, contorno (valor < 0,25), cinza claro da sínfise (#E6E8EE) e osso azul; osso longo = fundo, contorno, ciano (cartilagem), âmbar (osso compacto), azul saturado (medula e vasos) e cinza-azul (esponjoso e periósteo); coluna = fundo, contorno, branco, cinza (tecido mole), âmbar (osso), ciano (medula e raízes) e azul (disco). Amostragem de 1 em 2 pixels.

Numa figura de `label` o aluno não toca em área nenhuma para acertar: casa a ficha com o marcador, e o marcador fica sobre a estrutura. A coluna "sob o marcador" decide "o ponto cai na maior parte sobre a estrutura"; a área de 44 pt é a que a régua de toque do verificador usa.

## Spec contra fonte, sobre #171920 (guarda contra o defeito do achado 1)

Fonte (`scripts/content/figuras/fontes/<id>.svg`) e spec renderizados na mesma transformação (960 x 720, `viewBox` da fonte), sobre #171920. Contam-se os pixels em que algum canal difere em mais de 40 de 255. O esperado é só serrilhado.

| Figura | Pixels que diferem (de 691.200) |
| --- | --- |
| `pelve-de-frente` | 110 (0,016%) |
| `pelve-de-frente-recorte` | 34 (0,005%) |
| `osso-longo` | 0 (0,000%) |
| `coluna-sagital-e-axial` | 193 (0,028%) |

O defeito do achado 1: o conversor (`convert.mjs`) descarta `xlink:href`, e os degradês em cadeia do Inkscape do osso longo chegavam ao spec sem `<stop>`, o que apagava sete preenchimentos (5,86% do quadro, medido na revisão). A correção está na receita `osso-longo.mjs`, que copia os `<stop>` do degradê-base para cada degradê que o referencia e tira o `xlink:href` (7 degradês). As outras três figuras não usam `xlink:href`: o spec delas já batia com a fonte.

## pelve-de-frente (m24-04, `i2`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Ílio (0,22; 0,30) | osso azul 99,9%, contorno 0,1% | osso azul 100% | Ílio, à esquerda da figura 100% |
| Sacro (0,50; 0,555) | osso azul 77,5%, fundo 20,9% (entrada da pelve, pelo vazado do próprio desenho), contorno 1,6% | osso azul 94,3%, fundo 5,0%, contorno 0,6% | Sacro 100% |
| Articulação sacroilíaca (0,645; 0,30) | osso azul 96,1%, contorno 2,3%, fundo 1,6% | osso azul 97,4%, contorno 2,6% | Ílio à direita 72%, Sacroilíaca à direita 64%, Sacro 58% |

Leitura: a sacroilíaca é a linha entre o sacro e o ílio, e a área dela cobre por construção os dois ossos vizinhos, mas o ponto cai na caixa dela e as duas fichas vizinhas têm cada uma o seu ponto, longe (o Ílio à esquerda, o Sacro no centro).

**Sínfise púbica saiu do `i2` (item adaptado, decisão do controlador).** A peça clara da sínfise mede cerca de 10 x 29 pt (y de 0,732 a 0,869 do quadro; 2.792 px no render de 960 x 720). O marcador de 28 pt em (0,50; 0,80) cobre **2.715 desses px, 97,2% da peça**; em y 0,84 cobre 73% e em y 0,87 cobre 50%, e nenhuma posição deixa o marcador sobre a sínfise com o fundo fora (28% e 22% de fundo em y 0,84; 19% e 46% em y 0,87). O número de 38% que a primeira versão desta evidência trazia era a parte **do marcador** que cai sobre a sínfise, e não a parte **da sínfise** que o marcador cobre. A sínfise segue como região visível no `i3` (recorte) e no texto.

## pelve-de-frente-recorte (m24-04, `i3`, hotspot)

| Região | Área (a própria região, sem esticar) | Caixas declaradas |
| --- | --- | --- |
| Forame obturado, à direita da figura (CERTA; 0,651; 0,436; 0,211 x 0,267) | abertura (fundo) 70,8%, osso azul 24,0%, contorno 5,2%, sínfise 0,1% | Forame à direita 100% |
| Forame obturado, à esquerda da figura (0,139; 0,436; 0,21 x 0,267) | abertura 71,3%, osso azul 23,5%, contorno 5,2%, sínfise 0,0% | Forame à esquerda 100% |
| Sínfise púbica (0,46; 0,415; 0,08 x 0,294; área de 44 pt: x 0,421 a 0,579) | osso azul 53,3%, sínfise 38,7%, contorno 6,5%, fundo 1,6% | Sínfise púbica 51% |

A área certa não cobre a estrutura de nenhum erro típico: 0,1% de sínfise e 0% do forame oposto. O "fundo" da região certa é a própria abertura do forame, que o autor desenha vazada, e aparece escuro sobre o fundo do app. O selo de 36 x 24 pt ocupa 26% da caixa da região (0,129 x 0,114 do quadro contra 0,211 x 0,267) e cobre o canto de cima e da esquerda da abertura; o agente de arte mediu 72,6% da abertura à vista (não repeti essa conta). As regiões são as caixas declaradas, sem esticar.

## osso-longo (m18-02, `i3`, rótulo), spec corrigido

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Epífise (0,68; 0,36) | cinza-azul (esponjoso) 74,2%, âmbar 16,1%, fundo 7,8%, azul 2,0% | cinza-azul 86,5%, âmbar 11,0%, azul 2,5% | Epífise 100% |
| Diáfise (0,38; 0,47), parede âmbar de cima | âmbar 36,3%, fundo 35,4%, cinza-azul 17,9%, azul 10,4% | âmbar 63,2%, fundo 21,5%, cinza-azul 10,6%, azul 4,8% | Diáfise 56%, Cavidade medular 19% |
| Cavidade medular (0,34; 0,68), espaço azul dentro do tubo | azul (medula) 60,6%, âmbar 26,6%, cinza-azul 12,8% | azul 82,3%, âmbar 9,0%, cinza-azul 8,6% | Diáfise 100%, Cavidade medular 93% |

**Posições, e o desvio do parecer.** O parecer propôs Cavidade em (0,34; 0,62) e Diáfise em (0,24; 0,78). As duas áreas de 44 pt se sobrepõem aí (a distância é 0,10 em x e 0,16 em y; o verificador exige 0,157 em x ou 0,21 em y), e o verificador reprova (`alvos muito próximos`). A Diáfise tem de ficar dentro da caixa declarada dela (x 0,17 a 0,45, y 0,45 a 0,81), e uma Diáfise fora dela reprova em `figure-target-off-region`. Mantive a Cavidade no espaço azul, desci-a a (0,34; 0,68) e pus a Diáfise na parede âmbar de cima, em (0,38; 0,47), a 0,21 de distância em y. A Cavidade em (0,34; 0,62) dava 99,3% de azul sob o marcador e 74,3% na área; em (0,34; 0,68) dá 82,3% e 60,6%, ainda a maior parte. A Diáfise na parede de baixo, em (0,24; 0,78), dava 60,5% de âmbar sob o marcador, e a de cima dá 63,2%. Nenhuma das duas áreas da Diáfise toca a caixa da Epífise (x até 0,459; a caixa da epífise começa em 0,52), e o erro típico (trocar epífise e diáfise) não está sob a área da Diáfise: cinza-azul 17,9% contra âmbar 36,3%.

Medido sobre o fundo do app, a medula e a cavidade aparecem (o periósteo cinza e o espaço azul eram o que faltava no spec antigo). **Cartilagem articular saiu do rótulo (item adaptado, decisão do controlador a levar ao dono).** A cartilagem do autor é uma faixa de ~0,02 a 0,04 do quadro sobre a epífise; no melhor ponto permitido pela régua, (0,84; 0,68), a área de 44 pt tem 13% de ciano contra 38% de fundo, e a m18-02 tem exatamente 5 interações e nenhuma `true-false`, então a placa de crescimento também não virou verdadeiro ou falso. A cartilagem segue cobrada no `i4` (ligar) e no checkpoint; a placa, no conceito e no segundo item do checkpoint. Nenhuma resposta certa mudou. (As percentagens da cartilagem são do primeiro passe, sobre branco, e foram repetidas pelo parecer; não as refiz sobre #171920.)

## coluna-sagital-e-axial (m28-04, `i2`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Corpo vertebral (0,26; 0,47) | osso 96,6%, branco 2,9%, cinza 0,5% | osso 96,8%, branco 2,6% | Corpo vertebral 100% |
| Disco intervertebral (0,29; 0,76) | azul do disco 70,6%, osso 25,2% (o corpo vizinho, o erro típico), contorno 4,1% | azul 100% | Disco 100%, Corpo vertebral 31% |
| Canal vertebral (0,60; 0,62) | ciano 47,9%, cinza 25,3%, contorno 21,0%, branco 3,1%, osso 2,1% | ciano 54,8%, contorno 27,6%, cinza 12,4% | Canal 100%, Processo espinhoso 4% |
| Processo espinhoso (0,77; 0,39) | osso 92,8%, cinza 3,6%, branco 2,4% | osso 96,8% | Processo espinhoso 100% |

O disco mede ~0,13 do quadro de altura (27 pt de 210): é menor que os 44 pt, e a área sempre pega o osso vizinho (25,2%), mas o disco segue sendo a maior parte (70,6%) e o marcador fica 100% sobre ele. O canal tem só 2,1% do osso do processo espinhoso sob a área.

Saída bruta, com os scripts: `.superpowers/sdd/2026-11-20-figuras-1F/medidas-correcao/` (`render.mjs`, `medir.py`, `diff.py`, `saida.txt`; fora do repositório). Prévias finais, sobre #171920, em `lote-1F/<id>.png`.
