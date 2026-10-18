# Prompt do Codex — pacote do motor híbrido (FILA 58)

**Preparado por:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), coordenador,
em 2026-10-18, a pedido de Anderson. Colar como primeira mensagem ao Codex.

```text
Você é o Codex e volta ao Radiant (React Native/Expo, TypeScript, local-first),
app de estudo para técnicos de radiologia no Brasil. Repositório:
/Users/anderson/Developer/Radiant. Desde 2026-10-17, o Claude coordena e
revisa as IAs: sua entrega só é marcada como feita depois da revisão dele.

SUA TAREFA: o pacote da FILA 58, motor da lição híbrida nas lições legadas.
Leia, nesta ordem:
1. docs/trilha/plano/2026-10-18-pacote-motor-hibrido-na-licao.md — escopo M1–M8,
   quem é afetado e critérios de pronto. É a especificação.
2. docs/adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md e
   docs/adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md — decisões do dono.
   Não as reabra.
3. docs/trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md e
   docs/trilha/avaliacoes/2026-10-17-revisao-do-trabalho-do-argon.md — o que a
   revisão cobra (A1–A8, B1–B5).
4. AGENTS.md, docs/STATUS.md e docs/FILA.md.

ONDE TRABALHAR
- Worktree própria a partir de origin/claude/motor-hibrido-e-decisoes-2026-10-18:
  git worktree add <caminho> origin/claude/motor-hibrido-e-decisoes-2026-10-18
  e, dentro dela, git switch --no-track -c codex/motor-hibrido-licao.
  Nunca edite o checkout principal.
- Antes de abrir o run, provisione o que o git ignora: excerpts.json e
  pages.json de Conteúdo/extrações/*, radiant-api/node_modules e
  radiant-app/node_modules. Para o Metro, copie com cp -cR; não use link
  simbólico. Para desfazer um link, use unlink, nunca rm -rf link/.
- A trava do Loop vale por checkout: outra IA pode estar escrevendo em outra
  worktree. Sobreposição de arquivos se resolve no merge, que é do coordenador.

COMO ENTREGAR
- Reserve a FILA 58 ("Em andamento: Codex <modelo>, <data>") no primeiro run.
- Toda escrita passa por node scripts/loop/abrir.mjs, declarando a união dos
  arquivos. Isso inclui os 8 roteiros .maestro listados no plano e
  scripts/maestro-contract.test.mjs.
- Node 20 para app e testes; Node 24 só para a CLI loop. Confira node --version.
- Antes de tocar num literal visível ou num ramo de UI, faça grep do literal
  antigo em src/, .maestro/ e scripts/ e descubra que caminho cada roteiro
  alcança. O contrato estático só confere o caminho 1.
- Para cada mudança, um teste visto falhando pelo motivo previsto antes do
  código. Registre a execução vermelha. Asserção de ausência ou diferença vem
  sempre com uma de validade.
- A régua de estrelas (M7) é proposta sua. Apresente-a na PR com a tabela de N
  perguntas e acertos para o Anderson aprovar.
- Gate: EXPO_NO_DOTENV=1 npm run quality (Node 20) e loop validate 15/15, com
  o simulador desligado durante a validação. Prova nativa como pede o plano,
  com capturas no repositório (docs/evidence/) e não numa pasta local.
- Fechamento: validate → step finish → [memory write] → run close, lendo o
  `code` de cada resposta. Nunca encadeie com &&.
- Abra a PR contra claude/motor-hibrido-e-decisoes-2026-10-18. Não faça merge,
  push na main, build de loja nem publicação.

O RELATÓRIO VAI SER AUDITADO
O Claude confere com grep cada arquivo, símbolo, linha, número, URL e citação
de documento do seu relatório. Na última revisão de outra IA, citações
inventadas bloquearam o merge. Escreva só o que você leu ou mediu. Diga o que
não verificou e o que ficou de fora.

Decisões de produto são do Anderson; pergunte quando a decisão for dele. Ao
terminar, relate a branch, a PR, os arquivos, as provas, os limites e o
próximo passo. O pacote seguinte é a FILA 55 (A1), já decidido: preserva a
data.
```
