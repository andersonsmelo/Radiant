# Assessment A — revisão de design da trilha (Estude) e da lição

> **Anexo da [reavaliação da trilha](2026-10-16-reavaliacao-da-trilha.md).**
> Avaliação isolada feita por subagente, no método `impeccable critique`. As
> capturas e os arquivos brutos citados (`trilha-NN.png`, `licao-NN.png`,
> `errado-NN.png`, `hierarchy-trilha.json`) ficaram no espaço temporário da
> sessão e **não foram versionados**. Para reproduzir, veja "Como reproduzir"
> na síntese.

**Data:** 2026-10-16, à tarde, depois do pacote de confiança (`84b4a60`) e do ajuste dos roteiros (`98cf01c`).
**Revisor:** diretor de design de produto educacional mobile, trabalhando isolado: sem detector, sem simulador e sem Maestro.
**Superfície:** a aba Estude e a lição aberta a partir dela, em modo **Operate**, em que o aluno conclui a tarefa de estudar.
**Material:** 46 capturas de hoje (iPhone 17, 402×874 pt), `PRODUCT.md`, `DESIGN.md`, a avaliação da manhã (20/40), o benchmark de mercado e o código citado.

Grau de cada afirmação:
- **[visto]**: aparece na captura;
- **[código]**: confirmado no código;
- **[doc]**: está em documento do projeto;
- **[mercado]**: vem do benchmark;
- **[inferido]**: é conclusão minha, sem reprodução.

---

## 1. Veredito de especificidade

**O sistema visual é autoral no documento e intercambiável na tela.**

O `DESIGN.md` constrói uma metáfora própria da radiologia [doc]:
- o vazio escuro como "a condição real em que radiologia se lê";
- o azul da janela de contraste;
- o ciano do fósforo do intensificador.

Nenhuma tela capturada usa essa metáfora para aquilo que ela promete [visto]:
- não há imagem;
- não há escala de cinza;
- não há janela e nível;
- não há estrutura para tocar.

O que o aluno vê são cartões de texto sobre um céu estrelado e um robô de jaleco numa faixa amarela. Basta trocar "Efeito Compton" por "Capitania hereditária" para obter um app de história sem mudar um pixel.

O que é próprio do Radiant hoje está fora da tela:
- o rigor das regras de progressão [código];
- a ética da gamificação, sem ligas e com revisão sem custo [doc].

Um único elemento de assinatura visual do domínio mudaria o veredito, por exemplo:
- uma miniatura radiográfica no cartão PRÓXIMO;
- um feedback que mostra a janela de pulmão quando a pergunta é sobre −1000 HU.

A trilha 4 ("Matéria, Energia e Radiação", V2, bloqueada) tem títulos autorais, como "Ponte até o detector" e "Atenuação e transmissão", e checkpoints. É a única parte da trilha que já soa como um curso de radiologia, e não como um banco de quiz [visto].

---

## 2. Heurísticas de Nielsen

