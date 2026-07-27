# ADR — Estratégia de contas nas lojas (2026-07-27)

**Status:** aceita
**Decisor:** Anderson (proprietário do projeto)
**Contexto de origem:** task A1 do
[roadmap de lançamento](../plans/2026-07-27-radiant-launch-roadmap.md)

## Contexto

Nenhuma conta de desenvolvedor existe hoje em nenhuma das lojas. As opções
eram conta pessoal/individual ou conta de organização (que exigiria CNPJ ativo
e número D-U-N-S, com latência de dias a semanas).

Regras vigentes que pesaram na decisão (pesquisadas em 2026-07-27; ver §4 e §9
do roadmap):

- Google Play: conta pessoal criada após 13/11/2023 só publica em produção
  após teste fechado com ≥ 12 testadores opted-in por 14 dias consecutivos.
  Contas de organização são isentas dessa exigência.
- Verificação de desenvolvedores Android começa no Brasil em 30/09/2026.
- Apple: individual e organização custam US$ 99/ano; organização exige
  D-U-N-S e site próprio.

## Decisão

1. **Google Play: conta pessoal** (US$ 25, única vez).
2. **Apple Developer Program: conta individual** (US$ 99/ano).

## Consequências

- O teste fechado de 12 testadores × 14 dias é **obrigatório** antes do acesso
  a produção no Play. Ele já está no caminho crítico do roadmap (marco M4,
  tasks F2–F3) e não altera o cronograma planejado.
- O vendedor exibido nas fichas das lojas será o nome pessoal do titular, não
  uma marca. Aceito para o v1.3.
- Migração futura para conta de organização é possível, mas envolve
  transferência de app e nova verificação; se a marca corporativa se tornar
  requisito, tratar como projeto próprio pós-lançamento.
- A criação das contas, verificação de identidade e pagamento são ações do
  titular (não delegáveis a agentes); o repositório registra apenas o estado
  e as datas.

## Reversão

Se o recrutamento de 12 testadores se mostrar inviável até o início de M4, a
alternativa é obter CNPJ + D-U-N-S e criar conta de organização — ao custo da
latência do D-U-N-S. Essa troca deve ser registrada em novo ADR.
