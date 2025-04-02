"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import * as Tone from "tone"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface WavePointsProps {
  beatSpeed: number
  isAudioEnabled: boolean
}

const WavePoints = ({ beatSpeed, isAudioEnabled }: WavePointsProps) => {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const synthRef = useRef<Tone.Synth | null>(null)
  const loopRef = useRef<Tone.Loop | null>(null)
  const pulseRef = useRef(0)

  // Initialize Tone.js synth
  useEffect(() => {
    if (!isAudioEnabled) return

    console.log("Initializing audio...")

    // Create and configure the synth
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { decay: 0.1, sustain: 0.1 },
    }).toDestination()

    // Set the volume
    synthRef.current.volume.value = -10

    // Create a loop for the beat
    loopRef.current = new Tone.Loop((time) => {
      if (synthRef.current) {
        console.log("Playing beat at time:", time)
        synthRef.current.triggerAttackRelease("C4", "8n", time)
        // Trigger pulse on beat
        pulseRef.current = 1
      }
    }, "4n")

    // Start the loop
    loopRef.current.start(0)
    console.log("Loop started")

    return () => {
      console.log("Cleaning up audio...")
      loopRef.current?.stop()
      loopRef.current?.dispose()
      synthRef.current?.dispose()
    }
  }, [isAudioEnabled])

  // Update loop interval based on beatSpeed
  useEffect(() => {
    if (loopRef.current && isAudioEnabled) {
      console.log("Updating beat speed to:", beatSpeed)
      if (beatSpeed > 0) {
        // Invert the beat speed relationship (higher speed = faster beats)
        const interval = `${1 / beatSpeed}n`
        loopRef.current.interval = interval
        loopRef.current.start()
      } else {
        loopRef.current.stop()
      }
    }
  }, [beatSpeed, isAudioEnabled])

  // Create points geometry
  const geometry = useMemo(() => {
    const size = 15
    const segments = 96
    const points = []

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = (i / segments - 0.5) * size
        const y = (j / segments - 0.5) * size
        // Rotate points 90 degrees on X axis by swapping y and z
        points.push(x, 0, y)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    )
    return geometry
  }, [])

  useFrame(() => {
    if (pointsRef.current && geometryRef.current) {
      const positions = geometryRef.current.attributes.position.array

      // Decay the pulse more slowly
      pulseRef.current *= 0.95

      // Calculate distance from center for each point
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const z = positions[i + 2] // Use z instead of y for distance calculation
        const distanceFromCenter = Math.sqrt(x * x + z * z)

        // Create circular wave patterns with slower frequency
        const waveFrequency = 2.5 // Reduced from 4 to 2 for slower waves
        const waveAmplitude = pulseRef.current * beatSpeed * 1 // Controls wave height

        // Create concentric wave patterns with slower movement
        const wave1 =
          Math.sin(distanceFromCenter * waveFrequency - pulseRef.current) *
          waveAmplitude
        const wave2 =
          Math.sin(
            distanceFromCenter * waveFrequency * 0.5 - pulseRef.current * 0.5
          ) *
          waveAmplitude *
          0.5
        const wave3 =
          Math.sin(distanceFromCenter * waveFrequency * 0.25) *
          waveAmplitude *
          0.25

        // Combine waves and apply distance-based attenuation
        const distanceAttenuation = Math.max(0, 1 - distanceFromCenter / 7)
        positions[i + 1] = (wave1 + wave2 + wave3) * distanceAttenuation
      }

      geometryRef.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={pointsRef}>
        <primitive object={geometry} ref={geometryRef} />
        <pointsMaterial
          size={0.075}
          sizeAttenuation={true}
          transparent
          opacity={0.75}
          color="white"
        />
      </points>
    </>
  )
}

const VisualResponsePlane = () => {
  const [beatSpeed, setBeatSpeed] = useState([1.25])
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)

  const transport = Tone.getTransport()

  const handleToggleAudio = async () => {
    try {
      console.log("Starting audio context...")
      if (isAudioEnabled) {
        await transport.stop()
        setIsAudioEnabled(false)
        return
      }
      await transport.start()
      console.log("Audio context started")

      // Set up the transport
      transport.bpm.value = 120
      transport.start()
      console.log("Transport started")

      setIsAudioEnabled(true)
    } catch (error) {
      console.error("Error starting audio:", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-white h-screen w-screen">
      <Canvas className="w-full" camera={{ position: [0, 0, 20], fov: 30 }}>
        <OrbitControls
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          maxDistance={30}
          minDistance={1}
        />
        <ambientLight intensity={1} />
        <pointLight position={[20, 20, 20]} />
        <WavePoints beatSpeed={beatSpeed[0]} isAudioEnabled={isAudioEnabled} />
      </Canvas>

      <div className="flex flex-col gap-4 mt-4 m-4 w-1/2 max-w-lg">
        <Button onClick={handleToggleAudio}>
          {isAudioEnabled ? "Stop Audio" : "Start Audio"}
        </Button>
        <div className="flex items-center gap-4 justify-between">
          <label>Slower</label>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            defaultValue={[1.25]}
            value={beatSpeed}
            onValueChange={(e) => setBeatSpeed(e)}
          />
          <label>Faster</label>
        </div>
      </div>
    </div>
  )
}

export default VisualResponsePlane
