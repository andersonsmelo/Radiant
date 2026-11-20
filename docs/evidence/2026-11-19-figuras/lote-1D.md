# Lote 1D de figuras importadas (2026-11-20)

Uma figura entra no lote: `sistema-nervoso`. As outras do lote ficam fora (abaixo). Prévia dos alvos com os marcadores do app (marcador de 28 pt do rótulo, selo de 36 x 24 pt da região) em `lote-1D/sistema-nervoso.png`; os retângulos âmbar são as regiões declaradas pela figura, os ciano e os números são os alvos da aula. Item alterado, com antes e depois: `.superpowers/sdd/2026-11-19-figuras-fase-1/1D/itens-alterados.md` (resumo abaixo).

## Figura que entrou

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `sistema-nervoso` | m20-05 (`i2`) | Servier Medical Art (Servier), kit SMART-Nervous-system | CC BY 4.0 | https://smart.servier.com/smart_image/nervous-system/ |

Registro e crédito em `content-manifest/rtg-2026/figuras.json` (um autor só, no mesmo formato das outras entradas Servier; a página de origem não cita obra derivada); data de consulta 2026-11-20. **Licença:** a Commons marca as cópias PNG do mesmo kit como CC BY-SA 3.0, e a página do Servier diz CC BY 4.0. Vale a oferta do detentor (CC BY 4.0), porque a arte veio do pptx do site, e não da Commons; a divergência está registrada no `modification` da entrada. Vale também para as figuras SMART já integradas. Passou para o `build-spec.mjs` (entrada em `FIGURES`) e a regeneração pela fonte `scripts/content/figuras/fontes/sistema-nervoso.svg` devolve o spec entregue (teste de regeneração dos specs: 16 de 17, o 17º pula só sem Chrome). Receitas históricas em `scripts/content/figuras/receitas/sistema-nervoso.*`. Cobre os 4 alvos exigidos pela aula (encéfalo, medula espinal, nervos do braço direito e da perna direita do paciente), e o corpo de frente tem o lado direito do paciente à esquerda de quem vê, como a aula diz.

## Contagem de caminhos, fonte contra original

- `sistema-nervoso`: o grupo "Group 3" do slide29.xml do pptx do kit tem 360 formas (`p:sp`), a extração tem 360 caminhos, a fonte versionada tem 360 caminhos e o spec tem 360 `<path>`. Nada foi descartado. As duas circunferências dos mamilos, que o extrator do projeto ignorava, estão entre as 360 (a cópia do extrator do agente de arte as trata). O spec é produzido por `build-spec.mjs`, e não mais pelo `gerar.mjs` do agente.

## Enquadramento (decisão do controlador 3)

O agente entregou o corpo em 85,2 x 220 do quadro de 320 x 240 (margem de 10 em cima e embaixo). O `build-spec.mjs` usa escala 0,07 e margem de 3,2: o corpo passa a ocupar 90,5 x 233,6 (de 85,2 x 220), **ganho de 6% em altura e largura**, sem cortar nenhum alvo nem descartar traço (os 360 caminhos continuam dentro do quadro; contorno de 3,0 a 236,3 em y e de 115,0 a 204,7 em x, medido na renderização). Mais fechado que isso, o corpo sairia do quadro: o limite é a altura. Com a cabeça mais perto do topo, a região mínima do encéfalo (centro em y >= 0,105, para a área de toque caber no quadro) cai sobre a base do cérebro e o tronco encefálico, e a parte de cima do cérebro fica livre do selo (55 a 71% à vista). O corpo continua ocupando só 0,28 da largura do quadro (o corpo inteiro de frente é estreito): isso não muda por enquadramento.

## Item alterado (uma linha)

1. m20-05 `i2` (hotspot): coordenadas e campo `alvo` nas regiões. **Depois da revisão, a região "Medula espinal" foi retirada** (a área de toque dela cobre 82% de nervo intercostal, o erro típico do item) e o `feedbackIncorrect` deixou de citar a medula; ficam 3 regiões (Encéfalo certa, braço e perna distratores). O texto abaixo descreve a versão anterior à revisão, com quatro regiões. Enunciado, ajuda e `feedbackCorrect` não mudaram. O agente de arte tinha estendido as regiões para o fundo vazio ao lado do corpo, para o selo não cobrir a estrutura; isso foi desfeito (tocar no fundo não pode contar como acerto): regiões de 0,08 x 0,08 sobre a arte, empilhadas de 0,21 em 0,21 em y pela régua de 44 pt (encéfalo y 0,0658, medula 0,277, braço 0,4885, perna 0,6995). Nenhuma ficha foi retirada. (Versão anterior à revisão:) nenhuma estrutura fica inteira sob o selo (55 a 71% do encéfalo, 72% da medula, 67% do braço e 65% da perna à vista). As frases da aula que falam da figura (alvos "do paciente") continuam verdadeiras.

