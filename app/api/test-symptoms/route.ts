import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple test with LLaVA
    const testSymptoms = ['cough', 'fever', 'fatigue']
    const symptomsText = testSymptoms.join(', ')
    
    const prompt = `Analyze these symptoms: ${symptomsText}. What could this be?`

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          num_predict: 100,
          top_k: 5,
          top_p: 0.8
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
      message: 'LLaVA is working for symptom analysis',
      response: ollamaResult.response,
      testSymptoms: testSymptoms
    })

  } catch (error) {
    console.error('Test symptoms error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'LLaVA test failed. Please ensure Ollama is running.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 