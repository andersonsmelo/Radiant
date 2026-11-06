// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M12: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m12",
  "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343",
  "trackId": "track:rtg-2026:m12",
  "unitId": "unit:rtg-2026:m12",
  "contentVersion": "rtg-2026-m12-v1",
  "competencyIds": [
    "competency:rtg-2026:m12:aula-01",
    "competency:rtg-2026:m12:aula-02",
    "competency:rtg-2026:m12:aula-03",
    "competency:rtg-2026:m12:aula-04",
    "competency:rtg-2026:m12:aula-05",
    "competency:rtg-2026:m12:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m12:nci-seer-breast-anatomy",
      "title": "Breast Anatomy (SEER Training Modules: Breast Cancer)",
      "publisher": "National Cancer Institute, SEER Program",
      "url": "https://www.training.seer.cancer.gov/breast/anatomy.html",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional do NCI; consultada para fatos de anatomia (lobos, lóbulos, ductos, gordura, ligamentos, peitoral maior, quadrantes e prolongamento axilar), sem reprodução de texto nem de figuras."
    },
    {
      "id": "source:rtg-2026:m12:radiologyinfo-mammography",
      "title": "Mammography",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/mammo",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página de orientação ao paciente; consultada para fatos sobre preparo, relato ao profissional, compressão, imobilidade, incidências de rotina e quem interpreta, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m12:cbr-parecer-compressao-2022",
      "title": "Parecer sobre sistema de compressão dos mamógrafos: testes de controle de qualidade e compressão clínica (4 de outubro de 2022)",
      "publisher": "Colégio Brasileiro de Radiologia, Comissão Nacional de Mamografia",
      "url": "https://cbr.org.br/wp-content/uploads/2022/11/Parecer-sobre-compressao-das-mamas-durante-a-mamografia.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Parecer institucional; consultado para fatos sobre efeitos da compressão, compressão firme e tolerável, atenção à pessoa e testes diários, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m12:anvisa-in-92-2021",
      "title": "Instrução Normativa nº 92, de 27 de maio de 2021 (republicada em 6 de julho de 2022)",
      "publisher": "Anvisa",
      "url": "https://ses.sp.bvs.br/wp-content/uploads/2022/07/U_IN-MS-ANVISA-92-REP_270521.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal, lido em cópia da republicação mantida pela BVS da SES-SP; consultados os arts. 2º, 6º e 7º, sem reprodução de texto. A tabela do Anexo I não pôde ser lida e não é citada."
    },
    {
      "id": "source:rtg-2026:m12:anvisa-rdc-611-2022",
      "title": "RDC nº 611, de 9 de março de 2022",
      "publisher": "Anvisa",
      "url": "https://cbr.org.br/wp-content/uploads/2023/08/RDC-ANVISA-de-2022-no-611_Requisitos-sanitarios-de-organizacao-e-funcionamento-de-servico-de-radiologia-diagnostica-ou-intervencionista.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal; consultado para fatos (arts. 17, 23, 24, 38 e 53), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
      "title": "Diagnostic Radiology Physics: A Handbook for Teachers and Students, capítulo 9, Mammography (slides)",
      "publisher": "IAEA, Human Health Campus",
      "url": "https://humanhealth.iaea.org/HHW/MedicalPhysics/TheMedicalPhysicist/Studentscorner/HandbookforTeachersandStudents/Chapter_09.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Material didático da IAEA; consultados os slides 4 e 7 a 17 para espectro de baixa energia, compressão, grade e controle automático de exposição, sem reprodução de texto ou figuras."
    },
    {
      "id": "source:rtg-2026:m12:popli-2014-breast-positioning",
      "title": "Breast Positioning during Mammography: Mistakes to be Avoided",
      "publisher": "Breast Cancer: Basic and Clinical Research (via PubMed Central)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4125373/",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto (CC BY-NC 3.0); consultado para critérios de posicionamento na CC e na MLO, sem reprodução de texto nem de figuras."
    },
    {
      "id": "source:rtg-2026:m12:sweeney-2018-cc-criteria",
      "title": "A review of mammographic positioning image quality criteria for the craniocaudal projection",
      "publisher": "The British Journal of Radiology (via PubMed Central)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5965788/",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Artigo de revisão disponível no PubMed Central; consultado para a regra de 1 cm entre CC e MLO e a presença do peitoral na CC, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
      "title": "Atualização em mamografia para técnicos e tecnólogos em radiologia, 3ª edição revista e atualizada (2023)",
      "publisher": "Instituto Nacional de Câncer (INCA), Ministério da Saúde",
      "url": "https://ninho.inca.gov.br/jspui/bitstream/123456789/15417/1/3a%20edicao_Atualizacao%20em%20mamografia.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Publicação institucional sob CC BY-NC-SA 4.0; consultada só para fatos (critérios de qualidade da CC e da MLO, comparação de 1 cm entre as duas e anotação de resíduo de desodorante na ficha), sem reprodução de texto nem de figuras."
    },
    {
      "id": "source:rtg-2026:m12:radiologyinfo-dxa",
      "title": "Bone Density Scan (DEXA or DXA)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/dexa",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página de orientação ao paciente; consultada para fatos sobre princípio de dupla energia, regiões medidas, preparo, posicionamento, limitações e acompanhamento no mesmo aparelho, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m12:iscd-official-positions-adult-2023",
      "title": "2023 ISCD Official Positions: Adult",
      "publisher": "International Society for Clinical Densitometry (ISCD)",
      "url": "https://iscd.org/learn/official-positions/adult-positions/",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Posições oficiais da sociedade; consultadas para regiões de medida (L1 a L4, fêmur proximal, antebraço), artefatos, acompanhamento no mesmo aparelho e registro de limitações técnicas, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m12:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-mammography",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022",
          "source:rtg-2026:m12:nci-seer-breast-anatomy",
          "source:rtg-2026:m12:anvisa-rdc-611-2022",
          "source:rtg-2026:m12:popli-2014-breast-positioning"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Anatomia e acolhimento",
            "body": "Hoje você vai conseguir relacionar as estruturas da mama ao exame e conduzir um acolhimento respeitoso antes de posicionar.",
            "dialogue": {
              "setting": "Sala de mamografia do laboratório de simulação",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "É minha primeira mamografia. Disseram que aperta. Vai doer muito?"
                },
                {
                  "speaker": "caio",
                  "text": "Aperta, sim, mas eu explico cada passo antes de encostar na senhora. Pode perguntar o que quiser."
                },
                {
                  "speaker": "pixel",
                  "text": "Antes de posicionar, duas perguntas: o que existe dentro da mama, e o que essa pessoa precisa ouvir de você?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "A mama por dentro, a pessoa por inteiro",
            "body": "Cada mama tem de 15 a 20 lobos, divididos em lóbulos e ligados ao mamilo por ductos. A gordura envolve esse tecido glandular e dá volume e forma. Ligamentos prendem a mama à parede do tórax, sobre o músculo peitoral maior. A região se descreve em quatro quadrantes, a parte central e o prolongamento em direção à axila. O acolhimento segue uma ordem: apresentar-se e conferir a identificação, explicar o exame e a compressão, ouvir o que a pessoa relata, pedir licença antes de tocar e combinar o aviso de dor. A compressão é firme, mas precisa ser tolerável.",
            "keyPoints": [
              "Glândula (lobos, lóbulos, ductos), gordura e ligamentos, sobre o peitoral maior.",
              "O tecido mamário se estende em direção à axila.",
              "Explicar, ouvir, pedir licença e combinar o aviso de dor."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de geometria e qualidade, você viu o que o movimento faz com a imagem. O que previne esse problema antes da exposição?"
            },
            "help": "Pense no que acontece antes de a exposição começar, não depois.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Quem entende o que vai acontecer colabora melhor. Na mamografia, essa conversa começa antes do posicionamento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de geometria e qualidade, você viu o que o movimento faz com a imagem. O que previne esse problema antes da exposição?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-01:i1:a",
                  "label": "Aumentar o brilho da tela depois da aquisição",
                  "explanation": "Brilho muda a exibição. O borrão de movimento já está gravado na imagem."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i1:b",
                  "label": "Orientar a pessoa e combinar que fique imóvel",
                  "explanation": "Quem entende o que vai acontecer colabora melhor. Na mamografia, essa conversa começa antes do posicionamento."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i1:c",
                  "label": "Recortar a imagem só na área que ficou mais nítida",
                  "explanation": "Recorte só esconde parte da imagem. Retome: o movimento se previne antes."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i1:d",
                  "label": "Repetir a exposição sem avisar a equipe",
                  "explanation": "Repetir é nova exposição e não é decisão solitária. Confira de novo o que se faz antes de expor."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada estrutura da mama ao que ela é ou faz, como descrito nesta aula."
            },
            "help": "Pergunte de cada estrutura: ela produz, conduz, preenche ou apoia?",
            "type": "matching",
            "feedback": {
              "correct": "Você separou glândula, caminho até o mamilo, preenchimento e apoio. É esse conjunto que o exame precisa mostrar inteiro.",
              "incorrect": "Algum par trocou o que produz com o que conduz ou com o que sustenta. Retome: lobos produzem, ductos conduzem, o peitoral fica atrás."
            },
            "payload": {
              "prompt": "Ligue cada estrutura da mama ao que ela é ou faz, como descrito nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-01:i2:1",
                  "left": "Lobos e lóbulos",
                  "right": "Tecido glandular, onde o leite é produzido"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-01:i2:2",
                  "left": "Ductos",
                  "right": "Tubos finos que levam ao mamilo"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-01:i2:3",
                  "left": "Gordura",
                  "right": "Envolve a glândula e dá volume e forma"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-01:i2:4",
                  "left": "Músculo peitoral maior",
                  "right": "Fica atrás da mama, na parede do tórax"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Coloque na ordem ensinada nesta aula os passos do acolhimento antes de posicionar para a mamografia."
            },
            "help": "O que a pessoa precisa saber antes de alguém encostar nela?",
            "type": "ordering",
            "feedback": {
              "correct": "A pessoa sabe quem é você e o que vai acontecer antes de ser tocada, e sabe que pode avisar se doer. A técnica começa depois disso.",
              "incorrect": "Algum passo de toque veio antes da explicação ou da escuta. Retome a ordem do conceito: primeiro quem é você e o que será feito."
            },
            "payload": {
              "prompt": "Coloque na ordem ensinada nesta aula os passos do acolhimento antes de posicionar para a mamografia.",
              "items": [
                {
                  "id": "item:rtg-2026:m12:aula-01:i3:4",
                  "label": "Pedir licença antes de tocar"
                },
                {
                  "id": "item:rtg-2026:m12:aula-01:i3:2",
                  "label": "Explicar o exame e a compressão"
                },
                {
                  "id": "item:rtg-2026:m12:aula-01:i3:3",
                  "label": "Ouvir o que a pessoa tem a relatar"
                },
                {
                  "id": "item:rtg-2026:m12:aula-01:i3:1",
                  "label": "Apresentar-se e conferir a identificação"
                },
                {
                  "id": "item:rtg-2026:m12:aula-01:i3:5",
                  "label": "Combinar o aviso de dor"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m12:aula-01:i3:1",
                "item:rtg-2026:m12:aula-01:i3:2",
                "item:rtg-2026:m12:aula-01:i3:3",
                "item:rtg-2026:m12:aula-01:i3:4",
                "item:rtg-2026:m12:aula-01:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "O que mudou entre o pedido escrito e o que a pessoa acabou de contar?",
            "type": "case-decision",
            "feedback": {
              "correct": "Possível gravidez e sintoma novo são informações para a equipe avaliar antes de qualquer exposição. Agenda atrasada não muda isso.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, Dona Marta conta, enquanto se prepara, que acha que pode estar grávida e que sentiu um caroço na mama esquerda há um mês. O pedido médico fala em exame de rotina. O mamógrafo está pronto e a agenda está atrasada.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-01:i4:a",
                  "label": "Seguir o exame e contar à equipe no final",
                  "explanation": "Contar no final deixa a equipe sem a informação quando ela importa: antes da exposição. Retome o que se faz com um relato novo."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i4:b",
                  "label": "Dizer a ela que um caroço como esse não costuma ser nada grave",
                  "explanation": "Isso é opinião clínica, e não cabe a você. O relato dela se registra e se encaminha."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i4:c",
                  "label": "Pausar, registrar o relato e avisar a equipe antes de expor",
                  "explanation": "Possível gravidez e sintoma novo são informações para a equipe avaliar antes de qualquer exposição. Agenda atrasada não muda isso."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i4:d",
                  "label": "Trocar o exame por outro que você julga melhor",
                  "explanation": "Escolher exame é decisão de quem solicita e da equipe médica. Confira de novo o seu papel aqui."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-01:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Duda diz que a mama acaba na borda que se vê por fora. Pela anatomia desta aula, que região também contém tecido mamário e precisa ser lembrada no exame?"
            },
            "help": "Releia como a aula descreve a região: quadrantes, parte central e mais uma coisa.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O tecido mamário avança em direção à axila. Por isso uma das incidências de rotina é pensada para alcançar essa região.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Duda diz que a mama acaba na borda que se vê por fora. Pela anatomia desta aula, que região também contém tecido mamário e precisa ser lembrada no exame?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-01:i5:a",
                  "label": "O prolongamento da mama em direção à axila",
                  "explanation": "O tecido mamário avança em direção à axila. Por isso uma das incidências de rotina é pensada para alcançar essa região."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i5:b",
                  "label": "O músculo do braço, que faz parte da glândula",
                  "explanation": "Músculo do braço não é tecido mamário. Retome para onde a glândula se prolonga."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i5:c",
                  "label": "A pele das costas, onde ficam os ductos",
                  "explanation": "Os ductos ficam dentro da mama e levam ao mamilo. Confira de novo a descrição da região."
                },
                {
                  "id": "option:rtg-2026:m12:aula-01:i5:d",
                  "label": "A parte central, que não contém tecido",
                  "explanation": "A parte central contém o mamilo e a aréola e faz parte da mama. A pergunta é sobre o que fica além da borda visível."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-01:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Estrutura e respeito, juntos",
            "body": "Agora você consegue nomear as estruturas da mama, dizer onde ela se apoia e até onde se estende, e conduzir o acolhimento na ordem ensinada. O relato da pessoa não é detalhe: é informação que você registra e leva à equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quem entende o que vai acontecer costuma tolerar melhor a compressão. Cuidado também é qualidade de imagem."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m12:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022",
          "source:rtg-2026:m12:anvisa-in-92-2021",
          "source:rtg-2026:m12:anvisa-rdc-611-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Cadeia técnica da mamografia",
            "body": "Hoje você vai conseguir dizer o que cada parte do mamógrafo faz e o que conferir antes do primeiro atendimento.",
            "dialogue": {
              "setting": "Sala de mamografia, antes do primeiro atendimento",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Parece um aparelho de raios X comum, só que menor. Por que não usar o da sala ao lado?"
                },
                {
                  "speaker": "caio",
                  "text": "Porque a mama é tecido mole, com pouca diferença entre as partes. Aqui cada peça foi pensada para isso."
                },
                {
                  "speaker": "lia",
                  "text": "E antes de atender a primeira pessoa do dia, o que você olha nesse conjunto?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Um equipamento feito para a mama",
            "body": "O mamógrafo tem um tubo de raios X próprio, com feixe de baixa energia, que realça pequenas diferenças entre tecidos moles. O feixe atravessa a bandeja de compressão e a mama, passa pela grade, que barra a radiação espalhada, e chega ao detector. Comprimir reduz a espessura, espalha os tecidos e imobiliza a mama: menos sobreposição, menos borrão e menos dose. O controle automático de exposição ajusta a técnica à espessura e à composição da mama. Antes de atender, confira pelo protocolo: bandeja íntegra e bem fixada, grade no lugar, indicação de força funcionando e avaliação diária da imagem em dia. Algo fora do esperado: pare e avise.",
            "keyPoints": [
              "Caminho do feixe: tubo, bandeja, mama, grade, detector.",
              "Comprimir: menos sobreposição, menos borrão, menos dose.",
              "Equipamento com defeito não se contorna: pare e avise."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Ao estudar campo e colimação, você viu que parte da radiação se espalha no corpo. O que essa radiação espalhada faz com a imagem?"
            },
            "help": "Pense em uma névoa sobre a imagem: o que ela esconde?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A radiação espalhada soma um véu à imagem e diminui o contraste. Na mama, onde as diferenças já são pequenas, isso pesa muito.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Ao estudar campo e colimação, você viu que parte da radiação se espalha no corpo. O que essa radiação espalhada faz com a imagem?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-02:i1:a",
                  "label": "Aumenta a nitidez das bordas mais finas",
                  "explanation": "Radiação espalhada não afina bordas. Ela chega ao detector fora do lugar e atrapalha."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i1:b",
                  "label": "Amplia a imagem no detector",
                  "explanation": "Ampliação vem das distâncias entre fonte, objeto e detector. Retome o efeito do espalhamento."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i1:c",
                  "label": "Corrige o movimento da pessoa",
                  "explanation": "Nada na radiação espalhada corrige movimento. Confira de novo o que ela faz com as diferenças de tom."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i1:d",
                  "label": "Reduz o contraste entre as estruturas",
                  "explanation": "A radiação espalhada soma um véu à imagem e diminui o contraste. Na mama, onde as diferenças já são pequenas, isso pesa muito."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada componente do mamógrafo à função principal descrita nesta aula."
            },
            "help": "Siga o feixe e pergunte de cada peça: ela produz, comprime, barra ou ajusta?",
            "type": "matching",
            "feedback": {
              "correct": "Cada peça resolve um problema da mama: pouco contraste, espessura desigual, espalhamento e variação de uma pessoa para outra.",
              "incorrect": "Algum par trocou quem produz, quem comprime, quem filtra o espalhamento e quem ajusta a técnica. Retome o caminho do feixe."
            },
            "payload": {
              "prompt": "Ligue cada componente do mamógrafo à função principal descrita nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-02:i2:1",
                  "left": "Tubo de raios X",
                  "right": "Produz o feixe de baixa energia"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-02:i2:2",
                  "left": "Bandeja de compressão",
                  "right": "Reduz a espessura e imobiliza a mama"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-02:i2:3",
                  "left": "Grade antidifusora",
                  "right": "Barra a radiação espalhada"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-02:i2:4",
                  "left": "Controle automático de exposição",
                  "right": "Ajusta a técnica à espessura e à composição"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, siga o caminho do feixe, do tubo até a imagem."
            },
            "help": "O que fica acima da mama, e o que fica abaixo dela?",
            "type": "ordering",
            "feedback": {
              "correct": "Esse é o caminho. Saber a ordem ajuda a localizar um problema: antes da mama, na mama ou depois dela.",
              "incorrect": "Alguma etapa saiu do lugar. Retome: a bandeja fica entre o tubo e a mama, e a grade fica entre a mama e o detector."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, siga o caminho do feixe, do tubo até a imagem.",
              "items": [
                {
                  "id": "item:rtg-2026:m12:aula-02:i3:1",
                  "label": "O tubo produz o feixe de baixa energia"
                },
                {
                  "id": "item:rtg-2026:m12:aula-02:i3:5",
                  "label": "O detector registra a imagem"
                },
                {
                  "id": "item:rtg-2026:m12:aula-02:i3:2",
                  "label": "O feixe atravessa a bandeja de compressão"
                },
                {
                  "id": "item:rtg-2026:m12:aula-02:i3:4",
                  "label": "A grade barra a radiação espalhada"
                },
                {
                  "id": "item:rtg-2026:m12:aula-02:i3:3",
                  "label": "O feixe atravessa a mama comprimida"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m12:aula-02:i3:1",
                "item:rtg-2026:m12:aula-02:i3:2",
                "item:rtg-2026:m12:aula-02:i3:3",
                "item:rtg-2026:m12:aula-02:i3:4",
                "item:rtg-2026:m12:aula-02:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a conduta adequada?"
            },
            "help": "A peça com defeito é justamente a que encosta na pessoa. O que a aula diz sobre algo fora do esperado?",
            "type": "case-decision",
            "feedback": {
              "correct": "Bandeja danificada ou mal fixada impede o uso do mamógrafo. Você para e comunica, e a equipe decide o que fazer com a agenda.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "No início do turno, na simulação, você encaixa a bandeja de compressão e nota uma rachadura perto da borda. Ela ainda prende no trilho, mas balança um pouco. A primeira paciente já está na sala de espera.",
              "prompt": "Qual é a conduta adequada?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-02:i4:a",
                  "label": "Não usar o equipamento e avisar a equipe",
                  "explanation": "Bandeja danificada ou mal fixada impede o uso do mamógrafo. Você para e comunica, e a equipe decide o que fazer com a agenda."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i4:b",
                  "label": "Usar assim mesmo e comprimir com menos força",
                  "explanation": "Menos força não conserta a bandeja e ainda piora a imagem. O defeito continua lá."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i4:c",
                  "label": "Colar com fita e avisar a equipe depois",
                  "explanation": "Improviso em peça que comprime a mama é risco para a pessoa, e avisar depois não desfaz o atendimento. Retome o que fazer com algo fora do esperado."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i4:d",
                  "label": "Atender sem bandeja, só com o suporte",
                  "explanation": "Sem compressão não há mamografia adequada. Confira de novo a regra do conceito para equipamento com defeito."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-02:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Duas mamas ficam com espessuras bem diferentes depois de comprimidas, e a técnica de exposição muda de uma para a outra sem que ninguém digite valores. Que parte do sistema fez esse ajuste?"
            },
            "help": "Separe as peças que agem sobre o feixe ou sobre a mama da parte que regula a exposição.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Ele usa a espessura e a composição da mama para ajustar a técnica. Por isso precisa estar funcionando antes do atendimento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Duas mamas ficam com espessuras bem diferentes depois de comprimidas, e a técnica de exposição muda de uma para a outra sem que ninguém digite valores. Que parte do sistema fez esse ajuste?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-02:i5:a",
                  "label": "A grade antidifusora, sob o suporte",
                  "explanation": "A grade só barra radiação espalhada. Ela não escolhe técnica."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i5:b",
                  "label": "A bandeja de compressão, por conta própria",
                  "explanation": "A bandeja comprime e informa a espessura, mas quem define a técnica é outro sistema."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i5:c",
                  "label": "O controle automático de exposição",
                  "explanation": "Ele usa a espessura e a composição da mama para ajustar a técnica. Por isso precisa estar funcionando antes do atendimento."
                },
                {
                  "id": "option:rtg-2026:m12:aula-02:i5:d",
                  "label": "O monitor da sala de laudos",
                  "explanation": "O monitor exibe a imagem pronta. Retome quem age antes e durante a exposição."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Do tubo ao detector",
            "body": "Agora você consegue seguir o feixe do tubo ao detector, dizer por que a mama é comprimida, o que a grade e o controle automático fazem, e reconhecer o que precisa estar em ordem antes do primeiro atendimento. Defeito não se contorna: comunica-se.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Bandeja trincada não é detalhe. É motivo para parar a sala e chamar alguém."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m12:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:nci-seer-breast-anatomy",
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:sweeney-2018-cc-criteria",
          "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:m12:anvisa-rdc-611-2022",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Posicionamento e cobertura",
            "body": "Hoje você vai conseguir conferir, a partir de uma descrição, os critérios de cobertura das incidências CC e MLO.",
            "dialogue": {
              "setting": "Estação de conferência da sala de simulação",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje não tem imagem na tela. Eu descrevo cada mamografia em palavras, e você me diz qual critério foi cumprido."
                },
                {
                  "speaker": "duda",
                  "text": "São duas incidências por mama, né? Uma de cima para baixo e uma inclinada."
                },
                {
                  "speaker": "pixel",
                  "text": "Craniocaudal e médio-lateral oblíqua. O que cada uma precisa mostrar para a mama aparecer inteira?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Duas incidências, a mama inteira",
            "body": "Na craniocaudal (CC), o feixe vai de cima para baixo: o mamilo fica de perfil e apontando para a frente, os lados medial e lateral aparecem, e a gordura atrás da glândula indica que o tecido posterior entrou. Na médio-lateral oblíqua (MLO), o conjunto é inclinado: o músculo peitoral aparece e desce pelo menos até a altura do mamilo, a axila e o sulco inframamário, a dobra sob a mama, entram, e o mamilo fica de perfil. A profundidade de tecido, medida do mamilo para trás, não deve diferir mais de 1 cm entre as duas. Você confere o critério técnico. Achado é assunto do médico.",
            "keyPoints": [
              "CC: mamilo de perfil, lados medial e lateral, gordura posterior.",
              "MLO: peitoral até a altura do mamilo, axila e sulco inframamário.",
              "Entre CC e MLO, a profundidade não difere mais de 1 cm."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na primeira aula desta unidade, você viu até onde o tecido mamário se estende. Que região além da borda visível a incidência oblíqua precisa alcançar?"
            },
            "help": "Volte à descrição da mama na primeira aula: além dos quadrantes e da parte central, para onde a glândula avança?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A inclinação da MLO existe para trazer essa região e o músculo peitoral para dentro da imagem.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na primeira aula desta unidade, você viu até onde o tecido mamário se estende. Que região além da borda visível a incidência oblíqua precisa alcançar?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-03:i1:a",
                  "label": "O prolongamento em direção à axila",
                  "explanation": "A inclinação da MLO existe para trazer essa região e o músculo peitoral para dentro da imagem."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i1:b",
                  "label": "A região do ombro e da parte alta do braço",
                  "explanation": "Ombro e braço não contêm tecido mamário. Retome a descrição da região na primeira aula."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i1:c",
                  "label": "A parte alta do abdome",
                  "explanation": "O abdome fica abaixo do sulco inframamário, fora da mama."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i1:d",
                  "label": "A região entre as escápulas",
                  "explanation": "As escápulas ficam nas costas. Confira de novo para onde a glândula se prolonga."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-03:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Lia descreve quatro imagens. Ligue cada descrição ao critério técnico que não foi cumprido."
            },
            "help": "Em cada descrição, ache a palavra que nomeia a referência anatômica.",
            "type": "matching",
            "feedback": {
              "correct": "Você deu nome a cada falha sem dizer nada sobre doença. É assim que se descreve um problema de posicionamento.",
              "incorrect": "Algum par trocou a referência. Retome: mamilo, peitoral, sulco inframamário e profundidade são quatro critérios diferentes."
            },
            "payload": {
              "prompt": "Lia descreve quatro imagens. Ligue cada descrição ao critério técnico que não foi cumprido.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-03:i2:1",
                  "left": "Mamilo apontando para o lado, na CC",
                  "right": "Mamilo de perfil e para a frente"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-03:i2:2",
                  "left": "Peitoral termina acima do mamilo, na MLO",
                  "right": "Extensão do músculo peitoral"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-03:i2:3",
                  "left": "Dobra sob a mama cortada, na MLO",
                  "right": "Inclusão do sulco inframamário"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-03:i2:4",
                  "left": "CC com 2 cm a menos de profundidade que a MLO",
                  "right": "Diferença máxima de 1 cm entre as duas"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Quais critérios técnicos desta descrição não foram cumpridos?"
            },
            "help": "Compare a descrição com a lista da MLO, uma referência por vez.",
            "type": "case-decision",
            "feedback": {
              "correct": "O peitoral deveria descer até a altura do mamilo, e a dobra sob a mama deveria aparecer. São duas falhas de cobertura.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Lia descreve uma MLO da mama direita de uma paciente simulada: o músculo peitoral aparece no alto da imagem e termina bem acima da altura do mamilo. O mamilo está de perfil. A dobra sob a mama não aparece.",
              "prompt": "Quais critérios técnicos desta descrição não foram cumpridos?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-03:i3:a",
                  "label": "Mamilo de perfil e inclusão da gordura posterior na imagem",
                  "explanation": "O mamilo está de perfil, e a gordura posterior é o critério ensinado para a CC. Confira de novo a descrição."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i3:b",
                  "label": "Extensão do peitoral e inclusão do sulco inframamário",
                  "explanation": "O peitoral deveria descer até a altura do mamilo, e a dobra sob a mama deveria aparecer. São duas falhas de cobertura."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i3:c",
                  "label": "Só o mamilo, que deveria apontar para o lado",
                  "explanation": "Na MLO o mamilo fica de perfil, como descrito. As falhas estão em outras referências."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i3:d",
                  "label": "Nenhum: uma MLO não precisa mostrar o peitoral",
                  "explanation": "O peitoral é referência central da MLO. Retome o conceito desta aula."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-03:i3:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz antes de responder a ela?"
            },
            "help": "Há uma falha técnica e um relato de dor. Quem precisa saber dos dois antes de uma nova exposição?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você nomeia a falha, conta o relato de dor e decide com a equipe se e como repetir. A pessoa recebe uma explicação honesta sobre o passo técnico.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, a CC da mama esquerda de Dona Rita saiu com o mamilo de perfil, mas a parte lateral da mama ficou fora da imagem. Ela diz que a compressão doeu e pergunta se já acabou. Caio está na sala ao lado.",
              "prompt": "O que você faz antes de responder a ela?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-03:i4:a",
                  "label": "Repetir na hora, com mais força, sem avisar ninguém",
                  "explanation": "Repetir é nova exposição, e mais força ignora a dor que ela relatou. Essa decisão não é só sua."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i4:b",
                  "label": "Enviar assim e não comentar com ninguém",
                  "explanation": "Uma falha de cobertura conhecida e não comunicada deixa o médico sem saber o que faltou."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i4:c",
                  "label": "Dizer a ela que a imagem veio com alteração",
                  "explanation": "Falar em alteração soa como resultado e assusta. O problema é técnico, e quem fala de resultado é o médico."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i4:d",
                  "label": "Descrever o critério que falhou e decidir com Caio",
                  "explanation": "Você nomeia a falha, conta o relato de dor e decide com a equipe se e como repetir. A pessoa recebe uma explicação honesta sobre o passo técnico."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-03:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na ficha de auditoria de posicionamento de outro serviço, a profundidade do mamilo para trás da mesma mama aparece assim: 10 cm na MLO e 8,5 cm na CC. O que essa comparação indica?"
            },
            "help": "Calcule a diferença e compare com o limite do conceito.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A diferença passa de 1 cm, e a CC é a mais curta. É um sinal técnico para descrever e levar à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na ficha de auditoria de posicionamento de outro serviço, a profundidade do mamilo para trás da mesma mama aparece assim: 10 cm na MLO e 8,5 cm na CC. O que essa comparação indica?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-03:i5:a",
                  "label": "A MLO ampliou a imagem da mama mais do que deveria",
                  "explanation": "A regra compara cobertura, não ampliação. Retome o limite de diferença entre as duas incidências."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i5:b",
                  "label": "As duas estão dentro da diferença aceita",
                  "explanation": "A diferença descrita é de 1,5 cm. Confira de novo o limite ensinado."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i5:c",
                  "label": "A CC pode ter deixado tecido posterior de fora",
                  "explanation": "A diferença passa de 1 cm, e a CC é a mais curta. É um sinal técnico para descrever e levar à equipe."
                },
                {
                  "id": "option:rtg-2026:m12:aula-03:i5:d",
                  "label": "A mama mudou de tamanho entre as imagens",
                  "explanation": "A mama é a mesma. O que muda é quanto dela entrou em cada imagem."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-03:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Critério nomeado, sem laudo",
            "body": "Agora você consegue ouvir a descrição de uma CC ou de uma MLO e dizer qual critério de cobertura foi cumprido e qual falhou: mamilo, peitoral, sulco inframamário, gordura posterior e a regra de 1 cm. Com o critério nomeado, a decisão de repetir é tomada com a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Você descreve posicionamento. O que a imagem significa para a paciente, quem diz é o médico."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m12:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:radiologyinfo-mammography",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022",
          "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:m12:anvisa-rdc-611-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Qualidade e documentação",
            "body": "Hoje você vai conseguir decidir quando corrigir, registrar ou chamar a equipe diante de um problema técnico na mamografia.",
            "dialogue": {
              "setting": "Estação de conferência do serviço-escola",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Antes de olhar qualquer imagem de hoje, eu pergunto à pessoa: passou desodorante, talco ou creme?"
                },
                {
                  "speaker": "duda",
                  "text": "E se aparecer na tela uma coisa que eu não sei o que é? Sou eu que digo?"
                },
                {
                  "speaker": "lia",
                  "text": "Boa pergunta. O que é seu para conferir, e o que é de outra pessoa para responder?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Técnico se confere, achado se encaminha",
            "body": "Três perguntas organizam a conferência. A identificação está certa: pessoa, lado e incidência? Há artefato ou falha técnica: resíduo de desodorante, talco ou creme na pele, dobra de pele, borrão de movimento, critério de cobertura não cumprido? E o que precisa ficar registrado: o que a pessoa relatou, a compressão que ela tolerou, o que limitou o exame? Problema técnico com causa clara se discute com a equipe antes de repetir, porque repetir é nova exposição. Divergência de identificação ou algo que você não sabe explicar: pare, descreva e peça apoio. Você nunca diz à paciente o que a imagem mostra. Isso é laudo, do médico.",
            "keyPoints": [
              "Identificação, artefato ou falha técnica, registro.",
              "Repetir é nova exposição: decisão com a equipe.",
              "O que a imagem mostra é assunto do laudo médico."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, você conferiu critérios de cobertura. Uma MLO descrita sem o sulco inframamário é que tipo de problema?"
            },
            "help": "A dobra sob a mama deixou de aparecer por causa da mama ou de como ela foi colocada?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "É uma falha de cobertura: parte da mama não entrou na imagem. Esse tipo de problema você nomeia e leva à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, você conferiu critérios de cobertura. Uma MLO descrita sem o sulco inframamário é que tipo de problema?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-04:i1:a",
                  "label": "Um achado para você explicar à paciente",
                  "explanation": "Faltar uma referência na imagem não é achado. E explicar imagem à paciente não é seu papel."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i1:b",
                  "label": "Um defeito permanente do detector",
                  "explanation": "O detector registrou o que foi posicionado. A falha veio antes."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i1:c",
                  "label": "Um problema técnico de posicionamento",
                  "explanation": "É uma falha de cobertura: parte da mama não entrou na imagem. Esse tipo de problema você nomeia e leva à equipe."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i1:d",
                  "label": "Uma variação normal, sem importância",
                  "explanation": "Critério não cumprido tem importância: pode haver tecido fora da imagem. Retome a lista da MLO."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-04:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada situação à primeira pergunta técnica que ela levanta."
            },
            "help": "Para cada situação, pense no que pode ter acontecido na sala, antes de pensar na mama.",
            "type": "matching",
            "feedback": {
              "correct": "Você começou pela causa técnica mais simples em cada caso. Se a pergunta não explicar o que foi visto, você descreve e pede apoio.",
              "incorrect": "Algum par ligou a situação a uma pergunta que não a explica. Retome: resíduo na pele, movimento, dobra e identificação."
            },
            "payload": {
              "prompt": "Ligue cada situação à primeira pergunta técnica que ela levanta.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-04:i2:1",
                  "left": "Pontos na região da axila, nas duas mamas",
                  "right": "A pessoa usou desodorante, talco ou creme?"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-04:i2:2",
                  "left": "Bordas borradas em toda a imagem",
                  "right": "Houve movimento durante a exposição?"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-04:i2:3",
                  "left": "Linha de pele sobreposta ao tecido",
                  "right": "Ficou uma dobra de pele sob a bandeja?"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-04:i2:4",
                  "left": "Marcador de lado diferente do pedido",
                  "right": "A identificação confere com a pessoa e o pedido?"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize a conferência de uma mamografia antes de ela seguir para o médico."
            },
            "help": "De nada adianta avaliar a qualidade de uma imagem atribuída à pessoa errada.",
            "type": "ordering",
            "feedback": {
              "correct": "Primeiro de quem é a imagem, depois como ela ficou, depois o que precisa ser dito sobre ela. Só então a equipe decide.",
              "incorrect": "Alguma etapa veio antes da identificação ou depois da decisão. Retome as três perguntas do conceito, na ordem."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize a conferência de uma mamografia antes de ela seguir para o médico.",
              "items": [
                {
                  "id": "item:rtg-2026:m12:aula-04:i3:2",
                  "label": "Procurar artefatos e falhas técnicas"
                },
                {
                  "id": "item:rtg-2026:m12:aula-04:i3:1",
                  "label": "Conferir pessoa, lado e incidência"
                },
                {
                  "id": "item:rtg-2026:m12:aula-04:i3:3",
                  "label": "Levantar o que precisa ficar registrado"
                },
                {
                  "id": "item:rtg-2026:m12:aula-04:i3:4",
                  "label": "Levar à equipe o que pede correção ou apoio"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m12:aula-04:i3:1",
                "item:rtg-2026:m12:aula-04:i3:2",
                "item:rtg-2026:m12:aula-04:i3:3",
                "item:rtg-2026:m12:aula-04:i3:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual resposta respeita o seu papel?"
            },
            "help": "A pergunta dela é sobre resultado. Responder a isso cabe no seu papel nesta sala?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você explica quem interpreta e como ela recebe o resultado. O que notou, você descreve à equipe, sem opinar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você termina as quatro incidências de Dona Célia. Na tela, uma das imagens mostra uma área que chama sua atenção e que você não sabe explicar. Ela percebe seu olhar e pergunta: 'Apareceu alguma coisa? Pode falar, eu aguento.'",
              "prompt": "Qual resposta respeita o seu papel?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-04:i4:a",
                  "label": "Dizer que apareceu uma área suspeita numa das imagens",
                  "explanation": "Isso é interpretar a imagem diante da paciente. Você não tem como saber o que aquilo significa, e não é sua função dizer."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i4:b",
                  "label": "Dizer que o médico avalia as imagens e dá o resultado",
                  "explanation": "Você explica quem interpreta e como ela recebe o resultado. O que notou, você descreve à equipe, sem opinar."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i4:c",
                  "label": "Dizer que está tudo normal na imagem, só para acalmá-la",
                  "explanation": "Tranquilizar com uma afirmação que você não pode fazer também é dar resultado. Retome o limite do seu papel."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i4:d",
                  "label": "Mostrar a tela e pedir a opinião dela",
                  "explanation": "Mostrar a imagem sem interpretação médica só aumenta a angústia. Confira de novo quem responde a essa pergunta."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-04:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Ana não tolerou a compressão completa na mama direita, mesmo com pausas, e a equipe decidiu seguir com a imagem obtida. O que precisa acompanhar essa imagem até o médico?"
            },
            "help": "O que o médico não consegue saber só de olhar a imagem?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Quem lê a imagem precisa saber que a compressão foi limitada pela dor relatada. É isso que o registro entrega.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Ana não tolerou a compressão completa na mama direita, mesmo com pausas, e a equipe decidiu seguir com a imagem obtida. O que precisa acompanhar essa imagem até o médico?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-04:i5:a",
                  "label": "Nada: a imagem fala por si mesma",
                  "explanation": "A imagem não conta por que a mama ficou menos comprimida. Sem o registro, o médico não sabe da limitação."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i5:b",
                  "label": "Um pedido de desculpas no prontuário",
                  "explanation": "Registro não é desculpa. É informação técnica sobre como o exame foi feito."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i5:c",
                  "label": "Sua opinião pessoal sobre o que a imagem mostra",
                  "explanation": "Opinião sobre achado não é sua parte. Retome o que você registra."
                },
                {
                  "id": "option:rtg-2026:m12:aula-04:i5:d",
                  "label": "O registro da limitação e do motivo relatado",
                  "explanation": "Quem lê a imagem precisa saber que a compressão foi limitada pela dor relatada. É isso que o registro entrega."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-04:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Corrigir, registrar ou chamar",
            "body": "Agora você consegue separar o que é técnico do que é achado: confere identificação, reconhece artefato e falha de cobertura, registra relato e limitação e leva à equipe o que pede correção. E sabe o que não faz: explicar imagem à paciente.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Registro bem-feito poupa repetição. E conta ao médico o que a imagem sozinha não conta."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m12:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-dxa",
          "source:rtg-2026:m12:iscd-official-positions-adult-2023",
          "source:rtg-2026:m12:anvisa-rdc-611-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Fundamentos da densitometria",
            "body": "Hoje você vai conseguir relacionar o que a densitometria mede ao posicionamento e aos cuidados que mantêm a medida confiável.",
            "dialogue": {
              "setting": "Sala de densitometria do serviço-escola",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Jorge",
                  "text": "Vim medir os ossos. É igual a um raio X da coluna?"
                },
                {
                  "speaker": "caio",
                  "text": "Parecido por fora. Mas aqui o que interessa é uma medida, e medida depende de como o senhor fica deitado."
                },
                {
                  "speaker": "pixel",
                  "text": "Se o exame entrega um número, o que pode atrapalhar esse número?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Uma medida que depende de você",
            "body": "A densitometria usa raios X de baixa dose em dois níveis de energia, que osso e tecido mole absorvem de forma diferente. O sistema subtrai a parte do tecido mole e estima a densidade mineral óssea. As regiões habituais são a coluna lombar, de L1 a L4, e o fêmur proximal. Na coluna, as pernas sobem num bloco, que aplaina a pelve e a lombar. No fêmur, um suporte gira o pé para dentro. Metal na roupa, movimento e posicionamento fora do padrão alteram a medida. Por isso: sem metal, sem movimento e, no acompanhamento, o mesmo aparelho. O resultado é interpretado pelo médico.",
            "keyPoints": [
              "Dois níveis de energia separam osso de tecido mole.",
              "Coluna lombar com pernas no bloco; fêmur com o pé girado para dentro.",
              "Metal, movimento e posição fora do padrão alteram a medida."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de preparo e contraste, você conferiu o que a pessoa fez antes do exame. Seu Jorge conta que fez um exame com bário há três dias. O que você faz com essa informação?"
            },
            "help": "É uma informação de preparo que a equipe ainda não tem. O que você fazia com isso na unidade de contraste?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Contraste recente pode interferir na medida. A equipe decide se é preciso esperar antes de fazer a densitometria.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de preparo e contraste, você conferiu o que a pessoa fez antes do exame. Seu Jorge conta que fez um exame com bário há três dias. O que você faz com essa informação?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-05:i1:a",
                  "label": "Ignora, porque bário não aparece em raios X",
                  "explanation": "O bário aparece, sim, em raios X, e pode ficar sobre a região medida. A informação importa."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i1:b",
                  "label": "Registra e avisa a equipe antes de iniciar",
                  "explanation": "Contraste recente pode interferir na medida. A equipe decide se é preciso esperar antes de fazer a densitometria."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i1:c",
                  "label": "Cancela o exame e remarca por conta própria",
                  "explanation": "A informação pede avaliação, mas remarcar sozinho é decidir pela equipe. Retome o que você faz com um relato de preparo."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i1:d",
                  "label": "Aumenta a dose para compensar o contraste",
                  "explanation": "Mais dose não remove o contraste do caminho e expõe a pessoa sem motivo. Confira de novo."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, siga o caminho da medida na densitometria, do feixe ao resultado."
            },
            "help": "O que o sistema precisa ter em mãos antes de conseguir subtrair alguma coisa?",
            "type": "ordering",
            "feedback": {
              "correct": "Esse é o caminho: duas energias, absorções diferentes, subtração, medida e, só no fim, interpretação médica.",
              "incorrect": "Alguma etapa saiu do lugar. Retome: a subtração só é possível depois que osso e tecido mole absorveram as duas energias."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, siga o caminho da medida na densitometria, do feixe ao resultado.",
              "items": [
                {
                  "id": "item:rtg-2026:m12:aula-05:i2:5",
                  "label": "O médico interpreta o resultado"
                },
                {
                  "id": "item:rtg-2026:m12:aula-05:i2:3",
                  "label": "O sistema subtrai a parte do tecido mole"
                },
                {
                  "id": "item:rtg-2026:m12:aula-05:i2:2",
                  "label": "Osso e tecido mole absorvem de forma diferente"
                },
                {
                  "id": "item:rtg-2026:m12:aula-05:i2:1",
                  "label": "Raios X em dois níveis de energia atravessam a região"
                },
                {
                  "id": "item:rtg-2026:m12:aula-05:i2:4",
                  "label": "Resta a estimativa da densidade mineral óssea"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m12:aula-05:i2:1",
                "item:rtg-2026:m12:aula-05:i2:2",
                "item:rtg-2026:m12:aula-05:i2:3",
                "item:rtg-2026:m12:aula-05:i2:4",
                "item:rtg-2026:m12:aula-05:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada cuidado da densitometria ao motivo técnico ensinado nesta aula."
            },
            "help": "Dois cuidados são de posição, um é de preparo e um é de acompanhamento.",
            "type": "matching",
            "feedback": {
              "correct": "Cada cuidado protege a medida de uma fonte de variação: curvatura, rotação, artefato e troca de equipamento.",
              "incorrect": "Algum par trocou o cuidado da coluna com o do fêmur, ou o do metal com o do aparelho. Retome o conceito."
            },
            "payload": {
              "prompt": "Ligue cada cuidado da densitometria ao motivo técnico ensinado nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-05:i3:1",
                  "left": "Pernas apoiadas no bloco",
                  "right": "Aplaina a pelve e a coluna lombar"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-05:i3:2",
                  "left": "Pé girado para dentro no suporte",
                  "right": "Posiciona o fêmur proximal para a medida"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-05:i3:3",
                  "left": "Roupa sem zíper, botão ou cinto de metal",
                  "right": "Evita artefato sobre a região medida"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-05:i3:4",
                  "left": "Mesmo aparelho no acompanhamento",
                  "right": "Permite comparar um exame com o outro"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz com essa informação nova?"
            },
            "help": "Há uma informação nova, que a ficha não trazia. O que vem antes de seguir o pedido como está?",
            "type": "case-decision",
            "feedback": {
              "correct": "Metal sobre a região pode comprometer a medida, e a ficha não trazia a cirurgia. A equipe decide qual região medir.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, o pedido de Seu Antônio indica densitometria de coluna lombar e fêmur direito. Já deitado, ele conta que tem uma prótese de metal no quadril direito, colocada há dois anos. A ficha não menciona a cirurgia.",
              "prompt": "O que você faz com essa informação nova?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-05:i4:a",
                  "label": "Pausar e levar a informação à equipe",
                  "explanation": "Metal sobre a região pode comprometer a medida, e a ficha não trazia a cirurgia. A equipe decide qual região medir."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i4:b",
                  "label": "Medir o fêmur direito e avisar a equipe no fim",
                  "explanation": "Avisar no fim entrega uma medida que o metal pode ter comprometido. A informação vem antes da aquisição."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i4:c",
                  "label": "Trocar para o fêmur esquerdo por sua conta",
                  "explanation": "Mudar o lado ou a região do exame é decisão da equipe, não sua. Retome o que cabe a você aqui."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i4:d",
                  "label": "Trocar o exame por um de antebraço",
                  "explanation": "Escolher outra região é decisão médica. Retome o que fazer quando a pessoa conta algo que a ficha não traz."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-05:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Ivone fez a densitometria do ano passado em outro serviço, num aparelho de outro fabricante. O médico vai comparar os dois exames. Que limitação técnica precisa estar registrada?"
            },
            "help": "Compare os dois exames: o que mudou de um para o outro, além do tempo?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Medidas de aparelhos diferentes não se comparam diretamente. Quem interpreta precisa saber disso.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Ivone fez a densitometria do ano passado em outro serviço, num aparelho de outro fabricante. O médico vai comparar os dois exames. Que limitação técnica precisa estar registrada?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-05:i5:a",
                  "label": "A paciente envelheceu um ano no período",
                  "explanation": "A idade é dado da pessoa, não limitação técnica da comparação."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i5:b",
                  "label": "O exame antigo usou raios X de baixa dose",
                  "explanation": "Baixa dose é característica de toda densitometria. Não é o que dificulta comparar."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i5:c",
                  "label": "Os exames vêm de aparelhos diferentes",
                  "explanation": "Medidas de aparelhos diferentes não se comparam diretamente. Quem interpreta precisa saber disso."
                },
                {
                  "id": "option:rtg-2026:m12:aula-05:i5:d",
                  "label": "A coluna lombar tem cinco vértebras",
                  "explanation": "Isso é anatomia, igual nos dois exames. Retome o cuidado de acompanhamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-05:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Medida boa começa na mesa",
            "body": "Agora você consegue explicar o que a densitometria mede, por que usa dois níveis de energia, como a pessoa fica para coluna e fêmur e o que altera a medida. O número final não é seu: sua parte é entregar uma medida tecnicamente confiável e registrar o que a limitou.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Aqui, posicionar do mesmo jeito é tão importante quanto posicionar bem."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m12:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m12:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m12-v1",
        "sourceIds": [
          "source:rtg-2026:m12:cbr-parecer-compressao-2022",
          "source:rtg-2026:m12:anvisa-rdc-611-2022",
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:radiologyinfo-dxa",
          "source:rtg-2026:m12:iscd-official-positions-adult-2023"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Duas modalidades, critérios distintos",
            "body": "Hoje você vai conseguir escolher o critério técnico que vale em cada modalidade e comunicar uma limitação à equipe.",
            "dialogue": {
              "setting": "Corredor entre as salas de mamografia e densitometria",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje você atende nas duas salas. O cuidado com a pessoa é o mesmo. As perguntas técnicas, não."
                },
                {
                  "speaker": "duda",
                  "text": "Na mamografia eu confiro cobertura. Na densitometria não tem mamilo nem peitoral. Confiro o quê?"
                },
                {
                  "speaker": "pixel",
                  "text": "Numa sala você quer mostrar todo o tecido. Na outra, medir sempre do mesmo jeito. O que muda na conferência?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "O critério acompanha a pergunta do exame",
            "body": "Mamografia e densitometria usam raios X, mas respondem a perguntas diferentes. Na mamografia, a imagem precisa mostrar todo o tecido: os critérios são cobertura na CC e na MLO, compressão firme e tolerável e ausência de artefato. Na densitometria, o que vale é uma medida comparável: os critérios são região certa, posicionamento padronizado, ausência de metal e de movimento, e o mesmo aparelho no acompanhamento. Nas duas, quando um critério não pode ser cumprido, você não improvisa nem esconde: diz o que falhou, por quê e o que foi tentado, registra e leva à equipe. Decidir repetir, mudar a região ou seguir assim cabe a ela.",
            "keyPoints": [
              "Mamografia: mostrar todo o tecido.",
              "Densitometria: medir sempre do mesmo jeito.",
              "Limitação: o que falhou, por quê, o que foi tentado."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula de qualidade e documentação, o que você aprendeu a fazer com uma limitação do exame, como uma compressão que a pessoa não tolerou?"
            },
            "help": "O que o médico não descobre só de olhar a imagem?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O registro conta o que a imagem sozinha não conta. Vale para a mamografia e vai valer para a densitometria.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula de qualidade e documentação, o que você aprendeu a fazer com uma limitação do exame, como uma compressão que a pessoa não tolerou?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-06:i1:a",
                  "label": "Guardar para si e seguir a agenda",
                  "explanation": "Limitação guardada não chega a quem interpreta. Retome o que acompanha a imagem."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i1:b",
                  "label": "Explicar à paciente o que a imagem mostra",
                  "explanation": "Explicar imagem é laudo, e não é seu papel. A pergunta é sobre a limitação técnica."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i1:c",
                  "label": "Apagar a imagem que ficou pior",
                  "explanation": "Apagar esconde o que aconteceu. O que se faz é o oposto: deixar escrito."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i1:d",
                  "label": "Registrar a limitação e o motivo",
                  "explanation": "O registro conta o que a imagem sozinha não conta. Vale para a mamografia e vai valer para a densitometria."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-06:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada critério à modalidade a que pertence e ao que ele garante."
            },
            "help": "Pergunte de cada critério: ele ajuda a mostrar tecido ou a repetir uma medida?",
            "type": "matching",
            "feedback": {
              "correct": "Você separou os critérios de quem precisa mostrar tecido dos critérios de quem precisa medir do mesmo jeito.",
              "incorrect": "Algum critério foi para a sala errada. Retome: cobertura e compressão são da mamografia; padrão e comparação, da densitometria."
            },
            "payload": {
              "prompt": "Ligue cada critério à modalidade a que pertence e ao que ele garante.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m12:aula-06:i2:1",
                  "left": "Peitoral até a altura do mamilo",
                  "right": "Mamografia: cobertura na MLO"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-06:i2:2",
                  "left": "Pernas apoiadas no bloco",
                  "right": "Densitometria: coluna lombar aplainada"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-06:i2:3",
                  "left": "Compressão firme e tolerável",
                  "right": "Mamografia: mama mais fina e imóvel"
                },
                {
                  "id": "pair:rtg-2026:m12:aula-06:i2:4",
                  "left": "Mesmo aparelho no acompanhamento",
                  "right": "Densitometria: medidas comparáveis"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize a comunicação de uma limitação técnica à equipe."
            },
            "help": "Quem ouve precisa primeiro saber de que critério você está falando.",
            "type": "ordering",
            "feedback": {
              "correct": "Com o critério, o motivo e as tentativas na mesa, a equipe decide sem precisar adivinhar o que aconteceu na sala.",
              "incorrect": "Alguma etapa veio antes de nomear o critério ou depois da decisão. Retome a frase do conceito: o que falhou, por quê, o que foi tentado."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize a comunicação de uma limitação técnica à equipe.",
              "items": [
                {
                  "id": "item:rtg-2026:m12:aula-06:i3:4",
                  "label": "Registrar a limitação"
                },
                {
                  "id": "item:rtg-2026:m12:aula-06:i3:2",
                  "label": "Dizer por que não foi possível cumprir"
                },
                {
                  "id": "item:rtg-2026:m12:aula-06:i3:5",
                  "label": "Levar à equipe e aguardar a decisão"
                },
                {
                  "id": "item:rtg-2026:m12:aula-06:i3:1",
                  "label": "Nomear o critério que não foi cumprido"
                },
                {
                  "id": "item:rtg-2026:m12:aula-06:i3:3",
                  "label": "Dizer o que já foi tentado"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m12:aula-06:i3:1",
                "item:rtg-2026:m12:aula-06:i3:2",
                "item:rtg-2026:m12:aula-06:i3:3",
                "item:rtg-2026:m12:aula-06:i3:4",
                "item:rtg-2026:m12:aula-06:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você decide diante da sugestão de Duda?"
            },
            "help": "A pessoa tem dor, e o critério de posição não se cumpre. O que o conceito manda fazer nas duas modalidades?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você nomeia o critério que não se cumpriu, o motivo e as tentativas. A equipe decide como seguir.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na sala de densitometria simulada, Seu Raul sente dor no quadril e não consegue manter o pé girado para dentro no suporte. Depois de duas tentativas com pausa, a perna volta a girar para fora. Duda sugere prender o pé com mais força para 'sair certinho'.",
              "prompt": "O que você decide diante da sugestão de Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-06:i4:a",
                  "label": "Prender o pé com bastante força até a medida terminar",
                  "explanation": "Forçar uma posição dolorosa pode machucar a pessoa. O critério não vale mais que ela."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i4:b",
                  "label": "Medir assim mesmo e não mencionar a posição",
                  "explanation": "Uma medida fora do padrão e sem aviso parece confiável sem ser. Quem interpreta precisa saber."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i4:c",
                  "label": "Parar, registrar o que foi tentado e chamar a equipe",
                  "explanation": "Você nomeia o critério que não se cumpriu, o motivo e as tentativas. A equipe decide como seguir."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i4:d",
                  "label": "Trocar para a coluna e dispensar o fêmur",
                  "explanation": "Mudar a região do exame é decisão da equipe. Retome o que cabe a você diante de uma limitação."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-06:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m12:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m12:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual par de critérios descreve as duas falhas?"
            },
            "help": "Sublinhe, em cada sala, a palavra que nomeia o que estava errado.",
            "type": "case-decision",
            "feedback": {
              "correct": "Na mamografia faltou cobertura, e na densitometria havia metal sobre a região medida. Cada sala, seu critério.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Manhã no serviço-escola. Na mamografia, a MLO de Dona Clara é descrita com o peitoral só até bem acima do mamilo. Na densitometria, Seu Paulo foi medido com o cinto de fivela metálica sobre a região lombar. Lia pede que você nomeie o critério que falhou em cada sala.",
              "prompt": "Qual par de critérios descreve as duas falhas?",
              "options": [
                {
                  "id": "option:rtg-2026:m12:aula-06:i5:a",
                  "label": "Cobertura na MLO e ausência de metal na região",
                  "explanation": "Na mamografia faltou cobertura, e na densitometria havia metal sobre a região medida. Cada sala, seu critério."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i5:b",
                  "label": "Compressão tolerável e uso do mesmo aparelho",
                  "explanation": "Nenhuma das descrições fala de dor nem de troca de equipamento. Confira de novo o que foi descrito."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i5:c",
                  "label": "Mamilo de perfil e pernas apoiadas no bloco",
                  "explanation": "O mamilo e o bloco não aparecem nas descrições. Procure a referência citada em cada sala."
                },
                {
                  "id": "option:rtg-2026:m12:aula-06:i5:d",
                  "label": "Ausência de artefato e gordura posterior visível na CC",
                  "explanation": "A imagem descrita é uma MLO, e a referência citada é o peitoral. Retome os critérios de cada modalidade."
                }
              ],
              "correctOptionId": "option:rtg-2026:m12:aula-06:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m12:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Critério certo, limite dito",
            "body": "Agora você consegue escolher o critério que vale em cada sala: cobertura e compressão na mamografia, padrão e comparação na densitometria. E, quando o critério não se cumpre, consegue dizer o que falhou, por quê e o que foi tentado, deixando a decisão com a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "pixel",
                  "text": "Duas salas, uma mesma regra: o que não deu para fazer como o critério pede, você conta."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m12",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-01"
        ],
        "prompt": "Você apoia a mama no suporte e pensa no que fica atrás dela. Que músculo está ali, na parede do tórax?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-01:c1:a",
            "label": "O músculo deltoide, do ombro"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c1:b",
            "label": "O diafragma, abaixo das costelas"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c1:c",
            "label": "O músculo reto do abdome"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c1:d",
            "label": "O músculo peitoral maior"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-01:c1:d",
        "feedback": {
          "correct": "A mama repousa sobre o peitoral maior. Ele será uma referência importante quando você conferir o posicionamento.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:nci-seer-breast-anatomy"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-01"
        ],
        "prompt": "Dona Lúcia avisa, no meio da compressão, que a dor ficou forte demais. Qual é a sua primeira atitude?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-01:c2:a",
            "label": "Parar de comprimir e ouvir o que ela sente"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c2:b",
            "label": "Dizer que falta pouco e continuar apertando"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c2:c",
            "label": "Expor depressa, antes que ela se mexa"
          },
          {
            "id": "option:rtg-2026:m12:aula-01:c2:d",
            "label": "Explicar que sem dor a imagem não presta"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-01:c2:a",
        "feedback": {
          "correct": "A compressão precisa ser tolerável. Você para, ouve e ajusta, e o que não for possível fica registrado para a equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-mammography",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-02"
        ],
        "prompt": "Dona Vera pergunta por que a mama precisa ser apertada. Qual explicação está correta?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-02:c1:a",
            "label": "Serve para o aparelho medir o peso e o volume da mama"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c1:b",
            "label": "Deixa a mama mais fina e parada, com menos dose"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c1:c",
            "label": "Aumenta a energia do feixe de raios X"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c1:d",
            "label": "Substitui a grade e o detector no exame"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-02:c1:b",
        "feedback": {
          "correct": "Mama mais fina e imóvel significa menos sobreposição, menos borrão e menos radiação para formar a imagem.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-02"
        ],
        "prompt": "Um mamógrafo está sem a grade sob o suporte num exame comum, sem ampliação. O que isso significa para o uso do equipamento?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-02:c2:a",
            "label": "Pode ser usado, com mais compressão"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c2:b",
            "label": "Pode ser usado, se o detector for digital"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c2:c",
            "label": "Não pode ser usado assim: avise a equipe"
          },
          {
            "id": "option:rtg-2026:m12:aula-02:c2:d",
            "label": "Não pode ser usado só em mamas espessas"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-02:c2:c",
        "feedback": {
          "correct": "A grade faz parte da cadeia, e a norma sanitária não admite o uso sem ela fora da ampliação. Você não contorna: para e comunica.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:anvisa-in-92-2021"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-03"
        ],
        "prompt": "Numa MLO, até onde o músculo peitoral precisa descer para cumprir o critério ensinado nesta aula?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-03:c1:a",
            "label": "Só até o alto da axila"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c1:b",
            "label": "Até a metade do braço"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c1:c",
            "label": "Pelo menos até a altura do mamilo"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c1:d",
            "label": "Até encostar no sulco inframamário"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-03:c1:c",
        "feedback": {
          "correct": "Com o peitoral chegando à altura do mamilo, a MLO mostra a profundidade esperada.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-03"
        ],
        "prompt": "Uma CC é descrita assim: mamilo de perfil e para a frente, lados medial e lateral incluídos, gordura visível atrás da glândula. O que você conclui sobre a cobertura?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-03:c2:a",
            "label": "Faltou o sulco inframamário, exigido na CC"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c2:b",
            "label": "Faltou o peitoral até a altura do mamilo"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c2:c",
            "label": "Faltou a axila, que a CC sempre mostra"
          },
          {
            "id": "option:rtg-2026:m12:aula-03:c2:d",
            "label": "Os critérios descritos foram cumpridos"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-03:c2:d",
        "feedback": {
          "correct": "Mamilo, lados e gordura posterior estão como o conceito pede para a CC.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:sweeney-2018-cc-criteria",
          "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-04"
        ],
        "prompt": "Uma imagem saiu borrada porque a pessoa se mexeu durante a exposição. Antes de repetir, o que vem primeiro?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-04:c1:a",
            "label": "Combinar a repetição com a equipe"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c1:b",
            "label": "Repetir logo e contar à equipe depois"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c1:c",
            "label": "Enviar a borrada e não registrar"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c1:d",
            "label": "Aumentar a nitidez no computador"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-04:c1:a",
        "feedback": {
          "correct": "A causa é clara, mas repetir é nova exposição. A decisão passa pela equipe, e a pessoa é orientada de novo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:anvisa-rdc-611-2022",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-04"
        ],
        "prompt": "O marcador de lado numa imagem não bate com o lado escrito no pedido. O que você faz?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-04:c2:a",
            "label": "Troca o marcador na imagem por conta própria"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c2:b",
            "label": "Para, descreve a divergência e pede apoio"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c2:c",
            "label": "Segue o pedido e ignora o marcador"
          },
          {
            "id": "option:rtg-2026:m12:aula-04:c2:d",
            "label": "Pergunta à paciente e corrige o pedido"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-04:c2:b",
        "feedback": {
          "correct": "Você não sabe ainda qual dos dois está errado. Parar e descrever protege a pessoa e o registro.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:anvisa-rdc-611-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-05"
        ],
        "prompt": "Você prepara Seu Jorge para a medida da coluna lombar. Como ficam as pernas dele?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-05:c1:a",
            "label": "Esticadas, com os pés girados para fora"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c1:b",
            "label": "Pendentes para fora da mesa"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c1:c",
            "label": "Cruzadas, uma sobre a outra"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c1:d",
            "label": "Apoiadas sobre um bloco acolchoado"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-05:c1:d",
        "feedback": {
          "correct": "Com as pernas no bloco, a pelve e a coluna lombar ficam mais planas sobre a mesa.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-dxa"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-05"
        ],
        "prompt": "Por que a densitometria usa dois níveis de energia de raios X?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-05:c2:a",
            "label": "Para fazer duas imagens de dois órgãos diferentes"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c2:b",
            "label": "Para separar o osso do tecido mole na medida"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c2:c",
            "label": "Para dobrar a dose e clarear a imagem"
          },
          {
            "id": "option:rtg-2026:m12:aula-05:c2:d",
            "label": "Para medir a coluna e o fêmur ao mesmo tempo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-05:c2:b",
        "feedback": {
          "correct": "Como osso e tecido mole absorvem as duas energias de forma diferente, o sistema consegue subtrair o tecido mole.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-dxa"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-06"
        ],
        "prompt": "Lia descreve: pernas sobre o bloco, nenhum metal na região, mesmo aparelho do ano passado. A que exame esses critérios pertencem?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-06:c1:a",
            "label": "Mamografia na incidência CC"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c1:b",
            "label": "Mamografia na incidência oblíqua (MLO)"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c1:c",
            "label": "Densitometria da coluna lombar"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c1:d",
            "label": "Densitometria do antebraço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-06:c1:c",
        "feedback": {
          "correct": "Bloco sob as pernas, ausência de metal e mesmo aparelho são cuidados de uma medida comparável da coluna.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:radiologyinfo-dxa",
          "source:rtg-2026:m12:iscd-official-positions-adult-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m12:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m12:aula-06"
        ],
        "prompt": "Na mamografia de Dona Elza, a CC esquerda não incluiu a parte lateral da mama, e ela não tolera nova compressão hoje. O que vai para a equipe?",
        "options": [
          {
            "id": "option:rtg-2026:m12:aula-06:c2:a",
            "label": "O critério que falhou, o motivo e as tentativas"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c2:b",
            "label": "Só a imagem, sem comentário algum"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c2:c",
            "label": "Um pedido seu para trocar o exame por outro tipo"
          },
          {
            "id": "option:rtg-2026:m12:aula-06:c2:d",
            "label": "Sua hipótese sobre o que a imagem mostra"
          }
        ],
        "correctOptionId": "option:rtg-2026:m12:aula-06:c2:a",
        "feedback": {
          "correct": "Com essas três informações, a equipe decide se remarca, complementa ou segue, sem adivinhar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m12:popli-2014-breast-positioning",
          "source:rtg-2026:m12:anvisa-rdc-611-2022",
          "source:rtg-2026:m12:cbr-parecer-compressao-2022"
        ]
      }
    ]
  },
  "reinforcement": {
    "cycles": [
      {
        "cycle": 1,
        "mode": "guided-recovery"
      },
      {
        "cycle": 2,
        "mode": "different-context-retry"
      }
    ]
  },
  "claimProvenance": [
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-02:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-in-92-2021",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-02:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:nci-seer-breast-anatomy",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:sweeney-2018-cc-criteria",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-mammography",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-05:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-05:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m12:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-06:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m12:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m12:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m12:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:cbr-parecer-compressao-2022",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:radiologyinfo-dxa",
        "source:rtg-2026:m12:iscd-official-positions-adult-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m12:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:popli-2014-breast-positioning",
        "source:rtg-2026:m12:anvisa-rdc-611-2022",
        "source:rtg-2026:m12:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:iscd-official-positions-adult-2023",
        "source:rtg-2026:m12:popli-2014-breast-positioning"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m12:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m12:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m12:anvisa-rdc-611-2022"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m12:aula-01",
        "hook": "Complete a frase: a compressão precisa ser firme, mas também …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-01"
          ],
          "prompt": "Antes de comprimir, o que você combina com a pessoa para que a compressão fique dentro do que ela suporta?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-01:rg:a",
              "label": "Que ela aguente em silêncio até o final"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rg:b",
              "label": "Que ela mesma solte a bandeja se doer"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rg:c",
              "label": "Que ela avise se sentir dor, e você ajusta"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rg:d",
              "label": "Que ela prenda o ar durante todo o posicionamento"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-01:rg:c",
          "feedback": {
            "correct": "Com o aviso combinado, a compressão sobe aos poucos e para no ponto que a pessoa tolera.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:radiologyinfo-mammography",
            "source:rtg-2026:m12:cbr-parecer-compressao-2022"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-01"
          ],
          "prompt": "Numa aula prática com um modelo anatômico de mama, pedem que você aponte por onde o leite chega ao mamilo. O que você aponta?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-01:rt:a",
              "label": "Os ligamentos, que prendem a mama ao tórax"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rt:b",
              "label": "Os ductos, tubos finos que saem dos lobos"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rt:c",
              "label": "A gordura, que dá o volume e a forma"
            },
            {
              "id": "option:rtg-2026:m12:aula-01:rt:d",
              "label": "O músculo peitoral, que fica atrás dela"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-01:rt:b",
          "feedback": {
            "correct": "Os ductos ligam lobos e lóbulos ao mamilo. São o caminho, não a fábrica.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:nci-seer-breast-anatomy"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m12:aula-02",
        "hook": "Complete a frase: a grade fica antes do detector para barrar a radiação …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-02"
          ],
          "prompt": "No caminho do feixe até o detector, qual é o papel da grade antidifusora?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-02:rg:a",
              "label": "Barrar a radiação espalhada"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rg:b",
              "label": "Comprimir a mama por baixo"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rg:c",
              "label": "Produzir o feixe de raios X"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rg:d",
              "label": "Escolher a técnica de exposição"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-02:rg:a",
          "feedback": {
            "correct": "A grade deixa passar o feixe que vem direto e segura boa parte do que se espalhou na mama.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-02"
          ],
          "prompt": "Você usa uma prensa para secar uma folha grossa e desigual entre duas tábuas. O que a prensa faz que lembra a bandeja do mamógrafo?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-02:rt:a",
              "label": "Aquece a folha para ela secar bem mais rápido"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rt:b",
              "label": "Corta as partes mais grossas da folha"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rt:c",
              "label": "Muda a cor da folha para dar contraste"
            },
            {
              "id": "option:rtg-2026:m12:aula-02:rt:d",
              "label": "Uniformiza a espessura e mantém tudo parado"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-02:rt:d",
          "feedback": {
            "correct": "É o que a bandeja faz com a mama: espessura mais uniforme e sem movimento durante a exposição.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:iaea-hhc-handbook-ch09"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m12:aula-03",
        "hook": "Complete a frase: na MLO, o músculo peitoral desce pelo menos até a altura do …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-03"
          ],
          "prompt": "Uma MLO é descrita com o peitoral terminando na altura do mamilo e o sulco inframamário visível. Como ficam esses dois critérios?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-03:rg:a",
              "label": "Só o critério do peitoral falhou"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rg:b",
              "label": "Os dois foram cumpridos"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rg:c",
              "label": "Só o do sulco falhou"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rg:d",
              "label": "Os dois falharam"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-03:rg:b",
          "feedback": {
            "correct": "Peitoral na altura do mamilo e sulco inframamário incluído: os dois critérios estão atendidos.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:popli-2014-breast-positioning",
            "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-03"
          ],
          "prompt": "Você vai conferir uma MLO da mama esquerda descrita por um colega de outro serviço. Antes de ouvir a descrição, que lista de referências você prepara?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-03:rt:a",
              "label": "Peitoral, axila, sulco inframamário e mamilo"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rt:b",
              "label": "Clavícula, ombro, cotovelo, punho e dedos da mão"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rt:c",
              "label": "Só o mamilo, que resume o resto"
            },
            {
              "id": "option:rtg-2026:m12:aula-03:rt:d",
              "label": "Coração, pulmão, costelas e esterno"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-03:rt:a",
          "feedback": {
            "correct": "São as referências da MLO ensinadas nesta aula. Com a lista pronta, você confere uma por vez.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:popli-2014-breast-positioning",
            "source:rtg-2026:m12:inca-atualizacao-mamografia-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m12:aula-04",
        "hook": "Complete a frase: repetir uma imagem é uma nova …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-04"
          ],
          "prompt": "Por que a decisão de repetir uma mamografia passa pela equipe, e não só por você?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-04:rg:a",
              "label": "Porque o aparelho bloqueia a repetição"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rg:b",
              "label": "Porque a paciente paga por cada imagem"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rg:c",
              "label": "Porque a primeira imagem é apagada"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rg:d",
              "label": "Porque repetir é uma nova exposição"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-04:rg:d",
          "feedback": {
            "correct": "Cada repetição entrega mais radiação e, na mamografia, mais uma compressão. Por isso precisa de motivo e de decisão conjunta.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:anvisa-rdc-611-2022"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-04"
          ],
          "prompt": "Uma fotografia sai com manchas, e a lente estava com marcas de dedo. Na mamografia, que causa parecida você investiga primeiro diante de pontos inesperados na imagem?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-04:rt:a",
              "label": "Doença na mama, para contar logo à paciente"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rt:b",
              "label": "Defeito no monitor da sala de espera"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rt:c",
              "label": "Resíduo na pele, como desodorante ou talco"
            },
            {
              "id": "option:rtg-2026:m12:aula-04:rt:d",
              "label": "Erro no nome escrito no pedido médico"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-04:rt:c",
          "feedback": {
            "correct": "Assim como a marca na lente, o resíduo na pele entra na imagem. Se a pergunta não explicar os pontos, você descreve e pede apoio.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:radiologyinfo-mammography"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m12:aula-05",
        "hook": "Complete a frase: no acompanhamento, o ideal é repetir a densitometria no mesmo …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-05"
          ],
          "prompt": "O que torna dois exames de densitometria da mesma pessoa mais comparáveis entre si?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-05:rg:a",
              "label": "Mesmo aparelho e mesmo posicionamento"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rg:b",
              "label": "Mesmo horário e mesma roupa"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rg:c",
              "label": "Mesmo profissional e mesma sala de espera"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rg:d",
              "label": "Mesma dose de cálcio na véspera"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-05:rg:a",
          "feedback": {
            "correct": "Com o mesmo equipamento e a pessoa posicionada do mesmo jeito, a diferença entre as medidas diz mais sobre o osso.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:radiologyinfo-dxa",
            "source:rtg-2026:m12:iscd-official-positions-adult-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-05"
          ],
          "prompt": "Você pesa a mesma mala em duas balanças diferentes e os números não batem. Que cuidado da densitometria responde ao mesmo problema?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-05:rt:a",
              "label": "Apoiar as duas pernas num bloco acolchoado"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rt:b",
              "label": "Girar o pé para dentro no suporte"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rt:c",
              "label": "Retirar o cinto antes do exame"
            },
            {
              "id": "option:rtg-2026:m12:aula-05:rt:d",
              "label": "Usar o mesmo aparelho no acompanhamento"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-05:rt:d",
          "feedback": {
            "correct": "Dois instrumentos podem dar números diferentes para a mesma coisa. Manter o aparelho torna a comparação mais justa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:radiologyinfo-dxa",
            "source:rtg-2026:m12:iscd-official-positions-adult-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m12:aula-06",
        "hook": "Complete a frase: na mamografia você busca mostrar todo o tecido; na densitometria, medir sempre do mesmo …",
        "guided": {
          "id": "recovery-item:rtg-2026:m12:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-06"
          ],
          "prompt": "Qual destes critérios pertence à densitometria, e não à mamografia?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-06:rg:a",
              "label": "Sulco inframamário incluído inteiro na imagem"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rg:b",
              "label": "Posicionamento igual ao do exame anterior"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rg:c",
              "label": "Mamilo de perfil nas duas incidências"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rg:d",
              "label": "Gordura visível atrás da glândula"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-06:rg:b",
          "feedback": {
            "correct": "Na densitometria, repetir o posicionamento é o que permite comparar uma medida com a outra.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:iscd-official-positions-adult-2023",
            "source:rtg-2026:m12:popli-2014-breast-positioning"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m12:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m12:aula-06"
          ],
          "prompt": "Numa radiografia de tórax simulada, a pessoa não consegue ficar em pé para a posição pedida. Pelo que você praticou nesta aula, o que você comunica à equipe?",
          "options": [
            {
              "id": "option:rtg-2026:m12:aula-06:rt:a",
              "label": "Nada, e escolhe outra posição por sua própria conta"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rt:b",
              "label": "Que a pessoa não colaborou com o exame"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rt:c",
              "label": "O que não foi possível, o motivo e o que tentou"
            },
            {
              "id": "option:rtg-2026:m12:aula-06:rt:d",
              "label": "O que você acha que a imagem vai mostrar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m12:aula-06:rt:c",
          "feedback": {
            "correct": "A mesma comunicação vale em qualquer sala: critério, motivo e tentativas, e a decisão fica com a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m12:anvisa-rdc-611-2022"
          ]
        }
      }
    ]
  },
  "schemaRefs": {
    "activity": "learning-activity.v2",
    "checkpoint": "unit-checkpoint.v1",
    "batch": "production-batch.v1"
  },
  "media": [],
  "approvals": [
    {
      "schemaVersion": 1,
      "gate": "technical",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f14f854dcfcc068630bef2b533362e2545f5e35ab3a8677078d12a1e2c97d343"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
