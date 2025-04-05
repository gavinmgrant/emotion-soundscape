"use client"

import * as THREE from "three"
import * as Tone from "tone"
import { useRef, useMemo, useEffect, useState, useCallback, memo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import EmotionInput from "./EmotionInput"
import GitHubButton from "./GitHubButton"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { emotionSequences, emotionTimings } from "@/configs/emotions"

/** Props interface for the WavePoints component
 *
 * @param intensity - Controls the amplitude of the wave animation
 * @param beatSpeed - Controls the speed of the audio sequence
 * @param isAudioEnabled - Whether audio is currently playing
 * @param emotion - The currently selected emotion
 */

interface WavePointsProps {
  intensity: number
  beatSpeed: number
  isAudioEnabled: boolean
  emotion: string
}

/**
 * WavePoints Component
 *
 * A memoized component that renders a 3D grid of points that animate based on audio pulses.
 * We memoize the component to prevent unnecessary re-renders when props remain the same.
 * The points form a wave pattern that responds to the selected emotion, intensity, and beat speed.
 */
const WavePoints = memo(
  ({ intensity, beatSpeed, isAudioEnabled, emotion }: WavePointsProps) => {
    // Refs to store Three.js objects and Tone.js audio objects
    const pointsRef = useRef<THREE.Points>(null)
    const geometryRef = useRef<THREE.BufferGeometry>(null)
    const synthRef = useRef<Tone.PolySynth | null>(null)
    const sequenceRef = useRef<Tone.Sequence | null>(null)
    const pulseRef = useRef(0)
    const intensityRef = useRef(0)
    const transport = Tone.getTransport()

    /**
     * Initialize Tone.js synth and sequence
     *
     * This effect creates a polyphonic synthesizer and a sequence that plays
     * the notes for the selected emotion. It also sets up cleanup functions
     * to properly dispose of audio resources when the component unmounts.
     */
    useEffect(() => {
      if (!isAudioEnabled) return

      // Create and configure the synth with a sine wave oscillator
      // https://tonejs.github.io/docs/r13/PolySynth
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { decay: 0.5, sustain: 0.6 },
      }).toDestination()

      // Set the volume to a comfortable level
      synthRef.current.volume.value = -15

      // Create a sequence for the melody based on the selected emotion
      sequenceRef.current = new Tone.Sequence(
        (time, note) => {
          if (synthRef.current) {
            // Play each note in the sequence
            synthRef.current.triggerAttackRelease(note, "2n", time)
            // Trigger pulse on each note to sync with visual animation
            pulseRef.current = 1
          }
        },
        emotionSequences[emotion],
        "4n",
      )

      // Start the sequence
      sequenceRef.current.start(0)

      // Cleanup function to properly dispose of audio resources
      return () => {
        try {
          // Stop the sequence at the next beat for a smoother transition
          if (sequenceRef.current) {
            const currentTime = transport.seconds
            const nextBeat = Math.ceil(currentTime * 4) / 4 // Round up to next quarter note
            sequenceRef.current.stop(nextBeat)
            sequenceRef.current.dispose()
          }
          if (synthRef.current) {
            synthRef.current.dispose()
          }
        } catch (error) {
          console.error("Error during audio cleanup:", error)
          // Force cleanup if normal cleanup fails
          if (sequenceRef.current) {
            sequenceRef.current.dispose()
          }
          if (synthRef.current) {
            synthRef.current.dispose()
          }
        }
      }
    }, [emotion, isAudioEnabled, transport.seconds])

    /**
     * Update sequence speed based on beatSpeed
     *
     * This effect adjusts the playback rate of the sequence based on the beatSpeed
     * parameter, allowing for dynamic tempo changes.
     */
    useEffect(() => {
      // Store the current intensity in a ref for use in the animation frame
      intensityRef.current = intensity

      if (sequenceRef.current && isAudioEnabled) {
        if (beatSpeed > 0) {
          // Adjust the sequence speed based on beatSpeed
          sequenceRef.current.playbackRate = beatSpeed
          sequenceRef.current.start()
        } else {
          sequenceRef.current.stop()
        }
      }
    }, [intensity, beatSpeed, isAudioEnabled])

    /**
     * Create points geometry
     *
     * This memoized value creates a grid of points that will be animated.
     * The points are arranged in a 2D grid and then rotated to face the camera.
     */
    const geometry = useMemo(() => {
      const size = 15
      const segments = 128
      const points = []
      const colors = []

      // Create a grid of points
      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const x = (i / segments - 0.5) * size
          const y = (j / segments - 0.5) * size
          // Rotate points 90 degrees on X axis by swapping y and z
          points.push(x, 0, y)
          // Add initial color (white)
          colors.push(1, 1, 1) // RGB for white
        }
      }

      // Create a buffer geometry with position and color attributes
      // https://threejs.org/docs/#api/en/core/BufferGeometry
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3),
      )
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      )
      return geometry
    }, [])

    /**
     * Animation frame update
     *
     * This function runs on each animation frame and updates the positions
     * and colors of the points to create the wave animation effect.
     * The useFrame hook is a React Three Fiber hook that runs on each animation frame.
     * https://r3f.docs.pmnd.rs/api/hooks#useframe
     */
    useFrame(() => {
      if (pointsRef.current && geometryRef.current) {
        const positions = geometryRef.current.attributes.position.array
        const colors = geometryRef.current.attributes.color.array

        // Decay the pulse more slowly for smoother ripples
        pulseRef.current *= 0.97

        // Calculate distance from center for each point
        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i]
          const z = positions[i + 2]
          const distanceFromCenter = Math.sqrt(x * x + z * z)

          // Create smoother ripple patterns
          const waveFrequency = 3
          const waveAmplitude = pulseRef.current * intensityRef.current * 2 // Wave height based on intensity

          // Create multiple overlapping ripples with different phases
          const ripple1 =
            Math.sin(
              distanceFromCenter * waveFrequency - pulseRef.current * 2,
            ) * waveAmplitude
          const ripple2 =
            Math.sin(
              distanceFromCenter * waveFrequency * 0.8 - pulseRef.current * 1.6,
            ) *
            waveAmplitude *
            0.7
          const ripple3 =
            Math.sin(
              distanceFromCenter * waveFrequency * 0.6 - pulseRef.current * 1.2,
            ) *
            waveAmplitude *
            0.5

          // Add a circular wave that expands outward
          const expandingWave =
            Math.sin(distanceFromCenter - pulseRef.current * 3) *
            waveAmplitude *
            0.8

          // Combine all waves with distance-based attenuation
          const distanceAttenuation = Math.max(0, 1 - distanceFromCenter / 10) // Increased range
          const height =
            (ripple1 + ripple2 + ripple3 + expandingWave) * distanceAttenuation
          positions[i + 1] = height

          // Update colors based on height with white to dark blue gradient
          const colorIndex = (i / 3) * 3
          const blueIntensity = Math.min(1, Math.abs(height) * 0.7 + 0.3) // Base blue intensity
          const whiteIntensity = Math.max(0, 1 - Math.abs(height) * 0.7) // White intensity that fades with height

          // Set RGB values for white to dark blue gradient
          colors[colorIndex] = whiteIntensity // R
          colors[colorIndex + 1] = whiteIntensity // G
          colors[colorIndex + 2] = whiteIntensity + blueIntensity // B
        }

        // Mark attributes as needing update
        geometryRef.current.attributes.position.needsUpdate = true
        geometryRef.current.attributes.color.needsUpdate = true
      }
    })

    // Render the points with the geometry and material
    return (
      <>
        <points ref={pointsRef}>
          <primitive object={geometry} ref={geometryRef} />
          <pointsMaterial
            size={0.05}
            sizeAttenuation={true}
            transparent
            opacity={1}
            vertexColors
          />
        </points>
      </>
    )
  },
)

