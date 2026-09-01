import { useEffect, useRef } from "react"
import * as Tone from "tone"
import { emotionAudioConfigs } from "@/configs/emotions"
import {
  createEmotionAudio,
  getNextBeatTime,
} from "@/lib/audio/createEmotionAudio"
import { loadAudioSamples } from "@/lib/audio/sampleLibrary"
import type { AudioVisualEvent } from "@/lib/audio/visualEvents"
import type { EmotionAudioInstance } from "@/lib/audio/types"

interface UseEmotionAudioOptions {
  emotion: string
  isAudioEnabled: boolean
  samplesReady: boolean
  beatSpeed: number
  intensity: number
  onVisualEvent?: (event: AudioVisualEvent) => void
}

export function useEmotionAudio({
  emotion,
  isAudioEnabled,
  samplesReady,
  beatSpeed,
  intensity,
  onVisualEvent,
}: UseEmotionAudioOptions) {
  const audioRef = useRef<EmotionAudioInstance | null>(null)
  const onVisualEventRef = useRef(onVisualEvent)

  onVisualEventRef.current = onVisualEvent

  useEffect(() => {
    if (!isAudioEnabled || !emotion || !samplesReady) return

    const config = emotionAudioConfigs[emotion]
    if (!config) return

    const transport = Tone.getTransport()
    transport.bpm.value = config.timing.bpm
    transport.swing = 0.02
    transport.swingSubdivision = "8n"

    audioRef.current = createEmotionAudio(config, {
      onVisualEvent: (event) => onVisualEventRef.current?.(event),
    })
    audioRef.current.setIntensity(intensity)
    audioRef.current.setPlaybackRate(beatSpeed)
    audioRef.current.start()

    return () => {
      try {
        const nextBeat = getNextBeatTime()
        audioRef.current?.stop(nextBeat)
        audioRef.current?.dispose()
      } catch (error) {
        console.error("Error during audio cleanup:", error)
        audioRef.current?.dispose()
      }
      audioRef.current = null
    }
  }, [beatSpeed, emotion, intensity, isAudioEnabled, samplesReady])

  useEffect(() => {
    if (!audioRef.current || !isAudioEnabled) return
    if (beatSpeed <= 0) {
      audioRef.current.stop()
    } else {
      audioRef.current.setPlaybackRate(beatSpeed)
    }
  }, [beatSpeed, isAudioEnabled])

  useEffect(() => {
    if (!audioRef.current || !isAudioEnabled) return
    audioRef.current.setIntensity(intensity)
  }, [intensity, isAudioEnabled])
}

export { loadAudioSamples }
