# Fase 3: 14 gráficos redesenhados em código (integração de 2026-11-21)

Aprovada pelo dono em 2026-11-21 ("Sim, produza") depois da amostra de 2026-11-20. Gramática: [`docs/content/2026-11-19-gramatica-de-graficos.md`](../../content/2026-11-19-gramatica-de-graficos.md). Cada gráfico substitui o spec de mesmo `id` em `radiant-app/src/ui/diagrams/specs/`, sem arte de terceiro: desenho próprio em código, só cores da paleta do app. Por isso nenhum autor, licença ou página, e nenhuma entrada em `figuras.json` (J1). Prévias com os marcadores do app a 280 pt, sobre #171920, em [`fase-3/`](fase-3/) (todas abaixo de 75 KiB; a de `ciclo-de-testes` empilha o item de rotular e o de tocar).

## Figuras que entraram

| Figura | Unidade (onde aparece) | Camadas | SVG | Movimento |
|---|---|---|---|---|
| `espectro-de-raios-x` | m19 aula 5 (rotular) | 5 | 3,75 KiB | parada |
| `circuito-do-gerador` | m19 aula 1 (rotular) | 6 | 3,10 KiB | parada |
| `retificacao-de-onda` | m19 aula 2 (conceito) | 5 | 8,89 KiB | laço, pôster 0,8 |
| `dano-ao-dna` | m21 aula 1 (rotular) | 5 | 2,74 KiB | parada |
| `grandezas-de-dose` | m21 aula 2 (conceito) | 6 | 4,72 KiB | laço, pôster 0,75 |
| `histograma-e-lut` | m22 aula 1 (conceito e rotular) | 4 | 2,84 KiB | parada |
| `realce-e-suavizacao` | m22 aula 2 (conceito) | 5 | 2,45 KiB | laço, pôster 0,8 |
| `compressao-de-imagem` | m22 aula 5 (conceito) | 5 | 17,18 KiB | parada |
| `fluoroscopia-pulsada` | m26 aula 3 (conceito) | 5 | 2,55 KiB | laço, pôster 0,8 |
| `relaxacao-t1-t2` | m29 aula 1 (conceito e rotular) | 7 | 4,99 KiB | laço, pôster 0,8 (parada no rotular) |
| `linha-do-tempo-tr-te` | m29 aula 2 (conceito) | 5 | 2,72 KiB | laço, pôster 0,8 |
| `ciclo-de-testes` | m32 aulas 1 (conceito e rotular) e 6 (tocar) | 5 | 1,21 KiB | parada |
| `coincidencia-de-campo` | m32 aula 3 (tocar) | 5 | 0,71 KiB | parada |
| `nivel-de-referencia` | m32 aula 5 (rotular) | 5 | 1,20 KiB | parada |

Peso: 59,05 KiB de SVG nas 14 (remedido em 2026-11-21, depois das correções da revisão) (o teto de 240 KiB vale por figura; a mais pesada tem 17,18 KiB). O teto total do teste do registro (8.116.109 bytes) é das figuras importadas e não muda: o teste passa. Medido em 2026-11-21 com o Node 20.20.2.

