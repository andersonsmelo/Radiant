# D4: propostas para os 19 `needs-review` e a cadeia desatualizada (2026-09-25)

> **O que este documento faz:** registra a leitura da governança, as 19
> propostas de destino do agente e a medição da cadeia abaixo da
> classificação. **Nada aqui aprova conteúdo.** As propostas esperam um revisor.

## Quem pode aprovar

- **O `approved` de `classifications.json` não é revisão humana.** Quem o
  escreve é o classificador, por limiar: confiança abaixo de 0,7 ou margem
  entre galáxias abaixo de 2,0 vira `needs-review`
  (`scripts/content/classify-source.py`, em `classify_excerpt`). O registro não
  tem campo para revisor.
- **A governança exige gente.** O [README](../../conteúdo/governança/README.md)
  diz que um gate verde confirma coerência e que a prontidão editorial exige
  "revisão humana concluída".
- **O cérebro já tinha a lição:** em 2026-08-03 ficou medido que empurrar
  itens para `approved` por palavra-chave melhora o indicador e piora o dado.

**Conclusão:** o agente propõe e um revisor decide. Decidido pelo dono em
2026-09-25.

## O mecanismo: `review-decisions.json`

Editar `reviewStatus` à mão em `classifications.json` não dura, porque a
próxima regeneração apaga a edição. A decisão passa a viver num arquivo
versionado que o classificador lê:
`conteúdo/classificação/fundamentos-de-radiologia-everton-costa-pinto/review-decisions.json`.

| Status da decisão | Efeito no registro |
| --- | --- |
| `proposed` | Ganha `reviewProposal` (destino, motivo, autor e data). **Destino e status não mudam.** |
| `approved` | Exige `reviewedBy` e `reviewedAt`. Reposiciona, marca `approved` e registra o revisor no `decisionReason`. |
| `approved` com `action: exclude` | **Recusado.** O contrato só conhece `approved` e `needs-review`, e aprovar uma exclusão como `approved` publicaria o excerto. Como representar uma exclusão é decisão do dono. |

**O classificador recusa decisão inválida:**
- excerto inexistente ou decisão duplicada;
- status ou ação desconhecidos;
- planeta fora da galáxia;
- planeta com estrela sem `starId`, ou estrela de outro planeta.

São 14 testes novos em `classify-source.test.py`. Treze guardas foram vistas
falhando, cada uma com o defeito específico injetado.

**Para aprovar:** o revisor troca `status` para `approved` e preenche
`reviewedBy` e `reviewedAt`. Depois roda:

```bash
python3 scripts/content/classify-source.py --source-slug fundamentos-de-radiologia-everton-costa-pinto
```

## As 19 propostas

Cada linha foi escrita depois de ler o texto do excerto. O motivo completo está
no arquivo de decisões.

| Excerto | Hoje | Proposta | Observação |
| --- | --- | --- | --- |
| p1:c1 | física / formação da imagem | **excluir** | Capa: título, autor e semestre |
| p7:c1 | física / formação da imagem | física / física da radiação | Usina termelétrica. É contexto; o revisor pode excluir |
| p15:c2 | física / radiopacidade | física / física da radiação | Atividade radioativa |
| p16:c2 | física / física da radiação | = | Confirma: meia-vida, Bq e Ci |
| p23:c1 | física / radiopacidade | física / produção e proteção | Efeitos biológicos e dosimetria |
| p25:c2 | física / formação da imagem | tecnologia / profissão e aplicações | Reator de potência: aplicação não médica |
| p30:c1 | física / radiopacidade | tecnologia / modalidades | **Radioterapia não tem nó** na taxonomia |
| p32:c1 | patologias / **pneumotórax** | tecnologia / modalidades | **Destino errado:** casou com "tumor". É acelerador linear |
| p34:c1 | tecnologia / modalidades | = | Confirma pelo motivo certo: é TC, e casou com "ressonância" |
| p36:c1 | física / formação da imagem | tecnologia / modalidades | RM: magnetização |
| p36:c2 | física / formação da imagem | tecnologia / modalidades | RM: relaxação |
| p44:c2 | física / formação da imagem | tecnologia / equipamento | Mesa de comando |
| p49:c2 | tecnologia / equipamento | = | Confirma: estativa |
| p55:c1 | tecnologia / imagem na prática | tecnologia / equipamento | Acessório (identificador) |
| p60:c1 | física / formação da imagem | tecnologia / equipamento | Catálogo de acessórios; alternativa: imagem na prática |
| p61:c1 | física / formação da imagem | tecnologia / imagem na prática | Processadora |
| p67:c1 | tecnologia / imagem na prática | = | Confirma: imagem latente |
| p69:c1 | tecnologia / imagem na prática | = | Confirma: química do fixador |
| p71:c1 | física / formação da imagem | tecnologia / imagem na prática | Fatores de densidade; alternativa: onde está hoje |

**O que isso diz sobre o "sinal fraco":** "com sinal" quer dizer que alguma
palavra-chave casou na galáxia. Dos 9 registros nessa condição, a proposta
**confirma 4** (p34, p49, p67 e p69) e **move 5** (p23, p30, p32, p55 e p71).
Aprovar os 9 como estavam teria publicado o p32 em pneumotórax. Dos 10 sem
sinal, a proposta confirma só um (p16).

**Uma pergunta para o dono, além da revisão:** a radioterapia (p30 e p32) não
tem nó na taxonomia. As propostas usam "Modalidades", que é o nó mais próximo,
mas não o certo.

## A cadeia abaixo da classificação

Medida em 2026-09-25, com a regra de `normalize-concepts.py`, que marca o
conceito como `needs-review` quando 30% ou mais dos seus excertos estão
sinalizados.

- **Os conceitos e os bundles determinísticos não foram regerados** depois da
  reclassificação de 2026-08-08. `concepts.json` ainda marca 7 conceitos, e os
  bundles, 42 (7 × 6).
- Com a classificação atual, **5 dos 7 deixariam de ser `needs-review`**:
  acessórios, energia e matéria, preservação de alimentos, radioatividade e
  ressonância. Só "Processamento radiográfico" (3 de 8) e "Tomografia
  computadorizada" (1 de 3) continuam.
- Os 16 conceitos ainda estão posicionados na taxonomia antiga: todos em
  física, "formação da imagem" ou "radiopacidade". Nenhum usa o eixo técnico.

**Esse estado não governa o app.** O `promote-to-catalog.mjs` lê
`ai-bundles.json`, e não os `bundles.json` determinísticos. Os seis
`ai-bundles.json` estão **96 de 96 `approved`**. O `catalog-payload.json`
(versão 1.0.0, gerada em 2026-04-05) já leva os 16 conceitos, inclusive os 7
sinalizados. Por isso, regerar conceitos e bundles determinísticos **não muda o
que o app mostra.** O `needs-review` da D4 é um rótulo sem caminho até o
catálogo.

**Não regerado, por decisão do dono em 2026-09-25.** A pergunta que sobra é
dele: com o Currículo V3 como direção desde 2026-08-27, o que a D4 ainda
precisa bloquear?

## Guardas religadas

- **`validate-foundation.test.mjs`** estava vermelho desde 2026-08-08, com seis
  asserções vencidas pela reextração e pelo eixo técnico. Nenhum gate o
  executava: o validador `content-foundation` rodava só o `.mjs`, e o CI o
  exclui.
- **`classify-source.test.py`** estava verde, mas também fora de todo gate.

Desde `f39ec65`, os dois rodam no `content-foundation` e no `content-python` do
`.loop/project.yaml`. No CI continuam excluídos, porque leem
`excerpts.json`, que é dado local.
