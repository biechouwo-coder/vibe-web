import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, AbsoluteFill } from 'remotion'

interface ScreenSlideProps {
  readonly imageSrc: string
  readonly title: string
  readonly description: string
  readonly index: number
  readonly total: number
}

export const ScreenSlide: React.FC<ScreenSlideProps> = ({
  imageSrc,
  title,
  description,
  index,
  total,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const sectionDuration = durationInFrames / total
  const localFrame = frame - index * sectionDuration

  // Fade in at the start of this slide
  const opacity = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: 30,
  })

  // Subtle zoom from 0.95 → 1.0 (Ken Burns effect)
  const scale = interpolate(localFrame, [0, sectionDuration], [0.96, 1.0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Title fade-in (slightly delayed)
  const titleOpacity = interpolate(localFrame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Screen image with Ken Burns zoom */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </AbsoluteFill>

      {/* Bottom overlay with title and description */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(26, 24, 23, 0.85) 40%, rgba(26, 24, 23, 0.95))',
          padding: '120px 80px 60px',
          opacity: titleOpacity,
        }}
      >
        <h2
          style={{
            fontFamily: '"Source Serif 4", Georgia, serif',
            fontSize: 42,
            fontWeight: 600,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 20,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            margin: '12px 0 0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 60,
          display: 'flex',
          gap: 8,
          opacity: titleOpacity,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index ? 32 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === index ? '#013E75' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  )
}
