# T05 — implementação congelada para revisão

**Status: DONE no escopo do implementador.** Revisão independente, nativo e encerramento do writer continuam com o controlador.

Worktree: `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`. Branch `claude/trilha-medalhao-design`. Base/HEAD `ae2e769d89bac2a4de3b11e5a4fe602d86b31323`. Node dos comandos do app: **v20.20.2**. Writer existente `run-1793116969213-81113b5b`, sem novo run/sessão pelo implementador.

## Proveniência

Retomei o autor interrompido. Layout, hooks, contexto e vermelho já estavam no disco. Preservei `red.txt` (SHA-256 `dcbafa6836aaaf75f8e0edded2a5785ea40aed4b1dfa1e13e42db74a7536f408`); não afirmo ter executado esse vermelho. Nesta retomada conferi o diff, executei os testes, corrigi a tipagem das guardas e acrescentei prova de resolução única do ganho, contagem dos ícones 0–3 e conservação do prêmio nos callbacks reais. Nenhuma correção permanente de implementação foi necessária após a retomada.

## Resultado entregue

- Os únicos consumidores reais, QuizScreen e LessonFlowScreen, enviam tema/título em aula e revisão. Quiz resolve tema pelo nó/unidade do catálogo e usa `lesson.title`. LessonFlow usa nó e, sem nó, título do catálogo/bloco ou `presentation.payload.title` do hook, com tema da atividade; não lê `activity.title` nem deriva texto do id.
- Resumo com medalha do tema, régua completa 0–3, título sem truncamento/teto e conteúdo rolável. Zero usa aparência neutra separada de `state="done"`, mantém conclusão, ilustração e interação; recorde maior fica à parte.
- XP real positivo aparece grande e sem card. Null mantém “Sem XP nesta tentativa”, zero mantém “Progresso registrado”; não há valor inventado. Avaliação opcional, Continuar e Refazer preservados. A primeira resposta continua valendo nos testes de fluxo existentes.
- Confete removido dos dois consumidores. Revisão não monta Pixel. HybridLessonCharacter mantém pose `comemora` com reduzir movimento.
- Um componente por estrela, hooks no topo. Cunhagem usa a única mola nova (300 ms); estrelas preenchidas assentam por timing 220 ms e atraso 0/60/120 ms (total ≤340 ms), vazias/repetição sem melhora não encenam ganho. Preferência reduzida/pendente deixa estado final. Avaliação/rerender não reproduz ganho nem grava conclusão/prêmio novamente.

## Verificação executada nesta retomada

Os comandos completos, CWD e saídas estão em [green.txt](green.txt); índice de fases/falhas em [audit.md](audit.md). **Contagens independentes, sem soma.**

| Medida | Resultado |
| --- | --- |
| Primeira medição do produto herdado nesta retomada | 7 suítes / 233 testes PASS |
| Sete focais após novas guardas, antes de limpeza final só de testes | 7 suítes / 236 testes PASS, 22.850 s |
| Summary com bytes finais | 1 suíte / 40 testes PASS, 8.139 s |
| Três fluxos com bytes finais, `/usr/sbin/taskpolicy -b` | 3 suítes / 131 testes PASS, 56.773 s |
| Contratos easing/contraste/copy/Maestro | 121/121 PASS |
| Typecheck `tsc --noEmit` | exit 0, sem diagnósticos |
| ESLint dos 12 arquivos alterados de produto/teste | exit 0, sem diagnósticos |
| `visual:qa:strict` | 0 regressões; 49 baseline e 3 exceções existentes |
| Mutações delimitadas | 17/17 KILLED; review-pixel repetido contra a guarda final acessível, 2 falhas específicas |
| Baseline HEAD dos três fluxos | 3 suítes / 120 testes PASS; mesmos 10 avisos `act` |
| `git diff --check` | exit 0 |

O único delta após o sete/236 foi anotação de tipo no teste da régua e consulta da ausência de Pixel pelo rótulo real, para respeitar R5. Os caminhos afetados foram remensurados como acima. Injeções temporárias foram restauradas por hash antes dos verdes; não houve sintaxe/timeout contado como defeito detectado.

## Arquivos e self-review

Implementação: `LessonSummary.tsx`, `QuizScreen.tsx`, `LessonFlowScreen.tsx`, `HybridLessonCharacter.tsx`, `ui/motion.ts` e a API de aparência mínima em `JourneyMedal.tsx`. Guardas nos seis testes correspondentes; `HybridLessonCharacter.test.tsx` é novo. `HybridLessonScreen.flow.test.tsx` ficou intacto e foi executado. Story/requires ficaram intactos/ausentes. São 12 paths de produto/teste alterados dentro dos 15 permitidos; hashes de todos os 15 constam em `audit.md`.

