# Storybook — a imagem que faltava

Medições de 2026-10-23 (America/Bahia), branch `claude/trilha-medalhao-design`,
commit `28c1083`. Achado à parte da
[retomada do plano 2](2026-10-23-trilha-medalhao-retomada.md#4-quarenta-concluídas-só-as-medalhas-visíveis-tocam).

## O defeito

As stories `Aprendizagem/Hotspot` e `Aprendizagem/Comparação` importavam
`src/features/lesson-flow/assets/lesson-xray-panel.png`. O arquivo **existiu e
foi removido de propósito** em `b06c7eb` (2026-09-08): era um raster de mockup
com "Lesson Flow: Variant 2 of 3" e "Tap to Learn" em inglês, motivo de
rejeição na App Review (2.1.0). As stories são de `d375183` (2026-08-09) e não
foram atualizadas junto. Com `STORYBOOK_ENABLED=true`, o Metro não monta o
bundle, nem na branch nem na `main`.

## A decisão

Não restaurar a imagem nem desenhar uma nova:
- **Comparação:** as duas opções ficam só com texto. O `imageRef` dessa
  interação é opcional (`ChoiceOption.imageRef?`), e o renderizador já trata a
  falta dele.
- **Hotspot:** o `imageRef` é obrigatório. A story usa um endereço que não
  resolve (`storybook://sem-imagem`), e a moldura aparece vazia, com as regiões
  por cima, até existir uma imagem didática revisada.

O comentário de cada story diz isso e cita `b06c7eb`.

## A guarda

`radiant-app/src/test/assetRequires.contract.test.ts` lê por AST todo
`require` e todo `import` de imagem dos `.ts`/`.tsx` de `src` e exige que o
arquivo exista (aceita as densidades `@2x`/`@3x`, como o Metro). Comentário não
conta.

- **Vermelho específico:** com as stories de `0f202c9` e a guarda nova, o teste
  "toda imagem pedida por um arquivo de src existe" reprova com exatamente:

  ```
  features/lesson-flow/renderers/ComparisonStepRenderer.stories.tsx → ../assets/lesson-xray-panel.png
  features/lesson-flow/renderers/HotspotStepRenderer.stories.tsx → ../assets/lesson-xray-panel.png
  ```
- **Verde:** com o conserto, 2 de 2 testes passam.
- **Validade:** depois do conserto, nenhum arquivo de `src` pede imagem. A
  primeira versão da guarda exigia "pelo menos um require", e essa asserção
  reprovou no verde. Uma guarda sobre um conjunto vazio passa para sempre, então
  ela foi trocada por um autoteste do scanner: um trecho de exemplo com uma
  imagem que não existe, uma que existe (`assets/images/icon.png`) e uma citada
  só em comentário. O scanner tem de acusar exatamente a primeira. Esse teste
  passa nos dois estados.
- `tsc --noEmit` e `eslint` dos três arquivos com código 0, Node 20.20.2.

## O bundle

Metro recém-iniciado a cada medida (em modo CI ele não vigia arquivos e
serve o cache: um primeiro "vermelho" sem reiniciar deu 200 e foi descartado),
`STORYBOOK_ENABLED=true EXPO_NO_TYPESCRIPT_SETUP=1 EXPO_NO_DOTENV=1 CI=1`,
porta 8082, pedido de `expo-router/entry.bundle`:

| Stories | Android | iOS |
| --- | --- | --- |
| de `0f202c9` | **500**: `Unable to resolve "../assets/lesson-xray-panel.png" from "src/features/lesson-flow/renderers/ComparisonStepRenderer.stories.tsx"` | — |
| de `28c1083` | **200**, 15.083.719 bytes, sem referência à imagem | **200**, 15.066.197 bytes |

**O que não foi visto:** as duas stories na tela do aparelho. O bundle monta, e
o que cada uma mostra está descrito acima, a partir do código.
