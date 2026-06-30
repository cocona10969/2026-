import fs from 'node:fs'
import path from 'node:path'

const outPath = path.resolve('public/models/avatar.glb')

const materials = [
  material('skin_warm', [1.0, 0.58, 0.42, 1], 0.08, 0.58),
  material('hair_black_brown', [0.075, 0.052, 0.042, 1], 0.18, 0.38),
  material('hair_pink_tips', [1.0, 0.23, 0.55, 1], 0.05, 0.48),
  material('lens_smoky_plum', [0.12, 0.045, 0.075, 0.64], 0.05, 0.22, 'BLEND'),
  material('frame_wine', [0.23, 0.045, 0.065, 1], 0.08, 0.32),
  material('eye_dark', [0.025, 0.015, 0.012, 1], 0.02, 0.24),
  material('lip_rose', [0.74, 0.11, 0.13, 1], 0.02, 0.35),
  material('metal_silver', [0.82, 0.78, 0.74, 1], 0.82, 0.18),
  material('highlight_soft', [1.0, 0.78, 0.92, 1], 0.03, 0.45),
]

const primitives = []

// Face and head base
addSphere('head_face', 0, { scale: [0.95, 1.08, 0.78], translate: [0, 0.04, 0.03], segments: 48, rings: 30 })
addSphere('chin_soft', 0, { scale: [0.54, 0.32, 0.48], translate: [0, -0.68, 0.22], segments: 36, rings: 18 })
addSphere('neck', 0, { scale: [0.25, 0.34, 0.23], translate: [0, -1.12, -0.03], segments: 28, rings: 14 })

// Ears
addSphere('left_ear', 0, { scale: [0.18, 0.28, 0.13], translate: [-0.93, -0.03, 0.04], segments: 26, rings: 14 })
addSphere('right_ear', 0, { scale: [0.18, 0.28, 0.13], translate: [0.93, -0.03, 0.04], segments: 26, rings: 14 })
addSphere('left_inner_ear', 8, { scale: [0.07, 0.12, 0.035], translate: [-0.945, -0.035, 0.14], segments: 18, rings: 10 })
addSphere('right_inner_ear', 8, { scale: [0.07, 0.12, 0.035], translate: [0.945, -0.035, 0.14], segments: 18, rings: 10 })

// Hair shell and bob shape
addPartialSphere('hair_cap_back', 1, {
  scale: [1.08, 1.1, 0.84],
  translate: [0, 0.16, -0.12],
  thetaMin: 0,
  thetaMax: Math.PI * 0.98,
  phiMin: Math.PI * 0.08,
  phiMax: Math.PI * 0.92,
  segments: 56,
  rings: 28,
})
addPartialSphere('hair_lower_bob', 1, {
  scale: [1.13, 0.78, 0.76],
  translate: [0, -0.28, -0.14],
  thetaMin: 0,
  thetaMax: Math.PI,
  phiMin: Math.PI * 0.25,
  phiMax: Math.PI * 0.95,
  segments: 56,
  rings: 22,
})

// Pink hair tips along the lower bob
for (let i = 0; i < 18; i += 1) {
  const t = -0.9 + i * 0.106
  const y = -0.72 - Math.abs(t) * 0.06
  const z = 0.1 - Math.abs(t) * 0.03
  addSphere(`pink_tip_${i}`, 2, {
    scale: [0.055, 0.18, 0.035],
    translate: [t, y, z],
    rotate: [0, 0, -t * 0.38],
    segments: 14,
    rings: 8,
  })
}

// Bangs: slim curved-looking strands on forehead
for (let i = 0; i < 15; i += 1) {
  const x = -0.48 + i * 0.068
  const len = 0.22 + (i % 3) * 0.055
  addSphere(`bang_${i}`, 1, {
    scale: [0.034, len, 0.032],
    translate: [x, 0.52 - len * 0.42, 0.63],
    rotate: [0.04, 0, -0.22 + i * 0.033],
    segments: 14,
    rings: 8,
  })
}

