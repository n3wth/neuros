'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { resetPassword } from '@/server/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

const formSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button 
      type="submit" 
      className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors disabled:opacity-50" 
      disabled={pending}
    >
      {pending ? 'Updating password...' : 'Update password'}
    </button>
  )
}

export function ResetPasswordForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: FormData) {
    const result = await resetPassword(data)
    
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result?.success) {
      toast({
        title: 'Success',
        description: 'Your password has been updated successfully. You can now sign in.',
      })
      router.push('/signin')
      router.refresh()
    }
  }

  const password = form.watch('password')

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, label: 'At least 8 characters' },
      { regex: /[a-z]/, label: 'Lowercase letter' },
      { regex: /[A-Z]/, label: 'Uppercase letter' },
      { regex: /[0-9]/, label: 'Number' },
      { regex: /[^A-Za-z0-9]/, label: 'Special character' },
    ]

    const met = requirements.filter(req => req.regex.test(password))
    return { met, strength: met.length, total: requirements.length, requirements }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <form action={() => form.handleSubmit(onSubmit)()} className="space-y-6">
      {/* New Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-black/80">
          New password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-3 pr-12 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
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

        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength.strength < 2 ? 'bg-red-500 w-1/4' :
                    passwordStrength.strength < 3 ? 'bg-yellow-500 w-1/2' :
                    passwordStrength.strength < 4 ? 'bg-blue-500 w-3/4' :
                    'bg-green-500 w-full'
                  }`}
                />
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength.strength < 2 ? 'text-red-600' :
                passwordStrength.strength < 3 ? 'text-yellow-600' :
                passwordStrength.strength < 4 ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {passwordStrength.strength < 2 ? 'Weak' :
                 passwordStrength.strength < 3 ? 'Fair' :
                 passwordStrength.strength < 4 ? 'Good' :
                 'Strong'}
              </span>
            </div>
            <div className="text-xs text-black/50">
              <span className="block mb-1">Password requirements:</span>
              <ul className="space-y-1">
                {passwordStrength.requirements.map((req, index) => {
                  const isMet = req.regex.test(password)
                  return (
                    <li key={index} className={`flex items-center gap-2 ${isMet ? 'text-green-600' : 'text-black/40'}`}>
                      <span className={`text-xs ${isMet ? '✓' : '○'}`}>{isMet ? '✓' : '○'}</span>
                      {req.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-black/80">
          Confirm password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-3 pr-12 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
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

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-sm">
            <p className="text-blue-900 font-medium">Password saved securely</p>
            <p className="text-blue-700 mt-1">
              Your password is encrypted and stored securely. After updating, you&apos;ll be redirected to sign in.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton />
    </form>
  )
}