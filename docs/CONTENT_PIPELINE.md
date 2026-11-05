# Pipeline editorial do Radiant

> Este documento é o contrato técnico de produção e direitos. A sequência curricular e as fontes propostas pertencem exclusivamente ao [planejamento de conteúdo](plans/2026-11-02-planejamento-conteudo-radiant.md). Os dados editoriais anteriores estão sendo retirados; não regenerar nem promover lotes antigos.


## Objetivo

Manter conteúdo educacional versionado, rastreável, revisável e seguro para
promoção incremental ao app e à API.

`conteúdo/` é a raiz editorial canônica. Todo artefato pedagógico deve preservar
proveniência até fonte, trecho e conceito. A expansão por competências acrescenta
decisões explícitas de direitos e mídia antes da produção de novas unidades.

## Estado validado em 2026-07-31

### Pipeline legado promovido

- 1 obra piloto processada;
- 75 páginas e 109 trechos extraídos;
- 109 classificações, 30 em `needs-review`;
- 16 conceitos, 7 em `needs-review`;
- 96 bundles em seis formatos, com 42 marcações `needs-review` derivadas;
- 18 atividades prontas nas trilhas Fundamentos, Tórax e Abdome;
- catálogo promovido sincronizável para app e seed da API.

### Nova biblioteca

- 41 PDFs no disco;
- 36 fontes únicas e 5 duplicatas detectadas por SHA-256;
- 4 fontes `authorized`;
- 15 fontes `reference-only`;
- 17 fontes `blocked`.

O catálogo está em `conteúdo/fontes/library-catalog.json`. `reference-only`
autoriza apenas consulta factual com redação original; `blocked` impede qualquer
derivação editorial até nova decisão humana documentada.

### Mídia

`conteúdo/mídia/manifest.json` está em
`awaiting-authorized-assets`: há 0 ativos aprovados e 5 candidatos rejeitados.
O validador exige autorização, SHA-256, modalidade, região, descrição acessível,
anonimização verificada e hotspots normalizados quando aplicáveis. O manifesto
verde sem itens confirma a integridade do gate, não a prontidão do lote.

## Fluxo vigente

1. Inventariar fonte e calcular SHA-256.
2. Registrar licença, uso comercial, usos permitidos e decisão humana.
3. Extrair páginas e trechos somente de fonte permitida para o uso pretendido.
4. Classificar trechos e normalizar conceitos.
5. Gerar bundles pedagógicos preservando proveniência.
6. Revisar e aprovar no painel editorial.
7. Promover com `scripts/content/promote-to-catalog.mjs`.
8. Sincronizar app e seed da API.
9. Validar a cadeia completa.

Para lotes curriculares v2, a promoção usa `ProductionBatchV1`, não o payload
legado. O lote carrega atividades, competências, fontes, checkpoint,
reforços, schemas, hash material e seis decisões independentes. Qualquer mudança
material altera o hash e invalida as decisões. A publicação em arquivo usa
compare-and-swap pelo hash esperado, temporário + `fsync` + rename atômico; o
changelog e a instrução de rollback vivem no mesmo catálogo para não existir
promoção parcial.

Para o sistema por competências, antes dos passos 3–8 também é obrigatório:

1. aprovar o lote de mídia no manifesto;
2. mapear atividade para competência observável;
3. revisar a unidade como lote completo;
4. provar checkpoint e retenção antes de expandir para a unidade seguinte.

## Contrato genérico de lotes v1 — 2026-10-17

`EditorialBatchContract.ts` substitui o validador de quantidades fixas do H4.
Cada lote declara competências, fontes, atividades e itens. O recorte v1 mantém
uma múltipla escolha sem mídia por atividade, uma competência por item/atividade,
ao menos uma prática e dois itens de avaliação por competência, limiar de 80%
e os dois ciclos de reforço existentes. Testes sintéticos preservam os contratos;
as quantidades históricas12/10/5/8 não viram regra de toda unidade. O conteúdo H4
foi retirado, não arquivado como fixture clínica.

