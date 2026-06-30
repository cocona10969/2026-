import fs from 'node:fs'
import path from 'node:path'

const outPath = path.resolve('public/models/avatar.glb')

const materials = [
  mat('ink_outline', [0.012, 0.011, 0.012, 1], 0.02, 0.62),
  mat('warm_white_plush', [0.965, 0.945, 0.9, 1], 0.01, 0.72),
  mat('powder_blue_ears', [0.38, 0.62, 0.72, 1], 0.02, 0.58),
  mat('soft_blush', [1.0, 0.55, 0.66, 1], 0.01, 0.62),
  mat('eye_gloss', [0.98, 0.98, 0.94, 1], 0.02, 0.34),
  mat('subtle_shadow', [0.012, 0.01, 0.014, 1], 0.0, 0.82),
]

const parts = []

// Reference-like 2.5D relief: flat front, thick black ink outline, white plush body.
addSphere('flat_black_outer_body', 0, {
  scale: [1.05, 1.18, 0.24],
  translate: [0, -0.18, -0.03],
  segments: 80,
  rings: 38,
})
addSphere('flat_white_body', 1, {
  scale: [0.93, 1.06, 0.255],
  translate: [0, -0.18, 0.055],
  segments: 80,
  rings: 38,
})
addSphere('round_lower_white_belly', 1, {
  scale: [0.78, 0.52, 0.25],
  translate: [0, -0.76, 0.08],
  segments: 56,
  rings: 22,
})

// Side cheek fluff and tiny lower feet, matching the doodle silhouette.
addSphere('left_fluff_black', 0, {
  scale: [0.2, 0.28, 0.065],
  translate: [-0.89, -0.48, 0.1],
  rotate: [0, 0, -0.22],
  segments: 28,
  rings: 12,
})
addSphere('left_fluff_white', 1, {
  scale: [0.13, 0.2, 0.06],
  translate: [-0.85, -0.48, 0.155],
  rotate: [0, 0, -0.22],
  segments: 24,
  rings: 10,
})
addSphere('right_fluff_black', 0, {
  scale: [0.2, 0.28, 0.065],
  translate: [0.89, -0.48, 0.1],
  rotate: [0, 0, 0.22],
  segments: 28,
  rings: 12,
})
addSphere('right_fluff_white', 1, {
  scale: [0.13, 0.2, 0.06],
  translate: [0.85, -0.48, 0.155],
  rotate: [0, 0, 0.22],
  segments: 24,
  rings: 10,
})
addSphere('left_foot_black', 0, {
  scale: [0.105, 0.245, 0.06],
  translate: [-0.13, -1.2, 0.08],
  rotate: [0, 0, -0.03],
  segments: 22,
  rings: 10,
})
addSphere('left_foot_white', 1, {
  scale: [0.065, 0.18, 0.055],
  translate: [-0.13, -1.17, 0.14],
  rotate: [0, 0, -0.03],
  segments: 18,
  rings: 8,
})
addSphere('right_foot_black', 0, {
  scale: [0.105, 0.245, 0.06],
  translate: [0.13, -1.2, 0.08],
  rotate: [0, 0, 0.03],
  segments: 22,
  rings: 10,
})
addSphere('right_foot_white', 1, {
  scale: [0.065, 0.18, 0.055],
  translate: [0.13, -1.17, 0.14],
  rotate: [0, 0, 0.03],
  segments: 18,
  rings: 8,
})

// Blue ears sit on top like the reference, with bold black outer rim.
addEar('left_blue_ear_black_rim', 0, {
  width: 0.68,
  height: 0.72,
  thickness: 0.08,
  translate: [-0.48, 0.78, 0.09],
  rotate: [0.02, 0, -0.36],
  rows: 14,
  cols: 18,
})
addEar('left_blue_ear_front', 2, {
  width: 0.54,
  height: 0.58,
  thickness: 0.075,
  translate: [-0.48, 0.76, 0.165],
  rotate: [0.02, 0, -0.36],
  rows: 14,
  cols: 18,
})
addEar('right_blue_ear_black_rim', 0, {
  width: 0.68,
  height: 0.72,
  thickness: 0.08,
  translate: [0.48, 0.78, 0.09],
  rotate: [0.02, 0, 0.36],
  rows: 14,
  cols: 18,
})
addEar('right_blue_ear_front', 2, {
  width: 0.54,
  height: 0.58,
  thickness: 0.075,
  translate: [0.48, 0.76, 0.165],
  rotate: [0.02, 0, 0.36],
  rows: 14,
  cols: 18,
})
addSphere('blue_bridge', 2, {
  scale: [0.46, 0.13, 0.07],
  translate: [0, 0.67, 0.19],
  segments: 36,
  rings: 10,
})
addSphere('white_center_dip', 1, {
  scale: [0.18, 0.09, 0.045],
  translate: [0, 0.61, 0.23],
  rotate: [0, 0, 0.78],
  segments: 22,
  rings: 8,
})

