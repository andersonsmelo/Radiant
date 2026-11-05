# ADR — PC05: contrato explícito do piloto e identidades inéditas

**Data:** 03/11/2026, America/Bahia. **Estado:** decisão técnica implementada,
com conferência do lote real pendente do PC04. **Decisor de produto:** Anderson,
no PC03-A de 02/11. **Implementação:** Codex, sob essa autorização.

## Contexto e decisão

O contrato editorial anterior aceita somente múltipla escolha sem mídia. O
piloto aprovado precisa também de ordenação, hotspot, comparação e bancada.
Ampliar silenciosamente o v1 ou o universo de licenças mudaria os gates antigos.

Adotar extensão opcional versionada `pilot`, com namespace `rtg-2026`, no
contrato existente. Ausência da extensão preserva o v1; presença obriga rubrica,
variante, resposta acessível declarada e fontes por alvo. Somente diagramas
autorais em CC BY 4.0 são elegíveis; o contrato não libera imagens clínicas nem
outras licenças. O conteúdo e todos os metadados da extensão entram no hash
revisado; artefato promovido e ferramentas em arquivo revalidam o mesmo material.
As seis aprovações não mudam e o catálogo ativo continua retirado.

Identidades novas separam competência, alvo, variante e versão de conteúdo.
Uma variante nova exige alvo novo com os mesmos segmentos, mudando apenas o
prefixo para `variant:` nos metadados. Nenhum ID aposentado é reutilizado para
transportar conclusões. Isso evita que a revisão trate uma variante inédita
como o mesmo item já respondido.

## Consequências e fronteiras

As regras executáveis e os exemplos de forma pertencem ao
[contrato técnico](../CONTENT_PIPELINE.md#pc05--extensão-explícita-do-piloto-03112026).
As decisões curriculares continuam no plano único, sem segundo currículo nesta ADR.

A transição preserva dados/conquistas e não converte histórico em conclusão de
conteúdo novo, conforme PC03-A. Aviso, rotas e verificações anteriores à escrita
foram especificados para PC06; esta implementação não altera AsyncStorage ou
as telas. Declarar equivalência acessível, autoria e SHA-256 não prova ciência,
leitor de tela, integridade dos bytes baixados ou uso offline: esses aceites
continuam próprios. IDs/fontes/rubricas dos payloads reais dependem do PC04.

[Evidência de implementação](../evidence/2026-11-03-pc05-contrato-editorial.md).
