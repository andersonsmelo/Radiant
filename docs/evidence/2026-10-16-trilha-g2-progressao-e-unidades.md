# G2: progressão e navegação por unidades — 2026-10-16

**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Objetivo:** implementar a camada de navegação/progressão de G2 da FILA 54, alinhada à conquista opcional aprovada por Anderson.  
**Base:** `codex/radiant-study-improvements`, HEAD `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`, com trabalho anterior não commitado e preservado.  
**Método:** inspeção dos consumidores de conclusão/contagem/recomendação, testes de comportamento antes da correção, persistência em AsyncStorage simulado, testes de componentes, injeções discriminantes e QA visual estático. [código] é evidência local; [usuário] é decisão explícita; [inferido] é consequência proposta.

## Comportamento implementado

[usuário] A decisão permanece: avaliação final aprovada libera a próxima unidade; conquista fica opcional. [ADR](../adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md).

[código] Composições explícitas agora marcam seus nós de conquista com `optionalForProgression`. A régua compartilhada de conclusão e os contadores de unidade/área ignoram apenas conquistas com essa marca e revisões. Lições e avaliações continuam obrigatórias, inclusive se receberem uma marca inválida por engano. Áreas sem a marca preservam as regras anteriores.

[código] O marcador é metadado do catálogo. Não altera IDs, formato do progresso ou schema de persistência. A projeção histórica do H4 sem composição explícita continua com SHA-256 `317fcdfb56a98493100bb1e2e884ca860bbf301451ce1bf25e5e447a81c5d5b8` no teste de compatibilidade.

[código] O resolver recomenda o estudo disponível antes da conquista opcional; a conquista continua coletável. Snapshot e resolução de foco consomem essa prioridade nas áreas compostas. Os testes reais dos serviços confirmam: concluir os nós obrigatórios abre a área seguinte; a projeção do currículo também a mostra aberta; coletar depois uma conquista da área anterior mantém o avanço e registra sua coleta no histórico correto.

[código] Quando houver área com várias unidades, a lista da trilha inclui marcadores de unidade com título, posição, estado e contagem pela mesma régua. O índice horizontal de unidades permite consultar inclusive uma unidade bloqueada, solicitando rolagem sem abrir atividade ou conceder acesso. O caminho mantém uma única lista vertical, chaves estáveis de nós e alternância contínua dos lados. O índice horizontal também é virtualizado.

[código] A navegação manual reinicia o orçamento de tentativas de rolagem e preserva a posição solicitada ao recuperar um destino ainda não medido. A mudança da recomendação continua centralizando o próximo nó. Percursos com uma unidade por área preservam a apresentação anterior, sem índice ou marcadores extras.

## Evidência de testes

[código] Primeiro vermelho: **quatro suítes, quatro falhas/38 passes**. A área não concluía com conquista opcional pendente; o contador exibia total 2 em vez de 1; a recomendação escolhia a conquista em vez da lição seguinte; snapshot/foco mantinham a unidade anterior.

[código] O teste de interface falhou por ausência de cabeçalhos das unidades; a implementação inicial também mostrou que declarar o papel `header` sem tornar o agrupamento acessível não satisfazia a consulta por papel. O teste final verifica identificação e navegação da unidade bloqueada, sem chamada ao handler de atividade.

[código] A recuperação de rolagem teve vermelho específico: depois de gastar três tentativas na âncora anterior, a seleção de outra unidade não tentava recuperar o destino. Esperadas seis chamadas ao pedido de rolagem; recebidas cinco. O novo teste confirma uma tentativa adicional e posição 0 para o cabeçalho selecionado.

[código] **Quatorze mutações detectadas por falha de asserção**, cada uma com âncora única e restauração em `finally`: remoção da opcionalidade na conclusão; dispensa indevida de lição; denominador antigo; perda do marcador no snapshot; foco antigo; ausência do marcador no compositor; ausência de identificação de unidades; destino incorreto no índice; orçamento de recuperação não reiniciado; posição incorreta na recuperação; busca da conquista na área errada; contexto perdido em setCurrentNode; fallback indevido para outro ID; texto de desbloqueio incompatível com opcionalidade. A primeira execução do controlador classificou uma falha válida de mock como erro de detecção por uma expressão muito restrita; o controlador foi corrigido e as dez mutações originais foram reexecutadas com resultado registrado, seguidas das quatro da tela de conquista. Erros de infraestrutura não contam como detecção.

[código] Verde final focado: **onze suítes/141 testes** — `JourneyTrail`, `JourneyUnitNavigation`, `trackCompletion`, `JourneyUnitProgress`, `NextNodeResolver`, `JourneyRecommendationService`, `JourneyProgressService`, `JourneyCurriculumService`, `ProductionCatalogComposition`, `ProductionCurriculumCatalog` e `RewardScreen.flow`. Typecheck e lint dos módulos passaram. O QA visual estrito examinou 403 arquivos: 60 ocorrências, das quais 57 na baseline, três exceções autorizadas e **zero regressões**.

