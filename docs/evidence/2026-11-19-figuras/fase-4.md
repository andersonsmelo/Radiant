# Fase 4: três fluxos com ícones do Lucide (integração de 2026-11-21)

Aprovada pelo dono em 2026-11-21 ("Aceito a ISC"), depois da amostra de 2026-11-20 ([`amostras-fases-3-4/`](amostras-fases-3-4/README.md)). Cada fluxo substitui o spec de mesmo `id`: cinco cartões em serpentina, um ícone do Lucide v1.77.0 em cada, setas cheias, quadro 320 x 240, parados (todos têm área de toque). Gerador, ícones e licença: `scripts/content/figuras/fluxos/` e `scripts/content/figuras/vendor/lucide/`. Prévias com os marcadores do app a 280 pt em [`fase-4/`](fase-4/) (todas abaixo de 60 KiB).

## Licença: o que mudou

- Lucide: licença **ISC**, Copyright (c) 2026 Lucide Icons and Contributors (https://lucide.dev/license). Nenhum dos 13 ícones usados está na lista dos derivados do Feather (MIT). O texto do pacote está em `vendor/lucide/LICENSE`, sem alteração.
- A régua `OPEN_LICENSE` de `scripts/content/rtg-figuras.mjs` passou a aceitar `ISC`, e só ela além de CC0, domínio público e CC BY. Quem a verifica é `scripts/content/rtg-figuras.test.mjs` (não o `diagramRegistry.test.ts`, que não tem checagem de licença). Asserção nova: `ISC` passa; `ISC License`, `ISC-like`, `ISC, com restrição`, CC BY-SA, CC BY-NC e CC BY-ND continuam barradas. Vista falhando antes da mudança, com a mensagem "licença fora de CC0, domínio público e CC BY: ISC" (execução vermelha guardada em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/vermelho-f4.txt`, fora do git).
- Registro: três entradas `acervo` em `content-manifest/rtg-2026/figuras.json`, com autor "Lucide Icons and Contributors (Copyright (c) 2026)", licença `ISC`, página https://lucide.dev e licença https://lucide.dev/license. O `sha256Original` é o da concatenação dos cinco SVG originais do pacote, na ordem do fluxo. O crédito sai pela tela de créditos que já lê o registro (`RTG_FIGURE_CREDITS`); o texto em maiúsculas não passou do teto de `copy-style-baseline.json`, que não mudou.

- Uma régua do teste do registro mudou junto: a de cor das figuras importadas (`diagramRegistry.test.ts`) deixou de distinguir maiúscula de minúscula no hexadecimal, porque `P.accent` é `#4A9EFF` e as outras figuras importadas vêm em minúsculas. É afrouxamento de forma, sem aceitar cor fora da paleta.

## Figuras que entraram

| Figura | Unidade | Ícones (Lucide 1.77.0) | SVG | Camadas |
|---|---|---|---|---|
| `cadeia-de-custodia` | m31 aulas 3 (rotular) e 4 (tocar) | package, handshake, scan-line, notebook-pen, folder-lock | 3,02 KiB | 3 |
| `fluxo-de-pesquisa` | m31 aula 5 (rotular) | file-check, file-signature, scan-line, eye-off, folder-lock | 3,00 KiB | 3 |
| `fluxo-ris-pacs` | m22 aulas 4 (rotular) e 6 (tocar) | clipboard-list, list-checks, radiation, hard-drive, monitor-check | 2,93 KiB | 3 |

Os specs antigos tinham de 5 a 7 camadas e de 2,6 a 4,1 KiB. O ícone do "Arquivo trancado" passou de `vault` a `folder-lock`, para o cadeado aparecer. Só o passo de imagem é âmbar (`P.beam`). Perda assumida: os ícones são mais genéricos que os desenhos antigos (sem tubo, mesa nem paisagem), e por isso as frases de localização das aulas mudaram.

## Itens alterados (antes e depois em `.superpowers/.../itens-alterados-f4.md`, fora do git)

- m22 aula 4, `label` do fluxo RIS-PACS: cinco pontos novos (a grade de 76 x 68 substituiu a de 68 x 68) e cinco `where` sem "bloco com...".
- m22 aula 6, `hotspot` do mesmo fluxo: quatro regiões em caixa justa do cartão (largura 0,2125 -> 0,2375).
- m31 aula 3, `label` da cadeia: cinco `where` novos; coordenadas iguais.
- m31 aula 4, `hotspot` da cadeia: três rótulos de região passam aos nomes declarados ("Aparelho de imagem" -> "Aquisição da imagem", "Prancheta assinada" -> "Entrega assinada", "Armário com cadeado" -> "Armário trancado"), sem mudar quais são as certas.
- m31 aula 5, `label` do fluxo de pesquisa: cinco `where` novos; coordenadas iguais.
- O `alt` das três figuras deixou de nomear os passos. Nenhuma pergunta nem resposta certa mudou; todo ponto e região sobre as três figuras ganhou o campo `alvo`.

## Medidas de área de toque e de selo (geometria, repetida pelo `alvos.mjs` da amostra)

- **Rotular (pontos):** o ponto fica no centro do cartão, e a área de toque de 44 pt (0,157 x 0,21 do quadro, 50,2 x 50,4 unidades) cabe inteira dentro do cartão de 76 x 68: 100% é o cartão da resposta certa (fundo do cartão e o ícone de 48 x 48), 0% de outro cartão e 0% de seta.
- **Tocar (regiões):** a região é a caixa do cartão (76 x 68, maior que 50 x 50), então a área de toque é o próprio cartão: 100% da estrutura nomeada, 0% de cartão de resposta errada. Nenhuma região foi inflada.
- **Selo do app:** nos pontos, o selo cobre 75% do próprio cartão (canto superior direito), 0% de outro cartão e 0% de seta; nas regiões, o selo fica fora da região (0% dentro), sem tocar outro cartão, e só um cobre seta (16,1% da seta do aparelho de imagem ao livro de registro, que continua legível).

## Números de teste (Node 20.20.2, medidos em 2026-11-21)

- Verificador nas 40 unidades: todas OK. `--check` de `build-rtg-batches.mjs`, de `generate-rtg-maestro.mjs` (m22, m31) e de `figuras-no-simulador.mjs` (62 ids, 5 roteiros novos: m22 aulas 4 e 6, m31 aulas 3, 4 e 5): ok.
- `node --test` de `scripts/content`, `scripts/qa`, `scripts/content/figuras` e `fluxos`: 485 testes, 484 passam e 1 falha, a conhecida e alheia `registerSource normalizes metadata for the pilot book`.
- Jest de `src/ui/diagrams`, `lesson-flow` e `student-checkpoints`: 66 suítes, 1635 testes, todos passam; `tsc --noEmit` e `eslint` nos arquivos tocados: saída 0; `test:maestro-contract`: 13 de 13; `docs-contract`: passa; `copy-style-contract`: 65 de 65, sem subir o teto.
- Gate completo `EXPO_NO_DOTENV=1 CI=1 npm run quality`: 297 suítes, 4611 testes, `visual:qa:strict` sem regressão.
- Peso: as três figuras somam 9,0 KiB de SVG; o teto total do teste do registro (8.116.109 bytes) segue passando, e o de 240 KiB por figura também.
