"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { layoutFor, lerpLayout, type Layout } from "./layout";
import { chaos, dashboards, helix, lake, nameShape, phone, randoms, sources, sphere, tree, type Shape, type ShapeKey } from "./shapes";
import { sceneState } from "./store";

// Duração de uma transformação. Abaixo de ~1,2 s a forma "estoura" sem dar
// tempo de ler o fluxo; acima de ~2 s quem rola rápido vê a forma atrasada.
const MORPH_SECONDS = 1.6;
// Atraso máximo por partícula (fração da transformação). Cria o efeito de
// fluxo — partículas saem em ondas, não todas juntas. Tem que bater com o shader.
const STAGGER = 0.35;
// Opacidade da cena atrás das capturas: o suficiente para lembrar que ela
// está lá sem competir com o print.
const DIMMED = 0.18;

const vertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aColFrom;
  attribute vec3 aColTo;
  attribute float aRand;
  uniform float uMix;
  uniform float uTime;
  uniform float uSize;
  uniform float uMotion;
  uniform vec3 uPointer;
  uniform float uPointerForce;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = aRand * ${STAGGER.toFixed(2)};
    float m = smoothstep(d, d + ${(1 - STAGGER).toFixed(2)}, uMix);
    vec3 p = mix(aFrom, aTo, m);

    // Turbulência: quase parada com a forma pronta, forte no meio da viagem.
    float travel = sin(m * 3.14159);
    float amp = (0.012 + travel * 0.55) * uMotion;
    float t = uTime * 0.6;
    p += vec3(
      sin(t + aRand * 41.0 + p.y * 1.7),
      cos(t * 0.9 + aRand * 29.0 + p.x * 1.9),
      sin(t * 0.7 + aRand * 17.0)
    ) * amp;

    // O ponteiro empurra as partículas próximas (em espaço local).
    vec2 away = p.xy - uPointer.xy;
    float dist = length(away);
    p.xy += normalize(away + 1e-5) * smoothstep(0.85, 0.0, dist) * 0.32 * uPointerForce;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aRand * 0.9) / -mv.z;
    // Vaga-lume: a cor da forma puxada para o amarelo-esverdeado da luz dele,
    // o bastante para o conjunto parecer um enxame sem perder as cores do desenho.
    vColor = mix(mix(aColFrom, aColTo, m), vec3(0.95, 0.9, 0.5), 0.3);
    // Pisca devagar e fora de sincronia. Mínimo de 0,6 para a forma não sumir.
    float flick = 0.6 + 0.4 * pow(0.5 + 0.5 * sin(uTime * (0.7 + aRand * 1.9) + aRand * 80.0), 2.0);
    vAlpha = (0.45 + 0.55 * fract(aRand * 7.31)) * mix(1.0, flick, uMotion);
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    gl_FragColor = vec4(vColor, a * vAlpha * uOpacity);
  }
