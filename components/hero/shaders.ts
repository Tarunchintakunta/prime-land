/**
 * Portal shaders — inlined as template literals (avoids a webpack loader).
 *
 * The vertex shader sizes points based on distance-to-camera so particles
 * near the camera appear larger. It also supports a morph target (uMorph 0→1
 * lerps between aPosition and aMorphPosition) for Chapter 8's "BEGIN" reveal.
 *
 * The fragment shader draws a soft radial falloff disc and lerps the color
 * between gold and electric based on depth — near particles read electric,
 * far ones read gold, producing a gradient front-to-back.
 */

export const portalVert = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;          // 0 = idle icosahedron, 1 = morphed (Ch8)
  uniform float uPixelRatio;
  uniform float uSize;

  attribute vec3 aMorphPosition; // target positions for Chapter 8 morph
  attribute float aScatter;      // per-particle random offset, 0..1

  varying float vDepth;
  varying float vScatter;

  void main() {
    // Blend between resting icosahedron position and the morph target.
    vec3 basePos = mix(position, aMorphPosition, uMorph);

    // Light breathing: every particle drifts along its normal by a tiny,
    // desynchronized sine wave. Keeps the object feeling alive.
    float breathe = sin(uTime * 0.8 + aScatter * 6.2831) * 0.015;
    vec3 pos = basePos + normalize(basePos) * breathe;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size falls off with depth so near particles bloom.
    float depth = -mvPosition.z;
    gl_PointSize = uSize * uPixelRatio * (1.0 / max(depth, 0.1));

    vDepth = depth;
    vScatter = aScatter;
  }
`;

export const portalFrag = /* glsl */ `
  precision highp float;

  uniform vec3 uColorGold;
  uniform vec3 uColorElectric;

  varying float vDepth;
  varying float vScatter;

  void main() {
    // Soft radial falloff (Gaussian-ish): sharper center, feathered edge.
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 1.6);

    if (alpha < 0.02) discard;

    // Depth 0 (closest) → electric; depth 8+ (far) → gold. Adds a subtle
    // warm/cool split across the object as the camera dollies through it.
    float t = clamp(vDepth / 8.0, 0.0, 1.0);
    vec3 color = mix(uColorElectric, uColorGold, t);

    // Slight per-particle tint variation
    color *= 0.85 + vScatter * 0.3;

    gl_FragColor = vec4(color, alpha);
  }
`;
