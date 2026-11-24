# Brief do integrador de um lote de figuras de acervo

> Versão consolidada em 2026-11-20. Como o lote roda: `docs/superpowers/plans/2026-11-20-figuras-continuidade.md`.

Você liga ao app e às aulas as figuras novas que os agentes de arte deixaram no disco, sem commit. App: Radiant (React Native, estudo de radiologia). Escreva em português do Brasil (código, comentários, commits).

A worktree e a branch vêm no seu pedido. Node 20: `export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`. `python3` é bloqueado (`uv run python -I`; PIL: `uv run --with pillow python -I`). `<WS>` é a pasta do lote, dada no seu pedido.

## Leia primeiro
- `docs/superpowers/plans/2026-11-19-troca-das-figuras.md`: "Restrições globais" e "Tarefa 8".
- `scripts/content/figuras/README.md`, `build-spec.mjs`, `convert.mjs`, `receitas/` e os testes; `scripts/content/rtg-figuras.mjs`; no `scripts/content/rtg-lesson-lint.mjs`, as regras `figure-target-*`.
- Como o lote 1A foi integrado (exemplo aprovado): `git show 6a1b0147 --stat` e, por exemplo, a figura `articulacao-sinovial` em `figuras.json`, `figuras/articulacao-sinovial.alvos.json`, `receitas/`, a entrada dela em `build-spec.mjs`, e a aula m18-04.
- `docs/content/2026-11-05-guia-de-autoria-rtg-2026.md`, seções 3 e 3b, antes de mexer em item.
- Para cada figura, `<WS>/<id>/`: `registro.json`, `aulas.md`, `relatorio.md`, `previa.png` (ABRA com a ferramenta de leitura de arquivos) e o script de geração.

## Política do dono (2026-11-19)
- "Adaptar o item": quando a arte não tem uma estrutura que a aula cobra, ou quando os alvos não cabem na área de toque de 44 pt ou ficam sob o marcador do app, o ITEM deixa de cobrar aquele alvo na figura; o conceito continua ensinando; o fato pode passar a uma afirmação de verdadeiro ou falso ou do exercício rápido da MESMA aula, se o conceito já o ensina. Faça a menor mudança que mantém o item válido (mínimo de fichas e regiões do formato, enunciado, ajuda e retornos coerentes). Liste cada item alterado, com antes e depois, em `<WS>/itens-alterados.md`: um revisor independente lê.
- Nunca CC BY-SA, NC ou ND; em obra derivada, a licença de CADA autor conta. Nunca pintar forma nova nem colar peça em posição inventada. Se uma figura não puder entrar sem inventar conteúdo ou sem violar uma régua, deixe-a de fora (arquivos dela fora do commit, movidos para `<WS>/<id>/fora-do-repo/`, e o spec restaurado com `git checkout`), integre as outras e diga por quê.

## O que fazer
1. **Registro:** entradas em `content-manifest/rtg-2026/figuras.json` a partir de cada `registro.json` (todos os autores no crédito). Rode o gerador (`node scripts/content/build-rtg-batches.mjs`) e o contrato de texto (`cd radiant-app && node --test scripts/copy-style-contract.test.mjs`); se a licença em maiúsculas estourar o teto do arquivo gerado, suba o teto em `radiant-app/scripts/copy-style-baseline.json` pelo número medido e diga.
2. **Regeneração repetível:** a fonte da verdade é `scripts/content/figuras/fontes/<id>.svg`; o spec sai dela pelo `build-spec.mjs` com uma entrada por figura; o script original → fonte de cada agente vai para `scripts/content/figuras/receitas/<id>.mjs` como histórico. Se regenerar pela fonte mudar o spec entregue, a versão do `build-spec.mjs` vence: regenere e confira pela prévia que nada visível mudou. Nenhum traço do original pode ter sido descartado na preparação: compare a contagem de caminhos da fonte com a do original e explique diferenças. `node --test scripts/content/figuras/*.test.mjs`.
3. **Aulas:** aplique o `aulas.md` de cada figura nas unidades indicadas: coordenadas novas, campo `alvo` em todo ponto e região sobre essas figuras, e as frases de localização (`where`, ajuda, retorno) que deixaram de ser verdadeiras, com a correção mínima. As coordenadas do `aulas.md` são ponto de partida: gere a prévia COM os marcadores do app (`node scripts/content/figuras/alvos-preview.mjs` com a aula; veja o uso) e ABRA cada PNG: cada ponto e região cai sobre a estrutura que o rótulo nomeia, na maior parte sobre ela; nenhuma estrutura que o aluno precisa ver para responder fica sob um marcador; a área certa não cobre a estrutura de um erro típico. Prévias finais em `docs/evidence/2026-11-19-figuras/<lote>/<id>.png` (menos de 300 KiB cada).
4. **Regerar e conferir:** `build-rtg-batches.mjs` e `--check`; `node scripts/qa/generate-rtg-maestro.mjs <unidade>` para cada unidade tocada, e `--check`; `node scripts/qa/figuras-no-simulador.mjs` com todos os ids importados (os antigos mais os novos) e `--check` sem ids; verificador nas 40 unidades (`for f in content-manifest/rtg-2026/aulas/*.json; do node scripts/content/rtg-lesson-lint.mjs $f; done`); `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs` (falha alheia conhecida: `registerSource normalizes metadata for the pilot book`); `cd radiant-app && npx jest src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings src/features/journey/services`; `npx tsc --noEmit`; `npx eslint` nos arquivos tocados; `npm run test:maestro-contract`.
5. **Peso:** soma em KiB do SVG de todas as figuras importadas contra o teto total do teste do registro; se reprovar, não suba o teto: pare e relate.
6. **Evidência:** `docs/evidence/2026-11-19-figuras/<lote>.md` com: figuras que entraram (autor, licença, página), itens alterados (uma linha cada), figuras fora do lote e por quê, números dos testes.
7. **Commits** com `git add` de caminhos exatos, um por unidade de aula ou um só se ficar mais claro. `git status --porcelain` ao fim: só `?? radiant-api/node_modules`.

