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

const PARAM_DEBOUNCE_MS = 80

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
  const intensityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tempoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  onVisualEventRef.current = onVisualEvent

  // Rebuild only when the song itself changes — not on intensity/tempo tweaks
  useEffect(() => {
    if (!isAudioEnabled || !emotion || !samplesReady) return

    const config = emotionAudioConfigs[emotion]
    if (!config) return

    const transport = Tone.getTransport()
    transport.bpm.value = config.timing.bpm
    transport.swing = 0.02
    transport.swingSubdivision = "8n"

    const audio = createEmotionAudio(config, {
      onVisualEvent: (event) => onVisualEventRef.current?.(event),
    })
    audio.setIntensity(intensity)
    audio.setPlaybackRate(beatSpeed)
    audio.start()
    audioRef.current = audio

    return () => {
      if (intensityTimerRef.current) clearTimeout(intensityTimerRef.current)
      if (tempoTimerRef.current) clearTimeout(tempoTimerRef.current)
      try {
        const nextBeat = getNextBeatTime()
        audio.stop(nextBeat)
        audio.dispose()
      } catch (error) {
        console.error("Error during audio cleanup:", error)
        audio.dispose()
      }
      if (audioRef.current === audio) {
        audioRef.current = null
      }
    }
    // intensity / beatSpeed applied live below — omit from rebuild deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotion, isAudioEnabled, samplesReady])

  useEffect(() => {
    if (!audioRef.current || !isAudioEnabled) return

    if (tempoTimerRef.current) clearTimeout(tempoTimerRef.current)
    tempoTimerRef.current = setTimeout(() => {
      if (!audioRef.current) return
      if (beatSpeed <= 0) {
        audioRef.current.stop()
      } else {
        audioRef.current.setPlaybackRate(beatSpeed)
      }
    }, PARAM_DEBOUNCE_MS)

    return () => {
      if (tempoTimerRef.current) clearTimeout(tempoTimerRef.current)
    }
  }, [beatSpeed, isAudioEnabled])

  useEffect(() => {
    if (!audioRef.current || !isAudioEnabled) return

    if (intensityTimerRef.current) clearTimeout(intensityTimerRef.current)
    intensityTimerRef.current = setTimeout(() => {
      audioRef.current?.setIntensity(intensity)
    }, PARAM_DEBOUNCE_MS)

    return () => {
      if (intensityTimerRef.current) clearTimeout(intensityTimerRef.current)
    }
  }, [intensity, isAudioEnabled])
}

export { loadAudioSamples }
