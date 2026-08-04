# C2 — smoke instrumentado no emulador Android, 2026-08-03

Estado: **`app-failed` no momento da medição, com um defeito real corrigido na
mesma data.** A task C2 pede "smoke manual"; esta execução mostrou que quatro dos
cinco itens são observáveis por instrumento, e o quinto não tem objeto.

Ambiente: emulador `Radiant_Pixel_9_API_36`, API 36, imagem `google_apis`,
1080×2424. APK Release local sob configuração equivalente a produção
(`APP_ENV=production`, `ENABLE_PUSH=true`), versão **1.3.1** conferida por
`dumpsys package`, `targetSdk=36`. Navegação dirigida por Maestro 2.7.0; captura
por `adb exec-out screencap`; escala de fonte alterada por
`settings put system font_scale`.

## Placar

| Item da C2 | Resultado |
| --- | --- |
| Navegação completa | **passa** — home, galáxia, progresso, quiz e retorno |
| Edge-to-edge — folga no fim da rolagem | **passa** — o CTA "Continuar jornada" fica inteiramente livre da tab bar flutuante |
| Edge-to-edge — barras do sistema | **falha** — ver abaixo |
| Predictive back sob target 36 | **passa** — sai do quiz para a home e da home para o launcher |
| Fontes ampliadas (2×) | **passa com ressalva** — layout aguenta; um rótulo quebra no meio da palavra |
| Teclado | **não aplicável** — ver abaixo |

## O defeito: barra de status ilegível em todo o app

`src/app/_layout.tsx` declarava `<StatusBar style="dark" />` nos cinco ramos. No
`expo-status-bar`, `dark` significa conteúdo **escuro** — é o valor para fundo
**claro**. Todas as superfícies do app são escuras (`galaxyColors.background` é
`#03030d`), e com `edgeToEdgeEnabled: true` o app desenha atrás da barra do
sistema. Resultado medido: relógio, Wi-Fi, sinal e bateria em preto sobre
`#03030d` — contraste de **1,02:1**, contra **20,53:1** que o conteúdo claro
teria.

Não é intermitente e não depende de tela: vale para todas, nas duas plataformas.

**E estava assado nos seis screenshots publicáveis do Play.** O
`docs/store/assets/screenshots/01-home.png` mostra o relógio "3:47" ilegível. O
contrato de assets aprovava porque mede dimensão e presença — nunca
legibilidade. É a mesma lição de 2026-08-03 sobre o `build_channel`: o artefato
passa no contrato que o mede, e o contrato não media isto.

Corrigido nesta data para `style="light"`, com contrato novo em
`scripts/contrast-contract.test.mjs` que **deriva** o valor exigido da luminância
do fundo real em vez de fixar `"light"`. Se o app um dia virar claro, o contrato
passa a exigir `"dark"` sozinho. Contraprova executada: revertendo um dos cinco,
o contrato reprova citando os dois números.

## "Teclado" não tem objeto na configuração distribuída

O app tem quatro arquivos com `TextInput`, e **nenhum é alcançável no que é
distribuído**:

| Arquivo | Por que não é alcançável |
| --- | --- |
| `BetaGateScreen.tsx` | o gate aplicado é `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`, e nenhum dos cinco perfis o aplica |
| `ProgressScreen.tsx` | os três campos vivem dentro de `{showDeveloperTools ? (`, e `SHOW_DEV_TOOLS` é falso em produção |
| `TelemetryDebugScreen.tsx` | `ENABLE_TELEMETRY_DEBUG_SCREEN` é falso em produção |
| `AnimatedCounter.tsx` | usa `TextInput` como truque de animação (`animatedProps` na UI thread), não como campo |

O item fica registrado como **não aplicável, com a razão**, e não como aprovado.
Marcá-lo passado afirmaria um teste que não existe.

## Ressalva das fontes ampliadas

A 200% de escala o layout se segura: o texto reflui, os cartões crescem, o rótulo
da aba trunca com reticências de forma graciosa e nada fica sobreposto. Mas o
`eyebrow` do `JourneyHero` — `textTransform: 'uppercase'` com `letterSpacing` —
parte "RADIOLOGIA" em "RADIOL / OGIA".

É a mesma classe de defeito que a **B2** corrigiu no `JourneyMap` em 2026-07-27
("rótulos quebrando só em limite de palavra"), reincidindo em outro componente.
**Deixado aberto de propósito:** a correção mexe na renderização de texto de um
componente que aparece nos screenshots de loja e tem baseline visual datada em
`scripts/visual-qa-policy.json`, e não cabia no run cujo objetivo era a barra de
status. Só se manifesta com fonte ampliada.

## Predictive back — a escolha, não só a flag

A C2 pede validar a escolha de `predictiveBackGestureEnabled: false` sob target
36, não apenas registrar o valor. Medido: o back sai do quiz para a home e da
home para o launcher, sem rota presa nem estado perdido. **Não há defeito
funcional**; o que se perde é a animação preditiva do Android. A escolha se
sustenta — agora por medição, não por inércia.

## Consequência operacional

Os seis screenshots do Play precisam ser recapturados com a correção, e o AAB
`1.3.1 (5)` gerado mais cedo nesta data **precede a correção**. Quem for subir
para a faixa fechada deve usar a build seguinte, não aquela.
