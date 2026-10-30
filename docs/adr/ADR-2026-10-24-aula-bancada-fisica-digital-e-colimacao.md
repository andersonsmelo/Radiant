# ADR — Aula-bancada: física de radiografia digital e colimação como segunda bancada

**Data:** 2026-10-24 (America/Bahia).
**Estado:** aceita pelo agente, **pendente do aval do dono** na revisão do
conteúdo das aulas de exemplo.
**Decisor:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), na execução do
plano 3, nas escolhas que a spec deixou ao agente ou ao plano. Não houve
resposta do dono sobre estes dois pontos.
**Relaciona-se com:** a [ADR da trilha Medalhão e da aula-bancada](ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md)
e a [régua de estrelas](ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md).
**Desenho:** a [spec](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md),
seção 5, a [prancheta da aula](../design/2026-10-21-aula-bancada.html) e o
[plano 3](../superpowers/plans/2026-10-21-aula-bancada.md), com o registro de
execução no fim.

## Contexto

A spec manda seguir a prancheta da aula e deixa duas escolhas em aberto:
- a física que a bancada simula;
- a segunda bancada, entre colimação e posicionamento, "depois de medir o
  custo de cada uma".

O texto do plano 3 descrevia a convenção do filme: subir o kV ou o mAs
escurece a imagem. O simulador da prancheta faz outra coisa. Ele normaliza o
brilho, com o comentário "o processamento digital ajusta o brilho; o contraste
relativo continua dependendo do kV", e o ruído depende só do mAs.

## Decisão

1. **A bancada simula radiografia digital, como a prancheta.**
   - O processamento normaliza o brilho.
   - O kV muda o contraste entre osso e partes moles.
   - O mAs muda só o ruído, que cai com 1/√mAs.
   - O texto do plano foi corrigido com uma nota nas restrições globais.
2. **A segunda bancada é a colimação.** A contagem no código está em
   [docs/evidence/2026-10-24-segunda-bancada.md](../evidence/2026-10-24-segunda-bancada.md):
   - a colimação pede um componente, cinco linhas de shader e três afirmações
     físicas;
   - o posicionamento pediria geometria 3D e pelo menos seis afirmações
     anatômicas, e o alvo dele é uma incidência real, que a regra de rigor
     afasta.
3. **O que a colimação afirma ao aluno:**
   - o **produto dose-área** cresce com a área do campo;
   - a **dose do feixe direto** num ponto dentro do campo não muda ao colimar;
   - campo menor reduz a radiação espalhada;
   - colimar até a região de interesse é proteção radiológica.

   O desafio enquadra o joelho inteiro com as partes moles, de 23 a 24 cm no
   fantoma, e não só os ossos.

## Consequências

- **As frases de física das duas aulas seguem estas afirmações.** Nenhuma
  afirma o que os modelos listam como simplificação, e um teste confere cada
  frase do código contra o documento de revisão do dono.
- **Se o dono preferir a convenção do filme ou outra segunda bancada,** o
  refazer é barato. Os modelos são funções puras (`exposureModel`,
  `collimationModel`), e as aulas são dados num catálogo próprio, que abre só
  em build de desenvolvimento.
- **Fica em aberto para o dono:** a aula manda subir o mAs de 2 para 16 e não
  diz que a dose cresce com ele. As saídas estão no
  [documento de revisão](../conteudo-bancada/2026-10-24-aulas-de-exemplo.md),
  na seção "Perguntas ao dono".
