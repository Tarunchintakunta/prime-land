"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { portalVert, portalFrag } from "./shaders";
import { useScrollStore } from "@/components/providers/ScrollStore";

interface Props {
  /** "idle" = resting icosahedron, "graduation" = morphs to BEGIN on scroll. */
  mode?: "idle" | "graduation";
  count?: number;
}

/**
 * Builds an icosahedral particle cloud of `count` points on a sphere, with
 * a morph target attribute pre-populated with either an outward scatter
 * (idle) or a BEGIN letterform sampling (graduation). The uMorph uniform is
 * driven by the zustand store (Chapter 8 writes it; Chapter 1 leaves it 0).
 */
export function ParticleIcosahedron({ mode = "idle", count = 8000 }: Props) {
  const meshRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Build geometry once on mount. Icosahedron-based distribution: we use
  // IcosahedronGeometry to seed face-normal orientation, then scatter points
  // across that surface.
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const morphPositions = new Float32Array(count * 3);
    const scatter = new Float32Array(count);

    // Use a base icosahedron to sample from so particles respect facet seams.
    const base = new THREE.IcosahedronGeometry(1.6, 4);
    const basePos = base.attributes.position as THREE.BufferAttribute;
    const baseCount = basePos.count;

    for (let i = 0; i < count; i++) {
      // Pick a random vertex on the base icosahedron; jitter slightly along
      // its normal so we're not perfectly on the mesh.
      const idx = Math.floor(Math.random() * baseCount);
      const vx = basePos.getX(idx);
      const vy = basePos.getY(idx);
      const vz = basePos.getZ(idx);
      const jitter = 0.02 + Math.random() * 0.04;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
      const nx = vx / len;
      const ny = vy / len;
      const nz = vz / len;

      positions[i * 3] = vx + nx * jitter * sign;
      positions[i * 3 + 1] = vy + ny * jitter * sign;
      positions[i * 3 + 2] = vz + nz * jitter * sign;

      scatter[i] = Math.random();

      // Morph targets: for idle mode, gently scatter outward; for graduation,
      // Chapter 8 overwrites these with letter samples before mounting.
      if (mode === "graduation") {
        morphPositions[i * 3] = positions[i * 3] * 2.5;
        morphPositions[i * 3 + 1] = positions[i * 3 + 1] * 2.5;
        morphPositions[i * 3 + 2] = positions[i * 3 + 2] * 2.5;
      } else {
        // Idle target: subtle explosion outward — not animated unless uMorph rises.
        morphPositions[i * 3] = positions[i * 3] * 1.3;
        morphPositions[i * 3 + 1] = positions[i * 3 + 1] * 1.3;
        morphPositions[i * 3 + 2] = positions[i * 3 + 2] * 1.3;
      }
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute(
      "aMorphPosition",
      new THREE.BufferAttribute(morphPositions, 3)
    );
    geom.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 1));
    base.dispose();
    return geom;
  }, [count, mode]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 18 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
      uColorGold: { value: new THREE.Color("#d4a574") },
      uColorElectric: { value: new THREE.Color("#5b6cff") },
    }),
    []
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    // Slow Y-axis rotation + breathing scale oscillation.
    mesh.rotation.y += delta * 0.1;
    mesh.rotation.x += delta * 0.02;
    const t = performance.now() / 1000;
    const breathe = 1 + Math.sin(t / 2) * 0.015;
    mesh.scale.setScalar(breathe);

    // Tick uniforms
    (mat.uniforms.uTime.value as number) = t;

    // Graduation morph is driven by the morph store value; idle stays at 0.
    if (mode === "graduation") {
      const target = useScrollStore.getState().morph;
      const current = mat.uniforms.uMorph.value as number;
      mat.uniforms.uMorph.value = current + (target - current) * 0.08;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={portalVert}
        fragmentShader={portalFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
