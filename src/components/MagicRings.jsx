import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'
import './MagicRings.css'

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const FRAG = `#version 300 es
precision highp float;
uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;
out vec4 fragColor;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  fragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}
`

export default function MagicRings({
  color = '#fc42ff', colorTwo = '#42fcff', speed = 1, ringCount = 6,
  attenuation = 10, lineThickness = 2, baseRadius = 0.35, radiusStep = 0.1,
  scaleRate = 0.1, opacity = 1, blur = 0, noiseAmount = 0.1, rotation = 0,
  ringGap = 1.5, fadeIn = 0.7, fadeOut = 0.5, followMouse = false,
  mouseInfluence = 0.2, hoverScale = 1.2, parallax = 0.05, clickBurst = false,
}) {
  const mountRef = useRef(null)
  const propsRef = useRef(null)
  const mouseRef = useRef([0, 0])
  const smoothMouseRef = useRef([0, 0])
  const hoverRef = useRef(0)
  const hoveredRef = useRef(false)
  const burstRef = useRef(0)

  propsRef.current = { color, colorTwo, speed, ringCount, attenuation, lineThickness, baseRadius, radiusStep, scaleRate, opacity, noiseAmount, rotation, ringGap, fadeIn, fadeOut, followMouse, mouseInfluence, hoverScale, parallax, clickBurst }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined
    let renderer
    try { renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true }) } catch { mount.classList.add('magic-rings-fallback'); return undefined }
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const colorA = new Color(color)
    const colorB = new Color(colorTwo)
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      uniforms: {
        uTime: { value: 0 }, uAttenuation: { value: attenuation },
        uResolution: { value: [1, 1] }, uColor: { value: [colorA.r, colorA.g, colorA.b] },
        uColorTwo: { value: [colorB.r, colorB.g, colorB.b] }, uLineThickness: { value: lineThickness },
        uBaseRadius: { value: baseRadius }, uRadiusStep: { value: radiusStep }, uScaleRate: { value: scaleRate },
        uRingCount: { value: ringCount }, uOpacity: { value: opacity }, uNoiseAmount: { value: noiseAmount },
        uRotation: { value: rotation }, uRingGap: { value: ringGap }, uFadeIn: { value: fadeIn },
        uFadeOut: { value: fadeOut }, uMouse: { value: [0, 0] }, uMouseInfluence: { value: 0 },
        uHoverAmount: { value: 0 }, uHoverScale: { value: hoverScale }, uParallax: { value: parallax }, uBurst: { value: 0 },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    mount.appendChild(gl.canvas)

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1
      renderer.dpr = Math.min(window.devicePixelRatio, 2)
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width * renderer.dpr, height * renderer.dpr]
    }
    const move = (event) => {
      const rect = mount.getBoundingClientRect()
      mouseRef.current = [(event.clientX - rect.left) / rect.width - .5, -((event.clientY - rect.top) / rect.height - .5)]
    }
    const enter = () => { hoveredRef.current = true }
    const leave = () => { hoveredRef.current = false; mouseRef.current = [0, 0] }
    const click = () => { burstRef.current = 1 }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    mount.addEventListener('pointermove', move)
    mount.addEventListener('pointerenter', enter)
    mount.addEventListener('pointerleave', leave)
    mount.addEventListener('click', click)
    resize()

    let frame
    const animate = (time) => {
      frame = requestAnimationFrame(animate)
      const p = propsRef.current
      smoothMouseRef.current[0] += (mouseRef.current[0] - smoothMouseRef.current[0]) * .06
      smoothMouseRef.current[1] += (mouseRef.current[1] - smoothMouseRef.current[1]) * .06
      hoverRef.current += ((hoveredRef.current ? 1 : 0) - hoverRef.current) * .06
      burstRef.current *= .94
      const a = new Color(p.color); const b = new Color(p.colorTwo)
      Object.assign(program.uniforms.uTime, { value: time * .001 * p.speed })
      program.uniforms.uAttenuation.value = p.attenuation
      program.uniforms.uColor.value = [a.r, a.g, a.b]
      program.uniforms.uColorTwo.value = [b.r, b.g, b.b]
      program.uniforms.uLineThickness.value = p.lineThickness
      program.uniforms.uBaseRadius.value = p.baseRadius
      program.uniforms.uRadiusStep.value = p.radiusStep
      program.uniforms.uScaleRate.value = p.scaleRate
      program.uniforms.uRingCount.value = p.ringCount
      program.uniforms.uOpacity.value = p.opacity
      program.uniforms.uNoiseAmount.value = p.noiseAmount
      program.uniforms.uRotation.value = p.rotation * Math.PI / 180
      program.uniforms.uRingGap.value = p.ringGap
      program.uniforms.uFadeIn.value = p.fadeIn
      program.uniforms.uFadeOut.value = p.fadeOut
      program.uniforms.uMouse.value = smoothMouseRef.current
      program.uniforms.uMouseInfluence.value = p.followMouse ? p.mouseInfluence : 0
      program.uniforms.uHoverAmount.value = hoverRef.current
      program.uniforms.uHoverScale.value = p.hoverScale
      program.uniforms.uParallax.value = p.parallax
      program.uniforms.uBurst.value = p.clickBurst ? burstRef.current : 0
      renderer.render({ scene: mesh })
    }
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      mount.removeEventListener('pointermove', move)
      mount.removeEventListener('pointerenter', enter)
      mount.removeEventListener('pointerleave', leave)
      mount.removeEventListener('click', click)
      if (gl.canvas.parentNode === mount) mount.removeChild(gl.canvas)
    }
  }, [])

  return <div ref={mountRef} className="magic-rings-container" style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined} />
}
