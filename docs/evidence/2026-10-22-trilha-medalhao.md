# Trilha Medalhão — evidência nativa de 2026-10-22

Plano 2, tarefa 7. Fonte medida: `76158274b0f253e56467a3a61a6370ff2b9f6f97`.
Execução por Codex no worktree `trilha-2026-10-20`, sob o run
`run-1792686789421-4d7b1961`. Coleta nativa executada; aceite funcional/visual da tarefa 7 pendente pelos achados abaixo.

## Ambiente e limites

- iOS 26.5, simuladores `Radiant E2E 17 Pro` (`E262D4C1`) e
  `Radiant E2E dia 2 (2026-10-18)` (`5FD8C926`).
- Dev client Debug existente, versão 1.4.0 (3), com Skia. O binário compatível
  foi instalado no simulador de dia 2 sem desinstalar nem limpar seus dados.
- Metro na porta 8081, Node 20.20.2, servindo este worktree; sem leitura de
  dotenv. Loop no Node 24.14.1. Nenhuma build, EAS, merge ou ação de loja.
- Android: AVD existente `radiant-entrada-api34`, Android 14/API 34/arm64,
  Android Emulator 37.2.12.0 e dev client Debug 1.4.0 (3).
- Capturas e números de emulador/Debug não provam desempenho de Release nem
  experiência em aparelho físico. VoiceOver não foi medido nesta etapa.

Identidade do binário, hash e medições de layout:
[ambiente.txt](2026-10-22-trilha-medalhao/ambiente.txt).

## Achado nativo: o Pixel está fora da tela

Na trilha já carregada, a cabeça não aparece ao lado da recomendação, tanto no
iOS quanto no Android. O componente está montado. No iOS, uma leitura por CDP
de `measureInWindow` dos hosts Fabric mediu:

| Peça | x (pt) | y (pt) | largura × altura (pt) |
| --- | ---: | ---: | ---: |
| Cabeça e encaixe animado | -249,75 | 389,00 | 48 × 46 |
| Caixa da medalha | 96,25 | 368,00 | 80 × 88 |
| Âncora da recomendação | 37,25 | 343,00 | 198 × 222 |
| Linha da trilha | 16,00 | 343,00 | 370 × 234 |

O encaixe usa `right: '100%'` e margem de 8 pt. O resultado corresponde a
`96,25 + 80 - 370 - 48 - 8 = -249,75`: a base percentual observada é a linha
de 370 pt, e não a caixa de 80 pt. Esta é a causa sustentada pelas medidas;
a correção ainda precisa de remedição no nativo.

A leitura de diagnóstico percorreu os fibers existentes e chamou somente
`measureInWindow`; não modificou dados, progresso, relógio ou respostas. O
scratch global temporário foi apagado após a leitura.

- [iOS, Pixel de 48 pt fora do viewport](2026-10-22-trilha-medalhao/ios-pixel-48pt.png)
- [Android, posição esperada sem Pixel visível](2026-10-22-trilha-medalhao/android-trilha-inicio.png)

Isso impede declarar comprovado o percurso visual da cabeça. É um achado para
a onda final de correção do plano, junto da ocupação da cabeça na coluna de
texto grande, playback fora do viewport, data futura visível e barra de
progresso. O verde do Jest não substitui esta observação.

## Roteiros Maestro

| Roteiro canônico | Resultado medido |
| --- | --- |
| `radiant-1-4-primeira-execucao.yaml` | PASS, código 0: apresentação, L1 com 3/3, conclusão e retorno à trilha; sem alteração do YAML |
| `radiant-1-4-segundo-dia.yaml` | PASS na terceira execução, código 0, depois do vencimento natural; as duas tentativas anteriores falharam antes da pré-condição |
| `radiant-1-4-vidas-esgotadas.yaml` | FAIL ao reabrir a L1 concluída: o alvo estava sob o HUD; o esgotamento das vidas não foi alcançado |

O dia 2 foi tentado novamente depois de dispensar o alerta de abertura do
iOS. A segunda tentativa também falhou na primeira asserção de revisão devida.
Nessas tentativas, a trilha preservada recomendava a aula seguinte e mostrava
a revisão anterior em ouro; não foi editado armazenamento nem relógio para fabricar a pré-condição.
Essas duas tentativas não aprovam o roteiro. A hierarquia preservada em
`ambiente.txt` informa a data exata: `Disponível em 22/10/2026 às 13:56`,
com `enabled=false`. A terceira execução, depois das 14h06 e desse horário real,
no mesmo simulador e com dados preservados, **passou por inteiro, código 0**:
revisão devida → três respostas corretas → Revisão concluída → próxima data.
Não foi alterado relógio nem armazenamento. A falha anterior era uma janela
ainda não vencida, não uma regressão demonstrada de produto.

