# Medalhão — pendências e fechamento Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Neste projeto, preserve também um implementador e um revisor independente por tarefa, com re-revisão das correções e revisão final de cada plano no modelo mais forte disponível.

**Goal:** Concluir o mundo Medalhão e as pendências da aula-bancada, preparar a retirada segura do conteúdo antigo e fazer a conferência integrada ao final, preservando os gates do dono.

**Architecture:** Reutilizar os planos 2, 3, 5 e 6, os serviços canônicos e os componentes já entregues. Este plano integra o trabalho restante, corrige premissas antigas e detalha o plano 4; não cria outro status vivo nem reabre a direção visual. A retirada tem aprovação própria e não pode destruir a preparação da conferência final ou antecipar a escolha do currículo novo.

**Tech Stack:** Expo SDK 54, React Native 0.81.5, React 19, TypeScript, Reanimated 4 por `src/ui/motion.ts`, SVG e Skia/Skottie 2.2.12. App e testes em Node 20.20.2; CLI Loop em Node 24.14.1. Nenhuma dependência adicional é pressuposta.

---

## 1. Autoridade, decisão de ordem e limites

Plano escrito em **2026-10-25, America/Bahia**, por solicitação de Anderson.
É um plano de implementação; **nenhuma tarefa de produto abaixo foi executada nesta entrega**.
O estado vivo continua em [STATUS](../STATUS.md); este documento contém sequência e aceites.

**Revisado pelo dono em 2026-10-25.** A execução será por subagentes, conforme
o [roteiro operacional](2026-10-25-medalhao-execucao-subagentes.md), com
atribuições, skills, plugins, MCPs e pacotes de revisão por tarefa. O aceite
deste plano não resolve G1–G8 nem inicia implementação por si só.

Decisão literal do dono nesta conversa:

> nao ha necessidade dessa data vamos avançar no restante do projeto e então ao terminar rodamos essa conferencia

**Consequência:** a conferência de segundo dia sai da posição de pré-requisito
para avançar no restante do layout e entra no fechamento. Não há uma tarefa
intermediária de esperar uma data. Isso não declara o teste aprovado nem
autoriza fabricar uma revisão devida, alterar relógio ou limpar a preparação.

Leia nesta ordem antes de executar:

1. `AGENTS.md`, `.loop/project.yaml`, `docs/STATUS.md` e o roadmap ativo.
2. [Índice Medalhão](../superpowers/plans/2026-10-21-trilha-medalhao-indice.md).
3. [Spec aprovada](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md), sobretudo §§4–6, 8 e 11, e as ADRs de [21/10](../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) e [24/10](../adr/ADR-2026-10-24-aula-bancada-fisica-digital-e-colimacao.md).
4. `docs/PRODUCT.md`, `docs/DESIGN.md` e as quatro pranchetas `docs/design/2026-10-21-*.html`.
5. Os registros finais dos planos [2](../superpowers/plans/2026-10-21-trilha-medalhao.md), [3](../superpowers/plans/2026-10-21-aula-bancada.md), [5](../superpowers/plans/2026-10-21-demais-telas-medalhao.md) e [6](../superpowers/plans/2026-10-21-pixel-medalhao.md). Os registros corrigem exemplos antigos dos planos.

**Base medida:** worktree `.claude/worktrees/trilha-2026-10-20`, branch
`claude/trilha-medalhao-design`, HEAD local e ref remoto `b5ac9bf404705040c9128d5f131a1c6c6f774b42`;
ref remoto `main` em `bcf1a9074a7f213d64f10085242e549ecae0e187`.
Medição por Git em 25/10; não é remedição de CI. Não atribuir o CI verde de
um SHA anterior a esta base nem a futuros commits. PRs de referência: #66 e #67.

**Ficam fora desta autorização:** executar este plano agora, apagar conteúdo,
mudar política do Loop, criar currículo novo, instalar apps, fazer build,
EAS, OTA, merge, envio para loja ou mensagens a serviços externos. A escrita
deste plano não aprova as escolhas de conteúdo pendentes.

## 2. O que já existe e não deve ser refeito

| Frente | Base a preservar | O que ainda falta |
| --- | --- | --- |
| Plano 1 | Tokens, grafite, relevo, ícones e cinco ilustrações | Olhar do dono sobre arte/acabamento e eventuais escolhas documentadas, como o lábio secundário |
| Plano 6 | Pixel vetorial, poses, rosto e variante cabeça | Uso nas telas restantes; preservar pose ao reduzir movimento |
| Plano 2 | Trilha, estrelas, caminho, momento e provas Android registradas | Texto máximo, decisão sobre quadro antecipado, conferência final iOS e aceite |
| Plano 3 | Motor `bench`, exposição, colimação e duas aulas em desenvolvimento | Conteúdo aprovado, lacunas de apresentação, acessibilidade e quadros com arrasto |
| Plano 5 | Plano escrito; prazo visual QA já renovado na branch | Telas e guarda de texto |
| Plano 4 | Decisão de retirar/recomeçar na spec | Inventário aprovado, implementação e prova de migração/restauração |

**Conflitos resolvidos por leitura do código em 25/10:**

- `LessonSummary.tsx` já importa o Pixel vetorial. O PNG da captura antiga
  não é motivo para refazer essa troca. Falta o resultado no layout aprovado.
- As entradas do fim do plano 5 trocavam a tarefa do resultado (é a **4**,
  não a 5). Medalha de abertura e explicação do Pixel na aula são uma entrega
  explícita adicional, T04 abaixo; não ficam escondidas dentro do resultado.
- `GamificationSnapshot` tem `totalXp`, `streakDays` e `lastActiveDate`,
  sem calendário semanal. Não inventar `activeDays`, nem equiparar tentativas
  registradas a todos os dias que contam sequência.
- A API atual de StoreKit oferece `displayPrice`; falta preço numérico e
  moeda para calcular o equivalente mensal do anual. Isso atravessa o módulo
  nativo e impõe um gate de binário, não apenas um teste JS.
- `.loop/project.yaml` **já está** em `allowedRoots`. Sua alteração continua
  sendo decisão expressa do dono. Outras janelas de conteúdo permanecem
  fechadas; a grafia real de cada caminho precisa ser medida.
- O segundo dia atual usa Fundamentos e três perguntas do currículo antigo.
  Ele não valida automaticamente um currículo substituto.

## 3. Skills e ferramentas: aplicação neste projeto

| Recurso solicitado | Uso no plano |
| --- | --- |
| `@writing-plans` | Organização e handoff; os planos existentes são reutilizados, sem duplicação do seu código |
| `@ui-ux-pro-max`, `@design-taste-frontend`, `@impeccable` | Hierarquia, dados verdadeiros, estados, safe areas, tipografia e revisão em dispositivos. A spec e os tokens Medalhão vencem paletas e composições genéricas dos catálogos |
| Build iOS Apps | Inspecionar árvore nativa e capturar o app existente nas tarefas nativas. Usar UDID explícito; não disparar `build_run_sim` por automatismo |
| Instalador de Apps para iOS | Somente numa futura etapa autorizada de instalação, com binário compatível fornecido pelo dono. Não é requisito para escrever o plano |
| `@text-to-lottie` | Só se uma ilustração existente precisar de correção; preservar três tons e conferir no Skottie oficial antes da integração nativa |
| `@animate`, `@gsap-skills:gsap-core` | Critérios de finalidade, interrupção e movimento reduzido; receitas DOM não entram no app nativo. Animações do produto permanecem nos hooks de `motion.ts` |
| `@hyperframes` | Ferramenta possível para um vídeo de demonstração solicitado separadamente. Não é motor da UI nem entrega deste plano; sem render ou setup de vídeo |
| `@threejs-loaders` | Sem aplicação ao pacote atual, que usa fantoma estilizado 2D. Não acrescentar 3D nem loaders |
| `@expo-ui` | Considerado como referência de controles nativos. Não migrar para a camada universal descrita pela skill, que pressupõe SDK posterior ao 54; manter os componentes compatíveis já instalados |

Não sortear outra identidade, instalar bibliotecas de ícones, trocar Sora,
aplicar Dynamic Color à identidade inteira, introduzir glass/glow ou renovar
exceções automaticamente. Botões têm lábio, ouro tem função, e o Pixel tem
quatro momentos; referências genéricas não revogam essas decisões.

