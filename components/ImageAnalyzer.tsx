'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, Eye, AlertTriangle, CheckCircle, Clock, X, Download, Search, Target, Activity, Shield } from 'lucide-react'
import { healthDataManager } from '@/lib/healthData'

interface AnalysisResult {
  condition: string
  confidence: number
  description: string
  recommendations: string[]
  severity: 'mild' | 'moderate' | 'severe'
  whenToSeekCare: string
}

type AnalysisType = 'xray' | 'bone_fracture' | 'brain_tumor'

export default function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'results'>('upload')
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<AnalysisType>('xray')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analysisTypes = [
    {
      type: 'xray' as AnalysisType,
      title: 'X-Ray Analysis',
      description: 'Analyze X-ray images for abnormalities',
      icon: Activity,
      color: 'from-blue-500 to-purple-600'
    },
    {
      type: 'bone_fracture' as AnalysisType,
      title: 'Bone Fracture Detection',
      description: 'Detect and analyze bone fractures',
      icon: Shield,
      color: 'from-red-500 to-orange-600'
    },
    {
      type: 'brain_tumor' as AnalysisType,
      title: 'Brain Tumor Detection',
      description: 'Analyze brain scans for tumor detection',
      icon: Eye,
      color: 'from-purple-500 to-indigo-600'
    }
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setCurrentStep('analysis')
    }
  }

  const handleCameraCapture = () => {
    // This would integrate with device camera
    console.log('Camera capture functionality')
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('analysisType', selectedAnalysisType)

      // Call the API to analyze with Ollama LLaVA
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const results = await response.json()
      setAnalysisResults(results)
      setCurrentStep('results')
      
      // Save analysis to dashboard
      if (results.length > 0) {
        const topResult = results[0]
        healthDataManager.addAnalysis({
          type: 'image',
          date: new Date().toISOString().split('T')[0],
          result: topResult.condition,
          confidence: topResult.confidence,
          imageUrl: imagePreview || undefined,
          description: topResult.description,
          recommendations: topResult.recommendations,
          severity: topResult.severity === 'mild' ? 'low' : topResult.severity === 'moderate' ? 'medium' : 'high'
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed'
      alert(`Analysis failed: ${errorMessage}\n\nPlease ensure Ollama is running with the LLaVA model installed:\n\nollama run llava`)
    } finally {
      setIsAnalyzing(false)
    }
  }



  const resetAnalyzer = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResults([])
    setCurrentStep('upload')
    setSelectedAnalysisType('xray')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {currentStep === 'upload' && (
        <div className="card">
          <div className="text-center mb-6">
            <Eye className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Medical Imaging Analyzer
            </h2>
            <p className="text-gray-600">
              Upload X-ray or brain scan images for AI-powered medical analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload from device */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select an image from your device
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn-primary cursor-pointer inline-block"
              >
                Choose File
              </label>
            </div>

            {/* Camera capture */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Take Photo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Capture a photo with your camera
              </p>
              <button
                onClick={handleCameraCapture}
                className="btn-primary"
              >
                Open Camera
              </button>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Requirements</h4>
                <p className="text-blue-800 text-sm">
                  This analysis requires Ollama with the LLaVA model. Install and run: <code className="bg-blue-100 px-1 rounded">ollama run llava</code>
                </p>
                <p className="text-blue-800 text-sm mt-2">
                  <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical diagnosis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'analysis' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Image Analysis</h2>
              <p className="text-gray-600">Review your image and select analysis type</p>
            </div>
            <button
              onClick={resetAnalyzer}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Image Preview</h3>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {selectedImage?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Type Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Select Analysis Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {analysisTypes.map((analysisType) => (
                  <button
                    key={analysisType.type}
                    onClick={() => setSelectedAnalysisType(analysisType.type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedAnalysisType === analysisType.type
                        ? `border-primary-500 bg-primary-50`
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${analysisType.color} rounded-lg flex items-center justify-center mb-2`}>
                      <analysisType.icon className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{analysisType.title}</h4>
                    <p className="text-gray-600 text-xs mt-1">{analysisType.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      <span>Analyzing with LLaVA...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze with LLaVA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 'results' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <p className="text-gray-600">AI-powered health insights for your image</p>
            </div>
            <button
              onClick={resetAnalyzer}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image with Results */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Analyzed Image</h3>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Analyzed"
                    className="w-full h-64 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {selectedAnalysisType} Analysis
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-4">
              {analysisResults.map((result, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{result.condition}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </span>
                      <span className="text-sm text-gray-600">{result.confidence}% confidence</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{result.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Recommendations:</h5>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h6 className="font-semibold text-yellow-900 text-sm">When to Seek Care:</h6>
                        <p className="text-yellow-800 text-sm">{result.whenToSeekCare}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={resetAnalyzer}
              className="btn-primary flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Analyze Another Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 