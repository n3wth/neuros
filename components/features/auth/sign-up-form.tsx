'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signUp } from '@/server/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { SparkleIcon } from '@/components/icons/line-icons'
import { OAuthButton } from './oauth-button'
import { PhoneAuthForm } from './phone-auth-form'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof formSchema>

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      type="submit" 
      className="w-full px-8 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
      disabled={pending}
    >
      {pending && (
        <SparkleIcon className="w-4 h-4 animate-spin" />
      )}
      {pending ? 'Creating your learning space...' : 'Create account'}
    </button>
  )
}

export function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [fullName, setFullName] = useState('')
  
  // Google OAuth is now enabled for everyone
  const showOAuth = true

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  async function onSubmit(data: FormData) {
    const result = await signUp({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    })
    
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result?.success) {
      toast({
        title: 'Success',
        description: 'Account created successfully! Please check your email to verify your account.',
      })
      router.push('/dashboard')
    }
  }

  return (
    <div className="space-y-5">
      {/* OAuth Buttons - Only show with ?test=google */}
      {showOAuth && (
        <>
          <div className="space-y-3">
            <OAuthButton provider="google" label="Sign up with Google" />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FAFAF9] lg:bg-white px-4 text-black/40 font-mono tracking-wider">or sign up with</span>
            </div>
          </div>
        </>
      )}

      {/* Auth Method Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
            authMethod === 'email'
              ? 'bg-black text-white'
              : 'bg-black/5 text-black/60 hover:bg-black/10'
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod('phone')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
            authMethod === 'phone'
              ? 'bg-black text-white'
              : 'bg-black/5 text-black/60 hover:bg-black/10'
          }`}
        >
          Phone
        </button>
      </div>

      {/* Full Name Field (for both methods) */}
      {authMethod === 'phone' && (
        <div className="space-y-2 mb-6">
          <label htmlFor="fullNamePhone" className="text-sm font-medium text-black/80">
            Full Name <span className="text-black/40">(optional)</span>
          </label>
          <input
            id="fullNamePhone"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
          />
        </div>
      )}

      {/* Phone Authentication Form */}
      {authMethod === 'phone' ? (
        <PhoneAuthForm mode="signup" fullName={fullName} />
      ) : (
      /* Email/Password Form */
      <form action={() => form.handleSubmit(onSubmit)()} className="space-y-5">
        {/* Full Name Field (optional) */}
        <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-black/80">
          Full Name <span className="text-black/40">(optional)</span>
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
          {...form.register('fullName')}
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black/80">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-black/80">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 bg-white border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
            {...form.register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-black/80">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 bg-white border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
            {...form.register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <SubmitButton />
      </form>
      )}
    </div>
  )
}