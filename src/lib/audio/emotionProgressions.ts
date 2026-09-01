import { axisSong32 } from "./axisProgression"

type ChordTriad = [string, string, string]

export type EmotionId =
  | "anger"
  | "disgust"
  | "sadness"
  | "fear"
  | "surprise"
  | "happiness"
  | "love"
  | "guilt"
  | "pride"
  | "jealousy"
  | "hope"
  | "embarrassment"
  | "relief"
  | "gratitude"
  | "anxious"
  | "stress"

interface ChordProgression4 {
  chords: [ChordTriad, ChordTriad, ChordTriad, ChordTriad]
  bass: [string, string, string, string]
}

export interface EmotionSong {
  melody: string[]
  harmony: ChordTriad[]
  bass: string[]
}

function section(
  prog: ChordProgression4,
  melody8: string[],
): EmotionSong {
  return {
    melody: melody8,
    harmony: [...prog.chords, ...prog.chords],
    bass: [...prog.bass, ...prog.bass],
  }
}

function song32(
  prog: ChordProgression4,
  melodies: [string[], string[], string[], string[]],
): EmotionSong {
  const sections = melodies.map((melody) => section(prog, melody))
  return {
    melody: sections.flatMap((s) => s.melody),
    harmony: sections.flatMap((s) => s.harmony),
    bass: sections.flatMap((s) => s.bass),
  }
}

// ─── Happiness: unchanged I – V – vi – IV in C ─────────────────────────────

const HAPPINESS_SONG = axisSong32("C")

// ─── 13 unique progressions + melodies ───────────────────────────────────────

const ANGER_SONG = song32(
  {
    chords: [
      ["A2", "C3", "E3"],
      ["F2", "A2", "C3"],
      ["C3", "E3", "G3"],
      ["G2", "B2", "D3"],
    ],
    bass: ["A1", "F1", "C2", "G1"],
  },
  [
    ["E4", "D4", "C4", "B3", "A3", "G3", "E3", "C4"],
    ["C4", "B3", "A3", "G3", "A3", "B3", "C4", "E4"],
    ["E4", "G4", "A4", "G4", "E4", "D4", "C4", "A3"],
    ["A3", "C4", "E4", "G4", "E4", "D4", "C4", "A3"],
  ],
)

const DISGUST_SONG = song32(
  {
    chords: [
      ["Bb2", "D3", "F3"],
      ["G2", "Bb2", "D3"],
      ["Eb3", "G3", "Bb3"],
      ["F3", "A3", "C4"],
    ],
    bass: ["Bb1", "G1", "Eb2", "F2"],
  },
  [
    ["F4", "Eb4", "D4", "C4", "Bb3", "A3", "G3", "F3"],
    ["Bb3", "C4", "D4", "Eb4", "F4", "Eb4", "D4", "Bb3"],
    ["D4", "Eb4", "F4", "G4", "F4", "Eb4", "D4", "C4"],
    ["Bb3", "A3", "G3", "F3", "Eb3", "F3", "G3", "Bb3"],
  ],
)

const SADNESS_SONG = song32(
  {
    chords: [
      ["G2", "B2", "D3"],
      ["B2", "D3", "F#3"],
      ["E2", "G2", "B2"],
      ["C3", "E3", "G3"],
    ],
    bass: ["G1", "B1", "E2", "C2"],
  },
  [
    ["D5", "B4", "A4", "G4", "E4", "D4", "B3", "A3"],
    ["G4", "A4", "B4", "D5", "B4", "A4", "G4", "E4"],
    ["E5", "D5", "B4", "A4", "G4", "E4", "D4", "B3"],
    ["A4", "G4", "E4", "D4", "B3", "A3", "G3", "B3"],
  ],
)

const FEAR_SONG = song32(
  {
    chords: [
      ["A2", "C3", "E3"],
      ["D2", "F2", "A2"],
      ["F2", "A2", "C3"],
      ["E2", "G#2", "B2"],
    ],
    bass: ["A1", "D1", "F1", "E1"],
  },
  [
    ["E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3"],
    ["A3", "B3", "C4", "D4", "C4", "B3", "A3", "G3"],
    ["E4", "F4", "G4", "A4", "G4", "F4", "E4", "D4"],
    ["C4", "B3", "A3", "G3", "F3", "E3", "D3", "A3"],
  ],
)

