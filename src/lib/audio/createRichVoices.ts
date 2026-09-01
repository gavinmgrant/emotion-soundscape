import * as Tone from "tone"
import type { EmotionSynthVoice } from "./types"

export interface RichPadVoice {
  synth: Tone.PolySynth
  chorus: Tone.Chorus
  dispose: () => void
}

export interface RichHookVoice {
  synth: Tone.PolySynth
  chorus: Tone.Chorus
  dispose: () => void
}

export interface RichBassVoice {
  synth: Tone.MonoSynth
  dispose: () => void
}

function padEnvelope(voice: EmotionSynthVoice) {
  return {
    attack: voice.envelope?.attack ?? 1.6,
    decay: voice.envelope?.decay ?? 0.55,
    sustain: voice.envelope?.sustain ?? 0.68,
    release: Math.max(voice.envelope?.release ?? 4.5, 4),
  }
}

function hookEnvelope(voice: EmotionSynthVoice) {
  return {
    attack: Math.max(voice.envelope?.attack ?? 0.12, 0.1),
    decay: voice.envelope?.decay ?? 0.55,
    sustain: voice.envelope?.sustain ?? 0.28,
    release: Math.max(voice.envelope?.release ?? 1.6, 1.2),
  }
}

function bassEnvelope(voice: EmotionSynthVoice) {
  return {
    attack: voice.envelope?.attack ?? 0.04,
    decay: voice.envelope?.decay ?? 0.45,
    sustain: voice.envelope?.sustain ?? 0.52,
    release: Math.max(voice.envelope?.release ?? 0.65, 0.5),
  }
}

function padOscillator(voice: EmotionSynthVoice) {
  if (voice.oscillator === "sine") {
    return { type: "fatsine" as const, count: 3, spread: 14 }
  }
  return { type: "fatsawtooth" as const, count: 3, spread: 22 }
}

/** Wide detuned stack + chorus for lush chord beds */
export function createRichPad(
  voice: EmotionSynthVoice,
  destination: Tone.ToneAudioNode,
): RichPadVoice {
  const chorus = new Tone.Chorus({
    frequency: 0.7,
    delayTime: 3.8,
    depth: 0.42,
    wet: 0.38,
  }).connect(destination)
  chorus.start()

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: padOscillator(voice),
    envelope: padEnvelope(voice),
  }).connect(chorus)

  synth.volume.value = voice.volume ?? -16
  synth.maxPolyphony = 8

  return {
    synth,
    chorus,
    dispose: () => {
      synth.dispose()
      chorus.dispose()
    },
  }
}

/** FM lead with chorus — more vocal and less pure-tone */
export function createRichHook(
  voice: EmotionSynthVoice,
  destination: Tone.ToneAudioNode,
): RichHookVoice {
  const chorus = new Tone.Chorus({
    frequency: 1.1,
    delayTime: 2.6,
    depth: 0.35,
    wet: 0.3,
  }).connect(destination)
  chorus.start()

  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.4,
    modulationIndex: 1.1,
    oscillator: { type: "sine" },
    modulation: { type: "triangle" },
    envelope: hookEnvelope(voice),
    modulationEnvelope: {
      attack: 0.08,
      decay: 0.35,
      sustain: 0.15,
      release: 0.5,
    },
  }).connect(chorus)

  synth.volume.value = voice.volume ?? -12
  synth.maxPolyphony = 4

  return {
    synth,
    chorus,
    dispose: () => {
      synth.dispose()
      chorus.dispose()
    },
  }
}

/** Round sub bass with gentle filter movement */
export function createRichBass(
  voice: EmotionSynthVoice,
  destination: Tone.ToneAudioNode,
): RichBassVoice {
  const synth = new Tone.MonoSynth({
    oscillator: { type: "fatsine", count: 2, spread: 10 },
    envelope: bassEnvelope(voice),
    filter: { Q: 0.65, type: "lowpass", rolloff: -24 },
    filterEnvelope: {
      attack: 0.06,
      decay: 0.5,
      sustain: 0.42,
      release: 0.55,
      baseFrequency: 70,
      octaves: 1.1,
    },
  }).connect(destination)

  synth.volume.value = voice.volume ?? -8

  return {
    synth,
    dispose: () => synth.dispose(),
  }
}

/** Subtle width on sampled piano stabs */
export function createPianoWidth(
  destination: Tone.ToneAudioNode,
): { input: Tone.Chorus; dispose: () => void } {
  const chorus = new Tone.Chorus({
    frequency: 0.55,
    delayTime: 2.2,
    depth: 0.28,
    wet: 0.2,
  }).connect(destination)
  chorus.start()

  return {
    input: chorus,
    dispose: () => chorus.dispose(),
  }
}
