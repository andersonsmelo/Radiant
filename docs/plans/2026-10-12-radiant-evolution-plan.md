# Radiant — levantamento e plano de evolução

**Data:** 2026-10-12 · **baseline de código:** `550c70e`, branch `codex/radiant-study-improvements`, árvore limpa antes da abertura do run.  
**Estado do documento:** proposta de programa, pronta para avaliação. Anderson escolheu como foco da primeira entrega **experiência de estudo: layout, Pixel e uma unidade piloto**. Isso não aprova automaticamente desenhos, conteúdo novo, dependências, coleta de dados ou publicação.

**Objetivo:** tornar o estudo claro, agradável e útil, demonstrando aprendizagem numa unidade pequena antes de ampliar o catálogo e a oferta comercial.  
**Arquitetura preservada:** aplicativo local-first; correção e progresso determinísticos; autoria assistida por IA com revisão humana; serviços externos fora do caminho necessário para estudar.  
**Stack medida:** Expo `~54.0.32`, React Native `0.81.5`, Reanimated `~4.1.1`, `expo-audio`, New Architecture; StoreKit por módulo Expo local.  
**Base de requisitos:** [pesquisa consolidada](../RESEARCH_DECISIONS.md), [fluxo existente](../CLIENT_FLOW.md), [PRD](../PRD.md), [spec do piloto híbrido](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md) e [contrato V3](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md).

## 1. Como usar este plano

Este levantamento é uma fotografia datada, não outro documento de estado vivo. Estado operacional continua em [STATUS](../STATUS.md), trabalho executável em [FILA](../FILA.md) e gates de lançamento no [roadmap ativo](2026-07-27-radiant-launch-roadmap.md). Decisões aprovadas continuam nas specs e ADRs existentes.

O programa abaixo organiza propostas em pacotes. Antes de implementar cada pacote: reconciliar o código atual, escrever ou atualizar sua spec, fechar as decisões pendentes, definir arquivos e testes, abrir um run próprio e produzir uma entrega pequena e revisável. Não executar todos os pacotes num único run. A aprovação do foco não autoriza release nem a ativação do currículo V3.

## 2. O que temos, com qual evidência

O código foi inspecionado nesta baseline. Resultados anteriores de testes e de loja são atribuídos à sua evidência histórica; não foram todos reproduzidos neste levantamento. Estado externo de loja depende de nova consulta antes de uma ação de release.

| Camada | Base encontrada | Implicação para o planejamento |
| --- | --- | --- |
| Publicação iOS | STATUS registra `1.4.0 (12)` liberada no Brasil em 2026-10-12, às 08:47; binário `221e2ec`, com assinatura e backup. [Evidência](../evidence/2026-10-12-radiant-liberacao-1-4-0.md). | O app aberto em desenvolvimento e a versão publicada têm conjuntos de mudanças diferentes. |
| Melhorias locais | `a366295`: reforço V2 persistente, recomendação de conquista e data/hora da revisão. [Validação e E2E](../evidence/2026-10-12-itens-36-39-27.md). Ainda fora da `main`/loja nesta fotografia. | Integrar e validar esses itens; não implementá-los novamente. |
| Catálogo legado | `src/data/catalog.ts`: três trilhas, com 7 + 6 + 5 = **18 lições**. Fundamentos de Radiologia; Radiação, Modalidades e Equipamento; Prática, Qualidade e Profissão. | É oferta existente; quantidade não demonstra qualidade ou adequação ao público. |
| Unidade V2 | `ProductionCurriculumCatalog` e `production-batches`: **12 atividades**, cinco avaliações por etapa e uma conquista em “Matéria, energia e radiação”. | Base real para medir aprendizado, reforço e continuidade. Não somar avaliações como lições. |
| Currículo V3 | Oito arcos definidos; `getPublishableManifest()` retorna `null`. | Oito arcos planejados não significam oito arcos disponíveis ao aluno. |
| Piloto híbrido L1 | Tela, sessão, métricas locais e 20 itens de amostra existentes; `L1_TEMPLATE_APPROVAL = null`. | Depende da confirmação dos oito itens alterados (FILA 7b/15). A L2 v7 continua aguardando o resultado do piloto. |
| Jornada e interface | Estude + Perfil; recomendação de próximo passo, revisão, progresso, conquistas e missões. `JourneyTrail` já usa `FlatList` virtualizada. | Melhorar hierarquia e compreensão. Não propor virtualização como recurso ausente. |
| Pixel e feedback | Ilustração raster, rosto separado e estados Reanimated; seis sons e preferências de feedback. Redução de movimento já contemplada. | Evoluir identidade e contratos existentes; não começar outro personagem do zero. Sem Rive/Lottie no pacote medido. |
| Monetização | StoreKit, compra/restauração e estados de assinatura existentes. Contrato aprovado: todo conteúdo gratuito; assinatura oferece vidas ilimitadas. | Novo benefício premium é hipótese de produto e exige decisão; preservar direitos já adquiridos. |
| Dados e continuidade | Progresso local e backup iCloud. Histórico das tentativas V2 fica fora do backup. Sincronização remota desativada, sem URL de API na produção. | App precisa continuar útil offline. Validar o que é e o que não é restaurado; não prometer backup integral. |
| Lembretes | Flag de push **ativa no perfil production**, mas `src/config/push.ts` fixa `PUSH_SHADOW_MODE: true`; serviço registra intenção, sem agendar notificações reais. | Infraestrutura existente não significa entrega ativa. Avaliar autorização, frequência e privacidade antes de sair do modo shadow. |
| Observabilidade | Sentry com minimização de dados; adaptador de analytics de produto `noop`. | Há diagnóstico técnico, mas não há prova de funil, retenção ou conversão real. Não fabricar baseline. |
| Android | STATUS registra `1.3.0 (4)` em teste fechado, medição de 2026-08-24 vencida. Contagem de participantes também requer atualização no console. | Abrir frente de paridade e gates administrativos; não declarar Android lançado. |

