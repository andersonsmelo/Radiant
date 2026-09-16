# Radiant 1.4 — CloudKit: orquestração da abertura (diagnóstico e correção parcial)

Data: 2026-09-16 · Branch: `feat/1-4-cloudkit-private-backup` · PR: #14
Continua [a terceira validação física](2026-09-15-radiant-1-4-cloudkit-device-validation-3.md).

> ⚠️ **A causa raiz do que ocorreu no aparelho NÃO foi comprovada.**
> Este documento registra um defeito estrutural real, encontrado e corrigido, e
> a instrumentação que deve responder a pergunta no próximo build. Não declara
> o problema físico resolvido.

## 1. O que foi descartado, com medição

| Hipótese | Resultado |
| --- | --- |
| Update OTA antigo no canal | descartado pelo dono: `channel:view preview` devolveu tudo N/A |
| `StorageMigrationService` criando o estado | descartado: `PEDAGOGICAL_STORAGE_KEYS` não contém `PROGRESS_BACKUP` |
| Outro escritor da chave | descartado: `grep` no checkout mostra **um único** escritor, `ProgressSyncService.writeState` |
| O binário testado não tinha a correção | descartado: `4d0036e` é **ancestral** de `460b398`, de onde saiu o build `b86cb497` |
| Hidratação da jornada rejeitando | **testado e não se sustenta**: `getTrackDefinition` não lança com catálogo vazio, devolve jornada vazia |
| Defeito na camada de serviço | descartado por teste de integração com serviço real e storage vazio |

## 2. As duas explicações que sobram, e por que a tela não as separa

Depois da instalação limpa o aparelho mostrou: backup OFF, "Nenhum backup ainda",
XP 0, trilha 0/14, **sem mensagem de erro**.

1. **`restoreOnLaunch` não rodou.** O estado nunca é escrito e o cartão exibe o
   `INITIAL_STATE`.
2. **Rodou e o `pull` devolveu `absent`.** Esse caminho grava
   `{...state, decided:true, lastError:null}` — `enabled` falso, sem data, sem
   erro. **Cartão idêntico.**

O texto "Nenhum backup ainda" depende apenas de `lastBackupAt === null`, e
nenhum dos dois casos produz mensagem de erro. São indistinguíveis pela UI.

A segunda explicação exigiria o CloudKit responder `unknownItem` na abertura e
devolver o registro correto segundos depois, na mesma sessão — estranho, mas não
impossível, e não há como excluí-la daqui.

## 3. O defeito estrutural encontrado — real, corrigido, não provado como a causa

A orquestração no `RootLayout` era, em forma:

```
catalogBootstrap
  .then(() => JourneyProgressService.bootstrap())
  .then(() => progressSyncService.restoreOnLaunch(Date.now()))
  .catch(logar)
```

Um único `.catch` para três etapas. Qualquer rejeição antes do último `.then`
pula o restore **inteiro**, em silêncio, com o app abrindo normalmente — de
fora, indistinguível de "não havia backup".

Extraída para `restaurarBackupNaAbertura`, com **falhas isoladas por etapa**. A
espera do catálogo entrou como parte da hidratação, para que falha de catálogo
também não cancele o restore: XP, sequência e agenda não dependem do currículo
para voltar. A função nunca lança.

## 4. Por que os testes anteriores não capturaram nada disto

O único teste de startup **mockava `progressSyncService.restoreOnLaunch`**. Ele
provava que o *mock* seria chamado naquela árvore de teste — e nada sobre
`AsyncStorage` vazio, `parseState` real, serviço real, `pull` real ou early
return. Um teste assim não pode falhar por causa do defeito que existia.

O teste novo usa `ProgressSyncService` **real**, storage genuinamente vazio e
porta de nuvem falsa, sem mockar o restore. Ele prova que **a camada de serviço
está correta**: instalação limpa chega ao `cloud.pull`, aplica o remoto, termina
`enabled:true`/`decided:true`, e nunca envia snapshot vazio antes de ler.

## 5. Instrumentação

Ativa **apenas fora de produção**, para builds internos. Registra somente forma
e decisão:

- etapa (`inicio` / `hidratacao` / `restore`);
- se existe decisão local e se o backup está ligado;
- se a hidratação deu certo;
- se o restore terminou, e com que estado;
- se há data de backup.

**Nunca** payload, nó, trilha, XP, data de estudo ou identificador de iCloud. Há
teste afirmando essa ausência explicitamente.

É ela que deve separar as duas explicações da §2 no próximo build físico.

## 6. O que fazer no próximo build

Com o app conectado ao console, na instalação limpa, observar as linhas
`[abertura:backup]`:

- **não aparecer nenhuma linha `restore`** → explicação 1: o restore não rodou;
- **aparecer `restore` com `ok:true` e `ligado:false`** → explicação 2: o `pull`
  respondeu `absent`, e o problema está na fronteira nativa.

Sem isso, qualquer correção seguinte será palpite.

## 7. Riscos residuais

1. **A causa raiz segue aberta.** A correção desta rodada pode não mudar o
   comportamento em aparelho.
2. Desligar com a nuvem fora deixa o registro remoto dizendo "ligado" — risco
   registrado na rodada anterior, sem mudança aqui.
3. Precisão e Tópicos seguem fora do payload, por decisão de escopo.
