# PC06-E — integração isolada e provas elegíveis

Medido em **04/11/2026, America/Bahia**, na worktree `trilha-2026-10-20`,
branch `claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810`. A baseline contém
PC03–PC06-D não commitados, preservados. **Integração entregue; interação nativa
por toque medida na segunda passagem do mesmo dia, com quatro defeitos corrigidos.
Leitor de tela real e offline autônomo seguem sem prova. PC06 permanece aberto.**
Sem promoção, aprovação clínica ou release. A tabela de prova nativa abaixo e a
seção "Segunda passagem" substituem o que a primeira passagem deixou pendente.

## Integração revisável

A rota `/editorial-preview` exige simultaneamente `__DEV__` e
`EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1`; `SHOW_DEV_TOOLS` não a libera.
O resolvedor Metro também bloqueia `editorial-preview/dev/` e o pacote PC05
em grafos sem esses dois requisitos, substituindo-os por uma tela indisponível.
Assim, a barreira de UI não é a única proteção. Testes executam o resolvedor
real exportado pelo Metro, inclusive release com opt-in ligado. A segunda passagem
mediu isso num bundle JS real de release; não houve binário distribuível.

O host injeta diretamente o JSON canônico PC05, por import estático. Um
`watchFolder` de `docs/evidence` é acrescentado somente com opt-in; isso permite
resolver o artefato fora da raiz do app sem manter outra cópia da aula. O primeiro
bundle de desenvolvimento revelou a falta desse acesso e foi corrigido.
Nenhum helper de `src/test`, fixture ou catálogo fornece conteúdo ao host.

O menu oferece M01.01/aula e ajuda, avaliação, recuperação guiada, tentativa em
outro contexto, ordenação, regiões frente/costas, comparação, campo abstrato,
Q6 sintético e os dois avisos de retirada. Reutiliza as prévias, registro de
renderers, controles e aviso existentes. Q6 tem três decisões textuais sobre
uma peça/ficha fictícias, sem paciente, protocolo ou identidade `rtg-2026`.
Ele testa o motor e continua fora do lote editorial e do publisher.

Voltar ao menu desmonta a prévia; reabri-la inicia o cursor sem resposta ou
retorno anterior. O host não conecta callbacks a armazenamento ou economia.
Testes usam os componentes/motor reais, impedem importação dos serviços de
progresso/XP/vidas e verificam zero chamadas de escrita no AsyncStorage.
Isso mede a prévia; não afirma que o bootstrap normal do app inteiro não escreve.

Correções necessárias aos critérios do PC06-E:

- Ordenação: o registro propaga `submitted` e o nome da confirmação. Todos os
  botões ficam desabilitados após conferir, inclusive na árvore acessível.
- Prévia: mudança de etapa solicita foco/anúncio e rola sem animação; retorno
  solicita foco/anúncio antes do toque separado de continuar/encerrar.
- Textos do host/apresentações/ajuda/retorno: remontados por `fontScale` para
  invalidar a medida nativa antiga sem remontar o player ou perder a resposta.
  O primeiro AX5 cortou título/aviso; após a correção, o topo do menu passou
  a ocupar linhas novas. Alcance do restante por gesto não foi medido.

## Reprodução local

No diretório `radiant-app`, Node **20.20.2**, iniciar Metro sem dotenv:

```sh
EXPO_NO_DOTENV=1 EXPO_NO_TYPESCRIPT_SETUP=1 \
EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW=1 \
npx expo start --dev-client --localhost --port 8081
```

**Sem `CI=1`.** A primeira versão deste comando o incluía, e o Metro responde
"running in CI mode, reloads are disabled": editar e recarregar continua servindo
o código antigo, sem erro. Custou uma conclusão falsa nesta entrega (ver abaixo).

Somente com um cliente existente compatível e alvo autorizado, abrir o cliente
com `radiantapp://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081` e
então `radiantapp://editorial-preview`. O menu não aparece na navegação do aluno.
Este comando não concede autorização para build, instalação ou uso do reservado.

