# Kit de recrutamento de testadores — Google Play closed test

> Preparado em 2026-07-29. Pronto para disparar **quando você decidir começar** o
> recrutamento (é o item de maior latência do lançamento Android). Meta: **14+
> testadores** aceitos (mínimo do Google é **12**, opted-in por **14 dias
> consecutivos**; a margem cobre desistências).

## Como o closed test funciona (contexto de 1 minuto)

- Você sobe o build num **track de teste fechado** no Play Console e adiciona os
  testadores (por e-mail Google ou por um Grupo do Google).
- Cada testador precisa **aceitar o convite** (opt-in) e **instalar** o app.
  Ninguém instala APK solto: o opt-in libera a ficha normal na Play Store, e a
  instalação e as atualizações acontecem por lá.
- O relógio dos **14 dias consecutivos** começa quando há **12+ opted-in** e continua
  enquanto a contagem não cair abaixo de 12. **Só depois** o Google libera o pedido de
  produção.
- Não precisam ser especialistas em radiologia — só instalar e abrir o app de vez em
  quando. Basta a conta **Google** deles (Android).

## A regra que mais derruba closed test

**O e-mail cadastrado no track tem que ser a conta Google logada na Play Store do
aparelho da pessoa.**

Se ela aceitar o convite numa conta e o celular estiver logado em outra, a ficha
simplesmente **não aparece** — sem erro, sem aviso, sem explicação. Ela vai dizer
"o link não funciona", e não é o link. Para a contagem de opted-in, isso é
indistinguível de uma desistência.

Ao coletar, pergunte **"qual conta Google está no seu celular Android?"**, não
"qual é o seu e-mail". Não precisa ser `@gmail.com`, mas precisa ser conta Google —
e quem só tem iPhone não serve para este teste.

Preveja também a propagação: depois do opt-in pode levar de minutos a algumas horas
até a ficha ficar visível para aquela conta. Reclamação nos primeiros minutos é isso,
não defeito.

## O que dá para fazer ANTES de existir um build

O **link de opt-in só existe depois que houver uma release ativa no track fechado**.
Sem AAB subido e promovido, não há link para enviar — o convite abaixo não pode sair
antes disso.

O que tem latência humana e deve começar imediatamente é o resto:

1. **Levantar as 14–16 pessoas** e coletar a conta Google de cada uma (ver a regra
   acima).
2. **Criar o track fechado** no Play Console → **Testes → Testes fechados**. O track
   existe sem release.
3. **Cadastrar os testadores.** O console oferece duas formas, na aba Testadores do
   track: **Listas de e-mails** (gerida no próprio Play Console) ou **Grupos do
   Google**.

   *Correção de 2026-07-31:* uma redação anterior deste kit recomendava o Grupo do
   Google argumentando que, com churn de 14 dias, editar a lista pelo grupo não
   exigiria nova release. O argumento não separa as duas opções — **a lista de
   e-mails do console também é editável a qualquer momento sem nova release**, por
   ser configuração do track e não conteúdo da release. Para 14–16 pessoas, a lista
   do console é o caminho: uma peça a menos para manter. O Grupo do Google só ganha
   se outra pessoa for administrar quem entra e sai, ou se a mesma lista for
   reaproveitada em vários apps.

   **Você não precisa das 14 para começar:** crie a lista com quem já tiver e
   acrescente depois. O que não dá para adiantar é o convite, porque o link ainda
   não existe.

4. **Endereço de e-mail ou URL de feedback** (campo da mesma aba):
   `anderson.smelo94@gmail.com` — o mesmo contato da política de privacidade e da
   ficha da loja. Os três precisam bater.

## Passo a passo (Anderson)

1. Track fechado criado e apontado para o Grupo do Google (passos acima).
2. Subir o AAB no track e **promover a release** — `releaseStatus: draft` a deixa
   parada, e release parada não gera link nem inicia o relógio.
3. Copiar o **link de opt-in** do track, que passa a existir agora.
4. Enviar o convite (modelo abaixo) com o link.
5. Acompanhar diariamente quem **aceitou** (a planilha abaixo).

## Modelo de convite (WhatsApp / e-mail)

> **Assunto:** Me ajuda a testar o Radiant? (10 min no seu Android)
>
> Oi, [nome]! Lancei um app educacional de radiologia — o **Radiant** (tipo um
> "Duolingo da radiologia") — e preciso de alguns testadores no Android antes de
> publicar na Play Store.
>
> É rápido: **(1)** abra este link no celular Android e aceite ser testador →
> **[LINK DE OPT-IN]** · **(2)** instale o app pela Play Store (o link te leva lá) ·
> **(3)** abra e faça uma ou duas lições quando puder, nos próximos dias.
>
> O Google exige que pelo menos 12 pessoas fiquem no teste por 14 dias — então o
> importante é **aceitar o convite e manter instalado**. Qualquer bug ou ideia, me
> manda! Muito obrigado 🙏

## Planilha de acompanhamento (modelo — copiar para uma sheet)

| # | Nome | E-mail Google | Convite enviado | Opt-in aceito (data) | Instalou | Ainda no teste | Notas |
|---|------|---------------|-----------------|----------------------|----------|----------------|-------|
| 1 |      |               | ☐               |                      | ☐        | ☐              |       |
| … |      |               |                 |                      |          |                |       |
| 14 |     |               |                 |                      |          |                |       |

**Meta de contagem:** manter a coluna "Ainda no teste" com **≥12** marcados durante
os 14 dias consecutivos. Se cair para 11, recrutar reposição imediatamente (a
contagem de dias pode ser afetada).

## Dicas para não perder o relógio

- Recrute **14–16** para absorver quem desiste ou troca de celular.
- Avise que **desinstalar** ou **sair do teste** derruba a contagem.
- Um lembrete no meio dos 14 dias ("continua tudo certo? 🙌") reduz churn.
- O pool pode se sobrepor à **pesquisa de usuários** (Task 12) — as mesmas pessoas
  servem para os dois.
