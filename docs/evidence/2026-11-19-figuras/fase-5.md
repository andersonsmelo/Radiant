# Fase 5: esquemas de radiografia, busca de imagem real (medido em 2026-11-20 e 21)

**Resultado: nenhuma troca.** As 13 figuras da fase 5 e dos cortes ficam com a figura atual. A busca achou arte aberta para 3 delas; nenhuma das 3 entrou, pelos motivos abaixo.

Decisões do controlador sob a delegação do dono ([ADR, adendo de 2026-11-21](../../adr/ADR-2026-11-19-figuras-por-tipo.md)): R2 (método: imagem real CC0 ou CC BY sem identificação onde existir; onde não existir, a figura atual fica, porque o dono reprovou figura de anatomia ou exame desenhada por modelo), R3 (os cortes axiais da m28 e o corpo inteiro entram na busca), R10, R11 e R23.

## A busca

Só o Wikimedia Commons, pela API (busca por texto, categoria e licença, mais a página inteira e o histórico das recomendadas). Regra de licença do dono: CC0, domínio público declarado ou CC BY; nunca CC BY-SA, NC ou ND. Resolução mínima de 1.600 px para raster. Não foram tentados Europe PMC, Openverse nem Servier (cortes axiais): ficam como limite. As candidatas barradas por BY-SA ou por resolução foram lidas só pelos metadados.

| Figura | Achada | O que aconteceu | Decisão |
| --- | --- | --- | --- |
| `radiografia-roteiro` | sim, tórax PA CC0 (Stillwaterising, 2412 x 1956) | cobre 4 de 6 alvos; a imagem real não tem etiqueta de identificação nem borda de colimação nítida | **R23: fica com o esquema** |
| `corte-abdome-superior` | sim, Sobotta 417 (1906, domínio público, 2097 x 1314) | rótulos em inglês impressos entregam a resposta do rotular; costas no alto, ao contrário da aula; sem estômago e baço | **R10: fica com a figura atual**. Em 2026-11-22, trocada por tomografia real do acervo do dono (`imagens-vps.md`) |
| `corpo-inteiro-composicao` | sim, esqueleto de LadyofHats (domínio público, já usado no app) | as linhas de região do DXA seriam forma pintada sobre arte de acervo, o que é proibido | **R11: fica com a figura atual** |
| `artefatos-de-objeto` | não | nenhuma imagem real com colar, trança, botão ou eletrodo em licença aberta | fica (R2) |
| `artefatos-do-detector` | não | nada de linha morta, corte de grade ou imagem residual | fica (R2) |
| `monitor-e-padrao-de-teste` | não | só padrões SMPTE em CC BY-SA | fica (R2) |
| `ponderacoes-no-encefalo` | não | os CC BY de 1.600 px ou mais são de pacientes com doença ou de cortes diferentes | fica (R2). Em 2026-11-22, trocada por ressonância do acervo do dono (`imagens-vps.md`) |
| `supressao-de-gordura` | não | as com supressão de gordura são BY-SA ou têm menos de 800 px | fica (R2). Em 2026-11-22, trocada por ressonância do acervo do dono (`imagens-vps.md`) |
| `artefatos-de-rm` | não | a série CC BY tem de 733 a 963 px; as de 2.000 px são BY-SA | fica (R2) |
| `dxa-regioes-de-interesse` | não | as DXA abertas têm menos de 1.600 px ou são BY-SA; as caixas de região não vêm na imagem e não podem ser pintadas por cima | fica (R2) |
| `dxa-interferencias` | não | nenhuma DXA de coluna com artefato metálico em licença aberta | fica (R2) |
| `corte-pelve` | não | o atlas de Sobotta no Commons tem só cortes sagitais da pelve | fica (R2, R3). Em 2026-11-22, trocada por tomografia do acervo do dono (`imagens-vps.md`) |
| `corte-pescoco` | não | sem corte axial do pescoço na altura da tireoide em licença aberta | fica (R2, R3). Em 2026-11-22, trocada por tomografia do acervo do dono (`imagens-vps.md`) |

## Por que a radiografia-roteiro não entrou (R23)

Foi a única candidata viável, e o plano foi medido em 2026-11-21 (`plano-imageid.md`, na pasta de trabalho): trocar para `imageId` é possível no código sem mudar tipo nem verificador, em 9 caminhos. O que reprovou foi o conteúdo. A M23.01 inteira é construída sobre um esquema ("desenho, não imagem de paciente", 18 trechos) e cobra uma etiqueta de identificação e uma borda de colimação que a radiografia real anonimizada não tem. Trocar a figura obrigaria a reescrever a aula e tirar dois alvos, para ganhar uma imagem que ensina menos do que o esquema ensina. O controlador decidiu que a arte serve à aula. O marcador "L ETB" da imagem também não foi confirmado como livre de identificação.

## Onde está o material

A pasta de trabalho da busca (`fase5-busca/`, com `relatorio.md`, `plano-imageid.md` e os originais baixados) fica em `.superpowers/` e não vai ao git. Este arquivo resume o relatório inteiro; se a decisão for reaberta, a busca se refaz pelas mesmas consultas do Commons, e o tórax CC0 está em `https://commons.wikimedia.org/wiki/File:Chest_Xray_PA_3-8-2010.png`.

## O que o dono pode reabrir

- Aceitar o tórax CC0 na `radiografia-roteiro` e reescrever a M23.01 (R23).
- Rebaixar o mínimo de resolução para a série CC BY de ressonância (cobre movimento, dobra e metal, não vazio de sinal nem fantasmas rotulados).
- Autorizar uma busca em Europe PMC e Openverse.
