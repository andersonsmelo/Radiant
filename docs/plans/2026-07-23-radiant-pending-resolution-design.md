# Radiant — Design para resolução das pendências restantes

**Data:** 2026-07-23  
**Estado:** aprovado para planejamento de implementação  
**Escopo:** Tasks 10–16 do roadmap de continuidade

## Entendimento confirmado

- Fechar as pendências restantes do Radiant por gates sequenciais, começando por evidência real em device.
- Instalar Maestro e preparar simulador iOS/emulador Android são ações autorizadas.
- A API permanece estritamente read-only: sem VPS, DNS, banco, deploy, restart ou outra mutação remota.
- A pesquisa com usuários fica limitada à preparação de protocolo e materiais; não haverá recrutamento ou contato com participantes.
- Figma, Rive, contrato pedagógico, observabilidade e beta serão tratados primeiro como artefatos locais e verificáveis.
- Não haverá release, publicação, coleta de PII ou envio de conteúdo clínico real a serviços externos.

## Premissas não funcionais

- **Privacidade:** não registrar ou transmitir PII, tokens ou dados clínicos reais nas evidências, testes ou materiais de pesquisa.
- **Performance:** o spike Rive só pode avançar depois de um baseline mensurável; o fallback estático deve preservar todas as funções.
- **Confiabilidade:** cada gate terá evidência própria e resultados de device serão registrados separadamente para iOS e Android.
- **Manutenção:** decisões, matrizes e evidências ficam no repositório; documentos canônicos devem distinguir fatos atuais de baselines históricos.

## Arquitetura da execução

### Gate 1 — ambiente real e Maestro

1. Verificar pré-requisitos, espaço e runtimes disponíveis.
2. Instalar o Maestro CLI de fonte oficial e criar/selecionar um simulador iOS e um emulador Android.
3. Gerar e instalar o build `e2e-test`, sem sync remoto e sem beta gate.
4. Executar os três flows existentes em ambas as plataformas.
5. Registrar build, runtime, data, artefatos e resultado no runbook.

Uma falha de ambiente deve ser marcada como bloqueio de ambiente, nunca como falha do aplicativo sem reprodução no fluxo.

### Gate 2 — acessibilidade e dívida de qualidade

1. Executar o checklist VoiceOver, TalkBack, fonte ampliada, orientação, light/dark, contraste e Reduce Motion.
2. Corrigir somente problemas reproduzíveis, com teste de regressão proporcional.
3. Reduzir warnings de lint e achados visuais por domínio; não ampliar o baseline para ocultar problemas novos.

### Gate 3 — handoff e pesquisa

1. Criar mapa de tokens com equivalentes Figma, contexto light/dark, consumidores e deprecações.
2. Criar matriz de estados para controles e cards críticos.
3. Preparar protocolo de pesquisa: objetivo, tarefas, métricas, consentimento, roteiro e regra de priorização, sem PII e sem recrutamento.

### Gate 4 — contratos e spikes de produto

1. Formalizar o contrato de ciência da aprendizagem para revisão, feedback e estados de progresso.
2. Capturar baseline de startup, FPS e memória em cenário repetível.
3. Criar o spike Rive somente sob feature flag, com fallback estático e critérios explícitos de descarte.

### Gate 5 — decisão de API e prontidão de beta

1. Fazer auditoria read-only da API e registrar um ADR com evidências, riscos e gatilhos de reativação.
2. Preparar matriz de observabilidade e checklist de beta real-device.
3. Não ativar infraestrutura, não publicar build e não iniciar beta sem autorização específica posterior.

## Critérios de saída

| Gate | Critério |
|---|---|
| Device/E2E | Os três flows Maestro passam em iOS e Android, com evidência registrada. |
| Acessibilidade | Checklist manual concluído e sem falhas bloqueantes de semântica, foco, toque ou movimento. |
| Qualidade | Nenhuma regressão de lint ou Visual QA; dívidas restantes são menores, rastreadas e justificadas. |
| Handoff/pesquisa | Tokens, estados e protocolo correspondem ao código atual e não contêm PII. |
| Rive | Baseline e comparação documentados; fallback preserva o fluxo. |
| API/beta | ADR read-only e matriz real-device/observabilidade concluídos; nenhuma mutação remota executada. |

## Riscos e contenções

| Risco | Contenção |
|---|---|
| Downloads grandes ou runtime ausente | Pré-flight de espaço e registro do bloqueio ambiental. |
| Divergência entre iOS e Android | Executar e evidenciar cada plataforma separadamente. |
| Flakiness no E2E | Usar labels/testIDs semânticos, nunca coordenadas; revisar hierarchy antes de alterar o flow. |
| Rive prejudicar performance | Feature flag, baseline e fallback obrigatório. |
| Expansão para infraestrutura remota | Limite read-only explícito; qualquer mutação exige novo plano e autorização. |

## Decision log

| Decisão | Alternativas consideradas | Motivo |
|---|---|---|
| Executar em gates sequenciais | documentação primeiro; trilhas paralelas | Evita documentar, testar ou liberar uma experiência sem prova em device. |
| Tratar Maestro como gate inicial | adiar E2E até beta | A pendência principal é evidência real do fluxo crítico. |
| Preparar pesquisa sem recrutamento | iniciar contato com participantes | Respeita o limite de autorização e evita coordenação externa prematura. |
| Manter API read-only | reativar/deployar infraestrutura | O estado remoto exige um plano operacional separado e autorização material. |
| Rive como spike isolado | integrar diretamente ao produto | Mantém o movimento opcional, mensurável e reversível. |
