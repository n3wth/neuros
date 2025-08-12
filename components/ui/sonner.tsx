"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#000000',
        },
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-black/10 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-black/70',
          actionButton: 'group-[.toast]:bg-black group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-black/5 group-[.toast]:text-black/60',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
