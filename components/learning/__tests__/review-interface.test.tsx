import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ReviewInterface from '../review-interface'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock server actions
vi.mock('@/server/actions/reviews', () => ({
  submitReview: vi.fn(() => Promise.resolve({ success: true }))
}))

vi.mock('@/server/actions/cards', () => ({
  getDueCards: vi.fn(() => Promise.resolve([
    {
      id: '1',
      cards: {
        id: 'card-1',
        front: 'What is React?',
        back: 'A JavaScript library',
        explanation: 'React helps build UIs',
        difficulty: 'intermediate',
        topics: { name: 'JavaScript', color: '#3B82F6' }
      },
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 0,
      mastery_level: 0
    },
    {
      id: '2',
      cards: {
        id: 'card-2',
        front: 'What is useState?',
        back: 'A React Hook',
        difficulty: 'intermediate'
      },
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 0,
      mastery_level: 25
    }
  ]))
}))

vi.mock('@/server/actions/ai', () => ({
  generateExplanation: vi.fn(() => Promise.resolve({
    explanation: 'AI generated explanation'
  })),
  generatePracticeQuestions: vi.fn(() => Promise.resolve({
    questions: []
  }))
}))

describe('ReviewInterface', () => {
  const defaultProps = {
    sessionId: 'session-123'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Card Loading and Display', () => {
    it('loads and displays due cards', async () => {
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Progress: 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Mastery: 0%')).toBeInTheDocument()
    })

    it('shows loading state initially', () => {
      render(<ReviewInterface {...defaultProps} />)
      expect(screen.getByText('Loading your cards...')).toBeInTheDocument()
    })

    it('shows empty state when no cards are due', async () => {
      const { getDueCards } = await import('@/server/actions/cards')
      vi.mocked(getDueCards).mockResolvedValueOnce([])
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('All caught up!')).toBeInTheDocument()
      })
    })
  })

  describe('Answer Reveal', () => {
    it('shows answer when Show Answer button is clicked', async () => {
      const user = userEvent.setup()
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
      expect(screen.getByText('How difficult was this?')).toBeInTheDocument()
    })

    it('reveals answer with spacebar', async () => {
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      fireEvent.keyDown(window, { key: ' ' })
      
      await waitFor(() => {
        expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
      })
    })
  })

  describe('Rating System', () => {
    it('submits review when rating is clicked', async () => {
      const user = userEvent.setup()
      const { submitReview } = await import('@/server/actions/reviews')
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Show answer
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      // Click rating 4 (Easy)
      const easyButton = screen.getByRole('button', { name: /Easy/i })
      await user.click(easyButton)
      
      await waitFor(() => {
        expect(submitReview).toHaveBeenCalledWith(
          'card-1',
          4,
          expect.any(Number),
          'session-123'
        )
      })
      
      // Should move to next card
      expect(screen.getByText('What is useState?')).toBeInTheDocument()
    })

    it('accepts keyboard shortcuts for ratings', async () => {
      const { submitReview } = await import('@/server/actions/reviews')
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Show answer
      fireEvent.keyDown(window, { key: ' ' })
      
      await waitFor(() => {
        expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
      })
      
      // Rate with keyboard
      fireEvent.keyDown(window, { key: '3' })
      
      await waitFor(() => {
        expect(submitReview).toHaveBeenCalledWith(
          'card-1',
          3,
          expect.any(Number),
          'session-123'
        )
      })
    })

    it('updates statistics after rating', async () => {
      const user = userEvent.setup()
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Initial stats
      expect(screen.getByText('0').closest('div')).toBeInTheDocument()
      
      // Show answer and rate
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      const goodButton = screen.getByRole('button', { name: /Good/i })
      await user.click(goodButton)
      
      await waitFor(() => {
        // Check stats updated
        const reviewedStat = screen.getByText('Reviewed').closest('div')
        expect(reviewedStat).toHaveTextContent('1')
        
        const correctStat = screen.getByText('Correct').closest('div')
        expect(correctStat).toHaveTextContent('1')
      })
    })
  })

  describe('Explanation and AI Help', () => {
    it('toggles explanation visibility', async () => {
      const user = userEvent.setup()
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Show answer
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      // Toggle explanation
      const explainButton = screen.getByRole('button', { name: /Show Explanation/i })
      await user.click(explainButton)
      
      expect(screen.getByText('React helps build UIs')).toBeInTheDocument()
      
      // Hide explanation
      const hideButton = screen.getByRole('button', { name: /Hide Explanation/i })
      await user.click(hideButton)
      
      expect(screen.queryByText('React helps build UIs')).not.toBeInTheDocument()
    })

    it('fetches AI explanation when requested', async () => {
      const user = userEvent.setup()
      const { generateExplanation } = await import('@/server/actions/ai')
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Show answer
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      // Request AI help
      const aiHelpButton = screen.getByRole('button', { name: /AI Help/i })
      await user.click(aiHelpButton)
      
      await waitFor(() => {
        expect(generateExplanation).toHaveBeenCalledWith(
          'What is React? - A JavaScript library',
          'simple'
        )
      })
      
      // Toggle explanation to see AI content
      const explainButton = screen.getByRole('button', { name: /Show Explanation/i })
      await user.click(explainButton)
      
      expect(screen.getByText('AI generated explanation')).toBeInTheDocument()
    })

    it('uses keyboard shortcut for explanation', async () => {
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Show answer
      fireEvent.keyDown(window, { key: ' ' })
      
      await waitFor(() => {
        expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
      })
      
      // Toggle explanation with 'e'
      fireEvent.keyDown(window, { key: 'e' })
      
      expect(screen.getByText('React helps build UIs')).toBeInTheDocument()
    })
  })

  describe('Progress and Navigation', () => {
    it('shows progress through cards', async () => {
      const user = userEvent.setup()
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Progress: 1 of 2')).toBeInTheDocument()
      })
      
      // Complete first card
      const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
      await user.click(showAnswerButton)
      
      const goodButton = screen.getByRole('button', { name: /Good/i })
      await user.click(goodButton)
      
      await waitFor(() => {
        expect(screen.getByText('Progress: 2 of 2')).toBeInTheDocument()
        expect(screen.getByText('What is useState?')).toBeInTheDocument()
      })
    })

    it('loads more cards when all are completed', async () => {
      const user = userEvent.setup()
      const { getDueCards } = await import('@/server/actions/cards')
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Complete all cards
      for (let i = 0; i < 2; i++) {
        const showAnswerButton = screen.getByRole('button', { name: /Show Answer/i })
        await user.click(showAnswerButton)
        
        const goodButton = screen.getByRole('button', { name: /Good/i })
        await user.click(goodButton)
        
        if (i === 0) {
          await waitFor(() => {
            expect(screen.getByText('What is useState?')).toBeInTheDocument()
          })
        }
      }
      
      // Should reload cards
      await waitFor(() => {
        expect(getDueCards).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('displays keyboard shortcuts help', async () => {
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Show Answer')).toBeInTheDocument()
      expect(screen.getByText('Rate Difficulty')).toBeInTheDocument()
      expect(screen.getByText('Toggle Explanation')).toBeInTheDocument()
      expect(screen.getByText('AI Help')).toBeInTheDocument()
    })

    it('responds to all keyboard shortcuts', async () => {
      const { generateExplanation } = await import('@/server/actions/ai')
      
      render(<ReviewInterface {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('What is React?')).toBeInTheDocument()
      })
      
      // Space to show answer
      fireEvent.keyDown(window, { key: ' ' })
      await waitFor(() => {
        expect(screen.getByText('A JavaScript library')).toBeInTheDocument()
      })
      
      // 'e' for explanation
      fireEvent.keyDown(window, { key: 'e' })
      expect(screen.getByText('React helps build UIs')).toBeInTheDocument()
      
      // 'h' for AI help
      fireEvent.keyDown(window, { key: 'h' })
      await waitFor(() => {
        expect(generateExplanation).toHaveBeenCalled()
      })
    })
  })
})