# ADR — Aprendizagem por competências no Radiant (2026-07-31)

**Status:** aceita; implementação em andamento
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** planejamento de aulas, lições e jogos para ampliar o
valor educacional do app durante o beta

## Contexto

O Radiant já entrega uma jornada local-first com 18 atividades, revisão
espaçada, XP, sequência, checkpoints e recompensas. A experiência de conteúdo,
porém, continua centrada em quizzes: o player exige exatamente uma múltipla
escolha por bloco, 16 das 18 atividades foram geradas a partir de um único livro
e a Galáxia mantém uma segunda árvore estática separada do catálogo canônico.

O novo acervo contém 41 PDFs, dos quais 36 são únicos. Ele amplia a cobertura,
mas não pode ser tratado como material automaticamente reutilizável: as licenças
variam, livros comerciais proíbem reprodução e algumas obras permitem apenas
uso não comercial. O projeto também dispõe de imagens próprias, autorizadas e
anonimizadas, e de revisão especializada por lotes.

## Decisão

Adotar uma **trilha espiral por competências** como arquitetura educacional.

O primeiro público é o estudante iniciante de técnico em radiologia. A primeira
trilha é Fundamentos e Segurança Radiológica, com seis unidades e 30
competências. A sessão principal dura de 3 a 5 minutos e combina tentativa,
explicação visual, prática, aplicação e recuperação posterior.

O sucesso primário é domínio em checkpoints e retenção em revisões futuras.
Engajamento, XP e sequência permanecem importantes, mas não podem compensar
aprendizagem insuficiente. Erro produz feedback e reforço; vidas não bloqueiam
novas lições e ranking global fica fora da primeira fase.

O motor de lição evolui para atividades tipadas e reutilizáveis. A Galáxia se
torna projeção da jornada canônica. A repetição espaçada passa gradualmente de
lição para competência, preservando compatibilidade com o catálogo legado.

Fontes e imagens recebem manifestos de direitos, proveniência e autorização.
Cada unidade é revisada como lote completo antes da promoção.

## Alternativas descartadas

### Caminho linear de quizzes

É mais barato porque conserva o contrato atual, mas multiplica reconhecimento
de alternativas sem criar evidência suficiente de aplicação ou transferência.

### Currículo centrado em casos desde o primeiro contato

É mais próximo da prática, porém impõe carga cognitiva e editorial excessiva a
iniciantes. Minicasos entram dentro da espiral depois que os pré-requisitos são
apresentados.

### Novo produto de jogos separado da jornada

Criaria uma terceira árvore de conteúdo e progresso. Jogos serão renderizadores
do motor de atividades, compartilhando catálogo, evidência e domínio.

## Consequências

- a expansão começa por contratos de domínio, não por telas isoladas;
- as 18 atividades existentes continuam funcionais durante a migração;
- `QuizLesson` deixa de ser o modelo universal de conteúdo;
- a Galáxia deixa de governar nós e status estáticos;
- o pipeline editorial passa a validar direitos, mídia, competências e
  atividades, além de conceitos e formatos;
- o corte vertical da Unidade 1 precisa provar retenção antes da produção das
  outras cinco unidades;
- a ampliação do `writePolicy` para as novas raízes de fontes/mídia foi executada
  em transações Loop separadas antes da criação dos manifestos;
- novos tipos de jogo aumentam custo de acessibilidade, testes e E2E e, por isso,
  entram apenas quando associados a uma necessidade pedagógica comprovada.

## Documento normativo

A especificação completa está em
[`2026-07-31-sistema-aprendizagem-competencias-design.md`](../superpowers/specs/2026-07-31-sistema-aprendizagem-competencias-design.md).
