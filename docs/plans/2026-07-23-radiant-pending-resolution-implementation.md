# Radiant Pending Resolution Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** fechar as pendências 10–16 com evidência real em iOS e Android, acessibilidade verificável, contratos locais de produto e prontidão de beta — sem alterar API/VPS, publicar builds ou recrutar participantes.

**Architecture:** a execução é organizada em cinco gates. O primeiro produz uma instalação local determinística e evidência por plataforma; os gates seguintes só usam essa base para corrigir acessibilidade, consolidar o handoff, formalizar contratos locais e registrar decisões de API/beta. Os contratos automatizados continuam em `radiant-app/scripts/`, os testes de domínio em `src/**`, e documentos canônicos em `docs/`.

**Tech Stack:** Expo/React Native, TypeScript, Jest, Maestro, EAS profile local `e2e-test`, Storybook React Native, AsyncStorage e documentação Markdown.

**Skills triadas (não instalar nesta etapa):**

- Adotar como referência de implementação, se necessário, `vercel-labs/agent-skills@vercel-react-native-skills`: ampla adoção no catálogo e autoria do ecossistema Vercel.
- Manter as skills já disponíveis `a11y-audit:a11y-audit`, Storybook e `task-observer` para auditoria acessível, componentes isolados e captura de melhorias de processo.
- Não recomendar instalação automática de `maestro-mobile-testing`, `figma-design-handoff`, `expo-react-native-performance` ou `rive-interactive`: as buscas retornaram candidatos úteis, mas a combinação de reputação da origem, estrelas verificáveis e adoção não atingiu o limiar para inclusão no fluxo. Para Maestro e Rive, priorizar documentação oficial e contratos locais.

**Restrições imutáveis:**

- Não fazer SSH, deploy, DNS, banco, restart, migração ou qualquer escrita na API/VPS.
- Não publicar em TestFlight/App Store, criar release ou ligar analytics/crash reporting remotos.
- Não enviar PII, segredos ou conteúdo clínico real para ferramentas externas; pesquisa fica somente em material local.
- Preservar os artefatos não rastreados do usuário: `Mascote.png`, `New Layout/`, `docs/NOVO_VPS.md` e `docs/superpowers/plans/2026-04-30-design-system-final.md`.

---

## Gate 1 — device real e Maestro

### Task 1: estabelecer o inventário de ambiente e o registro de evidências

**Files:**
- Create: `radiant-app/docs/evidence/README.md`
- Create: `radiant-app/docs/evidence/2026-07-23-device-e2e-baseline.md`
- Modify: `radiant-app/docs/E2E_RUNBOOK.md`

**Step 1: criar primeiro o contrato de evidência (teste que falha antes do documento).**

Em `radiant-app/scripts/maestro-contract.test.mjs`, exigir que o runbook aponte para uma evidência por plataforma e que a evidência separe `environment-blocked`, `app-failed` e `passed`.

**Step 2: executar para confirmar a falha.**

Run: `cd radiant-app && node scripts/maestro-contract.test.mjs`

Expected: falha citando a ausência dos arquivos/campos de evidência.

**Step 3: documentar o baseline atual.**

Registrar Xcode disponível, ausência atual de devices disponíveis, ausência de `maestro` e `sdkmanager`, espaço livre e as versões detectadas — sem dados de usuário. A documentação deve dizer explicitamente que essa é uma pré-condição, não uma aprovação de E2E.

**Step 4: executar o contrato de novo.**

Run: `cd radiant-app && node scripts/maestro-contract.test.mjs`

Expected: `PASS` sem marcar nenhum fluxo como executado em device.

**Step 5: commit.**

```bash
git add radiant-app/docs/E2E_RUNBOOK.md radiant-app/docs/evidence radiant-app/scripts/maestro-contract.test.mjs
git commit -m "test: require device evidence for e2e runs"
```

### Task 2: instalar Maestro e preparar runtimes locais autorizados

**Files:**
- Modify: `radiant-app/docs/E2E_RUNBOOK.md`
- Modify: `radiant-app/docs/evidence/2026-07-23-device-e2e-baseline.md`

**Step 1: verificar os pré-requisitos sem mutação.**

