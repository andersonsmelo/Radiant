# T11 — pareceres independentes

R1 SpecPASS/CHANGES_REQUIRED histórica; fix1/R2 SpecPASS/APPROVED, P2 ADDRESSED. G6 pendente.

# Task13 / T11 — revisão RF R1

Revisor independente não autor: `/root/t11_rf_review`. Revisão estática concluída sobre o pacote congelado R1; sem execução adicional de testes, runtime, build ou instalação. Produto e índice não foram alterados. Única escrita: este parecer.

**Spec: PASS** para os requisitos explícitos de implementação e evidência estática do brief. **Qualidade: CHANGES_REQUIRED** pelo P2 abaixo. PASS de spec não autoriza fechamento de T11 nem G6: há correção de acessibilidade pendente antes do aceite RF.

## Identidade e escopo verificados

- BASE e HEAD declarados: `94c88ec679b43e8ca282da42ec425680b5525449`.
- SHA256 medido de `snapshot-r1/review-package.md`: `8001a45007491b444c2557806b321fb4d758de5820c5bd70e3fba2b83ef2120a`.
- SHA256 medido de `snapshot-r1/manifest.json`: `2eda790943e51983ee7fc25c59b09b71358c21dbd42b349845febf7bd8f19b23`.
- Os 13 arquivos copiados em `snapshot-r1/files` conferem individualmente com manifest, `final-hashes.json` e arquivos vivos durante a revisão.
- Lidos brief integral, Global Constraints literais, review-contract, implementer-report, diff integral com adições e fontes pertinentes. Escopo exclusivamente T11; não é revisão de merge/global Medalhão.

## Achado bloqueante de qualidade

**[P2] Incluir o equivalente mensal no nome acessível do plano anual**

Arquivo: `radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx`, **linha 273** (contexto 267–293 do snapshot R1).

O novo `Pressable` radio define explicitamente `accessibilityLabel` como plano + `displayPrice` + período, mas a linha mensal calculada (`monthly`) aparece somente no `Text` filho da linha 293. Quando preço/moeda existem, o usuário visual recebe, por exemplo, `$1.92 por mês`, enquanto o nome acessível contém só o preço anual. O componente Pressable instalado define `accessible: accessible !== false` (`node_modules/react-native/Libraries/Components/Pressable/Pressable.js:245`) e repassa o label explícito. A implementação Fabric instalada aplica esse label ao elemento de acessibilidade (`React/Fabric/Mounting/ComponentViews/View/RCTViewComponentView.mm:351–353`); sua resolução de label dá precedência ao label explícito, em vez de agregar o conteúdo descendente. Assim, a informação central adicionada por T11 não integra o anúncio do plano para VoiceOver. Isto é demonstrável pela estrutura e pelo contrato local, embora não tenha sido ouvido em dispositivo.

Correção solicitada: compor o nome ou valor acessível com o mesmo `monthly` já calculado, somente quando não nulo, preservando preço total, período, checked e disabled. Acrescentar teste focal do nome/valor acessível com metadados válidos e ausentes e testemunhar vermelho específico antes da correção. G6 não impede esta correção estática. Não é necessário redesenhar a interação nem executar build/runtime.

Não foram identificados outros achados P1/P2/P3 acionáveis no escopo revisado.

## Conformidade e rastreio do contrato

- Swift entrega `NSDecimalNumber(decimal: produto.price).doubleValue` e `produto.priceFormatStyle.currencyCode` no dicionário retornado de loadProducts. Os três tipos TS mantêm preço numérico e moeda opcionais; compatibilidade estática com binário antigo preservada.
- StoreKit2Adapter copia ambos os campos e displayPrice sem parsing. `SubscriptionService.loadOffers()` repassa os produtos da porta e mantém tratamento de indisponibilidade. A tela divide somente o número anual por 12 e formata pela moeda recebida, omitindo a linha quando faltam campos ou há número inválido.
- Planos reais, anual inicial, seleção por ID, fallback para produto real existente e um único botão de compra estão presentes. Não há criação de plano fictício quando indisponível. Atualização de storefront continua protegida contra resposta antiga; seleção mensal persiste quando o ID existe.
- Estados de carregamento, assinante/Gerenciar, indisponibilidade, erro, pending, cancelamento, restauração e voltar preservados e cobertos nos testes lidos. Texto legal/cancelamento permanece integral no diff; título e frases correspondem ao brief.
- AppButton gold é aditivo: mapas de face/lábio, cor escura do rótulo e inclusão no conjunto háptico. Fluxo comum de pressão, foco, loading/disabled e variantes anteriores permanece compartilhado. Inspecionei o componente integral pelo risco de regressão; os recibos dos dez consumidores reais relatados confirmam PASS individual, sem vender o agregado reprovado como verde.