| # | Heurística | Manhã | Agora | Achado-chave |
|---|---|---|---|---|
| 1 | Visibilidade do estado | 2 | **3** | As estrelas agora são da tentativa, a faixa diz "Abre ao concluir…" e Estude abre no PRÓXIMO [visto]. Ainda assim, uma lição com **0 de 1** sai como "A lição foi concluída", conta "3 de 7 etapas" e o nó vira verde "Concluído" [visto] [código: `LessonOutcomeService.resolveNode` paga e conclui na primeira vez, sem olhar o acerto]. O cabeçalho "Radiação, Modalidades e Equipamento · 0 de 7" fica **acima** dos nós da trilha 1 [visto: `trilha-00` → `trilha-01`]. |
| 2 | Correspondência com o mundo real | 2 | **1** | Cinco nomes para o mesmo contêiner: trilha, unidade ("Conquista da unidade", "Progresso da unidade"), nível ("PRÓXIMO NÍVEL"), etapa e aula ("Avalie a aula"). "UNIDADE 3" no topo da lição é o **ordinal da lição** dentro da trilha [código: `eyebrow: Unidade ${lessonOrder}`]. 16 das 18 lições abrem com texto de molde: "consolidar o conceito central de **quiz: interação das radiações…** antes do quiz" [visto] [código]. Há ainda "deflectido", "a correta janela de pulmão" e, no alerta, "Esse **nó** ainda não está **elegível** na jornada" [código]. A queda reflete inspeção mais funda, não regressão. |
| 3 | Controle e liberdade | 3 | **3** | O "X" funciona a qualquer passo, trocar de alternativa antes de "Conferir" não custa nada e a posição é preservada. Falta a saída que a própria tela pede: "Refazer agora é o caminho mais curto" não tem botão [visto]. |
| 4 | Consistência | 2 | **2** | O fim com 0 estrela usa a mesma faixa amarela de celebração e o Pixel em `state="celebrate"` com rótulo "Pixel comemorando" [código: `LessonSummary.tsx`]. As estrelas de nota e as 5 estrelas de "Avalie a aula" ficam na mesma tela com sentidos diferentes [visto]. A revisão futura e o nó bloqueado têm o mesmo cartão tracejado com cadeado [visto]. |
| 5 | Prevenção de erro | 2 | **3** | Errar na revisão não custa mais vida [código: `isReview`] [doc: ADR de 2026-10-16]. "Conferir resposta" é uma confirmação explícita. Na lição, o erro continua custando vida sem aviso prévio, mas o HUD está visível. |
| 6 | Reconhecer em vez de lembrar | 3 | **2** | Na trilha, o PRÓXIMO está sempre à vista. No momento em que se aprende, porém, o feedback abre **em outra tela**, sem a pergunta e sem as alternativas [visto: `errado-04` → `errado-05`]. O aluno precisa lembrar que marcou "0 HU" para entender o "−1000 HU" do texto. Nenhuma alternativa é marcada como certa ou errada. |
| 7 | Flexibilidade e eficiência | 1 | **1** | Não há teste para pular, nem prática por fraqueza, nem escolha de foco. A técnica formada percorre as 7 lições de Fundamentos, incluindo "Qual órgão regulamenta…", antes de qualquer coisa nova. |
| 8 | Estética e minimalismo | 3 | **3** | O ofício visual é limpo e o estado vem em três canais: cor, ícone e texto [visto]. Mas a trilha ocupa **cerca de 18 telas de rolagem** [visto: `trilha-00…17`]: metade dos cartões é "Revisar …" e as trilhas 3 e 4, bloqueadas, aparecem nó a nó. Na lição, 2 das 4 telas são texto de molde. |
| 9 | Recuperação de erro | 1 | **2** | A trilha trancada agora diz o que falta, e o resumo não mente mais as estrelas. Dentro da lição, depois de errar, não há nova tentativa, item parecido nem explicação do distrator: o feedback de acerto e o de erro são **o mesmo texto** [código: `LegacyLessonAdapter`, `feedback: { correct: explanation, incorrect: explanation }`]. |
| 10 | Ajuda e documentação | 1 | **2** | Duas ajudas no contexto são novas: a dica da faixa e "4 · +1 em 25 min" sob as vidas [visto]. Nada explica para que serve a revisão, por que ela abre "17/10/2026 às 16:35", nem o que muda com 0 estrela. |
| | **Total** | **20** | **22/40** | **Aceitável, no terço inferior da faixa (20–27).** |

**Leitura da diferença.** O pacote de confiança rendeu cerca de 5 pontos reais, em visibilidade, prevenção, recuperação e ajuda. Esta revisão tira 2 deles com achados que a manhã não pegou, em linguagem e no feedback separado da pergunta. O ganho líquido de +2 subestima o conserto do resumo e da trava, que eram os defeitos de confiança mais graves. Também mostra que o teto atual não está na trilha: está **dentro da lição**.

---

## 3. Carga cognitiva

| # | Item do checklist | Resultado | Evidência |
|---|---|---|---|
| 1 | Um foco por tela | passa | Estude abre centrada no PRÓXIMO; a lição mostra um passo por vez [visto] |
| 2 | Blocos de tamanho digerível | **falha** | Não há divisão dentro da trilha: 13 a 15 nós seguidos por trilha, cerca de 50 no total [visto] |
| 3 | Agrupamento do que é afim | **falha** | A revisão de cada lição fica intercalada na linha principal, e não reunida [visto] |
| 4 | Hierarquia visual clara | passa na trilha, **falha no resumo** | Com 0 estrela, a faixa amarela celebratória domina, enquanto o texto diz "Ainda não fechou" [visto] |
| 5 | Uma decisão por vez | passa | Só "Conferir resposta" depois de escolher [visto] |
| 6 | Poucas opções | passa | 4 alternativas por pergunta |
| 7 | Sem exigir memória de trabalho | **falha** | O feedback aparece sem a pergunta e sem a alternativa marcada [visto] |
| 8 | Revelação progressiva | **falha** | As trilhas bloqueadas e todos os seus nós aparecem expandidos; o mesmo vale para as concluídas [visto] |

