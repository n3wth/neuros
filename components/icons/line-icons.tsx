'use client'

import { SVGProps } from 'react'

// Minimalist line-art style icons with calligraphy-inspired strokes

export const BrainIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2C7 2 4 5 4 9c0 2.5 1 4 2 5 0 2 1 3 2 4h8c1-1 2-2 2-4 1-1 2-2.5 2-5 0-4-3-7-8-7z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 9c0-1 1-2 2-2M14 9c0-1 1-2 2-2M9 13c0 1 1.5 2 3 2s3-1 3-2" strokeLinecap="round" />
  </svg>
)

export const CodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4l-4 16" strokeLinecap="round" />
  </svg>
)

export const BeakerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9 3h6v7l4 9H5l4-9V3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 3h6M7 14h10" strokeLinecap="round" />
    <circle cx="10" cy="17" r="0.5" fill="currentColor" />
    <circle cx="14" cy="16" r="0.5" fill="currentColor" />
  </svg>
)

export const ChartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12l4-4 3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="11" cy="8" r="1" fill="currentColor" />
    <circle cx="14" cy="11" r="1" fill="currentColor" />
    <circle cx="19" cy="6" r="1" fill="currentColor" />
  </svg>
)

export const PaletteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2-1 2-2v-2c0-1 1-2 2-2h3c1 0 2-1 2-2 0-5.5-4.5-12-9-12z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="16" cy="10" r="1" fill="currentColor" />
  </svg>
)

export const GlobeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h20M12 2c3 3 4 7 4 10s-1 7-4 10M12 2c-3 3-4 7-4 10s1 7 4 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M4 19V5c0-1 1-2 2-2h12c1 0 2 1 2 2v14l-8-3-8 3z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7h8M8 11h4" strokeLinecap="round" />
  </svg>
)

export const RocketIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2c3 0 7 2 7 7 0 3-1 5-2 6l-5 5-5-5c-1-1-2-3-2-6 0-5 4-7 7-7z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="9" r="2" strokeLinecap="round" />
    <path d="M7 20l2-5M17 20l-2-5" strokeLinecap="round" />
  </svg>
)

export const LeafIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 3c4 0 8 4 8 9 0 4-4 8-8 8s-8-4-8-8c0-5 4-9 8-9z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8v12M8 12l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SparkleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2l8 4v6c0 4-3 7-8 10-5-3-8-6-8-10V6l8-4z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const LockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="5" y="11" width="14" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
)

export const HeartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 21c-1-1-9-6-9-12 0-3 2-5 5-5 2 0 3 1 4 2 1-1 2-2 4-2 3 0 5 2 5 5 0 6-8 11-9 12z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)