# Revisão independente da fase 3: 14 gráficos em código (2026-11-21)

Esta revisão foi feita por IA, e não por um profissional de radiologia. Ela cobre os commits `44275c68`, `641db855`, `54a57d4e`, `64419b25` e `7fee1bf8`, sobre a base `08745621`. Li tudo pelo git e testei numa worktree destacada em `7fee1bf8`, com link simbólico de `radiant-app/node_modules`. Para comparar, montei uma segunda worktree na base. As duas foram removidas ao fim.

Li o brief do revisor, a gramática (`docs/content/2026-11-19-gramatica-de-graficos.md`), o parecer `2CD.md` como régua de rigor e as decisões J1 a J5 (`decisoes-f3.md`). Licença de terceiro e fidelidade a arte importada não se aplicam: as 14 figuras são desenho próprio em código.

**Como medi.** Os renders são meus, pelo Chrome, a 840 x 630 px (o quadro de 280 x 210 pt a 3x), sobre #171920, no `posterAt` de cada figura. Esse é o quadro que o app mostra parado (`InteractionFigure.tsx` e `DiagramView.tsx`).
- **Selos e marcadores:** os do app, de `labelBadgeBoxes`, `badgeBoxes`, `touchRect` e `LABEL_DOT` (`hotspotTouch.ts`), carregados por `load-app-contract.cjs`.
- **Tinta sob cada selo:** contada por cor da paleta.
- **Laços:** 12 quadros por figura (t = 0; 0,03; 0,06; 0,2; 0,4; 0,6; pôster; 0,88; 0,92; 0,96; 0,99; 0,999). Contei os pixels de cor em t = 0 contra os de t = 0,999.

O `alvos-preview.mjs` do repositório não roda nessas figuras (achado M10). Por isso usei um renderizador meu, que chama as mesmas funções do app. Os scripts ficaram no meu rascunho, fora do repositório.

## Gates (worktree em `7fee1bf8`, Node 20.20.2)

- `rtg-lesson-lint.mjs`, arquivo por arquivo, nas 40 unidades: 40 de 40 OK.
- `build-rtg-batches.mjs --check`: ok. `figuras-no-simulador.mjs --check`: ok, com 70 roteiros. `generate-rtg-maestro.mjs --check` em m19, m21, m22, m26, m29 e m32: ok nas seis.
- `node --test scripts/content/*.test.mjs scripts/qa/*.test.mjs scripts/content/figuras/*.test.mjs scripts/content/figuras/kit/*.test.mjs scripts/content/figuras/cenas/*.test.mjs`: 515 testes, 513 passam, 1 é pulado e 1 falha. A falha é a conhecida (`registerSource normalizes metadata for the pilot book`).
- App, em `radiant-app`:
  - `EXPO_NO_DOTENV=1 npx jest --runInBand src/ui/diagrams src/features/lesson-flow src/features/student-checkpoints src/features/settings`: 68 suítes e 1650 testes, todos passam;
  - `npx tsc --noEmit`: 0;
  - `npx eslint` nos 14 specs, no `diagramRegistry.test.ts` e nos 5 lotes: 0;
  - `npm run test:maestro-contract`: 13 de 13. `test:copy-style-contract`: 65 de 65.
- Não rodei `visual:qa:strict` nem o `npm run quality` inteiro.

## Requisitos tardios J1 a J5

- **J1, conforme.** Os 14 specs do commit são idênticos, byte a byte, aos `spec.ts` de `fase3-gramatica/` (3) e `fase3-volume/` (11). Nenhum entrou em `figuras.json`.
- **J2, conforme.** A gramática está no repositório com a seção "6. Exemplos". O guia aponta para ela duas vezes, ambas dentro da seção 3b (linhas 263 e 779). A seção 3 só remete à 3b, sem ponteiro próprio; aceito isso como cumprido. O catálogo do guia ficou desatualizado (M9).
- **J3, quase conforme.**
  - Conferidos: coordenadas, as frases de eixo de m22-02, m26, m29-02 e m32-05, a fala da conversa "para o lado" com as três respostas que dependiam dela, e o rótulo "Círculos azuis pequenos".
  - Nenhuma pergunta mudou, e nenhum `correct` mudou. Os lotes repetem as aulas, e o `--check` passa.
  - **Exceções:**
    - o `where` do Radical trocou uma cor por outra: era "ciano", agora é "branco". O ponto branco fica inteiro sob o marcador de 12 pt (M3);
    - a frase de eixo não entrou em quatro gráficos (I2). Em dois deles ela cabe no teto: `espectro-de-raios-x`, na m19 aula 5, e `relaxacao-t1-t2`, na m29 aula 1. Nenhum relatório os avaliou, porque não tinham `aulas.md`.
