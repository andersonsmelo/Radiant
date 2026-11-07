# Guia de autoria — aulas do Radiant (formato aula-fonte, schemaVersion 1)

**Criado em 2026-11-05** sob a [ADR da delegação](../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md). O verificador citado no fim entra no repositório com a frente A do [plano](../plans/2026-11-05-radiant-trilha-ampla-e-engajamento.md); até lá, os autores usam uma cópia fora do repositório.

O Radiant é um app de estudo para **estudantes do curso superior de Tecnologia em Radiologia no Brasil**, no espírito do Duolingo: aulas curtas (4 a 7 minutos), muita prática, retorno imediato, personagens e diálogo. Cada **unidade** (módulo) tem 6 ou mais **aulas**. Você escreve UMA unidade inteira num único arquivo JSON.

## 1. Regras que não se negociam

1. **Texto original.** Fatos conferidos em fontes gratuitas na web; a redação é sua. Nunca copie nem parafraseie de perto frase de livro, apostila, site, banco de questões ou concurso. Não leia PDFs locais do repositório nem nada em `Conteúdo/` ou `conteúdo/`.
2. **Fonte por afirmação.** Todo item cita em `sourceIds` a fonte que sustenta o fato. Confira os fatos com WebSearch/WebFetch antes de escrever. Se não achar fonte gratuita confiável para um fato, não use o fato.
3. **Limites profissionais.** O aluno é estudante numa **simulação supervisionada**. Nenhum item pede diagnóstico, laudo, escolha de exame, conduta clínica, prescrição, cálculo de dose para paciente ou liberação de implante. Diante de dúvida ou divergência, a ação certa é **parar, descrever e pedir apoio à equipe**. Nunca "corrija o registro por conta própria".
4. **Contexto brasileiro.** Norma sanitária vigente: Anvisa RDC 611/2022 e suas instruções normativas (não cite a Portaria 453/1998 como vigente). Proteção radiológica: CNEN NN 3.01. Profissão: Lei 7.394/1985 e resoluções do CONTER. Unidades do SI, vírgula decimal, termos usados no Brasil (tomografia computadorizada, ressonância magnética, colimação, tecnólogo em radiologia).
5. **Sem paciente real.** Só personagens e fichas fictícias. Nenhum dado pessoal real.
6. **Tom.** Português do Brasil, direto, acolhedor, sem culpa e sem infantilizar. Frases curtas. Nada de "Parabéns!!!" vazio: o retorno diz o que a escolha faz e por quê. No erro: diga o que aquela alternativa faz e redirecione ("Retome…", "Confira de novo…"). Nunca use o mesmo texto de retorno para duas alternativas.
7. **Higiene de texto.** Sem travessão com espaços (use vírgula, ponto ou dois-pontos). Sem palavras em caixa alta para ênfase. Sem notas de produção, sem "Quiz:", sem "Ideia-chave:". Não use "todas as anteriores" nem "nenhuma das anteriores".
8. **Qualidade das questões.**
   - Tarefa, não definição: prefira "o que você confere agora?" a "o que é X?".
   - 4 alternativas plausíveis, de tamanho parecido. A correta **não** pode ser a mais longa (máx. 1,2× o maior distrator).
   - Varie a posição da correta ao longo da unidade (nenhuma posição acima de 40%).
   - Os dois itens de conferência de uma aula têm respostas corretas diferentes e não repetem enunciado da prática.
   - Itens de segurança (`role: "safety"`) levam `criticalSafety: true`.
   - Números só quando a fonte os sustenta; em modelos simplificados, diga o limite ("vale só para este esquema").

## 2. Elenco (use nos diálogos)

