import Link from 'next/link'
import { SparkleIcon } from '@/components/icons/line-icons'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'framed' | 'minimal'
  href?: string
  className?: string
}

export function Logo({ 
  size = 'md', 
  variant = 'default',
  href = '/',
  className = '' 
}: LogoProps) {
  // Size configurations
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      gap: 'gap-2',
      padding: variant === 'framed' ? 'px-3 py-1.5' : ''
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-2xl',
      gap: 'gap-3',
      padding: variant === 'framed' ? 'px-4 py-2' : ''
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-3xl',
      gap: 'gap-3',
      padding: variant === 'framed' ? 'px-5 py-2.5' : ''
    }
  }

  const config = sizes[size]

  // Variant styles
  const variantStyles = {
    default: 'group',
    framed: `group bg-white/90 backdrop-blur-sm border border-black/10 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 ${config.padding}`,
    minimal: 'group opacity-80 hover:opacity-100 transition-opacity'
  }

  // Unified color scheme - using consistent black/gray tones
  const iconColor = 'text-black/70 group-hover:text-black'
  const textColor = 'text-black/90 group-hover:text-black'
  const strokeWidth = variant === 'minimal' ? 'stroke-[1.2]' : 'stroke-[1.5]'

  const LogoContent = () => (
    <div className={`inline-flex items-center ${config.gap} ${variantStyles[variant]} ${className}`}>
      <SparkleIcon 
        className={`${config.icon} ${iconColor} ${strokeWidth} transition-colors duration-200`} 
      />
      <span className={`${config.text} font-serif font-light ${textColor} transition-colors duration-200 leading-none`}>
        Neuros
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}

// Convenience components for common use cases
export function LogoFramed(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="framed" />
}

export function LogoMinimal(props: Omit<LogoProps, 'variant'>) {
  return <Logo {...props} variant="minimal" />
}