[código] Os testes de componentes isolam o ícone decorativo para não testar o carregamento assíncrono de fonte nativa junto à navegação. Os avisos de nó bloqueado/desconhecido são dos testes negativos preexistentes do progresso. Não houve supressão de erros do produto.

Reproduzir na raiz com PATH do Node 20:

```bash
node radiant-app/node_modules/jest/bin/jest.js --config radiant-app/jest.config.cjs --runInBand radiant-app/src/features/journey/components/JourneyTrail.test.tsx radiant-app/src/features/journey/components/JourneyUnitNavigation.test.tsx radiant-app/src/features/journey/services/trackCompletion.test.ts radiant-app/src/features/journey/services/JourneyUnitProgress.test.ts radiant-app/src/features/journey/services/NextNodeResolver.test.ts radiant-app/src/features/journey/services/JourneyRecommendationService.test.ts radiant-app/src/features/journey/services/JourneyProgressService.test.ts radiant-app/src/features/journey/services/JourneyCurriculumService.test.ts radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.test.ts radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx
node scripts/qa/trilha-structural-inventory.cjs --check
```

[código] Inventário remedido: schema 3, quatro trilhas/30 resumos, zero violações de grafo e referências. O registro real continua com um lote/uma unidade; não houve nova configuração curricular ou conteúdo ativado. As fixtures de composição continuam testando 100 unidades em memória, sem benchmark nativo.

## Coleta por destino — correção da interface

[código] A conferência de `RewardScreen` revelou que a tela ainda chamava bootstrap da área ativa. Dois testes falharam: não buscava a conquista da área anterior por ID e, diante de um ID inexistente, oferecia outra recompensa disponível. A tela passou a usar `getSnapshotForNode`, conserva a definição da área em `setCurrentNode` e recusa substituir um destino explícito desconhecido. O texto opcional deixa de afirmar que a coleta abre etapas; a regressão textual também foi vista falhando antes da correção.

[código] O primeiro run (`run-1792194415411-677a7c7a`) foi fechado sem validação integral porque seu escopo imutável não incluía a tela. Nenhuma alteração foi desfeita. O run substituto declara a união completa, valida a árvore final e é a referência de conclusão. Uma execução focada que se sobrepôs à injeção temporária na tela foi descartada como medição do estado final; o verde final foi executado sequencialmente após todas as restaurações.

## Gate e continuidade

Run: `run-1792194941402-0eed2a97`. Gate integral e estado final por `loop run status --run run-1792194941402-0eed2a97`. Fechamento: `validate → step finish → memória validada → run close`. Sessão `brain-session-1792194324689-c5fd2849` fechada separadamente antes do validador que reentra no cérebro.

[código] Não houve nova build, execução em simulador/aparelho, VoiceOver, Android, publicação, ativação V3, push ou merge. O QA visual citado é estático, não inspeção de pixels. A qualidade de uso nativo do novo índice e dos marcadores permanece a validar antes da ativação de áreas compostas.

[inferido] A próxima frente de implementação global é G3: generalizar o contrato editorial ainda específico do H4, preservando proveniência e os seis gates. P1/FILA 50 continua na experiência legada. G2 ainda precisa de avaliação nativa do mapa e das decisões curriculares de conteúdo; o programa completo G0–G8 não está encerrado.

## Fontes locais consultadas em 2026-10-16

- [Marcador de composição](../../radiant-app/src/features/student-checkpoints/ProductionCatalogComposition.ts) e [tipos](../../radiant-app/src/types/journey.ts).
- [Conclusão compartilhada](../../radiant-app/src/features/journey/services/trackCompletion.ts), [contagem](../../radiant-app/src/features/journey/services/JourneyUnitProgress.ts), [resolver](../../radiant-app/src/features/journey/services/NextNodeResolver.ts) e [recomendação/foco](../../radiant-app/src/features/journey/services/JourneyRecommendationService.ts).
- [Trilha](../../radiant-app/src/features/journey/components/JourneyTrail.tsx), [índice de unidades](../../radiant-app/src/features/journey/components/JourneyUnitNavigation.tsx) e [teste de interface](../../radiant-app/src/features/journey/components/JourneyTrail.test.tsx).
- [Integração de progresso/currículo](../../radiant-app/src/features/journey/services/JourneyProgressService.test.ts) e [testes de compatibilidade](../../radiant-app/src/features/student-checkpoints/ProductionCurriculumCatalog.test.ts).
- [Tela e roteamento de conquista](../../radiant-app/src/features/rewards/screens/RewardScreen.tsx) e [teste de fluxo](../../radiant-app/src/features/rewards/screens/RewardScreen.flow.test.tsx).
- [Entrega anterior preservada](2026-10-16-trilha-cobertura-e-multiunidade.md).