| speaker | Quem é | Voz |
| --- | --- | --- |
| `pixel` | Mascote do app, guia de estudo | Curioso, encoraja, faz a pergunta que organiza o raciocínio |
| `lia` | Profa. Lia, supervisora de estágio | Calma e precisa; devolve a pergunta ao aluno |
| `caio` | Caio, tecnólogo veterano do plantão | Prático, bem-humorado, conta "como é na sala" |
| `duda` | Duda, colega de turma | Aprende junto, verbaliza a dúvida comum |
| `paciente` | Paciente simulado (sempre com `name` fictício, ex.: "Seu Jorge", "Dona Marta") | Fala simples, traz a situação humana |

Falas de até 200 caracteres. A cena de abertura cria a situação concreta da aula em 2 a 4 falas. Personagens não dão o gabarito.

## 3. Estrutura de cada aula

1. `objective`: "Hoje você vai conseguir …" (uma frase, ação observável).
2. `scene`: abertura em diálogo (2 a 4 falas) num cenário (`setting`).
3. `concept`: título + corpo de até 110 palavras + 2 ou 3 `keyPoints` curtos. Ensina antes de cobrar.
4. `interactions`: **exatamente 5**, com **ao menos 3 tipos diferentes**, nesta progressão:
   - i1 `role: "prerequisite"`: recupera algo de aula anterior (na primeira aula da trilha, um conhecimento do cotidiano).
   - i2 `prediction` ou `practice`; i3 `practice`; i4 `practice` ou `safety`; i5 `transfer` (situação nova, sem dica).
5. `closing`: título + corpo ("o que você consegue fazer agora") + uma fala final opcional (`line`).
6. `checkpoint`: **exatamente 2** itens de múltipla escolha, inéditos, sem ajuda.
7. `recovery`: `guided` (frase-gancho + item mais guiado) e `transfer` (item em outro contexto).

Tipos de interação:

- `multiple-choice`: `prompt`, `options[4]` (`label`, `correct`, `feedback`), `help`.
- `case-decision`: igual, mais `context` (o minicaso, 60 a 520 caracteres). Use para decisões em situação: o que fazer, o que conferir, quando parar.
- `ordering`: `prompt`, `items` (4 ou 5 textos **já na ordem correta**), `feedbackCorrect`, `feedbackIncorrect`, `help`.
- `matching`: `prompt`, `pairs[4]` (`left`, `right`), `feedbackCorrect`, `feedbackIncorrect`, `help`.
- `comparison`: `prompt`, `options[2 a 4]` (`label` neutro, `imageId`, `correct`, `feedback`), `help`. Cada `imageId` existe em `content-manifest/rtg-2026/imagens.json`, com licença CC0 ou CC BY conferida. O item só afirma o que a descrição da imagem no acervo sustenta.

`help` é uma pista que orienta o raciocínio sem entregar a resposta.

## 4. Formato do arquivo

