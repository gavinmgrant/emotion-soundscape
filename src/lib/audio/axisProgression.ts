/** I – V – vi – IV ("Axis" / four-chord song) progression helpers */

export type AxisKeyName = "C" | "G" | "D" | "A" | "F" | "Bb"

type ChordTriad = [string, string, string]

interface AxisKeyVoicing {
  readonly I: ChordTriad
  readonly V: ChordTriad
  readonly vi: ChordTriad
  readonly IV: ChordTriad
  readonly bass: { readonly I: string; readonly V: string; readonly vi: string; readonly IV: string }
  /** Semitones above C for transposing hook melodies */
  readonly transpose: number
}

const AXIS_KEYS: Record<AxisKeyName, AxisKeyVoicing> = {
  C: {
    I: ["C3", "E3", "G3"],
    V: ["G2", "B2", "D3"],
    vi: ["A2", "C3", "E3"],
    IV: ["F2", "A2", "C3"],
    bass: { I: "C2", V: "G1", vi: "A1", IV: "F1" },
    transpose: 0,
  },
  G: {
    I: ["G2", "B2", "D3"],
    V: ["D3", "F#3", "A3"],
    vi: ["E2", "G2", "B2"],
    IV: ["C3", "E3", "G3"],
    bass: { I: "G1", V: "D2", vi: "E2", IV: "C2" },
    transpose: 7,
  },
  D: {
    I: ["D3", "F#3", "A3"],
    V: ["A2", "C#3", "E3"],
    vi: ["B2", "D3", "F#3"],
    IV: ["G2", "B2", "D3"],
    bass: { I: "D2", V: "A1", vi: "B1", IV: "G1" },
    transpose: 2,
  },
  A: {
    I: ["A2", "C#3", "E3"],
    V: ["E3", "G#3", "B3"],
    vi: ["F#2", "A2", "C#3"],
    IV: ["D3", "F#3", "A3"],
    bass: { I: "A1", V: "E2", vi: "F#1", IV: "D2" },
    transpose: 9,
  },
  F: {
    I: ["F2", "A2", "C3"],
    V: ["C3", "E3", "G3"],
    vi: ["D3", "F3", "A3"],
    IV: ["Bb2", "D3", "F3"],
    bass: { I: "F1", V: "C2", vi: "D2", IV: "Bb1" },
    transpose: 5,
  },
  Bb: {
    I: ["Bb2", "D3", "F3"],
    V: ["F3", "A3", "C4"],
    vi: ["G2", "Bb2", "D3"],
    IV: ["Eb3", "G3", "Bb3"],
    bass: { I: "Bb1", V: "F2", vi: "G1", IV: "Eb2" },
    transpose: 10,
  },
}

const CHROMATIC = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const

function noteToMidi(note: string): number {
  const match = note.match(/^([A-G])(#|b)?(-?\d+)$/)
  if (!match) throw new Error(`Invalid note: ${note}`)

  const letter = match[1]
  const accidental = match[2] ?? ""
  const octave = Number.parseInt(match[3], 10)
  const base: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }
  let semitone = base[letter]
  if (accidental === "#") semitone += 1
  if (accidental === "b") semitone -= 1

  return (octave + 1) * 12 + semitone
}

function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const name = CHROMATIC[((midi % 12) + 12) % 12]
  return `${name}${octave}`
}

export function transposeNotes(notes: string[], semitones: number): string[] {
  if (semitones === 0) return [...notes]
  return notes.map((note) => midiToNote(noteToMidi(note) + semitones))
}

/** One cycle: I – V – vi – IV */
export function axisChordCycle(key: AxisKeyName): ChordTriad[] {
  const k = AXIS_KEYS[key]
  return [k.I, k.V, k.vi, k.IV]
}

/** 8 bars = two full Axis cycles */
export function axisHarmony8(key: AxisKeyName): ChordTriad[] {
  return [...axisChordCycle(key), ...axisChordCycle(key)]
}

/** 32 bars = eight cycles (for 32-bar loops) */
export function axisHarmony32(key: AxisKeyName): ChordTriad[] {
  return Array.from({ length: 8 }, () => axisChordCycle(key)).flat()
}

export function axisBass8(key: AxisKeyName): string[] {
  const { bass } = AXIS_KEYS[key]
  const cycle = [bass.I, bass.V, bass.vi, bass.IV]
  return [...cycle, ...cycle]
}

export function axisBass32(key: AxisKeyName): string[] {
  const cycle = axisBass8(key).slice(0, 4)
  return Array.from({ length: 8 }, () => cycle).flat()
}

/**
 * Catchy 8-note hooks in C (one pitch per bar over I–V–vi–IV × 2).
 * Chord tones align with C – G – Am – F.
 */
export const AXIS_MELODY_HOOKS = {
  /** Main earworm */
  a: ["E4", "B4", "C5", "A4", "G4", "D5", "E5", "C5"],
  /** Lifted answer phrase */
  b: ["G4", "D5", "E5", "C5", "E5", "B4", "A4", "F4"],
  /** Peak / build */
  c: ["C5", "B4", "A4", "G4", "E5", "D5", "C5", "A4"],
  /** Resolve back home */
  d: ["E4", "G4", "A4", "F4", "G4", "B4", "C5", "E4"],
} as const

export interface AxisBarSection {
  melody: string[]
  harmony: ChordTriad[]
  bass: string[]
}

export function axisSection8(
  key: AxisKeyName,
  melodyInC: readonly string[],
): AxisBarSection {
  const { transpose } = AXIS_KEYS[key]
  return {
    melody: transposeNotes([...melodyInC], transpose),
    harmony: axisHarmony8(key),
    bass: axisBass8(key),
  }
}

/** 32-bar form: four 8-bar sections, all on I–V–vi–IV */
export function axisSong32(
  key: AxisKeyName,
  melodies: readonly [
    readonly string[],
    readonly string[],
    readonly string[],
    readonly string[],
  ] = [
    AXIS_MELODY_HOOKS.a,
    AXIS_MELODY_HOOKS.b,
    AXIS_MELODY_HOOKS.c,
    AXIS_MELODY_HOOKS.d,
  ],
): AxisBarSection {
  const sections = melodies.map((m) => axisSection8(key, m))
  return {
    melody: sections.flatMap((s) => s.melody),
    harmony: sections.flatMap((s) => s.harmony),
    bass: sections.flatMap((s) => s.bass),
  }
}

/** Human-readable chord names for a key (e.g. C – G – Am – F) */
export function axisChordNames(key: AxisKeyName): string[] {
  const names: Record<AxisKeyName, [string, string, string, string]> = {
    C: ["C", "G", "Am", "F"],
    G: ["G", "D", "Em", "C"],
    D: ["D", "A", "Bm", "G"],
    A: ["A", "E", "F#m", "D"],
    F: ["F", "C", "Dm", "Bb"],
    Bb: ["Bb", "F", "Gm", "Eb"],
  }
  return names[key]
}