Toda origem exige HTTPS, atribuição, data válida, fingerprint e a licença
CC BY 4.0 já admitida. Ampliar licenças, mídia ou famílias de interação exige
contrato/revisão próprios. Claims precisam corresponder ao item e suas fontes;
distratores autorais são identificados como tais. Duplicados, órfãos, versões
incoerentes e cobertura ausente impedem promoção. Isso verifica estrutura e
rastreabilidade; a correção clínica e o uso permitido continuam com os revisores.

A publicação em arquivo executa o mesmo validador do app, carregando somente
módulos TypeScript locais confiáveis; dados JSON nunca são executados. É preciso
ter as dependências do app instaladas, ou TypeScript 5.9.2 via `NODE_PATH`, como
no job de conteúdo do CI. Em estado ativo, o catálogo anterior também é validado
e colisões entre lotes impedem a escrita. Em estado `retired`, não há catálogo
pedagógico anterior: os validadores exigem o vazio explícito e não prontidão de
publicação; os sincronizadores recusam regenerar aulas. A confirmação de hash/revisores/schemas e os seis gates
são obrigatórios, mesmo quando o material isolado é estruturalmente válido.

`audit-production-batches.mjs` lê o registro compilado por padrão, ou um array
JSON com artefatos/drafts por `--input=<arquivo>`. O relatório distingue material
válido de promoção válida, apresenta cobertura por competência e quantidade de
lotes com pendência em cada regra. `--check` retorna erro se algum lote não tiver
promoção íntegra. É rendimento de validação da amostra, não eficácia pedagógica,
volume aprovado para publicação ou medida longitudinal de custo/retrabalho.

O painel `/production-batches` é somente leitura. Um JSON publicado em arquivo
não passa automaticamente a integrar o app: o registro de lotes/apresentação e a
composição precisam da revisão de integração e dos gates de ativação. O gate
Loop `content-production` roda testes de publicação/auditoria e o registro real.
O job Linux instala apenas o compilador fixado; a execução remota não foi rodada
nesta etapa. [Evidência](evidence/2026-10-17-trilha-g3-contrato-editorial.md).

## PC05 — extensão explícita do piloto, 03/11/2026

O contrato v1 acima continua disponível sem mudanças de licença ou economia.
O campo opcional `pilot` de `EditorialCurriculumCandidateV1` ativa o contrato
`EditorialPilotContractV1` (`schemaVersion: 1`, namespace `rtg-2026`). A ausência
desse campo mantém somente múltipla escolha sem imagem, inclusive em telas de
apresentação e sem `exposureImage` embutido. Não existe fallback de formato.

### Famílias e evidência obrigatória

Cada atividade tem exatamente uma interação, uma competência declarada e
confirmação explícita antes do retorno. O schema de atividade existente continua
validando geometria, gabarito e controles; a extensão acrescenta:

| Família | Contrato do piloto | Resposta alternativa declarada |
| --- | --- | --- |
| `multiple-choice` | Sem imagem, sem bancada embutida; alternativas e retorno com claims | `choice-buttons` |
| `ordering` | Permutação exata, itens únicos e rótulos preenchidos; sequência correta com claim próprio | `order-buttons` |
| `hotspot` | Diagrama declarado, regiões normalizadas com área positiva, rótulos, IDs e gabarito sem repetição | `region-list` |
| `comparison` | Exatamente duas opções com nomes acessíveis, diagramas declarados com hashes distintos e alternativa correta rastreável | `choice-buttons` |
| `bench` | `challenge` ou `correct`, controle do simulador correto, valores finitos e passo positivo dentro da faixa; limites do modelo declarados | `increment-buttons` |

