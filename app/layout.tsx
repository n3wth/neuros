import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { registerServiceWorker, setupInstallPrompt } from "./sw-register";
import "./globals.css";
import "./polish.css";
import "./mobile.css";

// Optimized font loading with 'optional' for instant rendering
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional', // Use optional for instant loading
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'optional', // Use optional for instant loading
  preload: false, // Only load when needed
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'optional', // Use optional for instant loading
  preload: true, // Preload since used on landing page
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFEFE" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  title: "Neuros - AI-Powered Learning Platform",
  description: "Master any subject with AI-powered spaced repetition and personalized learning paths",
  applicationName: "Neuros",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Neuros",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Neuros - AI-Powered Learning Platform",
    description: "Master any subject with AI-powered spaced repetition and personalized learning paths",
    url: "https://neuros.newth.ai",
    siteName: "Neuros",
    images: [
      {
        url: "https://neuros.newth.ai/cover.jpg",
        width: 1280,
        height: 640,
        alt: "Neuros - AI-Powered Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neuros - AI-Powered Learning Platform",
    description: "Master any subject with AI-powered spaced repetition and personalized learning paths",
    images: ["https://neuros.newth.ai/cover.jpg"],
    creator: "@olivernewth",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Register service worker for PWA functionality
  if (typeof window !== 'undefined') {
    registerServiceWorker()
    setupInstallPrompt()
  }

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased font-sans">
        <ErrorBoundary>
          {children}
          <Toaster />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  );
}