## 4. Ordem de execução e gates

```text
T00 preflight → T01 guarda → T02 HUD → T03 boas-vindas
              → T04 aula → T04a dublê Skia → T05 resultado → T06 recompensa
              → T07 revisão → T08 avaliação → T09 Perfil
              → T10 Ajustes → T11 assinatura → T12 vidas
              → T13 texto máximo → T14 conteúdo aprovado
              → T15 inventário do plano 4
              → T16 acessibilidade/desempenho → T17 fechamento visual
              → T18 conferência integrada e segundo dia → aceite de layout

Após inventário aprovado e contrato do currículo novo disponível:
T19 política aprovada → T20 recomeço/restauração → T21 retirada/troca
→ T22 E2E do catálogo novo e aceite técnico da transição
→ dono decide merge/build/loja, após primeiro lote novo
```

As tarefas são entregas, não uma única janela gigante do Loop. Cada passo
marcado é uma ação pequena; uma tarefa que exigir mais de uma entrega recebe
subtarefas no ledger antes de abrir o run. Enquanto um gate específico espera
o dono, avance nas tarefas independentes e mantenha o item como pendente.

| Gate | Responsável | Bloqueia exatamente |
| --- | --- | --- |
| G1 — Texto máximo e corredores do Pixel | Dono | Aplicar alternativa de geometria/texto em T13 e aceitar a trilha |
| G2 — Física, frases e perguntas das aulas; ADR de 24/10 | Dono | Promover o conteúdo de T14 para além do catálogo de desenvolvimento |
| G3 — Arte/acabamento e quadro antecipado não reproduzido | Dono | Aceite final da trilha/fundação, não a execução das demais telas |
| G4 — Inventário sai/fica, biblioteca e validadores | Dono | T19–T21; elaborar inventário em T15 é permitido |
| G5 — Semanas do Perfil sem dados históricos completos | Proposta técnica em T09; dono aprova eventual mudança de contrato do produto | Apresentar dia desconhecido como estudado ou como falta confirmada |
| G6 — Novo binário para metadados StoreKit, se necessário | Dono | Validação nativa da alteração em T11; outras telas continuam |
| G7 — Currículo/formato e primeiro lote novo | Dono, projeto seguinte | Ativar a troca e liberar loja; duas aulas de exemplo não substituem o lote |
| G8 — VoiceOver/TalkBack e quadros com arrasto | Agente; dono quando necessário ouvir/operar o dispositivo | Aceite integral da acessibilidade/desempenho e liberação; indisponibilidade deixa a prova pendente |

## 5. Ritual de cada entrega

Use `@superpowers:subagent-driven-development` ou `@superpowers:executing-plans`,
preservando o contrato de implementador/revisor do projeto. O controlador é o
dono do run e dos comandos; subagentes não criam writers concorrentes.

1. [ ] Medir HEAD, árvore limpa, fonte relevante e consumidores do efeito.
2. [ ] Registrar a decisão e o escopo em `.superpowers/sdd/<plano>/progress.md`.
   Decisão posterior ao brief chega literalmente ao revisor.
3. [ ] Declarar no `abrir.mjs` cada arquivo de fonte, teste, evidência e
   documentação da entrega; aguardar confirmação de `STEP_STARTED`.
4. [ ] Escrever o teste específico, executá-lo e guardar o vermelho real.
5. [ ] Implementar o mínimo; executar o mesmo teste e guardar o verde.
6. [ ] Fazer a revisão independente; corrigir e re-revisar escopo fechado.
7. [ ] Ver a alteração visual em iOS e Android existentes; fazer no fluxo
   erros deliberados, reentrada, volta e repetição quando aplicáveis.
8. [ ] Atualizar registro do plano, índice, FILA 67 e STATUS com a data da
   medição. Não marcar aceite humano por inferência.
9. [ ] Encerrar app/Metro/AVD; carga baixa; uma validação final configurada.
10. [ ] Fechar run; stagear só arquivos próprios, commit e push na branch.

**Comandos comuns, com a raiz indicada:**

```bash
# Na raiz: o Node 24 vale só para o Loop.
PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH" node scripts/loop/abrir.mjs "<entrega>" <arquivo1> <arquivo2>

# Em radiant-app: teste focal; trocar apenas os arquivos explícitos da tarefa.
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" node --version
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache <teste>
# Tela nova: a mesma suíte precisa passar sob CPU limitada.
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" EXPO_NO_DOTENV=1 /usr/sbin/taskpolicy -b npx jest --runInBand --no-cache <teste>

# Gate do app, se executado diretamente: é este, não só Jest.
PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH" EXPO_NO_DOTENV=1 CI=1 npm run quality

# Na raiz, antes do fechamento: carga abaixo de aproximadamente 5, sem E2E.
sysctl -n vm.loadavg
ps -Ao pid,pcpu,comm -r | head -8
PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH" caffeinate -i loop validate --run <id>
```

Esperado: teste novo reprova pelo sintoma nomeado antes da correção e passa
depois; o gate configurado retorna `VALIDATION_PASSED`. Não fixar contagens de
suítes de uma entrega anterior. Não executar `npm run quality` repetidamente
além do `app-quality` do Loop sem uma falha real ou uma finalidade distinta.

Fechamento, **uma chamada por vez**, lendo o `code`: `loop validate` →
`loop step finish` → memória opcional validada → `loop run close`.
Sem `&&`. Não usar `git add -A radiant-app`. Revisão documental não requer
inventar teste vermelho ou defeito; use leitura, links e contrato de docs.

**Política:** os caminhos de UI/teste planejados estão sob raízes permitidas
`radiant-app/src`, `radiant-app/scripts`, `radiant-app/modules`, `radiant-app/.maestro`,
`radiant-app/package.json`, `docs` e `scripts`. A remoção inclui caminhos de
conteúdo com janelas próprias: T15 produz sua união exata e T19 resolve a
autorização antes de qualquer run de remoção. Nunca declarar uma pasta no
lugar da lista de arquivos. A política atual tem 15 validadores; T19 pode
mudá-los só com aprovação, e os validadores posteriores são os então configurados.
`brain-links` reentra a CLI: a consulta de leitura deve ser encerrada antes
da validação se houver contenção; não segurar uma sessão sem necessidade.

## 6. Tarefas do layout e das aulas

### T00 — Reconciliar a base e o prazo existente

**Ler:** `AGENTS.md`, `.loop/project.yaml`, os documentos da seção 1,
`radiant-app/scripts/visual-qa-policy.json`, `.github/workflows/radiant-app-quality.yml`.
**Modificar:** só a documentação canônica se houver divergência medida.

- [x] Conferir ref remoto, PR #66/#67 e checks do **mesmo SHA**; registrar a base.
- [x] Conferir que as exceções já estão em 30/11/2026 na branch, sem esperar o merge da #67.
- [x] Identificar trabalho paralelo; não absorver arquivos de outra sessão.
- [x] Abrir a sessão de leitura do cérebro, consultar e encerrar após responder à pergunta de contexto.
- [x] Produzir o ledger de execução; nenhuma tarefa de produto é marcada feita aqui.

**Aceite:** base conhecida, política conferida, dependências locais presentes;
nenhuma renovação automática de prazo, build ou acesso ao simulador reservado.

**Registro:** preflight revisado e registrado junto de T01 no commit55e21ae;
[prova e limites](../evidence/2026-10-25-medalhao-t01.md).

### T01 — Guarda AST do texto e vocabulário da trilha

**Detalhamento reutilizado:** plano 5, tarefa 1, com as correções abaixo.
**Criar:** `radiant-app/scripts/copy-style-contract.test.mjs`,
`radiant-app/scripts/copy-style-baseline.json`.
**Modificar:** `radiant-app/package.json`,
`radiant-app/src/features/journey/components/nodeCopy.ts`,
`radiant-app/scripts/maestro-contract.test.mjs` e os YAMLs realmente consumidores.
**Reutilizar:** `radiant-app/scripts/ast-helpers.mjs`.

