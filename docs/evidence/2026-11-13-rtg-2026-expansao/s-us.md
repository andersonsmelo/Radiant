# Parecer de revisão — S-US

Data: 2026-11-13
Revisor: Claude (Opus 5.5, claude-opus-5-5), agente independente do autor, sob a ADR-2026-11-05

Esta é uma revisão feita por IA, conferida contra fontes públicas lidas nesta sessão. Não substitui a revisão de um profissional de radiologia.

## Achados e correções

| Aula/item | Problema | Correção aplicada | Fonte consultada |
| --- | --- | --- | --- |
| S-US.01 conceito | Valores de λ (1,5 mm a 1 MHz; 0,3 mm a 5 MHz) eram conta do autor, sem fonte lida. A conta está certa (1540/10⁶ = 1,54 mm; 1540/5×10⁶ = 0,31 mm), mas inferência não é fonte (guia, seção 6, item 14). | Números retirados; o conceito passa a dizer que, com a velocidade fixa, dobrar a frequência reduz λ à metade, que é o que i1 cobra. | ACEP Sonoguide |
| S-US.01 i3, 4ª afirmação | Retorno dizia que o ultrassom é "a única modalidade do app sem radiação ionizante". Falso: o app tem S-RM (ressonância magnética). | Retorno reescrito: o ultrassom é som e não produz radiação ionizante como a dos raios X. | FDA, NIBIB; `content-manifest/rtg-2026/aulas/s-rm.json` existe |
| S-US.02 conferência 1, alternativa 1 | O retorno de erro ("Não é esse o papel do gel") não explicava o erro. | Retorno passa a dizer o que o gel faz: ocupa o espaço onde ficaria ar. | NIBIB |
| S-US.02 fala de fechamento (Caio) | A frase "primeiro suspeito do físico" soava estranha. | Fala simplificada. | Linguagem |
| S-US.03 i1, alternativa correta | Erro de redação: "propriedade piezoelétrica do cristal piezoelétrica". | Corrigido. | Linguagem |
| S-US.04 i4, alternativa 3 | O retorno afirmava que a imagem 3D "reúne cortes num volume", sem fonte lida. | Reescrito para "mostra volume, não uma linha acompanhada no tempo" (o NIBIB cita 2D, 3D e 4D). | NIBIB |
| S-US.04 recuperação de transferência, alternativa 4 | O retorno da elastografia dizia "não o fluxo" numa questão sobre a linha no tempo: explicava o erro errado. | Passa a dizer "não uma linha no tempo". | ACEP |
| S-US.04 i5 (cloze de transferência) | Duas lacunas, "velocidade" e "direção", que podem ser trocadas de lugar sem erro: a seção 3a não aceita isso. Além disso, era a frase do conceito, sem contexto novo. | Uma lacuna só ("a direção e a {{1}}"), num contexto novo (Doppler numa artéria do braço). Os distratores femininos foram mantidos, então a gramática não denuncia a resposta. Retornos e ajuda foram reescritos. | NIBIB |
| S-US.05 cena (Caio) | "Antes de ligar de novo" punha o aluno operando o aparelho. | Reescrito sem a ação. | Limite profissional |
| S-US.05 i3, 1ª afirmação | O retorno citava um "órgão regulador" sem dizer qual. | Retorno nomeia FDA e AIUM: a menor exposição que ainda dê a informação diagnóstica. | FDA, AIUM |
| S-US.06 i3 (categorize) | O item "Definir quem executa a varredura no serviço" continha a palavra "serviço", do nome do grupo "Lei e serviço definem", e isso dava pista. | Rótulo trocado por "Definir quem faz a varredura em cada clínica". | Guia 3a |
| S-US.06 i3 e recuperação de transferência | "Assinar o relatório" não é o termo da lei. | Trocado por "Emitir o laudo do exame (de imagem)", termo do inciso VII. Retorno da recuperação cita a lei. | Lei 12.842/2013 |
| S-US.06 i3, fontes | O item sobre o gel citava só a RadiologyInfo, que não fala de gel. | `nibib-us` acrescentado. | RadiologyInfo, NIBIB |
| S-US.06 conferência 2 | O enunciado terminava em "nesta aula", o que soava estranho. O retorno de acerto ("O curso não qualifica ninguém") não explicava a resposta. | Enunciado: "Pelo que esta aula sustenta, quem define…". Retorno: a aula não afirma quem executa; a lei e o serviço definem. | Lei 12.842/2013 |

## Pontos que o autor pediu para conferir

