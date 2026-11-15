# F3: revisão independente (2026-11-15)

Um subagente revisor (agent-skills:code-reviewer), que não escreveu o código, leu o
diff inteiro, a ADR e esta evidência, rodou as 10 suítes tocadas, o `tsc`, o `eslint`
e o `docs-contract`, sem editar nada. Veredito: pedir mudanças; nenhum achado
bloqueante; com a chave desligada, o app é a base. Os vermelhos das correções estão em
[`vermelho.txt`](vermelho.txt), seções 10 e 11.

| # | Gravidade | Achado | O que foi feito |
| --- | --- | --- | --- |
| 1 | Importante | O mapa não governava a animação: `feedbackMotion` sem consumidor, cunhagem em 300 ms fora da faixa de 450–700, `advance` e `dialogue_line` sem animação, e testes que espelhavam a tabela | **Corrigido.** `motionMsFor` alimenta a alternativa (100), o cartão (150), a fala (200) e a cunhagem de aula e unidade (600). Testes nos componentes asseveram a duração do `Animated.timing` e do `withSpring` chamados; vistos falhando com 220 e 300 (seção 10). `advance` passou a `none` (troca simples), dito na ADR. |
| 2 | Importante | A medalha da unidade só cunhava na primeira unidade com a Home montada (`played` não rearmava) | **Corrigido** na própria comemoração: a medalha cunhada é um filho com `key` pela unidade. A primeira tentativa, rearmar `useMedalMint` quando `earned` cai, quebrou o contrato da Medalhão (`motion.test.ts`: o mesmo ganho não recunha) e foi desfeita. Testes com `m01 → null → m02` e `m01 → m02`, o segundo visto falhando sem a `key` (seção 12). |
| 3 | Importante | "Aula sem erro" sem caso negativo; as duas metades da condição eram apagáveis sem falha | **Corrigido.** Dois testes, um por metade, cada um visto falhando com a mutação que apaga a sua metade (11b, 11c). |
| 4 | Importante | Faltava contraprova isolada da cunhagem e do anúncio com a chave desligada | **Corrigido.** A conclusão desligada assevera `mintOnComplete` falso na `LessonSummary`; a retomada desligada assevera que o anúncio não traz incentivo. Vistas falhando com cada vazamento isolado (11d, 11e). |
| 5 | Importante | O leitor de tela ouvia "Pixel preocupado" e a tela desenhava "pensando" | **Corrigido.** O rótulo do erro é "Pixel pensando com você", com e sem a chave. |
| 6 | Menor | Contador único de incentivo podia repetir a frase do mesmo marco | **Corrigido.** Um contador por tipo; a frase de aula sem erro roda entre aulas da mesma abertura do app. Sem teste de tela próprio: a fixture tem três interações e não chega ao segundo marco; o rodízio está coberto em `encouragement.test.ts`. |
| 7 | Menor | O marco era dito duas vezes ao leitor de tela | **Corrigido.** Com a chave e um incentivo, o anúncio leva o incentivo no lugar da contagem. Teste visto falhando antes da correção (seção 11). |
| 8 | Menor | Toque duplo no Conferir, no mesmo quadro, pode apagar o incentivo de retomada | **Não corrigido.** O toque duplo já duplicava a contagem de sequência e a confirmação na base; a guarda certa é na confirmação inteira, fora do recorte desta frente. Fica como pendência. |
| 9 | Menor | Com a chave desligada, a árvore da unidade tinha um envoltório a mais | **Corrigido.** O `MotionView` só entra com a chave ligada. |
| 10 | Menor | A revisão recebia "Aula sem nenhum erro." | **Corrigido.** A frase não vale para revisão; teste visto falhando antes da correção. |
| 11 | Menor | Leitura de ref no render | **Corrigido.** A frase é calculada no momento de gravar o resultado e guardada em estado. |
| 12 | Menor | Os sons novos são uns 15 dB mais altos que o `toque`, e o texto dizia o contrário | **Documentado.** `sons.md` e a ADR dizem os números e deixam o nivelamento ao ouvido do dono. Os arquivos não mudaram. |
| 13 | Menor | O README da evidência apontava para este arquivo, que não existia | **Corrigido** com este arquivo. |
| 14 | Menor | O plano dizia `usePressDepth` em Reanimated, e a ADR registrava outro caminho | **Corrigido.** O passo 6 do plano diz o que foi feito e por quê. |
