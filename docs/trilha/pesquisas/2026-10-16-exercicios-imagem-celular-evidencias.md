# Exercícios sobre imagem no celular: evidência e limites do renderizador

**Data:** 2026-10-16 (America/Bahia).  
**Autoria:** OpenAI Codex, família GPT-6; a variante exata do modelo não é exposta nesta sessão.  
**Pergunta:** como acrescentar prática visual à trilha sem confundir reconhecimento da imagem, seleção guiada e memorização de respostas?  
**Método:** revisão exploratória dirigida de cinco estudos primários, leitura de documentação oficial e inspeção estática do código. Não é revisão sistemática nem ensaio com o público do Radiant.  
**Estado medido:** branch `codex/radiant-study-improvements`, HEAD inicial `2c1b5f0bccf15d1fbf5b9dd7a48d51bd0d85e24b`; árvore documental já alterada por outra sessão. Nenhum aparelho ou simulador operado nesta pesquisa.

## 1. O que esta contribuição acrescenta

[inferido] O primeiro item de imagem deve explicitar a habilidade que pratica e mostrar feedback ligado à região relevante. Acertar o nome de uma região previamente marcada não demonstra encontrar essa região sozinho. Um item por trilha é um marco de cobertura aprovado pelo dono; os estudos consultados não estabelecem que essa seja uma dose suficiente de aprendizagem.

[código] Há renderizadores de hotspot e comparação. Eles reduzem o trabalho de interface, mas não provam prontidão para qualquer radiografia: há pistas textuais, geometria dependente da proporção e possibilidade de recorte da imagem. A proposta complementar está em [piloto de imagem sem pistas de resposta](../plano/2026-10-16-piloto-imagem-sem-pistas.md).

[inferido] Esta pesquisa qualifica o P7 do plano vigente. Não conclui o P6/FILA 52, não escolhe imagens, não licencia material e não substitui o piloto híbrido da L1 já decidido.

## 2. Como as fontes foram selecionadas

[inferido — método] Buscas realizadas em 2026-10-16 pelo mecanismo web, em inglês, com combinações de `radiology perceptual learning feedback transfer`, `radiography students image appraisal`, `mobile learning MR image quality` e `SAFMEDS chest radiograph trial`. O benchmark existente serviu como pista, não como prova; RadGame foi relido na fonte primária.

[inferido — método] Incluídos estudos com prática sobre imagem e população/método identificáveis, procurando cobrir: localização, feedback espacial, repetição, avaliação técnica da imagem e uso de smartphone. Excluídos desta síntese textos de marketing, resumos de IA, artigos de classificação automática de imagens e resultados cujo método não foi acessível. Não houve busca exaustiva, dupla seleção, metanálise ou avaliação formal de viés. Cinco estudos não significam cinco réplicas da mesma intervenção.

**Legenda:** [estudo] = resultado relatado pelos autores; [oficial] = documentação do responsável; [código] = leitura direta do repositório; [inferido] = interpretação, risco ou proposta desta IA. Cada linha da tabela abaixo é [estudo]; a coluna de aplicação contém inferências explicitamente limitadas. Nenhuma afirmação de tela usa [visto], pois não houve inspeção nativa.

## 3. Matriz de evidência