1. **"Apoio de preparo" em S-US.06.** A moldura é aceitável. O conceito apresenta o preparo como apoio dentro da simulação supervisionada e não diz que a lei o atribui a alguém. A RadiologyInfo sustenta a orientação sobre joias e roupa ("leave jewelry at home"). O NIBIB sustenta o uso do gel. "Organizar a sala" é uma tarefa do limite do curso, não um fato normativo.
2. **Categorize de S-US.03.** A ACEP sustenta a classificação: transdutor linear de alta frequência para estruturas superficiais e vasos; curvilíneo de baixa frequência para o abdome; phased array de baixa frequência, com face pequena para o espaço entre as costelas. A relação entre frequência e profundidade está no sentido certo: frequência alta dá mais resolução e menos penetração. O item classifica o princípio físico e não escolhe exame para paciente. O conceito diz isso. Mantido.
3. **Posições na conferência.** As 12 conferências têm a resposta certa 3 vezes em cada uma das posições 1, 2, 3 e 4. Nos 41 itens de escolha da unidade, a distribuição é 8, 12, 11 e 10; o máximo fica em 29%.

## Fatos confirmados

- Ultrassom acima de 20 kHz; transdutores na faixa dos MHz; cristais cerâmicos piezoelétricos que emitem e recebem; o gel evita bolsas de ar; o eco nasce em fronteiras entre tecidos; a distância vem do tempo de retorno e da velocidade do som; o Doppler mostra velocidade e direção do fluxo e tem o mapa colorido; a elastografia mostra a rigidez relativa; há apresentação em 2D, 3D e 4D: https://www.nibib.nih.gov/science-education/science-topics/ultrasound
- Velocidade de cerca de 1540 m/s em tecido mole; uso diagnóstico típico entre 2 e 20 MHz; frequência alta dá mais resolução e menos penetração; atenuação por absorção; usos dos transdutores linear, curvilíneo e phased array; modo B em tons de cinza; modo M como uma linha do modo B ao longo do tempo; sombra atrás de refletor forte (ar) ou de estrutura que absorve o som (cálculos, osso); reforço atrás de estrutura sem ecos (bexiga): https://acep.org/sonoguide/physics.html
- Sem radiação ionizante; o ultrassom pode aquecer levemente os tecidos e causar cavitação; os profissionais devem seguir o ALARA; o uso não médico (vídeo de lembrança) é desencorajado; o risco pode crescer com exposição prolongada sem necessidade: https://www.fda.gov/radiation-emitting-products/medical-imaging/ultrasound-imaging
- ALARA: a menor potência que dê imagem diagnóstica e o menor tempo de varredura necessário; reduzir o tempo de transdutor parado no mesmo ponto. Isso sustenta o caso de segurança de S-US.05: https://www.aium.org/resources/official-statements/view/as-low-as-reasonably-achievable-(alara)-principle
- Joias e roupa; o médico radiologista interpreta e assina o relatório (contexto dos EUA, não usado como norma brasileira): https://www.radiologyinfo.org/en/info/genus
- Lei 12.842/2013, art. 4º, VII: a emissão de laudo dos exames endoscópicos e de imagem é atividade privativa do médico. O § 7º manda aplicar o artigo de forma que sejam resguardadas as competências próprias do técnico e do tecnólogo de radiologia, entre outras profissões. Os dois dispositivos não foram vetados. A lei não menciona ultrassonografia nem diz quem executa o exame; por isso a unidade mantém "a lei e o serviço definem": https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12842.htm

## O que não pude verificar e o destino de cada ponto

- Valores numéricos de comprimento de onda: **removidos** (ver tabela).
- "Única modalidade do app sem radiação ionizante": **removido**, porque é falso.
- "A imagem 3D reúne cortes num volume": **suavizado** para o que o NIBIB sustenta.
- "Organizar a sala e o gel antes do paciente" como apoio de preparo: **mantido** porque não é afirmação factual nem normativa. É a moldura da simulação supervisionada, declarada no conceito.
- O que a faixa de 2 a 20 MHz e os 1540 m/s afirmam está confirmado na página da ACEP, uma fonte institucional de sociedade médica. Não são fatos de segurança, então uma fonte basta. Mantidos.

Nenhum fato da unidade ficou sem verificação.

Resultado: aprovado com correções. Os fatos de física, segurança e lei conferem com as fontes lidas, depois de retirar uma afirmação falsa e uma conta sem fonte. Os itens ficaram com uma resposta defensável cada e respeitam o limite profissional. O verificador imprime OK.
