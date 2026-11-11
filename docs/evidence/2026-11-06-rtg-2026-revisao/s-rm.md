# Parecer de revisão — S-RM

**Data:** 2026-11-06
**Revisor:** Claude (Opus 5.5), agente independente do autor, sob a ADR-2026-11-05

Esta é uma revisão feita por IA, não por profissional de radiologia. A unidade não foi testada no aplicativo. O verificador do repositório imprime OK no arquivo corrigido.

## Como a revisão correu

Foram duas rodadas. Na primeira, usei as 15 consultas à web permitidas, e 4 voltaram sem conteúdo: a página da UCSF respondeu 403, e os artigos de Krupa, Grover e Ridgway caíram na verificação de navegador do PMC, que não tentei contornar. O primeiro parecer foi de reprovação, porque os fatos de artefatos, spin-eco rápido, FLAIR e TR e TE curtos não tinham leitura minha.

Na segunda, o coordenador autorizou mais 5 consultas. Usei as 5, todas em fontes abertas (interface pública do Europe PMC, Case Western e FDA), e todas devolveram conteúdo. Li o texto de Krupa, o restante de Ridgway e a Case Western, e os fatos pendentes se confirmaram. Por isso, a aula de artefatos manteve os seis tipos. O parecer de M11 não foi usado como fonte.


## Achados e correções

