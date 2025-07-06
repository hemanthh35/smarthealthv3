import { NextRequest, NextResponse } from 'next/server'

interface SimpleSymptomAnalysis {
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
    const result = await analyzeSymptomsSimple(symptoms)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    return NextResponse.json(
      { error: 'Failed to analyze symptoms' },
      { status: 500 }
    )
  }
}

async function analyzeSymptomsSimple(symptoms: string[]): Promise<SimpleSymptomAnalysis> {
  try {
    // Create a prompt that asks for specific recommendations
    const symptomsText = symptoms.join(', ')
    const prompt = `Analyze these symptoms: ${symptomsText}. 

Provide a medical analysis including:
1. What condition this could be
2. Specific recommendations for treatment
3. When to seek medical care
4. Severity level (mild/moderate/severe)

Give practical, actionable advice.`

    // Call Ollama LLaVA API with shorter timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

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
            num_predict: 150,  // Longer response for better analysis
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

      console.log('LLaVA Simple Response:', ollamaResult.response)

      // Extract real recommendations from LLaVA response
      const analysisResult = extractRealAnalysis(ollamaResult.response, symptoms)

      return {
        success: true,
        analysis: analysisResult
      }

    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('LLaVA simple request timed out')
        return {
          success: false,
          error: 'Analysis timed out. Please try again.'
        }
      }
      throw error
    }

  } catch (error) {
    console.error('LLaVA simple processing error:', error)
    return {
      success: false,
      error: 'LLaVA processing failed. Please ensure Ollama is running with LLaVA model.'
    }
  }
}

function extractRealAnalysis(response: string, symptoms: string[]): any {
  const responseLower = response.toLowerCase()
  
  // Extract condition from response
  let condition = 'Symptom Analysis'
  if (responseLower.includes('cardiovascular') || responseLower.includes('heart')) {
    condition = 'Cardiovascular Issue'
  } else if (responseLower.includes('cancer') || responseLower.includes('tumor')) {
    condition = 'Possible Cancer'
  } else if (responseLower.includes('infection')) {
    condition = 'Infection'
  } else if (responseLower.includes('cold') || responseLower.includes('flu')) {
    condition = 'Common Cold or Flu'
  } else if (responseLower.includes('allergy')) {
    condition = 'Allergic Reaction'
  } else if (responseLower.includes('pain')) {
    condition = 'Pain or Discomfort'
  } else if (responseLower.includes('fever')) {
    condition = 'Fever'
  } else if (responseLower.includes('covid')) {
    condition = 'Possible COVID-19'
  } else if (responseLower.includes('headache')) {
    condition = 'Headache or Migraine'
  } else if (responseLower.includes('stomach') || responseLower.includes('digestive')) {
    condition = 'Digestive Issue'
  }

  // Determine severity from response
  let severity: 'mild' | 'moderate' | 'severe' = 'moderate'
  if (responseLower.includes('severe') || responseLower.includes('emergency') || responseLower.includes('immediate')) {
    severity = 'severe'
  } else if (responseLower.includes('mild') || responseLower.includes('minor')) {
    severity = 'mild'
  }

  // Extract real recommendations from the response
  const recommendations: string[] = []
  
  // Look for recommendation patterns in the response
  const lines = response.split('\n')
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase()
    
    // Extract recommendations based on common patterns
    if (trimmedLine.includes('recommend') || 
        trimmedLine.includes('should') || 
        trimmedLine.includes('advise') ||
        trimmedLine.includes('suggest') ||
        trimmedLine.includes('consult') ||
        trimmedLine.includes('see a doctor') ||
        trimmedLine.includes('medical attention') ||
        trimmedLine.includes('treatment') ||
        trimmedLine.includes('medication') ||
        trimmedLine.includes('test') ||
        trimmedLine.includes('monitor')) {
      
      // Clean up the recommendation
      let rec = line.trim()
      if (rec.startsWith('-') || rec.startsWith('•') || rec.startsWith('*')) {
        rec = rec.substring(1).trim()
      }
      if (rec.match(/^\d+\./)) {
        rec = rec.replace(/^\d+\.\s*/, '')
      }
      
      if (rec.length > 10 && rec.length < 200) {
        recommendations.push(rec)
      }
    }
  }

  // If no recommendations found, extract from general text
  if (recommendations.length === 0) {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 20)
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (trimmed.toLowerCase().includes('should') || 
          trimmed.toLowerCase().includes('recommend') ||
          trimmed.toLowerCase().includes('advise') ||
          trimmed.toLowerCase().includes('consult')) {
        recommendations.push(trimmed)
        if (recommendations.length >= 3) break
      }
    }
  }

  // Fallback recommendations if none extracted
  if (recommendations.length === 0) {
    recommendations.push(
      'Consult with a healthcare provider for proper diagnosis',
      'Monitor symptoms for any changes',
      'Keep track of symptom severity'
    )
  }

  // Extract when to seek care
  let whenToSeekCare = 'If symptoms worsen or persist, seek medical attention'
  if (responseLower.includes('immediate') || responseLower.includes('emergency')) {
    whenToSeekCare = 'Seek immediate medical attention'
  } else if (responseLower.includes('urgent') || responseLower.includes('asap')) {
    whenToSeekCare = 'Seek urgent medical care'
  } else if (responseLower.includes('within 24 hours')) {
    whenToSeekCare = 'Seek medical attention within 24 hours'
  }

  return {
    condition: condition,
    probability: 75,
    severity: severity,
    description: response || 'AI analysis completed. Please consult with a healthcare provider for proper diagnosis.',
    symptoms: symptoms,
    recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
    whenToSeekCare: whenToSeekCare
  }
} 