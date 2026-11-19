# Evidência da fase B: formatos (2026-11-19)

Esta pasta guarda a evidência das tarefas da fase B da trilha dobrada (novos formatos de interação): saídas vermelhas dos testes escritos antes da implementação e, mais adiante, as medições de cada tela.

| Tarefa | O que entregou | Evidência |
|---|---|---|
| 1 | Teste que percorre todas as famílias de interação; unidade sintética de formatos | `vermelho-tarefa-1.txt`: sem o `case 'multi-select'` em `isCorrectInteractionValue`, o teste reprova só em `multi-select`, na asserção de `isCompleteInteractionValue` (`isCorrect` começa chamando `isComplete`) |

## Limites conhecidos

- O gerador de roteiros Maestro só é exercitado para os tipos da aula-fonte presentes na unidade sintética (`comparison` fica de fora, por exigir imagem).
- `validateInteraction` não acusa tipo sem `case`: o teste de famílias só pega payload malformado do exemplo.
