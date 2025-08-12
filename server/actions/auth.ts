'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface PhoneAuthData {
  phone: string
}

export interface VerifyOtpData {
  phone: string
  token: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
  confirmPassword: string
}

export async function signUp(data: SignUpData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signIn(data: SignInData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithOAuth(provider: 'google' | 'github') {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Failed to initialize OAuth flow' }
}

/**
 * Development-only authentication bypass
 * Creates or signs in as a test user with sample data
 * Only works when NODE_ENV === 'development'
 */
export async function signInAsDeveloper() {
  // Security check - only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return { error: 'Development bypass is only available in development mode' }
  }

  const supabase = await createClient()
  
  // Test user credentials
  const testEmail = 'test@neuros.dev'
  const testPassword = 'test123456'
  const testFullName = 'Alex Developer'

  // Try to sign in with existing test user
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (!signInError) {
    // Successfully signed in to existing test user
    revalidatePath('/', 'layout')
    return { success: true, message: 'Signed in to test account' }
  }

  // If sign in failed, try to create the test user
  const { error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: testFullName,
      },
    },
  })

  if (signUpError) {
    // If signup also failed, return error
    return { error: `Failed to create test user: ${signUpError.message}` }
  }

  // Sign in with the newly created user
  const { error: secondSignInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  })

  if (secondSignInError) {
    return { error: `Failed to sign in with test user: ${secondSignInError.message}` }
  }

  // Seed the test account with sample data
  await seedTestAccountData()

  revalidatePath('/', 'layout')
  return { success: true, message: 'Created and signed in to test account' }
}

/**
 * Seeds the test account with realistic learning data
 * Only works in development mode
 */