- **J4, conforme.**
  - Seis figuras estão em laço, todas de `visual` de conceito.
  - `relaxacao-t1-t2` também é rotulada (m29 aula 1). Nesse uso o app a mostra parada no `posterAt` 0,8, e o quadro está completo.
  - As oito figuras com alvo, ou só rotuladas, estão paradas. A guarda nova confere isso (M11).
- **J5, conforme no escopo.**
  - Todo arquivo alterado está na lista do run. A versão `-c` acrescenta o `maestro-contract.test.mjs`.
  - `STATUS`, planos e ADR não foram tocados.
  - As prévias têm entre 11 e 73 KB e coincidem com os meus renders: mesmos selos e mesmos pontos.
  - O README da amostra registra a aprovação. O `fase-3.md`, porém, ficou desatualizado (I3).

## Veredito por figura

| Figura | Uso | Veredito |
|---|---|---|
| `espectro-de-raios-x` | m19 a5, rotular | aprovada com correções (I2, M2, M3) |
| `circuito-do-gerador` | m19 a1, rotular | aprovada com correções (M4) |
| `retificacao-de-onda` | m19 a2, conceito, laço | aprovada com correções (I2, M1) |
| `dano-ao-dna` | m21 a1, rotular | aprovada com correções (M3, M7) |
| `grandezas-de-dose` | m21 a2, conceito, laço | aprovada com correções (M6) |
| `histograma-e-lut` | m22 a1, conceito e rotular | aprovada com correções (I2, M5) |
| `realce-e-suavizacao` | m22 a2, conceito, laço | aprovada com correções (M1) |
| `compressao-de-imagem` | m22 a5, conceito | aprovada |
| `fluoroscopia-pulsada` | m26 a3, conceito, laço | aprovada com correções (M1, M8) |
| `relaxacao-t1-t2` | m29 a1, conceito em laço e rotular | aprovada com correções (**I1**, I2, M1, M8, M13) |
| `linha-do-tempo-tr-te` | m29 a2, conceito, laço | aprovada com correções (M1, M8, M13) |
| `ciclo-de-testes` | m32 a1, rotular; m32 a6, tocar | aprovada (M12) |
| `coincidencia-de-campo` | m32 a3, tocar | aprovada (M12) |
| `nivel-de-referencia` | m32 a5, rotular | aprovada (M12) |

**Física, no que cada figura afirma.** Conferi cada uma e nada está errado no que a aula cobra:
- **espectro:** número de fótons de Kramers, (1-u)/u, com filtração; linhas K do tungstênio em 0,59 e 0,68 de Emax, abaixo dela; Kα maior que Kβ;
- **retificação:** onda alternada, onda completa e ondulação pequena, com o mesmo pico;
- **T1 e T2:** a marca de T fica em 63% na recuperação e em 37% no decaimento;
- **TR e TE:** contados do pulso;
- **fluoroscopia pulsada:** pausas sem feixe, e o monitor retém a imagem;
- **dose absorvida e equivalente:** a partícula pesada deixa uma marca maior que o fóton;
- **DNA:** a quebra dupla tem as duas fitas cortadas na mesma altura;
- **histograma e realce:** colimado à esquerda e direto à direita, com o valor crescendo com a exposição; o realce faz halo dos dois lados da borda, e a suavização alarga a rampa;
- **compressão e ciclo de testes:** os dois conferem;
- **coincidência de campo:** a faixa só de luz fica à esquerda, e a faixa só de radiação, à direita;
- **nível de referência:** nove de doze salas ficam abaixo da linha, o terceiro quartil;
- **circuito:** a ponte está correta, com o positivo no ânodo e o negativo no fio do filamento. O transformador do filamento sai da rede e fica isolado na alta tensão.

As exceções, menores, são M5, M6, M7 e M13.

## Achados

### Importantes

