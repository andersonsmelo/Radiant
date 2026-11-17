# Assets gráficos da ficha do Google Play

Fecha **L2.7 (E1)**. Os três assets obrigatórios existem, estão travados pelo
contrato `radiant-app/scripts/icon-assets-contract.test.mjs` e o contrato roda no
`npm run quality` desde 2026-07-29.

## O que existe

| Asset | Arquivo | Especificação | Estado |
| --- | --- | --- | --- |
| Ícone da ficha | [`assets/play-icon-512.png`](assets/play-icon-512.png) | 512×512, PNG 32-bit **com** alpha, ≤ 1024 KB | ✅ 126 KB |
| Feature graphic | [`assets/feature-graphic.png`](assets/feature-graphic.png) | 1024×500, **sem** alpha | ✅ |
| Screenshots de telefone (Play) | [`assets/screenshots/`](assets/screenshots/) | ≥ 2, proporção ≤ 2:1, lado 320–3840 | ✅ 6 × 1080×1920 (1,778:1), **regerados em 2026-08-03** com a barra de status legível |
| Screenshots de iPhone (App Store) | [`assets/screenshots-ios-67/`](assets/screenshots-ios-67/) · [`assets/screenshots-ios-65/`](assets/screenshots-ios-65/) | buckets 6,7" (1290×2796) e 6,5" (1242×2688), tamanho **exato** | ✅ 12 × publicáveis, **regerados em 2026-08-03** com a barra de status legível |

> **Por que foram regerados em 2026-08-03.** Os seis anteriores traziam a barra
> de status do sistema em conteúdo escuro sobre `#03030d` — relógio, Wi-Fi, sinal
> e bateria a **1,02:1** de contraste, praticamente invisíveis. A causa era
> `<StatusBar style="dark" />` no `_layout.tsx` (no `expo-status-bar`, `dark`
> significa conteúdo escuro, o valor para fundo claro), e com
> `edgeToEdgeEnabled: true` o app desenha atrás da barra. Corrigido em `b62f529`.
>
> **O contrato de assets aprovava os arquivos defeituosos**, e isso é o que vale
> carregar: ele mede dimensão, proporção, peso e presença — nunca legibilidade.
> Um asset pode passar em todo contrato que existe e ainda assim estar errado
> para o olho humano. O achado veio do smoke da C2, não de um validador.
>
> Os buckets de iPhone tinham o mesmo defeito e foram tratados na mesma data;
> ver a seção do lado iOS.

## Como regerar

Os três saem de scripts determinísticos — nenhum é editado à mão.

**Ícone 512 e demais derivados** (a partir da arte-mestra do Pixel):

```bash
python3 scripts/assets/build-icons.py --out-app radiant-app/assets/images --out-store docs/store/assets
```

**Feature graphic:**

```bash
python3 scripts/assets/build-feature-graphic.py --out docs/store/assets
```

**Screenshots** — três passos, nesta ordem:

```bash
adb shell wm size 1080x1920
```

```bash
cd radiant-app && perl -e 'alarm 1500; exec @ARGV' maestro --platform android test .maestro/store-capture.yaml
```

```bash
python3 scripts/assets/normalize-screenshots.py --spec play --src "$(ls -td ~/.maestro/tests/*/ | head -1)Store screenshot capture/takeScreenshot/shots" --out docs/store/assets/screenshots
```

O `--spec` é obrigatório desde 2026-07-30, e a razão não é organização: **o teto
de 2:1 do Play reprova os dois buckets de iPhone** (1290×2796 = 2,167:1 e
1242×2688 = 2,164:1). As duas lojas medem coisas diferentes — o Play mede
*proporção*, a App Store mede *tamanho exato* — então uma regra só não serve às
duas, e rodar o spec errado não degrada a saída: ela recusa tudo.

E devolva a resolução ao terminar: `adb shell wm size reset`.

## Armadilhas medidas — leia antes de recapturar

- **A resolução nativa do emulador seria recusada.** O Pixel 9 entrega
  1080×2424 = **2,244:1**, acima do teto de 2:1 do Play. Daí o
  `wm size 1080x1920` (9:16 exato) antes do flow. O
  `normalize-screenshots.py` recusa qualquer arquivo fora da faixa em vez de
  gravar e deixar o erro para a revisão da loja.
