"use client"

import { useId, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Gauge, Loader2, Pause, Play, Volume2 } from "lucide-react"
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
import { getEmotionVisualTint } from "@/lib/visual/emotionVisualPalette"
import type { EmotionInputProps } from "@/types"

const SLIDER_MIN = 0.2
const SLIDER_MAX = 0.8
const SLIDER_STEP = 0.025

function tintToCss(emotion: string) {
  const { r, g, b } = getEmotionVisualTint(emotion)
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`
}

function sliderPercent(value: number) {
  return Math.round(((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100)
}

function clampSlider(value: number) {
  return Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, value))
}

const EmotionInput = ({
  handleToggleAudio,
  isAudioEnabled,
  isLoadingSamples,
  intensity,
  beatSpeed,
  emotion,
  regulationLabel,
  setIntensity,
  setBeatSpeed,
  onEmotionChange,
  showControls,
}: EmotionInputProps) => {
  const [open, setOpen] = useState(false)
  const intensityId = useId()
  const tempoId = useId()
  const selectedEmotion = emotions.find((emo) => emo.value === emotion)
  const accent = emotion ? tintToCss(emotion) : "rgb(255 255 255)"

  return (
    <AnimatePresence initial={false}>
      {showControls && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          transition={{ duration: 0.25 }}
        >
          <div className="pointer-events-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-white/12 bg-black/55 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-w-lg">
            <p
              className="min-h-5 text-center text-sm text-white/70"
              aria-live="polite"
            >
              {regulationLabel ?? "Choose an emotion to begin"}
            </p>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                onClick={handleToggleAudio}
                disabled={!emotion || isLoadingSamples}
                aria-label={
                  isLoadingSamples
                    ? "Loading sounds"
                    : isAudioEnabled
                      ? "Pause soundscape"
                      : "Play soundscape"
                }
                title={
                  !emotion
                    ? "Choose an emotion to play"
                    : isAudioEnabled
                      ? "Pause"
                      : "Play"
                }
                className={cn(
                  "size-12 shrink-0 rounded-full border border-white/10 bg-white/15 text-white shadow-none",
                  isAudioEnabled &&
                    "shadow-[0_0_0_3px_rgba(255,255,255,0.22)]",
                  !emotion && "opacity-50",
                )}
                style={
                  emotion
                    ? { backgroundColor: accent, color: "#111" }
                    : undefined
                }
              >
                {isLoadingSamples ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : isAudioEnabled ? (
                  <Pause className="size-5 fill-current" />
                ) : (
                  <Play className="size-5 fill-current" />
                )}
              </Button>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select emotion"
                    className="h-12 min-w-0 flex-1 justify-between rounded-xl border border-white/10 bg-white/10 text-left text-base text-white hover:bg-white/15"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: emotion ? accent : "rgb(255 255 255 / 0.35)",
                        }}
                      />
                      <span className="truncate">
                        {selectedEmotion?.label ?? "How are you feeling?"}
                      </span>
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="top"
                  collisionPadding={16}
                  className="w-[var(--radix-popover-trigger-width)] rounded-xl border-white/10 bg-zinc-950/95 p-0 text-white backdrop-blur-xl"
                >
                  <Command className="rounded-xl bg-transparent text-white **:data-[slot=command-input-wrapper]:border-white/10">
                    <CommandInput
                      placeholder="Search emotions..."
                      className="h-9 text-white placeholder:text-white/40"
                    />
                    <CommandList className="max-h-[min(14rem,40vh)]">
                      <CommandEmpty className="text-white/60">
                        No emotions found.
                      </CommandEmpty>
                      <CommandGroup>
                        {emotions.map((emo) => {
                          const color = tintToCss(emo.value)
                          return (
                            <CommandItem
                              key={emo.value}
                              value={emo.value}
                              keywords={[emo.label]}
                              onSelect={(currentEmotion) => {
                                onEmotionChange(currentEmotion)
                                setOpen(false)
                              }}
                              className="cursor-pointer rounded-xl py-2.5 text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                            >
                              <span
                                aria-hidden
                                className="size-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              {emo.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  emotion === emo.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-4">
              <ControlSlider
                id={intensityId}
                label="Intensity"
                icon={<Volume2 className="size-3.5" />}
                minLabel="Softer"
                maxLabel="Fuller"
                value={intensity[0]}
                onValueChange={(next) => setIntensity([next])}
              />
              <ControlSlider
                id={tempoId}
                label="Tempo"
                icon={<Gauge className="size-3.5" />}
                minLabel="Slower"
                maxLabel="Faster"
                value={beatSpeed[0]}
                onValueChange={(next) => setBeatSpeed([next])}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ControlSlider({
  id,
  label,
  icon,
  minLabel,
  maxLabel,
  value,
  onValueChange,
}: {
  id: string
  label: string
  icon: ReactNode
  minLabel: string
  maxLabel: string
  value: number
  onValueChange: (value: number) => void
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-xs text-white/70">
        <label htmlFor={id} className="flex items-center gap-1.5 font-medium text-white/85">
          {icon}
          {label}
        </label>
        <span className="tabular-nums text-white/55">{sliderPercent(value)}%</span>
      </div>
      <Slider
        id={id}
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={[value]}
        onValueChange={(next) => onValueChange(clampSlider(next[0] ?? value))}
        aria-label={label}
        className="[&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-white/20"
      />
      <div className="flex justify-between text-[11px] tracking-wide text-white/40 uppercase">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

export default EmotionInput
