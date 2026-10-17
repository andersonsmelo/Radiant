# Produção escalável e qualidade da trilha — pesquisa dirigida

**Data de pesquisa e acesso às fontes:** 2026-10-16.  
**Autoria:** OpenAI Codex, família GPT-6; variante exata não exposta.  
**Pergunta:** que práticas permitem produzir uma trilha grande, organizada e mantida continuamente sem transformar cada lição em um projeto artesanal?  
**Método:** síntese das pesquisas existentes, consulta dirigida a fontes primárias de desenho educacional, itens, contratos de conteúdo, assets e revisão; confrontação com o código do Radiant. Não é revisão sistemática nem demonstração de eficácia.

## 1. Síntese aplicável

| Fonte primária [oficial] | Prática documentada | Aplicação proposta ao Radiant [inferido] |
| --- | --- | --- |
| [CDC — Quality Training Standards](https://www.cdc.gov/training-development/php/qts/) | Necessidades, objetivos, conteúdo preciso/relevante, participação, acessibilidade, avaliação e suporte posterior | Matriz competência → objetivo observável → prática → avaliação → revisão. Conteúdo tem responsável e data de reavaliação. |
| [NBME — Item Writing Guide, pp. 22–24](https://www.nbme.org/sites/default/files/2021-02/NBME_Item%20Writing%20Guide_R_6.pdf) | Pistas de linguagem e alternativa correta destacada por extensão/detalhe podem favorecer estratégia de prova em vez de conhecimento | Rubrica para enunciado, gabarito, distratores e feedback; detector de comprimento serve como triagem, seguido de revisão. |
| [1EdTech — QTI](https://www.1edtech.org/standards/qti/index) | Separa intercâmbio de itens/testes/resultados entre autoria, bancos e execução | Separar conteúdo, renderização e tentativas. Não adotar todo o QTI/XML agora: estender contratos locais existentes e preservar possibilidade de exportação. |
| [JSON Schema — condicionais](https://json-schema.org/understanding-json-schema/reference/conditionals) | Permite validação condicional por atributos/tipos | Regras diferentes por tipo de atividade, mídia e evidência; schema valida forma, não verdade clínica nem qualidade do distrator. |
| [Anki — FSRS](https://docs.ankiweb.net/manual/deck-options#fsrs) | Intervalos dependem do histórico e do objetivo de retenção; aumentar retenção aumenta carga de revisão | Persistir tentativas por item e controlar carga antes de trocar algoritmo. Não copiar um percentual de retenção do Anki como promessa educacional do Radiant. |
| [Expo — Asset](https://docs.expo.dev/versions/latest/sdk/asset/) | Asset baixado usa URI local; download de cache e referência remota têm comportamentos diferentes | Planejar pacotes locais versionados, disponibilidade e recuperação de mídia. A página SDK54 redirecionou à atual; API específica deve ser conferida contra a versão instalada antes de implementar. |

[oficial] O CDC admite avaliação formativa por revisão de pares e checklist, entre outras abordagens; não estabelece que toda melhoria dependa de uma aula piloto. [usuário] Anderson explicitamente retirou esse foco desta frente. [inferido] Usar QA técnico/editorial e observação contínua compatíveis com a entrega global atende a direção sem fabricar prova de aprendizagem.

## 2. O que as pesquisas anteriores oferecem

- [código/documento] O [benchmark de 26 apps](2026-10-16-benchmark-trilhas-gamificadas.md) já organiza padrões de trilha e revisão. Usá-lo para hipóteses de interface e organização, não como prova exaustiva de inexistência de concorrentes.
- [código/documento] As [práticas com agentes](2026-10-16-praticas-desenvolvimento-com-agentes.md) fornecem ferramentas, contratos e limitações. Não é necessário instalar cada ferramenta para executar o fluxo.
- [estudo] A [pesquisa de exercícios visuais](2026-10-16-exercicios-imagem-celular-evidencias.md) liga cinco estudos primários e seus limites. Ela sustenta feedback específico e a separação entre prática guiada e avaliação independente; não determina a arquitetura de toda a trilha.
- [código] O [diagnóstico global novo](../avaliacoes/2026-10-16-diagnostico-estrutural-global-da-trilha.md) mede a base realmente disponível. É a entrada operacional que faltou à proposta anterior.

## 3. Modelo de produção recomendado

[inferido] A unidade de produção deve ser **um lote de competências e itens**, não uma tela de aula isolada. Um lote pode acrescentar dezenas de itens utilizando renderizadores já validados, com rastreabilidade individual. Revisar o lote não significa atribuir ao conjunto uma aprovação genérica para qualquer conteúdo futuro.

[inferido] Separar três classes de produção:

1. **Variação determinística de modelo aprovado:** código calcula gabarito, opções e limites; testa-se o espaço de parâmetros e a diversidade semântica. Texto de IA permanece revisável e não pode mudar a regra.
2. **Item factual/editorial original:** gabarito e feedback ancorados em fontes, com revisão de conteúdo e verificações de ambiguidade; a regra de geração não produz automaticamente a verdade.
3. **Item de imagem ou risco alto:** licença/anonimização, adequação didática, anotação e explicação específicas revisadas. IA pode auxiliar a redação; não substitui a verdade de referência nem a responsabilidade técnica.

[inferido] Reuso é **competência + regra + representação + contexto**, não trocar palavras para inflar a contagem. Reportar separadamente famílias, itens base, variantes e casos de imagem. Itens de avaliação precisam de casos/contextos reservados, para que decorar uma variante não produza domínio artificial.

[inferido] Automatizar 100% dos gates determinísticos e dirigir revisão humana para semântica, risco e exceções. A cadência pode ser em lotes; os seis gates atuais do `ProductionBatch` permanecem válidos até uma mudança explícita de governança. Retirar aula piloto não aprova conteúdo clínico em massa.

## 4. Medir produção antes de prometer volume

[inferido] Relatar por lote: itens candidatos, aprovados, reprovados, retrabalho, minutos de revisão, competências novas cobertas, exemplos distintos, cobertura de feedback e disponibilidade offline. Fórmula de capacidade:

```text
itens aprovados/semana =
min(capacidade de autoria, capacidade de revisão, capacidade de QA/publicação)
× taxa de aprovação sem retrabalho
```

[inferido] O orçamento, equipe, acervo e tempo de revisão ainda não foram medidos. Metas como 10× o catálogo e milhares de itens no plano são **cenários de engenharia**, não promessa de produção clínica ou prazo fechado.

## 5. Ferramentas e descoberta de skills

[oficial] O [catálogo skills.sh](https://www.skills.sh/) foi consultado em 2026-10-16. A skill [improve-codebase-architecture](https://www.skills.sh/mattpocock/skills/improve-codebase-architecture) indicava 1,1 milhão de instalações; o [repositório do autor](https://github.com/mattpocock/skills) mostrava 294 mil estrelas. Esses números são fotografias temporais e não validam conteúdo pedagógico. É uma opção de revisão arquitetural; instalação opcional: `npx skills add mattpocock/skills --skill improve-codebase-architecture`.

[código/ferramenta] A busca `npx --no-install skills find 'content architecture'` informou que o pacote CLI não estava instalado; não se concluiu por isso que faltam skills. Foram usadas as capacidades locais de arquitetura, Loop e inspeção TypeScript, com fontes oficiais para o domínio. Nenhuma instalação foi necessária.

[inferido] Ferramental por etapa: pesquisa web/fontes primárias; inventário Node/TypeScript e Git; autoria no pipeline/painel existentes; gates do Loop/CI; Maestro e Build iOS Apps para prova nativa quando a implementação mudar; integração Android correspondente para paridade. Trocar a lista de MCPs não é o mecanismo que amplia o catálogo.

## 6. O que não foi demonstrado

[inferido] Esta síntese não escolhe provedor de analytics, CMS novo, algoritmo definitivo de revisão, equipe clínica ou calendário de release. Não mede aprendizagem em produção. Essas incertezas são separadas da capacidade de iniciar melhorias globais de catálogo, motor e produção.
