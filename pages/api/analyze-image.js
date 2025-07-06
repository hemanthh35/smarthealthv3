import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse the uploaded file
    const form = formidable({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    })

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })

    const imageFile = files.image?.[0]
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' })
    }

    // Get analysis type from form data
    const analysisType = fields.analysisType?.[0] || 'xray'

    // Analyze the image using Ollama LLaVA
    const analysisResults = await analyzeImageWithOllama(imageFile.filepath, analysisType)

    // Clean up uploaded file
    fs.unlinkSync(imageFile.filepath)

    res.status(200).json(analysisResults)
  } catch (error) {
    console.error('Image analysis error:', error)
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message,
      message: 'Please ensure Ollama is running with the LLaVA model installed: ollama run llava'
    })
  }
}

async function analyzeImageWithOllama(imagePath, analysisType) {
  try {
    // Convert image to base64 for Ollama
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    // Prepare specialized prompts based on analysis type
    const prompts = {
      xray: `Analyze this X-ray image for bone structure, alignment, and any abnormalities. 
      Look for fractures, dislocations, bone density issues, or other skeletal problems.`,
      bone_fracture: `Analyze this X-ray image specifically for bone fractures. 
      Look for fracture lines, bone displacement, healing fractures, or stress fractures.`,
      brain_tumor: `Analyze this brain scan image for any masses, tumors, or abnormalities. 
      Look for brain tissue changes, mass effects, or structural abnormalities.`
    }

    const prompt = prompts[analysisType] || prompts.xray

    const fullPrompt = `${prompt}
    Provide your analysis in the following JSON format:
    {
      "condition": "identified condition or symptom",
      "confidence": percentage (0-100),
      "description": "detailed description of what you observe",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
      "severity": "mild|moderate|severe",
      "whenToSeekCare": "guidance on when to seek medical attention"
    }`

    console.log('Sending to Ollama:', {
      model: 'llava',
      prompt: fullPrompt,
      imageSize: base64Image.length,
      analysisType
    })

    // Call Ollama LLaVA API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llava',
        prompt: fullPrompt,
        images: [base64Image],
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ollama API error:', response.status, errorText)
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Ollama response:', data)
    
    // Parse the response
    let analysisResult
    try {
      // Try to extract JSON from the response
      const jsonMatch = data.response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if JSON parsing fails
        analysisResult = {
          condition: 'Image Analysis',
          confidence: 75,
          description: data.response || 'AI analysis completed',
          recommendations: [
            'Consult with a healthcare provider for proper diagnosis',
            'Monitor any changes in the condition',
            'Keep the area clean and protected'
          ],
          severity: 'moderate',
          whenToSeekCare: 'If symptoms worsen or persist, seek medical attention'
        }
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysisResult = {
        condition: 'Image Analysis',
        confidence: 75,
        description: data.response || 'AI analysis completed',
        recommendations: [
          'Consult with a healthcare provider for proper diagnosis',
          'Monitor any changes in the condition',
          'Keep the area clean and protected'
        ],
        severity: 'moderate',
        whenToSeekCare: 'If symptoms worsen or persist, seek medical attention'
      }
    }

    // Limit response size to prevent localStorage quota issues
    const limitedResult = {
      ...analysisResult,
      description: analysisResult.description?.substring(0, 500) || 'Analysis completed',
      recommendations: analysisResult.recommendations?.slice(0, 3) || [
        'Consult with a healthcare provider for proper diagnosis',
        'Monitor any changes in the condition',
        'Keep the area clean and protected'
      ]
    }

    return [limitedResult]
  } catch (error) {
    console.error('Ollama analysis error:', error)
    throw new Error('Ollama LLaVA model is not available. Please ensure Ollama is running with the LLaVA model installed.')
  }
} 