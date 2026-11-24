# Orçamento de peso e prova em Android das figuras importadas

Tarefa 6 do plano `docs/superpowers/plans/2026-11-19-troca-das-figuras.md`. Tudo medido em 2026-11-19, num Mac com Apple Silicon, em Node 20.20.2.

**Estado em 2026-11-19 (revisão final).** Este documento mede o piloto com as duas figuras. A cena do leito saiu do app depois das medições, porque não tem dois dos cinco alvos que a M25.05 cobra (pessoa sem avental junto à cabeceira e leito vizinho); a aula voltou à figura antiga e a cena volta refeita na fase 2. As medições abaixo continuam válidas como medição, e a cena guardada do piloto está fora do repositório, em `.superpowers/sdd/2026-11-19-amostra-figuras/equipamento/`. As capturas do leito (seção 5) mostram a arte do piloto com os alvos antigos sobre objetos que ela não desenha: servem como prova de peso e de tempo, não de alvos corretos. A prova dos alvos da M25.05 sobre a figura restaurada é `alvos-leito-restaurado.png`.

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
| Figuras, cru (total, não o acréscimo: o acréscimo ao bundle é 19,85 − 13,38 = 6,47 MiB) | 24 × 77.013 + 22 × 231.713 + 26 × 3.536 | 7.037.934 | 6,71 |
| Bundle inteiro, cru | 14.028.989 (antes) − 72 × 3.536 (as versões em código que saem) + 7.037.934 | 20.812.331 | 19,85 |
| Figuras, gzip | 24 × 32.236 + 22 × 45.123 + 26 × 1.291 | 1.799.936 | 1,72 |
| Bundle inteiro, gzip | 4.777.463 − 72 × 1.291 + 1.799.936 | 6.484.447 | 6,18 |

O gzip por arquivo é uma aproximação: o bundle comprimido de uma vez divide o dicionário entre as figuras. Na medida real, as duas figuras somaram +76 KiB, contra 77 KiB da conta por arquivo.

**Incerteza.** São só duas amostras, e o peso depende quase inteiramente delas:

- se as 46 importadas pesassem como o crânio, as figuras somariam 3,5 MiB (total das 72 figuras, não acréscimo);
- se pesassem como o leito, somariam 10,3 MiB (total);
- no teto de 240 KiB por figura, que o teste já impõe, somariam 10,9 MiB (46 × 245.760 + 26 × 3.536 = 11.396.896 bytes; total).

O fator que mais pesa é a anatomia. O tórax do acervo tem 189 KiB no original, e 24 figuras desse porte, com as 22 cenas como o leito, já passam de 8 MiB só em figuras.

## 3. Teto no teste

`radiant-app/src/ui/diagrams/diagramRegistry.test.ts` ganhou o teste "a soma do SVG de todas as figuras importadas cabe no orçamento do plano". O teto é `(24 × 75.211 + 22 × 225.380) × 1,2 = 8.116.109` bytes de SVG, com 75.211 e 225.380 medidos como a soma de `layer.svg.length` de cada figura. A soma medida com as duas figuras era 300.591; com a cena do leito fora do app (2026-11-19), a soma é a do crânio, 75.211, e o teto é um orçamento, não uma contagem. A execução vermelha, com o teto baixado a 300.000, está em `vermelho-teto.txt` (`Expected: <= 300000`, `Received: 300591`). Depois de restaurado, o arquivo passou com 361 de 361.

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

- `capturas/android-leito-passo6.png`: M25.05, passo 6 de 8. A arte nova do piloto aparece inteira, com os cinco alvos antigos por cima, sobre objetos que ela não desenha (dois dos cinco alvos não existem na cena); por isso a cena saiu do app;
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

## iOS, segunda tentativa (2026-11-19, 18h35)

Com cerca de 11 GiB livres no disco, o roteiro gerado `radiant-app/.maestro/figuras/m25-aula-01.yaml` rodou até o fim no simulador de iPhone e gravou as duas capturas do crânio com os alvos remarcados: `capturas/ios-cranio-passo4.jpg` (rotular) e `capturas/ios-cranio-passo6.jpg` (tocar em regiões). Visto nas imagens: a arte nova aparece, e os pontos e as regiões caem sobre os ossos. Defeito visto no passo 6: nas regiões baixas (occipital e mandíbula) o número da região aparece cortado, porque a etiqueta não cabe na altura da região. O roteiro da M25-05 (leito) não chegou a rodar: a sessão foi interrompida para o reinício do Mac. Não visto no iOS depois da remarcação: o leito.