- **O normalizador avaliava depois de destruir.** A versão anterior apagava o
  diretório de saída (`rmtree`) **antes** de validar qualquer arquivo, então um
  `--spec`/`--src` errado apagava a saída boa que já estava lá e só então
  falhava. Corrigido em 2026-07-30: avalia todos os candidatos primeiro, e só
  toca no destino quando o conjunto inteiro passa.
- **O Maestro grava em `~/.maestro/tests/<run>/…/takeScreenshot/shots/`**, não no
  diretório de trabalho. Esse caminho sobrevive entre sessões — as capturas de uma
  sessão anterior foram recuperadas de lá depois de terem sido dadas como perdidas.
- **Rolagem guardada por condição custa um dump da árvore por iteração.** Sobre o
  fundo galáctico, que anima sem parar, o dump espera o *idle* e pode levar
  minutos: uma execução passou o mesmo trecho em menos de um minuto e outra ficou
  20 minutos presa nele. O flow usa **rolagem fixa** para chegar ao CTA da home,
  que não avalia condição nenhuma. O CTA renderiza **depois do mapa inteiro da
  jornada**: 3 rolagens não bastam, 12 chegam.
- **"Element not found" é afirmação sobre o matcher, não sobre o elemento.**
  `scrollUntilVisible` com `centerElement: true` e `visibilityPercentage: 100%`
  falhou em `lesson-option-q1:option:1` — mas o id estava na árvore, em y1382–1534
  de 1920, visível. Ele não conseguia *centralizar* numa lista que já não rola. O
  flow usa rolagem condicional com 60% de visibilidade e tap direto.
- **O build precisa das variáveis de ambiente, e o Gradle não invalida cache por
  variável.** Um build que reaproveita um bundle JS gerado sem as `EXPO_PUBLIC_*`
  produz um app sem as feature flags — e a home aparece sem conteúdo elegível, o
  que parece defeito de produto e não é. Se isso acontecer, apague
  `android/app/build/generated/assets/createBundleReleaseJsAndAssets` e rebuilde.
- **Use o perfil `production`, não o de E2E.** A receita documentada em
  `radiant-app/docs/evidence/2026-07-28-android-e2e-first-run.md` usa
  `EXPO_PUBLIC_APP_ENV=development`; para vitrine isso é evidência inválida, porque
  screenshot de loja tem de mostrar o que o usuário recebe. Também é preciso
  `SENTRY_DISABLE_AUTO_UPLOAD=true`, sem o qual o build falha no upload.

## Ressalva do progresso zerado — FECHADA em 2026-07-30

A redação anterior desta seção dizia que os screenshots mostravam `XP total: 0`,
`REVISÕES 0` e "Sem tentativas avaliadas ainda", que eram "honestos e válidos"
mas uma vitrine fraca, e que a causa **não fora investigada** — com decisão
pendente do dono entre aceitar, estender o flow ou investigar.

Investigada, e não era vitrine fraca: **eram dois defeitos**.

1. **O laço de gamificação não tinha escritor alcançável em produção.** Os três
   escritores viviam no hook `useQuiz`, servido por uma rota para a qual nada no
   app navega. XP, sequência, revisões e meta diária ficavam permanentemente em
   zero. Corrigido em `ab40bb1..056ffe1` com o `LessonOutcomeService`.
2. **Os cards `PRECISÃO` e `TÓPICOS` eram hardcoded**, sem dado por trás:
   `LearningStatsService` tinha zero consumidores e nada gravava
   `LearningAttempt`. Corrigido em `233f4b0`.

Os seis arquivos desta pasta foram **regerados em 2026-07-30** a partir da
captura posterior às duas correções, e agora mostram `⚡ 36`, `🔥 1d`,
`PRECISÃO 100%` e `TÓPICOS Fundamentos — 100% · 2 lições`. Os anteriores, de
2026-07-29 18:00, mostravam o estado defeituoso.

**Não há decisão pendente do dono nesta seção.** Evidência em
[`2026-07-30-e1-store-capture.md`](../../radiant-app/docs/evidence/2026-07-30-e1-store-capture.md).

**O que continua verdadeiro da redação antiga:** a regra de que um screenshot de
loja tem de mostrar o que o usuário realmente recebe. Foi exatamente ela que
transformou "vitrine fraca" em "defeito a corrigir" em vez de "recortar melhor".

