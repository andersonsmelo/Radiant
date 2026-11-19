# ADR 2026-11-19: formatos da trilha dobrada (fase B da 1.7)

- **Data:** 2026-11-19
- **Decisor:** Claude, como controlador, sob a delegação do dono de 2026-11-18 ("tem
  autoridade para tomar decisões para manter a continuidade da implementação do
  plano"). Nenhuma destas decisões foi vista pelo dono antes de entrar na branch; ele
  as confirma ou muda ao revisar a PR.
- **Contexto anterior:** [ADR 2026-11-18](ADR-2026-11-18-trilha-internacional-e-dobrada.md)
  e a [especificação](../superpowers/specs/2026-11-18-trilha-dobrada-design.md), seções
  8.2 e 8.3.

## Contexto

A especificação pediu cinco telas novas, três formatos ligados, o visual do conceito e
laços de animação em código, e deixou para o plano a forma de cada formato no JSON, a
técnica dos laços e as réguas do verificador. O
[plano da fase B](../superpowers/plans/2026-11-19-trilha-dobrada-fase-b-formatos.md)
fixou isso. Este registro guarda as decisões que mudam contrato ou comportamento.

## Decisões

1. **Diagrama e laço são a mesma coisa, e não usam Lottie.** Cada um é uma lista de
   camadas de SVG em texto, num módulo sem dependência, com no máximo um movimento por
   camada (`translate`, `rotate`, `scale` ou `fade`; modos `loop`, `pingpong` e `once`).
   A mesma descrição é desenhada na tela, conferida pelo verificador e gravada em
   `.svg` para revisão por imagem. Diagrama não tem texto dentro.
2. **Figura é imagem licenciada ou diagrama, pelo mesmo campo.** No lote, `imageRef`
   guarda o identificador da imagem ou `diagram:<id>`. `hotspot`, `label` e
   `risk-hunt` aceitam os dois.
3. **O alvo de toque sobre figura é um retângulo de 44 pt centrado**, medido numa
   figura de 280 pt de largura. O verificador recusa alvo cujo retângulo saia da figura
   ou se sobreponha a outro. A mesma conta vale na tela.
4. **`parameter-lab` e `risk-hunt` mudaram de forma no contrato.** Os tipos anteriores
   não tinham uso nem regra de acerto. O `parameter-lab` é um controle sobre um de três
   modelos (distância, blindagem, decaimento), com meta numérica e leituras relativas,
   nunca dose de paciente. O `risk-hunt` é marcar todas as regiões de risco.
5. **No `label`, cada ponto tem uma descrição de posição** (`where`) que não nomeia a
   parte. Sem ela, quem usa leitor de tela completaria a interação sem conseguir
   responder à pergunta.
6. **Na `conversation`, o rosto do personagem não antecipa o veredito.** Antes de
   conferir, a expressão é a de fala, igual para escolha certa e errada.
7. **O `blitz` não cobra vida, mas é barrado para quem está sem vidas**, como os outros
   tipos. Sem a barreira, uma rodada rápida no fim da aula deixaria concluir a aula
   sem vidas. O tempo desliga sozinho com leitor de tela (inclusive ligado no meio da
   rodada) e com "reduzir movimento", e o aluno pode desligá-lo.
8. **O limite de 80 palavras do conceito com `visual` vale só para unidade nova.** As 24
   unidades de hoje mantêm 110.
9. **Toda aula tem ao menos uma múltipla escolha.** A medição abaixo mostrou que a aula
   sem nenhuma deixa cinco cartas de revisão que nunca são limpas. A M05.06, já
   publicada sem múltipla escolha, fica isenta.

## Medição da revisão espaçada (o que volta ao dono)

A especificação mandava medir o armazenamento da revisão com a trilha dobrada antes de
produzir conteúdo em volume. Medido em 2026-11-19, no Node, pelos serviços reais, com
310 aulas concluídas
([relatório](../evidence/2026-11-19-formatos/medicao-revisao-espacada.md)):

| Caso | Depois da limpeza | Contra 1,9 MiB |
| --- | --- | --- |
| A: toda aula com múltipla escolha | 1,635 MiB | cabe, com 0,27 MiB de folga |
| B: nenhuma aula com múltipla escolha | 2,147 MiB | passa |
| C: caso A com todas as conferências reprovadas uma vez | 1,980 MiB | passa |

O teto de 1,9 MiB é o maior valor que voltou íntegro num emulador Android
(`docs/STATUS.md`); não foi medido em aparelho. A decisão 9 afasta o caso B. O caso C
depende de mudança no armazenamento, que é decisão do dono (item A2 aberto). Duas
saídas descritas no relatório, nenhuma implementada: não gravar carta para interação
sem definição de revisão, ou tirar as tentativas do mesmo valor.

## Consequências

- O autor de conteúdo passa a ter oito formatos a mais e dezesseis diagramas. O guia de
  autoria descreve cada um.
- Um tipo novo de interação só entra se atravessar todos os portões: o teste
  `interactionFamilies.contract.test.ts` percorre a união de tipos.
- Os 24 lotes gerados não mudaram nesta fase. Nenhuma aula publicada usa formato novo
  ainda; isso é das fases C e D.

## O que não foi verificado

Nada foi visto em simulador nem em aparelho: as telas têm teste de componente e
história no Storybook, e os laços foram revisados em quadros parados. Som, toque real,
VoiceOver, TalkBack e os roteiros do Maestro ficam para a fase E e para o dono.
