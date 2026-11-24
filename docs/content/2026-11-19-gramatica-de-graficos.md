# Gramática dos gráficos e do esquema físico (fase 3, amostra de 2026-11-20)

Vale para os 14 gráficos da fase 3. Código continua sendo o método; o que muda é o desenho. Quadro 320 x 240, só o que o `SvgXml` aceita, só cores de `diagramPalette.ts`. Amostra: `espectro-de-raios-x`, `relaxacao-t1-t2` (animado) e `circuito-do-gerador`.

## 1. Sem texto: como eixo e unidade ficam legíveis

A régua do registro barra `<text>` e o guia de autoria manda "sem texto dentro do desenho". Não há rótulo de eixo, nem número, nem letra desenhada com `path` (seria texto disfarçado). Decisões:

- O eixo é nomeado **fora** do desenho: pelo `alt`, pelo corpo do conceito ("no eixo horizontal, a energia") e pelo `where` dos alvos. Toda aula que usa gráfico tem de dizer o que cada eixo mede; o revisor confere isso.
- O desenho diz a **forma** da relação: seta cheia no fim de cada eixo, origem comum, zero no eixo horizontal.
- **Escala** só onde há uma grandeza nomeada: um risco de 8 no eixo, na cor da curva, marca "este valor" (energia dos picos, T do tecido). Risco sem nome não entra: régua de passos iguais sugere escala numérica que a figura não tem.
- Unidade nunca aparece. Quem precisa dela lê no corpo do conceito.

## 2. Estrutura

| Elemento | Regra |
|---|---|
| Painel | retângulo opaco `P.fill`, inset 8, canto 16. Dá o "quadro" do gráfico; a moldura fora dele é `P.bg`. |
| Margens | origem a 24 ou mais da borda do painel; ponta de seta termina a 8 da borda. |
| Eixos | traço 2,5, `P.muted`, ponta redonda; seta cheia de 12 x 11 (polígono, nunca traço aberto). Eixo vertical sobe até y=32, horizontal vai até a seta. |
| Grade | nenhuma por padrão. No máximo uma linha de referência tracejada (`6 5`, traço 2), e só se nomeia algo (o patamar). |
| Gráficos lado a lado | dois eixos no mesmo painel, 24 de intervalo entre o fim de um e a origem do outro. |
| Densidade | até 3 curvas, até 4 marcas, 1 região sombreada. Entre alvos de toque, 50 de distância (44 pt na régua de toque). |

## 3. Traço e marca

| Elemento | Regra |
|---|---|
| Curva principal | 3,5, junta e ponta redondas, `P.accent`; área abaixo a 20% da mesma cor. |
| Curva secundária ou "o que não existe" | 2,5, tracejada `6 6`, `P.muted`. |
| Região removida ou ausente | `P.muted` a 30%, sem contorno. |
| Linha discreta (espectro de linhas) | haste de 4,5 com ponta redonda, `P.beam`. |
| Ponto de interesse | círculo r 5 a 6, anel de 2,5 **na cor da superfície** em que ele está (`P.fill` no painel). |
| Pontilhado de leitura | `2 5`, traço 2, cor da curva a 75%. |
| Símbolo de esquema | traço 3, `P.line`; fio 2,5, `P.muted`; vidro 3, `P.accent`. |
| Cartão de bloco (esquema) | retângulo `P.fill`, canto 10, um por bloco que a aula rotula. |

## 4. Cor

- Papel, não série: `P.accent` (azul) é o dado principal e o líquido; `P.beam` (âmbar) é o segundo tecido, a radiação característica, o feixe; `P.electron` (ciano) só para elétrons; `P.line` marca ponto único (Emax) e símbolos; `P.muted` é o que apoia ou não existe.
- Cor segue a entidade: o tecido de T curto é âmbar nos dois gráficos de ressonância e em toda figura da trilha.
- Sem degradê (a régua de figura desenhada só aceita cor da paleta em `fill`/`stroke`); profundidade vem de opacidade.
- Validador de paleta da skill `dataviz` (superfície `P.bg`): contraste 3:1, separação adjacente (deuteranopia 23, tritanopia 25) e piso de visão normal (26) passam para azul, âmbar e ciano. A faixa de luminosidade "reprova" porque é a do modelo padrão da skill; a paleta é a do app e não se troca. Identidade nunca fica só na cor: tracejado, posição e marca no eixo repetem.

## 5. Movimento (tarefa 2 da fase 0)

- Só em figura que o `visual` do conceito mostra. Figura com alvo de toque aparece parada em `posterAt`, que tem de mostrar **tudo** que a aula cobra.
- Um relógio por figura (`periodMs`, `loop`), em três fases que se dizem em frações do ciclo: entrar (curva aparece), segurar (o quadro completo, que é o `posterAt`), sair (curva se apaga). Entre 0 e 0,06 só os eixos.
- O que corre no tempo corre **linear** (`ease: 'linear'`): a cortina que revela a curva anda à velocidade do eixo do tempo. `ease: 'inOut'` só nas entradas e saídas (fade final).
- Curva por `keys`: `[[0,0],[0.06,0],[0.6,1],[1,1]]` para a cortina; `[[0,0],[0.9,0],[1,1]]` para o apagar.
- Revelar curva = cortina da cor do painel que desliza (`translate`) sobre a curva e sob eixos e moldura; o que vem de fora do painel se esconde com a moldura `P.bg` por cima. Não há `clipPath` nem traço animado no motor: a cortina é o recurso.
- Fecha o laço sem corte: no fim do ciclo a cortina volta a cobrir exatamente quando as curvas estão a 0 de opacidade.
- Movimento reduzido: a figura mostra o `posterAt` e nada anima (regra do app).
- Custo: cada camada móvel é uma view própria. Até 4 móveis por figura.

## 6. Exemplos

Os três exemplos que fixaram a gramática, já no app (código em `radiant-app/src/ui/diagrams/specs/`, prévias em `docs/evidence/2026-11-19-figuras/fase-3/`):

- **`espectro-de-raios-x`** (gráfico com alvos): painel, eixos com seta cheia, curva principal com área a 20%, curva tracejada do que não existe, região removida a 30%, hastes das linhas características e ponto único em `P.line`. Parado.
- **`relaxacao-t1-t2`** (dois gráficos lado a lado, animado): cor por tecido (âmbar T curto, azul T longo), pontilhado de leitura, patamar tracejado, cortina linear que revela as curvas. Parado em `posterAt` quando a aula pede toque.
- **`circuito-do-gerador`** (esquema físico): cartão `P.fill` por bloco que a aula rotula, símbolos em `P.line`, fio em `P.muted`, vidro do tubo em `P.accent`. Parado.

Os outros onze gráficos da fase 3 seguem a mesma gramática; o guia de autoria (seções 3 e 3b) aponta para este documento.

## 7. Fluxos com ícones (fase 4, aprovada em 2026-11-21)

Os três fluxos de cinco passos (`cadeia-de-custodia`, `fluxo-de-pesquisa`, `fluxo-ris-pacs`) usam a mesma grade e ícones do Lucide v1.77.0 (licença ISC, aceita pelo dono em 2026-11-21 só para ícones de conjunto aberto): cartão `P.fill` de 76 x 68 (canto 10) em x 18, 122 e 226 e y 36 e 136, serpentina com seta cheia `P.accent`, ícone intacto na escala 2 em `P.line`, e só o passo de imagem em `P.beam`. Parados, sem texto; quem rotula é a aula. Região do alvo = caixa justa do cartão. O gerador e o registro dos ícones estão em `scripts/content/figuras/fluxos/` e `scripts/content/figuras/vendor/lucide/`.
