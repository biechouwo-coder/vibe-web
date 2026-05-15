import React from 'react'
import { AbsoluteFill, Sequence, useVideoConfig, Audio } from 'remotion'
import { ScreenSlide } from './ScreenSlide'
import screens from '../screens.json'

export const WalkthroughComposition: React.FC = () => {
  const { fps } = useVideoConfig()

  const totalFrames = screens.screens.reduce(
    (acc, screen) => acc + screen.durationInSeconds * fps,
    0
  )

  let frameOffset = 0

  return (
    <AbsoluteFill style={{ backgroundColor: '#faf8f3' }}>
      {screens.screens.map((screen, index) => {
        const durationInFrames = screen.durationInSeconds * fps
        const currentOffset = frameOffset
        frameOffset += durationInFrames

        return (
          <Sequence
            key={screen.id}
            from={currentOffset}
            durationInFrames={durationInFrames}
          >
            <ScreenSlide
              imageSrc={screen.imagePath}
              title={screen.title}
              description={screen.description}
              index={index}
              total={screens.screens.length}
            />
          </Sequence>
        )
      })}

      {/* Title card at start */}
      <Sequence from={0} durationInFrames={Math.floor(fps * 2.5)}>
        <AbsoluteFill
          style={{
            backgroundColor: '#1a1817',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: '#706c67',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Walkthrough
          </div>
          <h1
            style={{
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontSize: 56,
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {screens.projectName}
          </h1>
          <p
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 20,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 20,
            }}
          >
            {screens.screens.length} screens
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* End card */}
      <Sequence from={totalFrames} durationInFrames={Math.floor(fps * 2)}>
        <AbsoluteFill
          style={{
            backgroundColor: '#013E75',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <h2
            style={{
              fontFamily: '"Source Serif 4", Georgia, serif',
              fontSize: 48,
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            Start your research.
          </h2>
          <p
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 20,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 16,
            }}
          >
            vibe.web
          </p>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
