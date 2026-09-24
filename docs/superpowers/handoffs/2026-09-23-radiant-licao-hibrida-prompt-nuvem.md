# Prompt — piloto da lição híbrida, para agente de IA em nuvem

**Escrito em 2026-09-23.** Cole o bloco abaixo inteiro no agente. O retorno
volta ao dono, que o entrega à sessão local de IA para revisão, validação no
Loop e integração.

---

```text
Você vai implementar o piloto da "lição híbrida" do app Radiant (React Native / Expo 54), seguindo um plano já aprovado, tarefa por tarefa, com TDD. Trabalhe só neste repositório, em português do Brasil nos textos, e não publique nada.

## 1. Leia antes de tocar em código, nesta ordem
1. AGENTS.md, na raiz. Contém as regras do projeto e as lições que custaram trabalho: guardas, medição e Node. Ignore só o que depende do Loop e do Obsidian (ver seção 3).
2. docs/superpowers/plans/2026-09-23-licao-hibrida-piloto.md — O PLANO. É a sua ordem de serviço: 8 tarefas, código completo, comandos e resultados esperados.
3. docs/superpowers/specs/2026-09-23-licao-hibrida-piloto-design.md — a spec que o plano implementa.
4. docs/adr/ADR-2026-09-23-licao-hibrida-e-custo-de-vida.md — as decisões do dono.
5. docs/STATUS.md e docs/FILA.md — o estado atual. Os dois guardam só o presente e o que está aberto; a regra de manutenção está no topo de cada um.

## 2. Ponto de partida
- Se o PR "docs: lição híbrida — desenho do piloto na L1…" (branch docs/licao-hibrida-piloto) já estiver mergeado na main, parta da main. Senão, parta do branch docs/licao-hibrida-piloto: ele já contém a spec, a ADR, os sons em radiant-app/assets/sounds/ e o plano.
- Crie o branch assim, sem rastrear o remoto, para não armar push na main:
  git fetch origin && git switch --no-track -c feat/licao-hibrida-piloto origin/<base>
- Ambiente: Node 20 (o .nvmrc diz 20.20.2). Confirme com node --version antes de citar qualquer número. Depois, rode: cd radiant-app && npm ci
- Se algo faltar no ambiente, diga o que faltou, o comando e a saída. Não contorne em silêncio.

## 3. O que muda em relação ao plano, por você estar na nuvem
- A CLI `loop` e o cérebro do Obsidian NÃO existem no seu ambiente. Não tente instalá-los nem simulá-los. Ignore a seção "Execução no Loop" e o passo 4 da Tarefa 8; o dono fecha isso localmente.
- No lugar do `loop validate`, rode os gates diretamente (seção 6).
- O arquivo de vermelhos (docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-vermelhos.md) continua obrigatório.
- Não há simulador nem aparelho. Não rode `npx expo run:ios`, EAS, build, submit nem OTA.

## 4. Regras de execução
- Siga as tarefas na ordem do plano, com os passos, os testes e as mensagens de commit que ele traz. Um commit por passo de commit do plano, terminando com a linha:
  Co-Authored-By: <seu nome de modelo> <noreply@anthropic.com>
- TDD de verdade. Rode o teste novo e veja-o falhar pelo motivo previsto antes de implementar.
- Toda guarda nova precisa ser vista falhando PELO DEFEITO QUE NOMEIA: faça a mutação que o plano descreve, rode, cole o trecho da saída vermelha no arquivo de vermelhos (mutação, comando, saída) e reverta. Declarar em prosa que "falhou" não vale.
- Escopo de arquivos: só os listados no plano (seção "Execução no Loop" e bloco "Arquivos" de cada tarefa). Se precisar tocar outro arquivo, pare, explique por quê e siga só se a mudança for inevitável e mínima; registre no relatório. radiant-app/app.json NÃO pode mudar. Se o `npx expo install expo-audio` o alterar, reverta.
- Quando o repositório divergir do plano (nome de API do expo-audio, prop de componente, chave de estilo), adapte pelo mínimo, com o nome real, e registre cada divergência no relatório. Não "melhore" o que o plano não pede.
- Não aprove os modelos: `L1_TEMPLATE_APPROVAL` continua `null`. Quem aprova é o dono. Mas LEIA o snapshot da amostra de revisão (Tarefa 3, passo 6): cada ✓ precisa estar na resposta anatomicamente certa. Se algum estiver errado, corrija a causa e conte no relatório.
- O V3 continua desligado. Não chame prepareV3() e não ligue nada a catálogo, manifesto ou rota do aluno. O piloto só existe na rota /licao-hibrida, atrás de AppConfig.SHOW_DEV_TOOLS.
- Nada de coleta: as medidas ficam no aparelho, e nenhum adaptador de analytics pode ser registrado.
- Teste de tela: aqueça a árvore num beforeAll, como o plano mostra. Não aumente o prazo do findBy.

## 5. Documentação (Tarefa 8)
Faça o passo 2 da Tarefa 8, com dois ajustes:
- em docs/STATUS.md, a frase que deixar de valer vai SEM EDIÇÃO para o fim de docs/archive/STATUS_historico.md, sob um cabeçalho "## Lote de <data> — <assunto>". O mesmo vale para a docs/FILA.md, com docs/archive/FILA_concluidos.md;
- toda afirmação de estado leva a data da medição dentro do texto. Não crie docs/EXECUTION_STATUS_*.md.

## 6. Gate final — obrigatório, com a saída real
Rode, nesta ordem, e guarde o fim de cada saída:
1. node --version
2. cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
3. Na raiz: node --test scripts/qa/docs-contract.test.mjs && node scripts/qa/docs-contract.mjs
4. Na raiz: node --test scripts/content/wave-1-priority-tracks.test.mjs scripts/content/validate-content-anchoring.test.mjs scripts/content/validate-taxonomy-map.test.mjs
O gate que vale é o comando 2 inteiro, como no CI (.github/workflows/radiant-app-quality.yml). `npx jest` solto não substitui. Cite a suíte inteira: suítes, testes, avisos de lint e resultado do visual QA. Se algo reprovar, corrija. Não afrouxe regra, contrato ou visual QA para passar.

## 7. Entrega
1. git push -u origin feat/licao-hibrida-piloto.
2. Abra um PR em rascunho contra o branch de partida, com o título "feat(l1-hibrida): piloto da lição híbrida na L1". Não faça merge.
3. Escreva o relatório em docs/superpowers/handoffs/2026-09-23-radiant-licao-hibrida-relatorio.md, commite no mesmo branch e repita o texto integral como sua mensagem final, com estas seções:
   - Resumo: o que foi entregue, em 5 linhas.
   - Commits: hash curto e mensagem, na ordem.
   - Arquivos: criados e modificados, com uma linha sobre cada.
   - Gate: comando, versão do Node e fim da saída de cada comando da seção 6, com números exatos.
   - Vermelhos: cada guarda nova, a mutação usada e onde está a saída no arquivo de vermelhos.
   - Desvios do plano: o que mudou, por quê, e o que o plano dizia.
   - Não feito: o que ficou de fora, e por quê.
   - Riscos e dúvidas: o que o dono ou o revisor local precisam olhar primeiro.
   - Amostra de revisão: o caminho do snapshot, e se algum ✓ foi corrigido.

Não afirme nada que não mediu. Relatório honesto com pendência vale mais que relatório verde inventado.
```
