import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { annotate, findWord } from "./annotate.ts";

// O conteúdo importa sem extensão (`./pt`), como o bundler do Next aceita e
// o Node não. Este gancho tenta `.ts` quando o caminho relativo não resolve;
// assim o teste lê o mesmo arquivo que o site, sem dependência nova.
registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (spec.startsWith(".") && !/\.\w+$/.test(spec)) return next(`${spec}.ts`, ctx);
      throw e;
    }
  },
});
const { pt } = await import("../content/pt.ts");
const { en } = await import("../content/en.ts");

const g = [
  { term: "pipeline", note: "N1" },
  { term: "KQL", note: "N2" },
  { term: "SHA-256", note: "N3" },
];

test("marca só a primeira ocorrência na página, não em cada parágrafo", () => {
  const [a, b] = annotate(["Um pipeline em KQL.", "Outro pipeline."], g);
  assert.deepEqual(a, ["Um ", { text: "pipeline", term: "N1" }, " em ", { text: "KQL", term: "N2" }, "."]);
  assert.deepEqual(b, ["Outro pipeline."]);
});

test("respeita o limite por parágrafo e guarda o resto para depois", () => {
  const [a, b] = annotate(["pipeline, KQL e SHA-256.", "Hash SHA-256."], g);
  assert.equal(a.filter((p) => typeof p === "object").length, 2);
  assert.deepEqual(b, ["Hash ", { text: "SHA-256", term: "N3" }, "."]);
});

test("casa palavra inteira", () => {
  assert.equal(findWord("Os pipelines e o pipeline", "pipeline"), 17);
  assert.equal(findWord("hashes SHA-256:", "SHA-256"), 7);
  assert.equal(findWord("ADRs", "ADR"), -1);
});

// Glossário escrito à mão contra o texto dos cases: termo que não aparece
// em lugar nenhum é nota que nunca vai ser lida (alguém reescreveu o case e
// esqueceu o glossário).
for (const c of [pt, en]) {
  test(`todo termo do glossário (${c.locale}) aparece em algum case`, () => {
    const texts = c.projects.flatMap((p) => [p.details.overview, ...p.details.decisions.map((d) => d.choice)]);
    for (const { term } of c.glossary) assert.ok(texts.some((t) => findWord(t, term) >= 0), term);
  });
}
