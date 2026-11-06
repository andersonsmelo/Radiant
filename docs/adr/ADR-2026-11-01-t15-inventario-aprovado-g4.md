# ADR — Aprovação G4 do inventário T15-v1

**Data:** 01/11/2026, America/Bahia. **Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa.
**Decisão literal**, em resposta à entrega concreta do inventário:

> siga conforme recomendação

## Objeto aprovado

[Inventário T15-v1](../superpowers/plans/2026-10-25-retirada-e-recomeco-inventario.md),
450 arquivos existentes e dois caminhos futuros, publicado na
[PR #66](https://github.com/andersonsmelo/Radiant/pull/66), commit
`b20943ab7fa9183257361a10b0c488a559ddb29a`.
SHA256 do arquivo aprovado:
`2f299f7b1e5a5d9a9fd1fc5a2cd712f6050bd085fbefe4c5e375d1e40487574f`.

A resposta aceita a recomendação apresentada: propostas nominais de retirada
condicionada dos dados antigos; preservação de biblioteca, extrações, taxonomia,
registro de direitos e motores reutilizáveis; separação dos arquivos mistos H4/L1
antes da retirada; preservação dos controles genéricos e adaptação dos alvos dos
validadores ao substituto. **G4 está APROVADO para essa recomendação concreta.**
Não solicitar novamente a aprovação dessa mesma versão/hash.

O inventário permanece com bytes idênticos ao objeto aprovado. Seu texto de
G4 pendente descreve o instante anterior à decisão; esta ADR e o STATUS registram
a decisão posterior. Uma nova proposta material exige versão/hash próprios.

## Consequência para T19 e limites da aprovação

A §4 do [integrador](../plans/2026-10-25-medalhao-pendencias-e-fechamento.md)
ordena T19–T21 **após inventário aprovado e contrato do currículo novo disponível**.
A §7 do inventário propõe particionar fundação/biblioteca e substituir alvos
Wave1/produção/ancoragem/fixtures; o diff nominal dos comandos depende dos dados,
IDs e da geração substitutos. Esses elementos continuam **G7 pendente**.

Por isso, registrar G4 não permite hoje retirar controles que ainda validam o
catálogo ativo, nem substituí-los por checks de um currículo não definido.
T19 foi conferida somente como elegibilidade; sua execução permanece pendente
do contrato G7. Os 15 validadores, CI, context.excludes e allowedRoots atuais
continuam intactos. Nenhum enfraquecimento ou janela de política foi aplicado.
G4 dispensa nova aprovação da recomendação; o diff futuro deve respeitar seus
limites e todas as pré-condições nominais de T19.

**SAI** continua condicionado ao substituto e à separação dos motores; não é uma
ordem de apagar agora. Onde a lista manteve alternativas de destino histórico,
aprovar a recomendação não escolhe silenciosamente uma exclusão irreversível.
O destino exato deve ser concretizado no escopo nominal antes de T21. Histórico
SQL/evidências permanece preservado; execução de banco tem autorização própria.

T20 continua exigindo geração/IDs aprovados, idempotência, restore filtrado e
preservação de XP, sequência, vidas, assinatura e preferências; T21 exige T19/T20,
lote substituto e autorização nominal de retirada; T22 verifica o catálogo novo.
Nenhuma dessas tarefas foi implementada por este registro. G2/T14, G7 e G8
não foram aprovados por associação. G1=A/Q1 permanece decidido; T13 nativo
0/7 NOT_VERIFIED, observação T18 e simulador reservado continuam preservados.
Não houve remoção, migração, política alterada, build, instalação, merge ou loja.

## Evidência e próxima ação

Base e hash foram reconfirmados antes da escrita, árvore limpa e PR aberta,
com checks do mesmo commit: [Content 41368497475](https://github.com/andersonsmelo/Radiant/actions/runs/41368497475)
e [App Quality 41368497477](https://github.com/andersonsmelo/Radiant/actions/runs/41368497477)
SUCCESS. Esses checks são da entrega T15; esta decisão documental tem validação própria.
Run próprio deste registro: `run-1793582025306-57336807`.

Próxima dependência da sequência de conteúdo: definir com Anderson o contrato
G7 (currículo/formato, IDs/geração e lote substituto), no projeto previsto pela
ADR de 21/10. Depois produzir o diff nominal T19 preservando os controles aceitos;
não inventar currículo/IDs para destravar o gate. As frentes independentes do
layout mantêm seus próprios gates no STATUS, sem início automático neste registro.

## Revisão do registro

Revisão independente `/root/g4_review`, 01/11/2026: **Spec PASS / Qualidade APPROVED**,
sem achados acionáveis. Reconfirmados hash imutável, vínculo da decisão G4, condição
G7 de T19, preservação das alternativas de destino, sete apontadores e movimentação
verbatim do STATUS antigo. Revisor somente leitura, sem testes/fullgate/Loop.
Contrato documental focal do controlador: **18/18 PASS**, mais docs-contract PASS;
links da ADR e hash aprovado conferidos. A final configurada é registrada pelos
eventos/evidências próprios do run acima; os checks da base não a substituem.
