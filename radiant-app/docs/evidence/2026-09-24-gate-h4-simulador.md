# Gate H4 no simulador — 2026-09-24

O gate H4 tem quatro pontos, na FILA e no roadmap:
- checkpoint com aprovação e com reforço;
- retomada sem persistir respostas;
- texto grande;
- leitor de tela.

Todos foram percorridos no simulador, na trilha "Matéria, energia e radiação"
(`track:fundamentos-e-seguranca-radiologica`, lote de produção H4).

**O que ficou decidido:**
- **na primeira passagem**, o gate foi percorrido e **não fechou**: dois
  defeitos ficaram abertos (os achados 1 e 2 abaixo) e o VoiceOver real não
  foi exercitado;
- **no mesmo dia**, os dois defeitos foram corrigidos e reconferidos no
  simulador, e a H4 **fechou** conforme a
  [ADR](../../../docs/adr/ADR-2026-09-24-h4-fechamento-e-vida-no-checkpoint.md).
  Detalhe em "Reconferência", no fim;
- o VoiceOver em aparelho virou item próprio da 1.4.

## Ambiente

- **Simulador:** um **segundo** `iPhone 17 (iOS 26.5)`, criado para este gate,
  com UDID `A5FA5443-4094-4F8E-B2AA-4703F355C77E`. O simulador do E2E
  (`E3C547AE-…`) guarda o dia 1 do caminho 2, e **não foi tocado**.
- **Binário:** o mesmo do E2E, copiado com `xcrun simctl get_app_container`
  do simulador do E2E e instalado no novo. É Debug e mostra `1.3.1` na tela.
- **JS:** o branch `fix/e2e-defeitos-2-e-3` (`9db6dc0`), com os defeitos 2 e 3
  do E2E corrigidos, servido pelo Metro no Node `v20.20.2`.
- **Script do Metro:** uma cópia de `scripts/start-ios-v2.sh` sem o `--ios`.
  A verificação de precedência de ambiente rodou e passou: `REMOTE_SYNC=false`,
  `LEARNING_ROAD=true`.
- **Modo do checkpoint do aluno:** `off`, que é o de produção
  (`student-checkpoints/mode.ts`). A variável
  `EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE` não foi definida.
- **Maestro `2.7.0`:**
  - usado para as atividades e para a árvore de acessibilidade
    (`maestro hierarchy`);
  - os flows eram temporários, ficaram fora do repositório e nenhum tinha
    `clearState`.

### Estado pré-montado, e o que ele NÃO prova

A trilha da H4 é a última da sequência. O app só abre o checkpoint da trilha
ativa, e a trilha ativa é a primeira ainda não concluída. Para chegar a ela, o
progresso das três trilhas anteriores foi gravado como concluído direto no
AsyncStorage (`@radiant:journey_progress_v1`), com o app fechado:
- **as trilhas:** Fundamentos (21 nós), Tórax (18) e Abdome (15);
- **os ids dos nós:** vieram das definições reais do app
  (`JourneyDefinitionService.getTrackDefinition`), gerados num teste temporário
  que foi apagado em seguida.

Foi decisão do dono em 2026-09-24. **Esta evidência não prova a passagem de uma
trilha para a outra.** Isso é coberto por `reward-unlock.yaml` e pelos
caminhos dourados. Da H4 em diante, tudo foi feito pela interface: as 5
primeiras atividades, os checkpoints 1 e 2, o reforço e a aprovação.

## 1. Checkpoint: aprovação e reforço — percorrido

Cada avaliação de competência tem 2 itens e exige 80%, ou seja, os dois
certos. A sequência medida no checkpoint 1 ("Avaliação 1 de 5"):

| Passo | O que a tela mostrou | Captura |
| --- | --- | --- |
| Abertura | "Avaliação 1 de 5 — 2 itens desta competência. A aprovação exige 80%" | `03` |
| Tentativa 1: 1 de 2 certas | uma vida gasta no erro; "Reforço necessário antes de tentar novamente"; "Ciclo 1: explicação causal e prática guiada"; CTA "Revisar competência frágil" | `04`, `06` |
| Reforço | a atividade 01 ("Estrutura e carga") de novo, com 1 de 1 certa, "Sem XP nesta tentativa" e "Próxima revisão em 3 dias" | — |
| Tentativa 2: 2 de 2 certas | "Conquista desbloqueada — Avaliação 1 de 5", CTA "Abrir próxima lição"; XP inalterado (54) | `07` |

