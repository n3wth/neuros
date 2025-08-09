'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconSparkles, IconMenu2, IconX } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'Research', href: '/research' },
  { name: 'Enterprise', href: '/enterprise' },
  { name: 'Pricing', href: '/pricing' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

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
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <IconSparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold">Neuros</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/signin"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}