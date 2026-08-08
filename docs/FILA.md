# Fila de trabalho contínuo

Criada em 2026-08-08 porque o custo real não era a dificuldade das tarefas: era
cada sessão gastar o orçamento **se orientando** — relendo status, roadmap e
cérebro para redescobrir o que já estava decidido — em vez de trabalhando.

Este arquivo existe para ser consumido, não lido de ponta a ponta. Um agente
pega o primeiro item `AGENTE` não concluído, executa ponta a ponta, marca, e
para.

**Não é substituto do roadmap.** O roadmap é o registro completo do lançamento;
esta fila é só o que está **executável agora**, ordenado. Item que sai daqui vai
para o roadmap ou para o status, nunca some.

## Política de decisão

O agente **decide por padrão** e executa. Escalam ao dono apenas:

1. dinheiro, contas e consoles — submissão, formulários de loja, chaves;
2. promessa nova ao usuário — destravar galáxia sem conteúdo, ligar nudge que
   hoje está em shadow mode, mudar o que o app diz que entrega;
3. texto que vai para a loja;
4. qualquer ação irreversível.

Executar decisão **já tomada** não escala. Se a dúvida é "o dono aprovaria?",
a resposta padrão é executar e reportar — o run reverte se estiver errado.

## Como cada item é escrito

Todo item declara **estado**, **bloqueio** e **dono** como afirmações separadas,
porque são independentes e têm sistemas de registro diferentes — este projeto já
perdeu dias com item vivo por bloqueio morto. E declara o **comando que o
remede**, porque contagem escrita envelhece e comando não.

---

## AGENTE — executável agora, sem humano

### 1. ~~O mapa de galáxias está vazio~~ — CONCLUÍDA em 2026-08-08

**Estado:** concluída. **Bloqueio:** nunca houve. **Dono:** agente.

As 16 lições entraram no mapa, em 6 planetas sob 2 galáxias. `galaxy-fisica` e
`galaxy-tecnologia` saíram de `available`/`locked` para `active` — antes eram
cascas vazias.

**A causa foi tratada, não só o sintoma.** A divergência entre os dois catálogos
existia porque `ai-catalog.ts` é **gerado** e `galaxy-catalog.ts` era escrito à
mão, com o vínculo lição→planeta mantido nos dois lugares. Agora a linha está em
outro lugar: **fato de governança é gerado, decisão de design é escrita à mão.**
`sync-catalog-to-app.mjs` passou a emitir `galaxy-nodes.ts` a partir do mapa de
taxonomia; cor, superfície e posição continuam autorais em `galaxy-catalog.ts`.

Sete testes em `galaxy-nodes.test.ts`, e dois deles mordem de verdade — provado
por mutação: com `nodesOf` devolvendo `[]`, os cinco restantes seguem verdes
**vaziamente**, porque um mapa sem conteúdo satisfaz toda asserção sobre o
conteúdo dele. Quem pega o módulo gerado deixar de ser consumido é só o par que
compara gerado × mapa.

Ordem dentro do planeta vem da sequência pedagógica da trilha, não do mapa, que
é alfabético por id. Nós nascem `available` de propósito: as 16 já eram
alcançáveis pela trilha plana, e nascer `locked` **reduziria** o acesso — o mapa
acrescenta caminho, não fecha o que existe.

**Continua do dono:** destravar `galaxy-casos`, que segue sem conteúdo nenhum.

Medido em 2026-08-08:

```bash
node -e "const s=require('fs').readFileSync('radiant-app/src/data/galaxy-catalog.ts','utf8');console.log('corpos com nodes vazios:',(s.match(/nodes: \[\]/g)||[]).length)"
```

O app tem 4 galáxias e 5 corpos celestes. **Só `planet-torax` tem conteúdo**
(8 nós); os outros quatro estão vazios, e duas galáxias estão `locked`. As 16
lições `ai-lesson:` embarcam numa trilha plana, `track-ai-fundamentos`, em
`radiant-app/src/data/ai-catalog.ts`, **desconectada do mapa**.

