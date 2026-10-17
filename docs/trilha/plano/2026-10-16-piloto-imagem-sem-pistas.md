# Proposta: piloto de imagem com habilidade e pistas explícitas

> **Direção substituída em 2026-10-16:** Anderson retirou o foco em aulas piloto
> e pediu evolução global e escalável da trilha. Este documento é proveniência
> da escolha anterior; não é a próxima ação nem um gate para a frente global.
> [Decisão posterior](../../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md).

**Data:** 2026-10-16 (America/Bahia).  
**Autoria:** OpenAI Codex, família GPT-6; variante exata do modelo não exposta nesta sessão.  
**Estado:** foco em qualidade técnica da imagem escolhido por Anderson em 2026-10-16 nesta conversa. Desenho, limiares e execução do piloto continuam como proposta; não implementado e sem autorização de publicação.  
**Método:** desenho de piloto derivado da [pesquisa complementar](../pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md), com cinco estudos primários e inspeção estática dos renderizadores no HEAD inicial `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`.  
**Evidência:** fatos do repositório aparecem como [código]; todas as escolhas e limiares deste documento são [inferido — proposta]. Não são parâmetros validados pela literatura.

## 1. O que muda em relação ao plano vigente

[inferido — proposta] Acrescentar um pequeno ensaio preparatório ao P7 para responder: **o aluno usa a imagem e entende o feedback, ou apenas escolhe uma resposta entregue pela interface?**

[usuário — decisão do dono] Anderson escolheu **qualidade técnica da imagem** em 2026-10-16, ao responder à pergunta de foco do piloto nesta conversa. Essa escolha não deve ser reaberta sem solicitação dele.

[inferido — proposta] Escolher e revisar um critério técnico específico em uma trilha onde ele já faça sentido. A proposta não desloca o piloto híbrido da L1 já aprovado nem altera seu conteúdo.

[código] O [plano de 16/10](2026-10-16-plano-de-melhoria-da-trilha.md) já decide um item de toque na imagem por trilha neste ciclo. A [ADR de 23/09](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md) mantém primeiro contato sem custo de vida, desafio com custo e revisão sem custo. [inferido — proposta] Preservar essas decisões e nomear o primeiro formato como **seleção guiada na imagem**. Busca livre por coordenadas exigiria outro contrato e outra decisão.

[inferido — proposta] Tratar “um item por trilha” como presença de prática visual. A afirmação de domínio deve depender de acerto em casos novos sem ajuda, de acordo com o contrato de aprendizagem já vigente, e não da simples conclusão do item.

## 2. Um item concreto, ainda sem conteúdo clínico

[inferido — proposta] Molde para o revisor preencher com imagem licenciada e critério técnico aprovado:

1. Mostrar a imagem inteira, orientação preservada e contexto técnico estritamente necessário.
2. Pedir uma única ação: “Em qual das regiões aparece o critério descrito?” O critério e a descrição específica vêm da revisão editorial.
3. Oferecer três regiões numeradas. A lista visual usa identificadores neutros; descrições acessíveis são revisadas para permitir uma tarefa útil sem entregar o gabarito.
4. Permitir selecionar e confirmar, separando exploração de compromisso da resposta.
5. Após confirmar, mostrar a região escolhida e a esperada com marcas distinguíveis e uma explicação breve do critério visível naquele caso.
6. Voltar a praticar o conceito em outro caso. Repetir a mesma imagem é revisão daquele exemplo; não conta como transferência para caso novo.

[inferido — proposta] Os nomes do critério, exemplos, alternativas e feedback **não são fornecidos por este documento**. Seleção guiada, classificação e uma alternativa textual podem ter objetivos diferentes; o relatório do piloto deve identificá-los separadamente. Não se retira acessibilidade para “purificar” um teste visual.

## 3. Antes de colocar pessoas no piloto

