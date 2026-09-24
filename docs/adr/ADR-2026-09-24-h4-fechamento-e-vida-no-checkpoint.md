# ADR — A H4 fecha com os dois consertos; o checkpoint não cobra duas vezes a mesma pergunta na mesma tentativa (2026-09-24)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-24, nesta conversa ("prossiga conforme recomendação", sobre as opções 1B e 2B)  
**Escopo:** Radiant 1.4 · gate H4 · regra de vidas no checkpoint  
**Insumos:** [evidência do gate H4](../../radiant-app/docs/evidence/2026-09-24-gate-h4-simulador.md),
[spec 1.4](../superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md) §5

## Contexto

O gate H4 foi percorrido no simulador em 2026-09-24:
- aprovação, reforço e retomada sem persistir respostas passaram;
- ficaram dois defeitos abertos:
  1. o texto do checkpoint promete "10 questões" e "8 acertos" para avaliações
     de 2 itens;
  2. os tamanhos de texto de acessibilidade quebram a trilha e o checkpoint;
- o VoiceOver real não foi exercitado, porque o simulador não o roda.

A spec 1.4 diz, na tabela de vidas: *"errar em lição nova ou checkpoint: −1; só
a primeira resposta de cada pergunta conta"*. Hoje, o registro das perguntas já
cobradas é um `Set` em memória (`chargedCheckpointItems`, em
`CheckpointScreen.tsx`). A tela o zera a cada remontagem. A remontagem foi
medida quando o app é fechado; pelo código (`useRef`), acontece também quando o
aluno sai pelo ✕ e volta. Em produção o checkpoint não retoma do ponto, porque
o modo do kernel é `off`.

Medido: o aluno errou a questão 1 e perdeu 1 vida. Fechou o app, e a avaliação
recomeçou do zero. Se errar a mesma questão de novo, paga de novo. A vida da
primeira vez continuou gasta.

## Decisão

1. **A H4 fecha quando os dois defeitos estiverem corrigidos**, cada um num run
   com teste vermelho antes, e com o **checkpoint conferido de novo no
   simulador**.
   - O **VoiceOver num iPhone físico sai da H4** e vira item próprio da 1.4,
     feito junto com o build `development` no aparelho (item 4 da lista de
     pendências).
   - A árvore de acessibilidade já medida é a evidência provisória desse ponto.
2. **Numa mesma tentativa, cada pergunta do checkpoint custa no máximo uma
   vida, mesmo que o aluno saia e volte.**
   - **A tentativa vai do primeiro "Iniciar checkpoint" até o envio**, quando a
     avaliação é registrada. Envio que reprova abre o reforço, e a tentativa
     seguinte, depois dele, é nova e cobra de novo. Isso já acontece hoje e não
     muda.
   - **O que se persiste:** só a lista dos ids das perguntas já cobradas na
     tentativa aberta, por nó de checkpoint. **Nunca a alternativa
     escolhida.** O contrato de "não persistir respostas" continua valendo.
   - **Quando a lista é apagada:** no envio, com aprovação ou reprovação.
   - **A vida já gasta não é devolvida.** Devolver ao abandonar abriria a
     brecha de sair toda vez que errar.

## Consequências

- A H4 deixa de depender de aparelho físico. A pendência de VoiceOver passa
  para a lista da 1.4, e não some.
- A regra 2 muda algo que o aluno sente: o aluno que sai e volta não paga duas
  vezes pela mesma pergunta. Ela precisa de teste que a veja falhar pelo
  defeito específico: errar, remontar a tela e errar a mesma pergunta cobra
  **uma** vida, não duas.
- Assinante ilimitado não é afetado, porque errar não custa (spec §5).

## Alternativas descartadas

- **Fechar a H4 já, com os defeitos soltos:** o texto errado aparece em todo
  checkpoint, e a H4 existe para barrar isso.
- **Exigir o VoiceOver em aparelho para fechar a H4:** prende um gate de
  engenharia a um aparelho que ainda não tem build.
- **Deixar a cobrança como está:** contradiz a regra escrita ("só a primeira
  resposta de cada pergunta conta").
- **Devolver a vida ao abandonar:** vira brecha.
