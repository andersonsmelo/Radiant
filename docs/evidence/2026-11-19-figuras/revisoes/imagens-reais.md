# Revisão independente: quatro figuras trocadas por imagem real de exame (2026-11-22)

Revisão feita por IA (Claude), **não por profissional de radiologia**. As leituras de anatomia (colo, trocânter, cabeça do fêmur, pelve) são raciocínio sobre a imagem, não laudo.

Escopo: commits 63331db3, a44d95da e 9f455ecc sobre a base 826127fa (branch `claude/figuras-fase-1`), lidos pelo git e conferidos numa worktree temporária destacada em 9f455ecc. Requisitos: o brief `scripts/content/figuras/briefs/revisor.md` (adaptado a imagem real) e as decisões D1 a D7 de `decisoes-reais.md`, com as frases do dono citadas no pedido.

## Vereditos

| Figura que sai → imagem real | Veredito |
|---|---|
| (a) `radiografia-roteiro` → `m23/torax-pa-roteiro-01.jpg` (CC0) | **Aprovada com correções a fazer** (achados 1, 2 e 8) |
| (b) `dxa-regioes-de-interesse` → `m30/dxa-quadril-coluna-01.jpg` (CC BY 2.0) | **Aprovada com correções a fazer** (achados 6, 9, 11, 12) |
| (c) `dxa-interferencias` → `m30/dxa-coluna-cimento-01.jpg` (CC BY 4.0) | **Aprovada com correções a fazer** (achados 3 e 4) |
| (d) `corpo-inteiro-composicao` → `m30/dxa-corpo-inteiro-01.jpg` (CC BY 4.0) | **Aprovada com correções a fazer** (achados 5, 7 e 10) |

Contagem: **0 Crítico, 5 Importantes, 9 Menores.** Nenhuma licença fora da regra, nenhum retoque, nenhum dado de paciente visível, nenhuma resposta certa trocada em item de figura. Os cinco Importantes são texto que ficou falso ou ambíguo, um recorte mal declarado e uma resposta de checkpoint que mudou, contra a letra da D4.

## 1. Licença (D2), lida na origem

| Imagem | O que li | Resultado |
|---|---|---|
| (a) | API do Commons, página e **as 12 revisões do texto da página**: `{{cc-zero}}` em todas, desde o envio do autor (2010-03-08, Stillwaterising, `Source={{own}}`). Uma só versão do arquivo, sha1 `f2625192…`, igual ao sha1 do original da pesquisa. | CC0 confirmado. |
| (b) | Commons (API e 11 revisões): `{{cc-by-2.0}}` em todas; Source aponta o artigo (com o PMC digitado errado, "PMC 300961"). **Origem**: artigo inteiro em PMC3009617: "Copyright ©2010 Germain; licensee BioMed Central Ltd. This is an Open Access article distributed under the terms of the Creative Commons Attribution License (…by/2.0)". No texto inteiro: 0 ocorrências de "permission", "reproduced", "adapted", "third party". "Courtesy" aparece 18 vezes, como crédito de quem cedeu cada figura, inclusive a Fig. 24 ("Courtesy: Dr Caroline LEBRETON…"). Europe PMC: `license` "cc by", `isOpenAccess` Y. sha1 do original da pesquisa = `898afc70…` = o do Commons. | CC BY 2.0 confirmado, sem reserva de terceiro. O resíduo do "Courtesy" está bem descrito na evidência. |
| (c) | Página do artigo na PLOS: "Copyright: © 2023 Lin et al. This is an open access article distributed under the terms of the Creative Commons Attribution License", link `by/4.0`. Sem "Courtesy", "reproduced" nem "adapted". Baixei a Fig. 1 (`size=large`): 2100 x 1064, sha256 `685d84cf…`, igual ao original da pesquisa. Autores pelo `citation_author`: Yen-Huai Lin, Che-Shi Chou, Michael Mu Huo Teng. | CC BY 4.0 confirmado. Crédito correto. |
| (d) | SciELO (o DOI redireciona para ela): "Open Access article distributed under the terms of the Creative Commons Attribution License", link `by/4.0`. A única linha "Source: Adapted from Kelly et al." é da Tabela 1. Baixei o PNG da Fig. 2 (`9e3f33e2…png`): sha256 `6a4f7ce5…`, igual ao original da pesquisa, e a legenda junto dele é a da Fig. 2. Seis autores conferidos pelo `citation_author`. | CC BY 4.0 confirmado, figura do próprio artigo. |

