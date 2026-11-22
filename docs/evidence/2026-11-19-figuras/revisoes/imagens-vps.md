# Revisão independente: cinco figuras trocadas por exames do acervo do dono (2026-11-22)

Revisão feita por IA (Claude), **não por profissional de radiologia**. As leituras de anatomia (pâncreas, artéria mesentérica, cabeça do fêmur, acetábulo, istmo da tireoide, cóccix) são raciocínio sobre a imagem, não laudo.

Escopo: commits f88b41d1, 8c2eb513, 8d31af82 e 134244db sobre a base 1e992e7b (branch `claude/figuras-fase-1`), lidos pelo git e conferidos numa worktree temporária destacada em 134244db (já removida, com os links desfeitos). Requisitos: o brief `scripts/content/figuras/briefs/revisor.md` (adaptado a imagem real como na `revisao-reais.md`), as decisões V1 a V7 de `decisoes-vps.md` e a ressalva já aceita pelo controlador sobre o autor sem parênteses.

## Vereditos

| Figura que sai → imagem real | Veredito |
|---|---|
| `corte-abdome-superior` → `m28/tc-axial-abdome-superior-01.jpg` (TC, fase portal) | **Aprovada com correções a fazer** (achado 2; menores 6 e 7) |
| `corte-pelve` → `m28/tc-axial-pelve-01.jpg` (TC) | **Aprovada com correções a fazer** (achado 1) |
| `corte-pescoco` → `m28/tc-axial-pescoco-01.jpg` (TC com contraste) | **Aprovada com correções a fazer** (menor 4) |
| `ponderacoes-no-encefalo` → `m29/rm-ponderacoes-encefalo-01.jpg` (RM T1 3D, T2, FLAIR 3D com saturação de gordura) | **Aprovada com correções a fazer** (achado 3; menor 8) |
| `supressao-de-gordura` → `m29/rm-supressao-gordura-01.jpg` (RM T2 do abdome, sem e com supressão) | **Aprovada** (menores 5 e 13, opcionais) |

Contagem: **0 Crítico, 3 Importantes, 11 Menores.** Nenhum dado de paciente nos pixels, nos metadados nem nos textos do repositório. Nenhum retoque. Nenhuma resposta certa trocada, salvo a da m29-04 i3, que a V5 autoriza porque a estrutura da resposta antiga (faixa de falha junto ao metal) não existe na imagem real.

## 1. Origem, crédito e licença (V1, V3)

Aqui não há página web de licença a ler: a origem é o acervo do dono, que licencia as imagens anonimizadas em CC BY 4.0 (V1, frase "CC BY 4.0, seu nome (Recomendado)"). Conferi no commit 8c2eb513, em `content-manifest/rtg-2026/imagens.json` (linhas 237 a 342) e em `rtgImages.ts` (que alimenta a tela de créditos):

- `author` "Anderson Melo, acervo próprio, anonimizado" nas cinco. A V3 pedia parênteses; a troca pela vírgula é a ressalva já aceita (o `ImageCreditsScreen.test.tsx` usa o autor como expressão regular sem escapar). A pendência de escapar o teste continua aberta (achado 11).
- `license` "CC BY 4.0", `licenseUrl` `https://creativecommons.org/licenses/by/4.0/`, `sourcePage` apontando para `docs/evidence/2026-11-19-figuras/imagens-vps.md` na `main` (achado 10).
- `sha256Original` = `sha256Asset` = sha256 do JPEG da amostra. Conferi byte a byte: os cinco arquivos versionados são idênticos aos `vps/<id>/figura.jpg`.
- `modification` traz janela, recorte, ampliação, MPR e redução, como nas fichas. `descriptionFromSource` é técnica (modalidade, plano, fase ou sequência), sem nome, número, data, instituição ou UID. Ele não vai para o app (`rtgImages.ts` não o carrega), então não entrega a ordem T1/T2/FLAIR nem o lado da supressão.
- `projection` axial e `region` coerentes. Os `alt` descrevem o que se vê e não entregam resposta: o do pescoço cita "forma redonda preta no meio", sem nomear a traqueia; o das ponderações e o da supressão não dizem qual imagem é qual.

## 2. Privacidade (V4), conferida por mim

