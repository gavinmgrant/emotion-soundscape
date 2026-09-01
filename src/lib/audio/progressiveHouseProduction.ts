import type { EmotionDrums } from "./types"
import type { HookPattern, StabStyle, TargetSoundProfile } from "./targetProfiles"
import type { EmotionId } from "./emotionSoundProfiles"

const STEPS = 16

type DrumPattern = boolean[]

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

const kickFourOnFloor = drum((s) => s % 4 === 0)
const hatsEighth = drum((s) => s % 2 === 1)
const openHatOffbeat = drum((s) => s === 2 || s === 6 || s === 10 || s === 14)
const snareTwoFour = drum((s) => s === 4 || s === 12)

/** Kaskade-style grooves — four-on-the-floor with breathing room */
const PROGRESSIVE_DRUMS: Record<EmotionId, EmotionDrums> = {
  anger: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  disgust: kit(
    kickFourOnFloor,
    drum((s) => s === 12),
    drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
    drum((s) => s === 8),
  ),
  sadness: kit(
    kickFourOnFloor,
    drum((s) => s === 12),
    drum((s) => s === 1 || s === 5 || s === 9 || s === 13),
    drum((s) => s === 6 || s === 14),
  ),
  fear: kit(
    drum((s) => s === 0 || s === 8),
    drum(() => false),
    drum((s) => s === 4 || s === 12),
    drum(() => false),
  ),
  surprise: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  happiness: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  love: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  guilt: kit(
    kickFourOnFloor,
    drum((s) => s === 12),
    drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
    drum((s) => s === 8),
  ),
  pride: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  jealousy: kit(
    kickFourOnFloor,
    snareTwoFour,
    drum((s) => s % 2 === 1),
    openHatOffbeat,
  ),
  hope: kit(kickFourOnFloor, snareTwoFour, hatsEighth, openHatOffbeat),
  embarrassment: kit(
    kickFourOnFloor,
    drum(() => false),
    drum((s) => s === 4 || s === 12),
    drum((s) => s === 8),
  ),
  relief: kit(
    drum((s) => s === 0 || s === 8),
    drum((s) => s === 12),
    drum((s) => s === 1 || s === 5 || s === 9 || s === 13),
    drum((s) => s === 6),
  ),
  gratitude: kit(
    drum((s) => s === 0 || s === 8),
    drum(() => false),
    drum((s) => s === 4 || s === 12),
    drum(() => false),
  ),
  anxious: kit(
    kickFourOnFloor,
    drum((s) => s === 4 || s === 12),
    drum((s) => s % 2 === 1),
    drum((s) => s === 3 || s === 7 || s === 11 || s === 15),
  ),
  stress: kit(
    kickFourOnFloor,
    snareTwoFour,
    drum((s) => s === 2 || s === 6 || s === 10 || s === 14),
    drum((s) => s === 7 || s === 15),
  ),
}

interface EmotionVibe {
  hookPattern: HookPattern
  stabStyle: StabStyle
  bassSubdivision: TargetSoundProfile["bassSubdivision"]
  stabDuration: string
}

/** Per-emotion Kaskade character — emotional hooks over hypnotic house */
const EMOTION_VIBE: Record<EmotionId, EmotionVibe> = {
  anger: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "2n",
  },
  disgust: {
    hookPattern: "long",
    stabStyle: "onbeat",
    bassSubdivision: "1m",
    stabDuration: "4n",
  },
  sadness: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "2n",
  },
  fear: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "1n",
  },
  surprise: {
    hookPattern: "anthem",
    stabStyle: "offbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  happiness: {
    hookPattern: "anthem",
    stabStyle: "offbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  love: {
    hookPattern: "long",
    stabStyle: "onbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  guilt: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "2n",
  },
  pride: {
    hookPattern: "anthem",
    stabStyle: "offbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  jealousy: {
    hookPattern: "long",
    stabStyle: "offbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  hope: {
    hookPattern: "anthem",
    stabStyle: "offbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  embarrassment: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "2n",
  },
  relief: {
    hookPattern: "long",
    stabStyle: "onbeat",
    bassSubdivision: "2n",
    stabDuration: "4n",
  },
  gratitude: {
    hookPattern: "long",
    stabStyle: "sparse",
    bassSubdivision: "1m",
    stabDuration: "1n",
  },
  anxious: {
    hookPattern: "chopped",
    stabStyle: "syncopated",
    bassSubdivision: "2n",
    stabDuration: "16n",
  },
  stress: {
    hookPattern: "syncopated",
    stabStyle: "offbeat",
    bassSubdivision: "4n",
    stabDuration: "8n",
  },
}

function warmEnvelope(
  envelope: EmotionSynthVoice["envelope"] | undefined,
  role: "lead" | "pad" | "bass",
) {
  const defaults = {
    lead: { attack: 0.08, decay: 0.45, sustain: 0.35, release: 1.1 },
    pad: { attack: 1.4, decay: 0.4, sustain: 0.72, release: 3.8 },
    bass: { attack: 0.02, decay: 0.35, sustain: 0.55, release: 0.45 },
  }[role]

  return {
    attack: envelope?.attack ?? defaults.attack,
    decay: Math.max(envelope?.decay ?? defaults.decay, defaults.decay),
    sustain: envelope?.sustain ?? defaults.sustain,
    release: Math.max(envelope?.release ?? defaults.release, defaults.release),
  }
}

type EmotionSynthVoice = TargetSoundProfile["synth"]["lead"]

function warmVoice(
  voice: EmotionSynthVoice,
  role: "lead" | "pad" | "bass",
): EmotionSynthVoice {
  const oscillator =
    voice.oscillator === "square" ? "triangle" : voice.oscillator

  const volumeBoost = role === "lead" ? 2 : role === "pad" ? 4 : 1

  return {
    ...voice,
    oscillator,
    envelope: warmEnvelope(voice.envelope, role),
    volume: (voice.volume ?? -15) + volumeBoost,
  }
}

/** Push any emotion profile toward warm, melodic progressive house */
export function applyProgressiveHouse(
  emotionId: EmotionId,
  profile: TargetSoundProfile,
): TargetSoundProfile {
  const vibe = EMOTION_VIBE[emotionId]

  return {
    ...profile,
    drums: PROGRESSIVE_DRUMS[emotionId],
    bass: profile.bass,
    bpm: Math.min(124, Math.max(118, profile.bpm)),
    bassSubdivision: vibe.bassSubdivision,
    stabStyle: vibe.stabStyle,
    hookPattern: vibe.hookPattern,
    stabDuration: vibe.stabDuration,
    keysFilterHz: Math.min(2800, Math.max(900, profile.keysFilterHz)),
    reverbDecay: Math.max(profile.reverbDecay, 3.8),
    synth: {
      lead: warmVoice(profile.synth.lead, "lead"),
      pad: warmVoice(profile.synth.pad, "pad"),
      bass: warmVoice(profile.synth.bass, "bass"),
    },
  }
}