const SURPRISE_SONG = song32(
  {
    chords: [
      ["D3", "F#3", "A3"],
      ["B2", "D3", "F#3"],
      ["G2", "B2", "D3"],
      ["A2", "C#3", "E3"],
    ],
    bass: ["D2", "B1", "G1", "A1"],
  },
  [
    ["F#4", "A4", "D5", "F#5", "E5", "D5", "A4", "F#4"],
    ["G4", "A4", "B4", "D5", "F#5", "E5", "D5", "B4"],
    ["A4", "D5", "F#5", "A5", "G5", "F#5", "E5", "D5"],
    ["F#4", "G4", "A4", "B4", "A4", "F#4", "E4", "D4"],
  ],
)

const LOVE_SONG = song32(
  {
    chords: [
      ["F2", "A2", "C3"],
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
      ["C3", "E3", "G3"],
    ],
    bass: ["F1", "D2", "Bb1", "C2"],
  },
  [
    ["A4", "C5", "A4", "F4", "G4", "A4", "C5", "F5"],
    ["F4", "G4", "A4", "C5", "D5", "C5", "A4", "F4"],
    ["C5", "A4", "F4", "G4", "A4", "Bb4", "C5", "D5"],
    ["F5", "D5", "C5", "A4", "G4", "F4", "G4", "A4"],
  ],
)

const GUILT_SONG = song32(
  {
    chords: [
      ["D3", "F#3", "A3"],
      ["F#2", "A2", "C#3"],
      ["B2", "D3", "F#3"],
      ["G2", "B2", "D3"],
    ],
    bass: ["D2", "F#1", "B1", "G1"],
  },
  [
    ["F#4", "E4", "D4", "C#4", "B3", "A3", "G3", "F#3"],
    ["A3", "B3", "C#4", "D4", "E4", "D4", "C#4", "B3"],
    ["D4", "C#4", "B3", "A3", "G3", "F#3", "E3", "D3"],
    ["B3", "A3", "G3", "F#3", "E3", "F#3", "A3", "D4"],
  ],
)

const PRIDE_SONG = song32(
  {
    chords: [
      ["G2", "B2", "D3"],
      ["C3", "E3", "G3"],
      ["D3", "F#3", "A3"],
      ["E2", "G2", "B2"],
    ],
    bass: ["G1", "C2", "D2", "E2"],
  },
  [
    ["G4", "A4", "B4", "D5", "E5", "G5", "F#5", "E5"],
    ["D5", "E5", "G5", "A5", "G5", "E5", "D5", "B4"],
    ["G5", "A5", "B5", "A5", "G5", "E5", "D5", "B4"],
    ["A4", "B4", "D5", "G5", "E5", "D5", "B4", "G4"],
  ],
)

const JEALOUSY_SONG = song32(
  {
    chords: [
      ["A2", "C#3", "E3"],
      ["F#2", "A2", "C#3"],
      ["D3", "F#3", "A3"],
      ["E3", "G#3", "B3"],
    ],
    bass: ["A1", "F#1", "D2", "E2"],
  },
  [
    ["C#5", "B4", "A4", "F#4", "E4", "D4", "C#4", "B3"],
    ["A4", "C#5", "E5", "D5", "C#5", "B4", "A4", "F#4"],
    ["E5", "D5", "C#5", "B4", "A4", "G#4", "F#4", "E4"],
    ["D4", "C#4", "B3", "A3", "B3", "C#4", "E4", "A4"],
  ],
)

const HOPE_SONG = song32(
  {
    chords: [
      ["G2", "B2", "D3"],
      ["E2", "G2", "B2"],
      ["C3", "E3", "G3"],
      ["D3", "F#3", "A3"],
    ],
    bass: ["G1", "E2", "C2", "D2"],
  },
  [
    ["B4", "D5", "E5", "G5", "E5", "D5", "B4", "G4"],
    ["G4", "B4", "D5", "E5", "G5", "A5", "G5", "E5"],
    ["D5", "E5", "G5", "B5", "A5", "G5", "E5", "D5"],
    ["B4", "G4", "E4", "D4", "E4", "G4", "B4", "D5"],
  ],
)

const EMBARRASSMENT_SONG = song32(
  {
    chords: [
      ["C3", "E3", "G3"],
      ["A2", "C3", "E3"],
      ["D3", "F3", "A3"],
      ["G2", "B2", "D3"],
    ],
    bass: ["C2", "A1", "D2", "G1"],
  },
  [
    ["E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3"],
    ["G3", "A3", "B3", "C4", "B3", "A3", "G3", "E3"],
    ["C4", "B3", "A3", "G3", "F3", "E3", "D3", "C4"],
    ["E4", "D4", "C4", "B3", "A3", "G3", "E3", "C4"],
  ],
)

