# F8: revisão independente e tratamento (2026-11-15)

**Revisor:** subagente `agent-skills:code-reviewer`, que não escreveu o código. Ele leu
`git diff origin/main...HEAD` (5 commits, até `3f7a8cc`), a ADR, o levantamento e o
plano, e conferiu as afirmações contra o código. Não rodou `loop` nem editou nada.

**Veredito:** pedir mudanças. Três achados importantes e seis menores, nenhum com perda
de dado.

**Conferido como correto pelo revisor:**

- chave desligada: comportamento da `main`, sem I/O;
- as contraprovas pegam o defeito que nomeiam. Ele as copiou para fora com o gate
  removido, e as duas falharam;
- dia local;
- quem não recebe convite;
- ex-assinante sem amostra;
- preço só do StoreKit e regra das vidas intacta;
- inventário e G7;
- alvos de 44 pt e nenhuma animação.

Por acidente, ele rodou a suíte inteira em paralelo: 236 de 237 suítes passaram, e a
reprovada era o arquivo de mutação dele. Isso não é o gate.

O tratamento foi feito no run 2. O run 1 não declarava o teste de fluxo da aula, e o
escopo não se amplia depois de aberto.

| # | Achado | Gravidade | Tratamento |
| --- | --- | --- | --- |
| 1 | O convite aparece no meio de uma questão: na avaliação (`CheckpointScreen.tsx:455-458`) e na aula, ao confirmar sem vidas (`LessonFlowScreen.tsx:391-393`). | importante | Corrigido. `HeartsSheet` ganhou `inviteAllowed`, falso por padrão. A aula só o liga no caminho depois do retorno (`setHeartsSheetInvites(true)` junto do `setResumableNode`) e o desliga no caminho que barra a resposta; a Estude o liga no contador; a avaliação não o passa. Testes: `LessonFlowScreen.flow.test.tsx` ("F8: …") e `CheckpointScreen.flow.test.tsx` ("convite: não"), vistos falhando com o convite injetado no caminho errado. |
| 2 | A amostra expira no meio da aula: o HUD continua em ∞ e a perda seguinte não é anunciada. | importante | Corrigido. `useUnlimitedExpiry` (`useConversionInvite.ts`) chama a releitura das vidas quando `unlimitedUntil` vence, na aula e na avaliação. Datas além do limite do timer (assinatura) não agendam nada. Testado no gancho; a ligação nas telas é uma linha cada e não tem teste de fluxo. |
| 3 | A comparação diz "cada erro gasta uma", mas revisão e primeiro contato na aula híbrida não gastam. O teste era espelho do texto. | importante | Corrigido. O texto passou a "errar em aula ou avaliação pode gastar uma (revisão nunca gasta)", com teste visto falhando no texto antigo. |
| 4 | O comentário "Marca antes de dar" é falso: um toque duplo dá duas amostras. | menor | Corrigido. Toques simultâneos recebem a mesma promessa (`this.sampling`), e as vidas são gravadas antes de a amostra ser marcada. Testado com `Promise.all` e com falha de `setUnlimited`. |
| 5 | O dia é consumido, e o convite contado como visto, mesmo se a folha fecha antes de ele aparecer. | menor | Corrigido. `peekInvite` não grava; `markInviteSeen` roda só quando o convite chega à tela, e a folha fechada antes da decisão não consome o dia. Testado no gancho, visto falhando com o comportamento antigo. |
| 6 | Promessas sem `.catch`, e `load`/`save` sem serialização: contagem perdida. `screen_opened` e Ask to Buy não estão documentados. | menor | Corrigido. Os métodos públicos do serviço não rejeitam (`safely`), e as escritas vão numa fila. Os limites de `screen_opened` e do Ask to Buy estão na ADR, item 7. |
| 7 | A guarda da comparação não sabe nada da regra de cobrança. | menor | Em parte. Há uma guarda de comportamento que confere, nas regras de `HeartsService`, os números citados (gastar, recuperar em 30 min, a revisão devolver 1). Ela passou de primeira porque as regras estão certas; vê-la falhar exigiria quebrar `HeartsService`, fora do escopo do run. A regra "revisão não cobra" mora em `LessonFlowScreen` e não tem guarda direta além do teste de texto. |
| 8 | Conflito com a #72 em `killSwitches.contract.test.ts`; o levantamento dizia que não haveria. | menor | Corrigido. O teste da chave foi para o fim do `describe`, e a seção do `STATUS.md` para antes de "Risco de build". O `git merge-tree --write-tree` ficou sem conflito contra #71, #72, #73 e #74, e o levantamento §7 foi corrigido. |
| 9 | "Uma vez por aparelho" é por instalação; o cartão do console tem texto novo com a chave desligada; `router.push` com o Modal fechando não foi visto no iOS. | menor | Texto trocado para "Só uma vez, sem custo". A exceção do console está registrada na ADR. Na comemoração, `router.push` vem antes de `onContinue`, empilhando a assinatura sob o Modal antes de ele fechar. Isso não foi visto no iOS. |

## Gate e fechamento

- **Gate do app:** `cd radiant-app && EXPO_NO_DOTENV=1 npm run quality`, com
  `node --version` = v20.20.2, em 2026-11-15 sobre o commit `0cdf839`, com a árvore limpa.
  Saiu com 0: **238 suítes e 3134 testes**, `tsc` limpo e o Visual QA "passed without
  unapproved regressions". O lint dessa passada deu 25 avisos, sem erro; 4 eram do
  `ConversionService.test.ts` (imports depois de código). O commit `662240a` os tirou, e o
  `npx eslint src` voltou a 21 avisos, todos anteriores à F8. Medição local, numa
  worktree com só os arquivos desta branch.
- **`loop validate`:** run 1 (`run-1794756484027-0d38a488`, até `3f7a8cc`, mais o STATUS
  e os vermelhos) teve 15 de 15 validadores aprovados, fechado sem memória. Run 2
  (`run-1794759484835-cd2686f9`, correções da revisão, até `662240a`) teve 15 de 15,
  com o `app-quality` repetindo o gate sobre a árvore final, e foi fechado com a memória
  gravada (`MEMORY_WRITTEN`). O run 3 só acrescenta esta seção.

## Depois da PR: o primeiro CI

O job `quality` da PR #76 reprovou: 1 de 3134 testes, num teste do serviço que
dependia do fuso da máquina. O código estava certo e o teste, não. A correção foi
feita no run 4 e está detalhada em [vermelho.md](vermelho.md), seção "Run 4".
| 10 | (Codex, PR #76, `JourneyHomeScreen.tsx:332`) A amostra tomada na Estude vence com a tela aberta ou no fundo, e o cabeçalho continua em ∞, sem abrir a folha. | importante | Corrigido no run 5. A Estude liga o mesmo `useUnlimitedExpiry` da aula e da avaliação, e o gancho relê também na volta a `active`. Testes vistos falhando sem a correção e com só metade dela (`vermelho.md`, run 5). |
