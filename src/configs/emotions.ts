import type {
  Emotion,
  EmotionRegulationTarget,
  EmotionSequence,
  EmotionTimingLegacy,
} from "@/types"
import type { EmotionAudioConfig } from "@/lib/audio/types"
import {
  emotionSoundProfiles,
  type EmotionId,
} from "@/lib/audio/emotionSoundProfiles"
import type { RegulationTargetId } from "@/lib/audio/targetProfiles"
import { applyProgressiveHouse } from "@/lib/audio/progressiveHouseProduction"

const EMOTION_META: Record<
  EmotionId,
  {
    regulationTarget: RegulationTargetId
    regulationLabel: string
    timing: { intensity: number; beatSpeed: number }
  }
> = {
  anger: {
    regulationTarget: "calm",
    regulationLabel: "Helping you feel calm",
    timing: { intensity: 0.5, beatSpeed: 0.58 },
  },
  disgust: {
    regulationTarget: "calm",
    regulationLabel: "Helping you feel calm",
    timing: { intensity: 0.4, beatSpeed: 0.52 },
  },
  sadness: {
    regulationTarget: "hope",
    regulationLabel: "Helping you feel hopeful",
    timing: { intensity: 0.5, beatSpeed: 0.65 },
  },
  fear: {
    regulationTarget: "safety",
    regulationLabel: "Helping you feel safe",
    timing: { intensity: 0.4, beatSpeed: 0.55 },
  },
  surprise: {
    regulationTarget: "grounded",
    regulationLabel: "Helping you feel grounded",
    timing: { intensity: 0.6, beatSpeed: 0.7 },
  },
  happiness: {
    regulationTarget: "joy",
    regulationLabel: "Sustaining your joy",
    timing: { intensity: 0.7, beatSpeed: 0.8 },
  },
  love: {
    regulationTarget: "warmth",
    regulationLabel: "Helping you feel warmth",
    timing: { intensity: 0.6, beatSpeed: 0.62 },
  },
  guilt: {
    regulationTarget: "relief",
    regulationLabel: "Helping you feel relief",
    timing: { intensity: 0.35, beatSpeed: 0.48 },
  },
  pride: {
    regulationTarget: "confidence",
    regulationLabel: "Building your confidence",
    timing: { intensity: 0.65, beatSpeed: 0.72 },
  },
  jealousy: {
    regulationTarget: "self-assurance",
    regulationLabel: "Helping you feel self-assured",
    timing: { intensity: 0.5, beatSpeed: 0.58 },
  },
  hope: {
    regulationTarget: "uplift",
    regulationLabel: "Lifting your spirits",
    timing: { intensity: 0.55, beatSpeed: 0.72 },
  },
  embarrassment: {
    regulationTarget: "comfort",
    regulationLabel: "Helping you feel comfort",
    timing: { intensity: 0.4, beatSpeed: 0.52 },
  },
  relief: {
    regulationTarget: "gratitude",
    regulationLabel: "Helping you feel gratitude",
    timing: { intensity: 0.35, beatSpeed: 0.48 },
  },
  gratitude: {
    regulationTarget: "peace",
    regulationLabel: "Helping you feel peace",
    timing: { intensity: 0.45, beatSpeed: 0.52 },
  },
}

function buildEmotionConfig(emotion: EmotionId): EmotionAudioConfig {
  const profile = applyProgressiveHouse(emotion, emotionSoundProfiles[emotion])
  const meta = EMOTION_META[emotion]

  return {
    regulationTarget: meta.regulationTarget,
    regulationLabel: meta.regulationLabel,
    melody: profile.melody,
    harmony: profile.harmony,
    bass: profile.bass,
    drums: profile.drums,
    synth: profile.synth,
    timing: { ...meta.timing, bpm: profile.bpm },
    sound: {
      keysFilterHz: profile.keysFilterHz,
      stabStyle: profile.stabStyle,
      hookPattern: profile.hookPattern,
      reverbDecay: profile.reverbDecay,
      stabDuration: profile.stabDuration,
      bassSubdivision: profile.bassSubdivision,
    },
  }
}

export const emotionAudioConfigs: Record<string, EmotionAudioConfig> =
  Object.fromEntries(
    (Object.keys(EMOTION_META) as EmotionId[]).map((emotion) => [
      emotion,
      buildEmotionConfig(emotion),
    ]),
  )

export const emotionRegulationTargets: Record<string, EmotionRegulationTarget> =
  Object.fromEntries(
    Object.entries(emotionAudioConfigs).map(([key, config]) => [
      key,
      { target: config.regulationTarget, label: config.regulationLabel },
    ]),
  )

/** @deprecated Use emotionAudioConfigs instead */
export const emotionSequences: EmotionSequence = Object.fromEntries(
  Object.entries(emotionAudioConfigs).map(([key, config]) => [
    key,
    config.melody,
  ]),
)

/** @deprecated Use emotionAudioConfigs instead */
export const emotionTimings: EmotionTimingLegacy = Object.fromEntries(
  Object.entries(emotionAudioConfigs).map(([key, config]) => [
    key,
    { intensity: config.timing.intensity, beatSpeed: config.timing.beatSpeed },
  ]),
)

export const emotions: Emotion[] = [
  { value: "happiness", label: "Happiness" },
  { value: "sadness", label: "Sadness" },
  { value: "fear", label: "Fear" },
  { value: "anger", label: "Anger" },
  { value: "surprise", label: "Surprise" },
  { value: "disgust", label: "Disgust" },
  { value: "love", label: "Love" },
  { value: "guilt", label: "Guilt" },
  { value: "pride", label: "Pride" },
  { value: "jealousy", label: "Jealousy" },
  { value: "hope", label: "Hope" },
  { value: "embarrassment", label: "Embarrassment" },
  { value: "relief", label: "Relief" },
  { value: "gratitude", label: "Gratitude" },
]
