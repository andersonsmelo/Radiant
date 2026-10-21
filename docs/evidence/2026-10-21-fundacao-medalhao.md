# Plano 1, tarefa 7 — DESIGN.md do Medalhão, medição no AVD e capturas

Medido em **2026-10-21, das 11:58 às 12:48 (America/Bahia)**, na branch
`claude/trilha-medalhao-design`, sobre `ecc5e9d` mais este diff. Fecha a
execução do
[plano 1](../superpowers/plans/2026-10-21-fundacao-visual-medalhao.md). O
desenho está na [spec](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md)
e na [ADR de 2026-10-21](../adr/ADR-2026-10-21-trilha-medalhao-aula-bancada-e-recomeco.md).

## Resultado

- O [DESIGN.md](../DESIGN.md) foi reescrito para o mundo Medalhão. O cabeçalho
  YAML bate com os tokens: **97 comparações iguais e 0 divergências**, por
  script que lê o código por AST [código].
- **As cinco ilustrações passam no critério do plano**, nas medições válidas.
  Com 15 medalhas na tela, 10 delas animando, de 0,26% a 1,56% dos quadros
  ficaram acima de 32 ms, contra o teto de 5% [visto, três rodadas]. A medição
  tem dois limites, explicados abaixo:
  - a história não rola, porque cabe na tela;
  - **a partir de 12:18 o emulador degradou** e nenhuma medição seguinte vale.
- As nove capturas e a saída do `gfxinfo` estão em
  [`2026-10-21-fundacao-medalhao/`](2026-10-21-fundacao-medalhao/).
- **O gate do dono (Passo 4) não aconteceu nesta tarefa.** Pela decisão R6 do
  controlador, ele vai para o fim do plano. O que precisa do olho dele está em
  "Para o dono olhar".

## 1. DESIGN.md contra os tokens

O script lê, por AST do TypeScript, `src/ui/theme.ts`,
`src/ui/semantic-colors.ts`, `src/ui/styles.ts` e o `AppButton.tsx`. Depois
compara cada chave do YAML com o token que ela nomeia. Ele cobre:
- as 46 cores, incluindo `medalColors`, `feedbackColors`, `hudIconTones`,
  `navBlue` `#4A9EFF`, `actionPrimary` `#2559E6` e `tabBarInactive` `#8a91a3`;
- os seis papéis de tipografia, entre eles o rótulo de botão do `AppButton`;
- o raio, o espaçamento e o `depth` (5 e 8 pt);
- a altura e o padding do botão;
- a cor de fundo dos componentes ligados a token (botões, lábios, barra de
  abas, pílula do HUD e cartão destacado).

Ele também acusa token sem chave no YAML, referência `{…}` quebrada e cor
hexadecimal do corpo do texto que não esteja no cabeçalho.

| Conferência | Resultado |
| --- | --- |
| YAML × código | **97 iguais, 0 divergências**, saída 0 |
| Mutação: aba inativa de volta a `#6d7487`, lábio 4 px, silhueta apagada | **4 divergências, saída 1**: `tab-inactive`, `depth.lip`, a chave ausente e a referência quebrada que ela deixa |
| As 27 cores da tabela "Valores da paleta" do plano | todas no YAML, menos `#6d7487`, o valor da prancheta que reprovou |
| Cores do corpo fora do YAML | `#6d7487`, citado como valor rejeitado, e `#000000`, a cor da sombra da barra (`shadowHard`) |

**Uma divergência conhecida, de propósito:** o YAML dá ao rótulo do
`button-ghost` o Azul de Navegação. O código pinta o rótulo com
`semanticColors.light.actionPrimary` (`#2155FF`), que mede **3,31:1** sobre o
grafite e reprova AA. Ver Achados, item 1.

## 2. Medição no AVD de entrada (Passo 2, ruling R7)

**Ferramenta:** `adb shell dumpsys gfxinfo com.ascendcreative.radiant`, não o
medidor do G6. O medidor da PR #59 mede o store, e não quadros. O protocolo
de cada rodada:
1. `dumpsys gfxinfo <pacote> reset`;
2. seis pares de `input swipe` para cima e para baixo, em ~13 s;
3. `dumpsys gfxinfo <pacote>`.

"Acima de 32 ms" é a soma das faixas do `HISTOGRAM` maiores que 32 ms.

**Ambiente:**
- AVD `radiant-entrada-api34`, com Android 14 / API 34 / arm64, 2 GB e
  2 núcleos;
