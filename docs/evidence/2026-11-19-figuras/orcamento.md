# Orçamento de peso e prova em Android das figuras importadas

Tarefa 6 do plano `docs/superpowers/plans/2026-11-19-troca-das-figuras.md`. Tudo medido em 2026-11-19, num Mac com Apple Silicon, em Node 20.20.2.

## 1. Bundle JS (Hermes), medido

Comando, nas duas árvores: `EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 CI=1 npx expo export --platform <ios|android> --output-dir $TMPDIR/...`, rodado em `radiant-app/`. "Antes" é uma worktree destacada em `6e68b3e2`, anterior ao piloto, com `node_modules` ligado por link simbólico ao da worktree de trabalho. "Depois" é `f8ed69d1`, a HEAD de `claude/figuras-base`, que já traz `cranio-de-perfil-ossos` e `raio-x-movel-no-leito` importadas. O arquivo medido é o único `.hbc` em `_expo/static/js/<plataforma>/`. O tamanho comprimido vem de `gzip -9 -c | wc -c`.

| Plataforma | Commit | `.hbc` cru (bytes) | cru (MiB) | gzip -9 (bytes) | gzip (MiB) |
| --- | --- | ---: | ---: | ---: | ---: |
| iOS | `6e68b3e2` (antes) | 14.028.989 | 13,38 | 4.777.463 | 4,56 |
| iOS | `f8ed69d1` (depois) | 14.330.159 | 13,67 | 4.853.769 | 4,63 |
| Android | `6e68b3e2` (antes) | 14.025.064 | 13,38 | 4.775.171 | 4,55 |
| Android | `f8ed69d1` (depois) | 14.326.415 | 13,66 | 4.850.877 | 4,63 |

Diferença: +301.170 bytes crus no iOS e +301.351 no Android, ou seja, +294 KiB. Comprimida, a diferença é de +76.306 e +75.706 bytes, cerca de +74 KiB. Os fontes das duas figuras cresceram 298.737 bytes (crânio de 4.200 para 77.013, leito de 5.789 para 231.713). A razão entre o bundle e o fonte fica em 1,008: o Hermes guarda a string do SVG quase byte a byte. O resto da diferença inclui as outras mudanças entre os dois commits, que somam 117 linhas fora de `specs/` e são pequenas.

## 2. Projeção para 72 figuras

Mistura do plano: 24 de acervo, 22 de cena `anatomy` e 26 em código. Referências por figura, em bytes do fonte `.ts`, que é o que vai para o bundle (razão 1,008):

- acervo: crânio, 77.013 (gzip 32.236);
- cena: leito, 231.713 (gzip 45.123);
- código: média dos 84 specs atuais desenhados em código, 296.989 / 84 = 3.536 (gzip 108.483 / 84 = 1.291), medida em `radiant-app/src/ui/diagrams/specs/` sem as duas importadas.

| | Conta | Bytes | MiB |
| --- | --- | ---: | ---: |
| Figuras, cru | 24 × 77.013 + 22 × 231.713 + 26 × 3.536 | 7.037.934 | 6,71 |
| Bundle inteiro, cru | 14.028.989 (antes) − 72 × 3.536 (as versões em código que saem) + 7.037.934 | 20.812.331 | 19,85 |
| Figuras, gzip | 24 × 32.236 + 22 × 45.123 + 26 × 1.291 | 1.799.936 | 1,72 |
| Bundle inteiro, gzip | 4.777.463 − 72 × 1.291 + 1.799.936 | 6.484.447 | 6,18 |

O gzip por arquivo é uma aproximação: o bundle comprimido de uma vez divide o dicionário entre as figuras. Na medida real, as duas figuras somaram +76 KiB, contra 77 KiB da conta por arquivo.

**Incerteza.** São só duas amostras, e o peso depende quase inteiramente delas:

- se as 46 importadas pesassem como o crânio, as figuras somariam 3,5 MiB;
- se pesassem como o leito, somariam 10,3 MiB;
- no teto de 240 KiB por figura, que o teste já impõe, somariam cerca de 11,1 MiB.

O fator que mais pesa é a anatomia. O tórax do acervo tem 189 KiB no original, e 24 figuras desse porte, com as 22 cenas como o leito, já passam de 8 MiB só em figuras.

## 3. Teto no teste

`radiant-app/src/ui/diagrams/diagramRegistry.test.ts` ganhou o teste "a soma do SVG de todas as figuras importadas cabe no orçamento do plano". O teto é `(24 × 75.211 + 22 × 225.380) × 1,2 = 8.116.109` bytes de SVG, com 75.211 e 225.380 medidos como a soma de `layer.svg.length` de cada figura. A soma de hoje é 300.591. A execução vermelha, com o teto baixado a 300.000, está em `vermelho-teto.txt` (`Expected: <= 300000`, `Received: 300591`). Depois de restaurado, o arquivo passou com 361 de 361.

## 4. Android: tempo até o leito aparecer

O aparelho foi o emulador `RadiantPlay` (`sdk_gphone64_arm64`, Android 15), com o dev client já instalado. O Metro rodou na worktree com `EXPO_NO_TYPESCRIPT_SETUP=1`, e a conexão foi por `adb reverse tcp:8081 tcp:8081`. A carga de 1 minuto estava em 2,2 nas três medições.

**Método.** Um roteiro temporário, cópia do gerado, leva a aula M25.05 até o passo 5 respondido, com o botão "Continuar" na tela. Então:

- `adb shell screenrecord --time-limit 6` grava a tela;
- `adb shell input tap` toca o centro do "Continuar", cujos limites vêm de `uiautomator dump --compressed`;
- `ffprobe` lista o tempo de cada quadro.

