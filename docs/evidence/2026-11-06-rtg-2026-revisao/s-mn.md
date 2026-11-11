# Parecer de revisão — S-MN

Data: 2026-11-07

Revisor: Claude (Opus 5.5), agente independente do autor, sob a ADR-2026-11-05

Esta é uma revisão feita por IA, não por profissional de radiologia ou de medicina nuclear. Foram usadas as 15 consultas web do orçamento. Linter: OK. `sources` sem fonte sobrando nem faltando (13 fontes). Nenhuma cópia de PDF ficou guardada.

## Achados corrigidos

| Aula/item | Problema | Correção aplicada | Fonte consultada |
| --- | --- | --- | --- |
| S-MN.07, cena | Paciente de PET em repouso "no corredor". A norma pede sala exclusiva, com espaços individualizados, para administração e repouso em PET | A fala agora cita a sala de repouso | ANSN 3.05, art. 14, IX |
| S-MN.04, conceito, i2, i4 | Ordem do derramamento apoiada num só procedimento hospitalar estrangeiro; retorno de i4 afirmava "primeiro as pessoas, depois a equipe" | Mantida como ordem didática declarada; conceito acrescenta "No serviço vale o plano dele; chamar não espera"; i4 sem a sequência temporal; fonte IAEA somada | VUMC; IAEA SRS 40, 7.4.4 |
| S-MN.03, i5 | Afirmava que "o supervisor usa" o monitor, sem apoio; a norma manda monitorar roupas, sem nomear o instrumento; a ajuda entregava a resposta | Enunciado pergunta qual instrumento do serviço responde; ajuda reescrita; fonte IAEA no lugar da VUMC | ANSN 3.05, arts. 20 e 43; IAEA SRS 40, 4.8 |
| S-MN.03, conceito, conferência 2 | "Barra a maioria" e "tão poucos fótons": a leitura da fonte só sustentou a restrição de ângulos e o limite de sensibilidade | Texto reduzido ao que a fonte diz | Peterson e Furenlid |
| S-MN.03, conceito, recuperação guiada | "Iodeto de sódio" não confirmado em trecho lido | Trocado por "cristal cintilador" | Peterson e Furenlid |
| S-MN.07, conferência 1 | Dizia que a respiração afeta a correção; o trecho lido só sustenta o desalinhamento | Alternativa e retorno limitados ao desalinhamento; retornos dos distratores ajustados, inclusive "a aula não trata disso", que não explicava o erro | Pettinato 2006 |
| S-MN.07, conceito, i4 | Afirmação sobre metal e marca-passo com verbo forte ("distorcer"), de artigo de 2006 | "Pode gerar artefato"; retorno passa a dizer "pode importar"; a conduta certa continua sendo avisar | Pettinato 2006; RadiologyInfo PET |
| S-MN.07, conferência 2 | Espera de captação estava fora da competência da aula | Item novo sobre braços elevados e truncamento, mesma posição de resposta | Pettinato 2006 |
| S-MN.07, i3 | Respostas repetiam a palavra do termo (correção, anatomia) | Pares reescritos sem a pista | Willowson e Bailey 2024; Pettinato 2006 |
| S-MN.07, recuperação guiada | Alternativa com redação estranha | "Em ângulo reto, um para cada lado" | Não se aplica |
| S-MN.06, cena | "Antes do primeiro paciente" soava como regra; a norma diz "diário ou no dia em que a câmara for utilizada" | Caio atribui ao serviço: "Neste serviço, o teste do dia vem antes da agenda" | ANSN 3.05, Anexo II |
| S-MN.06, conceito, conferência 1 | A conferência cobrava "baixa densidade de contagem", termo não ensinado | Conceito passou a nomear o teste; frase da planar condensada para caber no limite | ANSN 3.05, Anexo II |
| S-MN.06, objetivo e competência | Frequência era ensinada e cobrada, mas não declarada | Objetivo e competência incluem a frequência | ANSN 3.05, Anexos II e V |
| S-MN.06, i3 | "Contagem de fundo" repetia o termo | "Como está a contagem da sala?" | ANSN 3.05, Anexo II |
| S-MN.02 i4, S-MN.03 i4, S-MN.04 i4 e cena | "Limpar pode espalhar" e "costuma levar material para mais longe" sem fonte direta | "Limpar pede treino e técnica"; fala de Caio reescrita sem o fato | IAEA SRS 40, 7.4.3 |
| S-MN.02, i4 | "Transportar também é manipular" não está na norma | "Mover o embalado também é tarefa de pessoal autorizado" | ANSN 3.05, arts. 4 e 18 |
| S-MN.04, título do conceito | "Parar antes de limpar" sugeria que o estudante limpa depois | "Parar, afastar, chamar" | Não se aplica |
| S-MN.04, i2 | "Feita em segundos" sem fonte | Retirado; entra "sem demora" e o plano do serviço | Não se aplica |
| S-MN.04, i3 | Ajuda entregava dois pares | Ajuda reescrita | Não se aplica |
| S-MN.04, i1 | Retorno ia além do que foi lido na página do CDC | "Material radioativo em contato com a roupa é contaminação" | CDC |
| S-MN.04, recuperação guiada | Frase-gancho não levava ao item | Gancho sobre quem limpa a gota | Não se aplica |
| S-MN.04, competência | Conferência 1 cobra rotina de monitoração, ausente da competência | Competência inclui a rotina de monitoração | ANSN 3.05, art. 43 |
| S-MN.05, conceito | Bebida com açúcar era cobrada (i2, conferência 1) sem estar no conceito | "Só com água, nada açucarado ou calórico" | RadiologyInfo PET |
| S-MN.05, recuperação guiada | Citava a página de PET para amamentação, conferida na de medicina nuclear | `sourceIds` ajustados | RadiologyInfo Medicina Nuclear |
| Fontes | Referência sem ano; faltava fonte internacional para derramamento | Willowson com ano; `iaea-srs-40` incluída, com aviso de que foi substituída | PMC; IAEA |

