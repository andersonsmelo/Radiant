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
| `transferencia-maca-mesa` | [`transferencia-maca-mesa.mjs`](transferencia-maca-mesa.mjs) | [`.pecas.mjs`](transferencia-maca-mesa.pecas.mjs) e `comum/maca.mjs` | m17-02 i4 (caça ao risco), m17-03 (visual do conceito e i3, tocar) |
| `raio-x-movel-no-leito` | [`raio-x-movel-no-leito.mjs`](raio-x-movel-no-leito.mjs) | [`.pecas.mjs`](raio-x-movel-no-leito.pecas.mjs) | m25-05 i4 (caça ao risco) |
| `trauma-raio-horizontal` | [`trauma-raio-horizontal.mjs`](trauma-raio-horizontal.mjs) | [`.pecas.mjs`](trauma-raio-horizontal.pecas.mjs) e `comum/maca.mjs` | m25-06 (visual do conceito e i2, tocar) |
| `dosimetro-no-corpo` | [`dosimetro-no-corpo.mjs`](dosimetro-no-corpo.mjs) | [`.pecas.mjs`](dosimetro-no-corpo.pecas.mjs) | m21-03 i2 (rotular) e m21-06 i2 (tocar) |
| `produto-dose-area` | [`produto-dose-area.mjs`](produto-dose-area.mjs) | [`.pecas.mjs`](produto-dose-area.pecas.mjs) | m21-04 (visual do conceito) |

| `fluoroscopia-cadeia` | [`fluoroscopia-cadeia.mjs`](fluoroscopia-cadeia.mjs) | [`.pecas.mjs`](fluoroscopia-cadeia.pecas.mjs) e `comum/fluoro.mjs` | m26-02 i2 (rotular) |
| `sala-de-fluoroscopia-espalhada` | [`sala-de-fluoroscopia-espalhada.mjs`](sala-de-fluoroscopia-espalhada.mjs) | [`.pecas.mjs`](sala-de-fluoroscopia-espalhada.pecas.mjs) e `comum/fluoro.mjs` | m26-04 i3 (caça ao risco) |
| `contencao-pediatrica` | [`contencao-pediatrica.mjs`](contencao-pediatrica.mjs) | [`.pecas.mjs`](contencao-pediatrica.pecas.mjs), `comum/ik.mjs` e `comum/campo.mjs` | m27-01 i3 e m27-02 i2 (tocar) |
| `colimacao-pediatrica` | [`colimacao-pediatrica.mjs`](colimacao-pediatrica.mjs) | [`.pecas.mjs`](colimacao-pediatrica.pecas.mjs) e `comum/campo.mjs` | m27-03 i2 (tocar) |
| `idoso-apoios-e-riscos` | [`idoso-apoios-e-riscos.mjs`](idoso-apoios-e-riscos.mjs) | [`.pecas.mjs`](idoso-apoios-e-riscos.pecas.mjs) (barra, banco, degrau, tapete e andador) e `comum/ik.mjs` | m27-04 i4 (caça ao risco), m27-06 i3 (tocar) |
| `gestante-campo-e-feixe` | [`gestante-campo-e-feixe.mjs`](gestante-campo-e-feixe.mjs) | [`.pecas.mjs`](gestante-campo-e-feixe.pecas.mjs) e `comum/campo.mjs` | m27-05 (visual do conceito) |
| `dxa-dois-feixes` | [`dxa-dois-feixes.mjs`](dxa-dois-feixes.mjs) | [`.pecas.mjs`](dxa-dois-feixes.pecas.mjs) e `comum/dxa.mjs` | m30-01 i2 (rotular) e i4 (tocar) |
| `dxa-posicionamento` | [`dxa-posicionamento.mjs`](dxa-posicionamento.mjs) | [`.pecas.mjs`](dxa-posicionamento.pecas.mjs) e `comum/dxa.mjs` | m30-03 i2 (tocar), m30-06 (visual do conceito) |
| `radiografia-veterinaria` | [`radiografia-veterinaria.mjs`](radiografia-veterinaria.mjs) | [`.pecas.mjs`](radiografia-veterinaria.pecas.mjs) e `comum/animal.mjs` (o cão na calha) | m31-01 i2 e m31-02 i2 (tocar) |
| `radiografia-de-objeto` | [`radiografia-de-objeto.mjs`](radiografia-de-objeto.mjs) | [`.pecas.mjs`](radiografia-de-objeto.pecas.mjs) | m31-06 i2 (tocar) |
| `teste-de-feixe` | [`teste-de-feixe.mjs`](teste-de-feixe.mjs) | [`.pecas.mjs`](teste-de-feixe.pecas.mjs) | m32-02 i2 (rotular) |

Compartilhado em `comum/`: `ik.mjs` (alcance do braço da pessoa, para a mão chegar a um ponto), `campo.mjs` (campo de luz do colimador e linha de espalhamento), `fluoro.mjs` (mesa, arco, tubo, receptor, pedal e monitor das duas cenas da m26, mesmo ponto de vista), `dxa.mjs` (ponto de vista e mesa do densitômetro, das duas cenas da m30), `animal.mjs` (o cão numa calha de espuma), `maca.mjs` (a maca do lote 2B, com rodas e bloco do freio, para a transferência e o trauma), `lib.mjs` e `emitir.mjs` (junta as peças e achata o CSS do kit em atributos pelo Chrome), `sala.mjs` (a sala das três cenas da m17: mesmo
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
