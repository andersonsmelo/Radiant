# Avanços da trilha e coordenação entre IAs — proposta de 2026-10-17

> **Coordenação substituída em 2026-10-18:** o Claude passou a planejar e
> executar, e Codex e Argon estão em pausa
> ([ADR](../../adr/ADR-2026-10-18-claude-planejador-e-executor.md)). A tabela
> R1–R8 abaixo continua útil. Estado de cada item no
> [levantamento](../2026-10-18-levantamento-do-que-foi-feito.md), §5 e §6.

**Autoria:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`), no papel de
revisor e coordenador pedido por Anderson em 2026-10-17.
**Base:** a [revisão do trabalho do Codex](../avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md),
na mesma data. Os achados A1 a A8 citados abaixo são dela.
**Grau:** tudo aqui é [inferido], uma proposta. O que depende de decisão do
dono está marcado com **Dono**. Não reescreve o
[programa G0–G8](2026-10-16-loop-global-de-evolucao-da-trilha.md): muda a
ordem e acrescenta o que faltou.

## 1. O que muda e por quê

O programa G0–G8 está certo sobre o destino. O que mudou é o que se mediu
depois dele:

- a infraestrutura avançou;
- o conteúdo e a lição não avançaram (A8);
- nada foi commitado (veredito da revisão);
- o G4 tem um defeito que bate na próxima fase (A1).

A proposta reordena para **proteger o que existe, corrigir o que quebra a
próxima fase e voltar ao que o aluno vive**, antes de construir mais.

## 2. Sequência recomendada

| # | Ação | Quem | Prova de pronto |
| --- | --- | --- | --- |
| R1 | **Preservar o trabalho do Codex.** Commitar a árvore em fatias revisáveis (G0/G1, G2, G3, G4, documentação), numa branch própria, com PR | **Dono** autoriza; agente executa | A branch no remoto tem cada fatia passando o `npm run quality` sozinha; a árvore principal volta a ficar limpa |
| R2 | **Destino do E1** (A6): integrar a worktree `trusting-mestorf` depois da R1, resolvendo os 3 conflitos, ou descartá-la | **Dono** decide; agente executa | A FILA 49 é marcada como feita ou cancelada, e a worktree é removida |
| R3 | **Corrigir A1** antes de qualquer lote G3 real: reconciliar por `(lessonId, itemId)`, com teste de diferença **e** de validade, visto falhando | Agente. **Dono** escolhe reiniciar ou preservar o intervalo | O teste novo fica vermelho no código atual e verde depois da correção; uma lição de versão nova volta à fila na data herdada |
| R4 | **Lição honesta, P1/FILA 50**, que é o D1 do diagnóstico. É o maior ganho visível ao aluno e está planejado tarefa a tarefa | Agente | O [plano P1](2026-10-16-licao-legada-honesta.md) cumprido, com E2E |
| R5 | **QA nativo de G2 e G4** no simulador iOS, com uma fixture de item realmente vencido. Android quando houver aparelho | Agente | Evidência datada por plataforma, com capturas e passos |
| R6 | **Capacidade do store** (A2 e A3): medir leitura e escrita com 1k e 5k cartões; decidir entre particionar ou SQLite; quarentena para registro inválido | Agente mede e propõe; **Dono** aprova se mudar o storage | Números de aparelho; teste de registro corrompido que não bloqueia a revisão |
| R7 | **Destravar a produção:** as decisões da FILA 45 (currículo e governança) e o acervo do P6 (FILA 52) | **Dono** decide a FILA 45; pesquisa do P6 vai para o Gemini | O primeiro lote G3 real candidato, com fontes e licenças |
| R8 | **README de entrada curto** (A7): uma página com direção, estado, mapa completo e como contribuir; o histórico vai para um anexo | Agente | O mapa lista todos os arquivos; a leitura cabe em cinco minutos |

A R1 vem primeiro porque é barata e o custo de não fazê-la é perder tudo. A R3
vem antes da R7 porque um lote real com versão nova dispara o A1 para todos os
alunos. A R4 e a R5 podem correr em paralelo lógico, mas os escritores
continuam serializados pelo Loop.

## 3. Divisão de trabalho entre as IAs

| IA | Papel | Escreve em |
| --- | --- | --- |
| **Claude**, coordenador | Revisa cada entrega reproduzindo os gates, mantém a FILA e o STATUS coerentes, escreve os briefs e integra as branches | `docs/trilha/avaliacoes/`, `docs/trilha/plano/`, FILA, STATUS |
| **Codex**, implementação | R3, R4 e R6, um pacote por vez | Código e evidência do pacote |
| **Gemini**, pesquisa | Começa pelo P6 (licenças de imagem); depois, público e voz do usuário. Sem código no primeiro ciclo | `docs/trilha/pesquisas/` |

[inferido] Separar pesquisa e implementação por IA reduz a disputa pelo
escritor único: um run de pesquisa só cria arquivo novo e fecha em minutos.

## 4. Protocolo de coordenação

1. **Reserva antes de começar.** A IA escreve na FILA, no item que vai pegar:
   "Em andamento: <IA e modelo>, <data>". Isso vale num run curto próprio, ou
   no primeiro run do pacote. Item sem reserva está livre. Reserva com mais de
   48 h sem commit volta a ficar livre, depois que o coordenador confere.
2. **Um escritor por vez**, sempre pelo `scripts/loop/abrir.mjs`. `PROJECT_BUSY`
   significa esperar, não contornar.
3. **Depois da R1, cada IA trabalha numa worktree própria** criada a partir da
   branch integrada. Antes de abrir o run, ela provisiona o que o git ignora
   (`Conteúdo/extrações/*` e `radiant-api/node_modules`). A árvore
   compartilhada deixa de acumular trabalho de várias sessões.
4. **Entrega = branch + relatório + evidência.** Relatório sem commit não conta
   como entrega. O relatório nomeia os arquivos tocados, os comandos e os
   limites.
5. **Revisão do coordenador antes de marcar como feito.** O Claude reproduz os
   gates na íntegra e confere cada "X está ligado a Y" no código, como pede a
   sexta lição do AGENTS.md. Só então a FILA é marcada e o STATUS editado.
6. **Premissa de handoff é verificável ou não entra.** Contagem de commits,
   "já existe", "usa o mesmo fluxo" e "a tela mudou" vêm acompanhados do
   comando que os confirma. Esses quatro tipos de premissa já custaram
   retrabalho neste projeto.
7. **Conflito de arquivos se detecta antes.** Antes de integrar duas branches,
   comparar as listas de arquivos tocados. Sobreposição obriga integração
   sequencial, com o coordenador.
8. **Decisão de produto vai ao dono e vira ADR.** Nenhuma IA decide currículo,
   governança, direitos de imagem, release ou mudança de storage.

## 5. Decisões pedidas ao dono

1. **R1:** autorizar o commit em fatias e a PR do trabalho do Codex.
2. **R2:** integrar ou descartar o E1 da worktree `trusting-mestorf`.
3. **R3:** depois de uma mudança material no item, o intervalo de revisão
   reinicia ou é preservado?
4. **Gemini:** confirmar o P6 como primeira entrega. O brief está em
   [`../PROMPT-GEMINI.md`](../PROMPT-GEMINI.md).
