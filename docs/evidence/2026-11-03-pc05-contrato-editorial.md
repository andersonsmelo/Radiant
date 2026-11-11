# PC05 — contrato editorial do piloto e especificação da transição

**Medição:** 03/11/2026, America/Bahia. **Base Git:** `dcb6810`, branch
`claude/conteudo-reinicio-tecnologo`, worktree `trilha-2026-10-20`.
**Run:** `run-1793699249595-9fa984b6`. A baseline já continha os cinco documentos
alterados pelo PC03-A da mesma conversa; não houve commit, descarte ou absorção
de trabalho de outra sessão. A ADR de 02/11 foi preservada sem nova alteração.

## Entrega e fronteiras

Implementada extensão explícita `pilot` no contrato editorial existente, com
Q1–Q5, diagramas autorais CC BY 4.0, fontes/claims, rubrica, variante e resposta
acessível por alvo. Novos metadados entram no hash material, na promoção e na
revalidação; mídia externa ao manifesto é recusada. O publicador reutiliza a
extração de IDs por família em vez de presumir `payload.options` em toda interação.

V1 sem extensão continua múltipla escolha sem imagem e não admite bancada em
`exposureImage` ou imagem lateral de apresentação. Seus hashes antigos e seis
gates de promoção continuam iguais. IDs novos estão separados dos aposentados;
a correspondência alvo/variante impede renomear somente o metadado e reutilizar
um item persistido como se fosse inédito.

