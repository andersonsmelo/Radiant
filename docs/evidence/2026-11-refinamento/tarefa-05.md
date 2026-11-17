# Tarefa 5: passo de ensino em blocos

Medido em 2026-11-16, Node 20.20.2, em `radiant-app`. Os blocos saem de `keyPoints`
(decisão do controlador); nenhum campo novo no conteúdo e nenhuma aula mudou.

## Vermelho

`npx jest --runInBand src/features/lesson-flow/renderers/teachBody.test.ts .../TeachStepRenderer.test.tsx .../components/KeyPointsList.test.tsx`

```
Cannot find module './teachBody' from 'src/features/lesson-flow/renderers/teachBody.test.ts'
● KeyPointsList › cada ponto com termo mostra termo e texto separados   (Unable to find an element with text: Tarefa técnica)
● KeyPointsList › as peças são numeradas a partir de 1
● KeyPointsList › cada bloco é um nó acessível lido como "1. Termo: texto"
● TeachStepRenderer › não mostra "Ideia-chave"
● TeachStepRenderer › a frase de abertura usa textPrimary e o resto usa textSecondary
● TeachStepRenderer › texto de uma frase só não desenha o segundo parágrafo
Tests: 6 failed, 2 passed, 8 total
```

Nasceram verdes, ditos como tais: "ponto sem termo mostra o texto inteiro" e "não há
marcador de lista em caractere" (a lista antiga desenhava o marcador como `View`, não
como caractere; guardam contra regressão). A asserção nova em `LessonFlowScreen.flow.test.tsx`
(`Leitura`, `Ideia-chave` ausente) foi escrita depois da implementação, sem passo
vermelho próprio; o vermelho equivalente está nos testes do renderizador e da lista.

## Verde

- `npx jest --runInBand` nos quatro arquivos novos mais o `LessonFlowScreen.flow.test.tsx`: verde.
- Suíte inteira em banda: 281 suítes, 3771 testes.
- `tsc --noEmit` e `eslint` nos arquivos tocados limpos; `test:contrast-contract`, `test:identity-palette-contract`, `test:icon-assets-contract`, `test:copy-style-contract`, `test:storybook-config` e `visual:qa:strict` verdes.
- `copy-style-baseline.json` não mudou. A guarda reprovou `toUpperCase()` em `teachBody.ts` (classe eyebrow); troquei por `toLocaleUpperCase('pt-BR')`.

## Enumeração do conteúdo (passo 4)

Script temporário fora do repositório, sobre `student-checkpoints/batches/rtg-2026-*.ts`
(única fonte de `keyPoints` em `src`; o resto são tipos e testes).

- Primeira regra (a do brief): 469 pontos, 193 com termo, 276 sem.
- Casos estranhos: enumerações viravam termo ("Pedido, faixa, série e registro: quatro
  passos." deixava o texto "Quatro passos."; "Parar, chamar, ficar e relatar: nessa ordem."
  deixava "Nessa ordem."), e a fórmula "Corrente × tempo = carga: mA × s = mAs." virava
  "MA × s = mAs." (a capitalização estragava a unidade).
- Ajuste: termo com vírgula, ponto e vírgula ou "=" não corta, e texto que começa por
  unidade (minúscula seguida de maiúscula: "mAs", "kV") não é capitalizado. Testes novos
  em `teachBody.test.ts`.
- Regra final: 469 pontos, 179 com termo, 290 sem (29 deles têm ": " mas foram recusados
  pela regra). Capitalização que estraga unidade: 0.
- Dez casos que ainda cortam e merecem olho do dono (termo longo, em forma de condição
  e resultado; leem bem, mas o negrito fica comprido):
  1. "Objeto mais longe do detector: imagem maior."
  2. "Objeto inclinado com feixe reto: encurtamento."
  3. "Bobina próxima e ajustada à região: mais sinal."
  4. "Equipamento com defeito não se contorna: pare e avise."
  5. "Você não decide se um sinal é simples: chame a equipe."
  6. "Porta aberta ou botão acionado: a irradiação para."
  7. "Interesse declarado não invalida: pede conferência."
  8. (recusado, correto) "Mesmo campo, matriz maior: pixels menores."
  9. (recusado, correto) "Corrente × tempo = carga: mA × s = mAs."
  10. (recusado, correto) "A RDC 611 remete aos limites da CNEN (norma 3.01): em dose efetiva, 20 mSv ..."

## Pontos a saber

- `LessonFlowScreen.tsx` não mudou: já montava `TeachStepRenderer` e `KeyPointsList` só com `keyPoints`.
- O título legado "Ideia-chave" (`JourneyDefinitionService.ts` e `LegacyLessonAdapter.test.ts`) é conteúdo, não a etiqueta removida; continua como título.
- Sem referência a "Ideia-chave" em `.maestro`. Prova em aparelho ficou para o controlador.
