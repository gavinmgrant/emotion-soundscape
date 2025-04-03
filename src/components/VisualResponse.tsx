"use client"

import * as THREE from "three"
import * as Tone from "tone"
import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import EmotionInput from "./EmotionInput"
import { emotionSequences, emotionTimings } from "@/configs/emotions"
interface WavePointsProps {
  intensity: number
  beatSpeed: number
  isAudioEnabled: boolean
  emotion: string
}

const WavePoints = ({
  intensity,
  beatSpeed,
  isAudioEnabled,
  emotion,
}: WavePointsProps) => {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const sequenceRef = useRef<Tone.Sequence | null>(null)
  const pulseRef = useRef(0)
  const intensityRef = useRef(0)
  const transport = Tone.getTransport()

  // Initialize Tone.js synth
  useEffect(() => {
    if (!isAudioEnabled) return

    // Create and configure the synth
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { decay: 0.5, sustain: 0.6 },
    }).toDestination()

    // Set the volume
    synthRef.current.volume.value = -15

    // Define the melody notes
    // const notes = ["Db4", ["Eb4", "Ab4", "Bb4", "F4"], "Gb4", "Db5", "Eb5"]

    // Create a sequence for the melody
    sequenceRef.current = new Tone.Sequence(
      (time, note) => {
        if (synthRef.current) {
          synthRef.current.triggerAttackRelease(note, "2n", time)
          // Trigger pulse on each note
          pulseRef.current = 1
        }
      },
      emotionSequences[emotion],
      "4n"
    )

    // Start the sequence
    sequenceRef.current.start(0)

    return () => {
      try {
        // Stop the sequence at the next beat
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
  }, [isAudioEnabled, transport.seconds])

  // Update sequence speed based on beatSpeed
  useEffect(() => {
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

  // Create points geometry
  const geometry = useMemo(() => {
    const size = 15
    const segments = 128
    const points = []
    const colors = []

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

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    )
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    return geometry
  }, [])

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
          Math.sin(distanceFromCenter * waveFrequency - pulseRef.current * 2) *
          waveAmplitude
        const ripple2 =
          Math.sin(
            distanceFromCenter * waveFrequency * 0.8 - pulseRef.current * 1.6
          ) *
          waveAmplitude *
          0.7
        const ripple3 =
          Math.sin(
            distanceFromCenter * waveFrequency * 0.6 - pulseRef.current * 1.2
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

      geometryRef.current.attributes.position.needsUpdate = true
      geometryRef.current.attributes.color.needsUpdate = true
    }
  })

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
}

const VisualResponsePlane = () => {
  const defaultBeatSpeed = 0.5
  const defaultIntensity = 0.5

  const [emotion, setEmotion] = useState("")
  const [intensity, setIntensity] = useState([defaultIntensity])
  const [beatSpeed, setBeatSpeed] = useState([defaultBeatSpeed])
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)

  const transport = Tone.getTransport()

  useEffect(() => {
    if (emotion) {
      setIntensity([emotionTimings[emotion].intensity])
      setBeatSpeed([emotionTimings[emotion].beatSpeed])
    }
  }, [emotion])

  const handleToggleAudio = async () => {
    try {
      if (isAudioEnabled) {
        await transport.stop()
        setIsAudioEnabled(false)
        return
      }

      // Start the audio context first
      await Tone.start()
      await Tone.getContext().resume()

      // Set up the transport
      transport.bpm.value = 120
      await transport.start()

      setIsAudioEnabled(true)
    } catch (error) {
      console.error("Error starting audio:", error)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center text-white h-full w-screen">
      <h1 className="absolute top-0 text-lg sm:text-xl font-semibold px-3 py-2 m-3 text-center rounded-lg z-10 bg-black backdrop-blur-md">
        Emotion Soundscape
      </h1>
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
      />
    </div>
  )
}

export default VisualResponsePlane
