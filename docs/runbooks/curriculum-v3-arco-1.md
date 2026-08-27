# Currículo V3 — roteiro para produzir o Arco 1

**Preparado em:** 2026-08-27. **Escopo:** continuidade de J3, com auditoria de
cada pacote e preparação da evidência para J4. Este é um roteiro de execução,
não outro documento de estado: consulte [STATUS.md](../STATUS.md) e a Onda J do
[roadmap ativo](../plans/2026-07-27-radiant-launch-roadmap.md).

## 1. Começar do trabalho entregue

O ponto de partida desta passagem é `320e10d`, na branch
`codex/curriculum-v3-foundation`. O commit entrega J2, não as novas aulas.
Se a branch tiver avançado, reconcilie commits e pendências antes de agir; não
resete o checkout nem descarte mudanças para voltar a esse ponto.

Leia, nesta ordem:

1. `AGENTS.md`, [STATUS.md](../STATUS.md) e a Onda J do roadmap;
2. [ADR da trilha contínua](../adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md);
3. [spec V3](../superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md),
   especialmente §§5–12: ciclo de lição, evidências, erros, acessibilidade e
   composição do Arco 1;
4. [plano executado de J2](../superpowers/plans/2026-08-27-curriculum-v3-foundation.md)
   e os contratos em `radiant-app/src/features/curriculum-v3/`;
5. [atlas do conteúdo anterior](../content/mapa-aulas/README.md), somente para
   localizar consumidores e defeitos, não para copiar a direção editorial.

J2 já possui IDs dos arcos, chaves de storage V3, fotografia parcial imutável e
preparação explícita com retomada. Não refazer essa infraestrutura. O startup
do catálogo mantém `curriculum:legacy`; `prepareV3()` não é chamado ali e
`getPublishableManifest()` retorna `null`. Essas barreiras devem continuar
vigentes até haver caminho completo e gates de publicação satisfeitos.

## 2. Decisões que não precisam de nova aprovação

- Público geral interessado ou atuante em radiologia; não rotular quem usa o
  app como “aluno” nem impor perfil acadêmico ou profissional.
- Valor central: prática para melhorar o desempenho diário em radiologia,
  não um início centrado em ética ou atribuições.
- Trilha contínua: Fundamentos (anatomia, fisiologia e física) → Radiografia →
  Mamografia → Tomografia → Ressonância → Medicina Nuclear → Radioterapia →
  outras especializações. Os pilares retornam em espiral nas modalidades.
- Produzir com qualidade, lição por lição. O dono já autorizou a implementação
  e pediu auditor independente, sem aprovação individual dele para cada lição.
- Erro gera explicação e prática direcionada; não retira vidas. XP não
  desbloqueia conteúdo nem comprova domínio. Ausência não apaga histórico.
- A proposta visual da spec é mapa corporal vetorial em 2.5D, com movimento
  que explique relações e controles funcionais; não uma imagem decorativa com
  promessa falsa de interação.

## 3. Sequência de produção

| Pacote | Entrega exigida pela spec |
| --- | --- |
| L1 — O corpo como referência | Referência anatômica, lateralidade do corpo/observador, pares relacionais e mudança de postura. Diagnóstico inicial sem pontuação. |
| L2 — Cortando o espaço | Planos, mediano, obliquidade e distinção entre plano, região amostrada, espessura e imagem; respeitar os limites de §9.3. |
| P1 — Prática intercalada | Cobrir lateralidade, gravidade, todas as famílias relacionais e erros de planos; quantidade derivada da cobertura. |
| L3 — Do corpo para a imagem | Diferenciar fontes de orientação/lateralidade e julgar suficiência, ausência ou conflito de informação, conforme §9.5. |
| C1-A — Mapa corporal | Seis decisões independentes, uma por cobertura da matriz de §9.6. |
| C1-B — Planos e orientação da imagem | Pelo menos oito decisões independentes; não reduzir cobertura para caber em um limite arbitrário. |
| R1/R2 — Revisões | Recuperação ativa em exemplos novos; alvos editoriais após dois outros nós e após cinco a oito, adaptados pelo agendador. |

Comece por **L1 completa**, do conteúdo às interações e seus testes. Submeta ao
auditor, corrija os achados e só então avance ao próximo pacote. Planeje IDs,
objetivos e cobertura do arco desde o início, sem publicar nós futuros vazios.
Não confundir este Arco 1 de orientação espacial com a conclusão de todos os
fundamentos de anatomia, fisiologia e física.

## 4. Procedimento para cada pacote

1. Escrever um plano executável curto em `docs/superpowers/plans/`, ancorado
   nos contratos reais. Definir IDs estáveis de lição, objetivo, atividade e
   item, arquivos exatos, testes e uma forma de inspeção local isolada. Não
   reabrir o design já aprovado por rotina; escalar apenas mudança material de
   produto, risco, permissão ou bloqueio que não possa ser resolvido no escopo.
2. Consultar as fontes primárias/normativas indicadas na spec. Registrar URL,
   edição, seção e data que sustentam cada afirmação. Não inventar referências
   nem substituir silenciosamente a edição fixada por uma página “current”.
   Confirmar proveniência e direitos antes de incorporar imagens ou outros
   ativos; material gerado também precisa de revisão técnica.
