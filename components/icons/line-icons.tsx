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

export const KeyboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h.01M14 14h.01M18 14h.01" strokeLinecap="round" strokeLinejoin="round" />
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