`case-decision`, `parameter-lab`, `matching` e outras famílias continuam fora do
contrato do piloto. Ter tipo ou renderer não lhes concede elegibilidade editorial.
Em 03/11/2026, o PC06-D registrou o renderer textual de `case-decision`,
com contexto e fases opcionais em capítulos explícitos. A elegibilidade continua
recusada: não houve extensão editorial para Q6 nem promoção de aula.
[Evidência do renderer](evidence/2026-11-03-pc06d-renderer-case-decision.md).
O checkpoint continua múltipla escolha, limiar de 80%, ao menos dois itens por
competência e os dois ciclos de reforço existentes. Não foi criada economia nova.

`pilot.evidence` exige exatamente um registro por atividade e item de checkpoint:
`targetId`, `variantId`, `successCriterion`, `criticalErrors`,
`accessibleAlternative`, `responseMode` e `sourceIds`. A fonte deve pertencer ao
próprio alvo; `bench` também exige `modelLimits`. Interação marcada
`criticalSafety` exige barreira crítica explícita, sem convertê-la em média ou
reescrever pontuação. Registros ausentes, duplicados ou órfãos são recusados.

Esses campos são especificação revisável de rubrica e equivalência, não prova de
correção científica ou de experiência com leitor de tela. PC03-B revisa conteúdo
e pistas involuntárias; PC06 mede os controles e a equivalência de fato. Nenhum
metadado substitui esses aceites.

### Fontes, diagramas e hash

`pilot.assets` admite somente `authorial-diagram`, com ID, URI HTTPS, autor,
atribuição, referência HTTPS de autoria/direitos, SHA-256, fontes factuais e
licença CC BY 4.0. Imagem real de paciente, licença NC, CC0/SA ou outra licença
não está liberada por esta extensão. A verificação estrutural exige declaração
completa; os revisores conferem autoria, direitos, exatidão e bytes do ativo.

Toda `imageRef` deve corresponder exatamente a uma URI declarada; ativos sem uso,
URIs repetidas e imagens sem registro são recusados. O campo `media` do draft e
do lote promovido deve ser idêntico a `pilot.assets`, sem mídia lateral não
aprovada. O protótipo ainda precisa empacotar e verificar os ativos para uso
offline: declarar uma URI HTTPS não prova disponibilidade nem integridade baixada.

Claims são derivados das atividades reais: enunciado, retorno, alternativas,
sequência/regiões e gabarito, apresentações e modelo da bancada. Alternativas
erradas de escolha mantêm marcação de distrator autoral; rótulos de regiões e
etapas ordenáveis continuam respaldados por fontes. Nenhum corpus antigo foi
reintroduzido para preencher esses campos.

O fingerprint inclui o objeto `pilot` completo quando presente. Ativos, variantes,
rubricas, alternativa acessível, limites e conteúdo ficam vinculados às mesmas
seis aprovações por hash. Promoção, revalidação do artefato salvo, publicação
atômica e auditoria usam o mesmo contrato. O hash de material v1 sem extensão
permanece igual; não há migração automática de artefatos ou aprovações antigos.

### Primeira conferência com material real — 03/11/2026

O [pacote PC05](evidence/2026-11-03-pc05-payloads.md) serializa a aula M01.01
e as práticas dos quatro briefs, com uma variante e dois contextos de recuperação.
O verificador `scripts/content/check-pilot-payloads.mjs` é somente leitura:
usa o schema real, confere bytes locais e exige que o lote incompleto continue
recusado pelas quatro competências sem checkpoint. O candidato M01.01 valida
sem conceder os seis aceites por hash. Retornos por alternativa do checkpoint,
ajuda e recuperação são dados auxiliares pendentes de integração no PC06;
não foram introduzidos por campo oculto no contrato v1. O JSON é artefato de
revisão, sem registro no runtime ou declaração de disponibilidade HTTPS/offline.

### Consumo isolado dos dados auxiliares — PC06-A, 03/11/2026

