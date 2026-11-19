# Trilha dobrada, fase C: unidades irmãs (plano de produção)

> **Para quem executa:** este plano é de conteúdo, não de código. Use
> superpowers:subagent-driven-development com as adaptações abaixo: o "teste" de uma
> unidade é o verificador, o gerador, o inventário e o gate do app; a "revisão" é um
> parecer independente contra as fontes. O controlador é dono do run do Loop, dos
> commits e da admissão; autor e revisor só escrevem os arquivos que o brief nomeia.

**Criado em 2026-11-19** pelo Claude controlador, sob a delegação do dono de
2026-11-18. Não autoriza merge, build nem envio a loja.

**Objetivo:** escrever as 24 unidades irmãs (152 aulas) nos formatos da fase B, em seis
lotes de quatro, cada lote numa PR em rascunho empilhada na anterior.

**Como:** cada lote começa pelos diagramas que as aulas vão mostrar, passa uma unidade
piloto pelo caminho inteiro e só depois escreve as outras três. Autor em Sonnet,
revisor em Opus, no máximo três agentes de autoria ou desenho ao mesmo tempo.

**Especificação:** [`2026-11-18-trilha-dobrada-design.md`](../specs/2026-11-18-trilha-dobrada-design.md),
seções 3, 5, 6, 8.1 e 8.6. Formatos e réguas:
[guia de autoria](../../content/2026-11-05-guia-de-autoria-rtg-2026.md), seções 1 a 6.

## Restrições que valem para toda unidade

- Núcleo: 6 aulas. Ramo: 7 aulas. Identificador `m\d{2}` ou `s-[a-z]{2}`.
- Toda aula tem um passo visual (conceito com `visual`, ou `hotspot`, `label`,
  `risk-hunt`, `comparison`, `bench`, `parameter-lab`).
- Toda aula tem ao menos uma `multiple-choice` e, com `visual` no conceito, no máximo
  duas interações de múltipla escolha ou decisão de caso.
- A unidade usa quatro ou mais famílias além de múltipla escolha e decisão de caso.
- Conceito com `visual`: até 80 palavras.
- Nenhuma menção a lei, norma, órgão ou conselho de país. Fonte gratuita na web, lida.
- O aluno é estudante em simulação supervisionada: nenhum item pede diagnóstico,
  laudo, escolha de exame ou técnica, conduta clínica nem cálculo de dose de paciente.
- A irmã não repete a unidade atual: o autor lê a unidade atual inteira antes de
  escrever, e nenhuma competência ou enunciado se repete. Onde o tema encosta, a
  irmã aprofunda ou muda de contexto.
- Imagem real só CC0 ou CC BY conferida por arquivo. Nunca imagem gerada por IA.
  Diagrama sem texto dentro, com as cores de `diagramPalette.ts`.

## O que pode dar errado e nenhuma régua pega

1. **Diagrama de anatomia errado.** O verificador confere forma e cor, não verdade. O
   autor do diagrama olha o PNG; o controlador olha de novo; o revisor da unidade
   recebe os PNG e confere cada rótulo contra a figura.
2. **Alvo no lugar errado.** A régua de toque garante 44 pt, não que o ponto esteja
   sobre a estrutura. O revisor confere cada `x`, `y` contra o PNG com os alvos
   marcados (`radiant-app/scripts/render-diagrams.mjs` e uma sobreposição dos alvos).
3. **Sobreposição com a unidade atual.** O revisor recebe a lista de competências da
   unidade atual e reprova a aula que a repete.
4. **Formato novo como enfeite.** Cada interação nova pede recuperar ou decidir algo;
   `blitz` e `conversation` não contam como passo visual e não substituem a prática.
5. **Fato sem fonte lida.** Vale a lição 14 do guia: fato não confirmado em página
   lida sai da unidade.

## Caminho de um lote

### Tarefa 1: lista aula a aula do lote

**Artefato:** a tabela do lote neste arquivo (a do lote 1 está abaixo).

- [ ] Ler título, competência e conceito de cada aula da unidade atual e das vizinhas
  que encostam no tema.
- [ ] Escrever, por aula: título, o que o aluno passa a conseguir, a figura e os
  formatos pedidos.
- [ ] Conferir: nenhum título ou competência repete a unidade atual; cada aula tem
  figura; a soma de formatos da unidade dá quatro famílias ou mais.

### Tarefa 2: diagramas do lote

**Artefatos:** `radiant-app/src/ui/diagrams/specs/<id>.ts` (um por diagrama), registro
em `diagramRegistry.ts`, linha no catálogo do guia.

- [ ] Um agente por unidade desenha os diagramas dela pelo brief de autor de laços
  (parados na maioria; laço só onde o movimento ensina). Não edita o registro.
- [ ] O controlador registra, roda `diagramRegistry.test.ts` e
  `node radiant-app/scripts/render-diagrams.mjs`, converte em PNG e olha cada um.
