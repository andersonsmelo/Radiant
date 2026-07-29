# Assets gráficos da ficha do Google Play

Fecha **L2.7 (E1)**. Os três assets obrigatórios existem, estão travados pelo
contrato `radiant-app/scripts/icon-assets-contract.test.mjs` e o contrato roda no
`npm run quality` desde 2026-07-29.

## O que existe

| Asset | Arquivo | Especificação | Estado |
| --- | --- | --- | --- |
| Ícone da ficha | [`assets/play-icon-512.png`](assets/play-icon-512.png) | 512×512, PNG 32-bit **com** alpha, ≤ 1024 KB | ✅ 126 KB |
| Feature graphic | [`assets/feature-graphic.png`](assets/feature-graphic.png) | 1024×500, **sem** alpha | ✅ |
| Screenshots de telefone | [`assets/screenshots/`](assets/screenshots/) | ≥ 2, proporção ≤ 2:1, lado 320–3840 | ✅ 6 × 1080×1920 (1,778:1) |

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

## Ressalva aberta — progresso zerado nos screenshots

O plano pedia capturar a home **depois** de percorrer a trilha, para que XP e
sequência aparecessem preenchidos. O flow faz isso, mas o resultado ainda mostra
`XP total: 0`, `REVISÕES 0` e "Sem tentativas avaliadas ainda": completar uma
lição, um checkpoint e uma segunda lição não acumulou XP visível.

Os screenshots são **honestos e válidos** — é o que um usuário vê nos primeiros
minutos — e passam no contrato. Mas são uma vitrine fraca, e a causa do XP zerado
não foi investigada. **Decisão pendente do dono:** aceitar como está, estender o
flow até acumular progresso de verdade, ou tratar o XP zerado como defeito a
investigar antes de recapturar.
