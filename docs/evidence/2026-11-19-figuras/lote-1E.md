# Lote 1E de figuras importadas (2026-11-20)

Oito figuras entram: sete com aula e uma só como `visual` do conceito. Prévias dos alvos com os marcadores do app (marcador de 28 pt do rótulo, selo de 36 x 24 pt da região; âmbar = região declarada pela figura, ciano = alvos da aula) em `lote-1E/<id>.png`. Itens alterados, com antes e depois: `.superpowers/sdd/2026-11-19-figuras-fase-1/1E/itens-alterados.md` (resumo abaixo). Decisões do dono de 2026-11-20 aplicadas: composição de peças do mesmo autor com critério medido (fêmur; contraste em dois painéis), figuras de movimento paradas (respiração com os dois estados lado a lado; circulação), recorte ampliado da mesma arte do urinário na m26. Estão no adendo de 2026-11-20 de `docs/adr/ADR-2026-11-19-figuras-por-tipo.md`.

## Figuras que entraram

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `femur-proximal-e-quadril` | m24-03 (`i2`) | Servier Medical Art, kit SMART-Bones (pelve + fêmur, composição) | CC BY 4.0 | https://smart.servier.com/smart_image/male-pelvis/ e https://smart.servier.com/smart_image/femur/ |
| `respiracao-diafragma` | m20-01 (`visual`, `i4`) | Servier Medical Art (arquivos do Bioicons) | CC BY 4.0 | https://smart.servier.com/ |
| `circulacao-dupla` | m20-02 (`visual`, `i4`) | erico (design), JSHG e DBCLS (edição), Togopic | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:202410_Systemic_and_pulmonary_circulation.svg |
| `seios-da-face-frente` (id novo) | m25-04 (`i2`, `i5`) | Servier Medical Art, kit SMART-ENT, "Paranasal sinuses" | CC BY 4.0 | https://smart.servier.com/smart_image/paranasal-sinuses/ |
| `seios-da-face` | m25-04 (`visual` do conceito) | Servier Medical Art, kit SMART-ENT, "Nasal cavity" | CC BY 4.0 | https://smart.servier.com/smart_image/nasal-cavity/ |
| `sistema-urinario` | m20-04 (`i2`) | Servier Medical Art, kit SMART-Urinary-system, "Urinary tract" | CC BY 4.0 | https://smart.servier.com/smart_image/urinary-tract/ |
| `bexiga-e-uretra` (id novo) | m26-06 (`i3`) | idem, recorte ampliado (escala 0,25) | CC BY 4.0 | idem |
| `contraste-no-corpo` | m26-01 (`visual` do conceito) | Servier Medical Art, kits SMART-Digestive-system e SMART-Urinary-system, duas peças lado a lado | CC BY 4.0 | https://smart.servier.com/smart_image/urinary-tract/ |

Registro e crédito em `content-manifest/rtg-2026/figuras.json`, com a data de consulta 2026-11-20. **Licença do Servier:** a página do próprio Servier diz CC BY 4.0 e vale; as cópias do mesmo kit no Wikimedia Commons marcadas CC BY-SA 3.0 não foram usadas, e a divergência está no campo `modification` de cada entrada do Servier. Na respiração, os arquivos vieram do Bioicons (que os cataloga como CC BY 3.0); a licença registrada é a do Servier, e o campo `license` traz só "CC BY 4.0" para passar na régua do registro.

`ids novos` no app: `seios-da-face-frente` e `bexiga-e-uretra` em `diagramRegistry.ts`, `figuras.json`, `build-spec.mjs`, nos alvos (`figuras/<id>.alvos.json`), no índice do roteiro do simulador (`.maestro/figuras/indice.json`) e no crédito gerado (`rtgImages.ts`).

## Itens alterados (uma linha cada)

1. m24-03 `i2`: seis fichas viram cinco, sem o Acetábulo (a arte não o desenha); `help` sem "encaixa".
2. m20-01 `i4`: sai a região Traqueia (sem referência na arte); prompt manda comparar os dois desenhos (sem "no desenho da inspiração"); o Diafragma passa ao desenho da expiração e as Costelas D às pontas inferiores das costelas; a cena e o conceito deixam de dizer que a figura se move.
3. m20-02 `i4`: quatro regiões viram três (as duas metades do coração viram "Coração"); prompt, retornos e ajuda reescritos; regiões de volta à caixa da estrutura.
4. m20-04 `i2`: quatro pontos viram três, sem a Uretra; `where` do rim sem "mais baixo"; o conceito mantém o fato do rim direito mais baixo sem dizer que o esquema o mostra.
5. m25-04 `i2` e `i5`: passam a `seios-da-face-frente` com três fichas e três regiões (saem Órbita e Esfenoidal); o esfenoidal vai ao `visual` do conceito (corte sagital) e segue na afirmação `i4`.
6. m26-06 `i3`: passa a `bexiga-e-uretra`; os dois rins saem, entram os dois ureteres como distratores; pergunta e Uretra correta intactas.

