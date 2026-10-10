# A 1.4.0 (12) reprovada pela 3.1.2 e reenviada — relatório de 2026-10-10

Feito na conversa que abriu pelo
[prompt (18)](2026-10-10-radiant-prompt-de-continuidade-18.md). O prompt mandava
conferir com o dono se a 1.4.0 tinha sido aprovada antes de pegar o item 38, e a
resposta à revisão vir antes de tudo se ela tivesse sido reprovada. Foi.

## O que a Apple disse

Medido no App Store Connect, em Distribuição → Revisão de apps, na submissão
`3c9bcdda-6948-4240-96b7-d4aa17269d5e`:

- a versão `1.4.0 (12)` estava **Rejeitado**, pela diretriz **3.1.2 Business:
  Payments - Subscriptions**. Os dois produtos e o grupo estavam "Pronto para
  revisão";
- a mensagem, de 2026-10-10 às 03:18, é automática. A revisão não começou: o
  app oferece assinatura com renovação automática, mas os metadados da página na
  App Store não têm link funcional para os Termos de Uso (EULA). Com o EULA
  padrão da Apple, o link vai na Descrição; com um EULA próprio, no campo do
  App Store Connect.

O dono achou o e-mail "There's an issue with your… submission" no Outlook, na
**pasta Lixo**. Por isso, o prompt (18) registrou "nenhum e-mail" e o estado
como não remedido.

## O que foi feito

- **O binário não mudou.** A tela da assinatura já mostra os Termos de Uso, que
  apontam para o EULA padrão da Apple, e a Política de Privacidade. Os dois
  links vêm de `radiant-app/src/config/legal.ts` e são usados em
  `SubscriptionScreen.tsx`. Faltava só o metadado.
- **A Descrição da 1.4.0 ganhou a seção "Assinatura"** no fim, com o EULA
  padrão da Apple e a política de privacidade. O texto foi aprovado pelo dono e
  está em [`textos-loja-pt-BR.md`](../../store/textos-loja-pt-BR.md). A
  automação foi bloqueada pelo classificador do modo automático no primeiro
  toque no campo, então o dono colou o texto, salvou e reenviou.
- **O agente conferiu o campo duas vezes:**
  - antes de salvar: 2011 caracteres, contra 1605 antes, e a seção uma vez só;
  - depois de recarregar: o mesmo valor voltou do servidor.

  Os dois links responderam HTTP 200.
- **O dono reenviou às 11:12, e a versão ficou em "Aguardando revisão"**, com os
  4 itens: a versão, os dois produtos e o grupo.

Não houve resposta escrita ao revisor. Era opcional, porque a mensagem foi
automática, e não foi pedida.

## Medido, inferido e não verificado

- **Medido:**
  - o motivo da reprovação e os estados dos 4 itens;
  - o valor salvo da Descrição;
  - o HTTP 200 dos dois links;
  - o status "Aguardando revisão" às 11:12.
- **Inferido:** que só faltava o link. A mensagem automática cita só o EULA, mas
  o revisor humano pode achar outra coisa quando a revisão de fato começar.
- **Não verificado:**
  - a página pública da App Store, que só muda na liberação;
  - o campo de política de privacidade nas Informações do app, que não foi
    aberto. A 1.3.1 foi aprovada com ele.

## O que fica

- **40, do dono:** esperar a aprovação e liberar a 1.4.0 manualmente. Se a
  Apple reprovar de novo, a resposta é do agente com o dono.
- **A próxima frente do agente continua sendo o 38**, como no prompt (18).