// Set display name for debugging
WavePoints.displayName = "WavePoints"

/** Props interface for the ControlsToggle component
 *
 * @param showControls - Whether the controls are currently visible
 * @param onToggle - Function to call when the toggle button is clicked
 */

interface ControlsToggleProps {
  showControls: boolean
  onToggle: () => void
}

/**
 * ControlsToggle Component
 *
 * A component that renders a button to toggle the visibility of the controls.
 * It also displays the app title and a GitHub button.
 */
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

/**
 * VisualResponse Component
 *
 * The main component that orchestrates the visual and audio experience.
 * It manages the state for emotion, intensity, beat speed, and audio controls,
 * and renders the 3D canvas with the WavePoints component and the EmotionInput controls.
 */
const VisualResponse = () => {
  // Default values for beat speed and intensity
  const defaultBeatSpeed = 0.5
  const defaultIntensity = 0.5

  // State for emotion, intensity, beat speed, audio, and controls visibility
  const [emotion, setEmotion] = useState("")
  const [intensity, setIntensity] = useState([defaultIntensity])
  const [beatSpeed, setBeatSpeed] = useState([defaultBeatSpeed])
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // Get the Tone.js transport for controlling audio timing
  const transport = Tone.getTransport()

  /**
   * Update intensity and beat speed when emotion changes
   *
   * This effect updates the intensity and beat speed based on the
   * selected emotion using the emotionTimings configuration.
   */
  useEffect(() => {
    if (emotion) {
      setIntensity([emotionTimings[emotion].intensity])
      setBeatSpeed([emotionTimings[emotion].beatSpeed])
    }
  }, [emotion])

  /**
   * Toggle audio playback
   *
   * This callback function handles starting and stopping the audio.
   * It ensures the audio context is properly initialized before playing.
   */
  const handleToggleAudio = useCallback(async () => {
    try {
      if (isAudioEnabled) {
        // Stop audio if it's currently playing
        await transport.stop()
        setIsAudioEnabled(false)
        return
      }

      // Start the audio context first
      await Tone.start()
      await Tone.getContext().resume()

      // Set up the transport to play at 120 BPM
      // https://tonejs.github.io/docs/r13/Transport
      transport.bpm.value = 120
      await transport.start()

      setIsAudioEnabled(true)
    } catch (error) {
      console.error("Error starting audio:", error)
    }
  }, [isAudioEnabled, transport])

  // Render the main component with canvas, controls, and emotion input
  return (
    <div className="relative flex h-full w-screen flex-col items-center justify-center text-white">
      <ControlsToggle
        showControls={showControls}
        onToggle={() => setShowControls(!showControls)}
      />
      <Canvas className="w-full" camera={{ position: [0, 0, 20], fov: 30 }}>
        <OrbitControls
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          maxDistance={30}
          minDistance={6}
        />
        <ambientLight intensity={1} />
        <pointLight position={[20, 20, 20]} />
        <WavePoints
          intensity={intensity[0]}
          beatSpeed={beatSpeed[0]}
          isAudioEnabled={isAudioEnabled}
          emotion={emotion}
        />
      </Canvas>
      <EmotionInput
        handleToggleAudio={handleToggleAudio}
        isAudioEnabled={isAudioEnabled}
        intensity={intensity}
        beatSpeed={beatSpeed}
        emotion={emotion}
        setIntensity={setIntensity}
        setBeatSpeed={setBeatSpeed}
        setEmotion={setEmotion}
        showControls={showControls}
      />
    </div>
  )
}

export default VisualResponse
