import { NextRequest, NextResponse } from 'next/server'

interface SymptomAnalysis {
  success: boolean
  analysis?: {
    condition: string
    probability: number
    severity: 'mild' | 'moderate' | 'severe'
    description: string
    symptoms: string[]
    recommendations: string[]
    whenToSeekCare: string
  }
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms } = body

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'No symptoms provided' },
        { status: 400 }
      )
    }

    // Process with LLaVA
    const result = await analyzeSymptomsWithLLaVA(symptoms)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    return NextResponse.json(
      { error: 'Failed to analyze symptoms' },
      { status: 500 }
    )
  }
}

async function analyzeSymptomsWithLLaVA(symptoms: string[]): Promise<SymptomAnalysis> {
  try {
    // Create a simple, focused prompt for symptom analysis
    const symptomsText = symptoms.join(', ')
    const prompt = `Analyze these symptoms: ${symptomsText}

Provide a simple medical analysis in this exact JSON format:
{
  "condition": "most likely condition",
  "probability": 75,
  "severity": "moderate",
  "description": "brief description",
  "symptoms": ["symptom1", "symptom2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "whenToSeekCare": "when to seek care"
}`

    // Call Ollama LLaVA API with shorter timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
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
            num_predict: 150,  // Shorter response
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

      console.log('LLaVA Response:', ollamaResult.response)

      // Parse the JSON response from LLaVA
      let analysisResult
      try {
        // Try to extract JSON from the response
        const jsonMatch = ollamaResult.response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0])
          console.log('Parsed JSON:', analysisResult)
        } else {
          // Create analysis from text response
          analysisResult = createAnalysisFromText(ollamaResult.response, symptoms)
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        // Create analysis from text response
        analysisResult = createAnalysisFromText(ollamaResult.response, symptoms)
      }

      return {
        success: true,
        analysis: analysisResult
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

function createAnalysisFromText(response: string, symptoms: string[]): any {
  // Create intelligent analysis from text response
  const responseLower = response.toLowerCase()
  
  let condition = 'Symptom Analysis'
  let severity: 'mild' | 'moderate' | 'severe' = 'moderate'
  let probability = 75

  // Analyze response for common conditions
  if (responseLower.includes('cold') || responseLower.includes('flu')) {
    condition = 'Common Cold or Flu'
    severity = 'mild'
    probability = 80
  } else if (responseLower.includes('infection')) {
    condition = 'Possible Infection'
    severity = 'moderate'
    probability = 70
  } else if (responseLower.includes('allergy')) {
    condition = 'Allergic Reaction'
    severity = 'mild'
    probability = 75
  } else if (responseLower.includes('pain') || responseLower.includes('ache')) {
    condition = 'Pain or Discomfort'
    severity = 'moderate'
    probability = 65
  } else if (responseLower.includes('fever')) {
    condition = 'Fever or Elevated Temperature'
    severity = 'moderate'
    probability = 70
  }

  return {
    condition: condition,
    probability: probability,
    severity: severity,
    description: response || 'AI analysis completed. Please consult with a healthcare provider for proper diagnosis.',
    symptoms: symptoms,
    recommendations: [
      'Consult with a healthcare provider for proper diagnosis',
      'Monitor symptoms for any changes',
      'Keep track of symptom severity'
    ],
    whenToSeekCare: 'If symptoms worsen or persist, seek medical attention'
  }
} 