O adaptador `EditorialPreviewMaterial` e o componente `EditorialLessonPreview`
recebem o candidato M01.01 e seus dados auxiliares explicitamente. Os retornos
do checkpoint viram `explanation` das alternativas do motor; os dois contextos
de recuperação mantêm IDs e métodos de evidência próprios. A ajuda distingue
confirmação assistida. Dados incompletos, identidades antigas/repetidas e
recuperações trocadas são recusados. Não altera o hash/contrato de promoção,
não registra o pacote no catálogo e não grava progresso. Esta é integração
num componente de revisão sem rota, e não a integração transacional da trilha.
[Evidência e limites nativos](evidence/2026-11-03-pc06a-previa-editorial.md).

**Consumo das práticas no PC06-B (03/11/2026):** `EditorialPracticePreview`
aceita material e ID explícitos, com contrato opt-in, e mantém as lacunas de
checkpoint visíveis no resultado `promotionReady: false`. Usa uma cena abstrata
própria para a configuração delimitada de colimação e módulos PNG estáticos
para os quatro diagramas. Resolução desconhecida ou hash divergente recusa
a prévia; não há fallback à URI remota. Bytes/dimensões/imports foram
conferidos no repositório, sem re-hash nativo ou prova offline em aparelho.
[Contrato da implementação e limites](evidence/2026-11-03-pc06b-cena-e-ativos-locais.md).
O catálogo e os gates de promoção permanecem separados dessa prévia.

**Entrada isolada PC06-E (04/11/2026):** `/editorial-preview` exige `__DEV__` e
`EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1`. O resolvedor Metro substitui os módulos
`editorial-preview/dev/` e o JSON de revisão por uma tela indisponível quando o
grafo não é de desenvolvimento com opt-in, inclusive com flags de ferramentas
ligadas em release. O host injeta diretamente o pacote PC05, sem duplicar aulas,
registrar catálogo ou importar fixtures de teste. Q6 usa cenário sintético próprio
fora do lote. M01.01, práticas Q2–Q5 e avisos reutilizam os componentes existentes;
seleção é descartada ao voltar ao menu. Sem escrita de progresso/XP/vidas.
A ordenação passa a bloquear controles após confirmação; foco/anúncio e remedição
de texto por escala foram integrados. Prova nativa parcial de menu/aviso no iOS;
VoiceOver/TalkBack, controles por driver e empacotamento/offline autônomo ainda
pendentes. [Evidência e reprodução](evidence/2026-11-04-pc06e-integracao-e-provas.md).

**Aviso de retirada, 05/11/2026:** título e corpo de `ContentUpdatedScreen`
invalidam a medida nativa por `fontScale`, incluindo duas escalas já ampliadas.
A troca não remonta o host nem o botão e conserva a guarda de foco/anúncio único.
Os textos e o destino aprovados continuam os mesmos. A prova mede o corte por
altura antiga; experiência real de leitor de tela segue pendente.
[Evidência](evidence/2026-11-05-pc06e-aviso-texto-ampliado.md).

**Pacote do piloto, 05/11/2026:** `lessonCompanions` guarda retornos por alternativa,
ajuda e recuperações das quatro aulas novas. O verificador agora exige o lote sem recusa
de cobertura e a promoção recusada sem aprovações. O contrato recusa, com
`checkpoint-constant-answer`, a competência cujos itens têm todos o mesmo texto de resposta.
[Evidência](evidence/2026-11-05-pc04-quatro-aulas.md).

### IDs do primeiro lote e versões

As identidades novas usam `<tipo>:rtg-2026:<escopo>:<nome>`, com segmentos ASCII
minúsculos, números ou hífen. Exemplos de forma, sem catálogo ativo:
`activity:rtg-2026:pilot:m02-02-a` e `item:rtg-2026:pilot:m02-02-a-check-1`.
Competência, atividade, interação, etapa, item, opção, fonte, ativo e checkpoint
têm identidades distintas; os metadados não reciclam `lesson-1`, H4, bancada ou
IDs L1/L2. O batch usa `batch:rtg-2026:...` e `contentVersion` usa
`rtg-2026-...`.

