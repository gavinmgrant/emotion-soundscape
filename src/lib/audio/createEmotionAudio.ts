import * as Tone from "tone"
import { createArrangement } from "./createArrangement"
import { createDrumKit } from "./createDrumKit"
import { getDrumSamples, getPiano } from "./sampleLibrary"
import {
  buildHookPattern,
  buildStabEvents,
  getHookNoteDuration,
  getHookStepsPerNote,
  getStabSubdivision,
} from "./targetProfiles"
import type {
  EmotionAudioCallbacks,
  EmotionAudioConfig,
  EmotionAudioInstance,
  EmotionSynthVoice,
} from "./types"
import { emitVisualEvent, noteToFrequency } from "./visualEvents"

const SIDECHAIN_DUCK = 0.62
const SIDECHAIN_RELEASE = 0.28

function createSidechainBus(destination: Tone.ToneAudioNode) {
  const gain = new Tone.Gain(1).connect(destination)
  return {
    gain,
    duck: (time: number) => {
      gain.gain.setValueAtTime(SIDECHAIN_DUCK, time)
      gain.gain.exponentialRampToValueAtTime(1, time + SIDECHAIN_RELEASE)
    },
    dispose: () => gain.dispose(),
  }
}

function buildSynthOptions(voice: EmotionSynthVoice) {
  return {
    oscillator: { type: voice.oscillator },
    envelope: {
      attack: voice.envelope?.attack ?? 0.08,
      decay: voice.envelope?.decay ?? 0.45,
      sustain: voice.envelope?.sustain ?? 0.35,
      release: voice.envelope?.release ?? 1.1,
    },
  }
}

function buildPadOptions(voice: EmotionSynthVoice) {
  return {
    oscillator: { type: voice.oscillator },
    envelope: {
      attack: voice.envelope?.attack ?? 1.4,
      decay: voice.envelope?.decay ?? 0.4,
      sustain: voice.envelope?.sustain ?? 0.72,
      release: voice.envelope?.release ?? 3.8,
    },
  }
}

function chordToNotes(chord: string | string[]): string[] {
  return Array.isArray(chord) ? chord : [chord]
}

