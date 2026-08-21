# Radiant — Roadmap mestre (2026-08-01)

> **O que este documento é:** o único lugar que responde **"o que vem agora, e em
> que ordem"** para as três frentes do Radiant ao mesmo tempo. Ele carrega
> **ordem e dependência**. Não carrega estado.
>
> **O que ele não é:** não é status, não é checklist e não substitui plano de
> execução nenhum. Se você quer saber *como está* alguma coisa, o
> [status canônico](../archive/EXECUTION_STATUS_2026-08-09.md) é a autoridade; se quer
> saber *como fazer* uma task, o plano de execução da frente é a autoridade.
>
> **Por que a separação é dura.** Este repositório já perdeu tempo três vezes com
> a mesma classe de defeito: um documento repetiu um fato que outro documento
> também guardava, os dois envelheceram em ritmos diferentes, e a próxima sessão
> leu o errado. Um roadmap que registra "13 testadores vinculados" nasce com
> prazo de validade; um que registra "o relógio de 14 dias depende dos opt-ins,
> que dependem do recrutamento" continua verdadeiro por meses. **Se você sentir
> vontade de escrever um número medido aqui, ele pertence ao status canônico.**

## Por que este documento passou a existir

Até 2026-08-01 existiam três sequências desconectadas — o roadmap de lançamento
(A1–F7), o plano do sistema de aprendizagem (18 tasks) e o recorte Android de
closed testing — e **nenhuma** para conta e monetização, que era a frente sem
decisão fechada. Com o modelo de entitlement decidido, as três frentes passaram a
ter ordem interna própria e dependências entre si, e nenhum documento as via
juntas. Trabalhando em três agentes ao mesmo tempo, isso é o suficiente para dois
deles colidirem ou pararem esperando algo que já estava pronto.

## As três frentes

| Frente | Objetivo | Plano de execução | Depende de |
| --- | --- | --- | --- |
| **1 — Lançamento v1.3** | app público nas duas lojas | [roadmap de lançamento](2026-07-27-radiant-launch-roadmap.md) + [recorte Android](2026-07-29-android-closed-testing-plan.md) | ação do dono e relógio das lojas |
| **2 — Educacional** | trilha por competências, checkpoints, atividades e jogos | [plano do sistema de aprendizagem](../superpowers/plans/2026-07-31-sistema-aprendizagem-competencias.md) + [kernel de checkpoints](../superpowers/plans/2026-08-09-checkpoints-e-loops-do-aluno.md) | fundação transacional antes da Task 12 educacional; publicação continua separada |
| **3 — Conta e premium (v1.4)** | assinatura com direito de acesso que atravessa plataforma | *ainda não existe* | API pública, hoje inativa |

## Regra que atravessa as três

**Durante a janela de 14 dias consecutivos do closed test, nenhuma release nova
sobe ao track `alpha`.** A restrição é sobre **o que é publicado**, não sobre o
que é commitado: as frentes 2 e 3 podem desenvolver, commitar e validar à
vontade na branch, desde que nenhum AAB novo vá ao track enquanto a contagem
corre. Confundir as duas coisas paralisaria as outras frentes sem necessidade —
e foi por não separá-las que a remoção da `HomeScreen` morta ficou marcada como
pós-beta.

A frente 1 é quase toda **ação do dono**; as frentes 2 e 3 são quase todas
**trabalho de IA**. Essa é a divisão natural de paralelismo, e é o motivo de as
três caberem na mesma janela.

---

## Frente 1 — Lançamento v1.3

Caminho crítico administrativo. A engenharia não bloqueia mais nada aqui.

1. **Opt-in dos testadores.** Vínculo na lista não é opt-in. É preciso comprovar
   o piso do Play e manter margem de churn acima dele. *Maior latência de todas
   as frentes: nada acelera um relógio de dias consecutivos.*
2. **Manter a contagem durante toda a janela**, monitorada diariamente. Queda
   abaixo do piso zera o relógio.
3. **Aguardar a App Review e liberar manualmente após aprovação.** O envio,
   metadata, privacy, classificação, smoke físico e VoiceOver já foram fechados;
   o estado atual pertence ao console e fica no status canônico.
4. **Completar os gates Android restantes** — IARC/Play, aparelho físico e
   TalkBack — sem misturá-los com a revisão Apple.
5. **Mergear a PR do site que publica as páginas legais** e remedir as duas URLs
   na véspera da submissão. Elas estão no ar por FTPS e um redeploy da branch
   principal do site pode removê-las — as URLs já estão coladas na ficha do Play,
   e a revisão pode ocorrer semanas depois.
