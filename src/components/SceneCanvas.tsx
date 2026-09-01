"use client"

import * as THREE from "three"
import { useRef, useMemo, useEffect, memo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useEmotionAudio } from "@/hooks/useEmotionAudio"
import { getEmotionVisualTint } from "@/lib/visual/emotionVisualPalette"
import {
  applyVisualEvent,
  computeDecomposedPointVisual,
  computeVisualPulse,
  createVisualEnergyState,
  decayVisualEnergy,
} from "@/lib/visual/visualEnergy"
import type { WavePointsProps } from "@/types"

const GRID_SEGMENTS = 128
const GRID_SIZE = 15
const POINT_COUNT = (GRID_SEGMENTS + 1) * (GRID_SEGMENTS + 1)
const COLOR_LERP = 0.24

const WavePoints = memo(
  ({ intensity, beatSpeed, isAudioEnabled, samplesReady, emotion }: WavePointsProps) => {
    const pointsRef = useRef<THREE.Points>(null)
    const geometryRef = useRef<THREE.BufferGeometry>(null)
    const energyRef = useRef(createVisualEnergyState())
    const intensityRef = useRef(0)
    const beatSpeedRef = useRef(0.5)
    const isAudioEnabledRef = useRef(false)
    const emotionRef = useRef("")
    const baseXZ = useRef<Float32Array | null>(null)
    const smoothedColors = useRef<Float32Array | null>(null)

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
      beatSpeedRef.current = beatSpeed
    }, [beatSpeed])

    useEffect(() => {
      isAudioEnabledRef.current = isAudioEnabled
    }, [isAudioEnabled])

    useEffect(() => {
      emotionRef.current = emotion
    }, [emotion])

    useEffect(() => {
      if (!isAudioEnabled) {
        energyRef.current = createVisualEnergyState()
      }
    }, [isAudioEnabled])

    const geometry = useMemo(() => {
      const positions = new Float32Array(POINT_COUNT * 3)
      const colors = new Float32Array(POINT_COUNT * 3)
      const xz = new Float32Array(POINT_COUNT * 2)

      let index = 0
      for (let i = 0; i <= GRID_SEGMENTS; i++) {
        for (let j = 0; j <= GRID_SEGMENTS; j++) {
          const x = (i / GRID_SEGMENTS - 0.5) * GRID_SIZE
          const z = (j / GRID_SEGMENTS - 0.5) * GRID_SIZE
          const pointIndex = index * 3
          const xzIndex = index * 2

          positions[pointIndex] = x
          positions[pointIndex + 1] = 0
          positions[pointIndex + 2] = z

          xz[xzIndex] = x
          xz[xzIndex + 1] = z

          colors[pointIndex] = 0.55
          colors[pointIndex + 1] = 0.7
          colors[pointIndex + 2] = 1
          index++
        }
      }

      baseXZ.current = xz
      smoothedColors.current = colors.slice()

      const bufferGeometry = new THREE.BufferGeometry()
      bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
      return bufferGeometry
    }, [])

    useFrame(({ clock }) => {
      if (!geometryRef.current || !baseXZ.current || !smoothedColors.current) return

      const positions = geometryRef.current.attributes.position.array as Float32Array
      const colors = geometryRef.current.attributes.color.array as Float32Array
      const smoothed = smoothedColors.current
      const xz = baseXZ.current

      decayVisualEnergy(energyRef.current)
      const energy = energyRef.current
      const motion = {
        time: clock.getElapsedTime(),
        beatSpeed: beatSpeedRef.current,
        intensity: intensityRef.current,
        isAudioEnabled: isAudioEnabledRef.current,
        emotionTint: getEmotionVisualTint(emotionRef.current),
      }

      for (let index = 0; index < POINT_COUNT; index++) {
        const x = xz[index * 2]
        const z = xz[index * 2 + 1]
        const positionIndex = index * 3
        const colorIndex = positionIndex

        const { height, r, g, b } = computeDecomposedPointVisual(
          x,
          z,
          energy,
          motion,
        )

        positions[positionIndex + 1] = height

        smoothed[colorIndex] += (r - smoothed[colorIndex]) * COLOR_LERP
        smoothed[colorIndex + 1] += (g - smoothed[colorIndex + 1]) * COLOR_LERP
        smoothed[colorIndex + 2] += (b - smoothed[colorIndex + 2]) * COLOR_LERP

        colors[colorIndex] = smoothed[colorIndex]
        colors[colorIndex + 1] = smoothed[colorIndex + 1]
        colors[colorIndex + 2] = smoothed[colorIndex + 2]
      }

      geometryRef.current.attributes.position.needsUpdate = true
      geometryRef.current.attributes.color.needsUpdate = true

      const material = pointsRef.current?.material
      if (material instanceof THREE.PointsMaterial) {
        material.size = 0.042 * computeVisualPulse(energy, motion.time, motion.beatSpeed)
        material.opacity = isAudioEnabledRef.current ? 0.95 : 0.72
      }
    })

    return (
      <points ref={pointsRef}>
        <primitive object={geometry} ref={geometryRef} />
        <pointsMaterial
          size={0.042}
          sizeAttenuation
          transparent
          opacity={0.95}
          vertexColors
          toneMapped
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
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 20], fov: 30 }}
      onContextMenu={(event) => event.preventDefault()}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 14, 32]} />
      <OrbitControls
        enablePan={false}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        maxDistance={24}
        minDistance={6}
      />
      <ambientLight intensity={0.35} />
      <pointLight position={[12, 18, 14]} intensity={0.8} color="#9ec5ff" />
      <pointLight position={[-10, -6, 8]} intensity={0.35} color="#ffb8e8" />
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
