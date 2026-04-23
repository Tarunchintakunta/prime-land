"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useEffect, useRef, useState } from "react";
import { ParticleIcosahedron } from "./ParticleIcosahedron";
import { useScrollStore } from "@/components/providers/ScrollStore";
import { FallbackHero } from "./FallbackHero";

interface Props {
  mode?: "idle" | "graduation";
  /**
   * Source of camera dolly 0→1:
   *  - "portal"    → reads scrollStore.portalProgress (Chapter 1)
   *  - "graduation"→ static hold at center (Chapter 8 uses morph, not dolly)
   */
  source?: "portal" | "graduation";
}

/**
 * WebGL hero canvas. Mounted at the layout level or inside Chapter1Gate
 * and Chapter 8 depending on context; takes its scroll value from the
 * zustand store so it doesn't own its own ScrollTrigger (per PRD §Scroll
 * Choreography Rule 4).
 *
 * Graceful degradation: feature-detects low-end devices (navigator.hard-
 * wareConcurrency < 4) and falls back to a static SVG. Also bails if the
 * user prefers reduced motion.
 */
export function PortalScene({ mode = "idle", source = "portal" }: Props) {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lowCore =
      typeof navigator !== "undefined" &&
      (navigator.hardwareConcurrency ?? 4) < 4;
    const forceFallback = new URL(window.location.href).searchParams.get("nowebgl") === "1";

    if (prefersReduced || lowCore || forceFallback) {
      document.body.classList.add("no-webgl");
      setCanRender(false);
    } else {
      setCanRender(true);
    }
  }, []);

  if (canRender === null) {
    // First render server-side — show fallback to avoid hydration mismatch;
    // client swaps to canvas on the next tick if capable.
    return <FallbackHero />;
  }
  if (!canRender) return <FallbackHero />;

  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label={
        mode === "graduation"
          ? "Animated particle cloud forming the word Begin"
          : "Animated particle portal, the Prime Learning gate"
      }
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
      >
        <SceneInterior mode={mode} source={source} />
      </Canvas>
    </div>
  );
}

function SceneInterior({ mode, source }: Required<Props>) {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      targetMouse.current.x = (e.clientX / size.width - 0.5) * 2;
      targetMouse.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size.width, size.height]);

  useFrame(() => {
    // Damp mouse toward target — never snap.
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05;

    // Parallax: max ±0.05 rad rotation on the camera.
    camera.rotation.x = -mouse.current.y * 0.05;
    camera.rotation.y = -mouse.current.x * 0.05;

    if (source === "portal") {
      // Camera z: 5 (outside, looking at the object) → -2 (inside it)
      // driven by portalProgress 0→1.
      const p = useScrollStore.getState().portalProgress;
      const targetZ = 5 - p * 7;
      camera.position.z += (targetZ - camera.position.z) * 0.12;
    } else {
      // Graduation: camera holds at z ~ 4 so the morphing is clearly visible.
      const targetZ = 4;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
    }
  });

  return (
    <>
      {/* Radial shader-ish gradient via a back-plane, cheap and effective.
          A giant dark sphere behind the particles with a lit bottom. */}
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>

      <ParticleIcosahedron mode={mode} count={8000} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new Vector2(0.001, 0.001)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}