- [ ] Diagrama que não ensina sem legenda, ou com erro de anatomia ou de física, volta
  ao autor com o defeito descrito. Diagrama que não fica bom em duas rodadas sai, e a
  aula troca de figura.

Passa quando: teste do registro verde, 0 texto dentro, PNG visto pelo controlador.

### Tarefa 3: unidade piloto, do rascunho ao gate

**Artefatos:** `content-manifest/rtg-2026/aulas/<id>.json`, parecer em
`docs/evidence/2026-11-19-unidades-irmas/<id>.md`, lote gerado, roteiros do Maestro.

- [ ] Autor escreve o rascunho fora de `aulas/` e roda o verificador até `OK`.
- [ ] Revisor independente confere fatos, limites, itens, figuras e sobreposição, e
  corrige no arquivo. Resultado na última linha do parecer.
- [ ] Admissão pelo controlador: copiar para `aulas/`, inserir o id em
  `RTG_UNIT_ORDER` logo depois da unidade atual, atualizar o teste da ordem, rodar
  `node scripts/content/build-rtg-batches.mjs`, `node scripts/qa/generate-rtg-maestro.mjs`,
  `node scripts/content/rtg-inventory.mjs`.
- [ ] Gate: `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality` no Node 20, saída 0.
- [ ] Teste da regra de acesso (meta 7 da especificação), uma vez, no lote 1: quem
  concluiu a unidade atual e não abriu a seguinte passa pela irmã; quem já começou
  mais adiante mantém o acesso.

Passa quando: verificador `OK`, parecer "aprovado com correções", gate 0, inventário
sem aula nova sem visual.

### Tarefa 4: as outras três unidades

Mesmo caminho da tarefa 3, com as lições do piloto no brief. Até três autores ao mesmo
tempo; revisor depois de cada autor; admissão uma unidade por vez.

### Tarefa 5: fechar o lote

- [ ] Gate inteiro de novo com as quatro unidades, testes de conteúdo
  (`node --test scripts/content/*.test.mjs`), `build-rtg-batches.mjs --check`.
- [ ] `docs/STATUS.md`, roadmap, evidência do lote com os números medidos.
- [ ] Push e PR em rascunho sobre a branch do lote anterior (o lote 1, sobre a fase B).

## Lote 1: m17, m18, m19, m20

Ordem na trilha depois do lote: m01, **m17**, m02, **m18**, m03, **m19**, m15, **m20**,
m04, e o resto como hoje. Piloto: **m17**.

Formatos pedidos são o mínimo; o autor completa as cinco interações de cada aula
dentro das réguas. "MC" é múltipla escolha.

### M17 — Segurança do paciente na sala (irmã da M01)

A M01 ensina o papel do tecnólogo, identificação e comunicação, higiene no percurso,
sinais de pausa, consentimento e privacidade. A M17 fica dentro da sala de exame e
trata do que pode ferir o paciente ali.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Quando a identificação falha | Agir quando pulseira, pedido e fala do paciente não batem, ou quando o paciente não pode responder | `conferencia-de-identidade` (novo) | `label`, `conversation`, MC |
| 02 | Antes que alguém caia | Reconhecer na sala o que favorece queda e corrigir antes de mover o paciente | `transferencia-maca-mesa` (novo) | `risk-hunt`, `categorize`, MC |
| 03 | Passar da maca para a mesa | Ordenar uma transferência em equipe, cuidando de sonda, dreno e acesso | `transferencia-maca-mesa` | `ordering`, `hotspot`, MC |
| 04 | Limpar entre um paciente e outro | Apontar as superfícies de contato da sala e a ordem da limpeza | `pontos-de-contato-da-sala` (novo) | `hotspot` ou `label`, `multi-select`, MC |
| 05 | Sinais de alerta na sala | Reconhecer mudança no estado do paciente, parar, chamar ajuda e saber onde está cada recurso | `itens-de-emergencia-da-sala` (novo) | `label`, `blitz`, `conversation`, MC |
| 06 | Um turno seguro | Integrar as cinco aulas numa sala nova | `itens-de-emergencia-da-sala` | `hotspot`, `conversation`, MC |

Mudança na revisão (2026-11-19): a aula 06 pedia `sala-com-riscos`, que cobra proteção
radiológica antes de a M04 ensiná-la; trocou de figura. A aula 05 trocou a decisão de
caso por uma conversa, porque o texto alternativo do diagrama entregava o rótulo e o
conceito ficou sem `visual`.

Limite próprio: o estudante reconhece, para e chama; não avalia sinais vitais como
conduta, não medica, não decide sozinho se o exame continua.

### M18 — Esqueleto, articulações e marcos de superfície (irmã da M02)

