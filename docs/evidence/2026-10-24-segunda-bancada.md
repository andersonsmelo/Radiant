# A segunda bancada: colimação, escolhida pelo custo medido

Medição de 2026-10-24, branch `claude/trilha-medalhao-design` sobre `8cb7092`
(tarefa 5 do [plano 3](../superpowers/plans/2026-10-21-aula-bancada.md)). A
spec ([seção 5](../superpowers/specs/2026-10-21-trilha-medalhao-e-aula-bancada-design.md#5-a-aula-bancada))
deixa a escolha entre **colimação** (abrir e fechar o feixe e ver dose e área) e
**posicionamento** (girar o paciente até a incidência) "depois de medir o custo
de cada uma".

## Como se mediu

Sem protótipo descartável na tela de desenvolvimento: por decisão do
controlador, porque o código das tarefas 1 a 4 já existia, o custo foi contado
nele (`radiant-app/src/features/bench/`,
`src/types/learningActivity.ts`, `InteractionAnswerValue.ts` e
`BenchStepRenderer.tsx`). A coluna da colimação traz o que a implementação
custou de fato, medido no diff depois de feita. A do posicionamento é
estimativa, feita sobre o shader e os tipos que existem hoje, porque não foi
implementado.

## Contagem

| Medida | Colimação (medido no diff) | Posicionamento (estimado sobre o código atual) |
| --- | --- | --- |
| Componentes novos | 1 arquivo, `CollimationImage.tsx` (61 linhas): a imagem, que é o `ExposureImage` com máscara, e o texto de área e produto dose-área. `BenchControlRow` sem nenhuma linha mudada. | 2: a imagem do fantoma girado e um indicador da rotação do paciente, porque o aluno precisa ver o paciente girar, e não só a radiografia. O controle de ângulo cabe no `BenchControlRow`. |
| Mudanças no shader | 1 uniforme (`field`), 1 constante (`UNEXPOSED`) e 3 linhas de código: a máscara retangular centrada. A geometria do fantoma não mudou. | Reescrever a geometria. Hoje cada estrutura é a corda de um cilindro de eixo vertical, com centro fixo em x (fêmur em 122, tíbia em 132, partes moles em 128, patela em (196, 140)), sem profundidade. Girar o paciente exige uma profundidade z para cada estrutura, rotação por um uniforme de ângulo, os dois côndilos separados (hoje são um alargamento só de `femurR`) e a fíbula, que o fantoma não tem. O fallback de `View`s (`PHANTOM_BONES`) teria de se mover com o ângulo. |
| Campos novos em `BenchPayload` | 0. Só se alargaram as uniões: `simulator` ganhou `'collimation'`, e `BenchControl.id` e `BenchGoal.control` ganharam `fieldWidth` e `fieldHeight`. O alvo `reach` já serve. | 1 ou 2. Controle `rotation` em graus e, provavelmente, o nome da incidência-alvo para a tela. Comparar com uma imagem de referência por ângulo pediria outro tipo de alvo. |
| Afirmações físicas ou anatômicas para o dono revisar | 4, de proteção radiológica: o produto dose-área é proporcional à área irradiada; a dose do feixe direto num ponto dentro do campo não muda ao colimar; campo menor reduz a radiação espalhada; colimar até a região de interesse é proteção radiológica. Mais 6 simplificações declaradas no topo de `collimationModel.ts`. | Pelo menos 6, anatômicas: a profundidade relativa de fêmur, tíbia, patela e fíbula; que rotação dá a incidência AP e qual dá o perfil; os critérios de sobreposição (côndilos sobrepostos no perfil verdadeiro, patela de perfil, cabeça da fíbula parcialmente coberta pela tíbia na AP); o sentido da rotação interna e externa. |
| Cabe no `exposureModel`? | Sim. Os tons do fantoma saem do mesmo modelo, na exposição de referência (70 kV, 10 mAs). A área e o produto dose-área saem de um modelo puro novo, `collimationModel.ts` (101 linhas, das quais 52 de comentário). | Só os tons. A posição de cada estrutura em função do ângulo seria um modelo geométrico novo, e os testes dele afirmariam anatomia, e não física. |
| Conflito com o rigor da spec | Nenhum: o fantoma continua estilizado, e a máscara não o torna uma incidência real. | Sim. "Girar até a incidência" ensina uma incidência real, e a spec manda que o fantoma seja estilizado, "nunca uma incidência real". |

## Decisão

**Colimação.** A contagem confirma a recomendação de 2026-10-21. A colimação
custou um componente, cinco linhas de shader, nenhum campo novo no payload e
quatro afirmações de proteção radiológica. O posicionamento pediria reescrever a
geometria do fantoma em três dimensões, um segundo componente e pelo menos seis
afirmações anatômicas novas. E esbarraria na regra de rigor, porque o alvo dele
é uma incidência real.

## O que a implementação entrega (para a tarefa 6)

- `simulator: 'collimation'`, com controles `fieldWidth` e `fieldHeight` em
  cm. O domínio do modelo vai de 1 cm até o tamanho da imagem: 27 × 33 cm, a
  10 unidades da prancheta por cm. Fora dele, a entrada é limitada.
- `collimationModel(input)`, puro: área em cm², produto dose-área relativo
  (`relativeDoseArea`), igual à área dividida pela do campo todo (o campo todo
  vale 1), e a fração da imagem que o campo cobre.
- A máscara no shader. Fora do campo, a imagem fica num tom claro uniforme, sem
  grão. Na bancada de exposição, `field` vale (1, 1) e a máscara não cobre nada.
- A tela mostra, além da imagem, "Campo de 18 × 24 cm, 432 cm²" e "Produto
  dose-área: 48% do campo todo". O texto segue o valor do passo, como o
  rótulo do controle, e a máscara acompanha o dedo no arrasto.
- A validação recusa a mistura: um controle de exposição numa colimação, ou o
  contrário, é `invalid-controls`. Um `reach` sobre controle de outro simulador
  é `invalid-goal`, e `match` numa colimação também, porque ele compara um
  contraste que a colimação não muda. Simulador desconhecido é a regra nova
  `invalid-simulator`.

## Para o dono revisar

As quatro afirmações e as seis simplificações estão no comentário do topo de
`radiant-app/src/features/bench/collimationModel.ts`. Três pontos pedem olhar
de quem conhece o equipamento:

1. **O que cai com a área é o produto dose-área, e não a dose.** A dose do
   feixe direto num ponto dentro do campo não muda ao colimar. A tela diz
   "Produto dose-área", e não "dose", e as frases da aula da tarefa 6 precisam
   fazer a mesma distinção.
2. **A faixa fora do campo é clara.** Sem feixe primário não há sinal, e na
   convenção da imagem (quanto menos sinal, mais claro) ela sai clara, como num
   filme sem exposição. Muitos equipamentos digitais a escurecem por processamento. Se a
   referência que o aluno conhece é a escura, basta trocar
   `UNEXPOSED_LUMINANCE`.
3. **O espalhamento não aparece na imagem.** O texto pode dizer que um campo
   menor reduz o espalhamento, mas a imagem dentro do campo é a mesma com
   qualquer campo.

## Limites para quem escrever a aula

- O alvo é `reach` num lado do campo. Com só `atMost`, fechar o campo até 1 cm
  também acerta e corta a anatomia. A aula precisa dar a faixa inteira
  (`atLeast` e `atMost`).
- A imagem não desenha a região de interesse. A aula a nomeia no enunciado.

## Correção de 2026-10-24

A primeira versão (`3fb646b`) dizia "Dose relativa: N%" na tela e afirmava que
a dose entregue ao paciente é proporcional à área. A grandeza proporcional à
área é o produto dose-área. A dose do feixe direto num ponto dentro do campo
não cai ao colimar. A revisão da tarefa apontou o erro, e a tela, o modelo
(`relativeDose` virou `relativeDoseArea`) e esta evidência foram corrigidos. As
contagens de linhas acima são as de depois da correção.