| Estudo primário | Desenho e achado relatado | Limite e aplicação ao Radiant |
| --- | --- | --- |
| [S1 — Johnston et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7438669/) | Série de experimentos com cortes estáticos de TC. Houve aprendizagem e transferência a imagens não treinadas; feedback que indicava a posição do apêndice foi mais útil que apenas certo/errado. | Experimentos de laboratório, amostras pequenas e tarefa simplificada; não smartphone nem técnicos brasileiros. Apoia testar feedback espacial, sem importar o diagnóstico como objetivo do app. |
| [S2 — Alsharif et al., 2018](https://link.springer.com/article/10.1007/s13244-018-0635-0) | Comparação pré/pós com 35 profissionais de RM: 19 com acesso ao app por três meses e 16 controles; avaliação com 25 imagens. Autores relatam ganho de conhecimento sobre erros de qualidade de imagem. | Mesmas imagens no reteste, possível formação adicional e desenho comparativo sem inferir randomização. É a fonte mais próxima do trabalho técnico e do smartphone neste conjunto; não prova transferência para casos inéditos. |
| [S3 — Ashworth et al., 2019](https://pubmed.ncbi.nlm.nih.gov/31582238/) | Oficina de avaliação de imagem e três grupos focais, 23 estudantes de radiografia. Participantes identificaram dificuldades com critérios específicos de projeção e valor do feedback e da repetição. | Evidência qualitativa de dificuldades e experiência, não medida causal de ganho. Ajuda a selecionar uma tarefa técnica concreta, em vez de apenas reproduzir um checklist. |
| [S4 — Dunne et al., 2022](https://pubmed.ncbi.nlm.nih.gov/35429718/) | Ensaio pragmático randomizado com 40 estudantes de medicina, 20 por braço e três desistências. SAFMEDS teve melhor acurácia no pós-teste e na retenção que o controle. | Prática de radiografia torácica em estudantes de medicina; não compara hotspot com alternativas nem valida pressão de tempo no celular. O resumo foi consultado; detalhes indisponíveis nele não são presumidos. |
| [S5 — Baharoon et al., RadGame v1, 2025](https://arxiv.org/html/2509.13270v1) | 18 estudantes de medicina; prática ativa de localização com caixas e feedback versus exposição passiva. Ganho relativo de localização relatado de 68% versus 17%. | Intervenção agrupa prática, feedback e gamificação; não isola XP. Pré/pós usam os mesmos casos; amostra selecionada por interesse. Não prova transferência inédita nem vantagem no telefone. |

[inferido] A confiança é **moderada para experimentar prática ativa com feedback específico** e **baixa para escolher um gesto vencedor, uma dose mínima ou prometer retenção no público do Radiant**. Esta é uma apreciação narrativa, não classificação GRADE.

[estudo, S5] O ganho relativo do RadGame não é ganho de 68 pontos percentuais. A diferença entre grupos no módulo de laudo não alcançou significância; por isso não fundamenta promessa de superioridade nessa habilidade. O artigo descreve revisão humana de feedback e de escores de IA. [inferido] Seu resultado não justifica transformar um modelo generativo em gabarito do Radiant.

[oficial] Há uma página editorial do RadGame no [PMLR, volume 297](https://proceedings.mlr.press/v297/baharoon26a.html), consultada nesta data. Os detalhes de desenho acima são explicitamente os da versão arXiv v1, datada de 2025-09-16; não se presume identidade integral entre versões nem se conta a página editorial como outro estudo.

## 4. Habilidade antes do gesto

[inferido — proposta de taxonomia] Os formatos abaixo testam coisas diferentes. A prioridade é uma hipótese de produto para discussão.

| Formato | O que pode exercitar | Pista ou viés que precisa controlar | Prioridade sugerida |
| --- | --- | --- | --- |
| Escolher entre regiões já numeradas | Discriminar alternativas espaciais | Nomes na lista, número/posição fixos e caixas que indicam onde olhar | Primeiro piloto, descrevendo-o como seleção guiada |
| Classificar uma imagem por um critério técnico | Reconhecer uma propriedade visual em casos variados | Comprimento da alternativa, metadados e presença de casos só com erro | Primeiro piloto, se houver acervo e revisão adequados |
| Comparar duas imagens | Distinguir uma diferença relevante | Recorte, escala, brilho e múltiplas diferenças simultâneas | Após validar enquadramento e equivalência dos pares |
| Tocar livremente onde está o alvo | Localização sem candidatos visíveis | Tamanho do alvo, tolerância, zoom e erros motores | Fase posterior; não é o contrato atual do hotspot |
| Percorrer uma série de cortes | Busca e raciocínio espacial ao longo do volume | Navegação, janela, resolução e dimensão do acervo | Fora do primeiro piloto |

[inferido] Seleção guiada pode ensinar e é um ponto de partida legítimo. O cuidado é não registrar seu acerto como prova de busca visual independente. Classificação técnica é mais próxima do público declarado em [PRODUCT.md](../../PRODUCT.md) que importar tarefas de produção de laudo do RadGame.

## 5. Inspeção estática: o que o código oferece

**Referências locais:** [HotspotStepRenderer](../../../radiant-app/src/features/lesson-flow/renderers/HotspotStepRenderer.tsx), [seus testes](../../../radiant-app/src/features/lesson-flow/renderers/HotspotStepRenderer.test.tsx), [ComparisonStepRenderer](../../../radiant-app/src/features/lesson-flow/renderers/ComparisonStepRenderer.tsx), [contratos de atividade](../../../radiant-app/src/types/learningActivity.ts) e [useLearningActivity](../../../radiant-app/src/features/lesson-flow/hooks/useLearningActivity.ts). As afirmações desta seção descrevem esses arquivos lidos em 2026-10-16.

### 5.1 Regiões predefinidas e pistas na lista

[código] O hotspot recebe `regions` e `correctRegionIds`. Cada região vira um botão visível numerado e também uma alternativa textual com `region.label`. O toque transmite um ID; não registra uma coordenada livre. A seleção verde indica **selecionado**, não um veredito de acerto.

[código] O teste usa a pergunta “Onde está o detector?” e a alternativa “Detector plano”; selecioná-la chama o mesmo callback da região na imagem. [inferido] Esse exemplo permite responder pelo texto sem localizar o detector. É uma demonstração do risco de autoria, não prova de que todo item publicado tenha esse defeito.

[inferido] Renomear tudo como “Região A/B” não resolve sozinho a acessibilidade: leitores de tela precisam de uma alternativa educacional útil. O modo de interação e a habilidade medida devem ser explícitos, com avaliação separada quando a tarefa deixa de ser visual.

### 5.2 Coordenadas da imagem e do quadro não são intercambiáveis

[código] `regionPosition` aplica porcentagens ao quadro; o quadro tem proporção 4:3 e a imagem usa `contain`. Não há nessa função compensação das margens internas da imagem. O contrato normaliza coordenadas em 0–1, mas precisa explicitar se a referência é a imagem original ou um canvas previamente preparado.

[oficial] A [documentação do React Native](https://reactnative.dev/docs/image#resizemode) define `contain` como escala uniforme que mantém a imagem inteira dentro da view.

[inferido — derivação reproduzida] Para coordenadas relativas à imagem original, o posicionamento correto exige escala e deslocamento:

```text
s = min(W / larguraOriginal, H / alturaOriginal)
w = larguraOriginal * s; h = alturaOriginal * s
ox = (W - w) / 2; oy = (H - h) / 2
xTela = ox + xNormalizado * w
yTela = oy + yNormalizado * h
```

[inferido — cálculo, não captura] Quadro idealizado de 320 × 240 unidades, ignorando bordas; ponto normalizado (0,25; 0,25):

| Imagem | Retângulo visível | Ponto sobre a imagem | Ponto aplicado ao quadro | Deslocamento |
| --- | --- | --- | --- | --- |
| 512 × 512 | 240 × 240; margem horizontal 40 | (100; 60) | (80; 60) | 20 unidades à esquerda |
| 512 × 768 | 160 × 240; margem horizontal 80 | (120; 60) | (80; 60) | 40 unidades à esquerda |
| 1024 × 576 | 320 × 180; margem vertical 30 | (80; 75) | (80; 60) | 15 unidades acima |

[inferido] O cálculo mostra uma incompatibilidade **se** os alvos forem anotados sobre a imagem original. Se os arquivos forem preparados em canvas 4:3 com alvos nesse mesmo canvas, esse caso específico pode não ocorrer. Essa convenção deve ser documentada e testada antes de importar o lote, em vez de pressuposta.

[código] `minWidth/minHeight: 44` pode ampliar regiões pequenas além do retângulo anotado. Os testes atuais afirmam callback, estado e tamanho mínimo; não rasterizam a imagem nem comprovam alinhamento. [inferido] Um alvo grande pode facilitar toque e simultaneamente invadir outro alvo: são critérios distintos.

### 5.3 Comparação pode recortar o objeto de estudo

[código] O comparador usa imagem em 16:9 com `resizeMode="cover"`. [oficial] Segundo o React Native, `cover` preserva a proporção preenchendo a view, podendo excedê-la. [inferido] Conteúdo fora do quadro pode sumir, inclusive um critério periférico da imagem; não é adequado aceitar automaticamente qualquer radiografia sem conferir o recorte.

### 5.4 Celular, acessibilidade e offline ainda exigem prova

[oficial] A [orientação do Android](https://support.google.com/accessibility/android/answer/7101858?hl=en) recomenda alvos de pelo menos 48 × 48 dp. [código] Os estilos do hotspot declaram mínimo 44. [inferido] Isso não comprova uma violação em cada região: alvos percentuais podem ficar maiores. É necessário medir a área efetiva e sobreposições em Android, fonte ampliada e tela estreita.

[código] `imageRef` é uma string passada como URI. [inferido] A existência do campo não garante empacotamento, disponibilidade offline ou carregamento no aparelho. Esse é um gate por imagem/lote; não foi executado aqui. Zoom, voz e leitura em tela também não foram verificados nesta pesquisa.

## 6. Recomendações e contrapontos ao plano

1. [inferido] **Manter um item por trilha como cobertura inicial**, com a habilidade nomeada. Não apresentar esse marco como evidência de domínio ou de dose ótima.
2. [inferido] **Adicionar ao critério de saída do P7**: alinhamento no retângulo da imagem, ausência de resposta entregue pelo texto, feedback visual e prova com caso não treinado. É proposta, não alteração do plano de outra autoria.
3. [inferido] **Não copiar o desenho do RadGame por inteiro.** O público e as tarefas são diferentes; feedback autoral revisado e disponível offline é suficiente para testar a hipótese inicial.
4. [inferido] **Não tornar o alvo invisível em todo exercício.** Guiar primeiro pode ser útil; retirar a pista só faz sentido quando se quer medir localização independente.
5. [inferido] **Separar usabilidade e aprendizagem.** Três a cinco pessoas ajudam a encontrar problemas do piloto já previsto, mas não demonstram eficácia educacional generalizável.
6. [inferido] **Separar pacientes/casos no treino e no teste.** Variações, recortes e imagens do mesmo caso não contam como transferência para caso novo. Um avaliador deve reservar o conjunto antes da autoria do treino.

## 7. O que permanece desconhecido

[inferido — lacunas desta busca] Não se estabeleceu comparação causal entre toque, seleção e comparação no público brasileiro; dose ótima de exemplos; efeito de vidas sobre aprendizagem visual; retenção longa; ou desempenho com leitor de tela. Não se pesquisaram licenças comerciais nem se adotaram exemplos clínicos prontos para publicação. “Não estabelecido nesta busca” não significa “não existe na literatura”.

## 8. Fontes e proveniência

Todas acessadas em **2026-10-16**; resultados e limites resumidos acima. URLs apontam para estudos/documentação primários.

- **S1 [estudo]:** Johnston et al. *Perceptual Learning of Appendicitis Diagnosis in Radiological Images*. Journal of Vision, 2020. DOI [10.1167/jov.20.8.16](https://doi.org/10.1167/jov.20.8.16). Texto integral no [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7438669/).
- **S2 [estudo]:** Alsharif et al. *Validation of the educational effectiveness of a mobile learning app to improve knowledge about MR image quality optimisation and artefact reduction*. 2018. [Artigo](https://link.springer.com/article/10.1007/s13244-018-0635-0). Texto integral consultado pela editora; acesso PMC apresentou desafio de navegador.
- **S3 [estudo]:** Ashworth, Thompson e Mercer. *Learning to look: Evaluating the student experience of an interactive image appraisal activity*. 2019. [Registro/resumo](https://pubmed.ncbi.nlm.nih.gov/31582238/), DOI [10.1016/j.radi.2019.02.011](https://doi.org/10.1016/j.radi.2019.02.011). Resumo indexado consultado; texto integral da editora não recuperado.
- **S4 [estudo]:** Dunne et al. *A randomized controlled trial of SAFMEDS to improve chest radiograph interpretation among medical students*. 2022. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35429718/), DOI [10.1016/j.ejrad.2022.110296](https://doi.org/10.1016/j.ejrad.2022.110296). Resumo consultado.
- **S5 [estudo]:** Baharoon et al. *RadGame: An AI-Powered Platform for Radiology Education*, versão [arXiv v1](https://arxiv.org/html/2509.13270v1), 2025. Página editorial [PMLR](https://proceedings.mlr.press/v297/baharoon26a.html) consultada separadamente.
- **S6 [oficial]:** React Native, [Image — resizeMode](https://reactnative.dev/docs/image#resizemode).
- **S7 [oficial]:** Android Accessibility, [Touch target size](https://support.google.com/accessibility/android/answer/7101858?hl=en).
- **C1 [código]:** arquivos locais relacionados na seção 5, comparados com o HEAD inicial. Relatos de tela das avaliações anteriores não foram promovidos a observação nativa desta sessão.
- **D1 [código]:** [plano vigente](../plano/2026-10-16-plano-de-melhoria-da-trilha.md), [ADR híbrida](../../adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md) e [piloto aprovado](../../superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md).

## 9. Ferramental

[oficial — descoberta] `find-skills` levou à consulta do catálogo/leaderboard e à verificação do pacote [Vercel React Native Skills](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-native-skills) e do [repositório oficial](https://github.com/vercel-labs/agent-skills), em 2026-10-16. A página do pacote indicava 243,1 mil instalações e 32,5 mil estrelas no repositório; são fotografias temporais, não garantias de qualidade.

[código] A skill já está disponível no ambiente. Não foi necessário instalar ferramentas. O Loop governou contexto e escrita; as conclusões educacionais vêm dos estudos, não das skills. O plugin Build iOS Apps permanece pertinente à futura prova nativa; nenhum build ou simulador foi acionado por esta pesquisa.
