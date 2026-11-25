"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { dawnAt } from "./river-curve";
import { sceneState } from "./store";

// Vaga-lumes soltos sobre a mata. Quando um topônimo ou uma nota recebe o
// mouse ou o foco, cerca de um terço deles larga a mata e vai rodear a
// palavra, como bicho atrás de lanterna.

/** Gerador determinístico (mulberry32): a mesma revoada a cada carga. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertex = /* glsl */ `
  attribute vec2 aPos;    // posição em [-0,5; 0,5] da largura e da altura visíveis
  attribute float aSeed;
  uniform vec2 uView;     // largura e altura visíveis, em unidades do mundo
  uniform float uTime;
  uniform float uMotion;
  uniform float uSize;
  uniform float uDrift;   // telas roladas: a revoada sobe com a mata
  uniform vec2 uTarget;   // centro da lanterna, em unidades do mundo
  uniform float uGather;  // 0 soltos, 1 em volta da lanterna
  uniform float uRadius;
  varying float vGlow;
  void main() {
    float t = uTime * (0.15 + aSeed * 0.2);
    // Sobem com a página e reaparecem embaixo: a mata é a mesma carta.
    vec2 base = vec2(aPos.x, fract(aPos.y + 0.5 + uDrift) - 0.5);
    vec3 p = vec3(base * uView, 0.0);
    p.x += (sin(t + aSeed * 50.0) + 0.5 * sin(t * 2.3 + aSeed * 17.0)) * 0.35 * uMotion;
    p.y += (cos(t * 1.3 + aSeed * 31.0) + 0.5 * sin(t * 3.1 + aSeed * 7.0)) * 0.12 * uMotion;
    // ~35% da revoada (aSeed < 0,35) orbita a lanterna, cada um no seu raio.
    float pick = step(aSeed, 0.35);
    float ang = aSeed * 179.0 + uTime * (0.35 + aSeed) * (fract(aSeed * 13.0) > 0.5 ? 1.0 : -1.0);
    float rad = uRadius * (0.45 + 0.9 * fract(aSeed * 7.3));
    vec3 orbit = vec3(uTarget + vec2(cos(ang), sin(ang) * 0.6) * rad, 0.0);
    p = mix(p, orbit, pick * uGather);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Lampejo: apagado na maior parte do tempo, acende rápido e some devagar.
    // Na lanterna ficam mais acesos.
    float phase = sin(uTime * (0.6 + aSeed * 0.9) + aSeed * 100.0);
    float flash = pow(max(phase, 0.0), 8.0);
    vGlow = mix(0.5, 0.08 + 0.92 * flash, uMotion);
    vGlow = mix(vGlow, max(vGlow, 0.55), pick * uGather);
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
          uDrift: { value: 0 },
          uTarget: { value: new THREE.Vector2(0, 0) },
          uGather: { value: 0 },
          uRadius: { value: 0.5 },
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

  useFrame((state, delta) => {
    const obj = points.current;
    if (!obj) return;
    // Material lido pela ref dentro do loop (regra react-hooks/immutability).
    const u = obj.material.uniforms;
    const s = sceneState;
    (u.uView.value as THREE.Vector2).set(viewport.width, viewport.height);
    u.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    u.uMotion.value = reducedMotion ? 0 : 1;
    u.uSize.value = 60 * Math.min(state.gl.getPixelRatio(), 2) * (size.height / 900) ** 0.5;
    u.uDrift.value = window.scrollY / size.height;

    // px do documento → mundo (câmera olhando o plano z = 0).
    const ty = s.lantern.y - window.scrollY;
    (u.uTarget.value as THREE.Vector2).set((s.lantern.x / size.width - 0.5) * viewport.width, (0.5 - ty / size.height) * viewport.height);
    // Raio de ~90 px: em volta da palavra, sem cobri-la.
    u.uRadius.value = (90 / size.height) * viewport.height;
    const want = s.lantern.active && s.lantern.gather ? 1 : 0;
    u.uGather.value += (want - u.uGather.value) * (1 - Math.exp(-delta * (reducedMotion ? 60 : 3)));

    // Vaga-lume é bicho de noite: apagam conforme a manhã chega ao meio da
    // janela (o mesmo dawnAt do shader do rio).
    const day = s.dim || !s.docH ? 0 : dawnAt((window.scrollY + size.height / 2) / s.unit, s.docH / s.unit);
    const target = (s.dim ? 0.35 : 1) * (1 - day);
    u.uOpacity.value += (target - u.uOpacity.value) * 0.06;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
