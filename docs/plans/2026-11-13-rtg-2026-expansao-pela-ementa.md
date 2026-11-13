# Expansão da trilha rtg-2026 pela ementa (frente F1 da 1.6)

**Criado em 2026-11-13** pelo Claude (Opus 5.5), sessão da frente F1 da atualização
1.6, sob a [ADR da delegação](../adr/ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla.md).
Decisor das frentes: o Claude controlador da 1.6, por delegação do dono. Este documento
não autoriza build, envio à loja nem merge.

## 1. Trilha atual e ementa do curso

**Base.** As matrizes já levantadas no
[anexo de pesquisa de 2026-11-02](../research/2026-11-02-pesquisa-conteudo-radiant.md)
(C01 IFPI 2022, C02 UNIFESP, C03 UTFPR, C04 IFPE 2014.1, C05 IFBA). Nenhuma ementa
nova foi aberta nesta frente: as cinco bastam para o recorte, e a comparação abaixo é
por **domínio de disciplina**, não pelo nome exato de cada componente em cada
instituição. Os nomes variam entre as matrizes; onde uma linha diz "matrizes", ela se
apoia no que o anexo registra, não numa leitura nova.

Medido em 2026-11-13 nos JSON de `content-manifest/rtg-2026/aulas/`: 20 unidades, 132
aulas (núcleo M01 a M14 com 84; seis ramos com 48).

| Domínio da ementa | Onde a trilha cobre | Lacuna |
| --- | --- | --- |
| Anatomia humana e por imagem | M02, M07, M08, M10, M12; ramos | Coberta no recorte do app. |
| Biologia celular, histologia e fisiologia | M02.04 (estruturas e sistemas), M04.04 (efeitos biológicos), contexto em M08 | **Parcial.** Célula, ciclo celular, tecidos e funções aparecem só como pano de fundo. M04.04 cobra efeito biológico sem uma aula que ensine o que a radiação atinge. |
| Física aplicada e matemática | M03, M04 | Coberta. |
| Radiobiologia e proteção radiológica | M04, S-MN.01, S-RT.02 | Coberta; ganha base com a unidade de biologia. |
| Formação e processamento da imagem | M05, M06 | Coberta. |
| Técnicas radiológicas e posicionamento | M07, M08 | Coberta. |
| Contraste, preparo e cuidado | M09 | Coberta. |
| Patologia geral e aplicada | Casos de M07 a M13, sem ensino de diagnóstico | **Parcial.** Nenhuma aula ensina como a condição do paciente (dor, imobilidade, dispneia, gestação, isolamento, fragilidade óssea) muda preparo, posição e qualidade. |
| Tomografia, ressonância, mamografia e densitometria | M10, M11, M12; S-TC, S-RM, S-MD | Coberta. |
| Medicina nuclear, radioterapia, intervencionista | M13; S-MN, S-RT, S-IR | Coberta. |
| Radiologia odontológica | Nenhuma | **Sem módulo.** Intraoral, panorâmica, tomografia de feixe cônico e proteção específica não aparecem. |
| Ultrassonografia | Ondas em M03.04 | **Sem percurso.** Física do som, transdutor, artefato e limite de atuação não aparecem. |
| Ética, legislação e exercício profissional | M01.01, M01.05, M14.03 | **Parcial.** A lei da profissão e o sistema CONTER aparecem de passagem. Candidata a unidade futura (seção 4). |
| Gestão, qualidade e informática em saúde | M05.05, M14 | Coberta. |
| Radiologia industrial | Nenhuma | **Fora.** Escopo profissional e fontes próprios; candidata a ramo futuro. |
| Estágio supervisionado | Nenhuma, por decisão | Fora da equivalência do app; simulação não substitui estágio. |

## 2. Unidades novas desta frente

Os identificadores não renomeiam nada. O verificador aceita `m\d{2}` e `s-[a-z]{2}`;
por isso o núcleo ganha `m15` e `m16`, e os ramos ganham `s-od` e `s-us`.

