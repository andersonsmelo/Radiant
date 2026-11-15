# ADR 2026-11-15 — Retorno rico da aula (F3 da 1.6)

**Data:** 2026-11-15 (America/Bahia). **Decisor:** Claude controlador, por delegação
do dono (Anderson Melo) em 2026-11-13. **Executor:** sessão da frente F3.

## Contexto

O dono pediu para a 1.6 "micro e macro interações, diálogos, áudios, efeitos sonoros
e incentivos ao usuário". O [levantamento](../evidence/2026-11-15-f3-sons/levantamento.md)
mostrou que todo som da aula já passava por `emit` na tela, mas o mapa só dizia som e
vibração, e quatro momentos ficavam mudos ou parados: soltar ficha, avançar, revelar
fala e pressionar a alternativa da múltipla escolha. O retorno ainda usava o Pixel
antigo, sem o seletor que a F7 deixou pronto, e não havia incentivo nos marcos.

## Decisão 1 — um mapa só, com animação

`LESSON_FEEDBACK`, em `radiant-app/src/ui/feedback/lessonFeedback.ts`, diz para cada
momento o som, a vibração e a animação. As durações seguem a seção 10 do plano de
2026-11-02 (`FEEDBACK_MOTION_MS`: pressionar 100, confirmar 150, entrada de fala 200,
aviso 180, conclusão 600 ms), e os componentes as leem por `motionMsFor`: a
alternativa (100), o cartão de retorno (150), a fala (200) e a cunhagem da medalha
na aula e na unidade (600). Os testes asseveram a duração das chamadas reais a
`Animated.timing` e `withSpring`, não a tabela. **Passar de etapa não anima**
(`none`): é troca simples, e a etapa nova já entra pelos próprios componentes.
"Reduzir movimento" continua com os hooks de `ui/motion`, que põem tudo no lugar.
O aviso de sequência (180) segue com a duração da base, que já está na faixa. A
tela emite três momentos novos: `token_drop` (pôr ou tirar ficha no cloze e no
categorize), `advance` (passar de etapa sem conferir) e `dialogue_line` (revelar
fala).

## Decisão 2 — tudo atrás de `ENABLE_RICH_FEEDBACK`, desligada

Desligada, o mapa devolve o retorno da base: `token_drop` soa como o `toque`, e
`advance` e `dialogue_line` não fazem nada. O cartão, a fala, a conclusão, a
unidade (sem envoltório novo na árvore) e a alternativa se comportam como antes.
Cada ponto tem contraprova em teste, e cada contraprova foi vista falhando com a
chave vazando, inclusive vazamentos isolados (só a cunhagem, só o anúncio)
([`vermelho.txt`](../evidence/2026-11-15-f3-sons/vermelho.txt)). Ligar é do dono:
`EXPO_PUBLIC_ENABLE_RICH_FEEDBACK=true`.

## Decisão 3 — dois sons novos, sintetizados

- `soltar` (110 ms, pico −28 dBFS), quando a ficha encaixa;
- `fala` (80 ms, pico −28 dBFS), quando aparece uma fala.

Ambos foram feitos por `scripts/synth-sounds.mjs`, sem nada baixado
([`sons.md`](../evidence/2026-11-15-f3-sons/sons.md)). São sons de gesto, e ficam
**nivelados com o `toque`** (pico −27,5 dBFS), que o `soltar` substitui nas fichas.
A primeira versão saía uns 15 dB acima; o controlador pediu o nivelamento antes do
merge, e os dois foram regerados com `peakDb: -28` em 2026-11-15. **Avançar vibra e não soa:** é
o gesto mais frequente da aula, e um som a cada passo cansaria. A fala soa e não
vibra.

## Decisão 4 — retorno com o elenco, incentivo e conclusão

- O `AnswerFeedbackCard` usa `castExpressionFor({ kind: 'retorno', correct, celebrate })`,
  com `celebrate` no acerto que fecha sequência de 3, 5 ou 10. O erro fica preocupado,
  que a bíblia da F7 define como acolhimento; no Pixel, ele é desenhado pensando, e o
  rótulo diz isso ("Pixel pensando com você"). O retrato é o **médio (64 pt)**, não o
  grande: com 96 pt, o retorno empurraria o texto para fora da tela de um iPhone
  pequeno com texto ampliado.
- O cartão entra em 150 ms (faixa de confirmar resposta), não em 220.
- Incentivo (`encouragementFor`): frases curtas, em rodízio determinístico com um
  contador por tipo, na sequência, no acerto logo depois de um erro e na aula sem erro
  (pela linha `habitLine` do resumo, que a aula passava vazia). A aula sem erro exige
  nenhum erro na sessão **e** o registro completo, e não vale para revisão. No marco,
  o anúncio ao leitor de tela traz o incentivo no lugar da contagem, para não dizer o
  marco duas vezes. Nunca punitivo, sem exclamação.
- A medalha cunha em 600 ms em toda conclusão de aula com estrela e em cada conclusão
  de unidade (cada unidade monta a sua medalha, pela `key`). O botão Continuar não
  espera a animação.
- A alternativa da múltipla escolha afunda 0,98 em 100 ms, com o mesmo
  `usePressScale` das fichas da F2 (RN Animated com driver nativo). O pedido falava
  em Reanimated, mas a casa já tinha esse vocabulário; nenhuma animação nova roda no
  fio do JS por quadro.

## Decisão 5 — fala em voz alta dos diálogos: não entra

Ler as falas em voz alta pede `expo-speech`, que não está instalado. Ele é **módulo
nativo novo** e exige build de distribuição; uma voz gravada exigiria asset de voz
licenciado. As duas coisas estão fora do limite desta frente. **Pendência do dono:**
decidir se quer `expo-speech` (voz do sistema, sem custo de licença) numa versão com
build nova. O VoiceOver já lê cada fala nova, pelo anúncio que a tela faz.

## Fora do recorte

- Escolher o item no categorize continua mudo: dar som a ele pediria uma prop nova no
  renderizador da F2, cujo contrato esta frente não muda.
- Checkpoint, quiz antigo, liga, widgets, notificações e conteúdo não mudam.
