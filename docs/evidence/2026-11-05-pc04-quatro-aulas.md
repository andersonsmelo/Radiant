# PC04 — quatro aulas do piloto, com checkpoints e recuperações

Medido em **05/11/2026, America/Bahia**, na worktree `trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810`, com a árvore local suja
preservada. **É um rascunho de autoria por IA (Claude), sem revisão.** Nada foi
promovido, ativado ou aprovado, e o catálogo continua vazio.

## O que mudou no pacote

- **Aulas:** M01.02, M02.01, M02.02 e M06.04 ganharam abertura, conceito e fechamento
  próprios. Os gabaritos das práticas não mudaram.
- **Checkpoint:** oito itens novos, dois por competência, com retorno por alternativa.
  O envelope do lote passa a ter dez itens e **deixa de ter as quatro recusas de
  cobertura**.
- **Recuperação e ajuda:** cada aula tem reforço guiado, nova tentativa em outro
  contexto e ajuda opcional, em `lessonCompanions`.
- **Achado corrigido:** o texto de brief que aparecia ao aluno saiu das aberturas, e
  fechamentos só com título ganharam texto, inclusive na variante de costas.
- **M01.01 não mudou:** o hash do candidato segue
  `d09acab0cbbb1b24c84c9522acef8b9bf16bc1c74d71d3d84f62b05bee406a2f`.

Hash do envelope do lote: `42e11349258ffa9c18efc76ac4ef598c5e5bdc51126e0bffe547143b29201ef0`.
Hash do pacote completo: `61d7e33cbfce30af34a3b58640a1d0f6541d15010b40996b3a00a84683593699`.

## Verificação

Node 20.20.2. Recibos locais em `.loop/runs/run-1793894706616-b3b3e0e6/provas/`.

| Verificação | Resultado |
|---|---|
| `node --test scripts/content/check-pilot-payloads.test.mjs` | 9/9 |
| `node scripts/content/check-pilot-payloads.mjs` | sem erros: 5 aulas, 8 recuperações, 4 ativos, nenhuma recusa do contrato do lote |
| Promoção do lote | **recusada**, por faltarem as seis aprovações e a mídia aprovada; `promotionReady: false` |
| Sete suítes da prévia editorial | passaram; ver `app-focus.log` |

Cada guarda nova foi vista falhando com o defeito que nomeia, retirando só a sua
emissão e restaurando em seguida: `red-feedback.log`, `red-recovery.log`,
`red-help.log`, `red-brief.log` e `red-lot.log`.

Três testes da prévia passaram a avançar uma etapa a mais, por causa do novo conceito.
O teste de cobertura agora espera zero lacunas.

## Limites

- **Autoria e revisão:** Claude escreveu estas aulas, então seu aceite PC03-B não as
  cobre e ele não deve revisá-las sozinho. Falta revisão técnica e editorial
  independente. Isso não é aprovação clínica.
- **Fontes:** usei só os recortes dos briefs, já capturados no PC04, sem reler as
  publicações nem acrescentar fatos. A inversão entre vista e tela segue como inferência
  geométrica, a conferir pelo revisor.
