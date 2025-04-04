"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronsUpDown,
  Play,
  Pause,
} from "lucide-react"
import { emotions } from "@/configs/emotions"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmotionInputProps {
  handleToggleAudio: () => void
  isAudioEnabled: boolean
  intensity: number[]
  beatSpeed: number[]
  emotion: string
  setIntensity: (e: number[]) => void
  setBeatSpeed: (e: number[]) => void
  setEmotion: (e: string) => void
  showControls: boolean
}

const EmotionInput = ({
  handleToggleAudio,
  isAudioEnabled,
  intensity,
  beatSpeed,
  emotion,
  setIntensity,
  setBeatSpeed,
  setEmotion,
  showControls,
}: EmotionInputProps) => {
  const step = 0.025
  const [open, setOpen] = useState(false)

  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          className="absolute bottom-0 flex w-full max-w-md flex-col gap-3 p-3 sm:w-1/2"
          initial={{ opacity: 0, y: 240 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 240 }}
          transition={{ duration: 0.25 }}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {emotion
                  ? emotions.find(
                      (emo: { value: string; label: string }) =>
                        emo.value === emotion,
                    )?.label
                  : "Select an emotion..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="my-2 w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search emotions..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No emotions found.</CommandEmpty>
                  <CommandGroup>
                    {emotions.map((emo: { value: string; label: string }) => (
                      <CommandItem
                        key={emo.value}
                        value={emo.value}
                        onSelect={(currentEmotion: string) => {
                          setEmotion(
                            currentEmotion === emotion ? "" : currentEmotion,
                          )
                          setOpen(false)
                        }}
                      >
                        {emo.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            emotion === emo.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            className="w-full"
            onClick={handleToggleAudio}
            disabled={!emotion}
          >
            {isAudioEnabled ? (
              <span className="flex items-center gap-1">Pause {<Pause />}</span>
            ) : (
              <span className="flex items-center gap-1">Play {<Play />}</span>
            )}
          </Button>
          <div className="flex items-center justify-between gap-4">
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
          <div className="flex items-center justify-between gap-4">
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EmotionInput