- [x] Medir o domínio da guarda: copy de UI em `radiant-app/src` e fontes de
  copy importadas pelas telas; identificar separadamente conteúdo clínico,
  textos legais e nomes internos que não são copy.
- [x] Criar fixtures AST que reprovem cada padrão proibido e aceitem comentário,
  identificador interno e traço com significado legítimo. Ver falhar cada asserção.
- [x] Trocar "Continuar jornada" e os demais rótulos pelo glossário junto com
  seus YAMLs e o contrato. Remedir consumidores; não copiar a contagem antiga de sete.
- [x] Ligar a guarda ao `quality`; cada tarefa seguinte reduz a baseline do
  seu arquivo. Baseline não é permissão para deixar resíduo para sempre.
- [x] Rodar `node --test scripts/copy-style-contract.test.mjs scripts/maestro-contract.test.mjs`
  em `radiant-app`, revisar, registrar e commitar os arquivos exatos.

**Aceite:** violações novas reprovam; o domínio e as exclusões justificadas
ficam explícitos. T17 exige zero violações nesse domínio, sem exceção escondida.

**Entrega técnica:** commit55e21ae, revisão R4 e Loop15/15; CI App Quality239
e Content144 aprovados nesse SHA. [Evidência](../evidence/2026-10-25-medalhao-t01.md).

### T02 — HUD: um coração e o número

**Plano 5/tarefa 2. Arquivos:** `radiant-app/src/ui/components/HUD.tsx`,
`radiant-app/src/ui/components/HUD.test.tsx`,
`radiant-app/src/features/quiz/components/QuizTopBar.tsx` e seu teste;
consumidores que mockam HUD: `QuizScreen.flow.test.tsx`,
`LessonFlowScreen.flow.test.tsx` e `JourneyNodeCompletionGuard.test.tsx`.
O consumidor QuizTopBar foi confirmado na prova nativa de 26/10; integrar a
pílula real, mantendo sua API/labels/progresso e sem mudar serviços.

- [x] Acrescentar casos 0/1/5 vidas e ilimitado; demonstrar o vermelho da forma antiga.
- [x] Trocar só a composição visual; preservar estado, recarga acessível e pulso de perda.
- [x] Rodar o teste focal; ver HUD na trilha e em uma aula nos dois sistemas.
- [x] Rever, retirar a exceção visual correspondente e registrar a entrega.

**Aceite:** cada dado uma vez, coração+número, `∞` no ilimitado; cinco
corações do export compartilhado permanecem como API; QuizTopBar usa a
pílula de coração único e contagem. Sem mudar
regras de consumo/recarga. **Premissa corrigida em 26/10:** HeartsSheet atual
não desenha cinco corações; a entrega dos cinco na folha permanece em T12 e
na spec §11.3. T02 não considera essa folha já implementada.

**Entrega medida em26/10:** revisão independente R4 aprovada, 173 testes
focais/7suítes, 102 contratos, visual strict sem regressão e Loop15/15.
Capturas finito5 na trilha/aula e abertura da folha em ambos os sistemas;
sem aceite de pulso nativo/leitor de tela/ilimitado nativo.
[Evidência e primeira tentativa com timeout](../evidence/2026-10-26-medalhao-t02.md).

### T03 — Boas-vindas: operar a bancada antes de continuar

**Plano 5/tarefa 3. Modificar:**
`radiant-app/src/features/first-run/screens/WelcomeFlowScreen.tsx`,
`radiant-app/src/features/first-run/components/WelcomeSlide.tsx`.
**Testar:** `WelcomeFlowScreen.flow.test.tsx`, `WelcomeFlowReentry.test.tsx`
na pasta da tela, e `WelcomeSlide.test.tsx` na pasta do componente.
**Reutilizar:** `radiant-app/src/features/bench/ExposureImage.tsx`,
`BenchControlRow.tsx` e `exposureModel.ts` na mesma pasta.
**Escopo nativo ampliado em26/10:** modificar também `BenchControlRow.tsx`
e seu teste para acomodar texto ampliado, preservando API/modelo/alvos.
O iOS máximo reprovou o layout inicial; fix2 e nova prova foram aprovados na R3.

- [x] Testar fluxo inicial, replay de Ajustes, saída/pular, retomada e `onFinish` uma vez.
- [x] Observar o vermelho do primeiro contato sem bancada e da área de toque de Pular.
- [x] Reusar o modelo digital; nenhuma regra física diferente só no onboarding.
- [x] Manter a instrução necessária fora da fala opcional do Pixel.
- [x] Rodar testes focais com CPU limitada e conferir safe areas e texto máximo.

**Aceite:** primeira ação real de kV, saída alcançável, cadastro não exigido,
reentrada preservada e nenhuma conclusão de onboarding duplicada.

**Entrega técnica em 26/10:** R4 aprovada e Loop15/15, com suíte completa.
Primeiro gate teve14/15 por TS7006 nos testes; somente anotações de tipo
foram corrigidas após a prova nativa, cujo runtime permaneceu idêntico.
[Evidência, oito PNGs e limites](../evidence/2026-10-26-medalhao-t03.md).
G2 permanece pendente; próxima T04.

### T04 — Fechar as lacunas da aula: abertura, explicação e retorno

**Complementa plano 3 e plano 5. Modificar:**
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`,
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx`,
`radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.tsx`,
`radiant-app/src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx`,
`radiant-app/src/features/lesson-flow/renderers/MultipleChoiceStepRenderer.tsx`,
`radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.tsx`,
`radiant-app/src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx`,
`radiant-app/src/features/lesson-flow/services/feedbackFor.ts`, `feedbackFor.test.ts`,
`radiant-app/src/types/learningActivity.ts`,
`radiant-app/src/features/bench/CollimationImage.tsx`, `CollimationImage.test.tsx`
e `radiant-app/src/features/bench/lessons/exposicao.ts`/`BenchLessonCatalog.test.ts`.

- [x] Enumerar todos os tipos que consomem `feedbackFor`; testar comparação e
  os tipos efetivamente registrados mostrando o retorno visível, além do
  acessível. `case-decision` existe no contrato, mas não no registro atual:
  não inventar um renderizador só para cumprir a frase de uma observação;
  registrar essa distinção e exigir o retorno ao habilitar esse tipo no futuro.
- [x] Testar medalha do tema na abertura e Pixel no explorar, com conteúdo
  obrigatório independente do mascote. Reusar `JourneyMedal` e `PixelIllustration`.
- [x] Mostrar a imagem granulada no passo de leitura crítica, com texto
  equivalente. Declarar os arquivos exatos do tipo/renderizador antes de editar;
  não mudar a resposta ou a física para acomodar a imagem.
- [x] Testar dica acessível do botão que aguarda o alvo e anúncio único quando
  habilita; usar `esperarBotaoApto` antes de tocar em testes.
- [x] Conferir produto dose-área em 402 pt e texto ampliado; duas linhas são
  aceitáveis se legíveis e sem colisão, não impor redução de fonte.
- [x] Deixar a posição do fechamento após reforços condicionada à resposta
  do dono em T14; não mover por interpretação de uma observação.

**Aceite:** as lacunas não desaparecem do relatório; se um novo contrato for
necessário, sua lista exata de arquivos e teste vermelho precedem a escrita.
Nenhum ganho de XP ou progresso é introduzido por um deep link sem nó.

**Execução em 27/10:** implementação e revisão independente R2 aprovadas,
com prova nativa iOS/Android. O indicador de passos e o readout de dose-área
receberam correções locais após falhas nativas preservadas. Sem nó, a conclusão
nativa iOS mostrou “Sem XP nesta tentativa” e manteve o HUD/progresso visível;
as gravações proibidas foram verificadas nos testes. Loop final **15/15** aprovado em 27/10, após corrigir a classificação
AST R5 do Pixel no explorar. Os dois scripts da guarda e seus contratos foram
declarados no writer substituto antes de editar, sem ampliar política, baseline
ou exceções. Writer e sessão de leitura encerrados; commit `e522984` publicado.
CI App Quality242 e Content Scripts147 aprovados nesse SHA, conferidos em
27/10/2026. Naquele fechamento T04a ainda não havia iniciado; sua execução
subsequente está registrada na seção própria abaixo.
G2/T14 e os gates de liberação continuam pendentes.
[Evidência e limites](../evidence/2026-10-26-medalhao-t04.md).

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