**Arquivos.** Percorri os marcadores de cada JPEG: só APP0 (JFIF), DQT, SOF0 (um componente, cinza), DHT e SOS. Não há APP1 (EXIF), APP13, COM nem bytes depois do EOI. Tamanhos de 64 a 141 KiB, abaixo do teto de 150 KiB.

**Pixels.** Abri cada imagem inteira no tamanho real e ampliei os cantos e as bordas. Não há texto gravado. Os cantos claros da imagem das ponderações são o couro cabeludo do primeiro painel. As TC mostram a mesa e o corpo, sem régua nem anotação.

**Textos do repositório.** Procurei, no diff inteiro dos quatro commits e nas mensagens deles, os nomes de pasta e de série das fichas (`abdome_abdome_trifasico`, `pescoco_pescoco`, `cranio_encefalo`, `regiao_abdominal`, `0011_volume…`, BRAVO, CUBE), UIDs (`1.2.840`), datas de exame, "VPS", caminhos de servidor, instituição e hospital. **Nada.** A evidência cita só contagens ("15 séries", "1567 arquivos"), o que foi removido do cabeçalho e as sequências de forma genérica, como a V4 permite.

- As fichas e o `vps/relatorio.md` (fora do git) citam os nomes das pastas do acervo e das séries. Eles não identificam pessoa, mas **não devem ser versionados**: a pasta `.superpowers/` precisa continuar fora de commit.
- Nenhuma imagem mostra rosto reconstruído. O corte do encéfalo é axial e alto, sem face.

## 3. Achados

### Importantes

**1. Pelve: o selo 3 esconde 44% da cabeça do fêmur que o rótulo "Acetábulo" manda olhar.** `content-manifest/rtg-2026/aulas/m28.json`, M28.02 i2, linhas 575 a 581.
- O ponto do acetábulo (738, 470) px fica no lado esquerdo do paciente, à direita da figura. O `where` diz "osso curvo que abraça a bola do lado direito da figura".
- Pelas funções do app (`labelBadgeBoxes`), o selo 3 cai em (762-903, 352-446) px, exatamente sobre a metade de dentro e de cima da cabeça do fêmur desse lado.
- Contei os pixels de osso (≥ 230) na cabeça: **44% ficam sob o selo**. Do outro lado, o selo 2 cobre 12% da cabeça.
- *Cenário:* o aluno procura "o osso curvo que abraça a bola". A parte da bola que o acetábulo abraça está sob o selo. Sobra o arco de baixo da articulação, e ele pode pôr "Acetábulo" na cabeça ou em outro ponto.
- *Correção:* trocar os dois pontos de lado, sem mudar nenhuma resposta:
  - "Cabeça do fêmur" em (860, 410) px, ou `x 0.7818, y 0.4824`, com o `where` "bola de osso muito clara, à direita da figura";
  - "Acetábulo" em (330, 470) px, ou `x 0.3, y 0.5529`, com o `where` "osso curvo que abraça a bola do lado esquerdo da figura".
- Conferi com as funções do app: nenhuma área de toque se sobrepõe, todas cabem no quadro e a guarda "selo perto de outro ponto" passa. O selo 2 cai em (884-1025, 292-386) e cobre 8% da cabeça; o selo 3, em (354-495, 494-588), fica na gordura do assoalho pélvico.
- O ponto (330, 470) cai em osso (valor 255), medial à fenda da articulação. Antes de aplicar, abra a prévia.

**2. Abdome: o ponto do pâncreas cai na emenda com a artéria mesentérica superior.** `m28.json`, M28.01 i2, ponto 4 (linha 230), (600, 450) px.
- Perfil vertical em x = 600: claro de y 410 a 440 (corpo e colo do pâncreas), escuro em y 450 a 460 (valores 128 e 105, o colar de gordura da artéria) e claro de novo de y 470 a 500, que é a própria artéria, redonda, dentro do colar.
- **26% do ponto de 12 pt (raio de 23 px) está sobre pixel escuro**. Nos outros quatro pontos do item, 0% (o estômago, cheio de líquido, é cinza-escuro por natureza e não conta).
- *Cenário:* o `where` diz "faixa clara e inclinada, atrás da oval grande". O ponto fica na borda de baixo da faixa, encostado num vaso redondo. Para o aluno, o vaso é uma "oval clara" separada, e o rótulo fica ambíguo.
- *Correção:* (625, 432) px, ou `x 0.5682, y 0.4547`, no meio da faixa: 0% de pixel escuro sob o ponto.
- Passa nas guardas: o centro dista 185 px do estômago (o limite de 44 pt é 173 px), não há sobreposição e o selo 4 vai para (460-601, 314-408), sobre a cabeça do pâncreas, que não é rotulada.

