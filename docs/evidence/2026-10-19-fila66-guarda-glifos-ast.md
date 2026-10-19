# FILA 66: a guarda dos glifos de ícone lê a AST

**Data:** 2026-10-19. **Autor:** Claude Opus 5.5. **Base:** `main` em
`d7bd696`. **Origem:** a FILA 65 mediu no emulador Android que os glifos ficam
fora da árvore do leitor porque o `DecorativeIcon` os esconde. Essa proteção
dependia de uma guarda de texto, e a lição 3 de 2026-09-22 do `AGENTS.md` exige
leitura da AST em guarda sobre código-fonte.

## O furo, medido antes da troca

A guarda `keeps icon glyphs out of the accessibility tree`, em
`radiant-app/scripts/maestro-contract.test.mjs`, procurava três textos no
arquivo do `DecorativeIcon` e o texto do módulo nos `.tsx` de quatro pastas.
Rodada sem alteração sobre 13 defeitos injetados, cada um numa cópia
descartável do app, **ela ficou verde em 9**
([log](2026-10-19-fila66-guarda-glifos-ast/guarda-texto.log)):

- cada um dos três atributos fora do JSX e citado só num comentário;
- `accessibilityElementsHidden={false}`, porque o nome continuava no texto;
- `{...props}` depois dos atributos, que deixa quem chama sobrescrever os três;
- import da fonte em `src/ui`, pasta fora da varredura;
- reexportação num `.ts`, extensão fora da varredura;
- `MaterialIcons` pelo barril `@expo/vector-icons` e outra família da mesma
  fonte, como `Ionicons`.

No sentido oposto, ela ficou **vermelha** com o módulo só citado num
comentário de uma tela. A guarda acusava um defeito que não existia.

## A guarda nova

Ela usa o `typescript` que o arquivo já carrega para as guardas da FILA 62:

- acha a função `DecorativeIcon` e o único `return` dela, sem descer em
  funções aninhadas, e exige que ele devolva um elemento `MaterialIcons`;
- nesse elemento, exige os três atributos com o valor estático certo
  (`accessible` falso, `accessibilityElementsHidden` verdadeiro e
  `importantForAccessibility` igual a `no-hide-descendants`), cada um depois
  do último `{...props}`. No JSX, vale o último valor;
- varre todo `.ts` e `.tsx` de `components` e `src`, fora os testes, e
  reprova qualquer import, export-from, `require()` ou `import()` de um módulo
  `@expo/vector-icons` fora dos dois envoltórios. Comentário não conta;
- exige que a varredura alcance os dois envoltórios e veja o import do
  `DecorativeIcon`. Uma varredura que não os achasse estaria cega, e não
  limpa.

## Os vermelhos

Cada asserção nova foi vista falhando com o defeito que ela nomeia
([log](2026-10-19-fila66-guarda-glifos-ast/guarda-ast.log)). A tabela é a
mesma da guarda de texto, mais duas injeções na própria guarda:

| Defeito injetado | Texto | AST | Mensagem da AST |
| --- | --- | --- | --- |
| nenhum (controle) | verde | verde | |
| `accessible` só num comentário | verde | vermelho | `must pass accessible` |
| `accessibilityElementsHidden` só num comentário | verde | vermelho | `must pass accessibilityElementsHidden` |
| `importantForAccessibility` só num comentário | verde | vermelho | `must pass importantForAccessibility` |
| `accessible={true}` | vermelho | vermelho | `accessible must be false` |
| `accessibilityElementsHidden={false}` | verde | vermelho | `accessibilityElementsHidden must be true` |
| `importantForAccessibility="auto"` | vermelho | vermelho | `must be no-hide-descendants` |
| `{...props}` depois dos atributos | verde | vermelho | `must come after {...props}` |
| import numa tela de feature | vermelho | vermelho | nomeia `ReviewScreen.tsx` |
| import em `src/ui` | verde | vermelho | nomeia `HUD.tsx` |
| `require()` numa tela | vermelho | vermelho | nomeia `ReviewScreen.tsx` |
| reexportação num `.ts` | verde | vermelho | nomeia `motion.ts` |
| barril `@expo/vector-icons` | verde | vermelho | nomeia `ReviewScreen.tsx` |
| `@expo/vector-icons/Ionicons` | verde | vermelho | nomeia `ReviewScreen.tsx` |
| módulo só citado num comentário (controle) | vermelho | verde | |
| varredura sem a raiz `components` | não se aplica | vermelho | `must reach both icon-font wrappers` |
| detector com prefixo errado | não se aplica | vermelho | `must see the import DecorativeIcon renders with` |

Para remedir, no Node 20, a partir da raiz do repositório:

```bash
node docs/evidence/2026-10-19-fila66-guarda-glifos-ast/injetar.mjs ast "$PWD/radiant-app/scripts/maestro-contract.test.mjs" "$PWD/radiant-app"
```

Para a coluna de texto, passe `texto` e a guarda de `d7bd696`, extraída com
`git show d7bd696:radiant-app/scripts/maestro-contract.test.mjs`. O script
termina com código 1 se alguma linha sair do esperado. Cada âncora de
injeção precisa aparecer uma vez só, ou o script aborta.

## Gate

**[medido]** `EXPO_NO_DOTENV=1 CI=1 npm run quality` em `radiant-app`, no Node 20,
passou. O `maestro-contract` passou 34 de 34, e o Jest, 174 suítes com 1787
testes. O `visual:qa:strict` não achou regressão.

## Combinação com as PRs abertas

A guarda nova varre mais pastas que a antiga. Por isso, ela rodou na árvore do
merge simulado com cada PR aberta
([log](2026-10-19-fila66-guarda-glifos-ast/merge-tree.log)):

- **[medido]** as cinco PRs, da #52 à #56, combinam com esta sem conflito, cada uma
  sozinha. Em cada árvore, a guarda passa, o `maestro-contract` passa 34 de 34
  e o `docs-contract` passa;
- a árvore com esta, a #52, a #55 e a #56 juntas dá o mesmo resultado;
- a #53 e a #54 ficaram fora dessa árvore porque conflitam com a #52 sem esta
  no meio: a #53 em `docs/FILA.md` e a #54 em
  `docs/archive/STATUS_historico.md`. Esse conflito é entre elas e já existe
  hoje.

## O que não cobre

- A guarda prova o JSX do envoltório, e não o que o leitor de tela anuncia.
  Isso continua com a escuta do TalkBack que a FILA 65 deixou com o dono.
- Um valor dinâmico num dos três atributos, como `accessible={hidden}`,
  reprova, porque não prova valor nenhum. Se um dia for preciso, a guarda
  muda junto.
- O `icon-symbol` não renderiza `MaterialIcons`, só usa o tipo dele, e
  desenha pelo `DecorativeIcon`. A guarda exige que a varredura o alcance, e
  não que ele importe a fonte.
