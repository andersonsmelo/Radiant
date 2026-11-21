# Lote 2CD: onze figuras isométricas das unidades m26, m27, m30, m31 e m32 (2026-11-20)

Integração dos lotes 2C e 2D da fase 2 da troca das figuras (cenas com o kit isométrico, origem `anatomy`). Quem integrou: o integrador do lote 2CD, em 2026-11-20, à noite. Decisões H1 a H6 em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/decisoes-2CD.md`; continuam valendo E0, E3, E4, E6, E7, E12 e E13 de `decisoes-2A.md`. Medidas por cor em [`lote-2CD/medidas.md`](lote-2CD/medidas.md); prévias com os marcadores do app em `lote-2CD/<id>.png`.

## Figuras que entraram (11)

Todas são arte própria do projeto (autor Radiant, sem licença de terceiro), desenhadas em código com o kit do repositório; a fonte é `scripts/content/figuras/fontes/<id>.svg`, gerada pela cena `scripts/content/figuras/cenas/<id>.mjs`, e o spec sai dela por `build-spec.mjs`. Página de origem: não se aplica.

| figura | onde aparece | fonte (KiB) | spec (KiB) | prévia |
|---|---|---|---|---|
| `fluoroscopia-cadeia` | m26-02 i2 (rotular) | 71,5 | 68,1 | [`lote-2CD/fluoroscopia-cadeia.png`](lote-2CD/fluoroscopia-cadeia.png) |
| `sala-de-fluoroscopia-espalhada` | m26-04 i3 (caça ao risco) | 100,5 | 95,8 | [`lote-2CD/sala-de-fluoroscopia-espalhada.png`](lote-2CD/sala-de-fluoroscopia-espalhada.png) |
| `contencao-pediatrica` | m27-01 i3 e m27-02 i2 (tocar) | 95,6 | 91,5 | [`lote-2CD/contencao-pediatrica.png`](lote-2CD/contencao-pediatrica.png) |
| `colimacao-pediatrica` | m27-03 i2 (tocar) | 60,5 | 58 | [`lote-2CD/colimacao-pediatrica.png`](lote-2CD/colimacao-pediatrica.png) |
| `idoso-apoios-e-riscos` | m27-04 i4 (caça ao risco) e m27-06 i3 (tocar) | 52,9 | 50,2 | [`lote-2CD/idoso-apoios-e-riscos.png`](lote-2CD/idoso-apoios-e-riscos.png) |
| `gestante-campo-e-feixe` | m27-05 (visual do conceito) | 36,4 | 34,6 | [`lote-2CD/gestante-campo-e-feixe.png`](lote-2CD/gestante-campo-e-feixe.png) |
| `dxa-dois-feixes` | m30-01 i2 (rotular) e i4 (tocar) | 35,4 | 33,6 | [`lote-2CD/dxa-dois-feixes.png`](lote-2CD/dxa-dois-feixes.png) |
| `dxa-posicionamento` | m30-03 i2 (tocar) e m30-06 (visual do conceito) | 60,8 | 58,1 | [`lote-2CD/dxa-posicionamento.png`](lote-2CD/dxa-posicionamento.png) |
| `radiografia-veterinaria` | m31-01 i2 e m31-02 i2 (tocar) | 106,3 | 101,1 | [`lote-2CD/radiografia-veterinaria.png`](lote-2CD/radiografia-veterinaria.png) |
| `radiografia-de-objeto` | m31-06 i2 (tocar) | 69,3 | 65,7 | [`lote-2CD/radiografia-de-objeto.png`](lote-2CD/radiografia-de-objeto.png) |
| `teste-de-feixe` | m32-02 i2 (rotular) | 34,2 | 32,3 | [`lote-2CD/teste-de-feixe.png`](lote-2CD/teste-de-feixe.png) |

Nenhuma passa de 240 KiB (a maior, a veterinária, tem 108,9 KiB de fonte). Sem texto, imagem, filtro, máscara, recorte, `use`, padrão, classe, `var(` ou `style` no desenho; só hexadecimais da paleta do kit. O spec renderizado sobre #171920 é idêntico à fonte, pixel a pixel, nas onze (0 pixels diferentes; 0 acima de 40/255). Cada cena regenera a fonte versionada byte a byte (`cenas.test.mjs`, agora com 22 cenas) e as onze fontes são iguais, byte a byte, aos `figura.svg` que os construtores entregaram.

## A pessoa única do kit (H2)

As duas cópias locais da pessoa (`lote-2C/comum/pessoa-local.mjs` e `lote-2D/comum/pessoa-d.mjs`) foram fundidas em `scripts/content/figuras/kit/pessoa.mjs`, sem cópia local:

- **Do 2C:** a cabeça da criança (comprimento do perfil escalado por 0,82 e raio por 0,7, em vez de só pelo K da criança, que a deixava comprida e fina na deitada), `opt.curva` (inclina o tronco em pé para a frente, em graus) e `opt.cabelo` (classe do cabelo; cabelo branco da pessoa do idoso).
- **Do 2D:** `opt.perna[sd] = { thigh, shin, toe }` (vetores para dobrar o quadril e o joelho e girar o pé), `opt.extras` (peças que entram na ordenação por profundidade, como a faixa e o posicionador) e `opt.saida.pernas[sd]` (devolve os pontos da perna para as cenas colarem a faixa).
- **As cenas antigas continuaram idênticas:** as onze cenas dos lotes 2A e 2B regeneram as fontes byte a byte depois da fusão (`cenas.test.mjs`, 11 de 11), e o `kit.test.mjs` passa inteiro. Nenhuma delas usa criança nem as opções novas; sem as opções, o código de antes roda igual.
- **Teste novo** em `kit.test.mjs`: a cabeça da criança deitada tem a proporção comprimento/largura do adulto (dentro de 25 %) e é menor que a dele (e maior que 60 % da largura). Visto falhando antes, com o defeito específico (cabeça da criança sem escala própria): a execução vermelha está em `.superpowers/sdd/2026-11-20-figuras-fases-2-6/vermelho-2CD.txt` (proporção da criança 2,27 contra 1,21 do adulto; com a fusão, 1,40).

## Itens alterados

Nenhuma pergunta, nenhum rótulo, nenhuma resposta certa e nenhum retorno de acerto ou de erro mudou. Em cada interação que usa as figuras, os pontos e as regiões foram para a caixa do objeto novo, com o campo `alvo` preso à região declarada (`content-manifest/rtg-2026/figuras/<id>.alvos.json`, com `rotulos` onde o texto da aula difere do nome declarado). Antes e depois de cada coordenada: `.superpowers/sdd/2026-11-20-figuras-fases-2-6/itens-alterados-2CD.md`.

| item | figura | o que mudou |
|---|---|---|
| m26/m26-02/i2 | `fluoroscopia-cadeia` | 4 pontos com coordenada nova e `alvo` |
| m26/m26-04/i3 | `sala-de-fluoroscopia-espalhada` | 4 regiões com coordenada nova e `alvo` |
| m27/m27-01/i3 | `contencao-pediatrica` | 4 regiões com coordenada nova e `alvo` |
| m27/m27-02/i2 | `contencao-pediatrica` | 5 regiões com coordenada nova e `alvo` |
| m27/m27-03/i2 | `colimacao-pediatrica` | 4 regiões com coordenada nova e `alvo` |
| m27/m27-04/i4 | `idoso-apoios-e-riscos` | 5 regiões com coordenada nova e `alvo` |
| m27/m27-06/i3 | `idoso-apoios-e-riscos` | 5 regiões com coordenada nova e `alvo` |
| m30/m30-01/i2 | `dxa-dois-feixes` | 5 pontos com coordenada nova e `alvo` |
| m30/m30-01/i4 | `dxa-dois-feixes` | 4 regiões com coordenada nova e `alvo` |
| m30/m30-03/i2 | `dxa-posicionamento` | 5 regiões com coordenada nova e `alvo` |
| m31/m31-01/i2 | `radiografia-veterinaria` | 4 regiões com coordenada nova e `alvo` |
| m31/m31-02/i2 | `radiografia-veterinaria` | 4 regiões com coordenada nova e `alvo` |
| m31/m31-06/i2 | `radiografia-de-objeto` | 6 regiões com coordenada nova e `alvo` |
| m32/m32-02/i2 | `teste-de-feixe` | 5 pontos com coordenada nova e `alvo` |

Cinco frases de localização, pela decisão H4 (correção mínima):

1. m26-02 i2, `where` do "Pedal": "pés da silhueta" → "pés de quem opera".
2. m26-04, corpo do conceito: "saiote preso à lateral da mesa" → "saiote preso à borda da mesa, voltado para o operador".
3. m30-03 i2, enunciado: "Na vista de cima, toque no pé…" → "Na cena da direita, toque no pé…".
4. m31-01 i2, enunciado: "Para que ninguém fique junto do feixe, a equipe pôs apoios no cão." → "Para que as mãos fiquem fora do feixe, a equipe pôs apoios no cão."
5. m31-06 i4, opção: "Cordão em volta da área isolada" → "Cordão marcando o limite da área isolada" (mesmo gabarito).

Os `alt` dos onze specs descrevem forma, sem nomear resposta, e cabem no limite de 160 caracteres do registro.

## Pontos de rotular movidos pela regra E12

Em três rotulares, um selo caía na área de toque de outro ponto (DXA: 1; teste de feixe: 3). Os pontos foram movidos entre pixels do próprio objeto (máscara do objeto, afastada 3 px da borda; 1 px nas linhas finas do feixe), o mais perto possível dos pontos do construtor, até nenhum selo cair em área alheia: m30-01 i2, detector (0,5475; 0,3558) → (0,5563; 0,2958) e feixe (0,5427; 0,5639) → (0,5422; 0,5125); m32-02 i2, tubo, colimador e lâminas por até 8 pt. O ponto do feixe continua sobre uma das duas linhas do feixe (conferido pelo `ponto_sobre_peca` da medida).

## Figuras fora do lote

Nenhuma: as onze entraram.

## Desvios aceitos pelo controlador (H5), registrados

- Vista da m26 (azimute 112) e da `dxa-posicionamento` (vista dos pés, azimute 20) diferem das outras da mesma unidade, para as áreas de toque não se sobreporem.
- Pernas da paciente do fêmur em V largo (cerca de 19,5 graus cada) e giro do pé exagerado (34 graus), pelo mesmo motivo.
- A pessoa do idoso é adulta, de cabelo branco, com o tronco inclinado 14 graus; o kit só tem adulto e criança.
- A `gestante-campo-e-feixe` aparece só como `concept.visual` (m27-05).

## Números

Node 20.20.2, árvore com só o trabalho deste lote.

- **Verificador** (`rtg-lesson-lint.mjs`) nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs` e `--check`: ok (40 unidades, gerador e --check). `generate-rtg-maestro.mjs` m26, m27, m30, m31, m32 e `--check`: ok (10 fluxos, gerador e --check). `figuras-no-simulador.mjs` com os 45 ids importados e `--check` sem ids: ok (gerador com os 45 ids e `--check` sem ids); 15 roteiros novos, todos na lista do run.
- **`node --test`** (`scripts/content/*.test.mjs`, `scripts/qa/*.test.mjs`, `scripts/content/figuras/*.test.mjs`, `kit/*.test.mjs`, `cenas/*.test.mjs`): 514 testes, 512 passam, 1 falha alheia conhecida (`registerSource normalizes metadata for the pilot book`) e 1 pulado (o teste "sem Chrome", que só vale sem Chrome); inclui as 22 cenas e o teste novo da cabeça da criança.
- **Jest** (`src/ui/diagrams`, `src/features/lesson-flow`, `src/features/student-checkpoints`, `--runInBand`, `EXPO_NO_DOTENV=1`): 66 suítes, 1608 testes, todos passam (inclui o registro de diagramas: 513 testes só em `src/ui/diagrams`).
- `tsc --noEmit`: código de saída 0. `eslint` nos 16 arquivos TypeScript tocados (11 specs, 5 lotes): código de saída 0. `npm run test:maestro-contract`: 13 de 13, código de saída 0. `copy-style-contract.test.mjs`: 65 de 65 (`copy-style-contract.test.mjs`).
- **Peso:** a soma do SVG das 45 figuras importadas é 4.132.420 bytes (4.035,6 KiB) contra o teto de 8.116.109 do teste do registro (folga de 3.983.689); as onze novas somam 688,9 KiB.

## Objetos que ficam mais de 50 % escondidos pelo selo ou pelo ponto

Nenhum nas quatorze interações. Maior valor: 24,8 % (ponto de 12 pt sobre a fonte de raios X do DXA, rotular); o selo cobre no máximo 11,6 % do objeto do próprio alvo (o receptor da fluoroscopia, no rotular). Tabelas completas em `lote-2CD/medidas.md`.

## Incertezas

- **Rotular do DXA, "Feixe":** a área de toque de 44 pt ao redor do ponto mostra 6 % de feixe e 60,9 % do corpo da paciente (objeto do ponto "Paciente"); o feixe é uma linha de 4 px. Não é uma escolha entre respostas, e as áreas de toque não se sobrepõem, mas é a parte mais fraca do lote.
- **Objetos pequenos e finos:** triângulo de aviso (5,4 % de objeto na área de toque; 80 % de fundo) e cordão (11,3 %), na radiografia de objeto, mãos de luva (4 %) na veterinária, barra de apoio (9,6 %). São a caixa justa do objeto, sem inflar; a área de toque de 44 pt é o mínimo do app.
- **Colimação pediátrica:** tórax e abdome da criança da direita usam o núcleo mínimo de 0,08 x 0,08 no centro de cada parte (as caixas inteiras ficariam a menos de 44 pt uma da outra); quem toca na borda do tórax erra por poucos pontos.
- **Sem receptor de imagem** no teste de feixe (a aula tem "Receptor de imagem" como distrator, e a cena não tem receptor nem o mostra como alvo).
- **"lateral da mesa"** continua em três trechos da m26-04 (opção do checkpoint e dois retornos): a decisão H4 só corrige o trecho do corpo; mexer na opção seria mexer numa resposta (lista em `itens-alterados-2CD.md`).
- As cenas foram vistas só no Chrome; nenhuma captura no simulador (fora do escopo do integrador).
