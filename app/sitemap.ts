import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'
  
  // Helper function to walk directory recursively
  const walkDir = (dir: string, pattern: RegExp): string[] => {
    const files: string[] = []
    
    const walk = (currentDir: string) => {
      const items = fs.readdirSync(currentDir)
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item)
        const relativePath = path.relative(dir, fullPath)
        
        // Skip node_modules and api directories
        if (relativePath.includes('node_modules') || relativePath.includes('api')) continue
        
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          walk(fullPath)
        } else if (pattern.test(item)) {
          files.push(relativePath)
        }
      }
    }
    
    if (fs.existsSync(dir)) {
      walk(dir)
    }
    
    return files
  }
  
  // Discover all page.tsx files in the app directory
  const appDir = path.join(process.cwd(), 'app')
  const pageFiles = walkDir(appDir, /^page\.(js|jsx|ts|tsx)$/)
  
  // Convert file paths to URL paths
  const routes = pageFiles.map(file => {
    const route = path.dirname(file)
      .replace(/\(.*?\)/g, '') // Remove route groups
      .replace(/\\/g, '/')     // Windows path support
    
    const urlPath = route === '.' ? '' : `/${route}`
    
    // Skip dynamic routes for sitemap
    if (urlPath.includes('[')) return null
    
    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(),
      changeFrequency: getChangeFrequency(urlPath),
      priority: getPriority(urlPath),
    }
  }).filter(Boolean) as MetadataRoute.Sitemap
  
  // Add static routes that might not have page files
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]
  
  // Merge and deduplicate
  const allRoutes = [...staticRoutes]
  routes.forEach(route => {
    if (!allRoutes.some(r => r.url === route.url)) {
      allRoutes.push(route)
    }
  })
  
  return allRoutes
}

function getChangeFrequency(path: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  if (path === '' || path === '/') return 'daily'
  if (path.includes('dashboard') || path.includes('learn')) return 'hourly'
  if (path.includes('auth') || path.includes('signin')) return 'weekly'
  if (path.includes('privacy') || path.includes('terms')) return 'monthly'
  return 'weekly'
}

function getPriority(path: string): number {
  if (path === '' || path === '/') return 1.0
  if (path.includes('dashboard') || path.includes('learn')) return 0.9
  if (path.includes('signin') || path.includes('signup')) return 0.8
  if (path.includes('explore') || path.includes('pricing')) return 0.7
  if (path.includes('privacy') || path.includes('terms')) return 0.3
  return 0.5
}