- **Google Doc:** o [documento próprio](https://docs.google.com/document/d/1g7JAN5szNx4qBogWupp363i3HHOgCMSMew6dUA46iwY) guarda a **primeira versão** e está atrás deste arquivo desde a revisão abaixo. O conector cria documentos, mas não os edita. Até haver nova versão lá, vale o texto daqui. O documento do PC04 e o manifesto não mudaram.
- **Aparelho:** nada foi visto em simulador ou iPhone. O laboratório abre as práticas
  com o novo conceito, mas checkpoint e recuperação destas aulas ainda não têm entrada
  nele. Leitor de tela e offline seguem sem prova.
- **Pendências do lote:** seis aceites por hash, gates de promoção, e a mídia aprovada.

## Revisão por subagente, 05/11/2026

Revisão por um subagente Claude novo, sem o contexto da autoria: mesmo modelo do autor,
portanto **não é a revisão independente** nem um aceite. O Codex não estava disponível.
Refez a geometria nos PNGs e confirmou os gabaritos de lateralidade; nenhum achado
crítico; 148 textos serializados sem divergência da evidência.

Aplicado:

- **Checkpoint da M02.01:** responder sempre "À direita da tela" fazia 2/2. O item 2
  agora pede o lado esquerdo, de costas, e o gabarito passa a ser "À esquerda da tela".
  O outro contexto foi ajustado para não repetir o item.
- **Retornos de erro:** o da variante de costas e o da Imagem B agora explicam o erro
  de quem os recebe.
- **M01.02:** o outro contexto volta a testar a divergência, a barreira crítica do brief.
  Custo: o entendimento passa a ser exercitado só na ordenação.
- **M06.04:** a legenda da cena deixou de ser nota de produção.
- **Ajustes menores:** jargão de brief, pistas de redação, ajuda da M02.01, "pense ou
  diga" no lugar de "diga em voz alta" e o título do fechamento das recuperações.

Depois da revisão, o contrato passou a recusar esse defeito por
`checkpoint-constant-answer`. A guarda compara o texto da resposta, não o sentido.

Aberto, sem mudança:

- **"Produto dose-área":** `CollimationImage` mostra esse texto no renderer genérico,
  contrariando "não calcula dose". O laboratório usa a cena abstrata e não o exibe, mas
  uma aula real pelo caminho genérico exibiria. O componente é compartilhado: decidir no
  PC06 antes de promover a M06.04.
- **"Para revisão" nos quatro PNGs:** tirar antes do aluno muda os hashes dos ativos.
- **Marcadores D/E:** o revisor lembrou que também se usam no Brasil, sem fonte. Cabe a
  um revisor humano; não acrescentei o fato.
- **Retornos sem uso:** na M06.04 as dicas têm precedência sobre o retorno de erro, e nas
  recuperações cada alternativa já tem retorno próprio.

## Gate

Writer `run-1793894706616-b3b3e0e6`. Gate configurado: **`VALIDATION_PASSED`, 15/15, em
um ciclo**, com a carga em ~3,5 depois de o `ffmpeg` alheio terminar. `app-quality`
passou em 98 s e `app-test` em 95 s. Árvore local suja, não CI de um SHA.

Antes, com o mesmo `ffmpeg` em uso, o `app-quality` direto levou 215 s, acima do prazo de
180 s do validador. Por isso o gate esperou a carga baixar.

A passada de revisão acima fechou no writer `run-1793909989871-4db9d807`, com gate
**`VALIDATION_PASSED`, 15/15, em um ciclo**: `app-quality` em 106 s e `app-test` em 93 s.

O registro do link do Google Doc veio depois, no writer `run-1793899410975-8a7fb8e4`,
fechado **sem gate** antes de um reinício do Mac, com carga alta por render alheio.
Nesse ajuste passaram só o verificador do pacote (9/9) e o contrato documental. O hash
do pacote mudou por isso; o do envelope do lote, não.

# Texto das aulas

## M01.02 — Identificação e comunicação

**Abertura — Quem está na simulação?** Antes de qualquer etapa, a equipe precisa saber com quem está falando. Neste treino, a ficha e a pulseira são inteiramente fictícias, e ninguém informa dados reais.

**Conceito — Perguntar e comparar** Peça que a pessoa diga os próprios identificadores, em vez de dizer um nome e esperar um sim. Depois, compare a resposta com os registros. A posição na sala ou a ordem da fila não substituem essa conferência. Se os dados divergirem, pare e peça apoio. Com a identidade confirmada, explique a etapa e verifique se ela foi entendida.

**Prática.** Coloque os quatro cartões na ordem em que acontecem nesta simulação. Ajuda opcional: Para cada cartão, pergunte: o que precisa estar confirmado antes dele?

Retorno certo: A conferência e o entendimento antecedem a continuação neste cenário. Divergência exige pausa e apoio. Retorno de erro: Reconstrua a sequência declarada: cada cartão depende da confirmação obtida na anterior. Não continue com identidade não confirmada.

**Fechamento — Conferir antes de seguir** Você ordenou a conferência desta simulação. Cada serviço define seu próprio procedimento; aqui, divergência significa parar e pedir apoio.

**Checkpoint**

Item 1. Na simulação, a ficha fictícia traz o nome Lia Prado. Qual pergunta confere a identificação sem induzir a resposta? Gabarito: B.

- A. “A senhora é a Lia Prado, certo?” Retorno: Essa pergunta entrega o nome e convida a um sim.
- B. “Pode me dizer seu nome completo?” Retorno: Você pediu que a pessoa informasse o dado, sem sugerir a resposta.
- C. “Foi a senhora que chamaram agora?” Retorno: Ter sido chamada não confirma quem é a pessoa.
- D. “Está na sala certa para o exame?” Retorno: A sala não informa a identidade. Peça o dado à pessoa.

Item 2. O nome coincide, mas a pessoa informa que nasceu em 12/03/1990, e a pulseira fictícia mostra 21/03/1990. O que fazer neste cenário? Gabarito: D.

- A. Seguir, porque o nome coincidiu. Retorno: Um dado divergente deixa a identidade sem confirmação.
- B. Corrigir a pulseira com a data dita. Retorno: Neste treino, você não altera o registro por conta própria.
- C. Usar a data da pulseira e seguir. Retorno: Escolher um dos dados não resolve a divergência.
- D. Interromper e pedir apoio à equipe. Retorno: Divergência interrompe a continuação: você parou e pediu apoio.

**Reforço guiado.** Apoio: Antes de responder, complete: eu só sigo depois de confirmar… A pessoa da simulação está na primeira cadeira da fila, e um colega diz que ela é a próxima. A identidade ainda não foi conferida. Qual é o próximo passo? Gabarito: A.

- A. Pedir os identificadores e comparar. Retorno: Pedir e comparar os dados confirma a identidade, sem depender da fila.
- B. Chamar pelo nome da ficha e seguir. Retorno: Dizer o nome induz a confirmação. Peça o dado à pessoa.
- C. Confiar na ordem indicada pela fila. Retorno: A fila mostra a ordem de chamada, não quem é a pessoa.
- D. Explicar a etapa e conferir depois. Retorno: A explicação vem depois de a identidade estar confirmada.

**Outro contexto.** Apoio: Esta situação é nova. Responda sem consultar a questão anterior. Em outra simulação, a data de nascimento confere, mas a pessoa diz um sobrenome diferente do registrado na pulseira fictícia. O que fazer neste cenário? Gabarito: B.

- A. Seguir, porque a data coincidiu. Retorno: Um dado divergente deixa a identidade sem confirmação.
- B. Parar e chamar apoio da equipe. Retorno: Divergência interrompe a continuação: você parou e chamou apoio.
- C. Usar o sobrenome da pulseira. Retorno: Escolher um dos dados não resolve a divergência.
- D. Explicar a etapa e conferir depois. Retorno: A explicação vem depois de a identidade estar confirmada.

## M02.01 — Posição de referência e vistas

**Abertura — De quem é a direita?** Em um diagrama, a direita do personagem nem sempre fica do lado direito da tela. Os desenhos desta aula são esquemáticos: mostram uma referência espacial, não um posicionamento de exame.

**Conceito — Comece pela vista** Direita e esquerda pertencem ao corpo, e não a quem observa. Por isso, antes de responder, veja se o personagem está de frente ou de costas. A mesma região da tela pode corresponder a lados diferentes do corpo, conforme a vista.

**Prática.** Personagem de frente. Selecione a região correspondente ao lado direito do corpo e confirme. Ajuda opcional: Imagine alguém de frente para você levantando a mão direita. De que lado você vê essa mão?

Retorno certo: A referência é o lado do personagem na vista informada. Retorno de erro: Compare a vista informada com a posição das regiões da tela; a direita do observador não é uma regra fixa para o corpo.

**Variante de costas — Agora de costas** Esta vista é nova: o personagem está de costas. Use a indicação da vista antes de responder. O desenho continua esquemático. Retorno de erro: De costas, você e o personagem olham na mesma direção. Confira de novo de que lado da tela fica a direita dele. Fechamento: O lado do corpo continua o mesmo, e a vista mudou o lugar em que ele aparece na tela.

**Fechamento — A vista muda a tela** Você usou o lado do personagem como referência. Em outra vista, a posição na tela pode mudar, e o lado do corpo continua o mesmo.

**Checkpoint**

Item 1. Um personagem está de frente para você na tela. Em que lado da tela aparece o lado esquerdo do corpo dele? Gabarito: A.

- A. À direita da tela. Retorno: De frente, o lado esquerdo do corpo aparece à direita de quem observa.
- B. À esquerda da tela. Retorno: Essa é a posição do lado direito do corpo nesta vista.
- C. No centro da tela. Retorno: O lado do corpo não fica no centro do desenho.
- D. Depende do tamanho do desenho. Retorno: O tamanho não muda a relação entre a vista e o lado do corpo.

Item 2. Um personagem está de costas para você na tela. Em que lado da tela aparece o lado esquerdo do corpo dele? Gabarito: C.

- A. À direita da tela. Retorno: Isso vale para o lado esquerdo na vista de frente, não na de costas.
- B. No centro da tela. Retorno: O lado do corpo não fica no centro do desenho.
- C. À esquerda da tela. Retorno: De costas, o lado esquerdo do corpo aparece à esquerda de quem observa.
- D. Não é possível saber pela vista. Retorno: A vista informada basta para relacionar o corpo e a tela.

**Reforço guiado.** Apoio: Antes de responder, complete: o personagem está de… e por isso a direita dele fica… Um colega diz: “A direita do corpo é sempre o lado direito da tela.” O diagrama mostra um personagem de frente. O que corrige essa frase? Gabarito: A.

- A. A vista define onde o lado aparece. Retorno: A vista informada mostra onde cada lado do corpo aparece na tela.
- B. A direita de quem observa vale sempre. Retorno: Essa é a frase que precisa de correção: quem observa não define o lado do corpo.
- C. A letra da região define o lado. Retorno: As letras só marcam regiões da tela.
- D. O lado do corpo muda a cada vista. Retorno: O lado do corpo é o mesmo; muda a posição dele na tela.

**Outro contexto.** Apoio: Esta situação é nova. Responda sem consultar a questão anterior. Uma tela fictícia mostra um personagem de costas, com uma seta marcando a região à direita da tela. Essa região corresponde a qual lado do corpo? Gabarito: D.

- A. O lado esquerdo do corpo. Retorno: Nesta vista, o lado esquerdo do corpo fica à esquerda da tela.
- B. Depende de quem olha a tela. Retorno: O lado do corpo não muda conforme quem observa.
- C. Não dá para relacionar os dois. Retorno: A vista informada permite relacionar a tela e o corpo.
- D. O lado direito do corpo. Retorno: De costas, o lado direito da tela coincide com o lado direito do corpo.

## M02.02 — Lateralidade e marcadores

**Abertura — O que o marcador indica?** R vem de right, direita, e L vem de left, esquerda. O marcador se refere ao lado do corpo. Os diagramas desta aula são esquemáticos e mostram um personagem de frente.

**Conceito — Conferir, não corrigir** Para conferir um marcador, use a vista informada e o lado do corpo, e não o lado da tela ou a posição habitual de um órgão. Se algo parecer incoerente, descreva a inconsistência e leve à equipe responsável. Neste treino, você não altera nem inventa informação da imagem.

**Prática.** Compare os dois diagramas de frente. Qual apresenta R no lado direito do corpo? Ajuda opcional: Localize primeiro a direita do personagem e só depois procure o R.

Retorno certo: Na vista de frente, a direita do personagem aparece à esquerda da tela. Retorno de erro: Na Imagem B, o R está à direita da tela. De frente, ali fica o lado esquerdo do corpo. Localize primeiro a direita do personagem.

**Fechamento — Inconsistência se comunica** Você relacionou o marcador ao lado do corpo na vista informada. Neste treino, um marcador incoerente é comunicado à equipe, sem correção por conta própria.

**Checkpoint**

Item 1. Um diagrama mostra um personagem de frente, com o marcador L à direita da tela. Esse marcador está coerente com o lado que indica? Gabarito: B.

- A. Não: L deveria ficar à esquerda da tela. Retorno: Essa resposta usa o lado da tela, e não o lado do corpo.
- B. Sim: o lado esquerdo do corpo fica ali. Retorno: De frente, o lado esquerdo do corpo aparece à direita da tela.
- C. Não: só o marcador R pode ser usado. Retorno: L também é um marcador de lado: indica a esquerda.
- D. Sim: a tela define o lado do corpo. Retorno: A conclusão coincide, mas o motivo não: quem define é o corpo na vista.

Item 2. Na simulação, o marcador de uma imagem fictícia não combina com o lado informado no roteiro. O que fazer neste cenário? Gabarito: D.

- A. Trocar o marcador na imagem e seguir. Retorno: Neste treino, você não altera informação da imagem.
- B. Decidir pela posição de um órgão. Retorno: A posição de um órgão não substitui a conferência do marcador.
- C. Seguir, porque a imagem parece boa. Retorno: A aparência da imagem não resolve a inconsistência.
- D. Descrever o problema e avisar a equipe. Retorno: Você tornou a inconsistência explícita, sem corrigir por conta própria.

**Reforço guiado.** Apoio: Antes de responder, complete: o R se refere ao lado… do personagem. Um personagem está de frente. Um colega diz que o R está certo porque aparece à direita da tela. O que a conferência precisa observar? Gabarito: C.

- A. O lado da tela em que o R aparece. Retorno: O lado da tela sozinho não confere o marcador.
- B. O tamanho do R em relação ao desenho. Retorno: O tamanho do marcador não informa o lado do corpo.
- C. O lado do corpo na vista informada. Retorno: A conferência relaciona o marcador ao lado do corpo na vista.
- D. A posição habitual de um órgão. Retorno: A posição de um órgão não substitui a conferência do marcador.

**Outro contexto.** Apoio: Esta situação é nova. Responda sem consultar a questão anterior. Em outra simulação, o personagem está de costas e o R aparece à direita da tela. O marcador está coerente? Gabarito: A.

- A. Sim: de costas, corpo e tela coincidem. Retorno: De costas, o lado direito do corpo aparece à direita da tela.
- B. Não: o R sempre fica à esquerda. Retorno: À esquerda da tela só seria coerente na vista de frente.
- C. Não: de costas, ele perde o sentido. Retorno: O marcador continua indicando o lado do corpo.
- D. Sim: qualquer posição serve para o R. Retorno: A posição importa: ela precisa coincidir com o lado direito do corpo.

## M06.04 — Campo, colimação e espalhamento

**Abertura — Campo e área na simulação** O detector didático mede 27×33 cm. A altura fica fixa. A cena é um modelo qualitativo, sem recomendação para paciente.

**Conceito — Abrir menos, sem cortar o alvo** Colimar limita a área atingida pelo feixe e influencia o espalhamento. Um campo aberto demais inclui largura sem necessidade; um campo estreito demais deixa parte do alvo de fora. Recortar a imagem depois da aquisição muda o que se vê, e não a exposição que já aconteceu. Antes de ajustar, pense ou diga o que espera que aconteça com a área.

**Prática.** Ajuste a abertura horizontal para manter o alvo inteiro e reduzir a margem extra. Confirme quando terminar. Ajuda opcional: Reduza um passo de cada vez e observe se o alvo continua inteiro dentro do campo.

Retorno certo: O alvo está inteiro e a largura extra foi reduzida. O resultado vale só para esta cena. Retorno de erro: Compare o campo com o alvo. O modelo calcula área relativa, sem calcular dose em paciente ou espalhamento físico.

Legenda da cena: Cena abstrata: retângulo central e campo ajustável. Dicas: Parte do alvo ficou fora do campo. Há margem horizontal extra em torno do alvo.

**Fechamento — Menos área, alvo inteiro** Você ajustou o campo para conter o alvo com menos margem. O resultado vale para esta cena: o modelo mostra área relativa, não calcula dose nem espalhamento e não é técnica para paciente.

**Checkpoint**

Item 1. Com a altura fixa, em uma cena didática, o alvo cabe inteiro no campo, e sobra margem dos dois lados. Você reduz a largura e mantém o alvo inteiro. O que acontece com a área do campo? Gabarito: A.

- A. Ela fica menor. Retorno: Com altura fixa, reduzir a largura diminui a área do campo.
- B. Ela fica maior. Retorno: A área só aumentaria se a abertura aumentasse.
- C. Ela não muda. Retorno: Com a altura fixa, a largura altera a área.
- D. Ela passa a indicar a dose. Retorno: O modelo mostra área relativa, sem calcular dose.

Item 2. Uma imagem foi adquirida com o campo aberto demais, e depois as bordas são recortadas na tela. O que o recorte muda? Gabarito: C.

- A. A área atingida na aquisição. Retorno: A aquisição já aconteceu; o recorte vem depois dela.
- B. A exposição, que diminui junto. Retorno: O recorte não altera a exposição já realizada.
- C. O que aparece na imagem exibida. Retorno: O recorte muda o que se vê, e não o que já foi exposto.
- D. Nada: equivale a colimar antes. Retorno: Recortar depois não substitui colimar o feixe antes da exposição.

**Reforço guiado.** Apoio: Antes de responder, complete: o alvo precisa ficar… e a margem extra… Na bancada, você reduziu tanto a largura que parte do alvo ficou fora do campo. Qual ajuste faz sentido nesta cena? Gabarito: B.

- A. Reduzir mais, para diminuir a área. Retorno: Reduzir mais deixaria ainda mais alvo de fora.
- B. Aumentar até o alvo caber inteiro. Retorno: O campo precisa conter o alvo inteiro, sem abrir além do necessário.
- C. Manter, porque a área ficou menor. Retorno: Área menor não compensa o alvo incompleto.
- D. Recortar depois a parte que faltou. Retorno: O recorte não recupera o que ficou fora do campo.

**Outro contexto.** Apoio: Esta situação é nova. Responda sem consultar a questão anterior. Em outra cena, o alvo é menor, e o campo começa bem mais largo que ele. Ampliar o campo “por garantia” tem qual efeito no modelo? Gabarito: D.

- A. Diminui a área do campo. Retorno: Ampliar a abertura aumenta a área.
- B. Mede a dose em cada órgão. Retorno: O modelo não calcula dose.
- C. Dispensa conferir o alvo. Retorno: O alvo continua precisando ser conferido.
- D. Aumenta a área, sem ganho para o alvo. Retorno: A abertura extra aumenta a área sem atender ao cenário.
