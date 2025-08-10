'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { forgotPassword } from '@/server/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
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
      {pending ? 'Sending reset link...' : 'Send reset link'}
    </button>
  )
}

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: FormData) {
    const result = await forgotPassword(data)
    
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result?.success) {
      setEmailSent(true)
      toast({
        title: 'Reset link sent',
        description: `We've sent a password reset link to ${data.email}. Please check your email and follow the instructions.`,
      })
    }
  }

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h3 className="text-xl font-serif font-medium text-black/90">Check your email</h3>
          <p className="text-base text-black/60 leading-relaxed">
            We&apos;ve sent a password reset link to <strong className="text-black/80">{form.getValues('email')}</strong>.
            <br />
            Click the link in the email to reset your password.
          </p>
        </div>

        {/* Resend Button */}
        <button 
          onClick={() => {
            setEmailSent(false)
            form.reset()
          }}
          className="text-sm text-black/40 hover:text-black/60 transition-colors underline"
        >
          Didn&apos;t receive the email? Try again
        </button>

        {/* Email Tips */}
        <div className="pt-6 border-t border-black/10">
          <p className="text-sm text-black/40 leading-relaxed">
            <strong className="text-black/60">Note:</strong> The reset link will expire in 1 hour. 
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form action={() => form.handleSubmit(onSubmit)()} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black/80">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-white border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition-all placeholder:text-black/30"
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="text-blue-900 font-medium">How password reset works</p>
            <p className="text-blue-700 mt-1 leading-relaxed">
              Enter your account email and we&apos;ll send you a secure link to create a new password. 
              The link expires in 1 hour for your security.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton />
    </form>
  )
}