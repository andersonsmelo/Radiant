# Lote 1F de figuras importadas (2026-11-20)

Três figuras entram, em quatro ids: `pelve-de-frente` e `pelve-de-frente-recorte` (id novo), `osso-longo` e `coluna-sagital-e-axial`. Prévias dos alvos com os marcadores do app (marcador de 28 pt do rótulo, selo de 36 x 24 pt da região; âmbar = região declarada pela figura, ciano = alvos da aula) em `lote-1F/<id>.png`. O que há sob cada área de toque, medido por cor: [`lote-1F/medidas.md`](lote-1F/medidas.md). Decisões do controlador aplicadas: pelve inteira com os 129 caminhos do autor e sem divisão do osso do quadril (D1), recorte ampliado da mesma fonte para o `i3` (D2), osso longo em corte da Pbroks13 (D3), coluna só com o corte sagital (D4), regiões = caixa da estrutura (D5).

## Figuras que entraram

| Figura | Aula | Autor | Licença | Página |
| --- | --- | --- | --- | --- |
| `pelve-de-frente` | m24-04 (`i2`) | Servier Medical Art (Les Laboratoires Servier), kit SMART-Bones, slide "Bones of pelvis", grupo "Group 308" | CC BY 4.0 | https://smart.servier.com/smart_image/male-pelvis/ |
| `pelve-de-frente-recorte` (id novo) | m24-04 (`i3`) | idem, mesmo desenho, outro enquadramento (viewBox) | CC BY 4.0 | idem |
| `osso-longo` | m18-02 (`i3`) | Pbroks13, "Bone cross-section", 2008 (Wikimedia Commons) | CC BY 3.0 | https://commons.wikimedia.org/wiki/File:Bone_cross-section.svg |
| `coluna-sagital-e-axial` | m28-04 (`i2`) | Servier Medical Art, kit SMART-Bones, slide 9 "Vertebral Column (2)", grupo "Group 3" | CC BY 4.0 | https://smart.servier.com/smart_image/vertebral-column-9/ |

Registro e crédito em `content-manifest/rtg-2026/figuras.json`, com a data de consulta 2026-11-20. **Licença do Servier:** vale a página de termos do próprio Servier (CC BY 4.0); as cópias do mesmo kit no Wikimedia Commons marcadas CC BY-SA 3.0 não foram usadas, e a divergência está no campo `modification` de cada entrada do Servier. Na coluna, a página `vertebral-column-9` (arquivo `Espace_epidural.png`, etiqueta "Sagittal Graphic", kit SMART-Bones) foi aberta e conferida a olho em 2026-11-20: é o mesmo desenho (corte sagital lombar, corpos com textura, discos azuis, canal com raízes); a primeira versão apontava para a página da coluna inteira (`vertebral-column`). `pelve-de-frente-recorte` é id novo em `diagramRegistry.ts`, `figuras.json`, `build-spec.mjs`, no arquivo de alvos (`figuras/pelve-de-frente-recorte.alvos.json`), no índice do roteiro do simulador (`.maestro/figuras/indice.json`) e no crédito gerado (`rtgImages.ts`).

**Desvio da lição do lote 1A para o dono** (decisão do controlador, D3): "só uma ponta do osso não serve". A figura do osso longo mostra só a extremidade proximal, deitada, com a ponta larga à direita; o fêmur inteiro do Servier ficou minúsculo no quadro (osso em ~34% da altura, marcadores sobre as epífises, região da diáfise inflada). O prompt da aula diz que a figura mostra a ponta de um osso longo.

## Itens alterados (uma linha cada; antes e depois em `.superpowers/sdd/2026-11-20-figuras-1F/itens-alterados.md`)