- [x] Caracterizar as APIs controladas pelos mocks existentes: runtime effect,
  Canvas/uniformes, Skottie e fallback. Não trocar tudo por `View` opaca que
  esconda valores ou impeça simular falha de compilação.
- [x] Fazer o teste do contrato de importação falhar com o `require`
  preguiçoso; não atribuir erro de carregamento do Jest ao aplicativo nativo.
- [x] Mapear Skia no Jest para o dublê compartilhado; manter overrides locais
  necessários a cada cenário, sem apagar as asserções úteis.
- [x] Trocar o registro para import estático e rodar o conjunto completo dos
  seis arquivos, além do novo teste do dublê, antes da validação final.
- [x] Manter verdes os casos em que compilação nula/exceção recebe o fallback
  correto. Injetar ausência de uniformes e defeito/remoção desse fallback para
  ver as respectivas guardas reprovarem. A prova de shader real segue nativa.

**Aceite:** import estático seguro no Jest, contrato existente preservado e
sem alegar que o dublê comprova rasterização ou custo no dispositivo.

**Execução em 27/10:** import estático e dublê global observável implementados;
revisão independente R1 Spec PASS/Qualidade APPROVED, sem achados acionáveis.
Sete suítes/184 testes, tipagem e lint focal aprovados; sete injeções
específicas detectadas e restauradas por SHA. Dois avisos act reproduzidos
na baseline, sem novo ruído. Validação final configurada **15/15**, em ciclo
único (quality/app-test completos); run `run-1793114254111-2eade8f7`.
[Evidência, parecer e limites](../evidence/2026-10-27-medalhao-t04a.md).
T05 é a próxima entrega; nenhum gate humano foi consumido.

### T05 — Resultado: cunhagem, estrelas e contexto correto

**Plano 5/tarefa 4. Modificar:**
`radiant-app/src/features/quiz/components/LessonSummary.tsx`, `LessonSummary.test.tsx`,
`radiant-app/src/features/quiz/screens/QuizScreen.tsx`, `QuizScreen.flow.test.tsx`,
`radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx`, `LessonFlowScreen.flow.test.tsx`,
`radiant-app/src/features/curriculum-v3/hybrid-l1/HybridLessonCharacter.tsx`,
`radiant-app/src/ui/motion.ts` e os testes de movimento afetados.

- [x] Enumerar todos os consumidores de `LessonSummary`; acrescentar contexto
  de tema/título por todos, incluindo o resumo de revisão e a aula sem nó.
- [x] Escrever casos 0/1/2/3 estrelas, recorde anterior maior, repetição,
  revisão e XP nulo/zero/positivo. Ver o vermelho antes da composição nova.
- [x] Definir medalha neutra para zero estrela sem alterar o estado canônico
  de aula concluída nem fingir bloqueio; a paleta visual não decide progresso.
- [x] Retirar confete dos consumidores reais, inclusive `LessonFlowScreen`.
- [x] Preservar pose sob reduzir movimento; parar movimento não vira comemorar→acenar.
- [x] Implementar animação por componentes de estrela com hooks no topo;
  nunca chamar hooks em `map`, callback `star(index)` ou condição.
- [x] Resolver a mola/duração do exemplo antigo a favor de `DESIGN.md`:
  mola apenas na cunhagem; crescimento/assentamento e outras entradas pelos
  hooks existentes, sem importar Reanimated em tela de feature.
- [x] Rodar os três testes de componente/fluxo e os contratos de movimento.

**Exemplo de asserção a acrescentar ao teste existente** (usa os fixtures já presentes):

```tsx
it('mantém a régua ao mostrar zero estrelas', () => {
  render(<LessonSummary {...base} stars={0} correctAnswers={0} />);
  expect(screen.getByLabelText('0 de 3 estrelas')).toBeTruthy();
  expect(screen.queryByText(/quase/i)).toBeNull();
});
```

A asserção nova do layout deve falhar com a composição anterior; a régua
acima é proteção de comportamento, não prova isolada da cunhagem.

**Aceite:** primeira resposta continua valendo; sem XP inventado; revisão
sem Pixel; animação não repete prêmio; tema real acompanha todos os caminhos.

**Registro T05 em 27/10/2026 — implementada, revisada e validada:**
os dois consumidores têm contexto real, neutralidade de zero estrela sem
alterar conclusão/primeira resposta e prêmio não repetido. R4código, R5iOS
large→AX5 e R6Android nos cenários medidos aprovados. Gate1 foi13/15 por mock
incompleto em teste consumidor; fix3 de uma linha aprovado em R7 sem alterar
produto/nativo. Writer substituto gatefinal15/15, primeiro ciclo dele/segundo
do objetivo; sem política nova. Este checkpoint precede fechamentoCLI e Git.
[Evidência por fase e limites](../evidence/2026-10-27-medalhao-t05.md).
PróximaT06; G1–G8 preservados.

### T06 — Recompensa sem saída morta

**Plano 5/tarefa 5. Arquivos:**
`radiant-app/src/features/rewards/screens/RewardScreen.tsx`, `RewardScreen.flow.test.tsx`,
`radiant-app/.maestro/reward-locked.yaml`, `radiant-app/.maestro/reward-unlock.yaml`.

- [x] Testar deep link inválido, recompensa válida, bloqueada e já coletada.
- [x] Demonstrar o vermelho do estado vazio sem saída; voltar à trilha quando inválido.
- [x] Preservar `canCollectReward` e idempotência; redirecionar não concede prêmio.
- [x] Rodar fluxo e contrato Maestro; conferir gesto/volta e registrar.

Medido em 28/10/2026: R5 código PASS/APPROVED e R6 nativo APPROVED no escopo
medido. Focal final quatro suítes/100 testes; Maestro contrato39/39 e fluxo
RewardScreen em Jest. A engine Maestro não rodou (Java ausente); CLI nativa
existente verificou rotas/saídas. iOS live/máxima inicial e Android normal/
máxima inicial legíveis. Android live não validado: dev client voltou à trilha
com erro de linking. Quatro estados têm prova automatizada; disponível/coletado
não foram alcançados nativamente. P3 da cauda permanece para T17. Quality
completo aprovado15/15 em ciclo único; fechamento/Git posteriores neste checkpoint.
[Evidência T06](../evidence/2026-10-27-medalhao-t06.md).

### T07 — Revisão como fila real, sem Pixel

**Plano 5/tarefa 6. Modificar:**
`radiant-app/src/features/review/screens/ReviewScreen.tsx`, `ReviewScreen.flow.test.tsx`.
**Criar:** `radiant-app/src/ui/components/ListRow.tsx`, `ListRow.test.tsx`.

- [x] Testar fila com itens, vazia, erro de leitura/gravação, retomada e conclusão.
- [x] Reusar `useReview`; não inventar método de serviço para conseguir a lista.
- [x] Mostrar contagem e origens verdadeiras; retirar mascote do início e do fim.
- [x] Preservar prêmio de vida único por fila, registro de resposta e saída.
- [x] Rodar testes e conferir leitura acessível, inclusive sem a fala do Pixel.

Registro28/10: R2 código/R3 nativo aprovados no escopo núcleo; filas reais
3itens/+12XP/HUD66 e vazio em iOS/Android. Focal4/52, contrato40/40, regressão
temporal UTC36/Bahia3. Maestro engine não rodou; CLI nativa existente mediu
saídas/leitura visual, sem prova de fala de leitor de tela. Androidlive e
resultado máximo não validados; vazio máximo iOS não medido. P2 PushOptIn
máximo impede aceite global e segue T17. Loop final15/15 em ciclo único;
writer/cérebro CLOSED, commit `85ebf0153840d503e6fcd70532529896e8bcc29f`
publicado e CI247/152 SUCCESS nesse SHA, reconciliados em 28/10/2026.
T08 foi iniciada posteriormente em28/10; ver registro abaixo. [Evidência](../evidence/2026-10-28-medalhao-t07.md).

### T08 — Avaliação de unidade

