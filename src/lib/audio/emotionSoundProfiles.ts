import type { DrumPattern, EmotionDrums } from "./types"
import type { TargetSoundProfile } from "./targetProfiles"
import {
  getEmotionSong,
  emotionChordNames,
  type EmotionId,
} from "./emotionProgressions"

export type { EmotionId } from "./emotionProgressions"

export const LOOP_BARS = 32

const STEPS = 16

function drum(fn: (step: number) => boolean): DrumPattern {
  return Array.from({ length: STEPS }, (_, step) => fn(step))
}

function kit(
  kick: DrumPattern,
  snare: DrumPattern,
  hihat: DrumPattern,
  hihatOpen?: DrumPattern,
): EmotionDrums {
  return { kick, snare, hihat, hihatOpen }
}

function profile(
  emotion: EmotionId,
  options: Omit<TargetSoundProfile, "melody" | "harmony" | "bass">,
): TargetSoundProfile {
  const music = getEmotionSong(emotion)
  return { ...music, ...options }
}

const drumsAnger = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 12),
  drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
)

const drumsDisgust = kit(
  drum((s) => s === 0 || s === 7 || s === 8),
  drum((s) => s === 3 || s === 11),
  drum((s) => s === 1 || s === 5 || s === 9 || s === 13),
  drum((s) => s === 6 || s === 14),
)

const drumsSadness = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 4 || s === 12),
  drum((s) => s % 2 === 1),
  drum((s) => s === 2 || s === 10),
)

const drumsFear = kit(
  drum((s) => s === 0 || s === 8),
  drum(() => false),
  drum((s) => s === 4 || s === 12),
)

const drumsSurprise = kit(
  drum((s) => s === 0 || s === 7 || s === 8 || s === 12),
  drum((s) => s === 4 || s === 11 || s === 12),
  drum((s) => s % 2 === 1),
  drum((s) => s === 6 || s === 14),
)

const drumsHappiness = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 4 || s === 12),
  drum((s) => s % 2 === 1),
  drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
)

const drumsLove = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 4 || s === 12),
  drum((s) => [1, 3, 5, 7, 9, 11, 13, 15].includes(s)),
  drum((s) => s === 6 || s === 14),
)

const drumsGuilt = kit(
  drum((s) => s === 0 || s === 6 || s === 8 || s === 14),
  drum((s) => s === 12),
  drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
)

const drumsPride = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 4 || s === 10 || s === 12),
  drum((s) => s % 2 === 1),
  drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
)

const drumsJealousy = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 3 || s === 4 || s === 11 || s === 12),
  drum((s) => s % 2 === 0 && s % 4 !== 0),
  drum((s) => s === 7 || s === 15),
)

const drumsHopeEmotion = kit(
  drum((s) => s % 4 === 0),
  drum((s) => s === 4 || s === 12),
  drum((s) => [2, 4, 6, 8, 10, 12, 14].includes(s)),
  drum((s) => s === 6 || s === 14),
)

const drumsEmbarrassment = kit(
  drum((s) => s % 4 === 0),
  drum(() => false),
  drum((s) => s === 4 || s === 12),
  drum((s) => s === 8),
)

const drumsRelief = kit(
  drum((s) => s === 0 || s === 6 || s === 8 || s === 14),
  drum((s) => s === 12),
  drum((s) => s === 1 || s === 5 || s === 9 || s === 13),
  drum((s) => s === 3 || s === 11),
)

const drumsGratitude = kit(
  drum((s) => s === 0 || s === 4 || s === 8 || s === 12),
  drum(() => false),
  drum((s) => s === 8),
)

// ─── 14 emotions with unique melodies and chord progressions ────────────────

