/**
 * Centralized Component Style Utilities
 * Provides consistent styling functions for all components
 */

import { cn } from '@/lib/utils'

// Button style generator
export const buttonStyles = {
  base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  
  variant: (variant: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline' | 'ghost' | 'link' = 'primary') => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
      destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
      outline: 'border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground',
      ghost: 'hover:bg-accent/10 hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    }
    return variants[variant]
  },
  
  size: (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const sizes = {
      xs: 'h-7 px-2 text-xs rounded',
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-9 px-4 py-2 text-sm rounded-md',
      lg: 'h-10 px-6 text-base rounded-md',
      xl: 'h-12 px-8 text-lg rounded-lg',
    }
    return sizes[size]
  },
  
  rounded: (rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md') => {
    const roundedValues = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }
    return roundedValues[rounded]
  },
  
  create: (options: {
    variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline' | 'ghost' | 'link'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    className?: string
  } = {}) => {
    return cn(
      buttonStyles.base,
      buttonStyles.variant(options.variant || 'primary'),
      buttonStyles.size(options.size || 'md'),
      buttonStyles.rounded(options.rounded || 'md'),
      options.className
    )
  }
}

// Card style generator
export const cardStyles = {
  base: 'bg-card text-card-foreground border border-border shadow-sm',
  
  variant: (variant: 'default' | 'interactive' | 'elevated' | 'outlined' | 'glass' = 'default') => {
    const variants = {
      default: '',
      interactive: 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group',
      elevated: 'shadow-lg',
      outlined: 'border-2',
      glass: 'bg-white/80 backdrop-blur-sm border-white/20',
    }
    return variants[variant]
  },
  
  padding: (padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => {
    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    }
    return paddings[padding]
  },
  
  rounded: (rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg') => {
    const roundedValues = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    }
    return roundedValues[rounded]
  },
  
  create: (options: {
    variant?: 'default' | 'interactive' | 'elevated' | 'outlined' | 'glass'
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    className?: string
  } = {}) => {
    return cn(
      cardStyles.base,
      cardStyles.variant(options.variant || 'default'),
      cardStyles.padding(options.padding || 'md'),
      cardStyles.rounded(options.rounded || 'lg'),
      options.className
    )
  }
}

// Input style generator
export const inputStyles = {
  base: 'w-full px-3 py-2 text-sm bg-transparent border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  
  variant: (variant: 'default' | 'filled' | 'ghost' | 'underline' = 'default') => {
    const variants = {
      default: 'border-input bg-background',
      filled: 'border-transparent bg-secondary',
      ghost: 'border-transparent hover:bg-accent/10',
      underline: 'border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0',
    }
    return variants[variant]
  },
  
  size: (size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'h-8 text-xs',
      md: 'h-9 text-sm',
      lg: 'h-10 text-base',
    }
    return sizes[size]
  },
  
  rounded: (rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md') => {
    const roundedValues = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }
    return roundedValues[rounded]
  },
  
  create: (options: {
    variant?: 'default' | 'filled' | 'ghost' | 'underline'
    size?: 'sm' | 'md' | 'lg'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    className?: string
  } = {}) => {
    return cn(
      inputStyles.base,
      inputStyles.variant(options.variant || 'default'),
      inputStyles.size(options.size || 'md'),
      options.variant !== 'underline' ? inputStyles.rounded(options.rounded || 'md') : '',
      options.className
    )
  }
}

// Badge style generator
export const badgeStyles = {
  base: 'inline-flex items-center gap-1 font-medium transition-colors border',
  
  variant: (variant: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline' = 'default') => {
    const variants = {
      default: 'bg-primary/10 text-primary border-primary/20',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      error: 'bg-red-50 text-red-700 border-red-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      outline: 'border text-foreground',
    }
    return variants[variant]
  },
  
  size: (size: 'xs' | 'sm' | 'md' | 'lg' = 'sm') => {
    const sizes = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    }
    return sizes[size]
  },
  
  rounded: (rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' = 'md') => {
    const roundedValues = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }
    return roundedValues[rounded]
  },
  
  create: (options: {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    className?: string
  } = {}) => {
    return cn(
      badgeStyles.base,
      badgeStyles.variant(options.variant || 'default'),
      badgeStyles.size(options.size || 'sm'),
      badgeStyles.rounded(options.rounded || 'md'),
      options.className
    )
  }
}

