# Parecer de revisão — S-TC

Data: 2026-11-06
Revisor: Claude (Opus 5.5), agente independente do autor, sob a ADR-2026-11-05

Esta é uma revisão feita por IA. Não é revisão de profissional de radiologia, e não comprova a exatidão clínica além do que as fontes abaixo sustentam. Usei o limite de 15 consultas à web e, a pedido do coordenador, mais 5 para três fatos pendentes; duas dessas 5 falharam (arquivo grande demais e erro do servidor).

## Achados e correções

| Aula/item | Problema | Correção aplicada | Fonte consultada |
| --- | --- | --- | --- |
| 03, i4 | "CTDIvol não é dose do paciente" era fato de segurança apoiado só em fonte de tipo wiki | Incluída segunda fonte; o retorno correto diz que a dose depende também do corpo de cada pessoa | McCollough 2011 |
| 03, i5 | O caso dizia que "os demais parâmetros de aquisição" eram iguais, e a resposta certa era uma diferença de aquisição (comprimento varrido) | O caso agora diz que mAs, kV e pitch são iguais | Radiopaedia CTDI |
| 03, conceito e cp1 | Modelo de quadruplicar a corrente sem limite claro | "Só neste esquema, com o resto igual"; cp1 traz a mesma condição | StatPearls física |
| 03, conceito | "Mais kV: menos ruído" era mais forte que a fonte ("may reduce") | "Tende a menos ruído, com mais dose" | StatPearls física |
| 02, conceito | Não dizia o que acontece com pitch acima de 1, embora os itens usem esse caso | Acrescentado "acima de 1, deixa intervalos" | StatPearls física |
| 02, conceito | "Velocidade constante" não foi conferido nas fontes abertas | Trocado por "a mesa anda enquanto o conjunto gira" | Não houve; afirmação retirada |
| 05, cp1 | Cobrava quem define a velocidade da injeção, fora da competência da aula, e a fonte descreve prática estrangeira | Item substituído por reconhecimento de sinal grave e aviso na hora; frase retirada do conceito | RadiologyInfo contraste |
| 05, i2 | "Sinal leve: avise a equipe" sugeria que o aviso podia esperar, contrariando o conceito | "Sinal leve: avise na hora" | RadiologyInfo contraste |
| 05, i4 | "A diretriz" sem dizer qual; a ajuda antecipava a urgência da resposta | "A diretriz europeia", interromper a injeção e consultar o médico; ajuda reescrita | ESUR 2022 |
| 05, i5 | "Registro a fala" podia soar como alterar registro sozinho | "Anoto a fala e levo à equipe" | RadiologyInfo contraste, StatPearls contraste |
| 05, cp0 | Citava a página de TC de abdome, que não abri | Citação e fonte retiradas; a página de TC de tórax sustenta o jejum | RadiologyInfo tórax |
| 06, conceito e i3 | "Injeção rápida durante a aquisição" sem sustentação nas fontes abertas | "As imagens são obtidas enquanto o contraste passa pelos vasos"; nova fonte | RadiologyInfo angio-TC |
| 07, conceito | "Joias e outros metais" no grupo do paciente: a Radiopaedia põe joias no paciente, mas o artefato de metal na física | Restrito a "joias e objetos de metal usados pelo paciente" | Radiopaedia artefatos, StatPearls física |
| 07, cp0 | "Que mudança técnica tende a reduzir" aproximava o aluno de escolher técnica | Passou a prever em que série o efeito aparece menos; mudar a técnica fica com a equipe | StatPearls física |
| 07, i5 | A ajuda apontava quem decide, entregando a resposta | Ajuda reescrita | Não se aplica |
| 01, cp0 | Três alternativas com "Pode exercer" e a correta com forma diferente | Alternativas com forma paralela ("Ele pode ficar", "Ele não pode") | RDC 611/2022, arts. 56 e 57 |
| 01, rec. transfer | Mesma pista de forma; retorno citava um quadro que o conceito não ensina | "Ele não fica: aviso a equipe"; retorno ajustado | RDC 611/2022, art. 53 |
| 01, i4 | A ajuda citava "placa da sala", termo não ensinado | "Regra da sala" | RDC 611/2022, art. 53 |
| 08, rec. transfer | Mesma pista de forma; "ramo" é jargão | "Não pode: operar exige formação e supervisão"; "essa unidade" | Não se aplica |
| 08, i1 | Retorno chamava a parte do aluno de "avaliação da imagem" | "Descrição da imagem" | Não se aplica |
| 04, conceito | Construção truncada ("a por aprendizado profundo") | "A reconstrução por aprendizado profundo" | Não se aplica |

