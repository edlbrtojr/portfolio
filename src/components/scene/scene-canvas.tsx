"use client";

import { Canvas } from "@react-three/fiber";
import { Particles } from "./particles";

type Props = { count: number; reducedMotion: boolean; font: string; name: string; onFail: () => void };

export default function SceneCanvas({ count, reducedMotion, font, name, onFail }: Props) {
  return (
    <Canvas
      // DPR limitado a 1,75: acima disso o ganho visual em pontos pequenos é
      // nulo e o custo de fill dobra em telas 3x de celular.
      dpr={[1, 1.75]}
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
      <Particles count={count} reducedMotion={reducedMotion} font={font} name={name} />
    </Canvas>
  );
}
