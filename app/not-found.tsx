'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate eye movement based on mouse position
  const calculateEyePosition = (baseX: number, baseY: number) => {
    if (typeof window === 'undefined') {
      return { x: baseX, y: baseY }
    }
    const dx = (mousePos.x - window.innerWidth / 2) / window.innerWidth
    const dy = (mousePos.y - window.innerHeight / 2) / window.innerHeight
    return {
      x: baseX + dx * 3,
      y: baseY + dy * 3
    }
  }

  const leftEye = calculateEyePosition(-15, 0)
  const rightEye = calculateEyePosition(15, 0)

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 with cute face */}
        <motion.div 
          className="mb-12 relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* 404 Text with face */}
          <svg
            viewBox="0 0 200 120"
            className="w-full max-w-md mx-auto"
            style={{ maxHeight: '200px' }}
          >
            {/* 4 */}
            <text
              x="40"
              y="80"
              className="fill-black/10"
              style={{ fontSize: '80px', fontFamily: 'Playfair Display', fontWeight: 300 }}
            >
              4
            </text>
            
            {/* Face as the 0 */}
            <g transform="translate(100, 50)">
              {/* Face outline */}
              <circle
                cx="0"
                cy="0"
                r="35"
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="2"
              />
              
              {/* Eyes that follow mouse */}
              <g>
                {/* Left eye */}
                <circle
                  cx="-15"
                  cy="-5"
                  r="8"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.7)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={leftEye.x}
                  cy={-5 + leftEye.y}
                  r="3"
                  fill="rgba(0, 0, 0, 0.7)"
                />
                
                {/* Right eye */}
                <circle
                  cx="15"
                  cy="-5"
                  r="8"
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.7)"
                  strokeWidth="1.5"
                />
                <circle
                  cx={rightEye.x}
                  cy={-5 + rightEye.y}
                  r="3"
                  fill="rgba(0, 0, 0, 0.7)"
                />
              </g>
              
              {/* Confused mouth */}
              <path
                d="M -15,15 Q 0,10 15,20"
                fill="none"
                stroke="rgba(0, 0, 0, 0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
            
            {/* Second 4 */}
            <text
              x="145"
              y="80"
              className="fill-black/10"
              style={{ fontSize: '80px', fontFamily: 'Playfair Display', fontWeight: 300 }}
            >
              4
            </text>
          </svg>

          {/* Floating question marks */}
          <motion.div
            className="absolute -top-4 left-1/4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl text-black/20 font-light">?</span>
          </motion.div>
          
          <motion.div
            className="absolute -top-2 right-1/4"
            animate={{ 
              y: [0, -8, 0],
              rotate: [5, -5, 5]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <span className="text-xl text-black/15 font-light">?</span>
          </motion.div>
          
          <motion.div
            className="absolute top-8 right-1/3"
            animate={{ 
              y: [0, -6, 0],
              rotate: [-3, 3, -3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <span className="text-lg text-black/10 font-light">?</span>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-serif font-light mb-4 text-black/80">
            Oops, this page wandered off
          </h1>
          <p className="text-lg text-black/60 font-light mb-8 leading-relaxed">
            It seems the page you&apos;re looking for has gone on a little adventure.
            <br />
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link 
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full hover:bg-black/90 transition-all hover:gap-4"
          >
            <span className="text-lg">Back to home</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="/explore"
            className="inline-flex items-center gap-3 px-8 py-4 text-black/70 hover:text-black transition-colors"
          >
            <span className="text-lg">Explore topics</span>
          </Link>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-6 bg-white rounded-3xl border border-black/5"
        >
          <p className="text-sm text-black/40 font-mono tracking-wider uppercase mb-2">
            Did you know?
          </p>
          <p className="text-black/60 font-light">
            The 404 error code was named after a room at CERN where the original web servers were located.
            When a file couldn&apos;t be found, it was said to be &ldquo;not found in room 404.&rdquo;
          </p>
        </motion.div>
      </div>
    </div>
  )
}