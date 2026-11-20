# Troca das figuras da trilha — plano de implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendada) ou superpowers:executing-plans para executar este plano tarefa a tarefa. Os passos usam caixas (`- [ ]`) para acompanhamento.

> **Estado em 2026-11-20 e como continuar:** a fase 0 está feita (PR #96) e a fase 1 tem 19 figuras no app (PR #97). Leia primeiro o [plano de continuidade](2026-11-20-figuras-continuidade.md): ele diz o que falta, as decisões do dono tomadas depois deste plano, o passo a passo de um lote e os erros que se repetiram. Onde ele e este plano divergem, vale ele. Mudanças em relação ao texto abaixo: imagem gerada foi abandonada para anatomia; figuras de movimento de anatomia entram paradas; `corpo-inteiro-composicao` e os três cortes axiais saíram da fase 1 e esperam o método das fases 3 a 5; os briefs dos agentes estão em `scripts/content/figuras/briefs/`.

**Objetivo:** trocar as figuras didáticas da trilha `rtg-2026`, reprovadas pelo dono em 2026-11-19, por arte feita com o método certo para cada tipo, sem reescrever as aulas.

**Arquitetura:** o mecanismo do app não muda de forma: cada figura continua sendo um `DiagramSpec` em camadas de SVG com movimento por camada, apontado pelas aulas por `diagramId`. O que muda é a origem da arte (acervo aberto, skill `anatomy`, código redesenhado, imagem real), o conversor que a prepara para o `react-native-svg`, o registro de crédito e licença, e a guarda que prende cada área de toque à estrutura que ela nomeia.

**Stack:** React Native com `react-native-svg` (`SvgXml`) e Reanimated; conversor em Node com Chrome headless; skill `anatomy` (`~/.agents/skills/anatomy`); verificador de aulas `scripts/content/rtg-lesson-lint.mjs`; Maestro para a prova no simulador.

**Especificação:** não há documento de desenho separado. As decisões do dono que este plano executa estão na seção "Decisões já tomadas"; a evidência está em `.superpowers/sdd/2026-11-19-amostra-figuras/` (amostra publicada, `inventario.md`, `piloto/relatorio.md`). A tarefa 1 grava essas decisões numa ADR.

## Decisões já tomadas

Todas de Anderson Melo, em 2026-11-19, nesta ordem:

1. "essas animações estão pessimas muitos ruins mesmos, não e possivel que a comunidade esteja fazendo dessa forma com tantas opções de skills, plugins e mcps": as figuras em SVG escrito por modelo estão reprovadas.
2. "Sim, faça a amostra" e "Use o Canva": amostra de quatro figuras por outros métodos, com imagem gerada pela conta dele no Canva.
3. "Sim, instale": skill `anatomy` instalada.
4. "Sim, essa combinação": acervo aberto para anatomia, `anatomy` para equipamento e cena; imagem gerada só onde nenhuma das duas cobre, com conferência de exatidão; fluxos por último.
5. "Sim, escreva o plano".

O que ele **não** decidiu, e este plano traz como proposta: o método para gráficos, fluxos e esquemas de radiografia (48 figuras); a ordem dos lotes; o que fazer com a pilha de PRs #89 a #95.

## Restrições globais

- Nenhuma figura entra em volume antes de o dono ver a primeira do lote rodando no simulador. Foi a falta disso que produziu 101 figuras reprovadas.
- Nenhuma aula é reescrita por causa da arte. O `diagramId` não muda. O que pode mudar numa aula: coordenadas de alvos e, quando a cena nova não puder ter um alvo antigo, o item que dependia dele, com revisão.
- Cena e equipamento são construídos **a partir dos alvos que as aulas cobram**, lidos de `content-manifest/rtg-2026/aulas/*.json`, nunca o contrário. O piloto do leito saiu sem dois dos cinco alvos da M25.05.
- Licença de arte de terceiros: só CC0, domínio público declarado ou CC BY, conferida na página do arquivo, com autor, URL, licença, data e SHA-256 registrados e crédito na tela de créditos do app. Nunca CC BY-SA, NC ou ND.
- Imagem gerada por modelo: só para ilustração, nunca para radiografia ou imagem de exame; cada uma passa por conferência de exatidão registrada antes de entrar numa aula.
- Sem texto dentro do desenho. Base internacional. As regras de `docs/content/2026-11-05-guia-de-autoria-rtg-2026.md` continuam valendo.
- Arte importada: quadro 320 x 240, de 1 a 8 camadas, teto de 240 KiB de SVG por figura, e só o que o `SvgXml` aceita (lista na seção 4 do relatório do piloto).
- Figura com área de toque fica parada no quadro de pôster; movimento só em `visual` de conceito. Regra do app, mantida.
- Testes e build do app em Node 20; `loop` em Node 24. O gate é `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 npm run quality`, e nada menos.
- Merge, build e loja são do dono.

## O que o inventário mediu

106 figuras: 86 no catálogo (PRs até a #95) e 20 do lote 5, que parou. Das 86, 72 são usadas em aula e 14 são sementes da fase B ainda sem aula, reservadas para a fase D.

| Tipo | No catálogo | Usadas em aula | Método | Fase deste plano |
| --- | --- | --- | --- | --- |
| A. Anatomia | 24 | 24 | Acervo aberto | 1 |
| B. Equipamento e cena | 27 | 22 | Skill `anatomy` | 2 |
| C. Gráfico e física | 23 | 14 | Código, redesenhado (proposta) | 3 |
| D. Fluxo | 3 | 3 | Código, com conjunto de ícones (proposta) | 4 |
| E. Esquema de radiografia | 9 | 9 | Imagem real onde houver licença; senão redesenho (proposta) | 5 |

Este plano troca as 72 usadas. As 14 sementes e as 20 do lote 5 nascem no método novo quando a aula que as usa for escrita.

## Foco de revisão

O que os testes de cada tarefa não exercitam sozinhos e mais ameaça quem usa o app:

1. **Área de toque fora da estrutura depois da troca.** Espera-se que todo alvo de aula caia dentro da região que a figura declara com aquele nome. Coberto pela tarefa 4.
2. **Android lento ou em branco com SVG pesado.** Espera-se a figura na tela em menos de um segundo e sem tela vazia num aparelho mediano. Coberto pela tarefa 6.
3. **Arte de terceiro sem crédito no app.** Espera-se que toda figura importada com licença CC BY apareça na tela de créditos. Coberto pela tarefa 3.
4. **Movimento reduzido.** Espera-se o quadro de pôster, que precisa ensinar a ideia parado. Coberto pela tarefa 2.
5. **Peso do pacote.** Espera-se que a soma das figuras não passe do orçamento fixado na tarefa 6. Coberto pela tarefa 6.

---

## Fase 0 — Base (antes de qualquer lote de arte)

Branch `claude/figuras-base`, criada de `claude/figuras-piloto` (commit `bd78740e`), que está sobre o lote 4.

### Tarefa 1: ADR e estado

**Artefatos:**
- Criar: `docs/adr/ADR-2026-11-19-figuras-por-tipo.md`
- Modificar: `docs/STATUS.md` (seção da trilha dobrada), `docs/plans/2026-07-27-radiant-launch-roadmap.md`

- [ ] Escrever a ADR com: contexto (101 figuras reprovadas, conferidas só em imagem parada), as cinco decisões da seção "Decisões já tomadas" com as frases do dono, o método por tipo, o que fica em aberto, e as consequências (lote 5 parado; PRs #89 a #95 com a arte antiga).
- [ ] Editar o `STATUS.md`: lote 5 parado em 2026-11-19 e por quê; figuras em troca; link para este plano.
- [ ] Verificar: `node scripts/qa/docs-contract.mjs` imprime `PASS documentation contract`.
- [ ] Commit.

### Tarefa 2: movimento com fases e curva

O piloto mostrou o limite: interpolação linear, sem "acende e apaga" dentro de um ciclo.

**Arquivos:**
- Modificar: `radiant-app/src/ui/diagrams/diagramTypes.ts`, `diagramMotion.ts`
- Teste: `radiant-app/src/ui/diagrams/diagramMotion.test.ts`

**Interfaces:**
- Produz: em `LayerMotion`, o campo opcional `keys?: ReadonlyArray<readonly [at: number, value: number]>` (frações crescentes de 0 a 1; `value` é a fração do movimento da camada, de 0 a 1) e `ease?: 'linear' | 'inOut'`. Sem `keys`, vale o comportamento atual, inclusive `range`.

- [ ] Escrever os testes que falham: com `keys: [[0,0],[0.3,1],[0.6,1],[0.8,0],[1,0]]` num `fade` de 0 a 1, a opacidade é 0 em 0, 1 em 0,45, 0,5 em 0,7 e 0 em 0,9; com `ease: 'inOut'`, o valor em 0,25 de um trecho é menor que 0,25; `keys` fora de ordem ou fora de 0 a 1 lança erro na validação do registro.
- [ ] Rodar e ver falhar: `cd radiant-app && npx jest src/ui/diagrams/diagramMotion.test.ts`. Guardar a saída vermelha em `docs/evidence/2026-11-19-figuras/vermelho-keys.txt`.
- [ ] Implementar em `fractionAt`.
- [ ] Teste de movimento reduzido em `DiagramView.test.tsx`: com movimento reduzido, a figura mostra `posterAt` e nenhuma camada anima.
- [ ] Rodar: `npx jest src/ui/diagrams`. Esperado: tudo passa.
- [ ] Commit.

### Tarefa 3: registro de origem e crédito das figuras

**Arquivos:**
- Criar: `content-manifest/rtg-2026/figuras.json` (lista de `{ id, origem: 'acervo' | 'anatomy' | 'codigo' | 'gerada', sourcePage?, author?, license?, licenseUrl?, retrievedAt?, sha256Original?, modification?, conferidaPor? }`)
- Criar: `scripts/content/rtg-figuras.test.mjs`
- Modificar: o gerador `scripts/content/build-rtg-batches.mjs` (emite os créditos junto de `rtgImages.ts`) e a tela de créditos de imagem do app
- Modificar: `radiant-app/src/ui/diagrams/diagramRegistry.test.ts` (a lista fechada de duas figuras importadas vira "toda figura com `art: 'imported'` tem entrada em `figuras.json`")

- [ ] Testes que falham: figura `art: 'imported'` sem entrada no registro reprova; entrada `origem: 'acervo'` sem `license` em {CC0, domínio público, CC BY *} reprova; entrada `origem: 'gerada'` sem `conferidaPor` reprova; licença CC BY sem crédito na lista gerada reprova.
- [ ] Ver falhar com o defeito nomeado (tirar a licença do crânio do piloto) e guardar a saída vermelha.
- [ ] Implementar; registrar o crânio (LadyofHats, domínio público, Wikimedia Commons) e o leito (`origem: 'anatomy'`).
- [ ] Rodar `node --test scripts/content/*.test.mjs` e `npx jest src/ui/diagrams src/features` focado na tela de créditos.
- [ ] Commit.

### Tarefa 4: alvos presos à figura

**Arquivos:**
- Criar: `content-manifest/rtg-2026/figuras/<id>.alvos.json` (por figura: `[{ nome, x, y, width, height }]`, normalizado no quadro)
- Criar: `scripts/content/figuras/alvos-preview.mjs` (grava um PNG da figura com as regiões declaradas e os alvos de cada aula por cima)
- Modificar: `scripts/content/rtg-lesson-lint.mjs` e seu teste

**Interfaces:**
- Produz: regra `figure-target-off-region`: em `hotspot`, `label` e `risk-hunt`, todo alvo cujo rótulo de gabarito corresponde a um `nome` declarado precisa ter o centro dentro da região declarada; alvo com nome que a figura não declara reprova com `figure-target-unknown`. Vale só para figuras que têm arquivo de alvos, para não reprovar o catálogo antigo de uma vez.

- [ ] Testes que falham: unidade sintética com alvo "Occipital" fora da região declarada reprova com `figure-target-off-region`; com nome não declarado, `figure-target-unknown`; dentro da região, passa. A guarda exige a posição **e** que a região esteja dentro do quadro.
- [ ] Ver falhar com o defeito específico (as coordenadas atuais do Occipital na M25.01, que o piloto mostrou na borda do osso) e guardar a saída vermelha.
- [ ] Implementar a regra e o script de prévia.
- [ ] Declarar os alvos do crânio e corrigir a M25.01 com as coordenadas do relatório do piloto; rodar o verificador na unidade.
- [ ] Commit.

### Tarefa 5: conversor versionado

**Arquivos:**
- Criar: `scripts/content/figuras/convert.mjs`, `build-spec.mjs` (a partir de `.superpowers/sdd/2026-11-19-amostra-figuras/piloto/convert.mjs` e `build-specs.mjs`), `scripts/content/figuras/README.md`
- Criar: `scripts/content/figuras/convert.test.mjs`

- [ ] Testes que falham, com SVGs pequenos de entrada: classe CSS vira atributo; `rgba()` vira hex mais opacidade; regra com seletor de pai (`.a .b`) mantém a cor (o defeito do piloto); gradiente fica na camada que o usa; `filter` sai e o relatório da conversão lista a perda.
- [ ] Ver falhar, implementar movendo o código do piloto, rodar.
- [ ] Regenerar os dois specs do piloto pelo script versionado e conferir que o `git diff` dos specs é vazio.
- [ ] Commit.

### Tarefa 6: orçamento de peso e prova em Android

O piloto mediu 75 e 226 KiB por figura (31 e 44 KiB comprimidos) só no iOS.

**Artefatos:**
- Criar: `docs/evidence/2026-11-19-figuras/orcamento.md`
- Modificar: `radiant-app/src/ui/diagrams/diagramRegistry.test.ts` (teto total)

- [ ] Medir o pacote JS antes e depois das duas figuras do piloto (`npx expo export --platform ios` e `android`, tamanho do bundle Hermes) e projetar para 72 figuras.
- [ ] Rodar as duas aulas do piloto no emulador Android (`adb reverse tcp:8081 tcp:8081`, dev client por `exp+radiant-app://…`), capturar com `uiautomator` e vídeo, e medir o tempo até a figura aparecer.
- [ ] Regra de decisão, escrita antes de medir: se a projeção passar de 8 MiB de bundle não comprimido, ou se o Android levar mais de 1 s para mostrar o leito, as camadas paradas das figuras do tipo B passam a ser imagem (WebP) e só as móveis ficam em SVG; a tarefa então ganha um passo de implementação e teste dessa variante antes da fase 2.
- [ ] Fixar o teto total no teste do registro com o número medido mais folga de 20%.
- [ ] Encerrar app, Metro, Gradle (`./gradlew --stop`) e emulador.
- [ ] Commit da evidência.

### Tarefa 7: roteiro de prova no simulador

**Arquivos:**
- Criar: `scripts/qa/figuras-no-simulador.mjs` (dado um conjunto de `diagramId`, acha as aulas e os passos que os mostram, gera um roteiro do Maestro que abre cada um e grava a captura)
- Teste: `scripts/qa/figuras-no-simulador.test.mjs`

- [ ] Teste: para `cranio-de-perfil-ossos`, o roteiro gerado contém o `openLink` da M25 aula 01 e um `takeScreenshot` depois do passo 4.
- [ ] Implementar; rodar para as duas figuras do piloto; conferir as capturas.
- [ ] Commit.

### Portão do dono 0

- [ ] Rodar o gate completo com a máquina livre (carga de 1 minuto abaixo de 5): `cd radiant-app && EXPO_NO_DOTENV=1 CI=1 caffeinate -i npm run quality`.
- [ ] Push e PR em rascunho sobre a #95.
- [ ] Mandar ao dono: as capturas de iOS e Android, o orçamento e a decisão da tarefa 6. **Esperar o aceite antes da fase 1.**

---

## Fase 1 — Anatomia por acervo aberto (24 figuras)

Lotes de seis. Em cada lote, a primeira figura vai ao dono no simulador antes das outras cinco.

| Lote | Figuras |
| --- | --- |
| 1A | `cranio-de-perfil-ossos` (feito no piloto), `seios-da-face`, `linhas-do-cranio`, `esqueleto-axial-apendicular`, `osso-longo`, `articulacao-sinovial` |
| 1B | `coluna-regioes`, `vertebra-tipica`, `coluna-sagital-e-axial`, `pelve-de-frente`, `femur-proximal-e-quadril`, `joelho-frente-e-perfil` |
| 1C | `ossos-do-pe`, `marcos-de-superficie`, `respiracao-diafragma`, `circulacao-dupla`, `trato-digestivo`, `sistema-urinario` |
| 1D | `sistema-nervoso`, `corte-abdome-superior`, `corte-pelve`, `corte-pescoco`, `contraste-no-corpo`, `corpo-inteiro-composicao` |

### Tarefa 8 (repetida por lote): um lote de anatomia

**Artefatos por figura:** `specs/<id>.ts`, entrada em `figuras.json`, `figuras/<id>.alvos.json`, original em `docs/evidence/2026-11-19-figuras/originais/<id>.<ext>` quando a licença permitir redistribuir, captura do simulador.

- [ ] Ler nas aulas os alvos que cada figura do lote precisa ter (nomes e formato), e escrever a lista em `docs/evidence/2026-11-19-figuras/lote-<n>.md`.
- [ ] Buscar no Wikimedia Commons, Servier Medical Art, OpenStax e Bioicons a arte que tenha **todos** os alvos; conferir a licença na página; registrar. Critério de completude: duas buscas com termos diferentes por figura, e a contagem de alvos cobertos por candidata.
- [ ] Sem arte que cubra tudo, nesta ordem: compor de duas artes do mesmo autor; imagem gerada com conferência de exatidão por um revisor independente, contra uma fonte aberta lida, registrada em `conferidaPor`; redesenho em código pela fase 3. Registrar qual caminho e por quê.
- [ ] Converter, enquadrar em 320 x 240, recolorir sem redesenhar forma, separar em camadas onde houver movimento.
- [ ] Declarar os alvos, gerar a prévia com `alvos-preview.mjs`, olhar o PNG e corrigir as aulas onde o verificador reprovar.
- [ ] Rodar: verificador nas unidades tocadas, `build-rtg-batches.mjs --check`, `npx jest src/ui/diagrams src/features/student-checkpoints/batches`.
- [ ] Primeira figura do lote: rodar `figuras-no-simulador.mjs`, mandar a captura ao dono e **esperar**.
- [ ] Depois do aceite: as outras cinco, capturas de todas, gate completo, commit, push.

`respiracao-diafragma` e `circulacao-dupla` são laços: a arte precisa vir em camadas, e a prova é vídeo, não captura.

---

## Fase 2 — Equipamento e cena pela skill `anatomy` (22 figuras)

### Tarefa 9: kit Radiant

A amostra mostrou gente como "manequins de cilindros e esferas" e uma hora de modelagem por cena. O kit ataca os dois.

**Arquivos:**
- Criar: `scripts/content/figuras/kit/` (módulos sobre o `kit/` da skill): `pessoa.mjs` (em pé, sentada, deitada; com e sem avental; adulto e criança), `tubo.mjs` (cabeçote, colimador, feixe), `detector.mjs`, `mesa.mjs`, `leito.mjs`, `bucky-mural.mjs`, `biombo.mjs`, `paleta.mjs` (os tons escuros que o piloto teve de reescrever)
- Criar: `scripts/content/figuras/kit/kit.test.mjs`

- [ ] Testes: cada peça devolve SVG que passa nas réguas de arte importada; a pessoa em pé cabe em 44 pt de largura mínima de toque no quadro; a paleta só usa os tons registrados.
- [ ] Construir as peças; renderizar uma prancha com todas (`docs/evidence/2026-11-19-figuras/kit.png`).
- [ ] **Portão do dono:** mandar a prancha, com atenção à figura humana. Sem aceite da pessoa, não há fase 2. Se a figura humana isométrica não convencer, a alternativa a propor é pessoa em silhueta de acervo aberto sobre equipamento isométrico.

### Tarefa 10 (repetida por lote): um lote de cenas

Lotes de cinco ou seis, na ordem das unidades: 2A `tubo-raios-x`, `tubo-emitindo`, `anodo-giratorio`, `conferencia-de-identidade`, `pontos-de-contato-da-sala`, `itens-de-emergencia-da-sala`; 2B `transferencia-maca-mesa`, `dosimetro-no-corpo`, `produto-dose-area`, `raio-x-movel-no-leito`, `trauma-raio-horizontal`; 2C `fluoroscopia-cadeia`, `sala-de-fluoroscopia-espalhada`, `contencao-pediatrica`, `colimacao-pediatrica`, `idoso-apoios-e-riscos`, `gestante-campo-e-feixe`; 2D `dxa-dois-feixes`, `dxa-posicionamento`, `radiografia-veterinaria`, `radiografia-de-objeto`, `teste-de-feixe`.

- [ ] Para cada cena, listar os alvos que as aulas cobram, com o que cada um precisa mostrar (por exemplo, na M25.05: pessoa sem avental junto à cabeceira e leito vizinho no sentido do feixe). A cena só começa com a lista fechada.
- [ ] Construir com o kit; conferir a técnica contra o texto da aula (posição do tubo, do detector, de quem fica na sala).
- [ ] Converter, declarar alvos, prévia, verificador, testes, como na tarefa 8.
- [ ] Onde a cena nova não puder ter um alvo antigo, reescrever o item e mandá-lo a um revisor independente, com parecer em `docs/evidence/2026-11-19-figuras/`.
- [ ] Primeira cena do lote ao dono, no simulador; depois as demais; gate; commit; push.

---

## Fase 3 — Gráficos e física em código (14 figuras) — proposta

`grandezas-de-dose`, `dano-ao-dna`, `histograma-e-lut`, `realce-e-suavizacao`, `compressao-de-imagem`, `espectro-de-raios-x`, `retificacao-de-onda`, `circuito-do-gerador`, `fluoroscopia-pulsada`, `relaxacao-t1-t2`, `linha-do-tempo-tr-te`, `ciclo-de-testes`, `coincidencia-de-campo`, `nivel-de-referencia`.

Aqui o código é o método certo; o que faltou foi desenho. A proposta:

### Tarefa 11: gramática dos gráficos

- [ ] Carregar a skill `dataviz` e fixar, em `docs/content/2026-11-19-gramatica-de-graficos.md`, eixos, espessuras, uso de cor, marcas e o movimento (com a curva da tarefa 2), com três gráficos de exemplo redesenhados.
- [ ] **Portão do dono:** os três exemplos no simulador, um deles animado.

### Tarefa 12: os 14 gráficos

- [ ] Redesenhar em dois lotes de sete seguindo a gramática; alvos, prévia, verificador e testes como nas outras fases; primeira figura de cada lote ao dono.

---

## Fase 4 — Fluxos (3 figuras) — proposta

`cadeia-de-custodia`, `fluxo-de-pesquisa`, `fluxo-ris-pacs`.

### Tarefa 13: conjunto de ícones e os três fluxos

- [ ] Escolher um conjunto de ícones aberto com licença aceita (por exemplo, Lucide ou Tabler, licenças MIT e ISC, a conferir e registrar) em vez de desenhar cada ícone; registrar em `figuras.json`.
- [ ] Refazer os três fluxos com ele e com o ponto que percorre as setas; primeira ao dono; gate; commit.

---

## Fase 5 — Esquemas de radiografia (9 figuras) — proposta

`radiografia-roteiro`, `artefatos-de-objeto`, `artefatos-do-detector`, `monitor-e-padrao-de-teste`, `ponderacoes-no-encefalo`, `supressao-de-gordura`, `artefatos-de-rm`, `dxa-regioes-de-interesse`, `dxa-interferencias`.

São desenhos que imitam uma imagem de exame. A proposta é trocar por imagem real onde existir com licença CC0 ou CC BY e sem identificação de paciente, pelo procedimento do lote 3 (`docs/evidence/2026-11-19-unidades-irmas/README.md`), e redesenhar em código, pela gramática da fase 3, onde não existir. Imagem de exame nunca é gerada por modelo.

### Tarefa 14: busca e decisão por figura

- [ ] Para cada uma das nove, buscar imagem real; registrar achada ou não, com licença.
- [ ] **Portão do dono:** a tabela de achadas e não achadas, com a proposta por figura. As aulas que rotulam anatomia fina sobre o esquema (por exemplo, `dxa-regioes-de-interesse`) continuam em desenho, porque IA não é fonte do que uma imagem real mostra.
- [ ] Executar o que ele aceitar, com os itens das aulas ajustados e revisados.

---

## Fase 6 — Fecho

### Tarefa 15: catálogo, guia e estado

- [ ] Atualizar o catálogo do guia de autoria (origem de cada figura, alvos declarados, o brief novo de figura).
- [ ] Reescrever `brief-diagramas.md` dos lotes como brief por tipo; aposentar a régua de paleta fechada para o que virou arte importada.
- [ ] `STATUS.md`, roadmap, evidência com as capturas de todas as figuras, gates medidos.
- [ ] Revisão final do branch inteiro por revisor independente no modelo mais capaz.

## O que fica com o dono

- Aceitar ou trocar o método das fases 3, 4 e 5.
- Ver a primeira figura de cada lote e o kit de pessoas.
- **A pilha de PRs #89 a #95.** Proposta: não mesclar agora. A troca das figuras entra em PRs empilhadas depois da #95, e a pilha é mesclada quando as 72 figuras usadas estiverem trocadas. A alternativa é mesclar já: não recomendo, porque a arte reprovada iria para a `main`.
- **Lotes 5 e 6 da fase C.** Proposta: retomar depois do portão 0 e do kit, com as figuras já no método novo. Os 20 desenhos do lote 5 feitos no método antigo são descartados; a lista de aulas do lote 5 continua valendo.
- Merge, build e loja.

## Tamanho

Medido na amostra e no piloto: uma figura de acervo levou cerca de 11 minutos de agente; uma cena da `anatomy`, cerca de 16 minutos mais 25 de conversão e prova no app. O kit deve baixar o segundo número, mas isso não está medido. Uma estimativa honesta para as 72 figuras, com os portões do dono no caminho: de seis a dez janelas de uso de cinco horas, em vários dias. A fase 0 cabe em uma.
