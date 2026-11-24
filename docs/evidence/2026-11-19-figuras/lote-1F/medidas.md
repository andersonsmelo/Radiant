# Medidas das áreas de toque do lote 1F (2026-11-20, rodada 1 de correções)

Método (repetível): cada figura é o SPEC, como o app o recebe (`diagramSvgAt`), renderizado limpo, sem marcadores, em 960 x 720 px (Chrome headless), **sobre o fundo do app, #171920**, e uma segunda vez sobre branco. O "fundo" é o alfa menor que 0,1, calculado das duas renderizações (um pixel transparente aparece no fundo do app e no branco); a classe de cor de cada pixel vem da renderização sobre branco. Medir sobre branco, como o primeiro passe fez, confunde o periósteo claro do osso longo com o fundo e escondeu a falha dos degradês. Para cada ponto de `label` e cada região de `hotspot` das aulas m18-02, m24-04 e m28-04 contam-se os pixels da **área de toque de 44 pt** (0,157 x 0,21 do quadro; região maior que 44 pt usa a própria região) por classe de cor, e, nos pontos, também os pixels sob o **marcador** de 28 pt (disco). A sobreposição da área com as caixas declaradas em `content-manifest/rtg-2026/figuras/<id>.alvos.json` separa estruturas de mesma cor (a pelve inteira é azul). Classes: pelve = fundo, contorno (valor < 0,25), cinza claro da sínfise (#E6E8EE) e osso azul; osso longo = fundo, contorno, ciano (cartilagem), âmbar (osso compacto), azul saturado (medula e vasos) e cinza-azul (esponjoso e periósteo); coluna = fundo, contorno, branco, cinza (tecido mole), âmbar (osso), ciano (medula e raízes) e azul (disco). Amostragem de 1 em 2 pixels.

Numa figura de `label` o aluno não toca em área nenhuma para acertar: casa a ficha com o marcador, e o marcador fica sobre a estrutura. A coluna "sob o marcador" decide "o ponto cai na maior parte sobre a estrutura"; a área de 44 pt é a que a régua de toque do verificador usa.

## Spec contra fonte, sobre #171920 (guarda contra o defeito do achado 1)

Fonte (`scripts/content/figuras/fontes/<id>.svg`) e spec renderizados na mesma transformação (960 x 720, `viewBox` da fonte), sobre #171920. Contam-se os pixels em que algum canal difere em mais de 40 de 255. O esperado é só serrilhado.

| Figura | Pixels que diferem (de 691.200) |
| --- | --- |
| `pelve-de-frente` | 110 (0,016%) |
| `pelve-de-frente-recorte` | 34 (0,005%) |
| `osso-longo` | 0 (0,000%), com a arte da Pbroks13 da rodada 1; com o fêmur do Servier, também 0 (seção abaixo) |
| `coluna-sagital-e-axial` | 193 (0,028%) |

O defeito do achado 1: o conversor (`convert.mjs`) descarta `xlink:href`, e os degradês em cadeia do Inkscape do osso longo chegavam ao spec sem `<stop>`, o que apagava sete preenchimentos (5,86% do quadro, medido na revisão). A correção está na receita `osso-longo.mjs`, que copia os `<stop>` do degradê-base para cada degradê que o referencia e tira o `xlink:href` (7 degradês). As outras três figuras não usam `xlink:href`: o spec delas já batia com a fonte.

Conserto do degradê sem id (2026-11-20, rodada de correções, osso-longo): spec novo contra o do commit 2b1556a2, ambos sobre #171920, 960x720: 0 pixels diferem acima de 40/255 (e 0 em qualquer nível). A prévia `osso-longo.png` não muda.

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

## osso-longo (m18-02, `i3`, rótulo), fêmur inteiro do Servier (decisão do dono S1, 2026-11-20 à tarde)

Substitui a seção da arte da Pbroks13, que saiu do repositório (as medidas dela, com as posições e a cartilagem, estão no histórico do git, no commit 7aa103c1). Mesmo método do início deste arquivo: spec renderizado em 960 x 720 sobre #171920 e sobre branco; classes de cor do mesmo `medir.py` (aqui, "osso compacto (âmbar)" é o âmbar do autor e "cinza-azul" é o âmbar claro, o tom mais claro do mesmo osso, porque o autor desenhou só âmbar e ciano). Scripts em `.superpowers/sdd/2026-11-20-figuras-1F/medidas-osso-servier/` (`render.mjs`, `medir.py`, `diff.py`, `caixas.py`, `escolher.py`; fora do repositório).

