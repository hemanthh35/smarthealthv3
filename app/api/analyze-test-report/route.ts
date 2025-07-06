import { NextRequest, NextResponse } from 'next/server'

interface LLaVAAnalysis {
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

    // Process with LLaVA directly
    const result = await processWithLLaVA(file)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing test report:', error)
    return NextResponse.json(
      { error: 'Failed to process test report' },
      { status: 500 }
    )
  }
}

async function processWithLLaVA(file: File): Promise<LLaVAAnalysis> {
  try {
    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString('base64')

    // Simple prompt for text response
    const prompt = `Analyze this medical test report image and provide a simple text summary of the key findings. Just describe what you see in plain text.`

    // Call Ollama LLaVA API with optimized timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout

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
            num_predict: 150,  // Reduced for faster response
            top_k: 10,
            top_p: 0.9,
            repeat_penalty: 1.1
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
        console.error('LLaVA request timed out')
        return {
          success: false,
          error: 'Analysis timed out. Please try again.'
        }
      }
      throw error
    }

  } catch (error) {
    console.error('LLaVA processing error:', error)
    return {
      success: false,
      error: 'LLaVA processing failed. Please ensure Ollama is running with LLaVA model.'
    }
  }
} 