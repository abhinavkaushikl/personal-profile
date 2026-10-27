'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { motionStore } from '@/lib/store';

// Stars live in screen space (px). Depth drives parallax speed, size, brightness and how hard
// the cursor's gravitational lens bends them. Everything wraps toroidally so the field is endless.
const COMMON = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uGravity;
uniform float uPR;
uniform float uFade;
attribute vec2 aPos;
attribute float aDepth;
attribute float aPhase;
attribute float aSize;
attribute float aDrift;

float parallax() { return 0.04 + 0.5 * aDepth * aDepth; }

vec2 starPos() {
  float m = 60.0;
  vec2 W = uRes + 2.0 * m;
  vec2 p = aPos * W;
  p.x += uTime * (2.0 + 10.0 * aDepth) * aDrift;
  p.y -= uScroll * parallax();
  p = mod(p, W) - m;
  vec2 d = p - uMouse;
  float r = length(d);
  float R = 170.0;
  float f = uGravity * exp(-(r * r) / (2.0 * R * R)) * (0.35 + aDepth);
  p += (r > 0.001 ? d / r : vec2(0.0)) * f * 46.0;
  return p;
}

vec4 toClip(vec2 p) {
  vec2 c = p / uRes * 2.0 - 1.0;
  return vec4(c.x, -c.y, 0.0, 1.0);
}
`;

const POINT_VS = /* glsl */ `
${COMMON}
varying float vAlpha;
varying float vTint;
void main() {
  vec2 p = starPos();
  gl_Position = toClip(p);
  float tw = 0.72 + 0.28 * sin(uTime * (0.5 + aPhase * 2.2) + aPhase * 50.0);
  vAlpha = (0.16 + 0.84 * aDepth) * tw * uFade;
  vTint = fract(aPhase * 13.37);
  gl_PointSize = aSize * (0.55 + aDepth * 1.5) * 3.0 * uPR;
}
`;

const POINT_FS = /* glsl */ `
varying float vAlpha;
varying float vTint;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  float a = (exp(-d2 * 80.0) + exp(-d2 * 18.0) * 0.25) * vAlpha;
  if (a < 0.004) discard;
  vec3 col = vec3(0.86, 0.91, 1.0);
  if (vTint > 0.8) col = vec3(1.0, 0.9, 0.78);
  if (vTint > 0.94) col = vec3(0.45, 0.92, 0.98);
  gl_FragColor = vec4(col, a);
}
`;

// Each star also owns a 2-vertex segment; the tail vertex is pushed back along the motion vector
// (scroll velocity) and toward the vanishing point (warp), producing physically-motivated streaks.
const LINE_VS = /* glsl */ `
${COMMON}
attribute float aTail;
uniform float uVel;
uniform float uWarp;
varying float vAlpha;
void main() {
  vec2 p = starPos();
  vec2 off = vec2(0.0, clamp(uVel, -80.0, 80.0) * parallax() * 5.0);
  vec2 dir = p - uRes * 0.5;
  off -= dir * uWarp * (0.1 + 0.9 * aDepth) * 0.85;
  p += off * aTail;
  gl_Position = toClip(p);
  float sv = smoothstep(2.0, 30.0, abs(uVel)) * 0.6;
  vAlpha = (sv + uWarp * 0.9) * (0.15 + 0.85 * aDepth) * (1.0 - aTail) * uFade;
}
`;

const LINE_FS = /* glsl */ `
varying float vAlpha;
void main() {
  gl_FragColor = vec4(0.82, 0.9, 1.0, vAlpha);
}
`;

function buildField(count: number) {
  const pos = new Float32Array(count * 2);
  const depth = new Float32Array(count);
  const phase = new Float32Array(count);
  const size = new Float32Array(count);
  const drift = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 2] = Math.random();
    pos[i * 2 + 1] = Math.random();
    depth[i] = 0.05 + 0.95 * Math.pow(Math.random(), 2.2);
    phase[i] = Math.random();
    size[i] = Math.random() > 0.985 ? 2.6 + Math.random() * 1.2 : 0.7 + Math.random() * 1.3;
    drift[i] = -(0.6 + Math.random() * 0.4);
  }
  return { pos, depth, phase, size, drift };
}

function Stars({ count, reduced }: { count: number; reduced: boolean }) {
  const { size, gl, invalidate } = useThree();
  const lastScroll = useRef(motionStore.scroll);
  const vel = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: motionStore.scroll },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uGravity: { value: 0 },
      uPR: { value: 1 },
      uFade: { value: reduced ? 1 : 0 },
      uVel: { value: 0 },
      uWarp: { value: 0 },
    }),
    [reduced],
  );

  const [points, lines] = useMemo(() => {
    const f = buildField(count);

    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    pg.setAttribute('aPos', new THREE.BufferAttribute(f.pos, 2));
    pg.setAttribute('aDepth', new THREE.BufferAttribute(f.depth, 1));
    pg.setAttribute('aPhase', new THREE.BufferAttribute(f.phase, 1));
    pg.setAttribute('aSize', new THREE.BufferAttribute(f.size, 1));
    pg.setAttribute('aDrift', new THREE.BufferAttribute(f.drift, 1));

    const n2 = count * 2;
    const lPos = new Float32Array(n2 * 2);
    const lDepth = new Float32Array(n2);
    const lPhase = new Float32Array(n2);
    const lSize = new Float32Array(n2);
    const lDrift = new Float32Array(n2);
    const lTail = new Float32Array(n2);
    for (let i = 0; i < count; i++) {
      for (let k = 0; k < 2; k++) {
        const j = i * 2 + k;
        lPos[j * 2] = f.pos[i * 2];
        lPos[j * 2 + 1] = f.pos[i * 2 + 1];
        lDepth[j] = f.depth[i];
        lPhase[j] = f.phase[i];
        lSize[j] = f.size[i];
        lDrift[j] = f.drift[i];
        lTail[j] = k;
      }
    }
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n2 * 3), 3));
    lg.setAttribute('aPos', new THREE.BufferAttribute(lPos, 2));
    lg.setAttribute('aDepth', new THREE.BufferAttribute(lDepth, 1));
    lg.setAttribute('aPhase', new THREE.BufferAttribute(lPhase, 1));
    lg.setAttribute('aSize', new THREE.BufferAttribute(lSize, 1));
    lg.setAttribute('aDrift', new THREE.BufferAttribute(lDrift, 1));
    lg.setAttribute('aTail', new THREE.BufferAttribute(lTail, 1));

    const shared = {
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    };
    const p = new THREE.Points(pg, new THREE.ShaderMaterial({ ...shared, vertexShader: POINT_VS, fragmentShader: POINT_FS }));
    const l = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ ...shared, vertexShader: LINE_VS, fragmentShader: LINE_FS }));
    p.frustumCulled = false;
    l.frustumCulled = false;
    return [p, l];
  }, [count, uniforms]);

  useEffect(
    () => () => {
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
      lines.geometry.dispose();
      (lines.material as THREE.Material).dispose();
    },
    [points, lines],
  );

  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uPR.value = gl.getPixelRatio();
    invalidate();
  }, [size, gl, uniforms, invalidate]);

  useFrame((_, rawDt) => {
    if (reduced) return;
    const dt = Math.min(rawDt, 0.05);
    const u = uniforms;
    u.uTime.value += dt;
    u.uFade.value = Math.min(1, u.uFade.value + dt * 0.7);

    const s = motionStore.scroll;
    const raw = dt > 0 ? (s - lastScroll.current) / (dt * 60) : 0;
    lastScroll.current = s;
    vel.current += (raw - vel.current) * (1 - Math.exp(-dt * 8));
    u.uVel.value = vel.current;
    u.uScroll.value = s;

    const w = motionStore.warp;
    u.uWarp.value = Math.pow(Math.min(w, 1.2), 1.6);
    motionStore.warp = Math.max(0, w - dt * 0.5);

    const m = u.uMouse.value;
    if (m.x < -5000) m.set(motionStore.mouseX, motionStore.mouseY);
    const k = 1 - Math.exp(-dt * 5);
    m.x += (motionStore.mouseX - m.x) * k;
    m.y += (motionStore.mouseY - m.y) * k;
    const gt = motionStore.mouseActive ? 1 : 0;
    u.uGravity.value += (gt - u.uGravity.value) * (1 - Math.exp(-dt * 2.5));
  });

  return (
    <>
      <primitive object={lines} />
      <primitive object={points} />
    </>
  );
}

export default function Starfield() {
  const [cfg, setCfg] = useState<{ count: number; reduced: boolean } | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCfg({ count: window.innerWidth < 768 ? 1400 : 3200, reduced });
    if (!reduced) motionStore.warp = 1.15;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      motionStore.mouseX = e.clientX;
      motionStore.mouseY = e.clientY;
      motionStore.mouseActive = true;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) motionStore.mouseActive = false;
    };
    const onBlur = () => (motionStore.mouseActive = false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  if (!cfg) return null;
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop={cfg.reduced ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Stars count={cfg.count} reduced={cfg.reduced} />
    </Canvas>
  );
}
