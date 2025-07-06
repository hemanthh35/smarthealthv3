import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

interface OCRResult {
  cleaned_text: string
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

    // Process with enhanced OCR + LLaVA
    const result = await processWithOCR(file)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing test report:', error)
    return NextResponse.json(
      { error: 'Failed to process test report' },
      { status: 500 }
    )
  }
}

async function processWithOCR(file: File): Promise<OCRResult> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create a temporary file path
    const tempDir = path.join(process.cwd(), 'temp')
    const fs = require('fs')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`)
    fs.writeFileSync(tempFilePath, buffer)
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [
        '-c',
        `
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'lib'))
from ocr_processor import OCRProcessor

# Read file from command line argument
file_path = sys.argv[1]
file_type = sys.argv[2]

with open(file_path, 'rb') as f:
    file_bytes = f.read()

processor = OCRProcessor()
result = processor.process_document(file_bytes, file_type)

print(result)
        `,
        tempFilePath,
        file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
      ])

      let output = ''
      let errorOutput = ''

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on('close', (code) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFilePath)
        } catch (e) {
          console.log('Could not delete temp file:', e)
        }

        if (code !== 0) {
          console.error('Python OCR error:', errorOutput)
          resolve({ 
            cleaned_text: '',
            error: 'OCR processing failed'
          })
          return
        }

        // Return the cleaned text as { cleaned_text: ... }
        resolve({ cleaned_text: output.trim() })
      })
    })
  } catch (error) {
    console.error('OCR processing error:', error)
    return { 
      cleaned_text: '',
      error: 'OCR processing failed'
    }
  }
} 