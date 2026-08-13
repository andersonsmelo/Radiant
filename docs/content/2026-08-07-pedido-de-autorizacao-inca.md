# Pedido de autorização ao INCA — rascunho para o dono enviar

**Status: RASCUNHO. Não foi enviado, e não deve ser enviado por agente.** O envio
é do dono, e o destinatário precisa ser confirmado antes.

**O destinatário não está preenchido de propósito.** O canal oficial do INCA para
pedidos de uso de publicações muda, e escrever aqui um endereço que eu não
verifiquei seria inventar o dado mais importante do documento. Confirme o canal
vigente no site do Instituto (área de publicações / fale conosco) ou pelo
Serviço de Informação ao Cidadão antes de enviar.

## Por que este pedido vale a pena, e por que ele não é urgente

**Não bloqueia nada hoje.** Pelo [ADR de 2026-08-07](../adr/ADR-2026-08-07-proveniencia-sem-citacao.md),
a cadeia de conteúdo não reproduz texto das fontes: ela entrega afirmação
própria com ponteiro auditável para a prova, e um validador no gate reprova
qualquer artefato que carregue texto de fonte.

O pedido vale porque converte uma incerteza futura em documento, por um custo de
um e-mail. Se um dia a decisão for exibir o trecho na tela, a resposta já estará
arquivada — e o momento de pedir é agora, quando não há pressa e a pergunta pode
ser feita com calma.

## Duas perguntas, e elas são diferentes

| Obra | Situação hoje | O que perguntar |
| --- | --- | --- |
| *Mamografia: da prática ao controle* (2007) | Página de direitos permite reprodução total ou parcial com citação da fonte, **sem cláusula não-comercial**. Nosso catálogo marca `commercialUse: false` por precaução própria, não por exigência da obra | **Confirmação.** A permissão alcança um aplicativo educacional com camada paga? |
| *Atualização em Mamografia para Técnicos em Radiologia* | CC BY-NC-SA 4.0, com Não Comercial **e** Compartilha Igual | **Licença suplementar.** Há caminho para uso educacional comercial fora dos termos da CC? |

A segunda é a mais cara e a menos provável — uma obra publicada sob NC-SA
dificilmente ganha exceção informal. Faça as duas mesmo assim: são o mesmo
e-mail, e a primeira sozinha já paga o envio.

---

## Rascunho

> **Assunto:** Consulta sobre uso de publicações do INCA em aplicativo educacional
>
> Prezados,
>
> Sou responsável pelo desenvolvimento de um aplicativo educacional voltado a
> estudantes e técnicos em radiologia. Duas publicações do Instituto são
> referência para o material que estamos produzindo, e escrevo para esclarecer
> os termos de uso antes de qualquer decisão de produto.
>
> Esclareço primeiro o uso atual, porque ele delimita a consulta: hoje **não
> reproduzimos texto das obras**. O material didático é redigido por nós, e cada
> afirmação registra internamente a publicação, a página e um identificador do
> trecho que a fundamenta, para auditoria e citação da fonte. Nenhum trecho das
> obras é distribuído no aplicativo.
>
> As perguntas são sobre um cenário futuro, e são duas:
>
> **1. *Mamografia: da prática ao controle* (INCA, 2007).** A página de direitos
> informa que "é permitida a reprodução total ou parcial desta obra, desde que
> citada a fonte". Gostaríamos de confirmar se essa permissão alcança a
> reprodução de trechos, com citação da fonte, dentro de um aplicativo
> educacional que ofereça uma camada de assinatura paga.
>
> **2. *Atualização em Mamografia para Técnicos em Radiologia* (INCA).** A obra é
> disponibilizada sob Creative Commons Atribuição–Não Comercial–Compartilha
> Igual 4.0. Gostaríamos de saber se o Instituto concede, mediante solicitação,
> autorização para uso educacional em produto com camada paga, fora dos termos
> da licença Creative Commons.
>
> Em qualquer cenário, a autoria e a fonte serão creditadas de forma destacada.
> Coloco-me à disposição para prestar qualquer esclarecimento adicional sobre a
> natureza do projeto.
>
> Atenciosamente,
>
> [nome, função, contato]

---

## Ao receber a resposta

1. **Não edite o catálogo à mão.** `Conteúdo/fontes/library-catalog.json` está
   sob `writePolicy`; a mudança de `commercialUse` ou de `allowedUses` entra por
   run do Loop, com a resposta arquivada como evidência.
2. **Arquive o e-mail recebido** e referencie-o no `decisionBasis` da fonte,
   substituindo o texto atual — que hoje diz, corretamente, que a restrição é
   conservadorismo nosso.
3. **Uma resposta positiva não liga a exibição sozinha.** Ela remove um dos três
   pré-requisitos nomeados no ADR; os outros dois — `verbatim-excerpt` no
   `allowedUses` e um leitor desse direito na camada de apresentação — continuam
   sendo trabalho de engenharia com decisão de produto na frente.