A M02 ensina posição de referência, lateralidade, planos, cavidades e regiões. A M07
ensina posicionamento dos membros e da coluna. A M18 dá os nomes e as partes do
esqueleto que as duas pressupõem.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Esqueleto axial e apendicular | Separar os ossos nos dois grupos e dizer a função de cada grupo | `esqueleto-axial-apendicular` (novo) | `visual`, `categorize`, `hotspot`, MC |
| 02 | Tipos de osso e o osso longo | Classificar ossos pela forma e nomear as partes de um osso longo | `osso-longo` (novo) | `label`, `categorize`, MC |
| 03 | A coluna por regiões | Nomear as regiões da coluna, quantas vértebras cada uma tem e o sentido das curvaturas | `coluna-regioes` (novo) | `label`, `cloze`, MC |
| 04 | Articulações e movimentos | Distinguir os tipos de articulação e nomear os movimentos | `articulacao-sinovial` (novo) | `label`, `matching`, `blitz`, MC |
| 05 | Marcos de superfície | Localizar os marcos palpáveis do tronco e da pelve | `marcos-de-superficie` (novo) | `label`, `hotspot`, MC |
| 06 | Do marco à região | Usar marcos para achar uma região, avisando o paciente antes de tocar | `marcos-de-superficie` | `hotspot`, `conversation`, MC |

Limite próprio: nível vertebral de marco só com fonte lida e com "em geral"; a aula não
escolhe incidência nem ponto de centralização de exame.

### M19 — Eletricidade, tubo e gerador (irmã da M03)

A M03.05 ensina tensão, corrente e campo. A M04.01 ordena a cadeia do filamento ao
detector. A M06.03 ensina os parâmetros de exposição. A M19 abre o equipamento: de onde
vem a alta tensão e o que acontece dentro do tubo.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Da rede ao tubo | Nomear os blocos do gerador e o papel de cada um | `circuito-do-gerador` (novo) | `label`, `ordering`, MC |
| 02 | Elevar e retificar | Explicar por que a tensão é elevada e retificada e o que é ondulação | `retificacao-de-onda` (novo) | `visual`, `cloze`, `true-false`, MC |
| 03 | O cátodo | Relacionar filamento, emissão de elétrons e corrente do tubo | `tubo-raios-x`, `tubo-emitindo` | `label`, `visual`, `matching`, MC |
| 04 | O ânodo e o calor | Explicar o ânodo giratório, o ponto focal e para onde vai a energia | `anodo-giratorio` (novo), `foco-e-penumbra` | `visual`, `categorize`, `blitz`, MC |
| 05 | O espectro do feixe | Distinguir radiação de freamento e característica e prever, em sentido, o efeito de kV, mAs e filtração | `espectro-de-raios-x` (novo) | `label`, `true-false`, MC |
| 06 | Cuidar do tubo | Reconhecer sinal de sobrecarga ou falha, parar e avisar | `anodo-giratorio` ou `tubo-raios-x` | `hotspot`, `conversation`, decisão de caso, MC |

Limite próprio: relações só em sentido ("sobe", "desce"), sem fórmula de carga térmica;
aquecimento do tubo segue o fabricante e o serviço.

### M20 — Sistemas do corpo em funcionamento (irmã da M15)

A M15 vai da célula aos níveis de organização e lista os sistemas. A M08 trata de tórax
e abdome como imagem. A M20 ensina como cada sistema funciona, no que importa para
quem adquire a imagem.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Respirar | Descrever o que diafragma e costelas fazem na inspiração e na expiração | `respiracao-diafragma` (novo, laço) | `visual`, `ordering`, `true-false`, MC |
| 02 | Coração e circulação | Seguir o sangue pelas duas circulações | `circulacao-dupla` (novo, laço) | `visual`, `ordering`, `cloze`, MC |
| 03 | O caminho do alimento | Ordenar os órgãos do tubo digestivo e dizer o papel de cada um | `trato-digestivo` (novo) | `label`, `ordering`, MC |
| 04 | Filtrar e eliminar | Nomear rins, ureteres, bexiga e uretra e o caminho da urina | `sistema-urinario` (novo) | `label`, `matching`, MC |
| 05 | Comando e regulação | Separar sistema nervoso central e periférico e distinguir sinal nervoso de hormônio | `sistema-nervoso` (novo) | `hotspot`, `categorize`, `blitz`, MC |
| 06 | Sistemas juntos no exame | Ligar respiração, movimento e preparo ao que muda numa aquisição, sem escolher conduta | `respiracao-diafragma` ou `trato-digestivo` | `hotspot`, `conversation`, MC |

Limite próprio: nenhuma aula ensina doença nem sinal de doença; preparo e jejum são "o
serviço define".

### Diagramas novos do lote 1 (18)

