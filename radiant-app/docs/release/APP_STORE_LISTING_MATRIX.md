# Matriz de listing da App Store

> **Reconciliada em 2026-08-04.** A versão de 2026-04-09 tratava `pt-BR` e
> `en-US` como mercados de primeira classe, declarava o título `Radiant` (que
> estava indisponível), trazia um subtítulo de 46 caracteres contra o teto de 30
> e notas para o revisor que prometiam login de conta e retomada de sync. A
> hipótese de posicionamento sobreviveu; os valores, não.

## Regra de uso

- a **fonte de copy aprovada** é
  [`docs/store/textos-loja-pt-BR.md`](../../../docs/store/textos-loja-pt-BR.md);
  esta matriz é a leitura de posicionamento, não uma segunda fonte de valores;
- qualquer mudança de listing declara hipótese e janela de leitura;
- listing não muda sem alinhamento com a abertura, o valor inicial e a qualidade
  técnica medida;
- screenshots e captions contam a mesma história que o app entrega.

## `pt-BR` — mercado da v1.3

### Posicionamento

- Promessa: um método claro para estudar radiologia
- Resultado: aprender em blocos curtos e fixar por revisão espaçada
- Hipótese: o ângulo de **método** (trilha guiada + revisão), com
  offline/sem-conta como redutor de dúvida, converte melhor do que copy carregada
  de features
- Disciplina de alegação: nenhum número, depoimento ou promessa clínica — o app
  não tem prova para isso e a categoria é Educação, não Medicina

### Valores

Os campos digitáveis vivem em
[`APP_STORE_METADATA.md`](APP_STORE_METADATA.md), com o nome de ficha
`Radiant — Radiologia` e o subtítulo de 27 caracteres. Duplicá-los aqui foi o
que permitiu que as duas cópias divergissem por quatro meses.

### Narrativa dos screenshots

Seis telas, na ordem em que existem em `docs/store/assets/screenshots-ios-67/`
e `-65/`:

1. `01-home` — comece com uma trilha clara
2. `02-licao` — aprenda em blocos curtos
3. `03-quiz` — teste seu raciocínio
4. `04-checkpoint` — feche a etapa e veja o progresso
5. `05-conquista` — a conquista marca a unidade fechada
6. `06-progresso` — acompanhe XP, sequência e revisões

A narrativa tem **seis** itens porque os assets são seis. A versão anterior
listava cinco, e a diferença nunca foi notada porque nada comparava as duas
coisas.

### Notas para o revisor

Fonte única em [`APP_STORE_METADATA.md`](APP_STORE_METADATA.md).

## `en-US` — fora do escopo da v1.3

O registro na App Store foi criado em pt-BR e não existe copy revisada em
inglês. Traduzir a ficha sem revisão de domínio produziria alegação clínica
acidental no idioma que a App Review lê melhor. Entra quando houver copy própria.

## Campos obrigatórios por mudança

- Locale afetado:
- Hipótese:
- Sinal principal: discoverability | conversion | habit | reputation
- Asset ou metadata alterado:
- Janela de leitura:
- Decisão esperada: escalar | iterar | conter | reverter
