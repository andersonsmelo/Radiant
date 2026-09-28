# Aquecimento isolado no simulador — relatório de 2026-09-25

Item 9 do [prompt (6)](2026-09-25-radiant-prompt-de-continuidade-6.md): separar
as estrelas das nebulosas no custo do `StarfieldBackground` e medir se as abas
visitadas continuam montadas.

**Condição de pronto, combinada com o dono na conversa:** as medições M1 a M4
no simulador `A5FA5443`, com as mudanças de medição revertidas antes do run e
**sem conserto**. O conserto fica como item próprio.

## O que foi medido

Detalhe, tabela e método na
[evidência](../../../radiant-app/docs/evidence/2026-09-25-aquecimento-simulador.md),
seção "Segunda passagem". A CPU é do processo `Radiant`, em porcentagem de um
núcleo, com 30 amostras em 60 s por condição.

| Condição | Média |
|---|---|
| Estude recém-aberta, como está (duas vezes) | 43,4 % e 40,6 % |
| Com Reduzir Movimento ligado | 0,0 % |
| Só as 3 nebulosas | 30,1 % |
| Só as 120 estrelas | 39,3 % |
| Uma estrela só | 28,1 % |
| Perfil, com a Estude já montada | 65,8 % |
| Estude, depois de passar pelo Perfil | 66,1 % |

**Montagem, medida por log temporário no Metro:** ao tocar no Perfil, um
segundo fundo montou, e nenhum desmontou, nem na ida nem na volta.

## O que isso quer dizer

- **Medido:**
  - a aba visitada continua montada e animando;
  - o custo não é proporcional ao número de estrelas: uma só já custa dois
    terços do total.
- **Inferido:**
  - o custo é um piso por fundo animado, porque o laço de quadros do
    Reanimated roda enquanto houver animação infinita;
  - o conserto que rende é **parar a animação fora de foco**, e não reduzir
    `starCount`.

**A primeira passagem deu ~94 %, e esta, ~42 %, na mesma tela.** A causa não
foi medida. É provável que houvesse mais fundos montados na primeira, depois
da conferência da regra de vidas. Compare só dentro da mesma passagem.

## O que mudou no repositório

Só documentação, num run do Loop:
- a evidência do aquecimento ganhou a segunda passagem;
- a FILA atualizou o achado 5 e abriu o item do agente para o conserto;
- o STATUS atualizou a linha do branch, com o trecho antigo movido sem edição
  para o `STATUS_historico.md`;
- o roadmap ganhou uma linha na fatia do aparelho;
- o prompt (6) marcou o item 9 como feito, para ninguém refazê-lo.

**Nenhum código do app mudou.** As mudanças em `StarfieldBackground.tsx`
foram locais e revertidas, e o `shasum` final confere com o de antes
(`2588b5f7…`). O Metro foi parado, o `.claude/launch.json` temporário foi
apagado, e o simulador ficou desligado, com Reduzir Movimento desligado, como
estava. O progresso do simulador não foi tocado.

## O que não foi verificado

- **O aparelho.** Continua com o dono, no item 8.
- **Telas empilhadas sobre as abas** (lição, quiz, checkpoint, revisão). Cada
  uma monta o próprio fundo, e não foram abertas, para não mexer no progresso
  do simulador.
- **Se o piso é por instância.** Seria preciso medir dois fundos de uma
  estrela só.
- **Uma build sem modo de desenvolvimento** (`preview` ou `production`).
- **O gate `npm run quality`.** Não rodou, porque nenhum arquivo do app mudou.
  Rodou só o `loop validate` do run.

## Próximo

O conserto está na [FILA](../../FILA.md), achado 5, como item do agente:
parar o fundo fora de foco e medir de novo M1 e M4 na mesma passagem.