A trilha avançou de 3 para 4 de 18. O checkpoint 2 abriu depois das atividades
04 e 05.

## 2. Retomada sem persistir respostas — medido no modo de produção

**O que foi feito:** o app foi fechado com `simctl terminate` na questão 2 de
2 do checkpoint 1, com a questão 1 já respondida.

**Com o app fechado:**
- o AsyncStorage **não tinha** o texto da alternativa escolhida
  ("Mais negativa") nem ids de alternativa (`:option:`);
- não havia chave nenhuma de checkpoint do aluno. As chaves presentes são as de
  progresso, vidas, SM-2, tentativas e fila de sincronização.

**Ao reabrir:**
- o app voltou à trilha, com "Abrir checkpoint";
- o checkpoint recomeçou em "Iniciar checkpoint", do zero (captura `05`);
- **a vida gasta no erro continuou gasta**: 4 de 5.

**O que isso cobre:** "sem persistir respostas" está medido. "Retomada", no
modo `off`, é recomeçar a avaliação; o kernel de retomada no ponto só existe
em `active`, que é só de desenvolvimento, e **não foi exercitado**.

## 3. Texto grande — reprovado nos tamanhos de acessibilidade

**Como foi medido:**
- o tamanho foi trocado com `xcrun simctl ui <udid> content_size`;
- **o app só aplica o novo tamanho ao ser reaberto**: com ele aberto, a tela
  não mudou (medido em AX5).

| Tamanho | Trilha | Checkpoint |
| --- | --- | --- |
| `large` (padrão) | ok | ok |
| `extra-extra-extra-large` (XXXL, maior tamanho padrão) | ok, e o HUD cabe. Palavras partidas sem hífen nos cartões: "Fundamento / s de" | ok: a abertura e a questão refazem o layout (`08`) |
| `accessibility-medium` (AX1) | o HUD cabe (vidas em x 206–382). O título é cortado: "Matéria, energia e r…". O cartão fica "Fundame / ntos de / Radiolo…" (`09`) | não medido |
| `accessibility-extra-extra-extra-large` (AX5) | **quebra.** O título vira "Mat / éri…"; o **HUD sai da tela** (nó das vidas em x 240–577 numa tela de 402 pt), com os corações invisíveis e o resumo cortado em "3 · +1 er"; o CTA vira "Continuar i" (`10`) | **quebra.** O balão do Pixel parte cada palavra em sílabas ("Va / mo / s / co / nfe / rir"), e os corações saem da tela (`11`). Em 60 s de rolagem o Maestro não alcançou "Iniciar checkpoint"; **não medido** se o botão é alcançável |

Isso não contradiz o P0 de Dynamic Type fechado em 2026-08-13, que é o da
**tela de retomada** do kernel (roadmap, H3). As telas medidas aqui são outras.

## 4. Leitor de tela — árvore medida, VoiceOver não exercitado

O simulador não roda o VoiceOver. A árvore de acessibilidade foi lida com
`maestro hierarchy`, e o `inspect` do painel do simulador estava indisponível.

- **Questão do checkpoint:**
  - cada alternativa é um nó `radio button`, com o rótulo igual ao texto e o
    estado `selected` refletindo a escolha;
  - o enunciado e "QUESTÃO 1 DE 2" são nós próprios;
  - "Próxima questão" é um nó com rótulo.
- **HUD:**
  - na trilha, um único nó "4 de 5 vidas; próxima em 28 minutos";
  - no checkpoint, "5 de 5 vidas" mais um nó "5" separado, o resumo lido à
    parte. Se o VoiceOver lê isso duas vezes, **não foi confirmado**.
- **Aprovação:** "Mascote Pixel", "CONQUISTA DESBLOQUEADA", "Avaliação 1 de 5",
  a descrição, "XP total: 54" e "Abrir próxima lição", em ordem de cima para
  baixo.
- **Não verificado:**
  - a navegação e o anúncio reais do VoiceOver;
  - o anúncio da perda de vida;
  - o foco depois de enviar;
  - o TalkBack.

## Defeitos 2 e 3 do E2E, conferidos na tela

**Defeito 2:** o resumo da atividade 01 diz **"Próxima revisão em 1 dia"**
(captura `01`). Antes da correção, o mesmo cenário mostrava "2 dias".