```json
{
  "schemaVersion": 1,
  "unit": { "id": "m04", "code": "M04", "title": "Radiação, interação e proteção", "summary": "Uma ou duas frases sobre o que a unidade desenvolve." },
  "sources": [
    { "id": "anvisa-rdc-611-2022", "title": "RDC nº 611, de 9 de março de 2022", "publisher": "Anvisa", "url": "https://…", "accessedAt": "2026-11-05", "use": "factual-reference", "licenseNote": "Ato normativo federal; consultado para fatos, sem reprodução de texto." }
  ],
  "lessons": [
    {
      "id": "m04-01", "code": "M04.01", "title": "Produzir e detectar radiação",
      "objective": "Hoje você vai conseguir ordenar as etapas entre o tubo e o detector.",
      "competency": "Ordenar a cadeia física da produção à detecção num esquema validado.",
      "minutes": 5,
      "scene": { "setting": "Laboratório didático", "lines": [
        { "speaker": "duda", "text": "…" }, { "speaker": "caio", "text": "…" }, { "speaker": "pixel", "text": "…" } ] },
      "concept": { "title": "…", "body": "…", "keyPoints": ["…", "…"] },
      "interactions": [
        { "id": "i1", "type": "multiple-choice", "role": "prerequisite", "prompt": "…",
          "options": [ { "label": "…", "correct": false, "feedback": "…" }, { "label": "…", "correct": true, "feedback": "…" }, { "label": "…", "correct": false, "feedback": "…" }, { "label": "…", "correct": false, "feedback": "…" } ],
          "help": "…", "sourceIds": ["…"] },
        { "id": "i2", "type": "ordering", "role": "practice", "prompt": "…", "items": ["…", "…", "…", "…"],
          "feedbackCorrect": "…", "feedbackIncorrect": "…", "help": "…", "sourceIds": ["…"] },
        { "id": "i3", "type": "matching", "role": "practice", "prompt": "…", "pairs": [ { "left": "…", "right": "…" } ],
          "feedbackCorrect": "…", "feedbackIncorrect": "…", "help": "…", "sourceIds": ["…"] },
        { "id": "i4", "type": "case-decision", "role": "safety", "criticalSafety": true, "context": "…", "prompt": "…", "options": [ ], "help": "…", "sourceIds": ["…"] },
        { "id": "i5", "type": "multiple-choice", "role": "transfer", "prompt": "…", "options": [ ], "help": "…", "sourceIds": ["…"] }
      ],
      "closing": { "title": "…", "body": "…", "line": { "speaker": "lia", "text": "…" } },
      "checkpoint": [
        { "prompt": "…", "options": [ ], "sourceIds": ["…"] },
        { "prompt": "…", "options": [ ], "sourceIds": ["…"] }
      ],
      "recovery": {
        "guided": { "hook": "Complete a frase: …", "item": { "prompt": "…", "options": [ ], "sourceIds": ["…"] } },
        "transfer": { "item": { "prompt": "…", "options": [ ], "sourceIds": ["…"] } }
      }
    }
  ]
}
```

`sources[].use`: `factual-reference` (consulta de fatos, redação própria; vale para normas, páginas institucionais e material com licença restrita) ou `cc-by-4.0` (material CC BY 4.0, com atribuição em `licenseNote`). Fontes preferidas: Anvisa, CNEN, CONTER, Planalto, INCA, Ministério da Saúde, IAEA (RPOP e Human Health Campus), ICRP, NIBIB/NIH, RadiologyInfo, Virginia Tech Applied Human Anatomy (CC BY 4.0), OpenStax University Physics (CC BY 4.0), artigos de acesso aberto. Não use a Wikipédia como fonte única de um fato de segurança.

## 5. Antes de entregar

Rode o verificador e corrija até passar:

```bash
node scripts/content/rtg-lesson-lint.mjs content-manifest/rtg-2026/aulas/<unidade>.json
```

O verificador confere forma, não verdade. A exatidão dos fatos é sua responsabilidade: na dúvida, corte o fato.

## 6. Lições da primeira onda (M01 a M07), de 2026-11-06

Saíram das sete revisões independentes e dos gates do app. Valem como regra.

