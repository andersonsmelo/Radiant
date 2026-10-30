# Radiant — trilha Medalhão e aula-bancada

**Estado:** aprovado pelo dono em 2026-10-21 (America/Bahia), com a resposta "Aprovado. Registre no repositório com spec, ADR e as pranchetas, e siga para o plano."
**Decisor:** Anderson Melo, na conversa de 2026-10-20 e 21. As decisões dele
estão citadas na seção 2. Tudo que é escolha minha está marcado **[escolha do
agente]**.
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Pranchetas aprovadas:** a [trilha Medalhão](../../design/2026-10-21-trilha-medalhao.html)
e a [aula-bancada](../../design/2026-10-21-aula-bancada.html), preservadas como
foram avaliadas. Nelas, os números e o conteúdo são de demonstração.
**Decisões registradas na** [ADR de 2026-10-21](../../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md).
**Pesquisa:** o [benchmark de 26 apps](../../trilha/pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md)
e a busca de 2026-10-21 sobre como a aula é entregue (seção 9).

## 1. Intenção

A trilha e a aula atuais são cartões de texto sobre o céu escuro. A trilha é uma
coluna de cartões, e a aula é abertura, ideia-chave e múltipla escolha só em
texto [visto no simulador em 2026-10-21]. O dono quer uma experiência premium,
que saia do óbvio. A referência dele é a trilha de um app de idiomas: caminho em
zigue-zague, nó ilustrado e animado, estrelas e uma animação que leva até a
próxima aula.

A pesquisa mostrou o que esses apps fazem: trocam texto por **manipulação do
objeto do domínio**. O xadrez do Duolingo é cerca de 75% quebra-cabeça no
tabuleiro, e o Brilliant ensina por problemas manipuláveis. Para o Radiant, o
objeto é **o equipamento e a imagem**. Em radiologia, ninguém oferece isso no
celular com trilha gamificada; os simuladores de posicionamento existem só em
desktop e VR.

Sucesso, para o dono, é o aluno voltar amanhã porque a aula foi boa de fazer,
sem que o rigor do conteúdo pague por isso (PRODUCT.md, "rigor primeiro").

## 2. Decisões do dono nesta conversa

| Decisão | Palavras do dono |
| --- | --- |
| Todas as aulas atuais saem, e as novas já nascem com o design novo | "o proximo passo vai ser apagar todas as aulas, e a criação das novas aulas ja devem vir com um designer mais premium" |
| Quem já estuda recomeça do zero: somem progresso e revisões das aulas antigas, e XP e sequência ficam | opção "Recomeçam do zero" |
| Design primeiro, depois o conteúdo | opção "Design primeiro" |
| Currículo novo **e** formato de criação das aulas escolhidos juntos | "vamos escolher junto nao so o novo curriculum mais o formato de criação das aulas" |
| Direção visual da trilha: **B, Medalhão**, com acabamento profissional | "gostei do B, porem ta com muita cara de IA"; depois, "V2" |
| Formato da aula: **bancada** | "Sim. Monte o mockup de uma aula no formato bancada"; depois, "prossiga" |
| As animações são produzidas pelo agente, com qualquer skill, plugin ou MCP | "que voce produza pode utilizar quais quer skill, plugin ou mcp" |
| O visual Medalhão vale para o **app inteiro** e substitui o "céu navegável" | opção "App inteiro" |
| "Apagar todas as aulas" inclui **o conteúdo-fonte delas e os validadores ligados a ele**, e o currículo novo começa do zero | opção "Tudo, inclusive a fonte" |

## 3. Objetivos, não objetivos e antiobjetivos

**Objetivos deste pacote ("design primeiro"):**
1. A trilha nova, na direção Medalhão, ligada à jornada canônica que já existe
   (`JourneyProgressService`).
2. O motor da aula-bancada, com os tipos de passo da seção 5.
3. **Duas ou três aulas-bancada de exemplo**, com conteúdo revisado pelo dono,
   que servem de molde para o projeto seguinte **[escolha do agente]**.