| Unidade | id | Tipo | O que mostra |
| --- | --- | --- | --- |
| m17 | `conferencia-de-identidade` | parado | Paciente na maca com pulseira no punho, profissional com a folha do pedido, tela do sistema ao lado |
| m17 | `transferencia-maca-mesa` | parado | Maca encostada na mesa de exame vista de lado: rodas com e sem freio, grade abaixada, vão entre as duas, prancha de transferência, suporte de soro com a linha esticada |
| m17 | `pontos-de-contato-da-sala` | parado | Sala de exame com as superfícies que o paciente e a equipe tocam: mesa, receptor vertical com apoio, painel do tubo, maçaneta, teclado |
| m17 | `itens-de-emergencia-da-sala` | parado | Parede e canto da sala: carrinho de emergência, saída de oxigênio, botão de chamada, telefone, porta |
| m18 | `esqueleto-axial-apendicular` | parado | Esqueleto de frente, simplificado, com o eixo (crânio, coluna, costelas, esterno) numa cor e membros e cinturas em outra |
| m18 | `osso-longo` | parado | Osso longo em corte: duas epífises, diáfise, cavidade medular, cartilagem articular, linha de crescimento |
| m18 | `coluna-regioes` | parado | Coluna de lado com as cinco regiões em cores alternadas e as curvaturas visíveis |
| m18 | `articulacao-sinovial` | parado | Articulação sinovial em corte: dois ossos, cartilagem, cavidade, cápsula |
| m18 | `marcos-de-superficie` | parado | Tronco e pelve de frente, em contorno, com os marcos ósseos desenhados por baixo |
| m19 | `circuito-do-gerador` | parado | Blocos em linha: rede, transformador, retificador, tubo, e o circuito do filamento à parte |
| m19 | `retificacao-de-onda` | parado | Três traçados empilhados: onda alternada, onda retificada com ondulação grande, tensão quase constante |
| m19 | `anodo-giratorio` | laço | Disco do ânodo girando sob o feixe de elétrons; a pista focal aquecida se espalha pela borda |
| m19 | `espectro-de-raios-x` | parado | Curva contínua com dois picos estreitos sobre ela, num par de eixos sem texto |
| m20 | `respiracao-diafragma` | laço | Tórax de frente: o diafragma desce e os pulmões aumentam, depois volta |
| m20 | `circulacao-dupla` | laço | Coração no centro, um circuito pequeno até os pulmões e um grande até o corpo, com o sangue correndo nas duas voltas |
| m20 | `trato-digestivo` | parado | Tronco em contorno com esôfago, estômago, intestino delgado e grosso, fígado e pâncreas |
| m20 | `sistema-urinario` | parado | Dois rins, dois ureteres, bexiga e uretra, em contorno de tronco |
| m20 | `sistema-nervoso` | parado | Silhueta com encéfalo e medula numa cor e nervos saindo para o tronco e os membros em outra |

## Lote 2: m21, m22, m23, m24

Aberto em 2026-11-19, com o ok do dono ("Sim, lote 2"). Ordem na trilha depois do lote:
…, m04, **m21**, m05, **m22**, m06, **m23**, m07, **m24**, m08, e o resto como está.
Piloto: **m21**.

### M21 — Radiobiologia e dosimetria (irmã da M04)

A M04 ensina interações, efeitos com e sem limiar, os três princípios e os limites. A
M15 ensina por que tecidos respondem diferente. A M21 mostra o que acontece na célula,
as grandezas que medem dose e como a dose da equipe é acompanhada.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Do fóton ao DNA | Distinguir ação direta e indireta e quebra simples e dupla do DNA | `dano-ao-dna` (novo) | `label`, `ordering`, MC |
| 02 | Três grandezas de dose | Dizer o que dose absorvida, equivalente e efetiva respondem, com as unidades | `grandezas-de-dose` (novo) | `visual`, `matching`, `categorize`, MC |
| 03 | O dosímetro pessoal | Dizer onde cada dosímetro fica, o que ele mede e o que não fazer com ele | `dosimetro-no-corpo` (novo) | `label`, `true-false`, MC |
| 04 | O que o equipamento informa | Ler o produto dose-área como indicador do equipamento, sem tratá-lo como dose do paciente | `produto-dose-area` (novo) | `visual`, `cloze`, `blitz`, MC |
| 05 | Distância e blindagem em números | Prever o efeito de dobrar a distância e de somar camadas de blindagem | `inverso-do-quadrado`, `blindagem-camadas` | `parameter-lab` (dois), MC |
| 06 | Ler um registro de dose ocupacional | Reconhecer leitura fora do habitual, parar e levar ao responsável pela proteção | `dosimetro-no-corpo` | `hotspot`, `conversation`, MC |

Limite próprio: nenhuma conta de dose de paciente; nenhum prognóstico; valor numérico só
o que a ICRP 103 ou a IAEA dão em página lida; onde usar o dosímetro com avental é "o
serviço define".

### M22 — Processamento, exibição e informática da imagem (irmã da M05)

