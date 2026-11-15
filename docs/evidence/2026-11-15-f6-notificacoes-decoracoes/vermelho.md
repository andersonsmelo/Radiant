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