- Android Emulator 37.2.12.0, num Mac Apple M5 com macOS 27.2;
- dev client **Debug**, recompilado nesta tarefa com o Skia 2.2.12
  (`expo prebuild` mais `gradlew :app:assembleDebug`, `BUILD SUCCESSFUL`);
- JS pelo Metro.

Não é build Release, e o Mac não vira aparelho de entrada.

| Tela | Rodadas válidas | Mediana | p90 / p99 | Acima de 32 ms |
| --- | --- | --- | --- | --- |
| Ilustrações (`Todos Nos Tres Estados`: 5 temas × 3 estados, 10 animando) | 3, das 12:06 às 12:07 | 14–15 ms | 20–22 / 31–46 ms | **1,56%, 0,26% e 0,53%** |
| Estude, no app (sem ilustração) | 2, às 12:17 e 12:18 | 17–21 ms | 23 / 36–40 ms | **1,92% e 1,54%** |

Os 15 desenhos do Skia aparecem na hierarquia como 15 `SkiaTextureView`
[visto, `dumpsys activity top`]. O desenho de cada quadro sai numa textura
composta pelo `RenderThread`, então o `gfxinfo` vê os quadros da animação. É
por isso que a história gera ~1.150 quadros em ~17 s, mesmo parada entre os
toques. O tempo do próprio Skia por textura não aparece no histograma
[inferido].

**Limites da medição:**
- **A história não rola.** As 15 medalhas cabem na tela, e os toques não movem
  o conteúdo [visto, captura depois do toque]. O que se mediu foi a animação
  de 10 ilustrações ao mesmo tempo, o dobro das cinco do plano, sob toque.
  Rolar com ilustrações só se mede na trilha do plano 2. Lá vale de novo o
  critério e a regra "a ilustração fora do centro fica parada".
- **A Estude ainda não tem ilustração:** o `ThemeIllustration` não está
  montado em nenhuma tela [código]. A Home não existe como tela própria desde
  2026-08-21, e a aba Estude é a trilha.
- **Das 12:18:31 em diante, todas as medições pioraram juntas**, inclusive a
  mesma história, que passou de 14 ms para 57 ms de mediana:
  - reiniciar o app não resolveu;
  - reiniciar o emulador também não;
  - às 12:45, o host reportou `CGSSessionScreenIsLocked=Yes`, com a tela do
    Mac bloqueada e o protetor de tela ativo;
  - a 57 ms, a mediana fica presa perto de 17 quadros por segundo, o que
    combina com a janela do emulador sendo desenhada em ritmo reduzido
    [inferido; a hora exata do bloqueio não foi medida].
- **O emulador sem janela (`-no-window`) não serve de saída.** Ele desenha por
  software, com 841% de CPU no host, e deu 42–48 ms.

As rodadas inválidas ficam na linha do tempo do
[`android-gfxinfo.txt`](2026-10-21-fundacao-medalhao/android-gfxinfo.txt),
marcadas, e não entram na conclusão. **Remedir com a tela desbloqueada fica
pendente**, de preferência já na trilha do plano 2.

O script que lê o histograma:

```python
import re, sys
t = open(sys.argv[1]).read()
h = re.search(r'^HISTOGRAM: (.*)$', t, re.M).group(1)
pairs = [(int(a), int(b)) for a, b in re.findall(r'(\d+)ms=(\d+)', h)]
tot = sum(c for _, c in pairs)
gt = sum(c for ms, c in pairs if ms > 32)
print(f'{tot} quadros; acima de 32 ms: {gt} ({100*gt/tot:.2f}%)')
```

## 3. Capturas (Passo 3)

Todas em JPEG de qualidade 70, na metade da resolução. As leituras de
contraste da seção 4 foram feitas nos PNG originais.

| Arquivo | O que mostra |
| --- | --- |
| [`ios-estude.jpg`](2026-10-21-fundacao-medalhao/ios-estude.jpg) | Estude no topo, com o HUD, o lembrete, a unidade "2 de 8" e a barra de abas, texto padrão |
| [`ios-estude-texto-maior.jpg`](2026-10-21-fundacao-medalhao/ios-estude-texto-maior.jpg) | a mesma tela em `accessibility-extra-extra-extra-large`, depois de relançar o app |
| [`ios-perfil.jpg`](2026-10-21-fundacao-medalhao/ios-perfil.jpg) | Perfil, com a aba ativa nos tons da unidade, texto padrão |
| [`ios-perfil-texto-maior.jpg`](2026-10-21-fundacao-medalhao/ios-perfil-texto-maior.jpg) | Perfil no maior texto, com a quebra do cabeçalho (Achados, item 3) |
| [`ios-ilustracoes.jpg`](2026-10-21-fundacao-medalhao/ios-ilustracoes.jpg) | as cinco ilustrações nos três estados, com movimento |
| [`ios-ilustracoes-reduzir-movimento.jpg`](2026-10-21-fundacao-medalhao/ios-ilustracoes-reduzir-movimento.jpg) | o mesmo com `-radiantReduceMotion 1` |
| [`android-estude.jpg`](2026-10-21-fundacao-medalhao/android-estude.jpg) | Estude no AVD, com o HUD, a trilha e a barra de abas |
| [`android-ilustracoes.jpg`](2026-10-21-fundacao-medalhao/android-ilustracoes.jpg) | as cinco ilustrações no Skia do Android |