Os créditos (`imagens.json` e `rtgImages.ts`, que alimenta a tela de créditos) nomeiam todos os autores, a licença, o link da licença, a página de origem e a modificação. O crédito da (b) nomeia o autor do artigo e a autora da figura.

## 2. Fidelidade (D3)

Refiz o preparo a partir dos originais da pesquisa (redução LANCZOS e o mesmo recorte) e comparei com cada JPEG final, pixel a pixel:

| JPEG | Diferença média | Máxima | Pixels com diferença ≥ 30 |
|---|---|---|---|
| tórax (a), cinza, sem recorte | 1,18 | 18 | 0 de 1.167.600 |
| quadril e coluna (b), cor, sem recorte | 0,6 / 0,6 / 1,1 | 22 | 0 de 915.600 |
| coluna com cimento (c), cinza, recorte (10,150)-(670,1040) | 0,77 | 13 | 0 de 587.400 |
| corpo inteiro (d), cor, sem recorte | 1,4 / 1,0 / 1,8 | 40 | 0 de 1.041.600 |

São diferenças de compressão. Nada foi pintado, apagado nem colado. Os quatro JPEG não têm EXIF nem texto embutido. O original da (c) tem XMP e blocos do Photoshop, e o final não os traz. Tamanhos de 77 a 104 KiB, abaixo do teto. A (c) tem 660 x 890 porque é o tamanho nativo do painel, sem ampliação.

O recorte da (c) é enquadramento, que a D3 permite. Mas ele tira mais do que a evidência diz (achado 4).

## 3. Dado de paciente (D3)

Abri cada JPEG no tamanho real e li os quatro cantos e as bordas:
- **(a)**: só a tira de chumbo, no alto à direita de quem olha, com "L", "ETB" e um círculo com três esferas. O resto da imagem é anatomia. **O que se pode afirmar sobre "ETB"**: as letras estão no mesmo suporte radiopaco do "L" e do círculo (o contorno do suporte vai de y 0 a ~115 px). Logo, estavam sobre o detector na hora da exposição e fazem parte do marcador físico. Não são texto do sistema gravado depois na imagem. Não são nome, data nem número. **O que não se pode afirmar**: de quem são as iniciais. O costume é serem do técnico, mas nem a página do Commons nem o envio dizem isso. O círculo com esferas embaixo é, pelo formato, um indicador de posição (esferas no fundo = paciente em pé), também sem confirmação da fonte.
- **(b)**: só "A", "B" e "L1" a "L4". A legenda da fonte traz idade e T-scores, mas a imagem não.
- **(c)**: só "L1" a "L4", com "L2" em cinza escuro (ver achado 4), e as bordas da janela do programa.
- **(d)**: nenhum texto. O crânio e o contorno da cabeça não identificam a pessoa.

## 4. Achados

### Importantes

**1. (a) "ETB" no canto contradiz em silêncio "a identificação fica nos cantos", e um retorno afirma mais do que se sabe.** `content-manifest/rtg-2026/aulas/m23.json`: linhas 220 e 221 (M23.01 i2) e 279 (M23.01 i4, afirmação 3).
- *Cenário:* o conceito da M23.01 acabou de ensinar "1) identificação e marcador de lado, nos cantos". No i2, o aluno vê, no canto do alto, letras ("ETB") junto do "L" e põe a ficha "Etiqueta de identificação" no ponto 1. Leva "Alguma ficha está no ponto errado… há fichas sem ponto na imagem", sem saber por que aquelas letras não contam. No i4, ele julga "sem nome nem número de paciente visíveis" e lê "nenhum dado que identifique a pessoa aparece nela". O relatório do autor e o plano da D1 pediam cautela justamente aqui ("a aula diz 'sem nome nem número', e não 'sem identificação'"), e esse retorno a desfaz.
- *Correção:* no `feedbackIncorrect` do i2, acrescentar "A tira com o L é o marcador de lado; as letras junto dele fazem parte da mesma peça de chumbo, e esta imagem não tem etiqueta de identificação". No `feedback` da linha 279, trocar por "Certo: a imagem é real e não mostra nome nem número da pessoa." Se o dono preferir não afirmar nada sobre as letras, a alternativa é tirar a ficha "Etiqueta de identificação" dos distratores (fica "Eletrodo com fio").