| Id | Código | Título | Posição pedagógica | Por que ali |
| --- | --- | --- | --- | --- |
| `m15` | M15 | Células, tecidos e funções | Depois de M03, antes de M04 | M04.04 cobra efeito biológico; o aluno precisa antes saber o que é célula, ciclo celular, tecido e órgão, e por que tecidos diferem em sensibilidade. Depende de M02.04. |
| `m16` | M16 | A condição do paciente na aquisição | Depois de M09, antes de M10 | Usa o posicionamento de M07 e M08 e o preparo e a triagem de M09; prepara TC e os ramos, onde a condição do paciente pesa mais. |
| `s-od` | S-OD | Radiologia odontológica | Ramo, depois de M14 | Depende de geometria e qualidade (M06), de proteção (M04) e de anatomia da face (M08.04); TC de feixe cônico se apoia em M10. |
| `s-us` | S-US | Ultrassonografia para o tecnólogo | Ramo, depois de M14 | Depende de ondas (M03.04) e de anatomia seccional (M10). É a única modalidade sem radiação ionizante do app. |

**Posição real no app nesta entrega: as quatro no fim da ordem, depois de S-IR**, na
ordem `m15`, `m16`, `s-od`, `s-us`. A seção 3 explica por que a posição pedagógica do
`m15` e do `m16` depende de uma mudança no motor que esta frente não faz.

### M15 — Células, tecidos e funções (6 aulas)

Pré-requisitos: M02.04, M03.03. Limite: nenhuma aula fala de prognóstico de paciente.

| Aula | Título | Competência | O que o aluno faz |
| --- | --- | --- | --- |
| M15.01 | A célula e suas partes | Relacionar núcleo, membrana e organelas à função de cada uma. | Associa estrutura a função; completa a frase com o nome do componente. |
| M15.02 | Ciclo celular e divisão | Ordenar as fases do ciclo e dizer onde o DNA é copiado. | Ordena as fases; julga afirmações sobre mitose. |
| M15.03 | Os quatro tecidos | Classificar exemplos nos tecidos epitelial, conjuntivo, muscular e nervoso. | Classifica estruturas por tecido. |
| M15.04 | Da célula ao sistema | Situar órgão e sistema na organização do corpo e ligar sistema a função. | Ordena níveis de organização; associa sistema a função. |
| M15.05 | Por que tecidos respondem diferente | Explicar, no nível de conceito, por que células que se dividem muito são mais sensíveis à radiação. | Marca todas as características de tecido mais sensível; julga afirmações. |
| M15.06 | Da biologia à proteção | Ligar a sensibilidade dos tecidos às medidas de proteção que o tecnólogo aplica. | Caso com decisão: escolhe a conduta de proteção e aciona a equipe. |

Fontes previstas: SEER Training Modules do NCI (domínio público dos EUA) para célula,
tecidos e sistemas; IAEA (Human Health Campus, radiobiologia) e ICRP 103 para
sensibilidade e fatores de ponderação, como `factual-reference`; OpenStax Anatomy and
Physiology só como consulta.

### M16 — A condição do paciente na aquisição (6 aulas)

Pré-requisitos: M07, M08, M09. Limite: o aluno nunca nomeia doença, nunca escolhe
exame nem técnica para o paciente; a condição chega pela solicitação ou pela equipe, e
a resposta certa diante da dúvida é parar e levar à equipe.

| Aula | Título | Competência | O que o aluno faz |
| --- | --- | --- | --- |
| M16.01 | Condição clínica não é diagnóstico | Separar o que a solicitação informa do que o tecnólogo decide. | Classifica falas em "informação da solicitação" e "decisão de outro profissional". |
| M16.02 | Dor e mobilidade limitada | Adaptar a abordagem sem forçar o membro e pedir apoio. | Caso com decisão; marca todas as condutas seguras. |
| M16.03 | Falta de ar e quem não deita | Reconhecer quando a posição padrão não é possível e comunicar. | Julga afirmações; caso com decisão. |
| M16.04 | Gestação e possibilidade de gestação | Aplicar a triagem e encaminhar a dúvida, sem decidir o exame. | Ordena o fluxo da triagem ensinado na aula. |
| M16.05 | Isolamento e precauções | Escolher a barreira pela precaução indicada e organizar a sala. | Classifica medidas por tipo de precaução. |
| M16.06 | Quando a imagem não sai como o padrão | Reconhecer que corpo, gesso ou acúmulo de líquido mudam a imagem e que o ajuste segue o protocolo. | Caso integrador; aciona a equipe. |