// Face is attached to the front like raised ink strokes.
addSphere('left_eye_outer_ink', 0, {
  scale: [0.145, 0.115, 0.026],
  translate: [-0.28, 0.1, 0.325],
  rotate: [0, 0, -0.14],
  segments: 30,
  rings: 14,
})
addSphere('right_eye_outer_ink', 0, {
  scale: [0.145, 0.115, 0.026],
  translate: [0.28, 0.1, 0.325],
  rotate: [0, 0, 0.14],
  segments: 30,
  rings: 14,
})
addSphere('left_eye_hole', 1, {
  scale: [0.085, 0.055, 0.018],
  translate: [-0.265, 0.105, 0.35],
  rotate: [0, 0, -0.14],
  segments: 22,
  rings: 10,
})
addSphere('right_eye_hole', 1, {
  scale: [0.085, 0.055, 0.018],
  translate: [0.295, 0.105, 0.35],
  rotate: [0, 0, 0.14],
  segments: 22,
  rings: 10,
})
addSphere('left_eye_glint', 4, {
  scale: [0.055, 0.026, 0.012],
  translate: [-0.31, 0.15, 0.37],
  rotate: [0, 0, -0.14],
  segments: 16,
  rings: 8,
})
addSphere('right_eye_glint', 4, {
  scale: [0.055, 0.026, 0.012],
  translate: [0.24, 0.15, 0.37],
  rotate: [0, 0, 0.14],
  segments: 16,
  rings: 8,
})
addSphere('left_tiny_brow', 0, {
  scale: [0.07, 0.015, 0.012],
  translate: [-0.24, 0.31, 0.325],
  rotate: [0, 0, 0.05],
  segments: 16,
  rings: 6,
})
addSphere('right_tiny_brow', 0, {
  scale: [0.07, 0.015, 0.012],
  translate: [0.24, 0.31, 0.325],
  rotate: [0, 0, -0.05],
  segments: 16,
  rings: 6,
})
addSphere('mouth_left_curve', 0, {
  scale: [0.078, 0.042, 0.014],
  translate: [-0.075, -0.14, 0.34],
  rotate: [0, 0, -0.35],
  segments: 18,
  rings: 8,
})
addSphere('mouth_right_curve', 0, {
  scale: [0.078, 0.042, 0.014],
  translate: [0.075, -0.14, 0.34],
  rotate: [0, 0, 0.35],
  segments: 18,
  rings: 8,
})
addSphere('mouth_center_dot', 0, {
  scale: [0.035, 0.028, 0.012],
  translate: [0, -0.085, 0.345],
  segments: 14,
  rings: 8,
})
addSphere('tiny_lower_smile', 0, {
  scale: [0.052, 0.016, 0.012],
  translate: [0, -0.255, 0.335],
  segments: 14,
  rings: 6,
})

// Blush spots and three ink hatch marks per side.
addSphere('left_blush_spot', 3, {
  scale: [0.17, 0.105, 0.014],
  translate: [-0.52, -0.12, 0.32],
  rotate: [0, 0, -0.08],
  segments: 26,
  rings: 10,
})
addSphere('right_blush_spot', 3, {
  scale: [0.17, 0.105, 0.014],
  translate: [0.52, -0.12, 0.32],
  rotate: [0, 0, 0.08],
  segments: 26,
  rings: 10,
})
for (let i = 0; i < 3; i += 1) {
  addSphere(`left_hatch_${i}`, 0, {
    scale: [0.07, 0.012, 0.01],
    translate: [-0.595 + i * 0.072, -0.095 - i * 0.025, 0.345],
    rotate: [0, 0, -0.58],
    segments: 12,
    rings: 5,
  })
  addSphere(`right_hatch_${i}`, 0, {
    scale: [0.07, 0.012, 0.01],
    translate: [0.45 + i * 0.072, -0.145 + i * 0.025, 0.345],
    rotate: [0, 0, 0.58],
    segments: 12,
    rings: 5,
  })
}

