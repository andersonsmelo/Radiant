# F6: execuções vermelhas (2026-11-15)

Node 20.20.2, `npx jest <arquivo>`. Cada bloco injeta um defeito no código já verde, roda a suíte do arquivo e restaura (`diff` vazio conferido). Só as linhas `✕` e o total são copiados.

## 1. Flags (`killSwitches.contract.test.ts`), antes de existirem

```
✕ ENABLE_PERSONALIZED_NOTIFICATIONS lê ..., com padrão desligado — Expected: true, Received: false
✕ ENABLE_DECORATIONS lê ..., com padrão desligado — Expected: true, Received: false
Tests: 2 failed, 5 passed, 7 total
```

## 2. Compositor (`composeReminder.test.ts`), por defeito injetado

```
### sem o silêncio da noite (hora usual sem trava)
    ✕ hora usual 7 vira 9 h: nunca no silêncio da noite (1 ms)
    ✕ hora usual 3 vira 9 h: nunca no silêncio da noite
    ✕ hora usual 22 vira 21 h: nunca no silêncio da noite
    ✕ hora usual 23 vira 21 h: nunca no silêncio da noite
    ✕ às 23 h, sem ter estudado, agenda para amanhã de manhã ou de tarde, nunca à noite (1 ms)
Tests:       5 failed, 31 passed, 36 total
### lembrete hoje para quem já estudou hoje
    ✕ já estudou hoje: nada hoje, o lembrete vai para amanhã
Tests:       1 failed, 35 passed, 36 total
### segundo lembrete no mesmo dia
    ✕ o lembrete de hoje já disparou: o próximo só amanhã (no máximo um por dia) (1 ms)
    ✕ o dia-alvo amanhã recalcula o risco: sem estudo ontem nem hoje, não é sequência (1 ms)
Tests:       2 failed, 34 passed, 36 total
### texto de culpa na meta
    ✕ sem culpa nem ameaça de perda: 9
Tests:       1 failed, 35 passed, 36 total
### sem o tipo retorno
    ✕ volta depois de 3 dias (2 ms)
    ✕ retorno é um convite único: só depois de 3 dias, nunca fala de sequência (1 ms)
Tests:       2 failed, 34 passed, 36 total
```

## 3. Contexto (`reminderContext.test.ts`)

O caso do dia em UTC só reprova num aparelho com fuso negativo (medido em America/Bahia); num CI em UTC as duas contas coincidem e o teste passa nos dois sentidos.

```
### hora usual sobre todo o histórico
    ✕ a hora local mais frequente nas últimas 40 (1 ms)
Tests:       1 failed, 6 passed, 7 total
### dia do disparo em UTC
    ✕ lembrete de hoje com horário já passado conta como disparado; o de amanhã, não (1 ms)
Tests:       1 failed, 6 passed, 7 total
### fonte que falha derruba o contexto
    ✕ uma fonte que falha não derruba o lembrete: vira ausência, nunca inventa dado
Tests:       1 failed, 6 passed, 7 total
### empate fica com a hora mais antiga
    ✕ empate fica com a hora da tentativa mais recente; data inválida não conta (1 ms)
Tests:       1 failed, 6 passed, 7 total
```

## 4. Preferências (`notificationPreferences.test.ts`)

```
### valor não booleano desliga o tipo
    ✕ registro inválido "{\"schemaVersion\":1,\"liga\":\"não\"}" não desliga nada (1 ms)
Tests:       1 failed, 5 passed, 6 total
### gravar um tipo religa os outros
    ✕ grava um tipo e preserva os demais (2 ms)
Tests:       1 failed, 5 passed, 6 total
```

## 5. Agendamento (`scheduleReminder.test.ts`)

Antes do defeito, um vermelho de autoria: o caso das três reaberturas esperava `aula`, mas o terceiro contexto ainda tinha revisões devidas; o certo era `revisao` e o teste foi corrigido, não o código.

