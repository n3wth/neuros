'use client'

import { useMemo } from 'react'

interface PlaceholderAvatarProps {
  name: string
  size?: number
  className?: string
}

// Generate consistent face based on name
function generateFaceFromName(name: string) {
  // Use name as seed for consistency
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Ensure hash is positive
  hash = Math.abs(hash)
  
  const random = (min: number, max: number) => {
    hash = Math.abs((hash * 16807) % 2147483647)
    return min + (Math.abs(hash) % (max - min + 1))
  }
  
  // Face parameters
  const skinTone = ['#FDBCB4', '#F5DEB3', '#FFE4C4', '#F0E68C', '#D2B48C'][random(0, 4)]
  const eyeStyle = random(0, 2) // 0: dots, 1: lines, 2: circles
  const mouthStyle = random(0, 2) // 0: smile, 1: neutral, 2: small
  const hasGlasses = random(0, 10) > 7 // 30% chance
  const hairStyle = random(0, 3) // Different hair styles
  const hairColor = ['#2C1810', '#5A4A42', '#8B7355', '#D2691E', '#4A4A4A'][random(0, 4)]
  
  return {
    skinTone,
    eyeStyle,
    mouthStyle,
    hasGlasses,
    hairStyle,
    hairColor,
    eyeOffset: random(-1, 1),
    mouthOffset: random(-1, 1),
  }
}

export default function PlaceholderAvatar({ name, size = 48, className = '' }: PlaceholderAvatarProps) {
  const face = useMemo(() => generateFaceFromName(name), [name])
  
  return (
    <div 
      className={`rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full"
      >
        {/* Face background */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill={face.skinTone}
        />
        
        {/* Hair */}
        {face.hairStyle === 0 && (
          // Short hair
          <path
            d="M 20 40 Q 50 20, 80 40 L 75 35 Q 50 15, 25 35 Z"
            fill={face.hairColor}
          />
        )}
        {face.hairStyle === 1 && (
          // Medium hair
          <ellipse
            cx="50"
            cy="35"
            rx="38"
            ry="25"
            fill={face.hairColor}
          />
        )}
        {face.hairStyle === 2 && (
          // Curly hair
          <>
            <circle cx="30" cy="30" r="12" fill={face.hairColor} />
            <circle cx="50" cy="25" r="12" fill={face.hairColor} />
            <circle cx="70" cy="30" r="12" fill={face.hairColor} />
            <circle cx="25" cy="45" r="10" fill={face.hairColor} />
            <circle cx="75" cy="45" r="10" fill={face.hairColor} />
          </>
        )}
        {face.hairStyle === 3 && (
          // Bald/very short
          <ellipse
            cx="50"
            cy="32"
            rx="32"
            ry="18"
            fill={face.hairColor}
            opacity="0.3"
          />
        )}
        
        {/* Eyes */}
        {face.eyeStyle === 0 && (
          // Dot eyes
          <>
            <circle cx={35 + face.eyeOffset} cy="45" r="2" fill="#333" />
            <circle cx={65 - face.eyeOffset} cy="45" r="2" fill="#333" />
          </>
        )}
        {face.eyeStyle === 1 && (
          // Line eyes
          <>
            <path d={`M ${30 + face.eyeOffset} 45 L ${40 + face.eyeOffset} 45`} stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <path d={`M ${60 - face.eyeOffset} 45 L ${70 - face.eyeOffset} 45`} stroke="#333" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {face.eyeStyle === 2 && (
          // Circle eyes
          <>
            <circle cx={35 + face.eyeOffset} cy="45" r="4" fill="white" stroke="#333" strokeWidth="1.5" />
            <circle cx={35 + face.eyeOffset} cy="45" r="2" fill="#333" />
            <circle cx={65 - face.eyeOffset} cy="45" r="4" fill="white" stroke="#333" strokeWidth="1.5" />
            <circle cx={65 - face.eyeOffset} cy="45" r="2" fill="#333" />
          </>
        )}
        
        {/* Glasses */}
        {face.hasGlasses && (
          <>
            <circle cx="35" cy="45" r="12" fill="none" stroke="#444" strokeWidth="2" />
            <circle cx="65" cy="45" r="12" fill="none" stroke="#444" strokeWidth="2" />
            <path d="M 47 45 L 53 45" stroke="#444" strokeWidth="2" />
            <path d="M 23 45 L 15 43" stroke="#444" strokeWidth="2" />
            <path d="M 77 45 L 85 43" stroke="#444" strokeWidth="2" />
          </>
        )}
        
        {/* Nose */}
        <path
          d="M 50 50 L 48 55 L 52 55"
          fill="none"
          stroke={face.skinTone}
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="brightness(0.9)"
        />
        
        {/* Mouth */}
        {face.mouthStyle === 0 && (
          // Smile
          <path
            d={`M ${40 + face.mouthOffset} 65 Q 50 ${72 + face.mouthOffset}, ${60 - face.mouthOffset} 65`}
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
        {face.mouthStyle === 1 && (
          // Neutral
          <path
            d={`M ${42 + face.mouthOffset} 67 L ${58 - face.mouthOffset} 67`}
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
        {face.mouthStyle === 2 && (
          // Small smile
          <path
            d={`M ${45 + face.mouthOffset} 66 Q 50 ${69 + face.mouthOffset}, ${55 - face.mouthOffset} 66`}
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  )
}