// Tail behind the body, visible on the right like the reference.
addSphere('tail_black_back', 0, {
  scale: [0.31, 0.13, 0.07],
  translate: [0.86, -0.77, -0.02],
  rotate: [0, 0, -0.1],
  segments: 24,
  rings: 10,
})
addSphere('tail_blue_front', 2, {
  scale: [0.22, 0.09, 0.055],
  translate: [0.87, -0.765, 0.025],
  rotate: [0, 0, -0.1],
  segments: 22,
  rings: 8,
})

addSphere('under_shadow', 5, {
  scale: [0.72, 0.05, 0.36],
  translate: [0, -1.36, -0.1],
  segments: 38,
  rings: 8,
})

writeGlb(parts, materials, outPath)
console.log(`Generated ${outPath}`)

function mat(name, baseColorFactor, metallicFactor = 0, roughnessFactor = 0.6, alphaMode = 'OPAQUE') {
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

function addSphere(name, materialIndex, opts) {
  parts.push({ name, materialIndex, ...sphere(opts) })
}

function addCone(name, materialIndex, opts) {
  parts.push({ name, materialIndex, ...cone(opts) })
}

function addEar(name, materialIndex, opts) {
  parts.push({ name, materialIndex, ...earPatch(opts) })
}

function sphere({
  segments = 32,
  rings = 16,
  scale = [1, 1, 1],
  translate = [0, 0, 0],
  rotate = [0, 0, 0],
} = {}) {
  const positions = []
  const normals = []
  const indices = []
  for (let y = 0; y <= rings; y += 1) {
    const theta = Math.PI * (y / rings)
    for (let x = 0; x <= segments; x += 1) {
      const phi = Math.PI * 2 * (x / segments)
      const nx = Math.sin(theta) * Math.cos(phi)
      const ny = Math.cos(theta)
      const nz = Math.sin(theta) * Math.sin(phi)
      positions.push(...transformPoint([nx * scale[0], ny * scale[1], nz * scale[2]], rotate, translate))
      normals.push(...normalize(transformDirection([nx / scale[0], ny / scale[1], nz / scale[2]], rotate)))
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

function cone({
  radius = 0.35,
  height = 0.7,
  radialSegments = 32,
  translate = [0, 0, 0],
  rotate = [0, 0, 0],
} = {}) {
  const positions = []
  const normals = []
  const indices = []
  const baseY = -height * 0.38
  const tipY = height * 0.62
  const tip = transformPoint([0, tipY, 0], rotate, translate)
  positions.push(...tip)
  normals.push(...normalize(transformDirection([0, 0.65, 0.35], rotate)))

  for (let i = 0; i <= radialSegments; i += 1) {
    const a = Math.PI * 2 * (i / radialSegments)
    const x = Math.cos(a) * radius
    const z = Math.sin(a) * radius * 0.58
    positions.push(...transformPoint([x, baseY, z], rotate, translate))
    normals.push(...normalize(transformDirection([x, radius * 0.82, z], rotate)))
  }

  for (let i = 1; i <= radialSegments; i += 1) {
    indices.push(0, i, i + 1)
  }

  const centerIndex = positions.length / 3
  positions.push(...transformPoint([0, baseY, 0], rotate, translate))
  normals.push(...normalize(transformDirection([0, -1, 0], rotate)))
  for (let i = 1; i <= radialSegments; i += 1) {
    indices.push(centerIndex, i + 1, i)
  }

  return { positions, normals, indices }
}

function earPatch({
  width = 0.7,
  height = 0.8,
  thickness = 0.14,
  rows = 12,
  cols = 18,
  translate = [0, 0, 0],
  rotate = [0, 0, 0],
} = {}) {
  const positions = []
  const normals = []
  const indices = []
  const addVertex = (x, y, z, nx, ny, nz) => {
    positions.push(...transformPoint([x, y, z], rotate, translate))
    normals.push(...normalize(transformDirection([nx, ny, nz], rotate)))
  }

  // Front puffy triangular surface. Width tapers upward with a rounded top.
  for (let r = 0; r <= rows; r += 1) {
    const v = r / rows
    const y = -height * 0.38 + v * height
    const taper = Math.pow(1 - v, 0.72)
    const roundTop = 0.12 + 0.88 * Math.sin(Math.PI * (0.08 + v * 0.84))
    const half = (width * 0.5) * Math.max(0.035, taper) * roundTop
    for (let c = 0; c <= cols; c += 1) {
      const u = (c / cols) * 2 - 1
      const edge = Math.sqrt(Math.max(0, 1 - Math.abs(u)))
      const dome = Math.sin(Math.PI * v) * Math.sqrt(Math.max(0, 1 - u * u))
      const x = u * half
      const z = thickness * (0.24 + dome * 0.76)
      addVertex(x, y, z, u * 0.18, 0.18 + v * 0.35, 1 + edge * 0.25)
    }
  }

  const row = cols + 1
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const a = r * row + c
      const b = a + 1
      const d = a + row + 1
      const e = a + row
      indices.push(a, e, b, b, e, d)
    }
  }

  // Back surface so the ear has visible body when it turns.
  const backStart = positions.length / 3
  for (let r = 0; r <= rows; r += 1) {
    const v = r / rows
    const y = -height * 0.38 + v * height
    const taper = Math.pow(1 - v, 0.72)
    const roundTop = 0.12 + 0.88 * Math.sin(Math.PI * (0.08 + v * 0.84))
    const half = (width * 0.5) * Math.max(0.035, taper) * roundTop
    for (let c = 0; c <= cols; c += 1) {
      const u = (c / cols) * 2 - 1
      const x = u * half
      const z = -thickness * 0.28
      addVertex(x, y, z, u * 0.1, 0.1, -1)
    }
  }
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const a = backStart + r * row + c
      const b = a + 1
      const d = a + row + 1
      const e = a + row
      indices.push(a, b, e, b, d, e)
    }
  }

  // Side walls joining front and back.
  for (let r = 0; r < rows; r += 1) {
    const lf = r * row
    const lf2 = (r + 1) * row
    const lb = backStart + r * row
    const lb2 = backStart + (r + 1) * row
    indices.push(lf, lf2, lb, lb, lf2, lb2)

    const rf = r * row + cols
    const rf2 = (r + 1) * row + cols
    const rb = backStart + r * row + cols
    const rb2 = backStart + (r + 1) * row + cols
    indices.push(rf, rb, rf2, rb, rb2, rf2)
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
  let c = Math.cos(rx), s = Math.sin(rx)
  ;[y, z] = [y * c - z * s, y * s + z * c]
  c = Math.cos(ry); s = Math.sin(ry)
  ;[x, z] = [x * c + z * s, -x * s + z * c]
  c = Math.cos(rz); s = Math.sin(rz)
  ;[x, y] = [x * c - y * s, x * s + y * c]
  return [x, y, z]
}

function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}