A M05 ensina a cadeia do detector ao arquivo, pixel e matriz, as três dimensões de
qualidade, janela e os níveis do DICOM. A M22 abre o processamento, o monitor e o
caminho da informação.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Histograma e curva de apresentação | Explicar como o sistema acha a faixa de interesse e o que acontece quando ele erra o campo | `histograma-e-lut` (novo) | `label`, `true-false`, MC |
| 02 | Realçar e suavizar | Distinguir realce de borda e suavização e o preço de cada um | `realce-e-suavizacao` (novo) | `visual`, `categorize`, `matching`, MC |
| 03 | O monitor | Conferir um padrão de teste e reconhecer luz ambiente e sujeira como problema | `monitor-e-padrao-de-teste` (novo) | `hotspot`, `multi-select`, MC |
| 04 | O caminho do pedido | Ordenar o percurso do pedido à imagem arquivada e dizer onde nasce uma troca de dados | `fluxo-ris-pacs` (novo) | `label`, `ordering`, MC |
| 05 | Comprimir e copiar | Distinguir compressão com e sem perda e cuidar da identificação ao exportar | `compressao-de-imagem` (novo) | `visual`, `cloze`, `blitz`, MC |
| 06 | Quando o sistema para | Seguir a contingência do serviço sem improvisar identificação | `fluxo-ris-pacs` | `hotspot`, `conversation`, MC |

Limite próprio: o estudante não corrige cadastro nem une estudos sozinho; taxa de
compressão e rotina de contingência são "o serviço define"; nenhum item julga achado
clínico pela imagem.

### M23 — Leitura crítica da imagem: artefatos, repetição e correção (irmã da M06)

A M06 ensina geometria, parâmetros, colimação, movimento e critérios. A M23 treina o
olhar: um roteiro de leitura, os artefatos mais comuns e o que fazer com uma imagem
rejeitada. As "radiografias" são esquemas desenhados, não imagens reais.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Um roteiro de leitura | Percorrer identificação, marcador, cobertura, posição, exposição e artefato sempre na mesma ordem | `radiografia-roteiro` (novo) | `label`, `ordering`, MC |
| 02 | O que não é do paciente | Achar numa imagem os objetos que deveriam ter saído antes da exposição | `artefatos-de-objeto` (novo) | `risk-hunt`, `categorize`, MC |
| 03 | Marcas do equipamento | Distinguir linha morta, corte de grade e imagem residual | `artefatos-do-detector` (novo) | `label`, `matching`, MC |
| 04 | Clara, escura ou ruidosa | Ligar pouca e muita exposição ao que se vê, na bancada | bancada de exposição | `bench`, `true-false`, MC |
| 05 | Cortou ou sobrou campo | Ajustar o campo à região e reconhecer anatomia cortada | bancada de colimação, `radiografia-roteiro` | `bench`, `hotspot`, MC |
| 06 | Repetir ou não | Registrar a causa de uma rejeição e decidir com a equipe | `artefatos-de-objeto` | `hotspot`, `conversation`, `blitz`, MC |

Limite próprio: qualidade técnica não é diagnóstico; a decisão de repetir é da equipe;
nenhum valor de índice de exposição como regra geral.

### M24 — Membro inferior, pelve e coluna (irmã da M07)

A M07 liga marcos a incidências introdutórias e a critérios. A M18 dá os nomes gerais do
esqueleto. A M24 desce ao osso: as partes que o critério de cada incidência cita.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Pé e tornozelo | Nomear os grupos de ossos do pé e os ossos do tornozelo | `ossos-do-pe` (novo) | `label`, `categorize`, MC |
| 02 | Joelho | Nomear as partes do fêmur distal, da tíbia proximal, a fíbula e a patela | `joelho-frente-e-perfil` (novo) | `label`, `matching`, MC |
| 03 | Fêmur proximal e quadril | Nomear cabeça, colo, trocânteres e acetábulo | `femur-proximal-e-quadril` (novo) | `label`, `cloze`, MC |
| 04 | A pelve por partes | Nomear ílio, ísquio, púbis, sacro e as articulações da pelve | `pelve-de-frente` (novo) | `label`, `hotspot`, MC |
| 05 | Uma vértebra de perto | Nomear as partes de uma vértebra e dizer em que as regiões diferem | `vertebra-tipica` (novo) | `label`, `categorize`, `blitz`, MC |
| 06 | Do pedido à região | Dizer que estruturas uma região pedida inclui e pedir apoio diante de limitação | `pelve-de-frente` ou `joelho-frente-e-perfil` | `hotspot`, `conversation`, MC |

Limite próprio: a aula não escolhe incidência nem ângulo; não repete os critérios da
M07; suspeita de fratura é "não mover, pedir apoio".

### Diagramas novos do lote 2 (17)

