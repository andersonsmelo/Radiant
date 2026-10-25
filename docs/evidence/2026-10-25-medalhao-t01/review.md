# T01 — revisão independente R1

**Spec: CHANGES_REQUESTED. Qualidade: CHANGES_REQUESTED. Não validar/fechar como concluído neste snapshot.**

Revisão em 2026-10-25, base e3dca6e, snapshot-r1 imutável. Os 32 hashes do manifesto correspondem às cópias e aos arquivos vivos examinados. Produto somente leitura; artefatos desta revisão têm prefixo task-2-review-. Sem Loop/brain, build, instalação, nativo, commit/push ou quality completo.

## Achados bloqueantes

Todos são P2: defeitos concretos na guarda nova. Os exemplos são pequenos programas estáticos; nenhum exige avaliação de serviço, estado remoto, Map/reduce/regex arbitrários ou prova whole-program.

### R1 — resolver desestruturação local de copy (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:163–173 (initializer:127–131).

`BindingElement` não é resolvido até a declaração que fornece seu objeto. Reprodução: `function describe() { return { detail: "Vidas ilimitadas — e só isso." }; } const {detail}=describe(); <Text>{detail}</Text>`. Esperado: dash. Atual: zero findings e diagnostic `unresolved dynamic identifier` para detail.

**Caso real omitido da baseline:** radiant-app/src/features/subscription/components/SubscriptionCard.tsx:25 contém exatamente essa frase, retornada por describe, desestruturada em :62 e exibida em :68. Medição independente encontra somente eyebrow ASSINATURA em :66; não encontra o dash de :25. Este texto não é conteúdo clínico nem CANCEL_COPY/styles.legal. O diagnostic não transforma copy estática em limite runtime aceitável. Resolver bindings locais/renomeados e remedir a baseline; não corrigir cosmeticamente a tela fora do escopo T01.

### R2 — preservar ambiente de parâmetros ao consumir retornos compostos (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:237–248; propriedade/shorthand também passa por :176–188.

Reprodução: `function copy(value) { return [value]; } <Text>{copy("jornada")}</Text>`. Esperado: jargon. Atual: zero findings e identifier dinâmico. `resolve` retorna array com env, mas `consume(value, structural)` descarta esse env e recomeça com Map vazio. Há variante por objeto: `function copy(value) { return {value}; } <Text>{copy("jornada").value}</Text>` também perde a copy. Preservar ambiente em arrays/objetos e shorthand retornados; testar combinação função + argumento + composto, além dos testes isolados já verdes.

### R3 — marcador sintético impede detecção uppercase em templates (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:150–151.

Reprodução totalmente constante: `<Text>{\`MISSÕES ${3}\`}</Text>`. Esperado: eyebrow. Atual: zero findings **e zero diagnostics**. A concatenação artificial ` ${value} ` insere letras minúsculas na string avaliada pelo detector e mascara todo template uppercase com interpolação. Preservar/analisar spans estáticos sem fazer o marcador alterar a classificação. A fixture existente de template cobre dash, não uppercase.

### R4 — separador literal de join desaparece da copy (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:195–196.

Reprodução: `<Text>{["Vidas", "agora"].join(" — ")}</Text>`. Esperado: dash. Atual: zero findings **e zero diagnostics**, embora o texto renderizado seja `Vidas — agora`. A implementação segue elementos mas ignora o argumento separador. O audit promete join; o teste atual põe o dash no elemento e, por isso, não protege o separador. Avaliar o separador no resultado textual com seus espaços, sem converter array vazio/unitário em falso positivo.

### R5 — propriedade numérica de array vira falso positivo textual (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:181–183.

Reprodução: `const values=["jornada"]; <Text>{values.length}</Text>`. Esperado: nenhuma violação (UI mostra 1). Atual: jargon na string interna do array, sem diagnostic. Qualquer nome não numérico é interpretado como todos os elementos. Distinguir `.length` de indexação dinâmica; não elevar baseline para absorver esse falso positivo. A fixture de índice constante atual não protege esta diferença.