Conferi neutralidade sem bloqueio, título/tema nos caminhos reais, ganho não repetido, Pixel ausente de revisão, callbacks, XP null/0/positivo e ausência de import Reanimated nas telas. Fontes, economia/progresso, SDK/runtimeVersion e trabalho alheio foram preservados. `docs/STATUS.md` e `docs/archive/STATUS_historico.md` pertencem ao controlador e não foram editados por mim.

## Limites para o próximo gate

Não executei nativo, Metro, build, instalação, CI, quality completo ou Loop validate; não abri/fechei writer/brain, não fiz commit/push. Não há prova de fps, shader, encaixe de texto máximo no aparelho ou sensação física da cunhagem. O ruído `act` foi reproduzido integralmente na baseline focal, sem supressão. O controlador pode agora congelar o snapshot, revisar e medir iOS/Android; qualquer correção de produto deve voltar ao implementador.

**Produto congelado em 2026-10-27T17:54:03.515406+00:00.** Evidência íntegra: `red.txt`, `green.txt`, `mutations.json`, `audit.md` e este relatório. Auxiliares na pasta SDD excluída. Não reabrir decisões de direção Medalhão ou alterar policy/baseline para o nativo passar.


## Rodada de correção 1 — freeze2 após P2 nativo AX5

**DONE no escopo da correção estática; gate nativo OPEN.** A revisão R1 de código/quality não comprovou legibilidade nativa: as capturas iOS AX5 mostraram título/frase/subtítulo cortados em faixas horizontais dentro do conteúdo. Inspecionei as PNGs, o precedente T04 e o conversor de atributos de texto do RN instalado. Só comecei escritas após WRITERELEASE explícito do controlador.

A mudança mínima em `LessonSummary.tsx` retira o lineHeight explícito de **três estilos** (title, phrase, subtitle), preservando Sora, tamanhos/pesos, escala livre, copy e fluxo. Não alterei outros estilos, fontes globais, teto/truncamento, prêmio ou gabarito. A relação causal visual é hipótese até pass2 nativo.

As três guardas novas em `LessonSummary.test.tsx` leem os drivers do Text renderizado e seus ancestrais roláveis. RED antes da alteração: lineHeight38/24/24. GREEN AX5:3/3. Mutação exata restaurando a fonte R1:3falhas específicas; R2 restaurado por SHA. Focal final Summary+QuizFlow+LessonFlow: **3suítes/164testes PASS**,21.503s; `tsc --noEmit` e ESLint dos2paths passaram. Comandos executados em `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`, Node **v20.20.2**. Sem quality/Loop/nativo nesta rodada. Os2avisosact de LessonFlowAttempt pertencem ao mesmo conjunto já classificado na baseline R1; não foram suprimidos.

`red.txt`, `green.txt`, `audit.md` receberam append; o prefixo vermelho original349443bytes e as PNGs R1 continuam intactos. O índice causal, hashes de preservação e a mutação constam no adendo da auditoria e em `mutations.json.fixRound1`.

**Freeze2 em 2026-10-27T18:11:28.313526+00:00:**

| Path | SHA R1 | SHA R2 |
| --- | --- | --- |
| `radiant-app/src/features/quiz/components/LessonSummary.tsx` | `ee9523558726ffebf45b0152b3161d075d43bd3e09295466b967f446199ddfea` | `de4be8c1d5a6743d39e0d4a0fb0b2c710a78141525ec6923165bfba05ae04227` |
| `radiant-app/src/features/quiz/components/LessonSummary.test.tsx` | `636cf9cb8271b792d9ca4f7324ad65bdd8cff1218502e090324a40e84a9ebc60` | `0aa8274e8270ebf351e7412d4700209beb02d3f82c7d413b8b58baae0e30e94b` |

Todos os demais13paths do manifesto mantêm os hashes R1. Próximo passo do controlador: **revisão independente R2 e remedição nativa pass2**, incluindo AX5 no topo e fim do resumo. Jest comprova a remoção dos limites de parágrafo e preservação dos drivers; não comprova a integridade dos glifos nem autoriza declarar o P2 resolvido. Produto novamente congelado.


## Rodada de correção 2 — freeze3, troca de Dynamic Type ao vivo