export const emotionSoundProfiles: Record<EmotionId, TargetSoundProfile> = {
  anger: profile("anger", {
    drums: drumsAnger,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.55, release: 0.5 }, volume: -16 },
      pad: { oscillator: "sine", envelope: { attack: 1.4, release: 3.5 }, volume: -23 },
      bass: { oscillator: "sine", envelope: { decay: 0.45 }, volume: -10 },
    },
    bpm: 116,
    keysFilterHz: 820,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4.2,
    stabDuration: "2n",
    bassSubdivision: "1m",
  }),

  disgust: profile("disgust", {
    drums: drumsDisgust,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.42 }, volume: -15 },
      pad: { oscillator: "sine", envelope: { attack: 0.9, release: 2.8 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.38 }, volume: -9 },
    },
    bpm: 114,
    keysFilterHz: 760,
    stabStyle: "syncopated",
    hookPattern: "chopped",
    reverbDecay: 3.8,
    stabDuration: "16n",
    bassSubdivision: "2n",
  }),

  sadness: profile("sadness", {
    drums: drumsSadness,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.38 }, volume: -14 },
      pad: { oscillator: "triangle", envelope: { attack: 0.7, release: 2.6 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.32 }, volume: -9 },
    },
    bpm: 121,
    keysFilterHz: 1350,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 3.4,
    stabDuration: "8n",
    bassSubdivision: "2n",
  }),

  fear: profile("fear", {
    drums: drumsFear,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.65, release: 0.9 }, volume: -17 },
      pad: { oscillator: "sine", envelope: { attack: 1.8, release: 4.2 }, volume: -24 },
      bass: { oscillator: "sine", envelope: { decay: 0.55 }, volume: -8 },
    },
    bpm: 115,
    keysFilterHz: 680,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 4.8,
    stabDuration: "1n",
    bassSubdivision: "1m",
  }),

  surprise: profile("surprise", {
    drums: drumsSurprise,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.35 }, volume: -14 },
      pad: { oscillator: "triangle", envelope: { attack: 0.45, release: 2.1 }, volume: -20 },
      bass: { oscillator: "triangle", envelope: { decay: 0.22 }, volume: -10 },
    },
    bpm: 120,
    keysFilterHz: 1180,
    stabStyle: "syncopated",
    hookPattern: "syncopated",
    reverbDecay: 3.1,
    stabDuration: "16n",
    bassSubdivision: "4n",
  }),

  happiness: profile("happiness", {
    drums: drumsHappiness,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.22 }, volume: -13 },
      pad: { oscillator: "sawtooth", envelope: { attack: 0.12, release: 1.1 }, volume: -18 },
      bass: { oscillator: "sine", envelope: { decay: 0.18 }, volume: -7 },
    },
    bpm: 126,
    keysFilterHz: 1900,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 2.4,
    stabDuration: "16n",
    bassSubdivision: "4n",
  }),

  love: profile("love", {
    drums: drumsLove,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.48 }, volume: -15 },
      pad: { oscillator: "sine", envelope: { attack: 1.0, release: 3.2 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.36 }, volume: -9 },
    },
    bpm: 118,
    keysFilterHz: 1050,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 3.9,
    stabDuration: "4n",
    bassSubdivision: "2n",
  }),

  guilt: profile("guilt", {
    drums: drumsGuilt,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.58 }, volume: -16 },
      pad: { oscillator: "triangle", envelope: { attack: 1.1, release: 3.4 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.48 }, volume: -10 },
    },
    bpm: 117,
    keysFilterHz: 880,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4.3,
    stabDuration: "2n",
    bassSubdivision: "1m",
  }),

  pride: profile("pride", {
    drums: drumsPride,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.28 }, volume: -13 },
      pad: { oscillator: "sawtooth", envelope: { attack: 0.18, release: 1.4 }, volume: -19 },
      bass: { oscillator: "sine", envelope: { decay: 0.2 }, volume: -8 },
    },
    bpm: 125,
    keysFilterHz: 1650,
    stabStyle: "offbeat",
    hookPattern: "anthem",
    reverbDecay: 2.7,
    stabDuration: "8n",
    bassSubdivision: "4n",
  }),

  jealousy: profile("jealousy", {
    drums: drumsJealousy,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.36 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.65, release: 2.3 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.28 }, volume: -9 },
    },
    bpm: 122,
    keysFilterHz: 1280,
    stabStyle: "syncopated",
    hookPattern: "chopped",
    reverbDecay: 3.3,
    stabDuration: "16n",
    bassSubdivision: "2n",
  }),

  hope: profile("hope", {
    drums: drumsHopeEmotion,
    synth: {
      lead: { oscillator: "triangle", envelope: { decay: 0.3 }, volume: -14 },
      pad: { oscillator: "triangle", envelope: { attack: 0.38, release: 1.9 }, volume: -20 },
      bass: { oscillator: "sine", envelope: { decay: 0.26 }, volume: -9 },
    },
    bpm: 124,
    keysFilterHz: 1580,
    stabStyle: "offbeat",
    hookPattern: "chopped",
    reverbDecay: 2.9,
    stabDuration: "8n",
    bassSubdivision: "2n",
  }),

  embarrassment: profile("embarrassment", {
    drums: drumsEmbarrassment,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.52 }, volume: -16 },
      pad: { oscillator: "sine", envelope: { attack: 1.2, release: 3.6 }, volume: -22 },
      bass: { oscillator: "sine", envelope: { decay: 0.44 }, volume: -10 },
    },
    bpm: 116,
    keysFilterHz: 790,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 4.1,
    stabDuration: "2n",
    bassSubdivision: "1m",
  }),

  relief: profile("relief", {
    drums: drumsRelief,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.46 }, volume: -15 },
      pad: { oscillator: "triangle", envelope: { attack: 0.88, release: 3.1 }, volume: -21 },
      bass: { oscillator: "sine", envelope: { decay: 0.36 }, volume: -9 },
    },
    bpm: 119,
    keysFilterHz: 980,
    stabStyle: "onbeat",
    hookPattern: "long",
    reverbDecay: 3.7,
    stabDuration: "4n",
    bassSubdivision: "2n",
  }),

  gratitude: profile("gratitude", {
    drums: drumsGratitude,
    synth: {
      lead: { oscillator: "sine", envelope: { decay: 0.62, release: 0.75 }, volume: -17 },
      pad: { oscillator: "sine", envelope: { attack: 1.5, release: 4.2 }, volume: -24 },
      bass: { oscillator: "sine", envelope: { decay: 0.52 }, volume: -11 },
    },
    bpm: 113,
    keysFilterHz: 640,
    stabStyle: "sparse",
    hookPattern: "long",
    reverbDecay: 5,
    stabDuration: "1n",
    bassSubdivision: "1m",
  }),
}

export function getEmotionSoundProfile(emotion: string): TargetSoundProfile {
  return (
    emotionSoundProfiles[emotion as EmotionId] ?? emotionSoundProfiles.anger
  )
}

export { emotionChordNames }