Run: `xcode-select -p && xcrun simctl list devices available && df -h /Users/anderson/Developer/Radiant`

Expected: identificar com precisão quais runtimes/device types precisam ser baixados; não inferir a partir de um simulador inexistente.

**Step 2: instalar o Maestro apenas pela instrução oficial vigente e confirmar a origem.**

Após conferir a documentação oficial, instalar para `/Users/anderson/.maestro/bin`, adicionar esse caminho apenas ao shell da sessão e executar `maestro --version`. Registrar versão e data; não salvar tokens, variáveis ou logs sensíveis no repositório.

**Step 3: preparar os dois destinos.**

Criar/baixar exatamente um simulador iPhone suportado pelo Xcode instalado e um emulador Android x86_64/arm64 suportado pelo SDK, usando `xcrun simctl` e `sdkmanager`/`avdmanager` somente depois de suas localizações e licenças serem verificadas. Registrar nomes e versões, não UUIDs voláteis.

**Step 4: verificar que Maestro enxerga os destinos.**

Run: `maestro --version`, iniciar cada destino, e executar `maestro test --help`.

Expected: CLI disponível e ambos os destinos em estado de boot; se faltar runtime, marcar `environment-blocked` e parar o gate sem mudar o app.

**Step 5: atualizar a evidência e commit.**

```bash
git add radiant-app/docs/E2E_RUNBOOK.md radiant-app/docs/evidence/2026-07-23-device-e2e-baseline.md
git commit -m "docs: record local maestro device setup"
```

### Task 3: gerar builds locais E2E e executar a matriz de fluxos

**Files:**
- Modify: `radiant-app/.maestro/onboarding-to-home.yaml`
- Modify: `radiant-app/.maestro/learning-critical-path.yaml`
- Modify: `radiant-app/.maestro/offline-relaunch.yaml`
- Modify: `radiant-app/docs/evidence/2026-07-23-device-e2e-baseline.md`
- Modify: `radiant-app/docs/E2E_RUNBOOK.md`

**Step 1: adicionar asserções que falham quando o estado crítico não aparece.**

Antes de mudar um flow, acrescentar `assertVisible` ancorado em `testID`/texto semântico para cada resultado: saída do onboarding, resposta do quiz e relaunch offline. Nunca usar coordenadas.

**Step 2: executar a validação estática.**

Run: `cd radiant-app && node scripts/maestro-contract.test.mjs`

Expected: falha se algum flow usar coordenada, não tiver uma asserção de estado ou perder o testID crítico.

**Step 3: criar o build local sem publicar.**

Usar o perfil `e2e-test` em `eas.json` com `--local`, ou o comando Expo equivalente apenas se o perfil não admitir build local. Nunca usar `--auto-submit`, `eas submit` ou um perfil de release.

**Step 4: instalar e rodar os três flows por plataforma.**

Executar individualmente os YAMLs em iOS e Android, salvando screenshots/logs sanitizados fora do Git ou em `docs/evidence/artifacts/` somente se não contiverem dados de usuário. Preencher uma matriz 3x2 com comando, build, runtime, resultado e causa de qualquer bloqueio.

**Step 5: gate de qualidade e commit.**

Run: `cd radiant-app && npm test -- --runInBand && npm run quality`

Expected: testes e quality passam; Maestro só recebe status `passed` quando os três YAMLs concluírem na plataforma correspondente.

```bash
git add radiant-app/.maestro radiant-app/docs/E2E_RUNBOOK.md radiant-app/docs/evidence
git commit -m "test: validate critical flows on local devices"
```

## Gate 2 — acessibilidade e qualidade

### Task 4: executar a auditoria manual acessível e transformar falhas em testes

**Files:**
- Modify: `radiant-app/docs/ACCESSIBILITY_QA_V1.md`
- Create: `radiant-app/docs/evidence/2026-07-23-accessibility-device-qa.md`
- Modify: `radiant-app/src/ui/components/AppButton.tsx`
- Modify: `radiant-app/src/features/quiz/components/QuizQuestion.tsx`
- Modify: `radiant-app/src/features/onboarding/screens/OnboardingScreen.tsx`
- Modify: testes co-localizados dos componentes afetados

**Step 1: registrar falhas antes de corrigi-las.**

