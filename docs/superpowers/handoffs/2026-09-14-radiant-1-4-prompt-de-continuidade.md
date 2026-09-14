# Prompt de continuidade — Radiant 1.4, fluxo do usuário

Cole o bloco abaixo, inteiro, como primeira mensagem para a IA que vai executar.
Ele é autocontido: não depende da conversa em que a spec foi desenhada.

---

Você vai planejar e implementar a versão 1.4 do Radiant, um app iOS de
treinamento em radiologia (Expo / React Native), a partir de uma spec já
aprovada pelo dono. Você trabalha sozinho; no fim, entrega um relatório. O dono
não acompanha o processo — ele lê o relatório.

## 1. Leia antes de qualquer ação, nesta ordem

1. `AGENTS.md` — o contrato de coordenação entre IAs deste projeto. Ele manda.
2. `docs/STATUS.md` — o único documento de estado vivo. A 1.3.1 (11) está na
   App Store desde 2026-09-14; a 1.4 está desenhada e não começada.
3. `docs/superpowers/specs/2026-09-14-radiant-1-4-fluxo-do-usuario-design.md`
   — a spec. Ela é o contrato desta tarefa. Toda frase dela vale; nenhuma
   decisão das dez listadas na §1.2 é reaberta por você.
4. `docs/superpowers/specs/2026-08-27-radiant-curriculum-v3-design.md` e
   `docs/adr/` — contexto que a spec herda. Só leitura.

## 2. O que fazer

**Fase A — plano.** Escreva o plano de implementação em
`docs/superpowers/plans/<data>-radiant-1-4-fluxo-do-usuario-plan.md`, seguindo
a sequência da §12 da spec: serviços puros primeiro (`NextNodeResolver`,
`HeartsService`), depois as telas com os quatro estados, e por último
assinatura e backup. Cada tarefa do plano declara **os arquivos que toca** —
valide a união deles contra `writePolicy.allowedRoots` em `.loop/project.yaml`
antes de começar a executar, não tarefa a tarefa. Commite o plano.

**Fase B — execução.** Uma tarefa por vez, cada uma num run próprio do Loop,
com TDD: o teste vermelho primeiro, observado rodando o teste diretamente (não
pelo `loop validate`, que consome ciclo). As tabelas da spec (§4 motor, §5
vidas) **são** as suítes de teste — cada linha vira um caso, com relógio
injetado. Toda tela ganha teste **na configuração de produção**
(`ENABLE_REMOTE_SYNC=false`, sem API) afirmando o que NÃO deve aparecer — a
1.3.1 chegou ao aparelho com um formulário de login inerte porque a suíte só
rodava com sync ligado.

**Fase C — relatório.** No fim, ou quando travar, escreva o relatório (seção 6).

## 3. Como este projeto funciona — regras que custaram runs

- **Toda alteração passa pelo Loop.** Abra pelo embrulho:
  `node scripts/loop/abrir.mjs "<descrição>" <arquivo>...`, declarando TODO
  caminho que vai tocar, inclusive arquivos novos e subprodutos.
- **`loop` exige Node 24.** O `.nvmrc` de `radiant-app` puxa o shell para o
  20. Antes de qualquer comando `loop`:
  `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`. Testes e
  builds do app usam o 20 (`/Users/anderson/.nvm/versions/node/v20.20.2/bin`).
- **Caminho com acento nunca é digitado** — vem do `find`. O disco soletra
  `Conteúdo/` em NFD; o teclado produz NFC; o guarda compara bytes.
- **Fechamento, nesta ordem, um comando por chamada, lendo o `code` de cada
  envelope:** `loop validate` → `loop step finish` → (`loop memory write
  --run <id> --input <json>`, só se houver aprendizado durável, resumo com
  **menos de 1000 caracteres**, `evidenceIds` só dos validadores `passed`) →
  `loop run close`. **Nunca encadeie com `&&`** e nunca rode `memory write`
  na mesma chamada que gera o arquivo: se o arquivo falhar, o comando roda
  com entrada inválida.
- **`loop validate` só uma vez por ciclo.** A saída completa fica em
  `.loop/runs/<id>/state.json`; reler é grátis, revalidar gasta orçamento.
- **A baseline do run inclui a sujeira da abertura, e desfazer também é
  mudança.** Rode `git status --porcelain` antes de abrir. O que estiver sujo
  e não for seu, **deixe exatamente como está**.
- Se `abrir.mjs` falhar no meio, o run ficou vivo em `context_ready` com o
  lock: leia `ls -t .loop/runs | head -1` e o `state.json` antes de tentar de
  novo. Nunca edite arquivo antes de ver `STEP_STARTED`.
