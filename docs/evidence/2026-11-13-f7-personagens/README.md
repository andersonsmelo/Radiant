# Evidência da F7 — personagens (2026-11-13)

Frente F7 da atualização 1.6: bíblia do elenco, expressões comuns, seletor de
expressão por contexto, guarda de padrão e Storybook. A bíblia está em
[`docs/design/2026-11-13-biblia-de-personagens.md`](../../design/2026-11-13-biblia-de-personagens.md).

| Arquivo | O que prova |
| --- | --- |
| `guarda-vermelha.txt` | Três execuções vermelhas contra o código real. A primeira tem sete defeitos injetados (cor fora dos tokens, traço de 1,6, cabelo sem faixa de luz, Duda presa no neutro, paciente sem as expressões, rótulos sem expressão ou sem nome, faísca fora da caixa): 17 testes falharam, cada um com a mensagem do defeito que ele nomeia. A segunda tem dois defeitos: uma sobrancelha de carranca na tabela e o erro comemorado num marco. A terceira traz os quatro achados da revisão independente (faixa de luz reduzida a um ponto, rosto trocado com o da tabela, avatar decorativo com rótulo e Pixel com rótulo diferente do rosto). Os defeitos foram revertidos, e a suíte voltou a passar. |
| `desempenho.txt` | Nós por retrato e por cena, antes e depois, e o tempo de render da cena de 6 falas em rodadas intercaladas. +23 nós (+14%) na cena; tempo dentro do ruído. |
| `maestro-arvore.txt` | Árvore do Maestro na cena de abertura da M01.01, no simulador: a Duda pergunta e o retrato dela desenha `cast-face-pensativo`; o Caio afirma e desenha `cast-face-neutro`. |
| `cena-1.png` | M01.01 no simulador: Duda pensativa e Caio neutro, a 48 pt, sobre a placa grafite. |
| `cena-2.png` | A mesma cena com a terceira fala: o Pixel na placa do elenco, a 80% do lado, com a tela "pensando". |
| `cena-3.png` | Storybook, "Personagens/Elenco/Grade Da Fala": elenco × expressão em `sm` (48 pt), com Seu Jorge, Dona Marta e o começo dos candidatos. |
| `cena-4.png` | Storybook, "Grade Do Retorno": Pixel e Lia em `lg` (96 pt). |

## Ambiente

- Simulador "Radiant F7" (iPhone 17, iOS 26.5), criado para esta frente, com o
  dev client Debug que a F2 compilou (`Radiant.app` do DerivedData), sem compilar
  nada.
- Metro da branch na porta 8082, com `EXPO_NO_TYPESCRIPT_SETUP=1`. Para a grade,
  com `STORYBOOK_ENABLED=true`. O `node_modules` da worktree é um clone APFS do da
  `Radiant-release`, porque o Metro não resolve módulos por link simbólico para
  fora da raiz.
- As capturas foram reduzidas e quantizadas para 64 cores, para ficarem pequenas.

## O que não foi visto

- **VoiceOver não foi ligado.** A acessibilidade foi conferida pelos testes
  (rótulo, papel e avatar decorativo) e pela árvore do Maestro. A árvore do
  Maestro também mostra nós que o leitor de tela esconde.
- **O retorno da resposta (`AnswerFeedbackCard`) não foi aberto no simulador.**
  Ele usa o mesmo `CastAvatar` do Pixel, agora na placa e na escala do elenco, mas
  a expressão continua a que o cartão já passava (`feliz` ou `pensando`). Ligar o
  seletor ali fica para a F3.
- Uma cena com a Lia ou com a Dona Marta numa aula real não foi aberta, porque a
  M01.01 é a única aula desbloqueada num aparelho limpo. As duas aparecem na grade
  do Storybook, com o mesmo `CastAvatar` que a cena usa.