4. A retirada das aulas atuais e do conteúdo-fonte delas, com o recomeço
   definido na seção 6.
5. **O mundo visual Medalhão no app inteiro.** Um DESIGN.md novo substitui o
   "céu navegável". Uma ADR nova substitui a
   [ADR da identidade galaxy dark](../../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md).
   Os tokens de `radiant-app/src/ui/` são refeitos, e os contratos de contraste
   e o `visual:qa:strict` são remedidos sobre eles. O Pixel continua como
   mascote.

**Fases [escolha do agente]:**
1. Tokens, DESIGN.md, a trilha, o motor da aula-bancada e as aulas de exemplo.
2. As demais telas no mundo novo: Perfil, assinatura, revisão, onboarding e
   resultados.

As duas fases chegam ao aluno **na mesma build de loja**, junto com o primeiro
lote do currículo novo. Uma build com dois mundos visuais ou com só duas ou três
aulas não vai para a loja.

**Não objetivos:** o currículo novo e a produção em série. Isso é o projeto
seguinte, decidido em conjunto com o dono (FILA 45). Também ficam de fora
ligas, social, voz e vídeo.

**Antiobjetivos**, que fazem o pacote falhar mesmo funcionando:
- Uma simulação que ensine física errada. Ela precisa ser simplificada **e**
  correta no que afirma.
- Animação que custe fluidez num Android de entrada (G6, AVD
  `radiant-entrada-api34`).
- Um mundo visual que pareça template de IA, que foi o motivo de rejeitar o B v1.
- Um aluno que perca XP ou sequência na troca.
- Uma build da loja com a trilha vazia.

## 4. A trilha (direção Medalhão)

Vale a [prancheta da trilha](../../design/2026-10-21-trilha-medalhao.html).

- **Caminho:**
  - zigue-zague vertical, com os nós alternando entre esquerda e direita;
  - pontilhado que sai da lateral de um nó e desce até o topo do seguinte;
  - o trecho percorrido fica na cor do estado, e o restante, apagado.
- **Nó: uma medalha com relevo.**
  - Leva a ilustração do tema da aula, em três tons, com a luz de cima à
    esquerda. O objeto pode passar da borda da medalha.
  - Os estados são concluída (ouro), próxima (cor da unidade, anel pulsando) e
    bloqueada (só a silhueta do tema).
  - A ilustração só se move nos nós desbloqueados.
- **Estrelas:** só nas concluídas, pela régua que já existe: 1, 2 ou 3 pela
  primeira resposta de cada item (ADR da régua de 2026-10-18).
- **Unidade:** título e barra "N de M" no topo da trilha, sem etiqueta acima do
  título.
- **O momento:** ao voltar de uma aula concluída, o trecho até a próxima se
  acende, o Pixel percorre o caminho e para ao lado do nó, o nó cresce e o
  "Continuar" aparece. Com "reduzir movimento", tudo isso vira troca
  instantânea.
- **HUD e abas:** ícones desenhados, sem emoji nem caractere de texto.
- **Tema por aula:** um tema por assunto, compartilhado pelas aulas desse
  assunto, como o gantry em todas as de tomografia **[escolha do agente; o dono
  não respondeu se uma animação por tema basta]**.

## 5. A aula-bancada

Vale a [prancheta da aula](../../design/2026-10-21-aula-bancada.html). A aula é uma sequência de passos de 3 a 5
minutos. Na maioria deles, o aluno **mexe no equipamento ou na imagem**.

