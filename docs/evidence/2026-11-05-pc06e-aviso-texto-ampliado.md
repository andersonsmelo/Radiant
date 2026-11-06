# PC06-E — aviso de retirada na troca de texto ampliado

Medido em **05/11/2026, America/Bahia**, na worktree `trilha-2026-10-20`, branch
`claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810`, com trabalho anterior não
commitado preservado. Objetivo: corrigir o corte persistente de título e corpo ao
alterar a escala com `ContentUpdatedScreen` aberto. Recorte do PC06-E; PC06 segue
aberto para a experiência real com leitor de tela. Offline permanece no primeiro
lote promovido, conforme decisão de 04/11 registrada no estado vivo.

## Causa, reprodução e mudança

No E262, `/learn?blockId=lesson-1` abriu o aviso real. A troca `large →
accessibility-extra-extra-extra-large` conservava o título em duas linhas e o
corpo em três linhas de altura, embora as letras crescessem. A
[captura anterior](2026-11-05-pc06e-aviso-texto-ampliado/retirado-antes-ax5.png)
mostra o corte persistente. A suíte anterior do aviso passou em 9/9 testes.

A tela não observava a escala nem invalidava os nós nativos de texto quando ela
mudava. A correção usa `useWindowDimensions().fontScale` e chaves específicas nos
dois `Text`, como no padrão já existente em `GroupedList` e nas prévias. A chave
usa o valor exato da escala, inclusive entre dois tamanhos já ampliados.

A tela, o `ScrollView`, o botão e a referência de anúncio único permanecem
montados. Textos, destino `/(tabs)`, estilos, limites de escala, economia,
catálogo e armazenamento não foram alterados. Não foi adicionado código de
instrumentação permanente. O fluxo de revisão usa a mesma correção com seu corpo
próprio, sem criar conteúdo ou dados pessoais de teste.

## Guardas e validação focada

Foi aplicada a sequência teste vermelho → correção mínima → verde. Recibos locais
em `.loop/runs/run-1793875917068-c8297725/`:

- `notice-red.log`: quatro falhas específicas, título/corpo nas duas variantes
  preservavam o mesmo nó nativo; a guarda de foco já passava.
- `notice-focus-red.log`: retirar somente a guarda de anúncio produziu duas
  chamadas em vez de uma após a troca. Mutação restaurada.
- `regression-final.log`: **4 suítes/30 testes passaram** —
  ContentUpdatedScreen, ContentTransition, EditorialPreviewLab e rota híbrida.
  Cinco casos novos verificam remedição, continuidade da tela/botão e pedidos
  de foco/anúncio. Escalas sintéticas 1 → 3,1 → 2,76 → 3,1 → 1; não pretendem
  reproduzir a tabela de fontes do iOS.
- `lint-final.log` e `typecheck-final.log`: aprovados, sem erro/aviso emitido
  para os dois arquivos de código/teste deste recorte.
- `visual.log`: zero regressões novas, 41 baseline e 3 exceções existentes.

App/testes no Node **20.20.2**, `EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand
--runTestsByPath <arquivos>`. Loop no Node **24.14.1**. O gate completo é o
configurado, incluindo `EXPO_NO_DOTENV=1 CI=1 npm run quality` e a suíte inteira
sem cache, e não apenas as suítes tocadas. Resultado final registrado abaixo.

## Prova nativa

Alvo: **E262D4C1-99BE-496B-8567-0291C14E6533**, iOS **26.5**, cliente existente
`com.ascendcreative.radiant`, **1.4.0 (3)**, sem build/instalação.
SHA-256 do executável permaneceu
`f8a174af49e308e68545e84aa4572e75668fc87cad1f985bafcbe6c7807bc18b`.
SHA-256 final de `ContentUpdatedScreen.tsx`:
`e7e00c45d65fc3dec46e0025a76e6865868340bd99671ca5f41e1b647c7b76c6`.

Metro no Node 20, em modo de observação, sem `CI=1`, com
`EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1
EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1`. Foram usadas as entradas existentes
`/learn?blockId=lesson-1` e `/review`, sem ler o container privado ou criar fixtures.

Foram exercitados normal→AX5 com a tela aberta, AX4→AX5, montagem inicial em AX5
e a versão de revisão normal→AX5. Capturas conservadas no escopo:

- [Retirada depois, normal](2026-11-05-pc06e-aviso-texto-ampliado/retirado-depois-normal.png).
- [Retirada depois, AX5 dinâmico](2026-11-05-pc06e-aviso-texto-ampliado/retirado-depois-ax5-dinamico.png).
- [Retirada depois, AX5 inicial](2026-11-05-pc06e-aviso-texto-ampliado/retirado-depois-ax5-inicial.png).
- [Retirada depois, AX4→AX5](2026-11-05-pc06e-aviso-texto-ampliado/retirado-depois-ax4-ax5.png).
- [Revisão depois, AX5 dinâmico](2026-11-05-pc06e-aviso-texto-ampliado/revisao-depois-ax5-dinamico.png).