Em iOS: VoiceOver, Dynamic Type, Reduce Motion, tema e orientação. Em Android: TalkBack, fonte ampliada, tema e orientação. Classificar cada item como bloqueante, importante, menor ou não reproduzido; não declarar compatibilidade de plataforma sem executá-la.

**Step 2: para cada falha reproduzível, escrever teste de regressão.**

Exemplos obrigatórios: `accessibilityRole`, label/hint, estado `disabled/busy/selected`, foco após feedback e ausência de animação essencial quando Reduce Motion está ativo.

**Step 3: implementar a menor correção sem redesenho.**

Manter tokens e linguagem visual atuais. Não substituir componentes íntegros por uma biblioteca nova.

**Step 4: verificar.**

Run: `cd radiant-app && npm test -- --runInBand --watch=false && npm run quality`

Expected: testes novos passam, nenhum erro de lint e nenhuma regressão visual nova.

**Step 5: commit.**

```bash
git add radiant-app/docs/ACCESSIBILITY_QA_V1.md radiant-app/docs/evidence radiant-app/src
git commit -m "fix: close verified accessibility gaps"
```

### Task 5: reduzir dívida conhecida sem mascarar o baseline

**Files:**
- Modify: arquivos citados por `npm run lint` (somente warnings selecionados)
- Modify: `radiant-app/scripts/visual-qa-policy.json` somente para exceções justificadas
- Modify: `radiant-app/docs/DESIGN_QA_REPORT_V1.md`

**Step 1: capturar baseline.**

Run: `cd radiant-app && npm run lint 2>&1 | tee /tmp/radiant-lint-baseline.txt && npm run test:visual-qa`

Expected: registrar contagens reais por regra/arquivo e não editar a política ainda.

**Step 2: escolher um lote fechado de warnings de baixo risco.**

Preferir imports, tipos e dependências de hook claramente locais. Não alterar warnings de arquitetura ou acessibilidade sem teste de comportamento.

**Step 3: adicionar/ajustar testes antes da correção quando a regra puder afetar fluxo.**

Rodar o teste co-localizado que protege a tela/serviço antes de editar; ele deve falhar quando aplicável.

**Step 4: corrigir e medir novamente.**

Run: `cd radiant-app && npm run quality`

Expected: zero erros, warnings estritamente menores que o baseline e nenhuma exceção nova sem justificativa datada.

**Step 5: commit.**

```bash
git add radiant-app/src radiant-app/scripts/visual-qa-policy.json radiant-app/docs/DESIGN_QA_REPORT_V1.md
git commit -m "chore: reduce tracked quality debt"
```

## Gate 3 — handoff e pesquisa sem contato externo

### Task 6: tornar o design system exportável para Figma

**Files:**
- Create: `radiant-app/docs/ui/DESIGN_TOKEN_MAP.md`
- Create: `radiant-app/docs/ui/COMPONENT_STATE_MATRIX.md`
- Modify: `radiant-app/docs/ui/RADIANT_UI_KIT.md`
- Modify: `radiant-app/src/ui/__tests__/semantic-colors.test.ts`

**Step 1: fazer o teste de contratos de token falhar.**

Exigir que cada token semântico exportado tenha papel, modo light/dark e consumidor de referência; não comparar hexadecimal direto em componentes.

**Step 2: documentar a tabela de mapeamento.**

Mapear aliases Figma sugeridos (`color/`, `space/`, `radius/`, `type/`, `motion/`) para a fonte TypeScript real, status de deprecação e uso. A fonte de verdade continua sendo código; o documento não cria tokens inexistentes.

**Step 3: criar a matriz de estados.**

Cobrir AppButton, cards de escolha, quiz, loading/erro/vazio, bottom navigation e modal: default, pressed, focused, disabled, busy, selected, success e erro quando aplicável, incluindo label de acessibilidade.

**Step 4: verificar e commit.**

Run: `cd radiant-app && npm test -- --runInBand src/ui/__tests__/semantic-colors.test.ts && npm run quality`

Expected: contrato de tokens e quality passam.

```bash
git add radiant-app/docs/ui radiant-app/src/ui/__tests__/semantic-colors.test.ts
git commit -m "docs: map design tokens and component states"
```

