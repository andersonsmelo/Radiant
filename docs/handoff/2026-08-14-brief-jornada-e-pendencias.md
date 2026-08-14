# Brief de handoff — encerramento e insumos de replanejamento da jornada

**Para:** a próxima IA que pegar este repositório
**De:** sessão de 2026-08-14 (Claude, via Loop)
**Estado canônico:** [`EXECUTION_STATUS_2026-08-14.md`](../EXECUTION_STATUS_2026-08-14.md)

---

## 0. Leia isto antes de qualquer coisa

**Nenhum número deste documento é fato.** Ele descreve o repositório como ele
estava em 2026-08-14. Este projeto é trabalhado por várias IAs em sessões
independentes; contagem de arquivo, `HEAD`, estado de trilha e progresso do aluno
mudam sem que este texto saiba.

Antes de agir sobre qualquer estado citado aqui, **meça de novo**:

```bash
git rev-parse --short HEAD && git status --porcelain && ls -t docs/EXECUTION_STATUS_*.md | head -1
```

Se existir um `EXECUTION_STATUS_` mais recente que `2026-08-14`, **ele manda, não
este brief**. O que este documento transmite com confiança é *intenção e
raciocínio*: por que cada coisa foi feita do jeito que foi. Isso não expira.

Faça a mesma releitura **antes de concluir** qualquer síntese longa: outra sessão
pode ter movido o `HEAD` no meio do seu trabalho.

## 1. Contexto em um parágrafo

O dono redesenhou a informação da jornada em sessão interativa, com o app rodando
no simulador iOS. A jornada virou um **percurso único**: o aluno não escolhe
trilha, a seguinte abre quando a atual termina, os nós mostram cadeado e cor, e a
revisão saiu da Home para viver só na trilha. Nove runs do Loop fecharam, todos
com 13 de 13 validadores e memória validada. O detalhamento de cada decisão está
no status canônico — leia-o antes de mexer no código da jornada, porque várias
escolhas parecem arbitrárias sem o motivo.

## 2. Estado de encerramento

P1 e P2 foram concluídas em 2026-08-14. Esta passagem foi encerrada para
replanejamento: P3 e P4 **não são uma fila autorizada de implementação**. Elas
ficam registradas abaixo como insumos para a próxima decisão do dono.

---

### P1 — Commitar o working tree

**Concluída.** O redesenho, o status, este handoff e o contrato documental foram
publicados em `origin/main` no commit `0ceff49`
(`feat(journey): commit guided learning path redesign`). O diretório
`skill-observations/` da raiz permaneceu fora do commit.

**Registro histórico:** P1 existia porque os nove runs originais não criavam
commit. O acoplamento entre `scripts/qa/docs-contract.mjs` e este status foi
preservado no mesmo commit. O diretório não rastreado `skill-observations/`
permanece fora do escopo e não deve ser tocado (§3).

---

### P2 — Verificar em aparelho os dois caminhos não exercitados

**Concluída.** Os dois subcasos de revisão e o avanço automático foram observados
no simulador iOS em build Release local de `0ceff49`; o registro sanitizado está
em [`radiant-app/docs/evidence/2026-08-14-journey-p2-ios.md`](../../radiant-app/docs/evidence/2026-08-14-journey-p2-ios.md).

**Motivo histórico:** duas entregas tinham teste completo sem observação do
caminho em execução; a validação abaixo foi necessária porque teste verde não
encerra pergunta de runtime.

**P2-a — Revisão fora da Home.** A Home deve anunciar a próxima etapa de
aprendizado mesmo quando a recomendação é uma revisão.

Para observar: é preciso que `getNextRecommendedNode` devolva um nó de revisão.
A revisão fica pendente quando existe card vencido em
`SpacedRepetitionService`; a chave no `AsyncStorage` é
`@radiant:sr_schedule_v1`, e a due date é o campo `nextReviewAt` de cada card.
No simulador, o `AsyncStorage` mora em:

```
<container de dados do app>/Library/Application Support/com.ascendcreative.radiant/RCTAsyncLocalStorage_V1/manifest.json
```

Obtenha o container com `xcrun simctl get_app_container <udid>
com.ascendcreative.radiant data`. **Faça backup antes de editar** e encerre o app
antes, senão ele sobrescreve.

*Critério de aceitação:* com revisão recomendada, a linha "Próximo" mostra a
lição/checkpoint seguinte e o CTA nomeia a etapa de aprendizado (`Continuar
jornada` para lição, `Abrir checkpoint` para checkpoint); quando a revisão é a
**única** coisa aberta na unidade, o CTA diz "Fazer revisão" e abre a revisão.

**P2-b — Avanço automático de trilha.** Concluir todos os nós de Fundamentos deve
mover o aluno para a trilha seguinte.

*Critério de aceitação:* com todos os nós da trilha ativa concluídos, o próximo
bootstrap resolve a trilha seguinte, e a Galáxia passa a exibi-la. Faltando **um
único** nó, permanece na atual.

---

### P3 — Insumo: decidir o fim do percurso

**Por quê:** esta é uma lacuna de **produto**, não um bug. `resolveActiveTrackId`
devolve a última trilha quando todas terminaram, para o app sempre ter algo a
exibir. Mas nenhuma tela diz "você concluiu o curso" — o aluno que termina tudo
vê a última trilha inteira concluída e nada acontece.

O fato "curso concluído" já está disponível: `resolveTrackAccess` devolve
`completed` por trilha, então a informação existe e ninguém a consome.

**O que decidir com o dono no próximo planejamento:** o que a Galáxia e a Home
mostram nesse estado. Não invente — é decisão de produto, e a copy atual da
Galáxia ("A trilha seguinte abre quando esta terminar") fica falsa na última
trilha.

**Critério de aceitação:** uma decisão registrada em ADR (`docs/adr/`, com data e
decisor) e a tela correspondente implementada com teste.

---

### P4 — Insumo bloqueado: ícones animados do HUD em Rive

**Por quê:** comportamento aprovado pelo dono em 2026-08-12. **Bloqueado por
dependência externa:** os arquivos `.riv` são autorados pelo dono e ainda não
existem no repositório. Não comece por aqui, e não substitua por uma aproximação
em código sem falar com ele — os ícones atuais já são SVG + Reanimated por
decisão explícita, e Rive está reservado ao Pixel, onde a interpolação de forma
paga o custo.

**Condição de reabertura:** só faz sentido depois que os `.riv` existirem. Até
lá, os ícones SVG + Reanimated atuais permanecem a implementação aprovada.

---

## 3. Armadilhas deste repositório

Todas medidas, todas custaram trabalho perdido a alguém.

### O `skill-observations/` na raiz não é do projeto

Existe um `skill-observations/` não rastreado na raiz. É scaffolding vazio criado
por engano por uma sessão anterior que ancorou no diretório de trabalho em vez do
caminho estável do agente. O conteúdo real vive fora do repositório.

**Não commite, não apague, não declare em escopo de run.** Deixá-lo quieto é uma
saída válida pelo `AGENTS.md`; o que custa run é mexer ou desmexer depois de
abrir.

### O fechamento de run do Loop tem uma ordem que não é negociável

```
loop validate → loop step finish → [loop memory write] → loop run close
```

`loop memory write` **exige** o run em `succeeded`, e só `step finish` produz esse
estado. **Nunca encadeie esses comandos com `&&`**: a CLI reporta erro no corpo do
JSON com status de saída **zero**, então o `&&` não protege. Extraia o `code` de
cada resposta.

O `AGENTS.md` documenta sete armadilhas de fechamento em detalhe — leia a seção
inteira antes do seu primeiro run.

### `RUN_NOT_FOUND` costuma ser diretório errado

