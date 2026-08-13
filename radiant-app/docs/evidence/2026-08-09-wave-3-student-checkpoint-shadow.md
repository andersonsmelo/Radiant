# Evidência — Onda 3: adaptadores de checkpoint em shadow

**Data:** 2026-08-09
**Run Loop:** `run-1786314104218-908d111b`
**Escopo:** integração local; sem build, OTA, binário, loja ou sync remoto

## Resultado

As 12 superfícies governadas usam o mesmo hook inerte de checkpoint:
apresentação, Home, mapa da Galáxia, interior da galáxia, interior do planeta,
Missões, Progresso, Lição, quiz legado, checkpoint de unidade, Revisão e
recompensa.

O profile EAS `preview` configura `shadow` e `production` configura `off`.
`development` e `e2e-test` também resolvem para `off` pelo código, sem ampliar
seus mapas de ambiente. Produção força `off` mesmo diante de override `shadow`,
e valor inválido ou `active` falha fechado para `off` nesta onda.

O observador:

- escreve somente no `CheckpointStore.shadow` existente;
- não devolve decisão consumível por router ou domínio;
- ignora falha de storage, contrato ou rota sem interromper a tela legada;
- serializa somente ids, contagens, enums e códigos allowlisted;
- deriva `contentVersion` do manifesto local canônico da jornada;
- cobre entrada, progresso, saída, background, relaunch, catálogo alterado,
  deep link inválido e navegação repetida;
- mantém `JourneyProgressService`, `LessonOutcomeService`, XP, meta, revisão e
  filas antigas como autoridades exclusivas.

## TDD e validação local

O vermelho inicial teve **4 suítes falhando** pelos módulos e ligações ainda
ausentes. Depois da implementação:

- matriz nova: **4 suítes/22 testes**;
- módulo `student-checkpoints` completo: **9 suítes/80 testes**;
- regressão das telas tocadas: **10 suítes/47 testes**;
- lint: exit 0, com 11 warnings legados e nenhum erro;
- `tsc --noEmit`: exit 0;
- Jest completo do app: **75 suítes/494 testes**.

A matriz prova divergência determinística nula nos casos executados e falha
fechada nas bordas enumeradas. Ela não é prova de desempenho em aparelho nem
autoriza alegação irrestrita de entrega única.

## Limites preservados

Não houve promoção para `active`, CTA de retomada, Task 12 educacional, mudança
de `1.3.1 (7)`, rede, outbox remota, build, OTA, binário, TestFlight, Play ou
publicação. A próxima onda é o runtime `active` somente interno, com CTA e
fallback canônico.

O estado público do run Loop é a autoridade para validação, sucesso, memória e
fechamento finais.
