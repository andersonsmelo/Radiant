# Reavaliação da trilha, com benchmark de mercado — 2026-10-16 (tarde)

**Método:** dual-agent, no `impeccable critique`. A revisão de design (A) e a
evidência mecânica (B) foram feitas por dois subagentes isolados, que não viram
o trabalho um do outro. A síntese abaixo foi feita pela sessão que os
encomendou, que conferiu no código e nos dados as afirmações mais fortes.

**Pedido do dono:** refazer a avaliação da trilha depois do pacote de confiança,
comparando-a com os grandes apps do mesmo formato, e guardar as pesquisas na
documentação como base do planejamento de melhoria.

**Medido em:**
- branch `codex/radiant-study-improvements`, em `98cf01c`;
- simulador iPhone 17 / iOS 26.5, build Debug com Metro;
- estado do app: trilha 1 concluída, trilha 2 em andamento, de 3 a 5 vidas.

**Documentos desta rodada:**
- [revisão de design (A)](2026-10-16-reavaliacao-da-trilha-design.md);
- [evidência mecânica (B)](2026-10-16-reavaliacao-da-trilha-mecanica.md);
- [benchmark de trilhas gamificadas e de educação em radiologia](../pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md);
- [práticas de desenvolvimento com agentes](../pesquisas/2026-10-16-praticas-desenvolvimento-com-agentes.md);
- a [avaliação da manhã](2026-10-16-avaliacao-completa-da-trilha.md), anterior ao pacote.

---

## 1. Veredito

O pacote de confiança consertou as mentiras de estado. Hoje:
- as estrelas são as da tentativa;
- a trilha seguinte diz o que falta para abrir;
- a revisão não custa vida.

O teto agora está **dentro da lição**, e não na trilha:
- a lição é **uma pergunta** entre duas telas de texto de molde e dura cerca de
  1 minuto;
- o erro é explicado longe da pergunta, com o mesmo texto do acerto;
- a alternativa certa tende a ser a mais longa e nunca muda de lugar.

Nenhum app de radiologia junta trilha gamificada e exercício sobre imagem, e o
técnico brasileiro não tem nenhum produto desse formato. O espaço está livre,
mas o Radiant ainda não entrega o que o ocuparia.

**Nielsen: 22/40**, na faixa "aceitável", no terço inferior. De manhã eram 20.
- O pacote rendeu cerca de 5 pontos, em visibilidade, prevenção, recuperação e
  ajuda.
- A inspeção mais funda tirou 2 pontos, em linguagem e em reconhecimento. Esses
  2 pontos vêm de defeitos que já existiam e que a avaliação da manhã não
  pegou; não houve regressão.

| # | Heurística | Manhã | Tarde |
| --- | --- | --- | --- |
| 1 | Visibilidade do estado | 2 | 3 |
| 2 | Correspondência com o mundo real | 2 | 1 |
| 3 | Controle e liberdade | 3 | 3 |
| 4 | Consistência | 2 | 2 |
| 5 | Prevenção de erro | 2 | 3 |
| 6 | Reconhecer em vez de lembrar | 3 | 2 |
| 7 | Flexibilidade e eficiência | 1 | 1 |
| 8 | Estética e minimalismo | 3 | 3 |
| 9 | Recuperação de erro | 1 | 2 |
| 10 | Ajuda e documentação | 1 | 2 |
| | **Total** | **20** | **22** |

A justificativa de cada nota está na [revisão de design](2026-10-16-reavaliacao-da-trilha-design.md).

**Especificidade do design:** o sistema visual é autoral no `DESIGN.md`, mas
intercambiável na tela. Sem imagem nenhuma, trocando o texto a trilha serviria a
qualquer matéria. Só a trilha V2, "Matéria, Energia e Radiação", ainda
bloqueada, soa como curso de radiologia: tem títulos autorais e checkpoints de
avaliação.

**Detector automático:** saiu com `[]` em 10 arquivos. Ele procura CSS e
marcação web, e o React Native usa `StyleSheet`. **O vazio não atesta a
interface.** As falhas mecânicas abaixo vieram da hierarquia de acessibilidade,
do código e dos pixels.

---

## 2. Problemas prioritários

Os achados de A e de B foram fundidos, e a coluna "Conferido" diz o que a sessão
reproduziu por conta própria.