**3. Ponderações: a imagem traz uma gordura apagada que a aula não explica, e a cena manda usar a gordura como pista.** `content-manifest/rtg-2026/aulas/m29.json`: linha 736 (cena: "O líquido dentro da cabeça e a gordura em volta mudam de brilho") e linha 742 (conceito); objetivo e competência ("pelo brilho do líquido e da gordura").
- O terceiro painel é um FLAIR 3D **com saturação de gordura**, como dizem a ficha e o `descriptionFromSource`. Na imagem, a gordura do couro cabeludo é clara no T1, clara no T2 e **escura no FLAIR**.
- A aula diz só que a terceira é "de base T2 com o líquido suprimido". Nada diz que a gordura dela também foi apagada, nem por quê.
- *Cenário:* a cena manda comparar a gordura entre as imagens. O aluno vê a gordura escura só na terceira e aprende que "líquido suprimido apaga a gordura", uma generalização falsa que a própria figura cria. A V5 e o pedido exigem o FLAIR descrito como de fato é.
- O hotspot (i2) continua certo e decidível: no FLAIR, o córtex está claramente mais claro que a substância branca, e os ventrículos estão escuros. Conferi no tamanho real.
- *Correção:* uma frase no conceito, que tem 83 palavras e teto de 110. Por exemplo: "Na terceira imagem desta atividade, a gordura do couro cabeludo também está escura, por uma técnica extra, a supressão de gordura, assunto da próxima aula." Com isso o corpo vai a cerca de 108 palavras, e a M29.04 ganha um gancho.

### Menores

**4. Pescoço: "o istmo fica mais abaixo" não é verificável, e o selo 4 cobre o canal.** `m28.json`, linha 851 (conceito da M28.03).
- Não dá para saber, por este corte, se o istmo fica acima ou abaixo. Os lados escuros são gordura da fossa supraclavicular (valores 11 a 27 na janela de partes moles), não ápice de pulmão, então o nível não se fixa só pela imagem.
- Sugestão: "e o istmo, que as liga pela frente, fica em outro nível do pescoço".
- O selo 4 cai em (475-614, 403-496) px e cobre a metade direita do canal da medula, que o conceito cita ("no canal dela, a medula"). O item não pede o canal, e o corpo da vértebra continua visível. Registro para o simulador.
- Os quatro pontos (traqueia, carótida esquerda, jugular direita, vértebra) caem sobre a estrutura certa. "A artéria é um círculo menor e a veia, uma oval maior" é verdadeiro nesta imagem.

**5. Supressão: a região está 8 px abaixo da faixa, e os selos cobrem a gordura dos flancos e de trás.** `m29.json`, M29.04 i3, linha 1177.
- A faixa de gordura de cima vai de y ≈ 68 a 100 px; a região, de 77 a 112. Ficam fora os 9 px de cima da gordura, e entram 12 px de músculo. Isso não muda a resposta, porque a área de toque (y 0 a 189) cobre a faixa inteira.
- A média na região é 117 na imagem da esquerda (gordura clara) e 22 na da direita (100% escura), e a área de toque certa cobre 0% das outras regiões.
- Os selos 1 e 2 caem entre as duas imagens e cobrem a gordura do flanco de cada uma. Os selos 3 e 4, abaixo das colunas, cobrem a gordura de trás. A gordura da frente, que é a pedida, fica livre.
- Na imagem com supressão, a gordura de cima mede 15 a 38 contra 0 do fundo: no telefone, quase preta. O aluno decide pela comparação com a da esquerda, o que basta, mas vale olhar no simulador.

