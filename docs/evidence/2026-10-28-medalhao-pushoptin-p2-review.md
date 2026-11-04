# Revisão independente R1 — P2 PushOptIn

28/10/2026. Objetivo único: revisar o candidato congelado de R3-SHARED-01,
entrega delimitada antecipada da T17 antes da T09. Tier 1, produto somente
leitura; processo `code-reviewer`, com inspeção direta e sem automatismo de
review placeholder. Nenhum subagente, Loop, teste repetido, build, instalação,
commit, push ou operação nativa foi iniciado por este revisor.

**Spec: PASS. Qualidade: APPROVED.** Nenhum achado material P0/P1/P2/P3 no
diff congelado. Estes veredictos aprovam o contrato de código e seus testes;
não atestam a resolução visual nativa, ainda pendente do próximo gate.

## Identidade conferida

Root `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`,
branch `claude/trilha-medalhao-design`, HEAD/base
`1b987c1981667328b66beb958ac6a42eb3535d75`, medidos nesta revisão.

| Objeto | SHA256 recalculado |
| --- | --- |
| brief-r1.md | `0c76829884ecd96c57cada7413b528451f8408100272d557070ae4f1b20bd3e4` |
| snapshot-r1/manifest.json | `1a95c48caf535dfb1fa93d83ec40d63e59b0bec7cc961cb9c40d6d95acdf6e2a` |
| snapshot-r1/full.diff | `5777b601c0e590e44e78256bd52da5b9cbc145f9dd2005892aee094c607499c7` |
| PushOptInCard.tsx — 3507 bytes | `98733fbee3c028c40b61c6b8605469e880e97f37a264fa7cf6084ff443a9fd7f` |
| PushOptInCard.test.tsx — 5479 bytes | `a399cd83a5a93abc13dc6c21fb06f7c6dea7e09fecc31ab7fa83663b45508804` |

Manifest, metadata e arquivos vivos coincidem. O diff completo congelado foi
lido uma vez. A árvore contém documentos/artefatos do controlador e os dois
arquivos do implementador; nada disso foi absorvido ou modificado por mim.
`docs/STATUS.md` e o roadmap ativo confirmam a prioridade delimitada e o
bloqueio global T17. O checkpoint documental ainda diz produto sem alteração;
a reconciliação posterior é responsabilidade do controlador, já em curso.

## Contrato e riscos examinados

- `radiant-app/src/features/push/components/PushOptInCard.tsx:85` e `:96`:
  `lineHeight: undefined` sobrescreve as alturas herdadas de `typography.h3`
  e `typography.body`, mantendo Sora e os tamanhos anteriores. Os Text
  produtores não recebem altura fixa, teto de escala ou truncamento.
- `PushOptInCard.tsx:25`, `:54`, `:55` e `:68`: `fontScale` participa somente
  das keys dos três Text locais. Card, TouchableOpacity, PrimaryButton e o
  estado de aceite não ganham key nem são remontados pela alteração.
- `PushOptInCard.tsx:67`: papel `button` explicita a semântica da recusa,
  preservando nome, posição e ação. Comparação programática com a fonte exata
  da base confirmou `handleEnable` e `handleDismiss` idênticos por bytes.
  O SHA da fonte base foi recalculado como
  `79eb0ef6cdeeffd34942e799cbc209602be179b81b7cb45b75c1d70c42f4457d`.
- Inspeção fora do diff limitada ao risco de contenção/herança e realidade do
  botão: Card real não impõe altura ou overflow; PrimaryButton encaminha para
  AppButton real, cujo layout tem altura mínima e lábio por padding. O teto
  canônico já existente no rótulo de AppButton foi preservado. O mock de teste
  estabiliza somente a preferência assíncrona de movimento que AppButton usa.
- As guardas leem estilos efetivos de Text renderizados e identidade das
  instâncias reais. Na sequência normal→3.1→normal com opt-in pendente, exigem
  Text novo e Card estável, loading/desabilitação contínuos e nenhuma segunda
  chamada do serviço. Aceite concluído, recusa e falha de agendamento têm
  controles próprios. Não há espelho de props nem alegação de rasterização.

## Evidência focal auditada

Foram lidos envelopes e logs; não executei novamente os mesmos bytes sem
hipótese nova. Ambiente registrado: cwd `radiant-app` desta worktree,
Node `v20.20.2`, `EXPO_NO_DOTENV=1`.

| Evidência | Resultado efetivamente registrado |
| --- | --- |
| `implementer-red-causal.log/.json` sobre fonte base exata | exit 1, 10 falhas/1 controle aprovado; seis alturas, três instâncias stale e papel da recusa |
| `implementer-green-final.log/.json` — cartão, PushService, ReviewScreen.flow e HomeScreen.flow na mesma chamada | exit 0, 4 suítes/53 testes |
| `implementer-cpu.log/.json` — cartão sob taskpolicy -b | exit 0, 11 testes |
| `implementer-static.json`, logs types/lint | tsc e ESLint focal exit 0 |
| `implementer-mutations.json` e script de mutação | nove mutações específicas rejeitadas, nove restaurações para o SHA congelado |

