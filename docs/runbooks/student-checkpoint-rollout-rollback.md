# Runbook — rollout e rollback do kernel de checkpoints

**Data:** 2026-08-09  
**Estado:** normativo; runtime local existe, gate interno ainda não executado

## Objetivo

Ativar o kernel progressivamente sem perda de progresso, duplicação de efeitos,
mudança silenciosa de jornada ou coleta proibida. Este runbook não autoriza
publicação; ele define gates para uma autorização futura.

## Papéis

- **engenharia:** implementa, valida, mede shadow e prepara rollback;
- **revisor pedagógico/clínico:** valida checkpoint e reforço;
- **revisor de privacidade:** valida allowlist e transmissão;
- **dono:** autoriza promoção editorial e publicação;
- **lojas:** gates externos independentes.

## Pré-flight de toda onda

1. ler status canônico, fila, roadmap e ADR;
2. confirmar worktree e estado do run Loop;
3. registrar versão do app, perfil, plataforma e catálogo;
4. confirmar backup/rollback do catálogo quando a onda o tocar;
5. executar testes focados e completos sem E2E concorrente;
6. confirmar que nenhum payload proibido aparece em store, log ou evento;
7. registrar evidência e atualizar o status sem promover a próxima onda por
   inferência.

## Onda 1 — Governança

Gate:

- spec, plano, ADR, privacidade e runbook versionados;
- arquitetura, fluxo, fila, roadmaps e status coerentes;
- declaração explícita de que nenhum runtime foi implementado;
- produção `1.3.1 (7)` intocada.

Rollback: reverter somente a mudança documental antes de qualquer implementação.

## Onda 2 — Fundação em `off`

Pré-condições:

- contratos e schemas revisados;
- chaves ativo/shadow diferentes;
- modo inválido resolve para `off`;
- journal grava `CommitOperationV1 + CommitIntentV1` junto antes dos efeitos;
- os três intents fechados — lição, review e checkpoint de unidade — têm
  fixtures de replay sem resposta/texto/PII;
- idempotência por `operationId` coberta em todos os serviços, com recibo no
  mesmo registro/transação do efeito.

Gate:

- regressão byte-equivalente do estado legado;
- crash injection antes do journal, antes de cada efeito, depois de
  efeito+recibo/antes do marcador e antes/depois do enqueue;
- fronteiras separadas de attempt, evidence, mastery, review, XP, goal e journey
  usam recibo `operationId+effectKind`;
- a janela efeito confirmado antes do recibo é impossível por construção;
- relaunch lê a intenção imutável e termina sem depender da UI ou de outro
  store não confirmado;
- corrupção, versão futura, expiração somente de estado efêmero e storage
  indisponível cobertos;
- fato confirmado/outbox sem ack sobrevive a relógio avançado, compactação e
  relaunch;
- cancelamento só antes do primeiro efeito; depois dele a saga reconcilia até o
  terminal obrigatório exatamente uma vez;
- nenhum efeito de navegação ou sync.
- na 20ª falha automática, operação pausa com próximo passo intacto; retry
  explícito incrementa época/zera contador e Home não cancela efeito iniciado.

Rollback: fixar modo `off`. Não apagar store, evidência ou commits pendentes.

## Onda 3 — Shadow

Ativação:

- `preview=shadow`;
- `production=off`;
- habilitar uma superfície por vez na matriz de cobertura;
- guardar somente divergência sanitizada por código.

Gate para sair de shadow:

- zero divergência determinística;
- zero payload recusado fora de testes;
- no mesmo aparelho/perfil e com ≥20 execuções antes/depois, delta de p95 para
  cold start/Home→Lição
  `novo_p95 - baseline_p95 <= max(0,05 × baseline_p95, 50 ms, baseline_p95 - baseline_p50)`.
  **O terceiro termo entrou em 2026-08-10, medido.** Na primeira execução real do
  gate a amplitude interna do cold start foi 838 ms no baseline e 833 ms no
  candidato, contra 167,6 ms permitidos pelos dois primeiros termos: um limiar
  cinco vezes menor que a dispersão da própria medida reprova por ruído, qualquer
  que seja a mudança sob teste — e reprovou. A cauda superior medida do baseline é
  o piso de resolução do instrumento. Onde a medida é estável esse termo é zero e
  os dois originais continuam mandando, então o gate **não** afrouxa onde já era
  significativo;