**6. Abdome: o gás do intestino pode passar por "pulmão pequeno nas bordas".** `m28.json`, linha 1855 (conceito da M28.06) e `alt` do abdome.
- A aula ensina que perto do diafragma as áreas escuras do pulmão "encolhem para as bordas". A tomografia tem manchas pretas de gás no cólon, justamente na borda da frente, à esquerda do paciente (à direita da figura).
- O conceito já diz que o corte não tem pulmão, e o i4 diz "Num corte sem pulmão", então não chega a ser falso.
- Sugestão: "…não tem área escura de pulmão; as manchas pretas dele são gás dentro do intestino." O conceito tem 80 palavras.

**7. Abdome, M28.06 i4: a caixa do fígado contém o rim direito.** `m28.json`, linha 1986.
- A caixa justa do fígado, (25-430, 190-810) px, tem dentro o rim direito inteiro, a vesícula e o gás do duodeno. Quem confunde o lado e toca o rim direito escolhe "Fígado". O retorno genérico continua verdadeiro.
- Tirar a região "Rim direito" foi necessário: as áreas se sobreporiam. A área certa (baço, 47 x 69 pt, igual à região) cobre 0% do rim esquerdo, que termina 5 px antes, e da vértebra. Medi 87% de pixels em tons médios, do baço, e 8% claros: a costela da parede.

**8. Ponderações: os selos cobrem o lobo frontal de cada cabeça.** M29.03 i2. Os três selos (36 x 24 pt) ficam acima das regiões, sobre a parte da frente de cada cérebro, que tem ~60 x 85 pt. A comparação entre a substância branca e a cinzenta continua possível dos lados e atrás. A área de toque certa (189 x 189 px) fica toda no terceiro painel, sem tocar as outras regiões.

**9. Prévias da evidência pouco legíveis.** `docs/evidence/2026-11-19-figuras/imagens-vps/*.png`. Elas foram reduzidas a poucas cores (faixas visíveis no cinza) para caber em 300 KiB. A do abdome sobrepõe os dois itens (M28.01 i2 e M28.06 i4) no mesmo quadro, com selos "1" a "5" e "1" a "4" misturados. As posições batem com as minhas contas. Sugestão: uma prévia por item.

**10. `sourcePage` aponta para um arquivo que ainda não está na `main`.** `imagens.json`, linha 240, e as outras quatro entradas. O link da tela de créditos só abre depois do merge, e só se o repositório for público, o que não pude verificar (sem acesso remoto). A evidência também diz qual é a resposta da M29.04 i3, mas o caminho até ela é longo demais para importar.

**11. Autor sem parênteses (ressalva aceita).** `imagens.json`, linha 241. Fica registrada a pendência: escapar o autor no `ImageCreditsScreen.test.tsx` e só então voltar aos parênteses da V3, se o dono quiser.

**12. E-mail dos commits.** Os commits do lote (como todo o histórico) levam o e-mail de autor num domínio de empresa. Isso não identifica paciente e não é novo. Registro só para o dono: se esse domínio for o do serviço onde os exames foram feitos, "acervo próprio" mais o domínio indicam a instituição de origem. A decisão é dele.

**13. Conclusão da M29.04 promete reconhecer a falha, que agora só aparece em texto.** `m29.json`, linha 1286.
- "reconhece a faixa clara perto de metal como possível falha": depois da adaptação, isso só se pratica em descrições (i2, i4, i5 e checkpoint 2). A competência ("Dizer … o que a atrapalha") continua honesta.
- Sugestão: "…e reconhece, numa série descrita, a faixa clara perto de metal como possível falha."

**14. Números de teste desatualizados na evidência.** `imagens-vps.md`, linha 71: "453 passam, 2 falham". Depois do 134244db, a segunda falha (o `m26-aula-04.yaml` defasado) foi resolvida. Medi 454 passam e 1 falha, a conhecida.

## 4. Alvos medidos (por pixel, no JPEG final, na régua de 280 pt)

Calculei com as funções do app (`touchRect`, `badgeBoxes`, `labelBadgeBoxes`, carregadas por `scripts/content/load-app-contract.cjs`). Desenhei sobre cada JPEG as regiões, os pontos de 12 pt, os selos de 36 x 24 pt e as áreas de toque, e abri cada desenho.