A metáfora central do produto está ~80% vazia enquanto o conteúdo que a encheria
viaja num paralelo. Quem abre o app vê mundos travados e vazios.

A ligação foi construída em 2026-08-07 e mora onde nada a lê:
`content-manifest/taxonomy-catalog-map.json` atribui as 16 lições a 6 planetas em
2 galáxias, e `Conteúdo/taxonomia/` descreve os nós. Ver o
[desenho aprovado](superpowers/specs/2026-08-07-taxonomia-eixo-tecnico-design.md).

**Isto não é decisão nova.** O dono já decidiu, em 2026-08-07, que nó `active`
significa currículo entregue e que as 16 lições pertencem àqueles planetas.
Preencher o mapa é executar aquela decisão, não tomar outra. Nenhum conteúdo
novo é criado e nenhuma promessa nova é feita.

**Fora deste item, e continua do dono:** destravar `galaxy-casos`, que não tem
conteúdo nenhum.

### 2. Trilhas com nome de anatomia entregando curso técnico — MENTIRA CORRIGIDA em 2026-08-08, reagrupamento ADIADO

**Estado:** a parte visível está corrigida; o reagrupamento continua aberto.
**Bloqueio:** migração de progresso — descrito abaixo. **Dono:** agente para a
migração; dono se quiser rever a redação dos títulos.

**Duas afirmações da versão anterior deste item estavam erradas, e as duas
importam.**

*"Não afeta o usuário — o bundle embarca uma trilha só."* Falso. `AI_TRACK` só é
lido pelo próprio `ai-catalog.ts`; o app lê `LESSON_CATALOG`, gerado a partir
deste arquivo, e `LessonCatalogService.getTracks` alimenta ProgressScreen,
JourneyHomeScreen, home e quiz. O usuário via uma trilha chamada **"Abdome"
contendo preservação de alimentos por irradiação**.

*"Trabalho pequeno, sem decisão pendente."* Falso, e perigoso.
`JourneyDefinitionService` deriva ids de nó assim:

```
node:checkpoint:<track.slug>[:<lessonId>]   // a forma muda se lessonCount deixa de ser 2
node:reward:<track.slug>[:final]            // a forma muda se lessonCount passa de 2
```

Esses ids ficam salvos em `completedNodeIds`. **Reagrupar as lições muda a
contagem por trilha e portanto muda os ids**, órfãnando checkpoints e
recompensas já concluídos de quem já usa o app. E o `id` da primeira trilha é a
chave do progresso de jornada
(`DEFAULT_JOURNEY_TRACK_DEFINITION.id = LESSON_CATALOG.tracks[0]?.id`).

**O que foi feito:** só `title`, `goal` e `description` — display puro. `id`,
`slug`, `priority` e `lessonIds` ficaram **byte a byte intactos**, então nenhum
id de nó mudou. As trilhas passaram a se chamar *Fundamentos de Radiologia*,
*Radiação, Modalidades e Equipamento* e *Prática, Qualidade e Profissão*.

**Dívida declarada, de propósito:** os slugs seguem `fundamentos`/`torax`/
`abdome` — pinados pelo contrato em `wave-1-priority-tracks.test.mjs` e
load-bearing para id de nó. Um slug `torax` sob o título *"Radiação, Modalidades
e Equipamento"* é incoerente para quem lê o código, e invisível para o usuário.
Corrigir exige migração de progresso, que é trabalho próprio.

**Texto de produto:** os três títulos são meus, não seus. Se a redação não for a
que você quer, é troca de uma linha em `Conteúdo/governança/wave-1-priority-tracks.json`
seguida de `node scripts/content/sync-catalog-to-app.mjs`.

### 3. D4 — remedida em 2026-08-08, e agora são três fatias com donos diferentes

