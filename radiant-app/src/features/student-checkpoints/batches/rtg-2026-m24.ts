// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M24: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m24",
  "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084",
  "trackId": "track:rtg-2026:m24",
  "unitId": "unit:rtg-2026:m24",
  "contentVersion": "rtg-2026-m24-v1",
  "competencyIds": [
    "competency:rtg-2026:m24:aula-01",
    "competency:rtg-2026:m24:aula-02",
    "competency:rtg-2026:m24:aula-03",
    "competency:rtg-2026:m24:aula-04",
    "competency:rtg-2026:m24:aula-05",
    "competency:rtg-2026:m24:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
      "title": "Anatomy and Physiology 2e, 8.4 Bones of the Lower Limb",
      "publisher": "OpenStax (Rice University)",
      "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/8-4-bones-of-the-lower-limb",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro didático aberto (CC BY-NC-SA 4.0); consultado para fatos anatômicos, redação própria, sem reprodução de texto ou figuras."
    },
    {
      "id": "source:rtg-2026:m24:openstax-ap2e-pelve",
      "title": "Anatomy and Physiology 2e, 8.3 The Pelvic Girdle and Pelvis",
      "publisher": "OpenStax (Rice University)",
      "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/8-3-the-pelvic-girdle-and-pelvis",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro didático aberto (CC BY-NC-SA 4.0); consultado para fatos anatômicos, redação própria, sem reprodução de texto ou figuras."
    },
    {
      "id": "source:rtg-2026:m24:openstax-ap2e-coluna",
      "title": "Anatomy and Physiology 2e, 7.3 The Vertebral Column",
      "publisher": "OpenStax (Rice University)",
      "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/7-3-the-vertebral-column",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro didático aberto (CC BY-NC-SA 4.0); consultado para fatos anatômicos, redação própria, sem reprodução de texto ou figuras."
    },
    {
      "id": "source:rtg-2026:m24:openstax-ap2e-articulacoes",
      "title": "Anatomy and Physiology 2e, 9.6 Anatomy of Selected Synovial Joints",
      "publisher": "OpenStax (Rice University)",
      "url": "https://openstax.org/books/anatomy-and-physiology-2e/pages/9-6-anatomy-of-selected-synovial-joints",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro didático aberto (CC BY-NC-SA 4.0); consultado para fatos anatômicos, redação própria, sem reprodução de texto ou figuras."
    },
    {
      "id": "source:rtg-2026:m24:medlineplus-fratura",
      "title": "Broken bone (first aid)",
      "publisher": "MedlinePlus (National Library of Medicine)",
      "url": "https://medlineplus.gov/ency/article/000001.htm",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional de primeiros socorros; consultada para fatos, redação própria, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m24:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
          "source:rtg-2026:m24:openstax-ap2e-articulacoes"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Pé e tornozelo",
            "body": "Hoje você vai conseguir nomear os três grupos de ossos do pé e os ossos que formam o tornozelo.",
            "dialogue": {
              "setting": "Laboratório didático",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Peguei um pé de modelo para estudar e fiquei perdida: são tantos ossinhos que parece um quebra-cabeça."
                },
                {
                  "speaker": "caio",
                  "text": "Quebra-cabeça com três pedaços grandes: atrás, no meio e nas pontas. Cada pedaço tem nome e um número de ossos."
                },
                {
                  "speaker": "pixel",
                  "text": "Quantos ossos você acha que cabem num pé só? E qual deles encaixa no tornozelo?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Três grupos de ossos no pé",
            "body": "O pé tem 26 ossos em três grupos. Atrás ficam sete tarsais: calcâneo, o osso do calcanhar e o maior do pé; tálus; navicular, à frente do tálus; cuboide, à frente do calcâneo; e três cuneiformes. No meio, cinco metatarsais, numerados de 1 a 5 a partir do lado medial. Nas pontas, catorze falanges: duas no hálux e três em cada um dos outros dedos. O tornozelo reúne o tálus e as extremidades distais da tíbia e da fíbula; os maléolos seguram o tálus pelos lados.",
            "keyPoints": [
              "Sete tarsais, cinco metatarsais e catorze falanges: 26 ossos.",
              "O tálus se encaixa entre a tíbia e a fíbula, no tornozelo."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M18. Os ossos do pé, como os dos outros membros, entram em qual grupo do esqueleto?"
            },
            "help": "Pense se o pé é eixo do corpo ou parte de um membro.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o pé é parte do membro inferior, então seus ossos são do esqueleto apendicular.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M18. Os ossos do pé, como os dos outros membros, entram em qual grupo do esqueleto?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-01:i1:a",
                  "label": "No axial, junto com a coluna",
                  "explanation": "O axial é o eixo do corpo: crânio, coluna e caixa torácica. O pé fica na ponta do membro, não nesse eixo."
                },
                {
                  "id": "option:rtg-2026:m24:aula-01:i1:b",
                  "label": "No apendicular, o grupo dos membros",
                  "explanation": "Isso: o pé é parte do membro inferior, então seus ossos são do esqueleto apendicular."
                },
                {
                  "id": "option:rtg-2026:m24:aula-01:i1:c",
                  "label": "No axial, porque sustentam o corpo em pé",
                  "explanation": "Sustentar peso não define o grupo. O critério é ser eixo (axial) ou membro e cintura (apendicular)."
                },
                {
                  "id": "option:rtg-2026:m24:aula-01:i1:d",
                  "label": "Em nenhum: ossos do pé formam um grupo à parte",
                  "explanation": "Todo osso do esqueleto cabe no axial ou no apendicular, inclusive os do pé."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule cinco partes do pé direito visto de cima, tocando na ficha e no ponto. O calcanhar fica à esquerda e os dedos à direita."
            },
            "help": "Comece pelo grande osso do calcanhar, no lado esquerdo da figura.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: atrás ficam os tarsais, no meio os metatarsais e nas pontas as falanges.",
              "incorrect": "Alguma ficha está fora do lugar: releia a posição de cada grupo do pé, de trás para a frente."
            },
            "payload": {
              "prompt": "Rotule cinco partes do pé direito visto de cima, tocando na ficha e no ponto. O calcanhar fica à esquerda e os dedos à direita.",
              "imageRef": "diagram:ossos-do-pe",
              "points": [
                {
                  "id": "point:rtg-2026:m24:aula-01:i2:1",
                  "x": 0.085,
                  "y": 0.537,
                  "where": "no extremo esquerdo, o maior osso branco",
                  "correctLabelId": "label:rtg-2026:m24:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m24:aula-01:i2:2",
                  "x": 0.244,
                  "y": 0.423,
                  "where": "acima e à frente do maior osso, peça arredondada",
                  "correctLabelId": "label:rtg-2026:m24:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m24:aula-01:i2:3",
                  "x": 0.404,
                  "y": 0.607,
                  "where": "embaixo no meio, peça quase quadrada em branco",
                  "correctLabelId": "label:rtg-2026:m24:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m24:aula-01:i2:4",
                  "x": 0.61,
                  "y": 0.467,
                  "where": "as cinco hastes azuis compridas, no meio do pé",
                  "correctLabelId": "label:rtg-2026:m24:aula-01:i2:4"
                },
                {
                  "id": "point:rtg-2026:m24:aula-01:i2:5",
                  "x": 0.788,
                  "y": 0.555,
                  "where": "as peças amarelas em fila, na ponta do quarto dedo",
                  "correctLabelId": "label:rtg-2026:m24:aula-01:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:1",
                  "label": "Calcâneo"
                },
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:5",
                  "label": "Falanges"
                },
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:3",
                  "label": "Cuboide"
                },
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:4",
                  "label": "Metatarsais"
                },
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:6",
                  "label": "Patela"
                },
                {
                  "id": "label:rtg-2026:m24:aula-01:i2:2",
                  "label": "Tálus"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada osso no grupo do pé a que ele pertence."
            },
            "help": "Os metatarsais são numerados; as falanges são os ossos dos dedos.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou os ossos de trás, os do meio e os das pontas do pé.",
              "incorrect": "Pergunte de cada osso onde ele fica: atrás, no meio do pé ou nos dedos."
            },
            "payload": {
              "prompt": "Classifique cada osso no grupo do pé a que ele pertence.",
              "categories": [
                {
                  "id": "group:rtg-2026:m24:aula-01:i3:a",
                  "label": "Tarsais"
                },
                {
                  "id": "group:rtg-2026:m24:aula-01:i3:b",
                  "label": "Metatarsais"
                },
                {
                  "id": "group:rtg-2026:m24:aula-01:i3:c",
                  "label": "Falanges"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:4",
                  "label": "Cuboide, à frente do calcâneo",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:a"
                },
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:3",
                  "label": "Os dois ossos do hálux",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:c"
                },
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:6",
                  "label": "Osso do meio de um dos outros quatro dedos",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:c"
                },
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:5",
                  "label": "Osso comprido do meio do pé que leva ao hálux",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:2",
                  "label": "Haste do meio do pé, numerada de 1 a 5",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m24:aula-01:i3:1",
                  "label": "Tálus, que se encaixa no tornozelo",
                  "categoryId": "group:rtg-2026:m24:aula-01:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre o tornozelo com as palavras do banco."
            },
            "help": "Pense no osso do pé que fica entre os dois maléolos.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o tálus fica entre a tíbia e a fíbula, e os maléolos o seguram pelos lados.",
              "incorrect": "Releia o conceito: o osso do pé que forma o tornozelo não é o do calcanhar, e o outro osso da perna não é o do joelho."
            },
            "payload": {
              "prompt": "Complete a frase sobre o tornozelo com as palavras do banco.",
              "segments": [
                "O tornozelo reúne o ",
                ", que se encaixa entre as extremidades da tíbia e da ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m24:aula-01:i4:2",
                  "label": "fíbula"
                },
                {
                  "id": "token:rtg-2026:m24:aula-01:i4:3",
                  "label": "calcâneo"
                },
                {
                  "id": "token:rtg-2026:m24:aula-01:i4:5",
                  "label": "falange"
                },
                {
                  "id": "token:rtg-2026:m24:aula-01:i4:4",
                  "label": "patela"
                },
                {
                  "id": "token:rtg-2026:m24:aula-01:i4:1",
                  "label": "tálus"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m24:aula-01:i4:1",
                  "correctTokenId": "token:rtg-2026:m24:aula-01:i4:1"
                },
                {
                  "id": "blank:rtg-2026:m24:aula-01:i4:2",
                  "correctTokenId": "token:rtg-2026:m24:aula-01:i4:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Duda monta um pé de modelo e conta os ossos em voz alta. Julgue cada afirmação dela."
            },
            "help": "Some os três grupos e lembre quantos dedos têm duas ou três falanges.",
            "type": "true-false",
            "feedback": {
              "correct": "Você conferiu a contagem e a posição de cada osso.",
              "incorrect": "Releia o conceito: os números de cada grupo e a ordem dos tarsais estão lá."
            },
            "payload": {
              "prompt": "Duda monta um pé de modelo e conta os ossos em voz alta. Julgue cada afirmação dela.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m24:aula-01:i5:1",
                  "text": "O pé tem 7 tarsais, 5 metatarsais e 14 falanges.",
                  "isTrue": true,
                  "explanation": "Certo: sete mais cinco mais catorze dá 26 ossos em cada pé."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-01:i5:2",
                  "text": "O hálux tem três falanges, como os outros dedos.",
                  "isTrue": false,
                  "explanation": "Errado: o hálux tem duas falanges, a proximal e a distal; os outros quatro dedos têm três."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-01:i5:3",
                  "text": "O navicular fica à frente do tálus.",
                  "isTrue": true,
                  "explanation": "Certo: o navicular vem logo à frente do tálus, no meio do tarso."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-01:i5:4",
                  "text": "O calcâneo é o menor osso do tarso.",
                  "isTrue": false,
                  "explanation": "Errado: o calcâneo, o osso do calcanhar, é o maior osso do pé."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você nomeia o pé e o tornozelo",
            "body": "Agora você sabe dizer que o pé tem tarsais, metatarsais e falanges, quantos ossos há em cada grupo e que o tálus forma o tornozelo com a tíbia e a fíbula.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Pé de modelo na mão, você já sabe onde cada pedaço fica."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m24:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
          "source:rtg-2026:m24:medlineplus-fratura"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Joelho",
            "body": "Hoje você vai conseguir nomear as partes do fêmur, da tíbia, da fíbula e da patela que formam o joelho.",
            "dialogue": {
              "setting": "Sala de exames",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Jorge",
                  "text": "Bati o joelho na quina da mesa. Dói embaixo da bolinha da frente."
                },
                {
                  "speaker": "caio",
                  "text": "A bolinha tem nome, e as pontas dos ossos em volta também. Vale conhecer cada uma."
                },
                {
                  "speaker": "pixel",
                  "text": "Que ossos se encontram no joelho, e que parte de cada um você já saberia apontar?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Quem se encontra no joelho",
            "body": "O fêmur termina em dois côndilos, medial e lateral, com um sulco na frente onde a patela desliza. Embaixo, os côndilos da tíbia formam uma superfície plana, com a eminência intercondilar entre eles; logo abaixo, na frente, a tuberosidade da tíbia recebe o tendão da patela. A cabeça da fíbula se apoia sob o côndilo lateral da tíbia. A patela fica no tendão do quadríceps. Com dor forte ou deformidade, não mova o joelho: descreva e peça apoio.",
            "keyPoints": [
              "Fêmur: côndilos e sulco da patela. Tíbia: côndilos, eminência e tuberosidade.",
              "A cabeça da fíbula se apoia na tíbia; a patela fica no tendão do quadríceps."
            ],
            "visual": "joelho-frente-e-perfil"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. No tornozelo, a tíbia e a fíbula seguram qual osso do pé entre os maléolos?"
            },
            "help": "Pense no osso do tarso que fica mais acima, sobre o calcâneo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o tálus se encaixa entre as pontas da tíbia e da fíbula, no tornozelo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. No tornozelo, a tíbia e a fíbula seguram qual osso do pé entre os maléolos?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-02:i1:a",
                  "label": "O calcâneo",
                  "explanation": "O calcâneo fica abaixo, no calcanhar, e não se encaixa entre os maléolos."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i1:b",
                  "label": "O navicular",
                  "explanation": "O navicular fica à frente do tálus, no meio do tarso."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i1:c",
                  "label": "O tálus",
                  "explanation": "Isso: o tálus se encaixa entre as pontas da tíbia e da fíbula, no tornozelo."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i1:d",
                  "label": "O cuboide",
                  "explanation": "O cuboide fica à frente do calcâneo, na lateral do pé."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-02:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule quatro partes do joelho direito, tocando na ficha e no ponto. A vista da esquerda é de frente e a da direita, de perfil."
            },
            "help": "Lembre qual osso fica na frente, no tendão do quadríceps.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: você achou as pontas do fêmur e da tíbia, a cabeça da fíbula e a patela.",
              "incorrect": "Alguma ficha está fora do lugar: separe o que é ponta do fêmur, ponta da tíbia, osso fino e osso da frente."
            },
            "payload": {
              "prompt": "Rotule quatro partes do joelho direito, tocando na ficha e no ponto. A vista da esquerda é de frente e a da direita, de perfil.",
              "imageRef": "diagram:joelho-frente-e-perfil",
              "points": [
                {
                  "id": "point:rtg-2026:m24:aula-02:i2:1",
                  "x": 0.137,
                  "y": 0.317,
                  "where": "de frente, a saliência redonda à esquerda, embaixo do fêmur",
                  "correctLabelId": "label:rtg-2026:m24:aula-02:i2:1"
                },
                {
                  "id": "point:rtg-2026:m24:aula-02:i2:2",
                  "x": 0.298,
                  "y": 0.539,
                  "where": "de frente, a superfície larga e plana no alto da tíbia",
                  "correctLabelId": "label:rtg-2026:m24:aula-02:i2:2"
                },
                {
                  "id": "point:rtg-2026:m24:aula-02:i2:3",
                  "x": 0.085,
                  "y": 0.57,
                  "where": "de frente, a ponta de cima do osso fino, à esquerda da tíbia",
                  "correctLabelId": "label:rtg-2026:m24:aula-02:i2:3"
                },
                {
                  "id": "point:rtg-2026:m24:aula-02:i2:4",
                  "x": 0.904,
                  "y": 0.198,
                  "where": "de perfil, a peça azul, estreita, na frente do fêmur",
                  "correctLabelId": "label:rtg-2026:m24:aula-02:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m24:aula-02:i2:3",
                  "label": "Cabeça da fíbula"
                },
                {
                  "id": "label:rtg-2026:m24:aula-02:i2:4",
                  "label": "Patela"
                },
                {
                  "id": "label:rtg-2026:m24:aula-02:i2:1",
                  "label": "Côndilo lateral do fêmur"
                },
                {
                  "id": "label:rtg-2026:m24:aula-02:i2:5",
                  "label": "Maléolo lateral"
                },
                {
                  "id": "label:rtg-2026:m24:aula-02:i2:2",
                  "label": "Côndilos da tíbia"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada parte do joelho à sua descrição."
            },
            "help": "Duas partes são da tíbia, uma do fêmur e uma da fíbula.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada parte ao osso e ao lugar certos.",
              "incorrect": "Confira de que osso é cada parte e o que se prende ou desliza nela."
            },
            "payload": {
              "prompt": "Ligue cada parte do joelho à sua descrição.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m24:aula-02:i3:1",
                  "left": "Eminência intercondilar",
                  "right": "Elevação entre os côndilos da tíbia, onde se prendem dois ligamentos"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-02:i3:2",
                  "left": "Tuberosidade da tíbia",
                  "right": "Saliência da frente da tíbia, onde se prende o tendão da patela"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-02:i3:3",
                  "left": "Sulco patelar",
                  "right": "Sulco da frente do fêmur, entre os côndilos, em que a patela desliza"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-02:i3:4",
                  "left": "Cabeça da fíbula",
                  "right": "Ponta de cima da fíbula, apoiada no côndilo lateral da tíbia"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Dor forte com deformidade pede que você pare antes de tudo.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: com dor forte e deformidade, você não move o membro, descreve o que vê e pede apoio à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge, paciente simulado, caiu da escada. O joelho direito está inchado e deformado, e a dor é forte. O pedido é de joelho. Duda sugere dobrá-lo só um pouco, para a patela aparecer melhor.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-02:i4:a",
                  "label": "Não mover a perna, descrever o que vê e pedir apoio",
                  "explanation": "Isso: com dor forte e deformidade, você não move o membro, descreve o que vê e pede apoio à equipe."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i4:b",
                  "label": "Dobrar o joelho devagar e parar só se a dor aumentar",
                  "explanation": "Dobrar o joelho pode piorar uma lesão. Diante da suspeita de fratura, o movimento não é decisão sua."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i4:c",
                  "label": "Pedir que ele mesmo estique e dobre a perna para testar",
                  "explanation": "Testar o movimento é o que não se faz com suspeita de fratura. Você para e chama a equipe."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i4:d",
                  "label": "Segurar o joelho com firmeza enquanto Duda ajusta a posição",
                  "explanation": "Segurar e reposicionar é mover o membro. Mesmo com cuidado, quem decide isso é a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-02:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Na bancada, Duda separa as peças de um joelho de modelo. Marque todas as estruturas que pertencem à tíbia."
            },
            "help": "Procure o que fica no alto da tíbia, entre os côndilos e na frente.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou as três partes da tíbia e deixou de fora as dos outros ossos.",
              "incorrect": "Releia o conceito: côndilo lateral e sulco da patela são do fêmur, e a cabeça com osso fino é da fíbula."
            },
            "payload": {
              "prompt": "Na bancada, Duda separa as peças de um joelho de modelo. Marque todas as estruturas que pertencem à tíbia.",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:a",
                  "label": "Côndilo lateral, na ponta de baixo do fêmur",
                  "explanation": "O côndilo lateral é do fêmur; a tíbia tem os próprios côndilos, mais embaixo."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:b",
                  "label": "Côndilos, a superfície plana do alto",
                  "explanation": "Os côndilos da tíbia formam a superfície plana que recebe os côndilos do fêmur."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:c",
                  "label": "Cabeça, a ponta de cima do osso fino",
                  "explanation": "Essa cabeça é da fíbula, que se apoia na tíbia mas é outro osso."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:d",
                  "label": "Eminência intercondilar, entre os côndilos",
                  "explanation": "A eminência intercondilar sobe entre os côndilos da tíbia."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:e",
                  "label": "Sulco da frente, onde a patela desliza",
                  "explanation": "O sulco em que a patela desliza fica no fêmur, não na tíbia."
                },
                {
                  "id": "option:rtg-2026:m24:aula-02:i5:f",
                  "label": "Tuberosidade, onde se prende o tendão da patela",
                  "explanation": "A tuberosidade da tíbia é a saliência da frente onde o tendão da patela se prende."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m24:aula-02:i5:b",
                "option:rtg-2026:m24:aula-02:i5:d",
                "option:rtg-2026:m24:aula-02:i5:f"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você nomeia as partes do joelho",
            "body": "Agora você sabe apontar côndilos do fêmur e da tíbia, a eminência intercondilar, a cabeça da fíbula e a patela, e sabe que, com dor forte, o membro não se move: você descreve e pede apoio.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Boa. Nomear a parte certa é metade de entender o que o pedido pede."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m24:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
          "source:rtg-2026:m24:openstax-ap2e-pelve",
          "source:rtg-2026:m24:openstax-ap2e-articulacoes",
          "source:rtg-2026:m24:medlineplus-fratura"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Fêmur proximal e quadril",
            "body": "Hoje você vai conseguir nomear cabeça, colo, trocânteres e acetábulo.",
            "dialogue": {
              "setting": "Sala de exames",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "Meu neto disse que o quadril é uma bola dentro de um copo. É isso mesmo?"
                },
                {
                  "speaker": "caio",
                  "text": "Dá para pensar assim. Só que bola e copo têm nome, e o fêmur ainda tem duas saliências."
                },
                {
                  "speaker": "pixel",
                  "text": "Que parte é a bola, que parte é o copo, e onde ficam as duas saliências?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "A bola, o copo e as duas saliências",
            "body": "No quadril, a cabeça do fêmur, redonda, encaixa no acetábulo, o encaixe profundo do osso do quadril. Abaixo da cabeça fica o colo, a parte estreita. Na lateral, acima da base do colo, está o trocânter maior; na face medial, logo abaixo do colo, o trocânter menor. Depois vem a diáfise, o tubo do osso. Na ordem ensinada nesta aula, de cima para baixo na face medial: cabeça, colo, trocânter menor, diáfise. O quadril é uma articulação do tipo bola e soquete, com movimento em vários eixos. Com suspeita de fratura, não mova nem gire o membro: peça apoio.",
            "keyPoints": [
              "Cabeça no acetábulo; colo estreito logo abaixo dela.",
              "Trocânter maior na lateral; trocânter menor na face medial, abaixo do colo."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Em que osso fica a eminência intercondilar, entre os côndilos?"
            },
            "help": "Lembre qual osso tem a superfície plana que recebe o fêmur.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a eminência intercondilar sobe entre os côndilos da tíbia.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Em que osso fica a eminência intercondilar, entre os côndilos?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-03:i1:a",
                  "label": "No fêmur",
                  "explanation": "O fêmur tem a fossa intercondilar atrás, mas a eminência é da tíbia."
                },
                {
                  "id": "option:rtg-2026:m24:aula-03:i1:b",
                  "label": "Na patela",
                  "explanation": "A patela é o osso da frente, no tendão do quadríceps, e não tem côndilos."
                },
                {
                  "id": "option:rtg-2026:m24:aula-03:i1:c",
                  "label": "Na fíbula",
                  "explanation": "A fíbula tem a cabeça, que se apoia na tíbia, mas não a eminência."
                },
                {
                  "id": "option:rtg-2026:m24:aula-03:i1:d",
                  "label": "Na tíbia",
                  "explanation": "Isso: a eminência intercondilar sobe entre os côndilos da tíbia."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-03:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule seis partes do quadril direito visto de frente, tocando na ficha e no ponto. O lado de fora fica à esquerda."
            },
            "help": "Comece pelo que encaixa no arco azul, no alto.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: a cabeça no acetábulo, o colo estreito e as duas saliências no lugar.",
              "incorrect": "Alguma ficha está fora do lugar: siga o osso de cima para baixo e separe lado de fora e lado de dentro."
            },
            "payload": {
              "prompt": "Rotule seis partes do quadril direito visto de frente, tocando na ficha e no ponto. O lado de fora fica à esquerda.",
              "imageRef": "diagram:femur-proximal-e-quadril",
              "points": [
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:1",
                  "x": 0.632,
                  "y": 0.138,
                  "where": "no alto, o arco azul que cobre a parte redonda do fêmur",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:1"
                },
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:2",
                  "x": 0.672,
                  "y": 0.359,
                  "where": "a parte redonda de cima, encaixada sob o arco azul",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:2"
                },
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:3",
                  "x": 0.506,
                  "y": 0.446,
                  "where": "a parte estreita e inclinada, entre a parte redonda e o tubo",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:3"
                },
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:4",
                  "x": 0.325,
                  "y": 0.433,
                  "where": "a saliência larga à esquerda, do lado de fora do osso",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:4"
                },
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:5",
                  "x": 0.538,
                  "y": 0.675,
                  "where": "a saliência pequena à direita, abaixo do estreitamento",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:5"
                },
                {
                  "id": "point:rtg-2026:m24:aula-03:i2:6",
                  "x": 0.472,
                  "y": 0.888,
                  "where": "o tubo longo que desce, na parte de baixo da figura",
                  "correctLabelId": "label:rtg-2026:m24:aula-03:i2:6"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:1",
                  "label": "Acetábulo"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:4",
                  "label": "Trocânter maior"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:5",
                  "label": "Trocânter menor"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:6",
                  "label": "Diáfise do fêmur"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:7",
                  "label": "Eminência intercondilar"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:3",
                  "label": "Colo do fêmur"
                },
                {
                  "id": "label:rtg-2026:m24:aula-03:i2:2",
                  "label": "Cabeça do fêmur"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre o encaixe do quadril com as palavras do banco."
            },
            "help": "Qual parte do fêmur é redonda e qual estrutura do quadril é a cavidade?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: a cabeça do fêmur encaixa no acetábulo, formando a articulação do quadril.",
              "incorrect": "Releia o conceito: a parte redonda do fêmur é a que encaixa, e a cavidade é do osso do quadril, não do joelho."
            },
            "payload": {
              "prompt": "Complete a frase sobre o encaixe do quadril com as palavras do banco.",
              "segments": [
                "No quadril, a ",
                " do fêmur encaixa no ",
                ", uma cavidade profunda do osso do quadril."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m24:aula-03:i3:2",
                  "label": "acetábulo"
                },
                {
                  "id": "token:rtg-2026:m24:aula-03:i3:1",
                  "label": "cabeça"
                },
                {
                  "id": "token:rtg-2026:m24:aula-03:i3:4",
                  "label": "trocânter"
                },
                {
                  "id": "token:rtg-2026:m24:aula-03:i3:5",
                  "label": "côndilo"
                },
                {
                  "id": "token:rtg-2026:m24:aula-03:i3:3",
                  "label": "colo"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m24:aula-03:i3:1",
                  "correctTokenId": "token:rtg-2026:m24:aula-03:i3:1"
                },
                {
                  "id": "blank:rtg-2026:m24:aula-03:i3:2",
                  "correctTokenId": "token:rtg-2026:m24:aula-03:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene, na ordem ensinada nesta aula, de cima para baixo na face medial do fêmur."
            },
            "help": "Comece pelo que encaixa no acetábulo e desça pelo osso.",
            "type": "ordering",
            "feedback": {
              "correct": "Isso: cabeça, colo, trocânter menor e depois o tubo da diáfise.",
              "incorrect": "Releia a ordem do conceito: o colo vem logo abaixo da cabeça, e o trocânter menor, logo abaixo do colo."
            },
            "payload": {
              "prompt": "Ordene, na ordem ensinada nesta aula, de cima para baixo na face medial do fêmur.",
              "items": [
                {
                  "id": "item:rtg-2026:m24:aula-03:i4:2",
                  "label": "Colo do fêmur"
                },
                {
                  "id": "item:rtg-2026:m24:aula-03:i4:3",
                  "label": "Trocânter menor"
                },
                {
                  "id": "item:rtg-2026:m24:aula-03:i4:1",
                  "label": "Cabeça do fêmur"
                },
                {
                  "id": "item:rtg-2026:m24:aula-03:i4:4",
                  "label": "Diáfise do fêmur"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m24:aula-03:i4:1",
                "item:rtg-2026:m24:aula-03:i4:2",
                "item:rtg-2026:m24:aula-03:i4:3",
                "item:rtg-2026:m24:aula-03:i4:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Dona Marta caiu e sente dor forte no quadril. Duda faz afirmações ao se preparar. Julgue cada uma."
            },
            "help": "Uma das afirmações é sobre conduta, e as outras sobre posição.",
            "type": "true-false",
            "feedback": {
              "correct": "Você uniu a anatomia ao cuidado: nomeou as partes e manteve o membro parado.",
              "incorrect": "Releia o conceito e lembre: diante de suspeita de fratura, você não move o membro."
            },
            "payload": {
              "prompt": "Dona Marta caiu e sente dor forte no quadril. Duda faz afirmações ao se preparar. Julgue cada uma.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m24:aula-03:i5:1",
                  "text": "Suspeita de fratura no quadril: não girar o membro e pedir apoio.",
                  "isTrue": true,
                  "explanation": "Certo: com suspeita de fratura você não gira nem move o membro, e pede apoio à equipe."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-03:i5:2",
                  "text": "O trocânter menor fica na lateral do fêmur, acima do colo.",
                  "isTrue": false,
                  "explanation": "Errado: o trocânter menor fica na face medial, logo abaixo do colo; o da lateral é o maior."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-03:i5:3",
                  "text": "O colo do fêmur fica logo abaixo da cabeça.",
                  "isTrue": true,
                  "explanation": "Certo: o colo é a parte estreita logo abaixo da cabeça do fêmur."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-03:i5:4",
                  "text": "O acetábulo é uma saliência da ponta do fêmur.",
                  "isTrue": false,
                  "explanation": "Errado: o acetábulo é a cavidade do osso do quadril, e não parte do fêmur."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você nomeia o fêmur proximal",
            "body": "Agora você sabe dizer que a cabeça do fêmur encaixa no acetábulo, que o colo vem abaixo dela e onde ficam os trocânteres maior e menor. Com suspeita de fratura, você não gira o membro e pede apoio.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Bola, copo e duas saliências: agora o quadril tem endereço certo."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m24:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-pelve"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "A pelve por partes",
            "body": "Hoje você vai conseguir nomear ílio, ísquio, púbis e sacro e as articulações que unem a pelve.",
            "dialogue": {
              "setting": "Laboratório didático",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Em cada lado da pelve há um único osso do quadril, mas ele nasce de três. Quem arrisca os nomes?"
                },
                {
                  "speaker": "duda",
                  "text": "Ílio é o da cintura. Os outros dois eu embolo, e ainda não sei o que prende a pelve à coluna."
                },
                {
                  "speaker": "caio",
                  "text": "Hoje a gente separa as três partes e olha o que une cada lado ao sacro e ao outro lado."
                },
                {
                  "speaker": "pixel",
                  "text": "Onde fica cada parte, e que articulações unem a pelve?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Três partes, um osso, duas uniões",
            "body": "Cada osso do quadril reúne três partes, fundidas no fim da adolescência. O ílio é a parte larga, em leque, no alto. O ísquio forma a parte de trás e de baixo, onde o corpo se apoia sentado. O púbis fica na frente e se une ao do outro lado na sínfise púbica. As três se encontram no acetábulo. O forame obturado é a abertura entre o ísquio e o púbis. O sacro fica entre os dois ossos do quadril e se une a cada ílio na articulação sacroilíaca, pouco móvel.",
            "keyPoints": [
              "Ílio no alto, ísquio atrás e embaixo, púbis na frente.",
              "Sacroilíaca une sacro e ílio; sínfise púbica une os dois púbis."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Em qual estrutura do osso do quadril a cabeça do fêmur se encaixa?"
            },
            "help": "Pense na cavidade em forma de copo do osso do quadril.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a cabeça do fêmur encaixa no acetábulo, formando a articulação do quadril.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Em qual estrutura do osso do quadril a cabeça do fêmur se encaixa?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-04:i1:a",
                  "label": "No acetábulo",
                  "explanation": "Isso: a cabeça do fêmur encaixa no acetábulo, formando a articulação do quadril."
                },
                {
                  "id": "option:rtg-2026:m24:aula-04:i1:b",
                  "label": "No forame obturado",
                  "explanation": "O forame obturado é uma abertura do osso do quadril; a cabeça do fêmur não entra nele."
                },
                {
                  "id": "option:rtg-2026:m24:aula-04:i1:c",
                  "label": "Na sínfise púbica",
                  "explanation": "A sínfise é a união dos dois púbis, na frente, e não um encaixe do fêmur."
                },
                {
                  "id": "option:rtg-2026:m24:aula-04:i1:d",
                  "label": "Na articulação sacroilíaca",
                  "explanation": "A sacroilíaca une o sacro ao ílio, e não recebe o fêmur."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-04:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule cinco partes da pelve vista de frente, tocando na ficha e no ponto. O lado direito do paciente fica à esquerda da figura."
            },
            "help": "Comece pelo osso do meio, com os furinhos em pares.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: você achou o ílio, o sacro, as duas uniões e o encaixe do fêmur.",
              "incorrect": "Alguma ficha está fora do lugar: separe o que é osso, o que é união entre ossos e o que é encaixe."
            },
            "payload": {
              "prompt": "Rotule cinco partes da pelve vista de frente, tocando na ficha e no ponto. O lado direito do paciente fica à esquerda da figura.",
              "imageRef": "diagram:pelve-de-frente",
              "points": [
                {
                  "id": "point:rtg-2026:m24:aula-04:i2:1",
                  "x": 0.219,
                  "y": 0.254,
                  "where": "à esquerda da figura, a asa larga e azul, no alto",
                  "correctLabelId": "label:rtg-2026:m24:aula-04:i2:1"
                },
                {
                  "id": "point:rtg-2026:m24:aula-04:i2:2",
                  "x": 0.475,
                  "y": 0.375,
                  "where": "no centro, o osso triangular com quatro pares de furos",
                  "correctLabelId": "label:rtg-2026:m24:aula-04:i2:2"
                },
                {
                  "id": "point:rtg-2026:m24:aula-04:i2:3",
                  "x": 0.644,
                  "y": 0.384,
                  "where": "à direita, a linha entre o osso central e a asa azul",
                  "correctLabelId": "label:rtg-2026:m24:aula-04:i2:3"
                },
                {
                  "id": "point:rtg-2026:m24:aula-04:i2:4",
                  "x": 0.5,
                  "y": 0.779,
                  "where": "embaixo, na linha média, a linha entre as peças amarelas",
                  "correctLabelId": "label:rtg-2026:m24:aula-04:i2:4"
                },
                {
                  "id": "point:rtg-2026:m24:aula-04:i2:5",
                  "x": 0.231,
                  "y": 0.618,
                  "where": "à esquerda, o arco branco aberto embaixo, como um copo",
                  "correctLabelId": "label:rtg-2026:m24:aula-04:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:4",
                  "label": "Sínfise púbica"
                },
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:2",
                  "label": "Sacro"
                },
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:6",
                  "label": "Cabeça do fêmur"
                },
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:5",
                  "label": "Acetábulo"
                },
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:3",
                  "label": "Articulação sacroilíaca"
                },
                {
                  "id": "label:rtg-2026:m24:aula-04:i2:1",
                  "label": "Ílio"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque na abertura entre o ísquio e o púbis, do lado esquerdo do paciente."
            },
            "help": "Na vista de frente, o paciente está virado para você. De que lado da figura fica a esquerda dele?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: é o forame obturado, e o lado esquerdo do paciente aparece à direita de quem olha a pelve de frente.",
              "incorrect": "Confira a abertura e o lado: o forame obturado fica entre o ísquio e o púbis, e a esquerda do paciente fica à direita da figura."
            },
            "payload": {
              "prompt": "Toque na abertura entre o ísquio e o púbis, do lado esquerdo do paciente.",
              "imageRef": "diagram:pelve-de-frente",
              "regions": [
                {
                  "id": "region:rtg-2026:m24:aula-04:i3:1",
                  "label": "Sacro",
                  "x": 0.4,
                  "y": 0.258,
                  "width": 0.15,
                  "height": 0.233
                },
                {
                  "id": "region:rtg-2026:m24:aula-04:i3:2",
                  "label": "Sacroilíaca, à direita da figura",
                  "x": 0.581,
                  "y": 0.25,
                  "width": 0.125,
                  "height": 0.267
                },
                {
                  "id": "region:rtg-2026:m24:aula-04:i3:3",
                  "label": "Forame obturado, à direita da figura",
                  "x": 0.619,
                  "y": 0.692,
                  "width": 0.088,
                  "height": 0.167
                },
                {
                  "id": "region:rtg-2026:m24:aula-04:i3:4",
                  "label": "Forame obturado, à esquerda da figura",
                  "x": 0.293,
                  "y": 0.692,
                  "width": 0.088,
                  "height": 0.167
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m24:aula-04:i3:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada parte da pelve à sua descrição."
            },
            "help": "O osso do meio não faz parte do osso do quadril.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada parte ao lugar certo da pelve.",
              "incorrect": "Confira a posição de cada parte: alto, atrás e embaixo, frente, e o osso do meio."
            },
            "payload": {
              "prompt": "Ligue cada parte da pelve à sua descrição.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m24:aula-04:i4:1",
                  "left": "Ílio",
                  "right": "Parte larga, em forma de leque, no alto do osso do quadril"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-04:i4:2",
                  "left": "Ísquio",
                  "right": "Parte de trás e de baixo, onde o corpo se apoia sentado"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-04:i4:3",
                  "left": "Púbis",
                  "right": "Parte da frente, que se une ao do outro lado"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-04:i4:4",
                  "left": "Sacro",
                  "right": "Osso entre os dois ossos do quadril, preso à coluna"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Duda monta uma pelve de modelo e descreve o que vê. Julgue cada afirmação dela."
            },
            "help": "Pergunte de cada união quais ossos ela liga.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou as duas uniões e a posição de cada parte.",
              "incorrect": "Releia o conceito: cada união liga duas partes específicas, e o forame fica entre ísquio e púbis."
            },
            "payload": {
              "prompt": "Duda monta uma pelve de modelo e descreve o que vê. Julgue cada afirmação dela.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m24:aula-04:i5:1",
                  "text": "A sacroilíaca une o sacro ao ílio, de cada lado.",
                  "isTrue": true,
                  "explanation": "Certo: a articulação sacroilíaca une o sacro ao ílio e é pouco móvel."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-04:i5:2",
                  "text": "A sínfise púbica une o sacro a cada ílio, de cada lado.",
                  "isTrue": false,
                  "explanation": "Errado: a sínfise púbica une os dois púbis, na frente; quem une sacro e ílio é a sacroilíaca."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-04:i5:3",
                  "text": "O ísquio forma a parte de trás e de baixo do quadril.",
                  "isTrue": true,
                  "explanation": "Certo: o ísquio é a parte de trás e de baixo, onde o corpo se apoia sentado."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-04:i5:4",
                  "text": "O forame obturado fica entre o ísquio e o púbis.",
                  "isTrue": true,
                  "explanation": "Certo: o forame obturado é a abertura entre o ísquio e o púbis."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você nomeia a pelve por partes",
            "body": "Agora você sabe dizer onde ficam ílio, ísquio e púbis, que o sacro se une a cada ílio pela sacroilíaca e que os dois púbis se unem na sínfise púbica.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Três partes, um osso, duas uniões: a pelve deixou de ser um bloco só."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m24:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-pelve",
          "source:rtg-2026:m24:openstax-ap2e-coluna"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Uma vértebra de perto",
            "body": "Hoje você vai conseguir nomear as partes de uma vértebra e dizer em que as regiões da coluna diferem.",
            "dialogue": {
              "setting": "Laboratório didático",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "No modelo, cada vértebra parece um anel com espinhos. Mas eu não sei o nome de cada pedaço."
                },
                {
                  "speaker": "caio",
                  "text": "Pegue esta lombar e olhe de cima: um bloco na frente, um anel atrás e três hastes saindo do anel."
                },
                {
                  "speaker": "pixel",
                  "text": "O que cada parte faz, e o que muda de uma região da coluna para outra?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "O corpo, o arco e os processos",
            "body": "A vértebra tem o corpo, a parte da frente que suporta o peso, e o arco, atrás, com dois pedículos junto ao corpo e duas lâminas que o fecham. O furo entre corpo e arco é o forame vertebral; os forames alinhados formam o canal da medula espinal. Os processos transversos saem para os lados, e o espinhoso aponta para trás. Cervicais têm corpo pequeno e forame no processo transverso. Torácicas têm facetas para as costelas e espinhoso longo, inclinado para baixo. Lombares têm os maiores corpos e espinhoso curto.",
            "keyPoints": [
              "Corpo na frente, arco atrás; processo espinhoso para trás.",
              "Cervical: corpo pequeno, forame transverso. Torácica: facetas de costela. Lombar: maior corpo."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Qual parte do osso do quadril apoia o corpo quando a pessoa está sentada?"
            },
            "help": "Lembre a parte de trás e de baixo do osso do quadril.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o ísquio é a parte de trás e de baixo do osso do quadril, de apoio ao sentar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Qual parte do osso do quadril apoia o corpo quando a pessoa está sentada?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-05:i1:a",
                  "label": "O ílio",
                  "explanation": "O ílio é a parte larga, em leque, no alto do osso do quadril."
                },
                {
                  "id": "option:rtg-2026:m24:aula-05:i1:b",
                  "label": "O ísquio",
                  "explanation": "Isso: o ísquio é a parte de trás e de baixo do osso do quadril, de apoio ao sentar."
                },
                {
                  "id": "option:rtg-2026:m24:aula-05:i1:c",
                  "label": "O púbis",
                  "explanation": "O púbis fica na frente e se une ao do outro lado, na sínfise."
                },
                {
                  "id": "option:rtg-2026:m24:aula-05:i1:d",
                  "label": "O sacro",
                  "explanation": "O sacro é o osso do meio, preso à coluna, e não parte do osso do quadril."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule quatro partes de uma vértebra lombar vista de cima, tocando na ficha e no ponto. A frente do corpo fica no alto da figura."
            },
            "help": "Comece pelo bloco grande do alto, que suporta o peso.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: o corpo na frente, o pedículo junto a ele e as hastes para os lados e para trás.",
              "incorrect": "Alguma ficha está fora do lugar: o corpo é a parte da frente, e o resto forma o anel atrás dele."
            },
            "payload": {
              "prompt": "Rotule quatro partes de uma vértebra lombar vista de cima, tocando na ficha e no ponto. A frente do corpo fica no alto da figura.",
              "imageRef": "diagram:vertebra-tipica",
              "points": [
                {
                  "id": "point:rtg-2026:m24:aula-05:i2:1",
                  "x": 0.5,
                  "y": 0.2,
                  "where": "no alto da figura, o bloco grande e arredondado",
                  "correctLabelId": "label:rtg-2026:m24:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m24:aula-05:i2:2",
                  "x": 0.37,
                  "y": 0.45,
                  "where": "à esquerda do furo, o osso curto que liga o bloco ao anel",
                  "correctLabelId": "label:rtg-2026:m24:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m24:aula-05:i2:3",
                  "x": 0.79,
                  "y": 0.6,
                  "where": "a haste comprida que sai para o lado direito da figura",
                  "correctLabelId": "label:rtg-2026:m24:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m24:aula-05:i2:4",
                  "x": 0.5,
                  "y": 0.8,
                  "where": "a haste que desce na parte de baixo, para trás",
                  "correctLabelId": "label:rtg-2026:m24:aula-05:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m24:aula-05:i2:5",
                  "label": "Disco intervertebral"
                },
                {
                  "id": "label:rtg-2026:m24:aula-05:i2:4",
                  "label": "Processo espinhoso"
                },
                {
                  "id": "label:rtg-2026:m24:aula-05:i2:3",
                  "label": "Processo transverso"
                },
                {
                  "id": "label:rtg-2026:m24:aula-05:i2:2",
                  "label": "Pedículo"
                },
                {
                  "id": "label:rtg-2026:m24:aula-05:i2:1",
                  "label": "Corpo vertebral"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada característica na região da coluna em que ela aparece."
            },
            "help": "Costelas se prendem às vértebras do tórax.",
            "type": "categorize",
            "feedback": {
              "correct": "Você ligou cada característica à região em que ela aparece.",
              "incorrect": "Pergunte de cada característica: tem a ver com costela, com o forame do processo transverso ou com o tamanho do corpo?"
            },
            "payload": {
              "prompt": "Classifique cada característica na região da coluna em que ela aparece.",
              "categories": [
                {
                  "id": "group:rtg-2026:m24:aula-05:i3:a",
                  "label": "Cervical"
                },
                {
                  "id": "group:rtg-2026:m24:aula-05:i3:b",
                  "label": "Torácica"
                },
                {
                  "id": "group:rtg-2026:m24:aula-05:i3:c",
                  "label": "Lombar"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:6",
                  "label": "Processo espinhoso curto, sem faceta de costela",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:c"
                },
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:2",
                  "label": "Faceta para articular com a costela",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:1",
                  "label": "Abertura no processo transverso",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:a"
                },
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:5",
                  "label": "Processo espinhoso longo, inclinado para baixo",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:3",
                  "label": "Corpo entre os maiores da coluna",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:c"
                },
                {
                  "id": "item:rtg-2026:m24:aula-05:i3:4",
                  "label": "Corpo entre os menores da coluna",
                  "categoryId": "group:rtg-2026:m24:aula-05:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre a vértebra."
            },
            "help": "Leia cada afirmação com calma antes de responder.",
            "type": "blitz",
            "feedback": {
              "correct": "Você separou o que é de cada parte e de cada região, no ritmo da rodada.",
              "incorrect": "Reveja as afirmações: o retorno de cada uma explica a parte ou a região certa."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre a vértebra.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:1",
                  "text": "O corpo da vértebra é a parte da frente, que suporta o peso.",
                  "isTrue": true,
                  "explanation": "O corpo fica na frente do anel e é a parte que suporta o peso."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:2",
                  "text": "O processo espinhoso aponta para a frente do corpo.",
                  "isTrue": false,
                  "explanation": "O processo espinhoso aponta para trás, no meio das costas."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:3",
                  "text": "Os forames vertebrais alinhados formam o canal da medula espinal.",
                  "isTrue": true,
                  "explanation": "Alinhados, os forames de todas as vértebras formam o canal que contém a medula."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:4",
                  "text": "Os processos transversos saem para os lados do arco.",
                  "isTrue": true,
                  "explanation": "Os dois processos transversos saem para os lados e servem de apoio a músculos."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:5",
                  "text": "O forame no processo transverso é típico das vértebras lombares.",
                  "isTrue": false,
                  "explanation": "Esse forame é típico das cervicais; as lombares têm o maior corpo e não têm faceta de costela."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:6",
                  "text": "As facetas para as costelas são típicas das vértebras torácicas.",
                  "isTrue": true,
                  "explanation": "Cada vértebra torácica tem facetas para articular com as costelas."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-05:i4:7",
                  "text": "As vértebras lombares têm os menores corpos da coluna.",
                  "isTrue": false,
                  "explanation": "É o contrário: as lombares têm os maiores corpos, porque suportam mais peso."
                }
              ],
              "passCount": 6
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Caio traz uma vértebra de modelo sem etiqueta. Ajude-o a descobrir de que região ela é."
            },
            "help": "Associe cada característica à região em que ela aparece.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: forame no processo transverso aponta para a cervical, e facetas de costela, para a torácica.",
              "incorrect": "Revise: forame transverso é da cervical, facetas de costela e espinhoso longo são da torácica."
            },
            "payload": {
              "prompt": "Caio traz uma vértebra de modelo sem etiqueta. Ajude-o a descobrir de que região ela é.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m24:aula-05:i5:1",
                  "line": "Esta tem um furo em cada processo transverso. Isso aponta para qual região?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:1a",
                      "label": "Para a lombar, de corpo grande.",
                      "reply": "Hum, lombar. Mas o corpo desta nem é tão grande assim."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:1b",
                      "label": "Para a cervical.",
                      "reply": "Cervical, então. Vou anotar na etiqueta com lápis."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:1c",
                      "label": "Para a torácica, ligada às costelas.",
                      "reply": "Torácica? Aí eu esperaria facetas, e não vi nenhuma."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m24:aula-05:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m24:aula-05:i5:2",
                  "line": "Outra vértebra tem facetas para costelas e o espinhoso é longo, inclinado para baixo. E essa?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:2a",
                      "label": "É torácica.",
                      "reply": "Torácica. Faz sentido, é a região das costelas."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:2b",
                      "label": "É cervical, por ser pequena e leve.",
                      "reply": "Cervical? Mas ela tem as facetas, e isso me confunde."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-05:i5:2c",
                      "label": "É lombar, por causa do espinhoso.",
                      "reply": "Lombar? O espinhoso da lombar é curto, não é? Fiquei na dúvida."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m24:aula-05:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê uma vértebra de perto",
            "body": "Agora você sabe nomear corpo, pedículo e processos transversos e espinhoso, reconhecer o forame e relacionar forame transverso, facetas de costela e corpo grande às regiões cervical, torácica e lombar.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quem reconhece as partes de uma vértebra reconhece a coluna inteira."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m24:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m24:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m24-v1",
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-coluna",
          "source:rtg-2026:m24:openstax-ap2e-articulacoes",
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
          "source:rtg-2026:m24:openstax-ap2e-pelve",
          "source:rtg-2026:m24:medlineplus-fratura"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Do pedido à região",
            "body": "Hoje você vai conseguir dizer que ossos uma região pedida reúne e pedir apoio quando o paciente não tolera a movimentação.",
            "dialogue": {
              "setting": "Sala de exames",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "O pedido de hoje diz só joelho direito. Que ossos entram nessa palavra?"
                },
                {
                  "speaker": "duda",
                  "text": "Fêmur e tíbia, eu acho. E a patela? E a fíbula? Não sei até onde a região vai."
                },
                {
                  "speaker": "caio",
                  "text": "E tem o paciente. Com dor forte, o plano muda, e quem decide como é a equipe."
                },
                {
                  "speaker": "pixel",
                  "text": "Que ossos a palavra reúne, e quando você para e chama apoio?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "A palavra do pedido reúne ossos",
            "body": "O nome da região diz que ossos entram nela. A articulação do joelho reúne o fêmur, a tíbia e a patela; a fíbula fica ao lado. A pelve reúne os dois ossos do quadril, o sacro e o cóccix. Se o paciente simulado tem dor forte ou suspeita de fratura, você não move o membro: para, descreve o que vê e pede apoio à equipe. A figura mostra o joelho de frente e de perfil.",
            "keyPoints": [
              "Joelho: fêmur, tíbia e patela. Pelve: ossos do quadril, sacro e cóccix.",
              "Dor forte ou suspeita de fratura: não mover, descrever e pedir apoio."
            ],
            "visual": "joelho-frente-e-perfil"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Que parte da vértebra aponta para trás, no meio das costas?"
            },
            "help": "Pense na parte que se sente como bolinhas ao longo da coluna.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o processo espinhoso aponta para trás, no meio das costas.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Que parte da vértebra aponta para trás, no meio das costas?",
              "options": [
                {
                  "id": "option:rtg-2026:m24:aula-06:i1:a",
                  "label": "O corpo vertebral",
                  "explanation": "O corpo fica na frente e suporta o peso, no lado oposto ao das costas."
                },
                {
                  "id": "option:rtg-2026:m24:aula-06:i1:b",
                  "label": "O processo transverso",
                  "explanation": "Os processos transversos saem para os lados, e não para trás."
                },
                {
                  "id": "option:rtg-2026:m24:aula-06:i1:c",
                  "label": "O processo espinhoso",
                  "explanation": "Isso: o processo espinhoso aponta para trás, no meio das costas."
                },
                {
                  "id": "option:rtg-2026:m24:aula-06:i1:d",
                  "label": "O forame vertebral",
                  "explanation": "O forame é o furo central, e não uma parte que aponta para fora."
                }
              ],
              "correctOptionId": "option:rtg-2026:m24:aula-06:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O pedido é joelho direito. Na vista de frente, toque no osso que fica ao lado do joelho, fora da articulação."
            },
            "help": "Lembre os três ossos que formam o joelho e procure o que sobra.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: a fíbula fica ao lado da tíbia e não forma a articulação do joelho, que reúne fêmur, tíbia e patela.",
              "incorrect": "Essa estrutura forma a articulação do joelho: procure o osso fino ao lado da tíbia, que fica fora dela."
            },
            "payload": {
              "prompt": "O pedido é joelho direito. Na vista de frente, toque no osso que fica ao lado do joelho, fora da articulação.",
              "imageRef": "diagram:joelho-frente-e-perfil",
              "regions": [
                {
                  "id": "region:rtg-2026:m24:aula-06:i2:1",
                  "label": "Côndilo lateral do fêmur, de frente",
                  "x": 0.083,
                  "y": 0.181,
                  "width": 0.108,
                  "height": 0.24
                },
                {
                  "id": "region:rtg-2026:m24:aula-06:i2:2",
                  "label": "Cabeça da fíbula, de frente",
                  "x": 0.046,
                  "y": 0.52,
                  "width": 0.084,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m24:aula-06:i2:3",
                  "label": "Côndilos da tíbia, de frente",
                  "x": 0.184,
                  "y": 0.464,
                  "width": 0.228,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m24:aula-06:i2:4",
                  "label": "Patela, de perfil",
                  "x": 0.856,
                  "y": 0.064,
                  "width": 0.096,
                  "height": 0.267
                },
                {
                  "id": "region:rtg-2026:m24:aula-06:i2:5",
                  "label": "Tíbia, de perfil",
                  "x": 0.681,
                  "y": 0.542,
                  "width": 0.158,
                  "height": 0.417
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m24:aula-06:i2:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada região de um pedido fictício aos ossos que ela reúne."
            },
            "help": "Duas regiões têm o osso do pé ou da perna em comum; veja qual osso só uma delas tem.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada região aos ossos que a palavra do pedido inclui.",
              "incorrect": "Confira cada região: pé tem três grupos, joelho tem a patela, pelve tem o sacro e tornozelo tem o tálus."
            },
            "payload": {
              "prompt": "Ligue cada região de um pedido fictício aos ossos que ela reúne.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m24:aula-06:i3:1",
                  "left": "Pé",
                  "right": "Tarsais, metatarsais e falanges"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-06:i3:2",
                  "left": "Joelho",
                  "right": "Fêmur, tíbia e patela"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-06:i3:3",
                  "left": "Pelve",
                  "right": "Dois ossos do quadril, sacro e cóccix"
                },
                {
                  "id": "pair:rtg-2026:m24:aula-06:i3:4",
                  "left": "Tornozelo",
                  "right": "Tálus com a tíbia e a fíbula"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Seu Jorge, paciente simulado, caiu e sente dor forte no joelho direito. Conduza a conversa com cuidado."
            },
            "help": "Pense no que você pode decidir sozinho diante de dor forte.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: com dor forte você não move o membro, descreve o que vê e deixa a decisão com a equipe.",
              "incorrect": "Reveja a conversa: com dor forte ou suspeita de fratura, você para, descreve sem concluir e pede apoio."
            },
            "payload": {
              "prompt": "Seu Jorge, paciente simulado, caiu e sente dor forte no joelho direito. Conduza a conversa com cuidado.",
              "speaker": "paciente",
              "name": "Seu Jorge",
              "turns": [
                {
                  "id": "turn:rtg-2026:m24:aula-06:i4:1",
                  "line": "Não consigo mexer a perna, dói demais. O pedido é do joelho: você vai ter que dobrar, não é?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:1a",
                      "label": "Vou dobrar bem devagar, e o senhor me avisa quando doer.",
                      "reply": "Tá, mas já aviso que só de pensar em dobrar dói."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:1b",
                      "label": "Não vou mexer a perna. Chamo a supervisão agora.",
                      "reply": "Fico mais tranquilo. Tá bom, eu espero aqui."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:1c",
                      "label": "Tente dobrar sozinho; se não der, a gente segue assim mesmo.",
                      "reply": "Tá, eu tento, mas não prometo nada."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m24:aula-06:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m24:aula-06:i4:2",
                  "line": "A supervisão vai querer saber o que você viu. O que vai dizer a ela?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:2a",
                      "label": "Descrevo a queixa e o que vejo, sem concluir.",
                      "reply": "Entendi. Eu confirmo o que contei, então."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:2b",
                      "label": "Digo que é fratura, para a equipe se preparar.",
                      "reply": "Fratura? Nossa, não sei se é isso. Só sei que dói muito."
                    },
                    {
                      "id": "option:rtg-2026:m24:aula-06:i4:2c",
                      "label": "Digo que é só torção e que dá para esperar um pouco.",
                      "reply": "Torção? Espero que seja, porque a dor está forte."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m24:aula-06:i4:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m24:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m24:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Duda e Caio revisam o que fazer ao receber pedidos. Julgue cada afirmação."
            },
            "help": "Duas afirmações são de anatomia e duas são de conduta.",
            "type": "true-false",
            "feedback": {
              "correct": "Você uniu o que cada região reúne ao cuidado de pedir apoio.",
              "incorrect": "Releia o conceito: o nome da região define os ossos, e diante de dor forte a decisão é da equipe."
            },
            "payload": {
              "prompt": "Duda e Caio revisam o que fazer ao receber pedidos. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m24:aula-06:i5:1",
                  "text": "O pedido de pelve reúne os ossos do quadril, o sacro e o cóccix.",
                  "isTrue": true,
                  "explanation": "Certo: a pelve reúne os dois ossos do quadril, o sacro e o cóccix."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-06:i5:2",
                  "text": "O pedido de joelho não inclui a patela.",
                  "isTrue": false,
                  "explanation": "Errado: a patela faz parte da articulação do joelho, junto com o fêmur e a tíbia."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-06:i5:3",
                  "text": "Com dor forte, você descreve o que vê e pede apoio à equipe.",
                  "isTrue": true,
                  "explanation": "Certo: diante de dor forte você para, descreve o que vê e pede apoio."
                },
                {
                  "id": "statement:rtg-2026:m24:aula-06:i5:4",
                  "text": "Com dor forte, você escolhe sozinho como adaptar o posicionamento.",
                  "isTrue": false,
                  "explanation": "Errado: a adaptação é combinada com a equipe, e não escolhida por quem está em formação."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m24:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê a região do pedido",
            "body": "Agora você sabe dizer que o joelho reúne fêmur, tíbia e patela, que a pelve reúne os ossos do quadril, o sacro e o cóccix, e que com dor forte você não move o membro e pede apoio.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Ler a região e saber parar: as duas coisas fazem parte do trabalho."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m24",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-01"
        ],
        "prompt": "Quantas falanges há, no total, em um pé?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-01:c1:a",
            "label": "Catorze, sendo duas no hálux"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c1:b",
            "label": "Quinze, três em cada dedo"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c1:c",
            "label": "Dez, duas em cada dedo"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c1:d",
            "label": "Dezesseis, quatro em cada dedo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-01:c1:a",
        "feedback": {
          "correct": "Isso: duas no hálux e três em cada um dos outros quatro dedos somam catorze.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-01"
        ],
        "prompt": "Qual destes ossos pertence ao grupo dos tarsais?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-01:c2:a",
            "label": "Falange proximal do hálux"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c2:b",
            "label": "Primeiro metatarsal"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c2:c",
            "label": "Navicular"
          },
          {
            "id": "option:rtg-2026:m24:aula-01:c2:d",
            "label": "Patela"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-01:c2:c",
        "feedback": {
          "correct": "Isso: o navicular é um dos sete tarsais, à frente do tálus.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-02"
        ],
        "prompt": "Que osso fica dentro do tendão do quadríceps, na frente do joelho?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-02:c1:a",
            "label": "A fíbula, o osso fino ao lado da tíbia"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c1:b",
            "label": "A patela, o maior osso sesamoide"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c1:c",
            "label": "O tálus, o osso do tornozelo, no pé"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c1:d",
            "label": "O calcâneo, o osso do calcanhar, no pé"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-02:c1:b",
        "feedback": {
          "correct": "Isso: a patela é um osso sesamoide dentro do tendão do quadríceps.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-02"
        ],
        "prompt": "A cabeça da fíbula se apoia em qual parte da tíbia?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-02:c2:a",
            "label": "Na eminência intercondilar, no centro"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c2:b",
            "label": "Na tuberosidade, na frente da tíbia"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c2:c",
            "label": "No maléolo medial, no tornozelo"
          },
          {
            "id": "option:rtg-2026:m24:aula-02:c2:d",
            "label": "Na parte de baixo do côndilo lateral"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-02:c2:d",
        "feedback": {
          "correct": "Isso: a cabeça da fíbula se apoia sob o côndilo lateral da tíbia.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-03"
        ],
        "prompt": "O trocânter menor fica em qual face do fêmur?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-03:c1:a",
            "label": "Na lateral, acima da base do colo"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c1:b",
            "label": "Na face da frente, junto ao joelho"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c1:c",
            "label": "Na face medial, logo abaixo do colo"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c1:d",
            "label": "Dentro do acetábulo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-03:c1:c",
        "feedback": {
          "correct": "Isso: o trocânter menor é a pequena saliência medial, abaixo do colo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-03"
        ],
        "prompt": "Como se descreve o tipo da articulação do quadril, com a cabeça do fêmur num encaixe profundo?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-03:c2:a",
            "label": "Bola e soquete, com movimento em vários eixos"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c2:b",
            "label": "Dobradiça, com movimento em um só eixo"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c2:c",
            "label": "Fibrosa, sem movimento"
          },
          {
            "id": "option:rtg-2026:m24:aula-03:c2:d",
            "label": "Cartilagínea, que se move pouco"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-03:c2:a",
        "feedback": {
          "correct": "Isso: o quadril é uma articulação bola e soquete, com movimento em vários eixos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-articulacoes"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-04"
        ],
        "prompt": "Que articulação une o sacro ao ílio, de cada lado?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-04:c1:a",
            "label": "A sínfise púbica, na frente"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c1:b",
            "label": "A articulação do quadril, com o fêmur"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c1:c",
            "label": "A articulação com as costelas"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c1:d",
            "label": "A sacroilíaca, pouco móvel"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: a articulação sacroilíaca une o sacro ao ílio e se move pouco.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-pelve"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-04"
        ],
        "prompt": "A sínfise púbica une quais ossos?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-04:c2:a",
            "label": "Os dois ísquios, atrás e embaixo"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c2:b",
            "label": "Os dois púbis, na frente do corpo"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c2:c",
            "label": "O sacro e o ílio, na parte de trás"
          },
          {
            "id": "option:rtg-2026:m24:aula-04:c2:d",
            "label": "Os dois ílios, na parte de cima"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: a sínfise púbica une os dois púbis, na linha média, na frente.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-pelve"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-05"
        ],
        "prompt": "Uma vértebra de modelo tem facetas no corpo e no processo transverso para articular com costelas. De que região ela é?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-05:c1:a",
            "label": "Torácica"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c1:b",
            "label": "Cervical"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c1:c",
            "label": "Lombar"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c1:d",
            "label": "Sacral"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-05:c1:a",
        "feedback": {
          "correct": "Isso: as facetas para costelas são típicas das vértebras torácicas.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-coluna"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-05"
        ],
        "prompt": "Que estrutura percorre o canal formado pelos forames vertebrais alinhados?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-05:c2:a",
            "label": "O disco intervertebral"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c2:b",
            "label": "A costela"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c2:c",
            "label": "A medula espinal"
          },
          {
            "id": "option:rtg-2026:m24:aula-05:c2:d",
            "label": "O tendão do quadríceps"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-05:c2:c",
        "feedback": {
          "correct": "Isso: o canal formado pelos forames alinhados contém a medula espinal.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-coluna"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-06"
        ],
        "prompt": "O pedido fictício é de pé. Que grupo de ossos ocupa a parte de trás do pé?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-06:c1:a",
            "label": "Os metatarsais"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c1:b",
            "label": "Os tarsais"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c1:c",
            "label": "As falanges"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c1:d",
            "label": "Os côndilos"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-06:c1:b",
        "feedback": {
          "correct": "Isso: os sete tarsais ficam atrás, do calcanhar ao tornozelo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m24:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m24:aula-06"
        ],
        "prompt": "A pelve reúne, além dos ossos do quadril, quais outros ossos?",
        "options": [
          {
            "id": "option:rtg-2026:m24:aula-06:c2:a",
            "label": "Os dois fêmures"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c2:b",
            "label": "As vértebras lombares inteiras"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c2:c",
            "label": "As duas patelas"
          },
          {
            "id": "option:rtg-2026:m24:aula-06:c2:d",
            "label": "O sacro e o cóccix"
          }
        ],
        "correctOptionId": "option:rtg-2026:m24:aula-06:c2:d",
        "feedback": {
          "correct": "Isso: sacro e cóccix, além dos dois ossos do quadril, formam a pelve.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m24:openstax-ap2e-pelve"
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
      "claimId": "interaction:rtg-2026:m24:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m24:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-01:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-01:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-01:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m24:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m24:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "token:rtg-2026:m24:aula-01:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "token:rtg-2026:m24:aula-01:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m24:aula-01:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m24:aula-01:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m24:aula-01:i4:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-01:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-01:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-01:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-01:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-02:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-02:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-02:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-02:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m24:aula-02:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:i5:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-03:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:6",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:7",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-03:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m24:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m24:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "token:rtg-2026:m24:aula-03:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "token:rtg-2026:m24:aula-03:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "token:rtg-2026:m24:aula-03:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m24:aula-03:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m24:aula-03:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-03:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-03:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-03:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-03:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-03:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-04:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-04:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-04:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-04:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-04:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-04:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-04:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "point:rtg-2026:m24:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m24:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "label:rtg-2026:m24:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-05:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-05:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "group:rtg-2026:m24:aula-05:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "item:rtg-2026:m24:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-05:i4:7",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m24:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m24:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "region:rtg-2026:m24:aula-06:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m24:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m24:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m24:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:i4:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-06:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m24:aula-06:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m24:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "step:rtg-2026:m24:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-coluna",
        "source:rtg-2026:m24:openstax-ap2e-articulacoes",
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:openstax-ap2e-pelve",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m24:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-pelve"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
        "source:rtg-2026:m24:medlineplus-fratura"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "option:rtg-2026:m24:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m24:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m24:aula-01",
        "hook": "Complete a frase: no meio do pé ficam os ossos numerados de 1 a 5, os...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-01"
          ],
          "prompt": "Que grupo de ossos forma a parte do meio do pé, numerados de 1 a 5 a partir do lado medial?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-01:rg:a",
              "label": "Tarsais"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rg:b",
              "label": "Falanges"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rg:c",
              "label": "Cuneiformes"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rg:d",
              "label": "Metatarsais"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-01:rg:d",
          "feedback": {
            "correct": "Isso: são cinco metatarsais, numerados a partir do lado medial.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-01"
          ],
          "prompt": "Numa figura fictícia, Caio aponta o osso grande do calcanhar. Que osso é esse?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-01:rt:a",
              "label": "O calcâneo"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rt:b",
              "label": "O tálus"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rt:c",
              "label": "O navicular"
            },
            {
              "id": "option:rtg-2026:m24:aula-01:rt:d",
              "label": "O cuboide"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-01:rt:a",
          "feedback": {
            "correct": "Isso: o calcâneo é o osso do calcanhar e o maior do pé.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m24:aula-02",
        "hook": "Complete a frase: o fêmur termina em dois côndilos, o medial e o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-02"
          ],
          "prompt": "Quais são os dois côndilos do fêmur?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-02:rg:a",
              "label": "O medial e o lateral"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rg:b",
              "label": "O anterior e o posterior"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rg:c",
              "label": "O proximal e o distal"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rg:d",
              "label": "O superior e o inferior"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-02:rg:a",
          "feedback": {
            "correct": "Isso: um côndilo fica do lado medial e o outro, do lado lateral.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-02"
          ],
          "prompt": "Num modelo de perna, Duda aponta a saliência da frente da tíbia, logo abaixo do joelho, onde se prende o tendão da patela. Que parte é essa?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-02:rt:a",
              "label": "A cabeça da fíbula"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rt:b",
              "label": "A eminência intercondilar"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rt:c",
              "label": "A tuberosidade da tíbia"
            },
            {
              "id": "option:rtg-2026:m24:aula-02:rt:d",
              "label": "O côndilo lateral do fêmur"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-02:rt:c",
          "feedback": {
            "correct": "Isso: é nela que o tendão da patela se prende.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m24:aula-03",
        "hook": "Complete a frase: a saliência grande da lateral do fêmur é o trocânter...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-03"
          ],
          "prompt": "Qual trocânter fica na lateral do fêmur, acima da base do colo?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-03:rg:a",
              "label": "Nenhum: os dois ficam na face medial"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rg:b",
              "label": "O trocânter maior"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rg:c",
              "label": "O trocânter menor"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rg:d",
              "label": "A tuberosidade da tíbia"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-03:rg:b",
          "feedback": {
            "correct": "Isso: o trocânter maior é a saliência da lateral, acima da base do colo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-03"
          ],
          "prompt": "Num modelo, Duda aponta a parte redonda do fêmur que fica dentro do osso do quadril. Que parte é essa?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-03:rt:a",
              "label": "O trocânter maior"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rt:b",
              "label": "O colo do fêmur"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rt:c",
              "label": "A diáfise do fêmur"
            },
            {
              "id": "option:rtg-2026:m24:aula-03:rt:d",
              "label": "A cabeça do fêmur"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-03:rt:d",
          "feedback": {
            "correct": "Isso: a cabeça é a parte redonda que encaixa no acetábulo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m24:aula-04",
        "hook": "Complete a frase: o osso do quadril é feito de ísquio, púbis e...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-04"
          ],
          "prompt": "Que parte do osso do quadril é larga, em forma de leque, no alto?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-04:rg:a",
              "label": "O púbis"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rg:b",
              "label": "O ísquio"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rg:c",
              "label": "O ílio"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rg:d",
              "label": "O sacro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-04:rg:c",
          "feedback": {
            "correct": "Isso: o ílio é a parte larga e em leque do osso do quadril.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-pelve"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-04"
          ],
          "prompt": "Num modelo, Duda gira a pelve e mostra a parte de trás e de baixo, onde o corpo se apoia ao sentar. Que parte é essa?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-04:rt:a",
              "label": "O ísquio"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rt:b",
              "label": "O púbis"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rt:c",
              "label": "O ílio"
            },
            {
              "id": "option:rtg-2026:m24:aula-04:rt:d",
              "label": "O sacro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-04:rt:a",
          "feedback": {
            "correct": "Isso: o ísquio é a parte de trás e de baixo, de apoio ao sentar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-pelve"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m24:aula-05",
        "hook": "Complete a frase: o bloco da frente da vértebra, que suporta o peso, é o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-05"
          ],
          "prompt": "Que parte da vértebra fica na frente e suporta o peso?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-05:rg:a",
              "label": "O processo espinhoso"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rg:b",
              "label": "O forame vertebral"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rg:c",
              "label": "O processo transverso"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rg:d",
              "label": "O corpo vertebral"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-05:rg:d",
          "feedback": {
            "correct": "Isso: o corpo é a parte da frente e suporta o peso.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-coluna"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-05"
          ],
          "prompt": "Na bancada, Duda mostra uma vértebra de corpo muito volumoso, sem faceta de costela e sem forame no processo transverso. De que região é, mais provavelmente?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-05:rt:a",
              "label": "Cervical"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rt:b",
              "label": "Lombar"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rt:c",
              "label": "Torácica"
            },
            {
              "id": "option:rtg-2026:m24:aula-05:rt:d",
              "label": "Cóccix"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-05:rt:b",
          "feedback": {
            "correct": "Isso: corpo muito volumoso e nenhuma faceta de costela são sinais de vértebra lombar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-coluna"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m24:aula-06",
        "hook": "Complete a frase: se o paciente sente dor forte, eu paro, descrevo o que vejo e...",
        "guided": {
          "id": "recovery-item:rtg-2026:m24:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-06"
          ],
          "prompt": "O que você faz depois de parar e descrever o que vê, quando o paciente tem dor forte?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-06:rg:a",
              "label": "Peço apoio à equipe"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rg:b",
              "label": "Movo o membro devagar"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rg:c",
              "label": "Escolho uma adaptação sozinho"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rg:d",
              "label": "Libero o paciente sem a imagem"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-06:rg:a",
          "feedback": {
            "correct": "Isso: depois de parar e descrever, você pede apoio, e a decisão é da equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior",
            "source:rtg-2026:m24:medlineplus-fratura"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m24:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m24:aula-06"
          ],
          "prompt": "Dona Marta, paciente simulada, tem pedido de tornozelo. Que ossos essa região reúne?",
          "options": [
            {
              "id": "option:rtg-2026:m24:aula-06:rt:a",
              "label": "A patela e a eminência intercondilar"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rt:b",
              "label": "O sacro e os dois ossos do quadril"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rt:c",
              "label": "O tálus, com a tíbia e a fíbula"
            },
            {
              "id": "option:rtg-2026:m24:aula-06:rt:d",
              "label": "Os metatarsais e as falanges do pé"
            }
          ],
          "correctOptionId": "option:rtg-2026:m24:aula-06:rt:c",
          "feedback": {
            "correct": "Isso: o tornozelo reúne o tálus e as extremidades distais da tíbia e da fíbula.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m24:openstax-ap2e-membro-inferior"
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
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "8a0341eab48a270e9098da7ba2eee3bde60c77ee16923b37b479592c1e954084"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