// Brows and eyes behind glasses
addSphere('left_eye', 5, { scale: [0.12, 0.08, 0.035], translate: [-0.32, 0.11, 0.72], segments: 24, rings: 12 })
addSphere('right_eye', 5, { scale: [0.12, 0.08, 0.035], translate: [0.32, 0.11, 0.72], segments: 24, rings: 12 })
addBox('left_brow', 1, { scale: [0.29, 0.035, 0.035], translate: [-0.33, 0.33, 0.7], rotate: [0, 0, 0.13] })
addBox('right_brow', 1, { scale: [0.29, 0.035, 0.035], translate: [0.33, 0.33, 0.7], rotate: [0, 0, -0.13] })

// Sunglasses: lenses + chunky frame
addSphere('left_lens', 3, { scale: [0.38, 0.24, 0.055], translate: [-0.34, 0.12, 0.82], segments: 36, rings: 18 })
addSphere('right_lens', 3, { scale: [0.38, 0.24, 0.055], translate: [0.34, 0.12, 0.82], segments: 36, rings: 18 })
addTorus('left_frame', 4, { major: 0.265, minor: 0.025, scale: [1.42, 0.9, 0.28], translate: [-0.34, 0.12, 0.825], rotate: [0, 0, -0.04] })
addTorus('right_frame', 4, { major: 0.265, minor: 0.025, scale: [1.42, 0.9, 0.28], translate: [0.34, 0.12, 0.825], rotate: [0, 0, 0.04] })
addBox('glasses_bridge', 4, { scale: [0.15, 0.035, 0.035], translate: [0, 0.13, 0.84] })
addBox('left_arm', 4, { scale: [0.36, 0.035, 0.035], translate: [-0.73, 0.16, 0.74], rotate: [0, -0.58, -0.08] })
addBox('right_arm', 4, { scale: [0.36, 0.035, 0.035], translate: [0.73, 0.16, 0.74], rotate: [0, 0.58, 0.08] })

// Nose and lips
addSphere('nose', 0, { scale: [0.07, 0.09, 0.055], translate: [0, -0.1, 0.83], segments: 20, rings: 10 })
addSphere('upper_lip', 6, { scale: [0.16, 0.035, 0.035], translate: [0, -0.39, 0.75], segments: 24, rings: 10 })
addSphere('lower_lip', 6, { scale: [0.12, 0.032, 0.03], translate: [0, -0.435, 0.755], segments: 20, rings: 8 })

// Earrings and piercing
addTorus('left_earring_a', 7, { major: 0.075, minor: 0.012, translate: [-0.98, -0.24, 0.18], rotate: [Math.PI / 2, 0, 0] })
addTorus('left_earring_b', 7, { major: 0.055, minor: 0.01, translate: [-0.89, -0.27, 0.18], rotate: [Math.PI / 2, 0, 0] })
addTorus('right_earring_a', 7, { major: 0.075, minor: 0.012, translate: [0.98, -0.24, 0.18], rotate: [Math.PI / 2, 0, 0] })
addTorus('right_earring_b', 7, { major: 0.055, minor: 0.01, translate: [0.89, -0.27, 0.18], rotate: [Math.PI / 2, 0, 0] })
addSphere('right_piercing', 7, { scale: [0.028, 0.028, 0.028], translate: [1.02, 0.12, 0.15], segments: 14, rings: 8 })

// Subtle shine in hair
for (let i = 0; i < 7; i += 1) {
  addSphere(`hair_highlight_${i}`, 8, {
    scale: [0.028, 0.32, 0.012],
    translate: [-0.34 + i * 0.105, 0.45 - Math.abs(i - 3) * 0.035, 0.61],
    rotate: [0.05, 0, -0.14 + i * 0.045],
    segments: 10,
    rings: 6,
  })
}

writeGlb(primitives, materials, outPath)
console.log(`Generated ${outPath}`)

function material(name, baseColorFactor, metallicFactor = 0, roughnessFactor = 0.6, alphaMode = 'OPAQUE') {
  return {
    name,
    alphaMode,
    doubleSided: true,
    pbrMetallicRoughness: {
      baseColorFactor,
      metallicFactor,
      roughnessFactor,
    },
  }
}