São **4 falhas de 8**, o que dá **carga alta**, no limite: 3 das falhas estão na trilha e 1 no ponto mais caro, o feedback.

**Decisão com mais de 4 opções:** só "Avalie a aula", com 5 estrelas. Ela é opcional e de baixo risco, mas chega na pior hora, logo depois de um erro, e com o mesmo glifo das estrelas de nota [visto].

---

## 4. Jornada emocional

**Pico e fim.** O fim de uma lição errada é a tela que o aluno leva para casa, e ela manda quatro sinais contraditórios ao mesmo tempo [visto: `errado-10`]:
- celebração: faixa amarela, Pixel comemorando e "+10 XP";
- cobrança: "Ainda não fechou. Refazer agora…";
- dever cumprido: "A lição foi concluída";
- pedido: "Avalie a aula".

O resultado é confusão, e não calor. O ADR do pacote já registrou o Pixel e a frase como pendências [doc]. O que ele não registrou é que a frase **manda refazer sem oferecer o botão**.

**O pico do acerto também está inflado.** Em "Marca cheia! Leitura impecável." e "Três estrelas. Nada passou despercebido.", três estrelas valem **uma** pergunta de múltipla escolha. Um aluno exigente percebe o descompasso, e o rigor perde credibilidade justamente no elogio.

**Vales:**
1. **Ideia-chave** [visto: `licao-02`]: a tela promete conteúdo e entrega uma frase sobre o objetivo da etapa. É a primeira quebra de confiança de toda lição.
2. **O erro**: no mesmo instante aparecem "Vamos reforçar" e o coração partido no HUD [visto: `errado-05`]. O texto não diz que a resposta estava errada nem por que "0 HU" é a água. O aluno sente o custo antes de entender o erro.
3. **A trilha longa**: 18 telas em que a maior parte é cadeado [visto].

**Momentos de alto risco:**

| Momento | Risco | Situação hoje |
|---|---|---|
| Erro na lição | Associar errar a punição | −1 vida e nenhuma segunda chance [visto] |
| Perda de vida | Sair do app | O timer "+1 em 25 min" ajuda; a revisão já não cobra [visto] [código] |
| 0 estrela | Duvidar do produto | Fim contraditório (acima) |
| Lembrete | Parecer cobrança | "Sem pressão. Sem cobrança." O tom é bom, mas "em dias em que você decidir estudar" é vago (quem decidiu estudar não precisa de lembrete) e não diz o horário (18h–21h) [visto] [doc] |

---

## 5. Pontos fortes e problemas prioritários

### Pontos fortes

1. **Honestidade de estado recuperada.** Hoje a tela entrega:
   - as estrelas da tentativa, com o recorde à parte;
   - "Revisão concluída" sem pedir nota de aula;
   - a faixa que diz o que abre a próxima trilha;
   - a revisão como prática sem custo de vida;
   - Estude abrindo no ponto do aluno [visto] [código].

   É raro um app desse porte corrigir em horas a mentira que a crítica apontou de manhã.
2. **O estado lê bem.** A distinção entre concluído (verde, check), próximo (anel azul e pílula "PRÓXIMO") e bloqueado (tracejado, cadeado) usa cor, ícone e texto juntos, como pede a Regra da Cor Muda [visto] [doc]. O HUD mostra vidas, timer, XP e sequência sem ruído.
3. **A direção certa já existe no próprio app.** A trilha V2 tem títulos autorais e "Checkpoint · Avaliação N de 5" [visto]. O código já tem os renderizadores de hotspot, correspondência, ordenação e comparação [código, segundo a avaliação da manhã]. O salto não exige um sistema novo, só ligar o que existe.

### Problemas prioritários

**P0-1 — A lição testa antes de ensinar e tem uma pergunta só.**
- **O que acontece:** a lição tem 4 passos:
  1. abertura de molde;
  2. "Ideia-chave" de molde;
  3. **uma** pergunta;
  4. feedback.

  A segunda pergunta do conteúdo não é descartada: ela é **reservada para o nó de revisão** [código: `buildIntroBlock` usa `questionIndex` 0 e `buildReviewBlock` usa o 1]. Isso explica o "Passo 3 de 4" e o "1 de 1 corretas" (pista a, confirmada). Cada lição dura cerca de 1 minuto [visto: relógio 17:24→17:25 e 17:33→17:34]. Só as 2 lições legadas têm texto de abertura próprio [código: `contextBody` só em `lessons.ts`].
