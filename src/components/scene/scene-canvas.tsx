"use client";

import { advance, Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Fireflies } from "./fireflies";
import { River } from "./river";
import { sceneState, wakeScene } from "./store";

type Props = { fireflies: number; dpr: number | [number, number]; reducedMotion: boolean; coarse: boolean; onFail: () => void };

/** Abaixo disso a cena perde mais nitidez do que ganha em fluidez. */
const MIN_DPR = 0.75;

/**
 * Quem decide quando a cena desenha. Com o laço padrão do r3f o shader
 * redesenhava a 60 fps com a página parada, até com movimento reduzido, e no
 * celular isso é bateria e aparelho quente. Aqui (frameloop "never"):
 *
 * - scroll desenha no mesmo quadro, sempre: o nome em SVG anda no rAF com o
 *   mesmo `scrollY`, e o shader não pode ficar um quadro atrás (por isso
 *   `advance` aqui dentro, e não `invalidate`, que só desenharia no próximo);
 * - animação contínua (água, vaga-lumes) a 60 fps no desktop e a 30 no
 *   aparelho modesto enquanto há alguém mexendo (scroll, mouse, foco,
 *   lanterna acesa num topônimo);
 * - parada há 2 s, a página cai para 15 fps no desktop e 8 no aparelho
 *   modesto. A água anda a 0,02 unidade por segundo e os vaga-lumes piscam
 *   devagar: a 15 fps não se nota, e o shader inteiro a dpr 1,5 deixava de
 *   rodar 60 vezes por segundo com ninguém olhando (bateria, ventoinha);
 * - com movimento reduzido nada anda sozinho: desenha só no scroll e por
 *   ~1,5 s depois de lanterna, foco ou resize (wakeScene);
 * - se a média de quadros ficar 40% acima do previsto por 1,5 s, a
 *   resolução cai um degrau (1,5 → 1 → 0,75) e não volta: subir e descer
 *   ficaria piscando a nitidez;
 * - com o jogo da canoa rodando (sceneState.tick), é ele quem anda primeiro
 *   em cada quadro e a cena desenha todos.
 */
function Pacer({ reducedMotion, coarse }: { reducedMotion: boolean; coarse: boolean }) {
  const get = useThree((s) => s.get);

  useEffect(() => {
    const gap = coarse ? 1000 / 30 : 0;
    const idleGap = coarse ? 1000 / 8 : 1000 / 15;
    const expected = Math.max(1000 / 60, gap);
    let raf = 0;
    let lastY = Number.NaN;
    let lastDraw = 0;
    let prev = 0;
    let acc = 0;
    let frames = 0;
    wakeScene(2000);
    const onResize = () => wakeScene();
    window.addEventListener("resize", onResize);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // O jogo da canoa anda aqui, antes da leitura da câmera: ele a move e
      // desenha a canoa no mesmo quadro em que o shader desenha o rio. Com
      // jogo, todo quadro conta como movimento (sem teto de 30 fps): é o
      // mesmo custo de alguém rolando a página pelos ~20 s da descida.
      const playing = sceneState.tick !== null;
      sceneState.tick?.(now);
      const y = window.scrollY;
      const moved = y !== lastY || playing;
      lastY = y;
      if (moved) wakeScene(2000);
      // Lanterna pousada num topônimo: os vaga-lumes orbitam, fica em ritmo cheio.
      const awake = now < sceneState.wakeUntil || sceneState.lantern.active;
      if (!moved && !awake && reducedMotion) {
        prev = 0;
        return;
      }
      // Margem de 4 ms: o rAF oscila e um teto exato de 33,3 ms cairia para 20 fps.
      if (!moved && now - lastDraw < (awake ? gap : idleGap) - 4) return;
      lastDraw = now;

      // Só mede quadros desenhados em sequência e em ritmo cheio; ociosa,
      // a cena desenha devagar de propósito e não pode contar como lenta.
      if (awake && prev && now - prev < 250) {
        acc += now - prev;
        frames += 1;
      }
      prev = awake ? now : 0;
      if (acc > 1500) {
        const state = get();
        const dpr = state.viewport.dpr;
        if (acc / frames > expected * 1.4 && dpr > MIN_DPR) state.setDpr(dpr > 1 ? 1 : MIN_DPR);
        acc = 0;
        frames = 0;
      }

      advance(now / 1000, true, get());
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [get, reducedMotion, coarse]);

  return null;
}

export default function SceneCanvas({ fireflies, dpr, reducedMotion, coarse, onFail }: Props) {
  return (
    <Canvas
      dpr={dpr}
      frameloop="never"
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
      }}
    >
      <Pacer reducedMotion={reducedMotion} coarse={coarse} />
      <River reducedMotion={reducedMotion} />
      <Fireflies count={fireflies} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