| Unidade | id | Tipo | O que mostra |
| --- | --- | --- | --- |
| m21 | `dano-ao-dna` | parado | Trecho de DNA com um fóton atingindo a fita (ação direta), outro atingindo a água ao lado e gerando um radical que chega à fita (indireta), uma quebra simples e uma quebra dupla |
| m21 | `grandezas-de-dose` | parado | Três painéis lado a lado: energia depositada num bloco de tecido; o mesmo bloco com dois tipos de radiação pesando diferente; um corpo com órgãos de pesos diferentes |
| m21 | `dosimetro-no-corpo` | parado | Profissional de frente com avental: dosímetro no tórax, dosímetro de anel na mão, dosímetro perto do olho, e um dosímetro de referência guardado num quadro fora da sala |
| m21 | `produto-dose-area` | parado | Tubo e colimador com a câmara de medição na saída; dois campos, um pequeno e um grande, e o paciente mais abaixo |
| m22 | `histograma-e-lut` | parado | Histograma em barras com três regiões (colimação, anatomia, fora do corpo) e a faixa de interesse marcada; ao lado, a curva de conversão |
| m22 | `realce-e-suavizacao` | parado | Três perfis de uma borda empilhados: original, realçado com ultrapassagem nos dois lados, suavizado com a rampa mais larga |
| m22 | `monitor-e-padrao-de-teste` | parado | Monitor com padrão de teste: degraus de cinza, um quadrado quase preto dentro do preto e um quase branco dentro do branco, pares de linhas; uma janela ao fundo refletindo na tela |
| m22 | `fluxo-ris-pacs` | parado | Blocos ligados por setas: cadastro e pedido, lista de trabalho, equipamento, arquivo de imagens, estação de visualização |
| m22 | `compressao-de-imagem` | parado | A mesma grade de pixels três vezes: original, comprimida sem perda (idêntica) e comprimida com perda forte (blocos visíveis) |
| m23 | `radiografia-roteiro` | parado | Esquema de radiografia de tórax em tons de cinza: etiqueta de identificação num canto, marcador de lado, bordas de colimação, campos pulmonares, coluna e costelas |
| m23 | `artefatos-de-objeto` | parado | O mesmo esquema de tórax com colar, botão de roupa, eletrodo com fio e trança de cabelo sobre a imagem |
| m23 | `artefatos-do-detector` | parado | Esquema de radiografia com uma linha fina vertical sem sinal, uma faixa lateral mais clara que escurece para o centro (corte de grade) e o contorno fraco de outra anatomia (imagem residual) |
| m24 | `ossos-do-pe` | parado | Pé visto de cima: falanges, metatarsos e tarso em cores diferentes, com calcâneo e tálus destacados |
| m24 | `joelho-frente-e-perfil` | parado | Joelho de frente e de perfil lado a lado: fêmur distal com côndilos, tíbia com platô, fíbula e patela |
| m24 | `femur-proximal-e-quadril` | parado | Quadril de frente: acetábulo, cabeça, colo, trocânter maior, trocânter menor e diáfise do fêmur |
| m24 | `pelve-de-frente` | parado | Pelve de frente: ílio, ísquio e púbis em cores diferentes, sacro, articulações sacroilíacas, sínfise púbica e forames obturados |
| m24 | `vertebra-tipica` | parado | Vértebra lombar vista de cima: corpo, pedículos, lâminas, processos transversos, processo espinhoso e forame vertebral |

## Lote 3: m25, m26, m27, m28

Aberto em 2026-11-19. O dono respondeu "Radiografias reais" à pergunta sobre usar
imagem de acervo aberto neste lote. Ordem na trilha depois do lote: …, m08, **m25**,
m09, **m26**, m16, **m27**, m10, **m28**, m11, e o resto como está.

**Como a radiografia real entra.** Pelo procedimento de 2026-11-06 (prompt de
continuidade, seção "Imagens radiográficas"): só Wikimedia Commons, só CC0 ou CC BY
lida na página do arquivo, sem identificação de paciente, com projeção e região ditas
na descrição; arquivo reduzido a 1200 px e cerca de 150 KB, registrado em
`content-manifest/rtg-2026/imagens.json`. O item só afirma o que a descrição do acervo
sustenta. Por isso a imagem real serve aqui para reconhecer projeção, plano, nível e
orientação (`comparison`), e o rótulo de anatomia fina continua em diagrama: um modelo
de IA não é fonte para dizer onde está uma estrutura numa radiografia.

### M25 — Crânio, face, exame no leito e trauma (irmã da M08)

A M08.04 ensina násio, PA e perfil do crânio em texto; a M08.05, o tórax em AP no
leito. A M25 dá os ossos e as linhas de referência da cabeça e trata do exame fora da
sala e no trauma.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Ossos do crânio e da face | Nomear os ossos vistos de perfil | `cranio-de-perfil-ossos` (novo) | `label`, `categorize`, MC |
| 02 | Linhas e planos da cabeça | Nomear as linhas de referência usadas para alinhar a cabeça | `linhas-do-cranio` (novo) | `label`, `matching`, MC |
| 03 | De frente ou de perfil | Reconhecer a projeção numa radiografia de crânio | radiografias reais de crânio | `comparison`, `true-false`, MC |
| 04 | Seios da face e órbitas | Localizar os quatro grupos de seios e as órbitas | `seios-da-face` (novo) | `label`, `cloze`, MC |
| 05 | O aparelho móvel no leito | Organizar o exame no leito: aviso, distância, alinhamento e quem fica | `raio-x-movel-no-leito` (novo) | `risk-hunt`, `ordering`, MC |
| 06 | Trauma: a imagem sem mover | Trabalhar com colar e prancha no lugar e com a equipe no comando | `trauma-raio-horizontal` (novo) | `hotspot`, `conversation`, MC |

