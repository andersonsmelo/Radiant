# Radiant — Execution Status (2026-07-27)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app deve abrir, oferecer catálogo local, registrar progresso e permitir revisão mesmo quando a API remota está ausente.

A API pública conhecida em `api.radiant.ascendcreative.com.br` permanece **inativa** e retorna HTTP 502, reconfirmado nesta data por smoke público read-only em `/health` e `/ready`. Esta execução não alterou VPS, DNS, proxy, banco, deploy ou serviço remoto.

Este documento substitui [`EXECUTION_STATUS_2026-07-26.md`](EXECUTION_STATUS_2026-07-26.md) como estado canônico. O snapshot anterior permanece histórico. Em particular, ele registra o defeito de recorte do CTA como corrigido e o E2E de device como validação do fluxo crítico — as duas afirmações precisam da ressalva descrita abaixo.

## O que mudou desde 2026-07-26

O trabalho desta data foi de planejamento de lançamento e de correção de **divergências entre a configuração declarada e o que a build realmente faz**. Três defeitos dessa mesma família foram encontrados; nenhum era visível em screenshot ou em revisão de tela.

### 1. A folga da tab bar sobrevivia em quatro telas

A correção de `86d1867` criou a constante `tabBarClearance` e a aplicou apenas ao `JourneyHomeScreen`. O defeito seguia vivo em `HomeScreen` (32pt), `ProgressScreen` (24pt), `MissionsScreen` (120pt fixo) e `GalaxyMapScreen` (110pt fixo), contra os 102pt exigidos pela barra flutuante.

As quatro telas passaram a derivar a folga da constante, e a regra virou teste estrutural em `radiant-app/scripts/tab-bar-clearance-contract.test.mjs`, ligado ao `npm run quality`. Revisão tela a tela já havia falhado uma vez em prevenir a classe do defeito; o teste varre todas as telas de tab.

Commit: `a9846a2`.

### 2. O E2E de device validava uma tela que produção não renderizava

`ENABLE_LEARNING_ROAD` tinha default `false` e era ligada **apenas** no perfil `e2e-test` do `eas.json` e no `.env` local. Um build `preview` ou `production` renderizava a `HomeScreen` clássica, enquanto os três flows Maestro de 2026-07-26 exercitaram o `JourneyHomeScreen`.

Decisão registrada em [ADR da home de produção](../adr/ADR-2026-07-27-learning-road-como-home.md): a **Learning Road é a home oficial** e lança na v1.3. A flag passou a ser declarada em `development`, `preview` e `production`, e o default em `src/config.ts` mudou para `true` — declarar só nos perfis deixaria a mesma armadilha para builds fora do EAS.

Com isso a evidência de E2E existente volta a corresponder ao caminho de produção, mas **ainda não foi reexecutada sob um perfil que reflita produção** (ver bloqueios).

Commit: `c4122e1`.

### 3. O painel de homologação reportava sync ativo sem sync possível

`EXPO_PUBLIC_API_BASE_URL` não é definida em nenhum perfil do `eas.json`, e tanto o `SyncQueueService` quanto a tela de Progresso exigem `isApiConfigured()` além da flag. O sync remoto já era inerte em todo build; o risco de "UX quebrada por sync ligado com API 502", registrado no roadmap, era premissa falsa.

O defeito real era de honestidade: o painel exibia `Sync remoto: ativado` a partir da flag crua, o que tornaria falsa a evidência de homologação. O painel passa a mostrar o estado efetivo, e `preview` e `production` declaram `ENABLE_REMOTE_SYNC=false`.

Commit: `0bf3332`.

## Verificações nesta data

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint, typecheck, visual QA e contratos de Storybook, Maestro, easing e clearance |
| testes do app | PASS | 27 suítes; 71 testes |
| testes e build da API | PASS | sem alteração nesta data |
| contrato de documentação | PASS | executado a cada run |
| validadores do Loop | PASS | 9 de 9, em cada um dos quatro runs desta data |
| smoke público da API | FAIL esperado | `/health` e `/ready` em HTTP 502 |
| E2E iOS em device | não reexecutado | válido para a Learning Road, mas colhido sob `e2e-test` |
| E2E Android | não executado | `radiant-app/android/` continua inexistente |
| Gate 2 de acessibilidade | PARCIAL (4/5) | itens 1, 3, 4 e 5 com evidência; só o item 2 aberto |

## Planejamento de lançamento

O plano de lançamento nas lojas passou a existir nesta data:
[`docs/plans/2026-07-27-radiant-launch-roadmap.md`](../plans/2026-07-27-radiant-launch-roadmap.md).

