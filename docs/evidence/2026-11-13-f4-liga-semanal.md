# Evidência — F4, liga semanal no Game Center (13/11/2026)

Branch `claude/f4-liga-semanal-26632b`, a partir da `main` em `741c3e3`.
Decisão: [ADR 2026-11-13](../adr/ADR-2026-11-13-liga-semanal-no-game-center.md).
Passos do dono: [runbook](../runbooks/2026-11-13-liga-game-center.md).

## Gate

`cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality`, Node 20.20.2, na
branch em `ab223cf`: saída 0, **240 suítes e 3.178 testes**, lint com 0 erros
e 21 avisos (todos em arquivos que esta frente não toca), Visual QA sem
regressão. Uma primeira rodada, antes das correções da revisão, reprovou uma
suíte (`startup-gate.flow.test.tsx`): o `_layout` passou a importar o
`LeagueService`, que carrega o AsyncStorage na abertura. Corrigido carregando a
liga só com a chave ligada.

## Compilação do Swift

Compilado nesta máquina, **Xcode 27.2**, para o simulador
(`-sdk iphonesimulator -destination 'generic/platform=iOS Simulator'`), com os
contornos do `STATUS.md` (`RUBYOPT=-rlogger`, `LANG=en_US.UTF-8` para o
CocoaPods, `IPHONEOS_DEPLOYMENT_TARGET=15.1`, `SENTRY_DISABLE_AUTO_UPLOAD=true`)
e `EXPO_PUBLIC_ENABLE_LEAGUE=true` no `expo prebuild`:

- `** BUILD SUCCEEDED **`, três vezes: a primeira versão, depois do prazo de
  autenticação e depois das correções da revisão (a terceira, após um
  `BUILD FAILED` por `loadPreviousOccurrence` devolver opcional, corrigido);
- `RadiantGameCenterModule.o` gerado para arm64 e x86_64; o `Podfile.lock`
  lista `RadiantGameCenter (from ../modules/radiant-gamecenter/ios)`;
- o `.entitlements` gerado tem `com.apple.developer.game-center`;
- nenhum aviso nem erro do compilador no `RadiantGameCenterModule.swift` na
  segunda e na terceira compilação (a saída da primeira foi guardada só em
  parte).

**Não compilado:** para aparelho (`iphoneos`) nem no EAS (Xcode 26). Não houve
build no EAS, por regra desta frente.

## Visto na tela (simulador iOS 26.5, sem conta Apple, chave ligada)

Simulador próprio criado para a frente e apagado ao fim. Lido pela árvore do
`maestro hierarchy` (textos e rótulos de acessibilidade, em ordem):

```text
--- h4
Voltar
Liga da semana
Quem ganha mais XP na semana sobe. Toda segunda a liga recomeça.
Todos
Amigos
Carregando a liga
In progress
Carregando a liga…
Horizontal scroll bar, 1 page
20:00
Celular
--- h7
Voltar
Liga da semana
Quem ganha mais XP na semana sobe. Toda segunda a liga recomeça.
Todos
Amigos
Entre no Game Center para participar
A liga compara o XP que você ganha na semana com o de outros alunos, pelo Game Center da Apple. Aparece só o seu apelido. Sem ele, seu estudo continua igual.
Para entrar, abra Ajustes, toque em Game Center e use sua conta Apple. Depois volte aqui.
Tentar de novo
Horizontal scroll bar, 1 page
20:10
--- h8
Voltar
Liga da semana
Quem ganha mais XP na semana sobe. Toda segunda a liga recomeça.
Todos
Amigos
Entre no Game Center para participar
A liga compara o XP que você ganha na semana com o de outros alunos, pelo Game Center da Apple. Aparece só o seu apelido. Sem ele, seu estudo continua igual.
Para entrar, abra Ajustes, toque em Game Center e use sua conta Apple. Depois volte aqui.
Tentar de novo
Horizontal scroll bar, 1 page
20:11
```