```
### sem identificador fixo
    ✕ agenda um único lembrete, com gatilho de data que não se repete, e a rota no dado (4 ms)
    ✕ o lembrete antigo da 1.5.0 também sai: no app há no máximo um pendente (1 ms)
Tests:       2 failed, 4 passed, 6 total
### agenda sem cancelar o pendente
    ✕ o lembrete antigo da 1.5.0 também sai: no app há no máximo um pendente (2 ms)
Tests:       1 failed, 5 passed, 6 total
### permissão negada sem cancelar o que estava agendado
    ✕ permissão negada: nada fica agendado, nem o que já estava (2 ms)
Tests:       1 failed, 5 passed, 6 total
### gatilho que se repete
    ✕ agenda um único lembrete, com gatilho de data que não se repete, e a rota no dado (3 ms)
Tests:       1 failed, 5 passed, 6 total
```

## 6. Ramo no `PushService` (`PushService.test.ts`)

Antes do ramo existir: `ligada: o texto e o horário vêm do contexto` (0 chamadas esperadas de `getDueLessons`, 1 recebida) e `ligada e sem aceite` (cancelamento esperado, 0 recebido). Contraprova da flag:

```
### ramo personalizado sem respeitar a flag
    ✕ com aceite e permissão, agenda um lembrete de verdade para a noite (24 ms)
    ✕ com a meta fechada e sem revisão, cancela o lembrete que já estava marcado (1 ms)
    ✕ fila continua retida durante o agendamento e scheduler externo não duplica a notificação (5003 ms)
    ✕ rejeição de agendamento é pública, cauda recupera e próxima decisão termina (15 ms)
    ✕ rejeição de gravação não fabrica sucesso nem envenena leitura e nova escrita (4 ms)
    ✕ grant, deny e false completos não reenfileiram chamadas internas nem travam (2 ms)
    ✕ desligada (contraprova): o lembrete é o da 1.5.0, sem rota nem identificador (3 ms)
Tests:       7 failed, 7 passed, 14 total
### flag com padrão ligado
    ✕ com aceite e permissão, agenda um lembrete de verdade para a noite (3 ms)
    ✕ com a meta fechada e sem revisão, cancela o lembrete que já estava marcado
    ✕ fila continua retida durante o agendamento e scheduler externo não duplica a notificação (5001 ms)
    ✕ rejeição de agendamento é pública, cauda recupera e próxima decisão termina (6 ms)
    ✕ rejeição de gravação não fabrica sucesso nem envenena leitura e nova escrita
    ✕ grant, deny e false completos não reenfileiram chamadas internas nem travam
    ✕ padrão desligado
Tests:       7 failed, 7 passed, 14 total
```

## 7. Toque e Ajustes

```
### rota do dado sem lista permitida
    ✕ {"url": "/subscription"} → null (só rotas da lista) (2 ms)
    ✕ {"url": "https://exemplo.com"} → null (só rotas da lista) (2 ms)
Tests:       2 failed, 8 passed, 10 total
### remontagem repete a navegação
    ✕ app aberto pelo toque: navega uma vez, mesmo remontando (55 ms)
Tests:       1 failed, 9 passed, 10 total
### ouve o toque com a flag desligada
    ✕ desligada: nem ouve o toque (13 ms)
Tests:       1 failed, 9 passed, 10 total
### linhas com a flag desligada
Tests:       3 passed, 3 total
### Ajustes sem as linhas por tipo
  ✕ F6: tipos do lembrete só com ENABLE_PERSONALIZED_NOTIFICATIONS; desligada, o grupo Lembrete tem só a linha da 1.5.0 (183 ms)
Tests:       1 failed, 25 passed, 26 total
```

A guarda "linhas com a flag desligada" passou com o defeito na primeira injeção: olhava a tela antes da leitura assíncrona. O teste passou a esperar a leitura, e então reprovou:

```
### linhas com a flag desligada (teste corrigido)
    ✕ desligada: não monta nada (os Ajustes são os da 1.5.0) (442 ms)
Tests:       1 failed, 2 passed, 3 total
```

## 8. Catálogo e regras (`catalog.test.ts`, `unlocks.test.ts`)