Sem figura fora do lote.

## Contagem de caminhos, fonte contra original

- `femur-proximal-e-quadril`: 129 (pelve, "Group 308") + 45 (fêmur, "Group 50") = 174 no pptx do kit; a fonte tem 174. Nenhum descartado. A receita `receitas/femur-proximal-e-quadril.mjs` sem variável de ambiente reproduz a fonte (conferido com `cmp`).
- `respiracao-diafragma`: os dois SVG do autor têm 276 (expiração) e 269 (inspiração) caminhos; a fonte tem 541 (545 menos a seta, `#6ac5dc`, de cada desenho e o retângulo do `clipPath`, que vive em `<defs>`). A receita (`receitas/respiracao-diafragma.compor.mjs`) **não une caminhos** (a primeira versão unia vizinhos de mesmo preenchimento, 545 viravam 228, e os `evenodd` unidos cancelavam subcaminhos que se sobrepõem: 20.936 px do render a 6x diferiam, traço do autor sumia da tela). Subcaminhos (comandos `M`/`m`): 746 + 761 = 1507 nos originais, menos 1 + 1 da seta e 1 + 1 do retângulo = 1503; fonte = 1503. Render a 6x da fonte contra o dos dois desenhos do autor postos lado a lado na mesma transformação, sem união e sem arredondar coordenadas: 1461 px de 2.764.800 diferem em mais de 40 de 255, em 607 grupos de no máximo 25 px, 1 px acima de 100: é serrilhado de borda da grade de 0,1 (0,05 un do autor = 0,023 pt), nenhum contorno difere. Saem só a seta, o texto e o retângulo de recorte; os 31 traços "m", as texturas e os brilhos ficam.
- `circulacao-dupla`: 30 caminhos, 17 polígonos e 4 retângulos no original; a fonte, 30 caminhos, 15 polígonos e 1 retângulo. Diferença: **os cinco `clipPath` do original foram resolvidos por interseção de caminhos** (recorte ∩ forma, `receitas/circulacao-dupla.resolver_clips.py`, skia-pathops): cinco formas recortadas viraram cinco caminhos, e os cinco `<path>` dentro dos `clipPath` saem com eles; 46 formas desenhadas dos dois lados. **Para o revisor conferir a forma:** abrir a prévia `lote-1E/circulacao-dupla.png` e ver se as duas metades do circuito sistêmico, as redes capilares do corpo e dos dois pulmões têm o contorno do original (a interseção não deve ter comido nem acrescentado borda); os dois degradês girados levaram a rotação para o `gradientTransform`.
- `seios-da-face` 347 de 347 e `seios-da-face-frente` 114 de 114 (slides 4 e 7 do kit SMART-ENT); o que passa do quadro 320 x 240 sai pelo enquadramento, sem apagar caminho.
- `sistema-urinario`: 492 caminhos na fonte; o grupo "Group 3" do pptx tem 494 formas, e as duas que faltam são elipses de 10 x 5 e 7 x 5 unidades (menos de meio ponto no quadro) que o extrator, que lê só formas livres, não converte. `bexiga-e-uretra`: 303 dos 492; as 189 formas inteiramente fora do quadro do recorte não foram copiadas (precedente aprovado: `trato-digestivo`, 215 fora do quadro). O construtor de recolorido por posição (`build2.mjs`, de scratch) não foi preservado: o extrator está em `receitas/sistema-urinario.mine2svg.py` e a regra de cor (matiz fixo por estrutura, luminosidade original comprimida) em `receitas/contraste-no-corpo.prep.mjs`.
- `contraste-no-corpo`: 1242 caminhos = 750 do trato digestivo (a mesma arte de `trato-digestivo`, sem a cabeça) + 492 do urinário. Nada descartado além do que já saía no `trato-digestivo`.