A contagem do catálogo foi obtida executando somente módulos TypeScript de definição com o `tsx` já instalado na API, no Node 20. Não leu progresso pessoal nem mediu disponibilidade por perfil, consumo de aulas ou usuários ativos.

### Lacunas que precisam de medição

- Não temos, nesta evidência, entrevistas representativas com estudantes brasileiros de radiologia, retenção real, taxa de conversão ou motivo de cancelamento.
- Layout atual precisa de auditoria visual nas telas completas, texto ampliado e aparelho pequeno; captura isolada não prova contraste ou acessibilidade.
- Uso de CPU no simulador não mede bateria. Calor e VoiceOver das avaliações precisam de evidência no aparelho (FILA 14 e pendência de acessibilidade).
- `rating-prompt.yaml` permanece pendente: o quiz deixou de chamar a avaliação da loja; a correção precisa usar revisão/conquista, preservando a separação entre avaliar a aula e avaliar o app (FILA 38).
- Não há build, benchmark ou teste de campo de Rive, Lottie ou voz no Radiant.

## 3. Direção de produto e alternativas

**Proposta de valor a testar:** “Pratique fundamentos de radiologia em sessões curtas, entenda seus erros e veja o que já consegue aplicar.” A animação deve ajudar a orientar e reconhecer esforço; acerto pedagógico vem da atividade e da explicação revisada.

| Estratégia | Ganho esperado, ainda hipótese | Custo e risco | Escolha |
| --- | --- | --- | --- |
| Uma experiência completa numa unidade | Permite avaliar clareza, prazer de uso e aprendizagem juntos; aproveita piloto existente. | Exige design, aprovação editorial e teste com alunos antes de expandir. | **Primeiro foco escolhido por Anderson.** |
| Aumentar catálogo primeiro | Pode ampliar cobertura percebida. | Multiplica revisão e conteúdo potencialmente maçante; não resolve a experiência nem prova demanda. | Depois do piloto. |
| Alterar premium primeiro | Pode tornar valor comercial mais explícito. | Sem evidência de valor/uso, pode restringir estudo e quebrar o contrato aprovado. | Pesquisa comercial em paralelo; implementação depois dos gates. |

Público inicial proposto: estudantes e profissionais em formação técnica/tecnológica de radiologia no Brasil. Confirmar segmento, objetivo e contexto nas entrevistas. Não extrapolar relatos de residentes de outros países para esse público.

Preservar: trilha orientada por competências; revisão espaçada; avaliações com exigência de segurança; retorno ao ponto de estudo; funcionamento offline; privacidade; acessibilidade. Não reintroduzir os 15 checkpoints antigos de botão removidos por decisão, nem promover conteúdo já aprovado para uma nova revisão sem motivo específico.

## 4. Experiência da primeira unidade

O recorte usa o piloto híbrido L1 existente. O desenho é candidato, a ajustar contra a spec vigente e aprovar antes de mudar sua estrutura.

