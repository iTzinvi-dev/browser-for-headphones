'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion'

const TOTAL_FRAMES = 184
const FRAME_BASE = '/frames/'

// Naming: ezgif-frame-001.jpg ... ezgif-frame-184.jpg
function getFrameUrl(index: number): string {
  const padded = String(index + 1).padStart(3, '0')
  return `${FRAME_BASE}ezgif-frame-${padded}.jpg`
}

interface TextSection {
  startProgress: number
  endProgress: number
  text: string
  subtext: string
  align: 'left' | 'center' | 'right'
  label: string
}

const TEXT_SECTIONS: TextSection[] = [
  {
    startProgress: 0,
    endProgress: 0.18,
    text: 'Zenith X.',
    subtext: 'Pure Sound.',
    align: 'center',
    label: 'FLAGSHIP 2025',
  },
  {
    startProgress: 0.22,
    endProgress: 0.48,
    text: 'Precision\nEngineering.',
    subtext: 'Every component machined to tolerance of ±0.001mm.',
    align: 'left',
    label: 'ARCHITECTURE',
  },
  {
    startProgress: 0.52,
    endProgress: 0.78,
    text: 'Titanium\nDrivers.',
    subtext: '40mm aerospace-grade diaphragm. 0.001% THD.',
    align: 'right',
    label: 'ACOUSTICS',
  },
  {
    startProgress: 0.82,
    endProgress: 1.0,
    text: 'Hear\nEverything.',
    subtext: 'Experience sound as the artist intended.',
    align: 'center',
    label: 'ZENITH X — $1,299',
  },
]

function getTextOpacity(section: TextSection, progress: number): number {
  const fadeDuration = 0.06
  if (progress < section.startProgress) return 0
  if (progress > section.endProgress) return 0
  const fadeIn = (progress - section.startProgress) / fadeDuration
  const fadeOut = (section.endProgress - progress) / fadeDuration
  return Math.min(1, Math.min(fadeIn, fadeOut))
}

