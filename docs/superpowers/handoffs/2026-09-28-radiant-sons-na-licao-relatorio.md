# Relatório — sons e vibração na lição do aluno (FILA, 31)

**Sessão:** 2026-09-28, de manhã (−03), na mesma conversa do 25, do 20 e do
7a, a partir de um achado do dono antes da build de produção.
**Branch:** `feat/d4-decisoes-de-revisao`, que é o da PR
[#38](https://github.com/andersonsmelo/Radiant/pull/38), ainda aberta.
**Run do Loop:** `run-1790596448200-fa0291f7`. Uma primeira abertura
(`run-1790596431734-59288691`) reprovou no `step begin` com `INVALID_SCOPE`,
porque declarava o `.claude/launch.json`, que fica fora de `allowedRoots`. Ela
foi fechada de `context_ready` e reaberta sem esse arquivo.
**Decisão:** [ADR de 2026-09-28](../../adr/ADR-2026-09-28-sons-na-licao-da-1-4.md).

## O achado e a causa

- **O relato do dono:** na build `development` `c4eeeb44`, a lição não tocava
  os sons escolhidos em 2026-09-23.
- **A causa, medida no código:** não era defeito. A camada de som e vibração
  (`src/ui/feedback/`) só era usada pela lição híbrida do piloto
  (`HybridLessonScreen`), que fica atrás de `SHOW_DEV_TOOLS`. Era o escopo da
  spec do piloto.
  - A lição do aluno (`LessonFlowScreen`) vibrava só ao concluir.
  - O card do Perfil estava escondido em produção. O comentário ao lado dele
    já mandava tirar essa trava quando os sons chegassem à lição do aluno.
- **O dono escolheu B:** ligar os sons antes da build.

## O que mudou

- **`LessonFlowScreen.tsx`:** a lição monta a mesma camada do piloto. Os sons
  carregam na abertura e são liberados na saída.

  | Momento | Som | Vibração |
  |---|---|---|
  | Tocar numa alternativa | toque | seleção |
  | "Continuar" com erro | erro | erro |
  | A vida cai de fato (mesmo critério do anúncio do item 25) | ~~vida~~ | ~~perda de vida~~ (retirados na revisão, abaixo) |
  | "Continuar" com acerto | acerto | sucesso |
  | Fim da lição aprovada | fim | comemoração |

  O som de erro sai antes da gravação da vida, para não esperar o disco. A
  comemoração, que antes vibrava sempre, passou a obedecer ao interruptor.
- **`ProfileScreen.tsx`:** o card "Sons e vibração" deixou de depender de
  `SHOW_DEV_TOOLS`.
- **Ficaram fora:** o checkpoint (FILA, 29), o quiz antigo e a vibração leve
  dos botões.

## Evidência

**No Jest, no Node `v20.20.2`:**
- **Vermelho antes do conserto:** 7 testes novos da lição reprovaram pelo
  motivo previsto. Nenhum som era pedido, e nada era liberado na saída. No
  teste dos interruptores desligados, a comemoração vibrava mesmo assim.
- **O teste do Perfil** passou a exigir o card no build do aluno e reprovou
  com "Unable to find an element with text: Sons e vibração".
- **Duas guardas vistas falhando por defeito injetado,** porque no vermelho
  natural nada tocava:
  - P1, ignorar as preferências: 3 sons com "Sons" desligado;
  - P2, som da vida sem queda do contador: "vida" tocou para o assinante.

  O arquivo foi restaurado e conferido com `cmp`.
- **Verde:** a lição deu 33 de 33 e o Perfil, 14 de 14. O `tsc` saiu limpo.
- **Gate** `EXPO_NO_DOTENV=1 npm run quality`, em 2026-09-28 às 08:58:
  exit 0, **153 suítes / 1467 testes** (eram 1459, mais 8), lint com 0 erros
  e 26 avisos, visual QA com 0 regressões.

**No simulador,** a pedido do dono (iPhone 17, iOS 26.5, `E3C547AE`):
- **O ambiente:** a build instalada é de 2026-09-27, com o `ExpoAudio`, e o JS
  novo veio do Metro. O simulador estava como assinante (∞), vindo do teste do
  Ask to Buy.
- **O método:** o log do sistema do processo Radiant. Cada som foi
  identificado pela duração que o próprio player registra. As durações dos
  arquivos: toque 0,040 s, acerto 0,290, erro 0,136, vida 0,188, sequência
  0,373 e fim 0,993.

| Hora | Ação | O que o log registrou |
|---|---|---|
| 09:01:10 | abrir a lição | seis faixas de áudio criadas (os seis sons) |
| 09:02:03 | tocar numa alternativa errada | 0,040 s, **toque** |
| 09:02:57 | "Continuar" com erro | 0,136 s, **erro**; nenhum som de vida (assinante) |
| 09:03:14 | concluir reprovada (0 de 1) | **nada**, porque não se comemora reprovação |
| 09:04:04 | tocar na alternativa certa | 0,040 s, **toque** |
| 09:04:06 | "Continuar" com acerto | 0,290 s, **acerto** |
| 09:04:10 | concluir aprovada (3 estrelas) | 0,993 s, **fim** |
| 09:07 | a lição inteira com "Sons" desligado no Perfil | **nada** tocou em 49 linhas novas de log; a preferência gravada foi `{"sounds":false,"haptics":true}` |

Na segunda volta, os players tinham identificadores novos, o que confirma que
foram liberados ao sair e recriados ao entrar. No fim do teste, "Sons" foi
religado (`{"sounds":true,"haptics":true}`), e o app e o simulador foram
desligados.

**Não verificado:**
- **Se o som é audível e soa bem.** O agente não ouve. O log mostra cada
  player tocando até o fim, com o volume subindo de 0 para 1. Também mostra
  `VolumeProcessMute: 1` em todas as reproduções, cujo significado não foi
  apurado: pode ser a regra do modo silencioso (`playsInSilentMode: false`)
  aplicada ao simulador.
- **O som da vida,** porque o simulador estava como assinante. Ele está coberto
  pelo Jest, com o mesmo critério do anúncio do item 25.
- **A vibração:** o simulador não vibra. Está coberta pelo Jest.
- **Que o card aparece em produção.** O simulador roda uma build de
  desenvolvimento, que já mostraria o card. Isso está garantido pelo teste do
  Perfil.
- **Uma nota de método:** o primeiro toque no interruptor, curto, não o
  acionou. Um toque de 0,2 s acionou. É limite da entrada sintética no
  `Switch` nativo, e não do app.

## O teste do dono no iPhone, e a revisão

**Em 2026-09-28, perto das 11h,** o dono percorreu o roteiro no iPhone, com a
build `development` `c4eeeb44` e o Metro com o JS novo. Estava sem assinatura.
- **Funcionou:** o toque, o erro, o acerto, o fim, o card no Perfil, os dois
  interruptores e o modo silencioso.
- **Não ouviu o som do coração,** embora o coração tenha caído.

**A medição,** no simulador `A5FA5443`, sem assinatura e com 5 corações: o
erro começou às 09:55:53.222 e a vida às 09:55:53.224, **2 ms depois**. O som
tocava, mas por baixo do erro.

**A decisão do dono,** com a recomendação do agente: tirar da lição o som e a
vibração do coração, e deixar a queda sutil no HUD. Eles voltam com a animação
em primeiro plano (FILA, 26), tocando depois do erro
([ADR](../../adr/ADR-2026-09-28-sons-na-licao-da-1-4.md), revisão).

**O conserto,** no run `run-1790605035321-a6d79351`:
- **Vermelho antes:** o teste do erro passou a exigir só `['toque', 'erro']` e
  nenhuma vibração de perda de vida, e reprovou com um `"vida"` a mais.
- **A asserção da vibração, vista falhando sozinha:** com uma
  `hapticLifeLost()` injetada, ela deu "Received number of calls: 1".
- **Verde:** 33 de 33, com `tsc` e `eslint` limpos. O anúncio "Você perdeu uma
  vida; restam N" continua.

**A ideia do dono para depois:** uma aba "Configurações" dentro do Perfil,
reunindo os cards de configuração (FILA, 32).

## Arquivos

- `radiant-app/src/features/lesson-flow/screens/LessonFlowScreen.tsx` e o
  teste dele
- `radiant-app/src/features/profile/screens/ProfileScreen.tsx` e o teste dele
- `docs/adr/ADR-2026-09-28-sons-na-licao-da-1-4.md` (nova)
- `docs/STATUS.md`, `docs/archive/STATUS_historico.md`, `docs/FILA.md`,
  `docs/archive/FILA_concluidos.md` e o roadmap
- este relatório e o
  [prompt (12)](2026-09-28-radiant-prompt-de-continuidade-12.md)

## O que fica

- **Ouvir no aparelho, se o dono quiser.** É a única confirmação de que o som
  soa bem. A build de produção da 1.4 (FILA, 30) já leva a camada.
- **A 1.4 continua esperando só o dono:** o 28 e o 30.
- **A próxima frente do agente é o 12.**
