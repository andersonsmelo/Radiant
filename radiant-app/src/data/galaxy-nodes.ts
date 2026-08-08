// AUTO-GENERATED — do not edit by hand.
// Source: content-manifest/taxonomy-catalog-map.json + Conteúdo/taxonomia/planetas.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { JourneyNode } from '../types/journey';

/**
 * Nós de jornada por corpo celeste, derivados do mapa de taxonomia.
 * A apresentação do corpo (cor, superfície, posição) vive em galaxy-catalog.ts,
 * escrita à mão; só o vínculo lição→planeta é gerado.
 */
export const GALAXY_NODES_BY_BODY: Record<string, JourneyNode[]> = {
  "planet-equipamento": [
    {
      "id": "node-equipamento-01",
      "unitId": "planet-equipamento",
      "type": "lesson",
      "title": "Equipamentos de radiologia convencional",
      "lessonId": "ai-lesson:equipamentos-de-radiologia-convencional",
      "status": "available"
    },
    {
      "id": "node-equipamento-02",
      "unitId": "planet-equipamento",
      "type": "lesson",
      "title": "Componentes básicos do equipamento",
      "lessonId": "ai-lesson:componentes-basicos-do-equipamento",
      "status": "available"
    },
    {
      "id": "node-equipamento-03",
      "unitId": "planet-equipamento",
      "type": "lesson",
      "title": "Acessórios radiológicos",
      "lessonId": "ai-lesson:acessorios-radiologicos",
      "status": "available"
    }
  ],
  "planet-fisica-da-radiacao": [
    {
      "id": "node-fisica-da-radiacao-01",
      "unitId": "planet-fisica-da-radiacao",
      "type": "lesson",
      "title": "Energia e matéria",
      "lessonId": "ai-lesson:energia-e-materia",
      "status": "available"
    },
    {
      "id": "node-fisica-da-radiacao-02",
      "unitId": "planet-fisica-da-radiacao",
      "type": "lesson",
      "title": "Estrutura da matéria e núcleo atômico",
      "lessonId": "ai-lesson:estrutura-da-materia-e-nucleo-atomico",
      "status": "available"
    },
    {
      "id": "node-fisica-da-radiacao-03",
      "unitId": "planet-fisica-da-radiacao",
      "type": "lesson",
      "title": "Radioatividade, partículas e atividade",
      "lessonId": "ai-lesson:radioatividade-particulas-e-atividade",
      "status": "available"
    },
    {
      "id": "node-fisica-da-radiacao-04",
      "unitId": "planet-fisica-da-radiacao",
      "type": "lesson",
      "title": "Raios X: descoberta e propriedades",
      "lessonId": "ai-lesson:raios-x-descoberta-e-propriedades",
      "status": "available"
    }
  ],
  "planet-imagem-na-pratica": [
    {
      "id": "node-imagem-na-pratica-01",
      "unitId": "planet-imagem-na-pratica",
      "type": "lesson",
      "title": "Processamento radiográfico",
      "lessonId": "ai-lesson:processamento-radiografico",
      "status": "available"
    },
    {
      "id": "node-imagem-na-pratica-02",
      "unitId": "planet-imagem-na-pratica",
      "type": "lesson",
      "title": "Qualidade de imagem",
      "lessonId": "ai-lesson:qualidade-de-imagem",
      "status": "available"
    }
  ],
  "planet-modalidades": [
    {
      "id": "node-modalidades-01",
      "unitId": "planet-modalidades",
      "type": "lesson",
      "title": "Aplicações radioisotópicas e medicina nuclear",
      "lessonId": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear",
      "status": "available"
    },
    {
      "id": "node-modalidades-02",
      "unitId": "planet-modalidades",
      "type": "lesson",
      "title": "Tomografia computadorizada",
      "lessonId": "ai-lesson:tomografia-computadorizada",
      "status": "available"
    },
    {
      "id": "node-modalidades-03",
      "unitId": "planet-modalidades",
      "type": "lesson",
      "title": "Ressonância magnética",
      "lessonId": "ai-lesson:ressonancia-magnetica",
      "status": "available"
    }
  ],
  "planet-producao-e-protecao": [
    {
      "id": "node-producao-e-protecao-01",
      "unitId": "planet-producao-e-protecao",
      "type": "lesson",
      "title": "Interação das radiações e proteção radiológica",
      "lessonId": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica",
      "status": "available"
    },
    {
      "id": "node-producao-e-protecao-02",
      "unitId": "planet-producao-e-protecao",
      "type": "lesson",
      "title": "Produção dos raios X",
      "lessonId": "ai-lesson:producao-dos-raios-x",
      "status": "available"
    }
  ],
  "planet-profissao-e-aplicacoes": [
    {
      "id": "node-profissao-e-aplicacoes-01",
      "unitId": "planet-profissao-e-aplicacoes",
      "type": "lesson",
      "title": "Profissão e atuação do técnico em radiologia",
      "lessonId": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia",
      "status": "available"
    },
    {
      "id": "node-profissao-e-aplicacoes-02",
      "unitId": "planet-profissao-e-aplicacoes",
      "type": "lesson",
      "title": "Preservação de alimentos por irradiação",
      "lessonId": "ai-lesson:preservacao-de-alimentos-por-irradicao",
      "status": "available"
    }
  ]
};
