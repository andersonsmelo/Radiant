// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M30: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m30",
  "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18",
  "trackId": "track:rtg-2026:m30",
  "unitId": "unit:rtg-2026:m30",
  "contentVersion": "rtg-2026-m30-v1",
  "competencyIds": [
    "competency:rtg-2026:m30:aula-01",
    "competency:rtg-2026:m30:aula-02",
    "competency:rtg-2026:m30:aula-03",
    "competency:rtg-2026:m30:aula-04",
    "competency:rtg-2026:m30:aula-05",
    "competency:rtg-2026:m30:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m30:radiologyinfo-dexa",
      "title": "Bone Density Scan (DEXA, DXA)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/dexa",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m30:iscd-adult-positions",
      "title": "ISCD Official Positions, Adult",
      "publisher": "International Society for Clinical Densitometry",
      "url": "https://iscd.org/learn/official-positions/adult-positions/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Orientação de uma sociedade profissional; consultada só como referência factual do que se mede, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m30:dxa-practice-guideline-2025",
      "title": "Updated practice guideline for dual-energy X-ray absorptiometry (DXA)",
      "publisher": "Eur J Nucl Med Mol Imaging, via PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11732917/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos, redação própria."
    },
    {
      "id": "source:rtg-2026:m30:dxa-pitfalls-2013",
      "title": "Dual energy X-ray absorptiometry: Pitfalls in measurement and interpretation of bone mineral density",
      "publisher": "Indian J Endocrinol Metab, via PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3683192/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos, redação própria."
    },
    {
      "id": "source:rtg-2026:m30:body-composition-dxa-2017",
      "title": "Body Composition by DXA",
      "publisher": "Bone, via PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5659281",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Manuscrito de acesso aberto; consultado para fatos, redação própria."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m30:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:body-composition-dxa-2017"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Dois feixes, duas energias",
            "body": "Hoje você vai conseguir nomear as peças do densitômetro e explicar por que o feixe tem dois níveis de energia.",
            "dialogue": {
              "setting": "Sala de densitometria",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Aurora",
                  "text": "Vou ficar deitada embaixo daquele braço grande? E por que dizem que são dois feixes?"
                },
                {
                  "speaker": "caio",
                  "text": "O braço passa por cima da senhora, e a outra peça fica sob a mesa. Cada uma tem o seu papel."
                },
                {
                  "speaker": "pixel",
                  "text": "Quem fica onde? E por que o aparelho precisa de dois níveis de energia?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Duas peças e dois níveis de energia",
            "body": "Na densitometria central, a pessoa deita de costas numa mesa acolchoada. Neste esquema, a fonte de raios X fica sob a mesa e o detector, num braço acima dela. O feixe é estreito e tem dois níveis de energia: um é absorvido sobretudo pelo tecido mole e o outro, pelo osso. Com as duas medidas, o programa separa osso de tecido mole. A dose é baixa em comparação com outros exames de raios X. Quem interpreta o resultado é o médico.",
            "keyPoints": [
              "Fonte sob a mesa; detector no braço acima.",
              "Dois níveis: um pega mais tecido mole, o outro, osso.",
              "O programa calcula; o médico interpreta."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M12, você viu quem interpreta o resultado da densitometria. Quem é?"
            },
            "help": "Separe quem produz a medida de quem decide o que ela significa.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o aparelho mede, e o médico interpreta o resultado.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M12, você viu quem interpreta o resultado da densitometria. Quem é?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-01:i1:a",
                  "label": "O tecnólogo que posicionou a pessoa",
                  "explanation": "Posicionar e conferir a técnica é o seu papel; interpretar o resultado, não."
                },
                {
                  "id": "option:rtg-2026:m30:aula-01:i1:b",
                  "label": "A própria pessoa examinada, ao ver a tela",
                  "explanation": "A tela mostra a medida, mas quem interpreta e responde é o médico."
                },
                {
                  "id": "option:rtg-2026:m30:aula-01:i1:c",
                  "label": "O médico, a partir do que o aparelho mediu",
                  "explanation": "Isso: o aparelho mede, e o médico interpreta o resultado."
                },
                {
                  "id": "option:rtg-2026:m30:aula-01:i1:d",
                  "label": "O programa do aparelho, sozinho",
                  "explanation": "O programa calcula a medida, mas não interpreta o caso da pessoa."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as partes do densitômetro, tocando na ficha e no ponto."
            },
            "help": "Comece pelo que está embaixo da mesa e suba até o alto do desenho.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: a fonte fica sob a mesa, a pessoa deitada no meio e o detector no braço acima.",
              "incorrect": "Alguma ficha está fora do lugar: siga o caminho de baixo para cima, da fonte, pela pessoa, até o detector."
            },
            "payload": {
              "prompt": "Rotule as partes do densitômetro, tocando na ficha e no ponto.",
              "imageRef": "diagram:dxa-dois-feixes",
              "points": [
                {
                  "id": "point:rtg-2026:m30:aula-01:i2:1",
                  "x": 0.5217,
                  "y": 0.776,
                  "where": "embaixo, o bloco azul sob o tampo, no meio do desenho",
                  "correctLabelId": "label:rtg-2026:m30:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m30:aula-01:i2:2",
                  "x": 0.5563,
                  "y": 0.2958,
                  "where": "no alto, o bloco azul que fica acima do corpo",
                  "correctLabelId": "label:rtg-2026:m30:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m30:aula-01:i2:3",
                  "x": 0.5422,
                  "y": 0.5125,
                  "where": "as duas linhas finas de cores diferentes, subindo retas",
                  "correctLabelId": "label:rtg-2026:m30:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m30:aula-01:i2:4",
                  "x": 0.3792,
                  "y": 0.413,
                  "where": "a figura deitada de costas, na altura do peito",
                  "correctLabelId": "label:rtg-2026:m30:aula-01:i2:4"
                },
                {
                  "id": "point:rtg-2026:m30:aula-01:i2:5",
                  "x": 0.7537,
                  "y": 0.7622,
                  "where": "a faixa onde o corpo se apoia, na ponta direita do desenho",
                  "correctLabelId": "label:rtg-2026:m30:aula-01:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:3",
                  "label": "Feixe"
                },
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:2",
                  "label": "Braço do detector"
                },
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:6",
                  "label": "Grade antidifusora"
                },
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:4",
                  "label": "Paciente"
                },
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:1",
                  "label": "Fonte de raios X"
                },
                {
                  "id": "label:rtg-2026:m30:aula-01:i2:5",
                  "label": "Mesa"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o feixe e as peças do densitômetro."
            },
            "help": "Pense no que cada nível de energia faz com osso e com tecido mole.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que o aparelho faz do que cabe ao médico.",
              "incorrect": "Releia o conceito: os dois níveis separam osso de tecido mole, e a interpretação é do médico."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o feixe e as peças do densitômetro.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m30:aula-01:i3:1",
                  "text": "Neste esquema, a fonte fica sob a mesa e o detector, no braço acima.",
                  "isTrue": true,
                  "explanation": "Certo: a pessoa fica entre as duas peças, e o feixe a atravessa de baixo para cima."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-01:i3:2",
                  "text": "Os dois níveis de energia servem para medir o osso duas vezes e tirar a média.",
                  "isTrue": false,
                  "explanation": "Errado: o ganho dos dois níveis é separar osso de tecido mole, que absorvem cada nível de um modo; não é repetir a medida."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-01:i3:3",
                  "text": "Um nível é absorvido sobretudo pelo tecido mole e o outro, pelo osso.",
                  "isTrue": true,
                  "explanation": "Certo: essa diferença de absorção é o que o programa usa para separar um do outro."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-01:i3:4",
                  "text": "Com o resultado na tela, o tecnólogo diz à pessoa o que ele significa.",
                  "isTrue": false,
                  "explanation": "Errado: o resultado é interpretado pelo médico; você pode explicar o exame, mas não o que o resultado significa."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O feixe sai de uma peça, atravessa a pessoa e chega a outra. Toque na peça onde ele chega depois de atravessar o corpo."
            },
            "help": "O feixe sobe: depois de atravessar a pessoa, o que vem acima dela?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o feixe sobe pela pessoa e chega ao detector, no alto do braço.",
              "incorrect": "Essa peça não recebe o feixe: ele sai de baixo da mesa, sobe pela pessoa e chega a quem está acima dela."
            },
            "payload": {
              "prompt": "O feixe sai de uma peça, atravessa a pessoa e chega a outra. Toque na peça onde ele chega depois de atravessar o corpo.",
              "imageRef": "diagram:dxa-dois-feixes",
              "regions": [
                {
                  "id": "region:rtg-2026:m30:aula-01:i4:1",
                  "label": "Peça sob o tampo",
                  "x": 0.4875,
                  "y": 0.7021,
                  "width": 0.1094,
                  "height": 0.1104
                },
                {
                  "id": "region:rtg-2026:m30:aula-01:i4:2",
                  "label": "Peça no alto do braço",
                  "x": 0.4734,
                  "y": 0.2271,
                  "width": 0.15,
                  "height": 0.1708
                },
                {
                  "id": "region:rtg-2026:m30:aula-01:i4:3",
                  "label": "Tronco da pessoa",
                  "x": 0.3141,
                  "y": 0.3586,
                  "width": 0.1402,
                  "height": 0.1959
                },
                {
                  "id": "region:rtg-2026:m30:aula-01:i4:4",
                  "label": "Ponta da mesa",
                  "x": 0.6672,
                  "y": 0.6829,
                  "width": 0.1631,
                  "height": 0.1814
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m30:aula-01:i4:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Dona Aurora está tensa com o aparelho. Responda sem prometer o que cabe à equipe ou ao médico."
            },
            "help": "Diga o que o exame faz, sem prometer o que cabe ao médico.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você explicou a função dos dois níveis e deixou a interpretação com o médico.",
              "incorrect": "Reveja as falas: a dose se descreve como baixa em comparação com outros exames, e quem interpreta é o médico."
            },
            "payload": {
              "prompt": "Dona Aurora está tensa com o aparelho. Responda sem prometer o que cabe à equipe ou ao médico.",
              "speaker": "paciente",
              "name": "Dona Aurora",
              "turns": [
                {
                  "id": "turn:rtg-2026:m30:aula-01:i5:1",
                  "line": "Dois níveis de energia... isso quer dizer que vou levar o dobro de radiação?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:1a",
                      "label": "Sim, é o dobro, mas a senhora aguenta bem: é só um exame rápido e sem dor.",
                      "reply": "Hum, então é bastante, né? Fiquei com receio."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:1b",
                      "label": "Separam osso de tecido mole. E a dose é baixa em comparação com outros raios X.",
                      "reply": "Ah, então é para separar as coisas. Isso me tranquiliza um pouco."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:1c",
                      "label": "Não existe radiação nesse aparelho, a senhora pode ficar completamente tranquila.",
                      "reply": "Sem nenhuma radiação? Estranho, achei que tinha."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-01:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m30:aula-01:i5:2",
                  "line": "E quando acabar, o aparelho já me diz se meus ossos estão bem?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:2a",
                      "label": "O aparelho mede; quem interpreta o resultado é o médico.",
                      "reply": "Entendi. Então vou esperar o médico me explicar."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:2b",
                      "label": "Posso olhar a tela com a senhora e explicar o que cada número quer dizer.",
                      "reply": "Que bom, então me explica agora mesmo."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-01:i5:2c",
                      "label": "Sim, a tela já mostra se está tudo bem, é só a senhora aguardar um instante.",
                      "reply": "Então fico esperando a tela me contar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-01:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você conhece o caminho do feixe",
            "body": "Agora você consegue nomear fonte, detector e mesa no esquema e explicar por que o feixe tem dois níveis de energia, deixando a interpretação com o médico.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Quem sabe onde cada peça fica sabe também onde olhar quando algo sair do esperado."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m30:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:iscd-adult-positions",
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Onde se mede",
            "body": "Hoje você vai conseguir localizar as regiões medidas na coluna lombar e no fêmur proximal.",
            "dialogue": {
              "setting": "Sala de análise",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "No esquema há umas caixas desenhadas sobre a coluna e sobre o fêmur. O aparelho mede o osso inteiro?"
                },
                {
                  "speaker": "caio",
                  "text": "Não: ele mede dentro de regiões. Cada região tem um lugar e um nome."
                },
                {
                  "speaker": "pixel",
                  "text": "Onde ficam essas regiões, e como saber de que vértebra é cada caixa?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Medir dentro de regiões",
            "body": "A medida acontece dentro de regiões de interesse. Na coluna lombar, de frente, entram as vértebras L1 a L4, uma caixa em cada. As vértebras se contam de baixo para cima, e a crista ilíaca costuma ficar na altura do espaço entre L4 e L5. No fêmur proximal há a região do colo, a do trocânter e o quadril total, que reúne colo, trocânter e parte do fêmur. A caixa do colo não inclui a região do trocânter. Neste esquema os limites são aproximados; o protocolo do serviço define os reais.",
            "keyPoints": [
              "Coluna: L1 a L4, uma caixa por vértebra.",
              "Fêmur: colo, trocânter e quadril total.",
              "A caixa do colo não inclui o trocânter."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que o programa faz com os dois níveis de energia do feixe?"
            },
            "help": "Lembre o que osso e tecido mole fazem de diferente com cada nível.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a diferença de absorção dos dois níveis permite separar osso de tecido mole.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que o programa faz com os dois níveis de energia do feixe?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-02:i1:a",
                  "label": "Mede o osso duas vezes e tira a média",
                  "explanation": "Os dois níveis não repetem a medida: cada um é absorvido de um modo por osso e tecido mole."
                },
                {
                  "id": "option:rtg-2026:m30:aula-02:i1:b",
                  "label": "Aumenta o contraste da imagem para o médico",
                  "explanation": "O programa não retoca a imagem: ele usa os dois níveis para separar os tecidos."
                },
                {
                  "id": "option:rtg-2026:m30:aula-02:i1:c",
                  "label": "Corrige o movimento da pessoa durante a medida",
                  "explanation": "Movimento não se corrige com os dois níveis; por isso se pede que a pessoa fique imóvel."
                },
                {
                  "id": "option:rtg-2026:m30:aula-02:i1:d",
                  "label": "Separa o osso do tecido mole na medida",
                  "explanation": "Isso: a diferença de absorção dos dois níveis permite separar osso de tecido mole."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule cinco regiões do esquema, tocando na ficha e no ponto. A coluna está à esquerda do desenho e o fêmur, à direita."
            },
            "help": "Na coluna, a primeira caixa de cima é a primeira vértebra medida.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: as caixas da coluna vão de L1, no alto, até L4, e o fêmur tem colo, trocânter e o contorno do quadril total.",
              "incorrect": "Alguma ficha está fora do lugar: na coluna conte de L1 até L4, e no fêmur separe a caixa do colo, a região do trocânter e o contorno tracejado."
            },
            "payload": {
              "prompt": "Rotule cinco regiões do esquema, tocando na ficha e no ponto. A coluna está à esquerda do desenho e o fêmur, à direita.",
              "imageRef": "diagram:dxa-regioes-de-interesse",
              "points": [
                {
                  "id": "point:rtg-2026:m30:aula-02:i2:1",
                  "x": 0.2188,
                  "y": 0.1625,
                  "where": "a caixa mais alta da coluna",
                  "correctLabelId": "label:rtg-2026:m30:aula-02:i2:1"
                },
                {
                  "id": "point:rtg-2026:m30:aula-02:i2:2",
                  "x": 0.2188,
                  "y": 0.5875,
                  "where": "a caixa mais baixa da coluna",
                  "correctLabelId": "label:rtg-2026:m30:aula-02:i2:2"
                },
                {
                  "id": "point:rtg-2026:m30:aula-02:i2:3",
                  "x": 0.7625,
                  "y": 0.3333,
                  "where": "a caixa estreita e inclinada, junto da parte redonda",
                  "correctLabelId": "label:rtg-2026:m30:aula-02:i2:3"
                },
                {
                  "id": "point:rtg-2026:m30:aula-02:i2:4",
                  "x": 0.55,
                  "y": 0.4208,
                  "where": "a região sombreada na saliência de fora do osso",
                  "correctLabelId": "label:rtg-2026:m30:aula-02:i2:4"
                },
                {
                  "id": "point:rtg-2026:m30:aula-02:i2:5",
                  "x": 0.6281,
                  "y": 0.7792,
                  "where": "dentro do contorno tracejado, na haste do osso",
                  "correctLabelId": "label:rtg-2026:m30:aula-02:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:2",
                  "label": "Vértebra L4"
                },
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:4",
                  "label": "Trocânter maior"
                },
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:1",
                  "label": "Vértebra L1"
                },
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:3",
                  "label": "Colo do fêmur"
                },
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:6",
                  "label": "Cabeça do fêmur"
                },
                {
                  "id": "label:rtg-2026:m30:aula-02:i2:5",
                  "label": "Quadril total"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada região à descrição, como no esquema desta aula."
            },
            "help": "Uma das regiões do fêmur é a soma das outras.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada região ao que ela cobre neste esquema.",
              "incorrect": "Reveja o conceito: o quadril total reúne as outras regiões do fêmur, e a caixa do colo deixa o trocânter de fora."
            },
            "payload": {
              "prompt": "Ligue cada região à descrição, como no esquema desta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m30:aula-02:i3:1",
                  "left": "Coluna lombar",
                  "right": "Quatro caixas, uma por vértebra, de L1 a L4"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-02:i3:2",
                  "left": "Colo do fêmur",
                  "right": "Caixa estreita que não inclui o trocânter"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-02:i3:3",
                  "left": "Trocânter",
                  "right": "Região sobre a saliência de fora do fêmur"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-02:i3:4",
                  "left": "Quadril total",
                  "right": "Reúne colo, trocânter e parte do fêmur"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: A caixa do colo do fêmur nunca pode invadir uma região vizinha do próprio fêmur, que tem região própria. Toque nessa região."
            },
            "help": "Pense na saliência do lado de fora do osso, perto do colo.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: a caixa do colo não inclui o trocânter, que tem região própria.",
              "incorrect": "Essa não é a região vizinha do colo: as vértebras e a asa do quadril nem são do fêmur, e o colo é a própria caixa."
            },
            "payload": {
              "prompt": "A caixa do colo do fêmur nunca pode invadir uma região vizinha do próprio fêmur, que tem região própria. Toque nessa região.",
              "imageRef": "diagram:dxa-regioes-de-interesse",
              "regions": [
                {
                  "id": "region:rtg-2026:m30:aula-02:i4:1",
                  "label": "Vértebra L1",
                  "x": 0.1563,
                  "y": 0.1167,
                  "width": 0.125,
                  "height": 0.0917
                },
                {
                  "id": "region:rtg-2026:m30:aula-02:i4:2",
                  "label": "Colo do fêmur",
                  "x": 0.7219,
                  "y": 0.2792,
                  "width": 0.0813,
                  "height": 0.1083
                },
                {
                  "id": "region:rtg-2026:m30:aula-02:i4:3",
                  "label": "Trocânter maior",
                  "x": 0.5062,
                  "y": 0.3417,
                  "width": 0.0875,
                  "height": 0.1583
                },
                {
                  "id": "region:rtg-2026:m30:aula-02:i4:4",
                  "label": "Vértebra L4",
                  "x": 0.1563,
                  "y": 0.5417,
                  "width": 0.125,
                  "height": 0.0917
                },
                {
                  "id": "region:rtg-2026:m30:aula-02:i4:5",
                  "label": "Asa do osso do quadril",
                  "x": 0.325,
                  "y": 0.8,
                  "width": 0.0875,
                  "height": 0.1
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m30:aula-02:i4:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Na bancada, Duda separa fichas de regiões. Coloque cada uma no exame a que pertence."
            },
            "help": "Vértebras e crista ilíaca ficam juntas; colo e trocânter ficam no fêmur.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou as regiões de cada exame.",
              "incorrect": "Pergunte de cada ficha: ela fala de vértebras e de como contá-las, ou de partes do fêmur?"
            },
            "payload": {
              "prompt": "Na bancada, Duda separa fichas de regiões. Coloque cada uma no exame a que pertence.",
              "categories": [
                {
                  "id": "group:rtg-2026:m30:aula-02:i5:a",
                  "label": "Coluna lombar"
                },
                {
                  "id": "group:rtg-2026:m30:aula-02:i5:b",
                  "label": "Fêmur proximal"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m30:aula-02:i5:3",
                  "label": "Referência: crista ilíaca perto de L4 e L5",
                  "categoryId": "group:rtg-2026:m30:aula-02:i5:a"
                },
                {
                  "id": "item:rtg-2026:m30:aula-02:i5:4",
                  "label": "Região do trocânter",
                  "categoryId": "group:rtg-2026:m30:aula-02:i5:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-02:i5:2",
                  "label": "Região do colo",
                  "categoryId": "group:rtg-2026:m30:aula-02:i5:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-02:i5:1",
                  "label": "Quatro caixas, de L1 a L4",
                  "categoryId": "group:rtg-2026:m30:aula-02:i5:a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe onde o aparelho mede",
            "body": "Agora você consegue localizar as caixas da coluna lombar, de L1 a L4, e as regiões do fêmur proximal, sabendo que neste esquema os limites são aproximados.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quando você sabe onde se mede, fica fácil notar quando algo está fora do lugar."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m30:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:iscd-adult-positions",
          "source:rtg-2026:m30:dxa-practice-guideline-2025",
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:dxa-pitfalls-2013"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Posicionar para repetir",
            "body": "Hoje você vai conseguir ordenar o posicionamento do fêmur e dizer para que serve cada apoio.",
            "dialogue": {
              "setting": "Sala de densitometria",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Deitar a pessoa na mesa não basta? Para que tantos apoios?"
                },
                {
                  "speaker": "caio",
                  "text": "Cada apoio tem uma função. E a posição de hoje precisa poder se repetir no exame de daqui a um ano."
                },
                {
                  "speaker": "pixel",
                  "text": "Para que serve cada apoio, e em que ordem a pessoa é posicionada para o fêmur?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada apoio tem um motivo",
            "body": "Para a coluna, a pessoa deita de costas com quadril e joelhos dobrados e as pernas sobre um bloco acolchoado, que aplaina a lombar. A coluna fica reta, no meio da mesa. Para o fêmur, o pé vai a um suporte que gira o quadril para dentro; assim o colo do fêmur fica paralelo à mesa. Neste esquema, uma faixa prende o pé. Na ordem ensinada para o fêmur: deitar a pessoa, centrar o corpo na mesa, pôr o pé no suporte, prender o pé e pedir imobilidade. A exatidão da medida depende da posição correta em todo exame.",
            "keyPoints": [
              "Bloco: aplaina a lombar.",
              "Suporte do pé: gira o quadril para dentro.",
              "A mesma posição se repete a cada exame."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, qual vértebra recebe a caixa mais alta da coluna no esquema?"
            },
            "help": "Lembre onde começa a contagem das caixas.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a primeira caixa, de cima, cobre L1.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, qual vértebra recebe a caixa mais alta da coluna no esquema?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-03:i1:a",
                  "label": "L1",
                  "explanation": "Isso: a primeira caixa, de cima, cobre L1."
                },
                {
                  "id": "option:rtg-2026:m30:aula-03:i1:b",
                  "label": "L2",
                  "explanation": "L2 é a segunda caixa; a mais alta cobre a vértebra anterior a ela."
                },
                {
                  "id": "option:rtg-2026:m30:aula-03:i1:c",
                  "label": "L3",
                  "explanation": "L3 é a terceira caixa, no meio da coluna medida."
                },
                {
                  "id": "option:rtg-2026:m30:aula-03:i1:d",
                  "label": "L5",
                  "explanation": "L5 fica sem caixa no esquema, abaixo da última caixa."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-03:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Na cena da direita, toque no pé que está na posição ensinada para a medida do fêmur."
            },
            "help": "Lembre o que o suporte faz com o pé e, com ele, com o quadril.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: este pé está girado para dentro e preso ao posicionador, como pede a medida do fêmur.",
              "incorrect": "Essa região não é o pé posicionado para o fêmur: procure o pé girado para dentro, preso junto ao posicionador."
            },
            "payload": {
              "prompt": "Na cena da direita, toque no pé que está na posição ensinada para a medida do fêmur.",
              "imageRef": "diagram:dxa-posicionamento",
              "regions": [
                {
                  "id": "region:rtg-2026:m30:aula-03:i2:1",
                  "label": "Coluna reta sobre a mesa",
                  "x": 0.12,
                  "y": 0,
                  "width": 0.22,
                  "height": 0.28
                },
                {
                  "id": "region:rtg-2026:m30:aula-03:i2:2",
                  "label": "Bloco sob as pernas",
                  "x": 0.1719,
                  "y": 0.3604,
                  "width": 0.2141,
                  "height": 0.4292
                },
                {
                  "id": "region:rtg-2026:m30:aula-03:i2:3",
                  "label": "Posicionador entre os pés",
                  "x": 0.6484,
                  "y": 0.7104,
                  "width": 0.1,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m30:aula-03:i2:4",
                  "label": "Pé à esquerda do desenho",
                  "x": 0.5296,
                  "y": 0.5208,
                  "width": 0.08,
                  "height": 0.125
                },
                {
                  "id": "region:rtg-2026:m30:aula-03:i2:5",
                  "label": "Pé à direita do desenho",
                  "x": 0.7522,
                  "y": 0.4813,
                  "width": 0.08,
                  "height": 0.1396
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m30:aula-03:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, ordene o posicionamento do fêmur."
            },
            "help": "Primeiro o corpo todo, depois o pé, e por último o pedido de imobilidade.",
            "type": "ordering",
            "feedback": {
              "correct": "Você seguiu a ordem ensinada, do corpo na mesa até a imobilidade.",
              "incorrect": "Retome a ordem: primeiro o corpo na mesa, depois o pé no suporte e preso, e só então a imobilidade."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, ordene o posicionamento do fêmur.",
              "items": [
                {
                  "id": "item:rtg-2026:m30:aula-03:i3:1",
                  "label": "Deitar a pessoa de costas na mesa"
                },
                {
                  "id": "item:rtg-2026:m30:aula-03:i3:4",
                  "label": "Prender o pé na posição"
                },
                {
                  "id": "item:rtg-2026:m30:aula-03:i3:3",
                  "label": "Pôr o pé no suporte, virado para dentro"
                },
                {
                  "id": "item:rtg-2026:m30:aula-03:i3:2",
                  "label": "Centrar o corpo na mesa"
                },
                {
                  "id": "item:rtg-2026:m30:aula-03:i3:5",
                  "label": "Pedir que a pessoa fique imóvel"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m30:aula-03:i3:1",
                "item:rtg-2026:m30:aula-03:i3:2",
                "item:rtg-2026:m30:aula-03:i3:3",
                "item:rtg-2026:m30:aula-03:i3:4",
                "item:rtg-2026:m30:aula-03:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada apoio ou cuidado ao que ele faz."
            },
            "help": "Separe o que age na coluna do que age no fêmur.",
            "type": "matching",
            "feedback": {
              "correct": "Cada apoio ficou ligado ao que ele faz.",
              "incorrect": "Reveja o conceito: o bloco trata da curva lombar, e o suporte do pé, da rotação do fêmur."
            },
            "payload": {
              "prompt": "Ligue cada apoio ou cuidado ao que ele faz.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m30:aula-03:i4:1",
                  "left": "Bloco sob as pernas",
                  "right": "Reduz a curva da região lombar"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-03:i4:2",
                  "left": "Suporte que gira o pé",
                  "right": "Deixa o colo do fêmur paralelo à mesa"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-03:i4:3",
                  "left": "Coluna reta, no meio da mesa",
                  "right": "Evita coluna girada na imagem"
                },
                {
                  "id": "pair:rtg-2026:m30:aula-03:i4:4",
                  "left": "Faixa no pé, neste esquema",
                  "right": "Mantém o pé na posição virada"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Dona Beatriz sente o bloco incômodo nos joelhos e hesita. Conduza a conversa dentro do seu papel."
            },
            "help": "Diante de desconforto, o que você ouve e a quem você leva a decisão?",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você parou, ouviu e levou a decisão à equipe.",
              "incorrect": "Reveja as falas: ajustar apoio cabe à equipe, e o relato da pessoa vai para o registro."
            },
            "payload": {
              "prompt": "Dona Beatriz sente o bloco incômodo nos joelhos e hesita. Conduza a conversa dentro do seu papel.",
              "speaker": "paciente",
              "name": "Dona Beatriz",
              "turns": [
                {
                  "id": "turn:rtg-2026:m30:aula-03:i5:1",
                  "line": "O bloco está apertando atrás dos meus joelhos. Dá para tirar e esticar as pernas?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:1a",
                      "label": "Dá, esticar as pernas é mais confortável, e a medida sai igual do mesmo jeito.",
                      "reply": "Ótimo, então pode tirar o bloco logo."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:1b",
                      "label": "Vou parar um instante, ouvir onde incomoda e chamar a equipe para decidir.",
                      "reply": "Obrigada. Não quero atrapalhar o exame."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:1c",
                      "label": "Aguente só mais um pouco, o bloco precisa ficar para a medida valer.",
                      "reply": "Está bem... vou tentar aguentar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-03:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m30:aula-03:i5:2",
                  "line": "E a faixa do pé também aperta. Posso soltar eu mesma?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:2a",
                      "label": "Pode soltar, a senhora sabe melhor do que ninguém o que é confortável para o pé.",
                      "reply": "Beleza, solto agora e pronto."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:2b",
                      "label": "Deixe a faixa, é só mais um minuto, depois a senhora relaxa e a medida sai.",
                      "reply": "Tá bom, aguento mais um pouco."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-03:i5:2c",
                      "label": "Prefiro que espere: a equipe decide se ajusta, e eu registro o relato.",
                      "reply": "Está bem, espero a equipe chegar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-03:i5:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe o porquê de cada apoio",
            "body": "Agora você consegue ordenar o posicionamento do fêmur e dizer o que o bloco, o suporte e a faixa fazem, lembrando que a mesma posição precisa se repetir a cada exame.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Posição não é capricho: é o que deixa o exame de hoje conversar com o de amanhã."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m30:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:dxa-practice-guideline-2025",
          "source:rtg-2026:m30:dxa-pitfalls-2013"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "O que estraga a medida",
            "body": "Hoje você vai conseguir achar na imagem o que não deveria estar lá e dizer a quem avisar.",
            "dialogue": {
              "setting": "Sala de análise",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A imagem da coluna saiu com um ponto muito branco sobre uma vértebra. Eu apago ou repito?"
                },
                {
                  "speaker": "caio",
                  "text": "Nenhuma das duas. Primeiro olhe a imagem inteira e descreva o que vê."
                },
                {
                  "speaker": "pixel",
                  "text": "O que não deveria estar na imagem? E a quem você conta?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Descrever, não corrigir",
            "body": "Na imagem da coluna, confira o que não é osso e o que não está no lugar. Metal, como um zíper, um botão ou uma joia, pode alterar a medida. A coluna deve ficar reta, com os processos espinhosos no meio da imagem. A caixa de cada região deve cobrir a vértebra. Antes de deitar a pessoa, roupa sem metal e sem joias ajuda. Retirar o objeto, excluir uma vértebra ou repetir a aquisição é decisão da equipe. Você descreve o que vê e avisa.",
            "keyPoints": [
              "Metal, coluna torta ou caixa fora da vértebra: descreva.",
              "Quem corrige, exclui ou repete é a equipe.",
              "Roupa sem metal e sem joias, antes de deitar."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, que apoio gira o quadril para dentro na medida do fêmur?"
            },
            "help": "Pense no apoio em que o pé fica preso.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o suporte gira o pé e, com ele, o quadril para dentro.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, que apoio gira o quadril para dentro na medida do fêmur?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-04:i1:a",
                  "label": "O bloco sob as pernas",
                  "explanation": "O bloco age na coluna, aplainando a lombar."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i1:b",
                  "label": "O suporte em que o pé é preso",
                  "explanation": "Isso: o suporte gira o pé e, com ele, o quadril para dentro."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i1:c",
                  "label": "A faixa da cintura",
                  "explanation": "Não há faixa de cintura nesse esquema: a faixa prende o pé."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i1:d",
                  "label": "O tampo acolchoado da mesa",
                  "explanation": "O tampo só sustenta a pessoa e não gira o quadril."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Encontre os riscos: Na imagem esquemática da coluna, toque em tudo que pode estragar a medida."
            },
            "help": "Procure o que não é osso e o que não está sobre a vértebra.",
            "type": "risk-hunt",
            "feedback": {
              "correct": "Isso mesmo: o metal, o zíper e a caixa fora do lugar podem estragar a medida, e a asa do osso e a caixa certa, não.",
              "incorrect": "Reveja a imagem: falta marcar algo que interfere, ou foi marcada uma parte que está certa."
            },
            "payload": {
              "prompt": "Na imagem esquemática da coluna, toque em tudo que pode estragar a medida.",
              "imageRef": "diagram:dxa-interferencias",
              "regions": [
                {
                  "id": "region:rtg-2026:m30:aula-04:i2:1",
                  "label": "Asa do quadril, à esquerda do desenho",
                  "x": 0.2062,
                  "y": 0.6667,
                  "width": 0.0875,
                  "height": 0.1,
                  "explanation": "A asa do osso do quadril é anatomia, e não interferência: ela serve de referência para contar as vértebras."
                },
                {
                  "id": "region:rtg-2026:m30:aula-04:i2:2",
                  "label": "Ponto muito claro sobre uma vértebra",
                  "x": 0.4156,
                  "y": 0.3625,
                  "width": 0.0813,
                  "height": 0.1,
                  "explanation": "Um ponto muito claro sobre a vértebra pode ser metal e alterar a medida: você descreve onde está e avisa a equipe."
                },
                {
                  "id": "region:rtg-2026:m30:aula-04:i2:3",
                  "label": "Caixa sobre meia vértebra e o disco",
                  "x": 0.375,
                  "y": 0.625,
                  "width": 0.1437,
                  "height": 0.1,
                  "explanation": "Neste esquema a caixa cobre meia vértebra e o disco: a região medida não é a vértebra. Você descreve, e a equipe corrige."
                },
                {
                  "id": "region:rtg-2026:m30:aula-04:i2:4",
                  "label": "Caixa sobre uma vértebra, no alto",
                  "x": 0.325,
                  "y": 0.0583,
                  "width": 0.1437,
                  "height": 0.125,
                  "explanation": "Esta caixa cobre a vértebra, de disco a disco: está no lugar e não é problema."
                },
                {
                  "id": "region:rtg-2026:m30:aula-04:i2:5",
                  "label": "Linha de dentes ao lado da coluna",
                  "x": 0.7781,
                  "y": 0.4167,
                  "width": 0.0813,
                  "height": 0.1667,
                  "explanation": "O zíper é metal que não deveria estar na imagem: zíperes estão entre os objetos que interferem. Você descreve e avisa; a equipe avalia."
                }
              ],
              "riskRegionIds": [
                "region:rtg-2026:m30:aula-04:i2:2",
                "region:rtg-2026:m30:aula-04:i2:3",
                "region:rtg-2026:m30:aula-04:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as atitudes certas ao ver um ponto muito claro sobre uma vértebra."
            },
            "help": "O que é seu fazer, e o que é da equipe decidir?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você descreveu, avisou e registrou, sem decidir pela equipe.",
              "incorrect": "Releia o conceito: você descreve, avisa e registra; apagar, excluir e esperar não são o seu papel."
            },
            "payload": {
              "prompt": "Marque todas as atitudes certas ao ver um ponto muito claro sobre uma vértebra.",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:a",
                  "label": "Apagar o ponto da imagem antes de mostrar à equipe",
                  "explanation": "Apagar esconde o problema: a equipe precisa ver a imagem como ela saiu."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:b",
                  "label": "Descrever onde o ponto está e como ele parece",
                  "explanation": "Descrever com precisão ajuda a equipe a entender o que aconteceu."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:c",
                  "label": "Excluir a vértebra do cálculo por conta própria",
                  "explanation": "Excluir uma vértebra é decisão da equipe, e não do estudante."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:d",
                  "label": "Avisar a equipe antes de qualquer outra ação",
                  "explanation": "O aviso vem primeiro: a equipe decide o que fazer com a imagem."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:e",
                  "label": "Esperar o fim do turno para comentar o ponto",
                  "explanation": "Esperar deixa a pessoa e a imagem sem decisão: o aviso é imediato."
                },
                {
                  "id": "option:rtg-2026:m30:aula-04:i3:f",
                  "label": "Registrar o que foi visto e o que foi dito à equipe",
                  "explanation": "O registro deixa claro o que foi observado e a quem foi comunicado."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m30:aula-04:i3:b",
                "option:rtg-2026:m30:aula-04:i3:d",
                "option:rtg-2026:m30:aula-04:i3:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada cuidado conforme o momento em que ele aparece."
            },
            "help": "Roupa e joias se conferem antes; o resto aparece na imagem.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que se previne do que se vê depois.",
              "incorrect": "Pergunte de cada cuidado: dá para evitar com a pessoa ainda vestida, ou só aparece olhando a imagem?"
            },
            "payload": {
              "prompt": "Classifique cada cuidado conforme o momento em que ele aparece.",
              "categories": [
                {
                  "id": "group:rtg-2026:m30:aula-04:i4:a",
                  "label": "Antes de deitar a pessoa"
                },
                {
                  "id": "group:rtg-2026:m30:aula-04:i4:b",
                  "label": "Na imagem já feita"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m30:aula-04:i4:5",
                  "label": "Ver a coluna inclinada em relação ao eixo",
                  "categoryId": "group:rtg-2026:m30:aula-04:i4:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-04:i4:3",
                  "label": "Conferir se a roupa tem zíper ou botão de metal",
                  "categoryId": "group:rtg-2026:m30:aula-04:i4:a"
                },
                {
                  "id": "item:rtg-2026:m30:aula-04:i4:1",
                  "label": "Pedir que tire joias e objetos de metal",
                  "categoryId": "group:rtg-2026:m30:aula-04:i4:a"
                },
                {
                  "id": "item:rtg-2026:m30:aula-04:i4:2",
                  "label": "Notar um ponto muito claro sobre a vértebra",
                  "categoryId": "group:rtg-2026:m30:aula-04:i4:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-04:i4:4",
                  "label": "Ver a caixa fora da vértebra",
                  "categoryId": "group:rtg-2026:m30:aula-04:i4:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Na imagem do fêmur de Dona Zélia, Duda vê uma linha de dentes claros ao lado do osso. Julgue cada afirmação dela."
            },
            "help": "O que o estudante faz, e o que fica com a equipe?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve o seu papel: descrever e avisar.",
              "incorrect": "Releia o conceito: retirar, excluir ou repetir é decisão da equipe."
            },
            "payload": {
              "prompt": "Na imagem do fêmur de Dona Zélia, Duda vê uma linha de dentes claros ao lado do osso. Julgue cada afirmação dela.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m30:aula-04:i5:1",
                  "text": "Uma linha de dentes de zíper na imagem pode interferir na medida.",
                  "isTrue": true,
                  "explanation": "Certo: zíper de metal está entre os objetos que interferem; a equipe avalia o efeito."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-04:i5:2",
                  "text": "Posso excluir a região do fêmur do cálculo por conta própria.",
                  "isTrue": false,
                  "explanation": "Errado: excluir uma região é decisão da equipe, e não do estudante."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-04:i5:3",
                  "text": "Descrevo a linha e aviso a equipe, que decide o que fazer.",
                  "isTrue": true,
                  "explanation": "Certo: você descreve e avisa, e a equipe decide a correção."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-04:i5:4",
                  "text": "Posso repetir a aquisição agora, sem falar com ninguém.",
                  "isTrue": false,
                  "explanation": "Errado: repetir é nova exposição e decisão da equipe, depois do seu aviso."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você acha o que não deveria estar lá",
            "body": "Agora você consegue achar metal, zíper, coluna torta e caixa fora do lugar num esquema de imagem e dizer o que fazer: descrever e avisar a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quem descreve com clareza poupa tempo da equipe e protege a medida."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m30:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:dxa-pitfalls-2013",
          "source:rtg-2026:m30:body-composition-dxa-2017",
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Corpo inteiro e composição",
            "body": "Hoje você vai conseguir dizer em que componentes e regiões o exame de corpo inteiro divide o corpo.",
            "dialogue": {
              "setting": "Sala de densitometria",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Lauro",
                  "text": "Disseram que desta vez o exame é do corpo todo. Vão olhar só os ossos?"
                },
                {
                  "speaker": "caio",
                  "text": "O exame abrange o corpo todo e separa o que há nele em partes. Cada parte tem nome."
                },
                {
                  "speaker": "pixel",
                  "text": "Quais são essas partes? E como o corpo é dividido em regiões?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Três componentes, quatro regiões",
            "body": "O exame de corpo inteiro abrange o corpo todo e separa três componentes: osso, massa magra e gordura. Linhas de corte dividem o corpo em cabeça, braços, tronco e pernas, e cada região recebe os três valores. Na figura, as três faixas são só legenda de cor, sem proporção. O laudo traz a massa magra total e a massa de gordura total. A posição de braços e pernas segue o que o serviço define.",
            "keyPoints": [
              "Três componentes: osso, massa magra e gordura.",
              "Regiões: cabeça, braços, tronco e pernas."
            ],
            "visual": "corpo-inteiro-composicao"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que um objeto de metal sobre a vértebra pode fazer com a medida?"
            },
            "help": "Lembre a lista de interferências da aula anterior.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: metal pode alterar a medida, e você descreve e avisa.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que um objeto de metal sobre a vértebra pode fazer com a medida?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-05:i1:a",
                  "label": "Melhorar a nitidez da imagem da coluna",
                  "explanation": "Metal não melhora a imagem: ele é uma interferência."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i1:b",
                  "label": "Aproximar a caixa da região da vértebra",
                  "explanation": "O metal não move a caixa; ele soma outra coisa à imagem."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i1:c",
                  "label": "Alterar a medida, e por isso se avisa a equipe",
                  "explanation": "Isso: metal pode alterar a medida, e você descreve e avisa."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i1:d",
                  "label": "Nada, porque só o osso aparece na imagem",
                  "explanation": "Objetos densos também aparecem na imagem e podem interferir."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-05:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as quatro regiões em que o exame divide o corpo, tocando na ficha e no ponto."
            },
            "help": "Comece pelo alto do desenho e desça seguindo as linhas.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: as linhas de corte separam cabeça, tronco, braços e pernas.",
              "incorrect": "Alguma ficha está fora do lugar: siga as linhas de corte, da linha do queixo até o V entre as pernas."
            },
            "payload": {
              "prompt": "Rotule as quatro regiões em que o exame divide o corpo, tocando na ficha e no ponto.",
              "imageRef": "diagram:corpo-inteiro-composicao",
              "points": [
                {
                  "id": "point:rtg-2026:m30:aula-05:i2:1",
                  "x": 0.3438,
                  "y": 0.1167,
                  "where": "no alto, a forma redonda acima da linha do queixo",
                  "correctLabelId": "label:rtg-2026:m30:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m30:aula-05:i2:2",
                  "x": 0.3438,
                  "y": 0.3458,
                  "where": "no meio do desenho, entre as duas linhas dos ombros",
                  "correctLabelId": "label:rtg-2026:m30:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m30:aula-05:i2:3",
                  "x": 0.2219,
                  "y": 0.5708,
                  "where": "à esquerda do desenho, a forma comprida solta do corpo",
                  "correctLabelId": "label:rtg-2026:m30:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m30:aula-05:i2:4",
                  "x": 0.3062,
                  "y": 0.829,
                  "where": "embaixo, a forma comprida abaixo do V",
                  "correctLabelId": "label:rtg-2026:m30:aula-05:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m30:aula-05:i2:1",
                  "label": "Cabeça"
                },
                {
                  "id": "label:rtg-2026:m30:aula-05:i2:4",
                  "label": "Perna"
                },
                {
                  "id": "label:rtg-2026:m30:aula-05:i2:2",
                  "label": "Tronco"
                },
                {
                  "id": "label:rtg-2026:m30:aula-05:i2:5",
                  "label": "Pescoço"
                },
                {
                  "id": "label:rtg-2026:m30:aula-05:i2:3",
                  "label": "Braço"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Separe o que é componente do corpo e o que é região do corpo."
            },
            "help": "Região é um lugar do corpo; componente é um material.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou do que o corpo é feito do lugar onde ele está.",
              "incorrect": "Pergunte de cada ficha: ela diz do que o corpo é feito, ou em que parte do corpo se mede?"
            },
            "payload": {
              "prompt": "Separe o que é componente do corpo e o que é região do corpo.",
              "categories": [
                {
                  "id": "group:rtg-2026:m30:aula-05:i3:a",
                  "label": "Componente"
                },
                {
                  "id": "group:rtg-2026:m30:aula-05:i3:b",
                  "label": "Região"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:2",
                  "label": "Pernas",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:5",
                  "label": "Osso",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:a"
                },
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:1",
                  "label": "Massa magra",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:a"
                },
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:4",
                  "label": "Tronco",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:6",
                  "label": "Cabeça",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m30:aula-05:i3:3",
                  "label": "Gordura",
                  "categoryId": "group:rtg-2026:m30:aula-05:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a figura e o exame."
            },
            "help": "As faixas da figura medem alguma coisa ou só dão cor aos componentes?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que a figura mostra do que ela só ilustra.",
              "incorrect": "Releia o conceito: as faixas são só legenda de cor, e o exame abrange o corpo todo."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a figura e o exame.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m30:aula-05:i4:1",
                  "text": "O exame separa o corpo em osso, massa magra e gordura.",
                  "isTrue": true,
                  "explanation": "Certo: são os três componentes que o exame separa."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-05:i4:2",
                  "text": "As três faixas mostram quanto de cada componente a pessoa tem.",
                  "isTrue": false,
                  "explanation": "Errado: as faixas têm a mesma altura; são legenda de cor, e não proporção medida."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-05:i4:3",
                  "text": "Cada região, como as pernas, recebe os três valores.",
                  "isTrue": true,
                  "explanation": "Certo: cada região é avaliada para osso, massa magra e gordura."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-05:i4:4",
                  "text": "O exame de corpo inteiro mede só a coluna e o quadril.",
                  "isTrue": false,
                  "explanation": "Errado: o exame abrange o corpo todo, e não só os locais da coluna e do fêmur."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante da sugestão de Duda?"
            },
            "help": "Quem define o padrão de posição dos braços e das pernas?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: a posição de braços, mãos, pernas e pés segue o que o serviço define.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Lauro, paciente simulado, está com os braços cruzados sobre o peito, e a mesa é estreita. Duda quer deixá-los assim para caber e diz que a posição dos braços não faz diferença. O pedido é de corpo inteiro.",
              "prompt": "O que você faz diante da sugestão de Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-05:i5:a",
                  "label": "Deixar os braços assim, pois a posição não faz diferença",
                  "explanation": "A posição de braços e pernas segue o padrão do serviço, então ela importa."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i5:b",
                  "label": "Perguntar à equipe qual posição de braços o serviço define",
                  "explanation": "Isso: a posição de braços, mãos, pernas e pés segue o que o serviço define."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i5:c",
                  "label": "Pedir que ele afaste os braços o máximo que conseguir",
                  "explanation": "Afastar ao máximo é decisão sua, e não o que o serviço definiu."
                },
                {
                  "id": "option:rtg-2026:m30:aula-05:i5:d",
                  "label": "Trocar o exame de corpo inteiro pelo da coluna",
                  "explanation": "Trocar o exame não é decisão do estudante, e o pedido continua sendo de corpo inteiro."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-05:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você separa o corpo em componentes e regiões",
            "body": "Agora você consegue dizer que o exame de corpo inteiro separa osso, massa magra e gordura, por cabeça, braços, tronco e pernas, e que as faixas da figura são só legenda de cor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Quando alguém perguntar o que o exame faz, você já tem as três palavras e as quatro regiões."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m30:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m30:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m30-v1",
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:dxa-practice-guideline-2025",
          "source:rtg-2026:m30:iscd-adult-positions"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Comparar com o exame anterior",
            "body": "Hoje você vai conseguir dizer o que precisa se repetir para dois exames serem comparáveis.",
            "dialogue": {
              "setting": "Recepção do setor",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Heitor",
                  "text": "Trouxe o exame do ano passado. Vão medir igualzinho, para o médico poder comparar?"
                },
                {
                  "speaker": "caio",
                  "text": "Quem compara é o médico. A nossa parte é medir de um jeito que possa ser comparado."
                },
                {
                  "speaker": "pixel",
                  "text": "O que precisa se repetir de um exame para o outro?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Repetir para poder comparar",
            "body": "Para o médico comparar dois exames, a medida precisa se repetir: a mesma região, o mesmo lado, a mesma posição e as mesmas caixas. Na figura, o bloco sob as pernas e o pé virado para dentro, preso ao suporte, são posições a repetir. As caixas das regiões do quadril são replicadas de um exame para o outro. Qual lado ou região medir, o protocolo do serviço define; na dúvida, você leva à equipe.",
            "keyPoints": [
              "Mesma região, mesmo lado, mesma posição, mesmas caixas.",
              "Caixas do quadril: replicadas a cada exame.",
              "Lado e região: o protocolo define."
            ],
            "visual": "dxa-posicionamento"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula de posicionamento, para que serve o bloco sob as pernas na medida da coluna?"
            },
            "help": "Pense no que acontece com a curva da região lombar.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o bloco reduz a curva lombar para a medida da coluna.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula de posicionamento, para que serve o bloco sob as pernas na medida da coluna?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-06:i1:a",
                  "label": "Aplaina a pelve e a parte baixa da coluna",
                  "explanation": "Isso: o bloco reduz a curva lombar para a medida da coluna."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i1:b",
                  "label": "Gira o quadril para dentro, para o fêmur",
                  "explanation": "Quem gira o quadril é o suporte do pé, no exame do fêmur."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i1:c",
                  "label": "Prende o pé para a pessoa não se mexer",
                  "explanation": "Quem prende o pé neste esquema é a faixa, e não o bloco."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i1:d",
                  "label": "Leva o detector para perto da pessoa",
                  "explanation": "O bloco só apoia as pernas; o detector fica no braço acima."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-06:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O exame anterior mediu o quadril total. Toque no contorno que marca a região que o exame novo precisa medir de novo."
            },
            "help": "Qual região do fêmur reúne as outras duas?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o contorno tracejado é o quadril total, e o exame novo mede de novo essa mesma região.",
              "incorrect": "Essa é outra região: o quadril total é o contorno que reúne colo, trocânter e a parte logo abaixo."
            },
            "payload": {
              "prompt": "O exame anterior mediu o quadril total. Toque no contorno que marca a região que o exame novo precisa medir de novo.",
              "imageRef": "diagram:dxa-regioes-de-interesse",
              "regions": [
                {
                  "id": "region:rtg-2026:m30:aula-06:i2:1",
                  "label": "Área sombreada na saliência",
                  "x": 0.5062,
                  "y": 0.3417,
                  "width": 0.0875,
                  "height": 0.1583
                },
                {
                  "id": "region:rtg-2026:m30:aula-06:i2:2",
                  "label": "Caixa estreita e inclinada",
                  "x": 0.7219,
                  "y": 0.2792,
                  "width": 0.0813,
                  "height": 0.1083
                },
                {
                  "id": "region:rtg-2026:m30:aula-06:i2:3",
                  "label": "Contorno tracejado, na haste",
                  "x": 0.5625,
                  "y": 0.7333,
                  "width": 0.1313,
                  "height": 0.0917
                },
                {
                  "id": "region:rtg-2026:m30:aula-06:i2:4",
                  "label": "Caixa mais alta da coluna",
                  "x": 0.1563,
                  "y": 0.1167,
                  "width": 0.125,
                  "height": 0.0917
                },
                {
                  "id": "region:rtg-2026:m30:aula-06:i2:5",
                  "label": "Caixa mais baixa da coluna",
                  "x": 0.1563,
                  "y": 0.5417,
                  "width": 0.125,
                  "height": 0.0917
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m30:aula-06:i2:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre comparar dois exames."
            },
            "help": "Pense no que precisa ser igual, e em quem decide o lado.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que precisa se repetir do que o protocolo define.",
              "incorrect": "Releia o conceito: região, posição e caixas se repetem, e o lado é definido pelo protocolo."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre comparar dois exames.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m30:aula-06:i3:1",
                  "text": "O exame novo deve medir as mesmas regiões que o anterior.",
                  "isTrue": true,
                  "explanation": "Certo: sem a mesma região, os dois exames não medem a mesma coisa."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-06:i3:2",
                  "text": "O estudante escolhe o lado do quadril a medir no exame de acompanhamento.",
                  "isTrue": false,
                  "explanation": "Errado: o lado e a região o protocolo do serviço define; dúvidas vão para a equipe."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-06:i3:3",
                  "text": "A posição do pé e das pernas deve repetir a do exame anterior.",
                  "isTrue": true,
                  "explanation": "Certo: a exatidão da medida depende da posição correta em todo exame."
                },
                {
                  "id": "statement:rtg-2026:m30:aula-06:i3:4",
                  "text": "As caixas das regiões do quadril são replicadas no exame seguinte.",
                  "isTrue": true,
                  "explanation": "Certo: replicar as caixas mantém a mesma região medida ao longo do tempo."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante da proposta de Duda?"
            },
            "help": "Sem o registro, você descobre a posição ou avisa quem decide?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: falta a posição anterior, e quem decide como seguir é a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Heitor trouxe o exame de outro serviço, sem registro de como o pé foi posicionado. Duda propõe: posicionar como parecer melhor e anotar que está igual ao anterior.",
              "prompt": "O que você faz diante da proposta de Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:m30:aula-06:i4:a",
                  "label": "Posicionar do jeito que parecer melhor e anotar que é igual",
                  "explanation": "Anotar \"igual\" sem saber a posição anterior registra algo que ninguém conferiu."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i4:b",
                  "label": "Pedir que ele lembre a posição e anotar o que ele disser",
                  "explanation": "A lembrança da pessoa não substitui o registro: ela pode não saber a posição."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i4:c",
                  "label": "Medir só a coluna, que não precisa de registro de posição",
                  "explanation": "Trocar a região não é decisão sua, e a coluna também depende de posição."
                },
                {
                  "id": "option:rtg-2026:m30:aula-06:i4:d",
                  "label": "Avisar a equipe de que falta o registro e seguir o que ela definir",
                  "explanation": "Isso: falta a posição anterior, e quem decide como seguir é a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m30:aula-06:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m30:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m30:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Seu Heitor quer saber se o exame de hoje será igual ao do ano passado. Responda dentro do seu papel."
            },
            "help": "O que o protocolo define, e o que você leva à equipe?",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você disse que segue o registro e o protocolo, e levou a escolha de lado à equipe.",
              "incorrect": "Reveja as falas: a comparação depende de repetir região e posição, e o lado é definido pelo protocolo."
            },
            "payload": {
              "prompt": "Seu Heitor quer saber se o exame de hoje será igual ao do ano passado. Responda dentro do seu papel.",
              "speaker": "paciente",
              "name": "Seu Heitor",
              "turns": [
                {
                  "id": "turn:rtg-2026:m30:aula-06:i5:1",
                  "line": "O médico vai comparar os dois, né? Vão me medir do mesmo jeito?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:1a",
                      "label": "Cada exame é de um jeito, e o programa se encarrega de ajustar depois.",
                      "reply": "Então não importa como eu fique, é isso?"
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:1b",
                      "label": "Confiro no registro como foi feito e sigo o protocolo.",
                      "reply": "Ótimo, então tem um registro. Isso me dá confiança."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:1c",
                      "label": "Vou deixar o senhor na posição mais confortável, que o resto se acerta.",
                      "reply": "Bom, o conforto é importante, mas e a comparação?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-06:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m30:aula-06:i5:2",
                  "line": "Hoje meu quadril esquerdo dói menos. Posso medir ele em vez do direito?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:2a",
                      "label": "Pode, o lado que dói menos é sempre o melhor para medir.",
                      "reply": "Então medimos o esquerdo e pronto."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:2b",
                      "label": "Se o senhor prefere, medimos o esquerdo, e eu anoto a sua escolha.",
                      "reply": "Está bem, eu escolhi o esquerdo."
                    },
                    {
                      "id": "option:rtg-2026:m30:aula-06:i5:2c",
                      "label": "O protocolo define o lado. Aviso a equipe do que o senhor disse.",
                      "reply": "Tudo bem, então aguardo a equipe."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m30:aula-06:i5:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m30:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe o que repetir",
            "body": "Agora você consegue dizer que região, posição e caixas precisam se repetir para dois exames serem comparáveis, e leva à equipe o que o protocolo define.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Medir hoje já é preparar o exame de amanhã: quem repete bem facilita o trabalho de todos."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m30",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-01"
        ],
        "prompt": "No esquema do densitômetro, onde fica a fonte de raios X em relação à pessoa deitada?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-01:c1:a",
            "label": "Acima dela, no braço do detector"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c1:b",
            "label": "Sob a mesa, com o detector no braço acima"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c1:c",
            "label": "Ao lado da mesa, na altura do ombro"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c1:d",
            "label": "Atrás da mesa, no piso da sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-01:c1:b",
        "feedback": {
          "correct": "Isso: a fonte fica sob a mesa e o feixe sobe pela pessoa até o detector.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-01"
        ],
        "prompt": "O que acontece com os dois níveis de energia ao atravessar osso e tecido mole?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-01:c2:a",
            "label": "Os dois são absorvidos do mesmo modo pelos dois tecidos"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c2:b",
            "label": "Só o osso absorve; o tecido mole deixa tudo passar"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c2:c",
            "label": "O tecido mole absorve os dois e o osso não absorve nenhum"
          },
          {
            "id": "option:rtg-2026:m30:aula-01:c2:d",
            "label": "Osso e tecido mole os absorvem de modos diferentes"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-01:c2:d",
        "feedback": {
          "correct": "Isso: a diferença de absorção permite ao programa separar osso de tecido mole.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:body-composition-dxa-2017"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-02"
        ],
        "prompt": "Na coluna lombar do esquema, quais vértebras recebem uma caixa cada?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-02:c1:a",
            "label": "De L1 a L4"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c1:b",
            "label": "De L2 a L5"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c1:c",
            "label": "Só a primeira e a última lombar"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c1:d",
            "label": "Todas, da torácica à última lombar"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-02:c1:a",
        "feedback": {
          "correct": "Isso: as quatro caixas cobrem as vértebras de L1 a L4.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:iscd-adult-positions",
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-02"
        ],
        "prompt": "Para conferir o nível de uma vértebra, a crista ilíaca serve de referência. Perto de qual espaço ela costuma ficar?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-02:c2:a",
            "label": "Entre L1 e L2"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c2:b",
            "label": "Entre L2 e L3"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c2:c",
            "label": "Entre L4 e L5"
          },
          {
            "id": "option:rtg-2026:m30:aula-02:c2:d",
            "label": "Entre L5 e o sacro"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-02:c2:c",
        "feedback": {
          "correct": "Isso: a crista ilíaca costuma ficar na altura do espaço entre L4 e L5.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-03"
        ],
        "prompt": "Por que a mesma posição precisa ser repetida a cada exame?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-03:c1:a",
            "label": "Para a pessoa se acostumar e ficar mais relaxada"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c1:b",
            "label": "Para o exame demorar menos a cada vez"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c1:c",
            "label": "A exatidão da medida depende da posição em todo exame"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c1:d",
            "label": "Porque o aparelho só liga se a posição for idêntica"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-03:c1:c",
        "feedback": {
          "correct": "Isso: sem a mesma posição, a medida de um exame não acompanha a do outro.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-03"
        ],
        "prompt": "Dona Beatriz está deitada de costas, com quadril e joelhos dobrados e as pernas sobre o bloco. Que medida está sendo preparada?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-03:c2:a",
            "label": "A da coluna lombar"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c2:b",
            "label": "A do fêmur, com o quadril girado"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c2:c",
            "label": "A do corpo inteiro, por regiões"
          },
          {
            "id": "option:rtg-2026:m30:aula-03:c2:d",
            "label": "Nenhuma: o bloco é só conforto"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-03:c2:a",
        "feedback": {
          "correct": "Isso: o bloco sob as pernas aplaina a lombar para a medida da coluna.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:radiologyinfo-dexa",
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-04"
        ],
        "prompt": "Na imagem da coluna, como os processos espinhosos devem aparecer?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-04:c1:a",
            "label": "Desviados para um lado, seguindo a mesa"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c1:b",
            "label": "Fora da imagem, para mostrar só os corpos"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c1:c",
            "label": "Em curva, acompanhando a lombar"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c1:d",
            "label": "No meio da imagem, com a coluna reta"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: coluna reta e processos espinhosos no meio da imagem.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-pitfalls-2013"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-04"
        ],
        "prompt": "Duda vê um zíper ao lado da coluna e quer excluir a vértebra da conta. O que você diz?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-04:c2:a",
            "label": "Exclua, para a medida não ficar errada"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c2:b",
            "label": "Descreva o que vê e avise: a equipe decide"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c2:c",
            "label": "Repita agora, antes de a pessoa se levantar"
          },
          {
            "id": "option:rtg-2026:m30:aula-04:c2:d",
            "label": "Deixe como está, zíper não altera a medida"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: você descreve e avisa, e a equipe decide a correção.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-pitfalls-2013",
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-05"
        ],
        "prompt": "Em quantos componentes o exame de corpo inteiro separa o corpo, segundo a aula?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-05:c1:a",
            "label": "Em dois: massa magra e gordura, sem o osso"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c1:b",
            "label": "Em três: osso, massa magra e gordura"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c1:c",
            "label": "Em cinco, um para cada região do corpo"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c1:d",
            "label": "Em um só: a massa total do corpo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-05:c1:b",
        "feedback": {
          "correct": "Isso: são os três componentes que o exame separa.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:body-composition-dxa-2017"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-05"
        ],
        "prompt": "Na figura, o que as três faixas de cor empilhadas representam?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-05:c2:a",
            "label": "Três regiões do corpo, todas com a mesma massa total"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c2:b",
            "label": "A parte do corpo que recebe mais radiação no exame"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c2:c",
            "label": "Os três componentes, como legenda de cor sem proporção"
          },
          {
            "id": "option:rtg-2026:m30:aula-05:c2:d",
            "label": "Três exames feitos em dias diferentes, em sequência"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-05:c2:c",
        "feedback": {
          "correct": "Isso: as faixas são só legenda dos componentes, sem proporção medida.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:body-composition-dxa-2017"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-06"
        ],
        "prompt": "Para dois exames do fêmur serem comparáveis, o que precisa se repetir?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-06:c1:a",
            "label": "A região medida e a posição da perna e do pé"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c1:b",
            "label": "A roupa que a pessoa veste no dia do exame"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c1:c",
            "label": "O nome de quem marcou o exame na agenda"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c1:d",
            "label": "A pessoa que acompanha a medida na sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-06:c1:a",
        "feedback": {
          "correct": "Isso: região e posição precisam se repetir para a medida ser comparável.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-practice-guideline-2025",
          "source:rtg-2026:m30:iscd-adult-positions"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m30:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m30:aula-06"
        ],
        "prompt": "Ao repetir o exame do fêmur, o que acontece com as caixas das regiões do quadril?",
        "options": [
          {
            "id": "option:rtg-2026:m30:aula-06:c2:a",
            "label": "São desenhadas maiores, por segurança"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c2:b",
            "label": "Ficam a critério de quem posiciona no dia"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c2:c",
            "label": "São trocadas pelas caixas da coluna"
          },
          {
            "id": "option:rtg-2026:m30:aula-06:c2:d",
            "label": "São replicadas como no exame anterior"
          }
        ],
        "correctOptionId": "option:rtg-2026:m30:aula-06:c2:d",
        "feedback": {
          "correct": "Isso: replicar as caixas mantém a mesma região medida.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m30:dxa-practice-guideline-2025"
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
      "claimId": "interaction:rtg-2026:m30:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-01:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-01:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-01:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-01:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-01:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-01:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m30:aula-02:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-02:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-02:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-02:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-02:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-02:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-02:i5:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-02:i5:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-02:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-02:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-02:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-02:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-03:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-03:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m30:aula-03:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-03:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:i5:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:iscd-adult-positions",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-04:i2:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m30:aula-04:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-04:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-04:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m30:aula-04:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:i3:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-04:i4:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-04:i4:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-04:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-04:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-04:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-04:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-04:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-04:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-04:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "point:rtg-2026:m30:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "label:rtg-2026:m30:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m30:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-05:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "group:rtg-2026:m30:aula-05:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "item:rtg-2026:m30:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-05:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-05:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-05:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:body-composition-dxa-2017",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:body-composition-dxa-2017",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-pitfalls-2013",
        "source:rtg-2026:m30:body-composition-dxa-2017",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:body-composition-dxa-2017"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "region:rtg-2026:m30:aula-06:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-06:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m30:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m30:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:i5:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m30:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "step:rtg-2026:m30:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:radiologyinfo-dexa",
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m30:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025",
        "source:rtg-2026:m30:iscd-adult-positions"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "option:rtg-2026:m30:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m30:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m30:dxa-practice-guideline-2025"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m30:aula-01",
        "hook": "Complete a frase: sob a mesa fica a fonte de raios X, e o detector fica no braço ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-01"
          ],
          "prompt": "Que peça fica no braço acima da pessoa deitada?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-01:rg:a",
              "label": "A fonte de raios X"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rg:b",
              "label": "O detector"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rg:c",
              "label": "O tampo da mesa"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rg:d",
              "label": "O pé da mesa"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-01:rg:b",
          "feedback": {
            "correct": "Isso: o detector recebe o feixe depois que ele atravessa a pessoa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:radiologyinfo-dexa"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-01"
          ],
          "prompt": "Caio separa limalha de ferro e areia com um ímã. O que lembra o papel dos dois níveis de energia do densitômetro?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-01:rt:a",
              "label": "Medir o mesmo material duas vezes para tirar a média"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rt:b",
              "label": "Deixar o material mais leve para a medida ficar fácil"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rt:c",
              "label": "Usar uma diferença entre os materiais para separá-los"
            },
            {
              "id": "option:rtg-2026:m30:aula-01:rt:d",
              "label": "Esconder o material que atrapalha a medida"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-01:rt:c",
          "feedback": {
            "correct": "Isso: o ímã separa pela diferença magnética, e os níveis, pela diferença de absorção.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:radiologyinfo-dexa",
            "source:rtg-2026:m30:body-composition-dxa-2017"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m30:aula-02",
        "hook": "Complete a frase: as vértebras se contam ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-02"
          ],
          "prompt": "Em que direção se contam as vértebras lombares, segundo a aula?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-02:rg:a",
              "label": "De cima para baixo, a partir do crânio"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rg:b",
              "label": "De baixo para cima"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rg:c",
              "label": "Do centro para as pontas"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rg:d",
              "label": "Da esquerda para a direita"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-02:rg:b",
          "feedback": {
            "correct": "Isso: a contagem parte de baixo, onde a crista ilíaca ajuda a achar L4 e L5.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-02"
          ],
          "prompt": "Numa maquete da coluna sem números, Duda quer achar L4. Que referência óssea da aula ela usa?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-02:rt:a",
              "label": "A crista ilíaca, perto de L4 e L5"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rt:b",
              "label": "O trocânter maior, na saliência do fêmur"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rt:c",
              "label": "A cabeça do fêmur, redonda e no encaixe"
            },
            {
              "id": "option:rtg-2026:m30:aula-02:rt:d",
              "label": "A caixa do colo, estreita e inclinada"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-02:rt:a",
          "feedback": {
            "correct": "Isso: a crista ilíaca é a referência para achar L4 e L5.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m30:aula-03",
        "hook": "Complete a frase: para aplainar a região lombar, as pernas sobem num ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-03"
          ],
          "prompt": "Que apoio aplaina a região lombar na medida da coluna?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-03:rg:a",
              "label": "O bloco sob as pernas"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rg:b",
              "label": "O suporte que gira o pé"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rg:c",
              "label": "A faixa sobre o pé"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rg:d",
              "label": "O braço do detector"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-03:rg:a",
          "feedback": {
            "correct": "Isso: o bloco eleva as pernas e aplaina a pelve e a lombar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:radiologyinfo-dexa",
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-03"
          ],
          "prompt": "Num estúdio, um fotógrafo põe uma almofada sob os joelhos do modelo deitado para as costas ficarem retas. O que no densitômetro faz algo parecido?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-03:rt:a",
              "label": "O suporte que gira o pé"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rt:b",
              "label": "A faixa que prende o pé"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rt:c",
              "label": "O braço do detector"
            },
            {
              "id": "option:rtg-2026:m30:aula-03:rt:d",
              "label": "O bloco sob as pernas"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-03:rt:d",
          "feedback": {
            "correct": "Isso: como a almofada, o bloco aplaina a parte baixa da coluna.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:radiologyinfo-dexa",
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m30:aula-04",
        "hook": "Complete a frase: diante de metal na imagem, eu descrevo o que vejo e ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-04"
          ],
          "prompt": "O que você faz depois de descrever o que viu na imagem?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-04:rg:a",
              "label": "Apago o ponto e sigo o turno"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rg:b",
              "label": "Excluo a vértebra por minha conta"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rg:c",
              "label": "Aviso a equipe"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rg:d",
              "label": "Espero a pessoa ir embora"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-04:rg:c",
          "feedback": {
            "correct": "Isso: depois de descrever, você avisa a equipe, que decide.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:dxa-pitfalls-2013",
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-04"
          ],
          "prompt": "Numa foto de documento, um reflexo cobre parte do rosto. Que ideia da aula essa situação lembra?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-04:rt:a",
              "label": "Uma caixa fora da vértebra mede a região certa"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rt:b",
              "label": "Um objeto brilhante sobre a região atrapalha a leitura"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rt:c",
              "label": "A coluna inclinada sempre melhora a imagem da medida"
            },
            {
              "id": "option:rtg-2026:m30:aula-04:rt:d",
              "label": "Roupa solta e sem metal deixa a pessoa mais pesada"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-04:rt:b",
          "feedback": {
            "correct": "Isso: como o reflexo na foto, o metal sobre a região pode alterar a medida.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:radiologyinfo-dexa",
            "source:rtg-2026:m30:dxa-pitfalls-2013"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m30:aula-05",
        "hook": "Complete a frase: osso, massa magra e ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-05"
          ],
          "prompt": "Qual é o terceiro componente que o exame de corpo inteiro separa?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-05:rg:a",
              "label": "Cartilagem"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rg:b",
              "label": "Sangue"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rg:c",
              "label": "Pele"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rg:d",
              "label": "Gordura"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-05:rg:d",
          "feedback": {
            "correct": "Isso: osso, massa magra e gordura são os três componentes.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:body-composition-dxa-2017"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-05"
          ],
          "prompt": "Numa loja, o estoque se divide por prateleira e, em cada prateleira, por tipo de produto. No exame, o que corresponde à prateleira?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-05:rt:a",
              "label": "A região do corpo, como as pernas"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rt:b",
              "label": "O componente, como a gordura"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rt:c",
              "label": "O relatório do médico"
            },
            {
              "id": "option:rtg-2026:m30:aula-05:rt:d",
              "label": "A faixa de cor da figura"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-05:rt:a",
          "feedback": {
            "correct": "Isso: a prateleira é o lugar, como a região do corpo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:body-composition-dxa-2017"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m30:aula-06",
        "hook": "Complete a frase: quem define qual lado do quadril medir é ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m30:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-06"
          ],
          "prompt": "Quem define qual lado do quadril medir no exame de acompanhamento?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-06:rg:a",
              "label": "O estudante, pelo que for mais fácil"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rg:b",
              "label": "O protocolo do serviço"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rg:c",
              "label": "A própria pessoa, pelo que sente"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rg:d",
              "label": "O programa, ao terminar a medida"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-06:rg:b",
          "feedback": {
            "correct": "Isso: o protocolo define o lado, e dúvidas vão para a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:dxa-practice-guideline-2025",
            "source:rtg-2026:m30:iscd-adult-positions"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m30:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m30:aula-06"
          ],
          "prompt": "Duda compara a altura de uma criança em duas datas: na primeira, descalça e de pé; na segunda, de tênis e curvada. O que falhou, como na densitometria?",
          "options": [
            {
              "id": "option:rtg-2026:m30:aula-06:rt:a",
              "label": "A criança cresceu pouco entre as datas"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rt:b",
              "label": "O metro usado era de outra cor"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rt:c",
              "label": "A posição e as condições da medida não se repetiram"
            },
            {
              "id": "option:rtg-2026:m30:aula-06:rt:d",
              "label": "A data da segunda medida era próxima demais"
            }
          ],
          "correctOptionId": "option:rtg-2026:m30:aula-06:rt:c",
          "feedback": {
            "correct": "Isso: sem repetir a posição, as duas medidas não são comparáveis.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m30:dxa-practice-guideline-2025"
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
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "c033361ad98a7a87b7140fdb3bbf94168c466b8763644f76e399d762db52ac18"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
