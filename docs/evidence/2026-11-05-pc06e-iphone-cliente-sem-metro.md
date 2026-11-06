# PC06-E — o Radiant do iPhone não carrega o Metro

Medido em **05/11/2026, entre 11:32 e 11:41, America/Bahia**, na worktree
`trilha-2026-10-20`, branch `claude/conteudo-reinicio-tecnologo`, HEAD `dcb6810`,
com a árvore local suja preservada. **A prova de VoiceOver não foi executada.** O
PC06 permanece aberto. Nenhum código do app foi alterado nesta passagem.

## Decisão do dono

Anderson disse que não mexeríamos com o VoiceOver e pediu para disponibilizar o
iPhone ao Mac. Diante do resultado abaixo, escolheu **registrar e encerrar**, em vez
de autorizar um build. Isso não retira o VoiceOver dos critérios de saída do PC06:
essa decisão não foi tomada.

## O que foi medido

| Medição | Resultado | Fonte |
|---|---|---|
| Vínculo com o Mac | iPhone 16, iOS 27.2, pareado, por cabo, depois de constar como indisponível na mesma manhã | `devicectl` |
| Estado do aparelho | sem bloqueio no momento, modo de desenvolvedor ligado | `devicectl` |
| Xcode | 27.2 | `xcodebuild -version` |
| App instalado | `com.ascendcreative.radiant` **1.4.0 (11)**, `builtByDeveloper: true` | `devicectl` |
| Abrir com a URL do cliente apontando para o Metro | o app abriu no onboarding, sem a tela do cliente de desenvolvimento | captura da tela do iPhone |
| Pedidos ao Metro | **zero**: nenhuma linha nova no log e nenhuma conexão estabelecida em 90 s | log do Metro e `lsof` |
| Abrir `radiantapp://editorial-preview` | **"Unmatched Route"** | captura da tela do iPhone |
| Container do app | há `bundle-*.jsb` em `.expo-internal` e um log de `expo-updates` | só nomes de arquivo; conteúdo não lido |

O build difere dos demais citados nesta frente: o E262 usa o cliente 1.4.0 (3), e a
versão liberada na App Store é a 1.4.0 (12).

As duas capturas não foram versionadas, porque ficaram fora do escopo declarado.
Mostravam apenas o onboarding e a tela de rota não encontrada.

## Conclusão e limites

**Medido:** esse binário não atende à URL do cliente de desenvolvimento e o JavaScript
que ele executa não tem a rota da prévia.

**Inferido:** ele roda um bundle anterior à rota, provavelmente o salvo por
`expo-updates`, e não é um cliente de desenvolvimento utilizável. Uma árvore atual
mostraria a tela de prévia indisponível, porque o arquivo da rota existe mesmo no
grafo de release.

**Isso corrige o handoff de 05/11**, que tratava o app como "cliente de
desenvolvimento" com base no relato do dono e sem versão medida. `builtByDeveloper`
descreve a assinatura e não prova a presença do cliente.

**Não verificado:** o conteúdo do binário, a origem do build 11, o canal do bundle
salvo e se o iPhone alcança o Mac pela rede. A rede não foi testada porque o app nem
tentou chegar ao Metro. Não se mediu incompatibilidade com o iOS 27.2.

## Casos de VoiceOver

Nenhum foi tentado, e o VoiceOver não foi ligado. Sem o laboratório carregado, os
casos não têm onde ocorrer.

| Caso | Resultado |
|---|---|
| Menu "Prévias do conteúdo · PC06-E" | NÃO EXECUTADO |
| M01.01, ajuda, checkpoint e os dois contextos de recuperação | NÃO EXECUTADO |
| Q2 frente/costas, Q3, Q4, Q5 e Q6 sintético | NÃO EXECUTADO |
| Avisos de aula retirada e de revisão indisponível | NÃO EXECUTADO |
| Texto ampliado, alcance por rolagem e movimento reduzido | NÃO EXECUTADO |

## Efeitos no aparelho e no ambiente

O agente abriu o app duas vezes por `devicectl`, com URLs, e capturou a tela duas
vezes. Não tocou no onboarding, não instalou nada, não limpou nem editou dados e não
encerrou o app. O iPhone ficou na tela "Unmatched Route", cujo "Go back" o dono pode
usar. Identificadores do aparelho não foram persistidos.

Metro próprio encerrado, 8081 sem listener. `expo-env.d.ts` mantido com a data de
30/10. E262 e o simulador reservado `5FD8C926-BC5A-4E9E-B5BE-2E080B2ED2A3` não
receberam comandos. Sem build, instalação, prebuild, EAS/OTA, promoção, release,
commit ou push.

**`devicectl device capture screenshot` funciona neste iPhone** e dispensa instalar
qualquer coisa. Serve para conferir o estado da tela em provas físicas futuras. Não
prova fala do VoiceOver.

## Gate e fechamento

Writer `run-1793889878168-4fd88a0e`, de escopo documental. Gate configurado, um ciclo:
**`VALIDATION_FAILED`, 14/15.** `app-quality` estourou o prazo de 180 s, em 207 s; os
demais passaram, inclusive `app-test` e `docs-contract`. A carga estava perto de 5 na
abertura, com um `ffmpeg` alheio em uso.

O mesmo comando, rodado direto com o ambiente do validador, saiu com código 0 em
**215 s**: 217 suítes, 2909 testes e visual QA sem regressão. Isso é diagnóstico, não
substitui o gate. Esperou-se mais 30 minutos, mas a carga subiu para ~58, com `ffmpeg`
a ~800%, e não houve nova tentativa. O processo alheio não foi tocado.

O run foi fechado pela CLI sem `step finish` e sem memória no cérebro, portanto **sem
sucesso validado**. A árvore segue suja e sem CI de um SHA.

## Próxima ação

Para retomar, o dono precisa decidir se autoriza compilar e instalar um cliente de
desenvolvimento no iPhone, depois de conferir perfil, identificador do app e efeito
sobre o Radiant instalado. Sem essa autorização, a prova física fica bloqueada, e OTA
não é alternativa. TalkBack e a pendência editorial de texto de brief nas práticas
continuam abertos, sem relação com este bloqueio.
