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
