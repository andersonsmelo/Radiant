# Aula-bancada: as duas aulas de exemplo no simulador

Medições de 2026-10-24, das 15:16 às 15:38 (America/Bahia), plano 3
([plano](../superpowers/plans/2026-10-21-aula-bancada.md)), branch
`claude/trilha-medalhao-design`. Simulador iOS principal `E262D4C1` ("Radiant E2E 17 Pro" no `simctl`),
dev client Debug 1.4.0 com Skia, já instalado. Código em `36fa2e5` na passada
final; a primeira passada foi em `e209118`, antes do conserto das estrelas.
Metro no Node 20.20.2 com `EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 CI=1`.
O simulador reservado do segundo dia do plano 2, `5FD8C926`, não foi tocado.

As aulas abrem por `radiantapp://learn?blockId=bancada:exposicao` e
`radiantapp://learn?blockId=bancada:colimacao`, só em build de
desenvolvimento.

## O que foi visto

**As capturas são de antes de `3ec1293`.** Desde esse commit, o botão de
um passo de bancada diz "Conferir resposta" e, no explorar e no corrigir,
fica desabilitado até o alvo, como a prancheta. Isso está provado nos testes
de tela, mas não foi recapturado no simulador.

**Exposição** ([folha de quadros](2026-10-24-aula-bancada/exposicao-folha.png), em ordem alfabética dos passos):
- **O shader compila no aparelho.** O fantoma aparece com diáfises, côndilos,
  patela, partes moles e grão, e o aviso de fallback
  ("fantoma desenhado com Views") não aparece no log do Metro.
- **Explorar:** de 60 a 100 kV, o contraste entre osso e partes moles cai, a
  olho. De 60 a 80 kV a diferença é sutil; a 100 kV fica clara. O retorno
  correto aparece no bloco novo da bancada, e os controles travam depois de
  conferir.
- **Desafio:** a referência e a imagem do aluno lado a lado. Errar de propósito
  em 110 kV mostrou a dica da direção
  ([captura](2026-10-24-aula-bancada/exposicao-03-erro-direcao.png)):
  "Sua imagem tem menos contraste que a referência: o kV está alto. Desça o kV
  e compare de novo." O primeiro erro não custou vida, e o item voltou no fim
  ("Passo 3 de 7").
- **Leitura crítica:** errar mostrou a explicação da alternativa marcada
  ([captura](2026-10-24-aula-bancada/exposicao-04-explicacao-alternativa.png)).
  O passo não mostra a imagem granulada, só o texto.
- **Corrigir:** a 2 mAs o granulado é forte; arrastando até 15 mAs ele some, e
  o brilho fica o mesmo.
- **Repetição:** os dois itens errados voltaram depois do fechamento, com
  "Vamos tentar novamente", e foram acertados.

**Colimação** ([folha de quadros](2026-10-24-aula-bancada/colimacao-folha.png)):
- A máscara do campo funciona nos dois eixos, e a faixa fora do campo sai clara
  (borda não exposta).
- O texto acompanha a imagem: "Campo de 27 × 16 cm, 432 cm²" e
  "Produto dose-área: 48% do campo todo".
- A 23 cm de largura, o campo cobre o joelho inteiro com as partes moles dos
  dois lados, com uma margem pequena, o que confirma a medida de 22,6 cm da
  revisão.

## Defeito achado e corrigido

Na primeira passada da exposição, com dois itens errados na primeira tentativa,
a conclusão mostrou **"Três estrelas. Nada passou despercebido."** e
**"4 de 4 corretas"** ([captura](2026-10-24-aula-bancada/exposicao-09-conclusao.png)).
A régua é estrelas pela primeira resposta. A causa:
`LessonOutcomeService.activityToQuizResult` contava as respostas finais. O
modo híbrido das aulas-bancada fez esse caminho, até então dormente, receber
itens errados e refeitos. Corrigido em `36fa2e5`, com teste de serviço e de
tela vistos falhando. Refeita a mesma aula no aparelho, com os mesmos dois
erros: **"2 de 4 corretas"**, uma estrela, "Você avançou. Vale reforçar os
pontos que faltaram." e "Refazer"
([captura](2026-10-24-aula-bancada/exposicao-10-conclusao-corrigida.png)).

## Lacunas vistas na tela (não corrigidas)

- A abertura não mostra a medalha do tema, e o Pixel não aparece nomeando o
  efeito no passo de explorar (spec §5).
- A leitura crítica não mostra a imagem granulada.
- O fechamento ("O que cada controle faz") vem antes dos itens que voltam.
- Sem nó, a conclusão diz "Sem XP nesta tentativa".
- "Produto dose-área: 100% do campo todo" quebra em duas linhas neste
  aparelho.
- Dos quatro primeiros toques rápidos no + (toque sintético curto), um não
  entrou. Com 1 s entre toques, todos entraram. Não foi medido com dedo real.

## O que não foi feito

- **VoiceOver** (passo 2 da tarefa 7): não roda por automação; a leitura de
  "kV, 70" e o anúncio de cada mudança não foram ouvidos. Os rótulos e as ações
  `increment`/`decrement` estão provados no Jest.
- **AVD e medidor de quadros** (passo 3): não medido. O medidor do G6 mede
  dados e abertura, e não quadros com arrasto; a medida seria por
  `gfxinfo framestats`, como na tarefa 7 do plano 2.
- Aparelho físico, Release e Android.

## A revisão do conteúdo é do dono

O texto das duas aulas, frase por frase, com a seção "Perguntas ao dono", está em
[docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md](../conteudo-bancada/2026-10-24-aulas-de-exemplo.md).
As aulas não saem do catálogo de exemplo sem o ok do dono.
**Pergunta ao dono:** você aprova, frase por frase, o texto das duas aulas, e
o que decide nas perguntas do fim do documento (em especial, se a aula deve
dizer que a dose cresce com o mAs)?
