# Pareceres da expansão rtg-2026 (frente F1 da 1.6)

Medido em 2026-11-13. Mapa da expansão:
[`docs/plans/2026-11-13-rtg-2026-expansao-pela-ementa.md`](../../plans/2026-11-13-rtg-2026-expansao-pela-ementa.md).
Cada unidade foi escrita por um agente Claude Sonnet e revista por outro agente, Claude
Opus, que não viu o trabalho do autor. A revisão é por IA, não por profissional da área.

| Unidade | Aulas | Parecer | Achados corrigidos |
| --- | --- | --- | --- |
| S-US, Ultrassonografia para o tecnólogo | 6 | [s-us.md](s-us.md) | 14 |
| S-OD, Radiologia odontológica | 7 | [s-od.md](s-od.md) | 15 |
| M15, Células, tecidos e funções | 6 | [m15.md](m15.md) | 12 |

## Roteiros do Maestro

Gerados por `scripts/qa/generate-rtg-maestro.mjs` a partir do gabarito, em
`radiant-app/.maestro/rtg-2026/`: a aula 01 e a primeira avaliação de cada unidade
nova. **Não vistos na tela:** nenhum foi rodado em simulador nesta frente.

Saídas vermelhas do teste do gerador, relatadas pelo agente que o escreveu (Node
20.20.2; cada defeito injetado no gerador e depois restaurado):

- escape removido: `not ok 4 … unescaped metacharacter in Conferir (pulso). Agora?`
- respostas do certo ou errado removidas: `not ok 5 … i3 (true-false) has no answering command`
- avaliação com todas as competências: `not ok 6 … one block per item of aula 01, none from other lessons — expected: 2, actual: 12`
- sem o argumento `radiantReduceMotion`: `not ok 3 … m01-aula-01.yaml expected { radiantReduceMotion: '1' }`
- avaliação sem jogar a aula 01 antes: a primeira versão da asserção passou (fraca);
  corrigida, reprovou com `not ok 7 … lesson 01 summary comes before the checkpoint starts`.
