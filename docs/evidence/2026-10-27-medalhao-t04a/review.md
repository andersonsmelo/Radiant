# Revisão independente T04a — R1 — 27/10/2026

**Spec: PASS**
**Qualidade: APPROVED**

Revisor independente do autor. Escopo limitado ao brief `task-6-brief-r1.md` e ao pacote congelado T04a; não constitui auditoria ampla da branch nem aprovação de G1–G8/release. Nenhum achado P1, P2 ou minor acionável neste escopo.

## Integridade e estado medidos pelo revisor

- BASE_TASK e HEAD atual: `ab20c6a69cb374ee73cc46c30826ce6e346aabac`; revisão pré-commit sobre diff de trabalho, incluindo arquivos novos.
- Manifesto SHA256 confirmado: `35e9a7f67e08c6442e0ab7adda72c3ca8e8fe67b943f809442f472d82e45fe9a`.
- Pacote SHA256 confirmado: `cc6fd8c0a2a69e0a4a85b12b2f56a44e2a3f2a1c1bbbb69a709eddab32973933`.
- As 18 cópias em `task-6-snapshot-r1/files/` conferem com os hashes do manifesto. Os 13 caminhos `productFreeze` conferem com os arquivos vivos.
- Leitura integral do pacote de 2008 linhas, incluindo diff U10, novos arquivos, 524 linhas de vermelho e 329 de verde. Relatório do autor confrontado com esses bytes/saídas.
- As sete mutações foram reconstruídas em memória pelo revisor: todas têm âncora única e SHA mutado correspondente; os SHA antes/restaurado coincidem com os bytes finais. Nenhum arquivo de produto foi alterado para isso.
- `git diff --check`: exit0, executado pelo revisor. Verificador auxiliar de AST executado com Node `v20.20.2`: nenhuma asserção `expect` preexistente dos seis consumidores desapareceu. Contagens antes/depois: Theme 61/61; flow 277/277; registro 44/51; BenchStep 60/60; Exposure 61/61; Collimation 32/32.

## Aceites confrontados com código e evidência

| Requisito | Resultado e evidência |
| --- | --- |
| Import estático real | `ActivityRendererRegistry.tsx:6` importa BenchStepRenderer; `:112` usa o binding no retorno JSX. O único diff permanente de produto é essa troca e a retirada do comentário obsoleto. A dependência reversa de BenchStepRenderer para as props é `import type`, sem novo ciclo de avaliação por esse vínculo. |
| Guarda de importação e vermelho específico | `ActivityRendererRegistry.test.tsx:42–77` percorre AST, exige named import de valor e uso JSX, e rejeita require literal do módulo. Comentário não satisfaz a guarda. `red.txt:9–25` falha por ImportDeclaration ausente; `:27–42` mostra resolver nativo antes do mapper. Não são falhas do loader interpretadas como defeito nativo. |
| Mapper global e overrides preservados | `jest.config.cjs:6` mapeia o pacote exato para o novo dublê. Os seis factories alvo foram retirados; os dois factories first-run foram preservados. Exposure mantém reset e cenários sucesso/null/throw; Theme mantém reset e animação própria com slots/frames/render. |
| Observabilidade útil | `reactNativeSkia.tsx:10–28` preserva children e props, incluindo source, uniforms, frame, layer, matrix e picture, com testID padrão ou explícito. `:30–41` fornece Make controlável, bounds e recorder observável. `reactNativeSkia.test.tsx:15–74` caracteriza esses contratos, sem fingir compilação ou rasterização. |
| Fallback e guardas sensíveis | `red.txt:51–524` registra sete injeções com exit1 e sintomas correspondentes: seed ausente; fallback Exposure removido nos cenários null e throw; tom soft errado; field perdido; luz da silhueta acesa; fallback Skottie quebrado nos cenários null e throw; host descartando uniforms. As falhas são nas observações esperadas, não apenas um erro vizinho. |
| Conjunto focal completo | `green.txt:1–103`: comando dos seis consumidores mais o dublê juntos, Node20.20.2, 7 suítes/184 testes, exit0. `:106–113`: tsc e lint focal, exit0. São execuções documentadas do autor, examinadas pelo revisor; não foram reexecutadas nesta revisão. |
| Skottie/frame/cor/slots | O dublê expõe frame, animação, layer e picture; Theme conserva fakeAnimation com seek/render/slots, asserções de pose/silhueta/luz e os cenários de falha. A mutação da luz falha em `render:luz=100` versus `render:luz=0` (`red.txt:343–366`), confirmando observação do comportamento específico. |

## Restauração confirmada contra o BASE_TASK

O revisor comparou diretamente `git show BASE_TASK:<path>` com os bytes vivos; os cinco arquivos abaixo são idênticos ao BASE e aos SHA do audit:

| Arquivo | SHA256 |
| --- | --- |
| `radiant-app/src/features/bench/ExposureImage.tsx` | `9f56ff4b59a8d8a2b38b8142c1b54554d9527e664425e99762713244b27290bd` |
| `radiant-app/src/features/bench/CollimationImage.tsx` | `651036a2f870dbacf069308602e233885d0c6a32f88a66817e5c5c8df36b3d73` |
| `radiant-app/src/ui/illustrations/ThemeIllustration.tsx` | `c79a75a9c606f37d8c5e5f6fa964b5721263959928b64852bd963f22f1c4e119` |
| `radiant-app/src/features/first-run/screens/WelcomeFlowReentry.test.tsx` | `c268571703de33e74966c951c6e15eef3a44d947b23a455699c13b2d944ba329` |
| `radiant-app/src/features/first-run/screens/WelcomeFlowScreen.flow.test.tsx` | `82b6d72695410025ce9313d6844f6562ec224b61c19c91103d6ed62bc97248e3` |

## Avisos e limites

Os dois avisos act do verde apontam a `LessonFlowScreen.tsx:542` e `:502`; a reprodução baseline em `green.txt:116–313` apresenta as mesmas mensagens/locais e 85 testes passando. A restauração dos três arquivos usados nessa reprodução está registrada em `:315–329`, e os hashes finais foram confirmados pelo revisor. Essa evidência sustenta que o ruído já existia; não há motivo concreto para bloquear T04a por ele.

Não restou requisito de implementação T04a não verificável que exija correção do autor. A validação final configurada do Loop, fechamento do writer e atualização operacional permanecem com o controlador. Prova nativa de SkSL, rasterização, animação e custo no dispositivo continua fora deste harness e requer o gate nativo próprio; esta aprovação não a substitui.

Não rerodei Jest/tsc/lint: os logs completos e os bytes conferidos respondem aos riscos concretos desta revisão, sem dúvida residual que justifique repetição. Não executei quality, Loop, build, instalação, native, EAS, OTA, merge ou loja; não abri simulador/Metro/AVD nem subagentes. Única escrita do revisor: este relatório SDD; produto, docs, índice e branch preservados.
