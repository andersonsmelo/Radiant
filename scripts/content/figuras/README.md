# Conversor de figuras importadas

Transforma um SVG de acervo ou de gerador externo no spec de `radiant-app/src/ui/diagrams/specs/`,
só com o que o `SvgXml` aceita (atributos de apresentação, sem `<style>`, classe, filtro nem `vector-effect`).

- `fontes/<id>.svg`: a entrada versionada. Crânio: domínio público (LadyofHats, Wikimedia Commons). A cena do leito (obra do projeto, feita com a `anatomy`) saiu do app em 2026-11-19 e volta refeita na fase 2; a fonte do piloto fica fora do repositório.
- `kit/` e `cenas/` (fase 2): cenas isométricas desenhadas em código, para equipamento e pessoas de radiologia. `kit/` é o kit da skill `anatomy` (peças e pessoa, com `kit.test.mjs`); `cenas/<id>.mjs` gera `fontes/<id>.svg`, e o spec sai dela por `build-spec.mjs`, como nas figuras de acervo. Origem `anatomy` em `figuras.json`. Como regenerar e o que a máquina precisa ter: [`cenas/README.md`](cenas/README.md). Entraram no lote 2A: `tubo-raios-x`, `tubo-emitindo`, `anodo-giratorio`, `conferencia-de-identidade`, `pontos-de-contato-da-sala` e `itens-de-emergencia-da-sala`.
- `convert.mjs`: `convertSvg(texto, opções)`. Usa o Chrome headless para resolver o CSS em valores computados.
  Acha o Chrome em `CHROME_PATH` ou nos caminhos comuns do macOS e do Linux. O relatório (`report.filters`) lista cada `filter` removido: é a perda visível.
- `build-spec.mjs`: `node scripts/content/figuras/build-spec.mjs [id...]` regenera os specs. Figura nova entra em `FIGURES`.
- `convert.test.mjs`: testes que precisam do Chrome (as transformações do CSS e a regeneração idêntica dos specs). **O CI não os roda**: a regeneração pode sair diferente no Chrome do Linux, e isso não foi medido. Sem Chrome, eles pulam com a razão dita.
- `../figuras-conversor-puro.test.mjs`: a parte pura (gradientes e falhas do Chrome, com Chrome falso). Esse o CI roda, pelo glob `scripts/content/*.test.mjs`.

**Portão de cada lote de figuras:** `node --test scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`, numa máquina com Chrome, antes do commit. Falha aí quer dizer spec editado à mão ou conversor que mudou a saída.

Os specs são saída do script: não se editam à mão. Teto de 240 KiB de SVG por figura, quadro 320 x 240, de 1 a 8 camadas (réguas em `diagramRegistry.test.ts`).

## Briefs dos agentes de um lote

Um lote de figuras de acervo roda com agentes separados para arte, integração, revisão independente e capturas. Os briefs, consolidados em 2026-11-20 com as lições dos lotes 1A a 1E, estão em [`briefs/`](briefs/arte.md): [`arte.md`](briefs/arte.md), [`integrador.md`](briefs/integrador.md), [`revisor.md`](briefs/revisor.md) e [`capturas.md`](briefs/capturas.md); para as cenas isométricas da fase 2, o brief do construtor é [`cena.md`](briefs/cena.md). O passo a passo do lote, as decisões do dono e os erros que se repetiram estão em [`docs/superpowers/plans/2026-11-20-figuras-continuidade.md`](../../../docs/superpowers/plans/2026-11-20-figuras-continuidade.md).