1. m24-04 `i2` (rótulo): cinco fichas viram três (Ílio, Sacro, Articulação sacroilíaca): sem o Acetábulo (a arte não o desenha, e ele segue cobrado por texto no `i1`) e, na rodada 1 de correções, sem a Sínfise púbica (o marcador de 28 pt cobre 97,2% da peça em qualquer posição; ela segue como região visível no `i3` e no texto); `where` sem "azul" e sem "peças amarelas"; retornos sem "o encaixe do fêmur" e sem "as duas uniões".
2. m24-04 `i3` (hotspot): passa a `pelve-de-frente-recorte`; saem Sacro e Sacroilíaca, entra Sínfise púbica; regiões = caixas declaradas; pergunta e resposta certa intactas.
3. m18-02 `i3` (rótulo): quatro fichas viram três (Epífise, Diáfise, Cavidade medular; distrator Ligamento): saem a Placa de crescimento (faixa de ~0,02 do quadro) e a Cartilagem articular (faixa fina sobre a epífise; ver `medidas.md`; **decisão do controlador a levar ao dono**: a D3 listava a cartilagem, e a medida a reprova, sem mudar nenhuma resposta certa); entra a Cavidade medular, em (0,34; 0,68), e a Diáfise na parede âmbar de cima, em (0,38; 0,47); prompt, `help` e retorno sem "pontas" no plural nem "trecho do meio"; `closing.body` sem prometer apontar a cartilagem e a placa.
4. m28-04 `i2` (rótulo): seis fichas viram quatro, sem as duas "vista axial"; "Disco, vista sagital" e "Canal, vista sagital" viram Disco intervertebral e Canal vertebral.
5. m28-04: sem "linha tracejada" e "esquema de duas vistas" (fala do Caio, conceito, `i3` prompt, `i5` prompt); a fala do Caio diz "O sagital corta de cima a baixo e mostra a pilha inteira; o axial corta numa só altura."; resposta certa do `i5` inalterada. Na rodada 1 de correções, o retorno do checkpoint passou a "A coluna lombar não tem costelas." (o texto antigo falava de um "esquema" que o item não tem).

A divisão do osso do quadril em ílio, ísquio e púbis (D1) e a placa de crescimento (D3) não ganharam afirmação de verdadeiro ou falso: o `true-false` aceita de 3 a 4 afirmações e a m24-04 `i5` já tem 4, e a m18-02 não tem `true-false` (o verificador exige exatamente 5 interações). Os dois fatos continuam cobertos: o ílio, o ísquio e o púbis no `i4` (ligar) e no `i5` da m24-04 (ísquio), e a placa de crescimento no conceito e no segundo item do checkpoint da m18-02.

## Figuras fora do lote

Nenhuma. Ficam como alternativas para o dono, fora do repositório (`.superpowers/sdd/2026-11-20-figuras-1F/*/alternativa-*`): o fêmur inteiro do Servier para o osso longo; o disco axial em perspectiva (`coluna-axial`) e o item novo da m28-04, recusados por serem disco em perspectiva e não corte axial; e a pelve DBCLS/Togopic, que desenha o acetábulo, mas com forame obturado pequeno.

## Contagem de caminhos, fonte contra original

- `pelve-de-frente` e `pelve-de-frente-recorte`: 129 caminhos no `s11_Group_308.svg` (receitas/), 129 em cada fonte, 129 `<path>` em cada spec. Nenhum apagado, unido ou recortado; o recorte é a mesma fonte com outro `viewBox`.
- `osso-longo`: 45 caminhos no original; a fonte tem 37. Os 7 degradês em cadeia (`xlink:href`) do Inkscape foram resolvidos na receita, para cada um levar os seus `<stop>` (rodada 1 de correções; sem isso o conversor deixava sete preenchimentos transparentes). Diferença de caminhos: **8 linhas de chamada** do grupo `g4604` (o script confere que só há linhas e os 8 textos do autor dentro dele). Os 37 desenhos do autor ficam na mesma ordem, sem união nem divisão. **Filtros removidos pelo agente de arte antes do conversor**: 6 usos de 5 filtros de desfoque (`filter3925`, σ 1,52, em `path3252` e `path3256`, sombras da dobra do cilindro de periósteo; `filter4545`, `4549`, `4553` e `4557`, σ ~0,97, em quatro brilhos brancos de 59% sobre os vasos, `path3214`, `3221`, `3242` e `3265`); sem o desfoque ficam nítidos, no mesmo lugar. Coordenadas arredondadas por igual na grade de 0,5 unidade do autor (com 0,1 o spec passava de 240 KiB). O agente mediu o render da fonte contra o do original na mesma transformação: 0,07% do quadro difere em mais de 64 de 255, só contornos de 1 px (não repeti essa conta).
- `coluna-sagital-e-axial`: 2158 caminhos no original; a fonte tem 869. Os 1289 que faltam estão **inteiramente fora do quadro** (a receita testa a caixa de cada caminho contra o `viewBox`, somando a espessura do traço). Conferi: a receita com o corte desligado, renderizada no mesmo `viewBox`, contra a fonte cortada: **0 de 691.200 pixels diferem** (960 x 720).
- As receitas (`scripts/content/figuras/receitas/<id>.mjs`) rodam num checkout limpo, sem variável de ambiente, e reproduzem as fontes byte a byte (conferido com `cmp`); os originais de que dependem estão em `receitas/` (`osso-longo.original.svg`, sha256 093178e2...596da; `coluna-sagital-e-axial.original.svg`, sha256 150285d6...efc1; `s11_Group_308.svg`, sha256 be524a5e...1883). O `build-spec.mjs` regenera os quatro specs idênticos aos entregues pelos agentes (conferido com `cmp`), só com o `alt` da coluna encurtado de 162 para 155 caracteres (o teto do registro é 160).

