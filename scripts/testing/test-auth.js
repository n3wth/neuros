// Quick test script to verify authentication
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuth() {
  console.log('Testing authentication...\n')
  
  // Test sign in with dev account
  console.log('1. Testing dev account signin...')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test@neuros.dev',
    password: 'test123456'
  })
  
  if (signInError) {
    console.log('   ✗ Dev account signin failed:', signInError.message)
    
    // Try to create the account
    console.log('2. Attempting to create dev account...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@neuros.dev',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Alex Developer'
        }
      }
    })
    
    if (signUpError) {
      console.log('   ✗ Dev account creation failed:', signUpError.message)
    } else {
      console.log('   ✓ Dev account created successfully')
      console.log('   User ID:', signUpData.user?.id)
    }
  } else {
    console.log('   ✓ Dev account signin successful')
    console.log('   User ID:', signInData.user?.id)
    console.log('   Email:', signInData.user?.email)
  }
  
  // Test current session
  console.log('\n3. Checking current session...')
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.log('   ✗ Session check failed:', sessionError.message)
  } else if (sessionData.session) {
    console.log('   ✓ Active session found')
    console.log('   User:', sessionData.session.user.email)
    console.log('   Expires at:', new Date(sessionData.session.expires_at * 1000).toLocaleString())
  } else {
    console.log('   ℹ No active session')
  }
  
  // Test database access
  console.log('\n4. Testing database access...')
  const { data: cardsData, error: cardsError } = await supabase
    .from('cards')
    .select('id')
    .limit(1)
  
  if (cardsError) {
    console.log('   ✗ Database access failed:', cardsError.message)
  } else {
    console.log('   ✓ Database access successful')
    console.log('   Cards table accessible')
  }
  
  console.log('\nTest complete!')
}

testAuth().catch(console.error)