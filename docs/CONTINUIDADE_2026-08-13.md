# Prompt de continuidade — Radiant, 2026-08-13

Cole o bloco abaixo numa sessão nova. O objetivo imediato é corrigir e converter
o candidato curricular da H4 sem inventar aprovações humanas.

```text
Continue o Radiant em /Users/anderson/Developer/Radiant.

Use task-observer, using-loop e loop-development. Se precisar alterar código ou
conteúdo, use TDD e abra o run pelo wrapper do projeto antes da primeira edição.

Antes de editar:
1. leia integralmente AGENTS.md e .loop/project.yaml;
2. rode git status --porcelain e preserve qualquer mudança preexistente;
3. confirme a branch, HEAD, origin/main e os commits recentes;
4. abra uma sessão do cérebro Loop e consulte o contexto de “H4, pipeline
   editorial, direitos e pacote curricular Matéria, energia e radiação”;
5. leia:
   - docs/EXECUTION_STATUS_2026-08-13.md;
   - este docs/CONTINUIDADE_2026-08-13.md;
   - docs/plans/2026-07-27-radiant-launch-roadmap.md, seção H4;
   - docs/content/2026-08-13-h4-materia-energia-e-radiacao-candidato.md;
   - docs/CONTENT_PIPELINE.md;
   - docs/superpowers/specs/2026-08-09-checkpoints-e-loops-do-aluno-design.md;
   - Conteúdo/governança/foundations-safety-competencies.json;
   - radiant-app/src/types/learningActivity.ts;
   - radiant-app/src/features/student-checkpoints/UnitCheckpointService.ts.
6. confira se outra IA já corrigiu ou promoveu esse candidato. Não refaça
   trabalho concluído e não contorne PROJECT_BUSY.

Estado confirmado no handoff:
- branch de trabalho codex/wave1-hardening-api-smoke em b91819f, alinhada ao
  origin; origin/main está no merge 6b3095f do PR #1;
- os workflows do merge passaram: Radiant App Quality 31724663127 e Radiant API
  Quality 31724663118;
- H3 está encerrada por aceitação explícita do dono. A coorte histórica continua
  registrada como inconclusive; não a reclassifique como pass;
- VoiceOver e TalkBack foram confirmados pelo dono e estão concluídos;
- H4 já possui o kernel de checkpoint/reforço e commit recuperável. São 17 testes
  focados, além de typecheck e lint sem erros;
- produção segue off; nenhum OTA, TestFlight, App Store, submit ou bump de versão
  foi autorizado;
- o arquivo não rastreado skill-observations/ já existia antes deste handoff.
  Preserve-o e não o inclua no escopo por acidente.

Candidato selecionado:
- arquivo canônico de trabalho:
  docs/content/2026-08-13-h4-materia-energia-e-radiacao-candidato.md;
- unidade: unit:materia-energia-e-radiacao;
- trilha: track:fundamentos-e-seguranca-radiologica;
- SHA-256 do anexo original:
  d12c8c6cc0959f6344ec282454528fcdbe02855d0e4a3154994d28b2531695fe;
- ele preserva o segundo de três retornos de IA. O primeiro foi rejeitado por
  classificar incorretamente a edição atual de OpenStax College Physics 2e como
  CC BY 4.0 e por conter erros físicos; o terceiro bloqueou por falta de fonte,
  mas não encontrou as páginas específicas do LibreTexts;
- o candidato usa somente texto e aponta páginas específicas que declaram
  CC BY 4.0. Nenhuma imagem, tabela, áudio, vídeo, logotipo ou marca de terceiros
  deve ser incorporada;
- isso encerra apenas a descoberta de fontes candidatas. Revisão jurídica e
  demais gates humanos permanecem pendentes.

Objetivo desta sessão:
corrigir o candidato, convertê-lo em artefatos estruturados compatíveis com os
contratos reais do repositório e deixar todos os gates automáticos verdes.
Não promova conteúdo nem conecte o candidato ao catálogo de produção enquanto os
gates humanos continuarem pendentes.

Correções obrigatórias:
1. substitua “direitos verificados” por “triagem documental concluída; aprovação
   jurídica pendente”;
2. para cada fonte, registre título, autoria/curadoria, URL da página exata, URL
   da licença, CC BY 4.0, data de acesso, hash do material textual usado e
   indicação de tradução/adaptação;
3. atribua fonte a cada afirmação material: enunciado, resposta, distratores e
   feedback. Referência genérica somente no fim da atividade não atende ao
   contrato editorial;
4. complete a primeira competência com a relação entre estrutura, ionização e
   estabilidade, sem usar o modelo planetário como descrição literal do átomo;
5. complete “atenuação como ponte” ligando interação e transmissão diferencial
   ao sinal no detector e ao contraste, sem oferecer técnica de exposição ou
   decisão clínica;
6. fortaleça distratores plausíveis e evite repetir literalmente atividades no
   checkpoint;
7. mantenha os IDs canônicos das cinco competências e não crie nova trilha;
8. todas as cinco competências têm criticalSafety: false. Não invente item
   crítico e não grave isCriticalError no conteúdo: o runtime calcula o resultado
   a partir da resposta;
9. mantenha exatamente 10 itens de checkpoint, dois por competência, com meta de
   80%;
10. preserve dois ciclos: recuperação guiada e nova tentativa com modalidade ou
    contexto diferente;
11. converta as atividades para LearningActivityV2:
    - 3–6 passos por atividade;
    - 1–4 interações;
    - provenance.contentVersion e sourceIds;
    - competencyIds;
    - evidenceKind permitido pela competência;
    - completionRule;
    - criticalSafety: false;
    - feedback de acerto/erro;
    - accessibility.label e hint quando necessário;
12. use guided-practice e independent-recall nas quatro primeiras competências;
    para atenuacao-como-ponte, use guided-practice e applied-transfer;
13. não use mídia externa, drag-and-drop obrigatório, cor como única pista,
    cronômetro ou interação sem alternativa acessível;
14. não declare o Markdown um ProductionBatchV1. Se o contrato ou schema do lote
    ainda não existir no código, escreva primeiro um teste significativo que
    exponha essa ausência e implemente o menor contrato coerente com a spec;
15. mantenha como PENDENTE, sem fabricar identidade ou aprovação:
    revisão técnica, editorial, acessibilidade, direitos, schema e produto.

Critério de saída desta sessão:
- candidato corrigido e preservado no repositório;
- artefatos estruturados passam pelos validadores reais;
- testes focados provam IDs, cobertura 5x2 do checkpoint, evidência, proveniência,
  criticalSafety false, acessibilidade e os dois ciclos;
- nenhuma promoção ocorre sem aprovações humanas;
- status canônico, roadmap e continuidade dizem exatamente o que passou e o que
  ainda depende de humano;
- run Loop fechado na ordem validate → step finish → memory write se houver
  aprendizado durável → run close, checando o code de cada envelope;
- sessão do cérebro fechada separadamente;
- nenhum E2E em paralelo com loop validate;
- não tocar produção, lojas, versão nem o vault diretamente.

Não pare apenas numa nova análise. Faça as correções que são objetivamente
resolvíveis por código/conteúdo, valide-as e deixe como pendência somente aquilo
que exige aprovação humana real. Ao final, relate arquivos, testes, estado do
run, estado da sessão e o próximo gate humano exato.
```

