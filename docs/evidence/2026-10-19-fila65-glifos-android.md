# FILA 65 — os glifos de ícone ficam fora da árvore que o leitor de tela lê no Android

Medido em 2026-10-19, das 10:24 às 10:26 (−03), no emulador
`radiant-entrada-api34` (API 34, 2 GB, 2 núcleos). O app é o dev client Debug
1.4.0 (3) da FILA 61, com o JS servido pelo Metro da worktree
`claude/fila64-cartao-sem-animacao` (#55). A #55 é a `main` `d7bd696` mais o
conserto do cartão, e foi usada porque, com as animações em 0, o cartão da
revisão só aparece com esse conserto. A #55 não mexe no `DecorativeIcon`.

**Nada foi ouvido.** A imagem `google_apis` não traz o TalkBack. A escuta num
Android físico continua com o dono (item 4 da seção 4 do prompt 23).

## O achado que motivou a medição

A FILA 54 registrou que, no Android, os glifos de fonte de ícone (o ``
do "Fechar" e outros) entram na árvore como `TextView` e que o leitor pode
lê-los. O prompt 23 trouxe como conserto provável escondê-los do leitor.
A leitura foi feita com `maestro hierarchy`
(`docs/evidence/2026-10-19-fila54-g4-android-g7/a11y-android.txt`, na #54).

**[código]** Esse conserto já existe desde 2026-07-26. Todo ícone de fonte
passa pelo `radiant-app/src/components/ui/DecorativeIcon.tsx`, que aplica:
- `accessible={false}`;
- `accessibilityElementsHidden`;
- `importantForAccessibility="no-hide-descendants"`.

O contrato `keeps icon glyphs out of the accessibility tree`
(`radiant-app/scripts/maestro-contract.test.mjs`) impede importar a fonte
direto fora dos dois envoltórios. Faltava saber se o Android respeita isso.

## Como foi medido

A mesma tela foi lida de três jeitos, um logo depois do outro, com
[`medir.sh`](2026-10-19-fila65-glifos-android/medir.sh):
- **`maestro hierarchy`**, o instrumento da FILA 54;
- **`uiautomator dump` completo**, que inclui os nós que não são importantes
  para acessibilidade;
- **`uiautomator dump --compressed`**, que os exclui.

As animações estavam em 0, porque o `uiautomator` não responde com animação.
Foram três telas: a entrada da revisão (`intro`), a sessão ativa (`sessao`) e a
Home (`home`). [`analisar.py`](2026-10-19-fila65-glifos-android/analisar.py)
conta os nós com caractere de uso privado (U+E000–U+F8FF), que é como a
MaterialIcons codifica cada glifo. Ele também confere os controles que precisam
continuar na árvore. Saída completa em
[`resultado.txt`](2026-10-19-fila65-glifos-android/resultado.txt). Captura da
sessão ativa: [`sessao.png`](2026-10-19-fila65-glifos-android/sessao.png).

## Resultado

**[medido]**

| Tela | `maestro hierarchy` | `uiautomator` completo | `uiautomator` comprimido |
| --- | --- | --- | --- |
| Entrada da revisão | 1 glifo (``) | 1 glifo | **0** |
| Sessão ativa | 1 glifo (``) | 1 glifo | **0** |
| Home | 5 glifos, inclusive os das abas | 5 glifos | **0** |

- **Controle positivo:** a leitura comprimida mantém todos os controles
  conferidos:
  - o botão "Fechar revisão", com o rótulo;
  - "Começar revisão" e "Confirmar resposta";
  - o título "REVISÃO";
  - "5 de 5 vidas".

  Então ela não é uma árvore truncada.
- **Na sessão ativa, o único nó com texto que some da leitura comprimida é o
  glifo.** Nas outras duas telas também somem o "26" e o "1d" do HUD e o
  "PRÓXIMO" da Home. Eles não foram investigados.
- **O `maestro hierarchy` lista o mesmo que o `uiautomator` completo,** e não o
  comprimido. Ele mostra nós que o sistema marca como não importantes para
  acessibilidade.

## Conclusão

- **[medido]** No Android, os glifos ficam fora da árvore de nós importantes
  para acessibilidade nas três telas. O achado da FILA 54 descreveu certo o que
  o `maestro hierarchy` lista, mas esse instrumento não filtra o que o leitor
  ignora.
- **[inferência, não medida]** O TalkBack percorre a árvore dos nós importantes
  para acessibilidade, a mesma da leitura comprimida, porque não pede ao sistema
  os não importantes. Então ele não chegaria aos glifos. Só a escuta no
  aparelho prova isso.
- **Não há conserto a fazer no código.**

## Fica de fora, e com quem

- **A escuta com TalkBack num Android físico:** do dono, já no item 4.
- **O "5" do HUD:** um texto "5" ao lado de "5 de 5 vidas" continua na árvore
  comprimida nas três telas. Ele também aparece na árvore do iOS da FILA 54. Se
  o leitor o lê depois do rótulo das vidas, só a escuta dirá.
- **Itens da FILA 54 sem relação com este:** o `checked=false` da alternativa
  escolhida, o subflow `dismiss-dev-client.yaml` e a caixa alta do rótulo do
  feedback.

## Remedir

Com o emulador ligado, o dev client instalado, o Metro na 8081 com
`adb reverse tcp:8081 tcp:8081` e as escalas de animação em 0, abra a tela e
rode `medir.sh <pasta> <rotulo>`. Depois rode
`python3 -I analisar.py <pasta> <rotulo>`. Para preparar a revisão vencida, use
`preparar-revisao-devida-android.py` da FILA 54. Depois, restaure as animações:
`settings delete global animator_duration_scale`, e as outras duas escalas em
`1.0`.
