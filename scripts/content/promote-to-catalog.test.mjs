import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

// Dynamic import to pick up the module under test
const { buildCatalogPayload, collectApprovedBundles, sortBySequence } =
  await import("./promote-to-catalog.mjs");

describe("sortBySequence", () => {
  it("orders concepts matching sequence order", () => {
    const sequenceIds = ["concept:B", "concept:A", "concept:C"];
    const bundles = [
      { conceptIds: ["concept:A"] },
      { conceptIds: ["concept:B"] },
      { conceptIds: ["concept:C"] },
    ];
    const sorted = sortBySequence(bundles, sequenceIds);
    assert.equal(sorted[0].conceptIds[0], "concept:B");
    assert.equal(sorted[1].conceptIds[0], "concept:A");
    assert.equal(sorted[2].conceptIds[0], "concept:C");
  });

  it("appends bundles not in sequence at the end", () => {
    const sequenceIds = ["concept:A"];
    const bundles = [
      { conceptIds: ["concept:B"] },
      { conceptIds: ["concept:A"] },
    ];
    const sorted = sortBySequence(bundles, sequenceIds);
    assert.equal(sorted[0].conceptIds[0], "concept:A");
    assert.equal(sorted[1].conceptIds[0], "concept:B");
  });
});

describe("buildCatalogPayload", () => {
  it("includes version and generatedAt", () => {
    const bundles = [];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.ok(result.version);
    assert.ok(result.generatedAt);
  });

  it("sets version from argument", () => {
    const result = buildCatalogPayload([], "2.1.0");
    assert.equal(result.version, "2.1.0");
  });

  it("groups bundles by formatType", () => {
    const bundles = [
      { id: "b1", formatType: "microlições", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b2", formatType: "quizzes", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b3", formatType: "microlições", conceptIds: ["c2"], reviewStatus: "approved" },
    ];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.equal(result.tracks["microlições"].length, 2);
    assert.equal(result.tracks["quizzes"].length, 1);
  });

  it("excludes bundles that are not approved", () => {
    const bundles = [
      { id: "b1", formatType: "microlições", conceptIds: ["c1"], reviewStatus: "approved" },
      { id: "b2", formatType: "microlições", conceptIds: ["c2"], reviewStatus: "needs-review" },
    ];
    const result = buildCatalogPayload(bundles, "1.0.0");
    assert.equal(result.tracks["microlições"].length, 1);
  });
});

describe("collectApprovedBundles", () => {
  it("returns empty array when no ai-bundles files exist", async () => {
    const { mkdtemp, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const tmpDir = await mkdtemp(`${tmpdir()}/radiant-test-`);
    const result = await collectApprovedBundles(tmpDir);
    assert.deepEqual(result, []);
    await rm(tmpDir, { recursive: true });
  });

  it("returns only approved bundles", async () => {
    const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");

    const tmpDir = await mkdtemp(`${tmpdir()}/radiant-test-`);
    const dir = join(tmpDir, "microlições", "test-source");
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, "ai-bundles.json"),
      JSON.stringify({
        version: 1,
        bundles: [
          { id: "b1", reviewStatus: "approved", formatType: "microlições" },
          { id: "b2", reviewStatus: "needs-review", formatType: "microlições" },
        ],
      })
    );

    const result = await collectApprovedBundles(tmpDir);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, "b1");

    await rm(tmpDir, { recursive: true });
  });
});
