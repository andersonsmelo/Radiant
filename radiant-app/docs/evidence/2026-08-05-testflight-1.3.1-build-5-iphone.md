# TestFlight 1.3.1 (5) — smoke em iPhone físico e VoiceOver parcial — 2026-08-05

- **Data da coleta:** 2026-08-05, entre 09:12 e 17:30 (`-03`)
- **Responsável pela execução:** Anderson
- **Alvo:** iPhone físico; modelo e versão do iOS não foram registrados e não
  são inferidos a partir das capturas
- **Artefato:** TestFlight `1.3.1 (5)`, lido no binário instalado
- **Smoke funcional:** `passed`
- **Gate 2 / B4:** evidência auditiva parcial; continua aberto
- **Código alterado ou correção aplicada:** nenhuma

As capturas foram fornecidas durante a sessão guiada e permaneceram fora do
Git, conforme a política desta pasta. Este registro conserva somente os fatos
observados e não inclui dados pessoais do contato de revisão.

## Resultado por cenário

| Cenário | Resultado | Evidência observada |
| --- | --- | --- |
| 1 — primeira abertura | `passed` | Após apagar e reinstalar pelo TestFlight, a apresentação do Pixel apareceu em três telas puláveis antes de `Foco de hoje`. Fechar e reabrir não repetiu a apresentação. |
| 2 — barra de status | `passed` | Relógio, sinal, Wi-Fi e bateria permaneceram legíveis em Home, Galáxia, interior da trilha, Progresso e Missões. |
| 3 — laço local-first | `passed` | A lição levou ao checkpoint, a celebração exibiu `CONQUISTA DESBLOQUEADA`, e Progresso preservou `20 XP` e sequência de `1 dia`. `REVISÕES 0` é o estado correto no mesmo dia; ver a correção do critério abaixo. |
| 4 — relaunch offline | `passed` | Com modo avião e Wi-Fi desligado, o app abriu, permitiu estudar, foi fechado e reaberto mantendo `20 XP`, sequência de `1 dia` e o catálogo local acessível. |
| 5 — links legais | `passed` | Política de Privacidade e Central de Suporte abriram a partir do cartão `Ajuda e informações`; o retorno ao app funcionou nos dois casos. |
| 6 — prompt de avaliação | `passed` pelo critério oportunista | Nenhum aparecimento precoce foi relatado. A ausência do diálogo não reprova porque o sistema da Apple controla sua exibição. |
| 7 — conquista bloqueada | `passed` | O deep link externo abriu `Conquista da unidade`, exibiu `Bloqueada até a unidade fechar` com progresso `3 de 14`; após rolar até o fim, havia apenas `Voltar para jornada`, sem botão de coleta. |

## A contradição de `REVISÕES 0`

O roteiro de smoke dizia que XP, sequência **e revisões** deveriam ser maiores
que zero logo após a conclusão. Esse critério contradizia a especificação e a
evidência em device já validadas:

- `REVISÕES` conta somente cards **vencidos agora** — `getDueLessons` filtra
  `nextReviewAt <= agora`;
- ao concluir a lição, `recordQuizResult` cria o card **e aplica o SM-2 na mesma
  chamada**; todo ramo termina com intervalo ≥ 1 dia (`INITIAL_INTERVALS[0]` no
  sucesso, o mesmo valor no reset por falha, `MIN_INTERVAL_DAYS` como piso), de
  modo que nenhum card chega a ser persistido vencido;
- no mesmo dia, portanto, `REVISÕES 0` é esperado; provar a revisão vencida
  exige outra data ou avanço controlado do relógio.

Registrado com essa precisão de propósito, verificado no código em 2026-08-05: a
primeira redação atribuía o `0` a "o intervalo inicial ainda não venceu". O card
recém-criado nasce, isolado, com `nextReviewAt` igual a agora — vencido. O que
sustenta o `0` é a aplicação imediata do SM-2 na mesma chamada. A diferença
importa para quem for reverificar: se algum caminho futuro persistir um card sem
passar pelo SM-2, `REVISÕES > 0` volta a aparecer no mesmo dia, e este documento
diria que isso é impossível.

O sinal válido deste cenário é `XP > 0` com sequência persistida, e ambos foram
observados. A tela também mostrou `PRECISÃO 0%` e `Fundamentos 0% · 2 lições`.
A leitura de 2026-08-05 foi conservadora; a verificação de código a reforça. O
componente distingue ausência de tentativas (`—`, com a legenda de nenhuma
tentativa avaliada) de zero por cento, e a estatística por tópico é a mesma
razão restrita ao tópico. Logo, `0%` não é ambíguo: houve tentativas avaliadas e
nenhum acerto entre elas, em duas lições distintas. **Não é defeito** — e, pelo
mesmo caminho, é a leitura que garante o `REVISÕES 0`, porque erro total cai no
ramo de reset do SM-2, que também agenda para o dia seguinte.

## VoiceOver — o que foi e o que não foi provado

Com VoiceOver ligado, a execução humana ouviu, sem repetição espontânea:

- `Galáxia, aba 2 de 4, botão`;
- `Progresso, aba 3 de 4, botão`;
- `Confirmar reset com token, escurecido`.

Isso confirma nome, posição/função e estado desabilitado em controles reais. A
posição `2 de 4` ou `3 de 4` é contexto estrutural do iOS, não duplicação do
rótulo.

O item 2 do Gate 2, porém, pede uma passagem pelos `AppButton` que também ouça
dicas e um estado ocupado. Nenhum controle ocupado foi ativado nesta sessão, e
uma dica não foi transcrita. O contrato unitário do componente declara
`accessibilityState={{ disabled, busy }}`, mas inspeção estática não substitui
o anúncio auditivo exigido pelo gate. Por isso B4 continua **aberta por
evidência incompleta**, não por falha observada.

A lacuna conhecida da apresentação — o rótulo da ilustração não compõe o rótulo
do grupo — não foi reclassificada como regressão nesta sessão.

## O que precisa ser corrigido ou concluído

### Documentação corrigida neste run

1. Remover do cenário 3 a exigência incorreta de `REVISÕES > 0` no mesmo dia.
2. Registrar o smoke físico e a diferença entre smoke funcional aprovado e B4
   ainda incompleta.

### Produto — sem correção aplicada

1. **Nenhum defeito novo de código foi confirmado por este smoke.** Em especial,
   `REVISÕES 0` não deve gerar patch.
2. A lacuna conhecida do rótulo da ilustração da apresentação continua
   candidata a refinamento de acessibilidade, sem mudança nesta sessão.
3. O dono aprovou a direção visual e pediu refinamentos de design futuros, mas
   não especificou alterações concretas; isso precisa de escopo próprio antes
   de implementação.

### Evidência e release ainda pendentes

1. Completar B4 ouvindo ao menos um `AppButton` com dica e um controle realmente
   ocupado, confirmando anúncio único e ordem esperada.
2. Executar o caminho destravado de B5 (`reward-unlock`); este smoke validou
   somente a proteção do estado bloqueado.
3. F4 continua separada: **Adicionar para revisão/App Review não foi acionado**.
4. Na próxima coleta física, registrar modelo do iPhone e versão do iOS junto da
   versão/build.

## Veredito operacional

O build `1.3.1 (5)` passou o smoke funcional em iPhone físico, incluindo links,
deep link protegido e relaunch totalmente offline. A F1 avança, mas permanece
aberta exclusivamente pela passagem auditiva incompleta de B4. Não há base
nesta evidência para cancelar, redisparar ou alterar o binário.