| Item | Área de toque certa | O que há embaixo | Sobre as erradas |
|---|---|---|---|
| M28.06 i4, baço | 185 x 270 px (= região) | 87% tons médios (baço), 8% claro (costela), 5% escuro | 0% |
| M29.03 i2, ventrículos do FLAIR | 189 x 189 px | só o terceiro painel: ventrículos e substância em volta | 0% |
| M29.04 i3, gordura da direita | 290 x 189 px | região 100% escura (gordura apagada); o resto é fundo e parede | 0% |

Pontos dos três rotulares, todos sobre a estrutura que nomeiam, salvo o pâncreas (achado 2):
- **abdome**: fígado (190, 430), estômago (810, 430), baço (985, 670) e rim direito do paciente (335, 690), este à esquerda da vértebra, como o rótulo diz;
- **pelve**: sínfise (537, 272), sobre a fenda da articulação; cabeça do fêmur (200, 415); acetábulo (738, 470), em osso; cóccix (540, 700);
- **pescoço**: traqueia (455, 195), carótida (630, 263), jugular interna (278, 268) e vértebra (452, 380).

Em todos: nenhuma área de toque se sobrepõe e todas cabem no quadro. Orientação conferida nas cinco: a direita do paciente fica à esquerda de quem olha (fígado, rim direito e jugular direita à esquerda), e a frente fica no alto.

A supressão é o mesmo corte com e sem supressão, sem deslocamento visível entre os painéis: rins, vesícula, vasos e coluna no mesmo lugar. O T1 e o FLAIR são reformatados de volume 3D, como dizem a `modification` e o `descriptionFromSource`.

## 5. Itens alterados (comparados com 1e992e7b)

| Item | Continua válido? | O que mede agora | O que o aluno deixa de praticar na imagem | Recomendação |
|---|---|---|---|---|
| M28.01 i2 (rotular, 5 pontos) | Sim | O mesmo, no corte real | Nada | **Aceitar**, movendo o ponto do pâncreas (achado 2) |
| M28.01 conceito (sem `visual`), cena, i3, i4, conclusão, checkpoints, recuperação | Sim | O mesmo; "baço encostado na parede" e "nem todo corte mostra o pâncreas inteiro" são verdadeiros | Nada | **Aceitar** |
| M28.02 i2 (5 → 4 pontos) | Sim | Achar sínfise, cabeça, acetábulo e cóccix | Localizar bexiga e reto (só em parte, neste nível); eles seguem no cloze, no verdadeiro-ou-falso, nos checkpoints e na recuperação | **Aceitar**, trocando os pontos de lado (achado 1) |
| M28.02 i4, afirmação 4 ("entre a bexiga e o reto ficam órgãos que variam com o sexo") | Sim, continua verdadeira | A mesma ideia, sem o "vazio do esquema" | Nada | **Aceitar** |
| M28.02 objetivo, competência, conceito, conclusão | Sim; prometem só o que se pratica | — | — | **Aceitar** |
| M28.03 i2 (6 → 4 pontos) | Sim | Traqueia, carótida, jugular interna e vértebra | Achar a tireoide e o esôfago na imagem. As áreas de 44 pt não cabem: a tireoide fica a ~68 px da traqueia e o esôfago a ~90, com limite de 170. Os dois seguem no categorizar e no marcar | **Aceitar**; o istmo, no menor 4 |
| M28.03 objetivo, competência, conclusão | Sim; "situar" a tireoide e o esôfago é o que se pratica | — | — | **Aceitar** |
| M28.06 i4 (sem "Rim direito") | Sim, resposta continua o baço | Qual órgão fica atrás, junto à parede, à esquerda do paciente | O rim direito como distrator do erro de lado; o fígado continua cobrindo esse erro | **Aceitar** (menor 7) |
| M28.06 conceito | Sim | — | — | **Aceitar**; frase do gás opcional (menor 6) |
| M29.03 i2 (5 → 3 regiões) | Sim, resposta continua os ventrículos da terceira | Desempatar as duas imagens de líquido escuro pela substância branca | Tocar a gordura e a substância branca, regiões finas demais | **Aceitar**, com a frase do achado 3 |
| M29.04 i3 (pergunta e resposta mudaram) | Sim, resposta defensável e decidível só pela imagem: gordura clara à esquerda, apagada à direita, e nenhum texto diz qual é qual | Reconhecer na imagem real qual série tem supressão de gordura | Localizar a falha junto ao metal, que a imagem não tem; segue em texto (i2, i4, i5, checkpoint 2). A troca da resposta certa é permitida pela V5, porque a estrutura antiga não existe na imagem | **Aceitar**; conclusão no menor 13 |
| M29.04 cena e conceito ("abdome", "mesmo corte") | Sim, verdadeiros | — | — | **Aceitar** |
| M29.05 i1 (ajuda) | Sim | O mesmo | Nada | **Aceitar** |

