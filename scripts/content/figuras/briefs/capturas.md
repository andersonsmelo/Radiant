# Brief do agente de capturas no simulador de iPhone

> Versão consolidada em 2026-11-20. Roda depois de o lote estar corrigido e com o gate verde, com a árvore limpa. Como o lote roda: `docs/superpowers/plans/2026-11-20-figuras-continuidade.md`.

Você captura no simulador de iPhone as figuras novas de um lote do app Radiant (React Native, Expo), como prova de que aparecem certas no aparelho. A worktree, a branch, o commit de ponta e a lista de figuras e roteiros vêm no seu pedido. Escreva em português do Brasil. Sem subagentes, sem `loop`, sem push, sem editar aulas, specs, roteiros ou código do app.

## Método

- Roteiros em `radiant-app/.maestro/figuras/` (um por aula; `indice.json` lista os ids). Padrão de nome das capturas: `docs/evidence/2026-11-19-figuras/capturas/ios-<id>-<unidade>-aula<NN>-passo<N>.jpg`, em JPEG com menos de 300 KiB.
- Simulador "Radiant F7" (`xcrun simctl list devices | grep "Radiant F7"`; inicie se estiver desligado). O app instalado é um dev client. Suba o Metro em `radiant-app`, no Node 20 (`export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`), com `EXPO_NO_TYPESCRIPT_SETUP=1 npx expo start --dev-client --port 8081`, em segundo plano pelo shell. Não use ferramenta de preview de navegador: ela abre uma aba que pede o bundle web em laço. Abra o bundle com `xcrun simctl openurl <udid> "radiantapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"`.
- Rode cada roteiro com `maestro test` (o binário fica em `~/.maestro/bin`), um por vez. O Maestro grava as capturas em `~/.maestro/tests/`; converta para JPEG com `sips`.
- Defeito conhecido dos roteiros, ainda não consertado: depois de um passo de rotular, o toque em "Continuar" pode não ser achado, porque a rolagem encontra os pontos sob o cabeçalho fixo (aconteceu em `m18-aula-05` e `m25-aula-04`). As capturas dos passos anteriores valem. Não conserte roteiro versionado: relate.
- Se a figura só aparece no conceito (`visual`) e o roteiro não fotografa esse passo, capture a tela com `xcrun simctl io <udid> screenshot` quando ela estiver nele.
- OLHE cada captura com a ferramenta de leitura de arquivos e descreva o que vê: a figura está inteira e legível; algum selo ou marcador esconde a estrutura que o aluno precisa reconhecer; a figura demorou a aparecer ou ficou em branco. O pedido traz os pontos de atenção do revisor.

## Ao terminar

- Encerre o app, pare o Metro e DESLIGUE o simulador (`xcrun simctl shutdown`). Confira que a porta 8081 está livre e que `radiant-app/expo-env.d.ts` não existe (apague se existir: ele derruba um run do Loop). Não deixe processo em segundo plano vivo.
- Acrescente ao fim do `docs/evidence/2026-11-19-figuras/<lote>.md` a seção "Capturas no iPhone", com o arquivo e uma linha do que se vê em cada.
- Commit único, com `git add` de caminhos exatos (as capturas e esse `.md`), mensagem `test(figuras): capturas do lote <lote> no simulador de iPhone`, terminando com a linha de coautoria que o pedido indicar.

Mensagem final, uma vez só: commit, uma linha por figura com o que se vê e o que preocupa, roteiros que reprovaram e por quê, e a confirmação de que Metro e simulador foram desligados.