### Task 7: preparar protocolo de pesquisa sem PII e sem recrutamento

**Files:**
- Create: `radiant-app/docs/research/USER_RESEARCH_PROTOCOL.md`
- Create: `radiant-app/docs/research/USER_RESEARCH_SCRIPT.md`
- Create: `radiant-app/docs/research/CONSENT_TEMPLATE.md`
- Create: `radiant-app/docs/research/PRIORITIZATION_FRAMEWORK.md`
- Create: `radiant-app/scripts/research-protocol-contract.test.mjs`
- Modify: `radiant-app/package.json`

**Step 1: escrever o contrato documental que inicialmente falha.**

O script deve exigir: objetivo, tarefas observáveis, métricas qualitativas, desistência sem prejuízo, proibição de dados clínicos/identificadores, nenhuma instrução de contato e regra de priorização explícita.

**Step 2: rodar o contrato.**

Run: `cd radiant-app && node scripts/research-protocol-contract.test.mjs`

Expected: falha porque os quatro documentos ainda não existem.

**Step 3: escrever os artefatos locais.**

Usar participantes hipotéticos, dados fictícios e linguagem de consentimento que não promova diagnóstico, tratamento ou coleta. Terminar no ponto de “pronto para aprovação/recrutamento”, sem criar lista, formulário remoto ou convite.

**Step 4: expor como quality gate e verificar.**

Adicionar `test:research-contract` e incluí-lo em `npm run quality`.

Run: `cd radiant-app && npm run test:research-contract && npm run quality`

Expected: PASS.

**Step 5: commit.**

```bash
git add radiant-app/docs/research radiant-app/scripts/research-protocol-contract.test.mjs radiant-app/package.json
git commit -m "docs: prepare privacy-safe user research materials"
```

## Gate 4 — contrato de aprendizagem e spike Rive reversível

### Task 8: formalizar a política pedagógica e alinhar SM-2 a uma única fonte de verdade

