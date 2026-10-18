# Radiant: pesquisas de produto, aprendizagem, experiência e IA

**Pesquisas realizadas e consolidadas em 2026-10-12. Estado: pesquisa e propostas
para discussão.** Reúne as duas frentes pesquisadas nesta conversa: evolução
do produto educacional e animação/voz do Pixel. Não aprova mudanças de produto,
currículo, assinatura ou arquitetura; não ativa tutor, provedor, MCP ou
dependência. O estado vivo permanece no
[STATUS.md](STATUS.md). Checkout pesquisado: `a059185`, branch
`codex/radiant-study-improvements`.

## Como ler e atualizar

- Fonte oficial confirma a descrição de um recurso, não seu efeito no Radiant.
- Relato de empresa registra a experiência da equipe; resultados não foram
  reproduzidos de forma independente nesta pesquisa.
- Fórum fornece sinais qualitativos. Participantes se selecionam e não
  representam todos os alunos; relatos médicos e internacionais não substituem
  pesquisa com estudantes brasileiros de técnico/tecnólogo.
- Estudos sustentam investigação pedagógica dentro das populações e limites
  examinados. Não comprovam eficácia clínica ou educacional deste aplicativo.
- Repositório documenta uma implementação ou experimento; nenhuma dependência
  externa foi instalada ou executada durante a pesquisa.
- Recomendação é uma hipótese do projeto. Aprovação futura deve usar a spec ou
  ADR correspondente; este documento não modifica decisões anteriores.
- Data de consulta é 2026-10-12 para todas as fontes externas abaixo. Quando
  conhecida, a data de publicação aparece no texto. Preços, versões e
  capacidades de ferramentas devem ser reconferidos antes de contratar/integrar.

## Índice

