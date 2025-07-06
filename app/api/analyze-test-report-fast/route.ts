import { NextRequest, NextResponse } from 'next/server'

interface FastAnalysis {
  success: boolean
  analysis?: {
    test_parameters?: Array<{
      parameter: string
      value: string
      unit: string
      status: string
      reference_range?: string
    }>
    summary?: string
    analysis?: string
    abnormalities?: string[]
    recommendations?: string[]
  }
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or image file.' },
        { status: 400 }
      )
    }

    // Process with fast LLaVA
    const result = await processWithFastLLaVA(file)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing test report:', error)
    return NextResponse.json(
      { error: 'Failed to process test report' },
      { status: 500 }
    )
  }
}

async function processWithFastLLaVA(file: File): Promise<FastAnalysis> {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString('base64')

    // Simple prompt for text response
    const prompt = `Analyze this medical test report image and provide a simple text summary of the key findings. Just describe what you see in plain text.`

    // Call Ollama LLaVA API with optimized timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout for fast mode

    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llava',
          prompt: prompt,
          images: [base64Image],
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 100,  // Very short response for speed
            top_k: 5,
            top_p: 0.8,
            repeat_penalty: 1.0
          }
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!ollamaResponse.ok) {
        throw new Error(`Failed to connect to Ollama LLaVA: ${ollamaResponse.status}`)
      }

      const ollamaResult = await ollamaResponse.json()
      
      if (!ollamaResult.response) {
        throw new Error('No response from LLaVA model')
      }

      // Just return the raw text response
      return {
        success: true,
        analysis: {
          summary: ollamaResult.response,
          analysis: ollamaResult.response,
          test_parameters: [],
          abnormalities: [],
          recommendations: []
        }
      }

    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Fast LLaVA request timed out')
        return {
          success: false,
          error: 'Fast analysis timed out. Please try again.'
        }
      }
      throw error
    }

  } catch (error) {
    console.error('Fast LLaVA processing error:', error)
    return {
      success: false,
      error: 'Fast LLaVA processing failed. Please ensure Ollama is running with LLaVA model.'
    }
  }
} 