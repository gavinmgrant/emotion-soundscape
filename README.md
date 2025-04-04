# Emotion Soundscape

A meditative, interactive web experience that combines sound and visuals to create an immersive emotional journey.

## Overview

Emotion Soundscape is a single-page web application built with Next.js, Tone.js, and React Three Fiber. It invites users to select an emotion and be immersed in a pulsing world of synchronized sound and visuals. The experience creates a meditative space where users can explore different emotional states through interactive audio-visual feedback.

## Features

- **Emotion Selection**: Choose from various emotions to trigger different soundscapes
- **Real-time Audio-Visual Synchronization**: Sound and visuals pulse together in harmony
- **Interactive Controls**: Adjust intensity and beat speed to customize your experience
- **Responsive Design**: Works on both desktop and mobile devices
- **Immersive 3D Visualization**: Dynamic wave patterns that respond to the selected emotion

## Technical Stack

- **Frontend Framework**: Next.js with React
- **Audio Engine**: Tone.js for sound synthesis and sequencing
- **3D Rendering**: React Three Fiber (Three.js) for visual effects
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API for sharing state between components

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gavinmgrant/emotion-soundscape.git
   cd emotion-soundscape
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Select an emotion from the dropdown menu
2. Toggle audio on/off using the audio control
3. Adjust intensity and beat speed sliders to customize the experience
4. Observe the synchronized wave patterns that respond to your selections

## Project Structure

- `/src/components`: React components including VisualResponse, SoundResponse, and WavePoints
- `/src/contexts`: React contexts for state management (PulseContext)
- `/src/configs`: Configuration files for emotion sequences and timings
- `/src/lib`: Utility functions and audio helpers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tone.js](https://tonejs.github.io/) for audio synthesis
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for 3D rendering
- [Next.js](https://nextjs.org/) for the React framework

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