**I1. Em `relaxacao-t1-t2` (rotular, m29 aula 1), dois selos escondem 39% da curva azul de T2, que é a resposta "T2 longo" do mesmo item.**
- **O que está errado:**
  - o selo 4 (de "T2 curto") e o selo 5 (de "T2 longo") cobrem 1389 dos 3561 pixels da curva azul do gráfico da direita;
  - o trecho escondido vai de x = 525 a 717 px no render a 3x;
  - o ponto azul da marca de T (em 258; 144,5) fica inteiro sob o selo 5;
  - o selo 2 cobre o início das duas curvas de T2, no alto do eixo da direita.
- **O que o aluno vê:** da curva azul de T2, sobram o começo e o fim. O `where` ("a curva que cai devagar e termina mais alta") continua decidível pela ponta direita, mas o selo de outro alvo cobre a estrutura cobrada.
- **Medida do autor:** o `fase-3.md` diz "de 1% a 27% da tinta de uma estrutura vizinha", e a relaxação passa disso.
- **Correção sugerida:** levar os dois pontos de T2 para o trecho em que os selos caem no vazio. Busquei com as funções do app, mantendo os pontos 1 a 3:
  - "T2 curto" em **(0,5813; 0,4629)**, na curva âmbar em t = 8;
  - "T2 longo" em **(0,7438; 0,5411)**, na curva azul em t = 60.

  Com isso, a curva azul de T2 sob selo cai de 57 para 2 amostras, a distância entre pontos fica acima de 50,3 e o `where` continua verdadeiro. Confira no render antes de aplicar. Arquivos: `m29.json` (`lessons[0].interactions[1].points[3..4]`) e `rtg-2026-m29.ts`.

**I2. Quatro aulas não dizem o que cada eixo mede, e a gramática exige isso** (§1: "o revisor confere isso"). O desenho não tem texto.
- **`espectro-de-raios-x` (m19 aula 5):** o corpo tem 87 palavras, com teto de 110 (o conceito não tem `visual`). A frase cabe, e a figura é o exemplo da própria gramática ("no eixo horizontal, a energia"). Sugestão: "No gráfico, a energia fica na horizontal e a quantidade de fótons, na vertical." (14 palavras, total 101).
- **`relaxacao-t1-t2` (m29 aula 1):** o corpo tem 76 palavras, com teto de 80. "Tempo na horizontal." cabe (79). A grandeza vertical difere entre os gráficos (magnetização e sinal), e por isso o melhor lugar são os `where` do item de rotular: "à esquerda (magnetização no tempo), a curva que…".
- **`histograma-e-lut` (m22 aula 1, 76 palavras) e `retificacao-de-onda` (m19 aula 2, 78):** o integrador declarou que não cabe. No histograma, os `where` do item de rotular podem carregar a frase; por exemplo, "Área colimada": "no início do eixo dos valores, a barra estreita". Na retificação, a decisão é do controlador: cortar texto ou aceitar.
- **Cenário:** o aluno vê três traçados sem saber que o horizontal é o tempo. A ondulação ("quanto a tensão oscila") só faz sentido se o vertical for a tensão.

**I3. O `docs/evidence/2026-11-19-figuras/fase-3.md` descreve um estado que os commits seguintes desfizeram.**
- **O que está errado:** a seção "O que ficou fora" diz que dez roteiros (os seis `-laco` e os quatro de `rtg-2026/` de m21 e m22) "não estão no git". Diz também que `generate-rtg-maestro` m21/m22, `figuras-no-simulador --check` e o teste do índice reprovam.
- **O que medi:** os dez entraram em `54a57d4e` e `64419b25`, e os quatro gates passam em `7fee1bf8`. O arquivo só foi tocado em `44275c68`.
- **Cenário:** a próxima sessão lê o documento, copia de `maestro-f3-pendentes/` o que já está no git e tenta ampliar a lista de um run para um trabalho já feito.
- **Correção:** reescrever a seção com a data e os commits.
- **Do mesmo arquivo:**
  - a afirmação "selos cobrem de 1% a 27%" não vale para a relaxação (I1);
  - "Jest: 66 suítes, 1623" foi medido sem `src/features/settings`. Com as quatro pastas, são 68 e 1650.

### Menores

