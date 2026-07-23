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

## Bloqueios do app

1. Três textos JSX precisam escapar apóstrofos para o lint passar.
2. Os testes de auth, reward e checkpoint ainda descrevem contratos/mocks anteriores à UI e aos serviços atuais.
3. O scanner visual ainda confunde parte de tokens intencionais, formas circulares e animações permitidas com violações de alta severidade; sua calibração deve preceder qualquer alegação de conformidade estrita.
4. Home e Progresso ainda apresentam métricas e conteúdo de demonstração como se fossem dados reais do usuário. A próxima onda substitui isso por contratos de domínio e estados vazios honestos.

## Próxima sequência autorizada

1. Corrigir o contrato documental e tornar o status acima a referência ativa.
2. Recuperar os gates de qualidade do app.
3. Criar os serviços de domínio para Home e Progresso antes de alterar as telas.
4. Somente depois iniciar Storybook, acessibilidade, Maestro, pesquisa com usuários e experimentos de motion.