Nenhum texto falso sobrando. "Esquema" e "desenho" restam só em três lugares:
- na recuperação de transferência da M28.02, que fala de "esquema de outro material";
- na M29.05, sobre `artefatos-de-rm`, que continua desenhada;
- no resumo da m28, sobre a coluna, que continua em esquema.

"Coxa" e "medula" de osso não aparecem mais nas aulas trocadas. "Medula" fica só para a medula espinhal do pescoço e do abdome, o que está correto. A tabela do guia de autoria mantém a descrição antiga do spec `supressao-de-gordura` ("coxa"), marcada "sem uso em aula", o que é verdadeiro.

## 6. Gerador Maestro (f88b41d1, 134244db)

- O teste novo percorre todas as atividades da trilha, lê o YAML gerado e exige `centerElement: true` em toda rolagem até "Aumentar …" ou "Diminuir …". Ele também exige que haja ao menos uma, para não passar no vazio.
- A execução vermelha está registrada em `vermelho-bancada.txt` e reprova pelo motivo previsto: `expected: true`.
- O roteiro `radiant-app/.maestro/figuras/m26-aula-04.yaml` ganhou só a linha `centerElement: true` na bancada de "Aumentar Distância".
- Os roteiros de `m28-aula-01` e `m28-avaliacao-01` trocaram só os rótulos acessíveis dos pontos (os `where` novos).
- Não rodei o Maestro (instrução). Não verifiquei se a opção `centerElement` funciona na versão do Maestro instalada.

## 7. Gates (worktree destacada em 134244db, Node 20.20.2)

