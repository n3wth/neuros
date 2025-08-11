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
    success: true,
    cards: Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      front: `Question ${i + 1}`,
      back: `Answer ${i + 1}`,
      explanation: `Explanation ${i + 1}`
    })),
    tokensUsed: 500
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

    it('defaults to AI mode and shows correct button text', () => {
      render(<CreateCardDialog {...defaultProps} />)
      
      // Should default to AI mode
      const aiButton = screen.getByText('AI Generate')
      expect(aiButton).toHaveClass('bg-gradient-to-r')
      
      // Should show 20 cards button text
      expect(screen.getByText('Generate 20 Cards with AI')).toBeInTheDocument()
    })

    it('allows switching to manual mode', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      const manualButton = screen.getByText('Manual Entry')
      await user.click(manualButton)
      
      expect(manualButton).toHaveClass('bg-black')
      expect(screen.getByPlaceholderText(/What is the question/)).toBeInTheDocument()
    })

    it('creates a card with manual input', async () => {
      const user = userEvent.setup()
      const { createCard } = await import('@/server/actions/cards')
      
      render(<CreateCardDialog {...defaultProps} />)
      
      // Switch to manual mode first
      const manualButton = screen.getByText('Manual Entry')
      await user.click(manualButton)
      
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

    it('disables create button when fields are empty in manual mode', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      // Switch to manual mode
      const manualButton = screen.getByText('Manual Entry')
      await user.click(manualButton)
      
      const createButton = screen.getByRole('button', { name: /Create Card/i })
      expect(createButton).toBeDisabled()
    })
  })

  describe('AI Card Generation', () => {
    it('starts in AI mode by default', () => {
      render(<CreateCardDialog {...defaultProps} />)
      
      // AI mode should be selected by default
      const aiInput = screen.getByPlaceholderText(/Example: 'React hooks explained'/)
      expect(aiInput).toBeInTheDocument()
    })

    it('generates 20 cards from AI input', async () => {
      const user = userEvent.setup()
      const { generateCardsFromText } = await import('@/server/actions/ai')
      
      render(<CreateCardDialog {...defaultProps} />)
      
      // Enter text (already in AI mode)
      const aiInput = screen.getByPlaceholderText(/Example: 'React hooks explained'/)
      await user.type(aiInput, 'Explain JavaScript closures')
      
      // Generate
      const generateButton = screen.getByRole('button', { name: /Generate 20 Cards with AI/i })
      await user.click(generateButton)
      
      await waitFor(() => {
        expect(generateCardsFromText).toHaveBeenCalledWith(
          'Explain JavaScript closures',
          {
            difficulty: 'intermediate',
            count: 20
          }
        )
      })
      
      expect(defaultProps.onCardCreated).toHaveBeenCalled()
    })

    it('shows success message after generation', async () => {
      const user = userEvent.setup()
      render(<CreateCardDialog {...defaultProps} />)
      
      const aiInput = screen.getByPlaceholderText(/Example: 'React hooks explained'/)
      await user.type(aiInput, 'Python basics')
      
      const generateButton = screen.getByRole('button', { name: /Generate 20 Cards with AI/i })
      await user.click(generateButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Successfully generated 20 cards/)).toBeInTheDocument()
      })
    })

    it('disables generate button when input is empty', () => {
      render(<CreateCardDialog {...defaultProps} />)
      
      const generateButton = screen.getByRole('button', { name: /Generate 20 Cards with AI/i })
      expect(generateButton).toBeDisabled()
    })

    it('shows loading state during generation', async () => {
      const user = userEvent.setup()
      const { generateCardsFromText } = await import('@/server/actions/ai')
      
      // Mock a delayed promise
      let resolvePromise: (value: unknown) => void
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      
      vi.mocked(generateCardsFromText).mockReturnValue(delayedPromise)
      
      render(<CreateCardDialog {...defaultProps} />)
      
      const aiInput = screen.getByPlaceholderText(/Example: 'React hooks explained'/)
      await user.type(aiInput, 'Test content')
      
      const generateButton = screen.getByRole('button', { name: /Generate 20 Cards with AI/i })
      await user.click(generateButton)
      
      // Check loading state
      expect(screen.getByText('Generating...')).toBeInTheDocument()
      
      // Resolve the promise
      resolvePromise!({
        success: true,
        cards: [{ front: 'Test', back: 'Test', explanation: 'Test' }],
        tokensUsed: 100
      })
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

  })
})