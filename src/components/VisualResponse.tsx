"use client"

import * as Tone from "tone"
import dynamic from "next/dynamic"
import { useEffect, useState, useCallback } from "react"
import EmotionInput from "./EmotionInput"
import GitHubButton from "./GitHubButton"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { emotionTimings, emotionRegulationTargets } from "@/configs/emotions"
import { loadAudioSamples } from "@/hooks/useEmotionAudio"
import type { ControlsToggleProps } from "@/types"
import type { SceneCanvasProps } from "./SceneCanvas"

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" aria-hidden />,
})

const ControlsToggle = ({ showControls, onToggle }: ControlsToggleProps) => {
  return (
    <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between">
      <h1 className="rounded-lg bg-black px-2 py-1 text-lg font-semibold">
        Emotion Soundscape
      </h1>
      <div className="flex items-center gap-2">
        <Button className="w-auto sm:w-36" onClick={onToggle}>
          {showControls ? (
            <span className="flex items-center gap-2">
              Hide <span className="hidden sm:inline">controls</span>{" "}
              <ChevronUp />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Show <span className="hidden sm:inline">controls</span>{" "}
              <ChevronDown />
            </span>
          )}
        </Button>
        <GitHubButton />
      </div>
    </div>
  )
}

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

  const sceneProps: SceneCanvasProps = {
    intensity: intensity[0],
    beatSpeed: beatSpeed[0],
    isAudioEnabled,
    samplesReady,
    emotion,
  }

  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center text-white">
      <ControlsToggle
        showControls={showControls}
        onToggle={() => setShowControls(!showControls)}
      />
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
      />
    </div>
  )
}

export default VisualResponse