O primeiro harness espionava o namespace RN errado; suas falhas incidentais
não entram como RED causal. O RED refeito mostra as falhas esperadas contra a
base correta, e o GREEN posterior passa. O script de mutações exige âncora
única, usa os mesmos testes e restaura em `finally` com conferência de hash.
As mutações atingem separadamente alturas do título/corpo, keys dos três Text,
key indevida no Card, papel da recusa, teto de corpo e truncamento do título.
Os flowtests consumidores mockam o cartão: seu GREEN não constitui prova de
layout integrado nativo.

## Limites nativos e próximos gates

`native-red-report.json` pertence à fonte base, não ao candidato. Conferi as
capturas `ios-red-home-ax5-live-after-details.png` e montagem inicial
`ios-red-home-ax5-initial-scroll-3/6/7.png`. No cenário live, a imagem mostra
fragmento branco do título e corpo ampliado parcialmente no viewport; o fundo
do cartão não está todo visível. Não permite afirmar corte universal de todas
as linhas ou do cartão inteiro. A montagem inicial AX5 separada mostra
wrapping/continuação legível através da rolagem; não substitui o cenário live.

A reprodução atual usa HomeScreen real no perfil local legacy com
`EXPO_PUBLIC_ENABLE_LEARNING_ROAD=false`, meta já cumprida e opt-in sem
consentimento. Review real estava vazio. O RED original T07 continua referência
do resultado Review; esta revisão não declara sua reprodução atual nem fabrica
fila, progresso, relógio ou opt-in.

O código está liberado para o executor independente medir GREEN no mesmo
perfil: normal, mudança ao vivo→AX5 com rerender legítimo, rolagem completa,
montagem inicial máxima e retorno ao normal. Android200% depende de cliente
existente compatível; erro do dev client não vira achado de produto por
inferência. Não tocar “Ativar lembretes”/“Agora não”, permissões ou simulador
reservado para obter a prova.

Controlador ainda precisa da medição nativa, validação Loop final configurada,
reconciliação canônica e fechamento. T17 global, P3 cauda T06, T09–T12,
G1–G8/G2/T14 e segundo dia continuam pendentes conforme seus contratos. Não
há aceite de aparelho físico, FPS, som audível, produção, loja ou release.

## Global Constraints recebidas e preservadas literalmente

- Preservar Medalhão, Sora, Pixel vetorial e seus quatro momentos, ouro funcional, lábio dos botões e `runtimeVersion: fingerprint`; sem glass/glow, nova identidade ou migração de SDK.
- Primeira resposta rege estrelas; preservar economia de XP/sequência/vidas/assinatura, revisão e regras do primeiro erro. Não inventar APIs, dados semanais ou preços.
- O segundo dia fica no fechamento. Preservar o simulador `5FD8C926`: sem uso em T00–T17, limpeza, reinstalação, relógio alterado ou migração destrutiva. Confirmar UDID completo antes de qualquer uso posterior.
- Aprovar este roteiro não aprova G1–G8. Merge, build, EAS, OTA, loja, instalação, retirada de conteúdo e alteração de política exigem suas autorizações específicas. Não criar currículo novo aqui.
- Um escritor de produto por vez; só o controlador abre/fecha o writer Loop. `PROJECT_BUSY` é impedimento real, nunca motivo para contornar lock. Não editar antes de `STEP_STARTED`.
- Implementador não cria subagentes, não abre writer/sessão paralela, não faz commit/push, não altera arquivo fora do ownership. Revisor é somente leitura. Controlador coordena e registra; não corrige produto por conta própria.
- Sem reset/clean/stash/revert de trabalho alheio, leitura de caminhos sensíveis ou edição direta do vault. Git ignore não isenta um artefato do guarda Loop.

Única escrita deste revisor: este relatório na pasta autorizada. Nenhum
processo iniciado; nenhum writer/sessão aberto ou fechado por mim.


---

# Revisão independente nativa R2 — P2 PushOptIn

Revisão realizada em **29/10/2026, America/Bahia**, sobre medições gravadas em
**28/10/2026**. O log bruto começa às 22:18:27 e termina às 22:44:38, -03:00;
a verificação final de limpeza foi gravada às 22:46:23. Não redatar as capturas
como execução nova de 29/10. Tier 1, leitura de artefatos já existentes.

**Spec: BOUNDED. Qualidade: APPROVED_CORE_BOUNDED.**