**Estado:** aberto, P0, bloqueia produção — mas decomposta.
**Bloqueio:** trocou de lugar, não morreu. **Dono:** agente nas duas primeiras
fatias; revisor de domínio só na terceira.

Medição: [`2026-08-08-d4-destino-existe.md`](content/2026-08-08-d4-destino-existe.md).

O bloqueio registrado era "os sete conceitos não têm nó de destino", e ele caiu
em 2026-08-07 com o eixo técnico. Mas **`scripts/content/classify-source.py`
carrega a taxonomia hardcoded em Python**, versão `mvp-2026-04-04`, e não conhece
`galaxy-tecnologia` nem os seis planetas novos. É a **terceira cópia** da mesma
estrutura; as outras duas já foram reconciliadas. O bloqueio não morreu — mudou
de lugar, e agora é ferramenta que não enxerga o destino, não destino ausente.

Os 30 `needs-review` medidos contra o eixo técnico:

| Fatia | Tamanho | Quem resolve |
| --- | --- | --- |
| Achariam destino com o classificador enxergando o eixo técnico | **19** | agente |
| Fragmento de extração abaixo de 80 caracteres, o menor com 3 | **4** | agente |
| Resíduo real, sinal fraco ou nenhum | **~7** | revisor de domínio |

Os 4 fragmentos seguem no disco porque **a extração desta fonte nunca foi
regerada** depois da correção do extrator em 2026-08-07. Reexecutar o extrator os
elimina sem decisão de ninguém.

**A ordem que este item declarava estava errada, e eu a escrevi.** Dizia
"reexecutar o extrator primeiro, porque é o mais barato". Medido em 2026-08-08:
não é. `excerpts.json` e `pages.json` não são rastreados, mas
`extraction-job.json` é, e `Conteúdo/extrações` foi **deliberadamente removido**
de `allowedRoots` com motivo escrito no próprio `project.yaml`. Reextrair também
muda as fronteiras de excerto, o que invalida `classifications.json` — rastreado,
e sob a mesma armadilha de grafia. As duas fatias de agente **compartilham a
parte cara**, então fazer a extração primeiro reclassifica duas vezes.

É a Observação #195 mordendo o texto de quem a escreveu: estimei "barato" sem
medir, uma iteração depois de registrar que o campo tamanho é o que convida a
verificar menos.

**A fatia de 19 tem um bloqueio de contrato, achado em 2026-08-08.** Não é
vocabulário:

- o schema `classification-record` exige `starId` como `string`, **não nulável**;
- `validate-foundation.mjs:409` reprova `starId` que não exista na taxonomia;
- `classify_excerpt` indexa `PLANET_STAR_IDS[planet_id]` e `[0]` sem fallback;
- e o dono decidiu que **os planetas novos não ganham estrela**.

Um excerto não consegue pousar num planeta técnico. A única saída compatível com
a decisão aprovada é **tornar `starId` nulável** — schema, validador,
classificador e a forma dos 109 registros. Criar estrelas resolveria o contrato
contradizendo a decisão, e pela razão que a decisão dá: estrela é trilha curta e
não há nenhuma produzida.

Detalhe numérico que morde junto: a confiança é
`0.5·galáxia + 0.3·planeta + 0.2·estrela`. Sem a parcela da estrela, planeta sem
estrela cai abaixo do limiar de 0,7 **por construção** e vira `needs-review` —
o oposto do objetivo. Precisa renormalizar para `0.625·galáxia + 0.375·planeta`,
com teste próprio.

**Ordem corrigida:**

1. ✅ **contrato** — `starId` nulável no schema, no `validate-foundation`, no
   `classify_excerpt` **e na guarda irmã do `classify_source`**, que eu não
   varri na primeira passada e o teste do bundle pegou. Confiança renormalizada
   para `0.625/0.375`. Feito em `af7b202`;
