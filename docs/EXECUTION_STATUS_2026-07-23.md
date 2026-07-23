# Radiant — Execution Status (2026-07-23)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app deve abrir, oferecer catálogo local, registrar progresso e permitir revisão mesmo quando a API remota está ausente.

A API pública conhecida em `api.radiant.ascendcreative.com.br` está **inativa** e retorna HTTP 502. Esse estado foi verificado apenas por smoke público read-only; esta execução não altera VPS, DNS, proxy, banco, deploy ou serviço remoto.

Este documento substitui afirmações de disponibilidade remota nos documentos de estado atual. Snapshots com data anterior continuam históricos e não representam garantia do estado de produção.

## Checkout e segurança

- Branch: `codex/wave1-hardening-api-smoke`
- HEAD atual: `25667b1` (`test: cover the local-first learning path on device`)
- Commits desta continuação: `3942714` → `25667b1`.
- O checkout contém materiais não rastreados preservados: `Mascote.png`, `New Layout/`, `docs/NOVO_VPS.md` e o plano histórico de design.
- As mudanças desta execução não adicionam, removem ou modificam esses materiais.
- O trabalho segue no checkout existente para não criar um worktree que os omita silenciosamente.

## Toolchain reproduzível

O `node` padrão não está disponível no `PATH` da sessão. O runtime aprovado do repositório é:

```bash
export PATH="/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH"
node scripts/qa/toolchain-preflight.mjs
```

Resultado confirmado:

- Node `v20.20.2`
- npm `/Users/anderson/.nvm/versions/node/v20.20.2/bin/npm`

## Baseline histórico capturado no início

| Verificação | Estado | Resultado |
| --- | --- | --- |
| preflight de toolchain | PASS | Node 20 e npm adjacente disponíveis |
| `radiant-app` quality | FAIL histórico | 3 erros de lint; 60 warnings |
| `radiant-app` testes completos | FAIL histórico | 17 suites passam; 3 suites falham; 44/47 testes passam |
| visual QA estrito | FAIL histórico | 126 achados; 106 de alta severidade |
| `radiant-api` testes | PASS | 13 testes |
| `radiant-api` build | PASS | TypeScript concluído |
| validação editorial | PASS com dívida | 30 classificações, 7 conceitos e 42 bundles/formatações ainda requerem revisão |
| smoke local | PASS | sync de catálogo, conteúdo, rota da API e painel editorial |
| smoke remoto | FAIL conhecido | HTTP 502; não executado neste lote por ser fora do escopo local |

## Estado atual — ondas 0 a 2 concluídas

Em 2026-07-23, a recuperação local foi concluída sem alterar nenhum recurso remoto:

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint sem erros; typecheck; visual QA; contratos de Storybook e Maestro |
| testes completos do app | PASS | 27 suítes; 71 testes |
| lint | PASS com dívida rastreada | 54 warnings legados; 0 erros |
| visual QA estrito | PASS com dívida rastreada | 0 regressões; 122 achados no baseline e 2 exceções delimitadas |
| Home e Progresso | PASS | view models locais substituem métricas e missões fictícias por estados honestos |
| tokens semânticos | PASS | contextos light/galaxy, contraste testado e componentes-base migrados |
| Storybook | PASS | entrypoint isolado e opt-in; 4 componentes críticos com histórias de estado |
| acessibilidade | PASS parcial | semântica, busy/disabled/selected, foco e preferência de movimento cobertos em código e testes; checklist manual ainda pendente |
| Maestro | PASS estático | três fluxos locais, perfil `e2e-test` e contrato versionado; execução em device ainda pendente |

O scanner visual não declara a dívida como resolvida: `npm run visual:qa -- --audit` a lista com arquivo e linha. O baseline expira em 2026-10-23; ocorrências novas, aumento da contagem permitida ou uma política vencida falham o gate estrito.

## Bloqueios do app

1. O lint registra 54 warnings legados. Eles não bloqueiam o gate, mas devem ser reduzidos por domínio, sem suprimir regras globalmente.
2. A dívida visual permanece em 122 ocorrências no baseline temporal e 2 exceções delimitadas. A próxima migração deve substituir tokens e primitives em vez de renovar a política.
3. A validação real de acessibilidade (VoiceOver, TalkBack, fonte ampliada e orientação) ainda não foi executada em dispositivo.
4. O Maestro CLI não está instalado e não há simulador iOS nem emulador Android disponível neste checkout. Os fluxos estão versionados, mas nenhum PASS de dispositivo é declarado.
5. A API pública conhecida permanece inativa; nenhuma reativação remota foi tentada.

## Próxima sequência autorizada

1. Instalar/autorizar um ambiente Maestro e executar os três fluxos em simulador iOS e emulador Android, registrando a matriz em [`radiant-app/docs/E2E_RUNBOOK.md`](../radiant-app/docs/E2E_RUNBOOK.md).
2. Executar o checklist manual de acessibilidade em [`radiant-app/docs/ACCESSIBILITY_QA_V1.md`](../radiant-app/docs/ACCESSIBILITY_QA_V1.md).
3. Preparar o handoff Figma e a governança do design system a partir dos tokens e histórias já entregues.
4. Só então iniciar pesquisa com usuários, experimento Rive e qualquer decisão de infraestrutura remota.
