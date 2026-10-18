# ADR — O Claude passa a planejar e executar; as outras IAs ficam em pausa

**Data:** 2026-10-18 (America/Bahia).
**Estado:** aceita.
**Decisor:** Anderson Melo, nesta conversa. Primeiro escreveu "a partir de agora
nós vamos trabalhar somente por aqui por enquanto". Depois, ao pedir o prompt de
continuidade: "agora ele será tanto planejador quanto executor".
**Autoria do registro:** Claude Opus 5.5 (Anthropic, `claude-opus-5-5`).
**Substitui:** o modelo de coordenação de 2026-10-17, em que o Claude revisava e
coordenava e o Codex e o Argon executavam
([protocolo](../trilha/plano/2026-10-17-avancos-e-coordenacao-multi-ia.md)).

## Contexto

De 2026-10-16 a 18, a trilha foi trabalhada por três IAs:
- o **Codex** entregou o G0–G4 (PR #39) e o motor híbrido (PR #42);
- o **Argon** entregou a lição honesta, as correções do G4 e a pesquisa de
  imagens (PR #40);
- o **Claude** revisou as três entregas, corrigiu bloqueios, registrou as
  decisões e fez o A1 (PRs #41, #43 a #46).

As revisões acharam citações inventadas e premissas não verificadas. Cada
entrega precisou de uma volta de correção, e o custo de coordenação ficou alto.

## Decisão

1. **O Claude planeja e executa.** Ele escolhe o próximo item da FILA, combina a
   condição de pronto com o dono, implementa, verifica e registra.
2. **Codex e Argon ficam em pausa** até nova decisão do dono. Não se escrevem
   prompts para eles.
3. **Continuam com o dono:** decisões de produto e currículo, aprovação de
   conteúdo e de imagens, loja, build de distribuição e merge.
4. **Sem revisor externo, a verificação vem do processo.** Isso vale para o que
   o Claude escreve:
   - teste visto falhando pelo motivo previsto;
   - gate completo (`EXPO_NO_DOTENV=1 npm run quality`);
   - `loop validate`;
   - prova nativa quando houver tela;
   - auditoria das próprias citações antes de publicar.

## Consequências

- O [prompt para outras IAs](../trilha/PROMPT-PARA-IAS.md) e o
  [prompt do Codex](../trilha/PROMPT-CODEX-2026-10-18.md) viram histórico.
- O documento de entrada é o
  [prompt de continuidade (19)](../superpowers/handoffs/2026-10-18-radiant-prompt-de-continuidade-19.md).
- O contrato do AGENTS.md para várias IAs continua valendo, porque o dono pode
  retomá-las.
- **Risco:** sem segunda IA, nenhum outro par de olhos lê o diff. A mitigação é
  a disciplina do item 4. O dono pode pedir uma revisão independente quando
  quiser.
