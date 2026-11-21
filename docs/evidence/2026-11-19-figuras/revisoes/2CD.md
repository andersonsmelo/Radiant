# Revisão independente dos lotes 2C e 2D, integrados juntos (2026-11-20)

Esta revisão foi feita por IA, e não por um profissional de radiologia. Ela cobre os commits `28960c6d`, `497867e3` e `8cf2d3b9`, sobre a base `6990a6af`. Li tudo pelo git e testei numa worktree destacada em `8cf2d3b9`, com link simbólico de `radiant-app/node_modules`; a worktree foi removida ao fim.

Li o brief do revisor (`scripts/content/figuras/briefs/revisor.md`), o do construtor (`cena.md`), os pareceres do 2A e do 2B, as decisões H1 a H6 (`decisoes-2CD.md`) e, de `decisoes-2A.md`, E0, E3, E4, E6, E7, E12 e E13. A licença de terceiro não se aplica: as onze figuras são arte própria, gerada em código pelo kit do repositório. A fidelidade foi conferida como fidelidade da fonte à cena que a gera.

**Como medi.** Os renders são meus, pelo Chrome, a 840 x 630 px (o quadro de 280 x 210 pt a 3x), sobre #171920:
- **por peça:** para cada peça da cena (`pecas()` de `cenas/<id>.pecas.mjs`), rendi a cena achatada SEM ela. A peça é visível num pixel quando esse render difere do completo (limiar 6/255). O que fica sob camada translúcida conta para as duas peças;
- **trecho do corpo** (pernas, cabeça, pescoço, mão, pé, tórax): a peça recortada pela região declarada;
- **posições do app:** `touchRect`, `badgeBoxes`, `labelBadgeBoxes` e `LABEL_DOT` de `hotspotTouch.ts`, carregados por `load-app-contract.cjs`.

Os scripts ficaram no meu rascunho, fora do repositório.

## Gates (worktree em `8cf2d3b9`, Node 20.20.2)

