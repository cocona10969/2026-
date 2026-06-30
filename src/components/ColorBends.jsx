import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl'
import './ColorBends.css'

const MAX_COLORS = 8
const VERT = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }
`
const FRAG = `#version 300 es
precision highp float;
#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
in vec2 vUv;
out vec4 fragColor;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  q += (uPointer - rp) * uMouseInfluence * 0.2;
  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }
  vec3 col = vec3(0.0);
  float alpha = 1.0;
  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; i++) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 warped = s + (r - s) * kBelow * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    alpha = uTransparent > 0 ? cover : 1.0;
  }
  col *= uIntensity;
  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col = clamp(col + (n - 0.5) * uNoise, 0.0, 1.0);
  }
  vec3 rgb = uTransparent > 0 ? col * alpha : col;
  fragColor = vec4(rgb, alpha);
}
`

const toColorArray = (colors) => {
  const values = (colors || []).filter(Boolean).slice(0, MAX_COLORS).map((hex) => {
    const color = new Color(hex)
    return [color.r, color.g, color.b]
  })
  while (values.length < MAX_COLORS) values.push([0, 0, 0])
  return values
}

export default function ColorBends({
  className = '', style, rotation = 90, autoRotate = 0, speed = 0.2,
  colors = [], transparent = true, scale = 1, frequency = 1, warpStrength = 1,
  mouseInfluence = 1, parallax = 0.5, noise = 0.15, iterations = 1,
  intensity = 1.5, bandWidth = 6,
}) {
  const containerRef = useRef(null)
  const propsRef = useRef(null)
  const pointerTarget = useRef([0, 0])
  const pointerCurrent = useRef([0, 0])
  propsRef.current = { rotation, autoRotate, speed, colors, transparent, scale, frequency, warpStrength, mouseInfluence, parallax, noise, iterations, intensity, bandWidth }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    let renderer
    try { renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) }) } catch { container.classList.add('color-bends-fallback'); return undefined }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const uniforms = {
      uCanvas: { value: [1, 1] }, uTime: { value: 0 }, uSpeed: { value: speed }, uRot: { value: [1, 0] },
      uColorCount: { value: Math.min(colors.length, MAX_COLORS) }, uColors: { value: toColorArray(colors) },
      uTransparent: { value: transparent ? 1 : 0 }, uScale: { value: scale }, uFrequency: { value: frequency },
      uWarpStrength: { value: warpStrength }, uPointer: { value: [0, 0] }, uMouseInfluence: { value: mouseInfluence },
      uParallax: { value: parallax }, uNoise: { value: noise }, uIterations: { value: iterations },
      uIntensity: { value: intensity }, uBandWidth: { value: bandWidth },
    }
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms })
    const mesh = new Mesh(gl, { geometry, program })
    container.appendChild(gl.canvas)
    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height)
      uniforms.uCanvas.value = [width, height]
    }
    const move = (event) => {
      const rect = container.getBoundingClientRect()
      pointerTarget.current = [((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1)]
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    window.addEventListener('pointermove', move, { passive: true })
    resize()
    let frame
    const start = performance.now()
    const loop = (time) => {
      frame = requestAnimationFrame(loop)
      const p = propsRef.current
      const elapsed = (time - start) / 1000
      pointerCurrent.current[0] += (pointerTarget.current[0] - pointerCurrent.current[0]) * .06
      pointerCurrent.current[1] += (pointerTarget.current[1] - pointerCurrent.current[1]) * .06
      const radians = ((p.rotation + p.autoRotate * elapsed) * Math.PI) / 180
      uniforms.uTime.value = elapsed
      uniforms.uSpeed.value = p.speed
      uniforms.uRot.value = [Math.cos(radians), Math.sin(radians)]
      uniforms.uColorCount.value = Math.min(p.colors.length, MAX_COLORS)
      uniforms.uColors.value = toColorArray(p.colors)
      uniforms.uTransparent.value = p.transparent ? 1 : 0
      uniforms.uScale.value = p.scale
      uniforms.uFrequency.value = p.frequency
      uniforms.uWarpStrength.value = p.warpStrength
      uniforms.uPointer.value = pointerCurrent.current
      uniforms.uMouseInfluence.value = p.mouseInfluence
      uniforms.uParallax.value = p.parallax
      uniforms.uNoise.value = p.noise
      uniforms.uIterations.value = p.iterations
      uniforms.uIntensity.value = p.intensity
      uniforms.uBandWidth.value = p.bandWidth
      renderer.render({ scene: mesh })
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', move)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
    }
  }, [])

  return <div ref={containerRef} className={`color-bends-container ${className}`.trim()} style={style} />
}