## Pontos pedidos para conferir

- **ANSN 3.05 vigente?** A lista de normas da CNEN, atualizada em 17/06/2026, traz a norma (Resolução CNEN 159/13, DOU de 17/12/2013) sem aviso de revogação ou alteração. Li o texto integral. Limite: não há leitura posterior a essa data, e a busca apontou listas de "normas em elaboração" que não abri.
- **Derramamento (S-MN.04 i2 e i4).** A ordem não vem de nenhuma fonte, e as fontes divergem: a IAEA começa por informar o responsável de proteção; a VUMC afasta primeiro e chama por último. As duas concordam no essencial: quem não está envolvido sai, o responsável é chamado, e a limpeza é de pessoal treinado. Fica como convenção didática, declarada no conceito e no enunciado, com a ressalva do plano do serviço. Não achei fonte brasileira específica: a ANSN 3.05 só exige treinamento em acidentes (art. 4 e Anexo I) e o aviso ao supervisor (art. 12).
- **S-MN.06.** Todas as periodicidades conferem. A cena foi corrigida.
- **S-MN.07 i4 e metal.** Sustentados só por Pettinato 2006, além da frase geral do RadiologyInfo sobre metal e TC. Texto suavizado. O acerto do item não depende desse fato, e sim de avisar antes da aquisição.
- **S-MN.03 i5.** A VUMC sustenta a checagem de roupa com detector portátil, mas em procedimento de derramamento. A sustentação melhor é a IAEA 4.8 somada aos arts. 20 e 43. Item corrigido.

## Fatos confirmados em página lida