### R6 — alias simples de Alert elimina o sink inteiro (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:288.

Reprodução: `import { Alert as Notify } from "react-native"; Notify.alert("jornada");`. Esperado: jargon. Atual: zero findings **e zero diagnostics/sinks**. O sink é reconhecido por `getText() === 'Alert.alert'`, não pela origem AST do import. É uma combinação comum de import alias + Alert.alert, ambos no domínio declarado. Resolver a origem e cobrir o alias sem tratar métodos alert de objetos alheios como React Native Alert.

### R7 — exclusão de JSON.stringify encobre texto que chega à UI (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:101 e resolução de call :221–230.

Reprodução: `<Text>{JSON.stringify({message:"jornada"})}</Text>`. Esperado: jargon porque a string é visível. Atual: zero findings **e zero diagnostics**; a expressão é removida como transporte antes de qualquer análise. O teste atual cobre apenas fetch/body, e não sua contraparte visível. A exclusão declarada de infraestrutura deve depender do uso como transporte, não apenas do nome da função. Não é necessário interpretar qualquer serialização arbitrária: basta não esconder a origem literal visível nem declarar esse sink limpo. O app já usa JSON.stringify em UI de TelemetryDebugScreen:303/:305 (booleanos atualmente, sem violação), portanto o uso não é exclusivamente transporte.

## Evidência reproduzível

Executável: `task-2-review-r1-repros.mjs`; saída: `task-2-review-r1-repros.txt`, ambos neste workspace SDD. Comando a partir da raiz:

```sh
/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --test .superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r1-repros.mjs
```

Resultado: **7 testes / 7 falhas de asserção específicas**, módulo carregado normalmente. As expectativas estão em cada fixture. São reproduções de revisão, não alterações nos testes de produto.

## O que foi confirmado

- Executei novamente os três contratos Node no Node 20.20.2: **97/97**. Medição reproduzida: **325 fontes, 1595 sinks, 133 findings, 964 diagnostics**. Os números são reais; a suficiência do domínio é o problema acima.
- CTA, seis YAMLs, contrato Maestro, detector/fixture de performance e negativos JourneyHome coerentes com Continuar trilha. Shape de nodeCopy preservado; AppButton genérico intacto.
- package.json liga o novo contrato ao quality. CompareBaseline rejeita aumentos/arquivo novo sem teto e paths obsoletos, avisa redução, coerente com o requisito por arquivo/classe. O gate não reprova diagnostics; por isso R1/R2 não são compensados pelo log de 964 caminhos.
- Exclusões clínicas são delimitadas por fonte/campo em vez de remover src/data ou telas inteiras. SubscriptionScreen mantém os outros labels/hints; a limitação de transporte excessiva é R7.
- Log verde preservado registra 147 Jest / 3 suítes. Conferi esse registro e os consumidores alterados; não repeti Jest nesta revisão. Não apresento isso como execução independente.
- As 11 mutações têm exit 1 no log; por amostragem, jargon, baseline e wrapper children chegam às asserções específicas. Esse conjunto valida os detectores exercitados, mas não cobre as combinações acima. Não houve evidência de falhas por simples módulo ausente nesses exemplos.
- Aceito os limites documentados de runtime/service/Map/reduce/regex; não exijo completar 964 diagnostics. Porém o dash real de SubscriptionCard e os bypasses constantes não podem ser arquivados sob esse limite.

## Condição para R2

Corrigir os achados nos produtos de ownership, registrar vermelho/verde específico, atualizar medição/baseline/audit sem mudar copy das demais telas, e fornecer novo snapshot. Reexecutar a revisão focal antes do único quality/Loop validate do controlador. Esta revisão termina aqui; não reabre design, G1–G8 ou planos amplos.

---

# T01 — revisão focal R2 (após fix1)

**Spec: CHANGES_REQUESTED. Qualidade: CHANGES_REQUESTED. Ainda não há autorização técnica para validar/fechar como concluído.**

