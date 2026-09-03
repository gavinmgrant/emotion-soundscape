"use client"

import * as Tone from "tone"
import dynamic from "next/dynamic"
import { useEffect, useState, useCallback } from "react"
import EmotionInput from "./EmotionInput"
import AppChrome from "./AppChrome"
import { emotionTimings, emotionRegulationTargets } from "@/configs/emotions"
import { loadAudioSamples } from "@/hooks/useEmotionAudio"
import type { SceneCanvasProps } from "./SceneCanvas"

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" aria-hidden />,
})

const VisualResponse = () => {
  const defaultBeatSpeed = 0.5
  const defaultIntensity = 0.5

  const [emotion, setEmotion] = useState("")
  const [intensity, setIntensity] = useState([defaultIntensity])
  const [beatSpeed, setBeatSpeed] = useState([defaultBeatSpeed])
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [samplesReady, setSamplesReady] = useState(false)
  const [isLoadingSamples, setIsLoadingSamples] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const stopAudio = useCallback(async () => {
    Tone.getTransport().stop()
    setIsAudioEnabled(false)
  }, [])

  const startAudio = useCallback(async () => {
    if (isLoadingSamples) return

    try {
      await Tone.start()
      await Tone.getContext().resume()

      if (!samplesReady) {
        setIsLoadingSamples(true)
        await loadAudioSamples()
        setSamplesReady(true)
        setIsLoadingSamples(false)
      }

      const transport = Tone.getTransport()
      if (transport.state !== "started") {
        await transport.start()
      }
      setIsAudioEnabled(true)
    } catch (error) {
      console.error("Error starting audio:", error)
      setIsLoadingSamples(false)
    }
  }, [isLoadingSamples, samplesReady])

  const handleEmotionChange = useCallback(
    async (newEmotion: string) => {
      setEmotion(newEmotion)

      if (newEmotion && emotionTimings[newEmotion]) {
        setIntensity([emotionTimings[newEmotion].intensity])
        setBeatSpeed([emotionTimings[newEmotion].beatSpeed])
      }

      if (!newEmotion) {
        await stopAudio()
        return
      }

      await startAudio()
    },
    [startAudio, stopAudio],
  )

  const handleToggleAudio = useCallback(async () => {
    if (isAudioEnabled) {
      await stopAudio()
    } else if (emotion) {
      await startAudio()
    }
  }, [emotion, isAudioEnabled, startAudio, stopAudio])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable=true]")) {
        return
      }
      event.preventDefault()
      void handleToggleAudio()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleToggleAudio])

  const sceneProps: SceneCanvasProps = {
    intensity: intensity[0],
    beatSpeed: beatSpeed[0],
    isAudioEnabled,
    samplesReady,
    emotion,
  }

  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center text-white">
      <AppChrome immersed={isAudioEnabled} />
      {isMounted ? (
        <SceneCanvas {...sceneProps} />
      ) : (
        <div className="h-full w-full bg-black" aria-hidden />
      )}
      <EmotionInput
        handleToggleAudio={handleToggleAudio}
        isAudioEnabled={isAudioEnabled}
        isLoadingSamples={isLoadingSamples}
        intensity={intensity}
        beatSpeed={beatSpeed}
        emotion={emotion}
        regulationLabel={
          emotion ? emotionRegulationTargets[emotion]?.label : undefined
        }
        setIntensity={setIntensity}
        setBeatSpeed={setBeatSpeed}
        onEmotionChange={handleEmotionChange}
        showControls={showControls}
        onToggleControls={() => setShowControls((visible) => !visible)}
      />
    </div>
  )
}

export default VisualResponse