**2. (a) A cena da M23.05 ficou falsa.** `m23.json`, linha 1617: "Esta imagem de treino tem uma margem clara em volta."
- A frase descrevia o esquema antigo, que tinha moldura de colimação. A única imagem da aula agora é a radiografia real do i3, **sem margem clara** (a própria evidência diz isso).
- *Cenário:* o aluno lê a cena, chega ao i3 e procura a margem que a Lia anunciou. Ela não existe. Pela regra da própria aula (i4: "Sem margem clara… campo real impossível de conferir"), ele pode até concluir que a imagem é inconferível.
- A D4 pede reescrever todo texto que ficaria falso, e esta linha não foi tocada.
- *Correção:* "Quando a imagem tem uma margem clara em volta, ela conta uma história sobre o feixe."

**3. (c) A M30.04 promete na conclusão o que o item de imagem deixou de praticar.** `m30.json`: linha 1396 (conclusão), linha 1167 (competência) e linha 1233 (i2).
- O item antigo (`risk-hunt`) pedia achar **três** riscos (metal, zíper e caixa sobre meia vértebra) e deixar duas coisas certas. O novo (`hotspot`) tem uma resposta certa, visualmente óbvia (o cimento é o objeto mais claro da imagem), e três caixas de vértebra normais como erradas.
- Para quem lê pela lista textual, os rótulos ("Ponto muito claro sobre uma vértebra" contra três "Caixa …") e a ajuda decidem sozinhos.
- A conclusão continua dizendo "Agora você consegue achar metal, zíper, coluna torta e caixa fora do lugar numa imagem de exame". Na imagem, só o metal foi praticado. Zíper e caixa fora do lugar ficaram só em texto (i4 de classificar, i5, checkpoint 2).
- A mudança de tipo foi declarada pelo autor e é a menor que mantém o item válido. A conclusão, porém, ficou falsa.
- *Correção:* (i) ajustar a conclusão e a competência para "achar, numa imagem de exame, material denso sobre a vértebra e reconhecer, nos casos descritos, zíper, coluna torta e caixa fora do lugar"; ou (ii) decisão do dono: manter um `risk-hunt` sobre o esquema antigo (ele continua no registro, pela D6) como segundo item, para não perder a prática de "marcar todos os riscos".

**4. (c) O recorte tirou do painel mais do que a evidência declara, e a legenda citada está truncada.**
- `docs/evidence/2026-11-19-figuras/imagens-reais.md`, linha 26: "O recorte corta a barra cinza da janela no alto". Medido no original: a barra da janela vai só até y ≈ 31. As linhas y ≈ 32 a 149 são **imagem**, cerca de 118 linhas de altura total do painel. Nelas há um segundo objeto muito claro na borda esquerda do corpo vertebral de cima (x ≈ 225 a 255 px no original, acima da caixa de L1, cerca de 2.500 pixels acima de 230). Ele aparece também no painel do meio e não aparece no painel de um ano antes.
- O recorte é enquadramento, permitido, e nada foi apagado de dentro do quadro final. Mas a frase "só tem um risco real" (base da troca de `risk-hunt` por `hotspot`) vale para o quadro **recortado**, não para o painel do autor.
- Além disso, a legenda da Fig. 1(a) diz: "The inclusion of vertebrae affected by bone cement in the ROI … **and the exclusion of affected vertebrae from the analysis of lumbar spine BMD**". O "L2" escuro no painel é essa exclusão já feita. O `descriptionFromSource` (`content-manifest/rtg-2026/imagens.json`, linha 211) corta essa metade da frase sem reticências. A razão dada para rejeitar o painel do meio ("exclui L2 da região, a decisão que a aula manda não tomar") também vale, em parte, para o painel escolhido.
- Para o aluno, o efeito é pequeno: o cimento está dentro da caixa, e o retorno ("pode alterar a medida… avisa a equipe") é verdadeiro pela própria fonte.
- *Correção:* (i) completar o `descriptionFromSource` com a frase inteira ou marcar o corte com "…"; (ii) corrigir a linha 26 da evidência: "o recorte tira a barra da janela e as ~118 linhas de cima do painel, onde há um segundo ponto muito claro, acima da caixa de L1"; (iii) dizer ao dono que o "L2" escuro é a marca de vértebra excluída do cálculo. Não recomendo incluir o objeto de cima no item: a ajuda "o que não é osso e está sobre uma vértebra" passaria a valer para ele também, e o item ficaria ambíguo.

