# ADR — Currículo V3 em trilha contínua

**Data:** 2026-08-27
**Estado:** aceita
**Decisor:** Anderson
**Escopo:** produto, currículo, progressão e migração do conteúdo anterior

## Contexto

A verificação do build `1.3.1 (9)` no iPhone 16 expôs uma atividade sobre
profissão com imagem genérica de tórax e interação sem função pedagógica real.
O atlas posterior confirmou dois catálogos e várias superfícies editoriais que
não formam um currículo único nem garantem domínio.

O dono rejeitou ética e atribuições profissionais como proposta principal do
aplicativo. O valor aprovado é treinamento prático para melhorar o desempenho
diário em radiologia, com anatomia, fisiologia e física como pilares.

Apagar imediatamente o catálogo anterior é inseguro: progresso, tentativas,
revisões e nós persistidos ainda usam seus identificadores.

## Decisão

1. Criar um currículo isolado, identificado como V3, sem herdar conteúdo
   automaticamente do catálogo anterior.
2. Usar uma trilha contínua nesta ordem editorial:
   Fundamentos → Radiografia → Mamografia → Tomografia → Ressonância → Medicina
   Nuclear → Radioterapia → Outras especializações.
3. Retomar anatomia, fisiologia e física em espiral dentro das modalidades.
4. Desbloquear progresso por domínio demonstrado, nunca por XP, vidas, tempo ou
   passagem por telas.
5. Produzir e publicar lições individualmente apenas quando cada caminho
   estiver completo e revisado.
6. Retirar o catálogo anterior do produto somente no corte do V3, preservando
   temporariamente seu histórico em modo somente leitura.
7. Excluir código e arquivos legados apenas depois de migração testada,
   ausência de consumidores e validação de atualização em aparelho.
8. Submeter cada arco a auditoria independente de ciência, pedagogia,
   acessibilidade e evidência antes de considerá-lo publicável.

## Consequências

- O conteúdo anterior deixa de ser base editorial do produto.
- O progresso anterior continua consultável, mas não concede domínio no V3.
- A primeira entrega precisa incluir versionamento e migração, além das lições.
- Produção é mais lenta por lição, mas um nó só poderá ser publicado quando
  possuir finalidade, evidência e revisão explícitas.
- Acessibilidade e revisão técnica são gates de publicação, não correções
  posteriores.
- A ordem aprovada é uma escolha editorial do Radiant e não será descrita como
  classificação científica universal.

## Alternativas rejeitadas

### Manter a trilha de profissão e corrigir apenas a imagem

Rejeitada porque preservaria uma proposta de valor que o dono considera fraca
e deixaria intactos o texto genérico, os quizzes previsíveis e a falta de
progressão entre fundamentos e modalidades.

### Apagar imediatamente todos os arquivos anteriores

Rejeitada por risco de quebrar instalações existentes, progresso persistido,
retomada e histórico de tentativas.

### Concluir toda anatomia, fisiologia e física antes das modalidades

Rejeitada por criar um bloco inicial excessivo e impedir a retomada espiral dos
fundamentos no contexto em que se tornam úteis.

### Usar XP ou vidas como autoridade de progressão

Rejeitada porque recompensa não é evidência de aprendizagem e punição por erro
conflita com a remediação direcionada aprovada.

## Referência de design

Detalhes curriculares, contrato de lição e Arco 1:
[`2026-08-27-radiant-curriculum-v3-design.md`](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md).
