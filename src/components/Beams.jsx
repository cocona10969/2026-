import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import './Beams.css'

const VERT = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBeamWidth;
uniform float uBeamHeight;
uniform int uBeamNumber;
uniform vec3 uLightColor;
uniform float uSpeed;
uniform float uNoiseIntensity;
uniform float uScale;
uniform float uRotation;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.52;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p *= 2.04;
    amp *= 0.48;
  }
  return value;
}

void main() {
  vec2 p = vUv - 0.5;
  p.x *= uResolution.x / max(uResolution.y, 1.0);
  float cs = cos(uRotation), sn = sin(uRotation);
  p = mat2(cs, -sn, sn, cs) * p;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float xNorm = p.x / aspect + 0.5;
  float yNorm = p.y + 0.5;

  float topFalloff = smoothstep(1.08, 0.14, yNorm);
  float bottomMist = smoothstep(-0.08, 0.48, yNorm);
  float vignette = smoothstep(-0.22, 0.18, xNorm) * smoothstep(1.22, 0.82, xNorm);
  float total = 0.0;
  float sheen = 0.0;
  float softVolume = 0.0;

  for (int i = 0; i < 20; i++) {
    if (i >= uBeamNumber) break;
    float fi = float(i);
    float count = max(float(uBeamNumber), 1.0);
    float center = (fi + 0.5) / count;
    float phase = fi * 2.113;
    float drift = fbm(vec2(yNorm * (1.45 + uScale * 8.0) - uTime * uSpeed * 0.08, phase));
    float wave = sin(yNorm * (2.4 + uScale * 11.0) + uTime * uSpeed * 0.62 + phase) * 0.018;
    wave += (drift - 0.5) * 0.048 * uNoiseIntensity;

    float width = max(0.012, uBeamWidth * 0.017 / sqrt(count / 8.0));
    float d = abs(xNorm - center - wave);
    float core = 1.0 - smoothstep(width * 0.16, width * 0.86, d);
    float halo = 1.0 - smoothstep(width * 0.72, width * 4.6, d);
    float curtain = smoothstep(-0.02, 0.18, yNorm) * smoothstep(1.08, 0.52, yNorm);
    float rib = 0.74 + 0.26 * sin(yNorm * uBeamHeight * 0.48 + phase + uTime * uSpeed * 0.42);

    total += (core * 0.78 + halo * 0.24) * curtain * rib;
    sheen += core * curtain;
    softVolume += halo * curtain;
  }

  float mist = fbm(vec2(xNorm * 2.5, yNorm * 1.8 - uTime * uSpeed * 0.035));
  float overhead = smoothstep(1.05, 0.48, yNorm) * smoothstep(0.0, 0.42, yNorm);
  float centerGlow = 1.0 - smoothstep(0.0, 0.62, length(vec2((xNorm - 0.5) * 1.18, yNorm - 0.52)));

  vec3 purpleBase = vec3(0.055, 0.035, 0.086);
  vec3 color = purpleBase;
  color += uLightColor * total * topFalloff * vignette * 0.58;
  color += uLightColor * softVolume * mist * 0.13;
  color += vec3(0.58, 0.42, 0.92) * centerGlow * 0.12 * bottomMist;
  color += vec3(0.80, 0.96, 0.28) * sheen * 0.026;
  color *= 0.82 + overhead * 0.22;

  float grain = (hash(gl_FragCoord.xy + floor(uTime * 18.0)) - 0.5) * 0.018 * uNoiseIntensity;
  color += grain;

  float alpha = clamp((total * 0.36 + softVolume * 0.12 + centerGlow * 0.16) * vignette, 0.0, 0.94);
  fragColor = vec4(color, alpha);
}
`

export default function Beams({
  beamWidth = 2, beamHeight = 15, beamNumber = 12, lightColor = '#ffffff',
  speed = 2, noiseIntensity = 1.75, scale = 0.2, rotation = 0,
}) {
  const containerRef = useRef(null)
  const propsRef = useRef(null)
  propsRef.current = { beamWidth, beamHeight, beamNumber, lightColor, speed, noiseIntensity, scale, rotation }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    let renderer
    try { renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) }) } catch { container.classList.add('beams-fallback'); return undefined }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const initialColor = new Color(lightColor)
    const uniforms = {
      uResolution: { value: [1, 1] }, uTime: { value: 0 }, uBeamWidth: { value: beamWidth },
      uBeamHeight: { value: beamHeight }, uBeamNumber: { value: beamNumber },
      uLightColor: { value: [initialColor.r, initialColor.g, initialColor.b] }, uSpeed: { value: speed },
      uNoiseIntensity: { value: noiseIntensity }, uScale: { value: scale }, uRotation: { value: rotation },
    }
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms })
    const mesh = new Mesh(gl, { geometry, program })
    container.appendChild(gl.canvas)
    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height)
      uniforms.uResolution.value = [width, height]
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    const start = performance.now()
    let frame
    const loop = (time) => {
      frame = requestAnimationFrame(loop)
      const p = propsRef.current
      const color = new Color(p.lightColor)
      uniforms.uTime.value = (time - start) / 1000
      uniforms.uBeamWidth.value = p.beamWidth
      uniforms.uBeamHeight.value = p.beamHeight
      uniforms.uBeamNumber.value = Math.min(20, Math.max(1, p.beamNumber))
      uniforms.uLightColor.value = [color.r, color.g, color.b]
      uniforms.uSpeed.value = p.speed
      uniforms.uNoiseIntensity.value = p.noiseIntensity
      uniforms.uScale.value = p.scale
      uniforms.uRotation.value = p.rotation * Math.PI / 180
      renderer.render({ scene: mesh })
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
    }
  }, [])

  return <div ref={containerRef} className="beams-container" />
}