## Evidência auditada

- `red.json`: 4 suítes falharam, 1 passou;18 falhas/90 passes. Hashes de produto de assinatura incluídos no recibo correspondem à BASE; falhas de seleção, campos e gold são específicas. A guarda TS falha se tipo/campo desaparece, sem sucesso vazio.
- `cpu-final.json`:5 suítes/157 testes verdes, zero skips, Node20.20.2, EXPO_NO_DOTENV=1, taskpolicy -b. A extensão equivocada .tsx para StoreKit Testing não executou essa suíte; `cpu-config.json` executou os2 testes corretos. Total159 em duas execuções, não um agregado único.
- Os hashes registrados de assinatura no CPU final correspondem ao freeze, inclusive a suíte de fluxo completa com38 testes.
- `regression.json`:16 suítes verdes/1 falhou,512 passes/1 falha, exit1. Os dez consumidores de AppButton estão verdes. A falha é a asserção de remoção após storefront antes da sincronização; a suíte final completa passa após a sincronização explícita. Não foi repetido o agregado de17 suítes; isso permanece distinção de evidência, não prova de CI.
- `typecheck-freeze.json` exit0; lint focal e lint do fluxo final exit0; copy contract65 passes; diff-check exit0. São os comandos presentes nos recibos, não substitutos do quality final configurado.
- Conferidos scripts de15 mutações, unicidade de âncora, hashes antes/mutante/restaurado e saídas de falha causal correspondentes: seleção, productId, divisão, moeda, parsing de displayPrice, campos no adaptador/serviço, ouro, legal, Swift e tipos, e duas de storefront. Não tratei apenas exit1 como prova; as saídas mostram a asserção pertinente.
- `swift-contract.py` tokeniza o dump estrutural do compilador, exige uma entrada de dicionário para cada chave e cadeia não vazia específica. As mutações preço/moeda constantes falham nessa cadeia. A guarda é causal para esses defeitos, mas é verificação estrutural, não prova de tipos StoreKit ou execução. Ela busca dicionários globalmente; não é uma prova geral de fluxo/semântica do módulo. O dicionário atual foi conferido manualmente dentro do retorno de loadProducts.

## Portabilidade e limites de prova

O bundle `docs/evidence/2026-10-29-medalhao-t11-tests.json` existe e contém32 recibos, freeze, manifest, brief, relatório e fontes dos scripts de reprodução, incluindo a guarda Swift e mutações. A evidência não depende exclusivamente do diretório local ignorado. Contudo, comandos trazem cwd/PATH absoluto do autor; a guarda Swift requer macOS/Xcode e taskpolicy é específico de macOS. Reproduzir em outra máquina exige materializar scripts/caminhos e dependências compatíveis. Não se infere execução CI nem integração permanente da guarda Swift ao quality.

Os recibos do wrapper armazenam hashes de `src/features/subscription`; não armazenam, a cada execução, todos os bytes de AppButton, Swift, index.ts e baseline. O freeze final cobre os13; resumos de mutação acrescentam hashes dos mutantes/restaurações desses arquivos. Portanto há boa trilha de revisão, mas não uma atestação criptográfica de toda a árvore em cada comando. Não apresentar conclusão mais ampla.

**Cannot verify:** compilação/typecheck/link Swift com StoreKit/Expo; conversão efetiva do Double no bridge de um binário novo; preço e compra reais; layout nativo, fontes grandes, foco/VoiceOver efetivo e retorno háptico em dispositivo; execução CI; quality final configurado do controlador. Parse Swift/Jest são estáticos. G6 e demais autorizações permanecem pendentes. O binário antigo não prova os campos novos.

## Restrições e encaminhamento

Confirmo os Global Constraints literais do brief como contrato aplicado: identidade Medalhão/Sora/Pixel/ouro/lábio/fingerprint preservada no escopo; economia e regras de aprendizagem não alteradas; sem uso do simulador reservado; nenhuma autorização G1–G8 inferida; somente controlador gerencia writer; revisor não subdelegou nem editou produto; sem reset/clean/stash/revert, caminhos sensíveis ou vault. A inspeção do diff sustenta o escopo técnico; este parecer não atesta retrospectivamente todas as ações ambientais de outro agente.

Próximo passo: devolver o P2 ao implementador, congelar novo snapshot após correção e testes focais, e revisar o delta. Fechamento Loop/quality final e documentação operacional pertencem ao controlador.


# Task13 / T11 — revisão RF R2 (fix1)

Revisor independente não autor: `/root/t11_rf_review`. Revisão focal do delta R1→R2, sem repetir a revisão integral nem executar testes/runtime/build. Única escrita desta rodada: este parecer. As conclusões não modificadas de `review-r1.md` permanecem aplicáveis.