**Núcleo implementado/revisado/validado em 28/10/2026:** código aprovado na R2 após correção do P2 de identidade na conclusão;61 focais/45 sob CPU limitada PASS. Fluxo real iOS/Android medido; R3 aprovou o núcleo medido (BOUNDED); Loop final15/15 em um ciclo. [Evidência](../evidence/2026-10-28-medalhao-t08.md).

**Plano 5/tarefa 7. Arquivos:**
`radiant-app/src/features/checkpoint/screens/CheckpointScreen.tsx`, `CheckpointScreen.flow.test.tsx`,
`radiant-app/scripts/checkpoint-performance-report.test.mjs`,
`radiant-app/scripts/checkpoint-cdp-collector.test.mjs`,
`radiant-app/scripts/checkpoint-cohort-runner.test.mjs` e YAMLs consumidores medidos.

- [x] Testar separadamente bloqueada, inválida, disponível, retomada e conclusão.
- [x] Medalha de prata e contagem real; sem Pixel. Inválida volta à trilha;
  bloqueada explica quantas aulas faltam, sem conceder acesso.
- [x] Preservar catálogo canônico, respostas e commit único; testar erro deliberado.
- [x] Rodar fluxo e os scripts focais `test:checkpoint-performance-report` e
  `test:checkpoint-instrument`. Eles não provam FPS da bancada.

Limites nativos e aceite global permanecem na evidência; T09 ainda não iniciada.
Os três testes de instrumentos foram executados pelos scripts npm, sem alteração:
não foi encontrado consumidor vivo de labels da tela nesses scripts ou YAMLs.
Consumidor real adicional: JourneyNodeCompletionGuard.test.tsx. Retiradas apenas
as exceções da tela nas duas baselines; política Loop e catálogo intactos.

**Fechamento:** o run original validou15/15, mas `step finish` reprovou pelo
arquivo gerado `expo-env.d.ts` fora do escopo. Run original encerrado sem sucesso.
Regularização autorizada em28/10, no run `run-1793222933625-71a18c69`, com as31
alterações próprias já na baseline, sem alteração de produto ou política.
Resultados dos dois runs e limites constam na evidência T08. Não atribuir
supervisão retroativa nem usar o15/15 antigo como gate do novo run.

### T09 — Perfil: medalhas, semana verdadeira e metas

**Núcleo implementado/revisado em29/10:** código R1 PASS,60 focais normal/CPU,163 consumidores/105 contratos; nativo R2 BOUNDED/APPROVED_CORE_BOUNDED, com limites Android ao vivo/retorno e save nativo. Final configurada15/15 após fix1, dois ciclos. Contrato técnico conservador: lastActiveDate válida é a única marca da semana da sequência; contador nominal separado, demais dias desconhecidos/futuros. Sem união de tentativas, faltas inferidas, alteração de serviço ou aviso de meia-noite. G5 segue pendente. Meta editável mantida até T10. [Evidência](../evidence/2026-10-29-medalhao-t09.md).

**Plano 5/tarefa 8. Modificar:**
`radiant-app/src/features/profile/screens/ProfileScreen.tsx`, `ProfileScreen.flow.test.tsx`,
`radiant-app/src/features/profile/components/ProfileIdentityHeader.tsx`, `ProfileIdentityHeader.test.tsx`.
**Criar na pasta de componentes:** `MedalShelf.tsx`, `MedalShelf.test.tsx`,
`StreakWeek.tsx`, `StreakWeek.test.tsx`, `TodayGoals.tsx`, `TodayGoals.test.tsx`.
**Ler:** `radiant-app/src/types/gamification.ts`,
`radiant-app/src/features/gamification/services/GamificationService.ts`,
`radiant-app/src/features/progress/services/LearningAttemptsRepository.ts`.

- [x] Primeiro resolver a origem da semana. Proposta: representar explicitamente
  os dias comprovados e os desconhecidos; não assumir que um contador contém
  sete datas. Se a direção exigir histórico completo, planejar registro prospectivo
  em entrega própria, com política de restauração, antes de desenhar a semana.
- [x] Registrar a escolha técnica e levar a G5 qualquer mudança de significado
  para o aluno; não inventar a API `activeDays` descrita no exemplo antigo.
- [x] Testar aluno novo, sem atividade, metas zeradas, recordes e falha de leitura.
- [x] Ler estrelas e currículo pelos serviços existentes; não duplicar XP/vidas.
- [x] Sincronizar a mudança da edição de meta com T10: não remover a única
  entrada do Perfil antes de Ajustes oferecê-la.
- [ ] Rodar testes dos componentes e fluxo sob CPU limitada; ver texto máximo.

**Medição de texto máximo:** CPU60/60 e núcleo nativo BOUNDED; Android ao vivo/retorno continuam sem aceite. O último checkbox não equivale a encerramento integral.

**Aceite:** estante usa conquistas reais; semana diferencia dado ausente de
falta confirmada; dados sintéticos só em testes/stories, nunca na tela real.

### T10 — Ajustes em lista agrupada

**Plano 5/tarefa 9. Modificar:**
`radiant-app/src/features/settings/screens/SettingsScreen.tsx`, `SettingsScreen.flow.test.tsx`,
`radiant-app/src/features/subscription/components/SubscriptionCard.tsx`,
`radiant-app/src/features/progress-sync/components/ICloudBackupCard.tsx`,
`radiant-app/src/features/profile/components/FeedbackPreferencesCard.tsx`,
`radiant-app/src/features/progress/components/LegalLinksCard.tsx`, e seus testes adjacentes.
**Criar:** `radiant-app/src/ui/components/GroupedList.tsx`, `GroupedList.test.tsx`.

- [ ] Testar grupos, meta diária, replay, permissões, links e falhas.
- [ ] Trocar cartões por linhas com controles nativos compatíveis; sem instalar `@expo/ui`.
- [ ] Preservar flags reais do backup: "Em breve" apenas onde indisponível;
  não ocultar uma função de homologação que esteja habilitada por política.
- [ ] Trocar emoji nos links de ajuda por ícone desenhado; manter destinos.
- [ ] Executar focais e verificar Back Android, gesto de voltar iOS e leitor de tela.

### T11 — Assinatura e preço mensal do anual

**Plano 5/tarefa 10. Arquivos:**
`radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`, `SubscriptionScreen.flow.test.tsx`,
`radiant-app/src/features/subscription/StoreKit2Adapter.ts`, `StoreKit2Adapter.test.ts`,
`radiant-app/src/features/subscription/storekitNative.types.ts`,
`radiant-app/src/features/subscription/subscription.types.ts`,
`radiant-app/modules/radiant-storekit/index.ts`,
`radiant-app/modules/radiant-storekit/ios/RadiantStoreKitModule.swift`,
`radiant-app/src/features/subscription/radiantStoreKitModule.contract.test.ts` e
`radiant-app/src/features/subscription/storekitTestingConfig.contract.test.ts`.

- [ ] Mapear produto anual: `displayPrice` é string localizada e não pode ser
  dividido por 12. Fazer o contrato falhar sem preço numérico/moeda explícitos.
- [ ] Propor extensão mínima do bridge nativo, tipos JS e adaptador na mesma
  entrega. Conferir G6: não fingir que o dev client antigo já contém o bridge novo.
- [ ] Desenhar dois planos com valores reais; anual em ouro, mensal derivado
  com formatação da moeda; texto legal inteiro, um botão de compra.
- [ ] Testar assinante, carregamento, loja indisponível, falha, compra pendente,
  cancelamento, restauração e voltar. No assinante, mostrar Gerenciar.
- [ ] Contratos e testes JS são evidência estática; compra/preço no binário
  exigem build/instalação autorizadas pelo dono e prova nativa posterior.

**Aceite:** nenhuma estimativa por parsing de preço; nenhum produto falso em
store indisponível; layout pronto pode ficar com G6 nativo explicitamente pendente.

### T12 — Folha de vidas

**Plano 5/tarefa 11. Modificar:**
`radiant-app/src/features/hearts/components/HeartsSheet.tsx`, `HeartsSheet.test.tsx`,
`radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml` e os chamadores reais da folha.

