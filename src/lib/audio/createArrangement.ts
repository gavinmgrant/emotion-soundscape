import * as Tone from "tone"

export const TOTAL_BARS = 40
const INTRO_BARS = 6
const BUILD_BARS = 10
const DROP_BARS = 16

export type Section = "intro" | "build" | "drop" | "breakdown"

export function getSection(bar: number): Section {
  const b = bar % TOTAL_BARS
  if (b < INTRO_BARS) return "intro"
  if (b < INTRO_BARS + BUILD_BARS) return "build"
  if (b < INTRO_BARS + BUILD_BARS + DROP_BARS) return "drop"
  return "breakdown"
}

export interface ArrangementLayers {
  kickGain: Tone.Gain
  percGain: Tone.Gain
  bassGain: Tone.Gain
  keysGain: Tone.Gain
  padGain: Tone.Gain
  hookGain: Tone.Gain
  musicFilter: Tone.Filter
}

export interface ArrangementInstance {
  sequence: Tone.Sequence<number>
  dispose: () => void
}

/** Progressive house arrangement — slow bloom, emotional drop, airy breakdown */
export function createArrangement(
  layers: ArrangementLayers,
): ArrangementInstance {
  const bars = Array.from({ length: TOTAL_BARS }, (_, i) => i)
  const barDuration = Tone.Time("1m").toSeconds()

  const sequence = new Tone.Sequence(
    (time, bar) => {
      const section = getSection(bar)
      const buildBar = bar - INTRO_BARS
      const buildProgress = buildBar / BUILD_BARS

      switch (section) {
        case "intro":
          layers.kickGain.gain.setValueAtTime(0.82, time)
          layers.percGain.gain.setValueAtTime(0.55, time)
          layers.bassGain.gain.setValueAtTime(0.35, time)
          layers.keysGain.gain.setValueAtTime(0.12, time)
          layers.padGain.gain.setValueAtTime(0.55, time)
          layers.hookGain.gain.setValueAtTime(0.18, time)
          layers.musicFilter.frequency.setValueAtTime(1200, time)
          break

        case "build":
          layers.kickGain.gain.linearRampToValueAtTime(
            0.88 + buildProgress * 0.12,
            time + barDuration * 0.9,
          )
          layers.percGain.gain.linearRampToValueAtTime(
            0.58 + buildProgress * 0.34,
            time + barDuration * 0.9,
          )
          layers.bassGain.gain.linearRampToValueAtTime(
            0.35 + buildProgress * 0.5,
            time + barDuration * 0.9,
          )
          layers.keysGain.gain.setValueAtTime(
            buildProgress > 0.2 ? (buildProgress - 0.2) * 1.05 : 0,
            time,
          )
          layers.padGain.gain.linearRampToValueAtTime(
            0.55 + buildProgress * 0.35,
            time + barDuration * 0.9,
          )
          layers.hookGain.gain.setValueAtTime(
            buildProgress > 0.35 ? (buildProgress - 0.35) * 1.2 : 0,
            time,
          )
          layers.musicFilter.frequency.linearRampToValueAtTime(
            1200 + buildProgress * 3200,
            time + barDuration * 0.9,
          )
          break

        case "drop":
          layers.kickGain.gain.setValueAtTime(0.96, time)
          layers.percGain.gain.setValueAtTime(0.88, time)
          layers.bassGain.gain.setValueAtTime(0.82, time)
          layers.keysGain.gain.setValueAtTime(0.72, time)
          layers.padGain.gain.setValueAtTime(0.78, time)
          layers.hookGain.gain.setValueAtTime(0.92, time)
          layers.musicFilter.frequency.setValueAtTime(5200, time)
          break

        case "breakdown":
          layers.kickGain.gain.setValueAtTime(0.78, time)
          layers.percGain.gain.setValueAtTime(0.62, time)
          layers.bassGain.gain.setValueAtTime(0.42, time)
          layers.keysGain.gain.setValueAtTime(0.38, time)
          layers.padGain.gain.setValueAtTime(0.95, time)
          layers.hookGain.gain.setValueAtTime(0.88, time)
          layers.musicFilter.frequency.setValueAtTime(3600, time)
          break
      }
    },
    bars,
    "1m",
  )

  return {
    sequence,
    dispose: () => sequence.dispose(),
  }
}
