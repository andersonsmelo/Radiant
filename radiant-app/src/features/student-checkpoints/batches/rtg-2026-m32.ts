// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M32: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m32",
  "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea",
  "trackId": "track:rtg-2026:m32",
  "unitId": "unit:rtg-2026:m32",
  "contentVersion": "rtg-2026-m32-v1",
  "competencyIds": [
    "competency:rtg-2026:m32:aula-01",
    "competency:rtg-2026:m32:aula-02",
    "competency:rtg-2026:m32:aula-03",
    "competency:rtg-2026:m32:aula-04",
    "competency:rtg-2026:m32:aula-05",
    "competency:rtg-2026:m32:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
      "title": "ACPSEM position paper: recommendations for a digital general X-ray quality assurance program",
      "publisher": "Physical and Engineering Sciences in Medicine (PMC)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11408574/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:aapm-tg150-testes-de-detector",
      "title": "Evaluation of cassette-based digital radiography detectors using standardized image quality metrics: AAPM TG-150 Draft Image Detector Tests",
      "publisher": "Journal of Applied Clinical Medical Physics (PMC)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5874089/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
      "title": "ICRP Publication 135: Diagnostic Reference Levels in Medical Imaging",
      "publisher": "ICRP",
      "url": "https://www.icrp.org/publication.asp?id=icrp+publication+135",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional aberta (resumo e pontos-chave); consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2",
      "title": "System of radiation protection module 2",
      "publisher": "ICRPaedia, ICRP",
      "url": "https://icrpaedia.org/System_of_radiation_protection_module_2",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional aberta; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome",
      "title": "Typical and Local Diagnostic Reference Levels for Chest and Abdomen Radiography Examinations in Dubai Health Sector",
      "publisher": "PMC",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11766229/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:jacmp-2026-camada-semirredutora",
      "title": "Beam quality assessment: Evaluating aluminum purity's effects",
      "publisher": "Journal of Applied Clinical Medical Physics (PMC)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12758990/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto (CC BY 4.0); consultado para a definição e a medida da camada semirredutora, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m32:pmc-kap-definicao",
      "title": "Reference air kerma and kerma-area product as estimators of peak skin dose for fluoroscopically guided interventions",
      "publisher": "PMC",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3145218/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para a definição do produto dose-área, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m32:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
          "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Aceitar, acompanhar, consertar",
            "body": "Hoje você vai conseguir dizer que pergunta cada teste da vida do equipamento responde: aceitação, constância e depois de manutenção.",
            "dialogue": {
              "setting": "Sala de raios X com um equipamento recém-instalado",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Chegou o equipamento novo da sala 2. A agenda de amanhã já tem gente para ele."
                },
                {
                  "speaker": "lia",
                  "text": "Ele ainda precisa passar por testes antes do primeiro paciente. E os testes não acabam na instalação."
                },
                {
                  "speaker": "duda",
                  "text": "Mas se foi testado uma vez, por que repetir? Eu repetiria só se algo quebrasse."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Três momentos, três perguntas",
            "body": "Na linha do tempo, o marco grande é o teste de aceitação, antes do uso: confere se o equipamento instalado entrega o que foi especificado e é seguro. Antes do primeiro paciente também se fixam os valores de referência. Os marcos pequenos são os testes de constância: repetem as medidas e comparam com a referência. A chave marca uma manutenção, e o marco médio depois dela é o teste que confirma se o problema foi resolvido.",
            "keyPoints": [
              "Aceitação: antes do uso, quando também se fixa a referência.",
              "Constância: repete a medida e compara com a referência.",
              "Depois da manutenção: confirma se o problema foi resolvido."
            ],
            "visual": "ciclo-de-testes"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M14.01. Um resultado de teste saiu fora do padrão do serviço. Quem faz a ação corretiva?"
            },
            "help": "Quem trata a causa de um resultado fora do padrão?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a ação corretiva trata a causa, e quem a faz é a equipe responsável.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M14.01. Um resultado de teste saiu fora do padrão do serviço. Quem faz a ação corretiva?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-01:i1:a",
                  "label": "Quem fez o teste, ajustando o equipamento até o valor voltar",
                  "explanation": "Ajustar até o número voltar esconde a causa, e quem testa não corrige: avisa."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i1:b",
                  "label": "Quem estiver na sala, anotando na planilha um valor melhor",
                  "explanation": "Anotar um valor que não foi medido falsifica o registro e não resolve nada."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i1:c",
                  "label": "A equipe responsável, que investiga a causa e corrige",
                  "explanation": "Isso: a ação corretiva trata a causa, e quem a faz é a equipe responsável."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i1:d",
                  "label": "Ninguém: o teste da próxima vez compensa o desvio",
                  "explanation": "O desvio não some sozinho: sem ação corretiva, ele segue valendo nos exames."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule quatro momentos da linha do tempo do equipamento, tocando na ficha e no ponto."
            },
            "help": "Comece pelo marco que abre a linha, antes de qualquer paciente.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: o marco grande abre a vida do equipamento, os pequenos o acompanham e o ciano vem depois do conserto.",
              "incorrect": "Algum nome está no lugar errado: o tamanho do marco acompanha o tamanho da pergunta, e o ciano vem depois da ferramenta."
            },
            "payload": {
              "prompt": "Rotule quatro momentos da linha do tempo do equipamento, tocando na ficha e no ponto.",
              "imageRef": "diagram:ciclo-de-testes",
              "points": [
                {
                  "id": "point:rtg-2026:m32:aula-01:i2:1",
                  "x": 0.15,
                  "y": 0.54,
                  "where": "à esquerda, o círculo amarelo grande com um visto",
                  "correctLabelId": "label:rtg-2026:m32:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m32:aula-01:i2:2",
                  "x": 0.325,
                  "y": 0.54,
                  "where": "o primeiro ponto azul pequeno depois do círculo grande",
                  "correctLabelId": "label:rtg-2026:m32:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m32:aula-01:i2:3",
                  "x": 0.71,
                  "y": 0.27,
                  "where": "no alto à direita, a ferramenta de aperto sobre a linha",
                  "correctLabelId": "label:rtg-2026:m32:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m32:aula-01:i2:4",
                  "x": 0.82,
                  "y": 0.54,
                  "where": "no fim da linha, o círculo ciano de tamanho médio",
                  "correctLabelId": "label:rtg-2026:m32:aula-01:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m32:aula-01:i2:3",
                  "label": "Manutenção"
                },
                {
                  "id": "label:rtg-2026:m32:aula-01:i2:4",
                  "label": "Depois da manutenção"
                },
                {
                  "id": "label:rtg-2026:m32:aula-01:i2:1",
                  "label": "Aceitação"
                },
                {
                  "id": "label:rtg-2026:m32:aula-01:i2:2",
                  "label": "Constância"
                },
                {
                  "id": "label:rtg-2026:m32:aula-01:i2:5",
                  "label": "Descarte do equipamento"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Em qual momento cada situação pede um teste? Classifique cada uma."
            },
            "help": "Veja o que cada situação quer saber: se entrega o prometido, se mudou ou se o conserto resolveu.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o teste que abre a vida do equipamento, o que a acompanha e o que confere o conserto.",
              "incorrect": "Pergunte de cada situação: o equipamento é novo, está em uso comum ou acabou de ser consertado?"
            },
            "payload": {
              "prompt": "Em qual momento cada situação pede um teste? Classifique cada uma.",
              "categories": [
                {
                  "id": "group:rtg-2026:m32:aula-01:i3:a",
                  "label": "Aceitação"
                },
                {
                  "id": "group:rtg-2026:m32:aula-01:i3:b",
                  "label": "Constância"
                },
                {
                  "id": "group:rtg-2026:m32:aula-01:i3:c",
                  "label": "Depois da manutenção"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:6",
                  "label": "Falha corrigida, e o serviço quer ver se resolveu",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:c"
                },
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:4",
                  "label": "Comparar o valor de hoje com o de referência",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:1",
                  "label": "Equipamento instalado, ainda sem paciente",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:a"
                },
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:3",
                  "label": "Repetição das mesmas medidas a cada período",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:b"
                },
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:2",
                  "label": "Valores de referência a fixar antes do primeiro uso",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:a"
                },
                {
                  "id": "item:rtg-2026:m32:aula-01:i3:5",
                  "label": "Detector recalibrado pela assistência técnica",
                  "categoryId": "group:rtg-2026:m32:aula-01:i3:c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre os testes ao longo da vida do equipamento."
            },
            "help": "Pense na pergunta que cada teste responde.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou quando cada teste entra e quem faz o quê.",
              "incorrect": "Releia o conceito: cada teste responde a uma pergunta, e o estudante não ajusta o equipamento."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre os testes ao longo da vida do equipamento.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-01:i4:1",
                  "text": "O teste de constância compara a medida de agora com os valores de referência.",
                  "isTrue": true,
                  "explanation": "Certo: sem referência não há com o que comparar, e é dela que a constância parte."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-01:i4:2",
                  "text": "Quem passou na aceitação fica dispensado dos testes seguintes.",
                  "isTrue": false,
                  "explanation": "Errado: o desempenho pode mudar com o uso, e por isso as medidas se repetem."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-01:i4:3",
                  "text": "Depois de uma manutenção, um teste confirma se o problema foi resolvido.",
                  "isTrue": true,
                  "explanation": "Certo: o conserto só fecha quando o teste mostra que o problema não está mais lá."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-01:i4:4",
                  "text": "Quem acompanha o teste pode ajustar o equipamento para o valor voltar.",
                  "isTrue": false,
                  "explanation": "Errado: ajustar é da equipe responsável, e quem acompanha anota e avisa."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua leitura?"
            },
            "help": "Com o que a constância compara o valor de agora?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: a constância compara com a referência, e um valor longe dela vai à equipe responsável.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Simulação, setor de radiografia. O valor medido hoje no teste de constância está igual ao da semana passada, mas bem longe do valor de referência. O colega diz que, igual ao da semana passada, está bom.",
              "prompt": "Qual é a sua leitura?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-01:i5:a",
                  "label": "A comparação que vale é com a referência: descrevo e aviso a equipe",
                  "explanation": "Isso: a constância compara com a referência, e um valor longe dela vai à equipe responsável."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i5:b",
                  "label": "Igual ao da semana passada basta: registro e sigo o turno",
                  "explanation": "O resultado da semana passada pode já estar longe da referência, e a constância compara com ela."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i5:c",
                  "label": "Refaço o teste até o valor se aproximar da referência",
                  "explanation": "Repetir até o número servir esconde o desvio e não trata a causa."
                },
                {
                  "id": "option:rtg-2026:m32:aula-01:i5:d",
                  "label": "Ajusto o equipamento até o valor chegar na referência",
                  "explanation": "Ajustar o equipamento não cabe ao estudante: descreve-se o desvio e a equipe trata."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-01:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue dizer a pergunta de cada teste: a aceitação confere o equipamento novo antes do uso, quando também se fixa a referência, a constância compara com ela e o teste depois da manutenção confirma o conserto.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Aceitar, acompanhar, consertar: três momentos, e uma referência que liga os três."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m32:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:jacmp-2026-camada-semirredutora",
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Testar o feixe",
            "body": "Hoje você vai conseguir dizer o que os testes de tensão, de tempo, de rendimento e de filtração verificam no feixe.",
            "dialogue": {
              "setting": "Sala de raios X, com a física médica",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje o físico médico vem medir o feixe da sala 2. Vamos acompanhar e anotar."
                },
                {
                  "speaker": "duda",
                  "text": "Medir o feixe? O painel já mostra os valores que a gente escolhe."
                },
                {
                  "speaker": "caio",
                  "text": "O painel mostra o que foi pedido. O teste conta o que saiu do tubo de verdade."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "O pedido e o que o tubo entrega",
            "body": "No esquema, o feixe desce do tubo, passa por lâminas de filtro e chega a um medidor sobre a mesa, ligado a um mostrador. O teste compara o pedido com o entregue. Tensão: a entregue deve bater com a selecionada. Tempo: o medido deve bater com o indicado. Rendimento: a radiação emitida para uma carga fixa. Filtração: a camada semirredutora, espessura de alumínio que reduz a leitura à metade, mostra se ela basta. As lâminas, somadas ao feixe, servem para achá-la. Pouca filtração expõe mais o paciente.",
            "keyPoints": [
              "O painel mostra o pedido; o medidor, o que o tubo entregou.",
              "Tensão, tempo, rendimento e filtração: um teste para cada.",
              "Quem mede é o físico médico ou quem o serviço designa."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M21.05. Neste esquema simplificado, o que uma camada semirredutora faz com o feixe que passa por ela?"
            },
            "help": "Quanto sobra depois de uma camada, neste esquema?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: cada camada semirredutora deixa passar metade, neste esquema.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M21.05. Neste esquema simplificado, o que uma camada semirredutora faz com o feixe que passa por ela?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-02:i1:a",
                  "label": "Deixa passar metade do que chegava",
                  "explanation": "Isso: cada camada semirredutora deixa passar metade, neste esquema."
                },
                {
                  "id": "option:rtg-2026:m32:aula-02:i1:b",
                  "label": "Deixa passar um quarto do que chegava",
                  "explanation": "Um quarto é o que sobra depois de duas camadas, e não de uma."
                },
                {
                  "id": "option:rtg-2026:m32:aula-02:i1:c",
                  "label": "Deixa passar tudo, sem mudar o feixe",
                  "explanation": "Sem atenuar nada, a camada não serviria para medir a filtração."
                },
                {
                  "id": "option:rtg-2026:m32:aula-02:i1:d",
                  "label": "Bloqueia o feixe por completo",
                  "explanation": "Uma camada só reduz o feixe à metade, e não o elimina."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-02:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as peças do esquema do teste de feixe, tocando na ficha e no ponto."
            },
            "help": "Comece pelo alto e desça acompanhando o feixe.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: o feixe sai do tubo, passa pelas lâminas e chega ao medidor, que fala com o mostrador.",
              "incorrect": "Siga o caminho do feixe de cima para baixo: o que o emite, o que o abre, o que o atenua e o que o lê."
            },
            "payload": {
              "prompt": "Rotule as peças do esquema do teste de feixe, tocando na ficha e no ponto.",
              "imageRef": "diagram:teste-de-feixe",
              "points": [
                {
                  "id": "point:rtg-2026:m32:aula-02:i2:1",
                  "x": 0.5,
                  "y": 0.12,
                  "where": "no alto, a caixa com um ponto amarelo dentro",
                  "correctLabelId": "label:rtg-2026:m32:aula-02:i2:1"
                },
                {
                  "id": "point:rtg-2026:m32:aula-02:i2:2",
                  "x": 0.5,
                  "y": 0.34,
                  "where": "logo abaixo da caixa de cima, de onde o feixe se abre",
                  "correctLabelId": "label:rtg-2026:m32:aula-02:i2:2"
                },
                {
                  "id": "point:rtg-2026:m32:aula-02:i2:3",
                  "x": 0.5,
                  "y": 0.58,
                  "where": "no meio do caminho do feixe, três faixas finas num suporte",
                  "correctLabelId": "label:rtg-2026:m32:aula-02:i2:3"
                },
                {
                  "id": "point:rtg-2026:m32:aula-02:i2:4",
                  "x": 0.5,
                  "y": 0.8,
                  "where": "sobre a mesa, o aparelho baixo que o feixe atinge",
                  "correctLabelId": "label:rtg-2026:m32:aula-02:i2:4"
                },
                {
                  "id": "point:rtg-2026:m32:aula-02:i2:5",
                  "x": 0.825,
                  "y": 0.65,
                  "where": "à direita, a tela com três barras de alturas diferentes",
                  "correctLabelId": "label:rtg-2026:m32:aula-02:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:4",
                  "label": "Medidor"
                },
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:6",
                  "label": "Receptor de imagem"
                },
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:1",
                  "label": "Tubo de raios X"
                },
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:5",
                  "label": "Mostrador"
                },
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:2",
                  "label": "Colimador"
                },
                {
                  "id": "label:rtg-2026:m32:aula-02:i2:3",
                  "label": "Lâminas de filtro"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada teste do feixe ao que ele verifica."
            },
            "help": "Duas associações comparam o entregue com o pedido; as outras duas olham o feixe em si.",
            "type": "matching",
            "feedback": {
              "correct": "Cada teste liga um parâmetro do pedido ao que o tubo de fato entrega.",
              "incorrect": "Releia o conceito: tensão e tempo comparam o entregue com o pedido, rendimento mede a radiação emitida e filtração usa a camada semirredutora."
            },
            "payload": {
              "prompt": "Ligue cada teste do feixe ao que ele verifica.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m32:aula-02:i3:1",
                  "left": "Teste de tensão",
                  "right": "A tensão entregue bate com a selecionada"
                },
                {
                  "id": "pair:rtg-2026:m32:aula-02:i3:2",
                  "left": "Teste de tempo",
                  "right": "O tempo medido bate com o indicado"
                },
                {
                  "id": "pair:rtg-2026:m32:aula-02:i3:3",
                  "left": "Teste de rendimento",
                  "right": "A radiação emitida para uma carga fixa"
                },
                {
                  "id": "pair:rtg-2026:m32:aula-02:i3:4",
                  "left": "Teste de filtração",
                  "right": "A camada semirredutora, que mostra se a filtração basta"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o seu papel no teste de feixe."
            },
            "help": "Pergunte quem mede e quem ajusta.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que se mede do que se ajusta, e quem faz cada coisa.",
              "incorrect": "Releia o conceito: o painel não substitui a medida, e o estudante não ajusta o equipamento."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o seu papel no teste de feixe.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-02:i4:1",
                  "text": "O painel mostra o que foi pedido, e o medidor, o que o tubo entregou.",
                  "isTrue": true,
                  "explanation": "Certo: são duas leituras diferentes, e o teste existe para compará-las."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-02:i4:2",
                  "text": "Se o painel mostra o valor esperado, o teste de tensão pode ser dispensado.",
                  "isTrue": false,
                  "explanation": "Errado: o painel mostra o pedido, e só a medida mostra o que saiu do tubo."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-02:i4:3",
                  "text": "O estudante acompanha o teste e anota o que o serviço pede.",
                  "isTrue": true,
                  "explanation": "Certo: acompanhar e registrar cabe ao estudante, e a medida é de quem o serviço designa."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-02:i4:4",
                  "text": "O estudante pode mudar o ajuste do tubo até o medidor marcar o esperado.",
                  "isTrue": false,
                  "explanation": "Errado: ajustar o equipamento não cabe ao estudante; ele descreve o que vê e avisa."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Uma leitura é o que se escolheu; a outra, o que aconteceu.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o painel traz o pedido, e o medidor traz o que saiu do tubo.",
              "incorrect": "Pense no que cada leitura mostra: o painel guarda o que se escolheu, e o medidor, o que o tubo fez."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "Na sala 5, o painel mostra o que foi ",
                ", e o medidor sobre a mesa lê o que o tubo ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m32:aula-02:i5:4",
                  "label": "calibrou"
                },
                {
                  "id": "token:rtg-2026:m32:aula-02:i5:2",
                  "label": "entregou"
                },
                {
                  "id": "token:rtg-2026:m32:aula-02:i5:3",
                  "label": "armazenou"
                },
                {
                  "id": "token:rtg-2026:m32:aula-02:i5:5",
                  "label": "desligou"
                },
                {
                  "id": "token:rtg-2026:m32:aula-02:i5:1",
                  "label": "pedido"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m32:aula-02:i5:1",
                  "correctTokenId": "token:rtg-2026:m32:aula-02:i5:1"
                },
                {
                  "id": "blank:rtg-2026:m32:aula-02:i5:2",
                  "correctTokenId": "token:rtg-2026:m32:aula-02:i5:2"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue dizer o que cada teste do feixe verifica, e por que o painel não substitui a medida. Medir e ajustar é da física médica ou de quem o serviço designa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "O painel diz o que a gente pediu. A medida diz o que o tubo fez."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m32:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "A luz e o feixe coincidem?",
            "body": "Hoje você vai conseguir reconhecer quando o campo de luz e o campo de radiação não coincidem, e a quem avisar.",
            "dialogue": {
              "setting": "Sala de raios X, teste do colimador",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Veja o retângulo de luz sobre o receptor: é a área que a equipe pretende irradiar."
                },
                {
                  "speaker": "duda",
                  "text": "E se o feixe cair um pouco para o lado? Ninguém vai notar a olho."
                },
                {
                  "speaker": "caio",
                  "text": "É por isso que existe o teste de alinhamento: luz e radiação precisam cair no mesmo lugar."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Luz e radiação no mesmo lugar",
            "body": "O campo de luz mostra a área que se pretende irradiar. O campo de radiação é a área que o feixe de fato atinge. O teste de alinhamento confere se os dois, e o receptor, estão alinhados. No esquema, o contorno amarelo é o campo de luz, o retângulo azul é o de radiação, e marcadores brancos mostram os cantos e o centro da luz. Com o feixe deslocado, uma faixa fica iluminada sem radiação, e tecido pode ficar fora da imagem; outra é irradiada fora da luz, sem necessidade. O estudante descreve o que vê e avisa a equipe.",
            "keyPoints": [
              "Campo de luz: onde se pretende irradiar.",
              "Campo de radiação: onde o feixe atinge.",
              "Desalinhamento: descrever e avisar, sem ajustar."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, os testes de feixe compararam o pedido com algo. Com o quê?"
            },
            "help": "O medidor sobre a mesa lê algo. O quê?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o teste compara o que foi pedido com o que o tubo entrega.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, os testes de feixe compararam o pedido com algo. Com o quê?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-03:i1:a",
                  "label": "Com o que a imagem mostrou no monitor",
                  "explanation": "A imagem não é o que o teste do feixe mede."
                },
                {
                  "id": "option:rtg-2026:m32:aula-03:i1:b",
                  "label": "Com o que o paciente sentiu",
                  "explanation": "Sensação do paciente não é o que um medidor lê."
                },
                {
                  "id": "option:rtg-2026:m32:aula-03:i1:c",
                  "label": "Com o que o tubo entregou, medido",
                  "explanation": "Isso: o teste compara o que foi pedido com o que o tubo entrega."
                },
                {
                  "id": "option:rtg-2026:m32:aula-03:i1:d",
                  "label": "Com o que o fabricante escreveu no manual",
                  "explanation": "O manual pode dar a especificação, mas o teste compara com a medida."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-03:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O campo de radiação saiu deslocado do campo de luz. Toque na faixa em que a luz mostra a área, mas a radiação não chega."
            },
            "help": "Compare, faixa por faixa, onde há luz e onde há radiação.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: ali a luz indica área a irradiar, e o feixe não chega.",
              "incorrect": "Essa parte não é a certa: procure onde há luz e falta o feixe, e não onde há feixe sem luz."
            },
            "payload": {
              "prompt": "O campo de radiação saiu deslocado do campo de luz. Toque na faixa em que a luz mostra a área, mas a radiação não chega.",
              "imageRef": "diagram:coincidencia-de-campo",
              "regions": [
                {
                  "id": "region:rtg-2026:m32:aula-03:i2:1",
                  "label": "Faixa amarelada à esquerda",
                  "x": 0.2813,
                  "y": 0.4583,
                  "width": 0.1,
                  "height": 0.2083
                },
                {
                  "id": "region:rtg-2026:m32:aula-03:i2:2",
                  "label": "Área escura no alto à direita",
                  "x": 0.74,
                  "y": 0.15,
                  "width": 0.14,
                  "height": 0.14
                },
                {
                  "id": "region:rtg-2026:m32:aula-03:i2:3",
                  "label": "Área azul no centro",
                  "x": 0.5125,
                  "y": 0.4833,
                  "width": 0.1625,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m32:aula-03:i2:4",
                  "label": "Faixa azul à direita",
                  "x": 0.7219,
                  "y": 0.4167,
                  "width": 0.0969,
                  "height": 0.25
                },
                {
                  "id": "region:rtg-2026:m32:aula-03:i2:5",
                  "label": "Área escura embaixo à esquerda",
                  "x": 0.18,
                  "y": 0.765,
                  "width": 0.17,
                  "height": 0.09
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m32:aula-03:i2:1"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o que o esquema mostra."
            },
            "help": "Compare, no esquema, o contorno amarelo com o retângulo azul.",
            "type": "true-false",
            "feedback": {
              "correct": "Você leu o esquema: luz e radiação separadas mudam o que é atingido.",
              "incorrect": "Releia o conceito: o campo de luz é o pretendido, e o de radiação é o que o feixe atinge."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o que o esquema mostra.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-03:i3:1",
                  "text": "O campo de luz mostra a área que se pretende irradiar.",
                  "isTrue": true,
                  "explanation": "Certo: é a referência da equipe para saber onde o feixe deveria cair."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-03:i3:2",
                  "text": "Com o campo de radiação deslocado, parte da região pedida pode ficar sem radiação.",
                  "isTrue": true,
                  "explanation": "Certo: onde a luz mostra área e o feixe não chega, tecido pode ficar fora da imagem."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-03:i3:3",
                  "text": "Desalinhamento só preocupa se o campo de luz for menor que o receptor de imagem.",
                  "isTrue": false,
                  "explanation": "Errado: o deslocamento já separa luz e radiação, qualquer que seja o tamanho do campo."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-03:i3:4",
                  "text": "No esquema, o feixe atinge uma faixa que a luz não mostra.",
                  "isTrue": true,
                  "explanation": "Certo: à direita, a radiação cai fora do contorno amarelo, onde ninguém esperava."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Classificação: Diante do desalinhamento, classifique cada ação: é do estudante ou da equipe responsável?"
            },
            "help": "O estudante observa e leva adiante; mexer e decidir é de outra pessoa.",
            "type": "categorize",
            "feedback": {
              "correct": "Você deixou com o estudante descrever, avisar e registrar, e com a equipe, ajustar, investigar e decidir.",
              "incorrect": "Pergunte de cada ação: ela descreve o que se viu ou mexe no equipamento e decide sobre a sala?"
            },
            "payload": {
              "prompt": "Diante do desalinhamento, classifique cada ação: é do estudante ou da equipe responsável?",
              "categories": [
                {
                  "id": "group:rtg-2026:m32:aula-03:i4:a",
                  "label": "É do estudante"
                },
                {
                  "id": "group:rtg-2026:m32:aula-03:i4:b",
                  "label": "É da equipe responsável"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:5",
                  "label": "Investigar a causa do desvio",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:b"
                },
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:6",
                  "label": "Decidir se a sala segue em uso",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:b"
                },
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:3",
                  "label": "Registrar como o serviço manda",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:a"
                },
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:1",
                  "label": "Descrever que lado e que faixa não coincidem",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:a"
                },
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:2",
                  "label": "Avisar a supervisão do que foi visto",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:a"
                },
                {
                  "id": "item:rtg-2026:m32:aula-03:i4:4",
                  "label": "Ajustar o colimador até as bordas coincidirem",
                  "categoryId": "group:rtg-2026:m32:aula-03:i4:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Em outra sala da simulação, Duda olha com você a imagem de um teste de alinhamento. Ajude-a a ler e a agir."
            },
            "help": "Compare onde a luz estava com onde o feixe chegou, e pense em quem mexe no equipamento.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você leu o deslocamento como luz e feixe fora de lugar, e levou o achado à supervisão sem mexer no equipamento.",
              "incorrect": "Reveja os turnos: retângulo exposto fora das marcas é desalinhamento, e o estudante registra e avisa, sem ajustar."
            },
            "payload": {
              "prompt": "Em outra sala da simulação, Duda olha com você a imagem de um teste de alinhamento. Ajude-a a ler e a agir.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m32:aula-03:i5:1",
                  "line": "As marcas dos cantos da luz ficaram num lugar, e o retângulo exposto saiu mais para baixo delas. O que isso quer dizer?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:1a",
                      "label": "O feixe caiu fora do que a luz mostrava: os dois não coincidem.",
                      "reply": "Então embaixo foi irradiado o que a luz não mostrava, e em cima faltou radiação."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:1b",
                      "label": "Nada: o retângulo exposto costuma sair um pouco maior que a luz mesmo.",
                      "reply": "Hum, mas ele não ficou maior. Ele foi parar mais para baixo."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:1c",
                      "label": "É falha do detector, porque a imagem de teste deveria ficar toda lisa.",
                      "reply": "Mas não vejo linha nem mancha, só o retângulo fora do lugar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-03:i5:1a"
                },
                {
                  "id": "turn:rtg-2026:m32:aula-03:i5:2",
                  "line": "E agora? A próxima pessoa da agenda entra nesta sala daqui a pouco.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:2a",
                      "label": "Seguimos a agenda: um deslocamento pequeno assim não muda o exame.",
                      "reply": "Mas a parte de baixo foi irradiada sem ninguém ver na luz."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:2b",
                      "label": "Registro o que vi e aviso a supervisão antes de a pessoa entrar.",
                      "reply": "Vou junto, e levo a imagem do teste para mostrar."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-03:i5:2c",
                      "label": "Ajusto o colimador rapidinho, antes de a pessoa entrar na sala.",
                      "reply": "Mas eu nunca mexi nesse ajuste. Você sabe fazer?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-03:i5:2b"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue reconhecer, no esquema, que luz e radiação não coincidem: uma faixa fica iluminada sem radiação, e outra é irradiada fora da luz. Descreve, avisa e deixa o ajuste com a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "A luz promete uma área. O teste confere se o feixe cumpre a promessa."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m32:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
          "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "O detector e o monitor",
            "body": "Hoje você vai conseguir reconhecer o que quebra a uniformidade numa imagem de teste do detector e conferir o padrão do monitor, sem calibrar.",
            "dialogue": {
              "setting": "Sala de raios X, rotina de teste",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Vou fazer o teste do detector: um feixe uniforme, sem paciente na frente."
                },
                {
                  "speaker": "duda",
                  "text": "Sem paciente? Vai sair uma imagem vazia."
                },
                {
                  "speaker": "caio",
                  "text": "Vazia, mas lisa. A graça é essa: o que não for liso é problema do equipamento."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Imagem lisa e padrão legível",
            "body": "O teste de uniformidade expõe o detector a um feixe uniforme, sem paciente: no máximo uma placa lisa, igual em toda parte, fica no caminho. A imagem deve ser lisa, parecida em toda parte; linha, faixa ou mancha não é anatomia, e uma não uniformidade pode imitar ou esconder um achado clínico. O resultado se compara ao de referência. No monitor, o padrão de teste confere se os extremos do cinza se distinguem, se o preto e o branco se separam sem borrão e se o texto fica legível, sob luz adequada. Você observa e relata; calibrar é de quem o serviço designa.",
            "keyPoints": [
              "Uniformidade: feixe uniforme, sem paciente, imagem lisa.",
              "Marca que sobra na imagem lisa vem do equipamento.",
              "Monitor: observe o padrão, relate, não calibre."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o campo de radiação saiu deslocado do de luz. Quem ajusta o colimador?"
            },
            "help": "Quem mexe no equipamento, e quem só observa e avisa?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o estudante descreve e avisa, e o ajuste é da equipe responsável.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o campo de radiação saiu deslocado do de luz. Quem ajusta o colimador?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-04:i1:a",
                  "label": "O estudante, até as bordas coincidirem",
                  "explanation": "Ajustar o colimador não cabe ao estudante, que descreve o que vê."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i1:b",
                  "label": "A equipe responsável pelo equipamento",
                  "explanation": "Isso: o estudante descreve e avisa, e o ajuste é da equipe responsável."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i1:c",
                  "label": "O paciente, mudando de posição",
                  "explanation": "Mudar de posição não corrige onde o feixe cai."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i1:d",
                  "label": "Ninguém: o recorte da imagem resolve depois",
                  "explanation": "Recortar a imagem não muda onde o feixe já caiu."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Este esquema de tórax tem três marcas do equipamento. Num teste de uniformidade, sem paciente, a anatomia não aparece. Toque na região que é do corpo, e não do equipamento."
            },
            "help": "O que existe só quando há um corpo no caminho do feixe?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: essa área é pulmão, e sem paciente ela não aparece; as outras marcas não vêm do corpo.",
              "incorrect": "Essa marca não depende do corpo: procure a região que só existe porque há um paciente."
            },
            "payload": {
              "prompt": "Este esquema de tórax tem três marcas do equipamento. Num teste de uniformidade, sem paciente, a anatomia não aparece. Toque na região que é do corpo, e não do equipamento.",
              "imageRef": "diagram:artefatos-do-detector",
              "regions": [
                {
                  "id": "region:rtg-2026:m32:aula-04:i2:1",
                  "label": "Linha fina no alto à direita",
                  "x": 0.7415,
                  "y": 0.06,
                  "width": 0.08,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m32:aula-04:i2:2",
                  "label": "Bandas claras na lateral esquerda",
                  "x": 0.138,
                  "y": 0.042,
                  "width": 0.09,
                  "height": 0.917
                },
                {
                  "id": "region:rtg-2026:m32:aula-04:i2:3",
                  "label": "Área escura no meio, à direita",
                  "x": 0.609,
                  "y": 0.292,
                  "width": 0.125,
                  "height": 0.25
                },
                {
                  "id": "region:rtg-2026:m32:aula-04:i2:4",
                  "label": "Contorno fraco embaixo à direita",
                  "x": 0.584,
                  "y": 0.671,
                  "width": 0.169,
                  "height": 0.308
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m32:aula-04:i2:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque tudo o que combina com um teste de uniformidade do detector."
            },
            "help": "Pense no que o teste precisa para uma falha aparecer, e no que não cabe ao estudante.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou as três ideias do teste e deixou de fora o que o estragaria ou foge do seu papel.",
              "incorrect": "Releia o conceito: o feixe é uniforme e sem paciente, a imagem deve ser lisa, compara-se com a referência e o estudante não regula nada."
            },
            "payload": {
              "prompt": "Marque tudo o que combina com um teste de uniformidade do detector.",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:a",
                  "label": "Deixar uma chave ou outro objeto sobre o detector durante a exposição",
                  "explanation": "Com objeto no caminho, a imagem deixa de ser lisa por causa dele, e o teste perde o sentido."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:b",
                  "label": "Expor o detector a um feixe uniforme, sem paciente",
                  "explanation": "O teste precisa de um feixe igual em toda parte, para a imagem ser lisa se o detector estiver bem."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:c",
                  "label": "Esperar uma imagem lisa, parecida em toda parte",
                  "explanation": "Uma imagem de exposição uniforme deve ser muito parecida em toda a área."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:d",
                  "label": "Apagar a imagem se houver uma faixa, para não registrar",
                  "explanation": "Apagar esconde a falha: a faixa se descreve, se registra e se leva à equipe."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:e",
                  "label": "Comparar o resultado com o de referência",
                  "explanation": "Comparar com a referência mostra se o detector mudou desde o começo."
                },
                {
                  "id": "option:rtg-2026:m32:aula-04:i3:f",
                  "label": "Regular o detector quando aparecer uma mancha",
                  "explanation": "Regular o detector não cabe ao estudante: ele descreve a mancha e avisa."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m32:aula-04:i3:b",
                "option:rtg-2026:m32:aula-04:i3:c",
                "option:rtg-2026:m32:aula-04:i3:e"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Caio faz a rotina de testes com você. Ajude-o a conduzir o relato."
            },
            "help": "Nos dois casos, o que o estudante faz é descrever e avisar.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você descreveu e avisou nos dois casos, sem limpar, apagar nem calibrar.",
              "incorrect": "Reveja os turnos: nem a faixa nem o borrão se resolvem sozinho; descreva o que viu e avise."
            },
            "payload": {
              "prompt": "Caio faz a rotina de testes com você. Ajude-o a conduzir o relato.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m32:aula-04:i4:1",
                  "line": "Na imagem de uniformidade, uma faixa mais clara cruza uma lateral. Eu aposto que é só poeira. O que a gente faz?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:1a",
                      "label": "Descrevo onde está a faixa e aviso o físico médico.",
                      "reply": "Anoto a lateral e a forma da faixa, e vou atrás do físico médico agora."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:1b",
                      "label": "Limpo o detector com um pano e refaço a imagem logo em seguida.",
                      "reply": "Pego o pano então, e vemos se a faixa sai na imagem seguinte."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:1c",
                      "label": "Apago a imagem: com poeira no detector, o teste nem vale.",
                      "reply": "Apago, então, e a gente segue sem anotar nada sobre isso."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-04:i4:1a"
                },
                {
                  "id": "turn:rtg-2026:m32:aula-04:i4:2",
                  "line": "No padrão do monitor, as bordas entre o preto e o branco estão borradas. Posso passar uma imagem mesmo assim?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:2a",
                      "label": "Ajusto o brilho do monitor até o borrão desaparecer da tela.",
                      "reply": "Vou mexer no brilho agora, então, e ver se melhora."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:2b",
                      "label": "Leio assim e compenso com a janela da imagem na estação.",
                      "reply": "Tá, vou ler assim e ir ajustando a janela conforme precisar."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-04:i4:2c",
                      "label": "Descrevo o que vi e aviso quem o serviço designou.",
                      "reply": "Anoto o borrão nas bordas e chamo quem o serviço indicou para o monitor."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-04:i4:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Em outra sala da simulação, julgue cada afirmação sobre o padrão de teste do monitor."
            },
            "help": "O que o padrão confere, e quem calibra?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve o monitor sob observação, sem calibrar nada.",
              "incorrect": "Releia o conceito: o padrão confere extremos, bordas e texto, e a calibração é de outra pessoa."
            },
            "payload": {
              "prompt": "Em outra sala da simulação, julgue cada afirmação sobre o padrão de teste do monitor.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-04:i5:1",
                  "text": "O padrão confere se o preto e o branco se separam sem borrão entre eles.",
                  "isTrue": true,
                  "explanation": "Certo: transições borradas entre preto e branco são um achado do padrão."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-04:i5:2",
                  "text": "O texto do padrão deve ficar legível na tela.",
                  "isTrue": true,
                  "explanation": "Certo: texto ilegível mostra que o monitor não está mostrando o que deveria."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-04:i5:3",
                  "text": "Se o padrão não passar, o estudante calibra o monitor na hora.",
                  "isTrue": false,
                  "explanation": "Errado: calibrar é de quem o serviço designa, e o estudante observa e relata."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-04:i5:4",
                  "text": "Se o quadradinho quase preto some no fundo preto, o padrão não passou.",
                  "isTrue": true,
                  "explanation": "Certo: o padrão confere se os extremos do cinza se distinguem, e ali o tom escuro sumiu."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue dizer que, sem objeto, a imagem do detector deve ser lisa, e que o que sobra nela vem do equipamento. No monitor, observa o padrão, relata o que não passa e deixa a calibração com quem o serviço designa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Imagem lisa, padrão legível. O que fugir disso, você descreve e leva adiante."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m32:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:pmc-kap-definicao",
          "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
          "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome",
          "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Níveis de referência",
            "body": "Hoje você vai conseguir dizer o que um nível de referência de diagnóstico é, e o que ele não é.",
            "dialogue": {
              "setting": "Sala de reunião do serviço, com o físico médico",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "O serviço comparou o valor típico de cada sala para o mesmo exame. Veja o gráfico."
                },
                {
                  "speaker": "duda",
                  "text": "Então a barra mais alta é a sala que erra? E o paciente que ficou acima da linha?"
                },
                {
                  "speaker": "caio",
                  "text": "Calma, Duda. Vamos ver o que esse gráfico responde e o que ele não responde."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Um valor para comparar salas",
            "body": "Um nível de referência de diagnóstico ajuda a otimizar a proteção na exposição médica. Compara-se com ele o valor típico, a mediana, de uma sala ou serviço para um exame padrão, e nunca a dose de um paciente. Ele não é limite de dose e não separa prática boa de ruim. Num levantamento de radiografia, o valor típico de cada serviço foi a mediana do produto dose-área. No esquema, a linha deixa três quartos das salas abaixo dela, e acima dela se investigam as causas.",
            "keyPoints": [
              "Compara o valor típico de uma sala, e não a dose de um paciente.",
              "Não é limite de dose.",
              "Acima da linha: investigar as causas, sem culpar."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a M21.04. Que indicador do equipamento multiplica a radiação do feixe pela área do campo?"
            },
            "help": "Qual indicador do equipamento usa a área do campo na conta?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: é o indicador do equipamento que combina a radiação do feixe com a área do campo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a M21.04. Que indicador do equipamento multiplica a radiação do feixe pela área do campo?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-05:i1:a",
                  "label": "O dosímetro de referência",
                  "explanation": "O dosímetro de referência mede a radiação de fundo, e não o campo."
                },
                {
                  "id": "option:rtg-2026:m32:aula-05:i1:b",
                  "label": "A camada semirredutora",
                  "explanation": "A camada semirredutora fala da filtração, e não da área do campo."
                },
                {
                  "id": "option:rtg-2026:m32:aula-05:i1:c",
                  "label": "O valor de pixel",
                  "explanation": "O valor de pixel pertence à imagem, e não ao feixe."
                },
                {
                  "id": "option:rtg-2026:m32:aula-05:i1:d",
                  "label": "O produto dose-área",
                  "explanation": "Isso: é o indicador do equipamento que combina a radiação do feixe com a área do campo."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-05:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule o gráfico: cada barra é o valor típico de uma sala. Toque na ficha e no ponto."
            },
            "help": "Comece pela linha tracejada e pela cor das barras que passam dela.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: a linha é o nível, e as barras são salas, e não pacientes nem um limite.",
              "incorrect": "Algum nome está no lugar errado: a linha é um nível de comparação, e cada barra é uma sala."
            },
            "payload": {
              "prompt": "Rotule o gráfico: cada barra é o valor típico de uma sala. Toque na ficha e no ponto.",
              "imageRef": "diagram:nivel-de-referencia",
              "points": [
                {
                  "id": "point:rtg-2026:m32:aula-05:i2:1",
                  "x": 0.344,
                  "y": 0.325,
                  "where": "a linha tracejada que cruza o gráfico na horizontal",
                  "correctLabelId": "label:rtg-2026:m32:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m32:aula-05:i2:2",
                  "x": 0.808,
                  "y": 0.215,
                  "where": "as três barras amarelas, à direita",
                  "correctLabelId": "label:rtg-2026:m32:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m32:aula-05:i2:3",
                  "x": 0.511,
                  "y": 0.6625,
                  "where": "as barras azuis do meio, sob a linha tracejada",
                  "correctLabelId": "label:rtg-2026:m32:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m32:aula-05:i2:4",
                  "x": 0.2125,
                  "y": 0.767,
                  "where": "a primeira barra à esquerda, a mais curta",
                  "correctLabelId": "label:rtg-2026:m32:aula-05:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:5",
                  "label": "Limite de dose"
                },
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:4",
                  "label": "Menor valor típico"
                },
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:1",
                  "label": "Nível de referência"
                },
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:2",
                  "label": "Salas acima do nível"
                },
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:3",
                  "label": "Salas abaixo do nível"
                },
                {
                  "id": "label:rtg-2026:m32:aula-05:i2:6",
                  "label": "Dose de um paciente"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o nível de referência."
            },
            "help": "O que se compara com a linha: um paciente ou uma sala?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve o nível como comparação entre salas, e não como limite nem como juízo sobre um paciente.",
              "incorrect": "Releia o conceito: o nível compara o valor típico de salas, não é limite de dose e não vale para um paciente."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o nível de referência.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-05:i3:1",
                  "text": "O nível de referência é um limite de dose que nenhuma sala pode passar.",
                  "isTrue": false,
                  "explanation": "Errado: ele não é limite de dose; é um nível para investigar e otimizar."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i3:2",
                  "text": "O valor comparado é o valor típico de uma sala para um exame padrão.",
                  "isTrue": true,
                  "explanation": "Certo: compara-se a mediana da sala ou do serviço, e não um valor de paciente."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i3:3",
                  "text": "Ele serve para julgar se a dose de um paciente foi adequada.",
                  "isTrue": false,
                  "explanation": "Errado: o nível não se aplica a um paciente individual."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i3:4",
                  "text": "Uma sala acima da linha é sinal para investigar as causas.",
                  "isTrue": true,
                  "explanation": "Certo: acima da linha, a equipe investiga o que explica o valor, sem concluir que há erro."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre o nível de referência."
            },
            "help": "Leia cada afirmação com calma: ela fala de salas ou de um paciente?",
            "type": "blitz",
            "feedback": {
              "correct": "Isso mesmo: você separou o que o nível é do que ele não é, no ritmo da rodada.",
              "incorrect": "Reveja as afirmações: o nível compara salas, não limita dose e não vale para um paciente."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre o nível de referência.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:1",
                  "text": "O nível de referência ajuda a otimizar a proteção na exposição médica.",
                  "isTrue": true,
                  "explanation": "Ele é uma ferramenta para ajudar a otimizar a proteção, e não um fim em si."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:2",
                  "text": "Cada paciente deve receber uma dose abaixo do nível de referência.",
                  "isTrue": false,
                  "explanation": "O nível não se aplica a um paciente: ele compara o valor típico de salas."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:3",
                  "text": "Neste esquema, a linha deixa três quartos das salas abaixo dela.",
                  "isTrue": true,
                  "explanation": "Nove das doze barras ficam abaixo da linha: três quartos do conjunto."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:4",
                  "text": "Estar abaixo da linha prova que o serviço trabalha bem.",
                  "isTrue": false,
                  "explanation": "O nível não separa prática boa de ruim: abaixo da linha não é atestado de qualidade."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:5",
                  "text": "A linha serve para decidir se um paciente repete o exame.",
                  "isTrue": false,
                  "explanation": "A linha é do serviço e não decide nada sobre um exame individual."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:6",
                  "text": "Acima da linha, o serviço investiga as causas da diferença.",
                  "isTrue": true,
                  "explanation": "O nível funciona como nível de investigação: acima dele, procuram-se as causas."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-05:i4:7",
                  "text": "O valor de cada sala vem da mediana de muitos exames, e não de um só.",
                  "isTrue": true,
                  "explanation": "A mediana de muitos exames resiste a poucos valores muito altos ou muito baixos."
                }
              ],
              "passCount": 6
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Duda viu o gráfico do serviço e voltou cheia de dúvidas. Ajude-a a conduzir a conversa."
            },
            "help": "Pense no que o nível compara e no que ele não consegue dizer.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: acima da linha se investiga, e o nível não responde por um paciente.",
              "incorrect": "Reveja os turnos: o nível não é limite, não prova erro e não se aplica a um paciente."
            },
            "payload": {
              "prompt": "Duda viu o gráfico do serviço e voltou cheia de dúvidas. Ajude-a a conduzir a conversa.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m32:aula-05:i5:1",
                  "line": "A minha sala ficou acima da linha neste exame. Então estou fazendo algo errado?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:1a",
                      "label": "Não necessariamente: acima da linha, a equipe investiga as causas.",
                      "reply": "Ah, então a ideia é descobrir o que explica o valor, e não apontar culpado."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:1b",
                      "label": "Sim: acima da linha a sala passou do limite e precisa parar de funcionar.",
                      "reply": "Nossa, então devo avisar que a sala está proibida de funcionar?"
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:1c",
                      "label": "Não: a linha vale só para pacientes de tamanho grande, e não para a sua sala.",
                      "reply": "Hum, então a linha tem a ver com o tamanho de quem é atendido?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-05:i5:1a"
                },
                {
                  "id": "turn:rtg-2026:m32:aula-05:i5:2",
                  "line": "Uma familiar perguntou se a dose do paciente de hoje passou do nível. O que eu digo?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:2a",
                      "label": "Que passou, porque a sala inteira está acima da linha neste exame.",
                      "reply": "Vou dizer isso a ela, então, que o valor do paciente passou."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:2b",
                      "label": "Que o nível não vale para um paciente e a equipe responde a ela.",
                      "reply": "Entendi: o nível é do serviço, e eu levo a pergunta dela para a equipe."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-05:i5:2c",
                      "label": "Que não passou, porque o paciente de hoje é de tamanho padrão e pronto.",
                      "reply": "Posso garantir isso a ela só pelo tamanho do paciente, então?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-05:i5:2b"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue dizer que o nível de referência ajuda a otimizar a proteção comparando o valor típico de uma sala com o de outras, e que não é limite de dose nem se aplica a um paciente. Acima da linha, a equipe investiga.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "A linha compara salas. Ela não diz nada sobre o paciente de hoje."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m32:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m32:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m32-v1",
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Quando o teste falha",
            "body": "Hoje você vai conseguir registrar um teste fora do padrão, avisar a equipe e seguir a regra do serviço, sem mexer no equipamento.",
            "dialogue": {
              "setting": "Sala de raios X, início do turno",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "O teste de constância de hoje deu um valor fora do que a planilha indica. A primeira pessoa da agenda já chegou."
                },
                {
                  "speaker": "duda",
                  "text": "Eu refaço o teste até dar certo e a gente atende no horário?"
                },
                {
                  "speaker": "lia",
                  "text": "Pense no que cada um aqui pode decidir, e no que só você pode contar."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Registrar, avisar, seguir a regra",
            "body": "Quando um teste sai do padrão, você anota o que viu, no registro que o serviço pede: qual teste, o valor medido, o de referência e a data. Em seguida avisa a supervisão ou o responsável pelo equipamento. O serviço define se e quando o equipamento sai de uso, e quem decide isso: o estudante não libera a sala nem ajusta o equipamento. A equipe investiga a causa, e a assistência corrige. Depois do conserto o teste é refeito, e o resultado também entra no registro. Se algo parecer duvidoso, pare e peça apoio.",
            "keyPoints": [
              "Anote o que viu e avise; o conserto é da equipe.",
              "O serviço define se o equipamento sai de uso.",
              "Refazer o teste depois do conserto fecha o ciclo."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Retome a aula do feixe. O painel pediu um valor, mas o medidor mostrou outro. O que isso sugere?"
            },
            "help": "O que o teste compara: o painel e o quê?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o teste existe para comparar pedido e entrega, e a diferença vai à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Retome a aula do feixe. O painel pediu um valor, mas o medidor mostrou outro. O que isso sugere?",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-06:i1:a",
                  "label": "O medidor sempre erra um pouco, e vale só o painel",
                  "explanation": "O painel mostra o pedido, e a medida mostra o que saiu."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i1:b",
                  "label": "O tubo entregou algo diferente do pedido, e a equipe deve saber",
                  "explanation": "Isso: o teste existe para comparar pedido e entrega, e a diferença vai à equipe."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i1:c",
                  "label": "O paciente seguinte vai receber a média dos dois valores",
                  "explanation": "Não existe média entre pedido e entrega: o que importa é o que o tubo entrega."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i1:d",
                  "label": "Nada: valores diferentes são normais e não se registram",
                  "explanation": "Diferença entre pedido e entrega é justamente o que o teste procura e registra."
                }
              ],
              "correctOptionId": "option:rtg-2026:m32:aula-06:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: A assistência usou a chave de boca hoje para consertar o equipamento. Toque no marco do teste que confirma se o conserto resolveu o problema."
            },
            "help": "Procure o marco que vem logo depois do conserto, na linha do tempo.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o marco que vem depois da chave é o teste que confere se o problema foi resolvido.",
              "incorrect": "Essa parte não é o teste do conserto: procure o marco que vem depois da chave de boca."
            },
            "payload": {
              "prompt": "A assistência usou a chave de boca hoje para consertar o equipamento. Toque no marco do teste que confirma se o conserto resolveu o problema.",
              "imageRef": "diagram:ciclo-de-testes",
              "regions": [
                {
                  "id": "region:rtg-2026:m32:aula-06:i2:1",
                  "label": "Círculo amarelo grande",
                  "x": 0.0875,
                  "y": 0.4583,
                  "width": 0.125,
                  "height": 0.1667
                },
                {
                  "id": "region:rtg-2026:m32:aula-06:i2:2",
                  "label": "Círculo azul pequeno",
                  "x": 0.2844,
                  "y": 0.4875,
                  "width": 0.0813,
                  "height": 0.1083
                },
                {
                  "id": "region:rtg-2026:m32:aula-06:i2:3",
                  "label": "Chave de boca",
                  "x": 0.6563,
                  "y": 0.1833,
                  "width": 0.1062,
                  "height": 0.1667
                },
                {
                  "id": "region:rtg-2026:m32:aula-06:i2:4",
                  "label": "Círculo ciano médio",
                  "x": 0.775,
                  "y": 0.4833,
                  "width": 0.0875,
                  "height": 0.1167
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m32:aula-06:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque o que entra no registro de um teste fora do padrão."
            },
            "help": "O que um registro precisa para a equipe entender o desvio, sem inventar nada?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você registrou o que foi medido, visto e avisado, e deixou de fora o que seria invenção ou palpite.",
              "incorrect": "Releia o conceito: o registro leva o que foi feito e visto, e não valores ajustados nem causas supostas."
            },
            "payload": {
              "prompt": "Marque o que entra no registro de um teste fora do padrão.",
              "options": [
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:a",
                  "label": "Um valor ajustado para ficar dentro do padrão",
                  "explanation": "Registrar um valor que não foi medido falsifica o registro, e o desvio some do mapa."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:b",
                  "label": "Qual teste foi feito e quando",
                  "explanation": "Sem o teste e a data, a equipe não consegue situar o desvio no tempo."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:c",
                  "label": "O valor medido e o valor de referência",
                  "explanation": "Com os dois valores, a equipe vê o tamanho do desvio."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:d",
                  "label": "A causa que você acha mais provável, escrita como certa",
                  "explanation": "A causa é investigada pela equipe; palpite escrito como fato atrapalha."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:e",
                  "label": "O que você viu e a quem avisou",
                  "explanation": "Registrar o aviso mostra que o desvio chegou a quem decide."
                },
                {
                  "id": "option:rtg-2026:m32:aula-06:i3:f",
                  "label": "O teste refeito depois do conserto, quando houver",
                  "explanation": "O teste refeito fecha o ciclo e mostra se o problema foi resolvido."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m32:aula-06:i3:b",
                "option:rtg-2026:m32:aula-06:i3:c",
                "option:rtg-2026:m32:aula-06:i3:e",
                "option:rtg-2026:m32:aula-06:i3:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Caio e você estão com um teste fora do padrão e uma pessoa à espera. Ajude-o a conduzir."
            },
            "help": "Nos três momentos, quem decide sobre a sala não é o estudante.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: buscar quem responde pela sala, registrar o que foi medido e esperar o teste de confirmação e a decisão do serviço.",
              "incorrect": "Reveja os turnos: o estudante não repete até passar, não registra valor inventado e não libera a sala."
            },
            "payload": {
              "prompt": "Caio e você estão com um teste fora do padrão e uma pessoa à espera. Ajude-o a conduzir.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m32:aula-06:i4:1",
                  "line": "A supervisora saiu e não atende o telefone. A pessoa da primeira hora já chegou. Posso chamá-la?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:1a",
                      "label": "Chame: sem a supervisora aqui, quem decide somos nós dois mesmo.",
                      "reply": "Tá bem, então eu chamo e a gente segue o horário."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:1b",
                      "label": "Antes, procuramos quem responde pela sala na ausência dela.",
                      "reply": "Faz sentido: deve ter alguém indicado. Vou ver na escala do serviço."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:1c",
                      "label": "Refaça o teste até o valor entrar no padrão, e aí chame.",
                      "reply": "Posso repetir até dar um valor melhor, então?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-06:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m32:aula-06:i4:2",
                  "line": "A supervisora pediu que a assistência venha. O que eu escrevo no registro?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:2a",
                      "label": "Só o valor que deveria ter dado, para a planilha ficar limpa.",
                      "reply": "Escrevo o valor esperado, então, e deixo o outro de lado."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:2b",
                      "label": "Que o teste passou na segunda tentativa, e mais nada.",
                      "reply": "Escrevo que passou na repetição, então, e fecho a planilha."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:2c",
                      "label": "O teste, o valor, a referência, a data e quem foi avisado.",
                      "reply": "Anoto tudo isso agora, e deixo espaço para o teste depois do conserto."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-06:i4:2c"
                },
                {
                  "id": "turn:rtg-2026:m32:aula-06:i4:3",
                  "line": "A assistência já consertou. O equipamento já pode atender?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:3a",
                      "label": "Sim, desde que o equipamento pareça normal a olho nu, como antes.",
                      "reply": "Então vou chamar a primeira pessoa, já que parece normal."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:3b",
                      "label": "Só depois do teste de confirmação e da decisão do serviço.",
                      "reply": "Combinado: eu espero o teste e a decisão de quem o serviço indicou."
                    },
                    {
                      "id": "option:rtg-2026:m32:aula-06:i4:3c",
                      "label": "Sim, porque a assistência técnica já esteve aqui e saiu.",
                      "reply": "Então vou liberar a sala, já que a assistência veio."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m32:aula-06:i4:3b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m32:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m32:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Em outro setor da simulação, julgue cada afirmação sobre um teste que falhou."
            },
            "help": "O que o estudante pode fazer, e o que só a equipe decide?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que é do estudante, do serviço e da equipe, num setor novo.",
              "incorrect": "Releia o conceito: o estudante anota e avisa, e quem decide sobre a sala é quem o serviço designa."
            },
            "payload": {
              "prompt": "Em outro setor da simulação, julgue cada afirmação sobre um teste que falhou.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m32:aula-06:i5:1",
                  "text": "Se o valor parecer próximo do padrão, o estudante pode liberar a sala.",
                  "isTrue": false,
                  "explanation": "Errado: liberar a sala é decisão de quem o serviço designa, qualquer que seja a aparência do valor."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-06:i5:2",
                  "text": "Depois do conserto, o teste é refeito e o resultado entra no registro.",
                  "isTrue": true,
                  "explanation": "Certo: o teste refeito mostra se o problema foi resolvido, e fica no registro."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-06:i5:3",
                  "text": "Quem decide se o equipamento sai de uso é quem o serviço designa.",
                  "isTrue": true,
                  "explanation": "Certo: o serviço define a regra e quem a aplica, e o estudante avisa."
                },
                {
                  "id": "statement:rtg-2026:m32:aula-06:i5:4",
                  "text": "Uma colega pode apagar um valor fora do padrão, porque foi só um dia ruim.",
                  "isTrue": false,
                  "explanation": "Errado: o valor fica no registro, e quem o analisa é a equipe, e não a pessoa que o mediu."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m32:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você consegue registrar um teste fora do padrão com o que foi medido, visto e avisado, e seguir a regra do serviço. Liberar a sala e ajustar o equipamento ficam com quem o serviço designa, e o teste refeito fecha o ciclo.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Anotar, avisar e esperar a decisão: assim o teste cumpre a função de proteger."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m32",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-01"
        ],
        "prompt": "Um serviço quer saber se o desempenho de um equipamento mudou desde que foi aceito. Que tipo de teste responde a isso?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-01:c1:a",
            "label": "O de aceitação, repetido a cada turno"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c1:b",
            "label": "O de constância, comparado com a referência"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c1:c",
            "label": "O de depois da manutenção, feito todo mês"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c1:d",
            "label": "Nenhum: sem queixa, o desempenho se presume igual"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-01:c1:b",
        "feedback": {
          "correct": "Isso: a constância repete a medida e compara com a referência fixada no começo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-01"
        ],
        "prompt": "A assistência acabou de recalibrar o detector de uma sala da simulação. Que pergunta o teste feito agora responde?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-01:c2:a",
            "label": "O equipamento é novo e seguro para a primeira vez?"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c2:b",
            "label": "O valor de referência precisa ser trocado por outro?"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c2:c",
            "label": "A planilha de registros está completa?"
          },
          {
            "id": "option:rtg-2026:m32:aula-01:c2:d",
            "label": "O problema que levou ao chamado foi resolvido?"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-01:c2:d",
        "feedback": {
          "correct": "Isso: o teste depois da manutenção confirma se o problema foi resolvido.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
          "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-02"
        ],
        "prompt": "Que teste responde se o tempo de exposição que o aparelho cumpre bate com o tempo indicado?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-02:c1:a",
            "label": "O de tempo"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c1:b",
            "label": "O de tensão"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c1:c",
            "label": "O de rendimento"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c1:d",
            "label": "O de filtração"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-02:c1:a",
        "feedback": {
          "correct": "Isso: o teste de tempo compara o tempo medido com o indicado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-02"
        ],
        "prompt": "Um colega diz que, com o painel mostrando o valor certo, o teste de filtração é dispensável. O que você responde?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-02:c2:a",
            "label": "Tem razão: o painel já resume tudo que o feixe tem"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c2:b",
            "label": "A filtração só importa para a imagem, e não para o paciente"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c2:c",
            "label": "O painel não mostra a filtração, só a medida mostra"
          },
          {
            "id": "option:rtg-2026:m32:aula-02:c2:d",
            "label": "Só vale se o equipamento for novo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-02:c2:c",
        "feedback": {
          "correct": "Isso: a filtração não aparece no painel, e pouca filtração expõe mais o paciente.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-03"
        ],
        "prompt": "No teste de alinhamento, o que o campo de luz representa?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-03:c1:a",
            "label": "A área que o feixe de fato atingiu"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c1:b",
            "label": "A área do detector que guarda a imagem"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c1:c",
            "label": "A área que se pretende irradiar"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c1:d",
            "label": "A dose que o paciente recebe"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-03:c1:c",
        "feedback": {
          "correct": "Isso: é a referência da equipe para onde o feixe deveria cair.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-03"
        ],
        "prompt": "No esquema, o campo de radiação está deslocado em relação ao de luz. Que consequência combina com o que se vê?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-03:c2:a",
            "label": "Parte da região pedida pode ficar sem radiação, e parte cai fora da luz"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c2:b",
            "label": "A imagem sai sempre melhor, porque o campo se alarga e cobre mais"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c2:c",
            "label": "Nada muda, porque os dois campos têm exatamente o mesmo tamanho"
          },
          {
            "id": "option:rtg-2026:m32:aula-03:c2:d",
            "label": "A radiação espalhada deixa de existir na sala durante a exposição"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-03:c2:a",
        "feedback": {
          "correct": "Isso: o deslocamento deixa uma faixa só iluminada e outra só irradiada.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-04"
        ],
        "prompt": "O que a imagem de um teste de uniformidade do detector deveria mostrar?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-04:c1:a",
            "label": "Os pulmões e as costelas de um paciente padrão"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c1:b",
            "label": "Uma faixa clara a cada coluna de pixels"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c1:c",
            "label": "Um degradê do centro para as bordas"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c1:d",
            "label": "Uma imagem lisa, parecida em toda a área"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: sem objeto no caminho, a imagem deve ser muito parecida em toda parte.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
          "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-04"
        ],
        "prompt": "Por que uma faixa clara numa imagem de uniformidade merece atenção, mesmo sem paciente?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-04:c2:a",
            "label": "Porque o teste só vale se a imagem final ficar bonita"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c2:b",
            "label": "Porque pode imitar ou esconder um achado clínico"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c2:c",
            "label": "Porque a faixa aumenta a dose do paciente seguinte"
          },
          {
            "id": "option:rtg-2026:m32:aula-04:c2:d",
            "label": "Porque sem paciente nenhuma marca importa de verdade"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: a mesma marca numa imagem de paciente atrapalharia a leitura.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-05"
        ],
        "prompt": "Com que valor se compara um nível de referência de diagnóstico?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-05:c1:a",
            "label": "Com o valor típico de uma sala, para um exame padrão"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c1:b",
            "label": "Com a maior dose já medida num paciente do serviço"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c1:c",
            "label": "Com a dose de cada paciente atendido pela sala"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c1:d",
            "label": "Com o limite de dose do trabalhador do serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-05:c1:a",
        "feedback": {
          "correct": "Isso: compara-se a mediana de uma sala ou serviço, e não um valor de paciente.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
          "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-05"
        ],
        "prompt": "Um colega diz que o nível de referência é o limite de dose do paciente. O que você responde?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-05:c2:a",
            "label": "É sim, mas só vale para exames de crianças e jovens"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c2:b",
            "label": "É sim, e a sala que passar dele sai de uso"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c2:c",
            "label": "Não é nada: serve só para enfeitar o relatório"
          },
          {
            "id": "option:rtg-2026:m32:aula-05:c2:d",
            "label": "Não é limite: é um nível de investigação entre salas"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-05:c2:d",
        "feedback": {
          "correct": "Isso: o nível ajuda a otimizar, e a dose do paciente fica fora dele.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
          "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-06"
        ],
        "prompt": "Depois do conserto de um equipamento da simulação, o que fecha o ciclo da falha no registro?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-06:c1:a",
            "label": "A conversa de corredor com a assistência"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c1:b",
            "label": "O teste refeito, com o resultado anotado"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c1:c",
            "label": "A decisão do estudante de que está bom"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c1:d",
            "label": "A troca do valor de referência pelo novo valor"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-06:c1:b",
        "feedback": {
          "correct": "Isso: o teste refeito mostra se o problema foi resolvido, e o resultado fica no registro.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m32:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m32:aula-06"
        ],
        "prompt": "Quem decide se um equipamento com teste fora do padrão sai de uso?",
        "options": [
          {
            "id": "option:rtg-2026:m32:aula-06:c2:a",
            "label": "O estudante que fez o teste"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c2:b",
            "label": "O paciente que está esperando"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c2:c",
            "label": "Quem o serviço designa, seguindo a regra do serviço"
          },
          {
            "id": "option:rtg-2026:m32:aula-06:c2:d",
            "label": "Quem estiver com a agenda mais cheia naquele turno"
          }
        ],
        "correctOptionId": "option:rtg-2026:m32:aula-06:c2:c",
        "feedback": {
          "correct": "Isso: a decisão e a regra são do serviço, e o estudante avisa.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
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
      "claimId": "interaction:rtg-2026:m32:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-01:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "group:rtg-2026:m32:aula-01:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "group:rtg-2026:m32:aula-01:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "group:rtg-2026:m32:aula-01:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-01:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-01:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-02:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m32:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m32:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m32:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m32:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-02:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-02:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-02:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-02:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m32:aula-02:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m32:aula-02:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "token:rtg-2026:m32:aula-02:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m32:aula-02:i5:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "token:rtg-2026:m32:aula-02:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m32:aula-02:i5:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m32:aula-02:i5:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora",
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora",
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora",
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-02:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-03:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "group:rtg-2026:m32:aula-03:i4:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "group:rtg-2026:m32:aula-03:i4:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m32:aula-03:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:1a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-03:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:2b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i3:f",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:1a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-04:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-04:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-04:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-04:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
        "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "point:rtg-2026:m32:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "label:rtg-2026:m32:aula-05:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i3:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-05:i4:7",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:1a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:2b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao",
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao",
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:pmc-kap-definicao",
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:icrpaedia-sistema-de-protecao-2"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
        "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "region:rtg-2026:m32:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i3:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m32:aula-06:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:3a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:3b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:i4:3c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-06:i5:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m32:aula-06:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m32:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m32:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m32:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m32:aula-06:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m32:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m32:aula-01",
        "hook": "Complete a frase: os valores de referência se fixam antes do…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-01"
          ],
          "prompt": "De qual momento saem os valores de referência que os testes seguintes usam?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-01:rg:a",
              "label": "Do começo, antes do primeiro uso"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rg:b",
              "label": "Da constância, na semana mais recente"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rg:c",
              "label": "Da manutenção, quando a assistência sai"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rg:d",
              "label": "Do registro mais antigo da planilha, qualquer que seja"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-01:rg:a",
          "feedback": {
            "correct": "Isso: antes do primeiro paciente se fixam as medidas com as quais o resto é comparado.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-01"
          ],
          "prompt": "Na mamografia da simulação, a equipe repete todo mês as mesmas medidas e compara com as do primeiro dia. Que teste é esse?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-01:rt:a",
              "label": "Aceitação"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rt:b",
              "label": "Teste de depois da manutenção"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rt:c",
              "label": "Constância"
            },
            {
              "id": "option:rtg-2026:m32:aula-01:rt:d",
              "label": "Ação corretiva"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-01:rt:c",
          "feedback": {
            "correct": "Isso: repetir as mesmas medidas e comparar com a referência é a constância.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m32:aula-02",
        "hook": "Complete a frase: o painel mostra o que foi pedido, e o medidor mostra…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-02"
          ],
          "prompt": "O que o medidor sobre a mesa mostra, neste esquema?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-02:rg:a",
              "label": "O que o painel pediu"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rg:b",
              "label": "O que o tubo entregou"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rg:c",
              "label": "O que o paciente recebeu"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rg:d",
              "label": "O que o colimador escolheu"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-02:rg:b",
          "feedback": {
            "correct": "Isso: o medidor lê o feixe que chegou até ele.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-02"
          ],
          "prompt": "Em outra sala da simulação, o físico médico mede a camada semirredutora do feixe. Que pergunta esse teste ajuda a responder?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-02:rt:a",
              "label": "Se o painel mostra o tempo certo"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rt:b",
              "label": "Se o detector tem uma linha com defeito"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rt:c",
              "label": "Se o paciente está bem posicionado"
            },
            {
              "id": "option:rtg-2026:m32:aula-02:rt:d",
              "label": "Se a filtração do feixe basta"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-02:rt:d",
          "feedback": {
            "correct": "Isso: a camada semirredutora mostra se a filtração do feixe basta.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
            "source:rtg-2026:m32:jacmp-2026-camada-semirredutora"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m32:aula-03",
        "hook": "Complete a frase: o campo de luz mostra a área que se pretende…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-03"
          ],
          "prompt": "Que campo mostra onde o feixe de fato atinge?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-03:rg:a",
              "label": "O campo de luz"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rg:b",
              "label": "O campo de radiação"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rg:c",
              "label": "O marcador de canto"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rg:d",
              "label": "O receptor de imagem"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-03:rg:b",
          "feedback": {
            "correct": "Isso: é a área que o feixe de fato atinge.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-03"
          ],
          "prompt": "Em outra sala da simulação, o técnico nota que o feixe parece cair mais para um lado que a luz. O que ele faz?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-03:rt:a",
              "label": "Gira o colimador até a luz coincidir"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rt:b",
              "label": "Abre mais o campo para garantir"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rt:c",
              "label": "Segue atendendo, porque a luz parece certa"
            },
            {
              "id": "option:rtg-2026:m32:aula-03:rt:d",
              "label": "Descreve o que viu e avisa a equipe responsável"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-03:rt:d",
          "feedback": {
            "correct": "Isso: observar e avisar é o papel do estudante, e o ajuste é da equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m32:aula-04",
        "hook": "Complete a frase: no teste de uniformidade, o detector é exposto sem…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-04"
          ],
          "prompt": "O que pode ficar no caminho do feixe no teste de uniformidade?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-04:rg:a",
              "label": "No máximo uma placa lisa, igual em toda parte"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rg:b",
              "label": "Um paciente simulado em posição padrão"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rg:c",
              "label": "Um objeto metálico, para comparar"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rg:d",
              "label": "Uma luva de chumbo sobre o centro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-04:rg:a",
          "feedback": {
            "correct": "Isso: com o feixe uniforme, uma imagem lisa é o esperado de um detector sem falha.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
            "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-04"
          ],
          "prompt": "A física médica compara a imagem de uniformidade de hoje com a de referência. Para que serve essa comparação?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-04:rt:a",
              "label": "Escolher a técnica do próximo paciente"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rt:b",
              "label": "Dispensar o teste de constância seguinte"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rt:c",
              "label": "Mostrar se o detector mudou desde a referência"
            },
            {
              "id": "option:rtg-2026:m32:aula-04:rt:d",
              "label": "Decidir qual detector é o mais bonito"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-04:rt:c",
          "feedback": {
            "correct": "Isso: comparar com a referência revela o que mudou ao longo do tempo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital",
            "source:rtg-2026:m32:aapm-tg150-testes-de-detector"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m32:aula-05",
        "hook": "Complete a frase: o nível de referência não é um limite de…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-05"
          ],
          "prompt": "O que um nível de referência não é?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-05:rg:a",
              "label": "Uma ferramenta de otimização"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rg:b",
              "label": "Um limite de dose"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rg:c",
              "label": "Um valor para comparar salas"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rg:d",
              "label": "Um nível de investigação"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-05:rg:b",
          "feedback": {
            "correct": "Isso: ele ajuda a investigar e otimizar, e não limita a dose.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:icrp-135-niveis-de-referencia"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-05"
          ],
          "prompt": "Na tomografia da simulação, o valor típico da sala fica acima da linha do serviço. Qual é a leitura adequada?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-05:rt:a",
              "label": "A sala passou de um limite e deve parar"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rt:b",
              "label": "Todos os pacientes da sala receberam dose indevida"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rt:c",
              "label": "É sinal para a equipe investigar as causas, sem prova de erro"
            },
            {
              "id": "option:rtg-2026:m32:aula-05:rt:d",
              "label": "O estudante deve ajustar o equipamento para baixar a linha"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-05:rt:c",
          "feedback": {
            "correct": "Isso: acima da linha investiga-se, e não se conclui sozinho que há erro.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:icrp-135-niveis-de-referencia",
            "source:rtg-2026:m32:pmc-nrd-radiografia-torax-abdome"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m32:aula-06",
        "hook": "Complete a frase: no registro, o valor que entra é o que foi…",
        "guided": {
          "id": "recovery-item:rtg-2026:m32:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-06"
          ],
          "prompt": "O teste de hoje deu um valor fora do padrão. Que valor você anota no registro?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-06:rg:a",
              "label": "O esperado, para a planilha fechar"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rg:b",
              "label": "A média entre o medido e o esperado"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rg:c",
              "label": "O medido, ao lado do de referência"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rg:d",
              "label": "Nenhum, até a assistência chegar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-06:rg:c",
          "feedback": {
            "correct": "Isso: com o medido e a referência lado a lado, a equipe vê o desvio.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m32:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m32:aula-06"
          ],
          "prompt": "Uma colega propõe apagar da planilha o valor fora do padrão, porque foi só um dia ruim. O que você responde?",
          "options": [
            {
              "id": "option:rtg-2026:m32:aula-06:rt:a",
              "label": "Tudo bem, desde que você me avise antes"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rt:b",
              "label": "Apague, mas anote a causa que você acha mais provável"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rt:c",
              "label": "Deixe como está até o fim do mês e decida depois"
            },
            {
              "id": "option:rtg-2026:m32:aula-06:rt:d",
              "label": "O valor fica no registro, e a equipe analisa"
            }
          ],
          "correctOptionId": "option:rtg-2026:m32:aula-06:rt:d",
          "feedback": {
            "correct": "Isso: o registro mostra o que foi medido, e a análise é da equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m32:acpsem-2024-qa-radiografia-digital"
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
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "7ed470ee55bbdfd5cfb50f994a7640329099223b389047446d861e19d906a1ea"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