**M1. Cinco laços "estalam" na volta do ciclo, e a gramática pede laço sem corte e "entre 0 e 0,06 só os eixos".** Pixels de cor em t = 0 contra t = 0,999, todos medidos:
- **`realce-e-suavizacao`:** 74 px azuis (0 em 0,999). A ponta redonda de cada perfil, em x = 284 a 285,75, fica fora da cortina (`x 36`, largura `X1 - 36`, que termina em 284). Aparecem três meias-bolinhas azuis no fim de cada perfil, até a cortina passar. Correção: cortina com largura `X1 - 36 + 4` e `dx` igual.
- **`retificacao-de-onda`:** 27 px, pela mesma causa (cortina de 38 a 284). Mesma correção.
- **`relaxacao-t1-t2`:** 136 px âmbar e 56 azuis. As curvas começam em `x0` = 22 e 178, e a cortina em `x0 + 2`. Aparecem um filete âmbar de cerca de 15 unidades junto à origem de T1 e outro no alto do eixo de T2. Correção: cortina em `x0 - 2`, abaixo dos eixos (que já estão acima dela).
- **`fluoroscopia-pulsada` e `linha-do-tempo-tr-te`:** o cursor branco fica parado em x = 34 (ou 30) de t = 0 a 0,06, colado ao eixo vertical. Ele forma um traço duplo e, na linha do tempo, desce até y = 210, abaixo do fim do eixo (164). No ciclo seguinte ele surge de uma vez. Correção: cursor com `fade` de 0 a 1 entre 0 e 0,06, ou partir de trás da moldura.

O registro (`diagramRegistry.test.ts`) não pega nada disso (M11). O `grandezas-de-dose` fecha limpo: 0 px nos dois quadros.

**M2. `espectro-de-raios-x`:**
- **Ponto 1:** o ponto "Radiação de freamento" (0,39; 0,54) fica **sobre a linha tracejada**, que é o espectro sem filtração, "o que não existe". Em u = 0,385, a tracejada passa em y = 131,3, o ponto está em 129,6 e a curva real passa em 138.
- **Faixa sombreada:** de u = 0,08 a 0,21 ela tem o topo reto em y = 40, o corte do `Math.max(40, …)`. Ali não há linha tracejada por cima, e o ponto 4 (u = 0,143) cai justo nesse trecho. O `where` diz "a faixa sombreada sob a linha tracejada".
- **Herança:** as coordenadas e o desenho dos dois defeitos vêm da base.
- **Correção:** encurtar o tracejado e a faixa removida até u ≈ 0,36 e levar o ponto 1 para **(0,407; 0,597)**, sobre a curva em u = 0,41. A distância fica em 51,6 do ponto 2 e 67 do ponto 4. Ou reescrever o `where` do ponto 4 como "à esquerda, a faixa sombreada acima da curva".

**M3. `where` que nomeia algo escondido pelo marcador opaco de 12 pt** (`LabelStepRenderer`, `backgroundColor`):
- **Espectro:** "o ponto branco no fim do eixo horizontal". O ponto de Emax tem r = 6 unidades (5,25 pt) e some sob o marcador de raio 6 pt. Ele também não fica "no fim do eixo": fica onde a curva toca o eixo, e a seta vai até 304. Sugestão: "onde a curva larga toca o eixo horizontal".
- **DNA, Radical:** "o ponto branco com halo no trilho tracejado". O ponto tem r = 7 (6,1 pt) e fica sob o marcador; só o halo aparece. Sugestão, sem cor: "à direita, o halo no trilho tracejado" (39 caracteres, dentro do teto de 60). É o caso que J3 nomeia.

**M4. `circuito-do-gerador`:** os selos cobrem o que identifica os blocos.
- **Selo 2:** cobre 40% da caixa da bobina secundária, as voltas de cima. Restam cerca de 5 voltas visíveis contra 4 do primário, e o `where` diz "a da direita com mais voltas". Colocando o ponto 2 em **(0,30; 0,45)**, no núcleo, embaixo, o selo deixa a secundária livre (medido com `labelBadgeBoxes`).
- **Selo 3:** esconde um dos quatro diodos (o `where` diz "losango com quatro setas").
- **Selo 4:** cobre 30% do ânodo.
- **Rede:** o marcador cobre quase toda a onda da fonte ("o círculo com uma onda desenhada").
- **Ponte:** os fios entram e saem pelas bordas do cartão e não tocam os vértices. É legítimo como bloco, mas a figura não mostra a entrada alternada nos vértices laterais.