async function seedTestAccountData() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const supabase = await createClient()
  
  // Get the current user (should be the test user we just signed in)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Check if user already has data (avoid duplicate seeding)
  const { data: existingCards } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (existingCards && existingCards.length > 0) {
    // User already has data, skip seeding
    return
  }

  // Get topic IDs for seeding
  const { data: topics } = await supabase
    .from('topics')
    .select('id, name')

  if (!topics || topics.length === 0) return

  const topicsByName = topics.reduce((acc, topic) => {
    acc[topic.name] = topic.id
    return acc
  }, {} as Record<string, string>)

  // Sample cards data
  const sampleCards = [
    {
      user_id: user.id,
      topic_id: topicsByName['Machine Learning'],
      front: 'What is overfitting in machine learning?',
      back: 'When a model performs well on training data but poorly on new, unseen data due to learning noise rather than the underlying pattern.',
      explanation: 'Overfitting occurs when a model becomes too complex and memorizes the training data instead of learning generalizable patterns. This can be prevented through techniques like cross-validation, regularization, and using more training data.',
      difficulty: 'intermediate',
      tags: ['fundamentals', 'model-validation']
    },
    {
      user_id: user.id,
      topic_id: topicsByName['Product Strategy'],
      front: 'What is the Jobs-to-be-Done (JTBD) framework?',
      back: 'A theory that customers "hire" products to get specific jobs done in their lives, focusing on the progress customers are trying to make rather than customer characteristics.',
      explanation: 'JTBD helps product teams understand the underlying motivations behind customer behavior. It shifts focus from demographics to the functional, emotional, and social jobs customers need accomplished.',
      difficulty: 'intermediate',
      tags: ['frameworks', 'customer-insights']
    },
    {
      user_id: user.id,
      topic_id: topicsByName['Frontend Development'],
      front: 'What is the difference between useEffect and useLayoutEffect in React?',
      back: 'useEffect runs after the DOM has been updated and painted, while useLayoutEffect runs synchronously before the browser paints.',
      explanation: 'useLayoutEffect is useful when you need to measure DOM elements or make visual changes that should happen before the browser paints to avoid flickering. useEffect is preferred for most side effects as it doesnt block painting.',
      difficulty: 'advanced',
      tags: ['react', 'hooks', 'performance']
    },
    {
      user_id: user.id,
      topic_id: topicsByName['System Design'],
      front: 'What is database sharding?',
      back: 'A method of horizontally partitioning data across multiple database servers, where each shard contains a subset of the data.',
      explanation: 'Sharding helps scale databases beyond a single servers capacity by distributing data based on a sharding key. However, it introduces complexity in querying across shards and maintaining consistency.',
      difficulty: 'advanced',
      tags: ['databases', 'scalability', 'distributed-systems']
    },
    {
      user_id: user.id,
      topic_id: topicsByName['Wellness'],
      front: 'What is the difference between stress and anxiety?',
      back: 'Stress is a response to external pressures and typically subsides when the stressor is removed, while anxiety is worry about future threats and can persist without clear external triggers.',
      explanation: 'Understanding this difference helps in choosing appropriate coping strategies. Stress management focuses on addressing external factors, while anxiety management often involves cognitive techniques and sometimes professional help.',
      difficulty: 'beginner',
      tags: ['mental-health', 'coping-strategies']
    },
    {
      user_id: user.id,
      topic_id: topicsByName['Creative Coding'],
      front: 'What is a noise function in generative art?',
      back: 'A mathematical function that produces smooth, natural-looking random values, commonly used to create organic patterns and movements in digital art.',
      explanation: 'Perlin noise and simplex noise are popular types. Unlike pure random functions, noise functions create correlated values that produce natural-looking textures, terrains, and animations.',
      difficulty: 'intermediate',
      tags: ['algorithms', 'procedural-generation', 'p5js']
    }
  ]

  // Insert sample cards
  const { data: insertedCards, error: cardsError } = await supabase
    .from('cards')
    .insert(sampleCards)
    .select('id')

  if (cardsError || !insertedCards) {
    console.error('Failed to seed cards:', cardsError)
    return
  }

  // Create user_cards entries with realistic progress
  const userCards = insertedCards.map((card, index) => {
    const isReviewed = index < 4 // First 4 cards have been reviewed
    return {
      user_id: user.id,
      card_id: card.id,
      ease_factor: isReviewed ? 2.3 + Math.random() * 0.4 : 2.5,
      interval_days: isReviewed ? Math.floor(Math.random() * 7) + 1 : 0,
      repetitions: isReviewed ? Math.floor(Math.random() * 3) + 1 : 0,
      next_review_date: isReviewed 
        ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : new Date().toISOString(),
      last_review_date: isReviewed ? new Date().toISOString() : null,
      total_reviews: isReviewed ? Math.floor(Math.random() * 5) + 1 : 0,
      correct_reviews: isReviewed ? Math.floor(Math.random() * 3) + 1 : 0,
      mastery_level: isReviewed ? Math.floor(Math.random() * 60) + 20 : 0,
      average_response_time: isReviewed ? Math.floor(Math.random() * 3000) + 2000 : null
    }
  })

  await supabase.from('user_cards').insert(userCards)

  // Insert sample study sessions
  const sampleSessions = [
    {
      user_id: user.id,
      started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
      cards_studied: 8,
      cards_correct: 6,
      total_time_seconds: 1500,
      focus_score: 85.5,
      metadata: { session_type: 'review' }
    },
    {
      user_id: user.id,
      started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 18 * 60 * 1000).toISOString(),
      cards_studied: 5,
      cards_correct: 4,
      total_time_seconds: 1080,
      focus_score: 78.2,
      metadata: { session_type: 'new_cards' }
    }
  ]

  await supabase.from('study_sessions').insert(sampleSessions)

  // Create user stats
  const userStats = {
    user_id: user.id,
    total_cards: sampleCards.length,
    cards_mastered: 2,
    total_reviews: 12,
    total_study_time_minutes: 43,
    current_streak_days: 3,
    longest_streak_days: 7,
    last_study_date: new Date().toISOString().split('T')[0],
    average_accuracy: 75.5,
    favorite_topic_id: topicsByName['Machine Learning'],
    best_time_of_day: 14 // 2 PM
  }

  await supabase.from('user_stats').insert(userStats)
}

export async function forgotPassword(data: ForgotPasswordData) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPassword(data: ResetPasswordData) {
  const supabase = await createClient()

  if (data.password !== data.confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const { error } = await supabase.auth.updateUser({
    password: data.password
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Send OTP to phone number for authentication
 */
export async function signInWithPhone(data: PhoneAuthData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    phone: data.phone,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Verification code sent to your phone' }
}

/**
 * Sign up with phone number
 */
export async function signUpWithPhone(data: PhoneAuthData & { fullName?: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    phone: data.phone,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Verification code sent to your phone' }
}

/**
 * Verify OTP code from phone authentication
 */
export async function verifyPhoneOtp(data: VerifyOtpData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    phone: data.phone,
    token: data.token,
    type: 'sms'
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}