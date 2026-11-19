// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M17: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m17",
  "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a",
  "trackId": "track:rtg-2026:m17",
  "unitId": "unit:rtg-2026:m17",
  "contentVersion": "rtg-2026-m17-v1",
  "competencyIds": [
    "competency:rtg-2026:m17:aula-01",
    "competency:rtg-2026:m17:aula-02",
    "competency:rtg-2026:m17:aula-03",
    "competency:rtg-2026:m17:aula-04",
    "competency:rtg-2026:m17:aula-05",
    "competency:rtg-2026:m17:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m17:esr-efrs-seguranca-2019",
      "title": "Patient Safety in Medical Imaging: a joint paper of the ESR and the EFRS",
      "publisher": "European Society of Radiology e European Federation of Radiographer Societies, Insights into Imaging (2019)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6449408/",
      "accessedAt": "2026-11-19",
      "use": "cc-by-4.0",
      "licenseNote": "CC BY 4.0. Atribuição: ESR e EFRS (2019). Síntese e atividades originais em português; não é tradução; sem endosso dos autores."
    },
    {
      "id": "source:rtg-2026:m17:vic-quedas-hospital",
      "title": "Falls (older people in hospital)",
      "publisher": "Departamento de Saúde do governo de Victoria, Austrália",
      "url": "https://health.vic.gov.au/older-people-in-hospital/falls-mobility-and-self-care/falls",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para perigos do ambiente, freios travados e chamada de ajuda, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
      "title": "Patients’ Instability, Emergency Response, and Outcomes in the Radiology Department",
      "publisher": "American Journal of Critical Care (2011), via PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3667404",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para os gatilhos de chamada e a chamada por qualquer pessoa, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023",
      "title": "Radiographers’ decision-making processes in the movement of pain-afflicted adult trauma patients in planar diagnostic imaging",
      "publisher": "Via PubMed Central (2023)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10500107/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para explicar o procedimento ao paciente e para os recursos de transferência, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m17:openstax-transferencia-2023",
      "title": "Clinical Nursing Skills, 9.3 Transferring Patients",
      "publisher": "OpenStax",
      "url": "https://openstax.org/books/clinical-nursing-skills/pages/9-3-transferring-patients",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Material CC BY-NC-SA 4.0 usado só para consulta de fatos: número de cuidadores e pedido de mais pessoal, sem aproveitar frase nem figura."
    },
    {
      "id": "source:rtg-2026:m17:bcit-transferencias-2015",
      "title": "Clinical Procedures for Safer Patient Care, 3.7 Patient Transfers",
      "publisher": "British Columbia Institute of Technology (BCIT), via eCampusOntario Pressbooks",
      "url": "https://ecampusontario.pressbooks.pub/clinicalskills/chapter/3-7-transfers-and-ambulation/",
      "accessedAt": "2026-11-19",
      "use": "cc-by-4.0",
      "licenseNote": "CC BY 4.0. Atribuição: BCIT (2015). Consultado para dois identificadores, número de pessoas, explicação, tubos no lugar, freios e conforto; síntese original, sem endosso."
    },
    {
      "id": "source:rtg-2026:m17:odeh-superficies-radiologia-2023",
      "title": "Radiology Department: A Potential Source of Multidrug-Resistant Microorganisms: A Cross-Sectional Study at Tertiary Hospital",
      "publisher": "Odeh, Abatli e Qadi, Canadian Journal of Infectious Diseases and Medical Microbiology (2023), via Europe PMC (PMC10749721)",
      "url": "https://europepmc.org/article/PMC/PMC10749721",
      "accessedAt": "2026-11-19",
      "use": "cc-by-4.0",
      "licenseNote": "CC BY 4.0. Atribuição: Odeh, Abatli e Qadi (2023). Consultado para teclados e maçanetas como superfícies tocadas pelas mãos; síntese original, sem endosso."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m17:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:bcit-transferencias-2015"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Quando a identificação falha",
            "body": "Hoje você vai conseguir parar e chamar a equipe quando a conferência de identidade não fecha, ou quando o paciente não pode responder.",
            "dialogue": {
              "setting": "Sala de tomografia simulada",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Seu Jorge chegou de maca, sonolento. A pulseira confere com a folha, mas ele só murmura quando eu o chamo."
                },
                {
                  "speaker": "duda",
                  "text": "Então já sabemos quem é, não? O nome na pulseira é o mesmo do pedido."
                },
                {
                  "speaker": "pixel",
                  "text": "Quando a pessoa não responde, o que da conferência fica faltando?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Quando a pessoa não confirma",
            "body": "A conferência de rotina pede que a pessoa diga nome completo e data de nascimento, e que você compare com a pulseira. Ela depende da resposta. Quando a pessoa está sonolenta, não responde ou está sem pulseira, a conferência não se completa. O nome na placa do leito não a substitui, porque a placa pode estar errada. O serviço define como confirmar nesses casos: você para, descreve o que falta e chama a equipe. E a identidade é conferida antes de cada procedimento, não só na recepção.",
            "keyPoints": [
              "Sem resposta ou sem pulseira, a conferência não está completa.",
              "O serviço define como confirmar quem não responde."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na recepção simulada, duas pacientes se chamam Lima de sobrenome e esperam lado a lado. Qual conferência separa uma da outra?"
            },
            "help": "Pense nos dados que só aquela pessoa pode dizer sobre si mesma.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Os dois dados, comparados com a pulseira de cada uma, separam as duas pacientes.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na recepção simulada, duas pacientes se chamam Lima de sobrenome e esperam lado a lado. Qual conferência separa uma da outra?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-01:i1:a",
                  "label": "Chamar “Dona Lima” e ver quem levanta primeiro da cadeira",
                  "explanation": "Quem levanta primeiro pode ser a outra Lima: chamar só pelo sobrenome não separa as duas."
                },
                {
                  "id": "option:rtg-2026:m17:aula-01:i1:b",
                  "label": "Pedir nome completo e data de nascimento de cada uma e comparar com a pulseira",
                  "explanation": "Os dois dados, comparados com a pulseira de cada uma, separam as duas pacientes."
                },
                {
                  "id": "option:rtg-2026:m17:aula-01:i1:c",
                  "label": "Chamar a que chegou primeiro, porque a fila segue a ordem de chegada",
                  "explanation": "A ordem de chegada não identifica ninguém: a conferência é feita com os dados da pessoa."
                },
                {
                  "id": "option:rtg-2026:m17:aula-01:i1:d",
                  "label": "Perguntar a uma delas qual é o sobrenome da outra, para confirmar",
                  "explanation": "Uma paciente não confirma a identidade da outra: cada uma é conferida pelos próprios dados."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as quatro fontes que entram na conferência de identidade, tocando na ficha e no ponto da cena."
            },
            "help": "Comece pelo que está preso ao próprio paciente.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: pulseira, pedido, tela e a fala do paciente se comparam, e a placa do leito não entra.",
              "incorrect": "Alguma ficha está no lugar errado: refaça, lembrando o que cada fonte traz sobre a pessoa."
            },
            "payload": {
              "prompt": "Rotule as quatro fontes que entram na conferência de identidade, tocando na ficha e no ponto da cena.",
              "imageRef": "diagram:conferencia-de-identidade",
              "points": [
                {
                  "id": "point:rtg-2026:m17:aula-01:i2:1",
                  "x": 0.419,
                  "y": 0.6,
                  "where": "sobre o braço do paciente deitado, a faixa azul curta",
                  "correctLabelId": "label:rtg-2026:m17:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m17:aula-01:i2:2",
                  "x": 0.637,
                  "y": 0.542,
                  "where": "na mão do profissional de pé, uma folha com linhas",
                  "correctLabelId": "label:rtg-2026:m17:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m17:aula-01:i2:3",
                  "x": 0.909,
                  "y": 0.421,
                  "where": "alto, à direita, o painel azul em cima de um suporte",
                  "correctLabelId": "label:rtg-2026:m17:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m17:aula-01:i2:4",
                  "x": 0.156,
                  "y": 0.575,
                  "where": "à esquerda, a cabeça redonda apoiada na maca",
                  "correctLabelId": "label:rtg-2026:m17:aula-01:i2:4"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m17:aula-01:i2:4",
                  "label": "Fala do paciente"
                },
                {
                  "id": "label:rtg-2026:m17:aula-01:i2:1",
                  "label": "Pulseira no punho"
                },
                {
                  "id": "label:rtg-2026:m17:aula-01:i2:2",
                  "label": "Pedido impresso"
                },
                {
                  "id": "label:rtg-2026:m17:aula-01:i2:3",
                  "label": "Registro na tela"
                },
                {
                  "id": "label:rtg-2026:m17:aula-01:i2:5",
                  "label": "Placa acima do leito"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Duda está com você na sala. Ajude-a a decidir o que fazer com Seu Jorge, que chegou sonolento e não responde ao nome."
            },
            "help": "Pense em quem decide como confirmar a identidade quando o paciente não responde.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: sem a resposta do paciente, você para e a equipe confirma do jeito que o serviço define.",
              "incorrect": "Reveja os turnos: quando a conferência não fecha, a palavra de terceiros não a substitui e a equipe é chamada."
            },
            "payload": {
              "prompt": "Duda está com você na sala. Ajude-a a decidir o que fazer com Seu Jorge, que chegou sonolento e não responde ao nome.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m17:aula-01:i3:1",
                  "line": "Seu Jorge está sonolento e só murmura. A pulseira confere com a folha. Posso começar o exame?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:1a",
                      "label": "Pode, a pulseira e a folha já dizem quem ele é.",
                      "reply": "Então vou levá-lo para a mesa agora."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:1b",
                      "label": "Pode, desde que ele murmure algo quando você o chamar pelo nome.",
                      "reply": "Vou chamá-lo pelo nome e ver se ele murmura."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:1c",
                      "label": "Ainda não: falta a resposta dele, vamos pedir apoio.",
                      "reply": "Combinado, aviso a equipe e espero a orientação."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-01:i3:1c"
                },
                {
                  "id": "turn:rtg-2026:m17:aula-01:i3:2",
                  "line": "A acompanhante diz: “É ele sim, o Jorge, pode fazer o exame”. O que dizemos a ela?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:2a",
                      "label": "Agradecer e dizer que a equipe confirma a identidade.",
                      "reply": "Tudo bem, esperamos a equipe."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:2b",
                      "label": "Aceitar a palavra dela e começar, já que ela conhece bem o paciente.",
                      "reply": "Vamos começar o exame agora, então."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-01:i3:2c",
                      "label": "Pedir que ela escreva o nome dele na folha do pedido e assine.",
                      "reply": "Pego uma caneta para ela escrever, então."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-01:i3:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada situação de chegada no grupo certo."
            },
            "help": "Observe se a pessoa responde e se a pulseira existe e concorda.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou a conferência que fecha daquela que precisa da equipe.",
              "incorrect": "Pergunte de cada situação: os dois lados da conferência estão completos, ou falta algo?"
            },
            "payload": {
              "prompt": "Classifique cada situação de chegada no grupo certo.",
              "categories": [
                {
                  "id": "group:rtg-2026:m17:aula-01:i4:a",
                  "label": "Conferir e seguir"
                },
                {
                  "id": "group:rtg-2026:m17:aula-01:i4:b",
                  "label": "Parar e pedir apoio"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m17:aula-01:i4:5",
                  "label": "Pulseira com o sobrenome escrito diferente do pedido",
                  "categoryId": "group:rtg-2026:m17:aula-01:i4:b"
                },
                {
                  "id": "item:rtg-2026:m17:aula-01:i4:4",
                  "label": "Punho do paciente sem pulseira",
                  "categoryId": "group:rtg-2026:m17:aula-01:i4:b"
                },
                {
                  "id": "item:rtg-2026:m17:aula-01:i4:2",
                  "label": "Paciente conferido na recepção, prestes a iniciar o exame",
                  "categoryId": "group:rtg-2026:m17:aula-01:i4:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-01:i4:1",
                  "label": "Paciente diz nome e nascimento que batem com a pulseira",
                  "categoryId": "group:rtg-2026:m17:aula-01:i4:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-01:i4:3",
                  "label": "Paciente sonolento, que não consegue responder",
                  "categoryId": "group:rtg-2026:m17:aula-01:i4:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Uma paciente adormecida chega de maca à ressonância simulada. Julgue cada afirmação sobre a conferência."
            },
            "help": "Pergunte de cada frase se ela completa a conferência ou só parece completar.",
            "type": "true-false",
            "feedback": {
              "correct": "Você tratou a conferência incompleta como motivo de parar, e não de adivinhar.",
              "incorrect": "Releia o conceito: a conferência só fecha com a pessoa e a pulseira, e a dúvida vai para a equipe."
            },
            "payload": {
              "prompt": "Uma paciente adormecida chega de maca à ressonância simulada. Julgue cada afirmação sobre a conferência.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m17:aula-01:i5:1",
                  "text": "A pulseira conferida com a folha já completa a conferência, mesmo sem a resposta dela.",
                  "isTrue": false,
                  "explanation": "Falta a parte que depende da paciente: sem ela, você descreve o que falta e chama a equipe."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-01:i5:2",
                  "text": "Faltando a resposta da paciente, você descreve o que falta e chama a equipe.",
                  "isTrue": true,
                  "explanation": "Descrever e pedir apoio é a atitude certa quando a conferência não se completa."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-01:i5:3",
                  "text": "O cartão com o nome preso à maca vale como prova de quem está deitada.",
                  "isTrue": false,
                  "explanation": "O nome na maca ou no leito pode estar errado: ele não substitui a conferência com a pessoa e a pulseira."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-01:i5:4",
                  "text": "Mesmo já conferida antes, a paciente é conferida de novo antes do procedimento.",
                  "isTrue": true,
                  "explanation": "A confirmação vale antes de cada procedimento, e não só na primeira recepção."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe quando a conferência não fecha",
            "body": "Agora você reconhece quando a pessoa não responde ou está sem pulseira, sabe que placa e palavra de terceiros não substituem a conferência e chama a equipe em vez de supor.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Parar para confirmar custa um minuto. Supor pode custar muito mais."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m17:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:vic-quedas-hospital",
          "source:rtg-2026:m17:bcit-transferencias-2015"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Antes que alguém caia",
            "body": "Hoje você vai conseguir reconhecer o que favorece uma queda na sala e corrigir o que cabe a você antes de mover o paciente.",
            "dialogue": {
              "setting": "Sala de exame, antes da transferência",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Dona Marta vai passar da maca para a mesa. Eu ia pedir que ela se levantasse logo."
                },
                {
                  "speaker": "caio",
                  "text": "Calma. Olhe a sala antes de olhar para ela. O que está solto, escorregando ou esticado?"
                },
                {
                  "speaker": "pixel",
                  "text": "Uma queda quase sempre começa antes de a pessoa se mexer. Onde estão os sinais?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Olhe a sala antes de mover",
            "body": "Queda no hospital nasce da mistura entre a pessoa e o ambiente. Do lado do ambiente, são perigos a bagunça, tubos e líquidos no chão, o equipamento que precisa de reparo e as rodas sem freio travado. Antes de mover, você olha a sala e corrige o que cabe a você: trava a roda e tira o obstáculo. Soro, sonda e dreno precisam estar no lugar, ou podem se soltar no movimento: se uma linha está esticada, você chama a equipe. Na cena desta aula, a roda travada tem o bloco do freio pousado sobre ela.",
            "keyPoints": [
              "Perigo no ambiente se corrige antes de mover.",
              "Linha, sonda e dreno ficam com a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Marta chega à sala trazida de outro setor. Qual conferência da aula anterior continua valendo antes de qualquer procedimento?"
            },
            "help": "Lembre o que se compara e com quem.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Os dois dados, ditos pela pessoa, comparados com a pulseira: é a conferência que se repete.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Marta chega à sala trazida de outro setor. Qual conferência da aula anterior continua valendo antes de qualquer procedimento?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-02:i1:a",
                  "label": "Conferir o nome na placa que está acima do leito",
                  "explanation": "A placa pode estar errada, e por isso ela não vale como conferência."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i1:b",
                  "label": "Comparar nome e nascimento ditos por ela com a pulseira",
                  "explanation": "Os dois dados, ditos pela pessoa, comparados com a pulseira: é a conferência que se repete."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i1:c",
                  "label": "Confiar na conferência feita na recepção e seguir",
                  "explanation": "Conferir antes de cada procedimento é regra: a recepção sozinha não basta."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i1:d",
                  "label": "Pedir à acompanhante que diga o nome e seguir",
                  "explanation": "A fala da acompanhante não substitui a conferência com a paciente e a pulseira."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-02:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada situação da sala: algo que você corrige agora ou que pede a equipe."
            },
            "help": "O que está ligado ao corpo do paciente não é seu para mexer.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que é do ambiente do que envolve tubos ligados ao paciente.",
              "incorrect": "Pergunte de cada item: é algo da sala que você arruma, ou algo ligado ao paciente?"
            },
            "payload": {
              "prompt": "Classifique cada situação da sala: algo que você corrige agora ou que pede a equipe.",
              "categories": [
                {
                  "id": "group:rtg-2026:m17:aula-02:i2:a",
                  "label": "Eu corrijo agora"
                },
                {
                  "id": "group:rtg-2026:m17:aula-02:i2:b",
                  "label": "Chamo a equipe"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m17:aula-02:i2:3",
                  "label": "Líquido derramado no piso ao lado da mesa",
                  "categoryId": "group:rtg-2026:m17:aula-02:i2:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-02:i2:5",
                  "label": "Bolsa de sonda caída no chão, ainda ligada",
                  "categoryId": "group:rtg-2026:m17:aula-02:i2:b"
                },
                {
                  "id": "item:rtg-2026:m17:aula-02:i2:1",
                  "label": "Roda da maca sem freio, perto da mesa",
                  "categoryId": "group:rtg-2026:m17:aula-02:i2:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-02:i2:2",
                  "label": "Cadeira parada entre a maca e a mesa",
                  "categoryId": "group:rtg-2026:m17:aula-02:i2:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-02:i2:4",
                  "label": "Dreno preso à grade da maca",
                  "categoryId": "group:rtg-2026:m17:aula-02:i2:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Uma parte é seu cuidado, a outra é de quem cuida das linhas.",
            "type": "cloze",
            "feedback": {
              "correct": "Isso mesmo: roda travada você resolve, e a linha de soro fica com a equipe.",
              "incorrect": "Pense no que mantém a maca no lugar e em quem cuida das linhas do paciente."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "As rodas da maca ficam ",
                ", e a linha de soro esticada pede que você chame a ",
                "."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m17:aula-02:i3:1",
                  "label": "travadas"
                },
                {
                  "id": "token:rtg-2026:m17:aula-02:i3:4",
                  "label": "paciente"
                },
                {
                  "id": "token:rtg-2026:m17:aula-02:i3:3",
                  "label": "soltas"
                },
                {
                  "id": "token:rtg-2026:m17:aula-02:i3:5",
                  "label": "sala"
                },
                {
                  "id": "token:rtg-2026:m17:aula-02:i3:2",
                  "label": "equipe"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m17:aula-02:i3:1",
                  "correctTokenId": "token:rtg-2026:m17:aula-02:i3:1"
                },
                {
                  "id": "blank:rtg-2026:m17:aula-02:i3:2",
                  "correctTokenId": "token:rtg-2026:m17:aula-02:i3:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Encontre os riscos: A maca está ao lado da mesa. Toque em todas as situações que favorecem uma queda ou um puxão."
            },
            "help": "Procure o que pode se mover sob o peso e o que pode se soltar do corpo.",
            "type": "risk-hunt",
            "feedback": {
              "correct": "Você achou os dois pontos de risco e deixou de fora o que está em ordem.",
              "incorrect": "Releia a cena: algum risco ficou de fora, ou algo em ordem foi marcado."
            },
            "payload": {
              "prompt": "A maca está ao lado da mesa. Toque em todas as situações que favorecem uma queda ou um puxão.",
              "imageRef": "diagram:transferencia-maca-mesa",
              "regions": [
                {
                  "id": "region:rtg-2026:m17:aula-02:i4:1",
                  "label": "Roda da maca com o bloco azul pousado",
                  "x": 0.044,
                  "y": 0.763,
                  "width": 0.1,
                  "height": 0.2,
                  "explanation": "Com o bloco pousado, essa roda está travada: a maca não se afasta quando a pessoa se apoia."
                },
                {
                  "id": "region:rtg-2026:m17:aula-02:i4:2",
                  "label": "Roda da maca com o bloco erguido",
                  "x": 0.375,
                  "y": 0.763,
                  "width": 0.1,
                  "height": 0.2,
                  "explanation": "Com o bloco erguido a roda está solta: a maca pode se afastar quando a pessoa se apoia nela."
                },
                {
                  "id": "region:rtg-2026:m17:aula-02:i4:3",
                  "label": "Prancha encostada no pedestal da mesa",
                  "x": 0.734,
                  "y": 0.646,
                  "width": 0.12,
                  "height": 0.25,
                  "explanation": "Encostada no pedestal, fora da passagem e fora do chão, a prancha não atrapalha: ela só entra se o serviço a usar."
                },
                {
                  "id": "region:rtg-2026:m17:aula-02:i4:4",
                  "label": "Linha do soro esticada até a paciente",
                  "x": 0.602,
                  "y": 0.371,
                  "width": 0.14,
                  "height": 0.1,
                  "explanation": "A linha esticada pode soltar o acesso quando a paciente se mexe: avise a equipe, sem mexer na linha."
                }
              ],
              "riskRegionIds": [
                "region:rtg-2026:m17:aula-02:i4:2",
                "region:rtg-2026:m17:aula-02:i4:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Seu Jorge, de maca, vai passar para a mesa de tomografia. Marque todas as ações que cabem a você antes de qualquer movimento."
            },
            "help": "Separe o que é da sala do que é do paciente.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou o cuidado com o ambiente e deixou a linha e o movimento com a equipe.",
              "incorrect": "Releia o conceito: você arruma o ambiente, e a linha do paciente e o movimento ficam com a equipe."
            },
            "payload": {
              "prompt": "Seu Jorge, de maca, vai passar para a mesa de tomografia. Marque todas as ações que cabem a você antes de qualquer movimento.",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:a",
                  "label": "Pedir que ele se levante sozinho, para ganhar tempo",
                  "explanation": "Levantar sozinho aumenta o risco: o movimento só começa com a equipe."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:b",
                  "label": "Soltar o soro do braço dele para facilitar a passagem",
                  "explanation": "Soltar o acesso não cabe ao estudante: a linha fica com a equipe."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:c",
                  "label": "Travar as rodas da maca antes de qualquer apoio",
                  "explanation": "Rodas travadas mantêm a maca no lugar quando ele se apoia."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:d",
                  "label": "Começar a passagem antes de a equipe chegar",
                  "explanation": "A passagem começa com a equipe presente: sozinho, o movimento fica sem apoio."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:e",
                  "label": "Tirar do chão o que estiver no caminho",
                  "explanation": "Tirar obstáculos e pontos de tropeço é o seu cuidado com o ambiente."
                },
                {
                  "id": "option:rtg-2026:m17:aula-02:i5:f",
                  "label": "Avisar a equipe se a linha de soro estiver esticada",
                  "explanation": "A linha esticada pode puxar o acesso, e quem cuida dela é a equipe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m17:aula-02:i5:c",
                "option:rtg-2026:m17:aula-02:i5:e",
                "option:rtg-2026:m17:aula-02:i5:f"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você olha a sala antes de mover",
            "body": "Agora você reconhece rodas soltas, obstáculos, líquidos no chão e linhas esticadas, corrige o que cabe a você e chama a equipe quando o risco envolve o que está ligado ao paciente.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "A queda mais fácil de evitar é a que a sala deixaria acontecer."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m17:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:vic-quedas-hospital",
          "source:rtg-2026:m17:bcit-transferencias-2015",
          "source:rtg-2026:m17:openstax-transferencia-2023",
          "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Passar da maca para a mesa",
            "body": "Hoje você vai conseguir ordenar uma transferência feita em equipe, cuidando das rodas, das linhas e do acesso.",
            "dialogue": {
              "setting": "Sala de tomografia, hora da transferência",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje a equipe é você, o Caio e a Duda. Eu só observo."
                },
                {
                  "speaker": "caio",
                  "text": "Dona Marta tem soro no braço e quer ajudar a se mexer. Quem conta o movimento?"
                },
                {
                  "speaker": "pixel",
                  "text": "Antes de contar: o que cada um confere, e em que ordem?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Transferência é trabalho de equipe",
            "body": "Passar da maca para a mesa é trabalho de equipe: o serviço define o método e quantas pessoas. Na ordem ensinada nesta aula: explicar à pessoa o que vai acontecer e combinar o sinal, travar as rodas da maca, conferir com a equipe que soro e sonda estão no lugar e fora do caminho, deslizar em conjunto no sinal e, ao fim, conferir o conforto da pessoa. A prancha, quando usada, faz a ponte entre maca e mesa.",
            "keyPoints": [
              "Nunca sozinho: a equipe faz o movimento.",
              "Rodas travadas e linhas no lugar antes do deslize."
            ],
            "visual": "transferencia-maca-mesa"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, qual situação da cena pode soltar o acesso do braço quando a pessoa se mexe?"
            },
            "help": "Lembre o que, na cena da aula anterior, você levou à equipe.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A linha esticada pode soltar o acesso, e por isso a equipe a ajusta antes do movimento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, qual situação da cena pode soltar o acesso do braço quando a pessoa se mexe?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-03:i1:a",
                  "label": "Uma roda travada da maca encostada na mesa",
                  "explanation": "A roda travada mantém a maca no lugar: não mexe no acesso."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i1:b",
                  "label": "A linha de soro esticada até o braço",
                  "explanation": "A linha esticada pode soltar o acesso, e por isso a equipe a ajusta antes do movimento."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i1:c",
                  "label": "A prancha de transferência guardada no pedestal",
                  "explanation": "A prancha guardada não está ligada à pessoa e não mexe no acesso."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i1:d",
                  "label": "A grade lateral abaixada da maca, ao lado da paciente",
                  "explanation": "A grade lateral não está ligada ao acesso do braço."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-03:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene os passos da transferência da maca para a mesa, na ordem ensinada nesta aula."
            },
            "help": "O deslize é o passo que só pode vir quando tudo o resto está pronto.",
            "type": "ordering",
            "feedback": {
              "correct": "Você montou a sequência: combinar, travar, conferir as linhas, deslizar e cuidar do conforto.",
              "incorrect": "Reveja a sequência: o deslize só vem depois de combinar, travar as rodas e conferir as linhas."
            },
            "payload": {
              "prompt": "Ordene os passos da transferência da maca para a mesa, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m17:aula-03:i2:4",
                  "label": "Deslizar a pessoa em conjunto, no sinal combinado"
                },
                {
                  "id": "item:rtg-2026:m17:aula-03:i2:5",
                  "label": "Ajeitar a pessoa na mesa e conferir o conforto dela"
                },
                {
                  "id": "item:rtg-2026:m17:aula-03:i2:2",
                  "label": "Travar as rodas da maca"
                },
                {
                  "id": "item:rtg-2026:m17:aula-03:i2:1",
                  "label": "Explicar à pessoa o que vai acontecer e combinar o sinal com a equipe"
                },
                {
                  "id": "item:rtg-2026:m17:aula-03:i2:3",
                  "label": "Conferir com a equipe que soro e sonda estão no lugar e fora do caminho"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m17:aula-03:i2:1",
                "item:rtg-2026:m17:aula-03:i2:2",
                "item:rtg-2026:m17:aula-03:i2:3",
                "item:rtg-2026:m17:aula-03:i2:4",
                "item:rtg-2026:m17:aula-03:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: A equipe está pronta para o deslize. Toque na roda da maca que ainda não está travada."
            },
            "help": "Compare como o bloco aparece em cada roda.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: essa roda está com o bloco erguido, ou seja, solta, e precisa ser travada.",
              "incorrect": "Compare as duas rodas: uma tem o bloco pousado, e a outra, não."
            },
            "payload": {
              "prompt": "A equipe está pronta para o deslize. Toque na roda da maca que ainda não está travada.",
              "imageRef": "diagram:transferencia-maca-mesa",
              "regions": [
                {
                  "id": "region:rtg-2026:m17:aula-03:i3:1",
                  "label": "Roda sob a cabeceira da maca",
                  "x": 0.044,
                  "y": 0.763,
                  "width": 0.1,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m17:aula-03:i3:2",
                  "label": "Roda do lado dos pés da maca",
                  "x": 0.375,
                  "y": 0.763,
                  "width": 0.1,
                  "height": 0.2
                },
                {
                  "id": "region:rtg-2026:m17:aula-03:i3:3",
                  "label": "Vão entre maca e mesa",
                  "x": 0.463,
                  "y": 0.533,
                  "width": 0.08,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m17:aula-03:i3:4",
                  "label": "Prancha de transferência",
                  "x": 0.734,
                  "y": 0.646,
                  "width": 0.12,
                  "height": 0.25
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m17:aula-03:i3:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Quem resolve a linha do soro, e o que se faz antes de deslizar?",
            "type": "case-decision",
            "feedback": {
              "correct": "Pausar e avisar deixa quem cuida da linha ajustá-la antes do deslize.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "A equipe está pronta, e você vai começar o deslize de Dona Marta para a mesa. Você vê que a linha do soro está esticada entre o suporte e o braço dela. Ninguém falou sobre isso. O Caio está do outro lado da maca.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-03:i4:a",
                  "label": "Deslizar logo, antes que a paciente perceba a linha",
                  "explanation": "Deslizar com a linha esticada pode soltar o acesso, e não cabe a você decidir seguir assim."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i4:b",
                  "label": "Soltar a linha do braço de Dona Marta para facilitar",
                  "explanation": "Soltar o acesso não cabe ao estudante: a linha fica com a equipe."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i4:c",
                  "label": "Pedir à paciente que segure a linha com a mão livre",
                  "explanation": "Passar a tarefa à paciente não resolve o risco e mantém a linha esticada."
                },
                {
                  "id": "option:rtg-2026:m17:aula-03:i4:d",
                  "label": "Pedir uma pausa e avisar a equipe sobre a linha esticada",
                  "explanation": "Pausar e avisar deixa quem cuida da linha ajustá-la antes do deslize."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-03:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Dona Marta já está na mesa e o exame acabou. Julgue cada afirmação sobre a volta para a maca."
            },
            "help": "O que valeu na ida também vale na volta?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve o cuidado e o trabalho em equipe também na volta.",
              "incorrect": "Releia o conceito: a regra da ida vale na volta, e transferência nunca é de uma pessoa só."
            },
            "payload": {
              "prompt": "Dona Marta já está na mesa e o exame acabou. Julgue cada afirmação sobre a volta para a maca.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m17:aula-03:i5:1",
                  "text": "Na volta para a maca, as rodas da maca precisam estar travadas de novo.",
                  "isTrue": true,
                  "explanation": "A maca deve estar firme também na volta, antes de a pessoa se apoiar."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-03:i5:2",
                  "text": "Como a pessoa já passou uma vez, o segundo deslize dispensa explicar o que vai acontecer.",
                  "isTrue": false,
                  "explanation": "Explicar antes de cada movimento vale também na volta: a pessoa precisa saber o que vem."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-03:i5:3",
                  "text": "Se faltar gente na equipe, o estudante faz o deslize sozinho para não atrasar o exame.",
                  "isTrue": false,
                  "explanation": "Transferência é feita em equipe: faltando gente, o movimento espera e o apoio é pedido."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-03:i5:4",
                  "text": "Faltando pessoa ou material do método do serviço, a transferência espera e a equipe é chamada.",
                  "isTrue": true,
                  "explanation": "Esperar e pedir apoio evita o movimento improvisado, que é o que machuca."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe a ordem da transferência",
            "body": "Agora você ordena a transferência em equipe, trava as rodas, confere com a equipe as linhas antes do deslize e pede uma pausa quando a equipe ou o material não estão prontos.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "A pressa não faz parte de nenhum passo da transferência."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m17:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Limpar entre um paciente e outro",
            "body": "Hoje você vai conseguir apontar as superfícies da sala que a limpeza entre pacientes alcança.",
            "dialogue": {
              "setting": "Sala de raios X, entre dois pacientes",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A paciente já saiu. Eu limpo a mesa e pronto, né?"
                },
                {
                  "speaker": "caio",
                  "text": "A mesa é só uma. Pense em tudo o que a mão dela, ou a sua, tocou."
                },
                {
                  "speaker": "pixel",
                  "text": "Quais lugares da sala passam de mão em mão, de um paciente para o outro?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Limpar o que passou de mão em mão",
            "body": "Entre um paciente e o seguinte, as superfícies são limpas em todo atendimento, e não só quando há sujeira à vista. Apoio de queixo, suporte de tórax, marcadores, tubo e receptor podem se contaminar e levar microrganismos ao próximo paciente. Maçaneta e teclado do comando, que as suas mãos tocam depois do paciente, também entram na rotina. O serviço define o produto e o tempo de ação: você segue o protocolo, e não o cheiro ou a pressa.",
            "keyPoints": [
              "Limpa-se entre todos os pacientes, e não só quando há sujeira.",
              "O serviço define o produto e o tempo."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: A prancha de transferência tocou a paciente da transferência anterior. Antes de ser usada no próximo paciente, o que ela pede?"
            },
            "help": "Pense no que acontece com o que o paciente encosta.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Superfície que tocou o paciente entra na limpeza entre pacientes, do jeito que o serviço define.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "A prancha de transferência tocou a paciente da transferência anterior. Antes de ser usada no próximo paciente, o que ela pede?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-04:i1:a",
                  "label": "Nada, pois a prancha só desliza e não tem contato",
                  "explanation": "A prancha encosta na pessoa: o contato com ela entra na rotina de limpeza."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i1:b",
                  "label": "Ser limpa como as outras superfícies de contato, como o serviço define",
                  "explanation": "Superfície que tocou o paciente entra na limpeza entre pacientes, do jeito que o serviço define."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i1:c",
                  "label": "Ser virada de lado, para o paciente seguinte usar a outra face",
                  "explanation": "Virar a prancha não remove nada: a limpeza é que faz isso."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i1:d",
                  "label": "Esperar o fim do turno para a limpeza de todas as superfícies",
                  "explanation": "Esperar o fim do turno deixa a superfície passar de um paciente a outro."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Seu Jorge fez uma radiografia em pé, segurando-se com as mãos, e depois outra deitado. Toque nas duas superfícies em que ele se apoiou e que a limpeza precisa alcançar."
            },
            "help": "Siga o caminho dele na sala: primeiro em pé, depois deitado.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o apoio do receptor e a mesa receberam o contato direto dele e entram na limpeza.",
              "incorrect": "Procure onde as mãos dele ficaram em pé e onde o corpo ficou apoiado deitado."
            },
            "payload": {
              "prompt": "Seu Jorge fez uma radiografia em pé, segurando-se com as mãos, e depois outra deitado. Toque nas duas superfícies em que ele se apoiou e que a limpeza precisa alcançar.",
              "imageRef": "diagram:pontos-de-contato-da-sala",
              "regions": [
                {
                  "id": "region:rtg-2026:m17:aula-04:i2:1",
                  "label": "Maçaneta da porta",
                  "x": 0.069,
                  "y": 0.573,
                  "width": 0.1,
                  "height": 0.12
                },
                {
                  "id": "region:rtg-2026:m17:aula-04:i2:2",
                  "label": "Apoio do receptor vertical",
                  "x": 0.328,
                  "y": 0.357,
                  "width": 0.12,
                  "height": 0.12
                },
                {
                  "id": "region:rtg-2026:m17:aula-04:i2:3",
                  "label": "Mesa de exame",
                  "x": 0.447,
                  "y": 0.654,
                  "width": 0.3,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m17:aula-04:i2:4",
                  "label": "Manopla do tubo",
                  "x": 0.652,
                  "y": 0.108,
                  "width": 0.08,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m17:aula-04:i2:5",
                  "label": "Teclado do comando",
                  "x": 0.811,
                  "y": 0.646,
                  "width": 0.14,
                  "height": 0.1
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m17:aula-04:i2:2",
                "region:rtg-2026:m17:aula-04:i2:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada superfície: quem costuma tocá-la durante o atendimento."
            },
            "help": "Imagine onde a mão do paciente e a sua ficam.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o contato direto do contato que vem das mãos de quem opera.",
              "incorrect": "Pergunte de cada peça: quem toca nela durante o exame, o paciente ou quem opera?"
            },
            "payload": {
              "prompt": "Classifique cada superfície: quem costuma tocá-la durante o atendimento.",
              "categories": [
                {
                  "id": "group:rtg-2026:m17:aula-04:i3:a",
                  "label": "Tocada pelo paciente"
                },
                {
                  "id": "group:rtg-2026:m17:aula-04:i3:b",
                  "label": "Tocada por quem opera"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m17:aula-04:i3:4",
                  "label": "Teclado do comando",
                  "categoryId": "group:rtg-2026:m17:aula-04:i3:b"
                },
                {
                  "id": "item:rtg-2026:m17:aula-04:i3:2",
                  "label": "Barra de apoio do receptor vertical",
                  "categoryId": "group:rtg-2026:m17:aula-04:i3:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-04:i3:1",
                  "label": "Mesa de exame",
                  "categoryId": "group:rtg-2026:m17:aula-04:i3:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-04:i3:3",
                  "label": "Apoio de queixo",
                  "categoryId": "group:rtg-2026:m17:aula-04:i3:a"
                },
                {
                  "id": "item:rtg-2026:m17:aula-04:i3:5",
                  "label": "Manopla do tubo de raios X",
                  "categoryId": "group:rtg-2026:m17:aula-04:i3:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as ações da limpeza da sala entre um paciente e o seguinte."
            },
            "help": "Pense no que vale para qualquer paciente, e em quem define o produto.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou as superfícies e o protocolo, e deixou de fora a pressa e a aparência.",
              "incorrect": "Releia o conceito: limpa-se entre todos, nas superfícies de contato, com produto e tempo do serviço."
            },
            "payload": {
              "prompt": "Marque todas as ações da limpeza da sala entre um paciente e o seguinte.",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:a",
                  "label": "Limpar só quando houver sujeira visível",
                  "explanation": "A limpeza vale para todos os pacientes, e a sujeira nem sempre é visível."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:b",
                  "label": "Limpar a mesa e os apoios que o paciente tocou",
                  "explanation": "As superfícies de contato do paciente são o centro da limpeza."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:c",
                  "label": "Escolher o produto pelo cheiro mais forte",
                  "explanation": "O produto vem do protocolo do serviço, e não do cheiro."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:d",
                  "label": "Incluir maçaneta e teclado, que as mãos tocam",
                  "explanation": "As mãos levam contato para esses lugares, e eles entram na rotina."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:e",
                  "label": "Pular a limpeza se o paciente parecia saudável",
                  "explanation": "A aparência não diz o que a superfície carrega: a limpeza vale para todos."
                },
                {
                  "id": "option:rtg-2026:m17:aula-04:i4:f",
                  "label": "Usar o produto e o tempo que o serviço define",
                  "explanation": "Produto e tempo de ação são definidos pelo serviço, e você segue o protocolo."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m17:aula-04:i4:b",
                "option:rtg-2026:m17:aula-04:i4:d",
                "option:rtg-2026:m17:aula-04:i4:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Numa sala de ultrassom, o transdutor foi usado em vários pacientes. Julgue cada afirmação."
            },
            "help": "O princípio é o mesmo da mesa: contato, limpeza, protocolo.",
            "type": "true-false",
            "feedback": {
              "correct": "Você levou o princípio da limpeza entre pacientes para um equipamento novo.",
              "incorrect": "Releia o conceito: o contato com o paciente pede limpeza entre um e outro, com o protocolo do serviço."
            },
            "payload": {
              "prompt": "Numa sala de ultrassom, o transdutor foi usado em vários pacientes. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m17:aula-04:i5:1",
                  "text": "O transdutor entra na limpeza e desinfecção depois de cada exame.",
                  "isTrue": true,
                  "explanation": "O transdutor encosta no paciente, e por isso é limpo depois de cada exame."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-04:i5:2",
                  "text": "Um frasco de gel usado em vários pacientes não carrega contaminação, porque o gel é limpo.",
                  "isTrue": false,
                  "explanation": "Gel de uso em vários pacientes pode transmitir infecção: ele também entra no cuidado."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-04:i5:3",
                  "text": "O serviço define o produto e o tempo de ação para o transdutor.",
                  "isTrue": true,
                  "explanation": "Como nas demais superfícies, o protocolo do serviço define produto e tempo."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe o que a limpeza alcança",
            "body": "Agora você aponta as superfícies de contato, inclusive as que as suas mãos tocam, limpa entre todos os pacientes e segue o produto e o tempo que o serviço define.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "A sala limpa é a que o próximo paciente nem percebe."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m17:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:vic-quedas-hospital"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Sinais de alerta na sala",
            "body": "Hoje você vai conseguir reconhecer um sinal de alerta, parar o exame, chamar ajuda e saber onde está cada recurso da sala.",
            "dialogue": {
              "setting": "Sala de comando da tomografia",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Durante o exame, Seu Jorge parou de responder pelo interfone."
                },
                {
                  "speaker": "caio",
                  "text": "Da sala de comando você vê pouco do rosto dele. O que mais mostra que algo mudou?"
                },
                {
                  "speaker": "pixel",
                  "text": "E, se precisar de ajuda, você sabe onde está cada coisa?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Reconhecer, parar e chamar",
            "body": "Alguns sinais pedem a chamada da equipe na hora: perder a consciência ou cair de repente, convulsão, falta de ar nova, mudança na cor da pele, como palidez, e sangramento sem controle. Você reconhece, para o exame e chama: não mede nem trata. Em muitos serviços, qualquer pessoa presente pode acionar a equipe pelo número divulgado. Conheça a sala antes de precisar: porta de saída, botão de chamada, telefone e números de emergência afixados, saída de oxigênio e carrinho de emergência. Oxigênio e carrinho são usados pela equipe.",
            "keyPoints": [
              "Qualquer sinal de alerta: parar e chamar.",
              "Você sabe onde ficam os recursos; quem os usa é a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Marta, na maca, fica mole de repente e não responde ao ser chamada. Qual princípio da unidade vale agora?"
            },
            "help": "Lembre o que você fez quando a conferência não fechava.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Parar, descrever e chamar a equipe é a atitude que vale diante do que não cabe a você resolver.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Marta, na maca, fica mole de repente e não responde ao ser chamada. Qual princípio da unidade vale agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-05:i1:a",
                  "label": "Seguir o exame, pois a pulseira já confere",
                  "explanation": "A pulseira conferida não responde ao que mudou agora no estado dela."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i1:b",
                  "label": "Parar, descrever o que viu e chamar a equipe",
                  "explanation": "Parar, descrever e chamar a equipe é a atitude que vale diante do que não cabe a você resolver."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i1:c",
                  "label": "Levantar a paciente para ver se ela responde",
                  "explanation": "Mover a paciente sozinha não cabe ao estudante e pode aumentar o risco."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i1:d",
                  "label": "Esperar alguns minutos para ver se passa",
                  "explanation": "Esperar sem chamar atrasa o apoio que a paciente precisa."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule onde ficam os cinco recursos da parede da sala, tocando na ficha e no ponto."
            },
            "help": "Lembre para que serve cada recurso e como ele costuma ser na parede de um hospital.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: você sabe onde chamar ajuda e onde ficam os recursos que a equipe usa.",
              "incorrect": "Alguma ficha está no lugar errado: confira o que cada recurso parece e para que serve."
            },
            "payload": {
              "prompt": "Rotule onde ficam os cinco recursos da parede da sala, tocando na ficha e no ponto.",
              "imageRef": "diagram:itens-de-emergencia-da-sala",
              "points": [
                {
                  "id": "point:rtg-2026:m17:aula-05:i2:1",
                  "x": 0.119,
                  "y": 0.575,
                  "where": "à esquerda, a abertura alta com seta amarela acima",
                  "correctLabelId": "label:rtg-2026:m17:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m17:aula-05:i2:2",
                  "x": 0.375,
                  "y": 0.708,
                  "where": "no chão, o móvel com gavetas e rodas, peça azul em cima",
                  "correctLabelId": "label:rtg-2026:m17:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m17:aula-05:i2:3",
                  "x": 0.587,
                  "y": 0.612,
                  "where": "na parede, o painel quadrado com um círculo azul no meio",
                  "correctLabelId": "label:rtg-2026:m17:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m17:aula-05:i2:4",
                  "x": 0.769,
                  "y": 0.408,
                  "where": "no alto, o disco amarelo com um cordão que pende",
                  "correctLabelId": "label:rtg-2026:m17:aula-05:i2:4"
                },
                {
                  "id": "point:rtg-2026:m17:aula-05:i2:5",
                  "x": 0.906,
                  "y": 0.68,
                  "where": "à direita, o aparelho de teclas numéricas na parede",
                  "correctLabelId": "label:rtg-2026:m17:aula-05:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:4",
                  "label": "Botão de chamada"
                },
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:2",
                  "label": "Carrinho de emergência"
                },
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:1",
                  "label": "Porta de saída"
                },
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:3",
                  "label": "Saída de oxigênio"
                },
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:6",
                  "label": "Extintor"
                },
                {
                  "id": "label:rtg-2026:m17:aula-05:i2:5",
                  "label": "Telefone"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre os sinais de alerta e a chamada de ajuda."
            },
            "help": "Leia cada afirmação com calma antes de responder.",
            "type": "blitz",
            "feedback": {
              "correct": "Você separou o que pede a chamada do que não cabe ao estudante.",
              "incorrect": "Reveja as afirmações: cada retorno explica o que pede a chamada e o que fica com a equipe."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre os sinais de alerta e a chamada de ajuda.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:1",
                  "text": "Pedir ajuda pelo número divulgado não é tarefa só do médico.",
                  "isTrue": true,
                  "explanation": "Onde o número é divulgado a todos, quem está na sala pode chamar a equipe."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:2",
                  "text": "Se o paciente parece desmaiar, espere alguns minutos para ver se passa.",
                  "isTrue": false,
                  "explanation": "Esperar atrasa o apoio: o sinal de alerta pede a chamada na hora."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:3",
                  "text": "Perder a consciência de repente é um sinal que pede a chamada da equipe.",
                  "isTrue": true,
                  "explanation": "Perda de consciência é um sinal de alerta que pede a chamada."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:4",
                  "text": "O estudante usa o carrinho de emergência para tratar o paciente.",
                  "isTrue": false,
                  "explanation": "O carrinho é da equipe: você reconhece, para e chama, e não trata."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:5",
                  "text": "Você mede os sinais e decide se o exame continua.",
                  "isTrue": false,
                  "explanation": "Medir e decidir sobre o exame é da equipe, e não do estudante."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:6",
                  "text": "Mudança súbita na cor da pele é um sinal para avisar a equipe.",
                  "isTrue": true,
                  "explanation": "A mudança de cor é um dos sinais que pedem a chamada."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:7",
                  "text": "Sangramento sem controle é um sinal que pede a chamada da equipe.",
                  "isTrue": true,
                  "explanation": "Sangramento que não para está entre os sinais que pedem a chamada na hora."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-05:i3:8",
                  "text": "Falta de ar nova é um incômodo comum que dispensa aviso.",
                  "isTrue": false,
                  "explanation": "Falta de ar nova é um sinal que pede a chamada."
                }
              ],
              "passCount": 7
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Na tomografia simulada, Seu Jorge fica mole de repente e para de responder ao interfone. Converse com o Caio, que está com você no comando."
            },
            "help": "Quem decide se o exame continua, e o que você sabe de fato sobre o que aconteceu?",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você parou, chamou a equipe e descreveu o que viu, sem dar nome ao quadro.",
              "incorrect": "Reveja os turnos: o sinal pede parar e chamar, e o relato descreve o que você viu, sem diagnóstico."
            },
            "payload": {
              "prompt": "Na tomografia simulada, Seu Jorge fica mole de repente e para de responder ao interfone. Converse com o Caio, que está com você no comando.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m17:aula-05:i4:1",
                  "line": "Seu Jorge ficou mole e não responde mais. Faltam só uns segundos de aquisição. O que a gente faz?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:1a",
                      "label": "Termino a série, são só uns segundos, e depois olho ele.",
                      "reply": "Então espero a série acabar aqui do seu lado."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:1b",
                      "label": "Paro o exame agora e chamamos a equipe.",
                      "reply": "Estou parando. Você liga pelo número do serviço?"
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:1c",
                      "label": "Entro e levanto ele na mesa para ver se reage.",
                      "reply": "Vou com você, então. Ajudo a sentar ele."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-05:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m17:aula-05:i4:2",
                  "line": "A equipe atendeu. O que você conta para eles?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:2a",
                      "label": "Que ele teve um desmaio por pressão baixa.",
                      "reply": "Vou repetir isso para eles, então."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:2b",
                      "label": "Que vamos esperar ele melhorar e ligamos de novo.",
                      "reply": "Então desligo e a gente aguarda."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-05:i4:2c",
                      "label": "O que vi, quando começou e em que sala estamos.",
                      "reply": "Tá, vou dizer que foi agora, na sala dois."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-05:i4:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Em outra sala, uma paciente senta na mesa, fica pálida e diz que vai desmaiar. Marque todas as ações que cabem a você."
            },
            "help": "Separe o que ajuda a equipe a chegar do que é decisão clínica.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você manteve o papel do estudante: reconhecer, ficar à vista e chamar.",
              "incorrect": "Releia o conceito: você reconhece, para e chama, e a avaliação e a decisão ficam com a equipe."
            },
            "payload": {
              "prompt": "Em outra sala, uma paciente senta na mesa, fica pálida e diz que vai desmaiar. Marque todas as ações que cabem a você.",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:a",
                  "label": "Dar um copo de água e esperar passar",
                  "explanation": "Dar água não cabe ao estudante, e esperar atrasa a chamada."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:b",
                  "label": "Chamar a equipe pelo canal do serviço",
                  "explanation": "A chamada é a conduta quando há sinal de alerta."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:c",
                  "label": "Seguir o exame, se ela disser que está melhor",
                  "explanation": "Quem decide se o exame continua é a equipe."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:d",
                  "label": "Ficar com a paciente à vista, sem deixá-la sozinha",
                  "explanation": "Manter a paciente à vista enquanto a ajuda chega é parte do cuidado."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:e",
                  "label": "Medir a pressão e decidir se o exame continua",
                  "explanation": "Medir e decidir é da equipe, e não do estudante."
                },
                {
                  "id": "option:rtg-2026:m17:aula-05:i5:f",
                  "label": "Contar à equipe o que viu e quando começou",
                  "explanation": "O relato do que foi visto e quando começou ajuda quem vai atender."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m17:aula-05:i5:b",
                "option:rtg-2026:m17:aula-05:i5:d",
                "option:rtg-2026:m17:aula-05:i5:f"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você sabe parar e chamar",
            "body": "Agora você reconhece um sinal de alerta, para o exame, chama ajuda pelo canal do serviço, fica com a pessoa e sabe onde estão os recursos que a equipe usa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Saber onde está cada coisa ajuda você a chamar a ajuda certa mais rápido."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m17:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m17:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m17-v1",
        "sourceIds": [
          "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:bcit-transferencias-2015",
          "source:rtg-2026:m17:vic-quedas-hospital"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Um turno seguro",
            "body": "Hoje você vai conseguir juntar identificação, transferência, limpeza e sinais de alerta numa sala nova.",
            "dialogue": {
              "setting": "Plantão simulado, sala nova",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje a sala é nova para vocês. Vou deixar o turno correr."
                },
                {
                  "speaker": "caio",
                  "text": "O primeiro paciente chega em dez minutos. Olhem a sala antes de olhar a fila."
                },
                {
                  "speaker": "pixel",
                  "text": "Qual pergunta de cada aula vem com você para dentro da sala?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Cinco cuidados, uma atitude",
            "body": "Um turno seguro junta o que você viu nesta unidade. Com a sala olhada e arrumada no que cabe a você, a pessoa chega: confere-se quem ela é, passa-se à mesa em equipe, e você acompanha atento aos sinais de alerta. Entre um paciente e o seguinte, as superfícies são limpas como o serviço define. Em qualquer ponto, se algo não fecha ou aparece um sinal, a atitude é a mesma: reconhecer, parar e chamar. A decisão clínica é da equipe.",
            "keyPoints": [
              "Olhar a sala, conferir, transferir em equipe, acompanhar, limpar.",
              "Reconhecer, parar e chamar, em qualquer fase."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Marta, na maca, fica pálida enquanto você prepara a sala. O que vem primeiro?"
            },
            "help": "Lembre o que a aula anterior pede diante de um sinal.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Reconhecer o sinal, chamar a equipe e ficar à vista é o que cabe a você.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Marta, na maca, fica pálida enquanto você prepara a sala. O que vem primeiro?",
              "options": [
                {
                  "id": "option:rtg-2026:m17:aula-06:i1:a",
                  "label": "Terminar de arrumar a sala antes de olhar para ela",
                  "explanation": "Arrumar a sala não pode vir antes do sinal de alerta."
                },
                {
                  "id": "option:rtg-2026:m17:aula-06:i1:b",
                  "label": "Pedir a ela que se deite melhor e esperar",
                  "explanation": "Esperar sem chamar atrasa o apoio."
                },
                {
                  "id": "option:rtg-2026:m17:aula-06:i1:c",
                  "label": "Chamar a equipe pelo canal do serviço e ficar à vista",
                  "explanation": "Reconhecer o sinal, chamar a equipe e ficar à vista é o que cabe a você."
                },
                {
                  "id": "option:rtg-2026:m17:aula-06:i1:d",
                  "label": "Medir os sinais dela e decidir sobre o exame",
                  "explanation": "Medir e decidir é da equipe, e não do estudante."
                }
              ],
              "correctOptionId": "option:rtg-2026:m17:aula-06:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Nesta sala nova, Seu Jorge perde a consciência na mesa. Toque nos dois recursos da parede que servem para você chamar a equipe."
            },
            "help": "Qual recurso o estudante usa, e qual fica para quem atende?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: botão de chamada e telefone servem para chamar; carrinho e oxigênio ficam com a equipe.",
              "incorrect": "Separe o que serve para chamar alguém do que a equipe usa quando chega."
            },
            "payload": {
              "prompt": "Nesta sala nova, Seu Jorge perde a consciência na mesa. Toque nos dois recursos da parede que servem para você chamar a equipe.",
              "imageRef": "diagram:itens-de-emergencia-da-sala",
              "regions": [
                {
                  "id": "region:rtg-2026:m17:aula-06:i2:1",
                  "label": "Porta de saída",
                  "x": 0.034,
                  "y": 0.325,
                  "width": 0.17,
                  "height": 0.5
                },
                {
                  "id": "region:rtg-2026:m17:aula-06:i2:2",
                  "label": "Carrinho de emergência",
                  "x": 0.25,
                  "y": 0.523,
                  "width": 0.25,
                  "height": 0.37
                },
                {
                  "id": "region:rtg-2026:m17:aula-06:i2:3",
                  "label": "Saída de oxigênio",
                  "x": 0.537,
                  "y": 0.542,
                  "width": 0.1,
                  "height": 0.14
                },
                {
                  "id": "region:rtg-2026:m17:aula-06:i2:4",
                  "label": "Botão de chamada",
                  "x": 0.724,
                  "y": 0.333,
                  "width": 0.09,
                  "height": 0.15
                },
                {
                  "id": "region:rtg-2026:m17:aula-06:i2:5",
                  "label": "Telefone da parede",
                  "x": 0.851,
                  "y": 0.573,
                  "width": 0.11,
                  "height": 0.22
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m17:aula-06:i2:4",
                "region:rtg-2026:m17:aula-06:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Dona Marta acabou o exame na mesa e está com pressa. Conduza a conversa com segurança."
            },
            "help": "Quem faz a transferência, e o que você faz diante de um mal-estar novo?",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: a transferência é com a equipe, e a tontura é um sinal para chamar e ficar presente.",
              "incorrect": "Reveja os turnos: nem a pressa da paciente muda a equipe, e a tontura pede a chamada, e não uma medida sua."
            },
            "payload": {
              "prompt": "Dona Marta acabou o exame na mesa e está com pressa. Conduza a conversa com segurança.",
              "speaker": "paciente",
              "name": "Dona Marta",
              "turns": [
                {
                  "id": "turn:rtg-2026:m17:aula-06:i3:1",
                  "line": "Já terminou? Eu desço sozinha, não precisa chamar ninguém.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:1a",
                      "label": "Tudo bem, a senhora conhece o próprio corpo, desça com todo o cuidado.",
                      "reply": "Então eu desço agora mesmo."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:1b",
                      "label": "Vamos esperar a equipe, e as rodas da maca ficam travadas.",
                      "reply": "Está bem, eu espero, mas estou com um pouco de pressa."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:1c",
                      "label": "Se a senhora tem pressa, eu a seguro pelo braço e ajudo a descer.",
                      "reply": "Ótimo, então me ajude a descer."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-06:i3:1b"
                },
                {
                  "id": "turn:rtg-2026:m17:aula-06:i3:2",
                  "line": "Sabe, estou meio tonta agora.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:2a",
                      "label": "Vou chamar a equipe agora, e a senhora não fica sozinha.",
                      "reply": "Obrigada, não quero ficar sozinha."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:2b",
                      "label": "Deve ser a pressa: se descer devagar, passa.",
                      "reply": "Então desço devagar."
                    },
                    {
                      "id": "option:rtg-2026:m17:aula-06:i3:2c",
                      "label": "A senhora pode medir a pressão no aparelho ali, para ver.",
                      "reply": "Vou lá medir, então."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m17:aula-06:i3:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene as etapas do turno, na ordem ensinada nesta aula, da sala antes do paciente até a sala pronta de novo."
            },
            "help": "Pense no que precisa estar pronto antes de a pessoa chegar.",
            "type": "ordering",
            "feedback": {
              "correct": "Você montou o turno: sala, conferência, transferência, acompanhamento e limpeza.",
              "incorrect": "Reveja a ordem: a sala é olhada antes do paciente, e a limpeza fecha o turno antes do seguinte."
            },
            "payload": {
              "prompt": "Ordene as etapas do turno, na ordem ensinada nesta aula, da sala antes do paciente até a sala pronta de novo.",
              "items": [
                {
                  "id": "item:rtg-2026:m17:aula-06:i4:1",
                  "label": "Olhar a sala e corrigir o que cabe a você, como rodas e caminho"
                },
                {
                  "id": "item:rtg-2026:m17:aula-06:i4:5",
                  "label": "Limpar as superfícies de contato, como o serviço define"
                },
                {
                  "id": "item:rtg-2026:m17:aula-06:i4:4",
                  "label": "Acompanhar a pessoa durante o exame, atento aos sinais de alerta"
                },
                {
                  "id": "item:rtg-2026:m17:aula-06:i4:2",
                  "label": "Conferir quem é a pessoa, comparando os dados com a pulseira"
                },
                {
                  "id": "item:rtg-2026:m17:aula-06:i4:3",
                  "label": "Transferir a pessoa para a mesa em equipe, com as linhas conferidas"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m17:aula-06:i4:1",
                "item:rtg-2026:m17:aula-06:i4:2",
                "item:rtg-2026:m17:aula-06:i4:3",
                "item:rtg-2026:m17:aula-06:i4:4",
                "item:rtg-2026:m17:aula-06:i4:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m17:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m17:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: O turno está atrasado, e a sala está cheia. Julgue cada afirmação sobre o que se mantém."
            },
            "help": "A pressa muda alguma etapa do turno?",
            "type": "true-false",
            "feedback": {
              "correct": "Você manteve os cuidados mesmo com a pressa, e deixou as decisões com a equipe.",
              "incorrect": "Releia o conceito: a pressa não muda os cuidados, e a decisão clínica é da equipe."
            },
            "payload": {
              "prompt": "O turno está atrasado, e a sala está cheia. Julgue cada afirmação sobre o que se mantém.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m17:aula-06:i5:1",
                  "text": "Se o turno atrasa muito, a limpeza entre pacientes pode esperar o fim do dia de trabalho, para recuperar o tempo.",
                  "isTrue": false,
                  "explanation": "A limpeza vale entre todos os pacientes: o atraso não a transfere para o fim do dia."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-06:i5:2",
                  "text": "Um sinal de alerta em qualquer fase pede a mesma atitude: parar e chamar.",
                  "isTrue": true,
                  "explanation": "A atitude de reconhecer, parar e chamar vale em qualquer fase do turno."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-06:i5:3",
                  "text": "Com a equipe ocupada, o estudante espera o apoio e não decide sobre o exame.",
                  "isTrue": true,
                  "explanation": "Quem decide é a equipe: o estudante espera o apoio e fica com a pessoa."
                },
                {
                  "id": "statement:rtg-2026:m17:aula-06:i5:4",
                  "text": "A identidade é conferida antes de cada procedimento, mesmo com o turno atrasado.",
                  "isTrue": true,
                  "explanation": "A conferência antes de cada procedimento não depende do horário."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m17:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você junta os cuidados num turno",
            "body": "Agora você olha a sala, confere a identidade, passa a pessoa à mesa em equipe, acompanha com atenção, limpa entre pacientes e, diante de qualquer sinal, reconhece, para e chama.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Um turno seguro é feito de pequenas paradas no momento certo."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m17",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-01"
        ],
        "prompt": "O acompanhante de Seu Jorge diz: “É ele, pode fazer”. Seu Jorge está dormindo e sem pulseira. O que cabe a você?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-01:c1:a",
            "label": "Começar, porque quem o conhece afirmou a identidade"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c1:b",
            "label": "Escrever o nome dele na pulseira com a ajuda do acompanhante"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c1:c",
            "label": "Parar e avisar a equipe que falta a pulseira e a resposta dele"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c1:d",
            "label": "Esperar o paciente acordar sozinho antes de qualquer aviso"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-01:c1:c",
        "feedback": {
          "correct": "Descrever o que falta e pedir apoio é a conduta quando a conferência não se completa.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-01"
        ],
        "prompt": "Em qual destas situações a conferência de identidade fecha e você pode seguir?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-01:c2:a",
            "label": "Dona Marta dorme, e a pulseira dela confere com o pedido"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c2:b",
            "label": "A acompanhante diz o nome, e Seu Jorge está sem pulseira"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c2:c",
            "label": "Seu Jorge diz nome e nascimento, e os dois batem com a pulseira"
          },
          {
            "id": "option:rtg-2026:m17:aula-01:c2:d",
            "label": "A placa acima do leito traz o mesmo nome que o pedido"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-01:c2:c",
        "feedback": {
          "correct": "Os dois dados, ditos por ele e iguais aos da pulseira, fecham a conferência.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:bcit-transferencias-2015"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-02"
        ],
        "prompt": "Há uma cadeira entre a maca e a mesa e um pano molhado no piso. O que você faz antes de mover a paciente?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-02:c1:a",
            "label": "Pede que a paciente passe por cima, com cuidado"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c1:b",
            "label": "Seguir, pois a equipe já está pronta no local"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c1:c",
            "label": "Posiciona a cadeira de lado, sem mexer no piso molhado"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c1:d",
            "label": "Tira a cadeira e seca o piso antes de qualquer movimento"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-02:c1:d",
        "feedback": {
          "correct": "Obstáculo e líquido são perigos do ambiente que você corrige antes de mover.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:vic-quedas-hospital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-02"
        ],
        "prompt": "A maca está encostada na mesa, com uma roda solta. Qual é o risco e o seu cuidado?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-02:c2:a",
            "label": "A maca pode escorregar, e você trava a roda antes do apoio"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c2:b",
            "label": "Não há risco, pois a maca está encostada na mesa"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c2:c",
            "label": "O risco é do soro, e a roda só precisa ser avisada depois"
          },
          {
            "id": "option:rtg-2026:m17:aula-02:c2:d",
            "label": "A roda só preocupa quando a maca anda pelo corredor"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-02:c2:a",
        "feedback": {
          "correct": "Roda solta deixa a maca se afastar: travar antes de qualquer apoio é o cuidado.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:vic-quedas-hospital"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-03"
        ],
        "prompt": "Quando a transferência deve esperar e a equipe ser chamada?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-03:c1:a",
            "label": "Quando o serviço pede mais pessoas do que as presentes"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c1:b",
            "label": "Quando a paciente pergunta quanto tempo vai demorar"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c1:c",
            "label": "Quando as rodas da maca já estão firmes e travadas"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c1:d",
            "label": "Quando a paciente já foi conferida e explicada"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-03:c1:a",
        "feedback": {
          "correct": "O método do serviço define quantas pessoas: faltando gente, espera-se.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:openstax-transferencia-2023",
          "source:rtg-2026:m17:bcit-transferencias-2015"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-03"
        ],
        "prompt": "O deslize terminou e a paciente está na mesa. Qual é o último passo da transferência?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-03:c2:a",
            "label": "Afastar a maca e chamar logo o próximo paciente"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c2:b",
            "label": "Repetir o deslize para conferir se ele deu certo"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c2:c",
            "label": "Pedir que ela mesma se ajeite como puder na mesa"
          },
          {
            "id": "option:rtg-2026:m17:aula-03:c2:d",
            "label": "Ajeitar a paciente e conferir se ela está confortável"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-03:c2:d",
        "feedback": {
          "correct": "Ajeitar e conferir o conforto fecha a transferência antes do exame.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:bcit-transferencias-2015"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-04"
        ],
        "prompt": "Você posicionou Seu Jorge e depois digitou no teclado do comando. Antes do próximo paciente, o teclado entra na limpeza?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-04:c1:a",
            "label": "Não, porque o paciente nunca encostou no teclado"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c1:b",
            "label": "Sim, porque as mãos levam o contato até ele"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c1:c",
            "label": "Só no fim do turno, junto com o resto da sala"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c1:d",
            "label": "Só se houver sujeira visível sobre as teclas"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-04:c1:b",
        "feedback": {
          "correct": "O teclado é tocado pelas mãos depois do paciente, e por isso entra na rotina.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-04"
        ],
        "prompt": "A Duda quer usar o produto que sobrou de outra sala e secar a mesa logo, para ganhar tempo. O que você sugere?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-04:c2:a",
            "label": "Aceitar, pois qualquer produto serve se a mesa ficar seca"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c2:b",
            "label": "Usar mais produto, para compensar o pouco tempo"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c2:c",
            "label": "Deixar a mesa sem limpar até a próxima manhã"
          },
          {
            "id": "option:rtg-2026:m17:aula-04:c2:d",
            "label": "Seguir o produto e o tempo do protocolo do serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-04:c2:d",
        "feedback": {
          "correct": "O protocolo do serviço define produto e tempo, e na dúvida se pede apoio.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-05"
        ],
        "prompt": "Uma paciente tem uma convulsão sobre a mesa de raios X. Qual é a sua primeira ação?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-05:c1:a",
            "label": "Segurar a paciente com força para que ela pare de se mexer"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c1:b",
            "label": "Terminar o exame enquanto ela está parada"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c1:c",
            "label": "Chamar a equipe pelo canal do serviço e ficar à vista"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c1:d",
            "label": "Procurar a cartela de medicamentos no carrinho"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-05:c1:c",
        "feedback": {
          "correct": "Chamar a equipe e ficar à vista é a conduta do estudante nesse sinal.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-05"
        ],
        "prompt": "Neste serviço simulado, o número da equipe de emergência é divulgado para todos. Quem pode ligar quando um paciente perde a consciência na sala?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-05:c2:a",
            "label": "Qualquer pessoa presente, pelo número divulgado"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c2:b",
            "label": "Só o médico responsável pelo exame que está em andamento"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c2:c",
            "label": "Só o tecnólogo mais antigo da sala de exames, por hierarquia"
          },
          {
            "id": "option:rtg-2026:m17:aula-05:c2:d",
            "label": "Só quem sabe usar o carrinho de emergência da sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-05:c2:a",
        "feedback": {
          "correct": "Com o número divulgado a todos, qualquer pessoa presente pode chamar a equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-06"
        ],
        "prompt": "Qual atitude vale para quase tudo nesta unidade, quando algo não fecha ou muda?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-06:c1:a",
            "label": "Resolver sozinho, para não atrasar o turno"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c1:b",
            "label": "Esperar o paciente reclamar antes de avisar"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c1:c",
            "label": "Anotar para o fim do turno e seguir"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c1:d",
            "label": "Parar, descrever o que viu e chamar a equipe"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-06:c1:d",
        "feedback": {
          "correct": "Parar, descrever e chamar a equipe vale para identidade, queda, limpeza e sinais de alerta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:esr-efrs-seguranca-2019",
          "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m17:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m17:aula-06"
        ],
        "prompt": "Ao entrar numa sala nova, o que você faz antes de o paciente chegar?",
        "options": [
          {
            "id": "option:rtg-2026:m17:aula-06:c2:a",
            "label": "Espera o paciente chegar para ver o que há na sala"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c2:b",
            "label": "Olha a sala e corrige o que cabe a você"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c2:c",
            "label": "Começa a chamar a fila para ganhar tempo"
          },
          {
            "id": "option:rtg-2026:m17:aula-06:c2:d",
            "label": "Confere a pulseira de quem ainda não chegou"
          }
        ],
        "correctOptionId": "option:rtg-2026:m17:aula-06:c2:b",
        "feedback": {
          "correct": "Olhar a sala antes do paciente permite corrigir os perigos do ambiente.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m17:vic-quedas-hospital"
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
      "claimId": "interaction:rtg-2026:m17:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-01:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:1c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:i3:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-01:i4:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-01:i4:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-01:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-01:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-01:i5:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-01:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-01:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-01:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-01:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-02:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-02:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m17:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m17:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "token:rtg-2026:m17:aula-02:i3:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "token:rtg-2026:m17:aula-02:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m17:aula-02:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m17:aula-02:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m17:aula-02:i3:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-02:i4:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m17:aula-02:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-02:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "region:rtg-2026:m17:aula-02:i4:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:e",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:i5:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-03:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-03:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-03:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:openstax-transferencia-2023",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:openstax-transferencia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-04:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "group:rtg-2026:m17:aula-04:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-04:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:i4:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-04:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-04:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:odeh-superficies-radiologia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "point:rtg-2026:m17:aula-05:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m17:aula-05:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:7",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-05:i3:8",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-05:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:i5:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "region:rtg-2026:m17:aula-06:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m17:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:i3:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-06:i4:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-06:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "item:rtg-2026:m17:aula-06:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-06:i5:1",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m17:aula-06:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m17:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "step:rtg-2026:m17:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011",
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:bcit-transferencias-2015",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m17:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m17:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m17:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m17:esr-efrs-seguranca-2019",
        "source:rtg-2026:m17:vic-quedas-hospital"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m17:aula-01",
        "hook": "Complete a frase: se o paciente não responde, a conferência não está…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-01"
          ],
          "prompt": "Seu Jorge não responde ao ser chamado. Qual é o próximo passo?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-01:rg:a",
              "label": "Seguir, pois a pulseira já tem o nome certo"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rg:b",
              "label": "Avisar a equipe de que ele não responde e aguardar a orientação"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rg:c",
              "label": "Perguntar ao paciente ao lado se ele conhece o Seu Jorge"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rg:d",
              "label": "Conferir a placa acima do leito e seguir"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-01:rg:b",
          "feedback": {
            "correct": "Descrever o que falta e esperar a orientação é a conduta que fecha a dúvida.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:esr-efrs-seguranca-2019"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-01"
          ],
          "prompt": "Em outra sala, a pulseira de uma paciente está ilegível, e ela responde bem. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-01:rt:a",
              "label": "Anotar o nome que ela diz num papel e seguir com o exame"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rt:b",
              "label": "Seguir com o exame, pois ela respondeu bem e isso basta"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rt:c",
              "label": "Pedir à Duda que adivinhe a letra apagada da pulseira"
            },
            {
              "id": "option:rtg-2026:m17:aula-01:rt:d",
              "label": "Parar e avisar a equipe sobre a pulseira ilegível"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-01:rt:d",
          "feedback": {
            "correct": "Uma pulseira ilegível não permite a comparação: descreva e peça apoio.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:esr-efrs-seguranca-2019"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m17:aula-02",
        "hook": "Complete a frase: antes de mover o paciente, eu olho primeiro a…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-02"
          ],
          "prompt": "Qual destes é um perigo do ambiente que você corrige antes de mover a paciente?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-02:rg:a",
              "label": "Um objeto no caminho entre a maca e a mesa"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rg:b",
              "label": "O soro conectado ao braço dela, que já está ligado"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rg:c",
              "label": "A pulseira no punho da paciente, já conferida"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rg:d",
              "label": "O nome escrito no pedido do exame, na folha"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-02:rg:a",
          "feedback": {
            "correct": "Obstáculo no caminho é perigo do ambiente e se tira antes de mover.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:vic-quedas-hospital"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-02"
          ],
          "prompt": "Na sala de raios X, o paciente vai da cadeira de rodas para a mesa. Qual cuidado vale também aqui?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-02:rt:a",
              "label": "Deixar a cadeira com as rodas soltas, para ele se apoiar"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rt:b",
              "label": "Travar as rodas da cadeira antes de ele se apoiar nela"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rt:c",
              "label": "Pedir que ele passe sozinho, para ganhar tempo"
            },
            {
              "id": "option:rtg-2026:m17:aula-02:rt:d",
              "label": "Mover a cadeira só depois de ele já estar na mesa"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-02:rt:b",
          "feedback": {
            "correct": "Equipamento com freio, travado, é cuidado que vale para cadeira e maca.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:vic-quedas-hospital"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m17:aula-03",
        "hook": "Complete a frase: antes do deslize, eu travo as… e confiro as…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-03"
          ],
          "prompt": "Qual passo vem primeiro na transferência, na ordem ensinada nesta aula?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-03:rg:a",
              "label": "Deslizar a pessoa em conjunto, no sinal combinado"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rg:b",
              "label": "Conferir o conforto da pessoa ao fim do deslize"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rg:c",
              "label": "Explicar o que vai acontecer e combinar o sinal"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rg:d",
              "label": "Travar as rodas e conferir as linhas com a equipe"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-03:rg:c",
          "feedback": {
            "correct": "Primeiro a pessoa e a equipe combinam o que vai acontecer.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:bcit-transferencias-2015",
            "source:rtg-2026:m17:pmc-movimento-paciente-dor-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-03"
          ],
          "prompt": "Numa sala de raios X, o paciente passa da maca para a mesa com a prancha de transferência. Qual cuidado vale também aqui?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-03:rt:a",
              "label": "Usar a prancha sozinho, pois ela substitui a equipe"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rt:b",
              "label": "Pular o travamento das rodas, pois a prancha segura a maca"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rt:c",
              "label": "Seguir o método do serviço, com a equipe e as rodas travadas"
            },
            {
              "id": "option:rtg-2026:m17:aula-03:rt:d",
              "label": "Deixar a linha do soro esticada, pois a prancha desliza rápido"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-03:rt:c",
          "feedback": {
            "correct": "O serviço define o método, e equipe e rodas travadas valem com a prancha.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:bcit-transferencias-2015",
            "source:rtg-2026:m17:openstax-transferencia-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m17:aula-04",
        "hook": "Complete a frase: a limpeza entre pacientes vale para…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-04"
          ],
          "prompt": "Qual destas superfícies entra na limpeza entre um paciente e outro?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-04:rg:a",
              "label": "A mesa em que o paciente se deitou"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rg:b",
              "label": "Somente o piso do corredor"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rg:c",
              "label": "Somente o teto da sala"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rg:d",
              "label": "Nenhuma, se o paciente estava vestido"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-04:rg:a",
          "feedback": {
            "correct": "Ela recebeu o corpo do paciente, e a limpeza a alcança.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:esr-efrs-seguranca-2019"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-04"
          ],
          "prompt": "Na tomografia simulada, o paciente deitou na mesa e apoiou a cabeça no suporte. Antes do próximo, o que entra na limpeza?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-04:rt:a",
              "label": "Só o lençol, que vai ser trocado de qualquer jeito"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rt:b",
              "label": "A mesa e o suporte de cabeça, pelo protocolo"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rt:c",
              "label": "Nada, porque o exame durou só poucos minutos"
            },
            {
              "id": "option:rtg-2026:m17:aula-04:rt:d",
              "label": "Só o suporte, se o paciente parecia suado"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-04:rt:b",
          "feedback": {
            "correct": "Superfície que recebeu o paciente entra na limpeza, do jeito que o serviço define.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:esr-efrs-seguranca-2019"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m17:aula-05",
        "hook": "Complete a frase: diante de um sinal de alerta, eu paro e…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-05"
          ],
          "prompt": "Qual destas ações cabe ao estudante diante de um sinal de alerta?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-05:rg:a",
              "label": "Chamar a equipe pelo canal do serviço"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rg:b",
              "label": "Decidir se o exame continua"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rg:c",
              "label": "Usar o carrinho de emergência"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rg:d",
              "label": "Medir os sinais do paciente para classificar o quadro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-05:rg:a",
          "feedback": {
            "correct": "Chamar a equipe é o que cabe a você diante de um sinal de alerta.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-05"
          ],
          "prompt": "Na ressonância simulada, uma criança acompanhada da mãe fica de repente muito pálida e quieta. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-05:rt:a",
              "label": "Espera a mãe falar algo para então decidir"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rt:b",
              "label": "Pede à mãe que dê um líquido à criança"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rt:c",
              "label": "Para o exame e chama a equipe pelo canal do serviço"
            },
            {
              "id": "option:rtg-2026:m17:aula-05:rt:d",
              "label": "Segue o exame, pois ela é uma criança tranquila"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-05:rt:c",
          "feedback": {
            "correct": "Mudança de cor e de comportamento é sinal de alerta: pare e chame.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m17:aula-06",
        "hook": "Complete a frase: em qualquer fase do turno, diante de um sinal, eu…",
        "guided": {
          "id": "recovery-item:rtg-2026:m17:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-06"
          ],
          "prompt": "O turno está atrasado, e a paciente fica tonta. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-06:rg:a",
              "label": "Segue o exame para recuperar o tempo"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rg:b",
              "label": "Chama a equipe e fica com a paciente"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rg:c",
              "label": "Mede os sinais e decide por conta própria"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rg:d",
              "label": "Pede que a paciente se levante para ver se melhora"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-06:rg:b",
          "feedback": {
            "correct": "Reconhecer, chamar e ficar à vista é a conduta do estudante.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:ott-emergencia-radiologia-2011"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m17:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m17:aula-06"
          ],
          "prompt": "Em outra sala, o paciente chega sem pulseira, e a maca está sem freio. Qual é a sua conduta?",
          "options": [
            {
              "id": "option:rtg-2026:m17:aula-06:rt:a",
              "label": "Seguir com o exame, pois o paciente parece saudável"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rt:b",
              "label": "Trava a roda e avisa a equipe sobre a pulseira ausente"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rt:c",
              "label": "Escrever o nome na pulseira e seguir"
            },
            {
              "id": "option:rtg-2026:m17:aula-06:rt:d",
              "label": "Pedir que o paciente se levante para ganhar tempo"
            }
          ],
          "correctOptionId": "option:rtg-2026:m17:aula-06:rt:b",
          "feedback": {
            "correct": "Corrigir o que cabe a você e avisar sobre o que falta é a atitude do turno seguro.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m17:esr-efrs-seguranca-2019",
            "source:rtg-2026:m17:vic-quedas-hospital"
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
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "21962b7cbf9a179332b139118e0efe5b790e405fa14665e559dc06adfb65d80a"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