O alerta inicial só respondeu ao toque nativo com duração de 0,2 s, depois de
toques curtos do plugin terem sido reportados sem efeito visível. Os logs das
duas tentativas foram preservados.

- [Primeira execução](2026-10-22-trilha-medalhao/maestro-primeira-execucao.txt)
- [Segundo dia](2026-10-22-trilha-medalhao/maestro-segundo-dia.txt)
- [Vidas esgotadas](2026-10-22-trilha-medalhao/maestro-vidas-esgotadas.txt)

## Falha do roteiro de vidas: alvo sob o HUD

O roteiro concluiu a L1 com um erro, registrou 2/3 e a passagem de cinco para
quatro vidas, e voltou à trilha. A rolagem declarou 100% visível a medalha
concluída em `[102,29][170,126]`, mas seu centro de toque, aproximadamente
`(136,78)`, estava sob o cabeçalho. O toque foi reportado como concluído e a
tela permaneceu na trilha; a asserção seguinte, `Passo 1 de 5`, falhou.

Um probe complementar, sem limpar estado, usou `direction: UP` e
`centerElement: true` antes de tocar a mesma L1. Passou com código 0 e abriu
`Passo 1 de 5`. Seu log está anexado ao log do roteiro de vidas. Isso sustenta
o problema de posicionamento do alvo; **não aprova o roteiro completo nem
valida o cenário de vidas esgotadas**. O YAML canônico não foi alterado neste
run documental.

## Capturas iOS e movimento

- [Abertura da aba carregada no simulador de dia 2, após vencimento natural da revisão](2026-10-22-trilha-medalhao/ios-abertura.png).
- [Vídeo do retorno real da conclusão da L1](2026-10-22-trilha-medalhao/ios-momento.mp4), 23,495 s.
- Quadros extraídos do mesmo vídeo a [5,7 s](2026-10-22-trilha-medalhao/ios-momento-1.png),
  [6,0 s](2026-10-22-trilha-medalhao/ios-momento-2.png) e
  [6,5 s](2026-10-22-trilha-medalhao/ios-momento-3.png).
- Movimento reduzido: [quadro 1](2026-10-22-trilha-medalhao/ios-reduzir-movimento-1.png)
  e [quadro 2](2026-10-22-trilha-medalhao/ios-reduzir-movimento-2.png), com
  aproximadamente um segundo entre capturas. Os PNGs 1206×2622 são idênticos
  pixel a pixel, incluindo a barra de estado (`ImageChops.difference`: sem bbox).
- [Maior texto do sistema](2026-10-22-trilha-medalhao/ios-texto-maximo.png),
  `accessibility-extra-extra-extra-large`, no simulador de dia 2. O tamanho
  foi restaurado para `large` depois da captura.

Para o vídeo, uma cópia temporária do primeiro roteiro iniciou uma instalação
limpa sem o argumento de movimento reduzido e foi interrompida no passo 2/5
(código 130). A conclusão seguiu por toques nativos nos alvos inspecionados:
respostas 1, 2 e 1 das questões 1–3, cada uma conferida, até o resumo 3/3.
Depois iniciou-se a gravação e tocou-se o `Continuar` do resumo. Nenhum dado
ou relógio foi injetado. Os três quadros mostram retorno/assentamento da
trilha e entrada da ilustração, **não três fases comprovadas da cabeça**:
a cabeça está fora da tela. O primeiro carregamento com movimento reduzido
e a identidade dos PNGs também não provam o retorno instantâneo de uma
conclusão nessa preferência, que deve ser repetido após corrigir a posição.

O texto máximo mostra a coluna e títulos ampliados; a recomendação e sua
cabeça não estão integralmente no viewport. Essa imagem não resolve a
sobreposição geométrica encontrada pela revisão forte. A árvore acessível
iOS do resumo expôs `3 de 3 estrelas`; na trilha concluída do roteiro de
vidas, a medalha expôs valor `2 estrelas`. Não houve sessão real de VoiceOver.

## Rolagem Android

O medidor de G6 foi inspecionado: mede persistência, restauração e primeiro
quadro, não FPS contínuo de rolagem. A coleta de rolagem usa HWUI
`dumpsys gfxinfo com.ascendcreative.radiant framestats`. Após aquecimento e
retorno ao topo, cada rodada zera as estatísticas e executa 26 swipes para
baixo na lista e 26 de volta, entre `(540,1700)` e `(540,600)`, 350 ms cada.
Há um dump a cada dois gestos e outro final, com o iOS e o Maestro parados.

A leitura de props da FlatList via CDP encontrou 60 itens: 57 nós e três
faixas. Um nó concluído, um de revisão devida e um disponível; os outros 54
bloqueados. A [captura do fim](2026-10-22-trilha-medalhao/android-trilha-fim.png)
mostra a última recompensa, `Fundamentos da radiação consolidados`.

