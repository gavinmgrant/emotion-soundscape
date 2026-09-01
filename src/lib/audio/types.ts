export type DrumPattern = boolean[]

export type OscillatorType =
  | "sine"
  | "triangle"
  | "sawtooth"
  | "square"

export interface EmotionSynthVoice {
  oscillator: OscillatorType
  envelope?: {
    attack?: number
    decay?: number
    sustain?: number
    release?: number
  }
  volume?: number
}

export interface EmotionDrums {
  kick: DrumPattern
  snare: DrumPattern
  hihat: DrumPattern
  hihatOpen?: DrumPattern
}

export interface EmotionTiming {
  intensity: number
  beatSpeed: number
  bpm: number
}

export interface EmotionAudioConfig {
  regulationTarget: string
  regulationLabel: string
  melody: (string | string[])[]
  harmony: (string | string[])[]
  bass: string[]
  drums: EmotionDrums
  timing: EmotionTiming
  synth: {
    lead: EmotionSynthVoice
    pad: EmotionSynthVoice
    bass: EmotionSynthVoice
  }
  sound?: {
    keysFilterHz: number
    stabStyle: "offbeat" | "onbeat" | "syncopated" | "sparse"
    hookPattern: "long" | "chopped" | "syncopated" | "anthem" | "trance"
    reverbDecay: number
    stabDuration: string
    bassSubdivision: "1m" | "2n" | "4n"
  }
}

import type { AudioVisualEvent } from "./visualEvents"

export interface EmotionAudioCallbacks {
  onVisualEvent?: (event: AudioVisualEvent) => void
}

export interface EmotionAudioInstance {
  start: () => void
  stop: (time?: number) => void
  dispose: () => void
  setPlaybackRate: (rate: number) => void
  setIntensity: (intensity: number) => void
}
