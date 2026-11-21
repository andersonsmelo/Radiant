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

## Adendo de 2026-11-20 (decisões do dono sobre as figuras fora do acervo)

- **Decisor:** Anderson Melo (dono do produto). Aplicadas no lote 1E ([evidência](../evidence/2026-11-19-figuras/lote-1E.md)).

Cinco decisões, para as figuras que a fase 1 não conseguiu cobrir com uma única obra de acervo:

1. **Imagem gerada para anatomia: abandonada.** A decisão anterior deste adendo, imagem gerada para as seis figuras sem arte aberta, foi testada no mesmo dia na pelve de frente, duas vezes, e as duas erraram a posição e o limite do osso (acetábulo no lugar errado, púbis sem sínfise). O dono (Anderson Melo) decidiu abandonar imagem gerada para anatomia. Pelve de frente, osso longo e coluna em duas vistas entram por arte de acervo, com o item adaptado quando a arte não comporta o alvo (decisão 5). Os três cortes axiais da m28 ficam com a figura atual até a decisão de método, tomada junto com a dos gráficos e esquemas.
2. **Composição de peças do mesmo autor é aceita, com critério medido.** Duas peças do mesmo autor e da mesma licença podem ser postas juntas, sem deformar nem redesenhar, quando a posição de uma sobre a outra tem critério anatômico medido na própria arte (fêmur sobre a pelve: cabeça fora do forame obturado e linha de Shenton contínua) ou quando as peças ficam lado a lado sem sobreposição (contraste em dois painéis, digestivo e urinário).
3. **Recorte ampliado na m26.** A m26-06 usa um recorte ampliado da mesma arte do sistema urinário (figura `bexiga-e-uretra`), sem mudar a pergunta.
4. **Figuras de movimento entram paradas.** A respiração entra com os dois estados do autor lado a lado (expiração e inspiração) e a circulação entra parada, com as setas do autor. O texto das aulas deixa de dizer que a figura se move.
5. **Adaptar o item (vigente desde 2026-11-19).** Quando a arte de acervo não traz uma estrutura que a aula cobra, ou quando os alvos não cabem na área de toque de 44 pt ou ficam sob o marcador do app, o item deixa de cobrar aquele alvo na figura; o conceito continua ensinando, e o fato pode passar a uma afirmação de verdadeiro ou falso ou do exercício rápido da mesma aula, se o conceito já o ensina. A mudança é a menor que mantém o item válido (mínimo de fichas e regiões do formato, enunciado, ajuda e retornos coerentes), e cada item alterado é listado com antes e depois para revisão independente.

## Adendo de 2026-11-21 (decisões do controlador sob delegação do dono, fases 2 a 6)

- **Decisor:** controlador (Claude), por delegação de Anderson Melo em 2026-11-20.
- **Delegação, palavra por palavra** (registro do controlador): em 2026-11-20, por volta das 16h25, "continue precisamos finalizar o planejamento sem interrupções"; em 2026-11-20 às 22h10, "Eu estou indo dormir você deve trabalhar a noite toda, tem autonomia nas tomadas decisão".
- **Limite da delegação:** merge, build, loja e gasto continuam do dono. Os portões do dono viraram envio assíncrono da primeira peça de cada fase, sem esperar resposta.

Decisões que mudaram produto ou método, uma por linha (as demais, R4 a R7, R9, R12, R13, R16 a R19, R22, estão nos `decisoes-*.md` da pasta de trabalho e nas evidências dos lotes):

1. **R1, pessoa do kit.** Equipamento e pessoas usam o kit isométrico da `anatomy`, com a pessoa melhorada (tronco contínuo, ombros no tronco, joelho e quadril que dobram, cabelo cheio, mãos simples), em um módulo só do kit. Silhueta de acervo foi descartada: misturar autores quebra o estilo. Custo se errado: refazer a pessoa no módulo e regenerar as cenas. R17 fundiu no módulo as cópias locais dos construtores.
2. **R14 e R15 (E11 a E13), selo e marcador fora do objeto.** O app passou a pôr o selo do número fora da região e fora da área de toque dos outros alvos, posicionado em conjunto; o ponto de rotular tem 12 pt, com o número num selo ao lado; tocar no selo seleciona o dono. Muda a aparência de **todos** os itens de tocar, rotular e caça ao risco, inclusive os já aprovados. Conserta o defeito recorrente desde o lote 1C.
   **Revogada em parte em 2026-11-21, pelo controlador (delegação do dono de 2026-11-20): a E13 caiu.** O selo e a marca deixaram de receber toque, porque na M18.01 `i3` o selo do quadril esquerdo cobria o direito e tocá-lo dava o "certo" ([correção](../evidence/2026-11-19-figuras/correcao-final.md)).
3. **R8, ordem das fases.** Fase 2 (cenas) e fase 5 (imagem real) primeiro; fases 3 e 4 por último, porque a amostra da fase 3 mostrou ganho marginal.
4. **R2, R10, R11 e R23, fase 5 sem trocas.** Onde não há imagem real aberta, a figura atual fica, porque o dono reprovou figura de anatomia ou exame desenhada por modelo. A busca achou 3 de 13: o corte do abdome (Sobotta, rótulos em inglês impressos e orientação invertida), o corpo inteiro (linhas de região seriam forma pintada sobre arte de acervo) e o tórax PA CC0 (a aula M23.01 é construída sobre esquema e cobra etiqueta e colimação que a imagem real não tem). Fase 5 fecha com 0 trocas ([fase-5](../evidence/2026-11-19-figuras/fase-5.md)).
5. **R20 e R21, fases 3 e 4 paradas por regra do dono.** Fase 4: o Lucide é ISC, fora da regra de licença do dono (CC0, domínio público ou CC BY). Fase 3: a lição "mostre uma amostra antes do volume" e o ganho medido pequeno. Amostras prontas em [amostras-fases-3-4](../evidence/2026-11-19-figuras/amostras-fases-3-4/README.md).
6. **E9, cópia MIT da skill.** Os três arquivos de geometria da skill `anatomy` (`iso-kit.mjs`, `lathe.mjs`, `tube.mjs`) entram em `scripts/content/figuras/kit/vendor/anatomy/`, sem alteração, com o `LICENSE` MIT e o sha256 de cada um, para o kit e os testes rodarem sem a skill instalada.
7. **R3, R4, R5, R6 e R7.** Os cortes axiais da m28 e o corpo inteiro entraram na busca da fase 5; a exceção da coluna (m18-03) fica como está; o enquadramento do corpo inteiro não mudou; o teto de peso (8.116.109 bytes) não mudou, e a soma das 45 importadas é 4.132.420; sem merge da pilha de PRs e sem a fase C.

### O que o dono precisa confirmar

- A **pessoa do kit** (R1): ver a prancha e as cenas no simulador e aceitar ou pedir outra.
- A **mudança do selo e do marcador** no app, que vale para todas as figuras (R14 e R15).
- **Fase 5 sem trocas** (R23 em especial: a radiografia-roteiro fica com o esquema) e **a ordem das fases** (R8).
- **Fase 3:** ver a amostra e decidir se os 14 gráficos vão a volume.
- **Fase 4:** aceitar licença ISC para ícones, trocar de conjunto, ou manter os fluxos atuais.
- Como antes: merge da pilha de PRs #89 a #97, build e loja.