Ele define 6 marcos (M0 contas até M5 produção) e cerca de 35 tasks priorizadas em P0/P1/P2, com os requisitos externos pesquisados nesta data: target API 36 do Play até 31/08/2026 (já atendido pelo Expo SDK 54), teste fechado de 12 testadores por 14 dias para conta pessoal, SDK do iOS 26 obrigatório desde 28/04/2026 e verificação de desenvolvedor no Brasil a partir de 30/09/2026.

Decisões registradas em ADR nesta data:

- [contas de loja](../adr/ADR-2026-07-27-store-account-strategy.md): Play pessoal e Apple individual;
- [home de produção](../adr/ADR-2026-07-27-learning-road-como-home.md): Learning Road.

## Coordenação entre múltiplas IAs

O projeto passou a ser trabalhado por várias IAs em sessões independentes. O contrato de sinalização está no [`AGENTS.md`](../../AGENTS.md), seção "Coordenação multi-IA": antes de começar, checar o que já foi feito; ao terminar, sinalizar no mesmo run que entrega o trabalho. Trabalho não sinalizado é tratado como não feito pelas próximas sessões.

## Bloqueios do app

1. **Gate 2 sem aprovação.** Item 5 (navegação por teclado) foi fechado em 2026-07-27 com a build web estática e verificação de teclado do fluxo crítico (ordem de foco, foco visível, ausência de armadilha, alvos ≥ 44px) — ver [evidência](../../radiant-app/docs/evidence/2026-07-27-accessibility-gate2-item5-keyboard.md). Resta o item 2 (anúncio único no VoiceOver), que exige humano com áudio (task B4).
2. **E2E não reexecutado sob perfil de produção.** Os três flows precisam rodar sob `preview`, que agora reflete produção, para que a evidência de device valide o que será distribuído.
3. **Android sem projeto nativo.** `expo prebuild` nunca foi executado; a matriz de smoke cobre só iOS.
4. **Nó de reward sem cobertura E2E.** O track ativo vem do catálogo (7 lições) e a conquista só destrava após a última lição.
5. **API pública inativa.** A ADR de estratégia da API continua pendente e é decisão de produto.
6. **Contas de loja inexistentes.** Apple Developer e Play Console ainda não foram criadas; é o item de maior latência do plano de lançamento.
7. ~~**`JourneyMap` com tema incorreto.**~~ Corrigido em 2026-07-27 (task B2): os componentes do mapa passaram a usar `galaxyColors` (antes usavam a paleta clara `colors` dentro da tela escura) e o ícone foi empilhado acima do texto, eliminando a quebra de rótulo no meio da palavra. Guarda estrutural em `scripts/maestro-contract.test.mjs`; verificado no build web a 375px.
8. ~~**Onboarding em instalação limpa.**~~ Investigado em 2026-07-27 (task B6): não é defeito. "Instalação limpa → Home" é o comportamento correto da Learning Road (a home recebe o usuário sem wizard). O wizard `src/app/onboarding/*` é protótipo morto (inglês, não persiste nada, só deep link) e o onboarding suave está preso à `HomeScreen` clássica morta. Recomendação: manter frictionless na v1.3 e remover ambos junto com a `HomeScreen`. Confirmação de produto pendente; nenhuma correção de runtime bloqueia o lançamento.

## Dívidas rastreadas

| Dívida | Tamanho | Observação |
| --- | --- | --- |
| warnings de lint | 54 | não bloqueiam o gate; reduzir por domínio, sem supressão global |
| achados de visual QA | 122 no baseline, 2 exceções | zero regressões; migrar tokens em vez de renovar a política |
| itens editoriais `formatNeedsReview` | 42 | precisam ser revisados, aceitos com motivo ou removidos do caminho público |
| referências absolutas em docs | 121 | apontam para o diretório do usuário; quebram para outros leitores |
| `HomeScreen` como código de rollback | 1 tela | alcançável só desligando a flag; remover depois do beta |

Sobre as referências absolutas: o contrato de documentação bane apenas o caminho de workspace **aposentado**, então a convenção atual passa no gate. A conversão para caminhos relativos é limpeza mecânica ainda não feita. Vale notar que o contrato detecta a string em qualquer contexto, inclusive quando um documento apenas menciona o caminho proibido para explicá-lo — descreva-o, não o transcreva.

## Próxima sequência sugerida

1. ~~**B3** — Gate 2 item 5: build web e navegação por teclado.~~ **Concluída em 2026-07-27.** Restou apenas o item 2 do Gate 2 (task B4), que depende de sessão humana de VoiceOver.
2. **B0.1** — reexecutar os três flows Maestro sob o perfil `preview` e registrar a evidência. Passa a ser o próximo P0 de engenharia sem dependência externa.
3. **B2** e **B5** — `JourneyMap` e cobertura E2E do nó de reward.
4. **Onda A** — contas de loja, quando a autorização financeira sair; **A4** (política de privacidade) pode ser escrita antes das contas.
5. **Onda C** — Android, a partir do `expo prebuild`.