**DONE no escopo do implementador; P2 nativo continua OPEN até remedição final e revisão.** Nova reposição de implementador, explicitamente autorizada pelo controlador. Não executei as fases anteriores nem as reivindico como próprias. Só escrevi produto depois de WRITERELEASE com apps, simuladores, AVD e Metro encerrados.

A discriminação nativa R2 do executor/controlador mostrou título/frase/subtítulo íntegros ao montar já em AX5 e corte ao mudar large→AX5 no resumo aberto. O sourcemap iOS servido tinha a fonte freeze2; não se tratou a hash do arquivo local como prova isolada do bundle do cliente. **Fix1 (altura natural) não foi causa suficiente nem correção visual total.** As referências do RN instalado indicam propagação de fontSizeMultiplier pelo layoutContext e medição/cache dos Paragraph, coerentes com invalidação incompleta na mudança dinâmica; isso é diagnóstico local sustentado pelo comportamento do binário, não uma afirmação de patch upstream.

O fix2 lê fontScale uma vez no Summary, usa a função existente isLargeTextScale e renova exclusivamente hosts Text próprios quando a escala muda, inclusive entre duas escalas grandes. ResultRow recebe a escala para seus dois Text; subtítulo usa Fragment keyed preservando a literalidade que Maestro consome. Recorde, XP, hábito, agenda e textos da avaliação entram na mesma fronteira. Summary, ScrollView, medalha, estrelas, Pressables, rating controls e callbacks conservam identidade/efeitos. Sem alteração global de fonte, tamanho, Sora, escala máxima, economia, primeira resposta, copy ou políticas. AppButton/CTA e Text de componentes compartilhados ficam fora deste fix local: seu comportamento dinâmico deve ser avaliado explicitamente em T17; não se declara correção global do RN.

### Provas desta rodada

CWD `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app`, Node medido **v20.20.2**, EXPO_NO_DOTENV=1.

- RED antes da fonte: **6 falhas causais /43skip**,13 hosts retidos em1→3.1 e3.1→2.5, subtítulo de revisão/XP null/zero/positivo retidos e texto de avaliação dada retido. Nenhum erro de harness.
- Summary+QuizFlow+LessonFlow: **3 suítes/170 testes PASS**,48.845s. Essa fase precede ajuste só do comparador no teste, sem mudança da fonte.
- Após esse ajuste e mutações: **Summary final49/49 PASS sob `/usr/sbin/taskpolicy -b`**,38.343s; não somar contagens de fases sobrepostas.
- Contrato Maestro **38/38 PASS**, preservando a extração literal do subtítulo. Typecheck e ESLint dos dois caminhos finais: exit0, sem diagnóstico.
- **3/3 mutações finais KILLED:** keys constantes6falhas; keys apenas pelo booleanlargeText4falhas (3.1→2.5); remount indevido do ScrollView1falha semântica (Expectedtrue/Receivedfalse). Fonte e teste restaurados por SHA após cada injeção. A primeira tentativa de remount produziu erro do formatter ao imprimir instância desmontada e foi rejeitada como prova; comparação pública de identidade por booleano corrigiu o diagnóstico e as três injeções foram repetidas nos testes finais. Logs inválidos preservados, sem serem contados.
- Dois avisos act de LessonFlowAttempt nos três fluxos, já classificados na baseline e sem supressão. Summary final sem novos avisos.

As seis guardas observam identidade pública de hosts encontrados por texto/role; nenhuma lê fiber/key privado ou espelho de props em produção. Verificam também que a mesma escala não remonta texto, os demais hosts persistem, a avaliação controlada permanece, os callbacks continuam funcionais e cunhagem/entradas de estrelas não se repetem. Isso caracteriza a fronteira de montagem; **Jest não rasteriza glifos**.

**Freeze3 em 2026-10-27T20:47:47.412916+00:00:** Summary `68a7f89960af099900fad1cae570d54f848339a35e5d85cd658cc5090514a9cd`, teste `3149cfd38cb230ca7c85c7a3a91862b62384feac0381bc2ab4448451ee9a11b6`. Os demais13paths nominais mantêm freeze2. Manifesto completo local `task7-freeze3-product-hashes.json`; somente Summary.tsx/teste mudaram nesta rodada. Logs brutos red/green/report/audit receberam append com prefixos preservados; mutations.json recebeu fixRound2, com backup local anterior à escrita.

Self-review: todos os Text próprios cobertos, nenhuma key em controle/scroll/movimento, nenhuma gravação de prêmio/conclusão disparada pela escala. `git diff --check` focal será conferido no fechamento da rodada. Não iniciei nativo, Metro, build, instalação, quality completo, Loop, git writes ou subagentes. Próximo gate: revisão independente limitada ao fix2 e prova nativa da troca large→AX5, montagem inicial e fronteira Android nos bytes freeze3.

