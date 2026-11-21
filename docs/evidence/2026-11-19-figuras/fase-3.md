# Fase 3: 14 gráficos redesenhados em código (integração de 2026-11-21)

Aprovada pelo dono em 2026-11-21 ("Sim, produza") depois da amostra de 2026-11-20. Gramática: [`docs/content/2026-11-19-gramatica-de-graficos.md`](../../content/2026-11-19-gramatica-de-graficos.md). Cada gráfico substitui o spec de mesmo `id` em `radiant-app/src/ui/diagrams/specs/`, sem arte de terceiro: desenho próprio em código, só cores da paleta do app. Por isso nenhum autor, licença ou página, e nenhuma entrada em `figuras.json` (J1). Prévias com os marcadores do app a 280 pt, sobre #171920, em [`fase-3/`](fase-3/) (todas abaixo de 75 KiB; a de `ciclo-de-testes` empilha o item de rotular e o de tocar).

## Figuras que entraram

| Figura | Unidade (onde aparece) | Camadas | SVG | Movimento |
|---|---|---|---|---|
| `espectro-de-raios-x` | m19 aula 5 (rotular) | 5 | 4,38 KiB | parada |
| `circuito-do-gerador` | m19 aula 1 (rotular) | 6 | 3,10 KiB | parada |
| `retificacao-de-onda` | m19 aula 2 (conceito) | 5 | 8,89 KiB | laço, pôster 0,8 |
| `dano-ao-dna` | m21 aula 1 (rotular) | 5 | 2,74 KiB | parada |
| `grandezas-de-dose` | m21 aula 2 (conceito) | 6 | 4,72 KiB | laço, pôster 0,75 |
| `histograma-e-lut` | m22 aula 1 (conceito e rotular) | 4 | 3,30 KiB | parada |
| `realce-e-suavizacao` | m22 aula 2 (conceito) | 5 | 2,45 KiB | laço, pôster 0,8 |
| `compressao-de-imagem` | m22 aula 5 (conceito) | 5 | 17,18 KiB | parada |
| `fluoroscopia-pulsada` | m26 aula 3 (conceito) | 5 | 2,44 KiB | laço, pôster 0,8 |
| `relaxacao-t1-t2` | m29 aula 1 (conceito e rotular) | 7 | 4,99 KiB | laço, pôster 0,8 (parada no rotular) |
| `linha-do-tempo-tr-te` | m29 aula 2 (conceito) | 5 | 2,72 KiB | laço, pôster 0,8 |
| `ciclo-de-testes` | m32 aulas 1 (conceito e rotular) e 6 (tocar) | 5 | 1,21 KiB | parada |
| `coincidencia-de-campo` | m32 aula 3 (tocar) | 5 | 0,71 KiB | parada |
| `nivel-de-referencia` | m32 aula 5 (rotular) | 5 | 1,20 KiB | parada |

