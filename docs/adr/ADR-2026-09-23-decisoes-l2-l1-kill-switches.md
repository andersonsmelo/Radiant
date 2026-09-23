# ADR — Três decisões pendentes do dono: I2 da L2, C6 na L1 e os falsos kill switches (2026-09-23)

**Status:** aceita  
**Decisor:** Anderson Melo (dono do projeto), em 2026-09-23  
**Escopo:** Currículo V3 (spec e Arco 1) · configuração do app

As três estavam registradas como "decisão do dono, não tomada" em `STATUS.md` e
`FILA.md`. Foram decididas juntas, cada uma sobre fatos medidos na data e
citados abaixo.

## 1. I2 da L2 — código de erro próprio para a confusão entre planos ortogonais

**Fato.** `l2SlicingSpaceContent.ts` marca a família coronal × transversal com
`misconception: 'E-PLN-SEC'` (linha 64 e itens nas linhas 104, 112 e 120). A spec V3
§5.2 define `E-PLN-SEC` como confundir plano geométrico, região amostrada e
imagem. Nenhum dos nove códigos da taxonomia cobre trocar um plano ortogonal
por outro, e o rótulo errado contamina a matriz que P1 e C1 vão consumir
(parecer v3, I2).

**Decisão.** Criar na spec V3 §5.2 o código **`E-PLN-ORT` — confunde os planos
ortogonais entre si** (coronal, transversal, sagital), e reclassificar os quatro
pontos da L2.

**Execução.** Entra na **v7 da L2**, no mesmo run que corrige o Q1: a
reclassificação muda a remediação que o motor seleciona, então precisa passar
pela mesma auditoria. A emenda da spec e a do conteúdo vão juntas; código novo
sem item que o use, ou item que o use sem spec, não fecha.

**Rejeitadas.** Realocar o objetivo tiraria da L2 o contraste
frente/costas × cima/baixo, que é o que ela ensina. Manter `E-PLN-SEC` mistura
dois erros na matriz.

## 2. C6 na L1 — corrigir, depois da L2 v7

**Fato.** `BodyReferenceLessonPreview.tsx:106-107` renderiza `{index + 1}` ao lado
de `option.label`, um rótulo preso à identidade da alternativa ("Marcador 1",
"Superfície 1"). É o mecanismo do C6 da L2, já corrigido lá: quem decora o
rótulo acerta a recuperação sem ler o mapa. A aprovação da L1 (parecer v4 dela)
é anterior a este achado e não o cobre.

**Decisão.** Corrigir copiando a solução da L2 (rótulo derivado da posição),
com **auditoria independente curta restrita a essa mudança**.

**Execução.** **Depois de a L2 v7 fechar**, para não abrir duas frentes de
currículo ao mesmo tempo. Até lá, a L1 continua não ligada a rota, catálogo ou
startup, então o defeito não alcança usuário.

## 3. Os quatro falsos kill switches — apagar três, tornar real um

**Fato, medido em `radiant-app/src` em 2026-09-23:**

| Constante | Lida por | Decisão |
| --- | --- | --- |
| `AppConfig.ENABLE_GAMIFICATION` | ninguém | apagar |
| `AppConfig.ENABLE_HEURISTICS` | ninguém | apagar |
| `AppConfig.ENABLE_ONBOARDING` | ninguém; o `OnboardingService` usa uma constante local própria, também fixa em `true` | apagar as duas |
| `AppConfig.ENABLE_REVIEW` | `RatingPromptService.ts:93` (pedido de avaliação) | tornar real: `EXPO_PUBLIC_ENABLE_REVIEW`, padrão `true` |

**Motivo.** Constante que ninguém lê não protege nada, e o nome promete um
interruptor justamente na hora do incidente — a mesma falha que o `STATUS.md`
mediu em 2026-08-24. O pedido de avaliação é o único com uso plausível em
incidente (aparecer num momento ruim), e `EXPO_PUBLIC_*` é embutido no bundle,
então desligar por OTA funciona como no `ENABLE_LEARNING_ROAD`.

**Execução.** Run próprio de código, com guarda que lê o `config.ts` por **AST**
(não por texto): nenhuma chave `ENABLE_*` de `AppConfig` sem consumidor, e
`ENABLE_REVIEW` derivada de variável de ambiente. A guarda precisa ser vista
falhando contra o código atual antes da mudança.

## Fora desta ADR

- O **acordo de apps pagos** não é decisão: é medição. Foi lido em *Ativo* em
  2026-09-23 e está registrado em `STATUS.md` e no checklist de declarações.
- O **Ask to Buy recusado** que prende o estado pendente, achado na fatia 2 da
  Task 8, continua sendo decisão do dono, ainda não tomada.
