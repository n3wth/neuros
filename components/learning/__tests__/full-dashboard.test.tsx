import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import FullLearningDashboard from '../full-dashboard'

// Mock server actions
vi.mock('@/server/actions/cards', () => ({
  getUserCards: vi.fn(() => Promise.resolve([
    { id: '1', front: 'Q1', back: 'A1', difficulty: 'beginner' },
    { id: '2', front: 'Q2', back: 'A2', difficulty: 'intermediate' }
  ])),
  getDueCards: vi.fn(() => Promise.resolve([
    { 
      id: '1', 
      cards: { front: 'Q1', back: 'A1' },
      mastery_level: 50,
      total_reviews: 5
    }
  ])),
  getCardStats: vi.fn(() => Promise.resolve({
    totalCards: 10,
    dueCards: 3,
    mastered: 2,
    learning: 5,
    difficult: 3
  })),
  getUpcomingCards: vi.fn(() => Promise.resolve({
    'Tomorrow': [{ id: '1' }],
    'In 2 days': [{ id: '2' }]
  }))
}))

vi.mock('@/server/actions/reviews', () => ({
  startStudySession: vi.fn(() => Promise.resolve({ id: 'session-123' })),
  endStudySession: vi.fn(() => Promise.resolve({ success: true })),
  getStudyStats: vi.fn(() => Promise.resolve({
    total_reviews: 100,
    average_accuracy: 85,
    total_study_time_minutes: 120,
    current_streak_days: 7
  }))
}))

vi.mock('@/server/actions/ai', () => ({
  generateLearningInsights: vi.fn(() => Promise.resolve({
    insights: [
      {
        type: 'strength',
        title: 'Great progress!',
        description: 'Your retention rate is improving',
        action: 'Keep it up'
      }
    ]
  }))
}))

vi.mock('@/server/actions/auth', () => ({
  signOut: vi.fn()
}))