| 01, conceito e i2 | "Osso cortical perto de 800 HU" vinha de tabela lida desalinhada, e a Radiopaedia dá cortical acima de 1000 e trabecular de 300 a 800 | "Osso: centenas de HU ou mais", no conceito e no par | Radiopaedia Hounsfield, Burbridge |
| 04 i2 e rec. transfer, 06 i1, 08 i3 | "Kernel duro: mais ruído" era inferência, sem fonte direta lida | Afirmação mantida; incluída fonte que a declara | Tanabe 2022 |
| 04, conceito, i4 e fechamento | A resposta certa dependia de reconstruir com outro kernel sem nova exposição, sem fonte lida | Frase retirada; o aluno descreve a falta à equipe e pergunta como seguir | Nenhuma fonte lida sustenta a afirmação |
| 04, cp1 | Recompensava "nenhuma nova exposição" ao trocar o kernel | Item substituído: prever pixel e resolução com campo de visão menor e mesma matriz | StatPearls física |
| 04, i2 | Enunciado afirmava reconstruir os mesmos dados duas vezes | Passou a descrever duas séries da mesma aquisição; retorno do distrator ajustado | StatPearls física |
| 08, i4 | Retorno dizia que a origem mostra o que pede nova exposição, incluindo o kernel | Retorno passou a falar do que levar à equipe | Não se aplica |

| 01, conceito e i2 | Pulmão "perto de -600" e tecido mole "entre 20 e 40" vinham da tabela desalinhada de Burbridge; a Radiopaedia dá -950 a -650 HU para pulmão e valores por órgão de 25 a 50 HU | Valores alinhados à Radiopaedia, com "conforme o órgão" no conceito e "sem contraste" no enunciado; o i2 agora cita só a Radiopaedia | Radiopaedia Hounsfield |

Total: 28 achados corrigidos. Fontes: entraram McCollough 2011, RadiologyInfo angio-TC, Radiopaedia Hounsfield e Tanabe 2022; saiu RadiologyInfo TC de abdome. O linter imprime OK, e toda fonte listada é citada por algum item.

## Pontos marcados para conferência

- **CTDIvol não é dose:** confirmado em duas fontes. McCollough também diz que nem CTDIvol nem DLP servem para estimar dose efetiva ou risco de um paciente individual.
- **Quadruplicar a corrente:** confirmado no StatPearls (dobra a relação sinal-ruído, quadruplica a dose). A fonte fala em dose, não em indicador, e o texto segue a fonte. A proporcionalidade do indicador não foi lida em fonte direta, e nenhum item a cobra.
- **CTDIvol = CTDIw/pitch:** confirmado na Radiopaedia, que é fonte única de tipo wiki. É definição, não fato de segurança.
- **Pitch:** 1 sem sobreposição, abaixo de 1 com sobreposição, acima de 1 com intervalos. Confirmado.
- **Aula 05:** o aluno só transmite, e nenhum item recompensa decidir, prescrever, administrar ou conduzir. O i4 está correto: a ação recompensada é avisar, e interromper fica com a equipe.
- **Aula 08, i5:** mantido sem alteração. Há uma só resposta defensável, os distratores têm erro identificável e nenhum pede diagnóstico.

## Fatos confirmados, com URL