**5. (d) A resposta certa do checkpoint 2 da M30.05 mudou, contra a letra da D4.** `m30.json`, linhas 1783 a 1796.
- Antes, a pergunta era "o que as três faixas representam?", e a certa era "os três componentes, como legenda de cor sem proporção". Agora a pergunta é "o que as linhas azuis representam?", e a certa é "os cortes que dividem o corpo em regiões".
- A pergunta mede outra coisa: antes, que a figura não tem proporção; agora, para que servem as linhas de corte. Era inevitável, porque as faixas deixaram de existir, e o autor declarou a mudança. Mas a D4 diz "sem mudar a resposta certa de nenhum item", e a decisão é do dono.
- O mesmo vale, em menor grau, para a afirmação 2 do i4 (antes "faixas", agora "linhas azuis", ambas falsas).
- O item novo é fácil: das três erradas, duas são absurdas ("radiação", "datas").
- *Correção:* o dono aceita a troca, ou o checkpoint 2 passa a perguntar algo que a aula ainda ensina sem depender da figura (por exemplo, "o que cada região recebe?").

### Menores

**6. (b) Selo do trocânter sobre a ponta da saliência.** `m30.json`: M30.02 i4 (linha 606, região do trocânter) e M30.06 i2 (linha 1952).
- O selo do trocânter cai em (60-214, 202-305) px do JPEG e esconde o topo da saliência, que é a forma que o rótulo e a ajuda descrevem.
- *Correção:* região `x 0.045, y 0.35, width 0.11, height 0.21`. O selo sobe para (54-208, 164-267), acima do osso.
- Conferi com as funções do app (`badgeBoxes`, `touchRect`): nenhuma área de toque se sobrepõe, todas cabem no quadro e o selo fica a ≥ 3 pt das outras regiões, nos dois itens.
- No i2 (rótulos) da M30.02, o selo 3 cobre o contorno lateral da haste acima do ponto do quadril total. É aceitável: o contorno da direita continua visível.

**7. (d) Selo 4 sobre o vértice do V.** M30.05 i2, ponto "Perna" (`m30.json`, linhas 1620 a 1622).
- O selo cai em (157-269, 663-737) px e cobre o vértice do V citado no `where` e no retorno ("até o V entre as pernas").
- *Correção:* ponto `x 0.15, y 0.68`, na diáfise do fêmur. O selo vai para (149-260, 723-797) e deixa o vértice (y ≈ 700) livre. Passa nas guardas de selo e de toque.

**8. (a) A área de toque certa da M23.05 i3 cobre a base do pulmão.**
- A região "Diafragma" tem 78 x 25 pt, e o toque sobe para 78 x 44 pt, de (144, 727) a (480, 917) px.
- Contei os pixels: 46% são escuros, a base do pulmão até y ≈ 805; o resto é a cúpula e o fígado. Nenhuma outra região está sob ela (o campo pulmonar termina em y 603).
- É defensável, porque a pergunta é justamente sobre a base do pulmão, e o erro típico (campo pulmonar, mediastino) fica fora.
- Se o dono quiser a cúpula mais ao centro do toque: região `x 0.12, y 0.80, width 0.28, height 0.10`.

**9. (b) Competência da M30.02 promete localizar L1 a L4 "numa imagem de exame".** `m30.json`, linha 455.
- Com L1 a L4 impressos, nenhum item de imagem pede mais que o aluno conte as vértebras. No i4, L1 e L4 são distratores com o nome impresso.
- A contagem pela crista ilíaca ficou só em texto (i5, checkpoint 2).
- Tirar os pontos da coluna foi certo pela D4. Falta ajustar o texto: "Reconhecer, numa imagem de exame, as caixas de L1 a L4 e localizar as regiões do fêmur proximal".
- O i4 ficou quase de escolha única: o enunciado exclui o colo, e L1 e L4 não são do fêmur.
- Opção, a conferir pelo dono: trocar L4 por uma região "Cabeça do fêmur" (`x 0.30, y 0.24, width 0.10, height 0.16`), vizinha do colo e sem região própria, que é um distrator plausível. Ela passa nas guardas.

