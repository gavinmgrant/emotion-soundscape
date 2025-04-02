"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"

interface EmotionInputProps {
  handleToggleAudio: () => void
  isAudioEnabled: boolean
  intensity: number[]
  beatSpeed: number[]
  setIntensity: (e: number[]) => void
  setBeatSpeed: (e: number[]) => void
}

const EmotionInput = ({
  handleToggleAudio,
  isAudioEnabled,
  intensity,
  beatSpeed,
  setIntensity,
  setBeatSpeed,
}: EmotionInputProps) => {
  const step = 0.025
  return (
    <div className="flex flex-col gap-4 mt-4 m-4 w-full sm:w-1/2 max-w-lg msx-4">
      <Button onClick={handleToggleAudio}>
        {isAudioEnabled ? "Stop Audio" : "Start Audio"}
      </Button>
      <div className="flex items-center gap-4 justify-between">
        <Button
          className="w-24"
          onClick={() => setIntensity([intensity[0] - step])}
        >
          <ChevronLeft /> Lower
        </Button>
        <Slider
          min={0.2}
          max={0.8}
          step={step}
          defaultValue={intensity}
          value={intensity}
          onValueChange={(e) => setIntensity([e[0]])}
        />
        <Button
          className="w-24 text-right"
          onClick={() => setIntensity([intensity[0] + step])}
        >
          Higher <ChevronRight />
        </Button>
      </div>
      <div className="flex items-center gap-4 justify-between">
        <Button
          className="w-24"
          onClick={() => setBeatSpeed([beatSpeed[0] - step])}
        >
          <ChevronLeft /> Slower
        </Button>
        <Slider
          min={0.2}
          max={0.8}
          step={step}
          defaultValue={beatSpeed}
          value={beatSpeed}
          onValueChange={(e) => setBeatSpeed([e[0]])}
        />
        <Button
          className="w-24 text-right"
          onClick={() => setBeatSpeed([beatSpeed[0] + step])}
        >
          Faster <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default EmotionInput