**M5. `histograma-e-lut`:**
- **Sentido da curva em S:** com o valor crescendo com a exposição, a curva sobe. Se o eixo vertical for nomeado "brilho", a radiação direta sairia clara, o contrário da radiografia. A frase sugerida no `aulas.md` ("o vertical, o brilho") está pendente e **não deve entrar assim**. Use "quanto a imagem escurece na tela", ou equivalente.
- **Classes vazias:** são desenhadas com altura 2 (`Math.max(h, 2)`) e aparecem como risquinhos regulares sobre o eixo, uma régua de passos iguais que a gramática barra (§1). Correção: não desenhar a barra quando `h` é 0.

**M6. `grandezas-de-dose`:** a opacidade dos órgãos, que o spec diz seguir o fator do tecido, não segue a ICRP 103.
- **Hoje:** pulmão 0,85 > estômago 0,55 > tireoide 0,35 > gônadas 0,2.
- **ICRP 103:** pulmão = estômago (0,12) > gônadas (0,08) > tireoide (0,04).
- **Alcance:** vem da base, e a aula não diz ao aluno o que a intensidade codifica.
- **Correção:** estômago com a opacidade do pulmão, e gônadas acima da tireoide.

**M7. `dano-ao-dna`:** o rastro do radical termina na fita de cima, rente à quebra dupla. O corpo da aula diz que o radical "rompe a fita", que é uma quebra simples. Vem da base. Sugestão: o rastro chegar à fita longe da quebra dupla.

**M8. Margens da gramática (§2):**
- `relaxacao-t1-t2`: a origem fica a 14 da borda do painel (pede ≥ 24), e a seta do eixo de T2 termina a 1 da borda (pede 8);
- `fluoroscopia-pulsada`: a origem fica a 20;
- `linha-do-tempo-tr-te`: a origem fica a 16.

É estético.

**M9. O catálogo do guia (`2026-11-05-guia-de-autoria-rtg-2026.md`, coluna Tipo) chama de "parado" quatro figuras que agora estão em laço:** `grandezas-de-dose` (linha 302), `retificacao-de-onda` (288), `realce-e-suavizacao` (306) e `relaxacao-t1-t2` (335). Fora desta fase, outras quatro divergem no sentido inverso: `tubo-emitindo`, `anodo-giratorio`, `respiracao-diafragma` e `circulacao-dupla`.

**M10. `scripts/content/figuras/alvos-preview.mjs`, que o brief manda usar, não serve para figura de código.**
- **O que falha:** lê `figuras/<id>.alvos.json`, que não existe, e cai com ENOENT (rodei em `relaxacao-t1-t2`).
- **Quadro errado:** desenha `diagramSvgAt(spec, 0)`, e não o `posterAt`. Para `relaxacao-t1-t2`, a prévia mostraria só os eixos.
- **Correção:** tornar o `alvos.json` opcional e usar `spec.posterAt ?? 0`.

**M11. Guardas.**
- **Guarda nova do registro.** Os gráficos parados ou em laço estão numa lista escrita à mão, então ela confere a escolha atual e não a regra. Ela pega a perda do `posterAt`, mas não pega o estalo do laço (M1) nem um pôster incompleto. Sugestão: asseverar sobre o estado das camadas (`layerStateAt`) em t = 0, que é a cortina cobrindo a caixa das curvas com as pontas, contra t → 1.
- **Vermelho do contrato Maestro (`vermelho-maestro-contract.txt`).** Ele mostra o defeito certo: o `TypeError` com `'in'` sobre o comando em texto, nos roteiros reais e nos sintéticos. Mas o erro mascara a segunda metade do conserto, a gravação como prova. Reproduzi eu as duas metades, cada uma com o seu defeito:
  - desfeita só a gravação como prova, "gravação figura- é prova" reprova com `no takeScreenshot named figura-*`;
  - com um texto qualquer fechando a gravação, "texto outro não fecha gravação" reprova;
  - aceita a gravação de qualquer nome, "gravação sem figura- não é prova" reprova.

  A regra não ficou cega, e as seis asserções novas passam no código novo.

**M12. Selos sobre a arte nos itens restantes.** Nenhum cobre o ponto que rotula:
- `ciclo-de-testes` (rotular): o selo 3 cobre a cabeça da chave de boca, 750 px brancos, e o `where` diz "ferramenta de aperto";
- `nivel-de-referencia`: o selo 4 cobre o topo das barras 2 e 3, as vizinhas que provam que a barra 1 é "a mais curta";
- `coincidencia-de-campo`: o selo 1 cobre metade do traço de cima do L do canto superior esquerdo.