## Capturas de iPhone refeitas em 2026-11-17 (1.6, depois do refinamento visual)

Os doze arquivos de `screenshots-ios-67/` e `screenshots-ios-65/` foram refeitos na
`main` em `32b2db94`, por ordem do dono. As anteriores eram de 2026-08-03 e mostravam
o desenho de antes do Medalhão.

| Arquivo | O que mostra agora |
| --- | --- |
| `01-home.png` | Trilha com a primeira aula concluída, 23 XP e sequência de 1 dia |
| `02-licao.png` | Abertura da aula "O trabalho do tecnólogo" |
| `03-quiz.png` | Pergunta respondida, com a folha de acerto |
| `04-checkpoint.png` | Classificar em grupos, conferido e certo. O nome do arquivo é o antigo; a tela não é uma avaliação |
| `05-conquista.png` | Resumo da aula: três estrelas, +18 XP, 5 de 5 |
| `06-progresso.png` | Perfil com a medalha, a semana e a liga |

**Como foram feitas, e no que diferem da receita antiga:**

- Simuladores criados para isso: "Radiant Loja 67" (iPhone 16 Plus) e "Radiant Loja 65"
  (iPhone 11 Pro Max), iOS 26.5, com `simctl status_bar override` (9:41, bateria cheia).
- **Não é build Release.** É o cliente de desenvolvimento de 2026-11-15 servindo o
  JavaScript da `main` pelo Metro, com as variáveis do perfil `production` do
  `eas.json` passadas no ambiente. O que aparece na tela é o mesmo código; o binário
  não é o da loja.
- **Sem Maestro.** O roteiro `store-capture.yaml` saiu do repositório em `30c95b0e`. O
  agente percorreu a primeira aula pela trilha, com toques, e capturou com
  `xcrun simctl io <udid> screenshot`. Não há roteiro para reproduzir.
- Passaram pelo `normalize-screenshots.py` (`ios-67` e `ios-65`): tamanho exato, RGB
  sem alfa.

**Captura de revisão da assinatura, refeita em 2026-11-17:**
[`assets/assinatura-revisao.png`](assets/assinatura-revisao.png), 1206×2622, RGB. Mostra a
tela "Radiant Ilimitado" com os dois cartões de plano e os preços do arquivo
`RadiantIlimitado.storekit` (R$ 19,90 por mês e R$ 149,90 por ano). O app foi lançado pelo
Xcode (Product → Perform Action → Run Without Building) no simulador "Radiant F6", com o
JavaScript da `main` em `a4e3a635` mais a troca do texto da apresentação.

- O `ios/` local é de setembro e **não compila no Xcode 27.2** (dependências com alvo de
  iOS abaixo de 15). O binário lançado foi o compilado em 2026-11-13 na árvore da F4,
  copiado para a pasta de produtos que o Xcode procura. Para a próxima vez, o caminho
  limpo é regenerar o `ios/` com `expo prebuild` e religar o `.storekit` ao esquema.
- O Xcode começou a indexar o projeto ao abrir e levou a carga da máquina acima de 100
  por uns três minutos; o simulador só voltou a aceitar toque depois disso.

**Capturas do Play, refeitas em 2026-11-17:** os seis arquivos de `screenshots/`, em
1080×1920, com as mesmas seis telas e os mesmos nomes dos buckets de iPhone.

- A máquina não tinha Android: o dono autorizou baixar a imagem
  `system-images;android-35;google_apis;arm64-v8a` pelo `sdkmanager`. O emulador é o
  AVD "RadiantPlay" (Pixel 7), ligado sem janela, com `wm size 1080x1920`, densidade
  420 e o modo de demonstração da barra de status (9:41).
- O `android/` local era de julho. Foi regenerado com `expo prebuild --platform android
  --clean` e compilado com `./gradlew :app:assembleDebug` (11 min). É o cliente de
  desenvolvimento servindo o JavaScript da branch pelo Metro, com as variáveis do
  perfil `production`; não é o binário da loja.
- O primeiro bundle do Android demora mais que o prazo do app, que mostra
  `SocketTimeoutException`. Recarregar depois de o Metro terminar resolve.
- O app abre por `exp+radiant-app://expo-development-client/?url=…`, com
  `adb reverse tcp:8081 tcp:8081`.