Declaradas em `figuras/sistema-nervoso.alvos.json`: as sete regiões (encéfalo, medula, braços direito e esquerdo, pernas direita e esquerda, nervos entre as costelas), todas sobre a arte (caixa da estrutura; 0,08 de largura mínima, centrada na arte). A região de aula do encéfalo estende-se uns 0,05 abaixo do cérebro, sobre o tronco encefálico, porque a régua pede o centro em y >= 0,105.

## Figuras do lote que ficam fora

- `contraste-no-corpo` (m26, só `visual` do conceito, sem interação com `diagramId`): nenhuma arte de licença aceita e de um autor só cobre os 7 alvos (esôfago, estômago, intestino delgado e cólon, mais rins, ureteres e bexiga). Candidatas: NIAID BioArt 212 e 852 (domínio público: digestivo e rins, sem ureteres nem bexiga), Mariana Ruiz (digestivo, sem urinário), Jordi March e BruceBlaus (urinário, CC BY-SA 3.0 e 4.0, recusadas), Servier (cobriria os 7, mas exige converter o PPTX e decidir a licença: há divergência de licença entre a Commons, BY-SA 3.0, e o site, CC BY 4.0). Não entra; a figura atual segue. Motivo do relatório: nenhuma arte de licença aceita e de um autor só cobre os 7 alvos sem conversão do PPTX e sem decisão de licença (a Servier cobriria os 7, mas há a divergência BY-SA 3.0 da Commons contra CC BY 4.0 do site). Juntar dois sistemas (digestivo e urinário) no mesmo corpo é decisão do dono, e não foi tomada.
- `corpo-inteiro-composicao`: não há `relatorio.md` no disco (a pasta não foi criada); o motivo vem do registro de andamento do controlador (`progress.md`, 2026-11-20): é esquema de exame (linhas de corte de regiões do corpo e legenda de osso, magra e gordura), e não anatomia, então foi reclassificada para a fase de esquemas (fases 3 a 5), decisão do dono. Fica como estava.
- `corte-abdome-superior` (m28): nenhum corte axial desenhado de licença aceita. Candidatas: Dr. Swapnil Banerjee (CC BY-SA 4.0, recusada), Peritoneum.svg (BY-SA 3.0, e corte sagital), Gray1097 (domínio público, os 7 alvos existem na gravura) reprovada por ser raster de 800 x 595 px, com rótulos gravados dentro dos órgãos, orientação de dissecção (fígado à direita da figura, o oposto da aula), nível baixo demais (baço e estômago pequenos) e preto e branco com hachuras. Não entra.
- `corte-pelve` e `corte-pescoco` (m28): ambos ficam fora (`1D/cortes-pelve-pescoco/relatorio.md`). Pelve: nenhuma candidata (os cortes vistos são coronais, sagitais ou traçados de tomografia). Pescoço: só uma candidata parcial (CC BY 4.0, raster webp de 1418 px, abaixo de 1.600 px; sem tireoide, no nível da cricoide; rótulos gravados), que serve só de referência de redesenho. Pista não esgotada: Sobotta 1906 e Braus 1921, domínio público.

## Números (2026-11-20, Node 20.20.2, árvore com só este lote)

- Verificador de aulas nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check m20`: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0, com 12 ids no índice e 17 roteiros.
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 7 para 8 em `scripts/copy-style-baseline.json` (número medido com a entrada nova).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`: 88 suítes, 1646 testes, todos passam. `npx tsc --noEmit`: saída 0.
- `npx eslint` nos três arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Peso: soma do SVG das 11 figuras importadas, 1.553.030 bytes (1516,6 KiB), contra o teto de 8.116.109 bytes do teste do registro (passa, sem subir o teto). `sistema-nervoso`: 177.597 bytes (173,4 KiB; teto de 240 KiB por figura).

## Para o dono olhar no simulador

- m20-05 `i2`, depois da correção: o selo 1 cobre a metade de baixo do encéfalo. A calota com giros, à vista sobre a cabeça, basta para reconhecê-lo?
- A área de toque de 44 pt do encéfalo vai até os nervos do pescoço (21% do que há de colorido nela): tocar a base do pescoço conta como Encéfalo. Aceitável? Não há posição mais alta, pela régua (y >= 0,105).
- A área de toque da perna direita cobre parte da perna esquerda (59% dos pixels de nervo dela) e o selo cobre as duas pernas; os dois lados são erro do mesmo tipo. O selo do braço cobre a mão e a lateral do quadril: a leitura de "braço" e "perna" está clara?
- Os nervos são linhas finas (uns 0,5 unidade): visíveis em ciano, mas finos num iPhone estreito.

Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.
