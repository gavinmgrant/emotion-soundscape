/** 
 * Props interface for the EmotionSequence component
 * 
 * @param key - The key for the emotion sequence
 * @param value - The value for the emotion sequence
 */

export interface EmotionSequence {
  [key: string]: (string | string[])[]
}

/**
 * Props interface for the EmotionTiming component
 * 
 * @param key - The key for the emotion timing
 * @param value - The value for the emotion timing in an object
 */

export interface EmotionTiming {
  [key: string]: {
    intensity: number
    beatSpeed: number
  }
}

/**
 * Props interface for the Emotion component
 * 
 * @param value - The value for the emotion
 * @param label - The label for the emotion
 */

export interface Emotion {
  value: string
  label: string
}

/**
 * Props interface for the EmotionInput component
 * 
 * @param handleToggleAudio - Function to toggle audio playback
 * @param isAudioEnabled - Whether audio is currently playing
 * @param intensity - Array containing the current intensity value
 * @param beatSpeed - Array containing the current beat speed value
 * @param emotion - The currently selected emotion
 * @param setIntensity - Function to update the intensity value
 * @param setBeatSpeed - Function to update the beat speed value
 * @param setEmotion - Function to update the selected emotion
 * @param showControls - Whether the controls should be visible
 */

export interface EmotionInputProps {
  handleToggleAudio: () => void
  isAudioEnabled: boolean
  intensity: number[]
  beatSpeed: number[]
  emotion: string
  setIntensity: (e: number[]) => void
  setBeatSpeed: (e: number[]) => void
  setEmotion: (e: string) => void
  showControls: boolean
}