- **Reduzir movimento:** três capturas a 0,7 s uma da outra deram **diferença
  de pixels nula**. Sem o argumento, duas capturas diferem na área das
  medalhas. Cada medalha para no quadro de pose, com o feixe do tubo aceso, e
  não no quadro 0 [visto].
- **Texto maior no botão:** com o maior texto, "Ativar lembretes" quebra em
  duas linhas, e o lábio de 5 pt continua inteiro por baixo [visto, captura
  de rascunho].
- **As ilustrações só existem no Storybook nesta fase.** Ele não empacota na
  worktree, porque `ComparisonStepRenderer.stories.tsx` pede um PNG removido
  em `b06c7eb`. O Metro rodou de um espelho no scratchpad, como nas tarefas 5
  e 6.
- **Não produzidas, por falta de nome declarado:** o Android com texto maior e
  o Perfil no Android.

## 4. Contraste lido nas capturas

A cor de fundo é a mais comum na caixa, e a do texto é o pixel de maior
contraste com ela.

| Composição | Fundo | Texto | Medido | Onde |
| --- | --- | --- | --- | --- |
| Texto sobre azul: CTA `primary` "Ativar lembretes" | `#2155ff` | `#ffffff` | **5,51:1** | iOS, Estude |
| Texto sobre azul: `AppButton` `galaxy` | `#2559e6` | `#ffffff` | **5,75:1** | iOS, Storybook |
| Superfície de retorno: botão `success` | `#2bd67b` | `#0b2a18` | **8,10:1** | iOS, Storybook |
| Superfície de retorno: botão `error` | `#ff8298` | `#3a0d17` | **7,12:1** | iOS, Storybook |
| Botão `secondary` | `#1b1e27` | `#eef0f6` | 14,61:1 | iOS, Storybook |
| Aba ativa / inativa | `#171920` | `#eef0f6` / `#8a91a3` | **15,41 / 5,57:1** | iOS e Android |
| HUD: XP / sequência | `#232733` | `#f5a623` / `#ff6b2c` | 7,35 / 5,24:1 | iOS (XP também no Android) |
| Rótulo "2 DE 8" | `#13151c` | `#a3aabb` | 7,84:1 | iOS, Estude |
| Título branco no cartão laranja do Perfil | `#ff6d2e` | `#ffffff` | **2,81:1, reprova** | iOS, Perfil |
| Subtítulo no cartão laranja | `#ff6e2f` | `#ffede3` | **2,46:1, reprova** | iOS, Perfil |

- **Texto sobre ouro não existe em tela nesta fase** [código]: o ouro só pinta
  a face da medalha e o raio do HUD. Se um dia houver, o texto grafite daria
  11,27:1 [calculado], e o DESIGN.md proíbe o branco.
- **Título na superfície de retorno** (`#2BD67B` sobre `#14281f`, 8,14:1;
  `#FF8298` sobre `#2c1820`, 7,07:1): nenhuma tela monta essas superfícies
  ainda [código], então o valor é só calculado.

## 5. Achados

1. **O rótulo do `ghost` reprova AA sobre o grafite** [código, calculado]:
   `#2155FF` sobre `#13151c` mede 3,31:1. É anterior ao plano 1: em `02b6a5d`
   já era `light.actionPrimary`, a 3,55:1 sobre o vazio antigo. Aparece em
   telas escuras, como "Rever apresentação" nos Ajustes. A correção é de uma
   linha, `labelGhost` → `galaxy.borderFocus`, e não estava no escopo.
2. **O cartão laranja do Perfil reprova AA** [visto]: 2,81:1 no título e 2,46:1
   no subtítulo. A cor é um gradiente local em `MissionsScreen.tsx`
   (`#FF8A4C` → `#FF6B2C`), com brilho, contra a regra de não declarar paleta em
   tela. O Perfil é da fase 2 (plano 5).
