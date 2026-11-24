# ADR 2026-11-19 — Figuras da trilha feitas com um método por tipo

- **Data:** 2026-11-19
- **Decisor:** Anderson Melo (dono do produto)
- **Estado:** aceita; em execução pelo [plano de troca das figuras](../superpowers/plans/2026-11-19-troca-das-figuras.md)

## Contexto

A trilha dobrada (1.7) ganhou um catálogo de figuras didáticas em código: 86 nas PRs #89 a #95 e mais 20 desenhadas para o lote 5 da fase C. Todas eram SVG escrito por modelo, com paleta de seis cores, de 3 a 8 camadas e um movimento por camada, e foram conferidas só em imagem parada, nunca em movimento nem no aparelho. Em 2026-11-19 o dono viu o resultado e o reprovou: "essas animações estão pessimas muitos ruins mesmos, não e possivel que a comunidade esteja fazendo dessa forma com tantas opções de skills, plugins e mcps".

Uma amostra de quatro figuras, refeitas por outros métodos e mostradas lado a lado e em movimento, e um piloto com duas delas dentro do app serviram de base para a decisão. A evidência está em `docs/evidence/2026-11-19-figuras/`.

## Decisões

1. **O método de SVG escrito por modelo está reprovado** para anatomia e para equipamento e cena. Nenhuma figura nova nasce nele nesses dois tipos.
2. **Anatomia usa ilustração de acervo aberto**, com licença CC0, domínio público declarado ou CC BY, conferida na página do arquivo, recolorida sem redesenhar forma, com crédito no app. Resposta do dono à amostra, em 2026-11-19: "Sim, essa combinação".
3. **Equipamento e cena de sala usam a skill `anatomy`** (isométrica), instalada com o aceite dele ("Sim, instale"), e são construídos a partir dos alvos que a aula cobra.
4. **Imagem gerada por modelo** (pela conta dele no Canva: "Use o Canva") entra só onde nenhum dos dois métodos cobre, sempre com conferência de exatidão registrada, e nunca para radiografia ou imagem de exame.
5. **Nenhum lote de figuras entra em volume antes de o dono ver a primeira figura do lote rodando no simulador.**

## O que fica em aberto

- O método para gráficos e física, fluxos e esquemas que imitam radiografia (48 das 106 figuras). O plano propõe redesenho em código com uma gramática única, um conjunto de ícones aberto e imagem real onde houver licença; o dono ainda não decidiu.
- O destino da pilha de PRs #89 a #95, que carrega a arte antiga. O plano propõe não mesclar até a troca.
- A retomada dos lotes 5 e 6 da fase C.
- A leitura do orçamento de peso: as figuras novas são de dez a cinquenta vezes mais pesadas que as antigas. Medido em 2026-11-19, o bundle JS passou de 13,38 para 13,67 MiB com duas figuras (o crânio, que segue no app, e a cena do leito, que saiu em 2026-11-19; a medição continua válida), e a projeção para as 72 usadas é de 6,71 MiB de figuras (6,47 MiB a mais no bundle), numa faixa de 3,5 a 10,3 MiB de figuras ([orçamento](../evidence/2026-11-19-figuras/orcamento.md)).

## Consequências

- O lote 5 da fase C parou em 2026-11-19, antes de qualquer aula ser escrita. Os 20 desenhos feitos para ele no método antigo são descartados; a lista de aulas continua valendo.
- As aulas escritas não mudam de texto: apontam a figura por `diagramId`. As áreas de toque são remarcadas sobre a arte nova de cada figura, e uma regra do verificador reprova alvo fora da estrutura que ele nomeia ou com rótulo que não corresponde a ela; a regra vale só para figura que tem arquivo de alvos (em 2026-11-19, o crânio). Em 2026-11-19, só o crânio está no app com a arte nova. A cena do leito foi provada no piloto, mas saiu do app porque não tem dois dos cinco alvos que a M25.05 cobra; volta refeita na fase 2, e até lá a M25.05 usa a figura antiga.
- Toda figura importada tem origem, licença e crédito registrados em `content-manifest/rtg-2026/figuras.json`.
- A skill `anatomy` desenha gente como manequim de cilindros e esferas; o plano inclui um kit próprio de pessoas, que passa pelo dono antes das cenas.
- Custo estimado da troca das 72 figuras usadas: de seis a dez janelas de uso de cinco horas, em vários dias.
