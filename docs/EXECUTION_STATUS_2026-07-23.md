# Radiant — Execution Status (2026-07-23)

## Status canônico atual

O Radiant é um aplicativo educacional de radiologia **local-first**. O app deve abrir, oferecer catálogo local, registrar progresso e permitir revisão mesmo quando a API remota está ausente.

A API pública conhecida em `api.radiant.ascendcreative.com.br` está **inativa** e retorna HTTP 502. Esse estado foi verificado apenas por smoke público read-only; esta execução não altera VPS, DNS, proxy, banco, deploy ou serviço remoto.

Este documento substitui afirmações de disponibilidade remota nos documentos de estado atual. Snapshots com data anterior continuam históricos e não representam garantia do estado de produção.

## Checkout e segurança

- Branch: `codex/wave1-hardening-api-smoke`
- HEAD no início desta execução: `b5b0967` (`v1.2.0`)
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

## Baseline verificado

| Verificação | Estado | Resultado |
| --- | --- | --- |
| preflight de toolchain | PASS | Node 20 e npm adjacente disponíveis |
| `radiant-app` quality | FAIL | 3 erros de lint; 60 warnings |
| `radiant-app` testes completos | FAIL | 17 suites passam; 3 suites falham; 44/47 testes passam |
| visual QA estrito | FAIL | 126 achados; 106 de alta severidade |
| `radiant-api` testes | PASS | 13 testes |
| `radiant-api` build | PASS | TypeScript concluído |
| validação editorial | PASS com dívida | 30 classificações, 7 conceitos e 42 bundles/formatações ainda requerem revisão |
| smoke local | PASS | sync de catálogo, conteúdo, rota da API e painel editorial |
| smoke remoto | FAIL conhecido | HTTP 502; não executado neste lote por ser fora do escopo local |

## Onda 1 — gates recuperados

Em 2026-07-23, a recuperação local foi concluída sem alterar nenhum recurso remoto:

| Verificação | Estado | Resultado |
| --- | --- | --- |
| `npm run quality` | PASS | lint sem erros (60 warnings legados), typecheck, teste do scanner e visual QA estrito |
| testes completos do app | PASS | 20 suites; 48 testes |
| fluxos críticos | PASS | 6 suites; 10 testes, incluindo checkpoint |
| visual QA estrito | PASS com dívida rastreada | 0 regressões; 124 achados em baseline com dono/expiração e 2 exceções de primitives de motion |

O scanner visual não declara a dívida como resolvida: `npm run visual:qa -- --audit` a lista com arquivo e linha. O baseline expira em 2026-10-23; ocorrências novas, aumento da contagem permitida ou uma política vencida falham o gate estrito.

## Bloqueios do app

1. O lint ainda registra 60 warnings legados; eles não bloqueiam o gate, mas devem ser reduzidos por domínio, sem suprimir regras globalmente.
2. A dívida visual permanece em 124 ocorrências com baseline temporal. A próxima migração deve substituir tokens e primitives em vez de renovar a política.
3. Home e Progresso ainda apresentam métricas e conteúdo de demonstração como se fossem dados reais do usuário. A próxima onda substitui isso por contratos de domínio e estados vazios honestos.

## Próxima sequência autorizada

1. Corrigir o contrato documental e tornar o status acima a referência ativa.
2. Recuperar os gates de qualidade do app.
3. Criar os serviços de domínio para Home e Progresso antes de alterar as telas.
4. Somente depois iniciar Storybook, acessibilidade, Maestro, pesquisa com usuários e experimentos de motion.
