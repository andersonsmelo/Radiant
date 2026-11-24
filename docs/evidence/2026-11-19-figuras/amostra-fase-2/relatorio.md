# Amostra fase 2: cena isométrica e prancha da figura humana (skill `anatomy`)

Data: 2026-11-20. Pasta: esta (ignorada pelo git). Nada entrou no repositório.
Custo: cerca de 40 chamadas de ferramenta, na faixa de 1 h de trabalho, 3 s por geração completa (`node cena/build.mjs`, Node 20, Chrome headless).

## Entregas
| Arquivo | O que é |
|---|---|
| `cena/build.mjs` | Gera tudo. Parte do `build.mjs` do piloto (mesmo mundo em cm, leito a 65°, DFoFi 95), reescrito com a pessoa paramétrica. |
| `cena/figura.svg` | 198,3 KiB (39 KiB com gzip), teto 240. 640 x 480 (4:3). XML válido. |
| `cena/previa.png`, `cena/previa-alvos.png` | 960 x 720 sobre `#171920`; a segunda traz as cinco áreas de toque numeradas. |
| `cena/alvos.json` | As cinco áreas em fração do quadro, mais o centro de cada alvo. |
| `pessoas/lib.mjs` | Helpers do kit e a função `human()`. |
| `pessoas/render.mjs` | Achata CSS em atributos e otimiza `d=""`. |
| `pessoas/prancha.mjs`, `prancha.png`, `prancha.html` | Prancha das quatro variações, no tamanho da cena e ampliada. |

## Checagem do SVG (medida)
- Sem `text`, `image`, `style`, `filter`, `mask`, `clipPath`, `use`, `pattern`, `class`, `var(`: nenhum (busca no arquivo).
- Cores: só hexadecimais, mais `none` e `url(#gx)` (um gradiente linear do feixe).
- Para chegar aí foi preciso um passo que a skill não tem: o kit pinta por CSS com variáveis e a halo usa `filter: blur`. O Chrome headless calcula o estilo de cada elemento e o script grava `fill`, `stroke`, `stroke-width` (já em unidades do quadro 640, equivalendo a 0,7 pt a 320 pt) e opacidades como atributos. As halos foram trocadas por sombras planas translúcidas.
- O primeiro resultado tinha 297 KiB. A reescrita de `d=""` em coordenadas relativas, com 1 decimal e sem zeros à esquerda, derrubou para 190 KiB sem mudar o desenho (a conferência foi visual, em `previa.png`). Os 8 KiB a mais até 198 KiB vieram da pessoa com 4 seções de tronco.
- Sem animação (quadro parado, feixe aceso). O piloto tinha `@keyframes`, que foi retirado porque `style` é proibido.

## Os cinco alvos
Os cinco aparecem, e as áreas de toque não se sobrepõem (verificado por código: `overlaps: []`). Cada área tem 0,1578 x 0,2104 do quadro (101 x 101 em 640 x 480, passa de 0,157 x 0,21).

| # | Alvo | Área (x, y), fração do quadro | Sobre o quê |
|---|---|---|---|
| 1 | Tubo alinhado com o detector | 0,437 / 0,364 | cabeçote e colimador |
| 2 | Pessoa sem avental junto à cabeceira | 0,093 / 0,2198 | cabeça e peito dela |
| 3 | Operador de avental, afastado | 0,842 / 0,291 | busto e avental, atrás do aparelho |
| 4 | Leito vizinho, no sentido do feixe | 0 / 0,4 | colchão e manta do leito vizinho |
| 5 | Detector atrás das costas | 0,273 / 0,4 | placa azul atrás do tórax |

Os centros de 1, 2, 4 e 5 foram deslocados à mão para eliminar a sobreposição (1 com 5 e 2 com 4 se tocavam). Consequência: a área 5 também pega o peito do paciente, e a 4 cobre o colchão, mais do que o paciente.

