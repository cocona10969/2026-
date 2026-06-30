import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import './AvatarBot3D.css'

const VERT = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

struct Hit {
  float d;
  float id;
};

Hit mapScene(vec3 p) {
  float head = sdRoundBox(p, vec3(0.92, 0.55, 0.52), 0.28);
  float leftEar = sdSphere(p - vec3(-0.98, -0.03, 0.0), 0.26);
  float rightEar = sdSphere(p - vec3(0.98, -0.03, 0.0), 0.26);
  float base = opSmoothUnion(head, leftEar, 0.18);
  base = opSmoothUnion(base, rightEar, 0.18);
  float neck = sdRoundBox(p - vec3(0.0, -0.65, -0.02), vec3(0.36, 0.2, 0.32), 0.16);
  base = opSmoothUnion(base, neck, 0.16);
  return Hit(base, 1.0);
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.0018, 0.0);
  return normalize(vec3(
    mapScene(p + e.xyy).d - mapScene(p - e.xyy).d,
    mapScene(p + e.yxy).d - mapScene(p - e.yxy).d,
    mapScene(p + e.yyx).d - mapScene(p - e.yyx).d
  ));
}

float roundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  uv.y -= 0.06;

  vec2 look = clamp(uMouse, vec2(-1.0), vec2(1.0));
  float yaw = look.x * 0.38 + sin(uTime * 0.7) * 0.035;
  float pitch = -look.y * 0.24 + sin(uTime * 0.9) * 0.025;

  vec3 ro = vec3(0.0, 0.02, 3.25);
  vec3 rd = normalize(vec3(uv, -2.35));

  ro.xz *= rot(-yaw);
  rd.xz *= rot(-yaw);
  ro.yz *= rot(-pitch);
  rd.yz *= rot(-pitch);

  float t = 0.0;
  float d = 1.0;
  bool hit = false;
  for (int i = 0; i < 88; i++) {
    vec3 p = ro + rd * t;
    d = mapScene(p).d;
    if (d < 0.002) {
      hit = true;
      break;
    }
    if (t > 7.0) break;
    t += d * 0.82;
  }

  if (!hit) {
    fragColor = vec4(0.0);
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = getNormal(p);
  vec3 lightDir = normalize(vec3(-0.42, 0.72, 0.65));
  vec3 rimDir = normalize(vec3(0.8, 0.25, 0.7));
  float diff = max(dot(n, lightDir), 0.0);
  float rim = pow(max(dot(n, rimDir), 0.0), 3.0);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);

  vec3 purple = vec3(0.55, 0.22, 0.95);
  vec3 pink = vec3(1.0, 0.36, 0.66);
  vec3 shell = mix(vec3(0.42, 0.18, 0.78), pink, smoothstep(-0.7, 0.75, p.x) * 0.42);
  vec3 color = shell * (0.35 + diff * 0.72) + purple * fres * 0.45 + pink * rim * 0.42;

  bool front = p.z > 0.30;
  float visor = roundedRect(vec2(p.x, p.y + 0.03), vec2(0.54, 0.25), 0.16);
  if (front && visor < 0.0) {
    color = mix(color, vec3(0.03, 0.045, 0.075), 0.88);
    float vEdge = smoothstep(0.045, 0.0, abs(visor));
    color += vec3(0.72, 0.35, 1.0) * vEdge * 0.18;

    vec2 eyeOffset = look * vec2(0.075, -0.035);
    float leftEye = roundedRect(vec2(p.x + 0.22, p.y + 0.02) - eyeOffset, vec2(0.035, 0.095), 0.028);
    float rightEye = roundedRect(vec2(p.x - 0.22, p.y + 0.02) - eyeOffset, vec2(0.035, 0.095), 0.028);
    float eyes = 1.0 - smoothstep(0.0, 0.018, min(leftEye, rightEye));
    color += vec3(0.15, 0.88, 1.0) * eyes * (1.4 + 0.25 * sin(uTime * 2.0));
  }

  float alpha = smoothstep(6.8, 0.4, t);
  fragColor = vec4(color, alpha);
}
`

export default function AvatarBot3D() {
  const containerRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const uniforms = {
      uResolution: { value: [1, 1] },
      uMouse: { value: [0, 0] },
      uTime: { value: 0 },
    }
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms, transparent: true })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height)
      uniforms.uResolution.value = [width, height]
    }

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect()
      targetRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      targetRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const resetPointer = () => {
      targetRef.current.x = 0
      targetRef.current.y = 0
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', resetPointer)
    resize()

    const start = performance.now()
    let frame
    const loop = (time) => {
      frame = requestAnimationFrame(loop)
      const current = currentRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * 0.09
      current.y += (target.y - current.y) * 0.09
      uniforms.uMouse.value = [current.x, current.y]
      uniforms.uTime.value = (time - start) / 1000
      renderer.render({ scene: mesh })
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', resetPointer)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
    }
  }, [])

  return <div className="avatar-bot-3d" ref={containerRef} aria-label="可交互 3D 头像" />
}
