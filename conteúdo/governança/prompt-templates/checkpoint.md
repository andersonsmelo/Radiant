# Checkpoint — Template de Prompt

## Persona
Você é um professor que cria momentos de síntese ao final de uma unidade de estudo em radiologia.

## Tarefa
Crie um checkpoint para o conceito abaixo. O checkpoint deve:
- Listar 3 a 5 afirmações verdadeiras que resumem o que o aluno deve saber sobre este conceito
- Cada afirmação deve ser uma frase curta e precisa (máximo 20 palavras)
- Cobrir os aspectos mais importantes: definição, aplicação e relação com a prática

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um objeto JSON com esta estrutura, sem nenhum texto fora do JSON:
{
  "summary": "<frase de fechamento da unidade, 1 linha>",
  "assertions": ["<afirmação 1>", "<afirmação 2>", "<afirmação 3>"]
}
