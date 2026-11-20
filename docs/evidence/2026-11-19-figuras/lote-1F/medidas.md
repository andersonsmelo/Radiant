# Medidas das áreas de toque do lote 1F (2026-11-20)

Método (repetível): cada figura é renderizada limpa, sem marcadores, em 960 x 720 px (Chrome headless, o mesmo `previewHtml` do `scripts/content/figuras/alvos-preview.mjs`). Para cada ponto de `label` e cada região de `hotspot` das aulas m18-02, m24-04 e m28-04 contam-se os pixels da **área de toque de 44 pt** (0,157 x 0,21 do quadro; região maior que 44 pt usa a própria região) por classe de cor, e, nos pontos, também os pixels sob o **marcador** de 28 pt (disco). A sobreposição da área com as caixas declaradas em `content-manifest/rtg-2026/figuras/<id>.alvos.json` separa estruturas que têm a mesma cor (a pelve inteira é azul). Classes: pelve = fundo (>= 250 nos três canais), contorno (valor < 0,25), cinza claro da sínfise (#E6E8EE) e osso azul; osso longo = fundo, contorno, ciano (cartilagem), âmbar (osso compacto), azul saturado (vasos) e tons de cinza-azul (esponjoso, medula e periósteo, que o desenho do autor mistura na mesma textura); coluna = fundo, contorno, branco, cinza (tecido mole), âmbar (osso), ciano (medula e raízes) e azul (disco). Amostragem de 1 em 2 pixels.

Numa figura de `label` o aluno não toca em área nenhuma para acertar: casa a ficha com o marcador, e o marcador fica sobre a estrutura. Por isso a coluna "sob o marcador" é a que decide "o ponto cai na maior parte sobre a estrutura"; a área de 44 pt é a que a régua de toque do verificador usa.

## pelve-de-frente (m24-04, `i2`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Ílio (0,22; 0,30) | osso azul 99,9% | osso azul 100% | Ílio, à esquerda da figura 100% |
| Sacro (0,50; 0,555) | osso azul 77,5%, fundo 20,7% (entrada da pelve, pelo vazado do próprio desenho), contorno 1,6% | osso azul 94,4%, fundo 4,9% | Sacro 100% |
| Articulação sacroilíaca (0,645; 0,30) | osso azul 96,1%, contorno 2,3%, fundo 1,6% | osso azul 97,4%, contorno 2,6% | Ílio à direita 72%, Sacroilíaca à direita 64%, Sacro 58% |
| Sínfise púbica (0,50; 0,80) | osso azul 62,4% (os dois púbis), fundo 21,1%, sínfise cinza claro 12,4%, contorno 4,0% | osso azul 56,6%, sínfise 38,2%, contorno 5,3% | Sínfise púbica 16%, Sacro 7%, forames 3% e 2% |

Leitura: a sacroilíaca é a linha entre o sacro e o ílio, e a área dela cobre por construção os dois ossos vizinhos (58% da caixa do sacro e 72% da do ílio, os outros dois rótulos do item), mas o ponto cai na caixa dela e as duas fichas vizinhas têm cada uma o seu ponto, longe (o Ílio à esquerda, o Sacro no centro). A sínfise é uma peça de 0,038 do quadro: nenhuma área de 44 pt a isola, e o marcador cobre 38% dela; a única outra ficha das proximidades (Sacro) tem 7% da área.

## pelve-de-frente-recorte (m24-04, `i3`, hotspot)

| Região | Área (a própria região, sem esticar) | Caixas declaradas |
| --- | --- | --- |
| Forame obturado, à direita da figura (CERTA; 0,651; 0,436; 0,211 x 0,267) | abertura (fundo) 70,6%, osso azul 24,1%, contorno 5,2%, sínfise 0,2% | Forame à direita 100% |
| Forame obturado, à esquerda da figura (0,139; 0,436; 0,21 x 0,267) | abertura 71,1%, osso azul 23,6%, contorno 5,2%, sínfise 0,1% | Forame à esquerda 100% |
| Sínfise púbica (0,46; 0,415; 0,08 x 0,294; área de 44 pt: x 0,421 a 0,579) | osso azul 53,3%, sínfise 38,7%, contorno 6,5%, fundo 1,5% | Sínfise púbica 51% |

A área certa não cobre a estrutura de nenhum erro típico: 0,2% de sínfise e 0% do forame oposto. O "fundo" da região certa é a própria abertura do forame, que o autor desenha vazada. O selo de 36 x 24 pt ocupa 26% da caixa da região (0,129 x 0,114 do quadro contra 0,211 x 0,267) e cobre, na prévia `pelve-de-frente-recorte.png`, o canto de cima e da esquerda da abertura; o agente de arte mediu 72,6% da abertura à vista (não repeti essa conta). As regiões são as caixas declaradas, sem esticar.

## osso-longo (m18-02, `i3`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Epífise (0,68; 0,36) | cinza-azul (esponjoso) 74,2%, âmbar 16,1%, fundo 7,8%, vasos 2,0% | cinza-azul 86,5%, âmbar 11,0%, vasos 2,5% | Epífise 100% |
| Diáfise (0,39; 0,52) | âmbar (parede) 41,2%, cinza-azul (interior do tubo) 41,3%, fundo 10,4%, vasos 7,1% | âmbar 38,3%, cinza-azul 49,8%, vasos 11,9% | Diáfise 74%, Cavidade medular 37%; Epífise 0% |
| Cavidade medular (0,22; 0,60) | cinza-azul (medula) 66,9%, vasos 16,5%, âmbar 12,5%, fundo 4,0% | cinza-azul 90,5%, vasos 7,7%, âmbar 1,8% | Diáfise 82%, Cavidade medular 63% |

A área da Diáfise não toca a caixa da Epífise (x até 0,469; a placa fica em ~0,45 e a caixa da epífise começa em 0,52), e a da Epífise não toca o corpo (x a partir de 0,601): o erro típico do item, trocar epífise e diáfise, não está sob nenhuma das duas áreas. Diáfise e Cavidade se aninham por construção (a cavidade é parte do tubo); os pontos ficam a 0,17 de distância em x, e as áreas de 44 pt não se sobrepõem.

**Cartilagem articular saiu do rótulo (item adaptado).** A cartilagem do autor é uma faixa de ~0,02 a 0,04 do quadro sobre a epífise; testei todos os pontos permitidos pela régua (x de 0,08 a 0,92, y de 0,105 a 0,895). O melhor, (0,84; 0,68), dá sob o marcador 32,5% de ciano, 43,6% de osso da epífise e 14,1% de âmbar, e na área de 44 pt só 13,4% de ciano contra 37,5% de fundo e 49% de epífise e osso compacto. O ponto do agente de arte, (0,86; 0,62), tinha 63,7% de fundo na área e 68,2% sob o marcador. Em nenhum dos dois a estrutura nomeada é a maior parte do que há sob a área, e a cartilagem continua cobrada no `i4` (ligar) e no checkpoint.

## coluna-sagital-e-axial (m28-04, `i2`, rótulo)

| Ponto (x; y) | Área de 44 pt | Sob o marcador de 28 pt | Caixas declaradas sob a área |
| --- | --- | --- | --- |
| Corpo vertebral (0,26; 0,47) | osso 96,6%, fundo 2,2% | osso 96,8% | Corpo vertebral 100% |
| Disco intervertebral (0,29; 0,76) | azul do disco 70,6%, osso 25,2% (o corpo vizinho, o erro típico), contorno 4,1% | azul 100% | Disco 100%, Corpo vertebral 31% |
| Canal vertebral (0,60; 0,62) | ciano 47,9%, cinza 25,3%, contorno 21,0%, osso 2,1% | ciano 54,8%, contorno 27,6% | Canal 100%, Processo espinhoso 4% |
| Processo espinhoso (0,77; 0,39) | osso 92,8%, cinza 3,6% | osso 96,8% | Processo espinhoso 100% |

O disco mede ~0,13 do quadro de altura (27 pt de 210): é menor que os 44 pt, e a área sempre pega o osso vizinho (25,2%), mas o disco segue sendo a maior parte (70,6%) e o marcador fica 100% sobre ele. O canal tem só 2,1% do osso do processo espinhoso sob a área (o ponto foi movido de 0,50 para 0,62 por isso, pelo agente de arte).

Saída bruta, com o script: `.superpowers/sdd/2026-11-20-figuras-1F/medidas-integrador/` (`medir.py`, `render.mjs`, `saida.txt`; fora do repositório).