**R1 P2: ADDRESSED. Spec: PASS. Qualidade: APPROVED.** Aprovação RF da implementação estática no escopo T11; não é aceite nativo, autorização G6, merge ou execução do quality final.

## Identidade verificada

- BASE/HEAD mantidos: `94c88ec679b43e8ca282da42ec425680b5525449`.
- Package R2 SHA256 medido: `8a37942a74f5f518400b1ff2103c77676b177e0a8a2cf0170710f203ee2f72f3`.
- Manifest R2 SHA256 medido: `8dc1184f943796188909d8745c8db61cbf23fa6cb43bba83659e44cf880370d6`.
- Os13 hashes do snapshot R2 conferem com manifest, `final-hashes.json` e fontes vivas. Onze não mudaram desde R1; somente `SubscriptionScreen.tsx` e `SubscriptionScreen.flow.test.tsx` mudaram, como o delta declara.
- Hash final da tela: `a37bcf57c99897b82fd56e77686177f52dc2eb1fb431487b3c24634b84fc7a9a`.
- Hash final do teste: `34959a009db58f8d64fb60f8cecc2c427ab9df27524e4c24e7afafd102a034e9`.

## Achado R1 resolvido

`radiant-app/src/features/subscription/screens/SubscriptionScreen.tsx:273` agora acrescenta ao `accessibilityLabel` o mesmo `monthly` calculado e exibido visualmente, somente quando esse valor existe. O nome acessível preserva plano, preço total e período e passa a incluir o equivalente mensal. O plano mensal continua sem duplicação; ausência ou invalidade de metadados não produz uma linha inventada. `checked`, `disabled`, ação de seleção, cálculo monetário e renderização visual não mudaram.

O teste novo, a partir da linha464 do arquivo de fluxo, exige o nome completo `Anual, $22.99 por ano, $1.92 por mês`, verifica o nome mensal inalterado e mantém a asserção do texto visível. Oito casos cobrem omissão com metadados ausentes/inválidos. Isso cobre o defeito específico do label, em vez de apenas provar que o filho Text existe.

Não identifiquei nova regressão ou achado P1/P2/P3 acionável no delta.

## Evidência conferida

- `fix1-red.json`: exit1,1 falha causal no nome acessível esperado,8 casos verdes e38 explicitamente filtrados. O hash da tela é exatamente o R1 defeituoso.
- `fix1-green.json`: fluxo inteiro47/47, zero skips, exit0.
- `fix1-cpu.json`: fluxo inteiro47/47, zero skips, exit0, sob taskpolicy -b.
- `fix1-mutation-remove-label-equivalent.json`: exit1; remoção somente do trecho mensal do label mantém o filho visível e faz falhar a busca pelo nome completo.46 testes explicitamente filtrados. O script exige âncora única e restaura em finally; resumo registra R2→R1→R2 por SHA256.
- `fix1-static.json`: ESLint dos dois arquivos, exit0. `fix1-copy.json`:65/65, exit0. `fix1-diff.json`: diff-check exit0.
- Recibos conferidos mostram Node20.20.2, cwd radiant-app, EXPO_NO_DOTENV=1 e PYTHONDONTWRITEBYTECODE=1. Os hashes de assinatura nos recibos verdes conferem com o freeze atual.
- Bundle `docs/evidence/2026-10-29-medalhao-t11-tests.json` contém39 recibos e inclui `fix1-mutation.py`; a evidência fix1 está preservada junto da anterior. Permanecem os limites de portabilidade dos caminhos e ferramentas macOS registrados em R1.

Não repeti testes porque o delta e os recibos causais respondem à hipótese concreta do P2. Não se apresenta159+47 como execução agregada: os159 pertencem à rodada anterior e os47 ao fluxo atualizado. Também não se afirma novo typecheck pós-fix1; a validação final configurada do controlador ainda é o próximo gate.

## Cannot verify e restrições

Cannot verify: áudio/VoiceOver efetivo, comportamento e layout nativo, compilação/typecheck/link Swift e bridge StoreKit no binário novo, compra/preço reais, execução CI ou quality final do controlador. A correção comprova o contrato JS do nome acessível; G6 continua pendente.

Global Constraints do brief continuam aplicadas sem autorização adicional: sem runtime/simulador reservado, Loop/brain, subdelegação, commit/push, alteração de produto, índice, branch, vault ou documentos de outra sessão nesta revisão. Controlador decide próximo gate e fechamento do writer.


# Task13 / T11 — revisão RF R3 (fix2)