Fix2 fechamento focal: `git diff --check` dos dois caminhos exit0;15/15 hashes freeze3 reconferidos. Produto congelado para revisão/nativo, P2 visual ainda OPEN.


## Rodada de correção 3 — consumidor de teste omitido no inventário

**DONE no escopo do implementador; revisão limitada e novo gate configurado pertencem ao controlador.** O gate integral inicial terminou13/15, com app-quality/app-test exit1, sem timeout. Reprodução integral do controlador:201suítes (200PASS/1FAIL),2529testes (2528PASS/1FAIL),76.477s; único caso falho na autorização de conquista via deep link de JourneyNodeCompletionGuard.test.tsx. O run original `run-1793116969213-81113b5b` foi fechado pelo controlador como **substituído, sem sucesso**; novo writer `run-1793152438847-57dea062`,61caminhos, STEP_STARTED confirmado antes da escrita. O suplemento de escopo é task7-fix3-scope-ruling.md; allowedRoots já cobria o caminho, sem mudança de política.

Delta permanente desta rodada: **uma linha** `...jest.requireActual('../../../ui/motion')` antes dos overrides do mock local em `radiant-app/src/features/journey/services/JourneyNodeCompletionGuard.test.tsx`. O mock antigo fornecia useScalePop, consumido antes de T05; omitira useMedalMint/useResultStar/MotionView que o Summary atual exige. A linha usa o mesmo padrão dos flowtests nominais e mantém TODOS os demais bytes do teste, overrides e asserções de autorização/progresso/economia. JourneyProgressService continua real; a guarda verifica o estado persistido. Nenhuma asserção nova para espelhar o mock e nenhum fallback em produto para tolerar fixture incompleta.

Node medido **v20.20.2**, EXPO_NO_DOTENV=1 CI=1, CWD radiant-app desta worktree. RED focal existente:1FAIL/5PASS (6total), mesmo caso de deep link. GREEN da suíte inteira6/6,8.267s; após reversão/restauração, GREEN final6/6,8.454s. Typecheck e ESLint do consumidor: exit0. `git diff --check` focal: exit0. Os outros15paths nominais de produto permanecem exatamente freeze3; não houve novo delta nativo nem perda da prova visual por mudança de runtime.

A reversão temporária de fixture retirou a linha e reproduziu o mesmo1FAIL/5PASS; a linha foi restaurada por SHA `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28` e o verde final executado. **Isso é caracterização de compatibilidade do harness, não mutação de produto nem prova de que o defeito de autorização foi reinjetado.** O erro de consulta em árvore desmontada foi o sintoma do consumidor que não montava. Não o contei entre as mutações de produto.

O console getCardStateundefined permaneceu nos verdes. A chamada e o mock incompleto desse serviço já constavam do HEAD anterior; o catch do player entrega o resumo de fallback. A reparação do motion permite que a guarda chegue às asserções mantendo esse console, distinguindo-o da falha impeditiva. Nenhum log foi suprimido ou serviço alterado para limpar a saída. O aviso de open handles da reprodução integral do controlador é registrado, sem ser promovido a causa do exit1.

Freeze do único teste novo no escopo: antes `58a2cfeeadb45a62ffe4aabf736ca86d7a98380d7f55e5d0aa7b2e79ac57e97c`, depois `05f519f87294488f882538e72076d5ab609e348369c7e1bb4dd6e1546b314a28`. Manifesto local task7-fix3-freeze.json confirma delta exato de uma linha e15/15 produtos freeze3 intactos. Report/audit/red/green receberam append e conservam prefixos; mutations.json recebeu uma classificação separada de fixture, com backup anterior. Auxiliares e log integral do controlador permanecem na SDD; o log integral tem SHA `f7f3e60172525617eda70cc796d4f05b2082a4da3ae23c367200ce3efa340712` e374320bytes nesta medição.

Self-review: o novo export spread precede os overrides e não os substitui; todas as seis guardas de autorização existentes executaram. O patch é isolado no mock desse arquivo, portanto os três fluxos já aprovados e as imagens freeze3 não foram refeitos por inferência; o gate integral repetido após esta falha real validará novamente o conjunto. Nativo, Metro, Loop, build, instalação, agentes, commit/push e políticas não foram operados pelo implementador nesta rodada. Pendente: revisão independente desse delta e validação configurada pelo controlador antes de fechar T05.
