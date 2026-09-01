import * as Tone from "tone"
import type { DrumPlayers } from "./sampleLibrary"
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
  players: DrumPlayers,
  destination: Tone.ToneAudioNode,
  onVisualEvent?: (event: AudioVisualEvent) => void,
  onKickSidechain?: (time: number) => void,
): DrumKitInstance {
  const kickGain = new Tone.Gain(1).connect(destination)
  const percGain = new Tone.Gain(1).connect(destination)

  players.kick.disconnect()
  players.snare.disconnect()
  players.hihatClosed.disconnect()
  players.hihatOpen.disconnect()
  players.shaker.disconnect()

  players.kick.connect(kickGain)
  players.snare.connect(percGain)
  players.hihatClosed.connect(percGain)
  players.hihatOpen.connect(percGain)
  players.shaker.connect(percGain)

  players.kick.volume.value = -3
  players.snare.volume.value = -10
  players.hihatClosed.volume.value = -18
  players.hihatOpen.volume.value = -16
  players.shaker.volume.value = -22

  const sequences: Tone.Sequence[] = []

  const kickSequence = new Tone.Sequence(
    (time, hit) => {
      if (hit) {
        triggerPlayer(players.kick, time, 0.95)
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
        triggerPlayer(players.snare, time, 0.85)
        triggerPlayer(players.snare, time + 0.012, 0.45)
        emitVisualEvent(onVisualEvent, {
          layer: "snare",
          velocity: 0.85,
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
        triggerPlayer(players.hihatClosed, time, 0.55, 0.05)
        emitVisualEvent(onVisualEvent, {
          layer: "hat",
          velocity: 0.55,
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
        triggerPlayer(players.hihatOpen, time, 0.5, 0.15)
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
        triggerPlayer(players.shaker, time, 0.35, 0.04)
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
      players.kick.disconnect()
      players.snare.disconnect()
      players.hihatClosed.disconnect()
      players.hihatOpen.disconnect()
      players.shaker.disconnect()
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