## 7. Remedição com as figuras reais da fase 1 (2026-11-20)

Medido em 2026-11-20 no commit `3f7ae5d8`, pela soma de `layer.svg.length` que o teste do registro usa (`radiant-app/src/ui/diagrams/diagramRegistry.test.ts`): **11 figuras de acervo no app somam 1.553.030 bytes de SVG (1,48 MiB)**, média de 141.185 bytes por figura. A projeção da seção 2 usava o crânio como referência de acervo, com 75.211 bytes: a figura real de anatomia pesa 1,9 vez isso. As mais pesadas são o esqueleto, os marcos de superfície e o trato digestivo, todas entre 205 e 240 KiB, encostadas no teto por figura.

O que muda na projeção para as 72 figuras:

| | Conta | Bytes | MiB |
| --- | --- | ---: | ---: |
| Anatomia já no app | medido | 1.553.030 | 1,48 |
| As outras 13 de anatomia, se pesarem como a média medida | 13 × 141.185 | 1.835.405 | 1,75 |
| Cenas e equipamento (22), pela referência do leito | 22 × 225.380 | 4.958.360 | 4,73 |
| Soma de SVG importado | | 8.346.795 | 7,96 |

A soma projetada (8.346.795) passa do teto do teste (8.116.109) em 230.686 bytes, cerca de 3%. O teto não foi alterado. Duas ressalvas: 13 das 24 figuras de anatomia ficaram fora do método de acervo e ainda não têm método nem peso, e nenhuma cena da fase 2 foi medida além do leito do piloto. O bundle não foi exportado de novo nesta remedição; pela razão de 1,008 medida na seção 1, as 11 figuras acrescentam cerca de 1,5 MiB crus ao bundle em relação às versões em código.


## 9. Medição na árvore reconciliada (2026-11-24)

**Diafragma no RadiantPlay, M20.01 passo 2 de 8.** Três gravações Maestro no mesmo emulador, com o Metro no Node 20.20.2 e a árvore `52e9c468`. Em todas, o novo cabeçalho, o título e a figura aparecem no mesmo quadro, com diferença observável de **0 ms** entre o passo e a figura. O vídeo é de quadros variáveis. Os intervalos entre o último quadro do passo 1 e o primeiro do passo 2 foram **450, 391 e 340 ms**, respectivamente. Esse intervalo inclui a transição inteira capturada e limita a resolução da medida, sem fornecer o tempo exato do toque ao primeiro desenho. Tempo interno do renderer e desempenho em aparelho físico continuam sem medida.

**Orçamento das figuras.** Na mesma árvore, as 48 figuras importadas somam **4.142.438** unidades em `layer.svg.length`, abaixo de **8.116.109**, pelo mesmo cálculo do teste do registro. Margem de **3.973.671** unidades. O bundle completo e os assets raster são medidas distintas.


**Bundle Hermes.** Exportações locais em Node 20.20.2, a partir de `52e9c468`. Os arquivos do app eram idênticos aos do commit. Para cada plataforma, foi executado `EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 CI=1 npx expo export --platform <ios|android> --output-dir <pasta-temporária>`. O tamanho comprimido usa `gzip -9 -c | wc -c` no único `.hbc` de cada exportação. A comparação usa a árvore de 2026-11-19, `f8ed69d1`, da seção 1. O delta inclui todas as mudanças entre as duas árvores.

| Plataforma | Hermes cru | gzip -9 | Delta cru | Delta gzip |
| --- | ---: | ---: | ---: | ---: |
| iOS | 18.174.955 bytes | 5.874.899 bytes | +3.844.796 bytes | +1.021.130 bytes |
| Android | 18.170.925 bytes | 5.872.315 bytes | +3.844.510 bytes | +1.021.438 bytes |