**Estado do componente P2 R3-SHARED-01: corrigido e validado no cenário local
Home legado ensaiado**, incluindo mudança de fonte iOS ao vivo e seu gatilho
legítimo de rerender. Não encontrei achado material remanescente no título,
corpo ou recusa do PushOptIn nessas capturas. O veredicto não aprova resultado
Review atual, Android ao vivo, Home inteira ou T17 global.

## Objeto e integridade

Root `/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20`,
branch `claude/trilha-medalhao-design`, HEAD/base medido
`1b987c1981667328b66beb958ac6a42eb3535d75`. A revisão R1 de código não foi
reaberta; nenhuma suíte ou operação nativa foi repetida.

Recalculei os hashes dos nove PNG versionáveis e comparei cada um por bytes
com seu original em `.superpowers`. Todos coincidem com o manifesto. Também
recalculei os nove hashes de `uiSource` e conferi igualdade estrutural do JSON
iOS ou igualdade textual do XML Android com o conteúdo embutido. Os nove PNG
foram inspecionados visualmente, além dos complementos citados abaixo.

Pacote final conferido:

- `docs/evidence/2026-10-28-medalhao-pushoptin-p2-native.json`:
  `7fe71f30ca8f09b763e3f9e46bf25b3e41f36245fcccff74ffe943edea4f5803`.
- `native-green-report.md`: 4570 bytes,
  `e12c0754dc09a08ef214c3318081f6620b800d6426e62a9b9ad74989e115f2cf`.
- `native-runtime.jsonl`: 163 registros, 411226 bytes,
  `5cb3a7eeef4d97d45eab98e9ee51fef900dc40536072389907998e538b6cc1c6`.
- `cleanup.json` final: 2079 bytes,
  `2c5b6c1b38b845bbed1b5a6752724a430cdb3e9f0588477ba58c361571d6eca4`;
  o objeto `cleanup` embutido no JSON final é idêntico a ele.

Os quatro arquivos abaixo continuam idênticos ao before/after nativo e ao
candidato R1, conforme hash recalculado nesta R2:

| Arquivo | SHA256 |
| --- | --- |
| radiant-app/src/features/push/components/PushOptInCard.tsx | `98733fbee3c028c40b61c6b8605469e880e97f37a264fa7cf6084ff443a9fd7f` |
| radiant-app/src/features/push/components/PushOptInCard.test.tsx | `a399cd83a5a93abc13dc6c21fb06f7c6dea7e09fecc31ab7fa83663b45508804` |
| radiant-app/expo-env.d.ts | `6fc02634da46d3edc5a88eec9173ba6bf709726be3cba83c73ebd8e859d5c147` |
| .loop/project.yaml | `b51c87a77898139fd42c832c494e60c9ebe9279ee4edf9973a0bf7cfe52e5e3c` |

## Leitura direta antes/depois

Todos os nomes da tabela estão sob
`docs/evidence/assets/2026-10-28-medalhao-pushoptin-p2/`.

| Captura inspecionada | O que sustenta |
| --- | --- |
| ios-before-normal.png | Fonte base, cartão normal com título, corpo e controles inteiros. |
| ios-before-maximum.png | RED atual ao vivo após detalhes: fragmento branco de título e corpo ampliado/cortado, com o cartão parcialmente fora do viewport. Não demonstra corte universal de todo o cartão. |
| ios-after-normal.png | Candidato, cartão normal inteiro e legível. |
| ios-after-maximum-top.png | AX5 ao vivo já amplia o título antes de ação; `Quer`, `um` e `lembre` íntegros. A continuação exige rolagem. |
| ios-after-live.png | Após o mesmo “Ver detalhes”, `um`, `lembre`, `te`, `suave?` e início do corpo legíveis; ausência do fragmento branco observado no RED. |
| ios-after-maximum-bottom.png | Continuação sobreposta do corpo até “Sem pressão. Sem cobrança.” e controles legíveis. |
| ios-return-normal.png | Retorno ao normal na mesma montagem: cartão inteiro e legível. |
| android-after-normal.png | Cartão normal inteiro no cliente Android existente. |
| android-after-maximum.png | Abertura inicial em font_scale 2.0: todo o cartão visível, com título/corpo/controles íntegros. |

A UI acessível contém a copy completa também no RED. Portanto, presença de
texto na árvore não foi usada como substituto de legibilidade visual.

Complementos originais inspecionados nesta R2:
`ios-green-home-ax5-live-second.png`,
`ios-green-home-ax5-live-title-complete.png`,
`ios-green-home-ax5-initial-title-current.png`,
`ios-green-home-ax5-initial-body.png` e
`ios-green-home-ax5-initial-bottom.png`, com seus snapshots UI.
As capturas iniciais mostram a continuação de título/corpo por sobreposição e
os dois controles. São uma abertura separada e não substituem o ensaio live.

