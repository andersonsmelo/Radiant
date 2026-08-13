# Metadata da App Store

> **Reconciliado em 2026-08-04.** Os valores anteriores eram de 2026-04-09 e
> três deles não podiam ser usados: o subtítulo pt-BR tinha **46 caracteres**
> contra o teto de **30** — nunca poderia ser digitado no console —, o en-US
> tinha 42, e as notas para o revisor declaravam à App Review que a build
> suportava entrar com conta e retomava a sincronização quando a rede voltasse,
> as duas falsas para o binário distribuído. O `scripts/qa/docs-contract.mjs`
> agora mede os tetos e deriva as capacidades do `eas.json` e do `app.json`.
>
> As duas frases retiradas foram **descritas, não citadas**: a guarda casa com a
> afirmação onde quer que ela apareça, e não sabe distinguir uma citação
> histórica de uma declaração viva. Abrir exceção para texto citado seria abrir
> a porta que ela existe para fechar. Quem precisar do literal encontra em
> `git show 847a12d`.

## Uso deste documento

Esta é a camada operacional: o que se digita no App Store Connect. A **fonte de
copy aprovada** é
[`docs/store/textos-loja-pt-BR.md`](../../../docs/store/textos-loja-pt-BR.md);
divergiu, a fonte ganha. A matriz de posicionamento é
[`APP_STORE_LISTING_MATRIX.md`](APP_STORE_LISTING_MATRIX.md), e a política de
timing de review e monetização é
[`RATING_AND_PAYWALL_TIMING.md`](RATING_AND_PAYWALL_TIMING.md).

## Nome na ficha

`Radiant — Radiologia`.

Não é o `Radiant` puro que a fonte de copy sugere: `Radiant` estava
**indisponível** na App Store, e o registro foi criado em 2026-08-01 com o mesmo
título público do Android (task A3). SKU interno `RADIANT-IOS-001`.

## Metadata base `pt-BR`

- Subtitle:
  `Radiologia: estude e revise`
- Promo text:
  `Uma trilha clara para estudar radiologia: lições curtas, quizzes e revisão espaçada que fixam o conteúdo. Funciona offline e sem login — estude no seu ritmo.`
- Keywords:
  `radiologia,estudo,medicina,raio-x,anatomia,quiz,revisão,residência,imagem,tórax,abdome,aprender`

A descrição longa e as notas de versão vivem na fonte de copy e precisam ser
**convertidas de Markdown para texto limpo** antes de colar no console.

`en-US` fica fora da v1.3: a ficha foi criada em pt-BR e não há copy revisada em
inglês. Um segundo idioma entra com copy própria, não com tradução de template.

## Notas para o revisor

`Radiant is an educational radiology study app and works local-first: the study path, quizzes, spaced review and progress all run on device, with no network and no account required, so the reviewer is never asked to sign in. Telemetry stays on the device in this build and no analytics or crash data leaves it. The content is study material and carries an educational disclaimer; it is not a clinical tool and gives no medical advice.`

Toda afirmação acima é verificável no binário. Uma nota para o revisor que
descreva capacidade ausente é o pior lugar possível para uma afirmação vencida.

## Alinhamento de ASO

- cluster de palavras-chave: estudo de radiologia, quiz, revisão;
- os screenshots publicáveis contam a trilha, a lição, o quiz, o checkpoint, a
  conquista e o progresso — seis telas, nos dois buckets de iPhone;
- o texto promocional segue a promessa de método de estudo, não hype de
  aquisição;
- mudança de metadata declara hipótese, locale e janela de leitura (campos no
  fim da matriz).

## Higiene da ficha

- conferir o comprimento do subtítulo na pré-visualização de iPhone — é a única
  família de dispositivo da v1.3;
- conferir a ordem das keywords contra o plano de ASO antes de submeter;
- manter as notas para o revisor sincronizadas com o runtime da build candidata;
- validar `pt-BR` antes do sign-off de release.
