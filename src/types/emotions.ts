export type {
  DrumPattern,
  EmotionAudioConfig,
  EmotionDrums,
  EmotionSynthVoice,
  EmotionTiming,
} from "@/lib/audio/types"

/** @deprecated Use EmotionAudioConfig.melody instead */
export interface EmotionSequence {
  [key: string]: (string | string[])[]
}

/** @deprecated Use EmotionAudioConfig.timing instead */
export interface EmotionTimingLegacy {
  [key: string]: {
    intensity: number
    beatSpeed: number
  }
}

export interface EmotionRegulationTarget {
  target: string
  label: string
}

export interface Emotion {
  value: string
  label: string
}

export interface EmotionInputProps {
  handleToggleAudio: () => void
  isAudioEnabled: boolean
  isLoadingSamples: boolean
  intensity: number[]
  beatSpeed: number[]
  emotion: string
  regulationLabel?: string
  setIntensity: (e: number[]) => void
  setBeatSpeed: (e: number[]) => void
  onEmotionChange: (emotion: string) => void
  showControls: boolean
}