| # | Sev. | Problema | Evidência | Conferido |
| --- | --- | --- | --- | --- |
| 1 | P0 | **A lição testa antes de ensinar e tem uma pergunta só.** A pergunta 1 vai para a lição e a 2 é reservada ao nó de revisão. Abertura e "Ideia-chave" são molde em 16 das 18 lições | `JourneyDefinitionService.ts`: `buildIntroBlock` e `buildReviewBlock`; "Passo 3 de 4" e "1 de 1 corretas" nas capturas | sim, no código |
| 2 | P1 | **O fim reprovado se contradiz.** Mostra "Ainda não fechou. Refazer agora…" ao lado de "A lição foi concluída", +10 XP, a faixa amarela e o Pixel comemorando. O único botão é "Continuar", sem opção de refazer, e o nó fica verde | captura da lição errada; `LessonSummary.tsx`; `LessonOutcomeService` conclui o nó sem olhar o acerto | sim, na tela |
| 3 | P1 | **O feedback do erro fica longe da pergunta e é o mesmo texto do acerto.** A pergunta e as alternativas somem, o título "Vamos reforçar" não diz que errou e nada explica o distrator | `LegacyLessonAdapter`: `feedback: { correct: explanation, incorrect: explanation }` | sim, na tela |
| 4 | P1 | **Dá para acertar sem ler.** A certa é estritamente a mais longa em **18 de 32** perguntas (56%, contra 25% ao acaso), fica na 2ª posição em só 2 de 32, e nada embaralha as alternativas | contagem sobre `src/data/ai-lessons.ts` | sim: 18/32 recontado |
| 5 | P1 | **Três textos de estado da trilha reprovam contraste AA.** "Bloqueado"/"Disponível em…" (3,54:1), "Próximo passo" em `#3060FF` (3,49:1) e "Disponível" (3,82:1). O teste de contraste não cobre esses tokens | `theme.ts:139` (`nodeLockedAccent` = branco a 38%); `scripts/contrast-contract.test.mjs` | sim: ≈3,5:1 recalculado |
| 6 | P2 | **A trilha não tem estrutura interna e usa cinco nomes para a mesma coisa.** São cerca de 50 nós em cerca de 14 a 18 telas de rolagem, com revisões intercaladas e trilhas bloqueadas abertas nó a nó. Para o mesmo contêiner aparecem trilha, unidade, nível, etapa e aula. "UNIDADE 1" é o ordinal da lição, e "Quiz:" vaza do catálogo | capturas; hierarquia (8.858 pt de conteúdo) | sim, na tela |
| 7 | P2 | **Os títulos truncam e a faixa vaza.** 15 títulos de nós aparecem com "…", inclusive o do nó PRÓXIMO, e o texto da faixa de nível sai cerca de 5 pt da placa | capturas; `JourneyLevelBand.tsx:82-86` sem `flexShrink` | não |
| 8 | P2 | **O app não se deixa testar sem animação.** O fundo estrelado respeita "Reduzir movimento", mas não há argumento de lançamento que o desligue, e no E2E cada tentativa de rolagem leva de 8,8 a 11 s | hierarquia; log do Maestro | parcial: os ~8 s por tentativa foram medidos no E2E de hoje |

Menores: "deflectido" e "a correta janela de pulmão" no feedback; data e hora
numéricas ("17/10/2026 às 16:35") onde "amanhã à tarde" bastaria; "Avalie a
aula" com 5 estrelas logo depois do erro; o botão de fechar da lição com 40×40
pt; "Agora não" sem papel de botão; o tipo do nó (Lição, Revisão) fora do rótulo
do VoiceOver; o VoiceOver anuncia "Pixel comemorando" num resultado de 0
estrela.

**Onde A e B concordam:** a trilha é longa demais, e o estado lê bem por cor,
ícone e texto. **O que só B pegou:** o contraste, o vazamento da faixa, os alvos
pequenos e o custo da animação no E2E. **O que só A pegou:** a lição de uma
pergunta, o padrão da alternativa mais longa e a contradição do fim reprovado.

---

## 3. Comparação com o mercado

Detalhe por app no
[benchmark](../pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md).