- [ ] Enumerar chamadores; testar ilimitado sem abrir a folha, não só aparência interna.
- [ ] Testar cinco estados de coração, tempo de recarga e ação Revisar agora.
- [ ] Usar assinatura como link; preservar economia e retorno à aula/revisão.
- [ ] Rodar focal e conferir texto máximo; deixar o E2E de vidas para T18.

### T13 — Texto máximo da trilha e aceite do quadro antecipado

**Gate G1/G3. Modificar só após decisão:**
`radiant-app/src/features/journey/components/trailLayout.ts`, `trailLayout.test.ts`,
`radiant-app/src/features/journey/components/JourneyTrail.tsx`, `JourneyTrail.test.tsx`,
`radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`, `JourneyHomeScreen.flow.test.tsx`.
**Ler evidências:** `docs/evidence/2026-10-23-trilha-medalhao-retomada.md` e
`docs/evidence/2026-10-23-trilha-medalhao-quadro.md`.

- [ ] Apresentar ao dono alternativas concretas para texto máximo, preservando
  a solução atual até a decisão. Não reduzir fonte, truncar nem consumir os
  corredores de 64 pt silenciosamente.
- [ ] Para a alternativa aprovada, registrar teste vermelho de validade e
  geometria, além de diferença; verificar cabeça inteira, título, data e lembrete.
- [ ] Capturar AX5 e Android 200%; comparar à composição normal sem trocar a régua.
- [ ] Quanto ao quadro antecipado, pedir G3 sobre a evidência 0/13; não dizer
  que foi corrigido nem criar patch de hipótese não observada.
- [ ] Se reaparecer em T18, registrar quadro/timeline e só então abrir correção
  com reprodução específica, vermelho/verde e nova revisão.

### T14 — Revisão do conteúdo, ADR e decisões do player

**Gate G2. Arquivos:** `docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`,
`docs/adr/ADR-2026-10-24-aula-bancada-fisica-digital-e-colimacao.md`,
`radiant-app/src/features/bench/exposureModel.ts`, `exposureModel.test.ts`,
`radiant-app/src/features/bench/collimationModel.ts`, `collimationModel.test.ts`,
`radiant-app/src/features/bench/lessons/exposicao.ts`, `colimacao.ts`, `BenchLessonCatalog.test.ts`.

- [ ] Obter resposta frase por frase e às perguntas do documento, sem marcar
  "ok" em nome do dono. Enquanto isso, manter o conteúdo só em desenvolvimento.
- [ ] Se aprovada a frase mAs/dose, atualizar primeiro o contrato/comentário
  físico do modelo e depois a copy; teste guarda a afirmação específica.
- [ ] Aplicar decisões sobre técnica manual/AEC, região de interesse,
  enunciados e fechamento após as tentativas de reforço.
- [ ] Se o fechamento mudar, enumerar os consumidores do player e sua regra
  de repetição antes de editar; acrescentar teste com erro e item que volta.
- [ ] Manter paridade exata código/documento e alvos alcançáveis pelos botões.
- [ ] Rodar `exposureModel.test.ts`, `collimationModel.test.ts` e `BenchLessonCatalog.test.ts`
  na pasta `src/features/bench`, mais os fluxos afetados. Atualizar o estado da ADR só com o aval real.

### T15 — Plano 4: inventário sai/fica e aprovação

**Criar:** `docs/superpowers/plans/2026-10-25-retirada-e-recomeco-inventario.md`.
**Ler, sem remoção:** `radiant-app/src/data`, `content-manifest`,
`radiant-app/src/features/student-checkpoints`, `docs/curriculum-v3`,
`scripts/content`, `.github/workflows/content-scripts.yml`, `.loop/project.yaml`
e os caminhos de conteúdo encontrados pela grafia real do disco.

- [ ] Enumerar cada arquivo candidato com caminho exato, categoria, motivo,
  consumidor, decisão proposta sai/fica, gate e substituto necessário.
- [ ] Separar dados do G3 de motores genéricos de avaliação; não remover o
  módulo `student-checkpoints` inteiro por conter um lote antigo.
- [ ] Separar biblioteca de referência: livros, extrações, taxonomia e direitos.
  Inventariar nomes/metadados; não ler PDFs nem decidir remoção por associação.
- [ ] Mapear imports, testes, roteiros e validadores dependentes de cada retirada.
- [ ] Apresentar ao dono o inventário completo, a lista de validadores e a
  proposta de política em seção própria. Registrar aprovação por versão/hash.
- [ ] Conferir links/escopo, revisar independentemente e commitar só o inventário
  e seus apontadores. Nada é apagado nesta tarefa.

**Aceite:** o dono aprova lista concreta. A aprovação do layout ou deste plano
não equivale à aprovação do inventário ainda inexistente.

### T16 — Acessibilidade e quadros da bancada

**Modificar:** `docs/evidence/2026-10-24-aula-bancada.md` ou nova evidência
datada em `docs/evidence`; declarar cada log/captura que será versionado.
**Ler:** `radiant-app/src/features/bench/BenchControlRow.tsx` e seu teste.

- [ ] Conferir no iOS principal a árvore nativa e controles ajustáveis,
  rótulos com valor, ordem de foco, botões ±, extremos e desabilitado.
- [ ] Verificar a leitura efetiva com VoiceOver e TalkBack; separar "árvore
  inspecionada" de "fala ouvida". Se o ambiente impedir ouvir/operar o leitor,
  registrar evidência parcial e manter essa parte da tarefa e G8 pendentes;
  isso permite avançar nas tarefas independentes, mas não liberar a bancada.
- [ ] No AVD `radiant-entrada-api34`, colher `gfxinfo framestats` durante
  arrastos, com linhas válidas, duração e pior quadro. O G6 não substitui quadros.
- [ ] Medir três rodadas sem instrumentação JS que altere o comportamento;
  declarar Debug/emulador e sensibilidade à carga. Inspecionar resposta ao arrasto.
- [ ] Se houver defeito real, abrir entrega de correção com seus arquivos
  declarados; não editar produto no run reservado apenas à evidência.
- [ ] Parar Metro/app/emulador antes de validar documentos.

**Aceite:** leitura nativa efetivamente verificada e desempenho medido; arrasto
e alternativa sem gesto fino funcionam. Árvore isolada é evidência parcial,
não aceite de VoiceOver/TalkBack. Não confundir semântica no Jest com leitura nativa.

### T17 — Fechamento visual e técnico do plano 5

**Priorização de28/10, por Anderson:** correção delimitada do P2 PushOptIn
antecipada antes da T09, por criticidade. Escopo de dois arquivos de produto/teste. Em29/10, código R1 PASS e nativo R2
BOUNDED/APPROVED_CORE_BOUNDED: componente corrigido no Home local medido,53
focais/11 sob CPU limitada; Loop final15/15 em um ciclo em29/10. Review atual e Android
ao vivo não retestados; T17 e gates sem aceite. Evidência P2 datada28/10 conserva
as medições originais e o parecer de29/10.


**Plano 5/tarefa 12. Renomear:**
`radiant-app/src/ui/components/StarfieldBackground.tsx` e `StarfieldBackground.test.tsx`
para `MedallionBackground.tsx` e `MedallionBackground.test.tsx` na mesma pasta.
**Modificar:** todos os importadores/mocks enumerados antes do run,
`radiant-app/scripts/copy-style-baseline.json`, `radiant-app/scripts/visual-qa-policy.json`,
`docs/DESIGN.md`, registros dos planos e evidência datada.

- [ ] Gerar lista exata de importadores com `rg`, incluindo strings em mocks;
  congelar a união de arquivos antes de abrir o run do renome.
- [ ] Ver o teste do renome falhar com referência antiga; atualizar consumidores.
- [ ] Levar a guarda de copy a zero no domínio acordado em T01 e remover
  exceções dos arquivos refeitos; não zerar a baseline escondendo arquivos.
- [ ] Fazer uma rodada visual em lote: telas pequenas/grandes, AX5/200%,
  movimento reduzido, estados carregando/vazio/erro/sucesso e safe areas.
- [ ] Corrigir os achados em lote e confirmar numa segunda rodada. Defeito
  material novo abre entrega delimitada; não entrar em polimento sem fim.
- [ ] Fazer revisão final independente dos planos 3 e 5 e atualizar pendências
  humanas. A conferência real de segundo dia continua em T18.

