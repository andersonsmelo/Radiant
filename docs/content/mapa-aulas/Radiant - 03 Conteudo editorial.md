# Conteúdo editorial e conexões

**Medido em 27/08/2026 · código `a05e94b` · inspeção estática.** Não certifica o comportamento de todas as telas no build do TestFlight nem aprovação clínica.

[[Radiant - 00 Comece aqui|Voltar ao atlas]]

## Seis formatos, os mesmos 16 temas

| Formato | Preparado no payload | Conexão atual confirmada |
| --- | --- | --- |
| Microlições | 16 explicações, exemplos e pontos-chave | Não alimentam o ensino `journey` das 16 aulas geradas |
| Quizzes | 16 pacotes / 32 questões | Única família consumida pelo sincronizador para `ai-lessons.ts` |
| Reviews | 16 pacotes / 48 cartões | Não usados em `/review` |
| Casos | 16 cenários | Não conectados ao catálogo local inspecionado |
| Checkpoints | 16 pacotes de síntese/assertivas | Não equivalem aos checkpoints construídos na trilha |
| Rewards | 16 textos de fechamento | Não equivalem aos quatro nós de recompensa atuais |

Total: **96 pacotes**, não 96 aulas independentes. `bundles.json` e `ai-bundles.json` são versões de produção; não duplicar a contagem do mesmo tema.

## Temas preparados

1. Profissão e atuação do técnico em radiologia
2. Energia e matéria
3. Estrutura da matéria e núcleo atômico
4. Radioatividade, partículas e atividade
5. Raios X: descoberta e propriedades
6. Interação das radiações e proteção radiológica
7. Aplicações radioisotópicas e medicina nuclear
8. Tomografia computadorizada
9. Ressonância magnética
10. Preservação de alimentos por irradiação
11. Equipamentos de radiologia convencional
12. Componentes básicos do equipamento
13. Acessórios radiológicos
14. Processamento radiográfico
15. Produção dos raios X
16. Qualidade de imagem

## Gargalo de integração

`catalog-payload.json` → `sync-catalog-to-app.mjs` → `ai-lessons.ts` → `LessonCatalogService` → `JourneyDefinitionService` → `/learn`.

O sincronizador consome quizzes. As explicações e exemplos não se tornam ensino próprio da aula por essa conexão. Antes de importar tudo, revisar o material editorial: o campo `reviewStatus: approved` não é uma certificação nova de correção clínica/jurídica nem uma liberação automática de direitos.

`ai-catalog.ts` contém uma trilha separada sem consumidor de produção encontrado; não somá-la às quatro trilhas do app. `learning-sequence.json` está vazio em sequências, gaps e ciclos; a trilha real é construída em código.

## Gate editorial

Para cada conceito: conferir fonte primária, atualidade, atribuição/licença, objetivo, pré-requisitos, exemplo, distratores, explicação de erro e evidência desejada. Afirmações de atribuição profissional e proteção radiológica exigem revisão de domínio com fontes oficiais. Não reaproveitar automaticamente exemplos sensíveis só porque existem no arquivo.