| Eixo | Radiant hoje | Líderes | Menor mudança que fecha mais distância |
| --- | --- | --- | --- |
| Tamanho da lição | 1 pergunta, ~1 min, 2 de 4 telas de molde | ~15 exercícios no Duolingo; problemas encadeados no Brilliant | Usar as 2 perguntas, devolver a errada no fim e cortar as telas de molde |
| Interação com imagem | nenhuma | Duolingo Chess com ~75% sobre o tabuleiro; em radiologia, imagem só em atlas e casos, sem trilha | Um item de hotspot por trilha, com o `HotspotStepRenderer`, que já existe |
| Estrutura do caminho | linha única de ~50 nós | seção, unidade e nó; guidebook; Lendário; "Jump here" | Recolher as trilhas concluídas e bloqueadas e tirar as revisões da linha |
| Revisão | paralela e sem custo (desde hoje); SM-2 por lição, com 1 item fixo | por item (HLR, Babbel 1→4→7→14→60 dias), dentro do caminho como prática personalizada | Revisão que sorteia itens das lições vencidas |
| Adaptação | nenhuma | Birdbrain, Course Challenge, nivelamento | Teste de 5 itens no topo de cada trilha para pular o que já sabe |
| Motivação | XP, sequência, vidas e missões, sem ligas | sequência com congelamento; marcos (+1,7% de D7 no Duolingo) | Proteção de sequência ganha jogando; marco animado |
| Erro | custa vida na lição e explica longe da pergunta | o Duolingo trocou corações por Energia (2025); Explain My Answer gratuito | Feedback no lugar da pergunta, distrator explicado e erro sem custo dentro da lição |

**A menor mudança de maior efeito, sem conteúdo novo:** uma lição com as duas
perguntas embaralhadas, feedback no lugar da pergunta, a errada de volta no fim,
sem telas de molde e com "Refazer" no fim reprovado. Ela mexe em quatro eixos:
tamanho, revisão, feedback e honestidade.

**A diferenciação que ninguém ocupa:** trilha gamificada com exercício sobre
imagem, em português e para o técnico. O RadLingo é texto e voltado à prova
americana; o Clover não tem gamificação; IMAIOS e Radiopaedia não têm trilha;
os apps brasileiros miram o médico.

---

## 4. Personas

- **Jordan, primeira vez:**
  - na primeira lição da trilha 2, lê "Quiz:" e "UNIDADE 1";
  - erra, perde uma vida e lê "Vamos reforçar";
  - depois vê "A lição foi concluída" e o nó verde, e segue em frente sem
    entender o que errou.
- **Casey, no celular entre plantões:**
  - abrir no PRÓXIMO e o botão no rodapé ajudam;
  - em compensação, para responder 4 perguntas passa por 8 telas de molde;
  - o lembrete sai entre 18h e 21h, sem escolha de horário.
- **Sam, com VoiceOver e texto em AX5:**
  - o nó não diz o tipo (Lição, Revisão);
  - o leitor anuncia "Pixel comemorando" com 0 estrela;
  - são cerca de 50 nós sem cabeçalho por trilha;
  - em AX5 os títulos deixam de truncar, o que está certo, mas alonga a trilha.
- **Técnica em radiologia formada:**
  - não consegue pular Fundamentos;
  - acerta pelo tamanho da alternativa;
  - não encontra nenhuma radiografia.

---

## 5. Como reproduzir

- **Capturas:** rode no simulador, com o Metro no ar, um flow Maestro que:
  - faz `launchApp` com `clearState: false`;
  - roda o subflow `dismiss-dev-client.yaml`;
  - afirma `journey-trail`;
  - repete `swipe` de 78% a 30% da tela com `takeScreenshot`.

  Para a lição, toque "Próximo passo" com `scrollUntilVisible` e
  `centerElement: true`; sem centralizar, o toque cai sob a barra de abas.
- **Alternativa mais longa:** em `src/data/ai-lessons.ts`, compare o tamanho de
  `label` da alternativa em `correctAnswerIndex` com o das demais. Conte só os
  casos em que ela é a única mais longa.
- **Contraste:** `rgba(255,255,255,0.38)` sobre o fundo do cartão dá ≈3,5:1, e o
  mínimo AA para texto pequeno é 4,5:1.

## 6. Limites

- Um aparelho só, sem Android e sem tela pequena (SE).
- Nenhum teste com VoiceOver ou AX5 ligado; a leitura veio da hierarquia e do
  código.
- Sem dado de uso real: o analytics continua desligado (FILA 43).
- O snapshot do `impeccable` em `.impeccable/critique/` não foi gravado, porque
  fica fora de `writePolicy.allowedRoots`. Esta síntese faz o papel dele.
- A cobertura de fóruns da pesquisa de práticas não inclui o Reddit, que bloqueou
  o agente de busca.
