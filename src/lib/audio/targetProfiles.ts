import type { DrumPattern, EmotionDrums, EmotionSynthVoice } from "./types"

const STEPS = 16

function pattern(fn: (step: number) => boolean): DrumPattern {
  return Array.from({ length: STEPS }, (_, step) => fn(step))
}

export type RegulationTargetId =
  | "calm"
  | "hope"
  | "safety"
  | "grounded"
  | "joy"
  | "warmth"
  | "relief"
  | "confidence"
  | "self-assurance"
  | "uplift"
  | "comfort"
  | "gratitude"
  | "peace"

export type StabStyle = "offbeat" | "onbeat" | "syncopated" | "sparse"
export type HookPattern = "long" | "chopped" | "syncopated" | "anthem" | "trance"

export interface TargetSoundProfile {
  drums: EmotionDrums
  synth: {
    lead: EmotionSynthVoice
    pad: EmotionSynthVoice
    bass: EmotionSynthVoice
  }
  melody: string[]
  harmony: (string | string[])[]
  bass: string[]
  bpm: number
  keysFilterHz: number
  stabStyle: StabStyle
  hookPattern: HookPattern
  reverbDecay: number
  /** Piano stab note length */
  stabDuration: string
  /** Bass sequence subdivision */
  bassSubdivision: "1m" | "2n" | "4n"
}

// ─── Unique drum kits per target ───────────────────────────────────────────

const drumsCalm: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 12),
  hihat: pattern((s) => s === 2 || s === 6 || s === 10 || s === 14),
  hihatOpen: pattern(() => false),
}

const drumsHope: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 12),
  hihat: pattern((s) => s % 2 === 1),
  hihatOpen: pattern((s) => s === 2 || s === 10),
}

const drumsSafety: EmotionDrums = {
  kick: pattern((s) => s === 0 || s === 8),
  snare: pattern(() => false),
  hihat: pattern((s) => s === 4 || s === 12),
  hihatOpen: pattern(() => false),
}

const drumsGrounded: EmotionDrums = {
  kick: pattern((s) => s === 0 || s === 7 || s === 8 || s === 12),
  snare: pattern((s) => s === 4 || s === 11 || s === 12),
  hihat: pattern((s) => s % 2 === 1),
  hihatOpen: pattern((s) => s === 6 || s === 14),
}

const drumsJoy: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 12),
  hihat: pattern((s) => s % 2 === 1),
  hihatOpen: pattern((s) => s === 2 || s === 6 || s === 10 || s === 14),
}

const drumsWarmth: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 12),
  hihat: pattern((s) => s === 1 || s === 3 || s === 5 || s === 7 || s === 9 || s === 11 || s === 13 || s === 15),
  hihatOpen: pattern((s) => s === 6 || s === 14),
}

const drumsRelief: EmotionDrums = {
  kick: pattern((s) => s === 0 || s === 6 || s === 8 || s === 14),
  snare: pattern((s) => s === 12),
  hihat: pattern((s) => s === 2 || s === 6 || s === 10 || s === 14),
  hihatOpen: pattern(() => false),
}

const drumsConfidence: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 10 || s === 12),
  hihat: pattern((s) => s % 2 === 1),
  hihatOpen: pattern((s) => s === 2 || s === 6 || s === 10 || s === 14),
}

const drumsSelfAssurance: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 3 || s === 4 || s === 11 || s === 12),
  hihat: pattern((s) => s % 2 === 0 && s % 4 !== 0),
  hihatOpen: pattern((s) => s === 7 || s === 15),
}

const drumsUplift: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 12),
  hihat: pattern((s) => s === 2 || s === 4 || s === 6 || s === 8 || s === 10 || s === 12 || s === 14),
  hihatOpen: pattern((s) => s === 6 || s === 14),
}

const drumsComfort: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern(() => false),
  hihat: pattern((s) => s === 4 || s === 12),
  hihatOpen: pattern((s) => s === 8),
}

const drumsGratitude: EmotionDrums = {
  kick: pattern((s) => s % 4 === 0),
  snare: pattern((s) => s === 4 || s === 12),
  hihat: pattern((s) => s === 1 || s === 5 || s === 9 || s === 13),
  hihatOpen: pattern((s) => s === 3 || s === 7 || s === 11 || s === 15),
}