**Regiões declaradas** (`osso-longo.alvos.json`, S3): a caixa justa de cada trecho do desenho, medida no alfa do spec (alfa >= 0,1), sem inflar. Epífise proximal (0,037; 0,325; 0,222 x 0,231), Diáfise (0,400; 0,421; 0,200 x 0,124), Epífise distal (0,829; 0,460; 0,141 x 0,212), e as capas de cartilagem do autor, pela cor ciano: da cabeça (0,040; 0,443; 0,089 x 0,110) e do côndilo (0,903; 0,476; 0,066 x 0,185). **A caixa da Diáfise é a caixa justa do trecho x 0,40 a 0,60 do corpo**, que já tem 0,124 de altura porque o corpo é inclinado (nas faixas de 0,10 de largura entre x 0,2 e 0,8, a caixa justa mede de 0,096 a 0,126): não precisou passar da caixa justa para chegar ao mínimo de 0,08. As capas não são usadas em aula. **As caixas das epífises não avançam sobre o corpo (K4, 2026-11-20, conferido no spec sobre #171920):** altura do osso por coluna x (alfa >= 0,1): o corpo mede 0,087 em x 0,26, 0,072 em x 0,50 e 0,085 em x 0,78; a ponta proximal chega a x 0,259 (altura 0,087, a do corpo) e a ponta distal começa em x 0,829, já alargada (0,10 contra 0,08 do corpo ao lado; o alargamento começa em x 0,80). As caixas já são justas a cada ponta: não foram mudadas. Estreitar a proximal para antes de x 0,24 tiraria o ponto (0,23; 0,41) de dentro dela e jogaria o marcador 1 para fora da própria caixa. O que passa para o corpo é a área de toque de 44 pt e o marcador, não a caixa.

**Quanto de cada epífise o marcador esconde** (pixels do osso, alfa >= 0,1, dentro da caixa declarada da epífise, sob o disco de 28 pt, raio 14 pt = 0,05 do quadro em x):

| Ponto (x; y) | Epífise (px) | Escondido pelo marcador | Marcador sobre osso | Sobre a capa ciano |
| --- | --- | --- | --- | --- |
| Epífise proximal (0,23; 0,41), proposta do agente de arte (0,165; 0,41) | 19.317 | **26,1%** (proposta: 35,3%) | 84,1% (proposta: 94%) | 0% |
| Epífise distal (0,85; 0,61), proposta do agente de arte (0,85; 0,56) | 16.449 | **24,8%** (proposta: 33,0%) | 65,1% (proposta: 96%) | 0% |

Os pontos foram escolhidos por busca em grade de 0,01, dentro da caixa declarada, com o centro sobre o osso e o marcador em ao menos 55% sobre a própria caixa e o osso, entre os que escondem menos da epífise (o mínimo sem a restrição de ficar dentro da caixa, 14,3% em (0,25; 0,45) e 11,6% em (0,82; 0,51), põe o marcador sobre o corpo ou fora da caixa, e foi descartado). O marcador 1 fica na região dos trocanteres, antes do corpo; o 3, na ponta larga, antes da capa ciano. No meio da caixa distal, (0,90; 0,56), o marcador esconderia 43,9%. As duas capas ciano ficam inteiras à vista.

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Epífise proximal (0,23; 0,41) | âmbar 47,7%, fundo 49,7%, contorno 1,3%, âmbar claro 1,3% | âmbar 81,3%, fundo 15,6%, contorno 1,7% | Epífise proximal 62% |
| Diáfise (0,50; 0,48) | fundo 64,6%, âmbar 30,4%, âmbar claro 3,8%, contorno 1,2% | âmbar 57,3%, âmbar claro 6,8%, fundo 34,0%, contorno 1,8% | Diáfise 59% |
| Epífise distal (0,85; 0,61) | âmbar 50,7%, fundo 40,4%, ciano 6,0%, âmbar claro 1,9%, contorno 1,0% | âmbar 61,4%, fundo 34,9%, âmbar claro 2,5%, contorno 1,2% | Epífise distal 50%, Cartilagem do côndilo 12% |

Leitura. Nenhuma área de 44 pt toca a caixa de outro alvo da aula: o erro típico (trocar epífise e diáfise) não está sob nenhuma área (a área da proximal vai de x 0,152 a 0,309, e a Diáfise começa em 0,40; a da distal, de 0,771 a 0,929, e a Diáfise termina em 0,60). O corpo é mais fino do que o marcador (~0,10 contra 0,133 do quadro), por isso o marcador 2 tem 34% de fundo em qualquer posição do corpo (no melhor ponto medido, 64 a 66% sobre osso); o ponto fica na maior parte sobre a estrutura. A área de 44 pt tem 40% a 65% de fundo, porque o osso é uma faixa fina deitada no quadro.

## Spec contra fonte, osso-longo (fêmur do Servier), sobre #171920

Spec e fonte `scripts/content/figuras/fontes/osso-longo.svg` na mesma transformação, 960 x 720: **0 de 691.200 pixels diferem em mais de 40/255** (passe de 2026-11-20 à tarde). A tabela do início deste arquivo traz a mesma conta da rodada 1, feita com a arte da Pbroks13.

## coluna-sagital-e-axial (m28-04, `i2`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Corpo vertebral (0,26; 0,47) | osso 96,6%, branco 2,9%, cinza 0,5% | osso 96,8%, branco 2,6% | Corpo vertebral 100% |
| Disco intervertebral (0,29; 0,76) | azul do disco 70,6%, osso 25,2% (o corpo vizinho, o erro típico), contorno 4,1% | azul 100% | Disco 100%, Corpo vertebral 31% |
| Canal vertebral (0,60; 0,62) | ciano 47,9%, cinza 25,3%, contorno 21,0%, branco 3,1%, osso 2,1% | ciano 54,8%, contorno 27,6%, cinza 12,4% | Canal 100%, Processo espinhoso 4% |
| Processo espinhoso (0,77; 0,39) | osso 92,8%, cinza 3,6%, branco 2,4% | osso 96,8% | Processo espinhoso 100% |

O disco mede ~0,13 do quadro de altura (27 pt de 210): é menor que os 44 pt, e a área sempre pega o osso vizinho (25,2%), mas o disco segue sendo a maior parte (70,6%) e o marcador fica 100% sobre ele. O canal tem só 2,1% do osso do processo espinhoso sob a área.

Saída bruta, com os scripts: `.superpowers/sdd/2026-11-20-figuras-1F/medidas-correcao/` (`render.mjs`, `medir.py`, `diff.py`, `saida.txt`; fora do repositório). Prévias finais, sobre #171920, em `lote-1F/<id>.png`.