- **o delta só conta quando a medição conclui, e isso é um desfecho separado,
  também de 2026-08-10.** O termo de ruído acima elimina a reprovação espúria e,
  num host que degrada, troca-a por um **passe vazio**: com o piso de ruído em
  2863 ms contra um p95 de baseline de 5748 ms, o relatório fecha em
  `passed: true` sem distinguir regressão de flutuação. O gate passou a ter três
  desfechos — `pass`, `fail` e `inconclusive` — e devolve
  `inconclusive`/`measurement-too-noisy`, falha fechada, quando
  `piso_de_ruído > 0,2 × baseline_p95`, isto é quando a medição perdeu mais de
  quatro vezes a sensibilidade de 5% que este gate especifica. `inconclusive`
  **não** autoriza nem reprova o produto: manda remedir com o host ocioso. Ler
  `passed: true` sem ler `outcome` é o modo documentado de promover uma onda com
  base numa medição que não mediu;
- storage sem crescimento além de 30 dias/500 entradas.

Rollback: desligar shadow e, se necessário, remover apenas o store shadow. Nunca
alterar progresso legado.

## Onda 4 — Active interno

Ativação inicial:

1. build interna somente;
2. liberar apresentação;
3. liberar Lição;
4. liberar Revisão;
5. liberar checkpoint de unidade;
6. manter as demais superfícies com fallback Home;
7. oferecer CTA; não redirecionar automaticamente.

Pré-flight sem gerar build:

```bash
npx --no-install eas-cli config -p ios -e checkpoint-internal --json --non-interactive
npx --no-install eas-cli config -p android -e checkpoint-internal --json --non-interactive
```

Nos dois envelopes, exigir `distribution=internal`, `developmentClient=true`,
`EXPO_PUBLIC_APP_ENV=development`, `EXPO_PUBLIC_STUDENT_CHECKPOINT_MODE=active`
`EXPO_PUBLIC_STUDENT_CHECKPOINT_PERFORMANCE=true` e
`EXPO_PUBLIC_ENABLE_REMOTE_SYNC=false`. iOS simulator usa o profile derivado
`checkpoint-internal-simulator`. Depois que o dono autorizar e prover o build
interno, executar no aparelho/perfil de evidência:

```bash
maestro test .maestro/student-checkpoint-active-resume.yaml
```

Não confundir esse flow único com o gate: as 20 execuções, p95 e leitores de
tela precisam de registro datado separado.

O procedimento reproduzível, incluindo baseline `off` e candidato `active` no
mesmo binário/perfil, está em `radiant-app/docs/E2E_RUNBOOK.md`. Cold start e
Home→Lição são derivados do `commands.json` do Maestro; só
persistência/restauração geram log local no app, com quatro campos fechados e
sem identificadores. `npm run checkpoint:performance-report` falha fechado
para amostra incompleta ou envelope inválido.

Gate:

- mínimo de 20 execuções no mesmo aparelho e perfil;
- persistência p95 ≤75 ms e restauração p95 ≤100 ms;
- kill/relaunch offline sem duplicação;
- duas falhas levam a checkpoint invalidado + Home;
- VoiceOver/TalkBack e viewport curto sem bloqueio.

**Executado em 2026-08-10 — onda CONTINUA ABERTA.** Quatro runs naquele dia;
evidência consolidada em
[`2026-08-10-wave-4-student-checkpoint-h3-gate.md`](../../radiant-app/docs/evidence/2026-08-10-wave-4-student-checkpoint-h3-gate.md).
Estado item a item, na medição que vale — a reexecução no build corrigido
(`run-1786366830631-0755376c`), relida sob o desfecho de três valores:

| item do gate | resultado |
| --- | --- |
| 20 execuções no mesmo aparelho/perfil | cumprido — 20/20 e 20/20 |
| persistência p95 ≤75 ms | **23,1 ms**, 43 amostras — `pass` |
| restauração p95 ≤100 ms | **9,0 ms**, 20 amostras — `pass` |
| delta Home→Lição | **+152 ms** contra 591 — `pass` |
| delta cold start | **`inconclusive`** — piso de ruído 2863 ms contra teto de 1149,6 ms |
| kill/relaunch offline sem duplicação | retomada provada 20 vezes; **não-duplicação não é afirmada** por nenhum flow |
| duas falhas → checkpoint invalidado + Home | **não exercitado** |
| VoiceOver/TalkBack/viewport curto | P0 de Dynamic Type **fechado com prova em aparelho** em AX4/AX5; VoiceOver, TalkBack e viewport fisicamente curto **sem evidência** |