- Verificador nas 40 unidades: **40 OK**.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs`: **455 testes, 454 passam, 1 falha**, a conhecida e alheia (`registerSource normalizes metadata for the pilot book`).
- `node scripts/content/build-rtg-batches.mjs --check`: `"ok": true`.
- `node scripts/qa/generate-rtg-maestro.mjs --check m28 m29`: ok.
- `node scripts/qa/figuras-no-simulador.mjs --check`: ok.
- `cd radiant-app && npx jest src/features/student-checkpoints src/features/settings src/features/lesson-flow/renderers`: **50 suítes, 706 testes, todos passam**. Isso inclui o `hotspotTouch.test.ts`, que agora conta 14 itens de imagem: os 8 anteriores mais os 6 deste lote (M28.01 i2, M28.02 i2, M28.03 i2, M28.06 i4, M29.03 i2 e M29.04 i3), com as guardas de selo valendo para eles.
- V7: os arquivos dos quatro commits estão todos em `arquivos-do-run-vps*.txt`, nenhum fora.
- Não rodei a suíte jest inteira nem o `npm run quality`. O controlador informou o gate completo verde: 297 suítes, 4612 testes.

## 8. O que o dono deve olhar no simulador

1. **M28.02 i2**: o selo 3 sobre a cabeça do fêmur do lado direito da figura (achado 1). Dá para ver "o osso que abraça a bola"?
2. **M28.01 i2**: o ponto 4 parece estar na faixa do pâncreas ou no vaso redondo logo abaixo (achado 2)?
3. **M29.03 i2**: no tema escuro, num quadro de ~99 pt de altura, dá para ver a substância branca mais escura que a cinzenta no FLAIR e mais clara no T1? Os selos sobre o lobo frontal atrapalham? A gordura escura do couro cabeludo no FLAIR chama atenção (achado 3)?
4. **M29.04 i3**: a faixa de gordura apagada da direita se distingue do fundo preto? Os selos entre as imagens confundem a qual imagem pertencem?
5. **M28.03 i2**: em ~280 x 207 pt, a carótida e a jugular se separam? O selo 4 sobre o canal da medula atrapalha?
6. **M28.06 i4**: o gás do cólon na borda parece pulmão (menor 6)?
7. **Tela de créditos**: as cinco entradas novas, o autor sem parênteses e o link da origem (achado 10).

## 9. Não consegui verificar

- **Anatomia fina** (leitura de IA): se o ponto 4 do abdome está no pâncreas ou na artéria mesentérica superior; se o osso pequeno da linha média, atrás, é o cóccix; se atrás da sínfise há bexiga ou só próstata; em que nível do pescoço fica o istmo; se o nível do pescoço é C6 ou C7.
- **Anonimização dos DICOM no servidor**: só li o que o relatório da amostra declara (0 de 1567 com identificador residual). Por instrução, não fui ao VPS. O que conferi foram os JPEG e os textos versionados.
- **Direito e consentimento**: a declaração do dono (V1) é a fonte. Não há documento a conferir.
- **Se o repositório é público** e se o `sourcePage` abre (sem acesso remoto).
- **Comportamento do app de fato** (selos, véu das regiões, legibilidade no tema escuro): não rodei simulador nem Metro. As minhas contas usam as mesmas funções do app.
- **Maestro**: não executei os roteiros regerados.

## Correções aplicadas (2026-11-22)

- **1 (pelve, selo sobre a cabeça do fêmur):** aplicado. Cabeça do fêmur em x 0.7818, y 0.4824 ("à direita da figura") e acetábulo em x 0.3, y 0.5529 ("do lado esquerdo da figura"), com as respostas certas intactas. Prévia regerada e aberta: o selo 3 cai na gordura do assoalho pélvico, o ponto do acetábulo fica no osso, sem sobreposição.
- **2 (pâncreas na emenda com a artéria):** aplicado. Ponto em x 0.5682, y 0.4547; prévia aberta, sobre a faixa clara.
- **3 (gordura apagada no FLAIR):** aplicado. O conceito da m29-03 ganhou a frase sobre a gordura escura da terceira imagem e a supressão de gordura "assunto da próxima aula" (dentro de 110 palavras; verificador OK).
- **4 (istmo):** aplicado. "fica em outro nível do pescoço". O selo 4 sobre o canal da medula fica registrado para o simulador (não muda resposta nem região).
- **5 (região da supressão 8 px abaixo da faixa):** não aplicado, por decisão consciente: a região foi deslocada de propósito para a área de toque de 44 pt caber no quadro de 101 pt (ver "Medidas" em `imagens-vps.md`); a resposta não muda, e o parecer o marca como opcional. Os selos entre as imagens ficam para a observação no simulador.
- **6 (gás do cólon):** aplicado, com a frase "as manchas pretas dele são gás dentro do intestino" no conceito da m28-06.
- **7 (rim direito dentro da caixa do fígado):** registro, sem mudança: a região "Rim direito" saiu por sobreposição de áreas, e o retorno genérico continua verdadeiro.
- **8 (selos sobre o lobo frontal):** registro, sem mudança, para o simulador.
- **9 (prévias):** aplicado em parte. O abdome ficou em dois quadros lado a lado no mesmo arquivo (m28-01 i2 e m28-06 i4); uma prévia por item em arquivo próprio exigiria arquivo fora da lista do run. Todas regeradas a 900 px, 96 cores, abaixo de 300 KiB, e abertas.
- **10 (`sourcePage` antes do merge):** registro: o link só abre depois do merge e se o repositório for público; não verificável aqui.
- **11 (autor sem parênteses):** pendência mantida: escapar o autor em `ImageCreditsScreen.test.tsx` (fora da lista) e só então voltar aos parênteses da V3, se o dono quiser.
- **12 (e-mail dos commits):** decisão do dono; nada feito.
- **13 (conclusão da m29-04):** aplicado: "reconhece, numa série descrita, a faixa clara perto de metal como possível falha."
- **14 (números de teste):** aplicado: 455 testes, 454 passam, 1 falha (a conhecida).
