export type VisualLayer =
  | "kick"
  | "snare"
  | "hat"
  | "bass"
  | "keys"
  | "pad"
  | "hook"

export interface AudioVisualEvent {
  layer: VisualLayer
  velocity: number
  time: number
  frequency?: number
}

export function noteToFrequency(note: string | string[]): number | undefined {
  const pitch = Array.isArray(note) ? note[0] : note
  if (!pitch) return undefined
  try {
    return 440 * Math.pow(2, (noteNameToMidi(pitch) - 69) / 12)
  } catch {
    return undefined
  }
}

function noteNameToMidi(note: string): number {
  const match = note.match(/^([A-Ga-g])([#b]?)(-?\d+)$/)
  if (!match) throw new Error(`Invalid note: ${note}`)

  const pitchClass: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }

  const letter = match[1].toUpperCase()
  const accidental = match[2]
  const octave = Number.parseInt(match[3], 10)
  let semitone = pitchClass[letter]
  if (accidental === "#") semitone += 1
  if (accidental === "b") semitone -= 1

  return (octave + 1) * 12 + semitone
}

export function emitVisualEvent(
  onVisualEvent: ((event: AudioVisualEvent) => void) | undefined,
  event: Omit<AudioVisualEvent, "time"> & { time?: number },
) {
  onVisualEvent?.({
    ...event,
    time: event.time ?? 0,
  })
}