Para cada alvo, `variantId` troca somente o prefixo por `variant:` e preserva os
segmentos restantes. Assim, variante nova exige identidade nova do alvo; mudar
somente o metadado não torna um item antigo novo para a revisão espaçada.
A competência identifica a habilidade; `contentVersion` identifica a revisão do
lote e não é um atalho para atribuir conclusões. Os rótulos curriculares Mxx.yy
continuam referências do plano. IDs finais, fontes e rubricas do lote real só
serão conferidos depois dos briefs do PC04.

### Transição aprovada no PC03-A — especificação para PC06

Preservar dados e conquistas, sem limpar nem migrar AsyncStorage. Conclusões e
revisões antigas não se tornam evidência das novas competências por semelhança
de título. O catálogo retirado não é reconstituído por remoto, fallback ou link.

| Entrada existente | Comportamento a implementar e testar no PC06 |
| --- | --- |
| `/learn?blockId=...` com atividade retirada, com ou sem `nodeId` | Resolver disponibilidade antes de gravar cursor/nó; aviso de conteúdo atualizado e ação para a trilha atual, sem iniciar tentativa ou conceder efeito. |
| `/quiz` ou `/licao-hibrida` apontando para aula retirada | O mesmo aviso e destino; não transformar a ausência em início da primeira aula nova. |
| `/review` com revisão devida de item retirado | Não apresentar item sem conteúdo nem apagar o histórico; contar e oferecer apenas itens do catálogo aprovado atual. Sem itens elegíveis, explicar o estado e oferecer a trilha. |
| “Continuar” com cursor/nó aposentado | Não reaproveitar posição por índice ou ID antigo; informar a atualização e deixar o aluno escolher a entrada na trilha nova. |

Texto de trabalho: **“Este conteúdo foi atualizado”**; **“Seus dados e conquistas
foram preservados. Esta aula não está mais disponível. Conheça a nova trilha.”**
Ação: **“Ver a nova trilha”**, destinada a `/(tabs)`; se não houver lote novo
aprovado, mostrar o estado vazio honesto, sem aula sintética ou promessa de
publicação. Foco e anúncio devem identificar o aviso; a ação não exige gesto.

Experiência implementada localmente no PC06-C em 03/11/2026;
[evidência, testes e limites](evidence/2026-11-03-pc06c-transicao-conteudo-retirado.md).
O aviso é resolvido antes de montar uma tentativa; a retomada de conteúdo ausente
não consome tentativas de restauração. A leitura da trilha não regrava histórico
retirado, e os contadores exigem definições atuais. A prova nativa permanece
pendente. Os testes de rotas/serviços cobrem: abertura por
link com e sem nó, reentrada/interrupção, retorno à trilha, revisão sem item
válido, preservação dos registros antigos e ausência de escrita prematura,
XP/vidas/recompensa ou conclusão indevida. Nenhum teste do contrato editorial
substitui essa prova de rota e armazenamento.

Implementação estrutural e limites registrados na
[evidência PC05](evidence/2026-11-03-pc05-contrato-editorial.md) e na
[ADR](adr/ADR-2026-11-03-pc05-contrato-piloto-e-identidades.md).

## Ferramentas

| Comando | Finalidade |
| --- | --- |
| `node scripts/content/catalog-library-sources.mjs` | gera o inventário determinístico da biblioteca |
| `node scripts/content/validate-foundation.mjs` | valida a fundação editorial agregada |
| `node scripts/content/validate-media-manifest.mjs` | valida autorização e anonimização da mídia |
| `node scripts/content/promote-to-catalog.mjs` | promove bundles aprovados |
| `node scripts/content/production-batch.mjs --input=<json> --catalog=<json> --expected-sha256=<sha256\|absent>` | recalcula o hash material e publica um `ProductionBatchV1` sob lock exclusivo, expected hash e rename atômico |
| `node --test scripts/content/production-batch.test.mjs` | prova gates, adulteração material, escritores concorrentes, conflito de hash e rollback antes do rename |
| `node scripts/content/sync-catalog-to-app.mjs` | gera artefatos do catálogo local |
| `node scripts/content/sync-catalog-to-api.mjs` | gera o seed remoto correspondente |
| `node --test scripts/content/wave-1-priority-tracks.test.mjs` | protege as trilhas da Wave 1 |
| `node scripts/qa/wave-1-smoke.mjs` | verifica o fluxo local da Wave 1 |

