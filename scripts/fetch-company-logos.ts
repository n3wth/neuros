#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
import fetch from 'node-fetch'

const streamPipeline = promisify(pipeline)

// Company logo sources - using Clearbit's logo API as primary, with fallbacks
const LOGO_SOURCES = {
  clearbit: (domain: string) => `https://logo.clearbit.com/${domain}`,
  brandfetch: (domain: string) => `https://icon.horse/icon/${domain}`,
  favicon: (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
}

// Company data with domains for logo fetching
const COMPANIES = [
  { name: 'google', domain: 'google.com', displayName: 'Google' },
  { name: 'microsoft', domain: 'microsoft.com', displayName: 'Microsoft' },
  { name: 'meta', domain: 'meta.com', displayName: 'Meta' },
  { name: 'amazon', domain: 'amazon.com', displayName: 'Amazon' },
  { name: 'apple', domain: 'apple.com', displayName: 'Apple' },
  { name: 'openai', domain: 'openai.com', displayName: 'OpenAI' },
  { name: 'anthropic', domain: 'anthropic.com', displayName: 'Anthropic' },
  { name: 'stanford', domain: 'stanford.edu', displayName: 'Stanford' },
  { name: 'mit', domain: 'mit.edu', displayName: 'MIT' },
  { name: 'harvard', domain: 'harvard.edu', displayName: 'Harvard' },
  { name: 'berkeley', domain: 'berkeley.edu', displayName: 'Berkeley' },
  { name: 'oxford', domain: 'ox.ac.uk', displayName: 'Oxford' },
  { name: 'stripe', domain: 'stripe.com', displayName: 'Stripe' },
  { name: 'netflix', domain: 'netflix.com', displayName: 'Netflix' },
  { name: 'spotify', domain: 'spotify.com', displayName: 'Spotify' },
  { name: 'tesla', domain: 'tesla.com', displayName: 'Tesla' },
  { name: 'nvidia', domain: 'nvidia.com', displayName: 'NVIDIA' },
  { name: 'adobe', domain: 'adobe.com', displayName: 'Adobe' },
  { name: 'salesforce', domain: 'salesforce.com', displayName: 'Salesforce' },
  { name: 'oracle', domain: 'oracle.com', displayName: 'Oracle' }
]

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos')
const MANIFEST_PATH = path.join(LOGOS_DIR, 'manifest.json')

interface LogoManifest {
  companies: Array<{
    name: string
    displayName: string
    domain: string
    logoPath: string
    fetchedAt: string
    source: string
  }>
  lastUpdated: string
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    const response = await fetch(url)
    if (!response.ok) return false
    
    await streamPipeline(response.body, createWriteStream(filepath))
    return true
  } catch (error) {
    console.error(`Failed to download from ${url}:`, error)
    return false
  }
}

async function fetchCompanyLogo(company: typeof COMPANIES[0]): Promise<string | null> {
  const logoPath = path.join(LOGOS_DIR, `${company.name}.png`)
  
  // Check if logo already exists
  if (fs.existsSync(logoPath)) {
    console.log(`✓ Logo already exists for ${company.displayName}`)
    return `${company.name}.png`
  }

  console.log(`Fetching logo for ${company.displayName}...`)
  
  // Try each source in order
  for (const [sourceName, sourceFunc] of Object.entries(LOGO_SOURCES)) {
    const url = sourceFunc(company.domain)
    const tempPath = `${logoPath}.tmp`
    
    if (await downloadImage(url, tempPath)) {
      fs.renameSync(tempPath, logoPath)
      console.log(`✓ Downloaded ${company.displayName} logo from ${sourceName}`)
      return `${company.name}.png`
    }
  }
  
  console.error(`✗ Failed to fetch logo for ${company.displayName}`)
  return null
}

async function generateFallbackLogo(company: typeof COMPANIES[0]): Promise<void> {
  const logoPath = path.join(LOGOS_DIR, `${company.name}.svg`)
  
  // Generate a simple SVG with company initial
  const initial = company.displayName[0].toUpperCase()
  const colors = {
    'G': '#4285F4', // Google blue
    'M': '#00A4EF', // Microsoft blue
    'A': '#FF9900', // Amazon/Apple orange
    'O': '#FF0000', // OpenAI/Oracle red
    'N': '#76B900', // NVIDIA green
    'S': '#635BFF', // Stripe purple
    'T': '#E50914', // Tesla/Netflix red
  }
  
  const bgColor = colors[initial] || '#6B7280'
  
  const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="32" fill="${bgColor}"/>
  <text x="128" y="128" font-family="system-ui, -apple-system, sans-serif" 
        font-size="120" font-weight="600" fill="white" 
        text-anchor="middle" dominant-baseline="central">
    ${initial}
  </text>
</svg>`

  fs.writeFileSync(logoPath, svg)
  console.log(`✓ Generated fallback logo for ${company.displayName}`)
}

async function main() {
  // Create logos directory if it doesn't exist
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true })
  }

  const manifest: LogoManifest = {
    companies: [],
    lastUpdated: new Date().toISOString()
  }

  // Fetch or generate logos for each company
  for (const company of COMPANIES) {
    const logoFile = await fetchCompanyLogo(company)
    
    if (logoFile) {
      manifest.companies.push({
        name: company.name,
        displayName: company.displayName,
        domain: company.domain,
        logoPath: `/logos/${logoFile}`,
        fetchedAt: new Date().toISOString(),
        source: 'clearbit'
      })
    } else {
      // Generate fallback if download failed
      await generateFallbackLogo(company)
      manifest.companies.push({
        name: company.name,
        displayName: company.displayName,
        domain: company.domain,
        logoPath: `/logos/${company.name}.svg`,
        fetchedAt: new Date().toISOString(),
        source: 'generated'
      })
    }
  }

  // Write manifest file
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log('\n✓ Logo fetching complete!')
  console.log(`✓ Manifest written to ${MANIFEST_PATH}`)
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { COMPANIES, fetchCompanyLogo, generateFallbackLogo }