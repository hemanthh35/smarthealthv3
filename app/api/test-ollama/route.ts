import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test simple text generation
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava',
        prompt: 'Hello, this is a test message. Please respond with "Test successful".',
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 50
        }
      })
    })

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        { error: `Ollama connection failed: ${ollamaResponse.status}` },
        { status: 500 }
      )
    }

    const ollamaResult = await ollamaResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'Ollama is working',
      response: ollamaResult.response,
      model: 'llava'
    })

  } catch (error) {
    console.error('Ollama test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Ollama connection failed. Please ensure Ollama is running.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 