Fontes previstas: CDC (precauções padrão e por transmissão, domínio público); IAEA
(RPOP, gestação e radiação); RadiologyInfo (segurança do paciente); Anvisa RDC
611/2022 para o que a norma diz sobre gestantes. Cada fato de segurança com fonte
institucional, nunca só wiki.

### S-OD — Radiologia odontológica (7 aulas)

Pré-requisitos: M04, M06, M08.04; M10 para a tomografia de feixe cônico. Limite: o
aluno não escolhe exame nem frequência de exame, não emite laudo e não executa fora do que a
lei e o serviço definem para o tecnólogo.

| Aula | Título | Competência | O que o aluno faz |
| --- | --- | --- | --- |
| S-OD.01 | Dentes e arcadas na imagem | Nomear grupos dentários e estruturas de suporte numa descrição. | Associa estrutura a descrição; completa a frase. |
| S-OD.02 | Equipamentos odontológicos | Distinguir aparelho intraoral, panorâmico e tomógrafo de feixe cônico pelo que cada um produz. | Classifica características por equipamento. |
| S-OD.03 | Radiografia intraoral | Diferenciar periapical, interproximal e oclusal pela finalidade e pela região. | Associa tipo a finalidade. |
| S-OD.04 | Panorâmica: posição e erros | Relacionar erro de posição da cabeça ao efeito na imagem. | Caso com decisão; julga afirmações. |
| S-OD.05 | Tomografia de feixe cônico | Explicar o que muda do campo de visão para a dose e para a imagem. | Marca todas as afirmações certas sobre campo de visão. |
| S-OD.06 | Proteção na odontologia | Aplicar justificação, colimação e barreiras, e seguir o protocolo do serviço para proteções do paciente. | Caso com decisão; ordena a conferência. |
| S-OD.07 | Caso integrador | Conferir identificação, posição e proteção num atendimento simulado e acionar a equipe. | Caso integrador com cinco decisões. |

Fontes previstas: Anvisa RDC 611/2022 e a instrução normativa de radiologia
odontológica (o autor confere o número e o texto antes de citar); FDA e ADA,
recomendações de seleção de radiografias odontológicas, como `factual-reference`;
diretriz europeia SEDENTEXCT para tomografia de feixe cônico; Lei 7.394/1985 e
resoluções do CONTER para o campo de atuação, só no que o texto lido sustentar.

### S-US — Ultrassonografia para o tecnólogo (6 aulas)

Pré-requisitos: M03.04, M10.01. Limite: o app não ensina a fazer nem a laudar exame de
ultrassom; a aula de atuação diz o que a fonte lida sustenta sobre quem executa e quem
emite o laudo, e o que não estiver sustentado vira "o serviço e a legislação definem".

| Aula | Título | Competência | O que o aluno faz |
| --- | --- | --- | --- |
| S-US.01 | Som, frequência e eco | Relacionar frequência, comprimento de onda e eco ao que o aparelho mede. | Completa a frase; julga afirmações. |
| S-US.02 | O transdutor | Explicar o efeito piezoelétrico e para que serve o gel. | Ordena o caminho do pulso ao eco. |
| S-US.03 | Frequência e profundidade | Prever que frequência alta melhora detalhe e perde profundidade. | Caso com decisão; classifica transdutores por uso. |
| S-US.04 | Modos e apresentação | Distinguir modo B, modo M e Doppler pelo que mostram. | Associa modo a informação. |
| S-US.05 | Artefatos e segurança | Reconhecer sombra e reforço como fenômenos físicos e aplicar o princípio de exposição mínima. | Marca todas as afirmações certas; julga afirmações. |
| S-US.06 | Onde o tecnólogo entra | Separar preparo de sala, equipamento e paciente da execução e do laudo, conforme a fonte. | Caso com decisão; classifica tarefas. |

Fontes previstas: NIBIB (ultrassom, domínio público); FDA (ultrassom de imagem);
RadiologyInfo; AIUM (declaração sobre exposição mínima, ALARA), como
`factual-reference`; texto legal brasileiro para o limite de atuação, só se lido.

## 3. Impacto em quem já tem progresso

