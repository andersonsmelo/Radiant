// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M22: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m22",
  "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022",
  "trackId": "track:rtg-2026:m22",
  "unitId": "unit:rtg-2026:m22",
  "contentVersion": "rtg-2026-m22-v1",
  "competencyIds": [
    "competency:rtg-2026:m22:aula-01",
    "competency:rtg-2026:m22:aula-02",
    "competency:rtg-2026:m22:aula-03",
    "competency:rtg-2026:m22:aula-04",
    "competency:rtg-2026:m22:aula-05",
    "competency:rtg-2026:m22:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m22:wikibooks-computer",
      "title": "Basic Physics of Digital Radiography: The Computer",
      "publisher": "Wikibooks",
      "url": "https://en.wikibooks.org/wiki/Basic_Physics_of_Digital_Radiography/The_Computer",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro aberto; consultado para fatos (histograma, tabela de conversão, filtros, compressão, PACS, RIS), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:wikibooks-image",
      "title": "Basic Physics of Digital Radiography: The Image",
      "publisher": "Wikibooks",
      "url": "https://en.wikibooks.org/wiki/Basic_Physics_of_Digital_Radiography/The_Image",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Livro aberto; consultado para fatos (exibição, luz ambiente, ruído), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:pmc-exposure-index",
      "title": "Seibert JA, Morin RL. The standardized exposure index for digital radiography: an opportunity for optimization of radiation dose to the pediatric population",
      "publisher": "Pediatric Radiology, via PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3076558/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos (análise do histograma, região analisada, curva de conversão), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:exam-prep-processing",
      "title": "Image Processing and Post-processing (guia de estudo de radiografia digital)",
      "publisher": "Open Exam Prep",
      "url": "https://open-exam-prep.com/study-guides/arrt-radiography/digital-imaging/image-processing-post-processing",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Guia de estudo aberto; consultado para fatos (faixa de interesse, erros de histograma, realce e suavização), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:dicom-worklist",
      "title": "DICOM PS3.4, Annex K: Basic Worklist Management Service",
      "publisher": "NEMA, DICOM Standards Committee",
      "url": "https://dicom.nema.org/medical/dicom/current/output/chtml/part04/sect_K.6.html",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Padrão internacional gratuito; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:dicom-about",
      "title": "About DICOM: Overview",
      "publisher": "DICOM Standards Committee (NEMA)",
      "url": "https://www.dicomstandard.org/about",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:dicom-deid",
      "title": "DICOM PS3.15, Annex E: Attribute Confidentiality Profiles",
      "publisher": "NEMA, DICOM Standards Committee",
      "url": "https://dicom.nema.org/medical/dicom/current/output/chtml/part15/chapter_E.html",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Padrão internacional gratuito; consultado para fatos (identificação no cabeçalho e gravada na imagem), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:pmc-radiology-downtime",
      "title": "Radiology department responses to system downtime and operations during a software transition (artigo de acesso aberto)",
      "publisher": "PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7891804",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos (políticas de parada documentadas, cenários por sistema, comunicação à equipe), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:pmc-histogram-errors",
      "title": "Lewis S, Pieterse T, Lawrence H. Retrospective evaluation of exposure indicators: a pilot study of exposure technique in digital radiography",
      "publisher": "Journal of Medical Radiation Sciences, via PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6399191/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para fatos (causas de erro na análise do histograma: colimação, centralização, região anatômica errada, metal), sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m22:aapm-tg270",
      "title": "AAPM Report No. 270: Display Quality Assurance (Task Group 270)",
      "publisher": "American Association of Physicists in Medicine",
      "url": "https://www.aapm.org/pubs/reports/RPT_270.pdf",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Relatório técnico aberto; consultado para fatos (avaliação visual com padrão de teste, alvos de pouco contraste nos tons escuros, luz ambiente e reflexo), sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m22:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:pmc-exposure-index",
          "source:rtg-2026:m22:exam-prep-processing",
          "source:rtg-2026:m22:pmc-histogram-errors"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Histograma e curva de apresentação",
            "body": "Hoje você vai conseguir explicar como o sistema acha a faixa de interesse e o que acontece quando ele erra o campo.",
            "dialogue": {
              "setting": "Laboratório de imagem digital",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A imagem do simulador saiu escura, mas o Caio diz que a exposição estava certa. Como a imagem pode sair escura se chegou o sinal necessário?"
                },
                {
                  "speaker": "caio",
                  "text": "Porque, antes de aparecer, o sistema decide qual parte dos valores é anatomia. Se ele erra essa escolha, a tela mostra errado."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos olhar o gráfico que o sistema usa para escolher. O que você acha que ele conta?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "O sistema procura a faixa da anatomia",
            "body": "O histograma conta pixels por valor: a altura é quantos pixels; na horizontal, o valor. Neste esquema, o valor do pixel cresce com a exposição. À esquerda fica o pico da área colimada, quase sem sinal. No meio, o grupo largo da anatomia: a faixa de interesse. À direita, o pico da radiação direta, fora do corpo. A curva em S converte essa faixa em brilho. Se o campo ou a região anatômica estão errados, a faixa pode sair errada.",
            "keyPoints": [
              "Faixa de interesse: o grupo de valores da anatomia, sem a área colimada nem a radiação direta.",
              "O sentido do valor depende do sistema: onde ele cai com a exposição, as pontas se invertem.",
              "Imagem estranha: descreva o campo e o aspecto, e chame a equipe."
            ],
            "visual": "histograma-e-lut"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M05.04, uma tabela transforma valores de pixel em brilho na tela. O que essa tabela recebe como entrada?"
            },
            "help": "Pense no que a imagem guarda em cada pixel.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: a tabela pega cada valor de pixel e devolve um brilho para a tela.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M05.04, uma tabela transforma valores de pixel em brilho na tela. O que essa tabela recebe como entrada?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-01:i1:a",
                  "label": "O nome do protocolo anatômico escolhido",
                  "explanation": "O protocolo influencia o processamento, mas a tabela converte valores de pixel em brilho."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i1:b",
                  "label": "Os valores de pixel da imagem",
                  "explanation": "Isso: a tabela pega cada valor de pixel e devolve um brilho para a tela."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i1:c",
                  "label": "A dose que o paciente recebeu no exame",
                  "explanation": "A tabela não conhece a dose do paciente: ela trabalha com os valores da imagem."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i1:d",
                  "label": "O tamanho do campo de visão em centímetros",
                  "explanation": "O campo de visão define o tamanho do pixel, não é o que a tabela converte."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-01:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as partes do histograma e da curva, tocando na ficha e no ponto. Vale para este esquema, em que o valor cresce com a exposição."
            },
            "help": "Neste esquema, o valor cresce com a exposição: pouco sinal numa ponta, muito sinal na outra.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: duas pontas sem anatomia, o grupo do meio e a curva que o converte em brilho.",
              "incorrect": "Alguma ficha está no lugar errado: lembre que a ponta de pouco sinal é a área colimada e a de muito sinal é a radiação direta."
            },
            "payload": {
              "prompt": "Rotule as partes do histograma e da curva, tocando na ficha e no ponto. Vale para este esquema, em que o valor cresce com a exposição.",
              "imageRef": "diagram:histograma-e-lut",
              "points": [
                {
                  "id": "point:rtg-2026:m22:aula-01:i2:1",
                  "x": 0.131,
                  "y": 0.375,
                  "where": "na ponta esquerda do eixo, a barra estreita",
                  "correctLabelId": "label:rtg-2026:m22:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m22:aula-01:i2:2",
                  "x": 0.303,
                  "y": 0.492,
                  "where": "no meio do eixo, o grupo largo de barras",
                  "correctLabelId": "label:rtg-2026:m22:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m22:aula-01:i2:3",
                  "x": 0.475,
                  "y": 0.625,
                  "where": "na ponta direita do eixo, a barra estreita",
                  "correctLabelId": "label:rtg-2026:m22:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m22:aula-01:i2:4",
                  "x": 0.409,
                  "y": 0.2,
                  "where": "no alto, a ponta direita do colchete azul",
                  "correctLabelId": "label:rtg-2026:m22:aula-01:i2:4"
                },
                {
                  "id": "point:rtg-2026:m22:aula-01:i2:5",
                  "x": 0.88,
                  "y": 0.207,
                  "where": "no gráfico da direita, o traço em S, junto ao patamar alto",
                  "correctLabelId": "label:rtg-2026:m22:aula-01:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:2",
                  "label": "Anatomia"
                },
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:4",
                  "label": "Valores de interesse"
                },
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:1",
                  "label": "Área colimada"
                },
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:6",
                  "label": "Dose do paciente"
                },
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:5",
                  "label": "Curva de conversão"
                },
                {
                  "id": "label:rtg-2026:m22:aula-01:i2:3",
                  "label": "Radiação direta"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre o que o sistema faz com o histograma."
            },
            "help": "Pergunte de cada frase: ela muda o grupo de valores que o sistema trata como anatomia?",
            "type": "true-false",
            "feedback": {
              "correct": "Você ligou o campo e a região escolhida à faixa que o sistema encontra.",
              "incorrect": "Releia o conceito: a faixa depende do campo e da região anatômica, e fica só com a anatomia."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre o que o sistema faz com o histograma.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m22:aula-01:i3:1",
                  "text": "Um campo mal colimado pode levar o sistema a escolher a faixa de interesse errada.",
                  "isTrue": true,
                  "explanation": "Certo: campo pequeno demais, grande demais ou fora do centro estão entre as causas de erro na faixa."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-01:i3:2",
                  "text": "Com a faixa errada, a imagem pode sair escura ou clara mesmo com a exposição certa.",
                  "isTrue": true,
                  "explanation": "Certo: a exposição no detector pode estar correta, e a conversão em brilho sair fora do esperado."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-01:i3:3",
                  "text": "A radiação direta fora do corpo faz parte da faixa de interesse.",
                  "isTrue": false,
                  "explanation": "Errado: a faixa de interesse é o grupo da anatomia, sem a área colimada nem a radiação direta."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-01:i3:4",
                  "text": "A região anatômica escolhida no equipamento não altera a faixa que o sistema acha.",
                  "isTrue": false,
                  "explanation": "Errado: escolher a região errada é uma das causas de erro na faixa de interesse."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque todas as situações que podem levar o sistema a errar a faixa de interesse."
            },
            "help": "A causa precisa mudar os valores que o sistema analisa, não só como a tela os mostra.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou o que muda os valores analisados e deixou de fora o que não muda.",
              "incorrect": "Releia o conceito: o erro vem do que entra no histograma, como campo, região e exposições, e não da tela."
            },
            "payload": {
              "prompt": "Marque todas as situações que podem levar o sistema a errar a faixa de interesse.",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-01:i4:a",
                  "label": "Campo colimado fora do centro da região",
                  "explanation": "Campo fora do centro é uma das causas de erro na faixa de interesse."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i4:b",
                  "label": "Janela de exibição mais estreita na estação",
                  "explanation": "A janela age depois, na exibição: ela não muda a faixa que o sistema escolheu."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i4:c",
                  "label": "Região anatômica errada escolhida no equipamento",
                  "explanation": "O sistema usa a região escolhida para analisar o histograma: região errada, faixa errada."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i4:d",
                  "label": "Duas exposições gravadas na mesma placa",
                  "explanation": "Duas exposições na mesma placa misturam valores e podem enganar a análise."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i4:e",
                  "label": "Nome do paciente muito longo no cadastro",
                  "explanation": "O texto do cadastro não entra no histograma de valores da imagem."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m22:aula-01:i4:a",
                "option:rtg-2026:m22:aula-01:i4:c",
                "option:rtg-2026:m22:aula-01:i4:d"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Um sistema de outro fabricante mostra o valor do pixel diminuindo quando a exposição aumenta. Em que ponta do histograma dele fica o pico da radiação direta?"
            },
            "help": "Troque o sentido: o que era a ponta de muito sinal passa a ser a de menor valor.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: se o valor cai com a exposição, o máximo de radiação vira o menor valor.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Um sistema de outro fabricante mostra o valor do pixel diminuindo quando a exposição aumenta. Em que ponta do histograma dele fica o pico da radiação direta?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-01:i5:a",
                  "label": "Na ponta dos valores altos",
                  "explanation": "Essa ponta seria a da área colimada, quase sem sinal, nesse sistema invertido."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i5:b",
                  "label": "No meio, junto com o grupo da anatomia",
                  "explanation": "A radiação direta fica numa ponta, fora do grupo da anatomia, em qualquer sistema."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i5:c",
                  "label": "Em nenhuma: ela não aparece no histograma",
                  "explanation": "A radiação direta chega ao detector e aparece no histograma, como um pico estreito."
                },
                {
                  "id": "option:rtg-2026:m22:aula-01:i5:d",
                  "label": "Na ponta dos valores baixos",
                  "explanation": "Isso: se o valor cai com a exposição, o máximo de radiação vira o menor valor."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-01:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê o que o sistema escolheu",
            "body": "Agora você consegue dizer como o sistema acha a faixa de interesse no histograma e por que campo ou região errados deixam a imagem escura ou clara. Diante de uma imagem estranha, você descreve e chama a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Descrever bem o campo e o aspecto já ajuda muito quem vai investigar."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m22:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-image",
          "source:rtg-2026:m22:exam-prep-processing",
          "source:rtg-2026:m22:wikibooks-computer"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Realçar e suavizar",
            "body": "Hoje você vai conseguir distinguir realce de borda e suavização e dizer o preço de cada um.",
            "dialogue": {
              "setting": "Laboratório de imagem digital",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Apliquei um filtro na imagem do simulador e o osso ficou lindo, mas o fundo ficou cheio de chuvisco. Eu estraguei alguma coisa?"
                },
                {
                  "speaker": "caio",
                  "text": "Não estragou, trocou uma coisa por outra. Todo filtro cobra um preço."
                },
                {
                  "speaker": "pixel",
                  "text": "Olhe o mesmo degrau passando por três tratamentos. O que muda em cada perfil?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada filtro cobra um preço",
            "body": "A figura mostra a mesma borda em três perfis. Eixo horizontal: posição na borda; vertical: valor do pixel. No de cima, o original, a transição é curta. No do meio, o realce de borda exagera a diferença junto da borda: o contorno fica mais marcado, e o ruído fica mais evidente. No de baixo, a suavização alarga a transição: o granulado diminui, mas detalhes finos vizinhos se fundem. O grau de cada filtro vem do protocolo do serviço.",
            "keyPoints": [
              "Realce: borda mais marcada, ruído mais evidente.",
              "Suavização: fundo mais liso, detalhe fino mais fundido.",
              "O grau de cada filtro segue o protocolo do serviço."
            ],
            "visual": "realce-e-suavizacao"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M05.03 você viu que o borramento reduz a nitidez. Numa borda, como essa perda de nitidez aparece?"
            },
            "help": "Imagine o caminho do olhar da região clara até a escura.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: borda nítida passa do claro ao escuro em pouco espaço; borrada, em espaço longo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M05.03 você viu que o borramento reduz a nitidez. Numa borda, como essa perda de nitidez aparece?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-02:i1:a",
                  "label": "A borda fica mais clara que o fundo ao redor",
                  "explanation": "Brilho maior não é nitidez menor: o que muda é o comprimento da transição."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i1:b",
                  "label": "O fundo ao redor da borda fica mais granulado",
                  "explanation": "Granulado é ruído, outra dimensão de qualidade da M05.03."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i1:c",
                  "label": "A transição do claro ao escuro fica mais longa",
                  "explanation": "Isso: borda nítida passa do claro ao escuro em pouco espaço; borrada, em espaço longo."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i1:d",
                  "label": "A borda desaparece porque o contraste sobe",
                  "explanation": "Subir o contraste não apaga a borda nem mede nitidez."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-02:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada efeito no filtro que o produz."
            },
            "help": "Um filtro marca a borda; o outro espalha o valor entre pixels vizinhos.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que marca a borda do que alisa a imagem.",
              "incorrect": "Pergunte de cada efeito: ele deixa a borda mais marcada ou alarga a transição e alisa o fundo?"
            },
            "payload": {
              "prompt": "Classifique cada efeito no filtro que o produz.",
              "categories": [
                {
                  "id": "group:rtg-2026:m22:aula-02:i2:a",
                  "label": "Realce de borda"
                },
                {
                  "id": "group:rtg-2026:m22:aula-02:i2:b",
                  "label": "Suavização"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:5",
                  "label": "Exagera a diferença de tom junto da borda",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:1",
                  "label": "Deixa o contorno do osso mais marcado",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:4",
                  "label": "Funde dois traços finos vizinhos",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:2",
                  "label": "Reduz o aspecto granulado do fundo",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:6",
                  "label": "Alarga a transição entre claro e escuro",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-02:i2:3",
                  "label": "Torna o chuvisco mais evidente",
                  "categoryId": "group:rtg-2026:m22:aula-02:i2:a"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Relacione cada filtro ou situação ao que ela traz."
            },
            "help": "Um filtro realça e o outro alisa: cada um deixa uma conta.",
            "type": "matching",
            "feedback": {
              "correct": "Você ligou cada filtro ao seu preço, o original à transição curta e a dose de filtro ao protocolo.",
              "incorrect": "Releia o conceito: cada filtro troca um ganho por um preço, e o grau vem do protocolo."
            },
            "payload": {
              "prompt": "Relacione cada filtro ou situação ao que ela traz.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m22:aula-02:i3:1",
                  "left": "Realce de borda forte demais",
                  "right": "Contorno nítido e fundo mais granulado"
                },
                {
                  "id": "pair:rtg-2026:m22:aula-02:i3:2",
                  "left": "Suavização forte demais",
                  "right": "Fundo liso e detalhe fino fundido"
                },
                {
                  "id": "pair:rtg-2026:m22:aula-02:i3:3",
                  "left": "Perfil original da figura",
                  "right": "Transição curta, sem exagero na borda"
                },
                {
                  "id": "pair:rtg-2026:m22:aula-02:i3:4",
                  "left": "Quanto aplicar de cada filtro",
                  "right": "Segue o protocolo que o serviço define"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que Duda faz agora?"
            },
            "help": "O filtro apagou o detalhe; quem decide o filtro certo é o protocolo do serviço.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: ela relata o efeito e deixa a escolha do filtro para o protocolo do serviço.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, Duda aplica suavização forte a uma imagem granulada de um objeto de teste. O fundo fica liso, mas um fio fino de teste, bem visível antes, quase desaparece.",
              "prompt": "O que Duda faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-02:i4:a",
                  "label": "Descreve o efeito e pergunta ao Caio qual protocolo vale",
                  "explanation": "Isso: ela relata o efeito e deixa a escolha do filtro para o protocolo do serviço."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i4:b",
                  "label": "Aumenta o realce até o fio de teste voltar a aparecer na imagem",
                  "explanation": "O realce pode devolver o fio, mas aumenta o ruído, e a escolha não é dela."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i4:c",
                  "label": "Envia a imagem lisa, pois o fundo ficou bem limpo agora",
                  "explanation": "Enviar sem relatar deixa passar a perda de um detalhe fino."
                },
                {
                  "id": "option:rtg-2026:m22:aula-02:i4:d",
                  "label": "Repete a exposição com mais técnica para compensar a perda",
                  "explanation": "A perda do fio vem do filtro, não da exposição: repetir expõe sem motivo."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-02:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Uma mesma aquisição foi processada de dois jeitos. Julgue cada afirmação."
            },
            "help": "Pergunte de cada frase: ela descreve o realce, a suavização ou a regra do serviço?",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que cada filtro ganha, o que cada um cobra e quem define o grau.",
              "incorrect": "Releia o conceito: realce marca a borda e o ruído, suavização alisa e funde detalhes, e o grau vem do protocolo."
            },
            "payload": {
              "prompt": "Uma mesma aquisição foi processada de dois jeitos. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m22:aula-02:i5:1",
                  "text": "Com realce, o fio fica mais marcado e o fundo mais granulado.",
                  "isTrue": true,
                  "explanation": "Certo: realce de borda marca contornos e também torna o ruído mais evidente."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-02:i5:2",
                  "text": "Com suavização, o fundo fica mais liso e traços finos podem se fundir.",
                  "isTrue": true,
                  "explanation": "Certo: suavizar reduz o granulado e custa nitidez nos detalhes finos."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-02:i5:3",
                  "text": "Com suavização forte, o granulado do fundo fica bem mais evidente que antes.",
                  "isTrue": false,
                  "explanation": "Errado: suavizar reduz o granulado; quem o deixa mais evidente é o realce de borda."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-02:i5:4",
                  "text": "Quanto aplicar de cada filtro segue o protocolo do serviço.",
                  "isTrue": true,
                  "explanation": "Certo: o grau do filtro vem do protocolo, e o efeito que você vê se relata."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você enxerga o preço do filtro",
            "body": "Agora você consegue dizer o que o realce de borda e a suavização fazem na imagem e o que cada um custa. Você relata o efeito que vê, e o protocolo do serviço define quanto aplicar.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Filtro não é de graça: olhe o que ganhou e o que perdeu."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m22:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-image",
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:aapm-tg270"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "O monitor",
            "body": "Hoje você vai conseguir conferir um padrão de teste no monitor e reconhecer a luz do ambiente e os reflexos como problema.",
            "dialogue": {
              "setting": "Sala de visualização",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A imagem está ótima no arquivo, mas aqui na estação parece achatada. O arquivo mudou?"
                },
                {
                  "speaker": "caio",
                  "text": "O arquivo está igual. O que muda é o que o monitor consegue mostrar. Por isso a gente confere o monitor antes."
                },
                {
                  "speaker": "pixel",
                  "text": "Existe um padrão feito para isso. O que você acha que ele precisa mostrar?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Olhar o padrão e relatar",
            "body": "O serviço confere o monitor com um padrão de teste. Nele, os degraus de cinza, do preto ao branco, devem se distinguir um do outro, sobretudo nas pontas escura e clara. Os quadrados com um quadradinho de pouco contraste mostram se o monitor revela diferença sutil, e os pares de linhas finas, se ele é nítido. A luz do ambiente soma-se à da tela e atrapalha os tons escuros; reflexos também. Você olha e relata. Calibrar é de quem o serviço designa.",
            "keyPoints": [
              "Degraus distintos, quadradinho visível e linhas separadas.",
              "Luz ambiente e reflexo escondem os tons escuros.",
              "Você olha e relata; não calibra."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M05.04, a janela muda a exibição e não os valores guardados. Se o monitor não distingue tons vizinhos, o que acontece com a informação guardada?"
            },
            "help": "Pense em onde o valor mora: no arquivo ou na tela?",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o monitor limita o que você vê, e o arquivo segue com os valores.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M05.04, a janela muda a exibição e não os valores guardados. Se o monitor não distingue tons vizinhos, o que acontece com a informação guardada?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-03:i1:a",
                  "label": "Os valores guardados mudam para igualar os tons",
                  "explanation": "O monitor não reescreve o arquivo: ele só mostra o que recebe."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i1:b",
                  "label": "Continua no arquivo; só a exibição fica pior",
                  "explanation": "Isso: o monitor limita o que você vê, e o arquivo segue com os valores."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i1:c",
                  "label": "O sistema de arquivo apaga os tons que o monitor não mostra",
                  "explanation": "O arquivo guarda os valores sem consultar o que o monitor consegue exibir."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i1:d",
                  "label": "A dose do paciente aumenta para compensar a tela",
                  "explanation": "A tela não tem relação com a dose, que vem da exposição já feita."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-03:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque na parte do padrão que mostra se cada tom de cinza se distingue do vizinho, do preto ao branco."
            },
            "help": "Procure a sequência de quadros que vai do mais escuro ao mais claro.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: cada degrau deve se distinguir do vizinho, sobretudo perto do preto e do branco.",
              "incorrect": "Essa parte mostra outra coisa: procure a sequência de tons que vai do preto ao branco."
            },
            "payload": {
              "prompt": "Toque na parte do padrão que mostra se cada tom de cinza se distingue do vizinho, do preto ao branco.",
              "imageRef": "diagram:monitor-e-padrao-de-teste",
              "regions": [
                {
                  "id": "region:rtg-2026:m22:aula-03:i2:1",
                  "label": "Faixa de degraus de cinza",
                  "x": 0.2625,
                  "y": 0.4958,
                  "width": 0.6,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i2:2",
                  "label": "Quadrado escuro com quadradinho",
                  "x": 0.2437,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i2:3",
                  "label": "Quadrado claro com quadradinho",
                  "x": 0.4188,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i2:4",
                  "label": "Pares de linhas finas",
                  "x": 0.5875,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i2:5",
                  "label": "Mancha clara no canto da tela",
                  "x": 0.7844,
                  "y": 0.0708,
                  "width": 0.1625,
                  "height": 0.2167
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m22:aula-03:i2:1"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Marque tudo o que você relata ao olhar o padrão de teste."
            },
            "help": "Relata-se o que pode esconder detalhe da imagem, não o que não aparece na tela.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou o que muda o que se vê na tela e deixou de fora o que não muda.",
              "incorrect": "Releia o conceito: o relato cobre degraus, quadradinho, linhas e reflexo, e não detalhes da carcaça ou do relógio."
            },
            "payload": {
              "prompt": "Marque tudo o que você relata ao olhar o padrão de teste.",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:a",
                  "label": "Dois degraus de cinza vizinhos que parecem iguais",
                  "explanation": "Cada degrau precisa se distinguir do vizinho; dois iguais merecem relato."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:b",
                  "label": "A hora que o relógio da estação mostra no canto da tela",
                  "explanation": "A hora do relógio não tem relação com o que o monitor consegue mostrar."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:c",
                  "label": "O quadradinho de pouco contraste que não aparece",
                  "explanation": "Se o quadradinho some, o monitor pode não revelar diferenças sutis."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:d",
                  "label": "Pares de linhas finas que aparecem borrados",
                  "explanation": "Os padrões devem aparecer distintos; linhas borradas indicam perda de nitidez."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:e",
                  "label": "A cor da moldura do monitor ao redor da tela",
                  "explanation": "A cor da moldura não afeta a imagem mostrada na tela."
                },
                {
                  "id": "option:rtg-2026:m22:aula-03:i3:f",
                  "label": "Um reflexo de janela sobre a tela",
                  "explanation": "Reflexos atrapalham a leitura dos tons escuros e se relatam."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m22:aula-03:i3:a",
                "option:rtg-2026:m22:aula-03:i3:c",
                "option:rtg-2026:m22:aula-03:i3:d",
                "option:rtg-2026:m22:aula-03:i3:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Caio confere o monitor da estação com você. Ajude-o a conduzir o relato."
            },
            "help": "Pense em quem decide sobre ajuste de monitor e iluminação da sala.",
            "type": "conversation",
            "feedback": {
              "correct": "Você olhou, relatou e deixou o ajuste para quem o serviço designa.",
              "incorrect": "Reveja o turno: o seu papel é olhar e relatar, sem calibrar nem mexer na sala por conta própria."
            },
            "payload": {
              "prompt": "Caio confere o monitor da estação com você. Ajude-o a conduzir o relato.",
              "speaker": "caio",
              "turns": [
                {
                  "id": "turn:rtg-2026:m22:aula-03:i4:1",
                  "line": "O quadradinho dentro do quadrado escuro mal aparece nesta estação. O que você faz?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:1a",
                      "label": "Aumento o brilho até o quadradinho aparecer.",
                      "reply": "Então tá, vou subir o brilho e ver se ele aparece."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:1b",
                      "label": "Descrevo o que vi e chamo o responsável pelo monitor.",
                      "reply": "Ok, vou anotar o que você viu e procurar o responsável."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:1c",
                      "label": "Deixo assim: o arquivo da imagem está intacto e é o que importa.",
                      "reply": "Beleza, então seguimos com esta estação do jeito que está."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-03:i4:1b"
                },
                {
                  "id": "turn:rtg-2026:m22:aula-03:i4:2",
                  "line": "A luz da janela bate direto na tela e brilha no canto. Dá para ler imagens assim?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:2a",
                      "label": "Leio assim mesmo e compenso olhando a tela de lado.",
                      "reply": "Vou inclinar a cabeça e seguir lendo, então."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:2b",
                      "label": "Viro o monitor para o outro lado da mesa agora mesmo.",
                      "reply": "Então me ajuda a arrastar a mesa para o outro canto."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-03:i4:2c",
                      "label": "Aviso do reflexo e peço a decisão da supervisão.",
                      "reply": "Vou mandar uma mensagem para a supervisão agora."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-03:i4:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Em outra sala, a luz do teto bate na tela e o reflexo pesa mais nos tons escuros. Toque na parte do padrão que você confere primeiro para ver esse efeito."
            },
            "help": "Pense em quais tons a luz da sala atrapalha mais.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o quadradinho de pouco contraste no quadrado escuro é o primeiro a sumir quando a luz da sala pesa.",
              "incorrect": "Essa parte não testa diferença sutil nos tons escuros: procure o alvo de pouco contraste no fundo mais escuro."
            },
            "payload": {
              "prompt": "Em outra sala, a luz do teto bate na tela e o reflexo pesa mais nos tons escuros. Toque na parte do padrão que você confere primeiro para ver esse efeito.",
              "imageRef": "diagram:monitor-e-padrao-de-teste",
              "regions": [
                {
                  "id": "region:rtg-2026:m22:aula-03:i5:1",
                  "label": "Quadrado escuro com quadradinho",
                  "x": 0.2437,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i5:2",
                  "label": "Quadrado claro com quadradinho",
                  "x": 0.4188,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i5:3",
                  "label": "Pares de linhas finas",
                  "x": 0.5875,
                  "y": 0.1,
                  "width": 0.1625,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m22:aula-03:i5:4",
                  "label": "Mancha clara no canto da tela",
                  "x": 0.7844,
                  "y": 0.0708,
                  "width": 0.1625,
                  "height": 0.2167
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m22:aula-03:i5:1"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você confere e relata",
            "body": "Agora você consegue conferir um padrão de teste, reconhecer luz ambiente e reflexo como problema e relatar. Calibrar e decidir sobre a sala ficam com quem o serviço designa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Olhar com atenção e relatar com clareza é o que se espera de você."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m22:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:dicom-about",
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:dicom-worklist"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "O caminho do pedido",
            "body": "Hoje você vai conseguir ordenar o percurso do pedido até a imagem arquivada e dizer onde nasce cada troca de dados.",
            "dialogue": {
              "setting": "Recepção e sala de exame",
              "lines": [
                {
                  "speaker": "paciente",
                  "text": "Moça, o doutor pediu uma radiografia e disse que o resultado fica no sistema. Como o pedido dele chega até a máquina?",
                  "name": "Dona Marta"
                },
                {
                  "speaker": "duda",
                  "text": "Não sei explicar direito, Dona Marta. Vou perguntar ao Caio."
                },
                {
                  "speaker": "caio",
                  "text": "São cinco etapas, ligadas por trocas de dados. Quem sabe onde cada dado nasce encontra o erro mais depressa."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Cinco etapas, quatro trocas",
            "body": "O cadastro e o pedido registram quem é o paciente e o exame pedido. A lista de trabalho mostra esse pedido no equipamento de raios X, sem redigitar. O equipamento acrescenta à imagem os dados da aquisição e envia o arquivo DICOM. O arquivo de imagens, o PACS, guarda o estudo. A estação de visualização busca e mostra. Cada seta é uma troca de dados: o pedido chega como foi registrado, e a imagem leva esses dados no cabeçalho. Por isso a conferência começa na origem.",
            "keyPoints": [
              "Cadastro, lista de trabalho, equipamento, arquivo, estação.",
              "O cabeçalho DICOM leva identificação e dados da aquisição.",
              "O pedido chega como foi registrado."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M05.05, o número de acesso aparece como dado do cabeçalho. O que ele identifica?"
            },
            "help": "Lembre os níveis: paciente, estudo, série e imagem.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: o número de acesso é o número do pedido e identifica o estudo.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M05.05, o número de acesso aparece como dado do cabeçalho. O que ele identifica?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-04:i1:a",
                  "label": "A série de uma imagem específica",
                  "explanation": "A série tem seus próprios identificadores, diferentes do número do pedido."
                },
                {
                  "id": "option:rtg-2026:m22:aula-04:i1:b",
                  "label": "O paciente em todos os exames que fez",
                  "explanation": "O paciente é identificado por nome e identificador próprios, no nível acima."
                },
                {
                  "id": "option:rtg-2026:m22:aula-04:i1:c",
                  "label": "O pedido do exame, no nível do estudo",
                  "explanation": "Isso: o número de acesso é o número do pedido e identifica o estudo."
                },
                {
                  "id": "option:rtg-2026:m22:aula-04:i1:d",
                  "label": "A instância única de cada imagem",
                  "explanation": "Cada imagem tem um identificador único próprio, no nível mais específico."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-04:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as cinco etapas do caminho do pedido, tocando na ficha e no bloco."
            },
            "help": "Comece pelo bloco onde o pedido é registrado e siga as setas.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: o pedido nasce no cadastro e chega à imagem na estação, passando pelo equipamento e pelo arquivo.",
              "incorrect": "Alguma ficha está no lugar errado: siga as setas, do bloco onde o pedido nasce até o bloco onde a imagem é vista."
            },
            "payload": {
              "prompt": "Rotule as cinco etapas do caminho do pedido, tocando na ficha e no bloco.",
              "imageRef": "diagram:fluxo-ris-pacs",
              "points": [
                {
                  "id": "point:rtg-2026:m22:aula-04:i2:1",
                  "x": 0.175,
                  "y": 0.2917,
                  "where": "no alto à esquerda, a prancheta com uma lista",
                  "correctLabelId": "label:rtg-2026:m22:aula-04:i2:1"
                },
                {
                  "id": "point:rtg-2026:m22:aula-04:i2:2",
                  "x": 0.5,
                  "y": 0.2917,
                  "where": "no alto, no meio, a lista com marcas de conferido",
                  "correctLabelId": "label:rtg-2026:m22:aula-04:i2:2"
                },
                {
                  "id": "point:rtg-2026:m22:aula-04:i2:3",
                  "x": 0.825,
                  "y": 0.2917,
                  "where": "no alto à direita, o símbolo de radiação, em âmbar",
                  "correctLabelId": "label:rtg-2026:m22:aula-04:i2:3"
                },
                {
                  "id": "point:rtg-2026:m22:aula-04:i2:4",
                  "x": 0.825,
                  "y": 0.7083,
                  "where": "embaixo à direita, o disco de armazenamento",
                  "correctLabelId": "label:rtg-2026:m22:aula-04:i2:4"
                },
                {
                  "id": "point:rtg-2026:m22:aula-04:i2:5",
                  "x": 0.5,
                  "y": 0.7083,
                  "where": "embaixo, no meio, a tela com um visto",
                  "correctLabelId": "label:rtg-2026:m22:aula-04:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:1",
                  "label": "Cadastro e pedido"
                },
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:2",
                  "label": "Lista de trabalho"
                },
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:3",
                  "label": "Equipamento de raios X"
                },
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:6",
                  "label": "Impressora de filme"
                },
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:5",
                  "label": "Estação de visualização"
                },
                {
                  "id": "label:rtg-2026:m22:aula-04:i2:4",
                  "label": "Arquivo de imagens"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o que cada etapa acrescenta ao exame, na ordem ensinada nesta aula."
            },
            "help": "Pergunte de cada passo: o que já precisa existir para ele acontecer?",
            "type": "ordering",
            "feedback": {
              "correct": "Isso mesmo: cada etapa acrescenta algo e passa o exame adiante.",
              "incorrect": "Confira de novo: o pedido nasce no cadastro, e só depois do arquivo a estação pode buscar o estudo."
            },
            "payload": {
              "prompt": "Ordene o que cada etapa acrescenta ao exame, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m22:aula-04:i3:4",
                  "label": "O arquivo de imagens guarda o estudo completo"
                },
                {
                  "id": "item:rtg-2026:m22:aula-04:i3:5",
                  "label": "A estação de visualização busca o estudo no arquivo"
                },
                {
                  "id": "item:rtg-2026:m22:aula-04:i3:1",
                  "label": "O cadastro e o pedido registram o paciente e o exame pedido"
                },
                {
                  "id": "item:rtg-2026:m22:aula-04:i3:3",
                  "label": "O equipamento acrescenta à imagem os dados da aquisição"
                },
                {
                  "id": "item:rtg-2026:m22:aula-04:i3:2",
                  "label": "A lista de trabalho mostra o pedido no equipamento"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m22:aula-04:i3:1",
                "item:rtg-2026:m22:aula-04:i3:2",
                "item:rtg-2026:m22:aula-04:i3:3",
                "item:rtg-2026:m22:aula-04:i3:4",
                "item:rtg-2026:m22:aula-04:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre os dados ao longo do caminho."
            },
            "help": "Pergunte de cada frase: em que etapa esse dado nasce?",
            "type": "true-false",
            "feedback": {
              "correct": "Você achou onde cada dado nasce e para onde ele viaja.",
              "incorrect": "Releia o conceito: cada dado nasce numa etapa e segue pelas trocas, sem ser corrigido pelas etapas seguintes."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre os dados ao longo do caminho.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m22:aula-04:i4:1",
                  "text": "O equipamento recebe os dados do pedido como foram registrados no cadastro.",
                  "isTrue": true,
                  "explanation": "Certo: a lista leva o pedido ao equipamento sem redigitar, com o que foi registrado."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-04:i4:2",
                  "text": "A estação de visualização corrige sozinha um nome errado vindo do cadastro.",
                  "isTrue": false,
                  "explanation": "Errado: a estação mostra o que recebeu; corrigir o cadastro cabe a quem o serviço autoriza."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-04:i4:3",
                  "text": "A lista de trabalho acrescenta à imagem os dados da aquisição.",
                  "isTrue": false,
                  "explanation": "Errado: quem acrescenta os dados da aquisição é o equipamento; a lista só mostra o pedido."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-04:i4:4",
                  "text": "O arquivo de imagens é a etapa onde o pedido do exame nasce.",
                  "isTrue": false,
                  "explanation": "Errado: o pedido nasce no cadastro; o arquivo só guarda o estudo já feito."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Duda está na sala e precisa de ajuda com uma paciente simulada que não aparece na lista de trabalho."
            },
            "help": "Pense em quem pode criar ou corrigir cadastro, e no que você confere antes de expor.",
            "type": "conversation",
            "feedback": {
              "correct": "Você parou, descreveu e, depois de a equipe agir, conferiu a pessoa contra a tela.",
              "incorrect": "Reveja o turno: quem não aparece na lista é caso para a equipe, e a conferência da pessoa vale antes de expor."
            },
            "payload": {
              "prompt": "Duda está na sala e precisa de ajuda com uma paciente simulada que não aparece na lista de trabalho.",
              "speaker": "duda",
              "turns": [
                {
                  "id": "turn:rtg-2026:m22:aula-04:i5:1",
                  "line": "A paciente chegou, mas não achei o nome dela na lista do equipamento. Posso digitar um cadastro novo pra não atrasar?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:1a",
                      "label": "Digite só o nome e a equipe completa o resto depois.",
                      "reply": "Tá, então eu digito só o nome e deixo o resto em branco."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:1b",
                      "label": "Escolha na lista alguém com o nome parecido.",
                      "reply": "Tem uma bem parecida, vou escolher essa então."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:1c",
                      "label": "Descreva a falta e peça apoio à equipe.",
                      "reply": "Combinado, vou descrever o que vi e chamar a equipe."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-04:i5:1c"
                },
                {
                  "id": "turn:rtg-2026:m22:aula-04:i5:2",
                  "line": "A equipe disse que o pedido já está na lista. O que eu confiro antes de expor?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:2a",
                      "label": "Confiro dois identificadores da pessoa contra a tela.",
                      "reply": "Vou perguntar nome completo e data de nascimento, então."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:2b",
                      "label": "Começo logo, pois a equipe já resolveu tudo.",
                      "reply": "Se a equipe já resolveu, posso começar direto então."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-04:i5:2c",
                      "label": "Confio no nome da tela, sem perguntar nada à paciente.",
                      "reply": "Se o nome está na tela, não preciso perguntar de novo."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-04:i5:2a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você segue o caminho do pedido",
            "body": "Agora você consegue ordenar as cinco etapas, dizer o que cada uma acrescenta e achar onde um dado nasce. Cadastro faltando ou errado é caso para a equipe, e não para você corrigir.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Conferir na origem poupa muita procura lá no fim do caminho."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m22:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:dicom-deid"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Comprimir e copiar",
            "body": "Hoje você vai conseguir distinguir compressão com e sem perda e cuidar da identificação ao exportar uma cópia.",
            "dialogue": {
              "setting": "Sala de informática do serviço",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Preciso mandar um estudo do simulador para a turma e o arquivo é enorme. Dá para deixar menor?"
                },
                {
                  "speaker": "caio",
                  "text": "Dá, mas existem dois jeitos de comprimir, e um deles tira informação. E a cópia sai com o nome do paciente, se a gente não cuidar."
                },
                {
                  "speaker": "pixel",
                  "text": "Olhe as três cópias da mesma imagem e as barras de tamanho. O que cada uma troca?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Menor, sem perder o que importa",
            "body": "A compressão reduz o tamanho do arquivo, como mostram as barras. Sem perda, a imagem volta idêntica ao original. Com perda, o arquivo fica ainda menor, mas parte da informação não volta: na figura, a versão com perda forte virou blocos. Quanto e quando se pode comprimir com perda, o serviço define. Ao exportar, confira a identificação no cabeçalho e também na própria imagem, onde pode haver texto gravado.",
            "keyPoints": [
              "Sem perda: idêntica. Com perda: arquivo menor, informação perdida.",
              "Quanto e quando comprimir com perda: o serviço define.",
              "Confira o cabeçalho e a própria imagem."
            ],
            "visual": "compressao-de-imagem"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M05.02, a matriz tem N pixels por lado. Sem compressão e com os mesmos bits por pixel, o que acontece com o arquivo quando a matriz passa de 1000 para 2000 pixels por lado?"
            },
            "help": "Conte quantos pixels a imagem passa a ter no total.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: são o dobro de pixels em cada direção, ou seja, quatro vezes mais pixels.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M05.02, a matriz tem N pixels por lado. Sem compressão e com os mesmos bits por pixel, o que acontece com o arquivo quando a matriz passa de 1000 para 2000 pixels por lado?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-05:i1:a",
                  "label": "Ele ocupa o dobro do espaço do arquivo",
                  "explanation": "Dobra por lado, mas a imagem tem lados nas duas direções: o total quadruplica."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i1:b",
                  "label": "Ele ocupa o mesmo espaço do arquivo",
                  "explanation": "Mais pixels guardam mais números, e o arquivo sem compressão cresce."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i1:c",
                  "label": "Ele ocupa metade do espaço do arquivo",
                  "explanation": "Mais pixels não reduzem o arquivo sem compressão."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i1:d",
                  "label": "Ele ocupa quatro vezes mais espaço",
                  "explanation": "Isso: são o dobro de pixels em cada direção, ou seja, quatro vezes mais pixels."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-05:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Qual compressão devolve a imagem exatamente como era?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso: sem perda devolve a imagem idêntica, e com perda abre mão de parte da informação.",
              "incorrect": "Pense no que cada nome diz: o que não perde nada devolve tudo, e o que perde não devolve tudo."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "Na compressão ",
                ", a imagem volta idêntica; na compressão ",
                ", parte da informação não volta."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m22:aula-05:i2:1",
                  "label": "sem perda"
                },
                {
                  "id": "token:rtg-2026:m22:aula-05:i2:3",
                  "label": "irreversível"
                },
                {
                  "id": "token:rtg-2026:m22:aula-05:i2:2",
                  "label": "com perda"
                },
                {
                  "id": "token:rtg-2026:m22:aula-05:i2:5",
                  "label": "automática"
                },
                {
                  "id": "token:rtg-2026:m22:aula-05:i2:4",
                  "label": "dupla"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m22:aula-05:i2:1",
                  "correctTokenId": "token:rtg-2026:m22:aula-05:i2:1"
                },
                {
                  "id": "blank:rtg-2026:m22:aula-05:i2:2",
                  "correctTokenId": "token:rtg-2026:m22:aula-05:i2:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre compressão e cópias."
            },
            "help": "Leia cada frase com calma antes de responder.",
            "type": "blitz",
            "feedback": {
              "correct": "Você separou o que a compressão faz do que o serviço define e do que identifica o paciente.",
              "incorrect": "Releia o conceito: com e sem perda, quem define a taxa e onde se confere a identificação."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre compressão e cópias.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:1",
                  "text": "Compressão sem perda devolve a imagem idêntica à original.",
                  "isTrue": true,
                  "explanation": "Sem perda preserva todos os bits: a imagem volta igual."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:2",
                  "text": "Compressão com perda troca parte da fidelidade por um arquivo menor.",
                  "isTrue": true,
                  "explanation": "Com perda reduz a fidelidade para transferir e guardar menos dados."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:3",
                  "text": "Quem exporta a cópia escolhe sozinho a taxa de compressão.",
                  "isTrue": false,
                  "explanation": "A taxa e quando aceitar perda são definidas pelo serviço, e não por quem exporta."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:4",
                  "text": "Na compressão sem perda, o arquivo também fica menor que o original.",
                  "isTrue": true,
                  "explanation": "Sem perda também reduz o arquivo, só que menos que com perda, e a imagem volta igual."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:5",
                  "text": "Ao exportar, confira também o texto gravado dentro da imagem.",
                  "isTrue": true,
                  "explanation": "O cabeçalho não é o único lugar: a própria imagem pode trazer texto, e ele se confere."
                },
                {
                  "id": "statement:rtg-2026:m22:aula-05:i3:6",
                  "text": "Com o cabeçalho limpo, a imagem da cópia dispensa conferência.",
                  "isTrue": false,
                  "explanation": "Não dispensa: pode restar identificação escrita na própria imagem."
                }
              ],
              "passCount": 5
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que Duda faz agora?"
            },
            "help": "O nome está dentro da imagem: pense em quem decide como tratar isso.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso: identificação na imagem exige decisão do serviço, e ela relata.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Duda vai exportar um estudo de simulação para uma aula. O serviço mandou usar a rotina de exportação sem identificação. Ao abrir a cópia, ela vê o nome da paciente simulada impresso num canto da imagem.",
              "prompt": "O que Duda faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-05:i4:a",
                  "label": "Para, descreve o que viu e pede apoio antes de enviar",
                  "explanation": "Isso: identificação na imagem exige decisão do serviço, e ela relata."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i4:b",
                  "label": "Envia a cópia, pois a rotina já limpou o cabeçalho dela",
                  "explanation": "A rotina pode limpar o cabeçalho, e o nome continua ali, no canto da imagem."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i4:c",
                  "label": "Corta o canto na tela e envia a captura da tela assim",
                  "explanation": "Recortar por conta própria foge da rotina e pode esconder o problema."
                },
                {
                  "id": "option:rtg-2026:m22:aula-05:i4:d",
                  "label": "Apaga o nome com um programa de desenho e envia a cópia",
                  "explanation": "Editar a imagem por conta própria não é papel de quem exporta."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-05:i4:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada decisão ou ação: é sua, ou o serviço define?"
            },
            "help": "Quem exporta confere e avisa; quem decide regras e métodos é o serviço.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que cabe a quem exporta do que o serviço define.",
              "incorrect": "Pergunte de cada item: é uma conferência e um aviso, ou uma regra do serviço?"
            },
            "payload": {
              "prompt": "Classifique cada decisão ou ação: é sua, ou o serviço define?",
              "categories": [
                {
                  "id": "group:rtg-2026:m22:aula-05:i5:a",
                  "label": "Você faz"
                },
                {
                  "id": "group:rtg-2026:m22:aula-05:i5:b",
                  "label": "O serviço define"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:6",
                  "label": "Seguir a rotina de exportação indicada",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:3",
                  "label": "Quais estudos aceitam perda na compressão",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:4",
                  "label": "Avisar a equipe ao ver identificação onde não devia",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:2",
                  "label": "Procurar nome impresso na imagem da cópia",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:5",
                  "label": "Método de remover a identificação da cópia",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-05:i5:1",
                  "label": "Taxa de compressão com perda",
                  "categoryId": "group:rtg-2026:m22:aula-05:i5:b"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você exporta com cuidado",
            "body": "Agora você consegue distinguir compressão com e sem perda e conferir a identificação de uma cópia. Taxa, aceitação de perda e método de limpeza o serviço define; você confere e avisa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Copiar parece simples, mas o nome do paciente costuma sair junto."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m22:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m22:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m22-v1",
        "sourceIds": [
          "source:rtg-2026:m22:dicom-worklist",
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:pmc-radiology-downtime"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Quando o sistema para",
            "body": "Hoje você vai conseguir seguir a rotina de contingência do serviço sem improvisar identificação.",
            "dialogue": {
              "setting": "Sala de exame, fim da manhã",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "A lista de trabalho caiu e a paciente simulada já está esperando. Se eu digitar os dados dela no equipamento, a gente resolve em um minuto."
                },
                {
                  "speaker": "caio",
                  "text": "Um minuto agora, e uma semana depois alguém procurando esse estudo. O serviço tem uma rotina para isso."
                },
                {
                  "speaker": "pixel",
                  "text": "Antes de agir, pergunte: qual etapa do caminho parou?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Parou? Siga a rotina do serviço",
            "body": "Às vezes um sistema para: a lista de trabalho não chega, o arquivo não responde ou a estação não abre. O serviço define uma rotina de contingência escrita, que pode mudar conforme o sistema que parou. Seu papel é avisar a supervisão, descrever o que vê e seguir a rotina indicada. Você não improvisa identificação: não digita cadastro provisório, não usa dados de outro paciente e não une estudos. Acertar registros depois é com quem o serviço designa.",
            "keyPoints": [
              "Rotina de contingência: escrita e definida pelo serviço.",
              "Avisar, descrever e seguir a rotina.",
              "Sem cadastro provisório, sem dado emprestado, sem unir estudos."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na M22.04, a lista de trabalho mostra o pedido no equipamento. O que o equipamento perde se a lista não chega?"
            },
            "help": "Pense no que a lista entrega ao equipamento.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso: sem a lista, os dados do pedido não chegam prontos ao equipamento.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na M22.04, a lista de trabalho mostra o pedido no equipamento. O que o equipamento perde se a lista não chega?",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-06:i1:a",
                  "label": "A capacidade de produzir os raios X do exame",
                  "explanation": "A geração de raios X não depende da lista de trabalho."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i1:b",
                  "label": "O cabeçalho padrão de qualquer imagem nova",
                  "explanation": "O cabeçalho é criado com a imagem; o que falta é o pedido."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i1:c",
                  "label": "O pedido pronto, com os dados do exame",
                  "explanation": "Isso: sem a lista, os dados do pedido não chegam prontos ao equipamento."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i1:d",
                  "label": "A janela de exibição da estação de imagens",
                  "explanation": "A janela pertence à estação de visualização, e não ao equipamento."
                }
              ],
              "correctOptionId": "option:rtg-2026:m22:aula-06:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: O arquivo de imagens parou de responder. Toque no bloco do caminho que fica sem ter de onde buscar os estudos."
            },
            "help": "Siga a seta que sai do arquivo de imagens.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: a estação busca os estudos no arquivo; com ele parado, não tem de onde buscar.",
              "incorrect": "Esse bloco não busca estudos no arquivo: procure o que mostra as imagens já guardadas."
            },
            "payload": {
              "prompt": "O arquivo de imagens parou de responder. Toque no bloco do caminho que fica sem ter de onde buscar os estudos.",
              "imageRef": "diagram:fluxo-ris-pacs",
              "regions": [
                {
                  "id": "region:rtg-2026:m22:aula-06:i2:1",
                  "label": "Cadastro e pedido",
                  "x": 0.0563,
                  "y": 0.15,
                  "width": 0.2375,
                  "height": 0.2833
                },
                {
                  "id": "region:rtg-2026:m22:aula-06:i2:2",
                  "label": "Lista de trabalho",
                  "x": 0.3812,
                  "y": 0.15,
                  "width": 0.2375,
                  "height": 0.2833
                },
                {
                  "id": "region:rtg-2026:m22:aula-06:i2:3",
                  "label": "Equipamento de raios X",
                  "x": 0.7063,
                  "y": 0.15,
                  "width": 0.2375,
                  "height": 0.2833
                },
                {
                  "id": "region:rtg-2026:m22:aula-06:i2:4",
                  "label": "Estação de visualização",
                  "x": 0.3812,
                  "y": 0.5667,
                  "width": 0.2375,
                  "height": 0.2833
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m22:aula-06:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Conversa: Lia acompanha você numa parada do sistema, com uma paciente simulada esperando."
            },
            "help": "Pense no que o serviço escreveu para esse caso e no que você pode afirmar sem saber.",
            "type": "conversation",
            "feedback": {
              "correct": "Você avisou, seguiu a rotina e falou com a paciente sem prometer o que não sabe.",
              "incorrect": "Reveja o turno: numa parada você avisa, segue a rotina do serviço e não promete prazo nem improvisa identificação."
            },
            "payload": {
              "prompt": "Lia acompanha você numa parada do sistema, com uma paciente simulada esperando.",
              "speaker": "lia",
              "turns": [
                {
                  "id": "turn:rtg-2026:m22:aula-06:i3:1",
                  "line": "A lista caiu há dez minutos e a paciente espera. Duda quer digitar os dados dela no equipamento. O que você diz?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:1a",
                      "label": "Digita rápido e, depois, alguém acerta o cadastro.",
                      "reply": "Digitar rápido adianta o exame, mas depois quem acerta?"
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:1b",
                      "label": "Avisamos a supervisão e seguimos a rotina.",
                      "reply": "Combinado. Vou avisar a supervisão e abrir a rotina."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:1c",
                      "label": "Usa os dados do último paciente e troca só o nome.",
                      "reply": "Aproveitar os dados do anterior economiza tempo, mas de quem seriam?"
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-06:i3:1b"
                },
                {
                  "id": "turn:rtg-2026:m22:aula-06:i3:2",
                  "line": "A paciente pergunta quanto tempo vai demorar. O que você responde?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:2a",
                      "label": "Que o exame dela foi cancelado por causa da parada.",
                      "reply": "Ela vai ficar preocupada, mas é o que eu sei agora."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:2b",
                      "label": "Que será em cinco minutos, sem falta nenhuma, pode esperar.",
                      "reply": "Cinco minutos é pouco, tomara que a gente consiga."
                    },
                    {
                      "id": "option:rtg-2026:m22:aula-06:i3:2c",
                      "label": "Que o sistema parou e eu aviso quando souber mais.",
                      "reply": "Então vou falar com ela assim e volto com notícias."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m22:aula-06:i3:2c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Marque todas as corretas: Marque tudo o que você faz quando um sistema do caminho do pedido para."
            },
            "help": "Marque o que mantém a identificação segura e o que passa a decisão para o serviço.",
            "type": "multi-select",
            "feedback": {
              "correct": "Você marcou avisar, seguir a rotina e descrever, e deixou de fora o improviso.",
              "incorrect": "Releia o conceito: avisar, descrever e seguir a rotina; cadastro provisório e dado emprestado ficam de fora."
            },
            "payload": {
              "prompt": "Marque tudo o que você faz quando um sistema do caminho do pedido para.",
              "options": [
                {
                  "id": "option:rtg-2026:m22:aula-06:i4:a",
                  "label": "Avisar a supervisão sobre o que parou",
                  "explanation": "Avisar a supervisão é o primeiro passo, e a equipe decide a continuação."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i4:b",
                  "label": "Digitar um cadastro provisório no equipamento",
                  "explanation": "Cadastro provisório é improviso de identificação e foge do seu papel."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i4:c",
                  "label": "Seguir a rotina de contingência escrita pelo serviço",
                  "explanation": "A rotina escrita define o caminho certo para cada sistema que parou."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i4:d",
                  "label": "Descrever o que a tela mostra, sem interpretar",
                  "explanation": "Descrever com exatidão ajuda quem vai investigar a parada."
                },
                {
                  "id": "option:rtg-2026:m22:aula-06:i4:e",
                  "label": "Usar os dados de outro paciente parecido",
                  "explanation": "Dados de outro paciente colocam a imagem na identificação errada."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m22:aula-06:i4:a",
                "option:rtg-2026:m22:aula-06:i4:c",
                "option:rtg-2026:m22:aula-06:i4:d"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m22:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m22:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Numa parada, classifique cada item: é seu, ou o serviço decide?"
            },
            "help": "Você age dentro da rotina; quem escreve e decide a rotina é o serviço.",
            "type": "categorize",
            "feedback": {
              "correct": "Você separou o que cabe a quem está na sala do que o serviço define.",
              "incorrect": "Pergunte de cada item: é avisar, descrever e seguir, ou é regra e decisão do serviço?"
            },
            "payload": {
              "prompt": "Numa parada, classifique cada item: é seu, ou o serviço decide?",
              "categories": [
                {
                  "id": "group:rtg-2026:m22:aula-06:i5:a",
                  "label": "Você faz"
                },
                {
                  "id": "group:rtg-2026:m22:aula-06:i5:b",
                  "label": "O serviço decide"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:2",
                  "label": "Qual rotina de contingência vale",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:6",
                  "label": "Quem acerta os cadastros depois",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:3",
                  "label": "Descrever o que a tela mostra",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:4",
                  "label": "Quando voltar ao fluxo normal",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:b"
                },
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:5",
                  "label": "Seguir a rotina indicada",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:a"
                },
                {
                  "id": "item:rtg-2026:m22:aula-06:i5:1",
                  "label": "Avisar a supervisão da parada",
                  "categoryId": "group:rtg-2026:m22:aula-06:i5:a"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m22:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você segue a rotina, sem improvisar",
            "body": "Agora você consegue agir numa parada do sistema: avisar, descrever, seguir a rotina escrita pelo serviço e não improvisar identificação. Voltar ao normal e acertar registros é com quem o serviço designa.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "No dia em que o sistema para, a rotina escrita é a sua melhor colega."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m22",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-01"
        ],
        "prompt": "O que o sistema procura no histograma de uma imagem?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-01:c1:a",
            "label": "A faixa de valores que corresponde à anatomia"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c1:b",
            "label": "O pixel mais claro, para ajustar o brilho dele"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c1:c",
            "label": "A dose que o paciente recebeu no exame"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c1:d",
            "label": "O valor do pixel mais escuro da imagem"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-01:c1:a",
        "feedback": {
          "correct": "Isso: é o grupo da anatomia, e a conversão em brilho usa essa faixa.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:pmc-exposure-index",
          "source:rtg-2026:m22:exam-prep-processing"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-01"
        ],
        "prompt": "A exposição no detector estava correta, mas a imagem saiu escura demais. Qual explicação combina com esta aula?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-01:c2:a",
            "label": "A exposição foi certa, então a imagem não pode sair escura"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c2:b",
            "label": "A janela da estação altera os valores guardados"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c2:c",
            "label": "A faixa de interesse foi mal escolhida, por campo ou região"
          },
          {
            "id": "option:rtg-2026:m22:aula-01:c2:d",
            "label": "O histograma só aparece em sistemas de filme"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-01:c2:c",
        "feedback": {
          "correct": "Isso: faixa errada muda a conversão em brilho mesmo com exposição correta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:exam-prep-processing",
          "source:rtg-2026:m22:pmc-exposure-index",
          "source:rtg-2026:m22:pmc-histogram-errors"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-02"
        ],
        "prompt": "Dois traços finos vizinhos, bem separados no original, parecem um só depois de um filtro, e o fundo está liso. Qual filtro explica melhor?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-02:c1:a",
            "label": "Realce de borda forte"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c1:b",
            "label": "Suavização forte"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c1:c",
            "label": "Aumento da exposição no detector"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c1:d",
            "label": "Troca da janela de exibição na estação"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-02:c1:b",
        "feedback": {
          "correct": "Isso: suavizar alisa o fundo e funde detalhes finos próximos.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:exam-prep-processing",
          "source:rtg-2026:m22:wikibooks-computer"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-02"
        ],
        "prompt": "Qual é o preço mais provável de aumentar muito o realce de borda?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-02:c2:a",
            "label": "O detalhe fino some porque a transição alarga"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c2:b",
            "label": "A exposição no detector sobe junto com o realce"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c2:c",
            "label": "O arquivo deixa de guardar os valores originais"
          },
          {
            "id": "option:rtg-2026:m22:aula-02:c2:d",
            "label": "O ruído fica mais evidente junto com as bordas"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-02:c2:d",
        "feedback": {
          "correct": "Isso: o realce marca as bordas e deixa o ruído mais evidente junto com elas.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:exam-prep-processing",
          "source:rtg-2026:m22:wikibooks-computer"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-03"
        ],
        "prompt": "Dois degraus de cinza vizinhos do padrão de teste parecem iguais. O que você faz?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-03:c1:a",
            "label": "Ajusto o brilho do monitor até eles se distinguirem"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c1:b",
            "label": "Considero normal, pois o arquivo da imagem está intacto"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c1:c",
            "label": "Descrevo o que vi e aviso a supervisão"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c1:d",
            "label": "Apago o padrão de teste da estação"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-03:c1:c",
        "feedback": {
          "correct": "Isso: você relata e a equipe designada decide o ajuste.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:aapm-tg270"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-03"
        ],
        "prompt": "Por que a luz do ambiente atrapalha a leitura dos tons escuros?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-03:c2:a",
            "label": "Soma-se à luz da tela e aproxima os tons escuros"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c2:b",
            "label": "Ela altera os valores de pixel guardados no arquivo da imagem"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c2:c",
            "label": "Ela reduz a exposição no detector da imagem original"
          },
          {
            "id": "option:rtg-2026:m22:aula-03:c2:d",
            "label": "Ela só afeta os tons claros da imagem"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-03:c2:a",
        "feedback": {
          "correct": "Isso: a luz da sala aumenta o brilho do preto e aproxima os tons escuros.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:aapm-tg270",
          "source:rtg-2026:m22:wikibooks-image"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-04"
        ],
        "prompt": "Em que etapa nascem os dados da aquisição que o cabeçalho da imagem leva?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-04:c1:a",
            "label": "Na lista de trabalho"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c1:b",
            "label": "No cadastro e no pedido"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c1:c",
            "label": "Na estação de visualização"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c1:d",
            "label": "No equipamento de raios X"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-04:c1:d",
        "feedback": {
          "correct": "Isso: o equipamento acrescenta à imagem os dados da aquisição antes de enviar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:dicom-about"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-04"
        ],
        "prompt": "Um nome saiu errado já no cadastro e ninguém percebeu. Com que nome a imagem tende a chegar ao arquivo?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-04:c2:a",
            "label": "Com o nome corrigido pela estação"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c2:b",
            "label": "Com o mesmo nome do cadastro"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c2:c",
            "label": "Com um nome escolhido pelo equipamento"
          },
          {
            "id": "option:rtg-2026:m22:aula-04:c2:d",
            "label": "Sem nome, pois o arquivo o recusa"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-04:c2:b",
        "feedback": {
          "correct": "Isso: o pedido chega como foi registrado e a imagem leva esses dados, por isso se confere na origem.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-computer",
          "source:rtg-2026:m22:dicom-worklist"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-05"
        ],
        "prompt": "Uma cópia comprimida, comparada pixel a pixel com o original, tem valores diferentes. Que compressão foi usada?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-05:c1:a",
            "label": "Compressão com perda"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c1:b",
            "label": "Compressão sem perda"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c1:c",
            "label": "Realce de borda forte"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c1:d",
            "label": "Janela de exibição estreita"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-05:c1:a",
        "feedback": {
          "correct": "Isso: na compressão com perda, parte da informação não volta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:wikibooks-computer"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-05"
        ],
        "prompt": "Antes de enviar a cópia de um estudo, o que você confere além do cabeçalho?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-05:c2:a",
            "label": "Se a janela de exibição está estreita"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c2:b",
            "label": "Se o monitor mostra todos os degraus"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c2:c",
            "label": "Se há identificação gravada dentro da imagem"
          },
          {
            "id": "option:rtg-2026:m22:aula-05:c2:d",
            "label": "Se a taxa de compressão é a maior possível"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-05:c2:c",
        "feedback": {
          "correct": "Isso: a cópia pode trazer texto dentro da própria imagem, e ele também se confere.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:dicom-deid"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-06"
        ],
        "prompt": "O sistema de arquivo parou e há uma paciente simulada esperando. O que você faz primeiro?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-06:c1:a",
            "label": "Guardo as imagens no meu celular até voltar"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c1:b",
            "label": "Digito um cadastro provisório para continuar"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c1:c",
            "label": "Espero em silêncio até o sistema voltar sozinho"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c1:d",
            "label": "Aviso a supervisão e sigo a rotina do serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-06:c1:d",
        "feedback": {
          "correct": "Isso: avisar e seguir a rotina escrita é o primeiro passo.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:pmc-radiology-downtime"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m22:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m22:aula-06"
        ],
        "prompt": "Quem define a rotina de contingência que vale numa parada?",
        "options": [
          {
            "id": "option:rtg-2026:m22:aula-06:c2:a",
            "label": "Cada estudante, conforme o caso"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c2:b",
            "label": "O serviço, em documento escrito"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c2:c",
            "label": "O fabricante do monitor da estação"
          },
          {
            "id": "option:rtg-2026:m22:aula-06:c2:d",
            "label": "O padrão DICOM, igual para todo serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:m22:aula-06:c2:b",
        "feedback": {
          "correct": "Isso: o serviço define a rotina por escrito, e você a segue.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m22:pmc-radiology-downtime"
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
      "claimId": "interaction:rtg-2026:m22:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-01:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-01:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i4:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:pmc-exposure-index",
        "source:rtg-2026:m22:pmc-histogram-errors"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-02:i2:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-02:i2:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m22:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m22:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m22:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m22:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-02:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-02:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-02:i5:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-02:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-02:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:exam-prep-processing"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i3:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-03:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-03:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:i4:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-03:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-image",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:aapm-tg270",
        "source:rtg-2026:m22:wikibooks-image"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "point:rtg-2026:m22:aula-04:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "label:rtg-2026:m22:aula-04:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-04:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-04:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-04:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-04:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-04:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:1b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:1c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-04:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:i5:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-about",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-about"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m22:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m22:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "token:rtg-2026:m22:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "token:rtg-2026:m22:aula-05:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m22:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "token:rtg-2026:m22:aula-05:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m22:aula-05:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m22:aula-05:i3:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-05:i5:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-05:i5:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-05:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-deid"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "region:rtg-2026:m22:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m22:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:2a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i3:2c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime",
        "source:rtg-2026:m22:dicom-worklist"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i4:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:i4:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-06:i5:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "group:rtg-2026:m22:aula-06:i5:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:6",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "item:rtg-2026:m22:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m22:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "step:rtg-2026:m22:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:dicom-worklist",
        "source:rtg-2026:m22:wikibooks-computer",
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m22:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m22:aula-06:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m22:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m22:pmc-radiology-downtime"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m22:aula-01",
        "hook": "Complete a frase: o histograma conta quantos pixels têm cada ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-01"
          ],
          "prompt": "O que o histograma conta numa imagem digital?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-01:rg:a",
              "label": "Quantas exposições foram feitas no turno"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rg:b",
              "label": "Quantos centímetros o campo de visão cobre"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rg:c",
              "label": "Quantos pixels têm cada valor"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rg:d",
              "label": "Quantos pacientes estão na lista de trabalho"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-01:rg:c",
          "feedback": {
            "correct": "Isso: o gráfico mostra a frequência de cada valor de pixel.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:wikibooks-computer"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-01"
          ],
          "prompt": "Na simulação, a imagem do manequim sai escura e o campo estava bem deslocado do centro. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-01:rt:a",
              "label": "Repito a exposição com mais técnica por conta própria"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rt:b",
              "label": "Descrevo o campo e o aspecto e chamo a equipe"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rt:c",
              "label": "Aumento o brilho do monitor até ficar boa"
            },
            {
              "id": "option:rtg-2026:m22:aula-01:rt:d",
              "label": "Envio assim e avisarei se alguém reclamar"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-01:rt:b",
          "feedback": {
            "correct": "Isso: descrever e pedir apoio é o seu papel; a equipe decide o que fazer.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:exam-prep-processing"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m22:aula-02",
        "hook": "Complete a frase: o realce de borda deixa o contorno mais marcado, mas deixa o ... mais evidente.",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-02"
          ],
          "prompt": "O que o realce de borda deixa mais evidente, além do contorno?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-02:rg:a",
              "label": "O ruído da imagem"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rg:b",
              "label": "O tamanho do pixel"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rg:c",
              "label": "A dose do paciente"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rg:d",
              "label": "O nome do protocolo"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-02:rg:a",
          "feedback": {
            "correct": "Isso: o realce de borda amplifica também o ruído.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:exam-prep-processing"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-02"
          ],
          "prompt": "Numa imagem de teste, um fio fino aparece com clareza, mas o fundo está bem granulado, bem mais que no original. Qual filtro foi aplicado em excesso?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-02:rt:a",
              "label": "A suavização"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rt:b",
              "label": "A conversão para brilho na tela"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rt:c",
              "label": "A compressão do arquivo"
            },
            {
              "id": "option:rtg-2026:m22:aula-02:rt:d",
              "label": "O realce de borda"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-02:rt:d",
          "feedback": {
            "correct": "Isso: realce marca o fio e amplifica o granulado do fundo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:exam-prep-processing"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m22:aula-03",
        "hook": "Complete a frase: o quadradinho de pouco contraste dentro do quadrado deve ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-03"
          ],
          "prompt": "O que mostra o quadradinho de pouco contraste dentro de um quadrado do padrão?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-03:rg:a",
              "label": "Se o arquivo da imagem guarda mais bits por pixel"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rg:b",
              "label": "Se a exposição foi a certa para a região"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rg:c",
              "label": "Se o nome do paciente está correto na tela"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rg:d",
              "label": "Se o monitor revela diferenças sutis de tom"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-03:rg:d",
          "feedback": {
            "correct": "Isso: se o quadradinho aparece, o monitor mostra diferenças pequenas.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:aapm-tg270"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-03"
          ],
          "prompt": "Na sala de visualização, uma luminária nova passa a refletir na tela. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-03:rt:a",
              "label": "Giro o monitor sozinho para o reflexo sair"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rt:b",
              "label": "Relato o reflexo e deixo a decisão para a supervisão"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rt:c",
              "label": "Ignoro, porque o arquivo da imagem não muda"
            },
            {
              "id": "option:rtg-2026:m22:aula-03:rt:d",
              "label": "Aumento o brilho da tela até cobrir o reflexo"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-03:rt:b",
          "feedback": {
            "correct": "Isso: você relata e a supervisão decide sobre a luz da sala.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:aapm-tg270",
            "source:rtg-2026:m22:wikibooks-image"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m22:aula-04",
        "hook": "Complete a frase: a lista de trabalho mostra o pedido no ... de raios X.",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-04"
          ],
          "prompt": "Em que etapa o pedido aparece para quem vai fazer a imagem?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-04:rg:a",
              "label": "No arquivo de imagens depois do exame"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rg:b",
              "label": "Na estação de visualização antes do exame"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rg:c",
              "label": "No cabeçalho de uma imagem ainda não feita"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rg:d",
              "label": "Na lista de trabalho do equipamento"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-04:rg:d",
          "feedback": {
            "correct": "Isso: a lista mostra o pedido ao operador para escolher o exame.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:dicom-worklist"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-04"
          ],
          "prompt": "Qual etapa envia a imagem ao arquivo de imagens?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-04:rt:a",
              "label": "A lista de trabalho"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rt:b",
              "label": "O equipamento de raios X"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rt:c",
              "label": "A estação de visualização"
            },
            {
              "id": "option:rtg-2026:m22:aula-04:rt:d",
              "label": "O cadastro e o pedido"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-04:rt:b",
          "feedback": {
            "correct": "Isso: o equipamento acrescenta os dados da aquisição e envia o arquivo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:wikibooks-computer",
            "source:rtg-2026:m22:dicom-about"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m22:aula-05",
        "hook": "Complete a frase: na compressão sem perda, a imagem volta ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-05"
          ],
          "prompt": "O que a compressão sem perda devolve?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-05:rg:a",
              "label": "Uma imagem com parte da informação perdida"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rg:b",
              "label": "Uma imagem sempre menor que qualquer outra"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rg:c",
              "label": "A imagem idêntica à original"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rg:d",
              "label": "Uma imagem sem o nome do paciente"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-05:rg:c",
          "feedback": {
            "correct": "Isso: sem perda preserva todos os valores.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:wikibooks-computer"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-05"
          ],
          "prompt": "Quem define até que ponto um estudo pode ser comprimido com perda?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-05:rt:a",
              "label": "O serviço, com suas regras"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rt:b",
              "label": "Quem exporta a cópia, a cada exportação"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rt:c",
              "label": "O fabricante do monitor da estação"
            },
            {
              "id": "option:rtg-2026:m22:aula-05:rt:d",
              "label": "O sistema de arquivo, sozinho"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-05:rt:a",
          "feedback": {
            "correct": "Isso: quem exporta segue a regra que o serviço define.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:wikibooks-computer"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m22:aula-06",
        "hook": "Complete a frase: numa parada do sistema, eu aviso, descrevo e sigo a ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m22:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-06"
          ],
          "prompt": "O que você segue quando um sistema do caminho do pedido para?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-06:rg:a",
              "label": "A rotina que você acha mais rápida"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rg:b",
              "label": "A rotina de contingência escrita do serviço"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rg:c",
              "label": "A rotina do último turno, de memória"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rg:d",
              "label": "A rotina de outro serviço onde já esteve"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-06:rg:b",
          "feedback": {
            "correct": "Isso: o serviço define a rotina, e você a segue.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:pmc-radiology-downtime"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m22:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m22:aula-06"
          ],
          "prompt": "A estação de visualização não abre, mas o arquivo continua guardando as imagens. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:m22:aula-06:rt:a",
              "label": "Aviso a supervisão e descrevo o que parou"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rt:b",
              "label": "Refaço o exame para ter outra cópia da imagem"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rt:c",
              "label": "Copio os estudos para um pen drive pessoal"
            },
            {
              "id": "option:rtg-2026:m22:aula-06:rt:d",
              "label": "Uno os estudos do paciente em outro arquivo"
            }
          ],
          "correctOptionId": "option:rtg-2026:m22:aula-06:rt:a",
          "feedback": {
            "correct": "Isso: você avisa e descreve, e a rotina do serviço orienta o resto.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m22:pmc-radiology-downtime"
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
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "4bf50b413688fa689388feb8ffcce142c310f257b7979b7e51ae3f8f72825022"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
