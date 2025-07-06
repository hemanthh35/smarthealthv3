import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava',
        prompt: 'Hello, this is a test. Please respond with "Ollama is working correctly!"',
        stream: false
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Ollama is working correctly!',
      response: data.response,
      model: data.model
    })
  } catch (error) {
    console.error('Ollama test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Please ensure Ollama is running with the llava model installed. Run: ollama run llava'
    }, { status: 500 })
  }
} 