O `screenrecord` só grava quadro quando a tela muda, então cada mudança vira um quadro com o tempo dela. A precisão é de cerca de um quadro (16 a 30 ms). O toque real acontece no máximo um quadro antes do quadro com o botão pressionado.

| Execução | Botão pressionado | Passo 6, só o cabeçalho | Passo 6 com o leito | Cabeçalho → leito | Toque → leito |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 1,513 s | 1,749 s | 1,774 s | 25 ms | 261 ms |
| 2 | 1,512 s | 1,774 s | 1,800 s | 27 ms | 288 ms |
| 3 | 1,505 s | 1,771 s | 1,800 s | 28 ms | 294 ms |

O quadro do cabeçalho mostra "Passo 6 de 8" com o corpo vazio: some o enunciado inteiro, não só a figura. No quadro seguinte, cerca de 27 ms depois, aparecem juntos o enunciado, o leito e os alvos. Não houve quadro com o texto e sem a figura. Os quadros da execução 1 estão em `capturas/android-leito-tempo-execucao1.png`.

O leito não anima em nenhuma aula: a figura tocável fica parada no quadro de pôster, regra do app. Por isso não há tempo de laço nem quadros por segundo a medir no Android.

## 5. Capturas

Todas foram feitas no Android, pelos roteiros gerados, com as cópias temporárias da seção 7, e reduzidas com `sips -Z 720`:

- `capturas/android-leito-passo6.png`: M25.05, passo 6 de 8. A arte aparece inteira, com os cinco alvos por cima;
- `capturas/android-cranio-passo4.png`: M25.01, passo 4 de 8, com os seis pontos numerados sobre os ossos;
- `capturas/android-cranio-passo6.png`: M25.01, passo 6 de 8, com os alvos do toque;
- `capturas/android-leito-passo6-uiautomator.xml` e `capturas/android-cranio-passo6-uiautomator.xml`: as árvores de `uiautomator dump --compressed`. Na do leito, a figura aparece como um nó com o `content-desc` da instrução, e os alvos também aparecem, por exemplo "Tubo alinhado com o detector".

No iOS não há captura. A seção 7 explica por quê.

## 6. Decisão pela regra

O plano escreveu a regra antes da medição: "se a projeção passar de 8 MiB de bundle não comprimido, ou se o Android levar mais de 1 s para mostrar o leito, as camadas paradas das figuras do tipo B passam a ser imagem".

- **Android**: o leito aparece de 261 a 294 ms depois do toque, e 25 a 28 ms depois de o passo entrar. Fica abaixo de 1 s, então esta metade não dispara.
- **Bundle**: a regra admite duas leituras.
  - Se "a projeção" é o peso das figuras, a projeção dá 6,71 MiB, abaixo de 8 MiB, e não dispara.
  - Se é o bundle inteiro, a projeção dá 19,85 MiB e dispara. Só que o bundle já tinha 13,38 MiB **antes** de qualquer figura importada. Nessa leitura, a regra dispara sem nenhuma figura, e trocar as cenas por imagem também não a satisfaz: tiraria no máximo cerca de 5 MiB e deixaria o bundle perto de 15 MiB.

**Conclusão.** Pela leitura que a regra consegue cumprir, que é o peso das figuras, a regra **não exige** a variante com imagem. A margem até 8 MiB é de 1,3 MiB, e ela some se a anatomia do acervo vier maior que o crânio. A escolha entre as duas leituras fica com o dono. O teto do teste, de 7,74 MiB de SVG, segura a primeira leitura.

## 7. O que NÃO foi medido

- **iOS com os roteiros gerados.** Foram três tentativas:
  - simulador "Radiant F8": o driver do Maestro não subiu em 120 s nem em 240 s, e o SpringBoard do simulador caiu 13 vezes entre 17:36 e 17:41, com `EXC_BREAKPOINT`;
  - simulador "Radiant F7": o roteiro da M25.01 chegou até `assertVisible "Passo 4 de 8"`, mas a captura falhou porque o disco do Mac chegou a 157 MiB livres (`No space left on device`).

  Com os simuladores desligados, o disco voltou a 6 a 10 GiB livres. Não houve quarta tentativa.
- **Defeitos dos roteiros no Android**, contornados só em cópias temporárias, sem conserto no repositório:
  1. `.maestro/subflows/dismiss-dev-client.yaml`, que é compartilhado e não é gerado, toca `http://localhost:8081`. O launcher do Android lista `http://10.0.2.2:8081`, e o roteiro reprova. Contorno: casar `http://(localhost|10\.0\.2\.2):8081`;
  2. o mesmo subflow toca `Close` no menu do dev client, e no Android o menu é uma folha sem esse botão. Contorno: `back`;
  3. nos passos `categorize`, o gerador (`lessonCommands` de `scripts/qa/generate-rtg-maestro.mjs`) emite `scrollUntilVisible`, que só rola para baixo. Na tela do emulador, o grupo "Se afasta da área" já tinha passado para cima, e a M25.05 reprovou no passo 4. Contorno: antes de cada grupo, uma rolagem opcional para cima, com `centerElement`. O conserto é no gerador e vale para os roteiros da trilha também, não é de uma linha.
- Aparelho Android físico ou mediano. O emulador arm64 num Mac com Apple Silicon é mais rápido que um aparelho de entrada.
- Memória e CPU por camada, e o tamanho do `.ipa` e do `.aab`.
- Vídeo do laço no Android, porque nenhuma aula anima o leito.
- O toque nos alvos sobre a arte nova e o movimento reduzido no Android. O argumento `radiantReduceMotion` só vale no iOS.
- O gate `npm run quality`, que fica com o controlador.
