// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_S_MD: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:s-md",
  "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0",
  "trackId": "track:rtg-2026:s-md",
  "unitId": "unit:rtg-2026:s-md",
  "contentVersion": "rtg-2026-s-md-v1",
  "competencyIds": [
    "competency:rtg-2026:s-md:aula-01",
    "competency:rtg-2026:s-md:aula-02",
    "competency:rtg-2026:s-md:aula-03",
    "competency:rtg-2026:s-md:aula-04",
    "competency:rtg-2026:s-md:aula-05",
    "competency:rtg-2026:s-md:aula-06",
    "competency:rtg-2026:s-md:aula-07",
    "competency:rtg-2026:s-md:aula-08"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
      "title": "Atualização em mamografia para técnicos e tecnólogos em radiologia, 3ª edição revista e atualizada (2023)",
      "publisher": "Instituto Nacional de Câncer (INCA), Ministério da Saúde",
      "url": "https://ninho.inca.gov.br/jspui/bitstream/123456789/15417/1/3a%20edicao_Atualizacao%20em%20mamografia.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Publicação institucional sob CC BY-NC-SA 4.0; lidas as páginas de anatomia, equipamento, acolhimento, técnica, proteção e qualidade, só para fatos, sem reprodução de texto nem de figuras."
    },
    {
      "id": "source:rtg-2026:s-md:anvisa-in-92-2021",
      "title": "Instrução Normativa nº 92, de 27 de maio de 2021 (republicada em 6 de julho de 2022)",
      "publisher": "Anvisa",
      "url": "https://ses.sp.bvs.br/wp-content/uploads/2022/07/U_IN-MS-ANVISA-92-REP_270521.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal, lido na íntegra em cópia da BVS da SES-SP, inclusive os Anexos I e II; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-md:anvisa-rdc-611-2022",
      "title": "RDC nº 611, de 9 de março de 2022",
      "publisher": "Anvisa",
      "url": "https://cbr.org.br/wp-content/uploads/2023/08/RDC-ANVISA-de-2022-no-611_Requisitos-sanitarios-de-organizacao-e-funcionamento-de-servico-de-radiologia-diagnostica-ou-intervencionista.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal, em cópia compilada no site do CBR; lidos os trechos sobre avisos da sala, aviso de gravidez e presença de acompanhante (arts. 53 e 56), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
      "title": "Parecer sobre sistema de compressão dos mamógrafos: testes de controle de qualidade e compressão clínica (4 de outubro de 2022)",
      "publisher": "Colégio Brasileiro de Radiologia, Comissão Nacional de Mamografia",
      "url": "https://cbr.org.br/wp-content/uploads/2022/11/Parecer-sobre-compressao-das-mamas-durante-a-mamografia.pdf",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Parecer institucional lido na íntegra; consultado para efeitos da compressão, sentido do teste de força e compressão firme e tolerável, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-md:iscd-official-positions-adult",
      "title": "ISCD Official Positions: Adult",
      "publisher": "International Society for Clinical Densitometry (ISCD)",
      "url": "https://iscd.org/learn/official-positions/adult-positions/",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Posições oficiais da sociedade; consultadas para regiões de medida, precisão, simulador, calibração cruzada e relatório, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-md:radiologyinfo-dxa",
      "title": "Bone Density Scan (DEXA or DXA)",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/dexa",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página de orientação ao paciente; consultada para preparo, posicionamento e limitações, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-md:radiologyinfo-mammography",
      "title": "Mammography",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/mammo",
      "accessedAt": "2026-11-06",
      "use": "factual-reference",
      "licenseNote": "Página de orientação ao paciente; consultada para preparo, tomossíntese e detecção auxiliada por computador, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:s-md:aula-01",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Anatomia e acolhimento",
            "body": "Hoje você vai conseguir localizar os limites da mama e conduzir o início do exame com respeito, acordo e pausa combinada.",
            "dialogue": {
              "setting": "Sala de mamografia do serviço-escola",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Eu sei apontar a mama na imagem. Na hora de tocar numa pessoa, travei até com o manequim."
                },
                {
                  "speaker": "paciente",
                  "name": "Dona Célia",
                  "text": "Da última vez ninguém me disse nada. Apertaram e pronto. Fiquei com medo de voltar."
                },
                {
                  "speaker": "lia",
                  "text": "O que você diria antes de encostar nela? E o que faz se ela pedir para parar?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Quem está ali é uma pessoa, não uma mama",
            "body": "A mama fica sobre o peitoral maior e ocupa mais área do que parece: do bordo do esterno à linha axilar anterior, do segundo ao sexto arco costal. Gordura posterior na imagem indica mama mobilizada sem perder glândula. Por isso posicionar pede toque, e o toque pede acordo. A ordem ensinada: confirmar o nome, perguntar sobre gravidez e implante, explicar a compressão, combinar o aviso de dor, pedir licença para tocar. Sem falsa intimidade; na sala, um paciente de cada vez. Se a pessoa pedir para parar, você para. Implante, possível gravidez ou dor que não cede: pare, avise a equipe e siga o protocolo.",
            "keyPoints": [
              "Limites: esterno, linha axilar anterior, segundo e sexto arcos costais.",
              "Explicar, combinar a dor e pedir licença antes de tocar.",
              "Pedido de parar se respeita; dúvida vai para a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Você já viu como começa o acolhimento na mamografia. O que precisa acontecer antes de tocar na pessoa?"
            },
            "help": "Pense no que a pessoa precisa saber para poder dizer sim.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso mesmo. A pessoa entende o que vai acontecer e pode concordar antes do primeiro contato.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Você já viu como começa o acolhimento na mamografia. O que precisa acontecer antes de tocar na pessoa?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-01:i1:a",
                  "label": "Iniciar a compressão bem devagar",
                  "explanation": "Comprimir devagar ajuda, mas já é tocar. Retome o que vem antes do primeiro contato."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i1:b",
                  "label": "Explicar o exame e pedir licença",
                  "explanation": "Isso mesmo. A pessoa entende o que vai acontecer e pode concordar antes do primeiro contato."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i1:c",
                  "label": "Ajustar a altura do aparelho nela",
                  "explanation": "Ajustar o aparelho faz parte da técnica, não substitui a conversa. Retome a sequência do acolhimento."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i1:d",
                  "label": "Conferir a imagem do exame anterior",
                  "explanation": "Exame anterior pode ajudar a equipe, mas não abre caminho para o toque. Quem precisa concordar é a pessoa."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada limite da mama à sua referência no tórax."
            },
            "help": "Medial aponta para o centro do corpo. Lateral aponta para o braço.",
            "type": "matching",
            "feedback": {
              "correct": "A mama ocupa mais área do que a superfície sugere. Saber disso explica por que puxar e suspender fazem parte do posicionamento.",
              "incorrect": "Algum limite ficou trocado. Retome o conceito: medial é o lado do esterno, lateral é o da axila."
            },
            "payload": {
              "prompt": "Ligue cada limite da mama à sua referência no tórax.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-01:i2:1",
                  "left": "Limite medial",
                  "right": "Bordo do esterno"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-01:i2:2",
                  "left": "Limite lateral",
                  "right": "Linha axilar anterior"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-01:i2:3",
                  "left": "Limite superior",
                  "right": "Segundo arco costal, perto da clavícula"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-01:i2:4",
                  "left": "Limite inferior",
                  "right": "Sexto arco costal"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize o início do atendimento na simulação."
            },
            "help": "Se algo impede seguir, é melhor saber antes de explicar a compressão.",
            "type": "ordering",
            "feedback": {
              "correct": "Primeiro de quem se trata e se há algo que muda o exame. Depois vem o que vai acontecer. O toque fica por último.",
              "incorrect": "O toque veio cedo demais ou a identificação veio tarde. Retome a sequência do conceito."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize o início do atendimento na simulação.",
              "items": [
                {
                  "id": "item:rtg-2026:s-md:aula-01:i3:2",
                  "label": "Perguntar sobre possível gravidez e implante"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-01:i3:1",
                  "label": "Confirmar o nome completo da pessoa"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-01:i3:4",
                  "label": "Combinar como a pessoa avisa que está doendo"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-01:i3:3",
                  "label": "Explicar a compressão e quanto ela dura"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-01:i3:5",
                  "label": "Pedir licença para tocar"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-md:aula-01:i3:1",
                "item:rtg-2026:s-md:aula-01:i3:2",
                "item:rtg-2026:s-md:aula-01:i3:3",
                "item:rtg-2026:s-md:aula-01:i3:4",
                "item:rtg-2026:s-md:aula-01:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "O que essa informação pode mudar no exame, e quem responde por essa mudança?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você interrompe, leva a informação e deixa a técnica com quem responde por ela. Depois, registra o que a pessoa relatou.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você já está ajustando a altura do aparelho quando Dona Célia comenta: 'Esqueci de dizer, tenho implante nas duas mamas.' O pedido não trazia essa informação.",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-01:i4:a",
                  "label": "Comprimir como de costume e seguir com o exame",
                  "explanation": "Assim você decide a técnica sozinho. Implante muda o exame, e o caminho está no protocolo do serviço."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i4:b",
                  "label": "Deslocar o implante sozinho antes de comprimir",
                  "explanation": "Existe manobra para isso, mas não é decisão sua na simulação. Pare e leve a informação à equipe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i4:c",
                  "label": "Parar, avisar a equipe e seguir o protocolo",
                  "explanation": "Você interrompe, leva a informação e deixa a técnica com quem responde por ela. Depois, registra o que a pessoa relatou."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i4:d",
                  "label": "Dizer a ela que não poderá fazer o exame",
                  "explanation": "Pessoas com implante fazem mamografia, com rotina própria. Dizer que não pode é decidir no lugar da equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-01:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta na simulação?"
            },
            "help": "O que foi combinado antes de começar? Ele acabou de usar esse combinado.",
            "type": "case-decision",
            "feedback": {
              "correct": "O pedido de parar vale sempre. Depois de ouvir, a equipe vê como seguir e o que foi limitado fica registrado.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Renato veio para uma mamografia e está visivelmente constrangido. No meio da compressão ele diz: 'Pare, por favor, não estou aguentando.' A exposição ainda não começou.",
              "prompt": "Qual é a sua conduta na simulação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-01:i5:a",
                  "label": "Parar, ouvir o que ele diz e chamar a equipe",
                  "explanation": "O pedido de parar vale sempre. Depois de ouvir, a equipe vê como seguir e o que foi limitado fica registrado."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i5:b",
                  "label": "Manter a pressão, pois falta só a exposição",
                  "explanation": "Seguir contra o pedido quebra o acordo com a pessoa. Compressão precisa ser tolerável."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i5:c",
                  "label": "Dizer que homem nem precisaria desse exame",
                  "explanation": "Mama masculina também é examinada. A frase constrange e não responde ao pedido dele."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-01:i5:d",
                  "label": "Aumentar a força para acabar mais depressa",
                  "explanation": "Mais força traz mais dor, o contrário do que ele pediu. Retome o que foi combinado sobre o aviso de dor."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-01:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você localiza os limites da mama, conduz o início do atendimento numa ordem clara e sabe que pedido de parar se respeita. Implante, possível gravidez ou dor que não cede vão para a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Quem se sente ouvido relaxa. E quem relaxa fica mais fácil de posicionar, sem você apertar mais."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-02",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:s-md:anvisa-in-92-2021"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Equipamento, física e proteção",
            "body": "Hoje você vai conseguir prever como espessura, compressão e energia mudam dose e nitidez, e dizer quando o equipamento não pode ser usado.",
            "dialogue": {
              "setting": "Laboratório de física do serviço-escola",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Se eu baixar a energia para ganhar contraste, a dose cai junto, não é? Menos energia, menos radiação."
                },
                {
                  "speaker": "caio",
                  "text": "Essa conta engana muita gente. E olha a bandeja antes de pensar em energia: tem dia que a primeira tarefa é ela."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos seguir o feixe? O que acontece com o que chega ao detector quando a energia muda?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Relações, não receitas",
            "body": "Efeito anódico: mais fótons do lado do cátodo, junto ao tórax. O filtro retira fótons de baixa energia; a bandeja uniformiza a espessura. Menos espessura, menos exposição e dose; compressão insuficiente alonga a exposição e traz borrão. Baixar o kV para ganhar contraste exige mais mAs e dose. Dose glandular média é indicador de qualidade, testado em PMMA, não conta para uma pessoa. Os 150 a 200 N são, para o CBR, força máxima do modo automático, em teste, não alvo clínico. Bandeja danificada ou controle automático parado inabilitam o uso: pare e avise. Na exposição, todos atrás do vidro plumbífero. Avaliação diária da imagem: equipe própria, treinada e habilitada.",
            "keyPoints": [
              "Menos espessura, menos exposição e menos dose.",
              "Menos kV para ganhar contraste pede mais mAs e mais dose.",
              "Dose glandular média é indicador do sistema, não cálculo para a pessoa."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Você já viu o papel da compressão na mamografia. Quando ela reduz a espessura da mama, o que acontece com a dose?"
            },
            "help": "Pense em quanto tecido o feixe precisa atravessar para chegar ao detector.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Menos espessura pede menos exposição e, com isso, menos dose absorvida na glândula.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Você já viu o papel da compressão na mamografia. Quando ela reduz a espessura da mama, o que acontece com a dose?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-02:i1:a",
                  "label": "Sobe, porque a mama fica mais densa",
                  "explanation": "A relação é a contrária. Menos tecido a atravessar pede menos exposição."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i1:b",
                  "label": "Fica igual, porque quem define é o kV",
                  "explanation": "A técnica importa, mas a espessura também pesa na exposição necessária. Retome o papel da compressão."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i1:c",
                  "label": "Depende só do tamanho da bandeja",
                  "explanation": "A bandeja é o meio, não a causa. O que importa é quanto tecido o feixe atravessa."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i1:d",
                  "label": "Tende a cair, com menos exposição",
                  "explanation": "Menos espessura pede menos exposição e, com isso, menos dose absorvida na glândula."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num esquema didático, o kV é reduzido para melhorar o contraste, e a quantidade de fótons no detector precisa continuar a mesma. O que você prevê?"
            },
            "help": "Fóton de menor energia atravessa a mama com mais ou menos facilidade?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Com menos energia, a mama atenua mais. Para manter os fótons no detector, é preciso mais mAs, e a dose acompanha.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num esquema didático, o kV é reduzido para melhorar o contraste, e a quantidade de fótons no detector precisa continuar a mesma. O que você prevê?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-02:i2:a",
                  "label": "O mAs sobe e a dose também sobe",
                  "explanation": "Com menos energia, a mama atenua mais. Para manter os fótons no detector, é preciso mais mAs, e a dose acompanha."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i2:b",
                  "label": "O mAs cai e a dose também cai",
                  "explanation": "Esse é o erro comum: parece que menos energia é menos radiação. Com mais atenuação, a exposição precisa subir."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i2:c",
                  "label": "O mAs não muda e a dose só cai",
                  "explanation": "Se nada compensar, chegam menos fótons ao detector. A condição do enunciado pede compensação."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i2:d",
                  "label": "O mAs cai e a dose acaba subindo",
                  "explanation": "A dose só subiria com mais exposição, e aqui você baixou o mAs. Reveja a direção da compensação."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-02:i2:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item da cadeia técnica ao efeito que ele tem no exame."
            },
            "help": "Comece pelo item cujo efeito você consegue explicar com mais segurança.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada peça ao que ela muda no exame. É esse raciocínio que explica o protocolo, sem precisar decorar valor.",
              "incorrect": "Algum par não fecha. Retome o conceito seguindo o caminho do feixe, do tubo até a mama."
            },
            "payload": {
              "prompt": "Ligue cada item da cadeia técnica ao efeito que ele tem no exame.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-02:i3:1",
                  "left": "Compressão insuficiente",
                  "right": "Exposição mais longa e borrão por movimento"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-02:i3:2",
                  "left": "Filtro metálico",
                  "right": "Retira fótons de baixa energia que só somariam dose"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-02:i3:3",
                  "left": "Bandeja de compressão",
                  "right": "Deixa uniforme a espessura da parte radiografada"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-02:i3:4",
                  "left": "Efeito anódico",
                  "right": "Mais fótons do lado do cátodo, junto à parede do tórax"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz nessa conferência?"
            },
            "help": "A questão é a imagem ou a condição do equipamento?",
            "type": "case-decision",
            "feedback": {
              "correct": "A norma lista bandeja danificada entre as condições que inabilitam o uso. Você para e comunica.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na conferência antes do primeiro atendimento da simulação, você nota uma rachadura fina na bandeja de compressão. Há gente esperando, e um colega diz que a rachadura nem aparece na imagem.",
              "prompt": "O que você faz nessa conferência?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-02:i4:a",
                  "label": "Usar a bandeja com cuidado até o intervalo",
                  "explanation": "Bandeja danificada inabilita o uso, e o cuidado não muda isso. A rotina é parar e avisar."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i4:b",
                  "label": "Não usar a bandeja e avisar o responsável",
                  "explanation": "A norma lista bandeja danificada entre as condições que inabilitam o uso. Você para e comunica."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i4:c",
                  "label": "Fazer uma imagem de teste e decidir por ela",
                  "explanation": "A imagem não prova que a bandeja é segura. Esse defeito não se contorna com teste seu."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i4:d",
                  "label": "Reduzir a força para poupar a bandeja",
                  "explanation": "Comprimir menos prejudica o exame e não resolve o defeito. Retome o que inabilita o equipamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-02:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Como você responde na simulação?"
            },
            "help": "De onde vieram os números dessa planilha?",
            "type": "case-decision",
            "feedback": {
              "correct": "O valor é indicador de qualidade, testado por espessura. A pergunta de Dona Marta segue para a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Duda encontra a planilha do físico, com valores de dose glandular média em várias espessuras de PMMA, e propõe: 'Vamos usar a linha de 4 cm para dizer à Dona Marta quanto de dose ela recebeu hoje.'",
              "prompt": "Como você responde na simulação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-02:i5:a",
                  "label": "Concordo, se a mama dela medir 4 cm comprimida",
                  "explanation": "A planilha fala de blocos simuladores e do sistema, não da pessoa. Dose para paciente não se calcula aqui."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i5:b",
                  "label": "Só se somarmos as quatro incidências dela",
                  "explanation": "Somar não transforma indicador em dose da pessoa. O erro está em usar a tabela para isso."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i5:c",
                  "label": "A planilha avalia o sistema, não a Dona Marta",
                  "explanation": "O valor é indicador de qualidade, testado por espessura. A pergunta de Dona Marta segue para a equipe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-02:i5:d",
                  "label": "Só depois de aplicar a tolerância da tabela",
                  "explanation": "Tolerância serve para julgar o desempenho do equipamento. Não vira cálculo para uma pessoa."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você prevê a direção das relações entre compressão, espessura, energia, dose e borrão, reconhece o que inabilita o equipamento e sabe que parâmetro é do protocolo aprovado. Esta aula não comprova operação real.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Aqui você aprendeu a explicar relações. Operar é outra etapa, com supervisão e no serviço."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-03",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Posicionamento mamográfico",
            "body": "Hoje você vai conseguir ordenar os passos da MLO em simulação e explicar o que a postura muda na imagem.",
            "dialogue": {
              "setting": "Sala de mamografia, com manequim de treino",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Já vi MLO tremida com compressão ótima. O problema estava nos pés da pessoa examinada."
                },
                {
                  "speaker": "duda",
                  "text": "Nos pés? Mas a mama nem encosta no chão."
                },
                {
                  "speaker": "lia",
                  "text": "Antes de responder, faça a sequência no manequim. Por onde você começa?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Da postura ao sulco inframamário",
            "body": "Na CC, o feixe vai da cabeça aos pés e cobre lateral e medial, sem a porção axilar: sulco inframamário elevado, mamilo de perfil, você na face medial. Na MLO, a ordem ensinada é: girar o tubo até o suporte ficar paralelo ao peitoral maior; pôr o canto do bucky no terço posterior da axila; elevar o braço, sem passar do ombro, e relaxá-lo; suspender e puxar a mama com a mão espalmada; abrir o sulco e comprimir aos poucos. O ângulo muda com o corpo. Ponta de dedo cria pregas. Pés afastados, joelho fletido, quadril torto ou calcanhar erguido tremem a imagem. Não deu: pare, registre e avise.",
            "keyPoints": [
              "O suporte fica paralelo ao peitoral maior da pessoa.",
              "Mão espalmada: ponta de dedo cria pregas.",
              "Pés, joelhos e quadril também mudam a imagem."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Você já conferiu critérios de cobertura. Em qual incidência o peitoral deve descer até a altura do mamilo?"
            },
            "help": "Compare o que cada incidência básica precisa mostrar.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O giro do tubo na MLO acompanha o peitoral, e por isso ele é critério dessa incidência.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Você já conferiu critérios de cobertura. Em qual incidência o peitoral deve descer até a altura do mamilo?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-03:i1:a",
                  "label": "Na médio-lateral oblíqua (MLO)",
                  "explanation": "Isso. O giro do tubo na MLO acompanha o peitoral, e por isso ele é critério dessa incidência."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i1:b",
                  "label": "Na craniocaudal (CC), sempre",
                  "explanation": "Na CC o peitoral aparece só em parte das imagens. A exigência da altura do mamilo é de outra incidência."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i1:c",
                  "label": "Nas duas, com a mesma medida",
                  "explanation": "As duas têm critérios próprios. Retome o que cada incidência precisa mostrar."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i1:d",
                  "label": "Em nenhuma delas: não é critério",
                  "explanation": "É critério, sim. Retome a lista de uma das incidências básicas."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-03:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize a MLO no manequim."
            },
            "help": "Sem o aparelho no ângulo certo, nenhum passo seguinte se sustenta.",
            "type": "ordering",
            "feedback": {
              "correct": "Primeiro o aparelho acompanha o corpo, depois o corpo se acomoda e a mama é trazida. A compressão fecha a sequência.",
              "incorrect": "Algo saiu de lugar: a compressão vem por último e o giro do tubo, primeiro. Retome o conceito."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize a MLO no manequim.",
              "items": [
                {
                  "id": "item:rtg-2026:s-md:aula-03:i2:1",
                  "label": "Girar o tubo até o suporte ficar paralelo ao peitoral maior"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-03:i2:3",
                  "label": "Elevar o braço, sem passar do ombro, e relaxá-lo"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-03:i2:2",
                  "label": "Pôr o canto do bucky no terço posterior da axila"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-03:i2:4",
                  "label": "Suspender e puxar a mama com a mão espalmada"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-03:i2:5",
                  "label": "Abrir o sulco inframamário e comprimir aos poucos"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-md:aula-03:i2:1",
                "item:rtg-2026:s-md:aula-03:i2:2",
                "item:rtg-2026:s-md:aula-03:i2:3",
                "item:rtg-2026:s-md:aula-03:i2:4",
                "item:rtg-2026:s-md:aula-03:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item ao que a aula ensina sobre ele."
            },
            "help": "Separe o que é efeito na imagem do que é referência de posição no corpo.",
            "type": "matching",
            "feedback": {
              "correct": "Cada detalhe da sala tem um efeito ou uma referência. Saber qual ajuda a procurar a causa antes de culpar o aparelho.",
              "incorrect": "Algum par não fecha. Retome o conceito: o que as mãos e os pés provocam, e onde ficam o bucky e o braço."
            },
            "payload": {
              "prompt": "Ligue cada item ao que a aula ensina sobre ele.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-03:i3:1",
                  "left": "Tracionar com a ponta dos dedos",
                  "right": "Pregas indesejadas na imagem"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-03:i3:2",
                  "left": "Calcanhar erguido durante a exposição",
                  "right": "Falta de estabilidade e imagem tremida"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-03:i3:3",
                  "left": "Canto do bucky na MLO",
                  "right": "Terço posterior da axila"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-03:i3:4",
                  "left": "Braço na MLO",
                  "right": "Elevado, sem passar da altura do ombro"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é o próximo passo?"
            },
            "help": "O que a dor dela diz sobre continuar agora?",
            "type": "case-decision",
            "feedback": {
              "correct": "A limitação entra na ficha e a equipe decide como seguir. Você não força e não muda o exame sozinho.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, Dona Dalva conta que não consegue levantar o braço direito dela desde uma cirurgia no ombro. Você tenta acomodar o braço para a MLO do lado direito da paciente, e ela faz cara de dor.",
              "prompt": "Qual é o próximo passo?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-03:i4:a",
                  "label": "Insistir com delicadeza até o braço alcançar",
                  "explanation": "Forçar um braço limitado machuca e não é seu para decidir. Dor é sinal para parar."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i4:b",
                  "label": "Trocar para outra incidência por conta própria",
                  "explanation": "Trocar a incidência existe na rotina, mas a decisão é da equipe e do protocolo, não sua."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i4:c",
                  "label": "Deixar a MLO de fora e não falar sobre isso",
                  "explanation": "O que limitou o exame precisa ficar registrado e chegar à equipe. Omitir tira informação de quem lê."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i4:d",
                  "label": "Parar, registrar a limitação e avisar a equipe",
                  "explanation": "A limitação entra na ficha e a equipe decide como seguir. Você não força e não muda o exame sozinho."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-03:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma MLO de simulação foi descrita como tremida, mesmo com a mama firme. Antes de suspeitar do equipamento, o que você olha na pessoa?"
            },
            "help": "Pense no que, na pessoa, pode se mexer durante a exposição.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Pés longe do aparelho, joelho fletido ou calcanhar erguido tiram a estabilidade, e o corpo se move na exposição.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma MLO de simulação foi descrita como tremida, mesmo com a mama firme. Antes de suspeitar do equipamento, o que você olha na pessoa?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-03:i5:a",
                  "label": "Se os cabelos estão presos",
                  "explanation": "Cabelo pode entrar no feixe, mas isso não treme a imagem. Procure o que mexe o corpo."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i5:b",
                  "label": "Pés, joelhos e quadril dela",
                  "explanation": "Pés longe do aparelho, joelho fletido ou calcanhar erguido tiram a estabilidade, e o corpo se move na exposição."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i5:c",
                  "label": "Se o mamilo está de perfil",
                  "explanation": "Esse é um critério da imagem, mas não faz o corpo tremer. Procure o que sustenta a pessoa."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-03:i5:d",
                  "label": "A cor do avental usado",
                  "explanation": "Avental não muda a estabilidade. Retome o que deixa uma pessoa firme em pé."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-03:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você ordena a MLO no manequim, explica por que mão espalmada e pés firmes contam e reconhece quando parar. O que não der para fazer vira registro e conversa com a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Da próxima vez que uma imagem tremer, olhe para o chão antes de olhar para o aparelho."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-04",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Critérios técnicos",
            "body": "Hoje você vai conseguir conferir uma CC e uma MLO descritas contra os critérios e dizer qual deles falhou.",
            "dialogue": {
              "setting": "Estação de conferência do serviço-escola",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Essa CC não tem peitoral nenhum. Então está reprovada, certo?"
                },
                {
                  "speaker": "caio",
                  "text": "Se fosse assim, eu reprovava mais da metade das minhas CC. Tem outra forma de saber."
                },
                {
                  "speaker": "pixel",
                  "text": "O que uma segunda imagem pode contar sobre a profundidade que entrou na primeira?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Conferir é comparar com uma lista",
            "body": "Na CC: lateral e medial sem cortar glândula, camada adiposa posterior e simetria. O peitoral aparece em só 30% a 40% dessas imagens. Sem ele, compare a distância do mamilo à parte posterior: MLO menos CC deve dar no máximo 1 cm. Na MLO: peitoral maior até a altura do mamilo ou abaixo, prega inframamária, mamilo de perfil, sem borrão, angulação simétrica e pequeno peitoral fora. Se faltar tecido na MLO, o mais provável é que seja do quadrante inferior medial. Dobras, queixo, cabelo ou mão sobre a imagem também contam. Critério falhou: descreva e leve à equipe. O que a imagem mostra é do médico.",
            "keyPoints": [
              "CC sem peitoral não reprova sozinha: compare a profundidade.",
              "MLO menos CC: no máximo 1 cm.",
              "Você nomeia o critério; a equipe decide o que fazer."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, por que a mama é trazida com a mão espalmada, e não com a ponta dos dedos?"
            },
            "help": "Pense no que a pele faz quando é puxada por poucos pontos.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Ponta de dedo cria pregas, e elas entram na conferência de hoje como problema técnico.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, por que a mama é trazida com a mão espalmada, e não com a ponta dos dedos?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-04:i1:a",
                  "label": "Porque assim a exposição fica mais curta",
                  "explanation": "A mão não altera o tempo de exposição. O efeito está na pele e no que aparece na imagem."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i1:b",
                  "label": "Porque a norma proíbe tocar com os dedos",
                  "explanation": "A aula não citou essa proibição. O motivo é técnico: o que a ponta do dedo faz com a pele."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i1:c",
                  "label": "Porque evita pregas indesejadas na imagem",
                  "explanation": "Ponta de dedo cria pregas, e elas entram na conferência de hoje como problema técnico."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i1:d",
                  "label": "Porque aumenta a força aplicada na mama",
                  "explanation": "A força vem da bandeja. Retome o que a mão muda na superfície da pele."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-04:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Numa simulação, com valores fictícios, a CC não mostra peitoral. Do mamilo à parte posterior, a medida é 9,5 cm na MLO e 9,0 cm na CC. O que a comparação indica?"
            },
            "help": "Faça a subtração na ordem do conceito e compare com o limite.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "São 0,5 cm, abaixo do limite de 1 cm. A ausência do peitoral, sozinha, não reprova essa CC.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Numa simulação, com valores fictícios, a CC não mostra peitoral. Do mamilo à parte posterior, a medida é 9,5 cm na MLO e 9,0 cm na CC. O que a comparação indica?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-04:i2:a",
                  "label": "Diferença de 1,5 cm, fora do critério",
                  "explanation": "Refaça a conta: 9,5 menos 9,0. Você pode ter somado alguma parte a mais."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i2:b",
                  "label": "Diferença de 0,5 cm, dentro do critério",
                  "explanation": "São 0,5 cm, abaixo do limite de 1 cm. A ausência do peitoral, sozinha, não reprova essa CC."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i2:c",
                  "label": "Diferença de 0,5 cm, fora do critério",
                  "explanation": "A conta está certa, a leitura não: o limite é de 1 cm, e 0,5 cm fica abaixo dele."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i2:d",
                  "label": "Sem peitoral, as medidas não se comparam",
                  "explanation": "É justamente sem o peitoral que essa comparação ajuda. Retome o conceito."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-04:i2:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada descrição ao critério técnico que ela aponta."
            },
            "help": "Pergunte o que está faltando ou sobrando em cada imagem.",
            "type": "matching",
            "feedback": {
              "correct": "Você nomeou o critério sem falar de achado. É essa descrição que a equipe precisa para decidir.",
              "incorrect": "Algum par ligou a descrição ao critério errado. Retome as listas de CC e de MLO no conceito."
            },
            "payload": {
              "prompt": "Ligue cada descrição ao critério técnico que ela aponta.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-04:i3:1",
                  "left": "MLO sem a prega inframamária",
                  "right": "Faltou a parte inferior na cobertura da MLO"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-04:i3:2",
                  "left": "CC sem a camada adiposa posterior",
                  "right": "A parte posterior pode ter ficado de fora"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-04:i3:3",
                  "left": "Duas MLO com ângulos diferentes",
                  "right": "Simetria da angulação não cumprida"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-04:i3:4",
                  "left": "Queixo projetado sobre a mama",
                  "right": "Outra região do corpo sobre a imagem"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "Faça a conta primeiro. Depois pense no que uma nova CC significa para a pessoa.",
            "type": "case-decision",
            "feedback": {
              "correct": "A diferença é de 1,5 cm, acima do limite. Repetir é nova exposição: você descreve e a equipe decide.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, a CC de Dona Marta não tem peitoral e não mostra a gordura posterior. A distância do mamilo à parte posterior é 10,0 cm na MLO e 8,5 cm na CC. Ela ainda está na sala, e um colega sugere fazer a CC de novo logo, para não perder tempo.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-04:i4:a",
                  "label": "Descrever o critério e levar à equipe",
                  "explanation": "A diferença é de 1,5 cm, acima do limite. Repetir é nova exposição: você descreve e a equipe decide."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i4:b",
                  "label": "Repetir a CC e só depois avisar a equipe",
                  "explanation": "Repetir é nova exposição para a pessoa. Essa decisão vem antes, com a equipe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i4:c",
                  "label": "Apagar a CC para não confundir o laudo",
                  "explanation": "Apagar esconde o que aconteceu e prejudica o registro. O caminho é descrever o critério que falhou."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i4:d",
                  "label": "Aceitar, porque peitoral é raro na CC",
                  "explanation": "A falta do peitoral é comum, mas a gordura posterior e a medida também falharam aqui. Confira a conta."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-04:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Um colega de outro serviço escreve: 'CC sem peitoral é sempre um erro de posicionamento.' Como você responde, com o que aprendeu hoje?"
            },
            "help": "Retome o que entra no lugar do peitoral na conferência da CC.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A ausência do peitoral é comum. A adequação se confere pela distância na MLO e na CC.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Um colega de outro serviço escreve: 'CC sem peitoral é sempre um erro de posicionamento.' Como você responde, com o que aprendeu hoje?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-04:i5:a",
                  "label": "Concordo: toda CC precisa mostrar peitoral",
                  "explanation": "O peitoral aparece só em parte das CC, por diferenças anatômicas. Essa exigência não se sustenta."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i5:b",
                  "label": "Concordo, salvo em mama de maior volume",
                  "explanation": "A aula não trouxe essa exceção. A resposta vem de outra comparação."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i5:c",
                  "label": "Discordo: sem peitoral, a CC é sempre aceita",
                  "explanation": "Sem peitoral, a conferência continua. Falta dizer como ela é feita."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-04:i5:d",
                  "label": "Discordo: compara-se a profundidade com a MLO",
                  "explanation": "A ausência do peitoral é comum. A adequação se confere pela distância na MLO e na CC."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-04:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você confere CC e MLO contra uma lista, compara a profundidade entre as duas e nomeia o critério que falhou. Repetir e interpretar não são decisões suas: você descreve e leva à equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Uma boa descrição técnica poupa uma exposição desnecessária. É uma contribuição concreta."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-05",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:s-md:radiologyinfo-mammography"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Tecnologias e complementos",
            "body": "Hoje você vai conseguir distinguir sistemas, tomossíntese e complementos e dizer quem indica cada um.",
            "dialogue": {
              "setting": "Corredor do setor de imagem",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "Minha vizinha fez uma tal de tomossíntese. É melhor? Não dá para pular o aperto com ela?"
                },
                {
                  "speaker": "duda",
                  "text": "E quando chamam a pessoa de volta para mais uma imagem? Sou eu quem pede?"
                },
                {
                  "speaker": "pixel",
                  "text": "Duas boas perguntas. O que muda em cada tecnologia, e quem responde por escolher?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Conhecer é diferente de indicar",
            "body": "O receptor pode ser tela-filme, placa lida num digitalizador (CR) ou detector direto (DR). Na tomossíntese, o tubo faz um arco sobre a mama comprimida e as projeções viram cortes finos. Ela complementa a mamografia e pode usar mais dose que a 2D, conforme o sistema, sem passar dos valores de referência. O CAD destaca áreas para o radiologista rever. Ultrassonografia e ressonância magnética não usam radiação ionizante. Incidência complementar estuda região específica, como CC exagerada lateral ou medial e axilar; manobra varia a técnica, como a compressão seletiva, que espalha uma área pequena. Ampliação geométrica é nova exposição; a digital, no monitor, não. Indicar complemento é do radiologista.",
            "keyPoints": [
              "Tomossíntese mantém a compressão e complementa a mamografia.",
              "Ampliação geométrica expõe de novo; a digital não.",
              "Quem indica complemento é o radiologista."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, você conferiu uma MLO sem a prega inframamária. O que acontece depois da sua conferência?"
            },
            "help": "Foi um problema técnico, e a conduta é a mesma da aula anterior.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Esse padrão continua hoje: você conhece o recurso e a decisão de usá-lo fica com quem responde por ela.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, você conferiu uma MLO sem a prega inframamária. O que acontece depois da sua conferência?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-05:i1:a",
                  "label": "Você repete a incidência e anota depois",
                  "explanation": "Repetir é nova exposição e não é decisão sua. Retome a ordem: descrever e levar."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i1:b",
                  "label": "Você descreve e a equipe decide o que fazer",
                  "explanation": "Esse padrão continua hoje: você conhece o recurso e a decisão de usá-lo fica com quem responde por ela."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i1:c",
                  "label": "Você pede logo uma incidência complementar",
                  "explanation": "Pedir complemento é indicar. Retome quem responde por isso."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i1:d",
                  "label": "Você dispensa a pessoa sem mais conversa",
                  "explanation": "A imagem precisa ser vista antes de a pessoa sair. Retome o papel da equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada recurso, que você só executa com a equipe, ao que ele mostra ou faz."
            },
            "help": "Leia o nome de cada recurso com calma: quase todos dizem a região.",
            "type": "matching",
            "feedback": {
              "correct": "Você reconheceu o que cada recurso faz. A escolha de quando usar continua sendo do radiologista.",
              "incorrect": "Algum recurso ficou com a função de outro. Os próprios nomes ajudam: lateral, medial, axilar e seletiva."
            },
            "payload": {
              "prompt": "Ligue cada recurso, que você só executa com a equipe, ao que ele mostra ou faz.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-05:i2:1",
                  "left": "CC exagerada lateralmente",
                  "right": "Mais exposição dos quadrantes laterais"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-05:i2:2",
                  "left": "CC exagerada medialmente",
                  "right": "Quadrantes mediais, com o sulco entre as mamas"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-05:i2:3",
                  "left": "Incidência axilar",
                  "right": "Imagem dirigida à região da axila"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-05:i2:4",
                  "left": "Compressão seletiva",
                  "right": "Espalha o tecido de uma área pequena"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Numa simulação, duas formas de ampliar são comparadas: uma com o dispositivo no mamógrafo e outra no monitor. Qual delas expõe a pessoa de novo?"
            },
            "help": "Qual das duas precisa do feixe ligado de novo?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A ampliação geométrica é uma nova aquisição. Por isso ela também passa pela indicação médica.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Numa simulação, duas formas de ampliar são comparadas: uma com o dispositivo no mamógrafo e outra no monitor. Qual delas expõe a pessoa de novo?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-05:i3:a",
                  "label": "A ampliação feita no monitor",
                  "explanation": "No monitor, o trabalho é sobre a imagem que já existe. Não há novo feixe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i3:b",
                  "label": "As duas, na mesma proporção",
                  "explanation": "Elas diferem exatamente nisso. Pergunte onde cada uma acontece."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i3:c",
                  "label": "Nenhuma delas expõe de novo",
                  "explanation": "Usar o dispositivo no mamógrafo exige nova aquisição. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i3:d",
                  "label": "A ampliação com o dispositivo",
                  "explanation": "A ampliação geométrica é uma nova aquisição. Por isso ela também passa pela indicação médica."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-05:i3:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz com o que notou?"
            },
            "help": "Quem pode indicar e quem pode classificar? Onde você entra nessa cadeia?",
            "type": "case-decision",
            "feedback": {
              "correct": "A imagem é mostrada ao médico antes de liberar a pessoa, e é dele a indicação de qualquer complemento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, ao terminar as quatro incidências, você nota na tela uma área que chama sua atenção. Duda cochicha: 'Faz uma compressão seletiva ali, já adianta. Ou anota uma categoria na ficha.' A pessoa espera na sala.",
              "prompt": "O que você faz com o que notou?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-05:i4:a",
                  "label": "Faz a compressão seletiva para adiantar",
                  "explanation": "É uma nova exposição indicada por você. Essa indicação é do radiologista."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i4:b",
                  "label": "Anota uma categoria BI-RADS na ficha",
                  "explanation": "Categoria é classificação do laudo. Na sua ficha entra o que é técnico e o que a pessoa relatou."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i4:c",
                  "label": "Mostra as imagens ao médico responsável",
                  "explanation": "A imagem é mostrada ao médico antes de liberar a pessoa, e é dele a indicação de qualquer complemento."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i4:d",
                  "label": "Sugere à pessoa um ultrassom por precaução",
                  "explanation": "Sugerir exame é conduta médica e ainda assusta a pessoa. Leve o que notou à equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-05:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Dona Marta pergunta se, com tomossíntese, dá para fazer o exame sem o aperto. Que informação técnica você pode dar, sem indicar exame?"
            },
            "help": "Lembre como a aquisição acontece, do tubo até a mama.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O tubo faz um arco sobre a mama comprimida. Saber se ela fará esse exame é assunto do médico.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Dona Marta pergunta se, com tomossíntese, dá para fazer o exame sem o aperto. Que informação técnica você pode dar, sem indicar exame?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-05:i5:a",
                  "label": "Nela, a mama também fica comprimida",
                  "explanation": "O tubo faz um arco sobre a mama comprimida. Saber se ela fará esse exame é assunto do médico."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i5:b",
                  "label": "Não há compressão, porque ela usa cortes",
                  "explanation": "Os cortes vêm da reconstrução, depois da aquisição. A mama continua comprimida."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i5:c",
                  "label": "Só comprime se a mama for muito densa",
                  "explanation": "Essa condição não foi ensinada e não é o que a fonte descreve. A compressão faz parte do método."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-05:i5:d",
                  "label": "Ela substitui de vez a mamografia comum",
                  "explanation": "A tomossíntese é complementar, não substituta, e essa frase ainda soa como indicação."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-05:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você distingue sistemas, tomossíntese e complementos e sabe quais expõem de novo. Sabe também onde termina o seu papel: reconhecer e executar com a equipe. Indicar e classificar são do radiologista.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Conhecer os nomes ajuda você a preparar a sala. O pedido vem de quem responde por ele."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-06",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:radiologyinfo-dxa",
          "source:rtg-2026:s-md:iscd-official-positions-adult"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Fundamentos e instrumentação da densitometria",
            "body": "Hoje você vai conseguir explicar como regiões, simulador e precisão sustentam uma medida confiável na densitometria.",
            "dialogue": {
              "setting": "Sala de densitometria do serviço-escola",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Segunda de manhã, antes de todo mundo: o simulador vai para a mesa. É como conferir a balança antes de pesar alguém."
                },
                {
                  "speaker": "duda",
                  "text": "E a precisão? O folheto do fabricante traz um número ótimo. Não dá para usar esse?"
                },
                {
                  "speaker": "lia",
                  "text": "Boa pergunta. Quem posiciona no folheto? E quem posiciona aqui?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Uma medida se sustenta no que vem antes",
            "body": "O aparelho central mede coluna e quadril; o periférico, punho, calcanhar ou dedo. Em adultos, a referência pede L1 a L4 em projeção posteroanterior e o quadril. O antebraço, no rádio 33% do lado não dominante da pessoa, entra quando a equipe o indica. Qualidade: ao menos uma vez por semana, escanear o simulador, registrar no gráfico, comparar com o limite do serviço e, fora dele, avisar a equipe para acionar a manutenção. Confira o simulador após todo reparo. Cada serviço mede a própria precisão, com consentimento: 15 pessoas 3 vezes ou 30 pessoas 2 vezes, reposicionando. Escores ficam no laudo.",
            "keyPoints": [
              "Coluna de L1 a L4 e quadril são as regiões de referência em adultos.",
              "Simulador ao menos uma vez por semana e após todo reparo.",
              "A precisão é a do serviço, nunca a do folheto."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Você já viu o exame da coluna na densitometria. Para que as pernas da pessoa sobem num bloco?"
            },
            "help": "Pense na curva da parte baixa das costas quando alguém deita com as pernas retas.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O bloco acomoda as pernas e aplaina a região medida. Hoje você vê o que sustenta a medida além da posição.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Você já viu o exame da coluna na densitometria. Para que as pernas da pessoa sobem num bloco?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-06:i1:a",
                  "label": "Para aplainar a pelve e a parte baixa da coluna",
                  "explanation": "O bloco acomoda as pernas e aplaina a região medida. Hoje você vê o que sustenta a medida além da posição."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i1:b",
                  "label": "Para a pessoa ficar mais confortável, só isso",
                  "explanation": "Conforto ajuda, mas o bloco tem função técnica. Retome o que ele faz na pelve."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i1:c",
                  "label": "Para girar o quadril da pessoa para dentro",
                  "explanation": "Girar o quadril é do exame do fêmur, com o pé no suporte. Retome a coluna."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i1:d",
                  "label": "Para aproximar as vértebras do detector",
                  "explanation": "A função ensinada é outra. Retome o que muda na pelve e na lombar."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-06:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item à referência ensinada nesta aula."
            },
            "help": "Separe primeiro as regiões do corpo. Depois veja o que resta para a rotina.",
            "type": "matching",
            "feedback": {
              "correct": "Regiões, rotina e método estão ligados. Saber essas referências ajuda você a acompanhar o protocolo do serviço.",
              "incorrect": "Algum par trocou região com rotina. Retome o conceito: duas linhas falam de onde medir e duas de como conferir."
            },
            "payload": {
              "prompt": "Ligue cada item à referência ensinada nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-06:i2:1",
                  "left": "Região da coluna no adulto",
                  "right": "L1 a L4, em projeção posteroanterior"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-06:i2:2",
                  "left": "Região do antebraço, se indicada",
                  "right": "Rádio 33% do lado não dominante da pessoa"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-06:i2:3",
                  "left": "Simulador do aparelho",
                  "right": "Ao menos uma vez por semana"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-06:i2:4",
                  "left": "Repetições para medir a precisão",
                  "right": "15 pessoas 3 vezes ou 30 pessoas 2 vezes"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize a rotina com o simulador."
            },
            "help": "Para comparar, você precisa de um valor registrado.",
            "type": "ordering",
            "feedback": {
              "correct": "A medida só vira informação quando entra no gráfico e encontra um limite definido de antemão.",
              "incorrect": "Alguma etapa veio antes de ter o que usar. Retome: medir, registrar, comparar e agir."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize a rotina com o simulador.",
              "items": [
                {
                  "id": "item:rtg-2026:s-md:aula-06:i3:1",
                  "label": "Escanear o simulador"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-06:i3:2",
                  "label": "Registrar o valor no gráfico de controle"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-06:i3:4",
                  "label": "Fora do limite: avisar a equipe para acionar a manutenção"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-06:i3:3",
                  "label": "Comparar com o limite definido pelo serviço"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-md:aula-06:i3:1",
                "item:rtg-2026:s-md:aula-06:i3:2",
                "item:rtg-2026:s-md:aula-06:i3:3",
                "item:rtg-2026:s-md:aula-06:i3:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você responde na simulação?"
            },
            "help": "A pessoa veio para o exame dela. Essa repetição é para quem?",
            "type": "case-decision",
            "feedback": {
              "correct": "A avaliação de precisão pede o consentimento de quem participa, e a organização é da equipe, pelo protocolo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "O serviço-escola vai medir a precisão da equipe. Um colega sugere aproveitar quem veio fazer o exame e repetir a aquisição, reposicionando, sem comentar nada, 'porque é rapidinho e a dose é baixa'.",
              "prompt": "O que você responde na simulação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-06:i4:a",
                  "label": "Tudo bem, pois a dose é mesmo muito baixa",
                  "explanation": "Dose baixa não elimina o direito de saber e de aceitar. A repetição tem outro objetivo, e a pessoa precisa saber."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i4:b",
                  "label": "Só com consentimento de quem participar",
                  "explanation": "A avaliação de precisão pede o consentimento de quem participa, e a organização é da equipe, pelo protocolo."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i4:c",
                  "label": "Tudo bem, desde que seja o mesmo aparelho",
                  "explanation": "Usar o mesmo aparelho é parte do método, mas não responde à questão da pessoa saber e aceitar."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i4:d",
                  "label": "Só repito se ninguém mais estiver na sala",
                  "explanation": "Sem testemunhas, o problema continua: a pessoa não foi informada. Retome o que a referência pede."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-06:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma clínica nova compra um densitômetro, e o manual traz um valor excelente de precisão. Para o acompanhamento das pessoas, qual valor vale?"
            },
            "help": "De quem é o trabalho que esse número precisa representar?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Cada serviço determina a própria precisão, porque ela precisa refletir o aparelho e a equipe dali.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma clínica nova compra um densitômetro, e o manual traz um valor excelente de precisão. Para o acompanhamento das pessoas, qual valor vale?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-06:i5:a",
                  "label": "O valor do manual, por ser do fabricante",
                  "explanation": "A referência diz para não usar a precisão do fabricante. Ela não mede o trabalho da equipe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i5:b",
                  "label": "O valor que uma clínica vizinha publicou",
                  "explanation": "Outra equipe e outro aparelho geram outra precisão. Procure quem precisa medir."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i5:c",
                  "label": "A média entre o manual e a clínica vizinha",
                  "explanation": "Fazer média de dois valores alheios não traz a medida desta equipe. Retome a referência."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-06:i5:d",
                  "label": "O valor que a própria clínica medir",
                  "explanation": "Cada serviço determina a própria precisão, porque ela precisa refletir o aparelho e a equipe dali."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-06:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você explica por que coluna e quadril são as regiões de referência, como o simulador protege a medida e por que a precisão é do serviço. A leitura de escores e a classificação ficam no laudo médico.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Antes de discutir um número, vale perguntar se o aparelho e a equipe o sustentam."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-07",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-07"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:iscd-official-positions-adult",
          "source:rtg-2026:s-md:radiologyinfo-dxa",
          "source:rtg-2026:s-md:anvisa-rdc-611-2022"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-07:abertura",
          "role": "hook",
          "payload": {
            "title": "Posição e qualidade na densitometria",
            "body": "Hoje você vai conseguir preparar e posicionar em simulação e dizer o que impede comparar dois exames de densitometria.",
            "dialogue": {
              "setting": "Sala de densitometria, recepção da pessoa",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Neide",
                  "text": "Trouxe meu exame de 2 anos atrás, de outra clínica. Hoje dá para saber se eu perdi osso, não é?"
                },
                {
                  "speaker": "duda",
                  "text": "É só pôr os dois números lado a lado, não? Parece simples."
                },
                {
                  "speaker": "caio",
                  "text": "Antes dos números, me diga: que aparelho fez o primeiro? E o que ela tomou ou fez nos últimos dias?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-07:conceito",
          "role": "concept",
          "payload": {
            "title": "Medir igual para poder comparar",
            "body": "Preparo: retirar metal, joias e óculos; perguntar sobre possível gravidez, cálcio em 24 horas e exame recente com contraste, bário ou radioisótopo, que pode pedir espera. Dúvida: equipe. A ordem ensinada para a coluna: preparar, deitar, pernas no bloco, pedir imobilidade, registrar limites. No fêmur, o pé vai ao suporte que gira o quadril para dentro. Comparar exige o mesmo aparelho ou calibração cruzada; sem ela, não há comparação numérica, só nova linha de base. O relatório diz qual estudo e região compara e não traz mudança abaixo da menor mudança significativa do serviço. Exame de fora: anote fabricante e modelo. Deformidade, cirurgia na coluna ou fratura: registre.",
            "keyPoints": [
              "Metal, cálcio, contraste e possível gravidez entram no preparo.",
              "Pernas no bloco para a coluna; pé no suporte para o fêmur.",
              "Sem calibração cruzada, não há comparação numérica."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-07:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-07"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que o serviço escaneia ao menos uma vez por semana para conferir o aparelho?"
            },
            "help": "É um objeto que não muda de uma semana para outra.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "O simulador mostra se o aparelho continua estável, e isso ajuda a sustentar a comparação de exames.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que o serviço escaneia ao menos uma vez por semana para conferir o aparelho?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-07:i1:a",
                  "label": "Uma pessoa voluntária da própria equipe",
                  "explanation": "Expor alguém para conferir o aparelho não é a rotina ensinada. Retome o que vai à mesa."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i1:b",
                  "label": "O folheto de calibração do fabricante",
                  "explanation": "Folheto não vai à mesa e não mede o seu aparelho. Retome a rotina."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i1:c",
                  "label": "Um simulador, com valor acompanhado",
                  "explanation": "O simulador mostra se o aparelho continua estável, e isso ajuda a sustentar a comparação de exames."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i1:d",
                  "label": "A coluna de um exame já feito antes",
                  "explanation": "Reprocessar um exame não testa o aparelho hoje. Retome a rotina da aula."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-07:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-07:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item do preparo à conduta que você adota na simulação."
            },
            "help": "Separe o que você resolve na hora do que precisa de outra pessoa decidir.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada item à conduta certa. Parte se resolve na hora; o resto segue para a equipe.",
              "incorrect": "Algum item ficou com a conduta de outro. Retome o preparo no conceito."
            },
            "payload": {
              "prompt": "Ligue cada item do preparo à conduta que você adota na simulação.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-07:i2:1",
                  "left": "Colar e óculos",
                  "right": "Retirar antes de posicionar"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-07:i2:2",
                  "left": "Suplemento de cálcio",
                  "right": "Perguntar: ao menos 24 horas sem tomar"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-07:i2:3",
                  "left": "Exame recente com contraste ou bário",
                  "right": "Avisar a equipe, pois pode pedir espera"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-07:i2:4",
                  "left": "Possibilidade de gravidez",
                  "right": "Parar e avisar antes de qualquer exposição"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-07:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize o exame da coluna na simulação."
            },
            "help": "Só dá para registrar o que limitou depois que a aquisição aconteceu.",
            "type": "ordering",
            "feedback": {
              "correct": "Preparo primeiro, porque o metal precisa sair antes da aquisição. Registro por último, com o que de fato aconteceu.",
              "incorrect": "Alguma etapa ficou fora de lugar. Retome a sequência do conceito, do preparo ao registro."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize o exame da coluna na simulação.",
              "items": [
                {
                  "id": "item:rtg-2026:s-md:aula-07:i3:4",
                  "label": "Pedir que fique imóvel durante a aquisição"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-07:i3:2",
                  "label": "Deitar a pessoa na mesa"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-07:i3:3",
                  "label": "Apoiar as pernas no bloco"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-07:i3:5",
                  "label": "Registrar o que limitou o exame"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-07:i3:1",
                  "label": "Fazer o preparo e ouvir o relato da pessoa"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-md:aula-07:i3:1",
                "item:rtg-2026:s-md:aula-07:i3:2",
                "item:rtg-2026:s-md:aula-07:i3:3",
                "item:rtg-2026:s-md:aula-07:i3:4",
                "item:rtg-2026:s-md:aula-07:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-07:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: Como você responde a Dona Neide?"
            },
            "help": "Nessa pergunta, o que é técnica e o que é resultado?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você não lê escore nem classifica. Registra o exame anterior, com aparelho se houver, e leva a pergunta à equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Dona Neide mostra na simulação o papel do exame de outra clínica, aponta um número e pergunta: 'Comparando com o de hoje, eu perdi osso? É osteoporose?' Na tela, o valor de hoje está à vista.",
              "prompt": "Como você responde a Dona Neide?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-07:i4:a",
                  "label": "O médico compara e dá o resultado; registro o exame",
                  "explanation": "Você não lê escore nem classifica. Registra o exame anterior, com aparelho se houver, e leva a pergunta à equipe."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i4:b",
                  "label": "Compara os dois números e responde à pergunta",
                  "explanation": "Comparar valores de aparelhos diferentes pode nem ser válido, e responder seria interpretar. Isso é laudo."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i4:c",
                  "label": "Diz que o número está bom, para tranquilizá-la",
                  "explanation": "Tranquilizar com uma leitura que você não pode fazer também é dar resultado. Retome o seu papel."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i4:d",
                  "label": "Explica o que o escore significa para o caso dela",
                  "explanation": "Explicar o escore no caso dela é interpretar para uma pessoa. Essa conversa é do médico."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-07:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-07:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-07"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você leva à equipe?"
            },
            "help": "O que precisa existir entre os dois aparelhos para os valores conversarem?",
            "type": "case-decision",
            "feedback": {
              "correct": "Não se relata mudança entre aparelhos sem calibração cruzada. O novo aparelho começa outra linha de base.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Um serviço troca o densitômetro por outro de fabricante diferente. Por uma falha de planejamento, não houve calibração cruzada. Um colega quer mostrar no relatório de acompanhamento a diferença em relação ao aparelho antigo.",
              "prompt": "O que você leva à equipe?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-07:i5:a",
                  "label": "A diferença vale, se a pessoa for a mesma",
                  "explanation": "A mesma pessoa em aparelhos não calibrados entre si não garante comparação. Retome a condição."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i5:b",
                  "label": "Sem calibração cruzada, não há comparação",
                  "explanation": "Não se relata mudança entre aparelhos sem calibração cruzada. O novo aparelho começa outra linha de base."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i5:c",
                  "label": "A diferença vale, se o simulador estiver bom",
                  "explanation": "O simulador confere um aparelho. Aqui a questão é ligar os dois."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-07:i5:d",
                  "label": "Basta somar a precisão dos dois aparelhos",
                  "explanation": "Essa soma não foi ensinada e não substitui a calibração cruzada entre os aparelhos."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-07:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-07:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você prepara e posiciona em simulação, sabe por que mudar de aparelho sem calibração cruzada impede a comparação e registra o que limitou. Comparar resultados e classificar são do médico.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Número sem história engana. O seu registro é a história desse número."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-md:aula-08",
      "competencyIds": [
        "competency:rtg-2026:s-md:aula-08"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-md-v1",
        "sourceIds": [
          "source:rtg-2026:s-md:iscd-official-positions-adult",
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:s-md:radiologyinfo-dxa"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-08:abertura",
          "role": "hook",
          "payload": {
            "title": "Caso integrado",
            "body": "Hoje você vai conseguir avaliar cobertura técnica e documentação de um caso simulado e levar as dúvidas à equipe.",
            "dialogue": {
              "setting": "Simulação final no serviço-escola",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje a ficha é de Dona Ivone, fictícia, com pedido de mamografia e densitometria. Você conduz o raciocínio."
                },
                {
                  "speaker": "paciente",
                  "name": "Dona Ivone",
                  "text": "Vim fazer os dois de uma vez. Ao final, já dá para me dizer se está tudo bem?"
                },
                {
                  "speaker": "pixel",
                  "text": "Dessa pergunta, o que é seu para responder? E o que você consegue conferir, passo a passo?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-08:conceito",
          "role": "concept",
          "payload": {
            "title": "Técnica e registro, do começo ao fim",
            "body": "A ordem ensinada tem cinco passos. Identificar e acolher. Perguntar sobre gravidez, implante e metal. Conferir a cobertura: critérios de CC e MLO e, na densitometria, região e lado. Documentar: desvio da rotina, o que a pessoa relatou, resíduo na pele, cicatriz no esquema da mama, exame anterior com fabricante e modelo. Levar as dúvidas à equipe. Na mamografia digital, o profissional insere instituição, pessoa, incidência, lado e as próprias iniciais; kV e mAs vêm do aparelho. Região sem validade técnica não entra no relatório, e o motivo é dito. Você avalia técnica e registro; não classifica achado nem indica exame. Esta unidade não comprova operação real.",
            "keyPoints": [
              "Identificar, perguntar, conferir, documentar, levar à equipe.",
              "Você descreve o que é técnico e o que limitou o exame.",
              "Resultado e classificação são do médico."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-08:i1",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-08"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, por que importa registrar o fabricante e o modelo de um exame de densitometria feito em outro serviço?"
            },
            "help": "O que precisa existir entre dois aparelhos para os valores conversarem?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Sem saber qual aparelho fez o exame, não dá para saber se os dois valores podem ser comparados.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, por que importa registrar o fabricante e o modelo de um exame de densitometria feito em outro serviço?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-08:i1:a",
                  "label": "Para cobrar o exame da clínica anterior",
                  "explanation": "Cobrança não é o assunto aqui. Pense no que esses dados dizem sobre a medida."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i1:b",
                  "label": "Para escolher o aparelho mais moderno",
                  "explanation": "A pergunta não é sobre preferência. É sobre o que dá para fazer com os dois valores."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i1:c",
                  "label": "Para você já calcular a perda de massa óssea",
                  "explanation": "Esse cálculo seria interpretação, e não é seu. O dado serve a quem avalia a comparação."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i1:d",
                  "label": "Para a equipe saber se a comparação vale",
                  "explanation": "Sem saber qual aparelho fez o exame, não dá para saber se os dois valores podem ser comparados."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-08:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-08:i2",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Na ordem ensinada nesta aula, organize o caso de Dona Ivone."
            },
            "help": "Só dá para conferir depois de fazer, e só dá para encaminhar depois de saber o que levar.",
            "type": "ordering",
            "feedback": {
              "correct": "Você foi de quem é a pessoa até quem decide o próximo passo, sem pular o registro.",
              "incorrect": "Alguma etapa veio fora de lugar. Retome os cinco passos do conceito."
            },
            "payload": {
              "prompt": "Na ordem ensinada nesta aula, organize o caso de Dona Ivone.",
              "items": [
                {
                  "id": "item:rtg-2026:s-md:aula-08:i2:4",
                  "label": "Documentar o que limitou o exame"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-08:i2:3",
                  "label": "Conferir cobertura e região nas imagens"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-08:i2:2",
                  "label": "Perguntar sobre gravidez, implante e metal"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-08:i2:5",
                  "label": "Levar as dúvidas à equipe"
                },
                {
                  "id": "item:rtg-2026:s-md:aula-08:i2:1",
                  "label": "Identificar a pessoa e acolher"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-md:aula-08:i2:1",
                "item:rtg-2026:s-md:aula-08:i2:2",
                "item:rtg-2026:s-md:aula-08:i2:3",
                "item:rtg-2026:s-md:aula-08:i2:4",
                "item:rtg-2026:s-md:aula-08:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-08:i3",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada situação ao registro que ela pede."
            },
            "help": "Pergunte o que quem lê precisaria saber sobre cada situação.",
            "type": "matching",
            "feedback": {
              "correct": "Cada situação foi para o lugar certo. Assim, quem lê sabe o que aconteceu sem precisar adivinhar.",
              "incorrect": "Algum registro não ajuda quem vai ler aquela situação. Retome o que precisa ficar documentado."
            },
            "payload": {
              "prompt": "Ligue cada situação ao registro que ela pede.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-md:aula-08:i3:1",
                  "left": "Resíduo de desodorante na pele",
                  "right": "Observação na ficha da mamografia"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-08:i3:2",
                  "left": "Cicatriz na mama",
                  "right": "Desenho do local no esquema da mama"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-08:i3:3",
                  "left": "Mudança na rotina do exame",
                  "right": "Anotar a modificação e o motivo"
                },
                {
                  "id": "pair:rtg-2026:s-md:aula-08:i3:4",
                  "left": "Densitometria anterior em outra clínica",
                  "right": "Fabricante e modelo do aparelho anterior"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-08:i4",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante da pergunta?"
            },
            "help": "Separe três coisas: o que é técnico, o que você notou e o que é resultado.",
            "type": "case-decision",
            "feedback": {
              "correct": "Você diz quem dá o resultado e descreve à equipe o que notou, sem opinar sobre o que significa.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "No fim do caso, a descrição das imagens de Dona Ivone cumpre os critérios de CC e MLO, mas traz uma área que você não sabe explicar. Ela pergunta: 'Está tudo bem? Meus ossos estão fracos?' Um colega sugere anotar uma categoria na ficha, para adiantar.",
              "prompt": "O que você faz diante da pergunta?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-08:i4:a",
                  "label": "Diz que está tudo bem, porque cumpriu os critérios",
                  "explanation": "Critério cumprido fala da técnica, não do resultado. Dizer que está tudo bem é dar resultado."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i4:b",
                  "label": "Anota a categoria na ficha, como foi sugerido",
                  "explanation": "Categoria pertence ao laudo. Sua ficha descreve o técnico e o que a pessoa relatou."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i4:c",
                  "label": "Explica que o médico avalia e leva o que notou",
                  "explanation": "Você diz quem dá o resultado e descreve à equipe o que notou, sem opinar sobre o que significa."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i4:d",
                  "label": "Sugere a ela um exame complementar da região",
                  "explanation": "Sugerir exame é indicar, e não cabe a você. O que notou vai para a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-08:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-md:aula-08:i5",
            "competencyIds": [
              "competency:rtg-2026:s-md:aula-08"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você leva à equipe?"
            },
            "help": "O que alguém precisaria saber para decidir sem ter estado na sala?",
            "type": "case-decision",
            "feedback": {
              "correct": "Você descreve cada desvio com os dados que permitem decidir. A equipe vê se e como repetir.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Em outro dia da simulação, Seu Rui faz os dois exames. Na MLO do lado direito do paciente, a prega inframamária ficou fora. Na densitometria, um cinto com fivela de metal ficou sobre a região do quadril. Ele já se vestiu e aguarda na recepção.",
              "prompt": "O que você leva à equipe?",
              "options": [
                {
                  "id": "option:rtg-2026:s-md:aula-08:i5:a",
                  "label": "Os dois desvios, com o lado e o que foi feito",
                  "explanation": "Você descreve cada desvio com os dados que permitem decidir. A equipe vê se e como repetir."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i5:b",
                  "label": "Só a MLO, porque a densitometria é outra sala",
                  "explanation": "O metal devia ter saído no preparo da densitometria. Os dois desvios precisam ser informados."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i5:c",
                  "label": "Nada: chamo Seu Rui e repito os dois sozinho",
                  "explanation": "Repetir é nova exposição e não é decisão sua. Primeiro, a equipe precisa saber."
                },
                {
                  "id": "option:rtg-2026:s-md:aula-08:i5:d",
                  "label": "Só uma nota de que o exame precisa ser refeito",
                  "explanation": "Essa nota já decide pela equipe e não diz o que aconteceu. Descreva os desvios."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-md:aula-08:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-md:aula-08:fecho",
          "role": "closing",
          "payload": {
            "title": "O que você consegue fazer agora",
            "body": "Você avalia cobertura e documentação em um caso inteiro e leva as dúvidas à equipe, sem classificar achado nem indicar exame. Esta unidade treina raciocínio em simulação e não comprova operação real.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "A prática real vem com supervisão. O que você leva daqui é a forma de pensar o caso."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:s-md",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-01"
        ],
        "prompt": "A descrição de uma imagem de simulação diz que a camada de gordura posterior foi incluída. O que isso indica na técnica?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-01:c1:a",
            "label": "Que a pessoa tem mais gordura do que glândula"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c1:b",
            "label": "Que o controle de exposição foi bem ajustado"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c1:c",
            "label": "Que não há nenhum achado nessa região"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c1:d",
            "label": "Que a mama foi mobilizada sem perder glândula"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-01:c1:d",
        "feedback": {
          "correct": "A gordura posterior é referência: se ela aparece, a mama foi bem trazida e a glândula não ficou de fora.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-01"
        ],
        "prompt": "Qual fala explica a compressão com respeito e sem prometer o que você não pode garantir?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-01:c2:a",
            "label": "'Incomoda, dura alguns segundos. Me avise se doer.'"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c2:b",
            "label": "'Fica tranquila, meu bem, isso aqui não dói nada.'"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c2:c",
            "label": "'Tem que apertar bastante, então só aguente firme.'"
          },
          {
            "id": "option:rtg-2026:s-md:aula-01:c2:d",
            "label": "'Todo mundo aguenta, não vai ser diferente agora.'"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-01:c2:a",
        "feedback": {
          "correct": "A fala é honesta sobre o incômodo, diz quanto dura e deixa combinado como a pessoa pode avisar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
          "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-02"
        ],
        "prompt": "Um colega afirma: 'Toda mama tem de ser comprimida entre 150 N e 200 N, é a norma.' Pelo parecer do CBR visto nesta aula, o que é esse intervalo?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-02:c1:a",
            "label": "O alvo obrigatório de força para cada pessoa"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c1:b",
            "label": "A força máxima do modo automático, em teste"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c1:c",
            "label": "O ponto em que a compressão começa a doer"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c1:d",
            "label": "O ajuste que cada tecnólogo define no turno"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-02:c1:b",
        "feedback": {
          "correct": "Para o CBR, é o máximo do sistema automático, conferido em teste. Na clínica, a força varia com a mama e a tolerância.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
          "source:rtg-2026:s-md:anvisa-in-92-2021"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-02"
        ],
        "prompt": "Durante a exposição numa simulação, onde ficam você e a colega que observa o atendimento?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-02:c2:a",
            "label": "Ao lado da pessoa, para ela não ficar sozinha"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c2:b",
            "label": "Na porta da sala, para controlar quem entra"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c2:c",
            "label": "Atrás do vidro plumbífero do painel"
          },
          {
            "id": "option:rtg-2026:s-md:aula-02:c2:d",
            "label": "Só com avental, em qualquer ponto da sala"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-02:c2:c",
        "feedback": {
          "correct": "O painel é protegido por vidro plumbífero, e quem opera ou observa fica atrás dele durante a exposição.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-03"
        ],
        "prompt": "Você vai conferir uma CC de simulação. Qual porção a CC não se propõe a incluir?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-03:c1:a",
            "label": "A porção medial da mama"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c1:b",
            "label": "A porção lateral da mama"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c1:c",
            "label": "A porção axilar da mama"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c1:d",
            "label": "A gordura posterior da mama"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-03:c1:c",
        "feedback": {
          "correct": "A CC cobre a glândula, lateral e medial, menos a porção axilar. A região junto à axila aparece melhor na MLO.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-03"
        ],
        "prompt": "Um colega pergunta o que orienta a rotação do tubo na MLO de cada pessoa. O que você responde?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-03:c2:a",
            "label": "Um ângulo fixo, igual para todo mundo"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c2:b",
            "label": "O suporte paralelo ao peitoral maior"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c2:c",
            "label": "O ângulo que deu certo no último exame"
          },
          {
            "id": "option:rtg-2026:s-md:aula-03:c2:d",
            "label": "O tamanho da bandeja de compressão"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-03:c2:b",
        "feedback": {
          "correct": "O suporte acompanha a inclinação do peitoral maior de cada pessoa, e é isso que define o ângulo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-04"
        ],
        "prompt": "Numa MLO descrita na simulação, o pequeno peitoral aparece incluído na imagem. Como você classifica isso na conferência?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-04:c1:a",
            "label": "Critério de posicionamento não cumprido"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c1:b",
            "label": "Um achado para o médico explicar à pessoa"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c1:c",
            "label": "Sinal de cobertura ainda melhor que o normal"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c1:d",
            "label": "Defeito do detector, para a manutenção ver"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-04:c1:a",
        "feedback": {
          "correct": "O pequeno peitoral não deve aparecer na MLO. Você nomeia o critério e leva à equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-04"
        ],
        "prompt": "Ao conferir uma MLO, você quer saber onde é mais provável que falte tecido, se faltar. Qual região você olha com mais atenção?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-04:c2:a",
            "label": "O quadrante superior lateral"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c2:b",
            "label": "A região retroareolar da mama"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c2:c",
            "label": "O prolongamento para a axila"
          },
          {
            "id": "option:rtg-2026:s-md:aula-04:c2:d",
            "label": "O quadrante inferior medial"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-04:c2:d",
        "feedback": {
          "correct": "Se algum tecido fica de fora na MLO, o mais provável é que seja desse quadrante.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-05"
        ],
        "prompt": "Um serviço mantém o mesmo mamógrafo, troca o filme por placa em chassi e lê essa placa numa unidade digitalizadora. Que sistema é esse?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-05:c1:a",
            "label": "Sistema DR, com detector fixo e imagem direta"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c1:b",
            "label": "Tela-filme, com a revelação química de sempre"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c1:c",
            "label": "Tomossíntese, com tubo em arco sobre a mama"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c1:d",
            "label": "Sistema CR, com placa lida no digitalizador"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-05:c1:d",
        "feedback": {
          "correct": "No CR, o chassi com a placa entra no bucky e a leitura ocorre depois, sem trocar o mamógrafo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-05"
        ],
        "prompt": "Na sala de laudos, uma colega pergunta para que serve o programa de detecção auxiliada por computador, o CAD. O que você responde?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-05:c2:a",
            "label": "Emite o laudo em lugar do radiologista"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c2:b",
            "label": "Ajusta a força de compressão da bandeja"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c2:c",
            "label": "Destaca áreas para o radiologista rever"
          },
          {
            "id": "option:rtg-2026:s-md:aula-05:c2:d",
            "label": "Reduz a dose da incidência seguinte"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-05:c2:c",
        "feedback": {
          "correct": "Ele procura padrões e marca áreas, para que o radiologista as examine com mais atenção.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:radiologyinfo-mammography"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-06"
        ],
        "prompt": "Na agenda de hoje há densitometria de adulto no aparelho central. Quais regiões a referência da aula pede medir?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-06:c1:a",
            "label": "Só o antebraço não dominante da pessoa"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c1:b",
            "label": "Só a coluna, para reduzir o tempo de mesa"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c1:c",
            "label": "A coluna lombar e o quadril"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c1:d",
            "label": "O dedo e o calcanhar, por serem acessíveis"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-06:c1:c",
        "feedback": {
          "correct": "A referência pede coluna em projeção posteroanterior e quadril em todas as pessoas adultas.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:iscd-official-positions-adult",
          "source:rtg-2026:s-md:radiologyinfo-dxa"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-06"
        ],
        "prompt": "O densitômetro volta da manutenção hoje de manhã. O que precisa ser conferido antes de seguir a rotina?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-06:c2:a",
            "label": "A densidade média do simulador"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c2:b",
            "label": "O escore de uma pessoa da agenda"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c2:c",
            "label": "A opinião do técnico da manutenção"
          },
          {
            "id": "option:rtg-2026:s-md:aula-06:c2:d",
            "label": "O folheto de precisão do fabricante"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-06:c2:a",
        "feedback": {
          "correct": "Depois de qualquer reparo, a densidade média do simulador é verificada. Assim, o serviço sabe se o aparelho mudou.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:iscd-official-positions-adult"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-07:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-07"
        ],
        "prompt": "Numa simulação de exame do fêmur, onde vai o pé da pessoa e o que isso faz com o quadril?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-07:c1:a",
            "label": "No bloco de espuma, que aplaina o quadril"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c1:b",
            "label": "No suporte, que gira o quadril para dentro"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c1:c",
            "label": "Livre na mesa, para manter o quadril relaxado"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c1:d",
            "label": "No suporte, que gira o quadril para fora"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-07:c1:b",
        "feedback": {
          "correct": "O suporte mantém o pé e gira o quadril para dentro, como a aula ensina.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:radiologyinfo-dxa"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-07:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-07"
        ],
        "prompt": "Segundo a referência da aula, o que um relatório de acompanhamento de densitometria não deve trazer?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-07:c2:a",
            "label": "O fabricante e o modelo do aparelho usado"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c2:b",
            "label": "Qual estudo anterior e região são comparados"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c2:c",
            "label": "A menor mudança significativa do serviço"
          },
          {
            "id": "option:rtg-2026:s-md:aula-07:c2:d",
            "label": "Mudança abaixo da menor mudança significativa"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-07:c2:d",
        "feedback": {
          "correct": "Mudança que não ultrapassa o valor do serviço não deve ser relatada como mudança.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:iscd-official-positions-adult"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-08:c1",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-08"
        ],
        "prompt": "A descrição diz: CC com lateral, medial e gordura posterior; MLO com prega inframamária, e o peitoral termina acima da altura do mamilo. O que você aponta?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-08:c1:a",
            "label": "Critério do peitoral não cumprido na MLO"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c1:b",
            "label": "Falta de gordura posterior na CC"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c1:c",
            "label": "Critério cumprido nas duas incidências"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c1:d",
            "label": "Um achado que o laudo terá de classificar"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-08:c1:a",
        "feedback": {
          "correct": "Na MLO, o peitoral precisa chegar à altura do mamilo ou abaixo dela. Você nomeia e leva à equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-md:aula-08:c2",
        "competencyIds": [
          "competency:rtg-2026:s-md:aula-08"
        ],
        "prompt": "A identificação de uma mamografia digital simulada traz instituição, nome da pessoa, incidência e lado. Quais dados inseridos pelo profissional ainda faltam?",
        "options": [
          {
            "id": "option:rtg-2026:s-md:aula-08:c2:a",
            "label": "O kV e o mAs usados no exame"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c2:b",
            "label": "As iniciais de quem fez o exame"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c2:c",
            "label": "A categoria sugerida para o laudo"
          },
          {
            "id": "option:rtg-2026:s-md:aula-08:c2:d",
            "label": "A combinação alvo-filtro usada"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-md:aula-08:c2:b",
        "feedback": {
          "correct": "As iniciais completam o que o profissional insere, e assim se sabe quem realizou o exame.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
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
      "claimId": "interaction:rtg-2026:s-md:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-01:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021",
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022",
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-02:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:anvisa-in-92-2021"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i3:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i3:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i3:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-mammography"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-07:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-07:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-07:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-07:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-07:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-07:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-07:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-07:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-07:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-07:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-07:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-07:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-07:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:anvisa-rdc-611-2022"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-07:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-07:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-07:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:radiologyinfo-dxa",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-08:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-08:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-08:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-08:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-md:aula-08:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-08:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-08:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-08:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-md:aula-08:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-md:aula-08:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-08:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-08:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-md:aula-08:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult",
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
        "source:rtg-2026:s-md:radiologyinfo-dxa"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-md:aula-08:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-md:aula-08:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-md:aula-08:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-md:iscd-official-positions-adult"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:s-md:aula-01",
        "hook": "Complete a frase: diante de possível gravidez, eu paro, aviso a equipe e sigo…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-01"
          ],
          "prompt": "Antes de começar, a pessoa diz: 'Minha menstruação está atrasada.' Como termina a sua conduta?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-01:rg:a",
              "label": "A rotina comum, sem mencionar o atraso"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rg:b",
              "label": "A minha avaliação sobre o risco do exame"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rg:c",
              "label": "O protocolo do serviço, com a equipe"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rg:d",
              "label": "O pedido médico, já que ele não cita nada"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-01:rg:c",
          "feedback": {
            "correct": "A pergunta sobre gravidez existe para isso. Você para antes de expor e a equipe conduz pelo protocolo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023",
            "source:rtg-2026:s-md:anvisa-rdc-611-2022"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-01"
          ],
          "prompt": "Enquanto você prepara Dona Célia, outra pessoa da fila pede para esperar dentro da sala, 'para adiantar'. O que você faz na simulação?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-01:rt:a",
              "label": "Deixa entrar, se Dona Célia não reclamar"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rt:b",
              "label": "Pede que aguarde fora: uma pessoa por vez"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rt:c",
              "label": "Deixa entrar, desde que fique de costas"
            },
            {
              "id": "option:rtg-2026:s-md:aula-01:rt:d",
              "label": "Interrompe o exame e atende primeiro a outra"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-01:rt:b",
          "feedback": {
            "correct": "A norma admite um paciente de cada vez na sala, e isso também preserva quem está em atendimento.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:anvisa-rdc-611-2022"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-02",
        "hook": "Complete a frase: compressão insuficiente alonga a exposição e pode trazer…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-02"
          ],
          "prompt": "Numa descrição de simulação, a compressão ficou frouxa. O que tende a aparecer junto com a exposição mais longa?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-02:rg:a",
              "label": "Borrão causado por movimento"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rg:b",
              "label": "Mais nitidez nas bordas finas"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rg:c",
              "label": "Menos dose absorvida na glândula"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rg:d",
              "label": "Menos radiação espalhada no feixe"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-02:rg:a",
          "feedback": {
            "correct": "Sem imobilizar bem e com exposição mais longa, o movimento pesa, e as bordas perdem nitidez.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:cbr-parecer-compressao-2022"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-02"
          ],
          "prompt": "Ao fim de um turno de estágio, você lê que o teste de qualidade da imagem é diário. Quem a norma admite para fazê-lo dentro do serviço?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-02:rt:a",
              "label": "Qualquer pessoa da equipe que tenha um tempo"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rt:b",
              "label": "Somente a empresa fabricante do mamógrafo"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rt:c",
              "label": "O estudante, já que está aprendendo"
            },
            {
              "id": "option:rtg-2026:s-md:aula-02:rt:d",
              "label": "Profissional do serviço, treinado e habilitado"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-02:rt:d",
          "feedback": {
            "correct": "A norma permite a equipe própria quando ela é treinada e legalmente habilitada para isso.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:anvisa-in-92-2021"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-03",
        "hook": "Complete a frase: suspender e puxar a mama se faz com a mão…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-03"
          ],
          "prompt": "Para trazer a mama sem deixar pregas na imagem, como vai a sua mão?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-03:rg:a",
              "label": "Fechada, segurando firme o tecido"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rg:b",
              "label": "Com a ponta dos dedos, para ter precisão"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rg:c",
              "label": "Afastada: quem traz a mama é a bandeja"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rg:d",
              "label": "Espalmada, apoiando toda a superfície"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-03:rg:d",
          "feedback": {
            "correct": "A mão espalmada traz a mama sem criar pregas, e o apoio fica distribuído.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-03"
          ],
          "prompt": "Numa CC de simulação, você quer enxergar o rosto da pessoa para notar um sinal de dor. De que lado da mama examinada você fica?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-03:rt:a",
              "label": "Na face medial da mama examinada"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rt:b",
              "label": "Atrás da pessoa, junto das costas"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rt:c",
              "label": "Sempre no lado esquerdo do aparelho"
            },
            {
              "id": "option:rtg-2026:s-md:aula-03:rt:d",
              "label": "No painel, com a bandeja já descida"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-03:rt:a",
          "feedback": {
            "correct": "Daí você mantém o contato visual, sem atrapalhar o posicionamento.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-04",
        "hook": "Complete a frase: na CC sem peitoral, MLO menos CC deve dar no máximo…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-04"
          ],
          "prompt": "Qual é o limite da diferença entre as distâncias na MLO e na CC, ensinado nesta aula?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-04:rg:a",
              "label": "0,1 cm"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rg:b",
              "label": "1 cm"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rg:c",
              "label": "3 cm"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rg:d",
              "label": "5 cm"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-04:rg:b",
          "feedback": {
            "correct": "Até 1 cm de diferença, a comparação indica que a profundidade na CC é adequada.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-04"
          ],
          "prompt": "Revendo imagens de simulação no laboratório, você encontra uma dobra de pele sobre a região da axila numa MLO. O que você faz com essa observação?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-04:rt:a",
              "label": "Ignora, porque a dobra fica longe do centro"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rt:b",
              "label": "Chama de lesão de pele na ficha do exercício"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rt:c",
              "label": "Descreve como dobra de pele e leva à equipe"
            },
            {
              "id": "option:rtg-2026:s-md:aula-04:rt:d",
              "label": "Corta a região na tela para deixar mais limpo"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-04:rt:c",
          "feedback": {
            "correct": "A dobra é uma falha de posicionamento, e a descrição objetiva é o que a equipe precisa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-05",
        "hook": "Complete a frase: indicar incidência complementar é responsabilidade do…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-05"
          ],
          "prompt": "Quem responde pela indicação de incidências complementares e manobras?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-05:rg:a",
              "label": "O médico radiologista"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rg:b",
              "label": "O estudante na simulação"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rg:c",
              "label": "A pessoa examinada"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rg:d",
              "label": "O físico do serviço"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-05:rg:a",
          "feedback": {
            "correct": "Essa indicação é do radiologista. O técnico e o tecnólogo experientes podem auxiliar, sem tomar a decisão.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-05"
          ],
          "prompt": "Uma colega diz que ultrassonografia e ressonância magnética da mama também expõem a pessoa a raios X. Como você corrige?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-05:rt:a",
              "label": "Só a ressonância magnética usa raios X"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rt:b",
              "label": "Nenhuma das duas usa radiação ionizante"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rt:c",
              "label": "Só a ultrassonografia usa raios X"
            },
            {
              "id": "option:rtg-2026:s-md:aula-05:rt:d",
              "label": "As duas usam, em dose bem mais baixa"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-05:rt:b",
          "feedback": {
            "correct": "Ultrassom usa ondas mecânicas, e a ressonância, radiofrequência. Indicá-las continua sendo do médico.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-06",
        "hook": "Complete a frase: o simulador é escaneado ao menos uma vez por…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-06"
          ],
          "prompt": "Com que frequência mínima a referência da aula pede o exame do simulador?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-06:rg:a",
              "label": "Uma vez por ano"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rg:b",
              "label": "Uma vez por trimestre"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rg:c",
              "label": "Só quando houver reparo"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rg:d",
              "label": "Uma vez por semana"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-06:rg:d",
          "feedback": {
            "correct": "Esse é o mínimo da referência, além da verificação depois de cada reparo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:iscd-official-positions-adult"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-06"
          ],
          "prompt": "Numa simulação, a equipe indica medir o antebraço porque uma região de rotina não pôde ser medida. Qual região o protocolo costuma usar?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-06:rt:a",
              "label": "O rádio distal do lado dominante da pessoa"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rt:b",
              "label": "O braço inteiro, dos dois lados da pessoa"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rt:c",
              "label": "O rádio 33% do lado não dominante da pessoa"
            },
            {
              "id": "option:rtg-2026:s-md:aula-06:rt:d",
              "label": "A mão, no lado que for mais confortável"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-06:rt:c",
          "feedback": {
            "correct": "A referência adota essa região. A indicação da medida fica com a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:iscd-official-positions-adult"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-07",
        "hook": "Complete a frase: para o exame da coluna, as pernas da pessoa ficam no…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-07:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-07"
          ],
          "prompt": "Na simulação do exame de coluna, o que aplaina a pelve e a lombar?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-07:rg:a",
              "label": "Prender a respiração por um tempo"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rg:b",
              "label": "Girar os pés da pessoa para dentro"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rg:c",
              "label": "Apoiar as pernas no bloco acolchoado"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rg:d",
              "label": "Deitar a pessoa virada para um lado"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-07:rg:c",
          "feedback": {
            "correct": "As pernas elevadas no bloco aplainam a pelve e a parte baixa da coluna.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:radiologyinfo-dxa"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-07:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-07"
          ],
          "prompt": "Antes do exame, Seu Alberto comenta que operou a coluna anos atrás. O pedido não cita isso. O que você faz na simulação?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-07:rt:a",
              "label": "Registra o relato e avisa a equipe"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rt:b",
              "label": "Troca a região por conta própria"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rt:c",
              "label": "Segue e deixa o laudo descobrir"
            },
            {
              "id": "option:rtg-2026:s-md:aula-07:rt:d",
              "label": "Cancela o exame e avisa depois"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-07:rt:a",
          "feedback": {
            "correct": "Cirurgia na coluna pode limitar o exame. O relato precisa chegar à equipe antes de seguir.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:radiologyinfo-dxa",
            "source:rtg-2026:s-md:iscd-official-positions-adult"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-md:aula-08",
        "hook": "Complete a frase: diante de uma dúvida no caso, eu descrevo o que vi e…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-md:aula-08:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-08"
          ],
          "prompt": "Numa simulação, você não sabe explicar o que observou. Qual é o passo final?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-08:rg:a",
              "label": "Decido o próximo exame"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rg:b",
              "label": "Levo a dúvida à equipe"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rg:c",
              "label": "Conto a dúvida à pessoa"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rg:d",
              "label": "Deixo sem registrar nada"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-08:rg:b",
          "feedback": {
            "correct": "Descrever e levar à equipe é o que fecha o caso, sem opinar sobre o que significa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:inca-atualizacao-mamografia-2023"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-md:aula-08:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-md:aula-08"
          ],
          "prompt": "Em uma densitometria simulada, uma das regiões adquiridas ficou sem validade técnica por causa de artefato. O que a referência da aula pede quanto ao relatório?",
          "options": [
            {
              "id": "option:rtg-2026:s-md:aula-08:rt:a",
              "label": "Relatar o valor da região, mesmo com o artefato"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rt:b",
              "label": "Omitir o artefato e manter o valor da região"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rt:c",
              "label": "Calcular o valor pela média das outras regiões"
            },
            {
              "id": "option:rtg-2026:s-md:aula-08:rt:d",
              "label": "Não relatar essa região e dizer por quê"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-md:aula-08:rt:d",
          "feedback": {
            "correct": "A região inválida fica de fora e o motivo é informado. O que você viu chega à equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-md:iscd-official-positions-adult"
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
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "aa29aae4b18943bbf2e6e2cb9d2129bf5b5347ac6e7bdfb175031b0cd39cf4b0"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