A 1.5.0 está na loja desde 2026-11-11 com as 20 unidades, então há alunos com
progresso nelas. Lido em 2026-11-13 na branch da F2:

- Cada unidade é uma trilha própria (`track:rtg-2026:<unidade>`), sem composição entre
  elas (`createProductionCurriculumCatalog`, chamado sem `compositions`). Os nós de
  uma trilha só dependem de nós da mesma trilha.
- A ordem entre trilhas é a do array `RTG_2026_BATCHES`, gerado na ordem de
  `RTG_UNIT_ORDER` (`batches/rtgBatchFactory.ts`). As trilhas não declaram `order`, então
  `sortTracks` usa a posição no array.
- `resolveTrackAccess` (`journey/services/JourneyTrackUnlockService.ts`): a trilha N
  está aberta se N = 0 ou se a trilha N−1 está concluída. A própria conclusão de N não
  entra na conta.
- `resolveActiveTrackId`: a trilha ativa é a primeira aberta e não concluída.
  `JourneyProgressService.resolveTrackDefinition` usa essa regra para escolher a trilha
  da Home.

**Regras que passam a encontrar uma população nova se uma unidade entrar no meio**
(por exemplo, `m15` entre M03 e M04), para o aluno que já concluiu M04 ou além:

1. **Fechamento de trilha concluída.** M04 passa a depender de `m15`, que o aluno não
   concluiu. `unlocked` de M04 vira falso, embora M04 esteja concluída. O comentário da
   função promete o contrário ("uma trilha concluída continua desbloqueada"); o código
   não cumpre, e hoje ninguém encontra esse caso porque nenhuma trilha anterior fica
   incompleta depois de concluída.
2. **Trilha em andamento fechada.** Quem está no meio de M05 continua com M05 aberta
   (M04 concluída). Mas quem está no meio de M04 a vê fechar no meio do caminho.
3. **Volta da Home.** A trilha ativa passa a ser `m15`, a primeira aberta e não
   concluída, e a Home leva o aluno de M07, por exemplo, de volta para biologia.
4. **Ramos.** Inserir depois de M14 fecha S-TC para quem já está nele.

Nada disso "desconclui" nós (o progresso é guardado por nó e nenhum id muda), mas os
itens 1 a 3 bloqueiam ou desviam o aluno. **Não é possível pôr uma unidade no meio só
com dado.** Pela regra do brief, esta frente não muda o motor e leva a proposta ao
controlador.

**Decisão desta entrega (só dado):** as quatro unidades entram no fim de
`RTG_UNIT_ORDER`, depois de S-IR. Ninguém que já tem progresso é bloqueado nem desviado:
a última trilha de hoje (S-IR) continua com a mesma anterior, e as novas só se tornam a
trilha ativa para quem concluir S-IR. O custo é pedagógico: o aluno novo encontra
biologia depois dos ramos. O teste `rtgExpansionProgress.test.ts` prova o caso do aluno
com progresso antigo.

**Proposta ao controlador (mudança de motor, não feita aqui):**

1. Cumprir o comentário: trilha concluída fica aberta
   (`unlocked = index === 0 || previousCompleted || completed`).
2. Uma trilha só fecha a seguinte para quem ainda não chegou além dela: a trilha N fica
   aberta também quando o aluno já tem algum nó concluído em qualquer trilha depois de N.
3. A trilha ativa é a primeira aberta e não concluída **a partir da trilha mais adiante
   em que o aluno tem progresso**; uma unidade inserida atrás aparece como disponível,
   com selo de novidade, sem puxar a Home de volta.

Com 1 a 3, `m15` vai para depois de M03 e `m16` para depois de M09 só trocando a ordem
em `RTG_UNIT_ORDER`, e o teste de progresso antigo passa a cobrir a inserção no meio.
Os itens 2 e 3 tocam `JourneyTrackUnlockService` e `JourneyProgressService`, que não
são desta frente.

## 4. Depois destas quatro

Na ordem de valor para o aluno: ética, legislação e exercício profissional (núcleo,
logo depois de M01, se o motor aceitar inserção); radiologia industrial como ramo, com
ementa e fontes próprias; uma segunda unidade de fisiologia por sistemas, se a revisão
de M15 mostrar que seis aulas não bastam.