Os specs são saída do `build-spec.mjs` (uma entrada por figura, `options: {}` nas do urinário e demais, que não têm retângulo de fundo). A regeneração reproduz o spec entregue pelos agentes byte a byte, com duas exceções de arredondamento do enquadramento do viewBox: `femur-proximal-e-quadril` com escala 0,18824 em vez de 0,188 e `circulacao-dupla` com `translate(20.87 ...)` em vez de `20.870`; nada visível muda.

## Composição e critério medido

- Fêmur sobre a pelve (mesmo kit, mesmo autor, só translação, espelhamento e escala 1,05 do próprio fêmur): cabeça a 36,7 unidades da fonte (0,09 do diâmetro) do lado de fora do forame obturado; linha de Shenton contínua, com desvio de 6,4 un no colo e 12,5 no teto do forame. Medidas e imagem de conferência: `lote-1E/femur-proximal-e-quadril.medidas.md` e `.shenton.png`. O que a medida não prova (o acetábulo não é desenhado; vista anterior ou posterior; sem revisão por radiologista) está no arquivo de medidas.
- Contraste: dois painéis (digestivo à esquerda, urinário à direita), cada um inteiro e como o autor desenhou, sem sobreposição, mesma linha de base (y 232), cada um com 222 de altura (escalas diferentes, 0,074 e 0,089: o urinário parece maior que o digestivo largo; nenhuma posição ou proporção relativa foi inventada).

## Alvos: o que medi (pixels do quadro renderizado)

Regra: região declarada sobre a arte; centro do alvo da aula dentro dela; área de toque (44 pt) não cobre a estrutura do erro típico. Percentuais abaixo = parcela dos pixels de arte dentro da área de toque.

- m20-01 `i4` (corrigido em 2026-11-20 pelo parecer da revisão): a primeira versão tinha a região certa do Diafragma e a das Costelas D sobre a base do pulmão (22,0% e 29,5% de pulmão sob a área de toque de 44 pt, medidos de novo; o revisor mediu 23,0% e 42,1% na região), e a figura não decidia a resposta. Agora o Diafragma é a cúpula do desenho da **expiração** (região x 0,10, y 0,53, l 0,24, a 0,21; alvo "Diafragma na expiração", declarado em `respiracao-diafragma.alvos.json` com a linha inteira do painel, x 0,02 a 0,50) e as Costelas D são as pontas inferiores das costelas do desenho da inspiração (x 0,495, y 0,64, l 0,085, a 0,20; a área de toque de 44 pt cobre x 0,459 a 0,616 e y 0,635 a 0,845). Medido na área de toque, sobre o render do spec a 6x (classes por cor; pulmão = azul): **Diafragma** 1,2% de pulmão, 3,5% de âmbar (a linha), 35,6% de osso e cinza de contorno, 59,8% de fundo; **Costelas D** 8,4% de pulmão, 3,2% de âmbar, 40,3% de osso, 48,2% de fundo (contra 22,0% e 29,5% de pulmão antes). `targetErrors` e o verificador passam: sem sobreposição de áreas de toque e centros dentro das regiões declaradas. O selo de 36 x 24 pt cobre a metade esquerda do ápice da cúpula; a linha segue à vista dos dois lados. O prompt deixou de dizer "no desenho da inspiração".
- m20-02 `i4`: regiões = caixas declaradas. O selo cobre 29% da caixa do coração, 34% da dos pulmões e 45% da do corpo (a figura é pequena no quadro, 4:3 de um retrato). Coração: a área de toque tem 0% de pulmão (ciano) e nenhuma rede capilar do corpo; o coração segue reconhecível pelos ventrículos e pelo contorno.
- m20-04 `i2`: rim 89% âmbar sob a área de toque (o marcador cobre o rim quase todo; o contorno fica à vista); ureter 80% ciano; bexiga 90% azul. Os ureteres declarados passaram a ser a caixa da linha inteira (x 0,398 a 0,482 e 0,5115 a 0,5915).
- m24-03 `i2`: colo 86% âmbar, trocânter maior 93%, trocânter menor 94%, diáfise 98%; a cabeça tem 57% ciano e 36% azul (a pelve encosta na bola, por construção da arte), e o marcador cobre 72% ciano. O marcador da cabeça cobre a metade de cima da bola; ela segue legível.
- m25-04 `i2` e `i5`: os selos das regiões foram levados para o rosto vazio (x 0,2 a 0,27), de modo que cobrem pouco das estruturas; o selo do etmoidal ainda cobre a parte de baixo do lóbulo frontal (a bolsa do lado do nariz). As células etmoidais são pequenas.
- m26-06 `i3`: a área de toque da Uretra (retângulo x 0,4215 a 0,5785, y 0,733 a 0,993) tem **11 a 14% de bexiga** (a base arredondada ocupa a largura toda até y ≈ 0,757 e o funil vai até ≈ 0,78; medida do revisor em 2026-11-20, que corrige os 2,1% e 0,37% do agente de arte). Tudo isso fica sob o selo opaco da região (y 0,733 a 0,847): o aluno não vê nem mira a bexiga ali, e a pergunta segue decidível. O selo cobre o início do tubo e ficam à vista 35 de 62 unidades (56%; o revisor mediu ~57%). Os selos dos ureteres cobrem boa parte do trecho que as regiões marcam; as pontas ficam à vista.

