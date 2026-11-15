# Runbook — ligar os widgets do iOS (F5 da 1.6)

**Para o dono.** O código dos widgets está atrás da chave `ENABLE_WIDGETS`, desligada
por padrão. Com ela desligada, a build é a de hoje. Decisão e motivos na
[ADR 2026-11-15](../adr/ADR-2026-11-15-widgets-ios.md).

Nada aqui foi feito pelo agente: portal da Apple, EAS e App Store Connect são seus.

## 1. Portal da Apple (uma vez)

Em developer.apple.com → Certificates, Identifiers & Profiles:

1. **Identifiers → App Groups → +**: crie `group.com.ascendcreative.radiant.widgets`
   (descrição livre, por exemplo "Radiant Widgets").
2. **Identifiers → App IDs**, abra `com.ascendcreative.radiant` → marque **App Groups** →
   **Configure** → selecione o grupo acima → salve. A Apple avisa que os perfis
   ficam inválidos; o EAS os refaz na próxima build.
3. **Identifiers → App IDs → +**: crie o ID do widget, `com.ascendcreative.radiant.widgets`,
   tipo App, com **App Groups** marcado e o mesmo grupo.

Se preferir, o EAS cria os dois IDs na primeira build com credenciais gerenciadas,
mas o **App Group** ele não associa sozinho em todos os casos: confira o passo 2 e 3
no portal depois da build.

## 2. Ligar a chave na build

A mesma variável liga o alvo no prebuild, o pod no `pod install` e a ponte no JS.
Ela precisa estar no ambiente da **build inteira**, então vai no `env` do perfil do
`eas.json` (não basta OTA):

```json
"EXPO_PUBLIC_ENABLE_WIDGETS": "true"
```

Sugestão: ligue primeiro num perfil interno (`preview` ou `development`) e só depois
no `production`. O bundle id e o time do app não mudam; a build ganha uma extensão,
`RadiantHomeWidgets`, com bundle `com.ascendcreative.radiant.widgets`.

Na primeira build, o EAS pergunta sobre credenciais da extensão nova; aceite gerar.

## 3. O que testar no aparelho

Com a build instalada:

1. Abra o app uma vez (a abertura grava o primeiro retrato).
2. Toque e segure a tela inicial → **+** → procure **Radiant**. Devem aparecer
   **Sequência** (pequeno) e **Estudo do dia** (médio).
3. Adicione os dois. Confira:
   - sequência igual à do app; "Hoje já conta" só se você estudou hoje. Exceção
     conhecida: depois de dois dias sem estudo, o widget mostra 0 e a home ainda o
     número antigo (ver ADR, Consequências);
   - meta do dia igual à do app (por exemplo "1 de 3");
   - nome da próxima aula igual ao do botão principal da home.
4. Faça uma aula e volte para a tela inicial: os números mudam sem abrir o widget.
5. Toque no pequeno: abre a home. Toque no médio: abre a próxima aula (ou a revisão,
   quando há revisão vencida).
6. **Virada do dia:** deixe o aparelho passar da meia-noite sem abrir o app. De manhã,
   o widget deve dizer "Estude hoje para manter" e a meta deve estar zerada.
7. Modo escuro, letras grandes (Ajustes → Acessibilidade → Tamanho do texto) e
   VoiceOver: o widget lê "Sequência de N dias…".

## 4. Desligar

Tire a variável do perfil e faça outra build. Por OTA só se desliga a ponte (o JS
para de gravar); o widget instalado continua mostrando o último retrato até a
virada da linha do tempo zerar a sequência. Para sumir com o widget, só build nova.

## Fora deste runbook

- Android: fora do recorte (ADR).
- `Assets.xcassets` gerado pelo prebuild local dentro de
  `radiant-app/modules/radiant-widgets/targets/widget/`: apague depois de um prebuild
  local com a chave ligada.
