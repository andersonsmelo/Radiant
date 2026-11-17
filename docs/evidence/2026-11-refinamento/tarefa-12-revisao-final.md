# Tarefa 12: correções da revisão final (2026-11-17)

Node 20.20.2. Cada item foi visto falhando antes do conserto.

## RED (antes do conserto)

- Missões: `MissionsScreen.flow`, "Continuar a trilha": `mockDismissTo` esperado com `/(tabs)`, recebido nada (a tela chamava `replace`).
- Número da peça: contraste de `#FFFFFF` sobre `#2F6BFF` = 4,499:1. Com o token de ação trocado por `#2F6BFF`, `npm run test:contrast-contract` reprovou o par novo: `medalGlyphTones.light sobre galaxy.actionPrimary: 4.50:1, exigido 4.5:1` (4,499 arredonda para 4,50).
- Resposta certa, V ou F: esperado `O avental protege: certo; Pode pular a checagem, se houver pressa: errado`, recebido `Certo: O avental protege Errado: Pode pular a checagem, se houver pressa`.
- Resposta certa, múltipla seleção: esperado `Luvas, avental e óculos; Máscara`, recebido `Luvas, avental e óculos, Máscara`.
- `TapChip`: largura da borda esperada 2, recebida 1 (ficha em repouso).
- Título da folha: o teste do rótulo `Resposta incorreta. Vamos reforçar` não achou o cabeçalho.
- Peça: o teste nasceu vermelho (`backgroundColor` esperado `#2559E6`, recebido `undefined` na primeira tentativa de achar a face, que ainda era `medalColors.unit.face`). Depois de corrigido o modo de achar a peça na árvore, ele passou direto com o conserto: o vermelho forte desse teste é fraco, e a guarda real do contraste é o par no contrato.

## GREEN

- Testes focados dos arquivos tocados: verdes.
- `npx tsc --noEmit`: sem erros. `npx eslint` dos arquivos tocados: limpo.
- `test:contrast-contract` 20/20, `test:identity-palette-contract` 1/1, `test:copy-style-contract` 65/65, `test:style-literal-contract` 19/19, `visual:qa:strict` sem regressão.
- `npx jest --runInBand`: 284 suítes, 3841 testes, todos verdes.