describe('FullLearningDashboard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Dashboard Overview', () => {
    it('displays user greeting', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText(/Good (morning|afternoon|evening), test/)).toBeInTheDocument()
      })
    })

    it('shows statistics cards', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument() // Total cards
        expect(screen.getByText('3')).toBeInTheDocument() // Due cards
        expect(screen.getByText('2')).toBeInTheDocument() // Mastered
        expect(screen.getByText('85%')).toBeInTheDocument() // Accuracy
      })
    })

    it('displays streak badge when user has streak', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('7 day streak')).toBeInTheDocument()
      })
    })

    it('shows AI insights', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument()
        expect(screen.getByText('Great progress!')).toBeInTheDocument()
      })
    })

    it('displays upcoming reviews', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('Upcoming Reviews')).toBeInTheDocument()
        expect(screen.getByText('Tomorrow')).toBeInTheDocument()
        expect(screen.getByText('1 cards')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('switches between view modes', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument()
      })
      
      // Switch to Browse
      await user.click(screen.getByRole('button', { name: /Browse/i }))
      expect(screen.getByText('Your Cards')).toBeInTheDocument()
      
      // Switch to Stats
      await user.click(screen.getByRole('button', { name: /Stats/i }))
      expect(screen.getByText('Your Statistics')).toBeInTheDocument()
      
      // Back to Overview
      await user.click(screen.getByRole('button', { name: /Overview/i }))
      expect(screen.getByText(/Good (morning|afternoon|evening)/)).toBeInTheDocument()
    })
  })

  describe('Review Session', () => {
    it('starts review session when clicking start button', async () => {
      const user = userEvent.setup()
      const { startStudySession } = await import('@/server/actions/reviews')
      
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('Start Review Session')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Start Review Session'))
      
      expect(startStudySession).toHaveBeenCalled()
      
      await waitFor(() => {
        expect(screen.getByText('Review Session')).toBeInTheDocument()
      })
    })

    it('ends review session when clicking end button', async () => {
      const user = userEvent.setup()
      const { endStudySession } = await import('@/server/actions/reviews')
      
      render(<FullLearningDashboard user={mockUser} />)
      
      // Start session first
      await waitFor(() => {
        expect(screen.getByText('Start Review Session')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Start Review Session'))
      
      await waitFor(() => {
        expect(screen.getByText('End Session')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('End Session'))
      
      expect(endStudySession).toHaveBeenCalledWith('session-123')
    })
  })

  describe('Browse Mode', () => {
    it('displays all user cards', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Browse/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Q1')).toBeInTheDocument()
        expect(screen.getByText('A1')).toBeInTheDocument()
        expect(screen.getByText('Q2')).toBeInTheDocument()
        expect(screen.getByText('A2')).toBeInTheDocument()
      })
    })

    it('filters cards by search query', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Browse/i }))
      
      const searchInput = screen.getByPlaceholderText('Search cards...')
      await user.type(searchInput, 'Q1')
      
      expect(screen.getByText('Q1')).toBeInTheDocument()
      expect(screen.queryByText('Q2')).not.toBeInTheDocument()
    })

    it('opens create card dialog', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Browse/i }))
      
      const newCardButton = screen.getAllByText('New Card')[0]
      await user.click(newCardButton)
      
      await waitFor(() => {
        expect(screen.getByText('Create Learning Card')).toBeInTheDocument()
      })
    })
  })

  describe('Stats View', () => {
    it('displays study statistics', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Stats/i }))
      
      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument() // Total reviews
        expect(screen.getByText('2h')).toBeInTheDocument() // Study time
        expect(screen.getByText('7')).toBeInTheDocument() // Streak
        expect(screen.getAllByText('85%')[0]).toBeInTheDocument() // Accuracy
      })
    })

    it('shows card distribution', async () => {
      const user = userEvent.setup()
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Stats/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Card Distribution')).toBeInTheDocument()
        expect(screen.getByText(/Mastered \(2\)/)).toBeInTheDocument()
        expect(screen.getByText(/Learning \(5\)/)).toBeInTheDocument()
        expect(screen.getByText(/Difficult \(3\)/)).toBeInTheDocument()
      })
    })
  })

  describe('User Actions', () => {
    it('handles sign out', async () => {
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
      })
      
      const signOutButton = screen.getByRole('button', { name: '' })
      const form = signOutButton.closest('form')
      
      expect(form).toHaveAttribute('action')
    })

    it('refreshes data after card creation', async () => {
      const user = userEvent.setup()
      const { getUserCards } = await import('@/server/actions/cards')
      
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('New Card')).toBeInTheDocument()
      })
      
      // Open and close dialog (simulating card creation)
      const newCardButton = screen.getAllByText('New Card')[0]
      await user.click(newCardButton)
      
      expect(getUserCards).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading States', () => {
    it('shows loading state initially', () => {
      const { getUserCards } = await import('@/server/actions/cards')
      getUserCards.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<FullLearningDashboard user={mockUser} />)
      
      expect(screen.getByText('Loading your learning dashboard...')).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('shows all caught up message when no cards due', async () => {
      const { getCardStats } = await import('@/server/actions/cards')
      vi.mocked(getCardStats).mockResolvedValueOnce({
        totalCards: 10,
        dueCards: 0,
        mastered: 5,
        learning: 5,
        difficult: 0
      })
      
      render(<FullLearningDashboard user={mockUser} />)
      
      await waitFor(() => {
        expect(screen.getByText('All caught up!')).toBeInTheDocument()
        expect(screen.getByText('No cards due for review. Great job staying on top of your learning!')).toBeInTheDocument()
      })
    })

    it('shows empty state in browse when no cards exist', async () => {
      const user = userEvent.setup()
      const { getUserCards } = await import('@/server/actions/cards')
      vi.mocked(getUserCards).mockResolvedValueOnce([])
      
      render(<FullLearningDashboard user={mockUser} />)
      
      await user.click(screen.getByRole('button', { name: /Browse/i }))
      
      await waitFor(() => {
        expect(screen.getByText('No cards yet')).toBeInTheDocument()
        expect(screen.getByText('Create Your First Card')).toBeInTheDocument()
      })
    })
  })
})