/**
 * 2025 Design System - Clean & Simple
 * One file to rule them all
 */

// Colors - warm, solid, no gradients
export const theme = {
  colors: {
    // Primary palette
    background: '#FEFEFE',
    surface: '#F5F1EB', 
    text: '#36454F',
    primary: '#4682B4',
    
    // Semantic colors
    success: '#355E3B',
    warning: '#FFB347', 
    error: '#B7410E',
    
    // Neutral grays (warm)
    gray: {
      light: '#8B8680',
      medium: '#A67C52',
      dark: '#36454F',
    }
  },
  
  // Simple border radius - no more rounded-full AI look
  radius: {
    sm: '4px',
    md: '6px', 
    lg: '8px',
  },
  
  // Natural transitions - no bouncy animations
  transition: '200ms ease-out',
  
  // Subtle shadows
  shadow: '0 1px 3px rgba(54, 69, 79, 0.1)',
};