| Aula/item | Problema | Correção aplicada | Fonte consultada |
| --- | --- | --- | --- |
| s-rm-02 conceito, ponto-chave 2, i4 | "Manter a ventilação" e "voltar só com oxigênio confirmado" vinham de um único aviso de recolhimento, sobre um modelo, encerrado em 2020. A segunda fonte não abriu. | Regra suavizada: sair, seguir o plano do serviço, voltar quando a equipe autorizar. A correta do i4 passou a ser "fica fora até ela autorizar a volta". | Recolhimento FDA; Harvard CBS; Shah e Aran |
| s-rm-08 recuperação de transferência | Mesma regra de fonte única, cobrada como correta ("deixar a ventilação ligada"). | A correta passou a ser "não mexer na ventilação e seguir a equipe", que vale com qualquer plano de serviço. Retornos reescritos. | Recolhimento FDA; Harvard CBS |
| s-rm-02 i4, s-rm-08 i5 | "Botão só para pessoal autorizado e treinado" vinha de um único procedimento local. | Retorno: acionar o quench não é decisão do estudante, siga o plano do serviço e peça apoio à equipe. O conceito de s-rm-02 agora ensina isso. | Harvard CBS, como exemplo |
| s-rm-02 conceito, i4; s-rm-08 recuperação | "Névoa fria" não aparece em nenhuma fonte lida. | Retirada. O caso descreve hélio na sala e o alarme do monitor, e o distrator passou a ser "volta assim que o alarme parar". | Recolhimento FDA; Shah e Aran |
| s-rm-03 conceito, i2 | "Zona II avalia a compatibilidade de objetos" não está na IN 97/2021 nem em Shah e Aran. | Trocado por anamnese e questões de segurança. | IN 97/2021, art. 8; Shah e Aran |
| s-rm-03 conceito, i2, conferência 1 | "Não acusa prata" dizia mais que a fonte. | "Pode não acusar", com o motivo: a prata não é ferrosa. | Baker e colaboradores |
| s-rm-03 i1 | A ajuda ("o rótulo mais cauteloso") entregava a resposta. | Ajuda reescrita. | n/a |
| s-rm-03 recuperação de transferência | Distrator sem plausibilidade ("óculos escuros"). | Trocado por "luvas isolantes". | IN 97/2021, art. 12 |
| s-rm-04 conferência 1 | "Passam perto de um clipe" não soa natural. Citava Krupa, que não li. | Enunciado reescrito. Fonte trocada por Ridgway, que diz o fato de forma literal. | Ridgway |
| s-rm-05 conceito | A conta de tempo contradizia "mais médias, mais tempo". O custo de detalhe do voxel maior não era ensinado. | "Com uma média" na conta e "menos detalhe" no voxel maior. | Ridgway; Radiopaedia |
| s-rm-05 conceito, conferência 2 | Imagem paralela e conjuntos de bobinas vinham só de Grover, que não abriu. O periódico também vinha de memória. | Fatos e fonte cortados. A conferência 2 agora cobra a troca do corte mais fino. | Radiopaedia |
| s-rm-05 i5 | Não era transferência: repetia a ideia do i2, mais passos de fase. | Novo item: mesma matriz e campo de visão maior. Mais sinal, menos detalhe, mesmo tempo. | Radiopaedia; Ridgway |
| s-rm-06 i2, ponto-chave 2 | A associação de região e movimento era inferida e fugia da competência da aula. | Item trocado por um pareamento de cabo, almofada, campainha e bobina danificada. | Baker e colaboradores |
| s-rm-06 i5 | Cobrava toalha úmida e suor, que a aula não ensinava. | Novo ponto-chave ensina os dois. | Baker e colaboradores |
| s-rm-06 conceito | "De barriga para cima" vinha de fonte que não li e nenhum item usava. | Cortado, com a fonte. | n/a |
| s-rm-06 conferência 1 | "O mesmo em qualquer ponto" destoava das faixas numéricas e denunciava o erro. | Trocado por "cerca de 5 a 7 cm", com o retorno recalculado. | Elster |
| s-rm-07 i1 | O enunciado trazia "por não ter pulso de 180°", e a correta repetia a expressão. A ajuda dizia "eco só com gradiente". | Pista retirada do enunciado e da ajuda. Fonte trocada por Ridgway. | Ridgway |
| s-rm-07 recuperação de transferência | "Cobertor" no enunciado entregava a correta. Tatuagem e líquor ensinavam fatos novos num retorno. | Enunciado limpo. Distratores trocados por metal no bolso e movimento na mesa. | n/a |
| s-rm-08 conceito, i5 | "Leva a um local seguro" omitia a ressalva da fonte. | "Quando o quadro permite"; o retorno diz que a equipe conduz a retirada. | Shah e Aran; Harvard CBS |
| s-rm-08 i3 | "Indica dispositivo ativo" era interpretação no retorno. | "Aponta um possível implante". | n/a |
| s-rm-08 i4, i5 | Ajudas levavam à resposta. "O ímã não pesa" não soa natural. | Ajudas e distrator reescritos. | n/a |
| s-rm-01 i5 | "O gradiente é bem mais fraco que o ímã" não tinha leitura minha. | O retorno diz só que a diferença de campo muda a frequência conforme a posição. | Ridgway |
| s-rm-04 encerramento | "Nome de sequência muda de fabricante para fabricante" não tinha fonte lida. | Fala trocada por uma sem afirmação de fato. | n/a |
| s-rm-08 recuperação guiada | O retorno não dizia por que a gestação vai à equipe, e a fonte citada não a lista na triagem. | "Que avalia o exame": em Shah e Aran, a avaliação e a decisão ficam com os profissionais. | Shah e Aran |
| `sources` | Fontes que eu não li ou que perderam o uso: Grover, MagLab, RadiologyInfo, Cleveland Clinic. Nota de licença de Ridgway não conferida. | As 4 removidas, citações trocadas, notas ajustadas. Cada uma das 11 restantes é citada por um item, e nenhum item cita fonte fora da lista. Krupa e Ridgway registram a leitura pelo Europe PMC. | n/a |

## Pontos marcados pelo autor

