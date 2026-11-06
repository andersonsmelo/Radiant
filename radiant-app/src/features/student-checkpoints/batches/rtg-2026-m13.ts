// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M13: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m13",
  "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de",
  "trackId": "track:rtg-2026:m13",
  "unitId": "unit:rtg-2026:m13",
  "contentVersion": "rtg-2026-m13-v1",
  "competencyIds": [
    "competency:rtg-2026:m13:aula-01",
    "competency:rtg-2026:m13:aula-02",
    "competency:rtg-2026:m13:aula-03",
    "competency:rtg-2026:m13:aula-04",
    "competency:rtg-2026:m13:aula-05",
    "competency:rtg-2026:m13:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m13:nibib-medicina-nuclear",
      "title": "Nuclear Medicine",
      "publisher": "NIBIB/NIH",
      "url": "https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional do NIH; consultada para a origem do sinal, radiofármacos, câmara gama e PET, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
      "title": "General Nuclear Medicine",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/gennuclear",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para as etapas do exame, o papel da câmara gama e as orientações de saída, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:cnen-norma-3-05",
      "title": "Norma ANSN 3.05: Requisitos de Segurança e Proteção Radiológica para Serviços de Medicina Nuclear (Resolução CNEN 159/13)",
      "publisher": "CNEN",
      "url": "https://www.gov.br/cnen/pt-br/acesso-rapido/normas/grupo-3/ansn-3-05-requisitos-de-seguranca-e-protecao-radiologica-para-servicos-de-medicina-nuclear.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal; consultado para os arts. 2º, 12, 13, 14, 15, 19, 20, 32, 35, 43, 54 e 60, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m13:cdc-contaminacao-exposicao",
      "title": "Radiation Contamination Versus Exposure",
      "publisher": "CDC",
      "url": "https://www.cdc.gov/radiation-emergencies/infographic/contamination-versus-exposure.html",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional do governo dos Estados Unidos; consultada para a distinção entre exposição e contaminação, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:inca-radioterapia",
      "title": "Radioterapia",
      "publisher": "INCA, Ministério da Saúde",
      "url": "https://www.gov.br/inca/pt-br/assuntos/cancer/tratamento/radioterapia",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para finalidade, tipos, equipe, marcações e rotina das aplicações, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:radiologyinfo-teleterapia",
      "title": "External Beam Therapy (EBT)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/ebt",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para os papéis da equipe, a simulação e a conferência de posição antes da entrega, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:radiologyinfo-igrt",
      "title": "Image-guided Radiation Therapy (IGRT)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/igrt",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para a comparação entre imagens do dia e imagens de referência, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:nci-radioterapia-externa",
      "title": "External Beam Radiation Therapy for Cancer",
      "publisher": "National Cancer Institute (NIH)",
      "url": "https://www.cancer.gov/about-cancer/treatment/types/radiation-therapy/external-beam",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional do NIH; consultada para simulação, marcas na pele, imobilizadores e observação do paciente durante a aplicação, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:radiologyinfo-angiografia",
      "title": "Catheter Angiography",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/angiocath",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para equipamentos da sala, fluoroscopia, contraste e papéis no procedimento, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:anvisa-rdc-611-2022",
      "title": "RDC nº 611, de 9 de março de 2022",
      "publisher": "Anvisa (texto compilado, cópia hospedada pelo CBR)",
      "url": "https://cbr.org.br/wp-content/uploads/2023/08/RDC-ANVISA-de-2022-no-611_Requisitos-sanitarios-de-organizacao-e-funcionamento-de-servico-de-radiologia-diagnostica-ou-intervencionista.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal; consultado para os arts. 23, 43, 51, 65 e 66, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m13:kjp-seguranca-radiacao",
      "title": "Radiation safety for pain physicians: principles and recommendations",
      "publisher": "The Korean Journal of Pain, 2022;35(2):129-139 (PubMed Central)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8977205",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto com licença CC BY-NC 4.0; consultado para fatos sobre espalhamento, barreiras e distância em fluoroscopia, com redação própria."
    },
    {
      "id": "source:rtg-2026:m13:planalto-lei-7394",
      "title": "Lei nº 7.394, de 29 de outubro de 1985",
      "publisher": "Presidência da República (Planalto)",
      "url": "https://www.planalto.gov.br/ccivil_03/leis/l7394.htm",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Lei federal; consultada para o art. 1º (técnicas abrangidas pela profissão), sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m13:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-angiografia",
          "source:rtg-2026:m13:kjp-seguranca-radiacao",
          "source:rtg-2026:m13:nibib-medicina-nuclear",
          "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
          "source:rtg-2026:m13:cnen-norma-3-05"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Medicina nuclear no percurso",
            "body": "Hoje você vai conseguir dizer de onde vem o sinal na medicina nuclear e ordenar as etapas do serviço.",
            "dialogue": {
              "setting": "Recepção do serviço de medicina nuclear",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A câmara fica bem perto da paciente e não tem tubo de raios X. De onde sai a radiação que forma a imagem?"
                },
                {
                  "speaker": "caio",
                  "text": "Boa pergunta. E repare que a ordem do dia aqui é outra: primeiro a injeção, depois uma espera, só então a imagem."
                },
                {
                  "speaker": "pixel",
                  "text": "Guarde a dúvida da Duda para a aula inteira: nesta sala, quem emite e quem só detecta?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "O sinal vem de dentro",
            "body": "Na radiografia e na TC, o tubo emite e o detector registra o que atravessou o corpo. Na medicina nuclear a lógica se inverte: o paciente recebe um radiofármaco, molécula ligada a um átomo radioativo, em geral pela veia. O material se concentra na região estudada e emite radiação gama de dentro do corpo. A câmara gama só detecta essa energia e a converte em imagem; ela não emite radiação. Por isso o serviço tem etapas próprias: identificação, administração por profissional habilitado, espera para o material se acumular, aquisição das imagens e orientações de saída. Com o tempo, o material perde atividade e é eliminado; beber líquidos ajuda nessa eliminação.",
            "keyPoints": [
              "Raios X: a fonte é o tubo. Medicina nuclear: a fonte é o radiofármaco no paciente.",
              "A câmara gama detecta; não emite.",
              "Entre a administração e a imagem existe uma espera."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na cadeia da radiografia que você já estudou, de onde parte a radiação que forma a imagem?"
            },
            "help": "Lembre a ordem da cadeia: algo produz o feixe antes de ele chegar ao paciente.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Na radiografia a fonte é o tubo, e o detector registra o que atravessou o corpo. Guarde essa referência para comparar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na cadeia da radiografia que você já estudou, de onde parte a radiação que forma a imagem?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-01:i1:a",
                  "label": "Do detector, que emite e também registra",
                  "explanation": "O detector só registra o que chega. Retome a cadeia: quem produz o feixe fica do outro lado do paciente."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i1:b",
                  "label": "Do tubo de raios X, fora do paciente",
                  "explanation": "Isso. Na radiografia a fonte é o tubo, e o detector registra o que atravessou o corpo. Guarde essa referência para comparar."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i1:c",
                  "label": "Do corpo do paciente, que emite sozinho",
                  "explanation": "Na radiografia o corpo só atenua o feixe que vem de fora. Confira de novo onde o feixe nasce."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i1:d",
                  "label": "Da mesa de exame, aquecida pelo gerador",
                  "explanation": "A mesa apenas sustenta o paciente. Retome a cadeia a partir do componente que produz o feixe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada elemento do exame de medicina nuclear ao papel que ele cumpre."
            },
            "help": "Separe primeiro quem emite de quem detecta; os outros dois pares têm a ver com tempo.",
            "type": "matching",
            "feedback": {
              "correct": "Cada elemento no seu papel: o radiofármaco emite, a câmara detecta, a espera dá tempo ao acúmulo e os líquidos ajudam a eliminar.",
              "incorrect": "Retome o conceito: nesta modalidade um elemento emite de dentro do corpo e outro apenas detecta. Comece por esses dois."
            },
            "payload": {
              "prompt": "Ligue cada elemento do exame de medicina nuclear ao papel que ele cumpre.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-01:i2:1",
                  "left": "Radiofármaco",
                  "right": "Emite radiação gama de dentro do corpo"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-01:i2:2",
                  "left": "Câmara gama",
                  "right": "Detecta a radiação e a converte em imagem"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-01:i2:3",
                  "left": "Tempo de espera",
                  "right": "Deixa o material se acumular na região estudada"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-01:i2:4",
                  "left": "Líquidos após o exame",
                  "right": "Ajudam o corpo a eliminar o material"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene as etapas do serviço de medicina nuclear, na ordem ensinada nesta aula."
            },
            "help": "Pergunte a cada etapa o que precisa ter acontecido antes dela.",
            "type": "ordering",
            "feedback": {
              "correct": "Ordem da aula: identificar, administrar, esperar, adquirir e orientar. A espera vem antes da imagem porque o material precisa se acumular.",
              "incorrect": "Confira de novo: nada é administrado antes da identificação, e a imagem só faz sentido depois da espera."
            },
            "payload": {
              "prompt": "Ordene as etapas do serviço de medicina nuclear, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m13:aula-01:i3:2",
                  "label": "Profissional habilitado administra o radiofármaco"
                },
                {
                  "id": "item:rtg-2026:m13:aula-01:i3:5",
                  "label": "Paciente recebe as orientações de saída"
                },
                {
                  "id": "item:rtg-2026:m13:aula-01:i3:3",
                  "label": "Paciente aguarda o material se acumular"
                },
                {
                  "id": "item:rtg-2026:m13:aula-01:i3:1",
                  "label": "Conferir a identificação do paciente"
                },
                {
                  "id": "item:rtg-2026:m13:aula-01:i3:4",
                  "label": "A câmara gama adquire as imagens"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m13:aula-01:i3:1",
                "item:rtg-2026:m13:aula-01:i3:2",
                "item:rtg-2026:m13:aula-01:i3:3",
                "item:rtg-2026:m13:aula-01:i3:4",
                "item:rtg-2026:m13:aula-01:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual explicação está de acordo com o que a aula ensinou?"
            },
            "help": "Pense em quem é a fonte nesta modalidade e em qual é o papel do aparelho.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A câmara gama detecta a energia do radiofármaco e a converte em imagem; ela não emite. Por isso pode chegar bem perto sem acrescentar radiação.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge está deitado sob a câmara gama, quarenta minutos depois da injeção. O detector desce até ficar bem perto do peito dele. Ele pergunta ao Caio, com você ao lado: 'Essa máquina tão perto vai soltar muita radiação em mim?'",
              "prompt": "Qual explicação está de acordo com o que a aula ensinou?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-01:i4:a",
                  "label": "A câmara emite um feixe fraco, parecido com o da radiografia",
                  "explanation": "Essa frase descreve um tubo de raios X. Retome: nesta sala, o aparelho emite ou apenas detecta?"
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i4:b",
                  "label": "A câmara emite raios gama e depois recolhe o que volta",
                  "explanation": "A câmara gama não emite nada. Confira de novo de onde sai a radiação que ela registra."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i4:c",
                  "label": "A câmara só capta o que vem do material que o senhor recebeu",
                  "explanation": "Isso. A câmara gama detecta a energia do radiofármaco e a converte em imagem; ela não emite. Por isso pode chegar bem perto sem acrescentar radiação."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i4:d",
                  "label": "Neste exame não existe radiação nenhuma, pode ficar tranquilo",
                  "explanation": "Existe radiação, e ela vem do material administrado. Tranquilizar com uma informação errada não ajuda o paciente."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-01:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma colega de outro setor estranha: 'Injetaram o paciente e mandaram esperar duas horas. O aparelho quebrou?'. O que essa espera indica?"
            },
            "help": "Pense no que o material precisa fazer dentro do corpo antes de a imagem valer a pena.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Entre a administração e a imagem há um tempo de acúmulo, que varia conforme o exame e é definido pelo protocolo do serviço.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma colega de outro setor estranha: 'Injetaram o paciente e mandaram esperar duas horas. O aparelho quebrou?'. O que essa espera indica?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-01:i5:a",
                  "label": "Faz parte do exame: o material precisa se acumular",
                  "explanation": "Isso. Entre a administração e a imagem há um tempo de acúmulo, que varia conforme o exame e é definido pelo protocolo do serviço."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i5:b",
                  "label": "O tubo de raios X precisa aquecer antes de emitir",
                  "explanation": "Não há tubo emitindo neste exame. Retome de onde vem o sinal na medicina nuclear."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i5:c",
                  "label": "A radiação da sala precisa se dissipar antes da imagem",
                  "explanation": "A espera não tem a ver com a sala. Confira de novo o que acontece com o material dentro do corpo nesse intervalo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-01:i5:d",
                  "label": "O atraso indica falha, e o exame deve ser remarcado",
                  "explanation": "Esperar não é sinal de defeito nesta modalidade. Retome a sequência de etapas da aula."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-01:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Quem emite, quem detecta",
            "body": "Agora você consegue dizer que, na medicina nuclear, o sinal sai do paciente e o aparelho só detecta. Também consegue ordenar o percurso: identificar, administrar, esperar, adquirir e orientar.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Na dúvida sobre qualquer sala, pergunte primeiro: aqui, quem é a fonte?"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m13:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:nibib-medicina-nuclear",
          "source:rtg-2026:m13:cnen-norma-3-05",
          "source:rtg-2026:m13:cdc-contaminacao-exposicao"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Proteção e rastreio em MN",
            "body": "Hoje você vai conseguir diferenciar exposição de contaminação e dizer quando parar e chamar o supervisor de proteção radiológica.",
            "dialogue": {
              "setting": "Corredor da medicina nuclear, fim do turno",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Antes de sair, passo o monitor nas mãos, no jaleco e na bancada. Todo dia. E anoto o resultado."
                },
                {
                  "speaker": "duda",
                  "text": "Mas você usou luva o tempo todo. E na sala de raios X ninguém faz isso. Por que aqui é diferente?"
                },
                {
                  "speaker": "lia",
                  "text": "Antes de responder, separe duas coisas: a radiação que chega até você e o material que pode ficar onde não devia."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Exposição não é contaminação",
            "body": "Exposição é a energia da radiação chegando ao corpo: quem faz uma radiografia é exposto, mas não fica contaminado. Contaminação é material radioativo onde não deveria estar: na pele, na roupa, numa superfície ou dentro do corpo. Na medicina nuclear o radiofármaco costuma ser uma solução injetável: uma gota fora do lugar já é contaminação. Por isso a norma ANSN 3.05 exige luvas descartáveis e jaleco de manga longa de quem manipula, sala de espera exclusiva para o paciente injetado e monitoração diária, e a cada suspeita, de corpo, roupas e superfícies, com registro. Suspeitou? Estudante não manipula nem limpa: para, descreve e chama o supervisor de proteção radiológica.",
            "keyPoints": [
              "Exposição: energia que chega. Contaminação: material fora do lugar.",
              "Monitoração diária e a cada suspeita, sempre registrada.",
              "Suspeitou? Não toque, avise e chame o supervisor de proteção radiológica."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, onde ficava a fonte de radiação depois da administração do radiofármaco?"
            },
            "help": "Lembre o que mudou em relação à radiografia: o sinal passou a sair de onde?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Por isso o paciente injetado tem sala de espera e sanitário exclusivos no serviço.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, onde ficava a fonte de radiação depois da administração do radiofármaco?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-02:i1:a",
                  "label": "Na câmara gama, que emite o sinal",
                  "explanation": "A câmara só detecta. Retome a aula anterior: quem emite depois da administração?"
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i1:b",
                  "label": "Na seringa vazia, já sem atividade",
                  "explanation": "Depois da administração, o que importa para a imagem está em outro lugar. Confira de novo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i1:c",
                  "label": "No monitor que mostra as imagens",
                  "explanation": "O monitor apenas exibe. Retome de onde o sinal parte nesta modalidade."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i1:d",
                  "label": "No paciente, que passa a emitir",
                  "explanation": "Isso. Por isso o paciente injetado tem sala de espera e sanitário exclusivos no serviço."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada medida do serviço de medicina nuclear ao que ela faz."
            },
            "help": "Pergunte a cada medida: você impede, verifica, guarda ou separa?",
            "type": "matching",
            "feedback": {
              "correct": "Barreira, verificação, registro e separação: quatro medidas diferentes para o mesmo cuidado.",
              "incorrect": "Retome o conceito: uma medida impede o contato, outra verifica, outra guarda a informação e outra separa pessoas."
            },
            "payload": {
              "prompt": "Ligue cada medida do serviço de medicina nuclear ao que ela faz.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-02:i2:1",
                  "left": "Luvas e jaleco de manga longa",
                  "right": "Ficam entre o material e a pele ou a roupa"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-02:i2:2",
                  "left": "Monitor de contaminação",
                  "right": "Verifica corpo, roupas e superfícies"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-02:i2:3",
                  "left": "Registro da monitoração",
                  "right": "Guarda o que foi medido, para consulta depois"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-02:i2:4",
                  "left": "Sala de espera exclusiva",
                  "right": "Separa o paciente injetado do público"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Como a aula classifica o que aconteceu com Duda?"
            },
            "help": "Verifique se, em algum momento, houve contato com o material.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Sem contato com material radioativo não há contaminação. A dúvida sobre a exposição, ela leva ao supervisor de proteção radiológica.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Duda ficou cerca de dois minutos ao lado de um paciente injetado, na sala de espera exclusiva, sem tocar em nada nem em ninguém. Mais tarde, preocupada, pergunta se 'pegou contaminação' e se precisa lavar a roupa.",
              "prompt": "Como a aula classifica o que aconteceu com Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-02:i3:a",
                  "label": "Exposição: a energia chegou, o material não",
                  "explanation": "Isso. Sem contato com material radioativo não há contaminação. A dúvida sobre a exposição, ela leva ao supervisor de proteção radiológica."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i3:b",
                  "label": "Contaminação externa: a radiação gruda na roupa",
                  "explanation": "Radiação não gruda: contaminação exige material radioativo sobre a pele ou a roupa. Confira de novo se houve contato."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i3:c",
                  "label": "Contaminação interna: ela respirou a radiação gama",
                  "explanation": "Contaminação interna exige material dentro do corpo, engolido ou inalado. Estar perto não faz isso."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i3:d",
                  "label": "Nenhuma das duas: paciente injetado não emite nada",
                  "explanation": "O paciente injetado emite, sim. Retome onde fica a fonte nesta modalidade."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-02:i3:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Você não sabe o que é o líquido. Pense em quem tem instrumento e autoridade para verificar.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Pode ser contaminação. Sem tocar nem limpar, você evita que alguém pise e aciona o supervisor de proteção radiológica, que monitora e decide.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você acompanha o Caio pelo setor. Ao passar pela sala de administração, vazia naquele momento, você vê uma gota de líquido no chão, perto da bancada onde ficam as seringas blindadas. Uma funcionária da limpeza vem pelo corredor com o carrinho.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-02:i4:a",
                  "label": "Enxuga com papel-toalha para ninguém escorregar ali",
                  "explanation": "Enxugar pode espalhar o material e contaminar você. Retome: estudante não limpa; para e chama."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i4:b",
                  "label": "Não toca, avisa quem se aproxima e chama o supervisor",
                  "explanation": "Isso. Pode ser contaminação. Sem tocar nem limpar, você evita que alguém pise e aciona o supervisor de proteção radiológica, que monitora e decide."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i4:c",
                  "label": "Passa ao lado com cuidado e segue o roteiro do dia",
                  "explanation": "Seguir em frente deixa o risco para a próxima pessoa. Confira de novo a quem a suspeita deve ser comunicada."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i4:d",
                  "label": "Pede à funcionária que lave o piso com bastante água",
                  "explanation": "Lavar espalha o material e expõe a colega. A suspeita vai primeiro ao supervisor de proteção radiológica."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-02:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: No quarto de um paciente internado para terapia com radiofármaco, a norma manda cobrir com plástico impermeável os objetos que podem ser contaminados. Que ideia da aula explica a medida?"
            },
            "help": "Decida primeiro se a medida mira a energia que chega ou o material que se deposita.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O plástico recebe o material no lugar do objeto e pode ser retirado. O quarto ainda é monitorado antes de receber outro paciente.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "No quarto de um paciente internado para terapia com radiofármaco, a norma manda cobrir com plástico impermeável os objetos que podem ser contaminados. Que ideia da aula explica a medida?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-02:i5:a",
                  "label": "O plástico bloqueia a radiação gama do paciente",
                  "explanation": "Plástico fino não funciona como blindagem. Retome a diferença entre energia que chega e material que se deposita."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i5:b",
                  "label": "O plástico reduz a atividade do radiofármaco",
                  "explanation": "Nada na superfície muda a atividade do material. Confira de novo o que a barreira evita."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i5:c",
                  "label": "Uma barreira impede o material de ficar no objeto",
                  "explanation": "Isso. O plástico recebe o material no lugar do objeto e pode ser retirado. O quarto ainda é monitorado antes de receber outro paciente."
                },
                {
                  "id": "option:rtg-2026:m13:aula-02:i5:d",
                  "label": "O plástico dispensa a monitoração do quarto",
                  "explanation": "A monitoração continua obrigatória depois da saída do paciente. A barreira só facilita a remoção."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Energia que chega, material que fica",
            "body": "Agora você consegue separar exposição de contaminação, reconhecer as medidas do setor (barreira, monitoração e registro) e agir diante de uma suspeita: não tocar, avisar e chamar o supervisor de proteção radiológica.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Registrar não é burocracia: é o que permite a alguém refazer o caminho do material depois."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m13:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:anvisa-rdc-611-2022",
          "source:rtg-2026:m13:inca-radioterapia",
          "source:rtg-2026:m13:radiologyinfo-teleterapia",
          "source:rtg-2026:m13:nci-radioterapia-externa"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Radioterapia no cuidado oncológico",
            "body": "Hoje você vai conseguir relacionar a finalidade da radioterapia, os papéis da equipe e a conferência feita antes de cada aplicação.",
            "dialogue": {
              "setting": "Sala de espera da radioterapia",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "Hoje é minha décima aplicação. Venho todo dia, de segunda a sexta. Essa máquina não tira nenhuma foto?"
                },
                {
                  "speaker": "duda",
                  "text": "Eu também pensei que fosse um exame. Se não é para ver, para que serve a radiação aqui?"
                },
                {
                  "speaker": "lia",
                  "text": "Guarde essa pergunta. E repare quantas pessoas conferem a mesma coisa antes de o aparelho ligar."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Radiação para tratar",
            "body": "Na radioterapia, a radiação ionizante não forma imagem: ela é o tratamento. O objetivo é destruir células do tumor ou impedir que se multipliquem, para curar, controlar a doença ou aliviar sintomas. Na radioterapia externa, o aparelho fica afastado do paciente e as aplicações costumam ser diárias, de segunda a sexta. Na braquiterapia, a fonte fica em contato com a região tratada. Na equipe, o radio-oncologista define e prescreve; a física médica calcula a dose e controla a qualidade dos aparelhos; o técnico ou tecnólogo posiciona o paciente e opera o aparelho; a enfermagem orienta os cuidados. Antes de cada aplicação, marcas na pele ajudam a conferir a posição planejada.",
            "keyPoints": [
              "Diagnóstico: radiação para ver. Radioterapia: radiação para tratar.",
              "Quem prescreve, quem calcula e quem posiciona são pessoas diferentes.",
              "Cada aplicação repete a conferência da posição."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Nos exames de imagem que você estudou até aqui, como a norma sanitária trata a dose de radiação no paciente?"
            },
            "help": "Lembre o princípio da otimização: a dose do exame serve a qual finalidade?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. No diagnóstico, a radiação serve para ver, e a exposição é a menor que garante a imagem esperada. Compare com o que muda nesta aula.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Nos exames de imagem que você estudou até aqui, como a norma sanitária trata a dose de radiação no paciente?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-03:i1:a",
                  "label": "A maior possível, para a imagem ficar mais nítida",
                  "explanation": "Mais dose não é objetivo do exame. Retome o princípio de otimização que você estudou."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i1:b",
                  "label": "Uma dose fixa, igual para todos os pacientes",
                  "explanation": "A exposição se ajusta ao exame e ao paciente. Confira de novo o que a otimização pede."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i1:c",
                  "label": "A mínima necessária para a qualidade da imagem",
                  "explanation": "Isso. No diagnóstico, a radiação serve para ver, e a exposição é a menor que garante a imagem esperada. Compare com o que muda nesta aula."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i1:d",
                  "label": "Nenhuma: exame de imagem não entrega dose",
                  "explanation": "Exames com raios X entregam dose, sim. Retome por que ela precisa ser otimizada."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-03:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada membro da equipe de radioterapia ao papel descrito na aula."
            },
            "help": "Comece por quem prescreve; depois ache quem transforma a prescrição em cálculo.",
            "type": "matching",
            "feedback": {
              "correct": "Prescrever, calcular, posicionar e orientar: quatro papéis que se conferem entre si.",
              "incorrect": "Retome o conceito: quem decide o tratamento não é quem calcula, e quem calcula não é quem posiciona."
            },
            "payload": {
              "prompt": "Ligue cada membro da equipe de radioterapia ao papel descrito na aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-03:i2:1",
                  "left": "Radio-oncologista",
                  "right": "Define o tratamento e prescreve a dose"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-03:i2:2",
                  "left": "Física médica",
                  "right": "Calcula a dose e controla a qualidade dos aparelhos"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-03:i2:3",
                  "left": "Técnico ou tecnólogo",
                  "right": "Posiciona o paciente e opera o aparelho"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-03:i2:4",
                  "left": "Enfermagem",
                  "right": "Orienta os cuidados durante o tratamento"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: A ficha fictícia de Seu Jorge informa que a radioterapia foi indicada para reduzir um tumor que causa dor, sem expectativa de cura. Em qual finalidade descrita na aula esse tratamento se encaixa?"
            },
            "help": "A ficha já diz o que se espera do tratamento. Procure a finalidade que combina com isso.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Quando a cura não é possível, a radioterapia ainda pode reduzir o tumor e aliviar dor e outros sintomas.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "A ficha fictícia de Seu Jorge informa que a radioterapia foi indicada para reduzir um tumor que causa dor, sem expectativa de cura. Em qual finalidade descrita na aula esse tratamento se encaixa?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-03:i3:a",
                  "label": "Formar imagens para acompanhar o tumor de perto",
                  "explanation": "Na radioterapia a radiação não serve para formar imagem. Retome para que ela é usada."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i3:b",
                  "label": "Aliviar sintomas e melhorar a qualidade de vida",
                  "explanation": "Isso. Quando a cura não é possível, a radioterapia ainda pode reduzir o tumor e aliviar dor e outros sintomas."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i3:c",
                  "label": "Curar, pois toda radioterapia tem intenção curativa",
                  "explanation": "Nem toda indicação busca cura. Confira de novo as finalidades que a aula listou."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i3:d",
                  "label": "Medir a radiação que o próprio tumor emite",
                  "explanation": "O tumor não emite radiação. Retome o que a radiação faz com as células dele."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-03:i3:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Pense para que servem as marcas e em quem responde pela posição antes do feixe.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. As marcas guiam a posição em toda aplicação. Se estão apagadas, quem confere e resolve é a equipe do tratamento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você acompanha o posicionamento de Dona Marta para a aplicação do dia. De um lado do corpo, as marcas na pele estão quase apagadas. A técnica responsável foi chamada à sala de comando. Dona Marta diz: 'Pode alinhar pelo que der, é só hoje'.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-03:i4:a",
                  "label": "Reforça as marcas com caneta para adiantar o serviço",
                  "explanation": "Redesenhar a marca por conta própria pode fixar uma posição errada. Retome a quem cabe conferir a posição."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i4:b",
                  "label": "Alinha pela marca visível e deixa tudo pronto",
                  "explanation": "Alinhar com referência incompleta põe a posição em dúvida. Confira de novo o que a aula diz sobre a conferência."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i4:c",
                  "label": "Pede a Dona Marta que mostre onde ficava a marca",
                  "explanation": "A memória da paciente não substitui a referência do planejamento. A dúvida vai para a técnica responsável."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i4:d",
                  "label": "Para e avisa a técnica antes de qualquer ajuste",
                  "explanation": "Isso. As marcas guiam a posição em toda aplicação. Se estão apagadas, quem confere e resolve é a equipe do tratamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-03:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num serviço de braquiterapia, depois de posicionado o aplicador, o físico calcula a dose com base numa imagem e o médico confere antes de liberar o início. Que ideia da aula essa rotina repete?"
            },
            "help": "Observe quantos profissionais aparecem na rotina e o que cada um faz com a dose.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Também na braquiterapia a dose passa por mais de um profissional antes de ser entregue.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num serviço de braquiterapia, depois de posicionado o aplicador, o físico calcula a dose com base numa imagem e o médico confere antes de liberar o início. Que ideia da aula essa rotina repete?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-03:i5:a",
                  "label": "Quem calcula e quem prescreve conferem antes da entrega",
                  "explanation": "Isso. Também na braquiterapia a dose passa por mais de um profissional antes de ser entregue."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i5:b",
                  "label": "A radiação serve para formar a imagem do aplicador",
                  "explanation": "A imagem ali é apoio ao cálculo; a radiação do tratamento tem outra função. Retome a finalidade da radioterapia."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i5:c",
                  "label": "O profissional que posiciona decide a dose sozinho",
                  "explanation": "A dose não é decisão de uma pessoa só. Confira de novo a divisão de papéis."
                },
                {
                  "id": "option:rtg-2026:m13:aula-03:i5:d",
                  "label": "A conferência só é necessária na primeira aplicação",
                  "explanation": "A conferência se repete a cada aplicação. Retome o último ponto do conceito."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-03:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Ver é uma coisa, tratar é outra",
            "body": "Agora você consegue dizer para que serve a radiação na radioterapia, ligar cada profissional ao seu papel e reconhecer que a posição é conferida antes de cada aplicação.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Em radioterapia, ninguém confere sozinho. Quando algo não bate, a pergunta certa é: quem precisa saber disso agora?"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m13:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-teleterapia",
          "source:rtg-2026:m13:radiologyinfo-igrt",
          "source:rtg-2026:m13:nci-radioterapia-externa"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Simulação e posicionamento em RT",
            "body": "Hoje você vai conseguir diferenciar a imagem que confere a posição do feixe que entrega o tratamento.",
            "dialogue": {
              "setting": "Sala do tomógrafo de simulação",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Tomografia na radioterapia? Achei que aqui ninguém fazia exame."
                },
                {
                  "speaker": "caio",
                  "text": "Esta não é para laudo. É para todo mundo saber em que posição a Dona Marta vai ficar em cada aplicação."
                },
                {
                  "speaker": "pixel",
                  "text": "Então a pergunta do dia é: o que essa imagem responde, e o que ela não responde?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Imagem para localizar, feixe para tratar",
            "body": "Antes da primeira aplicação vem a simulação: a equipe define a posição de tratamento, prepara imobilizadores, como a máscara, faz marcas na pele e adquire uma tomografia nessa posição. Essas imagens viram a referência do planejamento. Em cada dia de tratamento, o paciente é reposicionado com as mesmas marcas e imobilizadores, com apoio de lasers de alinhamento. Antes da dose, novas imagens são comparadas com a referência; se a posição difere, a equipe ajusta e confere de novo. Só então o feixe de tratamento é ligado, com o operador fora da sala. A imagem de localização responde a uma pergunta: está no lugar? Ela não diagnostica nem trata.",
            "keyPoints": [
              "Simulação: define e registra a posição.",
              "Imagem de localização: compara o dia com a referência.",
              "Entrega: só depois da conferência."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que a equipe de radioterapia repete antes de cada aplicação?"
            },
            "help": "Pense no que precisa estar igual em todas as aplicações.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Hoje você vai ver como essa conferência é feita, da simulação à imagem do dia.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que a equipe de radioterapia repete antes de cada aplicação?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-04:i1:a",
                  "label": "A conferência da posição planejada",
                  "explanation": "Isso. Hoje você vai ver como essa conferência é feita, da simulação à imagem do dia."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i1:b",
                  "label": "A prescrição de uma dose nova a cada dia",
                  "explanation": "A prescrição é definida pelo radio-oncologista no início. Retome o que se repete diariamente."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i1:c",
                  "label": "O cálculo completo do plano de tratamento",
                  "explanation": "O cálculo é feito no planejamento, pela física médica. Confira de novo o que acontece em toda aplicação."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i1:d",
                  "label": "A escolha de um aparelho diferente",
                  "explanation": "O aparelho faz parte do que foi planejado. Retome o último ponto da aula anterior."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-04:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o percurso do paciente na radioterapia externa, na ordem ensinada nesta aula."
            },
            "help": "Ache primeiro a etapa que cria a referência e a etapa que depende de todas as outras.",
            "type": "ordering",
            "feedback": {
              "correct": "Ordem da aula: simular, planejar, reposicionar, conferir e só então tratar.",
              "incorrect": "Confira de novo: a referência nasce na simulação, e o feixe só vem depois da comparação do dia."
            },
            "payload": {
              "prompt": "Ordene o percurso do paciente na radioterapia externa, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m13:aula-04:i2:4",
                  "label": "Imagem de localização comparada à referência"
                },
                {
                  "id": "item:rtg-2026:m13:aula-04:i2:1",
                  "label": "Simulação: posição, imobilizadores e marcas"
                },
                {
                  "id": "item:rtg-2026:m13:aula-04:i2:2",
                  "label": "Tomografia de planejamento na posição definida"
                },
                {
                  "id": "item:rtg-2026:m13:aula-04:i2:3",
                  "label": "Reposicionamento no dia, com marcas e lasers"
                },
                {
                  "id": "item:rtg-2026:m13:aula-04:i2:5",
                  "label": "Entrega do feixe de tratamento"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m13:aula-04:i2:1",
                "item:rtg-2026:m13:aula-04:i2:2",
                "item:rtg-2026:m13:aula-04:i2:3",
                "item:rtg-2026:m13:aula-04:i2:4",
                "item:rtg-2026:m13:aula-04:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada recurso da radioterapia externa ao que ele garante."
            },
            "help": "Separe o que segura o corpo, o que orienta o alinhamento e as duas imagens.",
            "type": "matching",
            "feedback": {
              "correct": "Imobilizar, alinhar, servir de referência e conferir: cada recurso responde por uma parte da posição.",
              "incorrect": "Retome o conceito: dois recursos mantêm a posição e dois são imagens com funções diferentes."
            },
            "payload": {
              "prompt": "Ligue cada recurso da radioterapia externa ao que ele garante.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-04:i3:1",
                  "left": "Máscara ou molde",
                  "right": "Limita o movimento durante a aplicação"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-04:i3:2",
                  "left": "Marcas na pele",
                  "right": "Guiam o alinhamento em cada dia"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-04:i3:3",
                  "left": "Imagens da simulação",
                  "right": "Servem de referência para o planejamento"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-04:i3:4",
                  "left": "Imagem do dia",
                  "right": "Mostra se a posição coincide com a referência"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual resposta descreve corretamente esse momento?"
            },
            "help": "Repare no que a equipe faz com a imagem na tela.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A imagem do dia é comparada com a referência; o feixe de tratamento só vem depois dessa conferência.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge já está deitado na mesa do aparelho, com os imobilizadores. O equipamento adquire uma imagem, e na tela a equipe a sobrepõe à da simulação. Ele pergunta: 'Já estão me tratando, ou é mais um exame para ver como o tumor está?'",
              "prompt": "Qual resposta descreve corretamente esse momento?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-04:i4:a",
                  "label": "É o tratamento: essa imagem já entrega a dose do dia",
                  "explanation": "A dose do dia é entregue pelo feixe de tratamento, numa etapa posterior. Retome a ordem do percurso."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i4:b",
                  "label": "É uma imagem para conferir a posição antes de tratar",
                  "explanation": "Isso. A imagem do dia é comparada com a referência; o feixe de tratamento só vem depois dessa conferência."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i4:c",
                  "label": "É um exame para avaliar se o tumor está diminuindo",
                  "explanation": "Essa imagem não é para diagnóstico nem para avaliar resposta. Confira de novo a pergunta que ela responde."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i4:d",
                  "label": "É um teste do aparelho, sem relação com o senhor",
                  "explanation": "A imagem tem tudo a ver com ele: mostra a posição dele naquele dia. Retome a função da comparação."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-04:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Pelo que a aula ensinou, o que a equipe faz antes da entrega?"
            },
            "help": "A imagem do dia fez uma pergunta e recebeu um 'não'. O que resolve esse 'não'?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Quando a posição difere da referência, a equipe reposiciona e adquire nova imagem antes de entregar a dose.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Em outro serviço fictício, a comparação do dia mostra a paciente deslocada em relação à referência. A agenda está atrasada, e alguém na sala de comando sugere: 'Trata assim mesmo, é pouca diferença'.",
              "prompt": "Pelo que a aula ensinou, o que a equipe faz antes da entrega?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-04:i5:a",
                  "label": "Entrega a dose e anota o desvio no fim do dia",
                  "explanation": "Anotar depois não devolve a posição. Retome o que vem antes do feixe quando há diferença."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i5:b",
                  "label": "Refaz todo o planejamento antes de continuar",
                  "explanation": "Um desvio de posição no dia se resolve reposicionando. Refazer o plano é outra decisão, da equipe médica e da física."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i5:c",
                  "label": "Aumenta o tempo de feixe para compensar",
                  "explanation": "Mais tempo de feixe muda a dose, não a posição. Confira de novo o que a imagem do dia veio conferir."
                },
                {
                  "id": "option:rtg-2026:m13:aula-04:i5:d",
                  "label": "Ajusta a posição e confere com nova imagem",
                  "explanation": "Isso. Quando a posição difere da referência, a equipe reposiciona e adquire nova imagem antes de entregar a dose."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-04:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Primeiro conferir, depois tratar",
            "body": "Agora você consegue separar três momentos: a simulação, que cria a referência; a imagem de localização, que confere a posição do dia; e a entrega, que só acontece depois da conferência.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Aqui a pressa perde sempre para a conferência. Imagem que não bate é motivo para parar, não para torcer."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m13:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:kjp-seguranca-radiacao",
          "source:rtg-2026:m13:radiologyinfo-angiografia",
          "source:rtg-2026:m13:anvisa-rdc-611-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Sala intervencionista",
            "body": "Hoje você vai conseguir reconhecer os equipamentos da sala intervencionista, as barreiras da equipe e quando avisar.",
            "dialogue": {
              "setting": "Sala intervencionista, antes do procedimento",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Aqui boa parte da equipe fica dentro da sala com o feixe ligado, ao lado do paciente. Não dá para esperar do lado de fora."
                },
                {
                  "speaker": "duda",
                  "text": "Então o avental não é enfeite. Mas o feixe aponta para o paciente, não para nós."
                },
                {
                  "speaker": "lia",
                  "text": "Certo. Então de onde vem a radiação que chega à equipe? Lembre o que você estudou sobre espalhamento."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Imagem ao vivo, equipe dentro da sala",
            "body": "Na radiologia intervencionista, o médico conduz um cateter por dentro dos vasos, guiado por fluoroscopia: raios X convertidos em vídeo. A sala reúne mesa, tubo de raios X, detector, monitores, cateteres e contraste, que torna os vasos visíveis. O médico faz o ato invasivo; o técnico ou tecnólogo dirige o feixe e registra as imagens. Como a equipe fica na sala, recebe radiação espalhada pelo paciente, mais intensa do lado do tubo. As barreiras se somam, conforme o protocolo do serviço: avental plumbífero, protetor de tireoide, óculos plumbíferos, anteparo suspenso e distância. A sala é área controlada: só entra quem é necessário ao procedimento, e a equipe usa dosímetro.",
            "keyPoints": [
              "A maior fonte para a equipe é o espalhamento que sai do paciente.",
              "Avental, protetor de tireoide, óculos, anteparo e distância se somam.",
              "Área controlada: entra só quem é necessário."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Você estudou que parte do feixe muda de direção ao interagir com o corpo. Para onde vai essa radiação espalhada?"
            },
            "help": "Lembre por que a equipe se protege mesmo fora do feixe primário.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O espalhamento sai do paciente em todas as direções. Na sala intervencionista, a equipe está bem ao lado.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Você estudou que parte do feixe muda de direção ao interagir com o corpo. Para onde vai essa radiação espalhada?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-05:i1:a",
                  "label": "Só para a frente, em direção ao detector",
                  "explanation": "O espalhamento não segue só o caminho do feixe. Retome o que você viu sobre ele em atenuação e espalhamento."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i1:b",
                  "label": "Só de volta, para dentro do próprio tubo",
                  "explanation": "A radiação espalhada não retorna apenas ao tubo. Confira de novo como ela se distribui."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i1:c",
                  "label": "Para lugar nenhum: ela é toda absorvida",
                  "explanation": "Parte do feixe é absorvida, mas parte se espalha pela sala. Retome a aula de espalhamento."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i1:d",
                  "label": "Para todas as direções, inclusive a da equipe",
                  "explanation": "Isso. O espalhamento sai do paciente em todas as direções. Na sala intervencionista, a equipe está bem ao lado."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-05:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item da sala intervencionista ao papel que ele cumpre."
            },
            "help": "Siga o caminho do feixe, do início até a tela.",
            "type": "matching",
            "feedback": {
              "correct": "Emitir, receber, mostrar e realçar: a cadeia da fluoroscopia dentro da sala.",
              "incorrect": "Retome a cadeia: um item emite, outro recebe, outro mostra e outro realça os vasos."
            },
            "payload": {
              "prompt": "Ligue cada item da sala intervencionista ao papel que ele cumpre.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-05:i2:1",
                  "left": "Tubo de raios X",
                  "right": "Emite o feixe que atravessa o paciente"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-05:i2:2",
                  "left": "Detector",
                  "right": "Recebe o feixe e gera o vídeo da fluoroscopia"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-05:i2:3",
                  "left": "Monitor",
                  "right": "Mostra as imagens que guiam o procedimento"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-05:i2:4",
                  "left": "Contraste",
                  "right": "Torna os vasos visíveis na imagem"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na sala, o tubo fica de um lado do paciente e o detector, do outro. Segundo a aula, de que lado a radiação espalhada que chega à equipe é mais intensa?"
            },
            "help": "Pense em qual face do paciente recebe o feixe primeiro.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O espalhamento é maior perto do tubo; quem trabalha desse lado recebe mais do que quem fica do lado oposto.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na sala, o tubo fica de um lado do paciente e o detector, do outro. Segundo a aula, de que lado a radiação espalhada que chega à equipe é mais intensa?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-05:i3:a",
                  "label": "Do lado do detector de imagem",
                  "explanation": "Do lado do detector o espalhamento é menor. Confira de novo o que o conceito diz sobre o lado do tubo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i3:b",
                  "label": "É igual dos dois lados da mesa",
                  "explanation": "A distribuição não é uniforme. Retome a frase do conceito sobre a intensidade do espalhamento."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i3:c",
                  "label": "Do lado do tubo de raios X",
                  "explanation": "Isso. O espalhamento é maior perto do tubo; quem trabalha desse lado recebe mais do que quem fica do lado oposto."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i3:d",
                  "label": "Atrás dos monitores da sala",
                  "explanation": "Os monitores não definem onde o espalhamento é maior. Retome a posição do tubo."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-05:i3:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Quem controla o feixe precisa de qual informação neste instante?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A equipe pode interromper a exposição e orientar o colega. A sala é área controlada, e eventos assim são comunicados sem demora.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você observa um procedimento de dentro da sala, de avental e protetor de tireoide, no ponto indicado pela Profa. Lia. Com a fluoroscopia em uso, a porta se abre e um colega de outro setor entra sem avental para entregar um material e para ao lado da mesa.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-05:i4:a",
                  "label": "Avisa a equipe na hora sobre a entrada do colega",
                  "explanation": "Isso. A equipe pode interromper a exposição e orientar o colega. A sala é área controlada, e eventos assim são comunicados sem demora."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i4:b",
                  "label": "Entrega o seu avental a ele e fica sem proteção",
                  "explanation": "Ficar sem barreira cria um segundo problema. Retome a quem cabe interromper e orientar."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i4:c",
                  "label": "Espera o fim do procedimento para comentar o caso",
                  "explanation": "Até lá o colega segue exposto ao espalhamento. Confira de novo quando um evento deve ser informado."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i4:d",
                  "label": "Sai da sala em silêncio para não atrapalhar ninguém",
                  "explanation": "Sair não protege o colega, e a equipe continua sem saber. Retome o que fazer diante de um risco que você percebeu."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-05:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual raciocínio da aula vale também nesse cenário?"
            },
            "help": "O que mudou foi a sala. Verifique se a origem da radiação que chega à equipe mudou.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Onde há fluoroscopia com a equipe por perto, há espalhamento. As mesmas barreiras se aplicam, conforme o protocolo do serviço.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Um aparelho móvel de fluoroscopia, o arco em C, é levado ao centro cirúrgico para apoiar uma cirurgia ortopédica. Parte da equipe da cirurgia nunca trabalhou com ele e pergunta se as regras da sala intervencionista também valem ali.",
              "prompt": "Qual raciocínio da aula vale também nesse cenário?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-05:i5:a",
                  "label": "Aparelho móvel não espalha radiação pela sala",
                  "explanation": "O espalhamento vem do paciente, não do tipo de aparelho. Retome de onde sai a radiação que chega à equipe."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i5:b",
                  "label": "O paciente espalha radiação: barreiras e distância valem",
                  "explanation": "Isso. Onde há fluoroscopia com a equipe por perto, há espalhamento. As mesmas barreiras se aplicam, conforme o protocolo do serviço."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i5:c",
                  "label": "Fora da sala intervencionista, o avental é opcional",
                  "explanation": "A proteção acompanha a exposição, não o nome da sala. Confira de novo as barreiras da aula."
                },
                {
                  "id": "option:rtg-2026:m13:aula-05:i5:d",
                  "label": "Só quem opera o aparelho recebe radiação espalhada",
                  "explanation": "O espalhamento alcança todos que estão por perto. Retome para onde ele se distribui."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-05:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Dentro da sala, com barreiras",
            "body": "Agora você consegue nomear os equipamentos da sala intervencionista, explicar por que a equipe recebe radiação espalhada e listar as barreiras que se somam. E sabe que uma entrada indevida na sala se avisa na hora.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Antes de entrar, eu me pergunto: preciso estar aqui, estou protegido e sei onde ficar? Se faltar um, não entro."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m13:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m13:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m13-v1",
        "sourceIds": [
          "source:rtg-2026:m13:cdc-contaminacao-exposicao",
          "source:rtg-2026:m13:nibib-medicina-nuclear",
          "source:rtg-2026:m13:inca-radioterapia",
          "source:rtg-2026:m13:radiologyinfo-angiografia",
          "source:rtg-2026:m13:planalto-lei-7394",
          "source:rtg-2026:m13:radiologyinfo-igrt",
          "source:rtg-2026:m13:radiologyinfo-teleterapia",
          "source:rtg-2026:m13:cnen-norma-3-05"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Escolher o percurso seguro",
            "body": "Hoje você vai conseguir comparar as três modalidades pela fonte, pela verificação principal e por quem chamar.",
            "dialogue": {
              "setting": "Sala de estudos, fim do rodízio",
              "lines": [
                {
                  "speaker": "pixel",
                  "text": "Três setores em uma semana. Se eu soltasse você num corredor sem placa, como saberia em qual deles está?"
                },
                {
                  "speaker": "duda",
                  "text": "Eu começaria perguntando de onde vem a radiação naquela sala. Depois disso eu travo."
                },
                {
                  "speaker": "lia",
                  "text": "É um bom começo. Acrescente duas perguntas: o que se confere ali e quem você chama."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Três perguntas para qualquer setor",
            "body": "Diante de um setor novo, faça três perguntas. Onde está a fonte? Na medicina nuclear, no paciente que recebeu o radiofármaco; na radioterapia externa, no aparelho de tratamento; na intervencionista, no tubo, com espalhamento na sala. O que se confere? Na medicina nuclear, identificação, registro e contaminação; na radioterapia, a posição contra a referência; na intervencionista, barreiras e acesso. Quem eu chamo? O profissional responsável pelo setor e o supervisor de proteção radiológica. A Lei 7.394/1985, que regula a profissão de técnico em radiologia, inclui as técnicas radioterápica e de medicina nuclear, mas, como estudante, você não administra radiofármaco, não planeja nem entrega dose e não faz ato invasivo.",
            "keyPoints": [
              "Onde está a fonte: no paciente, no aparelho ou no tubo?",
              "O que se confere antes: registro, posição ou barreiras?",
              "Na dúvida: parar, descrever e chamar o responsável."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula sobre proteção em medicina nuclear, o que separava contaminação de exposição?"
            },
            "help": "Uma das duas envolve energia; a outra envolve algo que pode ser transportado.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Exposição é energia que chega; contaminação é material radioativo na pele, na roupa, em superfícies ou dentro do corpo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula sobre proteção em medicina nuclear, o que separava contaminação de exposição?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-06:i1:a",
                  "label": "Na contaminação a dose é sempre mais alta",
                  "explanation": "A diferença não está no tamanho da dose. Retome o que precisa existir para haver contaminação."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i1:b",
                  "label": "Na contaminação há material fora do lugar",
                  "explanation": "Isso. Exposição é energia que chega; contaminação é material radioativo na pele, na roupa, em superfícies ou dentro do corpo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i1:c",
                  "label": "Na exposição a pessoa passa a emitir radiação",
                  "explanation": "Quem é exposto não passa a emitir. Confira de novo a definição das duas situações."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i1:d",
                  "label": "Na exposição o material entra no organismo",
                  "explanation": "Material dentro do corpo é contaminação interna. Retome qual das duas envolve material."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-06:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada modalidade ao lugar onde está a fonte de radiação."
            },
            "help": "Comece pela modalidade em que o paciente recebe um material antes da imagem.",
            "type": "matching",
            "feedback": {
              "correct": "A primeira pergunta respondida para as quatro situações: paciente, aparelho, contato e tubo.",
              "incorrect": "Retome as aulas da unidade: em uma delas a fonte está no paciente; em outra, a equipe divide a sala com o tubo."
            },
            "payload": {
              "prompt": "Ligue cada modalidade ao lugar onde está a fonte de radiação.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m13:aula-06:i2:1",
                  "left": "Medicina nuclear",
                  "right": "No paciente, depois do radiofármaco"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-06:i2:2",
                  "left": "Radioterapia externa",
                  "right": "No aparelho, afastado do paciente"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-06:i2:3",
                  "left": "Braquiterapia",
                  "right": "Em contato com a região tratada"
                },
                {
                  "id": "pair:rtg-2026:m13:aula-06:i2:4",
                  "left": "Radiologia intervencionista",
                  "right": "No tubo, com a equipe dentro da sala"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: A qual setor pertence essa verificação?"
            },
            "help": "Duas expressões da ficha só fazem sentido em uma das modalidades. Ache essas expressões.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Comparar a imagem do dia com a referência da simulação é a conferência que antecede a entrega do tratamento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Três fichas de verificação da simulação chegaram misturadas à mesa da Profa. Lia. Uma delas diz: 'Antes de liberar o feixe, comparar a imagem do dia com a referência e reposicionar se houver diferença'.",
              "prompt": "A qual setor pertence essa verificação?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-06:i3:a",
                  "label": "Medicina nuclear",
                  "explanation": "Na medicina nuclear a conferência central envolve identificação, registro e contaminação. Retome onde existe uma referência de posição."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i3:b",
                  "label": "Radiologia intervencionista",
                  "explanation": "Na sala intervencionista a imagem guia o procedimento ao vivo; não há referência de simulação. Confira de novo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i3:c",
                  "label": "Radiografia no leito",
                  "explanation": "Na radiografia não há feixe de tratamento a liberar. Retome qual modalidade entrega dose terapêutica por feixe."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i3:d",
                  "label": "Radioterapia externa",
                  "explanation": "Isso. Comparar a imagem do dia com a referência da simulação é a conferência que antecede a entrega do tratamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-06:i3:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Separe duas coisas: o que a tarefa exige de quem a executa e o que cabe a você na simulação.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Manipular e administrar radiofármaco não cabe ao estudante, e quem administra confere antes identidade, material e atividade. Recusar e chamar apoio protege o paciente.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "No rodízio de medicina nuclear, uma técnica atarefada estende a você uma seringa dentro do protetor blindado e diz: 'Aplica no Seu Jorge para mim, ele já foi identificado, depois eu confiro'. Seu Jorge está sentado ao lado, com o acesso na veia.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-06:i4:a",
                  "label": "Aplica devagar, já que a identificação foi conferida",
                  "explanation": "Administrar não cabe ao estudante, e a conferência é de quem aplica, antes de aplicar. Retome os limites do seu papel."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i4:b",
                  "label": "Segura a seringa blindada até a técnica voltar",
                  "explanation": "Segurar a seringa já é manipular material radioativo. Confira de novo o que o estudante não faz neste setor."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i4:c",
                  "label": "Não pega a seringa, diz que não pode e chama a supervisora",
                  "explanation": "Isso. Manipular e administrar radiofármaco não cabe ao estudante, e quem administra confere antes identidade, material e atividade. Recusar e chamar apoio protege o paciente."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i4:d",
                  "label": "Pede a Seu Jorge que confirme a dose prescrita",
                  "explanation": "O paciente não é quem confere a prescrição. Essa verificação é do profissional habilitado, antes da administração."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-06:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m13:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m13:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num equipamento híbrido de PET com TC, a paciente recebe um radiofármaco e depois é examinada num aparelho que também tem tubo de raios X. Aplicando a primeira pergunta da aula, onde estão as fontes?"
            },
            "help": "Faça a pergunta da fonte duas vezes, uma para cada parte do equipamento.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O equipamento híbrido junta dois dispositivos: um detecta o que o paciente emite, o outro emite pelo tubo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num equipamento híbrido de PET com TC, a paciente recebe um radiofármaco e depois é examinada num aparelho que também tem tubo de raios X. Aplicando a primeira pergunta da aula, onde estão as fontes?",
              "options": [
                {
                  "id": "option:rtg-2026:m13:aula-06:i5:a",
                  "label": "No paciente e também no tubo da TC",
                  "explanation": "Isso. O equipamento híbrido junta dois dispositivos: um detecta o que o paciente emite, o outro emite pelo tubo."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i5:b",
                  "label": "Só no tubo: o radiofármaco não emite",
                  "explanation": "O radiofármaco é justamente o que emite na parte de PET. Retome a origem do sinal na medicina nuclear."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i5:c",
                  "label": "Só no paciente: a TC não usa radiação",
                  "explanation": "A TC forma imagem com raios X emitidos pelo tubo. Confira de novo a cadeia da TC."
                },
                {
                  "id": "option:rtg-2026:m13:aula-06:i5:d",
                  "label": "Em nenhum lugar: o híbrido só detecta",
                  "explanation": "Há duas fontes nesse exame. Retome a primeira pergunta para cada parte do equipamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:m13:aula-06:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m13:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Três perguntas, um percurso seguro",
            "body": "Agora você consegue chegar a qualquer uma das três modalidades e responder: onde está a fonte, o que se confere antes e quem chamar. E sabe dizer o que não cabe ao estudante em cada uma.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "pixel",
                  "text": "Você fechou o panorama das três modalidades. Leve as três perguntas para cada setor novo que conhecer."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m13",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-01"
        ],
        "prompt": "Duda compara duas salas: na TC há um tubo girando; na medicina nuclear, nenhum tubo. Onde está a fonte de radiação durante a aquisição em medicina nuclear?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-01:c1:a",
            "label": "No paciente, que recebeu o radiofármaco"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c1:b",
            "label": "Dentro da câmara gama, atrás do detector"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c1:c",
            "label": "Num tubo de raios X embutido na mesa"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c1:d",
            "label": "Nas paredes blindadas da sala de exame"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-01:c1:a",
        "feedback": {
          "correct": "Isso. O material administrado emite de dentro do corpo, e o aparelho apenas detecta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:nibib-medicina-nuclear",
          "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-01"
        ],
        "prompt": "Um paciente já identificado acaba de receber o radiofármaco. Pela sequência ensinada na aula, qual é a etapa seguinte?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-01:c2:a",
            "label": "Receber as orientações de saída e ir embora"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c2:b",
            "label": "Repetir a identificação e a administração"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c2:c",
            "label": "Aguardar o material se acumular na região"
          },
          {
            "id": "option:rtg-2026:m13:aula-01:c2:d",
            "label": "Passar pela câmara gama sem nenhuma espera"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-01:c2:c",
        "feedback": {
          "correct": "Isso. Depois da administração vem a espera; só então a câmara adquire as imagens.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-02"
        ],
        "prompt": "Caio terminou o turno sem nenhum incidente. Pela norma do setor, ele ainda precisa monitorar mãos, jaleco e bancada?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-02:c1:a",
            "label": "Não: a monitoração só vale quando há suspeita"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c1:b",
            "label": "Sim: é diária e registrada, mesmo sem incidente"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c1:c",
            "label": "Não: o dosímetro mensal já cobre a contaminação"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c1:d",
            "label": "Sim, mas sem registro se o resultado for normal"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-02:c1:b",
        "feedback": {
          "correct": "Isso. A monitoração de corpo, roupas e superfícies é feita todo dia e também a cada suspeita, sempre com registro.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-02"
        ],
        "prompt": "Ao passar perto da bancada, uma estagiária sente algo respingar na manga do jaleco. Ninguém viu. Qual é a conduta coerente com a aula?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-02:c2:a",
            "label": "Lavar a manga na pia mais próxima e seguir o estágio"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c2:b",
            "label": "Esperar o fim do turno para ver se o monitor acusa"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c2:c",
            "label": "Trocar de jaleco e não comentar, pois foi pouco"
          },
          {
            "id": "option:rtg-2026:m13:aula-02:c2:d",
            "label": "Parar e avisar o supervisor de proteção radiológica"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-02:c2:d",
        "feedback": {
          "correct": "Isso. É uma suspeita de contaminação: quem verifica e orienta é o supervisor, com o monitor adequado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-03"
        ],
        "prompt": "Duda vê o aparelho de radioterapia ficar ligado por poucos minutos, e nenhuma imagem do tumor é produzida nesse tempo. O que explica isso?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-03:c1:a",
            "label": "O detector do aparelho estava com defeito no dia"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c1:b",
            "label": "A imagem só fica pronta depois da última aplicação"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c1:c",
            "label": "O tumor absorve toda a radiação e apaga a imagem"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c1:d",
            "label": "Ali a radiação é o tratamento, não um meio de ver"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-03:c1:d",
        "feedback": {
          "correct": "Isso. O feixe da aplicação existe para agir sobre as células do tumor, não para formar imagem.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:inca-radioterapia"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-03"
        ],
        "prompt": "Na simulação, surge uma dúvida sobre o cálculo da dose de um plano. Pela divisão de papéis ensinada na aula, de quem é esse cálculo?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-03:c2:a",
            "label": "Da física médica"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c2:b",
            "label": "Da enfermagem"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c2:c",
            "label": "De quem posiciona"
          },
          {
            "id": "option:rtg-2026:m13:aula-03:c2:d",
            "label": "Do radio-oncologista"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-03:c2:a",
        "feedback": {
          "correct": "Isso. A física médica calcula a dose para que seja igual à prescrita e controla a qualidade dos aparelhos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:inca-radioterapia",
          "source:rtg-2026:m13:radiologyinfo-teleterapia"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-04"
        ],
        "prompt": "Duda vê na agenda uma tomografia marcada como 'simulação' na radioterapia. Para que a equipe usa essas imagens?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-04:c1:a",
            "label": "Para emitir o laudo diagnóstico do tumor"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c1:b",
            "label": "Para entregar a primeira dose do tratamento"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c1:c",
            "label": "Como referência da posição e do planejamento"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c1:d",
            "label": "Para medir a contaminação da pele do paciente"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-04:c1:c",
        "feedback": {
          "correct": "Isso. A tomografia de simulação registra o paciente na posição de tratamento e serve de base ao planejamento.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-teleterapia",
          "source:rtg-2026:m13:radiologyinfo-igrt"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-04"
        ],
        "prompt": "No dia da aplicação, em que momento o feixe de tratamento pode ser ligado?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-04:c2:a",
            "label": "Assim que o paciente deita na mesa de tratamento"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c2:b",
            "label": "Depois que a imagem do dia confere com a referência"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c2:c",
            "label": "Antes do reposicionamento, para ganhar tempo"
          },
          {
            "id": "option:rtg-2026:m13:aula-04:c2:d",
            "label": "Enquanto a equipe ainda ajusta os imobilizadores"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-04:c2:b",
        "feedback": {
          "correct": "Isso. Primeiro se confere a posição; a entrega vem por último, com o operador fora da sala.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-teleterapia",
          "source:rtg-2026:m13:radiologyinfo-igrt"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-05"
        ],
        "prompt": "Durante a fluoroscopia, o feixe aponta para o paciente. De onde vem a maior parte da radiação que atinge a equipe?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-05:c1:a",
            "label": "Do espalhamento que sai do paciente"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c1:b",
            "label": "Do monitor que exibe as imagens"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c1:c",
            "label": "Do contraste injetado pelo cateter"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c1:d",
            "label": "Do detector, que devolve o feixe"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-05:c1:a",
        "feedback": {
          "correct": "Isso. A radiação espalhada pelo paciente e pela mesa é a principal fonte de exposição da equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:kjp-seguranca-radiacao"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-05"
        ],
        "prompt": "Qual conjunto reúne apenas barreiras de proteção radiológica da equipe citadas na aula?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-05:c2:a",
            "label": "Touca, máscara cirúrgica, propé e luva de látex"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c2:b",
            "label": "Cateter, contraste, monitor e mesa de exame"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c2:c",
            "label": "Avental, protetor de tireoide, óculos e anteparo"
          },
          {
            "id": "option:rtg-2026:m13:aula-05:c2:d",
            "label": "Dosímetro, crachá, prontuário e ficha de sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-05:c2:c",
        "feedback": {
          "correct": "Isso. São barreiras entre o espalhamento e o corpo, somadas à distância.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:kjp-seguranca-radiacao",
          "source:rtg-2026:m13:anvisa-rdc-611-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-06"
        ],
        "prompt": "Você entra numa sala em que a equipe, de avental plumbífero, fica ao lado da mesa enquanto o médico conduz um cateter olhando o monitor. Onde está a fonte de radiação?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-06:c1:a",
            "label": "No cateter, que leva material radioativo"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c1:b",
            "label": "No paciente, que recebeu um radiofármaco"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c1:c",
            "label": "No monitor, que emite ao exibir o vídeo"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c1:d",
            "label": "No tubo de raios X, com espalhamento na sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-06:c1:d",
        "feedback": {
          "correct": "Isso. É a sala intervencionista: o tubo emite, o paciente espalha e a equipe se protege com barreiras.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:radiologyinfo-angiografia",
          "source:rtg-2026:m13:kjp-seguranca-radiacao"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m13:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m13:aula-06"
        ],
        "prompt": "Em qual destas situações a suspeita é de contaminação, e o apoio a chamar é o supervisor de proteção radiológica?",
        "options": [
          {
            "id": "option:rtg-2026:m13:aula-06:c2:a",
            "label": "Máscara de radioterapia folgada no rosto da paciente"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c2:b",
            "label": "Líquido no chão perto da bancada de radiofármacos"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c2:c",
            "label": "Paciente ansioso antes da tomografia de simulação"
          },
          {
            "id": "option:rtg-2026:m13:aula-06:c2:d",
            "label": "Monitor da sala intervencionista sem imagem"
          }
        ],
        "correctOptionId": "option:rtg-2026:m13:aula-06:c2:b",
        "feedback": {
          "correct": "Isso. Material possivelmente radioativo fora do lugar: não tocar, avisar quem se aproxima e chamar o supervisor.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m13:cnen-norma-3-05",
          "source:rtg-2026:m13:cdc-contaminacao-exposicao"
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
      "claimId": "interaction:rtg-2026:m13:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i3:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:inca-radioterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "item:rtg-2026:m13:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:nci-radioterapia-externa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nci-radioterapia-externa",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao",
        "source:rtg-2026:m13:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m13:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i3:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m13:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:m13:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cdc-contaminacao-exposicao",
        "source:rtg-2026:m13:nibib-medicina-nuclear",
        "source:rtg-2026:m13:inca-radioterapia",
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:planalto-lei-7394",
        "source:rtg-2026:m13:radiologyinfo-igrt",
        "source:rtg-2026:m13:radiologyinfo-teleterapia",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:radiologyinfo-angiografia",
        "source:rtg-2026:m13:kjp-seguranca-radiacao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m13:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05",
        "source:rtg-2026:m13:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:anvisa-rdc-611-2022",
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:m13:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m13:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m13:cnen-norma-3-05"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m13:aula-01",
        "hook": "Complete a frase: na medicina nuclear o aparelho não emite; quem emite é…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-01"
          ],
          "prompt": "Durante a aquisição das imagens, o que a câmara gama faz?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-01:rg:a",
              "label": "Emite raios gama em direção ao paciente"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rg:b",
              "label": "Aquece o radiofármaco para ele emitir"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rg:c",
              "label": "Administra o material durante a imagem"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rg:d",
              "label": "Detecta a radiação que sai do paciente"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-01:rg:d",
          "feedback": {
            "correct": "Isso. Ela registra a energia emitida pelo radiofármaco e a transforma em imagem.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:radiologyinfo-medicina-nuclear"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-01"
          ],
          "prompt": "Num exame de PET, o paciente também recebe um material radioativo antes de ir ao aparelho. O que esse exame tem em comum com o exame de câmara gama desta aula?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-01:rt:a",
              "label": "O aparelho também emite por um tubo de raios X"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rt:b",
              "label": "O sinal também nasce dentro do paciente"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rt:c",
              "label": "A imagem também é feita antes da administração"
            },
            {
              "id": "option:rtg-2026:m13:aula-01:rt:d",
              "label": "O detector também funciona como fonte de radiação"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-01:rt:b",
          "feedback": {
            "correct": "Isso. No PET, como na câmara gama, o material administrado emite e os detectores registram.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:nibib-medicina-nuclear"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m13:aula-02",
        "hook": "Complete a frase: contaminação não é a energia que chega; é o material radioativo que…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-02"
          ],
          "prompt": "Qual destas situações é contaminação, e não apenas exposição?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-02:rg:a",
              "label": "Uma gota de radiofármaco sobre a luva"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rg:b",
              "label": "Um minuto ao lado de um paciente injetado"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rg:c",
              "label": "Uma radiografia de tórax feita no leito"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rg:d",
              "label": "Uma passagem em frente à sala de exame"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-02:rg:a",
          "feedback": {
            "correct": "Isso. Há material radioativo sobre uma superfície onde ele não deveria estar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:cdc-contaminacao-exposicao"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-02"
          ],
          "prompt": "Uma embalagem com fontes radioativas chega ao serviço. No recebimento, a norma manda inspecionar a integridade e monitorar a superfície externa, com registro. O que essa monitoração procura?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-02:rt:a",
              "label": "A dose que cada paciente vai receber no dia"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rt:b",
              "label": "A validade do dosímetro de quem fez a entrega"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rt:c",
              "label": "Contaminação do lado de fora da embalagem"
            },
            {
              "id": "option:rtg-2026:m13:aula-02:rt:d",
              "label": "O nome do médico que prescreveu os exames"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-02:rt:c",
          "feedback": {
            "correct": "Isso. Material na superfície externa passaria para as mãos e bancadas de quem recebe. O resultado fica registrado.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:cnen-norma-3-05"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m13:aula-03",
        "hook": "Complete a frase: no exame de imagem a radiação serve para ver; na radioterapia ela serve para…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-03"
          ],
          "prompt": "Qual é o objetivo da radiação numa aplicação de radioterapia?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-03:rg:a",
              "label": "Formar uma imagem nítida do tumor para o laudo médico"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rg:b",
              "label": "Destruir células do tumor ou impedir que se multipliquem"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rg:c",
              "label": "Medir quanto radiofármaco se acumulou dentro do tumor"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rg:d",
              "label": "Aquecer a pele para preparar a região para a cirurgia"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-03:rg:b",
          "feedback": {
            "correct": "Isso. Esse efeito sobre as células é o que permite curar, controlar a doença ou aliviar sintomas.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:inca-radioterapia"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-03"
          ],
          "prompt": "Dona Marta recebeu um cartão com aparelho, médico, dia e horário das aplicações. Depois de faltar a duas sessões, ela chega sem o cartão. Dentro do seu papel na simulação, o que cabe fazer?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-03:rt:a",
              "label": "Encaixá-la no primeiro aparelho que estiver livre"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rt:b",
              "label": "Dizer que duas faltas não mudam nada no tratamento"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rt:c",
              "label": "Avisar a equipe para conferir o agendamento dela"
            },
            {
              "id": "option:rtg-2026:m13:aula-03:rt:d",
              "label": "Sugerir duas aplicações no mesmo dia para compensar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-03:rt:c",
          "feedback": {
            "correct": "Isso. Faltas podem prejudicar o tratamento, e quem avalia e reorganiza é a equipe. Você descreve a situação e pede apoio.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:inca-radioterapia"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m13:aula-04",
        "hook": "Complete a frase: a imagem de localização não trata nem diagnostica; ela mostra se o paciente está…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-04"
          ],
          "prompt": "O que a imagem de localização compara?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-04:rg:a",
              "label": "A dose de hoje com a dose da aplicação de ontem"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rg:b",
              "label": "O tumor de hoje com o do laudo anterior"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rg:c",
              "label": "A posição do dia com a referência da simulação"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rg:d",
              "label": "O aparelho de hoje com o da semana passada"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-04:rg:c",
          "feedback": {
            "correct": "Isso. Se as duas coincidem, a entrega pode seguir; se não, a equipe ajusta e confere de novo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:radiologyinfo-igrt"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-04"
          ],
          "prompt": "Num tratamento de cabeça, o paciente usa uma máscara presa à mesa. Num dos dias, a máscara parece folgada. O que essa observação põe em dúvida?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-04:rt:a",
              "label": "Se a posição do dia repete a da simulação"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rt:b",
              "label": "Se o paciente ainda precisa do tratamento"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rt:c",
              "label": "Se a dose prescrita deveria ser reduzida"
            },
            {
              "id": "option:rtg-2026:m13:aula-04:rt:d",
              "label": "Se a tomografia de simulação usou contraste"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-04:rt:a",
          "feedback": {
            "correct": "Isso. A máscara existe para repetir a posição. Folga é motivo para avisar a equipe antes da conferência por imagem.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:nci-radioterapia-externa",
            "source:rtg-2026:m13:radiologyinfo-teleterapia"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m13:aula-05",
        "hook": "Complete a frase: na sala intervencionista o feixe vai para o paciente, mas a equipe recebe a radiação…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-05"
          ],
          "prompt": "Por que a equipe usa avental plumbífero se o feixe não aponta para ela?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-05:rg:a",
              "label": "Porque o avental mantém o campo de trabalho limpo"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rg:b",
              "label": "Porque o detector emite radiação para trás"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rg:c",
              "label": "Porque o contraste deixa a equipe radioativa"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rg:d",
              "label": "Porque o paciente espalha radiação pela sala"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-05:rg:d",
          "feedback": {
            "correct": "Isso. O avental fica entre a radiação espalhada e o corpo de quem trabalha ao lado da mesa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:kjp-seguranca-radiacao",
            "source:rtg-2026:m13:anvisa-rdc-611-2022"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-05"
          ],
          "prompt": "Num procedimento longo, uma colega dá dois passos para longe da mesa sempre que não precisa atuar. Que recurso de proteção da aula ela está usando?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-05:rt:a",
              "label": "O anteparo suspenso no teto"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rt:b",
              "label": "A distância até o paciente"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rt:c",
              "label": "O protetor de tireoide"
            },
            {
              "id": "option:rtg-2026:m13:aula-05:rt:d",
              "label": "O dosímetro individual"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-05:rt:b",
          "feedback": {
            "correct": "Isso. A radiação diminui rapidamente com a distância de onde sai o espalhamento. É uma proteção que não depende de equipamento.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:kjp-seguranca-radiacao"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m13:aula-06",
        "hook": "Complete a frase: num setor novo, eu pergunto onde está a fonte, o que se confere e…",
        "guided": {
          "id": "recovery-item:rtg-2026:m13:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-06"
          ],
          "prompt": "Na simulação, pedem a você uma tarefa num setor que você ainda não conhece, e você não sabe se ela cabe ao estudante. Qual é o primeiro passo?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-06:rg:a",
              "label": "Parar e perguntar ao responsável pelo setor"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rg:b",
              "label": "Fazer devagar, observando a reação da equipe"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rg:c",
              "label": "Procurar um vídeo e seguir o passo a passo"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rg:d",
              "label": "Pedir ao paciente que conte como costuma ser"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-06:rg:a",
          "feedback": {
            "correct": "Isso. Perguntar antes de agir é a terceira pergunta da aula posta em prática.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:anvisa-rdc-611-2022",
            "source:rtg-2026:m13:cnen-norma-3-05"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m13:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m13:aula-06"
          ],
          "prompt": "No centro cirúrgico, um médico usa uma sonda portátil sensível à radiação para localizar uma estrutura num paciente que recebeu radiofármaco. Pela lógica da fonte, qual serviço responde pela proteção radiológica desse procedimento?",
          "options": [
            {
              "id": "option:rtg-2026:m13:aula-06:rt:a",
              "label": "O serviço de radioterapia"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rt:b",
              "label": "A radiologia intervencionista"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rt:c",
              "label": "O serviço de medicina nuclear"
            },
            {
              "id": "option:rtg-2026:m13:aula-06:rt:d",
              "label": "O setor de radiografia geral"
            }
          ],
          "correctOptionId": "option:rtg-2026:m13:aula-06:rt:c",
          "feedback": {
            "correct": "Isso. A fonte é o radiofármaco no paciente, e a norma mantém esse procedimento sob responsabilidade do serviço de medicina nuclear, mesmo fora das instalações dele.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m13:cnen-norma-3-05"
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
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "cb4ab1ae58b2c1c980d0b73d6ff0830e3205502f7a5f519a084e2795c820e2de"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