2. ✅ **vocabulário** — `galaxy-tecnologia` e os seis planetas em
   `classify-source.py`, `TAXONOMY_VERSION` em `eixo-tecnico-2026-08-07`.
   Medido contra os 109 excertos reais: **`needs-review` cai de 30 para 22**, e
   **45 registros passam a ter `starId` nulo** — os planetas sem estrela ficaram
   alcançáveis;
3. ✅ **regeneração da classificação** — feita em 2026-08-08.
   `classifications.json` no disco passou de **79/30 para 87/22**, com 45
   registros no eixo técnico e 45 com `starId` nulo. `validate-foundation` em 0.

4. ❌ **a reextração NÃO pode ser feita, e a razão corrige um erro que está nos
   documentos desde 2026-08-03.**

   A triagem da D4 registrou os 4 fragmentos abaixo de 80 caracteres como
   "defeito de extração, trabalho de pipeline, some sem decisão de ninguém". Eu
   repeti isso na medição da manhã. **É falso, e foi medido executando.**

   Reextrair leva 109 excertos a 105 e zera os fragmentos — o conserto do
   extrator funciona. Mas `validate-foundation` reprovou com 18 erros, porque
   `conteúdo/conceitos/` e `conteúdo/formatos/` **citam nominalmente** os
   excertos que sumiram: `p41:c2` e `p42:c2` sustentam o conceito de preservação
   de alimentos, `p71:c2` o de qualidade de imagem, `p33:c2` o de tomografia. Os
   órfãos são **load-bearing**: sustentam a proveniência de lições que já
   embarcam.

   Restaurado rodando o extrator com `MIN_CHARS = 0` num rascunho fora do
   repositório, o que reproduz exatamente a forma anterior — 109 excertos, os
   quatro ids de volta.

   **Isto não é uma limpeza de pipeline; é regeneração de conteúdo.** Tirar os
   fragmentos exige re-derivar conceitos e bundles de formato, que são as lições
   geradas. Fica como item próprio, com esse escopo declarado, e **não** como
   "trabalho pequeno".

**Pendência operacional:** a janela de escrita aberta em `4b28bd5` para
`Conteúdo/extrações` e `Conteúdo/classificação` **precisa ser fechada** em run
próprio, como o comentário no `project.yaml` promete.

**O achado que vale mais que o número, e quase me fez enviar a versão errada.**
Um primeiro vocabulário, mais agressivo, levava `needs-review` de 30 para **17** —
melhor manchete. Mas **12 dos 20 resgates pousavam em
`planet-profissao-e-aplicacoes`**, numa fonte onde profissão é uma lição só. A
causa: `tecnico em radiologia` aparece em **77 dos 109 excertos** porque é o
cabeçalho de página do módulo. O termo de maior aparência semântica era o do
rodapé, e a métrica de manchete **premiava a colocação errada** — exatamente o
risco que a medição de 2026-08-03 nomeou, chegando por outra porta. A versão
podada resgata 12 com 4 regressões, e resgata para lugares plausíveis.

O revisor de domínio passa a receber **7 itens em vez de 30**, e só depois de o
dicionário estar consertado — que é exatamente o que a triagem de 2026-07-31
pedia para não fazer ao contrário.

### 4. ~~Dívidas de teste declaradas~~ — TODAS FECHADAS em 2026-08-08

**Estado:** concluída. **Dono:** agente.

**A mordida do `eyebrow` está provada.** O segundo caso de
`PixelHeroSplit.test.tsx` afirma que a mensagem do balão **não** carrega teto de
escala, e ninguém tinha verificado que ele morde — um teste de guarda não provado
é indistinguível de um teste vazio. A mutação rodou fora de qualquer run:
`maxFontSizeMultiplier={1.5}` na mensagem do `SpeechBubble`, **1 vermelho** no
caso da mensagem e o caso do eyebrow **segue verde**, revertido em seguida. Não
exigiu mudar o produto — a dívida era a prova, não um teto.

