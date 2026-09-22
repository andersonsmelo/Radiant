# L2 — Cortando o espaço

**Estado:** rascunho local isolado para J3; não publicado, não conectado a rota,
catálogo ou startup. **Produzido em:** 2026-08-28. **Pergunta da lição:** como
uma referência geométrica se relaciona com os dados de uma região do corpo?

## Objetivo e limites

A L2 treina a leitura de planos de referência, plano mediano, obliquidade e a
separação entre plano geométrico, região espacial, espessura nominal e imagem
resultante. Ela prepara uma linguagem para a imagem seccional, mas não ensina
orientação de imagens DICOM, posição do paciente, eixos, movimento articular,
projeção ou incidência. Esses temas ficam fora desta lição; orientação da imagem
pertence à L3.

O texto editorial central é: **uma imagem seccional representa dados de uma
região espacial, que pode possuir espessura nominal.** Um plano geométrico é uma
referência sem espessura; a imagem resultante não deve ser tratada como se fosse
esse plano.

## Fontes e proveniência

| Afirmação/uso | Fonte fixada | Seção | Consulta |
| --- | --- | --- | --- |
| Vocabulário de planos de referência, coronais, sagitais, mediano, paramediano e transversais | FIPAT, *Terminologia Anatomica*, 2ª ed. (2019), publicada pela IFAA/FIPAT | Part 1, Chapter 1: termos 46, 48, 49, 50, 51 e 52 | 2026-08-28 — [TA2](https://libraries.dal.ca/Fipat/ta2.html) |
| Status e autoridade da TA2 | IFAA/FIPAT, *The IFAA Terminologies* | Current Status — Terminologia Anatomica | 2026-08-28 — [IFAA](https://ifaa.net/committees/anatomical-terminology-fipat/fipat-ifaa-terminologies/) |
| Espessura nominal quando declarada | DICOM PS3.3 2026c, *Image Plane Module* | C.7.6.2, `Slice Thickness` (0018,0050) | 2026-08-28 — [DICOM](https://dicom.nema.org/medical/dicom/2026c/output/chtml/part03/sect_C.7.6.2.html) |
| Alternativas a gesto, VoiceOver, rótulos, controles e redução de movimento | Apple, *Human Interface Guidelines — Accessibility* | Mobility, Vision e Motion | 2026-08-28 — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility/) |

Os termos em português e toda a explicação são redação editorial original do
Radiant; não se apresentam como tradução oficial da TA2. `Planum paramedianum`
(TA2 51) é a denominação normativa pertinente à placa sagital deslocada usada
na comparação assistida. A referência DICOM sustenta apenas o uso de espessura
nominal quando este atributo é declarado; a L2 não generaliza aquisição ou
reconstrução entre modalidades. O SVG do modelo foi
desenhado no código com formas vetoriais originais; não há imagem externa nem
ativo de terceiros incorporado.

## Sequência de aprendizagem

1. **Situação.** Antes de nomear uma imagem, a pessoa observa uma placa que
   atravessa o modelo corporal e distingue a referência geométrica do volume de
   dados destacado.
2. **Modelo explorável.** Controles de plano, região, espessura e camada
   alteram a geometria: a placa muda de orientação, o volume muda de nível e o
   número de faixas torna a espessura visível. Uma faixa de região desliza até
   a referência antes de apresentar o volume final; em Reduce Motion, o mesmo
   estado final aparece sem essa animação.
3. **Decisões independentes.** O diagnóstico pergunta qual placa central
   preenche a condição de mediano; depois contrasta coronal e transversal pela
   relação que cada uma separa. Nenhuma decisão concede XP nem domínio.
4. **Erro e apoio.** Confundir todo sagital com mediano gera `E-PLN-MED`, uma
   explicação sobre coincidência com a linha mediana e comparação assistida de
   uma placa central com outra paralela deslocada.
5. **Transferência.** A recuperação muda para a pelve e substitui a pergunta
   de coincidência por uma decisão de simetria entre marcadores. O motor só
   reconhece essa recuperação depois de erro diagnosticado e prática assistida
   correta. A lição repete o padrão para obliquidade (`E-PLN-OBL`) e para
   região/espessura/imagem (`E-PLN-SEC`).
6. **Revisão.** Os três objetivos voltam após dois outros nós e, novamente,
   após cinco a oito nós, em regiões ou modalidades novas. Ajuda e repetição
   imediata não fecham domínio.

## Matriz objetivo → evidência

| Objetivo | Exemplo/controle ensinado | Erro previsto | Decisão independente | Remediação | Recuperação e revisão |
| --- | --- | --- | --- | --- | --- |
| Referências coronais, sagitais e transversais | Placas e controles nomeados no modelo 2.5D | `E-PLN-SEC` se a placa for tomada por imagem ou se frente/costas for confundido com superior/inferior | `l2-independent-reference-plane` | `l2-assisted-reference-plane`, sem XP | `l2-reference-plane-recovery` na pelve; `review:l2:coronal-transversal-em-regiao-nova` |
| Mediano é caso particular de sagital | Placa central e placa paralela deslocada | `E-PLN-MED` | `l2-initial-median` | `l2-assisted-sagittal`, sem XP | `l2-median-recovery` na pelve; `review:l2:mediano-em-regiao-nova` |
| Obliquidade é relação com referências | Placa inclinada e placa alinhada | `E-PLN-OBL` | `l2-independent-oblique` | `l2-assisted-oblique`, sem XP | `l2-oblique-recovery` no tórax; `review:l2:obliquidade-em-regiao-nova` |
| Plano, região, espessura e imagem são distintos | Placa, volume, faixas e quadro | `E-PLN-SEC` | `l2-independent-section` | `l2-assisted-section`, sem XP | `l2-section-recovery` na pelve; `review:l2:regiao-espessura-imagem` |

`initial_independent`, `assisted_practice` e
`later_independent_retrieval` são registros distintos no motor local. Uma
recuperação repetida depois de novo erro não se torna domínio: ela mantém o alvo
de revisão pendente até existir item novo.

## Interação e equivalência acessível

- O mapa é vetorial 2.5D e funcional: controles discretos mudam plano, região,
  espessura e camada; uma faixa de região anima até a referência antes do volume
  final. O texto de estado e a legenda mostram a mesma mudança com palavras,
  traços, áreas, faixas e quadro, não apenas por cor.
- A pessoa pode operar a experiência sem gesto personalizado: candidatos
  geométricos numerados no SVG e botões equivalentes, opções em rádio e
  confirmação separada funcionam por toque, VoiceOver e controle alternativo
  compatível com esses controles.
- A descrição do modelo anuncia o estado de exploração, sua camada e a pista
  do cenário; os rótulos das opções descrevem posição/forma e estado de rádio,
  mas nenhum rótulo anuncia qual alternativa é correta.
- O modelo começa em estado demonstrativo neutro e a confirmação depende só de
  uma opção escolhida. Explorar o modelo não seleciona nem bloqueia uma resposta
  avaliativa; portanto a geometria não funciona como oráculo.
- Cada `visualScenarioId` altera contorno, marcadores e descrição textual do
  modelo, além de variar o problema espacial (por exemplo, coincidência passa a
  simetria pélvica) e a ordem dos candidatos. O motor grava o ID na evidência e
  não conta recuperação se repetir cenário já usado no objetivo; também exige
  erro diagnosticado e prática assistida correta antes de domínio/XP.

## Evidência local e pendências reais

Os testes automatizados cobrem conteúdo, motor, controles, semântica do estado,
fluxo de erro/remediação/recuperação e a ramificação de Reduce Motion. Eles não
demonstram equivalência de dificuldade em VoiceOver, controle alternativo ou
aparelho. A inspeção em Storybook é uma superfície local, não validação
científica especializada nem QA no iPhone.

## Registro de auditoria independente

**Versão v1 encaminhada:** 1.0.0-draft local. **Escopo do parecer:** precisão
terminológica, limites da L2, independência da avaliação, feedback/remediação,
proveniência dos ativos e equivalência acessível declarada.

**Parecer v1 (reprovado, revisão estática em 2026-08-28):** dois achados
críticos: o estado de `requiredPlane`/`requiredRegion`/`requiredThickness`
pré-exibia a resposta e o bloqueio de confirmação a entregava; e
`visualScenarioId` ainda não alterava a prévia, portanto a recuperação não era
novo item. Achados importantes: faltava decisão própria coronal×transversal,
fonte para espessura nominal, movimento instrutivo e estado acessível mais
completo. O auditor não executou testes nem testou aparelho.

**Correções submetidas à revisão v2:** a avaliação foi desacoplada do estado de
exploração; `visualScenarioId` agora altera contorno, marcadores e descrição e
entra no registro de evidência; recuperação repetida no mesmo cenário não prova
domínio; foi acrescentada a família coronal×transversal com apoio e recuperação;
TA2 51 e DICOM PS3.3 2026c foram incluídos; a sequência plano→região respeita
Reduce Motion; controles de rádio expõem seleção e valor acessível sem gabarito.
**Parecer v2 (reprovado, revisão estática em 2026-08-28):** os dois candidatos
descritos ainda não existiam como geometrias selecionáveis no mapa; os cenários
de recuperação não mudavam suficientemente o problema espacial; a sequência era
uma revelação por opacidade, não uma animação geométrica; e uma chamada direta à
recuperação podia conceder XP/domínio sem erro e apoio anteriores. O auditor
também pediu confirmação de semântica de rádio em aparelho e o registro completo
do termo TA2 51, já presente na tabela de fontes.

**Correções submetidas à revisão v3:** cada alternativa agora gera uma geometria
vetorial numerada e selecionável, com botão textual equivalente e sem gabarito;
a recuperação mediana usa simetria pélvica com marcadores equidistantes; uma
faixa de região se move até a referência antes do volume final, com estado final
imediato em Reduce Motion; e o motor exige evidência prévia de erro e prática
assistida correta antes de registrar domínio/XP.

**Parecer v3 (reprovado, revisão estática em 2026-09-22):** registro completo em
[`2026-09-22-l2-parecer-v3.md`](../content/2026-09-22-l2-parecer-v3.md). Seis
achados críticos, seis importantes e seis menores. **Três das quatro correções
listadas acima não se realizam no código:** não há número nem handler de toque
nas geometrias candidatas dentro do SVG — o cabeçalho "Toque em um candidato no
modelo" é afordância falsa; o que se move antes do volume é um overlay de texto
fora do SVG, enquanto o volume continua entrando por alternância de opacidade; e
os marcadores da recuperação mediana já eram equidistantes no item inicial, além
de a silhueta ser deslocada duas vezes (`SlicingSpaceModel.tsx:69` e `:91`), o
que põe a placa "mediana" fora do centro do corpo desenhado e torna **falsa no
desenho** a resposta correta de `l2-initial-median` e `l2-median-recovery`. A
quarta correção — exigir erro e apoio prévios — foi implementada em excesso: quem
acerta nunca alcança o item de recuperação independente, e a §5.1 fica
insatisfeita no caminho correto.

Somam-se dois defeitos de conteúdo: o plano coronal é desenhado como linha
horizontal numa vista frontal, indistinguível do transversal, e o seletor de
exploração apresenta mediano e oblíquo como planos irmãos e exclusivos —
`E-PLN-MED` e `E-PLN-OBL` codificados no próprio controle que deveria remediá-los.

As 4 suítes e 22 testes passam e **não detectam nenhum desses achados**: nenhuma
asserção toca as geometrias candidatas, três asserções centrais incidem sobre um
espelho das props embarcado no componente só para os testes, e o mock do hook de
Reduce Motion oculta uma violação real do gate §7.5.

Aprovado no parecer e registrado como sólido: proveniência e direitos (todo o
desenho é autoral; DICOM com edição fixada e URL versionada; TA2 com termos e
capítulo), os limites da §9.3, o desacoplamento da avaliação e o
`SlicingSpaceLessonSession.test.ts` como evidência genuína sem mock.

**Correções submetidas à revisão v4 (2026-09-22):** os seis achados críticos,
cada um com teste que falhou antes da correção e pelo motivo previsto.

- **C1 — coronal como linha horizontal.** As placas de referência passaram a
  `l2SlicingGeometry.orientationPaths`: coronal é área de face, transversal é
  área rasa de perfil, sagital continua segmento vertical porque é perpendicular
  à vista. Guarda: o coronal precisa ser caminho fechado e ter extensão vertical
  maior que o dobro da do transversal.
- **C2 — o controle ensinava `E-PLN-MED` e `E-PLN-OBL`.** O seletor único de
  cinco opções exclusivas virou **três eixos independentes**: orientação de
  referência (coronal/sagital/transversal), relação com o eixo mediano
  (mediano/paramediano) e inclinação (alinhada/oblíqua). A relação com o eixo
  aparece **aninhada sob sagital** e só quando sagital está selecionado — a
  estrutura do controle passa a ensinar que o mediano é um caso de sagital, em
  vez de negá-lo. Escolher "mediano" não desseleciona mais "sagital".
- **C3 — silhueta deslocada duas vezes.** `bodyPathFor` devolve coordenadas
  fixas, centradas em `MIDLINE_X`; o deslocamento de cenário fica só na
  translação do grupo, que carrega corpo, eixo, placas e marcadores juntos.
  Guarda: o centro horizontal da silhueta coincide com o eixo em **todo**
  cenário.
- **C4 — quem acerta nunca alcançava a recuperação.** O motor passou a ler
  `additionalRecoveryChallengeId` no acerto do item inicial, e o domínio exige
  **decisão independente prévia sobre o objetivo** em vez de erro diagnosticado.
  Quem errou continua precisando fechar a prática assistida; quem não errou não
  tem apoio a cumprir. A trava do parecer v2 — recuperação chamada a frio não
  concede XP — segue verde no mesmo teste que a instalou.
- **C5 — Reduce Motion violado na primeira renderização.** A prévia usa
  `useReducedMotionPreferenceState` e o modelo só agenda com `resolved`.
  Enquanto a preferência é desconhecida, a geometria final entra sem animar e o
  estado diz isso. O mock do teste deixou de fixar `true` e passou a ser
  controlável, com caso para os dois ramos.
- **C6 — rótulo preso à identidade da alternativa.** O campo `label` saiu de
  `L2AnswerOption`; a posição é responsabilidade de quem renderiza. Guarda:
  nenhuma alternativa pode carregar token posicional nos dados.

Saíram também, por serem incoerentes com o modelo de três eixos: os campos
`requiredPlane`/`requiredRegion`/`requiredThickness` — sem consumidor e
duplicando o gabarito, superfície do crítico v1 (a) —, com guarda contra
retorno; o espelho das props embarcado no componente para os testes; e a
afordância falsa "Toque em um candidato no modelo", já que o desenho não recebe
toque. Cada `visualScenarioId` ganhou legenda e marcadores próprios, encerrando
o achado v2 (2).

**Evidência medida em 2026-09-22:** 5 suítes e 39 testes da lição aprovados
(eram 4 e 22); `src/features/curriculum-v3` inteiro com 12 suítes e 117 testes;
`npm run typecheck` aprovado. *(Uma versão anterior deste bloco dizia "6 suítes e
38 testes" — número de uma execução intermediária, corrigido depois que o parecer
v4 o mediu.)* **Nada foi verificado em aparelho:** o pedido do parecer v2 de
confirmar a semântica de rádio no VoiceOver continua aberto, e nenhum teste desta
suíte pode fechá-lo.

**Parecer v4 (reprovado, revisão estática em 2026-09-22):** registro completo em
[`2026-09-22-l2-parecer-v4.md`](../content/2026-09-22-l2-parecer-v4.md). **Os seis
críticos foram confirmados resolvidos no código** — a reprovação é de outra
natureza que as três anteriores, em que a prosa descrevia correção que o código
não fazia. Ela se apoia em dois críticos **novos**, ambos consequência da
correção do C4: **N1**, a lição passando a terminar sem saída depois de um erro
na recuperação, agora no caminho de todo aprendiz; e **N2**, a recuperação que o
C4 tornou porta única do domínio não sendo item novo em três das quatro famílias.
Some-se **N4**: as guardas de C1 e C3 paravam na fronteira do módulo puro, então
reembutir a linha horizontal do coronal ou o deslocamento no caminho do corpo
reintroduzia os dois defeitos com a suíte verde.

**Correções submetidas à revisão v5 (2026-09-22):** N1, N2 e N4 corrigidos, cada
um com teste que falhou antes e pelo motivo previsto.

- **N1** — o apoio fechado depois de recuperação falhada segue para o destino
  declarado pelo item inicial do objetivo, com rótulo "Seguir; este objetivo
  volta na revisão". Não reabre a mesma recuperação, não concede domínio, e não
  encerra a lição. O teste que afirmava a ausência de continuação codificava o
  defeito e passou a afirmar a regra real.
- **N2** — a resposta correta mudou de posição nas três famílias que a mantinham
  fixa, com guarda percorrendo **todas** as famílias; e `candidateTransformFor`
  passou a desenhar o candidato na região que o cenário nomeia, então inicial e
  recuperação não desenham mais a mesma figura no mesmo lugar.
- **N4** — três guardas novas atravessam o componente e asseveram sobre o `d` da
  placa, o caminho da silhueta e a matriz do candidato. As três foram derrubadas
  com o defeito específico de cada uma antes de serem aceitas.

**Descoberta de método:** o desenho fica sob `accessibilityElementsHidden`, e as
consultas padrão do RNTL pulam nós ocultos — é **por isso** que nunca houve teste
sobre ele. As consultas precisam de `{ includeHiddenElements: true }`.

**Um "não verificável" do parecer foi fechado:** `react-native-svg` resolve
`transform` em `matrix`, e a composição `translate(...) rotate(...)` é honrada —
medido por três matrizes distintas.

**Evidência medida em 2026-09-22 (v5):** 5 suítes e 46 testes da lição; guardas
novas derrubadas em três formas reais e verdes ao restaurar.

**Seguem abertos:** N3 (rotação degenerada para coronal), N5 (contínuo/tracejado
com dois significados), I4 agravado, N7–N10, e os importantes/menores do v3
(I1, I3, I5.2/I5.3, I6 resíduo, M4–M6). **Parecer v5 pendente.**

**Fora do alcance da lição:** o achado I2 — o código `E-PLN-SEC` aplicado à
confusão coronal×transversal — exige criar um código de erro novo na spec e é
decisão do dono. Remendar a taxonomia por dentro corromperia a matriz de P1 e C1.