Escopo: conferir R1–R7 e regressões do delta snapshot-r1 → snapshot-r2. Não reiniciei auditoria ampla. Li fix1-report, relatório/audit consolidados, manifesto e delta. Os **33 arquivos do manifesto R2** correspondem aos hashes do snapshot e à árvore viva examinada.

## Sete achados originais

Os sete exemplos literais do parecer R1 estão corrigidos. Reproduzi no Node **20.20.2** os três contratos mais o arquivo original task-2-review-r1-repros.mjs: **118/118, zero falhas/skips**. Saída integral em task-2-review-r2-green.txt. Medição reproduzida: **325 fontes, 1603 sinks, 135 findings (70/16/49), 40 arquivos, 922 diagnostics**. Baseline adiciona apenas os dois dashes existentes identificados: SubscriptionCard:25 e MatchingStepRenderer:36; as telas não mudaram.

As variantes novas dos testes cobrem retornos compostos, binding renomeado, template mixed-case, joins vazios/unitários diretos, length, Alert alheio e transporte. Porém três mudanças introduzem regressões em combinações estáticas pequenas.

## Achados diferenciais bloqueantes

### R2-A — preservar import namespace ao remover o shortcut de propriedade (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:193–195.

```tsx
// src/copy.ts
export const value = "jornada";
// src/F.tsx
import * as copy from "./copy";
<Text>{copy.value}</Text>;
```

Esperado: um jargon na origem src/copy.ts. **R1: um jargon, zero diagnostics. R2: zero findings**, com diagnostics para copy e copy.value.

O delta removeu a consulta da declaração de `node.name`, que anteriormente resolvia o export pelo checker. O novo caminho exige resolver a base `copy`, mas não trata NamespaceImport. É regressão de import estático, não limite runtime. Restaurar resolução de namespace sem reintroduzir a perda do env dos retornos compostos corrigida em R1–R2. Adicionar fixture de regressão com propriedade fora de COPY_FIELDS, como value, para não deixar a varredura conservadora esconder o problema.

### R2-B — contar cardinalidade real de spreads antes de detectar separador de join (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:222–226.

```tsx
const values = [];
<Text>{[...values, "Vidas"].join(" — ")}</Text>;
```

Esperado: nenhuma violação, pois a UI mostra somente `Vidas`. **R1: zero findings. R2: um dash falso**, zero diagnostics. `entry.array.elements.length` conta um SpreadElement como um item, mesmo quando ele expande para zero.

O mesmo cálculo deixa incompleta a correção original R4 no sentido oposto: `const values=["Vidas","agora"]; <Text>{[...values].join(" — ")}</Text>` continua com zero findings em R1 e R2, embora o separador apareça. O achado bloqueante diferencial é o falso positivo novo; a variante positiva deve acompanhar a correção para evitar remediar apenas um lado. Expandir spreads estáticos preservando ambiente; manter o limite explícito para cardinalidade runtime desconhecida. Não elevar baseline para absorver o falso positivo.

### R2-C — reconhecer Alert pela declaração do identificador efetivamente usado (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:300–310, sobretudo :307–308.

```tsx
import { Alert as Notify } from "react-native";
function f(Notify) { Notify.alert("jornada"); }
f({ alert: () => null });
```

Esperado: nenhuma violação: o parâmetro Notify oculta o import e seu método não é um sink nativo. **R1: zero findings. R2: um jargon falso**, zero diagnostics.

O novo isNativeAlert procura primeiro um import com o mesmo texto, sem conferir se o identificador usado no call se refere àquele binding. Só consulta a declaração depois, tarde demais. Usar o símbolo/binding efetivo antes de aceitar a origem React Native. Conservar tanto a variante positiva do import renomeado quanto o negativo com objeto não relacionado e o negativo de shadowing acima.

## Reprodução e limite da revisão