function addSphere(name, materialIndex, opts = {}) {
  primitives.push({ name, materialIndex, ...sphere(opts) })
}

function addPartialSphere(name, materialIndex, opts = {}) {
  primitives.push({ name, materialIndex, ...sphere(opts) })
}

function addTorus(name, materialIndex, opts = {}) {
  primitives.push({ name, materialIndex, ...torus(opts) })
}

function addBox(name, materialIndex, opts = {}) {
  primitives.push({ name, materialIndex, ...box(opts) })
}

function sphere({
  segments = 32,
  rings = 16,
  scale = [1, 1, 1],
  translate = [0, 0, 0],
  rotate = [0, 0, 0],
  thetaMin = 0,
  thetaMax = Math.PI,
  phiMin = 0,
  phiMax = Math.PI * 2,
} = {}) {
  const positions = []
  const normals = []
  const indices = []
  for (let y = 0; y <= rings; y += 1) {
    const v = y / rings
    const theta = thetaMin + (thetaMax - thetaMin) * v
    for (let x = 0; x <= segments; x += 1) {
      const u = x / segments
      const phi = phiMin + (phiMax - phiMin) * u
      const nx = Math.sin(theta) * Math.cos(phi)
      const ny = Math.cos(theta)
      const nz = Math.sin(theta) * Math.sin(phi)
      const transformed = transformPoint([nx * scale[0], ny * scale[1], nz * scale[2]], rotate, translate)
      positions.push(...transformed)
      const n = normalize(transformDirection([nx / scale[0], ny / scale[1], nz / scale[2]], rotate))
      normals.push(...n)
    }
  }
  const row = segments + 1
  for (let y = 0; y < rings; y += 1) {
    for (let x = 0; x < segments; x += 1) {
      const a = y * row + x
      const b = a + 1
      const c = a + row
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }
  return { positions, normals, indices }
}

function torus({
  major = 0.25,
  minor = 0.03,
  radialSegments = 40,
  tubeSegments = 12,
  scale = [1, 1, 1],
  translate = [0, 0, 0],
  rotate = [0, 0, 0],
} = {}) {
  const positions = []
  const normals = []
  const indices = []
  for (let j = 0; j <= tubeSegments; j += 1) {
    const v = (j / tubeSegments) * Math.PI * 2
    const cosV = Math.cos(v)
    const sinV = Math.sin(v)
    for (let i = 0; i <= radialSegments; i += 1) {
      const u = (i / radialSegments) * Math.PI * 2
      const cosU = Math.cos(u)
      const sinU = Math.sin(u)
      const px = (major + minor * cosV) * cosU
      const py = minor * sinV
      const pz = (major + minor * cosV) * sinU
      const local = [px * scale[0], py * scale[1], pz * scale[2]]
      positions.push(...transformPoint(local, rotate, translate))
      normals.push(...normalize(transformDirection([cosV * cosU / scale[0], sinV / scale[1], cosV * sinU / scale[2]], rotate)))
    }
  }
  const row = radialSegments + 1
  for (let j = 0; j < tubeSegments; j += 1) {
    for (let i = 0; i < radialSegments; i += 1) {
      const a = j * row + i
      const b = a + 1
      const c = a + row
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }
  return { positions, normals, indices }
}

function box({ scale = [1, 1, 1], translate = [0, 0, 0], rotate = [0, 0, 0] } = {}) {
  const raw = [
    [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [0, 0, 1]],
    [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1], [0, 0, -1]],
    [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1], [0, 1, 0]],
    [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], [0, -1, 0]],
    [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1], [1, 0, 0]],
    [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1], [-1, 0, 0]],
  ]
  const positions = []
  const normals = []
  const indices = []
  for (const face of raw) {
    const start = positions.length / 3
    const normal = normalize(transformDirection(face[4], rotate))
    for (let i = 0; i < 4; i += 1) {
      positions.push(...transformPoint([face[i][0] * scale[0] * 0.5, face[i][1] * scale[1] * 0.5, face[i][2] * scale[2] * 0.5], rotate, translate))
      normals.push(...normal)
    }
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3)
  }
  return { positions, normals, indices }
}

