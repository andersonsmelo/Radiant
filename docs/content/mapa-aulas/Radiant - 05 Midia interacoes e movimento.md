# Mídia, interações e movimento

**Medido em 27/08/2026 · código `a05e94b` · inspeção estática.** Não certifica o comportamento de todas as telas no build do TestFlight nem aprovação clínica.

[[Radiant - 00 Comece aqui|Voltar ao atlas]]

## Interações implementadas

| Renderer | Capacidade | Uso no conteúdo catalogado inspecionado |
| --- | --- | --- |
| MultipleChoice | Selecionar alternativa | Todas as 18 aulas legadas e 12 atividades promovidas |
| Hotspot | Localizar região numa imagem | Nenhum item promovido identificado |
| Comparison | Comparar representações | Nenhum item promovido identificado |
| Matching | Associar pares | Nenhum item promovido identificado |
| Ordering | Ordenar sequência | Nenhum item promovido identificado |

Os componentes têm implementação e, nos formatos adicionais, testes/stories. Isso não é evidência de conteúdo autorado, acessibilidade completa em aparelho ou publicação de cada formato.

## Mídia governada

O manifesto atual registra **uma ilustração sintética aprovada**, sobre geometria do feixe, com três hotspots: fonte, feixe e detector. Registra cinco candidatos rejeitados; eles não são incluídos neste pacote.

O lote promovido tem `media: []`: aprovação de um asset não significa conexão às aulas. A informação antiga de “zero assets aprovados” em `CONTENT_PIPELINE.md` não representa o manifesto medido em 27/08.

O tórax do `LessonVisualPanel` é um raster de mockup compartilhado. Não tem relação definida com cada tema, inclui texto em inglês e sugere toque sem ação. **Não reutilizar como imagem padrão.** Sua procedência não foi certificada nesta auditoria.

## Movimento que já existe

`src/ui/motion.ts` usa Animated/Reanimated, SVG e preferência de redução de movimento. Tokens atuais: micro 180 ms, UI 220 ms e celebração 600 ms. Há entrada suave, pressão, erro, perda de coração, progresso/XP, respiração e celebração.

São recursos de interface e recompensa. Não encontramos animações didáticas conectadas ao currículo inspecionado. Não é necessário escolher outro framework antes de testar se os recursos existentes atendem ao piloto.

## Critério para cada imagem ou animação

1. Que relação o aluno precisa perceber?
2. A imagem representa exatamente o assunto e tem fonte/autorização?
3. O controle anunciado realmente funciona?
4. Há rótulo, alternativa textual e navegação acessível?
5. A explicação continua completa sem movimento?
6. O aluno pode pausar, avançar por etapas e repetir quando necessário?

Movimento deve comunicar causa, mudança ou feedback. Sua duração vem da tarefa; não aplicar 600 ms de celebração como regra para ensinar um processo. Ver [[Radiant - 08 Fontes e metodo|fontes Apple e IES]].