6. **Prova do *themed icon* do Android 13+** — exige aparelho real. **Não
   bloqueia**; é ressalva de qualidade.

## Frente 2 — Educacional

As fundações editoriais, currículo, contrato `LearningActivityV2`, adaptador
legado, evidência, domínio, registro/player, agendador e quatro renderizadores
do corte inicial estão entregues. O lote original de mídia também está
autorizado. Em 2026-08-09 entrou um plano transversal para checkpoints e loops;
as Ondas 1–3 estão concluídas: governança, fundação transacional isolada e
adaptadores nas 12 superfícies em `shadow`, sem efeito de navegação ou
pedagogia. A **Onda 4 está implementada localmente**, com runtime ativo somente
interno, mas ainda depende do gate de build/aparelho/perfil. A Task 12
educacional vem depois desse gate, não apenas depois do código.

Dois pontos que a ordem do plano esconde e que importam para quem for pegar a
frente:

- **O lote autorizado não abre a porteira inteira.** Uma ilustração sintética
  está aprovada e cinco candidatas históricas permanecem rejeitadas. Cada lote
  futuro continua exigindo sua própria decisão de direitos e revisão humana.
- **A partir do contrato de atividades, a frente toca o binário.** Nada impede
  desenvolver durante a janela do closed test — impede publicar. Ver a regra que
  atravessa as três frentes.
- **A nova ordem é deliberada.** Governança → fundação em `off` → shadow →
  runtime interno → Task 12 educacional → Galáxia/pipeline/Unidade 1 → outbox e beta
  pedagógico local/offline → expansão pedagógica. Sync remoto segue depois em
  trilha independente, condicionado a carga/soak, API/auth, conflitos e sink
  verificado. Não implementar o checkpoint diretamente na tela antes do commit
  recuperável.

## Frente 3 — Conta e premium (v1.4)

Decidida em [ADR-2026-08-01](../adr/ADR-2026-08-01-modelo-de-entitlement-premium.md):
**conta própria + billing**, porque o direito de acesso precisa atravessar
plataforma. A ordem abaixo **não é preferência, é dependência** — cada elo é
pré-requisito técnico ou regulatório do seguinte.

1. **API pública de pé.** Hoje inativa. Enquanto estiver, os elos 2 a 4 não têm
   onde existir: o `AuthService` e o bloco de login já estão no código e são
   inertes no build distribuído por não haver base de API configurada.
2. **Conta** — login, perfil e **exclusão de conta dentro do app, mais URL
   pública de exclusão**, exigência da política do Play para qualquer app que
   crie contas. A exclusão não é entregável só de backend: tem superfície de UI e
   uma página pública a hospedar.
3. **Refazer as três declarações de loja** — Data Safety e privacy labels, a
   política de privacidade já publicada, e o questionário de classificação. Hoje
   as três declaram que o app não coleta dados, de forma coerente entre si e
   verdadeira sobre o binário. Conta e assinatura tornam as três falsas, e a
   revisão das lojas **compara esses documentos entre si** — mudam juntas ou não
   muda nenhuma.
4. **Billing nas duas lojas**, com reconciliação de entitlement no servidor.
   Último elo, não o primeiro.

**Esta frente ainda não tem plano de execução.** Ele deve nascer pelo elo 1, e
não pelo elo 4 — o instinto de começar pelo billing é o erro que a ordem acima
existe para impedir.

## Como as três se relacionam

- A frente 2 não depende das outras duas. Direitos continuam gate por lote e o
  kernel permanece local-first; a API não bloqueia as Ondas 2–6.
- A frente 3 depende da API, que **não está no caminho crítico do lançamento** —
  o produto lançável é local-first. Subir a API é pré-requisito da v1.4 e de
  nada na v1.3.
- A frente 1 não depende de código novo. Depende de tempo e de ação do dono.
- O único acoplamento real entre elas é a **publicação** durante a janela de 14
  dias, tratado na regra acima.

## Manutenção deste documento

- Ordem e dependência mudaram? **Atualize aqui.**
- Um fato medido mudou (contagem, versão, estado de uma task)? **Não atualize
  aqui — não existe fato medido aqui.** Vá ao status canônico.
- Uma frente ganhou plano de execução? Aponte para ele na tabela das três
  frentes e mantenha o detalhe lá.
- Uma decisão de produto ou arquitetura mudou? Vira ADR, e este documento passa a
  citar o ADR em vez de repetir seu conteúdo.
