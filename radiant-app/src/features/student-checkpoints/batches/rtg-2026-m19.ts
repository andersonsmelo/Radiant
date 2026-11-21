// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M19: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m19",
  "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992",
  "trackId": "track:rtg-2026:m19",
  "unitId": "unit:rtg-2026:m19",
  "contentVersion": "rtg-2026-m19-v1",
  "competencyIds": [
    "competency:rtg-2026:m19:aula-01",
    "competency:rtg-2026:m19:aula-02",
    "competency:rtg-2026:m19:aula-03",
    "competency:rtg-2026:m19:aula-04",
    "competency:rtg-2026:m19:aula-05",
    "competency:rtg-2026:m19:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m19:openstax-cp-raios-x",
      "title": "College Physics 2e, 30.4 X Rays: Atomic Origins and Applications",
      "publisher": "OpenStax",
      "url": "https://openstax.org/books/college-physics-2e/pages/30-4-x-rays-atomic-origins-and-applications",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos sobre tubo, espectro e picos característicos; redação própria, sem reprodução."
    },
    {
      "id": "source:rtg-2026:m19:openstax-up2-transformadores",
      "title": "University Physics Volume 2, 15.6 Transformers",
      "publisher": "OpenStax",
      "url": "https://openstax.org/books/university-physics-volume-2/pages/15-6-transformers",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos sobre a razão de espiras e a tensão do transformador; redação própria, sem reprodução."
    },
    {
      "id": "source:rtg-2026:m19:wikipedia-x-ray-tube",
      "title": "X-ray tube",
      "publisher": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/X-ray_tube",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos sobre filamento, ânodo giratório e calor; usada junto de fontes institucionais, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m19:wikipedia-retificador",
      "title": "Rectifier",
      "publisher": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Rectifier",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos sobre ponte de diodos, ondulação e alisamento; redação própria, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m19:wikibooks-fonte-raios-x",
      "title": "Basic Physics of Digital Radiography/The Source",
      "publisher": "Wikibooks",
      "url": "https://en.wikibooks.org/wiki/Basic_Physics_of_Digital_Radiography/The_Source",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos sobre ânodo giratório, calor, kV, mA, filtração, retificação e ondulação; usada junto de OpenStax e Wikipedia, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m19:wikipedia-emissao-termionica",
      "title": "Thermionic emission",
      "publisher": "Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Thermionic_emission",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Consulta de fatos: a emissão de elétrons cresce com a temperatura do fio; redação própria."
    },
    {
      "id": "source:rtg-2026:m19:spellman-falhas-de-tubo",
      "title": "AN-02: Common X-Ray Tube Failure Modes",
      "publisher": "Spellman High Voltage Electronics",
      "url": "https://www.spellmanhv.com/en/Technical-Resources/Application-Notes-X-Ray-Generators/AN-02",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Nota técnica de fabricante, consultada sobre aquecimento recomendado pelo fabricante conforme o tempo parado e sobre arco; redação própria."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m19:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:openstax-up2-transformadores",
          "source:rtg-2026:m19:openstax-cp-raios-x"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Da rede ao tubo",
            "body": "Hoje você vai conseguir nomear os blocos do gerador e dizer o que cada um faz entre a rede e o tubo.",
            "dialogue": {
              "setting": "Sala de manutenção didática",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Abri o esquema do gerador e parece um mapa de metrô. Por onde a energia entra?"
                },
                {
                  "speaker": "caio",
                  "text": "Pela rede, como numa tomada. O resto é o que prepara essa energia para o tubo."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos seguir o fio, bloco por bloco?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Do fio da parede ao tubo",
            "body": "A rede entrega tensão alternada e relativamente baixa. O transformador de alta tensão a eleva, porque o secundário tem mais espiras que o primário. O retificador, uma ponte de diodos, faz a corrente passar num só sentido. Só então a alta tensão chega ao tubo, entre cátodo e ânodo. Um segundo transformador, menor, alimenta o filamento com a corrente que o aquece. A ordem ensinada nesta aula é: rede, transformador de alta tensão, retificador, tubo. O esquema é simplificado: um gerador real tem mais blocos.",
            "keyPoints": [
              "O transformador de alta tensão eleva a tensão alternada.",
              "O retificador deixa a corrente num só sentido.",
              "Um transformador menor alimenta o filamento."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M03 você viu que o transformador depende de um campo magnético que varia. Que tipo de tensão ele precisa receber no primário?"
            },
            "help": "Pense no que faz o campo magnético variar com o tempo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a tensão alternada muda o tempo todo, e o campo variável induz tensão no secundário.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M03 você viu que o transformador depende de um campo magnético que varia. Que tipo de tensão ele precisa receber no primário?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-01:i1:a",
                  "label": "Tensão contínua e constante, como a de uma pilha",
                  "explanation": "Com tensão constante o campo não varia, e o secundário não recebe tensão induzida."
                },
                {
                  "id": "option:rtg-2026:m19:aula-01:i1:b",
                  "label": "Tensão alternada, que faz o campo variar",
                  "explanation": "Isso: a tensão alternada muda o tempo todo, e o campo variável induz tensão no secundário."
                },
                {
                  "id": "option:rtg-2026:m19:aula-01:i1:c",
                  "label": "Qualquer tensão, desde que seja bastante alta",
                  "explanation": "O valor não resolve: o que induz tensão no secundário é a variação do campo, e não o tamanho da tensão."
                },
                {
                  "id": "option:rtg-2026:m19:aula-01:i1:d",
                  "label": "Tensão nula, porque o campo faz todo o trabalho",
                  "explanation": "Sem tensão no primário não há corrente nem campo, então nada é induzido no secundário."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o caminho da energia no gerador, na ordem ensinada nesta aula."
            },
            "help": "Comece pelo que entra no gerador e termine pelo que usa a alta tensão.",
            "type": "ordering",
            "feedback": {
              "correct": "Isso: da rede ao tubo, cada bloco prepara a energia para o seguinte.",
              "incorrect": "Releia o conceito: a tensão é elevada antes de ser retificada, e só depois chega ao tubo."
            },
            "payload": {
              "prompt": "Ordene o caminho da energia no gerador, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m19:aula-01:i2:1",
                  "label": "A rede entrega tensão alternada e baixa"
                },
                {
                  "id": "item:rtg-2026:m19:aula-01:i2:2",
                  "label": "O transformador de alta tensão eleva a tensão"
                },
                {
                  "id": "item:rtg-2026:m19:aula-01:i2:4",
                  "label": "O tubo recebe a alta tensão entre cátodo e ânodo"
                },
                {
                  "id": "item:rtg-2026:m19:aula-01:i2:3",
                  "label": "O retificador deixa a corrente num só sentido"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m19:aula-01:i2:1",
                "item:rtg-2026:m19:aula-01:i2:2",
                "item:rtg-2026:m19:aula-01:i2:3",
                "item:rtg-2026:m19:aula-01:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule os cinco blocos do gerador, tocando na ficha e depois no ponto."
            },
            "help": "Siga o fio a partir da rede, da esquerda para a direita.",
            "type": "label",
            "feedback": {
              "correct": "Isso: você reconheceu os cinco blocos do gerador pela posição no esquema.",
              "incorrect": "Algum bloco ficou no lugar errado: siga o caminho da rede ao tubo e confira o bloco menor, embaixo."
            },
            "payload": {
              "prompt": "Rotule os cinco blocos do gerador, tocando na ficha e depois no ponto.",
              "imageRef": "diagram:circuito-do-gerador",
              "points": [
                {
                  "id": "point:rtg-2026:m19:aula-01:i3:1",
                  "x": 0.094,
                  "y": 0.333,
                  "where": "à esquerda, o círculo com uma onda desenhada",
                  "correctLabelId": "label:rtg-2026:m19:aula-01:i3:1"
                },
                {
                  "id": "point:rtg-2026:m19:aula-01:i3:2",
                  "x": 0.3,
                  "y": 0.45,
                  "where": "no alto, duas bobinas, a da direita com mais voltas",
                  "correctLabelId": "label:rtg-2026:m19:aula-01:i3:2"
                },
                {
                  "id": "point:rtg-2026:m19:aula-01:i3:3",
                  "x": 0.532,
                  "y": 0.334,
                  "where": "no centro do alto, o losango com quatro setas",
                  "correctLabelId": "label:rtg-2026:m19:aula-01:i3:3"
                },
                {
                  "id": "point:rtg-2026:m19:aula-01:i3:4",
                  "x": 0.838,
                  "y": 0.334,
                  "where": "à direita, a cápsula com um traço em onda e uma placa",
                  "correctLabelId": "label:rtg-2026:m19:aula-01:i3:4"
                },
                {
                  "id": "point:rtg-2026:m19:aula-01:i3:5",
                  "x": 0.422,
                  "y": 0.796,
                  "where": "embaixo, o par de bobinas pequeno, de poucas voltas",
                  "correctLabelId": "label:rtg-2026:m19:aula-01:i3:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:3",
                  "label": "Retificador"
                },
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:2",
                  "label": "Transformador de alta tensão"
                },
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:4",
                  "label": "Tubo de raios X"
                },
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:5",
                  "label": "Transformador do filamento"
                },
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:1",
                  "label": "Rede elétrica"
                },
                {
                  "id": "label:rtg-2026:m19:aula-01:i3:6",
                  "label": "Colimador"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada bloco do gerador ao papel dele."
            },
            "help": "Veja qual bloco aparece primeiro no caminho e o que ele faz com a tensão.",
            "type": "matching",
            "feedback": {
              "correct": "Isso: cada bloco tem um papel só, e o conjunto prepara a energia do tubo.",
              "incorrect": "Alguma ligação está trocada: lembre qual bloco eleva a tensão, qual muda o sentido e qual cuida do filamento."
            },
            "payload": {
              "prompt": "Ligue cada bloco do gerador ao papel dele.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m19:aula-01:i4:1",
                  "left": "Rede elétrica",
                  "right": "Fornece a tensão alternada de partida"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-01:i4:2",
                  "left": "Transformador de alta tensão",
                  "right": "Eleva a tensão alternada"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-01:i4:3",
                  "left": "Retificador",
                  "right": "Mantém a corrente num só sentido"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-01:i4:4",
                  "left": "Transformador do filamento",
                  "right": "Alimenta o filamento com a corrente que o aquece"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Num esquema didático, o gerador está sem o retificador. Julgue cada afirmação."
            },
            "help": "Lembre qual bloco muda o sentido da corrente e qual alimenta só o filamento.",
            "type": "true-false",
            "feedback": {
              "correct": "Isso: você separou o que cada bloco faz, mesmo sem um deles.",
              "incorrect": "Releia o conceito: eleva o transformador de alta tensão, retifica a ponte de diodos e aquece a corrente do transformador menor."
            },
            "payload": {
              "prompt": "Num esquema didático, o gerador está sem o retificador. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-01:i5:1",
                  "text": "Sem o retificador, a tensão no tubo continua invertendo o sentido.",
                  "isTrue": true,
                  "explanation": "Certo: o transformador só eleva a tensão alternada; quem a mantém num só sentido é a ponte de diodos."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-01:i5:2",
                  "text": "O transformador do filamento passa a elevar a tensão do tubo.",
                  "isTrue": false,
                  "explanation": "Errado: o transformador menor só alimenta o filamento; quem eleva a tensão do tubo é o de alta tensão."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-01:i5:3",
                  "text": "O filamento continua alimentado pelo transformador menor.",
                  "isTrue": true,
                  "explanation": "Certo: neste esquema o transformador menor liga-se à rede e alimenta o filamento, sem passar pelo retificador."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-01:i5:4",
                  "text": "A rede já entrega a alta tensão que o tubo usa.",
                  "isTrue": false,
                  "explanation": "Errado: a rede entrega tensão bem mais baixa; o transformador de alta tensão a eleva antes do tubo."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê o gerador",
            "body": "Agora você consegue nomear os blocos do gerador, na ordem rede, transformador de alta tensão, retificador e tubo, e dizer o papel de cada um, inclusive o do transformador menor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Esse mapa vai voltar em todas as próximas aulas. Guarde a ordem."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m19:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:wikipedia-retificador",
          "source:rtg-2026:m19:openstax-up2-transformadores",
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Elevar e retificar",
            "body": "Hoje você vai conseguir explicar por que a tensão é elevada e retificada e o que a ondulação indica.",
            "dialogue": {
              "setting": "Bancada com osciloscópio didático",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A tela mostra três traçados empilhados. Qual deles é a tensão que chega ao tubo?"
                },
                {
                  "speaker": "caio",
                  "text": "Depende do gerador. Cada traçado é uma etapa do caminho, e a diferença entre eles tem nome."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos aprender a ler o que cada traçado conta?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Elevar, retificar e alisar",
            "body": "O transformador só trabalha com tensão alternada, que inverte o sentido a cada meio ciclo, e eleva a tensão pelo número de espiras. A ponte de diodos retifica: vira o meio ciclo invertido e deixa a tensão num sentido só, mas ela ainda cai a zero a cada meio ciclo. A ondulação diz quanto a tensão oscila entre picos e vales. Geradores mais elaborados, como os de alta frequência, reduzem a ondulação e deixam a tensão quase constante.",
            "keyPoints": [
              "Retificar é manter a tensão num só sentido.",
              "A ondulação é o quanto a tensão oscila.",
              "Gerador de alta frequência: ondulação pequena."
            ],
            "visual": "retificacao-de-onda"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o retificador vem logo depois de qual bloco do gerador?"
            },
            "help": "Lembre a ordem: rede, transformador, retificador, tubo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a tensão é elevada primeiro e retificada em seguida.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o retificador vem logo depois de qual bloco do gerador?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-02:i1:a",
                  "label": "Do transformador de alta tensão",
                  "explanation": "Isso: a tensão é elevada primeiro e retificada em seguida."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i1:b",
                  "label": "Da rede elétrica",
                  "explanation": "Entre a rede e o retificador está o transformador de alta tensão."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i1:c",
                  "label": "Do tubo de raios X",
                  "explanation": "O tubo é o último bloco: ele recebe a tensão já retificada."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i1:d",
                  "label": "Do transformador do filamento",
                  "explanation": "Esse bloco menor alimenta o filamento e não está no caminho da alta tensão."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-02:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre a tensão no gerador, com as palavras do banco."
            },
            "help": "Uma palavra fala do sentido da tensão, a outra do tamanho da oscilação.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: retificar mantém o sentido, e a ondulação mede a oscilação.",
              "incorrect": "Pense no que a ponte de diodos faz com o sentido da tensão e no nome do quanto ela oscila."
            },
            "payload": {
              "prompt": "Complete a frase sobre a tensão no gerador, com as palavras do banco.",
              "segments": [
                "A ponte de diodos ",
                " a tensão alternada, e a ",
                " mede o quanto a tensão oscila."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m19:aula-02:i2:5",
                  "label": "frequência"
                },
                {
                  "id": "token:rtg-2026:m19:aula-02:i2:3",
                  "label": "eleva"
                },
                {
                  "id": "token:rtg-2026:m19:aula-02:i2:2",
                  "label": "ondulação"
                },
                {
                  "id": "token:rtg-2026:m19:aula-02:i2:1",
                  "label": "retifica"
                },
                {
                  "id": "token:rtg-2026:m19:aula-02:i2:4",
                  "label": "espira"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m19:aula-02:i2:1",
                  "correctTokenId": "token:rtg-2026:m19:aula-02:i2:1"
                },
                {
                  "id": "blank:rtg-2026:m19:aula-02:i2:2",
                  "correctTokenId": "token:rtg-2026:m19:aula-02:i2:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a tensão que chega ao tubo."
            },
            "help": "Pergunte de cada afirmação se ela fala do sentido da tensão ou do quanto ela oscila.",
            "type": "true-false",
            "feedback": {
              "correct": "Isso: você separou elevar, retificar e reduzir a ondulação.",
              "incorrect": "Releia o conceito: o transformador eleva, a ponte retifica e o tipo de gerador define o quanto sobra de ondulação."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a tensão que chega ao tubo.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-02:i3:1",
                  "text": "Com ondulação grande, a tensão varia mais entre picos e vales.",
                  "isTrue": true,
                  "explanation": "Certo: ondulação é justamente essa oscilação entre os picos e os vales."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-02:i3:2",
                  "text": "A retificação de onda completa elimina toda a ondulação.",
                  "isTrue": false,
                  "explanation": "Errado: virar o meio ciclo mantém o sentido, mas a tensão ainda cai a zero a cada meio ciclo."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-02:i3:3",
                  "text": "A ponte de diodos eleva a tensão alternada da rede.",
                  "isTrue": false,
                  "explanation": "Errado: quem eleva a tensão é o transformador, pelo número de espiras; a ponte só deixa a tensão num sentido."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-02:i3:4",
                  "text": "Há geradores com tensão quase constante e pouca ondulação.",
                  "isTrue": true,
                  "explanation": "Certo: geradores de alta frequência, por exemplo, deixam a tensão perto de constante, com ondulação pequena."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada traçado ou termo ao que ele mostra."
            },
            "help": "Veja primeiro o sentido da tensão e depois se ela cai a zero.",
            "type": "matching",
            "feedback": {
              "correct": "Isso: você leu o que cada traçado e cada termo contam.",
              "incorrect": "Alguma ligação está trocada: confira qual traçado muda de sentido e qual cai a zero."
            },
            "payload": {
              "prompt": "Ligue cada traçado ou termo ao que ele mostra.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m19:aula-02:i4:1",
                  "left": "Onda alternada",
                  "right": "Inverte o sentido a cada meio ciclo"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-02:i4:2",
                  "left": "Onda retificada, onda completa",
                  "right": "Um só sentido, com queda a zero a cada meio ciclo"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-02:i4:3",
                  "left": "Tensão quase constante",
                  "right": "Um só sentido e ondulação pequena"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-02:i4:4",
                  "left": "Ondulação",
                  "right": "O quanto a tensão oscila entre picos e vales"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dois geradores didáticos têm o mesmo pico de tensão. O A tem ondulação grande e o B, ondulação pequena. Qual afirmação é coerente?"
            },
            "help": "Lembre o que significa ondulação pequena no traçado.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: ondulação pequena quer dizer tensão mais perto de constante, perto do pico.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dois geradores didáticos têm o mesmo pico de tensão. O A tem ondulação grande e o B, ondulação pequena. Qual afirmação é coerente?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-02:i5:a",
                  "label": "No A, a tensão fica mais constante durante a exposição.",
                  "explanation": "É o contrário: ondulação grande é oscilação grande, e a tensão fica menos constante."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i5:b",
                  "label": "Os dois têm a mesma tensão a cada instante, pois o pico é igual.",
                  "explanation": "O pico igual não faz o resto do traçado igual: a oscilação entre picos e vales muda."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i5:c",
                  "label": "No B, a tensão fica mais perto do valor de pico durante a exposição.",
                  "explanation": "Isso: ondulação pequena quer dizer tensão mais perto de constante, perto do pico."
                },
                {
                  "id": "option:rtg-2026:m19:aula-02:i5:d",
                  "label": "O B tem ondulação menor porque o transformador tem menos espiras.",
                  "explanation": "As espiras mudam o valor da tensão elevada, e não a ondulação, que depende da retificação e do tipo de gerador."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você explica a retificação",
            "body": "Agora você consegue dizer por que a tensão é elevada e retificada, ler os três traçados e explicar o que é a ondulação e que tipo de gerador a reduz.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Na sala, é isso que diferencia um gerador que oscila muito de outro mais estável."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m19:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:wikipedia-x-ray-tube",
          "source:rtg-2026:m19:openstax-cp-raios-x",
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:wikipedia-emissao-termionica"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "O cátodo",
            "body": "Hoje você vai conseguir ligar o filamento aquecido à emissão de elétrons e à corrente do tubo.",
            "dialogue": {
              "setting": "Laboratório didático",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Se a alta tensão é que empurra os elétrons, para que o tubo precisa de filamento?"
                },
                {
                  "speaker": "caio",
                  "text": "A alta tensão só empurra o que já saiu do cátodo. Alguém precisa soltar os elétrons antes."
                },
                {
                  "speaker": "pixel",
                  "text": "Quem solta, e como isso se liga à corrente do tubo?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Do filamento à corrente do tubo",
            "body": "O cátodo tem um filamento de tungstênio. A corrente que o transformador do filamento envia o aquece, e o fio quente libera elétrons. A alta tensão entre cátodo e ânodo leva esses elétrons até o alvo. A corrente do tubo, em mA, é esse fluxo de elétrons. Filamento mais quente solta mais elétrons, e a corrente do tubo sobe. Sem filamento aquecido, a alta tensão não encontra elétrons para acelerar.",
            "keyPoints": [
              "O filamento aquecido libera os elétrons.",
              "A alta tensão acelera os elétrons já liberados.",
              "Filamento mais quente, mais corrente no tubo."
            ],
            "visual": "tubo-emitindo"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na primeira aula, você viu que um transformador menor liga o filamento. O que ele entrega ao filamento?"
            },
            "help": "Pense no que o transformador menor alimenta.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a corrente do transformador menor aquece o filamento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na primeira aula, você viu que um transformador menor liga o filamento. O que ele entrega ao filamento?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-03:i1:a",
                  "label": "Alta tensão, que acelera os elétrons",
                  "explanation": "A alta tensão do tubo vem do transformador de alta tensão e do retificador."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i1:b",
                  "label": "Raios X, que saem pela janela",
                  "explanation": "Raios X nascem no ânodo, e não saem do transformador do filamento."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i1:c",
                  "label": "Corrente, que aquece o fio",
                  "explanation": "Isso: a corrente do transformador menor aquece o filamento."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i1:d",
                  "label": "Tensão alternada elevada ao máximo",
                  "explanation": "Quem eleva a tensão é o transformador de alta tensão, não o menor."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-03:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as partes do tubo de raios X, tocando na ficha e depois no ponto."
            },
            "help": "Comece pela parte que libera os elétrons.",
            "type": "label",
            "feedback": {
              "correct": "Isso: você achou o cátodo, o ânodo, a janela e a ampola pela posição.",
              "incorrect": "Alguma parte está no lugar errado: o cátodo fica no lado de onde saem os elétrons, e o feixe sai pela janela."
            },
            "payload": {
              "prompt": "Rotule as partes do tubo de raios X, tocando na ficha e depois no ponto.",
              "imageRef": "diagram:tubo-raios-x",
              "points": [
                {
                  "id": "point:rtg-2026:m19:aula-03:i2:1",
                  "x": 0.339,
                  "y": 0.372,
                  "where": "à esquerda, a espiral dentro da capa",
                  "correctLabelId": "label:rtg-2026:m19:aula-03:i2:1"
                },
                {
                  "id": "point:rtg-2026:m19:aula-03:i2:2",
                  "x": 0.58,
                  "y": 0.2,
                  "where": "à direita, o disco com a face inclinada, ligado a uma haste",
                  "correctLabelId": "label:rtg-2026:m19:aula-03:i2:2"
                },
                {
                  "id": "point:rtg-2026:m19:aula-03:i2:3",
                  "x": 0.537,
                  "y": 0.508,
                  "where": "embaixo, a abertura redonda no vidro, de onde sai o feixe",
                  "correctLabelId": "label:rtg-2026:m19:aula-03:i2:3"
                },
                {
                  "id": "point:rtg-2026:m19:aula-03:i2:4",
                  "x": 0.35,
                  "y": 0.16,
                  "where": "a parede curva que envolve todo o conjunto",
                  "correctLabelId": "label:rtg-2026:m19:aula-03:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m19:aula-03:i2:5",
                  "label": "Colimador"
                },
                {
                  "id": "label:rtg-2026:m19:aula-03:i2:1",
                  "label": "Cátodo com filamento"
                },
                {
                  "id": "label:rtg-2026:m19:aula-03:i2:2",
                  "label": "Ânodo"
                },
                {
                  "id": "label:rtg-2026:m19:aula-03:i2:4",
                  "label": "Ampola de vidro"
                },
                {
                  "id": "label:rtg-2026:m19:aula-03:i2:3",
                  "label": "Janela de saída"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada grandeza do cátodo ao que ela é ou faz no tubo."
            },
            "help": "Há duas correntes no cátodo: pergunte de onde cada uma vem e por onde passa.",
            "type": "matching",
            "feedback": {
              "correct": "Isso: você separou as duas correntes, a tensão e o efeito do filamento mais quente.",
              "incorrect": "Alguma ligação está trocada: a corrente do filamento só aquece o fio, e a corrente do tubo é o fluxo de elétrons até o ânodo."
            },
            "payload": {
              "prompt": "Ligue cada grandeza do cátodo ao que ela é ou faz no tubo.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m19:aula-03:i3:1",
                  "left": "Corrente do filamento",
                  "right": "Vem do transformador menor e aquece o fio"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-03:i3:2",
                  "left": "Corrente do tubo, em mA",
                  "right": "Elétrons que cruzam do cátodo ao ânodo"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-03:i3:3",
                  "left": "Tensão do tubo, em kV",
                  "right": "Vem do transformador de alta tensão e acelera os elétrons"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-03:i3:4",
                  "left": "Filamento mais quente",
                  "right": "Mais elétrons liberados pelo fio"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o cátodo."
            },
            "help": "Pergunte quem faz cada coisa: aquecer, soltar ou acelerar.",
            "type": "true-false",
            "feedback": {
              "correct": "Isso: você separou quem aquece, quem libera e quem acelera.",
              "incorrect": "Releia o conceito: o filamento aquece com a própria corrente, e a alta tensão só empurra os elétrons livres."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o cátodo.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-03:i4:1",
                  "text": "É a alta tensão do tubo que aquece o filamento do cátodo.",
                  "isTrue": false,
                  "explanation": "Errado: o filamento é aquecido pela corrente do transformador menor; a alta tensão só acelera os elétrons já liberados."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-03:i4:2",
                  "text": "Filamento mais quente solta mais elétrons e a corrente do tubo sobe.",
                  "isTrue": true,
                  "explanation": "Certo: mais elétrons liberados significa mais fluxo entre cátodo e ânodo."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-03:i4:3",
                  "text": "O filamento libera elétrons antes de a alta tensão agir sobre eles.",
                  "isTrue": true,
                  "explanation": "Certo: primeiro o fio quente solta os elétrons, e depois a alta tensão os acelera."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num esquema no papel, o transformador do filamento é desligado e a alta tensão continua aplicada. O que o esquema prevê para a corrente do tubo?"
            },
            "help": "Pense em quem solta os elétrons antes de eles serem acelerados.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: sem elétrons liberados, a alta tensão não tem o que acelerar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num esquema no papel, o transformador do filamento é desligado e a alta tensão continua aplicada. O que o esquema prevê para a corrente do tubo?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-03:i5:a",
                  "label": "Sobe, pois só a alta tensão controla os elétrons",
                  "explanation": "A alta tensão acelera elétrons, mas quem os libera é o filamento quente."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i5:b",
                  "label": "Não muda, pois a alta tensão já fornece os elétrons",
                  "explanation": "A alta tensão não cria elétrons: ela acelera os que o filamento liberou."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i5:c",
                  "label": "Inverte o sentido, pois o ânodo passa a ser cátodo",
                  "explanation": "O ânodo não emite elétrons: sem filamento quente a corrente simplesmente cai."
                },
                {
                  "id": "option:rtg-2026:m19:aula-03:i5:d",
                  "label": "Cai, pois sem filamento quente não saem elétrons",
                  "explanation": "Isso: sem elétrons liberados, a alta tensão não tem o que acelerar."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-03:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você liga filamento e corrente",
            "body": "Agora você consegue dizer que o filamento aquecido libera os elétrons, que a alta tensão os acelera e que a corrente do tubo, em mA, é esse fluxo entre cátodo e ânodo.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Filamento quente e alta tensão trabalham juntos. Sem um dos dois, o tubo não produz o feixe."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m19:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:openstax-cp-raios-x",
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:wikipedia-x-ray-tube",
          "source:rtg-2026:m19:spellman-falhas-de-tubo"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "O ânodo e o calor",
            "body": "Hoje você vai conseguir explicar por que o ânodo gira e como o tamanho do ponto focal se liga ao calor.",
            "dialogue": {
              "setting": "Sala de comando didática",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Vi no desenho que o disco gira, mas o feixe de elétrons não anda. Por que girar, então?"
                },
                {
                  "speaker": "caio",
                  "text": "Pense no que acontece com um ponto que recebe calor sem parar."
                },
                {
                  "speaker": "pixel",
                  "text": "Dá para comparar um ponto parado com um anel inteiro?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "O disco que gira e o ponto focal",
            "body": "Os elétrons batem numa pista em anel, na borda de um disco de tungstênio. Quase toda a energia deles vira calor, e só uma parte muito pequena vira raios X. O disco gira, então cada trecho da pista passa sob o feixe, e o calor se espalha pelo anel, e não por um ponto só. O ponto onde os elétrons batem é o ponto focal. Ponto focal menor recebe a mesma energia numa área menor: o calor fica mais concentrado.",
            "keyPoints": [
              "Quase toda a energia dos elétrons vira calor.",
              "O disco gira para o calor se espalhar pelo anel.",
              "Ponto focal menor: calor mais concentrado."
            ],
            "visual": "anodo-giratorio"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula do cátodo, o que acelera os elétrons até o ânodo?"
            },
            "help": "Lembre quem empurra os elétrons já liberados.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a alta tensão acelera os elétrons que o filamento liberou.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula do cátodo, o que acelera os elétrons até o ânodo?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-04:i1:a",
                  "label": "A corrente que aquece o filamento",
                  "explanation": "Essa corrente só aquece o fio, para ele liberar os elétrons."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i1:b",
                  "label": "A rotação do disco do ânodo",
                  "explanation": "O disco gira para espalhar o calor, e não para acelerar elétrons."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i1:c",
                  "label": "A ondulação da tensão",
                  "explanation": "A ondulação é a oscilação da tensão, e não o que acelera os elétrons."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i1:d",
                  "label": "A alta tensão entre cátodo e ânodo",
                  "explanation": "Isso: a alta tensão acelera os elétrons que o filamento liberou."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-04:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada situação pelo que ela faz com o calor na pista do ânodo."
            },
            "help": "Pense no tamanho da área da pista que recebe a mesma energia.",
            "type": "categorize",
            "feedback": {
              "correct": "Isso: girar o disco e aumentar a área de impacto espalham o calor; área menor ou trecho fixo o concentram.",
              "incorrect": "Pergunte de cada situação se a energia cai numa área maior da pista ou numa área menor."
            },
            "payload": {
              "prompt": "Classifique cada situação pelo que ela faz com o calor na pista do ânodo.",
              "categories": [
                {
                  "id": "group:rtg-2026:m19:aula-04:i2:a",
                  "label": "Espalha o calor"
                },
                {
                  "id": "group:rtg-2026:m19:aula-04:i2:b",
                  "label": "Concentra o calor"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m19:aula-04:i2:2",
                  "label": "Ponto focal menor",
                  "categoryId": "group:rtg-2026:m19:aula-04:i2:b"
                },
                {
                  "id": "item:rtg-2026:m19:aula-04:i2:3",
                  "label": "Ponto focal maior",
                  "categoryId": "group:rtg-2026:m19:aula-04:i2:a"
                },
                {
                  "id": "item:rtg-2026:m19:aula-04:i2:1",
                  "label": "Disco girando sob o feixe",
                  "categoryId": "group:rtg-2026:m19:aula-04:i2:a"
                },
                {
                  "id": "item:rtg-2026:m19:aula-04:i2:4",
                  "label": "Elétrons batendo sempre no mesmo trecho da pista",
                  "categoryId": "group:rtg-2026:m19:aula-04:i2:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre o ânodo."
            },
            "help": "Leia cada afirmação com calma: pergunte se fala da energia, do disco ou do ponto focal.",
            "type": "blitz",
            "feedback": {
              "correct": "Isso: você separou para onde vai a energia, o que o disco faz e o que o ponto focal muda.",
              "incorrect": "Reveja o conceito: quase toda a energia vira calor, o disco o espalha e o ponto focal menor o concentra."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre o ânodo.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:1",
                  "text": "O disco gira para o calor se espalhar por um anel, e não por um ponto.",
                  "isTrue": true,
                  "explanation": "Certo: cada trecho da pista passa sob o feixe, e o calor se distribui pelo anel."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:2",
                  "text": "O feixe de elétrons gira junto com o disco.",
                  "isTrue": false,
                  "explanation": "Errado: o feixe fica parado em relação ao tubo; quem gira é o disco, por baixo dele."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:3",
                  "text": "Quase toda a energia dos elétrons que batem no alvo vira calor.",
                  "isTrue": true,
                  "explanation": "Certo: só uma parte muito pequena da energia vira raios X; o resto aquece o ânodo."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:4",
                  "text": "O ponto focal é a região da pista onde os elétrons batem.",
                  "isTrue": true,
                  "explanation": "Certo: é ali que os elétrons freiam e de onde sai o feixe de raios X."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:5",
                  "text": "A maior parte da energia dos elétrons sai pela janela como raios X.",
                  "isTrue": false,
                  "explanation": "Errado: a maior parte vira calor no ânodo; os raios X levam só uma fração pequena."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:6",
                  "text": "Ponto focal menor concentra o calor numa área menor.",
                  "isTrue": true,
                  "explanation": "Certo: a mesma energia cai num pedaço menor da pista, e o calor fica mais concentrado."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-04:i3:7",
                  "text": "Com o disco girando, o aquecimento do tubo deixa de importar.",
                  "isTrue": false,
                  "explanation": "Errado: a rotação espalha o calor, mas não o elimina; o aquecimento do tubo segue o fabricante e o serviço."
                }
              ],
              "passCount": 6
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre o ânodo com as palavras do banco."
            },
            "help": "Uma palavra é o que o disco faz; a outra, onde os elétrons batem.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o disco gira e o calor se espalha pela pista em anel.",
              "incorrect": "Pense no movimento do disco e no nome do anel onde os elétrons batem."
            },
            "payload": {
              "prompt": "Complete a frase sobre o ânodo com as palavras do banco.",
              "segments": [
                "O disco do ânodo ",
                " para o calor se espalhar por uma ",
                " em anel."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m19:aula-04:i4:2",
                  "label": "pista"
                },
                {
                  "id": "token:rtg-2026:m19:aula-04:i4:4",
                  "label": "janela"
                },
                {
                  "id": "token:rtg-2026:m19:aula-04:i4:3",
                  "label": "sobe"
                },
                {
                  "id": "token:rtg-2026:m19:aula-04:i4:1",
                  "label": "gira"
                },
                {
                  "id": "token:rtg-2026:m19:aula-04:i4:5",
                  "label": "ampola"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m19:aula-04:i4:1",
                  "correctTokenId": "token:rtg-2026:m19:aula-04:i4:1"
                },
                {
                  "id": "blank:rtg-2026:m19:aula-04:i4:2",
                  "correctTokenId": "token:rtg-2026:m19:aula-04:i4:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na cozinha, a chama fica parada. Para não queimar um ponto só do fundo de uma frigideira grande, Duda a gira devagar sobre o fogo. Que parte do tubo faz o papel desse giro?"
            },
            "help": "No tubo, o que fica parado como a chama, e o que se move como a frigideira?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o feixe fica parado como a chama, e o disco gira para o calor não se acumular num ponto.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na cozinha, a chama fica parada. Para não queimar um ponto só do fundo de uma frigideira grande, Duda a gira devagar sobre o fogo. Que parte do tubo faz o papel desse giro?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-04:i5:a",
                  "label": "O filamento aquecido do cátodo",
                  "explanation": "O filamento libera os elétrons; ele não muda o trecho da pista que recebe o calor."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i5:b",
                  "label": "O disco do ânodo girando sob o feixe",
                  "explanation": "Isso: o feixe fica parado como a chama, e o disco gira para o calor não se acumular num ponto."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i5:c",
                  "label": "A janela de saída do feixe",
                  "explanation": "A janela só deixa o feixe de raios X sair; ela não espalha o calor da pista."
                },
                {
                  "id": "option:rtg-2026:m19:aula-04:i5:d",
                  "label": "O transformador de alta tensão",
                  "explanation": "O transformador eleva a tensão; o calor se espalha pela rotação do disco."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-04:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você explica o disco e o calor",
            "body": "Agora você consegue dizer que quase toda a energia dos elétrons vira calor no ânodo, que o disco gira para espalhar esse calor pela pista e que o ponto focal menor concentra o calor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Na sala, o cuidado com o calor do ânodo é parte do dia a dia do tubo."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m19:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:openstax-cp-raios-x"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "O espectro do feixe",
            "body": "Hoje você vai conseguir reconhecer as partes do espectro e prever, só em sentido, o efeito de kV, mAs e filtração.",
            "dialogue": {
              "setting": "Sala de estudo",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "O gráfico do feixe não tem número nenhum nos eixos. Dá para ler alguma coisa assim?"
                },
                {
                  "speaker": "caio",
                  "text": "Dá: a forma já conta bastante. Onde a curva acaba, onde ela sobe e onde aparecem os picos."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos ler a forma antes dos números?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Ler a forma do espectro",
            "body": "O feixe de raios X mistura energias. No gráfico, a energia fica na horizontal e a quantidade de fótons, na vertical. A curva larga é a radiação de freamento, dos elétrons freados no alvo. Ela termina na energia máxima, que acompanha o kV. Os picos estreitos são a radiação característica: a posição deles depende do material do alvo. A filtração tira fótons de baixa energia: a quantidade cai e a energia média sobe. O mAs muda a quantidade, e não a energia. O kV muda a energia máxima e também a quantidade. Aqui só importa o sentido: sobe, desce, não muda.",
            "keyPoints": [
              "kV: a energia máxima e a quantidade sobem.",
              "mAs: só a quantidade muda.",
              "Filtração: tira baixas energias e sobe a energia média."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula do cátodo, a corrente do tubo, em mA, é o fluxo de quê?"
            },
            "help": "Lembre o que se desloca entre cátodo e ânodo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: é o fluxo de elétrons entre os dois eletrodos, que dá a quantidade do feixe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula do cátodo, a corrente do tubo, em mA, é o fluxo de quê?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-05:i1:a",
                  "label": "De elétrons do cátodo ao ânodo",
                  "explanation": "Isso: é o fluxo de elétrons entre os dois eletrodos, que dá a quantidade do feixe."
                },
                {
                  "id": "option:rtg-2026:m19:aula-05:i1:b",
                  "label": "De fótons que saem pela janela",
                  "explanation": "Os fótons são o feixe; a corrente do tubo é o fluxo de elétrons que o produz."
                },
                {
                  "id": "option:rtg-2026:m19:aula-05:i1:c",
                  "label": "De corrente alternada na rede",
                  "explanation": "A rede é a origem da energia; a corrente do tubo é medida entre cátodo e ânodo."
                },
                {
                  "id": "option:rtg-2026:m19:aula-05:i1:d",
                  "label": "De calor entre disco e ampola",
                  "explanation": "Calor não é corrente elétrica; a corrente do tubo é de elétrons."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-05:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as quatro partes do espectro, tocando na ficha e depois no ponto."
            },
            "help": "Comece pela curva larga, que tem a maior parte dos fótons.",
            "type": "label",
            "feedback": {
              "correct": "Isso: você reconheceu as quatro partes do espectro pela forma.",
              "incorrect": "Alguma ficha está no lugar errado: a curva larga é contínua, os picos são estreitos e a energia máxima fecha o eixo."
            },
            "payload": {
              "prompt": "Rotule as quatro partes do espectro, tocando na ficha e depois no ponto.",
              "imageRef": "diagram:espectro-de-raios-x",
              "points": [
                {
                  "id": "point:rtg-2026:m19:aula-05:i2:1",
                  "x": 0.3966,
                  "y": 0.5838,
                  "where": "a curva larga que sobe depressa e desce devagar",
                  "correctLabelId": "label:rtg-2026:m19:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m19:aula-05:i2:2",
                  "x": 0.563,
                  "y": 0.65,
                  "where": "os dois picos estreitos sobre a curva",
                  "correctLabelId": "label:rtg-2026:m19:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m19:aula-05:i2:3",
                  "x": 0.813,
                  "y": 0.834,
                  "where": "onde a curva larga toca o eixo horizontal",
                  "correctLabelId": "label:rtg-2026:m19:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m19:aula-05:i2:4",
                  "x": 0.223,
                  "y": 0.459,
                  "where": "à esquerda, a faixa sombreada acima da curva",
                  "correctLabelId": "label:rtg-2026:m19:aula-05:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m19:aula-05:i2:1",
                  "label": "Radiação de freamento"
                },
                {
                  "id": "label:rtg-2026:m19:aula-05:i2:3",
                  "label": "Energia máxima"
                },
                {
                  "id": "label:rtg-2026:m19:aula-05:i2:4",
                  "label": "Parte removida pela filtração"
                },
                {
                  "id": "label:rtg-2026:m19:aula-05:i2:2",
                  "label": "Radiação característica"
                },
                {
                  "id": "label:rtg-2026:m19:aula-05:i2:5",
                  "label": "Corrente do filamento"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada previsão, só em sentido, sobre o espectro do feixe."
            },
            "help": "Pergunte de cada ajuste se ele muda a energia, a quantidade ou as duas.",
            "type": "true-false",
            "feedback": {
              "correct": "Isso: você separou o que o kV, o mAs e a filtração fazem.",
              "incorrect": "Releia o conceito: kV mexe na energia máxima, mAs só na quantidade e a filtração tira as baixas energias."
            },
            "payload": {
              "prompt": "Julgue cada previsão, só em sentido, sobre o espectro do feixe.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-05:i3:1",
                  "text": "Subir o kV desloca a energia máxima do feixe para a direita.",
                  "isTrue": true,
                  "explanation": "Certo: a energia máxima acompanha o kV, então ela se desloca para a direita no gráfico."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-05:i3:2",
                  "text": "Subir o mAs desloca a energia máxima do feixe para a direita.",
                  "isTrue": false,
                  "explanation": "Errado: o mAs muda a quantidade de fótons, e a energia máxima acompanha o kV."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-05:i3:3",
                  "text": "Subir o mAs aumenta os fótons sem mudar a energia máxima.",
                  "isTrue": true,
                  "explanation": "Certo: o mAs sobe a curva inteira, e a energia máxima continua presa ao kV."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-05:i3:4",
                  "text": "A filtração deixa a energia média do feixe mais baixa.",
                  "isTrue": false,
                  "explanation": "Errado: a filtração tira sobretudo os fótons de baixa energia, então a energia média sobe."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada ajuste ao efeito dele no feixe, em sentido."
            },
            "help": "Separe o que muda a energia do que muda só a quantidade.",
            "type": "matching",
            "feedback": {
              "correct": "Isso: cada ajuste tem o próprio efeito no espectro.",
              "incorrect": "Alguma ligação está trocada: confira qual ajuste muda só a quantidade e qual muda a posição dos picos."
            },
            "payload": {
              "prompt": "Ligue cada ajuste ao efeito dele no feixe, em sentido.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m19:aula-05:i4:1",
                  "left": "Subir o kV",
                  "right": "A energia máxima sobe e a quantidade também"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-05:i4:2",
                  "left": "Subir o mAs",
                  "right": "A quantidade sobe e a energia dos fótons não muda"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-05:i4:3",
                  "left": "Mais filtração",
                  "right": "Tira baixas energias e a energia média sobe"
                },
                {
                  "id": "pair:rtg-2026:m19:aula-05:i4:4",
                  "left": "Trocar o metal do alvo",
                  "right": "Os picos característicos mudam de lugar"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Num esquema, só o kV sobe. Classifique cada item pelo que acontece com ele."
            },
            "help": "Só o kV mudou: o que é outro controle ou outra peça fica como estava.",
            "type": "categorize",
            "feedback": {
              "correct": "Isso: o kV puxa a energia máxima e a quantidade, e não mexe no mA nem no metal do alvo.",
              "incorrect": "Pergunte de cada item se ele depende do kV ou é outro ajuste ou outra peça do tubo."
            },
            "payload": {
              "prompt": "Num esquema, só o kV sobe. Classifique cada item pelo que acontece com ele.",
              "categories": [
                {
                  "id": "group:rtg-2026:m19:aula-05:i5:a",
                  "label": "Sobe"
                },
                {
                  "id": "group:rtg-2026:m19:aula-05:i5:b",
                  "label": "Não muda"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m19:aula-05:i5:4",
                  "label": "Metal do alvo do ânodo",
                  "categoryId": "group:rtg-2026:m19:aula-05:i5:b"
                },
                {
                  "id": "item:rtg-2026:m19:aula-05:i5:1",
                  "label": "Energia máxima dos fótons",
                  "categoryId": "group:rtg-2026:m19:aula-05:i5:a"
                },
                {
                  "id": "item:rtg-2026:m19:aula-05:i5:2",
                  "label": "Quantidade de fótons do feixe",
                  "categoryId": "group:rtg-2026:m19:aula-05:i5:a"
                },
                {
                  "id": "item:rtg-2026:m19:aula-05:i5:3",
                  "label": "Corrente do tubo, em mA",
                  "categoryId": "group:rtg-2026:m19:aula-05:i5:b"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê o espectro",
            "body": "Agora você consegue reconhecer a radiação de freamento, a característica e a energia máxima, e prever em sentido o que o kV, o mAs e a filtração fazem com o feixe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Sem números, só pelo sentido. Isso já basta para entender o que cada controle faz."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m19:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m19:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m19-v1",
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:wikipedia-x-ray-tube",
          "source:rtg-2026:m19:spellman-falhas-de-tubo"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Cuidar do tubo",
            "body": "Hoje você vai conseguir reconhecer sinais de sobrecarga ou falha do tubo, parar e avisar a equipe.",
            "dialogue": {
              "setting": "Sala de exames didática",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "O painel mostrou uma mensagem sobre o tubo e eu quase nem li. Deve ser coisa pequena, né?"
                },
                {
                  "speaker": "caio",
                  "text": "Calma. Antes de decidir, que sinais do tubo você já conhece?"
                },
                {
                  "speaker": "pixel",
                  "text": "E qual é o primeiro cuidado diante de qualquer sinal estranho?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Sinais e o que fazer",
            "body": "Um tubo em dificuldade pode dar sinais fora do habitual: um ruído que ele não fazia, um aviso de arco ou de calor no painel. O aquecimento do tubo antes do uso segue o fabricante e o serviço, conforme o tempo que ficou parado. Diante de qualquer sinal fora do habitual, o estudante para, anota o que viu e avisa a equipe. Ele nunca abre o equipamento, limpa o aviso ou reinicia sozinho.",
            "keyPoints": [
              "Sinal fora do habitual: ruído novo, aviso de arco ou de calor.",
              "Parar, anotar o que viu e avisar a equipe.",
              "Aquecimento, aviso e reinício não são decisão do aluno."
            ],
            "visual": "anodo-giratorio"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula do ânodo, para onde vai a maior parte da energia dos elétrons que batem no alvo?"
            },
            "help": "Pense no que a aula do ânodo disse sobre a fração que vira raios X.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: quase toda a energia vira calor no ânodo, e por isso o calor do tubo pede cuidado.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula do ânodo, para onde vai a maior parte da energia dos elétrons que batem no alvo?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-06:i1:a",
                  "label": "Vira raios X que saem pela janela",
                  "explanation": "Os raios X levam só uma parte muito pequena da energia; o resto fica no ânodo."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i1:b",
                  "label": "Vira calor no ânodo",
                  "explanation": "Isso: quase toda a energia vira calor no ânodo, e por isso o calor do tubo pede cuidado."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i1:c",
                  "label": "Volta ao filamento do cátodo",
                  "explanation": "Os elétrons vão do cátodo ao ânodo, e a energia deles fica onde batem."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i1:d",
                  "label": "Some quando o disco gira",
                  "explanation": "A rotação espalha o calor pela pista, mas não faz a energia sumir."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-06:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque na parte do tubo que recebe o calor do impacto dos elétrons."
            },
            "help": "Procure onde os elétrons chegam depois de saírem do filamento.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: é no ânodo que os elétrons batem, e é ali que o calor se acumula.",
              "incorrect": "Essa parte não recebe o impacto: procure onde os elétrons do cátodo chegam."
            },
            "payload": {
              "prompt": "Toque na parte do tubo que recebe o calor do impacto dos elétrons.",
              "imageRef": "diagram:tubo-raios-x",
              "regions": [
                {
                  "id": "region:rtg-2026:m19:aula-06:i2:1",
                  "label": "Cátodo com filamento",
                  "x": 0.2188,
                  "y": 0.3083,
                  "width": 0.1437,
                  "height": 0.2417
                },
                {
                  "id": "region:rtg-2026:m19:aula-06:i2:2",
                  "label": "Ânodo",
                  "x": 0.5094,
                  "y": 0.0854,
                  "width": 0.4578,
                  "height": 0.2646
                },
                {
                  "id": "region:rtg-2026:m19:aula-06:i2:3",
                  "label": "Janela de saída",
                  "x": 0.475,
                  "y": 0.4,
                  "width": 0.1453,
                  "height": 0.1167
                },
                {
                  "id": "region:rtg-2026:m19:aula-06:i2:4",
                  "label": "Ampola de vidro",
                  "x": 0.2578,
                  "y": 0.0625,
                  "width": 0.1875,
                  "height": 0.1979
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m19:aula-06:i2:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Duda notou sinais no tubo durante um turno simulado. Ajude-a a conduzir a situação."
            },
            "help": "Pense no que o estudante pode decidir sozinho e no que fica com a equipe.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso: diante de zumbido ou aviso, o aluno para, anota o que viu e pede apoio à equipe.",
              "incorrect": "Reveja o turno: o aluno não abre, não limpa o aviso e não reinicia sozinho; ele para, anota e avisa."
            },
            "payload": {
              "prompt": "Duda notou sinais no tubo durante um turno simulado. Ajude-a a conduzir a situação.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m19:aula-06:i3:1",
                  "line": "Estou ouvindo um zumbido do tubo que ele nunca fazia. O que eu faço agora?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:1a",
                      "label": "Pare, anote o que ouviu e avise o Caio.",
                      "reply": "Entendi, paro e anoto a hora para contar ao Caio."
                    },
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:1b",
                      "label": "Siga o turno e conte só se o zumbido piorar, para não atrasar ninguém.",
                      "reply": "Hum, então eu continuo e fico de olho no barulho."
                    },
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:1c",
                      "label": "Abra a capa do tubo e olhe por dentro para achar a causa sozinha.",
                      "reply": "Abrir a capa, é? Não sei se eu saberia o que procurar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m19:aula-06:i3:1a"
                },
                {
                  "id": "turn:rtg-2026:m19:aula-06:i3:2",
                  "line": "O painel mostrou um aviso de arco. Posso apertar o botão de limpar e seguir?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:2a",
                      "label": "Limpe, sim: se o aviso voltar, você chama alguém.",
                      "reply": "Tá, limpo e vejo se aparece de novo."
                    },
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:2b",
                      "label": "Limpe e reinicie o equipamento, que costuma resolver.",
                      "reply": "Reiniciar tudo me parece sério, mas se costuma resolver..."
                    },
                    {
                      "id": "option:rtg-2026:m19:aula-06:i3:2c",
                      "label": "Não limpe: anote o aviso e peça apoio à equipe.",
                      "reply": "Combinado, deixo o aviso como está e chamo a equipe."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m19:aula-06:i3:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante dessa sugestão de Duda?"
            },
            "help": "O aquecimento do tubo é definido por quem fabrica e por quem faz a manutenção, não pelo aluno.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: o aquecimento segue o fabricante e o serviço, e a dúvida vai para a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Num turno simulado, o equipamento ficou desligado desde cedo, e a primeira exposição está marcada. Duda sugere ir direto para ela, sem a rotina de aquecimento do tubo que o serviço definiu, para ganhar tempo. Caio está em outra sala.",
              "prompt": "O que você faz diante dessa sugestão de Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:m19:aula-06:i4:a",
                  "label": "Paro, lembro que o aquecimento segue o fabricante e aviso o Caio",
                  "explanation": "Isso: o aquecimento segue o fabricante e o serviço, e a dúvida vai para a equipe."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i4:b",
                  "label": "Sigo com a exposição e anoto depois que não houve aquecimento",
                  "explanation": "Pular o aquecimento que o serviço definiu ignora a recomendação do fabricante, e anotar depois não desfaz a exposição."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i4:c",
                  "label": "Faço uma exposição curta de teste por conta própria para aquecer o tubo",
                  "explanation": "O aquecimento segue o fabricante e o serviço; improvisar por conta própria não é decisão do aluno."
                },
                {
                  "id": "option:rtg-2026:m19:aula-06:i4:d",
                  "label": "Pulo o aquecimento só desta vez, já que é uma simulação",
                  "explanation": "Simulação é treino do procedimento certo; pular o aquecimento treina o hábito errado."
                }
              ],
              "correctOptionId": "option:rtg-2026:m19:aula-06:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m19:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m19:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: O tubo de um equipamento simulado mostra um aviso de calor no painel. Julgue cada conduta do estudante."
            },
            "help": "Pergunte de cada conduta se ela deixa a decisão com a equipe.",
            "type": "true-false",
            "feedback": {
              "correct": "Isso: você parou, anotou e avisou, sem decidir pelo equipamento.",
              "incorrect": "Releia o conceito: o estudante para, anota e avisa; abrir, limpar e reiniciar não são dele."
            },
            "payload": {
              "prompt": "O tubo de um equipamento simulado mostra um aviso de calor no painel. Julgue cada conduta do estudante.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m19:aula-06:i5:1",
                  "text": "Anotar o texto do aviso e a hora, e avisar a equipe.",
                  "isTrue": true,
                  "explanation": "Certo: o aviso e a hora ajudam quem vai avaliar o tubo, e a equipe precisa saber."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-06:i5:2",
                  "text": "Reiniciar o equipamento para o aviso sumir e seguir o turno.",
                  "isTrue": false,
                  "explanation": "Errado: reiniciar apaga o sinal sem avaliar a causa, e a decisão não é do aluno."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-06:i5:3",
                  "text": "Estimar sozinho quanto calor o tubo ainda aguenta e continuar.",
                  "isTrue": false,
                  "explanation": "Errado: o limite do tubo é definido pelo fabricante e pelo serviço, e não por estimativa do aluno."
                },
                {
                  "id": "statement:rtg-2026:m19:aula-06:i5:4",
                  "text": "Parar de expor e esperar a orientação da equipe.",
                  "isTrue": true,
                  "explanation": "Certo: parar evita sobrecarregar o tubo enquanto a equipe decide o que fazer."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m19:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe parar e avisar",
            "body": "Agora você consegue reconhecer sinais de sobrecarga ou falha do tubo, parar, anotar o que viu e avisar a equipe, sem abrir, limpar o aviso ou reiniciar o equipamento sozinho.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Avisar cedo evita um dano maior. É o cuidado mais valioso que você tem."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m19",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-01"
        ],
        "prompt": "Qual bloco do gerador faz a tensão passar a ter um só sentido?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-01:c1:a",
            "label": "O retificador, a ponte de diodos"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c1:b",
            "label": "O transformador de alta tensão"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c1:c",
            "label": "O transformador do filamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c1:d",
            "label": "A rede elétrica"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-01:c1:a",
        "feedback": {
          "correct": "Isso: a ponte de diodos mantém a corrente num só sentido antes do tubo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-01"
        ],
        "prompt": "Qual bloco entrega ao filamento a corrente que o aquece?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-01:c2:a",
            "label": "O retificador"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c2:b",
            "label": "O transformador menor, o do filamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c2:c",
            "label": "O transformador de alta tensão do esquema"
          },
          {
            "id": "option:rtg-2026:m19:aula-01:c2:d",
            "label": "O próprio tubo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-01:c2:b",
        "feedback": {
          "correct": "Isso: o bloco menor, embaixo no esquema, é quem alimenta o filamento.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikipedia-x-ray-tube"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-02"
        ],
        "prompt": "Por que a tensão elevada passa pelo retificador antes de chegar ao tubo?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-02:c1:a",
            "label": "Para elevar ainda mais a tensão"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c1:b",
            "label": "Para chegar ao tubo num só sentido"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c1:c",
            "label": "Para aquecer o filamento do cátodo"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c1:d",
            "label": "Para zerar a corrente do tubo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-02:c1:b",
        "feedback": {
          "correct": "Isso: o retificador mantém a tensão num sentido só antes do tubo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikipedia-retificador"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-02"
        ],
        "prompt": "Um traçado mostra tensão sempre no mesmo sentido, mas com queda a zero a cada meio ciclo. O que ele tem de grande?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-02:c2:a",
            "label": "O número de espiras do secundário"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c2:b",
            "label": "A corrente do filamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c2:c",
            "label": "A resistência do tubo"
          },
          {
            "id": "option:rtg-2026:m19:aula-02:c2:d",
            "label": "A ondulação, pois a tensão oscila muito"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-02:c2:d",
        "feedback": {
          "correct": "Isso: a queda a zero a cada meio ciclo é ondulação grande.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikipedia-retificador"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-03"
        ],
        "prompt": "Que parte do tubo libera os elétrons quando está aquecida?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-03:c1:a",
            "label": "O alvo do ânodo"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c1:b",
            "label": "O filamento aquecido"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c1:c",
            "label": "A janela de saída"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c1:d",
            "label": "A ampola de vidro"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-03:c1:b",
        "feedback": {
          "correct": "Isso: o fio quente do cátodo é a fonte dos elétrons.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-03"
        ],
        "prompt": "O que a corrente do tubo, em mA, representa?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-03:c2:a",
            "label": "A energia de cada fóton emitido"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c2:b",
            "label": "A corrente que aquece o filamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c2:c",
            "label": "O fluxo de elétrons do cátodo ao ânodo"
          },
          {
            "id": "option:rtg-2026:m19:aula-03:c2:d",
            "label": "A tensão entre cátodo e ânodo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-03:c2:c",
        "feedback": {
          "correct": "Isso: a corrente do tubo é o fluxo de elétrons entre os dois eletrodos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-04"
        ],
        "prompt": "Por que o disco do ânodo gira durante a exposição?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-04:c1:a",
            "label": "Para o feixe de elétrons girar junto"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c1:b",
            "label": "Para liberar mais elétrons do filamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c1:c",
            "label": "Para elevar a tensão do tubo"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c1:d",
            "label": "Para espalhar o calor por toda a pista"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: a rotação distribui o calor pelo anel, e não por um ponto.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:wikipedia-x-ray-tube"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-04"
        ],
        "prompt": "Dois tubos iguais recebem a mesma energia no alvo, mas um tem ponto focal menor. O que acontece nele?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-04:c2:a",
            "label": "O calor fica mais concentrado na pista"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c2:b",
            "label": "O calor fica mais espalhado na pista"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c2:c",
            "label": "Mais energia vira raios X do que calor"
          },
          {
            "id": "option:rtg-2026:m19:aula-04:c2:d",
            "label": "O disco deixa de precisar girar"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-04:c2:a",
        "feedback": {
          "correct": "Isso: a mesma energia numa área menor deixa o calor mais concentrado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x",
          "source:rtg-2026:m19:wikipedia-x-ray-tube"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-05"
        ],
        "prompt": "O que o mAs muda no feixe de raios X?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-05:c1:a",
            "label": "A energia máxima dos fótons"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c1:b",
            "label": "A posição dos picos característicos"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c1:c",
            "label": "A quantidade de fótons, e não a energia"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c1:d",
            "label": "A parte do espectro removida pelo filtro"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-05:c1:c",
        "feedback": {
          "correct": "Isso: o mAs muda a quantidade, e a energia acompanha kV e filtração.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-05"
        ],
        "prompt": "O que a filtração faz com o feixe?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-05:c2:a",
            "label": "Sobe a energia máxima e a quantidade"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c2:b",
            "label": "Tira fótons de baixa energia e sobe a energia média"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c2:c",
            "label": "Tira fótons de alta energia e desce a energia média"
          },
          {
            "id": "option:rtg-2026:m19:aula-05:c2:d",
            "label": "Muda o metal do alvo e a posição dos picos"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-05:c2:b",
        "feedback": {
          "correct": "Isso: o feixe fica com menos fótons, mas com energia média maior.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:wikibooks-fonte-raios-x"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-06"
        ],
        "prompt": "Qual destes sinais do tubo você anota e comunica à equipe?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-06:c1:a",
            "label": "Mensagem de arco no painel durante a exposição"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c1:b",
            "label": "O som habitual do disco girando antes da exposição"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c1:c",
            "label": "Filamento aquecido antes da exposição"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c1:d",
            "label": "Raios X saindo pela janela do tubo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-06:c1:a",
        "feedback": {
          "correct": "Isso: aviso de arco foge do habitual, e a equipe precisa saber.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:spellman-falhas-de-tubo"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m19:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m19:aula-06"
        ],
        "prompt": "Quem define o aquecimento do tubo antes do uso?",
        "options": [
          {
            "id": "option:rtg-2026:m19:aula-06:c2:a",
            "label": "O estudante, pelo tempo que tiver"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c2:b",
            "label": "O paciente do exame"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c2:c",
            "label": "A última imagem feita no equipamento"
          },
          {
            "id": "option:rtg-2026:m19:aula-06:c2:d",
            "label": "O fabricante e o serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m19:aula-06:c2:d",
        "feedback": {
          "correct": "Isso: o aquecimento segue o fabricante e o serviço, e o aluno não o decide.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m19:spellman-falhas-de-tubo"
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
      "claimId": "interaction:rtg-2026:m19:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-01:i3:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-01:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-01:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-01:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-01:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-01:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m19:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m19:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-02:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m19:aula-02:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m19:aula-02:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-02:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-02:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-02:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-02:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-02:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-02:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-02:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-02:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador",
        "source:rtg-2026:m19:openstax-up2-transformadores",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-retificador"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-03:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m19:aula-03:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-03:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-03:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-03:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-03:i4:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-03:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-emissao-termionica"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "group:rtg-2026:m19:aula-04:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "group:rtg-2026:m19:aula-04:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-04:i3:7",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m19:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m19:aula-04:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-04:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-04:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m19:aula-04:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m19:aula-04:i4:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "token:rtg-2026:m19:aula-04:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "point:rtg-2026:m19:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "label:rtg-2026:m19:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-05:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-05:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-05:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-05:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m19:aula-05:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "group:rtg-2026:m19:aula-05:i5:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "group:rtg-2026:m19:aula-05:i5:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-05:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "item:rtg-2026:m19:aula-05:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:openstax-cp-raios-x",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:openstax-cp-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "region:rtg-2026:m19:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "region:rtg-2026:m19:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "region:rtg-2026:m19:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "region:rtg-2026:m19:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m19:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:1a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m19:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i3:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-06:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-06:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m19:aula-06:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m19:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo",
        "source:rtg-2026:m19:wikibooks-fonte-raios-x"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "step:rtg-2026:m19:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:wikibooks-fonte-raios-x",
        "source:rtg-2026:m19:wikipedia-x-ray-tube",
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m19:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "option:rtg-2026:m19:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m19:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m19:spellman-falhas-de-tubo"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m19:aula-01",
        "hook": "Complete a frase: a rede entrega tensão alternada, e o transformador de alta tensão a...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-01"
          ],
          "prompt": "Qual é o papel do transformador de alta tensão no gerador?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-01:rg:a",
              "label": "Fazer a corrente passar num só sentido"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rg:b",
              "label": "Aquecer o filamento do cátodo"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rg:c",
              "label": "Guardar a tensão para a exposição"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rg:d",
              "label": "Elevar a tensão alternada da rede"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-01:rg:d",
          "feedback": {
            "correct": "Isso: ele eleva a tensão alternada antes de o retificador agir.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:openstax-up2-transformadores"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-01"
          ],
          "prompt": "Um colega aponta no esquema o transformador menor e diz que ele eleva a tensão do tubo. Que correção você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-01:rt:a",
              "label": "Ele retifica a tensão do tubo, como a ponte de diodos"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rt:b",
              "label": "Ele liga o tubo diretamente à rede elétrica"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rt:c",
              "label": "Ele alimenta o filamento; quem eleva é o de alta tensão"
            },
            {
              "id": "option:rtg-2026:m19:aula-01:rt:d",
              "label": "Ele está certo: os dois elevam a tensão"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-01:rt:c",
          "feedback": {
            "correct": "Isso: o menor cuida do filamento, e o elevador de tensão é o outro.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:openstax-up2-transformadores"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m19:aula-02",
        "hook": "Complete a frase: retificar é manter a tensão num só...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-02"
          ],
          "prompt": "O que a ponte de diodos faz com a tensão alternada?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-02:rg:a",
              "label": "Eleva a tensão pelo número de espiras"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rg:b",
              "label": "Aquece o filamento do cátodo"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rg:c",
              "label": "Mantém a tensão num só sentido"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rg:d",
              "label": "Guarda a tensão até a exposição"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-02:rg:c",
          "feedback": {
            "correct": "Isso: a ponte vira o meio ciclo invertido e mantém um sentido.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikipedia-retificador"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-02"
          ],
          "prompt": "Um traçado mostra tensão num só sentido, quase constante, com ondulação pequena. Que gerador do esquema produz esse traçado?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-02:rt:a",
              "label": "Um gerador de alta frequência"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rt:b",
              "label": "Um gerador só com a ponte de diodos"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rt:c",
              "label": "Um gerador sem o retificador"
            },
            {
              "id": "option:rtg-2026:m19:aula-02:rt:d",
              "label": "Um gerador com mais espiras no primário"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-02:rt:a",
          "feedback": {
            "correct": "Isso: o gerador de alta frequência deixa a tensão perto de constante, com pouca ondulação.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikibooks-fonte-raios-x"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m19:aula-03",
        "hook": "Complete a frase: o fio quente do cátodo libera...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-03"
          ],
          "prompt": "O que acontece com os elétrons depois que o filamento os libera?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-03:rg:a",
              "label": "A alta tensão os acelera até o ânodo"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rg:b",
              "label": "Saem pela janela como raios X"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rg:c",
              "label": "Voltam ao transformador do filamento"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rg:d",
              "label": "Aquecem a ampola de vidro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-03:rg:a",
          "feedback": {
            "correct": "Isso: a alta tensão leva os elétrons ao alvo do ânodo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:openstax-cp-raios-x"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-03"
          ],
          "prompt": "Um esquema mostra o filamento mais quente com a mesma alta tensão. O que muda?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-03:rt:a",
              "label": "A energia máxima dos fótons sobe pelo mesmo motivo"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rt:b",
              "label": "A tensão do tubo cai a zero"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rt:c",
              "label": "Os elétrons passam a sair do ânodo"
            },
            {
              "id": "option:rtg-2026:m19:aula-03:rt:d",
              "label": "Saem mais elétrons e a corrente do tubo sobe"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-03:rt:d",
          "feedback": {
            "correct": "Isso: filamento mais quente libera mais elétrons e aumenta a corrente do tubo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:openstax-cp-raios-x",
            "source:rtg-2026:m19:wikibooks-fonte-raios-x",
            "source:rtg-2026:m19:wikipedia-emissao-termionica"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m19:aula-04",
        "hook": "Complete a frase: o ponto da pista onde os elétrons batem é o ponto...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-04"
          ],
          "prompt": "Como se chama o ponto da pista onde os elétrons batem?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-04:rg:a",
              "label": "Foco do filamento"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rg:b",
              "label": "Ponto focal"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rg:c",
              "label": "Cubo do disco"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rg:d",
              "label": "Janela de saída"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-04:rg:b",
          "feedback": {
            "correct": "Isso: o ponto focal é a região de impacto dos elétrons na pista.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikipedia-x-ray-tube"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-04"
          ],
          "prompt": "Dois tubos iguais fazem a mesma exposição: num o disco gira, no outro está parado. Em qual o calor fica mais espalhado?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-04:rt:a",
              "label": "No de disco parado, pelo anel inteiro"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rt:b",
              "label": "Nos dois, pois o ponto focal é o mesmo"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rt:c",
              "label": "No de disco girando, pelo anel inteiro"
            },
            {
              "id": "option:rtg-2026:m19:aula-04:rt:d",
              "label": "Em nenhum, pois o calor sai pela janela"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-04:rt:c",
          "feedback": {
            "correct": "Isso: a rotação distribui o calor pela pista toda.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikipedia-x-ray-tube"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m19:aula-05",
        "hook": "Complete a frase: a filtração tira os fótons de...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-05"
          ],
          "prompt": "Que fótons a filtração tira do feixe?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-05:rg:a",
              "label": "Os de energia máxima"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rg:b",
              "label": "Os da radiação característica"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rg:c",
              "label": "Os que saem pela janela"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rg:d",
              "label": "Os de baixa energia"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-05:rg:d",
          "feedback": {
            "correct": "Isso: o filtro absorve sobretudo os fótons de baixa energia.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikibooks-fonte-raios-x"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-05"
          ],
          "prompt": "Um esquema mostra o mesmo feixe com um filtro a mais. O que acontece?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-05:rt:a",
              "label": "A energia média sobe e a quantidade cai"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rt:b",
              "label": "A energia média desce e a quantidade sobe"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rt:c",
              "label": "A energia média sobe e a quantidade sobe junto"
            },
            {
              "id": "option:rtg-2026:m19:aula-05:rt:d",
              "label": "Nada muda, só o kV mexe no feixe"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-05:rt:a",
          "feedback": {
            "correct": "Isso: menos fótons de baixa energia deixam o feixe menos numeroso e mais energético em média.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:wikibooks-fonte-raios-x"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m19:aula-06",
        "hook": "Complete a frase: diante de um sinal do tubo, eu paro, anoto e...",
        "guided": {
          "id": "recovery-item:rtg-2026:m19:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-06"
          ],
          "prompt": "Qual é o passo seguinte depois de parar e anotar o que viu?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-06:rg:a",
              "label": "Reiniciar o equipamento"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rg:b",
              "label": "Avisar a equipe"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rg:c",
              "label": "Abrir a capa do tubo"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rg:d",
              "label": "Limpar o aviso do painel"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-06:rg:b",
          "feedback": {
            "correct": "Isso: depois de parar e anotar, a equipe decide o que fazer.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:spellman-falhas-de-tubo"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m19:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m19:aula-06"
          ],
          "prompt": "Numa simulação, depois de várias exposições seguidas, o painel bloqueia a próxima e mostra uma contagem de espera. Qual é a conduta do estudante?",
          "options": [
            {
              "id": "option:rtg-2026:m19:aula-06:rt:a",
              "label": "Reiniciar o equipamento para liberar a exposição"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rt:b",
              "label": "Desligar o aviso e seguir com a série"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rt:c",
              "label": "Esperar sem forçar, anotar e avisar a equipe"
            },
            {
              "id": "option:rtg-2026:m19:aula-06:rt:d",
              "label": "Trocar de tubo por conta própria"
            }
          ],
          "correctOptionId": "option:rtg-2026:m19:aula-06:rt:c",
          "feedback": {
            "correct": "Isso: você respeita o bloqueio, registra o que viu e deixa a decisão com a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m19:spellman-falhas-de-tubo"
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
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "134c55e0b53ce306b72e824ab1d1431c222582d1fab02f8be000c3c078063992"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