## Estado deste handoff

O candidato selecionado recebeu uma adaptação estruturada independente no contrato
local `EditorialCurriculumCandidate.ts`, sem promoção: 12 atividades v2,
checkpoint 2×5/80%, dois ciclos, fontes por afirmação e `criticalSafety: false`
passam em teste focado. O Markdown preservado e o artefato executável não são uma
conversão item a item; cada um requer revisão técnica explícita. A reconciliação do
parecer externo removeu o viés de gabarito na primeira posição, corrigiu a resposta
sobre quantidade de fótons e não usa raios gama em uma ordenação rígida por
frequência. A triagem documental registra URLs, licença, data e hashes; não é
aprovação jurídica. H4 continua parcial até o schema/painel `ProductionBatchV1`,
os seis gates humanos, promoção e validação da experiência real.

Uma segunda revisão também corrigiu a proveniência: somente enunciados, respostas
corretas e feedback são `source-backed`; distratores são autorais e não recebem IDs
de fonte. O mapa não promete mais avaliação de segurança fora de escopo, e a fonte
S8 documenta a ponte conceitual transmissão diferencial → detector → contraste.

A revisão profissional final de 2026-08-13 aprovou este candidato para integração
no repositório e o dono autorizou commit/push. Não abrir outra rodada editorial sem
mudança material. As pendências seguintes são de engenharia: `ProductionBatchV1`,
promoção atômica, conexão à tela e validação da experiência executável.