## Números (2026-11-20, Node 20.20.2, esta árvore)

- Verificador de aulas nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check` m20, m24, m25 e m26: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0 (20 ids no índice, 24 roteiros).
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 8 para 16 em `scripts/copy-style-baseline.json` (número medido: a licença em maiúsculas das oito entradas novas).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`: 88 suítes, 1654 testes, todos passam. `npx tsc --noEmit`: saída 0.
- `npx eslint` nos 15 arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.

## Peso

- Soma do SVG das 19 figuras importadas: 2.641.375 bytes (2579,5 KiB), contra o teto de 8.116.109 bytes (7925,9 KiB) do teste do registro; o teto da soma não mudou. As do lote: `respiracao-diafragma` 410.322 B (400,7 KiB), `contraste-no-corpo` 233.716 B (228,2), `sistema-urinario` 120.371 B (117,5), `seios-da-face` 95.783 B (93,5), `bexiga-e-uretra` 71.984 B (70,3), `seios-da-face-frente` 58.763 B (57,4), `femur-proximal-e-quadril` 53.897 B (52,6), `circulacao-dupla` 43.509 B (42,5).
- **Exceção nomeada no teste por figura** (`diagramRegistry.test.ts`, teto de 240 KiB): só `respiracao-diafragma` tem teto de 2 x 240 KiB (480 KiB), porque são dois desenhos completos do autor no mesmo quadro e nenhum traço pode sair. Vermelho registrado antes: `vermelho-peso-respiracao.txt` (395.611 contra 245.760, na versão com união de caminhos; sem a união são 410.322, ainda abaixo dos 491.520 da exceção, e nenhuma coordenada precisou de arredondamento extra). Depois: 369 de 369 passam no arquivo. A asserção geral de 240 KiB continua valendo para as outras 18.

## Para o dono olhar no simulador

- m20-01 `i4`: o Diafragma agora está no desenho da expiração e as Costelas D nas pontas inferiores das costelas da inspiração. A linha da cúpula é fácil de achar com o selo 1 sobre a metade esquerda dela? Na inspiração, o pulmão azul passa um pouco abaixo da linha âmbar nos lados (recesso costofrênico estilizado do autor): incomoda?
- m24-03 `i2`: se pelve e fêmur leem como um quadril; a cabeça encosta na borda do osso, sem copo.
- m20-02 `i4`: o selo cobre um terço do coração, dos pulmões e quase metade da rede do corpo. O coração se reconhece? A figura é pequena no quadro.
- `seios-da-face` (corte): o corte reto à direita e o recorte no canto inferior direito são da arte; confira se não incomodam.
- m25-04 `i5`: o selo do etmoidal sobre a célula etmoidal de cima.
- m25-04: o esfenoidal agora só aparece no corte do conceito; basta para a aula?
- m26-01: o urinário parece maior que o digestivo (escalas diferentes por painel).

## Capturas no iPhone

Simulador "Radiant F7" (iOS 26.5), dev client com Metro local, em 2026-11-20 entre 11h15 e 11h26 (hora do simulador). Roteiros de `radiant-app/.maestro/figuras/` com o Maestro, um por vez; nenhum foi editado. Imagens em `capturas/`, em tamanho nativo (1206 px de largura) e JPEG qualidade 45, todas abaixo de 300 KiB.