```
### exclusivo ganho sem assinar
    ✕ {"kind": "assinante"} com {"lessonsCompleted": 99, "level": 50, "streakDays": 365, "unitsCompleted": 24} → false (1 ms)
    ✕ quem já cumpriu tudo na atualização ganha tudo de uma vez, sem os exclusivos (1 ms)
    ✕ o que já foi ganho não volta a aparecer como novo (2 ms)
Tests:       3 failed, 20 passed, 23 total
### equipado mostrado sem estar disponível
    ✕ item equipado que deixou de estar disponível volta ao padrão, sem apagar a escolha (2 ms)
Tests:       1 failed, 22 passed, 23 total
### ganho antigo volta como novo
    ✕ o que já foi ganho não volta a aparecer como novo (3 ms)
Tests:       1 failed, 22 passed, 23 total
### cor fora dos tokens
    ✕ toda cor vem de um token do tema, sem asset binário (2 ms)
Tests:       1 failed, 3 passed, 4 total
```

## 9. Serviço (`DecorationsService.test.ts`)

O bloco "grava a chave sem nada ganho e sobre versão mais nova" só removeu a primeira condição; a segunda ficou para a última injeção.

```
### revisão vencida tira a unidade
    ✕ conta aulas e unidades concluídas; revisão vencida de novo não tira a unidade (2 ms)
Tests:       1 failed, 11 passed, 12 total
### fonte de missões que falhou conta como feita
    ✕ missões: todas feitas conta; lista vazia (fonte que falhou) não conta (3 ms)
Tests:       1 failed, 11 passed, 12 total
### ganho volta atrás quando a sequência zera
    ✕ ganho não volta atrás quando a sequência zera (1 ms)
Tests:       1 failed, 11 passed, 12 total
### grava a chave sem nada ganho e sobre versão mais nova
    ✕ nada ganho e nada gravado antes: não cria a chave (a flag desligada nunca chega aqui, e o vazio não suja o backup) (1 ms)
Tests:       1 failed, 11 passed, 12 total
### equipa item bloqueado ou exclusivo sem assinar
    ✕ equipa o que está disponível; recusa o bloqueado e o de outro encaixe (1 ms)
    ✕ exclusivo: equipa só assinando; ao deixar de assinar, some do perfil e a escolha fica (1 ms)
Tests:       2 failed, 10 passed, 12 total
### backup da nuvem sobrescreve o equipado local
Tests:       12 passed, 12 total
```

Duas guardas passaram com o defeito na primeira injeção e foram corrigidas: o caso do backup tinha os dois lados equipando o mesmo selo (sem conflito), e não havia caso de equipar sobre versão mais nova. Depois da correção:

```
### backup da nuvem sobrescreve o equipado local (teste corrigido)
    ✕ restaurar une os ganhos; o equipado local vence, e o da nuvem entra se o local está vazio (5 ms)
Tests:       1 failed, 11 passed, 12 total
### equipar grava sobre registro de versão mais nova (teste novo)
    ✕ registro de versão mais nova: equipar recusa e não grava por cima (1 ms)
Tests:       1 failed, 12 passed, 13 total
```

## 10. Backup e reset

Antes da implementação, os testes novos de mescla e do adaptador: `Tests: 4 failed, 136 passed, 140 total`. Por defeito injetado:

```
### reset sem o passo das decorações
  ✕ o reset local apaga as decorações gravadas (F6) (2 ms)
Tests:       1 failed, 1 total
### fotografia com o campo mesmo sem decoração (payload diferente da 1.5.0)
    ✕ sem decoração gravada, a fotografia não tem o campo (1 ms)
Tests:       1 failed, 10 passed, 11 total
### mescla com o equipado da nuvem por cima do local
    ✕ une os ganhos e mantém o equipado local; o da nuvem só entra no lugar de um vazio (5 ms)
Tests:       1 failed, 53 passed, 54 total
```

## 11. Cabeçalho do Perfil (`ProfileIdentityHeader.test.tsx`)