| Tipo de passo | O que o aluno faz | Na prancheta |
| --- | --- | --- |
| Abertura | Vê a medalha do tema e uma frase sobre o que vai fazer | tela 1 |
| Explorar, guiado | Recebe uma ação só, a imagem responde ao vivo e o Pixel nomeia o efeito | tela 2, kV até 100 |
| Desafio, livre | Atinge um alvo sem receber o valor; o erro indica a direção na própria bancada | tela 3, igualar a referência |
| Leitura crítica | Diagnostica o defeito de uma imagem; cada alternativa errada tem explicação própria | tela 4, imagem granulada |
| Corrigir | Conserta com a mão o que diagnosticou | tela 5, subir o mAs |
| Fim | Resumo em duas linhas, XP e estrelas pela primeira tentativa | tela 6 |

**Regras que já valem e continuam:**
- primeiro contato sem custo de vida;
- o item errado volta uma vez no fim;
- estrelas pela primeira resposta;
- explicação junto da resposta;
- frase de 0 estrela sem "quase" (FILA 47).

O passo de bancada é um **tipo novo de atividade** no
`ActivityRendererRegistry`. Os renderizadores que já existem (hotspot,
comparação, ordenação, pares, múltipla escolha) continuam disponíveis como
passos da mesma aula.

**Bancadas do primeiro pacote [escolha do agente]:**
- **Exposição:** kV e mAs sobre um fantoma simulado, como na prancheta.
- Uma segunda bancada, entre **colimação** (abrir e fechar o feixe e ver dose e
  área) e **posicionamento** (girar o paciente até a incidência). A escolha fica
  para o plano, depois de medir o custo de cada uma.

**Rigor:** a simulação é um **fantoma estilizado**, nunca uma incidência real, e
o rótulo diz isso. Cada frase de física de cada aula passa pela revisão de
conteúdo do dono antes de ir ao app.

## 6. A retirada das aulas atuais e o recomeço

Quem chega a cada ponto afetado, e o que acontece:

| Quem | O que acontece |
| --- | --- |
| Aluno ativo na `1.4.0` com progresso | Recomeça a trilha do início. XP total, sequência, vidas e assinatura ficam |
| Aluno com revisão vencida das aulas antigas | Os itens antigos saem da fila de revisão, e nada vencido fica pendurado |
| Aluno que restaura um backup antigo do iCloud | O backup traz IDs de aulas que não existem mais. Eles são ignorados sem erro, e XP e sequência do backup continuam valendo |
| Aparelho que volta para a `1.4.0` | Vale a guarda de `schemaVersion` desconhecido (G7): a versão antiga não grava por cima |
| Aluno novo | Só vê a trilha nova |
| Roteiros Maestro e testes que dependem das aulas atuais (FILA 59, E1, caminho 3) | São reescritos sobre as aulas novas no mesmo pacote |
| Capturas e texto da loja | Mudam o que o app mostra. **Texto de loja é decisão do dono** (política da FILA) |

**Momento da troca [escolha do agente]:** as aulas antigas saem do app na mesma
build em que as novas entram. Na `main` elas podem sair antes, mas nenhuma build
de loja vai com a trilha vazia.

**O que sai do repositório.** O conteúdo das aulas está espalhado. Medido em
2026-10-21:
- os dados do app em `radiant-app/src/data/` (`lessons.ts`, `ai-lessons.ts`,
  `catalog.ts`, `ai-catalog.ts`, `journey/`);
- os manifestos em `content-manifest/`;
- o lote de produção do G3 e seus testes em
  `radiant-app/src/features/student-checkpoints/`;
- o currículo V3 em `docs/curriculum-v3/`;
- a governança e as competências em `conteúdo/` e `Conteúdo/`;
- os validadores `content-*` do `.loop/project.yaml` e os scripts de
  `scripts/content/`.

**Antes de apagar, o plano produz um inventário** com cada arquivo ou pasta
marcado "sai" ou "fica", e **o dono aprova essa lista**. A única ambiguidade é a
biblioteca de referência: os livros e extrações em `Conteúdo/fontes` e
`Conteúdo/extrações`, a taxonomia e o registro de direitos. Ela é a fonte
*das aulas* ou matéria-prima do currículo novo? O inventário a separa para o
dono decidir. Remover um validador do `.loop/project.yaml` muda a política do
Loop para todo agente futuro, e por isso entra na mesma aprovação.

