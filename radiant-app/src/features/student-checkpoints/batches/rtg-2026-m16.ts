// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M16: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m16",
  "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d",
  "trackId": "track:rtg-2026:m16",
  "unitId": "unit:rtg-2026:m16",
  "contentVersion": "rtg-2026-m16-v1",
  "competencyIds": [
    "competency:rtg-2026:m16:aula-01",
    "competency:rtg-2026:m16:aula-02",
    "competency:rtg-2026:m16:aula-03",
    "competency:rtg-2026:m16:aula-04",
    "competency:rtg-2026:m16:aula-05",
    "competency:rtg-2026:m16:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m16:cdc-precaucoes-transmissao",
      "title": "Transmission-Based Precautions (Isolation Precautions in Healthcare Settings)",
      "publisher": "CDC",
      "url": "https://www.cdc.gov/infection-control/hcp/isolation-precautions/precautions.html",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página do CDC, domínio público dos EUA; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:m16:hps-gestante-radiologia",
      "title": "Radiation and pregnancy: perguntas e respostas para radiologia",
      "publisher": "Health Physics Society",
      "url": "https://hps.org/physicians/radiology_pregnant_patient_qa/",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m16:radiologyinfo-torax",
      "title": "Radiografia do tórax (Chest X-ray)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/chestrad",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m16:radiologyinfo-osso",
      "title": "Radiografia óssea (Bone X-ray)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/bonerad",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página institucional para pacientes; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m16:radiologyinfo-contraste",
      "title": "Contrast Materials",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/safety-contrast",
      "accessedAt": "2026-11-13",
      "use": "factual-reference",
      "licenseNote": "Página de orientação ao paciente; consultada para o que informar antes do exame, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m16:radiopaedia-torax-ap",
      "title": "Chest (AP erect view)",
      "publisher": "Radiopaedia.org",
      "url": "https://radiopaedia.org/articles/chest-ap-erect-view-1",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Fonte da M08.05, citada aqui só para a recuperação do que aquela aula ensinou; licença restritiva, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m16:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-contraste",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Condição clínica não é diagnóstico",
            "body": "Hoje você vai conseguir separar o que a solicitação informa do que cabe a outro profissional decidir.",
            "dialogue": {
              "setting": "Sala de radiografia do serviço-escola",
              "lines": [
                {
                  "speaker": "paciente",
                  "text": "A médica escreveu que é por causa da minha dor no ombro. Então você já sabe o que eu tenho, não é?",
                  "name": "Dona Marta"
                },
                {
                  "speaker": "duda",
                  "text": "Está no pedido: dor no ombro depois de uma queda. Eu até ia dizer o que me parece que é."
                },
                {
                  "speaker": "lia",
                  "text": "Duda, o pedido informa a queixa. Dar nome ao que a pessoa tem é tarefa de quem?"
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos separar duas coisas: o que chega escrito e o que outros profissionais decidem."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "O pedido informa, não decide",
            "body": "A solicitação traz a história clínica que a equipe tem: a queixa, o que aconteceu e o motivo do exame. Você lê esses dados para entender o que a pessoa sente e quais cuidados a sala pede. Ela não pede que você descubra o que a pessoa tem. Quem interpreta as imagens é o radiologista, e quem conversa sobre o resultado com a pessoa é o médico que a acompanha. Trocar o exame pedido também não cabe a você. Se o pedido e o relato da pessoa não combinam, descreva o que encontrou e peça apoio à equipe.",
            "keyPoints": [
              "O pedido informa a queixa e o motivo; você usa isso para cuidar da sala.",
              "Nomear a doença, trocar o exame e explicar o resultado são decisões de outros.",
              "Pedido e relato que não combinam: descrever e pedir apoio."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na triagem do contraste, o paciente contou uma alergia. O que essa informação pedia de você?"
            },
            "help": "Lembre: na triagem, você registra ou veredita?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: você registra e avisa, e quem avalia é a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na triagem do contraste, o paciente contou uma alergia. O que essa informação pedia de você?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-01:i1:a",
                  "label": "Concluir sozinho que o exame está proibido.",
                  "explanation": "Proibir é decidir pela equipe. Retome: a triagem registra e avisa, sem veredito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i1:b",
                  "label": "Concluir sozinho que o exame está liberado.",
                  "explanation": "Liberar sem avaliação também é decidir sozinho. Confira de novo o papel da triagem."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i1:c",
                  "label": "Anotar com as palavras da pessoa e avisar a equipe antes de seguir.",
                  "explanation": "Isso: você registra e avisa, e quem avalia é a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i1:d",
                  "label": "Deixar de anotar, porque a equipe já conhece o paciente.",
                  "explanation": "Sem a anotação, a equipe pode não ver a informação. Retome o que a triagem pede."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada item: ele vem da solicitação ou é decisão de outro profissional?"
            },
            "help": "O pedido descreve a situação. Quem decide o quê?",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que o pedido registra do que outros profissionais decidem.",
              "incorrect": "Pergunte de cada item: é um dado da pessoa escrito no pedido, ou uma escolha que nomeia a doença ou muda o exame?"
            },
            "payload": {
              "prompt": "Classifique cada item: ele vem da solicitação ou é decisão de outro profissional?",
              "categories": [
                {
                  "id": "group:rtg-2026:m16:aula-01:i2:a",
                  "label": "Informação da solicitação"
                },
                {
                  "id": "group:rtg-2026:m16:aula-01:i2:b",
                  "label": "Decisão de outro profissional"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:5",
                  "label": "Trocar o exame pedido por outro",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:b"
                },
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:6",
                  "label": "Interpretar as imagens e escrever o laudo",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:b"
                },
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:1",
                  "label": "Queda de escada com dor no punho",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:a"
                },
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:4",
                  "label": "Dizer à paciente qual é o diagnóstico",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:b"
                },
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:2",
                  "label": "Uso de anticoagulante anotado no pedido",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:a"
                },
                {
                  "id": "item:rtg-2026:m16:aula-01:i2:3",
                  "label": "Tosse há três dias, descrita no pedido",
                  "categoryId": "group:rtg-2026:m16:aula-01:i2:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a solicitação e o seu papel."
            },
            "help": "Ler a queixa é o mesmo que concluir sobre ela?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou ler o pedido de decidir sobre ele.",
              "incorrect": "Releia o conceito: o pedido informa a situação, e nomear a doença ou mudar o exame cabe a outros profissionais."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a solicitação e o seu papel.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m16:aula-01:i3:1",
                  "text": "O pedido pode trazer a queixa e o motivo do exame.",
                  "isTrue": true,
                  "explanation": "Certo: queixa e história são dados que a equipe registrou para o exame."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-01:i3:2",
                  "text": "Quem lê o pedido já pode dizer à pessoa o que ela tem, para tranquilizá-la.",
                  "isTrue": false,
                  "explanation": "Errado: ler a queixa não é diagnosticar. O resultado é conversado pelo médico que acompanha a pessoa."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-01:i3:3",
                  "text": "Se o pedido e o relato divergem, você descreve a diferença e pede apoio.",
                  "isTrue": true,
                  "explanation": "Certo: você não corrige o pedido sozinho; descreve o que encontrou e a equipe decide."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua resposta?"
            },
            "help": "Acolher é seu; diagnosticar, não.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: você acolhe e leva a conversa sobre o resultado a quem cabe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge entrega o pedido de radiografia do tórax, com a queixa 'tosse e febre'. Ele pergunta, ansioso: 'Moço, é coisa grave? Você já me diz o que eu tenho?'",
              "prompt": "Qual é a sua resposta?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-01:i4:a",
                  "label": "Acolher e dizer que o médico dele fala do resultado.",
                  "explanation": "Isso: você acolhe e leva a conversa sobre o resultado a quem cabe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i4:b",
                  "label": "Dizer que provavelmente é algo simples, só para acalmá-lo agora.",
                  "explanation": "Antecipar uma causa é dar diagnóstico sem ser o profissional que decide. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i4:c",
                  "label": "Dizer que vai olhar as imagens e contar na saída do exame.",
                  "explanation": "Comentar as imagens é interpretar, e isso cabe ao radiologista. Confira de novo."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i4:d",
                  "label": "Ficar em silêncio e seguir o exame, sem responder a nada.",
                  "explanation": "Silêncio deixa a preocupação sem acolhida. Retome: acolher cabe a você, o resultado não."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-01:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: O pedido é de radiografia do punho, com a queixa 'dor depois de queda'. A paciente aponta o tornozelo como o lugar que dói. O que você faz?"
            },
            "help": "Quem decide quando pedido e relato não combinam?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: pedido e relato divergem, então você descreve e a equipe decide.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "O pedido é de radiografia do punho, com a queixa 'dor depois de queda'. A paciente aponta o tornozelo como o lugar que dói. O que você faz?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-01:i5:a",
                  "label": "Radiografa o tornozelo, porque a paciente sabe onde dói e fala.",
                  "explanation": "Mudar a região é mudar o exame pedido, e isso não cabe a você. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i5:b",
                  "label": "Radiografa o punho, porque o pedido é o documento oficial.",
                  "explanation": "Seguir o pedido ignora a divergência que você viu. Descreva-a à equipe antes de expor."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i5:c",
                  "label": "Corrige o pedido por conta própria e segue com o exame.",
                  "explanation": "Corrigir o registro sozinho tira da equipe a decisão. Descreva e peça apoio."
                },
                {
                  "id": "option:rtg-2026:m16:aula-01:i5:d",
                  "label": "Descreve a diferença à equipe e aguarda antes de expor.",
                  "explanation": "Isso: pedido e relato divergem, então você descreve e a equipe decide."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-01:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê, a equipe decide",
            "body": "Agora você consegue separar o que a solicitação informa do que outros profissionais decidem: nomear a doença, trocar o exame e explicar o resultado ficam com eles. Quando pedido e relato não combinam, você descreve o que encontrou e chama a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Saber o que não é seu faz parte de cuidar bem."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m16:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Dor e mobilidade limitada",
            "body": "Hoje você vai conseguir adaptar a abordagem a quem sente dor, sem forçar o membro e pedindo apoio.",
            "dialogue": {
              "setting": "Sala de radiografia, paciente na maca",
              "lines": [
                {
                  "speaker": "paciente",
                  "text": "Moço, meu braço dói demais. Dá para você só puxar ele para o lado, rapidinho?",
                  "name": "Seu Jorge"
                },
                {
                  "speaker": "caio",
                  "text": "Se doer mais, a pessoa trava e a imagem piora. E eu não movo membro nenhum sem combinar antes."
                },
                {
                  "speaker": "pixel",
                  "text": "O que vem primeiro quando a dor aparece: o jeito rápido ou o combinado?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "A dor é informação",
            "body": "Dor intensa ou limitação de movimento muda a abordagem. Você não move o membro contra a dor nem contra uma suspeita de lesão, e não retira por conta própria o que o imobiliza. Pergunte onde dói e o que a pessoa consegue fazer sozinha, explique cada passo e avise antes de tocar. Adapte o que o protocolo permite: mova a maca, o tubo e o detector, e use os apoios do serviço. Se a posição padrão não for possível, ou a dor aumentar, pare e chame a equipe. Como mover a pessoa é decisão da equipe, pelo protocolo do serviço.",
            "keyPoints": [
              "Não mover o membro contra a dor nem retirar imobilização por conta própria.",
              "Adaptar equipamento e apoios dentro do protocolo.",
              "Dor que aumenta ou posição impossível: parar e chamar a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de posicionamento, a pessoa não consegue a posição padrão. Qual é o primeiro passo?"
            },
            "help": "Pense: parar ou ajustar, o que vem primeiro?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: parar e descrever vêm antes de qualquer adaptação.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de posicionamento, a pessoa não consegue a posição padrão. Qual é o primeiro passo?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-02:i1:a",
                  "label": "Forçar a posição aos poucos, até a pessoa tolerar.",
                  "explanation": "Forçar contra a limitação não cabe a você. Retome a sequência: parar e descrever."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i1:b",
                  "label": "Disparar uma imagem de teste para ver como fica.",
                  "explanation": "Uma exposição de teste não resolve a limitação e é exposição sem necessidade. Retome o primeiro passo."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i1:c",
                  "label": "Ajustar o tubo antes de falar com a pessoa.",
                  "explanation": "Ajustar o tubo antes de conversar deixa de fora o que a pessoa consegue fazer. Retome a ordem."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i1:d",
                  "label": "Parar e descrever a limitação, pedindo apoio se preciso.",
                  "explanation": "Isso: parar e descrever vêm antes de qualquer adaptação."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as condutas seguras diante de uma pessoa com dor forte no braço."
            },
            "help": "O que você pode mover sem tocar na região que dói?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou as condutas que preservam o membro e deixou de fora as que forçam.",
              "incorrect": "Releia o conceito: não se move o membro contra a dor nem se retira imobilização sozinho. Adapte o equipamento e comunique."
            },
            "payload": {
              "prompt": "Marque todas as condutas seguras diante de uma pessoa com dor forte no braço.",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:a",
                  "label": "Pedir que a pessoa gire o braço até o ponto em que dói pouco.",
                  "explanation": "Girar o braço com dor é mover o membro sem combinar. Como movê-lo é decisão da equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:b",
                  "label": "Explicar cada passo e avisar antes de tocar.",
                  "explanation": "Certo: explicar e avisar reduz o susto e a tensão da pessoa."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:c",
                  "label": "Retirar a tala para facilitar a posição.",
                  "explanation": "Retirar a imobilização por conta própria não cabe a você. Chame a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:d",
                  "label": "Mover a maca, o tubo e o detector em vez do braço.",
                  "explanation": "Certo: adaptar o equipamento preserva o membro."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:e",
                  "label": "Perguntar onde dói e o que a pessoa move sozinha.",
                  "explanation": "Certo: a pessoa mostra o que tolera, e você adapta com base nisso."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i2:f",
                  "label": "Segurar o braço com firmeza para a pessoa não se mexer.",
                  "explanation": "Conter o braço à força vai contra o cuidado combinado. Peça apoio em vez de conter."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m16:aula-02:i2:b",
                "option:rtg-2026:m16:aula-02:i2:d",
                "option:rtg-2026:m16:aula-02:i2:e"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "O que se faz primeiro quando a dor piora?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: a dor que aumenta pede pausa e a equipe, não pressa.",
              "incorrect": "Pense no gesto seguro: parar quando a dor aumenta e levar a decisão sobre mover o membro a quem cabe decidir."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "Se a dor aumentar durante o posicionamento, você ",
                " e chama a ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m16:aula-02:i3:2",
                  "label": "equipe"
                },
                {
                  "id": "token:rtg-2026:m16:aula-02:i3:3",
                  "label": "insiste"
                },
                {
                  "id": "token:rtg-2026:m16:aula-02:i3:4",
                  "label": "acelera"
                },
                {
                  "id": "token:rtg-2026:m16:aula-02:i3:5",
                  "label": "família"
                },
                {
                  "id": "token:rtg-2026:m16:aula-02:i3:1",
                  "label": "pausa"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m16:aula-02:i3:1",
                  "correctTokenId": "token:rtg-2026:m16:aula-02:i3:1"
                },
                {
                  "id": "blank:rtg-2026:m16:aula-02:i3:2",
                  "correctTokenId": "token:rtg-2026:m16:aula-02:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "A dor aumentou. O que vem agora?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: pare, preserve o membro e chame quem decide.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Dona Marta chegou de cadeira de rodas, com o antebraço engessado. O pedido é de radiografia do antebraço. Ao posicionar, ela grita e diz que o gesso aperta e dói mais.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-02:i4:a",
                  "label": "Parar, não mexer no gesso nem no braço e chamar a equipe.",
                  "explanation": "Isso: pare, preserve o membro e chame quem decide."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i4:b",
                  "label": "Cortar o gesso para aliviar a pressão.",
                  "explanation": "Cortar ou abrir o gesso não cabe a você: quem decide é a equipe. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i4:c",
                  "label": "Pedir que ela aguente só mais uma imagem.",
                  "explanation": "Pedir que aguente ignora a dor que aumentou. Pare e chame a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i4:d",
                  "label": "Girar o antebraço devagar até a posição do protocolo.",
                  "explanation": "Girar o antebraço com dor é mover o membro. Retome: adaptar é mover o equipamento, não o membro."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-02:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Seu Jorge tem dor no quadril e não consegue virar na maca. O que você pode adaptar sem mover a perna?"
            },
            "help": "Adaptar o quê, o membro ou o equipamento?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: adapta o equipamento, preserva a perna e comunica.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Seu Jorge tem dor no quadril e não consegue virar na maca. O que você pode adaptar sem mover a perna?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-02:i5:a",
                  "label": "Pedir que ele vire de lado devagar, com a ajuda da Duda aqui.",
                  "explanation": "Virar com dor, mesmo com ajuda, é mover a pessoa sem a equipe decidir. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i5:b",
                  "label": "Puxar a perna dele para alinhar com o detector da mesa.",
                  "explanation": "Puxar a perna é mover o membro contra a dor. Adapte o equipamento."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i5:c",
                  "label": "Mover tubo e detector, usar apoios do serviço e avisar a equipe.",
                  "explanation": "Isso: adapta o equipamento, preserva a perna e comunica."
                },
                {
                  "id": "option:rtg-2026:m16:aula-02:i5:d",
                  "label": "Radiografar como ele está, sem avisar ninguém da equipe.",
                  "explanation": "Seguir sem avisar deixa a equipe sem saber da limitação. Descreva e peça apoio."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Adaptar sem forçar",
            "body": "Agora você consegue abordar quem sente dor: perguntar, explicar, adaptar o equipamento dentro do protocolo e parar para chamar a equipe quando a dor aumenta ou a posição não é possível. O membro não é movido contra a dor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Imagem boa não vale uma dor a mais."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m16:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiopaedia-torax-ap",
          "source:rtg-2026:m16:radiologyinfo-torax",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Falta de ar e quem não deita",
            "body": "Hoje você vai conseguir reconhecer quando a posição padrão não é possível por falta de ar e comunicar.",
            "dialogue": {
              "setting": "Sala de radiografia do serviço-escola",
              "lines": [
                {
                  "speaker": "paciente",
                  "text": "Eu não consigo me deitar, moço. Quando deito, parece que me falta o ar.",
                  "name": "Dona Marta"
                },
                {
                  "speaker": "caio",
                  "text": "Então a maca deitada não é ponto de partida para ela. Primeiro a gente descobre o que ela tolera."
                },
                {
                  "speaker": "duda",
                  "text": "Mas o pedido diz tórax. Eu coloco ela de pé de qualquer jeito, né?"
                },
                {
                  "speaker": "pixel",
                  "text": "De qualquer jeito, ou combinando com ela e com a equipe?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "A posição é combinada",
            "body": "A posição padrão supõe que a pessoa tolere ficar de pé, sentada ou deitada como o protocolo pede. A falta de ar pode impedir isso. Para o tórax, a referência descreve a pessoa de pé como o usual e prevê outra posição para quem não fica de pé. Em M08 você viu uma delas: sentada o mais ereta possível. Você não impõe posição: pergunte em qual a pessoa respira melhor, ofereça o que o protocolo permite, anote a posição usada e avise a equipe. Se a falta de ar piorar, pare e chame a equipe.",
            "keyPoints": [
              "A posição padrão pode não ser possível: pergunte em qual a pessoa tolera ficar.",
              "Use só as posições que o protocolo permite e anote a usada.",
              "Falta de ar que piora: parar e chamar a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de tórax, a pessoa não consegue ficar de pé. Qual posição foi descrita?"
            },
            "help": "Pense em quem não fica de pé: sentada ou o quê?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: sentada o mais ereta possível, com apoio se preciso.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de tórax, a pessoa não consegue ficar de pé. Qual posição foi descrita?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-03:i1:a",
                  "label": "Deitada de bruços, com o tórax na mesa.",
                  "explanation": "De bruços não foi a posição descrita para quem não fica de pé. Retome M08."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i1:b",
                  "label": "De pé, apoiada na parede, mesmo com dificuldade.",
                  "explanation": "Insistir em ficar de pé é impor a posição. Retome a alternativa sentada."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i1:c",
                  "label": "De cócoras, com o tórax inclinado para a frente.",
                  "explanation": "De cócoras não faz parte do que foi descrito. Retome a posição sentada, ereta."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i1:d",
                  "label": "Sentada o mais ereta possível, com as costas no receptor.",
                  "explanation": "Isso: sentada o mais ereta possível, com apoio se preciso."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-03:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a posição de quem tem falta de ar."
            },
            "help": "Quem sabe em qual posição a pessoa respira melhor?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou combinar a posição de impô-la.",
              "incorrect": "Releia o conceito: a posição se combina com a pessoa e com a equipe, e a falta de ar que piora pede pausa."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a posição de quem tem falta de ar.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m16:aula-03:i2:1",
                  "text": "Uma posição que a pessoa não tolera não deve ser imposta.",
                  "isTrue": true,
                  "explanation": "Certo: a posição se combina com a pessoa, dentro do protocolo. Impor não cabe a você."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-03:i2:2",
                  "text": "Perguntar em qual posição a pessoa respira melhor ajuda a combinar a adaptação.",
                  "isTrue": true,
                  "explanation": "Certo: a pessoa sabe o que tolera, e isso orienta a adaptação dentro do protocolo."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-03:i2:3",
                  "text": "Se a falta de ar piora no posicionamento, você para e chama a equipe.",
                  "isTrue": true,
                  "explanation": "Certo: piora é sinal para pausar e levar à equipe, sem esperar o fim da imagem."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-03:i2:4",
                  "text": "Pedir que a pessoa deite e aguente a falta de ar acelera o exame e é aceitável.",
                  "isTrue": false,
                  "explanation": "Errado: a pressa não justifica forçar a posição. Pare e combine com a equipe."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Associe cada situação à conduta adequada."
            },
            "help": "O que o protocolo permite, e o que vai para a equipe?",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada situação à conduta que respeita a pessoa e o protocolo.",
              "incorrect": "Confira de novo: o que o protocolo permite se combina e se anota; piora e pedido fora do protocolo vão à equipe."
            },
            "payload": {
              "prompt": "Associe cada situação à conduta adequada.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m16:aula-03:i3:1",
                  "left": "Pessoa que não tolera ficar deitada",
                  "right": "Combinar a posição que o protocolo permite e anotar"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-03:i3:2",
                  "left": "A falta de ar piora durante o posicionamento",
                  "right": "Parar e chamar a equipe"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-03:i3:3",
                  "left": "Pessoa respira melhor apoiada em travesseiros",
                  "right": "Usar o apoio previsto no serviço e registrar"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-03:i3:4",
                  "left": "Pessoa pede uma posição que o protocolo não prevê",
                  "right": "Descrever o pedido e deixar a decisão para a equipe"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "O ar piorou. O que muda na sua conduta?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: piora de falta de ar é pausa, presença e equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge, de cadeira de rodas, respira rápido e diz que não consegue se deitar. O pedido é de radiografia do tórax. Ele diz: 'Começa logo, eu aguento.' Enquanto você ajusta o detector, ele diz que o ar piorou.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-03:i4:a",
                  "label": "Fazer a imagem rápido, já que ele pediu para começar.",
                  "explanation": "Pressa com a falta de ar piorando coloca a pessoa em risco. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i4:b",
                  "label": "Interromper, ficar com ele e chamar a equipe pelo canal do serviço.",
                  "explanation": "Isso: piora de falta de ar é pausa, presença e equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i4:c",
                  "label": "Deitar o paciente com cuidado, para a imagem ficar no padrão.",
                  "explanation": "Deitar vai contra o que ele disse que não tolera. Pare e chame a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i4:d",
                  "label": "Deixá-lo sozinho e ir buscar o protocolo no corredor.",
                  "explanation": "Deixar a pessoa sozinha agrava o risco. Fique com ela e chame a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-03:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Marta consegue sentar, mas não ficar de pé. O protocolo do serviço prevê a posição sentada. O que você faz?"
            },
            "help": "A posição usada fica só na sua memória?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: usa a posição prevista, explica e registra.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Marta consegue sentar, mas não ficar de pé. O protocolo do serviço prevê a posição sentada. O que você faz?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-03:i5:a",
                  "label": "Posiciona de pé mesmo assim, para seguir o padrão do livro.",
                  "explanation": "Impor a posição de pé ignora a limitação. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i5:b",
                  "label": "Explica, posiciona sentada com o apoio previsto e registra.",
                  "explanation": "Isso: usa a posição prevista, explica e registra."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i5:c",
                  "label": "Muda o exame por conta própria, porque a posição mudou.",
                  "explanation": "A posição mudou, mas o exame pedido não é seu para trocar. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-03:i5:d",
                  "label": "Faz a imagem sem registrar, porque a posição é só detalhe.",
                  "explanation": "A posição usada precisa constar, pois quem interpreta a imagem a considera. Registre."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-03:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Combinar a posição",
            "body": "Agora você consegue reconhecer quando a posição padrão não é possível por falta de ar: pergunta o que a pessoa tolera, usa só o que o protocolo permite, registra a posição e chama a equipe quando o ar piora.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Quem respira com dificuldade não deve ser o preço da imagem."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m16:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-contraste",
          "source:rtg-2026:m16:hps-gestante-radiologia",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Gestação e possibilidade de gestação",
            "body": "Hoje você vai conseguir aplicar a triagem de possível gestação e levar a dúvida à equipe, sem decidir o exame.",
            "dialogue": {
              "setting": "Recepção da sala de radiografia",
              "lines": [
                {
                  "speaker": "paciente",
                  "text": "Minha menstruação atrasou, mas pode ser estresse. Acho que não estou grávida.",
                  "name": "Carla"
                },
                {
                  "speaker": "duda",
                  "text": "Ela mesma disse que acha que não. Então posso seguir, né?"
                },
                {
                  "speaker": "lia",
                  "text": "Duda, 'acho que não' é uma certeza?"
                },
                {
                  "speaker": "pixel",
                  "text": "Qual é o primeiro gesto quando a resposta não é um 'não' firme?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Na dúvida, pausa e equipe",
            "body": "O serviço pergunta sobre possível gestação antes de exames com radiação, e você segue o protocolo dele. Pergunte com respeito e em particular, e anote com as palavras da pessoa. Se ela diz que pode estar grávida, atrasou ou não sabe, pause antes de expor e avise a equipe. A Health Physics Society orienta considerar grávida quem está com a menstruação atrasada, até prova em contrário. O médico que pediu justifica o uso da radiação, e a equipe decide o que fazer. Você não cancela, não troca o exame nem acrescenta proteção sozinho. Na ordem ensinada nesta aula: perguntar, anotar, pausar, avisar, aguardar a decisão.",
            "keyPoints": [
              "Perguntar e anotar com as palavras da pessoa, em particular.",
              "Possível gestação, atraso ou 'não sei': pausar antes de expor e avisar a equipe.",
              "Cancelar, trocar o exame ou acrescentar proteção sozinho não cabe a você."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na triagem do contraste, 'não sei' era uma resposta. O que você faz com ela?"
            },
            "help": "O que a triagem pede com um 'não sei'?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: 'não sei' fica anotado como foi dito e vai à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na triagem do contraste, 'não sei' era uma resposta. O que você faz com ela?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-04:i1:a",
                  "label": "Troca por 'não' para completar o campo.",
                  "explanation": "Trocar a resposta adultera o registro. Retome o que a triagem pede."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i1:b",
                  "label": "Pergunta de novo até a pessoa dizer sim ou não.",
                  "explanation": "Insistir pressiona a pessoa e pode apagar a dúvida real. Anote e avise."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i1:c",
                  "label": "Anota como foi dita e leva à equipe antes de seguir.",
                  "explanation": "Isso: 'não sei' fica anotado como foi dito e vai à equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i1:d",
                  "label": "Considera liberado e segue.",
                  "explanation": "Considerar liberado é decidir sozinho. Retome: a equipe avalia."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-04:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Coloque as etapas na ordem ensinada nesta aula."
            },
            "help": "O que precisa acontecer antes da pausa?",
            "type": "ordering",
            "feedback": {
              "correct": "Você montou a sequência: perguntar, anotar, pausar, avisar e aguardar a decisão.",
              "incorrect": "Releia a ordem ensinada: primeiro a pergunta e o registro; depois a pausa e o aviso; por fim, a decisão da equipe."
            },
            "payload": {
              "prompt": "Coloque as etapas na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m16:aula-04:i2:3",
                  "label": "Pausar antes de qualquer exposição"
                },
                {
                  "id": "item:rtg-2026:m16:aula-04:i2:2",
                  "label": "Anotar a resposta com as palavras da pessoa"
                },
                {
                  "id": "item:rtg-2026:m16:aula-04:i2:1",
                  "label": "Perguntar sobre possível gestação, com respeito e em particular"
                },
                {
                  "id": "item:rtg-2026:m16:aula-04:i2:5",
                  "label": "Aguardar a decisão da equipe e seguir o que ela definir"
                },
                {
                  "id": "item:rtg-2026:m16:aula-04:i2:4",
                  "label": "Avisar a equipe pelo canal do serviço"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m16:aula-04:i2:1",
                "item:rtg-2026:m16:aula-04:i2:2",
                "item:rtg-2026:m16:aula-04:i2:3",
                "item:rtg-2026:m16:aula-04:i2:4",
                "item:rtg-2026:m16:aula-04:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as condutas adequadas quando a paciente diz 'minha menstruação atrasou'."
            },
            "help": "O que é seu nessa situação: decidir ou comunicar?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou pausa, registro e espera, e deixou de fora as decisões solitárias.",
              "incorrect": "Releia o conceito: o atraso pede pausa, registro fiel e decisão da equipe. Seguir, cancelar ou acrescentar proteção sozinho não cabe a você."
            },
            "payload": {
              "prompt": "Marque todas as condutas adequadas quando a paciente diz 'minha menstruação atrasou'.",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:a",
                  "label": "Seguir o exame, porque o atraso pode ser estresse.",
                  "explanation": "Seguir é decidir sozinho. Atraso pede pausa e aviso à equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:b",
                  "label": "Pausar antes de expor e avisar a equipe.",
                  "explanation": "Certo: a pausa dá à equipe a chance de avaliar antes da exposição."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:c",
                  "label": "Anotar a resposta com as palavras dela.",
                  "explanation": "Certo: o registro fiel é o que a equipe lê."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:d",
                  "label": "Cancelar o exame e dispensar a paciente.",
                  "explanation": "Cancelar também é decidir sozinho. Pausar não é cancelar."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:e",
                  "label": "Aguardar a decisão da equipe, sem trocar o exame.",
                  "explanation": "Certo: quem decide o que fazer é a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i3:f",
                  "label": "Acrescentar proteção por conta própria e seguir.",
                  "explanation": "Acrescentar proteção e seguir é decidir sozinho. A equipe define o que fazer."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m16:aula-04:i3:b",
                "option:rtg-2026:m16:aula-04:i3:c",
                "option:rtg-2026:m16:aula-04:i3:e"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "A paciente disse 'não sei'. O que isso pede?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: 'não sei' é registrado e levado à equipe antes da exposição.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Carla preenche a ficha e marca 'não sei' na pergunta sobre gestação. A radiografia pedida inclui o abdome. Ela diz que está com pressa e pede para não complicar. A Duda sugere seguir, já que ela não disse que está grávida.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-04:i4:a",
                  "label": "Seguir, pois ela não disse que está grávida, só que não sabe.",
                  "explanation": "Seguir ignora a dúvida que a própria paciente declarou. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i4:b",
                  "label": "Marcar 'não' na ficha para agilizar todo o atendimento.",
                  "explanation": "Alterar a resposta adultera o registro. Anote como foi dita."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i4:c",
                  "label": "Registrar o 'não sei', pausar e avisar a equipe.",
                  "explanation": "Isso: 'não sei' é registrado e levado à equipe antes da exposição."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i4:d",
                  "label": "Trocar o abdome por outra região, por conta própria e sem avisar.",
                  "explanation": "Trocar a região é mudar o exame pedido, e isso não cabe a você."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-04:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma paciente avisa, já posicionada, que acha que pode estar grávida. O que você faz?"
            },
            "help": "A posição já está pronta. Isso muda a regra?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: mesmo posicionada, a pausa vem antes da exposição.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma paciente avisa, já posicionada, que acha que pode estar grávida. O que você faz?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-04:i5:a",
                  "label": "Interrompe antes de expor e avisa a equipe.",
                  "explanation": "Isso: mesmo posicionada, a pausa vem antes da exposição."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i5:b",
                  "label": "Termina a imagem, porque já está posicionada.",
                  "explanation": "Estar posicionada não dispensa a pausa. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i5:c",
                  "label": "Encerra o atendimento sem avisar ninguém.",
                  "explanation": "Encerrar sem avisar deixa a equipe sem a informação. Avise."
                },
                {
                  "id": "option:rtg-2026:m16:aula-04:i5:d",
                  "label": "Diz que não há problema e segue, para tranquilizá-la.",
                  "explanation": "Garantir que não há problema é decidir sozinho. Pare e avise a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-04:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Perguntar, anotar, pausar",
            "body": "Agora você consegue aplicar a triagem: perguntar, anotar com as palavras da pessoa, pausar antes de expor e avisar a equipe, que decide o que fazer. Você não cancela, não troca o exame nem decide sozinho.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "A pausa não é desconfiança. É cuidado com quem pode estar grávida."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m16:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-contraste",
          "source:rtg-2026:m16:cdc-precaucoes-transmissao"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Isolamento e precauções",
            "body": "Hoje você vai conseguir escolher a barreira pela precaução indicada e organizar a sala em torno dela.",
            "dialogue": {
              "setting": "Corredor do setor de radiologia",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Chegou um paciente com placa de precaução na porta do leito. A equipe que cuida dele indicou o tipo."
                },
                {
                  "speaker": "duda",
                  "text": "Máscara comum para todo mundo, então? Ou avental?"
                },
                {
                  "speaker": "lia",
                  "text": "Quem define o tipo de precaução, e como você descobre?"
                },
                {
                  "speaker": "pixel",
                  "text": "Quem indica a precaução e o que muda de uma para outra?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "A barreira segue a precaução",
            "body": "A precaução padrão vale para todos: higiene das mãos e barreiras conforme o contato. Por cima dela, a equipe indica a precaução por transmissão. Pela referência do CDC, na de contato, avental e luvas se vestem ao entrar no quarto e se descartam antes de sair. Na de gotículas, você usa máscara, em geral vestida ao entrar; fora do quarto, o paciente usa máscara se tolerar. Na de aerossóis, respirador N95 ou superior antes de entrar, e o paciente fica em quarto de isolamento ou de porta fechada. Você não escolhe nem muda o tipo: confere a indicação, prepara a sala e pede apoio se faltar item.",
            "keyPoints": [
              "Contato: avental e luvas ao entrar, descartados antes de sair.",
              "Gotículas: máscara ao entrar. Aerossóis: respirador N95 ou superior antes de entrar.",
              "Quem indica o tipo é a equipe; você confere e pede apoio."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de preparo, um campo do protocolo estava vazio. O que você fazia?"
            },
            "help": "Campo vazio: preencher, ignorar ou descrever?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: descrever e pedir conferência, sem decidir sozinho.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de preparo, um campo do protocolo estava vazio. O que você fazia?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-05:i1:a",
                  "label": "Preencher com o que o costume indica.",
                  "explanation": "O costume não substitui o protocolo. Retome M09."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i1:b",
                  "label": "Descrever o que achou e pedir conferência.",
                  "explanation": "Isso: descrever e pedir conferência, sem decidir sozinho."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i1:c",
                  "label": "Seguir sem o campo, para não atrasar o turno.",
                  "explanation": "Seguir sem o campo ignora a lacuna. Descreva e peça conferência."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i1:d",
                  "label": "Suspender o exame por conta própria.",
                  "explanation": "Suspender é decidir sozinho. Retome o gesto de pedir conferência."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada medida no tipo de precaução em que ela aparece."
            },
            "help": "Toque, respingo ou ar: qual barreira combina?",
            "type": "categorize",
            "feedback": {
              "correct": "Você ligou cada barreira ao tipo de precaução em que ela aparece.",
              "incorrect": "Pense na via: o que toca, o que respinga e o que fica no ar. Cada via pede uma barreira diferente."
            },
            "payload": {
              "prompt": "Classifique cada medida no tipo de precaução em que ela aparece.",
              "categories": [
                {
                  "id": "group:rtg-2026:m16:aula-05:i2:a",
                  "label": "Contato"
                },
                {
                  "id": "group:rtg-2026:m16:aula-05:i2:b",
                  "label": "Gotículas"
                },
                {
                  "id": "group:rtg-2026:m16:aula-05:i2:c",
                  "label": "Aerossóis"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:3",
                  "label": "Máscara vestida ao entrar no quarto",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:b"
                },
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:1",
                  "label": "Avental e luvas ao entrar no quarto",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:a"
                },
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:5",
                  "label": "Respirador N95 ou superior antes de entrar",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:c"
                },
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:4",
                  "label": "Paciente de máscara fora do quarto, se tolerar",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:b"
                },
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:6",
                  "label": "Quarto de isolamento, de porta fechada",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:c"
                },
                {
                  "id": "item:rtg-2026:m16:aula-05:i2:2",
                  "label": "Luvas e avental descartados antes de sair",
                  "categoryId": "group:rtg-2026:m16:aula-05:i2:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "A barreira de contato vai e volta com quem?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: avental e luvas ao entrar, retirados antes de sair.",
              "incorrect": "Pense no contato: a barreira entra com você e sai antes de você deixar o quarto."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "Na precaução de contato, você veste avental e ",
                " ao entrar e os retira antes de ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m16:aula-05:i3:3",
                  "label": "óculos"
                },
                {
                  "id": "token:rtg-2026:m16:aula-05:i3:4",
                  "label": "entrar"
                },
                {
                  "id": "token:rtg-2026:m16:aula-05:i3:2",
                  "label": "sair"
                },
                {
                  "id": "token:rtg-2026:m16:aula-05:i3:5",
                  "label": "gorro"
                },
                {
                  "id": "token:rtg-2026:m16:aula-05:i3:1",
                  "label": "luvas"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m16:aula-05:i3:1",
                  "correctTokenId": "token:rtg-2026:m16:aula-05:i3:1"
                },
                {
                  "id": "blank:rtg-2026:m16:aula-05:i3:2",
                  "correctTokenId": "token:rtg-2026:m16:aula-05:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "A placa diz gotículas. Quais barreiras ela pede?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: a barreira segue a indicação; sem a máscara, você pede o item antes de entrar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Dona Marta vai fazer radiografia no leito. Na porta há placa de precaução por gotículas, mas só há luvas e avental à mão. A Duda diz que luvas bastam, para não perder tempo.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-05:i4:a",
                  "label": "Entrar só com luvas, porque o tempo é muito curto.",
                  "explanation": "Luvas sozinhas não cumprem gotículas. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i4:b",
                  "label": "Trocar a placa pelo tipo que parece mais adequado a você.",
                  "explanation": "Trocar a placa é decidir sozinho. A indicação é da equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i4:c",
                  "label": "Cancelar o exame sem avisar ninguém do setor.",
                  "explanation": "Cancelar sem avisar não resolve a falta. Peça os itens e comunique."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i4:d",
                  "label": "Conferir a indicação e pedir a máscara antes de entrar.",
                  "explanation": "Isso: a barreira segue a indicação; sem a máscara, você pede o item antes de entrar."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-05:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Um paciente com precaução por aerossóis precisa de radiografia no leito. Qual é o preparo antes de entrar?"
            },
            "help": "No ar, qual proteção vem antes de entrar?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: respirador antes de entrar e porta fechada.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Um paciente com precaução por aerossóis precisa de radiografia no leito. Qual é o preparo antes de entrar?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-05:i5:a",
                  "label": "Respirador N95 ou superior antes de entrar, porta fechada.",
                  "explanation": "Isso: respirador antes de entrar e porta fechada."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i5:b",
                  "label": "Máscara comum e porta aberta, para ventilar bem a sala.",
                  "explanation": "Máscara comum e porta aberta não servem aos aerossóis. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i5:c",
                  "label": "Avental e luvas somente, como na precaução de contato.",
                  "explanation": "Avental e luvas são a barreira do contato, não dos aerossóis. Confira de novo."
                },
                {
                  "id": "option:rtg-2026:m16:aula-05:i5:d",
                  "label": "Nenhum preparo, porque o exame é bem rápido e simples.",
                  "explanation": "A rapidez não dispensa barreira. Retome o conceito."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-05:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Barreira certa, sala pronta",
            "body": "Agora você consegue conferir a precaução indicada, escolher a barreira que ela pede e organizar a sala. Você não escolhe nem muda o tipo, e pede apoio quando falta um item.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Placa na porta é recado da equipe. Eu só preciso obedecer direito."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m16:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m16:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m16-v1",
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-torax",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Quando a imagem não sai como o padrão",
            "body": "Hoje você vai conseguir agir pelo protocolo quando a imagem sai fora do padrão, chamando a equipe.",
            "dialogue": {
              "setting": "Sala de radiografia",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Essa imagem saiu diferente do padrão. A pessoa está com gesso no punho."
                },
                {
                  "speaker": "duda",
                  "text": "Eu aumento o disparo até ficar igual ao do livro?"
                },
                {
                  "speaker": "lia",
                  "text": "Quem define o ajuste, Duda: o livro, o seu palpite ou o protocolo?"
                },
                {
                  "speaker": "pixel",
                  "text": "Antes de mexer no equipamento: o que a imagem diferente está te dizendo?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Imagem fora do padrão",
            "body": "Nem toda imagem sai como o padrão de estudo. A região pode estar engessada, a pessoa pode não conseguir a posição ideal, e cada corpo é diferente. Você não improvisa a técnica: consulte o protocolo do serviço, use só os ajustes que ele permite e descreva à equipe o que observou. Gesso e tala não se retiram por conta própria. Repetir a imagem por palpite é nova exposição, então não se faz sem combinar. Se o protocolo não resolver, pare e chame a equipe. O aspecto diferente da imagem não é diagnóstico, e quem interpreta é o radiologista.",
            "keyPoints": [
              "Imagem fora do padrão: protocolo primeiro, sem retirar gesso ou tala.",
              "Sem improvisar técnica nem repetir por palpite.",
              "Imagem fora do padrão que persiste: descrever e chamar a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de tórax, você notou um problema técnico na imagem, como pouca inspiração. O que fazia?"
            },
            "help": "Achar o problema técnico é o mesmo que interpretar?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: você descreve o problema técnico e leva à supervisão, sem interpretar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de tórax, você notou um problema técnico na imagem, como pouca inspiração. O que fazia?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-06:i1:a",
                  "label": "Dizer à pessoa o que a imagem mostra.",
                  "explanation": "Dizer o que a imagem mostra é interpretar. Retome M08: você descreve e leva à supervisão."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i1:b",
                  "label": "Repetir a imagem na hora, sem avisar.",
                  "explanation": "Repetir sem avisar é nova exposição sem combinar. Retome o que M08 pedia."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i1:c",
                  "label": "Descrever o que viu e levar à supervisão.",
                  "explanation": "Isso: você descreve o problema técnico e leva à supervisão, sem interpretar."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i1:d",
                  "label": "Deixar como está, porque o laudo resolve.",
                  "explanation": "Deixar como está esconde o problema técnico. Retome: descrever e levar à supervisão."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-06:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Associe cada situação à conduta que o protocolo pede."
            },
            "help": "Quem resolve cada situação: você, o protocolo ou a equipe?",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada situação à conduta: protocolo, combinação, equipe e interpretação por quem cabe.",
              "incorrect": "Confira de novo: o protocolo vem primeiro; repetição se combina; persistência vai à equipe; interpretar é do radiologista."
            },
            "payload": {
              "prompt": "Associe cada situação à conduta que o protocolo pede.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m16:aula-06:i2:1",
                  "left": "Imagem do punho engessado sai com pouco detalhe",
                  "right": "Consultar o protocolo e descrever o que viu à equipe"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-06:i2:2",
                  "left": "Vontade de repetir a imagem por palpite",
                  "right": "Combinar com a equipe antes de nova exposição"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-06:i2:3",
                  "left": "O protocolo não resolve a imagem",
                  "right": "Parar e chamar a equipe"
                },
                {
                  "id": "pair:rtg-2026:m16:aula-06:i2:4",
                  "left": "A pessoa pergunta o que a imagem mostra",
                  "right": "Explicar que o radiologista interpreta as imagens"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a imagem fora do padrão."
            },
            "help": "Quem define a técnica e quem interpreta a imagem?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o ajuste pelo protocolo da interpretação e da improvisação.",
              "incorrect": "Releia o conceito: a técnica segue o protocolo, repetir se combina e interpretar não é seu papel."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a imagem fora do padrão.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m16:aula-06:i3:1",
                  "text": "Aumentar o disparo por conta própria até ficar igual ao livro é aceitável.",
                  "isTrue": false,
                  "explanation": "Errado: a técnica segue o protocolo, e repetir ou aumentar é nova exposição que se combina."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-06:i3:2",
                  "text": "Retirar o gesso para a imagem ficar no padrão é decisão da equipe.",
                  "isTrue": true,
                  "explanation": "Certo: gesso e tala não se retiram por conta própria; o ajuste segue o protocolo e a equipe."
                },
                {
                  "id": "statement:rtg-2026:m16:aula-06:i3:3",
                  "text": "Dar nome ao que a imagem mostra de diferente faz parte do seu papel.",
                  "isTrue": false,
                  "explanation": "Errado: interpretar a imagem é do radiologista. Você descreve o que observou."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a conduta mais segura?"
            },
            "help": "O que você deixa para a equipe decidir?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: nada de retirar, repetir ou interpretar sozinho.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge tem o antebraço engessado e dor. A primeira imagem do antebraço saiu com pouco detalhe. A Duda propõe tirar o gesso e repetir, e Seu Jorge pede para ver a imagem e saber se 'quebrou'.",
              "prompt": "Qual é a conduta mais segura?",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-06:i4:a",
                  "label": "Cortar o gesso e repetir a imagem, para ficar no padrão.",
                  "explanation": "Cortar o gesso não cabe a você: quem decide é a equipe. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i4:b",
                  "label": "Mostrar a imagem a ele e dizer o que parece ser, com calma.",
                  "explanation": "Dizer o que parece ser é interpretar. Isso cabe ao radiologista."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i4:c",
                  "label": "Repetir a imagem com mais disparo, sem avisar ninguém.",
                  "explanation": "Repetir com mais disparo, sem avisar, é nova exposição por palpite. Chame a equipe."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i4:d",
                  "label": "Não tirar o gesso nem repetir sozinho: descrever e chamar a equipe.",
                  "explanation": "Isso: nada de retirar, repetir ou interpretar sozinho."
                }
              ],
              "correctOptionId": "option:rtg-2026:m16:aula-06:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m16:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m16:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as ações adequadas quando a imagem sai fora do padrão."
            },
            "help": "O que você faz sem decidir sozinho?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou protocolo, descrição e equipe, e deixou de fora palpite, interpretação e descarte.",
              "incorrect": "Releia o conceito: protocolo primeiro, descrição à equipe e chamada se persistir. Palpite, interpretação e descarte não cabem a você."
            },
            "payload": {
              "prompt": "Marque todas as ações adequadas quando a imagem sai fora do padrão.",
              "options": [
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:a",
                  "label": "Repetir a imagem com outro disparo, por palpite.",
                  "explanation": "Repetir por palpite é nova exposição sem combinação. Consulte o protocolo."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:b",
                  "label": "Consultar o protocolo do serviço.",
                  "explanation": "Certo: o ajuste previsto está no protocolo."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:c",
                  "label": "Descrever à equipe o que observou.",
                  "explanation": "Certo: sua descrição ajuda a equipe a decidir."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:d",
                  "label": "Dizer à pessoa o que o aspecto da imagem significa.",
                  "explanation": "Interpretar não é seu papel. Quem interpreta é o radiologista."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:e",
                  "label": "Chamar a equipe se o protocolo não resolver.",
                  "explanation": "Certo: persistindo, a equipe decide o que fazer."
                },
                {
                  "id": "option:rtg-2026:m16:aula-06:i5:f",
                  "label": "Descartar a imagem sem registrar.",
                  "explanation": "Descartar sem registrar apaga o rastro. Descreva à equipe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m16:aula-06:i5:b",
                "option:rtg-2026:m16:aula-06:i5:c",
                "option:rtg-2026:m16:aula-06:i5:e"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m16:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Protocolo e equipe",
            "body": "Agora você consegue agir quando a imagem sai fora do padrão: consultar o protocolo, descrever à equipe e chamá-la quando o ajuste não resolve. Você não retira gesso, não improvisa a técnica nem interpreta a imagem.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Imagem diferente é pergunta para o protocolo, não palpite."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m16",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-01"
        ],
        "prompt": "Uma solicitação traz a queixa 'dor no ombro depois de queda'. O que você faz com essa informação?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-01:c1:a",
            "label": "Diz à paciente qual é a causa provável da dor dela."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c1:b",
            "label": "Usa para cuidar da sala, sem nomear a causa."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c1:c",
            "label": "Troca o exame pelo que acha mais indicado."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c1:d",
            "label": "Ignora a queixa e confere só o nome do exame."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-01:c1:b",
        "feedback": {
          "correct": "Isso: a queixa orienta o cuidado, não a conclusão.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-01"
        ],
        "prompt": "Logo depois da imagem, a paciente pergunta qual é o resultado. Qual resposta é adequada?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-01:c2:a",
            "label": "Comentar o que parece estar na imagem, para tranquilizá-la."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c2:b",
            "label": "Dizer o diagnóstico mais provável, com bastante cautela."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c2:c",
            "label": "Pedir que ela volte outro dia, sem explicar."
          },
          {
            "id": "option:rtg-2026:m16:aula-01:c2:d",
            "label": "Explicar que o radiologista interpreta e o médico dela conversa."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-01:c2:d",
        "feedback": {
          "correct": "Isso: você informa quem interpreta e quem conversa com ela.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-02"
        ],
        "prompt": "Uma pessoa com dor forte no ombro não consegue levantar o braço. O que orienta sua conduta?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-02:c1:a",
            "label": "Não forçar o movimento, adaptar o equipamento e avisar a equipe."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c1:b",
            "label": "Pedir que levante o braço até onde aguentar, para ganhar tempo."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c1:c",
            "label": "Levantar o braço dela por baixo, só desta vez."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c1:d",
            "label": "Esperar a dor passar e repetir o pedido de movimento."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-02:c1:a",
        "feedback": {
          "correct": "Isso: você preserva o membro e comunica.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-02"
        ],
        "prompt": "Qual atitude é a mais segura antes de tocar numa pessoa com dor?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-02:c2:a",
            "label": "Tocar primeiro para localizar a dor com as mãos."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c2:b",
            "label": "Pedir silêncio para se concentrar no posicionamento."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c2:c",
            "label": "Explicar o que vai fazer e avisar quando for tocar."
          },
          {
            "id": "option:rtg-2026:m16:aula-02:c2:d",
            "label": "Começar pela parte do corpo que dói menos, sem avisar."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-02:c2:c",
        "feedback": {
          "correct": "Isso: explicar e avisar antes de tocar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-03"
        ],
        "prompt": "Uma pessoa que não tolera ficar deitada chega para a radiografia. Qual é o primeiro gesto?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-03:c1:a",
            "label": "Deitar a pessoa bem devagar, para ela se acostumar com isso."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c1:b",
            "label": "Escolher a posição que mais se parece com a do livro de estudo."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c1:c",
            "label": "Perguntar em que posição ela respira melhor e ver o protocolo."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c1:d",
            "label": "Esperar a pessoa melhorar antes de falar com a equipe do setor."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-03:c1:c",
        "feedback": {
          "correct": "Isso: ouvir a pessoa e conferir o protocolo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-torax",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-03"
        ],
        "prompt": "Durante o posicionamento, a pessoa diz que o ar piorou. O que faz mais sentido?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-03:c2:a",
            "label": "Parar, ficar com ela e acionar a equipe."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c2:b",
            "label": "Terminar a imagem em poucos segundos e depois avisar."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c2:c",
            "label": "Pedir que respire fundo e continuar o posicionamento."
          },
          {
            "id": "option:rtg-2026:m16:aula-03:c2:d",
            "label": "Anotar para contar depois, no fim do turno."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-03:c2:a",
        "feedback": {
          "correct": "Isso: pausa, presença e equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-torax",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-04"
        ],
        "prompt": "Quem decide o que fazer quando a paciente informa possível gestação?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-04:c1:a",
            "label": "O tecnólogo que está na sala, decidindo sozinho."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c1:b",
            "label": "A própria paciente, ao assinar a ficha do serviço."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c1:c",
            "label": "O colega que a atendeu antes dessa vez."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c1:d",
            "label": "A equipe responsável pelo exame e pela justificativa dele."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: a decisão é da equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:hps-gestante-radiologia",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-04"
        ],
        "prompt": "Por que a pausa vem antes de qualquer exposição?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-04:c2:a",
            "label": "Porque a pausa faz parte do preparo da sala de exame."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c2:b",
            "label": "Porque a equipe precisa avaliar antes de usar a radiação."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c2:c",
            "label": "Porque a paciente precisa se acalmar antes da imagem."
          },
          {
            "id": "option:rtg-2026:m16:aula-04:c2:d",
            "label": "Porque o tecnólogo deve calcular o risco para o feto."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: avaliar antes de expor.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:hps-gestante-radiologia",
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-05"
        ],
        "prompt": "Quem indica o tipo de precaução de um paciente?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-05:c1:a",
            "label": "O tecnólogo, conforme a aparência do paciente."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c1:b",
            "label": "A equipe que cuida dele; você confere a indicação."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c1:c",
            "label": "O próprio paciente, ao escolher a sala."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c1:d",
            "label": "O serviço de limpeza, ao preparar o quarto."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-05:c1:b",
        "feedback": {
          "correct": "Isso: a equipe indica e você confere.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:cdc-precaucoes-transmissao"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-05"
        ],
        "prompt": "Na precaução por gotículas, qual item o paciente usa fora do quarto, se tolerar?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-05:c2:a",
            "label": "Avental e luvas."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c2:b",
            "label": "Respirador N95."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c2:c",
            "label": "Máscara."
          },
          {
            "id": "option:rtg-2026:m16:aula-05:c2:d",
            "label": "Protetor de tireoide."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-05:c2:c",
        "feedback": {
          "correct": "Isso: máscara, se tolerar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:cdc-precaucoes-transmissao"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-06"
        ],
        "prompt": "Uma imagem sai fora do padrão e o protocolo já foi consultado, sem resolver. O que você faz?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-06:c1:a",
            "label": "Para e chama a equipe."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c1:b",
            "label": "Repete com outros valores até acertar."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c1:c",
            "label": "Envia a imagem assim, sem comentar."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c1:d",
            "label": "Pede à pessoa para ir embora."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-06:c1:a",
        "feedback": {
          "correct": "Isso: o protocolo não resolveu, então a equipe decide.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m16:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m16:aula-06"
        ],
        "prompt": "Quem interpreta o que a imagem mostra de diferente do padrão?",
        "options": [
          {
            "id": "option:rtg-2026:m16:aula-06:c2:a",
            "label": "O tecnólogo que fez a imagem."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c2:b",
            "label": "A pessoa atendida."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c2:c",
            "label": "O colega que viu a imagem primeiro."
          },
          {
            "id": "option:rtg-2026:m16:aula-06:c2:d",
            "label": "O radiologista."
          }
        ],
        "correctOptionId": "option:rtg-2026:m16:aula-06:c2:d",
        "feedback": {
          "correct": "Isso: o radiologista interpreta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m16:radiologyinfo-osso"
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
      "claimId": "interaction:rtg-2026:m16:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "group:rtg-2026:m16:aula-01:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "group:rtg-2026:m16:aula-01:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-01:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i2:f",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m16:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m16:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "token:rtg-2026:m16:aula-02:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "token:rtg-2026:m16:aula-02:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-02:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-02:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-02:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-03:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiopaedia-torax-ap",
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i3:f",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:hps-gestante-radiologia",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "group:rtg-2026:m16:aula-05:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "group:rtg-2026:m16:aula-05:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "group:rtg-2026:m16:aula-05:i2:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "item:rtg-2026:m16:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m16:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m16:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "token:rtg-2026:m16:aula-05:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-05:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-05:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "token:rtg-2026:m16:aula-05:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m16:aula-05:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-contraste",
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:cdc-precaucoes-transmissao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m16:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-06:i3:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m16:aula-06:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:i5:f",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m16:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "step:rtg-2026:m16:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-torax",
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m16:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m16:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m16:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m16:radiologyinfo-osso"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m16:aula-01",
        "hook": "Complete a frase: o pedido informa a queixa, e quem interpreta as imagens é o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-01"
          ],
          "prompt": "Quem interpreta as imagens e envia o relatório ao médico da pessoa?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-01:rg:a",
              "label": "O tecnólogo, no momento da exposição."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rg:b",
              "label": "O radiologista."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rg:c",
              "label": "A própria pessoa, ao ver a tela."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rg:d",
              "label": "O colega que posicionou antes."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-01:rg:b",
          "feedback": {
            "correct": "Isso: o radiologista interpreta e o relatório segue para o médico.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-01"
          ],
          "prompt": "Num pedido de tomografia, a queixa é 'dor abdominal há dois dias'. A paciente pede que você diga o que ela tem. O que responde?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-01:rt:a",
              "label": "Diz que provavelmente é algo simples."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rt:b",
              "label": "Acolhe e diz que o médico dela fala do resultado."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rt:c",
              "label": "Sugere que o exame seja trocado por outro."
            },
            {
              "id": "option:rtg-2026:m16:aula-01:rt:d",
              "label": "Diz que não pode falar nada e vira de costas."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-01:rt:b",
          "feedback": {
            "correct": "Isso: acolhimento e encaminhamento da conversa a quem cabe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m16:aula-02",
        "hook": "Complete a frase: com dor forte, eu adapto o equipamento e não o...",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-02"
          ],
          "prompt": "O que se adapta primeiro quando um membro dói?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-02:rg:a",
              "label": "O membro, até ele caber na posição padrão."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rg:b",
              "label": "A dor, pedindo que a pessoa a ignore."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rg:c",
              "label": "O tubo, o detector e a maca, sem mexer no membro."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rg:d",
              "label": "O protocolo, descartando a posição do serviço."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-02:rg:c",
          "feedback": {
            "correct": "Isso: o equipamento se move, o membro fica.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-02"
          ],
          "prompt": "Uma pessoa idosa com dor nas costas não consegue sentar para a radiografia. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-02:rt:a",
              "label": "Mantém a pessoa como está, não a levanta e chama a equipe."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rt:b",
              "label": "Ajuda a sentar, apoiando as costas com travesseiros."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rt:c",
              "label": "Pede que gire o tronco só um pouco para a imagem."
            },
            {
              "id": "option:rtg-2026:m16:aula-02:rt:d",
              "label": "Segue com a pessoa na cadeira, para ganhar tempo."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-02:rt:a",
          "feedback": {
            "correct": "Isso: sem mover contra a dor, e com a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m16:aula-03",
        "hook": "Complete a frase: a posição padrão não é possível, então combino a que o protocolo...",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-03"
          ],
          "prompt": "A pessoa não tolera ficar deitada. Qual conduta combina com o protocolo?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-03:rg:a",
              "label": "Deitar mesmo assim, por segurança do exame."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rg:b",
              "label": "Cancelar o exame e mandar a pessoa para casa, sem conversa."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rg:c",
              "label": "Inventar uma posição nova, sem consultar ninguém."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rg:d",
              "label": "Usar a alternativa que o protocolo prevê e registrá-la."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-03:rg:d",
          "feedback": {
            "correct": "Isso: alternativa prevista, com registro.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-torax",
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-03"
          ],
          "prompt": "Na enfermaria, uma pessoa com falta de ar está sentada na cama para a radiografia no leito e pede para deitar. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-03:rt:a",
              "label": "Combina com a equipe antes de mudar a posição."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rt:b",
              "label": "Deita a pessoa e segue, porque ela pediu."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rt:c",
              "label": "Mantém a pessoa sentada, sem explicar nada."
            },
            {
              "id": "option:rtg-2026:m16:aula-03:rt:d",
              "label": "Espera que ela se acalme e mantém tudo como está."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-03:rt:a",
          "feedback": {
            "correct": "Isso: mudança de posição se combina com a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-torax",
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m16:aula-04",
        "hook": "Complete a frase: se há possível gestação, eu pauso, aviso a equipe e não decido...",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-04"
          ],
          "prompt": "A paciente diz que pode estar grávida. Qual é o primeiro passo seguro?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-04:rg:a",
              "label": "Fazer o exame mais rápido, com menos imagens."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rg:b",
              "label": "Escolher outro exame que não use radiação."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rg:c",
              "label": "Perguntar à acompanhante se pode seguir."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rg:d",
              "label": "Pausar antes de expor e avisar a equipe."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-04:rg:d",
          "feedback": {
            "correct": "Isso: pausa antes de expor e aviso à equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:hps-gestante-radiologia",
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-04"
          ],
          "prompt": "Numa rotina, a ficha de uma paciente está sem resposta sobre gestação. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-04:rt:a",
              "label": "Preenche 'não' pelo padrão do serviço, para constar."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rt:b",
              "label": "Pergunta, anota a resposta e avisa a equipe na dúvida."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rt:c",
              "label": "Segue sem perguntar, porque ninguém avisou nada."
            },
            {
              "id": "option:rtg-2026:m16:aula-04:rt:d",
              "label": "Devolve a ficha sem dizer nada à paciente na recepção."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-04:rt:b",
          "feedback": {
            "correct": "Isso: pergunta, anota e avisa se houver dúvida.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:hps-gestante-radiologia",
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m16:aula-05",
        "hook": "Complete a frase: eu confiro a indicação e não escolho o tipo de...",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-05"
          ],
          "prompt": "Você vê uma placa de precaução na porta. O que faz primeiro?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-05:rg:a",
              "label": "Entra rápido e coloca os itens depois."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rg:b",
              "label": "Escolhe a barreira pelo que parece mais seguro."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rg:c",
              "label": "Confere o tipo indicado e pega os itens que ele pede."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rg:d",
              "label": "Pede ao paciente que explique a precaução."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-05:rg:c",
          "feedback": {
            "correct": "Isso: confere o tipo e pega os itens.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:cdc-precaucoes-transmissao"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-05"
          ],
          "prompt": "Falta o respirador N95 no setor e o paciente está em precaução por aerossóis. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-05:rt:a",
              "label": "Entra com máscara comum, só desta vez."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rt:b",
              "label": "Entra sem barreira, por ser rápido."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rt:c",
              "label": "Não entra e pede o item à equipe."
            },
            {
              "id": "option:rtg-2026:m16:aula-05:rt:d",
              "label": "Faz a imagem de fora, com a porta aberta."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-05:rt:c",
          "feedback": {
            "correct": "Isso: sem o item, você não entra e comunica.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:cdc-precaucoes-transmissao"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m16:aula-06",
        "hook": "Complete a frase: imagem fora do padrão, eu consulto o... e descrevo à equipe.",
        "guided": {
          "id": "recovery-item:rtg-2026:m16:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-06"
          ],
          "prompt": "Uma imagem sai diferente do padrão. O que vem antes de qualquer ajuste?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-06:rg:a",
              "label": "Repetir a imagem com mais disparo."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rg:b",
              "label": "Consultar o protocolo do serviço."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rg:c",
              "label": "Pedir opinião à pessoa atendida."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rg:d",
              "label": "Apagar a imagem e fazer outra."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-06:rg:b",
          "feedback": {
            "correct": "Isso: o protocolo vem antes do ajuste.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m16:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m16:aula-06"
          ],
          "prompt": "No leito, a pessoa não conseguiu a posição ideal e a imagem saiu fora do padrão. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m16:aula-06:rt:a",
              "label": "Aumenta o disparo e repete, sem avisar."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rt:b",
              "label": "Segue o protocolo e combina com a equipe."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rt:c",
              "label": "Cancela o exame por conta própria."
            },
            {
              "id": "option:rtg-2026:m16:aula-06:rt:d",
              "label": "Reposiciona a pessoa à força, se preciso."
            }
          ],
          "correctOptionId": "option:rtg-2026:m16:aula-06:rt:b",
          "feedback": {
            "correct": "Isso: protocolo e equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m16:radiologyinfo-osso"
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
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "f592c072637d20c3a8b304cca246e7cd7a672505a103f9033a866e27c8ca264d"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
