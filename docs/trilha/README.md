# Melhoria da trilha — ponto de entrada

Esta pasta reúne o que se pesquisou, avaliou e planejou sobre a **trilha**, a
aba "Estude" do Radiant. A trilha é o caminho gamificado de lições, revisões,
XP, sequência e vidas, e o dono a definiu como o investimento principal do
produto. Esta página se lê em cinco minutos. O que veio antes, seção por seção e
com data, está no [histórico](historico.md).

**Comece pelo [levantamento de 16 a 18/10](2026-10-18-levantamento-do-que-foi-feito.md)**,
que traz as PRs, as decisões e o que ficou aberto, e pelo
[prompt de continuidade (20)](../superpowers/handoffs/2026-10-18-radiant-prompt-de-continuidade-20.md),
a entrada da próxima sessão.

**Contribuições são bem-vindas, inclusive as que discordam do que está aqui.**

## Direção

- **A trilha e a aula são redesenhadas, e o conteúdo recomeça.** Decidido por
  Anderson em 2026-10-21:
  - trilha na direção Medalhão;
  - aula no formato bancada, em que o aluno opera o equipamento e a imagem;
  - o mundo visual novo vale para o app inteiro;
  - todas as aulas atuais saem, com a fonte, e o currículo novo é escolhido em
    conjunto.

  ([ADR](../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md) ·
  [spec](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md) ·
  [prancheta da trilha](../design/2026-10-21-trilha-medalhao.html) ·
  [prancheta da aula](../design/2026-10-21-aula-bancada.html))
- **Evolução global, sem aula piloto como gate.** Decidido por Anderson em
  2026-10-16. A frente parte do diagnóstico da trilha inteira para uma
  implementação compartilhada, um currículo organizado e conteúdo em escala
  ([ADR](../adr/ADR-2026-10-16-evolucao-global-da-trilha-sem-pilotos.md) ·
  [programa G0–G8](plano/2026-10-16-loop-global-de-evolucao-da-trilha.md)).
- **A lição legada ganha o motor híbrido.** O primeiro contato não custa vida, e
  a última vida perdida no último retorno conclui a lição
  ([ADR do motor](../adr/ADR-2026-10-18-motor-hibrido-nas-licoes-legadas.md) ·
  [ADR da régua e da última vida](../adr/ADR-2026-10-18-regua-de-estrelas-e-ultima-vida.md)).
- **A revisão é por item.** O item é respondido antes de o gabarito aparecer, e
  uma versão nova de conteúdo preserva a data
  ([ADR do A1](../adr/ADR-2026-10-18-a1-nova-versao-preserva-a-data.md)).
- **O Claude planeja e executa** desde 2026-10-18, e Codex e Argon estão em
  pausa ([ADR](../adr/ADR-2026-10-18-claude-planejador-e-executor.md)). Os
  prompts para eles, no mapa abaixo, viraram histórico.
- **Decisões que não se reabrem:** a
  [composição em várias unidades](../adr/ADR-2026-10-16-composicao-multiunidade-da-trilha.md)
  e a [revisão paralela com lembrete](../adr/ADR-2026-10-16-revisao-paralela-e-lembrete.md).

## Estado

