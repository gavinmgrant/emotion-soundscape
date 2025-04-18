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
  emotion: string
}

/** Props interface for the ControlsToggle component
 *
 * @param showControls - Whether the controls are currently visible
 * @param onToggle - Function to call when the toggle button is clicked
 */

export interface ControlsToggleProps {
  showControls: boolean
  onToggle: () => void
}
