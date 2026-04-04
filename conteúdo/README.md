# Conteúdo Radiant

Raiz editorial do Radiant para transformar livros e materiais em uma base de conhecimento cumulativa.

## Estrutura

- `fontes/`: obras e materiais brutos
- `extrações/`: trechos extraídos das fontes
- `classificação/`: mapeamento de trechos para taxonomia
- `conceitos/`: conhecimento consolidado em conceitos canônicos
- `taxonomia/`: galáxias, planetas e estrelas
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
- extrair a obra piloto em páginas e trechos
- classificar os trechos da obra piloto contra a taxonomia MVP
- consolidar a obra piloto em conceitos canônicos rastreáveis
- gerar os primeiros formatos pedagógicos a partir desses conceitos