const drumsPeace: EmotionDrums = {
  kick: pattern((s) => s === 0 || s === 4 || s === 8 || s === 12),
  snare: pattern(() => false),
  hihat: pattern((s) => s === 8),
  hihatOpen: pattern(() => false),
}

// ─── 13 distinct musical identities ──────────────────────────────────────────

export const targetSoundProfiles: Record<
  RegulationTargetId,
  TargetSoundProfile
> = {
  calm: {
    drums: drumsCalm,
    melody: ["E4", "D4", "C4", "G4", "A4", "G4", "E4", "D4"],
    harmony: [
      ["C4", "E4", "G4"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["G3", "B3", "D4"],
      ["C4", "E4", "G4"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["G3", "B3", "D4"],
    ],
    bass: ["C2", "A1", "F1", "G1", "C2", "A1", "F1", "G1"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.5, release: 0.4 }, volume: -16 },
      pad: { oscillator: "sine", envelope: { attack: 1.2, release: 3 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.4 }, volume: -10 },
    },
    bpm: 118,
    keysFilterHz: 900,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4,
    stabDuration: "2n",
    bassSubdivision: "1m",
  },

  hope: {
    drums: drumsHope,
    melody: ["E4", "G4", "A4", "B4", "C5", "B4", "A4", "G4"],
    harmony: [
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["C3", "E3", "G3"],
      ["G3", "B3", "D4"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["C3", "E3", "G3"],
      ["E3", "G3", "B3"],
    ],
    bass: ["A2", "F2", "C2", "G2", "A2", "F2", "C2", "E2"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.35 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.6, release: 2.5 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.3 }, volume: -9 },
    },
    bpm: 122,
    keysFilterHz: 1400,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 3.2,
    stabDuration: "8n",
    bassSubdivision: "2n",
  },

  safety: {
    drums: drumsSafety,
    melody: ["G4", "E4", "D4", "C4", "G4", "E4", "C4", "G4"],
    harmony: [
      ["C3", "E3", "G3"],
      ["C3", "E3", "G3"],
      ["G2", "B2", "D3"],
      ["C3", "E3", "G3"],
      ["C3", "E3", "G3"],
      ["E3", "G3", "C4"],
      ["G2", "B2", "D3"],
      ["C3", "E3", "G3"],
    ],
    bass: ["C2", "C2", "G1", "C2", "C2", "C2", "G1", "C2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.6, release: 0.8 }, volume: -17 },
      pad: { oscillator: "sine", envelope: { attack: 1.5, release: 3.5 }, volume: -23 },
      bass: { oscillator: "sine", envelope: { decay: 0.5 }, volume: -8 },
    },
    bpm: 117,
    keysFilterHz: 750,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 4.5,
    stabDuration: "1n",
    bassSubdivision: "1m",
  },

  grounded: {
    drums: drumsGrounded,
    melody: ["G4", "F4", "E4", "D4", "C4", "D4", "E4", "G4"],
    harmony: [
      ["G3", "B3", "D4"],
      ["F3", "A3", "C4"],
      ["E3", "G3", "B3"],
      ["C3", "E3", "G3"],
      ["G3", "B3", "D4"],
      ["F3", "A3", "C4"],
      ["E3", "G3", "B3"],
      ["D3", "F3", "A3"],
    ],
    bass: ["G2", "F2", "E2", "C2", "G2", "F2", "E2", "D2"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.4 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.5, release: 2 }, volume: -20 },
      bass: { oscillator: "triangle", envelope: { decay: 0.25 }, volume: -10 },
    },
    bpm: 120,
    keysFilterHz: 1100,
    stabStyle: "syncopated",
    hookPattern: "syncopated",
    reverbDecay: 3,
    stabDuration: "16n",
    bassSubdivision: "4n",
  },

  joy: {
    drums: drumsJoy,
    melody: ["C5", "E5", "G5", "A5", "G5", "E5", "D5", "C5"],
    harmony: [
      ["C4", "E4", "G4"],
      ["G3", "B3", "D4"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["C4", "E4", "G4"],
      ["G3", "B3", "D4"],
      ["A3", "C4", "E4"],
      ["G3", "B3", "D4"],
    ],
    bass: ["C2", "G1", "A1", "F1", "C2", "G1", "A1", "G1"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.25 }, volume: -14 },
      pad: { oscillator: "sawtooth", envelope: { attack: 0.15, release: 1.2 }, volume: -19 },
      bass: { oscillator: "sine", envelope: { decay: 0.2 }, volume: -8 },
    },
    bpm: 126,
    keysFilterHz: 1800,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 2.5,
    stabDuration: "16n",
    bassSubdivision: "4n",
  },

  warmth: {
    drums: drumsWarmth,
    melody: ["E4", "G4", "B4", "A4", "G4", "F4", "E4", "D4"],
    harmony: [
      ["A3", "C4", "E4", "G4"],
      ["F3", "A3", "C4"],
      ["D3", "F3", "A3"],
      ["E3", "G3", "B3"],
      ["A3", "C4", "E4", "G4"],
      ["F3", "A3", "C4"],
      ["B3", "D4", "F4"],
      ["E3", "G3", "B3"],
    ],
    bass: ["A2", "F2", "D2", "E2", "A2", "F2", "B1", "E2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.45 }, volume: -15 },
      pad: { oscillator: "sine", envelope: { attack: 0.9, release: 2.8 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.35 }, volume: -9 },
    },
    bpm: 119,
    keysFilterHz: 1000,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 3.8,
    stabDuration: "4n",
    bassSubdivision: "2n",
  },

  relief: {
    drums: drumsRelief,
    melody: ["D4", "C4", "B3", "A3", "G3", "A3", "B3", "C4"],
    harmony: [
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
      ["G2", "Bb2", "D3"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
      ["G2", "Bb2", "D3"],
      ["C3", "E3", "G3"],
    ],
    bass: ["D2", "Bb1", "G1", "C2", "D2", "Bb1", "G1", "C2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.55 }, volume: -16 },
      pad: { oscillator: "triangle", envelope: { attack: 1.0, release: 3.2 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.45 }, volume: -10 },
    },
    bpm: 118,
    keysFilterHz: 850,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4.2,
    stabDuration: "2n",
    bassSubdivision: "1m",
  },

  confidence: {
    drums: drumsConfidence,
    melody: ["G4", "A4", "C5", "A4", "G4", "E4", "G4", "A4"],
    harmony: [
      ["C3", "E3", "G3"],
      ["F3", "A3", "C4"],
      ["G3", "B3", "D4"],
      ["C3", "E3", "G3"],
      ["A3", "C4", "E4"],
      ["F3", "A3", "C4"],
      ["G3", "B3", "D4"],
      ["C3", "E3", "G3"],
    ],
    bass: ["C2", "F1", "G1", "C2", "A1", "F1", "G1", "C2"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.3 }, volume: -14 },
      pad: { oscillator: "sawtooth", envelope: { attack: 0.2, release: 1.5 }, volume: -20 },
      bass: { oscillator: "sine", envelope: { decay: 0.22 }, volume: -8 },
    },
    bpm: 124,
    keysFilterHz: 1500,
    stabStyle: "offbeat",
    hookPattern: "anthem",
    reverbDecay: 2.8,
    stabDuration: "8n",
    bassSubdivision: "4n",
  },

  "self-assurance": {
    drums: drumsSelfAssurance,
    melody: ["A4", "G4", "F4", "E4", "D4", "E4", "F4", "A4"],
    harmony: [
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
      ["G2", "Bb2", "D3"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["G2", "Bb2", "D3"],
      ["A2", "C3", "E3"],
      ["D3", "F3", "A3"],
    ],
    bass: ["D2", "Bb1", "G1", "C2", "D2", "G1", "A1", "D2"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.38 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.7, release: 2.2 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.3 }, volume: -9 },
    },
    bpm: 121,
    keysFilterHz: 1200,
    stabStyle: "syncopated",
    hookPattern: "chopped",
    reverbDecay: 3.4,
    stabDuration: "16n",
    bassSubdivision: "2n",
  },

  uplift: {
    drums: drumsUplift,
    melody: ["G4", "B4", "D5", "E5", "G5", "E5", "D5", "B4"],
    harmony: [
      ["G3", "B3", "D4"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["G3", "B3", "D4"],
      ["E3", "G3", "B3"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["G3", "B3", "D4"],
    ],
    bass: ["G2", "C2", "D2", "G2", "E2", "C2", "D2", "G2"],
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.32 }, volume: -14 },
      pad: { oscillator: "triangle", envelope: { attack: 0.4, release: 2 }, volume: -20 },
      bass: { oscillator: "sine", envelope: { decay: 0.28 }, volume: -9 },
    },
    bpm: 123,
    keysFilterHz: 1600,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 3,
    stabDuration: "8n",
    bassSubdivision: "2n",
  },

  comfort: {
    drums: drumsComfort,
    melody: ["E4", "D4", "C4", "B3", "A3", "B3", "C4", "E4"],
    harmony: [
      ["C3", "E3", "G3"],
      ["G2", "B2", "D3"],
      ["F2", "A2", "C3"],
      ["C3", "E3", "G3"],
      ["A2", "C3", "E3"],
      ["G2", "B2", "D3"],
      ["F2", "A2", "C3"],
      ["C3", "E3", "G3"],
    ],
    bass: ["C2", "G1", "F1", "C2", "A1", "G1", "F1", "C2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.5 }, volume: -16 },
      pad: { oscillator: "sine", envelope: { attack: 1.1, release: 3.5 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.42 }, volume: -10 },
    },
    bpm: 117,
    keysFilterHz: 800,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4,
    stabDuration: "2n",
    bassSubdivision: "1m",
  },

  gratitude: {
    drums: drumsGratitude,
    melody: ["D4", "E4", "G4", "A4", "G4", "E4", "D4", "B3"],
    harmony: [
      ["G3", "B3", "D4"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["G3", "B3", "D4"],
      ["E3", "G3", "B3"],
      ["C3", "E3", "G3"],
      ["A2", "C3", "E3"],
      ["G3", "B3", "D4"],
    ],
    bass: ["G2", "C2", "D2", "G2", "E2", "C2", "A1", "G2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.48 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.85, release: 3 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.38 }, volume: -9 },
    },
    bpm: 119,
    keysFilterHz: 950,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 3.6,
    stabDuration: "4n",
    bassSubdivision: "2n",
  },

  peace: {
    drums: drumsPeace,
    melody: ["A4", "G4", "F4", "E4", "D4", "C4", "D4", "F4"],
    harmony: [
      ["F3", "A3", "C4"],
      ["C3", "E3", "G3"],
      ["Bb2", "D3", "F3"],
      ["F3", "A3", "C4"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
      ["F3", "A3", "C4"],
    ],
    bass: ["F2", "C2", "Bb1", "F2", "C2", "D2", "Bb1", "F2"],
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.6, release: 0.7 }, volume: -17 },
      pad: { oscillator: "sine", envelope: { attack: 1.4, release: 4 }, volume: -23 },
      bass: { oscillator: "sine", envelope: { decay: 0.5 }, volume: -11 },
    },
    bpm: 116,
    keysFilterHz: 700,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4.8,
    stabDuration: "1n",
    bassSubdivision: "1m",
  },
}