// Typography style generator
export const textStyles = {
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6 = 1, className?: string) => {
    const headings = {
      1: 'text-4xl sm:text-5xl font-semibold tracking-tight',
      2: 'text-3xl sm:text-4xl font-semibold tracking-tight',
      3: 'text-2xl sm:text-3xl font-semibold tracking-tight',
      4: 'text-xl sm:text-2xl font-semibold tracking-tight',
      5: 'text-lg sm:text-xl font-semibold tracking-tight',
      6: 'text-base sm:text-lg font-semibold tracking-tight',
    }
    return cn(headings[level], className)
  },
  
  body: (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' = 'base', className?: string) => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    }
    return cn(sizes[size], 'text-foreground/80', className)
  },
  
  muted: (className?: string) => cn('text-muted-foreground', className),
  
  label: (className?: string) => cn('text-sm font-medium', className),
  
  caption: (className?: string) => cn('text-xs text-muted-foreground', className),
  
  code: (className?: string) => cn('font-mono text-sm bg-muted px-1 py-0.5 rounded', className),
}

// Layout style utilities
export const layoutStyles = {
  container: (size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg', className?: string) => {
    const sizes = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    }
    return cn('mx-auto px-4 sm:px-6 lg:px-8', sizes[size], className)
  },
  
  section: (spacing: 'sm' | 'md' | 'lg' | 'xl' = 'lg', className?: string) => {
    const spacings = {
      sm: 'py-8 sm:py-12',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-24',
    }
    return cn(spacings[spacing], className)
  },
  
  grid: (cols: 1 | 2 | 3 | 4 | 5 | 6 = 3, gap: 'sm' | 'md' | 'lg' = 'md', className?: string) => {
    const columns = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    }
    const gaps = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    }
    return cn('grid', columns[cols], gaps[gap], className)
  },
  
  stack: (spacing: 'xs' | 'sm' | 'md' | 'lg' = 'md', className?: string) => {
    const spacings = {
      xs: 'space-y-2',
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
    }
    return cn('flex flex-col', spacings[spacing], className)
  },
  
  row: (spacing: 'xs' | 'sm' | 'md' | 'lg' = 'md', align: 'start' | 'center' | 'end' | 'between' | 'around' = 'start', className?: string) => {
    const spacings = {
      xs: 'space-x-2',
      sm: 'space-x-4',
      md: 'space-x-6',
      lg: 'space-x-8',
    }
    const alignments = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    }
    return cn('flex flex-row items-center', spacings[spacing], alignments[align], className)
  },
}

// Animation style utilities
export const animationStyles = {
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  slideUp: 'animate-in slide-in-from-bottom duration-300',
  slideDown: 'animate-in slide-in-from-top duration-300',
  slideLeft: 'animate-in slide-in-from-right duration-300',
  slideRight: 'animate-in slide-in-from-left duration-300',
  zoom: 'animate-in zoom-in-95 duration-300',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
}

// Focus style utilities
export const focusStyles = {
  ring: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  within: 'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
}

// State style utilities
export const stateStyles = {
  hover: (className: string) => `hover:${className}`,
  active: (className: string) => `active:${className}`,
  disabled: 'disabled:pointer-events-none disabled:opacity-50',
  loading: 'animate-pulse pointer-events-none opacity-70',
  error: 'border-destructive focus:ring-destructive',
  success: 'border-green-500 focus:ring-green-500',
}

// Export all utilities as a single object
export const componentStyles = {
  button: buttonStyles,
  card: cardStyles,
  input: inputStyles,
  badge: badgeStyles,
  text: textStyles,
  layout: layoutStyles,
  animation: animationStyles,
  focus: focusStyles,
  state: stateStyles,
} as const