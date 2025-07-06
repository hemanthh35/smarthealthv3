'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, Loader2, CheckCircle, AlertTriangle, Info, TrendingUp, Brain } from 'lucide-react'

interface TestReport {
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

export default function TestReportAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<TestReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useFastAnalysis, setUseFastAnalysis] = useState(true)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedFile(file)
        setError(null)
        setAnalysis(null)
      } else {
        setError('Please upload a PDF or image file')
      }
    }
  }

  const analyzeReport = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)

      // Use fast API by default, fallback to detailed API
      const apiEndpoint = useFastAnalysis ? '/api/analyze-test-report-fast' : '/api/analyze-test-report'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze test report')
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze test report. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'low': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SmartHealth Test Report Analysis</h2>
        <p className="text-gray-600">Upload a medical test report for AI-powered analysis using LLaVA</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Medical Report</h3>
        
        {/* Analysis Mode Toggle */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Analysis Mode</h4>
              <p className="text-sm text-gray-600">
                {useFastAnalysis ? 'Fast Analysis (60s timeout)' : 'Detailed Analysis (120s timeout)'}
              </p>
            </div>
            <button
              onClick={() => setUseFastAnalysis(!useFastAnalysis)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useFastAnalysis ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useFastAnalysis ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload a PDF or image of your medical test report for AI analysis
          </p>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Choose File
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <button
                onClick={analyzeReport}
                disabled={isAnalyzing}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {useFastAnalysis ? 'Fast Analyzing...' : 'AI Analyzing Report...'}
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    {useFastAnalysis ? 'Fast Analyze' : 'Analyze with AI'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Error Display */}
          {analysis.error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Error</h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800">{analysis.error}</span>
                </div>
              </div>
            </div>
          )}

          {/* LLaVA Analysis */}
          {analysis.analysis && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-6 h-6 text-purple-600 mr-2" />
                AI Analysis Results
              </h3>

              {/* Simple Text Output */}
              <div className="bg-blue-50 rounded p-6 text-gray-800 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Analysis Summary</h4>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {analysis.analysis.summary}
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h4>
                <p className="text-blue-800 text-sm">
                  This AI analysis is for informational purposes only and should not replace professional medical advice. 
                  The LLaVA AI analysis provides insights but may not be 100% accurate. Always consult with a healthcare provider 
                  for proper diagnosis and treatment based on your medical reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}