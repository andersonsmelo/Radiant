# ADR — Recuperação do progresso local: schema futuro, backup do iOS e reset (G7)

**Data:** 2026-10-19 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa. Ele pediu explicação de cada
decisão e respondeu "vamos resolver do primeiro ao último por ordem de
criticidade seguindo conforme recomendação".
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).

## Contexto

[código] Todo o estado do aluno mora no AsyncStorage do aparelho: jornada,
revisões, tentativas, XP, sequência e vidas, em 65 chaves inventariadas em
`radiant-app/src/storage/storageInventory.ts`. A sincronização com servidor está
desligada, então o aparelho é a única cópia. O inventário G7 da FILA 54
([evidência](../evidence/2026-10-19-fila54-g4-android-g7.md)) achou três lacunas
de recuperação.

## Decisões, em ordem de criticidade

1. **A jornada não grava por cima de um store com schema desconhecido.**
   - **Antes:** uma versão antiga do app lia `@radiant:journey_progress_v1`
     gravado por uma versão mais nova, tratava o schema como ausente e gravava
     um store novo por cima na primeira leitura (`ensureProgress` grava ao ler).
     A jornada salva sumia. Os caminhos reais são três: TestFlight ou teste
     interno voltando de build, backup restaurado num aparelho com versão velha
     e o rollback que o plano G7 prevê.
   - **Agora:** `writeStore` não escreve quando o store gravado tem um
     `schemaVersion` que o app não conhece. O app segue com o snapshot em
     memória, e a versão nova encontra o dado intacto.
   - **O que continua igual:** store sem `schemaVersion`, ou que nem é objeto,
     segue tratado como ausente, como antes; o legado `journey-progress.v1`
     segue migrando; o `reset()` explícito segue apagando.
2. **O iOS passa a incluir o AsyncStorage no backup do iCloud e do computador.**
   - **Antes:** o RNCAsyncStorage exclui a pasta do backup quando o app não diz
     nada (`RNCAsyncStorage.mm`, linhas 519–527), e o Radiant não dizia. Quem
     troca de iPhone por backup recomeçava do zero. O Android já tinha
     `allowBackup` ligado.
   - **Agora:** `ios.infoPlist.RCTAsyncStorageExcludeFromBackup: false` no
     `app.json`. A biblioteca reaplica o valor a cada abertura, então o efeito
     vale também para quem já tem o app instalado, a partir da build que levar a
     chave.
   - **O que vai junto no backup:** a sessão local (`@radiant:auth_session_v1`)
     e o espelho da assinatura. Nenhum dos dois expõe dado sensível: a
     sincronização está desligada, e a Apple confirma a assinatura de novo pelo
     StoreKit.
3. **Não haverá botão de reset agora.** Um reset dentro do app é promessa nova,
   com risco de apagar estudo por engano, e os dados são só locais. O caminho
   continua sendo o do sistema, agora explicado no suporte:
   - **iPhone:** apagar e reinstalar;
   - **Android:** "Limpar armazenamento". Desinstalar pode não bastar, porque o
     backup do Google pode devolver os dados.

   Revisitar quando a conta ou a sincronização voltarem: aí apagar os dados vira
   obrigação legal (LGPD), e o reset precisa alcançar o servidor.

## Consequências

- **Política e suporte:** a política de privacidade e a página de suporte
  (`docs/legal/`) passam a citar o backup do sistema e como zerar em cada
  plataforma. A política dizia "apenas no seu dispositivo", o que já era
  impreciso no Android. A promessa de "opção de reinício dentro do app, quando
  disponível" saiu, porque não haverá opção.
- **Ordem de publicação, que é do dono:**
  1. republicar as duas páginas;
  2. só então enviar à loja a build com a chave do item 2. Uma atualização OTA
     não leva mudança de `Info.plist`.
- **Rótulos de privacidade das lojas:** não mudam, porque o backup vai para a
  conta do aluno, e não para o desenvolvedor. Não houve consulta jurídica.
- **Limite das provas:** nada foi ensaiado num backup real do iCloud ou do
  Google. A prova do item 2 é o atributo de exclusão no simulador, ligado e
  desligado pela chave
  ([evidência](../evidence/2026-10-19-g7-decisoes-de-recuperacao.md)).
