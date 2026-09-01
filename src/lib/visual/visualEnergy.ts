import type { AudioVisualEvent, VisualLayer } from "@/lib/audio/visualEvents"

export interface VisualEnergyState {
  kick: number
  snare: number
  hat: number
  bass: number
  keys: number
  pad: number
  hook: number
  pitch: number
  keysAzimuth: number
  hookAzimuth: number
}

const LAYER_DECAY: Record<VisualLayer, number> = {
  kick: 0.88,
  snare: 0.9,
  hat: 0.84,
  bass: 0.94,
  keys: 0.92,
  pad: 0.985,
  hook: 0.91,
}

const TWO_PI = Math.PI * 2

export function createVisualEnergyState(): VisualEnergyState {
  return {
    kick: 0,
    snare: 0,
    hat: 0,
    bass: 0,
    keys: 0,
    pad: 0,
    hook: 0,
    pitch: 440,
    keysAzimuth: 0,
    hookAzimuth: Math.PI * 0.5,
  }
}

export function frequencyToAzimuth(frequency: number): number {
  const norm = Math.min(1, Math.max(0, (Math.log2(frequency) - 4.5) / 3))
  return norm * TWO_PI - Math.PI
}

export function pitchNormFromFrequency(pitch: number): number {
  return Math.min(1, Math.max(0, (Math.log2(pitch) - 4.5) / 3))
}

export function applyVisualEvent(
  energy: VisualEnergyState,
  event: AudioVisualEvent,
) {
  const clamped = Math.max(0, Math.min(1, event.velocity))
  energy[event.layer] = Math.max(energy[event.layer], clamped)

  if (event.frequency && event.frequency > 0) {
    energy.pitch += (event.frequency - energy.pitch) * 0.35
    const azimuth = frequencyToAzimuth(event.frequency)
    if (event.layer === "keys") energy.keysAzimuth = azimuth
    if (event.layer === "hook") energy.hookAzimuth = azimuth
  }
}

export function decayVisualEnergy(energy: VisualEnergyState) {
  energy.kick *= LAYER_DECAY.kick
  energy.snare *= LAYER_DECAY.snare
  energy.hat *= LAYER_DECAY.hat
  energy.bass *= LAYER_DECAY.bass
  energy.keys *= LAYER_DECAY.keys
  energy.pad *= LAYER_DECAY.pad
  energy.hook *= LAYER_DECAY.hook
}

function angleDiff(a: number, b: number): number {
  let diff = Math.abs(a - b) % TWO_PI
  if (diff > Math.PI) diff = TWO_PI - diff
  return diff
}

/** Deterministic 0–1 hash for hat grain */
function hash2D(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
  return s - Math.floor(s)
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export interface DecomposedPointVisual {
  height: number
  r: number
  g: number
  b: number
}

/**
 * Per-layer spatial kernels summed into one point's height and color.
 * Each audio layer owns a distinct region / shape on the grid.
 */
export function computeDecomposedPointVisual(
  x: number,
  z: number,
  energy: VisualEnergyState,
  intensity: number,
): DecomposedPointVisual {
  const distance = Math.sqrt(x * x + z * z)
  const angle = Math.atan2(z, x)

  const kickPhase = energy.kick * 9
  const centerFalloff = Math.max(0, 1 - distance / 6.5)
  const kickHeight =
    Math.sin(distance * 2 - kickPhase) *
    energy.kick *
    2.4 *
    intensity *
    centerFalloff

  const bassPhase = energy.bass * 4.5
  const outerMask = smoothstep(2.5, 5.5, distance) * (1 - smoothstep(7.5, 9.5, distance))
  const bassHeight =
    Math.sin(distance * 0.32 - bassPhase) *
    energy.bass *
    1.7 *
    intensity *
    (0.35 + outerMask * 0.65)

  const snarePhase = energy.snare * 14
  const snareRingPos = 3.2 + energy.snare * 1.5
  const snareRing =
    Math.exp(-Math.pow(distance - snareRingPos, 2) * 1.8) *
    energy.snare *
    1.5 *
    intensity
  const snareWave =
    Math.sin(distance * 5 - snarePhase) *
    energy.snare *
    0.45 *
    intensity *
    Math.exp(-distance * 0.12)

  const hatGrain = (hash2D(x, z) - 0.5) * 2
  const hatHeight = hatGrain * energy.hat * 0.4 * intensity

  const keysSpread = Math.exp(-Math.pow(angleDiff(angle, energy.keysAzimuth), 2) * 12)
  const keysHeight =
    keysSpread *
    energy.keys *
    1.3 *
    intensity *
    (0.45 + 0.55 * Math.sin(distance * 2.2 - energy.keys * 6))

  const hookSpread = Math.exp(-Math.pow(angleDiff(angle, energy.hookAzimuth), 2) * 7)
  const hookHeight =
    hookSpread *
    energy.hook *
    1.6 *
    intensity *
    Math.sin(distance * 1.1 - energy.hook * 5)

  const padHeight = energy.pad * 0.5 * intensity

  const edgeFade = Math.max(0, 1 - distance / 10)
  const height =
    (kickHeight +
      bassHeight +
      snareRing +
      snareWave +
      hatHeight +
      keysHeight +
      hookHeight +
      padHeight) *
    edgeFade

  const pitchNorm = pitchNormFromFrequency(energy.pitch)
  const absHeight = Math.min(1, Math.abs(height) * 0.65 + 0.25)

  const padGlow = energy.pad * 0.55
  const snareFlash = energy.snare * 0.7
  const melodicGlow = keysSpread * energy.keys * 0.35 + hookSpread * energy.hook * 0.5

  const whiteBase = Math.max(0, 1 - absHeight * 0.65)
  const warm = pitchNorm * 0.3 + melodicGlow * 0.2
  const cool = absHeight * (0.7 + pitchNorm * 0.3) + padGlow * 0.25

  return {
    height,
    r: Math.min(1, whiteBase + warm * 0.55 + snareFlash * 0.35),
    g: Math.min(1, whiteBase + warm * 0.2 + padGlow * 0.15),
    b: Math.min(1, whiteBase + cool),
  }
}
