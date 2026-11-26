import assert from "node:assert/strict";
import { test } from "node:test";
import { halfRef, riverHalf, riverX } from "../scene/river-curve.ts";
import { CANOE_Y, COURSE_UNITS, buildCourse, cruise, gameRiver, gameSizes, makeChannel, placeCourse, seeded, steer, touches } from "./course.ts";

// O jogo da canoa não tem como ser jogado num teste de unidade, mas as regras
// dele são conta pura (course.ts). Aqui um jogador simulado desce o rio com a
// mesma física do motor (engine.ts) em cada tamanho de tela: se alguém mexer
// na largura do rio, na velocidade ou na posição dos erros e o percurso ficar
// injusto ou sair da tela, quebra aqui antes de alguém jogar.

const curve = { riverX, riverHalf, halfRef };

// Notebook, monitor largo, tela baixa, tablet em retrato, três celulares e um celular deitado.
const viewports = [
  [1440, 900],
  [1920, 1080],
  [1366, 768],
  [1024, 1366],
  [800, 1280],
  [390, 844],
  [360, 780],
  [430, 932],
  [844, 390],
];

test("o rio do jogo cabe na tela e tem largura para manobrar", () => {
  for (const [W, H] of viewports) {
    const river = gameRiver(W, H);
    const channel = makeChannel(curve, river, W, H);
    const ref = halfRef(river, W, H);
    for (let y = 0; y <= COURSE_UNITS; y += 0.005) {
      // A margem que se vê: a largura com o recorte no máximo (1 + noise / 2).
      const e = 0.01;
      const x = riverX(y, river, COURSE_UNITS) * W;
      const slope = ((riverX(y + e, river, COURSE_UNITS) - riverX(y - e, river, COURSE_UNITS)) * W) / (2 * e * H);
      const seen = riverHalf(y, river, COURSE_UNITS) * ref * (1 + river.noise / 2) * Math.sqrt(1 + slope * slope);
      assert.ok(x - seen > 4 && x + seen < W - 4, `${W}×${H} y=${y.toFixed(3)}: água de ${(x - seen).toFixed(0)} a ${(x + seen).toFixed(0)}`);
      // E o canal navegável nunca aperta a ponto de não caber um desvio.
      const lane = channel(y * H);
      assert.ok(lane.half > 32, `${W}×${H} y=${y.toFixed(3)}: canal com ${lane.half.toFixed(1)} px de meia largura`);
    }
  }
});

test("o percurso é o mesmo para a mesma semente e deixa a largada e a chegada livres", () => {
  const a = buildCourse(seeded(7));
  assert.deepEqual(a, buildCourse(seeded(7)));
  assert.notDeepEqual(a, buildCourse(seeded(8)));
  for (let seed = 1; seed <= 50; seed++) {
    const items = buildCourse(seeded(seed));
    const data = items.filter((i) => i.kind === "dado");
    assert.ok(data.length >= 40, `semente ${seed}: ${data.length} dados`);
    for (let i = 1; i < items.length; i++) assert.ok(items[i].y >= items[i - 1].y, "em ordem de descida");
    for (const it of items) {
      // Dado longe da margem (a canoa tem de alcançar); erro encostado nela.
      assert.ok(it.kind === "erro" ? Math.abs(it.off) === 1 : Math.abs(it.off) <= 0.85, `semente ${seed}: ${it.kind} a ${it.off} da margem`);
      // A canoa larga em CANOE_Y; o primeiro item fica pelo menos meia tela adiante.
      assert.ok(it.y >= CANOE_Y + 0.5 && it.y <= COURSE_UNITS - 0.8, `semente ${seed}: item em y=${it.y}`);
    }
    // As duas primeiras filas ensinam o comando: sem erro.
    const firstError = items.find((i) => i.kind === "erro");
    assert.ok(!firstError || firstError.y > data[8].y, `semente ${seed}: erro cedo demais`);
  }
});

/**
 * Desce o rio com a física do motor. `aim` devolve o alvo do jogador (px) a
 * cada quadro; o resto (velocidade, canoa atrás do alvo, toque) é do jogo.
 */
function run(W, H, seed, aim) {
  const sizes = gameSizes(W, H);
  const channel = makeChannel(curve, gameRiver(W, H), W, H);
  const items = placeCourse(buildCourse(seeded(seed)), channel, H, sizes).map((it) => ({ ...it, done: false }));
  const endY = COURSE_UNITS * H - H;
  const dt = 1 / 60;
  let camY = 0;
  let x = channel(CANOE_Y * H).x;
  let ms = 0;
  let got = 0;
  let hit = 0;
  while (camY < endY - 0.5) {
    camY = Math.min(endY, camY + cruise(camY, endY, H, ms) * dt);
    ms += dt * 1000;
    const cy = camY + CANOE_Y * H;
    x = steer(x, aim(x, cy, items, channel), dt, channel(cy), sizes);
    for (const it of items) {
      if (it.done || !touches(it.kind, it.px - x, it.py - cy, sizes)) continue;
      it.done = true;
      if (it.kind === "dado") got++;
      else hit++;
    }
    assert.ok(ms < 60_000, `${W}×${H}: a descida não termina`);
  }
  return { got, hit, total: items.filter((i) => i.kind === "dado").length, seconds: ms / 1000 };
}

/** Jogador que mira sempre o próximo dado ainda não recolhido, sem antecipar a curva. */
const chaser = (x, cy, items) => items.find((i) => i.kind === "dado" && !i.done && i.py > cy - 10)?.px ?? x;
/** Quem não mexe em nada: o motor mantém a canoa no meio do rio até o primeiro comando. */
const idle = (x, cy, items, channel) => channel(cy).x;

test("dá para descer sem bater: quem segue os dados pega quase todos e não toca em erro", () => {
  for (const [W, H] of viewports) {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const r = run(W, H, seed, chaser);
      assert.equal(r.hit, 0, `${W}×${H} semente ${seed}: bateu em ${r.hit} erro(s) seguindo os dados`);
      assert.ok(r.got >= 0.9 * r.total, `${W}×${H} semente ${seed}: pegou ${r.got} de ${r.total}`);
    }
  }
});

test("quem não joga também chega: no meio do rio não há erro, e sobra dado para quem remar", () => {
  for (const [W, H] of viewports) {
    const r = run(W, H, 3, idle);
    assert.equal(r.hit, 0, `${W}×${H}: o meio do rio tem erro`);
    assert.ok(r.got < 0.6 * r.total, `${W}×${H}: parado pegou ${r.got} de ${r.total}; remar não faz diferença`);
  }
});

// O botão da home promete "20 segundos" (content/pt.ts e en.ts).
test("a descida leva perto de 20 segundos em qualquer tela", () => {
  for (const [W, H] of viewports) {
    const { seconds } = run(W, H, 1, idle);
    assert.ok(seconds > 17 && seconds < 24, `${W}×${H}: ${seconds.toFixed(1)} s`);
  }
});
