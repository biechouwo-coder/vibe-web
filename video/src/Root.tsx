import React from 'react'
import { Composition } from 'remotion'
import { WalkthroughComposition } from './WalkthroughComposition'
import screens from '../screens.json'

const FPS = 30

const totalDuration = screens.screens.reduce(
  (acc, s) => acc + s.durationInSeconds,
  0
)

// +2.5s intro + 3s outro
const totalSeconds = totalDuration + 5.5
const durationInFrames = Math.ceil(totalSeconds * FPS)

export const Root: React.FC = () => {
  return (
    <Composition
      id="vibe-web-walkthrough"
      component={WalkthroughComposition}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