- `capturas/ios-femur-proximal-e-quadril-m24-aula03-passo4.jpg` (rotular, 5 fichas): fêmur proximal em âmbar à esquerda, quadril em azul à direita; a cabeça (selo 1) encaixa na face do quadril, ao lado do forame obturado, sem ficar sobre ele. Selos 2 (colo), 3 (trocânter maior), 4 (trocânter menor) e 5 (diáfise) sobre a estrutura certa; a diáfise é cortada pela moldura embaixo e a sínfise aparece à direita. Sem tela em branco.
- `capturas/ios-respiracao-diafragma-m20-aula01-passo2.jpg` (conceito): os dois desenhos lado a lado, caixas torácicas inteiras e legíveis, com a linha âmbar do diafragma em arco alto à esquerda e achatada e baixa à direita; o rodapé da moldura corta um pouco as costelas inferiores (pede rolagem). A figura (~400 KiB) apareceu na tela da captura, sem tela em branco visível.
- `capturas/ios-respiracao-diafragma-m20-aula01-passo6.jpg` (tocar numa estrutura, `i4`): selo 1 (Diafragma) no desenho da esquerda, 2 e 3 nos pulmões do desenho da direita, 4 nas pontas das costelas inferiores. O selo 1 fica na base da cúpula: o arco âmbar segue visível dos dois lados e no alto do arco, mas o retângulo escuro do selo cobre o miolo da cúpula (entre o xifoide e o arco). O desenho da direita fica à frente dos selos 2 e 3 sobre costelas e pulmão.
- `capturas/ios-circulacao-dupla-m20-aula02-passo2.jpg` (conceito): pulmões em cima, coração no meio, silhueta do corpo embaixo, setas azuis e amarelas; a figura é estreita (cabe no centro da moldura, sobra margem escura dos lados) e a moldura corta a silhueta embaixo (pede rolagem). O coração se reconhece, com as câmaras azul e amarela.
- `capturas/ios-circulacao-dupla-m20-aula02-passo6.jpg` (tocar no órgão, `i4`): três regiões, 1 pulmões, 2 coração, 3 corpo. Sob o selo e o sombreado a região do coração ainda se reconhece como coração (contorno, câmaras azul e âmbar); o selo 2 cobre o átrio direito (canto superior esquerdo).
- `capturas/ios-sistema-urinario-m20-aula04-passo4.jpg` (rotular, 3 fichas): rins, ureteres e bexiga legíveis, com a uretra curta embaixo da bexiga. Selos 1 (rim, no rim do lado esquerdo da tela), 2 (ureter) e 3 (bexiga) sobre a estrutura certa. O rim do lado esquerdo da tela aparece mais escuro e sem corte, e o outro em corte com a pelve renal.
- `capturas/ios-seios-da-face-m25-aula04-passo2.jpg` (conceito, corte sagital): cavidade nasal com o seio frontal em azul e o esfenoidal em âmbar, legíveis. O corte tem a borda direita reta (a arte termina em linha vertical e horizontal, sem moldura arredondada) e a moldura corta a base da figura (pede rolagem).
- `capturas/ios-seios-da-face-frente-m25-aula04-passo4.jpg` (rotular, 3 fichas): rosto de frente em cinza como contexto (olhos, sobrancelhas, nariz, boca, orelhas) e os seios em azul. Selos 1 (frontal), 2 (etmoidal) e 3 (maxilar) sobre a estrutura certa; só o lado esquerdo da tela leva selo.
- `capturas/ios-bexiga-e-uretra-m26-aula06-passo5.jpg` (tocar na estrutura, `i3`, passo 5 de 8): recorte ampliado de bexiga e uretra com os dois ureteres entrando por cima. A uretra (selo 4) fica à vista embaixo, com o selo no seu topo e o contorno ao redor do canal; o selo 3 sombreia a bexiga inteira, deixando a mucosa legível. Os selos 1 e 2 caem na ponta dos ureteres, cortados pela moldura em cima.
- `capturas/ios-contraste-no-corpo-m26-aula01-passo2.jpg` (conceito): os dois painéis lado a lado, trato digestivo em âmbar à esquerda (esôfago, fígado, estômago, alças, cólon e reto) e sistema urinário em azul à direita (rins, ureteres, bexiga e uretra). Tudo inteiro na moldura, sem corte.

Roteiros: `m24-03`, `m20-01`, `m20-02`, `m20-04`, `m26-06` e `m26-01` passaram. `m25-04` reprovou no toque em "Continuar" depois da captura do passo 4 (elemento não achado em 20 s; a captura do passo 7 não foi feita). As figuras do conceito (passo 2) e da rotulação (passo 4) saíram certas, então a falha é do roteiro ou da aula, não da figura. Não investigada a causa. O `contraste-no-corpo` e o corte dos seios são `visual` do conceito e foram fotografados nesse passo pelo próprio roteiro. Não visto: Android, som, resposta errada, o passo 7 da m25-04.
