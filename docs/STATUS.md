# Radiant — Status

**Este é o único documento de estado vivo do projeto.** O caminho
(`docs/STATUS.md`) não tem data no nome de propósito: qualquer configuração,
README ou skill que injete contexto automaticamente deve apontar para cá e para
mais nada.

O histórico datado está em [`archive/`](archive/) — 21 arquivos, de
`EXECUTION_STATUS_2026-04-05` a `EXECUTION_STATUS_2026-08-15`. Eles continuam
sendo a evidência de cada passagem e são citados pelos ADRs e planos. **Não
escreva um novo.** Edite este.

---

## Como este documento envelhece

Toda afirmação abaixo tem uma **data de medição** e, quando existe, o **comando
que a remede**. Contagem escrita envelhece; comando não. Se você chegou aqui
para decidir alguma coisa, remeça antes de citar.

```bash
git rev-parse --short HEAD && git status --porcelain
git branch -a && gh pr list --state open
```

---

## Publicação — o que está nas lojas

| Loja | Artefato | Estado | **Medido em** |
| --- | --- | --- | --- |
| App Store | `1.3.1 (11)` | 🟢 **Pronto para distribuição** — liberado pelo dono em 2026-09-14 após aprovação no mesmo dia; https://apps.apple.com/app/radiant-radiologia/id6797078156 (indexação da busca em até 24 h). Tag `v1.3.1` = `063770d` | **2026-09-14** |
| Play — alpha fechado | `1.3.0 (4)` | Ativo · lista "Radiant Alpha" com 14 usuários · lançada 31/07 15:45 | **2026-08-24** |

> 🔴 **A rejeição chegou em 14/08 às 02:54 e ficou dez dias sem leitura.** Este
> documento afirmou "Aguardando revisão" o tempo todo, porque a leitura anterior
> era de 2026-08-09 e ninguém remediu. **A medição vencida não é um detalhe de
> higiene: ela sustentou uma afirmação falsa sobre o estado do lançamento.**
>
> **A mensagem da Apple pede informações; não atesta ausência de defeitos.** É `Guideline 2.1 - Information Needed - New App
> Submission`: a Apple pede informação para conseguir avaliar. O plano de
> resposta, item a item, está em
> [`release/APP_REVIEW_REPLY_1.3.1.md`](release/APP_REVIEW_REPLY_1.3.1.md).
>
> ✅ **O bloqueio do contrato caiu em 2026-08-24.** O titular aceitou o contrato
> de licença atualizado, e a faixa sumiu da lista de apps do App Store Connect —
> verificado onde o bloqueio se manifestava, não onde ele foi resolvido. Restam
> dois avisos, nenhum bloqueando o Brasil: **status de comerciante do DSA** (não
> informado) e as **perguntas novas de rede social** na classificação etária,
> cuja classificação já está preenchida.
>
> **Não medido:** o painel dos 12 testadores por 14 dias do Play não está exposto
> na visão geral da publicação nem na faixa; **não se sabe se o relógio começou**.

Git não substitui essa medição: a última tag é `v1.2.1`, de 2026-07-26, e `main`
está **392 commits à frente dela** (medido em 2026-08-24). Não existe tag
`v1.3.x` — o repositório não registra o que foi lançado. **O build em revisão é
anterior a toda a reformulação da trilha e do Perfil**; a próxima submissão
carrega o pacote inteiro.

## Bloqueios de lançamento, por latência

