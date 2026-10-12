# Radiant — auditoria e direção visual das três telas de estudo

**2026-10-12 · baseline `2bb144e` · marco M1 do [plano de evolução](../plans/2026-10-12-radiant-evolution-plan.md).**

Entrega: inspeção do app atual, capturas nativas e [protótipo navegável](2026-10-12-study-experience.html). Direção proposta para avaliação de Anderson; não altera o app, não aprova conteúdo, não ativa V3 e não substitui a spec do piloto híbrido. O foco inicial em layout, Pixel e uma unidade foi escolhido por Anderson.

## Evidência e método

Inspeção manual de composição/fluxo seguida de varredura mecânica de layout, pela orientação `impeccable/layout`. Não é uma auditoria formal completa de acessibilidade ou um estudo com alunos. A hierarquia foi analisada antes do detector, que retornou `[]` nos três arquivos nativos; esse resultado não comprova ausência de problemas visuais ou suporte completo a React Native pelo detector. No HTML, o detector também retornou `[]`, **em modo degradado por ausência de módulos do parser** (`htmlparser2`, `css-select`, `css-tree`, `domutils`): fallback por regex não avalia propriedades CSS, seletores e contraste calculado. A inspeção visual, as medidas do DOM e os pares de contraste abaixo são evidências separadas; não se chamou esse scan de auditoria limpa.

Fontes: `JourneyHomeScreen.tsx`, `JourneyNodeCard.tsx`, `JourneyTrail.tsx`, `LessonFlowScreen.tsx`, `LessonSummary.tsx`, tokens galaxy/Sora, Pixel existente, [CLIENT_FLOW](../CLIENT_FLOW.md), [design atual](../DESIGN.md), specs e ADRs vigentes. PRODUCT contém referências antigas a Home/Galáxia e “vidas não bloqueiam”: a navegação e a regra de vidas foram confirmadas no código e na spec 1.4; essas frases antigas não governam esta proposta. A tarefa não reescreve o contexto global de design.

Capturas do app de desenvolvimento no simulador **Radiant E2E item 38, iPhone 17, iOS 26.5**, em 2026-10-12, aproximadamente 19:14–19:19, America/Bahia. Metro servindo a árvore desta branch; não são screenshots do binário da App Store. Estado sintético reaproveitado: sete lições e conquista já concluídas, 110 XP, unidade com oito etapas; não representa aluno real ou métricas comerciais.

| Tela atual | Captura | Leitura delimitada |
| --- | --- | --- |
| Estude | [Captura nativa](evidence/2026-10-12-study-home.jpg) | Estado “8 de 8”, sem próxima etapa elegível. |
| Atividade | [Captura nativa](evidence/2026-10-12-study-activity.png) | Questão do catálogo legado, antes de selecionar resposta. |
| Conclusão | [Captura nativa](evidence/2026-10-12-study-summary.png) | Repetição correta de lição concluída: “Sem XP nesta tentativa”, 1/1 e 8/8. |

XcodeBuildMCP forneceu snapshot/captura. As ações de UI nem sempre devolveram snapshot atualizado; a tela renderizada confirmou o avanço para “Ideia-chave”. O primeiro roteiro Maestro esperava a introdução e falhou nessa pré-condição, sem executar o resto. Corrigida a pré-condição para a tela realmente aberta, **o roteiro de captura passou**, chegou à pergunta e à conclusão sem limpar o estado. Isso comprova essa navegação sintética, não uma nova execução da suíte E2E inteira. Repetir a lição registrou a tentativa local; nenhum dado de produção foi usado.

## Achados e resposta proposta