No AX5 iOS, “lembrete” quebra dentro da palavra (`lembre`/`te`), mantendo os
glifos inteiros e a sequência da mensagem. A captura chamada title-complete
corta o alto de `Quer` no limite superior do viewport. As capturas anteriores
mostram `Quer` inteiro, e as posteriores mostram o restante: esse recorte de
enquadramento não repete o fragmento interno do Text visto no RED. A mensagem
excede a altura da tela e foi conferida através da rolagem, não em um único
quadro de cartão inteiro iOS AX5.

## Sequência causal, perfil e consentimento

O cenário comparável é HomeScreen legado real, meta diária já concluída e
opt-in ainda não decidido, no cliente iOS 1.4.0(3), simulador
`E262D4C1-99BE-496B-8567-0291C14E6533`, 402 pt. O perfil
`EXPO_PUBLIC_ENABLE_LEARNING_ROAD=false` foi somente de processo Metro,
Node20.20.2/EXPO_NO_DOTENV=1, conforme a proveniência gravada. Nenhum arquivo
de configuração persistente integra esta alteração.

No log bruto, após o comando AX5 (registro 68), snapshots 5 e 6 conservam
screenHash `0t6355g` e ambos identificam `e94` como “Ver detalhes”. O tap no
registro 73 aciona esse elemento; o estado seguinte passa a “Ocultar
detalhes”. Não há terminate/relaunch entre normal, AX5 ao vivo, detalhes,
rolagem e retorno a large. O terminate ocorre somente no registro 89, antes
da abertura inicial AX5 separada nos registros 90/91. Isso confirma o gatilho
legítimo na montagem contínua, em vez de contar cold start como reparo live.

No Android `radiant-entrada-api34`/`emulator-5554`, os comandos registram
baseline 1.0, force-stop antes de 2.0, relançamento e leitura efetiva de 2.0.
O XML do cartão máximo contém título `[113,287][967,535]`, corpo
`[113,568][967,1040]`, botão principal `[113,1107][967,1269]` e recusa
`[342,1327][739,1490]`, todos dentro da imagem 1080×2340 e acima da tab bar.
Não existe captura Android before-base nesta rodada; a cobertura é de
regressão normal/inicial200%, não de causalidade before/after Android.

Os únicos taps registrados no log bruto são no `e94` de detalhes, confirmado
por snapshots. Não há tap nos controles de opt-in, concessão de permissão,
alteração de relógio/progresso/fixture ou ação de loja. A leitura Android de
pacote registra POST_NOTIFICATIONS `granted=false`; não confundir outras
permissões de instalação `granted=true` com consentimento para notificações.

## Limites, prioridades e limpeza

Não encontrei novo P1/P2 material no componente no cenário ensaiado. A quebra
intrapalavra no título máximo não elimina texto nem repete o clipping interno
que originou esta entrega. Outros hosts compartilhados preservam limitações
de fonte ao vivo; esta evidência não lhes concede aceite de acessibilidade.

Permanecem sem prova nesta rodada:

- Resultado Review atual: fila genuinamente vazia, sem fabricação; T07 RED
  histórico permanece referência daquele consumidor.
- Android ao vivo: não ensaiado aqui; o erro anterior de dev-client/linking
  continua sem diagnóstico e não foi declarado resolvido.
- Home inteira, outras telas, P3 cauda T06, aceite global T17, G1–G8/G2/T14,
  segundo dia, VoiceOver/fala audível, FPS, aparelho físico ou produção.

Falhas de swipe por snapshot ausente e avisos de estabilização estão
preservados no log. Não contam como PASS nem como defeito de produto; a leitura
acima usa os snapshots/capturas posteriores válidos. Quadros transitórios
pretos/downloading não fundamentam a conclusão.

O `cleanup.json` final contém saídas de verificação: porta8081 sem listener,
PIDs próprios ausentes, nenhum simulador iOS bootado e lista ADB vazia. Antes
do encerramento, o log confirma iOS large, Android1.0 e animações0/0/0 iguais
à baseline; app Android sem PID e reverse removido. O daemon ADB preexistente
foi preservado. Esta é auditoria do fechamento gravado em28/10; a remedição
de29/10 pertence ao controlador, não a uma nova execução deste revisor.

Pode-se registrar **P2 local corrigido com aceite nativo delimitado** e
prosseguir aos gates do controlador. Não declarar o P2 comprovado em todos os
consumidores ou promover isso a encerramento global T17. Validação Loop final,
documentação canônica e fechamento ainda pertencem ao controlador.

Única escrita R2: este relatório na pasta excluída autorizada. Nenhuma edição
de produto/docs canônicos, novo processo nativo/teste, Loop, build, instalação,
commit ou subagente. Artefatos e produto ficam congelados após esta revisão.