**Defeito 3**, na trilha, com vidas em recarga:
- `4 · +1 em 28 min` fica **sob** os corações;
- o nó do botão de vidas vai de x 206 a 382, numa tela de 402 pt (captura
  `02`). No E2E, ia até x=443.

**Limites do defeito 3:**
- a correção vale do tamanho padrão até o AX1;
- no AX5, o HUD volta a sair da tela: é o achado 2.

## Achados

1. **O texto do checkpoint descreve o desenho antigo, de avaliação única com
   10 itens.**
   - **O que a tela diz:**
     - a abertura diz "Responda 10 questões, duas por competência. Para
       avançar, acerte pelo menos 8" (`CheckpointScreen.tsx:637`);
     - o reforço diz "O checkpoint exige 8 acertos"
       (`CheckpointScreen.tsx:609`).
   - **O que a avaliação é:** tem 2 itens e mostra "Questão 1 de 2" e "Você
     acertou 1 de 2 questões".
   - **Causa:** desde 2026-08-21 o lote tem cinco avaliações de 2 itens, e os
     dois textos continuaram fixos. É promessa falsa ao aluno.
2. **Os tamanhos de texto de acessibilidade quebram a trilha e o checkpoint.**
   - no AX1: título cortado e palavras partidas;
   - no AX5: o HUD sai da tela, as palavras se partem em sílabas e o CTA é
     cortado.
3. **O tamanho de texto só é aplicado quando o app é reaberto.** É uma
   observação, e não se investigou se é do dev client ou do app.
4. **Para decidir, não é defeito:** uma vida gasta num checkpoint abandonado
   continua gasta, embora a resposta que a gastou seja descartada.

## Capturas

As capturas estão em [`2026-09-24-gate-h4-simulador/`](2026-09-24-gate-h4-simulador/),
reduzidas para 1000 px de altura:
- `01`: defeito 2;
- `02`: defeito 3;
- `03`: abertura do checkpoint;
- `04`: questão 2;
- `05`: retomada;
- `06`: reforço;
- `07`: aprovação;
- `08`: XXXL;
- `09`: AX1;
- `10` e `11`: AX5.

## Reconferência depois dos consertos (2026-09-24, fim da tarde)

**O que foi usado:**
- o mesmo simulador (`A5FA5443-…`) e o mesmo binário;
- o JS do branch `fix/e2e-defeitos-2-e-3` com os três consertos da H4:
  - `6b76bc7`: texto do checkpoint;
  - `de397b6` e `9ddea97`: texto grande.

**O Metro:** foi reiniciado para cada conferência, porque em modo CI ele não
relê arquivos alterados, e foi parado antes de cada `loop validate`.

**A primeira conferência do texto grande reprovou**, e isso ficou registrado no
`9ddea97`:
- no AX5, o título do estágio, fixo acima da trilha, tomava a tela;
- a trilha ficava sem altura, e o CTA ia para baixo da barra de abas (nó
  "Abrir checkpoint" em y 819–1051 numa tela de 874 pt).

A correção pôs o cabeçalho dentro da rolagem da trilha e um teto de 2× no
título e no rótulo de botão.

| Tamanho | Trilha | Checkpoint |
| --- | --- | --- |
| `large` (padrão) | zigue-zague como antes (`14`) | — |
| AX1 | uma coluna, linha à esquerda alinhada às âncoras, título inteiro, palavras inteiras, CTA visível (`13`) | — |
| AX5 | HUD em x 206–382; título em palavras inteiras com a contagem embaixo; CTA "Abrir checkpoint" em y 715–771, acima das abas (801) (`12`) | balão sob o Pixel com palavras inteiras (`15`); "Iniciar checkpoint" alcançável rolando, com o rótulo em duas linhas de palavras inteiras (`16`) |

- **Texto do checkpoint (achado 1):** a tela mostra "Responda as 2 questões.
  Para avançar, acerte todas." (`16`).
- **Resíduo aceito:** no AX4/AX5, uma palavra mais larga que o cartão da
  trilha ainda se parte ("Fundame / ntos", captura `12`), como acontece no
  texto nativo do iOS.
- **Detalhe da captura `15`:** foi feita antes do teto de 2× no rótulo de
  botão (`9ddea97`). A tela do balão não muda com ele.

**Gate de qualidade:** `EXPO_NO_DOTENV=1 npm run quality`, Node `v20.20.2`, no
branch em `9ddea97`. Resultado: **exit 0**, **150 suítes / 1415 testes**, lint
com 0 erros e 26 avisos, visual QA sem regressão.
