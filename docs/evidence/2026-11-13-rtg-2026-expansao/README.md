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
| M16, A condição do paciente na aquisição | 6 | [m16.md](m16.md) | 15 |

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

## Fatia do motor e ordem pedagógica

Levantamento e regra em [motor.md](motor.md). Implementação por um agente Claude Opus,
revista pela sessão da F1. Gate na fatia do motor, antes de mover a ordem:
`EXPO_NO_DOTENV=1 npm run quality`, Node 20.20.2, commit `1102ec4`, 238 suítes e 3164
testes, saída 0.

Saídas vermelhas relatadas pelo agente do motor (cada uma contra o código anterior ou
com o defeito injetado, depois restaurado):

- trilha concluída depois da inserção, código antigo: `Expected: true, Received: false` (M04 fechou);
- trilha em andamento logo depois do ponto, código antigo: `Expected: true, Received: false`;
- aluno no meio de um ramo, código antigo: `Expected: "m07", Received: "nova"`;
- aluno que concluiu tudo menos a inserida, código antigo: `Expected: "m07", Received: "nova"`;
- aluno novo, com a anterior ignorando trilha nunca iniciada: `Expected: false, Received: true` (M04 abriu);
- compatibilidade, com o padrão "todas iniciadas": `- Expected -7 / + Received +7`;
- serviço sem o conjunto de iniciadas: `Expected: "trilha-c", Received: "trilha-nova"`;
- escrita na trilha ativa: `Expected: "node:trilha-c-2", Received: "node:trilha-nova-1"`;
- percurso sem iniciadas: `Expected: true, Received: false` e `Expected: "c", Received: "nova"`;
- Perfil com a cópia antiga da régua: `Expected: "c-unit", Received: "nova-unit"`;
- celebração disparando por abertura: recebeu `+ "nova", + "c"`;
- linha percorrida sem o filtro: `- false,false / + true,true`;
- faixa antiga: `Unable to find ... label: Disponível: Inserida.`

Vista pela sessão da F1, com `JourneyTrackUnlockService.ts` trocado pela versão anterior
a `1102ec4` e o catálogo já com m15 depois de M03 e m16 depois de M09
(`rtgExpansionProgress.test.ts`, 2 de 4 reprovados; trecho):

```text
✕ nenhum aluno da 1.5.0 perde acesso ao que fez nem é levado de volta pela Home
✕ quem está adiante vê a unidade inserida aberta, sem ela virar a ativa
+ "concluídas 3 e no meio de track:rtg-2026:m04: track:rtg-2026:m04 fechou com progresso",
+ "concluídas 4: track:rtg-2026:m04 fechou com progresso",
+ "concluídas 4: trilha ativa track:rtg-2026:m15, esperada track:rtg-2026:m05",
+ "concluídas 9 e no meio de track:rtg-2026:m10: track:rtg-2026:m10 fechou com progresso",
```

Com a regra nova restaurada: 4 de 4 aprovados. Aceito e registrado: quem concluiu M03 e
não tinha nenhum nó concluído em M04 passa a ter M15 como próxima, e M04 só abre depois
dela; o mesmo vale para M09 e M16.
