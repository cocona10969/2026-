import { useEffect, useRef, useState } from 'react'
import { Camera, GLTFLoader, Program, Renderer, Transform } from 'ogl'
import AvatarBot3D from './AvatarBot3D'
import './AvatarBot3D.css'

const VERT = `
  precision highp float;
  precision highp int;

  attribute vec3 position;
  attribute vec3 normal;

  uniform mat3 normalMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-viewPosition.xyz);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const FRAG = `
  precision highp float;
  precision highp int;

  uniform vec4 uBaseColor;
  uniform vec3 uLightA;
  uniform vec3 uLightB;

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 n = normalize(vNormal);
    float key = max(dot(n, normalize(uLightA)), 0.0);
    float fill = max(dot(n, normalize(uLightB)), 0.0);
    float rim = pow(1.0 - max(dot(n, vView), 0.0), 2.2);
    vec3 color = uBaseColor.rgb * (0.34 + key * 0.72 + fill * 0.18);
    color += vec3(1.0, 0.58, 0.86) * rim * 0.18;
    color = pow(color, vec3(0.92));
    gl_FragColor = vec4(color, uBaseColor.a);
  }
`

const MODEL_URL = '/models/avatar.glb?v=reference-white-blue-cat-v2'

export default function AvatarModel3D() {
  const containerRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let disposed = false
    let frame
    let renderer
    let gl

    const run = async () => {
      try {
        const exists = await fetch(MODEL_URL, { method: 'HEAD' })
        if (!exists.ok) throw new Error('model not found')

        renderer = new Renderer({
          alpha: true,
          antialias: true,
          dpr: Math.min(window.devicePixelRatio || 1, 2),
        })
        gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)
        container.appendChild(gl.canvas)

        const camera = new Camera(gl, { fov: 34, near: 0.1, far: 100 })
        camera.position.set(0, 0.02, 5.2)

        const root = new Transform()
        root.position.set(0, -0.1, 0)
        root.scale.set(1.06)

        const gltf = await GLTFLoader.load(gl, MODEL_URL)
        gltf.scene.forEach((node) => node.setParent(root))

        root.traverse((node) => {
          if (!node.program) return
          const mat = node.program.gltfMaterial
          const color = mat?.baseColorFactor || [1, 1, 1, 1]
          node.program = makeProgram(gl, color)
          node.frustumCulled = false
        })

        const resize = () => {
          const width = container.clientWidth || 1
          const height = container.clientHeight || 1
          renderer.setSize(width, height)
          camera.perspective({ aspect: width / height })
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

        const loop = (time) => {
          if (disposed) return
          frame = requestAnimationFrame(loop)
          const target = targetRef.current
          const current = currentRef.current
          current.x += (target.x - current.x) * 0.075
          current.y += (target.y - current.y) * 0.075
          root.rotation.y = current.x * 0.46 + Math.sin(time * 0.0011) * 0.025
          root.rotation.x = current.y * -0.18 + Math.sin(time * 0.0014) * 0.012
          root.position.y = -0.1 + Math.sin(time * 0.0018) * 0.018
          renderer.render({ scene: root, camera, sort: false, clear: true })
        }
        frame = requestAnimationFrame(loop)

        return () => {
          observer.disconnect()
          container.removeEventListener('pointermove', handlePointerMove)
          container.removeEventListener('pointerleave', resetPointer)
        }
      } catch {
        if (!disposed) setFallback(true)
      }
      return undefined
    }

    let cleanup
    run().then((fn) => {
      cleanup = fn
    })

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      if (cleanup) cleanup()
      if (gl?.canvas?.parentNode === container) container.removeChild(gl.canvas)
    }
  }, [])

  if (fallback) return <AvatarBot3D />
  return <div className="avatar-bot-3d avatar-model-3d" ref={containerRef} aria-label="GLB 3D 头像模型" />
}

function makeProgram(gl, color) {
  return new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    cullFace: false,
    transparent: color[3] < 1,
    uniforms: {
      uBaseColor: { value: color },
      uLightA: { value: [-0.45, 0.82, 0.48] },
      uLightB: { value: [0.7, 0.28, 0.55] },
    },
  })
}
