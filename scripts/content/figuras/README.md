# Conversor de figuras importadas

Transforma um SVG de acervo ou de gerador externo no spec de `radiant-app/src/ui/diagrams/specs/`,
só com o que o `SvgXml` aceita (atributos de apresentação, sem `<style>`, classe, filtro nem `vector-effect`).

- `fontes/<id>.svg`: a entrada versionada. Crânio: domínio público (LadyofHats, Wikimedia Commons). Cena do leito: obra do projeto.
- `convert.mjs`: `convertSvg(texto, opções)`. Usa o Chrome headless para resolver o CSS em valores computados.
  Acha o Chrome em `CHROME_PATH` ou nos caminhos comuns do macOS e do Linux. O relatório (`report.filters`) lista cada `filter` removido: é a perda visível.
- `build-spec.mjs`: `node scripts/content/figuras/build-spec.mjs [id...]` regenera os specs. Figura nova entra em `FIGURES`.
- `convert.test.mjs`: `node --test scripts/content/figuras/*.test.mjs`. Sem Chrome (o CI não tem), os testes pulam com a razão dita.

Os specs são saída do script: não se editam à mão. Teto de 240 KiB de SVG por figura, quadro 320 x 240, de 1 a 8 camadas (réguas em `diagramRegistry.test.ts`).