3. **O Perfil quebra no maior texto** [visto, app relançado]:
   - nome e status truncados ("Est…");
   - inicial do avatar cortada;
   - "SEQU / ÊNCI / A" e "XP TOTA / L" em pedaços;
   - "44" partido em duas linhas e "XP" fora do cartão.

   O `ProfileIdentityHeader` não está no diff do plano 1 [código]; a origem é
   anterior [inferido].
4. **O `PushOptInCard` tem paleta local translúcida**: `rgba(10,132,255,0.05)`
   resulta em `#131b28`, fora da escada de grafite [visto, código]. O texto
   passa, com "Agora não" a 5,30:1.
5. **Trocar o tamanho do texto com o app aberto deixa o layout cortado até
   relançar** [visto no simulador]: títulos e cartões ficam truncados ou
   vazios. Relançado, o app quebra as linhas certo. Não se verificou se é só
   do simulador.
6. **O Storybook não carrega a Sora:** os rótulos das histórias saem na fonte
   do sistema [visto]. O app carrega a Sora; só a leitura visual das histórias
   fica afetada.

## Para o dono olhar

Pela decisão R6, a resposta do dono entra depois, e um "refazer" volta à
tarefa 5 ou 6.

- **Feixe do tubo:** o `#9BEBFF` sobre o ouro fica esverdeado
  (`ios-ilustracoes.jpg`, segunda linha).
- **Silhueta da tomografia:** no bloqueado ela vira um círculo genérico, e o
  gantry não se reconhece.
- **Proteção e ressonância:** o brilho da proteção e os anéis da ressonância
  foram criados a partir do brief, porque a prancheta não os desenha.
- **Lábio do `secondary`:** `#171920` contra a face `#1b1e27` e o fundo
  `#13151c` mede 1,05 e 1,04:1, e fica quase invisível.
- **+5 pt em todo botão com lábio:** conferir as telas apertadas. No maior
  texto, o rótulo quebrado fica alinhado à esquerda (captura de rascunho).
- **Capelo da aba ativa:** face `#2F6BFF` e miolo `#275CEB` a 1,22:1, próximos
  demais (`ios-estude.jpg`, barra de abas).
- **Mesa da ressonância:** sai 1,6 pt de cada lado do quadro. O conserto (R19)
  está na rodada de correção final.
- Os achados 1 a 3 acima, que são decisão de prioridade.

## Gate

`EXPO_NO_DOTENV=1 npm run quality` em `radiant-app`, no Node v20.20.2, saída
0, com o emulador e o Metro já desligados:
- lint com 0 erros e 33 avisos anteriores;
- typecheck limpo;
- os 16 blocos `node --test` com `fail 0`, inclusive o
  `identity-palette-contract`, de cabeçalho novo;
- jest `--runInBand` com **182 suítes e 1920 testes, de 182 e 1920**;
- `visual:qa:strict` com 0 regressões, 57 itens na baseline e 2 exceções.

Este diff não toca código do app: só documentação e um comentário.

## Reprodução

```bash
# Node 20; Android
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$HOME/.jdks/jdk-17.0.19+10/Contents/Home"
cd radiant-app && LANG=en_US.UTF-8 EXPO_NO_TYPESCRIPT_SETUP=1 npx expo prebuild --platform android --no-install
cd android && ./gradlew :app:assembleDebug -PreactNativeArchitectures=arm64-v8a
"$ANDROID_HOME/emulator/emulator" -avd radiant-entrada-api34 -no-snapshot -crash-report-mode never
adb install -r app/build/outputs/apk/debug/app-debug.apk
# Metro com EXPO_NO_TYPESCRIPT_SETUP=1 (STORYBOOK_ENABLED=true para as ilustrações)
adb reverse tcp:8081 tcp:8081
adb shell am start -a android.intent.action.VIEW -d 'exp+radiant-app://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081' com.ascendcreative.radiant
# Com a TELA DO MAC DESBLOQUEADA e a janela do emulador à vista:
adb shell dumpsys gfxinfo com.ascendcreative.radiant reset
# ...rolar ~13 s...
adb shell dumpsys gfxinfo com.ascendcreative.radiant
# iOS: simulador E262D4C1…, texto maior e reduzir movimento
xcrun simctl ui <udid> content_size accessibility-extra-extra-extra-large   # relance o app depois
xcrun simctl launch <udid> com.ascendcreative.radiant -radiantReduceMotion 1
xcrun simctl ui <udid> content_size large   # restaurar
```
