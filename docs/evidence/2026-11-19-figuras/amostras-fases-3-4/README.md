# Amostras das fases 3 e 4: prontas, paradas esperando o dono (medido em 2026-11-20 e 21)

As fases 3 (14 gráficos em código) e 4 (3 fluxos com ícones) têm amostra pronta e **não foram integradas ao app**. As duas esperam uma decisão do dono, por regras que o próprio dono fixou. Nada aqui foi para o app, para `figuras.json` nem para as aulas.

## Fase 3: gráficos com a gramática da skill `dataviz`

Amostra: `espectro-de-raios-x`, `relaxacao-t1-t2` (animado) e `circuito-do-gerador`, redesenhadas com uma gramática única (painel opaco, eixos com seta cheia, sem grade, marcas só onde há valor nomeado, cartões uniformes nos esquemas, cor por papel). Quadro 320 x 240, só o que o `SvgXml` aceita, só cores da paleta.

- [`fase3-comparacao.png`](fase3-comparacao.png): a figura atual e a nova, lado a lado.
- **Ganho medido: pequeno.** Painel e quadro, marcas dos valores-chave e cartões uniformes. A forma dos gráficos já estava certa; a gramática organiza, não corrige.
- **Por que espera o dono:** a lição de AGENTS.md "Mostre uma amostra antes do volume" (101 figuras em SVG por modelo, reprovadas depois). Levar 14 gráficos a volume sem o dono ver a amostra repete o erro, e o ganho não compensa o risco (R21). A amostra foi enviada a ele em 2026-11-20; o registro do controlador não mostra resposta até 2026-11-21.
- **O que decidir:** aprovar a gramática e liberar os 14 gráficos em dois lotes, ou manter os atuais.

## Fase 4: fluxos com ícones do Lucide

Três fluxos refeitos com cinco cartões em serpentina, um ícone do Lucide v1.77.0 em cada, setas cheias e a mesma grade, 3 camadas e cerca de 3 KiB cada (os atuais têm 5 a 7 camadas):

- [`fase4-cadeia-de-custodia.png`](fase4-cadeia-de-custodia.png) (m31, lição 3 rotular e lição 4 tocar)
- [`fase4-fluxo-de-pesquisa.png`](fase4-fluxo-de-pesquisa.png) (m31, lição 5 rotular)
- [`fase4-fluxo-ris-pacs.png`](fase4-fluxo-ris-pacs.png) (m22, lições 4 rotular e 6 tocar)

- **Ganho medido: modesto, de consistência.** Um conjunto de ícones só, mesmo traço e escala, setas legíveis a 280 pt, menos camadas. **Perda de especificidade:** o `fluxo-ris-pacs` deixa de mostrar o tubo e a mesa, e o ícone fica mais genérico. A m22 muda de coordenadas e 15 frases `where` das aulas mudam.
- **Por que espera o dono:** o Lucide é **ISC**, e a regra de licença do dono (2026-11-06) aceita só CC0, domínio público ou CC BY. A régua do registro de figuras reprova ISC. Uma figura que só entra quebrando a regra da seção 2 do plano espera o dono (R20).
- **O que decidir:** aceitar ISC para ícones (a licença exige manter o aviso de copyright, que iria para a tela de créditos), ou trocar de conjunto por um CC0 ou CC BY, ou manter os fluxos atuais.

A pasta de trabalho completa (gramática, specs, ícones, `LICENSE-lucide.txt`, alvos e medidas de selo) fica em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/` e não vai ao git; se a decisão for sim, o agente que integrar refaz a partir da amostra.