const RELIEF_SONG = song32(
  {
    chords: [
      ["F2", "A2", "C3"],
      ["C3", "E3", "G3"],
      ["D3", "F3", "A3"],
      ["Bb2", "D3", "F3"],
    ],
    bass: ["F1", "C2", "D2", "Bb1"],
  },
  [
    ["C5", "Bb4", "A4", "F4", "G4", "F4", "E4", "C4"],
    ["F4", "G4", "A4", "C5", "Bb4", "A4", "G4", "F4"],
    ["A4", "Bb4", "C5", "D5", "C5", "Bb4", "A4", "F4"],
    ["G4", "F4", "E4", "D4", "C4", "D4", "F4", "A4"],
  ],
)

const GRATITUDE_SONG = song32(
  {
    chords: [
      ["C3", "E3", "G3"],
      ["F2", "A2", "C3"],
      ["A2", "C3", "E3"],
      ["G2", "B2", "D3"],
    ],
    bass: ["C2", "F1", "A1", "G1"],
  },
  [
    ["G4", "E4", "C4", "A3", "F4", "G4", "A4", "C5"],
    ["E5", "D5", "C5", "A4", "G4", "F4", "G4", "A4"],
    ["C5", "A4", "G4", "E4", "F4", "G4", "A4", "C5"],
    ["G4", "E4", "C4", "A3", "G3", "A3", "C4", "E4"],
  ],
)

const ANXIOUS_SONG = song32(
  {
    chords: [
      ["E2", "G2", "B2"],
      ["G2", "B2", "D3"],
      ["A2", "C3", "E3"],
      ["B2", "D#3", "F#3"],
    ],
    bass: ["E1", "G1", "A1", "B1"],
  },
  [
    ["B4", "A4", "G4", "F#4", "E4", "D4", "C#4", "B3"],
    ["E4", "F#4", "G4", "A4", "B4", "A4", "G4", "F#4"],
    ["G4", "A4", "B4", "C#5", "B4", "A4", "G4", "E4"],
    ["F#4", "E4", "D4", "C#4", "B3", "A3", "G#3", "B3"],
  ],
)

const STRESS_SONG = song32(
  {
    chords: [
      ["D2", "F2", "A2"],
      ["Bb2", "D3", "F3"],
      ["C3", "E3", "G3"],
      ["F2", "A2", "C3"],
    ],
    bass: ["D1", "Bb1", "C2", "F1"],
  },
  [
    ["A4", "G4", "F4", "E4", "D4", "C4", "D4", "F4"],
    ["D4", "E4", "F4", "G4", "A4", "Bb4", "A4", "G4"],
    ["F4", "G4", "A4", "Bb4", "C5", "Bb4", "A4", "F4"],
    ["D4", "C4", "Bb3", "A3", "G3", "F3", "G3", "A3"],
  ],
)

const EMOTION_SONGS: Record<EmotionId, EmotionSong> = {
  happiness: HAPPINESS_SONG,
  anger: ANGER_SONG,
  disgust: DISGUST_SONG,
  sadness: SADNESS_SONG,
  fear: FEAR_SONG,
  surprise: SURPRISE_SONG,
  love: LOVE_SONG,
  guilt: GUILT_SONG,
  pride: PRIDE_SONG,
  jealousy: JEALOUSY_SONG,
  hope: HOPE_SONG,
  embarrassment: EMBARRASSMENT_SONG,
  relief: RELIEF_SONG,
  gratitude: GRATITUDE_SONG,
  anxious: ANXIOUS_SONG,
  stress: STRESS_SONG,
}

export function getEmotionSong(emotion: EmotionId): EmotionSong {
  return EMOTION_SONGS[emotion]
}

/** Human-readable chord names for each emotion's 4-chord cycle */
export const emotionChordNames: Record<EmotionId, string[]> = {
  happiness: ["C", "G", "Am", "F"],
  anger: ["Am", "F", "C", "G"],
  disgust: ["Bb", "Gm", "Eb", "F"],
  sadness: ["G", "Bm", "Em", "C"],
  fear: ["Am", "Dm", "F", "E"],
  surprise: ["D", "Bm", "G", "A"],
  love: ["F", "Dm", "Bb", "C"],
  guilt: ["D", "F#m", "Bm", "G"],
  pride: ["G", "C", "D", "Em"],
  jealousy: ["A", "F#m", "D", "E"],
  hope: ["G", "Em", "C", "D"],
  embarrassment: ["C", "Am", "Dm", "G"],
  relief: ["F", "C", "Dm", "Bb"],
  gratitude: ["C", "F", "Am", "G"],
  anxious: ["Em", "G", "Am", "B"],
  stress: ["Dm", "Bb", "C", "F"],
}