**ANSN 3.05** ([PDF](https://www.gov.br/cnen/pt-br/acesso-rapido/normas/grupo-3/ansn-3-05-requisitos-de-seguranca-e-protecao-radiologica-para-servicos-de-medicina-nuclear.pdf); [lista da CNEN](https://www.gov.br/cnen/pt-br/acesso-rapido/normas/grupo-3)):

- Pessoal treinado e autorizado (art. 4, VIII, a); instrução a paciente, acompanhante e lactante (art. 7, VII).
- Conferência antes de administrar (art. 13, IV); sala de espera exclusiva (art. 14, I).
- Teste após reparo determinado pelo supervisor (art. 23, §1º).
- Inspeção do embalado (art. 32); luvas, jaleco, monitores e troca mensal (art. 35); aferição prévia da atividade (art. 36).
- Levantamento radiométrico (art. 42); monitoração diária e a cada suspeita (art. 43).
- Gravidez (art. 45); exposição diferente da pretendida (art. 46); falhas de paciente, órgão ou dose (art. 11, X, c).
- Identificação, segregação e registro de rejeitos (arts. 63, 64 e 67).
- Anexo II: uniformidade em baixa densidade, janela de energia e radiação de fundo em A D (diário ou dia de uso); centro de rotação em A M; co-registro SPECT-CT em A T.
- Anexo IV: co-registro PET/CT em A T. Anexo V: repetibilidade diária, ±5%.

**Outras fontes:**

- [OMS](https://www.who.int/news-room/fact-sheets/detail/ionizing-radiation-and-health-effects): becquerel, meia-vida, iodo-131 com 8 dias, gray, sievert, limiar e probabilidade.
- [World Nuclear Association](https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/radioisotopes-in-medicine): Tc-99m 6 h, Mo-99 66 h, eluição salina, F-18 110 min, FDG como principal radiofármaco do PET, duas horas de um cíclotron, par de gamas em direções opostas.
- [Health Physics Society](https://hps.org/publicinformation/ate/q13187/): ionização no DNA ou muito perto dele; água e radicais livres.
- [RadiologyInfo, medicina nuclear](https://www.radiologyinfo.org/en/info/gennuclear): coleta de informações, joias, medo de lugar fechado, câmara próxima, eliminação em horas e dias.
- [RadiologyInfo, PET/CT](https://www.radiologyinfo.org/en/info/pet): jejum, água, diabetes, 30 a 60 minutos em repouso, TC menor que 2 minutos, PET de 20 a 30 minutos.
- [Pettinato 2006](https://pmc.ncbi.nlm.nih.gov/articles/PMC3097808/): metal, marca-passo, respiração, truncamento e braços elevados.
- [Willowson e Bailey 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC13274653/): TC para correção de atenuação e localização.
- [Peterson e Furenlid](https://pmc.ncbi.nlm.nih.gov/articles/PMC3178269/): colimador, cintilador, posição, soma de energia, janela e rotação.
- [NIBIB](https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine): carreador, projeções e reconstrução 3D, aniquilação.
- [CDC](https://www.cdc.gov/radiation-emergencies/infographic/contamination-versus-exposure.html): material em contato com pele, cabelo ou roupa.
- [VUMC](https://www.vumc.org/safety/sites/default/files/public_files/rad/vch/nuclear-medicine-emergency-procedures-vch.pdf): condutas em derramamento.
- [IAEA SRS 40](https://www-pub.iaea.org/MTCD/publications/PDF/Pub1207_web.pdf): itens 4.8, 7.4.3 e 7.4.4.

Todos os números foram recalculados: 80 para 10 em 6 h; um quarto em 1 h; um oitavo em 24 dias; e os valores dos distratores.

## O que não consegui verificar

| Item | Destino |
| --- | --- |
| Colimador bloqueia a maioria dos fótons | Suavizado para o limite de sensibilidade |
| Cristal de iodeto de sódio | Removido da unidade; o material não foi confirmado em trecho lido |
| Respiração prejudica a correção de atenuação | Removido do item; o trecho lido cobre o desalinhamento |
| Limpeza inadequada espalha material | Removido; ficou "pede treino e técnica" |
| Marca-passo em fonte recente | Suavizado com "pode"; lido só em Pettinato 2006 |
| Ordem do derramamento | Mantida só porque não é afirmação de fato: é convenção didática declarada |
| "Antes do primeiro paciente" | Mantido na cena só porque não é afirmação de fato: é a rotina do serviço fictício |
| Texto atual da IAEA SSG-46 | Não aberto. A SRS 40 lida está marcada como substituída por ela, e a fonte traz esse aviso. Ela só sustenta princípios gerais, que coincidem com a VUMC e com a ANSN 3.05 |
| Alteração da ANSN 3.05 depois de 17/06/2026 | Não verificável na lista lida. A unidade não usa a palavra "vigente". Vale reconferir a lista na admissão |

A RDC 611/2022 não foi aberta, e a unidade não atribui nada a ela.

## Limites profissionais

Nenhum item premia preparar, fracionar, administrar, escolher radiofármaco ou atividade, calcular atividade para paciente, liberar paciente, descontaminar, descartar ou corrigir registro sozinho. Os cálculos de meia-vida usam amostras fictícias, fora de atendimento. Teste fora da tolerância, derramamento e suspeita de paciente ou dose errados vão à equipe e ao supervisor.

Resultado: aprovado com correções