## 7. Como é feito [escolha do agente]

- **`@shopify/react-native-skia` 2.2.12**, a versão empacotada pelo Expo SDK 54:
  - `RuntimeEffect` (shader na GPU) para a radiografia simulada, com uniformes
    de kV e mAs. Recalcular pixel a pixel no JS, como faz a prancheta, não
    sustenta 60 fps no aparelho;
  - `Skottie` para tocar as ilustrações em Lottie dentro do mesmo runtime;
  - fica uma única dependência nativa nova.
- **Reanimated 4**, que já está no app, para as interações e o "momento" da
  trilha.
- **Produção das ilustrações:** desenho em SVG, no estilo das pranchetas,
  animado em Lottie com a skill aberta `text-to-lottie` (diffusionstudio, MIT).
  A skill é lida antes de ser usada. Rive ficou fora porque não é empacotado
  pelo Expo e a autoria por agente depende de MCPs de terceiros sem
  verificação. O Brilliant usa Rive, e isso foi considerado.
- **Consequência:** dependência nativa exige **build nova do dev client e da
  loja**. Uma atualização OTA não leva este pacote. Build e distribuição
  continuam com o dono.

## 8. Acessibilidade e desempenho

- Toda bancada tem uma alternativa operável sem gesto fino: botões de − e +
  além do arrasto, alvos de 48 dp e rótulo de leitor de tela com o valor ("70
  kV").
- O que a imagem mostra também aparece em texto no feedback, porque a imagem
  sozinha não é a única fonte da resposta.
- Com "reduzir movimento", as ilustrações ficam paradas no quadro principal, e o
  "momento" vira transição instantânea.
- Medição no AVD de entrada antes de liberar: a trilha a 60 fps rolando com as
  ilustrações visíveis, e a bancada respondendo ao dedo sem atraso perceptível.
  O medidor do G6 (PR #59) serve de base.

## 9. Pesquisa de 2026-10-21, resumo

- Duolingo Chess: cerca de 75% quebra-cabeça, primeiro guiado e depois livre,
  com o treinador Oscar ([blog](https://blog.duolingo.com/chess-course)).
- Brilliant:
  - problemas manipuláveis e "Game Feel": comemoração no acerto e
    encorajamento no travamento ([ustwo](https://ustwo.com/work/brilliant/));
  - em 2023, migrou a trilha e a sequência de Lottie para Rive
    ([Rive](https://rive.app/blog/how-brilliant-org-motivates-learners-with-rive-animations)).
- Simuladores de radiografia, em desktop e VR
  ([PMC8738456](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8738456/),
  [VitaSim/ASRT](https://www.asrt.org/main/continuing-education/earn-ce/featured-ce/xray-simulator-vitasim)).
- Formatos abertos de aula, como referência para o projeto seguinte:
  - Oppia: cartão com conteúdo, interação, resposta, dica e caminho de volta;
  - H5P: pontos na imagem, arrastar e soltar, cenário com ramificação;
  - Perseus, da Khan Academy: exercícios montados com widgets.

## 10. O que fica para o construtor

Fica para o construtor:
- a estrutura de componentes;
- o formato do dado de cada tipo de passo;
- o shader exato;
- a ordem das tarefas;
- os testes.

Tudo isso desde que respeite os contratos acima e as guardas que já existem: o
`schemaVersion`, o contraste AA medido na composição e o easing do Reanimated.

## 11. Adendo de 2026-10-21, à noite: o Pixel e o app inteiro sem cara de IA

**Estado:** aprovado pelo dono em 2026-10-21, em duas respostas: "Aprovado o
Pixel. Siga para a prancheta do app inteiro." e "Aprovada a prancheta do app
inteiro. Registre no repositório e escreva os planos."
**Pranchetas:** o [Pixel no Medalhão](../../design/2026-10-21-pixel-medalhao.html)
e o [app inteiro no Medalhão](../../design/2026-10-21-app-medalhao.html).

**Origem.** Depois da fundação visual, o dono pediu para "revirar todo o app com
um intuito em mente retirar a cara de app feito por IA", com Perfil e
Configurações incluídos. A auditoria de 2026-10-21 capturou oito telas no
simulador e varreu o código. Ela achou dez padrões, e o maior deles era o Pixel
em render 3D brilhante, que contradiz as ilustrações em três tons. O dono pediu
então: "Redesenhe o Pixel no estilo Medalhão (três tons, luz de cima-esquerda),
mantendo o personagem."

### 11.1 O Pixel

- **Mesmo personagem.** Robô médico de jaleco, estetoscópio, tela escura no
  rosto, antena, orelhas azuis, base flutuante e o aceno.
- **Desenho vetorial em três tons por material**, com a luz de cima à esquerda.
  Os valores estão no DESIGN.md (`pixel-*`). Saem halo, partícula, painel
  holográfico e o PNG 3D.
- **A tela do rosto fica onde está:** x 168, y 200, 168 × 112 numa caixa de
  576 × 864. `PixelFace`, as sete expressões e os dois contratos de geometria
  continuam valendo.
- **Poses:** acenar, apontar, comemorar, pensar e repouso.
- **Abaixo de 64 pt, só a cabeça [escolha do agente, vista na prancheta].**
- **Quatro momentos:** boas-vindas, ao lado da próxima aula, a explicação na
  aula e a comemoração do resultado. Ele sai da revisão, da avaliação e dos
  cartões.

### 11.2 As regras para todas as telas

São seis, mais a regra do texto, e estão no DESIGN.md como **A Regra Sem Cara de
IA**: o título diz a coisa, cartão só para o que se toca, cada número uma vez,
ouro é conquista, o Pixel fala e não decora, e movimento com motivo. A
auditoria mediu, em 2026-10-21, 29 etiquetas em caixa alta em 18 arquivos, 20
textos com travessão de efeito e 20 com jargão interno.

### 11.3 Tela a tela

| Tela | Direção aprovada |
| --- | --- |
| Boas-vindas | A primeira tela é uma bancada: o aluno mexe no kV antes de qualquer cadastro. O Pixel se apresenta numa linha |
| Estude | A trilha de medalhas, com a cabeça do Pixel ao lado da próxima aula. A revisão devida é uma linha acima da trilha, e o lembrete, uma linha com interruptor que só aparece depois da primeira aula |
| Resultado | A medalha do tema é cunhada em ouro, as estrelas caem nela, o XP aparece em número grande sem caixa, e o Pixel comemora uma vez |
| Recompensa sem recompensa | A tela "Conquista indisponível" deixa de existir. A rota volta para a trilha |
| Revisão | Título, contagem real ("5 itens de Fundamentos"), a lista dos itens com a medalha de origem, e um botão embaixo. Sem anel e sem Pixel |
| Avaliação | Medalha de prata da unidade, a regra numa frase e o botão. Fechada, a mesma tela diz quantas aulas faltam |
| Perfil | Estante de medalhas, a sequência como semana e as metas de hoje como linhas. Saem os blocos de métrica, a faixa laranja e os chips |
| Configurações | Lista agrupada do iOS, com explicação só no rodapé do grupo. O backup ainda indisponível aparece como "Em breve" |
| Assinatura | Uma frase direta, os dois planos lado a lado como medalhas, o anual em ouro e com o preço por mês, um botão só e o texto legal inteiro, menor |
| Sem vidas | Os cinco corações, o tempo até a próxima vida, "Revisar agora" como ação principal e a assinatura como link |

**O que não muda:** as regras de vida, de estrela, de avaliação e de revisão.
Os números nas pranchetas são de demonstração. O texto legal da assinatura
continua inteiro.

**Fora desta prancheta:** a aula, que segue a prancheta da aula-bancada (seção
5).