Revisor independente não autor: `/root/t11_rf_review`. Revisão focal do delta R2→R3 e evidência da correção do gate visual. Sem reexecução de testes, quality, Loop, runtime ou build. Única escrita nesta rodada: este parecer; produto, índice e documentos do controlador preservados.

**Spec: PASS. Qualidade: APPROVED.** O defeito apontado pelo gate visual está **ADDRESSED** no escopo estático. Mantida a aprovação R2 e os limites nativos; aprovação RF não equivale a execução bem-sucedida da validação final configurada.

## Identidade

- Package R3 SHA256 medido: `c5d312992f1c8bbe682bfa2a80e9710afc504ce66f3fb5aa61efdba55eb8a62c`.
- Manifest R3 SHA256 medido: `5edbd5cbf00e5655c63d9baabff0363df7446647de0bbe8989442ea04d10a434`.
- Os13 arquivos do snapshot conferem com manifest, final-hashes.json e fontes vivas. Onze hashes permanecem iguais ao R2. Só tela e teste de fluxo mudaram.
- Tela: `881406a92f2b21e01a230bfb7e90484634c97113f48be588749b338c10145ef8`.
- Teste: `0e775f21c8b0daf43c53080921fc9882c7856bf29fedcab6a8f89cb260d6e599`.

## Delta e risco

Em `SubscriptionScreen.tsx:442` e `:446`, os dois raios literais64 passam a `radius.rLg * 4`. Conferido o token real em `src/ui/styles.ts:46`: rLg=16. A geometria atual continua64; maxWidth128, minHeight112, pressão, bordas, cores, preço e acessibilidade não mudam. A decisão do controlador autoriza esta composição em vez de criar token global. Ela acopla a geometria ao token rLg: mudança futura do token requer revisão; a guarda nova torna essa dependência visível. Não houve relaxamento de policy, baseline ou exceção.

O novo teste lê os estilos reais da árvore renderizada para Mensal e Anual, exige face/lábio existentes, maxWidth128, raio64, relação2× e igualdade entre face/lábio. Não é espelho embutido no produto nem asserção vazia. Ele preserva parâmetros de estilo; não prova círculo físico, dimensão efetiva sob toda largura/fontScale ou rasterização nativa. A busca por pais e primeiro filho pointerEvents=none corresponde à estrutura atual e falha explicitamente se faltar a parte procurada.

Nenhuma regressão introduzida ou novo achado P1/P2/P3 acionável identificado no delta.

## Evidência confrontada

- `quality-diagnostic.log` preserva o vermelho real:206 suítes/2743 testes passaram; strict visual reprovou exatamente os2 raios64 na tela. Isso não era quality verde. Não atribuo essa execução ao código posterior fix2.
- `fix2-visual.json`: Node20.20.2, npm run visual:qa:strict, exit0;473 arquivos,0 regressões,41 baselined,3 scoped exceptions. Hash da tela já é o R3; o hash do teste ainda é intermediário. O resultado mede aquele momento, sem afirmar nova execução strict sobre todo freeze.
- `fix2-flow-final.json`:48/48,zero skips,exit0, inclui os47 cenários anteriores e a guarda de geometria. Hashes correspondem ao freeze.
- `fix2-mutation-radius.json`:1 falha específica,47 filtrados; resultado esperado64/recebido32. O script altera exatamente as2 expressões para rLg*2 e restaura em finally; resumo confirma SHA antes/restaurado igual ao produto R3. Esta mutação foi executada sobre versão intermediária do teste, antes da tipagem estrutural final. As asserções causais de64 e a seleção dos estilos permanecem no teste final lido; não apresento a execução como feita sobre bytes finais do teste.
- `fix2-typecheck-freeze.json`, `fix2-lint-freeze.json`, `fix2-diff.json`:exit0 e hashes de assinatura iguais ao freeze. Erros intermediários de tipagem/travessia estão preservados, não contados como aceite.
- Recibos trazem Node20.20.2, EXPO_NO_DOTENV=1 e PYTHONDONTWRITEBYTECODE=1. O bundle versionado consultado contém51 recibos e o script fix2-mutation.py.

Não repeti testes: a conta16×4, o delta de dois estilos, o fluxo final, o diagnóstico causal e os recibos respondem à hipótese concreta. O novo teste não altera comportamento de produto. A próxima validação configurada pertence ao controlador.

## Cannot verify

Não verificável nesta revisão: quality/Loop final após fix2, execução CI, layout/rasterização em aparelho, Dynamic Type/VoiceOver real, compilação/link/bridge Swift, StoreKit e compra reais. G6 permanece pendente. Os limites de portabilidade e hash por recibo registrados em R1 continuam válidos. Sem uso do simulador reservado, subdelegação, Loop/brain, commit/push ou qualquer autorização adicional inferida.