`task-2-review-r2-repros.mjs` contém os três casos diferenciais; `task-2-review-r2-repros.txt` registra **3/3 falhas de asserção específicas**, sem erro de carregamento. Executar na raiz:

```sh
/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --test .superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r2-repros.mjs
```

Comparei adicionalmente os mesmos programas em memória com o scanner de snapshot-r1 (somente o caminho de import do ast-helpers foi apontado ao helper existente), obtendo as diferenças R1/R2 descritas acima. Nenhum produto foi alterado. Nenhum quality completo, Loop/brain, build, instalação, nativo, subagente ou commit/push foi executado. Os únicos novos arquivos são task-2-review-r2-*.

Após fix2, rever somente estes três pontos, a preservação dos sete casos originais e regressões diretas do delta correspondente. Não abrir nova rodada geral de planos/design/gates. O controlador deve aguardar essa aprovação antes da validação final e fechamento.

---

# T01 — revisão focal R3 (após fix2)

**Spec: CHANGES_REQUESTED. Qualidade: CHANGES_REQUESTED. Validação/fechamento como concluído ainda não autorizado tecnicamente.**

Escopo restrito aos três achados R2, preservação dos sete R1 e regressões diretas de snapshot-r2 → snapshot-r3. Li fix2-report, delta, manifesto e documentação consolidada. Os **33 arquivos** conferem com seus hashes de snapshot e arquivos vivos. Delta de produto restrito a scanner/test; baseline inalterada.

## Correções confirmadas

Reexecutei Node **20.20.2**, três contratos e os dois arquivos originais de reprodução R1/R2: **125/125**, zero falhas/skips. Saída: task-2-review-r3-green.txt. Os sete R1 e os três R2 estão corrigidos nas reproduções originais.

Medição: **325 fontes / 1603 sinks / 135 findings em 40 arquivos (70 eyebrow, 16 dash, 49 jargon) / 922 diagnostics**. Baseline permanece igual a R2.

Focais adjacentes ao delta confirmados: namespace reexportado mantém origem, spread aninhado e spread de array retornado por função encontram separador, alias local de Alert continua reconhecido, binding local que oculta o import não é sink nativo.

## Único achado diferencial

### R3-A — não descartar origens estáticas ao perder cardinalidade exata de um spread (P2)

**Arquivo:** radiant-app/scripts/copy-style-contract.mjs:147–159, especialmente `resolved.length !== 1` em expandedArray; consumidor join:245–251.

```tsx
const values = condition ? ["jornada"] : ["Continuar"];
<Text>{[...values].join(", ")}</Text>;
```

Esperado: **um jargon** na origem literal `jornada`; o ramo possível é copy estática visível e ternários/arrays estão no domínio prometido.

Comparação em memória com os snapshots: **R2 encontra o jargon, sem diagnostics. R3 não encontra nada**, apenas `unresolved join spread cardinality`. O novo helper descarta os dois resultados quando resolve retorna mais de um array. Assim, a decisão sobre cardinalidade do separador também elimina a análise dos elementos, que antes funcionava.

Não é necessário resolver `condition`, executar código, nem provar cardinalidade arbitrária. Preservar a união de origens de texto estáticas independentemente de saber quantas posições serão renderizadas. O separador pode manter o tratamento conservador/diagnóstico previsto, sem apagar os elementos conhecidos. Não elevar baseline nem classificar essa perda como limite runtime.

Reprodução executável: `task-2-review-r3-repro.mjs`; saída: `task-2-review-r3-repro.txt` (**1/1 falha específica de asserção**, sem falha de módulo).

```sh
/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --test .superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r3-repro.mjs
```

## Próximo passo e limites

Corrigir somente a preservação das origens no caminho expandido de join, adicionar vermelho/verde específico e conservar os negativos de separador vazio/unitário. Re-revisão somente desse achado e delta direto; não reiniciar auditoria ampla.

Produto preservado. Só criei task-2-review-r3-*; sem quality completo, Loop/brain, build, nativo, instalação, subagentes, commit/push. Nenhum design/gate/plano amplo foi reaberto.