Estado de 2026-11-21 (depois dos commits `44275c68`, `641db855`, `54a57d4e`, `64419b25` e `7fee1bf8`): os dez roteiros Maestro que a primeira integração deixou de fora (seis `-laco` e quatro de `rtg-2026/`) estão no git desde `54a57d4e` e `64419b25`, e os gates que dependiam deles passam.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/.../itens-alterados-f3.md`, fora do git)

- m21 aula 1, `label` do DNA: cinco pontos novos; `where` do Radical passa de "ponto ciano" a "à direita, o halo no trilho tracejado" (o marcador do app cobre o ponto branco inteiro, então o `where` nomeia só o que fica visível). Depois da revisão, o rastro do radical chega à fita longe da quebra dupla e o ponto do Radical vai a (226; 127).
- m22 aula 1, `label` do histograma: cinco pontos novos; `where` da curva passa de "traço amarelo em S" a "traço em S, junto ao patamar alto".
- m22 aula 2: frase de eixos no corpo ("Eixo horizontal: posição na borda; vertical: valor do pixel.").
- m26 aula 3: o corpo troca "enquanto dura a aquisição" por "Tempo na horizontal; feixe ligado na vertical."
- m29 aula 2: o corpo ganha "Tempo na horizontal; intensidade na vertical." (a revisão notou que as barras de pulso não são sinal).
- m32 aula 1, `label` da linha do tempo: quatro pontos com ajuste de até 0,02.
- m32 aula 6, `hotspot` da linha do tempo: quatro regiões em caixa justa; "Círculo azul pequeno" passa a "Círculos azuis pequenos" e cobre a faixa dos três pontos.
- m32 aula 3, `hotspot` do campo: cinco regiões novas; a do centro foi encolhida 5 unidades de cada lado (ver abaixo).
- m32 aula 3, conversa: a fala e os retornos passam de "para baixo" a "para o lado", porque o deslocamento do desenho é só lateral.
- m32 aula 5, `label` do nível de referência: quatro pontos novos; o corpo ganha "cada barra é uma sala, e a altura é o valor típico".
- Correções da revisão de 2026-11-21 (`revisoes/fase-3.md`), sem mudar pergunta nem resposta certa:
  - m29 aula 1, `label` de relaxação: os pontos de T1 curto, T1 longo, T2 curto e T2 longo (o do patamar não mudou) continuam sobre a curva que nomeiam, mas foram movidos para onde os selos não cobrem a curva de T2 nem a marca de T (distância mínima entre pontos 55 unidades); o corpo ganha "Tempo na horizontal." (79 palavras, teto 80);
  - m19 aula 5, `label` do espectro: o ponto da radiação de freamento sai de cima da tracejada e fica sobre a curva real; o `where` da energia máxima passa a "onde a curva larga toca o eixo horizontal" e o da faixa filtrada, a "à esquerda, a faixa sombreada acima da curva"; o corpo ganha "No gráfico, a energia fica na horizontal e a quantidade de fótons, na vertical." (101 palavras, teto 110);
  - m19 aula 1, `label` do circuito: o ponto do transformador de alta tensão passa ao núcleo, embaixo (0,30; 0,45); o `where` continua descrevendo o bloco;
  - m22 aula 1: o corpo troca a primeira frase por "O histograma conta pixels por valor: a altura é quantos pixels; na horizontal, o valor." (80 palavras), que diz o que cada eixo mede, sem usar "brilho" para o eixo vertical da curva em S.
- Sem mudança de aula: `grandezas-de-dose`, `compressao-de-imagem`, `retificacao-de-onda`.

## Medidas de área de toque (itens de tocar, 44 pt a 280 pt)

Renderizado o spec no quadro de pôster e contados os pixels da área de toque da resposta certa, por categoria (fundo = as duas cores mais comuns do quadro):

- `ciclo-de-testes`, aula 6, certa "Círculo ciano médio": 23% estrutura própria, 75% fundo, 0% de qualquer outra resposta, 2% fora de região (traço do eixo). Nenhum marco errado entra na área.
- `coincidencia-de-campo`, aula 3, certa "Faixa amarelada à esquerda": 100% dentro da própria faixa (a região tem 45,5 pt de largura, acima dos 44 pt, e a área de toque é a própria região), 0% de outra resposta.

Selos (posição do app): nas rotulagens, nunca cobrem o ponto rotulado. A revisão de 2026-11-21 mediu mais do que o autor: em `relaxacao-t1-t2` dois selos escondiam 39% da curva azul de T2 (1389 de 3561 px). Depois da correção (pontos 1, 2, 4 e 5 movidos, ver "Itens alterados"), nenhuma amostra da curva de T2 nem da marca de T fica sob selo (busca com as funções do app, `labelBadgeBoxes`; o selo ainda cobre trechos da curva de T1, que é a estrutura do próprio ponto). Em `circuito-do-gerador` o ponto da alta tensão passou para o núcleo, embaixo, e o selo 2 deixou de cobrir a bobina secundária; `ciclo-de-testes`, `nivel-de-referencia` e `coincidencia-de-campo` ainda têm selo sobre arte vizinha (parecer, M12), sem cobrir o ponto rotulado.

## Guardas

`diagramRegistry.test.ts`:
- **Movimento (J4):** os 8 gráficos parados não têm `periodMs`, `posterAt` nem camada móvel; os 6 em laço têm `periodMs`, `posterAt` entre 0 e 1 e de 1 a 4 camadas móveis. Vista falhando com o defeito que ela nomeia: com o `posterAt` de `relaxacao-t1-t2` apagado, o teste reprovou ("Received has value: undefined") e voltou a passar com o spec restaurado.
- **Laço sem corte (revisão de 2026-11-21, M1 e M11):** em t = 0 a cortina de cada laço cobre as pontas redondas das curvas (esquerda e direita, com o meio traço de 1,75), e o cursor da cortina nasce exatamente sobre um eixo vertical. Vistas falhando com os defeitos que elas nomeiam, restaurando os cinco specs de `7fee1bf8` (execução em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/vermelho-lacos.txt`): reprovam a cortina curta de `relaxacao-t1-t2`, `realce-e-suavizacao` e `retificacao-de-onda`, e o cursor fora do eixo de `fluoroscopia-pulsada` e `linha-do-tempo-tr-te`; com os specs corrigidos, as 491 asserções do arquivo passam. Limite: a guarda confere a cortina só nos laços cujo sinal é desenhado em `polyline`/`polygon` (a fluoroscopia desenha o sinal em `path`, e nela só o cursor é conferido).
- **Laço fechado, medido por render (não é guarda):** pixels de azul, âmbar e branco-claro em t = 0, 0,06 e 0,999 dos seis laços. Depois da correção são iguais nos três quadros (antes, t = 0 tinha de 16 a 98 px de azul ou âmbar, e o cursor de dois deles, que t = 0,999 não tinha; contagem em 2x). Quadros do fim e do começo do ciclo lado a lado em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/f3-lacos/`.

## Números dos testes (2026-11-21, Node 20.20.2)

- Gate de `7fee1bf8`, informado pelo controlador: 297 suítes e 4.599 testes.
- Depois das correções: verificador (`rtg-lesson-lint.mjs`) 40 de 40 OK; `build-rtg-batches.mjs --check`, `generate-rtg-maestro.mjs --check` (m19, m21, m22, m26, m29, m32) e `figuras-no-simulador.mjs --check`: ok.
- Jest (`src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints`, `--runInBand`): 66 suítes, 1635 testes, todos verdes. Com `src/features/settings` a revisão mediu 68 suítes e 1650 testes em `7fee1bf8`.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam; falha só `registerSource normalizes metadata for the pilot book` (alheia e conhecida).
- `tsc --noEmit` e `eslint` nos arquivos TypeScript tocados: saída 0. `npm run test:maestro-contract`: 13 de 13. `test:copy-style-contract`: 65 de 65. `docs-contract`: passou.

## O que ficou pendente (2026-11-21)

- Frase de eixos de `retificacao-de-onda` (m19 aula 2, corpo com 78 palavras, teto 80 com `visual`): só coube "Horizontal: tempo." sem o vertical, e para a frase inteira seria preciso cortar ensino. Os eixos ficam só no `alt` e na gramática; decisão do controlador (subir o teto, cortar texto ou aceitar).
- Menores do parecer não aplicados: M8 (margens da gramática em `relaxacao-t1-t2`, `fluoroscopia-pulsada` e `linha-do-tempo-tr-te`: mover as origens muda todas as coordenadas dos alvos da relaxação, e o parecer a chama de estética) e M10 (`scripts/content/figuras/alvos-preview.mjs` não serve a figura de código; o arquivo está fora da lista do run). M4 (selos 3 e 4 e a rede, no circuito) e M12 são observações sem correção sugerida.

## Capturas no iPhone

Medido em 2026-11-21, simulador "Radiant F7" (iPhone, dev client, Metro no Node 20 com `EXPO_NO_TYPESCRIPT_SETUP=1`), ponta `70327d47`, roteiros de `radiant-app/.maestro/figuras/` um por vez (`clearState`, animação reduzida desligada nos laços), carga da máquina entre 3 e 15 durante a série. O app não abortou (nenhum relatório novo em `DiagnosticReports`). Rodaram sem alteração, saída 0: `m19-aula-01`, `m19-aula-02-laco`, `m19-aula-05`, `m21-aula-01`, `m21-aula-02-laco`, `m22-aula-01`, `m22-aula-02-laco`, `m22-aula-05`, `m26-aula-03-laco`, `m29-aula-01`, `m29-aula-01-laco`, `m29-aula-02-laco`, `m32-aula-01`, `m32-aula-05`, `m32-aula-06` e `m32-aula-03` (na segunda tentativa). Nenhum roteiro foi copiado ou alterado. Nos laços, cada arquivo é o quadro de pôster (a 2 s da gravação, com a figura ainda em desenho); o vídeo não foi versionado. Em todas as capturas a figura já está desenhada, sem tela em branco; não medi tempo de carga.

Cada figura abaixo: gráfico inteiro e legível, eixos com seta onde há eixo, e, no rotular, ponto pequeno sobre o alvo e selo fora dele.

- `ios-circuito-do-gerador-m19-aula01-passo5.jpg` (rotular, 5 pontos): cinco blocos do gerador (fonte em círculo, transformador, ponte de diodos, tubo com feixe e um transformador menor) ligados por fios; inteiro e legível. Os selos 1 a 5 ficam ao lado dos blocos e cada ponto ciano cai no símbolo do bloco. Preocupa: o selo 1 toca a borda do ícone da fonte e os selos 3 e 4 ficam sobre a borda superior dos quadros dos blocos (não sobre o símbolo); o ponto 1 fica pequeno, junto à espiral da fonte.
- `ios-retificacao-de-onda-m19-aula02-passo2.jpg` (conceito, laço): três traçados empilhados (alternada, retificada, alisada) com eixos com seta e linha tracejada de pico; o quadro mostra o desenho em curso, cortado à direita pela cortina. Preocupa: o texto empurra o terceiro traçado para baixo da barra Continuar, e só os dois primeiros aparecem inteiros sem rolar. A frase dos eixos continua só no `alt` (pendência da seção anterior).
- `ios-espectro-de-raios-x-m19-aula05-passo4.jpg` (rotular, 4 pontos): curva do espectro com a faixa cinza do filtro, a curva tracejada sem filtro, duas barras amarelas (características) e eixos com seta; legível. Selo 1 dentro da área sob a curva, 2 ao lado das barras, 3 na ponta do eixo horizontal, 4 no alto à esquerda, todos fora do traço; pontos pequenos sobre a curva, a barra e a ponta do eixo. Preocupa: o selo 3 toca a seta do eixo, e o ponto 4 cai na faixa cinza à esquerda do pico, sem desenho próprio que o marque.
- `ios-dano-ao-dna-m21-aula01-passo4.jpg` (rotular, 5 pontos): fita dupla de DNA, fóton ionizante amarelo direto na fita (1), fóton que ioniza a molécula e cria radical (2, 3), quebra simples (4) e quebra dupla (5); inteiro e legível. Selos fora dos elementos e sem cobrir uns aos outros; pontos pequenos sobre o alvo. Preocupa: o ponto 5 (quebra dupla) fica pequeno entre duas barras, e o selo 5 toca a ponta da fita.
- `ios-grandezas-de-dose-m21-aula02-passo2.jpg` (conceito, laço): três painéis (dose absorvida, equivalente e efetiva) com pontos amarelos, o sol e o corpo com órgãos em azul; legível. Preocupa: o painel inferior fica cortado pela barra Continuar, então a base dos três painéis só aparece rolando; o quadro de 2 s já mostra todos os elementos desenhados.
- `ios-histograma-e-lut-m22-aula01-passo2.jpg` (conceito): histograma à esquerda e curva em S à direita, cada um com eixos com seta, faixa de interesse sombreada e colchete; inteiro e legível. Os dois eixos horizontais ficam rente à barra Continuar.
- `ios-histograma-e-lut-m22-aula01-passo4.jpg` (rotular, 5 pontos): mesma figura; selo 1 (pico da colimação) ao lado da barra, 2 (grupo da anatomia), 3 (pico da radiação direta), 4 (colchete da faixa) e 5 (ponta da curva); pontos pequenos sobre cada alvo. Preocupa: o selo 2 cobre parte das barras azuis do grupo da anatomia, e o selo 4 toca a faixa sombreada.
- `ios-realce-e-suavizacao-m22-aula02-passo2.jpg` (conceito, laço): três perfis da mesma borda (original, com realce, suavizada), cada um com eixos com seta, a referência tracejada e o excesso em âmbar; legível, inteiro. O quadro é o desenho pronto aos 2 s.
- `ios-compressao-de-imagem-m22-aula05-passo2.jpg` (conceito): três barras de tamanho e três miniaturas (original, sem perda, com perda forte virada em blocos); legível. Preocupa: o texto empurra a figura, e o rodapé da moldura (as miniaturas aparecem inteiras, o fundo do painel não) fica sob a barra Continuar; sem eixos, que o desenho não tem.
- `ios-fluoroscopia-pulsada-m26-aula03-passo2.jpg` (conceito, laço): dois gráficos de tempo, o feixe contínuo (um retângulo) e o pulsado (seis pulsos), cada um com eixo com seta, e o monitor com a imagem retida à direita; legível. Preocupa: o gráfico dos pulsos encosta na barra Continuar; o eixo inferior fica no limite.
- `ios-relaxacao-t1-t2-m29-aula01-passo4.jpg` (rotular, 5 pontos): T1 (sobe) e T2 (cai), curva amarela e azul, linha do patamar tracejada, marcas de tempo; eixos com seta. Selos 1 e 2 sobre as curvas de T1, 3 ao lado do patamar, 4 e 5 sobre as de T2; pontos pequenos sobre a curva. Preocupa: os selos 1 e 2 ficam sobre as curvas (cobrem trechos de traço, mas não o ponto de tempo marcado).
- `ios-relaxacao-t1-t2-laco-m29-aula01-passo2.jpg` (conceito, laço): as mesmas curvas, ainda sendo traçadas (terminam antes do fim, sem ponta redonda cortada) e os marcadores de tempo já visíveis; eixos com seta.
- `ios-linha-do-tempo-tr-te-m29-aula02-passo2.jpg` (conceito, laço): pulso amarelo, sinal que decai, eco central e as chaves de TE (curta) e de TR (longa), eixo com seta. Preocupa: a chave do TR fica no alto e a do TE embaixo; o gráfico fica cortado na base pela barra Continuar, e o segundo pulso (fim do TR) fica à direita, na borda.
- `ios-ciclo-de-testes-m32-aula01-passo2.jpg` (conceito): linha do tempo com o marco grande (aceitação), três marcos pequenos (constância), a chave de manutenção e o marco médio, seta de continuação; legível, a base da moldura fica sob a barra.
- `ios-ciclo-de-testes-m32-aula01-passo4.jpg` (rotular, 4 pontos): mesma linha do tempo; selos 1, 2, 3 e 4 fora dos marcos e legíveis, pontos pequenos sobre o marco. Preocupa: o selo 3 cobre a cabeça da chave (o ponto 3 cai no punho), e o selo 1 encosta no círculo amarelo.
- `ios-ciclo-de-testes-m32-aula06-passo4.jpg` (tocar, 4 regiões): a mesma linha do tempo com as regiões em ciano sobre o marco amarelo, os três marcos azuis, a chave e o marco médio; selos 1 a 4 fora das regiões, sem cobrir uns aos outros. A região da chave inclui o fundo claro ao redor dela.
- `ios-coincidencia-de-campo-m32-aula03-passo4.jpg` (tocar, 5 regiões): o campo de luz (retângulo branco), o campo de radiação deslocado (azul) e a faixa amarelada à esquerda onde só a luz chega; as cinco regiões em ciano, com selos fora delas. Preocupa: as regiões 2 e 5 são retângulos escuros sobre o fundo vazio (fora do campo, sem desenho para o aluno reconhecer), e o selo 5 sai da moldura clara do campo.
- `ios-nivel-de-referencia-m32-aula05-passo4.jpg` (rotular, 4 pontos): barras (as três últimas em amarelo, acima da linha), linha tracejada de referência e eixos com seta; inteiro e legível. Pontos pequenos sobre a linha (1), a barra mais alta (2), uma barra no meio (3) e a primeira barra (4). Preocupa: os selos 3 e 4 ficam sobre barras vizinhas e escondem parte do topo delas.

### Roteiros que reprovaram

- `m32-aula-03` (versionado): na primeira execução o `assertVisible: 'Passo 2 de 8'` falhou, porque a captura da falha mostra a tela do passo 1 com as duas primeiras falas só (os três toques em "Continuar" não avançaram). Repetido sem alteração, passou até a figura. Intermitente, sem causa medida; roteiro intocado. Nenhum roteiro precisou de cópia em `$TMPDIR`.

Fora do que isto prova: pontos pequenos e selos foram vistos em tamanho de captura (largura de 644 px nesta leitura), não no aparelho; o movimento dos laços não foi visto, só um quadro de cada. Metro parado, app encerrado, simulador desligado, porta 8081 livre, `radiant-app/expo-env.d.ts` inexistente.
