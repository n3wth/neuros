'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { motion, useScroll, useTransform } from 'framer-motion'

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Research', href: '/research' },
  { name: 'Enterprise', href: '/enterprise' },
  { name: 'Pricing', href: '/pricing' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()
  const { scrollY } = useScroll()
  
  // Transform values for scroll effects
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(250, 250, 249, 0)', 'rgba(250, 250, 249, 0.95)']
  )
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.05)']
  )

  useEffect(() => {
    // Check for logged in user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300"
      style={{
        backgroundColor: headerBg,
        borderBottom: useTransform(headerBorder, (value) => `1px solid ${value}`)
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            {/* Pure Typography Logo */}
            <Link href="/" className="group">
              <motion.span 
                className="text-[32px] font-serif font-light tracking-tight leading-none relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Neuros
                {/* Subtle underline on hover */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
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
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="group relative px-6 py-2.5 overflow-hidden"
              >
                <span className="relative z-10 text-sm font-medium">Dashboard</span>
                <div className="absolute inset-0 bg-black rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Dashboard
                </span>
                <div className="absolute inset-0 border border-black/20 rounded-full" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/signin"
                  className="text-sm text-black/60 hover:text-black transition-colors px-4 py-2"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup"
                  className="group relative px-6 py-2.5 bg-black text-white rounded-full overflow-hidden hover:bg-black/90 transition-colors"
                >
                  <span className="relative z-10 text-sm font-medium flex items-center gap-2">
                    Get started
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  )
}