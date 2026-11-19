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
| 05 | Sinais de alerta na sala | Reconhecer mudança no estado do paciente, parar, chamar ajuda e saber onde está cada recurso | `itens-de-emergencia-da-sala` (novo) | `label`, `blitz`, decisão de caso, MC |
| 06 | Um turno seguro | Integrar as cinco aulas numa sala nova | `sala-com-riscos` | `risk-hunt`, `conversation`, MC |

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

## Lotes 2 a 6

A composição segue a tabela da seção 8.1 da especificação, na ordem da trilha:

| Lote | Unidades |
| --- | --- |
| 2 | m21, m22, m23, m24 |
| 3 | m25, m26, m27, m28 |
| 4 | m29, m30, m31, m32 |
| 5 | s-ta, s-ra, s-mi, s-pt |
| 6 | s-rp, s-hd, s-oc, s-ud |

A lista aula a aula de cada lote é a tarefa 1 dele e entra neste arquivo quando o lote
abre, depois da leitura da unidade atual. Foi decisão do controlador não escrever as
132 aulas restantes de uma vez: a lista depende do que o piloto do lote 1 ensinar sobre
quantos diagramas uma unidade pede e quanto um autor consegue em uma passada.
A partir do lote 3 as unidades pedem radiografia real (crânio, face, contrastados,
seccional); a busca de imagem CC0 ou CC BY entra como tarefa própria do lote, pela
autorização do dono de 2026-11-06.

## O que fica com o dono

- Merge de cada PR, na ordem A, B, C1 a C6.
- Ver em aparelho os formatos e os diagramas.
- Os temas das irmãs (seção 8.1 da especificação) e esta lista do lote 1 são proposta
  do Claude; ele pode trocar qualquer aula antes do merge.