A primeira versão da guarda "sem decoração, igual à 1.5.0" comparava o componente novo com ele mesmo (sem e com decorações vazias) e passou com o avatar embrulhado: a comparação nunca olhava a 1.5.0. Ela foi trocada por asserções sobre a estrutura que a 1.5.0 desenha. Antes da implementação, o caso do selo reprovou por não achar a moldura. Por defeito injetado:

```
### selo sem nome para o leitor de tela
    ✕ o selo vem com o nome escrito para o leitor de tela, e a moldura e o cartão mudam a forma (10 ms)
Tests:       1 failed, 4 passed, 5 total
### avatar embrulhado mesmo sem moldura (cabeçalho diferente da 1.5.0)
Tests:       5 passed, 5 total
### avatar embrulhado mesmo sem moldura
    ✕ sem decoração (flag desligada ou nada equipado), a estrutura é a da 1.5.0 (5 ms)
Tests:       1 failed, 4 passed, 5 total
### nome embrulhado com decorações vazias
    ✕ sem decoração (flag desligada ou nada equipado), a estrutura é a da 1.5.0 (15 ms)
Tests:       1 failed, 4 passed, 5 total
### cabeçalho com estilo de cartão sem cartão
    ✕ sem decoração (flag desligada ou nada equipado), a estrutura é a da 1.5.0 (4 ms)
    ✕ o selo vem com o nome escrito para o leitor de tela, e a moldura e o cartão mudam a forma (6 ms)
Tests:       2 failed, 3 passed, 5 total
```

## 12. Tela de decorações (`DecorationsScreen.test.tsx`)

```
### exclusivo bloqueado não leva à assinatura
    ✕ bloqueado comum não é botão; exclusivo bloqueado leva à assinatura que já existe (63 ms)
Tests:       1 failed, 4 passed, 5 total
### bloqueado comum vira botão
    ✕ lista os 11 itens nos três encaixes, com o estado escrito e não só por cor (252 ms)
    ✕ bloqueado comum não é botão; exclusivo bloqueado leva à assinatura que já existe (1004 ms)
Tests:       2 failed, 3 passed, 5 total
### equipado sem estado para o leitor de tela
    ✕ equipar e tirar: o estado muda na tela e no storage (110 ms)
Tests:       1 failed, 4 passed, 5 total
### alvo de toque menor que 44 pt
    ✕ todo item tocável tem alvo de pelo menos 44 pt (15 ms)
Tests:       1 failed, 4 passed, 5 total
```

## 13. Perfil, rota e flag (`ProfileScreen.flow.test.tsx`, `flagOff.test.tsx`)

```
### Perfil lê decorações com a flag desligada
  ✕ rejeição real de gamification não derruba fatos de outra seção nem inventa zero (29 ms)
  ✕ rejeição real de curriculum não derruba fatos de outra seção nem inventa zero (26 ms)
    ✕ desligada (padrão): nem lê nem grava decoração, e o Perfil não mostra a entrada (12 ms)
Tests:       3 failed, 19 passed, 22 total
### linha do Perfil com a flag desligada
  ✕ padrão desligado: a rota volta para a Estude e a linha do Perfil não monta (85 ms)
Tests:       1 failed, 1 passed, 2 total
### rota aberta com a flag desligada
  ✕ padrão desligado: a rota volta para a Estude e a linha do Perfil não monta (252 ms)
Tests:       1 failed, 1 passed, 2 total
### equipado não aparece onde o aluno se vê
    ✕ ligada: ganhos em silêncio pelo estado real, selo equipado ao lado do nome e entrada para a tela (47 ms)
Tests:       1 failed, 21 passed, 22 total
```

## 14. Fila do serviço

Achado durante a contraprova: com a flag ligada pelo ambiente (`EXPO_PUBLIC_ENABLE_DECORATIONS=true`), uma leitura que nunca resolvia prendia a fila do serviço e todo `sync` seguinte esperava para sempre. As leituras de progresso e assinatura saíram da fila; o teste novo, rodado contra a versão anterior:

```
### leitura das fontes dentro da fila (versão anterior)
    ✕ uma fonte que nunca responde não prende equipar nem a leitura seguinte (5001 ms)
Tests:       1 failed, 13 passed, 14 total
```

Com a flag ligada pelo ambiente, 4 testes antigos do Perfil reprovam por limitação do mock do `expo-router` daquele arquivo, e não por defeito: ele guarda um único `__focus` (o último `useFocusEffect` registrado, agora o das decorações), e as rejeições `mockRejectedValueOnce` são consumidas pela leitura das decorações, que chama `getSnapshot` e `getCurriculumTrail` antes das leituras adiadas do Perfil. O gate roda com a flag no padrão (desligada), em que os 22 testes passam.

## 15. Gate 1 reprovado (2026-11-15, `EXPO_NO_DOTENV=1 npm run quality`, Node 20.20.2)

`Tests: 2 failed, 3217 passed, 3219 total`, saída 1: `ProfileScreen.flow.test.tsx`, "refoco após ajuste" (`Unable to find an element with text: 7 de 35`). Causa minha: para o Perfil ler antes, o gancho das decorações tinha ido para depois do `useFocusEffect` do Perfil, e o mock de `expo-router` daquele arquivo guarda só o último foco registrado. Depois da mudança eu só tinha rodado esse arquivo com a flag ligada. O gancho voltou para antes do efeito do Perfil, e o arquivo passou em banda única (70 testes no `src/features/profile`).

## 16. Achados da revisão independente, por defeito injetado

```
### D3: preferência sem recalcular o pendente
    ✕ desligar um tipo grava só ele (1109 ms)
Tests:       1 failed, 2 passed, 3 total
### D2: fundo sem recalcular o lembrete
    ✕ ligada: ir para o fundo recalcula o lembrete (quem estudou e fechou não recebe convite da aula feita) (1 ms)
Tests:       1 failed, 12 passed, 13 total
### D4: dia do disparo em UTC, com a máquina em UTC (como o CI)
Tests:       7 passed, 7 total
(passou: `process.env.TZ` atribuído no arquivo de teste não alcança o processo, porque o Jest entrega uma cópia do ambiente. Linhas retiradas; ver README, pendência D4.)
### D5: contagem de hoje no título de amanhã
    ✕ revisão para amanhã não cita a contagem de hoje, que pode ter crescido (2 ms)
Tests:       1 failed, 37 passed, 38 total
### D8: variante 0 da sequência com ameaça de perda
    ✕ sequencia no dia 16: sem culpa nem ameaça de perda (1 ms)
Tests:       1 failed, 37 passed, 38 total
### D6: exclusivo liberado por estar gravado (regra anterior)
    ✕ exclusivo gravado em `unlocked` (backup editado) não fica disponível sem assinar (1 ms)
Tests:       1 failed, 23 passed, 24 total
### D7: sync atrasado regrava depois do reset
    ✕ reset no meio de um sync não é desfeito pela gravação atrasada (1 ms)
Tests:       1 failed, 15 passed, 16 total
```

## 17. Achado do Codex na PR #75: recompensa opcional contava para concluir a unidade

`progressFromSources` filtrava só `review`, enquanto `computeUnitPrimaryProgress` e
`isTrackCompleted` usam `isRequiredProgressionNode`, que exclui também a recompensa com
`optionalForProgression`. A trilha mostrava a unidade concluída e Escudo, Nebulosa e Rastro azul
continuavam travados. Correção: a mesma função, importada de `trackCompletion.ts`.

```
### antes da correção (filtro só de revisão)
    ✕ recompensa opcional não coletada não tira a unidade; recompensa sem a marca continua obrigatória (1 ms)
    Expected: 1
    Received: 0
Tests:       1 failed, 16 skipped, 17 total
### correção larga demais injetada (exclui toda recompensa, inclusive sem a marca)
    ✕ recompensa opcional não coletada não tira a unidade; recompensa sem a marca continua obrigatória (1 ms)
    Expected: 1
    Received: 2
Tests:       1 failed, 16 skipped, 17 total
### com isRequiredProgressionNode
Tests:       17 passed, 17 total
```
