# PC04 — pacote do piloto preparado para revisão

Medição: 03/11/2026. Branch `claude/conteudo-reinicio-tecnologo`, HEAD
`dcb681072ddc95ab5e00aa9e8a34a770c9252ad0`. Rascunho de produção;
**não é aceite editorial, clínico ou liberação de ativos**.

## Documento e recorte entregue

O [Google Doc do PC04](https://docs.google.com/document/d/1-OLHVS-QnG69Gm5EGwV_UslxBj3OP3g9W62GEUvAEUE)
é o documento canônico de produção. Contém cinco briefs — M01.01, M01.02,
M02.01, M02.02 e M06.04 — com objetivo, pré-requisitos, fontes, ativos,
atividade, erros esperados, rubrica, acesso equivalente e limites das variantes.
M01.01 está escrita por inteiro: quatro etapas, uma questão de prática, dois
itens inéditos de checkpoint e dois contextos distintos de recuperação. Cada
questão tem quatro alternativas, gabarito e retorno por alternativa.
Os itens de checkpoint e recuperação não são interações adicionais da atividade
principal v1. Com dois itens de mesmo peso, 80% exige 2/2; isso não certifica
competência clínica.

O [manifesto técnico](2026-11-03-pc04-pilot-manifest.json) fixa ID/revisão do
Google Doc, hash UTF-8 do corpo autorado, referências, hashes de captura das
fontes e SVG/PNG, famílias e identidades propostas. Não duplica a prosa de
produção e não é um candidato de promoção. O documento foi criado privadamente
e movido para a pasta ChatGPT já existente, sem alterar compartilhamento.

## Fontes, direitos e figuras

Cinco fontes tiveram corpo recuperado e declaração CC BY 4.0 conferida:

| Referência | Uso factual delimitado |
|---|---|
| S01 — Cornacchione et al., 2026 | Aquisição, qualidade e papéis por contexto; sem converter pesquisa europeia em atribuição legal brasileira. |
| S02 — ESR/EFRS, 2019 | Identificação, comunicação e responsabilidades de segurança em cenários simulados. |
| S03 — Weber, Ju e Börner, 2020 | Eixos de referência corporal; não fornece posicionamento de incidências. |
| S04 — Chung et al., 2020 | Significado de marcador lateral R/L; sem reproduzir imagens clínicas nem transferir estatísticas ao Radiant. |
| S05 — Alsleem et al., 2019 | Relação qualitativa entre campo, colimação e espalhamento; recorte eletrônico não substitui colimação anterior à exposição. |

URLs, citações completas, localizadores e marcas de licença estão no manifesto
e no documento. Usou-se síntese factual em português e atividades originais;
nenhuma figura, tabela ou banco de questões dessas publicações foi copiado.
Figuras com permissões particulares dessas mesmas páginas não foram tratadas
como cobertas pela licença geral. Não se usou texto/figura OpenStax, Oregon,
material NC/ND ou `reference-only` na autoria.

Foram criados quatro diagramas esquemáticos originais com assistência de IA,
em `radiant-app/assets/content/rtg-2026/pilot/`: `view-front`, `view-back`,
`marker-a` e `marker-b`, cada um com SVG editável e PNG 800×1000.
Os arquivos existem como ativos de revisão, sem importação no app. A licença
CC BY 4.0 é **proposta**, com revisão técnica, autoria/crédito e aceite de
direitos ainda pendentes. Não representam paciente, escala anatômica ou posição
anatômica completa; a referência frente/costas deve ser conferida pelo revisor.
Os pares têm conteúdo e hashes distintos, não apenas nomes distintos.

## Limites da bancada e divergência corrigida

A redação antiga do plano chamava o modelo de M06.04 de “já aprovado”. A
[ADR de 24/10](../adr/ADR-2026-10-24-aula-bancada-fisica-digital-e-colimacao.md)
registra aceitação pelo agente e aval científico do dono pendente. O plano foi
corrigido. PC03-A autoriza o piloto, sem aprovar retroativamente ciência ou
exemplos retirados.

O motor genérico `collimationModel.ts` usa detector 27×33 cm e calcula dimensões,
área, fração do campo e razão de área. Não calcula dose individual ou
espalhamento físico. O brief propõe uma **cena nova**, retângulo abstrato de
18 cm, controle único de largura, meta didática 18–20 cm e início em 27 cm.
Essa tolerância é artificial e não é protocolo clínico; a cena ainda não foi
implementada. A previsão será observação verbal no piloto, pois o payload
`bench` atual não registra escolha de previsão separada. Não se reaproveitaram
fantoma, texto, pergunta ou alvo da aula retirada.

## Evidência de integridade e apresentação

- Leitura nativa de volta do Google Docs: corpo textual igual ao esperado,
  147 parágrafos, 21 títulos, 11 itens de lista nativos e uma imagem incorporada.
  Fontes S01–S05 têm links de referência. Revisão/hash constam do manifesto.
- Exportação PDF apenas para conferência local: 11 páginas, 314405 bytes.
  Todas as páginas foram inspecionadas visualmente. Uma correção de paginação
  manteve títulos/família junto ao início dos briefs; a exportação final foi
  reinspecionada. Sem página vazia, corte de texto ou transbordamento de imagem
  observado. O PDF local não é outro documento canônico.
- Checagem direta: cinco briefs, cinco fontes e quatro ativos; hashes SVG/PNG
  distintos; SVG XML válido; PNG 800×1000; regiões de hotspot positivas dentro
  do quadro. Isso não comprova correção anatômica ou equivalência em VoiceOver.
- Contrato documental focado: 18/18 testes passaram no Node 20.20.2.
- Validação final configurada: `loop validate --run run-1793704555798-67c710be`
  sob `caffeinate -i`, CLI no Node 24.14.1 e validadores do app/API no Node
  20.20.2, retornou **VALIDATION_PASSED: 15/15 em um ciclo**. Inclui
  `EXPO_NO_DOTENV=1 CI=1 npm run quality`, a suíte inteira do app sem cache,
  lint/typecheck/test da API, contratos documentais, conteúdo e links do cérebro.
  A saída de fundação confirma estado `retired`, `lessonCount: 0` e
  `publicationReady: false`. A medição inclui a árvore local com o PC05 anterior
  ainda não commitado; não equivale a CI de um SHA publicado.

| Validador | Resultado | Evidência |
|---|---|---|
| docs-contract | passou | `evidence-8677fbfa-be65-4630-abf3-91e21e279a6f` |
| content-foundation | passou | `evidence-a3afa12d-d642-4822-89b5-1da882050ad3` |
| content-wave1 | passou | `evidence-b83e52be-ee0c-4487-a05b-ffd1b0d3baa3` |
| content-production | passou | `evidence-08de1de7-ae32-422b-abdc-930810467b2e` |
| content-anchoring | passou | `evidence-37847aa1-7365-47bb-ab5e-1c6571478b67` |
| content-anchoring-data | passou | `evidence-5d927883-9572-4bb1-8316-ba41d4672a8f` |
| content-no-verbatim | passou | `evidence-3f536bf1-710d-4c72-9c83-0de61874d581` |
| content-source-rights | passou | `evidence-2d726c1f-e3a7-4b3b-a9db-ecba3da8a79c` |
| content-python | passou | `evidence-939258a9-aeb1-4884-a466-13b77c234421` |
| app-quality | passou | `evidence-4d15f845-2518-4919-9097-c335579f4a6c` |
| app-test | passou | `evidence-f7816348-fcf7-4ce4-b8ff-5806b88a18ee` |
| api-lint | passou | `evidence-63c519e1-7563-4e4c-9568-3b01376663ab` |
| api-typecheck | passou | `evidence-82392ccf-baae-4996-9274-ba959197596b` |
| api-test | passou | `evidence-e38a17df-c97f-4441-a3bf-416c08e54e02` |
| brain-links | passou | `evidence-29221219-651e-41c2-a497-cca0f4fe972f` |

Run de escrita: `run-1793704555798-67c710be`. Sessão de leitura do cérebro:
`brain-session-1793704063262-790cbc6c`, fechada antes da validação final.
Os arquivos já alterados pelo trabalho anterior PC03-A/PC05 foram preservados;
o run PC04 declara apenas seus documentos, manifesto e oito arquivos de arte.
Não houve commit, push, build, instalação, migração, publicação ou release.

## Pendências e continuação

PC04 está **preparado para revisão**, sem cumprir ainda o critério de ativos
liberados. Claude foi indicado por Anderson para revisão técnica/editorial por
IA, mas não foi executado parecer do Claude nesta etapa. PC03-B continua
pendente e cobre ordem/cobertura do mapa, cinco briefs e a aula completa.
Conferir escopo brasileiro, gabaritos, distratores, acessibilidade dos diagramas,
modelo de colimação e direitos por ativo. Registrar parecer e ajustes sem
transformar revisão por IA em aprovação clínica.

Depois dos ajustes, gerar candidatos reais e conferir PC05, mantendo os seis
gates de promoção. Não ativar conteúdo, converter progresso antigo, retomar
exemplos retirados ou iniciar PC06 apenas porque existe este rascunho. PC06
continua dependente de PC03-B, PC04, PC05 e autorização de implementação.

## Registro posterior — revisão PC03-B concluída em 03/11/2026

O estado acima preserva a entrega inicial PC04. Depois dela, Claude aceitou
o mapa, cinco briefs, M01.01 e quatro PNGs como revisão técnica/editorial por IA.
Três ajustes menores foram corrigidos e conferidos, sem novos achados.
O [parecer PC03-B](2026-11-03-pc03b-revisao-claude.md) e o
[registro estruturado](2026-11-03-pc03b-review.json) contêm a proveniência,
limites e confirmação. O manifesto agora aponta à revisão atual do Google Doc.
Direitos dos ativos e aval da bancada continuam pendentes; o pacote ainda não é
candidato promovido ou conteúdo ativo. A exportação revista tem 11 páginas,
321107 bytes, todas inspecionadas, com imagem e legenda juntas.

## Aceites posteriores de Anderson — 03/11/2026

Em respostas explícitas nesta conversa, Anderson confirmou:

- **“Aprovar crédito e licença propostos”**: “Radiant — criado com assistência
  de IA (Codex), 2026” e CC BY 4.0 para os quatro diagramas, nos direitos que
  possam ser concedidos, sem afirmar autoria humana ou exclusividade de saída de IA.
- **“Aprovar esse uso didático delimitado”**: modelo qualitativo de detector
  27×33 cm e área relativa, cena abstrata nova com alvo de 18 cm e faixa
  didática 18–20 cm; não cálculo de dose/espalhamento físico ou protocolo clínico.

Esses aceites sucedem as pendências registradas acima, no recorte do piloto
novo; não reativam os exemplos retirados. PC04 concluído no escopo de cinco
briefs e uma aula completa com fontes/ativos liberados nos limites declarados.
PC05 ainda depende de gerar e conferir os payloads reais; não há promoção,
build, migração ou release concedidos por estas respostas.