## Evidência de testes

Recibos locais em `.loop/runs/run-1793791456840-0d771202/`:

| Verificação | Evidência e alcance |
|---|---|
| Regressão inicial do handoff, 11 suítes | 202/202 testes, `/tmp/radiant-pc06e-baseline.log`. |
| Regressão final | `regression-final.log`: onze suítes do handoff mais EditorialPreviewLab, rota editorial-preview, OrderingStepRenderer e ActivityRendererRegistry. **15 suítes/237 testes passaram** no recibo final. |
| Isolamento/Metro/Storybook | 11/11 testes, `isolation-green-final.log`; inclui o export real de `metro.config.js`. |
| TypeScript/lint focado | `typecheck-final.log`, `lint-final.log`, sem erros/avisos. |
| Visual estrito | `visual-final.log`: zero regressões novas; 41 baseline e 3 exceções existentes, sem nova exceção. |

Todos os testes do app usam `EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand
--runTestsByPath <arquivos>`. Isolamento: `node --test
scripts/editorial-preview-resolver.test.mjs scripts/storybook-config.test.mjs`.
As 15 suítes finais totalizam 237 casos na árvore local suja; não são CI de SHA.

Guardas vistas falhando com os defeitos específicos, restaurados antes do verde:

| Defeito | Recibo vermelho |
|---|---|
| Ordenação ainda habilitada após confirmação pelo registro real | `ordering-red.log`, 1 falha/2 acertos. |
| Avançar sem solicitar novo anúncio acessível | `focus-red.log`, nenhuma chamada recebida. |
| Omitir `context.dev` na barreira Metro | `isolation-red.log`, 3 falhas/5 acertos. |
| Omitir `__DEV__` na rota com opt-in em release | `route-red.log`, 1 falha/4 acertos. |
| Omitir somente a chave de escala no título do host | `font-mutation-red.log`, texto nativo não remontado. |

O primeiro teste de escala espiava uma cópia do namespace de React Native;
foi corrigido para a exportação original antes de produzir o vermelho por
mutação. `font-red.log` não é usado como prova dessa guarda. O primeiro teste
isolado da rota também teve erro de factory Jest; corrigido, sem contar como
falha de produto. Um teste de fluxo preexistente emite aviso de `act`; nenhuma
asserção foi removida ou orçamento ampliado.

## Prova nativa e limites

Alvo único: **E262D4C1-99BE-496B-8567-0291C14E6533**, Radiant E2E 17 Pro,
iOS **26.5**, 402×874 pt (captura 1206×2622). Cliente já instalado
`com.ascendcreative.radiant`, **1.4.0 (3)**. SHA-256 do executável:
`f8a174af49e308e68545e84aa4572e75668fc87cad1f985bafcbe6c7807bc18b`.
Inventário em `native-inventory.json`, sem leitura do armazenamento privado.
Não contém `main.jsbundle`. A compatibilidade com a abertura da rota foi
observada; a versão do cliente sozinha não foi usada como prova.

| Critério | Resultado observado / limite |
|---|---|
| Boot/framebuffer/cliente | Funcionaram nesta sessão, divergindo da falha do shell registrada em 30/10. Não houve reinstalação. |
| Entrada isolada | Menu PC06-E visível via deep link; `menu-large-final.png`. Metro serviu 2618 módulos no primeiro bundle concluído. |
| Texto máximo | `large → accessibility-extra-extra-extra-large → large`, valor lido de volta. Captura inicial defeituosa `menu-ax5.png`; após corrigir/remontar e repetir a troca, `menu-ax5-final.png` mostra o título redistribuído. Não prova rolagem, controles ou aula completa em AX5. |
| Retirada real | `/learn?blockId=lesson-1` mostrou aviso e botão da nova trilha; `retired-route.png`. Não foi respondida aula nem criada fixture. A preservação byte a byte do histórico é prova dos serviços em memória, não medição do container real. |
| Seleção/confirmação/bloqueio/Q6 | **Medidos por toque nativo** na segunda passagem, em M01.01, Q2, Q3, Q4, Q5 e nos três capítulos de Q6. |
| Regiões/lista, comparação, ordem, incrementos e diagramas | **Medidos por toque e captura.** Três defeitos reais apareceram só aqui e foram corrigidos. Recursos servidos pelo Metro: integridade do repositório não vira integridade do binário. |
| Foco, anúncio e movimento reduzido | Pedidos de foco/anúncio testados em Jest. Preferência real de movimento ligada e lida nos Ajustes, prática exercitada. **VoiceOver/TalkBack e áudio não medidos**: os Ajustes deste simulador não têm VoiceOver. |
| Offline autônomo | **Não comprovado**: cliente de desenvolvimento sem JS embarcado e ativos servidos por Metro. Não se desligou Metro para chamar cache em memória de offline. |
| Android | Nenhum aparelho/AVD ativo no inventário; não foi iniciado nem instalado para esta entrega. |

