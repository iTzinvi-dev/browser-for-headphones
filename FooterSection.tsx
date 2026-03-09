'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const SPECS = [
  { label: 'Driver Size', value: '40mm' },
  { label: 'Frequency Response', value: '5Hz – 50kHz' },
  { label: 'THD', value: '< 0.001%' },
  { label: 'Impedance', value: '300Ω' },
  { label: 'Driver Material', value: 'Aerospace Titanium' },
  { label: 'Cable', value: '2m OFC Silver' },
  { label: 'Weight', value: '285g' },
  { label: 'Price', value: '$1,299' },
]

export default function FooterSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="relative"
      style={{ background: '#050505', paddingTop: '10vh', paddingBottom: '15vh' }}
    >
      {/* Hairline top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto px-8 md:px-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span
            className="text-white/20 tracking-[0.3em] text-xs uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Technical Specifications
          </span>
        </motion.div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {SPECS.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="py-8 pr-8"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="text-white/20 text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-inter)', fontSize: '0.6rem', letterSpacing: '0.15em' }}
              >
                {spec.label}
              </div>
              <div
                className="text-white/70"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  letterSpacing: '-0.01em',
                }}
              >
                {spec.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <h3
              className="text-white/80 mb-2"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                fontWeight: 300,
                letterSpacing: '-0.03em',
              }}
            >
              Ready to hear everything?
            </h3>
            <p
              className="text-white/30 text-sm"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.02em' }}
            >
              Ships Q2 2025 · Limited first run of 5,000 units
            </p>
          </div>
          <button
            className="group relative overflow-hidden border border-white/15 text-white/60 hover:text-white/90 hover:border-white/30 px-10 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-500 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <span className="relative z-10">Pre-order — $1,299</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            />
          </button>
        </motion.div>

        {/* Footer mark */}
        <div
          className="mt-20 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '32px' }}
        >
          <div className="flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="white" opacity="0.4" />
            </svg>
            <span
              className="text-white/20 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.2em' }}
            >
              Zenith X © 2025
            </span>
          </div>
          <span
            className="text-white/15 text-xs"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '0.05em' }}
          >
            Pure Sound. Pure Engineering.
          </span>
        </div>
      </div>
    </section>
  )
}
