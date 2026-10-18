# Memória do Radiant no simulador — 2026-10-13

Medição local em Debug, iOS 26.5 / SE 375×667 pt. JS do checkout `c9169ee`, wrapper nativo 1.3.1 (3), executável confirmado em `native-version-reconciliation.json`. Perfil development/off, sync remoto desligado, preferências padrão, texto large; somente dados sintéticos. Nenhuma alteração no app.

## Método e captura inicial

Mesmo processo **PID 2212**: dois ciclos de aquecimento, retornar à Home, grafo inicial; repetir dez ciclos completos e capturar; repetir mais dez e capturar. Cada ciclo abre L1, percorre contexto e ideia-chave até a pergunta, fecha e confere a Home. Nenhuma resposta é enviada, vida gasta ou XP concedido. Macros locais registram asserções por fase e repetem um toque apenas enquanto a mesma fase permanece visível.

A primeira captura ultrapassou o limite de 120 s do controlador. O processo filho continuou e gerou **um memgraph válido**, confirmado pela mensagem `Output graph successfully written` e pela análise de leaks. Não foi recapturado para apagar o timeout. O limite das capturas seguintes foi ampliado para 420 s. Houve uma abertura parcial abortada antes dos dez ciclos, preservada em `memory-ten.xml`; `memory-return` voltou à Home no mesmo PID. A comparação conta apenas os ciclos completos, registrando essa exposição adicional.

Ferramentas da skill ios-memgraph-leaks: `capture_sim_memgraph.sh`, `summarize_memgraph_leaks.py --trace-limit 3`; inspeção adicional de `leaks --list`, `--groupByType` e `--traceTree`. Artefatos em `radiant-app/.maestro/artifacts/qa-2026-10-13/memory/`.

## Resultado inicial

**9 vazamentos / 4.720 bytes** detectados. O agrupamento identifica quatro blocos malloc de 1.024 bytes, dois de 256, dois de 48 e um de 16. Não há nomes de classe ou imagem atribuíveis ao app. Três trace trees de 1.024 bytes retornaram `Found 0 roots referencing`; o agrupamento foi usado como segunda evidência. Não foi demonstrado ciclo de retenção em código do Radiant nem atribuição exclusiva a frameworks.

Memgraph inicial: `baseline/com.ascendcreative.radiant-2212-20261013-191029.memgraph`, 8.550.431 bytes. Footprint físico na captura: 291.1M (pico 294.0M), na unidade exibida pelo leaks. RSS posteriormente amostrado, antes de novos ciclos: 75.696 KiB. RSS e footprint são métricas distintas; o tamanho do arquivo não representa o uso de RAM do app.

## Comparação completa — mesmo PID 2212

| Amostra | Ciclos completos depois do aquecimento | Footprint físico (`leaks`) | RSS depois da captura, KiB | Vazamentos / bytes |
| --- | --- | --- | --- | --- |
| Inicial | 0 | 291.1M | 75.696 | 9 / 4.720 |
| Após dez | 10 | 442.9M | 180.080 | 9 / 4.720 |
| Após vinte | 20 | 553.0M | 212.048 | 9 / 4.720 |

**O footprint cresceu 261,9M, cerca de 90%, no cenário.** Os nove endereços de vazamento permaneceram os mesmos; isso não exclui retenção de objetos alcançáveis. A memória não se estabilizou nas três amostras. As capturas seguintes terminaram normalmente, com análise aprovada pela ferramenta. O processo manteve o mesmo PID até o término dos vinte ciclos; depois foi encerrado e o SE desligado.

Contagem auditável: a primeira macro confirmou oito retornos à Home, percorreu e fechou a nona atividade, mas tentou um segundo fechamento quando a tela já havia mudado. O retorno foi conferido pela fase seguinte; `qa-memory-tenth` PASS executou o décimo ciclo. A segunda macro executou os dez restantes e passou. JUnit dos roteiros que falharam continua FAIL; a contagem de navegação não depende de substituir seus resultados. A abertura parcial anterior segue qualificada separadamente.

### Objetos retidos e caminhos observados

`heap --sortBySize --noContent` e `--diffFrom=<baseline>`:

| Tipo | Inicial | Após dez | Após vinte |
| --- | --- | --- | --- |
| RNSScreenView | 6 | 28 | 48 |
| RCTViewComponentView | 400 | 1.863 | 3.193 |
| ViewShadowNodeProps | 774 | 3.383 | 5.686 |
| RetainingSerializable<SerializableObject> (worklets) | 3.064 | 11.738 | 13.933 |

Há 2.793 RCTViewComponentView novos em relação ao grafo inicial. Uma amostra, `0x12cc57c00`, teve 107 caminhos a raízes. Um deles passa por `RCTComponentViewRegistry._registry → RCTComponentViewRegistry → RCTMountingManager → RCTSurfacePresenter → RCTInstance`; também há referências via Hermes e RNSScreenShadowNode. Uma amostra nova de worklet, `0x10c12cf50`, teve 107 caminhos, incluindo BCProviderFromSrc/Runtime do Hermes. São objetos **ainda alcançáveis**, distintos dos nove mallocs sem raiz.

O aumento de telas nativas é compatível com acúmulo de navegação; os fechamentos usam `router.replace('/(tabs)')`. Essa é **hipótese de origem**, não uma correção causal demonstrada. A medição usa deep links externos para abrir a lição e Maestro; falta reproduzir pelo CTA do produto, inspecionar o estado do navegador e comparar Release/aparelho antes de atribuir toda a diferença a uma única chamada ou biblioteca. Há crescimento real no processo medido, e não somente um arquivo de grafo maior.

Artefatos de investigação: `type-comparison.json`, `heap-diff-baseline-to20.txt`, `new-view-addresses.txt`, `trace-view.txt`, `new-worklet-addresses.txt`, `trace-worklet.txt`, heap-by-size/summary de cada amostra. `metrics.json` guarda os três hashes SHA-256 dos memgraphs e timestamps. O wrapper do primeiro capture sofreu timeout; os seguintes usaram o limite de 420 s e concluíram.

## Limites e próxima investigação

Captura Debug intrusiva em um Mac compartilhado, com pico de carga durante leaks; não mede consumo no iPhone, FPS, bateria ou desempenho estatístico. MallocStackLogging não foi ativado. Sem pilhas de alocação/classificação, a origem dos nove blocos permanece indeterminada. A próxima investigação precisa separar retenção de telas/objetos alcançáveis da origem dos nove mallocs e provar a aresta de ownership antes de um patch. Nenhuma correção ou eliminação de vazamento é afirmada.

Memgraphs nativos também não certificam a ausência de retenção no heap JavaScript/Hermes. A rotina exercitada é Home/L1; Perfil, assinatura e revisão não integram os vinte ciclos. [Relatório funcional](2026-10-13-qa-ampla-simulador.md), [matriz](2026-10-13-qa-matriz-funcional.csv).