Maestro instalado, porém `~/.maestro/deps/simulator-server` tem **zero bytes**;
nenhum runner Maestro apareceu no inventário público do E262. Nenhum comando
Maestro de dispositivo, download, compilação ou instalação de driver foi feito.
A interação nativa dispensou o Maestro: o painel de simulador do app do Claude
injeta toque e gesto no cliente já instalado, sem instalar nada.
ADB foi iniciado pelo inventário e encerrado ao terminar; não havia daemon ativo
antes. Fonte restaurada para `large`, app encerrado, E262 desligado e porta 8081
sem listener. O reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` não recebeu
comandos dirigidos, limpeza, instalação, alteração de relógio ou execução.

## Arquivos e fechamento

União declarada de **21 caminhos**: rota; três módulos em
`editorial-preview/dev`; tela indisponível; teste do host e da rota;
EditorialLessonPreview e teste; OrderingStepRenderer e teste; registro de
renderers; Metro; resolvedor e teste Node; este relato; STATUS, FILA, roadmap,
plano único e CONTENT_PIPELINE. Mudanças de PC03–PC06-D não são atribuídas a
este run e não foram commitadas em bloco.

Writer `run-1793791456840-0d771202`, aberto pelo embrulho público antes da
primeira edição. Sessão `brain-session-1793791318919-0e278932` consultada e
**fechada** antes do writer para evitar contenção com `brain-links`.
Loop em Node **24.14.1**, app/API em Node **20.20.2**. Gate configurado final:
**primeiro ciclo 14/15**: `app-quality` reprovou em dois `no-undef` de
`__dirname` no resolvedor CJS. Corrigido derivando a raiz com `require.resolve`,
sem desabilitar regra. O lint global emitiu ainda 22 avisos preexistentes.
Diagnóstico: `quality-diagnostic.log`; evidências do ciclo nos eventos do run.
Ciclo corrigido: **VALIDATION_PASSED, 15/15, segundo ciclo no mesmo writer**.
Recibo: `final-validation.json`. A validação inclui
`EXPO_NO_DOTENV=1 CI=1 npm run quality`, suíte completa do app sem cache,
conteúdo, documentação, API e links; não foi rodada concorrendo com E2E.
Ordem de fechamento pela CLI: `step finish` e `run close`, sem memória nova
por não haver aprendizado durável adicional. Os recibos `step-finish.json` e
`run-close.json` registram o estado efetivo; a sessão de leitura já está fechada.
Após registrar estes resultados, o contrato documental é reconferido, sem
repetir os validadores de código aprovados.

Não houve commit/push/merge, prebuild, build nativo, instalação, EAS/OTA,
migração de dados reais, escrita em Google Docs/Trello/Todoist ou release.
Catálogo ativo vazio, lote incompleto, Q6 editorial recusado e seis aceites
por hash continuam preservados. PC07/PC08/PC09 não foram iniciados.

A pendência original desta seção foi substituída pela da segunda passagem, abaixo.

Validadores do ciclo final: `docs-contract`, `content-foundation`, `content-wave1`, `content-production`, `content-anchoring`, `content-anchoring-data`, `content-no-verbatim`, `content-source-rights`, `content-python`, `app-quality`, `app-test`, `api-lint`, `api-typecheck`, `api-test`, `brain-links`.

## Segunda passagem: interação nativa por toque (04/11, 10:26–10:52)

Writer `run-1793799555460-cecc68c9`, sessão `brain-session-1793798816076-ee8afe56`.
Mesmo alvo e cliente: E262, 1.4.0 (3), iOS 26.5, sem reinstalar. Toque e gesto pelo
painel de simulador; Metro em modo de observação, sem `CI=1`. Sem build, instalação
ou driver. O reservado `5FD8C926` ficou desligado e não recebeu comando.

### O que passou por toque

| Critério | Observado no aparelho |
|---|---|
| Seleção antes do retorno | Confirmar desabilitado sem resposta; "Selecionada" aparece sem revelar acerto; troca de alternativa antes de confirmar funciona. |
| Confirmação e bloqueio | Tocar em outra opção depois de confirmar não muda a seleção em M01.01, Q2 e Q6, nem a ordem em Q5. Em Q4, os controles esmaecem. |
| Próxima interação limpa | Contexto e seleção novos, tela no topo, em M01.01 e nos três capítulos de Q6. |
| Feedback final antes da saída | Q6 mostra o retorno e só encerra com o toque em "Encerrar prévia". |
| Retorno por alternativa | M01.01 mostrou o retorno específico da alternativa errada. |
| Hotspot por lista | Lista e região na imagem selecionam o mesmo item, nos dois sentidos; frente e costas. |
| Bancada por incremento | Três toques em "−": 27 → 24 cm, margem 33% → 25% (6/24), campo encolhe, "+" volta a habilitar. |
| Saída descarta a tentativa | Voltar e reabrir recomeça sem resposta. |
| Sem recompensa visível | Nenhuma tela da prévia mostrou XP, vidas ou conclusão. Container privado não foi lido. |

### Defeitos reais, corrigidos

Todos em renderers compartilhados, invisíveis para a suíte verde anterior. A Q3 é
o mais grave e desmente a frase do PC06-B "comparações sem corte".

| Defeito no aparelho | Causa | Conserto | Vermelho |
|---|---|---|---|
| **Q3 cortada:** diagrama a ~800 pt num cartão de ~290 pt; personagem e legenda fora do quadro | `Image.ios.js` injeta `{width, height}` do asset local antes do estilo; `height: 1000` sobrevive ao lado de `aspectRatio` | `height: undefined` no estilo da imagem resolvida | `renderers-red.log`: recebido 1000 |
| **Q2:** "✓" branco sobre verde claro, quase invisível; índice "2" colide com o "B" do desenho | Índice sem fundo, centrado na região, onde o diagrama tem rótulos | Selo opaco no canto da região | `renderers-red.log` |
| **Q5:** setas travadas parecem ativas depois de conferir | Opacidade só nas pontas | `(submitted \|\| first/last)` | `renderers-red.log` |
| **Q5 em AX5:** palavras quebradas em sílabas ("ente/ndi/men/to.") | Setas ao lado do texto estreitam a coluna | Empilhar controles a partir de `fontScale` 1,3 | `ordering-ax5-red.log` |

Capturas em [`2026-11-04-pc06e-capturas/`](2026-11-04-pc06e-capturas/q3-cortada-antes.png):
`q3-cortada-antes`, `q3-inteira-depois`, `q2-rotulo-antes`, `q2-rotulo-depois`,
`q5-bloqueio-depois`, `ax5-q3`. Demais recibos ficam no diretório do run.

**Conclusão falsa desta passagem, registrada de propósito.** Com o Metro em `CI=1`,
reavaliei a primeira correção da Q3, vi o corte continuar, concluí que o Fabric
ignorava `height: undefined`, escrevi uma justificativa convincente e reforcei a
guarda para exigir `'auto'` (`comparison-hipotese-descartada.log`). O cliente rodava
código antigo. Reiniciado sem `CI=1`, `height: undefined` resolveu, e a hipótese foi
descartada. A guarda é uma reprodução da mesclagem em Jest; **a prova do conserto é
`q3-inteira-depois`**, e toda medida depois de editar exige confirmar que o código
novo chegou ao cliente.

### Isolamento medido em bundle real

`npx expo export --platform ios --no-bytecode --no-minify` em pasta temporária, com
opt-in ligado nos dois casos. É JS local: nenhum binário, instalação ou envio.

| Marcador | Grafo de release | Grafo de desenvolvimento (`--dev`) |
|---|---|---|
| `PC06-E`, `Minicaso sint`, `pc05`, `activity:rtg-2026` | 0 em todos | 1, 1, 3, 48 |
| Quatro PNGs do piloto em `assets/`, por MD5 | **nenhum** | **os quatro** |

O `require` do laboratório no release resolve para a tela indisponível. Marcadores
com acento foram desconsiderados, porque o gerador os escapa. Recibos em `export/`.

### Testes e gate

Regressão final com Node 20.20.2: **17 suítes, 245 testes**, `regression-final.log`.
`tsc`, ESLint dos seis arquivos e `visual:qa:strict` sem regressões (41 baseline,
3 exceções, nenhuma nova). Números de árvore suja, não CI de SHA.
Gate configurado: **VALIDATION_PASSED, 15/15, um ciclo**, com carga de ~2 a 3, sem E2E
concorrente; recibo `final-validation.json`. Este relato e o STATUS receberam este
resultado depois do gate, e só o contrato documental foi reconferido.

### Limites e achados abertos

- **Offline autônomo: sem prova, adiado.** O isolamento significa que um Release
  **nunca** conterá as prévias; um binário de Release não prova este menu. **Decisão de Anderson em 04/11/2026:**
  a prova não será feita sobre as prévias e passa ao primeiro lote promovido, sobre o
  conteúdo real. Nenhum build ou instalação foi feito ou autorizado por isso.
- **VoiceOver/TalkBack: sem prova.** Os Ajustes do E262 não têm VoiceOver, e não há
  AVD ativo. Falta aparelho físico. Foco e anúncio seguem como pedido testado.
- **Movimento reduzido:** preferência lida como ligada nos Ajustes e a prática
  funciona; o recebimento pelo app não foi observado, e a prévia quase não anima.
- **AX5 no aviso de retirada:** a troca de fonte **com a tela aberta** corta título
  e corpo (medida antiga); montado do zero não corta, mas o título quebra no meio
  da palavra. `ContentUpdatedScreen` é de produção e ficou fora do escopo deste run.
- **Achado editorial, conteúdo não alterado:** o corpo da primeira etapa de práticas
  do pacote PC05 expõe texto de brief ao aluno. Exemplos: "M01.01. Leitura de uma
  ficha... não solicitar relato, nome ou dado de paciente real." e "M01.01; saber
  diferenciar...". Resolver na autoria antes de promover.
- **Cobertura parcial por toque:** recuperação guiada e tentativa em outro contexto
  só foram abertas na primeira etapa; a interação delas segue medida em Jest. A
  região de costas foi selecionada, mas não confirmada; o bloqueio da Q3 não foi
  tocado depois de confirmar. Em AX5, só Q5, Q3, menu e aviso foram percorridos.
- **Automação:** um gesto logo após mudar de etapa às vezes se perde; repetir
  funcionou, e nenhum defeito foi atribuído a isso.

Ambiente devolvido: fonte `large` e `ReduceMotionEnabled` 0 relidas, app encerrado,
E262 desligado, 8081 sem listener, `expo-env.d.ts` com a data anterior (30/10).

**Próxima pendência do PC06-E:** VoiceOver em aparelho físico, que depende do dono.
A prova offline deixou de ser pendência deste recorte e é condição do primeiro lote
promovido: JS e PNGs embarcados no binário, sem Metro, com o conteúdo real.