- **Por que importa:** é metade das telas sem conteúdo, contra a promessa de "raciocinar sobre imagem" [doc]. O mercado trabalha com cerca de 15 exercícios por lição [mercado].
- **Correção concreta, sem conteúdo novo:**
  - remover os passos 1 e 2 quando não houver texto autoral;
  - a lição passa a usar as **duas** perguntas;
  - o item errado volta no fim, sem custo;
  - a revisão sorteia entre as perguntas das lições já feitas.

  Em seguida, um item sobre imagem por trilha, com o `HotspotStepRenderer`.
- **Comandos:** `/impeccable distill` para cortar as telas de molde e `/impeccable shape` para a forma da lição.

**P1-2 — O fim reprovado se contradiz e não oferece a saída que anuncia.**
- **O que acontece:** "Ainda não fechou. Refazer agora…" aparece junto com "A lição foi concluída", "+10 XP", "3 de 7 etapas", a faixa amarela, o Pixel comemorando, e o nó verde "Concluído" na trilha [visto] (pista c, confirmada). O único botão é "Continuar".
- **Por que importa:** o produto promete progressão por domínio [doc]. Com 0 acerto, a trilha avança igual.
- **Correção concreta:**
  - abaixo do corte, o botão primário vira "Refazer agora (1 min)" e o secundário "Seguir mesmo assim";
  - o subtítulo vira "Você chegou ao fim. 0 de 1 certa.";
  - a faixa fica neutra, sem amarelo, e o Pixel entra num estado de apoio, não de comemoração;
  - o nó da trilha mostra "Concluído · refazer para fechar".

  Exigir aprovação para avançar é decisão de progressão e precisa de ADR.
- **Comandos:** `/impeccable clarify` para o texto e `/impeccable harden` para o estado de reprovação.

**P1-3 — O feedback do erro aparece longe da pergunta, não diz que errou e não explica a escolha.**
- **O que acontece:**
  - a pergunta e as alternativas somem na tela de feedback [visto];
  - o título "Vamos reforçar" evita dizer "incorreta", embora o leitor de tela anuncie "Resposta incorreta." [código];
  - o texto é o mesmo do acerto [código].
- **Por que importa:** "Rigor primeiro, calor depois" [doc]. Ao contrário do que se faz no mercado (Explain My Answer gratuito, Attending Tip [mercado]), aqui o momento de aprender é o mais pobre da lição.
- **Correção concreta:**
  - o feedback fica **na mesma tela** da pergunta, com a escolhida em rosa crítico com ícone ✕ e a correta em verde com ✓;
  - o título diz o fato, por exemplo "Não é 0 HU: o ar fica em −1000 HU";
  - uma linha explica o distrator ("0 HU é a água"), com um campo novo `optionRationale` no conteúdo.
- **Comandos:** `/impeccable layout` e `/impeccable clarify`.

**P1-4 — Dá para acertar sem ler: a resposta certa tende a ser a mais longa e nunca é sorteada de lugar.**
- **O que foi medido [código]:**
  - nas 32 perguntas das lições geradas, a correta é **estritamente a mais longa em 18 (56%)**, contra 25% esperados ao acaso;
  - nas 16 primeiras perguntas, as que a lição usa, são 10;
  - a correta está na posição 2 em só **2 de 32**;
  - nada embaralha as alternativas na lição ou na trilha (o único `shuffle` está no piloto V3).
- **Pista b, corrigida:** a premissa vale para a lição de medicina nuclear (59 contra 53 caracteres), mas **não** para a de Compton. Lá a correta, "Efeito Compton", é a **mais curta** (14 contra 32).
- **Por que importa:** se o acerto vem de um padrão do teste, a SM-2 e qualquer métrica futura de domínio medem esperteza, não conhecimento.
- **Correção concreta:**
  - embaralhar as alternativas com semente por item e aluno;
  - um validador editorial que reprove a correta mais longa que o maior distrator × 1,2;
  - reescrever os 6 casos marcados, entre eles "Acessórios" q2 (112 contra 48 caracteres) e "Qualidade de imagem" q2 (84 contra 39).