**10. (d) "Linhas azuis", conceito sem a imagem e a pelve.** `m30.json`, linha 1554 e trechos ligados (i4, conclusão, checkpoint 2).
- As linhas medem RGB ≈ (73, 107, 108), turquesa escuro, e na prévia parecem verde-água. No painel colorido há também linhas **vermelho-magenta** (RGB ≈ 213, 73, 72) que a aula não explica.
- O conceito diz "Na imagem desta aula, as linhas azuis…" antes de qualquer imagem aparecer, porque o `visual` saiu.
- A legenda da fonte lista **cinco** regiões ("head, trunk, pelvis, arms, and legs"), e a aula segue com quatro. O texto atual ("também isolam a pelve") não chega a ser falso.
- *Correção:* "Na imagem da próxima atividade, as linhas de corte (azul-claro) também isolam a pelve". A pelve fica como decisão do dono ou de especialista: dentro do tronco, ou quinta região.

**11. (b) Cor mantida, contra a letra da D3.** A D3 pede escala de cinza, salvo a (d). A (b) ficou em cor porque os itens falam de "contorno amarelo". A justificativa é boa e declarada. Registro só para o controlador aceitar formalmente.

**12. (b) "Contorno amarelo" não distingue pela cor.** M30.06 i2, linha 1966.
- Na imagem real, todas as caixas e contornos são amarelos: a global, a do colo, a de Ward e as da coluna. Só a posição ("na haste") e a palavra "contorno" separam a certa.
- A região certa está sobre a linha do contorno do osso (x ≈ 88 a 100 px), e as regiões erradas não contêm essa linha. Por isso a resposta continua decidível pela figura.
- *Correção opcional:* "Contorno amarelo do osso, na haste".

**13. Guarda de selos sem os itens com `imageId`.** `radiant-app/src/features/lesson-flow/renderers/hotspotTouch.test.ts`, linha 278.
- O teste só coleta itens com `diagramId` registrado em `DIAGRAMS`. Os 7 itens deste lote e o `m25-03 i2` (8 itens de imagem com pontos ou regiões) não têm guarda de "selo perto do ponto alheio" nem de "selo junto de outra região".
- Rodei as duas guardas sobre esses 8 itens, com o quadro de 280 x (280·altura/largura) pt tirado de `imagens.json`: **todos passam hoje**. Um item de imagem futuro pode regredir sem aviso.
- *Correção:* no `walk`, aceitar `n.imageId` e tirar o quadro do cadastro. A contagem passa a ser de 90 itens.

**14. Linha de base do contrato de texto afrouxada.** `radiant-app/scripts/copy-style-baseline.json`: `rtgImages.ts` "eyebrow" de 20 para 23. A medida do autor ("CC BY 2.0" e "CC BY 4.0" em maiúsculas nos créditos) é coerente, e é nome de licença. Registro para o controlador.

## 5. Alvos medidos (por pixel, no JPEG final, na régua de 280 pt)

Refiz as contas com as funções do app (`touchRect`, `badgeBoxes`, `labelBadgeBoxes`, carregadas por `load-app-contract.cjs`) e desenhei as áreas de toque, as regiões, os pontos de 12 pt e os selos de 36 x 24 pt sobre cada JPEG. Abri cada desenho. A parte de cada área de toque certa sobre cada região coincide com o relatório do autor.

| Item | Área de toque certa | Sobre a própria região | Sobre cada errada | O que mais há embaixo |
|---|---|---|---|---|
| M23.05 i3, diafragma | 78 x 44 pt | 57% | 0% (marcador, campo, coluna) | base do pulmão em 46% dos pixels (achado 8) |
| M30.02 i4, trocânter | 44 x 44 pt | 41% | 0% nas caixas; a ponta da caixa do colo, sobre partes moles, ocupa ~4% | resto do trocânter, partes moles à esquerda |
| M30.04 i2, ponto claro | 78 x 46 pt | 100% | 0% | só o cimento e a vértebra L2 |
| M30.06 i2, contorno na haste | 44 x 44 pt | 28% | 0% | haste, contorno lateral, as duas linhas do eixo do colo |