3. Produzir conteúdo original em português: situação → modelo → exploração
   real → desafio → feedback causal → transferência → síntese → revisão.
   Evitar texto genérico, reaproveitamento automático e alternativas que
   denunciem a resposta por posição, forma ou linguagem.
4. Relacionar cada objetivo essencial a erro previsível, exemplo ensinado,
   desafio independente, feedback, remediação e revisão. Preservar a taxonomia
   `E-LAT-OBS`, `E-GRV`, `E-REL`, `E-PLN-MED`, `E-PLN-SEC`, `E-PLN-OBL`,
   `E-SRC`, `E-POS` e `E-UNK`, conforme o pacote.
5. Separar `initial_independent`, `assisted_practice` e
   `later_independent_retrieval`. Depois de ajuda, exigir novo item
   independente; repetição imediata e XP não fecham domínio. Variar o exemplo
   de modo a testar transferência, não apenas memória de posição.
6. Implementar interações e animações que mudem o estado e ensinem algo
   observável, usando TDD para o comportamento. Entregar controles discretos
   nomeados, alternativa ao gesto, descrição textual equivalente sem revelar
   a resposta, redundância além de cor e modo estático para Reduce Motion.
7. Executar testes de conteúdo, avaliação, progresso e retomada proporcionais
   ao que mudou; inspecionar a experiência local e registrar o que foi
   realmente exercitado. Não chamar um mock, screenshot estático ou teste
   automatizado de prova de interação ou acessibilidade em aparelho.
8. Encaminhar a versão exata ao auditor, corrigir e repetir a revisão quando
   necessário. Registrar fontes, achados, correções, parecer e pendências.
   Atualizar o status/roadmap e o cartão existente no Trello sem duplicação.

Os schemas de lições, os IDs concretos e a integração de demonstração de J3
ainda precisam ser definidos no plano; este roteiro não afirma que já existem.
O fato de os validadores legados passarem não prova a qualidade de conteúdo V3.

## 5. Contrato do auditor independente

Criar um subagente com função explícita de auditor de anatomia, orientação
espacial e imagem médica. Ele revisa a versão produzida, não é o autor dela.
Fornecer spec, fontes, matriz de cobertura, conteúdo, código/interações e
evidências disponíveis. Não atribuir credenciais humanas ao agente.

O parecer deve verificar precisão, limites, clareza, erros conceituais,
independência da avaliação, equivalência acessível e direitos dos ativos.
Classificar achados por gravidade e registrar **aprovado**, **aprovado com
correções** ou **reprovado**, com justificativas rastreáveis. Correções exigidas
precisam ser incorporadas e conferidas antes de considerar o pacote aprovado.

A aprovação anterior do desenho não aprova automaticamente a implementação.
Revisão por IA, inspeção visual local, QA manual e teste em aparelho são
evidências distintas. O parecer não fecha testes que o auditor não executou.

## 6. Limites que permanecem fechados

- J3 não ativa o currículo no app distribuído, não chama `prepareV3()` no
  startup e não publica catálogo incompleto. J4 concentra os gates de revisão
  e acessibilidade; J5 é o corte das superfícies e validação no iPhone 16.
- Não herdar conteúdo, respostas, tentativas ou domínio do currículo anterior.
  Reutilizar código só após conferir o contrato; não religar funcionalidades
  desligadas sem tratar seus gates existentes.
- A fotografia J2 contém somente quatro fontes. SM2, checkpoints, XP e
  preferências permanecem intocados. J5 deve inventariar consumidores, pausar
  escritores e definir captura final; fotografia antecipada não é backup
  integral nem retrato completo do instante de corte.
- Não apagar arquivos legados, fazer push, build, upload ou submissão de loja
  neste roteiro sem autorização específica aplicável. O `(9)` do TestFlight
  documenta o defeito anterior, não contém esta entrega.
- Não acessar segredos, dados pessoais de testadores ou imagens identificáveis.
  Não editar o cérebro/vault diretamente. Usar Trello, não Todoist.

## 7. Execução e encerramento

Ativar `task-observer`, `using-loop` e sessão de leitura; consultar o cérebro
antes de decidir. Inspecionar `git status`, commits e branches. O checkout
atual contém insumos editoriais locais ignorados necessários aos validadores:
não presumir que um worktree limpo os possui, não copiá-los nem enfraquecer
validadores para contornar a falta.

Abrir cada run pelo wrapper `node scripts/loop/abrir.mjs`, declarando todos os
arquivos, inclusive subprodutos e documentação, antes de escrever. O plano deve
respeitar `writePolicy.allowedRoots` e a grafia real dos caminhos. Manter um
único escritor; se o auditor precisar gravar, coordenar explicitamente o escopo.
`PROJECT_BUSY` não autoriza recuperar lock de outra sessão.

Comandos Expo/Jest/TypeScript pertencem a `radiant-app`; usar seu Node 20
configurado, `EXPO_NO_DOTENV=1` e `CI=1` nos checks. A CLI Loop usa seu launcher
Node 24+. Não executar E2E junto de `loop validate`.

Antes de finalizar: ler o diff, atualizar documentação, validar, congelar os
arquivos e executar separadamente `loop step finish`, memória opcional apenas
após sucesso e `loop run close`, verificando cada envelope. Fechar a sessão do
cérebro separadamente. Relatar arquivos, commits, validações reais, parecer do
auditor e gates pendentes; não marcar J3/J4/J5 concluídos por planejamento ou
aprovação de design.