- `rtg-lesson-lint.mjs` arquivo por arquivo nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: ok. `figuras-no-simulador.mjs --check`: ok, com 54 roteiros.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`:
  - 514 testes: 512 passam, 1 é pulado e 1 falha;
  - a falha é a conhecida (`registerSource normalizes metadata for the pilot book`);
  - `cenas.test.mjs` cobre as 22 cenas, todas verdes, inclusive as 11 dos lotes 2A e 2B;
  - o teste novo da cabeça da criança passa.
- App, em `radiant-app`:
  - `EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/diagrams src/features/student-checkpoints src/features/settings src/features/lesson-flow`: 68 suítes e 1635 testes, todos passam;
  - `npx tsc --noEmit`: 0;
  - `npx eslint` nos 11 specs e nos 5 lotes: 0;
  - `npm run test:maestro-contract`: 13 de 13. `test:copy-style-contract`: 65 de 65;
  - `EXPO_NO_DOTENV=1 npm run visual:qa:strict`: passa, com 0 regressões.
  - Não rodei o `npm run quality` inteiro.
- **Reprodutibilidade.** No checkout limpo, rodei as 11 cenas e `build-spec.mjs` sem id (todas as fontes). `git status` só mostrou o link de `node_modules`.
- **Fonte, spec e render.**
  - O render do spec (`diagramSvgAt`) contra o da fonte: **0 pixel diferente** nas onze, sem limiar.
  - A cena remontada peça por peça e achatada contra a fonte: 0 pixel.
  - As onze fontes são idênticas, byte a byte, aos `figura.svg` dos construtores (`lote-2C/<id>/` e `lote-2D/<id>/`). Como os construtores geraram com as cópias locais da pessoa, a fusão reproduz o que elas faziam.
- **Selos (E12) em 280, 320 e 358 pt**, nas quatorze interações:
  - nenhum selo sai do quadro;
  - nenhum fica sobre o próprio alvo;
  - nenhum cai sobre a área de toque, a região, o ponto ou o selo de outro alvo;
  - nenhuma área de toque se sobrepõe a outra do mesmo item.
- **Regiões das aulas.** Todas são iguais às declaradas no `alvos.json`. Todo ponto de rotular fica dentro da sua região declarada e com o centro sobre o objeto.
- **Escopo (H6).** Os 105 arquivos mudados estão todos em `arquivos-do-run-2CD.txt`. `docs/STATUS.md`, os planos e a ADR não foram tocados.

## Vereditos

| Figura | Veredito |
|---|---|
| `fluoroscopia-cadeia` (m26-02 i2, rotular) | Aprovada (achados 2, compartilhado, e 10, menores para esta figura) |
| `sala-de-fluoroscopia-espalhada` (m26-04 i3, caça ao risco) | **Aprovada com correções a fazer** (achado 2, importante; 9, 12, 14 e 15) |
| `contencao-pediatrica` (m27-01 i3, m27-02 i2) | **Aprovada com correções a fazer** (achado 4; 9) |
| `colimacao-pediatrica` (m27-03 i2) | Aprovada (achado 13, opcional) |
| `idoso-apoios-e-riscos` (m27-04 i4, m27-06 i3) | **Aprovada com correções a fazer** (achado 1, importante; 8) |
| `gestante-campo-e-feixe` (m27-05, visual) | Aprovada (achado 13, opcional) |
| `dxa-dois-feixes` (m30-01 i2 e i4) | **Aprovada com correções a fazer** (achados 5 e 6, menores) |
| `dxa-posicionamento` (m30-03 i2, m30-06 visual) | **Aprovada com correções a fazer** (achado 3, importante, aceito por H5: decisão do dono) |
| `radiografia-veterinaria` (m31-01 i2, m31-02 i2) | Aprovada |
| `radiografia-de-objeto` (m31-06 i2) | Aprovada (achado 13, opcional) |
| `teste-de-feixe` (m32-02 i2) | Aprovada (achado 10, menor) |

Contagem: 0 críticos, 3 importantes e 12 menores.

## Achados

### 1. Importante: no idoso, o banco está no caminho até o andador, e o retorno diz que não está
`scripts/content/figuras/cenas/idoso-apoios-e-riscos.pecas.mjs:57`:
- a pessoa está em (−116, −34) e o andador em x 126 a 170, y −74 a −36;
- o caminho reto entre os dois corre em y de −34 a −55, com uma faixa de ~45 cm para o corpo;
- o banco ocupa x −60 a −20 e y −54 a −28. Está **inteiro** dentro dessa faixa, a 60 cm dela;
- o degrau (y −14 a 16) fica ~8 cm fora da faixa, do lado do espectador;
- o tapete (y −34 a 0) só encosta na borda dela, e o canto levantado, em (116, 0), é o canto mais longe do caminho.

No render, a linha dos pés dela até os pés do andador passa sobre o banco. O degrau e o tapete ficam abaixo dela, mais perto de quem olha.

O retorno do banco, na m27-04 i4 (item `criticalSafety`), diz: "O banco está ao lado, fora do caminho dela: aqui ele não é obstáculo." O desenho mostra o contrário.

**Cenário para o aluno:** ele aplica a regra da aula ("caminho sem obstáculo"), marca o banco, que está entre ela e o andador, e recebe "errado". Ao mesmo tempo, o degrau e o tapete que ele deve marcar estão fora da rota.

**Correção:**
- trocar o banco e os obstáculos de lugar: degrau e tapete na linha entre a pessoa e o andador, com o canto solto do tapete voltado para a rota. Por exemplo, degrau em x −40 a 6, y −62 a −32, e tapete em x 30 a 80, y −70 a −36, canto levantado em (30, −36);
- o banco do outro lado do receptor (x ≈ −200), encostado na parede, e o quadro reenquadrado;
- refazer as cinco regiões das duas aulas, as medidas e a prévia.

Nenhuma pergunta nem resposta certa muda.

### 2. Importante: na fluoroscopia, o operador está no pé da mesa e o saiote pende da ponta, e o checkpoint da mesma aula ensina "lateral"
`scripts/content/figuras/cenas/comum/fluoro.mjs:18-23` e `:93-98`:
- o operador fica em x = 160, 50 cm além do fim do tampo (x = 110), olhando para a cabeça do paciente;
- o saiote fica em x = 111, na ponta da mesa;
- o `figuras.json` registra isso: "O operador fica no fim da mesa, e não ao lado, para o leque correr ao longo do eixo da mesa".

Na prática, quem opera fica **ao lado** da mesa, e o saiote plumbífero pende da **lateral** do tampo, do lado dele.

O H4 trocou o corpo do conceito da m26-04 para caber no desenho ("saiote preso à borda da mesa, voltado para o operador"). Mas a mesma aula ainda diz "lateral" em três lugares, como o integrador listou: a opção certa do checkpoint ("O saiote na lateral da mesa."), o retorno de acerto ("o saiote, preso à lateral da mesa, barra o espalhamento...") e um retorno de erro.

**Cenário para o aluno:**
- na figura e no conceito, aprende que o saiote fica na ponta da mesa e que quem opera fica no pé dela;
- no checkpoint, a resposta certa diz "lateral";
- o texto de checkpoint está certo, e a figura, não.

A conformidade com o H4 está feita. O custo didático é este.

**Correção (do dono):** redesenhar as duas cenas da m26 com o operador ao lado da mesa, na altura do quadril do paciente e do lado do tubo, e o saiote na lateral do tampo, voltado para ele. Um azimute que mostre a face lateral, como o 68 da m17, mostra o leque grosso indo do paciente ao saiote. Então a frase do conceito volta a "saiote preso à lateral da mesa".

Se o dono mantiver o desenho, o `alt` e o README devem dizer que é esquemático. Nenhuma pergunta nem resposta certa muda.

### 3. Importante, aceito pelo H5: no DXA do fêmur, as pernas abertas em V ensinam uma abdução que a técnica não pede
`dxa-posicionamento.pecas.mjs:13`: `ABD = 19.5` (cada perna) e `ROT = 34`. No render, vista dos pés, as pernas da paciente da direita formam um V de ~39 graus, quase de borda a borda da mesa.

Pelo que sei, e cito de memória: para o fêmur proximal, a perna fica **estendida e alinhada ao eixo da mesa**, com abdução mínima, e o pé vai ao posicionador com rotação interna de 15 a 25 graus.

O giro do pé confere em direção: a ponta do pé da esquerda do desenho aponta para o meio, para o posicionador. A faixa prende o pé ao posicionador. A coluna à esquerda confere com a aula: quadril e joelhos dobrados e canelas sobre o bloco.

**Cenário para o aluno:** a m30-03 e a m30-06 (conceito: "o pé virado para dentro, preso ao suporte, são posições a repetir") usam esta figura. Ele vê que, para o fêmur, as pernas vão abertas em V, e leva isso para a sala.

**Situação:** o H5 aceitou o desvio para as áreas de toque não se sobreporem, e o `figuras.json` o registra. Fica para o dono decidir.

**Correção sugerida:** `ABD` de 4 a 6 e `ROT` de 25.
- O pé direito do desenho fica perto do posicionador, e as áreas de toque dos dois pés e do posicionador passam a se sobrepor.
- Para resolver, aumentar o pé, aproximar a câmera da mesa B ou trocar a opção "Pé à direita do desenho" por outro distrator, como a mão.
- Uma última saída é um aviso no conceito: "no esquema, as pernas estão mais abertas que no exame".

### 4. Menor: o apoio de espuma da contenção pediátrica não encosta na criança
`contencao-pediatrica.pecas.mjs:33`:
- a espuma ocupa x 54 a 76 e y 10 a 30;
- a pelve da criança está em x = −6, com K = 0,62, e os pés terminam perto de x = 48, em y ≈ ±5;
- no render, o bloco fica além dos pés e de lado, solto no fim da mesa.

A m27-02 i2 tem a espuma como resposta certa: "A faixa e o apoio mantêm a posição sem mão no feixe."

**Cenário para o aluno:** ele procura o que "prende ou apoia o corpo" e vê um bloco que não toca em nada.

**Correção:** encostar a espuma no corpo, ao lado das pernas ou do quadril (por exemplo x 0 a 30, y 9 a 27), ou sob os joelhos. Depois, refazer a região "Apoio de espuma" nas duas aulas e conferir a área de toque contra a da faixa.

### 5. Menor: no DXA, o feixe atravessa a coxa, e o ponto do "Feixe" segue o mais fraco do lote
`dxa-dois-feixes.pecas.mjs:8`: `XC = 22`, com a pelve em x = 0 e os pés para +x. O feixe passa 22 cm abaixo do quadril, no meio da coxa. A densitometria central mede a coluna lombar ou o fêmur proximal. A aula não diz onde o feixe está, mas a figura o põe onde nenhuma medida central é feita.

Na m30-01 i2, a área de toque do ponto 3 ("Feixe") mostra, pela minha medida:
- 16,6% de feixe e 59,5% do corpo da paciente, que é o objeto do ponto 4;
- o ponto de 12 pt cobre 24,7% das duas linhas naquele trecho.

O integrador registrou isso como incerteza.

**Correção opcional:** `XC` de −15 (lombar) a +4 (colo do fêmur). Depois, refazer os pontos 2 e 3 (o detector mais alto, perto de y = 0,25, libera espaço para o feixe acima do corpo) e as regiões da i4.

### 6. Menor: frases que dizem "de lado" de uma vista isométrica
- `content-manifest/rtg-2026/aulas/m30.json`, m30-01 i2, `prompt`: "Rotule as partes do densitômetro **vistas de lado**...". A figura nova é isométrica (azimute 50). Correção mínima: "Rotule as partes do densitômetro, tocando na ficha e no ponto."
- Os `alt` de `fluoroscopia-cadeia.ts:8` ("Fluoroscopia de lado") e `sala-de-fluoroscopia-espalhada.ts:8` ("Sala de fluoroscopia de lado") também descrevem a vista antiga. Correção: "em perspectiva".

O `prompt` muda só no texto, como os do H4. Precisa do aval do controlador pelo E7.

### 7. Menor: o comentário do teste e a evidência descrevem o defeito da cabeça ao contrário
- `scripts/content/figuras/kit/kit.test.mjs:69` diz que a cabeça "saía comprida e fina (2,3 vezes mais longa que larga na vista de cima)";
- `docs/evidence/2026-11-19-figuras/lote-2CD.md:30` repete "comprida e fina".

Medi a projeção do teste (azimute 0, elevação 80): o x do mundo, o eixo do corpo, vai para o y da tela, e o y do mundo, a largura, vai para o x da tela. Então `c.w / c.h` é **largura sobre comprimento**:
- o 2,27 do vermelho é uma cabeça 2,3 vezes mais **larga** que longa, achatada. É o "vira disco" que `pessoa.mjs:26` diz;
- no código antigo, o comprimento escalava por K (0,62) e o raio crescia por `head × rK` (1,38).

O nome do teste ("proporção comprimento/largura") também está invertido.

**A guarda funciona:**
- reproduzi o vermelho com `HS = HR = 1`: 2,27 contra 1,21;
- com o conserto pela metade (`HS` certo, `HR = 1`), ela ainda reprova, com 1,87;
- com o conserto inteiro passa, com 1,40.

O vermelho de `vermelho-2CD.txt` é do defeito que o H2 nomeia.

**Correção:** trocar "comprida e fina (2,3 vezes mais longa que larga)" por "achatada (2,3 vezes mais larga que longa)" no teste e na evidência, e o nome por "proporção largura/comprimento".

### 8. Menor: a pessoa do idoso
- **A tampa da coxa.** A coxa direita do desenho mostra a tampa elíptica do cilindro na cintura, como um cano saindo do quadril (no render, em torno de (105, 235) px de 840). Não é da curva: com `CURVA = 0` a tampa continua lá. Parece vir do kit com `pose: "em-pe"` e `roupa: "camisola"`; não isolei a causa.
  - Correção: testar `roupa: "camisa"` na idosa, ou fechar o quadril do kit nesse caso. Mexer no kit pede conferir as 22 cenas byte a byte.
- **A mão.** O `figuras.json` diz "com a mão direita numa barra". A mão na barra é a **esquerda**: no kit, `sd = −1` é o lado esquerdo, e ela olha para a parede (−y).
- **A postura.** De costas, a cabeça (cabelo em cima, pele embaixo) se lê também como um rosto de frente. Não é alvo, mas o dono deve olhar.

### 9. Menor: três `alt` dão a base da resposta da mesma aula
- `sala-de-fluoroscopia-espalhada.ts:8`: "grossa sob a mesa até o saiote, fina acima até o operador". São exatamente os dois riscos da m26-04 i3. O `alt` antigo dizia só "mais grossos sob a mesa".
- `contencao-pediatrica.ts:8`: "outra pessoa, sem avental, junto aos pés". É o critério da m27-01 i3, mas já estava no antigo.
- `colimacao-pediatrica.ts:8`: "na da esquerda a luz do colimador cobre o corpo todo". Também já estava no antigo.

É o mesmo conflito do achado 3 do 2B: sem a frase, quem usa leitor de tela não responde. **Decisão do dono.**

A forma neutra para a fluoroscopia seria: "raios de espalhamento em leque saem do paciente, uns grossos e outros finos tracejados; saiote, biombo e outra pessoa".

### 10. Menor: o que os selos escondem fora dos alvos
- **Selo 4 (pedal) da m26-02.** Cobre 39,7% das pernas do operador. A ajuda usa essa referência ("perto dos pés de quem opera"). Os pés continuam à vista logo abaixo do selo.
- **Selo 2 (colimador) da m32-02.** Cobre 29,6% do trecho do feixe entre o colimador e a primeira lâmina, justamente o "de onde o feixe se abre" da ajuda. O resto do trecho fica à vista.
- Nenhum objeto cobrado fica mais de 50% escondido (E4). O maior é a fonte do DXA sob o ponto de 12 pt (29,9%, pelo meu critério).

### 11. Menor: o README das cenas não registra os desvios do 2CD
`scripts/content/figuras/cenas/README.md`, "Decisões de arte", lista os exageros do 2A e do 2B, mas nada do 2CD:
- cabeçote 1,45 x 1,35;
- vista de azimute 112 na m26;
- V de 19,5 graus e pé de 34 graus no DXA;
- idosa com tronco a 14 graus.

Estão no `figuras.json` e na evidência, mas não onde quem regenera lê. Correção: uma linha para o 2CD.

### 12. Menor: a frase do H4 ficou ambígua na lista
`m26.json`, m26-04, conceito: "avental, protetor de tireoide, saiote preso à borda da mesa, voltado para o operador e biombo". Dá para ler "voltado para o operador e [para o] biombo".

O texto do H4 entrou palavra por palavra. Correção mínima: "...voltado para o operador, e biombo". Fica sem efeito se o achado 2 for corrigido.

### 13. Menor e opcional: técnica nas cenas restantes
- **Gestante.** A incidência é PA, com o tubo atrás dela, a 193 cm do receptor, e o feixe horizontal. Mas o tórax fica a ~24 cm do receptor (`gestante-campo-e-feixe.pecas.mjs:30-32`), e no PA de tórax ele encosta. A barriga está centrada na altura da pelve, baixa para uma gestação. Correção opcional: aproximar a gestante 8 a 10 cm do receptor e subir a barriga ~8 cm.
- **Colimação.**
  - "Criança da esquerda/direita" é sobretudo frente e fundo: a cabeça de uma fica à esquerda da cabeça da outra, mas as mesas se sobrepõem em x. É defensável.
  - O abdome e a pelve da criança da esquerda também entram no campo sem pedido e não são opção. O item pede "as partes", e o retorno nomeia só cabeça e pernas. Já era assim antes.
- **Radiografia de objeto.**
  - O cordão é um trecho de ~70 cm entre dois postes, e não cerca a área.
  - O operador fica a ~1,8 m do foco, atrás do cabeçote. Isso é plausível para um esquema, mas curto para radiografia de objeto.
- **Veterinária.**
  - A calha em V serve sobretudo ao decúbito dorsal, e o `alt` diz "deitado de lado". O texto da aula é anterior ao lote.
  - As mãos de luva da pessoa de avental ficam fora do feixe e não seguram o cão, o que confere com "mãos e corpo fora do feixe útil".

### 14. Menor: a região "Pessoa afastada, atrás do biombo" passa da pessoa
`sala-de-fluoroscopia-espalhada.alvos.json`: a região declarada é (0,848; 0,068; 0,104 x 0,589). A caixa da pessoa, pelo meu render, é (0,862; 0,111; 0,077 x 0,532). A região sobe ~9 pt acima da cabeça, sobre fundo, e pega a borda do biombo.

A área de toque continua sem objeto de outro alvo. Correção: (0,862; 0,111; 0,08 x 0,532), com o selo refeito.

As outras regiões de objeto conferem com a caixa da peça (diferença de até 0,02, ou crescimento centrado até 0,08). Três diferenças são de propósito:
- "Lâminas de filtro" inclui o suporte;
- "Acompanhante à cabeceira" exclui os braços, que são o alvo "Mão do acompanhante";
- "Pedal" exclui o cabo.

### 15. Menor: a origem dos raios grossos não está sob o feixe
`sala-de-fluoroscopia-espalhada.pecas.mjs:27`: `ORIG_B = [6, 0, 62]`. O feixe entra no paciente em x = −30, e os raios grossos nascem 36 cm adiante, sob o quadril. Como são pintados sobre a mesa, no render eles parecem sair da borda do tampo, na altura dele.

O retorno ("Ali passam os raios grossos") continua verdadeiro. Correção opcional: origem em (−30, 0, 70), sob o ponto de entrada.

## Medidas (minhas, posição atual do app, 280 pt)

Os números a seguir usam o meu critério de pixel visível por peça e conferem em ordem de grandeza com `lote-2CD/medidas.md`. A "resposta errada na área" é o objeto de outro alvo do mesmo item sob a área de toque.

| item | resposta certa: o que há na área de toque | resposta errada na área certa | selo ou ponto sobre o próprio objeto |
|---|---|---|---|
| m26-02 i2 (rotular) | — (rotular) | nenhuma em nenhum ponto | ponto de 12 pt: tubo 20,2%, receptor 8,6%, monitor 7,8%, pedal 19,8%; selo: até 11,9% (receptor) |
| m26-04 i3 (riscos: 2 e 4) | abaixo da mesa: 33,5% raios, 39,7% fundo; pescoço: 12,5% pescoço, 53% fundo | nenhuma | 0% |
| m27-01 i3 (certa: 3) | pessoa aos pés: 62,3% pessoa, 31% fundo | nenhuma | 0% |
| m27-02 i2 (certas: 2 e 4) | faixa: 32,7%, fundo 18,7%; espuma: 41,8%, fundo 5,2% | nenhuma | 0% (o selo do campo fica sobre o cone, fora do campo) |
| m27-03 i2 (certas: 1 e 2) | pernas: 46,9%, fundo 9,9%; cabeça: 53,6%, fundo 5,9% | nenhuma | 0% |
| m27-04 i4 (riscos: 2, 4 e 5) | degrau 51,8%; tapete 31,7%; andador 46,8% | tapete: 0,2% de degrau (borda) | até 1,2% |
| m27-06 i3 (certa: 5) | andador: 46,8%, fundo 53,2% | nenhuma | 0,1% |
| m30-01 i2 (rotular) | — | ponto 3: 59,5% de paciente (achado 5); ponto 1: 26% da mesa inteira, o tampo sobre a fonte | ponto: fonte 29,9%, feixe 24,7%, detector 13,2%; selo 3 cobre 12,3% da paciente |
| m30-01 i4 (certa: 2) | detector: 56,3%, fundo 22,9% | nenhuma | 0,1% |
| m30-03 i2 (certa: 4) | pé girado e faixa: 26,1%, fundo 1,7% (o resto é mesa) | nenhuma | 0% |
| m31-01 i2 (certa: 3) | calha: 22,5%, fundo 18,6% (cão e mesa no resto) | nenhuma | 0,5% |
| m31-02 i2 (certa: 2) | pessoa ao lado da mesa: 26,5%, fundo 48,5% | nenhuma | 0,2% |
| m31-06 i2 (certas: 2 e 4) | triângulo: **7,4%**, fundo 80,4%; cordão: 14,7%, fundo 54,6% | nenhuma | até 0,7% |
| m32-02 i2 (rotular) | — | ponto 2: 23% do tubo; ponto 5: 4,7% de lâminas | ponto: até 12,6% (colimador); selo 2 cobre 12,2% do colimador |

- Os objetos finos (triângulo, cordão, mãos de luva, barra) ficam abaixo de 15% da própria área de toque. São a caixa justa do objeto, como o E4 manda, e não há objeto de outra resposta em volta.
- **O que o selo esconde fora dos alvos:** ver o achado 10.
- **Nas caças ao risco** (m26-04 e m27-04), o selo só aparece como marca de selecionado depois do toque.

## Técnica radiológica por cena (contra o texto das aulas)

- **`fluoroscopia-cadeia`.**
  - O tubo fica sob a mesa e o cone abre para cima, divergente, até o receptor, 46 cm acima do tampo.
  - O monitor fica num suporte. O operador está de avental e protetor de tireoide, e o pedal fica no chão, perto dos pés dele.
  - Confere com a m26-02 ("o feixe sai de baixo e chega em cima"). Ver o achado 2 sobre a posição do operador.
- **`sala-de-fluoroscopia-espalhada`.**
  - Os raios grossos ficam abaixo do tampo e param no saiote. Os finos, tracejados, sobem até a cabeça, o pescoço e o peito do operador. O biombo fica entre o operador e a segunda pessoa.
  - Confere com "mais forte do lado do tubo; acima, mais fraco". Ver os achados 2, 12 e 15.
- **`contencao-pediatrica`.**
  - O tubo de teto fica a ~90 cm do tampo, com o campo no tórax. A criança tem os braços erguidos, seguros pelos punhos pelo acompanhante de avental, fora do campo. A faixa fica sobre as coxas.
  - A pessoa sem avental fica aos pés, com o espalhamento chegando a ela.
  - Confere com a m27-01 e a m27-02. A faixa, em forma de arco azul, se lê como faixa. Ver o achado 4.
- **`colimacao-pediatrica`.** Um campo aberto cobre da cabeça aos pés; o outro, ajustado ao tórax, deixa a cabeça fora. Confere.
- **`idoso-apoios-e-riscos`.** A paciente está de frente para o receptor (PA), com a mão na barra; banco, degrau, tapete com canto levantado e andador longe. Ver o achado 1.
- **`gestante-campo-e-feixe`.** O PA tem o tubo atrás e o feixe horizontal. O campo cheio fica no tórax e o tracejado chega ao abdome: confere com o conceito. Ver o achado 13.
- **`dxa-dois-feixes`.** A fonte fica sob o tampo e o detector no braço acima, com o feixe vertical estreito. Confere. As duas linhas de cores diferentes seguem o título da aula ("Dois feixes, duas energias"). Ver o achado 5.
- **`dxa-posicionamento`.** Na coluna, quadril e joelhos dobrados sobre o bloco: confere. No fêmur, o pé gira para dentro (a ponta vai ao meio) e fica preso ao posicionador: confere. As pernas abertas em V não conferem (achado 3).
- **`radiografia-veterinaria`.** Sacos de areia nas patas, calha sob o tronco, detector no tampo, cone no tronco. Quem fica de avental tem luvas e as mãos fora do feixe; uma pessoa sem avental fica ao lado da mesa, com espalhamento tracejado chegando a ela, e outra na porta. Confere com a m31-01 e a m31-02.
- **`radiografia-de-objeto`.** O feixe horizontal sai do cabeçote, atravessa o quadro e chega ao detector atrás dele. O triângulo de aviso fica num poste. O operador fica no painel, atrás do cabeçote. Confere com a m31-06. Ver o achado 13.
- **`teste-de-feixe`.** O feixe desce do tubo, sai do colimador, passa pelas três lâminas de filtro e chega ao medidor sobre a mesa, que um cabo liga ao mostrador de três barras. Não há receptor, então o distrator "Receptor de imagem" não tem par. Confere com a m32-02.

## Fusão da pessoa (H2)

- **A fusão.** `kit/pessoa.mjs` ganhou:
  - a cabeça da criança (`HS = 0,82/K` no comprimento, `HR = 0,7` no raio);
  - `curva`, `cabelo`, `perna[sd]`, `extras` e `saida`.

  Sem as opções, cada expressão volta ao valor antigo: `s*1`, `r/K*1`, `curva` 0 dá `A = Z`, `perna` vazia dá `thigh`, `shinDir`, `toe` e `Lt` de antes.
- **As cenas antigas.** As 11 cenas do 2A e do 2B regeneram byte a byte (`cenas.test.mjs`, 22 de 22), e nenhuma delas usa criança.
- **Sem cópia local.** Nenhuma cena define `pessoa` nem importa `pessoa-local` ou `pessoa-d`. As fontes novas são idênticas às dos construtores.
- **O teste novo prova o defeito que nomeia:**
  - vermelho reproduzido com `HS = HR = 1`, 2,27 contra 1,21;
  - ainda vermelho com o conserto pela metade, 1,87;
  - verde com o conserto inteiro, 1,40.

  Só a descrição está invertida (achado 7).

## Itens alterados

Fiz um diff estrutural das cinco aulas, de `6990a6af` a `8cf2d3b9`, ignorando `x`, `y`, `width`, `height` e `alvo`. Mudaram exatamente os cinco textos do H4:
- o `where` do pedal (m26-02 i2);
- o corpo do conceito da m26-04;
- o `prompt` da m30-03 i2;
- o `prompt` da m31-01 i2;
- o rótulo de uma opção da m31-06 i4, que não usa figura.

Nenhuma ficha, `correct`, `risk`, retorno, ajuda ou rótulo de região mudou. Nenhum item foi adaptado.

| item | válido? | o que o aluno deixa de praticar | recomendação |
|---|---|---|---|
| m26-02 i2 (rotular) | Sim. Os 4 pontos ficam sobre os objetos, e o `where` novo do pedal é verdadeiro. | nada | manter; achados 2 e 10 |
| m26-04 i3 (caça ao risco) | Sim no desenho: os raios grossos param no saiote, os finos chegam ao pescoço, e a segunda pessoa e as pernas ficam sem raio. | nada | corrigir o desenho ou aceitar (achado 2); achados 9, 12, 14 e 15 |
| m27-01 i3 (tocar) | Sim. Só a pessoa aos pés está sem avental e ao alcance do espalhamento. | nada | manter |
| m27-02 i2 (tocar) | Sim, mas a espuma não encosta na criança. | nada | corrigir a espuma (achado 4) |
| m27-03 i2 (tocar) | Sim. Cabeça e pernas da esquerda estão no campo aberto. Tórax e abdome da direita usam núcleo mínimo, com 13,7% e 19,1% de objeto na área. | o abdome da esquerda, também fora do pedido, não é opção (já era) | manter |
| m27-04 i4 (caça ao risco, segurança crítica) | Respostas defensáveis em geral, mas o retorno do banco ("fora do caminho dela") contradiz o desenho. | nada | **corrigir a cena** (achado 1) |
| m27-06 i3 (tocar) | Sim. O andador é o único apoio de andar, e está longe. | nada | manter |
| m30-01 i2 (rotular) | Sim. As 5 `where` são verdadeiras, e o distrator "Grade antidifusora" não tem par. O `prompt` diz "vistas de lado". | nada | achados 5 e 6 |
| m30-01 i4 (tocar) | Sim. O feixe termina no detector. | nada | manter |
| m30-03 i2 (tocar) | Sim. O `prompt` novo ("Na cena da direita") é verdadeiro, e só o pé da esquerda dela está girado e preso. | nada, mas aprende o V das pernas | decisão do dono (achado 3) |
| m30-06 (conceito) | "O bloco sob as pernas e o pé virado para dentro, preso ao suporte" é verdadeiro na figura. | — | achado 3 |
| m31-01 i2 (tocar) | Sim. O `prompt` novo é verdadeiro: as mãos de luva estão fora do feixe, e a calha está sob o tronco. | nada | manter |
| m31-02 i2 (tocar) | Sim. A pessoa sem avental ao lado da mesa está a ~0,9 m do cão, e a da porta a ~2,3 m. | nada | manter |
| m31-06 i2 (tocar) | Sim. O triângulo e o cordão são os únicos que avisam e delimitam. | nada | manter |
| m32-02 i2 (rotular) | Sim. Cada ponto fica sobre a sua peça, e "Receptor de imagem" não tem par. | nada | manter; achado 10 |
| m27-05 (conceito) | Verdadeiro: "o campo cheio fica no tórax; o tracejado, aberto demais, alcança o abdome". | — | manter |

## Conformidade com H1 a H6 e com E0, E3, E4, E6, E7, E12 e E13

- **H1:** conforme.
  - Entraram as onze, com o `id` intacto.
  - O `figuras.json` tem origem `anatomy`, autor "Radiant", licença própria e `receita` em cada uma.
- **H2:** conforme. A pessoa é única, as 11 cenas antigas são idênticas byte a byte, e o teste foi visto vermelho pelo defeito nomeado. A descrição dele está invertida (achado 7).
- **H3:** conforme.
  - As cenas e as peças estão em `cenas/<id>.mjs` e `<id>.pecas.mjs`.
  - Em `comum/` entraram só `ik`, `campo`, `fluoro`, `dxa` e `animal`.
  - Os imports são do repositório (`../kit/`, `./comum/`), e `cenas.test.mjs` cobre as 22 cenas.
- **H4:** conforme nos cinco textos, palavra por palavra. A frase da m26-04 ficou ambígua na lista (achado 12). Os `alt` descrevem forma, mas três dão a base da resposta (achado 9).
- **H5:** os desvios estão registrados (`figuras.json` e evidência), mas não no README (achado 11). O V do DXA tem custo didático (achado 3).
- **H6:** conforme. Os 105 arquivos estão na lista, e `STATUS`, planos e ADR não foram tocados. Os 15 roteiros novos são os que o `figuras-no-simulador --check` aceita.
- **E0:** nada a conferir no código. Registrado.
- **E3:** conforme. Nenhum dos 11 specs tem `periodMs` nem `posterAt`, e nenhuma aula diz que a figura se move.
- **E4:** conforme.
  - As regiões são a caixa justa, salvo o achado 14.
  - Os objetos pequenos foram exagerados e isso foi dito: cabeçote 1,45 x 1,35, pedal, monitor, receptor, tubos do andador e barra.
  - Os pontos ficam sobre os objetos.
- **E6:** conforme. As medidas foram feitas com o selo e o ponto na posição atual, e o spec contra a fonte deu 0 pixel. Repeti as medidas por outro critério e elas conferem em ordem de grandeza.
- **E7:** conforme, salvo os dois `prompt` que o próprio H4 manda trocar. O achado 6 propõe um terceiro, que depende do controlador.
- **E12:** conforme em 280, 320 e 358 pt.
- **E13:** o lote não toca o app. Os testes de toque no selo (`HotspotStepRenderer.test.tsx`, `LabelStepRenderer.test.tsx`) passam na suíte de 1635 testes.

## O que o dono deve olhar no simulador

1. **m27-04 e m27-06**, o idoso:
   - o banco parece estar no caminho até o andador (achado 1)?
   - A tampa da coxa na cintura aparece no tamanho real (achado 8)?
   - Ela se lê de costas, de frente para o receptor?
2. **m26-02 e m26-04:**
   - o operador no pé da mesa e o saiote na ponta (achado 2);
   - os raios grossos se leem como "abaixo da mesa" ou saindo da borda do tampo (achado 15)?
3. **m30-03 e m30-06:** o V das pernas e o giro do pé, no tamanho real (achado 3).
4. **m27-02:** a espuma solta no fim da mesa (achado 4). A faixa se lê como faixa, e não como um arco rígido?
5. **m30-01 i2:** dá para pôr o ponto 3 no feixe sem confundir com a paciente (achado 5)?
6. **m31-06:** o triângulo (7,4% da área de toque) e o cordão se acertam com o dedo, no aparelho?
7. **As onze no `react-native-svg`:** o cone e o leque translúcidos, os tracejados e as linhas de 4 px do DXA.

## Não consegui verificar

- O render no `react-native-svg` e no aparelho: medi no Chrome. Não rodei simulador.
- Os números da técnica de DXA (abdução, rotação de 15 a 25 graus) e a posição usual do saiote e do operador na fluoroscopia: cito de memória, sem abrir norma nem diretriz. Não li PDFs nem nada sob `Conteúdo/`.
- O `npm run quality` inteiro (rodei as partes listadas acima).
- A causa da tampa da coxa no kit (achado 8): só descartei a curva.
- A regeneração em outra máquina, com outro Chrome: a serialização de cor pode variar entre versões.