`;

// Objetos de rascunho do raycast do ponteiro. Só existe uma cena por página,
// então ficam no módulo em vez de alocar a cada frame.
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const ray = new THREE.Raycaster();
const hit = new THREE.Vector3();
const ndc = new THREE.Vector2();

function attr(g: THREE.BufferGeometry, name: string) {
  const a = g.getAttribute(name) as THREE.BufferAttribute;
  return { attr: a, array: a.array as Float32Array };
}

/** Congela em `aFrom` o que está na tela agora, para a próxima forma partir daí. */
function snapshot(g: THREE.BufferGeometry, rand: Float32Array, mix: number) {
  const from = attr(g, "aFrom");
  const to = attr(g, "aTo");
  const cf = attr(g, "aColFrom");
  const ct = attr(g, "aColTo");
  const n = rand.length;
  for (let i = 0; i < n; i++) {
    // Mesma curva por partícula do shader (smoothstep com atraso).
    const d = rand[i] * STAGGER;
    const x = Math.min(1, Math.max(0, (mix - d) / (1 - STAGGER)));
    const m = x * x * (3 - 2 * x);
    for (let k = 0; k < 3; k++) {
      const j = i * 3 + k;
      from.array[j] += (to.array[j] - from.array[j]) * m;
      cf.array[j] += (ct.array[j] - cf.array[j]) * m;
    }
  }
  from.attr.needsUpdate = true;
  cf.attr.needsUpdate = true;
}

function setTarget(g: THREE.BufferGeometry, shape: Shape) {
  const to = attr(g, "aTo");
  const ct = attr(g, "aColTo");
  to.array.set(shape.positions);
  ct.array.set(shape.colors);
  to.attr.needsUpdate = true;
  ct.attr.needsUpdate = true;
}

function ease(t: number) {
  // easeInOutCubic: arranque e chegada suaves.
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

type Props = { count: number; reducedMotion: boolean; font: string; name: string };

export function Particles({ count, reducedMotion, font, name }: Props) {
  const { camera, size, viewport } = useThree();
  const points = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);

  // Todas as formas são geradas uma vez; trocar de etapa só copia buffers.
  const shapes = useMemo<Record<ShapeKey, Shape>>(
    () => ({
      chaos: chaos(count),
      name: nameShape(count, name, font),
      sources: sources(count),
      lake: lake(count),
      dashboards: dashboards(count),
      phone: phone(count),
      tree: tree(count),
      helix: helix(count),
      sphere: sphere(count),
    }),
    [count, font, name],
  );
  const rand = useMemo(() => randoms(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    // `position` só serve para o three saber a contagem; quem posiciona de
    // verdade é o shader, a partir de aFrom/aTo.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(shapes.chaos.positions.slice(), 3));
    g.setAttribute("aTo", new THREE.BufferAttribute(shapes.chaos.positions.slice(), 3));
    g.setAttribute("aColFrom", new THREE.BufferAttribute(shapes.chaos.colors.slice(), 3));
    g.setAttribute("aColTo", new THREE.BufferAttribute(shapes.chaos.colors.slice(), 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [count, rand, shapes]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMix: { value: 1 },
          uTime: { value: 0 },
          uSize: { value: 28 },
          uMotion: { value: 1 },
          uOpacity: { value: 1 },
          uPointer: { value: new THREE.Vector3(99, 99, 0) },
          uPointerForce: { value: 0 },
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

  // Estado da transformação em andamento (fora do React).
  const morph = useRef({
    to: "chaos" as ShapeKey,
    start: -Infinity,
    layoutFrom: layoutFor("chaos", 1, 1),
    layoutTo: layoutFor("chaos", 1, 1),
    // Multiplicador de opacidade suavizado (1 = normal; DIMMED = atrás das capturas).
    dim: 1,
  });

  useFrame((state) => {
    const obj = points.current;
    if (!obj) return;
    // Geometria e material vêm do objeto montado (ref), não do escopo do render.
    const g = obj.geometry;
    const u = obj.material.uniforms;
    const mo = morph.current;
    const now = state.clock.elapsedTime;
    const duration = reducedMotion ? 0.001 : MORPH_SECONDS;

    let mix = Math.min(1, (now - mo.start) / duration);
    const wanted = sceneState.stage;
    if (wanted !== mo.to) {
      // Nova etapa: parte do que está na tela, não da forma anterior "pura".
      mo.layoutFrom = lerpLayout(mo.layoutFrom, mo.layoutTo, ease(mix));
      snapshot(g, rand, mix);
      setTarget(g, shapes[wanted]);
      mo.to = wanted;
      mo.start = now;
      mix = reducedMotion ? 1 : 0;
    }
    // O layout de destino acompanha o resize sem reiniciar a transformação.
    mo.layoutTo = layoutFor(mo.to, viewport.width, viewport.height);
    const L: Layout = lerpLayout(mo.layoutFrom, mo.layoutTo, ease(mix));

    const dimTarget = sceneState.dim ? DIMMED : 1;
    mo.dim = reducedMotion ? dimTarget : mo.dim + (dimTarget - mo.dim) * 0.06;

    u.uMix.value = mix;
    u.uTime.value = reducedMotion ? 0 : now;
    u.uMotion.value = reducedMotion ? 0 : 1;
    u.uOpacity.value = L.opacity * mo.dim;
    // Tamanho do ponto em pixels de tela, corrigido pela densidade de pixels.
    u.uSize.value = 26 * Math.min(state.gl.getPixelRatio(), 2) * (size.height / 900) ** 0.5;

    obj.position.set(L.x, L.y, 0);
    obj.scale.setScalar(L.scale);
    // Balanço leve em Y dá profundidade às formas 3D; o nome fica parado (sway 0).
    const p = sceneState.pointer;
    const swayT = reducedMotion ? 0 : now;
    obj.rotation.y = L.sway * (Math.sin(swayT * 0.25) * 0.45 + p.x * 0.15);
    obj.rotation.x = L.sway * (p.y * -0.08);

    // Ponteiro → plano z=0 → espaço local do objeto.
    const force = p.active && !reducedMotion ? 1 : 0;
    u.uPointerForce.value += (force - u.uPointerForce.value) * 0.08;
    if (p.active) {
      ray.setFromCamera(ndc.set(p.x, p.y), camera);
      if (ray.ray.intersectPlane(plane, hit)) {
        obj.worldToLocal(hit);
        (u.uPointer.value as THREE.Vector3).copy(hit);
      }
    }
  });

  // frustumCulled={false}: as partículas se movem no shader, e o culling do
  // three (que olha `position`, toda zerada) poderia esconder o objeto.
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