## Fontes de verdade

- `conteúdo/fontes/library-catalog.json`: inventário e direitos da nova
  biblioteca;
- `conteúdo/mídia/manifest.json`: ativos aprovados e candidatos rejeitados;
- `conteúdo/governança/catalog-payload.json`: envelope vazio explícito durante a retirada;
- `radiant-app/src/features/student-checkpoints/production-batches.ts`: batches
  v2 promovidos compilados pelo app;
- `conteúdo/governança/wave-1-priority-tracks.json`: trilhas prioritárias;
- `radiant-app/src/data/ai-lessons.ts` e `ai-catalog.ts`: artefatos gerados;
- `radiant-api/sql/003_seed_editorial_catalog.sql`: espelho gerado para a API.

## Regras de publicação

- nunca copiar texto ou imagem de obra comercial sem permissão compatível;
- nunca inferir autorização pelo nome ou pela origem aparente do arquivo;
- nunca promover mídia sem manifesto e anonimização verificadas;
- nunca substituir o catálogo local por payload remoto inválido;
- nunca editar manualmente os artefatos gerados do app ou da API;
- depois de aprovar bundles, sincronizar app e API antes do commit;
- declarar o catálogo pronto somente com os gates correspondentes executados.
- nunca reutilizar uma aprovação depois de mudança no hash material;
- nunca publicar lote v2 sem os seis gates ou sem o hash esperado do catálogo.

O registro histórico `production-batches.ts` fixa o hash do material já promovido;
não o recalcula ao importar uma edição do candidato. O teste importa esse registro
com material alterado e exige a recusa, protegendo a invalidade das decisões
anteriores no caminho real. Mudança futura exige novas aprovações explícitas.

## PC04 — pacote de autoria para revisão, 03/11/2026

Os cinco briefs e a aula completa M01.01 têm como documento de produção
canônico o [Google Doc do PC04](https://docs.google.com/document/d/1-OLHVS-QnG69Gm5EGwV_UslxBj3OP3g9W62GEUvAEUE).
O repositório mantém o [manifesto técnico](evidence/2026-11-03-pc04-pilot-manifest.json),
quatro diagramas autorais em SVG/PNG e a [evidência](evidence/2026-11-03-pc04-pacote-piloto.md).
O manifesto registra a revisão e o hash do texto lido de volta, fontes, licenças,
ativos e identidades propostas; ele **não é** um candidato `ProductionBatch`.

As cinco declarações CC BY 4.0 foram conferidas no corpo recuperado das fontes.
Nenhuma figura de terceiro foi incorporada. Anderson aprovou crédito e CC BY 4.0
dos diagramas em 03/11, nos direitos que possam ser concedidos, sem declaração
de autoria humana/exclusividade. Revisão por Claude aceita no PC03-B. A leitura de volta e a inspeção
do PDF conferem integridade e apresentação, não correção científica.

PC03-B recebeu aceite técnico/editorial por IA do Claude em 03/11/2026 para o
mapa, cinco briefs, M01.01 e quatro PNGs. Três ajustes menores corrigidos e
conferidos; [parecer](evidence/2026-11-03-pc03b-revisao-claude.md). Gerar os
payloads reais e conferir o contrato PC05. Os aceites de direitos/crédito por
Anderson e do uso didático delimitado da bancada foram registrados
separadamente do parecer em 03/11; não equivalem à promoção do lote. Não criar aprovações
automáticas a partir deste manifesto nem reaproveitar IDs/progresso retirados.
A cena M06.04 é nova e abstrata: o motor mede área relativa do campo, não dose
em paciente ou espalhamento físico. Não há candidato promovido, conteúdo ativo
ou autorização de build/release nesta entrega.
