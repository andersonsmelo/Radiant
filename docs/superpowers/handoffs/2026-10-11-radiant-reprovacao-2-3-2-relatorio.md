# A 1.4.0 (12) reprovada pela 2.3.2 e reenviada — relatório de 2026-10-11

Continua o [relatório de 2026-10-10](2026-10-10-radiant-reprovacao-1-4-0-relatorio.md),
que conta a reprovação pela 3.1.2 (o EULA) e o reenvio das 11:12.

## O que a Apple disse

Medido no App Store Connect, na submissão `3c9bcdda-6948-4240-96b7-d4aa17269d5e`:

- **a versão foi reprovada de novo em 2026-10-10, às 11:54, pela diretriz
  2.3.2 (metadados precisos).** Desta vez a revisão foi humana, num iPad Air 11"
  (M4). O EULA não voltou a ser apontado;
- **o motivo:** a imagem promocional das assinaturas não representava a compra.
  Ela era igual ao ícone do app, e a mesma nos dois produtos. A Apple dá duas
  saídas: refazer a imagem ou apagá-la, se não houver plano de promover a
  compra.

Conferido nas páginas dos produtos: o Mensal e o Anual tinham, no campo
"Imagem (opcional)", o mesmo `imagem-assinatura-1024.png`, com o Pixel do
ícone. A promoção na App Store não estava ligada, e não há oferta de
reconquista. O arquivo não está no repositório.

## O que foi feito

O dono escolheu **apagar a imagem dos dois produtos**. Os cliques foram todos
dele, porque o classificador do modo automático bloqueou os do agente. O agente
leu e conferiu cada passo pela página e pela API interna, só com GET.

1. **Tirar as assinaturas da submissão.** O campo de imagem estava desativado
   enquanto elas estavam na submissão reprovada. O dono as tirou pelo ⊖ de cada
   linha, e elas ficaram como "Removido".
2. **Apagar as imagens.** Com o campo liberado, apareceu o ⊖ "Apagar" no canto
   da miniatura. O dono apagou e salvou nos dois produtos. Depois de
   recarregar, o agente viu os dois campos vazios, e a API deu 0 imagens em
   cada um.
3. **O beco do 409.** O "Adicionar para revisão" da assinatura dava erro
   genérico. Por baixo, era o 409 `ITEM_PART_OF_ANOTHER_SUBMISSION`: o item
   "Removido" continuava ligado à submissão reprovada. A página criou e apagou
   sozinha duas submissões vazias, e o agente confirmou que nenhuma ficou
   sobrando.
4. **Cancelar a submissão `3c9bcdda`.** O dono cancelou e a versão passou a
   "Rejeitado pelo desenvolvedor". As assinaturas voltaram com o estado
   `MISSING_METADATA` na API. O agente conferiu que não faltava nada: a
   localização, a captura de revisão, os preços e a disponibilidade estavam
   presentes. Esse estado é como a API representa o "Rejeitado pelo
   desenvolvedor" da tela.
5. **O envio acidental.** O agente propôs começar pela versão. Ela foi
   adicionada sem rascunho aberto e saiu **sozinha** à revisão às 19:39, na
   submissão `a2554be2`, com 1 item. Foi cancelada antes de a revisão começar.
   O erro foi da ordem proposta, e a lição está no AGENTS.md.
6. **O envio das 20:00.** O rascunho novo foi montado pelo Mensal, depois o
   Anual, o grupo e, por último, a versão, sempre em "Rascunho de envio (1)".
   O agente conferiu os 4 itens no rascunho `a5e5a094`, as assinaturas sem
   imagem e a Descrição com o EULA, e o dono enviou **às 20:00**.

## Medido, inferido e não verificado

- **Medido, em 2026-10-11, às 20:00:**
  - a submissão `a5e5a094` em `WAITING_FOR_REVIEW`, com 4 itens: a versão
    `892859361`, as duas assinaturas e o grupo;
  - a versão 1.4.0 em `WAITING_FOR_REVIEW`, com a build 12 e liberação manual;
  - 0 imagens nas duas assinaturas;
  - a Descrição com 2011 caracteres e o link do EULA.
- **Inferido:** que o rascunho reaproveitou as mesmas versões dos itens. Os
  identificadores das assinaturas e do grupo são os mesmos do envio reprovado,
  então não são produtos novos.
- **Não verificado:**
  - se o revisor vai aceitar assinatura sem imagem. O campo é opcional, e a
    própria Apple oferece apagá-lo;
  - a página pública da App Store, que só muda na liberação.

## O que fica

- **40, do dono:** esperar a aprovação e liberar a 1.4.0 manualmente. Se a
  Apple reprovar de novo, a resposta é do agente com o dono.
- **Se um dia houver promoção ou oferta de reconquista,** cada plano precisa de
  uma imagem própria, diferente do ícone
  ([`textos-loja-pt-BR.md`](../../store/textos-loja-pt-BR.md)).
- **A próxima frente do agente continua sendo o 38.**