1. **iOS** — 🔴 **rejeitado, e a bola está do nosso lado.** Decidido em
   2026-08-24: **responder com um build novo do `main`, não com o `(7)`.** O
   binário em revisão saiu de `5b2c89e` e está **138 commits atrás**; ele ainda
   carrega `src/app/modal.tsx`, o template do Expo com o texto `This is a modal`
   em inglês — passivo direto sob `2.1.0 App Completeness`, que é o código da
   rejeição. A versão `1.3.1` está em estado editável, então o build novo é
   **anexado sem cancelar o envio**. Saiu como **`1.3.1 (9)`** em 2026-08-24 — a
   primeira execução do build consumiu o `(8)` e a segunda, com `--auto-submit`,
   gerou o `(9)`, que é o que subiu (EAS numera sozinho:
   `appVersionSource: remote` + `autoIncrement`).

   **Atualizado em 2026-08-27:** o `(9)` está instalado no iPhone 16 com iOS
   27.0. A captura de uma lição comprova abertura, mas revelou um painel de
   tórax sem relação com o tema profissão. **Vídeo final e reenvio ficam
   pendentes da correção e da revisão das lições**, detalhadas na
   [auditoria de conteúdo e apresentação](content/2026-08-27-revisao-licoes-ios.md).
   As 16 lições geradas do catálogo local também dependem de textos genéricos
   nas etapas de ensino; as 32 questões mantêm a resposta correta na primeira
   posição no percurso legado inspecionado. Não confundir esse conjunto com
   as atividades v2 promovidas.

   **Painel visual legado removido em 2026-09-08.** O primeiro achado da
   auditoria foi corrigido: `LessonVisualPanel` e o raster
   `lesson-xray-panel.png` saíram do repositório, junto das dicas globais
   `panelHint`/`panelCaption` de `LessonFlowScreen`. O painel não tinha modelo
   de mídia — era **uma** imagem fixa para toda lição —, o raster era um mockup
   com o texto em inglês `Lesson Flow: Variant 2 of 3` e `Tap to Learn`, e a
   lupa com "Toque para examinar" não tinha controle de toque atrás. Os dois
   testes que exercitavam a tela **mockavam o painel**, e foi isso que deixou a
   suíte verde com o defeito visível no `(9)`; o mock saiu e uma regressão
   afirma a ausência da afordância falsa. **Evidência medida em 2026-09-08:**
   25 suítes e 194 testes aprovados (`npx jest --runInBand src/features/lesson-flow
   src/features/journey`, em `radiant-app`), `npm run typecheck` aprovado,
   `npm run lint` com 0 erros e os mesmos 28 avisos preexistentes.
   **A lição legada fica sem elemento gráfico** até o Currículo V3 substituir
   esse caminho. **O `(9)` continua contendo o defeito** — ele é anterior a esta
   correção, então o vídeo para a App Review exige um build novo. Os demais
   achado da auditoria (texto genérico nas etapas de ensino) continua aberto.

   **Ordem das alternativas corrigida em 2026-09-08.** As 32 questões tinham a
   resposta correta na primeira posição — quem respondesse sempre "a" acertaria
   o catálogo inteiro sem ler o enunciado. O viés não estava no app: ele nasce
   em `scripts/content/generate-local-bundles.py`, atravessa
   `catalog-payload.json` intacto (32/32 com `correct: 0`) e é copiado
   fielmente por `mapQuizBundle`. A ordem passou a ser decidida em
   `scripts/content/catalog-runtime.mjs`, com permutação determinística semeada
   pelo id da questão — o ponto que **app e API compartilham**, então as duas
   cópias saem coerentes. **Distribuição medida depois:** `{0:12, 1:2, 2:11,
   3:7}` nas quatro posições, contra 32/32 antes. Três propriedades derivadas
   do payload (não de lista escrita à mão) guardam a correção: o rótulo correto
   é preservado pela permutação, as quatro posições são usadas, e a saída é
   idêntica entre execuções. Nenhuma tentativa persiste o índice escolhido
   (`LearningAttempt` guarda contagens), então não há histórico a migrar.

   **App Store Connect medido pelo dono em 2026-09-11**, com capturas de tela
   lidas nesta sessão — não presumido:
   - **Disponibilidade: 1 país (Brasil), 174 indisponíveis.** Os "172 países"
     citados em 24/08 eram a agrupação da **classificação etária**, não a
     disponibilidade; o app nunca esteve à venda fora do Brasil. Decisão do
     dono: lançar só no Brasil e expandir depois. **O aviso de comerciante do
     DSA perde o objeto** — é de conta, não do app, e só alcança quem
     distribui na UE. Se um dia entrar país da UE (Portugal incluído), a
     declaração passa a ser exigida.
   - **Classificação etária: os 7 passos percorridos, nenhuma pergunta em
     branco, `Salvar` desabilitado por ausência de mudança.** Calculada +13,
     Brasil A12, sem substituição. A única resposta fora de "nenhum" é
     *Informações médicas ou sobre tratamentos: pouco frequente* — coerente
     com o item 7 da resposta à Apple ("educacional, não diagnostica").
     *Competições: nenhum*, coerente com a decisão de 2026-08-15 de não
     comparar alunos. Recursos, UGC, redes sociais, web irrestrita: não.
   - **As 6 capturas da página do produto mostram o painel visual removido em
     2026-09-08** (raio-X de tórax, "Observe a cena com calma", "Compare
     densidade, borda e contexto anatômico"). Com o build novo, a página
     prometeria uma tela que o binário não tem — diretriz 2.3.3. **Trocar as
     capturas é pré-requisito do reenvio**, na mesma sessão de aparelho que
     grava o vídeo. 0 de 3 pré-visualizações; não é pendência.
   - **Direitos de conteúdo** em *Informações do app*: "Sim, este app tem os
     direitos necessários para os conteúdos de terceiros" — a declaração que
     a resposta ao item 7 precisa respeitar.

   Com isso a tarefa "serviços e privacidade" fecha: Sentry medido inerte em
   2026-09-08, disponibilidade e classificação confirmadas em 2026-09-11.

   **Item 7 (direitos e setor regulado) decidido pelo dono em 2026-09-11.** A
   única fonte dos 16 quizzes embarcados, *Fundamentos de Radiologia*, estava
   `blocked` desde 2026-07-31 "até revisão humana", sustentada por uma exceção
   datada que venceria em **2026-09-30** — e o vencimento faria
   `validate-source-rights` reprovar e nenhum run fechar. A revisão humana
   aconteceu: a obra passou a `reference-only` / `factual-reference` em
   `Conteúdo/fontes/library-catalog.json`, com base medida (zero sequências de
   8 palavras, nenhuma imagem de terceiro, redação original), e a exceção foi
   encerrada. O validador passa sem exceção. As 32 explicações foram lidas
   uma a uma: nenhuma linguagem de orientação clínica ao leitor. O texto final
   em inglês está no [plano de resposta](release/APP_REVIEW_REPLY_1.3.1.md),
   item 7. **Nota de domínio, fora do escopo da Apple:** a explicação sobre
   proteção gonadal descreve a prática clássica; a recomendação internacional
   (AAPM, 2019) desaconselha a proteção rotineira — entra na revisão de
   conteúdo por tema.

   **Build `1.3.1 (10)` gerado, enviado e testado em 2026-09-11.** Saiu de
   `main` = `321ebec`, de um checkout limpo (`~/Developer/Radiant-release`),
   sem nada não-commitado; EAS `ca376ed8`, `--auto-submit`, aceito pela Apple.
   No iPhone 16 / iOS 27.0: abre, lição inteira concluída com 3 estrelas,
   progresso da unidade avançou (5 de 14). **Mas o `(10)` não é o binário do
   reenvio.** O primeiro quadro da gravação mostrou, no fim do Perfil, o
   cartão *Conta e sincronização* com o formulário de login inteiro — Email,
   Senha, Token, *Entrar para sincronizar*, *Criar conta*, *Solicitar reset* —
   **inerte**: `remoteSyncAvailable` travava os handlers, não a renderização, e
   a suíte da tela rodava inteira com sync ligado, então a configuração de
   produção nunca fora renderizada por teste. Contradiz o item 4 da resposta
   ("no account, login, or credentials") e é a hipótese mais forte para o
   "Information Needed" original. **Corrigido em 2026-09-11**: o cartão some
   quando o sync remoto não está disponível; teste com a configuração de
   produção afirma a ausência de todos os controles e a permanência da ajuda
   legal (4 suítes, 22 testes; `tsc` limpo; lint 0 erros). A gravação de
   17,8 s também não serve como vídeo do item 1 — começa dentro do app. **O
   reenvio sai do `(11)`**, com vídeo e capturas gravados dele.

   **Decisão de produto em 2026-09-11 (dono):** login e assinatura são feature
   da **1.4**, desenhada junto — backend em produção, conta de demonstração,
   exclusão de conta (5.1.1(v)), Privacy Labels refeitas e In-App Purchase se
   houver plano pago. Não entram no reenvio da 1.3.1. Merece ADR quando o
   desenho começar. Também decidido: **V3 vira 1.4**; o reenvio agora leva o
   app legado corrigido.

   **Build `1.3.1 (11)` verificado no aparelho em 2026-09-11, 19:14.** Saiu de
   `main` = `063770d`, do mesmo checkout limpo; EAS `7c18e187`, aceito pela
   Apple. No iPhone 16 / iOS 27.0, por captura: o Perfil vai de *Tópicos*
   direto a *Ajuda e informações* — **o cartão de conta sumiu**; o cabeçalho
   diz "Estudo local, sem conta". **A atualização `(10)` → `(11)` preservou o
   histórico local** (38 XP, 3 lições, 2 revisões, iguais aos do `(10)`) — a
   primeira medição de atualização entre builds neste projeto. **Este é o
   binário do reenvio.** O que falta é só de aparelho: o vídeo do item 1 numa
   tomada única a partir da tela inicial do iOS (os três clipes de hoje têm
   7–18 s e começam dentro do app) e as 6 capturas para a página do produto.

   **Reenviado à App Review em 2026-09-12, pelo dono.** Build **`1.3.1 (11)`**
   anexado à versão rejeitada (estado editável, sem cancelar o envio). Vídeo
   do item 1: gravação contínua de 32 s no iPhone 16 / iOS 27.0, da tela
   inicial do iOS à aba Perfil, passando por boas-vindas ("Funciona offline,
   sem conta" + aviso educacional), lição completa, três estrelas e trilha —
   quadros verificados em tempos exatos, não pela miniatura. Seis capturas
   novas na página do produto (trilha, conclusão, "sem conta", lição,
   checkpoint, perfil), sem painel e sem formulário; tiradas do `(11)` abertas
   pela tela inicial, sem o indicador do TestFlight na barra. Campo *Notes*
   com o bloco dos 7 itens (3.945 caracteres). Material consolidado em
   `~/Desktop/Radiant - reenvio 1.3.1 (11)/`, fora do repositório. **Próxima
   medição: o status da versão no App Store Connect** — não inferir de e-mail
   nem de TestFlight. Enquanto a revisão correr, não alterar disponibilidade,
   classificação etária ou Privacy Labels.

   **Correção em 2026-09-13: o parágrafo acima estava errado — em 12/09 houve a
   resposta ao revisor, não o reenvio.** No App Store Connect, responder à
   mensagem e reenviar para revisão são ações separadas, em páginas
   diferentes; o roteiro do agente as apresentou como uma sequência e o
   segundo passo não foi executado. A Apple respondeu em 13/09 às 07:34:
   *"unable to proceed … status is currently 'Prepare for Submission'. You
   will need to submit a new build for review"* — frase padrão; o `(11)` já
   estava vinculado e nenhum build novo foi necessário. O console mostrava
   *Envio do iOS · Problemas não resolvidos · build (11) · Pronto para
   revisão* e o botão **Reenviar para Revisão do app** ainda visível — isto
   é, preparado e não enviado. O dono clicou em **Reenviar para Revisão do
   app** em 2026-09-13 e o cabeçalho da versão passou a **Aguardando
   revisão**, medido na tela. Este é o momento em que a Apple recebeu o
   `(11)`. Evidência da coleta de 13/09 (relatório da sessão Codex) em
   `~/Desktop/Radiant - evidências Apple 2026-09-13/`, fora do repositório.

   **Aprovado em 2026-09-14.** Dois e-mails do App Store Connect, 17:40 e
   17:41 BRT: *"Review of your submission has been completed. It is now
   eligible for distribution"* (Submission ID
   `93758050-6a5b-42d5-957c-575224b14fbb`, item aceito *1.3.1 for iOS*) e
   *"Welcome to the App Store … approved for distribution"*. Link:
   https://apps.apple.com/app/radiant-radiologia/id6797078156. **A aprovação
   não é a publicação:** se a versão estiver em *Pendente de lançamento pelo
   desenvolvedor*, falta o botão *Lançar esta versão*; se estiver em *Pronto
   para venda*, a loja indexa em até 24 h. Medir no console antes de afirmar
   "no ar". Linha do tempo: rejeição 14/08 → correções 08–11/09 (painel,
   ordem das alternativas, cartão de login) → `(11)` 11/09 → resposta 12/09 →
   reenvio efetivo 13/09 → aprovação 14/09. O que a Apple aprovou é o app
   legado corrigido; **V3, login e assinatura são a 1.4**. Ao publicar,
   marcar `v1.3.1` no git — a última tag é `v1.2.1`, e o repositório não
   registra o que foi lançado desde então.

   **Liberado em 2026-09-14.** A versão estava em *Liberação do desenvolvedor
   pendente*; o dono clicou em *Liberar esta versão* e o console passou a
   **Pronto para distribuição** (captura lida nesta sessão). As 6 capturas
   novas e o texto promocional ("Funciona offline e sem login") conferidos na
   mesma tela. **Tag `v1.3.1` criada em `063770d`** — o commit de que o
   binário `(11)` foi construído, não o HEAD dos documentos. Primeira tag
   desde `v1.2.1` (2026-07-26). Sem push; a tag é local até alguém decidir.

   O bloqueio nº 1 desta lista — iOS — **fecha aqui**. O que segue é outra
   fase: revisão de conteúdo por tema, e a 1.4 (V3 + login/assinatura).

   **1.4 desenhada em 2026-09-14 — fluxo do usuário e padrão de robustez.**
   Spec aprovada seção a seção pelo dono:
   [`2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`](superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md).
   Dez decisões, entre elas: freemium por **vidas** (5, +1 a cada 30 min,
   revisão nunca consome, assinante ilimitado); **trilha soberana** (o motor
   `NextNodeResolver` escolhe o nó: pausada > revisão devida > checkpoint >
   próxima lição); **assinatura por StoreKit 2 direto**, sem trial, sem
   terceiro; **backup no iCloud** em vez de conta própria; **Sentry ligado**
   com rótulo "Dados de falha, não vinculados". Regra de ouro: toda tela de
   estudo funciona sem rede, sem conta e sem assinatura — as frases aprovadas
   pela Apple continuam verdadeiras. Fora desta spec, com spec própria: V3 na
   tela (J3–J5), sistema de desenho. Do dono, fora do app: acordo de apps
   pagos no App Store Connect (obrigatório antes de submeter a 1.4) e o preço.
   **Planejamento iniciado em 2026-09-14.** O plano executável está em
   [`2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md`](superpowers/plans/2026-09-14-radiant-1-4-fluxo-do-usuario-plan.md),
   medido contra a spec, o checkout `6e7f804` e a política de escrita do Loop.
   Serviços puros vêm primeiro; os adaptadores nativos de StoreKit/iCloud ficam
   atrás de build interno e ações do dono. Nenhum build, envio ou publicação foi
   autorizado por este plano.

   **Task 1 concluída localmente em 2026-09-14:** `NextNodeResolver` implementa
   os quatro degraus da spec com relógio injetado e nenhum IO. A suíte focada
   passou com 9/9 casos; a ligação ao snapshot da trilha permanece para a Task 3.

   **Task 2 concluída localmente em 2026-09-14:** a economia de vidas agora tem
   serviço puro e repositório serializado, com persistência restrita a `count`,
   `lastRefillAt` e `unlimitedUntil`. A matriz focada passou com 18/18 casos,
   incluindo relógio reverso, salto à frente, expiração e concorrência.

   **Task 3 concluída localmente em 2026-09-14:** o snapshot delega a escolha
   soberana ao resolver, preserva `nextRecommendedNode`, carrega o vencimento
   real do SM-2 e persiste o passo de retomada. Typecheck e 25/25 testes focados
   passaram. A ligação da rota resolvida às telas/notificações fica nas tarefas
   de superfície, sem ativar push nem currículo novo aqui.

   **Task 4 concluída localmente em 2026-09-14:** a abertura agora migra o
   progresso pedagógico v1.3.1 antes dos demais serviços, grava backup antes da
   primeira mutação, recupera interrupções e mantém autenticação fora do escopo
   migrado. Falha recuperável abre o modo local com aviso do Pixel; somente
   migrações acima de um segundo exibem progresso detalhado. Typecheck, lint e
   28/28 testes focados passaram; nenhum adaptador nativo foi ativado.

   **Task 5 concluída localmente em 2026-09-14:** a trilha soberana agora é uma
   `FlatList` de bandas e nós com chaves estáveis; revisão devida e retomada
   explicam o motivo do próximo nó. O HUD lê as vidas do repositório próprio,
   mostra recuperação ou infinito e abre uma folha modal com Esperar, Revisar e
   Assinar conforme disponibilidade. Carregamento, falha recuperável e fim do
   conteúdo têm estados explícitos. Typecheck, lint e 54/54 testes focados
   passaram; K4 permanece aberta até os fluxos de estudo da Task 6.

   **Task 6 concluída localmente em 2026-09-14:** respostas erradas debitam
   uma vida somente na confirmação, com proteção contra toque duplo; ao zerar,
   lição e checkpoint pausam sem perder o ponto seguro de retomada. Revisões
   continuam gratuitas e devolvem uma vida uma única vez por sessão concluída.
   O resumo informa a próxima revisão agendada, e as ofertas antigas foram
   retiradas das conclusões de checkpoint e conquista. Typecheck, lint e 50/50
   testes focados passaram; nenhuma compra, módulo nativo ou build foi ativado.

   **Inventário ampliado em 2026-08-27:** o [atlas das aulas](content/mapa-aulas/README.md)
   separa 18 aulas legadas, 12 atividades promovidas, 72 nós construídos na
   trilha e 96 pacotes editoriais. Os 48 cartões editoriais não alimentam a
   revisão atual. O Canvas e nove notas foram instalados, após autorização, em
   `Projetos/Radiant/Revisão das aulas`, fora do cérebro do projeto; abertura,
   enquadramento e navegação entre notas foram conferidos no Obsidian.
   Propostas de estética, dinâmica e dois pilotos estão explicitamente
   separadas do inventário; revisão de domínio e implementação continuam abertas.

   **Decisão curricular em 2026-08-27:** o dono aposentou a direção editorial
   anterior e aprovou o [Currículo V3](superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md).
   A estrada passa a ser contínua: Fundamentos (anatomia, fisiologia e física) →
   Radiografia → Mamografia → Tomografia → Ressonância → Medicina Nuclear →
   Radioterapia → outras especializações. O Arco 1 de orientação espacial foi
   aprovado com correções por auditor independente, sem reprovação conceitual.
   **J2 implementada localmente em 2026-08-27:** a fundação versionada do
   [plano técnico](superpowers/plans/2026-08-27-curriculum-v3-foundation.md)
   define IDs estáveis, chaves V3 isoladas e preparação explícita com fotografia
   imutável de quatro fontes do histórico. A inicialização do catálogo cria
   apenas o marcador de currículo legado; não chama a preparação nem ativa o V3.
   Estados desconhecidos/corrompidos não são regravados, erros de armazenamento
   permitem retomada e nenhum domínio anterior é convertido em domínio V3.
   A fotografia é **parcial**, não um backup integral nem o snapshot final do
   corte: SM2, checkpoints, XP e preferências continuam intocados, com inventário
   de consumidores e pausa dos escritores legados obrigatórios em J5.
   **Evidência medida em 2026-08-27:** cinco suítes focadas, 74 testes aprovados
   (`npm test -- --runInBand src/features/curriculum-v3/
   src/features/content/services/LessonCatalogService.test.ts
   src/features/journey/services/JourneyProgressService.test.ts`, em `radiant-app`);
   `npm run typecheck` aprovado; `npm run lint` sem erros e com 28 avisos em
   arquivos preexistentes fora desta mudança. Revisão independente do código sem
   achados críticos/importantes; sugestão de testar persistência seguida de erro
   incorporada. Fechamento registrado no commit local `320e10d`, na branch
   `codex/curriculum-v3-foundation`: os 14 validadores do run
   `run-1787851096220-d09a361b` passaram; o run e sua sessão de leitura foram
   encerrados. Sem push, build ou submissão nesta entrega.
   Nenhuma tela, conteúdo do catálogo, progresso ou binário foi
   alterado; a trilha anterior continua visível até J5.
   A [ADR do V3](adr/ADR-2026-08-27-curriculo-v3-trilha-continua.md) preserva o
   histórico anterior durante a migração e proíbe apagar o legado antes de
   testes de atualização e ausência de consumidores.

   **Próxima execução do agente: J3 — produzir o Arco 1**, começando por
   **L1 — O corpo como referência**. O [roteiro de continuidade](runbooks/curriculum-v3-arco-1.md)
   reúne leituras, sequência, critérios de aceite e limites; não substitui este
   status. J3/J4/J5 continuam abertos. O design aprovado não significa lições,
   animações ou acessibilidade já implementadas ou validadas no aplicativo.

   Sequência atual: produzir e validar o Arco 1 sobre a fundação V3 →
   retirar a trilha anterior das superfícies sem
   apagar seu histórico → preparar novo build com
   autorização → instalar pelo TestFlight → testar fluxo completo e
   persistência → gravar vídeo desse mesmo build → selecionar o build validado
   e responder à Apple com autorização. **O `(9)` documenta o defeito, não uma
   correção futura.** O acompanhamento passa ao
   [Trello](https://trello.com/c/f9OYyCX5), conforme escolha do dono; sem novas
   ações no Todoist. Detalhe das perguntas da Apple em
   [`release/APP_REVIEW_REPLY_1.3.1.md`](release/APP_REVIEW_REPLY_1.3.1.md).

   ⚠️ **Smoke físico completo do candidato ainda pendente** — a matriz
   real-device está no build `(5)`. A captura do `(9)` não comprova conclusão,
   persistência ou uso offline; testes automáticos não validam por si só a
   coerência pedagógica da tela.
2. **Play** — ≥12 testadores participando por 14 dias corridos (F2). O relógio
   não havia começado na última leitura. Exigência de conta pessoal; não há
   atalho de engenharia.
3. **Play** — questionário IARC (E4), aparelho Android físico (C4), TalkBack (C5).

O go/no-go item a item vive em
[`release/CHECKLIST_RELEASE_V1.3.md`](release/CHECKLIST_RELEASE_V1.3.md); o que
está executável agora, em [`FILA.md`](FILA.md).

## Estado do repositório — medido em 2026-08-21

Uma branch: `main`. Nenhum PR aberto. Nenhum worktree.

A unificação de 2026-08-21 fechou uma divergência de duas sessões paralelas de
IA que trabalharam o mesmo dia sem se ver:

- **PR #5** (`feat/atividade-fim-licao`, sub-projeto 1/6) — mergeado. Estava
  OPEN, MERGEABLE e com CI verde havia 4 dias.
- **`c7cba6a`** — bugfix da trilha que **nunca havia sido enviado ao remoto** e
  por isso ficou de fora do PR #5. Recuperado por cherry-pick.
- **PR #6** (sub-projeto 2/6) — resgate de uma branch órfã com 1.524 linhas de
  produto e nenhum PR: `JourneyCurriculumService` (percurso contínuo),
  `LessonFlowScreen` terminando em conclusão, `DevConsoleScreen` fora da tela do
  aluno, `ProgressScreen` enxugada.
- 7 branches mortos podados (local e remoto).

**A aba Galáxia deixou de existir em 2026-08-21.** A barra tem Estude, Progresso
e Missões. `JourneyCurriculumService`, que chegou no merge do sub-projeto 2 sem
nenhum consumidor, passou a alimentar a trilha contínua da aba Estude.

A verificação que autorizou a remoção achou algo mais forte que cobertura: o
único nó de lição da Galáxia apontava para um `lessonId` inexistente no catálogo
— **a cadeia já estava quebrada.** `TrailCoverage.test.ts` agora guarda a
invariante que passou a valer: toda lição do catálogo é alcançável pela trilha.

## Reformulação guiada pelo EWA — 2 de 6

| # | Sub-projeto | Estado |
| --- | --- | --- |
| 1 | Atividade enxuta e conclusão de lição | ✅ em `main` |
| 2 | Percurso contínuo, conclusão, dev-console | ✅ em `main` |
| 2b | **Estude é a trilha; Galáxia absorvida** | ✅ em `main` (2026-08-21) — aba renomeada, Galáxia removida do app, trilha contínua ligada |
| 2c | **Caminho preenchido, cabeçalho de estágio, avaliação por competência** | ✅ em `main` (2026-08-21) |
| 3 | **Aba Perfil: Progresso + Missões + identidade** | ✅ em `main` (2026-08-21) — a barra tem duas abas |
| 4 | Marca no topo com símbolo de radiação | precisa da arte existir |
| 5 | Arte da trilha e ícones de HUD | assets autorais do dono; Rive fechado |
| 6 | Liga, ranqueamento e social | colide com o contrato de privacidade |

## O ponto cego do gate — medido em 2026-08-21

O sub-projeto 2 chegou à `main` com `src/app/dev-console.test.tsx`. O
`require.context` do expo-router varre `src/app` inteiro para montar as rotas,
então esse arquivo entrava **no bundle** e arrastava
`@testing-library/react-native`, que pede o módulo `console` do Node. **O app
não abria** — tela vermelha na inicialização.

Os 16 passos do gate passaram todos. Não por descuido: **nenhum deles empacota o
app.** Lint, typecheck, 712 testes e visual QA strict são compatíveis com um
binário que não inicia.

Corrigido em `3dc3388`: o teste foi para `src/test/routes/` e a regra virou o
contrato `route-tree-purity-contract` (14º do gate), que falha se qualquer
`*.test.*` aparecer sob `src/app`. A falha foi provada com uma sonda.

**A lacuna continua aberta.** Só a abertura real do app pega essa classe de
defeito, e ela não está em nenhum passo automatizado. Até estar, subir o app no
simulador faz parte de verificar uma passagem.

## A trilha, medida em 2026-08-21

- **A linha é contínua e vem preenchida** até a posição do aluno, com **uma**
  fronteira entre percorrido e pendente. Cada nó carrega o seu segmento, que
  transborda para a folga seguinte e costura no próximo — não há buraco nas
  alturas dos cartões. Duas versões erradas ficaram pelo caminho e as duas
  passavam nos testes: a listrada (cor por nó vizinho) e a picotada (segmento
  dentro de um `View` sem altura própria). Só o simulador pegou as duas.
- **Pílula `PRÓXIMO`** no nó atual, reconhecível sem ler rótulo.
- **Cabeçalho de estágio** no topo (nome, `N de M`, barra) no lugar do
  `JourneyHero`. Adendo registrado no `ADR-2026-08-13`: a fala esporádica do
  Pixel perdeu a única superfície.
- **Uma avaliação fecha cada estágio** nas quatro trilhas. Na trilha por
  competências, o estágio é a competência: as 12 atividades cobrem 5, e os 10
  itens da avaliação foram repartidos dois a dois, com o limiar de 80% intacto.

**Em aberto para o dono:** se o Pixel deve voltar a falar espontaneamente em
alguma superfície. Hoje ele só fala como reação a evento.

## A barra, medida em 2026-08-21

Duas abas: **Estude** (a trilha) e **Perfil** (identidade + Missões + Progresso).
O console de desenvolvimento vive fora das abas, em `/dev-console`, atrás de
`SHOW_DEV_TOOLS` — a separação veio antes da agregação de propósito.

O que a referência do EWA tem e o Perfil não tem: seguidores, chats e liga entre
pessoas. O `STUDENT_CHECKPOINT_PRIVACY_CONTRACT` não admite comparação entre
alunos; a liga é métrica local, por decisão de 2026-08-15.

**Requisito de loja preservado:** o cartão **Ajuda e informações** — Política de
Privacidade e Central de Suporte — continua no app, agora no fim da rolagem do
Perfil. Verificado em simulador.

**Armadilha registrada:** os flows do Maestro **não rodam** no `npm run quality`;
só o contrato deles roda, e ele afirma estrutura, não copy contra tela. Em
2026-08-21 uma mudança de copy quebrou 20 asserções em 9 flows sem nenhum sinal.
Ao mudar texto de tela, greppe `.maestro/` no mesmo passo.

## Varredura de QA — 2026-08-21, fechada em 2026-08-24

Relatório completo, com evidência de tela:
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).

O ciclo crítico inteiro funciona percorrido no simulador, sem erro de console:
`trilha → lição → conclusão com estrelas → checkpoint → conquista → próxima`.

**Fechado em 2026-08-24:**

- **`npm run ios:v2` entregava flags diferentes das que imprimia.** Um `.env`
  local vencia o `export` do script e o `EXPO_NO_DOTENV=1` — isolado por
  experimento controlado, não por leitura de código. `check-env-precedence.mjs`
  passou a verificar o efeito **antes** de o script prometer qualquer coisa, e
  cobre também `API_BASE_URL`, que era a chave mais perigosa. O `.env` da máquina
  do dono foi alinhado, com backup em `~/.radiant-env.backup-2026-08-24`.
- **`/dev-console` ganhou porta** no fim da rolagem do Perfil, atrás de
  `SHOW_DEV_TOOLS`. É porta, não controle: os controles seguem proibidos ali, e
  a distinção está travada por teste nos dois sentidos.
- **`/modal` removida** — era o modal literal do template Expo. Arquivos de rota
  e `Stack.Screen` declarados agora batem 1:1.
- **O kill switch foi acionado pela primeira vez** — ver a seção abaixo.

**Os órfãos foram resolvidos em 2026-08-24.** A lista de 13 escondia três
estados com remédios opostos, e a triagem por **tamanho e origem** — não por
grafo de imports — separou os três. Seis arquivos tinham **0 byte** e entraram
vazios no bulk `847a12d`: a "feature `annotation` inteira" era tela, componente e
serviço vazios, e a doutrina que protegia conhecimento de domínio não tinha
objeto. Dois eram duplicata de implementação viva (`models/sm2.ts` contra o SM-2
próprio do `SpacedRepetitionService`; `services/xp.ts` contra `XP_RULES` do
`GamificationService`). Três estavam mortos sem irmão vivo. **Os 11 saíram**, com
gate verde nas duas redes.

**Três não eram andaime, e continuam por decisão do dono:**

- `src/data/ai-catalog.ts` é **gerado** por `scripts/content/sync-catalog-to-app.mjs`
  — apagar seria desfeito pelo produtor. É "emitido e não consumido", e o remédio
  fica a montante: ligar a um consumidor, ou parar de emitir.
- `CompetencyMasteryService` e `ProductAnalyticsAdapter` são a **metade leitora**
  de pares cuja escrita está viva — `LearningEvidenceRepository` grava a cada
  atividade concluída, e ninguém lê. Apagar o leitor não remove código morto:
  converte escrita viva em fluxo sem leitor.

**Continua aberto, por decisão do dono:** o nó `/quiz` + `/review` — ambas sem
entrada, e o plano condiciona aposentar a primeira a confirmar que a segunda
cobre revisão (a Task 15 já confirmou, em 2026-08-15) —, e os quatro falsos kill
switches. **Atenção ao aposentar `/quiz`:** ela é alcançada por deep link em
`.maestro/rating-prompt.yaml`, que não roda no gate; um teste de "nenhum import
remanescente" é cego para isso por construção.

## O kill switch, medido em 2026-08-24

`ENABLE_LEARNING_ROAD` é o **único** kill switch real: `(tabs)/index.tsx`
renderiza `JourneyHomeScreen` quando ligado e `HomeScreen` quando desligado. É
lido em tempo de build, então só se aciona por novo build ou por OTA — que está
configurado (`updates.url`, canais `preview`/`production`).

Foi acionado e medido pela primeira vez. Funciona mecanicamente: sobe, navega,
sem crash. Mas a `HomeScreen` renderizava **inteiramente no tema claro**, e num
incidente isso é o pior comportamento possível — o aluno concluiria que o app
quebrou. Migrada para `semanticColors.galaxy`; nenhum componente compartilhado
foi tocado, porque `StatPill` já tinha prop `dark` e `ProgressRing` já usava o
contexto escuro.

**A guarda que deveria ter pego, e não pegava.** O `identity-palette-contract`
cobria a tela e passava verde: ela alcançava a paleta clara por
`semanticColors.light`, e `semanticColors` estava na lista de permitidos. O
contrato passou a proibir o **contexto** claro dentro das raízes de produto — e
a ignorar comentários, para não punir quem documenta a regra.

**Os outros quatro são rótulos, não interruptores.** `ENABLE_REVIEW`,
`ENABLE_GAMIFICATION`, `ENABLE_ONBOARDING` e `ENABLE_HEURISTICS` estão fixos em
`true` no código, sem leitura de env. Não são acionáveis nem por OTA. Ou viram
flags de verdade, ou mudam de nome — a pior hora de descobrir isso é durante um
incidente. **Decisão do dono, não tomada.**

## Defeito aberto

**`ENABLE_REMOTE_SYNC` não desliga o `AuthService`.** A flag gateia só a exibição
e o `SyncQueueService.flush`; o auth decide por `isApiConfigured()`, e
`bootstrap()` roda no startup do app, no Perfil e no Progresso. Com uma URL de
API configurada, "sync desligado" ainda autentica contra ela. Medido em
2026-08-24; registrado por decisão do dono, não corrigido — mexer no gate afeta
login, sync e o contrato de telemetria. Detalhe em
[`2026-08-21-varredura-qa.md`](../radiant-app/docs/evidence/2026-08-21-varredura-qa.md).


**Resolvido junto com a trilha.** O CTA "Retomar etapa" renderizava atrás da tab
bar na Home de 2026-08-21; o painel que o continha foi substituído pela trilha, e
o botão deixou de existir como elemento fixo. A lição permanece: nenhum
validador estático enxerga tela.

## Duas redes, e o que cada uma NÃO cobre

O `npm run quality` do app e o `loop validate` do Loop são **conjuntos
diferentes**, e nenhum é superconjunto do outro. Em 2026-08-24 o
`docs-contract` do Loop estava reprovando havia **três dias** — desde o
arquivamento dos status datados em 2026-08-21 — e nada avisou, porque ele não
roda no gate do app. Ao mexer em documentação governada, rode os dois.

## Gate de qualidade

`npm run quality` em `radiant-app`: 18 passos (15 contratos), 717 testes / 100 suítes, visual QA
strict com 0 regressões. O CI (`.github/workflows/radiant-app-quality.yml`)
invoca **o comando inteiro**, não uma lista espelhada — desde 2026-08-15, quando
se descobriu que rodava 4 dos 16 passos.

```bash
cd radiant-app && EXPO_NO_DOTENV=1 npm run quality
```