// ─── Rhythm helpers ──────────────────────────────────────────────────────────

export function repeatProgression<T>(items: T[], times: number): T[] {
  return Array.from({ length: times }, () => items).flat()
}

export function toOffbeatStabs(
  chords: (string | string[])[],
): (string | string[] | null)[] {
  const result: (string | string[] | null)[] = []
  for (const chord of chords) {
    result.push(null, chord)
  }
  return result
}

export function toOnbeatStabs(
  chords: (string | string[])[],
): (string | string[])[] {
  return chords
}

export function toSyncopatedStabs(
  chords: (string | string[])[],
): (string | string[] | null)[] {
  const result: (string | string[] | null)[] = []
  for (const chord of chords) {
    result.push(null, null, chord, null)
  }
  return result
}

export function toSparseStabs(
  chords: (string | string[])[],
): (string | string[] | null)[] {
  return chords.map((chord, i) => (i % 2 === 0 ? chord : null))
}

export function buildStabEvents(
  chords: (string | string[])[],
  style: StabStyle,
): (string | string[] | null)[] {
  switch (style) {
    case "onbeat":
      return toOnbeatStabs(chords)
    case "syncopated":
      return toSyncopatedStabs(chords)
    case "sparse":
      return toSparseStabs(chords)
    default:
      return toOffbeatStabs(chords)
  }
}