- **Quench:** resolvido por suavização, como descrito acima.
- **Emergência em s-rm-08 i5:** Shah e Aran e Harvard CBS concordam em tirar a pessoa da sala. Mantido, com a ressalva.
- **Campo constante:** Ridgway diz literalmente "strong, constant magnetic field"; a FDA diz "static"; o recolhimento diz que o quench remove o campo. A unidade não afirma "sempre ligado" e fica no que as fontes dizem. Mantido.
- **Sentidos em s-rm-05:** corretos. Radiopaedia diz literalmente que diminuir a matriz aumenta a relação sinal-ruído, e que passos de fase alongam a aquisição. A conta: com campo de visão fixo, o voxel cai com 1/N e a raiz dos passos sobe com √N, logo o sinal cai com 1/√N. Ridgway confirma o número de pixels e TR × passos.
- **TR e TE:** Ridgway diz que TR controla T1 e TE controla T2, e as definições de recuperação e queda sustentam o sentido do sinal. Só Radiopaedia afirma a relação com a relação sinal-ruído de forma literal, e o fato não é de segurança.
- **"50% a 75%":** confirmado na página de Elster, que é a única fonte. Não é fato de segurança, e o item diz que vale só para o esquema. Mantido.
- **Região e movimento:** removido.
- **IN 97/2021:** o portal da Anvisa a marca como vigente, em vigor desde 1º de julho de 2021.
- **Grover:** fonte removida da unidade.

## Fatos confirmados

Contas refeitas: 42,6 × 1,5 = 63,9 MHz; 42,6 × 3 = 127,8 MHz; 50% a 75% de 20 cm = 10 a 15 cm; 5 a 7 cm = 25% a 35% de 20 cm.

