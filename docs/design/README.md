# Referências de design

Material visual de referência. **Nada aqui é código de produção** e nada aqui é
importado pelo app — o app vive em `radiant-app/`, e a fonte de verdade do
sistema visual são os tokens em `radiant-app/src/ui/`.

## `2026-08-12-hud-assets-approved.html`

Prancheta dos três ícones animados do HUD aprovada pelo dono e recuperada do
scratchpad volátil da sessão que a criou. Foi preservada byte a byte, sem
reescrita; SHA-256 da origem e desta cópia:
`1802b14952cf8f1701d87bcff61918f741b6380cd34fd8a83b8c0d970d8844c0`.

O HTML conserva os loops longos usados apenas para demonstrar a prancheta. A
implementação de produção segue as durações declaradas dentro do próprio
artefato: XP em 600ms, perda de vida em 220ms e chama em loop de 1600ms. A
decisão posterior de executar os glifos pequenos em código, sem runtime Rive,
continua valendo.

## `new-layout/`

Protótipo de layout produzido fora do repositório e preservado sem alteração,
com o conteúdo que existia em 2026-08-02: seis arquivos `.jsx`, uma página
`.html`, uma folha `tokens.css` e três imagens do mascote Pixel.

Estava solto na raiz do repositório e sem rastreamento desde antes de 2026-07-23,
citado como "material não rastreado preservado" nos status daquela data. Foi
versionado aqui em 2026-08-02, por decisão do dono, para deixar de ser um item
sem decisão que cada sessão redescobre e volta a adiar.

**Como ler este material:** é referência de intenção visual, não especificação. Se
divergir dos tokens do app ou da
[ADR de identidade galaxy dark](../adr/ADR-2026-07-27-identidade-visual-galaxy-dark.md),
quem vale é o app e a ADR — o protótipo é anterior a boa parte das decisões que o
projeto tomou desde então.
