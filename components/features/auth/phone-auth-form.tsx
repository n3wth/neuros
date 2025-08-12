'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { signInWithPhone, signUpWithPhone, verifyPhoneOtp } from '@/server/actions/auth'
import { SparkleIcon } from '@/components/icons/line-icons'

interface PhoneAuthFormProps {
  mode: 'signin' | 'signup'
  fullName?: string
}

export function PhoneAuthForm({ mode, fullName }: PhoneAuthFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
    if (!match) return value
    
    const parts = []
    if (match[1]) parts.push(match[1])
    if (match[2]) parts.push(match[2])
    if (match[3]) parts.push(match[3])
    
    if (parts.length === 0) return ''
    if (parts.length === 1) return `(${parts[0]}`
    if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`
    return `(${parts[0]}) ${parts[1]}-${parts[2]}`
  }

  // Clean phone number for submission
  const cleanPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned ? `+1${cleaned}` : ''
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  const startResendTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanedPhone = cleanPhoneNumber(phone)
    if (!cleanedPhone || cleanedPhone.length < 11) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      const result = mode === 'signup' 
        ? await signUpWithPhone({ phone: cleanedPhone, fullName })
        : await signInWithPhone({ phone: cleanedPhone })
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else if (result?.success) {
        toast({
          title: 'Code sent!',
          description: result.message || 'Check your phone for the verification code',
        })
        setShowOtpInput(true)
        startResendTimer()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter the 6-digit verification code',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      const cleanedPhone = cleanPhoneNumber(phone)
      const result = await verifyPhoneOtp({ phone: cleanedPhone, token: otp })
      
      if (result?.error) {
        toast({
          title: 'Verification failed',
          description: result.error,
          variant: 'destructive',
        })
      } else if (result?.success) {
        toast({
          title: 'Success!',
          description: mode === 'signup' ? 'Account created successfully' : 'Signed in successfully',
        })
        router.push('/dashboard')
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setIsLoading(true)
    
    try {
      const cleanedPhone = cleanPhoneNumber(phone)
      const result = mode === 'signup'
        ? await signUpWithPhone({ phone: cleanedPhone, fullName })
        : await signInWithPhone({ phone: cleanedPhone })
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else if (result?.success) {
        toast({
          title: 'Code resent!',
          description: 'Check your phone for the new verification code',
        })
        startResendTimer()
        setOtp('')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!showOtpInput) {
    return (
      <form onSubmit={handleSendOtp} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-black/80">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/60">
              +1
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full pl-12 pr-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all duration-200 placeholder:text-black/30"
              disabled={isLoading}
              autoComplete="tel"
            />
          </div>
          <p className="text-xs text-black/50">
            We&apos;ll send you a verification code via SMS
          </p>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <SparkleIcon className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Sending code...' : 'Continue with Phone'}
        </button>
      </form>
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium text-black/80">
          Verification Code
        </label>
        <p className="text-sm text-black/60">
          Enter the 6-digit code sent to {phone}
        </p>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            id="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={handleOtpChange}
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all duration-200 placeholder:text-black/30"
            disabled={isLoading}
            autoComplete="one-time-code"
            maxLength={6}
          />

          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading && <SparkleIcon className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setShowOtpInput(false)
            setOtp('')
          }}
          className="text-sm text-black/60 hover:text-black/80 transition-colors"
        >
          ← Change phone number
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendTimer > 0 || isLoading}
          className="text-sm text-black/60 hover:text-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}