- **IN 97/2021:** vigente; porta abrindo para fora em sistema criogênico com tubo de quench (art. 3); sinalização (art. 5); contato audiovisual (art. 7); zonas e anamnese na zona II (art. 8); detecção de metais (art. 9); proteção auditiva para paciente, acompanhante e profissional na sala (art. 12): https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&tipo=INM&numeroAto=00000097&seqAto=000&valorAno=2021&orgao=DC/ANVISA/MS&codTipo=&desItem=&desItemFim=&cod_menu=1696&cod_modulo=134&pesquisa=true
- **Shah e Aran, Cureus, 2023:** tubo de quench e hélio na sala; monitor de oxigênio; porta trancada sem supervisão; triagem na zona II; 100 dB ou mais; profissional grávida fora da zona IV durante a série; doença renal na triagem; local magneticamente seguro: https://pmc.ncbi.nlm.nih.gov/articles/PMC10657250/
- **Recolhimento FDA, Philips Intera 1.5T, 2018:** o quench remove o campo; hélio levado para fora do prédio; hélio na sala dilui o oxigênio e pode asfixiar: https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfRes/res.cfm?id=162718
- **Harvard CBS:** queda de oxigênio no quench descontrolado; na emergência médica, parar a série e ajudar a pessoa a sair da sala: https://cbs.fas.harvard.edu/facilities/neuroimaging/investigators/mri-safety-policies/emergency-procedures
- **FDA:** campo estático atrai objetos, que podem virar projéteis; gradientes fazem ruído e estimulam nervos; RF aquece; status desconhecido é tratado como MR Unsafe; MR Conditional depende de condições; contraste com gadolínio tem risco: https://www.fda.gov/radiation-emitting-products/mri-magnetic-resonance-imaging/benefits-and-risks
- **Baker e colaboradores, 2024:** prata, cobre e fibra de carbono não ferrosos; cabos no centro, sem laço e sem tocar o paciente; almofadas secas e não condutoras; suor e toalha úmida; contato com a parede; equipamento danificado fora de uso; campainha; queixas dispensadas; monitorização insegura até ser conferida; artefato como sinal de corpo estranho, condutor ou falha de bobina: https://pmc.ncbi.nlm.nih.gov/articles/PMC11569411/
- **Ridgway, 2010:** 42,6 MHz/T e cerca de 64 MHz a 1,5 T; absorção só nessa frequência; ângulo por amplitude e duração; 63% e 37%; T2* reversível e T2 irreversível; ordem das bobinas; seleção de corte, fase e frequência; centro e bordas do espaço k; transformada de Fourier; pulsos do spin-eco; eco de gradiente mais afetado por metal; TR × passos; campo constante: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3016368/fullTextXML (artigo em https://pmc.ncbi.nlm.nih.gov/articles/PMC3016368/)
- **Krupa e Bekiesińska-Figatowska, Polish Journal of Radiology, 2015:** movimento gera fantasmas, e a peristalse borra a imagem; dobra por anatomia fora do campo de visão, projetada na ponta oposta; metal com perda de sinal e distorção, com eco de gradiente a evitar e spin-eco de TE curto a preferir; desvio químico em faixas escuras ou claras na interface entre gordura e água, com a bexiga de exemplo; truncamento em linhas claras e escuras alternadas junto a limites de alto contraste, confundível com siringe na medula; pico de ruído em padrão quadriculado, causado por estática de roupas ou cobertores; artefato confundível com doença: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4340093/fullTextXML (artigo em https://pmc.ncbi.nlm.nih.gov/articles/PMC4340093/)
- **Ridgway, segunda parte:** spin-eco rápido gera vários ecos com novos pulsos de 180°, cada eco preenche uma nova linha do espaço k, e o comprimento do trem define o fator de aceleração: mesma URL, com `offset` 100000.
- **Case Western:** T1 com TE e TR curtos (500/14 ms); T2 com TE e TR mais longos (4000/90 ms); FLAIR parecida com T2, com TE e TR muito longos (9000/114 ms) e líquor escuro: https://case.edu/med/neurology/NR/MRI%20Basics.htm
- **Shah e Aran, gestação de paciente:** a decisão sobre gadolínio e o adiamento do exame ficam com os profissionais; a triagem não lista gestação de forma literal, e o item cobra só a conduta de levar a informação à equipe: https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10657250/fullTextXML
- **FDA, projéteis:** chaves e celulares, cilindros de oxigênio e enceradeiras, na mesma página da FDA citada acima. Shah e Aran citam camas e cadeiras não compatíveis, base da maca do caso.
- **Radiopaedia:** sentidos de TR, TE, voxel, espessura, campo de visão, matriz, médias e largura de banda: https://radiopaedia.org/articles/signal-to-noise-ratio-mri
- **Elster:** alcance de 50% a 75% do diâmetro; sensibilidade cai com a profundidade: https://mriquestions.com/receive-only-coils.html

## O que não pude verificar

Nada do que ficou na unidade como afirmação de fato está nesta lista.

| Item | Onde estava | O que foi feito |
| --- | --- | --- |
| Botão de quench só por pessoal autorizado (um procedimento local) | s-rm-02, s-rm-08 | Removido como fato. Ficou o limite de papel do estudante. |
| Manter a ventilação e voltar só com oxigênio confirmado (um aviso sobre um modelo) | s-rm-02, s-rm-08 | Suavizado para seguir o plano do serviço e a equipe. |
| Névoa fria | s-rm-02, s-rm-08 | Removido. |
| Compatibilidade de objetos na zona II | s-rm-03 | Removido. |
| Imagem paralela e conjuntos de bobinas | s-rm-05, s-rm-06 | Removido. |
| Região e movimento; posição de barriga para cima; tatuagem; gradiente mais fraco que o ímã; nome de sequência por fabricante | s-rm-01, s-rm-04, s-rm-06, s-rm-07 | Removido. |
| Gestação como item literal da triagem | s-rm-08, recuperação guiada | Suavizado: nenhum texto afirma isso, e o item cobra levar a informação à equipe. |
| Fala de Caio: "cada nome de sequência que nem parece parente" (s-rm-04, cena); "ninguém ficaria meia hora no aparelho" (s-rm-05, cena) | Cenas | Mantidas só porque são fala de personagem, sem afirmação de fato cobrada. |
| Baker: últimos 41 mil caracteres | n/a | Não lidos, e a unidade não os usa. Tudo o que ela cita está na parte lida. |

## Observações sem correção

- Nos itens de segurança, a correta é quase sempre a que leva a informação à equipe. É a conduta que a unidade quer fixar, mas torna esses itens previsíveis.
- Nenhum item recompensa liberar implante, dispositivo ou entrada, escolher exame ou sequência, alterar parâmetro, decidir sobre contraste, acionar quench ou conduzir emergência. Conferi as oito aulas.
- As conferências usam as quatro posições, quatro vezes cada.

Resultado: aprovado com correções
