import assert from "node:assert/strict";
import test from "node:test";
import { buildRuntimeCatalog } from "./catalog-runtime.mjs";

// Abstract fixtures exercise every question and its answer permutation.
const lerPayload = async () => ({ version: 'synthetic-1', tracks: { quizzes: Array.from({ length: 16 }, (_, index) => ({
  id: `bundle:test:quizzes:shape-${index}`, title: `Forma ${index}`,
  aiContent: [0, 1].map(question => ({ question: `Escolha a forma ${index}/${question}`, options: ['cubo', 'esfera', 'cone', 'cilindro'], correct: question, explanation: 'Comparação sintética.' })),
})) } });

function questoesDaFonte(payload) {
  return (payload?.tracks?.quizzes ?? []).flatMap((bundle) =>
    (bundle.aiContent ?? []).map((questao) => ({ bundleId: bundle.id, questao }))
  );
}

function questoesGeradas(payload) {
  return buildRuntimeCatalog(payload).lessons.flatMap((licao) => licao.questions);
}

test("a alternativa correta continua sendo a mesma depois da permutação", async () => {
  const payload = await lerPayload();
  const fonte = questoesDaFonte(payload);
  const geradas = questoesGeradas(payload);

  assert.equal(geradas.length, fonte.length);

  for (const [i, gerada] of geradas.entries()) {
    const original = fonte[i].questao;
    const rotuloOriginal = original.options[original.correct];
    const rotuloGerado = gerada.options[gerada.correctAnswerIndex]?.label;

    // A propriedade que torna a permutação segura: ela reordena os rótulos e
    // move o índice junto. Se esta falhar, o embaralhamento inventou gabarito.
    assert.equal(
      rotuloGerado,
      rotuloOriginal,
      `gabarito trocado em ${gerada.id}: esperava "${rotuloOriginal}", veio "${rotuloGerado}"`
    );

    // E nenhum rótulo pode sumir ou aparecer duas vezes.
    assert.deepEqual(
      [...gerada.options.map((o) => o.label)].sort(),
      [...original.options].sort(),
      `conjunto de alternativas mudou em ${gerada.id}`
    );
  }
});

test("a posição da alternativa correta não é previsível", async () => {
  const payload = await lerPayload();
  const geradas = questoesGeradas(payload);

  const porIndice = new Map();
  for (const q of geradas) {
    porIndice.set(q.correctAnswerIndex, (porIndice.get(q.correctAnswerIndex) ?? 0) + 1);
  }

  const totalDeAlternativas = Math.max(...geradas.map((q) => q.options.length));
  const maiorConcentracao = Math.max(...porIndice.values());

  // O defeito medido em 2026-09-08: 32 de 32 questões com a resposta na
  // primeira posição. Quem responde "a" acerta tudo sem ler o enunciado.
  assert.equal(
    porIndice.size,
    totalDeAlternativas,
    `as ${geradas.length} questões usam só ${porIndice.size} das ${totalDeAlternativas} posições: ${JSON.stringify([...porIndice.entries()])}`
  );

  // Nenhuma posição pode concentrar mais que o dobro da fatia uniforme.
  const teto = Math.ceil((geradas.length / totalDeAlternativas) * 2);
  assert.ok(
    maiorConcentracao <= teto,
    `uma posição concentra ${maiorConcentracao} das ${geradas.length} questões (teto ${teto})`
  );
});

test("a permutação é determinística entre execuções", async () => {
  const payload = await lerPayload();

  const primeira = questoesGeradas(payload).map((q) => ({
    id: q.id,
    ordem: q.options.map((o) => o.label),
    correta: q.correctAnswerIndex,
  }));
  const segunda = questoesGeradas(JSON.parse(JSON.stringify(payload))).map((q) => ({
    id: q.id,
    ordem: q.options.map((o) => o.label),
    correta: q.correctAnswerIndex,
  }));

  // Sem isto, cada `sync` reescreveria os arquivos gerados com uma ordem nova e
  // o diff do repositório viraria ruído permanente.
  assert.deepEqual(segunda, primeira);
});