- `h4`: "Carregando a liga…", logo depois de abrir `radiantapp://league`;
- `h7`: estado **sem Game Center**, aba Todos, 10 s depois;
- `h8`: o mesmo estado na aba **Amigos**, e de novo depois de entrar pela linha
  "Liga da semana. Ver sua posição." do **Perfil**.

**Defeito achado aqui e corrigido:** na primeira tentativa a tela ficou em
"Carregando a liga…" por mais de 30 s. O log do sistema mostrou o GameKit
falhando por dentro (`GKErrorDomain Code=6` e depois `Code=3`, e "Could not
create endpoint for service name: com.apple.GameOverlayUI.auth-service") sem
nunca chamar o `authenticateHandler`. Correção no commit `cf04443`: prazo de
10 s no Swift e de 15 s no adaptador; depois dela o estado sem Game Center
apareceu em cerca de 10 s.

**Não visto na tela**, só por teste de unidade, porque exige conta Apple no
Game Center (do dono): lista com o aluno destacado, aluno fora do topo com a
vizinhança, semana sem participantes, sem rede, placar não criado, resumo de
fim de semana e aviso de ultrapassagem na Estude, e a tela de entrada do
GameKit.

## Execuções vermelhas

Cada asserção nova foi vista falhando. Onde o código nasceu antes do teste
passar, o defeito nomeado foi injetado no código já pronto, a suíte rodou e o
código voltou ao original. Saída do `jest` (Node 20.20.2), resumida às linhas
das asserções e ao total:

```text
## leagueWeek — vermelho (módulo vazio): 9 failed, 9 total — TypeError weekStartUtc/formatTimeLeft is not a function
## GamificationService.onXpEarned — vermelho (sem método): 4 failed, 6 passed, 10 total — TypeError onXpEarned is not a function
### injeção: absorbBackup avisa ganho
    ✕ restaurar backup e zerar não são ganho (1 ms)
    - Expected  - 1
    + Received  + 3
Tests:       1 failed, 9 passed, 10 total
### injeção: ouvinte sem try
    ✕ quem para de ouvir não recebe mais, e um ouvinte que falha não derruba o XP
    liga fora
    > 165 |         const pararQuebrado = GamificationService.onXpEarned(() => { throw new Error('liga fora'); });
Tests:       1 failed, 9 passed, 10 total
## GameCenterLeagueAdapter — vermelho (sem módulo)
    Cannot find module './GameCenterLeagueAdapter' from 'src/features/league/GameCenterLeagueAdapter.test.ts'
Test Suites: 1 failed, 1 total
Tests:       0 total
### injeção: ENABLE_LEAGUE com padrão ligado
    ✕ ENABLE_LEAGUE lê EXPO_PUBLIC_ENABLE_LEAGUE, com padrão desligado (2 ms)
    Expected: 97
    Received: 112
Tests:       1 failed, 5 passed, 6 total
## LeagueService — vermelho (sem módulo)
    Cannot find module './LeagueService' from 'src/features/league/LeagueService.test.ts'
Test Suites: 1 failed, 1 total
Tests:       0 total
### injeção: reenvia sem XP novo
    ✕ sem XP novo, não reenvia (3 ms)
    ✕ sem rede: guarda, e reenvia o total uma vez só quando a rede volta (2 ms)
    ✕ dois envios ao mesmo tempo não mandam o mesmo total duas vezes (1 ms)
Tests:       3 failed, 21 passed, 24 total
### injeção: flush sem fila única
    ✕ dois envios ao mesmo tempo não mandam o mesmo total duas vezes (4 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: pendente da semana velha vai para a nova
    ✕ XP pendente da semana encerrada não vai para a semana nova (3 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: sem adotar a pontuação do Game Center
    ✕ reinstalou no meio da semana: adota a pontuação do Game Center em vez de recomeçar do zero (2 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: aviso de ultrapassagem sem limite diário
    ✕ alguém passou o aluno: avisa no máximo uma vez por dia (1 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: resumo sem marca de visto
    ✕ resumo da semana na primeira abertura depois da virada, uma vez só (1 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: vizinhança repete o topo
Tests:       24 passed, 24 total
### injeção: balde não vira na semana nova
    ✕ XP da semana nova começa do zero (3 ms)
Tests:       1 failed, 23 passed, 24 total
### injeção: vizinhança começa sem respeitar o topo (start = rank - 2)
    ✕ vizinhança logo abaixo do topo não repete o 10º (2 ms)
Tests:       1 failed, 23 passed, 24 total
## storageInventory — vermelho com a chave nova fora do inventário
    ✕ toda chave gravada pelo app está no inventário (3 ms)
    +   "@radiant:league_v1 (exact, src/constants/storageKeys.ts:40)",
    +   "@radiant:league_v1 (exact, src/features/league/LeagueService.ts:104)",
    +   "@radiant:league_v1 (exact, src/features/league/LeagueService.ts:117)",
    +   "@radiant:league_v1 (exact, src/features/league/LeagueService.ts:121)",
Tests:       1 failed, 4 passed, 5 total
### injeção: plugin sem condição da chave
    ✕ sem EXPO_PUBLIC_ENABLE_LEAGUE, não muda nada (6 ms)
Tests:       1 failed, 3 passed, 4 total
### injeção: permissão com valor errado
    ✕ com a liga ligada, põe a permissão do Game Center e o texto da lista de amigos (6 ms)
Tests:       1 failed, 3 passed, 4 total
### injeção: rótulo da linha sem 'você' (informação só por cor)
    ✕ lista com o aluno destacado, lida em ordem, num rótulo só por linha, sem depender de cor (61 ms)
    ✕ aluno fora do topo: topo, separador e a vizinhança dele (59 ms)
Tests:       2 failed, 10 passed, 12 total
### injeção: vizinhança do aluno não aparece
    ✕ aluno fora do topo: topo, separador e a vizinhança dele (739 ms)
Tests:       1 failed, 11 passed, 12 total
### injeção: sem rede cai no texto de indisponível
    ✕ sem rede, com nova tentativa (1008 ms)
Tests:       1 failed, 11 passed, 12 total
### injeção: sem tela de entrada não explica os Ajustes
    ✕ sem Game Center e sem tela de entrada: explica o caminho pelos Ajustes (1058 ms)
Tests:       1 failed, 11 passed, 12 total
### injeção (chave desligada): startLeague ignora a chave
    ✕ startLeague não ouve o XP nem grava nada da liga (3 ms)
Tests:       1 failed, 5 passed, 6 total
### injeção (chave desligada): resolveLeagueAdapter ignora a chave
    ✕ nem pede o módulo nativo: o adaptador é o indisponível (1 ms)
Tests:       1 failed, 5 passed, 6 total
### injeção (chave desligada): linha do Perfil ignora a chave
    ✕ Perfil e Estude não mostram linha nenhuma, e a Estude não consulta a liga (27 ms)
Tests:       1 failed, 5 passed, 6 total
### injeção (chave desligada): aviso da Estude consulta com a chave desligada
    ✕ Perfil e Estude não mostram linha nenhuma, e a Estude não consulta a liga (4 ms)
Tests:       1 failed, 5 passed, 6 total
### injeção (chave desligada): rota sem redirecionar
    ✕ a rota /league volta para a Estude (1 ms)
Tests:       1 failed, 5 passed, 6 total
### injeção: Estude sem o aviso da liga
    ✕ com a liga ligada, mostra o aviso da liga e leva a /league (1044 ms)
Tests:       1 failed, 54 passed, 55 total
### injeção: Perfil sem a entrada da liga
  ✕ com a liga ligada, o Perfil tem a entrada da liga, que leva a /league (17 ms)
Tests:       1 failed, 21 passed, 22 total
## autenticação sem resposta (achado no simulador) — vermelho
    ✕ desiste no prazo e responde Game Center indisponível (5002 ms)
    thrown: "Exceeded timeout of 5000 ms for a test.
Tests:       1 failed, 11 passed, 12 total
```

## Revisão independente (13/11/2026)

Um subagente que não escreveu o código revisou o diff contra a `main`. Veredito:
pedir mudanças antes de ligar a chave. O que foi feito com cada achado:

| Achado | Gravidade | Tratamento |
| --- | --- | --- |
| Semana do balde pelo relógio do aparelho, não pela ocorrência do Game Center | alta | corrigido: o envio leva a semana esperada e o Swift recusa com `stale-week`; a página só é adotada se `startsAt` bate com o balde |
| Rota `/quiz` (só deep link) paga XP sem limite | média | corrigido num segundo run da F4 (toca `useQuiz.ts`): o XP dessa rota soma no nível, mas não avisa a liga |
| Tela presa em "Carregando" se a gravação falha | média | corrigido: envio dentro do `try` e `.catch` na tela |
| Resumo da semana perdido por falha de rede | baixa-média | corrigido no Swift: só "sem semana anterior" vira `nil` |
| XP datado de semana anterior apaga o balde atual | baixa | corrigido: descartado |
| Rejeições sem tratamento em `startLeague` | baixa | corrigido |
| Aviso da Estude não some | baixa | corrigido |
| Rede na autenticação mostrada como "indisponível"; amigos negados sem texto | baixa | corrigido: "Sem conexão" e texto próprio para amigos |
| Comentário do plugin prometia binário igual ao da `main` | ajuste | corrigido: o módulo entra no autolink, só não é chamado |
| Dois aparelhos na mesma semana não somam | limite | registrado na ADR |
| Envio e leitura sem prazo (suspeita) | suspeita | corrigido: prazo de 20 s no adaptador |
| `Optional as Any` no dicionário (suspeita) | suspeita | corrigido: `NSNull` |
| Continuação pendente se o módulo for desalocado antes do handler (suspeita) | suspeita | não corrigido; o prazo de 15 s no JS impede travar a fila |
| `timeScope: .allTime` em placar recorrente (suspeita) | suspeita | não conferido na documentação da Apple |

Vermelhos das correções (mesmo método da seção anterior):

```text
## Achados da revisão — vermelho antes da correção
    ✕ relógio adiantado: a pontuação da ocorrência antiga não é adotada no balde novo (1 ms)
    ✕ XP com data de uma semana anterior não apaga o balde da semana atual
    ✕ falha ao gravar o envio não prende a tela em carregando
    ✕ sem rede na autenticação é "sem conexão", não "indisponível" (1 ms)
Tests:       4 failed, 25 passed, 29 total
### relógio atrasado, com contraprova (envio sem a semana esperada)
    ✕ relógio do aparelho atrasado: o Game Center já virou e o total da semana velha não entra na nova (3 ms)
Tests:       1 failed, 28 skipped, 29 total
### prazo de envio/leitura — vermelho: LeagueError lançado solto no timer (withTimeout sem rejeição)
### injeção: leitura sem prazo
    ✕ desistem no prazo como "sem rede", sem travar a fila (5018 ms)
Tests:       1 failed, 14 passed, 15 total
### injeção: tela sem .catch
    ✕ falha inesperada ao ler o placar não prende a tela em carregando (1090 ms)
Tests:       1 failed, 13 passed, 14 total
### injeção: amigos negados sem texto próprio
    ✕ lista de amigos negada tem texto próprio (1016 ms)
Tests:       1 failed, 13 passed, 14 total
### injeção: aviso antigo não sai
Tests:       1 failed, 5 passed, 6 total
```

Vermelho do segundo run (rota `/quiz`), antes da correção:

```text
## Run 2 — XP da rota /quiz fora da liga: vermelho
Tests:       2 failed, 40 passed, 42 total
  ● Console
  ● GamificationService.onXpEarned — o XP ganho que a liga soma › aula da rota legada /quiz (countsForLeague: false) soma no XP, mas não avisa a liga
  ● QuizScreen flow › avaliar e continuar conservam o prêmio e o placar já registrados
```