- Os toques foram por texto do elemento (`uiautomator dump` mais `input tap`), num
  script que ficou fora do repositório. Um alvo atrás do rodapé fixo aparece na árvore
  mas não recebe o toque: é preciso rolar antes.

**Visto nas capturas do Android, não investigado:** os títulos grandes parecem sair na
fonte do sistema, e não na Sora, como no iPhone.

**Subir os arquivos ao App Store Connect e ao Play Console é do dono.**

## Lado iOS — normalizado e travado no contrato (2026-07-30)

Esta pasta atende **apenas o Play**: o teto 2:1 e a faixa de lado 320–3840 são
regras do Google. O iOS foi capturado em 2026-07-30 nos dois buckets — iPhone 16
Plus (6,7", **1290×2796**) e iPhone 11 Pro Max (6,5", **1242×2688**), ambos
`EXIT=0` — mas os arquivos vivem como **evidência** em
`radiant-app/docs/evidence/2026-07-30-e1-store/`, não como assets publicáveis.

**O que mudou em 2026-07-30:** o `normalize-screenshots.py` deixou de atender só
o Play. Ele passou a exigir `--spec` e a implementar `ios-67` e `ios-65` como
validação de **tamanho exato**, porque a App Store mede tamanho e o Play mede
proporção. Antes disso o script não era neutro em relação ao iOS — o `MAX_RATIO`
de 2,0 **reprovava** os doze arquivos, já que 1290×2796 = 2,167:1 e
1242×2688 = 2,164:1.

**Feito em 2026-07-30:** os doze PNGs publicáveis foram gerados das capturas
cruas e vivem agora como assets, não como evidência:

| Bucket | Pasta | Tamanho | Origem |
| --- | --- | --- | --- |
| 6,7" | `docs/store/assets/screenshots-ios-67/` | 1290×2796 | `~/.maestro/tests/2026-07-30_145305/` |
| 6,5" | `docs/store/assets/screenshots-ios-65/` | 1242×2688 | `~/.maestro/tests/2026-07-30_151618/` |

Seis telas em cada, todos RGB sem alpha. Reprodução:

```bash
python3 scripts/assets/normalize-screenshots.py --spec ios-67 --src "$HOME/.maestro/tests/2026-07-30_145305/Store screenshot capture/takeScreenshot/shots" --out docs/store/assets/screenshots-ios-67
```

> **Regerados em 2026-08-03, pelo mesmo defeito do lado Play.** Os doze
> arquivos de 2026-07-30 traziam a barra de status do sistema em conteúdo escuro
> sobre fundo escuro — no `01-home.png` do bucket 6,7", o relógio "14:59" era
> praticamente invisível. Causa e correção em `b62f529`.
>
> **Os simuladores da receita acima não existiam mais neste Xcode.** O iPhone 16
> Plus e o iPhone 11 Pro Max seguem disponíveis como *device types*, mas sem
> instâncias criadas; foram recriados no runtime iOS 26.5, que os aceita, e
> renderizam exatamente 1290×2796 e 1242×2688. Isso importa porque o
> `normalize-screenshots.py` é **validador, não conversor**: ele exige tamanho
> exato nos buckets de iPhone e recusa o resto, então a resolução tem de vir do
> simulador certo — não há pós-processamento que salve uma captura no tamanho
> errado, e forçar um seria fabricar um asset que passa no contrato sem ser o que
> ele afirma.
>
> Novas origens: `~/.maestro/tests/2026-08-03_223304/` (6,7", 398s) e
> `~/.maestro/tests/2026-08-03_224052/` (6,5", 448s), ambas sobre build Release
> local sob configuração de produção.

**Travados no contrato**, não deixados como artefato de uma execução só:
`icon-assets-contract.test.mjs` foi de 11 para **14 testes**, com uma asserção de
**tamanho exato** por bucket e uma terceira que exige que os dois buckets cubram
**o mesmo conjunto de telas** — porque a verificação de tamanho passa num bucket
que tem telas a menos, e só varredura enxerga ausência. As três verificadas por
reversão: apontando o bucket 6,7" para a pasta do Play, **só** esse teste falha e
os outros treze seguem verdes.

Resta **selecionar** quais das seis telas vão em cada ficha — passo de publicação,
não de engenharia.