O bloqueio de acessibilidade que era trigger de rollback imediato — a tela de
retomada perdia os dois botões a partir de `accessibility-extra-extra-large`,
sem `ScrollView` para alcançá-los — **está fechado** (`run-1786366083722-93ee4bf4`,
prova de rolar-e-tocar em AX4 e AX5).

O que mantém a onda aberta, em ordem:

1. **o delta de cold start não tem medição conclusiva.** O instrumento foi
   corrigido duas vezes em 2026-08-10 — primeiro o limiar consciente de ruído,
   depois o desfecho `inconclusive` — e o que falta agora é uma passagem com o
   host ocioso, sem sessão de agente rodando, cujo piso de ruído caiba no teto.
   O limite estrutural continua registrado: `launchApp` num Dev Client termina
   antes de o bundle JS existir, então o kernel não vive na janela medida, e onde
   ele pode aparecer — Home→Lição — o delta é conclusivo e pequeno;
2. **VoiceOver como serviço, TalkBack e viewport curto** seguem sem evidência;
   TalkBack exige Android. Para o viewport, a razão registrada até 2026-08-10 —
   ausência de device type SE — foi **medida como falsa**: o runtime iOS 26.5
   suporta `iPhone SE (3rd generation)` e os dois `mini`, então o teste em
   simulador curto está alcançável e apenas não foi executado. O que falta neste
   host é aparelho **físico** de tela baixa;
3. **"segunda falha invalida o checkpoint e volta à Home"** e **ausência de
   efeito duplicado após a retomada** não são exercitados por nenhum flow.

O procedimento reprodutível corrigido, incluindo `radiant-app/.env.local` e o
coletor CDP sem os quais as coortes saem vazias, está na seção **Gate H3** de
`radiant-app/docs/E2E_RUNBOOK.md`.

Rollback: retirar a superfície da allowlist; se houver risco sistêmico, mudar
para `off`. O checkpoint fica inerte e o estado pedagógico é preservado.

## Onda 5 — Checkpoint pedagógico

Gate:

- nota exatamente 80% passa sem erro crítico;
- qualquer erro crítico reprova a tentativa atual;
- XP/histórico não compensam falha;
- tentativa inicial reprovada → ciclo 1 → nova tentativa reprovada → ciclo 2 →
  terceira tentativa ainda não aprovada é a única sequência que produz
  `support-required`;
- desbloqueio posterior continua bloqueado enquanto necessário;
- conteúdo anterior e Home permanecem acessíveis.

Rollback: desligar a integração do checkpoint v2 e retornar à recomendação
canônica. Preservar tentativas/evidências válidas; não converter aprovação por
regra antiga.

## Onda 6 — Editorial e Unidade 1

Antes de promover:

- todos os hashes correspondem ao lote revisado;
- validação automática, clínica, direitos e acessibilidade aprovadas;
- autorização de promoção explícita;
- lock adquirido e hash esperado ainda atual;
- snapshot do último catálogo aprovado disponível.

Promoção é tudo-ou-nada. Se qualquer escrita falhar, nenhum ponteiro de catálogo
é movido. Depois da promoção, validar hashes, changelog, app e API local.

Rollback: restaurar o ponteiro/manifesto do último catálogo aprovado e repetir
os validadores. Nunca editar o catálogo promovido imutável.

## Onda 7A — Outbox e beta pedagógico local/offline

Pré-condições:

- outbox local preserva fatos confirmados sem ack, sem TTL;
- remoção somente por ack ou compactação semântica equivalente;
- outbox aceita apenas `SyncEventV1`; `LocalCheckpointEventV1` nunca entra nela;
- sync permanece `off`;
- artefato sanitizado `beta-checkpoint-local-v1.jsonl` habilitado;
- evidência manual usa somente ids/códigos/contagens allowlisted.
- export vem da UI interna ou harness do sandbox, nunca backup integral, e fica
  em `.maestro/artifacts/student-checkpoint-beta/<betaRunId>/` com manifest,
  audit de privacidade aprovado e aggregate.

