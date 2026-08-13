# Desenho — marca de primeiro frame útil para o gate H3

**Data:** 2026-08-10
**Estado:** aprovado pelo dono em 2026-08-10; implementado em
`run-1786392781118-5b1f744b`
**Escopo:** instrumentação e relatório. Nenhum build, OTA ou publicação.

## Por que existe

O gate de cold start da H3 mede a duração do comando `launchApp` do Maestro. Num
Dev Client esse comando **termina no launcher, antes de o bundle JS ser buscado e
avaliado**. O kernel de checkpoints é JavaScript. Logo a métrica não pode observar
o que o gate existe para proteger, e isso não é opinião: onde o kernel pode
aparecer — Home→Lição, com o app carregado — o delta é pequeno e conclusivo,
enquanto o cold start tem amplitude interna de ~835 ms e piso de ruído que chegou
a 2863 ms num host em swap.

Duas correções entraram em 2026-08-10 e nenhuma resolve isto:

1. o limiar passou a incluir o piso de ruído medido (`baseline_p95 - baseline_p50`),
   eliminando a reprovação por ruído;
2. o gate ganhou um terceiro desfecho, `inconclusive`, eliminando o passe vazio.

As duas tornaram o gate **honesto**. Nenhuma torna a métrica **significativa**:
mesmo um verde conclusivo continuaria dizendo pouco sobre o kernel.

## O que muda

Uma marca de primeiro frame útil, emitida pelo app, medindo a janela JS que
**contém** o kernel.

### t0 — origem da janela

**Corrigido durante a implementação, e a correção importa.** O desenho original
dizia `global.__BUNDLE_START_TIME__`. Ele foi **recusado**: aquele valor vive numa
base de tempo diferente de `performance.now()`, e subtrair as duas produziria um
número com cara de duração e sem significado — bug de unidade, não de precisão.

A origem é lida com o **mesmo relógio** do fim da janela, no momento em que o
módulo emissor é avaliado. Para um **delta entre duas coortes no mesmo binário**,
consistência da base de tempo vale mais que completude da janela: o que se perde é
a avaliação de bundle anterior a esse módulo, e ela se perde **igualmente nas duas
coortes**, então não entra no delta.

### t1 — primeiro frame útil

O frame seguinte a `startupPhase` virar `'ready'` em `RootLayout`, obtido com
`requestAnimationFrame` dentro do efeito que observa `ready`.

Este ponto não é arbitrário. `ready` só acontece depois de:

- `BetaService.checkAccess` quando o gate de beta se aplica;
- o `Promise.all` de bootstrap;
- **`getNativeActiveCheckpointRuntime(checkpointMode).inspectLaunch(...)`**, que é
  o trabalho de partida do kernel.

Então o kernel está dentro da janela **por construção**, não por sorte. A
armadilha que a literatura de TTI nomeia — marcar quando montou em vez de quando
está de fato utilizável — é evitada por medir `ready`, não a montagem.

### Independência de modo

A marca é emitida em **todos** os modos do kernel. Ela é gated apenas em
`APP_ENV === 'development'` e `EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE`, nunca
em `runtimeMode`.

É esse ponto que faz a coorte de comparação existir. A rota da marca de primeiro
frame havia sido descartada em 2026-08-10 com o motivo "o probe só liga em
`active`, então o baseline `off` nunca produziria a coorte". O motivo é correto
**sobre o probe de checkpoint** e não se aplica a um timestamp genérico de
inicialização, que não é dado de checkpoint e não toca store nenhum.

Consequência operacional: a coorte baseline passa a rodar com
`EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE=true` e
`EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE=off`. O probe de checkpoint continua
desligado nessa combinação porque exige `runtimeMode === 'active'`.

### "Off silencioso" fica verificado, não assumido

Hoje a garantia é uma afirmação sobre construção: o probe está desabilitado e não
pode emitir. Passa a ser uma asserção do relatório:

- o baseline emite exatamente `first_frame`;
- **se um log de baseline contiver qualquer métrica de checkpoint
  (`persistence`/`restoration`), o relatório falha fechado** com razão própria.

Isso é mais forte que antes. A contaminação por replay de buffer do CDP já
aconteceu em 2026-08-10 — duas linhas `"mode":"active"` num log de baseline — e
naquele momento nada no relatório a pegaria, porque o baseline não era lido.

## Envelope

Mesmo prefixo e mesma forma fechada de quatro chaves do probe existente:

```json
{"schemaVersion":1,"metric":"first_frame","mode":"off","durationMs":812.4}
```

Sem id, conteúdo, PII, PHI, caminho ou identificador de aparelho.

## Relatório

- `buildCheckpointPerformanceReport` passa a receber `baselineLog`. Ele **já é
  coletado** por `collectArtifactEvidence` e hoje é descartado em `main()`;
- novo gate `first_frame_delta`, com a mesma lógica de três desfechos e o mesmo
  teto de ruído de um quinto do p95 do baseline;
- `cold_start_delta` continua calculado e reportado com seu `outcome`, mas sai do
  veredito (`report.passed`), com a razão escrita no código: mede uma janela em
  que o kernel não existe. Decisão do dono em 2026-08-10; reversível numa
  constante;
- gates informativos ficam explícitos no relatório (`advisory: true`), para que
  nenhum leitor precise saber de cor quais entram no veredito.

## Limite declarado

A métrica **exclui o lançamento nativo**. Uma regressão puramente nativa fica
invisível para ela. Isso é aceitável nesta onda porque o kernel é JavaScript e a
onda não altera o lado nativo — e é registrado como limite, não omitido.

Medir o lançamento nativo exigiria `react-native-performance`, isto é módulo
nativo, isto é **binário novo**: quebraria a regra de mesmo-binário do gate e
exigiria autorização de build. Fora de escopo por decisão, não por esquecimento.

## Testes

Unidade, no emissor:

- emite uma única vez por lançamento, mesmo se o gatilho repetir;
- emite nos dois modos, `off` e `active` — é a asserção que sustenta a coorte de
  comparação;
- silencioso quando desabilitado, sem chamar o relógio;
- duração negativa ou não finita não emite;
- falha do emissor não propaga para o caminho de aprendizagem.

Relatório:

- `first_frame_delta` fecha os três desfechos com as mesmas regras;
- log de baseline contaminado com métrica de checkpoint **reprova**;
- `cold_start_delta` fora do veredito: relatório verde com cold start
  `inconclusive`;
- amostra insuficiente de `first_frame` reprova, como nos outros.

Cada regra nova provada por mutação, no padrão já estabelecido no arquivo.

## O que este desenho não entrega

A medição em si. Depois disso, as duas coortes ainda precisam rodar — e a
expectativa é que a dependência de host silencioso caia muito, porque a janela é
medida dentro do app, na classe de dispersão das medidas que já são conclusivas
(persistência 23,1 ms e restauração 9,0 ms de p95, contra limites de 75 e 100).
Essa expectativa é hipótese até a coorte existir, e está escrita aqui como
hipótese.