---

# T01 — revisão focal R4 (após fix3)

**Spec: APPROVED. Qualidade: APPROVED. Liberado tecnicamente para a validação final do controlador e, se ela passar, fechamento do run na ordem prescrita.**

Esta aprovação é da revisão T01 no snapshot-r4; não afirma que quality/Loop validate já rodaram, nem autoriza merge, build, nativo, publicação ou qualquer G1–G8.

## Escopo e integridade

Li task-2-fix3-report.md, audit/report consolidados e delta-r3.patch. Os **33 hashes** do manifesto conferem com arquivos do snapshot e arquivos vivos examinados. Produto no delta limitado a scanner/test; baseline inalterada. Revisão restrita ao achado R3-A, preservação dos casos anteriores e regressões diretas do delta. Sem nova auditoria ampla.

## Resultado

R3-A corrigido: expandedArray preserva a união das origens estáticas dos braços de arrays condicionais e mantém minimumLength separado para o separador. Os braços singleton não viram duas posições apenas por terem duas origens; os braços com duas posições preservam o separador. A coleta de texto não desaparece quando a cardinalidade exata fica incerta.

Reexecutei com **Node 20.20.2** os três contratos e todos os arquivos originais de reprodução R1/R2/R3: **129/129, zero falhas/skips**. Todas as reproduções que motivaram as correções estão verdes. Saída integral em task-2-review-r4-green.txt.

```sh
# cwd: radiant-app
/Users/anderson/.nvm/versions/node/v20.20.2/bin/node --test scripts/copy-style-contract.test.mjs scripts/maestro-contract.test.mjs scripts/checkpoint-performance-report.test.mjs ../.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r1-repros.mjs ../.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r2-repros.mjs ../.superpowers/sdd/2026-10-25-medalhao-execucao-subagentes/task-2-review-r3-repro.mjs
```

Quatro asserções adicionais em memória, todas aprovadas, restringiram-se à mudança:

- Spread aninhado de alternativas singleton: preserva jargon e não inventa dash.
- Array condicional retornado por função com parâmetro: preserva a origem do argumento e cardinalidade singleton.
- Alternativa vazia versus singleton: preserva o texto possível e mantém o diagnóstico de cardinalidade.
- Alternativa vazia/singleton com dois elementos fixos adicionais: preserva jargon e separador garantido pelos elementos fixos.

**Nenhum novo achado bloqueante no delta.** Não é necessário abrir outra rodada geral de revisão.

## Medição e limites preservados

Medição reproduzida: **325 fontes / 1603 sinks / 135 findings em 40 arquivos (70 eyebrow, 16 dash, 49 jargon) / 922 diagnostics**. Baseline permanece igual; os dois dashes reais recuperados em SubscriptionCard:25 e MatchingStepRenderer:36 continuam medidos.

A aprovação aceita a guarda estática delimitada e as fronteiras runtime/Map/reduce/regex documentadas; não declara prova absoluta de todo texto renderizado. Cardinalidade incerta continua explícita em diagnostics, sem apagar origens estáticas conhecidas. As tarefas seguintes devem reduzir os tetos, e o fechamento T17 ainda exige zero no domínio e revisão da fronteira.

O CTA Continuar trilha, seis YAMLs e consumidores não mudaram nos fixes. A evidência Jest anterior de 147/147 em três suítes permanece válida como execução anterior registrada; não a repeti nem a trato como nova execução desta revisão.

## Encaminhamento

O controlador pode executar a validação final configurada uma vez e, se aprovada, realizar step finish e run close, com eventual memória somente na ordem exigida. Se a validação falhar, tratar a falha concreta antes de fechar. A revisão T01 está aprovada; demais etapas/gates permanecem separados.

Produto preservado. Só criei task-2-review-r4.md e task-2-review-r4-green.txt. Sem quality completo, Loop/brain, build, instalação, nativo, subagentes, commit ou push.