Gate do beta local:

- dedupe por `localEventId`; id conflitante reprova o lote;
- denominador = `checkpointId` único com `restore_offered/direct`; numerador =
  `restore_succeeded` correspondente; fallback por reason code;
- denominador ≥100 e sucesso ≥99%;
- zero P0/P1 e zero incidente de privacidade;
- zero duplicação de tentativa/XP/evidência;
- relaunch, retry, ack perdido e compactação semântica sem perda;
- artefato local contém somente a união fechada `LocalCheckpointEventV1`, sem
  reaproveitar payload de sync;
- rollback exercitado nas duas plataformas;
- autorização específica do dono para avançar pedagogicamente.

O beta local não requer API, auth, resolução de conflito remoto ou sink de
analytics. Ele pode liberar a expansão pedagógica mantendo sync desligado.

Rollback: mudar o kernel para `off`, preservar outbox/fatos e continuar estudo
offline; se o catálogo for a causa, restaurar o último catálogo aprovado.

## Onda 7B — Gate exclusivo do sync remoto

Pré-condições adicionais:

- API/auth e contratos de conta/exclusão disponíveis com evidência própria;
- declarações de loja reconciliadas antes de coleta remota;
- batch idempotente de 1–100 e conflitos/projeção incremental testados;
- endpoint recusa `LocalCheckpointEventV1` e aceita somente envelopes com
  `SyncEventV1` confirmado;
- merge cobre ciclo de reforço e support-required por ids de plano/estado e
  relações source/follow-up, sem last-write-wins;
- unicidade/index `(account_id,event_id)` e cursor
  `(account_id,server_sequence)`;
- retry limitado a 20, jitter de 1 s a 6 h e backpressure sem descarte;
- sink remoto verificado, além de logs locais.

Carga reproduzível antes do sync:

1. gerar 400.000 eventos para 10.000 contas simuladas, 40 por conta;
2. batch médio 20/máximo 100;
3. sustentar 1.000 contas e 100 requests/s por 15 minutos;
4. executar soak de 24 h com duplicatas, `429`, `5xx`, queda e reconexão;
5. provar p95 de ingestão ≤300 ms, p95 de projeção ≤500 ms, erro não controlado
   <0,1%, zero perda/efeito duplicado e backlog drenado em ≤30 minutos;
6. versionar parâmetros, ambiente, seed e relatório para reprodução.

Verificação do sink: enviar evento sintético allowlisted, consultar o mesmo
`eventId` no destino e confirmar o ack/projeção. HTTP 2xx ou log local isolado
não autoriza afirmar observabilidade remota.

Rollback remoto: desligar sync antes do kernel, preservar outbox sem TTL e
continuar estudo offline. Nunca apagar backlog para aliviar pressão.

## Triggers de rollback imediato

- perda, regressão ou desbloqueio incorreto de progresso;
- crash loop, tela sem saída ou ciclo de navegação;
- duplicação de qualquer efeito obrigatório;
- payload com PII, PHI, texto livre, caminho/URI ou identificador de dispositivo;
- divergência shadow determinística;
- promoção parcial ou hash diferente do aprovado;
- regressão acima dos limites de desempenho;
- reclamação P0/P1 confirmada no beta.

## Diagnóstico seguro

Coletar somente:

- versão/schema/modo/superfície;
- ids opacos e `operationId`;
- etapa e reason code fechados;
- contagens agregadas e timestamps;
- hashes de catálogo e status dos validadores.

Não copiar store bruto para issue, chat ou evidência. Não imprimir valor que o
scanner de privacidade rejeitou. Redigir o incidente com código e contagem.

## Verificação depois do rollback

1. relaunch offline abre Home;
2. progresso, XP, sequência, revisões e catálogo continuam legíveis;
3. nenhuma operação pendente é aplicada duas vezes;
4. modo desligado não produz novas escritas;
5. outbox continua preservada quando o problema é remoto;
6. documentação/status registram causa, alcance, versão e próximo gate;
7. nenhum novo binário é publicado até a investigação fechar.

## Restrição vigente

O design e seu desenvolvimento podem avançar em branch/build interna. Nenhum
passo deste runbook autoriza OTA ou novo binário sobre a versão `1.3.1 (7)` em
revisão. Publicação é uma ação separada e explícita do dono.