| Prioridade | Achado observado | Efeito possível, a validar | Resposta nesta proposta |
| --- | --- | --- | --- |
| P1 | Estude sem etapa elegível mostra aviso grande “Novo arco em breve” e CTA desativado. | Ocupa espaço de leitura e pode criar expectativa de conteúdo sem data confirmada. | Mensagem factual sobre etapas disponíveis; revisão futura com data quando fornecida; esconder ação indisponível em vez de manter botão principal inerte. |
| P1 | A mesma moldura de fundo, com estrelas e círculos grandes, atravessa pergunta/cartões. | O campo de leitura disputa atenção com elementos decorativos. Não se mediu aqui uma falha numérica de contraste. | Fundo galaxy menos presente e superfícies sólidas de leitura; reservar personalidade para o Pixel e feedback. |
| P2 | Trilha em zigue-zague distribui o mapa, mas a recomendação e o estado de espera pedem busca visual. | Pode tornar difícil responder “o que faço agora?” em uma visita curta. | Um bloco de próximo passo; contexto e trecho compacto da trilha abaixo. O mapa completo e sua navegação devem ser preservados no desenho de implementação. |
| P2 | Conclusão dedica ampla faixa amarela e métricas em cartões separados antes da continuidade. | Celebração domina a hierarquia, embora já forneça Pixel, estrelas e feedback. | Pixel em composição menor, estrelas preservadas, resultados em linhas e próxima revisão perto da ação. A redução da faixa é proposta a aprovar, não defeito técnico demonstrado. |
| P2 | Rótulo genérico “Continuar” antes de confirmar a resposta. | A pessoa pode não antecipar se vai enviar a escolha ou apenas avançar. | Propor “Conferir resposta” antes de enviar; depois nomear a próxima ação. Mantém escolha → confirmação → feedback. |

Pontos fortes preservados: identidade autoral galaxy; Pixel já existente; navegação com duas abas; retorno ao progresso real; estrelas; feedback textual; separação entre avaliação da aula e da loja; estados e guardas de elegibilidade; virtualização e layout de texto grande já implementados.

## Tese espacial e alcance do protótipo

Modo: **Operate/Read**. Estudante no celular, em uma sessão curta, precisa entender o que fará, tentar, compreender o retorno e saber como continuar. Uma primeira ação domina a entrada; assunto e progresso dão contexto; detalhes vêm depois. Pergunta, alternativas e explicação têm espaço próprio. Pixel não carrega informação indispensável.

- **Estude:** HUD compacto → contexto da unidade → recomendação → Pixel de apoio → trecho da jornada. A proposta troca parte da visibilidade imediata do mapa por clareza de ação; verificar com alunos e contra o motivo que levou à retirada do hero anterior. Não recriar um hero grande com meta duplicada ou uma segunda jornada.
- **Atividade:** barra de sessão e saída → pergunta → quatro escolhas → confirmação → retorno e explicação → continuidade. Os quatro itens desta pergunta são conteúdo existente, não recomendação para toda avaliação usar quatro opções.
- **Conclusão:** celebração breve → resultado factual → revisão → avaliação opcional → retorno. Não inferir competência clínica de uma resposta correta; estrelas dependem do serviço real, não de uma animação.

O protótipo é uma prancheta de três telas com controles de demonstração **fora do produto**. Usa pergunta, opções e explicação de `src/data/lessons.ts`, Pixel e Sora existentes. Fonte e imagem estão incorporadas no HTML para funcionar offline, sem CDN ou nova biblioteca. Todos os números/data são fixtures visuais; a L1 híbrida real não foi recriada nem aprovada por esta página.

Estados demonstrados de Estude: retomada, próxima lição disponível, revisão devida, revisão futura, conquista, tudo concluído e zero vidas. Ao voltar da primeira conclusão, mostra 1/8 e a próxima lição elegível; a revisão futura sem CTA é uma fixture com todas as oito etapas concluídas. Conquista ainda não coletada usa 7/8. A demonstração de atividade permite selecionar, confirmar, ver explicação, tentar novamente, concluir e pausar; zero vidas bloqueia este exemplo legado. Avaliação da aula é opcional e sem envio. Perfil, StoreKit, recuperação de vidas, voz, storage, navegação nativa e roteamento real ficam fora desta prancheta. Links e avisos do protótipo explicam esses limites ao avaliador, não são copy para o aluno.

Não há redução/alteração da regra de vidas. No app futuro, a diferença entre primeiro contato gratuito e desafio que custa vida continua vinculada à spec híbrida; o exemplo visual legado não aprova um novo motor de avaliação. O resumo deve preservar os casos “Sem XP nesta tentativa”, zero XP, progresso vazio e estrelas sem melhora, ainda não exemplificados visualmente nesta versão.

## Especificação inicial para discutir