1. **Entrada:** um próximo passo principal, objetivo em linguagem simples, duração estimada explicitamente aproximada e acesso compreensível às revisões.
2. **Aprender:** explicação curta com imagem/esquema que ensina um conceito; texto como canal completo. Vídeo apenas se a demonstração precisar de movimento e tiver alternativa acessível.
3. **Tentar:** prática guiada com explicação; na avaliação, resposta independente e regras pedagógicas existentes. Evitar dar pistas que invalidem a avaliação.
4. **Receber retorno:** resposta visual imediata ao toque; resultado e motivo do erro claros. Pixel reage de forma breve. Som/voz optativos, sem bloquear a próxima ação.
5. **Consolidar:** recuperar o conceito em uma situação diferente, sem depender de decorar a posição da alternativa. Erro crítico não pode ser compensado por XP ou animação.
6. **Sair sabendo o próximo passo:** mostrar o que foi aprendido, revisão e disponibilidade quando aplicáveis; progresso e recompensa continuam sujeitos ao contrato real.

**Três telas para o primeiro desenho:** Estude, atividade/feedback e conclusão. Perfil/configurações entra como ajuste de apoio, não uma nova aba obrigatória. Prototipar também estados de erro, pausa, revisão futura, ausência de vidas e assinatura.

## 5. Pacotes, ordem e critérios de saída

“Agora/próximo/depois” indica a ordem proposta, não compromissos de prazo. Capacidade assumida: uma frente de implementação por vez e revisão editorial separada; confirmar disponibilidade antes de calendarizar. Anderson é decisor de produto e realiza as validações pessoais indicadas; o agente produz código/documentos/evidências; parecer clínico/editorial precisa de revisor designado, sem inventar equipe.

| ID / ordem | Entrega e responsabilidade | Dependências | Critério verificável de saída |
| --- | --- | --- | --- |
| **E0 · agora** | Agente: baseline e fechamento dos riscos de fluxo/release; Anderson: aparelho e consoles. Incorporar itens locais 36/39/27 pelo fluxo de revisão vigente, corrigir E2E 38, medir calor/VoiceOver. | Ambiente de testes provisionado; autorização específica antes de merge/publicação. | Evidência por SHA e plataforma; review prompt alcançado pela rota correta; nenhuma cobrança duplicada de vida; três melhorias existentes preservadas. Falhas abertas classificadas e release separado. |
| **E1 · agora** | Agente + Anderson: auditoria das três telas, tokens, hierarquia e protótipo. Ajuste de configurações do Perfil ligado à FILA 32. | Baseline E0; objetivo/público confirmados. Pode desenhar enquanto os gates externos seguem abertos. | Protótipo com estados reais, texto ampliado e modo de movimento reduzido; Anderson aprova direção visual; alunos conseguem identificar objetivo e próxima ação. Spec aprovada antes de implementar. |
| **E2 · agora** | Anderson/revisor: confirmação editorial 7b; agente: registrar aprovação 15 e preparar piloto L1. | Aprovação vinculada ao conteúdo/fingerprint exatos. Preservar a spec híbrida existente. | Amostra conferida, consentimento/roteiro e dados locais definidos; piloto com 3–5 participantes executado; achados registrados, incluindo abandono e erros. Nenhuma ativação geral de V3. |
| **E3 · próximo** | Agente: experiência do Pixel e protótipo de voz offline; Anderson avalia acabamento e áudio. Coordenação com animação de vida FILA 26. | Desenho E1 e contrato pedagógico E2. Comparar primeiro com Reanimated existente; Rive é experimento opcional. | Estados neutro/atenção/acerto/erro/conclusão/interrupção; áudio optativo e interrompível; não sobrepõe sons nem anuncia vida duas vezes; build própria, offline, acessibilidade e desempenho aprovados. |
| **E4 · agora → próximo** | Agente: protocolo local de pesquisa e métricas; Anderson decide eventual analytics externo. | Inspecionar e reutilizar `HybridLessonMetricsRepository`; decisão de dados antes de novo coletor. | Dicionário com denominadores/janelas e roteiro de observação; dados mínimos e exportação revisável. Coleta externa só após spec de privacidade e declarações de loja. |
| **E5 · próximo** | Agente + revisor: iterar a unidade e só então retomar L2 v7/Arco 1 (FILA 22). | Resultados E2/E3/E4; ausência de achados críticos; gate editorial existente. | Aprendizagem em itens novos e revisão posterior documentada; problemas graves corrigidos; decisão registrada de avançar, repetir piloto ou reduzir escopo. |
| **E6 · depois** | Anderson + agente: validar valor premium e, se aprovado, desenhar evolução da assinatura. | Valor da unidade demonstrado, entrevistas e dados de uso disponíveis; ADR comercial nova se contrato mudar. | Benefício, preço, limite gratuito e direitos do assinante explícitos; testes de compra/restauração/expiração aprovados antes de release. Intenção declarada não contada como compra. |
| **E7 · depois** | Agente + revisor: ampliar autoria assistida por IA e fila editorial. | Formato validado em E5, direitos e fontes aprovados; orçamento por unidade. | Uma segunda unidade passa pelo pipeline completo com histórico de revisão, versão e custo medidos; promoção humana; nenhuma publicação automática por IA. |
| **E8 · transversal** | Agente: paridade/SDK; Anderson: Play Console, participantes e aparelhos. FILA 6/21 e gates Android do roadmap. | Nova medição do Play; compatibilidade nativa; conferir exigências oficiais antes da migração. | Matriz iOS/Android com evidência, validação de módulos/assinatura/backup e release candidato. Migração antes do prazo registrado no item 21; não deixá-la esperando monetização. |
| **E9 · após gates** | Agente prepara candidato e materiais; Anderson decide release/campanha. FILA 37 para capturas e apresentação comercial. | E0 e gates do pacote que será publicado; E8 conforme plataforma; declarações consistentes. | Screenshots e copy mostram recurso real; release revisado por SHA; checklist de loja e plano de recuperação; acompanhamento de qualidade e valor com coleta autorizada. |