1. **Norma vigente de proteção radiológica:** "Norma ANSN 3.01" (Resolução CNEN nº 344/2025, DOU de 07/07/2025). Pode ser chamada de "norma 3.01 da CNEN". O texto de 2024 não é mais o vigente. A RDC 611/2022 remete aos limites dessa norma (arts. 45 e 48).
2. **RDC 611/2022:** o site do Diário Oficial costuma recusar a leitura. Há cópia compilada no site do Colégio Brasileiro de Radiologia (cbr.org.br). Sem ler o texto, não atribua nada à norma.
3. **OpenStax é só consulta.** Os livros hoje declaram CC BY-NC-SA 4.0: use `factual-reference`, sem aproveitar frase nem figura.
4. **Fato de segurança com fonte única de tipo wiki** (Radiopaedia, por exemplo): busque uma segunda fonte institucional ou escreva "siga o protocolo do serviço e peça apoio à equipe".
5. **Não cobre o que a aula não ensinou.** Foi o achado mais comum: item de conferência fora da competência, termo usado sem definição, mecanismo cobrado sem estar no conceito.
6. **Sequência didática é declarada.** Se a ordem de um item `ordering` é uma convenção sua, o conceito a ensina e o enunciado diz "na ordem ensinada nesta aula".
7. **A pista não entrega a resposta.** Várias ajudas foram reescritas por isso.
8. **Erro que dois autores repetiram:** com pouco mAs, a imagem em filme fica mais clara, não mais escura. Confira o sentido de toda relação antes de escrever o distrator.
9. **Conferência usa as quatro posições.** Nos 12 itens de conferência da unidade, a resposta correta precisa aparecer em cada uma das quatro posições ao menos uma vez.
10. **Sem texto todo em maiúsculas.** Uma alternativa que é só uma sigla de quatro letras ou mais ("O PACS") reprova no contrato de texto do app: dê uma palavra à sigla ("O sistema PACS").
11. **Diga de quem é o lado.** "Lado esquerdo do paciente", nunca só "lado esquerdo".
12. **Índices de exposição variam por fabricante.** Escreva "neste sistema o índice sobe com a exposição", nunca como regra geral.
13. **Palavras reservadas do app.** O contrato de texto trata "jornada", "nó", "checkpoint", "configuração" e "elegível" como jargão de interface e reprova a unidade. Use "turno", "ajuste", "conferência" ou outra palavra.
14. **"Não verificado" não é destino de fato.** Fato que a revisão não confirmou em página lida sai da unidade ou vira o que a fonte sustenta. Listar no parecer e manter na aula não basta: em S-TC, o osso "perto de 800 HU" e o pulmão "perto de -600 HU" vinham de uma tabela lida desalinhada e foram contraditos por uma fonte já aberta. Inferência a partir de fonte também não é fonte, e parecer de outra unidade não conta como fonte.

## 7. Brief do revisor independente

O texto abaixo é o brief que cada revisor recebeu, em inglês, como foi usado. O
revisor é sempre um agente diferente do autor e não vê a conversa dele.

You are the independent reviewer of one unit of lessons (Brazilian Portuguese) for Radiant, a Duolingo-style study app for students of the Brazilian "Curso Superior de Tecnologia em Radiologia". Another agent wrote the unit; you did not see its work. Your review replaces a human editorial gate: be strict and concrete, and fix what you find in the unit file itself.

Rules the unit must obey: this guide, sections 1 to 6 (read them first).

### Review, in this order of priority

1. **Facts.** Check every safety, normative and numeric claim against a free reputable source on the web (WebFetch/WebSearch); sample the rest. Recompute every number. A claim you cannot support is rewritten to what the source supports, or cut. Prefer primary or institutional sources. If a safety fact rests on a single wiki-style source, add a second source or soften it to "siga o protocolo do serviço e peça apoio à equipe". The Brazilian sanitary norm is Anvisa RDC 611/2022 (compiled copy on cbr.org.br if in.gov.br does not open); the protection norm in force is "Norma ANSN 3.01" (Resolução CNEN 344/2025).
2. **Professional limits.** No item may reward diagnosis, choosing an exam or technique for a patient, clinical conduct, prescribing or administering anything, patient dose calculation, clearing an implant, correcting a record alone, or acting alone when in doubt.
3. **Item quality.** Exactly one defensible correct answer; distractors plausible but wrong for a stated reason; no clue in wording, length or grammar; each wrong option's feedback explains that option's error; the two conferência items of a lesson test that lesson's competency with different answers and do not repeat a practice item; help never gives the answer away; the transfer item is really a new context; check the direction of every stated relation (increase/decrease).
4. **Teaching.** The concept teaches what the items ask; nothing is asked before it is taught, except the i1 prerequisite. A didactic sequence used in an `ordering` item is taught in the concept and the prompt says "na ordem ensinada nesta aula".
5. **Language.** Natural pt-BR, terminology used in Brazil, no guilt, no filler, no spaced dashes, dialogue lines that sound like people; "lado esquerdo do paciente", never just "lado esquerdo".