**O número vencido caiu.** `EXECUTION_STATUS_2026-08-07.md` dizia "15 ids de
taxonomia"; são **22** desde a execução do eixo técnico.

**O adjetivo sem âncora saiu.** A claim `:5` dizia "ampliação **geométrica**".
Medido nos dois excertos: o ancorado, `p54:c1`, diz apenas *"A ampliação"* e
carrega os números inteiros — 0,1 mm contra 0,3 mm, e a razão. *"Ampliação
geométrica"* aparece só em `p53:c1`, o vizinho. O núcleo se sustentava, o
adjetivo não. Removido e reancorado: 8 claims, `unanchored: 0`.

---

## DONO — nada que o agente faça encurta

### 5. F2 — os opt-ins do closed test. **É o caminho crítico inteiro.**

**Estado:** release `Ativo` no track `alpha`, build `1.3.0 (4)`. Na leitura do
Console de 2026-08-03: 14 contas vinculadas, 2 participando. **Bloqueio:**
humano. **Dono:** dono.

O Play exige **12 testadores participando por 14 dias corridos**, e o relógio
**não começou**. Vincular não é participar — falta cada pessoa aceitar o convite
e instalar.

**A premissa foi reconferida em 2026-08-08 e o bloqueio é real:** a A1 decidiu
conta Play **pessoal** ([ADR](adr/ADR-2026-07-27-store-account-strategy.md)), e
a exigência 12×14 vale para conta pessoal. Numa conta de organização não
valeria. Não há atalho de engenharia.

Enquanto isso não fecha, **F3**, **F4** e **F5** não podem começar. Só o dono
mede o número atual, no Console.

### 6. E3 e E4/IARC — dois formulários, e o bloqueio de um deles morreu

**Estado:** E3 aberta; E4 com o lado Apple concluído em 2026-08-05 e **IARC/Play
pendente**. **Bloqueio:** *morto*. **Dono:** dono.

A E3 estava registrada como dependente da D1. Medido em 2026-08-08:

```bash
grep -n "EXPO_PUBLIC_API_BASE_URL" radiant-app/eas.json || echo "ausente nos 5 perfis"
```

A variável **não existe em nenhum dos cinco perfis**, então o binário da v1.3 não
alcança API alguma e as labels são "não coleta" sob qualquer desfecho da D1. O
único coletor é o Sentry, que independe dessa decisão. **A E3 pode ser
respondida hoje.**

### 7. Ações de um passo, todas do dono

- enviar os commits da branch — conte com
  `git log --oneline '@{upstream}..HEAD'`; o upstream é
  `origin/codex/wave1-hardening-api-smoke`, **não** `main`, que não existe como
  ref local e devolveria vazio com sucesso;
- **A5** — gerar a service-account key no Play Console e pôr em
  `radiant-app/credentials/`; não bloqueia publicar, o AAB sobe à mão;
- enviar o pedido ao INCA — rascunho pronto, destinatário em branco de propósito;
- apagar `~/.lmstudio` (8,7 GB órfãos) e instalar o Ollama — destrava a Task 3;
- **`checkHeuristics`** — ligar os nudges ou manter shadow mode. A decisão ficou
  decidível em 2026-08-07, quando a H3 parou de medir o próprio lançamento.

---

## Precisa de aparelho ou janela de host

**B5 Android**, **C4** (flows em device físico), **C5** (TalkBack no Android),
**C6** (baseline de performance). **Não valide nem gere durante um flow E2E** —
2,3× de desaceleração medida no emulador, e o flow morre em timeout que parece
defeito do app.

## Decidido e não implantado

**D1** — opção B assinada em 2026-08-07, catálogo remoto. Nada implantado, o
domínio segue em 502. Endpoint morto degrada para o conteúdo da última release,
porque o fallback já existe em `RemoteCatalogService`. Não está no caminho
crítico da F2 nem da submissão.