Dependências centrais: `baseline/preflight E0 → implementação E1`; `aprovação 7b → preparação E2`; `E1 + contrato/preparação E2 → E3`; `resultados E2 + E3 + E4 → E5`; `E5 → E6/E7`. A preparação E2 não exige que o piloto já tenha terminado para prototipar E3. **E8 corre em paralelo desde o início.** E9 pode distribuir uma melhoria pequena antes de E6/E7, desde que cumpra seus próprios gates, incluindo fechamento das pendências E0 aplicáveis. O piloto atual pode ser observado antes de um redesign; não precisa esperar Rive ou uma nova assinatura.

### Primeiro ciclo: entregas prontas para discussão

- [ ] Reconciliar STATUS/FILA/branch e registrar baseline; decidir quais melhorias locais entram no primeiro candidato, sem refazê-las.
- [ ] Capturar Estude, atividade e conclusão na mesma build, num aparelho pequeno e no alvo principal; anotar problemas com tarefa, gravidade e evidência.
- [ ] Conduzir entrevistas sobre último estudo real, dificuldade, objetivo, formato usado e motivo de desistência. Perguntas neutras; não perguntar apenas se gostaram do Pixel.
- [ ] Produzir protótipo das três telas e especificar ordem de foco, estados, feedback, estilos e tamanhos. Critério de revisão: clareza do próximo passo e legibilidade, além da aparência.
- [ ] Fechar a confirmação editorial da amostra L1 existente com Anderson; se pendente, continuar design, mas não realizar piloto pedagógico como se estivesse aprovado.
- [ ] Escrever protocolo do piloto: 3–5 participantes do segmento, sessão observada, prática com itens aprovados, conversa final e **R1 no dia seguinte**, conforme §5.4 da spec vigente. Recuperação adicional em 48–72 h é extensão candidata, sujeita à aprovação; não substitui R1. Builds internas/TestFlight dependem da autorização específica prevista na spec.
- [ ] Definir matriz comparável do Pixel: versão atual; animação refinada sem voz; mesma animação com voz. Pilotar versões em sessões separadas e registrar ordem; comparação qualitativa, sem alegar A/B conclusivo.
- [ ] Fechar spec da primeira implementação com arquivos, critérios e testes; abrir execução apenas após as decisões de design/conteúdo correspondentes.

**Saída do ciclo:** desenho aprovado, conteúdo autorizado para piloto, protocolo executável e pacote de implementação delimitado. Participantes, prazos e orçamento ainda dependem da disponibilidade de Anderson e dos alunos; não há data de conclusão inventada.

### Marcos de revisão e limite de escopo

| Marco | Resultado apresentado a Anderson | Decisão |
| --- | --- | --- |
| M1 | Auditoria + protótipo das três telas + estados e orçamento do primeiro recorte. | Aprovar desenho, pedir ajustes ou reduzir escopo. |
| M2 | Uma L1 autorizada para piloto, implementação candidata e Pixel na versão escolhida, com testes pertinentes. | Liberar apenas o piloto controlado se os gates técnicos/editoriais estiverem verdes. |
| M3 | Relatório com participantes, tarefas, erros, pausas, compreensão, itens novos e R1 no dia seguinte. | Revisar resultados; retomar L2 somente se cumprir integralmente a §5.4 vigente; decidir separadamente release da melhoria visual. |
| M4 | Segunda unidade revisada e custo real do pipeline; proposta premium baseada em evidência. | Aumentar produção e/ou aprovar experimento comercial. |