- Nenhuma área de toque se sobrepõe a outra em nenhum dos 7 itens, e todas cabem no quadro.
- Os pontos dos itens de rótulo caem sobre a estrutura que nomeiam:
  - **marcador**: o ponto fica sobre o círculo da tira, com "L" e "ETB" visíveis acima;
  - **campo pulmonar** e **diafragma**: o ponto cai na junção pulmão-fígado à esquerda de quem olha;
  - **colo**: na parte baixa da caixa longa que cruza o colo;
  - **trocânter**: na saliência lateral;
  - **quadril total**: na haste, dentro do contorno;
  - **cabeça, tronco, braço, perna**: no painel esquerdo.
- **Colo e trocânter pela forma** (leitura de IA):
  - a caixa longa é perpendicular ao eixo do colo (a linha que sobe da esquerda para a direita) e vai da concavidade superior do colo até a margem inferior, com as duas pontas sobre partes moles. É o desenho típico da caixa do colo;
  - o quadrado menor no meio dela é compatível com a região de Ward;
  - a saliência lateral, com a ponta na altura do centro da cabeça, é compatível com o trocânter maior;
  - a legenda da fonte confirma só que o painel A é do colo do fêmur ("femoral neck (A)").
- **Rótulos impressos:**
  - L1 a L4 e "A"/"B" não entregam nenhuma resposta certa: nos itens que sobraram, as vértebras são só respostas erradas;
  - o "L2" escuro da (c) fica sob o selo 1, o que não atrapalha.

## 6. Itens alterados (comparados com 826127fa)

| Item | Continua válido? | O que mede agora | O que o aluno deixa de praticar | Recomendação |
|---|---|---|---|---|
| M23.01 i2 (rótulos) | Sim, com o achado 1 | Separar a marca posta no exame (marcador) da anatomia (campo pulmonar, diafragma) numa radiografia real, com dois distratores | Onde fica a etiqueta de identificação; ler a borda de colimação na imagem (o i3 e o conceito ainda tratam disso em texto) | **Aceitar** com a correção dos retornos (achado 1) |
| M23.01 i3, i4, i5, cena, conceito, conclusão, checkpoint e recuperação | Sim; "quando há margem clara" está correto para esta imagem | O mesmo de antes | Nada | **Aceitar**; ajustar o retorno da linha 279 (achado 1) |
| M23.05 i3 (tocar) | Sim | Onde conferir que a base do pulmão entrou no campo (diafragma), com o marcador no lugar da etiqueta como erro | Nada de relevante | **Aceitar**; corrigir a cena (achado 2) |
| M30.02 i2 (rótulos) | Sim | Colo, trocânter e quadril total no fêmur real, com "Cabeça do fêmur" como distrator | Rotular L1 e L4 numa imagem (impressos, então a remoção é obrigatória pela D4) | **Aceitar**; ajustar a competência (achado 9) |
| M30.02 i4 (tocar) | Sim, mas fraco | Qual região vizinha do colo tem região própria (o trocânter) | Descartar a asa do ilíaco, um distrator que não é do fêmur e saiu porque não existe na imagem | **Aceitar**; opção: "Cabeça do fêmur" no lugar de L4; mover a região do trocânter (achado 6) |
| M30.04 i2 (`risk-hunt` virou `hotspot`) | Sim, com resposta única | Achar o material denso sobre a vértebra num exame real | Marcar **todos** os riscos, reconhecer zíper e caixa fora do lugar na imagem, e deixar sem marcar o que está certo | **Decisão do dono**: aceitar e corrigir a conclusão e a competência, ou manter um `risk-hunt` sobre o esquema antigo como item a mais (achado 3) |
| M30.05 conceito (sem `visual`), i2, i4, conclusão | Sim | Rotular 4 regiões no painel do esqueleto; as linhas de corte não medem componentes | Ler as três faixas (que deixaram de existir) | **Aceitar** com os ajustes do achado 10; mover o ponto "Perna" (achado 7) |
| M30.05 checkpoint 1 ("cinco" virou "quatro" no distrator) | Sim; o distrator ficou mais coerente com a aula | O mesmo | Nada | **Aceitar** |
| M30.05 checkpoint 2 | Sim, mas com outra resposta certa e outro construto | Para que servem as linhas de corte | Que a figura não tem proporção | **Decisão do dono** (achado 5) |
| M30.05 recuperação de transferência (1 alternativa) | Sim | O mesmo | Nada | **Aceitar** |
| M30.06 i2 (tocar) | Sim | Qual contorno é o quadril total, no exame real | Nada de relevante | **Aceitar**; mover o trocânter (achado 6); rótulo opcional (achado 12) |