Nos dois itens de tocar, as áreas certas estão limpas:
- `ciclo-de-testes`: a área de 44 pt da certa (círculo ciano) não pega outra resposta;
- `coincidencia-de-campo`: a área de toque é a própria faixa (45,5 pt de largura).

Nenhum dos dois inflou a região. A "Área azul no centro" foi encolhida 5 unidades por lado por causa da guarda E12. É um distrator, então o encolhimento não muda o que se mede.

**M13. Palavras de eixo:**
- o `alt` de `relaxacao-t1-t2` diz "dois gráficos de sinal", mas o da esquerda é magnetização longitudinal, como o corpo da aula diz;
- em `linha-do-tempo-tr-te`, "sinal na vertical" convive com os pulsos de RF no mesmo eixo, e as barras âmbar não são sinal.

É um detalhe, sem efeito em nenhum item.

## Itens alterados (antes contra depois, base `08745621`)

Nenhuma pergunta, nenhuma resposta certa e nenhum distrator mudou. A competência de cada aula continua sendo cobrada, e o aluno não deixa de praticar nada.

| Item | Mudança | Válido? | Recomendação |
|---|---|---|---|
| m21 a1, rotular DNA | cinco coordenadas; `where` do Radical | sim | manter; trocar o `where` do Radical por "à direita, o halo no trilho tracejado" (M3) |
| m22 a1, rotular histograma | cinco coordenadas; `where` da curva em S sem cor | sim | manter |
| m22 a2, conceito realce | frase de eixos | sim, verdadeira | manter |
| m26 a3, conceito fluoroscopia | sai "enquanto dura a aquisição", entra a frase de eixos | sim | manter |
| m29 a2, conceito TR/TE | frase de eixos | sim (M13) | manter |
| m32 a1, rotular ciclo | quatro coordenadas (ajuste ≤ 0,02) | sim | manter |
| m32 a6, tocar ciclo | caixas justas; "Círculos azuis pequenos" cobre os três | sim; a certa não mudou | manter |
| m32 a3, tocar campo | cinco regiões novas; a do centro encolhida 5 | sim | manter |
| m32 a3, conversa | "para baixo" passa a "para o lado", e as três respostas acompanham | sim; o deslocamento do desenho é lateral | manter |
| m32 a5, rotular nível + corpo | quatro coordenadas; "cada barra é uma sala, e a altura é o valor típico" | sim | manter |

Itens que **ainda** precisam mudar:
- m29 a1, dois pontos de T2 (I1);
- m19 a5, frase de eixos (I2) e, se aceito, o ponto 1 e o `where` de Emax (M2, M3).

## O que o dono deve olhar no simulador

1. A m29 aula 1, no item de rotular: quanto da curva azul de T2 sobra visível com os selos (I1).
2. As voltas do ciclo, olhando a ponta direita dos perfis e a origem das curvas, onde está o estalo de M1:
   - m22 aula 2 e m19 aula 2;
   - m29 aula 1 (conceito);
   - m26 aula 3 e m29 aula 2, onde o cursor aparece parado junto ao eixo.
3. A m19 aula 1, no rotular do circuito: se a secundária ainda se lê como "com mais voltas" com o selo 2 (M4).
4. A m19 aula 5: o ponto 1 sobre a tracejada e o ponto de Emax sob o marcador (M2, M3).
5. O movimento reduzido ligado nas seis figuras em laço: o pôster deve aparecer completo.

## Não consegui verificar

- **Desenho no aparelho:** não rodei simulador nem aparelho. Meus quadros são do Chrome. O `react-native-svg` pode diferir nas pontas redondas e na opacidade.
- **Selos em outras larguras:** medi só a 280 pt, o pior caso, porque o selo tem tamanho fixo em pt. Não medi a 320 e 358 pt.
- **Gates não rodados:** `visual:qa:strict` e o `npm run quality` completo.
- **Correções sugeridas:** as coordenadas de I1, M2 e M4 saíram de busca geométrica com as funções do app, sem render final. Confira antes de aplicar.
- **Revisão especializada:** nenhuma afirmação de radiologia passou por profissional.
