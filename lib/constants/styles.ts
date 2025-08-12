// Reusable style constants for dashboard components
export const dashboardStyles = {
  // Layout
  page: "min-h-screen bg-background", // Clean solid background
  section: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  
  // Cards
  card: {
    base: "bg-white rounded-3xl border border-black/5",
    hover: "hover:shadow-lg hover:shadow-black/5 transition-all duration-300",
    interactive: "hover:-translate-y-0.5 cursor-pointer group"
  },
  
  // Buttons
  button: {
    primary: "bg-black text-white hover:bg-black/90 rounded-full font-light shadow-sm hover:shadow-md transition-all duration-300",
    secondary: "border-black/20 text-black hover:bg-black/5 rounded-full font-light transition-all duration-300",
    nav: (active: boolean) => `px-4 py-2 text-sm font-light rounded-full transition-all duration-300 ${
      active ? 'bg-black text-white' : 'text-black/60 hover:text-black hover:bg-black/3'
    }`
  },
  
  // Typography
  text: {
    heading: "font-serif font-light text-black/90",
    body: "font-light text-black/60",
    caption: "text-xs text-black/50 font-mono"
  },
  
  // Animations
  animation: {
    fadeIn: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    slideIn: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } }
  }
} as const