Medição inicial de28/10: **R3-SHARED-01 P2**, PushOptIn do resultado iOS
fragmentava título/cortava corpo (evidênciaT07). Correção antecipada e revisada
em29/10: código corrigido e prova Home local BOUNDED; resultado Review atual
não foi retestado por fila real vazia. O aceite global permanece pendente da
conferência integral, sem tratar a aprovação do componente como T17 concluída. P3 da cauda compartilhada
T06 também permanece. Android perde rota ao trocar fonte ao vivo/resultmax
por erro do dev client; medir novamente num cliente compatível, sem atribuir
causa ao produto nem migrar framework por inferência. Não declarar fonte
máxima globalmente aprovada por testes de identidade ou por captura parcial.


## 7. Conferência final, retirada e recomeço

### T18 — Conferência integrada do layout, com o segundo dia no final

**Roteiros:** `radiant-app/.maestro/radiant-1-4-primeira-execucao.yaml`,
`radiant-app/.maestro/radiant-1-4-segundo-dia.yaml`,
`radiant-app/.maestro/radiant-1-4-vidas-esgotadas.yaml`, `reward-locked.yaml`,
`reward-unlock.yaml` e os `student-checkpoint-*.yaml` aplicáveis.
**Documentar:** evidência datada, registros dos planos 2/3/5, índice, FILA 67 e STATUS.

- [ ] Conferir código final, binário e Metro compatíveis. O SDK e o bridge
  executados precisam conter as APIs usadas; G6 pendente limita o aceite nativo.
- [ ] Preservar o simulador reservado `5FD8C926`: não usar em T00–T17,
  não limpar, não reinstalar e não aplicar migração destrutiva nele.
- [ ] Só nesta conferência verificar o estado real e a revisão naturalmente
  devida. Rodar o YAML corrigido integralmente no mesmo container, sem `clearState`.
- [ ] Executar primeira execução e vidas em outros dispositivos/cenários,
  sem destruir o container preparado do segundo dia. Não rodar todos os YAMLs
  indiscriminadamente como se tivessem as mesmas pré-condições.
- [ ] Conferir retorno da aula com erro deliberado, estrelas pela primeira
  resposta, revisão agendada, momento, ações de recompensa e reentrada.
- [ ] Fazer revisão final forte do plano 2, com o pacote nativo e G1/G3.
- [ ] Fechar o aceite de layout somente com evidência suficiente e aceite do dono.

**Comando, dentro de `radiant-app`, com o UDID preparado confirmado:**

```bash
maestro --device <udid-preparado> test .maestro/radiant-1-4-segundo-dia.yaml
```

**Esperado:** revisão devida recomendada, três respostas conferidas, conclusão
e próxima data visível ao voltar. Se ainda não houver revisão devida, registrar
pendência real sem editar relógio/dados. Se houver incompatibilidade de catálogo,
não chamar isso defeito de layout nem afirmar PASS do currículo novo.

Este é o fim da etapa visual autorizada. A troca de conteúdo abaixo depende
dos gates G4/G7. **Se T19–T21 forem autorizadas e executadas antes de fechar
o pacote completo, T22 passa a ser o último gate do pacote.** Um PASS em T18
permanece prova do catálogo legado na interface Medalhão, não do substituto.

### T19 — Política do Loop e validadores: só com inventário aprovado

**Gate G4. Arquivos:** `.loop/project.yaml`, `.github/workflows/content-scripts.yml`,
os scripts `scripts/content` e seus consumidores listados individualmente em T15.

- [ ] Confirmar a aprovação da versão exata do inventário e das mudanças de política.
- [ ] Conferir a união de todos os caminhos T20/T21 contra a política atual;
  resolver grafia NFD/NFC com o disco, não com caminho digitado de memória.
- [ ] Se precisar de janela de escrita, abrir/validar/fechar essa política
  em transação própria **antes** da remoção; não mudar a política durante seu run consumidor.
- [ ] Retirar apenas validadores de dados aposentados; manter contratos
  genéricos de schema, segurança, direitos e qualidade que continuam aplicáveis.
- [ ] Manter CI e Loop coerentes; rodar a configuração nova e registrar o que
  deixou de ser validado. A redução da lista não é prova de equivalência.

### T20 — Recomeço idempotente e backup que não ressuscita aulas

**Gate G4; contrato de IDs/geração do currículo em G7. Criar, como proposta:**
`radiant-app/src/features/curriculum-reset/CurriculumResetService.ts`,
`CurriculumResetService.test.ts` na mesma pasta.
**Modificar conforme inventário:**
`radiant-app/src/constants/storageKeys.ts`, `radiant-app/src/storage/storageInventory.ts`,
`storageInventory.test.ts`, `radiant-app/src/storage/schemaVersionGuard.ts`, `schemaVersionGuard.test.ts`,
`radiant-app/src/features/journey/services/JourneyProgressService.ts`, `JourneyProgressService.test.ts`,
`radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`, `SpacedRepetitionService.test.ts`,
`radiant-app/src/features/spaced-repetition/repositories/ItemReviewRepository.ts`, `ItemReviewRepository.test.ts`,
`radiant-app/src/features/progress-sync/LocalProgressAdapter.ts`, `LocalProgressAdapter.test.ts`,
`radiant-app/src/features/progress-sync/ProgressSyncService.ts`, `ProgressSyncService.test.ts`,
`radiant-app/src/features/progress-sync/startupRestore.ts`, `startupRestore.test.ts`,
`radiant-app/src/features/progress-sync/progressSync.types.ts`, `radiant-app/src/app/_layout.tsx`.

- [ ] Inventariar também retomadas, tentativas, evidências, domínio e avaliação
  nos repositórios apontados por T15; acrescentar seus **arquivos** ao escopo
  antes da escrita. Reset de jornada sozinho não limpa todos os consumidores.
- [ ] Escrever fixtures antiga/nova/futura/corrompida e injeções de falha entre
  etapas. O teste deve provar idempotência e recuperação de migração parcial.
- [ ] Usar lista explícita do que recomeça. Não reutilizar o reset amplo da
  migração 1.4: ele inclui gamificação, metas e vidas entre chaves pedagógicas.
- [ ] Antes/depois: XP, sequência, vidas, assinatura e preferências preservados;
  progresso/revisões/retomadas do currículo retirado deixam de ser alcançáveis.
- [ ] Filtrar IDs/geração tanto na migração quanto na restauração:
  `applyJourney` e `applySchedule` não podem reintroduzir IDs aposentados.
- [ ] Provar comportamento de cada escritor frente à geração/schema futuro.
  Só incrementar `APP_SCHEMA_VERSION` não comprova a proteção G7.
- [ ] Testar restore após reset, reset após restore, reabertura offline e falha
  de persistência. Não declarar cobertura de histórico que o backup não transporta.
- [ ] Revisão independente e validação configurada; não ativar migração no
  simulador legado reservado antes de T18.

**Tabela mínima de casos que os testes devem executar:**

| Entrada | Resultado esperado |
| --- | --- |
| Aluno antigo com progresso/revisões | Recomeço uma vez; nenhuma revisão órfã; economia idêntica |
| Reabrir após recomeço concluído | Nenhuma nova perda ou concessão; mesmo estado |
| Backup antigo aplicado depois | IDs retirados ignorados; XP/sequência preservados pelas regras existentes |
| Falha no meio e reabrir | Retomada segura; não marcar concluído antes de completar |
| Store futuro lido por código antigo | Escrita bloqueada/quarentena segundo G7; sem sobrescrever |
| Aluno novo | Apenas o catálogo novo e estado inicial válido |

### T21 — Retirar os dados aprovados e entrar com o catálogo substituto

**Gates G4/G7. Arquivos:** união exata do inventário aprovado, mais
`radiant-app/src/features/journey/services/JourneyDefinitionService.ts`,
`JourneyCurriculumService.ts`, `JourneyCatalogAudit.ts`, `JourneyCatalogReachability.test.ts`,
`radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.ts`,
`ProductionCatalogComposition.ts`, `createProductionCurriculumCatalog.ts` e
os testes/importadores listados em T15.