Nos 7 itens de figura, a resposta certa continua sendo a mesma estrutura. Nada sobra afirmando "esquema", "desenho", "quadrado branco", "faixa de cor" ou "tracejado" sobre essas quatro imagens, salvo a cena do achado 2. As menções a "esquema" que restam na m30 (M30.04 i1, M30.06 i1 e o conceito da M30.06) falam de outras figuras (`dxa-posicionamento`), que continuam desenhadas.

## 7. Gates (worktree destacada em 9f455ecc, Node 20.20.2)

- Verificador nas 40 unidades: **40 OK, 0 reprovadas**.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: **454 testes, 453 passam, 1 falha**, a conhecida e alheia (`registerSource normalizes metadata for the pilot book`).
- `node scripts/content/build-rtg-batches.mjs --check`: ok (saída `"ok": true`).
- `node scripts/qa/generate-rtg-maestro.mjs --check m23` e `--check m30`: ok.
- `node scripts/qa/figuras-no-simulador.mjs --check`: ok.
- `cd radiant-app && npx jest src/features/student-checkpoints src/features/settings src/features/lesson-flow/renderers`: **50 suítes, 706 testes, todos passam** (inclui o `hotspotTouch.test.ts` com 82 e a tela de créditos).
- D7: os arquivos alterados nos 3 commits estão todos em `arquivos-do-run-reais*.txt`; nenhum fora da lista. D6: os quatro specs continuam em `radiant-app/src/ui/diagrams/specs/`.
- Não rodei a suíte jest inteira nem `EXPO_NO_DOTENV=1 npm run quality` (o controlador está rodando o gate).

## 8. O que o dono deve olhar no simulador

1. **M23.01 i2**:
   - o ponto 1 de 12 pt fica sobre o círculo da tira: o "L" continua legível?
   - "ETB" parece identificação de paciente (achado 1)?
2. **M23.05 i3**: o véu da região "Marcador de lado" sobre a tira; se tocar na base do pulmão, logo acima da cúpula, conta como diafragma (achado 8).
3. **M30.02 i2 e i4, M30.06 i2**: o painel A ocupa ~131 x 178 pt num telefone de 280 pt.
   - Dá para ver a caixa do colo e o quadrado de Ward?
   - O ponto de 12 pt (≈ 51 px do JPEG) cobre boa parte da largura da caixa do colo.
   - O selo do trocânter cobre a ponta da saliência (achado 6).
4. **M30.04 i2**: legibilidade do "L2" escuro e do cimento; se a resposta parece óbvia demais (achado 3).
5. **M30.05 i2**:
   - as linhas parecem "azuis" no tema escuro?
   - as linhas vermelhas do painel colorido confundem?
   - o selo 4 sobre o vértice do V (achado 7).
6. **Tela de créditos**: as quatro entradas novas, os links da licença e da origem (o da (b) abre o artigo na Springer).

## 9. Não consegui verificar

- **Página de origem da BMC** (`ojrd.biomedcentral.com`, que redireciona para `link.springer.com`): o servidor devolveu "Client Challenge" para leitura automática. Li o mesmo artigo inteiro no PMC (PMC3009617), com a declaração de licença e a legenda da Fig. 24. O texto completo em XML da Europe PMC deu erro 500; usei a API de busca dela (`license` "cc by").
- **Se a Fig. 24 do PMC é byte a byte a do Commons**: conferi o sha1 do Commons contra o original da pesquisa, mas não baixei a figura do PMC.
- **De quem são as iniciais "ETB"** e o que é o objeto claro cortado acima de L1 na (c): nenhuma das duas fontes diz.
- **Anatomia e convenções de aparelho:** se colo, trocânter e cabeça são o que a forma sugere (leitura de IA); se, no aparelho da Fig. 2, a pelve conta dentro do tronco; se o quadrado menor da (b) é mesmo a região de Ward.
- **Como o app desenha de fato** o véu das regiões e o ponto sobre as imagens: não rodei simulador nem Metro, por instrução. As prévias do autor e os meus desenhos são aproximações com as mesmas contas.
- **Suíte jest inteira e gate de qualidade**: não rodei (instrução).

## 10. Correções aplicadas (2026-11-22)