1. [Produto, aprendizagem e negócio](#produto-aprendizagem-e-negócio)
2. [Trilhas e formatos de sessão](#trilhas-e-formatos-de-sessão)
3. [Layout, usabilidade e acessibilidade](#layout-usabilidade-e-acessibilidade)
4. [Retenção, aquisição e assinatura](#retenção-aquisição-e-assinatura)
5. [Automação, escala e ferramentas](#automação-escala-e-ferramentas)
6. [Prioridades e critérios de pesquisa com alunos](#prioridades-e-critérios-de-pesquisa-com-alunos)
7. [Pixel: animação, voz e IA](#pixel-animação-voz-e-ia)

## Produto, aprendizagem e negócio

**Pergunta pesquisada:** como tornar o Radiant profissional, atrativo e útil,
com trilhas efetivas, vontade de voltar e uma assinatura sustentável?

O [PRD](PRD.md) define estudantes, técnicos e tecnólogos como público primário;
residentes e instituições são expansão futura. A intenção já aprovada inclui
sessões curtas, prática, revisão espaçada e progressão por competência. As
metas de retenção/conversão do PRD são metas, não resultados medidos nesta
pesquisa. O comportamento atual deve ser lido no [CLIENT_FLOW.md](CLIENT_FLOW.md)
e no código; o PRD contém também requisitos históricos.

### Referências comparadas

| Fonte e natureza da evidência | Achado observado | Hipótese aproveitável |
| --- | --- | --- |
| [Duolingo: caminho guiado, 2022](https://blog.duolingo.com/new-duolingo-home-screen-design/) — descrição oficial | Organiza conceitos em unidades e integra prática/revisão no caminho. | Mostrar um próximo passo compreensível e tratar revisão como avanço. |
| [Duolingo: sequência, 2021](https://blog.duolingo.com/improving-the-streak/) — experimento relatado pela empresa | Separar sequência e meta diária, permitindo manter a sequência com uma lição, aumentou a retenção D14 em 3,3% **relativos** naquele experimento. | Facilitar uma pequena sessão significativa. Não transferir o percentual ao Radiant. |
| [Duolingo: crescimento, 2023](https://blog.duolingo.com/growth-model-duolingo/) — relato da equipe | Descreve aquisição orgânica, uso gratuito, estados de atividade e experimentos sobre retenção. | Medir retorno e valor percebido antes de ampliar investimento em aquisição. Os dados daquele artigo não são estatísticas atuais do mercado. |
| [Brilliant: Learning Paths](https://brilliant.org/help/features/what-are-learning-paths/) — descrição oficial | Combina ordem sugerida, explicação, problemas interativos e checkpoints. | Intercalar explicação e ação dentro de uma sessão. |
| [Clover: RadTechBootCamp](https://cloverlearning.com/radtechbootcamp) — oferta comercial do fornecedor | Oferece vídeos curtos, quizzes, avaliações, banco de questões e simulados de radiografia. | Testar demonstração visual seguida de aplicação. Percentuais comerciais de aprovação/satisfação não foram auditados nem adotados como prova. |
| [Revisão de educação em radiologia, 2023](https://pubmed.ncbi.nlm.nih.gov/37683816/) — artigo científico | Oito estudos elegíveis sobre espaçamento, intercalação e recuperação ativa; cinco reportaram diferenças significativas em exames imediatos ou posteriores. Os autores apontam evidência específica limitada. | Investigar recuperação ativa e revisão com exemplos novos. A revisão não mede nossos estudantes brasileiros nem este app. |

### Sinais encontrados em fóruns

| Relato consultado | Sinal qualitativo | Limite e uso proposto |
| --- | --- | --- |
| [Radiography: dificuldade espacial](https://www.reddit.com/r/Radiology/comments/1qgeojv/advice_need/) | Dificuldade para traduzir texto de posicionamento em relações espaciais; pedido de referências concretas. | Um relato, incluindo condição individual. Testar vistas e manipulação visual; não declarar que todos têm essa necessidade. |
| [RadTechBootCamp: vídeos, simulados e repetição](https://www.reddit.com/r/Radiology/comments/1gyg1ng/how_good_is_rad_tech_bootcamp_for_board_prep/) | Participantes valorizam vídeos e questões; alguns relatam repetição, enunciados confusos e decorar perguntas. | Mistura de experiências positivas e negativas, no contexto de prova estrangeira. Variar situação/imagem e avaliar transferência. |
| [MedicinaBrasil: comparação de imagens](https://www.reddit.com/r/MedicinaBrasil/comments/1iuasc4/sites_para_estudar_radiologia/) | Estudante médico pede imagens normais/alteradas com estruturas indicadas. | Segmento secundário distinto do técnico/tecnólogo. Validar demanda por comparação visual sem transferir uma trilha diagnóstica ao público primário. |
| [Duolingo: Energy Mega Thread](https://www.reddit.com/r/duolingo/comments/1odnebl/energy_mega_thread/) e [justificativa oficial](https://blog.duolingo.com/duolingo-energy/) | O fornecedor afirma maior conclusão de lições; usuários do fórum relatam interrupção e frustração com limites de energia. | Dados agregados declarados e relatos espontâneos respondem perguntas diferentes. Medir abandono por vidas e experiência dos iniciantes no Radiant. |

**Conclusão de pesquisa:** aulas e testes não são uma escolha fechada. A
hipótese de trabalho combina explicação curta, prática visual, feedback causal
e recuperação posterior. A preferência real do nosso público continua aberta.

## Trilhas e formatos de sessão

**Proposta, ainda não validada com alunos:** preservar os arcos e competências
aprovados e desenhar cada unidade em torno de uma capacidade observável.
Definir pré-requisitos, atividade de aplicação, erros que exigem reforço e
verificação posterior. Registrar separadamente atividade concluída e evidência
de compreensão; um acerto na mesma pergunta não basta para inferir domínio.

Fluxo candidato de sessão, dentro dos 3–5 minutos já previstos no projeto:

`situação → explicação visual curta → ação → feedback causal → exemplo novo → revisão posterior`

| Formato candidato | Quando investigar | O que observar |
| --- | --- | --- |
| Imagem com marcação/identificação | Relações anatômicas e espaciais | Identifica em outra vista, sem decorar o marcador |
| Comparação entre exemplos | Diferenças relevantes para a competência aprovada | Explica a diferença e aplica a um terceiro exemplo |
| Ordenação ou decisão contextual | Sequência e aplicação de procedimentos revisados | Escolhe com justificativa coerente |
| Vídeo curto seguido de tarefa | Movimento ou procedimento difícil de explicar estaticamente | Consegue aplicar após a demonstração |
| Questão de recuperação | Consolidar e revisar | Responde após intervalo e em situação diferente |

Esses formatos não são um novo currículo aprovado. Mídia e explicações mantêm
as regras de direitos e revisão do [pipeline editorial](CONTENT_PIPELINE.md).
O piloto híbrido existente é o candidato inicial; não preparar uma expansão
massiva antes de avaliar sua experiência e aprendizagem.

## Layout, usabilidade e acessibilidade

**Observação visual do simulador em 2026-10-12:** a identidade espacial é
marcante; fundo animado e camadas translúcidas podem competir com a leitura.
É uma avaliação inicial, sem teste de usabilidade, auditoria nova de contraste
ou medição de retenção. Não generalizar do simulador para todos os aparelhos.

Proposta de recorte: Estude, lição e resultado; depois organizar o Perfil e a
oferta de assinatura.

- **Estude:** próximo passo, objetivo, duração aproximada e motivo da
  recomendação; localizar a unidade atual com facilidade.
- **Lição:** imagem e tarefa em destaque, texto em trechos curtos, controles
  consistentes e feedback junto da ação.
- **Resultado:** avanço, ponto de revisão e próxima ação em linguagem clara.
- **Perfil:** distinguir progresso, preferências, assinatura e ajuda.
- **Identidade:** preservar Pixel, padronizar tipografia/espaçamento/estados e
  usar movimento para orientar e celebrar momentos relevantes.

Referências: [movimento na HIG da Apple](https://developer.apple.com/design/human-interface-guidelines/motion)
e [acessibilidade](https://developer.apple.com/design/human-interface-guidelines/accessibility).
A página de acessibilidade teve extração limitada na navegação; a referência
não representa uma nova auditoria. Texto ampliado, VoiceOver, preferências de
áudio e redução de movimento continuam critérios do projeto.

## Retenção, aquisição e assinatura

### Fatos locais e perguntas abertas

- A [oferta atual](../radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx)
  promete vidas ilimitadas e mantém o conteúdo igual para todos. **Hipótese:**
  pode haver oportunidade para valor recorrente adicional. Não temos nesta
  pesquisa uma coorte de assinantes que comprove insuficiência da oferta.
- A [telemetria](../radiant-app/src/features/telemetry/TelemetryService.ts)
  guarda eventos no aparelho; o adaptador de produto disponível é `noop`, e a
  inspeção não encontrou um coletor registrado. Isso não prova ausência de
  métricas disponíveis nas lojas; elas não foram consultadas para esta pesquisa.
- O [relatório RevenueCat 2026](https://www.revenuecat.com/state-of-subscription-apps)
  fornece benchmarks observacionais de apps integrados à plataforma, com
  critérios de inclusão. Não determina nosso preço, conversão, retenção nem
  a duração ideal de um eventual teste gratuito.

### Hipóteses de evolução

1. **Aquisição:** experimentar desafios visuais demonstrativos e parcerias com
   professores/escolas. Observar qualidade dos usuários adquiridos e seu
   retorno. Nenhuma parceria, anúncio ou contato foi executado.
2. **Ativação:** primeira experiência curta e útil antes de pedir decisões
   adicionais; mostrar progresso compreensível.
3. **Retenção:** revisão integrada, próximos passos claros, variação de
   exemplos, retorno acolhedor após pausa e conteúdo disponível suficiente.
4. **Assinatura:** investigar treinos personalizados, relatórios por
   competência, prática adicional revisada e novas experiências sustentáveis.
   São benefícios candidatos, não entregues. Restrição de conteúdo exigiria
   decisão explícita sobre o contrato vigente de conteúdo igual para todos.
5. **Oferta:** testar apresentação depois de valor demonstrado, com benefício,
   período e preço claros. Conversão, renovação e cancelamento são medidas
   distintas; nenhum preço ou produto StoreKit foi modificado.

### Medidas que uma futura pesquisa deve definir

| Pergunta | Medida e denominador candidato |
| --- | --- |
| Entendeu como começar? | Pessoas que iniciam sem ajuda / participantes observados |
| Conseguiu estudar? | Pessoas que concluem / pessoas que iniciam a sessão |
| Aprendeu e reteve? | Desempenho em exemplos inéditos após intervalo; informar quem retornou e quem perdeu seguimento |
| Voltou espontaneamente? | Retenção D1/D7/D30 por coorte de instalação ou primeira sessão; fixar definição de atividade e fuso |
| Percebe valor pago? | Compreensão do benefício e motivos de aceitar/recusar; intenção declarada separada de compra real |
| A oferta converte? | Compras verificadas / pessoas elegíveis expostas à oferta; especificar janela e separar trials |
| A assinatura sustenta valor? | Renovação por produto/ciclo, cancelamentos e uso entre ciclos |

Começar pelo piloto local aprovado. Uma futura coleta agregada requer decisão
sobre dados, privacidade e integração; pesquisa não habilita envio. Comparações
com amostra pequena são exploratórias, sem prometer significância estatística.

## Automação, escala e ferramentas

O projeto já tem pipeline editorial, rastreabilidade, promoção de catálogo e
CI. A [qualidade do app](../.github/workflows/radiant-app-quality.yml) usa Node 20
e `EXPO_NO_DOTENV=1 npm run quality`. Não recriar esses mecanismos a partir de
um template externo sem verificar a necessidade.

**Hipóteses de evolução:** modelos reutilizáveis de atividades por competência,
variantes que preservam o objetivo, revisão de feedback e mídia, prévias,
validação automática e publicação versionada com reversão. IA pode preparar
rascunhos e localizar inconsistências; a aprovação editorial continua com os
gates já definidos. A estratégia local-first continua vigente.

| Repositório/documentação consultado | Utilidade investigada | Limite e condição de adoção |
| --- | --- | --- |
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | Evolução futura do agendamento de revisão | Não substituir SM-2 sem comparar, validar compatibilidade e preservar histórico |
| [Anki: implementação FSRS](https://github.com/ankitects/anki/blob/main/rslib/src/scheduler/fsrs/memory_state.rs) | Referência de implementação de revisão | Consulta de código/estrutura não é validação da adaptação ao Radiant; não copiar automaticamente |
| [H5P Interactive Video](https://github.com/h5p/h5p-interactive-video) | Demonstrações com perguntas integradas | Conteúdo web não comprova integração nativa ou adequação editorial |
| [PostHog](https://github.com/PostHog/posthog) e [integração Expo](https://docs.expo.dev/guides/using-posthog/) | Coortes e experimentos | Coleta e configuração não implementadas; selecionar somente dados necessários sob o contrato de privacidade |
| [EAS Workflows](https://docs.expo.dev/eas/workflows/introduction/) | Automatizar testes, builds e entregas | Comparar com CI existente e preservar autorização/gates de publicação |

### Descoberta de skills

Foram consultados [skills.sh](https://skills.sh/) e `npx skills find
'instructional design'`, em 2026-10-12. A candidata
[formative-assessment-loop-designer](https://skills.sh/garethmanning/education-agent-skills/formative-assessment-loop-designer)
apareceu com 126 instalações; o [repositório](https://github.com/GarethManning/education-agent-skills)
mostrava 849 estrelas. É um sinal de descoberta, não recomendação ou auditoria
do conteúdo da skill. Não foi instalada nem adotada como autoridade pedagógica.

A coleção oficial [Vercel agent-skills](https://github.com/vercel-labs/agent-skills)
e a skill React Native instalada foram consultadas para compatibilidade com o
app. A página da skill não forneceu contagem de instalações; não atribuir a
ela a contagem da coleção. Skills de design/RN e `motion-research` auxiliam a
execução, sem substituir pesquisa com alunos ou revisão científica.

### Fontes exploradas sem conclusão quantitativa adicional

- [Duolingo: método de ensino](https://blog.duolingo.com/duolingo-teaching-method/),
  [personagens](https://blog.duolingo.com/building-character/),
  [linguagem visual](https://blog.duolingo.com/shape-language-duolingos-art-style/)
  e [Friend Streak](https://blog.duolingo.com/product-lessons-friend-streak/):
  referências de variedade, identidade e hábito; não estimar seus efeitos no app.
- [Duolingo: resultados de 2025](https://investors.duolingo.com/news-releases/news-release-details/duolingo-reports-fourth-quarter-and-full-year-2025-results):
  consulta institucional, sem usar crescimento financeiro como prova pedagógica.
- [Ensaio de educação espaçada adaptativa, 2022](https://pubmed.ncbi.nlm.nih.gov/35472369/):
  registro consultado sem resumo disponível no PubMed; não foi extraída uma
  conclusão de eficácia desse registro.
- [Fórum: preparação de anatomia](https://www.reddit.com/r/RadiologyCareers/comments/1qv2o4v/anatomy_prep/)
  e [estudo de imagem](https://www.reddit.com/r/Radiology/comments/1d4boft): sinais
  exploratórios adicionais. A abertura completa do segundo link falhou; a
  síntese principal usa os relatos acessíveis da tabela de fóruns.

## Prioridades e critérios de pesquisa com alunos

**Ordem recomendada para discussão, não plano aprovado de implementação:**

| Ordem | Recorte | Evidência necessária |
| --- | --- | --- |
| 1 | Unidade piloto existente, com entrada, lição, resultado e revisão | Compreensão, conclusão sem ajuda e feedback entendido |
| 2 | Exemplos novos e acompanhamento posterior | Aplicação e retenção, com registro de abandono/perda de seguimento |
| 3 | Valor recorrente da assinatura | Benefício compreendido, disposição e comportamento real de compra |
| 4 | Expansão de unidades no formato avaliado | Qualidade editorial e custo de produção sustentáveis |
| 5 | Aquisição e entrega em maior escala | Retorno e aprendizagem dos novos usuários, além de instalações |

O [protocolo aprovado do piloto híbrido](superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md#54-teste-com-pessoas-e-critério-para-escalar)
prevê 3–5 participantes, sessão observada, perguntas sobre prazer/compreensão e
revisão no dia seguinte. Seus critérios incluem conclusão sem ajuda, duração,
vontade de seguir e compreensão dos erros. Reutilizar esse protocolo; recrutamento
e autorização de distribuição interna continuam com o dono.

A avaliação com exemplos inéditos após intervalo maior e a comparação com/sem
voz são extensões propostas nesta pesquisa. Não foram executadas nem
incorporadas automaticamente à spec. Amostra maior e desenho específico serão
necessários para avaliar efeitos de retenção e conversão.

## Pixel: animação, voz e IA

### Pergunta

Como dar ao Pixel presença, falas e reações imediatas, usando IA na produção e
aproveitando o app React Native/Expo atual?

### Base confirmada no repositório

- [`PixelIllustration.tsx`](../radiant-app/src/ui/characters/PixelIllustration.tsx)
  combina arte raster, face em componente separado e Reanimated. Já possui
  estados `idle`, `thinking`, `guide`, `happy`, `celebrate` e `oops`, com
  tratamento de movimento reduzido.
- [`lessonFeedback.ts`](../radiant-app/src/ui/feedback/lessonFeedback.ts) recebe
  eventos de toque, acerto, erro, sequência, perda de vida e conclusão.
  [`lessonSounds.ts`](../radiant-app/src/ui/feedback/lessonSounds.ts) prepara seis
  sons locais, respeita o silencioso e evita interromper a lição por falha de áudio.
- O piloto híbrido usa o Pixel na sequência e na conclusão. Ele permanece
  restrito ao desenvolvimento; pesquisa não muda o gate curricular.
- `package.json`: Expo 54, React Native 0.81.5, Reanimated 4.1.1 e expo-audio.
  Não foram encontradas dependências Rive ou Lottie nesse arquivo.

### Achados externos e limites da evidência

Cada entrada registra classe, evidência observada em texto e aplicação. Não
foram executados projetos externos, instalados MCPs nem assistidos vídeos.

| Fonte | Classe e evidência | Implicação para o Radiant |
| --- | --- | --- |
| [Brilliant: Koji e Rive, 2026-06-04](https://www.rive.app/blog/brilliant-builds-its-math-and-coding-tutor-character-with-rive) | Receita contextual; relato da própria equipe. Usou Claude num ambiente de protótipo para dirigir parâmetros da animação pela voz e Rive Agent para documentar a integração. Koji não tem boca. | Testar presença pela expressão, gesto e brilho do rosto do Pixel. O relato não prova aumento de retenção nem qualidade obtida sem trabalho de design. |
| [Engenharia do Duolingo](https://blog.duolingo.com/world-character-visemes/) | Técnica documentada: poses, estados de boca e tempos de fala combinados pelo Rive; reações ao resultado e interrupção quando o usuário avança. | Separar reação, fala e resultado pedagógico. Sincronização labial detalhada só vale se o personagem realmente precisar dela. |
| [Rive MCP oficial](https://rive.app/docs/editor/ai/mcp) | Capacidade oficial: edição de formas, arquivos, keyframes, estados, transições, bindings e scripts pelo editor desktop macOS/Windows. | IA pode auxiliar a autoria e o contrato entre designer e programador. Editor exporta o artefato consumido pelo app; MCP não precisa acompanhar o aluno. |
| [Rive React Native atual](https://rive.app/docs/runtimes/react-native/react-native) | Limitação oficial: RN 0.78+, Expo 53+, iOS 15.1+, Android SDK 24+ e Nitro Modules 0.25.2+. Documenta arquivos locais e controle de propriedades. | RN/Expo locais atendem esses dois mínimos, mas instalação, Nitro, demais requisitos, build e desempenho ainda precisam ser provados. |
| [LottieFiles AI](https://lottiefiles.com/ai) | Capacidade declarada pelo fornecedor: Motion Copilot produz formas, keyframes, easing e loops editáveis; Creator oferece MCP. | Alternativa para produzir pequenos efeitos e sequências. A geração não comprova qualidade de personagem ou compatibilidade do arquivo com o player nativo. |
| [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native) | Limitação do README atual: versão mais recente exige RN 0.84+; orienta 7.3.x para versões anteriores. | Não instalar `latest` no RN 0.81.5. Fixar uma versão compatível e validar em build própria. |
| [ElevenLabs: modelos](https://elevenlabs.io/docs/overview/models) e [timestamps](https://elevenlabs.io/docs/pt/api-reference/text-to-speech/convert-with-timestamps) | Capacidade oficial: português brasileiro em Multilingual v2; endpoint com áudio e alinhamento por caractere. | Produzir clipes revisados em PT-BR. Alinhamento de caracteres não equivale a visemas fonéticos prontos. Para luz pulsante, testar envelope de volume preparado junto do áudio. |
| [ODU33104/rive-mcp](https://github.com/ODU33104/rive-mcp) | Receita experimental: README e árvore incluem geração de `.riv`, amostras e renderização via runtime web. 17 estrelas na consulta. | Referência de autoria com IA; a compatibilidade binária e o resultado nativo não foram reproduzidos. Preferir avaliar primeiro o MCP oficial. |
| [bryllim/kabi-mascot](https://github.com/bryllim/kabi-mascot) | Receita contextual: mascote com rig, poses e estados, gerado por código; README informa CC BY 4.0. | Referência de organização de um personagem reutilizável, sem evidência suficiente para dizer que foi produzido com IA. Não substituir o Pixel pelo mascote externo. |
| [uianimation/rive-ai-avatar-viseme-kit](https://github.com/uianimation/rive-ai-avatar-viseme-kit) | Receita experimental: biblioteca TypeScript, demo de navegador e contratos para voz/animação; roadmap ainda contém integração e streaming pendentes. | Referência de separação das camadas. Não foi validada como solução pronta para React Native. |
| [Discussão Claude Code + Rive](https://www.reddit.com/r/ClaudeCode/comments/1wsxwb4/how_good_is_claude_code_rive_for_building/) | Relato de fórum: diferencia escrever integração e criar a animação. | Tratar código gerado e acabamento visual como trabalhos com verificações diferentes. Amostra espontânea, não estudo de eficácia. |
| [Desenvolvedor de gerador de mascotes](https://www.reddit.com/r/SideProject/comments/1pbcu0z/i_couldnt_forget_duolingo_bird_so_i_built_a_tool/) | Relato do autor sobre ferramenta de criação/animação e uso de Cursor; comentários discutem demonstração e pagamento. | Mostra experimentação independente. Não comprova integração nativa, qualidade constante ou resultado comercial. |

O [runtime legado do Rive](https://github.com/rive-app/rive-react-native) aponta
para o novo runtime e descreve migração. Exemplos antigos de `rive-react-native`
não devem ser combinados automaticamente com a API nova. A
[página de planos](https://www.rive.app/pricing) informa exportação gratuita com
splash e planos para exportar sem splash; reconferir o plano escolhido antes
de contratar ou publicar.

### Recomendação para discussão

**Inferência do projeto:** usar IA na autoria de arte, movimento, texto e voz;
executar as reações essenciais com assets locais e eventos do app. Isso
concentra custo na produção e mantém acerto/erro responsivos e utilizáveis
offline. Conversa aberta com IA cria outra dependência de rede, custo por uso,
latência e validação pedagógica; merece objetivo e piloto próprios.

Comparar uma versão do Pixel com Reanimated, aproveitando a base atual, e uma
versão com Rive para avaliar gestos articulados e transições. Rive é o candidato
principal para autoria mais rica; a escolha depende do resultado no aparelho.
Lottie é um candidato para efeitos curtos. IA de imagem pode preparar estudo
de expressões e poses, mas uma imagem gerada ainda precisa virar camadas/rig
editáveis. IA de vídeo pode ajudar em teasers e apresentação; um clipe fixo não
oferece sozinho o controle das reações a cada resposta.

Proposta de fluxo:

`evento da lição → reação visual local + feedback revisado → som/fala opcional`

O resultado e a navegação vêm dos serviços de aprendizado. A animação não
concede XP, não cobra vidas nem libera avaliação. Toda fala técnica precisa
do mesmo cuidado editorial do conteúdo ao qual se refere.

### Piloto proposto, ainda não executado

Usar a mesma interação em ambas as alternativas, preservando a identidade do
Pixel. Seis momentos: acolhimento, atenção, acerto, erro acolhedor, sequência e
conclusão. Preparar um pequeno banco de falas curtas em PT-BR com variantes
aprovadas; permitir avançar antes de a fala terminar e cancelar áudio antigo.
Para o rosto em tela, testar olhos e brilho com um envelope de volume
pré-calculado, sem obrigar captura do microfone.

| Situação | Comportamento a experimentar |
| --- | --- |
| Abertura | Gesto breve e convite ao objetivo da sessão |
| Acerto | Confirmação visual imediata; comemoração mais forte reservada a um marco |
| Erro | Expressão acolhedora; explicação causal da atividade disponível em texto |
| Pedido de ajuda | Atenção direcionada ao elemento relevante, sem revelar gabarito indevidamente |
| Sequência | Pequena celebração com variação para evitar repetição cansativa |
| Conclusão | Gesto, síntese do avanço e próxima ação |

Avaliar identidade visual consistente, transições sem saltos, áudio sem
sobreposição e saída limpa ao interromper. Registrar tempo evento→primeiro
feedback, estabilidade de quadros, CPU/bateria, tamanho de assets e uso
offline numa build real. **Hipótese de orçamento:** primeiro feedback visual
em até 100 ms no p95; o valor não foi medido nem aprovado como gate do projeto.
Comparar leitura/compreensão e vontade de continuar com o piloto sem voz.
Preservar silencioso, preferências de som, movimento reduzido, texto equivalente
e compatibilidade com VoiceOver; não sobrepor fala do Pixel ao leitor de tela.

### O que permanece desconhecido

- Acabamento do Pixel com rig: não há arquivo `.riv` novo nem render avaliado.
- Qualidade e pronúncia da voz: nenhum áudio foi gerado ou ouvido nesta pesquisa.
- Resultado comercial ou educacional: não há teste de alunos dessas mudanças.
- Compatibilidade real do novo runtime no conjunto iOS/Android do Radiant.
- Custos finais e direitos da voz/arte escolhidas; nenhum serviço contratado.
- Recursos do Rive que variam entre runtimes; páginas complementares e o link
  GitHub do novo runtime falharam na ferramenta de navegação. Os mínimos acima
  foram lidos na página oficial acessível, sem assumir suporte a todos os recursos.

## Verificação desta entrega

Pesquisa documental e inspeção de código. Run de consolidação:
`run-1791841090682-928c4096`. O gate configurado é `loop validate`; seus
resultados e o estado do run são consultáveis pela CLI pública do Loop.
Links locais e âncoras do relatório também foram conferidos durante a edição.
Aprovação desse gate não valida Rive, Lottie, voz, movimento novo, eficácia
educacional ou aumento de retenção. Nenhuma mudança no código do app.
