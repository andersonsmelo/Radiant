# Briefs dos agentes de um lote de figuras

Cada arquivo é o texto que se entrega a um agente, inteiro, mais o que o pedido acrescenta (id das figuras, worktree, branch, pasta de trabalho, decisões do controlador como requisitos de mesmo peso). O passo a passo de um lote, a ordem dos agentes e os erros que se repetiram estão em [`docs/superpowers/plans/2026-11-20-figuras-continuidade.md`](../../../../docs/superpowers/plans/2026-11-20-figuras-continuidade.md). Revisão de 2026-11-21.

| Brief | Quem recebe | Para que serve |
| --- | --- | --- |
| [`arte.md`](arte.md) | agente de arte (fase 1, acervo) | troca UMA figura de anatomia por ilustração de acervo aberto: busca, licença lida na página e no histórico, recolor sem redesenhar, alvos presos à arte, prévia sobre #171920. "Não achei arte que sirva" é resultado válido. |
| [`cena.md`](cena.md) | construtor de cenas (fase 2) | constrói uma cena isométrica de equipamento e pessoas com o kit de `scripts/content/figuras/kit/`: lista de alvos fechada antes de desenhar, técnica conferida contra o texto da aula, região = caixa justa, medida por cor do que há sob cada área de toque. |
| [`integrador.md`](integrador.md) | integrador do lote | liga as figuras prontas ao app e às aulas: registro, alvos, spec gerado, itens adaptados com antes e depois, derivados regenerados, testes verdes dentro da lista de arquivos do run, commits. |
| [`revisor.md`](revisor.md) | revisor independente (modelo mais capaz, só leitura) | mede o lote por conta própria: técnica radiológica, o que há sob cada área de toque, licença, texto das aulas. Recebe os commits e as decisões do controlador palavra por palavra, nunca o relatório de quem fez. |
| [`capturas.md`](capturas.md) | agente de capturas | roda os roteiros Maestro no simulador de iPhone, olha cada captura, registra o que se vê e desliga Metro e simulador. |

## Regenerar o kit e as cenas

Node 20 e Chrome na máquina (o Chrome resolve o CSS do kit). Detalhe e tabela das 22 cenas em [`../cenas/README.md`](../cenas/README.md).

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
node scripts/content/figuras/cenas/<id>.mjs            # escreve fontes/<id>.svg
node scripts/content/figuras/build-spec.mjs <id>       # fonte -> spec do app
node --test scripts/content/figuras/kit/kit.test.mjs scripts/content/figuras/cenas/cenas.test.mjs
```

A pessoa é um módulo só, `kit/pessoa.mjs`: mudar nela regenera todas as cenas, e `cenas.test.mjs` mostra quais fontes mudaram. Não copie a pessoa para dentro de uma cena.