- [ ] Exigir o contrato do novo catálogo e conteúdo aprovado para a troca;
  não desenhar currículo nem promover as duas amostras por conta própria.
- [ ] Gerar testes vermelhos de referências antigas, órfãos e alcance das
  novas rotas; separar import removido de engine genérica que continua útil.
- [ ] Retirar somente o que o dono marcou sai; preservar biblioteca que ficou.
- [ ] Atualizar par primeira-execução/segundo-dia e vidas sobre o novo conteúdo
  na mesma entrega, junto com o contrato AST e os testes do catálogo.
- [ ] Guardar o roteiro e a evidência legados como história identificada;
  não executá-los contra um catálogo incompatível e chamar a falha de regressão.
- [ ] Provar navegação e ausência de órfãos, revisar e validar. Nenhuma build
  de loja com trilha vazia ou somente as aulas de exemplo.

### T22 — Última conferência após a troca e entrega ao dono

- [ ] Executar o novo caminho completo: aluno novo, aluno migrado, restauração
  antiga, erro/reforço, vidas, avaliação, assinatura e retorno offline.
- [ ] Preparar primeira visita em container separado e executar o segundo dia
  do catálogo novo quando naturalmente devido. O teste legado de T18 não o substitui.
- [ ] Medir novamente os cenários afetados por mudanças posteriores à prova
  visual/nativa; reaproveitar apenas evidência cujo código/catálogo segue equivalente.
- [ ] Fechar os planos 2/3/4/5 com revisão final independente e o aceite real;
  atualizar STATUS, índice e FILA, sem criar um status datado paralelo.
- [ ] Informar SHA, CI desse SHA, evidências e limites Debug/Release/aparelho
  físico, gates humanos e estados finais de run/sessão.
- [ ] Entregar ao dono para decidir merge de #66/#67, build e loja. Não executar
  esses atos com base neste plano documental.

## 8. Critério de conclusão e handoff

**Layout implementado** e **layout aceito** são estados distintos. O aceite
integral exige T01–T18 (incluindo T04a), os gates humanos aplicáveis e G8;
limitações nativas explicitadas não dispensam uma prova obrigatória.
G6 pendente deixa a assinatura estaticamente validada, sem aceite nativo da
API nova. **Retirada/recomeço concluídos** exigem também T19–T22
e os gates de inventário/currículo. **Pronto para loja** exige o primeiro lote
novo e a autorização de distribuição do dono; não é sinônimo dos dois anteriores.

Não reabrir: direção Medalhão, Sora, Pixel vetorial, `runtimeVersion: fingerprint`,
primeira resposta para estrelas, primeiro erro sem custo conforme contrato,
regras de revisão e preservação de XP/sequência/vidas/assinatura no recomeço.

O próximo executor começa por T00, lê o ledger e trabalha numa entrega por vez.
Se decisões G1–G7 ainda não chegaram, mantém esses trechos pendentes e segue
nos independentes. A conferência de segundo dia fica no fechamento, como o
dono pediu; nenhum agendamento ou automação é criado por este plano.

## 9. Comandos focais concretos para a execução futura

Todos abaixo são **comandos planejados, não executados nesta entrega**. Em
`radiant-app`, usar o PATH Node 20 da seção 5. O prefixo comum é
`EXPO_NO_DOTENV=1 npx jest --runInBand --no-cache`; passar os arquivos de cada
linha como argumentos. Em testes novos de tela, repetir o mesmo comando sob
`/usr/sbin/taskpolicy -b`. Esperado: vermelho específico registrado antes da
mudança; PASS depois, sem afirmar rasterização nativa pelo Jest.

| Tarefa | Argumentos exatos do Jest, relativos a `radiant-app` |
| --- | --- |
| T02 | `src/ui/components/HUD.test.tsx` |
| T03 | `src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx src/features/first-run/screens/WelcomeFlowReentry.test.tsx src/features/first-run/components/WelcomeSlide.test.tsx` |
| T04 | `src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx src/features/lesson-flow/services/feedbackFor.test.ts src/features/bench/CollimationImage.test.tsx src/features/bench/lessons/BenchLessonCatalog.test.ts` |
| T04a | `src/test/mocks/reactNativeSkia.test.tsx src/ui/illustrations/ThemeIllustration.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx src/features/lesson-flow/renderers/ActivityRendererRegistry.test.tsx src/features/lesson-flow/renderers/BenchStepRenderer.test.tsx src/features/bench/ExposureImage.test.tsx src/features/bench/CollimationImage.test.tsx` |
| T05 | `src/features/quiz/components/LessonSummary.test.tsx src/features/quiz/screens/QuizScreen.flow.test.tsx src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx` |
| T06 | `src/features/rewards/screens/RewardScreen.flow.test.tsx` |
| T07 | `src/features/review/screens/ReviewScreen.flow.test.tsx src/ui/components/ListRow.test.tsx` |
| T08 | `src/features/checkpoint/screens/CheckpointScreen.flow.test.tsx` |
| T09 | `src/features/profile/screens/ProfileScreen.flow.test.tsx src/features/profile/components/ProfileIdentityHeader.test.tsx src/features/profile/components/MedalShelf.test.tsx src/features/profile/components/StreakWeek.test.tsx src/features/profile/components/TodayGoals.test.tsx` |
| T10 | `src/features/settings/screens/SettingsScreen.flow.test.tsx src/ui/components/GroupedList.test.tsx src/features/subscription/components/SubscriptionCard.test.tsx src/features/progress-sync/components/ICloudBackupCard.test.tsx src/features/profile/components/FeedbackPreferencesCard.test.tsx src/features/progress/components/LegalLinksCard.test.tsx` |
| T11 | `src/features/subscription/screens/SubscriptionScreen.flow.test.tsx src/features/subscription/StoreKit2Adapter.test.ts src/features/subscription/radiantStoreKitModule.contract.test.ts src/features/subscription/storekitTestingConfig.contract.test.ts` |
| T12 | `src/features/hearts/components/HeartsSheet.test.tsx` |
| T13 | `src/features/journey/components/trailLayout.test.ts src/features/journey/components/JourneyTrail.test.tsx src/features/journey/screens/JourneyHomeScreen.flow.test.tsx` |
| T14 | `src/features/bench/exposureModel.test.ts src/features/bench/collimationModel.test.ts src/features/bench/lessons/BenchLessonCatalog.test.ts src/features/lesson-flow/screens/LessonFlowScreen.flow.test.tsx` |
| T20 | `src/features/curriculum-reset/CurriculumResetService.test.ts src/storage/storageInventory.test.ts src/storage/schemaVersionGuard.test.ts src/features/journey/services/JourneyProgressService.test.ts src/features/spaced-repetition/services/SpacedRepetitionService.test.ts src/features/spaced-repetition/repositories/ItemReviewRepository.test.ts src/features/progress-sync/LocalProgressAdapter.test.ts src/features/progress-sync/ProgressSyncService.test.ts src/features/progress-sync/startupRestore.test.ts` |

T01 usa `node --test scripts/copy-style-contract.test.mjs scripts/maestro-contract.test.mjs`;
T08 acrescenta `npm run test:checkpoint-performance-report` e
`npm run test:checkpoint-instrument`. T17 usa os contratos de copy/contraste/
movimento/ícones, o teste renomeado e o `quality` configurado. T15 é inventário
documental; T19/T21 só ganham lista de comando fechada após o inventário, porque
nomear agora todos os arquivos a remover fingiria uma decisão ainda não tomada.

T16, no terminal com o AVD e serial **confirmados**, usa a mesma coleta de
quadros da evidência da trilha; declarar os arquivos de saída antes do run:

```bash
adb -s <serial-do-AVD-confirmado> shell dumpsys gfxinfo com.ascendcreative.radiant reset
# Fazer uma rodada de arrasto de exposição e colimação, registrando sua duração.
adb -s <serial-do-AVD-confirmado> shell dumpsys gfxinfo com.ascendcreative.radiant framestats
```

Colher três rodadas, conservar o cabeçalho/linhas brutas necessários à análise
e explicitar descartes. Não fabricar FPS a partir da duração total do roteiro.
T18/T22 seguem os roteiros separados e suas pré-condições; nenhum comando de
build, instalação ou loja é incluído como passo automático deste plano.