As capturas confirmam redistribuição do topo, em lugar da altura antiga cortada.
Em AX5 o conteúdo ultrapassa o viewport e precisa de rolagem; as imagens do topo
não provam sozinhas a integridade do corpo abaixo. Por isso foram observados
`onTextLayout` e `onLayout` nativos com instrumentação temporária, retirada antes
das capturas finais e dos testes finais. Apenas identidade, escala e geometria
foram registradas, sem conteúdo privado. Nenhum estilo ou altura foi modificado
pela instrumentação. Não foi conferida rolagem por gesto neste recorte.

**Correção da própria medição:** a primeira coleta juntava eventos só por campo
(título/corpo) e escala. Misturou o corpo da retirada (943 pt) com as linhas da
revisão (1199,856 pt), gerando um aparente corte. Ambas as telas ainda estavam
montadas na pilha. A segunda coleta vinculou `nativeEvent.target`, variante e
escala; as **13 medições pareadas couberam na própria caixa**. Abaixo está o
recibo numérico versionável, em pt, com três casas decimais; os limites foram
comparados antes do arredondamento. Não são valores esperados fabricados pelo
modelo nem uma simulação de Jest.

| Nó nativo | Variante | Campo | Escala recebida | Linhas | Fim da última linha | Altura da caixa |
|---|---|---|---|---|---|---|
| 630 | retirada | corpo | 1 | 3 | 72.000 | 72.000 |
| 914 | retirada | título | 1 | 2 | 76.000 | 76.000 |
| 918 | retirada | corpo | 1 | 3 | 72.000 | 72.000 |
| 950 | retirada | título | 3.571 | 6 | 814.188 | 814.333 |
| 954 | retirada | corpo | 3.571 | 11 | 942.744 | 943.000 |
| 958 | retirada | título | 1 | 2 | 76.000 | 76.000 |
| 962 | retirada | corpo | 1 | 3 | 72.000 | 72.000 |
| 984 | revisão | título | 1 | 2 | 76.000 | 76.000 |
| 988 | revisão | corpo | 1 | 4 | 96.000 | 96.000 |
| 1014 | retirada | título | 3.571 | 6 | 814.188 | 814.333 |
| 1018 | retirada | corpo | 3.571 | 11 | 942.744 | 943.000 |
| 1022 | revisão | título | 3.571 | 6 | 814.188 | 814.333 |
| 1026 | revisão | corpo | 3.571 | 14 | 1199.856 | 1200.000 |

A verificação é `max(linha.y + linha.height) ≤ caixa.height + 0,1 pt`, por mesmo
nó, variante e escala. Recibos completos locais: `native-layout-events-v2.json`,
`metro-diagnostics.log` e `native-inventory.json`. A coleta sem identidade está
preservada em `native-layout-events.json` como diagnóstico descartado, não prova
de falha do código corrigido. A remedição nativa foi vista nos dois corpos:
retirada em AX5, 11 linhas/943 pt; revisão em AX5, 14 linhas/1200 pt.

Isso comprova a resolução do corte vertical por altura antiga, com redistribuição
nativa. Palavras longas ainda podem quebrar em AX5. Não mede VoiceOver/TalkBack,
leitura audível, foco real de leitor, alcance do botão por gesto ou Android 200%.
A guarda de anúncio/foco foi verificada por chamadas na árvore de testes; o aceite
integral de acessibilidade permanece pendente em aparelho físico.

## Escopo e fechamento

**14 caminhos declarados:** `ContentUpdatedScreen.tsx`, teste novo, este relato,
seis PNGs, STATUS, FILA, roadmap, plano único e CONTENT_PIPELINE. A baseline inclui
as entregas das duas passagens anteriores do PC06-E, preservadas; os números são
da árvore local suja e não CI de um SHA publicado.

Writer **`run-1793875917068-c8297725`**, aberto pelo embrulho antes da primeira
edição. Sessão **`brain-session-1793875738501-99c8eccf`** consultada e fechada antes
do writer por causa do validador `brain-links`. Gate final configurado: **VALIDATION_PASSED, 15/15, um ciclo**.
A carga caiu de 10,20 para 5,18 antes da abertura do gate; processos alheios
foram preservados. `app-quality` passou em 140,122 s e `app-test` em 133,379 s.
O registro do resultado recebeu nova conferência documental após o gate, sem
repetir os validadores de código.
Recibos locais: `final-validation.json`, `step-finish.json` e `run-close.json`,
com envelopes independentes; ordem `validate → step finish → run close`. Sem memória de produto nova.

Fonte `large` restaurada e relida, app encerrado, E262 desligado e Metro
encerrado. `expo-env.d.ts` preexistente mantido (30/10); não houve instalação,
prebuild, EAS/OTA, migração/limpeza de armazenamento, commit/push/merge, promoção
ou release. O reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` permaneceu desligado,
sem comando dirigido. Nenhuma escrita em Trello/Todoist/Google Docs.

Próxima dependência do PC06-E: experiência real com VoiceOver/TalkBack em aparelho
físico, dependente do dono. A autoria ainda precisa retirar o texto de brief das
práticas antes de promoção. Offline autônomo fica no primeiro lote promovido,
conforme a decisão já registrada; PC07/PC08/PC09 não foram iniciados.

Validadores finais: `docs-contract`, `content-foundation`, `content-wave1`, `content-production`, `content-anchoring`, `content-anchoring-data`, `content-no-verbatim`, `content-source-rights`, `content-python`, `app-quality`, `app-test`, `api-lint`, `api-typecheck`, `api-test`, `brain-links`.
