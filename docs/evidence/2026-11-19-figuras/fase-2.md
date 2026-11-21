# Fase 2: cenas isométricas do kit (22 figuras, medido em 2026-11-21)

Fase 2 do [plano de troca das figuras](../../superpowers/plans/2026-11-19-troca-das-figuras.md), executada em 2026-11-20 e 21 na branch `claude/figuras-fase-1` (PR #97, rascunho, sem merge). Equipamento e cena de sala deixaram de ser SVG escrito por modelo: as 22 cenas são código que usa o kit isométrico em `scripts/content/figuras/kit/` (geometria da skill `anatomy`, MIT, copiada em `kit/vendor/anatomy/`). Origem `anatomy` em `figuras.json`, autor Radiant, sem licença de terceiro.

## O que mudou além das figuras

- **A pessoa do kit** (R1 e R17 do controlador): tronco contínuo, ombros no tronco, joelho e quadril que dobram. É um módulo só, `kit/pessoa.mjs`. As cópias locais dos construtores (cabeça da criança deitada, tronco curvo, controle de pernas e pé) foram fundidas nele, e as cenas já integradas continuaram regenerando byte a byte.
- **Selo e marcador do app fora do objeto** (R14, R15, E11 a E13): o selo do número fica fora da região e fora da área de toque dos outros alvos, posicionado em conjunto; o ponto de rotular passou a 12 pt, com o número num selo ao lado; tocar no selo seleciona o alvo dono. Vale para todas as figuras do app, não só as 22. Cada asserção nova foi vista falhando; o resumo está em [lote 2A](lote-2A.md).
- **Região = caixa justa do objeto.** Nenhuma região foi inflada para a área de toque de 44 pt.
- **Movimento entra parado** (decisão do dono de 2026-11-20): `tubo-emitindo`, `anodo-giratorio` e `raio-x-movel-no-leito` deixaram de ser laços.

## As 22 cenas

Peso é o do spec gerado, em KiB, medido na integração do lote. Todas foram vistas no simulador de iPhone em 2026-11-20 e 21 (capturas em [`capturas/`](capturas/ios-tubo-raios-x-m19-aula03-passo4.jpg) e nos blocos "Capturas no iPhone" de cada lote). Nenhuma foi vista no Android, num aparelho físico ou com VoiceOver.

| id | unidade | lote | peso (KiB) | iPhone |
| --- | --- | --- | --- | --- |
| `tubo-raios-x` | m19 | 2A | 18,1 | sim |
| `tubo-emitindo` | m19 | 2A | 19,6 | sim |
| `anodo-giratorio` | m19 | 2A | 16,4 | sim |
| `conferencia-de-identidade` | m17 | 2A | 59,5 | sim |
| `pontos-de-contato-da-sala` | m17 | 2A | 45,2 | sim |
| `itens-de-emergencia-da-sala` | m17 | 2A | 30,7 | sim |
| `transferencia-maca-mesa` | m17 | 2B | 57,5 | sim |
| `raio-x-movel-no-leito` | m25 | 2B | 127,7 | sim |
| `trauma-raio-horizontal` | m25 | 2B | 70,1 | sim |
| `dosimetro-no-corpo` | m21 | 2B | 38,5 | sim |
| `produto-dose-area` | m21 | 2B | 48,6 | sim |
| `fluoroscopia-cadeia` | m26 | 2C | 69,9 | sim |
| `sala-de-fluoroscopia-espalhada` | m26 | 2C | 95,8 | sim |
| `contencao-pediatrica` | m27 | 2C | 91,5 | sim |
| `colimacao-pediatrica` | m27 | 2C | 58 | sim |
| `idoso-apoios-e-riscos` | m27 | 2C | 49,5 | sim |
| `gestante-campo-e-feixe` | m27 | 2C | 34,6 | sim |
| `dxa-dois-feixes` | m30 | 2D | 33,6 | sim |
| `dxa-posicionamento` | m30 | 2D | 57,8 | sim |
| `radiografia-veterinaria` | m31 | 2D | 101,1 | sim |
| `radiografia-de-objeto` | m31 | 2D | 65,7 | sim |
| `teste-de-feixe` | m32 | 2D | 32,3 | sim |

Soma do peso das 45 figuras importadas ao fim do 2CD: 4.132.420 bytes, contra o teto de 8.116.109 do teste do registro (que não mudou). Nenhuma cena passa de 240 KiB.

## Revisão e correções

Cada lote teve integração, gate completo, revisor independente (modelo mais capaz, sem o relatório do controlador), correções, novo gate, `loop validate` 15 de 15 e capturas. Resultado dos pareceres: 2A, 5 aprovadas e 1 com correções, 0 crítico, 2 importantes; 2B, 3 aprovadas e 2 com correções, 0 crítico, 1 importante (maca em linha, não ao lado); 2CD, 6 aprovadas e 5 com correções, 0 crítico, 3 importantes (banco no caminho do idoso, saiote na ponta da mesa contra o checkpoint "lateral", V largo das pernas no DXA do fêmur). Todos os importantes foram corrigidos e as prévias refeitas.

## Evidência por lote

- [Lote 2A](lote-2A.md), parecer em [`revisoes/2A.md`](revisoes/2A.md), medidas em [`lote-2A/medidas.md`](lote-2A/medidas.md).
- [Lote 2B](lote-2B.md), parecer em [`revisoes/2B.md`](revisoes/2B.md), medidas em [`lote-2B/medidas.md`](lote-2B/medidas.md).
- [Lote 2CD](lote-2CD.md) (os lotes 2C e 2D integrados juntos), parecer em [`revisoes/2CD.md`](revisoes/2CD.md), medidas em [`lote-2CD/medidas.md`](lote-2CD/medidas.md).
- Lote 2D: está dentro do [lote 2CD](lote-2CD.md): m30 (DXA), m31 (veterinária e objeto) e m32 (teste de feixe).

## Limites aceitos e registrados

- Objetos pequenos são maiores no desenho que no real, de propósito, para o selo e o marcador esconderem menos (R12). O ângulo do alvo do ânodo está exagerado (22 graus; o real é de 7 a 17). Cada lote diz quais.
- A vista da m26 e a do `dxa-posicionamento` diferem das outras da mesma unidade, para as áreas de toque não se sobreporem.
- A pessoa do kit é aceita pelo controlador por delegação do dono; o aceite dele continua pendente ([ADR, adendo de 2026-11-21](../../adr/ADR-2026-11-19-figuras-por-tipo.md)).
