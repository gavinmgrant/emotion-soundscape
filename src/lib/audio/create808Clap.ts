import * as Tone from "tone"

export interface Clap808Voice {
  trigger: (time: number, velocity?: number) => void
  dispose: () => void
}

const CLAP_FLAM_OFFSETS = [0, 0.009, 0.018, 0.031]

/** Layered noise bursts mimicking an 808 clap */
export function create808Clap(destination: Tone.ToneAudioNode): Clap808Voice {
  const filter = new Tone.Filter({
    frequency: 1400,
    type: "bandpass",
    Q: 0.8,
  }).connect(destination)

  const noise = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: {
      attack: 0.001,
      decay: 0.14,
      sustain: 0,
      release: 0.06,
    },
  }).connect(filter)

  noise.volume.value = -8

  return {
    trigger: (time, velocity = 0.85) => {
      CLAP_FLAM_OFFSETS.forEach((offset, index) => {
        const vel = velocity * (1 - index * 0.12)
        noise.triggerAttackRelease("32n", time + offset, vel)
      })
    },
    dispose: () => {
      noise.dispose()
      filter.dispose()
    },
  }
}