Decisões do controlador N1 a N9 sobre os pontos em que o parecer deixou opção. Gates e números em [`../imagens-reais.md`](../imagens-reais.md), seções 6 e 8.

| Achado | O que foi feito |
|---|---|
| 1. "ETB" | `feedbackIncorrect`, `feedbackCorrect` e `help` da M23.01 i2 dizem que as letras junto do "L" fazem parte da mesma peça de chumbo do marcador e que não há etiqueta de identificação à parte. A afirmação 3 do i4 passou a "a imagem é real e não mostra nome nem número da pessoa". Nenhum texto afirma de quem são as letras. |
| 2. Cena da M23.05 | "Quando a imagem tem uma margem clara em volta, ela conta uma história sobre o feixe." |
| 3. Conclusão da M30.04 | Competência e fecho passam a "achar, numa imagem de exame, material denso sobre a vértebra e reconhecer, nos casos descritos, zíper, coluna torta e caixa fora do lugar". O `hotspot` ficou; nenhum item novo sobre o esquema antigo. |
| 4. Recorte da (c) | `descriptionFromSource` com a legenda inteira (inclui "and the exclusion of affected vertebrae from the analysis of lumbar spine BMD"). Evidência corrigida: o recorte tira a barra da janela e ~118 linhas de cima, onde há um segundo ponto muito claro acima de L1; o "L2" escuro é a marca da vértebra já excluída do cálculo. O objeto de cima não entra no item. |
| 5. Checkpoint 2 da M30.05 | A pergunta passou a "o que cada região do corpo recebe?", certa "Os três valores: osso, massa magra e gordura", com três distratores plausíveis. A afirmação 2 do i4 segue falsa e agora diz "linhas de corte". |
| 6. Selo do trocânter | Região em x 0,045, y 0,35, 0,11 x 0,21 na M30.02 i4 e na M30.06 i2. |
| 7. Selo 4 da M30.05 | Ponto "Perna" em x 0,15, y 0,68; o vértice do V fica livre. O `where` e o retorno seguem verdadeiros. |
| 8. Área de toque do diafragma | Não alterado: o parecer a deixa como opção do dono, e a pergunta é justamente sobre a base do pulmão. |
| 9. Competência da M30.02 | "Reconhecer, numa imagem de exame, as caixas de L1 a L4 e localizar as regiões do fêmur proximal". No i4, "Cabeça do fêmur" (x 0,30, y 0,24, 0,10 x 0,16) no lugar de L4, e o retorno de erro cita a cabeça. A certa (trocânter) não mudou. |
| 10. "Linhas azuis" | "Linhas de corte", sem cor afirmada (medidas: turquesa escuro; o `alt` deixou de dizer "azul-claro"). O conceito diz "na imagem da próxima atividade" e que as linhas também isolam a pelve, que fica dentro do tronco. |
| 11. Cor da (b) | Registro aceito: cor mantida porque os itens falam de contorno amarelo. Sem mudança de arquivo. |
| 12. "Contorno amarelo" | Rótulo "Contorno amarelo do osso, na haste". |
| 13. Guarda de selos | `hotspotTouch.test.ts` coleta também itens com `imageId` (quadro de 280 pt com a proporção do cadastro); contagem 90 (82 de desenho, 8 de imagem real). Vista falhando com dois defeitos específicos em itens de imagem real: ponto de um alvo colado no de outro (m30-02 i2) e região sobre a outra (m30-06 i2). Execução vermelha registrada em `.superpowers/sdd/2026-11-22-figuras-13/vermelho-reais.txt` (fora do git); a aula foi restaurada byte a byte. Uma primeira tentativa de defeito (região colada ao lado) não falhou a guarda, e está dita no registro. |
| 14. Linha de base | Registro para o controlador: "eyebrow" de `rtgImages.ts` de 20 para 23, nome de licença em maiúsculas. Sem mudança. |

Gates depois das correções: verificador 40 OK; `build-rtg-batches --check` ok; Maestro de m23, m30 e `figuras-no-simulador --check` ok; `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs` 454, 453 passam, 1 falha alheia conhecida; jest (`student-checkpoints`, `settings`, `lesson-flow`) 64 suítes, 1124 testes; `tsc` e `eslint` sem erro; `test:maestro-contract` 13; `copy-style-contract` 65.