- Filtro, colimador, gantry, pitch, relação mA e sinal-ruído, kV e iodo, espessura de corte, retroprojeção filtrada, reconstrução iterativa e por aprendizado profundo, kernels, campo de visão, anéis, arco elétrico, movimento, metal, endurecimento e volume parcial: https://www.ncbi.nlm.nih.gov/sites/books/NBK597347/
- CTDIw, CTDIvol, DLP e índices como saída do sistema: https://radiopaedia.org/articles/ct-dose-index-1
- CTDI não é dose do paciente; DLP como produto com o comprimento: https://pmc.ncbi.nlm.nih.gov/articles/PMC3079120
- Reação anterior como maior fator de risco, ausência de relação com alergia a frutos do mar e tempo das fases conforme a indicação: https://www.ncbi.nlm.nih.gov/sites/books/NBK557794/
- Perguntas antes do iodado, sinais leves e graves, erupção horas a dias depois: https://www.radiologyinfo.org/en/info/safety-contrast
- Relatar dor ou inchaço, interromper a injeção, consultar o médico responsável: https://pmc.ncbi.nlm.nih.gov/articles/PMC9038843/
- Jejum, joias, avental, gravidez e borrão por movimento: https://www.radiologyinfo.org/en/info/chestct
- Imagens obtidas enquanto o contraste passa pelos vasos: https://www.radiologyinfo.org/en/info/angioct
- Convenção de lado, reformatação sem nova exposição, limitar a faixa: https://med.libretexts.org/Bookshelves/Allied_Health/Undergraduate_Diagnostic_Imaging_Fundamentals_(Burbridge_and_Mah)/03%3A_Principles_of_Imaging_Techniques/3.06%3A_Computed_Tomography_(CT)
- Teste de constância (art. 2º, XII), dever de informar (art. 23, III), acompanhante (arts. 37, 56 e 57), protocolos escritos (art. 38, § 4º), quadro da sala (art. 53): https://cbr.org.br/wp-content/uploads/2023/08/RDC-ANVISA-de-2022-no-611_Requisitos-sanitarios-de-organizacao-e-funcionamento-de-servico-de-radiologia-diagnostica-ou-intervencionista.pdf
- Artefatos em três grupos, faixas escuras no endurecimento, artefato pode imitar doença: https://radiopaedia.org/articles/ct-artifacts
- Valores sem contraste: pulmão de -950 a -650 HU, gordura subcutânea de -100 a -115 HU, órgãos de tecido mole de 25 a 50 HU, osso cortical acima de 1000 HU e trabecular de 300 a 800 HU: https://radiopaedia.org/articles/hounsfield-unit
- Kernel duro com aumento de ruído na imagem: https://pmc.ncbi.nlm.nih.gov/articles/PMC8801695/

## O que não consegui verificar

- **Trocar o kernel sem nova exposição:** nenhuma fonte lida afirma isso, então a afirmação saiu da aula 04. Tanabe 2022 trata de conversão entre imagens, não de nova reconstrução dos dados brutos. Ficou como premissa de caso, sem ser cobrada como fato sobre refazer a reconstrução: duas séries "da mesma aquisição" com kernels diferentes (04 i2 e cp0, 08 i3 e cp1, e a cena da 04). A afirmação geral de que reconstrução e apresentação usam dados já medidos (04 i3 e rec. guiada, 08 conceito) continua, apoiada na descrição da reconstrução no StatPearls.
- **Prazo de guarda dos dados brutos:** não achei fonte, e a aula não afirma prazo.
- **Fonte de "kernel duro: mais ruído":** Tanabe 2022 declara o aumento de ruído no contexto de TC de tórax. É fonte única direta. O StatPearls é coerente com ela, ao dizer que a suavização reduz a variação entre pixels ao custo da resolução.
- **Valores em HU da aula 01:** todos vêm agora de uma só fonte de tipo wiki, a Radiopaedia, sem segunda fonte lida. A faixa de tecido mole (25 a 50 HU) é um resumo meu dos valores por órgão que ela lista. Não são fatos de segurança.
- **Artigo de Barrett e Keat (RadioGraphics 2004):** a página recusou a leitura (403). A classificação dos artefatos ficou em Radiopaedia e StatPearls, que divergem em parte quanto ao metal: a aula segue a primeira só para objetos usados pelo paciente.
- **Faixas escuras e imitação de doença:** as duas têm só a Radiopaedia como apoio direto. Não são fatos de segurança, mas ficam com fonte única.
- **Valores em HU na M10:** a busca por "HU" na M10 só achou água e ar, então os demais valores são ensinados no conceito da aula 01, embora ele diga que "voltam".
- **Conferência por amostragem:** não abri todas as afirmações comuns de física ao mesmo nível, nem conferi a Norma ANSN 3.01, que a unidade não cita. A prática brasileira de injeção e os protocolos de jejum não foram conferidos em fonte nacional; por isso a aula remete sempre ao serviço.
- **Operação real:** a unidade não comprova operação de tomógrafo, e diz isso na aula 08.

Resultado: aprovado com correções
