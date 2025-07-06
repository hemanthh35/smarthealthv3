'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, Loader2, Download, Eye } from 'lucide-react'

interface TestReport {
  id: string
  name: string
  date: string
  type: string
  results: TestResult[]
  analysis: string
  recommendations: string[]
  severity: 'normal' | 'mild' | 'moderate' | 'severe'
  confidence: number
}

interface TestResult {
  parameter: string
  value: string
  unit: string
  reference: string
  status: 'normal' | 'high' | 'low' | 'critical'
}

export default function TestReportAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<TestReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedFile(file)
        setError(null)
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

      const response = await fetch('/api/analyze-test-report', {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'mild': return 'text-yellow-600 bg-yellow-100'
      case 'moderate': return 'text-orange-600 bg-orange-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600'
      case 'high': return 'text-red-600'
      case 'low': return 'text-blue-600'
      case 'critical': return 'text-red-800 font-bold'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Report Analysis</h2>
        <p className="text-gray-600">Upload your medical test reports for AI-powered analysis and insights</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Test Report</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload your medical test report (PDF or image format)
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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Choose File
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">{uploadedFile.name}</span>
              </div>
              <button
                onClick={analyzeReport}
                disabled={isAnalyzing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Analyze Report
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                {analysis.severity.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                Confidence: {analysis.confidence}%
              </span>
            </div>
          </div>

          {/* Report Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Test Name</h4>
              <p className="text-gray-600">{analysis.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Test Date</h4>
              <p className="text-gray-600">{analysis.date}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Test Type</h4>
              <p className="text-gray-600">{analysis.type}</p>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Test Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Parameter</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Value</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Unit</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Reference</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.results.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{result.parameter}</td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">{result.value}</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-600">{result.unit}</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-600">{result.reference}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">AI Analysis</h4>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-800 leading-relaxed">{analysis.analysis}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Save to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Supported Test Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Test Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Complete Blood Count (CBC)',
            'Comprehensive Metabolic Panel',
            'Lipid Panel',
            'Thyroid Function Tests',
            'Diabetes Screening',
            'Liver Function Tests',
            'Kidney Function Tests',
            'Urinalysis',
            'Electrolyte Panel',
            'Cardiac Markers',
            'Inflammatory Markers',
            'Hormone Tests'
          ].map((testType, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800 font-medium">{testType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 