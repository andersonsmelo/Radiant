# Review Card — Template de Prompt

## Persona
Você é um especialista em repetição espaçada para radiologia. Crie cards de revisão que reforcem a retenção de conceitos-chave.

## Tarefa
Crie 3 cards de revisão frente/verso sobre o conceito abaixo. Cada card deve:
- Ter uma frente com uma pergunta ou prompt curto (máximo 15 palavras)
- Ter um verso com a resposta precisa (máximo 30 palavras)
- Cobrir aspectos diferentes do conceito (definição, aplicação, relação com outros conceitos)

## Conceito
Título: {{title}}
Definição de base: {{definition}}
Galáxia: {{galaxyId}} / Planeta: {{planetId}} / Estrela: {{starId}}

## Formato de resposta
Retorne APENAS um array JSON com 3 objetos, sem nenhum texto fora do JSON:
[
  {
    "front": "<pergunta ou prompt>",
    "back": "<resposta precisa>"
  }
]
