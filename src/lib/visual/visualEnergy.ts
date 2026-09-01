import type { AudioVisualEvent, VisualLayer } from "@/lib/audio/visualEvents"
import type { EmotionVisualTint } from "./emotionVisualPalette"

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

export interface VisualMotionContext {
  time: number
  beatSpeed: number
  intensity: number
  isAudioEnabled: boolean
  emotionTint: EmotionVisualTint
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

function hash2D(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453
  return s - Math.floor(s)
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export interface DecomposedPointVisual {
  height: number
  r: number
  g: number
  b: number
}

/**
 * Per-layer spatial kernels summed into one point's height, color, and size.
 * Time-driven phases keep the grid alive between discrete audio events.
 */
export function computeDecomposedPointVisual(
  x: number,
  z: number,
  energy: VisualEnergyState,
  motion: VisualMotionContext,
): DecomposedPointVisual {
  const { time, beatSpeed, intensity, isAudioEnabled, emotionTint } = motion
  const tempo = 0.65 + beatSpeed * 1.35
  const distance = Math.sqrt(x * x + z * z)
  const angle = Math.atan2(z, x)

  const life = isAudioEnabled ? 1 : 0.35
  const ambient =
    Math.sin(x * 0.48 + time * 0.62 * tempo) *
    Math.cos(z * 0.42 + time * 0.54 * tempo) *
    0.14 *
    life *
    (0.2 + intensity * 0.8)

  const padSwell =
    Math.sin(distance * 0.22 - time * 0.35 * tempo) *
    energy.pad *
    0.35 *
    intensity

  const kickPhase = time * 5.5 * tempo + energy.kick * 9
  const centerFalloff = Math.max(0, 1 - distance / 6.5)
  const kickHeight =
    Math.sin(distance * 2.1 - kickPhase) *
    (energy.kick * 2.6 + 0.08) *
    intensity *
    centerFalloff

  const bassPhase = time * 2.4 * tempo + energy.bass * 4.5
  const outerMask =
    smoothstep(2.5, 5.5, distance) * (1 - smoothstep(7.5, 9.5, distance))
  const bassHeight =
    Math.sin(distance * 0.32 - bassPhase) *
    energy.bass *
    1.8 *
    intensity *
    (0.35 + outerMask * 0.65)

  const snarePhase = time * 7.5 * tempo + energy.snare * 14
  const snareRingPos = 3.2 + energy.snare * 1.5 + Math.sin(time * 2.2) * 0.15
  const snareRing =
    Math.exp(-Math.pow(distance - snareRingPos, 2) * 1.6) *
    energy.snare *
    1.65 *
    intensity
  const snareWave =
    Math.sin(distance * 5 - snarePhase) *
    energy.snare *
    0.5 *
    intensity *
    Math.exp(-distance * 0.1)

  const hatGrain = (hash2D(x, z) - 0.5) * 2
  const hatHeight =
    hatGrain * energy.hat * 0.45 * intensity +
    Math.sin(x * 3.1 + z * 2.7 + time * 8 * tempo) *
      energy.hat *
      0.08 *
      intensity

  const keysSpread = Math.exp(
    -Math.pow(angleDiff(angle, energy.keysAzimuth), 2) * 12,
  )
  const keysHeight =
    keysSpread *
    energy.keys *
    1.35 *
    intensity *
    (0.45 + 0.55 * Math.sin(distance * 2.2 - time * 3.2 * tempo))

  const hookSpread = Math.exp(
    -Math.pow(angleDiff(angle, energy.hookAzimuth), 2) * 7,
  )
  const hookHeight =
    hookSpread *
    energy.hook *
    1.7 *
    intensity *
    Math.sin(distance * 1.1 - time * 2.8 * tempo)

  const padHeight = energy.pad * 0.55 * intensity + padSwell

  const edgeFade = Math.max(0, 1 - distance / 10)
  const height =
    (ambient +
      kickHeight +
      bassHeight +
      snareRing +
      snareWave +
      hatHeight +
      keysHeight +
      hookHeight +
      padHeight) *
    edgeFade

  // Height-driven white → blue gradient (main branch), more sensitive
  const heightNorm = Math.min(1, Math.abs(height) * 1.45 + 0.04)
  const blueIntensity = Math.min(1, heightNorm * 0.82 + 0.18)
  const whiteIntensity = Math.max(0, 1 - heightNorm * 0.92)

  let r = whiteIntensity
  let g = whiteIntensity
  let b = Math.min(1, whiteIntensity + blueIntensity)

  // Emotion tint kicks in as peaks rise
  const tintAmount = heightNorm * heightNorm * (0.18 + intensity * 0.12)
  r = lerp(r, emotionTint.r, tintAmount)
  g = lerp(g, emotionTint.g, tintAmount)
  b = lerp(b, emotionTint.b, tintAmount)

  // Brief flashes on snare / melodic hits at elevated points
  const peakBoost = heightNorm * (energy.snare * 0.22 + melodicGlowAt(x, z, energy) * 0.15)
  r = Math.min(1, r + peakBoost)
  g = Math.min(1, g + peakBoost)
  b = Math.min(1, b + peakBoost * 0.6)

  return { height, r, g, b }
}

function melodicGlowAt(
  x: number,
  z: number,
  energy: VisualEnergyState,
): number {
  const angle = Math.atan2(z, x)
  const keysSpread = Math.exp(
    -Math.pow(angleDiff(angle, energy.keysAzimuth), 2) * 12,
  )
  const hookSpread = Math.exp(
    -Math.pow(angleDiff(angle, energy.hookAzimuth), 2) * 7,
  )
  return keysSpread * energy.keys + hookSpread * energy.hook
}

/** Overall brightness pulse for the point material */
export function computeVisualPulse(
  energy: VisualEnergyState,
  time: number,
  beatSpeed: number,
): number {
  const tempo = 0.65 + beatSpeed * 1.35
  const breathe = 0.04 * Math.sin(time * 1.4 * tempo)
  return (
    1 +
    breathe +
    energy.kick * 0.12 +
    energy.snare * 0.08 +
    energy.hook * 0.06
  )
}
