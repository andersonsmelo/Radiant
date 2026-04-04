# Conteúdo Radiant

Raiz editorial do Radiant para transformar livros e materiais em uma base de conhecimento cumulativa.

## Estrutura

- `fontes/`: obras e materiais brutos
- `extrações/`: trechos extraídos das fontes
- `classificação/`: mapeamento de trechos para taxonomia
- `taxonomia/`: galáxias, planetas e estrelas
- `conceitos/`: conhecimento consolidado
- `formatos/`: artefatos pedagógicos gerados
- `governança/`: contratos, critérios e regras editoriais

## Regra principal

Nada entra em `formatos/` sem passar por:

1. fonte
2. extração
3. classificação
4. conceito

## Obra piloto atual

- `Fundamentos de Radiologia` (`source:fundamentos-de-radiologia-everton-costa-pinto`)

## Fase atual

O sistema já consegue:

- registrar uma obra como fonte
- indexar a fonte em JSON
- abrir um job de extração pendente para a obra piloto
