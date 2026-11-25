import assert from "node:assert/strict";
import { test } from "node:test";
import { COLUMN_END, DAWN_FROM, DAWN_TO, NOTES_START, RIVER_GLSL, SPINE_TEXT_START, dawnAt, fitName, halfRef, riverHalf, riverX, safeHalfPx } from "./river-curve.ts";

// O layout inteiro depende de a água nunca passar por baixo do texto: a
// coluna termina em COLUMN_END, as notas começam em NOTES_START e, no
// celular, o texto começa em SPINE_TEXT_START. Testar só o centro não basta:
// a margem é o centro ± a meia largura, que na horizontal cresce com a
// inclinação do curso e triplica na foz. Se alguém mexer no eixo, na
// amplitude, na largura ou nas senoides, este teste quebra antes de o texto
// cair na água.
const samples = Array.from({ length: 4000 }, (_, i) => i * 0.005);

/** Margens da água em fração de W, como o shader calcula (distância corrigida pela derivada). */
function banks(y, mode, W, H, docUnits) {
  const e = 0.001;
  const x = riverX(y, mode, docUnits);
  const slope = ((riverX(y + e, mode, docUnits) - riverX(y - e, mode, docUnits)) / (2 * e)) * (W / H);
  const half = (riverHalf(y, mode, docUnits) * halfRef(mode, W, H) * Math.sqrt(1 + slope * slope)) / W;
  return [x - half, x + half];
}

// Paisagem comum, notebook quadrado, monitor largo, tela baixa e tablet em
// retrato (ainda modo carta a partir de 768 px).
const chartViewports = [
  [1440, 900],
  [1280, 1000],
  [1920, 1080],
  [1366, 768],
  [1100, 700],
  [1024, 1366],
  [800, 1280],
];

test("na carta, a água inteira fica entre a coluna de texto e as notas, inclusive na foz", () => {
  for (const [W, H] of chartViewports) {
    // Documento de 12 unidades: a foz ocupa de 10,5 a 12.
    for (const docUnits of [Infinity, 12]) {
      for (const y of samples) {
        if (y > docUnits) break;
        const [l, r] = banks(y, "chart", W, H, docUnits);
        assert.ok(l > COLUMN_END, `${W}×${H} y=${y}: margem esquerda em ${l.toFixed(4)}`);
        // As notas só existem a partir de 1100 px.
        if (W >= 1100) assert.ok(r < NOTES_START, `${W}×${H} y=${y}: margem direita em ${r.toFixed(4)}`);
        assert.ok(r < 0.97, `${W}×${H} y=${y}: a água sai da moldura (${r.toFixed(4)})`);
        assert.ok((r - l) * W > 30,`${W}×${H} y=${y}: rio com ${((r - l) * W).toFixed(1)} px`);
      }
    }
  }
});

test("na lombada, a água inteira fica à esquerda da coluna de texto", () => {
  for (const [W, H] of [
    [390, 844],
    [360, 780],
    [430, 932],
    [767, 1024],
  ]) {
    for (const y of samples) {
      const [l, r] = banks(y, "spine", W, H, 12);
      // À esquerda a água pode passar uns px por baixo da moldura (8 px no
      // celular): é a borda da tela, não texto.
      assert.ok(l * W > -8 && r < SPINE_TEXT_START, `${W}×${H} y=${y}: água de ${l.toFixed(4)} a ${r.toFixed(4)}`);
      // E o rio existe: um teto de largura mal calculado já o zerou uma vez.
      assert.ok((r - l) * W > 20, `${W}×${H} y=${y}: rio com ${((r - l) * W).toFixed(1)} px`);
    }
  }
});

// Instrument Serif itálica medida no navegador (canvas, 100 px): "Edilberto"
// tem 327 px de comprimento e tinta de 75 px acima e 1 px abaixo da base.
const METRICS = { len100: 327, asc100: 75, desc100: 1 };

test("o nome cabe inteiro na água, do começo ao fim do trecho por onde desce", () => {
  for (const [W, H, mode] of [...chartViewports.map(([w, h]) => [w, h, "chart"]), [390, 844, "spine"], [360, 780, "spine"], [430, 932, "spine"]]) {
    const fit = fitName(W, H, mode, METRICS);
    for (let y = fit.y0; y <= fit.y1; y += 0.005) {
      assert.ok(fit.band / 2 <= safeHalfPx(y, mode, W, H) + 0.01, `${W}×${H} y=${y.toFixed(3)}: tinta ${(fit.band / 2).toFixed(1)} > água ${safeHalfPx(y, mode, W, H).toFixed(1)}`);
    }
    // E continua sendo o momento da abertura: grande o bastante para ler de
    // longe. Em retrato a régua é a largura (halfRef), não a altura.
    const min = mode === "chart" ? 0.17 * halfRef(mode, W, H) : 0.15 * W;
    assert.ok(fit.size >= min, `${W}×${H}: nome com ${fit.size.toFixed(0)} px`);
  }
});

// O trabalho se lê à noite (topônimos creme sobre mata escura) e o sol só
// está inteiro na última tela, a do convite. Os vaga-lumes (JS) e a luz
// (GLSL) usam a mesma janela: se uma constante mudar num lado só, eles
// apagam fora de hora.
test("a noite dura até as últimas telas e o shader amanhece na mesma janela", () => {
  for (const docUnits of [5.7, 7.5, 12]) {
    assert.equal(dawnAt(0, docUnits), 0);
    assert.equal(dawnAt(docUnits - DAWN_FROM, docUnits), 0);
    assert.ok(dawnAt(docUnits - 1, docUnits) > 0.5, "na última tela já é manhã");
    assert.equal(dawnAt(docUnits - DAWN_TO, docUnits), 1);
    assert.equal(dawnAt(docUnits, docUnits), 1);
  }
  // Sem altura do documento medida não há amanhecer (a abertura não pisca em manhã).
  assert.equal(dawnAt(0.5, 0), 0);
  assert.equal(dawnAt(0.5, Infinity), 0);
  assert.ok(RIVER_GLSL.includes(`smoothstep(docU - ${DAWN_FROM}, docU - ${DAWN_TO}, y)`));
});

test("o shader usa as mesmas senoides do SVG", () => {
  for (const term of ["0.6 * sin(6.8 * y + 0.0)", "0.45 * sin(3.1 * y + 1.3)", "0.25 * sin(11.3 * y + 2.0)", "0.2 * sin(1.7 * y + 0.4)"]) {
    assert.ok(RIVER_GLSL.includes(term), term);
  }
});