Budget: tokens are scarce. At most 15 web fetches/searches. Do not rewrite what is fine.

### When done

- The unit must pass the repository linter (prints OK): `node scripts/content/rtg-lesson-lint.mjs <unit file>`
- Write your parecer in Portuguese to the path the orchestrator gives you: title "Parecer de revisão — <UNIT>", today's date, "Revisor: Claude (<the agent's real model>), agente independente do autor, sob a ADR-2026-11-05", a table of findings (aula/item, problema, correção aplicada, fonte consultada), the facts confirmed with their URLs, what you could NOT verify (each entry says what became of it: removed, softened, or kept only because it is not a factual claim; nothing factual stays in the unit unverified), and a final line "Resultado: aprovado com correções" or "Resultado: reprovado" with the reason. Be honest: this is an AI review, not a review by a radiology professional.

### Constraints

Write only the unit file and the parecer. Do not touch the git repository, do not run `loop`, git, tests, Metro or simulators, do not read PDFs or anything under `Conteúdo/` or `conteúdo/` in the repository, do not spawn agents.

Final reply (max 8 lines): the result line; number of findings fixed; the three most important corrections; anything still unverified.

## 8. Modelo de prompt do autor

Troque o que está entre `<>`. Inclua no prompt os limites próprios da unidade (por
exemplo, em contraste: o estudante nunca prescreve, escolhe nem administra).

```text
You are authoring one full unit of lessons (in Brazilian Portuguese) for Radiant, a
Duolingo-style study app for students of the Brazilian "Curso Superior de Tecnologia em
Radiologia".

UNIT: <código> — "<título>" (id `<id>`, lessons `<id>-01` … `<id>-NN`).

1. Read the authoring guide in full, including section 6, and follow it exactly:
   docs/content/2026-11-05-guia-de-autoria-rtg-2026.md
2. Read your unit's briefs in docs/plans/2026-11-02-planejamento-conteudo-radiant.md
   (section 6 for core units, the table of section 7 for branches). One lesson per row or
   position, same order. There are NO images: use only the four text-based interaction
   types of the guide. You may add "diagramIdeas" per lesson.
3. For style and depth, skim ONE lesson of a reviewed unit in
   content-manifest/rtg-2026/aulas/ that is a prerequisite of yours.
4. Write from what you know and verify on the web every safety, normative and numeric
   claim. Budget: at most 20 web fetches/searches. Record each source actually used.
   Do not read any PDF or anything under Conteúdo/ or conteúdo/ in the repository.
5. Write the unit to <pasta de rascunhos>/<id>.json and run the linter until it prints
   OK: node scripts/content/rtg-lesson-lint.mjs <file>

Constraints: write ONLY that one output file. Do not edit the git repository, do not
run loop, git, Metro, tests or simulators. Do not spawn other agents.

Final reply (max 8 lines): output path; number of lessons; linter result; number of
sources; any fact you were unsure about or cut; what a reviewer should check first.
```

Os pontos que o autor pede para conferir entram no prompt do revisor. Os de M08 a M14
estão no [índice dos pareceres](../evidence/2026-11-06-rtg-2026-revisao/README.md).

## 9. Como rodar em lote sem estourar o limite de uso

- Um agente orquestrador lança autores e revisores, no máximo quatro por vez, e devolve
  só uma tabela por unidade. O controlador não lê as unidades.
- Antes de cada lote, o orquestrador mede o uso do plano e para de lançar em 70%.
- Rascunhos e pareceres ficam fora do repositório até a aprovação. Só entram em
  `content-manifest/rtg-2026/aulas/` e em `docs/evidence/2026-11-06-rtg-2026-revisao/`
  pela receita de admissão do
  [prompt de continuidade](../superpowers/handoffs/2026-11-06-trilha-ampla-prompt-de-continuidade.md).
- Agente interrompido por limite continua do ponto em que parou, pela mensagem ao
  mesmo agente; não se recomeça.