export function createEmotionAudio(
  config: EmotionAudioConfig,
  callbacks: EmotionAudioCallbacks = {},
): EmotionAudioInstance {
  const sound = config.sound ?? {
    keysFilterHz: 1100,
    stabStyle: "offbeat" as const,
    hookPattern: "long" as const,
    reverbDecay: 3.5,
    stabDuration: "8n",
    bassSubdivision: "1m" as const,
  }

  const limiter = new Tone.Limiter(-1).toDestination()
  const masterGain = new Tone.Gain(0.48).connect(limiter)

  const reverb = new Tone.Reverb({ decay: sound.reverbDecay, wet: 0.42 })
  const reverbGain = new Tone.Gain(1).connect(reverb)
  reverb.connect(masterGain)

  const dryGain = new Tone.Gain(0.55).connect(masterGain)
  const musicFilter = new Tone.Filter({
    frequency: 1400,
    type: "lowpass",
    Q: 0.45,
  })
  musicFilter.connect(reverbGain)
  musicFilter.connect(dryGain)

  const drumBus = new Tone.Gain(1).connect(masterGain)

  const bassGain = new Tone.Gain(0.32).connect(musicFilter)
  const keysGain = new Tone.Gain(0).connect(musicFilter)
  const padGain = new Tone.Gain(0.35).connect(musicFilter)
  const hookGain = new Tone.Gain(0).connect(musicFilter)

  const bassSidechain = createSidechainBus(bassGain)
  const keysSidechain = createSidechainBus(keysGain)
  const padSidechain = createSidechainBus(padGain)
  const hookSidechain = createSidechainBus(hookGain)

  const keysFilter = new Tone.Filter({
    frequency: sound.keysFilterHz,
    type: "lowpass",
    Q: 0.55,
  })
  keysFilter.connect(keysSidechain.gain)

  const piano = getPiano()
  piano.volume.value = -15
  piano.connect(keysFilter)

  const padFilter = new Tone.Filter({
    frequency: 2200,
    type: "lowpass",
    Q: 0.35,
  })
  padFilter.connect(padSidechain.gain)

  const pad = new Tone.PolySynth(Tone.Synth, buildPadOptions(config.synth.pad))
  pad.connect(padFilter)
  pad.volume.value = config.synth.pad.volume ?? -18

  const bass = new Tone.MonoSynth({
    ...buildSynthOptions(config.synth.bass),
    filter: { Q: 0.8, type: "lowpass", rolloff: -24 },
    filterEnvelope: {
      attack: 0.04,
      decay: 0.35,
      sustain: 0.35,
      release: 0.35,
      baseFrequency: 80,
      octaves: 0.8,
    },
  }).connect(bassSidechain.gain)
  bass.volume.value = config.synth.bass.volume ?? -9

  const hookDelay = new Tone.FeedbackDelay({
    delayTime: "8n.",
    feedback: 0.22,
    wet: 0.38,
  })
  hookDelay.connect(hookGain)

  const hook = new Tone.PolySynth(Tone.Synth, buildSynthOptions(config.synth.lead))
  hook.connect(hookDelay)
  hook.volume.value = config.synth.lead.volume ?? -13

  const handleKickSidechain = (time: number) => {
    bassSidechain.duck(time)
    keysSidechain.duck(time)
    padSidechain.duck(time)
    hookSidechain.duck(time)
  }

  const drumKit = createDrumKit(
    config.drums,
    getDrumSamples(),
    drumBus,
    callbacks.onVisualEvent,
    handleKickSidechain,
  )

  const arrangement = createArrangement({
    kickGain: drumKit.kickGain,
    percGain: drumKit.percGain,
    bassGain,
    keysGain,
    padGain,
    hookGain,
    musicFilter,
  })

  const sequences: Tone.Sequence[] = []

  const stabEvents = buildStabEvents(config.harmony, sound.stabStyle)
  const stabSubdivision = getStabSubdivision(sound.stabStyle)

  const keysSequence = new Tone.Sequence(
    (time, note) => {
      if (note) {
        const velocity = sound.stabStyle === "sparse" ? 0.42 : 0.58
        piano.triggerAttackRelease(note, sound.stabDuration, time, velocity)
        emitVisualEvent(callbacks.onVisualEvent, {
          layer: "keys",
          velocity,
          time,
          frequency: noteToFrequency(
            Array.isArray(note) ? note[0] : note,
          ),
        })
      }
    },
    stabEvents,
    stabSubdivision,
  )
  sequences.push(keysSequence)

  const padSequence = new Tone.Sequence(
    (time, chord) => {
      if (chord) {
        const notes = chordToNotes(chord)
        pad.triggerAttackRelease(notes, "1m", time, 0.52)
        emitVisualEvent(callbacks.onVisualEvent, {
          layer: "pad",
          velocity: 0.52,
          time,
          frequency: noteToFrequency(notes[0]),
        })
      }
    },
    config.harmony,
    "1m",
  )
  sequences.push(padSequence)

  const bassSequence = new Tone.Sequence(
    (time, note) => {
      if (note) {
        const dur =
          sound.bassSubdivision === "4n"
            ? "4n"
            : sound.bassSubdivision === "2n"
              ? "2n"
              : "1m"
        bass.triggerAttackRelease(note, dur, time, 0.82)
        emitVisualEvent(callbacks.onVisualEvent, {
          layer: "bass",
          velocity: 0.82,
          time,
          frequency: noteToFrequency(note),
        })
      }
    },
    config.bass,
    sound.bassSubdivision,
  )
  sequences.push(bassSequence)

  const hookNotes = config.melody.filter(
    (n): n is string => typeof n === "string",
  )
  const loopBars = config.harmony.length
  const stepsPerNote = getHookStepsPerNote(hookNotes.length, loopBars)
  const hookPattern =
    hookNotes.length > 0
      ? buildHookPattern(hookNotes, sound.hookPattern, stepsPerNote)
      : []

  if (hookPattern.length > 0) {
    const hookDuration = getHookNoteDuration(sound.hookPattern)
    const hookSequence = new Tone.Sequence(
      (time, note) => {
        if (note) {
          const hookVel =
            sound.hookPattern === "anthem" ? 0.72 : 0.58
          hook.triggerAttackRelease(note, hookDuration, time, hookVel)
          emitVisualEvent(callbacks.onVisualEvent, {
            layer: "hook",
            velocity: hookVel,
            time,
            frequency: noteToFrequency(note),
          })
        }
      },
      hookPattern,
      "16n",
    )
    sequences.push(hookSequence)
  }

  const allSequences = [...sequences, ...drumKit.sequences, arrangement.sequence]

  const setPlaybackRate = (rate: number) => {
    allSequences.forEach((seq) => {
      seq.playbackRate = rate
    })
  }

  const setIntensity = (intensity: number) => {
    const normalized = Math.max(0.2, Math.min(0.8, intensity))
    const gain = 0.28 + ((normalized - 0.2) / 0.6) * 0.7
    masterGain.gain.rampTo(gain, 0.1)
    keysFilter.frequency.rampTo(
      sound.keysFilterHz * (0.75 + normalized * 0.45),
      0.15,
    )
    padFilter.frequency.rampTo(1800 + normalized * 1400, 0.15)
    hookDelay.wet.rampTo(0.28 + normalized * 0.18, 0.15)
  }

  return {
    start: () => {
      allSequences.forEach((seq) => seq.start(0))
    },
    stop: (time?: number) => {
      allSequences.forEach((seq) => seq.stop(time))
    },
    dispose: () => {
      allSequences.forEach((seq) => seq.dispose())
      piano.disconnect()
      pad.dispose()
      bass.dispose()
      hook.dispose()
      drumKit.dispose()
      arrangement.dispose()
      reverb.dispose()
      limiter.dispose()
      masterGain.dispose()
      drumBus.dispose()
      musicFilter.dispose()
      reverbGain.dispose()
      dryGain.dispose()
      bassGain.dispose()
      keysGain.dispose()
      padGain.dispose()
      hookGain.dispose()
      bassSidechain.dispose()
      keysSidechain.dispose()
      padSidechain.dispose()
      hookSidechain.dispose()
      keysFilter.dispose()
      padFilter.dispose()
      hookDelay.dispose()
    },
    setPlaybackRate,
    setIntensity,
  }
}

export function getNextBeatTime(): number {
  const transport = Tone.getTransport()
  const currentTime = transport.seconds
  return Math.ceil(currentTime * 4) / 4
}
