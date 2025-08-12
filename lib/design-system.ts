/**
 * Centralized Design System Configuration
 * This file defines all visual constants to ensure consistency across the application
 */

// Color Palette (matches CSS variables in globals.css)
export const colors = {
  // Base colors - warm, solid colors (no gradients)
  background: '#FEFEFE',
  foreground: '#36454F',
  
  // Brand colors
  primary: {
    DEFAULT: '#4682B4', // Ocean blue
    foreground: '#FEFEFE',
    hover: 'rgba(70, 130, 180, 0.9)',
  },
  
  secondary: {
    DEFAULT: '#F5F1EB', // Warm beige
    foreground: '#36454F',
    hover: 'rgba(245, 241, 235, 0.8)',
  },
  
  accent: {
    DEFAULT: '#A67C52', // Mocha
    foreground: '#FEFEFE',
    hover: 'rgba(166, 124, 82, 0.9)',
  },
  
  muted: {
    DEFAULT: '#F5F1EB',
    foreground: '#8B8680', // Warm gray
  },
  
  destructive: {
    DEFAULT: '#B7410E', // Rust orange
    foreground: '#FEFEFE',
    hover: 'rgba(183, 65, 14, 0.9)',
  },
  
  // UI colors
  border: '#F5F1EB',
  input: '#F5F1EB',
  ring: '#4682B4',
  
  // Semantic colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#B7410E',
  info: '#4682B4',
  
  // Neutral scale
  neutral: {
    50: '#FEFEFE',
    100: '#F5F1EB',
    200: '#E5E1DB',
    300: '#C5C1BB',
    400: '#8B8680',
    500: '#6B6660',
    600: '#4B4640',
    700: '#36454F',
    800: '#2B2620',
    900: '#1B1610',
  }
} as const

// Typography System
export const typography = {
  fonts: {
    sans: 'JetBrains Mono, system-ui, -apple-system, sans-serif',
    serif: 'Playfair Display, Georgia, serif',
    mono: 'JetBrains Mono, monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  }
} as const

// Spacing System (8px base)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
} as const

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.375rem', // 6px (reduced from default)
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',
} as const

// Shadows (soft and subtle)
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

// Transitions
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  timing: {
    linear: 'linear',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
} as const

// Breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Component Style Presets
export const components = {
  // Button variants
  button: {
    base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50',
    
    variants: {
      primary: `bg-[${colors.primary.DEFAULT}] text-[${colors.primary.foreground}] hover:bg-[${colors.primary.hover}] shadow-sm`,
      secondary: `bg-[${colors.secondary.DEFAULT}] text-[${colors.secondary.foreground}] hover:bg-[${colors.secondary.hover}] shadow-xs`,
      accent: `bg-[${colors.accent.DEFAULT}] text-[${colors.accent.foreground}] hover:bg-[${colors.accent.hover}] shadow-sm`,
      destructive: `bg-[${colors.destructive.DEFAULT}] text-[${colors.destructive.foreground}] hover:bg-[${colors.destructive.hover}] shadow-sm`,
      outline: 'border bg-transparent hover:bg-accent/10',
      ghost: 'hover:bg-accent/10',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    
    sizes: {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-9 px-4 py-2 text-sm rounded-md',
      lg: 'h-10 px-6 text-base rounded-md',
      xl: 'h-12 px-8 text-lg rounded-lg',
    },
    
    rounded: {
      none: 'rounded-none',
      sm: `rounded-[${borderRadius.sm}]`,
      md: `rounded-[${borderRadius.md}]`,
      lg: `rounded-[${borderRadius.lg}]`,
      full: 'rounded-full',
    }
  },
  
  // Card styles
  card: {
    base: 'bg-white border border-black/5 shadow-sm',
    
    variants: {
      default: '',
      interactive: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
      elevated: 'shadow-lg',
      outlined: 'border-black/10',
    },
    
    rounded: {
      none: 'rounded-none',
      sm: `rounded-[${borderRadius.md}]`,
      md: `rounded-[${borderRadius.lg}]`,
      lg: `rounded-[${borderRadius.xl}]`,
      xl: `rounded-[${borderRadius['2xl']}]`,
    }
  },
  
  // Input styles
  input: {
    base: 'w-full px-3 py-2 text-sm bg-transparent border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    
    variants: {
      default: 'border-input bg-white',
      filled: 'border-transparent bg-secondary',
      ghost: 'border-transparent hover:bg-accent/10',
    },
    
    sizes: {
      sm: 'h-8 text-sm',
      md: 'h-9',
      lg: 'h-10 text-base',
    }
  },
  
  // Badge styles
  badge: {
    base: 'inline-flex items-center gap-1 font-medium transition-colors',
    
    variants: {
      default: 'bg-primary/10 text-primary border-primary/20',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      outline: 'border text-foreground',
    },
    
    sizes: {
      sm: 'px-2 py-0.5 text-xs rounded',
      md: 'px-2.5 py-0.5 text-sm rounded-md',
      lg: 'px-3 py-1 text-base rounded-lg',
    }
  }
} as const

// Animation presets
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
  }
} as const

// Utility functions for consistent styling
export const utils = {
  // Generate consistent hover states
  hover: (base: string, hover: string) => `${base} hover:${hover} transition-colors duration-200`,
  
  // Generate focus states
  focus: (ring = colors.ring) => `focus:outline-none focus:ring-2 focus:ring-${ring} focus:ring-offset-2`,
  
  // Generate disabled states
  disabled: () => 'disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Combine classes conditionally
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ')
  }
} as const

// Export everything as a single design system object
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  components,
  animations,
  utils,
} as const

// Type exports for TypeScript
export type Colors = typeof colors
export type Typography = typeof typography
export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type Shadows = typeof shadows
export type Transitions = typeof transitions
export type ZIndex = typeof zIndex
export type Breakpoints = typeof breakpoints
export type Components = typeof components
export type Animations = typeof animations