O bundle inteiro continua acima de 8 MiB, como já ocorria na árvore anterior ao piloto. O limite automatizado das figuras importadas permanece atendido. A interpretação do limite do plano original está na seção 6.

## 10. Reprovas e confirmações no Maestro (2026-11-24)

No **RadiantPlay**, o seletor antigo do launcher reprovou porque o Metro aparece como `10.0.2.2:8081`. O endereço alternativo conectou. Em teste separado, a folha do menu foi aberta com a tecla Menu do emulador. O subfluxo atualizado fechou a folha com Voltar e retornou à aula. Na M25.05, o roteiro original rolou para baixo atrás do quarto grupo, que estava acima da ficha. A rolagem para cima, com os controles centralizados, confirmou a classificação e chegou ao passo 5.

No **Radiant F7**, a mesma classificação confirmou a resposta correta. Na ordenação seguinte, o alvo “Selecionar esta ordem” foi encontrado perto do rodapé e o toque caiu em sua área. A captura da falha já mostrava o passo 6 quando o roteiro ainda procurava o segundo “Continuar”. Centralizar o botão levou ao passo 6 com os dois toques esperados. A M23.02 chegou ao retorno correto com as três ações previstas de “Continuar”. A M24.04 avançou após rotular ílio, sacro e articulação sacroilíaca, no F7 e no RadiantPlay. As duas regiões corretas da M25.05 foram selecionadas na própria figura nos dois simuladores e confirmadas antes do passo 7.

As provas acima usam o cliente de desenvolvimento já instalado, com entrada por link de lição. Foram regenerados os 31 YAMLs afetados. A bateria de todos os lotes foi fechada depois das decisões visuais do plano e está na seção 11.

[Resultados do Maestro](capturas/radiantplay-maestro-2026-11-24.txt) · [Colar](capturas/android-m23-aula02-artefato-colar.jpg) · [Rotulagem](capturas/android-m24-aula04-rotulagem.jpg) · [Cena do leito, dois riscos selecionados](capturas/android-m25-aula05-cena-leito.jpg).

## 11. Bateria final de figuras e bundle (2026-11-24)

O RadiantPlay confirmou **70 figuras em 108 usos, em 77 aulas**. Nesta rodada ficaram 102 usos capturados e conferidos em 94 etapas. Outros seis já tinham provas abertas e conferidas. O inventário vincula cada uso à aula, etapa, formato, árvore do app e captura. As figuras vistas em árvores anteriores conservaram os mesmos recursos e alvos. Os quatro usos dos esquemas mantidos de detector e monitor também foram conferidos em capturas separadas. [Inventário Android](capturas/radiantplay-inventario-2026-11-24.csv) · [Roteiros e retestes](capturas/radiantplay-maestro-fechamento-2026-11-24.txt).

A M23.06 foi concluída no RadiantPlay e no Radiant F7 com o toque no colar e o botão classificado como preparo do paciente. Nas aulas M29.05 e M29.06, os dois simuladores mostraram o retorno correto de B, avançaram ao passo seguinte e mostraram o retorno da alternativa incorreta testada. [Capturas do colar e da RM](imagens-reais.md#colar-na-ficha-de-rejeição-da-m2306-2026-11-24).

O bundle Hermes foi reexportado do conteúdo de `2a45f960` no Node 20.20.2 depois de encerrar os simuladores. Foi usado `EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 CI=1 npx expo export --platform <plataforma> --output-dir <pasta-temporária>`. A medição usa o único `.hbc` por plataforma e `gzip -9 -c` para o valor comprimido. Os deltas são contra `52e9c468`, seção 9.

| Plataforma | Hermes cru | gzip -9 | Delta cru | Delta gzip |
| --- | ---: | ---: | ---: | ---: |
| iOS | 18.179.854 bytes | 5.879.074 bytes | +4.899 bytes | +4.175 bytes |
| Android | 18.176.050 bytes | 5.874.186 bytes | +5.125 bytes | +1.871 bytes |

Os cinco JPEGs das comparações somam 90.838 bytes como assets. A soma da régua de SVG continua em 4.142.438 unidades contra o teto de 8.116.109, pois nenhum spec SVG mudou desde a medição da seção 9. A medida do diafragma continua a da seção 9. A validação nativa desta rodada foi em simuladores.
