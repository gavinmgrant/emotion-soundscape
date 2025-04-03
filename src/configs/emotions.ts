interface EmotionSequence {
  [key: string]: (string | string[])[]
}

interface EmotionTiming {
  [key: string]: {
    intensity: number
    beatSpeed: number
  }
}

interface Emotion {
  value: string
  label: string
}

export const emotionSequences: EmotionSequence = {
  happiness: ["C4", ["E4", "G4", "C5"], "A4", "D5", "E5"], // Major, uplifting
  sadness: ["D4", ["F4", "A4"], "C4", "D5", "E5"], // Minor, melancholic
  fear: ["C4", ["Db4", "E4", "Ab4"], "B3", "C5", "C#5"], // Dissonant, suspenseful
  anger: ["E4", ["G4", "Bb4"], "D4", "F4", "G#4"], // Sharp and punchy
  surprise: ["G4", ["B4", "E5"], "F#4", "A5", "C5"], // Unexpected jumps
  disgust: ["F4", ["Ab4", "B4"], "Eb4", "G4", "C#5"], // Dissonant, uneasy
  love: ["A3", ["D4", "F#4", "B4"], "E4", "C#5", "D5"], // Warm, emotional
  guilt: ["Bb3", ["Db4", "F4"], "Ab3", "Eb4", "Bb4"], // Minor, regretful
  pride: ["C4", ["E4", "G4"], "A4", "F5", "C5"], // Triumphant
  jealousy: ["D4", ["F4", "Ab4"], "C4", "D#4", "A#4"], // Tense, uneasy
  hope: ["G3", ["B3", "D4", "G4"], "C4", "E4", "F#4"], // Rising motion
  embarrassment: ["E3", ["G3", "C4"], "F3", "A4", "D4"], // Awkward pauses
  relief: ["G3", ["C4", "E4"], "D4", "G4", "B4"], // Resolution-focused
  gratitude: ["F3", ["A3", "C4"], "G3", "D4", "E4"], // Warm, balanced
}

export const emotionTimings: EmotionTiming = {
  happiness: {
    intensity: 0.7,
    beatSpeed: 0.8,
  },
  sadness: {
    intensity: 0.3,
    beatSpeed: 0.4,
  },
  fear: {
    intensity: 0.9,
    beatSpeed: 0.9,
  },
  anger: {
    intensity: 1.0,
    beatSpeed: 0.9,
  },
  surprise: {
    intensity: 0.8,
    beatSpeed: 1.0,
  },
  disgust: {
    intensity: 0.7,
    beatSpeed: 0.5,
  },
  love: {
    intensity: 0.6,
    beatSpeed: 0.6,
  },
  guilt: {
    intensity: 0.4,
    beatSpeed: 0.3,
  },
  pride: {
    intensity: 0.8,
    beatSpeed: 0.7,
  },
  jealousy: {
    intensity: 0.6,
    beatSpeed: 0.5,
  },
  hope: {
    intensity: 0.5,
    beatSpeed: 0.7,
  },
  embarrassment: {
    intensity: 0.5,
    beatSpeed: 0.4,
  },
  relief: {
    intensity: 0.2,
    beatSpeed: 0.3,
  },
  gratitude: {
    intensity: 0.5,
    beatSpeed: 0.5,
  },
}

export const emotions: Emotion[] = [
  {
    value: "happiness",
    label: "Happiness",
  },
  {
    value: "sadness",
    label: "Sadness",
  },
  {
    value: "fear",
    label: "Fear",
  },
  {
    value: "anger",
    label: "Anger",
  },
  {
    value: "surprise",
    label: "Surprise",
  },
  {
    value: "disgust",
    label: "Disgust",
  },
  {
    value: "love",
    label: "Love",
  },
  {
    value: "guilt",
    label: "Guilt",
  },
  {
    value: "pride",
    label: "Pride",
  },
  {
    value: "jealousy",
    label: "Jealousy",
  },
  {
    value: "hope",
    label: "Hope",
  },
  {
    value: "embarrassment",
    label: "Embarrassment",
  },
  {
    value: "relief",
    label: "Relief",
  },
  {
    value: "gratitude",
    label: "Gratitude",
  },
]
