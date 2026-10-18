# Levantamento da trilha — 2026-10-16 a 2026-10-18

**Data:** 2026-10-18 (America/Bahia).
**Autor:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), a pedido de Anderson.
**Base:** `main` em `cc67243`, depois do merge das PRs #39 a #46.
**Grau:**
- [medido]: comando executado nesta data;
- [código]: lido no repositório;
- [visto]: observado no simulador iOS;
- [inferido]: leitura do autor.

O estado vivo continua sendo o [`STATUS`](../STATUS.md), e o executável, a
[`FILA`](../FILA.md). Este documento conta o que aconteceu e onde está cada
coisa.

## 1. Em uma frase

Em três dias, a trilha passou a ter:
- catálogo e unidades generalizados (G0–G3);
- revisão por item com resposta antes do gabarito (G4);
- lições que usam todas as perguntas, com feedback por item, retorno do erro e
  vidas cobradas só no retorno;
- revisão que não some quando o conteúdo muda de versão (A1).

Tudo está na `main` [medido], e **nada disso está na loja ainda**. A App Store
roda a `1.4.0 (12)`, compilada do `221e2ec` em 2026-10-09 (ver STATUS).

## 2. As PRs, em ordem de merge (todas em 2026-10-18)

| PR | Autor | O que entrou | Revisão |
| --- | --- | --- | --- |
| [#39](https://github.com/andersonsmelo/Radiant/pull/39) | Codex | G0–G4 em cinco fatias: inventário, catálogo, unidades, contrato editorial e revisão por item com journal. Leva também 39 commits locais de 9 a 16/10, que nunca tinham sido publicados | Claude, [A1–A8](avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md) |
| [#40](https://github.com/andersonsmelo/Radiant/pull/40) | Argon | Lição legada honesta (sem "Quiz:", gabarito no reforço, resumo de 0 estrela sem celebração), cor e copy do G4, cache do repositório, pesquisa de imagens P6 | Claude, [B1–B5](avaliacoes/2026-10-17-revisao-do-trabalho-do-argon.md). B1 a B3 corrigidos antes do merge |
| [#41](https://github.com/andersonsmelo/Radiant/pull/41) | Claude | Decisões de 18/10: [ADR do A1](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md), [ADR do motor híbrido](../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md), plano e prompt do pacote | — |
| [#42](https://github.com/andersonsmelo/Radiant/pull/42) | Codex | Motor híbrido M1–M8: todas as perguntas, feedback por item, retorno do erro, vidas só no retorno, sem passo de molde, Refazer, régua de estrelas para N perguntas, 8 roteiros Maestro | Claude, [revisão da #42](avaliacoes/2026-10-18-revisao-da-pr-42.md). Gate reproduzido com os mesmos números |
| [#43](https://github.com/andersonsmelo/Radiant/pull/43) | Claude | Ajustes da revisão: a última vida no último retorno conclui a lição, tom do feedback, Refazer secundário, 6ª sessão no roteiro de vidas, [ADR da régua e da última vida](../adr/ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md) | Prova nativa do roteiro de vidas |
| [#44](https://github.com/andersonsmelo/Radiant/pull/44) | Claude | FILA 58 marcada como feita | — |
| [#45](https://github.com/andersonsmelo/Radiant/pull/45) | Claude | A1: a versão nova preserva a data de revisão de cada item, sem herdar evidência | [Relatório](../evidence/2026-10-18-a1-preserva-data.md) |
| [#46](https://github.com/andersonsmelo/Radiant/pull/46) | Claude | FILA 55 marcada como feita | — |

## 3. O que o aluno encontra na `main`

- **Trilha** [visto em 2026-10-18]:
  - abre no nó PRÓXIMO;
  - mostra a régua da unidade ("7 de 8");
  - não mostra mais o prefixo "Quiz:".
- **Lição** [código e visto em 2026-10-18]:
  - contexto, ideia-chave só quando há texto autoral, e depois todas as
    perguntas da lição (2 nas de IA, 3 nas manuais);
  - cada resposta mostra a opção marcada, a certa e a explicação, com borda
    verde no acerto e rosa no erro;
  - o item errado volta uma vez no fim;
  - errar no primeiro contato não custa vida. O retorno custa, e perder a
    última vida nele ainda conclui a lição.
- **Resumo:**
  - algum acerto vale 1 estrela, a partir de 2/3 valem 2, e tudo vale 3, contando
    a primeira resposta de cada item;
  - "Refazer" aparece quando o resultado não foi completo;
  - o resumo de 0 estrela não comemora.
- **Revisão** [visto em 2026-10-18, sem capturas versionadas]:
  - o aluno escolhe e confirma antes de ver o gabarito;
  - "Ver resposta com ajuda" não dá XP;
  - o feedback é rosa no erro e âmbar na ajuda.
- **Conteúdo com versão nova** [código]: o item mantém a data de revisão e
  recomeça o histórico de acertos.

## 4. Decisões do dono no período

| Data | Decisão | Registro |
| --- | --- | --- |
| 16/10 | Evolução global da trilha, sem aulas piloto como gate | [ADR](../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md) |
| 17/10 | O Claude revisa e coordena as IAs | [protocolo](plano/2026-10-17-avancos-e-coordenacao-multi-ia.md), agora substituído |
| 18/10 | A1: a versão nova preserva a data | [ADR](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md) |
| 18/10 | Motor híbrido nas lições legadas, primeiro contato sem custo, sem passo de molde | [ADR](../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md) |
| 18/10 | Régua de estrelas aprovada, a última vida conclui a lição, o primeiro contato continua grátis com 0 vidas | [ADR](../adr/ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md) |
| 18/10 | `gh pr merge` liberado nas permissões, mas o merge continua sendo decisão do dono | memória do agente |
| 18/10 | **O Claude planeja e executa; Codex e Argon em pausa** | [ADR](../adr/ADR-2026-10-18-claude-planejador-e-executor.md) |

## 5. Achados das revisões e onde cada um está

| Achado | Estado em 2026-10-18 |
| --- | --- |
| A1: a versão nova apagava a revisão | ✅ Corrigido (#45) |
| A2: o store de revisão passa dos 6 MB do Android nos tetos | ⏳ Aberto. O cache do Argon reduz CPU, não tamanho (R6) |
| A3: um registro inválido bloqueia a revisão inteira | ⏳ Aberto (R6) |
| A4: o agregado legado avança uma vez por item | ⏳ Aberto, sem pacote |
| A5: código denso para revisão entre IAs | Processo. Perde peso com uma IA só |
| A6: o E1 parado na worktree `trusting-mestorf-a5ca83`, com 22 arquivos sujos | ⏳ Decisão do dono (FILA 57) |
| A7: o README da trilha longo e com mapa desatualizado | ⏳ Aberto (R8) |
| A8: infraestrutura à frente do conteúdo | Em curso: o motor híbrido priorizou a lição. O conteúdo depende da FILA 45 |
| B1–B3: copy de 0 estrela, FILA com afirmações falsas, citações inventadas | ✅ Corrigidos antes do merge da #40 |
| D1 do diagnóstico: uma pergunta por lição | ✅ Com o que existe (2 ou 3). Os 10 a 15 itens dependem da FILA 45 |
| Viés de comprimento: a certa é a mais longa em 18 de 32 perguntas | ⏳ Aberto. Depende de conteúdo |
| C1: `questionIndex` e `reinforceBody` sem leitor, mas no contrato da API | ⏳ Aberto. Limpar na API e no app juntos |
| C2: a barra de progresso recua quando o aluno erra | ⏳ Aberto. Observação de design |

## 6. O que ficou aberto

**O agente pode fazer sem decisão nova:**
1. **R6, capacidade do store (A2 e A3):** medir com 1k e 5k cartões e colocar em
   quarentena o registro inválido. Trocar o storage é decisão do dono.
2. **R5, QA nativo do G4 com capturas versionadas,** e os 7 roteiros Maestro
   que só rodaram pelo contrato estático.
3. **A4,** o agregado legado.
4. **R8,** o README da trilha curto.
5. **C1,** a limpeza do contrato de conteúdo, na API e no app juntos.

**Depende do dono:**
- **FILA 45:** currículo e governança. Libera os 10 a 15 itens por lição e o
  viés de comprimento;
- **FILA 52:** aprovar as 15 imagens;
- **FILA 57:** integrar ou descartar o E1;
- **FILA 48:** a captura de loja com ou sem o convite do lembrete;
- **FILA 43:** o analytics;
- **FILA 6:** os opt-ins do closed test Android;
- **publicação:** levar a `main` para a loja numa build nova.

## 7. Ambiente em 2026-10-18 [medido]

| Worktree | Branch | Estado |
| --- | --- | --- |
| `.claude/worktrees/review-42` | a desta documentação | Limpa ao fim do run |
| `.claude/worktrees/trusting-mestorf-a5ca83` | `feat/e1-e2e-sem-movimento` | 22 arquivos sujos (FILA 57). Não mexer sem o dono |
| `.claude/worktrees/argon-trilha` | `argon/trilha-melhorias-e-avaliacao` | Limpa, já na `main` |
| `.claude/worktrees/dazzling-ishizaka-883871` e `sharp-dijkstra-747d12` | destacadas, de 23/09 | Limpas, já na `main` |
| `.superpowers/worktrees/motor-hibrido-licao` e `release` | do Codex e de release | Não inspecionadas |

O checkout principal está em `feat/trilha-evolucao-global-g0-g4`, em
`69e6532`, atrás da `main`. Antes de trabalhar nele: `git switch main` e
`git pull --ff-only`.

## 8. Lições de processo do período

- **Relatório de outra IA é a versão do autor.** As citações inventadas do Argon
  (B3) só apareceram com `grep` em cada referência.
- **Premissa da própria recomendação também se confere.** "3 a 5 perguntas com
  o que existe" era falso: as lições de IA têm 2 perguntas.
- **Busca de consumidores sem `head`.** Uma busca cortada escondeu o contrato da
  API. O `tsc` achou os leitores.
- **Metro na worktree do run** cria `expo-env.d.ts` e derruba o `step finish`.
  Agora está no AGENTS.md.
- **Um teste vermelho que não reproduz** se compara na branch e na `main`, com
  a CPU limitada, antes de se chamar de instável. Mesmo assim o gate se repete
  inteiro.