function transformPoint(p, r, t) {
  const d = transformDirection(p, r)
  return [d[0] + t[0], d[1] + t[1], d[2] + t[2]]
}

function transformDirection(p, r) {
  let [x, y, z] = p
  const [rx, ry, rz] = r
  let cy = Math.cos(rx), sy = Math.sin(rx)
  ;[y, z] = [y * cy - z * sy, y * sy + z * cy]
  cy = Math.cos(ry); sy = Math.sin(ry)
  ;[x, z] = [x * cy + z * sy, -x * sy + z * cy]
  cy = Math.cos(rz); sy = Math.sin(rz)
  ;[x, y] = [x * cy - y * sy, x * sy + y * cy]
  return [x, y, z]
}

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / len, v[1] / len, v[2] / len]
}

function writeGlb(parts, materials, target) {
  const gltf = {
    asset: { version: '2.0', generator: 'Codex procedural avatar generator' },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    materials,
    buffers: [{ byteLength: 0 }],
    bufferViews: [],
    accessors: [],
  }

  const chunks = []
  for (const part of parts) {
    const meshIndex = gltf.meshes.length
    const nodeIndex = gltf.nodes.length
    const pos = new Float32Array(part.positions)
    const norm = new Float32Array(part.normals)
    const indexArray = part.positions.length / 3 > 65535 ? new Uint32Array(part.indices) : new Uint16Array(part.indices)

    const positionAccessor = addAccessor(gltf, chunks, pos, 34962, 5126, 'VEC3', pos.length / 3, minMaxVec3(pos))
    const normalAccessor = addAccessor(gltf, chunks, norm, 34962, 5126, 'VEC3', norm.length / 3)
    const indexAccessor = addAccessor(gltf, chunks, indexArray, 34963, indexArray instanceof Uint32Array ? 5125 : 5123, 'SCALAR', indexArray.length)

    gltf.meshes.push({
      name: part.name,
      primitives: [{
        attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
        indices: indexAccessor,
        material: part.materialIndex,
      }],
    })
    gltf.nodes.push({ name: part.name, mesh: meshIndex })
    gltf.scenes[0].nodes.push(nodeIndex)
  }

  const binary = Buffer.concat(chunks)
  gltf.buffers[0].byteLength = binary.byteLength

  const jsonBuffer = pad(Buffer.from(JSON.stringify(gltf)), 0x20)
  const binBuffer = pad(binary, 0x00)
  const totalLength = 12 + 8 + jsonBuffer.length + 8 + binBuffer.length
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(totalLength, 8)
  const jsonHeader = Buffer.alloc(8)
  jsonHeader.writeUInt32LE(jsonBuffer.length, 0)
  jsonHeader.writeUInt32LE(0x4e4f534a, 4)
  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(binBuffer.length, 0)
  binHeader.writeUInt32LE(0x004e4942, 4)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, binBuffer]))
}

function addAccessor(gltf, chunks, typed, target, componentType, type, count, minMax) {
  const byteOffset = chunks.reduce((sum, item) => sum + item.length, 0)
  const raw = Buffer.from(typed.buffer)
  const padded = pad(raw, 0x00)
  chunks.push(padded)
  const bufferView = gltf.bufferViews.length
  gltf.bufferViews.push({ buffer: 0, byteOffset, byteLength: raw.length, target })
  const accessor = gltf.accessors.length
  const item = { bufferView, componentType, count, type }
  if (minMax) Object.assign(item, minMax)
  gltf.accessors.push(item)
  return accessor
}

function minMaxVec3(array) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < array.length; i += 3) {
    for (let j = 0; j < 3; j += 1) {
      min[j] = Math.min(min[j], array[i + j])
      max[j] = Math.max(max[j], array[i + j])
    }
  }
  return { min, max }
}

function pad(buffer, value) {
  const padLength = (4 - (buffer.length % 4)) % 4
  if (!padLength) return buffer
  return Buffer.concat([buffer, Buffer.alloc(padLength, value)])
}
