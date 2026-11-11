// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_S_MN: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:s-mn",
  "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e",
  "trackId": "track:rtg-2026:s-mn",
  "unitId": "unit:rtg-2026:s-mn",
  "contentVersion": "rtg-2026-s-mn-v1",
  "competencyIds": [
    "competency:rtg-2026:s-mn:aula-01",
    "competency:rtg-2026:s-mn:aula-02",
    "competency:rtg-2026:s-mn:aula-03",
    "competency:rtg-2026:s-mn:aula-04",
    "competency:rtg-2026:s-mn:aula-05",
    "competency:rtg-2026:s-mn:aula-06",
    "competency:rtg-2026:s-mn:aula-07",
    "competency:rtg-2026:s-mn:aula-08"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:s-mn:cnen-norma-3-05",
      "title": "Norma ANSN 3.05: Requisitos de Segurança e Proteção Radiológica para Serviços de Medicina Nuclear (Resolução CNEN 159/13)",
      "publisher": "CNEN/ANSN",
      "url": "https://www.gov.br/cnen/pt-br/acesso-rapido/normas/grupo-3/ansn-3-05-requisitos-de-seguranca-e-protecao-radiologica-para-servicos-de-medicina-nuclear.pdf",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Ato normativo federal; consultado para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
      "title": "General Nuclear Medicine",
      "publisher": "RadiologyInfo.org (ACR e RSNA)",
      "url": "https://www.radiologyinfo.org/en/info/gennuclear",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Material protegido; consultado para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
      "title": "Positron Emission Tomography - Computed Tomography (PET/CT)",
      "publisher": "RadiologyInfo.org (ACR e RSNA)",
      "url": "https://www.radiologyinfo.org/en/info/pet",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Material protegido; consultado para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:nibib-medicina-nuclear",
      "title": "Nuclear Medicine",
      "publisher": "NIBIB/NIH",
      "url": "https://www.nibib.nih.gov/science-education/science-topics/nuclear-medicine",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:wna-radioisotopos",
      "title": "Radioisotopes in Medicine",
      "publisher": "World Nuclear Association",
      "url": "https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/radioisotopes-in-medicine",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Biblioteca informativa; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:who-radiacao-ionizante",
      "title": "Ionizing radiation and health effects",
      "publisher": "Organização Mundial da Saúde",
      "url": "https://www.who.int/news-room/fact-sheets/detail/ionizing-radiation-and-health-effects",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Nota descritiva institucional; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:hps-acao-indireta",
      "title": "Ask the Experts: indirect ionization and its effects on the DNA (George Chabot, 2019)",
      "publisher": "Health Physics Society",
      "url": "https://hps.org/publicinformation/ate/q13187/",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Resposta de sociedade científica; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:cdc-contaminacao-exposicao",
      "title": "Radiation Contamination Versus Exposure",
      "publisher": "CDC",
      "url": "https://www.cdc.gov/radiation-emergencies/infographic/contamination-versus-exposure.html",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para fatos, com redação própria."
    },
    {
      "id": "source:rtg-2026:s-mn:vumc-emergencias-mn",
      "title": "Nuclear Medicine: Radioactive Material Emergency Procedures (Vanderbilt Clarksville Hospital)",
      "publisher": "Vanderbilt University Medical Center",
      "url": "https://www.vumc.org/safety/sites/default/files/public_files/rad/vch/nuclear-medicine-emergency-procedures-vch.pdf",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Procedimento de hospital dos EUA, usado só como exemplo da lógica geral; no Brasil vale o plano de proteção do serviço."
    },
    {
      "id": "source:rtg-2026:s-mn:iaea-srs-40",
      "title": "Applying Radiation Safety Standards in Nuclear Medicine (Safety Reports Series No. 40)",
      "publisher": "IAEA",
      "url": "https://www-pub.iaea.org/MTCD/publications/PDF/Pub1207_web.pdf",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Publicação que a própria IAEA marca como substituída pela SSG-46; usada só para princípios gerais de derramamento e monitoração de roupas. Consultada para fatos, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:s-mn:peterson-detectores-spect",
      "title": "SPECT detectors: the Anger Camera and beyond (Peterson e Furenlid, Phys Med Biol, 2011)",
      "publisher": "PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3178269/",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Artigo em acervo aberto; consultado para fatos, sem aproveitar frase nem figura."
    },
    {
      "id": "source:rtg-2026:s-mn:willowson-spect-ct",
      "title": "Evolving SPECT-CT technology (Willowson e Bailey, Br J Radiol, 2024)",
      "publisher": "PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13274653/",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Artigo em acervo aberto; consultado para fatos, sem aproveitar frase nem figura."
    },
    {
      "id": "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
      "title": "Artefacts of PET/CT images (Pettinato e colaboradores, Biomed Imaging Interv J, 2006)",
      "publisher": "PubMed Central",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3097808/",
      "accessedAt": "2026-11-07",
      "use": "factual-reference",
      "licenseNote": "Artigo em acervo aberto; consultado para fatos, sem aproveitar frase nem figura."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:s-mn:aula-01",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
          "source:rtg-2026:s-mn:nibib-medicina-nuclear",
          "source:rtg-2026:s-mn:who-radiacao-ionizante",
          "source:rtg-2026:s-mn:hps-acao-indireta"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Átomo instável, meia-vida e dano",
            "body": "Hoje você vai conseguir explicar a meia-vida como física e diferenciar a ação direta da indireta da radiação na célula.",
            "dialogue": {
              "setting": "Sala de estudo do serviço de medicina nuclear",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Na visão geral eu entendi que a fonte é o paciente. Mas o que faz esse átomo emitir, e por que a emissão vai caindo?"
                },
                {
                  "speaker": "caio",
                  "text": "Aqui cada material tem seu relógio. Tem um que conta em horas, outro em minutos, e isso muda a rotina inteira."
                },
                {
                  "speaker": "lia",
                  "text": "Antes do relógio, uma pergunta: quando a radiação entra numa célula, o que ela encontra pela frente?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Instável, decai, ioniza",
            "body": "Radionuclídeo é um átomo instável: ele se desfaz espontaneamente e libera o excesso de energia como radiação ionizante. Meia-vida é o tempo para a atividade cair à metade pelo decaimento. O tecnécio-99m tem 6 horas; o flúor-18, 110 minutos. Atividade se mede em becquerel, um decaimento por segundo; dose absorvida, em gray; dose efetiva, em sievert. Na célula, a ação é direta quando a ionização ocorre no DNA ou muito perto dele, e indireta quando a radiação age sobre a água e forma radicais livres. Efeitos agudos só surgem acima de um limiar; os de longo prazo não são certos, mas ficam mais prováveis com a dose.",
            "keyPoints": [
              "A cada meia-vida, a atividade cai à metade.",
              "Direta: no DNA ou perto dele. Indireta: pela água e pelos radicais livres.",
              "Efeito agudo tem limiar; no de longo prazo, a dose muda a probabilidade."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da visão geral de medicina nuclear: durante a aquisição, de onde sai a radiação que a câmara gama registra?"
            },
            "help": "Pense em quem é a fonte nesta modalidade, comparando com a radiografia.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O radiofármaco emite de dentro do corpo. Agora vamos entender por que esse átomo emite.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da visão geral de medicina nuclear: durante a aquisição, de onde sai a radiação que a câmara gama registra?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i1:a",
                  "label": "De um tubo de raios X dentro da câmara",
                  "explanation": "Esse é o caminho da radiografia. Retome: nesta modalidade o aparelho só detecta."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i1:b",
                  "label": "Das paredes blindadas da sala de exame",
                  "explanation": "A blindagem contém radiação, não produz o sinal. Confira de novo onde está o material radioativo."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i1:c",
                  "label": "Do material administrado ao paciente",
                  "explanation": "Isso. O radiofármaco emite de dentro do corpo. Agora vamos entender por que esse átomo emite."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i1:d",
                  "label": "Do cristal, que emite e depois recolhe",
                  "explanation": "A câmara não emite o sinal da imagem. Retome a diferença entre quem emite e quem detecta."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Num frasco didático, fora de qualquer atendimento, há um radionuclídeo fictício com meia-vida de 2 horas e 80 unidades de atividade. Quanto resta depois de 6 horas, só pelo decaimento?"
            },
            "help": "Conte quantas meias-vidas cabem no intervalo e divida por dois uma vez de cada vez.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Em 6 horas cabem três meias-vidas de 2 horas: 80, 40, 20 e 10. Vale só para este esquema didático.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Num frasco didático, fora de qualquer atendimento, há um radionuclídeo fictício com meia-vida de 2 horas e 80 unidades de atividade. Quanto resta depois de 6 horas, só pelo decaimento?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i2:a",
                  "label": "5 unidades",
                  "explanation": "Cinco unidades equivalem a quatro meias-vidas, ou 8 horas. Refaça a contagem para 6 horas."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i2:b",
                  "label": "10 unidades",
                  "explanation": "Isso. Em 6 horas cabem três meias-vidas de 2 horas: 80, 40, 20 e 10. Vale só para este esquema didático."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i2:c",
                  "label": "20 unidades",
                  "explanation": "Vinte unidades equivalem a duas meias-vidas, ou 4 horas. Ainda falta uma etapa até 6 horas."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i2:d",
                  "label": "40 unidades",
                  "explanation": "Quarenta unidades equivalem a uma meia-vida, ou 2 horas. Confira quantas cabem em 6 horas."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-01:i2:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada termo ao que ele informa."
            },
            "help": "Só um dos termos é medida de tempo. Dois deles falam de dose.",
            "type": "matching",
            "feedback": {
              "correct": "Cada termo no seu lugar: becquerel fala do material que decai; gray e sievert falam da dose; meia-vida fala de tempo.",
              "incorrect": "Retome o conceito: comece separando o que descreve o material, o que descreve a dose e o que descreve o tempo."
            },
            "payload": {
              "prompt": "Ligue cada termo ao que ele informa.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-01:i3:1",
                  "left": "Becquerel",
                  "right": "Atividade: um decaimento por segundo"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-01:i3:2",
                  "left": "Gray",
                  "right": "Dose absorvida"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-01:i3:3",
                  "left": "Sievert",
                  "right": "Dose efetiva, que estima o potencial de dano"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-01:i3:4",
                  "left": "Meia-vida",
                  "right": "Tempo para a atividade cair à metade"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Como classificar os dois esquemas, conforme a aula?"
            },
            "help": "Pergunte em cada esquema: a ionização aconteceu no DNA ou numa espécie química intermediária?",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Ionização na fita é ação direta; dano causado pelo radical livre formado na água é ação indireta.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na revisão, Duda compara dois esquemas. No primeiro, um elétron posto em movimento ioniza um átomo na própria fita de DNA. No segundo, a radiação age sobre a água da célula, forma um radical livre, e é ele que rompe uma ligação da fita.",
              "prompt": "Como classificar os dois esquemas, conforme a aula?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i4:a",
                  "label": "Os dois são diretos, porque o DNA foi atingido",
                  "explanation": "O resultado é parecido, mas o caminho muda. Confira de novo quem atua no segundo esquema."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i4:b",
                  "label": "Os dois são indiretos, porque há elétrons em ação",
                  "explanation": "A classificação não depende disso. Retome o papel da água no segundo esquema."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i4:c",
                  "label": "O primeiro é indireto e o segundo é direto",
                  "explanation": "A classificação ficou invertida. Retome: qual esquema precisa da água para causar o dano?"
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i4:d",
                  "label": "O primeiro é direto e o segundo é indireto",
                  "explanation": "Isso. Ionização na fita é ação direta; dano causado pelo radical livre formado na água é ação indireta."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-01:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma colega do setor de radiografia afirma: 'Todo efeito da radiação tem limiar. Abaixo dele, o risco é zero'. O que a aula permite responder?"
            },
            "help": "Separe os dois tipos de efeito antes de responder.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Efeitos agudos aparecem acima de um limiar. Os de longo prazo não são certos, e a probabilidade cresce com a dose.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma colega do setor de radiografia afirma: 'Todo efeito da radiação tem limiar. Abaixo dele, o risco é zero'. O que a aula permite responder?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i5:a",
                  "label": "Isso vale para os agudos; nos de longo prazo, a dose muda a chance",
                  "explanation": "Isso. Efeitos agudos aparecem acima de um limiar. Os de longo prazo não são certos, e a probabilidade cresce com a dose."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i5:b",
                  "label": "Isso vale para os de longo prazo; os agudos surgem em qualquer dose",
                  "explanation": "A relação ficou trocada. Retome qual tipo de efeito tem limiar."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i5:c",
                  "label": "Isso vale para todos os efeitos, sejam agudos ou de longo prazo",
                  "explanation": "Essa frase ignora os efeitos de longo prazo. Confira de novo o que muda com a dose neles."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-01:i5:d",
                  "label": "Isso não vale para nenhum, porque nenhum efeito depende da dose",
                  "explanation": "A dose importa nos dois casos, de formas diferentes. Retome o último trecho do conceito."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-01:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Relógio e célula",
            "body": "Agora você consegue explicar a meia-vida num esquema de física, ler as unidades básicas e dizer como a radiação danifica a célula de forma direta ou indireta.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Meia-vida aqui é física de estudo. A atividade de cada paciente é assunto da prescrição do médico nuclear."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-02",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:wna-radioisotopos",
          "source:rtg-2026:s-mn:cnen-norma-3-05",
          "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "O percurso do radiofármaco",
            "body": "Hoje você vai conseguir ordenar o percurso do radiofármaco, da origem à administração, e dizer quem faz cada passo.",
            "dialogue": {
              "setting": "Corredor entre a recepção e o laboratório",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Chegou o embalado da manhã. Antes de abrir qualquer coisa, tem inspeção e tem anotação."
                },
                {
                  "speaker": "duda",
                  "text": "Posso levar até o laboratório? Só para ajudar, o pessoal está correndo hoje."
                },
                {
                  "speaker": "lia",
                  "text": "Vontade de ajudar é boa. Mas, nesse percurso, quem está autorizado a tocar em quê?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Da origem ao paciente",
            "body": "Radiofármaco é uma molécula carreadora ligada a um átomo radioativo. O tecnécio-99m vem de um gerador: o molibdênio-99, com meia-vida de 66 horas, decai nele, e uma solução salina o lava para fora, a eluição. O flúor-18 vem do cíclotron e entra no FDG; como decai depressa, o FDG precisa estar a cerca de duas horas de um cíclotron. No serviço, a ordem ensinada aqui é: inspecionar e registrar o embalado, manipular no laboratório, aferir no medidor de atividade, conferir controle de qualidade, prescrição e identificação, administrar e aguardar. Tudo é de pessoal treinado e autorizado. Estudante observa; viu algo errado, não toca e avisa.",
            "keyPoints": [
              "Gerador e eluição para o tecnécio-99m; cíclotron para o flúor-18.",
              "A atividade é aferida antes da administração.",
              "Estudante observa e avisa: não manipula nem administra."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da aula anterior: o tecnécio-99m tem meia-vida de 6 horas e o flúor-18, de 110 minutos. Qual dos dois perde metade da atividade em menos tempo?"
            },
            "help": "Coloque os dois tempos na mesma unidade antes de comparar.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. São menos de duas horas contra seis. Essa pressa explica boa parte do percurso de hoje.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da aula anterior: o tecnécio-99m tem meia-vida de 6 horas e o flúor-18, de 110 minutos. Qual dos dois perde metade da atividade em menos tempo?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i1:a",
                  "label": "O tecnécio-99m, com 6 horas",
                  "explanation": "Seis horas é um intervalo mais longo que 110 minutos. Converta para a mesma unidade e compare."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i1:b",
                  "label": "Os dois levam o mesmo tempo",
                  "explanation": "Cada radionuclídeo tem meia-vida própria. Retome os dois valores do enunciado."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i1:c",
                  "label": "Nenhum decai antes do exame",
                  "explanation": "O decaimento não espera o exame: ele acontece o tempo todo. Retome a definição de meia-vida."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i1:d",
                  "label": "O flúor-18, com 110 minutos",
                  "explanation": "Isso. São menos de duas horas contra seis. Essa pressa explica boa parte do percurso de hoje."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-02:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada termo ao papel que ele tem na origem do radiofármaco."
            },
            "help": "Pense em duas rotas: uma começa com molibdênio e a outra, com flúor.",
            "type": "matching",
            "feedback": {
              "correct": "É isso: dentro do gerador o molibdênio-99 decai, a eluição retira o tecnécio-99m, e o cíclotron produz o flúor-18 usado no FDG.",
              "incorrect": "Retome o conceito: dois termos pertencem à rota do tecnécio-99m e dois à rota do flúor-18. Separe as rotas primeiro."
            },
            "payload": {
              "prompt": "Ligue cada termo ao papel que ele tem na origem do radiofármaco.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-02:i2:1",
                  "left": "Gerador",
                  "right": "Molibdênio-99 decai em tecnécio-99m"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-02:i2:2",
                  "left": "Eluição",
                  "right": "Solução salina lava o tecnécio-99m para fora"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-02:i2:3",
                  "left": "Cíclotron",
                  "right": "Produz o flúor-18"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-02:i2:4",
                  "left": "FDG",
                  "right": "Principal radiofármaco do PET, com flúor-18"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o percurso no serviço, feito por pessoal autorizado, na ordem ensinada nesta aula."
            },
            "help": "Pergunte a cada etapa o que precisa ter acontecido antes dela.",
            "type": "ordering",
            "feedback": {
              "correct": "Ordem da aula: chega, é manipulado, é aferido, é conferido e só então é administrado. A conferência fica na porta da administração.",
              "incorrect": "Confira de novo: nada é manipulado antes da inspeção, e nada é administrado antes de aferir e conferir."
            },
            "payload": {
              "prompt": "Ordene o percurso no serviço, feito por pessoal autorizado, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-02:i3:5",
                  "label": "Administrar e aguardar a captação"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-02:i3:2",
                  "label": "Manipular o radiofármaco no laboratório"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-02:i3:4",
                  "label": "Conferir controle de qualidade, prescrição e identificação"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-02:i3:1",
                  "label": "Inspecionar e registrar o embalado recebido"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-02:i3:3",
                  "label": "Aferir a atividade no medidor de atividade"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-02:i3:1",
                "item:rtg-2026:s-mn:aula-02:i3:2",
                "item:rtg-2026:s-mn:aula-02:i3:3",
                "item:rtg-2026:s-mn:aula-02:i3:4",
                "item:rtg-2026:s-mn:aula-02:i3:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz agora?"
            },
            "help": "Pense em quem tem autorização para cada ação nesse percurso.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Integridade e contaminação do embalado são conferidas por quem é autorizado, e o supervisor de proteção precisa saber.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Durante a simulação, um embalado chega com a caixa amassada e uma mancha úmida num canto. Caio está ao telefone, do outro lado do corredor. Duda fica curiosa e diz: 'Vamos abrir para ver se o frasco está inteiro?'",
              "prompt": "O que você faz agora?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i4:a",
                  "label": "Abre sobre a bancada, com luvas, para olhar o frasco",
                  "explanation": "Abrir é manipular, e essa tarefa é de pessoal treinado e autorizado. Retome qual é o seu papel no percurso."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i4:b",
                  "label": "Não toca, mantém distância e avisa Caio e o supervisor",
                  "explanation": "Isso. Integridade e contaminação do embalado são conferidas por quem é autorizado, e o supervisor de proteção precisa saber."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i4:c",
                  "label": "Enxuga a mancha com papel absorvente e anota o horário",
                  "explanation": "Limpar pede treino e técnica, e não é tarefa do estudante. Confira de novo o que fazer ao ver algo errado."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i4:d",
                  "label": "Leva a caixa para um canto, onde não atrapalhe ninguém",
                  "explanation": "Mover o embalado também é tarefa de pessoal autorizado. Retome: ver algo errado pede não tocar e avisar."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-02:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Uma clínica fictícia planeja oferecer PET com FDG numa cidade muito distante de qualquer cíclotron. Pelo que esta aula ensinou, qual é a dificuldade do plano?"
            },
            "help": "Pense no relógio do material durante o transporte.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Com 110 minutos de meia-vida, o FDG precisa estar a cerca de duas horas de um cíclotron.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Uma clínica fictícia planeja oferecer PET com FDG numa cidade muito distante de qualquer cíclotron. Pelo que esta aula ensinou, qual é a dificuldade do plano?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i5:a",
                  "label": "O gerador de molibdênio-99 não cabe na sala",
                  "explanation": "O gerador pertence à rota do tecnécio-99m, não à do FDG. Retome de onde vem o flúor-18."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i5:b",
                  "label": "O FDG só funciona com solução salina fresca",
                  "explanation": "A solução salina faz a eluição do tecnécio-99m. Confira de novo a rota do flúor-18."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i5:c",
                  "label": "O flúor-18 decai depressa durante a viagem",
                  "explanation": "Isso. Com 110 minutos de meia-vida, o FDG precisa estar a cerca de duas horas de um cíclotron."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-02:i5:d",
                  "label": "A câmara gama não aceita flúor em nenhum caso",
                  "explanation": "A dificuldade apontada na aula é o tempo de transporte, e não o aparelho. Retome a meia-vida do flúor-18."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-02:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Cada passo tem dono",
            "body": "Agora você consegue contar de onde vêm o tecnécio-99m e o flúor-18, ordenar o percurso no serviço e dizer que o seu papel é observar e avisar.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Ver o percurso inteiro é o que faz você notar quando um passo não aconteceu."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-03",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:wna-radioisotopos",
          "source:rtg-2026:s-mn:peterson-detectores-spect",
          "source:rtg-2026:s-mn:cnen-norma-3-05",
          "source:rtg-2026:s-mn:iaea-srs-40"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Do fóton ao sinal",
            "body": "Hoje você vai conseguir ordenar a cadeia de detecção da câmara gama e distinguir os instrumentos de medição do serviço.",
            "dialogue": {
              "setting": "Sala de exames, com a câmara gama em manutenção programada",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Sem a tampa dá para ver as camadas da cabeça do detector. Por que tanta coisa, se é só registrar o que chega?"
                },
                {
                  "speaker": "caio",
                  "text": "Porque o fóton não vira imagem direto. E tem aparelho na sala que nem faz imagem: cada um responde a uma pergunta."
                },
                {
                  "speaker": "pixel",
                  "text": "Vamos seguir um fóton: o que ele atravessa primeiro, e o que acontece com ele em cada camada?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "Uma cadeia de detecção",
            "body": "Na câmara gama, o colimador, em geral de furos paralelos, só deixa passar fótons em certos ângulos, o que limita a sensibilidade. O cristal cintilador transforma a energia do fóton em luz. As fotomultiplicadoras convertem essa luz em sinal elétrico. O sistema calcula a posição pelos sinais delas e a energia pela soma; a janela de energia descarta fótons que perderam energia no espalhamento. O serviço também tem outros instrumentos: o medidor de atividade afere o material, o monitor de taxa de dose mede a radiação nas áreas e o monitor de contaminação procura material fora do lugar.",
            "keyPoints": [
              "Colimador, cristal, fotomultiplicadoras, cálculo de posição e energia.",
              "A janela de energia descarta o fóton espalhado.",
              "Cada instrumento responde a uma pergunta diferente."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Das aulas anteriores: o que sai do paciente e chega até a câmara gama num exame com tecnécio-99m?"
            },
            "help": "Lembre o que o átomo instável libera quando decai.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O tecnécio-99m emite fótons gama que saem do corpo. Hoje seguimos esse fóton dentro da câmara.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Das aulas anteriores: o que sai do paciente e chega até a câmara gama num exame com tecnécio-99m?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i1:a",
                  "label": "Raios X vindos de um tubo sob a mesa",
                  "explanation": "Não há tubo formando essa imagem. Retome quem é a fonte em medicina nuclear."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i1:b",
                  "label": "Luz produzida dentro do corpo",
                  "explanation": "A luz aparece depois, dentro do cristal. Confira de novo o que sai do corpo."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i1:c",
                  "label": "Fótons gama emitidos pelo material",
                  "explanation": "Isso. O tecnécio-99m emite fótons gama que saem do corpo. Hoje seguimos esse fóton dentro da câmara."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i1:d",
                  "label": "Gotas do radiofármaco que evaporam",
                  "explanation": "O material fica no corpo; o que chega ao detector é radiação. Retome o que o átomo instável libera."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-03:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o caminho do sinal na câmara gama, na ordem ensinada nesta aula."
            },
            "help": "Pergunte em que forma a informação está em cada etapa: fóton, luz ou sinal elétrico.",
            "type": "ordering",
            "feedback": {
              "correct": "Esse é o caminho: primeiro o fóton é selecionado pelo ângulo, depois vira luz, a luz vira sinal elétrico e o sinal vira posição e energia.",
              "incorrect": "Confira de novo: o cristal só recebe o que passou pelo colimador, e não há cálculo antes de existir sinal elétrico."
            },
            "payload": {
              "prompt": "Ordene o caminho do sinal na câmara gama, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-03:i2:4",
                  "label": "As fotomultiplicadoras geram o sinal elétrico"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-03:i2:1",
                  "label": "O fóton gama sai do paciente"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-03:i2:2",
                  "label": "O colimador só deixa passar certos ângulos"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-03:i2:5",
                  "label": "O sistema calcula posição e energia"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-03:i2:3",
                  "label": "O cristal converte a energia do fóton em luz"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-03:i2:1",
                "item:rtg-2026:s-mn:aula-03:i2:2",
                "item:rtg-2026:s-mn:aula-03:i2:3",
                "item:rtg-2026:s-mn:aula-03:i2:4",
                "item:rtg-2026:s-mn:aula-03:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada item à pergunta ou tarefa que ele atende."
            },
            "help": "Dois itens ficam ligados à câmara; os outros dois são usados fora da aquisição.",
            "type": "matching",
            "feedback": {
              "correct": "Certo: dois itens fazem parte da formação da imagem e dois são instrumentos que apoiam a rotina e a proteção.",
              "incorrect": "Retome o conceito: separe o que age dentro da câmara do que é instrumento à parte. Depois ligue pela função."
            },
            "payload": {
              "prompt": "Ligue cada item à pergunta ou tarefa que ele atende.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-03:i3:1",
                  "left": "Colimador",
                  "right": "Limita o ângulo de entrada dos fótons"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-03:i3:2",
                  "left": "Janela de energia",
                  "right": "Descarta fótons que perderam energia no espalhamento"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-03:i3:3",
                  "left": "Medidor de atividade",
                  "right": "Afere a atividade antes da administração"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-03:i3:4",
                  "left": "Monitor de contaminação",
                  "right": "Procura material radioativo fora do lugar"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante dessa leitura?"
            },
            "help": "Há duas explicações possíveis, e nenhuma delas cabe a você decidir sozinho.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Suspeita de funcionamento irregular ou de contaminação vai ao supervisor de proteção, que define o que testar.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, um monitor de contaminação de superfície exibe uma leitura mais alta do que a registrada mais cedo no mesmo ponto limpo, e o painel pisca. Não há ninguém do plantão por perto. O colega ao lado diz: 'Deve ser defeito, desliga e liga de novo.'",
              "prompt": "O que você faz diante dessa leitura?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i4:a",
                  "label": "Reinicia o monitor e usa a nova leitura, se baixar",
                  "explanation": "Reiniciar pode esconder um problema real, de contaminação ou de aparelho. Retome quem avalia essa dúvida."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i4:b",
                  "label": "Anota a leitura mais baixa, para não alarmar o setor",
                  "explanation": "Escolher o valor mais conveniente apaga a informação que a equipe precisa. Confira de novo o que descrever."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i4:c",
                  "label": "Limpa o ponto com papel e mede até a leitura cair",
                  "explanation": "Limpar pede treino e técnica, e não é tarefa do estudante. Retome a conduta diante da dúvida."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i4:d",
                  "label": "Não usa o monitor, descreve o que viu e chama a equipe",
                  "explanation": "Isso. Suspeita de funcionamento irregular ou de contaminação vai ao supervisor de proteção, que define o que testar."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-03:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: No fim do turno, surge a dúvida: 'será que este jaleco ficou com material radioativo?'. Que instrumento do serviço responde a essa dúvida?"
            },
            "help": "Compare a dúvida sobre o jaleco com a pergunta que cada instrumento responde.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Roupas passíveis de contaminação entram na monitoração de contaminação, feita com esse tipo de monitor.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "No fim do turno, surge a dúvida: 'será que este jaleco ficou com material radioativo?'. Que instrumento do serviço responde a essa dúvida?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i5:a",
                  "label": "O monitor de contaminação de superfície",
                  "explanation": "Isso. Roupas passíveis de contaminação entram na monitoração de contaminação, feita com esse tipo de monitor."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i5:b",
                  "label": "O medidor de atividade do laboratório",
                  "explanation": "Esse instrumento afere o material a ser administrado. Retome a pergunta que cada um responde."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i5:c",
                  "label": "A câmara gama, numa aquisição rápida",
                  "explanation": "A câmara forma imagem do paciente; ela não é o instrumento para roupas. Confira de novo a lista da aula."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-03:i5:d",
                  "label": "O colimador, retirado da câmara gama",
                  "explanation": "O colimador só seleciona ângulos e não mede nada sozinho. Retome a cadeia de detecção."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-03:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Seguindo o fóton",
            "body": "Agora você consegue seguir o fóton pela câmara gama até virar posição e energia, e dizer qual instrumento responde a qual pergunta na rotina do serviço.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "pixel",
                  "text": "Antes de olhar para um aparelho, pergunte: que dúvida ele resolve?"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-04",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:cdc-contaminacao-exposicao",
          "source:rtg-2026:s-mn:vumc-emergencias-mn",
          "source:rtg-2026:s-mn:iaea-srs-40",
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Proteção, contaminação e rejeitos",
            "body": "Hoje você vai conseguir agir diante de suspeita de contaminação e dizer como os rejeitos são separados e identificados.",
            "dialogue": {
              "setting": "Sala de administração, ao fim da rotina simulada",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Sobrou uma gota no chão, perto do carrinho. Se eu passar um papel, ninguém precisa parar o turno, né?"
                },
                {
                  "speaker": "caio",
                  "text": "Calma, Duda. Gota fora do lugar não se resolve na pressa."
                },
                {
                  "speaker": "lia",
                  "text": "O que você faria primeiro, e quem mais está nessa sala agora?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Parar, afastar, chamar",
            "body": "Quem manipula ou administra usa luvas descartáveis, jaleco de manga longa e monitores de tórax e extremidade. Corpo, roupas e superfícies são monitorados diariamente e a cada suspeita. Na suspeita de derramamento, a ordem ensinada aqui é: parar, avisar quem está perto, afastar quem não está envolvido e limitar a circulação, chamar a equipe e o supervisor de proteção. No serviço vale o plano dele; chamar não espera. Quem limpa e mede é pessoal treinado. Rejeito é segregado por meia-vida e características físicas, químicas e biológicas, identificado com conteúdo, radionuclídeo e datas de armazenamento e de liberação prevista, e guardado em local sinalizado e controlado. O estudante não decide descarte.",
            "keyPoints": [
              "Parar, avisar, afastar, chamar a equipe e o supervisor.",
              "Monitoração diária e a cada suspeita.",
              "Rejeito segue segregação, identificação e o plano do serviço."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da visão geral: uma gota de radiofármaco caiu na manga de um jaleco. Essa situação é um caso de quê?"
            },
            "help": "Pergunte se existe material radioativo na roupa ou apenas energia passando por ela.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Material radioativo em contato com a roupa é contaminação.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da visão geral: uma gota de radiofármaco caiu na manga de um jaleco. Essa situação é um caso de quê?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i1:a",
                  "label": "Só exposição, como em toda radiografia",
                  "explanation": "Numa radiografia não sobra material na pessoa. Retome o que caracteriza a gota na manga."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i1:b",
                  "label": "Contaminação: material onde não deveria",
                  "explanation": "Isso. Material radioativo em contato com a roupa é contaminação."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i1:c",
                  "label": "Nem exposição nem contaminação",
                  "explanation": "Há material radioativo na roupa, e isso tem nome. Confira de novo a diferença ensinada."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i1:d",
                  "label": "Radiação de fundo normal da sala",
                  "explanation": "Fundo é o que existe sem esse evento. Retome o que muda quando o material sai do lugar."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene a sua conduta de estudante diante de suspeita de derramamento, na ordem ensinada nesta aula."
            },
            "help": "Pense em quem pode pisar ali enquanto a ajuda não chega.",
            "type": "ordering",
            "feedback": {
              "correct": "Essa é a ordem da aula: parar, avisar, afastar e chamar, sem demora. A limpeza fica com pessoal treinado, e no serviço vale o plano dele.",
              "incorrect": "Retome o conceito: primeiro você para. Depois vêm as pessoas ao redor, e a chamada fecha a sequência, sem demora."
            },
            "payload": {
              "prompt": "Ordene a sua conduta de estudante diante de suspeita de derramamento, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-04:i2:2",
                  "label": "Avisar quem está por perto"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-04:i2:3",
                  "label": "Afastar quem não está envolvido e limitar a circulação"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-04:i2:4",
                  "label": "Chamar a equipe e o supervisor de proteção"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-04:i2:1",
                  "label": "Parar o que está fazendo"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-04:i2:1",
                "item:rtg-2026:s-mn:aula-04:i2:2",
                "item:rtg-2026:s-mn:aula-04:i2:3",
                "item:rtg-2026:s-mn:aula-04:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada critério de segregação de rejeitos aos grupos que a norma prevê."
            },
            "help": "Pense no que cada critério observa no material.",
            "type": "matching",
            "feedback": {
              "correct": "Certo. Separar assim ajuda o serviço a controlar o armazenamento e o tempo de decaimento de cada grupo.",
              "incorrect": "Retome os quatro critérios: tempo, forma do material, química e risco biológico. Ligue cada um à palavra que combina."
            },
            "payload": {
              "prompt": "Ligue cada critério de segregação de rejeitos aos grupos que a norma prevê.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-04:i3:1",
                  "left": "Meia-vida física",
                  "right": "Curta ou longa"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-04:i3:2",
                  "left": "Características físicas",
                  "right": "Sólido, líquido, perfurocortante, rouparia"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-04:i3:3",
                  "left": "Características químicas",
                  "right": "Orgânico ou inorgânico"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-04:i3:4",
                  "left": "Características biológicas",
                  "right": "Putrescível ou patogênico"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz primeiro?"
            },
            "help": "Olhe quem está perto antes de olhar para a poça.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. As pessoas ficam longe do local, e a equipe e o supervisor de proteção assumem medição e limpeza.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na simulação, você vê uma pequena poça transparente sob o carrinho da sala de administração, ao lado de uma seringa caída. Um colega vem andando em direção ao carrinho, e Dona Marta, a paciente simulada, está sentada a dois passos. Caio está em outra sala.",
              "prompt": "O que você faz primeiro?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i4:a",
                  "label": "Cobre a poça com papel e passa o pano com luvas",
                  "explanation": "Limpar pede treino e técnica, e não é tarefa do estudante. Retome a sequência da aula."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i4:b",
                  "label": "Busca o monitor e mede sozinho antes de avisar",
                  "explanation": "Medir sem avisar deixa as pessoas no caminho. Retome quem precisa saber primeiro."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i4:c",
                  "label": "Para, avisa, afasta as pessoas e chama a equipe",
                  "explanation": "Isso. As pessoas ficam longe do local, e a equipe e o supervisor de proteção assumem medição e limpeza."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i4:d",
                  "label": "Recolhe a seringa e relata tudo ao fim do turno",
                  "explanation": "Tocar na seringa é manipular, e esperar deixa o risco aberto. Confira de novo o que vem primeiro."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-04:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante dessa seringa?"
            },
            "help": "Pense em quem controla o que entra e o que sai como rejeito no serviço.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A origem e o destino desse material são decisão da equipe e do supervisor de proteção, não sua.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "No fim do turno simulado, você encontra uma seringa num saco de lixo comum, no corredor de saída. Ninguém sabe dizer se ela foi usada, nem com qual material. O colega sugere ajeitar a situação para não dar problema a ninguém.",
              "prompt": "O que você faz diante dessa seringa?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i5:a",
                  "label": "Não mexe, afasta colegas e avisa o supervisor",
                  "explanation": "Isso. A origem e o destino desse material são decisão da equipe e do supervisor de proteção, não sua."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i5:b",
                  "label": "Passa a seringa para a caixa de rejeito, de pinça",
                  "explanation": "Parece cuidado, mas é decidir o destino de um rejeito sozinho. Retome de quem é essa decisão."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i5:c",
                  "label": "Fecha o saco e leva para a coleta comum do setor",
                  "explanation": "Isso faz um possível rejeito sair do controle do serviço. Confira de novo o que a norma exige."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-04:i5:d",
                  "label": "Deixa como está, pois seringa sem marca não é rejeito",
                  "explanation": "Sem saber o que é, não dá para descartar a hipótese. Retome a conduta diante de dúvida."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-04:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Primeiro as pessoas",
            "body": "Agora você consegue agir na suspeita de contaminação sem tentar resolver sozinho, e reconhecer como o rejeito é separado, identificado e guardado.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Avisar cedo nunca atrapalha o plantão. Gota escondida, sim."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-05",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05",
          "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
          "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Preparo, orientação e posição",
            "body": "Hoje você vai conseguir coletar informações de preparo, passá-las à equipe e orientar o paciente sobre o que esperar na posição.",
            "dialogue": {
              "setting": "Recepção e sala de preparo do serviço",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Marta",
                  "text": "Moça, meu médico falou de jejum, mas eu tomei um remedinho com um gole de suco. E vou pegar meu neto depois. Tem problema?"
                },
                {
                  "speaker": "duda",
                  "text": "Eu não sei responder isso. Mas sinto que preciso dizer alguma coisa para ela."
                },
                {
                  "speaker": "lia",
                  "text": "O que você consegue fazer bem agora, sem responder pelo médico nuclear?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Ouvir, anotar, passar adiante",
            "body": "O serviço instrui paciente, acompanhante e lactante por escrito e verbalmente. Você ajuda na coleta: gravidez ou suspeita, amamentação, medicamentos, vitaminas e fitoterápicos, alergias e doenças recentes. A ordem ensinada aqui é: perguntar, anotar sem interpretar, passar à equipe e aguardar a orientação. Quem decide é a equipe; gravidez passa pelo médico nuclear. No PET de corpo inteiro, em geral há jejum de algumas horas, só com água, nada açucarado ou calórico, porque comer pode mudar a distribuição do material; quem tem diabetes recebe instrução especial. Joias e adornos saem, pois podem interferir; a pessoa fica parada; a câmara pode chegar bem perto. Medo de lugar fechado vai ao tecnólogo.",
            "keyPoints": [
              "Perguntar, anotar, passar à equipe, aguardar.",
              "Gravidez, amamentação e jejum: você não julga.",
              "Joias saem, a pessoa fica parada, e o medo é comunicado."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da visão geral: depois de receber o radiofármaco, onde o paciente aguarda até a hora das imagens?"
            },
            "help": "Lembre que, depois da administração, a pessoa passa a emitir radiação.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O serviço precisa ter sala de espera exclusiva e fisicamente delimitada para quem foi injetado.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da visão geral: depois de receber o radiofármaco, onde o paciente aguarda até a hora das imagens?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i1:a",
                  "label": "Na recepção, junto de quem vai ser atendido",
                  "explanation": "Depois da administração o paciente já é uma fonte. Retome o espaço próprio para quem foi injetado."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i1:b",
                  "label": "Na sala de espera exclusiva para injetados",
                  "explanation": "Isso. O serviço precisa ter sala de espera exclusiva e fisicamente delimitada para quem foi injetado."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i1:c",
                  "label": "No laboratório, ao lado das fontes em uso",
                  "explanation": "O laboratório é para manipular e armazenar fontes. Confira de novo onde o paciente fica."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i1:d",
                  "label": "Em qualquer corredor, sem espaço definido",
                  "explanation": "A norma prevê espaço próprio para essa espera. Retome o que vem depois da administração."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada orientação de preparo ao motivo ou destino ensinado."
            },
            "help": "Procure primeiro o par que fala de objetos no corpo.",
            "type": "matching",
            "feedback": {
              "correct": "Certo. Cada orientação tem um motivo, e isso ajuda você a explicar sem improvisar o que a equipe definiu.",
              "incorrect": "Retome o conceito: dois pares falam de comida e bebida, um fala de uma condição de saúde e outro, de objetos no corpo."
            },
            "payload": {
              "prompt": "Ligue cada orientação de preparo ao motivo ou destino ensinado.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-05:i2:1",
                  "left": "Jejum antes do PET de corpo inteiro",
                  "right": "Comer pode mudar a distribuição do material"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-05:i2:2",
                  "left": "Beber só água no preparo",
                  "right": "Evita bebida açucarada ou calórica"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-05:i2:3",
                  "left": "Paciente com diabetes",
                  "right": "Recebe instruções especiais do serviço"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-05:i2:4",
                  "left": "Joias e adornos",
                  "right": "Podem interferir e são retirados"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene a coleta de uma informação de preparo, na ordem ensinada nesta aula."
            },
            "help": "Pense em quem precisa da informação antes de qualquer próximo passo.",
            "type": "ordering",
            "feedback": {
              "correct": "Essa é a sequência: o relato chega à equipe com as palavras da pessoa, e a decisão fica com quem responde por ela.",
              "incorrect": "Confira de novo: a equipe só decide bem com o que foi anotado, e nada segue antes da orientação dela."
            },
            "payload": {
              "prompt": "Ordene a coleta de uma informação de preparo, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-05:i3:4",
                  "label": "Aguardar a orientação da equipe antes de seguir"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-05:i3:1",
                  "label": "Perguntar sobre gravidez, amamentação, remédios e alergias"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-05:i3:3",
                  "label": "Passar a informação à equipe responsável"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-05:i3:2",
                  "label": "Anotar o que a pessoa disse, sem interpretar"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-05:i3:1",
                "item:rtg-2026:s-mn:aula-05:i3:2",
                "item:rtg-2026:s-mn:aula-05:i3:3",
                "item:rtg-2026:s-mn:aula-05:i3:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz com esse relato?"
            },
            "help": "Pense em quem precisa saber disso antes da administração.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Suspeita de gravidez vai à equipe antes de seguir: justificar o procedimento cabe ao médico nuclear, com o consentimento da paciente.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Dona Marta, de 41 anos, vai fazer uma cintilografia. Enquanto você confere a ficha com ela, ela comenta baixinho: 'Minha menstruação está atrasada, mas deve ser nervoso, nem falei nada para ninguém.' A administração está marcada para daqui a dez minutos.",
              "prompt": "O que você faz com esse relato?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i4:a",
                  "label": "Tranquiliza, pois a dose é pequena, e deixa seguir",
                  "explanation": "Avaliar o risco não é sua parte, e a equipe ficaria sem saber. Retome para quem vai essa informação."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i4:b",
                  "label": "Pede que ela remarque quando tiver certeza do atraso",
                  "explanation": "Remarcar é decisão da equipe, não sua. Confira de novo o que fazer com o relato."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i4:c",
                  "label": "Pergunta a data e decide se o atraso parece relevante",
                  "explanation": "Julgar a chance de gravidez não é papel do estudante. Retome a ordem ensinada."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i4:d",
                  "label": "Anota o relato, avisa a equipe e aguarda a orientação",
                  "explanation": "Isso. Suspeita de gravidez vai à equipe antes de seguir: justificar o procedimento cabe ao médico nuclear, com o consentimento da paciente."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-05:i4:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na saída, um paciente pergunta se pode pegar o filho de 2 anos no colo hoje, depois do exame. Qual é a sua resposta adequada?"
            },
            "help": "Pergunte a si mesmo quem tem o dever de instruir sobre os cuidados com familiares.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. O serviço instrui por escrito e verbalmente, com atenção especial a crianças e grávidas.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na saída, um paciente pergunta se pode pegar o filho de 2 anos no colo hoje, depois do exame. Qual é a sua resposta adequada?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i5:a",
                  "label": "Pode sim, o material já terá saído do corpo",
                  "explanation": "A eliminação leva horas ou dias, e essa resposta é da equipe. Retome o que fazer com a pergunta."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i5:b",
                  "label": "Leva a pergunta à equipe, que dá a instrução",
                  "explanation": "Isso. O serviço instrui por escrito e verbalmente, com atenção especial a crianças e grávidas."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i5:c",
                  "label": "Não pode, e ele deve evitar a criança por um mês",
                  "explanation": "Você inventaria um prazo e uma regra que a aula não deu. Confira de novo quem orienta."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-05:i5:d",
                  "label": "Indica que ele procure a resposta depois na internet",
                  "explanation": "A orientação é dever do serviço, não do paciente. Retome de onde vem a instrução."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-05:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você leva a informação",
            "body": "Agora você consegue coletar o que importa, passar à equipe sem julgar e explicar o que a pessoa vai sentir e fazer durante a aquisição.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Ninguém espera que você saiba a resposta. Espera que a informação não se perca no caminho."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-06",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:peterson-detectores-spect",
          "source:rtg-2026:s-mn:nibib-medicina-nuclear",
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Cintilografia, SPECT e qualidade",
            "body": "Hoje você vai conseguir dizer para que serve cada teste de qualidade, com que frequência ele aparece e o que fazer quando um resultado sai da tolerância.",
            "dialogue": {
              "setting": "Sala de exames, antes do primeiro paciente",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Neste serviço, o teste do dia vem antes da agenda. A primeira coisa aqui é testar a câmara."
                },
                {
                  "speaker": "duda",
                  "text": "Mas ontem o teste passou. O que pode ter mudado de ontem para hoje?"
                },
                {
                  "speaker": "lia",
                  "text": "Boa dúvida. Cada teste responde a uma pergunta. E se a resposta vier ruim, o que você faz com ela?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada teste, uma pergunta",
            "body": "No SPECT, diferente da planar, as cabeças giram, coletam projeções em vários ângulos e o computador reconstrói em 3D. A norma prevê testes com perguntas próprias. Uniformidade em baixa densidade de contagem: a câmara responde igual em todo o campo? Janela de energia: está centrada para cada radionuclídeo em uso? Radiação de fundo: como está a contagem da sala? Esses são diários ou no dia de uso. Centro de rotação, mensal: o giro do SPECT está alinhado? O medidor de atividade tem testes diários, como repetibilidade. Resultado fora da tolerância: não ajuste, não ignore. Pare, registre e avise a equipe e o supervisor, que define o que refazer após conserto.",
            "keyPoints": [
              "SPECT: projeções em vários ângulos, reconstruídas em 3D.",
              "Cada teste responde a uma pergunta e tem uma frequência.",
              "Fora da tolerância: pare, registre, avise."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da aula de detecção: qual é a função da janela de energia na câmara gama?"
            },
            "help": "Lembre o que acontece com um fóton que sofreu espalhamento.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Ela seleciona a faixa certa e retira os fótons espalhados. Hoje você vê como ela é testada.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da aula de detecção: qual é a função da janela de energia na câmara gama?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i1:a",
                  "label": "Regular o brilho da imagem na tela",
                  "explanation": "O nome engana: não é um ajuste de tela. Retome a cadeia de detecção."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i1:b",
                  "label": "Limitar o ângulo de entrada dos fótons",
                  "explanation": "Ângulo é trabalho do colimador. Confira de novo o que a janela seleciona."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i1:c",
                  "label": "Girar as cabeças ao redor do paciente",
                  "explanation": "Girar é movimento do equipamento no SPECT. Retome a função da janela."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i1:d",
                  "label": "Descartar fótons que perderam energia",
                  "explanation": "Isso. Ela seleciona a faixa certa e retira os fótons espalhados. Hoje você vê como ela é testada."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-06:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: O que o SPECT faz que a cintilografia planar, parada num só ângulo, não faz?"
            },
            "help": "Compare o que a cabeça do detector faz nos dois casos.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. As cabeças giram, coletam projeções e o computador reconstrói a distribuição em três dimensões.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "O que o SPECT faz que a cintilografia planar, parada num só ângulo, não faz?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i2:a",
                  "label": "Reconstrói em 3D a partir de vários ângulos",
                  "explanation": "Isso. As cabeças giram, coletam projeções e o computador reconstrói a distribuição em três dimensões."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i2:b",
                  "label": "Emite um feixe que atravessa o paciente",
                  "explanation": "A câmara continua só detectando, mesmo girando. Retome quem emite."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i2:c",
                  "label": "Dispensa o radiofármaco, usando só o giro",
                  "explanation": "Sem material no corpo não há sinal para detectar. Confira de novo a origem da imagem."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i2:d",
                  "label": "Elimina o colimador e toda a cadeia de sinal",
                  "explanation": "A cadeia é a mesma; o que muda é a coleta em vários ângulos. Retome o conceito."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-06:i2:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada teste de qualidade à pergunta que ele responde."
            },
            "help": "Um dos testes só faz sentido para quem gira. Comece por ele.",
            "type": "matching",
            "feedback": {
              "correct": "Certo. Saber a pergunta de cada teste ajuda a entender o que um resultado ruim está dizendo.",
              "incorrect": "Retome o conceito: leia o nome do teste e procure a pergunta que usa a mesma ideia: campo, energia, sala ou giro."
            },
            "payload": {
              "prompt": "Ligue cada teste de qualidade à pergunta que ele responde.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-06:i3:1",
                  "left": "Uniformidade",
                  "right": "A resposta é igual em todo o campo de visão?"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-06:i3:2",
                  "left": "Janela de energia",
                  "right": "Está centrada para o radionuclídeo em uso?"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-06:i3:3",
                  "left": "Radiação de fundo",
                  "right": "Como está a contagem da sala?"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-06:i3:4",
                  "left": "Centro de rotação",
                  "right": "O giro do SPECT está alinhado?"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz com esse resultado?"
            },
            "help": "Pense em quem precisa saber do resultado antes da agenda começar.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. O resultado fica como apareceu, e a equipe e o supervisor de proteção decidem os próximos passos.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Antes do primeiro paciente da simulação, a tela do teste de uniformidade aparece com resultado fora da tolerância registrada na ficha. Caio foi atender um chamado, e a recepção já avisou que a agenda está atrasada. Um colega comenta que ontem o teste passou.",
              "prompt": "O que você faz com esse resultado?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i4:a",
                  "label": "Repete o teste até passar e anota só o último",
                  "explanation": "Guardar só o melhor apaga o que a equipe precisa ver. Retome a conduta diante de uma falha."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i4:b",
                  "label": "Ajusta o valor de referência para aceitar o dia",
                  "explanation": "Mudar a referência esconde a falha e não é sua decisão. Confira de novo o que fazer."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i4:c",
                  "label": "Para, registra o que viu e avisa a equipe agora",
                  "explanation": "Isso. O resultado fica como apareceu, e a equipe e o supervisor de proteção decidem os próximos passos."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i4:d",
                  "label": "Libera a agenda, pois o resultado de ontem vale",
                  "explanation": "O teste é do dia em que a câmara é usada. Retome a frequência da uniformidade."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-06:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "Compare com o que você faria com a câmara gama.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A regra é a mesma em todo equipamento: fora da tolerância, pare, registre o que viu e avise.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "No laboratório simulado, a ficha do medidor de atividade traz a tolerância de mais ou menos 5% para repetibilidade. A leitura de hoje, com a fonte de referência, ficou fora dessa faixa. Você está acompanhando a colega responsável, que saiu da sala por alguns minutos.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i5:a",
                  "label": "Corrige a conta de cabeça e segue usando o aparelho",
                  "explanation": "Compensar sozinho esconde o problema. Retome o que fazer com resultado fora da tolerância."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i5:b",
                  "label": "Anota o valor mais próximo da faixa, para não travar",
                  "explanation": "Isso muda o registro, e o registro deve mostrar o que aconteceu. Confira de novo a conduta."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i5:c",
                  "label": "Usa outro medidor e não comenta com ninguém",
                  "explanation": "O problema continuaria ali para o próximo uso. Retome quem precisa saber."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-06:i5:d",
                  "label": "Não usa o medidor e relata à colega e ao supervisor",
                  "explanation": "Isso. A regra é a mesma em todo equipamento: fora da tolerância, pare, registre o que viu e avise."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-06:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Teste é para ser ouvido",
            "body": "Agora você consegue dizer o que cada teste pergunta, com que frequência ele aparece e o que fazer quando a resposta vem ruim: parar, registrar e avisar.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Teste fora da faixa é o equipamento avisando. A gente ouve e passa adiante."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-07",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-07"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:peterson-detectores-spect",
          "source:rtg-2026:s-mn:nibib-medicina-nuclear",
          "source:rtg-2026:s-mn:wna-radioisotopos",
          "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
          "source:rtg-2026:s-mn:willowson-spect-ct",
          "source:rtg-2026:s-mn:cnen-norma-3-05",
          "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-07:abertura",
          "role": "hook",
          "payload": {
            "title": "PET-CT e SPECT-CT",
            "body": "Hoje você vai conseguir explicar o que a TC faz nos exames híbridos e reconhecer o que pode desalinhar as duas séries.",
            "dialogue": {
              "setting": "Sala de PET-CT, durante a preparação",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Se o PET já mostra o sinal, por que fazer uma TC junto? Não é mais radiação sem necessidade?"
                },
                {
                  "speaker": "caio",
                  "text": "Sem ela, essa imagem fica sem chão. E olha a sala de repouso: quem está ali há meia hora quase não fala nem se mexe."
                },
                {
                  "speaker": "pixel",
                  "text": "Duas perguntas para hoje: o que a TC faz aqui, e o que acontece se as duas séries não coincidirem?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-07:conceito",
          "role": "concept",
          "payload": {
            "title": "Duas séries, um alinhamento",
            "body": "No PET, cada pósitron encontra um elétron; os dois se aniquilam e geram dois fótons gama em direções opostas, registrados pelos detectores. Nos híbridos, a TC faz dois trabalhos: correção de atenuação e localização anatômica. As duas séries precisam coincidir: o co-registro é testado a cada trimestre. A respiração pode desalinhá-las; metal, como implante, marca-passo ou cateter de quimioterapia, pode gerar artefato na correção. No PET com FDG, em geral há repouso de 30 a 60 minutos, evitando movimento e fala; a TC leva menos de 2 minutos e o PET, de 20 a 30. Braços elevados reduzem o truncamento, quando o corpo sai do campo menor da TC.",
            "keyPoints": [
              "A TC corrige a atenuação e situa o sinal na anatomia.",
              "Respiração e metal podem atrapalhar o híbrido.",
              "Viu desalinhamento ou soube de metal? Avise a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-07:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-07"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da aula anterior: o que as cabeças do SPECT coletam enquanto giram ao redor do paciente?"
            },
            "help": "Lembre o que falta para o computador reconstruir um volume.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. Depois o computador as reconstrói em 3D. Hoje uma TC entra nessa mesma sessão.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da aula anterior: o que as cabeças do SPECT coletam enquanto giram ao redor do paciente?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i1:a",
                  "label": "Projeções em vários ângulos",
                  "explanation": "Isso. Depois o computador as reconstrói em 3D. Hoje uma TC entra nessa mesma sessão."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i1:b",
                  "label": "Imagens de TC do paciente",
                  "explanation": "A TC é outra modalidade; o detector do SPECT registra o que o material emite. Retome o que o giro permite obter."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i1:c",
                  "label": "Raios X vindos do próprio cristal",
                  "explanation": "O cristal não emite raios X. Confira de novo o que chega a ele."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i1:d",
                  "label": "Doses novas de radiofármaco",
                  "explanation": "A câmara não administra nada. Retome o papel do giro no SPECT."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-07:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-07:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene o que acontece até o PET registrar um evento, na ordem ensinada nesta aula."
            },
            "help": "O que o PET detecta não é o pósitron em si.",
            "type": "ordering",
            "feedback": {
              "correct": "Esse é o caminho: do pósitron à aniquilação, e dela aos dois fótons que os detectores registram.",
              "incorrect": "Confira de novo: sem o encontro com o elétron não há aniquilação, e sem ela não há o par de fótons."
            },
            "payload": {
              "prompt": "Ordene o que acontece até o PET registrar um evento, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-07:i2:5",
                  "label": "Os detectores registram os dois fótons"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-07:i2:4",
                  "label": "Saem dois fótons gama em direções opostas"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-07:i2:2",
                  "label": "O pósitron encontra um elétron"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-07:i2:1",
                  "label": "O radionuclídeo emite um pósitron"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-07:i2:3",
                  "label": "Os dois se aniquilam"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-07:i2:1",
                "item:rtg-2026:s-mn:aula-07:i2:2",
                "item:rtg-2026:s-mn:aula-07:i2:3",
                "item:rtg-2026:s-mn:aula-07:i2:4",
                "item:rtg-2026:s-mn:aula-07:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-07:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada termo do exame híbrido ao que ele significa."
            },
            "help": "Um dos termos só aparece quando o corpo não cabe no campo.",
            "type": "matching",
            "feedback": {
              "correct": "Certo. Dois termos são funções da TC; os outros dois falam de como as séries se encaixam ou não.",
              "incorrect": "Retome o conceito: separe o que a TC faz do que pode dar errado no encaixe entre as séries."
            },
            "payload": {
              "prompt": "Ligue cada termo do exame híbrido ao que ele significa.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-07:i3:1",
                  "left": "Correção de atenuação",
                  "right": "A TC serve de base para ajustar o sinal de PET ou SPECT"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-07:i3:2",
                  "left": "Localização anatômica",
                  "right": "Situa o sinal nas estruturas vistas na TC"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-07:i3:3",
                  "left": "Co-registro",
                  "right": "Coincidência das imagens das duas modalidades"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-07:i3:4",
                  "left": "Truncamento",
                  "right": "Parte do corpo fica fora do campo menor da TC"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-07:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-07"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que você faz com essa informação?"
            },
            "help": "Pergunte quem precisa dessa informação e até quando ela ainda pode ajudar.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Marca-passo é informação que a equipe precisa ter antes, e a conduta é dela.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Seu Jorge já está deitado para o PET-CT simulado. Enquanto você ajusta o lençol, ele comenta: 'Ah, e tenho marca-passo faz dois anos. Acho que esqueci de falar.' A ficha não menciona nada disso, e Caio está na sala de comando.",
              "prompt": "O que você faz com essa informação?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i4:a",
                  "label": "Segue, pois metal só importa na ressonância",
                  "explanation": "Aqui o metal também pode importar: ele pode afetar a TC e a correção de atenuação. Retome o conceito."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i4:b",
                  "label": "Anota para a equipe ler depois da aquisição",
                  "explanation": "Depois da aquisição, a informação já não ajuda no preparo. Retome quando a equipe precisa saber."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i4:c",
                  "label": "Avisa Caio agora, antes de começar a aquisição",
                  "explanation": "Isso. Marca-passo é informação que a equipe precisa ter antes, e a conduta é dela."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i4:d",
                  "label": "Pergunta o modelo e decide se o metal é pequeno demais",
                  "explanation": "Avaliar o tamanho do metal não é decisão sua. Confira de novo para quem vai essa informação."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-07:i4:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-07:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-07"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Qual é a sua conduta?"
            },
            "help": "Lembre que você não precisa saber a causa para agir bem.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. A equipe avalia a causa e decide o próximo passo, inclusive enquanto o paciente ainda está por perto.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Na tela de um SPECT-CT simulado, você percebe que a série de SPECT parece deslocada em relação à TC. O paciente fictício já se levantou da mesa e está indo para o vestiário. Você não tem como saber a causa.",
              "prompt": "Qual é a sua conduta?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i5:a",
                  "label": "Arrasta a série na tela até as duas coincidirem",
                  "explanation": "Mover a série esconde o que aconteceu e não é tarefa sua. Retome o que fazer com a dúvida."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i5:b",
                  "label": "Descreve o que viu e avisa a equipe sem demora",
                  "explanation": "Isso. A equipe avalia a causa e decide o próximo passo, inclusive enquanto o paciente ainda está por perto."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i5:c",
                  "label": "Diz ao paciente que o exame deu erro e deve repetir",
                  "explanation": "Comunicar resultado ou repetição não é sua parte. Confira de novo quem decide."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-07:i5:d",
                  "label": "Apaga a série e prepara uma nova aquisição sozinho",
                  "explanation": "Apagar destrói a evidência, e repetir exame é decisão da equipe. Retome a conduta."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-07:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-07:fecho",
          "role": "closing",
          "payload": {
            "title": "Duas séries, uma história",
            "body": "Agora você consegue explicar por que a TC acompanha o PET ou o SPECT, o que pode desalinhar as séries e o que levar à equipe sem tentar resolver na tela.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "pixel",
                  "text": "A TC do híbrido, aqui, trabalha para a outra série: corrige e localiza."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:s-mn:aula-08",
      "competencyIds": [
        "competency:rtg-2026:s-mn:aula-08"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-s-mn-v1",
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-08:abertura",
          "role": "hook",
          "payload": {
            "title": "Rastreabilidade: achar a falha",
            "body": "Hoje você vai conseguir comparar fichas fictícias, localizar em que etapa o processo falhou e levar o achado à equipe.",
            "dialogue": {
              "setting": "Mesa de registros do serviço simulado",
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Hoje vocês não vão atender ninguém. Vão ler duas fichas fictícias e me dizer em que ponto o percurso quebrou."
                },
                {
                  "speaker": "duda",
                  "text": "E se eu achar um campo em branco? Eu não posso só completar com o que seria o certo?"
                },
                {
                  "speaker": "caio",
                  "text": "Um registro diz o que aconteceu, e não o que deveria ter acontecido. Guarde essa diferença."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-08:conceito",
          "role": "concept",
          "payload": {
            "title": "Cada etapa deixa rastro",
            "body": "Cada etapa deixa um registro. A ordem ensinada aqui é: inspeção do embalado; testes de qualidade do dia, com data, resultado e responsável; controle de qualidade do radiofármaco, antes da administração; atividade prescrita e administrada, com identificação do paciente; rejeito, com datas e visto. Para achar a falha, procure a primeira etapa sem registro, fora de ordem ou com valor divergente. Em suspeita de paciente errado, órgão errado ou atividade diferente da prescrita, você não corrige nada: descreve e avisa a equipe e o supervisor de proteção. Titular, responsável técnico e supervisor investigam, registram e informam paciente e médico.",
            "keyPoints": [
              "Registro conta o que aconteceu, não o que deveria acontecer.",
              "Procure a primeira etapa sem registro, fora de ordem ou divergente.",
              "O estudante aponta; quem responde investiga e registra."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-08:i1",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-08"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Da aula do percurso: qual conferência o profissional autorizado faz imediatamente antes de administrar o radiofármaco?"
            },
            "help": "Pense no que precisa estar certo sobre o material e sobre a pessoa.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Isso. É a conferência que une material, prescrição e pessoa. Hoje você a procura nas fichas.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Da aula do percurso: qual conferência o profissional autorizado faz imediatamente antes de administrar o radiofármaco?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i1:a",
                  "label": "Colimador, cristal e fotomultiplicadoras",
                  "explanation": "Esses são componentes da câmara. Retome a etapa que vem logo antes de administrar."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i1:b",
                  "label": "Horário da recepção e tipo de acompanhante",
                  "explanation": "Esses dados não garantem material certo na pessoa certa. Confira de novo o percurso."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i1:c",
                  "label": "Controle de qualidade, prescrição e identidade",
                  "explanation": "Isso. É a conferência que une material, prescrição e pessoa. Hoje você a procura nas fichas."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i1:d",
                  "label": "Local de rejeito, datas e visto do supervisor",
                  "explanation": "Isso é registro de rejeito, no fim do percurso. Retome o que vem antes da administração."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-08:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-08:i2",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Ordene os registros do fluxo, na ordem ensinada nesta aula."
            },
            "help": "Pergunte o que precisa estar registrado antes de haver administração.",
            "type": "ordering",
            "feedback": {
              "correct": "Essa é a ordem da aula: do material que chega ao rejeito que fica guardado. Ler nessa ordem ajuda a achar a primeira quebra.",
              "incorrect": "Retome o conceito: comece pelo que chega ao serviço e termine pelo que sobra. O paciente aparece depois das conferências."
            },
            "payload": {
              "prompt": "Ordene os registros do fluxo, na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:s-mn:aula-08:i2:4",
                  "label": "Atividade prescrita e administrada, com identificação"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-08:i2:5",
                  "label": "Rejeito, com datas e visto"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-08:i2:1",
                  "label": "Inspeção do embalado"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-08:i2:2",
                  "label": "Testes de qualidade do dia"
                },
                {
                  "id": "item:rtg-2026:s-mn:aula-08:i2:3",
                  "label": "Controle de qualidade do radiofármaco"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:s-mn:aula-08:i2:1",
                "item:rtg-2026:s-mn:aula-08:i2:2",
                "item:rtg-2026:s-mn:aula-08:i2:3",
                "item:rtg-2026:s-mn:aula-08:i2:4",
                "item:rtg-2026:s-mn:aula-08:i2:5"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-08:i3",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Compare os achados das fichas fictícias e ligue cada um à etapa em que o registro falhou."
            },
            "help": "Procure a palavra do achado que aponta para o momento do percurso.",
            "type": "matching",
            "feedback": {
              "correct": "Certo. Dar nome à etapa torna o relato útil: a equipe sabe exatamente onde olhar.",
              "incorrect": "Retome o conceito: leia o achado e pergunte em que momento do percurso aquele dado deveria ter sido anotado."
            },
            "payload": {
              "prompt": "Compare os achados das fichas fictícias e ligue cada um à etapa em que o registro falhou.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:s-mn:aula-08:i3:1",
                  "left": "Caixa amassada, sem nenhuma anotação",
                  "right": "Inspeção do embalado"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-08:i3:2",
                  "left": "Uniformidade de hoje sem data nem responsável",
                  "right": "Testes de qualidade do dia"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-08:i3:3",
                  "left": "Atividade administrada em branco",
                  "right": "Registro da administração"
                },
                {
                  "id": "pair:rtg-2026:s-mn:aula-08:i3:4",
                  "left": "Recipiente sem data de armazenamento",
                  "right": "Registro do rejeito"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-08:i4",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-08"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Caso com decisão: O que vocês fazem agora?"
            },
            "help": "Pense no que acontece com a investigação se o papel mudar antes de ela começar.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. Suspeita de paciente errado é investigada por quem responde pelo serviço, e o registro fica como está.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Numa ficha fictícia, a seringa aparece registrada no nome de Dona Marta, mas a paciente que acabou de sair da sala de administração usa pulseira com outro nome. Na mesma folha há um campo em branco que permitiria acertar o nome. Duda olha para você.",
              "prompt": "O que vocês fazem agora?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i4:a",
                  "label": "Trocam o nome na ficha para combinar com a pulseira",
                  "explanation": "Corrigir sozinho apaga o rastro de um possível evento grave. Retome o que o estudante faz."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i4:b",
                  "label": "Param, descrevem e chamam a equipe e o supervisor",
                  "explanation": "Isso. Suspeita de paciente errado é investigada por quem responde pelo serviço, e o registro fica como está."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i4:c",
                  "label": "Procuram a paciente e pedem que ela volte para ver",
                  "explanation": "Abordar a paciente assim, sozinhos, atropela a equipe. Confira de novo quem conduz."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i4:d",
                  "label": "Esperam o fim do turno, pois pode ser só um engano",
                  "explanation": "Paciente errado é uma falha que precisa de resposta imediata. Retome a conduta da aula."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-08:i4:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:s-mn:aula-08:i5",
            "competencyIds": [
              "competency:rtg-2026:s-mn:aula-08"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: Em qual ficha está a falha de processo, e o que você faz?"
            },
            "help": "Leia os horários das duas fichas e compare com a ordem ensinada.",
            "type": "case-decision",
            "feedback": {
              "correct": "Isso. O controle precisa estar feito e registrado antes de administrar. Você aponta o achado, sem mexer no papel.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Duas fichas fictícias estão lado a lado. Ficha A: controle de qualidade do radiofármaco registrado às 7h50 e administração às 8h20. Ficha B: administração às 8h10 e controle de qualidade do radiofármaco registrado às 9h. As duas têm identificação e atividade preenchidas.",
              "prompt": "Em qual ficha está a falha de processo, e o que você faz?",
              "options": [
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i5:a",
                  "label": "Ficha A: 30 minutos é intervalo longo; refaça as horas",
                  "explanation": "O problema não é a distância entre os horários, e refazer horas é alterar registro. Retome a ordem ensinada."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i5:b",
                  "label": "Nas duas: o horário não pode ser anotado; apague",
                  "explanation": "O horário é parte do rastro, e apagar nunca é a saída. Confira de novo o que comparar."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i5:c",
                  "label": "Em nenhuma: basta haver os dois registros na folha",
                  "explanation": "Ter os dois registros não basta: a ordem importa aqui. Retome o que vem antes da administração."
                },
                {
                  "id": "option:rtg-2026:s-mn:aula-08:i5:d",
                  "label": "Ficha B: controle depois da administração; leve à equipe",
                  "explanation": "Isso. O controle precisa estar feito e registrado antes de administrar. Você aponta o achado, sem mexer no papel."
                }
              ],
              "correctOptionId": "option:rtg-2026:s-mn:aula-08:i5:d"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:s-mn:aula-08:fecho",
          "role": "closing",
          "payload": {
            "title": "Quem aponta também cuida",
            "body": "Agora você consegue ler uma ficha pela ordem do percurso, localizar a primeira falha e levar o achado à equipe sem alterar nada do que está escrito.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Achar a quebra é trabalho de quem presta atenção. Consertar o papel, não."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:s-mn",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-01"
        ],
        "prompt": "Num esquema didático, uma amostra fictícia de laboratório tem meia-vida de 30 minutos. Depois de 1 hora, que fração da atividade inicial resta, só pelo decaimento?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-01:c1:a",
            "label": "Metade da atividade"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c1:b",
            "label": "Um quarto da atividade"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c1:c",
            "label": "Um oitavo da atividade"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c1:d",
            "label": "Nenhuma atividade"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-01:c1:b",
        "feedback": {
          "correct": "Isso. Em 1 hora cabem duas meias-vidas: metade da metade é um quarto.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:who-radiacao-ionizante"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-01"
        ],
        "prompt": "Por que a água da célula entra na explicação do dano causado pela radiação?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-01:c2:a",
            "label": "Ela blinda o DNA e anula a ionização"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c2:b",
            "label": "Ela acumula o radionuclídeo no núcleo"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c2:c",
            "label": "A radiação forma nela radicais muito reativos"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-01:c2:d",
            "label": "Ela emite os raios gama que chegam à câmara"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-01:c2:c",
        "feedback": {
          "correct": "Isso. Os radicais livres formados na água podem romper ligações da fita de DNA: é a ação indireta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:hps-acao-indireta"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-02"
        ],
        "prompt": "Antes da administração, o profissional autorizado confere um conjunto de itens. Qual conjunto está de acordo com a aula?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-02:c1:a",
            "label": "Controle de qualidade, prescrição e identificação"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c1:b",
            "label": "Peso do frasco, marca da seringa e cor da etiqueta"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c1:c",
            "label": "Colimador, janela de energia e radiação de fundo"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c1:d",
            "label": "Sala de espera, acompanhante e horário marcado"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-02:c1:a",
        "feedback": {
          "correct": "Isso. Esses três itens são conferidos por quem administra, antes de administrar.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-02"
        ],
        "prompt": "Em que instrumento a atividade do radiofármaco é aferida antes de ser administrada ao paciente?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-02:c2:a",
            "label": "No monitor de contaminação de superfície"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c2:b",
            "label": "No monitor individual usado no tórax"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c2:c",
            "label": "Na câmara gama, durante a aquisição"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-02:c2:d",
            "label": "No medidor de atividade do serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-02:c2:d",
        "feedback": {
          "correct": "Isso. A atividade é aferida previamente no medidor de atividade, considerando a geometria adequada.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-03"
        ],
        "prompt": "Um fóton sofreu espalhamento no corpo e chega à câmara com energia menor que a esperada. O que a janela de energia faz com ele?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-03:c1:a",
            "label": "Devolve a energia que faltava"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c1:b",
            "label": "Muda o ângulo para ele entrar"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c1:c",
            "label": "Descarta esse evento da imagem"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c1:d",
            "label": "Soma o evento a outro fóton"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-03:c1:c",
        "feedback": {
          "correct": "Isso. A janela de energia retira os fótons que perderam energia no espalhamento.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:peterson-detectores-spect"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-03"
        ],
        "prompt": "Duda pergunta por que nem todos os fótons chegam ao cristal, se o paciente emite em todas as direções. Qual é a explicação?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-03:c2:a",
            "label": "O colimador barra quem vem fora do ângulo"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c2:b",
            "label": "As fotomultiplicadoras absorvem os fótons"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c2:c",
            "label": "A janela de energia age antes do colimador"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-03:c2:d",
            "label": "O cristal devolve os fótons para o paciente"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-03:c2:a",
        "feedback": {
          "correct": "Isso. O colimador restringe os ângulos de entrada; essa é a troca que ele impõe à sensibilidade.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:peterson-detectores-spect"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-04"
        ],
        "prompt": "Um colega pergunta quando corpo, roupas e superfícies passíveis de contaminação são monitorados. O que a aula ensinou?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-04:c1:a",
            "label": "Só depois de derramamento confirmado"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c1:b",
            "label": "Só ao fim do ano, para o relatório"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c1:c",
            "label": "Só na troca mensal do monitor individual"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c1:d",
            "label": "Diariamente e a cada suspeita"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-04:c1:d",
        "feedback": {
          "correct": "Isso. A monitoração é diária e também acontece sempre que há suspeita, com registro.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-04"
        ],
        "prompt": "A etiqueta de um recipiente de rejeito traz o conteúdo e o radionuclídeo. Qual outra informação ensinada nesta aula deveria aparecer nela?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-04:c2:a",
            "label": "Data de armazenamento e liberação prevista"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c2:b",
            "label": "Telefone do fornecedor do molibdênio-99"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c2:c",
            "label": "Marca das luvas usadas no procedimento"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-04:c2:d",
            "label": "Nome do estudante que observou o descarte"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-04:c2:a",
        "feedback": {
          "correct": "Isso. As datas permitem controlar o tempo guardado até a liberação prevista.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-05"
        ],
        "prompt": "Seu Jorge, com PET marcado para as 9h, conta às 8h que tomou café com açúcar logo cedo. O que você faz?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-05:c1:a",
            "label": "Diz que pouco açúcar não muda nada"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c1:b",
            "label": "Cancela o exame e remarca para amanhã"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c1:c",
            "label": "Anota o relato e avisa a equipe antes"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c1:d",
            "label": "Pede uma hora de espera e não comenta"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-05:c1:c",
        "feedback": {
          "correct": "Isso. Comer ou beber algo calórico pode mudar a distribuição do material, e a equipe decide o que fazer.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-05"
        ],
        "prompt": "Durante a aquisição, a câmara desce e fica bem perto do rosto de um paciente, que diz estar com falta de ar de tanto medo. Como você age, na simulação?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-05:c2:a",
            "label": "Pede que aguente, porque já vai acabar"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c2:b",
            "label": "Afasta a câmara com as próprias mãos"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c2:c",
            "label": "Diz que ele se levante e saia andando"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-05:c2:d",
            "label": "Avisa o tecnólogo agora e fica por perto"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-05:c2:d",
        "feedback": {
          "correct": "Isso. Quem conduz o exame precisa saber de medo de lugar fechado, para acolher e ajustar com a equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-06"
        ],
        "prompt": "Com que frequência a norma prevê o teste de uniformidade para baixa densidade de contagem na câmara cintilográfica?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-06:c1:a",
            "label": "Diariamente ou no dia em que a câmara for usada"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c1:b",
            "label": "A cada semestre, junto do relatório do físico"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c1:c",
            "label": "Só quando um paciente reclamar da demora"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c1:d",
            "label": "Apenas na instalação, na fase de aceitação"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-06:c1:a",
        "feedback": {
          "correct": "Isso. Esse teste, como o de janela de energia e o de fundo, acompanha o dia de uso.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-06"
        ],
        "prompt": "Depois de um conserto na câmara, quem determina quais testes pertinentes devem ser feitos antes de voltar à rotina?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-06:c2:a",
            "label": "O estudante que acompanhou o técnico"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c2:b",
            "label": "A recepção, conforme o tamanho da agenda"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c2:c",
            "label": "O supervisor de proteção radiológica"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-06:c2:d",
            "label": "O fabricante, sem comunicar o serviço"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-06:c2:c",
        "feedback": {
          "correct": "Isso. Após reparo ou suspeita de funcionamento irregular, é ele quem determina os testes pertinentes.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-07:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-07"
        ],
        "prompt": "Por que a respiração do paciente preocupa quem acompanha um exame de PET-CT?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-07:c1:a",
            "label": "Faz o radiofármaco sair pelos pulmões"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c1:b",
            "label": "Faz o tubo da TC parar de girar na hora"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c1:c",
            "label": "Reduz a energia dos fótons pela metade"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c1:d",
            "label": "Pode desalinhar as duas séries do exame"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-07:c1:d",
        "feedback": {
          "correct": "Isso. O movimento respiratório pode causar desalinhamento entre as fatias de TC e de PET.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-07:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-07"
        ],
        "prompt": "O campo da TC é menor que o do PET. Por que, em geral, o paciente fica de braços elevados no PET-CT?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-07:c2:a",
            "label": "Para encurtar a espera pela captação"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c2:b",
            "label": "Para reduzir o truncamento da imagem"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c2:c",
            "label": "Para baixar a radiação de fundo da sala"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-07:c2:d",
            "label": "Para o material sair mais cedo do corpo"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-07:c2:b",
        "feedback": {
          "correct": "Isso. Com os braços elevados, menos partes do corpo ficam fora do campo menor da TC. O protocolo do serviço define a posição.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-08:c1",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-08"
        ],
        "prompt": "Numa ficha fictícia, há prescrição e identificação, mas a atividade administrada está em branco, e o exame já terminou. Qual é a sua conduta?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-08:c1:a",
            "label": "Aponta o campo em branco à equipe e não preenche"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c1:b",
            "label": "Copia o valor prescrito no campo para fechar a ficha"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c1:c",
            "label": "Estima o valor e anota a lápis até alguém conferir"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c1:d",
            "label": "Deixa como está, pois ficha não é tarefa de estudante"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-08:c1:a",
        "feedback": {
          "correct": "Isso. A lacuna é informação para a equipe, e quem responde pelo registro decide o que fazer com ela.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:s-mn:aula-08:c2",
        "competencyIds": [
          "competency:rtg-2026:s-mn:aula-08"
        ],
        "prompt": "Quando ocorre uma exposição médica diferente da pretendida, quem responde pela investigação, segundo a aula?",
        "options": [
          {
            "id": "option:rtg-2026:s-mn:aula-08:c2:a",
            "label": "A transportadora que entregou o material"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c2:b",
            "label": "O estudante que encontrou a divergência"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c2:c",
            "label": "Titular, responsável técnico e supervisor"
          },
          {
            "id": "option:rtg-2026:s-mn:aula-08:c2:d",
            "label": "A recepção, ao confirmar a agenda do dia"
          }
        ],
        "correctOptionId": "option:rtg-2026:s-mn:aula-08:c2:c",
        "feedback": {
          "correct": "Isso. Eles investigam, registram, previnem nova ocorrência e informam o paciente e o médico.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:s-mn:cnen-norma-3-05"
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
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:who-radiacao-ionizante",
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:who-radiacao-ionizante",
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:who-radiacao-ionizante",
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:hps-acao-indireta"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:who-radiacao-ionizante"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-02:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-02:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-02:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-03:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-03:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-03:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-04:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-04:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cdc-contaminacao-exposicao",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:vumc-emergencias-mn",
        "source:rtg-2026:s-mn:iaea-srs-40"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-06:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-06:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-07:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-07:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-07:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-07:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-07:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-07:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-07:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-07:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-07:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i4:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i4:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-07:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-07:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-07:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-07:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:peterson-detectores-spect",
        "source:rtg-2026:s-mn:nibib-medicina-nuclear",
        "source:rtg-2026:s-mn:wna-radioisotopos",
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct",
        "source:rtg-2026:s-mn:willowson-spect-ct",
        "source:rtg-2026:s-mn:cnen-norma-3-05",
        "source:rtg-2026:s-mn:radiologyinfo-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-07:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:pettinato-artefatos-pet-ct"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:nibib-medicina-nuclear"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:willowson-spect-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:willowson-spect-ct"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-07:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:willowson-spect-ct"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-07:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:willowson-spect-ct"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-08:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-08:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-08:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-08:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "item:rtg-2026:s-mn:aula-08:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-08:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-08:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-08:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "pair:rtg-2026:s-mn:aula-08:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i4:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:s-mn:aula-08:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-08:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-08:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "step:rtg-2026:s-mn:aula-08:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:s-mn:aula-08:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:s-mn:aula-08:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:s-mn:aula-08:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:s-mn:cnen-norma-3-05"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-01",
        "hook": "Complete a frase: a cada meia-vida, a atividade do material cai…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-01"
          ],
          "prompt": "Uma amostra didática começa com 100 unidades de atividade. Quanto resta depois de exatamente uma meia-vida?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-01:rg:a",
              "label": "25 unidades"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rg:b",
              "label": "75 unidades"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rg:c",
              "label": "90 unidades"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rg:d",
              "label": "50 unidades"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-01:rg:d",
          "feedback": {
            "correct": "Isso. Uma meia-vida reduz a atividade à metade: de 100 para 50.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:who-radiacao-ionizante"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-01"
          ],
          "prompt": "Um texto de física informa que o iodo-131 tem meia-vida de 8 dias. Numa amostra de laboratório, fora de qualquer atendimento, que fração da atividade resta depois de 24 dias?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-01:rt:a",
              "label": "Um oitavo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rt:b",
              "label": "Um terço"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rt:c",
              "label": "Um quarto"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-01:rt:d",
              "label": "Metade"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-01:rt:a",
          "feedback": {
            "correct": "Isso. Em 24 dias cabem três meias-vidas de 8 dias: metade, um quarto, um oitavo.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:who-radiacao-ionizante"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-02",
        "hook": "Complete a frase: o tecnécio-99m sai do gerador por eluição, usando…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-02"
          ],
          "prompt": "Como o tecnécio-99m é retirado do gerador, quando o serviço precisa dele?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-02:rg:a",
              "label": "Uma solução salina o lava para fora"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rg:b",
              "label": "Um cíclotron o separa do molibdênio"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rg:c",
              "label": "O frasco é aquecido até ele evaporar"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rg:d",
              "label": "O molibdênio é filtrado pelo colimador"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-02:rg:a",
          "feedback": {
            "correct": "Isso. A eluição usa solução salina para retirar o tecnécio-99m formado no gerador.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:wna-radioisotopos"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-02"
          ],
          "prompt": "Num turno cheio, um colega de estágio sugere: 'Eu fraciono essa dose para adiantar, é só seguir o que vi ontem'. O que a aula sustenta?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-02:rt:a",
              "label": "Pode, desde que outro colega observe"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rt:b",
              "label": "Só pessoal treinado e autorizado manipula"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rt:c",
              "label": "Pode, se o turno estiver mesmo atrasado"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-02:rt:d",
              "label": "Pode, se ele usar luvas e jaleco longo"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-02:rt:b",
          "feedback": {
            "correct": "Isso. O serviço precisa garantir que só pessoal treinado e autorizado manipule fontes. Avise a equipe sobre a proposta.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-03",
        "hook": "Complete a frase: na câmara gama, o cristal transforma a energia do fóton em…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-03"
          ],
          "prompt": "Em que componente da câmara gama a energia do fóton vira luz?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-03:rg:a",
              "label": "No colimador de furos"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rg:b",
              "label": "Na janela de energia"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rg:c",
              "label": "No cristal cintilador"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rg:d",
              "label": "Na mesa do paciente"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-03:rg:c",
          "feedback": {
            "correct": "Isso. O cristal cintilador converte a energia absorvida em luz.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:peterson-detectores-spect"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-03"
          ],
          "prompt": "No levantamento periódico, o supervisor quer saber quanta radiação há num ponto da sala onde há fontes guardadas. Que instrumento responde a essa pergunta?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-03:rt:a",
              "label": "O medidor de atividade"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rt:b",
              "label": "O monitor de taxa de dose"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rt:c",
              "label": "O cristal da câmara gama"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-03:rt:d",
              "label": "O colimador da câmara"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-03:rt:b",
          "feedback": {
            "correct": "Isso. O levantamento radiométrico usa esse tipo de monitor para medir a radiação nas áreas.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-04",
        "hook": "Complete a frase: uma gota fora do lugar é limpa por…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-04"
          ],
          "prompt": "Numa simulação, há uma gota no chão da sala de administração. Quem cuida da limpeza?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-04:rg:a",
              "label": "Quem viu primeiro, para ganhar tempo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rg:b",
              "label": "A equipe de limpeza geral do prédio"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rg:c",
              "label": "O estudante, com luvas descartáveis"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rg:d",
              "label": "Pessoal treinado, com o supervisor"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-04:rg:d",
          "feedback": {
            "correct": "Isso. A limpeza e a medição são de pessoal treinado, conforme o plano do serviço.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05",
            "source:rtg-2026:s-mn:vumc-emergencias-mn",
            "source:rtg-2026:s-mn:iaea-srs-40"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-04"
          ],
          "prompt": "Um colega diz: 'Essa luva tocou tecnécio-99m, mas a meia-vida é curta. Posso jogar no lixo comum porque já vai ter sumido'. O que a aula sustenta?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-04:rt:a",
              "label": "Pode, se ele esperar seis horas antes"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rt:b",
              "label": "Pode, porque meia-vida curta dispensa controle"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rt:c",
              "label": "O descarte segue o plano; avise a equipe"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-04:rt:d",
              "label": "Pode, se ele anotar na própria ficha"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-04:rt:c",
          "feedback": {
            "correct": "Isso. Segregação, tempo de armazenamento e dispensa seguem o procedimento do serviço, não a decisão individual.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-05",
        "hook": "Complete a frase: amamentação e gravidez, o estudante coleta e…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-05"
          ],
          "prompt": "Uma paciente diz, ao preencher a ficha, que amamenta o filho de três meses. Qual é a sua parte nisso?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-05:rg:a",
              "label": "Passar à equipe, que instrui a lactante"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rg:b",
              "label": "Dizer por quantos dias suspender o leite"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rg:c",
              "label": "Orientar a retirar o leite e guardar agora"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rg:d",
              "label": "Não anotar, pois amamentar não muda nada"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-05:rg:a",
          "feedback": {
            "correct": "Isso. O serviço precisa instruir a lactante por escrito e verbalmente, antes, durante e depois do procedimento.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05",
            "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-05"
          ],
          "prompt": "Seu Jorge chega para a cintilografia de relógio e corrente de prata. Antes de entrar na sala, o que você explica a ele, na simulação?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-05:rt:a",
              "label": "Que metal só atrapalha na ressonância"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rt:b",
              "label": "Que pode manter tudo, se ficar parado"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rt:c",
              "label": "Que adornos saem, pois podem interferir"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-05:rt:d",
              "label": "Que o exame deve ser adiado para outro dia"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-05:rt:c",
          "feedback": {
            "correct": "Isso. Joias e acessórios costumam ser retirados, porque podem interferir no exame. Siga o protocolo do serviço.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:radiologyinfo-medicina-nuclear"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-06",
        "hook": "Complete a frase: resultado fora da tolerância a gente não ajusta; a gente para, registra e…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-06"
          ],
          "prompt": "Na simulação, o teste de janela de energia do dia sai fora da faixa. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-06:rg:a",
              "label": "Avisa a equipe e o supervisor de proteção"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rg:b",
              "label": "Muda a faixa na tela para o teste passar"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rg:c",
              "label": "Ignora, pois outro teste do dia já passou"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rg:d",
              "label": "Espera o fim da agenda para comentar"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-06:rg:a",
          "feedback": {
            "correct": "Isso. Depois de parar e registrar o que viu, a informação vai para quem decide.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-06"
          ],
          "prompt": "Hoje o serviço vai usar um radionuclídeo diferente do habitual. O que o teste de janela de energia precisa verificar nesse caso?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-06:rt:a",
              "label": "Se o paciente está em jejum há mais tempo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rt:b",
              "label": "Se o colimador em uso está sem danos"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rt:c",
              "label": "Se a sala ficou com menos radiação de fundo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-06:rt:d",
              "label": "Se a janela está centrada para esse material"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-06:rt:d",
          "feedback": {
            "correct": "Isso. A norma pede verificar a janela para todos os radionuclídeos usados na rotina.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-07",
        "hook": "Complete a frase: na aniquilação, os dois fótons saem em direções…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-07:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-07"
          ],
          "prompt": "Como saem os dois fótons gama depois da aniquilação entre o pósitron e o elétron?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-07:rg:a",
              "label": "Na mesma direção, um atrás do outro"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rg:b",
              "label": "Em direções opostas, ao mesmo tempo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rg:c",
              "label": "Em ângulo reto, um para cada lado"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rg:d",
              "label": "Em qualquer direção, sem relação"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-07:rg:b",
          "feedback": {
            "correct": "Isso. O par sai em direções opostas, e os detectores do PET registram esses fótons.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:nibib-medicina-nuclear"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-07:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-07"
          ],
          "prompt": "Um colega pergunta para que serve a TC no SPECT-CT, já que a cintilografia sozinha também produz imagens. O que você responde?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-07:rt:a",
              "label": "Serve para administrar o material"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rt:b",
              "label": "Serve para girar as cabeças do detector"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rt:c",
              "label": "Corrige atenuação e localiza o sinal"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-07:rt:d",
              "label": "Substitui o SPECT por inteiro"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-07:rt:c",
          "feedback": {
            "correct": "Isso. A TC fornece a base para corrigir a atenuação e situa o sinal na anatomia.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:willowson-spect-ct"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:s-mn:aula-08",
        "hook": "Complete a frase: quando falta um registro, o estudante não preenche; ele…",
        "guided": {
          "id": "recovery-item:rtg-2026:s-mn:aula-08:guiada",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-08"
          ],
          "prompt": "Numa ficha fictícia, a monitoração de superfícies de hoje não consta. O que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-08:rg:a",
              "label": "Anota 'sem contaminação' para deixar em dia"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rg:b",
              "label": "Copia o resultado de ontem para o dia de hoje"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rg:c",
              "label": "Faz a medição sozinho e preenche o campo"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rg:d",
              "label": "Aponta a falta à equipe e não preenche nada"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-08:rg:d",
          "feedback": {
            "correct": "Isso. A lacuna é um achado: você a descreve e leva a quem responde pela monitoração.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:s-mn:aula-08:transferencia",
          "competencyIds": [
            "competency:rtg-2026:s-mn:aula-08"
          ],
          "prompt": "No registro fictício de rejeitos, dois recipientes têm a mesma data, mas um deles não traz o radionuclídeo. O que a comparação mostra, e o que você faz?",
          "options": [
            {
              "id": "option:rtg-2026:s-mn:aula-08:rt:a",
              "label": "Nada grave: a data igual já permite deduzir"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rt:b",
              "label": "Falta um dado do rejeito; aponta à equipe"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rt:c",
              "label": "Falta um dado; copia do recipiente ao lado"
            },
            {
              "id": "option:rtg-2026:s-mn:aula-08:rt:d",
              "label": "Sobra um recipiente; leva para descarte"
            }
          ],
          "correctOptionId": "option:rtg-2026:s-mn:aula-08:rt:b",
          "feedback": {
            "correct": "Isso. O radionuclídeo faz parte do registro, e a lacuna vai a quem responde por ele, sem você completar.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:s-mn:cnen-norma-3-05"
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
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "97865bacd181364f845baed25eb0a7f2c246783b2faa565fac5a9f36ce4c0b1e"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
