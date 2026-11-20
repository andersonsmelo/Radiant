# Brief do construtor de cenas (fase 2, kit isométrico)

> Escrito em 2026-11-20 pelo controlador para os lotes da fase 2. Vai ao repositório como `scripts/content/figuras/briefs/cena.md` no run do primeiro lote. Como o lote roda: `docs/superpowers/plans/2026-11-20-figuras-continuidade.md`, seção 4 (mesmo passo a passo da fase 1).

Você constrói cenas didáticas isométricas (equipamento de radiologia e pessoas) para o app Radiant, com o kit da fase 2. Escreva em português do Brasil. Node 20: `export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`. `python3` é bloqueado: `uv run --with pillow python -I`. Sem `git`, sem `loop`, sem subagentes; você NÃO altera arquivo do repositório: tudo vai para `<WS>/<id>/`.

## Leia primeiro
- O kit: `.superpowers/sdd/2026-11-20-figuras-fases-2-6/fase2-kit/` (`kit/*.mjs`, `kit.test.mjs`, `relatorio.md`, `prancha.png`) e a cena-modelo aprovada `fase2-kit/cena-leito/` (código, `figura.svg`, prévias, `alvos.json`). Use o kit como está; peça nova vai em `<WS>/<id>/pecas.mjs`, no mesmo estilo, e é dita no relatório.
- Para cada cena: o spec atual `radiant-app/src/ui/diagrams/specs/<id>.ts` (o `alt`, o que mostra, se é laço) e TODAS as aulas que a usam (`git grep -l '"<id>"' content-manifest/rtg-2026/aulas/`): o `concept.visual`, cada interação com `diagramId` igual ao id (hotspot, label, risk-hunt), seus alvos e o texto que fala da figura (lado, posição, cor, quem está onde).

## Regras
1. **A cena nasce dos alvos.** Antes de desenhar, escreva em `<WS>/<id>/alvos-da-aula.md` a lista de cada alvo que as aulas cobram e o que ele precisa mostrar, e o que o texto afirma da cena. A cena só começa com a lista fechada. Nenhum alvo some sem ser dito.
2. **Técnica certa.** Posição do tubo, do detector, do paciente e de quem fica na sala conforme o texto da aula e a prática de radiologia; o feixe sai do colimador e chega ao detector; distâncias plausíveis (o kit trabalha em cm). Diga no relatório cada escolha técnica.
3. **Parada.** Decisão do dono de 2026-11-20: figura de movimento entra parada; quando a aula compara dois estados, dois estados lado a lado. O texto da aula que diz que a figura se move vai como correção sugerida em `aulas.md`.
4. **Réguas da arte importada:** quadro 320 x 240 (desenhe em 640 x 480), sem `text`, `image`, `style`, `filter`, `mask`, `clipPath`, `use`, `pattern`, `class`, `var(`; cores só hexadecimais da paleta do kit; teto de 240 KiB por figura. Sem texto dentro do desenho.
5. **Alvos sobre a arte:** cada região declarada é a caixa da coisa no desenho, sem inflar para o fundo; área de toque de 44 pt (0,157 x 0,21 do quadro) por alvo, sem sobreposição; nada que o aluno precisa ver fica sob um marcador; a área certa não cobre a coisa do erro típico do item. Meça por cor no render e escreva os percentuais.
6. **Nunca:** imagem gerada por modelo; arte de terceiros; texto no desenho; mudar o `id`, a pergunta ou a resposta certa de aula (se precisar, relate em destaque); ler PDFs ou qualquer coisa sob `Conteúdo/` ou `conteúdo/`.

## Entregue em `<WS>/<id>/`
- `alvos-da-aula.md` (passo 1); `build.mjs` (gera a cena a partir do kit, rodável de novo); `figura.svg`; `previa.png` e `previa-alvos.png` (960 x 720 sobre #171920; a segunda com as áreas de toque e os marcadores do app); `alvos.json` (regiões declaradas em fração do quadro, com `nome`); `aulas.md` (por interação: alvo da aula → `nome` declarado → coordenadas sugeridas, e toda frase da aula que deixou de ser verdadeira, com a correção mínima); `relatorio.md` (técnica, peso, medidas por cor, o que ficou fraco).
- ABRA cada PNG com a ferramenta de leitura de arquivos e diga o que viu.

Mensagem final (até 8 linhas por cena): alvos cobertos de quantos, peso, o que ficou fraco, o que o integrador precisa mudar nas aulas.

## Lições do lote 2A (valem como o resto do brief)
- **Região = caixa justa do objeto**, nunca do tamanho da área de toque de 44 pt: o app amplia sozinho a área de toque de região pequena (`radiant-app/src/features/lesson-flow/renderers/hotspotTouch.ts`). O mínimo do verificador é 0,08 de largura e de altura, crescendo centrado no objeto.
- **O marcador do app esconde o que está embaixo.** Tocar: selo de 36 x 24 pt no canto superior esquerdo da região. Rotular: círculo de 28 pt (`MARKER` em `LabelStepRenderer`) no centro do ponto. Ponto de rotular fica SOBRE o objeto que nomeia, nunca ao lado. Como a cena é desenho nosso, objeto pequeno que a aula cobra pode ser exagerado no tamanho até o marcador deixar pelo menos metade dele à vista; diga quanto cresceu. Meça quanto o marcador esconde de cada objeto.
- **Enquadramento justo**: recorte o quadro no trecho da cena onde estão os alvos; parede e piso não precisam aparecer inteiros; objeto cobrado o maior possível.
- **Mesmo ponto de vista** nas cenas de uma mesma unidade; código comum em `<WS>/comum/` só se for compartilhado.
- **Frase da aula** que cita objeto da cena (por exemplo "na mesa") continua verdadeira: ponha o objeto na cena, sem cobrir alvo.