function writeGlb(partsToWrite, materialsToWrite, target) {
  const gltf = {
    asset: { version: '2.0', generator: 'Codex procedural black cat avatar' },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    materials: materialsToWrite,
    buffers: [{ byteLength: 0 }],
    bufferViews: [],
    accessors: [],
  }
  const chunks = []
  for (const part of partsToWrite) {
    const pos = new Float32Array(part.positions)
    const norm = new Float32Array(part.normals)
    const idx = new Uint16Array(part.indices)
    const positionAccessor = addAccessor(gltf, chunks, pos, 34962, 5126, 'VEC3', pos.length / 3, minMaxVec3(pos))
    const normalAccessor = addAccessor(gltf, chunks, norm, 34962, 5126, 'VEC3', norm.length / 3)
    const indexAccessor = addAccessor(gltf, chunks, idx, 34963, 5123, 'SCALAR', idx.length)
    const meshIndex = gltf.meshes.length
    const nodeIndex = gltf.nodes.length
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
  const json = pad(Buffer.from(JSON.stringify(gltf)), 0x20)
  const bin = pad(binary, 0x00)
  const totalLength = 12 + 8 + json.length + 8 + bin.length
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(totalLength, 8)
  const jsonHeader = Buffer.alloc(8)
  jsonHeader.writeUInt32LE(json.length, 0)
  jsonHeader.writeUInt32LE(0x4e4f534a, 4)
  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(bin.length, 0)
  binHeader.writeUInt32LE(0x004e4942, 4)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, Buffer.concat([header, jsonHeader, json, binHeader, bin]))
}

function addAccessor(gltf, chunks, typed, target, componentType, type, count, minMax) {
  const byteOffset = chunks.reduce((sum, item) => sum + item.length, 0)
  const raw = Buffer.from(typed.buffer)
  chunks.push(pad(raw, 0x00))
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
  return padLength ? Buffer.concat([buffer, Buffer.alloc(padLength, value)]) : buffer
}
