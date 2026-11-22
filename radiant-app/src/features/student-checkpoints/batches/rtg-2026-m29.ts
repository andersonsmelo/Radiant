// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.
// Não edite à mão: mude a aula-fonte e rode o gerador.
import type { ProductionBatchV1 } from '../ProductionBatch';

export const RTG_2026_M29: ProductionBatchV1 = {
  "schemaVersion": 1,
  "state": "promoted",
  "batchId": "batch:rtg-2026:m29",
  "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3",
  "trackId": "track:rtg-2026:m29",
  "unitId": "unit:rtg-2026:m29",
  "contentVersion": "rtg-2026-m29-v1",
  "competencyIds": [
    "competency:rtg-2026:m29:aula-01",
    "competency:rtg-2026:m29:aula-02",
    "competency:rtg-2026:m29:aula-03",
    "competency:rtg-2026:m29:aula-04",
    "competency:rtg-2026:m29:aula-05",
    "competency:rtg-2026:m29:aula-06"
  ],
  "sources": [
    {
      "id": "source:rtg-2026:m29:ridgway-2010-fisica-rm",
      "title": "Cardiovascular magnetic resonance physics for clinicians: part I (J Cardiovasc Magn Reson, 2010)",
      "publisher": "PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3016368/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para sinal da magnetização transversal, T1, T2, TR, TE, e brilho de gordura e líquido em T1 e T2, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:krupa-2015-artefatos-rm",
      "title": "MRI artifacts and their management (artigo de revisão, PMC4340093)",
      "publisher": "PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4340093/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para movimento, metal, dobra e supressão de gordura imperfeita, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
      "title": "Managing hardware-related metal artifacts in MRI: current and evolving techniques (PMC11303499)",
      "publisher": "PubMed Central (acesso aberto)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11303499/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Artigo de acesso aberto; consultado para vazio de sinal, acúmulo de sinal e distorção junto a metal, e para a falha da supressão de gordura por frequência quando o metal desnivela o campo, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:ucsd-fmri-estrutural",
      "title": "Structural MRI Imaging (3T How To), Center for Functional MRI",
      "publisher": "Universidade da Califórnia, San Diego",
      "url": "https://fmri.ucsd.edu/Howto/3T/structure.html",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página institucional; consultada para o brilho de líquido, gordura e substâncias branca e cinzenta em T1 e T2, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:mrimaster-liquido-suprimido",
      "title": "FLAIR MRI: como o líquido aparece na imagem com o líquido suprimido",
      "publisher": "MRI Master",
      "url": "https://mrimaster.com/characterise-image-flair/",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página educativa; consultada para o líquido escuro e a substância cinzenta mais clara que a branca na imagem de base T2 com o líquido suprimido, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
      "title": "MRI of the Head (Brain): imagem de qualidade depende de ficar parado",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/mri-brain",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página para o público; consultada para a qualidade da imagem depender de ficar parado e para quem analisa e comunica o resultado, sem reprodução de texto."
    },
    {
      "id": "source:rtg-2026:m29:radiologyinfo-preparo-rm",
      "title": "How to Prepare for Your MRI Exam",
      "publisher": "RadiologyInfo.org (RSNA e ACR)",
      "url": "https://www.radiologyinfo.org/en/info/how-to-prepare-for-mri-exam",
      "accessedAt": "2026-11-19",
      "use": "factual-reference",
      "licenseNote": "Página para o público; consultada para ruído e protetor auricular, campainha de chamada, intercomunicador, ficar parado e sensação de lugar fechado, sem reprodução de texto."
    }
  ],
  "activities": [
    {
      "id": "activity:rtg-2026:m29:aula-01",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-01"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-01:abertura",
          "role": "hook",
          "payload": {
            "title": "Duas curvas, dois tecidos",
            "body": "Hoje você vai conseguir distinguir, numa curva, a recuperação de T1 e o decaimento de T2 de dois tecidos.",
            "dialogue": {
              "setting": "Sala de estudo do setor de ressonância",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Na prova simulada caiu um gráfico com duas curvas amarelas e duas azuis, e eu li tudo ao contrário."
                },
                {
                  "speaker": "caio",
                  "text": "Acontece. Antes da conta, pergunte para onde a curva vai: ela sobe ou ela cai?"
                },
                {
                  "speaker": "pixel",
                  "text": "Uma sobe e a outra cai. O que cada uma está contando sobre o tecido?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-01:conceito",
          "role": "concept",
          "payload": {
            "title": "Subir e cair, rápido e devagar",
            "body": "Depois do pulso, dois relógios correm. Tempo na horizontal. No gráfico da esquerda, a magnetização longitudinal se recupera: é o T1, e a curva sobe. No da direita, o sinal transversal se desfaz: é o T2, e a curva cai. Nos dois, a curva amarela é de um tecido de tempos curtos e a azul, de um de tempos longos, como o líquido. O esquema simplifica: as duas sobem ao mesmo patamar, e isso vale só para este desenho.",
            "keyPoints": [
              "Curva que sobe: recuperação, T1. Curva que cai: perda de sinal, T2.",
              "Tempo curto: a curva chega depressa. Tempo longo: ela demora.",
              "Com o mesmo intervalo, T1 curto chega ao pulso seguinte com mais magnetização. T2 longo ainda tem sinal na hora de ler o eco."
            ],
            "visual": "relaxacao-t1-t2"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-01:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-01"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de fundamentos da ressonância, a magnetização se divide em duas partes depois do pulso. Qual delas gira e é captada pela bobina como sinal?"
            },
            "help": "Pense na parte inclinada pelo pulso, que gira em torno do campo.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A transversal gira e induz tensão na bobina: esse é o sinal que o exame mede.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de fundamentos da ressonância, a magnetização se divide em duas partes depois do pulso. Qual delas gira e é captada pela bobina como sinal?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-01:i1:a",
                  "label": "A magnetização longitudinal, que se recupera ao longo do campo",
                  "explanation": "A longitudinal se recupera ao longo do campo e não é o que a bobina capta. Retome qual parte gira."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i1:b",
                  "label": "O campo do ímã principal, que fica sempre ligado",
                  "explanation": "O campo do ímã é constante e não gira: ele não induz o sinal na bobina. Retome qual parte gira depois do pulso."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i1:c",
                  "label": "A magnetização transversal, que gira e induz tensão na bobina",
                  "explanation": "A transversal gira e induz tensão na bobina: esse é o sinal que o exame mede."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i1:d",
                  "label": "O hélio líquido que resfria as bobinas do aparelho",
                  "explanation": "O hélio só resfria o ímã supercondutor e não produz sinal. Retome o que gira depois do pulso de RF."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-01:i1:c"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-01:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule cada curva do esquema pelo tempo que ela mostra, tocando na ficha e no ponto."
            },
            "help": "Primeiro olhe o gráfico: curva que sobe é T1, curva que cai é T2. Depois veja a rapidez.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: a curva que chega depressa ao patamar é de T1 curto, e a que se desfaz devagar é de T2 longo.",
              "incorrect": "Alguma ficha está fora do lugar: veja se a curva sobe ou cai e se ela chega depressa ou devagar."
            },
            "payload": {
              "prompt": "Rotule cada curva do esquema pelo tempo que ela mostra, tocando na ficha e no ponto.",
              "imageRef": "diagram:relaxacao-t1-t2",
              "points": [
                {
                  "id": "point:rtg-2026:m29:aula-01:i2:1",
                  "x": 0.0938,
                  "y": 0.6074,
                  "where": "à esquerda, a curva que sobe depressa até o topo",
                  "correctLabelId": "label:rtg-2026:m29:aula-01:i2:1"
                },
                {
                  "id": "point:rtg-2026:m29:aula-01:i2:2",
                  "x": 0.3344,
                  "y": 0.4065,
                  "where": "à esquerda, a curva que sobe devagar e fica abaixo do topo",
                  "correctLabelId": "label:rtg-2026:m29:aula-01:i2:2"
                },
                {
                  "id": "point:rtg-2026:m29:aula-01:i2:3",
                  "x": 0.1531,
                  "y": 0.2333,
                  "where": "à esquerda, a linha tracejada no alto",
                  "correctLabelId": "label:rtg-2026:m29:aula-01:i2:3"
                },
                {
                  "id": "point:rtg-2026:m29:aula-01:i2:4",
                  "x": 0.5813,
                  "y": 0.4629,
                  "where": "à direita, a curva que cai depressa até perto de zero",
                  "correctLabelId": "label:rtg-2026:m29:aula-01:i2:4"
                },
                {
                  "id": "point:rtg-2026:m29:aula-01:i2:5",
                  "x": 0.7438,
                  "y": 0.5411,
                  "where": "à direita, a curva que cai devagar e termina mais alta",
                  "correctLabelId": "label:rtg-2026:m29:aula-01:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m29:aula-01:i2:3",
                  "label": "Patamar"
                },
                {
                  "id": "label:rtg-2026:m29:aula-01:i2:2",
                  "label": "T1 longo"
                },
                {
                  "id": "label:rtg-2026:m29:aula-01:i2:4",
                  "label": "T2 curto"
                },
                {
                  "id": "label:rtg-2026:m29:aula-01:i2:1",
                  "label": "T1 curto"
                },
                {
                  "id": "label:rtg-2026:m29:aula-01:i2:5",
                  "label": "T2 longo"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-01:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada tempo ao que ele significa para o sinal, como ensinado nesta aula."
            },
            "help": "T1 é o que sobe entre os pulsos. T2 é o que cai até a leitura.",
            "type": "matching",
            "feedback": {
              "correct": "Isso mesmo: T1 diz o quanto o tecido se recupera entre os pulsos, e T2 diz o quanto sobra de sinal na leitura.",
              "incorrect": "Confira de novo: T1 fala da recuperação entre pulsos, e T2 fala do sinal que sobra na hora de ler o eco."
            },
            "payload": {
              "prompt": "Ligue cada tempo ao que ele significa para o sinal, como ensinado nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m29:aula-01:i3:1",
                  "left": "T1 curto",
                  "right": "Chega ao pulso seguinte com mais magnetização"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-01:i3:2",
                  "left": "T1 longo",
                  "right": "Chega ao pulso seguinte com menos magnetização"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-01:i3:3",
                  "left": "T2 curto",
                  "right": "Tem pouco sinal na hora de ler o eco"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-01:i3:4",
                  "left": "T2 longo",
                  "right": "Ainda tem sinal na hora de ler o eco"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-01:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-01"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre os dois gráficos."
            },
            "help": "Para cada frase, veja primeiro se ela fala de subir ou de cair.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o que sobe do que cai e não tomou o desenho por regra.",
              "incorrect": "Releia o conceito: subida é T1, queda é T2, e o patamar comum é só do esquema."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre os dois gráficos.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m29:aula-01:i4:1",
                  "text": "A curva que sobe mostra a magnetização longitudinal se recuperando.",
                  "isTrue": true,
                  "explanation": "Certo: a subida é a recuperação da magnetização longitudinal, e o tempo dela é o T1."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-01:i4:2",
                  "text": "A curva que cai mostra a perda do sinal da magnetização transversal.",
                  "isTrue": true,
                  "explanation": "Certo: a queda é a perda do sinal transversal, e o tempo dela é o T2."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-01:i4:3",
                  "text": "Num tecido de T2 longo, o sinal transversal dura mais.",
                  "isTrue": true,
                  "explanation": "Certo: T2 longo quer dizer que a curva cai devagar, e o sinal permanece por mais tempo."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-01:i4:4",
                  "text": "O patamar comum das duas curvas vale como regra para todos os tecidos.",
                  "isTrue": false,
                  "explanation": "Errado: o patamar comum é uma simplificação que vale só para este desenho."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-01:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-01"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Duda leu o gráfico da esquerda e disse: \"a curva azul mostra o sinal sumindo devagar\". O que corrigir na frase?"
            },
            "help": "Olhe a direção da curva da esquerda antes de olhar a cor.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "No gráfico da esquerda a curva sobe: é recuperação, e a azul se recupera devagar. A perda de sinal está no da direita.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Duda leu o gráfico da esquerda e disse: \"a curva azul mostra o sinal sumindo devagar\". O que corrigir na frase?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-01:i5:a",
                  "label": "Nada: toda curva azul mostra o sinal sumindo devagar",
                  "explanation": "A cor só diferencia os tecidos. Quem diz se é recuperação ou perda é a direção da curva, e a da esquerda sobe."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i5:b",
                  "label": "A da esquerda mostra recuperação: a azul se recupera devagar",
                  "explanation": "No gráfico da esquerda a curva sobe: é recuperação, e a azul se recupera devagar. A perda de sinal está no da direita."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i5:c",
                  "label": "A azul é a curva rápida e a amarela é a lenta",
                  "explanation": "Nos dois gráficos a azul é a lenta e a amarela é a rápida. O erro da frase está em confundir subida com perda."
                },
                {
                  "id": "option:rtg-2026:m29:aula-01:i5:d",
                  "label": "O gráfico da esquerda mostra o T2, e não o T1",
                  "explanation": "O gráfico da esquerda mostra a subida do T1. O T2 é o da direita, onde as curvas caem."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-01:i5:b"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-01:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê as duas curvas",
            "body": "Agora você distingue a curva que sobe, a recuperação de T1, da que cai, o decaimento de T2, e sabe dizer qual tecido é rápido e qual é lento. O patamar comum é só do desenho.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Na próxima aula, esses dois relógios ganham uma linha do tempo."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m29:aula-02",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-02"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-02:abertura",
          "role": "hook",
          "payload": {
            "title": "Os dois relógios: TR e TE",
            "body": "Hoje você vai conseguir dizer, numa linha do tempo, o que TR e TE marcam.",
            "dialogue": {
              "setting": "Sala de estudo do setor de ressonância",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Na linha do tempo da apostila há duas chaves, e eu sempre troco qual é qual."
                },
                {
                  "speaker": "lia",
                  "text": "Troque menos: cada chave parte de um ponto e chega a outro. Onde ficam esses pontos?"
                },
                {
                  "speaker": "pixel",
                  "text": "Veja onde cada chave começa. Isso ajuda mais do que decorar o tamanho."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-02:conceito",
          "role": "concept",
          "payload": {
            "title": "Dois intervalos contados a partir do pulso",
            "body": "Cada repetição começa com um pulso de excitação, a barra amarela. O TE é o intervalo do pulso ao centro do eco: a chave curta. O TR é o intervalo de um pulso até o pulso seguinte: a chave longa. Na ordem: pulso de excitação, sinal que começa a se desfazer, centro do eco, que fecha o TE, e pulso seguinte, que fecha o TR. Os dois intervalos contam a partir do pulso. Tempo na horizontal; intensidade na vertical.",
            "keyPoints": [
              "TE: do pulso ao centro do eco. É a chave curta.",
              "TR: de um pulso ao pulso seguinte. É a chave longa."
            ],
            "visual": "linha-do-tempo-tr-te"
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-02:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-02"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de fundamentos, qual parte do equipamento emite os pulsos de radiofrequência que começam cada repetição?"
            },
            "help": "Lembre qual bobina emite e capta radiofrequência.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A bobina de RF emite o pulso e também capta o sinal de volta.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de fundamentos, qual parte do equipamento emite os pulsos de radiofrequência que começam cada repetição?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-02:i1:a",
                  "label": "A bobina de RF, que emite o pulso e capta o sinal",
                  "explanation": "A bobina de RF emite o pulso e também capta o sinal de volta."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i1:b",
                  "label": "As bobinas de gradiente, que localizam o sinal",
                  "explanation": "Os gradientes variam o campo conforme a posição e fazem o ruído. Quem emite o pulso é a bobina de RF."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i1:c",
                  "label": "O ímã principal, que mantém o campo constante",
                  "explanation": "O ímã principal só cria o campo forte e constante. Quem emite o pulso é a bobina de RF."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i1:d",
                  "label": "O hélio líquido, que resfria o ímã supercondutor",
                  "explanation": "O hélio líquido resfria o ímã e não emite pulso. Quem emite é a bobina de RF."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-02:i1:a"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-02:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Ordenação: Coloque os momentos de uma repetição na ordem ensinada nesta aula."
            },
            "help": "Siga a linha do tempo da esquerda para a direita, começando pelo primeiro pulso.",
            "type": "ordering",
            "feedback": {
              "correct": "Isso mesmo: o pulso abre a repetição, o eco fecha o TE e o pulso seguinte fecha o TR.",
              "incorrect": "Reveja a linha do tempo: o TE termina no centro do eco, e o TR só termina no pulso seguinte."
            },
            "payload": {
              "prompt": "Coloque os momentos de uma repetição na ordem ensinada nesta aula.",
              "items": [
                {
                  "id": "item:rtg-2026:m29:aula-02:i2:1",
                  "label": "Pulso de excitação"
                },
                {
                  "id": "item:rtg-2026:m29:aula-02:i2:4",
                  "label": "Pulso seguinte, que fecha o TR"
                },
                {
                  "id": "item:rtg-2026:m29:aula-02:i2:3",
                  "label": "Centro do eco, que fecha o TE"
                },
                {
                  "id": "item:rtg-2026:m29:aula-02:i2:2",
                  "label": "Sinal começa a se desfazer"
                }
              ],
              "correctOrder": [
                "item:rtg-2026:m29:aula-02:i2:1",
                "item:rtg-2026:m29:aula-02:i2:2",
                "item:rtg-2026:m29:aula-02:i2:3",
                "item:rtg-2026:m29:aula-02:i2:4"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-02:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Julgue cada afirmação sobre a linha do tempo."
            },
            "help": "Para cada frase, procure onde o intervalo começa e onde termina.",
            "type": "true-false",
            "feedback": {
              "correct": "Você separou o intervalo até o eco do intervalo entre pulsos.",
              "incorrect": "Releia o conceito: os dois contam a partir do pulso, mas terminam em pontos diferentes."
            },
            "payload": {
              "prompt": "Julgue cada afirmação sobre a linha do tempo.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m29:aula-02:i3:1",
                  "text": "O TE é contado do pulso de excitação até o centro do eco.",
                  "isTrue": true,
                  "explanation": "Certo: o TE parte do pulso e termina no centro do eco."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-02:i3:2",
                  "text": "O TR é contado do centro do eco até o pulso seguinte.",
                  "isTrue": false,
                  "explanation": "Errado: o TR parte de um pulso e vai até o pulso seguinte, passando pelo eco."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-02:i3:3",
                  "text": "A chave longa marca o intervalo de um pulso ao seguinte.",
                  "isTrue": true,
                  "explanation": "Certo: a chave longa vai de pulso a pulso, e esse intervalo é o TR."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-02:i3:4",
                  "text": "TR e TE são dois nomes para o mesmo intervalo.",
                  "isTrue": false,
                  "explanation": "Errado: o TE termina no eco, e o TR só termina no pulso seguinte."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-02:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-02"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com os termos do banco."
            },
            "help": "Qual intervalo é o curto e qual é o longo na figura?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso mesmo: TE até o eco e TR de pulso a pulso.",
              "incorrect": "T1 e T2 são tempos do tecido. Os intervalos da linha do tempo são o TE, até o eco, e o TR, entre pulsos."
            },
            "payload": {
              "prompt": "Complete a frase com os termos do banco.",
              "segments": [
                "O ",
                " vai do pulso ao centro do eco, e o ",
                " vai de um pulso ao pulso seguinte."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m29:aula-02:i4:1",
                  "label": "TE"
                },
                {
                  "id": "token:rtg-2026:m29:aula-02:i4:3",
                  "label": "T1"
                },
                {
                  "id": "token:rtg-2026:m29:aula-02:i4:2",
                  "label": "TR"
                },
                {
                  "id": "token:rtg-2026:m29:aula-02:i4:4",
                  "label": "T2"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m29:aula-02:i4:1",
                  "correctTokenId": "token:rtg-2026:m29:aula-02:i4:1"
                },
                {
                  "id": "blank:rtg-2026:m29:aula-02:i4:2",
                  "correctTokenId": "token:rtg-2026:m29:aula-02:i4:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-02:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-02"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Numa apostila, a linha A tem os pulsos bem mais afastados que a linha B, e o eco fica à mesma distância do primeiro pulso nas duas. O que difere entre A e B?"
            },
            "help": "Veja o que cada distância mede: pulso a eco e pulso a pulso.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Pulsos mais afastados mostram TR maior, e o eco à mesma distância mostra TE igual.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Numa apostila, a linha A tem os pulsos bem mais afastados que a linha B, e o eco fica à mesma distância do primeiro pulso nas duas. O que difere entre A e B?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-02:i5:a",
                  "label": "O TR é maior em A, e o TE é igual nas duas",
                  "explanation": "Pulsos mais afastados mostram TR maior, e o eco à mesma distância mostra TE igual."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i5:b",
                  "label": "O TE é maior em A, e o TR é igual nas duas",
                  "explanation": "O eco está à mesma distância do pulso nas duas, então o TE é igual. O que muda é o espaço entre pulsos, o TR."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i5:c",
                  "label": "Os dois são maiores em A",
                  "explanation": "Só o intervalo entre pulsos cresce em A. O eco fica à mesma distância, então o TE não muda."
                },
                {
                  "id": "option:rtg-2026:m29:aula-02:i5:d",
                  "label": "Nada muda, pois o eco está igual nas duas",
                  "explanation": "O eco igual só mantém o TE. Os pulsos mais afastados mudam o TR."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-02:i5:a"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-02:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê o TR e o TE",
            "body": "Agora você diz o que cada chave da linha do tempo marca: o TE vai do pulso ao centro do eco, e o TR vai de um pulso ao seguinte. Você só lê os intervalos; quem os define é o protocolo.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Na sala, é exatamente isso que eu pergunto quando a tela mostra dois tempos."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m29:aula-03",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-03"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm",
          "source:rtg-2026:m29:ucsd-fmri-estrutural",
          "source:rtg-2026:m29:mrimaster-liquido-suprimido"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-03:abertura",
          "role": "hook",
          "payload": {
            "title": "Reconhecer a ponderação",
            "body": "Hoje você vai conseguir reconhecer, pelo brilho do líquido e da gordura, uma imagem em T1, uma em T2 e uma com o líquido suprimido.",
            "dialogue": {
              "setting": "Sala de comando",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Três imagens do mesmo corte da cabeça, e eu não sei qual é qual."
                },
                {
                  "speaker": "caio",
                  "text": "Não olhe tudo de uma vez. Escolha uma pista e compare nas três imagens."
                },
                {
                  "speaker": "pixel",
                  "text": "O líquido dentro da cabeça e a gordura em volta mudam de brilho. O que mais muda?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-03:conceito",
          "role": "concept",
          "payload": {
            "title": "O brilho conta a ponderação",
            "body": "Na atividade, o mesmo corte da cabeça aparece em três imagens de ressonância. Na ponderada em T1, o líquido dos ventrículos é escuro, a gordura é clara e a substância branca é mais clara que a cinzenta. Na ponderada em T2, o líquido é claro e a branca é mais escura que a cinzenta. A terceira é de base T2 com o líquido suprimido: líquido escuro, branca mais escura que a cinzenta. Nesta imagem, a gordura do couro cabeludo também está escura, por uma técnica extra, a supressão de gordura, assunto da próxima aula. Você reconhece a imagem; a equipe decide o que ela significa.",
            "keyPoints": [
              "T1: líquido escuro, gordura clara, substância branca mais clara que a cinzenta.",
              "T2: líquido claro, substância branca mais escura que a cinzenta.",
              "Base T2 com líquido suprimido: líquido escuro e branca mais escura que a cinzenta."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-03:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-03"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de fundamentos, você viu que certa combinação de tempos favorece a ponderação em T2. Qual é ela?"
            },
            "help": "Lembre os dois tempos e qual ponderação cada par favorece.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "TR e TE longos favorecem a ponderação em T2, em que o líquido fica claro.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de fundamentos, você viu que certa combinação de tempos favorece a ponderação em T2. Qual é ela?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-03:i1:a",
                  "label": "TR curto e TE curto",
                  "explanation": "TR e TE curtos favorecem a ponderação em T1. Retome qual combinação deixa o líquido claro."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i1:b",
                  "label": "TR longo e TE curto",
                  "explanation": "TR longo com TE curto não é a combinação ensinada para T2: ela pede também TE longo."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i1:c",
                  "label": "Só o pulso de RF define a ponderação",
                  "explanation": "A ponderação vem dos tempos TR e TE, e não de o pulso existir. Retome os dois tempos."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i1:d",
                  "label": "TR longo e TE longo",
                  "explanation": "TR e TE longos favorecem a ponderação em T2, em que o líquido fica claro."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-03:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-03:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque nos ventrículos da imagem em que o líquido está escuro e a substância branca é mais escura que a cinzenta."
            },
            "help": "Duas imagens têm líquido escuro. Desempate pela substância branca.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: líquido escuro com a branca mais escura que a cinzenta é a imagem com o líquido suprimido.",
              "incorrect": "Compare as duas imagens de líquido escuro: em uma a substância branca é mais clara que a cinzenta, na outra é mais escura."
            },
            "payload": {
              "prompt": "Toque nos ventrículos da imagem em que o líquido está escuro e a substância branca é mais escura que a cinzenta.",
              "imageRef": "image:rtg-2026:m29:rm-ponderacoes-encefalo-01",
              "regions": [
                {
                  "id": "region:rtg-2026:m29:aula-03:i2:1",
                  "label": "Ventrículos da primeira imagem",
                  "x": 0.1233,
                  "y": 0.3137,
                  "width": 0.0867,
                  "height": 0.3467
                },
                {
                  "id": "region:rtg-2026:m29:aula-03:i2:2",
                  "label": "Ventrículos da segunda imagem",
                  "x": 0.4708,
                  "y": 0.3066,
                  "width": 0.0892,
                  "height": 0.3538
                },
                {
                  "id": "region:rtg-2026:m29:aula-03:i2:3",
                  "label": "Ventrículos da terceira imagem",
                  "x": 0.79,
                  "y": 0.3184,
                  "width": 0.0867,
                  "height": 0.342
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m29:aula-03:i2:3"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-03:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada descrição de imagem no grupo da ponderação que ela combina."
            },
            "help": "Líquido claro aponta T2. Líquido escuro pede uma segunda pista.",
            "type": "categorize",
            "feedback": {
              "correct": "Isso mesmo: o brilho do líquido separa T2 das outras, e a substância branca separa T1 do líquido suprimido.",
              "incorrect": "Confira o líquido primeiro. Se ele é escuro, compare a substância branca com a cinzenta."
            },
            "payload": {
              "prompt": "Classifique cada descrição de imagem no grupo da ponderação que ela combina.",
              "categories": [
                {
                  "id": "group:rtg-2026:m29:aula-03:i3:a",
                  "label": "Ponderada em T1"
                },
                {
                  "id": "group:rtg-2026:m29:aula-03:i3:b",
                  "label": "Ponderada em T2"
                },
                {
                  "id": "group:rtg-2026:m29:aula-03:i3:c",
                  "label": "Líquido suprimido"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m29:aula-03:i3:2",
                  "label": "Substância branca mais clara que a cinzenta",
                  "categoryId": "group:rtg-2026:m29:aula-03:i3:a"
                },
                {
                  "id": "item:rtg-2026:m29:aula-03:i3:5",
                  "label": "Líquido escuro e branca mais escura que a cinzenta",
                  "categoryId": "group:rtg-2026:m29:aula-03:i3:c"
                },
                {
                  "id": "item:rtg-2026:m29:aula-03:i3:4",
                  "label": "Líquido claro e cinzenta mais clara que a branca",
                  "categoryId": "group:rtg-2026:m29:aula-03:i3:b"
                },
                {
                  "id": "item:rtg-2026:m29:aula-03:i3:1",
                  "label": "Líquido escuro e gordura clara",
                  "categoryId": "group:rtg-2026:m29:aula-03:i3:a"
                },
                {
                  "id": "item:rtg-2026:m29:aula-03:i3:3",
                  "label": "Ventrículos brilhantes, quase brancos",
                  "categoryId": "group:rtg-2026:m29:aula-03:i3:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-03:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-03"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Marque todas as corretas: Marque tudo o que cabe a você diante de uma série cuja imagem não combina com o pedido."
            },
            "help": "Pergunte de cada ação: é descrever e conferir, ou é decidir e interpretar?",
            "type": "multi-select",
            "feedback": {
              "correct": "Isso mesmo: você descreve, compara e espera, sem mexer no protocolo nem dar significado à imagem.",
              "incorrect": "Releia o que cabe ao estudante: descrever, comparar e aguardar. Trocar, repetir e interpretar ficam com a equipe."
            },
            "payload": {
              "prompt": "Marque tudo o que cabe a você diante de uma série cuja imagem não combina com o pedido.",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:a",
                  "label": "Trocar a ponderação na tela para combinar com o pedido",
                  "explanation": "Trocar a ponderação é mudar o protocolo, e isso não é tarefa do estudante."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:b",
                  "label": "Descrever à tecnóloga o brilho que você vê no líquido",
                  "explanation": "Descrever o que se vê, com palavras simples, é o que cabe a você."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:c",
                  "label": "Escrever no registro o que a diferença quer dizer",
                  "explanation": "Dar significado à imagem é da equipe, e não do estudante. Você descreve."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:d",
                  "label": "Comparar o que vê com o que a folha do protocolo pede",
                  "explanation": "Comparar a imagem com o pedido é conferir, e a diferença vai para a equipe."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:e",
                  "label": "Refazer a série por conta própria, com outro ajuste",
                  "explanation": "Decidir repetir e mexer em ajuste não é do estudante: a equipe decide."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i4:f",
                  "label": "Aguardar a equipe antes de qualquer nova série",
                  "explanation": "Aguardar a equipe evita nova série sem decisão de quem pode decidir."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m29:aula-03:i4:b",
                "option:rtg-2026:m29:aula-03:i4:d",
                "option:rtg-2026:m29:aula-03:i4:f"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-03:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-03"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Caso com decisão: O que você faz diante dessa diferença?"
            },
            "help": "Compare o que a folha pede com o que a tela mostra, e pense em quem decide.",
            "type": "case-decision",
            "feedback": {
              "correct": "Descrever a diferença e aguardar mantém a decisão com a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "context": "Dona Celina faz, em simulação, uma série da cabeça. A folha do protocolo pede imagem com o líquido suprimido, mas na tela os ventrículos aparecem claros. A tecnóloga está na sala de comando.",
              "prompt": "O que você faz diante dessa diferença?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-03:i5:a",
                  "label": "Muda a série na tela para a de líquido suprimido",
                  "explanation": "Mudar a série é alterar o protocolo, e isso não é tarefa do estudante."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i5:b",
                  "label": "Anota que a imagem está correta, pois o líquido aparece",
                  "explanation": "O líquido visível não prova que o pedido foi cumprido: o pedido era líquido escuro."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i5:c",
                  "label": "Descreve a diferença à tecnóloga e aguarda a resposta",
                  "explanation": "Descrever a diferença e aguardar mantém a decisão com a equipe."
                },
                {
                  "id": "option:rtg-2026:m29:aula-03:i5:d",
                  "label": "Conclui que a folha errou e corrige o pedido sozinho",
                  "explanation": "Corrigir o pedido por conta própria é o que a regra proíbe: diante da diferença, descreva e peça apoio."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-03:i5:c"
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-03:fecho",
          "role": "closing",
          "payload": {
            "title": "Você reconhece a ponderação",
            "body": "Agora você reconhece T1 pelo líquido escuro e pela gordura clara, T2 pelo líquido claro e a imagem de base T2 com líquido suprimido pelo líquido escuro com a branca mais escura que a cinzenta. E sabe descrever uma diferença à equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Descrever bem já é metade do trabalho. A outra metade é a equipe."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m29:aula-04",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-04"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm",
          "source:rtg-2026:m29:ucsd-fmri-estrutural",
          "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
          "source:rtg-2026:m29:krupa-2015-artefatos-rm"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-04:abertura",
          "role": "hook",
          "payload": {
            "title": "Apagar a gordura",
            "body": "Hoje você vai conseguir dizer o que a supressão de gordura muda na imagem e o que pode atrapalhá-la.",
            "dialogue": {
              "setting": "Sala de comando",
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Essa série saiu com a gordura toda escura. Será que alguém estragou a imagem?"
                },
                {
                  "speaker": "duda",
                  "text": "Estragou? Eu achei que fosse de propósito, mas não sei como se apaga gordura."
                },
                {
                  "speaker": "lia",
                  "text": "Compare as duas imagens do abdome e descreva o que mudou. Depois, pense no que pode atrapalhar essa mudança."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-04:conceito",
          "role": "concept",
          "payload": {
            "title": "Gordura clara, gordura apagada",
            "body": "Na atividade, duas imagens do mesmo corte do abdome diferem só pela supressão de gordura. Sem supressão, a gordura sob a pele é clara. Com supressão de gordura, o sinal da gordura é apagado e ela escurece. A supressão que separa a gordura pela frequência depende de um campo bem regular. Metal perto da região desnivela o campo, e ali a gordura pode escapar da supressão: sobra uma faixa clara junto ao objeto. Você descreve a faixa e o objeto à equipe; não refaz nem ajusta a série.",
            "keyPoints": [
              "Supressão de gordura: o sinal da gordura é apagado e ela escurece.",
              "Metal perto desnivela o campo, e a supressão pode falhar ali.",
              "Faixa clara junto de objeto: descreva e avise a equipe."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-04:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-04"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, na imagem ponderada em T1, como aparecem a gordura do couro cabeludo e o líquido dos ventrículos?"
            },
            "help": "Pense na imagem em que o líquido era a parte escura.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Na T1 a gordura é clara e o líquido é escuro.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, na imagem ponderada em T1, como aparecem a gordura do couro cabeludo e o líquido dos ventrículos?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-04:i1:a",
                  "label": "Gordura escura e líquido claro",
                  "explanation": "Isso inverte a T1: nela a gordura é clara e o líquido é escuro."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i1:b",
                  "label": "Gordura clara e líquido escuro",
                  "explanation": "Na T1 a gordura é clara e o líquido é escuro."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i1:c",
                  "label": "Gordura clara e líquido claro",
                  "explanation": "Na T1 o líquido é escuro. Só a gordura é clara."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i1:d",
                  "label": "Gordura escura e líquido escuro",
                  "explanation": "Na T1 a gordura é clara. Retome o que aparece claro."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-04:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-04:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Completar a frase: Complete a frase com as palavras do banco."
            },
            "help": "Se a supressão falha, a gordura volta a ter sinal. Como ela fica na imagem?",
            "type": "cloze",
            "feedback": {
              "correct": "Isso mesmo: a supressão apaga o sinal da gordura, e a falha perto de metal deixa uma faixa clara.",
              "incorrect": "Pense no que a supressão faz com a gordura e no que sobra onde ela falha: gordura que continua com sinal."
            },
            "payload": {
              "prompt": "Complete a frase com as palavras do banco.",
              "segments": [
                "A supressão de gordura ",
                " o sinal da gordura. Perto de metal, a falha deixa uma faixa ",
                " de gordura."
              ],
              "tokens": [
                {
                  "id": "token:rtg-2026:m29:aula-04:i2:5",
                  "label": "repete"
                },
                {
                  "id": "token:rtg-2026:m29:aula-04:i2:4",
                  "label": "escura"
                },
                {
                  "id": "token:rtg-2026:m29:aula-04:i2:1",
                  "label": "apaga"
                },
                {
                  "id": "token:rtg-2026:m29:aula-04:i2:3",
                  "label": "realça"
                },
                {
                  "id": "token:rtg-2026:m29:aula-04:i2:2",
                  "label": "clara"
                }
              ],
              "blanks": [
                {
                  "id": "blank:rtg-2026:m29:aula-04:i2:1",
                  "correctTokenId": "token:rtg-2026:m29:aula-04:i2:1"
                },
                {
                  "id": "blank:rtg-2026:m29:aula-04:i2:2",
                  "correctTokenId": "token:rtg-2026:m29:aula-04:i2:2"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-04:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Toque na gordura sob a pele da imagem em que a supressão de gordura foi usada."
            },
            "help": "Procure a imagem em que a faixa de gordura sob a pele ficou escura.",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: com a supressão, o sinal da gordura sob a pele é apagado e ela escurece.",
              "incorrect": "Compare a gordura sob a pele nas duas imagens: onde ela continua clara, a supressão não foi usada."
            },
            "payload": {
              "prompt": "Toque na gordura sob a pele da imagem em que a supressão de gordura foi usada.",
              "imageRef": "image:rtg-2026:m29:rm-supressao-gordura-01",
              "regions": [
                {
                  "id": "region:rtg-2026:m29:aula-04:i3:1",
                  "label": "Gordura sob a pele, imagem da esquerda",
                  "x": 0.125,
                  "y": 0.1774,
                  "width": 0.2417,
                  "height": 0.0806
                },
                {
                  "id": "region:rtg-2026:m29:aula-04:i3:2",
                  "label": "Gordura sob a pele, imagem da direita",
                  "x": 0.625,
                  "y": 0.1774,
                  "width": 0.2417,
                  "height": 0.0806
                },
                {
                  "id": "region:rtg-2026:m29:aula-04:i3:3",
                  "label": "Coluna, imagem da esquerda",
                  "x": 0.2125,
                  "y": 0.576,
                  "width": 0.0833,
                  "height": 0.1728
                },
                {
                  "id": "region:rtg-2026:m29:aula-04:i3:4",
                  "label": "Coluna, imagem da direita",
                  "x": 0.7125,
                  "y": 0.576,
                  "width": 0.0833,
                  "height": 0.1728
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m29:aula-04:i3:2"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-04:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-04"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": true,
            "accessibility": {
              "label": "Certo ou errado: Julgue o que você faz diante de uma faixa clara de gordura junto de um objeto, numa série com supressão."
            },
            "help": "Pergunte de cada frase: é descrever e avisar, ou é decidir sozinho?",
            "type": "true-false",
            "feedback": {
              "correct": "Isso mesmo: você descreve, liga a falha ao metal como hipótese e deixa a decisão com a equipe.",
              "incorrect": "Releia o fim do conceito: você descreve a faixa e o objeto, e não ajusta, nem repete, nem conclui."
            },
            "payload": {
              "prompt": "Julgue o que você faz diante de uma faixa clara de gordura junto de um objeto, numa série com supressão.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m29:aula-04:i4:1",
                  "text": "Você descreve à equipe a faixa clara e o objeto que está ao lado dela.",
                  "isTrue": true,
                  "explanation": "Certo: descrever a faixa e o objeto dá à equipe o que ela precisa para avaliar."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-04:i4:2",
                  "text": "Você refaz a série com outro ajuste até a faixa clara sumir.",
                  "isTrue": false,
                  "explanation": "Errado: ajustar e repetir a série não é tarefa do estudante. A equipe decide."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-04:i4:3",
                  "text": "Você conclui que o objeto é seguro porque a imagem saiu legível.",
                  "isTrue": false,
                  "explanation": "Errado: imagem legível não prova que o objeto é seguro. Quem avalia é a equipe."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-04:i4:4",
                  "text": "Metal perto da região é uma explicação possível para a falha ali.",
                  "isTrue": true,
                  "explanation": "Certo: metal distorce o campo, e a supressão de gordura pode falhar perto dele."
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-04:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-04"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Numa série descrita da coluna de Seu Otávio, com supressão de gordura, aparece uma faixa clara de gordura em volta de um parafuso que a ficha já registra. Marque tudo o que combina com a aula."
            },
            "help": "Parafuso é metal. O que a aula diz do metal perto da supressão de gordura?",
            "type": "multi-select",
            "feedback": {
              "correct": "Isso mesmo: você liga a faixa ao metal próximo e descreve, sem ajustar nem concluir.",
              "incorrect": "Confira o que sobrou ou faltou: a falha perto de metal e a descrição à equipe são o que combina."
            },
            "payload": {
              "prompt": "Numa série descrita da coluna de Seu Otávio, com supressão de gordura, aparece uma faixa clara de gordura em volta de um parafuso que a ficha já registra. Marque tudo o que combina com a aula.",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-04:i5:a",
                  "label": "A faixa clara mostra que o parafuso se soltou",
                  "explanation": "A faixa clara é gordura que a supressão não apagou, e não prova que o parafuso se soltou."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i5:b",
                  "label": "O parafuso pode distorcer o campo, e a supressão pode falhar perto dele",
                  "explanation": "Parafuso é metal, e perto de metal a supressão de gordura pode falhar."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i5:c",
                  "label": "Você ajusta a supressão até a faixa clara sumir",
                  "explanation": "Ajustar a supressão é mexer no protocolo, e isso não é tarefa do estudante."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i5:d",
                  "label": "Você descreve onde está a faixa e deixa a equipe avaliar",
                  "explanation": "Descrever o lugar e o aspecto da faixa e aguardar a equipe é o que cabe a você."
                },
                {
                  "id": "option:rtg-2026:m29:aula-04:i5:e",
                  "label": "Como a ficha registra o parafuso, a faixa não precisa ser comentada",
                  "explanation": "O registro do parafuso não dispensa a descrição: uma marca nova na imagem vai à equipe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m29:aula-04:i5:b",
                "option:rtg-2026:m29:aula-04:i5:d"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-04:fecho",
          "role": "closing",
          "payload": {
            "title": "Você lê a supressão de gordura",
            "body": "Agora você diz o que a supressão de gordura muda, a gordura sob a pele fica escura, e reconhece, numa série descrita, a faixa clara perto de metal como possível falha. E leva isso à equipe, sem ajustar nada.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "caio",
                  "text": "Faixa clara perto de metal: descreva onde, e chame a tecnóloga."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m29:aula-05",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-05"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
          "source:rtg-2026:m29:krupa-2015-artefatos-rm"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-05:abertura",
          "role": "hook",
          "payload": {
            "title": "Três artefatos comuns",
            "body": "Hoje você vai conseguir reconhecer a marca do movimento, a do metal e a da dobra, e dizer a quem avisar.",
            "dialogue": {
              "setting": "Sala de comando",
              "lines": [
                {
                  "speaker": "duda",
                  "text": "Apareceram três imagens estranhas no treino, e eu quero logo dar nome a cada uma."
                },
                {
                  "speaker": "caio",
                  "text": "Descreva a marca antes de dar nome: onde ela está e como se parece."
                },
                {
                  "speaker": "lia",
                  "text": "E diante de uma marca que ninguém esperava, o que vem antes de qualquer nome?"
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-05:conceito",
          "role": "concept",
          "payload": {
            "title": "Três marcas, três causas",
            "body": "Movimento deixa cópias fracas da estrutura, os fantasmas, repetidas pelo corte; ficar parado ajuda a reduzi-los. Metal deixa um vazio de sinal, preto, com borda clara e torta ao redor. Dobra é a anatomia que ficou fora do campo de visão e aparece no lado oposto da imagem. Metal que ninguém esperava na imagem pede parar e avisar a equipe. Você descreve a marca e o lugar dela; a equipe avalia a causa e decide o que fazer. Você não repete a série por conta própria.",
            "keyPoints": [
              "Movimento: cópias fracas, os fantasmas.",
              "Metal: vazio de sinal com borda clara e torta. Pare e avise a equipe.",
              "Dobra: anatomia de fora do campo aparece no lado oposto."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-05:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-05"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na aula anterior, o que pode acontecer com a supressão de gordura perto de um objeto de metal?"
            },
            "help": "Lembre o que a aula anterior disse da gordura clara junto ao metal.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "Perto de metal o campo se distorce, e a supressão pode falhar, deixando gordura clara.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na aula anterior, o que pode acontecer com a supressão de gordura perto de um objeto de metal?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-05:i1:a",
                  "label": "Pode apagar também o sinal do osso vizinho",
                  "explanation": "O que a aula mostrou foi falha, com gordura que continua clara, e não apagar a mais."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i1:b",
                  "label": "Pode falhar e deixar uma faixa clara de gordura",
                  "explanation": "Perto de metal o campo se distorce, e a supressão pode falhar, deixando gordura clara."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i1:c",
                  "label": "Passa a funcionar melhor, com mais contraste",
                  "explanation": "Metal atrapalha a supressão. O campo irregular que ele cria faz a gordura voltar a ter sinal."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i1:d",
                  "label": "Não muda: metal não interfere na supressão",
                  "explanation": "Metal interfere: distorce o campo, e a supressão pode falhar perto dele."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-05:i1:b"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-05:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rotular a imagem: Rotule as marcas do esquema, tocando na ficha e no ponto."
            },
            "help": "Comece pelo corte da esquerda, depois o do meio e por último o da direita.",
            "type": "label",
            "feedback": {
              "correct": "Isso mesmo: cada marca ficou ligada ao ponto certo do esquema.",
              "incorrect": "Alguma ficha está fora do lugar: procure cópias fracas, a mancha preta com a borda, a forma dentro da caixa e o que ficou fora dela."
            },
            "payload": {
              "prompt": "Rotule as marcas do esquema, tocando na ficha e no ponto.",
              "imageRef": "diagram:artefatos-de-rm",
              "points": [
                {
                  "id": "point:rtg-2026:m29:aula-05:i2:1",
                  "x": 0.1625,
                  "y": 0.1875,
                  "where": "à esquerda, cópias fracas empilhadas acima do corte oval",
                  "correctLabelId": "label:rtg-2026:m29:aula-05:i2:1"
                },
                {
                  "id": "point:rtg-2026:m29:aula-05:i2:2",
                  "x": 0.4875,
                  "y": 0.3667,
                  "where": "no corte do meio, a grande mancha preta",
                  "correctLabelId": "label:rtg-2026:m29:aula-05:i2:2"
                },
                {
                  "id": "point:rtg-2026:m29:aula-05:i2:3",
                  "x": 0.4875,
                  "y": 0.5834,
                  "where": "no corte do meio, a borda clara e torta abaixo da mancha",
                  "correctLabelId": "label:rtg-2026:m29:aula-05:i2:3"
                },
                {
                  "id": "point:rtg-2026:m29:aula-05:i2:4",
                  "x": 0.6938,
                  "y": 0.5,
                  "where": "no corte da direita, o oval claro na borda esquerda da caixa",
                  "correctLabelId": "label:rtg-2026:m29:aula-05:i2:4"
                },
                {
                  "id": "point:rtg-2026:m29:aula-05:i2:5",
                  "x": 0.9063,
                  "y": 0.5,
                  "where": "no corte da direita, o contorno tracejado além da caixa",
                  "correctLabelId": "label:rtg-2026:m29:aula-05:i2:5"
                }
              ],
              "labels": [
                {
                  "id": "label:rtg-2026:m29:aula-05:i2:2",
                  "label": "Vazio de sinal"
                },
                {
                  "id": "label:rtg-2026:m29:aula-05:i2:4",
                  "label": "Parte dobrada"
                },
                {
                  "id": "label:rtg-2026:m29:aula-05:i2:5",
                  "label": "Anatomia de fora"
                },
                {
                  "id": "label:rtg-2026:m29:aula-05:i2:1",
                  "label": "Fantasmas"
                },
                {
                  "id": "label:rtg-2026:m29:aula-05:i2:3",
                  "label": "Borda distorcida"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-05:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Classificação: Classifique cada marca descrita pela causa a que ela se liga."
            },
            "help": "Pergunte de cada marca: o que a produziu, o paciente, um objeto ou o campo de visão?",
            "type": "categorize",
            "feedback": {
              "correct": "Isso mesmo: cópias combinam com movimento, mancha e faixa junto a objeto combinam com metal, e reaparecer do outro lado é dobra.",
              "incorrect": "Releia as três marcas do conceito: cópias fracas, vazio com borda ou faixa junto a objeto, e anatomia que reaparece do lado oposto."
            },
            "payload": {
              "prompt": "Classifique cada marca descrita pela causa a que ela se liga.",
              "categories": [
                {
                  "id": "group:rtg-2026:m29:aula-05:i3:a",
                  "label": "Movimento do paciente"
                },
                {
                  "id": "group:rtg-2026:m29:aula-05:i3:b",
                  "label": "Objeto de metal"
                },
                {
                  "id": "group:rtg-2026:m29:aula-05:i3:c",
                  "label": "Anatomia fora do campo"
                }
              ],
              "items": [
                {
                  "id": "item:rtg-2026:m29:aula-05:i3:4",
                  "label": "Faixa de gordura clara colada a um parafuso",
                  "categoryId": "group:rtg-2026:m29:aula-05:i3:b"
                },
                {
                  "id": "item:rtg-2026:m29:aula-05:i3:3",
                  "label": "O contorno do braço reaparece do lado oposto do tórax",
                  "categoryId": "group:rtg-2026:m29:aula-05:i3:c"
                },
                {
                  "id": "item:rtg-2026:m29:aula-05:i3:5",
                  "label": "Cópias da cabeça depois de ele mexer o pescoço",
                  "categoryId": "group:rtg-2026:m29:aula-05:i3:a"
                },
                {
                  "id": "item:rtg-2026:m29:aula-05:i3:1",
                  "label": "Cópias fracas do braço, repetidas além do corpo",
                  "categoryId": "group:rtg-2026:m29:aula-05:i3:a"
                },
                {
                  "id": "item:rtg-2026:m29:aula-05:i3:2",
                  "label": "Mancha preta de borda clara junto a um grampo",
                  "categoryId": "group:rtg-2026:m29:aula-05:i3:b"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-05:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-05"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Rodada rápida: Responda verdadeiro ou falso a cada afirmação sobre as três marcas."
            },
            "help": "Leia cada afirmação com calma antes de responder.",
            "type": "blitz",
            "feedback": {
              "correct": "Isso mesmo: você separou cada marca da sua causa e sabe quem avisar.",
              "incorrect": "Reveja as afirmações: cada uma tem a explicação no retorno."
            },
            "payload": {
              "prompt": "Responda verdadeiro ou falso a cada afirmação sobre as três marcas.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:1",
                  "text": "Cópias fracas da mesma estrutura são marca de movimento.",
                  "isTrue": true,
                  "explanation": "Movimento durante a aquisição cria cópias fracas da estrutura, os fantasmas."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:2",
                  "text": "Metal perto da região pode deixar uma área preta sem sinal.",
                  "isTrue": true,
                  "explanation": "Metal pode deixar um vazio de sinal, preto, com distorção em volta."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:3",
                  "text": "A dobra repete na imagem a anatomia de dentro do campo.",
                  "isTrue": false,
                  "explanation": "A dobra traz para o lado oposto a anatomia que ficou fora do campo de visão."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:4",
                  "text": "Ficar parado ajuda a reduzir os fantasmas de movimento.",
                  "isTrue": true,
                  "explanation": "Manter o paciente parado reduz os fantasmas."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:5",
                  "text": "A dobra é a marca de que o paciente se mexeu.",
                  "isTrue": false,
                  "explanation": "A dobra vem de anatomia fora do campo, e não de movimento do paciente."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:6",
                  "text": "Metal que ninguém esperava na imagem: você repete a série por conta própria.",
                  "isTrue": false,
                  "explanation": "Diante de metal inesperado, você para e avisa a equipe. Repetir não é seu."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-05:i4:7",
                  "text": "Mancha preta inesperada de borda clara: você para e avisa a equipe.",
                  "isTrue": true,
                  "explanation": "Marca inesperada de metal pede parar e avisar a equipe, que avalia o caso."
                }
              ],
              "passCount": 6
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-05:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-05"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Marque todas as corretas: Numa série descrita de pelve, aparece uma área preta de borda clara junto à cintura de Dona Zuleica, e a ficha não registra nenhum objeto. Marque tudo o que você faz."
            },
            "help": "Marca preta que ninguém esperava: qual é o primeiro passo?",
            "type": "multi-select",
            "feedback": {
              "correct": "Isso mesmo: você para, descreve e espera, e deixa a causa com a equipe.",
              "incorrect": "Confira o que sobrou ou faltou: parar, descrever e aguardar são suas. Repetir, anotar a causa e interrogar ficam com a equipe."
            },
            "payload": {
              "prompt": "Numa série descrita de pelve, aparece uma área preta de borda clara junto à cintura de Dona Zuleica, e a ficha não registra nenhum objeto. Marque tudo o que você faz.",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-05:i5:a",
                  "label": "Repete a série com outro campo de visão",
                  "explanation": "Repetir a série e mexer no campo de visão não é seu, e não resolve uma marca de metal."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i5:b",
                  "label": "Para e descreve a marca e o lugar à tecnóloga",
                  "explanation": "Parar e descrever dá à equipe a marca e o lugar dela."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i5:c",
                  "label": "Anota \"metal\" no registro como a causa certa",
                  "explanation": "Fixar a causa no registro é conclusão da equipe, e não do estudante."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i5:d",
                  "label": "Espera a equipe decidir o que fazer a seguir",
                  "explanation": "Aguardar evita nova série sem decisão de quem pode decidir."
                },
                {
                  "id": "option:rtg-2026:m29:aula-05:i5:e",
                  "label": "Pergunta à paciente se ela escondeu algum objeto",
                  "explanation": "Interrogar a paciente não é seu papel, e a triagem é da equipe."
                }
              ],
              "correctOptionIds": [
                "option:rtg-2026:m29:aula-05:i5:b",
                "option:rtg-2026:m29:aula-05:i5:d"
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-05:fecho",
          "role": "closing",
          "payload": {
            "title": "Você reconhece três marcas",
            "body": "Agora você reconhece cópias fracas como movimento, o vazio de sinal com borda clara como metal e a anatomia do lado oposto como dobra, e sabe que metal inesperado pede parar e avisar a equipe.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Marca é para descrever. O nome e a decisão ficam com a equipe."
                }
              ]
            }
          }
        }
      ]
    },
    {
      "id": "activity:rtg-2026:m29:aula-06",
      "competencyIds": [
        "competency:rtg-2026:m29:aula-06"
      ],
      "provenance": {
        "contentVersion": "rtg-2026-m29-v1",
        "sourceIds": [
          "source:rtg-2026:m29:radiologyinfo-preparo-rm",
          "source:rtg-2026:m29:krupa-2015-artefatos-rm",
          "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
        ]
      },
      "steps": [
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-06:abertura",
          "role": "hook",
          "payload": {
            "title": "Dentro do túnel",
            "body": "Hoje você vai conseguir preparar o paciente para o ruído, o tempo e a imobilidade e levar à equipe o que ele disser.",
            "dialogue": {
              "setting": "Sala de preparo",
              "lines": [
                {
                  "speaker": "paciente",
                  "name": "Dona Zuleica",
                  "text": "Vou ficar muito tempo lá dentro? Tenho medo de não aguentar ficar parada."
                },
                {
                  "speaker": "duda",
                  "text": "Eu sei que o barulho incomoda, mas não sei bem o que posso dizer a ela."
                },
                {
                  "speaker": "caio",
                  "text": "Fale do que a equipe já orientou e não prometa o que não é seu. O resto vai para a tecnóloga."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-06:conceito",
          "role": "concept",
          "payload": {
            "title": "Ruído, imobilidade e tempo",
            "body": "Dentro do túnel pesam três coisas para o paciente. O aparelho faz barulhos altos de batida, e a equipe entrega protetor de ouvido. Mexer borra a imagem, por isso ficar parado importa. Algumas pessoas se sentem fechadas no túnel; a tecnóloga vê e ouve o paciente pelo intercomunicador, e ele pode chamar a equipe pela campainha. Você explica o que a equipe já orientou, sem prometer duração nem resultado. Perguntas sobre duração vão para a tecnóloga, e quem analisa e comunica o resultado é a equipe médica.",
            "keyPoints": [
              "Ruído alto: há proteção para os ouvidos.",
              "Ficar parado importa: mexer borra a imagem.",
              "Duração e imagem: você não promete, a tecnóloga responde."
            ]
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-06:i1",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-06"
            ],
            "evidenceKind": "independent-recall",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Múltipla escolha: Na unidade de fundamentos, qual item o paciente leva na mão para chamar a equipe durante a série?"
            },
            "help": "Lembre o que fica ao alcance da mão do paciente.",
            "type": "multiple-choice",
            "feedback": {
              "correct": "A campainha fica na mão do paciente para ele chamar a equipe.",
              "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
            },
            "payload": {
              "prompt": "Na unidade de fundamentos, qual item o paciente leva na mão para chamar a equipe durante a série?",
              "options": [
                {
                  "id": "option:rtg-2026:m29:aula-06:i1:a",
                  "label": "O cartão do implante",
                  "explanation": "O cartão serve para a triagem antes da sala, e não para chamar a equipe."
                },
                {
                  "id": "option:rtg-2026:m29:aula-06:i1:b",
                  "label": "A bobina de recepção",
                  "explanation": "A bobina capta o sinal e fica junto da região examinada, e não serve para chamar."
                },
                {
                  "id": "option:rtg-2026:m29:aula-06:i1:c",
                  "label": "O protetor auricular",
                  "explanation": "O protetor reduz o ruído, mas não chama a equipe. Retome o item da mão."
                },
                {
                  "id": "option:rtg-2026:m29:aula-06:i1:d",
                  "label": "A campainha",
                  "explanation": "A campainha fica na mão do paciente para ele chamar a equipe."
                }
              ],
              "correctOptionId": "option:rtg-2026:m29:aula-06:i1:d"
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-06:i2",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Toque na imagem: Dona Zuleica pergunta por que precisa ficar parada. Toque na marca que o movimento do paciente pode deixar na imagem."
            },
            "help": "Qual das marcas aparece como cópias da mesma estrutura?",
            "type": "hotspot",
            "feedback": {
              "correct": "Isso mesmo: o movimento deixa cópias fracas da estrutura, e é por isso que ficar parado importa.",
              "incorrect": "Essa marca vem de outra causa. Procure as cópias fracas repetidas, que o movimento do paciente produz."
            },
            "payload": {
              "prompt": "Dona Zuleica pergunta por que precisa ficar parada. Toque na marca que o movimento do paciente pode deixar na imagem.",
              "imageRef": "diagram:artefatos-de-rm",
              "regions": [
                {
                  "id": "region:rtg-2026:m29:aula-06:i2:1",
                  "label": "Cópias fracas acima do corte",
                  "x": 0.1125,
                  "y": 0.1417,
                  "width": 0.1,
                  "height": 0.0917
                },
                {
                  "id": "region:rtg-2026:m29:aula-06:i2:2",
                  "label": "Mancha preta do corte do meio",
                  "x": 0.4375,
                  "y": 0.3167,
                  "width": 0.1,
                  "height": 0.1
                },
                {
                  "id": "region:rtg-2026:m29:aula-06:i2:3",
                  "label": "Borda clara abaixo da mancha",
                  "x": 0.4375,
                  "y": 0.5417,
                  "width": 0.1,
                  "height": 0.0833
                },
                {
                  "id": "region:rtg-2026:m29:aula-06:i2:4",
                  "label": "Forma clara dentro do campo",
                  "x": 0.6531,
                  "y": 0.3917,
                  "width": 0.0813,
                  "height": 0.2167
                },
                {
                  "id": "region:rtg-2026:m29:aula-06:i2:5",
                  "label": "Contorno tracejado fora do campo",
                  "x": 0.8656,
                  "y": 0.3917,
                  "width": 0.0813,
                  "height": 0.2167
                }
              ],
              "correctRegionIds": [
                "region:rtg-2026:m29:aula-06:i2:1"
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-06:i3",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Conversa: Dona Zuleica está aflita antes do exame. Ajude-a, sem prometer o que não é seu."
            },
            "help": "Responda com o que a equipe já orientou, sem prometer o que não é seu.",
            "type": "conversation",
            "feedback": {
              "correct": "Isso mesmo: você explicou o ruído e a campainha, e deixou a duração com a tecnóloga.",
              "incorrect": "Reveja a conversa: explique o que a equipe orientou, não prometa duração nem resultado e lembre a campainha."
            },
            "payload": {
              "prompt": "Dona Zuleica está aflita antes do exame. Ajude-a, sem prometer o que não é seu.",
              "speaker": "paciente",
              "name": "Dona Zuleica",
              "turns": [
                {
                  "id": "turn:rtg-2026:m29:aula-06:i3:1",
                  "line": "Esse barulho todo não faz mal? Dizem que o aparelho é bem alto.",
                  "options": [
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:1a",
                      "label": "É só um barulhinho que você nem vai notar, fique calma.",
                      "reply": "Nem vou notar? Mas me disseram que é alto."
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:1b",
                      "label": "Pode ser alto, por isso há proteção para os ouvidos.",
                      "reply": "Ah, então tem protetor. Isso me deixa mais calma."
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:1c",
                      "label": "Você se acostuma em poucos minutos, é só ignorar.",
                      "reply": "Poucos minutos? Eu não sei se consigo me acostumar."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m29:aula-06:i3:1b"
                },
                {
                  "id": "turn:rtg-2026:m29:aula-06:i3:2",
                  "line": "E quanto tempo eu vou ficar parada lá dentro?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:2a",
                      "label": "A tecnóloga diz a duração, vou chamá-la.",
                      "reply": "Está bem, prefiro saber por ela mesma."
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:2b",
                      "label": "Dez minutinhos, eu prometo que passa rápido.",
                      "reply": "Dez minutos só? Tomara que seja isso mesmo."
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:2c",
                      "label": "Depende de você: se ficar quieta, acaba logo.",
                      "reply": "Depende de mim? Agora fiquei com mais medo."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m29:aula-06:i3:2a"
                },
                {
                  "id": "turn:rtg-2026:m29:aula-06:i3:3",
                  "line": "E se eu não aguentar ficar parada?",
                  "options": [
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:3a",
                      "label": "Aguente até o fim, depois a gente conversa.",
                      "reply": "Até o fim? E se eu passar mal?"
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:3b",
                      "label": "Mexa só um pouco, a imagem se arruma depois.",
                      "reply": "Posso me mexer, então? Pensei que não pudesse."
                    },
                    {
                      "id": "option:rtg-2026:m29:aula-06:i3:3c",
                      "label": "Aperte a campainha, a equipe vem até você.",
                      "reply": "Ah, tem uma campainha. Vou segurar com firmeza."
                    }
                  ],
                  "correctOptionId": "option:rtg-2026:m29:aula-06:i3:3c"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-06:i4",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-06"
            ],
            "evidenceKind": "guided-practice",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Associação: Ligue cada dúvida do paciente ao que você faz, como ensinado nesta aula."
            },
            "help": "Separe o que você pode explicar do que precisa levar à equipe.",
            "type": "matching",
            "feedback": {
              "correct": "Isso mesmo: o que a equipe já orientou você explica, e o resto vai para a tecnóloga.",
              "incorrect": "Confira de novo: o ruído tem proteção, a duração é da tecnóloga, a aflição pede a campainha e a imagem é da equipe."
            },
            "payload": {
              "prompt": "Ligue cada dúvida do paciente ao que você faz, como ensinado nesta aula.",
              "pairs": [
                {
                  "id": "pair:rtg-2026:m29:aula-06:i4:1",
                  "left": "Medo do barulho",
                  "right": "Explica que há proteção para os ouvidos"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-06:i4:2",
                  "left": "Pergunta sobre a duração",
                  "right": "Leva a pergunta à tecnóloga"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-06:i4:3",
                  "left": "Aflição com lugar fechado",
                  "right": "Lembra a campainha e avisa a equipe"
                },
                {
                  "id": "pair:rtg-2026:m29:aula-06:i4:4",
                  "left": "Quer saber o que a imagem mostra",
                  "right": "Diz que a equipe responsável fala sobre a imagem"
                }
              ]
            }
          }
        },
        {
          "kind": "interaction",
          "interaction": {
            "id": "interaction:rtg-2026:m29:aula-06:i5",
            "competencyIds": [
              "competency:rtg-2026:m29:aula-06"
            ],
            "evidenceKind": "applied-transfer",
            "completionRule": "confirmed",
            "criticalSafety": false,
            "accessibility": {
              "label": "Certo ou errado: Seu Otávio, em simulação, diz que é a primeira vez e que ficou aflito num exame anterior. Julgue cada afirmação."
            },
            "help": "Pergunte de cada frase: é levar à equipe ou é prometer algo?",
            "type": "true-false",
            "feedback": {
              "correct": "Você ouviu, lembrou a campainha e não prometeu o que não é seu.",
              "incorrect": "Releia o conceito: você explica o que a equipe orientou, leva a aflição à tecnóloga e não promete."
            },
            "payload": {
              "prompt": "Seu Otávio, em simulação, diz que é a primeira vez e que ficou aflito num exame anterior. Julgue cada afirmação.",
              "statements": [
                {
                  "id": "statement:rtg-2026:m29:aula-06:i5:1",
                  "text": "Você escuta a aflição dele e a leva à tecnóloga antes de começar.",
                  "isTrue": true,
                  "explanation": "Certo: levar a aflição à equipe antes da série deixa a equipe preparada."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-06:i5:2",
                  "text": "Você garante que desta vez ele não vai sentir nada.",
                  "isTrue": false,
                  "explanation": "Errado: prometer ausência de desconforto não é seu e pode ser falso."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-06:i5:3",
                  "text": "Você lembra que a campainha chama a equipe se ele precisar.",
                  "isTrue": true,
                  "explanation": "Certo: a campainha é o meio de ele chamar a equipe durante a série."
                },
                {
                  "id": "statement:rtg-2026:m29:aula-06:i5:4",
                  "text": "Você diz que pode se mexer à vontade, pois a imagem se corrige depois.",
                  "isTrue": false,
                  "explanation": "Errado: mexer borra a imagem, e a imagem não se corrige sozinha depois."
                }
              ]
            }
          }
        },
        {
          "kind": "presentation",
          "id": "step:rtg-2026:m29:aula-06:fecho",
          "role": "closing",
          "payload": {
            "title": "Você prepara quem entra no túnel",
            "body": "Agora você explica ao paciente o ruído e a proteção, a importância de ficar parado e a campainha, sem prometer duração nem resultado. E leva à tecnóloga o que ele perguntar além disso.",
            "tone": "positive",
            "dialogue": {
              "lines": [
                {
                  "speaker": "lia",
                  "text": "Preparar é explicar o que se sabe e passar adiante o resto."
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "checkpoint": {
    "id": "checkpoint:rtg-2026:m29",
    "targetScoreBasisPoints": 8000,
    "items": [
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-01:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-01"
        ],
        "prompt": "No esquema, o tecido azul tem a curva lenta nos dois gráficos: sobe devagar à esquerda e cai devagar à direita. Que par de tempos combina com ele?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-01:c1:a",
            "label": "T1 longo e T2 longo"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c1:b",
            "label": "T1 curto e T2 curto"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c1:c",
            "label": "T1 longo e T2 curto"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c1:d",
            "label": "T1 curto e T2 longo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-01:c1:a",
        "feedback": {
          "correct": "Subir devagar é T1 longo e cair devagar é T2 longo: é o par do líquido no esquema.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-01:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-01"
        ],
        "prompt": "No esquema, o tecido amarelo chega cedo ao patamar da esquerda e perde o sinal cedo no gráfico da direita. Que leitura combina com ele?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-01:c2:a",
            "label": "T1 e T2 mais longos que os do tecido azul"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c2:b",
            "label": "T1 e T2 mais curtos que os do tecido azul"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c2:c",
            "label": "T1 mais curto e T2 mais longo que os do azul"
          },
          {
            "id": "option:rtg-2026:m29:aula-01:c2:d",
            "label": "T1 mais longo e T2 mais curto que os do azul"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-01:c2:b",
        "feedback": {
          "correct": "Recuperação rápida é T1 curto e queda rápida é T2 curto, os dois menores que os do azul.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-02:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-02"
        ],
        "prompt": "Na linha do tempo, a chave que vai do primeiro pulso ao pulso seguinte marca o quê?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-02:c1:a",
            "label": "O TE, o intervalo até o eco"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c1:b",
            "label": "O T1 do tecido, o tempo de recuperação"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c1:c",
            "label": "O TR, o intervalo entre dois pulsos"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c1:d",
            "label": "A duração do eco, do começo ao fim dele"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-02:c1:c",
        "feedback": {
          "correct": "A chave de pulso a pulso é o TR.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-02:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-02"
        ],
        "prompt": "Duda mediu, na figura, a distância do eco até o pulso seguinte e chamou de TE. O que está errado?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-02:c2:a",
            "label": "Nada: o TE mede justamente o que sobra depois do eco"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c2:b",
            "label": "O certo seria chamar essa distância de T1, tempo do tecido"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c2:c",
            "label": "O certo seria medir o TE de pulso a pulso, como o TR"
          },
          {
            "id": "option:rtg-2026:m29:aula-02:c2:d",
            "label": "O TE conta a partir do pulso e termina no centro do eco"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-02:c2:d",
        "feedback": {
          "correct": "O TE parte do pulso de excitação e termina no centro do eco, e não depois dele.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-03:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-03"
        ],
        "prompt": "Numa imagem da cabeça, os ventrículos estão claros e a substância branca é mais escura que a cinzenta. Que ponderação combina?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-03:c1:a",
            "label": "Em T1, pois o líquido é claro"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c1:b",
            "label": "Em T2, pois o líquido é claro"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c1:c",
            "label": "Líquido suprimido, pois a branca é escura"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c1:d",
            "label": "Nenhuma: só a gordura revela a ponderação"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-03:c1:b",
        "feedback": {
          "correct": "Líquido claro com a branca mais escura que a cinzenta combina com a ponderação em T2.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ucsd-fmri-estrutural"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-03:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-03"
        ],
        "prompt": "Numa imagem da cabeça, o líquido é escuro e a gordura do couro cabeludo é clara. O que mais se espera para combinar com a ponderação em T1?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-03:c2:a",
            "label": "Ventrículos claros como o couro cabeludo"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c2:b",
            "label": "Substância branca mais escura que a cinzenta"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c2:c",
            "label": "Substância branca mais clara que a cinzenta"
          },
          {
            "id": "option:rtg-2026:m29:aula-03:c2:d",
            "label": "Líquido claro em todas as regiões"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-03:c2:c",
        "feedback": {
          "correct": "Na T1 a branca é mais clara que a cinzenta.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ucsd-fmri-estrutural"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-04:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-04"
        ],
        "prompt": "Numa imagem com supressão de gordura, a gordura sob a pele aparece escura. O que isso mostra?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-04:c1:a",
            "label": "Que falta gordura no paciente nessa região"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c1:b",
            "label": "Que há metal perto da região examinada"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c1:c",
            "label": "Que o paciente se mexeu durante a série"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c1:d",
            "label": "Que o sinal da gordura foi apagado, como esperado"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-04:c1:d",
        "feedback": {
          "correct": "A supressão apaga o sinal da gordura, e ela fica escura.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:ridgway-2010-fisica-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-04:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-04"
        ],
        "prompt": "Em que situação a supressão de gordura pode falhar numa região?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-04:c2:a",
            "label": "Quando há metal perto, que distorce o campo"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c2:b",
            "label": "Quando o paciente respira devagar"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c2:c",
            "label": "Quando o TE é alongado em demasia"
          },
          {
            "id": "option:rtg-2026:m29:aula-04:c2:d",
            "label": "Quando a bobina está bem posicionada"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-04:c2:a",
        "feedback": {
          "correct": "Metal perto distorce o campo, e a supressão pode falhar ali.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
          "source:rtg-2026:m29:krupa-2015-artefatos-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-05:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-05"
        ],
        "prompt": "Numa série de abdome, uma forma clara aparece por cima da borda do corpo, com o contorno exato do braço que ficou fora do campo de visão, do outro lado. O que você descreve à tecnóloga?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-05:c1:a",
            "label": "Que a paciente mexeu o braço durante a série"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c1:b",
            "label": "Que há um objeto de metal junto da borda do corpo"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c1:c",
            "label": "Que a forma repete o braço de fora do campo, no lado oposto"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c1:d",
            "label": "Nada, porque a forma faz parte da anatomia do abdome"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-05:c1:c",
        "feedback": {
          "correct": "Descrever a forma e de onde ela vem dá à equipe a marca da dobra; a decisão sobre a série é dela.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:krupa-2015-artefatos-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-05:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-05"
        ],
        "prompt": "Uma série mostra uma mancha preta de borda clara que ninguém esperava. O que você faz primeiro?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-05:c2:a",
            "label": "Repete a série com outro campo de visão"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c2:b",
            "label": "Anota \"artefato de movimento\" e segue"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c2:c",
            "label": "Pergunta ao paciente se ele escondeu algo"
          },
          {
            "id": "option:rtg-2026:m29:aula-05:c2:d",
            "label": "Para e descreve a marca e o lugar à equipe"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-05:c2:d",
        "feedback": {
          "correct": "Marca inesperada de metal pede parar e avisar a equipe.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:krupa-2015-artefatos-rm",
          "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-06:c1",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-06"
        ],
        "prompt": "Um paciente pergunta quanto tempo a série vai durar. Qual resposta cabe a você?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-06:c1:a",
            "label": "Dizer que a tecnóloga informa a duração e chamá-la"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c1:b",
            "label": "Dizer um tempo aproximado para tranquilizar"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c1:c",
            "label": "Dizer que só depende de ele ficar quieto"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c1:d",
            "label": "Dizer que não vale a pena saber o tempo"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-06:c1:a",
        "feedback": {
          "correct": "A duração é informada pela tecnóloga, e você a chama.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:radiologyinfo-preparo-rm"
        ]
      },
      {
        "id": "checkpoint-item:rtg-2026:m29:aula-06:c2",
        "competencyIds": [
          "competency:rtg-2026:m29:aula-06"
        ],
        "prompt": "O que ficar parado ajuda a evitar na imagem?",
        "options": [
          {
            "id": "option:rtg-2026:m29:aula-06:c2:a",
            "label": "A mancha preta que o metal costuma deixar"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c2:b",
            "label": "O borramento e as cópias fracas do movimento"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c2:c",
            "label": "A dobra de anatomia de fora do campo"
          },
          {
            "id": "option:rtg-2026:m29:aula-06:c2:d",
            "label": "O ruído que o aparelho produz durante a série"
          }
        ],
        "correctOptionId": "option:rtg-2026:m29:aula-06:c2:b",
        "feedback": {
          "correct": "Mexer borra a imagem e cria cópias fracas, e ficar parado ajuda a evitá-los.",
          "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
        },
        "sourceIds": [
          "source:rtg-2026:m29:radiologyinfo-preparo-rm",
          "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
          "source:rtg-2026:m29:krupa-2015-artefatos-rm"
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
      "claimId": "interaction:rtg-2026:m29:aula-01:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-01:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-01:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-01:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-01:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-01:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-01:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-01:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-01:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-01:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-01:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-01:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-01:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-01:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-01:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-01:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-01:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-01:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-01:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-01:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-01:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-01:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-01:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-01:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rg:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-01:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-01:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-02:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-02:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-02:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-02:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-02:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-02:i3:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-02:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-02:i3:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m29:aula-02:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m29:aula-02:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "token:rtg-2026:m29:aula-02:i4:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "token:rtg-2026:m29:aula-02:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m29:aula-02:i4:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "token:rtg-2026:m29:aula-02:i4:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i5:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-02:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-02:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-02:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-02:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-02:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rt:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-02:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-02:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-03:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-03:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-03:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-03:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-03:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-03:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-03:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-03:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-03:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-03:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-03:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i4:f",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i5:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i5:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:i5:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-03:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:mrimaster-liquido-suprimido",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-03:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-03:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-03:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:mrimaster-liquido-suprimido"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c2:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-03:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rg:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-03:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-03:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m29:aula-04:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "blank:rtg-2026:m29:aula-04:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "token:rtg-2026:m29:aula-04:i2:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m29:aula-04:i2:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m29:aula-04:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "token:rtg-2026:m29:aula-04:i2:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "token:rtg-2026:m29:aula-04:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-04:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-04:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-04:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-04:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-04:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-04:i4:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-04:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-04:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:i5:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-04:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-04:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-04:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-04:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm",
        "source:rtg-2026:m29:ucsd-fmri-estrutural",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c2:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-04:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:ridgway-2010-fisica-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rt:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-04:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-04:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i1:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-05:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-05:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-05:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-05:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "point:rtg-2026:m29:aula-05:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-05:i2:2",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-05:i2:4",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-05:i2:5",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-05:i2:1",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "label:rtg-2026:m29:aula-05:i2:3",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-05:i3:a",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-05:i3:b",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "group:rtg-2026:m29:aula-05:i3:c",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-05:i3:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-05:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-05:i3:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-05:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "item:rtg-2026:m29:aula-05:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i3:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:3",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:5",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:6",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-05:i4:7",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i5:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i5:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i5:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i5:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:i5:e",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-05:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-05:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-05:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-05:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c1:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c2:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:c2:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-05:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rg:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rg:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rt:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-05:rt:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-05:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i1:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i1:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-06:i2:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-06:i2:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-06:i2:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-06:i2:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "region:rtg-2026:m29:aula-06:i2:5",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i2:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i3:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "turn:rtg-2026:m29:aula-06:i3:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:1a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:1b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:1c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m29:aula-06:i3:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:2a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:2b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:2c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "turn:rtg-2026:m29:aula-06:i3:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:3a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:3b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:i3:3c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i3:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i3:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i4:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-06:i4:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-06:i4:2",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-06:i4:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "pair:rtg-2026:m29:aula-06:i4:4",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i4:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i4:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i4:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i5:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-06:i5:1",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-06:i5:2",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-06:i5:3",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "statement:rtg-2026:m29:aula-06:i5:4",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i5:answer",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i5:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "interaction:rtg-2026:m29:aula-06:i5:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-06:abertura:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-06:conceito:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "step:rtg-2026:m29:aula-06:fecho:presentation",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c1:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c1:a",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c1:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c1:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c1:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c1:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c1:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c2:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c2:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c2:b",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c2:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:c2:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c2:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "checkpoint-item:rtg-2026:m29:aula-06:c2:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm",
        "source:rtg-2026:m29:radiologyinfo-rm-cabeca",
        "source:rtg-2026:m29:krupa-2015-artefatos-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:guiada:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rg:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rg:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rg:c",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rg:d",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:guiada:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:guiada:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:transferencia:prompt",
      "claimKind": "prompt",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rt:a",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rt:b",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rt:c",
      "claimKind": "distractor",
      "provenanceKind": "authorial-distractor",
      "sourceIds": []
    },
    {
      "claimId": "option:rtg-2026:m29:aula-06:rt:d",
      "claimKind": "correct-answer",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:transferencia:feedback:correct",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    },
    {
      "claimId": "recovery-item:rtg-2026:m29:aula-06:transferencia:feedback:incorrect",
      "claimKind": "feedback",
      "provenanceKind": "source-backed",
      "sourceIds": [
        "source:rtg-2026:m29:radiologyinfo-preparo-rm"
      ]
    }
  ],
  "wide": {
    "schemaVersion": 1,
    "namespace": "rtg-2026",
    "recovery": [
      {
        "competencyId": "competency:rtg-2026:m29:aula-01",
        "hook": "Complete a frase: se a curva do gráfico sobe até o topo, ela mostra a ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-01:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-01"
          ],
          "prompt": "Num gráfico, a curva sobe até um patamar. O que ela mostra?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-01:rg:a",
              "label": "A perda do sinal transversal, descrita pelo T2"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rg:b",
              "label": "A frequência do pulso de radiofrequência"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rg:c",
              "label": "O ruído que as bobinas de gradiente produzem"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rg:d",
              "label": "A recuperação da magnetização longitudinal (T1)"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-01:rg:d",
          "feedback": {
            "correct": "Curva que sobe mostra a recuperação da magnetização longitudinal, e o tempo dela é o T1.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ridgway-2010-fisica-rm"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-01:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-01"
          ],
          "prompt": "Um texto de divulgação diz: \"quanto maior o T2, mais rápido o sinal some\". Que correção deixa a frase fiel à aula?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-01:rt:a",
              "label": "Quanto maior o T2, mais rápido o tecido se recupera"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rt:b",
              "label": "Quanto maior o T1, mais rápido o sinal some"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rt:c",
              "label": "Quanto maior o T2, mais devagar o sinal some"
            },
            {
              "id": "option:rtg-2026:m29:aula-01:rt:d",
              "label": "A frase está correta como foi escrita"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-01:rt:c",
          "feedback": {
            "correct": "T2 longo é curva que cai devagar: o sinal transversal dura mais.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ridgway-2010-fisica-rm"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m29:aula-02",
        "hook": "Complete a frase: o TE começa no pulso e termina no ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-02:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-02"
          ],
          "prompt": "Qual ponto da linha do tempo fecha o TE?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-02:rg:a",
              "label": "O pulso seguinte"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rg:b",
              "label": "O centro do eco"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rg:c",
              "label": "O primeiro pulso"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rg:d",
              "label": "O fim do patamar de recuperação"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-02:rg:b",
          "feedback": {
            "correct": "O TE vai do pulso ao centro do eco.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ridgway-2010-fisica-rm"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-02:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-02"
          ],
          "prompt": "Uma colega diz: \"se o eco vier mais tarde depois do pulso, o intervalo que cresce é o TR\". Que correção cabe?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-02:rt:a",
              "label": "Cresce o TE; o TR continua sendo entre pulsos"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rt:b",
              "label": "Nada: quando o eco demora, o TR é que cresce"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rt:c",
              "label": "Cresce o T1, pois o tecido demora mais a se recuperar"
            },
            {
              "id": "option:rtg-2026:m29:aula-02:rt:d",
              "label": "Crescem o TE e o TR, os dois no mesmo tanto"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-02:rt:a",
          "feedback": {
            "correct": "O eco mais tarde alonga o intervalo do pulso até o eco, o TE. O TR continua sendo de pulso a pulso.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ridgway-2010-fisica-rm"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m29:aula-03",
        "hook": "Complete a frase: numa imagem ponderada em T2, o líquido dos ventrículos aparece ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-03:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-03"
          ],
          "prompt": "Como aparece o líquido dos ventrículos numa imagem ponderada em T2?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-03:rg:a",
              "label": "Claro, brilhante"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rg:b",
              "label": "Escuro, como na T1"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rg:c",
              "label": "Ausente da imagem"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rg:d",
              "label": "Igual à substância cinzenta"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-03:rg:a",
          "feedback": {
            "correct": "Na ponderação em T2 o líquido é claro.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ucsd-fmri-estrutural"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-03:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-03"
          ],
          "prompt": "Num corte da coluna, o líquido dentro do canal aparece claro. Que ponderação combina?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-03:rt:a",
              "label": "Em T1, que deixa o líquido claro"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rt:b",
              "label": "Com líquido suprimido, que deixa o líquido claro"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rt:c",
              "label": "Não dá para dizer: cada região muda a regra"
            },
            {
              "id": "option:rtg-2026:m29:aula-03:rt:d",
              "label": "Em T2, que deixa o líquido claro"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-03:rt:d",
          "feedback": {
            "correct": "Líquido claro combina com a ponderação em T2.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ucsd-fmri-estrutural"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m29:aula-04",
        "hook": "Complete a frase: com a supressão de gordura, a gordura sob a pele fica ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-04:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-04"
          ],
          "prompt": "Como aparece a gordura sob a pele numa imagem com supressão de gordura?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-04:rg:a",
              "label": "Clara, mais do que na imagem sem supressão"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rg:b",
              "label": "Duplicada do lado oposto da imagem"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rg:c",
              "label": "Escura, pois o sinal dela foi apagado"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rg:d",
              "label": "Sem mudança em relação à imagem sem supressão"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-04:rg:c",
          "feedback": {
            "correct": "A supressão apaga o sinal da gordura, e ela escurece.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:ridgway-2010-fisica-rm"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-04:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-04"
          ],
          "prompt": "Em outra região, numa série com supressão, uma faixa clara de gordura aparece colada a um clipe. O que descrever à equipe?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-04:rt:a",
              "label": "Que a gordura do paciente aumentou nessa região"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rt:b",
              "label": "A faixa clara, o clipe e a falha provável"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rt:c",
              "label": "Que o clipe é seguro, porque a imagem saiu"
            },
            {
              "id": "option:rtg-2026:m29:aula-04:rt:d",
              "label": "Que a série deve ser refeita com outro ajuste"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-04:rt:b",
          "feedback": {
            "correct": "Descrever a faixa, o clipe e a possível falha dá à equipe o que ela precisa.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:pmc-artefatos-de-metal-2024",
            "source:rtg-2026:m29:krupa-2015-artefatos-rm"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m29:aula-05",
        "hook": "Complete a frase: junto ao vazio de sinal do metal, a borda aparece ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-05:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-05"
          ],
          "prompt": "No esquema do metal, como aparece a borda junto ao vazio de sinal?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-05:rg:a",
              "label": "Escura e reta, igual ao vazio de sinal"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rg:b",
              "label": "Clara e torta, com sinal acumulado"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rg:c",
              "label": "Repetida em cópias fracas pelo corte"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rg:d",
              "label": "Deslocada para o lado oposto da imagem"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-05:rg:b",
          "feedback": {
            "correct": "O metal tira o sinal de um ponto e acumula sinal ao lado: a borda fica clara e torta.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-05:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-05"
          ],
          "prompt": "Um texto diz: \"fantasmas na imagem indicam metal no corpo do paciente\". Que correção deixa a frase fiel à aula?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-05:rt:a",
              "label": "Nada: fantasmas e metal são a mesma marca"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rt:b",
              "label": "Fantasmas combinam com dobra, e não com metal"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rt:c",
              "label": "Fantasmas são de movimento; metal deixa vazio de sinal"
            },
            {
              "id": "option:rtg-2026:m29:aula-05:rt:d",
              "label": "Fantasmas indicam sempre que o paciente tem implante"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-05:rt:c",
          "feedback": {
            "correct": "Fantasmas são de movimento. O metal deixa vazio de sinal com distorção.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:krupa-2015-artefatos-rm",
            "source:rtg-2026:m29:pmc-artefatos-de-metal-2024"
          ]
        }
      },
      {
        "competencyId": "competency:rtg-2026:m29:aula-06",
        "hook": "Complete a frase: se o paciente sente aflição com lugar fechado, ele pode chamar a equipe pela ...",
        "guided": {
          "id": "recovery-item:rtg-2026:m29:aula-06:guiada",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-06"
          ],
          "prompt": "Um paciente diz que tem medo de lugar fechado. Qual meio ele tem para chamar a equipe durante a série?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-06:rg:a",
              "label": "O protetor auricular, que abafa o barulho"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rg:b",
              "label": "A bobina, que fica junto do corpo"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rg:c",
              "label": "A campainha, que fica na mão dele"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rg:d",
              "label": "A porta da sala, que ele pode abrir"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-06:rg:c",
          "feedback": {
            "correct": "A campainha na mão do paciente chama a equipe.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:radiologyinfo-preparo-rm"
          ]
        },
        "transfer": {
          "id": "recovery-item:rtg-2026:m29:aula-06:transferencia",
          "competencyIds": [
            "competency:rtg-2026:m29:aula-06"
          ],
          "prompt": "Uma criança, em simulação, pergunta se o exame dói. Qual resposta cabe a você?",
          "options": [
            {
              "id": "option:rtg-2026:m29:aula-06:rt:a",
              "label": "Garantir que não vai doer nada, para ela relaxar"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rt:b",
              "label": "Dizer que ela precisa ser corajosa e ficar quieta"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rt:c",
              "label": "Responder que depende do resultado da imagem dela"
            },
            {
              "id": "option:rtg-2026:m29:aula-06:rt:d",
              "label": "Explicar o que se sabe e levar o resto à tecnóloga"
            }
          ],
          "correctOptionId": "option:rtg-2026:m29:aula-06:rt:d",
          "feedback": {
            "correct": "Explicar o que se sabe e levar o resto à tecnóloga é o que cabe a você.",
            "incorrect": "Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula."
          },
          "sourceIds": [
            "source:rtg-2026:m29:radiologyinfo-preparo-rm"
          ]
        }
      }
    ],
    "images": [
      {
        "id": "image:rtg-2026:m29:rm-ponderacoes-encefalo-01",
        "file": "radiant-app/assets/content/rtg-2026/imagens/m29/rm-ponderacoes-encefalo-01.jpg",
        "sourcePage": "https://github.com/andersonsmelo/Radiant/blob/main/docs/evidence/2026-11-19-figuras/imagens-vps.md",
        "author": "Anderson Melo, acervo próprio, anonimizado",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "retrievedAt": "2026-11-22",
        "sha256Original": "c1460a3ab86633836c0365e5e76587ec6aba4383c79cf660b88bacabf00c7079",
        "sha256Asset": "c1460a3ab86633836c0365e5e76587ec6aba4383c79cf660b88bacabf00c7079",
        "modification": "o T2 axial é a imagem nativa; o T1 e o FLAIR, adquiridos em volume no plano sagital, foram reformatados (MPR, interpolação linear) no plano exato do corte do T2; recorte centrado na cabeça em cada painel, janela por percentis (0,5 a 99,7) em cada painel, redução para 1200 x 424 e conversão para JPEG em tons de cinza; sem retoque",
        "alt": "Três imagens de ressonância magnética de um mesmo corte axial da cabeça, lado a lado, em tons de cinza sobre fundo preto, com brilhos diferentes entre as três.",
        "width": 1200,
        "height": 424
      },
      {
        "id": "image:rtg-2026:m29:rm-supressao-gordura-01",
        "file": "radiant-app/assets/content/rtg-2026/imagens/m29/rm-supressao-gordura-01.jpg",
        "sourcePage": "https://github.com/andersonsmelo/Radiant/blob/main/docs/evidence/2026-11-19-figuras/imagens-vps.md",
        "author": "Anderson Melo, acervo próprio, anonimizado",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "retrievedAt": "2026-11-22",
        "sha256Original": "1556193fd930bee412cec4bb7cbf6ddcdb04e8ceac41a87035e638092dca0728",
        "sha256Asset": "1556193fd930bee412cec4bb7cbf6ddcdb04e8ceac41a87035e638092dca0728",
        "modification": "imagens nativas, sem reformatação; mesmo recorte nas duas, janela de 0 ao percentil 99,5 em cada painel, redução para 1200 x 434 e conversão para JPEG em tons de cinza; sem retoque",
        "alt": "Duas imagens de ressonância magnética de um mesmo corte axial do abdome superior, lado a lado, em tons de cinza sobre fundo preto, com brilhos diferentes em alguns tecidos.",
        "width": 1200,
        "height": 434
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
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    },
    {
      "schemaVersion": 1,
      "gate": "editorial",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    },
    {
      "schemaVersion": 1,
      "gate": "accessibility",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    },
    {
      "schemaVersion": 1,
      "gate": "rights",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    },
    {
      "schemaVersion": 1,
      "gate": "schema",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    },
    {
      "schemaVersion": 1,
      "gate": "product",
      "decision": "approved",
      "reviewerRole": "ai-review-delegated",
      "reviewerRef": "claude-fable-5.1:ADR-2026-11-05",
      "decidedAt": "2026-11-06T00:00:00.000Z",
      "materialSha256": "420a17ee802e4b1cbd65fc38a6e1a957114942653b17b71486c951875247bea3"
    }
  ],
  "promotedAt": "2026-11-06T00:00:00.000Z",
  "promotionRef": "ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla"
};
