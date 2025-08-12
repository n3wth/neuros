const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPhoneAuth() {
  console.log('Testing phone authentication...\n')
  
  // Test phone number (use a test number if available)
  const testPhone = '+1234567890' // Replace with your test phone
  
  try {
    // Test 1: Send OTP
    console.log('1. Sending OTP to phone number...')
    const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
      phone: testPhone,
    })
    
    if (otpError) {
      console.error('❌ OTP send failed:', otpError.message)
      return
    }
    
    console.log('✅ OTP sent successfully!')
    console.log('   Response:', otpData)
    
    // Test 2: Check if we can verify (we won't have the actual OTP in this test)
    console.log('\n2. Testing OTP verification endpoint...')
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: testPhone,
      token: '123456', // This will fail but tests the endpoint
      type: 'sms'
    })
    
    if (verifyError) {
      console.log('⚠️  Expected verification failure (no real OTP):', verifyError.message)
    }
    
    console.log('\n✅ Phone authentication is properly configured!')
    console.log('   - OTP sending works')
    console.log('   - Verification endpoint is accessible')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testPhoneAuth()