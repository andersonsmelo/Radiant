# Preparo do envio da 1.6 às lojas — medido em 2026-11-17

Lista do que está pronto e do que falta para enviar a 1.6 à App Store e ao Google Play.
Escrita pelo agente a pedido do dono. Cada linha diz de quem é o passo. No App Store
Connect e no Play Console quem edita é o dono; o agente confere pela página.

## App Store (iOS)

**Atualização de 2026-11-18:** a 1.6.0 (18) foi enviada à revisão às 15:43 UTC, com o
placar da liga no mesmo envio e as seis capturas novas de 6,5". A tabela abaixo é a
foto de 2026-11-17; o estado vivo está no `STATUS.md`.

| Item | Estado | De quem |
| --- | --- | --- |
| Código na `main` | Pronto: `abd9c7f8`, com o refinamento visual e o texto novo da apresentação | — |
| Build de produção | **1.6.0 (18) em compilação no EAS** na última leitura; envio ao App Store Connect agendado. A 17 e a 16 não servem: são anteriores ao texto novo | agente dispara, dono confere no TestFlight |
| Ver a build no aparelho | Não feito | dono |
| Compra em sandbox com os convites ligados | Não feito | dono |
| Versão 1.6.0 no App Store Connect | **Criada pelo agente em 2026-11-17**, por ordem do dono, depois de o dono aceitar a nova versão do contrato de apps pagos. Estado lido na página: "Preparar para envio" | feito |
| Placar `radiant.liga.semanal.xp` adicionado à versão | Não feito; **precisa entrar antes do envio** | dono |
| Capturas de iPhone | Prontas: [6,7"](assets/screenshots-ios-67/) e [6,5"](assets/screenshots-ios-65/) | dono sobe |
| Captura de revisão da assinatura | Pronta: [arquivo](assets/assinatura-revisao.png) | dono sobe |
| Novidades da versão | **Coladas e salvas em 2026-11-17** | feito |
| Descrição, texto promocional e keywords | **Colados e salvos em 2026-11-17**, com a frase da assinatura corrigida para citar as decorações exclusivas. Notas do revisor trocadas para a 1.6.0 | feito |
| Política de privacidade | No ar com a seção do Game Center desde 2026-11-16 | — |
| Página de suporte | A de 2026-07-29 | dono decide se atualiza |
| Imagem de abertura | Continua com o Pixel antigo | dono decide a arte |

Ordem do envio que funcionou na 1.4.0 e está no `AGENTS.md`: montar o rascunho de envio
pelas assinaturas e pelo grupo, com a versão por último, e nunca "Criar novo envio".

## Google Play (Android)

O Play **não está em produção**: a última leitura, de 2026-08-24 e vencida, é a
`1.3.0 (4)` em teste fechado (`alpha`). Subir a 1.6 ao Play é, na prática, o primeiro
lançamento público do Android.

| Item | Estado | De quem |
| --- | --- | --- |
| Estado real no Play Console | **Não medido desde 2026-08-24.** Só se lê abrindo o console | dono abre, agente confere |
| Build de produção do Android | **Não existe para a 1.6.** A última do EAS é a `1.3.1`, de 2026-08-04 | agente dispara, se o dono mandar |
| Envio pelo EAS | **Não dá hoje:** `radiant-app/credentials/play-service-account.json` não está na máquina. Sem a chave, o `.aab` sobe à mão pelo console | dono põe a chave ou sobe o arquivo |
| App visto no Android | Só a primeira aula, a trilha e o perfil, em emulador, no cliente de desenvolvimento (2026-11-17). Nada em aparelho físico, nada no binário de produção | — |
| Fonte dos títulos | Nas capturas do emulador os títulos grandes parecem sair na fonte do sistema, não na Sora. **Não investigado** | agente investiga, se o dono mandar |
| Capturas do Play | Prontas: [pasta](assets/screenshots/), seis em 1080×1920 | dono sobe |
| Descrição longa e curta | Rascunho novo em [textos-loja-pt-BR.md](textos-loja-pt-BR.md), sem liga, widget nem assinatura | dono aprova e cola |
| Segurança dos dados e classificação | Documento de 2026-08 em [DATA_SAFETY_E_CLASSIFICACAO.md](DATA_SAFETY_E_CLASSIFICACAO.md); **não reconferido contra a 1.6** (lembretes personalizados, por exemplo) | agente reconfere, dono preenche |
| Exigência de teste fechado antes da produção | Não medido. Contas pessoais novas do Play costumam precisar de um período de teste fechado com testadores antes de liberar produção; confirme no console | dono |

**O que a 1.6 do Android não tem, por construção:** a liga semanal (Game Center), os
widgets e a venda da assinatura. As vidas existem e acabam; sem a assinatura, o aluno do
Android não tem como tirar o limite. Isso é decisão de produto, não defeito.

## O que o agente pode fazer sem o dono no console

- Disparar a build de produção do Android no EAS e entregar o `.aab`.
- Investigar a fonte dos títulos no Android.
- Reconferir o documento de segurança dos dados contra a 1.6.
- Conferir pela página, depois de cada clique do dono, o rascunho de envio da Apple.
