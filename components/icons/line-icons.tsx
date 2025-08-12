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
    <path d="M12 2 Q11.8 8.5 10.5 10.5 Q8.5 11.8 2 12 Q8.5 12.2 10.5 13.5 Q11.8 15.5 12 22 Q12.2 15.5 13.5 13.5 Q15.5 12.2 22 12 Q15.5 11.8 13.5 10.5 Q12.2 8.5 12 2" strokeLinecap="round" strokeLinejoin="round" />
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

export const TrendingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const TargetIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16v-4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="0.5" fill="currentColor" />
  </svg>
)

export const AwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.2 14l1.8 5 2-1 2 1 1.8-5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M18 6l-12 12M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const LoaderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const WandIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M15 4l4 4-11 11-4-4L15 4z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 9.5l1 1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 3l2 2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 21l2-2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 19l2-2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const DocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 4C6 4 1 12 1 12s5 8 11 8 11-8 11-8-5-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const EyeOffIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M6.5 6.5l11 11M2 2l20 20" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.71 6.71C4.72 8.1 3.15 10.13 2 12c1.63 2.19 4.66 6 10 6 1.65 0 3.17-.4 4.47-1.05" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const VolumeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


export const RefreshIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 16H3v5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const LightbulbIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 3 2 5 2 5h8s2-2 2-5a6 6 0 0 0-6-6z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 19h6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ZapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ImageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="9" r="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 15l-3.5-3.5c-.8-.8-2-.8-2.8 0L9 17" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)


export const SaveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 21v-8H7v8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 3v5h8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const GridIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <polygon points="5,3 19,12 5,21" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const LogOutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="16,17 21,12 16,7" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MusicIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export const WaveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const VibrateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="9" y="4" width="6" height="16" rx="1" ry="1" />
    <path d="M5 12h1M18 12h1M6 8l-1-1M19 8l-1-1M6 16l-1 1M19 16l-1 1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const HeadphonesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

export const KeyboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const TrophyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M8 2h8v11a4 4 0 0 1-8 0V2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17v4M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MessageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

export const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

export const XIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)