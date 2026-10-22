# Trilha Medalhão — correção final e pausa

Medições de 2026-10-22 e 2026-10-23, na branch `claude/trilha-medalhao-design`,
[PR #66](https://github.com/andersonsmelo/Radiant/pull/66). O dono pediu pausa
em 2026-10-23. **Plano 2 e tarefa 7 não estão aprovados nem concluídos.**
Este registro complementa a [coleta anterior](2026-10-22-trilha-medalhao.md);
`docs/STATUS.md` continua sendo o único estado vivo.

## Proveniência e escopo

O produto publicado anteriormente era `7615827`; `83de747` registrou a coleta
nativa com falhas. As correções desta onda foram preservadas em WIPs próprios
não publicados enquanto o escopo era ampliado, sem absorver trabalho alheio:

| Writer | Escopo | Resultado |
| --- | --- | --- |
| `run-1792689790967-56ecd445` | 53 arquivos | fechado sem validar para acrescentar três caminhos da revisão integral |
| `run-1792707600146-770f7ccb` | 56 arquivos; baseline WIP `10754e8` | fechado sem validar para incluir o YAML do segundo dia |
| `run-1792746135751-b2cdee88` | 57 arquivos; baseline WIP próprio `082d86d` | janela final de documentação/roteiro e validação do conjunto |

Cada abertura confirmou `STEP_STARTED` antes de editar. O escopo não foi
alterado dentro de um run, nem o lock contornado. Os WIPs são consolidados
no commit local de pausa; o SHA corrente deve ser lido no Git. A fonte de
produto permaneceu congelada durante a coleta; no último writer mudaram o
roteiro/contrato do segundo dia e a documentação. Hashes, dados de ambiente e
proveniência dos segmentos estão em [ambiente.txt](2026-10-22-trilha-medalhao-final/ambiente.txt)
e [playback-native.json](2026-10-22-trilha-medalhao-final/playback-native.json).

Dev clients **existentes**, Debug 1.4.0 (3), com Skia: iOS26.5 no E262D4C1;
Android14/API34/arm64 no AVD `radiant-entrada-api34`. Metro8081 no worktree,
Node20.20.2, sem dotenv; Loop no Node24.14.1. Sem build nativa, EAS, merge ou
ação de loja. Simulador/emulador Debug não prova aparelho físico ou Release.
VoiceOver real não foi exercitado. Não se editou relógio, respostas ou
armazenamento para fabricar revisão devida; `clearState` foi usado somente
nos roteiros de primeira execução/preparação autorizados, depois do dia2.

## Implementado e verificado em fonte

- Caixa explícita da medalha e deslocamento numérico corrigem a cabeça de
  48×46 antes montada em x=-249,75pt. Medição nativa do encaixe corrigido:
  iOS48×46pt; Android47,99999×45,81819dp (arredondamento de densidade).
- Reservas permanentes:31pt inferiores no zigue-zague;64pt laterais na coluna,
  mantendo fonte e conteúdo íntegros, sem ellipsis ou reflow ao fim do momento.
- Rota real L1 → revisão futura → L2, com iluminação de todos os conectores,
  contorno dos blocos intermediários e medidas atuais/positivas de todas as
  linhas por assinatura. Cache antigo e altura0 não iniciam o relógio. Só
  bandas/cabeçalhos continuam interrompendo a conexão desenhada.
- Visibilidade combina token da lista com corpo nativo da medalha dentro do
  viewport; um título ainda visível não mantém a ilustração fora da tela tocando.
- Data/hora futuras são texto visível com largura segura. Faixa da barra usa
  `textOnAccent` e evita o retângulo real do contador (contraste5,75:1).
- Lembrete reconcilia a preferência persistida após falha e informa o erro;
  leitura desconhecida oferece nova consulta sem inventar estado nem escrever.

A revisão independente forte conferiu21/21 hashes do congelamento e deu
**parecer de fonte favorável**, sem novo P1/P2 confirmado. Conferiu também o
patch/contrato posterior de segundo dia. Não deu aprovação integral do plano.

[Testes vermelhos](2026-10-22-trilha-medalhao-final/testes-vermelho.txt) e
[verdes](2026-10-22-trilha-medalhao-final/testes-verde.txt) preservam os comandos
e as falhas específicas:11 iniciais,3 geométricas,1 de visibilidade corporal,
2 de largura da data,2 do lembrete,7 da topologia,1 de altura0 e o contrato do
roteiro. Verdes focais finais: **8 suítes/260 testes**, lembrete **13/13**,
contrato Maestro **37/37**, typecheck/lint0. O log do conjunto260 preserva erro
de armazenamento intencional e avisos `act` da VirtualizedList. Estes números
não substituem a suíte integral nem demonstram rasterização/FPS.

## Roteiros nativos

| Roteiro | Medição nesta onda |
| --- | --- |
| primeira execução, iOS | **PASS**, exit0, apresentação → L1 3/3 → conclusão → revisão futura |
| vidas esgotadas, iOS | **PASS**, exit0, cinco vidas consumidas, sexto retorno barrado e L1 mantida concluída |
| segundo dia, Android, YAML anterior | **FAIL**, exit1, apenas na assert final após revisão3/3, resumo e retorno |
| pós-condição complementar, Android | **PASS**, exit0, DOWN até CTA → UP100% centralizado com assentamento500ms → mesma regex completa |
| segundo dia integral, YAML corrigido | **não executado**; depende de revisão naturalmente devida |

Logs: [primeira execução](2026-10-22-trilha-medalhao-final/maestro-primeira-execucao.txt),
[vidas](2026-10-22-trilha-medalhao-final/maestro-vidas-esgotadas.txt),
[segundo dia e checkpoints](2026-10-22-trilha-medalhao-final/maestro-segundo-dia.txt).

O retorno ancora L2; a medalha da revisão podia ficar acima do viewport, com
apenas título/data visíveis. O YAML agora espera `journey-trail`, centraliza
UP100% com `waitToSettleTimeoutMs:500` e mantém a assert completa de título,
data e hora. Um probe inicial de20s terminou antes do reconhecimento; assert
isolada posterior e probe500ms passaram. Isso não transforma o flow canônico
falho em PASS. Não limpar estados preservados para tentar repetir dia2 cedo;
ler a data na UI e aguardar o vencimento real. O estado devido do AVD já foi
consumido; a coleta posterior preparou L1 novamente, com data futura.

## Vídeos e quadros iOS

O [vídeo iOS](2026-10-22-trilha-medalhao-final/ios-momento.mp4) conserva dois
segmentos completos, concatenados sem recomprimir:

| Intervalo no arquivo | Coleta | Estado da revisão |
| --- | --- | --- |
| 0–11,681667s | normal, trilha lida com L1 antes de concluir3/3 | trecho visível/chegada aprovados pelo revisor |
| a partir de11,681667s; segmento de11,983333s | maior texto AX5, ativado antes do retorno | coletado; revisão independente integral pendente |

Os [quadros1](2026-10-22-trilha-medalhao-final/ios-momento-1.png),
[2](2026-10-22-trilha-medalhao-final/ios-momento-2.png) e
[3](2026-10-22-trilha-medalhao-final/ios-momento-3.png) são de5,925/5,96/6,6s do
segmento normal; o revisor os comparou pixel a pixel. O quadro2 mostra a cabeça
inteira ao lado do título/data da revisão intermediária e bem acima da célula
de destino: **overflow entre células comprovado no iOS normal**. O corte do
quadro1 é o limite superior normal da área rolável. L1 fica acima da janela
pela ancoragem preexistente; partida em L1 é prova de fonte/geometria, não da
câmera. Chegada, cabeça estável e CTA foram conferidos também a7,5s, exportado
como [Pixel48pt](2026-10-22-trilha-medalhao-final/ios-pixel-48pt.png).

[Movimento reduzido](2026-10-22-trilha-medalhao-final/ios-reduzir-movimento.mp4),
4,585s, usa a mesma preparação com leitura prévia da trilha e argumento nativo
`radiantReduceMotion=1`; quadros a[2,5s](2026-10-22-trilha-medalhao-final/ios-reduzir-movimento-1.png)
e [3,0s](2026-10-22-trilha-medalhao-final/ios-reduzir-movimento-2.png).
[Texto máximo](2026-10-22-trilha-medalhao-final/ios-texto-maximo.png) é o quadro
final do segmentoAX5 já coletado: cabeça inteira e conteúdo grande, com corte
natural pelo viewport. Ambos aguardam revisão independente completa.
A [captura da trilha](2026-10-22-trilha-medalhao-final/ios-trilha.png) registra
uma posição de rolagem do roteiro; não é o ensaio de cabeça inteira.

O primeiro retorno do onboarding é a primeira leitura da trilha e não toca o
momento por contrato. As gravações finais saem da introdução por `Fechar quiz`,
leem Journey com L1 e retomam a aula pela ação real antes de concluir. Não
injetam progresso. As gravações anteriores sem essa preparação não foram
usadas para aprovar o momento. Captura integrada usou os comandos oficiais
[startRecording/stopRecording](https://docs.maestro.dev/reference/commands-available/startrecording);
os arquivos que o Maestro reacomodou em seu diretório de resultados foram
copiados preservando os bytes, antes da concatenação documentada.

## Android: evidência inconclusiva e cenário 40 pendente

[Trilha](2026-10-22-trilha-medalhao-final/android-trilha.png) e
[fonte200%](2026-10-22-trilha-medalhao-final/android-texto-maximo.png) mostram
cabeça inteira. A fonte foi restaurada a1,0 antes de encerrar. O native layout
registrou L1 fora do viewport com `playing:false` e L2 visível com `playing:true`;
isso é leitura parcial de props, não prova completa de todos os relógios.

O [vídeo Android](2026-10-22-trilha-medalhao-final/android-momento.mp4),
19,5985s, tem142 quadros (média7,25fps da **gravação**, não FPS do app). Há lacuna
entre PTS17,055978 e18,841600:1,785622s no trecho decisivo. Os
[quadros1](2026-10-22-trilha-medalhao-final/android-momento-1.png),
[2](2026-10-22-trilha-medalhao-final/android-momento-2.png) e
[3](2026-10-22-trilha-medalhao-final/android-momento-3.png) são de8,8/17,0/19,14s.
Não demonstram o percurso. Ready antes da âncora, clipping ou coleta/renderização
atrasadas são hipóteses, **não causa nem P2 de produto confirmados**.
A revisão independente exige vídeo mais denso e eventos timestampados de
recommended, ready/holding, pedido de âncora, scroll, slot/rota e onDone antes
de escolher um patch. Não aumentar duração para fabricar aprovação.

A story `Trilha/JourneyTrail/QuarentaConcluidas`, em
`JourneyTrail.stories.tsx`, está pronta com 40 nós sintéticos concluídos e cinco
temas, sem acesso ao progresso do aluno. **Não foi aberta nem medida**.
Não existem resultados novos de40 concluídas, três rodadas de gfxinfo ou prova
nativa completa de pausa fora do viewport nesse cenário. O benchmark anterior
(~59,9FPS com três desbloqueadas) não preenche esse requisito. G6 mede dados e
abertura, não FPS contínuo. Na retomada, manter Mac desbloqueado e declarar
emulador/Debug, duração média e pior quadro efetivamente capturado.

## Fechamento da pausa

- Coleta/implementação interrompidas a pedido do dono; nenhuma nova investigação
  nativa depois da pausa. Somente preservação de artefatos existentes e docs.
- iOS restaurado a `large`, app parado e simulador desligado; Android restaurado
  a1,0 e ADB sem dispositivos na medição final; o agente não executou
  force-stop, remoção explícita do reverse ou emu kill. Metro8081 encerrado.
- Sessão do cérebro da preparação já fechada. Não foi gravada memória nova.
- Gate configurado da última janela: **não executado**. O dono priorizou
  o prompt imediato de continuidade; writer57 encerrado sem validação,
  sem `step finish`, sem memória e sem alegar conclusão funcional. A retomada
  deve abrir nova janela e validar o conjunto.
- Sem aprovação final do Plano 2, merge, build, EAS, loja ou publicação de conteúdo.

A integridade dos arquivos presentes está em
[checksums.sha256](2026-10-22-trilha-medalhao-final/checksums.sha256).
Pendências e prompt autocontido: [índice dos planos](../superpowers/plans/2026-10-21-trilha-medalhao-indice.md#prompt-de-continuidade--pausa-de-2026-10-23).
