# Cenas isométricas da fase 2 (kit da skill `anatomy`)

Cada cena é código que desenha uma figura de radiologia (equipamento e pessoas) em isometria, com o kit de [`../kit/`](../kit/kit.test.mjs).
A cena gera a **fonte versionada** `../fontes/<id>.svg` (quadro 640 x 480, parada, sem texto, só hexadecimais da paleta do kit); o spec do app
sai da fonte por `../build-spec.mjs`, como nas figuras de acervo da fase 1. Brief do construtor de cenas: [`../briefs/cena.md`](../briefs/cena.md).

| id | cena | peças próprias | aulas |
|---|---|---|---|
| `tubo-raios-x` | [`tubo-raios-x.mjs`](tubo-raios-x.mjs) | `comum/tubo-pecas.mjs` | m19-03 (rotular), m19-06 (hotspot) |
| `tubo-emitindo` | [`tubo-emitindo.mjs`](tubo-emitindo.mjs) | `comum/tubo-pecas.mjs` | m19-03 (visual do conceito) |
| `anodo-giratorio` | [`anodo-giratorio.mjs`](anodo-giratorio.mjs) (marcas, pista aquecida e seta no próprio arquivo) | `comum/tubo-pecas.mjs` | m19-04 e m19-06 (visual do conceito) |
| `conferencia-de-identidade` | [`conferencia-de-identidade.mjs`](conferencia-de-identidade.mjs) | [`.pecas.mjs`](conferencia-de-identidade.pecas.mjs) | m17-01 (rotular) |
| `pontos-de-contato-da-sala` | [`pontos-de-contato-da-sala.mjs`](pontos-de-contato-da-sala.mjs) | [`.pecas.mjs`](pontos-de-contato-da-sala.pecas.mjs) | m17-04 (hotspot) |
| `itens-de-emergencia-da-sala` | [`itens-de-emergencia-da-sala.mjs`](itens-de-emergencia-da-sala.mjs) | [`.pecas.mjs`](itens-de-emergencia-da-sala.pecas.mjs) | m17-05 (rotular), m17-06 (hotspot) |
| `transferencia-maca-mesa` | [`transferencia-maca-mesa.mjs`](transferencia-maca-mesa.mjs) | [`.pecas.mjs`](transferencia-maca-mesa.pecas.mjs) e `comum/maca.mjs` | m17-02 (visual do conceito), m17-01 (caça ao risco) e m17-02 (hotspot) |
| `raio-x-movel-no-leito` | [`raio-x-movel-no-leito.mjs`](raio-x-movel-no-leito.mjs) | [`.pecas.mjs`](raio-x-movel-no-leito.pecas.mjs) | m25-04 (caça ao risco) |
| `trauma-raio-horizontal` | [`trauma-raio-horizontal.mjs`](trauma-raio-horizontal.mjs) | [`.pecas.mjs`](trauma-raio-horizontal.pecas.mjs) e `comum/maca.mjs` | m25-05 (hotspot) |
| `dosimetro-no-corpo` | [`dosimetro-no-corpo.mjs`](dosimetro-no-corpo.mjs) | [`.pecas.mjs`](dosimetro-no-corpo.pecas.mjs) | m21-03 (rotular) e m21-06 (hotspot) |
| `produto-dose-area` | [`produto-dose-area.mjs`](produto-dose-area.mjs) | [`.pecas.mjs`](produto-dose-area.pecas.mjs) | m21-04 (visual do conceito) |

Compartilhado em `comum/`: `maca.mjs` (a maca do lote 2B, com rodas e bloco do freio, para a transferência e o trauma), `lib.mjs` e `emitir.mjs` (junta as peças e achata o CSS do kit em atributos pelo Chrome), `sala.mjs` (a sala das três cenas da m17: mesmo
ponto de vista, parede, piso e porta), `tubo-pecas.mjs` e `tubo-base.mjs` (a ampola de raios X das três cenas da m19: mesma geometria nas três).

## Como regenerar

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
node scripts/content/figuras/cenas/<id>.mjs                 # escreve scripts/content/figuras/fontes/<id>.svg
node scripts/content/figuras/build-spec.mjs <id>            # fonte -> spec em radiant-app/src/ui/diagrams/specs/<id>.ts
node --test scripts/content/figuras/cenas/cenas.test.mjs    # cada cena regenera a fonte versionada byte a byte e passa nas réguas
node --test scripts/content/figuras/kit/kit.test.mjs        # cada peça do kit passa nas réguas e na paleta
```

**O que precisa estar na máquina.** Node 20 e o Chrome (o `achatar` do kit resolve o CSS pelo Chrome headless). A geometria isométrica da skill `anatomy` (`iso-kit.mjs`, `lathe.mjs`, `tube.mjs`) vem copiada, sem alteração, em [`../kit/vendor/anatomy/`](../kit/vendor/anatomy/README.md); nenhum arquivo fora do repositório é lido. O Chrome é o de `findChrome()` (respeita `CHROME_PATH`, o mesmo do conversor e dos testes). Sem Chrome, `cenas.test.mjs` pula com a razão dita; o CI não roda esta pasta (o glob dele é `scripts/content/*.test.mjs`).

## Decisões de arte que os alvos e as aulas já assumem

- **Parada.** Decisão do dono de 2026-11-20: figura de movimento entra parada (`tubo-emitindo` e `anodo-giratorio` deixaram de ser laços). O giro do ânodo se lê pela seta, pelas marcas radiais e pelo trecho aquecido da pista.
- **Ângulo do alvo do ânodo exagerado para 22 graus** (o real vai de 7 a 17), para o bisel aparecer no tamanho do app; dimensões do tubo esquemáticas (ampola de 41 cm contra 30 a 35 reais).
- **Objetos pequenos das cenas da m17 maiores que o real, de propósito**, para o ponto de 12 pt do rotular e o selo (36 x 24 pt) do app esconderem menos: pulseira, folha, tela, maçaneta, barra de apoio, manopla, teclado e as placas de oxigênio, botão e telefone (quanto cada um cresceu está em [`docs/evidence/2026-11-19-figuras/lote-2A.md`](../../../../docs/evidence/2026-11-19-figuras/lote-2A.md)).
- **Cenas do lote 2B parados também e com objetos maiores que o real, de propósito:** rodas e blocos do freio (transferência), cabeçote, colimador e detector (leito e trauma), dosímetros (6 a 8 vezes) e câmara dose-área; os números estão em [`docs/evidence/2026-11-19-figuras/lote-2B.md`](../../../../docs/evidence/2026-11-19-figuras/lote-2B.md). A sala não é desenhada nas cenas do leito e do trauma.
- **Regiões declaradas** em `content-manifest/rtg-2026/figuras/<id>.alvos.json` = caixa justa do objeto no desenho (mínimo de 0,08 por eixo), nunca do tamanho da área de toque nem esticada para o fundo.
