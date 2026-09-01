export interface EmotionVisualTint {
  r: number
  g: number
  b: number
}

const DEFAULT_TINT: EmotionVisualTint = { r: 0.55, g: 0.7, b: 1 }

/** Accent hues that tint the wavefield per emotion */
export const EMOTION_VISUAL_TINTS: Record<string, EmotionVisualTint> = {
  happiness: { r: 1, g: 0.82, b: 0.35 },
  sadness: { r: 0.42, g: 0.58, b: 1 },
  fear: { r: 0.5, g: 0.45, b: 0.95 },
  anger: { r: 1, g: 0.45, b: 0.38 },
  surprise: { r: 0.95, g: 0.55, b: 1 },
  disgust: { r: 0.55, g: 0.85, b: 0.45 },
  love: { r: 1, g: 0.5, b: 0.72 },
  guilt: { r: 0.62, g: 0.55, b: 0.95 },
  pride: { r: 1, g: 0.72, b: 0.3 },
  jealousy: { r: 0.7, g: 0.95, b: 0.45 },
  hope: { r: 0.45, g: 0.88, b: 1 },
  embarrassment: { r: 1, g: 0.62, b: 0.72 },
  relief: { r: 0.5, g: 0.95, b: 0.88 },
  gratitude: { r: 0.88, g: 0.78, b: 1 },
}

export function getEmotionVisualTint(emotion: string): EmotionVisualTint {
  return EMOTION_VISUAL_TINTS[emotion] ?? DEFAULT_TINT
}
