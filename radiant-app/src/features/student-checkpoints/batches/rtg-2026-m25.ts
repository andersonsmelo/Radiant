// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M25: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m25",
  "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923",
  "trackId": "track:rtg-2026:m25",
  "unitId": "unit:rtg-2026:m25",
  "contentVersion": "rtg-2026-m25-v1",
  "competencyIds": [
    "competency:rtg-2026:m25:aula-01",
    "competency:rtg-2026:m25:aula-02",
    "competency:rtg-2026:m25:aula-03",
    "competency:rtg-2026:m25:aula-04",
    "competency:rtg-2026:m25:aula-05",
    "competency:rtg-2026:m25:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m25:openstax-ap-cranio",
      "title": "Anatomy and Physiology: The Skull (section 7.2)",
      "publisher": "OpenStax",
      "url": "https://openstax.org/books/anatomy-and-physiology/pages/7-2-the-skull",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro aberto com licença restritiva (CC BY-NC-SA); consultado para fatos, sem reprodução de texto nem de figuras."
    },
    {
      "id": "source:rtg-2026:m25:r101-cranio",
      "title": "Skull X-Ray Positioning",
      "publisher": "Radiography 101",
      "url": "https://radiography101.org/articles/skull-xray-positioning",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página de ensino de radiografia, aberta; consultada para linhas, planos e critérios de alinhamento, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:wiki-orbitomeatal",
      "title": "Orbitomeatal line",
      "publisher": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Orbitomeatal_line",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página aberta usada só para confirmar a definição da linha orbitomeatal, junto de fonte de ensino; sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:r101-movel",
      "title": "Mobile and Portable Radiography",
      "publisher": "Radiography 101",
      "url": "https://radiography101.org/articles/mobile-portable-radiography",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página de ensino, aberta; consultada para preparo, distância, quem fica e aviso no exame no leito, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:futureradtech-trauma",
      "title": "Chapter 12: Trauma Radiography",
      "publisher": "Future Rad Tech",
      "url": "https://futureradtech.pages.dev/chapter12.html",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Material de estudo aberto; consultado para colar, prancha, feixe horizontal e aviso antes da exposição, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:exam-prep-trauma",
      "title": "Trauma, Mobile, Surgical and Special Populations",
      "publisher": "Open Exam Prep",
      "url": "https://open-exam-prep.com/study-guides/arrt-radiography/contrast-trauma-mobile/trauma-mobile-surgical-special",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Guia de estudo aberto; consultado para trauma e exame no leito, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:wiki-seios",
      "title": "Paranasal sinuses",
      "publisher": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Paranasal_sinuses",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página aberta usada só para a posição dos seios em relação aos olhos, junto do OpenStax; sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m25:pmc-espalhamento-movel",
      "title": "Spatial Scattering Radiation to the Radiological Technologist during Medical Mobile Radiography (Bioengineering, 2023)",
      "publisher": "Bioengineering (MDPI), via PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9952711/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto (CC BY 4.0); consultado para a queda da radiação espalhada com a distância no exame no leito, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m25:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Ossos do crânio e da face",
            "body": "Hoje você vai conseguir nomear os ossos do crânio vistos de perfil e separar a caixa craniana da face.",
            "dialogue": {
              "setting": "Laboratório de anatomia",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Peguei um crânio de modelo e, de lado, não sei dizer onde um osso termina e o outro começa."
                },
                {
                  "speaker": "caio",
                  "text": "De perfil dá para nomear uns sete ossos. Cada um tem o seu território na lateral."
                },
                {
                  "speaker": "pixel",
                  "text": "Que tal começar pela calota, que cobre o cérebro, e descer até a face?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Os ossos do crânio de perfil",
            "body": "De perfil, a caixa craniana mostra o frontal, na testa; o parietal, que forma a maior parte do alto da lateral; o temporal, na parte de baixo da lateral; e o occipital, atrás. O esfenoide aparece pela asa maior, à frente do temporal e, neste esquema, atrás da órbita. Na face ficam a maxila, que segura os dentes de cima; o zigomático, o osso da bochecha; e a mandíbula, que segura os de baixo e tem um ramo que sobe atrás.",
            "keyPoints": [
              "Caixa craniana: frontal, parietal, temporal, occipital e esfenoide.",
              "Face: maxila, zigomático e mandíbula.",
              "Do esfenoide, de perfil, vê-se a asa maior."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M08. Qual é o único osso do crânio que se move?"
            },
            "help": "Pense em qual osso acompanha o movimento da boca.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a mandíbula é o osso móvel do crânio, e por isso ela abre e fecha a boca.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M08. Qual é o único osso do crânio que se move?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-01:i1:a",
                  "label": "A maxila",
                  "explanation": "A maxila é fixa: ela segura os dentes de cima e faz parte da face imóvel."
                },
                {
                  "id": "option:rtg-2026:m25:aula-01:i1:b",
                  "label": "O temporal",
                  "explanation": "O temporal é fixo e faz parte da caixa craniana, no lado da cabeça."
                },
                {
                  "id": "option:rtg-2026:m25:aula-01:i1:c",
                  "label": "A mandíbula",
                  "explanation": "Isso: a mandíbula é o osso móvel do crânio, e por isso ela abre e fecha a boca."
                },
                {
                  "id": "option:rtg-2026:m25:aula-01:i1:d",
                  "label": "O occipital",
                  "explanation": "O occipital é fixo e fecha a caixa craniana atrás."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule seis ossos do crânio visto de perfil, com a face voltada para a esquerda, tocando na ficha e no ponto."
            },
            "help": "Percorra a figura de cima para baixo e da frente para trás.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: cada osso ocupa o seu território na lateral, da testa ao queixo.",
              "incorrect": "Algum osso ficou fora do lugar: releia a posição de cada um, do alto da calota até os dentes."
            },
            "payload": {
              "prompt": "Rotule seis ossos do crânio visto de perfil, com a face voltada para a esquerda, tocando na ficha e no ponto.",
              "imageRef": "diagram:cranio-de-perfil-ossos",
              "points": [
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:1",
                  "x": 0.325,
                  "y": 0.242,
                  "where": "na frente do alto, acima do furo do olho",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:2",
                  "x": 0.594,
                  "y": 0.2,
                  "where": "no meio do alto da calota, a área mais larga",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:3",
                  "x": 0.75,
                  "y": 0.6,
                  "where": "na parte de trás, a curva que fecha o crânio",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:4",
                  "x": 0.5,
                  "y": 0.47,
                  "where": "abaixo do alto da calota, junto ao orifício do ouvido",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:4"
                },
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:5",
                  "x": 0.22,
                  "y": 0.63,
                  "where": "abaixo do furo do olho, a peça que segura os dentes de cima",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:5"
                },
                {
                  "id": "point:rtg-2026:m25:aula-01:i2:6",
                  "x": 0.28,
                  "y": 0.85,
                  "where": "embaixo, a peça escura que segura os dentes de baixo",
                  "correctLabelId": "label:rtg-2026:m25:aula-01:i2:6"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:1",
                  "label": "Frontal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:4",
                  "label": "Temporal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:2",
                  "label": "Parietal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:3",
                  "label": "Occipital"
                },
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:5",
                  "label": "Maxila"
                },
                {
                  "id": "label:rtg-2026:m25:aula-01:i2:6",
                  "label": "Mandíbula"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada osso no grupo a que ele pertence."
            },
            "help": "Os ossos da face são os que seguram os dentes, a bochecha e o queixo.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou os ossos que cobrem o cérebro dos que formam a face.",
              "incorrect": "Pergunte de cada osso se ele cobre o cérebro ou forma a bochecha, a mandíbula e a região dos dentes."
            },
            "payload": {
              "prompt": "Classifique cada osso no grupo a que ele pertence.",
              "categories": [
                {
                  "id": "group:rtg-2026:m25:aula-01:i3:a",
                  "label": "Caixa craniana"
                },
                {
                  "id": "group:rtg-2026:m25:aula-01:i3:b",
                  "label": "Face"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:2",
                  "label": "Maxila",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:6",
                  "label": "Mandíbula",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:3",
                  "label": "Temporal",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:1",
                  "label": "Parietal",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:4",
                  "label": "Zigomático",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-01:i3:5",
                  "label": "Esfenoide",
                  "categoryId": "group:rtg-2026:m25:aula-01:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Duda quer apontar os dois ossos que seguram os dentes. Toque nos dois."
            },
            "help": "Procure uma fileira de dentes em cima e outra embaixo.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: a maxila segura os dentes de cima e a mandíbula, os de baixo.",
              "incorrect": "Esses ossos não seguram dentes: procure o osso de cima e o de baixo que têm uma fileira de dentes."
            },
            "payload": {
              "prompt": "Duda quer apontar os dois ossos que seguram os dentes. Toque nos dois.",
              "imageRef": "diagram:cranio-de-perfil-ossos",
              "regions": [
                {
                  "id": "region:rtg-2026:m25:aula-01:i4:1",
                  "label": "Frontal",
                  "x": 0.2625,
                  "y": 0.15,
                  "width": 0.125,
                  "height": 0.1833
                },
                {
                  "id": "region:rtg-2026:m25:aula-01:i4:2",
                  "label": "Maxila",
                  "x": 0.18,
                  "y": 0.57,
                  "width": 0.1,
                  "height": 0.13
                },
                {
                  "id": "region:rtg-2026:m25:aula-01:i4:3",
                  "label": "Occipital",
                  "x": 0.7,
                  "y": 0.57,
                  "width": 0.09,
                  "height": 0.09
                },
                {
                  "id": "region:rtg-2026:m25:aula-01:i4:4",
                  "label": "Mandíbula",
                  "x": 0.2,
                  "y": 0.82,
                  "width": 0.2,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m25:aula-01:i4:5",
                  "label": "Temporal",
                  "x": 0.42,
                  "y": 0.4,
                  "width": 0.16,
                  "height": 0.14
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m25:aula-01:i4:2",
                "region:rtg-2026:m25:aula-01:i4:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Duda monta um crânio de modelo e faz afirmações. Julgue cada uma."
            },
            "help": "Pergunte onde o osso fica na lateral e se ele cobre o cérebro.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou os ossos certos e os trocados no modelo.",
              "incorrect": "Releia o conceito: cada osso tem um lugar e um grupo, e alguns foram trocados."
            },
            "payload": {
              "prompt": "Duda monta um crânio de modelo e faz afirmações. Julgue cada uma.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m25:aula-01:i5:1",
                  "text": "De perfil, o esfenoide aparece pela asa maior, à frente do temporal.",
                  "isTrue": true,
                  "explanation": "Certo: a parte do esfenoide que se vê bem na lateral do crânio é a asa maior, à frente do temporal."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-01:i5:2",
                  "text": "O parietal fica na parte de baixo da lateral, abaixo do temporal.",
                  "isTrue": false,
                  "explanation": "Errado: o parietal forma o alto da lateral, e o temporal fica embaixo dele."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-01:i5:3",
                  "text": "O zigomático, o osso da bochecha, é um osso da face.",
                  "isTrue": true,
                  "explanation": "Certo: o zigomático forma a bochecha e pertence à face, e não à caixa craniana."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-01:i5:4",
                  "text": "A mandíbula é um osso da face e segura os dentes de baixo.",
                  "isTrue": true,
                  "explanation": "Certo: a mandíbula é da face e segura os dentes de baixo."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Sete ossos, dois grupos",
            "body": "Você nomeia os ossos do crânio visto de perfil e separa a caixa craniana da face.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Agora a lateral do crânio tem nome, osso por osso."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m25:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio",
          "source:rtg-2026:m25:r101-cranio",
          "source:rtg-2026:m25:wiki-orbitomeatal"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Linhas e planos da cabeça",
            "body": "Hoje você vai conseguir nomear as linhas e os planos de referência usados para alinhar a cabeça.",
            "dialogue": {
              "setting": "Sala de posicionamento simulada",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "O manequim está com a cabeça meio torta e eu não sei por onde me guiar."
                },
                {
                  "speaker": "caio",
                  "text": "Na cabeça há linhas imaginárias que organizam tudo. Cada uma responde a uma pergunta."
                },
                {
                  "speaker": "pixel",
                  "text": "Quais perguntas? Vamos descobrir linha por linha."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Quatro referências para alinhar a cabeça",
            "body": "A linha orbitomeatal vai do canto externo do olho ao centro do meato acústico externo. A infraorbitomeatal parte da margem inferior da órbita e chega ao mesmo meato. A linha interpupilar liga as duas pupilas. O plano sagital mediano divide a cabeça em direita e esquerda. Segundo a referência, no perfil o plano sagital fica paralelo ao receptor e a interpupilar, perpendicular, o que confere que a cabeça não está inclinada; no PA, a orbitomeatal fica perpendicular. No perfil, a infraorbitomeatal se ajusta flexionando ou estendendo a cabeça.",
            "keyPoints": [
              "Orbitomeatal: do canto externo do olho ao meato.",
              "Infraorbitomeatal: da margem inferior da órbita ao meato.",
              "Interpupilar liga as pupilas; o plano sagital mediano separa direita e esquerda."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Que osso forma a maior parte do alto da lateral da caixa craniana, de perfil?"
            },
            "help": "Ele fica acima do temporal.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o parietal forma a maior parte do alto da lateral.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Que osso forma a maior parte do alto da lateral da caixa craniana, de perfil?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-02:i1:a",
                  "label": "O temporal",
                  "explanation": "O temporal fica abaixo, na parte de baixo da lateral."
                },
                {
                  "id": "option:rtg-2026:m25:aula-02:i1:b",
                  "label": "O occipital",
                  "explanation": "O occipital fica atrás, e não no alto da lateral."
                },
                {
                  "id": "option:rtg-2026:m25:aula-02:i1:c",
                  "label": "O frontal",
                  "explanation": "O frontal forma a testa, na frente."
                },
                {
                  "id": "option:rtg-2026:m25:aula-02:i1:d",
                  "label": "O parietal",
                  "explanation": "Isso: o parietal forma a maior parte do alto da lateral."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule quatro referências da cabeça, tocando na ficha e no ponto. À esquerda está a vista de perfil e à direita, a de frente."
            },
            "help": "As duas linhas do perfil terminam no mesmo ponto; veja de onde cada uma parte.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: duas linhas partem do mesmo meato, uma une as pupilas e um plano divide a cabeça ao meio.",
              "incorrect": "Alguma referência ficou fora do lugar: lembre de onde cada linha parte e o que ela une."
            },
            "payload": {
              "prompt": "Rotule quatro referências da cabeça, tocando na ficha e no ponto. À esquerda está a vista de perfil e à direita, a de frente.",
              "imageRef": "diagram:linhas-do-cranio",
              "points": [
                {
                  "id": "point:rtg-2026:m25:aula-02:i2:1",
                  "x": 0.1438,
                  "y": 0.4825,
                  "where": "no perfil, a mais alta das duas linhas, na ponta da frente",
                  "correctLabelId": "label:rtg-2026:m25:aula-02:i2:1"
                },
                {
                  "id": "point:rtg-2026:m25:aula-02:i2:2",
                  "x": 0.3031,
                  "y": 0.5733,
                  "where": "no perfil, a mais baixa das duas, no trecho de trás",
                  "correctLabelId": "label:rtg-2026:m25:aula-02:i2:2"
                },
                {
                  "id": "point:rtg-2026:m25:aula-02:i2:3",
                  "x": 0.8803,
                  "y": 0.4813,
                  "where": "na vista de frente, a linha horizontal pelas duas órbitas",
                  "correctLabelId": "label:rtg-2026:m25:aula-02:i2:3"
                },
                {
                  "id": "point:rtg-2026:m25:aula-02:i2:4",
                  "x": 0.8038,
                  "y": 0.2083,
                  "where": "na vista de frente, a linha tracejada vertical no alto",
                  "correctLabelId": "label:rtg-2026:m25:aula-02:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m25:aula-02:i2:1",
                  "label": "Linha orbitomeatal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-02:i2:2",
                  "label": "Linha infraorbitomeatal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-02:i2:4",
                  "label": "Plano sagital mediano"
                },
                {
                  "id": "label:rtg-2026:m25:aula-02:i2:5",
                  "label": "Plano coronal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-02:i2:3",
                  "label": "Linha interpupilar"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada referência da cabeça ao que a referência descreve sobre o seu uso."
            },
            "help": "Comece pela referência que liga as pupilas.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada referência ao seu uso no alinhamento.",
              "incorrect": "Releia o conceito: cada referência fica perpendicular, paralela ou ajustada de um jeito próprio."
            },
            "payload": {
              "prompt": "Ligue cada referência da cabeça ao que a referência descreve sobre o seu uso.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m25:aula-02:i3:1",
                  "left": "Linha interpupilar",
                  "right": "No perfil, fica perpendicular ao receptor"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-02:i3:2",
                  "left": "Plano sagital mediano",
                  "right": "No perfil, fica paralelo ao receptor"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-02:i3:3",
                  "left": "Linha orbitomeatal",
                  "right": "No PA, fica perpendicular ao receptor"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-02:i3:4",
                  "left": "Linha infraorbitomeatal",
                  "right": "No perfil, se ajusta flexionando ou estendendo a cabeça"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre as linhas da cabeça."
            },
            "help": "Pense em onde cada linha começa e onde termina.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que cada linha une e o que cada plano divide.",
              "incorrect": "Reveja de onde cada linha parte e onde termina."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre as linhas da cabeça.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m25:aula-02:i4:1",
                  "text": "As linhas orbitomeatal e infraorbitomeatal terminam no mesmo ponto, o meato.",
                  "isTrue": true,
                  "explanation": "Certo: as duas partem de pontos diferentes perto do olho e chegam ao mesmo meato."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-02:i4:2",
                  "text": "A linha interpupilar liga o canto externo do olho ao meato acústico externo.",
                  "isTrue": false,
                  "explanation": "Errado: quem liga o canto externo do olho ao meato é a orbitomeatal; a interpupilar liga as pupilas."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-02:i4:3",
                  "text": "O plano sagital mediano separa a metade direita da metade esquerda da cabeça.",
                  "isTrue": true,
                  "explanation": "Certo: é o plano que divide a cabeça em direita e esquerda."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-02:i4:4",
                  "text": "A linha orbitomeatal parte da margem inferior da órbita.",
                  "isTrue": false,
                  "explanation": "Errado: a que parte da margem inferior da órbita é a infraorbitomeatal; a orbitomeatal parte do canto externo do olho."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Caio alinha a cabeça do manequim para um perfil e pede sua ajuda para conferir."
            },
            "help": "Uma referência confere a inclinação; a outra é o plano que fica paralelo.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: a interpupilar perpendicular confere a inclinação, e o plano sagital mediano fica paralelo ao receptor.",
              "incorrect": "Reveja as duas conferências: no perfil, uma referência fica perpendicular ao receptor e a outra, paralela."
            },
            "payload": {
              "prompt": "Caio alinha a cabeça do manequim para um perfil e pede sua ajuda para conferir.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m25:aula-02:i5:1",
                  "line": "A cabeça do manequim parece inclinada para o ombro. Qual referência eu confiro primeiro?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-02:i5:1a",
                      "label": "O plano sagital mediano, que no perfil fica perpendicular ao receptor.",
                      "reply": "Hum, então olho por esse plano. Vou conferir."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-02:i5:1b",
                      "label": "A linha interpupilar, que no perfil fica perpendicular.",
                      "reply": "Entendi, olho a linha que liga as pupilas."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-02:i5:1c",
                      "label": "A linha orbitomeatal, que no perfil fica perpendicular ao receptor.",
                      "reply": "Tá, então vou pela linha do canto do olho."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-02:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m25:aula-02:i5:2",
                  "line": "Inclinação conferida. E que referência precisa ficar paralela ao receptor no perfil?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-02:i5:2a",
                      "label": "O plano sagital mediano, paralelo ao receptor.",
                      "reply": "Combinado, confiro o plano que divide a cabeça ao meio."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-02:i5:2b",
                      "label": "A linha interpupilar de novo, agora paralela ao receptor.",
                      "reply": "Então eu giro a cabeça até a linha ficar paralela."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-02:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Referências que organizam a cabeça",
            "body": "Você nomeia as linhas e os planos de referência da cabeça e diz de onde cada linha parte e para que ela serve.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quem nomeia as referências alinha a cabeça sem adivinhar."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m25:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:r101-cranio"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "De frente ou de perfil",
            "body": "Hoje você vai conseguir reconhecer se uma radiografia de crânio está de frente ou de perfil e conferir o alinhamento do perfil.",
            "dialogue": {
              "setting": "Sala de revisão de imagens",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Chegou uma radiografia de crânio sem a projeção anotada. Como eu sei se foi de frente ou de lado?"
                },
                {
                  "speaker": "caio",
                  "text": "A própria cabeça conta, se você souber o que procurar."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos achar a pista que muda de uma projeção para a outra."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Pistas de frente e de perfil",
            "body": "De frente, no PA, o crânio aparece simétrico: a linha média fica no centro e as margens laterais das órbitas ficam à mesma distância das bordas do crânio. De perfil, a face fica voltada para um lado e as duas metades se sobrepõem. Para conferir o perfil, olhe dois pares: os tetos das órbitas, o limite de cima de cada olho, sobrepostos indicam cabeça sem inclinação; os ramos da mandíbula sobrepostos indicam cabeça sem rotação. Par duplicado, um ao lado do outro, aponta o erro daquele par. Você descreve o que vê e leva à supervisão, sem interpretar a imagem.",
            "keyPoints": [
              "PA: simétrico, linha média no centro, órbitas à mesma distância das bordas.",
              "Perfil: face voltada para um lado, metades sobrepostas.",
              "Tetos das órbitas sobrepostos: sem inclinação. Ramos da mandíbula sobrepostos: sem rotação."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. No perfil, que referência da cabeça fica paralela ao receptor?"
            },
            "help": "É o plano que divide a cabeça em direita e esquerda.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: no perfil, o plano sagital mediano fica paralelo ao receptor.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. No perfil, que referência da cabeça fica paralela ao receptor?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-03:i1:a",
                  "label": "O plano sagital mediano",
                  "explanation": "Isso: no perfil, o plano sagital mediano fica paralelo ao receptor."
                },
                {
                  "id": "option:rtg-2026:m25:aula-03:i1:b",
                  "label": "A linha interpupilar",
                  "explanation": "No perfil, a interpupilar fica perpendicular ao receptor, e não paralela."
                },
                {
                  "id": "option:rtg-2026:m25:aula-03:i1:c",
                  "label": "A linha orbitomeatal",
                  "explanation": "A orbitomeatal é a que fica perpendicular ao receptor no PA."
                },
                {
                  "id": "option:rtg-2026:m25:aula-03:i1:d",
                  "label": "O plano coronal",
                  "explanation": "O plano coronal não é uma das referências de alinhamento da aula anterior."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-03:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Esta radiografia de crânio está de perfil. Toque na metade da imagem para a qual a face está voltada."
            },
            "help": "Pense para que lado olharia uma pessoa vista de perfil.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: neste perfil a face está voltada para a metade esquerda da imagem.",
              "incorrect": "Procure para onde a face aponta: no perfil a cabeça aparece de lado, com a face voltada para uma das metades."
            },
            "payload": {
              "prompt": "Esta radiografia de crânio está de perfil. Toque na metade da imagem para a qual a face está voltada.",
              "imageRef": "image:rtg-2026:m25:cranio-perfil-01",
              "regions": [
                {
                  "id": "region:rtg-2026:m25:aula-03:i2:1",
                  "label": "Metade esquerda da imagem",
                  "x": 0,
                  "y": 0.04,
                  "width": 0.46,
                  "height": 0.74
                },
                {
                  "id": "region:rtg-2026:m25:aula-03:i2:2",
                  "label": "Metade direita da imagem",
                  "x": 0.54,
                  "y": 0.04,
                  "width": 0.46,
                  "height": 0.74
                },
                {
                  "id": "region:rtg-2026:m25:aula-03:i2:3",
                  "label": "Marcador de lado, canto inferior direito",
                  "x": 0.83,
                  "y": 0.81,
                  "width": 0.16,
                  "height": 0.16
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m25:aula-03:i2:1"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada pista de uma radiografia de crânio na projeção que ela sugere."
            },
            "help": "De lado as metades se sobrepõem; de frente, ficam uma de cada lado do centro.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou as pistas de cada projeção: sobreposição de um lado, simetria do outro.",
              "incorrect": "Pergunte de cada pista se ela mostra metades sobrepostas ou metades simétricas ao redor do centro."
            },
            "payload": {
              "prompt": "Classifique cada pista de uma radiografia de crânio na projeção que ela sugere.",
              "categories": [
                {
                  "id": "group:rtg-2026:m25:aula-03:i3:a",
                  "label": "Crânio de perfil"
                },
                {
                  "id": "group:rtg-2026:m25:aula-03:i3:b",
                  "label": "Crânio de frente (PA)"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m25:aula-03:i3:1",
                  "label": "Face voltada para um lado da imagem",
                  "categoryId": "group:rtg-2026:m25:aula-03:i3:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-03:i3:5",
                  "label": "Ramos da mandíbula um sobre o outro",
                  "categoryId": "group:rtg-2026:m25:aula-03:i3:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-03:i3:4",
                  "label": "Margens laterais das órbitas à mesma distância das bordas",
                  "categoryId": "group:rtg-2026:m25:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-03:i3:2",
                  "label": "Linha média no centro, metades simétricas",
                  "categoryId": "group:rtg-2026:m25:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-03:i3:3",
                  "label": "Duas metades do crânio sobrepostas",
                  "categoryId": "group:rtg-2026:m25:aula-03:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a conferência de um crânio de perfil."
            },
            "help": "Um par confere a inclinação e o outro, a rotação.",
            "type": "true-false",
            "feedback": {
              "correct": "Você ligou cada par sobreposto ao que ele confere.",
              "incorrect": "Releia o conceito: o par das órbitas confere a inclinação e o par da mandíbula, a rotação."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a conferência de um crânio de perfil.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m25:aula-03:i4:1",
                  "text": "Tetos das órbitas sobrepostos indicam cabeça sem inclinação.",
                  "isTrue": true,
                  "explanation": "Certo: com os tetos das órbitas sobrepostos, a cabeça não está inclinada."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-03:i4:2",
                  "text": "Ramos da mandíbula sobrepostos indicam cabeça rodada.",
                  "isTrue": false,
                  "explanation": "Errado: ramos sobrepostos indicam cabeça sem rotação; duplicados, apontam rotação."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-03:i4:3",
                  "text": "Ramos da mandíbula sobrepostos indicam cabeça sem rotação.",
                  "isTrue": true,
                  "explanation": "Certo: ramos da mandíbula sobrepostos indicam que a cabeça não está rodada."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-03:i4:4",
                  "text": "Tetos das órbitas sobrepostos indicam cabeça rodada.",
                  "isTrue": false,
                  "explanation": "Errado: os tetos das órbitas sobrepostos mostram ausência de inclinação, e não rotação."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a descrição de uma imagem de crânio de perfil."
            },
            "help": "Qual par está separado, o das órbitas ou o da mandíbula?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: ramos da mandíbula duplicados apontam rotação, mesmo com as órbitas sobrepostas.",
              "incorrect": "Veja qual par está separado: o da mandíbula confere a rotação, e o das órbitas, a inclinação."
            },
            "payload": {
              "prompt": "Complete a descrição de uma imagem de crânio de perfil.",
              "segments": [
                "Os tetos das órbitas se sobrepõem, mas os ramos da mandíbula aparecem duplicados: a cabeça está ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m25:aula-03:i5:2",
                  "label": "inclinada"
                },
                {
                  "id": "token:rtg-2026:m25:aula-03:i5:3",
                  "label": "elevada"
                },
                {
                  "id": "token:rtg-2026:m25:aula-03:i5:4",
                  "label": "recuada"
                },
                {
                  "id": "token:rtg-2026:m25:aula-03:i5:1",
                  "label": "rodada"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m25:aula-03:i5:1",
                  "correctTokenId": "token:rtg-2026:m25:aula-03:i5:1"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Frente, perfil e alinhamento",
            "body": "Você reconhece uma radiografia de crânio de frente ou de perfil e confere, por descrição, a inclinação e a rotação do perfil.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Descreveu, levou à supervisão: a leitura fica com quem pode ler."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m25:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio",
          "source:rtg-2026:m25:wiki-seios"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Seios da face e órbitas",
            "body": "Hoje você vai conseguir localizar os quatro grupos de seios da face e as órbitas.",
            "dialogue": {
              "setting": "Sala de estudo",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Quando um pedido fala em seios da face, eu nem sei onde olhar."
                },
                {
                  "speaker": "caio",
                  "text": "São quatro grupos, e cada um tem o nome do osso onde mora ou do lugar onde fica."
                },
                {
                  "speaker": "pixel",
                  "text": "Dá para montar o mapa pela posição, da frente para trás."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Quatro grupos de seios",
            "body": "Os seios da face são espaços dentro dos ossos. O seio frontal fica no osso frontal, acima dos olhos e das sobrancelhas. Os etmoidais são várias câmaras pequenas de cada lado do osso etmoide, entre o nariz e a parede de dentro de cada órbita: de frente, ficam entre os olhos. Os maxilares ficam abaixo das órbitas e são os maiores. O esfenoidal fica na linha média, dentro do corpo do esfenoide, atrás dos olhos, e é o mais posterior. A órbita é o encaixe ósseo do olho.",
            "keyPoints": [
              "Frontal, etmoidal, maxilar e esfenoidal.",
              "Frontal acima dos olhos; esfenoidal atrás deles, o mais posterior.",
              "Maxilares: abaixo das órbitas, os maiores."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula 1. Que osso da face segura os dentes de cima?"
            },
            "help": "É o osso de cima, que não se move.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a maxila segura os dentes de cima e leva o nome do seio que fica nela.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula 1. Que osso da face segura os dentes de cima?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-04:i1:a",
                  "label": "O frontal",
                  "explanation": "O frontal forma a testa e é da caixa craniana."
                },
                {
                  "id": "option:rtg-2026:m25:aula-04:i1:b",
                  "label": "A maxila",
                  "explanation": "Isso: a maxila segura os dentes de cima e leva o nome do seio que fica nela."
                },
                {
                  "id": "option:rtg-2026:m25:aula-04:i1:c",
                  "label": "A mandíbula",
                  "explanation": "A mandíbula segura os dentes de baixo."
                },
                {
                  "id": "option:rtg-2026:m25:aula-04:i1:d",
                  "label": "O zigomático",
                  "explanation": "O zigomático forma a bochecha e não segura dentes."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule cinco partes do esquema da face, tocando na ficha e no ponto. À esquerda está a vista de frente e à direita, a de perfil."
            },
            "help": "Comece pelo que fica no alto e acima dos olhos.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: você achou os quatro grupos de seios e o encaixe do olho.",
              "incorrect": "Algum ponto ficou fora do lugar: releia onde cada grupo fica, da frente para trás."
            },
            "payload": {
              "prompt": "Rotule cinco partes do esquema da face, tocando na ficha e no ponto. À esquerda está a vista de frente e à direita, a de perfil.",
              "imageRef": "diagram:seios-da-face",
              "points": [
                {
                  "id": "point:rtg-2026:m25:aula-04:i2:1",
                  "x": 0.25,
                  "y": 0.25,
                  "where": "de frente, o par de lóbulos no alto, acima dos olhos",
                  "correctLabelId": "label:rtg-2026:m25:aula-04:i2:1"
                },
                {
                  "id": "point:rtg-2026:m25:aula-04:i2:2",
                  "x": 0.25,
                  "y": 0.466,
                  "where": "de frente, as câmaras em fileira entre os círculos grandes",
                  "correctLabelId": "label:rtg-2026:m25:aula-04:i2:2"
                },
                {
                  "id": "point:rtg-2026:m25:aula-04:i2:3",
                  "x": 0.131,
                  "y": 0.683,
                  "where": "na vista de frente, a massa à esquerda, sob o círculo grande",
                  "correctLabelId": "label:rtg-2026:m25:aula-04:i2:3"
                },
                {
                  "id": "point:rtg-2026:m25:aula-04:i2:4",
                  "x": 0.8313,
                  "y": 0.479,
                  "where": "no perfil, o bloco cinza sob a curva em U, atrás da fileira",
                  "correctLabelId": "label:rtg-2026:m25:aula-04:i2:4"
                },
                {
                  "id": "point:rtg-2026:m25:aula-04:i2:5",
                  "x": 0.6625,
                  "y": 0.433,
                  "where": "no perfil, o círculo cinza na frente do rosto",
                  "correctLabelId": "label:rtg-2026:m25:aula-04:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m25:aula-04:i2:2",
                  "label": "Seio etmoidal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-04:i2:4",
                  "label": "Seio esfenoidal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-04:i2:3",
                  "label": "Seio maxilar"
                },
                {
                  "id": "label:rtg-2026:m25:aula-04:i2:1",
                  "label": "Seio frontal"
                },
                {
                  "id": "label:rtg-2026:m25:aula-04:i2:5",
                  "label": "Órbita"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Um fica acima das sobrancelhas e o outro, abaixo das órbitas.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o frontal fica acima dos olhos, no osso frontal, e o maxilar, abaixo das órbitas, é o maior.",
              "incorrect": "Pense no grupo que fica no osso da testa e no que fica abaixo das órbitas, o maior dos quatro."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "O seio ",
                " fica acima dos olhos e o seio ",
                " é o maior dos quatro."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m25:aula-04:i3:3",
                  "label": "etmoidal"
                },
                {
                  "id": "token:rtg-2026:m25:aula-04:i3:4",
                  "label": "esfenoidal"
                },
                {
                  "id": "token:rtg-2026:m25:aula-04:i3:2",
                  "label": "maxilar"
                },
                {
                  "id": "token:rtg-2026:m25:aula-04:i3:1",
                  "label": "frontal"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m25:aula-04:i3:1",
                  "correctTokenId": "token:rtg-2026:m25:aula-04:i3:1"
                },
                {
                  "id": "blank:rtg-2026:m25:aula-04:i3:2",
                  "correctTokenId": "token:rtg-2026:m25:aula-04:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre os seios da face."
            },
            "help": "Pense em qual osso e em qual posição cada grupo está.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que é certo do que foi trocado entre os grupos.",
              "incorrect": "Releia o conceito: cada grupo tem um osso, uma posição e um tamanho."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre os seios da face.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m25:aula-04:i4:1",
                  "text": "O seio esfenoidal fica na linha média, dentro do corpo do esfenoide.",
                  "isTrue": true,
                  "explanation": "Certo: ele fica no meio, dentro do corpo do esfenoide, atrás dos olhos."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-04:i4:2",
                  "text": "Os seios maxilares são os menores dos quatro grupos de seios.",
                  "isTrue": false,
                  "explanation": "Errado: os maxilares, abaixo das órbitas, são os maiores dos quatro."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-04:i4:3",
                  "text": "Os seios etmoidais são várias câmaras pequenas de cada lado do etmoide.",
                  "isTrue": true,
                  "explanation": "Certo: o etmoidal é um conjunto de câmaras pequenas, e não uma câmara única."
                },
                {
                  "id": "statement:rtg-2026:m25:aula-04:i4:4",
                  "text": "O seio frontal fica dentro do osso maxilar, abaixo das órbitas.",
                  "isTrue": false,
                  "explanation": "Errado: o seio frontal fica no osso frontal, acima das sobrancelhas."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Um pedido de seios da face fala no maior dos quatro grupos de seios. Duda quer ver onde ele fica: toque num deles na vista de frente."
            },
            "help": "Retome qual dos quatro grupos o conceito chama de maior.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: os maxilares ficam abaixo das órbitas e são os maiores dos quatro grupos.",
              "incorrect": "Esse grupo não é o maior dos quatro: retome qual grupo é o maior e onde ele fica em relação às órbitas."
            },
            "payload": {
              "prompt": "Um pedido de seios da face fala no maior dos quatro grupos de seios. Duda quer ver onde ele fica: toque num deles na vista de frente.",
              "imageRef": "diagram:seios-da-face",
              "regions": [
                {
                  "id": "region:rtg-2026:m25:aula-04:i5:1",
                  "label": "Seio frontal",
                  "x": 0.1938,
                  "y": 0.1667,
                  "width": 0.1125,
                  "height": 0.1667
                },
                {
                  "id": "region:rtg-2026:m25:aula-04:i5:2",
                  "label": "Seio etmoidal",
                  "x": 0.2062,
                  "y": 0.3917,
                  "width": 0.0875,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m25:aula-04:i5:3",
                  "label": "Seio maxilar",
                  "x": 0.0813,
                  "y": 0.6083,
                  "width": 0.1,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m25:aula-04:i5:4",
                  "label": "Seio esfenoidal",
                  "x": 0.7813,
                  "y": 0.425,
                  "width": 0.1,
                  "height": 0.1083
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m25:aula-04:i5:3"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "O mapa dos seios",
            "body": "Você localiza os seios frontal, etmoidal, maxilar e esfenoidal e a órbita num esquema, da frente para trás.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Localizar o seio já ajuda a entender o que o pedido cobre."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m25:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:r101-movel",
          "source:rtg-2026:m25:exam-prep-trauma",
          "source:rtg-2026:m25:pmc-espalhamento-movel"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "O aparelho móvel no leito",
            "body": "Hoje você vai conseguir organizar o exame no leito: quem se afasta, o alinhamento, onde você fica e o aviso antes da exposição.",
            "dialogue": {
              "setting": "Enfermaria simulada",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Jorge",
                  "text": "Com licença, esse aparelho vem até o leito do meu vizinho? Eu não posso sair daqui."
                },
                {
                  "speaker": "caio",
                  "text": "Vem, e sem sala nem parede de proteção. Aqui, a proteção depende da rotina de quem faz o exame."
                },
                {
                  "speaker": "pixel",
                  "text": "Por onde começar quando o exame vai até o paciente?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "No leito, você organiza a proteção",
            "body": "No leito não há sala nem parede de proteção. Primeiro, peça que visitantes e equipe sem função se afastem; quem precisa ficar perto usa a proteção que o serviço define. Quem não pode sair fica o mais longe possível, com o feixe apontado para outro lado. Depois, ponha o detector atrás do paciente e alinhe o tubo. Feche o campo na região pedida. Afaste-se do aparelho e do feixe, com a proteção que o serviço define: cerca de 2 m é uma distância comum, e a regra é do serviço. Por fim, confira que ninguém está no feixe e avise a exposição.",
            "keyPoints": [
              "Afastar quem não precisa ficar; proteger quem não pode sair.",
              "Detector atrás do paciente, alinhado com o tubo.",
              "Conferir que ninguém está no feixe e só então avisar."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M08. No tórax em AP feito no leito, como fica o paciente que não consegue ficar de pé?"
            },
            "help": "Pense no que o paciente consegue fazer e onde ficam as costas.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: sentado o mais ereto que a condição permite, com as costas no receptor.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M08. No tórax em AP feito no leito, como fica o paciente que não consegue ficar de pé?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-05:i1:a",
                  "label": "Deitado de bruços, com o peito encostado no receptor",
                  "explanation": "De bruços o peito ficaria no receptor, como no PA; no AP as costas é que o encostam."
                },
                {
                  "id": "option:rtg-2026:m25:aula-05:i1:b",
                  "label": "De pé, apoiado, com os braços erguidos acima da cabeça",
                  "explanation": "De pé o paciente não consegue ficar; os braços erguidos são do perfil."
                },
                {
                  "id": "option:rtg-2026:m25:aula-05:i1:c",
                  "label": "Sentado o mais ereto possível, com as costas no receptor",
                  "explanation": "Isso: sentado o mais ereto que a condição permite, com as costas no receptor."
                },
                {
                  "id": "option:rtg-2026:m25:aula-05:i1:d",
                  "label": "Deitado de lado, com o feixe cruzando de lado a lado",
                  "explanation": "De lado a lado é o trajeto do perfil, e não do AP."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-05:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Antes da exposição no leito, classifique cada pessoa pelo que o conceito indica."
            },
            "help": "Quem tem função ou não pode sair fica; os demais se afastam.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou quem se afasta de quem fica protegido: o serviço define a proteção de cada um.",
              "incorrect": "Pergunte de cada pessoa se ela tem função ou se não pode sair: só quem fica precisa de proteção."
            },
            "payload": {
              "prompt": "Antes da exposição no leito, classifique cada pessoa pelo que o conceito indica.",
              "categories": [
                {
                  "id": "group:rtg-2026:m25:aula-05:i2:a",
                  "label": "Se afasta da área"
                },
                {
                  "id": "group:rtg-2026:m25:aula-05:i2:b",
                  "label": "Fica, com proteção"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m25:aula-05:i2:2",
                  "label": "Profissional de passagem, sem tarefa no exame",
                  "categoryId": "group:rtg-2026:m25:aula-05:i2:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i2:4",
                  "label": "Paciente do leito vizinho, que não pode sair",
                  "categoryId": "group:rtg-2026:m25:aula-05:i2:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i2:3",
                  "label": "Profissional que precisa ficar perto do leito",
                  "categoryId": "group:rtg-2026:m25:aula-05:i2:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i2:1",
                  "label": "Visitante da família do paciente",
                  "categoryId": "group:rtg-2026:m25:aula-05:i2:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene as etapas do exame no leito, na ordem ensinada nesta aula."
            },
            "help": "O aviso vem depois de conferir que ninguém está no feixe.",
            "type": "ordering",
            "feedback": {
              "correct": "Na ordem: afastar quem sobra, alinhar, fechar o campo, afastar-se e só então avisar a exposição.",
              "incorrect": "Releia o conceito: a conferência e o aviso são os últimos passos, e o campo se fecha antes de você se afastar."
            },
            "payload": {
              "prompt": "Ordene as etapas do exame no leito, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m25:aula-05:i3:2",
                  "label": "Pôr o detector atrás do paciente e alinhar o tubo"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i3:1",
                  "label": "Pedir que visitantes e equipe sem função se afastem"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i3:5",
                  "label": "Conferir que ninguém está no feixe e avisar a exposição"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i3:3",
                  "label": "Fechar o campo na região pedida"
                },
                {
                  "id": "item:rtg-2026:m25:aula-05:i3:4",
                  "label": "Afastar-se do aparelho e do feixe, com proteção"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m25:aula-05:i3:1",
                "item:rtg-2026:m25:aula-05:i3:2",
                "item:rtg-2026:m25:aula-05:i3:3",
                "item:rtg-2026:m25:aula-05:i3:4",
                "item:rtg-2026:m25:aula-05:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Encontre os riscos: Toque em todas as situações de risco que você vê no leito, na hora da exposição."
            },
            "help": "Procure quem está perto do paciente sem necessidade ou na direção para onde o feixe aponta.",
            "type": "risk-hunt",
            "feedback": {
              "correct": "Isso mesmo: você achou quem está perto demais ou no sentido do feixe e deixou de fora o arranjo correto.",
              "incorrect": "Releia a cena: ficou de fora quem está perto demais ou no sentido do feixe, ou uma parte do arranjo correto foi marcada."
            },
            "payload": {
              "prompt": "Toque em todas as situações de risco que você vê no leito, na hora da exposição.",
              "imageRef": "diagram:raio-x-movel-no-leito",
              "regions": [
                {
                  "id": "region:rtg-2026:m25:aula-05:i4:1",
                  "label": "Tubo alinhado com o detector",
                  "x": 0.2825,
                  "y": 0.475,
                  "width": 0.085,
                  "height": 0.1,
                  "explanation": "O tubo aponta para a região pedida e para o detector atrás do paciente: esse é o arranjo esperado, e não um risco."
                },
                {
                  "id": "region:rtg-2026:m25:aula-05:i4:2",
                  "label": "Pessoa sem avental junto à cabeceira",
                  "x": 0.7063,
                  "y": 0.45,
                  "width": 0.0875,
                  "height": 0.4833,
                  "explanation": "Ela está perto do paciente, sem proteção, e o tracejado mostra a radiação espalhada chegando até ela. Sem função no exame, ela se afasta antes da exposição."
                },
                {
                  "id": "region:rtg-2026:m25:aula-05:i4:3",
                  "label": "Operador de avental atrás do aparelho",
                  "x": 0.0437,
                  "y": 0.45,
                  "width": 0.0875,
                  "height": 0.4833,
                  "explanation": "Longe do aparelho e do feixe, com a proteção que o serviço define, é onde o operador fica; cerca de 2 m é comum, e a regra é do serviço."
                },
                {
                  "id": "region:rtg-2026:m25:aula-05:i4:4",
                  "label": "Leito vizinho, no sentido do feixe",
                  "x": 0.8438,
                  "y": 0.6583,
                  "width": 0.15,
                  "height": 0.1667,
                  "explanation": "Quem está no leito vizinho não pode sair: pede-se apoio da equipe, com distância, feixe para outro lado e barreira se o serviço definir."
                },
                {
                  "id": "region:rtg-2026:m25:aula-05:i4:5",
                  "label": "Detector atrás do paciente",
                  "x": 0.5412,
                  "y": 0.5667,
                  "width": 0.08,
                  "height": 0.1667,
                  "explanation": "O detector atrás do paciente, alinhado com o tubo, faz parte do arranjo e não é um risco."
                }
              ],
              "riskRegionIds": [
                "region:rtg-2026:m25:aula-05:i4:2",
                "region:rtg-2026:m25:aula-05:i4:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Seu Jorge está no leito ao lado e a filha dele está junto. Conduza a conversa antes do exame do vizinho."
            },
            "help": "Quem não pode sair e quem não tem função recebem cuidados diferentes.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você explicou o cuidado com quem não pode sair e pediu que quem não precisa ficar se afastasse.",
              "incorrect": "Reveja a conversa: quem não pode sair é protegido com apoio da equipe, e quem não tem função se afasta."
            },
            "payload": {
              "prompt": "Seu Jorge está no leito ao lado e a filha dele está junto. Conduza a conversa antes do exame do vizinho.",
              "speaker": "paciente",
              "name": "Seu Jorge",
              "turns": [
                {
                  "id": "turn:rtg-2026:m25:aula-05:i5:1",
                  "line": "Vão fazer a radiografia do leito ao lado e eu não posso sair daqui. O que muda para mim?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-05:i5:1a",
                      "label": "Fique tranquilo, o feixe nunca chega até o leito do lado, em nenhum caso.",
                      "reply": "Ah, então não preciso me preocupar com nada."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-05:i5:1b",
                      "label": "Peço apoio da equipe: feixe para o outro lado, e o senhor longe.",
                      "reply": "Entendi, então vão cuidar da posição do aparelho."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-05:i5:1c",
                      "label": "O senhor vai receber a mesma coisa que o vizinho, sem diferença alguma.",
                      "reply": "Hum, isso me deixa preocupado, e agora?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-05:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m25:aula-05:i5:2",
                  "line": "Minha filha está aqui comigo. Ela precisa sair também?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-05:i5:2a",
                      "label": "Sim, peço que ela se afaste e aviso quando acabar.",
                      "reply": "Está bem, ela espera lá fora até o aviso."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-05:i5:2b",
                      "label": "Não, ela pode ficar ao seu lado, é só virar de costas para o aparelho.",
                      "reply": "Então ela fica aqui, de costas para o aparelho."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-05:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Do leito ao aviso",
            "body": "Você organiza o exame no leito: afasta quem não precisa ficar, protege quem não pode sair, alinha, fecha o campo, se afasta e avisa antes de expor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Sem sala, a rotina é a sua barreira."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m25:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m25:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m25-v1",
        "sourceIds": [
          "source:rtg-2026:m25:r101-movel",
          "source:rtg-2026:m25:futureradtech-trauma",
          "source:rtg-2026:m25:exam-prep-trauma"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Trauma: a imagem sem mover",
            "body": "Hoje você vai conseguir preparar a imagem com o colar e a prancha no lugar, deixando a equipe no comando.",
            "dialogue": {
              "setting": "Sala de trauma simulada",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Chegou um paciente de trauma, na prancha e com colar cervical. A equipe coordena o cuidado."
                },
                {
                  "speaker": "duda",
                  "text": "Eu ajudo a virar o paciente, para a imagem sair melhor?"
                },
                {
                  "speaker": "caio",
                  "text": "Antes de mexer em qualquer coisa, pergunte quem decide."
                },
                {
                  "speaker": "pixel",
                  "text": "Qual é o seu papel nessa cena, Duda?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Mover o equipamento, e não o paciente",
            "body": "Em trauma, a equipe médica coordena o cuidado e libera quando o paciente pode ser movido. O colar cervical e a prancha ficam no lugar: você não os retira, e a imagem se faz através deles. Em vez de virar o paciente, move-se o equipamento: o tubo fica de um lado, com o feixe na horizontal, e o detector fica em pé do outro, encostado ao ombro. A figura mostra a cena vista pela cabeceira, em corte na altura do pescoço: o anel em volta dele é o colar, sobre a prancha. Antes de expor, avise em voz alta, para quem não precisa ficar se afastar.",
            "keyPoints": [
              "A equipe decide quando mexer no paciente.",
              "Colar e prancha ficam no lugar.",
              "Mova o tubo e o detector, e não o paciente."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula anterior. Como o paciente de um leito vizinho, que não pode sair, é protegido?"
            },
            "help": "Pense em direção do feixe e distância.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: feixe para outro lado e a maior distância possível, com o apoio da equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula anterior. Como o paciente de um leito vizinho, que não pode sair, é protegido?",
              "options": [
                {
                  "id": "option:rtg-2026:m25:aula-06:i1:a",
                  "label": "Ele recebe um aviso e vira de costas para o tubo",
                  "explanation": "Virar de costas não está entre as medidas da aula; o cuidado é de distância e de direção do feixe."
                },
                {
                  "id": "option:rtg-2026:m25:aula-06:i1:b",
                  "label": "O vizinho sai da sala por conta própria, sem apoio",
                  "explanation": "Quem não pode sair não é tirado por conta própria; o cuidado vem da equipe."
                },
                {
                  "id": "option:rtg-2026:m25:aula-06:i1:c",
                  "label": "Nada muda, pois o feixe é pequeno demais para ele",
                  "explanation": "Quem não pode sair precisa de cuidado: o feixe vai para outro lado e ele fica o mais longe possível."
                },
                {
                  "id": "option:rtg-2026:m25:aula-06:i1:d",
                  "label": "Feixe para outro lado e ele o mais longe possível",
                  "explanation": "Isso: feixe para outro lado e a maior distância possível, com o apoio da equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m25:aula-06:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Na figura, a cena é vista pela cabeceira, em corte no pescoço. Toque na parte que recebe o feixe horizontal depois que ele atravessa o pescoço."
            },
            "help": "O feixe sai do tubo; veja o que o espera do outro lado.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: o detector fica em pé, do lado oposto ao tubo, e recebe o feixe horizontal.",
              "incorrect": "Essa parte não recebe o feixe depois do pescoço: procure o que fica em pé, do outro lado do paciente."
            },
            "payload": {
              "prompt": "Na figura, a cena é vista pela cabeceira, em corte no pescoço. Toque na parte que recebe o feixe horizontal depois que ele atravessa o pescoço.",
              "imageRef": "diagram:trauma-raio-horizontal",
              "regions": [
                {
                  "id": "region:rtg-2026:m25:aula-06:i2:1",
                  "label": "Colar cervical",
                  "x": 0.425,
                  "y": 0.3917,
                  "width": 0.15,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m25:aula-06:i2:2",
                  "label": "Tubo",
                  "x": 0.075,
                  "y": 0.4417,
                  "width": 0.125,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m25:aula-06:i2:3",
                  "label": "Feixe horizontal",
                  "x": 0.2562,
                  "y": 0.45,
                  "width": 0.125,
                  "height": 0.0833
                },
                {
                  "id": "region:rtg-2026:m25:aula-06:i2:4",
                  "label": "Detector em pé",
                  "x": 0.6563,
                  "y": 0.2917,
                  "width": 0.0813,
                  "height": 0.3333
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m25:aula-06:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada parte do arranjo de trauma ao que acontece com ela."
            },
            "help": "O que fica parado e o que se move?",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada parte ao seu papel: o paciente fica parado e o equipamento é que se move.",
              "incorrect": "Releia o conceito: colar e prancha ficam no lugar, e o tubo e o detector é que se arranjam."
            },
            "payload": {
              "prompt": "Ligue cada parte do arranjo de trauma ao que acontece com ela.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m25:aula-06:i3:1",
                  "left": "Colar cervical",
                  "right": "Fica no lugar até a equipe decidir"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-06:i3:2",
                  "left": "Prancha",
                  "right": "Continua sob o paciente durante a imagem"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-06:i3:3",
                  "left": "Tubo",
                  "right": "Fica de um lado, com o feixe na horizontal"
                },
                {
                  "id": "pair:rtg-2026:m25:aula-06:i3:4",
                  "left": "Detector em pé",
                  "right": "Fica do lado oposto, recebendo o feixe"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Duda está ansiosa na sala de trauma. Conduza a conversa com cuidado."
            },
            "help": "Em trauma, quem decide mexer no paciente é a equipe.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: colar e posição ficam com a equipe, e você move o equipamento e avisa antes de expor.",
              "incorrect": "Reveja os três pontos: o colar, o paciente e o aviso são decididos com a equipe, e não por conta própria."
            },
            "payload": {
              "prompt": "Duda está ansiosa na sala de trauma. Conduza a conversa com cuidado.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m25:aula-06:i4:1",
                  "line": "O paciente está de colar, e a imagem pode sair melhor sem ele. Eu tiro?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:1a",
                      "label": "Tire só um instante e recoloque logo, antes da exposição.",
                      "reply": "Tá, então tiro rapidinho e já recoloco."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:1b",
                      "label": "Não: o colar fica, e a equipe decide sobre ele.",
                      "reply": "Entendi, o colar fica onde está."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:1c",
                      "label": "Afrouxe um pouco, só para o pescoço aparecer melhor.",
                      "reply": "Ok, então afrouxo só um pouquinho."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-06:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m25:aula-06:i4:2",
                  "line": "E se a posição atrapalhar o detector? Eu viro o paciente um pouco?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:2a",
                      "label": "Viro devagar, só um pouco, e a equipe vê depois, para ganhar tempo.",
                      "reply": "Está bem, viro devagar, então."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:2b",
                      "label": "Peço que ele mesmo ajeite a posição, se ele conseguir fazer isso.",
                      "reply": "Hum, então peço a ele que se mexa."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:2c",
                      "label": "Não viramos: avisamos a equipe e movemos o tubo e o detector.",
                      "reply": "Combinado, chamo a equipe e movo o equipamento."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-06:i4:2c"
                },
                {
                  "id": "turn:rtg-2026:m25:aula-06:i4:3",
                  "line": "E antes de expor, o que a gente faz?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:3a",
                      "label": "Avisamos em voz alta, para sair quem não precisa ficar.",
                      "reply": "Ok, falo em voz alta para a sala toda."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:3b",
                      "label": "Expomos logo, a equipe está em volta de qualquer jeito.",
                      "reply": "Então exponho agora mesmo."
                    },
                    {
                      "id": "option:rtg-2026:m25:aula-06:i4:3c",
                      "label": "Esperamos silêncio total, sem avisar ninguém.",
                      "reply": "Hum, então aguardo todo mundo calar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m25:aula-06:i4:3a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m25:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m25:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada ação de uma sala de trauma: é sua, na simulação supervisionada, ou é da equipe?"
            },
            "help": "Quem decide sobre o corpo do paciente não é o estudante.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que prepara a imagem do que decide sobre o paciente.",
              "incorrect": "Pergunte de cada ação se ela prepara a imagem ou decide sobre o corpo do paciente."
            },
            "payload": {
              "prompt": "Classifique cada ação de uma sala de trauma: é sua, na simulação supervisionada, ou é da equipe?",
              "categories": [
                {
                  "id": "group:rtg-2026:m25:aula-06:i5:a",
                  "label": "Cabe ao estudante"
                },
                {
                  "id": "group:rtg-2026:m25:aula-06:i5:b",
                  "label": "Cabe à equipe"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m25:aula-06:i5:1",
                  "label": "Avisar em voz alta antes da exposição",
                  "categoryId": "group:rtg-2026:m25:aula-06:i5:a"
                },
                {
                  "id": "item:rtg-2026:m25:aula-06:i5:3",
                  "label": "Retirar o colar cervical",
                  "categoryId": "group:rtg-2026:m25:aula-06:i5:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-06:i5:4",
                  "label": "Decidir quando o paciente pode ser movido",
                  "categoryId": "group:rtg-2026:m25:aula-06:i5:b"
                },
                {
                  "id": "item:rtg-2026:m25:aula-06:i5:2",
                  "label": "Preparar o tubo e o detector, com o paciente parado",
                  "categoryId": "group:rtg-2026:m25:aula-06:i5:a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m25:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Imagem sem mover",
            "body": "Você prepara o arranjo de feixe horizontal sem mover o paciente, mantém colar e prancha no lugar e avisa antes de expor, com a equipe no comando.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Em trauma, o paciente fica parado e a equipe, no comando."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m25",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-01"
        ],
        "prompt": "Qual osso forma a parte de trás da caixa craniana, de perfil?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-01:c1:a",
            "label": "O occipital"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c1:b",
            "label": "O frontal"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c1:c",
            "label": "O zigomático"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c1:d",
            "label": "A mandíbula"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-01:c1:a",
        "feedback": {
          "correct": "Isso: o occipital fecha a caixa craniana atrás.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-01"
        ],
        "prompt": "Qual destes ossos pertence à face?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-01:c2:a",
            "label": "O temporal"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c2:b",
            "label": "A maxila"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c2:c",
            "label": "O esfenoide"
          },
          {
            "id": "option:rtg-2026:m25:aula-01:c2:d",
            "label": "O parietal"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-01:c2:b",
        "feedback": {
          "correct": "Isso: a maxila segura os dentes de cima e é da face.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-02"
        ],
        "prompt": "Que linha vai do canto externo do olho ao centro do meato acústico externo?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-02:c1:a",
            "label": "A linha interpupilar"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c1:b",
            "label": "A linha infraorbitomeatal"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c1:c",
            "label": "A linha orbitomeatal"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c1:d",
            "label": "O plano sagital mediano"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-02:c1:c",
        "feedback": {
          "correct": "Isso: ela parte do canto externo do olho e chega ao meato.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-cranio",
          "source:rtg-2026:m25:wiki-orbitomeatal"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-02"
        ],
        "prompt": "Que referência liga as duas pupilas?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-02:c2:a",
            "label": "A linha orbitomeatal"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c2:b",
            "label": "O plano sagital mediano"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c2:c",
            "label": "A linha infraorbitomeatal"
          },
          {
            "id": "option:rtg-2026:m25:aula-02:c2:d",
            "label": "A linha interpupilar"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-02:c2:d",
        "feedback": {
          "correct": "Isso: a interpupilar liga as duas pupilas.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-03"
        ],
        "prompt": "Uma radiografia de crânio mostra as duas metades sobrepostas e a face voltada para um lado. Que projeção ela sugere?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-03:c1:a",
            "label": "De frente, em PA"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c1:b",
            "label": "De perfil, de lado a lado"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c1:c",
            "label": "De frente, com a cabeça rodada"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c1:d",
            "label": "Não dá para dizer sem a anotação"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-03:c1:b",
        "feedback": {
          "correct": "Isso: metades sobrepostas e face de lado sugerem o perfil.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-03"
        ],
        "prompt": "Num perfil descrito, os tetos das órbitas aparecem duplicados, um acima do outro. O que isso indica?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-03:c2:a",
            "label": "Cabeça sem rotação"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c2:b",
            "label": "Cabeça rodada"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c2:c",
            "label": "Cabeça inclinada"
          },
          {
            "id": "option:rtg-2026:m25:aula-03:c2:d",
            "label": "Cabeça sem inclinação"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-03:c2:c",
        "feedback": {
          "correct": "Isso: tetos das órbitas fora de sobreposição apontam inclinação da cabeça.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-04"
        ],
        "prompt": "Qual grupo de seios fica dentro do osso frontal, acima das sobrancelhas?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-04:c1:a",
            "label": "Os seios etmoidais"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c1:b",
            "label": "Os seios maxilares"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c1:c",
            "label": "O seio esfenoidal"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c1:d",
            "label": "O seio frontal"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: o seio frontal fica dentro do osso frontal.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-04"
        ],
        "prompt": "A órbita é o encaixe ósseo de qual estrutura?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-04:c2:a",
            "label": "Do olho"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c2:b",
            "label": "Do ouvido"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c2:c",
            "label": "Do nariz"
          },
          {
            "id": "option:rtg-2026:m25:aula-04:c2:d",
            "label": "Da língua"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-04:c2:a",
        "feedback": {
          "correct": "Isso: a órbita é o encaixe ósseo do olho.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:openstax-ap-cranio"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-05"
        ],
        "prompt": "Antes de expor no leito, o que você confere por último?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-05:c1:a",
            "label": "Que o campo esteja o mais aberto possível"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c1:b",
            "label": "Que o detector esteja ainda na bolsa de transporte"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c1:c",
            "label": "Que ninguém está no feixe, e então avisa"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c1:d",
            "label": "Que os visitantes estejam em volta do leito"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-05:c1:c",
        "feedback": {
          "correct": "Isso: a última conferência é que o feixe esteja livre, e então vem o aviso.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-movel"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-05"
        ],
        "prompt": "Onde o operador fica durante a exposição no leito?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-05:c2:a",
            "label": "Longe do aparelho e fora do feixe"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c2:b",
            "label": "Ao lado do tubo, para ver o campo de perto"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c2:c",
            "label": "Atrás do detector, para segurá-lo no lugar"
          },
          {
            "id": "option:rtg-2026:m25:aula-05:c2:d",
            "label": "Junto à cama, com a mão no ombro do paciente"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-05:c2:a",
        "feedback": {
          "correct": "Isso: longe do aparelho e fora do feixe, com a proteção e a distância que o serviço define.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:r101-movel",
          "source:rtg-2026:m25:pmc-espalhamento-movel"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-06"
        ],
        "prompt": "Em trauma, com colar cervical e prancha, o que você faz com o colar?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-06:c1:a",
            "label": "Retira só durante a exposição e recoloca"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c1:b",
            "label": "Mantém no lugar; a equipe decide se ele sai"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c1:c",
            "label": "Afrouxa para a imagem sair com mais nitidez"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c1:d",
            "label": "Retira se o paciente parecer calmo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-06:c1:b",
        "feedback": {
          "correct": "Isso: o colar fica no lugar e quem decide sobre ele é a equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:futureradtech-trauma",
          "source:rtg-2026:m25:exam-prep-trauma"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m25:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m25:aula-06"
        ],
        "prompt": "Para fazer a imagem sem virar o paciente, como fica o arranjo?",
        "options": [
          {
            "id": "option:rtg-2026:m25:aula-06:c2:a",
            "label": "Paciente virado de lado, tubo sobre ele e detector sob a prancha"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c2:b",
            "label": "Tubo no teto e detector em pé ao lado da cabeça"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c2:c",
            "label": "Paciente de pé, com o detector atrás das costas"
          },
          {
            "id": "option:rtg-2026:m25:aula-06:c2:d",
            "label": "Tubo de um lado, na horizontal, e detector em pé do outro"
          }
        ],
        "correctOptionId": "option:rtg-2026:m25:aula-06:c2:d",
        "feedback": {
          "correct": "Isso: o equipamento é que se arranja em volta do paciente parado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m25:futureradtech-trauma",
          "source:rtg-2026:m25:exam-prep-trauma"
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
      "claimId": "interaction:rtg-2026:m25:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-01:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-01:i2:6",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-01:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-01:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-01:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-01:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-01:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-01:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-01:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-01:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-02:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-02:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-02:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-02:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m25:aula-02:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-02:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-02:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-02:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-02:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-02:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-02:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio",
        "source:rtg-2026:m25:wiki-orbitomeatal"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-03:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-03:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-03:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-03:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-03:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-03:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m25:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "token:rtg-2026:m25:aula-03:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m25:aula-03:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m25:aula-03:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m25:aula-03:i5:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "point:rtg-2026:m25:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-04:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-04:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-04:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-04:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "label:rtg-2026:m25:aula-04:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m25:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m25:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "token:rtg-2026:m25:aula-04:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m25:aula-04:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m25:aula-04:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "token:rtg-2026:m25:aula-04:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-04:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-04:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m25:aula-04:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-04:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-04:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-04:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:openstax-ap-cranio",
        "source:rtg-2026:m25:wiki-seios"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-05:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-05:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-05:i4:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m25:aula-05:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-05:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m25:aula-05:i4:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-05:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:exam-prep-trauma",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:pmc-espalhamento-movel"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-05:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "region:rtg-2026:m25:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m25:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m25:aula-06:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:3a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:3b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:i4:3c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-06:i5:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "group:rtg-2026:m25:aula-06:i5:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-06:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "item:rtg-2026:m25:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m25:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "step:rtg-2026:m25:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:r101-movel",
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m25:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m25:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m25:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m25:futureradtech-trauma",
        "source:rtg-2026:m25:exam-prep-trauma"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m25:aula-01",
        "hook": "Complete a frase: o osso que forma a testa é o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-01"
          ],
          "prompt": "Qual osso forma a testa?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-01:rg:a",
              "label": "O occipital"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rg:b",
              "label": "O temporal"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rg:c",
              "label": "A maxila"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rg:d",
              "label": "O frontal"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-01:rg:d",
          "feedback": {
            "correct": "Isso: o frontal forma a testa, na frente da caixa craniana.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:openstax-ap-cranio"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-01"
          ],
          "prompt": "Caio tira a mandíbula do modelo. Qual osso passa a ser o que segura os dentes que sobraram?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-01:rt:a",
              "label": "O frontal"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rt:b",
              "label": "A maxila"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rt:c",
              "label": "O zigomático"
            },
            {
              "id": "option:rtg-2026:m25:aula-01:rt:d",
              "label": "O parietal"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-01:rt:b",
          "feedback": {
            "correct": "Isso: sem a mandíbula, os dentes de cima, presos à maxila, são os que ficam.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:openstax-ap-cranio"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m25:aula-02",
        "hook": "Complete a frase: o plano que divide a cabeça em direita e esquerda é o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-02"
          ],
          "prompt": "Que plano divide a cabeça em metade direita e metade esquerda?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-02:rg:a",
              "label": "O plano sagital mediano"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rg:b",
              "label": "O plano coronal"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rg:c",
              "label": "O plano axial"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rg:d",
              "label": "A linha interpupilar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-02:rg:a",
          "feedback": {
            "correct": "Isso: o plano sagital mediano separa direita e esquerda.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-cranio"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-02"
          ],
          "prompt": "Caio descreve uma linha que parte da margem inferior da órbita e chega ao meato. De que linha ele fala?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-02:rt:a",
              "label": "Da orbitomeatal"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rt:b",
              "label": "Da interpupilar"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rt:c",
              "label": "Da infraorbitomeatal"
            },
            {
              "id": "option:rtg-2026:m25:aula-02:rt:d",
              "label": "Do plano sagital mediano"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-02:rt:c",
          "feedback": {
            "correct": "Isso: a infraorbitomeatal parte da margem inferior da órbita.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-cranio",
            "source:rtg-2026:m25:wiki-orbitomeatal"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m25:aula-03",
        "hook": "Complete a frase: tetos das órbitas sobrepostos indicam...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-03"
          ],
          "prompt": "Num perfil descrito, os tetos das órbitas aparecem sobrepostos. O que isso indica?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-03:rg:a",
              "label": "Cabeça sem rotação"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rg:b",
              "label": "Cabeça sem inclinação"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rg:c",
              "label": "Cabeça rodada"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rg:d",
              "label": "Cabeça fletida"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-03:rg:b",
          "feedback": {
            "correct": "Isso: tetos das órbitas sobrepostos indicam cabeça sem inclinação.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-cranio"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-03"
          ],
          "prompt": "Chega a descrição de uma imagem: linha média no centro e as duas órbitas simétricas. Que projeção ela sugere?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-03:rt:a",
              "label": "De frente, em PA"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rt:b",
              "label": "De perfil, com a face de lado"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rt:c",
              "label": "De perfil, com a cabeça inclinada"
            },
            {
              "id": "option:rtg-2026:m25:aula-03:rt:d",
              "label": "De perfil, com a cabeça rodada"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-03:rt:a",
          "feedback": {
            "correct": "Isso: linha média no centro e metades simétricas sugerem a vista de frente.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-cranio"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m25:aula-04",
        "hook": "Complete a frase: o seio que fica atrás dos olhos, na linha média, está dentro do osso...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-04"
          ],
          "prompt": "O seio esfenoidal fica dentro de qual osso?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-04:rg:a",
              "label": "Do frontal"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rg:b",
              "label": "Do etmoide"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rg:c",
              "label": "Do esfenoide"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rg:d",
              "label": "Da maxila"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-04:rg:c",
          "feedback": {
            "correct": "Isso: o seio esfenoidal fica dentro do corpo do esfenoide.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:openstax-ap-cranio"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-04"
          ],
          "prompt": "No esquema de frente, as câmaras em fileira, entre as duas órbitas, junto à linha média, são de qual grupo?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-04:rt:a",
              "label": "Etmoidal"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rt:b",
              "label": "Frontal"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rt:c",
              "label": "Maxilar"
            },
            {
              "id": "option:rtg-2026:m25:aula-04:rt:d",
              "label": "Esfenoidal"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-04:rt:a",
          "feedback": {
            "correct": "Isso: as câmaras pequenas em fileira, perto da linha média, são as etmoidais.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:openstax-ap-cranio",
            "source:rtg-2026:m25:wiki-seios"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m25:aula-05",
        "hook": "Complete a frase: quem não precisa ficar perto do leito...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-05"
          ],
          "prompt": "O que você pede aos visitantes antes de expor no leito?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-05:rg:a",
              "label": "Que segurem o detector no lugar"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rg:b",
              "label": "Que se afastem da área durante a exposição"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rg:c",
              "label": "Que fiquem ao lado do tubo"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rg:d",
              "label": "Que se posicionem atrás do detector"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-05:rg:b",
          "feedback": {
            "correct": "Isso: quem não tem função se afasta durante a exposição.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-movel"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-05"
          ],
          "prompt": "No leito ao lado há um paciente que não pode sair. O que o estudante faz?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-05:rt:a",
              "label": "Nada, pois o paciente vizinho não corre risco"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rt:b",
              "label": "Pede que ele se vire de costas para o tubo"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rt:c",
              "label": "Apressa o exame sem avisar a equipe do leito"
            },
            {
              "id": "option:rtg-2026:m25:aula-05:rt:d",
              "label": "Pede apoio da equipe: feixe desviado e ele longe"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-05:rt:d",
          "feedback": {
            "correct": "Isso: o feixe vai para outro lado, ele fica o mais longe possível, e a equipe decide o resto.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:r101-movel"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m25:aula-06",
        "hook": "Complete a frase: quem decide quando o paciente de trauma é movido é...",
        "guided": {
          "id": "recovery-item:rtg-2026:m25:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-06"
          ],
          "prompt": "Quem decide quando o paciente de trauma pode ser movido?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-06:rg:a",
              "label": "O estudante, se o paciente parecer estável"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rg:b",
              "label": "O próprio paciente, se disser que consegue"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rg:c",
              "label": "A equipe que coordena o cuidado"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rg:d",
              "label": "Quem estiver mais perto da prancha"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-06:rg:c",
          "feedback": {
            "correct": "Isso: a equipe decide quando o paciente pode ser movido.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:futureradtech-trauma"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m25:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m25:aula-06"
          ],
          "prompt": "O detector em pé está do lado oposto ao tubo, mas o paciente está pouco fora do alinhamento. O que você move?",
          "options": [
            {
              "id": "option:rtg-2026:m25:aula-06:rt:a",
              "label": "O equipamento, e não o paciente"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rt:b",
              "label": "O paciente, só um pouco"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rt:c",
              "label": "O colar, para ajeitar a cabeça"
            },
            {
              "id": "option:rtg-2026:m25:aula-06:rt:d",
              "label": "A prancha, para alinhar melhor"
            }
          ],
          "correctOptionId": "option:rtg-2026:m25:aula-06:rt:a",
          "feedback": {
            "correct": "Isso: ajusta-se o equipamento, com o paciente parado.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m25:futureradtech-trauma",
            "source:rtg-2026:m25:exam-prep-trauma"
          ]
        }
      }
    ],
    "images": [
      {
        "id": "image:rtg-2026:m25:cranio-perfil-01",
        "file": "radiant-app/assets/content/rtg-2026/imagens/m25/cranio-perfil-01.jpg",
        "sourcePage": "https://commons.wikimedia.org/wiki/File:Lat_lebka.jpg",
        "author": "Tomáš Vendiš",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "retrievedAt": "2026-11-19",
        "sha256Original": "0002971bd3e700d5254ddc9040c83971b99c7c3339d2a3e786ee2d6bdb7a9117",
        "sha256Asset": "8d77dda67135a4a414fb211aa9c4163cd08dd176c762e9412545a96abc255f0c",
        "modification": "redução e conversão para JPEG",
        "alt": "Radiografia de crânio em tons de cinza, em formato quase quadrado, sobre fundo escuro. Há uma letra L no canto inferior direito e um retângulo vazio, apenas com contorno, no canto inferior esquerdo.",
        "width": 1102,
        "height": 1200
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
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "152a04b2ed25fcb69c679d9d60d33129de00104df273ed7c70095d08857d9923"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