export default function HeadphoneScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [textStates, setTextStates] = useState<number[]>(TEXT_SECTIONS.map(() => 0))

  const { scrollYProgress } = useScroll({ target: containerRef })

  // Map scroll to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1])

  // Draw frame to canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imagesRef.current[Math.round(index)]
    if (!img?.complete || !img.naturalWidth) return

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Object-contain: scale to fit while maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = width / height

    let drawW: number, drawH: number, drawX: number, drawY: number
    if (imgAspect > canvasAspect) {
      drawW = width
      drawH = width / imgAspect
      drawX = 0
      drawY = (height - drawH) / 2
    } else {
      drawH = height
      drawW = height * imgAspect
      drawX = (width - drawW) / 2
      drawY = 0
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }, [])

  // Resize canvas to match device pixel ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
    drawFrame(currentFrameRef.current)
  }, [drawFrame])

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = []
    let loaded = 0

    const onLoad = () => {
      loaded++
      setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100))
      if (loaded === TOTAL_FRAMES) {
        imagesRef.current = images
        setIsLoaded(true)
        drawFrame(0)
      }
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = getFrameUrl(i)
      img.onload = onLoad
      img.onerror = onLoad // still count failed as done
      images[i] = img
    }

    return () => {
      images.forEach(img => { img.onload = null; img.onerror = null })
    }
  }, [drawFrame])

  // Setup canvas + resize listener
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // Update canvas on scroll using RAF for smooth rendering
  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!isLoaded) return
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(latest)))
    currentFrameRef.current = idx

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      drawFrame(idx)
    })
  })

  // Update text opacity on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const newStates = TEXT_SECTIONS.map(section => getTextOpacity(section, latest))
    setTextStates(newStates)
  })

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#050505' }}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Logo mark */}
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <circle cx="16" cy="16" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <circle cx="16" cy="16" r="3" fill="white" opacity="0.8" />
              </svg>
              <span
                className="text-white/60 tracking-[0.3em] text-xs uppercase"
                style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.3em' }}
              >
                Zenith X
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative overflow-hidden"
                style={{ width: '160px', height: '1px', background: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${loadProgress}%`,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.8))',
                  }}
                />
              </div>
              <span
                className="text-white/20 text-xs tabular-nums"
                style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.1em' }}
              >
                {loadProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: '#050505' }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ display: 'block' }}
        />

        {/* Nav */}
        <nav
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-7"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="white" opacity="0.7" />
            </svg>
            <span
              className="text-white/70 tracking-[0.2em] text-xs uppercase"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.2em' }}
            >
              Zenith X
            </span>
          </div>
          <div className="flex items-center gap-8">
            {['Sound', 'Design', 'Story'].map(item => (
              <span
                key={item}
                className="text-white/30 text-xs tracking-widest uppercase cursor-pointer hover:text-white/70 transition-colors duration-300"
                style={{ letterSpacing: '0.15em' }}
              >
                {item}
              </span>
            ))}
          </div>
        </nav>

        {/* Text Overlays */}
        {TEXT_SECTIONS.map((section, i) => {
          const opacity = textStates[i]
          const translateY = opacity < 1 ? (1 - opacity) * 20 : 0

          const positionClasses =
            section.align === 'left'
              ? 'left-12 md:left-20 max-w-sm'
              : section.align === 'right'
              ? 'right-12 md:right-20 max-w-sm text-right'
              : 'left-1/2 -translate-x-1/2 text-center max-w-2xl'

          return (
            <div
              key={i}
              className={`absolute bottom-24 ${positionClasses} z-10 pointer-events-none`}
              style={{
                opacity,
                transform: section.align === 'center'
                  ? `translateX(-50%) translateY(${translateY}px)`
                  : `translateY(${translateY}px)`,
                transition: 'none',
                willChange: 'opacity, transform',
              }}
            >
              {/* Label */}
              <div
                className="mb-4"
                style={{
                  display: 'flex',
                  justifyContent: section.align === 'right' ? 'flex-end' : section.align === 'center' ? 'center' : 'flex-start',
                }}
              >
                <span
                  className="text-white/25 tracking-[0.3em] text-xs uppercase"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {section.label}
                </span>
              </div>

              {/* Main heading */}
              <h2
                className="text-white/90 leading-none mb-4"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  whiteSpace: 'pre-line',
                }}
              >
                {section.text}
              </h2>

              {/* Divider */}
              <div
                className="mb-4"
                style={{
                  display: 'flex',
                  justifyContent: section.align === 'right' ? 'flex-end' : section.align === 'center' ? 'center' : 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '1px',
                    background: 'rgba(255,255,255,0.2)',
                  }}
                />
              </div>

              {/* Subtext */}
              <p
                className="text-white/40"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  lineHeight: 1.7,
                  fontWeight: 400,
                  maxWidth: '240px',
                  marginLeft: section.align === 'right' ? 'auto' : section.align === 'center' ? 'auto' : '0',
                  marginRight: section.align === 'center' ? 'auto' : '0',
                }}
              >
                {section.subtext}
              </p>

              {/* CTA on last section */}
              {i === TEXT_SECTIONS.length - 1 && (
                <div className="mt-8 flex justify-center">
                  <button
                    className="group relative overflow-hidden border border-white/20 text-white/70 hover:text-white px-8 py-3 text-xs tracking-[0.2em] uppercase transition-all duration-500"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    <span className="relative z-10">Pre-order Now</span>
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {/* Scroll indicator - fades out after first section */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{
            opacity: isLoaded ? Math.max(0, 1 - textStates[0] * 3) * (isLoaded ? 1 : 0) : 0,
            transition: 'opacity 0.3s',
          }}
        >
          <span
            className="text-white/20 tracking-[0.25em] text-xs uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Scroll
          </span>
          <div className="flex flex-col items-center gap-1">
            <div
              style={{
                width: '1px',
                height: '32px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                animation: 'scrollPulse 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Frame counter (dev/aesthetic detail) */}
        <div
          className="absolute bottom-8 right-8 z-10"
          style={{ opacity: isLoaded ? 0.15 : 0, transition: 'opacity 0.5s' }}
        >
          <span
            className="text-white tabular-nums"
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
            }}
          >
            {String(currentFrameRef.current + 1).padStart(3, '0')} / {String(TOTAL_FRAMES).padStart(3, '0')}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(0.7); }
        }
      `}</style>
    </div>
  )
}