export function getStabSubdivision(style: StabStyle): string {
  switch (style) {
    case "onbeat":
      return "2n"
    case "sparse":
      return "1m"
    default:
      return "8n"
  }
}

export function getHookStepsPerNote(
  melodyNoteCount: number,
  loopBars: number,
): number {
  if (melodyNoteCount <= 0) return 32
  return Math.max(8, Math.round((loopBars * 16) / melodyNoteCount))
}

export function toLongFormHook(
  notes: string[],
  stepsPerNote = 32,
): (string | null)[] {
  const hitStep = Math.floor(stepsPerNote * (10 / 32))
  const result: (string | null)[] = []
  for (const note of notes) {
    for (let i = 0; i < stepsPerNote; i++) {
      result.push(i === hitStep ? note : null)
    }
  }
  return result
}

export function toChoppedVocalHook(
  notes: string[],
  stepsPerNote = 32,
): (string | null)[] {
  const chopSteps = [4, 6, 7, 20, 22].map((s) =>
    Math.min(stepsPerNote - 1, Math.floor(stepsPerNote * (s / 32))),
  )
  const chopSet = new Set(chopSteps)
  const result: (string | null)[] = []
  for (const note of notes) {
    for (let i = 0; i < stepsPerNote; i++) {
      result.push(chopSet.has(i) ? note : null)
    }
  }
  return result
}

