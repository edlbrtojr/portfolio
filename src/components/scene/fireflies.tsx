"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { rng } from "./shapes";
import { sceneState } from "./store";

// Vaga-lumes soltos sobre a floresta, fora das formas: dão vida ao cenário
// enquanto o enxame principal está parado desenhando um projeto.

const vertex = /* glsl */ `
  attribute vec2 aPos;    // posição em [-0,5; 0,5] da largura e da altura visíveis
  attribute float aSeed;
  uniform vec2 uView;     // largura e altura visíveis, em unidades do mundo
  uniform float uTime;
  uniform float uMotion;
  uniform float uSize;
  varying float vGlow;
  void main() {
    float t = uTime * (0.15 + aSeed * 0.2);
    vec3 p = vec3(aPos * uView, 0.0);
    // Voo errático e lento: duas senoides fora de fase por eixo.
    p.x += (sin(t + aSeed * 50.0) + 0.5 * sin(t * 2.3 + aSeed * 17.0)) * 0.35 * uMotion;
    p.y += (cos(t * 1.3 + aSeed * 31.0) + 0.5 * sin(t * 3.1 + aSeed * 7.0)) * 0.12 * uMotion;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Lampejo: apagado na maior parte do tempo, acende rápido e some devagar.
    float phase = sin(uTime * (0.6 + aSeed * 0.9) + aSeed * 100.0);
    float flash = pow(max(phase, 0.0), 8.0);
    vGlow = mix(0.5, 0.08 + 0.92 * flash, uMotion);
    gl_PointSize = uSize * (0.6 + vGlow) / -mv.z;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying float vGlow;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = exp(-r * r * 22.0);
    gl_FragColor = vec4(vec3(0.85, 0.95, 0.45), a * vGlow * uOpacity);
  }
`;

export function Fireflies({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const { size, viewport } = useThree();
  const points = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);

  const geometry = useMemo(() => {
    const r = rng(77);
    const pos = new Float32Array(count * 2);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Espalhados sobre a mata vista de cima, com o voo no shader.
      pos[i * 2] = r() - 0.5;
      pos[i * 2 + 1] = r() - 0.5;
      seed[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aPos", new THREE.BufferAttribute(pos, 2));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uView: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uMotion: { value: 1 },
          uSize: { value: 60 },
          uOpacity: { value: 1 },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const obj = points.current;
    if (!obj) return;
    const u = obj.material.uniforms;
    (u.uView.value as THREE.Vector2).set(viewport.width, viewport.height);
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    u.uMotion.value = reducedMotion ? 0 : 1;
    u.uSize.value = 60 * Math.min(state.gl.getPixelRatio(), 2) * (size.height / 900) ** 0.5;
    // Recuam junto com o enxame quando a seção mostra capturas.
    const target = sceneState.dim ? 0.25 : 1;
    u.uOpacity.value += (target - u.uOpacity.value) * 0.06;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