O [contrato técnico](../CONTENT_PIPELINE.md#pc05--extensão-explícita-do-piloto-03112026)
contém a especificação das rotas de transição e da preservação de dados. Essas
telas, os controles nativos e qualquer migração **não foram implementados**.
Nenhuma aula real, imagem clínica, fonte nova, aprovação editorial ou currículo
foi ativado. A conferência final dos payloads do PC05 depende dos briefs do PC04.

## Evidência focada

Ambiente: Node `v20.20.2`, `EXPO_NO_DOTENV=1 CI=1`, Jest com `--runInBand`.

| Verificação executada | Resultado observado |
| --- | --- |
| `EditorialPilotContract.test.ts`, `EditorialBatchContract.test.ts`, `ProductionBatch.test.ts`, `ContentRetirement.test.ts` | 4 suítes, 67 testes PASS, zero skips. |
| Node `--test scripts/content/production-batch.test.mjs scripts/content/audit-production-batches.test.mjs` | 22 testes PASS, zero skips; inclui publicar/salvar/revalidar/auditar o lote sintético com as cinco famílias. |
| `npx tsc --noEmit --pretty false` | PASS, Node 20. |
| ESLint dos sete arquivos TypeScript alterados/novos | PASS, Node 20. |
| `git diff --check` | PASS. |

As contagens são focadas e não representam o total do gate configurado.
Fixtures são abstratas e não entram no registro ativo. A promoção sintética dos
testes ocorre somente em diretórios temporários removidos pelo próprio teste.

## Vermelho executado e preservado

O primeiro teste do contrato novo apresentou 23 falhas e 2 passes antes da
implementação, incluindo as quatro famílias recusadas e hash indiferente aos
metadados. A revisão independente encontrou botões de comparação sem nome e
hotspots de área zero; foram reproduzidos com entrada específica antes das
respectivas correções. A comparação também exige hashes declarados distintos,
além de dois ativos válidos.

Para preservar evidência auditável das guardas finais, foram retiradas
controladamente as seis condições de validação (a condição de comparação cobre
dois casos), executados os sete casos abaixo e restauradas todas as condições.
A execução restaurada passou os 67 testes sem seleção ou skips.

Comando da execução vermelha, em `radiant-app`, no Node 20:

```sh
EXPO_NO_DOTENV=1 CI=1 npm test -- --runInBand \
  src/features/student-checkpoints/EditorialPilotContract.test.ts \
  src/features/student-checkpoints/EditorialBatchContract.test.ts \
  -t 'unnamed comparison|identical comparison image|comparison assets with identical bytes|zero-area hotspot|variant attached|imagery out' \
  --json --outputFile ../.loop/runs/run-1793699249595-9fa984b6/pc05-guard-red.json
```

Resultado real: exit 1, 7 falhas, 0 passes; 47 casos fora da seleção. Arquivo
bruto local: `.loop/runs/run-1793699249595-9fa984b6/pc05-guard-red.json`.
SHA-256 do JSON bruto: `85d7217e747195aea4cb4b1db26e9e944bec163d63ac1673e797245243bb5be6`.
A extração abaixo foi gerada diretamente desse JSON, não reconstruída de memória:

```json
{
  "numFailedTests": 7,
  "assertionResults": [
    {
      "fullName": "contrato editorial genérico G3 keeps presentation imagery out of the original v1 contract",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toContain(expected) // indexOf\n\nExpected value: \"unsupported-activity-family:activity:materia-energia-e-radiacao:01\"\nReceived array: []\n    at toContain (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialBatchContract.test.ts:34:61)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "contrato editorial genérico G3 keeps bench imagery out of the original v1 contract",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toContain(expected) // indexOf\n\nExpected value: \"unsupported-activity-family:activity:materia-energia-e-radiacao:01\"\nReceived array: []\n    at toContain (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialBatchContract.test.ts:34:61)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "PC05 editorial pilot extension rejects unnamed comparison controls",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toBe(expected) // Object.is equality\n\nExpected: true\nReceived: false\n    at toBe (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialPilotContract.test.ts:52:93)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "PC05 editorial pilot extension rejects identical comparison image",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toBe(expected) // Object.is equality\n\nExpected: true\nReceived: false\n    at toBe (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialPilotContract.test.ts:52:93)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "PC05 editorial pilot extension rejects comparison assets with identical bytes",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toBe(expected) // Object.is equality\n\nExpected: true\nReceived: false\n    at toBe (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialPilotContract.test.ts:52:93)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "PC05 editorial pilot extension rejects variant attached to another target",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toBe(expected) // Object.is equality\n\nExpected: true\nReceived: false\n    at toBe (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialPilotContract.test.ts:52:93)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    },
    {
      "fullName": "PC05 editorial pilot extension rejects zero-area hotspot region",
      "status": "failed",
      "failureExcerpt": "Error: expect(received).toBe(expected) // Object.is equality\n\nExpected: true\nReceived: false\n    at toBe (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/src/features/student-checkpoints/EditorialPilotContract.test.ts:52:93)\n    at Object.<anonymous> (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-each/build/bind.js:81:13)\n    at Promise.then.completed (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:298:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-2026-10-20/radiant-app/node_modules/jest-circus/build/utils.js:231:10)"
    }
  ]
}
```

Verde completo restaurado: `pc05-guard-green.json`, no mesmo run, exit 0,
4 suítes, 67 testes, zero falhas e zero skips. Nenhuma mutação temporária ficou
nos arquivos de implementação.

## Conferência independente e limites

Um checker Codex independente conferiu um requisito delimitado de conformidade
PC05, retornando `implemented` após verificar a correção dos dois achados.
Relatório local: `.loop/runs/run-1793699249595-9fa984b6/spec-compliance/REQ-PC05.md`.
Essa conferência estrutural não é a revisão editorial/técnica por Claude do PC03-B.

Trailmark `0.7.1` foi instalado como ferramenta global via uv porque não estava
disponível; nenhuma dependência do app mudou. O grafo de `radiant-app/src` teve
538 arquivos e 19.143 nós, com preanalysis executada. Há proxies não resolvidos,
zero entrypoints reconhecidos e um diagnóstico do parser em tela de telemetria
fora deste diff. O grafo orientou a busca de consumidores; não prova ausência de
caminhos nem valida comportamento ou segurança em execução.

Autoria/direitos dos ativos reais, exatidão científica, equivalência sem gabarito,
bytes dos arquivos, offline, VoiceOver/TalkBack e dispositivo continuam nos gates
próprios. Não houve build, instalação, EAS/OTA, loja, merge ou publicação.

## Gate final do run

Comando configurado: `loop validate --run run-1793699249595-9fa984b6`, com Node 24
para Loop e Node 20 nos validadores do app/API. O resultado e os IDs de evidência
são os envelopes/eventos do próprio run; não se substituem os 15 validadores
pelas suítes focadas acima. O fechamento exige `validate`, `step finish`, memória
validada quando aplicável e `run close`, nessa ordem e em chamadas separadas.
