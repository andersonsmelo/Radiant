# Radiant — refinamento visual antes da 1.6

**Estado:** aprovado pelo dono em 2026-11-16 (America/Bahia), com a resposta
"Aprovo, faça o plano". A direção das seis telas da prancheta tinha sido
aprovada antes, no mesmo dia, com "Aprovado, siga". O plano de execução está em
[`docs/plans/2026-11-16-refinamento-visual-1-6.md`](../../plans/2026-11-16-refinamento-visual-1-6.md).
**Decisor:** Anderson Melo, na conversa de 2026-11-16. As decisões dele estão na
seção 2. Tudo que é escolha minha está marcado **[escolha do agente]**.
**Autoria do registro:** Claude Fable 5.2 (Anthropic, `claude-fable-5-2`).
**Prancheta avaliada:** [refinamento antes da 1.6](https://claude.ai/artifact/5N7mMpW6VBpp25LEh6Lrqk),
privada na conta do dono. Nela, os números do perfil e das missões são de
demonstração.
**Base medida:** `main` em `e8e3a0e` (configuração da 1.6.0), lida na árvore
`Radiant-release` e vista no simulador "Radiant F6" com as chaves da 1.6
ligadas, em 2026-11-16.

## 1. Intenção

O dono quer que o app pareça feito por um estúdio profissional antes de a 1.6
sair, com o Duolingo e apps semelhantes como régua. A identidade não muda: o
Medalhão de 2026-10-21 já é a resposta do app a essa régua, e o
[`DESIGN.md`](../../DESIGN.md) continua valendo inteiro.

O levantamento mostrou onde o app ainda fica abaixo dela:

1. **O ciclo de resposta da aula.** É o gesto que o aluno repete dezenas de
   vezes por sessão. Hoje o retorno aparece num cartão dentro do cartão rolável,
   abaixo das alternativas, e as alternativas não ganham marca de certa ou
   errada [visto no simulador].
2. **Telas que entraram depois da prancheta do Medalhão.** Missões, liga,
   decorações, o convite de assinatura e os formatos novos de interação
   chegaram na 1.6 sem prancheta própria.
3. **Sobras do sistema anterior.** Contrariam regras que o `DESIGN.md` já
   escreve.

## 2. O que o dono decidiu

- **Caminho B, inteiro, antes do lançamento** (resposta "B", em 2026-11-16): o
  ciclo de resposta, a limpeza e o redesenho das telas fracas entram antes de a
  1.6 ir para a loja.
- **A direção das seis telas da prancheta** (resposta "Aprovado, siga"):
  resposta errada, classificar, passo de ensino, perfil, missões e assinatura.
- **Perfil e assinatura recebem uma segunda passada.** As duas já tinham sido
  redesenhadas na [prancheta do app](../../design/2026-10-21-app-medalhao.html),
  aprovada em 2026-10-21. O dono foi avisado disso antes de aprovar a prancheta
  nova.

Duas perguntas ficaram sem resposta e estão resolvidas como escolha minha, na
seção 9: a `HomeScreen` antiga e a tela da liga. Uma terceira precisa da
resposta dele antes do plano e está na seção 7.3.

## 3. Objetivos, não objetivos e o que seria fracasso

**Objetivos**

- O retorno de acerto e de erro chega sem rolagem, no mesmo lugar em todo
  formato de pergunta.
- Toda superfície que o aluno toca para responder tem o relevo do Medalhão.
- Nenhuma tela do produto contraria uma regra escrita do `DESIGN.md`.
- Missões, classificar e o passo de ensino passam a usar peças desenhadas e
  blocos curtos, no lugar de linhas de texto iguais.

**Não objetivos**

- Trocar paleta, tipografia, mascote ou a metáfora do Medalhão.
- Mudar regra de produto: vidas, XP, missões, liga e preços ficam como estão.
- Reescrever conteúdo de aula. O passo de ensino muda a forma de mostrar, e o
  texto das aulas só muda onde a forma nova exigir (seção 7.3).
- Redesenhar a trilha, a abertura da aula com personagens, o resumo da aula e
  os ajustes, que já estão no nível certo.

**Seria fracasso mesmo funcionando**

- O app parecer template de IA ou dashboard hospitalar, as duas anti-referências
  do `DESIGN.md`.
- O retorno da resposta ficar mais bonito e menos claro sobre qual era a
  resposta certa.
- A limpeza quebrar texto ampliado, "reduzir movimento" ou o Android, que hoje
  têm evidência de funcionamento.

## 4. Restrições

- **Uma identidade.** Cor só por `galaxyColors`, `medalColors`,
  `feedbackColors`, `hudIconTones`, `hudLabelTones` e `semanticColors.galaxy`.
  Cor nova nasce em `src/ui/theme.ts`.
- **Contratos existentes continuam passando:** contraste, paleta de identidade,
  ícones, folga da barra de abas, estilo de texto, QA visual estrito e os demais
  do `npm run quality`.
- **Acessibilidade:** alvos de toque de 44 pt ou mais, texto ampliado até o
  máximo do sistema sem corte, leitor de tela com rótulo em toda marca
  desenhada, e alternativa parada sob "reduzir movimento".
- **Chaves da 1.6.** As telas atrás de chave (`ENABLE_LEAGUE`,
  `ENABLE_DECORATIONS`, `ENABLE_CONVERSION_PROMPTS`, `ENABLE_RICH_FEEDBACK`)
  precisam ficar corretas com a chave ligada e sem efeito com ela desligada.
- **Texto do app** segue a Regra Sem Cara de IA: sem etiqueta em caixa alta
  acima de título, sem travessão de efeito, sem palavra interna do código.
- **O `DESIGN.md` é atualizado no mesmo trabalho** em que um componente novo ou
  uma regra nova entrar.
- **Capturas da loja.** As seis capturas de `docs/store/assets/` mostram telas
  que mudam. Refazê-las é do dono.

## 5. Caminhos considerados

| Caminho | O que é | Troca |
| --- | --- | --- |
| A | Ciclo de resposta e limpeza das regras já escritas | Cabia na 1.6.0 sem atraso; deixava missões, classificar, ensino, perfil e assinatura como estão |
| **B (escolhido)** | A, mais o redesenho das telas fracas | É o que mais aproxima o app da régua; são mais telas antes do envio |
| C | Completar o sistema primeiro e migrar tela por tela depois | O mais durável; o aluno só percebe a diferença no fim |

O dono escolheu B. Os componentes que C criaria numa fase separada nascem
dentro de B, quando a primeira tela precisar deles **[escolha do agente]**.

## 6. Limpeza das regras já escritas

Cada item contraria hoje o `DESIGN.md` [medido em `e8e3a0e`].

- **Etiqueta em caixa alta acima de título.** "IDEIA-CHAVE" no passo de ensino,
  "XP TOTAL" na recompensa, "REVISÃO" no cartão de revisão e os demais usos de
  `typography.label` como etiqueta de título. A etiqueta sai e o título diz a
  coisa. Rótulo de métrica ao lado do valor continua permitido.
- **Caractere de texto como ícone.** `✕` na assinatura, `✓` e `✗` em `TapChip`,
  `HotspotStepRenderer` e `ComparisonStepRenderer`. Viram ícone desenhado.
- **Cores translúcidas do sistema antigo.** Os `rgba(...)` de verde, rosa,
  vermelho e âmbar em `RewardScreen`, `ReviewCard`, `QuizFeedback`,
  `LessonFlowScreen` e vizinhos (77 ocorrências em 23 arquivos) passam às
  superfícies opacas de `feedbackColors` e da escada de grafite.
- **Tamanho de texto literal.** Os `fontSize` numéricos fora de `src/ui` passam
  a `typography.*`. Se a migração mostrar que falta um degrau entre 16 e 24, ele
  nasce em `typography` com nome de papel, e o `DESIGN.md` registra.
- **Cartão dentro de cartão.** A moldura externa do passo da aula sai; o
  conteúdo do passo fica direto sobre o grafite.
- **Pixel antigo na abertura.** A tela de abertura usa o render 3D que o
  `DESIGN.md` proíbe. Passa ao Pixel do Medalhão. A imagem nativa
  (`assets/images/splash-icon.png`) só muda em build novo.
- **Botão desabilitado.** Hoje é a ação principal a 45% de opacidade, quase
  ilegível. Passa a uma variante própria: face `surfaceActive`, rótulo em texto
  secundário, lábio do neutro. A regra de opacidade 0,45 do `DESIGN.md` é
  substituída por essa variante.

## 7. As telas

### 7.1 Ciclo de resposta (prancheta 1)

Vale para todo formato de pergunta que confere resposta.

```
[x]  ▓▓▓▓░░░░░░░░   ♥ 4

Enunciado em até quatro linhas, 20/27

┌ alternativa escolhida, errada      (x) ┐  rosa de erro, com lábio
┌ alternativa                            ┐  apagada
┌ alternativa certa                  (✓) ┐  verde de acerto, com lábio
┌ alternativa                            ┐  apagada
────────────────────────────────────────────
 Pixel  Vamos reforçar        Menos 1 vida    folha fixa no rodapé
 Uma explicação curta.
 [            Continuar            ]
```

- **Alternativa com relevo.** Cada alternativa é uma peça com lábio, como o
  botão `secondary`. Selecionada, ganha borda em Azul de Navegação. O texto
  "Selecionada" sai; a borda e o lábio dizem o estado, e o leitor de tela
  continua anunciando a seleção.
- **Depois de conferir**, a alternativa certa recebe a superfície de acerto com
  ícone desenhado, e a escolhida errada recebe a de erro com ícone. As outras
  ficam apagadas. Cor nunca vai sozinha: há ícone e rótulo de acessibilidade.
- **Antes de conferir**, o botão "Conferir resposta" fica onde está hoje, no
  rodapé fora da rolagem. A folha ocupa esse mesmo lugar depois.
- **Folha de retorno fixa no rodapé.** Substitui o `AnswerFeedbackCard` dentro
  da rolagem. Tem o retrato do elenco, o título do retorno, a explicação e o
  botão de continuar, que passa a morar dentro dela nas variantes `success` e
  `error`. No erro que gasta vida, "Menos 1 vida" aparece na linha do título.
- **A explicação cabe em até quatro linhas no tamanho normal.** A folha cresce
  com texto ampliado e rola por dentro quando passar de dois terços da tela. O
  texto "Sua resposta" e "Resposta certa" sai da folha na múltipla escolha, no
  verdadeiro ou falso e na múltipla seleção, porque as próprias alternativas já
  mostram as duas. Nos outros formatos, a folha continua dizendo a resposta
  certa em texto.
- **Movimento.** A folha sobe em `duration.ui`; sob "reduzir movimento" aparece
  no lugar. O foco do leitor de tela vai para o título da folha.
- **Com `ENABLE_RICH_FEEDBACK` desligada**, a folha é a mesma, sem os sons,
  vibrações e animações que a chave liga.

### 7.2 Classificar (prancheta 2)

```
Cada situação da sala vai para qual grupo?
Toque numa ficha e depois no grupo.

┌╌ Tarefa técnica ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
│ [Posicionar e conferir…]       │
┌─ Decisão clínica ──────────────┐  grupo pronto para receber
│ Toque aqui para colocar        │
┌╌ Pedir apoio ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┐
│ Vazio                          │

[ficha escolhida]   [outra ficha]
[        Faltam 2 fichas        ]
```

- Os grupos são áreas que recebem as fichas e mostram o que já está dentro. As
  três linhas "Colocar em…" saem.
- Uma ficha tocada fica selecionada; o grupo tocado em seguida a recebe. Tocar
  numa ficha já colocada devolve a ficha. O arrasto não é obrigatório.
- O botão desabilitado diz quantas fichas faltam.
- O mesmo desenho de ficha e de área vale para o formato de lacuna, que usa as
  mesmas fichas.

### 7.3 Passo de ensino (prancheta 3)

- Título, uma frase de abertura em texto principal e de dois a quatro blocos.
  Cada bloco tem uma peça desenhada pequena, um termo em negrito e uma ou duas
  linhas.
- Referência legal ou de fonte vira nota de rodapé em texto terciário.
- A peça de cada bloco vem de um conjunto pequeno e fechado de ícones
  desenhados em SVG no código, em três tons **[escolha do agente]**. Bloco sem
  ícone definido aparece sem peça. Não há arte encomendada.
- **Dado necessário, e a pergunta que falta ao dono.** `TeachPayload` tem só
  `title`, `body` e `imageUrl` [`src/types/lessonFlow.ts`]. Não existe campo de
  lista; os marcadores que aparecem hoje são linhas dentro do `body`. Os blocos
  da prancheta pedem um campo novo e opcional no conteúdo. **[escolha do
  agente, aceita pelo dono em 2026-11-16 ao aprovar este documento]** Antes do
  lançamento entram o campo
  opcional e a forma nova de mostrar o `body` de todas as aulas (frase de
  abertura em texto principal, corpo em medida curta, nota de fonte separada).
  Escrever os blocos aula por aula é trabalho de conteúdo e fica para depois,
  começando pela primeira unidade. A alternativa é reescrever os passos de
  ensino de todas as aulas antes de lançar, o que é bem maior.

### 7.4 Perfil (prancheta 4)

- **Cabeçalho:** avatar com a moldura equipada, nome e o nível numa linha.
- **Medalhas:** a estante ganha a contagem "2 de 13" e um caminho para ver
  todas. A ilustração de cada peça já vem do tema da aula (`resolveNodeTheme`);
  as medalhas iguais vistas no simulador são aulas da mesma unidade com o mesmo
  tema, o que é assunto de conteúdo e fica fora daqui.
- **Sequência:** número grande com a chama, e as proteções numa linha curta. A
  semana mostra os dias estudados e marca hoje. Os dois parágrafos de
  explicação e o "?" saem. Dia sem registro aparece como dia vazio.
- **Liga e decorações** viram linhas com o valor à direita.
- **Saem do perfil:** a linha de missões e o bloco "Hoje", que repetem a tela
  inicial, e "Revisões pendentes: 0".
- O total de XP continua aparecendo uma vez, no fim.

### 7.5 Missões de hoje (prancheta 5)

- Cada missão é uma linha com uma peça desenhada (três ícones em SVG no
  código, um por tipo de missão **[escolha do agente]**), o título, o progresso em
  número e em barra, e a recompensa "+5 XP" à direita.
- Missão concluída: a peça vira ouro com a marca de feito, e a recompensa
  acende.
- Um botão leva de volta à trilha.

### 7.6 Assinatura (prancheta 6)

- Um título, uma frase e só a linha em que gratuito e assinante diferem
  (vidas). A tabela de quatro linhas sai.
- Os dois planos são cartões de escolha lado a lado, com relevo. O anual vem
  selecionado, em ouro, e mostra o valor por mês.
- Um botão só, que nomeia o plano escolhido. "Restaurar compra" continua.
- O texto legal fica inteiro e igual ao atual.
- Os preços vêm do StoreKit, como hoje.

### 7.7 Recompensa e unidade concluída

Sem prancheta nova **[escolha do agente]**: as duas passam ao padrão do resumo
da aula (`LessonSummary`), que já tem medalha no centro, número de XP sem caixa
e uma ação. Saem os cartões empilhados, as etiquetas em caixa alta e a
repetição do XP e da sequência que o topo já mostra.

## 8. Componentes

O que o plano deve criar ou estender, com os nomes a critério de quem
construir:

- uma folha de retorno, usada por todos os formatos que conferem resposta;
- uma alternativa com relevo e os estados neutro, selecionado, certo, errado e
  apagado;
- uma ficha e uma área de grupo, para classificar e lacuna;
- a variante desabilitada do `AppButton`;
- uma linha de missão;
- um cartão de plano.

Cada um entra com história no Storybook e com os estados sob texto ampliado e
"reduzir movimento".

## 9. O que fica de fora e por quê

- **`HomeScreen` antiga.** Só aparece com `ENABLE_LEARNING_ROAD` desligada, e a
  chave está ligada em todos os perfis do `eas.json`. Ela concentra perto de
  metade dos desvios medidos, mas é o plano B que o contrato de chaves de
  emergência exige (`killSwitches.contract.test.ts`). **[escolha do agente]**
  Fica como está, fora da limpeza e fora das medições deste trabalho. Removê-la
  é uma decisão sobre a chave, não sobre o visual.
- **Liga.** A classificação com dados não foi vista: o simulador não tem conta
  de Game Center. **[escolha do agente]** A tela recebe só a limpeza da seção 6
  agora, e o desenho dela espera uma captura em aparelho.
- **Decorações.** A tela está correta; as prévias pequenas dos anéis ficam para
  depois.
- **Android e texto ampliado** não foram vistos neste levantamento. O plano
  precisa prová-los por tela.
- **Resumo e comemoração da aula, avaliação e os formatos ordenar, parear e
  múltipla seleção** não foram vistos rodando; recebem a folha de retorno e a
  alternativa com relevo, e mais nada.

## 10. O que fica com quem constrói

- A ordem das tarefas e o tamanho de cada entrega.
- Como os blocos do passo de ensino são derivados do conteúdo (seção 7.3).
- A geometria exata da folha de retorno com teclado, texto máximo e telas
  curtas.
- Quais telas da seção 6 usam cada cor opaca que substitui um `rgba`.
- A prova por tela: Maestro, capturas em iOS e Android, e a execução vermelha de
  cada asserção nova registrada como evidência.

## 11. O que a execução fez diferente deste desenho

Registrado em 2026-11-17, depois da execução. O dono delegou as decisões ao sair
("voce tem autonomia para tomar decisões"); cada item abaixo é **[escolha do
agente]** e pode ser revertido por ele. O texto das seções anteriores foi mantido
como foi aprovado.

- **7.1, resposta certa em texto.** O desenho tirava "Resposta certa" da folha na
  múltipla escolha, no verdadeiro ou falso e na múltipla seleção, porque as
  alternativas mostrariam as duas. No simulador, com enunciado longo, a alternativa
  certa ficou escondida atrás da folha. No erro, a folha diz "Resposta certa: …" em
  todos os formatos que têm resposta em texto.
- **7.1, movimento.** A folha entra em `duration.ui` (220 ms) com
  `ENABLE_RICH_FEEDBACK` desligada, como o cartão antigo, e em 150 ms com a chave
  ligada, como a ADR do retorno rico fixou.
- **7.1, relevo e a chave.** O relevo da alternativa e a descida ao toque aparecem
  com a chave ligada ou desligada: são desenho, não retorno rico.
- **7.2, classificar.** O rótulo "Faltam N fichas" vale também na avaliação, que
  roda na mesma tela.
- **7.3, passo de ensino.** Não houve campo novo no conteúdo. As aulas já trazem
  `keyPoints`, quase sempre como "Termo: explicação", e os blocos saem daí: 179 dos
  469 pontos têm termo. No lugar do ícone por bloco há uma peça numerada. A nota de
  fonte separada e a medida curta do corpo não foram feitas.
- **7.4, perfil.** "Ver todas" as medalhas expande a grade no próprio lugar. A
  semana marca os dias cobertos pela sequência viva, lidos como "na sequência": o
  app só guarda a última data de estudo e a contagem, não o histórico da semana.
- **7.5, missões.** O "+N XP" acende quando a missão está concluída e creditada.
- **7.6, assinatura.** O período cobrado tem linha própria, acima do valor por mês
  calculado. A ADR de convites recebeu um adendo.
- **Decisões do dono depois da execução (2026-11-17).** Ordenar, parear, comparação
  e o cartão de revisão passaram a usar a peça com relevo; o quiz antigo ficou de
  fora, porque não tem entrada dentro do app. Na comparação, a escolhida leva a
  marca desenhada, para a escolha não depender só de cor. A sequência parada
  mostra 0 no topo e no perfil, como no widget; a contagem guardada continua
  servindo à regra e à sincronização.
- **Seção 6, componentes sem uso.** `PixelHeroSplit`, `AnimatedCounter` e
  `GalaxyStatRow` ficaram sem uso e continuam no repositório.
- **Seção 3 e seção 9, relevo em toda superfície de resposta.** O plano não cobriu
  ordenar, parear, comparação, e as telas antigas de quiz e de cartão de revisão;
  elas continuam sem relevo.
- **Seção 6, abertura.** A imagem de abertura não foi trocada.