Limite próprio: a aula não escolhe incidência nem ângulo; colar, prancha e imobilização
não saem pela mão do estudante; nenhuma leitura de fratura.

### M26 — Exames contrastados e fluoroscopia (irmã da M09)

A M09 ensina preparo, triagem, cuidado e intercorrência com contraste. A M26 ensina o
equipamento de fluoroscopia e o que cada estudo contrastado percorre.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Dois meios, dois caminhos | Distinguir contraste de bário e iodado e o caminho de cada um no corpo | `contraste-no-corpo` (novo); radiografia real com contraste, se houver com licença | `visual`, `categorize`, MC |
| 02 | A cadeia da fluoroscopia | Nomear tubo, receptor, monitor e pedal e dizer o que cada um faz | `fluoroscopia-cadeia` (novo) | `label`, `ordering`, MC |
| 03 | Pulsar e reter a imagem | Explicar como pulso, última imagem retida e tempo de pedal mudam a exposição | `fluoroscopia-pulsada` (novo, laço) | `visual`, `true-false`, `blitz`, MC |
| 04 | Onde ficar na sala | Achar os pontos de mais radiação espalhada e as barreiras | `sala-de-fluoroscopia-espalhada` (novo), `inverso-do-quadrado` | `risk-hunt`, `parameter-lab`, MC |
| 05 | O tubo digestivo com contraste | Ordenar o percurso de cada estudo e o que cabe ao estudante preparar | `trato-digestivo` | `hotspot`, `ordering`, MC |
| 06 | O trato urinário e a equipe | Seguir as fases de um estudo urinário e comunicar o que vê | `sistema-urinario` | `hotspot`, `conversation`, MC |

Limite próprio: o estudante não prescreve, não escolhe, não prepara dose nem administra
contraste; preparo é "o protocolo do serviço define"; nenhuma leitura de achado.

### M27 — Criança, idoso e gestante na aquisição (irmã da M16)

A M16 ensina a adaptar diante de dor, falta de ar, gestação possível e isolamento. A
M27 trata de três públicos cujo cuidado muda a sala inteira.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Falar com a criança e com quem a acompanha | Ajustar a explicação à idade e combinar o papel do acompanhante | `contencao-pediatrica` (novo) | `hotspot`, `conversation`, MC |
| 02 | Segurar e imobilizar | Dizer quem pode segurar, com que proteção, e quando o apoio basta | `contencao-pediatrica` | `risk-hunt`, `categorize`, MC |
| 03 | Campo pequeno, tempo curto | Ajustar o campo ao corpo da criança e reconhecer o campo grande demais | `colimacao-pediatrica` (novo); radiografias reais de mão de criança e de adulto, se houver com licença | `hotspot`, `comparison` ou `true-false`, MC |
| 04 | O paciente idoso | Reconhecer pele frágil, audição, visão e equilíbrio como parte do posicionamento | `idoso-apoios-e-riscos` (novo) | `risk-hunt`, `multi-select`, MC |
| 05 | A gestante com exame indicado | Dizer o que muda na sala quando a equipe decidiu fazer o exame | `gestante-campo-e-feixe` (novo) | `visual`, `cloze`, `blitz`, MC |
| 06 | Três pacientes, três adaptações | Integrar as cinco aulas | `idoso-apoios-e-riscos` ou `colimacao-pediatrica` | `hotspot`, `conversation`, MC |

Limite próprio: quem decide fazer, adiar ou trocar o exame é a equipe; proteção de
contato é "o serviço define"; nenhuma conta de dose; contenção nunca é força.

### M28 — Anatomia seccional II: abdome, pelve, pescoço e coluna (irmã da M10)

A M10 ensina a navegar por cortes e localiza coração, fígado, rins, aorta e cava. A M28
completa o mapa: abdome superior, pelve, pescoço e coluna, e os três planos.

| Aula | Título | O aluno passa a conseguir | Figura | Formatos pedidos |
| --- | --- | --- | --- | --- |
| 01 | Abdome superior em corte | Localizar fígado, baço, estômago, pâncreas, rins e grandes vasos num corte | `corte-abdome-superior` (novo) | `label`, `matching`, MC |
| 02 | Pelve em corte | Localizar bexiga, reto, cabeças do fêmur e ossos da pelve num corte | `corte-pelve` (novo) | `label`, `cloze`, MC |
| 03 | Pescoço em corte | Localizar via aérea, esôfago, tireoide, vasos e vértebra num corte | `corte-pescoco` (novo) | `label`, `categorize`, MC |
| 04 | A coluna em dois planos | Relacionar corpo, disco e canal vertebral no plano sagital e no axial | `coluna-sagital-e-axial` (novo), `vertebra-tipica` | `label`, `matching`, MC |
| 05 | Três planos, um corpo | Reconhecer axial, coronal e sagital em imagens reais | tomografias reais nos três planos | `comparison`, `true-false`, MC |
| 06 | Em que altura estou | Dizer a altura de um corte pelas estruturas de referência | tomografias reais em níveis diferentes; `corte-abdome-superior` | `comparison` ou `hotspot`, `conversation`, MC |