- Pare em `PROJECT_BUSY` (outra sessão escrevendo), `needs_human`,
  `OUT_OF_SCOPE_CHANGE`, `SECRET_DETECTED`. Em `needs_human`: `loop checkpoint
  restore` → `loop run close` → refaça num run novo. Nunca recupere um lock.

## 4. Estado do repositório que você vai encontrar

- `main` = `17741e3` (ou posterior). A branch `codex/curriculum-v3-foundation`
  aponta para o mesmo commit. Trabalhe em `main` ou numa branch sua a partir
  dela; não use a branch `codex/...`.
- **Árvore suja de outra sessão — não toque, não commite, não reverta:**
  `docs/plans/2026-07-27-radiant-launch-roadmap.md`,
  `radiant-app/src/ui/motion.ts` (um hook aditivo), e os não rastreados
  `docs/curriculum-v3/`, `docs/superpowers/plans/2026-08-2*-curriculum-v3-arco-1-l*.md`,
  `radiant-app/src/features/curriculum-v3/l1-body-reference/`,
  `.../l2-slicing-space/`. São o Arco 1 do V3, fora do seu escopo. Se
  `docs/STATUS.md` e `docs/FILA.md` estiverem sujos, eles carregam edições
  dessa mesma sessão: ao commitar os seus trechos, separe-os (stage do
  conteúdo de `HEAD` + suas linhas, via `git hash-object` +
  `git update-index --cacheinfo`), nunca `git add` do arquivo inteiro.
- `~/Developer/Radiant-release` é um worktree limpo de `main` para builds.
  Não é seu para editar.
- Validadores do Loop: 14, incluindo jest, lint, tsc do app e da API, e os de
  conteúdo. `content-source-rights` passa sem exceção desde 2026-09-11 — não
  crie exceção nova.

## 5. Limites — o que você NÃO faz

- Não roda `eas build`, `eas submit`, nem `git push`. Deixa pronto e relata.
- Não toca em `conteúdo/`, `Conteúdo/`, `content-manifest/` nem no catálogo
  de direitos. Conteúdo do V3 (J3/J4/J5) está fora desta tarefa; não chame
  `prepareV3()`, não ligue o V3, não apague o legado.
- Não adiciona aba, não adiciona formulário de login, não usa SDK de terceiro
  para compras (StoreKit 2 direto via `expo-iap`), não põe palavra de
  infraestrutura em tela de aluno.
- Não edita classificação etária, disponibilidade nem Privacy Labels — só
  registra no `STATUS.md` o que precisa mudar (o rótulo do Sentry).
- Não escolhe preço. Não aceita acordo nenhum.
- Não altera a spec. Se ela estiver errada ou impossível num ponto, **pare
  essa tarefa, registre no relatório com a medição que prova, e siga para a
  próxima tarefa independente.**
- Não instala módulo nativo sem testar num build interno primeiro — o backup
  no iCloud entra por plugin de configuração e pede entitlement; se o plugin
  não compilar no perfil `development`, o backup sai da 1.4 e o resto não
  depende dele (spec §11).

## 6. Itens que só o dono resolve — relate como pendentes, não tente

- Acordo de apps pagos no App Store Connect.
- Produto de assinatura (grupo "Radiant Ilimitado", mensal e anual) e preço.
- Entitlement do iCloud e credencial nova no EAS.
- DSN do Sentry como variável de ambiente do perfil `production` no EAS.
- Qualquer clique em console, qualquer cartão de crédito, qualquer aparelho.

## 7. O relatório — formato

Escreva em `docs/superpowers/handoffs/<data>-radiant-1-4-relatorio-execucao.md`,
em português, e atualize `docs/STATUS.md` (editando, nunca criando arquivo de
status novo) com uma linha datada por tarefa concluída. Seções:

1. **O que foi feito** — por tarefa do plano: arquivos, commit, run do Loop,
   evidência (contagem de testes, 14/14 ou o que reprovou).
2. **O que ficou pendente e por quê** — do dono (seção 6), bloqueado por
   `PROJECT_BUSY`/`needs_human`, ou spec inexecutável (com a medição).
3. **Decisões tomadas sob suposição** — tudo o que a spec não dizia e você
   decidiu, com a alternativa que descartou.
4. **Achados fora do escopo** — defeitos que viu e não corrigiu.
5. **O que a próxima sessão precisa saber** — em ordem de urgência.

Toda afirmação de estado leva data de medição e o comando que a remede.
"Funciona" sem evidência não entra no relatório.

---
