# Relatório — variantes da amostra da L1 (FILA, 7a)

**Sessão:** 2026-09-28, de manhã (−03), na mesma conversa do 25 e do 20, a
pedido do dono.
**Branch:** `feat/d4-decisoes-de-revisao`, que é o da PR
[#38](https://github.com/andersonsmelo/Radiant/pull/38), ainda aberta.
**Run do Loop:** `run-1790594112450-2a18fb8e`.
**Decisão:** [ADR de 2026-09-28](../../adr/ADR-2026-09-28-variantes-da-l1-na-postura.md).

## Para o dono: o que confirmar (7b)

Mudaram **8 dos 20 itens**; os outros 12 estão idênticos à amostra de antes. O
✓ marca o gabarito. Confirmados os 8, o agente grava `L1_TEMPLATE_APPROVAL`
(FILA, 15), e a tela deixa de mostrar "Prévia".

Um ponto para olhar com atenção: **na variante do h08**, a pergunta passou a
ser pela superfície posterior, e o retorno e a dica continuam os da relação,
que falam da anterior ("Anterior é a frente do corpo, mesmo deitado").

### h08-ant-post

**Antes:**

```text
h08-ant-post · desafio · choice · prone/front
Pergunta: Em decúbito ventral, vista de frente, qual superfície do tórax é a anterior?
    Superfície 1: Painel com traço pontilhado.
  ✓ Superfície 2: Painel com contorno contínuo.
Se acertar: Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.
Se errar: Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.
Dica de primeiro contato: Anterior é a frente do corpo, mesmo deitado.
```

**Depois:**

```text
h08-ant-post · desafio · choice · prone/back
Pergunta: Em decúbito ventral, vista por trás, qual superfície do tórax é a anterior?
    Superfície 1: Painel com traço pontilhado.
  ✓ Superfície 2: Painel com contorno contínuo.
Se acertar: Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.
Se errar: Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.
Dica de primeiro contato: Anterior é a frente do corpo, mesmo deitado.
```

### h05-lat-dorsal-v

**Antes:**

```text
h05-lat-dorsal-v · desafio · tap · supine/back · variante
Pergunta: Em decúbito dorsal, vista por trás, qual mão pertence ao lado direito da pessoa?
    Mão 1: Aparece na parte de baixo do quadro.
  ✓ Mão 2: Aparece na parte de cima do quadro.
Se acertar: Você tomou o corpo examinado como referência, não o seu lado da tela.
Se errar: O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.
Dica de primeiro contato: Você usou o seu lado, não o da pessoa.
```

**Depois:**

```text
h05-lat-dorsal-v · desafio · tap · supine/front · variante
Pergunta: Em decúbito dorsal, vista de frente, qual mão pertence ao lado esquerdo da pessoa?
  ✓ Mão 1: Aparece na parte de baixo do quadro.
    Mão 2: Aparece na parte de cima do quadro.
Se acertar: Você tomou o corpo examinado como referência, não o seu lado da tela.
Se errar: O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.
Dica de primeiro contato: Você usou o seu lado, não o da pessoa.
```

### h07-sup-prof-v

**Antes:**

```text
h07-sup-prof-v · desafio · tap · supine/front · variante
Pergunta: Em decúbito dorsal, vista de frente, qual marcador está na camada mais profunda?
    Marcador 1: Marcador no contorno sólido mais externo.
  ✓ Marcador 2: Marcador na camada tracejada interna.
Se acertar: Superficial está mais perto da superfície.
Se errar: Compare as duas camadas locais, não a altura delas no quadro.
Dica de primeiro contato: Superficial é a camada mais externa.
```

**Depois:**

```text
h07-sup-prof-v · desafio · tap · anatomical/front · variante
Pergunta: Na posição anatômica, vista de frente, qual marcador está na camada mais profunda?
    Marcador 1: Marcador no contorno sólido mais externo.
  ✓ Marcador 2: Marcador na camada tracejada interna.
Se acertar: Superficial está mais perto da superfície.
Se errar: Compare as duas camadas locais, não a altura delas no quadro.
Dica de primeiro contato: Superficial é a camada mais externa.
```

### h08-ant-post-v

**Antes:**

```text
h08-ant-post-v · desafio · choice · prone/back · variante
Pergunta: Em decúbito ventral, vista por trás, qual superfície do tórax é a anterior?
    Superfície 1: Painel com traço pontilhado.
  ✓ Superfície 2: Painel com contorno contínuo.
Se acertar: Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.
Se errar: Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.
Dica de primeiro contato: Anterior é a frente do corpo, mesmo deitado.
```

**Depois:**

```text
h08-ant-post-v · desafio · choice · prone/back · variante
Pergunta: Em decúbito ventral, vista por trás, qual superfície do tórax é a posterior?
  ✓ Superfície 1: Painel com traço pontilhado.
    Superfície 2: Painel com contorno contínuo.
Se acertar: Anterior continua sendo a frente do corpo; a referência anatômica não vira cima ou baixo quando a pessoa deita.
Se errar: Não use a gravidade como referência. Anterior e posterior permanecem definidos pelo corpo, mesmo em outra postura.
Dica de primeiro contato: Anterior é a frente do corpo, mesmo deitado.
```

### h09-vf-med-lat-v

**Antes:**

```text
h09-vf-med-lat-v · desafio · true_false · supine/back · variante
Pergunta: Em decúbito dorsal, vista por trás, verdadeiro ou falso: o marcador 1 está mais afastado da linha mediana.
  No mapa: 1 = Marcador junto ao contorno externo do braço. · 2 = Marcador junto à linha tracejada central.
  ✓ Verdadeiro: A afirmação está correta.
    Falso: A afirmação está errada.
Se acertar: Medial é a relação com a linha mediana.
Se errar: Compare cada marcador com a linha mediana, não com a borda da tela.
Dica de primeiro contato: Medial é perto da linha mediana, não da borda.
```

**Depois:**

```text
h09-vf-med-lat-v · desafio · true_false · supine/front · variante
Pergunta: Em decúbito dorsal, vista de frente, verdadeiro ou falso: o marcador 1 está mais próximo da linha mediana.
  No mapa: 1 = Marcador junto ao contorno externo do braço. · 2 = Marcador junto à linha tracejada central.
    Verdadeiro: A afirmação está correta.
  ✓ Falso: A afirmação está errada.
Se acertar: Medial é a relação com a linha mediana.
Se errar: Compare cada marcador com a linha mediana, não com a borda da tela.
Dica de primeiro contato: Medial é perto da linha mediana, não da borda.
```

### h10-lat-ventral-v

**Antes:**

```text
h10-lat-ventral-v · desafio · choice · anatomical/front · variante
Pergunta: Na posição anatômica, vista de frente, qual mão pertence ao lado esquerdo da pessoa?
    Mão 1: Aparece à esquerda de quem observa.
  ✓ Mão 2: Aparece à direita de quem observa.
Se acertar: Você tomou o corpo examinado como referência, não o seu lado da tela.
Se errar: O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.
Dica de primeiro contato: Você usou o seu lado, não o da pessoa.
```

**Depois:**

```text
h10-lat-ventral-v · desafio · choice · prone/back · variante
Pergunta: Em decúbito ventral, vista por trás, qual mão pertence ao lado direito da pessoa?
  ✓ Mão 1: Aparece na parte de baixo do quadro.
    Mão 2: Aparece na parte de cima do quadro.
Se acertar: Você tomou o corpo examinado como referência, não o seu lado da tela.
Se errar: O lado direito ou esquerdo pertence ao corpo descrito. Troque a perspectiva do observador pela referência anatômica.
Dica de primeiro contato: Você usou o seu lado, não o da pessoa.
```

### h11-sup-inf-v

**Antes:**

```text
h11-sup-inf-v · desafio · tap · supine/back · variante
Pergunta: Em decúbito dorsal, vista por trás, qual marcador está mais próximo dos pés?
  ✓ Marcador 1: Marcador junto à extremidade dos pés.
    Marcador 2: Marcador junto à extremidade da cabeça.
Se acertar: Superior descreve proximidade da cabeça, não a parte mais alta da tela.
Se errar: Use a referência cabeça–pés do corpo, não a altura do quadro.
Dica de primeiro contato: Superior é perto da cabeça, não o alto da tela.
```

**Depois:**

```text
h11-sup-inf-v · desafio · tap · supine/front · variante
Pergunta: Em decúbito dorsal, vista de frente, qual marcador está mais próximo da cabeça?
    Marcador 1: Marcador junto à extremidade dos pés.
  ✓ Marcador 2: Marcador junto à extremidade da cabeça.
Se acertar: Superior descreve proximidade da cabeça, não a parte mais alta da tela.
Se errar: Use a referência cabeça–pés do corpo, não a altura do quadro.
Dica de primeiro contato: Superior é perto da cabeça, não o alto da tela.
```

### h12-vf-prox-dist-v

**Antes:**

```text
h12-vf-prox-dist-v · desafio · true_false · supine/front · variante
Pergunta: Em decúbito dorsal, vista de frente, verdadeiro ou falso: o marcador 2 está mais longe da ligação do braço com o tronco.
  No mapa: 1 = Marcador junto ao punho. · 2 = Marcador junto à ligação do braço com o tronco.
    Verdadeiro: A afirmação está correta.
  ✓ Falso: A afirmação está errada.
Se acertar: Proximal se aproxima da ligação do membro.
Se errar: Use a ligação com o tronco como referência do membro.
Dica de primeiro contato: Proximal é perto da ligação com o tronco.
```

**Depois:**

```text
h12-vf-prox-dist-v · desafio · true_false · anatomical/front · variante
Pergunta: Na posição anatômica, vista de frente, verdadeiro ou falso: o marcador 2 está mais longe da ligação do braço com o tronco.
  No mapa: 1 = Marcador junto ao punho. · 2 = Marcador junto à ligação do braço com o tronco.
    Verdadeiro: A afirmação está correta.
  ✓ Falso: A afirmação está errada.
Se acertar: Proximal se aproxima da ligação do membro.
Se errar: Use a ligação com o tronco como referência do membro.
Dica de primeiro contato: Proximal é perto da ligação com o tronco.
```

## O que mudou no código

- `l1ItemTemplates.ts`:
  - o ciclo de seis cenários (`nextScenario`) saiu;
  - entrou `variantScenario`, com a regra do caminho 1: a variante fica na
    mesma postura. Na anatômica, troca de vista. No dorsal e no ventral, fica
    na única vista real e pergunta o oposto (a outra mão, ou o outro termo);
  - as vistas reais estão numa tabela única.
- `l1HybridLessonPlan.ts`: o h08 passou de `prone/front` para `prone/back`.
- **Guardas:**
  - na amostra (`l1TemplateApproval.test.ts`): nenhuma pergunta se repete
    nos 20 itens, e nenhum item usa as vistas por baixo da mesa;
  - nos modelos (`l1ItemTemplates.test.ts`), para todo item numa vista real:
    a variante fica na postura, cai numa vista real, tem a mesma regra, não
    repete a pergunta original e tem o gabarito entre as opções. Ela
    substitui o teste antigo, que fixava o "próximo cenário".
- O teste da sessão dizia que o item "volta em outro cenário", o que deixou de
  ser verdade no dorsal e no ventral. Só o título mudou.
- A spec do piloto ganhou uma nota que aponta para a ADR nova.

## Evidência

**Medido, no Node `v20.20.2`:**
- **Vermelho antes do conserto,** as três guardas reprovaram pelo defeito
  real:
  - a duplicata: `h01-lat-frente` contra `h10-lat-ventral-v`;
  - as vistas por baixo da mesa: o `h08-ant-post` (`prone/front`) e as
    variantes do h05, do h09 e do h11 (`supine/back`);
  - a postura: a variante saía da anatômica para o dorsal.
- **Asserções vistas falhando por defeito injetado,** porque no vermelho
  natural a da postura disparava primeiro:
  - D1, a variante na mesma vista sem perguntar o oposto: disparou
    `"repete": true` e a guarda da duplicata (o `h10-lat-ventral-v`);
  - D2, o dorsal aceitando a vista por trás: disparou `"real": false` e a
    guarda das vistas na amostra (o h05-v, o h09-v e o h11-v).

  O arquivo foi restaurado e conferido com `cmp`. **Uma primeira tentativa de
  injeção não valeu:** o zsh passou os dois caminhos de teste como um
  argumento só, e o Jest respondeu "No tests found". Ela foi refeita com os
  caminhos em array.
- **Verde:** 19 suítes e 260 testes do currículo V3, com as guardas de
  geometria, de lateralidade e de validade intactas.
- **Gate** `EXPO_NO_DOTENV=1 npm run quality`, em 2026-09-28 às 08:19: exit 0,
  **153 suítes / 1459 testes** (eram 1457; entram as duas guardas da amostra,
  e a dos modelos substitui um teste), lint com 0 erros e 26 avisos, visual QA
  com 0 regressões.
- **Gabaritos conferidos à mão contra o item-base:** no h05, no dorsal visto de
  frente, a mão direita aparece em cima e a esquerda embaixo, e a variante
  marca a esquerda embaixo. No h09-v, o marcador 1 é o contorno externo, então
  a afirmação "mais próximo da linha mediana" é falsa. No h11-v, o gabarito é
  a cabeça.

**Não verificado:**
- os itens na tela: o piloto fica atrás de `SHOW_DEV_TOOLS`, e não pedi
  conferência no aparelho;
- a leitura pedagógica dos 8 itens, que é do dono (7b).

## Arquivos

- `radiant-app/src/features/curriculum-v3/hybrid-l1/`:
  - `l1ItemTemplates.ts`, `l1ItemTemplates.test.ts`;
  - `l1HybridLessonPlan.ts`;
  - `l1TemplateApproval.test.ts` e o snapshot dele;
  - `HybridLessonSession.test.ts`, só o título.
- `docs/adr/ADR-2026-09-28-variantes-da-l1-na-postura.md` (nova) e a nota na
  spec do piloto
- `docs/STATUS.md`, `docs/archive/STATUS_historico.md`, `docs/FILA.md`
  (7a fora e 7b com os 8 itens), `docs/archive/FILA_concluidos.md` e o
  roadmap
- este relatório e o
  [prompt (11)](2026-09-28-radiant-prompt-de-continuidade-11.md)

## O que fica

- **7b, do dono:** confirmar os 8 itens acima. Destrava o 15, a gravação da
  aprovação.
- **A próxima frente do agente é o 12,** o conserto do aquecimento.
- **A 1.4 continua esperando só o dono:** o 28 e o 30.
