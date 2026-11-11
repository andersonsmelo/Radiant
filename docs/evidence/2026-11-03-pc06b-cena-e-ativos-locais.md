# PC06-B — campo abstrato e diagramas locais na prévia

Medido em 03/11/2026, branch `claude/conteudo-reinicio-tecnologo`, HEAD
`dcb6810`. Anderson pediu “Prossiga para o próximo” depois do PC06-A.
Esta entrega implementa a cena abstrata de M06.04 e a resolução local dos
quatro diagramas, sem registrar conteúdo na trilha ativa.

## Resultado técnico

`EditorialPracticePreview` recebe explicitamente o envelope de revisão PC05
e o ID da atividade. Reutiliza o player do PC06-A e seus callbacks efêmeros,
agora com renderer e resolução de imagem injetáveis. Sem material, continua
em preparação. Não há rota, conteúdo padrão, consulta de catálogo ou gravação
de progresso, XP, vida ou recompensa.

`EditorialPracticeMaterial` exige o contrato opt-in do piloto. Mantém
`promotionReady: false` e devolve as quatro lacunas `checkpoint-coverage`
em `coverageGaps`; essas são as únicas insuficiências toleradas para esta
prévia de práticas. Outros erros de contrato, ativo desconhecido, hash
divergente e configuração de bancada não implementada recusam a montagem.
Nenhuma regra de promoção ou aprovação por hash foi afrouxada.

### Bancada nova

`abstractCollimationScene` usa o modelo de colimação preservado, detector
27×33 cm e um retângulo abstrato central de 18 cm de largura. A altura e a
posição vertical do alvo são proporções gráficas artificiais, sem significado
anatômico. A cena não importa `CollimationImage`, `ExposureImage` ou o desenho
do fantoma anterior. Não calcula espalhamento ou dose em paciente.

`AbstractCollimationRenderer` implementa somente a configuração delimitada do
piloto: largura de 1 a 27 cm, passo de 1 cm, início em 27 cm e faixa artificial
de 18–20 cm. Usa os botões, ajuste acessível e slider de `BenchControlRow`.
O campo tem borda contínua, e o alvo, borda tracejada. O texto descreve alvo
inteiro/parcialmente fora e a proporção ocupada pelas margens laterais. Isso
permite comparar a geometria ao mudar o controle sem anunciar a largura do
alvo ou a faixa do gabarito antes da confirmação.

O desenho pode acompanhar o valor fracionário durante o arrasto; depois de
confirmar usa obrigatoriamente o valor inteiro registrado. Controles ficam
indisponíveis após a confirmação. Retorno e avaliação continuam no motor
existente, sem tentativa ou pontuação nova. A previsão e a explicação verbal
do brief continuam atividades de observação no futuro piloto.

### Diagramas e proporção

`EditorialLocalDiagrams` declara quatro `require` estáticos de PNG, com ID,
URI de referência, SHA-256 e dimensões 800×1000. O resolvedor aceita apenas
a combinação registrada; nunca troca uma recusa por `{uri: ...}` remoto.
Os testes conferem os bytes locais e os cabeçalhos PNG contra o manifesto
PC04, além de inspecionar por AST o caminho real de cada `require`.

Os renderers de região e comparação receberam uma resolução de imagem
opcional, explícita. Na prévia local, usam proporção 0,8; as comparações usam
`contain`, e as regiões normalizadas são aplicadas ao quadro com a proporção
do arquivo. Assim, a implementação evita letterbox desalinhado e o corte
do marcador que ocorreria com os quadros genéricos 4:3/16:9. As alternativas
visuais e textuais ficam indisponíveis após confirmar. O texto de ajuda usa
o nome real da ação de confirmação. O funcionamento sem resolvedor continua
compatível com os motores existentes e foi coberto por suas suítes originais.

**Limite da integridade/offline:** o runtime confere a identidade/metadados
contra o registro; não abre e recalcula o hash do arquivo nativo. A conferência
de bytes foi executada no repositório. Os módulos estáticos preparam o
empacotamento, mas não houve bundle/build ou teste de disponibilidade offline
no aparelho. No modo de desenvolvimento, o empacotador ainda pode servir
recursos pela rede. Nenhuma dependência, download ou configuração de cache
foi adicionada por esta entrega.

## Evidência de comportamento

Testes focados no Node 20.20.2: cinco suítes novas, mais as duas do PC06-A e
seis dos renderers/controles/modelo preservados. O comando usa
`EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand --runTestsByPath` e os treze
arquivos nomeados em `/tmp/radiant-pc06b-focused-final.log`.
**13 suítes/123 testes passaram, incluindo 40 testes novos.**

- Geometria: retângulos positivos e dentro do quadro, limites, entradas não
  finitas, área relativa e texto espacial sem faixa do gabarito.
- Ativos: bytes/dimensões reais, AST dos quatro imports e resolução recusada
  para ID, URI ou hash divergente. Dublês distintos dos módulos nos testes
  impedem que um único mock de PNG esconda a troca entre frente/costas.
- UI: controle e confirmação, vistas frente/costas com respostas próprias,
  imagens completas, regiões/lista, bloqueio após resposta e recusa de
  resolvedor nulo ou dimensões inválidas, sem fallback remoto.
- Material: rubrica, opt-in, fonte/versão e aprovações pendentes continuam
  obrigatórios; configuração de bancada diferente não usa silenciosamente
  esta cena.

Vermelhos específicos observados e restaurados antes do verde:

| Defeito introduzido/reproduzido | Teste que recusou | Recibo local |
| --- | --- | --- |
| Omitir a comparação de SHA no resolvedor | Hash divergente não pode resolver | `/tmp/radiant-pc06b-asset-red.log` |
| Acrescentar 300 unidades à largura desenhada | Retângulos precisam continuar válidos dentro do quadro | `/tmp/radiant-pc06b-geometry-red.log` |
| Manter quadro 4:3 para o diagrama 800×1000 | Quadro real da vista de frente deve ter proporção 0,8 | `/tmp/radiant-pc06b-aspect-red.log` |
| Manter prévia fracionária após confirmar 20 cm | Largura SVG deve passar de 204 para 200 unidades | `/tmp/radiant-pc06b-committed-geometry-red.log` |

O primeiro vermelho de módulo ainda inexistente não é prova de comportamento.
Uma chamada com flag inadequada iniciou a suíte inteira em vez do foco;
foi interrompida com código 130 e não conta como validação. O comando focado
foi corrigido para a lista explícita de treze arquivos.

TypeScript e lint focado passaram sem avisos. Contrato de texto: 65/65; análise
estática visual: zero regressões novas, 41 registros de baseline e 3 exceções
já existentes. Nenhuma exceção ou orçamento foi acrescentado. A conferência
do pacote PC05 e seus seis testes também passaram, sem alterar o artefato.

## Limites e continuação

Jest inspeciona árvore e propriedades que determinam o desenho; não rasteriza
os PNG/SVG nem mede layout, contraste renderizado, VoiceOver/TalkBack, texto
máximo, FPS ou qualidade tátil. A proporção e as coordenadas foram verificadas
estaticamente e por testes; aparência e equivalência em aparelho continuam
pendentes. Não houve Metro, build, instalação ou uso de simulador/aparelho.

As quatro aulas permanecem briefs com práticas de revisão, sem checkpoints
completos. Seus direitos, revisões e seis aprovações por hash continuam nos
gates de promoção. Catálogo ativo continua vazio e dados antigos preservados.
Sem mudança de documento externo, migração, commit, push, merge, EAS/OTA ou loja.

Próxima entrega: **PC06-C, transição para quem abrir aulas retiradas**, sem
converter progresso antigo em conclusão nova. Q6 e a prova nativa/offline do
conjunto continuam no PC06, que permanece aberto.

## Run e gate final

Writer `run-1793735875963-ef2cb665`, 22 caminhos declarados: onze novos arquivos
de código/testes, cinco arquivos existentes e seis documentos. A baseline já
incluía mudanças anteriores não commitadas, preservadas. Sessão do cérebro
`brain-session-1793735589576-6f88cb90` consultada e fechada antes do writer,
pois o gate de links chama a CLI.

Gate final configurado: **`VALIDATION_PASSED`, 15/15 em um ciclo**, via
`PYTHONDONTWRITEBYTECODE=1 caffeinate -i loop validate --run run-1793735875963-ef2cb665`.
Loop no Node 24.14.1; app/API no Node 20.20.2. Inclui o comando completo
`EXPO_NO_DOTENV=1 CI=1 npm run quality`, suíte inteira do app sem cache,
API, conteúdo, documentação e links do cérebro. Fundação continua em
`retired`, zero aulas e `publicationReady: false`. O gate foi iniciado após
a carga de um minuto baixar de 9,10 para 4,96, sem interromper processos alheios.
A medição inclui a árvore local anterior não commitada; não é CI de um SHA.
Recibo local: `/tmp/radiant-pc06b-validation.json`.

| Validador | Resultado | Evidência |
| --- | --- | --- |
| docs-contract | passou | `evidence-e36751c4-ae05-4256-9853-1b1d58f377f7` |
| content-foundation | passou | `evidence-4442e7df-69d3-4695-8833-8d334e04d0e7` |
| content-wave1 | passou | `evidence-80e74d7c-d54e-4dd2-8c59-55cd218d3bc1` |
| content-production | passou | `evidence-1b814ca6-4063-45fb-b94c-18a5f2f9ec47` |
| content-anchoring | passou | `evidence-e3563c63-6071-4d77-964e-961e5b7e7c61` |
| content-anchoring-data | passou | `evidence-25d0caa3-d8d3-43a8-b7b4-bdd4d9c3356d` |
| content-no-verbatim | passou | `evidence-c23e942a-8d49-43ff-8f5e-a87f670ca3ba` |
| content-source-rights | passou | `evidence-47659c87-84a7-4130-9434-2b5fab0f81d8` |
| content-python | passou | `evidence-22595d7b-270c-4c26-8a0e-e295916ce660` |
| app-quality | passou | `evidence-6288bf4d-b42d-4638-8219-a898b940a306` |
| app-test | passou | `evidence-78536fe2-0d09-4958-b140-2a9f8917a9eb` |
| api-lint | passou | `evidence-feabcd06-a7be-49bd-a2b0-d3d23bb40c49` |
| api-typecheck | passou | `evidence-f27f4b6a-dab8-437c-a10e-e17285336e17` |
| api-test | passou | `evidence-1e3a1ca4-490c-4e0d-bd4f-c41cce1211d0` |
| brain-links | passou | `evidence-e4e38d89-609e-4748-8c13-fcd3ae0c76cf` |

Os envelopes públicos de `step finish` e `run close` comprovam o fechamento;
validar sozinho deixa o run em `validating`.
