# Base internacional da trilha rtg-2026 (fase A da trilha dobrada)

Medido em 2026-11-18, na branch `claude/trilha-dobrada`, a partir da `main` em
`403401d3`. Plano: [fase A](../../superpowers/plans/2026-11-18-trilha-dobrada-fase-a-base-internacional.md).
Decisão: [ADR](../../adr/ADR-2026-11-18-trilha-internacional-e-dobrada.md).

## O que mudou

- **Verificador:** `scripts/content/rtg-national-terms.mjs` barra lei, norma, órgão e
  conselho de um país em qualquer campo de texto da aula-fonte. Está ligado em
  `rtg-lesson-lint.mjs` e, por ele, no gerador e no CI.
- **17 unidades reescritas ou com fontes trocadas:** m01, m02, m04, m08, m09, m11, m12,
  m13, m14, s-ir, s-md, s-mn, s-od, s-rm, s-rt, s-tc, s-us. As outras 7 não tinham
  ocorrência.
- **Três aulas reescritas por inteiro, com os mesmos identificadores:** M14.03
  (prioridade pela condição do paciente), M14.05 (resíduos pelas categorias da OMS) e
  S-US.06 (o que o estudante apoia, o que pergunta e o que nunca é dele).
- **Guia de autoria:** a regra 1.4 passou de "contexto brasileiro" a "base
  internacional".

## Medições

| Medida | Antes | Depois | Como remedir |
| --- | --- | --- | --- |
| Ocorrências que a régua acusa nas 24 unidades | 260 (130 nas aulas, 130 nas fontes) | 0 | `for f in content-manifest/rtg-2026/aulas/*.json; do node scripts/content/rtg-lesson-lint.mjs "$f"; done` |
| Unidades que passam no verificador | 7 de 24, com a régua ligada | 24 de 24 | o mesmo comando |
| Identidade dos itens (id, tipo, papel, marca de segurança) | 105 itens de segurança | 105, e nenhum item saiu ou entrou | `uv run python docs/evidence/2026-11-18-base-internacional/compara-identidade.py origin/main` |
| Lotes gerados em dia | — | sim | `node scripts/content/build-rtg-batches.mjs --check` (saída 0) |
| Suítes de `scripts/content`, como no CI | — | 254 de 254 | o bloco "Node tests" de `.github/workflows/content-scripts.yml` |
| Roteiros do Maestro em dia | — | sim | `node scripts/qa/generate-rtg-maestro.mjs --check m15 m16 s-od s-us` |

A contagem "antes" cruza com o levantamento feito no mesmo dia por outra expressão,
que achou 129 menções no texto das aulas.

**Resíduo por uma segunda convenção.** Uma busca independente da régua, por radicais
(`brasil`, `lei n`, `rdc`, `anvisa`, `cnen`, `ansn`, `conselho`, `ministério`,
`legisla`, `norma`, `habilitad`, `legal`, `federal`, `nacional`, `decreto`,
`portaria`, `titular`), leu cada ocorrência: 36 de `norma` são todas a palavra
"normal"; 15 de `habilitad` são "profissional habilitado", sem lei; 5 de `nacional`
são "internacional" e o nome do INCA. Nenhuma referência nacional no texto das aulas.

## O que ficou, de propósito

- **Três fontes do INCA** (material didático, não norma) seguem em m12, s-md e s-rt,
  com endereço `gov.br`. O editor aparece como "Instituto Nacional de Câncer (INCA)".
- **"Em português, D e E"** em M02.02, como exemplo de letras da língua local.
- **Nomes de personagens** (Dona Marta, Seu Jorge) e o português do Brasil.

## O que saiu sem troca

Fatos que só a norma brasileira sustentava e para os quais nenhuma fonte aberta lida
deu equivalente. A aula passou a ensinar o princípio e a dizer que o serviço define.

- Frequência fixa de testes de qualidade em medicina nuclear, radioterapia e
  intervencionista; prazo de 30 dias para relatar evento em radioterapia.
- Idade mínima do acompanhante. Ficou: adulto, não gestante; criança evitada.
- Espessura de 0,25 mm de chumbo da vestimenta e o teste semestral com laudo.
- Grupos de resíduo por letra. Entraram as categorias da OMS.
- Quem pode laudar e quem pode operar. Ficou: a regra local define; o estudante não
  interpreta nem dá resultado.
- A frase sobre quem faz a varredura no ultrassom em cada país: nenhuma fonte de
  ultrassom aberta foi lida, e ela saiu do conceito.

## Como foi revisado

Autores em modelo menor (Sonnet), um por unidade ou grupo pequeno. Quatro revisões
independentes em modelo maior (Opus), uma por lote, que abriram as fontes novas e
compararam antes e depois. Todas aprovaram com correções; a de medicina nuclear
reprovou a unidade por um texto corrompido ("tx" no lugar de "testes de qualidade"),
que o verificador automático não acusava. Foram 63 correções aplicadas no total (17,
19, 14 e 13). O controlador leu por inteiro M14.03 e S-US.06.

## Limites desta evidência

- Nada foi visto em aparelho nem no simulador.
- O verificador não acusa alternativa correta mais longa por pouco, texto corrompido
  nem retorno trocado: esses três tipos só apareceram na revisão humana do diff.
- As revisões leram o diff e abriram as fontes novas por amostra; não releram as aulas
  que só trocaram fonte, item por item.
- Texto de loja: `docs/store/2026-08-08-ios-preflight.md` e
  `docs/store/DATA_SAFETY_E_CLASSIFICACAO.md` citam termos brasileiros. Não foram
  tocados; texto de loja é do dono.

## Arquivos

- [`mapa-de-fontes.md`](mapa-de-fontes.md): de cada fonte nacional para a internacional,
  com o trecho.
- [`vermelho-tarefa-1.txt`](vermelho-tarefa-1.txt): as execuções vermelhas da régua.
- [`compara-identidade.py`](compara-identidade.py): o comparador de identidade.