Limite próprio: localizar não é interpretar; nenhum item nomeia achado; órgão que varia
com o sexo só como "neste esquema".

### Diagramas novos do lote 3 (17)

| Unidade | id | Tipo | O que mostra |
| --- | --- | --- | --- |
| m25 | `cranio-de-perfil-ossos` | parado | Crânio de perfil com frontal, parietal, temporal, occipital, esfenoide, maxila e mandíbula em cores diferentes |
| m25 | `linhas-do-cranio` | parado | Cabeça de perfil com as linhas orbitomeatal e infraorbitomeatal, e de frente com a linha interpupilar e o plano sagital mediano |
| m25 | `seios-da-face` | parado | Face de frente com os seios frontais, etmoidais e maxilares e as órbitas; ao lado, perfil com o seio esfenoidal |
| m25 | `raio-x-movel-no-leito` | parado | Leito com paciente sentado, aparelho móvel, detector atrás das costas, operador afastado com avental, outro leito ao lado e uma pessoa perto demais |
| m25 | `trauma-raio-horizontal` | parado | Paciente deitado em prancha com colar cervical, tubo de lado com raio horizontal, detector em pé do outro lado |
| m26 | `contraste-no-corpo` | parado | Dois troncos lado a lado: num, o tubo digestivo preenchido; no outro, rins, ureteres e bexiga preenchidos |
| m26 | `fluoroscopia-cadeia` | parado | Mesa de fluoroscopia de lado: tubo sob a mesa, paciente, receptor acima, monitor e pedal |
| m26 | `fluoroscopia-pulsada` | laço | Linha do tempo com o feixe contínuo em cima e em pulsos embaixo, e um quadro que fica na tela entre os pulsos |
| m26 | `sala-de-fluoroscopia-espalhada` | parado | Sala vista de lado: a radiação espalhada sai do paciente, mais forte do lado do tubo; operador com avental e protetor de tireoide, saiote na mesa, biombo |
| m27 | `contencao-pediatrica` | parado | Criança deitada na mesa com apoios e faixa, acompanhante de avental segurando fora do feixe, outra pessoa sem proteção perto |
| m27 | `colimacao-pediatrica` | parado | A mesma criança duas vezes: campo de luz cobrindo o corpo todo e campo ajustado à região |
| m27 | `idoso-apoios-e-riscos` | parado | Idoso junto ao receptor vertical: barra de apoio, banco, degrau, tapete solto, andador longe |
| m27 | `gestante-campo-e-feixe` | parado | Gestante de perfil junto ao receptor: campo ajustado longe do abdome e, tracejado, um campo aberto que o alcança |
| m28 | `corte-abdome-superior` | parado | Corte axial esquemático na altura do fígado: fígado, estômago, baço, pâncreas, rins, aorta, veia cava, vértebra |
| m28 | `corte-pelve` | parado | Corte axial esquemático da pelve: bexiga, reto, cabeças do fêmur nos acetábulos, ossos da pelve, sacro ou cóccix |
| m28 | `corte-pescoco` | parado | Corte axial esquemático do pescoço: traqueia, esôfago, tireoide, carótidas, jugulares, vértebra e medula |
| m28 | `coluna-sagital-e-axial` | parado | Coluna lombar em corte sagital (corpos, discos, canal) ao lado de um corte axial na altura de um disco |

## Lotes 4 a 6

A composição segue a tabela da seção 8.1 da especificação, na ordem da trilha:

| Lote | Unidades |
| --- | --- |
| 4 | m29, m30, m31, m32 |
| 5 | s-ta, s-ra, s-mi, s-pt |
| 6 | s-rp, s-hd, s-oc, s-ud |

A lista aula a aula de cada lote é a tarefa 1 dele e entra neste arquivo quando o lote
abre, depois da leitura da unidade atual. Foi decisão do controlador não escrever as
aulas restantes de uma vez: a lista depende do que o piloto do lote 1 ensinar sobre
quantos diagramas uma unidade pede e quanto um autor consegue em uma passada.
A partir do lote 3 as unidades pedem radiografia real (crânio, face, contrastados,
seccional); a busca de imagem CC0 ou CC BY entra como tarefa própria do lote, pela
autorização do dono de 2026-11-06.

## O que fica com o dono

- Merge de cada PR, na ordem A, B, C1 a C6.
- Ver em aparelho os formatos e os diagramas.
- Os temas das irmãs (seção 8.1 da especificação) e esta lista do lote 1 são proposta
  do Claude; ele pode trocar qualquer aula antes do merge.