Peso: 60,03 KiB de SVG nas 14 (o teto de 240 KiB vale por figura; a mais pesada tem 17,18 KiB). O teto total do teste do registro (8.116.109 bytes) é das figuras importadas e não muda: o teste passa. Medido em 2026-11-21 com o Node 20.20.2.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/.../itens-alterados-f3.md`, fora do git)

- m21 aula 1, `label` do DNA: cinco pontos novos; `where` do Radical passa de "ponto ciano" a "ponto branco com halo no trilho tracejado".
- m22 aula 1, `label` do histograma: cinco pontos novos; `where` da curva passa de "traço amarelo em S" a "traço em S, junto ao patamar alto".
- m22 aula 2: frase de eixos no corpo ("Eixo horizontal: posição na borda; vertical: valor do pixel.").
- m26 aula 3: o corpo troca "enquanto dura a aquisição" por "Tempo na horizontal; feixe ligado na vertical."
- m29 aula 2: o corpo ganha "Tempo na horizontal; sinal na vertical."
- m32 aula 1, `label` da linha do tempo: quatro pontos com ajuste de até 0,02.
- m32 aula 6, `hotspot` da linha do tempo: quatro regiões em caixa justa; "Círculo azul pequeno" passa a "Círculos azuis pequenos" e cobre a faixa dos três pontos.
- m32 aula 3, `hotspot` do campo: cinco regiões novas; a do centro foi encolhida 5 unidades de cada lado (ver abaixo).
- m32 aula 3, conversa: a fala e os retornos passam de "para baixo" a "para o lado", porque o deslocamento do desenho é só lateral.
- m32 aula 5, `label` do nível de referência: quatro pontos novos; o corpo ganha "cada barra é uma sala, e a altura é o valor típico".
- Sem mudança de aula: `grandezas-de-dose`, `compressao-de-imagem`, `retificacao-de-onda`, `espectro-de-raios-x`, `circuito-do-gerador`, `relaxacao-t1-t2` (os pontos atuais caem sobre a estrutura nomeada no desenho novo).

## Medidas de área de toque (itens de tocar, 44 pt a 280 pt)

Renderizado o spec no quadro de pôster e contados os pixels da área de toque da resposta certa, por categoria (fundo = as duas cores mais comuns do quadro):

- `ciclo-de-testes`, aula 6, certa "Círculo ciano médio": 23% estrutura própria, 75% fundo, 0% de qualquer outra resposta, 2% fora de região (traço do eixo). Nenhum marco errado entra na área.
- `coincidencia-de-campo`, aula 3, certa "Faixa amarelada à esquerda": 100% dentro da própria faixa (a região tem 45,5 pt de largura, acima dos 44 pt, e a área de toque é a própria região), 0% de outra resposta.

Selos (posição do app): nas rotulagens cobrem de 1% a 27% da tinta de uma estrutura vizinha, nunca o ponto rotulado. `relaxacao-t1-t2`, `circuito-do-gerador` e `nivel-de-referencia` têm os selos mais sobre a arte (ver incertezas no relatório da integração).

## Guarda nova

`diagramRegistry.test.ts`: os 8 gráficos parados não têm `periodMs`, `posterAt` nem camada móvel; os 6 em laço têm `periodMs`, `posterAt` entre 0 e 1 e de 1 a 4 camadas móveis (J4). Vista falhando com o defeito que ela nomeia: com o `posterAt` de `relaxacao-t1-t2` apagado, `relaxacao-t1-t2: laço com quadro de pôster dentro do ciclo e até 4 camadas móveis` reprova ("Received has value: undefined"), e volta a passar com o spec restaurado.

## Números dos testes (2026-11-21, Node 20.20.2)

- Verificador (`rtg-lesson-lint.mjs`): 40 de 40 unidades OK.
- `build-rtg-batches.mjs --check` e `generate-rtg-maestro.mjs --check`: ver "O que ficou fora" abaixo para m21 e m22.
- Jest (`src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`): 66 suítes, 1623 testes, todos verdes.
- `node --test` (content, qa, figuras, kit, cenas): 515 testes, 512 passam; falham `registerSource normalizes metadata for the pilot book` (alheia e conhecida) e o índice versionado dos roteiros de figura (consequência do que ficou fora).
- `tsc --noEmit` e `eslint` nos arquivos TypeScript tocados: saída 0. `npm run test:maestro-contract`: 13 de 13. `docs-contract`: passou.

## O que ficou fora (barrado pelo escopo do run, J5)

Seis roteiros `-laco.yaml` do `figuras-no-simulador.mjs` (m19-aula-02, m21-aula-02, m22-aula-02, m26-aula-03, m29-aula-01 e m29-aula-02) e quatro roteiros `radiant-app/.maestro/rtg-2026/` (m21 e m22, aula-01 e avaliacao-01, que citam o `where` mudado) não estão na lista de arquivos do run. Os dez foram gerados e guardados em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/maestro-f3-pendentes/`; não estão no git, e por isso `generate-rtg-maestro.mjs m21` e `m22 --check`, `figuras-no-simulador.mjs --check` e um teste do índice reprovam até alguém ampliar a lista e copiá-los.

Dois pendentes de texto: a frase de eixos de `retificacao-de-onda` (m19, 78 palavras) e de `histograma-e-lut` (m22, 76 palavras) não coube no teto de 80 do conceito com `visual`; os eixos dessas duas figuras ficam só no `alt` e na gramática.