| Área | Direção | Condição antes de produção |
| --- | --- | --- |
| Cor e tipografia | Galaxy/Sora existentes; branco e texto secundário legível; azul de ação, ciano de sinal, âmbar de XP e rosa de erro. | Tokens semânticos vigentes; contraste medido nas superfícies finais; não misturar paleta clara dentro do app. |
| Espaço | Escala 4/8/12/16/20/24/32; menos contêineres; espaço maior entre grupos do que dentro deles. | Reutilizar tokens do app; espaço de rodapé calculado, não fixado para um aparelho. |
| Tamanho de toque | Controles demonstrados com pelo menos 48 px; escolher resposta e fechar são ações distintas. | 44 pt iOS e 48 dp Android, safe area e gestos nativos. Pixels de browser não provam medidas nativas. |
| Movimento | Nenhum loop novo; seleção e resposta imediatas; uma inclinação breve do Pixel no feedback demonstra a reação. | Respeita movimento reduzido no browser; ainda requer pausa em background e orçamento nativos. Rive/voz continuam no pacote E3 e dependem de decisão própria. |
| Texto grande | A prancheta permite ampliar a fonte e rolar conteúdos, mantendo CTA fora da região de leitura. | Dynamic Type/font scale real, sem cortar pergunta, data ou explicação; leitura assistiva no aparelho. |
| Jornada | Uma recomendação reflete o resolver atual. Revisão futura informa data e não abre estudo antes da hora. | Preservar a ordem retomada → revisão → avaliação → conquista → lição; nenhum componente visual recalcula elegibilidade. |
| Pausa/continuidade | Saída retorna à Estude; confirmação não perde seleção; atividade não recomeça por retorno de assinatura. | Persistência/cursores e casos de falha do checkpoint validados por testes do app. |

## Aceite do próximo pacote de implementação

Antes de editar o app, fechar com Anderson a estrutura e a redução da faixa de celebração, a presença do Pixel e o tratamento do mapa. Registrar a decisão em spec/ADR apropriada; não promover este HTML a contrato automaticamente.

1. Reconciliar os três fluxos com o código vivo; definir estados de carregamento, erro e dados indisponíveis, além dos já mostrados. Reservar tratamento visual para dados longos e progresso zero.
2. Mapear layout/ações a `JourneyHomeScreen`/componentes da jornada, `LessonFlowScreen`/renderers e `LessonSummary`. Services permanecem donos de recomendação, cursor, XP, avaliação e vidas.
3. Preservar testes existentes e ampliar apenas para alterações comportamentais: ação/data de revisão, ausência de CTA inelegível, seletor/confirmar, pausa/retorno, acerto/erro, XP null/zero/positivo, estrelas que não melhoraram e retorno da assinatura.
4. Comparar aparelho pequeno/alvo principal, texto grande, movimento reduzido, VoiceOver/TalkBack, modo offline e estados de zero vidas/assinante. Critérios antigos H4 continuam vigentes; protótipo web não fecha esses gates.
5. Rodar testes focados no Node 20; gate integral por Loop; E2E dos caminhos afetados por SHA e build. Capturas e teste no aparelho separados de testes de domínio.
6. Conteúdo/piloto: confirmação dos oito itens da L1 e aprovação por fingerprint; builds internas autorizadas; 3–5 participantes, R1 no dia seguinte e gate §5.4 vigente antes de L2/L3. A prancheta não substitui essa aprovação.

## Verificação e pendências

Verificações desta entrega: capturas nativas e navegação sintética de uma lição; fonte e asset existentes incorporados; inspeção visual da prancheta em viewport de 1280 px; erro → nova tentativa → acerto → conclusão → próxima lição disponível; revisão futura sem CTA; zero vidas bloqueia as alternativas e voltar a uma fixture com vidas reabilita a seleção. Em viewport de 320 px, com fonte ampliada de 16 para 21 px, as três molduras mantiveram rolagem vertical e nenhum transbordamento horizontal, por medição do DOM. Isso não prova que todos os itens estejam visíveis no primeiro quadro, nem acessibilidade nativa.

Pares sólidos de texto conferidos: branco/CTA `#2155FF` = 5,51:1; secundário `#B9C2D7`/superfície `#182033` = 9,09:1; terciário `#99A7BF`/superfície `#111322` = 7,57:1. A borda das alternativas foi clareada após a primeira checagem. São pares específicos da prancheta; não equivalem a uma auditoria completa de contraste do app.

A revisão independente encontrou e confirmou a correção da fixture de continuidade: após a primeira lição, uma revisão futura não bloqueia a próxima lição elegível. Nenhum achado remanescente nos trechos corrigidos. Resultado do gate Loop e das checagens finais é reportado no fechamento da tarefa. Nenhum resultado pedagógico ou comercial foi medido.

Pendentes: avaliação de Anderson da direção; spec de implementação aprovada; conteúdo L1; participantes; testes nativos do novo desenho; eventual voz. A primeira decisão visual pode ser tomada nesta prancheta sem esperar Rive, analytics ou mudança de assinatura.