Limite do primeiro candidato: três telas, **uma L1**, uma versão aprovada do Pixel e poucos clipes opcionais. Não inclui oito arcos prontos, novo backend, chatbot, redesign de todo o Perfil ou alteração da assinatura. Se houver pressão de prazo/custo, retirar voz e runtime novo primeiro; preservar correção, acessibilidade e revisão editorial.

Para apresentar resultados em M3: obter ao menos três sessões válidas e a R1 prevista; reportar faltas de retorno, sem substituí-las silenciosamente. Zero achado crítico aberto de conteúdo, segurança, perda de progresso ou acessibilidade no caminho testado. Barreiras repetidas precisam de correção e nova observação. Esses critérios habilitam revisão, **não substituem o gate de expansão** da [§5.4 aprovada](../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md#54-teste-com-pessoas-e-critério-para-escalar): ≥4/5 terminam sem ajuda e fariam a próxima; mediana de duração 3–5 min e de satisfação ≥4; acerto no desafio 75–90%; ninguém sem vidas ou sem entender o erro. Três participantes não comprovam metas com denominador cinco; completar a amostra exigida antes de declarar esse gate aprovado. Falhou: ajustar e testar com outras pessoas antes de produzir L2/L3. A amostra **não certifica eficácia educacional ou comercial**. Anderson e revisor registram a decisão e a evidência correspondente.

## 6. Escopo técnico por pacote

Os caminhos abaixo são alvos de inspeção/possível alteração, não uma autorização para editar todos. O plano de execução de cada pacote precisa declarar exatamente o que tocará, inclusive artefatos gerados. Reutilizar interfaces e testes existentes; não transferir persistência ou compra para componentes visuais.

| Pacote | Arquivos e donos de comportamento | Contratos a preservar |
| --- | --- | --- |
| E0/E1 | `radiant-app/src/features/journey/screens/JourneyHomeScreen.tsx`, `components/JourneyTrail.tsx`, `JourneyNodeCard.tsx`, `JourneyStageHeader.tsx`; `src/features/profile/screens/ProfileScreen.tsx`; `src/ui/theme.ts`, `styles.ts`; `radiant-app/.maestro/rating-prompt.yaml`. | Recomendação decide na camada de jornada; chave/estado de nós estáveis; revisão futura não se torna executável por copy; avaliação da loja fora do quiz. |
| E2/E5 | `radiant-app/src/features/curriculum-v3/hybrid-l1/{HybridLessonScreen,HybridLessonSession,HybridLessonMetricsRepository,l1TemplateApproval}.ts*`; `src/features/lesson-flow/screens/LessonFlowScreen.tsx`; `src/features/student-checkpoints/{ProductionCurriculumCatalog,AssessmentAttemptRepository,production-batches}.ts`. | Distinguir prática guiada de avaliação; fingerprint editorial; roteamento não muda as regras do destino; reforço realmente refeito após reprovação; terceira falha leva ao apoio previsto, sem fabricar SLA humano. |
| E3 | `radiant-app/src/ui/characters/{PixelIllustration,PixelFace}.tsx`, `pixelAssets.ts`, `pixelExpressions.ts`; `src/ui/feedback/{lessonFeedback,lessonSounds,feedbackPreferences}.ts`; `radiant-app/assets/`; pacote/lockfile somente se experimento nativo aprovado. | Resultado da atividade determina estado do personagem; gesto/áudio nunca determina aprovação. Desmontagem/background cancela reprodução e callbacks. |
| E4 | `radiant-app/src/features/telemetry/{TelemetryService,telemetry.types,sanitizeTelemetryProps,bootstrap}.ts`, `adapters/ProductAnalyticsAdapter.ts`; métricas locais do híbrido. | Collector atual noop não mede funil. Não coletar respostas livres, imagens médicas, nomes ou transcrições. Dados de suporte seguem canal próprio. |
| E6 | `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`, `SubscriptionService.ts`, `StoreKit2Adapter.ts`; `radiant-app/modules/radiant-storekit/`. | Apple é fonte da assinatura; compra pendente não concede benefício; restauração/expiração; retorno da assinatura não reinicia tentativa em andamento. |
| E7 | `scripts/content/{production-batch,validate-media-manifest,validate-source-rights,sync-catalog-to-app}.mjs`; `tools/editorial-panel/lib/production-batches.ts`; fontes e manifests pelos caminhos reais do disco. | Não editar catálogo gerado manualmente; direitos/proveniência/anonimização; revisão independente do material clínico; promoção humana. |
| E8/E9 | `radiant-app/{package.json,package-lock.json,app.json,eas.json}`, módulos/plugins nativos, `.github/workflows/radiant-app-quality.yml`, docs/runbooks e flows Maestro pertinentes. | Node 20 no app; Node 24 no Loop. Inspecionar escopo antes de prebuild: `ios/android` gerados e exclusões têm regras próprias. |

### Pixel e IA: escolha por evidência

Começar refinando os estados Reanimated já disponíveis. Se isso não alcançar os gestos desejados, executar spike Rive em build própria; seguir os requisitos de RN/Expo/Nitro e runtime identificados na [pesquisa](../RESEARCH_DECISIONS.md#pixel-animação-voz-e-ia), reconferidos antes da instalação. Não instalar `latest` de Lottie: a versão atual pesquisada requer RN superior ao do app. Não instalar dois runtimes para resolver o mesmo experimento.

IA pode ajudar a criar variações visuais, rig, scripts de integração e clipes PT-BR. A produção deve guardar ferramenta/modelo/data, texto, licença/direitos, duração, tamanho e aprovação. Se houver voz, começar por poucos clipes genéricos de orientação, sem informação clínica variável; explicações específicas só com revisão editorial. Texto sempre disponível. O aluno não envia seus dados para gerar cada reação.

Aceitar runtime novo somente se: identidade aprovada por Anderson; integração nativa iOS/Android comprovada; replay/interrupção/offline funcionando; impacto de tamanho/startup/CPU/memória medido contra a mesma baseline. Sem ganho visual suficiente ou com regressão, manter Reanimated. MCP/editor de autoria fica no ambiente de produção de assets, não no runtime do aluno. Não há necessidade de chatbot ou LLM em tempo real nesta primeira entrega.

## 7. Pesquisa, métricas e decisões

Piloto de 3–5 pessoas encontra problemas e linguagem; não prova aumento de retenção ou conversão. Separar observação, resultado pedagógico, intenção declarada e comportamento real. Não importar percentuais do Duolingo/Brilliant como metas previstas do Radiant.

| Pergunta | Medida proposta e definição | Uso da evidência |
| --- | --- | --- |
| A entrada é compreensível? | Pessoas que iniciam a atividade correta sem ajuda / pessoas que recebem a tarefa, com tempo e intervenções registrados. | Se duas pessoas enfrentarem a mesma barreira, revisar o desenho antes de ampliar o piloto. Qualquer barreira grave de acessibilidade bloqueia o fluxo afetado. |
| A sessão é agradável e viável? | Conclusões / sessões iniciadas; tempo ativo, pausas e ponto de saída. Entrevista pós-sessão separada da nota de aprendizado. | Meta de duração 3–5 min é hipótese; não cortar explicação essencial para atingir o relógio. |
| Houve aprendizagem? | Acertos / itens válidos de pré e pós em formas equivalentes aprovadas; erros críticos separados; recuperação em situação nova na janela pré-definida. | Itens de transferência e retenção precisam de aprovação editorial antes do teste. Acertar pergunta repetida não basta. |
| Pixel ajuda ou distrai? | Interrupções, compreensão do feedback, preferência e desconforto por versão; voz desligada e motivo. | Escolher presença/voz pelo conjunto de observações, não pelo entusiasmo inicial apenas. |
| O aluno retorna? | Para eventual coleta autorizada: D1/D7/D14 = alunos da coorte que fazem atividade significativa no respectivo dia local / alunos com primeiro valor na data da coorte. Excluir coortes cuja janela ainda não fechou. | Reportar N, período, fuso e regras de duplicação. Abriu o app não significa estudou. Sem collector, não há essa medição hoje. |
| O benefício premium interessa? | Entrevistas com motivo, alternativa atual e reação à oferta; depois, compras confirmadas / pessoas elegíveis expostas à oferta, em janela definida. | Não somar sandbox/testes como clientes; não tratar clique ou intenção como receita. Renovação exige coorte com período de renovação completo. |
| Estamos escalando bem? | Tempo humano e retrabalho por unidade aprovada, custo de autoria/assets, achados por revisão e custo mensal por aluno ativo. | Definir teto de gasto com Anderson; não automatizar publicação para reduzir artificialmente revisão. |

Métricas externas exigem spec própria com eventos mínimos, retenção de dados, acesso, exclusão e declarações de loja. Primeiro usar o instrumento local existente, observação consentida e registros desidentificados. Não copiar o repositório inteiro para Obsidian, nem criar tarefas pessoais automaticamente.

### Assinatura, aquisição e escala: experimentos posteriores

Em E6, comparar três propostas concretas: manter vidas ilimitadas com apresentação mais clara; adicionar diagnóstico pessoal de dificuldades/relatório de evolução; adicionar planejamento de revisão e acompanhamento personalizado. As duas últimas são hipóteses de serviços, não recursos existentes ou aprovados. Confrontar utilidade, disposição real a pagar, custo e privacidade; não bloquear correção de erros ou conteúdo essencial para forçar compra. Manter mensal/anual e regras atuais até decisão comercial explícita. Novo preço exige consulta atual aos produtos/loja e aprovação, sem usar preço histórico como cotação futura.

A oferta deve aparecer após o aluno perceber valor, respeitando o fluxo aprovado e a saída sem compra. Testar compreensão do benefício e do cancelamento antes de medir conversão. Nenhuma mudança no ponto de exposição que interrompa estudo entra sem spec e validação.

Aquisição proposta após E5/E9: um grupo pequeno de estudantes/instituições parceiras; demonstração da unidade real; captura atual do app; promessa educacional limitada ao que foi validado. Medir origem, primeiro valor e retorno apenas pelo mecanismo autorizado. Não comprar tráfego em escala para um fluxo ainda com bloqueios. Convites, contato com instituições e campanhas exigem autorização de envio; esta tarefa não envia mensagens.

Escala editorial em E7 segue: objetivo/competência → fonte e direitos → rascunho com IA → atividades e mídia → validação automática → revisão editorial independente → aprovação por fingerprint → promoção → observação de uso. Medir tempo e retrabalho em cada etapa. Automação prepara e valida; publicação e decisão clínica permanecem humanas. Catálogo empacotado funciona offline; distribuição remota dinâmica só se houver necessidade comprovada e decisão arquitetural própria.

## 8. Validação e evidência de implementação futura

### Matriz mínima

| Área | Casos obrigatórios | Evidência |
| --- | --- | --- |
| Jornada/progresso | Pausa/retomada; revisão devida/futura; recompensa coletada uma vez; reforço completo após nova reprovação; retorno da assinatura durante tentativa; relaunch offline. | Testes de domínio/fluxo e Maestro na build do candidato, com fixtures sintéticas conhecidas. |
| Vidas/assinatura | Zero vidas; assinante; retorno da recarga; erro e animação de vida sem áudio sobreposto; compra pendente/restauração/expiração conforme contratos. | Testes existentes ampliados onde há mudança + StoreKit Testing/sandbox nos casos nativos pertinentes. |
| Acessibilidade | VoiceOver/TalkBack; ordem/foco e anúncios; texto ampliado; contraste; tamanho de toque; movimento reduzido; som/voz desativados; nenhuma instrução exclusivamente sonora ou por cor. | Checklist e evidência em aparelho nas plataformas afetadas; automatização não substitui leitura assistiva real. |
| Pixel/áudio | Interromper ao avançar/sair/background; sem repetição após retomar; offline; respeitar preferências; resposta visual não aguarda download/áudio. | Build própria e gravação/log de ordem; qualidade audível é avaliada por pessoa. |
| Desempenho | Mesma tarefa, device, build e condições para baseline/candidato; startup, latência toque→feedback, frames, memória, CPU e energia. | N e condições registrados; comparar aos gates vigentes e definir orçamento antes de implementar. Não usar CPU do simulador como bateria. |
| Conteúdo | Correção/segurança, figuras válidas, direitos, transferência, revisão espaçada e regras de avaliação. | Parecer por fingerprint; guardas observadas falhando com o defeito específico; erro crítico impede promoção. |
| Backup/migração | Atualizar usuário existente, retomada e restauração respeitando campos realmente incluídos; histórico local não incluído no iCloud. | Teste com fixture de versão anterior; sem apagar dados reais ou ampliar promessa de backup. |

### Comandos e fronteiras do gate

Antes do E2E, inventariar Xcode/SDKs, runtimes, Maestro, ferramentas Android, espaço e build instalada. Classificar cada execução como `passed`, `app-failed`, `environment-blocked` ou `not-run`; YAML existente não significa flow executado. Usar o runbook e flags reais de cada flow, especialmente o rating prompt em configuração de produção com push ativo e revisão devida sintética.

Testes focados durante edição usam Node 20 e o runner existente. Para mudanças comportamentais, registrar o vermelho que reproduz o sintoma exato antes do conserto; checagem de AST para contrato de código, sem regex que possa casar com comentário. Não criar testes que apenas espelham props ou a implementação.

O gate integral do app, conforme workflow versionado, é:

```bash
# No diretório radiant-app; não carrega .env.
PATH=/Users/anderson/.nvm/versions/node/v20.20.2/bin:$PATH EXPO_NO_DOTENV=1 npm run quality
```

No run supervisionado, executar **uma validação final configurada pelo Loop** (inclui os gates do projeto), sem duplicar o gate integral sem motivo. Node 24 apenas para Loop. Não validar enquanto Maestro estiver rodando. Confirmar carga/sono da máquina; falha de ambiente não é aprovação nem defeito demonstrado do diff.

Cada pacote entrega: diff próprio, spec/ADR quando aplicável, evidência de comandos/SHA, classificação estática/simulador/aparelho, atualização da FILA/roadmap quando o estado mudar e encerramento independente do run e da sessão. Fechar na ordem `validate → step finish → [memory write] → run close`, conferindo envelopes. Memória só aponta para aprendizado validado e identifica proposta como proposta.

## 9. Riscos, limites e recuperação

| Risco / sinal | Resposta e responsável |
| --- | --- |
| Visual melhora, aprendizagem piora; erros críticos ou interpretações clínicas erradas. | Revisor bloqueia promoção do material; agente corrige; repetir tarefa afetada e recuperação posterior. Nunca compensar com satisfação/XP. |
| Voz ou animação distrai, exclui ou consome energia. | Anderson avalia experiência; agente mede; reduzir duração, retirar voz ou manter runtime existente. Preferências acessíveis e fallback textual. |
| Expansão supera capacidade editorial. | Limitar WIP a uma unidade; medir retrabalho; parar geração até revisão fechar. Segunda unidade só após E5. |
| Novos benefícios quebram gratuidade/assinatura vigente. | Anderson decide contrato explicitamente; agente preserva entitlements e migrações. Não mudar oferta apenas por hipótese de receita. |
| SDK/Android perde janela administrativa ou técnica. | Frente E8 paralela e remedição com fonte oficial/console antes da execução; não usar contagem antiga de participantes como gate. |
| Dados pessoais entram em métricas ou prompts de IA. | Coleta mínima local, material sintético e sem dados pessoais; revisão de privacidade antes de serviço externo. |
| Release contém parte incompatível de uma migração. | Candidato por SHA, migração de progresso compatível e plano de recuperação testado. Flags atuais são majoritariamente de build: não prometer desligamento remoto instantâneo. |

Para cada release futuro: definir previamente se recuperação requer novo binário ou OTA compatível; mudança de runtime/módulo nativo exige novo binário. Não apagar progresso para recuperar uma experiência visual. Documentar quem decide interromper a distribuição e quais sinais o acionam; execução de release continua sujeita à autorização própria.

## 10. Decisões pendentes antes da primeira implementação

1. Anderson: aprovar desenho das três telas e nível de presença do Pixel; escolher voz opcional ou somente visual para o primeiro candidato.
2. Anderson/revisor editorial: confirmar os oito itens modificados da L1; preservar os demais gates já aprovados.
3. Anderson: disponibilizar participantes e aparelhos para piloto e acessibilidade; agente prepara roteiro e fixtures sem criar lembretes pessoais automaticamente.
4. Anderson + agente: orçamento de autoria/voz/runtime e limites de tamanho/desempenho; sem orçamento, protótipo local e conteúdo existente continuam sendo o recorte.
5. Eventual analytics externo, novos benefícios premium, publicação e ativação V3 permanecem decisões separadas, posteriores às evidências correspondentes.

## 11. Ferramentas escolhidas e verificação deste documento

Usadas para esta entrega: `find-skills`, Loop e `writing-plans`; revisão independente orientada por `requesting-code-review`. A busca encontrou [roadmap-update, da Anthropic](https://github.com/anthropics/knowledge-work-plugins/blob/main/product-management/skills/roadmap-update/SKILL.md), candidato de fonte oficial com cerca de 3 mil instalações na consulta de 2026-10-12; não instalado. Popularidade serve como triagem, não prova qualidade ou compatibilidade. As skills já disponíveis bastam para este planejamento.

Na execução, usar ferramentas coerentes com o app React Native: testes existentes, Maestro, XcodeBuildMCP e investigação de desempenho nativo. Skills SwiftUI não descrevem esta interface. Rive MCP e síntese de voz ficam como opções de autoria a provar no pacote E3, sem aquisição/integração automática agora.

A revisão independente identificou dois ajustes documentais, incorporados: modo shadow de push e preservação integral da §5.4/R1 do piloto antes da expansão. A validação documental verifica referências locais, consistência com o código e gates configurados. Não comprova o redesign, aprendizado do piloto, retenção, conversão, novo runtime ou desempenho futuro. O fechamento desta entrega deve registrar o resultado real da validação, sem trocar essas pendências por “implementado”.
