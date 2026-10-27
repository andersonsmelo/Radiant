# Task 6 / T04a — brief vinculante R1

BASE_TASK e BASE_CONTINUACAO desta retomada: `ab20c6a69cb374ee73cc46c30826ce6e346aabac`.
Branch `claude/trilha-medalhao-design`; worktree /Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20.
Writer único do controlador: `run-1793114254111-2eade8f7` editing, checkpoint checkpoint-1793114254654-89cc1fd8. Sessão de leitura `brain-session-1793114147657-b7c59989` encerrada antes do writer por prevenção brain-links.

## Cartão operacional literal

### Task 6: T04a — Dublê global Skia e import estático

- **Dono:** I/high; **revisão:** R. **Skills:** T; **recursos:** Jest/contratos, D condicional.
- **Pré-requisito:** T04 estabilizada no registro. **Saída:** seis testes consumidores e dublê cobertos; falha de compilação/uniformes/fallback exercitada; sem alegar prova de shader real.

## Seção integradora literal e inteira

### T04a — Retirar o `require` preguiçoso com dublê global do Skia

**Item técnico à parte da FILA 67. Modificar:** `radiant-app/jest.config.cjs`,
`radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`,
`ActivityRendererRegistry.test.tsx` na mesma pasta e os seis testes hoje com
mock local: `radiant-app/src/ui/illustrations/ThemeIllustration.test.tsx`,
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`,
`radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`,
`radiant-app/src/features/bench/ExposureImage.test.tsx`,
`radiant-app/src/features/bench/CollimationImage.test.tsx` e o teste do registro
já listado. **Criar:** `radiant-app/src/test/mocks/reactNativeSkia.tsx` e
`radiant-app/src/test/mocks/reactNativeSkia.test.tsx`.

- [ ] Caracterizar as APIs controladas pelos mocks existentes: runtime effect,
  Canvas/uniformes, Skottie e fallback. Não trocar tudo por `View` opaca que
  esconda valores ou impeça simular falha de compilação.
- [ ] Fazer o teste do contrato de importação falhar com o `require`
  preguiçoso; não atribuir erro de carregamento do Jest ao aplicativo nativo.
- [ ] Mapear Skia no Jest para o dublê compartilhado; manter overrides locais
  necessários a cada cenário, sem apagar as asserções úteis.
- [ ] Trocar o registro para import estático e rodar o conjunto completo dos
  seis arquivos, além do novo teste do dublê, antes da validação final.
- [ ] Manter verdes os casos em que compilação nula/exceção recebe o fallback
  correto. Injetar ausência de uniformes e defeito/remoção desse fallback para
  ver as respectivas guardas reprovarem. A prova de shader real segue nativa.

**Aceite:** import estático seguro no Jest, contrato existente preservado e
sem alegar que o dublê comprova rasterização ou custo no dispositivo.

## Global Constraints literais

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

## Ownership e integração medida

Implementador I = Sol/high. Revisor R independente = Sol/high. Controlador não corrige produto. Não está sozinho; preserve mudanças concorrentes, nunca reverta edições alheias. Sem subagentes, sessões/writers paralelos, commit/push ou ação externa.

- `radiant-app/jest.config.cjs`
- `radiant-app/src/features/bench/CollimationImage.test.tsx`
- `radiant-app/src/features/bench/CollimationImage.tsx`
- `radiant-app/src/features/bench/ExposureImage.test.tsx`
- `radiant-app/src/features/bench/ExposureImage.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`
- `radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`
- `radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`
- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.test.tsx`
- `radiant-app/src/test/mocks/reactNativeSkia.tsx`
- `radiant-app/src/ui/illustrations/ThemeIllustration.test.tsx`
- `radiant-app/src/ui/illustrations/ThemeIllustration.tsx`

Os três arquivos runtime ExposureImage.tsx, CollimationImage.tsx e ThemeIllustration.tsx são apenas para injeções temporárias: restaurar exatamente os bytes pré-injeção e comprovar SHA. Única alteração de produto esperada: import estático no registro; sem nova API de física, gabarito, conteúdo ou fallback. Os dois testes de first-run hoje também possuem mock local; preservar, estão fora do ownership permanente. A centralização alvo enumera os seis consumidores do integrador, contando o teste do registro.

Relatório completo: `docs/evidence/2026-10-27-medalhao-t04a/implementation-report.md`. Evidências próprias adicionais: `red.txt`, `green.txt`, `mutations.json`, `audit.md` nessa pasta. Cópia/local logs auxiliares permitidos apenas nesta pasta SDD excluída exata. Nenhuma pasta declarada por conveniência.

## Execução e aceites adicionais

- Usar superpowers:test-driven-development e verification-before-completion nos caminhos instalados. Primeiro inventário breve das APIs/overrides; teste de importação deve falhar especificamente no require preguiçoso (AST/binding ou observação de avaliação; guarda de fonte nunca regex). Guardar comando, Node, cwd, stdout/stderr e saída real antes de corrigir. Erro de loader do Jest não é vermelho do contrato de importação.
- Compartilhar hosts observáveis: preservar children, props/uniforms/source, Canvas, Skottie, Group/ColorMatrix quando necessários; Make controlável e overrides/isolamento entre testes. Dublê não rasteriza nem compila SkSL realmente. Não trocar asserções úteis por presença opaca de View.
- Injeções específicas e guardas vistas vermelhas: compilação nula e exceção com fallback correto no verde, ausência de uniformes e defeito/remoção do fallback. Cobrir Skottie (quadro/cor/slots) e falhas existentes; guardar logs/resultado de cada mutação e SHA de restauração. Nenhuma mutação sobrevivente nos arquivos runtime.
- Executar os seis consumidores e o novo teste do dublê juntos. Typecheck/lint focal se necessário; não rodar quality completo nem Loop validate (só controlador). Sem testes nativos nesta tarefa do harness; não alegar shader, rasterização ou performance nativa. Nenhum simulador/Metro/AVD deve ser aberto.
- App/testes: PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH; conferir node --version. Em radiant-app, EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache seguido dos argumentos abaixo. Binário já instalado; não baixar dependências.

| T04a | `src/test/mocks/reactNativeSkia.test.tsx src/ui/illustrations/ThemeIllustration.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx src/features/bench/ExposureImage.test.tsx src/features/bench/CollimationImage.test.tsx` |

Saída esperada: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED, requisitos/arquivos, evidências por fase, self-review, riscos e limites. Ao entregar, congelar produto para snapshot/revisão. Reportar sem commit. Rodadas 1–3 retomam este implementador; 4–5 usam novo perfil superior, sem controlador editar produto.

## Fontes e integridade

- `docs/plans/2026-10-25-medalhao-execucao-subagentes.md` SHA256 4ada9614987864061e0a6a0fc81ea6ff5bd4b9b48a223f35e211b9bdd5fd7a57
- `docs/plans/2026-10-25-medalhao-pendencias-e-fechamento.md` SHA256 5867341e2d685b483becaac36d8e8d7f36b5f4376b91cda78d6594828a97bb41
