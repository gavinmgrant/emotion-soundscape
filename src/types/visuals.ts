/** Props interface for the WavePoints component
 *
 * @param intensity - Controls the amplitude of the wave animation
 * @param beatSpeed - Controls the speed of the audio sequence
 * @param isAudioEnabled - Whether audio is currently playing
 * @param emotion - The currently selected emotion
 */

export interface WavePointsProps {
  intensity: number
  beatSpeed: number
  isAudioEnabled: boolean
  samplesReady: boolean
  emotion: string
}
