# Regra de vidas do checkpoint, conferida no simulador — 2026-09-25

**A regra:** uma vida por pergunta por tentativa, decisão 2 da
[ADR de 2026-09-24](../../../docs/adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md).
Está na `main` desde a PR #34. Na entrega ela foi coberta por testes de tela,
mas não foi conferida no simulador, por decisão do dono
([relatório](../../../docs/superpowers/handoffs/2026-09-24-radiant-vida-por-tentativa-relatorio.md)).
Este registro faz essa conferência.

**Resultado:** os cinco cenários se comportaram como a regra manda.

## Ambiente

- **Simulador:** `iPhone 17 H4 (iOS 26.5)`, `A5FA5443-4094-4F8E-B2AA-4703F355C77E`,
  o do gate H4, com o binário do E2E.
- **JavaScript:** servido pelo Metro a partir do branch
  `feat/d4-decisoes-de-revisao` (`82b1029`), que contém a PR #34.
- **Estado inicial:** o mesmo que o gate H4 deixou, na trilha "Matéria,
  energia e radiação", com 5 vidas e sem assinatura.
- **Checkpoint:** "Avaliação 2 de 5", nó
  `node:checkpoint:materia-energia-e-radiacao:ionizante-e-nao-ionizante`, com 2
  questões.
- **Como foi medido:** as ações foram feitas por flows do Maestro, que tocam
  pelo texto. Os toques por coordenada erravam porque a tela rola sozinha entre
  a captura e o toque. As vidas e a lista de cobranças foram lidas direto no
  AsyncStorage do simulador, nas chaves `@radiant:hearts_v1` e
  `@radiant:checkpoint_charged_items_v1`, depois de cada passo. Os flows estão
  em [`2026-09-25-regra-de-vidas-simulador/flows/`](2026-09-25-regra-de-vidas-simulador/flows/).

## Os cinco cenários

| # | O que foi feito | Vidas | Lista de cobranças do nó | Esperado |
|---|---|---|---|---|
| 0 | Acertar a questão 1 e sair antes de enviar | 5 → 5 | ausente | acerto não cobra ✅ |
| 1 | Reabrir, errar a questão 1 e confirmar | 5 → **4** | `[…:03]` | primeira cobrança da pergunta ✅ |
| 2 | Sair, reabrir e errar **a mesma** questão 1 | 4 → **4** | `[…:03]` | a mesma pergunta não cobra de novo ✅ |
| 3 | Errar a questão 2 e enviar | 4 → **3** | `{}` | cobra a pergunta nova, e o envio limpa a lista ✅ |
| 4 | Fazer o reforço acertando, reabrir e errar a questão 1 | 3 → **2** | `[…:03]` | depois de reprovar, a tentativa nova cobra de novo ✅ |
| 5 | Sair, reabrir, acertar as duas e enviar | 2 → **2** | `{}` | a aprovação limpa a lista ✅ |

**Selecionar uma resposta errada não cobra nada.** A cobrança acontece ao
confirmar, em "Próxima questão" ou "Enviar checkpoint"
(`CheckpointScreen.tsx`, `handleProductionAnswer`).

**Na tela:**
- depois do cenário 3, o resultado foi "Você acertou 0 de 2 questões", com o
  reforço exigido antes de tentar de novo, e o HUD mostrou
  "3 · +1 em 29 min" ([01](2026-09-25-regra-de-vidas-simulador/01-reprovado-3-vidas.png));
- no cenário 4, o HUD mostrou "2 · +1 em 23 min" na questão 2
  ([02](2026-09-25-regra-de-vidas-simulador/02-nova-tentativa-2-vidas.png));
- no cenário 5, apareceu a tela de aprovação
  ([03](2026-09-25-regra-de-vidas-simulador/03-aprovado.png)).

## Limites

- **Os cenários 0 a 2 não têm imagem salva.** A evidência deles é a leitura do
  AsyncStorage, registrada acima. O HUD em "4 · +1 em 29 min" durante o
  cenário 2 foi visto na tela, mas a captura não foi guardada em arquivo.
- **O cenário 0 não foi planejado.** Um toque por coordenada respondeu certo à
  questão 1 antes de o Maestro entrar. Ele confirma que acertar não cobra.
- **O simulador ficou alterado.** O checkpoint foi aprovado e a trilha está em
  7 de 18, com 2 vidas. Se ele fica ou é apagado, o dono decide.
- **Não verificado:** aparelho físico, assinante com vidas ilimitadas e a vida
  zerada no meio do checkpoint.
- **Visto e não investigado:** a tela de aprovação mostra "XP total: 90", o
  mesmo número de antes. Não conferi se este checkpoint deveria dar XP.
