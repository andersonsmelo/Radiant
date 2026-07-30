# Assets gráficos da ficha do Google Play

Fecha **L2.7 (E1)**. Os três assets obrigatórios existem, estão travados pelo
contrato `radiant-app/scripts/icon-assets-contract.test.mjs` e o contrato roda no
`npm run quality` desde 2026-07-29.

## O que existe

| Asset | Arquivo | Especificação | Estado |
| --- | --- | --- | --- |
| Ícone da ficha | [`assets/play-icon-512.png`](assets/play-icon-512.png) | 512×512, PNG 32-bit **com** alpha, ≤ 1024 KB | ✅ 126 KB |
| Feature graphic | [`assets/feature-graphic.png`](assets/feature-graphic.png) | 1024×500, **sem** alpha | ✅ |
| Screenshots de telefone (Play) | [`assets/screenshots/`](assets/screenshots/) | ≥ 2, proporção ≤ 2:1, lado 320–3840 | ✅ 6 × 1080×1920 (1,778:1), **regerados em 2026-07-30** |
| Screenshots de iPhone (App Store) | — | buckets 6,7" e 6,5" | ⚠️ **capturados, não normalizados** — ver a seção do lado iOS |

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
python3 scripts/assets/normalize-screenshots.py --src "$(ls -td ~/.maestro/tests/*/ | head -1)Store screenshot capture/takeScreenshot/shots" --out docs/store/assets/screenshots
```

E devolva a resolução ao terminar: `adb shell wm size reset`.

## Armadilhas medidas — leia antes de recapturar

- **A resolução nativa do emulador seria recusada.** O Pixel 9 entrega
  1080×2424 = **2,244:1**, acima do teto de 2:1 do Play. Daí o
  `wm size 1080x1920` (9:16 exato) antes do flow. O
  `normalize-screenshots.py` recusa qualquer arquivo fora da faixa em vez de
  gravar e deixar o erro para a revisão da loja.
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

## Lado iOS — capturado, ainda não normalizado para a App Store

Esta pasta e o `normalize-screenshots.py` atendem **apenas o Play**: o teto 2:1 e
a faixa de lado 320–3840 são regras do Google. O iOS foi capturado em 2026-07-30
nos dois buckets — iPhone 16 Plus (6,7", **1290×2796**) e iPhone 11 Pro Max
(6,5", **1242×2688**), ambos `EXIT=0` — mas os arquivos vivem como **evidência**
em `radiant-app/docs/evidence/2026-07-30-e1-store/`, não como assets publicáveis.

A App Store tem buckets e proporções próprios, e o script atual não os conhece.
Normalizar o lado iOS é trabalho separado, ainda **não feito**, e é pré-requisito
da submissão à App Store — não da submissão ao Play.