| Rodada | Intervalo (s) | Quadros totais | FPS médio estimado (HWUI) | p99 (ms) | Pior capturado (ms) | Linhas capturadas / total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 21,095 | 1264 | 59,919 | 32,146 | 67,185 | 1263 / 1264 |
| 2 | 20,876 | 1251 | 59,925 | 30,383 | 37,799 | 1250 / 1251 |
| 3 | 20,892 | 1251 | 59,879 | 33,438 | 43,992 | 1250 / 1251 |

FPS estimado = `Total frames rendered / (Uptime_ms/1000 - Stats since_ns/1e9)`
do dump final depois do reset. Duração de quadro =
`(FrameCompleted - IntendedVsync)/1e6`, com `Flags=0` e
`0 < IntendedVsync < FrameCompleted < 9223372036854775807`; a chave
`IntendedVsync + FrameCompleted` remove repetições dos dumps. Foram removidas 27/25/26 chaves únicas transitórias com duração não positiva
ou sentinela. Após esses filtros, a coleta tem uma linha válida a menos que
o total em cada rodada; a causa dessa diferença não foi estabelecida.
Portanto **pior capturado** é o
máximo das linhas preservadas, não uma garantia sobre o quadro ausente. A
latência inclui o pipeline e não foi invertida para fabricar FPS.

- [Resumo, fórmulas e limites em JSON](2026-10-22-trilha-medalhao/android-frames.json).
- Dumps brutos: [1](2026-10-22-trilha-medalhao/android-gfxinfo-1.txt),
  [2](2026-10-22-trilha-medalhao/android-gfxinfo-2.txt),
  [3](2026-10-22-trilha-medalhao/android-gfxinfo-3.txt).

A média ficou próxima de 60 no cenário medido; houve picos até 67,185 ms.
**Isso não aprova uma trilha com 40 medalhas animadas desbloqueadas**:
só três nós estavam desbloqueados. Também não prova parada do playback fora
do viewport, FPS de JS, Release ou aparelho físico. A revisão estática
identificou ausência do controle de visibilidade. O console do Mac expôs
`onConsole=true` e `loginDone=true`, sem chave de bloqueio; esses indicadores
foram registrados em `ambiente.txt`, sem inferir uma prova mais forte de
interação humana ou de desbloqueio contínuo.

Após medir: app Android parado, reverse da porta removido, AVD encerrado,
app iOS parado, os dois simuladores desligados e Metro encerrado. Nenhum
cenário foi medido em paralelo ao gate do Loop.

## Aceite e próxima ação

**Plano 2 continua aberto.** A coleta encontrou defeitos, e não autoriza
merge nem liberação. A revisão forte preliminar acrescenta: cabeça inteira
invadindo o título na coluna, ilustrações fora do viewport ainda tocando,
data futura só no rótulo acessível, contraste da contagem sobre a faixa de
3,368:1 e uso de token do jaleco na faixa.

A próxima onda deve corrigir esses cinco itens e a posição nativa da cabeça,
incluindo a reavaliação da altura em cache, provar cada guarda falhando com o
defeito específico e repetir as evidências nativas. O roteiro de vidas ainda precisa chegar ao cenário esperado; a centralização do alvo deve ser
tratada no roteiro e no contrato correspondente, sem trocar as expectativas
do produto por expectativas mais fracas. Só depois cabe a revisão final do
Plano 2 e, em seguida, os planos 3 e 5. O plano 4 continua depois do 3.

Restrições mantidas: sem build nativa, EAS, merge ou loja. Push da branch foi
autorizado pelo dono; não equivale à aprovação do plano.

## Validação e proveniência do registro

Tarefa 6: commit `7615827`, dois runs documentados na evidência específica;
o segundo aprovou 15/15 validadores. Tarefa 7: este run é documental e não
corrige os achados de produto. A validação configurada aprovou **15/15**,
`VALIDATION_PASSED`; o app-quality e o app-test passaram no Node20 com dotenv
desabilitado. Após o gate, houve somente ajustes documentais da revisão e a
recoleta nativa (abertura e dia2), sem mudança de produto. O docs-contract do registro final passou em **18/18 testes** e no comando
de contrato. Isso não transforma o
roteiro de vidas FAIL em PASS.

Revisão independente forte (gpt-6-astra) aprovou o **registro documental**
como evidência de coleta com defeitos e aceites pendentes. Reproduziu métricas,
quadros do vídeo, hashes 19/19, extratos Maestro e envelope 15/15; os ajustes
de filtro, rastreabilidade e abertura foram conferidos. Não aprovou o Plano 2
nem o aceite funcional da tarefa 7. Parecer local:
`.superpowers/sdd/2026-10-21-trilha-medalhao/task-7-codex-review.md`.
A sessão de cérebro T7 foi confirmada `closed` pela CLI; nenhum candidato de
memória durável foi fabricado para esta coleta. O estado final do writer é
consultável por `loop run status --run run-1792686789421-4d7b1961`.