O estado vivo está no [STATUS](../STATUS.md) e na [FILA](../FILA.md), a partir
do item 49. Esta página não repete números. Em 2026-10-18:
- **Na `main`:** os pacotes G0–G4 (PR #39), a lição honesta (PR #40), o motor
  híbrido (PRs #42 e #43), o A1 (PR #45) e o E2E sem animação (PR #49).
- **Abertos:**
  - o store de revisão não cabe no Android nos tetos declarados (A2);
  - desempenho no aparelho (G6) e recuperação (G7);
  - imagens com licença (P6, FILA 52);
  - currículo e governança da produção (FILA 45).

## Mapa da pasta

Todo arquivo da pasta está aqui. O `docs-contract` reprova um arquivo novo que
não entre neste mapa.

**Entrada e prompts**
- [`2026-10-18-levantamento-do-que-foi-feito.md`](2026-10-18-levantamento-do-que-foi-feito.md):
  o levantamento de 16 a 18/10, com o estado de cada achado.
- [`historico.md`](historico.md): este README até 2026-10-18, com o índice
  consolidado das entregas G0–G4.
- [`PROMPT-PARA-IAS.md`](PROMPT-PARA-IAS.md): contexto pronto para colar em
  outra IA.
- Históricos, porque Codex e Argon estão em pausa:
  - [`PROMPT-ARGON.md`](PROMPT-ARGON.md), o norte que guiou o Argon (Gemini);
  - [`PROMPT-GEMINI.md`](PROMPT-GEMINI.md), o primeiro brief do Gemini, só de
    pesquisa, substituído pelo do Argon;
  - [`PROMPT-CODEX-2026-10-18.md`](PROMPT-CODEX-2026-10-18.md), o pacote do
    motor híbrido para o Codex (FILA 58).

**Pesquisas** (`pesquisas/`)
- [Trilhas gamificadas e educação em radiologia](pesquisas/2026-10-16-benchmark-trilhas-gamificadas.md):
  26 produtos.
- [Desenvolvimento com agentes de IA](pesquisas/2026-10-16-praticas-desenvolvimento-com-agentes.md).
- [Exercícios sobre imagem no celular](pesquisas/2026-10-16-exercicios-imagem-celular-evidencias.md):
  estudos primários e limites do renderizador.
- [Produção escalável e qualidade](pesquisas/2026-10-16-producao-escalavel-e-qualidade-da-trilha.md).
- [Imagens com licença comercial e o técnico brasileiro](pesquisas/2026-10-17-fontes-imagens-comerciais-e-mercado-br.md):
  a base do P6.

**Avaliações** (`avaliacoes/`)
- 16/10, as telas:
  - [avaliação da manhã](avaliacoes/2026-10-16-avaliacao-completa-da-trilha.md);
  - [reavaliação da tarde](avaliacoes/2026-10-16-reavaliacao-da-trilha.md), com
    os anexos de [design](avaliacoes/2026-10-16-reavaliacao-da-trilha-design.md)
    e [mecânica](avaliacoes/2026-10-16-reavaliacao-da-trilha-mecanica.md).
- 16/10, o código:
  - [diagnóstico estrutural global](avaliacoes/2026-10-16-diagnostico-estrutural-global-da-trilha.md);
  - os dados dele: [inventário](avaliacoes/2026-10-16-inventario-estrutural.json),
    [alcance após G0/G1](avaliacoes/2026-10-16-alcancabilidade-apos-g0-g1.json)
    e [cobertura e composição](avaliacoes/2026-10-16-cobertura-e-composicao-da-trilha.json).
- 17/10:
  - [avaliação do Argon](avaliacoes/2026-10-17-avaliacao-argon-licao-revisao-e-contratos.md):
    lição, revisão G4 e contratos E2E;
  - revisões do Claude, do [trabalho do Codex](avaliacoes/2026-10-17-revisao-do-trabalho-do-codex.md)
    (achados A1 a A8) e do [trabalho do Argon](avaliacoes/2026-10-17-revisao-do-trabalho-do-argon.md).
- 18/10: [revisão da PR #42](avaliacoes/2026-10-18-revisao-da-pr-42.md), o
  motor híbrido.

**Planos** (`plano/`)
- [Plano em três horizontes](plano/2026-10-16-plano-de-melhoria-da-trilha.md):
  dias, semanas e meses.
- [Loop global G0–G8](plano/2026-10-16-loop-global-de-evolucao-da-trilha.md):
  o programa em vigor.
- [P1, lição legada honesta](plano/2026-10-16-licao-legada-honesta.md), tarefa
  a tarefa.
- [Piloto de imagem sem pistas](plano/2026-10-16-piloto-imagem-sem-pistas.md):
  superado pela direção global, guardado como histórico.
- [Avanços R1–R8 e coordenação entre IAs](plano/2026-10-17-avancos-e-coordenacao-multi-ia.md).
- [Pacote do motor híbrido](plano/2026-10-18-pacote-motor-hibrido-na-licao.md)
  (FILA 58).

**Fora da pasta:** [`PRODUCT.md`](../PRODUCT.md), [`DESIGN.md`](../DESIGN.md),
as [pesquisas de 12/10](../RESEARCH_DECISIONS.md) e as evidências de execução
em [`../evidence/`](../evidence/).

## Como contribuir

- **Pesquise e proponha com liberdade.** Um plano é ponto de partida, e
  discordar com dado novo vale.
- **Pesquisa nova** vai em `pesquisas/AAAA-MM-DD-tema.md`, com:
  - autoria (pessoa, ou IA e modelo) e data;
  - pergunta e método;
  - o grau de cada afirmação: [oficial], [terceiro], [usuário], [estudo],
    [código], [visto] ou [inferido];
  - fontes com URL e data de acesso.
- **Avaliação nova** vai em `avaliacoes/`, com o estado medido: o commit, o
  aparelho e o que foi visto na tela.
- **Mudança de plano** vai num documento novo em `plano/`. Não reescreva o
  plano de outra pessoa. Decisão de produto é do dono e vira ADR em
  [`../adr/`](../adr/).
- **Todo arquivo novo entra no mapa acima**, ou o `docs-contract` reprova.
- **Ao concluir um item da FILA**, marque na FILA e edite o STATUS. Não crie
  documentos de estado novos.
- As regras do repositório estão no [`AGENTS.md`](../../AGENTS.md). Toda escrita
  passa por um run do Loop, com um escritor por vez. Veja o `git log` e as
  branches antes de começar.