| Gate proposto | Prova necessária |
| --- | --- |
| **Acervo** | Para cada arquivo: fonte/caso, licença comercial verificada, atribuição, anonimização revisada, hash do original e do derivado, dimensões, orientação e transformação de recorte, se houver. Revisão do dono conforme P6. Esta proposta não conclui esse gate. |
| **Gabarito** | Revisor define critério e região corretos e confere o feedback por caso. Para imagem real, o código verifica a regra de correspondência com a anotação revisada; não descobre a verdade clínica sozinho e não a delega a LLM. |
| **Geometria** | Convenção explícita de coordenadas: imagem original ou canvas preparado. Captura com alvos em imagem quadrada, retrato e paisagem, mais prova da transformação direta/inversa. |
| **Área de toque** | Medir o alvo efetivo no iOS e Android, bordas, regiões próximas e fonte ampliada. Ampliação para facilitar o toque não pode mudar silenciosamente o gabarito nem sobrepor alternativas. |
| **Imagem inteira** | Provar que enquadramento e comparação não eliminam o critério a avaliar. Um recorte deliberado tem transformação e revisão registradas. |
| **Pistas** | Rever nomes, alt text, rótulos de leitor de tela, ordem, posição e miniatura. Tentar resolver o item lendo apenas texto; se isso reproduzir o gabarito de um item que pretende avaliar visão, redesenhar ou reclassificar a habilidade. |
| **Offline** | Lançar sem rede com assets locais e repetir após reiniciar o app. Imagem ausente não pode virar erro conceitual ou gasto de vida. |
| **Acessibilidade** | Verificar a tarefa com VoiceOver e TalkBack; registrar o que a alternativa permite aprender. Não misturar seus resultados com localização visual independente. |
| **Fluxo** | Selecionar, confirmar, ver feedback, retomar após saída e concluir uma vez; preservar as regras de vidas e XP existentes. |

[inferido — proposta] Esses são critérios de aceitação do futuro trabalho, não resultados medidos. O desalinhamento potencial e o recorte estão demonstrados apenas por código e cálculo na pesquisa. Usar uma imagem 4:3 num teste não dispensa as demais proporções.

## 4. Ensaio em duas etapas

### A. Usabilidade, pequena e observada

[inferido — proposta] Integrar ao teste com 3–5 pessoas já previsto no piloto híbrido **se o conteúdo e a janela do dono permitirem**; caso contrário, preparar uma sessão complementar, sem alegar que ela substitui a L1. Incluir estudantes e técnicos do público brasileiro e aparelhos de largura pequena, com ao menos uma passagem por iOS e outra por Android.

[inferido — proposta] Registrar por pessoa e item: dispositivo, modo de interação, seleção inicial, mudanças antes da confirmação, resposta confirmada, uso de ajuda, necessidade de intervenção e interpretação do feedback. Se houver falha de toque ou leitura, classificá-la como falha de interação, não erro conceitual.

[inferido — proposta] Critérios práticos de saída: nenhum caso com imagem errada/ausente, alvo incorreto ou gabarito ambíguo; todos conseguem selecionar e confirmar sem intervenção após instrução; todos conseguem explicar onde o feedback aponta. Uma falha exige correção e nova observação do cenário afetado. Esses critérios são propostos para usabilidade, sem cálculo de poder e sem promessa de validade educacional.

### B. Aprendizagem, exploratória e separada

[inferido — proposta] Só depois de A, usar **nove casos distintos** de uma competência: três para instrução guiada, três para prática e três reservados para transferência sem ajuda. Quantidade escolhida para limitar custo, não “dose científica”. Se o acervo aprovado tiver só três imagens, o piloto pode verificar usabilidade; ainda não pode sustentar este teste de transferência.

[inferido — proposta] Separar os casos por paciente/caso de origem e impedir que recorte, espelhamento ou derivado da mesma imagem atravesse os conjuntos. Reservar os casos de teste antes de preparar o treino. Pré/pós precisam de formas equivalentes revisadas, ou comparação posterior com grupo apropriado; acertar três casos novos após o treino, sozinho, não estima ganho causal.

