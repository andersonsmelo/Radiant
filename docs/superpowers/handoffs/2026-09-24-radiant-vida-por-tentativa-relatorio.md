# Relatório — uma vida por pergunta por tentativa no checkpoint (2026-09-24)

**Frente:** item 7 do [prompt de continuidade (3)](2026-09-24-radiant-prompt-de-continuidade-3.md).  
**Regra:** [ADR 2026-09-24](../../adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md), decisão 2.  
**Autorização:** o dono confirmou a decisão 2 e a condição de pronto nesta
conversa: testes, gate e documentos, sem conferência no simulador.  
**Branch:** `fix/e2e-defeitos-2-e-3`, local, **sem push**.

## O que mudou

- `radiant-app/src/features/checkpoint/checkpointChargeLedger.ts` (novo):
  - grava, por nó de checkpoint, os ids das perguntas já cobradas na tentativa
    aberta, na chave `@radiant:checkpoint_charged_items_v1`;
  - a alternativa escolhida nunca entra: a API só recebe o id do nó e o da
    pergunta;
  - `claim` reserva a cobrança e devolve `true` só na primeira vez; as
    operações passam por uma fila, como no `HeartsRepository`;
  - `clear` apaga a lista de um nó;
  - dado corrompido vale como lista vazia.
- `CheckpointScreen.tsx`:
  - o `Set` em memória `chargedCheckpointItems`, que se perdia a cada
    remontagem, deu lugar ao registro;
  - a reserva é gravada **antes** da cobrança: se o app morrer entre as duas,
    o aluno deixa de pagar, em vez de pagar duas vezes;
  - a lista se apaga logo depois de `activeCheckpoint.commit`, com aprovação
    ou reprovação;
  - se o registro falhar, a lista fica e a tentativa continua.
- `storageKeys.ts`: a chave nova.

## Evidência medida

**Vermelhos, antes do conserto, no Node 20 e com `--runInBand`:**

| Teste | Esperado | Recebido |
|---|---|---|
| errar, sair e errar de novo a mesma pergunta | 1 cobrança | **2** |
| reprovar, voltar e errar a primeira pergunta | 3 cobranças | **2** (com a persistência feita e o `clear` ainda ausente) |
| aprovar depois de uma tentativa abandonada | lista do nó ausente | **`["checkpoint:materia-energia-e-radiacao:01"]`** |

Nos três casos, quem falhou foi a asserção final, a que nomeia o defeito.

**As 5 guardas de unidade do registro**, que foram escritas depois do código,
foram derrubadas uma a uma pelo defeito que cada uma nomeia, e o arquivo foi
restaurado byte a byte (`cmp`):

| Defeito injetado | Guarda que falhou |
|---|---|
| um balde só para todos os nós | isolamento por nó, formato gravado e `clear` por nó |
| campo extra no registro | "grava só os ids, e nada mais" |
| fila removida | duas reservas simultâneas: 2 cobranças em vez de 1 |
| `catch` removido | registro corrompido: `SyntaxError` |

**Gate:** `EXPO_NO_DOTENV=1 npm run quality`, em `radiant-app`, no Node
v20.20.2, sobre a árvore do branch mais este diff:
- exit 0;
- **151 suítes / 1423 testes**, contra 150 / 1415 antes: +1 suíte e +8
  testes;
- lint com 0 erros e os mesmos 26 avisos;
- visual QA sem regressão.

**Outros testes que montam a tela:** `screen-integrations.test.ts` e
`JourneyNodeCompletionGuard.test.tsx` passam sem mock do AsyncStorage.

## Inferido, não medido

- **Envio registrado com o app morrendo antes do `clear`:** a lista
  sobreviveria, e a tentativa seguinte deixaria de cobrar essas perguntas uma
  vez. A janela é de milissegundos, e o erro é a favor do aluno.
- **A lista é local:** não entra no backup do CloudKit nem no
  `PEDAGOGICAL_STORAGE_KEYS` da migração, de propósito, porque é estado de
  tentativa e não progresso. Restaurar o progresso em outro aparelho começa
  com a lista vazia.

## Não verificado

- **O comportamento no simulador:** o dono dispensou essa conferência na
  condição de pronto. Ela entra naturalmente no item 4 da lista, o VoiceOver
  no aparelho, que percorre uma avaliação do checkpoint.
- **O VoiceOver** segue no item 4 da lista.

## Estado

- Commit local no branch `fix/e2e-defeitos-2-e-3`, sem push.
- A ordem de merge do item 1 continua valendo: #32 → docs 2 → este branch.
