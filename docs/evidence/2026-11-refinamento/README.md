# Refinamento visual antes da 1.6 — evidência

Execução do [plano](../../plans/2026-11-16-refinamento-visual-1-6.md) na noite de
2026-11-16 para 2026-11-17 (America/Bahia), na branch
`claude/refinamento-1-6-desenho`, de `4af90e3` (a `main` de onde a branch saiu) até
`f6b39148`. O desenho está na
[spec](../../superpowers/specs/2026-11-16-refinamento-visual-1-6-design.md).

O dono autorizou a execução com subagentes e, ao sair, escreveu: "voce vai rodar a
noite toda o plano caso esgote espere até retornar voce tem autonomia para tomar
decisões". O controlador (Claude Fable 5.2) abriu e fechou os runs do Loop, fez os
commits e decidiu o que a spec e o plano não respondiam. Implementadores e revisores
foram subagentes em Sonnet e Opus.

## O que cada arquivo registra

| Arquivo | Tarefa |
| --- | --- |
| [tarefa-01.md](tarefa-01.md) | Botão desabilitado legível |
| [tarefa-02.md](tarefa-02.md) | Marcas desenhadas e alternativa com relevo |
| [tarefa-03.md](tarefa-03.md) | Folha de retorno no rodapé da aula |
| [tarefa-04.md](tarefa-04.md) | Classificar em grupos e ficha com relevo |
| [tarefa-05.md](tarefa-05.md) | Passo de ensino em blocos |
| [tarefa-06.md](tarefa-06.md) | Limpeza de literais e guarda em AST |
| [tarefa-07.md](tarefa-07.md) | Recompensa e unidade concluída |
| [tarefa-08.md](tarefa-08.md) | Missões de hoje |
| [tarefa-09.md](tarefa-09.md) | Perfil |
| [tarefa-10.md](tarefa-10.md) | Assinatura |
| [tarefa-11.md](tarefa-11.md) | Ajustes da prova em simulador, histórias e pendentes |
| [tarefa-12-revisao-final.md](tarefa-12-revisao-final.md) | Correções da revisão final da branch |

Cada arquivo traz a execução vermelha e a verde dos testes novos, e diz quais asserções
nasceram verdes.

## Como foi medido

- **Loop:** cada tarefa e cada rodada de correção fechou um run com os 15 validadores
  configurados passando (`loop validate`): 18 runs validados nesta execução, contando
  o de documentação. Outros 2 foram fechados sem validar, só para reabrir com o
  escopo ampliado (tarefas 2 e 9).
- **Suíte:** medida pelos implementadores com `npx jest --runInBand`, no Node 20.20.2,
  na árvore de trabalho da branch. Foi de 276 suítes e 3.710 testes (depois da tarefa
  2) a 284 suítes e 3.841 testes (depois da correção final). **O controlador não
  remediu esse número em worktree limpa**; o que ele conferiu foi o resultado dos
  validadores do Loop, que incluem `app-test` e `app-quality`.
- **Revisão:** cada tarefa teve um revisor independente e, quando houve achado
  importante, uma rodada de correção com re-revisão. A branch inteira teve uma revisão
  final e uma onda de correção.

## Prova em simulador

iPhone simulado ("Radiant F6", iOS), tamanho de texto normal, bundle da branch servido
pelo Metro, com `ENABLE_LEAGUE`, `ENABLE_DECORATIONS`, `ENABLE_CONVERSION_PROMPTS`,
`ENABLE_RICH_FEEDBACK` e `ENABLE_PERSONALIZED_NOTIFICATIONS` ligadas. O binário do
simulador é o cliente de desenvolvimento de 2026-11-15; só o JavaScript é da branch.

| Captura | Tela | Commit do bundle |
| --- | --- | --- |
| [01-inicio.jpg](capturas/01-inicio.jpg) | Trilha | `4ea3c7bc` |
| [02-missoes.jpg](capturas/02-missoes.jpg) | Missões de hoje | `c63bc94` |
| [03-assinatura.jpg](capturas/03-assinatura.jpg) | Assinatura, com a margem corrigida | `4ea3c7bc` |
| [04-ensino.jpg](capturas/04-ensino.jpg) | Abertura da aula e passo de ensino em blocos | `c63bc94` |
| [05-pergunta.jpg](capturas/05-pergunta.jpg) | Pergunta, antes de escolher | `c63bc94` |
| [06-alternativa-escolhida.jpg](capturas/06-alternativa-escolhida.jpg) | Alternativa escolhida | `c63bc94` |
| [07-folha-de-erro.jpg](capturas/07-folha-de-erro.jpg) | Folha de erro, até a borda e com a resposta certa | `4ea3c7bc` |
| [08-classificar.jpg](capturas/08-classificar.jpg) | Classificar em grupos | `c63bc94` |
| [09-perfil.jpg](capturas/09-perfil.jpg) | Perfil | `c63bc94` |
| [10-revisao-vazia.jpg](capturas/10-revisao-vazia.jpg) | Revisão sem itens | `c63bc94` |

As capturas 02, 04 e 08 são anteriores à correção final: a peça numerada do passo de
ensino aparece no azul da unidade, e passou ao azul de ação em `f6b39148`. Nenhuma
captura foi feita depois de `f6b39148`.

A prova achou três defeitos que nenhum teste pegava, corrigidos na tarefa 11 e vistos
de novo na tela: a assinatura sem margem lateral, a alternativa certa escondida atrás
da folha de erro e uma faixa do fundo abaixo da folha.

## O que não foi provado

- **Android.** Nada foi visto em emulador nem em aparelho.
- **Texto no tamanho máximo e "reduzir movimento".** Só há asserções de estilo nos
  testes; nenhuma tela foi vista nesses modos.
- **Leitor de tela.** Os rótulos têm teste, mas nada foi ouvido no VoiceOver nem no
  TalkBack.
- **Roteiros do Maestro.** Não foram rodados. Os `testID` que eles usam continuam
  existindo e têm teste; os roteiros de aula tocam "Continuar" depois de conferir, e
  esse botão agora mora na folha.
- **Liga com dados.** O simulador não tem conta de Game Center.
- **Compra real.** O StoreKit do simulador mostra preços em dólar; a compra não foi
  exercitada.
- **Telas que não foram abertas:** resumo e comemoração no fim da aula, recompensa,
  unidade concluída, avaliação, e os formatos ordenar, parear, lacuna, verdadeiro ou
  falso e múltipla seleção.
- **Imagem de abertura.** Não foi trocada (tarefa 11, passo 1): continua o Pixel antigo.
