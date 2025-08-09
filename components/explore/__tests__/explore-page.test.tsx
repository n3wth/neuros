import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ExplorePage from '../explore-page'
import { describe, it, expect, vi } from 'vitest'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('ExplorePage Search Functionality', () => {
  it('renders all categories by default', () => {
    render(<ExplorePage />)
    
    // Check that all main categories are visible
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
    expect(screen.getByText('Business & Finance')).toBeInTheDocument()
    expect(screen.getByText('Design & Creative')).toBeInTheDocument()
    expect(screen.getByText('Languages')).toBeInTheDocument()
  })

  it('filters categories when searching', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for "AI"
    await user.type(searchInput, 'AI')
    
    // Should show AI & Machine Learning category
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument()
    
    // Should not show unrelated categories
    expect(screen.queryByText('Languages')).not.toBeInTheDocument()
    expect(screen.queryByText('Business & Finance')).not.toBeInTheDocument()
  })

  it('filters trending paths when searching', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for "Next.js"
    await user.type(searchInput, 'Next.js')
    
    // Should show the Next.js path
    expect(screen.getByText('Full-Stack with Next.js 15')).toBeInTheDocument()
    
    // Should not show unrelated paths
    expect(screen.queryByText('Quantum Computing Fundamentals')).not.toBeInTheDocument()
  })

  it('shows no results message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for something that doesn't exist
    await user.type(searchInput, 'xyz123notfound')
    
    // Should show no results messages
    expect(screen.getByText('No categories found matching "xyz123notfound"')).toBeInTheDocument()
    expect(screen.getByText('No learning paths found matching "xyz123notfound"')).toBeInTheDocument()
    
    // Should show clear search buttons
    const clearButtons = screen.getAllByText('Clear search')
    expect(clearButtons).toHaveLength(2)
  })

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for something that doesn't exist
    await user.type(searchInput, 'xyz123notfound')
    
    // Click the first clear search button
    const clearButton = screen.getAllByText('Clear search')[0]
    await user.click(clearButton)
    
    // Search should be cleared
    expect(searchInput).toHaveValue('')
    
    // All categories should be visible again
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument()
    expect(screen.getByText('Programming')).toBeInTheDocument()
  })

  it('searches on Enter key press', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Type and press Enter
    await user.type(searchInput, 'AI{Enter}')
    
    // Should filter results
    expect(screen.getByText('AI & Machine Learning')).toBeInTheDocument()
    expect(screen.queryByText('Languages')).not.toBeInTheDocument()
  })

  it('searches on button click', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    const searchButton = screen.getByRole('button', { name: /search/i })
    
    // Type and click search
    await user.type(searchInput, 'programming')
    await user.click(searchButton)
    
    // Should filter results
    expect(screen.getByText('Programming')).toBeInTheDocument()
  })

  it('displays result count when searching', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for "learning"
    await user.type(searchInput, 'learning')
    
    // Should show count for categories
    expect(screen.getByText(/Found \d+ categor/)).toBeInTheDocument()
    
    // Should show count for paths
    expect(screen.getByText(/Showing \d+ path/)).toBeInTheDocument()
  })

  it('searches through topic tags', async () => {
    const user = userEvent.setup()
    render(<ExplorePage />)
    
    const searchInput = screen.getByPlaceholderText('Search for topics, skills, or courses...')
    
    // Search for a topic tag
    await user.type(searchInput, 'TypeScript')
    
    // Should show Programming category which has TypeScript as a topic
    expect(screen.getByText('Programming')).toBeInTheDocument()
    
    // Should not show unrelated categories
    expect(screen.queryByText('Languages')).not.toBeInTheDocument()
  })
})