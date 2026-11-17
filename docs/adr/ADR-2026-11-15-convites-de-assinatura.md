# ADR 2026-11-15 — Convites de assinatura (F8 da 1.6)

**Data:** 2026-11-15. **Decisor:** Claude (Opus 5.5), na frente F8, pela delegação
de decisões de construção que o dono (Anderson Melo) deu ao controlador da 1.6 em
2026-11-13. **Ligar a chave em produção é decisão do dono.**

## Contexto

O [levantamento](../evidence/2026-11-15-f8-conversao/levantamento.md) mediu no código
que o assinante do "Radiant Ilimitado" ganha uma coisa só: vidas ilimitadas. Nenhuma
aula, revisão ou avaliação é exclusiva, e a proteção de sequência vale igual para o
gratuito. Antes desta frente, o único convite era o link "Vidas ilimitadas" na folha
de vidas e o cartão nos Ajustes.

## Decisão

1. **Chave nova, desligada.** `ENABLE_CONVERSION_PROMPTS`
   (`EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS`, padrão `false`). Desligada, o app é o da
   `main`: nenhum texto novo e nenhuma escrita em disco. Isso está provado por
   contraprova em teste, vista falhando com o defeito injetado.
2. **Dois momentos, ambos já pausas existentes:**
   - **sem vidas:** o convite entra na folha de vidas, quando ela abre com zero vidas
     **numa pausa**: na aula, depois do retorno do item, entre um passo e outro; na Estude,
     pelo contador do cabeçalho. "Revisar agora" e "Voltar" continuam lá. A folha que barra
     uma resposta (o aluno confirma sem vidas) e a folha da avaliação, com o item pendente,
     **não convidam** (achado 1 da revisão);
   - **fim de unidade:** uma linha e um link na comemoração. "Continuar" segue como a
     ação principal.

   O convite nunca abre tela própria e nunca aparece no meio de uma questão. Cada tela
   diz à folha se ela abriu numa pausa (`inviteAllowed`), e o padrão é não convidar.
3. **Sequência em risco não recebe convite.** A assinatura não protege a sequência,
   e o convite prometeria o que o código não entrega.
4. **Frequência:** no máximo um convite por dia local, somando os dois momentos.
   Nunca para assinante, para pedido pendente (Ask to Buy) ou sem loja no aparelho.
   A folha reaberta no mesmo dia volta ao link de sempre.
5. **Comparação verdadeira na tela de assinatura.** A tabela gratuito × assinante é
   montada das constantes de `HeartsService` (5 vidas, uma volta a cada 30 min, a
   revisão devolve 1). Ela diz que errar em aula ou avaliação **pode** gastar uma vida e
   que a revisão nunca gasta, porque a aula híbrida não cobra o primeiro contato
   (achado 3). A linha das aulas diz "Todas" nos dois planos.
6. **Amostra única.** Na folha sem vidas, quem nunca assinou pode experimentar uma vez
   (por instalação; o texto diz "Só uma vez") 30 minutos de vidas ilimitadas, pelo `setUnlimited` que já existe. Pela
   regra de fim de ilimitado que já existe, as vidas voltam cheias depois, e o convite
   diz isso. Ex-assinante não recebe amostra, porque a releitura da assinatura
   expirada a apagaria.
7. **Funil só local.** A chave `@radiant:conversion_v1` (classe `controle` no inventário)
   conta seis eventos: convite visto (sem vidas, fim de unidade), tela aberta, compra
   iniciada, compra concluída e amostra usada. O dono lê os números no console de
   desenvolvimento. Nada é enviado para fora. O dia só é consumido quando o convite chega
   à tela, e as escritas vão em fila, para contagens simultâneas não se perderem.
   Limites conhecidos:
   - "tela aberta" conta toda abertura, inclusive pelos Ajustes e por quem já assina;
   - "compra concluída" não conta um Ask to Buy aprovado depois;
   - o cartão do console aparece mesmo com a chave desligada, e diz isso. Ele só existe
     com `SHOW_DEV_TOOLS`.
8. **Fim das vidas ilimitadas com a tela aberta.** A aula e a avaliação releem as vidas
   quando `unlimitedUntil` vence. Sem isso, a amostra acabava no meio da aula com o HUD
   ainda em ∞, e a vida perdida em seguida não era anunciada (achado 2). Para a
   assinatura (datas além do limite do timer), continua valendo a releitura que já existia.

## Proibido

- Urgência, contagem regressiva, "só hoje", desconto que não exista no StoreKit, culpa.
- Preço no convite. Preço só na tela de assinatura, vindo do StoreKit, nunca escrito no código.
- Botão de recusa escondido, e convite que bloqueie o estudo gratuito.
- Mudar produtos, preços, grupo ou qualquer item do App Store Connect, ou a regra das vidas.
- Dizer que o conteúdo foi "revisado por especialista".

## Consequências

- Para ligar, o dono define `EXPO_PUBLIC_ENABLE_CONVERSION_PROMPTS=true` no perfil de build
  ou no OTA. Recomendação: ligar primeiro no TestFlight e ler o funil no console.
- A compra em sandbox não foi vista por esta frente; quem liga confere antes.
- O funil não distingue aparelhos nem pessoas: é a contagem de um aparelho.

## Adendo de 2026-11-17 — a comparação ficou com uma linha

**Decisor:** Anderson Melo, ao aprovar em 2026-11-16 a prancheta e a
[spec do refinamento visual](../superpowers/specs/2026-11-16-refinamento-visual-1-6-design.md)
(seção 7.6). **Estado:** na branch `claude/refinamento-1-6-desenho`, ainda fora da
`main`.

O item 5 da decisão descreve uma tabela gratuito × assinante. Com o refinamento:

- não há mais tabela nem colunas "Gratuito" e "Assinante"; a comparação mostra só a
  linha em que os planos diferem, com os títulos "Vidas" e "Com o Ilimitado";
- saíram a linha "Revisão concluída" e a linha das aulas, que dizia "Todas" nos dois
  planos; no lugar da segunda, a tela diz "Aulas, revisões e avaliações continuam
  gratuitas.";
- o texto do assinante passou de "Ilimitadas: errar não gasta vida" para "Sem
  limite";
- com a chave ligada, a abertura "Errar não custa vida." aparece junto com a
  comparação.

Continua valendo: os números vêm de `HeartsService`, errar "pode" gastar uma vida, a
revisão nunca gasta, e nada do que está em "Proibido" mudou.