## Técnica
- Paciente recostado no encosto a 65°, detector paralelo atrás das costas, feixe perpendicular a ele, vindo do tubo para o tórax (campo de 32 x 32 cm no centro do tórax, não na cabeça). A geometria sai dos números, não de ajuste a olho.
- Operador de avental (azul, borda azul claro, protetor de tireoide e alças), com o disparador na mão, a mais de 2,5 m do feixe, atrás do aparelho.
- Pessoa de camisa clara, sem avental, a cerca de 1 m da cabeceira, com três linhas tracejadas âmbar de radiação espalhada do tórax até ela.
- Leito vizinho na cabeceira, com paciente deitado, e uma linha tracejada âmbar prolongando o feixe até o pé dele.
- Limite físico a declarar: o feixe sai na direção da cabeceira e para baixo. Em prumo real, ele passaria por baixo do leito vizinho. A figura aproxima o leito para a linha encostar nele; é uma licença do item, não geometria rigorosa.

## O que vi ao abrir cada PNG
- `cena/previa.png`: a cena lê como radiografia no leito; o aparelho e o leito continuam bons. O feixe âmbar vai do colimador ao tórax. O operador azul à direita se destaca bem do fundo. À esquerda, a pessoa e o leito vizinho se encavalam: o corpo dela cobre boa parte do paciente vizinho, que só se vê como manta azul com um torso e uma mão.
- `cena/previa-alvos.png`: cinco retângulos numerados, sem sobreposição. O 5 cobre o detector e o peito do paciente, e o 4 cai no colchão do vizinho.
- `pessoas/prancha.png`: as quatro variações aparecem. No tamanho da cena (cerca de 330 px de altura de pé a 960 px de largura), as figuras de pé são legíveis, e o avental azul se distingue da camisa clara. Ampliadas, mostram os defeitos.

## A figura humana: continua parecendo manequim
Sim. Melhorou em relação ao piloto (que usava cilindros e esferas), mas ainda é um boneco articulado.
O que foi feito:
- proporções de adulto de 172 cm: cabeça de 23 cm, ombros de 37 cm, pernas e pés com sapato;
- cabeça elipsoidal com cabelo escuro;
- tronco em quatro prismas de seção arredondada, e não cilindro;
- braços e pernas afilados;
- avental envolvente do joelho ao peito, com protetor de tireoide e alças;
- a mesma função gera as quatro poses (em pé, recostada, deitada).

O que continua fraco:
- o tronco em prismas empilhados mostra emendas horizontais, como armadura;
- os ombros são esferas que parecem bolas coladas;
- não há rosto, mãos com dedos, cintura ou quadril definidos, nem dobras de tecido;
- as pernas parecem canudos; o joelho não dobra, então a pose recostada tem as pernas esticadas e rígidas;
- no tamanho da cena a 960 px já é aceitável como "pessoa", mas a 320 pt (a metade) as figuras são pequenas, e só a cor distingue avental de camisa.
Para sair do manequim com a skill seria preciso lathe com seção não circular (ela não tem) ou desenhar à mão.

## O que ficou fraco na cena
- O paciente recostado é pequeno e é ocultado em parte pelo feixe e pelo detector. A cabeça e o peito se leem, mas o torso aparece como uma mancha clara azulada.
- O leito vizinho está cortado pela borda esquerda do quadro (propositalmente, para não encolher a cena) e quase coberto pela pessoa sem avental. Dá para reconhecer a cama, mas o "paciente que não pode sair" pouco se vê.
- A ordem de pintura é manual (não rodei `audit.mjs`), e as partes de cada pessoa são ordenadas pelo centro, o que pode errar em outro ângulo de câmera.
- Sem texto nem legenda no desenho, e a linha do feixe prolongado para o vizinho depende do aluno entender o tracejado.
- O arquivo usa `stroke-width` já multiplicado (1,4 no quadro 640) em vez de `vector-effect`; se o SVG for mostrado em outra largura além de 320 pt, as linhas escalam junto.
- Não foi testado no `react-native-svg`: só renderizado no Chrome.
