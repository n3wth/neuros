import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import CreateCardDialog from '../create-card-dialog'

// Mock server actions
vi.mock('@/server/actions/cards', () => ({
  createCard: vi.fn(() => Promise.resolve({ id: '1', front: 'Test', back: 'Answer' }))
}))

vi.mock('@/server/actions/ai', () => ({
  generateCardsFromText: vi.fn(() => Promise.resolve({
    cards: [
      { id: '1', front: 'Q1', back: 'A1' },
      { id: '2', front: 'Q2', back: 'A2' },
    ]
  }))
}))

describe('CreateCardDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onCardCreated: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Manual Card Creation', () => {
    it('renders the dialog when open', () => {
      render(<CreateCardDialog {...defaultProps} />)
      expect(screen.getByText('Create Learning Card')).toBeInTheDocument()
    })

    it('allows switching between manual and AI modes', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      const aiButton = screen.getByText('AI Generate')
      await user.click(aiButton)
      
      expect(screen.getByText('Generate 5 Cards with AI')).toBeInTheDocument()
    })

    it('creates a card with manual input', async () => {
      const user = userEvent.setup()
      const { createCard } = await import('@/server/actions/cards')
      
      render(<CreateCardDialog {...defaultProps} />)
      
      // Fill in the form
      const frontInput = screen.getByPlaceholderText(/What is the question/)
      const backInput = screen.getByPlaceholderText(/What is the answer/)
      
      await user.type(frontInput, 'What is React?')
      await user.type(backInput, 'A JavaScript library for building UIs')
      
      // Submit
      const createButton = screen.getByRole('button', { name: /Create Card/i })
      await user.click(createButton)
      
      await waitFor(() => {
        expect(createCard).toHaveBeenCalledWith({
          front: 'What is React?',
          back: 'A JavaScript library for building UIs',
          explanation: '',
          difficulty: 'intermediate'
        })
      })
      
      expect(defaultProps.onCardCreated).toHaveBeenCalled()
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('allows setting difficulty level', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      const advancedButton = screen.getByRole('button', { name: /advanced/i })
      await user.click(advancedButton)
      
      // Check that advanced is selected
      expect(advancedButton).toHaveClass('bg-blue-50', 'border-blue-300')
    })

    it('disables create button when fields are empty', () => {
      render(<CreateCardDialog {...defaultProps} />)
      
      const createButton = screen.getByRole('button', { name: /Create Card/i })
      expect(createButton).toBeDisabled()
    })
  })

  describe('AI Card Generation', () => {
    it('generates cards from AI input', async () => {
      const user = userEvent.setup()
      const { generateCardsFromText } = await import('@/server/actions/ai')
      
      render(<CreateCardDialog {...defaultProps} />)
      
      // Switch to AI mode
      const aiModeButton = screen.getByText('AI Generate')
      await user.click(aiModeButton)
      
      // Enter text
      const aiInput = screen.getByPlaceholderText(/Example: 'React hooks explained'/)
      await user.type(aiInput, 'Explain JavaScript closures')
      
      // Generate
      const generateButton = screen.getByRole('button', { name: /Generate 5 Cards with AI/i })
      await user.click(generateButton)
      
      await waitFor(() => {
        expect(generateCardsFromText).toHaveBeenCalledWith(
          'Explain JavaScript closures',
          {
            difficulty: 'intermediate',
            count: 5
          }
        )
      })
      
      // Check that generated cards are displayed
      expect(screen.getByText('Generated Cards (2)')).toBeInTheDocument()
      expect(screen.getByText('Q1')).toBeInTheDocument()
      expect(screen.getByText('A1')).toBeInTheDocument()
    })

    it('disables generate button when input is empty', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      // Switch to AI mode
      const aiModeButton = screen.getByText('AI Generate')
      await user.click(aiModeButton)
      
      const generateButton = screen.getByRole('button', { name: /Generate 5 Cards with AI/i })
      expect(generateButton).toBeDisabled()
    })
  })

  describe('Dialog Interaction', () => {
    it('closes when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: '' })
      await user.click(closeButton)
      
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('closes when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(<CreateCardDialog {...defaultProps} />)
      
      const backdrop = container.querySelector('.bg-black\\/50')
      if (backdrop) {
        await user.click(backdrop)
      }
      
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })
})