- **Comando:** `/impeccable harden`, junto com o validador de conteúdo.

**P2-5 — A trilha não tem estrutura e o vocabulário dela desorienta.**
- **O que acontece:**
  - cerca de 18 telas de rolagem, com revisões intercaladas e trilhas bloqueadas expandidas [visto];
  - a trilha 4 repete física (Estrutura e carga, Energia por fóton) **depois** de "Prática, Qualidade e Profissão" [visto];
  - o cabeçalho nomeia a trilha 2 sobre os nós da trilha 1 [visto];
  - "Quiz:" aparece em todo título gerado, e "Revisar Quiz: …" se trunca [visto] [código] (pista e, confirmada);
  - "UNIDADE 1" aparece numa lição da trilha 2 [visto] [código].
- **Correção concreta:**
  - a trilha concluída vira um cartão-resumo recolhido, e a bloqueada fica só a faixa, com "ver lições";
  - as revisões saem da linha e viram um nó "Revisões de hoje (n)" por trilha;
  - o cabeçalho fica fixo, acompanhando a trilha visível;
  - adotar um glossário único: **trilha › lição › revisão › avaliação**, sem "unidade", "nível" nem "aula";
  - remover o prefixo "Quiz:" na sincronização do catálogo.
- **Comandos:** `/impeccable layout`, `/impeccable distill` e `/impeccable clarify`.

---

## 6. Bandeiras vermelhas por persona

**Jordan, primeira vez**
- Lê "Quiz: …" e "UNIDADE 1" na primeira lição da trilha 2 e não sabe se está no começo ou no meio [visto].
- A "Ideia-chave" não traz ideia nenhuma, e a pergunta chega sem ensino prévio.
- Erra, vê o coração partir e o texto "Vamos reforçar". Depois lê "A lição foi concluída" e o nó fica verde, então conclui que pode seguir. O app disse "refazer" sem dar como.
- Na trilha, encontra quatro palavras para a mesma coisa.

**Casey, no celular entre plantões**
- O ponto forte para Casey: Estude abre no PRÓXIMO, a lição dura cerca de 1 minuto e o botão fica no rodapé, ao alcance do polegar [visto].
- O risco: para 5 minutos de estudo, Casey abre umas 4 lições e passa por cerca de 8 telas de molde para responder 4 perguntas.
- O lembrete só sai entre 18h e 21h [doc], que costuma ser horário de plantão. Não há escolha de horário [inferido].
- A trilha inteira exige 18 telas de rolagem a uma mão quando Casey quer olhar o que vem adiante.

**Sam, com VoiceOver e texto em AX5**
- O rótulo do nó omite o tipo, Lição ou Revisão. Ele lê "Revisar Quiz: … Disponível em 17/10/2026 às 16:35." [código: `accessibilityLabel` = título + status], com data e hora numéricas em vez de "amanhã, 16h35".
- São cerca de 50 nós para atravessar, e não há marcação de cabeçalho por trilha [inferido: a faixa tem rótulo, mas o papel de cabeçalho não foi confirmado].
- No resumo com 0 estrela, o leitor anuncia **"Pixel comemorando"** [código].
- Em AX5, os títulos deixam de truncar (`numberOfLines` livre) [código], o que é certo, mas alonga a trilha ainda mais. Recolher as trilhas (P2-5) é também uma correção de acessibilidade.
- O anúncio "Resposta incorreta." é mais honesto que o título visual "Vamos reforçar" [código]: o visual deveria se igualar a ele.

**Técnica em radiologia formada (persona do projeto)**
- Passa as 7 lições de Fundamentos e não tem como pular "Qual órgão regulamenta a profissão?" [visto] [código].
- Acerta pelo padrão da alternativa mais longa sem ler (P1-4) e sai achando o app fácil demais.
- Estranha "Preservação de alimentos por irradiação" dentro de "Prática, Qualidade e Profissão", e "deflectido" no lugar de "defletido".
- Não encontra nenhuma radiografia, a única coisa que ela abriria um app para treinar.
- A trilha 4, a única com cara de curso, está no fim e ensina física de novo.

---

## 7. Comparação com o mercado

