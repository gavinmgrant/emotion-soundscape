"use client"

import * as THREE from "three"
import { useRef, useMemo, useEffect, memo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useEmotionAudio } from "@/hooks/useEmotionAudio"
import {
  applyVisualEvent,
  computeDecomposedPointVisual,
  createVisualEnergyState,
  decayVisualEnergy,
} from "@/lib/visual/visualEnergy"
import type { WavePointsProps } from "@/types"

const WavePoints = memo(
  ({ intensity, beatSpeed, isAudioEnabled, samplesReady, emotion }: WavePointsProps) => {
    const pointsRef = useRef<THREE.Points>(null)
    const geometryRef = useRef<THREE.BufferGeometry>(null)
    const energyRef = useRef(createVisualEnergyState())
    const intensityRef = useRef(0)

    useEmotionAudio({
      emotion,
      isAudioEnabled,
      samplesReady,
      beatSpeed,
      intensity,
      onVisualEvent: (event) => {
        applyVisualEvent(energyRef.current, event)
      },
    })

    useEffect(() => {
      intensityRef.current = intensity
    }, [intensity])

    useEffect(() => {
      if (!isAudioEnabled) {
        energyRef.current = createVisualEnergyState()
      }
    }, [isAudioEnabled])

    const geometry = useMemo(() => {
      const size = 15
      const segments = 128
      const points: number[] = []
      const colors: number[] = []

      for (let i = 0; i <= segments; i++) {
        for (let j = 0; j <= segments; j++) {
          const x = (i / segments - 0.5) * size
          const y = (j / segments - 0.5) * size
          points.push(x, 0, y)
          colors.push(1, 1, 1)
        }
      }

      const bufferGeometry = new THREE.BufferGeometry()
      bufferGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3),
      )
      bufferGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      )
      return bufferGeometry
    }, [])

    useFrame(() => {
      if (!geometryRef.current) return

      const positions = geometryRef.current.attributes.position.array
      const colors = geometryRef.current.attributes.color.array

      decayVisualEnergy(energyRef.current)
      const energy = energyRef.current
      const intensityValue = intensityRef.current

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const z = positions[i + 2]

        const { height, r, g, b } = computeDecomposedPointVisual(
          x,
          z,
          energy,
          intensityValue,
        )

        positions[i + 1] = height

        const colorIndex = (i / 3) * 3
        colors[colorIndex] = r
        colors[colorIndex + 1] = g
        colors[colorIndex + 2] = b
      }

      geometryRef.current.attributes.position.needsUpdate = true
      geometryRef.current.attributes.color.needsUpdate = true
    })

    return (
      <points ref={pointsRef}>
        <primitive object={geometry} ref={geometryRef} />
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          transparent
          opacity={1}
          vertexColors
        />
      </points>
    )
  },
)

WavePoints.displayName = "WavePoints"

export type SceneCanvasProps = WavePointsProps

export default function SceneCanvas({
  intensity,
  beatSpeed,
  isAudioEnabled,
  samplesReady,
  emotion,
}: SceneCanvasProps) {
  return (
    <Canvas className="h-full w-full" camera={{ position: [0, 0, 20], fov: 30 }}>
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
        intensity={intensity}
        beatSpeed={beatSpeed}
        isAudioEnabled={isAudioEnabled}
        samplesReady={samplesReady}
        emotion={emotion}
      />
    </Canvas>
  )
}