O run pertence à raiz do projeto (`/Users/anderson/Developer/Radiant`), não a
`radiant-app/`. Rodar `loop` de dentro do app devolve `RUN_NOT_FOUND` como se o
run não existisse.

### O escopo do run é fixado no `step begin`

Não dá para ampliar depois — `loop step begin` num run em `editing` devolve
`INVALID_TRANSITION`. **Declare todos os arquivos que a operação vai tocar**,
inclusive os não rastreados e os subprodutos locais. Descobrir no meio que falta
um arquivo custa fechar o run e abrir outro.

### Os contratos de fonte restringem a FORMA do texto, não só o comportamento

Vários testes em `radiant-app/scripts/*.test.mjs` varrem o código-fonte como
texto. Duas consequências que morderam nesta sessão:

- **Comentário é código para eles.** Escrever um comentário que cita
  literalmente o padrão proibido faz o contrato reprovar o comentário.
- **A forma sintática importa.** O contrato de easing reconhece a constante
  passada direto como argumento, mas não atrás de um ternário —
  `withTiming(v, cond ? A : B)` não é reconhecido, embora seja equivalente.

### Um contrato que enumera alvos não protege quem ele não nomeia

`reanimated-easing-contract` tem uma lista de arquivos. Componente novo que anime
precisa **entrar na lista**, no mesmo run que ganhou a animação. Isso está
escrito dentro do próprio contrato, e ainda assim é fácil esquecer.

### Testes verdes não provam que o app inicializa

Ver "Defeitos encontrados", item 2, no status canônico. Para qualquer mudança que
**reposicione código entre módulos** — extrair constante, mover export, inverter
dependência — a evidência que fecha o passo inclui **carregar o app de verdade
uma vez**. Regra preventiva: valor derivado de outro módulo se calcula dentro de
função, não no corpo do módulo.

### Antes de abrir run, o `git status` precisa estar resolvido

A baseline do run captura a sujeira que já existia na abertura, então **desfazer
também conta como mudança**. Um `git checkout` feito para limpar escopo já
derrubou um run inteiro com `OUT_OF_SCOPE_CHANGE`.

### Não valide com um E2E rodando

`loop validate` dispara jest, lint e typecheck. Medido: 2,3× de desaceleração no
emulador, e o flow morre em timeout que parece defeito do app.

### `INTERNAL_ERROR` em `loop brain*` quase nunca é do Loop

Diagnóstico em um comando: `ls ~/Documents`. Se der "Operation not permitted", o
macOS revogou o acesso ao vault do Obsidian, o validador `brain-links` reprova e
**nenhum run fecha**. Não abra run nesse estado — ele prende o lock de escritor
sem poder soltá-lo. A correção é do dono, nas permissões do sistema.

---

## 4. Onde está o raciocínio

Quando algo no código da jornada parecer arbitrário, procure nesta ordem:

1. O comentário em cima da linha. Este repositório documenta o **motivo** junto
   do código, e vários comentários registram o defeito específico que a linha
   previne.
2. O nome do caso de teste. Os testes daqui são escritos como afirmações sobre
   comportamento, não como `it('works')`.
3. O status canônico da data correspondente.
4. O cérebro Loop: `loop brain session start --task "..."` e depois
   `loop brain search`. Nove memórias validadas desta sessão estão lá.

**Não remova um teste que parece redundante sem descobrir o que ele previne.**
Vários casos existem justamente para impedir que algo removido volte — um deles é
explícito sobre isso: `não oferece escolha de trilha: o percurso é único`
verifica a **ausência** do seletor, porque parar de olhar não impede a volta.

---

## 5. Sugestão de primeira ação

Abra uma sessão de leitura do cérebro, meça o estado real, leia o status canônico
mais recente e comece pela P1. Ela é curta e destrava as outras.

```bash
loop brain session start --task "Continuar as pendências do redesenho da jornada"
git rev-parse --short HEAD && git status --porcelain
ls -t docs/EXECUTION_STATUS_*.md | head -1
```
