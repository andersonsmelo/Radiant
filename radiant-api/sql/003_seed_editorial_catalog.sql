-- AUTO-GENERATED — do not edit by hand.
-- Source: conteúdo/governança/catalog-payload.json
-- Run: node scripts/content/sync-catalog-to-api.mjs

update content_lessons
set is_published = false,
    updated_at = now()
where id in ('lesson-1', 'lesson-2');

update content_tracks
set is_published = false,
    updated_at = now()
where id in ('track-radiology-foundations');

insert into content_tracks (
    id,
    slug,
    title,
    description,
    sort_order,
    is_published
)
values (
    'track-ai-fundamentos',
    'ai-fundamentos-de-radiologia',
    'Fundamentos de Radiologia (IA)',
    '16 conceitos essenciais de radiologia gerados pelo Radiant AI, ordenados por sequência de aprendizagem.',
    1,
    true
)
on conflict (id) do update set
    slug = excluded.slug,
    title = excluded.title,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published,
    updated_at = now();

insert into content_lessons (
    id,
    track_id,
    slug,
    title,
    difficulty,
    sort_order,
    content_version,
    payload,
    is_published
)
values
(
    'ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia',
    'track-ai-fundamentos',
    'profissao-e-atuacao-do-tecnico-em-radiologia',
    'Quiz: Profissão e atuação do técnico em radiologia',
    'beginner',
    1,
    '1.0.0',
    $lesson_1${
  "id": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia",
  "title": "Quiz: Profissão e atuação do técnico em radiologia",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia:q1",
      "type": "multiple-choice",
      "prompt": "Qual órgão regulamenta o exercício da profissão de técnico em radiologia no Brasil?",
      "options": [
        {
          "label": "CONTER — Conselho Federal de Técnicos em Radiologia"
        },
        {
          "label": "CFM — Conselho Federal de Medicina"
        },
        {
          "label": "ANVISA — Agência Nacional de Vigilância Sanitária"
        },
        {
          "label": "CRM — Conselho Regional de Medicina"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O CONTER é o órgão de classe que registra, fiscaliza e regulamenta o exercício profissional dos técnicos em radiologia em todo o território brasileiro, sendo o registro obrigatório para atuação legal."
    },
    {
      "id": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia:q2",
      "type": "multiple-choice",
      "prompt": "Qual das seguintes atividades está dentro das atribuições do técnico em radiologia?",
      "options": [
        {
          "label": "Selecionar parâmetros técnicos e posicionar o paciente para o exame"
        },
        {
          "label": "Interpretar e assinar laudos radiológicos"
        },
        {
          "label": "Prescrever exames de imagem ao paciente"
        },
        {
          "label": "Ajustar doses de medicamentos radioativos sem supervisão"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O técnico é responsável pela execução técnica do exame: posicionamento, seleção de parâmetros (kV, mAs), exposição e verificação da qualidade da imagem. A interpretação e o laudo são atribuições exclusivas do médico radiologista."
    }
  ]
}$lesson_1$::jsonb,
    true
),
(
    'ai-lesson:energia-e-materia',
    'track-ai-fundamentos',
    'energia-e-materia',
    'Quiz: Energia e matéria',
    'beginner',
    2,
    '1.0.0',
    $lesson_2${
  "id": "ai-lesson:energia-e-materia",
  "title": "Quiz: Energia e matéria",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:energia-e-materia:q1",
      "type": "multiple-choice",
      "prompt": "Como a energia de um fóton de raios X se relaciona com sua frequência?",
      "options": [
        {
          "label": "A energia é diretamente proporcional à frequência (E = hf)"
        },
        {
          "label": "A energia é inversamente proporcional à frequência"
        },
        {
          "label": "Energia e frequência não têm relação entre si"
        },
        {
          "label": "A energia depende apenas da intensidade do feixe"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Pela equação de Planck (E = hf), a energia do fóton é diretamente proporcional à sua frequência. Por isso, aumentar o kVp no equipamento eleva a energia dos fótons e aumenta o poder de penetração do feixe."
    },
    {
      "id": "ai-lesson:energia-e-materia:q2",
      "type": "multiple-choice",
      "prompt": "Qual tecido absorve MAIS energia de raios X, produzindo a região mais clara na imagem?",
      "options": [
        {
          "label": "Osso cortical"
        },
        {
          "label": "Tecido muscular"
        },
        {
          "label": "Gordura"
        },
        {
          "label": "Ar nos pulmões"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O osso cortical contém cálcio, um elemento de número atômico elevado (Z=20) que absorve intensamente os raios X pelo efeito fotoelétrico. Quanto maior a absorção, menos fótons atingem o detector, resultando em área mais clara (branca) na imagem final."
    }
  ]
}$lesson_2$::jsonb,
    true
),
(
    'ai-lesson:estrutura-da-materia-e-nucleo-atomico',
    'track-ai-fundamentos',
    'estrutura-da-materia-e-nucleo-atomico',
    'Quiz: Estrutura da matéria e núcleo atômico',
    'beginner',
    3,
    '1.0.0',
    $lesson_3${
  "id": "ai-lesson:estrutura-da-materia-e-nucleo-atomico",
  "title": "Quiz: Estrutura da matéria e núcleo atômico",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:estrutura-da-materia-e-nucleo-atomico:q1",
      "type": "multiple-choice",
      "prompt": "O que diferencia dois isótopos de um mesmo elemento químico?",
      "options": [
        {
          "label": "O número de nêutrons no núcleo"
        },
        {
          "label": "O número de prótons no núcleo"
        },
        {
          "label": "O número de elétrons nas camadas"
        },
        {
          "label": "A carga elétrica total do átomo"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Isótopos de um mesmo elemento têm igual número de prótons (mesmo Z, portanto mesmo elemento químico), mas diferem no número de nêutrons. Essa diferença no número de massa pode tornar o núcleo instável, dando origem a radioisótopos."
    },
    {
      "id": "ai-lesson:estrutura-da-materia-e-nucleo-atomico:q2",
      "type": "multiple-choice",
      "prompt": "Qual partícula do átomo determina o elemento químico ao qual ele pertence?",
      "options": [
        {
          "label": "Próton"
        },
        {
          "label": "Nêutron"
        },
        {
          "label": "Elétron"
        },
        {
          "label": "Fóton"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O número de prótons (número atômico, Z) é o que define o elemento químico. Alterar o número de prótons transforma o átomo em um elemento diferente — princípio que ocorre em reações nucleares como fissão e decaimento radioativo."
    }
  ]
}$lesson_3$::jsonb,
    true
),
(
    'ai-lesson:radioatividade-particulas-e-atividade',
    'track-ai-fundamentos',
    'radioatividade-particulas-e-atividade',
    'Quiz: Radioatividade, partículas e atividade',
    'beginner',
    4,
    '1.0.0',
    $lesson_4${
  "id": "ai-lesson:radioatividade-particulas-e-atividade",
  "title": "Quiz: Radioatividade, partículas e atividade",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:radioatividade-particulas-e-atividade:q1",
      "type": "multiple-choice",
      "prompt": "Qual tipo de radiação possui MENOR poder de penetração nos tecidos?",
      "options": [
        {
          "label": "Partícula alfa (α)"
        },
        {
          "label": "Partícula beta (β)"
        },
        {
          "label": "Radiação gama (γ)"
        },
        {
          "label": "Raios X de alta energia"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A partícula alfa, sendo um núcleo de hélio (2 prótons + 2 nêutrons), é grande, pesada e duplamente carregada. Perde energia rapidamente ao interagir com a matéria, sendo detida por alguns centímetros de ar ou por uma folha de papel. Apesar do baixo poder de penetração externo, é extremamente danosa se ingerida ou inalada."
    },
    {
      "id": "ai-lesson:radioatividade-particulas-e-atividade:q2",
      "type": "multiple-choice",
      "prompt": "Se um radioisótopo tem atividade inicial de 1000 MBq e meia-vida de 2 horas, qual será sua atividade após 6 horas?",
      "options": [
        {
          "label": "125 MBq"
        },
        {
          "label": "250 MBq"
        },
        {
          "label": "500 MBq"
        },
        {
          "label": "333 MBq"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Em 6 horas = 3 meias-vidas (3 × 2h). A atividade cai pela metade a cada meia-vida: 1000 → 500 → 250 → 125 MBq. O cálculo é A = A₀ × (1/2)^(t/T½) = 1000 × (1/2)³ = 125 MBq."
    }
  ]
}$lesson_4$::jsonb,
    true
),
(
    'ai-lesson:raios-x-descoberta-e-propriedades',
    'track-ai-fundamentos',
    'raios-x-descoberta-e-propriedades',
    'Quiz: Raios X: descoberta e propriedades',
    'beginner',
    5,
    '1.0.0',
    $lesson_5${
  "id": "ai-lesson:raios-x-descoberta-e-propriedades",
  "title": "Quiz: Raios X: descoberta e propriedades",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:raios-x-descoberta-e-propriedades:q1",
      "type": "multiple-choice",
      "prompt": "Quem descobriu os raios X e em que ano?",
      "options": [
        {
          "label": "Wilhelm Conrad Röntgen, em 1895"
        },
        {
          "label": "Marie Curie, em 1898"
        },
        {
          "label": "Henri Becquerel, em 1896"
        },
        {
          "label": "Thomas Edison, em 1897"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Wilhelm Conrad Röntgen descobriu os raios X em 8 de novembro de 1895, trabalhando com tubos de vácuo em Würzburg, Alemanha. Pela descoberta, recebeu o primeiro Prêmio Nobel de Física em 1901."
    },
    {
      "id": "ai-lesson:raios-x-descoberta-e-propriedades:q2",
      "type": "multiple-choice",
      "prompt": "Qual propriedade dos raios X é diretamente responsável pela formação da imagem radiológica?",
      "options": [
        {
          "label": "Penetração diferenciada conforme a densidade e número atômico do material"
        },
        {
          "label": "Propagação em linha reta no vácuo"
        },
        {
          "label": "Capacidade de causar fluorescência"
        },
        {
          "label": "Velocidade de propagação igual à da luz"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A imagem radiológica é formada porque diferentes tecidos absorvem quantidades distintas de raios X: ossos absorvem muito (aparecem claros), tecidos moles absorvem moderadamente (cinza) e ar absorve pouco (aparece escuro). Sem essa absorção diferenciada, não haveria contraste e, portanto, nenhuma imagem diagnóstica."
    }
  ]
}$lesson_5$::jsonb,
    true
),
(
    'ai-lesson:interacao-das-radiacoes-e-protecao-radiologica',
    'track-ai-fundamentos',
    'interacao-das-radiacoes-e-protecao-radiologica',
    'Quiz: Interação das radiações e proteção radiológica',
    'beginner',
    6,
    '1.0.0',
    $lesson_6${
  "id": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica",
  "title": "Quiz: Interação das radiações e proteção radiológica",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica:q1",
      "type": "multiple-choice",
      "prompt": "Qual interação dos raios X com a matéria predomina nas energias utilizadas em radiologia diagnóstica convencional?",
      "options": [
        {
          "label": "Efeito Compton"
        },
        {
          "label": "Efeito fotoelétrico"
        },
        {
          "label": "Produção de par"
        },
        {
          "label": "Espalhamento coerente (Rayleigh)"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O efeito Compton predomina nas energias diagnósticas (60-120 kVp) em tecidos moles. O fóton é deflectido, perde parte de sua energia e gera radiação espalhada, responsável pelo ruído na imagem e pela maior parte da dose absorvida pelo paciente."
    },
    {
      "id": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica:q2",
      "type": "multiple-choice",
      "prompt": "Um técnico está a 1 metro da fonte de radiação e recebe uma taxa de dose de 4 mSv/h. Se ele se afastar para 2 metros, qual será a taxa de dose recebida?",
      "options": [
        {
          "label": "1 mSv/h"
        },
        {
          "label": "2 mSv/h"
        },
        {
          "label": "0,5 mSv/h"
        },
        {
          "label": "3 mSv/h"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Pela lei do inverso do quadrado da distância, a dose é inversamente proporcional ao quadrado da distância. Dobrando a distância (de 1 para 2 metros), a dose é dividida por 2² = 4. Portanto: 4 mSv/h ÷ 4 = 1 mSv/h."
    }
  ]
}$lesson_6$::jsonb,
    true
),
(
    'ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear',
    'track-ai-fundamentos',
    'aplicacoes-radioisotopicas-e-medicina-nuclear',
    'Quiz: Aplicações radioisotópicas e medicina nuclear',
    'beginner',
    7,
    '1.0.0',
    $lesson_7${
  "id": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear",
  "title": "Quiz: Aplicações radioisotópicas e medicina nuclear",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear:q1",
      "type": "multiple-choice",
      "prompt": "Qual a principal vantagem da medicina nuclear em relação à radiologia convencional?",
      "options": [
        {
          "label": "Avalia função e metabolismo dos órgãos, não apenas anatomia"
        },
        {
          "label": "Fornece imagens com maior resolução espacial"
        },
        {
          "label": "Não utiliza radiação ionizante"
        },
        {
          "label": "É mais rápida e barata que a radiografia convencional"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A medicina nuclear usa traçadores que participam de processos metabólicos, permitindo visualizar função (fluxo sanguíneo, metabolismo glicídico, atividade óssea). Uma lesão que ainda não alterou a anatomia detectável por raios X já pode ser identificada pela medicina nuclear."
    },
    {
      "id": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear:q2",
      "type": "multiple-choice",
      "prompt": "Por que o Tecnécio-99m é o radioisótopo mais utilizado em diagnóstico por medicina nuclear?",
      "options": [
        {
          "label": "Meia-vida curta (6h) e emissão exclusiva de gama de 140 keV, ideal para detecção externa"
        },
        {
          "label": "Alta atividade e meia-vida longa, garantindo tempo para os exames"
        },
        {
          "label": "Emite partículas alfa, que têm alto poder ionizante nos tecidos"
        },
        {
          "label": "É natural e não precisa ser produzido artificialmente"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A meia-vida de 6 horas é ideal: longa o suficiente para realizar o exame, curta o suficiente para minimizar a dose ao paciente. A emissão exclusiva de gama de 140 keV é detectada eficientemente pelas câmeras de cintilação sem emitir partículas que aumentariam a dose sem contribuir para a imagem."
    }
  ]
}$lesson_7$::jsonb,
    true
),
(
    'ai-lesson:tomografia-computadorizada',
    'track-ai-fundamentos',
    'tomografia-computadorizada',
    'Quiz: Tomografia computadorizada',
    'beginner',
    8,
    '1.0.0',
    $lesson_8${
  "id": "ai-lesson:tomografia-computadorizada",
  "title": "Quiz: Tomografia computadorizada",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:tomografia-computadorizada:q1",
      "type": "multiple-choice",
      "prompt": "Em Unidades Hounsfield, qual o valor aproximado para o ar nos pulmões?",
      "options": [
        {
          "label": "−1000 HU"
        },
        {
          "label": "0 HU"
        },
        {
          "label": "+400 HU"
        },
        {
          "label": "−100 HU"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O ar possui atenuação mínima dos raios X, correspondendo a −1000 HU na escala de Hounsfield. Por isso, os pulmões aparecem em preto nas imagens de TC quando visualizados em janela de mediastino, e a correta janela de pulmão é necessária para avaliar seu parênquima."
    },
    {
      "id": "ai-lesson:tomografia-computadorizada:q2",
      "type": "multiple-choice",
      "prompt": "O que o técnico ajusta quando seleciona 'janela de pulmão' versus 'janela de osso' na TC?",
      "options": [
        {
          "label": "A faixa de valores HU visualizados na tela"
        },
        {
          "label": "A dose de radiação entregue ao paciente"
        },
        {
          "label": "A velocidade de rotação do tubo"
        },
        {
          "label": "A espessura dos cortes reconstruídos"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A janela (window) define o nível central (center) e a largura (width) da faixa de HU que será exibida na escala de cinzas. Valores fora dessa faixa aparecem como preto ou branco puro. Ao mudar a janela, o técnico não altera os dados — apenas a forma de visualizá-los."
    }
  ]
}$lesson_8$::jsonb,
    true
),
(
    'ai-lesson:ressonancia-magnetica',
    'track-ai-fundamentos',
    'ressonancia-magnetica',
    'Quiz: Ressonância magnética',
    'beginner',
    9,
    '1.0.0',
    $lesson_9${
  "id": "ai-lesson:ressonancia-magnetica",
  "title": "Quiz: Ressonância magnética",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:ressonancia-magnetica:q1",
      "type": "multiple-choice",
      "prompt": "Por que pacientes com marca-passo cardíaco antigo podem ser contraindicados à RM?",
      "options": [
        {
          "label": "O campo magnético intenso pode deslocar o dispositivo ou interferir no seu funcionamento"
        },
        {
          "label": "O marca-passo absorve os raios X, causando artefatos na imagem"
        },
        {
          "label": "A radiofrequência aquece o tecido cardíaco independentemente do dispositivo"
        },
        {
          "label": "Marca-passos contêm radioisótopos que interferem no sinal de RM"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O campo magnético intenso da RM (1,5 a 3 Tesla, ou seja, 30.000 a 60.000 vezes o campo magnético terrestre) pode exercer força física sobre materiais ferromagnéticos, deslocando o implante ou aquecendo condutores. Alguns marca-passos modernos são certificados RM-condicionais, mas os mais antigos são contraindicação absoluta."
    },
    {
      "id": "ai-lesson:ressonancia-magnetica:q2",
      "type": "multiple-choice",
      "prompt": "Em qual tipo de sequência de RM os líquidos (LCR, edemas, líquido articular) aparecem com sinal brilhante (hiperintenso)?",
      "options": [
        {
          "label": "Sequências ponderadas em T2"
        },
        {
          "label": "Sequências ponderadas em T1"
        },
        {
          "label": "Sequências de supressão de gordura (STIR)"
        },
        {
          "label": "Sequências de gradiente (GRE) sem supressão"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Em sequências ponderadas em T2 (longo TE e longo TR), tecidos com alto conteúdo aquoso — líquidos, edemas, inflamações — possuem longo T2 e aparecem brilhantes. Isso explica por que edemas, efusões articulares e lesões inflamatórias são bem detectados em T2."
    }
  ]
}$lesson_9$::jsonb,
    true
),
(
    'ai-lesson:preservacao-de-alimentos-por-irradicao',
    'track-ai-fundamentos',
    'preservacao-de-alimentos-por-irradicao',
    'Quiz: Preservação de alimentos por irradiação',
    'beginner',
    10,
    '1.0.0',
    $lesson_10${
  "id": "ai-lesson:preservacao-de-alimentos-por-irradicao",
  "title": "Quiz: Preservação de alimentos por irradiação",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:preservacao-de-alimentos-por-irradicao:q1",
      "type": "multiple-choice",
      "prompt": "Um alimento submetido à irradiação com raios gama torna-se radioativo e perigoso para consumo?",
      "options": [
        {
          "label": "Não, o alimento não se torna radioativo com as doses utilizadas em conservação"
        },
        {
          "label": "Sim, sempre que há exposição à radiação gama, o alimento emite radiação residual"
        },
        {
          "label": "Depende da dose: abaixo de 10 kGy é seguro, acima disso torna-se radioativo"
        },
        {
          "label": "Sim, mas a radioatividade desaparece em 24 horas após o tratamento"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A irradiação de alimentos usa radiação gama, que não possui nêutrons — portanto não induz radioatividade nos materiais irradiados (ativação nuclear). Os raios gama atravessam o alimento e destroem microrganismos sem depositar partículas radioativas nem alterar a estrutura química dos átomos do alimento de forma radioativa."
    },
    {
      "id": "ai-lesson:preservacao-de-alimentos-por-irradicao:q2",
      "type": "multiple-choice",
      "prompt": "Qual símbolo deve estar presente na embalagem de alimentos que passaram pelo processo de irradiação?",
      "options": [
        {
          "label": "Radura — símbolo internacional de irradiação de alimentos"
        },
        {
          "label": "Trifólio — símbolo de radioatividade"
        },
        {
          "label": "Triângulo amarelo com raios X"
        },
        {
          "label": "Círculo verde com onda eletromagnética"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A radura é o símbolo internacional para alimentos irradiados, criado pela IAEA e reconhecido mundialmente. No Brasil, a ANVISA exige sua presença nas embalagens de alimentos submetidos ao processo, garantindo transparência para o consumidor."
    }
  ]
}$lesson_10$::jsonb,
    true
),
(
    'ai-lesson:equipamentos-de-radiologia-convencional',
    'track-ai-fundamentos',
    'equipamentos-de-radiologia-convencional',
    'Quiz: Equipamentos de radiologia convencional',
    'beginner',
    11,
    '1.0.0',
    $lesson_11${
  "id": "ai-lesson:equipamentos-de-radiologia-convencional",
  "title": "Quiz: Equipamentos de radiologia convencional",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:equipamentos-de-radiologia-convencional:q1",
      "type": "multiple-choice",
      "prompt": "Em qual situação o uso de equipamento portátil é mais indicado em relação ao equipamento fixo?",
      "options": [
        {
          "label": "Pacientes que não podem ser transportados até a sala de raios X (UTI, CTI, centro cirúrgico)"
        },
        {
          "label": "Exames que requerem maior qualidade de imagem e alta resolução"
        },
        {
          "label": "Pacientes que precisam de menor dose de radiação"
        },
        {
          "label": "Exames de membros inferiores em pacientes adultos"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O equipamento portátil é indicado quando o paciente não pode ser movido com segurança — pacientes graves em UTI, pós-operatório imediato, trauma crítico. A qualidade de imagem é inferior à do equipamento fixo, mas o objetivo é obter informação diagnóstica com o mínimo risco ao paciente."
    },
    {
      "id": "ai-lesson:equipamentos-de-radiologia-convencional:q2",
      "type": "multiple-choice",
      "prompt": "Qual equipamento permite visualizar estruturas em movimento em tempo real durante um exame?",
      "options": [
        {
          "label": "Fluoroscópio"
        },
        {
          "label": "Equipamento fixo de radiografia"
        },
        {
          "label": "Aparelho portátil de UTI"
        },
        {
          "label": "Densitômetro ósseo (DXA)"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O fluoroscópio produz um fluxo contínuo de imagens em tempo real, permitindo observar o movimento de estruturas (contraste fluindo pelo trato digestivo, cateter sendo posicionado num vaso) enquanto o exame é realizado. Por isso, gera dose significativamente maior que a radiografia convencional."
    }
  ]
}$lesson_11$::jsonb,
    true
),
(
    'ai-lesson:componentes-basicos-do-equipamento',
    'track-ai-fundamentos',
    'componentes-basicos-do-equipamento',
    'Quiz: Componentes básicos do equipamento',
    'beginner',
    12,
    '1.0.0',
    $lesson_12${
  "id": "ai-lesson:componentes-basicos-do-equipamento",
  "title": "Quiz: Componentes básicos do equipamento",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:componentes-basicos-do-equipamento:q1",
      "type": "multiple-choice",
      "prompt": "Qual componente do tubo de raios X é responsável pela emissão de elétrons?",
      "options": [
        {
          "label": "Catodo (filamento)"
        },
        {
          "label": "Anodo (alvo de tungstênio)"
        },
        {
          "label": "Colimador"
        },
        {
          "label": "Gerador de alta tensão"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O catodo é formado por um filamento de tungstênio que, ao ser aquecido por corrente elétrica, emite elétrons por emissão termiônica. Esses elétrons são acelerados pela diferença de potencial (kVp) em direção ao anodo, onde produzem raios X ao desacelerar."
    },
    {
      "id": "ai-lesson:componentes-basicos-do-equipamento:q2",
      "type": "multiple-choice",
      "prompt": "Qual parâmetro técnico do equipamento controla principalmente a QUANTIDADE de raios X produzidos (e, portanto, a densidade da imagem)?",
      "options": [
        {
          "label": "mAs (miliampere-segundo)"
        },
        {
          "label": "kVp (quilovoltagem de pico)"
        },
        {
          "label": "Distância foco-detector (DFD)"
        },
        {
          "label": "Tamanho do campo de colimação"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O mAs (produto da corrente em mA pelo tempo em segundos) determina o número de elétrons que bombardeiam o anodo por unidade de tempo e, portanto, a quantidade de raios X produzidos. Aumentar o mAs aumenta a dose ao paciente e a densidade (enegrecimento) da imagem."
    }
  ]
}$lesson_12$::jsonb,
    true
),
(
    'ai-lesson:acessorios-radiologicos',
    'track-ai-fundamentos',
    'acessorios-radiologicos',
    'Quiz: Acessórios radiológicos',
    'beginner',
    13,
    '1.0.0',
    $lesson_13${
  "id": "ai-lesson:acessorios-radiologicos",
  "title": "Quiz: Acessórios radiológicos",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:acessorios-radiologicos:q1",
      "type": "multiple-choice",
      "prompt": "Qual acessório tem como função principal filtrar a radiação secundária (espalhada) antes que ela atinja o detector?",
      "options": [
        {
          "label": "Grade antidifusora"
        },
        {
          "label": "Colimador de lâminas"
        },
        {
          "label": "Protetor gonadal"
        },
        {
          "label": "Esponja de posicionamento"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A grade antidifusora é posicionada entre o paciente e o detector. Suas lamelas de chumbo permitem a passagem dos raios X primários (que vêm em linha reta da fonte) e absorvem os raios X espalhados (que chegam em ângulo), melhorando significativamente o contraste da imagem."
    },
    {
      "id": "ai-lesson:acessorios-radiologicos:q2",
      "type": "multiple-choice",
      "prompt": "Em um serviço com protocolo de proteção radiológica correto, quando o uso de protetor gonadal é obrigatório?",
      "options": [
        {
          "label": "Quando as gônadas estão dentro ou a menos de 5 cm do campo irradiado e sua presença não compromete o diagnóstico"
        },
        {
          "label": "Em todos os exames radiológicos sem exceção"
        },
        {
          "label": "Apenas em pacientes menores de 18 anos"
        },
        {
          "label": "Somente quando o médico solicitar explicitamente"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A proteção gonadal é indicada quando as gônadas estão próximas ao campo irradiado (dentro ou até 5 cm), em pacientes com potencial reprodutivo, e desde que o protetor não sobreponha áreas de interesse diagnóstico. É responsabilidade do técnico avaliar e aplicar essa proteção."
    }
  ]
}$lesson_13$::jsonb,
    true
),
(
    'ai-lesson:processamento-radiografico',
    'track-ai-fundamentos',
    'processamento-radiografico',
    'Quiz: Processamento radiográfico',
    'beginner',
    14,
    '1.0.0',
    $lesson_14${
  "id": "ai-lesson:processamento-radiografico",
  "title": "Quiz: Processamento radiográfico",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:processamento-radiografico:q1",
      "type": "multiple-choice",
      "prompt": "Na processadora automática de filmes radiográficos, qual etapa dissolve os cristais de brometo de prata NÃO expostos à radiação?",
      "options": [
        {
          "label": "Fixação"
        },
        {
          "label": "Revelação"
        },
        {
          "label": "Lavagem"
        },
        {
          "label": "Secagem"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O fixador (hipossulfito de sódio ou amônio) dissolve e remove os cristais de AgBr não expostos, que ainda seriam sensíveis à luz. Sem a fixação, a imagem continuaria escurecendo progressivamente ao ser exposta à luz ambiente, tornando-se inutilizável como registro permanente."
    },
    {
      "id": "ai-lesson:processamento-radiografico:q2",
      "type": "multiple-choice",
      "prompt": "Qual a principal vantagem dos sistemas digitais (CR/DR) em relação ao processamento analógico em filme?",
      "options": [
        {
          "label": "Permitem pós-processamento da imagem (ajuste de janela, brilho, contraste) sem nova exposição"
        },
        {
          "label": "Eliminam completamente o uso de raios X"
        },
        {
          "label": "Produzem imagens com maior resolução espacial do que filmes de alta resolução"
        },
        {
          "label": "São mais baratos de adquirir e manter que processadoras de filme"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "A principal vantagem clínica dos sistemas digitais é a capacidade de pós-processar a imagem após a aquisição: ajustar brilho, contraste, ampliar regiões, aplicar filtros — tudo sem expor o paciente novamente. Isso reduz reexposições e, portanto, a dose acumulada."
    }
  ]
}$lesson_14$::jsonb,
    true
),
(
    'ai-lesson:producao-dos-raios-x',
    'track-ai-fundamentos',
    'producao-dos-raios-x',
    'Quiz: Produção dos raios X',
    'beginner',
    15,
    '1.0.0',
    $lesson_15${
  "id": "ai-lesson:producao-dos-raios-x",
  "title": "Quiz: Produção dos raios X",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:producao-dos-raios-x:q1",
      "type": "multiple-choice",
      "prompt": "Qual mecanismo de produção de raios X é responsável pelo espectro contínuo observado na saída do tubo?",
      "options": [
        {
          "label": "Bremsstrahlung (radiação de freamento)"
        },
        {
          "label": "Radiação característica do tungstênio"
        },
        {
          "label": "Produção de par elétron-pósitron"
        },
        {
          "label": "Fluorescência do material do anodo"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O Bremsstrahlung ocorre quando elétrons são desacelerados pelo campo elétrico dos núcleos atômicos do anodo. Como a desaceleração pode ser de qualquer magnitude, os fótons emitidos têm energias variadas — formando um espectro contínuo de zero até o kVp máximo aplicado."
    },
    {
      "id": "ai-lesson:producao-dos-raios-x:q2",
      "type": "multiple-choice",
      "prompt": "Por que os tubos de raios X modernos utilizam anodo rotativo em vez de anodo estacionário?",
      "options": [
        {
          "label": "Para distribuir o calor gerado em uma área maior do anodo, evitando fusão"
        },
        {
          "label": "Para aumentar a produção de raios X por elétron"
        },
        {
          "label": "Para reduzir a energia dos fótons emitidos"
        },
        {
          "label": "Para eliminar a necessidade de filtração do feixe"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Mais de 99% da energia dos elétrons converte-se em calor no anodo. O anodo rotativo gira a alta velocidade (3000-10000 rpm), distribuindo o bombardeio eletrônico por toda a trilha anódica — uma área muito maior que o ponto focal estacionário, permitindo dissipação de calor e uso de maior mAs."
    }
  ]
}$lesson_15$::jsonb,
    true
),
(
    'ai-lesson:qualidade-de-imagem',
    'track-ai-fundamentos',
    'qualidade-de-imagem',
    'Quiz: Qualidade de imagem',
    'beginner',
    16,
    '1.0.0',
    $lesson_16${
  "id": "ai-lesson:qualidade-de-imagem",
  "title": "Quiz: Qualidade de imagem",
  "difficulty": "beginner",
  "questions": [
    {
      "id": "ai-lesson:qualidade-de-imagem:q1",
      "type": "multiple-choice",
      "prompt": "Qual o efeito de AUMENTAR o kVp na qualidade da imagem radiológica?",
      "options": [
        {
          "label": "Reduz o contraste da imagem (fótons mais energéticos penetram mais uniformemente)"
        },
        {
          "label": "Aumenta o contraste por aumentar a diferença de absorção entre tecidos"
        },
        {
          "label": "Não tem efeito no contraste — apenas aumenta a dose"
        },
        {
          "label": "Aumenta o ruído e reduz a nitidez"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "Com kVp mais alto, os fótons têm maior energia e interagem mais pelo efeito Compton (espalhamento) do que pelo fotoelétrico (absorção). O efeito Compton é relativamente independente do número atômico do tecido, reduzindo a diferença de atenuação entre estruturas e, consequentemente, diminuindo o contraste."
    },
    {
      "id": "ai-lesson:qualidade-de-imagem:q2",
      "type": "multiple-choice",
      "prompt": "O que causa borramento geométrico (unsharpness) na imagem radiológica?",
      "options": [
        {
          "label": "Foco de grande tamanho, grande distância objeto-detector ou movimentação do paciente"
        },
        {
          "label": "Alto kVp combinado com baixo mAs"
        },
        {
          "label": "Uso de grade de alta relação"
        },
        {
          "label": "Detector de baixa sensibilidade (lenta)"
        }
      ],
      "correctAnswerIndex": 0,
      "explanation": "O borramento geométrico ocorre porque cada ponto do objeto projeta uma penumbra no detector — quanto maior o foco ou maior a distância objeto-detector (DOD), maior essa penumbra. O movimento do paciente durante a exposição cria borramento de movimento, igualmente prejudicial à nitidez."
    }
  ]
}$lesson_16$::jsonb,
    true
)
on conflict (id) do update set
    track_id = excluded.track_id,
    slug = excluded.slug,
    title = excluded.title,
    difficulty = excluded.difficulty,
    sort_order = excluded.sort_order,
    content_version = excluded.content_version,
    payload = excluded.payload,
    is_published = excluded.is_published,
    updated_at = now();
