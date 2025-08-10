'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSound, useNavigationSound } from '@/hooks/use-sound'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SoundEnhancedNavProps {
  items: Array<{
    name: string
    href: string
    position?: 'left' | 'center' | 'right'
  }>
  className?: string
}

export default function SoundEnhancedNav({ items, className }: SoundEnhancedNavProps) {
  const pathname = usePathname()
  const { playClick, playHover } = useSound()
  const { playNavigationSound } = useNavigationSound()

  const handleNavClick = (position: 'left' | 'center' | 'right' = 'center') => {
    playClick()
    playNavigationSound(position)
  }

  const handleNavHover = (position: 'left' | 'center' | 'right' = 'center') => {
    playHover()
    // Subtle spatial audio hint on hover
    playNavigationSound(position)
  }

  return (
    <nav className={cn("flex items-center gap-8", className)}>
      {items.map((item, index) => {
        const position = item.position || (
          index < items.length / 3 ? 'left' : 
          index > items.length * 2/3 ? 'right' : 
          'center'
        )
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onMouseEnter={() => handleNavHover(position)}
            onMouseDown={() => handleNavClick(position)}
            className="relative text-sm text-black/60 hover:text-black transition-colors group"
          >
            {item.name}
            {pathname === item.href && (
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                layoutId="navbar-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Example implementation with keyboard navigation sounds
 */
export function SoundEnhancedKeyboardNav({ items, className }: SoundEnhancedNavProps) {
  const pathname = usePathname()
  const { playClick, playHover } = useSound()
  const { playNavigationSound } = useNavigationSound()
  
  const handleKeyboardNavigation = (e: React.KeyboardEvent, position: 'left' | 'center' | 'right' = 'center') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      playClick()
      playNavigationSound(position)
    } else if (e.key === 'ArrowLeft') {
      playNavigationSound('left')
    } else if (e.key === 'ArrowRight') {
      playNavigationSound('right')
    } else if (e.key === 'ArrowUp') {
      playNavigationSound('up')
    } else if (e.key === 'ArrowDown') {
      playNavigationSound('down')
    }
  }

  return (
    <nav className={cn("flex items-center gap-8", className)} role="navigation">
      {items.map((item, index) => {
        const position = item.position || (
          index < items.length / 3 ? 'left' : 
          index > items.length * 2/3 ? 'right' : 
          'center'
        )
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onMouseEnter={() => handleNavHover(position)}
            onMouseDown={() => handleNavClick(position)}
            onKeyDown={(e) => handleKeyboardNavigation(e, position)}
            onFocus={() => playHover()}
            className="relative text-sm text-black/60 hover:text-black transition-colors group focus:outline-none focus:text-black"
            tabIndex={0}
            role="link"
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.name}
            {pathname === item.href && (
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                layoutId="navbar-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="absolute -bottom-1 left-0 right-0 h-px bg-black scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform origin-left" />
          </Link>
        )
      })}
    </nav>
  )
}