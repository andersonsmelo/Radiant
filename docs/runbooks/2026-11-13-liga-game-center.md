# Runbook — ligar a Liga da semana (Game Center)

**Escrito em 13/11/2026** pela sessão da frente F4 da 1.6. Decisão:
[ADR 2026-11-13](../adr/ADR-2026-11-13-liga-semanal-no-game-center.md).
Tudo aqui é do **dono**: o agente não mexe no App Store Connect nem digita
credencial. Os nomes de menu do App Store Connect mudam com o tempo; onde este
texto não pôde conferir a tela atual, ele diz.

O código está na branch `claude/f4-liga-semanal-26632b`, atrás da chave
`ENABLE_LEAGUE`, desligada por padrão. **Com a chave desligada, nada muda para
o aluno**, nem no binário. Siga a ordem abaixo: ligar a chave antes de criar o
placar faz a tela mostrar "A liga ainda não abriu".

## 1. Criar o placar no App Store Connect

1. Abra o app Radiant no App Store Connect e vá a **Game Center** (na barra
   lateral do app, em Serviços ou Recursos, conforme a versão do site).
2. Se pedir, ative o Game Center para o app.
3. Em **Placares** (Leaderboards), clique em **+** e escolha **Placar
   recorrente** (Recurring Leaderboard). Preencha exatamente:

   | Campo | Valor |
   | --- | --- |
   | Nome de referência | `Liga semanal XP` |
   | ID do placar | `radiant.liga.semanal.xp` |
   | Tipo de formato da pontuação | Inteiro (Integer) |
   | Envio da pontuação | Melhor pontuação (Best Score) |
   | Ordem | Do maior para o menor (High to Low) |
   | Início | uma segunda-feira às **00:00 UTC** (domingo às 21:00 em Salvador) |
   | Duração | 1 semana |
   | Repetir a cada | 1 semana |
   | Faixa de pontuação | deixe em branco, ou de 0 a 1.000.000 |

   O ID precisa ser idêntico: o app procura `radiant.liga.semanal.xp`
   (`radiant-app/src/features/league/league.types.ts`). O app envia o **total**
   de XP da semana, por isso o tipo é "melhor pontuação": reenviar o mesmo total
   não soma de novo. Confira o fuso do campo de início na tela; se ele estiver
   em horário local, use domingo 21:00 de Salvador.
4. Em **Localização**, adicione **Português (Brasil)**:
   - Nome: `Liga da semana`
   - Formato da pontuação: inteiro, sufixo no singular ` XP` e no plural ` XP`
   - Imagem: opcional. Não foi conferido se a tela atual a exige.
5. Salve. O placar fica "Não está ativo" até ir à revisão com uma versão.

## 2. Ligar a chave numa build

A chave é lida **em build** (`EXPO_PUBLIC_ENABLE_LEAGUE`). Ela também decide se
a permissão do Game Center entra no binário (plugin `with-game-center`). Por
isso uma atualização OTA **não** liga a liga num binário compilado sem ela: o
aluno veria "Game Center indisponível".

- Para testar: defina `EXPO_PUBLIC_ENABLE_LEAGUE=true` no ambiente de uma build
  `development` ou `preview` (variável de ambiente do EAS para esse perfil, ou o
  bloco `env` do perfil no `eas.json`). O agente não alterou o `eas.json`.
- Para a loja: o mesmo valor no perfil `production`, **só depois** de o placar
  existir e de o teste do passo 4 passar.
- Ao adicionar a permissão, o EAS sincroniza a capacidade Game Center no App ID.
  Ela costuma vir ligada por padrão nos App IDs explícitos; se a build reclamar
  de perfil de provisionamento, confira em Certificates, Identifiers & Profiles.

## 3. Enviar a versão

Na página da versão (1.6) no App Store Connect, na seção **Game Center**, marque
o Game Center e adicione o placar `Liga semanal XP` à versão. Sem isso, o placar
não fica ativo na loja. A revisão da Apple verá a tela da liga pela linha "Liga
da semana" no Perfil.

## 4. Testar com conta de sandbox

Builds de desenvolvimento e do TestFlight usam o **ambiente de sandbox** do
Game Center; a pontuação de teste não aparece na loja.

1. No iPhone, abra **Ajustes > Game Center** e entre com sua conta Apple. Em
   build de desenvolvimento aparece a indicação de sandbox.
2. Abra o Radiant com a chave ligada, vá a **Perfil > Liga da semana** e toque
   em **Entrar no Game Center** se o app pedir.
3. Conclua uma aula. Volte à liga: você deve aparecer com o XP da aula e
   destacado ("Você (seu apelido)").
4. Para ver outra pessoa na lista, entre com uma segunda conta Apple em outro
   aparelho (ou simulador com conta) e conclua uma aula nela.
5. Desligue a rede e conclua outra aula: a tela da liga diz "Sem conexão". Ao
   religar, o XP chega sem somar duas vezes.

O que o agente já viu, em 13/11/2026, num simulador iOS 26.5 sem conta e com a
chave ligada: "Carregando a liga…", depois "Entre no Game Center para
participar" com o caminho pelos Ajustes, nas abas Todos e Amigos, e a linha do
Perfil levando à liga. Os demais estados (lista, aluno fora do topo, semana
vazia, sem rede, resumo e aviso na Estude) foram verificados só por teste de
unidade, porque exigem conta Apple, que é sua
([evidência](../evidence/2026-11-13-f4-liga-semanal.md)).

## 5. Ficha de privacidade e política

**Ficha de privacidade do App Store ("Dados não coletados").** Pela definição da
Apple, "coletar" é transmitir dado para fora do aparelho de forma que o
desenvolvedor ou um parceiro o acesse. A pontuação vai para a Apple pelo
GameKit; o Radiant não tem servidor que a receba, e o apelido e a posição dos
outros só são lidos para mostrar na tela. A leitura desta sessão é que a ficha
**continua "Dados não coletados"**, mas ela não conferiu o texto vigente da
página "App Privacy Details" da Apple. Confira lá antes do envio; se a Apple
passar a pedir declaração para dados de jogo no Game Center, a categoria seria
"Conteúdo do usuário > Conteúdo de jogo" (Gameplay Content), não vinculada à
identidade e sem rastreamento.

**Política de privacidade (`docs/legal/politica-de-privacidade.md`).** Não foi
alterada nesta frente. Texto proposto para uma seção nova, a publicar junto
com a versão que ligar a chave:

> **Liga da semana (Game Center).** Se você entrar no Game Center da Apple, o
> Radiant envia à Apple o total de XP que você ganhou na semana, para montar a
> liga. A Apple mostra aos outros participantes só o seu apelido do Game Center,
> a sua posição e o seu XP. O Radiant não recebe seu nome, e-mail ou
> identificador da Apple, e não guarda esses dados em servidor próprio. Entrar
> no Game Center é opcional e não muda nada no seu estudo. O tratamento desses
> dados segue os termos e a política de privacidade da Apple.

**Lista de amigos.** A aba "Amigos" pode fazer o iOS pedir acesso à lista de
amigos do Game Center. O texto do pedido está no plugin: "O Radiant mostra seus
amigos do Game Center na liga da semana. Nada além do apelido é exibido."

## 6. Desligar

Para tirar a liga do ar, compile com `EXPO_PUBLIC_ENABLE_LEAGUE` ausente ou
diferente de `true`. A linha do Perfil e o aviso da Estude somem, a rota volta
para a Estude e nada mais é enviado. O placar pode ficar no App Store Connect.