## Alvos: o que medi

Regra do brief e do controlador: região declarada = caixa da estrutura, sem esticar; ponto de rótulo na maior parte sobre a estrutura; área certa não cobre a estrutura do erro típico. Percentuais por classe de cor, caixa a caixa, em [`lote-1F/medidas.md`](lote-1F/medidas.md). Resumo:

- m24-04 `i3` (recorte): região certa 100% sobre a caixa do forame, 0,2% de sínfise e 0% do forame oposto. O selo ocupa 26% da caixa; o agente de arte mediu 72,6% da abertura à vista.
- m24-04 `i2` (pelve inteira): marcadores sobre o osso (ílio 100%, sacro 94%, sacroilíaca 97%). A Sínfise saiu do item: o marcador cobre 97,2% dela (2.715 de 2.792 px), e a primeira versão desta evidência dizia 38%, que é a parte do marcador sobre a sínfise, e não a parte da sínfise coberta.
- m18-02 `i3` (medido sobre o fundo do app, #171920): epífise 74% e 87% (área e marcador), diáfise âmbar 36% na área e 63% sob o marcador, cavidade azul 61% na área e 82% sob o marcador. Nenhuma área da diáfise toca a caixa da epífise. **A cartilagem não passou na medida** (13% de ciano na melhor área, contra 37% de fundo), por isso saiu do rótulo.
- m28-04 `i2`: corpo 97%, processo espinhoso 93%, disco 71% (25% de corpo vizinho, inevitável: o disco mede 27 pt) e canal 48% (2% de osso do processo espinhoso).

## Spec contra fonte, sobre #171920 (rodada 1 de correções)

Pixels que diferem em mais de 40 de 255 entre o spec e a fonte, na mesma transformação: `pelve-de-frente` 110, `pelve-de-frente-recorte` 34, `osso-longo` 0 e `coluna-sagital-e-axial` 193, de 691.200 cada, só serrilhado. Detalhe e método em `lote-1F/medidas.md`. As prévias e todas as medidas por cor passaram a ser sobre o fundo do app; o primeiro passe era sobre branco, e foi isso que escondeu o defeito dos degradês do osso longo.

## Números (2026-11-20, Node 20.20.2, esta árvore)

- Verificador de aulas nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: saída 0. `generate-rtg-maestro.mjs --check` m18, m24 e m28: saída 0. `figuras-no-simulador.mjs --check` (sem ids): saída 0 (24 ids no índice, 26 roteiros).
- `node --test scripts/content/figuras/*.test.mjs`: 17 testes, 16 passam, 1 pula (o que vale só sem Chrome), 0 falham.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: 452 testes, 451 passam, 1 falha (a conhecida, `registerSource normalizes metadata for the pilot book`).
- `cd radiant-app && node --test scripts/copy-style-contract.test.mjs`: 65 de 65, depois de subir o teto de `eyebrow` de `rtgImages.ts` de 16 para 20 em `scripts/copy-style-baseline.json` (número medido: a licença em maiúsculas das quatro entradas novas).
- `npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`: 88 suítes, 1658 testes, todos passam. `npx tsc --noEmit`: saída 0.
- `npx eslint` nos 9 arquivos `.ts` tocados: saída 0. `npm run test:maestro-contract`: 13 de 13.
- Não rodado: o gate completo (`EXPO_NO_DOTENV=1 npm run quality`), o simulador e o Android.

## Peso

- Soma do SVG das 23 figuras importadas: 3.116.966 bytes (3043,9 KiB, 2,97 MiB), contra o teto de 8.116.109 bytes (7925,9 KiB) do teste do registro; o teto não mudou. As do lote (camada de arte): `osso-longo` 225,6 KiB (teto por figura de 240 KiB; maior figura sem exceção), `coluna-sagital-e-axial` 161,6 KiB, `pelve-de-frente` 38,6 KiB, `pelve-de-frente-recorte` 38,6 KiB. Nenhuma exceção nova por figura.

## Para o dono olhar no simulador

- m18-02 `i3`: a figura é só a ponta do osso, deitada (desvio da lição do 1A). Os três marcadores (epífise, diáfise, cavidade medular) leem bem? A placa de crescimento aparece como faixa fina sem rótulo.
- m24-04 `i3`: o recorte ampliado deixa a abertura do forame fácil de tocar? O selo cobre o canto de cima e da esquerda dela.
- m28-04 `i2`: a figura é um recorte de cerca de duas vértebras e meia, e os níveis não são identificáveis; o disco mede 27 pt.

## Capturas no iPhone (2026-11-20, simulador "Radiant F7", commit 0d481398)

- `capturas/ios-pelve-de-frente-m24-aula04-passo4.jpg`: m24-04 `i2`. A pelve inteira aparece nítida, com três marcadores: 1 no ílio esquerdo da figura, 2 no sacro (sobre a parte baixa, perto dos forames sacrais, sem esconder o osso) e 3 na articulação sacroilíaca. A sínfise fica à vista e sem marcador. Nenhum marcador cobre a estrutura que nomeia.
- `capturas/ios-pelve-de-frente-recorte-m24-aula04-passo5.jpg`: m24-04 `i3`. O recorte mostra os dois forames obturados e a sínfise. Os selos 1 e 2 ficam no canto de cima e da esquerda de cada forame, e a maior parte da abertura escura segue à vista; o selo 3 cobre o topo da sínfise, desenhada em cinza chapado. Há faixa vazia embaixo da figura, dentro do quadro.
- `capturas/ios-coluna-sagital-e-axial-m28-aula04-passo4.jpg`: m28-04 `i2`. Recorte de cerca de duas vértebras e meia, com disco azul sob o marcador 2, canal com fibras ciano (3) e vértebra posterior (4). A raiz nervosa ciano cruza o corpo vertebral do marcador 1 e lê como nervo dentro do osso; é desenho do autor, e o marcador 1 fica ao lado dela. Os níveis não se identificam.
- m18-02 `i3` (osso-longo): **sem captura. O app fecha (SIGABRT) ao entrar no passo 5.** Três execuções do roteiro; a segunda e a terceira (cópia fora do repositório, com rolagem e toque corrigidos só para passar do passo 4) chegaram ao passo 5 e o app caiu nas duas, com o mesmo rastro nos dois relatórios de falha (`Radiant-2026-11-20-142004.ips` e `142524.ips`): exceção `-[__NSDictionaryM setObject:forKey:]` em `-[RNSVGSvgView definePainter:painterName:]`, chamada por `-[RNSVGLinearGradient parseReference]`. O SVG do `osso-longo` tem 7 `<linearGradient>` sem `id` (herdeiros de `xlink:href` só com paradas); o react-native-svg do iOS os registra com nome nulo. Não foi testado se é essa a causa, nem se o Android sofre. As outras três figuras do lote não têm `linearGradient` sem `id`.
- Roteiro `m18-aula-02.yaml`: reprovou em duas execuções no passo 4 (categorizar): o toque em "Conferir resposta" não achou o botão, com "Faltam 2 fichas", porque a rolagem do roteiro não leva a ficha e o grupo à tela. Mesmo defeito conhecido de rolagem; não foi consertado.