export function toSyncopatedHook(
  notes: string[],
  stepsPerNote = 32,
): (string | null)[] {
  const hitSteps = [3, 11, 19, 27].map((s) =>
    Math.min(stepsPerNote - 1, Math.floor(stepsPerNote * (s / 32))),
  )
  const hitSet = new Set(hitSteps)
  const result: (string | null)[] = []
  for (const note of notes) {
    for (let i = 0; i < stepsPerNote; i++) {
      result.push(hitSet.has(i) ? note : null)
    }
  }
  return result
}

export function toAnthemHook(
  notes: string[],
  stepsPerNote = 32,
): (string | null)[] {
  const hitSteps = [0, 2, 16, 18].map((s) =>
    Math.min(stepsPerNote - 1, Math.floor(stepsPerNote * (s / 32))),
  )
  const hitSet = new Set(hitSteps)
  const result: (string | null)[] = []
  for (const note of notes) {
    for (let i = 0; i < stepsPerNote; i++) {
      result.push(hitSet.has(i) ? note : null)
    }
  }
  return result
}

export function toTranceHook(
  notes: string[],
  stepsPerNote = 32,
): (string | null)[] {
  const hitSteps = [0, 3, 6, 9, 12, 14].map((s) =>
    Math.min(stepsPerNote - 1, Math.floor((stepsPerNote * s) / 16)),
  )
  const hitSet = new Set(hitSteps)
  const result: (string | null)[] = []
  for (const note of notes) {
    for (let i = 0; i < stepsPerNote; i++) {
      result.push(hitSet.has(i) ? note : null)
    }
  }
  return result
}

export function buildHookPattern(
  notes: string[],
  pattern: HookPattern,
  stepsPerNote = 32,
): (string | null)[] {
  switch (pattern) {
    case "chopped":
      return toChoppedVocalHook(notes, stepsPerNote)
    case "syncopated":
      return toSyncopatedHook(notes, stepsPerNote)
    case "anthem":
      return toAnthemHook(notes, stepsPerNote)
    case "trance":
      return toTranceHook(notes, stepsPerNote)
    default:
      return toLongFormHook(notes, stepsPerNote)
  }
}

export function getHookNoteDuration(pattern: HookPattern): string {
  if (pattern === "chopped" || pattern === "syncopated") return "8n"
  if (pattern === "trance") return "4n"
  if (pattern === "anthem") return "2n"
  return "1m"
}

// Legacy exports
export const calmDrums = targetSoundProfiles.calm.drums
export const safetyDrums = targetSoundProfiles.safety.drums
export const upliftDrums = targetSoundProfiles.uplift.drums
export const joyDrums = targetSoundProfiles.joy.drums
export const warmthDrums = targetSoundProfiles.warmth.drums
export const peaceDrums = targetSoundProfiles.peace.drums