| Eixo | Radiant hoje | Líderes | Menor mudança que fecha mais distância |
|---|---|---|---|
| Tamanho da lição | 1 pergunta e cerca de 1 min; 2 de 4 telas são molde [visto] [código] | Cerca de 15 exercícios no Duolingo; problemas encadeados no Brilliant; 8 a 12 interações sugeridas [mercado] | Usar as 2 perguntas, devolver a errada no fim e cortar as telas de molde: 2 a 3 interações sem escrever conteúdo |
| Interação com imagem | Nenhuma [visto] | Chess com cerca de 75% sobre o tabuleiro; IMAIOS e Radiopaedia com imagem e sem trilha; ninguém junta trilha e imagem em radiologia [mercado] | **Um** item de hotspot por trilha, com o renderizador que já existe. É o diferencial que ninguém ocupa |
| Estrutura do caminho | Linha única de cerca de 50 nós, sem unidades internas e com revisões intercaladas [visto] | Seção, unidade e nó, com guidebook, Lendário e "Jump here" [mercado] | Recolher as trilhas concluídas e bloqueadas e tirar as revisões da linha |
| Revisão | Paralela e sem custo, um avanço de hoje [código]; SM-2 por **lição**, com 1 item [doc] | Por item (HLR, Babbel 1→4→7→14→60 dias), dentro do caminho como prática personalizada [mercado] | Revisão que sorteia itens das lições vencidas, e não o q2 fixo |
| Adaptação | Nenhuma | Birdbrain, Course Challenge, nivelamento inicial [mercado] | Um teste de 5 itens no topo de cada trilha que, se aprovado, a marca como concluída |
| Motivação | XP, sequência, vidas e missões, sem ligas [visto] [doc] | Sequência com congelamento, marcos e Lendário [mercado] | Animação de marco da sequência (+1,7% de retenção D7 no Duolingo [mercado]); não inflar as 3 estrelas em lição de 1 item |
| Feedback do erro | Mesmo texto para acerto e erro, longe da pergunta [código] [visto] | Explain My Answer gratuito, Attending Tip, passo a passo automático depois do erro [mercado] | Feedback no lugar da pergunta, com a alternativa marcada e uma linha sobre o distrator (P1-3) |

**A menor mudança que fecha mais distância de uma vez:** uma lição com as 2 perguntas embaralhadas, feedback no lugar, o erro de volta no fim, sem telas de molde e com o fim reprovado oferecendo "Refazer". Ela mexe em quatro eixos (tamanho, revisão, feedback e honestidade) **sem precisar de conteúdo novo**.

---

## 8. Observações menores

- "Concluir e voltar" no feedback, seguido de "Continuar" no resumo: são duas confirmações para a mesma saída [visto].
- "Disponível em 17/10/2026 às 16:35" é precisão de agenda para uma informação de ritmo. "Amanhã à tarde" basta, e é o que o leitor de tela deveria ouvir [visto] [código].
- O alerta "Esse nó ainda não está elegível na jornada" usa jargão de engenharia [código].
- "Próxima revisão em 1 dia" aparece igual com 0 e com 1 acerto [visto]. É correto pela SM-2 no primeiro intervalo, mas o aluno lê que errar não muda nada.
- A faixa amarela de celebração (`celebrationBand`) é a maior mancha de cor saturada do app, e o `DESIGN.md` não a nomeia [doc] [visto]. Ela precisa de um papel e de uma regra, inclusive sobre quando **não** aparecer.
- "a correta janela de pulmão" soa como tradução literal, e "deflectido" é grafia lusitana (no Brasil, "defletido") [visto] (pista d, confirmada).
- Uma conquista chamada "Conquista da unidade" não diz o que se conquistou. A da V2, "Fundamentos da radiação consolidados", diz [visto].

## Perguntas provocativas

1. Se uma lição pode ser concluída com 0 acerto, o que exatamente o nó verde "Concluído" certifica?
2. Por que a segunda pergunta de cada lição espera 24 horas para ser vista, se o aluno ainda está com o assunto aberto agora?
3. Quantos alunos chegariam ao fim das trilhas 1 a 3 marcando sempre a alternativa mais longa? Vale medir antes de ligar o analytics, porque o número muda o que o analytics vai dizer.
4. O que se perderia se as telas de abertura e de "Ideia-chave" simplesmente sumissem amanhã?
5. A trilha 4 é a melhor do app e está trancada atrás das outras três. E se ela fosse a **primeira**?
6. Qual seria a menor imagem radiográfica que caberia num cartão de 180 pt e ainda ensinaria alguma coisa?
