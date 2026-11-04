# Task14/T12 — revisão independente

Base f2dfbf33968414e7e5e6e0763de9398a92103371. Revisor `/root/t12_review`, perfil R/high, autor `/root/t12_implementer`. Snapshot r1:10arquivos, manifest SHA256040b5ac3dce87daf2b47d78880aa1aa0476b2feacaefe92e832e45f88c238133 e diffd086822526c3a701c0edd2c6b30fa73acf6a1ee9a7a471efbf0cce3f425c1316. Mesmo brief r1a; ruling posteriorr1b responde ao achado.

## R1 — Spec FAIL / Qualidade CHANGES_REQUIRED

Um P2, sem outros P1/P2/P3 no snapshot: LessonFlowScreen.tsx:470 inicia getSnapshotForNode no foco independentemente de bootstrap/interações. Getter real ensureProgress lê, aguarda hidratação e persiste cópia stale (JourneyProgressService.ts:302/312). Consulta demorada pode terminar após currentNode/cursor novos e sobrescrevê-los; alive protege React, não a escrita. Os mocks de serviço dos consumidores eram cegos ao efeito persistente.

Reprodução focal real do serviço, Node20, só portas sintéticas em memória:

```text
AFTER_NEWER_SAVE {"current":"node-1","cursor":7}
AFTER_LATE_T12_QUERY {"current":null,"cursor":2}
LOST_NEWER_PROGRESS true
```

Script/saída/hash preservados em [testes](2026-10-30-medalhao-t12-tests.json). Achado exige regressão sobre efeitos reais; ignorar callback tardio ou contar chamadas sozinho não basta. Fix1 autorizado no mesmo implementador: obter contagem do snapshot real já devolvido pelo setter sequenciado do bootstrap, eliminando a consulta/persistência adicional. Sem mudança de serviços/economia/storage.

Auditoria restante passou:10hashes/diff/manifest, cinco vetores40pt/contagens0–5/títulos/prazo/hierarquia/link e loja indisponível, guards unlimited dos3consumidores, destino executável Journey e escopo unidade Checkpoint, YAML/contrato econômico.46envelopes/hashes conferidos, CPU final228/7PASS nos bytesr1; Maestro40/40,32injeções detectadas/restauradas. Serviços econômicos intactos. Tipos/lint anteriores aos últimos2testes; final configurada ainda necessária.

Native normal/AX5 NOT_VERIFIED: Simulator.app GUI ausente na árvore ativa, sem instalação autorizada. Cap2 herdado do AppButton mantido por rulingr1a; não é achado. Sem alegação de AX nativa, fala audível ou FPS. Revisor não editou produto/docs nem iniciou Loop/runtime/build/install; só produziu reproducer autorizado no workspace excluído.

## Re-revisão

Fix1 e snapshotr2 devem ser conferidos antes de qualquer aceite. Este relatório conserva R1 reprovada e não antecipa veredito de correção.

## R2 — Spec PASS / Qualidade APPROVED, P2 ADDRESSED

Revisor conferiu snapshotr2 inteiro contraBASE e delta r1→r2: manifest1541a3ae329ed616d3ebb8f445559a8d6af11326b62e7bd144c2191f4e02c8d7; diffcd9ebadb8b29cb8291fd1a9667666509d9e00b4230f9c9109e0c1c95d65b9167; deltabbbca67fb35e11eb3c12dc5169193737c8b55c4067219439ed36bf177700bd97. Apenas LessonFlowScreen e teste mudaram; outros8hashes idênticos. Sem novo achado concreto.

A consulta persistente do foco foi eliminada. dueReviewCount vem do retorno real do setter já sequenciado após setCurrentNode no bootstrap, antes da tela interativa; vidas continuam independentes. Serviço inalterado. Regressão conecta getter alcançado pela tela ao serviçoTS/recomendador reais e portas sintéticas, medindo persistência. Vermelho e mutante reintroduzido perdem current/cursor7 para null/2; verde preserva valores. Não depende de contador de chamadas ou timeout.

57envelopes/logs/hashes conferidos:229testes/7suítes normalCPU PASS;5mutantesfix1 detectados/restaurados, tipos/lint finais exit0 e hashes iguais ao freeze. Limite aceito r1b: contagem no bootstrap, atualização contínua exigiria outro contrato. Nativo normal/AX5 NOT_VERIFIED e final Loop ainda não executada no instante deste parecer. Revisor não alterou arquivos nem repetiu suíte ampla. Aprovação é de código/evidência estática, não aceite nativo/global.

## Conferência documental

PASS_BOUNDED documental: sem sobreaceite nativo/global, links T12/T13 válidos. P3 detectado no link relativo do trecho transportado do STATUS para o histórico; alvo ajustado para ../superpowers/handoffs, mantendo texto/referente histórico. Controlador reconferiu existência/diff; nenhum produto alterado. Recibo final era provisório no instante da revisão, preenchido somente após execução.
