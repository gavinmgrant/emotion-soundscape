import * as Tone from "tone"

export interface Kick808Voice {
  trigger: (time: number, velocity?: number) => void
  dispose: () => void
}

/** TR-808-style sub kick via MembraneSynth */
export function create808Kick(destination: Tone.ToneAudioNode): Kick808Voice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.013,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.42,
      sustain: 0,
      release: 1.2,
    },
  }).connect(destination)

  synth.volume.value = -2

  return {
    trigger: (time, velocity = 0.95) => {
      synth.triggerAttackRelease("C1", "8n", time, velocity)
    },
    dispose: () => synth.dispose(),
  }
}