Limites: não use `loop` (o controlador é dono do run); não faça push; não despache subagentes; não rode simulador; não toque em figuras ou aulas fora do lote, nem em `docs/STATUS.md`.

Relatório em `<WS>/integracao-relatorio.md`. Mensagem final (até 14 linhas): estado (DONE, DONE_WITH_CONCERNS ou BLOCKED), commits, figuras integradas, itens alterados, números dos testes, soma de peso, e o que ficou de fora.

## Regras acrescentadas nos lotes 1B a 1E (valem como o resto do brief)

- **Exemplos aprovados de integração:** além do lote 1A, os commits `35dc284b` e `aac94137` (1C), `4300b8d3` e `3f7ae5d8` (1D), `445c7009` e `ee193fa9` (1E).
- **Região declarada e região de aula ficam sobre a arte.** A região declarada de cada alvo é a caixa da estrutura no desenho. Nenhuma região é inflada, nem esticada para o fundo vazio, para o verificador passar ou para o selo não cobrir a figura: três lotes seguidos fizeram isso e os três foram barrados na revisão.
- **Meça o que há sob cada área certa.** Para todo item de tocar, renderize o spec e conte, na área de toque de 44 pt (0,157 x 0,21 do quadro) da resposta certa, quanto é a estrutura nomeada, quanto é fundo e quanto é a estrutura de cada resposta errada do mesmo item. Se a área certa mostrar mais de uma resposta errada do que da própria estrutura, o item não vale: mova a região, mude o que o item pergunta ou tire a região, pela política "adaptar o item". Escreva os percentuais no `<lote>.md`.
- **Nenhum traço do autor de dentro do quadro sai.** O que não cabe sai pelo enquadramento (`viewBox`). Não una caminhos vizinhos para economizar peso: com `evenodd`, subcaminhos sobrepostos se cancelam e o contorno some na tela, mesmo com a contagem de subcaminhos batendo. Para reduzir peso, arredonde as coordenadas de todos os caminhos por igual e diga o desvio em pt. Confira por render: a fonte nova contra o original na mesma transformação.
- **`dropBackground` pode apagar traço.** Ele remove o primeiro `<rect>` da raiz; numa fonte isso era o corpo da uretra. Confira a contagem de formas antes e depois.
- **Id novo de figura** (recorte ampliado, segunda vista): registre em `radiant-app/src/ui/diagrams/diagramRegistry.ts`, `content-manifest/rtg-2026/figuras.json`, `scripts/content/figuras/build-spec.mjs`, no arquivo de alvos e nos roteiros (`figuras-no-simulador.mjs`).
- **Peso por figura:** teto de 240 KiB. Só `respiracao-diafragma` tem exceção nomeada no teste (dois desenhos completos no mesmo quadro). Outra exceção é decisão do dono: pare e relate.
- **Servier Medical Art:** a licença que vale é a da página de termos do próprio Servier (CC BY 4.0). Cópias antigas no Wikimedia Commons aparecem como CC BY-SA 3.0 e não são usadas. Registre a divergência no `modification` da entrada.
- **Togopic/DBCLS:** o crédito cita quem desenhou e quem editou, lidos na página do Togopic, e não só "DBCLS".
- **Receita reproduzível:** a receita roda num checkout limpo, sem variável de ambiente e sem arquivo que só exista na pasta de trabalho; os originais de que ela depende entram em `scripts/content/figuras/receitas/`, com o sha256 no cabeçalho.
- **Composição** de duas peças só com peças do mesmo autor e com critério anatômico medido, escrito em `medidas.md` de modo que o revisor o repita. Dois sistemas no mesmo quadro ficam lado a lado, sem sobrepor.
- **Figura de movimento** entra parada; o texto da aula deixa de dizer que ela se move.