[inferido — proposta] Medir acerto na primeira confirmação sem ajuda e registrar resultados por item/pessoa, além de problemas motores. Fazer seguimento exploratório em sete dias, com outros casos reservados se disponíveis; sem eles, declarar a retenção como repetição dos casos usados. Reportar desistências. Não estimar significância ou eficácia com 3–5 pessoas; um estudo confirmatório precisaria de desenho, amostra e revisão próprios.

[inferido — proposta] Não exigir cronômetro competitivo. Tempo pode ajudar a encontrar dificuldade de uso, mas rapidez não substitui acurácia. Não trocar a regra de vidas para testar motivação nesta mesma experiência.

## 5. Medição sem antecipar a FILA 43

[código] O provedor de analytics e seu contrato ainda são decisão do dono. [inferido — proposta] O ensaio pode produzir uma tabela de observação autorizada, limitada ao teste, sem ativar telemetria remota ou instalar fornecedor.

[inferido — proposta] Para futura instrumentação, distinguir ID/versão do item e do caso, treino/teste, modo visual/textual, primeira confirmação, ajuda e erro de interação. Transporte, identificadores de participantes, consentimento e retenção de dados pertencem à decisão específica de privacidade; estes campos não são um contrato de coleta aprovado.

## 6. O que Anderson precisa decidir

| Decisão | Recomendação desta proposta | Alternativa |
| --- | --- | --- |
| Primeira competência — foco decidido pelo dono | Qualidade técnica da imagem; falta selecionar o critério e a trilha compatíveis | Decisão de foco encerrada em 2026-10-16 |
| Primeiro formato | Seleção guiada com feedback espacial, descrevendo a habilidade com honestidade | Adiar o ensaio para desenhar busca livre, ampliando o escopo técnico |
| Resultado autorizado nesta etapa | Usabilidade primeiro; aprendizagem apenas quando houver casos inéditos suficientes | Somente análise técnica, sem pessoas por enquanto |

[usuário — decisão do dono] O foco escolhido está registrado na [ADR de qualidade técnica](../../adr/ADR-2026-10-16-foco-piloto-imagem-qualidade-tecnica.md). A aprovação do foco não é aprovação automática dos demais parâmetros ou autorização de execução. O P6/FILA 52 e os gates editoriais continuam pré-requisitos para imagens reais; P1 e E1 mantêm a ordem já escolhida.

## 7. Evidência, fontes e limites

[código] Fontes locais: [hotspot](../../../radiant-app/src/features/lesson-flow/renderers/HotspotStepRenderer.tsx), [comparação](../../../radiant-app/src/features/lesson-flow/renderers/ComparisonStepRenderer.tsx), [contratos](../../../radiant-app/src/types/learningActivity.ts), [plano vigente](2026-10-16-plano-de-melhoria-da-trilha.md) e [piloto híbrido](../../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md), lidos em 2026-10-16.

[estudo] Bases primárias e limitações estão na matriz S1–S5 da [pesquisa](../pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md), com URLs e acesso em 2026-10-16. Para conferência direta: [Johnston — feedback espacial](https://pmc.ncbi.nlm.nih.gov/articles/PMC7438669/), [Alsharif — app e qualidade de RM](https://link.springer.com/article/10.1007/s13244-018-0635-0), [Ashworth — avaliação de imagem](https://pubmed.ncbi.nlm.nih.gov/31582238/), [Dunne — prática e retenção](https://pubmed.ncbi.nlm.nih.gov/35429718/) e [RadGame v1 — prática ativa de localização](https://arxiv.org/html/2509.13270v1).

[inferido] Este documento não entrega gabaritos clínicos, imagens licenciadas, código, recrutamento ou resultados com usuários. Não autoriza ativar V3, mudar vidas, enviar dados, compilar ou publicar. O valor entregue é tornar a escolha e os próximos gates concretos e auditáveis.