**Files:**
- Create: `radiant-app/docs/LEARNING_SCIENCE_CONTRACT.md`
- Create: `radiant-app/src/features/spaced-repetition/models/learningPolicy.ts`
- Create: `radiant-app/src/features/spaced-repetition/models/learningPolicy.test.ts`
- Modify: `radiant-app/src/features/spaced-repetition/models/sm2.ts`
- Modify: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.ts`
- Create: `radiant-app/src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`

**Step 1: escrever testes de tabela para o contrato.**

Cobrir tentativa inicial, acerto forte, acerto limítrofe, erro, reinício, teto de intervalo, limite do ease factor e datas injetadas. Os testes devem mostrar que serviço e modelo hoje calculam caminhos diferentes.

**Step 2: executar para confirmar a divergência.**

Run: `cd radiant-app && npm test -- --runInBand src/features/spaced-repetition/models/learningPolicy.test.ts src/features/spaced-repetition/services/SpacedRepetitionService.test.ts`

Expected: falha até que ambos deleguem à mesma política pura.

**Step 3: implementar `learningPolicy` puro e injetável.**

Centralizar classificação de desempenho, passo SM-2 e agendamento a partir de `now`. O serviço só persiste/serializa; `sm2.ts` exporta a mesma implementação, sem fórmula duplicada.

**Step 4: documentar limites pedagógicos.**

Explicar que os intervalos são regras de produto educacional, não recomendação clínica; definir feedback, progresso e condições de revisão com exemplos fictícios.

**Step 5: verificar e commit.**

Run: `cd radiant-app && npm test -- --runInBand && npm run typecheck && npm run quality`

Expected: testes de transição determinísticos passam e não há duas fórmulas divergentes.

```bash
git add radiant-app/docs/LEARNING_SCIENCE_CONTRACT.md radiant-app/src/features/spaced-repetition
git commit -m "feat: formalize learning schedule policy"
```

### Task 9: executar o spike Rive atrás de flag e com fallback estático

**Files:**
- Create: `radiant-app/docs/adr/ADR-001-rive-pixel-pilot.md`
- Create: `radiant-app/src/ui/characters/RivePixelIllustration.tsx`
- Create: `radiant-app/src/ui/characters/RivePixelIllustration.test.tsx`
- Modify: `radiant-app/src/ui/characters/PixelIllustration.tsx`
- Modify: `radiant-app/src/config.ts`
- Modify: `radiant-app/src/config/contracts.ts`
- Modify: `radiant-app/app.json` only if the verified Rive runtime needs a documented native config
- Modify: `radiant-app/package.json` only after the official compatibility check

**Step 1: registrar baseline antes de instalar dependência.**

Medir startup, memória e fluidez em cenário repetível nos dois devices do Gate 1. Registrar comando, device, build e método; não inventar FPS. O ADR deve definir orçamento, condição de descarte e fallback.

**Step 2: verificar compatibilidade na documentação oficial atual.**

Confirmar runtime React Native suportado, versão Expo/React Native compatível, necessidade de dev client/prebuild e licença. Se o runtime exigir mudança incompatível no build ou não houver suporte para ambas plataformas, encerrar como `rejected` no ADR sem instalar pacote.

**Step 3: escrever testes que falham.**

Mockar o runtime para provar: flag desativada renderiza `PixelIllustration` estático; flag ativada com asset válido renderiza Rive; falha de carregamento retorna ao fallback acessível; Reduce Motion não depende da animação para transmitir estado.

**Step 4: implementar o mínimo, condicionado ao passo 2.**

Adicionar `ENABLE_RIVE_PIXEL_PILOT` com default `false`; carregar só um asset piloto licenciado e versionado. Não remover assets PNG nem trocar o fluxo inteiro.

**Step 5: comparar e decidir.**

Run: `cd radiant-app && npm test -- --runInBand src/ui/characters/RivePixelIllustration.test.tsx && npm run quality`

Depois rodar o mesmo cenário nos dois devices e preencher baseline versus piloto. Aceitar apenas se o orçamento do ADR for atendido nos dois; caso contrário manter flag desligada e registrar descarte.

**Step 6: commit.**

```bash
git add radiant-app/docs/adr radiant-app/src/ui/characters radiant-app/src/config.ts radiant-app/src/config/contracts.ts radiant-app/app.json radiant-app/package.json
git commit -m "feat: add reversible pixel animation pilot"
```

## Gate 5 — API read-only e prontidão de beta

### Task 10: auditar a API sem mutação e converter o resultado em decisão local

**Files:**
- Create: `radiant-app/docs/adr/ADR-002-api-runtime-strategy.md`
- Create: `radiant-app/docs/ARCHITECTURE_STATE.md`
- Modify: `radiant-app/src/config/contracts.ts`
- Modify: `radiant-app/src/config/contracts.test.ts`
- Modify: `radiant-app/src/config.ts`

**Step 1: escrever o teste de defaults seguros.**

Adicionar casos para URL ausente/malformada, sync remoto desabilitado, catálogo remoto desabilitado, analytics/crash reporting desabilitados e beta gate determinado apenas por flags locais.

**Step 2: rodar os testes antes de editar.**

Run: `cd radiant-app && npm test -- --runInBand src/config/contracts.test.ts`

Expected: falha se algum default permite tráfego remoto ou estado ambíguo.

**Step 3: executar auditoria exclusivamente de leitura.**

Usar requisições HTTP anônimas e verificações de configuração local para registrar URL, código/status, timeout e comportamento do app. Não autenticar, não fazer SSH, não acessar painel, banco ou logs remotos, e não repetir chamadas agressivamente.

**Step 4: documentar ADR e estado de arquitetura.**

Separar fatos observados de hipóteses. Escolher explicitamente `local-first` enquanto o endpoint não estiver saudável e definir gatilhos para futura reativação: contrato versionado, autenticação, health check e autorização separada.

**Step 5: verificar e commit.**

Run: `cd radiant-app && npm test -- --runInBand src/config/contracts.test.ts && npm run quality`

Expected: defaults seguros passam sem chamada remota durante o teste.

```bash
git add radiant-app/docs/adr/ADR-002-api-runtime-strategy.md radiant-app/docs/ARCHITECTURE_STATE.md radiant-app/src/config.ts radiant-app/src/config/contracts.ts radiant-app/src/config/contracts.test.ts
git commit -m "docs: record local-first API runtime strategy"
```

### Task 11: consolidar observabilidade local e checklist de beta real-device

**Files:**
- Create: `radiant-app/docs/OBSERVABILITY_MATRIX.md`
- Create: `radiant-app/docs/BETA_REAL_DEVICE_CHECKLIST.md`
- Modify: `radiant-app/docs/BETA_EXIT_CRITERIA.md`
- Modify: `radiant-app/docs/release/TESTFLIGHT_SMOKE.md`
- Modify: `radiant-app/src/features/telemetry/telemetry.types.ts`
- Modify: `radiant-app/src/features/telemetry/TelemetryService.ts`
- Create: `radiant-app/src/features/telemetry/TelemetryService.privacy.test.ts`

**Step 1: criar testes de privacidade para telemetria.**

Definir uma allowlist de propriedades por evento e testar que valores de e-mail, token, texto livre, resposta clínica, URL com query e identificador externo sejam descartados/redigidos antes de persistir/exportar. Usar somente fixtures sintéticas.

**Step 2: executar para confirmar a falha.**

Run: `cd radiant-app && npm test -- --runInBand src/features/telemetry/TelemetryService.privacy.test.ts`

Expected: falha enquanto o sanitizador/allowlist não existir.

**Step 3: implementar sanitização local e documentação.**

Aplicar o filtro antes dos adapters e persistência. A matriz deve mapear evento, finalidade, propriedade permitida, retenção local, trigger e flag remota exigida. O checklist deve cobrir instalação limpa, upgrade, offline, permissões, deep links, acessibilidade, consumo, crashes e recuperação — mas não executar TestFlight sem autorização nova.

**Step 4: verificar toda a suíte.**

Run: `cd radiant-app && npm test -- --runInBand && npm run quality`

Expected: telemetria local segura por default, nenhuma integração remota habilitada e quality passa.

**Step 5: commit.**

```bash
git add radiant-app/docs/OBSERVABILITY_MATRIX.md radiant-app/docs/BETA_REAL_DEVICE_CHECKLIST.md radiant-app/docs/BETA_EXIT_CRITERIA.md radiant-app/docs/release/TESTFLIGHT_SMOKE.md radiant-app/src/features/telemetry
git commit -m "feat: add privacy-safe beta observability contracts"
```

### Task 12: realizar a revisão final e registrar a decisão de parada

**Files:**
- Modify: `radiant-app/docs/evidence/2026-07-23-device-e2e-baseline.md`
- Modify: `radiant-app/docs/BETA_EXIT_CRITERIA.md`
- Modify: `radiant-app/docs/CHANGELOG.md`
- Modify: `docs/plans/2026-07-23-radiant-pending-resolution-design.md`

**Step 1: executar a bateria final.**

Run: `cd radiant-app && npm test -- --runInBand && npm run quality`

Expected: 100% dos gates automatizados passam; resultados de device permanecem separados por plataforma.

**Step 2: revisar os critérios de saída um a um.**

Usar somente evidência local e datada. Cada item deve terminar em `passed`, `blocked` ou `not-run`, com dono e próximo passo para qualquer pendência. Não converter bloqueio ambiental em PASS.

**Step 3: registrar a parada autorizada.**

Atualizar changelog e checklist dizendo que o produto está preparado para a próxima autorização, não publicado. Incluir ações excluídas: reativar API, ativar telemetria remota, recrutar, build cloud, TestFlight e App Store.

**Step 4: commit.**

```bash
git add radiant-app/docs/evidence radiant-app/docs/BETA_EXIT_CRITERIA.md radiant-app/docs/CHANGELOG.md docs/plans/2026-07-23-radiant-pending-resolution-design.md
git commit -m "docs: close pending-resolution evidence review"
```

## Verificação final obrigatória

Antes de declarar o plano concluído, executar:

```bash
export PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH
cd /Users/anderson/Developer/Radiant/radiant-app
npm test -- --runInBand
npm run quality
git -C /Users/anderson/Developer/Radiant status --short
```

Relatar separadamente: resultados do Jest/quality, matriz iOS/Android, warnings restantes, artefatos de evidência, decisões rejeitadas (por exemplo Rive) e qualquer gate bloqueado. Não fazer release ou mutação remota como consequência dessa verificação.
