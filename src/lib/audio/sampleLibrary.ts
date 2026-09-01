import * as Tone from "tone"
import {
  DRUM_SAMPLE_PATHS,
  PIANO_SAMPLE_BASE_URL,
  PIANO_SAMPLE_URLS_LITE,
} from "./sampleConfig"

export interface DrumPlayers {
  kick: Tone.Player
  snare: Tone.Player
  hihatClosed: Tone.Player
  hihatOpen: Tone.Player
  shaker: Tone.Player
}

class SampleLibrary {
  private static instance: SampleLibrary | null = null
  private loadPromise: Promise<void> | null = null

  drums: DrumPlayers | null = null
  piano: Tone.Sampler | null = null

  static getInstance(): SampleLibrary {
    if (!SampleLibrary.instance) {
      SampleLibrary.instance = new SampleLibrary()
    }
    return SampleLibrary.instance
  }

  load(): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = this.loadAll()
    }
    return this.loadPromise
  }

  get loaded(): boolean {
    return this.drums !== null && this.piano !== null
  }

  private async loadAll(): Promise<void> {
    const kick = new Tone.Player({
      url: DRUM_SAMPLE_PATHS.kick,
      fadeOut: 0.02,
    })
    const snare = new Tone.Player({
      url: DRUM_SAMPLE_PATHS.snare,
      fadeOut: 0.03,
    })
    const hihatClosed = new Tone.Player({
      url: DRUM_SAMPLE_PATHS.hihatClosed,
      fadeOut: 0.01,
    })
    const hihatOpen = new Tone.Player({
      url: DRUM_SAMPLE_PATHS.hihatOpen,
      fadeOut: 0.04,
    })
    const shaker = new Tone.Player({
      url: DRUM_SAMPLE_PATHS.shaker,
      fadeOut: 0.01,
    })

    const piano = new Tone.Sampler({
      urls: PIANO_SAMPLE_URLS_LITE,
      baseUrl: PIANO_SAMPLE_BASE_URL,
      release: 1.4,
      attack: 0.003,
    })

    this.drums = { kick, snare, hihatClosed, hihatOpen, shaker }
    this.piano = piano

    await Tone.loaded()
  }

  dispose(): void {
    this.drums?.kick.dispose()
    this.drums?.snare.dispose()
    this.drums?.hihatClosed.dispose()
    this.drums?.hihatOpen.dispose()
    this.drums?.shaker.dispose()
    this.piano?.dispose()
    this.drums = null
    this.piano = null
    this.loadPromise = null
    SampleLibrary.instance = null
  }
}

export const sampleLibrary = SampleLibrary.getInstance()

export function loadAudioSamples(): Promise<void> {
  return sampleLibrary.load()
}

export function getDrumPlayers(): DrumPlayers {
  if (!sampleLibrary.drums) {
    throw new Error("Drum samples not loaded — call loadAudioSamples() first")
  }
  return sampleLibrary.drums
}

export function getPiano(): Tone.Sampler {
  if (!sampleLibrary.piano) {
    throw new Error("Piano samples not loaded — call loadAudioSamples() first")
  }
  return sampleLibrary.piano
}
