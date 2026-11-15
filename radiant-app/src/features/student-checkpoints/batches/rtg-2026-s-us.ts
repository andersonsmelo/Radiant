// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_S_US: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:s-us",
  "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8",
  "trackId": "track:rtg-2026:s-us",
  "unitId": "unit:rtg-2026:s-us",
  "contentVersion": "rtg-2026-s-us-v1",
  "competencyIds": [
    "competency:rtg-2026:s-us:aula-01",
    "competency:rtg-2026:s-us:aula-02",
    "competency:rtg-2026:s-us:aula-03",
    "competency:rtg-2026:s-us:aula-04",
    "competency:rtg-2026:s-us:aula-05",
    "competency:rtg-2026:s-us:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:s-us:nibib-us",
      "title": "Ultrasound",
      "publisher": "NIBIB, National Institutes of Health",
      "url": "https://www.nibib.nih.gov/science-education/science-topics/ultrasound",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página institucional do NIBIB; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-us:fda-us",
      "title": "Ultrasound Imaging",
      "publisher": "U.S. Food and Drug Administration",
      "url": "https://www.fda.gov/radiation-emitting-products/medical-imaging/ultrasound-imaging",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página institucional da FDA; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-us:radiologyinfo-us",
      "title": "General Ultrasound",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/genus",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página de informação ao paciente; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-us:aium-alara",
      "title": "As Low As Reasonably Achievable (ALARA) Principle",
      "publisher": "American Institute of Ultrasound in Medicine (AIUM)",
      "url": "https://www.aium.org/resources/official-statements/view/as-low-as-reasonably-achievable-(alara)-principle",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Declaração oficial da AIUM; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-us:acep-physics",
      "title": "Ultrasound Physics, SonoGuide",
      "publisher": "American College of Emergency Physicians (ACEP)",
      "url": "https://acep.org/sonoguide/physics.html",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página educacional; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-us:lei-12842-2013",
      "title": "Lei nº 12.842, de 10 de julho de 2013",
      "publisher": "Presidência da República, Planalto",
      "url": "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12842.htm",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal; consultado para o art. 4º, VII e § 7º, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:s-us:aula-01",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics",
          "source:rtg-2026:s-us:nibib-us",
          "source:rtg-2026:s-us:fda-us"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Som, frequência e eco",
            "body": "Hoje você vai conseguir relacionar frequência, comprimento de onda e eco ao que o aparelho de ultrassom mede.",
            "dialogue": {
              "setting": "Sala de ultrassonografia (simulação)",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Aqui o feixe não é de raios X. O aparelho manda som para dentro do corpo e fica escutando."
                },
                {
                  "speaker": "duda",
                  "text": "Escutando o quê? Som não tira foto de ninguém."
                },
                {
                  "speaker": "pixel",
                  "text": "Se ele só recebe ecos, o que precisa medir para saber a que distância algo ficou?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Som que volta",
            "body": "O ultrassom é som com frequência acima da que o ouvido humano capta, acima de 20 kHz, e a maioria dos transdutores trabalha em megahertz. É onda mecânica e não usa radiação ionizante. Quando o pulso chega à fronteira entre dois tecidos, parte dele volta como eco. O aparelho mede o tempo de retorno e, com a velocidade do som em tecido mole, cerca de 1540 m/s, estima a distância. Pela relação v = f × λ, com a velocidade fixa, dobrar a frequência reduz o comprimento de onda à metade.",
            "keyPoints": [
              "Ultrassom é som acima de 20 kHz, em geral na faixa dos megahertz.",
              "O eco nasce na fronteira entre tecidos; o tempo de retorno dá a distância.",
              "Com velocidade fixa, frequência maior significa comprimento de onda menor."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num mesmo meio, a velocidade da onda é fixa. Se a frequência cai à metade, o que acontece com o comprimento de onda?"
            },
            "help": "Teste com números: dois valores cujo produto é 12.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Com v = f × λ e v fixa, o que a frequência perde o comprimento de onda ganha: ele dobra.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num mesmo meio, a velocidade da onda é fixa. Se a frequência cai à metade, o que acontece com o comprimento de onda?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-01:i1:a",
                  "label": "Dobra",
                  "explanation": "Com v = f × λ e v fixa, o que a frequência perde o comprimento de onda ganha: ele dobra."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i1:b",
                  "label": "Cai à metade",
                  "explanation": "Cair junto seria proporção direta, e o produto f × λ deixaria de ser constante. Retome a relação."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i1:c",
                  "label": "Não muda",
                  "explanation": "Se λ não mudasse e f caísse, a velocidade cairia. Confira a condição do enunciado."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i1:d",
                  "label": "Cai a um quarto",
                  "explanation": "Um quarto é marca do inverso do quadrado, que não vale aqui. O fator é o mesmo nos dois lados."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-01:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Ultra vem de além. Quantos hertz tem um megahertz?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: ultrassom é som acima de 20 kHz, e a faixa típica dos transdutores é a dos megahertz.",
              "incorrect": "Pense no prefixo: ultra quer dizer além do audível, e os transdutores usam milhões de hertz, não milhares nem bilhões."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "O ultrassom tem frequência ",
                " da que o ouvido humano capta, e a maioria dos transdutores opera na faixa dos ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:s-us:aula-01:i2:4",
                  "label": "quilohertz"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-01:i2:5",
                  "label": "gigahertz"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-01:i2:3",
                  "label": "abaixo"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-01:i2:1",
                  "label": "acima"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-01:i2:2",
                  "label": "megahertz"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:s-us:aula-01:i2:1",
                  "correctTokenId": "token:rtg-2026:s-us:aula-01:i2:1"
                },
                {
                  "id": "blank:rtg-2026:s-us:aula-01:i2:2",
                  "correctTokenId": "token:rtg-2026:s-us:aula-01:i2:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o som e o eco."
            },
            "help": "Pergunte: que tipo de onda é essa e o que volta para o aparelho?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que o aparelho mede da natureza da onda.",
              "incorrect": "Retome o conceito: o ultrassom é som, e o tempo de retorno do eco é o que vira distância."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o som e o eco.",
              "statements": [
                {
                  "id": "statement:rtg-2026:s-us:aula-01:i3:1",
                  "text": "O aparelho estima a distância pelo tempo de retorno do eco.",
                  "isTrue": true,
                  "explanation": "Certo: ele mede o tempo de cada eco e usa a velocidade do som no tecido."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-01:i3:2",
                  "text": "O ultrassom é uma onda eletromagnética, como os raios X.",
                  "isTrue": false,
                  "explanation": "Errado: é som, onda mecânica que precisa de matéria para se propagar."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-01:i3:3",
                  "text": "No mesmo meio, frequência maior dá comprimento de onda maior.",
                  "isTrue": false,
                  "explanation": "Errado: com velocidade fixa, f × λ não muda, então frequência maior encurta o comprimento de onda."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-01:i3:4",
                  "text": "O ultrassom diagnóstico não usa radiação ionizante.",
                  "isTrue": true,
                  "explanation": "Certo: o ultrassom é som, e não produz radiação ionizante como a dos raios X."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Em que ponto do caminho do pulso nasce o eco que o aparelho aproveita?"
            },
            "help": "Pense no que o pulso encontra pelo caminho.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O pulso reflete parcialmente onde muda o tecido, e esse retorno é o eco.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Em que ponto do caminho do pulso nasce o eco que o aparelho aproveita?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-01:i4:a",
                  "label": "Dentro do próprio transdutor",
                  "explanation": "O transdutor emite e recebe, mas o eco vem de fora dele, do tecido."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i4:b",
                  "label": "Numa fronteira entre tecidos diferentes",
                  "explanation": "O pulso reflete parcialmente onde muda o tecido, e esse retorno é o eco."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i4:c",
                  "label": "Na pele, só quando há gel",
                  "explanation": "O gel ajuda a onda a entrar, mas não é ele que gera o eco."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i4:d",
                  "label": "Em qualquer ponto, sem mudança de meio",
                  "explanation": "Sem mudança de meio, quase nada volta. Retome: eco pede fronteira."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-01:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que o aparelho conclui sobre a fronteira do segundo eco?"
            },
            "help": "Qual grandeza o aparelho mede em cada eco?",
            "type": "case-decision",
            "feedback": {
              "correct": "Quanto maior o tempo de retorno, maior a distância percorrida.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na tela de simulação, o mesmo pulso gerou dois ecos pela mesma linha: o primeiro voltou depressa e o segundo voltou bem mais tarde.",
              "prompt": "O que o aparelho conclui sobre a fronteira do segundo eco?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-01:i5:a",
                  "label": "Ela está mais perto do transdutor",
                  "explanation": "Mais perto devolveria o eco mais cedo, como o primeiro."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i5:b",
                  "label": "Ela é de um tecido mais rígido",
                  "explanation": "O tempo de retorno mede distância; ele sozinho não diz a rigidez."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i5:c",
                  "label": "Ela está mais longe do transdutor",
                  "explanation": "Quanto maior o tempo de retorno, maior a distância percorrida."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-01:i5:d",
                  "label": "Ela está à mesma distância da primeira",
                  "explanation": "Distâncias iguais dariam o mesmo tempo de retorno."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-01:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "O que o aparelho mede",
            "body": "Você sabe que o ultrassom é som acima de 20 kHz, que o eco nasce nas fronteiras entre tecidos e que o tempo de retorno vira distância. Com velocidade fixa, frequência maior encurta o comprimento de onda.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quando a imagem parecer mágica, volte à pergunta: que tempo o aparelho mediu?"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-us:aula-02",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us",
          "source:rtg-2026:s-us:fda-us"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "O transdutor",
            "body": "Hoje você vai conseguir explicar o efeito piezoelétrico e para que serve o gel.",
            "dialogue": {
              "setting": "Sala de ultrassonografia (simulação)",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Esse aparelho tem alto-falante e microfone dentro do transdutor?"
                },
                {
                  "speaker": "caio",
                  "text": "Ele tem cristais especiais. Os mesmos cristais fazem as duas coisas."
                },
                {
                  "speaker": "lia",
                  "text": "Que propriedade permite a um só material emitir e receber som?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Cristal que fala e escuta",
            "body": "Os elementos ativos do transdutor são, em geral, cristais cerâmicos piezoelétricos. Quando recebem um campo elétrico, produzem som: é o pulso que sai. Quando o eco chega, o mesmo cristal produz um campo elétrico, que o aparelho lê. Entre a pele e o transdutor, o gel evita bolsas de ar, e o ar bloqueia as ondas. O caminho, na ordem ensinada nesta aula, é: sinal elétrico no cristal, pulso de som, reflexo numa fronteira, eco de volta ao cristal e cálculo da distância.",
            "keyPoints": [
              "O cristal piezoelétrico converte campo elétrico em som e som em campo elétrico.",
              "O gel evita bolsas de ar, que bloqueiam as ondas.",
              "Emitir e receber é trabalho do mesmo elemento."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior: o que o aparelho mede em cada eco para chegar à distância?"
            },
            "help": "Lembre o que o eco leva de volta ao aparelho.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Com a velocidade do som, o tempo vira distância.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior: o que o aparelho mede em cada eco para chegar à distância?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-02:i1:a",
                  "label": "A radiação absorvida",
                  "explanation": "O ultrassom não usa radiação ionizante."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i1:b",
                  "label": "O tempo de retorno",
                  "explanation": "Com a velocidade do som, o tempo vira distância."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i1:c",
                  "label": "A cor do tecido",
                  "explanation": "Cor não faz parte do que o eco informa."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i1:d",
                  "label": "A temperatura do cristal",
                  "explanation": "A temperatura não entra no cálculo da distância."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-02:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o caminho do pulso ao eco, na ordem ensinada nesta aula."
            },
            "help": "O cristal participa duas vezes: uma na saída e outra na volta.",
            "type": "ordering",
            "feedback": {
              "correct": "Isso: do sinal elétrico ao som, do eco de volta ao sinal e então à distância.",
              "incorrect": "Comece pelo que faz o cristal vibrar e termine no cálculo; o eco só existe depois do reflexo."
            },
            "payload": {
              "prompt": "Ordene o caminho do pulso ao eco, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-us:aula-02:i2:2",
                  "label": "O cristal produz o pulso de som"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-02:i2:5",
                  "label": "O aparelho calcula a distância pelo tempo"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-02:i2:3",
                  "label": "O pulso reflete numa fronteira entre tecidos"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-02:i2:4",
                  "label": "O eco volta e o cristal produz sinal elétrico"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-02:i2:1",
                  "label": "O aparelho aplica sinal elétrico ao cristal"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-us:aula-02:i2:1",
                "item:rtg-2026:s-us:aula-02:i2:2",
                "item:rtg-2026:s-us:aula-02:i2:3",
                "item:rtg-2026:s-us:aula-02:i2:4",
                "item:rtg-2026:s-us:aula-02:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre o cristal piezoelétrico."
            },
            "help": "A conversão acontece nos dois sentidos.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o cristal converte nos dois sentidos, e por isso emite e recebe.",
              "incorrect": "Retome o que sai e o que volta: nos dois sentidos o cristal converte entre eletricidade e som, não gera luz nem radiação."
            },
            "payload": {
              "prompt": "Complete a frase sobre o cristal piezoelétrico.",
              "segments": [
                "No cristal piezoelétrico, um campo elétrico aplicado produz ",
                ", e o som que chega produz ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:s-us:aula-02:i3:3",
                  "label": "calor"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-02:i3:5",
                  "label": "radiação ionizante"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-02:i3:4",
                  "label": "luz visível"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-02:i3:1",
                  "label": "som"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-02:i3:2",
                  "label": "campo elétrico"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:s-us:aula-02:i3:1",
                  "correctTokenId": "token:rtg-2026:s-us:aula-02:i3:1"
                },
                {
                  "id": "blank:rtg-2026:s-us:aula-02:i3:2",
                  "correctTokenId": "token:rtg-2026:s-us:aula-02:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Por que o gel entra entre a pele e o transdutor?"
            },
            "help": "O que o ar faz com o som?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O ar bloqueia as ondas, e o gel preenche esse espaço.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Por que o gel entra entre a pele e o transdutor?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-02:i4:a",
                  "label": "Para evitar bolsas de ar no caminho",
                  "explanation": "O ar bloqueia as ondas, e o gel preenche esse espaço."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i4:b",
                  "label": "Para aquecer o cristal e gerar mais eco",
                  "explanation": "O gel não aquece cristal nenhum, e o eco vem dos tecidos."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i4:c",
                  "label": "Para blindar o paciente contra radiação",
                  "explanation": "Não há radiação ionizante aqui, e gel não blinda."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i4:d",
                  "label": "Para deixar a pele mais clara na imagem",
                  "explanation": "A cor da pele não aparece na imagem."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-02:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você responde a Duda?"
            },
            "help": "Quantas vezes o cristal entra no caminho do pulso?",
            "type": "case-decision",
            "feedback": {
              "correct": "O cristal piezoelétrico produz som e também produz campo elétrico quando recebe o eco.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Duda desenha o transdutor com dois componentes: um alto-falante que emite e um microfone que recebe. Lia pergunta se isso corresponde ao que você estudou.",
              "prompt": "O que você responde a Duda?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-02:i5:a",
                  "label": "Sim, são sempre dois dispositivos sem relação",
                  "explanation": "Aqui o material é um só, que converte nos dois sentidos."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i5:b",
                  "label": "Não, o transdutor só emite e o eco é lido na pele",
                  "explanation": "A leitura acontece no próprio cristal, não na pele."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i5:c",
                  "label": "Sim, porque o gel faz a função do microfone",
                  "explanation": "O gel só preenche o espaço de ar; ele não detecta som."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-02:i5:d",
                  "label": "Em geral o mesmo cristal faz as duas conversões",
                  "explanation": "O cristal piezoelétrico produz som e também produz campo elétrico quando recebe o eco."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-02:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "O cristal e o gel",
            "body": "Você sabe que o cristal piezoelétrico converte campo elétrico em som e som em campo elétrico, e que o gel evita bolsas de ar. Consegue ordenar o caminho do pulso até a distância.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Na sala, quando a imagem some numa faixa, o ar costuma ser o primeiro suspeito."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-us:aula-03",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us",
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Frequência e profundidade",
            "body": "Hoje você vai conseguir prever que frequência mais alta melhora o detalhe e perde profundidade.",
            "dialogue": {
              "setting": "Laboratório didático de imagem",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Se frequência alta dá mais detalhe, por que ninguém usa só a mais alta possível?"
                },
                {
                  "speaker": "caio",
                  "text": "Porque tudo tem um preço. Tem um jeito de a onda mais fina ficar sem fôlego."
                },
                {
                  "speaker": "pixel",
                  "text": "Qual é o preço? Pense no que acontece com a onda quando ela viaja pelo tecido."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Detalhe contra alcance",
            "body": "Os transdutores diagnósticos usam, em geral, de 2 a 20 MHz. Frequência mais alta mostra mais detalhe, mas com menos penetração: as ondas são mais atenuadas ao longo da distância. Frequência mais baixa chega mais fundo, com menos detalhe. Por isso a escolha do transdutor depende do alvo. O transdutor linear, de frequência alta, serve a estruturas rasas e a vasos. O curvilíneo e o phased array, de frequência mais baixa, alcançam estruturas profundas do abdome ou entre as costelas. Aqui você aprende o princípio físico, não a escolher o exame.",
            "keyPoints": [
              "Frequência alta: mais detalhe, menos profundidade.",
              "Frequência baixa: mais profundidade, menos detalhe.",
              "O princípio explica por que há transdutores diferentes."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior: de que é feito o elemento ativo do transdutor, que converte campo elétrico em som e som em campo elétrico?"
            },
            "help": "Lembre o nome da propriedade do cristal.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A propriedade piezoelétrica do cristal faz a conversão nos dois sentidos.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior: de que é feito o elemento ativo do transdutor, que converte campo elétrico em som e som em campo elétrico?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-03:i1:a",
                  "label": "De gel condutor",
                  "explanation": "O gel só evita bolsas de ar entre a pele e o transdutor."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i1:b",
                  "label": "De chumbo laminado",
                  "explanation": "Chumbo é blindagem para radiação ionizante, que não está em jogo."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i1:c",
                  "label": "De fibra óptica",
                  "explanation": "Fibra óptica conduz luz, não converte eletricidade em som."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i1:d",
                  "label": "De cristal cerâmico",
                  "explanation": "A propriedade piezoelétrica do cristal faz a conversão nos dois sentidos."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-03:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dois transdutores: um de 3 MHz e outro de 12 MHz. Qual dá mais detalhe, mas alcança menos profundidade?"
            },
            "help": "Qual das duas frequências é atenuada mais depressa?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Frequência mais alta traz mais detalhe e perde penetração.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dois transdutores: um de 3 MHz e outro de 12 MHz. Qual dá mais detalhe, mas alcança menos profundidade?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-03:i2:a",
                  "label": "O de 3 MHz",
                  "explanation": "Frequência mais baixa penetra mais, com menos detalhe."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i2:b",
                  "label": "Os dois dão o mesmo detalhe",
                  "explanation": "A frequência muda a resolução, então eles diferem."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i2:c",
                  "label": "O de 12 MHz",
                  "explanation": "Frequência mais alta traz mais detalhe e perde penetração."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i2:d",
                  "label": "Nenhum, a profundidade independe da frequência",
                  "explanation": "Frequências mais altas são mais atenuadas, então a profundidade depende dela."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-03:i2:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada item pelo grupo de frequência a que ele se associa."
            },
            "help": "O alvo está perto da pele ou longe dela?",
            "type": "categorize",
            "feedback": {
              "correct": "Você ligou detalhe e alvo raso às frequências altas, e alcance e alvo profundo às baixas.",
              "incorrect": "Pergunte de cada item: o alvo é raso e pede detalhe, ou é fundo e pede alcance?"
            },
            "payload": {
              "prompt": "Classifique cada item pelo grupo de frequência a que ele se associa.",
              "categories": [
                {
                  "id": "group:rtg-2026:s-us:aula-03:i3:a",
                  "label": "Frequência mais alta"
                },
                {
                  "id": "group:rtg-2026:s-us:aula-03:i3:b",
                  "label": "Frequência mais baixa"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:s-us:aula-03:i3:5",
                  "label": "Alvo fundo no abdome",
                  "categoryId": "group:rtg-2026:s-us:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-03:i3:4",
                  "label": "Transdutor phased array",
                  "categoryId": "group:rtg-2026:s-us:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-03:i3:2",
                  "label": "Estrutura rasa sob a pele",
                  "categoryId": "group:rtg-2026:s-us:aula-03:i3:a"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-03:i3:3",
                  "label": "Transdutor curvilíneo",
                  "categoryId": "group:rtg-2026:s-us:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-03:i3:1",
                  "label": "Transdutor linear",
                  "categoryId": "group:rtg-2026:s-us:aula-03:i3:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Que explicação física você oferece primeiro?"
            },
            "help": "O que a frequência mais alta faz com a onda ao longo da distância?",
            "type": "case-decision",
            "feedback": {
              "correct": "A onda mais alta se perde antes de chegar fundo, e o eco não volta.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, uma estrutura funda deixou de aparecer depois que o transdutor foi trocado por outro de frequência mais alta. Duda acha que o aparelho quebrou.",
              "prompt": "Que explicação física você oferece primeiro?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-03:i4:a",
                  "label": "Frequência mais alta atenua mais e penetra menos",
                  "explanation": "A onda mais alta se perde antes de chegar fundo, e o eco não volta."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i4:b",
                  "label": "O gel perdeu efeito em frequências altas",
                  "explanation": "O gel evita ar; não depende da frequência."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i4:c",
                  "label": "O tempo de retorno ficou negativo",
                  "explanation": "O tempo de retorno não é negativo; o eco é que é fraco demais."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-03:i4:d",
                  "label": "O aparelho só mostra estruturas rasas",
                  "explanation": "Nada impede o aparelho de mostrar o fundo com frequência baixa."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-03:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre frequência e profundidade."
            },
            "help": "Cada ganho tem uma perda do outro lado.",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve a troca entre detalhe e alcance.",
              "incorrect": "Retome o conceito: frequência alta ganha detalhe e perde profundidade; baixa faz o contrário."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre frequência e profundidade.",
              "statements": [
                {
                  "id": "statement:rtg-2026:s-us:aula-03:i5:1",
                  "text": "Frequência baixa penetra mais fundo, mas mostra menos detalhe.",
                  "isTrue": true,
                  "explanation": "Certo: o ganho de alcance vem com perda de resolução."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-03:i5:2",
                  "text": "Aumentar a frequência sempre melhora a imagem em qualquer profundidade.",
                  "isTrue": false,
                  "explanation": "Errado: o ganho de detalhe vem com perda de penetração, e o fundo some."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-03:i5:3",
                  "text": "Os transdutores diagnósticos usam, em geral, de 2 a 20 MHz.",
                  "isTrue": true,
                  "explanation": "Certo: é a faixa típica dos transdutores diagnósticos."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Detalhe contra alcance",
            "body": "Você consegue prever que frequência alta melhora o detalhe e perde profundidade, e associa transdutores linear, curvilíneo e phased array a alvos rasos ou profundos, sem escolher o exame.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quando o fundo sumir, pense primeiro em frequência e atenuação."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-us:aula-04",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics",
          "source:rtg-2026:s-us:nibib-us"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Modos e apresentação",
            "body": "Hoje você vai conseguir distinguir modo B, modo M e Doppler pelo que cada um mostra.",
            "dialogue": {
              "setting": "Sala de ultrassonografia (simulação)",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "O aparelho tem botão de modo B, modo M e Doppler. É tudo a mesma imagem?"
                },
                {
                  "speaker": "caio",
                  "text": "Mesmo transdutor, jeitos diferentes de mostrar o eco."
                },
                {
                  "speaker": "pixel",
                  "text": "O que cada modo coloca na tela? Pense em brilho, em tempo e em movimento do sangue."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Um eco, vários jeitos de mostrar",
            "body": "O modo B, de brilho, dá a imagem estrutural em tons de cinza: quanto mais forte o eco, mais claro o ponto. O modo M, de movimento, registra os ecos de uma única linha do modo B ao longo do tempo, e mostra como as estruturas dessa linha se mexem. O Doppler mede e mostra fluxo, como o do sangue, com velocidade e direção; no Doppler colorido, um mapa de cores. A elastografia, outro recurso, mostra a rigidez relativa do tecido. Aqui você só separa o que cada modo mostra.",
            "keyPoints": [
              "Modo B: imagem em tons de cinza.",
              "Modo M: uma linha do modo B ao longo do tempo.",
              "Doppler: fluxo, com velocidade e direção."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior: o que aumenta quando a frequência sobe?"
            },
            "help": "Pense na troca entre detalhe e alcance.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Frequência mais alta melhora a resolução e penetra menos.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior: o que aumenta quando a frequência sobe?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-04:i1:a",
                  "label": "A profundidade, com perda de detalhe",
                  "explanation": "É o contrário: frequência alta penetra menos."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i1:b",
                  "label": "O detalhe e a profundidade juntos",
                  "explanation": "Há uma troca entre os dois."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i1:c",
                  "label": "O detalhe, com perda de profundidade",
                  "explanation": "Frequência mais alta melhora a resolução e penetra menos."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i1:d",
                  "label": "Nada, a imagem é igual",
                  "explanation": "A frequência altera a resolução e o alcance."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-04:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Associe cada recurso ao que ele mostra."
            },
            "help": "Pergunte de cada nome: ele mostra forma, movimento numa linha, fluxo ou rigidez?",
            "type": "matching",
            "feedback": {
              "correct": "Cada recurso mostra uma informação diferente a partir do mesmo som.",
              "incorrect": "Retome o conceito: o que cada um traz, brilho, movimento numa linha, fluxo ou rigidez."
            },
            "payload": {
              "prompt": "Associe cada recurso ao que ele mostra.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-us:aula-04:i2:1",
                  "left": "Modo B",
                  "right": "Imagem em tons de cinza, pela força do eco"
                },
                {
                  "id": "pair:rtg-2026:s-us:aula-04:i2:2",
                  "left": "Modo M",
                  "right": "Uma linha de ecos acompanhada ao longo do tempo"
                },
                {
                  "id": "pair:rtg-2026:s-us:aula-04:i2:3",
                  "left": "Doppler colorido",
                  "right": "Mapa de cores de fluxo, com velocidade e direção"
                },
                {
                  "id": "pair:rtg-2026:s-us:aula-04:i2:4",
                  "left": "Elastografia",
                  "right": "Rigidez relativa do tecido"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre os modos."
            },
            "help": "O que cada um coloca na tela?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou forma, movimento, fluxo e rigidez.",
              "incorrect": "Retome o conceito: cada recurso mostra uma informação diferente."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre os modos.",
              "statements": [
                {
                  "id": "statement:rtg-2026:s-us:aula-04:i3:1",
                  "text": "No modo B, o brilho de cada ponto reflete a força do eco.",
                  "isTrue": true,
                  "explanation": "Certo: o modo B converte a amplitude do eco em tons de cinza."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-04:i3:2",
                  "text": "O modo M mostra a imagem completa, sem relação com o tempo.",
                  "isTrue": false,
                  "explanation": "Errado: ele acompanha ao longo do tempo uma só linha do modo B."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-04:i3:3",
                  "text": "O Doppler mede fluxo, como o do sangue, com velocidade e direção.",
                  "isTrue": true,
                  "explanation": "Certo: é o recurso do aparelho para o fluxo."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-04:i3:4",
                  "text": "A elastografia mede a velocidade do sangue.",
                  "isTrue": false,
                  "explanation": "Errado: ela mostra a rigidez relativa do tecido."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Qual modo mostra o movimento de estruturas ao longo de uma única linha, com o tempo?"
            },
            "help": "O M de modo M vem de motion.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Ele registra uma linha do modo B ao longo do tempo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Qual modo mostra o movimento de estruturas ao longo de uma única linha, com o tempo?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-04:i4:a",
                  "label": "O modo B",
                  "explanation": "O modo B dá a imagem estrutural, sem a linha do tempo."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i4:b",
                  "label": "A elastografia",
                  "explanation": "Ela mostra rigidez, não movimento."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i4:c",
                  "label": "A imagem em três dimensões",
                  "explanation": "A imagem 3D mostra volume, não uma linha acompanhada no tempo."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-04:i4:d",
                  "label": "O modo M",
                  "explanation": "Ele registra uma linha do modo B ao longo do tempo."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-04:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase sobre um exame simulado de uma artéria do braço."
            },
            "help": "Além de para onde, o que mais descreve um fluxo em movimento?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: no vaso do braço, como em qualquer vaso, o Doppler mostra para onde e com que velocidade o sangue corre.",
              "incorrect": "Pense no que se mede num fluxo em movimento, e não no que o tecido é: espessura e densidade são do tecido."
            },
            "payload": {
              "prompt": "Complete a frase sobre um exame simulado de uma artéria do braço.",
              "segments": [
                "Na artéria do braço, o Doppler colorido mostra a direção e a ",
                " do fluxo de sangue."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:s-us:aula-04:i5:4",
                  "label": "densidade"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-04:i5:2",
                  "label": "espessura"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-04:i5:3",
                  "label": "temperatura"
                },
                {
                  "id": "token:rtg-2026:s-us:aula-04:i5:1",
                  "label": "velocidade"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:s-us:aula-04:i5:1",
                  "correctTokenId": "token:rtg-2026:s-us:aula-04:i5:1"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "O que cada modo mostra",
            "body": "Você consegue distinguir o modo B, o modo M e o Doppler pelo que cada um mostra, e lembrar que a elastografia mostra a rigidez relativa do tecido.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Mesmo som, informações diferentes: o modo é a pergunta que você faz ao eco."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-us:aula-05",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us",
          "source:rtg-2026:s-us:acep-physics",
          "source:rtg-2026:s-us:fda-us",
          "source:rtg-2026:s-us:aium-alara",
          "source:rtg-2026:s-us:radiologyinfo-us"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Artefatos e segurança",
            "body": "Hoje você vai conseguir reconhecer sombra e reforço como fenômenos físicos e aplicar o princípio de exposição mínima.",
            "dialogue": {
              "setting": "Sala de ultrassonografia (simulação)",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Atrás daquele ponto brilhante a imagem ficou escura. Algo deu errado?"
                },
                {
                  "speaker": "lia",
                  "text": "Não necessariamente. Que fenômeno do som poderia produzir isso?"
                },
                {
                  "speaker": "caio",
                  "text": "E tem mais: ultrassom não usa radiação ionizante, mas também não é sem limite."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Sombra, reforço e exposição mínima",
            "body": "A sombra acústica aparece atrás de refletores fortes, como ar, cálculos ou osso, porque o som é refletido ou absorvido e quase nada passa. O reforço posterior aparece atrás de uma estrutura cheia de líquido e sem ecos: o som sofre pouca atenuação ali, e a região além dela parece mais clara. São fenômenos físicos do som, não diagnóstico. Sobre segurança: o ultrassom não usa radiação ionizante, mas sua energia pode aquecer levemente os tecidos e causar cavitação. Vale o princípio de exposição mínima, conhecido pela sigla em inglês Alara: o menor necessário para a imagem diagnóstica.",
            "keyPoints": [
              "Sombra: atrás de refletor forte; reforço: atrás de líquido sem ecos.",
              "Ambos nascem da forma como o som é refletido ou atenuado.",
              "Exposição mínima: só o necessário para a imagem."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula 2: por que o gel entra entre a pele e o transdutor?"
            },
            "help": "Lembre o que o ar faz com o som.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O ar bloqueia as ondas; sem ele, a onda entra no corpo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula 2: por que o gel entra entre a pele e o transdutor?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-05:i1:a",
                  "label": "Para esfriar o cristal piezoelétrico",
                  "explanation": "O gel não regula a temperatura do cristal."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i1:b",
                  "label": "Para filtrar a radiação do ambiente",
                  "explanation": "Não há radiação ionizante em jogo."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i1:c",
                  "label": "Para evitar bolsas de ar no caminho",
                  "explanation": "O ar bloqueia as ondas; sem ele, a onda entra no corpo."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i1:d",
                  "label": "Para aumentar a frequência do pulso",
                  "explanation": "O gel não muda a frequência."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-05:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as afirmações certas sobre sombra e reforço."
            },
            "help": "Pergunte: atrás do quê o som passa pouco, e atrás do quê passa quase sem perda?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou os três enunciados que descrevem a física dos dois fenômenos.",
              "incorrect": "Releia o conceito: sombra atrás de refletor forte, reforço atrás de líquido, ambos efeitos do som no tecido."
            },
            "payload": {
              "prompt": "Marque todas as afirmações certas sobre sombra e reforço.",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-05:i2:a",
                  "label": "A sombra surge quando o eco volta mais forte do que o esperado",
                  "explanation": "Na sombra, volta um sinal muito mais fraco de trás do refletor."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i2:b",
                  "label": "A sombra aparece atrás de refletores fortes, como ar ou osso",
                  "explanation": "Certo: o som é refletido ou absorvido e quase nada passa."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i2:c",
                  "label": "O reforço aparece atrás de estruturas sólidas e densas",
                  "explanation": "O reforço vem atrás de estrutura cheia de líquido, não atrás de algo denso."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i2:d",
                  "label": "O reforço aparece atrás de uma estrutura cheia de líquido",
                  "explanation": "Certo: o líquido atenua pouco, e a região de trás parece mais clara."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i2:e",
                  "label": "Os dois fenômenos vêm de como o som é refletido ou atenuado",
                  "explanation": "Certo: são efeitos físicos do som no tecido."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:s-us:aula-05:i2:b",
                "option:rtg-2026:s-us:aula-05:i2:d",
                "option:rtg-2026:s-us:aula-05:i2:e"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre segurança no ultrassom."
            },
            "help": "O que a falta de radiação ionizante garante, e o que não garante?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou ausência de radiação ionizante de ausência de cuidado.",
              "incorrect": "Retome: sem radiação ionizante não significa sem efeitos; a exposição deve ser a necessária."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre segurança no ultrassom.",
              "statements": [
                {
                  "id": "statement:rtg-2026:s-us:aula-05:i3:1",
                  "text": "O princípio de exposição mínima mantém só o necessário para a imagem diagnóstica.",
                  "isTrue": true,
                  "explanation": "Certo: a FDA e a AIUM pedem a menor exposição que ainda dê a informação diagnóstica."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-05:i3:2",
                  "text": "Sem radiação ionizante, o ultrassom dispensa qualquer cuidado com tempo e potência.",
                  "isTrue": false,
                  "explanation": "Errado: a energia pode aquecer levemente os tecidos, e o tempo de exposição deve ser o necessário."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-05:i3:3",
                  "text": "A energia do ultrassom pode aquecer levemente os tecidos.",
                  "isTrue": true,
                  "explanation": "Certo: o aquecimento leve e a cavitação são efeitos possíveis."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-05:i3:4",
                  "text": "Gravar vídeo de lembrança sem indicação é prática recomendada.",
                  "isTrue": false,
                  "explanation": "Errado: o uso não médico é desencorajado."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Como você responde nessa situação?"
            },
            "help": "O que a indicação do exame inclui, e o que ficou fora dela?",
            "type": "case-decision",
            "feedback": {
              "correct": "Tempo extra sem necessidade foge do princípio de exposição mínima; quem decide é a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Num treino de simulação, um colega propõe deixar o transdutor parado vários minutos num mesmo ponto para fazer um vídeo de lembrança. A indicação do exame não inclui isso.",
              "prompt": "Como você responde nessa situação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-05:i4:a",
                  "label": "Aceitar, pois o ultrassom não usa radiação ionizante",
                  "explanation": "Sem radiação ionizante ainda há aquecimento leve e cavitação possíveis."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i4:b",
                  "label": "Lembrar que a exposição deve ser a mínima necessária e chamar a equipe",
                  "explanation": "Tempo extra sem necessidade foge do princípio de exposição mínima; quem decide é a equipe."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i4:c",
                  "label": "Aceitar se a potência for aumentada para o vídeo ficar nítido",
                  "explanation": "Mais potência vai contra a exposição mínima."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i4:d",
                  "label": "Seguir calado, sem comentar, para evitar atrito",
                  "explanation": "Calar não resolve; descreva a dúvida e peça apoio à equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-05:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na simulação, a região atrás de uma bexiga cheia de líquido aparece mais clara que a vizinha. Que fenômeno físico explica?"
            },
            "help": "Líquido sem ecos atenua muito ou pouco?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Pouca atenuação no líquido deixa o que vem depois mais claro.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na simulação, a região atrás de uma bexiga cheia de líquido aparece mais clara que a vizinha. Que fenômeno físico explica?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-05:i5:a",
                  "label": "Sombra acústica, porque o líquido reflete tudo",
                  "explanation": "A sombra vem de refletor forte, e o líquido deixa passar o som."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i5:b",
                  "label": "Defeito do gel, que clareia a região",
                  "explanation": "O gel não clareia regiões profundas."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i5:c",
                  "label": "Frequência mais baixa, que clareia o fundo",
                  "explanation": "A frequência não explica uma faixa clara atrás do líquido."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-05:i5:d",
                  "label": "Reforço posterior, porque o líquido atenua pouco o som",
                  "explanation": "Pouca atenuação no líquido deixa o que vem depois mais claro."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-05:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Fenômenos e exposição",
            "body": "Você reconhece sombra e reforço como efeitos físicos do som e aplica o princípio de exposição mínima: só o necessário para a imagem diagnóstica, e dúvida vai para a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Fenômeno físico se descreve. O que fazer com ele a equipe define."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-us:aula-06",
      "competencyIds": [
        "competency:rtg-2026:s-us:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-us-v1",
        "sourceIds": [
          "source:rtg-2026:s-us:fda-us",
          "source:rtg-2026:s-us:aium-alara",
          "source:rtg-2026:s-us:lei-12842-2013",
          "source:rtg-2026:s-us:radiologyinfo-us",
          "source:rtg-2026:s-us:nibib-us"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Onde o tecnólogo entra",
            "body": "Hoje você vai conseguir separar preparo de sala, equipamento e paciente do que a lei e o serviço definem, como a emissão do laudo.",
            "dialogue": {
              "setting": "Sala de ultrassonografia (simulação)",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Se o aparelho é tão simples de entender, posso já conduzir o exame?"
                },
                {
                  "speaker": "lia",
                  "text": "Entender a física não habilita ninguém. Quem executa e quem emite o laudo a lei e o serviço definem."
                },
                {
                  "speaker": "pixel",
                  "text": "Que parte você pode afirmar com apoio em lei, e o que fica para perguntar à equipe?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "O que a fonte sustenta",
            "body": "Este curso não qualifica ninguém. O que está lido em fonte: a Lei 12.842/2013 diz que a emissão de laudo dos exames endoscópicos e de imagem é atividade privativa do médico, e manda aplicar a lei de modo a resguardar as competências do técnico e do tecnólogo de radiologia. Quem executa a varredura em cada serviço é definido pela lei e pelo serviço: aqui não se afirma. Nesta simulação supervisionada, o preparo é apoio: orientar o paciente sobre roupa e joias e organizar a sala. Na dúvida, descreva e pergunte à equipe.",
            "keyPoints": [
              "Laudo de exame de imagem: privativo do médico, pela Lei 12.842/2013.",
              "Quem executa o exame: a lei e o serviço definem.",
              "Na dúvida, descreva e peça apoio à equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior: qual princípio limita o uso do ultrassom ao necessário para a imagem?"
            },
            "help": "Pense no menor necessário.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Ele pede só o necessário para a imagem diagnóstica.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior: qual princípio limita o uso do ultrassom ao necessário para a imagem?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-06:i1:a",
                  "label": "O princípio da frequência máxima",
                  "explanation": "Frequência máxima perde profundidade e não é princípio de segurança."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i1:b",
                  "label": "O princípio de exposição mínima",
                  "explanation": "Ele pede só o necessário para a imagem diagnóstica."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i1:c",
                  "label": "O princípio do gel obrigatório",
                  "explanation": "O gel é recurso de acoplamento, não princípio de exposição."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i1:d",
                  "label": "O princípio da imagem 3D",
                  "explanation": "Não há esse princípio; 3D é só um jeito de apresentar."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-06:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o que a fonte sustenta."
            },
            "help": "A afirmação vem da lei lida ou de uma suposição?",
            "type": "true-false",
            "feedback": {
              "correct": "Você apoiou cada afirmação na lei lida ou no limite do curso.",
              "incorrect": "Retome: laudo é do médico pela lei; execução, a lei e o serviço definem."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o que a fonte sustenta.",
              "statements": [
                {
                  "id": "statement:rtg-2026:s-us:aula-06:i2:1",
                  "text": "Pela Lei 12.842/2013, a emissão de laudo de exames de imagem é privativa do médico.",
                  "isTrue": true,
                  "explanation": "Certo: é o inciso VII do artigo 4º da lei."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-06:i2:2",
                  "text": "A mesma lei manda resguardar as competências do técnico e do tecnólogo de radiologia.",
                  "isTrue": true,
                  "explanation": "Certo: o parágrafo 7º do artigo 4º manda aplicá-la dessa forma."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-06:i2:3",
                  "text": "Entender a física do ultrassom já define quem executa o exame num serviço.",
                  "isTrue": false,
                  "explanation": "Errado: quem executa é definido pela lei e pelo serviço, não pelo conteúdo do curso."
                },
                {
                  "id": "statement:rtg-2026:s-us:aula-06:i2:4",
                  "text": "Ao notar algo na imagem, o aluno pode registrar a interpretação por conta própria.",
                  "isTrue": false,
                  "explanation": "Errado: a interpretação é do laudo; descreva o que viu e peça apoio à equipe."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada item no grupo que a fonte ou o limite do curso sustenta."
            },
            "help": "Cada item é apoio, laudo ou decisão do serviço?",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o apoio, o que a lei reserva ao médico e o que a lei e o serviço definem.",
              "incorrect": "Pergunte de cada item: é apoio de preparo, é a emissão do laudo ou depende da lei e do serviço?"
            },
            "payload": {
              "prompt": "Classifique cada item no grupo que a fonte ou o limite do curso sustenta.",
              "categories": [
                {
                  "id": "group:rtg-2026:s-us:aula-06:i3:a",
                  "label": "Apoio de preparo"
                },
                {
                  "id": "group:rtg-2026:s-us:aula-06:i3:b",
                  "label": "Privativo do médico"
                },
                {
                  "id": "group:rtg-2026:s-us:aula-06:i3:c",
                  "label": "Lei e serviço definem"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:s-us:aula-06:i3:5",
                  "label": "Decidir se um aluno já pode executar o exame",
                  "categoryId": "group:rtg-2026:s-us:aula-06:i3:c"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-06:i3:1",
                  "label": "Lembrar o paciente de tirar joias",
                  "categoryId": "group:rtg-2026:s-us:aula-06:i3:a"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-06:i3:2",
                  "label": "Organizar a sala e o gel antes do paciente",
                  "categoryId": "group:rtg-2026:s-us:aula-06:i3:a"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-06:i3:3",
                  "label": "Emitir o laudo do exame de imagem",
                  "categoryId": "group:rtg-2026:s-us:aula-06:i3:b"
                },
                {
                  "id": "item:rtg-2026:s-us:aula-06:i3:4",
                  "label": "Definir quem faz a varredura em cada clínica",
                  "categoryId": "group:rtg-2026:s-us:aula-06:i3:c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Como você responde nessa situação?"
            },
            "help": "Quem emite o laudo, pela lei lida?",
            "type": "case-decision",
            "feedback": {
              "correct": "O laudo é do médico; a equipe orienta a paciente.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Numa visita de estágio simulada, Dona Marta olha a tela e pergunta: \"O que o senhor viu? Está tudo bem comigo?\"",
              "prompt": "Como você responde nessa situação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-06:i4:a",
                  "label": "Dizer que está tudo normal, para tranquilizá-la",
                  "explanation": "Qualquer parecer informal faz as vezes do laudo, que cabe ao médico."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i4:b",
                  "label": "Explicar que o médico emite o laudo e chamar a equipe",
                  "explanation": "O laudo é do médico; a equipe orienta a paciente."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i4:c",
                  "label": "Descrever o que parece uma alteração na imagem",
                  "explanation": "Descrever a imagem como parecer é interpretar, o que não cabe ao aluno."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i4:d",
                  "label": "Virar a tela e não responder nada",
                  "explanation": "Silêncio seco também não acolhe; explique e acione a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-06:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-us:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:s-us:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num serviço novo, não está claro se o aluno pode executar a varredura sozinho. O que ele faz?"
            },
            "help": "Quem define a execução no serviço?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A lei e o serviço definem; na dúvida, pergunte.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num serviço novo, não está claro se o aluno pode executar a varredura sozinho. O que ele faz?",
              "options": [
                {
                  "id": "option:rtg-2026:s-us:aula-06:i5:a",
                  "label": "Executa sozinho, porque entendeu a física",
                  "explanation": "Entender a física não habilita ninguém."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i5:b",
                  "label": "Pede a um colega que também não sabe",
                  "explanation": "Um colega sem a definição não responde pelo serviço."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i5:c",
                  "label": "Pergunta à equipe antes de qualquer execução",
                  "explanation": "A lei e o serviço definem; na dúvida, pergunte."
                },
                {
                  "id": "option:rtg-2026:s-us:aula-06:i5:d",
                  "label": "Espera sem falar nada até ser chamado",
                  "explanation": "Silêncio deixa a dúvida aberta; descreva e peça apoio."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-us:aula-06:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-us:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "O que fica para a equipe",
            "body": "Você separa o apoio de preparo do que a lei reserva ao médico, a emissão do laudo, e do que a lei e o serviço definem. O curso não qualifica ninguém; na dúvida, você descreve e pergunta à equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Saber onde termina o seu papel faz parte de aprender bem."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:s-us",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-01"
        ],
        "prompt": "Qual característica diferencia o ultrassom do som que o ouvido capta?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-01:c1:a",
            "label": "Frequência acima de 20 kHz"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c1:b",
            "label": "Velocidade menor no ar"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c1:c",
            "label": "Natureza eletromagnética"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c1:d",
            "label": "Necessidade de radiação ionizante"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-01:c1:a",
        "feedback": {
          "correct": "Isso: ultra significa além da faixa audível, acima de 20 kHz.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-01"
        ],
        "prompt": "Com a velocidade do som fixa em 1540 m/s, qual frequência dá o menor comprimento de onda?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-01:c2:a",
            "label": "1 MHz"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c2:b",
            "label": "2 MHz"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c2:c",
            "label": "5 MHz"
          },
          {
            "id": "option:rtg-2026:s-us:aula-01:c2:d",
            "label": "3 MHz"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-01:c2:c",
        "feedback": {
          "correct": "Frequência maior, com velocidade fixa, encurta o comprimento de onda.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-02"
        ],
        "prompt": "O que o gel evita entre a pele e o transdutor?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-02:c1:a",
            "label": "Choque elétrico no cristal"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c1:b",
            "label": "Radiação espalhada na sala"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c1:c",
            "label": "Ruído audível no ambiente"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c1:d",
            "label": "Bolsas de ar no caminho"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-02:c1:d",
        "feedback": {
          "correct": "O ar bloqueia as ondas; sem ele, elas entram no corpo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us",
          "source:rtg-2026:s-us:fda-us"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-02"
        ],
        "prompt": "O que o cristal piezoelétrico produz quando o eco chega até ele?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-02:c2:a",
            "label": "Um novo pulso de som igual ao eco"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c2:b",
            "label": "Um campo elétrico lido pelo aparelho"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c2:c",
            "label": "Calor para aquecer a pele"
          },
          {
            "id": "option:rtg-2026:s-us:aula-02:c2:d",
            "label": "Luz que forma a imagem"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-02:c2:b",
        "feedback": {
          "correct": "A conversão acontece nos dois sentidos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-03"
        ],
        "prompt": "Que efeito tem aumentar a frequência do transdutor?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-03:c1:a",
            "label": "Menos detalhe e mais penetração"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c1:b",
            "label": "Mais detalhe e mais penetração"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c1:c",
            "label": "Mais detalhe e menos penetração"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c1:d",
            "label": "Nenhuma mudança no detalhe"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-03:c1:c",
        "feedback": {
          "correct": "Frequência alta é mais atenuada, mas dá imagem mais fina.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-03"
        ],
        "prompt": "Que combinação descreve um transdutor de frequência baixa?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-03:c2:a",
            "label": "Alcança fundo, com menos detalhe"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c2:b",
            "label": "Mostra o raso com detalhe máximo"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c2:c",
            "label": "Não penetra além da pele"
          },
          {
            "id": "option:rtg-2026:s-us:aula-03:c2:d",
            "label": "Só funciona com gel colorido"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-03:c2:a",
        "feedback": {
          "correct": "Baixa frequência penetra mais, com resolução menor.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-04"
        ],
        "prompt": "Que informação o modo B apresenta?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-04:c1:a",
            "label": "A velocidade do fluxo em cores"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c1:b",
            "label": "A imagem estrutural em tons de cinza"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c1:c",
            "label": "Uma linha ao longo do tempo"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c1:d",
            "label": "A rigidez relativa do tecido"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-04:c1:b",
        "feedback": {
          "correct": "O brilho acompanha a força do eco.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-04"
        ],
        "prompt": "Qual recurso mostra velocidade e direção do fluxo de sangue?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-04:c2:a",
            "label": "O modo B"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c2:b",
            "label": "O modo M"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c2:c",
            "label": "A elastografia"
          },
          {
            "id": "option:rtg-2026:s-us:aula-04:c2:d",
            "label": "O Doppler"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-04:c2:d",
        "feedback": {
          "correct": "Ele mede e visualiza o fluxo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:nibib-us"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-05"
        ],
        "prompt": "O que o princípio de exposição mínima pede?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-05:c1:a",
            "label": "Manter a exposição ao necessário para a imagem"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c1:b",
            "label": "Zerar o tempo de uso do aparelho"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c1:c",
            "label": "Subir a potência para acelerar o exame"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c1:d",
            "label": "Dispensar cuidado por não haver radiação"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-05:c1:a",
        "feedback": {
          "correct": "Menos que isso perde a qualidade; mais que isso expõe sem ganho.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:fda-us",
          "source:rtg-2026:s-us:aium-alara"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-05"
        ],
        "prompt": "O que aparece atrás de um refletor forte, como o osso?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-05:c2:a",
            "label": "Reforço posterior"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c2:b",
            "label": "Aumento de frequência"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c2:c",
            "label": "Sombra acústica"
          },
          {
            "id": "option:rtg-2026:s-us:aula-05:c2:d",
            "label": "Mais brilho no modo B"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-05:c2:c",
        "feedback": {
          "correct": "Quase nenhum som passa, e a região fica escura.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:acep-physics"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-06"
        ],
        "prompt": "Segundo a Lei 12.842/2013, a emissão de laudo de exames de imagem é...",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-06:c1:a",
            "label": "Atividade livre a qualquer pessoa"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c1:b",
            "label": "Atividade do tecnólogo em qualquer serviço"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c1:c",
            "label": "Atividade do paciente"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c1:d",
            "label": "Atividade privativa do médico"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-06:c1:d",
        "feedback": {
          "correct": "É o inciso VII do artigo 4º.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:lei-12842-2013"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-us:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:s-us:aula-06"
        ],
        "prompt": "Pelo que esta aula sustenta, quem define quem executa a varredura num serviço?",
        "options": [
          {
            "id": "option:rtg-2026:s-us:aula-06:c2:a",
            "label": "O aluno, por conta própria"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c2:b",
            "label": "A lei e o serviço"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c2:c",
            "label": "O fabricante do aparelho"
          },
          {
            "id": "option:rtg-2026:s-us:aula-06:c2:d",
            "label": "O próprio paciente"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-us:aula-06:c2:b",
        "feedback": {
          "correct": "A aula não afirma quem executa: isso a lei e o serviço definem.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-us:lei-12842-2013"
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
      "claimId": "interaction:rtg-2026:s-us:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "blank:rtg-2026:s-us:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "blank:rtg-2026:s-us:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-01:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-01:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-01:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-01:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-01:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-01:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "blank:rtg-2026:s-us:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "blank:rtg-2026:s-us:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-02:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-02:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-02:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-02:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-02:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "group:rtg-2026:s-us:aula-03:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "group:rtg-2026:s-us:aula-03:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-03:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-03:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-03:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-us:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-us:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-us:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-us:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-04:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-04:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "blank:rtg-2026:s-us:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-04:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-04:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-04:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:s-us:aula-04:i5:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i2:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-05:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-05:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:nibib-us",
        "source:rtg-2026:s-us:acep-physics",
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-05:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:acep-physics"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-06:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:s-us:aula-06:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "group:rtg-2026:s-us:aula-06:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "group:rtg-2026:s-us:aula-06:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "group:rtg-2026:s-us:aula-06:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-06:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-us:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-us:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-us:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:fda-us",
        "source:rtg-2026:s-us:aium-alara",
        "source:rtg-2026:s-us:lei-12842-2013",
        "source:rtg-2026:s-us:radiologyinfo-us",
        "source:rtg-2026:s-us:nibib-us"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-us:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:lei-12842-2013"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-us:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-us:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-us:radiologyinfo-us"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:s-us:aula-01",
        "hook": "Complete a frase: o aparelho mede o tempo de retorno do ____.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-01"
          ],
          "prompt": "O que o aparelho mede em cada eco para estimar a distância?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-01:rg:a",
              "label": "A cor do tecido"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rg:b",
              "label": "O tempo de retorno"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rg:c",
              "label": "A dose recebida"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rg:d",
              "label": "O peso do órgão"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-01:rg:b",
          "feedback": {
            "correct": "Com a velocidade do som no tecido, o tempo vira distância.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:nibib-us"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-01"
          ],
          "prompt": "Um eco volta duas vezes mais tarde que outro, pela mesma linha. O que isso indica?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-01:rt:a",
              "label": "A fronteira dele está mais perto"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rt:b",
              "label": "O tecido dele é mais quente"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rt:c",
              "label": "O pulso mudou de natureza"
            },
            {
              "id": "option:rtg-2026:s-us:aula-01:rt:d",
              "label": "A fronteira dele está mais longe"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-01:rt:d",
          "feedback": {
            "correct": "Mais tempo de retorno, mais distância.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:nibib-us",
            "source:rtg-2026:s-us:acep-physics"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-us:aula-02",
        "hook": "Complete a frase: o cristal converte campo elétrico em ____ e som em campo elétrico.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-02"
          ],
          "prompt": "Qual etapa vem logo antes de o aparelho calcular a distância?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-02:rg:a",
              "label": "O pulso é emitido pelo cristal"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rg:b",
              "label": "O gel é aplicado na pele"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rg:c",
              "label": "O eco volta e vira sinal elétrico"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rg:d",
              "label": "O pulso reflete numa fronteira"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-02:rg:c",
          "feedback": {
            "correct": "Só depois de receber o eco o aparelho tem o que medir.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:nibib-us"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-02"
          ],
          "prompt": "Num esquema, o eco chega e nada ocorre no cristal. O que falta nessa figura?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-02:rt:a",
              "label": "A conversão de som em radiação"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rt:b",
              "label": "A conversão de som em sinal elétrico"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rt:c",
              "label": "A emissão de calor pelo gel"
            },
            {
              "id": "option:rtg-2026:s-us:aula-02:rt:d",
              "label": "A mudança de cor do tecido"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-02:rt:b",
          "feedback": {
            "correct": "Sem ela o aparelho não lê o eco.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:nibib-us"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-us:aula-03",
        "hook": "Complete a frase: frequência mais alta dá mais ____, mas menos profundidade.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-03"
          ],
          "prompt": "Qual par liga frequência e alcance de forma correta?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-03:rg:a",
              "label": "Frequência alta e alvo profundo"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rg:b",
              "label": "Frequência baixa e alvo profundo"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rg:c",
              "label": "Frequência alta e eco sem tempo"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rg:d",
              "label": "Frequência baixa e imagem mais fina"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-03:rg:b",
          "feedback": {
            "correct": "Baixa frequência alcança mais fundo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:acep-physics"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-03"
          ],
          "prompt": "Uma estrutura rasa pede muito detalhe. A que classe de frequência isso se associa?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-03:rt:a",
              "label": "Frequência mais baixa"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rt:b",
              "label": "Qualquer uma, sem diferença"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rt:c",
              "label": "Frequência nula"
            },
            {
              "id": "option:rtg-2026:s-us:aula-03:rt:d",
              "label": "Frequência mais alta"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-03:rt:d",
          "feedback": {
            "correct": "Raso e detalhe: a frequência alta atende, e a perda de profundidade pesa pouco.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:acep-physics"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-us:aula-04",
        "hook": "Complete a frase: o modo M acompanha uma ____ do modo B ao longo do tempo.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-04"
          ],
          "prompt": "Qual recurso dá o mapa de cores de fluxo?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-04:rg:a",
              "label": "O modo M"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rg:b",
              "label": "O modo B"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rg:c",
              "label": "O Doppler colorido"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rg:d",
              "label": "A frequência alta"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-04:rg:c",
          "feedback": {
            "correct": "As cores codificam velocidade e direção.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:nibib-us"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-04"
          ],
          "prompt": "Um registro mostra os ecos de uma linha ao longo do tempo. Que modo é esse?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-04:rt:a",
              "label": "O modo M"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rt:b",
              "label": "O modo B"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rt:c",
              "label": "O Doppler colorido"
            },
            {
              "id": "option:rtg-2026:s-us:aula-04:rt:d",
              "label": "A elastografia"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-04:rt:a",
          "feedback": {
            "correct": "Uma linha do modo B no tempo é o modo M.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:acep-physics"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-us:aula-05",
        "hook": "Complete a frase: atrás de um refletor forte, o som quase não passa e surge a ____.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-05"
          ],
          "prompt": "Qual afirmação sobre segurança está certa?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-05:rg:a",
              "label": "Emite radiação ionizante"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rg:b",
              "label": "Pode aquecer levemente os tecidos"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rg:c",
              "label": "Tempo de exposição não importa"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rg:d",
              "label": "Vídeo de lembrança é sempre indicado"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-05:rg:b",
          "feedback": {
            "correct": "Por isso se limita a exposição ao necessário.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:fda-us"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-05"
          ],
          "prompt": "Atrás de um cisto cheio de líquido a imagem fica mais clara. Que nome tem o fenômeno?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-05:rt:a",
              "label": "Sombra acústica"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rt:b",
              "label": "Efeito Doppler"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rt:c",
              "label": "Modo M"
            },
            {
              "id": "option:rtg-2026:s-us:aula-05:rt:d",
              "label": "Reforço posterior"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-05:rt:d",
          "feedback": {
            "correct": "Pouca atenuação no líquido deixa mais claro o que vem depois.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:acep-physics"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-us:aula-06",
        "hook": "Complete a frase: o laudo do exame de imagem é emitido pelo ____.",
        "guided": {
          "id": "recovery-item:rtg-2026:s-us:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-06"
          ],
          "prompt": "Em dúvida sobre o que cabe a você num exame, qual é a ação certa?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-06:rg:a",
              "label": "Agir como acha melhor"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rg:b",
              "label": "Esperar que alguém note"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rg:c",
              "label": "Descrever e pedir apoio"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rg:d",
              "label": "Corrigir o registro sozinho"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-06:rg:c",
          "feedback": {
            "correct": "Dúvida vai para a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:lei-12842-2013"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-us:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-us:aula-06"
          ],
          "prompt": "Qual item é apoio de preparo, e não laudo?",
          "options": [
            {
              "id": "option:rtg-2026:s-us:aula-06:rt:a",
              "label": "Lembrar o paciente de tirar joias"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rt:b",
              "label": "Emitir o laudo do exame"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rt:c",
              "label": "Decidir se o aluno executa o exame"
            },
            {
              "id": "option:rtg-2026:s-us:aula-06:rt:d",
              "label": "Interpretar a imagem para o paciente"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-us:aula-06:rt:a",
          "feedback": {
            "correct": "É apoio de preparo, anterior à execução e ao laudo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-us:radiologyinfo-us"
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
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "df110c43ef28229956dfcdcfa256a95a766f22535c17cfaf3e9eee0b9f708ee8"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
