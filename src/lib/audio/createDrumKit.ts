import * as Tone from "tone"
import { create808Clap } from "./create808Clap"
import { create808Kick } from "./create808Kick"
import type { DrumSamples } from "./sampleLibrary"
import type { EmotionDrums } from "./types"
import { emitVisualEvent } from "./visualEvents"
import type { AudioVisualEvent } from "./visualEvents"

export interface DrumKitInstance {
  sequences: Tone.Sequence[]
  kickGain: Tone.Gain
  percGain: Tone.Gain
  start: () => void
  stop: (time?: number) => void
  dispose: () => void
  setPlaybackRate: (rate: number) => void
}

function triggerPlayer(
  player: Tone.Player,
  time: Tone.Unit.Time,
  velocity = 1,
  duration?: Tone.Unit.Time,
) {
  player.volume.value = Tone.gainToDb(velocity)
  player.stop(time)
  if (duration !== undefined) {
    player.start(time, 0, duration)
  } else {
    player.start(time)
  }
}

export function createDrumKit(
  drums: EmotionDrums,
  samples: DrumSamples,
  destination: Tone.ToneAudioNode,
  onVisualEvent?: (event: AudioVisualEvent) => void,
  onKickSidechain?: (time: number) => void,
): DrumKitInstance {
  const kickGain = new Tone.Gain(1).connect(destination)
  const percGain = new Tone.Gain(1).connect(destination)

  const kick = create808Kick(kickGain)
  const clap = create808Clap(percGain)

  samples.snare.disconnect()
  samples.hihatClosed.disconnect()
  samples.hihatOpen.disconnect()
  samples.shaker.disconnect()

  samples.snare.connect(percGain)
  samples.hihatClosed.connect(percGain)
  samples.hihatOpen.connect(percGain)
  samples.shaker.connect(percGain)

  samples.snare.volume.value = -14
  samples.hihatClosed.volume.value = -17
  samples.hihatOpen.volume.value = -15
  samples.shaker.volume.value = -22

  const sequences: Tone.Sequence[] = []

  const kickSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        kick.trigger(time, 0.95)
        onKickSidechain?.(time)
        emitVisualEvent(onVisualEvent, {
          layer: "kick",
          velocity: 0.95,
          time,
        })
      }
    },
    drums.kick.map((hit) => (hit ? 1 : 0)),
    "16n",
  )
  sequences.push(kickSequence)

  const clapSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        triggerPlayer(samples.snare, time, 0.55, 0.08)
        clap.trigger(time, 0.88)
        emitVisualEvent(onVisualEvent, {
          layer: "snare",
          velocity: 0.88,
          time,
        })
      }
    },
    drums.snare.map((hit) => (hit ? 1 : 0)),
    "16n",
  )
  sequences.push(clapSequence)

  const closedHatSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        triggerPlayer(samples.hihatClosed, time, 0.58, 0.04)
        emitVisualEvent(onVisualEvent, {
          layer: "hat",
          velocity: 0.58,
          time,
        })
      }
    },
    drums.hihat.map((hit) => (hit ? 1 : 0)),
    "16n",
  )
  sequences.push(closedHatSequence)

  const openHatPattern =
    drums.hihatOpen ?? drums.hihat.map((_, i) => i % 4 === 2)
  const openHatSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        triggerPlayer(samples.hihatOpen, time, 0.52, 0.18)
        emitVisualEvent(onVisualEvent, {
          layer: "hat",
          velocity: 0.65,
          time,
        })
      }
    },
    openHatPattern.map((hit) => (hit ? 1 : 0)),
    "16n",
  )
  sequences.push(openHatSequence)

  const shakerPattern = drums.hihat.map((_, i) => i % 2 === 0 && i % 4 !== 0)
  const shakerSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        triggerPlayer(samples.shaker, time, 0.35, 0.04)
        emitVisualEvent(onVisualEvent, {
          layer: "hat",
          velocity: 0.35,
          time,
        })
      }
    },
    shakerPattern.map((hit) => (hit ? 1 : 0)),
    "16n",
  )
  sequences.push(shakerSequence)

  return {
    sequences,
    kickGain,
    percGain,
    start: () => {
      sequences.forEach((seq) => seq.start(0))
    },
    stop: (time?: number) => {
      sequences.forEach((seq) => seq.stop(time))
    },
    dispose: () => {
      sequences.forEach((seq) => seq.dispose())
      kick.dispose()
      clap.dispose()
      samples.snare.disconnect()
      samples.hihatClosed.disconnect()
      samples.hihatOpen.disconnect()
      samples.shaker.disconnect()
      kickGain.dispose()
      percGain.dispose()
    },
    setPlaybackRate: (rate: number) => {
      sequences.forEach((seq) => {
        seq.playbackRate = rate
      })
    },
  }
}
