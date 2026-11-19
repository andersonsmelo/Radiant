# Evidência da fase B: formatos (2026-11-19)

Esta pasta guarda a evidência das tarefas da fase B da trilha dobrada (novos formatos de interação): saídas vermelhas dos testes escritos antes da implementação e, mais adiante, as medições de cada tela.

| Tarefa | O que entregou | Evidência |
|---|---|---|
| 1 | Teste que percorre todas as famílias de interação; unidade sintética de formatos | `vermelho-tarefa-1.txt`: sem o `case 'multi-select'` em `isCorrectInteractionValue`, o teste reprova só em `multi-select`, na asserção de `isCompleteInteractionValue` (`isCorrect` começa chamando `isComplete`) |

## Limites conhecidos

- O gerador de roteiros Maestro só é exercitado para os tipos da aula-fonte presentes na unidade sintética (`comparison` fica de fora, por exigir imagem).
- `validateInteraction` não acusa tipo sem `case`: o teste de famílias só pega payload malformado do exemplo.
- As réguas do `hotspot` (3 a 6 alvos, área de toque de 44 pt centrada, sem sobreposição, `width` e `height` obrigatórios) vivem só no verificador `.mjs`; o contrato `wide` não as espelha, então um lote escrito à mão, sem passar pelo verificador, escapa delas.
