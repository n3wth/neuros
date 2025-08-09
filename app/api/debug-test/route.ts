import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Set a breakpoint on the next line in VS Code by clicking the line number
  const debugMessage = 'VS Code debugger test endpoint'
  
  console.log('🔍 Debug test called at:', new Date().toISOString())
  
  // This will pause here if you have a breakpoint set
  const testData = {
    message: debugMessage,
    timestamp: Date.now(),
    headers: Object.fromEntries(request.headers.entries()),
    debugging: true
  }
  
  return NextResponse.json(testData)
}