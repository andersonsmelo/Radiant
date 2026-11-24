// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M27: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m27",
  "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b",
  "trackId": "track:rtg-2026:m27",
  "unitId": "unit:rtg-2026:m27",
  "contentVersion": "rtg-2026-m27-v1",
  "competencyIds": [
    "competency:rtg-2026:m27:aula-01",
    "competency:rtg-2026:m27:aula-02",
    "competency:rtg-2026:m27:aula-03",
    "competency:rtg-2026:m27:aula-04",
    "competency:rtg-2026:m27:aula-05",
    "competency:rtg-2026:m27:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m27:r101-ped",
      "title": "Pediatric Radiography: Techniques, Positioning, and Dose Reduction",
      "publisher": "Radiography 101",
      "url": "https://radiography101.org/articles/pediatric-radiography-techniques",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página de ensino de radiografia, aberta; consultada para fatos sobre comunicação por idade, imobilização e proteção de quem segura, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:r101-shield",
      "title": "Patient Contact Shielding in X-Ray Imaging: Current Guidance",
      "publisher": "Radiography 101",
      "url": "https://radiography101.org/articles/patient-shielding-radiography-obsolete",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página de ensino, aberta; consultada para fatos sobre colimação, gestação, repetição e política do serviço, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:r101-hip",
      "title": "Hip X-Ray Positioning: AP, Frog-Leg Lateral, Cross-Table, and Dunn Methods",
      "publisher": "Radiography 101",
      "url": "https://radiography101.org/articles/hip-xray-positioning",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página de ensino, aberta; consultada para o cuidado com a pele frágil e com o movimento do paciente idoso, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:who-falls",
      "title": "Falls (fact sheet)",
      "publisher": "World Health Organization",
      "url": "https://www.who.int/news-room/fact-sheets/detail/falls",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional da OMS; consultada para fatos sobre fatores de risco de queda, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:who-ageing",
      "title": "Ageing and health (fact sheet)",
      "publisher": "World Health Organization",
      "url": "https://www.who.int/news-room/fact-sheets/detail/ageing-and-health",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional da OMS; consultada para fatos sobre perda auditiva, visão e quedas na idade avançada, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:pmc-hearing",
      "title": "Patient–healthcare provider communication and age-related hearing loss: a qualitative study of patients' perspectives",
      "publisher": "Irish Journal of Medical Science (2023), PMC",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10808372/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos sobre comunicação com idosos que ouvem menos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m27:pmc-geri-chest",
      "title": "Geriatric Chest Imaging: When and How to Image the Elderly Lung, Age-Related Changes, and Common Pathologies",
      "publisher": "Radiology Research and Practice (2013), PMC",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3713368/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos sobre tempo, assistência e apoio no posicionamento do idoso, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m27:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Falar com a criança e com quem a acompanha",
            "body": "Hoje você vai conseguir ajustar a explicação à idade da criança e combinar com a equipe o papel de quem a acompanha.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Seu Jorge",
                  "text": "Meu filho Teo tem quatro anos e já chegou chorando. Ele não entende por que tem que deitar sozinho."
                },
                {
                  "speaker": "caio",
                  "text": "Com criança, o exame começa na conversa. A máquina vem depois."
                },
                {
                  "speaker": "duda",
                  "text": "Mas o que eu digo a um menino de quatro anos? E o pai dele, fica onde?"
                },
                {
                  "speaker": "pixel",
                  "text": "Duas perguntas: como falar em cada idade e quem fica na sala com a criança."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada idade, uma conversa",
            "body": "A fala muda com a idade. Com um bebê, você conversa sobretudo com o responsável e explica cada passo. A criança pequena entende frase simples e concreta; evite perguntas de sim ou não, que convidam à recusa. No pré-escolar, brincar de exame ajuda, sempre com explicação verdadeira. O adolescente ouve a explicação direto e diz se quer o responsável por perto. Quem fica na sala durante a exposição, o serviço e a equipe definem: essa pessoa usa a proteção e fica fora do feixe.",
            "keyPoints": [
              "A idade define a fala: bebê com o responsável, adolescente direto.",
              "Criança pequena: frase simples, sem pergunta de sim ou não.",
              "Quem fica na sala: a equipe combina, com proteção e fora do feixe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula sobre dor, o que você fazia antes de tocar na pessoa?"
            },
            "help": "Pense no que acalma uma pessoa que sente dor ao ser tocada.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: explicar cada passo e avisar antes de tocar vale para dor e vale também para a criança.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula sobre dor, o que você fazia antes de tocar na pessoa?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-01:i1:a",
                  "label": "Tocar logo, para ganhar tempo",
                  "explanation": "Tocar sem avisar surpreende a pessoa e pode piorar a dor: a aula de dor pedia o aviso antes."
                },
                {
                  "id": "option:rtg-2026:m27:aula-01:i1:b",
                  "label": "Explicar cada passo e avisar que vai tocar",
                  "explanation": "Isso: explicar cada passo e avisar antes de tocar vale para dor e vale também para a criança."
                },
                {
                  "id": "option:rtg-2026:m27:aula-01:i1:c",
                  "label": "Esperar a pessoa perguntar o que vem",
                  "explanation": "Esperar a pergunta deixa a pessoa no escuro; quem conduz explica antes."
                },
                {
                  "id": "option:rtg-2026:m27:aula-01:i1:d",
                  "label": "Explicar só depois de posicionar",
                  "explanation": "Explicar depois deixa o susto para o meio do posicionamento; a explicação vem antes."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada idade à fala que a aula ensinou."
            },
            "help": "Pergunte quem entende a explicação em cada idade.",
            "type": "matching",
            "feedback": {
              "correct": "Cada idade pede um jeito de falar: do bebê, que depende do responsável, ao adolescente, que ouve direto.",
              "incorrect": "Releia o conceito: o bebê não conversa, o adolescente ouve direto, e a criança pequena precisa de frase simples."
            },
            "payload": {
              "prompt": "Ligue cada idade à fala que a aula ensinou.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m27:aula-01:i2:1",
                  "left": "Bebê",
                  "right": "Conversar sobretudo com o responsável, explicando cada passo"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-01:i2:2",
                  "left": "Criança pequena",
                  "right": "Frase simples e concreta, sem pergunta de sim ou não"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-01:i2:3",
                  "left": "Pré-escolar",
                  "right": "Brincar de exame, com explicação verdadeira"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-01:i2:4",
                  "left": "Adolescente",
                  "right": "Explicar direto a ele e perguntar se quer o responsável perto"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Antes do disparo, uma das pessoas da cena precisa que você avise a equipe. Toque nela."
            },
            "help": "Compare o que cada pessoa da cena veste e onde ela está.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: quem fica na sala durante a exposição usa a proteção que o serviço define e fica fora do feixe; sem proteção, você avisa a equipe antes do disparo.",
              "incorrect": "Essa região não pede aviso. Compare o que cada pessoa veste e quem fica ao alcance do espalhamento sem proteção."
            },
            "payload": {
              "prompt": "Antes do disparo, uma das pessoas da cena precisa que você avise a equipe. Toque nela.",
              "imageRef": "diagram:contencao-pediatrica",
              "regions": [
                {
                  "id": "region:rtg-2026:m27:aula-01:i3:1",
                  "label": "Acompanhante à cabeceira",
                  "x": 0.05,
                  "y": 0.283,
                  "width": 0.113,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m27:aula-01:i3:2",
                  "label": "Faixa sobre as pernas",
                  "x": 0.481,
                  "y": 0.533,
                  "width": 0.1,
                  "height": 0.117
                },
                {
                  "id": "region:rtg-2026:m27:aula-01:i3:3",
                  "label": "Pessoa junto aos pés da mesa",
                  "x": 0.856,
                  "y": 0.208,
                  "width": 0.1,
                  "height": 0.342
                },
                {
                  "id": "region:rtg-2026:m27:aula-01:i3:4",
                  "label": "Campo de luz",
                  "x": 0.313,
                  "y": 0.258,
                  "width": 0.119,
                  "height": 0.208
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m27:aula-01:i3:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Seu Jorge é pai do Teo, de 4 anos, e está aflito. Ajude a combinar o papel dele, sem prometer o que cabe à equipe."
            },
            "help": "O que você promete e o que depende da equipe?",
            "type": "conversation",
            "feedback": {
              "correct": "Você combinou o papel do pai com a equipe e falou com o menino em frases simples.",
              "incorrect": "Releia o conceito: o papel de quem fica é combinado com a equipe, e a criança ouve frases simples e verdadeiras."
            },
            "payload": {
              "prompt": "Seu Jorge é pai do Teo, de 4 anos, e está aflito. Ajude a combinar o papel dele, sem prometer o que cabe à equipe.",
              "speaker": "paciente",
              "name": "Seu Jorge",
              "turns": [
                {
                  "id": "turn:rtg-2026:m27:aula-01:i4:1",
                  "line": "Moço, o Teo não quer deitar. Eu fico com ele ou saio? Eu faço o que for preciso.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:1a",
                      "label": "O senhor fica com ele, pai sempre pode ficar na sala com a criança.",
                      "reply": "Então fico aqui do lado dele o tempo todo."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:1b",
                      "label": "A equipe confirma se o senhor fica, e com que proteção.",
                      "reply": "Tá bem, eu espero a equipe me dizer."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:1c",
                      "label": "Melhor sair: criança fica mais calma sozinha com a gente, sem pai.",
                      "reply": "Mas ele vai ficar com muito medo sem mim."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-01:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m27:aula-01:i4:2",
                  "line": "O que eu falo pra ele? Ele pergunta toda hora se vai doer.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:2a",
                      "label": "Diga que ele não vai sentir nada, para ele se acalmar logo.",
                      "reply": "Então digo isso e pronto, né?"
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:2b",
                      "label": "Diga que precisa ficar quieto e pronto, sem explicar mais nada.",
                      "reply": "Mas ele vai chorar mais se eu só mandar."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:2c",
                      "label": "Conte o que vai acontecer, em frases simples e verdadeiras.",
                      "reply": "Entendi, vou falar do jeito simples com ele."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-01:i4:2c"
                },
                {
                  "id": "turn:rtg-2026:m27:aula-01:i4:3",
                  "line": "Posso segurar o braço dele quando a máquina ligar?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:3a",
                      "label": "Pode, segure firme com as duas mãos onde achar melhor.",
                      "reply": "Então seguro firme onde eu alcançar."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:3b",
                      "label": "Segure, mas sem avental, para ele não estranhar.",
                      "reply": "Tá, sem avental então, para ele não ter medo."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-01:i4:3c",
                      "label": "Se a equipe combinar, de avental e fora do campo.",
                      "reply": "Combinado, aguardo a equipe falar comigo."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-01:i4:3c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a conversa com crianças de idades diferentes."
            },
            "help": "Pense em quem entende a explicação e em quem ouve a pergunta.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o convite que atrapalha da explicação que acalma, em cada idade.",
              "incorrect": "Releia o conceito: frase simples e verdadeira para a criança, o responsável no centro com o bebê e a fala direta para o adolescente."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a conversa com crianças de idades diferentes.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m27:aula-01:i5:1",
                  "text": "Com uma criança pequena, perguntar se ela quer começar é um bom convite.",
                  "isTrue": false,
                  "explanation": "Pergunta de sim ou não convida à recusa: diga em frase simples o que vai acontecer."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-01:i5:2",
                  "text": "Com um adolescente, a explicação vai direto a ele, e não só ao responsável.",
                  "isTrue": true,
                  "explanation": "Certo: o adolescente é o paciente, e a explicação é dele; ele diz se quer o responsável por perto."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-01:i5:3",
                  "text": "Com um bebê, você conversa sobretudo com o responsável, passo a passo.",
                  "isTrue": true,
                  "explanation": "Certo: o bebê não entende a fala, então o responsável recebe a explicação de cada passo."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-01:i5:4",
                  "text": "Dizer a um pré-escolar que nada vai acontecer ajuda a acalmá-lo.",
                  "isTrue": false,
                  "explanation": "A explicação é verdadeira, mesmo na brincadeira: prometer o que não vai acontecer quebra a confiança."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Conversa antes da máquina",
            "body": "Você ajusta a fala à idade, inclui o responsável e confirma com a equipe quem fica na sala e com que proteção.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Uma boa conversa poupa tempo e repetições."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m27:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Segurar e imobilizar",
            "body": "Hoje você vai conseguir dizer a ordem de escolha para manter a criança parada e os limites que a imobilização não cruza.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "O Teo não para. Posso apertar a faixa bem forte, só para garantir?"
                },
                {
                  "speaker": "caio",
                  "text": "Imobilizar não é prender. A pergunta é: qual é a ajuda mais leve que resolve?"
                },
                {
                  "speaker": "lia",
                  "text": "E nessa escolha, Duda, qual é o seu papel?"
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos montar a escada das opções, da mais leve à mais restrita."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "A ajuda mais leve que resolve",
            "body": "Manter a criança parada evita repetir a imagem, e a ajuda é a menos restritiva que resolve: primeiro explicar e acalmar, depois um apoio ou faixa que o serviço aprova; segurar com a mão, só quando for necessário. Se alguém segura, vale o que você viu na aula de proteção: adulto voluntário, não grávido, nunca outro paciente, com proteção e o corpo todo fora do feixe. Nunca se prende sobre o local machucado, nem se atrapalha respiração ou circulação, nem se deixa a criança sozinha no apoio. A equipe escolhe o recurso, pelo protocolo do serviço.",
            "keyPoints": [
              "Da mais leve à mais restrita: conversa, apoio ou faixa, mão.",
              "Quem segura, como na aula de proteção: adulto voluntário, não grávido, protegido, fora do feixe.",
              "Imobilizar nunca é força: sem pressão sobre o machucado, sem atrapalhar a respiração, sem deixar sozinha."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, com uma criança pequena, qual fala combina com a idade?"
            },
            "help": "Lembre como a criança pequena entende a explicação.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: frase simples e concreta, com a verdade sobre o que vem.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, com uma criança pequena, qual fala combina com a idade?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-02:i1:a",
                  "label": "Uma pergunta de sim ou não para ela escolher",
                  "explanation": "A pergunta de sim ou não convida à recusa; a criança pequena precisa de frase simples."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i1:b",
                  "label": "Uma explicação longa dirigida só ao responsável",
                  "explanation": "O responsável participa, mas a criança pequena também ouve frases dirigidas a ela."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i1:c",
                  "label": "Uma frase simples que diga o que vai acontecer",
                  "explanation": "Isso: frase simples e concreta, com a verdade sobre o que vem."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i1:d",
                  "label": "Um silêncio até ela se acalmar sozinha",
                  "explanation": "O silêncio não explica nada e pode aumentar o medo."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-02:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque nos dois recursos da cena que ajudam a manter a criança parada sem que uma pessoa precise segurar."
            },
            "help": "Pense no que ficaria no lugar mesmo se ninguém encostasse na criança.",
            "type": "hotspot",
            "feedback": {
              "correct": "A faixa e o apoio mantêm a posição sem mão no feixe: é o tipo de ajuda mais leve, que a equipe aprova e escolhe.",
              "incorrect": "Procure o que prende ou apoia o corpo, e não as pessoas ou a luz: dois recursos da cena fazem isso sem mão de ninguém."
            },
            "payload": {
              "prompt": "Toque nos dois recursos da cena que ajudam a manter a criança parada sem que uma pessoa precise segurar.",
              "imageRef": "diagram:contencao-pediatrica",
              "regions": [
                {
                  "id": "region:rtg-2026:m27:aula-02:i2:1",
                  "label": "Mão do acompanhante",
                  "x": 0.15,
                  "y": 0.5,
                  "width": 0.09,
                  "height": 0.13
                },
                {
                  "id": "region:rtg-2026:m27:aula-02:i2:2",
                  "label": "Faixa sobre as pernas",
                  "x": 0.481,
                  "y": 0.533,
                  "width": 0.1,
                  "height": 0.117
                },
                {
                  "id": "region:rtg-2026:m27:aula-02:i2:3",
                  "label": "Campo de luz",
                  "x": 0.313,
                  "y": 0.258,
                  "width": 0.119,
                  "height": 0.208
                },
                {
                  "id": "region:rtg-2026:m27:aula-02:i2:4",
                  "label": "Apoio de espuma",
                  "x": 0.695,
                  "y": 0.5,
                  "width": 0.09,
                  "height": 0.14
                },
                {
                  "id": "region:rtg-2026:m27:aula-02:i2:5",
                  "label": "Pessoa junto aos pés da mesa",
                  "x": 0.856,
                  "y": 0.208,
                  "width": 0.1,
                  "height": 0.342
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m27:aula-02:i2:2",
                "region:rtg-2026:m27:aula-02:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada conduta pela ordem de escolha que a aula ensinou."
            },
            "help": "Quem vem primeiro: a conversa e o apoio, ou a mão?",
            "type": "categorize",
            "feedback": {
              "correct": "Você ordenou do mais leve ao mais restrito e separou o que não se faz.",
              "incorrect": "Pergunte de cada conduta: é a ajuda mais leve, só entra se for necessário, ou machuca e não se faz?"
            },
            "payload": {
              "prompt": "Classifique cada conduta pela ordem de escolha que a aula ensinou.",
              "categories": [
                {
                  "id": "group:rtg-2026:m27:aula-02:i3:a",
                  "label": "Primeira escolha"
                },
                {
                  "id": "group:rtg-2026:m27:aula-02:i3:b",
                  "label": "Só se for necessário"
                },
                {
                  "id": "group:rtg-2026:m27:aula-02:i3:c",
                  "label": "Nunca"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:4",
                  "label": "Faixa apertada sobre o local machucado",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:c"
                },
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:3",
                  "label": "Adulto voluntário de avental segurando",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:b"
                },
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:2",
                  "label": "Apoio ou faixa que o serviço aprova",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:a"
                },
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:1",
                  "label": "Explicar e acalmar a criança antes",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:a"
                },
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:6",
                  "label": "Outro paciente segurando a criança",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:c"
                },
                {
                  "id": "item:rtg-2026:m27:aula-02:i3:5",
                  "label": "Deixar a criança sozinha no apoio",
                  "categoryId": "group:rtg-2026:m27:aula-02:i3:c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as condutas seguras quando a criança continua se mexendo e a faixa já está posta."
            },
            "help": "Quais condutas descrevem, conferem ou acompanham, em vez de forçar?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou o que protege a criança e deixou de fora a força e a mão no feixe.",
              "incorrect": "Releia os limites: sem força, sem atrapalhar a respiração, sem deixar a criança sozinha, sem mão no feixe e sem outro paciente."
            },
            "payload": {
              "prompt": "Marque todas as condutas seguras quando a criança continua se mexendo e a faixa já está posta.",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:a",
                  "label": "Avisar a equipe e esperar a decisão sobre outro recurso",
                  "explanation": "Quem escolhe o recurso é a equipe: você descreve o que vê e espera."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:b",
                  "label": "Apertar mais a faixa até a criança parar",
                  "explanation": "Apertar mais é força, e pode atrapalhar a respiração ou a circulação."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:c",
                  "label": "Conferir se ela respira com folga e a faixa não aperta",
                  "explanation": "Respiração e circulação não podem ser atrapalhadas por nenhum recurso."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:d",
                  "label": "Pedir que outro paciente da sala segure as pernas",
                  "explanation": "Outro paciente nunca segura: ele também se expõe sem necessidade."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:e",
                  "label": "Não deixá-la sozinha no apoio, nem por um instante",
                  "explanation": "A criança num recurso de imobilização não fica sozinha: alguém da equipe acompanha o tempo todo."
                },
                {
                  "id": "option:rtg-2026:m27:aula-02:i4:f",
                  "label": "Pôr a mão no campo de luz para firmar o braço",
                  "explanation": "Nenhuma parte do corpo de quem ajuda entra no feixe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m27:aula-02:i4:a",
                "option:rtg-2026:m27:aula-02:i4:c",
                "option:rtg-2026:m27:aula-02:i4:e"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Uma criança com dor no braço chega para o exame. Julgue cada afirmação sobre manter o braço parado."
            },
            "help": "Quem escolhe o recurso, e o que a faixa nunca pode cobrir?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve o limite: sem prender o local machucado e sem deixá-la sozinha.",
              "incorrect": "Releia o conceito: o recurso é escolha da equipe, a faixa não passa sobre o machucado e a criança fica acompanhada."
            },
            "payload": {
              "prompt": "Uma criança com dor no braço chega para o exame. Julgue cada afirmação sobre manter o braço parado.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m27:aula-02:i5:1",
                  "text": "A equipe escolhe o recurso, e você descreve o que observa.",
                  "isTrue": true,
                  "explanation": "Certo: o recurso é escolha da equipe, e a sua parte é descrever e ajudar."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-02:i5:2",
                  "text": "Dá para prender o braço com a faixa sobre o local que dói.",
                  "isTrue": false,
                  "explanation": "Nunca se prende sobre o local machucado: a pressão aumenta a dor e o risco."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-02:i5:3",
                  "text": "Deixar a criança sozinha no apoio enquanto você ajusta o painel é seguro.",
                  "isTrue": false,
                  "explanation": "A criança não fica sozinha em um recurso de imobilização, nem por pouco tempo."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Imobilizar com cuidado",
            "body": "Você conhece a ordem das ajudas, quem pode segurar com proteção e os limites que a imobilização não cruza. Quem escolhe o recurso é a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Ajuda leve, e o olho na criança o tempo todo."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m27:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped",
          "source:rtg-2026:m27:r101-shield"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Campo pequeno, tempo curto",
            "body": "Hoje você vai conseguir reconhecer um campo grande demais numa criança e conferir o campo ajustado antes do disparo.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Abri o campo bem grande para garantir que nada fica de fora. Não é mais seguro?"
                },
                {
                  "speaker": "caio",
                  "text": "Fora do que o pedido manda, o que entra no campo é radiação sem necessidade."
                },
                {
                  "speaker": "lia",
                  "text": "Corpo pequeno, região pequena. E quem define qual é a região?"
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos comparar um campo aberto com um campo ajustado."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "O campo cabe na região",
            "body": "A criança é pequena, e um campo aberto alcança partes que o pedido não inclui. O campo se ajusta à região de interesse que o protocolo do serviço define, antes da exposição, e não além dos limites daquela anatomia. A região não é escolha do estudante: o pedido e o protocolo a dizem. Você confere o campo de luz sobre a criança. Tempo curto também conta: com a criança calma e bem apoiada, a imagem sai de primeira, e repetir seria outra exposição.",
            "keyPoints": [
              "Campo ajustado à região que o pedido e o protocolo definem.",
              "Campo de luz conferido antes da exposição.",
              "Imagem de primeira evita repetir a exposição."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que vem antes de segurar a criança com a mão?"
            },
            "help": "Lembre da escada, da ajuda mais leve para a mais restrita.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o apoio ou a faixa aprovados vêm antes da mão.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que vem antes de segurar a criança com a mão?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-03:i1:a",
                  "label": "Pedir a outro paciente que ajude",
                  "explanation": "Outro paciente nunca segura a criança."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i1:b",
                  "label": "Apertar a faixa até ela parar",
                  "explanation": "Apertar é força, e a ajuda é a mais leve que resolve."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i1:c",
                  "label": "Chamar mais gente para a sala",
                  "explanation": "Mais gente na sala amplia quem se expõe; a ajuda começa pela mais leve."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i1:d",
                  "label": "Um apoio ou faixa que o serviço aprova",
                  "explanation": "Isso: o apoio ou a faixa aprovados vêm antes da mão."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-03:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O pedido é de tórax nas duas crianças. Toque nas partes do corpo que entraram no feixe sem o pedido incluí-las."
            },
            "help": "Compare os dois retângulos de luz com a região do pedido.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: o campo aberto da esquerda alcança a cabeça e as pernas, que o pedido de tórax não inclui. Vale só para este esquema.",
              "incorrect": "Essa parte não entrou no feixe sem pedido: ou é o tórax pedido, ou ficou fora do campo. Procure o campo aberto além do tórax."
            },
            "payload": {
              "prompt": "O pedido é de tórax nas duas crianças. Toque nas partes do corpo que entraram no feixe sem o pedido incluí-las.",
              "imageRef": "diagram:colimacao-pediatrica",
              "regions": [
                {
                  "id": "region:rtg-2026:m27:aula-03:i2:1",
                  "label": "Pernas da criança da esquerda",
                  "x": 0.194,
                  "y": 0.7,
                  "width": 0.113,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m27:aula-03:i2:2",
                  "label": "Cabeça da criança da esquerda",
                  "x": 0.206,
                  "y": 0.15,
                  "width": 0.087,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m27:aula-03:i2:3",
                  "label": "Tórax da criança da direita",
                  "x": 0.644,
                  "y": 0.263,
                  "width": 0.181,
                  "height": 0.175
                },
                {
                  "id": "region:rtg-2026:m27:aula-03:i2:4",
                  "label": "Abdome e pelve da criança da direita",
                  "x": 0.662,
                  "y": 0.467,
                  "width": 0.144,
                  "height": 0.217
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m27:aula-03:i2:1",
                "region:rtg-2026:m27:aula-03:i2:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: O pedido é de tórax. Julgue cada afirmação sobre os dois campos do esquema."
            },
            "help": "Quem define a região, e o que o campo grande acrescenta?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o campo ajustado do campo aberto e deixou a região com quem define.",
              "incorrect": "Releia o conceito: o campo cabe na região do pedido, e o estudante confere, mas não escolhe a região."
            },
            "payload": {
              "prompt": "O pedido é de tórax. Julgue cada afirmação sobre os dois campos do esquema.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m27:aula-03:i3:1",
                  "text": "O campo da cabeça aos pés expõe partes que o pedido não inclui.",
                  "isTrue": true,
                  "explanation": "Certo: o campo aberto alcança partes fora da região de interesse."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-03:i3:2",
                  "text": "Quem decide a região a radiografar é o estudante, olhando a criança pequena.",
                  "isTrue": false,
                  "explanation": "A região vem do pedido e do protocolo do serviço, e o estudante ajusta o campo a ela."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-03:i3:3",
                  "text": "Um campo grande é preferível, porque evita deixar a região de fora.",
                  "isTrue": false,
                  "explanation": "O campo ajustado já cobre a região; o grande só expõe o que não foi pedido."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-03:i3:4",
                  "text": "Conferir o campo de luz antes da exposição faz parte do trabalho.",
                  "isTrue": true,
                  "explanation": "Certo: o campo de luz mostra o que o feixe vai cobrir, e a conferência vem antes."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "O campo cobre uma parte do corpo; quem diz qual é?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: o campo cabe na região de interesse que o protocolo define.",
              "incorrect": "Pense no que o campo cobre e em quem define a região: não é o estudante, e sim o protocolo do serviço."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "O campo se ajusta à ",
                " de interesse que o ",
                " define, antes da exposição."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m27:aula-03:i4:5",
                  "label": "tempo"
                },
                {
                  "id": "token:rtg-2026:m27:aula-03:i4:2",
                  "label": "protocolo"
                },
                {
                  "id": "token:rtg-2026:m27:aula-03:i4:1",
                  "label": "região"
                },
                {
                  "id": "token:rtg-2026:m27:aula-03:i4:4",
                  "label": "estudante"
                },
                {
                  "id": "token:rtg-2026:m27:aula-03:i4:3",
                  "label": "criança"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m27:aula-03:i4:1",
                  "correctTokenId": "token:rtg-2026:m27:aula-03:i4:1"
                },
                {
                  "id": "blank:rtg-2026:m27:aula-03:i4:2",
                  "correctTokenId": "token:rtg-2026:m27:aula-03:i4:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Uma criança de 2 anos vai fazer um exame de tórax. Marque tudo o que você confere antes do disparo."
            },
            "help": "O que você confere no campo, em quem ajuda e na criança?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você conferiu campo, quem ajuda e a criança, e deixou de fora o campo aberto e a troca do exame.",
              "incorrect": "Releia o conceito: o campo cabe na região do protocolo, quem ajuda fica fora do feixe e a decisão do exame é da equipe."
            },
            "payload": {
              "prompt": "Uma criança de 2 anos vai fazer um exame de tórax. Marque tudo o que você confere antes do disparo.",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-03:i5:a",
                  "label": "O campo de luz cobre a região que o protocolo define",
                  "explanation": "O campo cobre a região de interesse, e o protocolo a define."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i5:b",
                  "label": "Nenhuma parte de quem ajuda está dentro do feixe",
                  "explanation": "Quem ajuda fica com o corpo todo fora do feixe."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i5:c",
                  "label": "O campo está aberto até os pés, por garantia",
                  "explanation": "Campo aberto alcança partes que o pedido não inclui."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i5:d",
                  "label": "A criança está calma e apoiada, acompanhada o tempo todo",
                  "explanation": "Criança calma e apoiada ajuda a imagem sair de primeira, sem repetir a exposição."
                },
                {
                  "id": "option:rtg-2026:m27:aula-03:i5:e",
                  "label": "Se o campo parecer grande, trocar o exame por outro",
                  "explanation": "Trocar o exame não é do estudante: ajuste o campo à região ou chame a equipe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m27:aula-03:i5:a",
                "option:rtg-2026:m27:aula-03:i5:b",
                "option:rtg-2026:m27:aula-03:i5:d"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "O campo cabe na criança",
            "body": "Você reconhece um campo aberto demais, confere o campo ajustado à região do protocolo e cuida para a imagem sair de primeira.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Campo pequeno, conferência rápida, criança calma."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m27:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped",
          "source:rtg-2026:m27:r101-hip",
          "source:rtg-2026:m27:pmc-hearing",
          "source:rtg-2026:m27:who-ageing",
          "source:rtg-2026:m27:who-falls",
          "source:rtg-2026:m27:pmc-geri-chest"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "O paciente idoso",
            "body": "Hoje você vai conseguir reconhecer riscos de queda e adaptar fala e apoio a uma pessoa idosa durante o posicionamento.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "Meu filho, fale de frente para mim. O ouvido já não é o de antes, e a vista também cansa."
                },
                {
                  "speaker": "duda",
                  "text": "Falo mais alto, então?"
                },
                {
                  "speaker": "caio",
                  "text": "Gritar distorce o som. Pense no que ajuda: de frente, devagar, e onde ela pisa."
                },
                {
                  "speaker": "pixel",
                  "text": "Audição, visão, pele e equilíbrio: quatro coisas para olhar antes de posicionar."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Posicionar com a idade em conta",
            "body": "Com a idade, ouvir e enxergar ficam mais difíceis, o equilíbrio falha mais e a pele pode ser frágil. No posicionamento, isso vira ação: fale de frente, devagar, sem gritar e com palavras simples, e confira se foi entendido; mantenha a sala iluminada e o caminho sem tapete solto nem obstáculo; toque e mova com cuidado, sem puxar, com a ajuda da equipe e pelo protocolo do serviço. Se a pessoa não consegue a posição padrão, não force: descreva e peça apoio à equipe.",
            "keyPoints": [
              "Audição: de frente, devagar, sem gritar, confirmando.",
              "Visão e equilíbrio: sala iluminada e caminho livre.",
              "Pele frágil: mover com cuidado, com a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula sobre dor, o que você faz diante de uma pessoa que sente dor ao se mover?"
            },
            "help": "Lembre se você move contra a dor ou pergunta antes.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: perguntar o que a pessoa consegue e não forçar é a base da abordagem com dor.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula sobre dor, o que você faz diante de uma pessoa que sente dor ao se mover?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-04:i1:a",
                  "label": "Pergunta o que ela consegue e não força",
                  "explanation": "Isso: perguntar o que a pessoa consegue e não forçar é a base da abordagem com dor."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i1:b",
                  "label": "Move o membro até a posição padrão, devagar",
                  "explanation": "Mover contra a dor é o que a aula de dor pede para não fazer."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i1:c",
                  "label": "Pede que a pessoa aguente, porque é rápido",
                  "explanation": "Pedir que aguente ignora a dor e pode piorar a situação."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i1:d",
                  "label": "Retira o gesso para facilitar o posicionamento",
                  "explanation": "Gesso e tala não se retiram por conta própria."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-04:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada característica da idade à adaptação que a aula ensinou."
            },
            "help": "Pergunte de cada adaptação qual sentido ou qual risco ela atende.",
            "type": "matching",
            "feedback": {
              "correct": "Cada mudança da idade virou uma ação no posicionamento.",
              "incorrect": "Releia o conceito: o ouvido pede fala de frente e devagar, a visão pede luz, a pele pede cuidado e o equilíbrio pede caminho livre."
            },
            "payload": {
              "prompt": "Ligue cada característica da idade à adaptação que a aula ensinou.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m27:aula-04:i2:1",
                  "left": "Audição reduzida",
                  "right": "Falar de frente, devagar e sem gritar, confirmando que entendeu"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-04:i2:2",
                  "left": "Visão reduzida",
                  "right": "Manter a sala iluminada no caminho até o receptor"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-04:i2:3",
                  "left": "Pele frágil",
                  "right": "Mover com cuidado, sem puxar, com a ajuda da equipe"
                },
                {
                  "id": "pair:rtg-2026:m27:aula-04:i2:4",
                  "left": "Equilíbrio instável",
                  "right": "Tirar do caminho o tapete solto e outros obstáculos"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as ações que ajudam uma pessoa idosa com audição reduzida a entender o exame."
            },
            "help": "O que ajuda a pessoa a ouvir e a ver, em vez de só aumentar o volume?",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou o que facilita a escuta e deixou de fora o grito e a fala de costas.",
              "incorrect": "Releia o conceito: de frente, devagar, sem gritar e com palavras simples, confirmando que entendeu."
            },
            "payload": {
              "prompt": "Marque todas as ações que ajudam uma pessoa idosa com audição reduzida a entender o exame.",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:a",
                  "label": "Ficar de frente para ela, para ela ver o seu rosto",
                  "explanation": "De frente, a pessoa vê o rosto e apoia a escuta no que vê."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:b",
                  "label": "Falar mais alto, quase gritando",
                  "explanation": "Gritar costuma distorcer a fala de quem ouve menos; fale devagar e claro."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:c",
                  "label": "Falar devagar e fazer pausas",
                  "explanation": "Pausas dão tempo de entender, e a fala rápida atrapalha."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:d",
                  "label": "Usar palavras simples, em vez de termos técnicos",
                  "explanation": "Termos técnicos são o que mais se perde na conversa."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:e",
                  "label": "Falar de costas enquanto ajusta o equipamento",
                  "explanation": "De costas, ela não vê o rosto e não entende a explicação."
                },
                {
                  "id": "option:rtg-2026:m27:aula-04:i3:f",
                  "label": "Pedir que avise se não estiver entendendo",
                  "explanation": "Pedir o aviso abre espaço para repetir e reformular."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m27:aula-04:i3:a",
                "option:rtg-2026:m27:aula-04:i3:c",
                "option:rtg-2026:m27:aula-04:i3:d",
                "option:rtg-2026:m27:aula-04:i3:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Encontre os riscos: Dona Marta vai ficar de pé diante do receptor. Toque em todas as situações da cena que aumentam o risco de queda."
            },
            "help": "Procure o que pode fazer tropeçar e o que deveria estar ao alcance da pessoa.",
            "type": "risk-hunt",
            "feedback": {
              "correct": "Isso: você achou o degrau, o tapete e o andador longe, e deixou a barra e o banco, que ajudam.",
              "incorrect": "Releia a cena: algum obstáculo do piso ou o andador longe ficou de fora, ou o apoio foi marcado como risco."
            },
            "payload": {
              "prompt": "Dona Marta vai ficar de pé diante do receptor. Toque em todas as situações da cena que aumentam o risco de queda.",
              "imageRef": "diagram:idoso-apoios-e-riscos",
              "regions": [
                {
                  "id": "region:rtg-2026:m27:aula-04:i4:1",
                  "label": "Barra de apoio junto ao receptor",
                  "x": 0.09,
                  "y": 0.5,
                  "width": 0.08,
                  "height": 0.24,
                  "explanation": "A barra firme junto ao receptor dá onde a pessoa se segurar: é apoio, e não risco."
                },
                {
                  "id": "region:rtg-2026:m27:aula-04:i4:2",
                  "label": "Degrau no chão",
                  "x": 0.487,
                  "y": 0.808,
                  "width": 0.106,
                  "height": 0.083,
                  "explanation": "Um degrau no chão é obstáculo para quem se equilibra mal: a equipe resolve o caminho antes do exame."
                },
                {
                  "id": "region:rtg-2026:m27:aula-04:i4:3",
                  "label": "Banco ao lado",
                  "x": 0.294,
                  "y": 0.658,
                  "width": 0.138,
                  "height": 0.233,
                  "explanation": "O banco está ao lado, fora do caminho dela: aqui ele não é obstáculo. Se ela precisar sentar, a equipe confere se ele é firme."
                },
                {
                  "id": "region:rtg-2026:m27:aula-04:i4:4",
                  "label": "Tapete com a ponta solta",
                  "x": 0.619,
                  "y": 0.81,
                  "width": 0.181,
                  "height": 0.09,
                  "explanation": "A ponta solta do tapete pode prender o pé: piso irregular é risco de queda para quem se equilibra mal."
                },
                {
                  "id": "region:rtg-2026:m27:aula-04:i4:5",
                  "label": "Andador longe da pessoa",
                  "x": 0.831,
                  "y": 0.533,
                  "width": 0.156,
                  "height": 0.358,
                  "explanation": "Ela usa o andador para se firmar, e ele ficou longe: avise a equipe antes de ela andar até ele, e siga o protocolo do serviço."
                }
              ],
              "riskRegionIds": [
                "region:rtg-2026:m27:aula-04:i4:2",
                "region:rtg-2026:m27:aula-04:i4:4",
                "region:rtg-2026:m27:aula-04:i4:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Dona Marta, idosa, está na maca, ouve mal e tem a pele fina nos braços. Ajude-a durante a passagem para a mesa."
            },
            "help": "Como a pessoa ouve melhor, e como a pele rasga menos?",
            "type": "conversation",
            "feedback": {
              "correct": "Você falou de frente e devagar e cuidou da pele fina, combinando o movimento com a equipe.",
              "incorrect": "Releia o conceito: ouvido pede fala de frente e devagar, e pele frágil pede toque e movimento com cuidado."
            },
            "payload": {
              "prompt": "Dona Marta, idosa, está na maca, ouve mal e tem a pele fina nos braços. Ajude-a durante a passagem para a mesa.",
              "speaker": "paciente",
              "name": "Dona Marta",
              "turns": [
                {
                  "id": "turn:rtg-2026:m27:aula-04:i5:1",
                  "line": "O que o senhor disse? Não escutei, aqui tem muito barulho.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:1a",
                      "label": "Vou repetir mais alto, quase gritando, até a senhora ouvir.",
                      "reply": "Gritando eu escuto pior ainda, o som fica estranho."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:1b",
                      "label": "Vou me aproximar, ficar de frente e falar mais devagar.",
                      "reply": "Assim eu consigo ver o seu rosto e acompanhar melhor."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:1c",
                      "label": "Deixa para lá, uma colega explica depois.",
                      "reply": "Mas eu queria entender antes de me mexerem."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-04:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m27:aula-04:i5:2",
                  "line": "Meu braço é fino e rasga fácil. Me puxe com cuidado.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:2a",
                      "label": "Aviso a equipe e movo a senhora devagar.",
                      "reply": "Assim eu fico mais tranquila, obrigada."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:2b",
                      "label": "Pode deixar, eu puxo rápido pelo braço, é mais fácil.",
                      "reply": "Rápido pelo braço me assusta, filho."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-04:i5:2c",
                      "label": "Então a senhora se vira sozinha, para ninguém encostar.",
                      "reply": "Sozinha eu não consigo, estou com receio de cair."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-04:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "A pessoa inteira, antes da posição",
            "body": "Você olha audição, visão, pele e equilíbrio como parte do posicionamento, adapta a fala e o apoio e, quando a posição padrão não vem, descreve e pede apoio.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Posição boa é a que a pessoa consegue manter sem se machucar."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m27:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-shield"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "A gestante com exame indicado",
            "body": "Hoje você vai conseguir dizer o que muda na sala quando a equipe decidiu fazer o exame numa gestante.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Paula",
                  "text": "A equipe explicou que o exame é necessário, mesmo eu estando grávida. Mas fico pensando no bebê."
                },
                {
                  "speaker": "duda",
                  "text": "Então a decisão já foi tomada. E agora, o que eu faço de diferente na sala?"
                },
                {
                  "speaker": "caio",
                  "text": "A decisão foi da equipe. O seu trabalho começa depois dela."
                },
                {
                  "speaker": "pixel",
                  "text": "Olhe o desenho: o que o campo alcança e o que ele deixa de fora?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "O que muda depois da decisão",
            "body": "Quem decide fazer, adiar ou trocar o exame é a equipe, pelo protocolo do serviço. Decidido o exame, o campo se fecha à região pedida, e o abdome, fora dela, fica fora do feixe. A proteção de contato é o serviço que define. Você explica com calma o que vem, sem prometer. Se o campo parece alcançar o abdome, pare e peça apoio à equipe. No esquema, o campo cheio fica no tórax; o tracejado, aberto demais, alcança o abdome.",
            "keyPoints": [
              "A equipe decide fazer, adiar ou trocar o exame.",
              "Campo fechado à região pedida: o abdome fica fora do feixe.",
              "Proteção de contato: o serviço define."
            ],
            "visual": "gestante-campo-e-feixe"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula sobre gestação, a paciente diz que a menstruação atrasou. O que vem antes de qualquer exposição?"
            },
            "help": "Lembre o que a dúvida de gestação pede antes do disparo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: pausar e avisar a equipe vem antes de qualquer exposição.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula sobre gestação, a paciente diz que a menstruação atrasou. O que vem antes de qualquer exposição?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-05:i1:a",
                  "label": "Expor logo, que o exame já está pedido",
                  "explanation": "Expor sem pausa ignora a dúvida de gestação, que vai para a equipe antes."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i1:b",
                  "label": "Pausar e avisar a equipe",
                  "explanation": "Isso: pausar e avisar a equipe vem antes de qualquer exposição."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i1:c",
                  "label": "Decidir sozinho se o exame continua",
                  "explanation": "Decidir fazer ou adiar é da equipe, e não do estudante."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i1:d",
                  "label": "Anotar com outras palavras e seguir",
                  "explanation": "Anotar com outras palavras muda o que a paciente disse e não resolve a dúvida."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Quem decide o exame, e quem define a proteção de contato?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: a equipe decide o exame, e o serviço define a proteção de contato.",
              "incorrect": "Pense em quem decide: não é o estudante, nem a paciente, nem o acompanhante, e a proteção de contato vem do serviço."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "Quem decide fazer, adiar ou trocar o exame é a ",
                ", e a proteção de contato é definida pelo ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m27:aula-05:i2:3",
                  "label": "estudante"
                },
                {
                  "id": "token:rtg-2026:m27:aula-05:i2:4",
                  "label": "paciente"
                },
                {
                  "id": "token:rtg-2026:m27:aula-05:i2:5",
                  "label": "acompanhante"
                },
                {
                  "id": "token:rtg-2026:m27:aula-05:i2:1",
                  "label": "equipe"
                },
                {
                  "id": "token:rtg-2026:m27:aula-05:i2:2",
                  "label": "serviço"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m27:aula-05:i2:1",
                  "correctTokenId": "token:rtg-2026:m27:aula-05:i2:1"
                },
                {
                  "id": "blank:rtg-2026:m27:aula-05:i2:2",
                  "correctTokenId": "token:rtg-2026:m27:aula-05:i2:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre a gestante com exame decidido pela equipe."
            },
            "help": "Pergunte de cada afirmação: é decisão da equipe, do serviço ou sua?",
            "type": "blitz",
            "feedback": {
              "correct": "Você separou o que é da equipe, o que é do serviço e o que você faz na sala.",
              "incorrect": "Releia o conceito: a equipe decide o exame, o serviço define a proteção de contato, e você cuida da posição e da conversa."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre a gestante com exame decidido pela equipe.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:1",
                  "text": "Quem decide fazer o exame é a equipe, e não o estudante.",
                  "isTrue": true,
                  "explanation": "A decisão de fazer, adiar ou trocar o exame é da equipe."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:2",
                  "text": "O estudante pode adiar o exame por conta própria, por prudência.",
                  "isTrue": false,
                  "explanation": "Adiar é decisão da equipe; o estudante descreve a dúvida e pede apoio."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:3",
                  "text": "Fechar o campo à região pedida ajuda a manter o abdome fora do feixe.",
                  "isTrue": true,
                  "explanation": "Posição e campo fechados à região são o que mantém o abdome fora do feixe."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:4",
                  "text": "A proteção de contato é a mesma em todos os serviços.",
                  "isTrue": false,
                  "explanation": "A proteção de contato é o que o serviço define, e a prática varia entre serviços."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:5",
                  "text": "Explicar com calma o que vai acontecer faz parte do cuidado.",
                  "isTrue": true,
                  "explanation": "A explicação calma acolhe a paciente sem prometer o que não cabe ao estudante."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:6",
                  "text": "Dá para prometer que o exame não oferece nenhum risco.",
                  "isTrue": false,
                  "explanation": "Prometer isso não cabe ao estudante; a dúvida vai para a equipe."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-05:i3:7",
                  "text": "Se ela pergunta pelo bebê, você troca o exame por outro sem radiação.",
                  "isTrue": false,
                  "explanation": "Trocar o exame é decisão da equipe, e não do estudante."
                }
              ],
              "passCount": 6
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua ação, como estudante?"
            },
            "help": "Quem confere o campo quando ele parece errado, e quem decide adiar?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: pausar antes de expor, descrever o que vê e deixar a equipe conferir o campo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Paula já está posicionada para uma radiografia de tórax em PA, e a equipe decidiu fazer o exame. Ela pergunta se o campo vai pegar a barriga. Ao olhar o campo de luz, ele parece cobrir parte do abdome dela.",
              "prompt": "Qual é a sua ação, como estudante?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-05:i4:a",
                  "label": "Disparar assim, porque a equipe já decidiu o exame",
                  "explanation": "A decisão do exame não dispensa conferir o campo antes da exposição."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i4:b",
                  "label": "Prometer à paciente que o campo não alcança o bebê",
                  "explanation": "Prometer não cabe ao estudante, ainda mais com o campo parecendo alcançar o abdome."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i4:c",
                  "label": "Pausar, descrever o campo à equipe e aguardar",
                  "explanation": "Isso: pausar antes de expor, descrever o que vê e deixar a equipe conferir o campo."
                },
                {
                  "id": "option:rtg-2026:m27:aula-05:i4:d",
                  "label": "Adiar o exame, porque a barriga está no campo",
                  "explanation": "Adiar é decisão da equipe; você descreve o campo e pede apoio."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-05:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Paula é gestante, a equipe decidiu o exame e ela tem medo pelo bebê. Conduza a conversa, sem prometer o que não cabe a você."
            },
            "help": "O que você promete, e o que você leva à equipe?",
            "type": "conversation",
            "feedback": {
              "correct": "Você acolheu a paciente, levou a decisão e a proteção de contato à equipe e não prometeu o que não cabe a você.",
              "incorrect": "Releia o conceito: a equipe decide o exame, o serviço define a proteção de contato, e você explica sem prometer."
            },
            "payload": {
              "prompt": "Paula é gestante, a equipe decidiu o exame e ela tem medo pelo bebê. Conduza a conversa, sem prometer o que não cabe a você.",
              "speaker": "paciente",
              "name": "Paula",
              "turns": [
                {
                  "id": "turn:rtg-2026:m27:aula-05:i5:1",
                  "line": "Vocês vão fazer o exame mesmo grávida? Isso não faz mal para o bebê?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:1a",
                      "label": "Não faz mal nenhum, pode ficar tranquila, eu garanto.",
                      "reply": "Garante assim, tão depressa? Isso me deixa mais desconfiada."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:1b",
                      "label": "A equipe decidiu o exame; eu explico o que vem.",
                      "reply": "Está bem, pode me explicar então."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:1c",
                      "label": "Se a senhora está com medo, a gente cancela agora.",
                      "reply": "Cancelar assim, de repente? Eu só queria entender."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-05:i5:1b"
                },
                {
                  "id": "turn:rtg-2026:m27:aula-05:i5:2",
                  "line": "O senhor vai pôr um avental na minha barriga?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:2a",
                      "label": "Sim, sempre se põe avental na barriga de gestante.",
                      "reply": "Sempre? Então não tem exceção nenhuma."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:2b",
                      "label": "Não, nunca se usa avental na barriga de gestante.",
                      "reply": "Nunca? Mas uma amiga contou que usou."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-05:i5:2c",
                      "label": "Isso o serviço define: vou perguntar à equipe.",
                      "reply": "Está bem, aguardo a resposta da equipe."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-05:i5:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Depois da decisão da equipe",
            "body": "Você sabe o que muda na sala: abdome fora do feixe pela posição e pelo campo, proteção de contato definida pelo serviço e uma conversa calma, sem promessa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "A equipe decide o exame, e você cuida do que fica na sala."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m27:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m27:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m27-v1",
        "sourceIds": [
          "source:rtg-2026:m27:r101-shield",
          "source:rtg-2026:m27:r101-ped",
          "source:rtg-2026:m27:pmc-hearing",
          "source:rtg-2026:m27:who-falls",
          "source:rtg-2026:m27:pmc-geri-chest"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Três pacientes, três adaptações",
            "body": "Hoje você vai conseguir ligar a cada paciente a adaptação certa e reconhecer o que continua sendo decisão da equipe.",
            "dialogue": {
              "setting": "Sala de radiografia simulada",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Plantão de manhã: um menino de três anos, uma senhora de oitenta e uma gestante com exame decidido."
                },
                {
                  "speaker": "duda",
                  "text": "Três pessoas, três cuidados. Eu confundo qual é de quem."
                },
                {
                  "speaker": "caio",
                  "text": "Pergunte de cada cuidado: o que ele resolve?"
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos juntar as cinco aulas."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada paciente, um cuidado",
            "body": "Cada paciente muda a sala de um jeito. Na criança: fala pela idade, a ajuda mais leve que resolve, nunca força, campo ajustado à região. Na pessoa idosa: fala de frente e devagar, pele cuidada, sala iluminada e caminho livre. Na gestante: campo fechado à região pedida, com o abdome fora do feixe. Em todos, quem decide fazer, adiar ou trocar o exame é a equipe, a proteção de contato é o serviço que define, e na dúvida você para, descreve e pede apoio.",
            "keyPoints": [
              "Criança: fala pela idade, ajuda leve, campo ajustado.",
              "Pessoa idosa: fala de frente, pele cuidada, caminho livre.",
              "Gestante: abdome fora do feixe; exame e proteção de contato não são do estudante."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, quem define se há proteção de contato sobre o abdome da gestante?"
            },
            "help": "Lembre quem define a proteção, e a decisão do exame.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a proteção de contato é o que o serviço define.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, quem define se há proteção de contato sobre o abdome da gestante?",
              "options": [
                {
                  "id": "option:rtg-2026:m27:aula-06:i1:a",
                  "label": "O estudante, pela posição da paciente",
                  "explanation": "O estudante cuida da posição, mas não define a proteção de contato."
                },
                {
                  "id": "option:rtg-2026:m27:aula-06:i1:b",
                  "label": "A paciente, no momento do exame",
                  "explanation": "A paciente participa da conversa, mas a proteção de contato não é escolha dela."
                },
                {
                  "id": "option:rtg-2026:m27:aula-06:i1:c",
                  "label": "O acompanhante, se estiver na sala",
                  "explanation": "O acompanhante apoia a paciente e não define proteção."
                },
                {
                  "id": "option:rtg-2026:m27:aula-06:i1:d",
                  "label": "O serviço, pelo seu protocolo",
                  "explanation": "Isso: a proteção de contato é o que o serviço define."
                }
              ],
              "correctOptionId": "option:rtg-2026:m27:aula-06:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada cuidado no paciente a quem ele mais se aplica."
            },
            "help": "Pense no que cada cuidado resolve, e em quem tem esse problema.",
            "type": "categorize",
            "feedback": {
              "correct": "Você ligou cada cuidado ao paciente que ele resolve.",
              "incorrect": "Pergunte de cada cuidado qual risco ele atende: movimento, queda, ou o abdome no feixe."
            },
            "payload": {
              "prompt": "Classifique cada cuidado no paciente a quem ele mais se aplica.",
              "categories": [
                {
                  "id": "group:rtg-2026:m27:aula-06:i2:a",
                  "label": "Criança"
                },
                {
                  "id": "group:rtg-2026:m27:aula-06:i2:b",
                  "label": "Pessoa idosa"
                },
                {
                  "id": "group:rtg-2026:m27:aula-06:i2:c",
                  "label": "Gestante"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:3",
                  "label": "Falar de frente, devagar e sem gritar",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:b"
                },
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:1",
                  "label": "Frase simples, sem pergunta de sim ou não",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:a"
                },
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:2",
                  "label": "Faixa ou apoio, nunca a força",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:a"
                },
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:4",
                  "label": "Caminho sem tapete solto e sala iluminada",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:b"
                },
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:5",
                  "label": "Abdome fora do feixe, pela posição e pelo campo",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:c"
                },
                {
                  "id": "item:rtg-2026:m27:aula-06:i2:6",
                  "label": "Dúvida sobre o bebê vai à equipe, sem promessa",
                  "categoryId": "group:rtg-2026:m27:aula-06:i2:c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Dona Marta se equilibra mal e chegou com o apoio que ela usa para andar, que ficou longe dela. Toque nesse apoio."
            },
            "help": "Separe o que é da sala do que ela trouxe consigo.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso: o andador dela ficou longe; você avisa a equipe antes de ela andar até ele, pelo protocolo do serviço.",
              "incorrect": "Essa parte da cena não é o apoio que ela trouxe para andar. Procure o que é dela e ficou longe."
            },
            "payload": {
              "prompt": "Dona Marta se equilibra mal e chegou com o apoio que ela usa para andar, que ficou longe dela. Toque nesse apoio.",
              "imageRef": "diagram:idoso-apoios-e-riscos",
              "regions": [
                {
                  "id": "region:rtg-2026:m27:aula-06:i3:1",
                  "label": "Barra de apoio",
                  "x": 0.09,
                  "y": 0.5,
                  "width": 0.08,
                  "height": 0.24
                },
                {
                  "id": "region:rtg-2026:m27:aula-06:i3:2",
                  "label": "Banco",
                  "x": 0.294,
                  "y": 0.658,
                  "width": 0.138,
                  "height": 0.233
                },
                {
                  "id": "region:rtg-2026:m27:aula-06:i3:3",
                  "label": "Degrau",
                  "x": 0.487,
                  "y": 0.808,
                  "width": 0.106,
                  "height": 0.083
                },
                {
                  "id": "region:rtg-2026:m27:aula-06:i3:4",
                  "label": "Tapete",
                  "x": 0.619,
                  "y": 0.81,
                  "width": 0.181,
                  "height": 0.09
                },
                {
                  "id": "region:rtg-2026:m27:aula-06:i3:5",
                  "label": "Andador",
                  "x": 0.831,
                  "y": 0.533,
                  "width": 0.156,
                  "height": 0.358
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m27:aula-06:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Lia quer ouvir como você organiza o que diz à equipe com três pacientes ao mesmo tempo."
            },
            "help": "O que você combina com a equipe e o que você faz sozinho?",
            "type": "conversation",
            "feedback": {
              "correct": "Você levou à equipe a ordem e o estado de quem acompanha, sem decidir sozinho.",
              "incorrect": "Releia o conceito: a ordem e o papel de quem acompanha são combinados com a equipe, e quem está tonta não segura sem a equipe decidir."
            },
            "payload": {
              "prompt": "Lia quer ouvir como você organiza o que diz à equipe com três pacientes ao mesmo tempo.",
              "speaker": "lia",
              "turns": [
                {
                  "id": "turn:rtg-2026:m27:aula-06:i4:1",
                  "line": "A gestante com exame decidido chega junto com o menino de 3 anos, que precisa de apoio. Por onde você começa?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:1a",
                      "label": "Atendo quem chegou primeiro e depois vejo o resto.",
                      "reply": "Então a ordem fica por conta de quem chegou antes."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:1b",
                      "label": "Pergunto à equipe a ordem e o que cada caso pede.",
                      "reply": "Então combino com a equipe antes de começar."
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:1c",
                      "label": "Resolvo sozinho para não incomodar a equipe agora.",
                      "reply": "Sozinho? Então me conta como você faria."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-06:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m27:aula-06:i4:2",
                  "line": "A avó do menino, de 80 anos, quer segurar o neto e está tonta. O que você diz à equipe?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:2a",
                      "label": "Conto à equipe que ela está tonta, e a equipe decide.",
                      "reply": "Entendo. E enquanto isso, onde ela fica?"
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:2b",
                      "label": "Deixo ela segurar em pé, sem avental, para ser rápido.",
                      "reply": "Em pé e sem avental, para ganhar tempo?"
                    },
                    {
                      "id": "option:rtg-2026:m27:aula-06:i4:2c",
                      "label": "Peço que espere em pé no corredor, sem apoio nenhum.",
                      "reply": "Em pé, sozinha no corredor? Hum, não sei."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m27:aula-06:i4:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m27:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m27:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Um avô de 80 anos quer acompanhar a neta de 3 anos. Julgue cada afirmação."
            },
            "help": "O avô é acompanhante e também pessoa idosa: que cuidados valem para os dois papéis?",
            "type": "true-false",
            "feedback": {
              "correct": "Você juntou o papel combinado, a proteção, o apoio e a fala adaptada.",
              "incorrect": "Releia o conceito: papel e proteção combinados, caminho livre, avental para quem segura e fala de frente e devagar."
            },
            "payload": {
              "prompt": "Um avô de 80 anos quer acompanhar a neta de 3 anos. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m27:aula-06:i5:1",
                  "text": "A equipe combina o papel dele e a proteção antes de ele ficar na sala.",
                  "isTrue": true,
                  "explanation": "Certo: quem fica tem papel e proteção combinados com a equipe."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-06:i5:2",
                  "text": "Se ele se equilibra mal, o caminho dele fica livre de tapete solto.",
                  "isTrue": true,
                  "explanation": "Certo: piso com tapete solto é risco de queda para quem se equilibra mal."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-06:i5:3",
                  "text": "Ele pode segurar a neta sem avental, se for só por um instante.",
                  "isTrue": false,
                  "explanation": "Quem segura usa avental e mantém o corpo fora do feixe, mesmo por um instante."
                },
                {
                  "id": "statement:rtg-2026:m27:aula-06:i5:4",
                  "text": "Falar de frente e devagar ajuda, se ele ouve mal.",
                  "isTrue": true,
                  "explanation": "Certo: de frente e devagar, sem gritar, ajuda quem ouve menos."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m27:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Três pacientes, uma sala",
            "body": "Você liga cada paciente ao cuidado certo e mantém o que é da equipe com a equipe: decidir o exame e definir a proteção de contato. Na dúvida, para, descreve e pede apoio.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Adaptar é cuidar de quem está na sala, dentro do que a equipe decidiu."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m27",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-01"
        ],
        "prompt": "Uma criança de 2 anos recusa deitar na mesa. Qual fala combina com o que a aula ensinou?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-01:c1:a",
            "label": "Você quer deitar agora?"
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c1:b",
            "label": "Se não deitar, não vamos terminar nunca."
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c1:c",
            "label": "Fique quieto, é rápido, não tem o que explicar."
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c1:d",
            "label": "Vamos deitar na mesa agora, e eu conto cada passo."
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-01:c1:d",
        "feedback": {
          "correct": "Isso: frase simples e concreta, com cada passo explicado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-01"
        ],
        "prompt": "Um adolescente chega com a mãe para o exame. A quem você explica o procedimento?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-01:c2:a",
            "label": "A ele direto, e pergunto se quer a mãe perto."
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c2:b",
            "label": "Só à mãe, porque ele é menor de idade."
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c2:c",
            "label": "A ninguém, porque ele já sabe o que é exame."
          },
          {
            "id": "option:rtg-2026:m27:aula-01:c2:d",
            "label": "Aos dois, mas só depois do disparo."
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-01:c2:a",
        "feedback": {
          "correct": "Isso: o adolescente é o paciente e ouve a explicação direto, e ele diz se quer a mãe por perto.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-02"
        ],
        "prompt": "Qual destas é a primeira escolha para manter uma criança parada?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-02:c1:a",
            "label": "Pedir a outro paciente que segure a criança"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c1:b",
            "label": "Apertar a faixa até ela parar de reagir"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c1:c",
            "label": "Conversar e usar um apoio que o serviço aprova"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c1:d",
            "label": "Segurar com a mão desde o início"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-02:c1:c",
        "feedback": {
          "correct": "Isso: a conversa e o apoio aprovado são as ajudas mais leves, antes da mão.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-02"
        ],
        "prompt": "Qual destas situações a imobilização nunca permite?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-02:c2:a",
            "label": "Faixa folgada sobre as pernas, sem apertar"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c2:b",
            "label": "Apoio de espuma aprovado ao lado do corpo"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c2:c",
            "label": "Responsável protegido ao lado, fora do feixe"
          },
          {
            "id": "option:rtg-2026:m27:aula-02:c2:d",
            "label": "Faixa no tórax que encurta a respiração"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-02:c2:d",
        "feedback": {
          "correct": "Isso: nenhum recurso pode atrapalhar a respiração; a faixa justa é força.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-03"
        ],
        "prompt": "Qual é a consequência de um campo aberto além da região de interesse numa criança?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-03:c1:a",
            "label": "Mais partes do corpo ficam expostas sem necessidade"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c1:b",
            "label": "A imagem fica mais nítida na região de interesse"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c1:c",
            "label": "A chance de repetir a imagem diminui"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c1:d",
            "label": "O apoio da criança deixa de ser necessário"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-03:c1:a",
        "feedback": {
          "correct": "Isso: o campo aberto alcança partes que o pedido não inclui.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-03"
        ],
        "prompt": "Quem define a região que o campo deve cobrir?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-03:c2:a",
            "label": "O estudante, olhando a criança"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c2:b",
            "label": "O responsável que acompanha a criança"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c2:c",
            "label": "O pedido e o protocolo do serviço"
          },
          {
            "id": "option:rtg-2026:m27:aula-03:c2:d",
            "label": "A criança, por onde sente incômodo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-03:c2:c",
        "feedback": {
          "correct": "Isso: o pedido e o protocolo dizem a região, e o campo se ajusta a ela.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-04"
        ],
        "prompt": "Uma pessoa idosa ouve mal. Qual fala ajuda mais?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-04:c1:a",
            "label": "Falar de frente, devagar e sem gritar"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c1:b",
            "label": "Falar muito alto, de longe, para a sala ouvir"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c1:c",
            "label": "Falar rápido, para o exame acabar logo"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c1:d",
            "label": "Falar só com o acompanhante, sem olhar para ela"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-04:c1:a",
        "feedback": {
          "correct": "Isso: de frente, devagar e sem gritar, confirmando que entendeu.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:pmc-hearing"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-04"
        ],
        "prompt": "Qual situação da sala aumenta o risco de queda de quem se equilibra mal?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-04:c2:a",
            "label": "A barra de apoio presa junto ao receptor"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c2:b",
            "label": "Um tapete com a ponta solta no caminho"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c2:c",
            "label": "Um banco fora do caminho, ao lado do receptor"
          },
          {
            "id": "option:rtg-2026:m27:aula-04:c2:d",
            "label": "A sala bem iluminada no caminho até o receptor"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: a ponta solta pode prender o pé de quem se equilibra mal.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:who-falls"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-05"
        ],
        "prompt": "Quem decide fazer, adiar ou trocar o exame de uma gestante?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-05:c1:a",
            "label": "A equipe, pelo protocolo do serviço"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c1:b",
            "label": "O estudante, depois de conversar com ela"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c1:c",
            "label": "A paciente, sozinha, na hora da exposição"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c1:d",
            "label": "O acompanhante, se ela estiver com medo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-05:c1:a",
        "feedback": {
          "correct": "Isso: a decisão é da equipe, pelo protocolo do serviço.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-shield"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-05"
        ],
        "prompt": "Paula pergunta se o exame é seguro para o bebê. Qual resposta cabe ao estudante?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-05:c2:a",
            "label": "Garantir que o exame não oferece risco"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c2:b",
            "label": "Dizer que o exame deve ser cancelado"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c2:c",
            "label": "Explicar o que será feito e avisar a equipe"
          },
          {
            "id": "option:rtg-2026:m27:aula-05:c2:d",
            "label": "Mudar de assunto até a paciente esquecer"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-05:c2:c",
        "feedback": {
          "correct": "Isso: explicar com calma e levar a dúvida à equipe, sem prometer.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-shield"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-06"
        ],
        "prompt": "Qual cuidado vale para os três pacientes da aula?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-06:c1:a",
            "label": "O estudante decide trocar o exame se achar melhor"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c1:b",
            "label": "Quem decide fazer, adiar ou trocar o exame é a equipe"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c1:c",
            "label": "A proteção de contato é sempre a mesma"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c1:d",
            "label": "A força é a ajuda mais rápida para quem não colabora"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-06:c1:b",
        "feedback": {
          "correct": "Isso: nos três casos, a decisão do exame é da equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped",
          "source:rtg-2026:m27:r101-shield"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m27:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m27:aula-06"
        ],
        "prompt": "Qual par liga o paciente à adaptação certa?",
        "options": [
          {
            "id": "option:rtg-2026:m27:aula-06:c2:a",
            "label": "Pessoa idosa que ouve mal: de frente, devagar"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c2:b",
            "label": "Criança pequena: pergunta de sim ou não"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c2:c",
            "label": "Gestante: campo aberto, por garantia"
          },
          {
            "id": "option:rtg-2026:m27:aula-06:c2:d",
            "label": "Pessoa idosa de pele fina: puxar pelo braço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m27:aula-06:c2:a",
        "feedback": {
          "correct": "Isso: de frente, devagar e sem gritar ajuda quem ouve menos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m27:r101-ped",
          "source:rtg-2026:m27:pmc-hearing",
          "source:rtg-2026:m27:r101-hip"
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
      "claimId": "interaction:rtg-2026:m27:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:3a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:3b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:i4:3c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-01:i5:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-01:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-01:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-01:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-02:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-02:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-02:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-02:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:i4:f",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-02:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-02:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-02:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-03:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-03:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m27:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m27:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "token:rtg-2026:m27:aula-03:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m27:aula-03:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "token:rtg-2026:m27:aula-03:i4:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "token:rtg-2026:m27:aula-03:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m27:aula-03:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:i5:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m27:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i3:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-04:i4:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m27:aula-04:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-04:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m27:aula-04:i4:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-04:i4:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-04:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-hip",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-ageing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:pmc-hearing"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m27:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m27:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "token:rtg-2026:m27:aula-05:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m27:aula-05:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m27:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m27:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "token:rtg-2026:m27:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-05:i3:7",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:i5:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-06:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-06:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "group:rtg-2026:m27:aula-06:i2:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "item:rtg-2026:m27:aula-06:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "region:rtg-2026:m27:aula-06:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m27:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:i4:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-06:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m27:aula-06:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m27:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "step:rtg-2026:m27:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield",
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:who-falls",
        "source:rtg-2026:m27:pmc-geri-chest"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m27:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped",
        "source:rtg-2026:m27:pmc-hearing",
        "source:rtg-2026:m27:r101-hip"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-shield"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "option:rtg-2026:m27:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m27:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m27:r101-ped"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m27:aula-01",
        "hook": "Complete a frase: com um bebê, eu converso sobretudo com...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-01"
          ],
          "prompt": "Com um bebê, com quem você conversa sobretudo, e de que jeito?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-01:rg:a",
              "label": "Com o bebê, em frases longas e técnicas"
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rg:b",
              "label": "Com ninguém, para o ambiente ficar quieto"
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rg:c",
              "label": "Com o responsável, explicando cada passo"
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rg:d",
              "label": "Com o responsável, mas só ao fim do exame"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-01:rg:c",
          "feedback": {
            "correct": "Isso: o responsável recebe a explicação de cada passo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-01"
          ],
          "prompt": "Uma avó quer entrar na sala para acalmar o neto. Qual é a resposta do estudante?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-01:rt:a",
              "label": "Entre, avó sempre pode ficar na sala."
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rt:b",
              "label": "Vou confirmar com a equipe o papel e a proteção."
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rt:c",
              "label": "Melhor esperar fora, sem perguntar à equipe."
            },
            {
              "id": "option:rtg-2026:m27:aula-01:rt:d",
              "label": "Entre, mas só depois do primeiro disparo."
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-01:rt:b",
          "feedback": {
            "correct": "Isso: quem fica tem papel combinado com a equipe e proteção.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m27:aula-02",
        "hook": "Complete a frase: se a criança continua se mexendo, eu primeiro...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-02"
          ],
          "prompt": "A criança continua se mexendo mesmo com a faixa. Qual é o primeiro passo do estudante?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-02:rg:a",
              "label": "Apertar a faixa até ela parar"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rg:b",
              "label": "Pedir a um paciente que ajude a segurar"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rg:c",
              "label": "Segurar o campo de luz com a mão"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rg:d",
              "label": "Descrever à equipe e esperar a decisão"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-02:rg:d",
          "feedback": {
            "correct": "Isso: descrever e aguardar, porque quem escolhe o recurso é a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-02"
          ],
          "prompt": "O pai quer segurar o filho, está sem avental e com a mão perto do campo. O que o estudante faz?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-02:rt:a",
              "label": "Deixa, pois ele é o pai e conhece o filho"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rt:b",
              "label": "Avisa a equipe antes: avental e mão fora do feixe"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rt:c",
              "label": "Mede o tempo e dispara, para não demorar"
            },
            {
              "id": "option:rtg-2026:m27:aula-02:rt:d",
              "label": "Pede que ele espere no corredor sozinho, sem avisar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-02:rt:b",
          "feedback": {
            "correct": "Isso: avental e mãos fora do feixe são combinados com a equipe antes da exposição.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m27:aula-03",
        "hook": "Complete a frase: o campo se ajusta à região de interesse e não além dos limites da...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-03"
          ],
          "prompt": "Qual é o objetivo de ajustar o campo à região de interesse numa criança?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-03:rg:a",
              "label": "Deixar a criança parada sem apoio"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rg:b",
              "label": "Expor só a região que o pedido inclui"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rg:c",
              "label": "Dispensar a conferência do campo de luz"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rg:d",
              "label": "Trocar o exame por outro mais curto"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-03:rg:b",
          "feedback": {
            "correct": "Isso: o campo cobre só a região de interesse.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-03"
          ],
          "prompt": "Duda abre o campo grande \"por garantia\" numa criança. O que você sugere a ela?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-03:rt:a",
              "label": "Deixar assim, pois é mais seguro"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rt:b",
              "label": "Fechar o campo mais ainda, até sumir da imagem"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rt:c",
              "label": "Dispensar o campo de luz e disparar"
            },
            {
              "id": "option:rtg-2026:m27:aula-03:rt:d",
              "label": "Ajustar o campo à região que o protocolo define"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-03:rt:d",
          "feedback": {
            "correct": "Isso: campo ajustado à região do protocolo, conferido no campo de luz.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m27:aula-04",
        "hook": "Complete a frase: para quem se equilibra mal, o caminho fica livre de...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-04"
          ],
          "prompt": "Qual destas ações ajuda uma pessoa idosa que se equilibra mal?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-04:rg:a",
              "label": "Tirar do caminho o tapete solto e os obstáculos"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rg:b",
              "label": "Pedir que ela se apresse para o exame durar menos"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rg:c",
              "label": "Afastar o apoio para ela não se acostumar"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rg:d",
              "label": "Deixar o tapete no caminho para amortecer"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-04:rg:a",
          "feedback": {
            "correct": "Isso: caminho livre, sem tapete solto, reduz o risco de queda.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:who-falls"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-04"
          ],
          "prompt": "Uma pessoa idosa de pele fina precisa mudar de posição na mesa. O que o estudante faz?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-04:rt:a",
              "label": "Puxa pelo braço, que é mais rápido"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rt:b",
              "label": "Pede que ela se vire sozinha e depressa"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rt:c",
              "label": "Move devagar, com cuidado, com apoio da equipe"
            },
            {
              "id": "option:rtg-2026:m27:aula-04:rt:d",
              "label": "Dispensa a mudança de posição por conta própria"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-04:rt:c",
          "feedback": {
            "correct": "Isso: mover devagar e com cuidado protege a pele frágil.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-hip"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m27:aula-05",
        "hook": "Complete a frase: depois que a equipe decide o exame, eu mantenho o abdome fora do...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-05"
          ],
          "prompt": "O que o cuidado com o abdome pede da posição e do campo, depois da decisão da equipe?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-05:rg:a",
              "label": "Abrir o campo, por garantia, para nada ficar de fora"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rg:b",
              "label": "Dispensar a conferência do campo de luz na hora"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rg:c",
              "label": "Manter o abdome fora do feixe, com o campo fechado à região"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rg:d",
              "label": "Trocar o exame, se o campo parecer grande demais"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-05:rg:c",
          "feedback": {
            "correct": "Isso: posição e campo fechados à região mantêm o abdome fora do feixe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-shield"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-05"
          ],
          "prompt": "Uma colega diz que vai adiar o exame da gestante, por precaução. O que você observa?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-05:rt:a",
              "label": "Está certo, adiar é sempre mais seguro"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rt:b",
              "label": "A decisão de adiar é da equipe, e não de um estudante"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rt:c",
              "label": "Adiar só vale se ela concordar"
            },
            {
              "id": "option:rtg-2026:m27:aula-05:rt:d",
              "label": "Você mesmo troca o exame, para a colega não adiar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-05:rt:b",
          "feedback": {
            "correct": "Isso: fazer, adiar ou trocar o exame é decisão da equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-shield"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m27:aula-06",
        "hook": "Complete a frase: na dúvida, eu paro, descrevo e...",
        "guided": {
          "id": "recovery-item:rtg-2026:m27:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-06"
          ],
          "prompt": "Diante de dúvida sobre um desses pacientes, qual é o passo do estudante?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-06:rg:a",
              "label": "Decidir sozinho o que fazer, para ganhar tempo"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rg:b",
              "label": "Esperar a dúvida passar sozinha, sem avisar"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rg:c",
              "label": "Parar, descrever o que vê e pedir apoio à equipe"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rg:d",
              "label": "Seguir o exame e anotar a dúvida depois"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-06:rg:c",
          "feedback": {
            "correct": "Isso: parar, descrever e pedir apoio é o passo do estudante.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-shield"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m27:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m27:aula-06"
          ],
          "prompt": "Um bebê chega com o pai, que aperta a faixa \"para garantir\". O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m27:aula-06:rt:a",
              "label": "Deixa, pois o pai conhece o filho"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rt:b",
              "label": "Aperta mais, para o bebê não se mexer"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rt:c",
              "label": "Pede que ele afrouxe e avisa a equipe"
            },
            {
              "id": "option:rtg-2026:m27:aula-06:rt:d",
              "label": "Retira a faixa e segura o bebê sem avental"
            }
          ],
          "correctOptionId": "option:rtg-2026:m27:aula-06:rt:c",
          "feedback": {
            "correct": "Isso: afrouxar e avisar a equipe, porque a faixa não pode apertar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m27:r101-ped"
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
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "6c5b2dca073b09704c55051613dfd404c2166d237b95827c78ce7d2c74c19d8b"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
